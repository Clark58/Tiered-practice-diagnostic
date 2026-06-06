---
name: tiered-practice-diagnostic
description: Use when continuing the local Chinese tiered practice and diagnostic MVP in this repository, including task pack editing, question templates, class/student registration, student practice flows, analytics/data feedback, GitHub Pages deployment, and handoff-safe Git workflows.
---

# Tiered Practice Diagnostic

## Scope

Use this skill for work in the repo:

`/Users/clark/Library/Mobile Documents/com~apple~CloudDocs/CodexSync/中文分层学习与诊断`

The app is a static MVP for a Chinese teacher:

- Teacher dashboard: task packs, classes/students, data feedback, settings.
- Student preview: enter practice, complete published task packs.
- Data: localStorage during local preview, optional Supabase production configuration.

## Operating Rules

- Do not push GitHub unless the user explicitly confirms in the current task.
- Confirm before deleting files or doing destructive work.
- Prefer scoped fixes in `src/app.js` and `src/styles/main.css`.
- After JavaScript edits, run `npm run check`.
- For meaningful UI changes, verify in the in-app browser at `http://127.0.0.1:4174/`.

## Current URLs

- Local preview: `http://127.0.0.1:4174/`
- GitHub remote: `git@github.com:Clark58/Tiered-practice-diagnostic.git`
- Expected GitHub Pages preview: `https://clark58.github.io/Tiered-practice-diagnostic/`
- Vercel preview: `https://chinese-tiered-diagnostic.vercel.app/`

If GitHub Pages is 404, check `.github/workflows/pages.yml` and repository Pages settings.
If Vercel returns 404, check `vercel.json`; the app must deploy from generated `dist/`, not from `server.mjs`.

## Key Product Decisions

- Sidebar analytics tab label is `数据反馈`.
- Data feedback page heading remains `数据分析`.
- Student rows in task analytics should come from actual attempts for the selected task, not every registered student.
- If no one submitted the task, do not show old student names as incomplete rows.
- Task list table columns: task title, core topic, task brief, question count, actions.
- Task list rows should be sorted by task title.
- Task actions should stay in one row: edit, publish/cancel, delete.
- `保存任务包` belongs at the bottom of the task/question editor, not near the top metadata fields.

## Important Implementation Notes

- `localApi.saveTask()` and `localApi.saveQuestion()` must not let `id: undefined` overwrite generated IDs.
- Local data migrations should repair missing task/question IDs where possible.
- Editing a task should load saved questions into `state.pendingQuestions`.
- Saving a task should save the task first, then save all pending questions with the saved task ID.
- Matching, ordering, candidate selection, and similar student-side option lists should be shuffled with stable deterministic logic.
- Matching options already selected by a student should be disabled/gray so each option can be used once.

## Smoke Test Checklist

Run after significant changes:

1. `npm run check`
2. Open local preview.
3. Student homepage shows local preview entry.
4. Teacher dashboard opens.
5. Task tab shows task list and editor.
6. Click a task `编辑`; saved questions appear in `已保存题目 / Saved questions`.
7. Class tab opens; clicking a class strip reveals register student controls and student table.
8. Data feedback tab opens; active tab is `数据反馈`, heading is `数据分析`, and there are no console errors.

## Handoff File

Read `docs/HANDOFF.md` before continuing a new session. It records the latest completed work, deployment status, and next priorities.
