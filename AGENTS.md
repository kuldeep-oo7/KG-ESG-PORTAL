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
| Claude | Navbar + Layout design system rewrite | `portal/src/components/Navbar.jsx`, `portal/src/components/Layout.jsx` | COMPLETE | 2026-05-24 |
| Claude | Dashboard redesign + ghgData month abbreviations | `portal/src/pages/Dashboard.jsx`, `portal/src/data/ghgData.js` | VERIFIED | 2026-05-24 |
| Claude | Stub pages (Login, ResetPassword, CSR, Social, Governance) | `portal/src/pages/Login.jsx`, `portal/src/pages/ResetPassword.jsx`, `portal/src/pages/CSR.jsx`, `portal/src/pages/Social.jsx`, `portal/src/pages/Governance.jsx` | COMPLETE | 2026-05-24 |
| Claude | Auth pages full design (Login + ResetPassword) | `portal/src/pages/Login.jsx`, `portal/src/pages/ResetPassword.jsx` | COMPLETE | 2026-05-24 |
| Claude | Help page redesign | `portal/src/pages/Help.jsx` | COMPLETE | 2026-05-24 |
| Codex | Social Add Activity full-page audit | `portal/src/pages/Social.jsx`, `AGENTS.md` | COMPLETE | 2026-05-25 |
| Codex | CSR Add Activity button/functionality audit | `portal/src/pages/CSR.jsx`, `AGENTS.md` | COMPLETE | 2026-05-26 |
| Codex | Public pre-login page + newsletter section | `portal/src/App.jsx`, `portal/src/pages/PublicHome.jsx`, `portal/src/pages/Login.jsx`, `portal/src/components/Navbar.jsx`, `AGENTS.md` | COMPLETE | 2026-05-27 |

## Handoff Log

### 2026-05-27 - Codex public newsletter section

- Checked `E:\HACKATHON\newsletter`; the folder is currently empty, so there are no newsletter PDFs/images to publish yet.
- Read `mockup_a_final (1).html` and restored the four mockup newsletter cards: Seeds of Change, Growing Together, Community in Action, and Sustaining Tomorrow.
- Added real newsletter routes with visual covers and detail pages at `/newsletter` and `/newsletter/:slug`, backed by `portal/src/data/newsletters.js`.
- Updated public Newsletter cards so View opens the newsletter detail page and Open launches the detail route in a new tab.
- Verified `npx eslint src/pages/PublicHome.jsx` passes.
- Verified `npm run build` passes. Vite chunk-size warning remains pre-existing.

### 2026-05-26 - Codex CSR Add Activity controls audit

- Audited visible CSR dashboard and Add Activity wizard controls in `portal/src/pages/CSR.jsx`.
- Wired dashboard buttons/selectors: Dashboard now gives feedback, Monthly/Quarterly chart selector updates state, View All toggles the active projects table.
- Wired wizard actions: Save Draft changes state and shows feedback, active Add Activity tab returns to Activity Details, Submit/Submit Activity submits and closes the overlay.
- Wired NGO partner buttons: View Profile shows verification feedback and Change Partner swaps partner/contact fields.
- Wired upload controls: file input appends selected files to attachment state and each remove button deletes its attachment.
- Added reusable notification feedback for button outcomes.
- Verified `npx eslint src/pages/CSR.jsx` passes.
- Verified `npm run build` passes. Vite chunk-size warning remains pre-existing.
- Browser-checked key controls at `http://127.0.0.1:3001/csr`: Quarterly, View All, Add Activity, Save Draft, View Profile, Change Partner, Upload remove, Submit Activity. No runtime errors.

### 2026-05-25 - Codex CSR Add Activity flow

- Read the local CSR references including `csr 3rd page.png` and `NEW CSR PAGE.png`.
- Updated `portal/src/pages/CSR.jsx` so the Add Activity wizard removes the Project Selection screen and starts directly at Activity Details.
- Remapped the CSR wizard to 8 steps: Activity Details, Location, NGO / Implementation Partner, Timeline, Financials, Beneficiaries, Impact, Uploads & Evidence.
- Updated the sidebar, progress, step headers, CTA text, and Location page numbering to match the new no-project-selection flow.
- Re-audited the CSR wizard after user feedback and replaced the remaining generic NGO, Timeline, and Financials screens with screenshot-style visual summary panels that render immediately with seeded values.
- Fixed CSR Add Activity form behavior: added Month to Activity Details, removed the Activity Details Category field, replaced Road Safety with Rural Dev., added conditional Other Details input, made location summary update from the selected state/district/village/setting, made Timeline dates editable as text with dynamic milestone labels, and saved the selected Activity Type.
- Verified `npx eslint src/pages/CSR.jsx` passes.
- Verified `npm run build` passes. Vite chunk-size warning remains pre-existing.
- Browser-checked the CSR add-activity overlay at `http://127.0.0.1:3001/csr`, including the updated NGO, Timeline, and Financials screens, without runtime errors.

### 2026-05-25 - Codex Social Add Activity flow

