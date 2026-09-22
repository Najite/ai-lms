"""
Migration script to restructure curriculum_phases and curriculum_nodes into the 8-Module Architecture.
"""

MODULE_DEFS = [
    {
        "id": "module-1",
        "order_index": 0,
        "title": "Module 1: Programming Foundations & Developer Fluency",
        "description": "Python 3.12 syntax, interpreter execution model, expressions, control flow, functions, collections, file I/O, JSON, error handling, HTTPX, command-line arguments, virtual environments (uv), Git version control, pytest, and robust Bash scripting.",
    },
    {
        "id": "module-2",
        "order_index": 1,
        "title": "Module 2: Software Craftsmanship & Data Contracts",
        "description": "Deep Python object model (PyObject, reference counting, GC), closures, decorators, dunder protocols, metaclasses, slots, static typing with Mypy, structured concurrency with asyncio.TaskGroup, property-based testing (Hypothesis), and TypeScript architecture.",
    },
    {
        "id": "module-3",
        "order_index": 2,
        "title": "Module 3: Mathematical Foundations & Numerical Computing",
        "description": "Discrete mathematics, Big-O complexity proofs, NumPy memory buffers and vectorization, linear transformations, dot products, cosine similarity, SVD, probability theory, Bayes theorem, entropy, calculus gradients, computational autograd engine from scratch, and Transformer self-attention mathematics.",
    },
    {
        "id": "module-4",
        "order_index": 3,
        "title": "Module 4: Data Structures & Algorithmic Problem Solving",
        "description": "Core computer science problem solving: two pointers, sliding window, linked lists, hash maps with custom collision resolution, balanced search trees (AVL/Red-Black), binary heaps, tries, graph algorithms (BFS, DFS, Dijkstra, MST), dynamic programming (1D, 2D, string, bitmask), and systems capacity design.",
    },
    {
        "id": "module-5",
        "order_index": 4,
        "title": "Module 5: Web Architecture, High-Performance APIs & Database Systems",
        "description": "HTTP/1.1 vs HTTP/2 vs HTTP/3, FastAPI microservices, ASGI, asyncio event loops, Server-Sent Events (SSE) token streaming, WebSockets, PostgreSQL relational algebra, SQL optimization, window functions, B-Tree/GIN indexes, MVCC, connection pooling, and Redis semantic caching.",
    },
    {
        "id": "module-6",
        "order_index": 5,
        "title": "Module 6: Full-Stack Frontend Engineering & Interactive Platforms",
        "description": "Modern React architecture, Next.js App Router, React Server Components (RSC), client-side state management (Zustand), TanStack Query, real-time WebSockets UI, Canvas 2D / WebGL rendering, WebAssembly (Wasm), Core Web Vitals, and accessibility engineering.",
    },
    {
        "id": "module-7",
        "order_index": 6,
        "title": "Module 7: Production RAG, Vector Search & AI Observability",
        "description": "Embedding models, vector similarity metrics, PostgreSQL pgvector (IVFFlat and HNSW index tuning), advanced chunking, BM25 hybrid search with reciprocal rank fusion (RRF), cross-encoder re-ranking, LLM evaluation suites (Ragas), LLM-as-a-judge, OpenTelemetry distributed tracing, and Langfuse telemetry.",
    },
    {
        "id": "module-8",
        "order_index": 7,
        "title": "Module 8: Autonomous Agents, Systems Infrastructure & Production Defense",
        "description": "Autonomous AI agent patterns (ReAct, plan-and-solve), tool execution pipelines, Model Context Protocol (MCP) clients and servers, LangGraph cyclic state machines, agent memory hierarchies, distributed consensus (Raft), Docker/Kubernetes container orchestration, and comprehensive enterprise capstone defense.",
    },
]

# Remapping rule: old phase_id -> new module_id
PHASE_MAPPING = {
    "phase-0": "module-1",
    "phase-1": "module-2",
    "phase-2": "module-3",
    "phase-9": "module-3",
    "phase-3": "module-4",
    "phase-8": "module-4",
    "phase-4": "module-5",
    "phase-5": "module-5",
    "phase-6": "module-6",
    "phase-10": "module-7",
    "phase-11": "module-7",
    "phase-7": "module-8",
    "phase-12": "module-8",
    "phase-13": "module-8",
    "phase-14": "module-8",
}

print(f"Configured {len(MODULE_DEFS)} modules and {len(PHASE_MAPPING)} phase mappings.")
