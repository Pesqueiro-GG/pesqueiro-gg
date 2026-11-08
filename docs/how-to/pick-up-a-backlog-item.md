# Pick up a backlog item

This guide shows you how to take an item from the board and turn it into a merged pull request.

## Before you begin

- You can push branches to [Pesqueiro-GG/pesqueiro-gg](https://github.com/Pesqueiro-GG/pesqueiro-gg).
- You've read the [code conventions](../reference/code-conventions.md).

## Choose an item

1. Open the [project board](https://github.com/orgs/Pesqueiro-GG/projects/1) and filter by your workstream.
2. Pick an item in **Todo**. Prefer the earliest milestone and Must over Should.
3. Check its **Depends on** list. Every dependency must be in **Done**, unless the item explains how to stub it.
4. Assign yourself if you aren't already, and move the item to **In Progress**.

`node scripts/agent/next-item.mjs` does steps 1 to 3: it lists the items in your workstreams whose dependencies are all Done. `node scripts/agent/start-item.mjs <ID>` does step 4 and the branch below. See [Agent tooling](../reference/agent-tooling.md).

## Understand the item

1. Read the whole item: story or summary, context, scope, implementation notes, acceptance criteria and tests.
2. Read every doc the item links.
3. If something is unclear, or contradicts the docs, ask in the issue before writing code. Don't guess about privacy, XP rules or visibility.

The item's text lives in `docs/backlog/<milestone>.md`. If you find a mistake in it, fix it there in your pull request; the issue body updates on the next sync.

## Build it

1. Update `dev` and branch from it:

   ```bash
   git switch dev
   git pull
   git switch -c feat/s-09-log-a-catch
   ```

   Use `feat/` for stories, `chore/` for tasks, `fix/` for fixes and `docs/` for documentation.

2. Write the tests the item lists alongside the code.
3. Run the checks locally:

   ```bash
   npm run lint
   npm run typecheck
   npm test
   npm run test:int
   ```

   Or run them all at once with `npm run check`, which prints only what failed.

4. Commit with [Conventional Commits](https://www.conventionalcommits.org), for example `feat(logbook): log a catch with audience`.

## Open the pull request

1. Push the branch and open a pull request **into `dev`**.
2. Fill in the template. Write `Closes #<issue number>` on the first line.
3. Add evidence for each acceptance criterion: test names, and screenshots at phone width for UI.
4. Move the item to **Review**.

## Finish

1. Address review comments.
2. Merge when CI is green.
3. After the deploy, check the change on the Dev environment.
4. Move the item to **Done**. Then check whether any item it blocked can move from **Backlog** to **Todo**.
