# ADR-003: All data access on the server, with deny-all row security as a backstop

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

The earlier app let the browser query the database, protected only by row-level security. XP, duplicate checks and rate limits can't be expressed as row rules, so they had nowhere to live.

## Decision

The browser never queries the database. The server connects as its own role, `app_server`, through the transaction pooler. Every table has row-level security on, with a policy for `app_server` only, so the public key reads nothing.

## Alternatives considered

- Browser queries protected by row-level security, as in the earlier app

## Consequences

Business rules live in tested TypeScript, with one place for permissions, rate limits and events. Every read goes through the server. Because the app isn't the table owner, database permissions can still make the XP ledger insert-only.
