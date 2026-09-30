# ADR-008: Competency Gates Finite State Machine & Permanent Mastery Sealing

## Status
**ACCEPTED** (2026-09)

## Context
Competency Gates exist as the platform's core mastery checkpoints. A learner must not progress to higher engineering tiers merely because lessons were completed or XP was accumulated. Advancement occurs only when multi-dimensional competency requirements have been rigorously evaluated against traceable proof. Furthermore, gate certification must be permanent—once an engineer demonstrates mastery at a tier, their certified achievement cannot silently regress or be revoked by arbitrary state changes.

## Decision
We implement a **6-State Finite State Machine with Permanent Completion Sealing**:
`LOCKED` &rarr; `AVAILABLE` &rarr; `IN_PROGRESS` &rarr; `UNDER_REVIEW` &rarr; `VALIDATED` &rarr; `COMPLETED`

### Invariants & Rules:
1. **Rule #1 (Traceable Evidence)**: Validation requires auditable proof artifacts (`gate_evidence`).
2. **Rule #2 (Multi-Type Requirements)**: `GateRequirementService` evaluates `competency`, `lesson`, `exercise`, `achievement`, `xp`, and `artifact` requirements concurrently.
3. **Rule #3 (Strict Prerequisite Enforcement)**: Gate $N+1$ cannot transition from `LOCKED` to `AVAILABLE` until Gate $N$ is `COMPLETED`.
4. **Rule #4 (Permanent Completion)**: The `COMPLETED` state is terminal and irreversible with zero outgoing transitions. `UNIQUE(user_id, gate_id)` on `gate_completion` guarantees one permanent seal per gate.
5. **Rule #5 (One Active Attempt)**: Learners may have at most one active attempt (`in_progress` or `under_review`) per gate.

## Alternatives Considered
- **Decay / Expiry Model**: Forcing gates to expire over time creates artificial friction and undermines historical credentials.
- **Client-Side Gate Check**: Verifying gate criteria in client-side code exposes the certification system to script tampering and unauthorized unlocks.

## Tradeoffs
- **Rigid Progression**: Learners cannot jump directly to advanced Level 6 or 7 gates without passing through foundation levels 1–5.
- **Permanent Completion Invariant**: If a completed gate's curriculum requirements change in the future, previously certified learners maintain their completed status (versioned gate definitions).

## Risks
- **Complex Multi-Domain Requirement Joins**: Evaluating 6 requirement types across 6 domain tables simultaneously could create database bottlenecks.
- **Mitigation**: Indexed composite queries executed concurrently via `Promise.all` in `gate-requirement.service.ts` with sub-20ms evaluation latency.

## Consequences
- Total credibility of credentials issued by the platform.
- Unambiguous visual roadmap for learners on the dashboard.
- Permanent, auditable proof for employers and accreditation bodies.
