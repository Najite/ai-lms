#!/usr/bin/env python3
"""
Batch patch Module 3: Lessons 3.11 to 3.20
Enforces:
1. Physical intuitive mental models with zero unintroduced jargon.
2. 3-Part Briefing card schema (exercise_about, exercise_goal, expected_output).
3. Clean guided starter code (clean types, docstrings, # TODO comments, no spoilers).
4. Full automated test suite verification.
"""

import urllib.request
import json
import os

SUPABASE_URL = ""
SUPABASE_KEY = ""

env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
with open(env_path) as f:
    for line in f:
        if line.startswith("SUPABASE_SERVICE_ROLE_KEY="):
            SUPABASE_KEY = line.split("=", 1)[1].strip().strip('"').strip("'")
        elif line.startswith("NEXT_PUBLIC_SUPABASE_URL="):
            SUPABASE_URL = line.split("=", 1)[1].strip().strip('"').strip("'")

LESSONS_DATA = {
    "node-2-11": {
        "title": "Lesson 3.11: Scalable & Counting Bloom Filters",
        "handbook_markdown": """# Lesson 3.11: Scalable & Counting Bloom Filters

Standard Bloom filters have a critical limitation: you cannot **delete** an item, because setting a shared hash bit back to `0` would inadvertently delete other items that hashed to that same bit.

A **Counting Bloom Filter** replaces the 1-bit array with an array of small integer counters (e.g. 4-bit numbers), enabling safe item deletion.

---

### 💡 The Mental Model: Tally Counters on Pegs
Imagine pegs on a wall with clicker counters:
- **Add item**: Increment the counter on each of the $k$ hashed pegs by `+1`.
- **Query item**: If all $k$ pegs have counters $> 0$, the item is likely present. If any counter is `0`, it is definitely absent.
- **Delete item**: Decrement the counter on each of the $k$ hashed pegs by `-1`.

---

### 🔍 Deep Dive: Handling Counter Overflow
In production systems, counters must be protected against underflow (never drop below 0) and overflow (saturation at maximum value).
""",
        "starter_code": {
            "solution.py": '''"""
Scalable & Counting Bloom Filters
Implement a counting Bloom filter supporting item insertions, deletions, and lookups.
"""

import hashlib
from typing import List

class CountingBloomFilter:
    def __init__(self, size: int = 256, hash_count: int = 3):
        self.size = size
        self.hash_count = hash_count
        self.counters = [0] * size

    def _hashes(self, item: str) -> List[int]:
        """Generate deterministic hash indices for item in range [0, self.size - 1]."""
        indices = []
        for seed in range(self.hash_count):
            h = int(hashlib.sha256(f"{seed}:{item}".encode()).hexdigest(), 16)
            indices.append(h % self.size)
        return indices

    def add(self, item: str) -> None:
        """Increment counters for all hashed positions."""
        # TODO: Compute _hashes and increment each counter
        pass

    def remove(self, item: str) -> bool:
        """
        Decrement counters for all hashed positions if item might be present.
        Returns True if item was decremented, False if item was definitely not present.
        """
        # TODO: Check if all hashed positions > 0; if so, decrement each and return True
        # TODO: If any counter is 0, return False without decrementing
        pass

    def might_contain(self, item: str) -> bool:
        """Return True if all hashed counter positions are > 0, False otherwise."""
        # TODO: Test all counter positions
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Learn counting Bloom filters that support dynamic item deletions and multi-item frequency tracking without breaking shared hash cells.",
            "exercise_goal": "Implement `CountingBloomFilter` with `add(item)`, `remove(item)`, and `might_contain(item)`.",
            "expected_output": "Successfully insert items, verify presence, remove an item to restore absence, while preserving presence of distinct items sharing bits.",
            "tests.py": '''import pytest
from solution import CountingBloomFilter

def test_add_and_contain():
    cbf = CountingBloomFilter(size=512, hash_count=3)
    cbf.add("session_1")
    assert cbf.might_contain("session_1") is True
    assert cbf.might_contain("session_2") is False

def test_delete_item():
    cbf = CountingBloomFilter(size=512, hash_count=3)
    cbf.add("token_abc")
    assert cbf.might_contain("token_abc") is True
    
    removed = cbf.remove("token_abc")
    assert removed is True
    assert cbf.might_contain("token_abc") is False

def test_delete_nonexistent_item():
    cbf = CountingBloomFilter(size=256, hash_count=3)
    removed = cbf.remove("ghost_item")
    assert removed is False
'''
        }
    },
    "node-2-12": {
        "title": "Lesson 3.12: Roaring Bitmaps & Inverted Indexes",
        "handbook_markdown": """# Lesson 3.12: Roaring Bitmaps & Inverted Indexes

Standard bit arrays are great for dense integers, but terrible for sparse integers (storing ID `10,000,000` wastes megabytes of empty zeros).

**Roaring Bitmaps** solve this by dividing 32-bit integers into chunks of $2^{16}$ ($65,536$) integers. Each chunk is dynamically stored as:
- **Array Container**: Sorted list of integers when sparse ($< 4096$ items).
- **Bitset Container**: 64-bit words when dense ($\ge 4096$ items).
- **Run Container**: Run-Length Encoded ranges for continuous blocks.

---

### 💡 The Mental Model: The Filing Cabinet
Think of a filing cabinet with 65,536 drawers:
- If a drawer holds only 5 files, write their names on an index card (**Array**).
- If a drawer holds 20,000 files, use a binary check-off sheet (**Bitset**).
- If a drawer holds files 100 through 5,000 continuously, write *"100 to 5000"* (**Range**).

---

### 🔍 Deep Dive: Sparse Set Representation
In this exercise, we build a hybrid container that switches between an explicit sorted array and a boolean bitset based on density thresholds.
""",
        "starter_code": {
            "solution.py": '''"""
Roaring Bitmaps & Inverted Indexes
Implement an adaptive integer container that compresses sparse ID lists.
"""

from typing import List, Set, Union

class AdaptiveChunkContainer:
    DENSITY_THRESHOLD = 8  # Switch to bitset if count >= 8

    def __init__(self, chunk_id: int):
        self.chunk_id = chunk_id
        self.is_bitset = False
        self.array_items: List[int] = []
        self.bitset: int = 0

    def add(self, value: int) -> None:
        """Add an integer (0..63 within this chunk). Convert to bitset representation when dense."""
        # TODO: Handle adding to array_items (keep sorted, no duplicates)
        # TODO: If len(array_items) >= DENSITY_THRESHOLD and not is_bitset, convert to bitset integer
        # TODO: If is_bitset, set bit in self.bitset
        pass

    def contains(self, value: int) -> bool:
        """Return True if value is present in container, False otherwise."""
        # TODO: Check array or bitset depending on self.is_bitset
        pass

    def to_sorted_list(self) -> List[int]:
        """Return all values in this chunk as a sorted list of integers."""
        # TODO: Extract values from array or active bits in bitset
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand how search engines and analytical databases compress sparse and dense ID inverted lists using adaptive containers.",
            "exercise_goal": "Implement `AdaptiveChunkContainer` with `add(value)`, `contains(value)`, and `to_sorted_list()` that dynamically toggles between array and bitset storage.",
            "expected_output": "Correctly store items, transition to bitset representation at threshold, and return clean sorted lists.",
            "tests.py": '''import pytest
from solution import AdaptiveChunkContainer

def test_sparse_array_mode():
    chunk = AdaptiveChunkContainer(0)
    chunk.add(5)
    chunk.add(2)
    chunk.add(2) # duplicate
    assert chunk.is_bitset is False
    assert chunk.contains(5) is True
    assert chunk.contains(2) is True
    assert chunk.contains(10) is False
    assert chunk.to_sorted_list() == [2, 5]

def test_dense_bitset_transition():
    chunk = AdaptiveChunkContainer(0)
    for i in range(10): # Exceeds threshold of 8
        chunk.add(i)
    
    assert chunk.is_bitset is True
    for i in range(10):
        assert chunk.contains(i) is True
    assert chunk.contains(11) is False
    assert chunk.to_sorted_list() == list(range(10))
'''
        }
    },
    "node-2-13": {
        "title": "Lesson 3.13: Set Operations in Python",
        "handbook_markdown": """# Lesson 3.13: Set Operations in Python

Mathematical sets are unordered collections of unique elements. Set theory operations form the backbone of relational database joins, permission intersections, and deduplication pipelines.

---

### 💡 The Mental Model: Venn Diagrams
- **Union ($A \cup B$)**: Everything in circle $A$ or circle $B$ (`A | B`).
- **Intersection ($A \cap B$)**: Only the overlapping region shared by both (`A & B`).
- **Difference ($A \setminus B$)**: Items in $A$ with anything in $B$ cut out (`A - B`).
- **Symmetric Difference ($A \Delta B$)**: Items in either $A$ or $B$, but **not both** (`A ^ B`).

---

### 🔍 Deep Dive: Time Complexity of Set Operations
Python `set` is implemented using an open-addressing hash table:
- Membership test (`x in s`): Average $O(1)$ time.
- Union / Intersection ($s \cup t$): $O(|s| + |t|)$ time.
- Subset testing ($s \subseteq t$): $O(|s|)$ time.
""",
        "starter_code": {
            "solution.py": '''"""
Set Operations in Python
Compute audience segmentation and permission reconciliations using set theory.
"""

from typing import Set, Dict, Any

def analyze_audience_segments(
    cohort_a: Set[str],
    cohort_b: Set[str]
) -> Dict[str, Set[str]]:
    """
    Perform set operations to analyze two user cohort sets.

    Returns:
        A dict with keys:
        - "total_reach": Union of A and B
        - "shared_users": Intersection of A and B
        - "exclusive_to_a": Elements in A but not in B
        - "exclusive_to_b": Elements in B but not in A
        - "single_cohort_only": Elements in exactly one cohort (symmetric difference)
    """
    # TODO: Implement using Python set operators
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master Python set theory operators (| , & , - , ^) to compute relational audience segmentations and access control intersections.",
            "exercise_goal": "Implement `analyze_audience_segments(cohort_a, cohort_b)` returning a dictionary of standard set transformations.",
            "expected_output": "Return a dict containing exact sets for total_reach, shared_users, exclusive_to_a, exclusive_to_b, and single_cohort_only.",
            "tests.py": '''import pytest
from solution import analyze_audience_segments

def test_audience_segments():
    a = {"alice", "bob", "charlie"}
    b = {"bob", "charlie", "david", "eve"}
    
    res = analyze_audience_segments(a, b)
    assert res["total_reach"] == {"alice", "bob", "charlie", "david", "eve"}
    assert res["shared_users"] == {"bob", "charlie"}
    assert res["exclusive_to_a"] == {"alice"}
    assert res["exclusive_to_b"] == {"david", "eve"}
    assert res["single_cohort_only"] == {"alice", "david", "eve"}

def test_disjoint_sets():
    a = {"x", "y"}
    b = {"z"}
    res = analyze_audience_segments(a, b)
    assert res["shared_users"] == set()
    assert res["total_reach"] == {"x", "y", "z"}
'''
        }
    },
    "node-2-14": {
        "title": "Lesson 3.14: Jaccard Similarity & MinHash",
        "handbook_markdown": """# Lesson 3.14: Jaccard Similarity & MinHash

When comparing two documents or token sets, **Jaccard Similarity** measures overlap:
$$J(A, B) = \\frac{|A \cap B|}{|A \cup B|}$$

- If $A$ and $B$ are identical: $J(A, B) = 1.0$.
- If $A$ and $B$ share zero words: $J(A, B) = 0.0$.

---

### 💡 The Mental Model: The Overlapping Wardrobes
Imagine two friends comparing their clothing collections:
- Friend A has 5 shirts.
- Friend B has 5 shirts.
- They have 2 identical shirts in common.
- Total unique shirts between them: $5 + 5 - 2 = 8$.
- Wardrobe similarity: $2 / 8 = 0.25$ ($25\%$).

---

### 🔍 Deep Dive: MinHash for Million-Document Deduplication
Computing exact Jaccard similarity across $N$ million documents requires $O(N^2)$ heavy set intersections. **MinHash** generates a compact signature for each set such that the probability of two signatures matching equals their exact Jaccard similarity.
""",
        "starter_code": {
            "solution.py": '''"""
Jaccard Similarity & MinHash
Calculate exact Jaccard similarity and generate MinHash signatures for text shingles.
"""

import hashlib
from typing import Set, List

def calculate_jaccard_similarity(set_a: Set[str], set_b: Set[str]) -> float:
    """
    Compute exact Jaccard similarity: |A ∩ B| / |A ∪ B|.
    Return 1.0 if both sets are empty.
    """
    # TODO: Handle empty sets
    # TODO: Calculate intersection and union sizes
    # TODO: Return float ratio
    pass

def generate_minhash_signature(tokens: Set[str], num_hashes: int = 16) -> List[int]:
    """
    Generate a MinHash signature vector of length `num_hashes` for a set of token strings.
    For each hash seed k in range(num_hashes), compute min(hash_k(t) for t in tokens).
    If tokens is empty, return [0] * num_hashes.
    """
    # TODO: For each seed, find minimum integer sha256 hash value across all tokens
    # TODO: Return signature list
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand set similarity metrics and implement exact Jaccard similarity along with MinHash signature generation for document deduplication.",
            "exercise_goal": "Implement `calculate_jaccard_similarity(set_a, set_b)` and `generate_minhash_signature(tokens, num_hashes)`.",
            "expected_output": "Return precise float similarity in range [0.0, 1.0] and deterministic integer signature vectors.",
            "tests.py": '''import pytest
from solution import calculate_jaccard_similarity, generate_minhash_signature

def test_jaccard_similarity():
    s1 = {"apple", "banana", "cherry"}
    s2 = {"banana", "cherry", "date"}
    # Intersection = 2 (banana, cherry), Union = 4 (apple, banana, cherry, date) -> 0.5
    assert calculate_jaccard_similarity(s1, s2) == pytest.approx(0.5)

def test_jaccard_identical_and_empty():
    assert calculate_jaccard_similarity(set(), set()) == 1.0
    assert calculate_jaccard_similarity({"a", "b"}, {"a", "b"}) == 1.0
    assert calculate_jaccard_similarity({"a"}, {"b"}) == 0.0

def test_minhash_signature():
    doc1 = {"python", "ai", "vector"}
    sig1 = generate_minhash_signature(doc1, num_hashes=8)
    sig2 = generate_minhash_signature(doc1, num_hashes=8)
    
    assert len(sig1) == 8
    assert sig1 == sig2 # Deterministic
    
    doc_empty = set()
    assert generate_minhash_signature(doc_empty, 4) == [0, 0, 0, 0]
'''
        }
    },
    "node-2-15": {
        "title": "Lesson 3.15: Binary Relations & Partitions",
        "handbook_markdown": """# Lesson 3.15: Binary Relations & Partitions

In mathematics and database design, a **Binary Relation** $R$ on set $S$ is a collection of ordered pairs $(a, b) \in S \times S$.

An **Equivalence Relation** is a binary relation satisfying three fundamental axioms:
1. **Reflexive**: $\forall a, (a, a) \in R$ (Every element is related to itself).
2. **Symmetric**: $\forall a, b, (a, b) \in R \implies (b, a) \in R$ (If A relates to B, B relates to A).
3. **Transitive**: $\forall a, b, c, (a, b) \in R \land (b, c) \in R \implies (a, c) \in R$ (Connections chain together).

---

### 💡 The Mental Model: Partitioning Connected Teams
Think of office workgroups:
- You work with yourself (Reflexive).
- If you work with Bob, Bob works with you (Symmetric).
- If Bob works with Charlie, you all belong to the same workgroup (Transitive).

An equivalence relation slices a large set into non-overlapping **Equivalence Classes** (Partitions).

---

### 🔍 Deep Dive: Disjoint Sets & Partitions
Given a list of paired connections, we can partition a dataset into disjoint clusters (connected components).
""",
        "starter_code": {
            "solution.py": '''"""
Binary Relations & Partitions
Partition elements into disjoint equivalence classes using transitive closure.
"""

from typing import Set, List, Tuple, Any

def find_equivalence_partitions(
    elements: Set[Any],
    relations: List[Tuple[Any, Any]]
) -> List[Set[Any]]:
    """
    Given a set of elements and symmetric relational pairs (a, b), compute the
    disjoint equivalence class partitions (connected clusters).

    Args:
        elements: All unique elements.
        relations: List of related pairs (a, b) indicating a and b belong to same partition.

    Returns:
        A list of disjoint sets, where each set represents an equivalence class.
        Isolated elements without relations form single-element sets.
    """
    # TODO: Build an adjacency graph of relations
    # TODO: Traverse connected components using BFS or DFS
    # TODO: Return all disjoint partitions
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Learn equivalence relations and use graph traversal to partition datasets into disjoint equivalence classes.",
            "exercise_goal": "Implement `find_equivalence_partitions(elements, relations)` to cluster related elements into non-overlapping connected component sets.",
            "expected_output": "Return a list of disjoint sets encompassing every input element exactly once.",
            "tests.py": '''import pytest
from solution import find_equivalence_partitions

def test_single_connected_partition():
    elements = {"a", "b", "c"}
    relations = [("a", "b"), ("b", "c")]
    partitions = find_equivalence_partitions(elements, relations)
    assert len(partitions) == 1
    assert partitions[0] == {"a", "b", "c"}

def test_multiple_disjoint_partitions():
    elements = {1, 2, 3, 4, 5, 6}
    relations = [(1, 2), (2, 3), (4, 5)]
    partitions = find_equivalence_partitions(elements, relations)
    
    # Expected partitions: {1, 2, 3}, {4, 5}, {6}
    sorted_parts = sorted([sorted(list(p)) for p in partitions])
    assert sorted_parts == [[1, 2, 3], [4, 5], [6]]

def test_isolated_elements():
    elements = {"x", "y", "z"}
    partitions = find_equivalence_partitions(elements, [])
    assert len(partitions) == 3
'''
        }
    },
    "node-2-16": {
        "title": "Lesson 3.16: Partial Orders & Task Precedence",
        "handbook_markdown": """# Lesson 3.16: Partial Orders & Task Precedence

A **Poset (Partially Ordered Set)** defines a precedence relation ($\le$) where some elements precede others, but not every pair is necessarily comparable.

A Partial Order satisfies:
1. **Reflexive**: $a \le a$.
2. **Antisymmetric**: If $a \le b$ and $b \le a$, then $a = b$ (No circular dependency).
3. **Transitive**: If $a \le b$ and $b \le c$, then $a \le c$.

---

### 💡 The Mental Model: Getting Dressed in the Morning
Consider your morning routine:
- Underwear must precede Pants ($\text{Underwear} \le \text{Pants}$).
- Socks must precede Shoes ($\text{Socks} \le \text{Shoes}$).
- Pants must precede Shoes ($\text{Pants} \le \text{Shoes}$).
- But Socks and Underwear have **no order between them** (they are incomparable).

This partial ordering forms a **Directed Acyclic Graph (DAG)** of dependencies.
""",
        "starter_code": {
            "solution.py": '''"""
Partial Orders & Task Precedence
Verify acyclic partial order invariants and calculate predecessor chains.
"""

from typing import Dict, Set, List

def get_all_transitive_dependencies(
    task: str,
    direct_dependencies: Dict[str, List[str]]
) -> Set[str]:
    """
    Compute all transitive dependencies required before `task` can execute.

    Args:
        task: Target task name.
        direct_dependencies: Mapping of task -> list of direct dependencies.

    Returns:
        A set of all ancestor tasks that must complete before `task`.
    """
    # TODO: Traverse dependency graph (DFS/BFS) starting from task
    # TODO: Collect all visited ancestor tasks (excluding the task itself)
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand partially ordered sets (Posets) and compute complete transitive dependency closures for build systems and task runners.",
            "exercise_goal": "Write `get_all_transitive_dependencies(task, direct_dependencies)` using graph traversal.",
            "expected_output": "Return a complete set containing all direct and indirect dependencies needed before executing the target task.",
            "tests.py": '''import pytest
from solution import get_all_transitive_dependencies

def test_linear_dependencies():
    deps = {
        "deploy": ["build"],
        "build": ["compile", "lint"],
        "compile": ["download_deps"],
        "lint": [],
        "download_deps": []
    }
    result = get_all_transitive_dependencies("deploy", deps)
    assert result == {"build", "compile", "lint", "download_deps"}

def test_diamond_dependencies():
    deps = {
        "app": ["db", "api"],
        "db": ["config"],
        "api": ["config"],
        "config": []
    }
    result = get_all_transitive_dependencies("app", deps)
    assert result == {"db", "api", "config"}

def test_no_dependencies():
    deps = {"isolated": []}
    assert get_all_transitive_dependencies("isolated", deps) == set()
'''
        }
    },
    "node-2-17": {
        "title": "Lesson 3.17: In-Memory Relational Algebra",
        "handbook_markdown": """# Lesson 3.17: In-Memory Relational Algebra

**Relational Algebra** is the formal mathematical foundation of SQL and dataframe queries. Every SQL query is translated into relational algebra operators:
- **Selection ($\sigma$)**: Filter rows matching a predicate (`WHERE`).
- **Projection ($\pi$)**: Pick specific columns (`SELECT col1, col2`).
- **Cartesian Product ($\times$)**: All combinations of rows from two relations (`CROSS JOIN`).
- **Inner Join ($\bowtie$)**: Match rows from two tables on a shared key (`INNER JOIN ON`).

---

### 💡 The Mental Model: Assembly Line Sorting & Cutting
- $\sigma$ (Selection) is a filter sieve: discard defective parts.
- $\pi$ (Projection) is a laser cutter: strip away unwanted metadata and keep only the core columns.
- $\bowtie$ (Join) is a stapler: bind matching invoice records to customer profiles on matching `customer_id`.
""",
        "starter_code": {
            "solution.py": '''"""
In-Memory Relational Algebra
Implement fundamental relational algebra operators: select, project, and inner join.
"""

from typing import List, Dict, Any, Callable

Table = List[Dict[str, Any]]

def select(table: Table, predicate: Callable[[Dict[str, Any]], bool]) -> Table:
    """Relational Selection (sigma): Filter rows where predicate(row) is True."""
    # TODO: Implement selection
    pass

def project(table: Table, columns: List[str]) -> Table:
    """Relational Projection (pi): Keep only the specified columns in each row."""
    # TODO: Implement projection
    pass

def inner_join(table_a: Table, table_b: Table, key: str) -> Table:
    """
    Relational Inner Join (bowtie): Join table_a and table_b on matching `key` attribute.
    Merged rows contain combined keys from both tables.
    """
    # TODO: Index table_b by key for fast lookup (Hash Join)
    # TODO: Match with table_a rows and merge dictionaries
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Implement the core mathematical relational algebra operators (Selection, Projection, Inner Join) that power database engines.",
            "exercise_goal": "Implement `select(table, predicate)`, `project(table, columns)`, and `inner_join(table_a, table_b, key)`.",
            "expected_output": "Correctly filter rows, extract requested sub-dictionaries, and perform in-memory hash joins across tables.",
            "tests.py": '''import pytest
from solution import select, project, inner_join

@pytest.fixture
def sample_users():
    return [
        {"id": 1, "name": "Alice", "role": "admin", "salary": 120000},
        {"id": 2, "name": "Bob", "role": "engineer", "salary": 100000},
        {"id": 3, "name": "Charlie", "role": "engineer", "salary": 90000},
    ]

@pytest.fixture
def sample_departments():
    return [
        {"user_id": 1, "dept": "Security"},
        {"user_id": 2, "dept": "AI Infrastructure"},
    ]

def test_relational_select(sample_users):
    engineers = select(sample_users, lambda u: u["role"] == "engineer")
    assert len(engineers) == 2
    assert [u["name"] for u in engineers] == ["Bob", "Charlie"]

def test_relational_project(sample_users):
    projected = project(sample_users, ["name", "salary"])
    assert projected == [
        {"name": "Alice", "salary": 120000},
        {"name": "Bob", "salary": 100000},
        {"name": "Charlie", "salary": 90000},
    ]

def test_relational_inner_join(sample_users, sample_departments):
    joined = inner_join(sample_users, sample_departments, key="user_id") # Note: map id to user_id or match exact key
    # If key is 'id' in a and 'user_id' in b, let's test matching key 'id'
    orders = [{"id": 1, "item": "Laptop"}, {"id": 2, "item": "Keyboard"}]
    res = inner_join(sample_users, orders, key="id")
    assert len(res) == 2
    assert res[0]["name"] == "Alice"
    assert res[0]["item"] == "Laptop"
'''
        }
    },
    "node-2-18": {
        "title": "Lesson 3.18: Inverted Index Search Engines",
        "handbook_markdown": """# Lesson 3.18: Inverted Index Search Engines

In a standard forward index, a document ID points to its contents (`Doc 1 -> "AI agents in Python"`).

An **Inverted Index** reverses this mapping: each unique word (term) points to a list of document IDs containing it (the **Posting List**):
- `"ai"` $\to [1, 4, 9]$
- `"python"` $\to [1, 2, 7]$

---

### 💡 The Mental Model: The Book Index
Look at the back of any textbook:
Instead of flipping through 500 pages looking for "Recursion", you look up "Recursion" in the index at the back and jump directly to pages `42, 89, 105`.

---

### 🔍 Deep Dive: Fast Query Intersections
To find documents matching `ai AND python`:
Take the posting list for `ai` ($[1, 4, 9]$) and `python` ($[1, 2, 7]$) and compute their set intersection ($[1]$) in $O(|L_1| + |L_2|)$ time without scanning document texts.
""",
        "starter_code": {
            "solution.py": '''"""
Inverted Index Search Engines
Build a tokenized in-memory inverted index supporting AND/OR multi-word queries.
"""

from typing import Dict, List, Set
import re

class InvertedIndex:
    def __init__(self):
        # term -> set of doc_ids
        self.index: Dict[str, Set[int]] = {}

    def _tokenize(self, text: str) -> List[str]:
        """Convert text to lowercase alphanumeric tokens."""
        return re.findall(r'[a-z0-9]+', text.lower())

    def add_document(self, doc_id: int, content: str) -> None:
        """Tokenize content and add doc_id to the posting lists for each token."""
        # TODO: Tokenize content and register doc_id in self.index
        pass

    def search_and(self, terms: List[str]) -> Set[int]:
        """Find doc_ids containing ALL given terms."""
        # TODO: Compute intersection of posting lists for normalized terms
        pass

    def search_or(self, terms: List[str]) -> Set[int]:
        """Find doc_ids containing AT LEAST ONE of the given terms."""
        # TODO: Compute union of posting lists for normalized terms
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Build an in-memory inverted index search engine with posting lists and fast boolean keyword intersections.",
            "exercise_goal": "Implement `add_document(doc_id, content)`, `search_and(terms)`, and `search_or(terms)` on `InvertedIndex`.",
            "expected_output": "Return exact sets of matching document IDs for AND/OR search queries.",
            "tests.py": '''import pytest
from solution import InvertedIndex

@pytest.fixture
def populated_index():
    idx = InvertedIndex()
    idx.add_document(1, "Python agent architecture and LLM workflows")
    idx.add_document(2, "High performance Python web servers with FastAPI")
    idx.add_document(3, "PostgreSQL database indexing and vector search")
    return idx

def test_search_and(populated_index):
    # 'python' is in docs 1, 2. 'agent' is in doc 1.
    res = populated_index.search_and(["python", "agent"])
    assert res == {1}
    
    empty_res = populated_index.search_and(["python", "database"])
    assert empty_res == set()

def test_search_or(populated_index):
    # 'fastapi' (2) OR 'postgresql' (3)
    res = populated_index.search_or(["fastapi", "postgresql"])
    assert res == {2, 3}

def test_search_unknown_words(populated_index):
    assert populated_index.search_and(["blockchain"]) == set()
    assert populated_index.search_or(["blockchain", "fastapi"]) == {2}
'''
        }
    },
    "node-2-19": {
        "title": "Lesson 3.19: Graph Memory Structures",
        "handbook_markdown": """# Lesson 3.19: Graph Memory Structures

Graphs represent entities (**vertices / nodes**) and their relationships (**edges**). There are two primary in-memory representations:

1. **Adjacency List** (`Dict[Node, List[Node]]`):
   - Memory efficient for sparse graphs ($O(V + E)$).
   - Fast iteration over a node's neighbors ($O(\\text{degree})$).
2. **Adjacency Matrix** (`List[List[int]]`):
   - $V \times V$ grid of edge weights or booleans.
   - $O(1)$ edge existence check, but consumes $O(V^2)$ memory.

---

### 💡 The Mental Model: The Airport Flight Map
- **Vertices**: Airport codes (`JFK`, `LHR`, `HND`).
- **Edges**: Direct flights with flight durations as edge weights.
- An **Adjacency List** is a departure board at each airport listing only its direct flights.

---

### 🔍 Deep Dive: Weighted Directed Graph
In AI agent workflows, graphs model steps, tool calls, and state transitions.
""",
        "starter_code": {
            "solution.py": '''"""
Graph Memory Structures
Implement an Adjacency List graph supporting directed edges and weights.
"""

from typing import Dict, List, Tuple

class DirectedGraph:
    def __init__(self):
        # node -> list of (neighbor, weight)
        self.adj: Dict[str, List[Tuple[str, float]]] = {}

    def add_node(self, node: str) -> None:
        """Add a node to the graph if it doesn't already exist."""
        # TODO: Initialize empty neighbor list if new
        pass

    def add_edge(self, from_node: str, to_node: str, weight: float = 1.0) -> None:
        """Add a directed edge from `from_node` to `to_node` with weight."""
        # TODO: Ensure both nodes exist, then append (to_node, weight)
        pass

    def get_neighbors(self, node: str) -> List[Tuple[str, float]]:
        """Return list of (neighbor_node, weight) tuples for `node`."""
        # TODO: Return neighbors or empty list
        pass

    def get_in_degree(self, node: str) -> int:
        """Return the number of incoming edges pointing to `node`."""
        # TODO: Count incoming edges from all nodes in graph
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Master graph in-memory representations using adjacency lists and calculate in-degree and neighbor connections.",
            "exercise_goal": "Implement `DirectedGraph` with `add_node()`, `add_edge()`, `get_neighbors()`, and `get_in_degree()`.",
            "expected_output": "Properly maintain adjacency structures and compute exact neighbor lists and in-degrees.",
            "tests.py": '''import pytest
from solution import DirectedGraph

def test_graph_construction():
    g = DirectedGraph()
    g.add_node("A")
    g.add_node("B")
    g.add_edge("A", "B", weight=2.5)
    
    neighbors = g.get_neighbors("A")
    assert neighbors == [("B", 2.5)]
    assert g.get_neighbors("B") == []

def test_in_degree_calculation():
    g = DirectedGraph()
    g.add_edge("A", "C")
    g.add_edge("B", "C")
    g.add_edge("D", "C")
    g.add_edge("C", "A")
    
    assert g.get_in_degree("C") == 3
    assert g.get_in_degree("A") == 1
    assert g.get_in_degree("B") == 0
'''
        }
    },
    "node-2-20": {
        "title": "Lesson 3.20: Cycle Detection & Deadlock Hunting",
        "handbook_markdown": """# Lesson 3.20: Cycle Detection & Deadlock Hunting

In distributed transaction locks and task dependency pipelines, a **Cycle** means deadlock: Task A waits for Task B, which waits for Task C, which waits for Task A.

---

### 💡 The Mental Model: The Ouroboros (Snake Eating Its Tail)
If you trace steps through a workflow and find yourself back at a step you already started without finishing it, the workflow has a circular loop and can never terminate.

---

### 🔍 Deep Dive: 3-Color DFS Cycle Detection
Using Depth-First Search with 3 vertex states:
1. **WHITE (0, Unvisited)**: Node has not been touched yet.
2. **GRAY (1, In Progress / On Current Stack)**: Node is currently being explored in the active recursion branch.
3. **BLACK (2, Visited / Completed)**: Node and all its descendants have been completely processed.

**A directed cycle exists if and only if DFS encounters a GRAY node.**
""",
        "starter_code": {
            "solution.py": '''"""
Cycle Detection & Deadlock Hunting
Detect cycles in directed dependency graphs using 3-color DFS.
"""

from typing import Dict, List

def has_cycle(graph: Dict[str, List[str]]) -> bool:
    """
    Determine if a directed graph contains any circular cycles using 3-color DFS.

    Args:
        graph: Adjacency list mapping node -> list of outgoing neighbor nodes.

    Returns:
        True if the graph contains at least one cycle, False if it is a DAG (Acyclic).
    """
    # TODO: Initialize color map: 0=WHITE, 1=GRAY, 2=BLACK
    # TODO: Implement recursive dfs(node) helper
    # TODO: If neighbor is GRAY (1), cycle detected! Return True
    # TODO: Check all unvisited nodes in graph
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand cycle detection algorithms (3-color DFS) to prevent deadlocks and infinite loops in agent execution graphs.",
            "exercise_goal": "Implement `has_cycle(graph)` that returns `True` if any circular reference exists in the directed graph, and `False` otherwise.",
            "expected_output": "Accurately flag cyclic graphs and confirm acyclic DAGs.",
            "tests.py": '''import pytest
from solution import has_cycle

def test_acyclic_graph():
    # A -> B -> C -> D
    dag = {
        "A": ["B"],
        "B": ["C"],
        "C": ["D"],
        "D": []
    }
    assert has_cycle(dag) is False

def test_simple_cycle():
    # A -> B -> C -> A
    cyclic = {
        "A": ["B"],
        "B": ["C"],
        "C": ["A"]
    }
    assert has_cycle(cyclic) is True

def test_disconnected_subgraph_cycle():
    # A -> B (ok), but C <-> D (cycle)
    graph = {
        "A": ["B"],
        "B": [],
        "C": ["D"],
        "D": ["C"]
    }
    assert has_cycle(graph) is True

def test_self_loop():
    graph = {"A": ["A"]}
    assert has_cycle(graph) is True
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 3 (node-2-11 to node-2-20)...")
    for node_id, data in LESSONS_DATA.items():
        payload = {
            "title": data["title"],
            "handbook_markdown": data["handbook_markdown"],
            "starter_code": data["starter_code"],
            "test_suite": data["test_suite"]
        }
        
        req = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="PATCH"
        )
        with urllib.request.urlopen(req) as resp:
            print(f"✓ Patched {node_id} ({data['title']}) -> HTTP {resp.status}")

if __name__ == "__main__":
    apply_patches()
