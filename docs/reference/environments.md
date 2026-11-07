# Environments

Branches, environments, where each one's data lives, and the environment variables the app reads.

## Branches and environments

| Branch | Environment | Database | Deploys when | Used for |
|---|---|---|---|---|
| feature branches | Local | Supabase CLI in Docker | — | Development |
| pull requests | CI | Supabase CLI in GitHub Actions | Every push | Lint, types, tests, Playwright |
| pull requests | Preview | Dev project | Every push (Vercel preview) | Clicking through a change |
| `dev` | Dev | Dev project (Kauê's Supabase account) | Merge into `dev`, after migrations | Team testing before release |
| `main` | Demo | Demo project (team organization) | Merge into `main`, after migrations | What jurors and the video see; seeded data |
| `main` | Production | Production project (team organization) | Merge into `main`, after migrations | Real users |

The Supabase free plan allows two active projects per account, so demo and production live in the team's organization and dev lives in Kauê's account.

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
| `DATABASE_MIGRATION_URL` | CI only | Yes | Direct connection as the owner, for migrations |
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
| `DEMO_DATABASE_MIGRATION_URL`, `PROD_DATABASE_MIGRATION_URL` | Migrations on merge into `main` |
| `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, `VERCEL_DEMO_PROJECT_ID` | Deploys after migrations |
| `SENTRY_AUTH_TOKEN` | Source maps |

## Monitoring per environment

| Environment | Errors go to | Uptime checked |
|---|---|---|
| Dev | Discord `#alerts-dev` | No |
| Demo | Discord `#alerts` | Every 5 minutes |
| Production | Discord `#alerts` | Every 5 minutes |
