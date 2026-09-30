-- ==============================================================================
-- Migration: 20260930_sync_canonical_gates.sql
-- Description: Synchronizes public.competency_gates, public.gate_requirements,
--              and public.gate_competencies with the 9-Gate Canonical Capability Architecture.
-- Idempotency: Fully idempotent using UPSERT and deterministic gate UUIDs.
-- Safety: Eradicates XP-only progression loopholes and enforces 5-factor mastery.
-- Target DB: Supabase PostgreSQL 15.1+ (ai-native-lms)
-- Author: Principal Database Architect & Curriculum Systems Engineer
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Temporary Slug Prefixing to prevent transient UNIQUE(slug) collision
-- ------------------------------------------------------------------------------

UPDATE public.competency_gates 
SET slug = 'temp-' || slug 
WHERE id IN (SELECT id FROM public.competency_gates);


-- ------------------------------------------------------------------------------
-- 2. Synchronize Canonical Competency Gates (9 Canonical Capability Gates)
-- ------------------------------------------------------------------------------

INSERT INTO public.competency_gates (
  id, slug, name, description, gate_level, is_active
) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'gate-1-foundations',
    'Gate 1: Foundations',
    'Certifies absolute fluency with the professional developer workstation: Unix CLI, Git version control, SSH cryptographic authentication, and Markdown technical documentation.',
    1,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'gate-2-programmer',
    'Gate 2: Programmer',
    'Certifies core computational literacy, algorithmic problem-solving, synchronous procedural logic, and asynchronous dataflow in modern TypeScript.',
    2,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'gate-3-frontend-engineer',
    'Gate 3: Frontend Engineer',
    'Certifies capability to build high-performance, accessible, and reactive web user interfaces using Next.js 15 App Router, React 19, Tailwind CSS, and isolated Zustand state stores.',
    3,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'gate-4-backend-engineer',
    'Gate 4: Backend Engineer',
    'Certifies fullstack backend capabilities: type-safe Server Actions, RESTful Route Handlers, Zod runtime schema contracts, and Supabase Auth session security.',
    4,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'gate-5-database-engineer',
    'Gate 5: Database Engineer',
    'Certifies relational database design, 3NF normalization, B-Tree indexing, idempotent PostgreSQL migrations, and multi-tenant Row-Level Security (RLS) policies.',
    5,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000006',
    'gate-6-enterprise-engineer',
    'Gate 6: Enterprise Engineer',
    'Certifies DevOps and cloud production delivery: multi-stage Docker containerization, automated GitHub Actions CI/CD workflows, environment secret isolation, and deterministic test pyramids.',
    6,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000007',
    'gate-7-ai-native-engineer',
    'Gate 7: AI-Native Engineer',
    'Certifies intent-driven architecture, prompt-driven code generation, context window token optimization, repository constitutions (AGENTS.md, .cursorrules), and deliberate AI hallucination auditing.',
    7,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000008',
    'gate-8-agentic-engineer',
    'Gate 8: Agentic Engineer',
    'Certifies autonomous AI agent toolchains using the Model Context Protocol (MCP), Domain-Driven Design (DDD) bounded contexts, Finite State Machines (FSM), and structured telemetry observability.',
    8,
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000009',
    'gate-9-graduate',
    'Gate 9: Graduate',
    'Certifies terminal enterprise software engineering competence: OWASP Top 10 hardening, prompt injection defense, immutable audit ledgers, fullstack synthesis across all 4 Capstones, and oral architectural defense.',
    9,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  gate_level = EXCLUDED.gate_level,
  is_active = EXCLUDED.is_active;


-- ------------------------------------------------------------------------------
-- 3. Synchronize Gate Competency Junctions (public.gate_competencies)
-- ------------------------------------------------------------------------------

DELETE FROM public.gate_competencies;

-- Gate 1 (DEV-00)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES (
  'a1000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.competencies WHERE code = 'DEV-00')
) ON CONFLICT (gate_id, competency_id) DO NOTHING;

