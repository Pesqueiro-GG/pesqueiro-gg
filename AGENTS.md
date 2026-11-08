# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Codex, Copilot) working in this repository. Humans read [CONTRIBUTING.md](CONTRIBUTING.md); the rules are the same.

## What this project is

Pesqueiro.GG is a gamified social network for recreational anglers in Brazil, built for Hack Brasil 2026. Read [the product explanation](docs/explanation/product.md) before changing behavior, and [the architecture explanation](docs/explanation/architecture.md) before changing structure. Domain and Portuguese terms (pesque-pague, figurinha, piracema, cargo…) are in the [glossary](docs/reference/glossary.md).

## Current state

Keep this section true: update it in the pull request that changes it.

- **Exists:** the app skeleton (Next.js 16, TypeScript 6 strict, the ten empty modules, `src/shared/` errors, results and `authedAction`), the module-boundary lint rule, Vitest and Playwright, documentation (`docs/`), design source files (`design/`), the backlog and board script.
- **Database:** local Supabase (Docker, ports 553xx), Drizzle migrations in `drizzle/` applied by `scripts/db/migrate.ts`, the `app_server` role and `app_enable_access()`, and `src/shared/db/client.ts` (`db()`, `withTransaction`). No application tables yet.
- **Delivery:** CI on every pull request (`.github/workflows/ci.yml`, job `ci`); `deploy.yml` migrates and then deploys `dev` to Dev and `main` to production (and demo, once it exists). Dev is https://pesqueiro-dev.vercel.app and production is https://pesqueirogg.vercel.app. `dev` is the default branch and is protected; see [Environments](docs/reference/environments.md#how-a-change-is-deployed).
- **Observability:** Sentry (errors, traces, logs) with every personal data category off and a scrubber on everything sent; `log` and `withSpan` from `@/shared/observability`; `/api/health`, checked after every deploy; `/api/debug/boom` on local and dev only. See [Observability](docs/reference/observability.md).
- **Agent tooling:** `scripts/agent/` (next item, item details, start, card status, pull request body, `npm run check`), and for Claude Code the skills, subagents and context hooks in `.claude/`. See [Agent tooling](docs/reference/agent-tooling.md).
- **Not yet:** login ([#9](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/9)), styling ([#6](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/6)), languages ([#7](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/7)). `authedAction` answers `UNAUTHENTICATED` until login exists, runs handlers in a transaction when built with `{ tx: true }`, and ignores `rateLimit` until #41.

### Commands

| Command | Does |
|---|---|
| `npm ci` | Installs the pinned dependencies (Node 22.12 or later; see `.nvmrc`) |
| `npm run dev` | Starts the app at http://localhost:3000 |
| `npm run lint` | ESLint, including the module-boundary rule |
| `npm run typecheck` | TypeScript, no output files |
| `npm test` | Unit tests (Vitest) |
| `npm run db:start` / `db:stop` / `db:status` | Starts, stops or shows the local Supabase (needs Docker running) |
| `npm run db:migrate` | Applies migrations (local by default; see the cloud how-to) |
| `npm run db:generate` | Generates a migration from changes to `schema.ts` files |
| `npm run db:check` | Confirms `DATABASE_URL` connects as `app_server` |
| `npm run test:int` | Integration tests against the local Supabase (applies migrations first) |
| `npm run test:e2e` | Builds, starts the app and runs Playwright (run `npx playwright install chromium` once first) |
| `npm run check` | Lint, format, types, unit and integration tests in one run, printing only failures (`-- --quick` skips integration) |
| `npm run format` | Prettier on code (Markdown is left as written) |
| `npm run build` | Production build |

Next.js 16 notes: the request-intercepting file is `src/proxy.ts` (the `middleware` name is deprecated), and `next build` no longer runs the linter, so CI runs `npm run lint` itself. The version-specific Next.js docs ship in `node_modules/next/dist/docs/`; prefer them over memory.

## Open decisions

Don't decide these yourself. If your item depends on one, say so in the pull request and use the stated fallback.

| Decision | Owner | Fallback until decided |
|---|---|---|
| Domain name (needed for email sign-up through Resend) | Team | Google login only; email sign-up limited to team addresses |
| Final album sticker design | Amanda | `design/components/Sticker.md` and the prototype |
| Track fit confirmed by the organizers | Amanda | Culture & Creative Economy framing, as in the product docs |

## Where things are

| You need | Look in |
|---|---|
| What to build | The issue, whose source is `docs/backlog/<milestone>.md` |
| How code is organized and written | [docs/reference/code-conventions.md](docs/reference/code-conventions.md) |
| Tables and columns | [docs/reference/data-model.md](docs/reference/data-model.md) |
| XP numbers, levels, rarity, challenges | [docs/reference/xp-and-levels.md](docs/reference/xp-and-levels.md) |
| Colors, type, components, copy voice | [`design/`](design/README.md) (source) and [docs/reference/design-system.md](docs/reference/design-system.md) (summary) |
| Environments, branches, variables | [docs/reference/environments.md](docs/reference/environments.md) |
| Why something is the way it is | [docs/explanation/](docs/explanation/) and its [decision records](docs/explanation/decisions/README.md) |

When the docs and an issue disagree, the `reference` docs win for facts and the issue wins for scope. Fix whichever is wrong in your pull request.

## How to work

1. Work comes from an issue on the [project board](https://github.com/orgs/Pesqueiro-GG/projects/1). Its text lives in `docs/backlog/` (the issue body is a synced copy). Read the whole item and every doc it links before writing code.
2. Check the item's **Depends on** list. Don't build on something that isn't merged into `dev` unless the item says how to stub it.
3. Branch from `dev` (`feat/<id>-<slug>`), open the pull request into `dev`, write `Closes #<issue>`.
4. Meet every acceptance criterion and the definition of done in [CONTRIBUTING.md](CONTRIBUTING.md#definition-of-done). Put test evidence in the pull request.
5. If the item is unclear or contradicts the docs, stop and ask. Don't guess about privacy, XP rules or visibility.

## Rules that must never break

- **Exact coordinates** exist only in the owner's view of a catch (`OwnCatch`). Public types have no coordinate fields. Never add coordinates to logs, errors, traces, feeds, link previews or anything another person can receive.
- **Visibility:** content a viewer may not see returns `NOT_FOUND`, never `FORBIDDEN`. Every post read goes through `social.hydratePosts`, which re-checks visibility.
- **XP ledger:** `xp_events` is append-only. Never update or delete its rows; the gamification engine replays and appends the difference. Social actions (posts, comments, reactions, follows) never award XP.
- **Module boundaries:** import another module only through its `index.ts`. Write only to tables your module owns.
- **The browser never queries the database.** All reads and writes go through server code.
- **No personal data in logs:** log internal user IDs only.
- **Every visible string** goes in `messages/pt-BR.json` and `messages/en.json`.
- **No code from the old Pesqueiro.GG repository** may be copied here (hackathon rule). Write everything new.

## Conventions

The full conventions (code layout, server actions, events, database, i18n, UI, tests, error codes) are in [docs/reference/code-conventions.md](docs/reference/code-conventions.md). Read it before your first change.

## When you're done

- Every acceptance criterion has evidence in the pull request (test names, screenshots at phone width).
- You ran lint, types and the tests, and reported any failure as it was.
- If you changed a fact the docs state (a table, a rule, a variable, a command), the matching `docs/reference/` page and the **Current state** section above are updated in the same pull request.
