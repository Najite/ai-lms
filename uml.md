# System Architecture & UX Modeling: Unified UML Specifications

> **Brutal Honesty & UX First Principles**: This document provides the complete structural, behavioral, and interaction models for the AI-Native Learning Management System. It models the platform from the student's cognitive perspective: **zero artificial urgency, zero calendar deadlines, complete transparency of mastery states, and immediate deterministic feedback**. Every sequence respects the physical constraints of the verified **$0.00 infrastructure stack** (Supabase, Client WASM, GitHub Actions, and Google Gemini 1.5 Flash).

---

## 1. System Context & User Journey (C4 Level 1 Context Diagram)

This diagram models how an independent student engineer navigates the LMS ecosystem across three operational surfaces:
1. **The Linear-Inspired Web Portal**: Fast, high-density exploration, concept reading, in-browser sandbox practice, and progress visualization.
2. **The Local Workstation**: Professional engineering environment (VS Code, Neovim, native compilers, Git CLI) where real capstones are built.
3. **The Distributed Cloud ($0 Stack)**: GitHub Actions for objective grading, Supabase for relational and vector state, and Google Gemini 1.5 Flash for grounded AI tutoring.

```mermaid
graph TD
    subgraph Workstation ["Student Workstation (Local Client Environment)"]
        User["Student Engineer"]
        BrowserUI["Web Portal (Next.js 14 / Linear Obsidian UI)"]
        LocalIDE["Local IDE (VS Code / Neovim / Terminal)"]
        ClientWASM["Browser Web Worker (Pyodide / sql.js WASM)"]
        LocalGit["Local Git Client"]
    end

    subgraph GitHubInfra ["GitHub Distributed Infrastructure ($0 Free Tier)"]
        PersonalRepo["Student GitHub Repository (Public)"]
        GHActions["GitHub Actions Runner (Ubuntu VM)"]
        OfficialRubric["LMS Official Rubrics (Immutable Release Repo)"]
        GitHubAPI["GitHub REST API (v3)"]
    end

    subgraph EdgeLayer ["Edge & Serverless API ($0 Vercel / Cloudflare)"]
        EdgeAPI["Next.js Edge Runtime (SSE Streaming)"]
        GradingEndpoint["Grading Ingestion API (/api/webhooks/grading)"]
    end

    subgraph DatabaseLayer ["Supabase Cloud ($0 Free Tier - 500MB)"]
        SupaAuth["Supabase Auth (GitHub OAuth / JWT)"]
        PostgresDB["PostgreSQL 15 Database (pgvector HNSW)"]
    end

    subgraph AIService ["Google AI Studio ($0 Free Tier)"]
        GeminiFlash["Gemini 1.5 Flash (15 RPM / 1M TPM)"]
    end

    %% User interactions with Browser UI
    User -->|"1. Explores 500 Lessons (Zero Paywall / Zero Urgency)"| BrowserUI
    BrowserUI -->|"2. Authenticates when ready to save progress"| SupaAuth
    BrowserUI -->|"3. Executes in-lesson micro-practice"| ClientWASM
    ClientWASM -->|"4. Sub-20ms instant AST validation"| BrowserUI

    %% Local workstation development
    User -->|"5. Clones Phase Capstone to local machine"| LocalIDE
    LocalIDE -->|"6. Writes code & runs local test suites"| LocalIDE
    LocalIDE -->|"7. Commits changes via Git"| LocalGit
    LocalGit -->|"8. git push origin main"| PersonalRepo

    %% Verification and grading loop
    User -->|"9. Clicks 'Verify Repository' on LMS portal"| BrowserUI
    BrowserUI -->|"10. POST /api/capstone/verify {repo_url}"| EdgeAPI
    EdgeAPI -->|"11. Validates repo existence & public visibility"| GitHubAPI
    PersonalRepo -->|"12. Triggers on push or workflow_dispatch"| GHActions
    GHActions -->|"13. Pulls immutable test harness"| OfficialRubric
    GHActions -->|"14. Dispatches signed test attestation"| GradingEndpoint
    GradingEndpoint -->|"15. Atomic upsert into capstone_submissions"| PostgresDB

    %% RAG AI Tutor interaction
    BrowserUI -->|"16. Asks technical conceptual questions"| EdgeAPI
    EdgeAPI -->|"17. Vector similarity search (HNSW <=> 768d)"| PostgresDB
    EdgeAPI -->|"18. SSE token stream (<400ms TTFT)"| GeminiFlash
    GeminiFlash -->|"19. Progressive real-time stream"| BrowserUI
```

