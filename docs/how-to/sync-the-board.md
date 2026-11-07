# Sync the board with the backlog files

This guide shows you how to update the GitHub issues from the backlog files in `docs/backlog/`, and how to add a new item.

## Before you begin

- Install the [GitHub CLI](https://cli.github.com) and sign in with the `project` scope:

  ```bash
  gh auth login
  gh auth refresh -h github.com -s project
  ```

- Install Node.js 22.

## Update issue bodies after editing the backlog

1. Edit the item's section in `docs/backlog/<milestone>.md`. Keep its `<!-- item: ID -->` marker.
2. Check that every section matches the seed file:

   ```bash
   node scripts/board/create-board.mjs --dry-run
   ```

3. Copy the sections into the issues:

   ```bash
   node scripts/board/create-board.mjs --repo Pesqueiro-GG/pesqueiro-gg --sync
   ```

The script overwrites every issue body with its section and turns `{{S-09}}` references into issue links.

## Add a new item

1. Add an entry to `items` in `scripts/board/seed-backlog.json` with a new ID, type, milestone, workstream, priority, size, journey, title and a short story or summary.
2. Write its section in the matching `docs/backlog/` file.
3. Create the issue, its labels and its board fields:

   ```bash
   node scripts/board/create-board.mjs --repo Pesqueiro-GG/pesqueiro-gg
   ```

   Existing issues, labels, milestones and fields are reused, not duplicated.

4. Assign it and copy its full text:

   ```bash
   node scripts/board/create-board.mjs --repo Pesqueiro-GG/pesqueiro-gg --assign
   node scripts/board/create-board.mjs --repo Pesqueiro-GG/pesqueiro-gg --sync
   ```

## Change an item's workstream

1. Change `ws` in `seed-backlog.json` and the **Workstream** in the section header.
2. On GitHub, swap the item's `ws:` label and its **Workstream** field on the board.
3. Run `--assign` to add the new owner. Remove the previous assignee by hand.

`--assign` reads owners from `owners` in `seed-backlog.json`. People who haven't accepted the organization invite are skipped; run it again after they accept.
