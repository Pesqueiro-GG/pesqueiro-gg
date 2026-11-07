# Fix production with a hotfix

This guide shows you how to fix an urgent production problem without releasing everything that's on `dev`.

Use a hotfix only when production is broken for users and the fix is small. Otherwise, fix it on `dev` and release normally.

## Fix

1. Branch from `main`:

   ```bash
   git switch main
   git pull
   git switch -c hotfix/<short-description>
   ```

2. Make the smallest change that fixes the problem, with a test that would have caught it.
3. Open a pull request **into `main`**. Explain the problem, the fix and how you tested it.
4. Get one approval and merge when CI passes.
5. Check the fix on production: `/api/health` shows the new commit, and the problem is gone.

## Bring the fix back to `dev`

1. Open a pull request from `main` into `dev`.
2. Resolve conflicts, if any, keeping the fix.
3. Merge when CI passes.

If you skip this step, the next release from `dev` undoes the fix.
