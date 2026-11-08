---
name: sync-board
description: Copy docs/backlog/*.md into the GitHub issues, add new backlog items, reassign owners or change an item's workstream on the Pesqueiro.GG board.
disable-model-invocation: true
argument-hint: '[sync | assign | add <ID> | move <ID> <A|B|C>]'
---

# Sync the board

Follow `docs/how-to/sync-the-board.md`; it is the source of these steps. Request: `$ARGUMENTS` (empty means `sync`).

Every command here changes GitHub issues that the whole team sees. Show the person what will change, and run it once they agree.

- **sync:** `node scripts/board/create-board.mjs --dry-run`, then `node scripts/board/create-board.mjs --repo Pesqueiro-GG/pesqueiro-gg --sync`.
- **assign:** `node scripts/board/create-board.mjs --repo Pesqueiro-GG/pesqueiro-gg --assign`. It skips people who haven't accepted the organization invite; say who was skipped.
- **add:** follow "Add a new item" in the how-to: seed entry, section in `docs/backlog/`, create, assign, sync.
- **move:** change `ws` in `scripts/board/seed-backlog.json` and the **Workstream** in the section header (in a pull request), then on GitHub swap the item's `ws:` label and its Workstream field, run `--assign`, and remove the previous owner with `gh issue edit <n> --remove-assignee <login>`.

Finish with `node scripts/agent/next-item.mjs --ws <workstream>` for each affected workstream, so the person sees the result.
