import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const port = Number(process.env.PORT || 4174);
const activeAiRequests = new Map();
const AI_REQUEST_LOCK_MS = 30_000;

function loadLocalEnv() {
  for (const file of [".env.local", ".env"]) {
    try {
      const text = readFileSync(join(root, file), "utf8");
      text.split(/\r?\n/).forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
        const index = trimmed.indexOf("=");
        const key = trimmed.slice(0, index).trim();
        const value = trimmed.slice(index + 1).trim().replace(/^['"]|['"]$/g, "");
        if (key && process.env[key] === undefined) process.env[key] = value;
      });
    } catch {
      // Optional local environment files are ignored when absent.
    }
  }
}

loadLocalEnv();

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
};

function sendJson(res, status, payload) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function readRequestBody(req, limit = 12 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.setEncoding("utf8");
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > limit) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
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
  return createHash("sha256").update(String(value || "")).digest("hex").slice(0, 18);
}

function aiRequestKey(body = {}) {
  return String(body.requestKey || [
    body.studentId || body.studentName || "student",
    body.taskId || "task",
    body.questionId || body.templateId || body.questionType || "question",
    hashText(body.answerText || body.answer || ""),
  ].join(":"));
}

function cleanExpiredAiLocks(now = Date.now()) {
  for (const [key, item] of activeAiRequests.entries()) {
    if (now - item.startedAt > AI_REQUEST_LOCK_MS) activeAiRequests.delete(key);
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

function aiServiceStatus() {
  const reviewConfigured = Boolean(process.env.AI_REVIEW_API_KEY || process.env.DEEPSEEK_API_KEY);
  const transcribeConfigured = Boolean(process.env.AI_TRANSCRIBE_API_KEY || process.env.OPENAI_API_KEY);
  return {
    reviewConfigured,
    transcribeConfigured,
    reviewModel: process.env.AI_REVIEW_MODEL || "deepseek-v4-pro",
    reviewBaseUrl: process.env.AI_REVIEW_BASE_URL || "https://api.deepseek.com",
    transcribeModel: process.env.AI_TRANSCRIBE_MODEL || "whisper-1",
    transcribeBaseUrl: process.env.AI_TRANSCRIBE_BASE_URL || "https://api.openai.com/v1",
  };
}

function handleAiStatus(req, res) {
  const status = aiServiceStatus();
  const browserKeyConfigured = Boolean(req.headers["x-ai-review-key"]);
  const reviewConfigured = status.reviewConfigured || browserKeyConfigured;
  sendJson(res, 200, {
    configured: reviewConfigured,
    ok: reviewConfigured,
    ...status,
    reviewConfigured,
    browserKeyConfigured,
    message: reviewConfigured
      ? browserKeyConfigured
        ? "AI review key is configured in this browser for testing."
        : "AI review key is configured on this server."
      : "AI review key is not configured. Set AI_REVIEW_API_KEY or DEEPSEEK_API_KEY.",
  });
}

function buildAiReviewMessages(body = {}) {
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

function aiReviewRequestBody({ model, messages, maxTokens }) {
  const payload = {
    model,
    temperature: 0.1,
    max_tokens: Math.max(120, Math.min(800, safeNumber(maxTokens, 320))),
    stream: false,
    messages,
  };
  return payload;
}

async function requestAiReview({ baseUrl, apiKey, model, messages, maxTokens, timeoutSeconds }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Math.max(8, Math.min(60, safeNumber(timeoutSeconds, 25))) * 1000);
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(aiReviewRequestBody({ model, messages, maxTokens })),
    signal: controller.signal,
  }).finally(() => clearTimeout(timeout));
  const json = await response.json().catch(() => null);
  return {
    ok: response.ok,
    status: response.status,
    json,
    message: json?.error?.message || `AI review request failed with status ${response.status}.`,
  };
}

