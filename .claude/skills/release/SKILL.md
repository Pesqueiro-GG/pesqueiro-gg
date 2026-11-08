---
name: release
description: Release dev to production for Pesqueiro.GG - open the dev to main pull request, watch the deploy and check the live site.
disable-model-invocation: true
---

# Release to production

Follow `docs/how-to/release-to-production.md`; read it first, since it is the source of these steps. Production is https://pesqueirogg.vercel.app.

1. Check `dev` is green: `gh run list -R Pesqueiro-GG/pesqueiro-gg --branch dev --limit 3`.
2. List what is new: `git log --oneline --first-parent origin/main..origin/dev`, with the issue each merge closes.
3. Ask the person before opening the pull request. Then: `gh pr create --base main --head dev --title "release: <YYYY-MM-DD>"`, with the list in the body.
4. The person approves and merges with **Create a merge commit**, never squash. Don't merge it yourself.
5. After the merge, watch the deploy: `gh run list -R Pesqueiro-GG/pesqueiro-gg --workflow deploy.yml --branch main --limit 1`, then `gh run watch <id>`.
6. Check `https://pesqueirogg.vercel.app/api/health` returns `status: ok` with the merge commit, and that `/api/debug/boom` returns 404.
7. Report what was released, the run's result and the health check. If something failed, show the failing step's log (`gh run view <id> --log-failed`) and follow "If something breaks" in the how-to.
