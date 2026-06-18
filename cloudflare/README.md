# Cloudflare deployment

This project uses two Cloudflare pieces:

- Cloudflare Pages hosts the teacher/student website at `https://dg.eduactor.com`.
- Cloudflare Workers hosts the AI review proxy so DeepSeek keys are not exposed in browser code.

## Frontend: Cloudflare Pages

Build output is the repository root static app. If you deploy from the dashboard, use:

- Framework preset: `None`
- Build command: leave empty
- Build output directory: `/`

If you deploy with Wrangler after login:

```bash
npx wrangler pages project create chinese-tiered-diagnostic
npx wrangler pages deploy . --project-name chinese-tiered-diagnostic --branch main
```

After the Pages project exists, add the custom domain `dg.eduactor.com` in Cloudflare Pages. Keep the AI proxy URL in the teacher dashboard pointed at the Worker URL described below.

## AI Review Worker

```bash
cd cloudflare
npx wrangler login
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler deploy
```

If OAuth login fails, use a Cloudflare API token instead:

```bash
cd cloudflare
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
npx wrangler whoami
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler deploy
```

The Worker can also accept a temporary browser test key from the teacher dashboard through the `x-ai-review-key` request header. This is only for local/personal testing. Production should use `wrangler secret put DEEPSEEK_API_KEY` so the DeepSeek key is not exposed to students.

After deployment, copy the Worker URL, for example:

```text
https://tiered-practice-ai-review.<your-subdomain>.workers.dev
```

In the teacher dashboard:

1. Open `系统设置`.
2. Enable `AI 答案检查与反馈 / AI answer review`.
3. Paste the Worker URL into `AI API 代理地址 / AI API proxy URL`.
4. Confirm the DeepSeek settings:
   - `DeepSeek API 地址 / DeepSeek API base URL`: `https://api.deepseek.com`
   - `DeepSeek 模型 / Model`: `deepseek-v4-pro` by default. If your account does not support it, use a supported model such as `deepseek-chat`.
   - `推理强度 / Reasoning effort`: `high`, `medium`, or `low`.
5. Click `检测 API 状态`.
6. Click `保存设置`.

For personal debugging only, the teacher dashboard also has `调试用 DeepSeek API Key / Browser test API key`. You can paste a newly created DeepSeek key there, replace it later, or delete it. Do not use that browser-stored key as the final public deployment security model.

## Audio Transcription

DeepSeek text models do not transcribe audio. If recording questions need automatic text conversion, set a separate speech-to-text secret:

```bash
npx wrangler secret put OPENAI_API_KEY
```

or use another OpenAI-compatible transcription provider and update:

- `AI_TRANSCRIBE_BASE_URL`
- `AI_TRANSCRIBE_MODEL`

## Secrets

Never commit real API keys. Use Cloudflare Worker secrets:

- `DEEPSEEK_API_KEY` or `AI_REVIEW_API_KEY`
- optional `OPENAI_API_KEY` or `AI_TRANSCRIBE_API_KEY`
