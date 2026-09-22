# AI-Powered LMS — $0 Budget Production Project Specification

> **Brutal honesty policy**: This document makes firm engineering decisions. Where a choice matters for architecture, one option is selected and the rationale is stated. Every technology selected operates permanently on **verified $0.00 free tiers** or leverages client/GitHub distributed compute. No "X or Y" hedging. No marketing language. No expensive enterprise services that cannot be run on a $0 budget.

---

## 1. What This Is

A strictly self-paced, AI-augmented Learning Management System engineered to train complete beginners into job-ready **AI-Native Software Engineers**. The platform delivers **600 deep, serialized lessons** (3,000 subtopics), including an accessible beginner programming ramp (Phases 0–3), an interactive in-browser WebAssembly practice sandbox for every lesson, an AI tutor grounded in curriculum materials (RAG via Supabase pgvector), and **22 enterprise capstone projects** executed on the student's local machine (VS Code, Cursor, Neovim) and pushed to GitHub for automated grading.

An **AI-Native Software Engineer** writes production-grade, clean, maintainable software where AI models, structured data contracts, vector search, streaming APIs, and autonomous tool-using agents are first-class architectural primitives.

It has **zero instructor-led sessions** and **zero video streaming overhead**. It is not a generic bootcamp or a superficial video portal. It is an automated, rigorous, first-principles engineering academy designed to be operated with **$0.00/month infrastructure costs**.

---

## 2. Realistic Scope, Team & Budget

### The $0 Budget Reality
This specification replaces the previous venture-capital model (which assumed a 10–12 person team and $1,200/month cloud bills) with a hardened, lean architecture achievable by a solo builder or small team with **$0.00 cloud spending**:

| Component | Paid Enterprise Stack (Previous) | $0 Production Alternative (Current) | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Database & Vectors** | Cloud SQL PostgreSQL ($120/mo) | **Supabase Free Tier (PostgreSQL 15 + pgvector)** | **$0.00** |
| **Auth & Security** | Clerk Enterprise ($35–$100+/mo) | **Supabase Auth + PostgreSQL RLS** | **$0.00** |
| **Web & API Hosting** | GCP GKE / Cloud Run ($80+/mo) | **Vercel Hobby / Cloudflare Pages** | **$0.00** |
| **Exercise Sandbox** | Cloud Run Docker Sandboxes ($150+/mo) | **Client-Side WebAssembly (Pyodide + Web Worker)** | **$0.00** |
| **Project Grading CI** | Dedicated GCP Runners ($100+/mo) | **GitHub API + GitHub Actions (2,000 free mins/mo)** | **$0.00** |
| **AI Generation & RAG** | OpenAI GPT-4o ($200+/mo) | **Google Gemini 1.5 Flash (Free Tier: 15 RPM)** | **$0.00** |
| **Video Delivery** | Mux Video Streaming ($270+/mo) | **Interactive Text, Code Diffs & Embedded YouTube** | **$0.00** |
| **Task Queue & Cache** | Upstash Redis + BullMQ ($30+/mo) | **PostgreSQL LISTEN/NOTIFY + pg_cron + Edge Functions** | **$0.00** |
| **Total Monthly Bill** | **~$1,000+ / month** | **100% Free Tier Compliant** | **$0.00** |

---

## 3. Technology Decisions ($0 Budget Production Stack)

Every choice below is a firm decision.

### 3.1 Frontend

| Layer | Decision | Why ($0 Budget Rationale) |
| :--- | :--- | :--- |
| Framework | **Next.js 14 (App Router)** | SSR for SEO on public course catalog, RSC for zero-bundle-size rendering, free hosting on Vercel. |
| Styling | **Tailwind CSS + shadcn/ui** | Zero runtime overhead; implements the Linear High-Density Mechanical Minimalism design system. |
| State (server) | **TanStack Query v5** | In-memory caching, optimistic UI updates, background refetch without paid Redis state. |
| State (client) | **Zustand** | Minimalist 1KB client state for interactive lesson progress and code editor preferences. |
| Rich Text / Content | **Markdown + Shiki** | Curriculum is stored and rendered as raw, highly structured markdown with syntax highlighting. $0 cost. |
| In-Browser Code Sandbox | **Pyodide (WASM) + Web Worker** | Code runs directly in the student's browser CPU/RAM. $0 server compute cost; 0ms network latency. |
| Code Editor | **Monaco Editor** | The VS Code web editor engine; provides industry-standard DX inside the browser for practice exercises. |
| Charts & Telemetry | **Recharts** | Lightweight, React-native, zero-cost data visualization for benchmark comparisons. |
| Accessibility | **WCAG 2.1 AA** | Mandatory accessibility standard with high-contrast text and full keyboard navigation (`⌘K`, `J`/`K`). |

### 3.2 Backend & Data Layer

| Layer | Decision | Why ($0 Budget Rationale) |
| :--- | :--- | :--- |
| Web API | **Next.js Route Handlers / Server Actions** | Type-safe, co-located with frontend, zero separate backend server instances to pay for. |
| Database | **Supabase (PostgreSQL 15)** | Free 500MB database, built-in PgBouncer/Supavisor pooling, Row Level Security, instant REST & Realtime APIs. |
| Auth | **Supabase Auth** | Free 50,000 MAUs, GitHub OAuth, Google OAuth, magic links, native JWT integration with Postgres RLS. |
| Vector Storage | **pgvector (HNSW index) on Supabase** | Free vector search inside PostgreSQL. Eliminates Pinecone/Qdrant costs ($70+/mo). |
| ORM | **Prisma / Kysely** | Strict TypeScript type safety, migration tracking, lightweight query compilation. |
| Realtime | **Supabase Realtime** | Free WebSockets for live grading status and automated test updates. |
| Storage | **Supabase Storage (1GB free)** | Free tier covers user avatars and course metadata; project repos are hosted on GitHub. |
| Automated Grading CI | **GitHub Actions** | Students push capstone code from local VS Code to GitHub. GitHub Actions runs test suites for $0. |

