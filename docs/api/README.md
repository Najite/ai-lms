# API Contracts & Server Actions

## 1. Purpose

The `/docs/api` documentation domain specifies all external and internal API contracts for the platform. This encompasses RESTful Route Handlers, Next.js Server Actions, RPC interfaces, Zod Data Transfer Objects (DTOs), standard response formats, and error handling taxonomies.

---

## 2. Ownership

- **Lead Owner:** Staff Backend Engineer & API Platform Lead
- **Secondary Stakeholders:** Staff Frontend Engineer, Fullstack Engineers
- **Review Cadence:** Continuous per route implementation & version bump

---

## 3. Contents & Documentation Index

| Document | Topic | Description | Status |
| :--- | :--- | :--- | :--- |
| `rest-endpoints.md` | REST Route Handlers | Complete catalogue of `/api/*` endpoints with method, headers, request/response bodies | Active |
| `server-actions.md` | Server Actions | Catalogue of Next.js Server Actions (`features/*/actions/*`) with cache revalidation specs | Active |
| `dto-schemas.md` | DTO Contracts | Zod input schemas, output types, and validation error format | Active |
| `error-taxonomy.md` | Error Standards | Standardized HTTP error responses, domain error codes, and recovery hints | Active |
| `authentication-flow.md` | Auth Headers | Bearer token validation, Supabase SSR cookie sessions, and role checks | Active |

---

## 4. API Response Conventions

All API route handlers and Server Actions return standard typed envelopes:

```typescript
// Successful Response
{
  "success": true,
  "data": T,
  "meta"?: {
    "page"?: number,
    "limit"?: number,
    "total"?: number
  }
}

// Error Response
{
  "success": false,
  "error": "Human-readable error description",
  "code"?: "DOMAIN_ERROR_CODE",
  "details"?: Record<string, unknown>
}
```

---

## 5. Domain API Endpoints Index

### Learning Endpoints
- `GET /api/paths` — List available learning paths.
- `GET /api/paths/[slug]` — Fetch full learning path with modules & lessons.
- `POST /api/learning/progress` — Record lesson progress transition.

### Competency Endpoints
- `GET /api/competencies` — List competencies catalogue with categories.
- `GET /api/users/me/competencies` — Get current user competency mastery levels.

### Exercise Endpoints
- `GET /api/exercises` — List exercises filtered by module or competency.
- `POST /api/exercises/[id]/attempt` — Start new exercise attempt.
- `POST /api/exercises/[id]/submit` — Submit code for automated evaluation.

### Achievement & XP Endpoints
- `GET /api/achievements` — List achievement badges catalogue.
- `GET /api/users/me/achievements` — Get user unlocked achievements and progress.
- `GET /api/users/me/xp/balance` — Get real-time accumulated XP balance.
- `GET /api/users/me/xp/transactions` — Get immutable XP transaction history ledger.

### Competency Gate Endpoints
- `GET /api/gates` — List active competency gates (Levels 1–7).
- `GET /api/gates/[id]` — Get gate by ID/slug with requirements and competency mappings.
- `GET /api/users/me/gates` — Get user gate progression overview.
- `POST /api/gates/[id]/attempt` — Start gate attempt.
- `POST /api/gates/[id]/evidence` — Submit traceable artifact proof.
- `POST /api/gates/[id]/validate` — Validate criteria and evaluate attempt.
- `POST /api/gates/[id]/complete` — Seal gate completion permanently.

---

## 6. Dependencies & Relationships

- **Upstream Inputs:**
  - [`/docs/architecture`](file:///home/gamp/Documents/lms/docs/architecture/README.md) & [`/docs/backend`](file:///home/gamp/Documents/lms/docs/backend/README.md) — Domain services and business logic.
- **Downstream Consumers:**
  - [`/docs/frontend`](file:///home/gamp/Documents/lms/docs/frontend/README.md) — Consumed by React hooks, components, and pages.
  - [`/docs/audits`](file:///home/gamp/Documents/lms/docs/audits/README.md) — API contract testing and vulnerability scanning.