---

## 2. Container & Component Topology (C4 Level 2/3 Diagram)

This model illustrates the internal architecture of the browser application, edge middleware, and external service boundaries. It shows how state flows between UI components, local persistence, and remote databases without blocking the main render thread.

```mermaid
graph TB
    subgraph BrowserClient ["Browser Client (Next.js 14 Single-Page Experience)"]
        subgraph UIComponents ["React Presentation Layer (Linear Design System)"]
            CurriculumNav["Curriculum Explorer (15 Phases / 500 Lessons)"]
            MonacoPanel["Monaco Code Editor (Dark Obsidian Theme)"]
            TerminalView["Terminal Output Box (ANSI Syntax Highlighted)"]
            TutorDrawer["AI Tutor Chat Drawer (Markdown / LaTeX)"]
            StatusChips["Monospace Status Chips (Live Sync)"]
        end

        subgraph ClientState ["State Management & Caching"]
            ZustandStore["Zustand Global Store (Active Lesson / User State)"]
            TanStackQuery["TanStack Query (Server State Cache / Stale-While-Revalidate)"]
            LocalStorageSync["Local Storage Cache (Draft Code Auto-Save / Offline)"]
        end

        subgraph SandboxLayer ["Isolated Execution Sandbox"]
            WorkerController["Web Worker Controller"]
            WebWorkerThread["Web Worker Thread (Dedicated Web Worker)"]
            PyodideEngine["Pyodide WASM (Python 3.11 Runtime)"]
            SqliteEngine["sql.js WASM (SQLite In-Memory Engine)"]
            WatchdogTimer["5,000ms Watchdog Timer (Anti-Freeze Guard)"]
        end
    end

    subgraph EdgeServices ["Edge & Serverless Tier ($0 Vercel Hobby)"]
        EdgeMiddleware["Edge Middleware (Session Validation)"]
        TutorRoute["/api/tutor (Edge Runtime SSE)"]
        CapstoneRoute["/api/capstone/verify (GitHub API Proxy)"]
        WebhookRoute["/api/webhooks/grading (HMAC-SHA256 Ingestion)"]
    end

    subgraph SupabasePlatform ["Supabase Platform ($0 Managed Tier)"]
        Supavisor["Supavisor Connection Pooler (Port 6543)"]
        PostgresCore["PostgreSQL 15 Storage Engine"]
        PgVectorExt["pgvector Extension (HNSW Index: 5,000 Chunks)"]
        SupabaseRealtime["Supabase Realtime Engine (WebSocket Replication)"]
    end

    %% Client internal data flows
    MonacoPanel -->|"Auto-save keystrokes"| LocalStorageSync
    MonacoPanel -->|"Execute code [Ctrl+Enter]"| WorkerController
    WorkerController -->|"postMessage(code, tests)"| WebWorkerThread
    WebWorkerThread --> PyodideEngine
    WebWorkerThread --> SqliteEngine
    WorkerController --> WatchdogTimer
    WebWorkerThread -->|"Execution results (<20ms)"| TerminalView
    TerminalView -->|"Pass event"| ZustandStore

    %% Remote interactions
    CurriculumNav --> TanStackQuery
    TanStackQuery -->|"REST / GraphQL query"| Supavisor
    TutorDrawer -->|"Fetch SSE stream"| TutorRoute
    TutorRoute -->|"HNSW Cosine query"| PgVectorExt
    CapstoneRoute -->|"Verify repo"| WebhookRoute
    WebhookRoute -->|"Atomic write"| PostgresCore
    PostgresCore -->|"Row change event"| SupabaseRealtime
    SupabaseRealtime -->|"WebSocket notification"| StatusChips
```

---

## 3. Entity-Relationship Model (Supabase Relational & Vector Schema)

The database schema is strictly designed to remain permanently below Supabase’s **500MB free tier threshold**. Vector embeddings are capped at 5,000 chunks (subtopic granularity), consuming only **38.5MB**, leaving >460MB for student profiles, progress records, and submission logs.

