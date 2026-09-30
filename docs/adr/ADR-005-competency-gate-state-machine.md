# ADR-005: Competency Gate Finite State Machine & Permanent Seal

## Status
**ACCEPTED** (2026-09)

## Context
Competency Gates represent the definitive mastery verification checkpoints of the LMS. Unlike lesson views or exercise attempts, a gate completion permanently unlocks subsequent engineering tiers and must be mathematically and procedurally auditable. We require an unambiguous state transition model and permanent seal semantics.

## Decision
We implement a 6-state finite state machine for Competency Gates:
`LOCKED` &rarr; `AVAILABLE` &rarr; `IN_PROGRESS` &rarr; `UNDER_REVIEW` &rarr; `VALIDATED` &rarr; `COMPLETED`

### Invariants:
1. **Permanent Completion**: `COMPLETED` has zero outgoing transitions. Once completed, a gate cannot revert to any previous state.
2. **One Completion Per Gate**: Enforced at the database layer via `UNIQUE(user_id, gate_id)` on `gate_completion`.
3. **One Active Attempt Per Gate**: A learner may have at most one active attempt (`in_progress` or `under_review`) at any time.
4. **Traceable Proof**: Validation and completion require traceable evidence records (`gate_evidence`) and validation records (`gate_validation`).

## Consequences
### Positive
- Strict integrity guarantee preventing premature advancement or regression of verified engineers.
- Full traceability for auditing, credentialing, and employer verification.
- Clear UI progression and action states across the learner roadmap.

### Trade-offs & Mitigations
- If a learner needs re-evaluation after failure, the attempt transitions from `under_review` back to `in_progress` rather than resetting the entire gate history.
