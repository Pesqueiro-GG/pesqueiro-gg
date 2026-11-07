# ADR-011: Cities come from a stored IBGE list

**Status:** Accepted · **Date:** 7 Nov 2026

## Context

Locations are the most sensitive data in the app. Reverse geocoding services would see them.

## Decision

Store Brazil's municipality list in the app and pick the nearest municipality centroid on the server.

## Alternatives considered

- Reverse geocoding with OpenStreetMap or Google

## Consequences

No third party sees a location, and there are no keys or limits. Near municipal borders the nearest centroid can be wrong; people can correct the city.
