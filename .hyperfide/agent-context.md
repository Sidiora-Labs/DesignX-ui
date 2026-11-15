# designx-ui — Agent Context

<!-- codify-owned: graph-agent-context v1 -->

_Generated graph context owned by `cg agentmd`. Regenerate with `cg agentmd --write` after significant changes. Workflow instructions remain owned by `cg spec render`._

## Languages

| Language | Files | Lines |
|---|---:|---:|
| typescript | 711 | 82021 |
| javascript | 3 | 734 |

714 source files, 82755 lines total.

## Directory map

- `desktop/` — 6 files, 191 lines (mostly typescript)
- `(root)` — 2 files, 51 lines (mostly typescript)
- `mobile/` — 15 files, 761 lines (mostly typescript)
- `cli/` — 1 files, 357 lines (mostly javascript)
- `src/` — 689 files, 81037 lines (mostly typescript)
- `public/` — 1 files, 358 lines (mostly javascript)

## Build & tooling

- `package.json` — npm/node (scripts: `build` `dev` `start` `typecheck` `preview` `db:generate` `db:migrate` `db:push` `registry`)

## Entry points

- function `main` — `cli/bin/dx-ui.mjs:345`

## HTTP routes

| Method | Pattern | Handler | Where |
|---|---|---|---|
| GET | `/api/health` | — | `src/api/__core/app.ts:39` |
| POST | `/api/webhooks/example` | — | `src/api/index.ts:21` |

## Load-bearing symbols (most referenced)

- `cn` (function, 1021 refs) — `src/web/demos/project-folder.tsx:23`
- `setOpen` (function, 129 refs) — `src/web/components/dx/morph-confirm.tsx:48`
- `set` (function, 124 refs) — `src/web/components/dx/icon-accordion.tsx:27`
- `focus` (function, 89 refs) — `src/web/components/motion/breadcrumb.tsx:289`
- `has` (function, 65 refs) — `cli/bin/dx-ui.mjs:251`
- `ui` (function, 59 refs) — `src/web/docs/catalog.ts:22`
- `setActive` (function, 51 refs) — `src/web/components/charts/price-target-fan/context.ts:36`
- `dx` (function, 37 refs) — `src/web/docs/catalog.ts:29`
- `stop` (function, 35 refs) — `src/web/components/previews/agents/chat-app-usage.tsx:326`
- `monthOf` (function, 33 refs) — `src/web/components/motion/date-range-picker/date-utils.ts:17`
- `parse` (function, 31 refs) — `src/web/components/motion/date-range-picker/date-utils.ts:4`
- `setValue` (function, 31 refs) — `src/web/components/agents/prompt-input.tsx:130`
- `add` (function, 30 refs) — `cli/bin/dx-ui.mjs:266`
- `animate` (function, 29 refs) — `src/web/components/motion/text-scramble.tsx:54`
- `toggle` (function, 28 refs) — `src/web/components/agents/agent-activity/index.tsx:178`

## Querying this codebase

This project is indexed by Codify (SQLite + FTS5, 100% local). Prefer these over grep/file-walking — one call returns definitions, snippets, and call edges:

```bash
cg context <query>      # symbols + snippets + callers/callees + routes
cg search <text>        # instant name/full-text search
cg symbol <name>        # definition + snippet + reference count
cg impact <name> -d 3   # who breaks if this changes
cg routes [filter]      # URL pattern -> handler
cg changes              # impact radius of uncommitted edits
```

All of the above accept `--json`. The graph auto-syncs via `cg watch`, or connect over MCP with `cg mcp-install`.
