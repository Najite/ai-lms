# Achievement & XP Domain Architecture & Specification

## 1. Domain Overview & Mission

The **Achievement & XP Domain** serves as the gamification, reward ledger, and motivation tracking engine of the AI-Native Software Engineering LMS platform. It tracks learning consistency, exercise completion, competency progression, and milestone achievements through immutable transaction ledgers and auditable evidence records.

### Strict Architectural Boundaries
- **In Scope**:
  - Event-driven XP reward issuance for lessons, exercises, competencies, and achievements.
  - Immutable XP Transaction Ledger (`xp_transactions`).
  - Aggregated XP balances (`xp_balances`) maintained via database trigger.
  - Curated Achievement Categories and milestone criteria (`achievement_categories`, `achievements`, `achievement_requirements`).
  - Learner progress tracking and single-award guarantee (`achievement_progress`, `achievement_awards`).
  - Auditable achievement evidence records (`achievement_evidence`).
- **Strictly Out of Scope (Isolated to later domains)**:
  - ❌ Employability score determination (Job Readiness & Analytics Domain).
  - ❌ Competency Gate evaluation and unlocking (Gate Domain).
  - ❌ Portfolio artifact publishing (Portfolio Domain).
  - ❌ Capstone assessments (Capstone Domain).

---

## 2. Domain Entities & Database Schema

The database architecture is implemented in Supabase PostgreSQL under strict relational integrity constraints and Row-Level Security (RLS).

### Tables & Relationships

1. **`achievement_categories`**
   - Categorizes achievements by milestone type (e.g., Learning Milestones, Exercise Mastery, Competency Progression, Consistency & Dedication).
   - Columns: `id`, `name`, `slug`, `description`, `created_at`.

2. **`achievements`**
   - Core achievement definitions with reward metadata.
   - Columns: `id`, `category_id`, `name`, `slug`, `description`, `icon`, `xp_reward`, `is_active`, `created_at`.
   - Constraints: Foreign key to `achievement_categories(id)`, unique `slug`, positive `xp_reward`.

3. **`achievement_requirements`**
   - Specific criteria thresholds required to unlock an achievement.
   - Columns: `id`, `achievement_id`, `requirement_type`, `requirement_value`.
   - Constraints: Foreign key to `achievements(id)`.

4. **`achievement_progress`**
   - Learner progression towards unlocking an achievement.
   - Columns: `id`, `user_id`, `achievement_id`, `progress_value`, `completed_at`, `created_at`, `updated_at`.
   - Constraints: Unique `(user_id, achievement_id)` preventing duplicate progress tracking.

5. **`achievement_awards`**
   - Authoritative record of earned achievements.
   - Columns: `id`, `user_id`, `achievement_id`, `awarded_at`.
   - Constraints: Unique `(user_id, achievement_id)` guaranteeing single award issuance.

6. **`achievement_evidence`**
   - Auditable evidence references verifying milestone achievement.
   - Columns: `id`, `user_id`, `achievement_id`, `evidence_type`, `evidence_reference`, `created_at`.

7. **`xp_transactions`**
   - Immutable double-entry ledger of all granted XP.
   - Columns: `id`, `user_id`, `source_type` (`lesson_completion`, `exercise_completion`, `competency_progression`, `achievement`), `source_id`, `amount`, `created_at`.
   - Constraints: Positive `amount > 0`, unique `(user_id, source_type, source_id)` preventing duplicate XP grants.

8. **`xp_balances`**
   - Fast aggregate balance per learner, synchronized on ledger insertions.
   - Columns: `user_id`, `total_xp`, `updated_at`.
   - Constraints: Non-negative `total_xp >= 0`.

9. **`xp_events`**
   - Event audit log tracking triggering interactions.
   - Columns: `id`, `user_id`, `event_type`, `event_reference`, `created_at`.

---

## 3. XP System Design & Invariants

1. **Event-Driven & Immutable**:
   - XP is never updated in place. Every change creates an insert into `xp_transactions`.
   - Direct manual edits to `xp_balances` or `xp_transactions` by learners are prevented by RLS.
