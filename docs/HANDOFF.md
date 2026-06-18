# 中文分层练习与诊断 - 项目交接记录

最后更新：2026-06-16

## 项目定位

这是一个给中文老师试运行的静态 MVP。老师在后台创建分层任务包、登记班级和学生；学生从本地预览入口进入练习；系统保存答题记录并在“数据反馈”页按班级和任务包展示统计。

当前仓库：

- GitHub: `git@github.com:Clark58/Tiered-practice-diagnostic.git`
- 本地目录：`/Users/clark/Library/Mobile Documents/com~apple~CloudDocs/CodexSync/中文分层学习与诊断`
- 本地预览：`http://127.0.0.1:4174/`
- GitHub Pages 预期地址：`https://clark58.github.io/Tiered-practice-diagnostic/`
- Vercel 预览地址：`https://chinese-tiered-diagnostic.vercel.app/`

## 运行与检查

```bash
npm run check
npm run dev
```

项目目前没有独立测试套件。代码检查入口是 `npm run check`，会检查 `src/app.js` 和 `server.mjs` 的 JavaScript 语法。

可选 AI 批改本地配置：

```bash
cp .env.example .env.local
# 填入 AI_REVIEW_API_KEY 或 DEEPSEEK_API_KEY 后重启 npm run dev
```

注意：GitHub Pages 是纯静态托管，不能直接运行 `/api/ai-review` 或 `/api/ai-transcribe`。正式使用 AI 批改时，应把同等代理逻辑部署到 Cloudflare Worker、Vercel Function、Netlify Function 或 Supabase Edge Function，再让前端请求该后端。

Cloudflare Worker 代理已放在 `cloudflare/`：

```bash
cd cloudflare
npx wrangler login
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler deploy
```

如果 Wrangler OAuth 登录失败，可改用 Cloudflare API Token：

```bash
cd cloudflare
export CLOUDFLARE_API_TOKEN="your-cloudflare-api-token"
npx wrangler whoami
npx wrangler secret put DEEPSEEK_API_KEY
npx wrangler deploy
```

部署后把 Worker URL 填入老师后台 `系统设置` 的 `AI API 代理地址 / AI API proxy URL`，打开 `AI 答案检查与反馈` 开关并检测状态。当前版本录音题不发送给 AI，不做自动转文字，由老师听录音后复判。

系统设置里也提供 `调试用 DeepSeek API Key / Browser test API key` 输入框，支持保存、替换、删除。该 key 只适合老师个人浏览器调试；正式公开使用仍应放到 Cloudflare Worker Secret，避免 key 暴露在浏览器端。

浏览器 smoke test 应覆盖：

- 学生首页能进入本地预览。
- 老师后台任务包页能显示任务表和创建/编辑任务区。
- 点击任务表“编辑”后，已保存题目能加载到“已保存题目 / Saved questions”表格。
- 班级页能打开班级条，并显示注册学生、学生列表、删除班级按钮。
- 数据反馈页侧边栏按钮文案是“数据反馈”，点击后显示“数据分析”和学生完成记录表。
- 控制台没有 error。

## 最近已完成的关键修复

- 增加可选 AI 批改层：本地 `server.mjs` 提供 `/api/ai-status` 和 `/api/ai-review` 文本批改代理。
- 老师后台 `系统设置` 增加 `AI 答案检查与反馈` 开关、API 状态检测、AI API 代理地址。开启后所有题型都会先用本地答案规则判断，再交给 DeepSeek 复核并生成英文学习建议；API 不可用时会回退到本地规则。
- 开放文字题优先调用 AI；录音题不转写、不发送给 DeepSeek，始终进入老师复判。
- 增加 `.env.example`，真实 API key 应写入 `.env.local` 或环境变量；`.gitignore` 已忽略真实 `.env` 文件。
- DeepSeek 可用于全部题型的文本复核和英文反馈；录音答案由老师人工确认，避免错误转写影响成绩。
- 修复任务包和题目保存时 `id: undefined` 覆盖新 UUID 的问题。
- 增加本地数据修复逻辑，为旧数据里缺失 ID 的任务和题目补 ID，并尽量重新关联任务与题目。
- 修复点击任务“编辑”后已保存题目不加载的问题。
- 修复“数据反馈”按钮点击后看似无反应的问题：补上缺失的 `latestAttemptsByStudent()`。
- “基础数据”按钮改名为“数据反馈”。
- 数据反馈页学生行只显示实际提交过当前任务的学生；如果没有提交，不再显示旧注册学生姓名。
- 匹配、排序、候选词选择等题型使用稳定打乱顺序，避免学生端左右答案仍按老师输入顺序对应。
- 匹配题中已被选择的右侧选项会变灰并禁用，确保每个选项只能使用一次。
- 优化句子排序/拼句答题框视觉样式。
- 添加任务删除按钮并保持操作按钮在一行。
- 任务包列表按任务标题排序，便于按单元/课程序号查找。

## 当前题型与编辑逻辑

四大类题型：

- 词汇基础
- 语法掌控
- 句子拼装
- 自由表达

老师在“题目编辑器”中选择大类和具体题型后，表单会自动调整模板。保存单个题目后进入“已保存题目 / Saved questions”；最底部“保存任务包”负责保存任务包本身以及当前题目集合。

注意：不要把“保存任务包”按钮移到顶部，用户明确要求它在题目编辑器下方。

## 数据与部署

本地试运行使用 `localStorage`。生产或正式部署后可在“系统设置”里配置 Supabase。

GitHub Pages 工作流文件是 `.github/workflows/pages.yml`，会在推送 `main` 后部署静态文件：

- `index.html`
- `src/`
- `public/`
- `supabase/`

如果 Pages 地址返回 404，先检查 GitHub 仓库 Settings -> Pages 是否允许 GitHub Actions 部署，或查看 Actions 的 `Deploy GitHub Pages` 工作流是否成功。

Vercel 手动部署已链接到项目 `chinese-tiered-diagnostic`。`vercel.json` 明确把静态文件复制到 `dist/`，避免 Vercel 把 `server.mjs` 当成生产入口。

## Git 规则

- 用户要求：不要自动推送 GitHub，除非本轮明确确认。
- 删除文件或破坏性任务前必须再次确认。
- 本轮用户已确认可以推送和创建预览部署。

## 下一步优先事项

- 验证 GitHub Pages 工作流是否成功生成可访问 URL。
- 如果 GitHub Pages 因仓库设置失败，需要用户在 GitHub Settings -> Pages 中选择 GitHub Actions，或使用 Netlify 登录后新建独立站点。
- 后续继续改 UI 时，优先保持老师工作台紧凑、清晰，不做营销页风格。
- 每次较大改动后跑 `npm run check` 并做浏览器 smoke test。
