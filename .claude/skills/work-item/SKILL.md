---
name: work-item
description: Pick up and deliver a Pesqueiro.GG backlog item (T-xx, S-xx or C-xx, the issues on the project board) from choosing it to an open pull request into dev. Use when asked to work on, start, continue or pick the next board item, issue or ticket.
argument-hint: '[item ID, for example S-09]'
---

# Work on a backlog item

The team's rules are in `AGENTS.md` and `CLAUDE.md`; this skill is the order of work. The scripts in `scripts/agent/` do the mechanical parts, so run them instead of re-deriving their answers.

Item: `$ARGUMENTS` (empty means "choose the next one").

## 1. Choose

- No ID given: run `node scripts/agent/next-item.mjs` and show the "Already started" and "Ready to start" lists. Recommend the first ready item (earliest milestone, Must first) and let the person choose. Finish started items before new ones.
- An ID given: go on.

## 2. Understand

1. Run `node scripts/agent/item.mjs <ID>`. Read the whole item.
2. If a dependency shows ✗, stop and say which, unless the item explains how to stub it.
3. Read `AGENTS.md` "Rules that must never break" and the files under "Read before coding".
4. If the item is unclear, contradicts the docs, or depends on an open decision (AGENTS.md table), ask before writing code. Never guess about privacy, XP rules or visibility.

## 3. Plan

- **Size L, or anything touching `gamification`, logbook privacy or visibility:** run the `item-planner` subagent with the item ID. Show its plan to the person and wait for approval before editing files.
- **Otherwise:** write a short plan in chat (files, migration if any, tests per acceptance criterion) and go on.

## 4. Start

Run `node scripts/agent/start-item.mjs <ID>`. It updates `dev`, creates the branch, assigns the person and moves the card to In Progress. It refuses a dirty tree or unfinished dependencies (`--force` only when the item says how to stub them).

## 5. Build

- Follow `docs/reference/code-conventions.md`: module boundaries, `authedAction`, `Result`, events, i18n in `messages/pt-BR.json` and `messages/en.json`.
- Write the tests the item lists. When there are several, hand the test files to the `test-writer` subagent with the item ID and the files under test.
- Commit in small steps with Conventional Commits, for example `feat(logbook): log a catch with audience`.

## 6. Verify

1. `npm run check` (lint, format, types, unit and integration tests; integration needs `npm run db:start`). Fix and rerun until it passes. Report any failure you can't fix exactly as printed.
2. If the item lists end-to-end tests: `npm run test:e2e`.
3. For UI: check it at phone width (360 to 390 px) and take the screenshots the pull request needs.

## 7. Review

Run the `rules-reviewer` subagent on the branch (`git diff dev...HEAD`). Fix every finding it marks as a violation; mention the rest in the pull request.

If the change alters a fact the docs state (a table, a rule, a variable, a command, the "Current state" section), run the `docs-syncer` subagent.

## 8. Open the pull request

1. Draft the body: `node scripts/agent/pr-body.mjs <ID>` into a file in the scratchpad. Fill each "Evidence:" line with test names, commands or screenshots.
2. Ask the person before pushing. After they agree: push, `gh pr create --base dev --title "<type>(<module>): <summary>" --body-file <file>`, then `node scripts/agent/set-status.mjs <ID> Review`.
3. Don't merge. Merging, closing issues and releases are the person's call.

## Context

If a message says the context is past its limit, finish the current edit, run `/handoff`, and ask the person to run `/clear`. The next session reloads the handoff on its own.
