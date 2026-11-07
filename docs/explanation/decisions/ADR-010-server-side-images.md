# ADR-010: Server-side image processing with sharp

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

Phone photos carry GPS metadata. Privacy can't depend on the browser.

## Decision

Re-encode every upload on the server to WebP at three sizes, which drops all metadata, and store a perceptual hash.

## Alternatives considered

- Trust browser compression
- Storage-provider image transforms

## Consequences

Metadata removal under our control, fixed sizes, no per-image fees. Uploads take a little longer.
