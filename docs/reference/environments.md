# Environments

Branches, environments, where each one's data lives, and the environment variables the app reads.

## Branches and environments

| Branch | Environment | Database | Deploys when | Used for |
|---|---|---|---|---|
| feature branches | Local | Supabase CLI in Docker, ports 553xx (so it can run next to other local Supabase projects) | — | Development |
| pull requests | CI | Supabase CLI in GitHub Actions | Every push | Lint, types, tests, Playwright |
| pull requests | Preview | `pesqueiro-dev` | Every push (Vercel preview of the `pesqueiro-dev` project) | Clicking through a change |
| `dev` | Dev | `pesqueiro-dev` (team organization) | Merge into `dev`, after migrations | Team testing before release |
| `main` | Production | `pesqueiro-prod` (team organization) | Merge into `main`, after migrations | Real users |
| `main` | Demo | `pesqueiro-demo`, created later (see below) | Merge into `main`, after migrations | What jurors and the video see; seeded data |

### Supabase projects and the free-plan limit

The free plan allows two active projects for each person who is an Owner or Administrator of the organizations that hold them. The team organization (owner: Amanda) holds dev and production, which uses both of her free slots. Kauê and Guma are **Developers** in it, so those projects don't count against their limits.

The demo environment isn't needed until the demo seed ([#52](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/52), M6). Before then (by about 22 Nov), someone with a free slot creates `pesqueiro-demo` in São Paulo: Guma has two, and Kauê has one (his other is the old app's project). Until the demo exists, deploys from `main` go to production only.

All cloud resources run in the São Paulo region (Vercel `gru1`, Supabase `sa-east-1`).

## How a change is deployed

```
feature branch ──PR──▶ dev ──PR + 1 approval──▶ main
      │                 │                         │
   CI (ci.yml)     deploy.yml (dev)          deploy.yml (production, demo)
   + Vercel        1. migrate pesqueiro-dev  1. migrate each database
     preview       2. deploy pesqueiro-dev   2. deploy each Vercel project
```

- **CI** (`.github/workflows/ci.yml`) runs on every pull request into `dev` or `main`: lint, format, types, unit tests, a local Supabase, migrations, integration tests, build and Playwright. Its job is named `ci`, and branch protection requires it.
- **Deploy** (`.github/workflows/deploy.yml`) runs on every push to `dev` or `main`. For each environment it migrates the database first, then builds and deploys the same commit with the Vercel CLI. It never cancels a run halfway; a newer push waits.
- Vercel's own Git deploys are off for `dev` and `main` (`vercel.json`), so code never reaches an environment before its migrations. Pull request previews stay on.
- Pull request previews use the dev database, which may not have that pull request's migrations yet. A preview that needs a new migration fails until the pull request is merged into `dev`.

### Vercel projects

One Vercel project per environment, all on Amanda's Hobby account in region `gru1`:

| Project | Environment | Deployed by | Git connected |
|---|---|---|---|
| `pesqueiro-dev` | Dev, plus pull request previews | `deploy.yml` on `dev` | Yes, for previews only |
| `pesqueiro` | Production | `deploy.yml` on `main` | No |
| `pesqueiro-demo` | Demo, created with its database | `deploy.yml` on `main` | No |

Each environment deploys to its project's production domain (`<project>.vercel.app`), so it has a stable address that teammates open without a Vercel account. One project for dev and production (dev as a branch preview) was the first plan; it was dropped because Hobby has one seat and protects preview addresses with Vercel sign-in.

## Branch protection

| Branch | Rules |
|---|---|
| `dev` | Pull request required; `ci` check must pass; no force pushes |
| `main` | Pull request required; `ci` must pass; one approval; no force pushes; only `dev` or a hotfix branch merges in |

## Environment variables

Every variable is listed in `.env.example`. Secrets live only in Vercel and GitHub Actions settings, never in the repository. Set the app's variables in each Vercel project's **Production** environment; for `pesqueiro-dev`, set the same values in **Preview** too, so pull request previews work.

| Variable | Where | Secret | Purpose |
|---|---|---|---|
| `APP_ENV` | All | No | `local`, `dev`, `demo` or `production` |
| `NEXT_PUBLIC_SUPABASE_URL` | All | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | No | Public key, used only for login. Row-level security denies it every table. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Yes | Storage uploads and auth admin (account deletion) |
| `DATABASE_URL` | Server | Yes | Transaction pooler (port 6543) as `app_server` |
| `DATABASE_MIGRATION_URL` | CI only | Yes | Session pooler (port 5432) as the owner, for migrations. Not the direct connection: it's IPv6-only and GitHub Actions has no IPv6. |
| `APP_SERVER_DB_PASSWORD` | CI only | Yes | Password `db:migrate` sets for the `app_server` role; must match the one in `DATABASE_URL` |
| `ANTHROPIC_API_KEY` | Server | Yes | Species identification |
| `AI_MONTHLY_CALL_CAP` | Server | No | Identifications allowed per month |
| `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN` | All | No | Error and trace reporting |
| `SENTRY_AUTH_TOKEN` | CI only | Yes | Uploading source maps |
| `CRON_SECRET` | Server | Yes | Protects `/api/cron/daily` |
| `HEALTHCHECKS_PING_URL` | Server | Yes | Daily job heartbeat |
| `DISCORD_ALERTS_WEBHOOK` | Server | Yes | AI spending alert |
| `DISCORD_FEEDBACK_WEBHOOK` | Server | Yes | Beta feedback |

## GitHub Actions secrets

The deploy workflow reads each environment's secrets from a GitHub environment (**Settings → Environments**) with the same name. Each environment holds the same three names with its own values, so a missing secret can never fall through to another environment's database.

| GitHub environment | Deployment branch | Secrets |
|---|---|---|
| `dev` | `dev` | `DATABASE_MIGRATION_URL`, `APP_SERVER_DB_PASSWORD`, `VERCEL_PROJECT_ID` (of `pesqueiro-dev`) |
| `production` | `main` | `DATABASE_MIGRATION_URL`, `APP_SERVER_DB_PASSWORD`, `VERCEL_PROJECT_ID` (of `pesqueiro`) |
| `demo` | `main` | The same three, once the demo exists. Until then the environment has none, and the demo job skips with a notice. |

Repository secrets, shared by every environment:

| Secret | Used by |
|---|---|
| `VERCEL_TOKEN` | The Vercel CLI in `deploy.yml` |
| `VERCEL_ORG_ID` | The Vercel account that owns the projects |
| `SENTRY_AUTH_TOKEN` | Source maps (#5) |

`DATABASE_MIGRATION_URL` is the session pooler string as `postgres.<project-ref>`, and `APP_SERVER_DB_PASSWORD` is the one used when the project was set up; see [Apply migrations to a cloud database](../how-to/apply-migrations-to-a-cloud-database.md).

## Monitoring per environment

| Environment | Errors go to | Uptime checked |
|---|---|---|
| Dev | Discord `#alerts-dev` | No |
| Demo | Discord `#alerts` | Every 5 minutes |
| Production | Discord `#alerts` | Every 5 minutes |