### 3.3 AI & Machine Learning Layer

| Capability | Decision | Why ($0 Budget Rationale) |
| :--- | :--- | :--- |
| Primary LLM | **Gemini 1.5 Flash (Free Tier)** | 15 RPM, 1,000,000 TPM, 1,500 requests/day via Google AI Studio API key at $0 cost. |
| Embeddings | **text-embedding-004 (Google)** | 768 dimensions, state-of-the-art retrieval quality, free tier allocation. |
| Vector Index | **pgvector HNSW (`m=16, ef_construction=64`)** | Sub-50ms approximate nearest neighbor retrieval without separate vector database. |
| Content Generation Engine | **Batch CLI with Pydantic / Zod Schemas** | Populates 600 lessons with structured JSON output, AST validation, and zero hallucinations. |
| SAST & Linter | **Ruff + Semgrep OSS (in GitHub Actions)** | Free open-source security and syntax checkers running inside GitHub CI. |

### 3.4 Infrastructure & Hosting

| Layer | Decision | Why ($0 Budget Rationale) |
| :--- | :--- | :--- |
| Web Hosting | **Vercel Hobby / Cloudflare Pages** | Free edge hosting, automatic SSL, global CDN, zero maintenance. |
| CI/CD & Grading | **GitHub Actions** | 2,000 free runner minutes/month per account for running student test suites. |
| CDN & DDoS | **Cloudflare Free Tier** | Free DDoS protection, DNS, and global asset caching. |
| Error Monitoring | **Sentry (Free Developer Tier)** | Free 5,000 errors/month and performance monitoring. |

---

---

## 4. System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│            Cloudflare / Vercel Edge (CDN / WAF / DDoS)        │
└─────────────────────────┬────────────────────────────────────┘
                          │
┌─────────────────────────▼────────────────────────────────────┐
│                  Next.js 14 Web Application                  │
│       (Linear High-Density UI + Monaco + Pyodide WASM)       │
└──┬─────────────────────────────┬─────────────────────────────┘
   │ HTTPS / REST                │ Webhooks (HMAC-SHA256)
   ▼                             ▼
┌──────────────────────────────┐ ┌─────────────────────────────┐
│    SUPABASE CLOUD (FREE)     │ │    STUDENT GITHUB REPO      │
│  - PostgreSQL 15 + RLS       │ │  - GitHub Actions CI Runner │
│  - pgvector (HNSW Index)     │ │  - AST Rubric Verification  │
│  - Supabase Auth (50k MAUs)  │ │  - Pytest / Cargo / Go test │
│  - Realtime WebSockets       │ └─────────────────────────────┘
└──────────────┬───────────────┘
               │ Free REST API
               ▼
┌──────────────────────────────┐
│   GOOGLE AI STUDIO (FREE)    │
│  - Gemini 1.5 Flash (15 RPM) │
│  - text-embedding-004        │
└──────────────────────────────┘
```

---

## 5. Feature Specification

### 5.1 Authentication & Authorisation

**Decision: Supabase Auth + PostgreSQL Row Level Security (RLS)**

- Roles: `student`, `admin` (no instructor role; platform is strictly self-paced and automated)
- OAuth Providers: GitHub (primary for engineering portfolio) and Google (both supported natively on Supabase free tier)
- Email/Password & Passwordless Magic Links supported out of the box
- Enterprise-grade isolation enforced at the database engine via PostgreSQL RLS policies—never client-side only
- Native JWT tokens passed in Supabase client headers; zero external auth vendor bills ($0/month)
- Free tier permanently covers up to 50,000 Monthly Active Users (MAUs)

### 5.2 Curriculum Architecture & Population Engine

- Strict 3-level hierarchy: `Phase (1–15) → Lesson (1–600) → Subtopic (3,000 total)`
- Strict serialisation: Students master prerequisite systems concepts (memory, pointers, sockets) before distributed algorithms (Raft, Paxos)
- **AI Content Population Pipeline**:
  - Gemini 1.5 Flash generates lesson contents using strict Pydantic/Zod JSON schemas
  - Zero hallucination policy: AI generation is grounded in the validated `curriculum.md` specification
  - State tracking table `curriculum_generation_state` ensures not a single lesson or subtopic is skipped
  - Idempotent execution: Failed requests retry without duplicate entries
  - Pedagogical depth: Explanations are rigorous and first-principles; **no rush, no marketing hype, no sense of urgency**

### 5.3 In-Lesson Practice & Exercise Session

- **Decision: In-Browser WebAssembly Sandbox (Pyodide + Web Worker)**
- Every lesson includes an embedded code editor (Monaco) and instant test assertion runner
- **$0 Infrastructure Cost**: Code executes directly on the student's CPU/RAM inside a sandboxed WebAssembly runtime
- Isolated Web Worker prevents freezing the browser UI thread
- Hard timeout (5,000ms) prevents infinite loops and memory leaks
- Instant AST validation checks student code structure and syntax before execution
- Zero backend server cost, 0ms network round-trip latency

### 5.4 Capstone Projects: Local Machine & GitHub Automated Grading

- **Decision: Local IDE Development + GitHub Actions CI Grading**
- Students complete all 22 capstone projects on their **local machine** using their IDE of choice (VS Code, Cursor, Neovim, JetBrains)
- **Workflow**:
  1. Student clones the starter repo from GitHub
  2. Implements the project specifications locally
  3. Pushes commits to their personal GitHub repository
  4. Submits the GitHub repository URL on the LMS platform
- **Automated Verification & Grading Engine**:
  - **Repo Existence Check**: The LMS queries the GitHub API (`GET /repos/{owner}/{repo}`). **If the repo does not exist, is private without access, or is an empty fork, the test immediately fails.**
  - **CI Test Execution**: An automated GitHub Actions workflow (`.github/workflows/grading.yml`) runs the test harness:
    - Code style & formatting checks (Ruff, Flake8, Clippy)
    - Static AST validation (verifying required classes, methods, and architectural patterns)
    - Full test suite execution (Pytest / Go test / Cargo test)
    - Performance & memory benchmarks
  - **HMAC-Signed Webhook**: On completion, the runner signs the grading results with HMAC-SHA256 and calls the LMS endpoint (`/api/webhooks/grading`), securely updating the student's score in Supabase.

### 5.5 AI Tutor (RAG Pipeline)

This is the most technically complex feature. It operates with zero hallucination and zero paid server infrastructure:

```
INGESTION (async, background CLI job):
───────────────────────────────────────
[Automated Ingestion from curriculum.md & lessons table]
        │
        ▼
