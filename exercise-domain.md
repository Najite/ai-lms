# Exercise Domain Architecture & Specification

## 1. Domain Overview & Mission

The **Exercise Domain** serves as the practical execution and competency verification engine within the AI-Native Software Engineering LMS platform. It reinforces concepts introduced in the **Learning Domain** (Lessons, Modules, Paths) and produces verifiable, auditable evidence for the **Competency Domain**.

### Strict Architectural Boundaries
- **In Scope**:
  - Exercise catalogue and category mapping.
  - Interactive code workspaces with starter code and solution verification.
  - Multi-attempt lifecycle tracking (`exercise_attempts`).
  - Code submission evaluation against deterministic validation rules (`exercise_submissions`).
  - Exercise completion ledger with unique learner-exercise guarantees (`exercise_completion`).
  - Direct competency evidence generation and audit logging (`exercise_evidence`).
- **Strictly Out of Scope (Isolated to later domains)**:
  - ❌ XP and Points awarding (Achievement Domain).
  - ❌ Competency Gate evaluation and unlocking (Gate Domain).
  - ❌ Gamification achievements, streaks, and badges (Achievement Domain).
  - ❌ Portfolio artifact publishing (Portfolio Domain).
  - ❌ Capstone assessments (Capstone Domain).
  - ❌ Employability scoring and market analytics (Job Readiness & Analytics Domain).

---

## 2. Domain Entities & Database Schema

The database architecture is implemented in Supabase PostgreSQL under strict relational integrity constraints and Row-Level Security (RLS).

### Tables & Relationships

1. **`exercise_categories`**
   - Categorizes exercises by engineering subdomain (e.g., Domain-Driven Design, API Design, State Management).
   - Columns: `id`, `slug`, `name`, `description`, `order_index`, `created_at`, `updated_at`.

2. **`exercises`**
   - Core exercise entity associated with lessons and categories.
   - Columns: `id`, `lesson_id`, `category_id`, `slug`, `title`, `description`, `objective`, `instructions`, `expected_outcome`, `success_criteria`, `difficulty`, `starter_code`, `solution_template`, `validation_rules`, `estimated_minutes`, `max_attempts`, `order_index`, `is_published`, `created_at`, `updated_at`.
   - Constraints: Foreign keys to `lessons(id)` and `exercise_categories(id)`.

3. **`exercise_competencies`**
   - Junction table linking exercises to specific reinforced competencies.
   - Columns: `id`, `exercise_id`, `competency_id`, `weight`, `created_at`.
   - Constraints: Unique `(exercise_id, competency_id)`.

4. **`exercise_attempts`**
   - State machine container for a learner's progression through an exercise.
   - Columns: `id`, `exercise_id`, `user_id`, `attempt_number`, `state` (`available`, `in_progress`, `submitted`, `validated`, `completed`), `started_at`, `submitted_at`, `completed_at`, `created_at`, `updated_at`.
   - Indexes: `user_id`, `exercise_id`, `state`, `created_at`.

5. **`exercise_submissions`**
   - Immutable log of code submitted for validation within an attempt.
   - Columns: `id`, `attempt_id`, `user_id`, `exercise_id`, `submitted_code`, `content`, `status` (`passed`, `failed`, `error`), `validation_output` (JSON), `submitted_at`, `created_at`.
   - Indexes: `attempt_id`, `user_id`, `exercise_id`.

6. **`exercise_completion`**
   - Authoritative completion record for a learner on an exercise.
   - Columns: `id`, `user_id`, `exercise_id`, `best_attempt_id`, `status` (`completed`), `score` (0-100), `completed_at`, `created_at`, `updated_at`.
   - Constraints: Unique `(user_id, exercise_id)` preventing duplicate completions.
   - Indexes: `user_id`, `exercise_id`, `completed_at`.

7. **`exercise_evidence`**
   - Evidence records establishing that a learner demonstrated practical mastery of a competency through code verification.
   - Columns: `id`, `user_id`, `exercise_id`, `attempt_id`, `competency_id`, `evidence_type`, `evidence_payload` (JSON), `summary`, `created_at`.
   - Constraints: Unique `(user_id, exercise_id, attempt_id, competency_id)`.
   - Indexes: `user_id`, `exercise_id`, `competency_id`.

---

## 3. State Machine & Lifecycle

The exercise lifecycle is governed by a deterministic 5-state transition engine:

```
[AVAILABLE]
     │
     ▼ (startAttempt)
[IN_PROGRESS]
     │
     ▼ (submitSolution)
[SUBMITTED]
     │
     ▼ (evaluateSubmission)
[VALIDATED] (passed or failed)
     │
     ├────────────► (if passed) ──► [COMPLETED] (completeExercise)
     │
     └────────────► (if failed) ──► [IN_PROGRESS] (retry within max_attempts)
```

### Transition Invariants
- `AVAILABLE` $\rightarrow$ `IN_PROGRESS`: Triggered when learner starts an attempt. Verifies published status and maximum attempt limits.
- `IN_PROGRESS` $\rightarrow$ `SUBMITTED`: Triggered when code is sent to evaluation.
- `SUBMITTED` $\rightarrow$ `VALIDATED`: Immediate automated validation execution against `validation_rules`.
- `VALIDATED` $\rightarrow$ `COMPLETED`: Triggered on passing validation. Emits completion event, upserts `exercise_completion`, and records `exercise_evidence`.
- Completed attempts are immutable and cannot accept further modifications.