- Read the local references `social add activity pages 1.png` through `social add activity pages 6 7 8.png`.
- Updated `portal/src/pages/Social.jsx` from the older 8-step overlay toward the referenced 7-step Add Activity flow: Activity Details, Conducted By, Timeline, Participants, Cost, Impact & Outcome, Documents & Proof.
- Added the Conducted By trainer/agency page with internal/external toggle, trainer cards, add-new-trainer affordance, and contact/fee fields.
- Seeded the add form with the values shown in the screenshots so the preview state resembles the reference.
- Reworked page 1 Activity Details to match `social add activity pages 1.png`: page shell, Save Draft/Submit actions, Activity Wizard progress card, large step header, five activity-type cards, description, mode/location row, and meeting link.
- Audited and reworked the remaining live wizard pages against the reference set:
  - Page 3 Timeline now uses the two-column field/calendar layout with reminders and status progression.
  - Page 4 Participants now uses the reference input row and gender donut.
  - Page 5 Cost now uses total cost, PO reference, and the dark cost snapshot.
  - Page 6 Impact & Outcome now uses outcome notes, assessment selection, and a dark outcome snapshot.
  - Page 7 Documents & Proof now uses the upload drop zone and proof file cards.
- Added step-change scroll reset so switching pages starts at the top of the Add Activity flow.
- Verified `npx eslint src/pages/Social.jsx` passes.
- Verified `npm run build` passes. Vite chunk-size warning remains pre-existing.
- Browser-clicked through all 7 wizard steps with Playwright. No runtime errors; Recharts still emits pre-existing chart sizing warnings.
- Full `npm run lint` still has unrelated pre-existing errors in `Navbar.jsx`, `SiteLayout.jsx`, and `Dashboard.jsx`.

### 2026-05-24 - Claude (auth pages full design)

- Rewrote `portal/src/pages/Login.jsx`: split-panel layout (40/60), left panel with KG mountain SVG logo, email + password inputs with lucide-react icons, eye-toggle, Forgot Password link to `/forgot-password`, submit navigates to `/`. Right panel: dark-green gradient bg, radial overlays, geometric grid SVG watermark, pagination dots, semi-transparent card with "One platform. / Complete ESG." text.
- Rewrote `portal/src/pages/ResetPassword.jsx`: same split-panel, left panel with email input only, submit navigates to `/login`, "Already have an account? Sign In" link. Right panel identical to Login, with second pagination dot active.
- Both pages are standalone (no Layout/Navbar wrapper), use Hanken Grotesk for headings and Inter for body text, and match the design-system colors (#064E3B, #10B981).
- Verified `npm run build` passes (642 ms). Chunk-size advisory is pre-existing.

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

### 2026-05-24 - Claude design system rewrite

- Fully rewrote `portal/src/components/Navbar.jsx`: dark navy `#0B0F18` background, sticky top, mountain SVG logo, "K.GIRDHARLAL" + tagline two-liner, 7-link nav with green underline active state, search pill (dark `#1A2035`), Settings gear, and G avatar (Hanken Grotesk / Inter fonts, lucide-react Search + Settings).
- Fully rewrote `portal/src/components/Layout.jsx`: removed footer entirely, `flex-col min-h-screen` wrapper with sticky Navbar + `flex-1 min-h-screen` main.
- Created 5 stub pages (`Login`, `ResetPassword`, `CSR`, `Social`, `Governance`) that were already imported in `App.jsx` but missing on disk — these caused the build to fail prior to this session.
- Verified `npm run build` passes (651 ms, no errors; chunk-size advisory is pre-existing).
- Remaining: the chunk-size warning (~772 kB) could be addressed with dynamic imports if desired.

### 2026-05-24 - Codex after Claude handoff

- Consumed Claude's scrape completion note and verified fresh `full_map.json`, `api_calls.json`, and `nav_tree.txt`.
- Redacted sensitive auth values from `scraper/output/api_calls.json` while preserving endpoint shapes and previews.
- Accepted handoff for `AssessmentForm.jsx` and `SiteLayout.jsx`.
- Removed remaining lint errors by moving `useGHG` into `portal/src/store/useGHG.js`, moving context value into `portal/src/store/GHGContextValue.js`, and updating imports.
- Verified `npm run lint` passes.
- Verified `npm run build` passes. Vite still warns that the main JS chunk is larger than 500 kB.

### 2026-05-24 - Claude Help page redesign

- Fully rewrote `portal/src/pages/Help.jsx` to match the new K.GIRDHARLAL design.
- Two-column grid layout: left form card, right contact card.
- Form: Subject input, Brief Description textarea (rows=6), drag-drop attachment zone (hidden file input via ref), Submit button (bg-[#064E3B] float-right).
- On submit shows success message "Thank you! We'll get back to you soon." (no auto-reset).
- Contact card: three rows (Email, Phone, Business Hours) each with green circle icon (bg-[#E6F4F1] / text-[#064E3B]).
- Typography: Hanken Grotesk for headings via inline style, Inter body via Tailwind defaults.
- Verified `npm run build` passes (658 ms, no errors; chunk-size advisory is pre-existing).

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