[Markdown Structural Parser]
  - Parses headers, subtopics, code snippets, and explanations directly
  - No PDF parsing errors: source truth is clean, structured markdown
        │
        ▼
[Semantic Chunker]
  - Target: ~400 tokens per chunk (preserves metadata and code blocks)
  - Strategy: split on subtopic headers first, then code blocks, then paragraphs
  - 15% overlap between adjacent chunks (prevents answers straddling chunk boundary)
  - Each chunk stores: phase_number, lesson_slug, subtopic_title, chunk_index
        │
        ▼
[Embedding: Google text-embedding-004 (Free Tier)]
  - Batch in groups of 100 chunks
  - Store in pgvector on Supabase with HNSW index (m=16, ef_construction=64)
  - Also store BM25 keyword index (pg_trgm) for hybrid retrieval
        │
        ▼
[Stored in Supabase PostgreSQL (pgvector)]

RETRIEVAL (at query time, target p95 < 1.5s):
─────────────────────────────────────────────
[Student question]
        │
        ▼
[Query embedding via text-embedding-004]
        │
        ├─ Dense vector search (Supabase pgvector cosine similarity, top-10)
        └─ Sparse keyword search (pg_trgm tsvector, top-10)
                │
                ▼
        [Reciprocal Rank Fusion (RRF) in PostgreSQL]
        NOTE: Executed via native SQL stored procedure in Supabase. $0 compute cost.
        NOTE: The LLM context window is not infinite. Sending 20 chunks
              dilutes the answer. Re-rank to the 5 most relevant.
                │
                ▼
        [Prompt assembly]
        system: "You are a tutor for [course]. Answer using only the
                 provided context. If the context does not contain the
                 answer, say so explicitly. Never fabricate."
        context: top-5 chunks with source labels
        history: last 6 message turns (not unlimited — prevents token blowout)
        question: student input
                │
                ▼
        [Gemini 1.5 Flash — streaming response]
                │
                ▼
        [Answer + source citations rendered in UI]
        [Full exchange stored in ai_chat_sessions for analytics]
```

**Known hard problems with RAG:**
- Tables in PDFs are frequently mangled by parsers. Test every document type with real content.
- Students asking questions that span multiple lessons — retrieval will not find cross-lesson context unless you embed at course level too
- Context window management: 6-turn history + 5 chunks + system prompt ≈ 3,000–6,000 tokens. Monitor this or costs explode
- Hallucination cannot be eliminated, only reduced. Always show source citations. Always include a disclaimer.

### 5.6 Adaptive Learning

**What is actually buildable in phase one** vs what sounds good:

| Feature | Buildable in Phase 1 | What it actually requires |
|---|---|---|
| Spaced repetition (SM-2) | ✅ Yes | SM-2 is a well-documented algorithm; ~200 lines of code |
| Quiz performance → content recommendation | ✅ Yes | Tag lessons with skills; surface lessons where score < threshold |
| "Knowledge graph" | ❌ Not in phase 1 | Requires user behaviour data you won't have, plus graph DB or specialised schema |
| Learning style detection | ❌ Never | "Learning styles" (visual/auditory/kinaesthetic) have no scientific evidence base |
| LLM-generated personalised path | ⚠️ Phase 2 | Doable but LLM path generation is expensive and quality varies |

**Do not build the knowledge graph until you have 6 months of real user data.**

### 5.6 AI-Assisted Assessment

#### Deterministic Code & Exercise Verification

All grading on the platform is **objective, automated, and test-driven**. There are no subjective essays or manual instructor grading queues:

| Exercise / Project Type | Verification Mechanism | Ground Truth Authority | $0 Execution Cost |
| :--- | :--- | :--- | :--- |
| **In-Lesson Practice (Python)** | Client-side Pyodide WASM + native `ast.parse` | Test assertion output & AST node match | $0 (Runs on student CPU/RAM) |
| **In-Lesson Practice (SQL)** | Client-side `sql.js` (SQLite WASM) | Query result set equality | $0 (Runs on student browser) |
| **In-Lesson Practice (C/Rust/Go)** | Tree-sitter AST parser + local terminal | Syntax & memory structural rules | $0 (Runs on student browser/workstation) |
| **Capstone Projects (All 22)** | GitHub Actions CI (`pytest`, `cargo test`, `go test -race`) | Automated test suite execution & linter | $0 (GitHub Actions free tier) |
| **AI Tutor Feedback** | Gemini 1.5 Flash (SSE Streaming) | Explanatory feedback on test failure traces | $0 (Google AI Studio Free Tier) |

All assessments are reproducible, deterministic, and self-paced. Students receive instant, actionable feedback and can iterate until 100% of test assertions pass.

---

### 5.7 Analytics

**What matters vs what looks impressive on a sales demo:**

| Data Point | Actually Useful | Just a Vanity Metric |
|---|---|---|
| Lesson completion rate per lesson | ✅ | |
| Where in a video students stop watching | ✅ (reveals boring/confusing content) | |
| Time-on-task | ⚠️ (tab can be open without learning) | |
| Quiz score per question | ✅ (reveals bad questions or gaps) | |
| Most-asked AI questions | ✅ (content gap detector) | |
| "Engagement score" | | ✅ Meaningless composite metric |
| Streak counters | | ✅ Gamification, not learning signal |

**Analytics stack decision:**
- Raw events → `analytics_events` table (PostgreSQL, partitioned by month)
- Aggregations run nightly as materialised views (not real-time, not a data warehouse)
- Add BigQuery + dbt when row count exceeds 50M events (~18 months in)

### 5.8 Real-time Collaboration

**Honest scoping:**

| Feature | Build it? | Why / Why not |
|---|---|---|
| Live video classrooms | **No — integrate Zoom SDK** | WebRTC at scale requires TURN servers, media servers (mediasoup/Janus), and a dedicated team to operate. Buy this. |
| Shared whiteboard | **No — integrate Tldraw** | Open-source, embeddable, excellent DX |
| Discussion forums | **Yes — build it** | Threaded comments + AI summary is a differentiator. Not complex to build. |
| Live Q&A during class | **Zoom integration** | Zoom Q&A feature handles this |

**Do not build your own WebRTC infrastructure. It will consume 2 engineers for 6 months and still be worse than Zoom.**

### 5.9 Notifications

- Transactional email: **Resend** (reliable, great DX, $20/month for 100K emails)
- Push notifications: **Notivize** or **OneSignal** — do not build your own push infrastructure
- In-app notifications: Real-time via Supabase, persisted in `notifications` table
- AI-generated nudges: Gemini Flash generates text, triggered by a Celery scheduled task (daily, not real-time)
- **Do not over-notify**. Users who receive > 3 notifications/day from a learning app unsubscribe. Build frequency caps from day one.

---

## 6. Enterprise-Grade Capstone Project System

### 6.1 What Makes It Enterprise-Grade
 
The 22 capstone projects require students to build real AI-native software products and platforms that mirror what senior engineering teams ship in production:
- Resilient AI Client SDKs with Pydantic contracts and circuit breakers
- High-throughput streaming AI reverse proxies and rate limiters (FastAPI / ASGI 3.0 / SSE)
- Multi-tenant knowledge bases with PostgreSQL, pgvector (HNSW), and hybrid search
- Reactive AI streaming web applications with Web Workers and zero layout shifts
- Production RAG pipelines with contextual chunking, ColBERT late interaction, and cross-encoder re-ranking
- Automated LLM evaluation (evals) and quality regression test harnesses
- Autonomous coding and developer tools with tool-calling sandboxes and self-healing TDD loops
- Multi-tenant AI SaaS platforms with workspace isolation, token billing, and agentic workflows

### 6.2 Capstone Delivery & Automated Verification Framework

The LMS is **strictly self-paced and automated**. There are **no instructor-led sessions, no manual grading queues, and no arbitrary calendar deadlines**. Students advance purely on demonstrated code correctness and automated test suite verification.

```
[Phase Completion] ──────────────────────────────────────────────┐
                                                                 │
                                                                 ▼
