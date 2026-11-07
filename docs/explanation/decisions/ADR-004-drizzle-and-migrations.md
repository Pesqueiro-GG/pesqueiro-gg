# ADR-004: Drizzle ORM and versioned migrations

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

Rankings and the ledger need real SQL; schema changes must be reviewed and applied the same way in every environment.

## Decision

Use Drizzle for typed queries and drizzle-kit for migrations committed to the repository and applied by CI before each deploy.

## Alternatives considered

- supabase-js queries
- Prisma

## Consequences

Typed queries close to SQL with a light runtime, and migrations in git. One more tool to learn.