async function handleAiReview(req, res) {
  const apiKey = process.env.AI_REVIEW_API_KEY || process.env.DEEPSEEK_API_KEY || String(req.headers["x-ai-review-key"] || "");
  if (!apiKey) {
    sendJson(res, 503, {
      configured: false,
      message: "AI review is not configured. Set AI_REVIEW_API_KEY or DEEPSEEK_API_KEY on the server.",
    });
    return;
  }

  const body = JSON.parse(await readRequestBody(req) || "{}");
  const now = Date.now();
  cleanExpiredAiLocks(now);
  const requestKey = aiRequestKey(body);
  const active = activeAiRequests.get(requestKey);
  if (active && now - active.startedAt <= AI_REQUEST_LOCK_MS) {
    sendJson(res, 202, {
      configured: true,
      duplicate: true,
      message: "Feedback generation already in progress.",
      requestKey,
      startedAt: active.startedAt,
    });
    return;
  }
  activeAiRequests.set(requestKey, { startedAt: now });

  const baseUrl = String(body.aiReviewBaseUrl || process.env.AI_REVIEW_BASE_URL || "https://api.deepseek.com").replace(/\/$/, "");
  const model = String(body.aiReviewModel || process.env.AI_REVIEW_MODEL || "deepseek-v4-pro").trim();
  const maxTokens = body.aiReviewMaxTokens || process.env.AI_REVIEW_MAX_TOKENS || 320;
  const timeoutSeconds = body.aiReviewTimeoutSeconds || process.env.AI_REVIEW_TIMEOUT_SECONDS || 25;
  const messages = buildAiReviewMessages(body);
  const timings = {
    apiReceivedAt: now,
    deepseekStartAt: Date.now(),
  };
  try {
    const result = await requestAiReview({ baseUrl, apiKey, model, messages, maxTokens, timeoutSeconds });
    timings.deepseekEndAt = Date.now();

    if (!result.ok) {
      sendJson(res, result.status, {
        configured: true,
        message: result.message,
        reviewModel: model,
        requestKey,
        timings: {
          deepseekMs: timings.deepseekEndAt - timings.deepseekStartAt,
          totalMs: Date.now() - now,
        },
      });
      return;
    }

    const content = result.json?.choices?.[0]?.message?.content || "";
    sendJson(res, 200, {
      configured: true,
      reviewModel: model,
      requestKey,
      timings: {
        deepseekMs: timings.deepseekEndAt - timings.deepseekStartAt,
        totalMs: Date.now() - now,
      },
      review: normalizeReviewPayload(parseJsonObject(content) || {}),
    });
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    sendJson(res, timedOut ? 504 : 500, {
      configured: true,
      message: timedOut ? "AI review timed out. Please try again." : error.message || "AI review request failed.",
      reviewModel: model,
      requestKey,
      timings: {
        totalMs: Date.now() - now,
      },
    });
  } finally {
    activeAiRequests.delete(requestKey);
  }
}

async function handleAiTranscribe(req, res) {
  const apiKey = process.env.AI_TRANSCRIBE_API_KEY || process.env.OPENAI_API_KEY || "";
  if (!apiKey) {
    sendJson(res, 503, {
      configured: false,
      message: "Audio transcription is not configured. Set AI_TRANSCRIBE_API_KEY or OPENAI_API_KEY on the server.",
    });
    return;
  }

  const body = JSON.parse(await readRequestBody(req) || "{}");
  const audioDataUrl = String(body.audioDataUrl || "");
  const match = audioDataUrl.match(/^data:(audio\/[^;,]+)[^,]*,(.+)$/);
  if (!match) {
    sendJson(res, 400, { configured: true, message: "Missing or invalid audio data." });
    return;
  }

  const baseUrl = (process.env.AI_TRANSCRIBE_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
  const model = process.env.AI_TRANSCRIBE_MODEL || "whisper-1";
  const buffer = Buffer.from(match[2], "base64");
  const form = new FormData();
  form.append("file", new Blob([buffer], { type: match[1] }), "answer.webm");
  form.append("model", model);
  form.append("language", "zh");

  const response = await fetch(`${baseUrl}/audio/transcriptions`, {
    method: "POST",
    headers: { authorization: `Bearer ${apiKey}` },
    body: form,
  });
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    sendJson(res, response.status, {
      configured: true,
      message: json?.error?.message || `Transcription request failed with status ${response.status}.`,
    });
    return;
  }
  sendJson(res, 200, {
    configured: true,
    text: String(json?.text || "").trim(),
  });
}

createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://127.0.0.1:${port}`);

    if (req.method === "POST" && url.pathname === "/api/ai-review") {
      await handleAiReview(req, res);
      return;
    }
    if ((req.method === "GET" || req.method === "POST") && url.pathname === "/api/ai-status") {
      handleAiStatus(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/ai-transcribe") {
      await handleAiTranscribe(req, res);
      return;
    }

    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = normalize(join(root, pathname));

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    const body = await readFile(filePath);
    res.writeHead(200, {
      "content-type": types[extname(filePath)] || "application/octet-stream",
      "cache-control": "no-store",
    });
    res.end(body);
  } catch (error) {
    if (String(req.url || "").startsWith("/api/")) {
      sendJson(res, 500, { configured: true, message: error.message || "API request failed." });
      return;
    }
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`MVP running at http://127.0.0.1:${port}/`);
});
