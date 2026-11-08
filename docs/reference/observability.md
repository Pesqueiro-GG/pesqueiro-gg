# Observability

The tools that watch Pesqueiro.GG, the targets they measure and where alerts go.

## Tools

| Concern | Tool | Notes |
|---|---|---|
| Errors | Sentry (server and browser), `@sentry/nextjs` 11 | Personal data collection off; every event scrubbed; no Session Replay or feedback widget |
| Traces | Sentry performance | Routes automatic; each command (`authedAction`'s `name`) and each `withSpan` is a named span. Sample rate 1.0 on local and dev, 0.2 on demo and production |
| Logs | Sentry Logs (fallback: Axiom) | `log.info('<module>.<event>', fields)`, linked to the current trace |
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

`commit` is the commit the build was made from, and `env` is `APP_ENV` at build time. No authentication, `Cache-Control: no-store`. Its regular calls also keep the free Supabase projects from pausing.

After each deploy, `deploy.yml` polls the environment's `/api/health` for up to 3 minutes until it reports the pushed commit, and fails the job if it never does or if the status is `degraded`.

## How Sentry is set up

| File | Does |
|---|---|
| `src/instrumentation.ts` | Starts Sentry on the server and edge runtimes, and reports errors from route handlers, Server Components and the proxy (`onRequestError`) |
| `src/instrumentation-client.ts` | Starts Sentry in the browser and traces page navigations |
| `src/app/global-error.tsx` | Reports errors that break the root layout |
| `src/shared/observability/sentry-options.ts` | Options shared by all three: DSN, environment, release, sample rate, data collection and the scrubbing hooks |
| `next.config.ts` | `withSentryConfig`: build-time instrumentation, and the source map upload when `SENTRY_AUTH_TOKEN` is set |

One Sentry project receives every environment; events carry `environment` (`APP_ENV`) and `release` (the commit). Without `NEXT_PUBLIC_SENTRY_DSN`, Sentry stays off, so local development and tests send nothing.

Sentry 11 replaced `sendDefaultPii` with `dataCollection`, and its defaults **collect** request bodies, cookies, headers, user details, query strings, database query values and local variables from stack frames. `sentry-options.ts` switches every category off, keeps only the `user-agent` header, and a unit test fails if any of them is turned back on.

## The debug route

`GET /api/debug/boom` throws an error on purpose, with fake personal data in its context (`lat`, `email`), to prove that errors reach Sentry and Discord and that the scrubber removes that data. It answers 404 unless `APP_ENV` is `local` or `dev`. It's temporary: remove it once the alerts are proven (S-34).

## What never leaves the server

Coordinates, photos, email addresses, names and catch request bodies are never sent to any monitoring tool. People appear only as internal user IDs. The scrubber in `src/shared/observability/scrub.ts` is a safety net, not a license to log them. Before anything is sent, it:

- removes keys named `lat`, `lng`, `lon`, `latitude`, `longitude`, `coordinates`, `email`, `photo`, `body`, `password`, `token`, `authorization`, `cookie`, `cookies`, `phone` and query-string keys, at any depth and in any letter case;
- replaces email addresses inside any text with `[email]`;
- drops the query string and fragment from URL fields (`url`, `url.full`, `http.url`, `href`, `from`, `to`…);
- keeps only the method, URL and `user-agent` of a request, and only the `id` of a user.

It runs on errors, transactions, breadcrumbs and logs, in the server and in the browser.
