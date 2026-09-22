-- Re-structure curriculum_phases to 14 discrete single-subject modules
DELETE FROM curriculum_phases;

INSERT INTO curriculum_phases (id, order_index, title, description) VALUES
('module-1', 0, 'Module 1: Python Programming Foundations', 'Pure Python syntax, dynamic typing, control flow, functions, file I/O, error handling, and basic testing.'),
('module-2', 1, 'Module 2: Software Craftsmanship & Object-Oriented Design', 'CPython object model, OOP protocols, Pydantic data validation schemas, pytest fixtures, and Clean Architecture.'),
('module-3', 2, 'Module 3: Discrete Mathematics & Computational Logic', 'Propositional and predicate logic, mathematical proofs, set theory, combinatorics, graph theory foundations, and asymptotic complexity.'),
('module-4', 3, 'Module 4: Linear Algebra, Vector Calculus & Autograd', 'NumPy memory layouts, matrix transformations, eigenvalues, analytical backprop, and building an autograd engine from scratch.'),
('module-5', 4, 'Module 5: Data Structures & Core Algorithms', 'Two pointers, sliding window, linked lists, binary search trees, heaps, graph traversals, and dynamic programming.'),
('module-6', 5, 'Module 6: Web Protocols & Asynchronous Backend Engineering', 'HTTP/1-3, TCP/IP, Python ASGI specification, FastAPI, token bucket rate limiting, JWT authentication, and Server-Sent Events.'),
('module-7', 6, 'Module 7: Relational Database Systems & PostgreSQL Internals', 'Relational algebra, SQL, B-Tree indexes, transactions, MVCC, write-ahead logging (WAL), EXPLAIN ANALYZE, and VACUUM.'),
('module-8', 7, 'Module 8: Modern Frontend Engineering & Interactive Platforms', 'Document Object Model, modern CSS architecture, React reconciliation & hooks, and Next.js App Router with React Server Components.'),
('module-9', 8, 'Module 9: High-Level System Design & Scalability', 'Load balancing, caching strategies, rate limiting proxies, time-series metrics pipelines, and real-time chat architecture.'),
('module-10', 9, 'Module 10: Distributed Systems & Consensus Protocols', 'CAP theorem, vector clocks, RPCs, Raft consensus algorithm, leader election, log replication, and chaos engineering.'),
('module-11', 10, 'Module 11: Production RAG & Vector Search Systems', 'Tokenization, dense/sparse embeddings, HNSW vector indexing, PostgreSQL pgvector, hybrid retrieval, and re-ranking pipelines.'),
('module-12', 11, 'Module 12: Systems Performance Profiling & AI Observability', 'CPU sampling, memory flame graphs, Go/Rust pprof, OpenTelemetry tracing, Langfuse, and LLM-as-a-judge evaluation benchmarks.'),
('module-13', 12, 'Module 13: Autonomous AI Agents & Tool Orchestration', 'ReAct reasoning loops, tool calling interfaces, LangGraph cyclic state graphs, Model Context Protocol (MCP), and sandboxed execution.'),
('module-14', 13, 'Module 14: Advanced Infrastructure & Enterprise Capstones', 'Kubernetes, Terraform IaC, multi-tenant billing, and comprehensive production capstone defense.');

-- Re-assign nodes to their respective modules, update order_index (1..N), and set canonical titles Lesson M.L

-- Module 1: Python Programming Foundations (node-0-1 to node-0-50 -> 1..50)
UPDATE curriculum_nodes
SET phase_id = 'module-1',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 1.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-0-%';

-- Module 2: Software Craftsmanship (node-1-1 to node-1-50 -> 1..50)
UPDATE curriculum_nodes
SET phase_id = 'module-2',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 2.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-1-%';

-- Module 3: Discrete Mathematics (node-2-1 to node-2-35 -> 1..35)
UPDATE curriculum_nodes
SET phase_id = 'module-3',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 3.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-2-%';

-- Module 4: Linear Algebra, Vector Calculus & Autograd (node-9-1 to node-9-35 -> 1..35)
UPDATE curriculum_nodes
SET phase_id = 'module-4',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 4.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-9-%';

-- Module 5: Data Structures & Core Algorithms (node-3-1 to node-3-45 -> 1..45)
UPDATE curriculum_nodes
SET phase_id = 'module-5',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 5.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-3-%';

-- Module 6: Web Protocols & Asynchronous Backend Engineering (node-4-1 to node-4-35 -> 1..35)
UPDATE curriculum_nodes
SET phase_id = 'module-6',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 6.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-4-%';

-- Module 7: Relational Database Systems & PostgreSQL Internals (node-5-1 to node-5-45 -> 1..45)
UPDATE curriculum_nodes
SET phase_id = 'module-7',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 7.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-5-%';

-- Module 8: Modern Frontend Engineering & Interactive Platforms (node-6-1 to node-6-40 -> 1..40)
UPDATE curriculum_nodes
SET phase_id = 'module-8',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 8.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-6-%';

-- Module 9: High-Level System Design & Scalability (node-8-1 to node-8-25 -> 1..25)
UPDATE curriculum_nodes
SET phase_id = 'module-9',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 9.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-8-%';

-- Module 10: Distributed Systems & Consensus Protocols (node-7-1 to node-7-35 -> 1..35)
UPDATE curriculum_nodes
SET phase_id = 'module-10',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 10.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-7-%';

-- Module 11: Production RAG & Vector Search Systems (node-10-1 to node-10-35 -> 1..35)
UPDATE curriculum_nodes
SET phase_id = 'module-11',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 11.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-10-%';

-- Module 12: Systems Performance Profiling & AI Observability (node-11-1 to node-11-25 -> 1..25)
UPDATE curriculum_nodes
SET phase_id = 'module-12',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 12.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-11-%';

-- Module 13: Autonomous AI Agents & Tool Orchestration (node-12-1 to node-12-30 -> 1..30)
UPDATE curriculum_nodes
SET phase_id = 'module-13',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 13.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-12-%';

-- Module 14 Part 1: Advanced Infrastructure (node-13-1 to node-13-20 -> 1..20)
UPDATE curriculum_nodes
SET phase_id = 'module-14',
    order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 14.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-13-%';

-- Module 14 Part 2: Enterprise Capstones (node-14-1 to node-14-15 -> 21..35)
UPDATE curriculum_nodes
SET phase_id = 'module-14',
    order_index = 20 + split_part(id, '-', 3)::int,
    title = 'Lesson 14.' || (20 + split_part(id, '-', 3)::int) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-14-%';
