# ADR-005: A catch and its post are separate records

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

A catch feeds the game and holds private data (the exact spot). A post is what people see, with an audience, comments and reactions. Stories and tips are posts without a catch.

## Decision

Store catches in `logbook` and posts in `social`, one post per catch.

## Alternatives considered

- One table with optional catch columns

## Consequences

Private fields never sit on the social object; the game reads catches whatever their audience; comments and reactions work the same on every post kind. Logging writes two rows, and catch posts need one join.
