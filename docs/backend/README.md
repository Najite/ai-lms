# Backend Services & Domain Layer

## 1. Purpose

The `/docs/backend` documentation domain establishes the standards, patterns, and implementation blueprints for the backend Domain-Driven Design (DDD) layer, service orchestration, repository patterns, domain policies, and database transactions.

---

## 2. Ownership

- **Lead Owner:** Staff Backend Engineer
- **Secondary Stakeholders:** Principal Software Architect, Database Architect
- **Review Cadence:** Continuous per domain service & PR code review

---

## 3. Contents & Documentation Index

| Document | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| `layered-architecture.md` | DDD Layers | Layer breakdown: Domain Models &rarr; Repositories &rarr; Policies &rarr; Services &rarr; Route Handlers | Active |
| `service-layer-standards.md` | Service Contracts | Interface specifications, dependency injection, and pure business logic encapsulation | Active |
| `repository-patterns.md` | Data Access | Supabase client usage, typed mapping, error catching, and isolation rules | Active |
| `domain-policies.md` | Access & Invariants | Authorization policies, state transition enforcement, and security predicates | Active |
| `transaction-management.md` | Concurrency & ACID | Multi-table mutations, optimistic locking, and idempotency guarantees | Active |
| `logging-and-observability.md` | Audit & Logging | Structured JSON logging standards with `lib/logger.ts` and audit trail records | Active |

---

## 4. Backend Architecture Layers

```
Domain Request (from Route Handler or Server Action)
       │
       ▼
Domain Service (Orchestrates business rules & cross-domain checks)
       │
       ├─► Domain Policy (Validates user permission & state transition invariants)
       │
       ├─► Domain Validator (Zod schemas validating input payloads)
       │
       └─► Domain Repository (Type-safe Supabase PostgreSQL queries & mutations)
              │
              ▼
       Database Layer (PostgreSQL with RLS & Triggers)
```

---

## 5. Domain Backend Inventory (`domains/*`)

1. **`domains/auth`**: Profile repository, authentication session service.
2. **`domains/learning`**: Learning path repository, module repository, lesson query service, progress service.
3. **`domains/competencies`**: Competency repository, competency progress tracking service, category query service.
4. **`domains/exercises`**: Exercise repository, submission evaluation service, attempt tracking service.
5. **`domains/achievement`**: Achievement repository, XP balance repository, transaction service, award service.
6. **`domains/gates`**: Gate repository, progress repository, attempt repository, evidence repository, validation repository, completion repository, requirement evaluator service.

---

## 6. Dependencies & Relationships

- **Upstream Inputs:**
  - [`/docs/architecture`](file:///home/gamp/Documents/lms/docs/architecture/README.md) — System boundaries and bounded contexts.
  - [`/docs/database`](file:///home/gamp/Documents/lms/docs/database/README.md) — Schemas, RLS rules, and migration types.
- **Downstream Consumers:**
  - [`/docs/api`](file:///home/gamp/Documents/lms/docs/api/README.md) — Exposed via Route Handlers and Server Actions.
  - [`/docs/audits`](file:///home/gamp/Documents/lms/docs/audits/README.md) — Unit test suites and verification benchmarks.
