# Agent tooling

Scripts, Claude Code skills, subagents and hooks that let people and coding agents take board items through the same steps. The scripts work with any tool; the rest is read by [Claude Code](https://code.claude.com) from `.claude/`.

The rules themselves live in [AGENTS.md](../../AGENTS.md) and the [code conventions](code-conventions.md). Nothing here repeats or overrides them.

## Scripts

In `scripts/agent/`. They need Node.js 22 and the GitHub CLI signed in with the `project` scope (`gh auth refresh -s project`).

| Command | Does | Changes anything |
|---|---|---|
| `node scripts/agent/next-item.mjs [--who <login>] [--ws A\|B\|C] [--limit N]` | Lists the items in your workstreams that are started, ready (every dependency Done) or blocked, earliest milestone and Must first | No |
| `node scripts/agent/item.mjs <ID>` | Prints the item's section from `docs/backlog/`, its issue, the board status of each dependency, and the files it mentions | No |
| `node scripts/agent/start-item.mjs <ID> [--force] [--dry-run]` | Updates `dev`, creates `feat/<id>-<slug>` (stories) or `chore/<id>-<slug>` (tasks), assigns you, moves the card to In Progress. Refuses a dirty tree, or unfinished dependencies without `--force` | Git branch, issue, board |
| `node scripts/agent/set-status.mjs <ID> <column>` | Moves the card to Backlog, Todo, In Progress, Review or Done | Board |
| `node scripts/agent/pr-body.mjs [<ID>]` | Prints a pull request body from the template, with `Closes #N` and one evidence line per acceptance criterion. Without an ID, reads it from the branch name | No |
| `npm run check [-- --quick]` | Runs lint, format, message keys, types, unit and integration tests, and prints only the failures. `--quick` skips integration tests | No |

Workstream owners come from `owners` in `scripts/board/seed-backlog.json`. Status comes from the board's **Status** field; an item counts as finished only in **Done**.

## Skills

In `.claude/skills/`. Type the name as a slash command; Claude also loads `work-item` and `handoff` on its own when a request matches.

| Skill | Use it to |
|---|---|
| `/work-item [ID]` | Take an item from choice to an open pull request into `dev`: choose, read, plan, start, build, check, review, draft the pull request. Without an ID, it offers the next ready item |
| `/handoff` | Save the state of the current work to `.claude/handoff/<branch>.md` before `/clear` |
| `/sync-board [sync\|assign\|add <ID>\|move <ID> <ws>]` | Update the GitHub issues from `docs/backlog/`, following [Sync the board](../how-to/sync-the-board.md). Only runs when typed |
| `/release` | Open the `dev` to `main` pull request, watch the deploy and check the live site, following [Release to production](../how-to/release-to-production.md). Only runs when typed |

The skills never push, merge or close issues without the person agreeing in the conversation.

## Subagents

In `.claude/agents/`. Each runs with its own context and model, so the main conversation stays small and routine work runs on a cheaper model.

| Subagent | Model | Edits files | Job |
|---|---|---|---|
| `item-planner` | Opus | No | Reads an item, its docs and the code it touches; returns a plan with tests per criterion and the rules at risk |
| `rules-reviewer` | Opus | No | Checks `git diff dev...HEAD` against "Rules that must never break" |
| `test-writer` | Sonnet | Test files only | Writes and runs the tests an item lists |
| `docs-syncer` | Sonnet | Docs only | Updates reference pages and AGENTS.md "Current state" after a change |
| `board-clerk` | Haiku | No | Board lookups and card moves through the scripts |

The main conversation runs on whatever model the person picks. The judgment calls (planning and the rules check) stay on Opus.

## Hooks

Configured in `.claude/settings.json`; the scripts are in `.claude/hooks/`. They never block or fail a session: on any error they stay silent.

| Hook | When | Does |
|---|---|---|
| `context-watch.mjs` | After each prompt and each tool call | Reads the session transcript and, past the threshold, tells Claude to run `/handoff` and ask the person to `/clear`. After a prompt it reminds every time; between tool calls, only each time the count rises another 25,000 tokens |
| `session-start.mjs` | When a session starts, resumes or is cleared | If `.claude/handoff/<branch>.md` exists and is under 7 days old, gives it to the new session, which checks it against git and continues from its **Next step** |

| Environment variable | Default | Meaning |
|---|---|---|
| `CLAUDE_CONTEXT_WARN_TOKENS` | `300000` | Context size at which Claude saves a handoff at the next stopping point |
| `CLAUDE_CONTEXT_URGENT_TOKENS` | `350000` | Context size at which Claude stops starting new work and saves the handoff right away |

Set them in `.claude/settings.local.json` under `env` to change them for yourself only.

Handoffs are personal and stay out of git (`.claude/handoff/` is in `.gitignore`). Facts the team needs go into `docs/` in the pull request.
