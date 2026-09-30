<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AI Engineering Constitution & Agent Governance Policy
# AI-Native Software Engineering LMS (`ai-native-lms`)

**Document Version:** 1.0.0  
**Status:** Mandatory & Binding on All Autonomous AI Agents and Human Contributors  
**Classification:** Core Governance Specification  
**Authority:** Principal Software Architect & Head of Engineering

---

## Preamble

This document establishes the **Engineering Constitution** governing all AI coding assistants, autonomous subagents, automated code generators, and human software engineers operating in this repository. 

Every agent interacting with this codebase MUST strictly adhere to these rules without exception. Bypassing, relaxing, or ignoring any policy in this constitution constitutes a critical defect and will cause immediate rejection of the agent's work.

---

## 1. Architecture Rules

1. **Strict Adherence to Domain-Driven Design (DDD)**:
   - Core domain logic MUST reside within `domains/<domain_name>/`.
   - Frontend feature components and client state MUST reside within `features/<domain_name>/`.
   - Next.js routing pages MUST reside within `app/<route_name>/`.
2. **Layered Separation of Concerns**:
   - Presentation Layer (`features/*`, `app/*`) &rarr; Application/API Layer (`app/api/*`, `features/*/actions/*`) &rarr; Domain Service Layer (`domains/*/services/*`) &rarr; Domain Repository Layer (`domains/*/repositories/*`) &rarr; Infrastructure Layer (`lib/supabase/*`).
   - UI components must NEVER call repositories or raw database clients directly; all access must flow through Server Actions or API Route Handlers into Domain Services.
3. **No Unilateral Architecture Redesign**:
   - AI agents are STRICTLY FORBIDDEN from redesigning system architecture, swapping frameworks, replacing the state management library (Zustand), changing database engines (Supabase PostgreSQL), or altering established directory hierarchies.
   - Any architectural modification requires an approved **Architectural Decision Record (ADR)** in `docs/adr/`.

---

## 2. Domain Rules & Certified Domain Immutability

1. **The Zero-Regression Immutability Law**:
   - Once a domain is certified and marked production-ready (Foundation, Auth, Learning, Competency, Exercise, Achievement & XP, Competency Gates), an AI agent implementing a subsequent domain MUST NOT modify, refactor, or delete code in previously certified domains unless explicitly requested by the user.
2. **Strict Bounded Context Isolation**:
   - A domain MUST NEVER directly mutate or query another domain's database tables.
   - Cross-domain interactions MUST occur exclusively through public Domain Service methods (e.g. `GateRequirementService` calling `AchievementQueryService` or reading through defined repository interfaces).
3. **Finite State Machine Integrity**:
   - Domain lifecycle transitions (e.g. Competency Gate states: `LOCKED` &rarr; `AVAILABLE` &rarr; `IN_PROGRESS` &rarr; `UNDER_REVIEW` &rarr; `VALIDATED` &rarr; `COMPLETED`) must be enforced through domain policy validators (`domains/*/policies/*`).
   - Outgoing transitions from terminal states (e.g. `COMPLETED` gate seal) are permanently forbidden.

---

## 3. Database Rules

1. **Version-Controlled Supabase Migrations Only**:
   - All schema alterations, new tables, foreign keys, indexes, and RLS policies MUST be authored as idempotent SQL migrations in `supabase/migrations/` and reflected in `lib/supabase/types.ts`.
   - Agents must never execute ad-hoc, untracked DDL queries.
2. **Mandatory Row-Level Security (RLS)**:
   - Every single table in the database MUST have RLS enabled (`ENABLE ROW LEVEL SECURITY`).
   - Tables must define explicit, granular policies for `SELECT`, `INSERT`, `UPDATE`, and `DELETE`.
3. **Referential Integrity & Constraints**:
   - Foreign keys must enforce appropriate referential actions (`ON DELETE CASCADE` or `ON DELETE SET NULL`).
   - Domain invariants (e.g. `UNIQUE(user_id, gate_id)` on `gate_completion`, `0 <= score <= 100`) MUST be enforced at the database kernel level via `UNIQUE` and `CHECK` constraints.
4. **No Raw Unparameterized SQL**:
   - All queries must utilize the type-safe Supabase query builder or parameterized RPCs to prevent SQL injection vulnerabilities.

---

## 4. Frontend Rules

1. **Feature-Based UI Organization**:
   - UI code must be structured inside `features/<feature_name>/`:
     - `components/`: Pure and stateful domain UI components.
     - `hooks/`: Custom React data fetching and lifecycle hooks.
     - `stores/`: Isolated Zustand stores for client-side state.
     - `actions/`: Next.js Server Actions with cache revalidation (`revalidatePath`).
     - `types/`: Frontend presentation contracts.
