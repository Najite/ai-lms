-- ==============================================================================
-- Migration: 20260930_sync_module_catalog.sql
-- Description: Synchronizes public.learning_paths, public.modules, and 
--              public.module_competencies with the canonical 14-module catalog (MOD-00 to MOD-13).
-- Idempotency: Fully idempotent using UPSERT and deterministic UUIDs.
-- Safety: Preserves existing learning records and maintains 100% referential integrity.
-- Target DB: Supabase PostgreSQL 15.1+ (ai-native-lms)
-- Author: Principal Database Architect & Curriculum Systems Engineer
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Synchronize Master Learning Path
-- ------------------------------------------------------------------------------

INSERT INTO public.learning_paths (
  id,
  slug,
  title,
  description,
  difficulty,
  estimated_hours,
  order_index,
  is_published
) VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'ai-native-software-engineering',
  'AI-Native Software Engineering (24-Month Comprehensive Track)',
  'Master the complete 24-month self-paced journey from complete beginner to elite AI-Native Software Engineer: 14 modules, 16 competencies, 9 capability gates, and 4 production capstones.',
  'beginner',
  1440,
  1,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  difficulty = EXCLUDED.difficulty,
  estimated_hours = EXCLUDED.estimated_hours,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());


-- ------------------------------------------------------------------------------
-- 2. Synchronize Canonical Modules (MOD-00 through MOD-13)
-- ------------------------------------------------------------------------------

