# ADR-006: An append-only XP ledger with full replay

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

Counters break on the first edited, deleted or back-dated catch. Anglers log about two or three catches a month, so recomputing their history is cheap.

## Decision

Record every XP change as a row in `xp_events`. On any catch change, lock the angler's progress row, replay all their catches through pure rules, and append only the difference. Uniqueness details are in ADR-013.

## Alternatives considered

- Counters increased in place
- Full event sourcing for everything

## Consequences

Auditable, safe to retry, correct after edits, and rules can change and be replayed. Replay cost grows with each angler's history, which stays small for years; checkpoints are the fix if it doesn't.
