# ADR-006: Staged Multi-Milestone Capstone Strategy

## Status
**ACCEPTED** (2026-09)

## Context
Isolated coding challenges are effective for micro-competencies, but evaluating whether an engineer can architect, implement, deploy, and defend a complex production system requires an end-to-end Capstone project. Traditional bootcamps often allow students to submit an unverified weekend project at the very end, resulting in superficial clones with zero architectural rigor.

## Decision
We adopt a **4-Stage Milestone Capstone Strategy**:
1. **Stage 1 — Architecture RFC & Schema Design**: Learner submits an Architectural Decision Record (ADR), domain boundary map, and PostgreSQL schema definitions.
2. **Stage 2 — Backend Services & API Contracts**: Learner implements Domain Services, Repositories, Zod validators, and REST/Server Action routes with 100% green test suites.
3. **Stage 3 — Frontend UI & Client State**: Learner implements responsive Next.js components, Zustand stores, and optimistic mutation flows.
4. **Stage 4 — Production Deployment & Observability**: Learner deploys to cloud infrastructure (Vercel, Supabase, Docker), implements structured logging, and demonstrates live performance.

### Dual-Review Process:
- **Automated Verification**: CI pipeline verifies linting, type safety, test coverage (>80%), and build artifact generation.
- **Instructor / Peer Rubric Evaluation**: Human reviewers evaluate architectural trade-offs, code clarity, and security against standardized rubrics.

## Alternatives Considered
- **Single Monolithic Final Submission**: Learners receive no feedback until the end, leading to massive rework if early architectural assumptions are flawed.
- **Unstructured Freedom Projects**: Lack standardization, making objective competency assessment and automated verification impossible.

## Tradeoffs
- **Staged Progression Dependency**: Learners cannot jump to Stage 3 without passing Stages 1 and 2.
- **Reviewer Overhead**: Requires instructors to review Stage 1 ADRs and Stage 4 deployments.

## Risks
- **Instructor Review Delays**: Review bottlenecks could stall learner progress.
- **Mitigation**: Automated pre-check linters and test harnesses validate 70% of criteria automatically before instructor review.

## Consequences
- Capstones reflect real-world professional software development workflows (RFC &rarr; Implementation &rarr; Deploy).
- Directly populates the verified Portfolio Domain with rich case studies and live preview embeds.
