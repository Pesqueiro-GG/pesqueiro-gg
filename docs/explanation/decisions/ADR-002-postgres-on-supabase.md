# ADR-002: Postgres on Supabase, with its Auth and Storage

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

The domain is relational and ranking-heavy: a social graph, audiences, a ledger, leaderboards. The team needs login, file storage and a database quickly, on free plans, near users in Brazil.

## Decision

Use Supabase in the São Paulo region for Postgres, Auth and Storage.

## Alternatives considered

- Convex
- Neon with Auth.js and separate file storage

## Consequences

Rankings and the ledger are plain SQL, and one vendor covers login, files and data; the team already knows it. Free projects pause after a week without activity (the health check keeps them active), and login is tied to Supabase.
