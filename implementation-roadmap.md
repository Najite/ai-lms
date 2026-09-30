# Engineering Implementation Roadmap
# AI-Native Software Engineering LMS & Mastery Learning Platform

**Document Version:** 1.0.0  
**Status:** Approved / Authoritative Delivery Schedule  
**Classification:** Technical Program Management & Sprint Execution  
**Author:** Technical Program Manager, Principal Software Architect & Engineering Leads  
**Target Repository:** `ai-native-lms`

---

## Program Overview

This implementation roadmap defines the 11-sprint phased engineering execution plan for the AI-Native Software Engineering LMS. The execution follows strict **Domain-Driven Design (DDD)**, bounded context isolation, and a **Zero-Regression Immutability Policy** for completed domains.

```mermaid
gantt
    title Phased Engineering Implementation Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1: Foundation & Core
    Sprint 1: Foundation Layer            :done, s1, 2026-09-01, 2026-09-07
    Sprint 2: Authentication & Identity   :done, s2, 2026-09-08, 2026-09-14
    Sprint 3: Learning Domain             :done, s3, 2026-09-15, 2026-09-21
    section Phase 2: Assessment & Mastery
    Sprint 4: Competency Domain           :done, s4, 2026-09-22, 2026-09-28
    Sprint 5: Exercise Domain             :done, s5, 2026-09-29, 2026-10-05
    Sprint 6: Achievement & XP Domain     :done, s6, 2026-10-06, 2026-10-12
    Sprint 7: Competency Gates Domain     :done, s7, 2026-10-13, 2026-10-19
    section Phase 3: Showcase & Placement
    Sprint 8: Portfolio Domain            :active, s8, 2026-10-20, 2026-10-26
    Sprint 9: Capstone Domain             :s9, 2026-10-27, 2026-11-02
    Sprint 10: Analytics Domain           :s10, 2026-11-03, 2026-11-09
    Sprint 11: Job Readiness Domain       :s11, 2026-11-10, 2026-11-16
```

---

## Executive Sprint Dashboard

| Sprint | Domain | Status | Database Migration | Service Layer | Test Pass Rate |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **Sprint 1** | Foundation Layer | ✅ Complete | Applied | Complete | 100% (13 tests) |
| **Sprint 2** | Authentication & Identity | ✅ Complete | Applied | Complete | 100% (12 tests) |
| **Sprint 3** | Learning Domain | ✅ Complete | Applied | Complete | 100% (16 tests) |
| **Sprint 4** | Competency Domain | ✅ Complete | Applied | Complete | 100% (29 tests) |
| **Sprint 5** | Exercise Domain | ✅ Complete | Applied | Complete | 100% (40 tests) |
| **Sprint 6** | Achievement & XP Domain | ✅ Complete | Applied | Complete | 100% (30 tests) |
| **Sprint 7** | Competency Gates Domain | ✅ Complete | Applied | Complete | 100% (29 tests) |
| **Sprint 8** | Portfolio Domain | ⏳ Next Sprint | Pending | Planned | — |
| **Sprint 9** | Capstone Domain | ⏳ Planned | Pending | Planned | — |
| **Sprint 10** | Analytics Domain | ⏳ Planned | Pending | Planned | — |
| **Sprint 11** | Job Readiness Domain | ⏳ Planned | Pending | Planned | — |

---

## Sprint 1: Foundation Layer

### 1. Objectives
Establish the core Next.js 15 App Router skeleton, Supabase client/server infrastructure, dark-mode design system token architecture, structured logging, and automated CI test runner.

### 2. Features
- Next.js 15 Fullstack setup with React 19 and TypeScript strict mode.
- Tailwind CSS configuration with customized dark HSL color palette and typography.
- Supabase Server/Client SDK integration (`lib/supabase/client.ts`, `lib/supabase/server.ts`, `lib/supabase/types.ts`).
- Structured JSON logging utility (`lib/logger.ts`).
- Vitest configuration with JSDOM and mock environment setup (`vitest.config.mts`).

### 3. Dependencies
- Upstream: None (Root project initialization).
- Downstream: All subsequent domain sprints.

### 4. Deliverables
- `lib/supabase/*`: Supabase singleton client and server action helper functions.
- `components/ui/*`: Core UI primitives (`button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`).
- `lib/logger.ts`: Production-ready structured logger.
- `tests/unit/foundation.test.ts`: Test suite verifying client initialization and UI tokens.