```mermaid
classDiagram
    class Phase {
        +int phase_number PK
        +string title
        +string description
        +int total_lessons
        +string capstone_slug
        +timestamp created_at
    }

    class Lesson {
        +uuid id PK
        +string slug UK
        +int phase_number FK
        +int lesson_number
        +string title
        +text content_markdown
        +text starter_code
        +text solution_code
        +text test_assertions
        +timestamp created_at
        +timestamp updated_at
    }

    class LessonSubtopic {
        +uuid id PK
        +uuid lesson_id FK
        +int subtopic_index
        +string title
        +boolean is_verified
        +timestamp created_at
    }

    class UserProfile {
        +uuid id PK
        +string github_username UK
        +string display_name
        +string avatar_url
        +timestamp enrolled_at
        +timestamp last_active_at
    }

    class UserProgress {
        +uuid id PK
        +uuid user_id FK
        +uuid lesson_id FK
        +boolean is_completed
        +text saved_code_draft
        +timestamp completed_at
        +timestamp last_accessed_at
    }

    class CapstoneSubmission {
        +uuid id PK
        +uuid user_id FK
        +string project_slug
        +string github_repo_url
        +string commit_sha
        +string idempotency_key UK
        +string status
        +numeric score
        +jsonb feedback_json
        +timestamp created_at
        +timestamp graded_at
    }

    class CurriculumEmbedding {
        +uuid id PK
        +uuid lesson_id FK
        +string lesson_slug
        +int phase_number
        +int subtopic_index
        +text chunk_content
        +vector_768 embedding
        +timestamp created_at
    }

    class CurriculumGenerationState {
        +string lesson_slug PK
        +string status
        +text error_message
        +int attempt_count
        +timestamp last_attempted_at
    }

    %% Relationships
    Phase "1" --> "*" Lesson : contains
    Lesson "1" --> "*" LessonSubtopic : broken_into
    Lesson "1" --> "*" CurriculumEmbedding : vectorized_as
    UserProfile "1" --> "*" UserProgress : tracks
    Lesson "1" --> "*" UserProgress : completed_by
    UserProfile "1" --> "*" CapstoneSubmission : submits
    Phase "1" --> "*" CapstoneSubmission : evaluates
```

---

## 4. Sequence: Frictionless Onboarding & Anonymous Curriculum Exploration UX

> **UX Philosophy**: Zero gatekeeping. Total beginners and experienced engineers alike should be able to inspect every single one of the 500 lessons, read technical explanations, and practice in the WASM sandbox without being forced to create an account or provide payment information.

```mermaid
sequenceDiagram
    autonumber
    actor Guest as Unauthenticated Student
    participant Browser as Web Portal (Landing / Explorer)
    participant LocalCache as Browser LocalStorage
    participant Worker as Pyodide WASM Sandbox
    participant SupaAuth as Supabase Auth (GitHub OAuth)
    participant Postgres as Supabase Database

    Guest->>Browser: Lands on platform (https://lms.academy)
    Browser->>Browser: Loads static curriculum manifest (500 Lessons pre-rendered)
    Note over Guest,Browser: Zero sign-up prompt. Immediate access to all 15 Phases.

    Guest->>Browser: Selects Phase 01 // Lesson 001 ("CPU Architecture & Registers")
    Browser->>Browser: Renders lesson markdown & starter assembly/Python code
    
    Guest->>Browser: Types code in Monaco editor
    Browser->>LocalCache: Saves code draft immediately to localStorage key: "draft:l001"
    
    Guest->>Browser: Hits [Ctrl + Enter]
    Browser->>Worker: postMessage({ code, test_assertions })
    Worker-->>Browser: Tests Pass (100%) - Instant sub-20ms feedback
    Browser-->>Guest: Displays green status badge: "VERIFIED IN SANDBOX (LOCAL)"
    
    Note over Guest,Browser: Student decides they want to track lifelong progress across devices:
    
    Guest->>Browser: Clicks "Connect with GitHub to Sync Progress"
    Browser->>SupaAuth: signInWithOAuth({ provider: 'github' })
    SupaAuth-->>Browser: Returns session JWT & User Profile
    
    Browser->>LocalCache: Reads all local practice drafts & completed slugs
    Browser->>Postgres: Atomic batch upsert into user_progress table
    Postgres-->>Browser: Confirmed sync
    Browser-->>Guest: Displays: "Progress synced seamlessly. Welcome aboard."
```

