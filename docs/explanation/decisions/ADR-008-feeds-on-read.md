# ADR-008: Feeds built on read, behind a seam

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

Groups are small and follow graphs are new. Pre-built feeds must be corrected on every delete, hide and audience change.

## Decision

Build feeds with an indexed query when opened, behind `TimelineSource` (post IDs and an opaque cursor) and `hydratePosts` (load and check).

## Alternatives considered

- Feeds built on write
- Offset pagination

## Consequences

Always correct, no extra tables, stable pages. The following feed slows down at large scale; the seam lets pre-built feeds replace one module. See [Feeds and the path to scale](../scaling.md).
