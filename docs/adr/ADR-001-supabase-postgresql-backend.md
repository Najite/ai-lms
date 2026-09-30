# ADR-001: Supabase & PostgreSQL as Primary Backend

## Status
**ACCEPTED** (2026-09)

## Context
The AI-Native Software Engineering LMS requires a relational database backend capable of enforcing ACID transactions, Row-Level Security (RLS) policies, JSON schema structures for dynamic assessment configurations, and real-time subscription capabilities. We needed a solution that integrates seamlessly with TypeScript fullstack development while minimizing infrastructure management overhead.

## Decision
We adopt **Supabase (PostgreSQL 15+)** as the primary datastore and authentication provider. All table schemas, foreign key constraints, indexes, and RLS policies are version-controlled via SQL migrations and executed using standard Supabase tooling and TypeScript type generation (`Database` interface).

## Consequences
### Positive
- Strict relational data integrity with foreign keys and unique constraints across all domains.
- Declarative security via PostgreSQL Row-Level Security (RLS) policies.
- Type-safe query building and schema reflection using `@supabase/supabase-js` and generated TypeScript definitions.
- Direct JSONB support for dynamic exercise rubrics, competency metadata, and gate criteria results.

### Trade-offs & Mitigations
- Schema migrations must be rigorously applied and tested sequentially.
- Local development requires either Supabase CLI or remote project integration via environment credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