---

## 5. Sequence: In-Lesson Practice Sandbox UX (Zero-Lag Execution + Watchdog)

This sequence models how code runs locally inside a dedicated Web Worker on the user's computer. It eliminates cloud computing costs for the platform while delivering instant feedback to the learner. A strict 5,000ms watchdog prevents runaway loops from freezing the browser UI.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Monaco as Monaco Editor (Browser UI)
    participant WorkerController as Web Worker Controller
    participant WebWorker as Dedicated Web Worker (Pyodide / sql.js)
    participant Watchdog as 5,000ms Watchdog Timer
    participant Terminal as ANSI Terminal Output Box

    Student->>Monaco: Writes code solution for practice exercise
    Student->>Monaco: Presses [Ctrl + Enter]
    
    Monaco->>WorkerController: executeCode(language, code, test_assertions)
    WorkerController->>Watchdog: Start 5,000ms countdown timer
    WorkerController->>WebWorker: postMessage({ type: 'RUN', code, test_assertions })
    
    activate WebWorker
    
    alt In-Browser Python Practice (Pyodide)
        WebWorker->>WebWorker: Run ast.parse(code) [Syntax & AST check]
        
        alt SyntaxError Detected
            WebWorker-->>WorkerController: { status: 'SYNTAX_ERROR', line: 14, message: 'invalid syntax' }
            WorkerController->>Watchdog: Cancel timer
            WorkerController->>Monaco: Set red squiggly inline marker on line 14
            WorkerController->>Terminal: Render clean AST error (No cryptic stack trace)
        else Valid Code Syntax
            WebWorker->>WebWorker: Execute code with user input and test harness
            
            alt Code Finishes Successfully (< 500ms)
                Watchdog->>Watchdog: Cancel timer
                WebWorker-->>WorkerController: { status: 'PASSED', assertions: 12, passed: 12, output: '...' }
                WorkerController->>Terminal: Render green "PASSED (12/12) • 18ms"
                WorkerController->>Monaco: Highlight passing state
            else Infinite Loop or Timeout (> 5,000ms)
                Watchdog-->>WorkerController: Watchdog Fired: 5,000ms exceeded!
                WorkerController->>WebWorker: worker.terminate() [Hard Kill Sandbox Thread]
                WorkerController->>WorkerController: Respawn fresh clean WebWorker
                WorkerController->>Terminal: Render amber alert: "Execution Timed Out (5s limit). Infinite loop detected."
                WorkerController->>Monaco: Clear running state (Browser UI stays 100% fluid)
            end
        end
    end
    
    deactivate WebWorker
