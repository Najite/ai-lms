-- Add order_index column if it does not exist
ALTER TABLE curriculum_nodes ADD COLUMN IF NOT EXISTS order_index INTEGER;

-- Module 1 (node-0-1 to node-0-50)
UPDATE curriculum_nodes
SET order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 1.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-0-%';

-- Module 2 (node-1-1 to node-1-50)
UPDATE curriculum_nodes
SET order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 2.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-1-%';

-- Module 3 Part 1: Discrete Math (node-2-1 to node-2-35 -> 1..35)
UPDATE curriculum_nodes
SET order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 3.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-2-%';

-- Module 3 Part 2: Linear Algebra & Autograd (node-9-1 to node-9-35 -> 36..70)
UPDATE curriculum_nodes
SET order_index = 35 + split_part(id, '-', 3)::int,
    title = 'Lesson 3.' || (35 + split_part(id, '-', 3)::int) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-9-%';

-- Module 4 Part 1: Core Data Structures & Patterns (node-3-1 to node-3-45 -> 1..45)
UPDATE curriculum_nodes
SET order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 4.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-3-%';

-- Module 4 Part 2: Systems Algorithms & Capacity Design (node-8-1 to node-8-25 -> 46..70)
UPDATE curriculum_nodes
SET order_index = 45 + split_part(id, '-', 3)::int,
    title = 'Lesson 4.' || (45 + split_part(id, '-', 3)::int) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-8-%';

-- Module 5 Part 1: Web Protocols, ASGI & FastAPI (node-4-1 to node-4-35 -> 1..35)
UPDATE curriculum_nodes
SET order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 5.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-4-%';

-- Module 5 Part 2: Database Systems & Relational Algebra (node-5-1 to node-5-45 -> 36..80)
UPDATE curriculum_nodes
SET order_index = 35 + split_part(id, '-', 3)::int,
    title = 'Lesson 5.' || (35 + split_part(id, '-', 3)::int) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-5-%';

-- Module 6: Full-Stack Frontend Engineering (node-6-1 to node-6-40 -> 1..40)
UPDATE curriculum_nodes
SET order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 6.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-6-%';

-- Module 7 Part 1: Production RAG & Vector Search (node-10-1 to node-10-35 -> 1..35)
UPDATE curriculum_nodes
SET order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 7.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-10-%';

-- Module 7 Part 2: AI Observability & Performance Profiling (node-11-1 to node-11-25 -> 36..60)
UPDATE curriculum_nodes
SET order_index = 35 + split_part(id, '-', 3)::int,
    title = 'Lesson 7.' || (35 + split_part(id, '-', 3)::int) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-11-%';

-- Module 8 Part 1: Distributed Systems & Raft Consensus (node-7-1 to node-7-35 -> 1..35)
UPDATE curriculum_nodes
SET order_index = split_part(id, '-', 3)::int,
    title = 'Lesson 8.' || split_part(id, '-', 3) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-7-%';

-- Module 8 Part 2: Autonomous AI Agents & Tool Calling (node-12-1 to node-12-30 -> 36..65)
UPDATE curriculum_nodes
SET order_index = 35 + split_part(id, '-', 3)::int,
    title = 'Lesson 8.' || (35 + split_part(id, '-', 3)::int) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-12-%';

-- Module 8 Part 3: Specialized Advanced Infrastructure (node-13-1 to node-13-20 -> 66..85)
UPDATE curriculum_nodes
SET order_index = 65 + split_part(id, '-', 3)::int,
    title = 'Lesson 8.' || (65 + split_part(id, '-', 3)::int) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-13-%';

-- Module 8 Part 4: Production Deployment & Capstone Defense (node-14-1 to node-14-15 -> 86..100)
UPDATE curriculum_nodes
SET order_index = 85 + split_part(id, '-', 3)::int,
    title = 'Lesson 8.' || (85 + split_part(id, '-', 3)::int) || ': ' || regexp_replace(title, '^Lesson\s+[\d.]+:\s*', '')
WHERE id LIKE 'node-14-%';