-- Gate 2 (PRG-01, ASY-01)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES 
  ('a1000000-0000-0000-0000-000000000002', (SELECT id FROM public.competencies WHERE code = 'PRG-01')),
  ('a1000000-0000-0000-0000-000000000002', (SELECT id FROM public.competencies WHERE code = 'ASY-01'))
ON CONFLICT (gate_id, competency_id) DO NOTHING;

-- Gate 3 (FED-01)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES (
  'a1000000-0000-0000-0000-000000000003',
  (SELECT id FROM public.competencies WHERE code = 'FED-01')
) ON CONFLICT (gate_id, competency_id) DO NOTHING;

-- Gate 4 (API-01, SDD-02)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES 
  ('a1000000-0000-0000-0000-000000000004', (SELECT id FROM public.competencies WHERE code = 'API-01')),
  ('a1000000-0000-0000-0000-000000000004', (SELECT id FROM public.competencies WHERE code = 'SDD-02'))
ON CONFLICT (gate_id, competency_id) DO NOTHING;

-- Gate 5 (DBM-01)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES (
  'a1000000-0000-0000-0000-000000000005',
  (SELECT id FROM public.competencies WHERE code = 'DBM-01')
) ON CONFLICT (gate_id, competency_id) DO NOTHING;

-- Gate 6 (OPS-01, CTX-02)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES 
  ('a1000000-0000-0000-0000-000000000006', (SELECT id FROM public.competencies WHERE code = 'OPS-01')),
  ('a1000000-0000-0000-0000-000000000006', (SELECT id FROM public.competencies WHERE code = 'CTX-02'))
ON CONFLICT (gate_id, competency_id) DO NOTHING;

-- Gate 7 (CTX-01, SDD-01)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES 
  ('a1000000-0000-0000-0000-000000000007', (SELECT id FROM public.competencies WHERE code = 'CTX-01')),
  ('a1000000-0000-0000-0000-000000000007', (SELECT id FROM public.competencies WHERE code = 'SDD-01'))
ON CONFLICT (gate_id, competency_id) DO NOTHING;

-- Gate 8 (AGT-01, ARC-01, AGT-02)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES 
  ('a1000000-0000-0000-0000-000000000008', (SELECT id FROM public.competencies WHERE code = 'AGT-01')),
  ('a1000000-0000-0000-0000-000000000008', (SELECT id FROM public.competencies WHERE code = 'ARC-01')),
  ('a1000000-0000-0000-0000-000000000008', (SELECT id FROM public.competencies WHERE code = 'AGT-02'))
ON CONFLICT (gate_id, competency_id) DO NOTHING;

-- Gate 9 (GOV-01, CAP-01)
INSERT INTO public.gate_competencies (gate_id, competency_id)
VALUES 
  ('a1000000-0000-0000-0000-000000000009', (SELECT id FROM public.competencies WHERE code = 'GOV-01')),
  ('a1000000-0000-0000-0000-000000000009', (SELECT id FROM public.competencies WHERE code = 'CAP-01'))
ON CONFLICT (gate_id, competency_id) DO NOTHING;


-- ------------------------------------------------------------------------------
-- 4. Synchronize Multi-Factor Gate Requirements (public.gate_requirements)
-- ------------------------------------------------------------------------------

-- Purge legacy requirements (including defective XP-only entries)
DELETE FROM public.gate_requirements;

-- Gate 1 Requirements (Foundations)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000001', 'competency', '{"minimum_state": "mastered", "competency_codes": ["DEV-00"]}'),
  ('a1000000-0000-0000-0000-000000000001', 'exercise', '{"count": 3, "description": "Pass 3 core workstation labs (lab-0-cli-git-nav, lab-0-ssh-auth, lab-0-git-branching)"}'),
  ('a1000000-0000-0000-0000-000000000001', 'artifact', '{"count": 3, "description": "Submit 3 verified evidence artifacts (GitHub profile with SSH, signed commit hash, deployed Markdown site)"}'),
  ('a1000000-0000-0000-0000-000000000001', 'lesson', '{"count": 3, "description": "Complete all foundational workstation lessons"}'),
  ('a1000000-0000-0000-0000-000000000001', 'xp', '{"min_xp": 100}');

