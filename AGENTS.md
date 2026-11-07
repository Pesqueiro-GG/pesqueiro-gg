# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Codex, Copilot) working in this repository. Humans read [CONTRIBUTING.md](CONTRIBUTING.md); the rules are the same.

## What this project is

Pesqueiro.GG is a gamified social network for recreational anglers in Brazil, built for Hack Brasil 2026. Read [the product explanation](docs/explanation/product.md) before changing behavior, and [the architecture explanation](docs/explanation/architecture.md) before changing structure.

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

## Useful references

- Data model: [docs/reference/data-model.md](docs/reference/data-model.md)
- XP rules, levels and rarity: [docs/reference/xp-and-levels.md](docs/reference/xp-and-levels.md)
- Environments, branches and environment variables: [docs/reference/environments.md](docs/reference/environments.md)
- Design tokens and components: [docs/reference/design-system.md](docs/reference/design-system.md)
- Decisions and their reasons: [docs/explanation/decisions/](docs/explanation/decisions/)
