# Multi-Agent Coordination

This workspace may be edited by more than one AI coding agent. Read this file before making changes and update it before handing off work.

For quick back-and-forth messages between agents, use `COORDINATION_CHAT.md`. Keep `AGENTS.md` for active ownership, rules, and handoff summaries.

## Current Workspace

- `portal/` - React/Vite frontend for the ESG/GHG portal.
- `database/` - SQL schema and calculation engine.
- `scraper/` - Playwright/scraper scripts and captured reference outputs.
- Root PDFs, spreadsheets, screenshots, and `FIGMA.txt` are source/reference materials.

## Coordination Rules

1. Before editing, check the file you are about to touch and look for recent changes in this file.
2. Keep ownership narrow: claim the files or feature area you are actively editing in the Active Work section.
3. Do not overwrite another agent's active files unless the user explicitly asks for it.
4. Do not edit generated folders unless the task requires it: `portal/node_modules/`, `portal/dist/`, and large scraper screenshot output folders.
5. Prefer the existing stack and patterns: React 19, Vite, Tailwind, lucide-react, Recharts.
6. Verify relevant changes before handoff. For `portal/`, use `npm run build` when frontend behavior or imports changed, and `npm run lint` when lint-sensitive code changed.
7. Leave a concise handoff entry with files changed, commands run, remaining risks, and next recommended step.
8. For live-style coordination, append short timestamped messages to `COORDINATION_CHAT.md`.

## Active Work

| Agent | Area | Files | Status | Updated |
| --- | --- | --- | --- | --- |
| Codex | Coordination setup | `AGENTS.md`, `CLAUDE.md`, `COORDINATION_CHAT.md` | Complete | 2026-05-24 |
| Claude | Scraper full reverse-engineering | `scraper/scrape_full_map.py`, `scraper/output/*` | IN PROGRESS | 2026-05-24 |
| Codex | Frontend pages + database | `portal/src/App.jsx`, `portal/src/pages/*`, `portal/src/components/AssessmentForm.jsx`, `portal/src/components/SiteLayout.jsx`, `portal/src/data/*`, `portal/src/lib/*`, `portal/src/store/*`, `database/*` | VERIFIED | 2026-05-24 |
| Claude | Scraper full reverse-engineering handoff | `scraper/output/full_map.json`, `scraper/output/api_calls.json`, `scraper/output/nav_tree.txt`, `scraper/output/screenshots_full/` | COMPLETE | 2026-05-24 |

## Handoff Log

### 2026-05-24 - Codex

- Added shared coordination protocol for Codex and Claude.
- Observed no `.git` repository at the workspace root, `portal/`, or `scraper/`, so agents need to be extra careful with manual edits.
- Existing `.claude/settings.local.json` grants Claude broad local commands, but there was no project-level coordination note yet.
- Coordination setup is complete. Next agent should claim a focused work area before editing.
- Added `COORDINATION_CHAT.md` for short agent-to-agent messages.
- Tightened the parallel split so Codex does not claim `AssessmentForm.jsx`, `SiteLayout.jsx`, or scraper outputs.

### 2026-05-24 - Codex frontend/database pass

- Updated `portal/src/data/ghgData.js` so Scope 3 dashboard percentages are derived from actual Scope 3 entries instead of stale hardcoded values.
- Updated `portal/src/pages/Dashboard.jsx` to use the derived Scope 3 total and removed local lint errors from unused year setters.
- Updated `database/schema.sql` with canonical organization, site, and reporting-period seed rows so later target inserts have valid foreign-key references on a fresh database.
- Verified `npm run build` passes in `portal/`.
- Cleaned up unclaimed lint issues in `Navbar.jsx`, `EnergyAnalytics.jsx`, `Scope3EmployeeCommute.jsx`, and `SiteReports.jsx`.
- `npm run lint` now has 5 remaining errors in `AssessmentForm.jsx`, `SiteLayout.jsx`, and `GHGContext.jsx`. The first two are Claude-owned; fixing `GHGContext.jsx` cleanly requires updating imports in those Claude-owned files.
- Waiting for fresh `scraper/output/full_map.json`, `scraper/output/api_calls.json`, and `scraper/output/nav_tree.txt`.

### 2026-05-24 - Codex after Claude handoff

- Consumed Claude's scrape completion note and verified fresh `full_map.json`, `api_calls.json`, and `nav_tree.txt`.
- Redacted sensitive auth values from `scraper/output/api_calls.json` while preserving endpoint shapes and previews.
- Accepted handoff for `AssessmentForm.jsx` and `SiteLayout.jsx`.
- Removed remaining lint errors by moving `useGHG` into `portal/src/store/useGHG.js`, moving context value into `portal/src/store/GHGContextValue.js`, and updating imports.
- Verified `npm run lint` passes.
- Verified `npm run build` passes. Vite still warns that the main JS chunk is larger than 500 kB.

## Suggested Work Split

- Claude owns `scraper/`: reverse-engineer the live esgtech.ai portal, including UI flowchart, API endpoints, dropdown cascades, and screenshots.
- Codex owns frontend pages/data/lib in `portal/src/` and `database/`: build the React portal and DB/calculation foundation from PDFs, existing `ghgData.js`, and current app structure.
- Claude owns `AssessmentForm.jsx` and `SiteLayout.jsx` after scrape output is ready, because those need the exact field map and route structure.
- If both need the same shared file, claim it in Active Work first.

## Handoff from Claude to Codex

After `scraper/output/full_map.json` exists and is freshly updated:

- Each top-level key under `top_pages` = one React route and page component reference.
- Each `assessment_forms[x].add_form.cascading_dropdowns` = the exact dropdown dependency tree for each scope's data entry form.
- Each entry in `api_calls.json` = one API endpoint to implement in the backend.
- `screenshots_full/` = visual reference for every UI state.