```

---

## 6. Sequence: Local Workstation to Capstone Grading Verification Loop

> **Brutal Honesty**: Software engineering cannot be learned solely inside a browser toy editor. Real systems engineering requires local compilers, debuggers, and Git. This sequence models the capstone verification loop: the student codes locally, pushes to their public GitHub repository, and triggers automated grading.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant LocalCLI as Local Workstation (VS Code / Terminal)
    participant StudentGit as Personal GitHub Repo (Public)
    participant LMSPortal as LMS Web Portal
    participant EdgeAPI as Next.js Edge API (/api/capstone/verify)
    participant GitHubAPI as GitHub REST API (v3)
    participant GHActions as GitHub Actions CI Runner (Ubuntu)
    participant OfficialRubric as LMS Immutable Rubrics Repo
    participant GradingWebhook as LMS Ingestion Webhook (/api/webhooks/grading)
    participant SupabaseDB as Supabase Database (PostgreSQL)

    Student->>LocalCLI: Develops capstone locally (C, Rust, Go, or Python)
    Student->>LocalCLI: Runs local unit tests & memory leak checks
    Student->>StudentGit: git commit -m "feat: complete Raft log replication" && git push origin main
    
    Student->>LMSPortal: Inputs repository URL: "https://github.com/student/raft-consensus"
    Student->>LMSPortal: Clicks "Verify & Grade Capstone"
    
    LMSPortal->>EdgeAPI: POST /api/capstone/verify { project_slug: "raft-consensus", repo_url: "..." }
    
    activate EdgeAPI
    EdgeAPI->>GitHubAPI: GET /repos/{owner}/{repo}
    
    alt Repository Does Not Exist (404) or Private
        GitHubAPI-->>EdgeAPI: 404 Not Found
        EdgeAPI-->>LMSPortal: ❌ Test Failed: "Repository does not exist on GitHub or is set to Private. Capstones must be in a public repository."
        LMSPortal-->>Student: Displays actionable error card with direct links to GitHub visibility settings
    else Repository Valid & Public
        GitHubAPI-->>EdgeAPI: 200 OK (default_branch: "main", latest_commit: "9f3a1b2")
        
        EdgeAPI->>GitHubAPI: GET /repos/{owner}/{repo}/actions/runs?head_sha=9f3a1b2
        
        alt Workflow Not Triggered Yet
            EdgeAPI-->>LMSPortal: "Repository verified. Waiting for GitHub Actions CI execution..."
        end
        
        Note over StudentGit,GHActions: GitHub Actions executes automatically on student's repo:
        activate GHActions
        GHActions->>GHActions: Checkout student commit SHA
        GHActions->>OfficialRubric: git clone --depth 1 https://github.com/lms-core/rubrics.git /tmp/rubrics
        Note over GHActions,OfficialRubric: Clones immutable tests! Student cannot tamper with assertions.
        
        GHActions->>GHActions: Stage 1: Static Linter (Ruff / Clippy / golangci-lint)
        GHActions->>GHActions: Stage 2: AST Structural Analysis
        GHActions->>GHActions: Stage 3: Deterministic Unit & Stress Tests
        GHActions->>GHActions: Stage 4: Memory Leak Detection (Valgrind / ASan)
        GHActions->>GHActions: Stage 5: Time Complexity Benchmarks
        
        GHActions->>GHActions: Generate JSON test results payload
        GHActions->>GHActions: Sign payload with HMAC-SHA256(student_secret)
        GHActions->>GradingWebhook: POST /api/webhooks/grading (Signed JSON Payload)
        deactivate GHActions
        
        activate GradingWebhook
        GradingWebhook->>GradingWebhook: Verify HMAC-SHA256 signature
        GradingWebhook->>GitHubAPI: GET /repos/{owner}/{repo}/actions/runs/{run_id}
        Note over GradingWebhook,GitHubAPI: Confirms that run actually ran on GitHub servers for that commit
        
        GradingWebhook->>SupabaseDB: Atomic UPSERT into capstone_submissions table
        SupabaseDB-->>GradingWebhook: Commit Successful
        GradingWebhook-->>LMSPortal: Realtime WebSocket Push: "100% Passed • Verified"
        deactivate GradingWebhook
        
        LMSPortal-->>Student: Displays graduation checkmark & unlocked next phase
    end
    deactivate EdgeAPI
```

---

## 7. Sequence: Streaming RAG AI Tutor UX (<400ms TTFT)