### 5. Acceptance Criteria
- `npx tsc --noEmit` runs with 0 errors.
- `npm run lint` passes with 0 warnings.
- Unit tests verify Supabase client factories and environment variable loaders.

### 6. Risks
- **Risk**: Secret leakage in client-side bundles.
- **Mitigation**: Strict separation between `NEXT_PUBLIC_` variables and server-only keys (`SUPABASE_SERVICE_ROLE_KEY`).

---

## Sprint 2: Authentication & Identity Domain

### 2. Objectives
Implement user authentication, profile data persistence, session management, and Role-Based Access Control (`learner`, `instructor`, `admin`) with PostgreSQL Row-Level Security (RLS).

### 2. Features
- Supabase Auth integration (email/password, OAuth callbacks).
- `profiles` table schema with role-based check constraints and auto-provisioning triggers.
- Next.js SSR middleware session refresh (`middleware.ts`).
- Profile management repository and authentication query services.

### 3. Dependencies
- Upstream: Sprint 1 (Foundation).
- Downstream: All learner-authenticated domains.

### 4. Deliverables
- Migration: `create_profiles_table` with RLS policies (`auth.uid() = id`).
- `domains/auth/`: Domain models, profile repository, and auth query services.
- `features/auth/`: Login, registration, and user profile drawer components.
- `tests/unit/auth.test.ts`: Unit tests for session validation and role policy enforcement.

### 5. Acceptance Criteria
- Users can sign up, log in, and establish SSR cookie sessions.
- Profile records automatically created on user creation via Supabase trigger.
- RLS blocks non-admin users from elevating their own `role` field.

### 6. Risks
- **Risk**: Stale session cookies in SSR components.
- **Mitigation**: Implemented token refresh logic in Next.js edge middleware.

---

## Sprint 3: Learning Domain

### 1. Objectives
Implement the hierarchical educational curriculum engine (Learning Paths &rarr; Modules &rarr; Lessons) and optimistic learner progress tracking.

### 2. Features
- Relational schema for `learning_paths`, `modules`, `lessons`, and `user_learning_progress`.
- MDX interactive lesson reader with syntax-highlighted code snippets and callouts.
- Real-time lesson progress state machine (`not_started` &rarr; `in_progress` &rarr; `completed`).
- Learning path navigation dashboard and curriculum overview page.

### 3. Dependencies
- Upstream: Sprint 1 (Foundation), Sprint 2 (Auth).
- Downstream: Sprint 4 (Competency), Sprint 5 (Exercise), Sprint 7 (Gates).

### 4. Deliverables
- Migration: `create_learning_domain_schema` + foundational curriculum seed data.
- `domains/learning/`: Path, module, lesson repositories, and progress services.
- `features/learning/`: `LessonReader`, `ModuleAccordion`, `LearningPathCard`.
- `tests/unit/learning-service.test.ts`, `tests/unit/learning-schemas.test.ts`.

### 5. Acceptance Criteria
- Learners can navigate paths, view module contents, and read lessons.
- Lesson completion state is persisted idempotently in `user_learning_progress`.
- Path hierarchy enforces sequence ordering (`sequence_order ASC`).

### 6. Risks
- **Risk**: Heavy payload sizes when loading full curriculum trees.
- **Mitigation**: Implemented paginated and relation-selective queries in `learning.repository.ts`.

---

## Sprint 4: Competency Domain

### 1. Objectives
Implement the core competency taxonomy, 5-state mastery tracking model, and evidence mapping connections between learning activities and skills.

### 2. Features
- Relational schema for `competency_categories`, `competencies`, `user_competency_progress`, and `competency_evidence_mapping`.
- 5-State Finite State Machine: `not_started` &rarr; `introduced` &rarr; `practicing` &rarr; `reinforced` &rarr; `mastered`.
- Standard competency catalogue (`CTX-01`, `SDD-01`, `API-01`, `DBM-01`, `OPS-01`, `ARC-01`, `GOV-01`).
- Competency radar and category filtering UI.

### 3. Dependencies
- Upstream: Sprint 2 (Auth), Sprint 3 (Learning).
- Downstream: Sprint 5 (Exercise), Sprint 7 (Gates), Sprint 10 (Analytics).

### 4. Deliverables
- Migration: `create_competency_domain_schema` + standard competency seed data.
- `domains/competencies/`: Competency repository, progress tracking service, policy validator.
- `features/competencies/`: `CompetencyCard`, `CompetencyRadar`, `MasteryStateBadge`.
- `tests/unit/competency-state-machine.test.ts`, `tests/unit/competency-service.test.ts`, `tests/unit/competency-schemas.test.ts`.

