#!/usr/bin/env python3
"""
scripts/update_module11.py
Updates Module 11 in Supabase:
- Phase title & description in curriculum_phases
- All 50 lesson titles in curriculum_nodes
"""
import json
import urllib.request

with open('/home/gamp/.gemini/antigravity-ide/mcp_oauth_tokens.json') as f:
    tokens = json.load(f)
token = tokens['https://mcp.supabase.com/mcp']['token']['access_token']

def run_query(sql):
    req = urllib.request.Request(
        'https://api.supabase.com/v1/projects/lfsyndffrfwvdfzjsagl/database/query',
        data=json.dumps({'query': sql}).encode('utf-8'),
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))

M11_TITLE = "Module 11: Production RAG & Hybrid Retrieval Engines"
M11_DESC = "Industrial-strength Retrieval-Augmented Generation: IVF/HNSW vector indices, product quantization, hybrid search (BM25 + dense), cross-encoder re-ranking, and self-corrective RAG architectures."

M11_LESSONS = [
    # Block 1: Vector Space Geometry & Approximate Nearest Neighbors (11.1 - 11.10)
    (1, "Lesson 11.1: Vector Similarity Metrics and Distance Spaces"),
    (2, "Lesson 11.2: Exact K-Nearest Neighbors Search Engine"),
    (3, "Lesson 11.3: Inverted File Index with K-Means Centroids"),
    (4, "Lesson 11.4: Inverted File Search and Query Probe Sizing"),
    (5, "Lesson 11.5: HNSW Graph Architecture and Skip-List Layering"),
    (6, "Lesson 11.6: HNSW Greedy Graph Traversal Algorithm"),
    (7, "Lesson 11.7: HNSW Heuristic Edge Selection and Pruning"),
    (8, "Lesson 11.8: Product Quantization and Sub-Vector Decomposition"),
    (9, "Lesson 11.9: Product Quantization Codebook Training"),
    (10, "Lesson 11.10: Asymmetric Distance Computation for Quantized Vectors"),

    # Block 2: Vector Database Internals & Filtering (11.11 - 11.20)
    (11, "Lesson 11.11: Scalar Quantization INT8 Vector Compression"),
    (12, "Lesson 11.12: Locality-Sensitive Hashing with Hyperplanes"),
    (13, "Lesson 11.13: PostgreSQL pgvector HNSW Tuning and Maintenance"),
    (14, "Lesson 11.14: Pre-Filtering, Post-Filtering and Single-Stage Search"),
    (15, "Lesson 11.15: Recursive Character Chunking with Overlap"),
    (16, "Lesson 11.16: Token-Aware Sliding Window Chunking"),
    (17, "Lesson 11.17: Semantic Chunking via Embedding Distance Transitions"),
    (18, "Lesson 11.18: AST-Based Source Code Chunking"),
    (19, "Lesson 11.19: Markdown and HTML Document Structure Splitters"),
    (20, "Lesson 11.20: Multimodal Document Table Parsing and Serialization"),

    # Block 3: Ingestion Pipelines & Hybrid Lexical Retrieval (11.21 - 11.30)
    (21, "Lesson 11.21: Metadata Extraction and Document Enrichment"),
    (22, "Lesson 11.22: Ingestion Deduplication with Content Hashing"),
    (23, "Lesson 11.23: Change Data Capture for Vector Ingestion Pipelines"),
    (24, "Lesson 11.24: Inverted Index Posting Lists for Lexical Search"),
    (25, "Lesson 11.25: Okapi BM25 Ranking and Term Frequency Saturation"),
    (26, "Lesson 11.26: Learned Sparse Embeddings and SPLADE Term Expansion"),
    (27, "Lesson 11.27: Reciprocal Rank Fusion Hybrid Search Engine"),
    (28, "Lesson 11.28: Weighted Linear Score Normalization for Hybrid Search"),
    (29, "Lesson 11.29: Cross-Encoder Re-Ranking Pipeline"),
    (30, "Lesson 11.30: ColBERT Late-Interaction Retrieval and MaxSim Operator"),

    # Block 4: Query Transformation & Advanced Retrieval Strategies (11.31 - 11.40)
    (31, "Lesson 11.31: Multi-Query Generation and Parallel Retrieval"),
    (32, "Lesson 11.32: Hypothetical Document Embeddings Generation"),
    (33, "Lesson 11.33: Query Decomposition and Sub-Question Routing"),
    (34, "Lesson 11.34: Contextual Retrieval and Chunk Prefix Injection"),
    (35, "Lesson 11.35: Parent-Document Retrieval Architecture"),
    (36, "Lesson 11.36: Sentence-Window Retrieval Engine"),
    (37, "Lesson 11.37: GraphRAG Entity-Relation Extraction and Indexing"),
    (38, "Lesson 11.38: GraphRAG Subgraph Traversal for Multi-Hop Queries"),
    (39, "Lesson 11.39: Information-Theoretic Context Token Compression"),
    (40, "Lesson 11.40: Extractive Context Summarization and Lost-in-the-Middle Mitigation"),

    # Block 5: Self-Correction, Guardrails & Production Scale (11.41 - 11.49)
    (41, "Lesson 11.41: Grounded Attribution and Inline Source Citations"),
    (42, "Lesson 11.42: Self-RAG Reflection Tokens and Adaptive Retrieval"),
    (43, "Lesson 11.43: Corrective RAG with Retrieval Evaluation and Fallback"),
    (44, "Lesson 11.44: Time-Decayed Relevance Scoring for Dynamic Knowledge"),
    (45, "Lesson 11.45: Vision-Language Multi-Vector Document Representation"),
    (46, "Lesson 11.46: Distributed Scatter-Gather Sharded Vector Search"),
    (47, "Lesson 11.47: Two-Tier Exact and Semantic Vector Caching"),
    (48, "Lesson 11.48: Dynamic Top-K Selection and Distance Elbow Cutoffs"),
    (49, "Lesson 11.49: PII Redaction and Prompt Injection Scrubbing Guardrails"),

    # Block 6: Capstone Project (11.50)
    (50, "Lesson 11.50: Capstone: DocuSearch — Enterprise Hybrid RAG & Knowledge Retrieval Platform"),
]

def main():
    print(f"Updating curriculum_phases for module-11...")
    update_phase_sql = f"""
    UPDATE curriculum_phases
    SET title = '{M11_TITLE}',
        description = '{M11_DESC}'
    WHERE id = 'module-11';
    """
    res = run_query(update_phase_sql)
    print("Phase updated:", res)

    print(f"Updating 50 curriculum_nodes for module-11...")
    statements = []
    for order_idx, title in M11_LESSONS:
        clean_title = title.replace("'", "''")
        statements.append(f"""
        UPDATE curriculum_nodes
        SET title = '{clean_title}'
        WHERE phase_id = 'module-11' AND order_index = {order_idx};
        """)

    full_sql = "\n".join(statements)
    res_nodes = run_query(full_sql)
    print("Nodes updated successfully!")

    verify = run_query("SELECT order_index, title FROM curriculum_nodes WHERE phase_id = 'module-11' ORDER BY order_index;")
    print(f"Verification: {len(verify)} nodes returned.")
    print("First 3:", verify[:3])
    print("Last 3:", verify[-3:])

if __name__ == "__main__":
    main()
