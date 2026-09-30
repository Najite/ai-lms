# Architectural Decision Records (ADRs)

## 1. Purpose

The `/docs/adr` documentation domain captures and maintains all **Architectural Decision Records (ADRs)** for the platform. 

An ADR is a lightweight document that captures an important architectural decision made along with its context, options considered, trade-offs evaluated, and consequences.

---

## 2. Ownership

- **Lead Owner:** Principal Software Architect & Architecture Review Board
- **Secondary Stakeholders:** Staff Engineers, Engineering Leads, Domain Specialists
- **Review Cadence:** As decisions are proposed, accepted, or superseded

---

## 3. Authoritative ADR Index

| ADR ID | Title | Status | Date | Decision Summary |
| :--- | :--- | :---: | :---: | :--- |
| [`ADR-001`](file:///home/gamp/Documents/lms/docs/adr/ADR-001-technology-stack.md) | Core Technology Stack & Framework Selection | Accepted | 2026-09 | Next.js 15 App Router, React 19, TypeScript strict mode, Tailwind CSS, Supabase PostgreSQL |
| [`ADR-002`](file:///home/gamp/Documents/lms/docs/adr/ADR-002-domain-driven-design.md) | Domain-Driven Design & Bounded Context Architecture | Accepted | 2026-09 | Strict DDD bounded contexts (`domains/*`), feature UI (`features/*`), and domain isolation |
| [`ADR-003`](file:///home/gamp/Documents/lms/docs/adr/ADR-003-supabase-architecture.md) | Supabase & PostgreSQL Relational Architecture | Accepted | 2026-09 | PostgreSQL 15+, versioned SQL migrations, 100% RLS security coverage, double-entry audit ledgers |
| [`ADR-004`](file:///home/gamp/Documents/lms/docs/adr/ADR-004-competency-driven-learning.md) | Competency-Driven Learning & Mastery Model | Accepted | 2026-09 | 5-state mastery model (`not_started` &rarr; `mastered`), standard competency codes (`CTX-01`, `SDD-01`) |
| [`ADR-005`](file:///home/gamp/Documents/lms/docs/adr/ADR-005-build-first-learning.md) | Build-First & Test-Driven Educational Pedagogy | Accepted | 2026-09 | Specification-first contracts, deterministic in-browser test harnesses, intentional failure injection |
| [`ADR-006`](file:///home/gamp/Documents/lms/docs/adr/ADR-006-capstone-strategy.md) | Staged Multi-Milestone Capstone Strategy | Accepted | 2026-09 | 4-stage capstone lifecycle (RFC &rarr; API &rarr; UI &rarr; Deploy) with automated + instructor rubric scoring |
| [`ADR-007`](file:///home/gamp/Documents/lms/docs/adr/ADR-007-achievement-system.md) | Gamification Ledger & Double-Entry XP Architecture | Accepted | 2026-09 | Immutable `xp_transactions` ledger, atomic balance updates, tiered achievement badges |
| [`ADR-008`](file:///home/gamp/Documents/lms/docs/adr/ADR-008-competency-gates.md) | Competency Gates FSM & Permanent Mastery Sealing | Accepted | 2026-09 | 6-state gate machine, multi-type evaluator, permanent completion seal (`UNIQUE(user_id, gate_id)`) |
| [`ADR-009`](file:///home/gamp/Documents/lms/docs/adr/ADR-009-portfolio-system.md) | Verified Portfolio Showcase Architecture | Accepted | 2026-09 | Public portfolio pages, live project embeds, cryptographic gate badge verification, social cards |
| [`ADR-010`](file:///home/gamp/Documents/lms/docs/adr/ADR-010-job-readiness-system.md) | Algorithmic Employability Index & AI Interview Simulator | Accepted | 2026-09 | 0–1000 Employability Index, LLM technical interview simulator, recruiter talent search portal |

---

## 4. ADR Lifecycle & Format

Every ADR progresses through standard lifecycle statuses:
1. **PROPOSED**: Under review by the Architecture Review Board.
2. **ACCEPTED**: Approved and binding for all current and future implementations.
3. **REJECTED**: Evaluated and discarded with recorded rationale.
4. **SUPERSEDED**: Replaced by a newer ADR referencing the original ID.

### Standard ADR Template Structure:
- **Title**: `ADR-XXX: Short Descriptive Title`
- **Status**: `PROPOSED | ACCEPTED | REJECTED | SUPERSEDED`
- **Context**: Problem statement, constraints, requirements, and background forces.
- **Decision**: The selected architectural approach and explicit rejection of alternatives.
- **Alternatives Considered**: Other architectures evaluated and reasons for rejection.
- **Tradeoffs**: Conscious compromises made in choosing this approach.
- **Risks & Mitigations**: Vulnerabilities, failure modes, and mitigation strategies.
- **Consequences**: Positive outcomes and downstream engineering impacts.

---

## 5. Dependencies & Relationships

- **Upstream Inputs:**
  - System requirements, business invariants, and technical trade-offs.
- **Downstream Consumers:**
  - [`/docs/architecture`](file:///home/gamp/Documents/lms/docs/architecture/README.md) & [`/architecture.md`](file:///home/gamp/Documents/lms/architecture.md) — System specifications.
  - [`/docs/database`](file:///home/gamp/Documents/lms/docs/database/README.md) & [`/database-design.md`](file:///home/gamp/Documents/lms/database-design.md) — Database design.
  - [`/AGENTS.md`](file:///home/gamp/Documents/lms/AGENTS.md) — AI engineering governance.