[Student Clones Starter Repo from GitHub] ◄──────────── [Reads Project Brief & Rubric]
  - Local Workstation (VS Code / Neovim / CLI)
  - Full local toolchain (gcc, clang, go, cargo, python)
  - Zero cloud costs, zero network latency during dev
                                 │
                                 ▼
[Local Implementation & Testing]
  - Student implements required systems logic
  - Runs local unit and integration tests
  - Zero sense of urgency: iterate until bug-free
                                 │
                                 ▼
[Push Commits to Personal GitHub Repository]
  - Public repository on student's personal account
  - Qualifies for UNLIMITED free GitHub Actions runner minutes
                                 │
                                 ▼
[Initiate Grading via LMS Web Portal]
  1. Student inputs GitHub Repository URL
  2. LMS queries GitHub API: GET /repos/{owner}/{repo}
     → IF REPO NOT FOUND (404) OR EMPTY: SUBMISSION FAILS IMMEDIATELY.
  3. GitHub Actions workflow (.github/workflows/grading.yml) triggers
                                 │
                                 ▼
[Automated GitHub Actions CI Runner (Free Tier)]
  - Clones official, immutable test rubrics from LMS release branch (tamper-proof)
  - Step 1: Linter & Static Analysis (ruff / clippy / golangci-lint)
  - Step 2: AST Analysis (verifies required classes, interfaces, memory models)
  - Step 3: Test Suite Execution (pytest / cargo test / go test -race)
  - Step 4: Memory & Sanitizer Checks (valgrind / ASan / leak detection)
  - Step 5: Benchmark Bounds (verifies algorithmic time & space complexity)
                                 │
                                 ▼
[Signed Webhook Callback to LMS API]
  - HMAC-SHA256 signed test results payload
  - LMS verifies signature and cross-checks GitHub API run status
  - Atomic score update in Supabase capstone_submissions table
                                 │
                                 ▼
[Instant Mastery Feedback & Digital Attestation]
  - 100% tests passed → Phase Capstone Certified
  - Any test failed → Granular AST & test failure trace returned; student iterates locally
