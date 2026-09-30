# Database & Supabase Architecture

## 1. Purpose

The `/docs/database` documentation domain provides the authoritative reference for the Supabase PostgreSQL database architecture, relational entity-relationship diagrams (ERDs), migration files, table schemas, Row-Level Security (RLS) policies, and indexing strategies.

---

## 2. Ownership

- **Lead Owner:** Supabase Architect & Database Administrator
- **Secondary Stakeholders:** Staff Backend Engineers, Security Engineer
- **Review Cadence:** Continuous per migration run & quarterly indexing review

---

## 3. Contents & Documentation Index

| Document | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| `schema-catalogue.md` | Table Catalogue | Full schema definition for all tables across all domains with foreign keys & types | Active |
| `erd-diagram.md` | Entity Relationship | Mermaid visual representation of table relationships and cardinalities | Active |
| `rls-security-matrix.md` | Row-Level Security | Fine-grained security matrix defining SELECT, INSERT, UPDATE, DELETE permissions | Active |
| `migration-protocol.md` | Migration Standards | Guidelines for generating, verifying, applying, and rolling back database migrations | Active |
| `indexes-and-performance.md` | Optimization | Index definitions, query execution plans, and optimization benchmarks | Active |
| `seed-data-catalogue.md` | Standard Seeds | Reference for foundational seeds (Paths, Modules, Competencies, Gates, Badges) | Active |

---

## 4. Domain Database Tables

### Core Foundation & Auth
- `profiles` — User profile, role (`learner`, `instructor`, `admin`), avatar, bio.

### Learning Domain
- `learning_paths` — Path metadata, slug, level, publish status.
- `modules` — Modules assigned to paths with sequence ordering.
- `lessons` — Lessons assigned to modules with content & estimated duration.
- `user_learning_progress` — User lesson progression, status (`not_started`, `in_progress`, `completed`).

### Competency Domain
- `competency_categories` — Competency groupings (e.g. Prompt Engineering, Architecture).
- `competencies` — Individual competency definitions with unique code (`CTX-01`, `SDD-01`).
- `user_competency_progress` — User mastery level, score, and state transitions.
- `competency_evidence_mapping` — Traceable links between exercises/lessons and competencies.

### Exercise Domain
- `exercises` — Interactive coding exercises, rubrics, and starter templates.
- `exercise_attempts` — User submission attempts and validation outputs.
- `exercise_completion` — Verified exercise completion status.

### Achievement & XP Domain
- `achievements` — Badge catalogue, criteria, tier, and XP reward value.
- `achievement_categories` — Achievement taxonomies.
- `achievement_awards` — Award history linking user to achievement.
- `xp_balances` — Real-time accumulated total XP per user.
- `xp_transactions` — Immutable double-entry-style audit ledger of XP grants.

### Competency Gate Domain
- `competency_gates` — Gate definitions (Levels 1–7).
- `gate_requirements` — Multi-type prerequisite criteria (`competency`, `lesson`, `exercise`, `achievement`, `xp`, `artifact`).
- `gate_competencies` — M-N mapping of competencies required for gate.
- `user_gate_progress` — User gate progress percentage and lifecycle state.
- `gate_attempts` — Traceable gate attempt history.
- `gate_evidence` — Immutable artifact submissions (PRs, diagrams, links).
- `gate_validation` — Automated & instructor assessment outcomes.
- `gate_completion` — Permanent sealed completion records (`UNIQUE(user_id, gate_id)`).

---

## 5. Dependencies & Relationships

- **Upstream Inputs:**
  - [`/docs/architecture`](file:///home/gamp/Documents/lms/docs/architecture/README.md) — Invariants, domain models, and entity boundaries.
- **Downstream Consumers:**
  - [`/docs/backend`](file:///home/gamp/Documents/lms/docs/backend/README.md) — Repositories and TypeScript DB client types (`lib/supabase/types.ts`).
  - [`/docs/api`](file:///home/gamp/Documents/lms/docs/api/README.md) — Data contracts returned to clients.
  - [`/docs/governance`](file:///home/gamp/Documents/lms/docs/governance/README.md) — Security compliance and RLS audits.