### 5. Acceptance Criteria
- Competency mastery states advance only when supported by evidence or passing scores.
- State transitions follow strict precedence rules.
- Competency progress is unique per `(user_id, competency_id)`.

### 6. Risks
- **Risk**: False mastery promotion through unverified score increments.
- **Mitigation**: Competency progress service enforces score thresholds and evidence mapping validation.

---

## Sprint 5: Exercise Domain

### 1. Objectives
Build the interactive in-browser coding exercise execution engine, automated test evaluation harness, attempt tracking, and competency evidence generation.

### 2. Features
- Schema for `exercises`, `exercise_attempts`, and `exercise_completion`.
- In-browser code challenge editor with starter code, instructions, and test specs.
- Automated validation runner scoring submissions and returning execution diffs.
- Automatic creation of competency evidence records upon passing exercises.

### 3. Dependencies
- Upstream: Sprint 3 (Learning), Sprint 4 (Competency).
- Downstream: Sprint 6 (Achievement), Sprint 7 (Gates).

### 4. Deliverables
- Migration: `create_exercise_domain_schema` + standard interactive exercises.
- `domains/exercises/`: Exercise repository, submission evaluation service, attempt service.
- `features/exercises/`: `CodeEditor`, `TestRunnerOutput`, `ExerciseCard`.
- `tests/unit/exercise-state-machine.test.ts`, `tests/unit/domain-exercise-services.test.ts`, `tests/unit/exercise-schemas.test.ts`.

### 5. Acceptance Criteria
- Code submissions evaluate against Vitest test harnesses within isolated execution contexts.
- Passing attempts create verified records in `exercise_completion` and trigger competency evidence.
- Full execution output (stdout/stderr) logged immutably in `exercise_attempts`.

### 6. Risks
- **Risk**: Execution sandbox timeouts or infinite loops in user submissions.
- **Mitigation**: Strict execution timeouts (2.5s) and memory caps in the evaluation engine.

---

## Sprint 6: Achievement & XP Domain

### 1. Objectives
Implement the gamification engine, double-entry style immutable XP transaction ledger, milestone badge awards, and real-time balance calculations.

### 2. Features
- Schema for `achievement_categories`, `achievements`, `achievement_awards`, `xp_balances`, and `xp_transactions`.
- Milestone badges with 4 tiers (`bronze`, `silver`, `gold`, `platinum`).
- Append-only `xp_transactions` ledger capturing every credit, bonus, and adjustment.
- Real-time XP balance updates with animated toast notifications and level progression.

### 3. Dependencies
- Upstream: Sprint 4 (Competency), Sprint 5 (Exercise).
- Downstream: Sprint 7 (Gates), Sprint 10 (Analytics).

### 4. Deliverables
- Migration: `create_achievement_xp_domain_schema` + badge seed catalogue.
- `domains/achievement/`: Achievement repository, XP balance repository, award service, transaction service.
- `features/achievements/`: `AchievementCard`, `XPBalanceDisplay`, `RewardModal`.
- `tests/unit/xp-system.test.ts`, `tests/unit/achievement-services.test.ts`, `tests/unit/achievement-schemas.test.ts`.

### 5. Acceptance Criteria
- `xp_transactions` is strictly append-only; balance updates are atomic.
- Achievement awards are idempotent (`UNIQUE(user_id, achievement_id)`).
- XP grants automatically recalculate learner levels based on tiered thresholds.

### 6. Risks
- **Risk**: Race conditions during concurrent XP transaction grants.
- **Mitigation**: Database transactions and optimistic locking on `xp_balances.updated_at`.

---

## Sprint 7: Competency Gate Domain

### 1. Objectives
Implement the 7 capability gate mastery checkpoints (Levels 1–7), multi-type requirement evaluator, evidence collection archive, validation sealing, and permanent completion guarantees.

### 2. Features
- Relational schema for `competency_gates`, `gate_requirements`, `gate_competencies`, `user_gate_progress`, `gate_attempts`, `gate_evidence`, `gate_validation`, and `gate_completion`.
- 6-State Finite State Machine: `LOCKED` &rarr; `AVAILABLE` &rarr; `IN_PROGRESS` &rarr; `UNDER_REVIEW` &rarr; `VALIDATED` &rarr; `COMPLETED`.
- Multi-Type Requirement Evaluator evaluating `competency`, `lesson`, `exercise`, `achievement`, `xp`, and `artifact` requirements concurrently.
- Permanent gate sealing with zero outgoing transitions (`UNIQUE(user_id, gate_id)` on `gate_completion`).
- Evidence submission modal supporting GitHub PRs, live deployment URLs, and architecture docs.