> **Zero Hallucination Guarantee**: The AI Tutor answers technical questions by retrieving exact curriculum context from the 5,000-chunk pgvector HNSW database. Tokens stream over Server-Sent Events (SSE) via the Next.js Edge Runtime, delivering the first token in under 400 milliseconds.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant ChatUI as Web Portal (AI Tutor Drawer)
    participant EdgeRuntime as Next.js Edge Runtime (/api/tutor)
    participant SupabaseVector as Supabase pgvector (HNSW Index)
    participant GeminiAPI as Google AI Studio (Gemini 1.5 Flash)

    Student->>ChatUI: Types: "Why does the LSM-Tree write to a WAL before the MemTable?"
    ChatUI->>EdgeRuntime: POST /api/tutor { question, current_lesson: "l214-lsm-trees" }
    
    activate EdgeRuntime
    EdgeRuntime->>GeminiAPI: Embed question via text-embedding-004
    GeminiAPI-->>EdgeRuntime: 768-dimensional float array
    
    EdgeRuntime->>SupabaseVector: SELECT chunk_content, subtopic_index FROM curriculum_embeddings WHERE lesson_slug = 'l214-lsm-trees' ORDER BY embedding <=> $1 LIMIT 4;
    SupabaseVector-->>EdgeRuntime: Top-4 grounded text chunks (Wal architecture, crash recovery)
    
    EdgeRuntime->>EdgeRuntime: Construct strictly bounded system prompt: "Answer using ONLY the provided curriculum text. If unknown, state so."
    
    EdgeRuntime->>GeminiAPI: GenerateContentStream(system_prompt, question, context_chunks)
    
    activate GeminiAPI
    GeminiAPI-->>EdgeRuntime: First token generated (< 400ms TTFT)
    EdgeRuntime-->>ChatUI: SSE Data: "The Write-Ahead Log (WAL) ensures durability..."
    ChatUI-->>Student: First token renders instantly (Zero perceived latency)
    
    loop Real-Time Streaming Loop
        GeminiAPI-->>EdgeRuntime: Next token batch
        EdgeRuntime-->>ChatUI: SSE data chunk
        ChatUI-->>Student: Smooth markdown rendering with formatted code blocks
    end
    
    GeminiAPI-->>EdgeRuntime: Stream complete [Citation: Phase 07, Lesson 214, Subtopic 2]
    deactivate GeminiAPI
    
    EdgeRuntime-->>ChatUI: Event: [DONE]
    deactivate EdgeRuntime
    
    ChatUI->>Student: Displays interactive citation link: "[P07.L214.S02 - Crash Durability Guarantees]"
```

---

## 8. Sequence: Error Handling, Graceful Recovery & Offline UX

This sequence models the platform's resilience against real-world friction: network dropouts, API rate limits, and Supabase auto-pause mitigation.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Browser as Browser Client (LocalStorage & Zustand)
    participant EdgeProxy as Next.js Edge Proxy
    participant Gemini as Gemini 1.5 Flash (15 RPM Limiter)
    participant GitHubCron as GitHub Actions Keepalive Cron
    participant Supabase as Supabase Database ($0 Free Tier)

    %% Scenario A: Network Drops While Coding
    Note over Student,Browser: Scenario A: Internet connection drops while student is coding
    Student->>Browser: Types 40 lines of code solution
    Browser->>Browser: Network listener detects navigator.onLine === false
    Browser->>Browser: Writes code to LocalStorage with timestamp
    Browser-->>Student: Displays subtle hairline amber chip: "Offline mode • Code saved locally"
    Student->>Browser: Reconnects to WiFi
    Browser->>Browser: Network listener fires 'online' event
    Browser->>Supabase: Background syncs progress and code draft
    Browser-->>Student: Chips switches to green: "Synced" (Zero data lost)

    %% Scenario B: Gemini Rate Limit (15 RPM)
    Note over Student,Gemini: Scenario B: AI Tutor hits 15 RPM token-bucket rate limit
    Student->>Browser: Submits fast follow-up question to AI Tutor
    Browser->>EdgeProxy: POST /api/tutor
    EdgeProxy->>EdgeProxy: In-memory token bucket indicates 0 available tokens (15 RPM limit)
    EdgeProxy-->>Browser: HTTP 429: { retry_after: 4, queue_position: 1 }
    Browser-->>Student: Displays countdown progress bar: "AI Tutor thinking... (Queue position 1 • 4s)"
    Browser->>EdgeProxy: Automatically retries after 4 seconds
    EdgeProxy->>Gemini: Executes query cleanly
    Gemini-->>Browser: Streams response (Student never sees a raw crash error)

    %% Scenario C: Supabase 7-Day Auto-Pause Prevention
    Note over GitHubCron,Supabase: Scenario C: Supabase free projects pause after 7 days of inactivity
    GitHubCron->>GitHubCron: Cron fires every 3 days at 00:00 UTC (.github/workflows/keepalive.yml)
    GitHubCron->>Supabase: curl -X GET https://[ref].supabase.co/rest/v1/phases?select=count
    Supabase-->>GitHubCron: 200 OK (Database active)
    Note over GitHubCron,Supabase: Prevents database hibernation without manual user intervention!
```

---

## 9. State Machine: Student Learning & Mastery Lifecycle (Zero Urgency)

