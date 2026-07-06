# AI CONTEXT

## Purpose

This file gives operating instructions to any AI coding tool working inside this repository, such as ChatGPT, Claude, Cursor, Gemini, Codex, Continue, or similar tools.

Read this file after:
1. `README.md`
2. `PROJECT_STATUS.md`
3. `PROJECT_HANDOFF.md`

---

## How to work in this repo

- Continue from the existing codebase
- Do not rebuild the project from scratch
- Do not replace working pages without a reason
- Keep changes targeted to the requested problem
- Verify assumptions in code before changing architecture
- Prefer minimal, traceable changes over broad rewrites

---

## Main current priorities

1. Fix the hierarchy page because it is not opening
2. Rebuild/refactor the Land page into a proper Excel-driven drill-down flow
3. Keep the keyword search bar on the Land page
4. Replace `Type` with `Arm Type`
5. Replace `Category` with `Weapon Category`
6. Keep `/data` route working
7. Avoid unrelated UI changes

---

## Required workflow before editing

Before changing code:
- inspect Angular routing
- inspect hierarchy page files
- inspect Land page component/template/styles
- inspect `src/app/services/excel-data.service.ts`
- inspect relevant Excel JSON sheet files
- identify whether current UI is truly driven by Excel data or only partially connected

Do not trust previous summaries blindly. Verify actual code and actual runtime behavior.

---

## Rules for implementation

- Excel-derived JSON must remain the source of truth
- Do not reintroduce hardcoded data for integrated sections
- Do not remove the Land page search bar
- Do not remove `/data`
- Do not make unrelated redesign changes
- Keep field mapping explicit and traceable
- Keep code readable and maintainable

---

## What success looks like

A successful update means:
- hierarchy page opens correctly
- Land page visibly behaves like a hierarchical Excel-driven explorer
- labels show `Arm Type` and `Weapon Category`
- deeper drill-down works
- keyword search still works
- `/data` still works
- other acceptable pages remain stable

---

## Output expectations from the AI tool

After making changes, report:
- exact files changed
- what was fixed
- how Excel fields map to UI levels
- whether hierarchy page was tested
- whether `/data` still works
- any remaining issues or assumptions

---

## Recommended startup prompt for an AI tool

Use this prompt when starting in a new tool:

Read `README.md`, `PROJECT_STATUS.md`, `PROJECT_HANDOFF.md`, and `AI_CONTEXT.md` first.

Continue from the existing Angular codebase and do not start from scratch.

Current priorities:
1. Fix the hierarchy page because it is not opening.
2. Rebuild/refactor the Land page so it is visibly driven by Excel-imported JSON data.
3. Keep the existing keyword search bar.
4. Replace `Type` with `Arm Type`.
5. Replace `Category` with `Weapon Category`.
6. Implement drill-down behavior: top-level categories → subcategories → deeper filters like side and unit formation → final results.
7. Keep `/data` working.
8. Avoid unrelated UI changes.

Before changing anything, inspect routes, Land page files, `ExcelDataService`, and relevant JSON sheet files. Verify actual runtime behavior instead of assuming earlier integration summaries are fully accurate.