### 3. Dependencies
- Upstream: Sprints 1–6 (Foundation, Auth, Learning, Competency, Exercise, Achievement & XP).
- Downstream: Sprint 8 (Portfolio), Sprint 9 (Capstone), Sprint 11 (Job Readiness).

### 4. Deliverables
- Migration: `create_competency_gate_domain_schema` + 7 standard capability gates seed.
- `domains/gates/`: Models, repositories, services (`GateQueryService`, `GateProgressService`, `GateRequirementService`, `GateEvidenceService`, `GateValidationService`, `GateCompletionService`).
- `features/gates/`: `GateRoadmap`, `GateCard`, `GateRequirementsList`, `GateEvidenceModal`.
- `tests/unit/gate-state-machine.test.ts`, `tests/unit/gate-services.test.ts`, `tests/unit/gate-schemas.test.ts`.

### 5. Acceptance Criteria
- Gate completion is permanent and irreversible (outgoing transitions from `COMPLETED` rejected).
- Learner cannot advance to Gate $N+1$ without completing Gate $N$.
- Requirement evaluator validates all 6 requirement types against active domain data.

### 6. Risks
- **Risk**: Performance degradation during cross-domain requirement evaluation joins.
- **Mitigation**: Concurrent `Promise.all` execution across composite B-tree indexed tables.

---

## Sprint 8: Portfolio Domain

### 1. Objectives
Build the employer-facing public portfolio engine, showcase verified competency artifacts, enable live project embeds, and generate tamper-proof credential URLs.

### 2. Features
- Schema for `portfolios`, `portfolio_items`, `portfolio_skills`, and `portfolio_views`.
- Public portfolio page (`app/portfolio/[username]/page.tsx`) with customizable layouts.
- Live interactive embeds for deployed projects with direct GitHub commit audit trails.
- Cryptographically verifiable credential badge exporter (OG image cards, LinkedIn sharing).
- Privacy controls (public, unlisted, recruiter-only, private).

### 3. Dependencies
- Upstream: Sprint 4 (Competencies), Sprint 7 (Competency Gates).
- Downstream: Sprint 11 (Job Readiness).

### 4. Deliverables
- Migration: `create_portfolio_domain_schema`.
- `domains/portfolio/`: Portfolio models, repositories, showcase services.
- `features/portfolio/`: `PortfolioHeader`, `ProjectEmbedCard`, `VerifiedBadgeShowcase`, `PortfolioShareModal`.
- `tests/unit/portfolio-services.test.ts`, `tests/unit/portfolio-schemas.test.ts`.

### 5. Acceptance Criteria
- Public portfolio renders in < 600ms via Edge SSR.
- Showcases only verified competencies and permanently completed gates.
- Public sharing generates dynamic OpenGraph preview images.

### 6. Risks
- **Risk**: Broken iframe embeds or malicious external project links.
- **Mitigation**: Strict URL sanitization and Content-Security-Policy (CSP) sandbox headers.

---

## Sprint 9: Capstone Domain

### 1. Objectives
Implement multi-stage end-to-end fullstack capstone projects, staged milestone checkpoints, automated integration verification, and peer/instructor rubric scoring.

### 2. Features
- Schema for `capstones`, `capstone_milestones`, `capstone_submissions`, and `capstone_reviews`.
- 4-Stage Capstone Lifecycle: Stage 1 (Architecture RFC) &rarr; Stage 2 (Database & API) &rarr; Stage 3 (Frontend & State) &rarr; Stage 4 (Production Deploy).
- Dual-Review Workflow: Automated test suite verification + Instructor rubric evaluation.
- Capstone defense review scheduling and feedback ledger.

### 3. Dependencies
- Upstream: Sprint 5 (Exercises), Sprint 7 (Competency Gates).
- Downstream: Sprint 8 (Portfolio), Sprint 11 (Job Readiness).

### 4. Deliverables
- Migration: `create_capstone_domain_schema` + Capstone project specs.
- `domains/capstone/`: Capstone repositories, milestone evaluation services, review orchestrator.
- `features/capstone/`: `CapstoneMilestoneStepper`, `SubmissionDropzone`, `RubricReviewPanel`.
- `tests/unit/capstone-services.test.ts`, `tests/unit/capstone-state-machine.test.ts`.

