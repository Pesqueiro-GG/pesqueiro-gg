# Release to production

This guide shows you how to move tested work from `dev` to demo and production.

## Before you begin

- Everything you're releasing is merged into `dev` and checked on the Dev environment.
- `#alerts-dev` has no unresolved errors from those changes.

## Release

1. Open a pull request from `dev` into `main`. Title it `release: <date>` and list the items it includes.
2. Wait for CI to pass. It runs the full Playwright suite.
3. Get one approval from a teammate.
4. Merge. Don't squash, so `main` keeps the same commits as `dev`.

The deploy workflow then, for production and demo separately:

1. Runs migrations on the database.
2. Deploys the merged commit to the Vercel project.

Follow it under **Actions → Deploy**. Until the demo exists, its job skips with a notice.

## Check the release

1. Open `/api/health` on demo and production. Check that `commit` matches the merge commit. (The health route arrives with [#5](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/5); until then, open the home page.)
2. On production, sign in and open the feed and the album.
3. Watch `#alerts` for 15 minutes.

## If something breaks

- To undo the deploy immediately, use **Instant Rollback** in the Vercel dashboard for the affected project. The database stays migrated, so only roll back to a commit that works with the new schema.
- To fix forward, follow [Fix production with a hotfix](hotfix-production.md).

## After 29 November

Only fixes go into `main` after the feature freeze. Each one still goes through `dev`, or through a hotfix branch for anything urgent.
