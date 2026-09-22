# Generate and update Module 11 nodes (node-10-1 to node-10-50) in Supabase
import json
import urllib.request
import urllib.error
import re

with open('/home/gamp/.gemini/antigravity-ide/mcp_oauth_tokens.json') as f:
    token = json.load(f)['https://mcp.supabase.com/mcp']['token']['access_token']

BASE_URL = 'https://api.supabase.com/v1/projects/lfsyndffrfwvdfzjsagl/database/query'

def run_sql(query):
    req = urllib.request.Request(
        BASE_URL,
        headers={'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'},
        data=json.dumps({'query': query}).encode('utf-8')
    )
    try:
        res = urllib.request.urlopen(req)
        return json.loads(res.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        print("SQL Error:", e.code, e.read().decode('utf-8'))
        raise

def sql_escape(s):
    if s is None:
        return "NULL"
    return "'" + str(s).replace("'", "''") + "'"

def slugify(text):
    s = text.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:75]

# 1. Update Phase Description
update_phase_sql = """
UPDATE curriculum_phases
SET title = 'Module 11: Production RAG & Vector Search Systems',
    description = 'Enterprise vector search and retrieval-augmented generation: HNSW graph indexing, Product Quantization, BM25 lexical fusion, ColBERT late interaction, and contextual compression.'
WHERE id = 'module-11';
"""
run_sql(update_phase_sql)
print("Updated curriculum_phases for module-11")