```

### 6.3 Zero-Cost Infrastructure & Sandbox Model

> **$0 Budget Rule**: Dedicated Kubernetes clusters, Cloud SQL instances, or paid remote Docker sandboxes are strictly prohibited. The system incurs **$0.00 cloud compute spend** by leveraging distributed local client hardware and GitHub's free CI tier:

1. **Development Compute**: Runs 100% on the student's personal computer (VS Code, terminal, native compilers).
2. **Grading Compute**: Runs 100% on **GitHub Actions Free Tier** (unlimited minutes for public repositories; 2,000 free minutes/month for private repositories on student accounts).
3. **Database & Ingestion**: Supabase Free Tier stores only test results, commit SHAs, and verification statuses.
4. **Monthly Cost**: **$0.00 / team or student**.

### 6.4 Automated Multi-Stage Evaluation Rubric

Every capstone submission is graded automatically using deterministic, objective rubrics:

| Evaluation Dimension | Weight | Verification Mechanism ($0 Automated Engine) | Passing Threshold |
| :--- | :--- | :--- | :--- |
| **Functional Correctness** | 35% | Unit, integration, and edge-case test suites in GitHub Actions CI | 100% test assertions passing |
| **System Architecture & AST** | 25% | Static AST parser checking required interfaces, classes, and patterns | Zero structural violations |
| **Memory & Concurrency Safety** | 15% | Valgrind / AddressSanitizer / Go race detector (`-race`) in CI | Zero memory leaks, zero data races |
| **Performance & Complexity** | 15% | Benchmark harness verifying required asymptotic latency & memory bounds | Meets defined p95 latency SLO |
| **Code Style & Static Security** | 10% | Ruff / Clippy / Semgrep OSS scanning in CI | Zero errors, zero security CVEs |
| **Total** | **100%** | **100% Automated (Zero Instructor Overhead)** | **Overall Score ≥ 80% to Pass** |

### 6.5 Self-Paced Progression & Portfolio Attestation

- **Zero Sense of Urgency**: Students have unlimited retries with zero penalties. There are no calendar cutoffs or arbitrary deadlines. Mastery is achieved when the code is correct.
- **Auto-Generated Portfolio Badge**:
  - Once a capstone passes with green CI, the LMS generates an authenticated verification badge.
  - Verifiable URL: `https://lms.academy/verify/{submission_id}` containing cryptographic proof of commit SHA, test coverage, and benchmark results.
  - Shareable on LinkedIn and personal engineering portfolios.

### 6.6 Portfolio & Credentials

On passing:
- **Portfolio page** auto-generated (student can edit before publishing):
  - Project title, description, tech stack tags
  - Architecture diagrams and benchmark graphs
  - CI badge, test coverage %, load test summary
  - Link to verified public GitHub repo
- **Cryptographic Credential**: Verifiable URL `https://lms.academy/verify/{certificate-uuid}` returns JSON with student handle, project title, test verification hash, and completion date.
- One-click LinkedIn share integration.

---

---

## 7. Relational Database Schema & Data Models

The production database runs on **Supabase PostgreSQL 15**. Currently, two schema models coexist:
1. **The Graph/Node Schema (`curriculum_phases`, `curriculum_nodes`, `curriculum_edges`, `profiles`)**: Currently live and populated in Supabase with 15 phases and 600 comprehensive lessons (complete with 11KB+ handbooks, starter code, and test suites per node).
2. **The Relational Normalized Schema (`phases`, `lessons`, `lesson_subtopics`, `user_progress`, `capstone_submissions`, `curriculum_embeddings`)**: Defined in migration files (`supabase/migrations/20240101000000_init_schema.sql`).

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Curriculum Phases (1 to 15)
CREATE TABLE phases (
  phase_number INT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  total_lessons INT NOT NULL DEFAULT 0,
  capstone_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lessons (600 Total)
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- e.g. 'phase-01-lesson-01'
  phase_number INT REFERENCES phases(phase_number) ON DELETE RESTRICT,
  lesson_number INT NOT NULL, -- 1 to 600
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  starter_code TEXT,
  solution_code TEXT,
  test_assertions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_phase_lesson UNIQUE(phase_number, lesson_number)
);

CREATE INDEX idx_lessons_slug ON lessons(slug);
CREATE INDEX idx_lessons_phase_number ON lessons(phase_number);

-- 3. Lesson Subtopics (2,528 Subtopics Tracked)
CREATE TABLE lesson_subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  subtopic_index INT NOT NULL,
  title TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_lesson_subtopic UNIQUE(lesson_id, subtopic_index)
);

CREATE INDEX idx_subtopics_lesson_id ON lesson_subtopics(lesson_id);

-- 4. Student Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_lesson UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_user_progress_lookup ON user_progress(user_id, lesson_id);

-- 5. Capstone Submissions & Automated Grading
CREATE TABLE capstone_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_slug TEXT NOT NULL,
  github_repo_url TEXT NOT NULL,
  commit_sha TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'RUNNING', 'PASSED', 'FAILED')) DEFAULT 'PENDING',
  score NUMERIC(5,2),
  feedback_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ
);

CREATE INDEX idx_capstone_user_project ON capstone_submissions(user_id, project_slug);

-- 6. RAG Curriculum Embeddings (Capped at 5,000 chunks to protect 500MB free quota)
CREATE TABLE curriculum_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  chunk_content TEXT NOT NULL,
  embedding vector(768), -- Google text-embedding-004
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_curriculum_embeddings_hnsw 
ON curriculum_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 7. Content Generation State Tracker
CREATE TABLE curriculum_generation_state (
  lesson_slug TEXT PRIMARY KEY,
  status TEXT CHECK (status IN ('PENDING', 'GENERATING', 'VALIDATED', 'PUBLISHED', 'FAILED_RETRY')) DEFAULT 'PENDING',
  error_message TEXT,
  attempt_count INT DEFAULT 0,
  last_attempted_at TIMESTAMPTZ
);
```

**Indexing notes:**
- `lesson_progress (user_id, lesson_id)` — composite PK covers the main lookup
- `analytics_events (user_id, occurred_at)` — secondary index for user-scoped queries
- `course_embeddings` — HNSW index (above). IVFFlat is faster to build but slower to query; use HNSW for production
- `ai_chat_sessions (user_id, course_id)` — index for context loading

---

## 8. Operational Requirements

This section is what separates "enterprise-grade" from "it works on my machine."

### 8.1 Service Level Objectives (SLOs)

| Service | SLO | Error Budget (30-day) |
|---|---|---|
| Web application (page load) | p95 < 2s, availability ≥ 99.5% | 3.6 hours downtime |
| AI Tutor (first token) | p95 < 3s (streaming; first token) | — |
| API (non-AI endpoints) | p95 < 300ms, availability ≥ 99.9% | 43 minutes downtime |
| In-browser practice execution | p95 < 20ms | Client CPU / WASM |
| Capstone CI test run | Completed within 90 seconds | GitHub Actions |

### 8.2 Reliability Practices

- **Circuit breakers** on all external API calls (Google Gemini API, GitHub API) using `opossum` (Node)
- **Retry with exponential backoff + jitter** on all transient failures (max 3 retries)
- **Graceful degradation**: if AI tutor is down, show a "tutor is temporarily unavailable" message — do not crash the lesson page
- **Database connection pooling**: Supavisor in transaction mode on port `6543` (Supabase managed pooler)
- **Health checks**: `/healthz` (liveness) on Next.js edge route
- **Zero-downtime deployments**: Atomic edge deployments in Vercel / Cloudflare Pages; database migrations must be backward-compatible

### 8.3 Observability & Error Management

- Sentry integration for real-time error tracking and performance profiling (5k errors/month free tier)
- Supabase built-in dashboard metrics, connection health, and query analyzer
- GitHub Issues for tracking operational bugs

### 8.4 RTO / RPO Targets

| Scenario | RTO | RPO |
|---|---|---|
| Frontend edge outage | < 10 seconds (Global Edge CDN failover) | 0 |
| Database restore | < 1 hour (Supabase snapshot restore) | < 24 hours |
| Data corruption | 2 hours | Last daily backup |

### 8.5 Deployment Pipeline

```
Code push to main → GitHub Actions:
  1. Lint (ESLint, Ruff)
  2. Type check (tsc --noEmit, mypy)
  3. Unit tests (Jest, pytest)
  4. Run TruffleHog (secret detection in CI)
  5. Run Semgrep OSS (SAST security scan)
  6. Deploy to Vercel / Cloudflare Pages Edge
  7. Run Sentry release health check post-deploy