2. **React 19 & Next.js 15 Hook Hygiene**:
   - Avoid synchronous `setState` calls directly within `useEffect` bodies that trigger cascading re-renders.
   - All asynchronous data fetching inside hooks MUST implement cleanup flags (`let ignore = false; ... return () => { ignore = true; };`).
3. **Aesthetic Excellence & No Placeholders**:
   - The UI must feel premium, state-of-the-art, and responsive (curated HSL dark theme, glassmorphism, micro-animations, accessible contrast).
   - Agents must NEVER introduce placeholder text ("Lorem ipsum", "Coming soon", "TODO: Fix later") or broken image URLs.

---

## 5. Backend Rules

1. **Repository Pattern Implementation**:
   - All database access must be encapsulated inside typed Repository classes (`domains/<domain>/repositories/<entity>.repository.ts`).
   - Repositories must handle database nulls gracefully and map database rows to clean Domain Models.
2. **Pure Domain Services**:
   - Business logic, requirement evaluations, and transaction orchestration belong exclusively in Domain Services (`domains/<domain>/services/<entity>.service.ts`).
   - Services must return standardized `DomainResponse<T>` envelopes containing `{ success: boolean; data?: T; error?: string }`.
3. **Strict Input Validation**:
   - Every external API endpoint (`app/api/*`) and Server Action MUST validate all input parameters using Zod schemas (`domains/<domain>/validators/*`).
   - Unvalidated or loosely-typed payloads (`any`) are strictly prohibited.

---

## 6. Security Rules

1. **Zero-Trust Credential Isolation**:
   - `SUPABASE_SERVICE_ROLE_KEY` and administrative credentials must NEVER be exposed to client-side code, public variables, or git-committed artifacts.
   - Client code must only use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
2. **Role-Based Access Control (RBAC)**:
   - Elevated operations (e.g. validating gates, creating learning paths, awarding arbitrary XP) MUST explicitly verify that the requesting user possesses `instructor` or `admin` roles via domain policy checks.
3. **OWASP Top 10 Compliance**:
   - Sanitize all external inputs.
   - Enforce Content-Security-Policy (CSP) headers and sandbox rules for external URLs and embeds.

---

## 7. Testing Rules

1. **100% Green Build Rule**:
   - All test suites (`npx vitest run`) MUST pass with a 100% pass rate.
   - No pull request or task may be completed with failing, skipped, or commented-out tests.
2. **Zero TypeScript Errors & Zero ESLint Warnings**:
   - Code must compile with 0 errors via `npx tsc --noEmit`.
   - Code must pass ESLint with 0 warnings via `npm run lint`.
3. **Unit Test Coverage Mandate**:
   - Every new domain service, policy state machine, and Zod validator must be accompanied by comprehensive unit tests in `tests/unit/`.
   - Tests must mock database queries cleanly without leaving orphaned test data or depending on live internet connections.

---

## 8. Documentation Rules

1. **Single Source of Truth**:
   - Architectural decisions, PRDs, database designs, and roadmap schedules must be kept synchronised in `/docs`, `/PRD.md`, `/architecture.md`, and `/database-design.md`.
2. **ADR Mandate**:
   - Any fundamental change to storage paradigms, authentication flows, or system boundaries requires creating an Architectural Decision Record in `docs/adr/ADR-XXX.md`.
3. **No Phantom Documentation**:
   - Documentation must accurately reflect working, tested code. Do not document APIs or schemas that have not been implemented or verified.

---

## 9. Strictly Forbidden Behaviors Matrix

| Forbidden Behavior | Rationale & Consequence |
| :--- | :--- |
| ❌ **Redesigning System Architecture** | Violates project roadmap and breaks cross-domain integration contracts. |
| ❌ **Modifying Unrelated / Certified Domains** | Violates the Zero-Regression Law and introduces hidden regressions. |
| ❌ **Creating Placeholder / Mock Implementations in Production** | Subverts genuine mastery validation and corrupts audit trails. |
| ❌ **Adding Undocumented NPM Dependencies** | Introduces supply-chain security risks and package bloat. |
| ❌ **Bypassing Zod Validation or TypeScript Types** | Using `any` or bypassing input validation exposes endpoints to runtime crashes and security exploits. |
| ❌ **Disabling or Bypassing PostgreSQL RLS** | Destroys multi-tenant data isolation and exposes user progress to unauthorized access. |
| ❌ **Deleting, Skipping, or Commenting Out Tests** | Subverts the quality assurance process. |
| ❌ **Hardcoding Secrets or Private Keys** | Critical security violation. |

---

## 10. Verification & Audit Checklist

Before declaring any implementation or task complete, an AI Agent MUST execute and verify:

1. `npx tsc --noEmit` &rarr; Output must show **0 errors**.
2. `npm run lint` &rarr; Output must show **0 errors and 0 warnings**.
3. `npx vitest run` &rarr; Output must show **100% passing test suites**.
4. Database migrations applied and verified in `lib/supabase/types.ts`.
5. Documentation updated and cross-referenced with working code.