-- Gate 2 Requirements (Programmer)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000002', 'competency', '{"minimum_state": "mastered", "competency_codes": ["PRG-01", "ASY-01"]}'),
  ('a1000000-0000-0000-0000-000000000002', 'exercise', '{"count": 3, "description": "Pass algorithmic drills and async runtime labs (lab-1-algo-drills, lab-2-event-loop, lab-2-network-fetch)"}'),
  ('a1000000-0000-0000-0000-000000000002', 'artifact', '{"count": 2, "description": "Submit green Vitest test suite (>30 assertions) and state-persisted CLI project repository"}'),
  ('a1000000-0000-0000-0000-000000000002', 'lesson', '{"count": 5, "description": "Complete procedural logic and asynchronous runtime lessons"}'),
  ('a1000000-0000-0000-0000-000000000002', 'xp', '{"min_xp": 250}');

-- Gate 3 Requirements (Frontend Engineer)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000003', 'competency', '{"minimum_state": "mastered", "competency_codes": ["FED-01"]}'),
  ('a1000000-0000-0000-0000-000000000003', 'exercise', '{"count": 3, "description": "Pass frontend layout, Zustand store, and a11y audit labs (lab-5-app-router-layout, lab-5-zustand-store, lab-5-a11y-audit)"}'),
  ('a1000000-0000-0000-0000-000000000003', 'artifact', '{"count": 3, "description": "Submit live Vercel deployment URL, Lighthouse audit score >95%, and RTL component test suite"}'),
  ('a1000000-0000-0000-0000-000000000003', 'lesson', '{"count": 4, "description": "Complete React 19 and Next.js 15 frontend lessons"}'),
  ('a1000000-0000-0000-0000-000000000003', 'xp', '{"min_xp": 450}');

-- Gate 4 Requirements (Backend Engineer)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000004', 'competency', '{"minimum_state": "mastered", "competency_codes": ["API-01", "SDD-02"]}'),
  ('a1000000-0000-0000-0000-000000000004', 'exercise', '{"count": 3, "description": "Pass Server Actions, Zod contracts, and auth middleware labs (lab-6-server-actions, lab-7-zod-contracts, lab-6-auth-middleware)"}'),
  ('a1000000-0000-0000-0000-000000000004', 'artifact', '{"count": 2, "description": "Submit authenticated API integration test suite and OpenAPI 3.0 specification"}'),
  ('a1000000-0000-0000-0000-000000000004', 'lesson', '{"count": 4, "description": "Complete Server Actions and Zod schema contract lessons"}'),
  ('a1000000-0000-0000-0000-000000000004', 'xp', '{"min_xp": 650}');

-- Gate 5 Requirements (Database Engineer)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000005', 'competency', '{"minimum_state": "mastered", "competency_codes": ["DBM-01"]}'),
  ('a1000000-0000-0000-0000-000000000005', 'exercise', '{"count": 3, "description": "Pass relational schema, RLS policies, and index optimization labs (lab-9-relational-schema, lab-9-rls-policies, lab-9-index-optimization)"}'),
  ('a1000000-0000-0000-0000-000000000005', 'artifact', '{"count": 2, "description": "Submit idempotent PostgreSQL migration file and automated RLS tenant isolation penetration test suite"}'),
  ('a1000000-0000-0000-0000-000000000005', 'lesson', '{"count": 3, "description": "Complete PostgreSQL schema and Row-Level Security lessons"}'),
  ('a1000000-0000-0000-0000-000000000005', 'xp', '{"min_xp": 850}');

