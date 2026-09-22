INSERT INTO curriculum_phases (id, order_index, title, description)
VALUES ('module-1', 0, 'Module 1: Programming Foundations & Developer Fluency', 'Python 3.12 syntax, interpreter execution model, expressions, control flow, functions, collections, file I/O, JSON, error handling, HTTPX, command-line arguments, virtual environments (uv), Git version control, pytest, and robust Bash scripting.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

INSERT INTO curriculum_phases (id, order_index, title, description)
VALUES ('module-2', 1, 'Module 2: Software Craftsmanship & Data Contracts', 'Deep Python object model (PyObject, reference counting, GC), closures, decorators, dunder protocols, metaclasses, slots, static typing with Mypy, structured concurrency with asyncio.TaskGroup, property-based testing (Hypothesis), and TypeScript architecture.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

INSERT INTO curriculum_phases (id, order_index, title, description)
VALUES ('module-3', 2, 'Module 3: Mathematical Foundations & Numerical Computing', 'Discrete mathematics, Big-O complexity proofs, NumPy memory buffers and vectorization, linear transformations, dot products, cosine similarity, SVD, probability theory, Bayes theorem, entropy, calculus gradients, computational autograd engine from scratch, and Transformer self-attention mathematics.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

INSERT INTO curriculum_phases (id, order_index, title, description)
VALUES ('module-4', 3, 'Module 4: Data Structures & Algorithmic Problem Solving', 'Core computer science problem solving: two pointers, sliding window, linked lists, hash maps with custom collision resolution, balanced search trees (AVL/Red-Black), binary heaps, tries, graph algorithms (BFS, DFS, Dijkstra, MST), dynamic programming (1D, 2D, string, bitmask), and systems capacity design.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

INSERT INTO curriculum_phases (id, order_index, title, description)
VALUES ('module-5', 4, 'Module 5: Web Architecture, High-Performance APIs & Database Systems', 'HTTP/1.1 vs HTTP/2 vs HTTP/3, FastAPI microservices, ASGI, asyncio event loops, Server-Sent Events (SSE) token streaming, WebSockets, PostgreSQL relational algebra, SQL optimization, window functions, B-Tree/GIN indexes, MVCC, connection pooling, and Redis semantic caching.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

INSERT INTO curriculum_phases (id, order_index, title, description)
VALUES ('module-6', 5, 'Module 6: Full-Stack Frontend Engineering & Interactive Platforms', 'Modern React architecture, Next.js App Router, React Server Components (RSC), client-side state management (Zustand), TanStack Query, real-time WebSockets UI, Canvas 2D / WebGL rendering, WebAssembly (Wasm), Core Web Vitals, and accessibility engineering.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

INSERT INTO curriculum_phases (id, order_index, title, description)
VALUES ('module-7', 6, 'Module 7: Production RAG, Vector Search & AI Observability', 'Embedding models, vector similarity metrics, PostgreSQL pgvector (IVFFlat and HNSW index tuning), advanced chunking, BM25 hybrid search with reciprocal rank fusion (RRF), cross-encoder re-ranking, LLM evaluation suites (Ragas), LLM-as-a-judge, OpenTelemetry distributed tracing, and Langfuse telemetry.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

INSERT INTO curriculum_phases (id, order_index, title, description)
VALUES ('module-8', 7, 'Module 8: Autonomous Agents, Systems Infrastructure & Production Defense', 'Autonomous AI agent patterns (ReAct, plan-and-solve), tool execution pipelines, Model Context Protocol (MCP) clients and servers, LangGraph cyclic state machines, agent memory hierarchies, distributed consensus (Raft), Docker/Kubernetes container orchestration, and comprehensive enterprise capstone defense.')
ON CONFLICT (id) DO UPDATE SET
    order_index = EXCLUDED.order_index,
    title = EXCLUDED.title,
    description = EXCLUDED.description;

UPDATE curriculum_nodes SET phase_id = 'module-1' WHERE phase_id = 'phase-0';

UPDATE curriculum_nodes SET phase_id = 'module-2' WHERE phase_id = 'phase-1';

UPDATE curriculum_nodes SET phase_id = 'module-3' WHERE phase_id = 'phase-2';

UPDATE curriculum_nodes SET phase_id = 'module-3' WHERE phase_id = 'phase-9';

UPDATE curriculum_nodes SET phase_id = 'module-4' WHERE phase_id = 'phase-3';

UPDATE curriculum_nodes SET phase_id = 'module-4' WHERE phase_id = 'phase-8';

UPDATE curriculum_nodes SET phase_id = 'module-5' WHERE phase_id = 'phase-4';

UPDATE curriculum_nodes SET phase_id = 'module-5' WHERE phase_id = 'phase-5';

UPDATE curriculum_nodes SET phase_id = 'module-6' WHERE phase_id = 'phase-6';

UPDATE curriculum_nodes SET phase_id = 'module-7' WHERE phase_id = 'phase-10';

UPDATE curriculum_nodes SET phase_id = 'module-7' WHERE phase_id = 'phase-11';

UPDATE curriculum_nodes SET phase_id = 'module-8' WHERE phase_id = 'phase-7';

UPDATE curriculum_nodes SET phase_id = 'module-8' WHERE phase_id = 'phase-12';

UPDATE curriculum_nodes SET phase_id = 'module-8' WHERE phase_id = 'phase-13';

UPDATE curriculum_nodes SET phase_id = 'module-8' WHERE phase_id = 'phase-14';

DELETE FROM curriculum_phases WHERE id IN ('phase-0', 'phase-1', 'phase-2', 'phase-9', 'phase-3', 'phase-8', 'phase-4', 'phase-5', 'phase-6', 'phase-10', 'phase-11', 'phase-7', 'phase-12', 'phase-13', 'phase-14');