-- MOD-00 (Phase 1, Months 1-2, 60h = 3600m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000000',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-00-digital-foundations',
  'MOD-00: Digital & Developer Foundations: From User to Systems Operator',
  'Demystify computers, eliminate command-line intimidation, master POSIX file trees, establish professional developer workstation hygiene, and build daily Git version control habits.',
  3600,
  1,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-01 (Phase 2, Months 2-5, 180h = 10800m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-01-programming-foundations',
  'MOD-01: Computational Thinking & Algorithmic Logic',
  'Develop pure computational reasoning, algorithmic decomposition, memory variables, primitive types, conditional branching, iteration loops, and pure functional encapsulation.',
  10800,
  2,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-02 (Phase 3, Months 5-7, 120h = 7200m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000002',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-02-javascript-foundations',
  'MOD-02: JavaScript Mechanics, V8 Engine & Asynchronous Data Flow',
  'Master the JavaScript runtime architecture: Call Stack, Web APIs, Event Loop, Microtask Queue, Promises, async/await, closures, lexical scoping, and functional array pipelines.',
  7200,
  3,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-03 (Phase 4, Months 7-9, 120h = 7200m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000003',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-03-typescript-foundations',
  'MOD-03: TypeScript Strict Contracts, Invariants & Type Systems',
  'Master structural subtyping, union types, discriminated unions, generic constraints, type narrowing, strict compiler configuration (tsconfig.json), and type-level state validation.',
  7200,
  4,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-04 (Phase 5, Months 9-11, 120h = 7200m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000004',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-04-web-platform-foundations',
  'MOD-04: Web Platform Standards, DOM Lifecycles & HTTP Architecture',
  'Master the browser platform: DOM tree manipulation, rendering lifecycles, semantic HTML5, modern CSS Grid/Flexbox layouts, accessible ARIA patterns, and the HTTP/1.1 & HTTP/2 protocol.',
  7200,
  5,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-05 (Phase 6, Months 11-13, 120h = 7200m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000005',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-05-frontend-engineering',
  'MOD-05: Modern Frontend Architecture: React 19, Next.js & UI State',
  'Master modern server-rendered and interactive frontend systems using React 19, Next.js 15 App Router, React Server Components (RSC), Suspense streaming, and isolated Zustand stores.',
  7200,
  6,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-06 (Phase 7, Months 13-15, 120h = 7200m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000006',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-06-backend-engineering',
  'MOD-06: Backend Engineering, Server Actions & RESTful API Systems',
  'Master server-side architecture: Next.js Server Actions, RESTful Route Handlers, standardized API response envelopes (DomainResponse<T>), Zod schema validation, and secure session management.',
  7200,
  7,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-07 (Phase 8, Months 15-17, 120h = 7200m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000007',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-07-database-engineering',
  'MOD-07: Relational Data Modeling, PostgreSQL & Row-Level Security',
  'Master relational database design: 3NF normalization, composite keys, B-Tree and GIN indexes, ACID transactions, version-controlled PostgreSQL migrations, and Supabase Row-Level Security (RLS).',
  7200,
  8,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-08 (Phase 9, Months 17-18, 60h = 3600m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000008',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-08-testing-quality-assurance',
  'MOD-08: Deterministic Testing, Test Harnessing & Mutation QA',
  'Master the test pyramid: deterministic unit testing with Vitest, component testing with React Testing Library, API mocking via Mock Service Worker (MSW), and Stryker mutation testing.',
  3600,
  9,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-09 (Phase 10, Months 18-20, 120h = 7200m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000009',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-09-enterprise-devops',
  'MOD-09: Cloud Containerization, CI/CD Pipelines & Production DevOps',
  'Master production operations: multi-stage Docker containerization, automated GitHub Actions CI/CD workflows, environment secret isolation, domain SSL provisioning, and cloud deployment.',
  7200,
  10,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-10 (Phase 11, Months 20-22, 120h = 7200m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000010',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-10-ai-native-systems',
  'MOD-10: AI Context Optimization, Intent Specification & LLM Orchestration',
  'Master intent-driven software architecture, prompt-driven code generation, context window curation, repository constitution files (AGENTS.md), and deliberate AI hallucination detection.',
  7200,
  11,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-11 (Phase 12, Months 22-23, 60h = 3600m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000011',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-11-agentic-systems-mcp',
  'MOD-11: Agentic Systems, Model Context Protocol (MCP) & DDD Architecture',
  'Build autonomous AI agent toolchains using the Model Context Protocol (MCP), structured telemetry logging (lib/logger.ts), distributed tracing, and Domain-Driven Design (DDD) bounded contexts.',
  3600,
  12,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-12 (Phase 13A, Month 23, 60h = 3600m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000012',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-12-enterprise-governance-security',
  'MOD-12: Enterprise Governance, OWASP Security & Compliance Sentinel',
  'Master enterprise compliance, OWASP Top 10 vulnerability mitigation, cryptographic signature verification, prompt injection defenses, and architectural threat modeling.',
  3600,
  13,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- MOD-13 (Phase 13B, Month 24, 60h = 3600m)
INSERT INTO public.modules (
  id, learning_path_id, slug, title, description, estimated_minutes, order_index, is_published
) VALUES (
  'b2000000-0000-0000-0000-000000000013',
  (SELECT id FROM public.learning_paths WHERE slug = 'ai-native-software-engineering'),
  'mod-13-capstone-synthesis-defense',
  'MOD-13: Capstone Synthesis, Technical Defense & Career Placement',
  'Synthesize all 16 competencies, finalize and deploy Capstone 4, pass oral architectural defense before an evaluation board, and launch the verified public employer portfolio.',
  3600,
  14,
  true
) ON CONFLICT (learning_path_id, slug) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  estimated_minutes = EXCLUDED.estimated_minutes,
  order_index = EXCLUDED.order_index,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());


-- ------------------------------------------------------------------------------
-- 3. Synchronize Module Competency Junctions (public.module_competencies)
-- ------------------------------------------------------------------------------

DELETE FROM public.module_competencies;

-- MOD-00 -> DEV-00 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000000',
  (SELECT id FROM public.competencies WHERE code = 'DEV-00'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-01 -> PRG-01 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000001',
  (SELECT id FROM public.competencies WHERE code = 'PRG-01'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-02 -> ASY-01 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000002',
  (SELECT id FROM public.competencies WHERE code = 'ASY-01'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-03 -> PRG-01 (weight 8), SDD-02 (weight 5)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES 
  ('b2000000-0000-0000-0000-000000000003', (SELECT id FROM public.competencies WHERE code = 'PRG-01'), 8),
  ('b2000000-0000-0000-0000-000000000003', (SELECT id FROM public.competencies WHERE code = 'SDD-02'), 5)
ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-04 -> FED-01 (weight 6)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000004',
  (SELECT id FROM public.competencies WHERE code = 'FED-01'),
  6
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-05 -> FED-01 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000005',
  (SELECT id FROM public.competencies WHERE code = 'FED-01'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-06 -> API-01 (weight 10), SDD-02 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES 
  ('b2000000-0000-0000-0000-000000000006', (SELECT id FROM public.competencies WHERE code = 'API-01'), 10),
  ('b2000000-0000-0000-0000-000000000006', (SELECT id FROM public.competencies WHERE code = 'SDD-02'), 10)
ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-07 -> DBM-01 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000007',
  (SELECT id FROM public.competencies WHERE code = 'DBM-01'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-08 -> CTX-02 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000008',
  (SELECT id FROM public.competencies WHERE code = 'CTX-02'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-09 -> OPS-01 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000009',
  (SELECT id FROM public.competencies WHERE code = 'OPS-01'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-10 -> CTX-01 (weight 10), SDD-01 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES 
  ('b2000000-0000-0000-0000-000000000010', (SELECT id FROM public.competencies WHERE code = 'CTX-01'), 10),
  ('b2000000-0000-0000-0000-000000000010', (SELECT id FROM public.competencies WHERE code = 'SDD-01'), 10)
ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-11 -> AGT-01 (weight 10), ARC-01 (weight 10), AGT-02 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES 
  ('b2000000-0000-0000-0000-000000000011', (SELECT id FROM public.competencies WHERE code = 'AGT-01'), 10),
  ('b2000000-0000-0000-0000-000000000011', (SELECT id FROM public.competencies WHERE code = 'ARC-01'), 10),
  ('b2000000-0000-0000-0000-000000000011', (SELECT id FROM public.competencies WHERE code = 'AGT-02'), 10)
ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-12 -> GOV-01 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000012',
  (SELECT id FROM public.competencies WHERE code = 'GOV-01'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

-- MOD-13 -> CAP-01 (weight 10)
INSERT INTO public.module_competencies (module_id, competency_id, weight)
VALUES (
  'b2000000-0000-0000-0000-000000000013',
  (SELECT id FROM public.competencies WHERE code = 'CAP-01'),
  10
) ON CONFLICT (module_id, competency_id) DO UPDATE SET weight = EXCLUDED.weight;

COMMIT;
