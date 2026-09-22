#!/usr/bin/env python3
"""
generate_db_update_sql.py
Generates the exact SQL queries to update curriculum_phases and Phase 0 curriculum_nodes in Supabase.
"""
import re
import json

CURRICULUM_PATH = "/home/gamp/Documents/lms/curriculum.md"
OUTPUT_SQL = "/home/gamp/Documents/lms/scripts/update_database_ai_native.sql"

def escape_sql(text):
    if text is None:
        return "NULL"
    return "'" + str(text).replace("'", "''") + "'"

def generate():
    with open(CURRICULUM_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    phase_blocks = list(re.finditer(r"## Phase (\d+): (.*?)\n(.*?)(?=\n## Phase |\Z)", content, re.DOTALL))
    
    sql_statements = []
    sql_statements.append("-- ==============================================================================")
    sql_statements.append("-- Sync Modernized AI-Native Curriculum to Supabase")
    sql_statements.append("-- ==============================================================================\n")

    # 1. Update curriculum_phases titles and descriptions
    phase_updates = [
        (0, "Phase 0: Programming Foundations & Terminal Fluency", "Beginner-friendly computing fundamentals: writing clean Python, command-line mastery, virtual environments, Git branching, JSON handling, and making your first AI API calls."),
        (1, "Phase 1: Software Craftsmanship & Data Contracts", "Building production software: object-oriented design, static typing, Pydantic data validation schemas, automated unit testing with pytest, and structured AI outputs."),
        (2, "Phase 2: Intuitive Math, Vectors & Numerical Computing", "Visual mathematics for AI: 2D/3D coordinates, vectors, dot products, cosine similarity, dimensions, token embeddings, and NumPy array computing from scratch."),
        (3, "Phase 3: Data Structures & Practical Problem Solving", "Algorithmic mastery: hash maps, sliding windows, two-pointers, stacks, queues, trees, and text tokenization algorithms required for data pipelines."),
        (4, "Phase 4: Web Architecture, HTTP & Asynchronous APIs", "How modern web systems communicate: HTTP/1.1 and HTTP/2, REST APIs, Python asyncio event loops, Server-Sent Events (SSE) for token streaming, and Docker containerization."),
        (5, "Phase 5: Relational Databases, PostgreSQL & Semantic Caching", "Persistent data systems: relational modeling, SQL optimization, PostgreSQL indexing, connection pooling, ACID transactions, and Redis semantic caching for AI responses."),
        (10, "Phase 10: Production RAG, Hybrid Retrieval & pgvector", "Production RAG architectures: semantic chunking, PostgreSQL pgvector with HNSW indexing, hybrid sparse (BM25) + dense search, cross-encoder re-ranking, and grounded citation pipelines."),
        (11, "Phase 11: AI Evals, Observability & OpenTelemetry", "Testing and observing generative AI: LLM-as-a-judge evaluation frameworks (Ragas/DeepEval), synthetic test sets, OpenTelemetry distributed tracing (Langfuse), latency (TTFT), and cost telemetry."),
        (12, "Phase 12: Autonomous Agents, State Machines & Model Context Protocol", "Stateful autonomous agent systems: ReAct reasoning loops, tool calling interfaces, LangGraph cyclic state machines, Model Context Protocol (MCP) tool integration, and secure sandbox execution."),
    ]

    for p_num, title, desc in phase_updates:
        sql = f"UPDATE curriculum_phases SET title = {escape_sql(title)}, description = {escape_sql(desc)} WHERE id = 'phase-{p_num}';"
        sql_statements.append(sql)

    sql_statements.append("\n-- 2. Update Modernized Phase 0 Nodes\n")

    for p_match in phase_blocks:
        p_num = int(p_match.group(1))
        if p_num != 0:
            continue
        p_body = p_match.group(3)

        lesson_blocks = list(re.finditer(
            r"#### Lesson (\d+)\.(\d+): (.*?)\n(.*?)(?=(?:#### Lesson \d+\.\d+:|### Phase |\Z))",
            p_body,
            re.DOTALL
        ))

        for l_match in lesson_blocks:
            lp_num = int(l_match.group(1))
            l_num = int(l_match.group(2))
            l_title = l_match.group(3).strip()
            l_content = l_match.group(4).strip()

            node_id = f"node-{lp_num}-{l_num}"
            node_title = f"Lesson {lp_num}.{l_num}: {l_title}"

            prereqs_match = re.search(r"- \*\*Prerequisites\*\*: (.*?)\n", l_content)
            prereqs = prereqs_match.group(1).strip() if prereqs_match else "None (Foundational)"

            verif_match = re.search(r"- \*\*Verification & Mastery Check\*\*: (.*?)\n", l_content)
            verif = verif_match.group(1).strip() if verif_match else "Complete test suite passing with 100% assertions"

            proj_match = re.search(r"- \*\*Project Application\*\*: (.*?)\n", l_content)
            proj_app = proj_match.group(1).strip() if proj_match else "AI software application"

            subtopics = re.findall(r"  - `(\d+\.\d+\.\d+)` (.*?)\n", l_content)
            subtitle = f"Prerequisites: {prereqs[:100]}"
            handbook = f"# Lesson {lp_num}.{l_num}: {l_title}\n\n" + l_content

            sql = f"""UPDATE curriculum_nodes 
SET title = {escape_sql(node_title)}, 
    subtitle = {escape_sql(subtitle)}, 
    cs_foundation = {escape_sql(f'Prerequisites: {prereqs} | Subtopics: {len(subtopics)} items')},
    ai_convergence = {escape_sql(proj_app)},
    handbook_markdown = {escape_sql(handbook)}
WHERE id = '{node_id}';"""
            sql_statements.append(sql)

    full_sql = "\n".join(sql_statements)
    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write(full_sql)

    print(f"Generated {len(sql_statements)} statements to {OUTPUT_SQL}")

if __name__ == "__main__":
    generate()
