# Environments

Branches, environments, where each one's data lives, and the environment variables the app reads.

## Branches and environments

| Branch | Environment | Database | Deploys when | Used for |
|---|---|---|---|---|
| feature branches | Local | Supabase CLI in Docker, ports 553xx (so it can run next to other local Supabase projects) | — | Development |
| pull requests | CI | Supabase CLI in GitHub Actions | Every push | Lint, types, tests, Playwright |
| pull requests | Preview | Dev project | Every push (Vercel preview) | Clicking through a change |
| `dev` | Dev | `pesqueiro-dev` (team organization) | Merge into `dev`, after migrations | Team testing before release |
| `main` | Production | `pesqueiro-prod` (team organization) | Merge into `main`, after migrations | Real users |
| `main` | Demo | `pesqueiro-demo`, created later (see below) | Merge into `main`, after migrations | What jurors and the video see; seeded data |

### Supabase projects and the free-plan limit

The free plan allows two active projects for each person who is an Owner or Administrator of the organizations that hold them. The team organization (owner: Amanda) holds dev and production, which uses both of her free slots. Kauê and Guma are **Developers** in it, so those projects don't count against their limits.

The demo environment isn't needed until the demo seed ([#52](https://github.com/Pesqueiro-GG/pesqueiro-gg/issues/52), M6). Before then (by about 22 Nov), someone with a free slot creates `pesqueiro-demo` in São Paulo: Guma has two, and Kauê has one (his other is the old app's project). Until the demo exists, deploys from `main` go to production only.

All cloud resources run in the São Paulo region (Vercel `gru1`, Supabase `sa-east-1`).

## Branch protection

| Branch | Rules |
|---|---|
| `dev` | Pull request required; `ci` check must pass; no force pushes |
| `main` | Pull request required; `ci` must pass; one approval; no force pushes; only `dev` or a hotfix branch merges in |

## Environment variables

Every variable is listed in `.env.example`. Secrets live only in Vercel and GitHub Actions settings, never in the repository.

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

| Secret | Used by |
|---|---|
| `DEV_DATABASE_MIGRATION_URL` | Migrations on merge into `dev` |
| `PROD_DATABASE_MIGRATION_URL` | Migrations on merge into `main` |
| `DEMO_DATABASE_MIGRATION_URL` | Demo migrations on merge into `main`, once the demo project exists; steps skip while it is unset |
| `DEV_APP_SERVER_DB_PASSWORD`, `PROD_APP_SERVER_DB_PASSWORD`, `DEMO_APP_SERVER_DB_PASSWORD` | The `app_server` password `db:migrate` sets in each project |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_DEMO_PROJECT_ID` | Deploys after migrations |
| `SENTRY_AUTH_TOKEN` | Source maps |

## Monitoring per environment

| Environment | Errors go to | Uptime checked |
|---|---|---|
| Dev | Discord `#alerts-dev` | No |
| Demo | Discord `#alerts` | Every 5 minutes |
| Production | Discord `#alerts` | Every 5 minutes |
