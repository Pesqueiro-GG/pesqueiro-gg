# ADR-012: Three environments and feature → dev → main

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

Real users must never appear in what jurors see, and changes should be tested before they reach either audience.

## Decision

Run Dev (branch `dev`), Demo and Production (both from `main`) with separate databases. Changes go feature → `dev` → `main`; migrations run before deploys.

## Alternatives considered

- One environment with demo accounts
- Merging straight into main

## Consequences

The demo can be reset before recording, and every change is tested on Dev first. Three databases to migrate; the dev one lives in Kauê's account because of the free-plan project limit.
