# Portfolio Domain Specification & Architecture
# AI-Native Software Engineering LMS (`ai-native-lms`)

**Document Version:** 1.0.0  
**Status:** Certified & Production-Ready  
**Domain Classification:** Professional Evidence Layer  
**Authority:** Principal Software Architect & Head of Engineering

---

## 1. Executive Summary

The **Portfolio Domain** serves as the verifiable professional evidence layer of the AI-Native Software Engineering LMS. It answers the fundamental question:

> **"What proof does the learner have?"**

Rather than relying on self-reported resumes or unvalidated claims, the Portfolio Domain aggregates cryptographic, immutable records of achievement, code exercise proofs, rubric-validated competency mastery, milestone gate completions, and production artifacts into a unified, employer-facing profile.

### Core Domain Principles
1. **Verifiable Proof**: Every portfolio entry links directly to an automated test run, git commit, or evaluator-approved gate submission.
2. **Idempotent Aggregation**: Automated aggregation engines can run frequently without duplicating evidence, artifacts, or hiring signals.
3. **Strict Bounded Context Isolation**: Reads from Certified Domains (Learning, Competency, Exercise, Achievement & XP, Competency Gates) without mutating them.
4. **Clean Domain Separation**: Does *not* calculate employability scores or evaluate job readiness (reserved for future domains).

---

## 2. Domain Entities & Database Architecture

### 2.1 Entity Relationship Model

```mermaid
erDiagram
    USERS ||--|| PORTFOLIOS : "owns (1:1)"
    PORTFOLIOS ||--o{ PORTFOLIO_SECTIONS : "contains"
    PORTFOLIOS ||--o{ PORTFOLIO_PROJECTS : "showcases"
    PORTFOLIOS ||--o{ PORTFOLIO_ARTIFACTS : "catalogs"
    PORTFOLIOS ||--o{ PORTFOLIO_EVIDENCE : "aggregates"
    PORTFOLIOS ||--o{ PORTFOLIO_COMPETENCIES : "links"
    PORTFOLIOS ||--o{ PORTFOLIO_ACHIEVEMENTS : "links"
    PORTFOLIOS ||--o{ PORTFOLIO_HIRING_SIGNALS : "generates"

    PORTFOLIOS {
        uuid id PK
        uuid user_id FK
        text title
        text description
        timestamp created_at
        timestamp updated_at
    }

    PORTFOLIO_SECTIONS {
        uuid id PK
        uuid portfolio_id FK
        text section_type
        text title
        int display_order
    }

    PORTFOLIO_PROJECTS {
        uuid id PK
        uuid portfolio_id FK
        text title
        text description
        text project_type
        text status
        timestamp created_at
    }

    PORTFOLIO_ARTIFACTS {
        uuid id PK
        uuid portfolio_id FK
        text artifact_type
        text source_domain
        uuid source_id
        text title
        text description
        timestamp created_at
    }

    PORTFOLIO_EVIDENCE {
        uuid id PK
        uuid portfolio_id FK
        text evidence_type
        text evidence_reference
        uuid competency_id
        timestamp created_at
    }

    PORTFOLIO_COMPETENCIES {
        uuid id PK
        uuid portfolio_id FK
        uuid competency_id FK
    }

    PORTFOLIO_ACHIEVEMENTS {
        uuid id PK
        uuid portfolio_id FK
        uuid achievement_id FK
    }

    PORTFOLIO_HIRING_SIGNALS {
        uuid id PK
        uuid portfolio_id FK
        text signal_type
        text signal_strength
        timestamp generated_at
    }
```

---

## 3. Supported Types & Classifications

### 3.1 Artifact Types
- `lesson_evidence`: Proof of completed curriculum lesson modules.
- `exercise_evidence`: Automated test harness results and code submissions.
- `competency_evidence`: Rubric evaluations verifying core engineering competencies.
- `achievement_evidence`: Milestone unlocks and badges.
- `gate_evidence`: Comprehensive Level 1-4 Competency Gate completions.
- `documentation_artifact`: Architectural design documents, RFCs, and API docs.
- `design_artifact`: System architecture diagrams, database ERDs, and dataflow charts.
- `project_artifact`: Production-grade repositories, microservices, and client apps.

### 3.2 Portfolio Sections
- `projects`: Featured engineering builds and implementations.
- `competencies`: Mastered capabilities verified by automated rubrics.
- `achievements`: Milestones, streaks, and XP reward badges.
- `artifacts`: Categorized technical code and design deliverables.
- `professional_evidence`: Immutable audit stream.
- `generated_work`: Future-extensible generative build outputs.

