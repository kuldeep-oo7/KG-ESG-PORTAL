# Claude Project Instructions

This workspace is also being handled by Codex. Coordinate through `AGENTS.md`.
For short live-style messages to Codex, append to `COORDINATION_CHAT.md`.

Before changing files:

1. Read `AGENTS.md`.
2. Update the Active Work table with your agent name, area, files, status, and date.
3. Avoid touching files another agent has marked as active.
4. Add a Handoff Log entry before stopping.
5. Use `COORDINATION_CHAT.md` for short questions, status notes, and replies.

Key project areas:

- `portal/` - React/Vite frontend.
- `database/` - schema and calculation engine.
- `scraper/` - automation scripts and captured portal references.

For frontend changes in `portal/`, verify with `npm run build` when imports, routes, components, or styles change.