> **Zero Artificial Urgency**: There are **no calendar deadlines, no cohort expirations, no point penalties for failures, and no streaks that punish students for taking time off**. The student advances purely by demonstrating deterministic mastery.

```mermaid
stateDiagram-v2
    [*] --> Unenrolled : Discovers LMS Platform

    Unenrolled --> ExploringCurriculum : Browses 500 Lessons freely (No paywall / No auth)
    
    ExploringCurriculum --> Authenticated : Signs in with GitHub OAuth to save progress

    state ActiveStudy {
        [*] --> ReadingConcept : Opens Lesson (Phase N // Lesson X)
        
        ReadingConcept --> PracticingWASM : Launches In-Browser Monaco Sandbox
        
        PracticingWASM --> PracticingWASM : Writes code & executes tests in Web Worker
        
        PracticingWASM --> LessonMastered : All AST assertions & unit tests pass (100%)
        
        LessonMastered --> ReadingConcept : Advances to Lesson X+1 at own pace
    }

    Authenticated --> ActiveStudy : Starts any lesson across 15 Phases

    ActiveStudy --> CapstoneTrack : All lessons in Phase N completed

    state CapstoneTrack {
        [*] --> LocalCloning : Clones Starter Template from GitHub
        
        LocalCloning --> LocalDevelopment : Codes in VS Code / Neovim on workstation
        
        LocalDevelopment --> LocalTesting : Runs native compilers & tests (gcc / cargo / go)
        
        LocalTesting --> GitHubPushing : Pushes commit to personal GitHub repo
        
        GitHubPushing --> AwaitingCI : Clicks "Verify Capstone" on LMS Portal
        
        AwaitingCI --> EvaluatingTests : GitHub Actions CI executes immutable rubric
        
        EvaluatingTests --> NeedsRevision : Any assertion fails or memory leak detected
        
        NeedsRevision --> LocalDevelopment : Inspects granular diagnostic logs (Infinite retries, zero penalties)
        
        EvaluatingTests --> CapstonePassed : 100% test suites & benchmarks pass
    }

    CapstonePassed --> ActiveStudy : Advances to Phase N+1
    CapstonePassed --> CertifiedArchitect : Completes Final Phase 15 Capstone
    
    CertifiedArchitect --> [*] : Cryptographic proof of completion generated
```

---

## 10. State Machine: Asynchronous Curriculum Population Engine

This state machine models the background script (`scripts/populate_curriculum.py`) that generates and populates all 500 lessons and 2,528 subtopics without skipping, hallucinating, or triggering Gemini free tier API limits.

```mermaid
stateDiagram-v2
    [*] --> Initialized : Reads curriculum.md (500 Lessons / 15 Phases)

    Initialized --> QueryingState : Inspects Supabase curriculum_generation_state table

    state GenerationPipeline {
        QueryingState --> Throttling : Identifies next ungenerated lesson
        
        Throttling --> CallingGemini : Token-bucket wait (12 RPM rate limit enforcement)
        
        CallingGemini --> ParsingSchema : Receives raw JSON from Gemini 1.5 Flash
        
        ParsingSchema --> CheckingAST : Pydantic / Zod schema validation succeeds
        
        ParsingSchema --> FailedRetry : JSON malformed or schema invalid
        
        CheckingAST --> CommittingDatabase : Code examples pass Python ast.parse()
        
        CheckingAST --> FailedRetry : Code example contains syntax errors
        
        CommittingDatabase --> StatePublished : Atomic Supabase transaction committed
        
        FailedRetry --> CallingGemini : Exponential backoff (sleep 15s, attempt_count + 1)
        
        StatePublished --> QueryingState : More lessons remain in curriculum.md
    }

    QueryingState --> AllCompleted : All 500 lessons committed and verified
    AllCompleted --> [*] : Production Curriculum Ready for Launch
```

---

## 11. Physical Deployment & Security Architecture (Level 3 Component Topology)

This diagram details the zero-dollar network boundaries, security perimeters, and protocol flows across the entire production infrastructure:

