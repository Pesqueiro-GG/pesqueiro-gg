# ADR-001: A modular monolith in one Next.js app

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

Three people, three weeks, one product. Services would add deploys, network calls and distributed failures without solving a problem we have.

## Decision

Build one Next.js application split into ten modules. Each module owns its tables and exposes only its `index.ts`; a lint rule fails the build on cross-module imports. Modules talk through function calls and in-process events.

## Alternatives considered

- Microservices
- A separate backend service and frontend app

## Consequences

One deploy, one language, typed calls and transactions across modules. Boundaries depend on discipline and the lint rule, and everything scales together, which is fine at our size. Clear modules keep the option to split later.
