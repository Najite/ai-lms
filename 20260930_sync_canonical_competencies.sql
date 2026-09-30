-- ==============================================================================
-- Migration: 20260930_sync_canonical_competencies.sql
-- Description: Synchronizes public.competencies and public.competency_categories 
--              with the canonical 16-competency framework specification.
-- Idempotency: Fully idempotent using UPSERT (ON CONFLICT (slug/code) DO UPDATE).
-- Safety: Preserves existing user progress, foreign keys, and existing IDs.
-- Target DB: Supabase PostgreSQL 15.1+ (ai-native-lms)
-- Author: Principal Database Architect & Curriculum Systems Engineer
-- ==============================================================================

BEGIN;

-- ------------------------------------------------------------------------------
-- 1. Synchronize Competency Categories (8 Canonical Domains)
-- ------------------------------------------------------------------------------

INSERT INTO public.competency_categories (slug, name, description, order_index)
VALUES
  (
    'developer-foundations',
    'Developer Foundations & Tooling',
    'Mastery of developer workstations, POSIX filesystems, shell streams, and Git version control.',
    1
  ),
  (
    'programming-runtimes',
    'Programming Logic & Runtimes',
    'Computational thinking, procedural logic, strict TypeScript typing, and asynchronous V8 event loop mechanics.',
    2
  ),
  (
    'specification-contracts',
    'Specification-Driven Architecture',
    'Formulation of unambiguous domain specifications, runtime Zod contracts, and type-safe invariants.',
    3
  ),
  (
    'fullstack-systems',
    'Fullstack Component & API Systems',
    'React 19, Next.js App Router, Zustand state stores, and type-safe REST/Server Action endpoints.',
    4
  ),
  (
    'database-systems',
    'Database Engineering & Security',
    'Relational data modeling, 3NF normalization, PostgreSQL ACID transactions, and Row-Level Security (RLS).',
    5
  ),
  (
    'quality-devops',
    'Quality Engineering & DevOps',
    'Deterministic Vitest test pyramids, MSW mocking, multi-stage Dockerfiles, and GitHub Actions CI/CD.',
    6
  ),
  (
    'ai-agentic-systems',
    'AI-Native & Agentic Engineering',
    'Context window curation, prompt engineering, Model Context Protocol (MCP) servers, and autonomous workflows.',
    7
  ),
  (
    'enterprise-governance',
    'Enterprise Governance & Synthesis',
    'Domain-Driven Design (DDD) bounded contexts, OWASP Top 10 security audits, and capstone architectural defense.',
    8
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  order_index = EXCLUDED.order_index,
  updated_at = timezone('utc'::text, now());


-- ------------------------------------------------------------------------------
-- 2. Synchronize Canonical Competencies (All 16 Master Competencies)
-- ------------------------------------------------------------------------------

-- Competency 1: DEV-00
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'DEV-00',
  'tooling-development-environment',
  'Tooling & Development Environment',
  'Fluency in Unix CLI, POSIX filesystem navigation, SSH key authentication, and developer hygiene.',
  'I can confidently operate terminal environments, navigate file trees, configure shell profiles, and manage SSH authentication with zero fear.',
  'foundational',
  1,
  (SELECT id FROM public.competency_categories WHERE slug = 'developer-foundations'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 2: PRG-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'PRG-01',
  'computational-thinking-procedural-logic',
  'Computational Thinking & TypeScript Syntax',
  'Procedural logic, variables, conditional control flow, loops, pure functions, and static typing.',
  'I can decompose complex algorithmic problems into pure, predictable functions using strict TypeScript syntax with zero any types.',
  'foundational',
  2,
  (SELECT id FROM public.competency_categories WHERE slug = 'programming-runtimes'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 3: ASY-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'ASY-01',
  'asynchronous-runtimes-data-flow',
  'Asynchronous Runtimes & Data Flow',
  'JavaScript event loop, microtask queues, Promises, async/await, network retries, and data streams.',
  'I can architect non-blocking asynchronous data pipelines, coordinate concurrent network fetches, and handle async failures gracefully.',
  'foundational',
  3,
  (SELECT id FROM public.competency_categories WHERE slug = 'programming-runtimes'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 4: CTX-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'CTX-01',
  'context-window-optimization',
  'AI Context Window & Prompt Optimization',
  'Context curation, token budget management, repository constitution authoring (AGENTS.md), and prompt architecture.',
  'I can structure codebase context and author binding agent constitutions to achieve deterministic, defect-free AI code generation.',
  'foundational',
  4,
  (SELECT id FROM public.competency_categories WHERE slug = 'ai-agentic-systems'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 5: SDD-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'SDD-01',
  'intent-specification-authoring',
  'Intent Specification & Domain Modeling',
  'Authoring formal behavioral requirements, pre/post-conditions, state machines, and system invariants.',
  'I can translate ambiguous product requirements into rigorous technical specifications and formal domain models before writing code.',
  'foundational',
  5,
  (SELECT id FROM public.competency_categories WHERE slug = 'specification-contracts'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 6: FED-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'FED-01',
  'frontend-component-systems-ui-state',
  'Frontend Component Systems & UI State',
  'React 19 Server/Client components, Next.js 15 App Router, Zustand state management, and WCAG AA accessibility.',
  'I can engineer accessible, high-performance web applications with clean separation between server-rendered layouts and isolated client state.',
  'intermediate',
  6,
  (SELECT id FROM public.competency_categories WHERE slug = 'fullstack-systems'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 7: API-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'API-01',
  'api-architecture-server-actions',
  'API Architecture & Server Actions',
  'Next.js Server Actions, RESTful Route Handlers, standardized response envelopes, and secure session management.',
  'I can design type-safe, resilient server APIs with standardized error envelopes and zero-trust authentication checks.',
  'intermediate',
  7,
  (SELECT id FROM public.competency_categories WHERE slug = 'fullstack-systems'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 8: SDD-02
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'SDD-02',
  'schema-contract-enforcement',
  'Schema Contract Enforcement & Validation',
  'Zod runtime payload validation, type narrowing, schema transforms, and cross-boundary contract testing.',
  'I can eliminate runtime crashes and schema drift by enforcing strict Zod validation barriers on all incoming network and database payloads.',
  'intermediate',
  8,
  (SELECT id FROM public.competency_categories WHERE slug = 'specification-contracts'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 9: AGT-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'AGT-01',
  'model-context-protocol-integration',
  'Model Context Protocol (MCP) Tool Integration',
  'Designing, exposing, and securing MCP JSON-RPC tool servers for autonomous AI agent workflows.',
  'I can build custom MCP tool servers that safely expose system capabilities, database queries, and APIs to autonomous AI agents.',
  'intermediate',
  9,
  (SELECT id FROM public.competency_categories WHERE slug = 'ai-agentic-systems'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 10: DBM-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'DBM-01',
  'relational-data-modeling-postgresql-rls',
  'Relational Data Modeling & PostgreSQL RLS',
  '3NF schema normalization, composite indexes, PostgreSQL transactions, and Row-Level Security (RLS) multi-tenancy.',
  'I can design high-performance relational database schemas and guarantee 100% tenant data isolation using PostgreSQL Row-Level Security.',
  'advanced',
  10,
  (SELECT id FROM public.competency_categories WHERE slug = 'database-systems'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 11: OPS-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'OPS-01',
  'cloud-containerization-cicd-pipelines',
  'Cloud Containerization & CI/CD Pipelines',
  'Multi-stage Docker containerization, automated GitHub Actions CI/CD workflows, and production deployment operations.',
  'I can package fullstack applications into production-hardened Docker containers and orchestrate automated CI/CD deployment pipelines.',
  'advanced',
  11,
  (SELECT id FROM public.competency_categories WHERE slug = 'quality-devops'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 12: CTX-02
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'CTX-02',
  'deterministic-test-harnessing',
  'Deterministic Test Harnessing & Verification',
  'Vitest test runner orchestration, MSW network mocking, Stryker mutation testing, and test pyramid architecture.',
  'I can construct deterministic automated test suites and mutation testing harnesses to rigorously verify both human and AI-generated code.',
  'advanced',
  12,
  (SELECT id FROM public.competency_categories WHERE slug = 'quality-devops'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 13: ARC-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'ARC-01',
  'domain-driven-design-bounded-contexts',
  'Domain-Driven Design & Bounded Contexts',
  'Domain-Driven Design (DDD), bounded context separation, Finite State Machine (FSM) policies, and Architectural Decision Records.',
  'I can architect scalable enterprise software using Domain-Driven Design, clean layered boundaries, and formally verified state machines.',
  'advanced',
  13,
  (SELECT id FROM public.competency_categories WHERE slug = 'enterprise-governance'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 14: AGT-02
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'AGT-02',
  'self-healing-and-observability',
  'Autonomous Resilience & Observability',
  'Self-healing agent workflows, structured JSON telemetry logging, distributed tracing, and transactional state rollbacks.',
  'I can engineer self-healing multi-agent systems instrumented with structured telemetry, exponential backoff retries, and automatic rollbacks.',
  'expert',
  14,
  (SELECT id FROM public.competency_categories WHERE slug = 'ai-agentic-systems'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 15: GOV-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'GOV-01',
  'enterprise-governance-owasp-security',
  'Enterprise Governance & OWASP Security',
  'OWASP Top 10 mitigation, prompt injection defense, cryptographic signature verification, and regulatory compliance audit ledgers.',
  'I can conduct comprehensive security audits, defend AI systems against prompt injection and RCE exploits, and maintain tamper-proof audit trails.',
  'expert',
  15,
  (SELECT id FROM public.competency_categories WHERE slug = 'enterprise-governance'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

-- Competency 16: CAP-01
INSERT INTO public.competencies (
  code, slug, title, description, statement, level, order_index, category_id, is_published
) VALUES (
  'CAP-01',
  'fullstack-capstone-synthesis-defense',
  'Fullstack Capstone Synthesis & Defense',
  'End-to-end enterprise system design, live cloud production deployment, and oral architectural defense before an evaluation board.',
  'I can synthesize all fullstack, cloud, and agentic AI engineering disciplines into a production system and defend its trade-offs before senior engineers.',
  'expert',
  16,
  (SELECT id FROM public.competency_categories WHERE slug = 'enterprise-governance'),
  true
) ON CONFLICT (code) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  statement = EXCLUDED.statement,
  level = EXCLUDED.level,
  order_index = EXCLUDED.order_index,
  category_id = EXCLUDED.category_id,
  is_published = EXCLUDED.is_published,
  updated_at = timezone('utc'::text, now());

COMMIT;