### 3.3 Supported Hiring Signals
- `competency_demonstrated`: High-confidence indicator of core skill mastery.
- `exercise_completed`: Algorithmic proof of problem-solving proficiency.
- `achievement_earned`: Proof of continuous effort and momentum.
- `gate_completed`: Strong multi-criteria engineering barrier validation.
- `artifact_produced`: Verified software architectural deliverable.

---

## 4. Aggregation Engine & Idempotency Flow

The **Portfolio Aggregation Engine** (`PortfolioAggregationService`) continuously reconciles live learning activity into the learner's portfolio.

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Learner
    participant App as Portfolio Page / API
    participant AggService as PortfolioAggregationService
    participant ExerciseDB as Exercise Domain Tables
    participant GateDB as Gate Domain Tables
    participant AchDB as Achievement Domain Tables
    participant CompDB as Competency Domain Tables
    participant PortfolioDB as Portfolio Domain Tables

    Learner->>App: Navigates to /portfolio or GET /api/portfolio/summary
    App->>AggService: aggregateUserPortfolio(userId)
    AggService->>PortfolioDB: getOrCreatePortfolio(userId)
    
    par Concurrently Query Upstream Domains
        AggService->>ExerciseDB: Query passed exercise submissions
        AggService->>GateDB: Query validated gate completions
        AggService->>AchDB: Query awarded achievements
        AggService->>CompDB: Query mastered competencies
        AggService->>PortfolioDB: Query existing evidence, artifacts, and signals
    end

    Note over AggService: Deduplicate against existing references & IDs (Idempotent)

    opt New Passed Exercises
        AggService->>PortfolioDB: Insert new evidence & 'exercise_completed' signal
    end

    opt New Completed Gates
        AggService->>PortfolioDB: Insert new gate evidence, artifact & 'gate_completed' signal
    end

    opt New Awarded Achievements
        AggService->>PortfolioDB: Sync portfolio_achievements & 'achievement_earned' signal
    end

    opt New Mastered Competencies
        AggService->>PortfolioDB: Sync portfolio_competencies & 'competency_demonstrated' signal
    end

    AggService-->>App: Aggregated Stats & Summary
    App-->>Learner: Render Clean Portfolio Dashboard
```

---

## 5. API Reference Layer

| Endpoint | Method | Description | Auth Required |
| :--- | :---: | :--- | :---: |
| `/api/portfolio` | `GET` | Retrieve or initialize learner portfolio record | `Yes` (User/Admin) |
| `/api/portfolio/summary` | `GET` | Aggregated portfolio snapshot with stats and nested views | `Yes` (User/Admin) |
| `/api/portfolio/artifacts` | `GET` | Filtered list of verified portfolio artifacts | `Yes` (User/Admin) |
| `/api/portfolio/projects` | `GET` | List all projects belonging to the learner portfolio | `Yes` (User/Admin) |
| `/api/portfolio/projects` | `POST` | Create a new custom project in the portfolio | `Yes` (Owner/Admin) |
| `/api/portfolio/competencies` | `GET` | List mastered competencies linked to the portfolio | `Yes` (User/Admin) |
| `/api/portfolio/achievements` | `GET` | List earned achievements linked to the portfolio | `Yes` (User/Admin) |
| `/api/portfolio/hiring-signals` | `GET` | List technical hiring signals generated for portfolio | `Yes` (User/Admin) |

---

## 6. Frontend Presentation Architecture

The user flow is strictly ordered according to the engineering specification:
1. **Overview & Meta Header**: High-level metrics, verified engineer badges, and portfolio description.
2. **Featured Projects**: Interactive grid with custom project creation modal.
3. **Professional Evidence**: Immutable audit logs with reference links.
4. **Mastered Competencies**: Badged technical competencies with rubric criteria status.
5. **Earned Achievements**: Gamified badges, XP bonuses, and tier classifications.
6. **Technical Hiring Signals**: Algorithmic strength indicators (`high`, `strong`, `medium`).
7. **Artifact Explorer**: Multi-category filterable search browser for all artifacts.

---

## 7. Security & Row-Level Security (RLS) Policies

Every portfolio table is protected by PostgreSQL kernel-level Row Level Security:

- **Learner Access**: Learners may `SELECT`, `INSERT`, `UPDATE`, and `DELETE` only records where `portfolio_id` maps to their `auth.uid()`.
- **System / Evidence Protection**: Generated evidence and signals cannot be mutated by arbitrary learners.
- **Admin Access**: Administrators possess global bypass policies for auditing and moderation.

---

## 8. Verification & Audit Results

- **TypeScript Typecheck**: `npx tsc --noEmit` &rarr; `0 errors`.
- **ESLint Code Quality**: `npm run lint` &rarr; `0 errors, 0 warnings`.
- **Vitest Unit & Integration Suites**: `npx vitest run` &rarr; `22 test files passed, 202/202 tests (100% green)`.
