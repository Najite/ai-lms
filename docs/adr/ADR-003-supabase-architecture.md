# ADR-003: Supabase & PostgreSQL Relational Architecture

## Status
**ACCEPTED** (2026-09)

## Context
The platform requires a relational datastore capable of enforcing strict referential integrity across 18+ interconnected domain tables, handling multi-tenant security, executing complex composite queries for gate requirement evaluation, maintaining an immutable append-only transaction ledger, and supporting real-time subscriptions for XP and notification updates.

## Decision
We adopt **Supabase (PostgreSQL 15+)** as the primary datastore and auth infrastructure:
1. **Schema Migrations**: All schema modifications, foreign keys, check constraints, and RLS policies are version-controlled via sequential SQL files in `supabase/migrations/`.
2. **Row-Level Security (RLS)**: Enabled across 100% of tables (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`) to enforce tenant isolation at the database kernel level.
3. **Double-Entry Style Auditability**: Tables like `xp_transactions`, `gate_evidence`, `gate_validation`, and `gate_completion` are immutable.
4. **TypeScript Type Generation**: Supabase database schemas are reflected into `lib/supabase/types.ts` for full compile-time query type safety.

## Alternatives Considered
- **NoSQL / Document Database (MongoDB / DynamoDB)**: Document stores lack foreign key constraints, ACID transaction enforcement across multiple collections, and declarative Row-Level Security, risking orphaned records and inconsistent progress states.
- **Self-Hosted PostgreSQL with Prisma/Drizzle**: Adds infrastructure management overhead (hosting, backups, connection pooling, auth microservice) that Supabase provides out of the box.

## Tradeoffs
- **PostgreSQL Dependency**: Ties database logic to PostgreSQL-specific features (RLS, JSONB, native UUIDs).
- **Migration Discipline**: Every change requires strict SQL migration authoring and verification.

## Risks
- **RLS Performance Overhead on Complex Joins**: Complex multi-table sub-queries could incur latency if RLS policies re-evaluate recursively.
- **Mitigation**: Security definer helper functions, indexed foreign key columns, and simple non-recursive policy clauses (`auth.uid() = user_id`).

## Consequences
- Ironclad multi-tenant data isolation directly at the database layer.
- Zero data loss for competency certifications and XP transactions.
- Strongly typed Supabase query builder eliminating SQL injection vectors.
