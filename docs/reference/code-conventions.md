# Code conventions

Every backlog item and every pull request follows these conventions. When an item says "the usual action", it means everything under [Writes](#writes).

## Code layout

```
eslint/
  module-boundaries.mjs      the lint rule that enforces module boundaries
src/
  proxy.ts                   session refresh and sign-in redirects (Next.js 16's name for middleware)
  app/                       routes: pages, layouts, route handlers, server action entry points
  modules/<module>/
    index.ts                 the only file other modules may import
    commands.ts              writes, called by server actions
    queries.ts               reads, called by server components and route handlers
    policies.ts              permission checks, pure functions
    schema.ts                Drizzle tables owned by this module
    events.ts                event handlers this module registers
    ui/                      React components specific to this module
    *.test.ts                unit tests next to the code
    *.int.test.ts            integration tests against a real Postgres
  shared/
    actions.ts               authedAction()
    db/                      Drizzle client (db(), withTransaction()), shared tables in schema.ts
    events.ts                emit(), on(), afterResponse()
    errors.ts                DomainError and error codes
    rate-limit.ts            rateLimit()
    limits.ts                every rate limit in one place
    observability/           log.ts, span.ts, scrub.ts
    i18n/                    formatters for weight, length, numbers, dates
  ui/                        design-system primitives: Button, Chip, Avatar, Icon, Logo, Sticker…
messages/pt-BR.json          Portuguese strings
messages/en.json             English strings
drizzle/                     generated migrations
scripts/                     seed, reset, replay, board
tests/e2e/                   Playwright, one spec per journey
```

The ten modules are `identity`, `groups`, `catalog`, `logbook`, `social`, `gamification`, `notifications`, `moderation`, `media` and `species-id`. Their responsibilities and owned tables are in the [data model](data-model.md).

A lint rule (`eslint/module-boundaries.mjs`, run by `npm run lint`) fails when a file imports another module's internals, through the alias or a relative path. Import `@/modules/<name>` (its `index.ts`) only. Inside a module, import your own files with relative paths.

## Writes

Every mutation is a server action built with `authedAction(schema, handler, options?)` from `src/shared/actions.ts`. It does the following, in order:

1. Applies `options.rateLimit` (`{ key, limit, windowSec }`), returning `RATE_LIMITED` when exceeded.
2. Reads the session and passes `viewer` (`{ id, locale, isPlatformAdmin }`) to the handler, or returns `UNAUTHENTICATED`.
3. Parses the input with the Zod schema, returning `VALIDATION` with the failing field.
4. Runs the handler inside `withTransaction(tx => …)` when `options.tx` is true.
5. Wraps everything in a span named after the command, such as `logbook.logCatch`.
6. Returns `Result<T>`: `{ ok: true, data }` or `{ ok: false, error: { code, field? } }`.

### Error codes

| Code | When |
|---|---|
| `UNAUTHENTICATED` | No valid session |
| `FORBIDDEN` | The viewer can see the thing but may not do this to it |
| `NOT_FOUND` | Missing, deleted, or not visible to the viewer |
| `VALIDATION` | Input failed the schema or a business rule |
| `RATE_LIMITED` | Over a limit in `src/shared/limits.ts` |
| `CONFLICT` | Unique clash or a stale revision |
| `UNAVAILABLE` | A dependency (AI, storage) failed or is capped |

Content the viewer may not see is always `NOT_FOUND`, never `FORBIDDEN`, so its existence doesn't leak. Every code has a message under `errors.<CODE>` in both languages.

## Reads

Server components call `queries.ts` functions with the viewer. Every read of posts goes through `social.hydratePosts(ids, viewer)`, which re-checks visibility. Feeds go through `social.TimelineSource`, which returns post IDs and an opaque cursor.

## Events

`emit(tx, event)` runs registered handlers inside the same transaction, so a save and its consequences commit together. Work that can wait goes in `afterResponse(fn)`, which wraps Next.js `after()` and reports its own failures.

Event types: `CatchChanged`, `PostPublished`, `PostHidden`, `PostDeleted`, `AudienceChanged`, `ReactionAdded`, `CommentAdded`, `MemberJoined`, `MemberLeft`, `Followed`, `Unfollowed`, `ChallengeFinalized`.

## Database

- Drizzle ORM. Each module's tables live in its `schema.ts`; shared tables in `src/shared/db/schema.ts`. Generate a migration with `npm run db:generate`, then add `SELECT app_enable_access('public.<table>');` for each new table at the end of the generated SQL. Apply with `npm run db:migrate`.
- SQL that Drizzle can't express (roles, functions, policies) goes in a custom migration: `npx drizzle-kit generate --custom --name=<what>`.
- Never edit a migration that's already merged. Write a new one.
- Primary keys are `uuid default gen_random_uuid()`. Timestamps are `timestamptz default now()`. Soft delete uses `deleted_at` where an item says so.
- Weights are whole grams (`weight_g`). Lengths are whole millimetres (`length_mm`).
- Every new table calls `select app_enable_access('<table>')` in its migration: row-level security on, with one policy for the `app_server` role and none for `anon` or `authenticated`.
- The app connects as `app_server` through the Supabase transaction pooler. Migrations run as the table owner.

## Privacy rules

These never break. Reviewers reject any pull request that does.

- Exact coordinates exist only in `OwnCatch`. Public types (`PublicCatch`, `PublicPost`) have no coordinate fields, and a unit test asserts it.
- Logs, errors and traces carry internal user IDs only: no emails, names, coordinates, photos or request bodies.
- Every uploaded image is re-encoded on the server, which removes its metadata.

## Text and languages

- next-intl, with no locale in the URL. The locale comes from the profile (through the `NEXT_LOCALE` cookie), then `Accept-Language`.
- Every visible string lives in `messages/pt-BR.json` and `messages/en.json` under the namespace an item names. CI fails when a key exists in only one file.
- Format weights, lengths, numbers and dates with `src/shared/i18n`. Season and challenge dates use the `America/Sao_Paulo` time zone.

## UI

- Build from the design system's tokens and components (`src/ui/`). No literal colors in components.
- Mobile first: works at 360 px wide, with 44 px minimum touch targets and a visible focus ring.
- Every screen has loading, empty and error states.
- Copy follows the voice rules in the [design system](design-system.md#voice).

## Observability

- Commands get spans automatically through `authedAction`.
- Log meaningful events with `log.info('<module>.<event>', { userId, … })`.
- Never log personal data. The scrubber removes known keys, but don't rely on it.

## Tests

| Kind | Files | Run with | Covers |
|---|---|---|---|
| Unit | `*.test.ts` | `npm test` | Pure logic: rules, policies, formatters, schemas |
| Integration | `*.int.test.ts` | `npm run test:int` | Commands and queries against the local Supabase (`npm run db:start`); migrations are applied first |
| End to end | `tests/e2e/*.spec.ts` | `npm run test:e2e` | Journeys J1–J7 against `next build && next start` with a seeded database |

Name tests after behavior: `it('awards the species bonus once when two catches are saved at once')`.