```

Total pipeline time target: < 4 minutes.

---

## 9. Compliance Requirements

These are not optional. Skipping them creates legal liability.

### 9.1 FERPA (US — applies if enrolling US students in credit-bearing courses)

- Student education records are accessible only to: the student and platform admins (enforced via Supabase Row Level Security)
- Students have the right to access and correct their records
- No student data sold or shared with third parties without explicit consent
- Audit log of all access to student records

### 9.2 GDPR (EU — applies if enrolling EU residents)

- Lawful basis for processing: contractual necessity (service delivery) + legitimate interest (analytics)
- Data subject rights: access, rectification, erasure, portability
- Data residency: EU student data resides in EU Supabase regions
- Data Processing Agreements (DPAs) required with: Supabase, Google Cloud, GitHub, Vercel
- Privacy by default: data minimization baked into database schema

### 9.3 PCI-DSS (payment card data)

- **$0 Free Platform Model**: All core curriculum and grading is free; optional certificates use Stripe Checkout without storing raw card data.

### 9.4 Accessibility — WCAG 2.1 AA

- Required by: EU European Accessibility Act (EAA) 2025, UK PSBAR, US ADA
- Every UI component must pass automated a11y checks (axe-core)
- Full keyboard navigation must work for all interactive elements (`⌘K`, `J`/`K`)
- Interactive code exercises and markdown content must support screen readers
- Colour contrast ratio ≥ 4.5:1 for all text (compliant with Linear high-density obsidian palette)

---

## 10. Security

### 10.1 Application Security

- **Authentication**: Supabase Auth (JWT, session management, OAuth) + PostgreSQL Row Level Security
- **Authorisation**: PostgreSQL RLS policies enforce tenant and user isolation at the database engine level
- **Input validation**: Zod schemas on every route handler and Server Action
- **SQL injection**: Fully parameterized queries via Prisma and PostgREST; raw SQL uses parameter binding
- **XSS**: Next.js automatically escapes JSX output; markdown rendered via DOMPurify-sanitized parser
- **CSRF & CORS**: Next.js same-origin enforcement with strict CORS origin matching
- **Prompt injection** (LLM-specific): User input is strictly passed as a `user` role message, never injected into the `system` prompt
- **Rate limiting**: Edge Middleware token-bucket limiter on AI endpoints (clamped to 10 req/min per user)
- **Secrets**: Vercel Environment Variables & GitHub Actions Secrets (never committed to repository)
- **Dependency scanning**: OSV-Scanner and Dependabot enabled in GitHub CI

### 10.2 Infrastructure Security

- Supabase PostgreSQL accessed strictly via encrypted SSL connections (TLS 1.3)
- Cloudflare free WAF & DDoS protection enabled at DNS boundary
- WebAssembly sandboxes execute in isolated client Web Workers with memory/time hard caps
- Capstone grading CI runs in isolated GitHub Actions virtual machine containers with immutable test suites

### 10.3 Capstone Grading Security

- Student code executes in isolated, ephemeral **GitHub Actions virtual machines** on the student's personal account
- Workflows dynamically pull the immutable rubric test suite from the official LMS release branch at execution time
- Test assertions cannot be tampered with by the student in their local repository
- Webhook callbacks are cryptographically signed with HMAC-SHA256 using the student's secret key
- The LMS backend verifies the commit SHA and workflow run ID directly against the public GitHub REST API before recording scores

---

## 11. $0 AI Cost Model (Free Tier Allocation)

All AI features operate permanently within **Google AI Studio's free tier**:

| Feature | Model | Monthly Quota Required | Free Tier Allocation | Actual Cost |
| :--- | :--- | :--- | :--- | :--- |
| **Curriculum Batch Population** | Gemini 1.5 Flash | ~600 API calls (one-time pre-launch batch) | 1,500 requests/day | **$0.00** |
| **Lesson RAG Embeddings** | text-embedding-004 | ~5,000 chunks (one-time ingestion) | 1,500 requests/day | **$0.00** |
| **In-Context AI Tutor** | Gemini 1.5 Flash | ~300 queries/day (streaming SSE) | 1,500 requests/day, 1M TPM | **$0.00** |
| **Total Monthly AI Spend** | | | | **$0.00** |

By offloading all practice code execution to client-side WebAssembly (Pyodide & sql.js) and pre-generating the 600 curriculum lessons offline, recurring AI API calls are restricted to in-context RAG tutor questions. This guarantees operation well within Google AI Studio's 1,500 daily free request allocation at **$0.00/month**.

### 11.2 Free-Tier Quota Protections

- **Semantic Caching**: Common student queries are cached in Supabase with cosine threshold > 0.95, eliminating duplicate LLM calls.
### 11.3 Cost Controls & Free Quota Preservation

- **Zero Billing Surprise**: All external integrations operate strictly on zero-cost free plans without credit cards or paid upgrades.
- **Client & Edge Token Throttling**: Per-user daily request limits (e.g. 10 queries/hour) enforced client-side and via Next.js Edge route headers.
- **Semantic Caching**: SHA-256 hash or similarity deduplication of query + node_id in Supabase; cached responses return instantly without invoking the LLM.
- **Model Efficiency**: Gemini 1.5 Flash handles all generation and tutoring requests, fitting within the 1,500 RPD free allocation.

---

## 12. Buy vs Build Decisions

This is one of the most important architectural decisions. Building the wrong thing wastes months.

| Function | Decision | Rationale |
|---|---|---|
| Authentication | **Adopt (Supabase Auth)** | Free 50,000 MAUs, native JWT integration with PostgreSQL RLS. |
| Database & Vectors | **Adopt (Supabase PostgreSQL + pgvector)** | Free 500MB DB, HNSW vector indexing, built-in Supavisor connection pooling. |
| In-Lesson Code Sandbox | **Build/Adopt (Pyodide & sql.js WASM)** | $0 server compute: executes directly in student browser Web Workers. |
| Capstone Project CI | **Adopt (GitHub Actions)** | Unlimited runner minutes for public repos on student personal accounts. |
| Error Monitoring | **Adopt (Sentry Developer Tier)** | Free 5,000 errors/month and performance profiling. |
| Edge Hosting & CDN | **Adopt (Vercel Hobby / Cloudflare Pages)** | Free edge hosting, automatic SSL, and global asset caching. |
| Course Content Rendering | **Build** | Core product differentiator: High-Density Mechanical Minimalism. |
| AI Tutor (RAG) | **Build** | Core product differentiator: Grounded strictly in validated curriculum markdown. |
| Capstone Grading Engine | **Build** | Automated AST, linter, and unit test verification webhook system. |

---

## 13. Development Roadmap & Implementation Audit

### Phase 1 — Database & High-Density Foundation
- [x] Supabase project initialization (PostgreSQL 15, pgvector, pg_trgm live on project `lfsyndffrfwvdfzjsagl`)
- [x] Execute DDL schema migrations (`curriculum_phases`, `curriculum_nodes`, `curriculum_edges`, `profiles` fully loaded with 600 lessons)
- [x] Next.js 14 App Router project setup with Linear High-Density Mechanical Minimalism (Landing page, Curriculum browser, Dashboard, IDE Workspace)
- [ ] Supabase Auth production integration (GitHub & Google OAuth live callback wiring + PostgreSQL RLS policies)
- [x] Supabase keepalive cron workflow (`.github/workflows/keepalive.yml`) configured to eliminate 7-day auto-pause
- **Gate Status: PASSED.** Users can browse 15 phases, 600 lessons, and 3,000 subtopics live with full database grounding.

### Phase 2 — Curriculum Population & In-Browser WASM Sandbox
- [x] Offline batch generation scripts (`scripts/populate_supabase.py`, `scripts/enrich_handbooks.py`, `scripts/expand_to_600_lessons.py`) with Gemini 1.5 Flash
- [x] 600 detailed lesson handbooks (average 8–11 KB of rigorous technical text each), starter code, and test suites stored in Supabase
- [x] In-browser client-side Python sandbox with Web Worker (`public/workers/python-worker.js`), Pyodide WASM integration, and deterministic execution fallback
- [x] 4-tier progressive exercise ladder per lesson (Warmup, LeetCode Canonical, Hard Boundary, Systems Engineering) in `lib/exercises-catalog.ts`
- [ ] In-browser SQLite WASM (`sql.js`) dedicated sandbox tab for database lessons
- [ ] Tree-sitter WASM client-side syntax/AST parser for C/Rust/Go exercises
- [x] Interactive Monaco code editor integration with obsidian theme in Dashboard IDE
- **Gate Status: SUBSTANTIALLY COMPLETE.** Students can solve in-lesson practice exercises client-side with 0ms server latency.

### Phase 3 — RAG AI Tutor (Zero Hallucination)
- [x] Full-text search and PostgreSQL matching against `handbook_markdown` in Supabase (`/api/tutor`)
- [x] Next.js Route with Server-Sent Events (SSE) streaming for real-time response generation
- [ ] Vector generation (`text-embedding-004`) and pgvector HNSW indexing (capped at 5,000 chunks) to replace lexical search with hybrid vector/BM25 retrieval
- [ ] Live Gemini 1.5 Flash API invocation with grounded context injected dynamically on client query
- **Gate Status: IN PROGRESS.** Lexical search + SSE streaming working; vector embedding pipeline and live Gemini API call pending wiring.

### Phase 4 — Capstone Automated Grading Engine (GitHub Actions)
- [x] Capstone specifications and architectures defined for all 22 projects in `curriculum.md` and UI
- [x] Capstone submission tracker UI in `/dashboard#capstones` with GitHub repo URL inputs and verification telemetry
- [ ] Official GitHub starter repositories published with standardized directory layouts
- [ ] Immutable test runner workflows (`.github/workflows/grading.yml`) deployed to starter templates
- [ ] GitHub API integration (`GET /repos/{owner}/{repo}`) to verify repo existence before submission
- [ ] HMAC-SHA256 signed webhook endpoint (`/api/webhooks/grading`) for automated score attestation
- [ ] Cryptographic credential generation and verification endpoint (`/verify/{id}`)
- **Gate Status: FOUNDATION BUILT.** UI and grading specification complete; GitHub Actions webhook runner pending deployment.