### 5. Acceptance Criteria
- Learners submit deliverables per milestone and receive automated and instructor scoring.
- Milestone advancement requires passing threshold scores (minimum 85/100).
- Completed capstone automatically attaches as a featured item in the Portfolio Domain.

### 6. Risks
- **Risk**: Reviewer bottlenecks delaying learner capstone advancement.
- **Mitigation**: Automated pre-check linters and test harnesses reduce manual review overhead by 70%.

---

## Sprint 10: Analytics & Insights Domain

### 1. Objectives
Implement platform-wide learning analytics, cohort performance dashboards, competency growth velocity metrics, and drop-off diagnostic reporting.

### 2. Features
- Schema for `analytics_events`, `cohort_metrics`, and `competency_aggregates`.
- Materialized views and cron rollup workers for cohort progress and time-to-gate-clearance.
- Instructor & Admin Analytics Dashboard: Engagement heatmaps, exercise failure clusters, gate velocity.
- Individual Learner Mastery Trajectory: Predictive time-to-graduation forecasts.

### 3. Dependencies
- Upstream: Sprints 3–7 (Learning, Competency, Exercise, XP, Gates).
- Downstream: Sprint 11 (Job Readiness).

### 4. Deliverables
- Migration: `create_analytics_domain_schema` + analytical materialized views.
- `domains/analytics/`: Event ingestion repository, aggregation services, metrics query engine.
- `features/analytics/`: `CohortVelocityChart`, `CompetencyHeatmap`, `FailureClusterTable`.
- `tests/unit/analytics-services.test.ts`.

### 5. Acceptance Criteria
- Analytical aggregations execute asynchronously without impacting OLTP write throughput.
- Ingestion pipeline logs anonymized events compliant with GDPR privacy standards.
- Dashboards load aggregated metrics in < 400ms.

### 6. Risks
- **Risk**: Analytics query load slowing down operational database transactions.
- **Mitigation**: Read-replica routing and materialized view scheduled refreshes.

---

## 11. Sprint 11: Job Readiness & Recruiter Domain

### 1. Objectives
Build the career placement engine, AI technical interview simulator, algorithmic Employability Index, and talent search portal for hiring partners.

### 2. Features
- Schema for `job_readiness_profiles`, `interview_simulations`, `recruiter_searches`, and `employer_inquiries`.
- Algorithmic Employability Index (0–1000) weighting verified competencies, gate clearance velocity, clean code scores, and test coverage rigor.
- AI Technical Interview Simulator: Real-time LLM-driven voice/text technical interview testing architectural defense and problem decomposition.
- Recruiter Talent Search: Filter candidates by verified competency codes (`DBM-01`, `ARC-01`), gate levels, and capstone ratings.

### 3. Dependencies
- Upstream: Sprints 4, 7, 8, 9, 10 (Competencies, Gates, Portfolio, Capstone, Analytics).
- Downstream: Platform Graduation & Employer Network.

### 4. Deliverables
- Migration: `create_job_readiness_domain_schema`.
- `domains/job_readiness/`: Scoring algorithms, interview simulation service, recruiter search repository.
- `features/job-readiness/`: `EmployabilityScoreGauge`, `InterviewSimulatorChat`, `RecruiterFilterPortal`.
- `tests/unit/job-readiness-services.test.ts`, `tests/unit/employability-algorithm.test.ts`.

### 5. Acceptance Criteria
- Employability score recalculates deterministically based on auditable mastery achievements.
- AI interview simulation records full transcripts, evaluates answers against rubrics, and logs results.
- Recruiter portal permits direct candidate contact while respecting learner privacy preferences.

### 6. Risks
- **Risk**: LLM bias or hallucination during AI interview evaluation.
- **Mitigation**: Rubric-constrained structured output generation and confidence threshold validation.

---

## 12. Cross-Sprint Release & Quality Invariants

1. **Zero Breaking Changes**: Sprints 8 through 11 must NOT modify or refactor previously completed domains (Sprints 1–7).
2. **Continuous Green Build**: Every PR must pass all unit and integration test suites with a 100% pass rate.
3. **Database Migration Governance**: All migrations must be idempotent, backwards-compatible, and accompanied by TypeScript type updates.
4. **Security & RLS Sign-Off**: No table is deployed to production without verified Row-Level Security policies.
