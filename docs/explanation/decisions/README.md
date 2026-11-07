# Decision records

Each significant decision, the alternatives considered, and its consequences. A record is never edited to change its meaning: a new record supersedes it.

| Record | Decision |
|---|---|
| [ADR-001](ADR-001-modular-monolith.md) | A modular monolith in one Next.js app |
| [ADR-002](ADR-002-postgres-on-supabase.md) | Postgres on Supabase, with its Auth and Storage |
| [ADR-003](ADR-003-server-only-data-access.md) | All data access on the server, with deny-all row security as a backstop |
| [ADR-004](ADR-004-drizzle-and-migrations.md) | Drizzle ORM and versioned migrations |
| [ADR-005](ADR-005-catch-and-post.md) | A catch and its post are separate records |
| [ADR-006](ADR-006-xp-ledger-and-replay.md) | An append-only XP ledger with full replay |
| [ADR-007](ADR-007-visible-rankings.md) | Group rankings count only what the group can see |
| [ADR-008](ADR-008-feeds-on-read.md) | Feeds built on read, behind a seam |
| [ADR-009](ADR-009-events-in-transaction.md) | Events run inside the transaction, with no queue |
| [ADR-010](ADR-010-server-side-images.md) | Server-side image processing with sharp |
| [ADR-011](ADR-011-cities-from-ibge.md) | Cities come from a stored IBGE list |
| [ADR-012](ADR-012-environments-and-gitflow.md) | Three environments and feature → dev → main |
| [ADR-013](ADR-013-replay-sequence.md) | The XP ledger is unique on the angler's replay sequence |

To add one, copy the format of an existing record, use the next number, and link it here.