2. **Idempotency**:
   - `UNIQUE(user_id, source_type, source_id)` guarantees that completing the same lesson or exercise multiple times cannot grant duplicate XP.
3. **Supported Sources & Rewards**:
   - `lesson_completion`: 50 XP
   - `exercise_completion`: 75 XP
   - `competency_progression`: 100 XP
   - `achievement`: Variable (50 - 500 XP defined per achievement)

---

## 4. Backend & Domain Architecture (`domains/achievement`)

The domain follows Domain-Driven Design (DDD):

```
domains/achievement/
├── models/             # Domain entities, value objects, and response contracts
├── dto/                # Data Transfer Objects
├── validators/         # Zod schemas
├── policies/           # Authorization policies
├── repositories/       # Supabase data access layer
│   ├── achievement.repository.ts
│   ├── achievement-progress.repository.ts
│   ├── achievement-award.repository.ts
│   ├── achievement-evidence.repository.ts
│   ├── xp-transaction.repository.ts
│   └── xp-balance.repository.ts
└── services/           # Domain application services
    ├── achievement-query.service.ts
    ├── achievement-progress.service.ts
    ├── achievement-award.service.ts
    ├── xp-transaction.service.ts
    ├── xp-balance.service.ts
    └── achievement-evidence.service.ts
```

### Service Responsibilities

- **`AchievementQueryService`**:
  - `getAchievements(filters?)`: Lists active achievements.
  - `getAchievementById(idOrSlug)`: Fetches achievement by ID or slug.
  - `getUserAchievements(userId)`: Combines definitions, progress, and awards for learner view.
  - `getCategories()`: Retrieves all categories.

- **`AchievementProgressService`**:
  - `updateProgress(userId, achievementId, progressValue)`: Updates progress and evaluates milestone.
  - `calculateProgress(userId, achievementId)`: Calculates percentage to target.

- **`AchievementAwardService`**:
  - `evaluateAchievement(userId, requirementType, currentCount)`: Evaluates milestones across categories.
  - `awardAchievement(userId, achievementId, evidenceType?, evidenceReference?)`: Grants award and associated XP.

- **`XPTransactionService`**:
  - `awardXP(userId, sourceType, sourceId, amount?)`: Creates immutable ledger entry and emits `xp.awarded`.
  - `createTransaction(userId, sourceType, sourceId, amount)`: Low-level transaction creator.
  - `getUserTransactions(userId, limit?)`: Fetches ledger audit history.

- **`XPBalanceService`**:
  - `getBalance(userId)`: Retrieves aggregate balance.
  - `calculateBalance(userId)`: Recalculates total by summing ledger transactions.

- **`AchievementEvidenceService`**:
  - `createEvidence(userId, achievementId, evidenceType, evidenceReference)`: Persists evidence.
  - `getEvidence(userId, achievementId?)`: Queries evidence records.

---

## 5. REST API Specifications

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/achievements` | List published achievements and categories | Optional |
| `GET` | `/api/achievements/[id]` | Get achievement detail by UUID or slug | Optional |
| `GET` | `/api/users/me/achievements` | Get current user's achievements with progress & awards | Learner (Auth) |
| `GET` | `/api/users/me/achievements/progress` | Get current user's raw progress records | Learner (Auth) |
| `GET` | `/api/users/me/xp` | Get current user's total XP balance | Learner (Auth) |
| `GET` | `/api/users/me/xp/history` | Get current user's immutable XP ledger history | Learner (Auth) |

---

## 6. Frontend Architecture (`features/achievements`)

- **State Management**:
  - `useAchievementStore` / `AchievementStore`
  - `useXPStore` / `XPStore`
- **Components**:
  - `AchievementCard`: Progress gauge, category styling, XP reward pill.
  - `AchievementBadge`: Dynamic icon with locked/unlocked state.
  - `XPBalanceDisplay`: Total XP, calculated level, and progress bar to next level.
  - `AchievementProgressList`: Filtering, search, and category tabs.
  - `XPTransactionTable`: Full audit ledger.
- **Pages**:
  - `/achievements`: Main learner achievements and XP dashboard.
