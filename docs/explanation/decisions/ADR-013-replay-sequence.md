# ADR-013: The XP ledger is unique on the angler's replay sequence

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

The design review first made ledger rows unique on (award key, catch revision). That breaks when an award moves between catches without the earlier catch changing: a back-dated catch can take over the "new species" award, and reversing it on the later catch reuses an unchanged revision.

## Decision

Each replay that appends rows takes the angler's next `replay_seq`, stored in `user_progress` and incremented under the row lock. Ledger rows are unique on (`user_id`, `award_key`, `replay_seq`). Catch `revision` stays, for optimistic concurrency on edits.

## Alternatives considered

- Uniqueness on (award key, catch revision)
- No unique constraint, relying on the lock alone

## Consequences

Awards can move freely between catches; a retried replay finds no difference and appends nothing; the constraint still catches bugs.