---

## 4. Backend & Domain Architecture (`domains/exercise`)

The domain follows Domain-Driven Design (DDD) with clear separation of concerns:

```
domains/exercise/
├── models/             # Domain entities, value objects, and response contracts
├── dto/                # Data Transfer Objects for requests and filters
├── validators/         # Zod schemas for input validation
├── policies/           # Authorization policies enforcing least privilege
├── repositories/       # Supabase data access layer
│   ├── exercise.repository.ts
│   ├── exercise-attempt.repository.ts
│   ├── exercise-submission.repository.ts
│   └── exercise-evidence.repository.ts
└── services/           # Application domain services
    ├── exercise-query.service.ts
    ├── exercise-attempt.service.ts
    ├── exercise-submission.service.ts
    ├── exercise-completion.service.ts
    └── exercise-evidence.service.ts
```

### Service Contracts

- **`ExerciseQueryService`**:
  - `getById(idOrSlug, userId?)`: Retrieves exercise definition and user progress.
  - `getByLesson(lessonId, userId?)`: Retrieves exercises mapped to a lesson.
  - `getByCompetency(competencyId, userId?)`: Retrieves exercises reinforcing a competency.
  - `getAll(filters?, userId?)`: Query with category/search filters.
  - `getCategories()`: Lists all exercise categories.

- **`ExerciseAttemptService`**:
  - `startAttempt(userId, exerciseId)`: Starts a new attempt or resumes active attempt. Emits `exercise.started`.
  - `resumeAttempt(userId, exerciseId)`: Resumes existing unfinished attempt.
  - `cancelAttempt(userId, attemptId)`: Cancels active attempt before completion.

- **`ExerciseSubmissionService`**:
  - `submit(userId, exerciseId, attemptId, submittedCode, content?)`: Validates and evaluates code. Emits `exercise.submitted` and `exercise.validated`.

- **`ExerciseCompletionService`**:
  - `validateCompletion(userId, exerciseId, attemptId)`: Checks eligibility for completion.
  - `completeExercise(userId, exerciseId, attemptId)`: Finalizes completion, upserts completion ledger, generates competency evidence, and emits `exercise.completed`.

- **`ExerciseEvidenceService`**:
  - `createEvidence(userId, exerciseId, attemptId, competencyId, summary, payload?)`: Records evidence.
  - `retrieveEvidence(userId, exerciseId?)`: Queries preserved evidence records.

---

## 5. REST API Specifications

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/exercises` | List published exercises with category/lesson filters | Optional |
| `GET` | `/api/exercises/[id]` | Get exercise details by UUID or slug | Optional |
| `GET` | `/api/lessons/[lessonId]/exercises` | List exercises for a specific lesson | Optional |
| `GET` | `/api/users/me/exercises` | Get exercises with current user progress | Learner (Auth) |
| `POST` | `/api/exercises/[id]/start` | Start an attempt on an exercise | Learner (Auth) |
| `POST` | `/api/exercises/[id]/submit` | Submit code solution for automated evaluation | Learner (Auth) |
| `POST` | `/api/exercises/[id]/complete` | Finalize passing attempt and record evidence | Learner (Auth) |
| `GET` | `/api/users/me/exercise-history` | Get full attempt and submission history | Learner (Auth) |
| `GET` | `/api/users/me/exercise-evidence` | Retrieve preserved competency evidence records | Learner (Auth) |

---

## 6. Frontend Architecture (`features/exercises`)

Built with React 19, Next.js App Router, Tailwind CSS v4, and Zustand state stores:

- **Components**:
  - `ExerciseListPage`: Interactive catalogue with filtering, search, and progress metrics.
  - `ExerciseDetailPage`: Workspace container with navigation breadcrumbs.
  - `ExerciseWorkspace`: Full code workspace with split-pane instructions, live editor, and verification output.
  - `ExerciseSubmissionForm`: Code editor, reset actions, and validation feedback cards.
  - `ExerciseCompletionCard`: Completion celebration with score and verified competency evidence ledger.
  - `ExerciseHistoryPage`: Complete audit table of all attempts, scores, and evidence timestamps.
- **State Management (Zustand)**:
  - `useExerciseStore` / `ExerciseStore`
  - `useExerciseAttemptStore` / `ExerciseAttemptStore`
  - `useExerciseSubmissionStore` / `ExerciseSubmissionStore`
  - `useExerciseCompletionStore` / `ExerciseHistoryStore`
- **Pages**:
  - `/exercises`: Exercise Catalogue.
  - `/exercises/[slug]`: Interactive Code Workspace.
  - `/exercises/history`: Learner Attempt History and Evidence Audit.

---

## 7. Observability & Telemetry

The Exercise Domain emits structured logs via `lib/logger.ts`:
- **`exercise.started`**: Emitted when a new attempt is created (`userId`, `exerciseId`, `attemptId`, `attemptNumber`).
- **`exercise.submitted`**: Emitted when code is received for validation (`userId`, `exerciseId`, `attemptId`, `codeLength`).
- **`exercise.validated`**: Emitted upon rule evaluation completion (`userId`, `exerciseId`, `attemptId`, `score`, `passed`, `executionTimeMs`).
- **`exercise.completed`**: Emitted upon successful finalization (`userId`, `exerciseId`, `attemptId`, `score`, `evidenceCount`).