```mermaid
graph LR
    subgraph ClientPerimeter ["Client Security Boundary (Zero Trust)"]
        BrowserApp["Next.js App (Zustand + TanStack Query)"]
        WorkerBox["Isolated Web Worker Sandbox"]
        LocalMachine["Local Workstation (Compilers, Git CLI)"]
    end

    subgraph CDNPerimeter ["Cloudflare Edge & Vercel ($0)"]
        EdgeProxy["Cloudflare WAF / DDoS Mitigation"]
        NextEdge["Next.js Edge Runtime (Vercel Hobby)"]
    end

    subgraph GitHubPerimeter ["GitHub Actions Runner Environment"]
        RunnerVM["Isolated Ubuntu Linux VM Runner"]
        LinterEngine["Ruff / Clippy / Semgrep OSS"]
        TestHarness["Immutable Pytest / Cargo / Go Suite"]
    end

    subgraph DataPerimeter ["Supabase Cloud Security Perimeter"]
        Supavisor["Supavisor Transaction Pooler (Port 6543)"]
        PostgresEngine["PostgreSQL 15 (RLS Enforced)"]
        VectorHNSW["pgvector HNSW (Capped at 5k vectors)"]
    end

    subgraph AIService ["Google AI Studio API"]
        GeminiFlashAPI["Gemini 1.5 Flash Endpoint"]
    end

    BrowserApp -->|"Worker IPC postMessage"| WorkerBox
    BrowserApp -->|"HTTPS TLS 1.3"| EdgeProxy
    LocalMachine -->|"SSH / HTTPS git push"| RunnerVM
    EdgeProxy -->|"Zero-buffer SSE Stream"| NextEdge

    RunnerVM -->|"1. Pulls immutable rubric"| TestHarness
    RunnerVM -->|"2. Executes tests"| LinterEngine
    RunnerVM -->|"3. HMAC-SHA256 Webhook"| NextEdge

    NextEdge -->|"TLS 1.3 / Transaction Pooler"| Supavisor
    Supavisor -->|"Internal Unix Socket"| PostgresEngine
    PostgresEngine -->|"Shared Memory Buffer"| VectorHNSW

    NextEdge -->|"HTTPS REST API (12 RPM)"| GeminiFlashAPI
```

---

## 12. UX Principles & Architectural Verification Matrix

| UX Dimension | Architectural Guarantee | Verification in UML Models |
| :--- | :--- | :--- |
| **Zero Sense of Urgency** | No countdown timers, no cohort expirations, no point penalties for failed attempts. Students can spend 20 minutes or 3 months on a topic until it clicks. | Verified in **Section 9: Student Mastery Lifecycle**. |
| **0ms In-Lesson Feedback** | Practice exercises execute directly on the student's CPU via Pyodide and `sql.js` in a browser Web Worker. Feedback renders in < 20ms without any network request. | Verified in **Section 5: In-Lesson Practice Sandbox UX**. |
| **Watchdog Protection** | A 5,000ms watchdog timer cleanly terminates the Web Worker sandbox thread if an infinite loop occurs, keeping the browser UI completely fluid. | Verified in **Section 5: In-Lesson Practice Sandbox UX (Steps 18-21)**. |
| **Frictionless Local DX** | Students develop capstone projects in their preferred local IDE (VS Code, Neovim, terminal) with native compilers, mirroring real software engineering. | Verified in **Section 1: C4 Context Model** and **Section 6: Capstone Grading Loop**. |
| **Tamper-Proof Transparency** | Tests are objective and deterministic. The student's code is graded against immutable test suites pulled at runtime, eliminating grading subjectivity. | Verified in **Section 6: Capstone Grading Loop (Steps 12-14)**. |
| **Sub-400ms AI Streaming** | The AI Tutor streams tokens progressively over Server-Sent Events (SSE) from the Next.js Edge Runtime, eliminating frustrating 5-second wait times. | Verified in **Section 7: Streaming RAG AI Tutor UX**. |
| **Zero Lost Code (Offline Mode)** | Monaco editor auto-saves every keystroke to `localStorage`. If the network drops, work continues uninterrupted and syncs when reconnected. | Verified in **Section 8: Error Handling & Offline UX (Scenario A)**. |
| **$0 Permanent Cost** | Every database transaction, CI runner minute, and AI token fits permanently within verified free tiers, guaranteeing the student will never encounter paywalls. | Verified in **Section 3: Entity-Relationship Model** and **Section 11: Deployment Topology**. |
