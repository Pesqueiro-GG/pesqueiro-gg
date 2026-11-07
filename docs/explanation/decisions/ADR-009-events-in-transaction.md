# ADR-009: Events run inside the transaction, with no queue

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

A catch save must update XP, the album and notifications consistently. Fan-out per catch is small.

## Decision

Emit events as function calls inside the same transaction. Non-critical work (the overtaken check, file cleanup) runs right after the response.

## Alternatives considered

- Outbox table with a worker
- A hosted queue

## Consequences

All-or-nothing consistency with nothing extra to run. Writes do more work, and a failing handler fails the action. The emit interface stays the same if an outbox replaces it.
