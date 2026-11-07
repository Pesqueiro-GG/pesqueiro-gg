# Observability

The tools that watch Pesqueiro.GG, the targets they measure and where alerts go.

## Tools

| Concern | Tool | Notes |
|---|---|---|
| Errors | Sentry (server and browser) | Personal data off; request bodies scrubbed; no session replay |
| Traces | Sentry performance | Routes automatic; each command and query is a named span. Sample rate 1.0 on local and dev, 0.2 on demo and production |
| Logs | Sentry Logs (fallback: Axiom) | Structured: request ID, trace ID, user ID, module, event, duration |
| Uptime | UptimeRobot or Better Stack | `GET /api/health` every 5 minutes on demo and production |
| Daily job | Healthchecks.io | The job pings when it finishes; period 1 day, grace 2 hours |
| Database | Supabase reports | Slow queries, connections, free-plan limits |
| Page speed | Vercel Speed Insights | Real-phone load times |
| AI spending | `ai_usage` table and the Anthropic console limit | Alert at 80% of the monthly cap |
| Product totals | `/admin/impact` | SQL views; totals only |

## Targets

| Target | Measured by | Alert to Discord when |
|---|---|---|
| Demo and production up 99.5% of the time during judging | Uptime monitor | Any outage |
| 99% of catch saves succeed | Sentry: failure rate of `logbook.logCatch` | Above 1% over 1 hour |
| Feed p95 under 200 ms | Sentry: p95 of `feed.page` | Above 200 ms over 24 hours |
| Daily job runs | Healthchecks.io | A ping is missing |
| AI spending under the cap | `ai_usage` | 80% of the cap reached |

The feed target is also the first trigger in the [path to scale](../explanation/scaling.md).

## Alert channels

| Channel | Receives |
|---|---|
| Discord `#alerts` | Demo and production: outages, new errors, missed daily job, AI spending |
| Discord `#alerts-dev` | Dev environment errors |
| Discord `#feedback` | Beta feedback from the app |

Sentry posts through its Discord integration. Every other tool uses its own webhook, stored in that tool or in environment variables, never in the repository.

## The health route

`GET /api/health` runs `select 1` against the database with a 2-second timeout.

| Result | Status | Body |
|---|---|---|
| Database answers | 200 | `{ "status": "ok", "commit": "<sha>", "env": "<APP_ENV>", "time": "<iso>" }` |
| Database fails or times out | 503 | `{ "status": "degraded", … }` |

No authentication, `Cache-Control: no-store`. Its regular calls also keep the free Supabase projects from pausing.

## What never leaves the server

Coordinates, photos, email addresses, names and catch request bodies are never sent to any monitoring tool. People appear only as internal user IDs. The scrubber in `src/shared/observability/scrub.ts` removes known keys as a safety net, not as a license to log them.