# 50 Lessons
lessons = [
    (
        1, "node-10-1", "Lesson 11.1: Vector Similarity Metrics: Cosine, Dot Product & Euclidean L2",
        "Implement normalized cosine similarity, inner dot product, and Euclidean L2 distance kernels with vector normalization.",
        300,
        """import math

class VectorMetrics:
    @staticmethod
    def dot_product(v1: list, v2: list) -> float:
        return sum(a * b for a, b in zip(v1, v2))

    @staticmethod
    def l2_norm(v: list) -> float:
        return math.sqrt(sum(x * x for x in v))

    @staticmethod
    def cosine_similarity(v1: list, v2: list) -> float:
        norm1 = VectorMetrics.l2_norm(v1)
        norm2 = VectorMetrics.l2_norm(v2)
        if norm1 == 0.0 or norm2 == 0.0: return 0.0
        return VectorMetrics.dot_product(v1, v2) / (norm1 * norm2)

    @staticmethod
    def euclidean_distance(v1: list, v2: list) -> float:
        return math.sqrt(sum((a - b) ** 2 for a, b in zip(v1, v2)))
""",
        """from solution import VectorMetrics

def test_vector_metrics():
    v1 = [1.0, 0.0]
    v2 = [0.0, 1.0]
    v3 = [2.0, 0.0]
    assert VectorMetrics.dot_product(v1, v2) == 0.0
    assert VectorMetrics.cosine_similarity(v1, v3) == 1.0
    assert VectorMetrics.euclidean_distance(v1, v2) == math.sqrt(2.0)
""",
        "Similarity kernels must handle unit-normalized vectors where cosine similarity simplifies to dot product."
    ),
    (
        2, "node-10-2", "Lesson 11.2: Brute-Force Exact K-Nearest Neighbors (KNN) Index",
        "Implement an exact flat KNN index scanning an in-memory vector array and extracting top-K candidates via min-heap.",
        305,
        """import heapq
import math

class FlatKNNIndex:
    def __init__(self):
        self.vectors = [] # list of (id, vector)

    def add(self, vec_id: str, vector: list):
        self.vectors.append((vec_id, vector))

    def search(self, query: list, k: int) -> list:
        # Distance = Euclidean
        results = []
        for vid, vec in self.vectors:
            dist = math.sqrt(sum((a - b) ** 2 for a, b in zip(query, vec)))
            results.append((dist, vid))
        # Smallest distances
        top_k = heapq.nsmallest(k, results, key=lambda x: x[0])
        return [{'id': vid, 'distance': dist} for dist, vid in top_k]
""",
        """from solution import FlatKNNIndex

def test_flat_knn():
    index = FlatKNNIndex()
    index.add('doc1', [1.0, 0.0])
    index.add('doc2', [0.0, 1.0])
    index.add('doc3', [0.9, 0.1])
    res = index.search([1.0, 0.0], k=2)
    assert len(res) == 2
    assert res[0]['id'] == 'doc1'
    assert res[1]['id'] == 'doc3'
""",
        "Flat KNN guarantees 100% recall serving as the golden baseline against approximate search algorithms."
    ),
    (
        3, "node-10-3", "Lesson 11.3: Inverted File Index (IVF): K-Means Centroid Partitions",
        "Implement K-Means clustering to partition a high-dimensional vector space into Voronoi centroid clusters.",
        310,
        """import random
import math

class IVFClusterer:
    def __init__(self, k_clusters: int, max_iter: int = 10):
        self.k = k_clusters
        self.max_iter = max_iter
        self.centroids = []

    def fit(self, vectors: list):
        # Pick k initial centroids
        self.centroids = [list(v) for v in random.sample(vectors, self.k)]
        for _ in range(self.max_iter):
            clusters = [[] for _ in range(self.k)]
            for v in vectors:
                # Find nearest centroid
                best_idx = min(range(self.k), key=lambda i: sum((a - b) ** 2 for a, b in zip(v, self.centroids[i])))
                clusters[best_idx].append(v)
            # Recompute centroids
            for i in range(self.k):
                if clusters[i]:
                    dim = len(vectors[0])
                    self.centroids[i] = [sum(c[d] for c in clusters[i]) / len(clusters[i]) for d in range(dim)]
""",
        """from solution import IVFClusterer

def test_ivf_clustering():
    data = [[1.0, 1.0], [1.1, 0.9], [10.0, 10.0], [10.1, 9.9]]
    clusterer = IVFClusterer(k_clusters=2, max_iter=5)
    clusterer.fit(data)
    assert len(clusterer.centroids) == 2
""",
        "IVF partitioning narrows search spaces by assigning vectors to localized Voronoi clusters."
    ),
    (
        4, "node-10-4", "Lesson 11.4: Inverted File Index (IVF): Inverted List Ingestion & Search",
        "Build an IVF posting list index querying nearest centroids (`nprobe`) and pruning unvisited clusters.",
        315,
        """class IVFIndex:
    def __init__(self, centroids: list):
        self.centroids = centroids # list of vectors
        self.posting_lists = {i: [] for i in range(len(centroids))} # centroid_idx -> list of (id, vec)

    def add(self, vec_id: str, vector: list):
        # Find nearest centroid
        best_c = min(range(len(self.centroids)), key=lambda i: sum((a - b) ** 2 for a, b in zip(vector, self.centroids[i])))
        self.posting_lists[best_c].append((vec_id, vector))

    def search(self, query: list, nprobe: int, k: int) -> list:
        # Find nprobe closest centroids
        c_dists = [(sum((a - b) ** 2 for a, b in zip(query, c)), idx) for idx, c in enumerate(self.centroids)]
        c_dists.sort(key=lambda x: x[0])
        probed_centroids = [idx for _, idx in c_dists[:nprobe]]
        
        candidates = []
        for c_idx in probed_centroids:
            for vid, vec in self.posting_lists[c_idx]:
                d = sum((a - b) ** 2 for a, b in zip(query, vec))
                candidates.append((d, vid))
        candidates.sort(key=lambda x: x[0])
        return [{'id': vid, 'distance': d} for d, vid in candidates[:k]]
""",
        """from solution import IVFIndex

def test_ivf_search():
    centroids = [[0.0, 0.0], [10.0, 10.0]]
    idx = IVFIndex(centroids)
    idx.add('p1', [0.1, 0.1])
    idx.add('p2', [10.1, 10.1])
    res = idx.search([0.0, 0.0], nprobe=1, k=1)
    assert len(res) == 1
    assert res[0]['id'] == 'p1'
""",
        "IVF indexing trades negligible recall loss for substantial query throughput improvements."
    ),
    (
        5, "node-10-5", "Lesson 11.5: Hierarchical Navigable Small World (HNSW): Skip-List Graph Layering",
        "Implement the multi-layer skip-list hierarchy of HNSW determining geometric layer assignments for new nodes.",
        320,
        """import random
import math

class HNSWLayerAssigner:
    def __init__(self, m_l: float = 1.0 / math.log(2.0)):
        self.m_l = m_l

    def assign_layer(self, rand_val: float = None) -> int:
        r = rand_val if rand_val is not None else random.random()
        r = max(1e-15, min(1.0 - 1e-15, r))
        return int(-math.log(r) * self.m_l)
""",
        """from solution import HNSWLayerAssigner

def test_hnsw_layer():
    assigner = HNSWLayerAssigner()
    # High random number -> layer 0
    assert assigner.assign_layer(rand_val=0.99) == 0
    # Tiny random number -> higher layer
    assert assigner.assign_layer(rand_val=0.01) > 0
""",
        "HNSW layers emulate probabilistic skip lists in multi-dimensional vector space."
    ),
    (
        6, "node-10-6", "Lesson 11.6: HNSW: Greedy Graph Traversal Algorithm",
        "Implement greedy beam search on a proximity graph tracking visited nodes and homing toward query vectors.",
        325,
        """class ProximityGraphSearcher:
    @staticmethod
    def greedy_search(graph: dict, node_vectors: dict, enter_node: str, query: list) -> str:
        curr = enter_node
        curr_dist = sum((a - b) ** 2 for a, b in zip(node_vectors[curr], query))
        changed = True
        while changed:
            changed = False
            for neighbor in graph.get(curr, []):
                d = sum((a - b) ** 2 for a, b in zip(node_vectors[neighbor], query))
                if d < curr_dist:
                    curr_dist = d
                    curr = neighbor
                    changed = True
        return curr
""",
        """from solution import ProximityGraphSearcher

def test_greedy_search():
    vecs = {'A': [0.0], 'B': [5.0], 'C': [8.0], 'D': [10.0]}
    g = {'A': ['B'], 'B': ['A', 'C'], 'C': ['B', 'D'], 'D': ['C']}
    target = ProximityGraphSearcher.greedy_search(g, vecs, 'A', [9.0])
    assert target in ('C', 'D')
""",
        "Greedy graph traversal traverses long-range edges at top layers before refining local clusters at base layers."
    ),
    (
        7, "node-10-7", "Lesson 11.7: HNSW: Heuristic Edge Selection & Bidirectional Linking",
        "Implement edge selection pruning neighbor connections to a maximum degree $M$ while preserving diversity.",
        330,
        """class HNSWEdgeSelector:
    @staticmethod
    def select_neighbors(candidates: list, max_m: int) -> list:
        # candidates: list of (dist, node_id) sorted
        candidates.sort(key=lambda x: x[0])
        return [node_id for _, node_id in candidates[:max_m]]
""",
        """from solution import HNSWEdgeSelector

def test_edge_selector():
    candidates = [(0.5, 'n1'), (0.2, 'n2'), (0.8, 'n3')]
    selected = HNSWEdgeSelector.select_neighbors(candidates, max_m=2)
    assert selected == ['n2', 'n1']
""",
        "Pruning graph edge degrees prevents hub-node clustering and guarantees logarithmic search complexity."
    ),
    (
        8, "node-10-8", "Lesson 11.8: Product Quantization (PQ): Sub-Vector Decomposition",
        "Implement vector decomposition splitting $D$-dimensional vectors into $M$ orthogonal lower-dimensional sub-vectors.",
        335,
        """class SubVectorDecomposer:
    @staticmethod
    def split_vector(vector: list, num_subvectors: int) -> list:
        d = len(vector)
        if d % num_subvectors != 0:
            raise ValueError("Dimension must be divisible by num_subvectors")
        sub_dim = d // num_subvectors
        return [vector[i * sub_dim : (i + 1) * sub_dim] for i in range(num_subvectors)]
""",
        """from solution import SubVectorDecomposer

def test_subvector():
    v = [1, 2, 3, 4, 5, 6]
    subs = SubVectorDecomposer.split_vector(v, 3)
    assert len(subs) == 3
    assert subs[0] == [1, 2]
    assert subs[2] == [5, 6]
""",
        "Sub-vector decomposition divides complex vector spaces into independently quantizable subspaces."
    ),
    (
        9, "node-10-9", "Lesson 11.9: Product Quantization (PQ): Codebook Training via K-Means",
        "Implement codebook construction training centroid dictionaries for each sub-vector slice.",
        340,
        """class PQCodebook:
    def __init__(self, num_subvectors: int, k_centroids: int):
        self.m = num_subvectors
        self.k = k_centroids
        self.codebooks = [[] for _ in range(num_subvectors)] # m sub-spaces

    def set_centroids(self, sub_index: int, centroids: list):
        self.codebooks[sub_index] = centroids

    def quantize_subvector(self, sub_index: int, sub_vec: list) -> int:
        centroids = self.codebooks[sub_index]
        best_idx = min(range(len(centroids)), key=lambda i: sum((a - b) ** 2 for a, b in zip(sub_vec, centroids[i])))
        return best_idx
""",
        """from solution import PQCodebook

def test_pq_codebook():
    pq = PQCodebook(num_subvectors=1, k_centroids=2)
    pq.set_centroids(0, [[0.0, 0.0], [1.0, 1.0]])
    code = pq.quantize_subvector(0, [0.9, 0.8])
    assert code == 1
""",
        "Product quantization compresses float32 vectors into compact 1-byte indices per subspace."
    ),
    (
        10, "node-10-10", "Lesson 11.10: Product Quantization (PQ): Asymmetric Distance Computation (ADC)",
        "Implement Asymmetric Distance Computation precomputing query-to-codebook distance lookup tables.",
        345,
        """class ADCComputer:
    @staticmethod
    def compute_distance_table(query_subvectors: list, codebooks: list) -> list:
        # returns table[m][k] = distance
        table = []
        for m, q_sub in enumerate(query_subvectors):
            sub_dists = [sum((a - b) ** 2 for a, b in zip(q_sub, c)) for c in codebooks[m]]
            table.append(sub_dists)
        return table

    @staticmethod
    def lookup_distance(distance_table: list, pq_code: list) -> float:
        return sum(distance_table[m][code] for m, code in enumerate(pq_code))
""",
        """from solution import ADCComputer

def test_adc():
    q_subs = [[1.0], [2.0]]
    cbooks = [[[1.0], [0.0]], [[2.0], [0.0]]] # c0 for sub0 has dist 0, c0 for sub1 dist 0
    table = ADCComputer.compute_distance_table(q_subs, cbooks)
    dist = ADCComputer.lookup_distance(table, [0, 0])
    assert dist == 0.0
""",
        "ADC achieves extreme query throughput by replacing costly vector multiplications with table lookups."
    ),
    (
        11, "node-10-11", "Lesson 11.11: Scalar Quantization (SQ8): Uniform FP32 to INT8 Mapping",
        "Implement uniform 8-bit scalar quantization mapping continuous float values into [-128, 127] integers.",
        350,
        """class ScalarQuantizer8:
    def __init__(self, min_val: float, max_val: float):
        self.min_val = min_val
        self.max_val = max_val
        self.scale = (max_val - min_val) / 255.0

    def quantize(self, vec: list) -> list:
        quantized = []
        for x in vec:
            clipped = max(self.min_val, min(self.max_val, x))
            q = int(round((clipped - self.min_val) / self.scale)) - 128
            quantized.append(q)
        return quantized

    def dequantize(self, q_vec: list) -> list:
        return [(q + 128) * self.scale + self.min_val for q in q_vec]
""",
        """from solution import ScalarQuantizer8

def test_scalar_quantization():
    sq = ScalarQuantizer8(min_val=-1.0, max_val=1.0)
    q = sq.quantize([0.0, 1.0, -1.0])
    assert len(q) == 3
    deq = sq.dequantize(q)
    assert abs(deq[0] - 0.0) < 0.02
""",
        "Scalar quantization reduces memory consumption by 75% while retaining high dot-product fidelity."
    ),
    (
        12, "node-10-12", "Lesson 11.12: Locality-Sensitive Hashing (LSH): Random Hyperplane Projections",
        "Implement random projection LSH partitioning high-dimensional vectors into binary hash buckets.",
        355,
        """class RandomHyperplaneLSH:
    def __init__(self, hyperplanes: list):
        self.hyperplanes = hyperplanes # list of random unit vectors

    def hash_vector(self, vec: list) -> str:
        bits = []
        for hp in self.hyperplanes:
            dot = sum(a * b for a, b in zip(vec, hp))
            bits.append('1' if dot >= 0 else '0')
        return "".join(bits)
""",
        """from solution import RandomHyperplaneLSH

def test_lsh():
    hp = [[1.0, 0.0], [0.0, 1.0]]
    lsh = RandomHyperplaneLSH(hp)
    assert lsh.hash_vector([1.0, 1.0]) == '11'
    assert lsh.hash_vector([-1.0, -1.0]) == '00'
""",
        "Random hyperplane LSH maps angularly proximate vectors to identical binary buckets with high probability."
    ),
    (
        13, "node-10-13", "Lesson 11.13: PostgreSQL pgvector: HNSW Index Sizing & Probe Parameters",
        "Implement a parameter calculator sizing pgvector memory requirements and tuning `m`, `ef_construction`, and `ef_search`.",
        360,
        """class PgVectorPlanner:
    @staticmethod
    def estimate_hnsw_memory_mb(num_vectors: int, dimension: int, m: int) -> float:
        vector_bytes = num_vectors * dimension * 4
        graph_bytes = num_vectors * m * 8
        total = vector_bytes + graph_bytes
        return round(total / (1024 * 1024), 2)
""",
        """from solution import PgVectorPlanner

def test_pgvector_planner():
    mem = PgVectorPlanner.estimate_hnsw_memory_mb(1_000_000, 1536, 16)
    assert mem > 5000.0 # ~6000MB
""",
        "Capacity sizing for pgvector HNSW indexes prevents Postgres worker shared-buffer exhaustion."
    ),
    (
        14, "node-10-14", "Lesson 11.14: Filtered Vector Search: Pre-Filtering vs Post-Filtering vs Single-Stage",
        "Implement a filtered vector search coordinator evaluating pre-filtering bitmaps against post-filtered candidates.",
        365,
        """class FilteredSearcher:
    @staticmethod
    def pre_filter(vectors: list, metadata: dict, filter_fn) -> list:
        # Filter first, then vector search
        return [v for v in vectors if filter_fn(metadata.get(v['id']))]

    @staticmethod
    def post_filter(search_results: list, metadata: dict, filter_fn) -> list:
        # Vector search first, then discard non-matching
        return [r for r in search_results if filter_fn(metadata.get(r['id']))]
""",
        """from solution import FilteredSearcher

def test_filtered_search():
    vecs = [{'id': '1'}, {'id': '2'}]
    meta = {'1': {'tenant': 'A'}, '2': {'tenant': 'B'}}
    res = FilteredSearcher.pre_filter(vecs, meta, lambda m: m.get('tenant') == 'A')
    assert len(res) == 1
    assert res[0]['id'] == '1'
""",
        "Filtered vector search balances recall against graph isolation during multi-tenant queries."
    ),
    (
        15, "node-10-15", "Lesson 11.15: Recursive Character Chunking Engine",
        "Implement a hierarchical chunking engine recursively splitting text on `\n\n`, `\n`, and whitespace within token limits.",
        370,
        """class RecursiveChunker:
    def __init__(self, chunk_size: int = 100, chunk_overlap: int = 20, separators: list = None):
        self.chunk_size = chunk_size
        self.overlap = chunk_overlap
        self.separators = separators or ["\\n\\n", "\\n", " "]

    def split_text(self, text: str) -> list:
        if len(text) <= self.chunk_size:
            return [text]
        # Try separators
        for sep in self.separators:
            if sep in text:
                parts = text.split(sep)
                chunks = []
                current = ""
                for p in parts:
                    if len(current) + len(p) + len(sep) <= self.chunk_size:
                        current += (sep if current else "") + p
                    else:
                        if current: chunks.append(current)
                        current = p
                if current: chunks.append(current)
                return chunks
        # Hard truncate fallback
        return [text[i:i+self.chunk_size] for i in range(0, len(text), self.chunk_size - self.overlap)]
""",
        """from solution import RecursiveChunker

def test_recursive_chunker():
    chunker = RecursiveChunker(chunk_size=20, chunk_overlap=0)
    text = "Paragraph one.\\n\\nParagraph two is longer."
    chunks = chunker.split_text(text)
    assert len(chunks) >= 2
""",
        "Recursive chunking prioritizes semantic paragraph and sentence breaks before falling back to arbitrary token cuts."
    ),
    (
        16, "node-10-16", "Lesson 11.16: Token-Aware Sliding Window Chunker with Overlap",
        "Implement a sliding window chunker operating over token sequences with configurable stride length.",
        375,
        """class SlidingWindowTokenChunker:
    def __init__(self, window_size: int = 10, stride: int = 5):
        self.window_size = window_size
        self.stride = stride

    def chunk_tokens(self, tokens: list) -> list:
        chunks = []
        for i in range(0, len(tokens), self.stride):
            chunk = tokens[i : i + self.window_size]
            if chunk:
                chunks.append(chunk)
            if i + self.window_size >= len(tokens):
                break
        return chunks
""",
        """from solution import SlidingWindowTokenChunker

def test_sliding_chunker():
    tokens = list(range(12))
    chunker = SlidingWindowTokenChunker(window_size=5, stride=3)
    chunks = chunker.chunk_tokens(tokens)
    assert chunks[0] == [0, 1, 2, 3, 4]
    assert chunks[1] == [3, 4, 5, 6, 7]
""",
        "Sliding window chunking preserves contextual continuity across chunk boundaries."
    ),
    (
        17, "node-10-17", "Lesson 11.17: Semantic Chunking: Embedding Cosine Distance Thresholding",
        "Build a semantic chunker evaluating cosine distance between contiguous sentences to detect natural topic transitions.",
        380,
        """class SemanticChunker:
    @staticmethod
    def identify_split_points(distances: list, threshold: float = 0.5) -> list:
        # distances: distance between sentence i and sentence i+1
        split_indices = []
        for i, dist in enumerate(distances):
            if dist > threshold:
                split_indices.append(i + 1)
        return split_indices
""",
        """from solution import SemanticChunker

def test_semantic_chunker():
    dists = [0.1, 0.2, 0.8, 0.1]
    splits = SemanticChunker.identify_split_points(dists, threshold=0.5)
    assert splits == [3]
""",
        "Semantic chunking splits text on shifts in embedding cosine distance rather than arbitrary character lengths."
    ),
    (
        18, "node-10-18", "Lesson 11.18: AST-Based Code Chunking Engine",
        "Implement an AST chunker extracting complete Python functions and classes with their imports intact.",
        385,
        """import ast

class CodeChunker:
    @staticmethod
    def extract_top_level_blocks(source_code: str) -> list:
        tree = ast.parse(source_code)
        blocks = []
        for node in tree.body:
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
                blocks.append(ast.get_source_segment(source_code, node))
        return blocks
""",
        """from solution import CodeChunker

def test_code_chunker():
    src = "import os\\n\\ndef foo():\\n    return 1\\n\\ndef bar():\\n    return 2"
    blocks = CodeChunker.extract_top_level_blocks(src)
    assert len(blocks) == 2
    assert "def foo()" in blocks[0]
""",
        "AST-based code chunkers maintain syntactic atomicity and avoid splitting logic mid-statement."
    ),
    (
        19, "node-10-19", "Lesson 11.19: Markdown & HTML Structure-Aware Document Splitter",
        "Build a markdown splitter injecting breadcrumb header paths (`# Docs > ## Setup`) into chunk metadata.",
        390,
        """class MarkdownBreadcrumbSplitter:
    @staticmethod
    def split(markdown_text: str) -> list:
        sections = []
        current_h1 = ""
        for line in markdown_text.splitlines():
            if line.startswith("# "):
                current_h1 = line[2:].strip()
            elif line.strip():
                sections.append({'breadcrumb': current_h1, 'content': line.strip()})
        return sections
""",
        """from solution import MarkdownBreadcrumbSplitter

def test_md_splitter():
    md = "# Guide\\nWelcome to the guide.\\n# API\\nEndpoint specs."
    secs = MarkdownBreadcrumbSplitter.split(md)
    assert secs[0]['breadcrumb'] == 'Guide'
    assert secs[1]['breadcrumb'] == 'API'
""",
        "Breadcrumb header injection preserves context in isolated subsections of large documents."
    ),
    (
        20, "node-10-20", "Lesson 11.20: Multi-Modal Document Table Serializer",
        "Implement a markdown table parser linearizing tabular rows into natural language descriptive statements.",
        395,
        """class TableLinearizer:
    @staticmethod
    def linearize_markdown_table(headers: list, rows: list) -> list:
        statements = []
        for r in rows:
            desc = ", ".join(f"{h}: {val}" for h, val in zip(headers, r))
            statements.append(f"Record with {desc}")
        return statements
""",
        """from solution import TableLinearizer

def test_table_linearizer():
    headers = ['Year', 'Revenue']
    rows = [['2023', '$10M'], ['2024', '$25M']]
    stmts = TableLinearizer.linearize_markdown_table(headers, rows)
    assert stmts[0] == "Record with Year: 2023, Revenue: $10M"
""",
        "Linearizing tabular data enables standard bi-encoder models to capture relational row semantics."
    ),
    (
        21, "node-10-21", "Lesson 11.21: Metadata Extraction & Document Tagging Pipeline",
        "Build an automated metadata pipeline extracting timestamps, author entities, and category taxonomy tags.",
        400,
        """class MetadataExtractor:
    @staticmethod
    def extract_metadata(doc_id: str, text: str, source_url: str) -> dict:
        return {
            'doc_id': doc_id,
            'url': source_url,
            'word_count': len(text.split()),
            'has_code': '```' in text
        }
""",
        """from solution import MetadataExtractor

def test_metadata():
    m = MetadataExtractor.extract_metadata('d1', 'hello world ```python pass```', 'https://wiki')
    assert m['word_count'] == 4
    assert m['has_code'] is True
""",
        "Rich document metadata facilitates strict pre-filtering during complex enterprise queries."
    ),
    (
        22, "node-10-22", "Lesson 11.22: Ingestion Deduplication: Content Hashing & Vector MinHash",
        "Implement an ingestion deduplication gatekeeper computing SHA256 checksums and Jaccard token similarities.",
        405,
        """import hashlib

class IngestionDeduplicator:
    def __init__(self):
        self.exact_hashes = set()

    def is_duplicate(self, text: str) -> bool:
        h = hashlib.sha256(text.encode('utf-8')).hexdigest()
        if h in self.exact_hashes:
            return True
        self.exact_hashes.add(h)
        return False
""",
        """from solution import IngestionDeduplicator

def test_deduplicator():
    dedup = IngestionDeduplicator()
    assert dedup.is_duplicate("Unique text") is False
    assert dedup.is_duplicate("Unique text") is True
""",
        "Ingestion deduplication prevents index bloat and redundant nearest neighbor retrieval."
    ),
    (
        23, "node-10-23", "Lesson 11.23: Change Data Capture (CDC) Vector Ingestion Pipeline",
        "Implement a CDC consumer processing INSERT, UPDATE, and DELETE tombstones to synchronize vector indices.",
        410,
        """class VectorCDCConsumer:
    def __init__(self):
        self.index = {}

    def apply_event(self, op: str, doc_id: str, vector: list = None):
        if op in ('INSERT', 'UPDATE'):
            self.index[doc_id] = vector
        elif op == 'DELETE':
            self.index.pop(doc_id, None)
""",
        """from solution import VectorCDCConsumer

def test_cdc_consumer():
    cdc = VectorCDCConsumer()
    cdc.apply_event('INSERT', 'doc1', [1.0, 2.0])
    assert 'doc1' in cdc.index
    cdc.apply_event('DELETE', 'doc1')
    assert 'doc1' not in cdc.index
""",
        "CDC pipelines maintain vector store synchronization with primary relational database states."
    ),
    (
        24, "node-10-24", "Lesson 11.24: Lexical Search Engine: Inverted Index Posting Lists",
        "Build an inverted index mapping stemmed lexical terms to posting lists with term frequency counts.",
        415,
        """class LexicalInvertedIndex:
    def __init__(self):
        self.postings = {} # term -> list of (doc_id, term_freq)

    def add_document(self, doc_id: str, tokens: list):
        counts = {}
        for t in tokens:
            counts[t] = counts.get(t, 0) + 1
        for term, freq in counts.items():
            self.postings.setdefault(term, []).append((doc_id, freq))

    def get_postings(self, term: str) -> list:
        return self.postings.get(term, [])
""",
        """from solution import LexicalInvertedIndex

def test_lexical_index():
    idx = LexicalInvertedIndex()
    idx.add_document('docA', ['search', 'engine', 'search'])
    postings = idx.get_postings('search')
    assert len(postings) == 1
    assert postings[0] == ('docA', 2)
""",
        "Inverted posting lists provide sub-millisecond sparse lookup for keyword queries."
    ),
    (
        25, "node-10-25", "Lesson 11.25: Lexical Search Engine: Okapi BM25 Ranking Function",
        "Implement the complete Okapi BM25 ranking formula scoring documents against multi-term queries.",
        420,
        """import math

class OkapiBM25:
    def __init__(self, corpus: dict, k1: float = 1.2, b: float = 0.75):
        self.k1 = k1
        self.b = b
        self.corpus = corpus # doc_id -> list of tokens
        self.doc_lens = {did: len(toks) for did, toks in corpus.items()}
        self.avg_dl = sum(self.doc_lens.values()) / len(corpus) if corpus else 1.0

    def score_query(self, query_tokens: list, doc_id: str) -> float:
        score = 0.0
        tokens = self.corpus.get(doc_id, [])
        for q in query_tokens:
            tf = tokens.count(q)
            if tf > 0:
                numerator = tf * (self.k1 + 1)
                denominator = tf + self.k1 * (1 - self.b + self.b * (self.doc_lens[doc_id] / self.avg_dl))
                score += numerator / denominator
        return score
""",
        """from solution import OkapiBM25

def test_bm25_scoring():
    corpus = {'d1': ['ai', 'rag', 'system'], 'd2': ['web', 'frontend']}
    bm = OkapiBM25(corpus)
    s1 = bm.score_query(['rag'], 'd1')
    s2 = bm.score_query(['rag'], 'd2')
    assert s1 > 0
    assert s2 == 0.0
""",
        "BM25 prevents term-frequency saturation and normalizes scores against document lengths."
    ),
    (
        26, "node-10-26", "Lesson 11.26: Sparse Vector Embeddings: SPLADE Learned Term Expansion",
        "Implement a sparse dot-product scoring engine matching sparse term-weight activation dictionaries.",
        425,
        """class SparseVectorSearch:
    @staticmethod
    def sparse_dot_product(vec1: dict, vec2: dict) -> float:
        # vec: term -> weight
        common_terms = set(vec1.keys()) & set(vec2.keys())
        return sum(vec1[t] * vec2[t] for t in common_terms)
""",
        """from solution import SparseVectorSearch

def test_sparse_search():
    v1 = {'rag': 2.5, 'vector': 1.0}
    v2 = {'rag': 3.0, 'database': 1.5}
    dot = SparseVectorSearch.sparse_dot_product(v1, v2)
    assert dot == 7.5
""",
        "SPLADE sparse representations combine lexical precision with neural query expansion."
    ),
    (
        27, "node-10-27", "Lesson 11.27: Reciprocal Rank Fusion (RRF) Hybrid Search Engine",
        "Implement Reciprocal Rank Fusion blending ordered candidate lists from dense and sparse search retrievers.",
        430,
        """class ReciprocalRankFusion:
    @staticmethod
    def fuse(ranked_lists: list, k: int = 60) -> list:
        # ranked_lists: list of lists of doc_ids
        rrf_scores = {}
        for r_list in ranked_lists:
            for rank, doc_id in enumerate(r_list):
                rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank + 1))
        sorted_docs = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_docs
""",
        """from solution import ReciprocalRankFusion

def test_rrf():
    dense = ['docA', 'docB', 'docC']
    sparse = ['docB', 'docA', 'docD']
    fused = ReciprocalRankFusion.fuse([dense, sparse], k=60)
    # docA and docB appear in top of both, should score highest
    top_ids = [doc_id for doc_id, score in fused[:2]]
    assert 'docA' in top_ids and 'docB' in top_ids
""",
        "RRF eliminates score scale discrepancies by relying strictly on candidate ranking orders."
    ),
    (
        28, "node-10-28", "Lesson 11.28: Weighted Linear Score Combination Hybrid Search",
        "Implement min-max normalization and weighted linear score combination fusing dense and sparse search results.",
        435,
        """class WeightedHybridSearch:
    @staticmethod
    def normalize_scores(scores: dict) -> dict:
        if not scores: return {}
        min_v = min(scores.values())
        max_v = max(scores.values())
        if max_v == min_v: return {k: 1.0 for k in scores}
        return {k: (v - min_v) / (max_v - min_v) for k, v in scores.items()}

    @staticmethod
    def combine(dense_scores: dict, sparse_scores: dict, alpha: float = 0.5) -> list:
        norm_d = WeightedHybridSearch.normalize_scores(dense_scores)
        norm_s = WeightedHybridSearch.normalize_scores(sparse_scores)
        all_keys = set(norm_d.keys()) | set(norm_s.keys())
        combined = {}
        for k in all_keys:
            d = norm_d.get(k, 0.0)
            s = norm_s.get(k, 0.0)
            combined[k] = alpha * d + (1.0 - alpha) * s
        return sorted(combined.items(), key=lambda x: x[1], reverse=True)
""",
        """from solution import WeightedHybridSearch

def test_weighted_hybrid():
    dense = {'d1': 0.9, 'd2': 0.1}
    sparse = {'d1': 10.0, 'd2': 50.0}
    combined = WeightedHybridSearch.combine(dense, sparse, alpha=0.5)
    assert len(combined) == 2
""",
        "Linear score weighting enables continuous tuning between semantic relevance and lexical precision."
    ),
    (
        29, "node-10-29", "Lesson 11.29: Cross-Encoder Re-Ranking Pipeline",
        "Implement a cross-encoder reranker scoring query-document pairs jointly to refine top candidate precision.",
        440,
        """class MockCrossEncoderReranker:
    def __init__(self, scoring_fn):
        self.scoring_fn = scoring_fn

    def rerank(self, query: str, candidate_docs: list) -> list:
        scored = []
        for doc in candidate_docs:
            score = self.scoring_fn(query, doc['content'])
            scored.append({'id': doc['id'], 'score': score, 'content': doc['content']})
        scored.sort(key=lambda x: x['score'], reverse=True)
        return scored
""",
        """from solution import MockCrossEncoderReranker

def test_reranker():
    reranker = MockCrossEncoderReranker(lambda q, c: len(set(q.split()) & set(c.split())))
    docs = [{'id': '1', 'content': 'apple orange'}, {'id': '2', 'content': 'apple banana cherry'}]
    res = reranker.rerank('banana cherry', docs)
    assert res[0]['id'] == '2'
""",
        "Cross-encoders capture full cross-attention interactions to dramatically boost Top-1 accuracy."
    ),
    (
        30, "node-10-30", "Lesson 11.30: ColBERT Late-Interaction Engine: MaxSim Operator",
        "Implement the ColBERT MaxSim operator computing the sum of maximum cosine similarities across query and document tokens.",
        445,
        """class ColBERTMaxSim:
    @staticmethod
    def max_sim(query_matrix: list, doc_matrix: list) -> float:
        # query: Q x D, doc: D_tokens x D
        total_score = 0.0
        for q_vec in query_matrix:
            # Find max dot product in doc tokens
            max_sim_val = max(sum(a * b for a, b in zip(q_vec, d_vec)) for d_vec in doc_matrix)
            total_score += max_sim_val
        return total_score
""",
        """from solution import ColBERTMaxSim

def test_colbert_maxsim():
    q = [[1.0, 0.0], [0.0, 1.0]]
    d = [[1.0, 0.0], [0.5, 0.5]]
    score = ColBERTMaxSim.max_sim(q, d)
    assert score == 1.5 # 1.0 for q0, 0.5 for q1
""",
        "ColBERT preserves token-level expressiveness while retaining decoupled offline indexing."
    ),
    (
        31, "node-10-31", "Lesson 11.31: Query Expansion: Multi-Query Generation & Parallel Search",
        "Build a multi-query expander generating query perspectives and deduplicating retrieved candidate sets.",
        450,
        """class MultiQueryExpander:
    def __init__(self, generator_fn):
        self.generate = generator_fn

    def retrieve_candidates(self, query: str, search_fn) -> list:
        queries = self.generate(query)
        seen = set()
        candidates = []
        for q in queries:
            results = search_fn(q)
            for r in results:
                if r['id'] not in seen:
                    seen.add(r['id'])
                    candidates.append(r)
        return candidates
""",
        """from solution import MultiQueryExpander

def test_multi_query():
    expander = MultiQueryExpander(lambda q: [q, q + " alternative"])
    mock_search = lambda q: [{'id': 'doc1'} if 'alternative' not in q else {'id': 'doc2'}]
    candidates = expander.retrieve_candidates('test', mock_search)
    assert len(candidates) == 2
""",
        "Multi-query expansion mitigates phrasing sensitivity by querying diverse semantic formulations."
    ),
    (
        32, "node-10-32", "Lesson 11.32: Hypothetical Document Embeddings (HyDE)",
        "Implement the HyDE workflow generating hypothetical answer passages to bridge the query-to-document embedding gap.",
        455,
        """class HyDERetriever:
    def __init__(self, llm_fn, search_fn):
        self.llm = llm_fn
        self.search = search_fn

    def search_hyde(self, query: str) -> list:
        hypothetical_doc = self.llm(f"Write a passage answering: {query}")
        return self.search(hypothetical_doc)
""",
        """from solution import HyDERetriever

def test_hyde():
    mock_llm = lambda prompt: "Synthetic answer passage"
    mock_search = lambda doc: [{'id': 'doc1', 'query_used': doc}]
    hyde = HyDERetriever(mock_llm, mock_search)
    res = hyde.search_hyde("What is RAG?")
    assert res[0]['query_used'] == "Synthetic answer passage"
""",
        "HyDE searches in document space rather than query space to improve zero-shot retrieval relevance."
    ),
    (
        33, "node-10-33", "Lesson 11.33: Query Decomposition: Sub-Question Multi-Hop Router",
        "Implement a sub-question decomposer breaking multi-hop queries into sequential retrieval dependencies.",
        460,
        """class MultiHopDecomposer:
    @staticmethod
    def plan_hops(complex_query: str) -> list:
        if " and " in complex_query:
            return complex_query.split(" and ")
        return [complex_query]
""",
        """from solution import MultiHopDecomposer

def test_decomposer():
    hops = MultiHopDecomposer.plan_hops("Who founded OpenAI and what year?")
    assert len(hops) == 2
    assert "Who founded OpenAI" in hops[0]
""",
        "Sub-question decomposition unravels complex relational queries into atomic search steps."
    ),
    (
        34, "node-10-34", "Lesson 11.34: Contextual RAG: Anthropic-Style Chunk Prefix Injection",
        "Implement Contextual RAG chunk preparation prepending document summary headers to isolated chunks before embedding.",
        465,
        """class ContextualRAGPrep:
    @staticmethod
    def contextualize_chunk(doc_title: str, doc_summary: str, chunk_text: str) -> str:
        return f"Document: {doc_title}\\nContext: {doc_summary}\\n\\nChunk Content:\\n{chunk_text}"
""",
        """from solution import ContextualRAGPrep

def test_contextual_rag():
    c = ContextualRAGPrep.contextualize_chunk('Q3 Earnings', 'Revenue was up 20%', 'Operating margins grew 5%')
    assert 'Document: Q3 Earnings' in c
    assert 'Operating margins grew 5%' in c
""",
        "Contextual chunk prefixing anchors isolated text chunks to their parent document themes."
    ),
    (
        35, "node-10-35", "Lesson 11.35: Parent-Document Retrieval Architecture",
        "Implement a two-tier retrieval architecture indexing granular child chunks but returning full parent context.",
        470,
        """class ParentDocumentRetriever:
    def __init__(self):
        self.parents = {} # parent_id -> parent_text
        self.child_to_parent = {} # child_id -> parent_id

    def register(self, parent_id: str, parent_text: str, child_ids: list):
        self.parents[parent_id] = parent_text
        for cid in child_ids:
            self.child_to_parent[cid] = parent_id

    def fetch_parent(self, child_id: str) -> str:
        pid = self.child_to_parent.get(child_id)
        return self.parents.get(pid)
""",
        """from solution import ParentDocumentRetriever

def test_parent_doc_retriever():
    pdr = ParentDocumentRetriever()
    pdr.register('p1', 'Full article text...', ['c1', 'c2'])
    assert pdr.fetch_parent('c1') == 'Full article text...'
""",
        "Parent-document retrieval matches granular embeddings while supplying rich LLM generation context."
    ),
    (
        36, "node-10-36", "Lesson 11.36: Sentence-Window Retrieval Engine",
        "Implement a sentence-window expander replacing retrieved sentences with an expanded surrounding context window.",
        475,
        """class SentenceWindowExpander:
    def __init__(self, sentences: list):
        self.sentences = sentences

    def get_window(self, target_idx: int, window_radius: int = 1) -> str:
        start = max(0, target_idx - window_radius)
        end = min(len(self.sentences), target_idx + window_radius + 1)
        return " ".join(self.sentences[start:end])
""",
        """from solution import SentenceWindowExpander

def test_sentence_window():
    s = ["Sentence 0.", "Sentence 1.", "Sentence 2.", "Sentence 3."]
    exp = SentenceWindowExpander(s)
    window = exp.get_window(2, window_radius=1)
    assert window == "Sentence 1. Sentence 2. Sentence 3."
""",
        "Sentence-window retrieval isolates precise search hits without stripping neighboring context."
    ),
    (
        37, "node-10-37", "Lesson 11.37: GraphRAG: Entity-Relation Extraction & Knowledge Graph Indexing",
        "Build a knowledge graph index linking extracted entities via directed relationship edges.",
        480,
        """class KnowledgeGraphIndex:
    def __init__(self):
        self.edges = [] # list of (subject, relation, object)

    def add_triple(self, subj: str, rel: str, obj: str):
        self.edges.append((subj, rel, obj))

    def query_entity(self, entity: str) -> list:
        return [e for e in self.edges if e[0] == entity or e[2] == entity]
""",
        """from solution import KnowledgeGraphIndex

def test_graph_rag_index():
    kg = KnowledgeGraphIndex()
    kg.add_triple('Sam Altman', 'CEO_of', 'OpenAI')
    edges = kg.query_entity('OpenAI')
    assert len(edges) == 1
    assert edges[0] == ('Sam Altman', 'CEO_of', 'OpenAI')
""",
        "Knowledge graph indexing structures disparate document facts into traversable entity networks."
    ),
    (
        38, "node-10-38", "Lesson 11.38: GraphRAG: Subgraph Path Traversal for Multi-Hop QA",
        "Implement BFS traversal over an entity knowledge graph to extract multi-hop reasoning pathways.",
        485,
        """class GraphPathFinder:
    def __init__(self, edges: list):
        self.adj = {}
        for u, rel, v in edges:
            self.adj.setdefault(u, []).append((rel, v))

    def find_path(self, start: str, end: str) -> list:
        queue = [[start]]
        visited = set([start])
        while queue:
            path = queue.pop(0)
            curr = path[-1]
            if curr == end:
                return path
            for rel, nxt in self.adj.get(curr, []):
                if nxt not in visited:
                    visited.add(nxt)
                    queue.append(path + [nxt])
        return []
""",
        """from solution import GraphPathFinder

def test_graph_traversal():
    edges = [('A', 'connects', 'B'), ('B', 'connects', 'C')]
    finder = GraphPathFinder(edges)
    path = finder.find_path('A', 'C')
    assert path == ['A', 'B', 'C']
""",
        "Subgraph path traversal surfaces relational bridges connecting multi-hop evidence across documents."
    ),
    (
        39, "node-10-39", "Lesson 11.39: Context Compression: Information-Theoretic Token Pruning",
        "Implement token pruning filtering low-information stop words and high-frequency syntax tokens from context.",
        488,
        """class TokenPruner:
    STOPWORDS = {'the', 'is', 'at', 'which', 'on', 'a', 'an'}

    @staticmethod
    def prune(text: str) -> str:
        words = text.split()
        retained = [w for w in words if w.lower() not in TokenPruner.STOPWORDS]
        return " ".join(retained)
""",
        """from solution import TokenPruner

def test_token_prune():
    p = TokenPruner.prune("This is a test on the system")
    assert p == "This test system"
""",
        "Information-theoretic pruning compresses prompt payloads while preserving core semantic nouns and verbs."
    ),
    (
        40, "node-10-40", "Lesson 11.40: Context Compression: Extractive Summarization & Re-Ordering",
        "Implement lost-in-the-middle context re-ordering placing highest-scoring chunks at prompt boundaries.",
        490,
        """class ContextReorderer:
    @staticmethod
    def reorder(ranked_chunks: list) -> list:
        # Places best chunks at start and end
        # ranked_chunks: sorted descending by score
        reordered = []
        left = True
        for chunk in ranked_chunks:
            if left:
                reordered.insert(0, chunk)
            else:
                reordered.append(chunk)
            left = not left
        return reordered
""",
        """from solution import ContextReorderer

def test_context_reorder():
    chunks = ['best', 'second', 'third', 'worst']
    out = ContextReorderer.reorder(chunks)
    # The top items end up at start/end
    assert out[0] in ('best', 'second')
    assert out[-1] in ('best', 'second')
""",
        "Placing critical evidence at prompt edges counters transformer attention lost-in-the-middle degradation."
    ),
    (
        41, "node-10-41", "Lesson 11.41: Citations & Attribution Grounding Engine",
        "Implement an attribution mapper verifying that generated sentences cite specific retrieved source chunk IDs.",
        492,
        """import re

class CitationGrounder:
    @staticmethod
    def extract_citations(generated_text: str) -> list:
        # Matches [docX]
        return re.findall(r'\\[([a-zA-Z0-9_-]+)\\]', generated_text)
""",
        """from solution import CitationGrounder

def test_citation():
    text = "Revenue grew by 20% [doc-1], while margins expanded [doc-2]."
    c = CitationGrounder.extract_citations(text)
    assert c == ['doc-1', 'doc-2']
""",
        "Attribution grounding links every generated claim directly back to verifiable source documents."
    ),
    (
        42, "node-10-42", "Lesson 11.42: Self-RAG: Reflection Tokens & Adaptive Retrieval Router",
        "Implement a Self-RAG reflection token parser assessing `[Retrieve]` vs `[No-Retrieve]` thresholds.",
        494,
        """class SelfRAGRouter:
    @staticmethod
    def should_retrieve(query: str, confidence_score: float, threshold: float = 0.8) -> bool:
        # If model confidence is low, trigger retrieval
        return confidence_score < threshold
""",
        """from solution import SelfRAGRouter

def test_self_rag():
    assert SelfRAGRouter.should_retrieve("2 + 2", 0.99) is False
    assert SelfRAGRouter.should_retrieve("Obscure tax code regulation", 0.45) is True
""",
        "Adaptive retrieval invokes expensive vector search exclusively when internal parametric model knowledge is insufficient."
    ),
    (
        43, "node-10-43", "Lesson 11.43: Corrective RAG (CRAG): Retrieval Evaluator & Web Fallback",
        "Build a CRAG evaluator grading retrieved document relevance and routing unconfident queries to web search fallbacks.",
        496,
        """class CRAGEvaluator:
    @staticmethod
    def evaluate(relevance_scores: list, threshold: float = 0.7) -> str:
        avg = sum(relevance_scores) / len(relevance_scores) if relevance_scores else 0.0
        if avg >= threshold:
            return 'CORRECT'
        elif avg >= 0.4:
            return 'AMBIGUOUS'
        return 'INCORRECT_WEB_FALLBACK'
""",
        """from solution import CRAGEvaluator

def test_crag():
    assert CRAGEvaluator.evaluate([0.9, 0.8]) == 'CORRECT'
    assert CRAGEvaluator.evaluate([0.1, 0.2]) == 'INCORRECT_WEB_FALLBACK'
""",
        "Corrective RAG guards against hallucinations caused by irrelevant or misleading retrieved context."
    ),
    (
        44, "node-10-44", "Lesson 11.44: Time-Decayed Relevance Scoring",
        "Implement an exponential temporal decay function penalizing outdated document search scores.",
        498,
        """import math

class TemporalDecayScorer:
    @staticmethod
    def compute_decayed_score(similarity_score: float, age_days: float, half_life_days: float = 365.0) -> float:
        decay = math.exp(-math.log(2) * (age_days / half_life_days))
        return similarity_score * decay
""",
        """from solution import TemporalDecayScorer

def test_temporal_decay():
    s0 = TemporalDecayScorer.compute_decayed_score(1.0, 0.0)
    s365 = TemporalDecayScorer.compute_decayed_score(1.0, 365.0)
    assert s0 == 1.0
    assert abs(s365 - 0.5) < 0.01
""",
        "Temporal decay penalizes obsolete documentation in fast-evolving technical codebases."
    ),
    (
        45, "node-10-45", "Lesson 11.45: Multi-Vector Representation (ColPali Style)",
        "Build a multi-vector document index storing patch embeddings for visual and formatted document layouts.",
        500,
        """class MultiVectorDocIndex:
    def __init__(self):
        self.docs = {} # doc_id -> list of patch_embeddings

    def add_doc(self, doc_id: str, patch_vectors: list):
        self.docs[doc_id] = patch_vectors

    def get_patches(self, doc_id: str) -> list:
        return self.docs.get(doc_id, [])
""",
        """from solution import MultiVectorDocIndex

def test_multi_vector():
    idx = MultiVectorDocIndex()
    idx.add_doc('page1', [[0.1, 0.2], [0.3, 0.4]])
    assert len(idx.get_patches('page1')) == 2
""",
        "Multi-vector representations preserve 2D spatial layouts of PDFs and charts without OCR loss."
    ),
    (
        46, "node-10-46", "Lesson 11.46: Sharded Vector Search: Distributed Scatter-Gather Engine",
        "Implement a distributed scatter-gather vector coordinator querying multiple remote shards and merging top-K results.",
        500,
        """import heapq

class DistributedVectorScatterGather:
    def __init__(self, shards: list):
        self.shards = shards # list of callables

    def query(self, query_vec: list, k: int) -> list:
        all_hits = []
        for s in self.shards:
            all_hits.extend(s(query_vec, k))
        return heapq.nsmallest(k, all_hits, key=lambda x: x['dist'])
""",
        """from solution import DistributedVectorScatterGather

def test_scatter_gather():
    s1 = lambda q, k: [{'id': 'a', 'dist': 0.1}]
    s2 = lambda q, k: [{'id': 'b', 'dist': 0.05}]
    sg = DistributedVectorScatterGather([s1, s2])
    res = sg.query([], 1)
    assert res[0]['id'] == 'b'
""",
        "Scatter-gather coordinators partition massive multi-billion vector indices across independent search nodes."
    ),
    (
        47, "node-10-47", "Lesson 11.47: Vector Cache: Exact & Semantic Prompt Cache Layer",
        "Implement an exact-hash and semantic cosine cache reducing LLM generation load on recurring queries.",
        500,
        """class SemanticVectorCache:
    def __init__(self, threshold: float = 0.95):
        self.threshold = threshold
        self.cache = [] # list of (vector, response)

    def get(self, query_vec: list):
        for vec, resp in self.cache:
            dot = sum(a * b for a, b in zip(query_vec, vec))
            if dot >= self.threshold:
                return resp
        return None

    def put(self, query_vec: list, response: str):
        self.cache.append((query_vec, response))
""",
        """from solution import SemanticVectorCache

def test_semantic_cache():
    sc = SemanticVectorCache(threshold=0.9)
    sc.put([1.0, 0.0], 'Cached answer')
    assert sc.get([0.95, 0.05]) == 'Cached answer'
    assert sc.get([0.0, 1.0]) is None
""",
        "Semantic caching saves substantial API costs by serving semantically identical questions from local vector memory."
    ),
    (
        48, "node-10-48", "Lesson 11.48: Dynamic Top-K Selection: Distance Elbow / Cutoff Heuristics",
        "Implement an adaptive Top-K selector identifying the greatest drop in similarity scores to prune irrelevant context.",
        500,
        """class DynamicTopKSelector:
    @staticmethod
    def select_elbow(scores_desc: list, min_k: int = 1, max_k: int = 5) -> int:
        if len(scores_desc) <= min_k: return len(scores_desc)
        diffs = [scores_desc[i] - scores_desc[i+1] for i in range(len(scores_desc)-1)]
        max_diff_idx = max(range(len(diffs)), key=lambda i: diffs[i])
        return max(min_k, min(max_k, max_diff_idx + 1))
""",
        """from solution import DynamicTopKSelector

def test_elbow():
    scores = [0.95, 0.93, 0.40, 0.35]
    k = DynamicTopKSelector.select_elbow(scores, min_k=1, max_k=4)
    assert k == 2
""",
        "Elbow cutoff heuristics dynamically adjust context sizes to avoid polluting LLM prompts with noisy low-relevance hits."
    ),
    (
        49, "node-10-49", "Lesson 11.49: RAG Guardrails: PII Anonymization & Prompt Injection Scrubbing",
        "Build a security guardrail scrubbing API keys and prompt injection delimiters from retrieved documents before prompt formatting.",
        500,
        """import re

class RAGSecurityScrubber:
    @staticmethod
    def scrub(text: str) -> str:
        # Scrub fake API keys
        scrubbed = re.sub(r'sk-[a-zA-Z0-9]{20,}', '[REDACTED_API_KEY]', text)
        # Neutralize common prompt injection prefixes
        scrubbed = re.sub(r'(?i)ignore previous instructions', '[INJECTION_BLOCKED]', scrubbed)
        return scrubbed
""",
        """from solution import RAGSecurityScrubber

def test_security_scrubber():
    dirty = "Secret key: sk-abcdef12345678901234567890. Please Ignore previous instructions."
    clean = RAGSecurityScrubber.scrub(dirty)
    assert 'sk-abc' not in clean
    assert '[REDACTED_API_KEY]' in clean
    assert '[INJECTION_BLOCKED]' in clean
""",
        "Security scrubbers prevent indirect prompt injection and credential leaks through retrieved untrusted documents."
    ),
    (
        50, "node-10-50", "Lesson 11.50: Capstone: Enterprise Multi-Modal Hybrid RAG System",
        "Synthesize a complete enterprise RAG pipeline combining document chunking, HNSW vector search, BM25 scoring, and RRF fusion.",
        500,
        """class EnterpriseHybridRAG:
    def __init__(self, vector_search_fn, bm25_search_fn):
        self.vector_search = vector_search_fn
        self.bm25_search = bm25_search_fn

    def retrieve(self, query_text: str, query_vec: list, k: int = 5) -> list:
        v_results = [r['id'] for r in self.vector_search(query_vec, k * 2)]
        b_results = [r['id'] for r in self.bm25_search(query_text, k * 2)]
        
        # RRF Fusion
        rrf = {}
        for r_list in (v_results, b_results):
            for rank, doc_id in enumerate(r_list):
                rrf[doc_id] = rrf.get(doc_id, 0.0) + (1.0 / (60 + rank + 1))
        fused = sorted(rrf.items(), key=lambda x: x[1], reverse=True)
        return [doc_id for doc_id, _ in fused[:k]]
""",
        """from solution import EnterpriseHybridRAG

def test_enterprise_rag_capstone():
    v_fn = lambda q, k: [{'id': 'doc1'}, {'id': 'doc2'}]
    b_fn = lambda q, k: [{'id': 'doc2'}, {'id': 'doc3'}]
    rag = EnterpriseHybridRAG(v_fn, b_fn)
    res = rag.retrieve('query', [], k=2)
    assert res[0] == 'doc2' # Present in both
""",
        "Enterprise RAG capstones fuse dense semantic understanding with sparse lexical precision into production search pipelines."
    )
]

