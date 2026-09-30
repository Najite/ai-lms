# ADR-003: Zero-Regression Phased Domain Implementation

## Status
**ACCEPTED** (2026-09)

## Context
In a multi-phase system rollout, modifying previously implemented domains during later domain implementation frequently introduces unintended regressions, breaks existing tests, or invalidates architectural assumptions.

## Decision
We enforce a strict **Zero-Regression & Domain Immutability Policy**:
1. When implementing a new domain (e.g. Phase 6 Competency Gates), previous certified domains (Foundation, Auth, Learning, Competency, Exercise, Achievement & XP) MUST NOT be modified or refactored.
2. New domains consume existing domains through their established public service APIs or direct read-only relational joins.
3. Every implementation step must preserve 100% test passing rates across all historical test suites.

## Consequences
### Positive
- Guaranteed stability of previously certified features.
- Isolated failure blast radius during development.
- Continuous green build and test suites throughout phased delivery.

### Trade-offs & Mitigations
- If a previous domain lacks an endpoint or repository method, new domains must implement composite queries in their own services or repository layer rather than altering legacy signatures.
