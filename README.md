# AI:NATIVE OS — Enterprise Systems Learning Platform

A project-based, experiential engineering platform designed to train zero-experience learners into world-class AI-Native Systems Architects on a **$0 budget**.

---

## Key Highlights

- **Live Database & Zero Mock Data**: Powered by a dedicated Supabase PostgreSQL instance with `pgvector` enabled and full Row Level Security (RLS).
- **Better Stack × Evervault Design System**: High-density obsidian aesthetic (`#07080b`), crisp 1px borders, telemetry pulses, and dual Geist/Geist Mono typography.
- **Built-In Autonomous Staff AI Agent** (`src/lib/agent/staffAgent.ts`):
  - **Socratic Ghost**: Background AST watcher providing real-time non-spoilering architectural reflections in the editor.
  - **Socratic Griller**: Automated code defense interrogator evaluating technical trade-offs.
  - **Chaos Monkey**: Real-time 20-minute P0 production outage generator with live error logs and telemetry.
  - **Red-Team Arena**: Adversarial prompt injection and jailbreak evaluator.
- **In-Browser Execution Engine ($0 Compute)**: Pyodide WebAssembly (Python 3.12) runs tests 100% client-side with zero backend server costs.
- **Context Flamegraph & Latency Profiler**: Visual horizontal breakdown of the context window (System, Exemplars, RAG Chunks, History), TTFT latency metrics, and dollar cost tickers.
- **Dual-Mode Content Viewer**: Toggle between textbook-grade technical handbooks and Google NotebookLM audio deep-dive players.

---

## 6-Phase Blended Curriculum

1. **Phase 1: Systems, Memory & Computation**: Byte streams, memory buffers, UTF-8/ASCII encodings, and BPE tokenizer construction.
2. **Phase 2: Data Structures, Graphs & Retrieval**: Inverted indexes, BM25 ranking, dense vector spaces, HNSW, Reciprocal Rank Fusion (RRF), and Graph-RAG.
3. **Phase 3: Concurrency, Networking & Streaming**: Async event loops, WebSockets, real-time Server-Sent Events (SSE) streaming, and parallel tool dispatchers.
4. **Phase 4: Database Internals & State Persistence**: Relational modeling, `pgvector` HNSW tuning, and semantic caching engines.
5. **Phase 5: Clean Architecture, Testing & Evaluation CI/CD**: LangGraph-style state machines, automated CI/CD PR auditors, and LLM-as-a-judge (Ragas) evals.
6. **Phase 6: Distributed Systems, High Throughput & Capstone**: vLLM serving clusters, speculative decoding, prompt injection firewalls, and the grand autonomous enterprise incident response capstone.

---

## Getting Started

### 1. Environment Setup
Create `.env.local` (pre-configured with your live Supabase project):
```env
NEXT_PUBLIC_SUPABASE_URL=https://lfsyndffrfwvdfzjsagl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build & Production
```bash
npm run build
```
