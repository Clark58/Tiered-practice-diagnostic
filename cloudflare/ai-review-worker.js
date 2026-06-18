const DEFAULT_REVIEW_BASE_URL = "https://api.deepseek.com";
const DEFAULT_REVIEW_MODEL = "deepseek-v4-pro";
const DEFAULT_TRANSCRIBE_BASE_URL = "https://api.openai.com/v1";
const DEFAULT_TRANSCRIBE_MODEL = "whisper-1";
const ACTIVE_REVIEW_REQUESTS = new Map();
const REVIEW_REQUEST_LOCK_MS = 30_000;

function jsonResponse(payload, status = 200, headers = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function corsHeaders(request, env) {
  const origin = request.headers.get("origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : allowed.length ? allowed[0] : "*";
  return {
    "access-control-allow-origin": allowOrigin,
    "access-control-allow-methods": "GET,POST,OPTIONS",
    "access-control-allow-headers": "content-type,x-ai-review-key",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function parseJsonObject(text) {
  const raw = String(text || "").trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function hashText(value) {
  let hash = 0;
  const text = String(value || "");
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function reviewRequestKey(body = {}) {
  return String(body.requestKey || [
    body.studentId || body.studentName || "student",
    body.taskId || "task",
    body.questionId || body.templateId || body.questionType || "question",
    hashText(body.answerText || body.answer || ""),
  ].join(":"));
}

function cleanExpiredReviewLocks(now = Date.now()) {
  for (const [key, item] of ACTIVE_REVIEW_REQUESTS.entries()) {
    if (now - item.startedAt > REVIEW_REQUEST_LOCK_MS) ACTIVE_REVIEW_REQUESTS.delete(key);
  }
}

function normalizeReviewPayload(payload = {}) {
  const allowed = new Set(["correct", "partial", "incorrect", "needs_review"]);
  const status = allowed.has(payload.status) ? payload.status : "needs_review";
  const score = Math.max(0, Math.min(1, safeNumber(payload.score, status === "correct" ? 1 : status === "partial" ? 0.5 : 0)));
  return {
    status,
    score,
    confidence: Math.max(0, Math.min(1, safeNumber(payload.confidence, 0))),
    feedback: String(payload.feedback || "AI could not produce a clear review. Teacher confirmation is needed.").slice(0, 600),
    suggestion: String(payload.suggestion || "").slice(0, 600),
  };
}

function serviceStatus(env) {
  const reviewConfigured = Boolean(env.AI_REVIEW_API_KEY || env.DEEPSEEK_API_KEY);
  const transcribeConfigured = Boolean(env.AI_TRANSCRIBE_API_KEY || env.OPENAI_API_KEY);
  return {
    reviewConfigured,
    transcribeConfigured,
    reviewModel: env.AI_REVIEW_MODEL || DEFAULT_REVIEW_MODEL,
    reviewBaseUrl: env.AI_REVIEW_BASE_URL || DEFAULT_REVIEW_BASE_URL,
    transcribeModel: env.AI_TRANSCRIBE_MODEL || DEFAULT_TRANSCRIBE_MODEL,
    transcribeBaseUrl: env.AI_TRANSCRIBE_BASE_URL || DEFAULT_TRANSCRIBE_BASE_URL,
  };
}

async function handleStatus(request, env) {
  const status = serviceStatus(env);
  const browserKeyConfigured = Boolean(request.headers.get("x-ai-review-key"));
  const reviewConfigured = status.reviewConfigured || browserKeyConfigured;
  return jsonResponse({
    configured: reviewConfigured,
    ok: reviewConfigured,
    ...status,
    reviewConfigured,
    browserKeyConfigured,
    message: reviewConfigured
      ? browserKeyConfigured
        ? "AI review key is configured in this browser for testing."
        : "AI review key is configured on this Worker."
      : "AI review key is not configured. Set AI_REVIEW_API_KEY or DEEPSEEK_API_KEY as a Worker secret.",
  }, 200, corsHeaders(request, env));
}

function buildReviewMessages(body = {}) {
  return [
    {
      role: "system",
      content: [
        "You are a careful Chinese-language teacher grading novice student answers.",
        "Judge whether the student's answer fits the teacher's prompt, expected answer, and question type.",
        "For objective questions, use expectedAnswer as the answer key, while allowing obvious equivalent wording only when the task permits it.",
        "For Chinese open responses, check whether the answer is meaningful Chinese and actually answers the prompt.",
        "Return compact JSON only with keys: status, score, confidence, feedback, suggestion.",
        "status must be one of correct, partial, incorrect, needs_review.",
        "score must be 1, 0.5, or 0.",
        "Use needs_review when the answer is audio without transcript, too ambiguous, or requires teacher judgment.",
        "Feedback and suggestion must be short, student-friendly English. Include simple Chinese examples only when helpful.",
        "Use localResult as a reference, but correct it if the teacher answer key and student answer show a clearer outcome.",
      ].join(" "),
    },
    {
      role: "user",
      content: JSON.stringify({
        questionType: body.questionType || "open_response",
        templateId: body.templateId || "",
        teacherPrompt: body.prompt || "",
        displayedQuestion: body.questionPrompt || "",
        expectedAnswer: body.correctAnswer ?? body.expectedAnswer ?? "",
        options: body.options ?? "",
        studentAnswer: body.answerText || body.answer || "",
        localResult: body.localResult ?? null,
      }),
    },
  ];
}

function reviewRequestBody({ model, messages, maxTokens }) {
  const payload = {
    model,
    temperature: 0.1,
    max_tokens: Math.max(120, Math.min(800, safeNumber(maxTokens, 320))),
    stream: false,
    messages,
  };
  return payload;
}

async function requestReview({ baseUrl, apiKey, model, messages, maxTokens, timeoutSeconds }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.max(8, Math.min(60, safeNumber(timeoutSeconds, 25))) * 1000);
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(reviewRequestBody({ model, messages, maxTokens })),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
  const json = await response.json().catch(() => null);
  return {
    ok: response.ok,
    status: response.status,
    json,
    message: json?.error?.message
      || (response.status === 401 || response.status === 403
        ? "DeepSeek rejected the API key. Create a new full API key and save it as the Worker secret."
        : `AI review request failed with status ${response.status}.`),
  };
}

async function handleReview(request, env) {
  const browserKey = request.headers.get("x-ai-review-key") || "";
  const apiKey = browserKey || env.AI_REVIEW_API_KEY || env.DEEPSEEK_API_KEY || "";
  if (!apiKey) {
    return jsonResponse({
      configured: false,
      message: "AI review is not configured. Set AI_REVIEW_API_KEY or DEEPSEEK_API_KEY as a Worker secret.",
    }, 503, corsHeaders(request, env));
  }

  const body = await request.json().catch(() => ({}));
  const now = Date.now();
  cleanExpiredReviewLocks(now);
  const requestKey = reviewRequestKey(body);
  const active = ACTIVE_REVIEW_REQUESTS.get(requestKey);
  if (active && now - active.startedAt <= REVIEW_REQUEST_LOCK_MS) {
    return jsonResponse({
      configured: true,
      duplicate: true,
      message: "Feedback generation already in progress.",
      requestKey,
      startedAt: active.startedAt,
    }, 202, corsHeaders(request, env));
  }
  ACTIVE_REVIEW_REQUESTS.set(requestKey, { startedAt: now });

  const baseUrl = String(body.aiReviewBaseUrl || env.AI_REVIEW_BASE_URL || DEFAULT_REVIEW_BASE_URL).replace(/\/$/, "");
  const model = String(body.aiReviewModel || env.AI_REVIEW_MODEL || DEFAULT_REVIEW_MODEL).trim();
  const maxTokens = body.aiReviewMaxTokens || env.AI_REVIEW_MAX_TOKENS || 320;
  const timeoutSeconds = body.aiReviewTimeoutSeconds || env.AI_REVIEW_TIMEOUT_SECONDS || 25;
  const messages = buildReviewMessages(body);
  const deepseekStartAt = Date.now();
  try {
    const result = await requestReview({ baseUrl, apiKey, model, messages, maxTokens, timeoutSeconds });
    const deepseekEndAt = Date.now();

    if (!result.ok) {
      return jsonResponse({
        configured: true,
        message: result.message,
        reviewModel: model,
        requestKey,
        timings: {
          deepseekMs: deepseekEndAt - deepseekStartAt,
          totalMs: Date.now() - now,
        },
      }, result.status, corsHeaders(request, env));
    }

    const content = result.json?.choices?.[0]?.message?.content || "";
    return jsonResponse({
      configured: true,
      reviewModel: model,
      requestKey,
      timings: {
        deepseekMs: deepseekEndAt - deepseekStartAt,
        totalMs: Date.now() - now,
      },
      review: normalizeReviewPayload(parseJsonObject(content) || {}),
    }, 200, corsHeaders(request, env));
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    return jsonResponse({
      configured: true,
      message: timedOut ? "AI review timed out. Please try again." : error?.message || "AI review request failed.",
      reviewModel: model,
      requestKey,
      timings: {
        totalMs: Date.now() - now,
      },
    }, timedOut ? 504 : 500, corsHeaders(request, env));
  } finally {
    ACTIVE_REVIEW_REQUESTS.delete(requestKey);
  }
}

async function audioDataUrlToBlob(audioDataUrl) {
  const match = String(audioDataUrl || "").match(/^data:(audio\/[^;,]+)[^,]*,(.+)$/);
  if (!match) return null;
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: match[1] });
}

async function handleTranscribe(request, env) {
  const apiKey = env.AI_TRANSCRIBE_API_KEY || env.OPENAI_API_KEY || "";
  if (!apiKey) {
    return jsonResponse({
      configured: false,
      message: "Audio transcription is not configured. Set AI_TRANSCRIBE_API_KEY or OPENAI_API_KEY as a Worker secret.",
    }, 503, corsHeaders(request, env));
  }

  const body = await request.json().catch(() => ({}));
  const blob = await audioDataUrlToBlob(body.audioDataUrl);
  if (!blob) {
    return jsonResponse({ configured: true, message: "Missing or invalid audio data." }, 400, corsHeaders(request, env));
  }

  const baseUrl = String(env.AI_TRANSCRIBE_BASE_URL || DEFAULT_TRANSCRIBE_BASE_URL).replace(/\/$/, "");
  const form = new FormData();
  form.append("file", blob, "answer.webm");
  form.append("model", env.AI_TRANSCRIBE_MODEL || DEFAULT_TRANSCRIBE_MODEL);
  form.append("language", "zh");

  const response = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}` },
    body: form,
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    return jsonResponse({
      configured: true,
      message: json?.error?.message || `Transcription request failed with status ${response.status}.`,
    }, response.status, corsHeaders(request, env));
  }
  return jsonResponse({ configured: true, text: String(json?.text || "").trim() }, 200, corsHeaders(request, env));
}

export default {
  async fetch(request, env) {
    const headers = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });

    const url = new URL(request.url);
    try {
      if ((request.method === "GET" || request.method === "POST") && url.pathname === "/api/ai-status") {
        return handleStatus(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/ai-review") {
        return handleReview(request, env);
      }
      if (request.method === "POST" && url.pathname === "/api/ai-transcribe") {
        return handleTranscribe(request, env);
      }
      return jsonResponse({ message: "Not found" }, 404, headers);
    } catch (error) {
      return jsonResponse({ configured: true, message: error?.message || "Worker request failed." }, 500, headers);
    }
  },
};