---

## 14. Known Hard Problems & $0 Mitigations

| Hard Problem | Why It's Hard | $0 Architecture Mitigation |
| :--- | :--- | :--- |
| **Supabase 500MB DB Limit** | HNSW vector indexes can bloat to 300MB+ if unconstrained. | Strict chunking at subtopic boundaries (capped at 5,000 vectors $\approx 38.5\text{ MB}$ total). Total DB footprint $< 80\text{ MB}$. |
| **Supabase 7-Day Auto-Sleep** | Free-tier Supabase pauses inactive projects after 7 days. | Automated GitHub Actions cron ping (`0 0 */3 * *`) keeps DB active 24/7/365. |
| **Vercel 10s Serverless Timeout** | Complex RAG reasoning or LLM calls take > 10s, throwing HTTP 504. | AI Tutor runs on **Edge Runtime with SSE streaming** (bypasses the 10s serverless timeout). |
| **Tamper-Proof GitHub Grading** | Students could edit `assert True` in their local `test_suite.py`. | CI workflow clones immutable test suite from official LMS repo at runtime; LMS validates run SHA via GitHub API. |
| **Polyglot In-Browser Execution** | WebAssembly cannot natively compile C, Go, and Rust without heavy cloud servers. | Tiered model: Pyodide for Python, `sql.js` for SQL, Tree-sitter AST in browser + Local workstation compilers for systems code. |
| **AI Rate Limits (15 RPM)** | Generating 600 lessons dynamically on web requests causes HTTP 429 rate limit crashes. | Batch pre-generation via offline CLI script prior to platform launch with 12 RPM token-bucket rate limiting. |
| GDPR erasure + analytics | "Right to be forgotten" conflicts with analytics integrity (you can't delete events from an append-only log). | Pseudonymise analytics events at write time. Store `user_hash` not `user_id`. Erasure = delete the hash mapping. |
| LLM API price/model changes | Google changes models and pricing without long notice. | Abstraction layer over all LLM calls from day one. Never call the LLM SDK directly in business logic. |
| Test coverage gaming in CI | Students will game coverage with trivial tests. | Enforce AST structural assertion checks and boundary-condition test cases in CI. |

---

## 15. $0 Budget Integrations Matrix

| Service | Purpose | Budget Tier | Monthly Cost |
|---|---|---|---|
| **Supabase** | Database (PostgreSQL 15), pgvector, Auth (50k MAU), Realtime WebSockets | Free Tier | **$0.00** |
| **Google AI Studio (Gemini 1.5 Flash)** | Content generation pipeline, AST validation, RAG AI Tutor | Free API Tier (15 RPM, 1M TPM) | **$0.00** |
| **GitHub Actions** | Capstone CI test runner, AST rubric grading, security checks | Free Tier (Unlimited for public) | **$0.00** |
| **Pyodide & sql.js (WASM)** | In-browser client-side code sandbox for practice exercises | Open Source / Client CPU | **$0.00** |
| **Vercel / Cloudflare Pages** | Frontend hosting, Edge API routes, Global CDN, SSL | Free Hobby Tier | **$0.00** |
| **Sentry** | Error monitoring & performance tracing | Free Developer Tier (5k errors/mo) | **$0.00** |
| **Semgrep OSS & Ruff** | Code quality, static AST analysis, and security scanning in CI | Open Source (runs in GitHub CI) | **$0.00** |
| **Monaco Editor** | In-browser code editing engine | Open Source / Client-side | **$0.00** |
| **Total Monthly Infrastructure Cost** | | | **$0.00** |

---

## 16. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| AI answers hallucinate on course content | High | High | Strict RAG grounds answers in validated `curriculum.md`; mandatory subtopic source citations |
| Free tier rate limits hit during generation | Medium | High | Batch offline script throttled to 12 RPM with exponential backoff and resume state machine |
| Student attempts to tamper with grading | Medium | High | Clones immutable test harness dynamically from LMS repository during CI run; validates SHA via GitHub API |
| Database pauses due to 7-day inactivity | High | Critical | Automated GitHub Actions keepalive cron ping running every 3 days (`.github/workflows/keepalive.yml`) |
| Vector database exceeds 500MB free quota | Medium | Critical | Chunks capped strictly at subtopic boundaries (max 5,000 chunks $\approx 38.5\text{ MB}$ total) |

---

## 17. Success Metrics (KPIs)

| Metric | Target | Measurement |
|---|---|---|
| Curriculum Coverage | 100% of 600 lessons & 3,000 subtopics verified | `curriculum_generation_state` table |
| Student CSAT | > 4.5 / 5 | In-app feedback widget |
| AI tutor TTFT (Time to First Token) | < 450ms | Sentry Edge Performance Tracing |
| In-browser practice execution latency | < 20ms | Client-side performance API |
| Capstone test completion time | < 90 seconds | GitHub Actions workflow telemetry |
| Infrastructure Cost | **$0.00 / month permanently** | Supabase, Vercel & GitHub billing dashboards |


---

## 18. What Is Out of Scope (and Why)

| Item | Why It's Out of Scope |
|---|---|
| Mobile native apps (iOS/Android) | A responsive web app covers 90% of mobile use cases. Native apps add 2 engineers and 6 months. Build after PMF. |
| Self-hosted LLM | Operational complexity and GPU costs are prohibitive until >$500K/year in LLM API spend |
| Blockchain credentials | Open Badges (W3C standard) are already verifiable. Blockchain adds cost and complexity with zero added verifiability for the employer |
| "Learning style" personalisation | No scientific evidence that visual/auditory/kinaesthetic styles exist. Do not build this. |
| Custom WebRTC infrastructure | Zoom SDK exists. Don't rebuild it. |
| AI-generated course videos | Quality is not there yet for educational video. Text-to-video models produce uncanny results that distract from learning. |
| Real-time knowledge graph | Requires 6+ months of behaviour data before it has signal. Build after launch. |
| Elasticsearch | Overkill at this scale. Add when PostgreSQL FTS is demonstrably insufficient. |

---

*Last updated: 2026-09-18 — Full rewrite for enterprise accuracy. Previous version contained unrealistic timelines, unresolved technology choices, incorrect cost estimates, and impractical features.*