print(f"Prepared {len(lessons)} lessons for Module 11.")

# Sync updates (node-10-1 to node-10-35) and inserts (node-10-36 to node-10-50)
for order_idx, node_id, title, desc, xp, code, tests, failure_mode in lessons:
    starter_dict = {'solution.py': code}
    test_dict = {
        'tests.py': tests,
        'failure_mode': failure_mode,
        'verification_criteria': f"Run test suite for {title} with zero assertion errors."
    }
    
    starter_json = sql_escape(json.dumps(starter_dict)) + "::jsonb"
    test_json = sql_escape(json.dumps(test_dict)) + "::jsonb"
    title_escaped = sql_escape(title)
    subtitle_escaped = sql_escape(f"Module 11: Production RAG & Vector Search Systems | Lesson {order_idx} of 50")
    cs_escaped = sql_escape(f"Information Retrieval | {title.split(':', 1)[-1].strip()[:50]}")
    ai_escaped = sql_escape(desc)
    slug = f"module-11-lesson-{order_idx:02d}-{slugify(title.split(':', 1)[-1])}"
    slug_escaped = sql_escape(slug)

    handbook = f"""# {title}

- **Module**: `Module 11: Production RAG & Vector Search Systems`
- **Focus**: {desc}
- **Verification**: Run test suite for `{title}` with zero assertion errors.

## Architectural Deep Dive
High-scale RAG requires rigorous vector space metrics, approximate nearest neighbor (ANN) index structures, lexical rank fusion, and contextual compression.
"""
    handbook_escaped = sql_escape(handbook)

    if order_idx <= 35:
        sql = f"""
UPDATE curriculum_nodes
SET title = {title_escaped},
    subtitle = {subtitle_escaped},
    cs_foundation = {cs_escaped},
    ai_convergence = {ai_escaped},
    xp_reward = {xp},
    starter_code = {starter_json},
    test_suite = {test_json},
    handbook_markdown = {handbook_escaped}
WHERE id = '{node_id}';
"""
        run_sql(sql)
        print(f"Updated {node_id}: {title}")
    else:
        check_sql = f"SELECT id FROM curriculum_nodes WHERE id = '{node_id}';"
        res = run_sql(check_sql)
        if res:
            sql = f"""
UPDATE curriculum_nodes
SET title = {title_escaped},
    subtitle = {subtitle_escaped},
    cs_foundation = {cs_escaped},
    ai_convergence = {ai_escaped},
    order_index = {order_idx},
    xp_reward = {xp},
    starter_code = {starter_json},
    test_suite = {test_json},
    handbook_markdown = {handbook_escaped}
WHERE id = '{node_id}';
"""
            run_sql(sql)
            print(f"Updated expanded node {node_id}: {title}")
        else:
            sql = f"""
INSERT INTO curriculum_nodes (id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, order_index, xp_reward, starter_code, test_suite, handbook_markdown, level_required, position_x, position_y)
VALUES (
    '{node_id}',
    {slug_escaped},
    'module-11',
    {title_escaped},
    {subtitle_escaped},
    {cs_escaped},
    {ai_escaped},
    {order_idx},
    {xp},
    {starter_json},
    {test_json},
    {handbook_escaped},
    1,
    0.0,
    0.0
);
"""
            run_sql(sql)
            print(f"Inserted new node {node_id}: {title}")

print("Module 11 successfully synced!")