-- Gate 6 Requirements (Enterprise Engineer)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000006', 'competency', '{"minimum_state": "mastered", "competency_codes": ["OPS-01", "CTX-02"]}'),
  ('a1000000-0000-0000-0000-000000000006', 'exercise', '{"count": 3, "description": "Pass Docker build, GitHub Actions CI/CD, and MSW mock harness labs (lab-10-docker-build, lab-10-github-actions, lab-11-mock-testing)"}'),
  ('a1000000-0000-0000-0000-000000000006', 'artifact', '{"count": 3, "description": "Submit GitHub Actions CI workflow logs, live cloud deployment URL with health check, and test pyramid report (>90% coverage)"}'),
  ('a1000000-0000-0000-0000-000000000006', 'lesson', '{"count": 4, "description": "Complete Docker containerization, CI/CD, and test pyramid lessons"}'),
  ('a1000000-0000-0000-0000-000000000006', 'xp', '{"min_xp": 1100}');

-- Gate 7 Requirements (AI-Native Engineer)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000007', 'competency', '{"minimum_state": "mastered", "competency_codes": ["CTX-01", "SDD-01"]}'),
  ('a1000000-0000-0000-0000-000000000007', 'exercise', '{"count": 3, "description": "Pass token budgeting, specification authoring, and hallucination audit drills (lab-3-token-budgeting, lab-4-spec-authoring, lab-4-hallucination-audit)"}'),
  ('a1000000-0000-0000-0000-000000000007', 'artifact', '{"count": 3, "description": "Submit AGENTS.md constitution, recorded AI pairing audit log, and authored ADR-001.md specification"}'),
  ('a1000000-0000-0000-0000-000000000007', 'lesson', '{"count": 4, "description": "Complete context engineering, token economics, and intent specification lessons"}'),
  ('a1000000-0000-0000-0000-000000000007', 'xp', '{"min_xp": 1350}');

-- Gate 8 Requirements (Agentic Engineer)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000008', 'competency', '{"minimum_state": "mastered", "competency_codes": ["AGT-01", "ARC-01", "AGT-02"]}'),
  ('a1000000-0000-0000-0000-000000000008', 'exercise', '{"count": 3, "description": "Pass MCP tool server, DDD FSM state machine, and telemetry observability labs (lab-8-mcp-server, lab-12-ddd-fsm, lab-13-telemetry)"}'),
  ('a1000000-0000-0000-0000-000000000008', 'artifact', '{"count": 3, "description": "Submit functional MCP JSON-RPC tool server, isolated DDD domain unit test suite, and structured JSON telemetry log output"}'),
  ('a1000000-0000-0000-0000-000000000008', 'lesson', '{"count": 4, "description": "Complete MCP protocol, DDD bounded contexts, and agentic observability lessons"}'),
  ('a1000000-0000-0000-0000-000000000008', 'xp', '{"min_xp": 1650}');

-- Gate 9 Requirements (Graduate)
INSERT INTO public.gate_requirements (gate_id, requirement_type, requirement_value)
VALUES
  ('a1000000-0000-0000-0000-000000000009', 'competency', '{"minimum_state": "mastered", "competency_codes": ["GOV-01", "CAP-01"]}'),
  ('a1000000-0000-0000-0000-000000000009', 'exercise', '{"count": 2, "description": "Pass OWASP security audit drill and architectural defense rehearsal (lab-14-owasp-audit, lab-15-defense-prep)"}'),
  ('a1000000-0000-0000-0000-000000000009', 'artifact', '{"count": 5, "description": "Submit 4 deployed production capstones, 500+ commit audit trail, 200+ test suite, 20-min recorded oral defense, and verified portfolio"}'),
  ('a1000000-0000-0000-0000-000000000009', 'achievement', '{"count": 4, "description": "Earn all 4 major capstone milestone achievements"}'),
  ('a1000000-0000-0000-0000-000000000009', 'lesson', '{"count": 3, "description": "Complete enterprise governance, security threat modeling, and defense preparation lessons"}'),
  ('a1000000-0000-0000-0000-000000000009', 'xp', '{"min_xp": 2000}');

COMMIT;
