# ADR-002: Domain-Driven Design (DDD) & Bounded Context Architecture

## Status
**ACCEPTED** (2026-09)

## Context
As the learning platform expands across multiple educational and technical domains (Authentication, Learning, Competencies, Exercises, Gamification, Competency Gates, Portfolio, Capstone, Analytics, Job Readiness), unstructured directory hierarchies risk severe code coupling, hidden side-effects, and broken invariants across release cycles.

## Decision
We organize all system architecture according to **Domain-Driven Design (DDD)** principles:
1. Core domain logic resides inside `domains/<domain_name>/`, structured as:
   - `models/`: Pure domain entity interfaces and finite state machine transition maps.
   - `dto/`: Typed Data Transfer Objects.
   - `validators/`: Zod runtime input validation schemas.
   - `policies/`: Authorization predicates and state transition rules.
   - `repositories/`: Encapsulated database query and mutation interfaces.
   - `services/`: Pure business logic orchestration returning standardized `DomainResponse<T>` envelopes.
2. Presentation and client interaction reside inside `features/<domain_name>/`.
3. Next.js routing resides in `app/<route_name>/`.
4. Cross-domain interactions occur strictly through public Domain Service interfaces or composite read-only queries.

## Alternatives Considered
- **Layer-First Architecture (`models/`, `controllers/`, `views/`)**: Placing all models or services in flat top-level folders causes domain confusion, making it difficult to isolate dependencies or enforce domain immutability.
- **Microservices Architecture**: Deploying 8–10 independent microservices introduces severe operational overhead (RPC latency, multi-repo sync, distributed transactions) unjustified for our current scaling phase.

## Tradeoffs
- **Initial File Boilerplate**: Requires creating repository, service, policy, and DTO files for each domain rather than writing ad-hoc SQL directly inside API routes.
- **Enforced Indirection**: Simple CRUD operations must flow through services and repositories.

## Risks
- **Domain Boundary Leakage**: Developers or AI assistants might attempt to import private domain repositories directly across domain boundaries.
- **Mitigation**: ESLint boundary rules and strict domain policies codified in [`AGENTS.md`](file:///home/gamp/Documents/lms/AGENTS.md).

## Consequences
- Total isolation between bounded contexts; bug fixes in one domain cannot break another.
- Lightning-fast unit testing with deterministic mocks without spinning up real databases or networks.
- Clear mental model and codebase navigability for engineers and AI agents alike.
