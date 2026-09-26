#!/usr/bin/env python3
"""
Batch patch Module 5: AI Data Structures & Memory Optimization (Lessons 5.26 to 5.50)
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
    "node-3-26": {
        "title": "Lesson 5.26: Binary Heap Array Invariants",
        "handbook_markdown": r"""# Lesson 5.26: Binary Heap Array Invariants

A **Min-Heap** satisfies the invariant: parent $\le$ children.
In a 0-indexed flat array:
- Left child of index $i$: $2i + 1$.
- Right child of index $i$: $2i + 2$.
- Parent of index $i$: $\lfloor\frac{i-1}{2}\rfloor$.
""",
        "starter_code": {
            "solution.py": '''"""
Binary Heap Array Invariants
Calculate heap child and parent array indices.
"""

def get_heap_parent_index(i: int) -> int:
    return (i - 1) // 2

def get_heap_left_child_index(i: int) -> int:
    return 2 * i + 1

def get_heap_right_child_index(i: int) -> int:
    return 2 * i + 2
'''
        },
        "test_suite": {
            "exercise_about": "Understand binary heap array indexing math.",
            "exercise_goal": "Implement parent and children index functions.",
            "expected_output": "Compute exact flat array tree coordinates.",
            "tests.py": '''import pytest
from solution import get_heap_parent_index, get_heap_left_child_index, get_heap_right_child_index

def test_heap_indices():
    assert get_heap_left_child_index(0) == 1
    assert get_heap_right_child_index(0) == 2
    assert get_heap_parent_index(1) == 0
    assert get_heap_parent_index(2) == 0
'''
        }
    },
    "node-3-27": {
        "title": "Lesson 5.27: Sift-Down Heap Construction",
        "handbook_markdown": r"""# Lesson 5.27: Sift-Down Heap Construction

Converting an unsorted array of size $N$ into a valid Min-Heap using bottom-up **Sift-Down (heapify)** runs in linear $O(N)$ time.
""",
        "starter_code": {
            "solution.py": '''"""
Sift-Down Heap Construction
Transform list into valid min-heap in-place.
"""

import heapq
from typing import List

def heapify_list(nums: List[int]) -> List[int]:
    """Heapify nums in-place and return the min-heap list."""
    res = list(nums)
    heapq.heapify(res)
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Understand linear-time O(N) heap construction via sift-down.",
            "exercise_goal": "Implement `heapify_list(nums)`.",
            "expected_output": "Return valid min-heap array.",
            "tests.py": '''import pytest
from solution import heapify_list

def test_heapify():
    res = heapify_list([9, 5, 2, 8, 1])
    assert res[0] == 1 # Min at root
'''
        }
    },
    "node-3-28": {
        "title": "Lesson 5.28: Streaming Top-K with Min-Heaps",
        "handbook_markdown": r"""# Lesson 5.28: Streaming Top-K with Min-Heaps

Tracking top-$K$ largest items in a stream uses a Min-Heap of size $K$. If incoming $x > \text{heap}[0]$, replace root. Memory is bounded at $O(K)$.
""",
        "starter_code": {
            "solution.py": '''"""
Streaming Top-K with Min-Heaps
Find top-k largest elements in an unbounded data stream.
"""

import heapq
from typing import List

def find_top_k_stream(stream: List[int], k: int) -> List[int]:
    """Maintain min-heap of size k to find top-k largest elements."""
    if k <= 0:
        return []
    min_heap = []
    for x in stream:
        if len(min_heap) < k:
            heapq.heappush(min_heap, x)
        elif x > min_heap[0]:
            heapq.heappushpop(min_heap, x)
    return sorted(min_heap, reverse=True)
'''
        },
        "test_suite": {
            "exercise_about": "Master streaming top-K selection with bounded min-heaps.",
            "exercise_goal": "Implement `find_top_k_stream(stream, k)`.",
            "expected_output": "Return top-k largest elements in descending order.",
            "tests.py": '''import pytest
from solution import find_top_k_stream

def test_top_k():
    data = [3, 10, 1000, -5, 4, 100, 20]
    assert find_top_k_stream(data, 3) == [1000, 100, 20]
'''
        }
    },
    "node-3-29": {
        "title": "Lesson 5.29: Merging K Sorted Response Streams",
        "handbook_markdown": r"""# Lesson 5.29: Merging K Sorted Response Streams

Merging $K$ sorted streams into a single sorted output uses a Min-Heap storing `(current_value, stream_index)` in $O(N \log K)$ time.
""",
        "starter_code": {
            "solution.py": '''"""
Merging K Sorted Response Streams
Merge K sorted lists into one sorted list.
"""

import heapq
from typing import List

def merge_k_sorted_lists(lists: List[List[int]]) -> List[int]:
    """Merge K sorted lists using heapq.merge."""
    return list(heapq.merge(*lists))
'''
        },
        "test_suite": {
            "exercise_about": "Merge K sorted response streams efficiently.",
            "exercise_goal": "Implement `merge_k_sorted_lists(lists)`.",
            "expected_output": "Return combined sorted list.",
            "tests.py": '''import pytest
from solution import merge_k_sorted_lists

def test_merge_k():
    lists = [[1, 4, 7], [2, 5, 8], [3, 6, 9]]
    assert merge_k_sorted_lists(lists) == list(range(1, 10))
'''
        }
    },
    "node-3-30": {
        "title": "Lesson 5.30: Deadline-Aware Task Scheduling",
        "handbook_markdown": r"""# Lesson 5.30: Deadline-Aware Task Scheduling

Earliest Deadline First (EDF) pops the task with the smallest timestamp deadline.
""",
        "starter_code": {
            "solution.py": '''"""
Deadline-Aware Task Scheduling
Schedule tasks by earliest timestamp deadline.
"""

import heapq
from typing import Tuple, Optional

class EDFScheduler:
    def __init__(self):
        self.heap = [] # (deadline_timestamp, task_name)

    def add_task(self, name: str, deadline: float) -> None:
        heapq.heappush(self.heap, (deadline, name))

    def pop_earliest(self) -> Optional[str]:
        return heapq.heappop(self.heap)[1] if self.heap else None
'''
        },
        "test_suite": {
            "exercise_about": "Implement Earliest Deadline First (EDF) task scheduling.",
            "exercise_goal": "Implement `EDFScheduler`.",
            "expected_output": "Pop tasks in earliest deadline order.",
            "tests.py": '''import pytest
from solution import EDFScheduler

def test_edf():
    s = EDFScheduler()
    s.add_task("task_later", 500.0)
    s.add_task("task_soon", 100.0)
    assert s.pop_earliest() == "task_soon"
    assert s.pop_earliest() == "task_later"
'''
        }
    },
    "node-3-31": {
        "title": "Lesson 5.31: Running Median with Dual Heaps",
        "handbook_markdown": r"""# Lesson 5.31: Running Median with Dual Heaps

Tracking the running median of a streaming dataset in $O(\log N)$ insert time uses **Dual Heaps**:
- Max-Heap for the lower half of numbers.
- Min-Heap for the upper half of numbers.
- Keep heaps balanced within $\pm 1$ elements.
""",
        "starter_code": {
            "solution.py": '''"""
Running Median with Dual Heaps
Calculate median from two balanced heaps.
"""

import heapq
from typing import List

class DualHeapMedian:
    def __init__(self):
        self.small = [] # max-heap (negated)
        self.large = [] # min-heap

    def add_num(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        # Ensure every element in small <= large
        if self.small and self.large and (-self.small[0] > self.large[0]):
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        # Rebalance sizes
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        elif len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)

    def find_median(self) -> float:
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        return (-self.small[0] + self.large[0]) / 2.0
'''
        },
        "test_suite": {
            "exercise_about": "Master Dual Heaps for streaming running median calculation.",
            "exercise_goal": "Implement `DualHeapMedian`.",
            "expected_output": "Compute exact median dynamically.",
            "tests.py": '''import pytest
from solution import DualHeapMedian

def test_running_median():
    m = DualHeapMedian()
    m.add_num(1)
    m.add_num(2)
    assert m.find_median() == 1.5
    m.add_num(3)
    assert m.find_median() == 2.0
'''
        }
    },
    "node-3-32": {
        "title": "Lesson 5.32: Spatial Trees (K-D Trees)",
        "handbook_markdown": r"""# Lesson 5.32: Spatial Trees (K-D Trees)

A **K-D Tree** partitions $K$-dimensional space using alternating axis splits (x-axis at depth 0, y-axis at depth 1...).
""",
        "starter_code": {
            "solution.py": '''"""
Spatial Trees (K-D Trees)
Determine axis split dimension at tree depth.
"""

def get_split_axis(depth: int, k_dimensions: int) -> int:
    """Return axis dimension index (0..k-1) to split on at depth."""
    return depth % k_dimensions
'''
        },
        "test_suite": {
            "exercise_about": "Understand K-D Tree spatial partitioning axis rotation.",
            "exercise_goal": "Implement `get_split_axis(depth, k_dimensions)`.",
            "expected_output": "Return alternating split axis index.",
            "tests.py": '''import pytest
from solution import get_split_axis

def test_split_axis():
    assert get_split_axis(0, 3) == 0
    assert get_split_axis(1, 3) == 1
    assert get_split_axis(2, 3) == 2
    assert get_split_axis(3, 3) == 0
'''
        }
    },
    "node-3-33": {
        "title": "Lesson 5.33: Doubly Linked Lists with Sentinels",
        "handbook_markdown": r"""# Lesson 5.33: Doubly Linked Lists with Sentinels

Using dummy **Head and Tail Sentinel Nodes** eliminates null pointer checks in node insertions and deletions ($O(1)$ operations).
""",
        "starter_code": {
            "solution.py": '''"""
Doubly Linked Lists with Sentinels
Implement a doubly linked list with head and tail sentinel nodes.
"""

class ListNode:
    def __init__(self, key: str = "", val: int = 0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class SentinelDoublyLinkedList:
    def __init__(self):
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head

    def add_first(self, node: ListNode) -> None:
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def remove(self, node: ListNode) -> None:
        node.prev.next = node.next
        node.next.prev = node.prev
'''
        },
        "test_suite": {
            "exercise_about": "Build doubly linked lists with dummy sentinel boundaries.",
            "exercise_goal": "Implement `SentinelDoublyLinkedList`.",
            "expected_output": "Execute boundary-safe O(1) insertions and removals.",
            "tests.py": '''import pytest
from solution import SentinelDoublyLinkedList, ListNode

def test_sentinel_list():
    ll = SentinelDoublyLinkedList()
    n1 = ListNode("a", 1)
    ll.add_first(n1)
    assert ll.head.next == n1
    assert ll.tail.prev == n1
    ll.remove(n1)
    assert ll.head.next == ll.tail
'''
        }
    },
    "node-3-34": {
        "title": "Lesson 5.34: Building an O(1) LRU Cache",
        "handbook_markdown": r"""# Lesson 5.34: Building an O(1) LRU Cache

An **LRU Cache** combines a Hash Map with a Doubly Linked List to provide $O(1)$ `get()` and `put()` operations with least-recently-used eviction.
""",
        "starter_code": {
            "solution.py": '''"""
Building an O(1) LRU Cache
Implement an O(1) Least Recently Used cache.
"""

from collections import OrderedDict
from typing import Any, Optional

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: str) -> Optional[Any]:
        if key not in self.cache:
            return None
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: str, val: Any) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = val
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
'''
        },
        "test_suite": {
            "exercise_about": "Build an O(1) LRU Cache using ordered hash maps.",
            "exercise_goal": "Implement `LRUCache`.",
            "expected_output": "Evict least recently used entries when capacity is full.",
            "tests.py": '''import pytest
from solution import LRUCache

def test_lru_cache():
    lru = LRUCache(2)
    lru.put("a", 1)
    lru.put("b", 2)
    assert lru.get("a") == 1 # "a" becomes most recently used
    lru.put("c", 3)          # "b" evicted!
    assert lru.get("b") is None
    assert lru.get("c") == 3
'''
        }
    },
    "node-3-35": {
        "title": "Lesson 5.35: LFU Cache: Frequency Buckets",
        "handbook_markdown": r"""# Lesson 5.35: LFU Cache: Frequency Buckets

An **LFU (Least Frequently Used) Cache** tracks access count frequencies and evicts items with the lowest access count.
""",
        "starter_code": {
            "solution.py": '''"""
LFU Cache: Frequency Buckets
Track frequency counts for cached keys.
"""

from typing import Dict, Optional

class FrequencyTracker:
    def __init__(self):
        self.counts: Dict[str, int] = {}

    def access(self, key: str) -> None:
        self.counts[key] = self.counts.get(key, 0) + 1

    def get_least_frequent(self) -> Optional[str]:
        if not self.counts:
            return None
        return min(self.counts.items(), key=lambda x: x[1])[0]
'''
        },
        "test_suite": {
            "exercise_about": "Implement access frequency tracking for LFU caches.",
            "exercise_goal": "Implement `FrequencyTracker`.",
            "expected_output": "Identify least frequently accessed key.",
            "tests.py": '''import pytest
from solution import FrequencyTracker

def test_freq_tracker():
    ft = FrequencyTracker()
    ft.access("popular")
    ft.access("popular")
    ft.access("rare")
    assert ft.get_least_frequent() == "rare"
'''
        }
    },
    "node-3-36": {
        "title": "Lesson 5.36: TTL Expiration & Cache Sweepers",
        "handbook_markdown": r"""# Lesson 5.36: TTL Expiration & Cache Sweepers

**Time-To-Live (TTL)** attaches an expiration timestamp to each cache entry, invalidating stale data.
""",
        "starter_code": {
            "solution.py": '''"""
TTL Expiration & Cache Sweepers
Implement TTL expiration checks.
"""

import time
from typing import Dict, Any, Tuple, Optional

class TTLCache:
    def __init__(self, default_ttl_sec: float = 60.0):
        self.default_ttl = default_ttl_sec
        # key -> (value, expire_at)
        self.store: Dict[str, Tuple[Any, float]] = {}

    def set(self, key: str, val: Any, ttl_sec: float = None) -> None:
        ttl = ttl_sec if ttl_sec is not None else self.default_ttl
        self.store[key] = (val, time.time() + ttl)

    def get(self, key: str) -> Optional[Any]:
        if key not in self.store:
            return None
        val, expire_at = self.store[key]
        if time.time() > expire_at:
            del self.store[key] # Lazy eviction
            return None
        return val
'''
        },
        "test_suite": {
            "exercise_about": "Build TTL expiration caching with lazy eviction.",
            "exercise_goal": "Implement `TTLCache`.",
            "expected_output": "Return value before TTL and None after expiration.",
            "tests.py": '''import pytest
import time
from solution import TTLCache

def test_ttl_cache():
    cache = TTLCache(default_ttl_sec=10.0)
    cache.set("live_key", "hello")
    assert cache.get("live_key") == "hello"
    
    cache.set("expired_key", "bye", ttl_sec=-1.0) # expired immediately
    assert cache.get("expired_key") is None
'''
        }
    },
    "node-3-37": {
        "title": "Lesson 5.37: Cache Invalidation Strategies",
        "handbook_markdown": r"""# Lesson 5.37: Cache Invalidation Strategies

Cache patterns:
- **Write-Through**: Write to cache and database synchronously.
- **Write-Behind (Write-Back)**: Write to cache first, batch write to database asynchronously.
- **Cache-Aside (Lazy Loading)**: Read cache on miss, fetch DB and populate cache.
""",
        "starter_code": {
            "solution.py": '''"""
Cache Invalidation Strategies
Implement Cache-Aside reading pattern.
"""

from typing import Dict, Callable, Any

def get_or_load_cache_aside(
    key: str,
    cache: Dict[str, Any],
    db_loader: Callable[[str], Any]
) -> Any:
    """If key in cache return cache[key], else load from db_loader, save to cache, and return."""
    if key in cache:
        return cache[key]
    val = db_loader(key)
    cache[key] = val
    return val
'''
        },
        "test_suite": {
            "exercise_about": "Implement Cache-Aside database loading pattern.",
            "exercise_goal": "Implement `get_or_load_cache_aside(key, cache, db_loader)`.",
            "expected_output": "Populate cache on miss and serve from cache on hit.",
            "tests.py": '''import pytest
from solution import get_or_load_cache_aside

def test_cache_aside():
    cache = {}
    load_count = 0
    def db_loader(k):
        nonlocal load_count
        load_count += 1
        return f"db_{k}"
        
    val1 = get_or_load_cache_aside("user_1", cache, db_loader)
    assert val1 == "db_user_1"
    assert load_count == 1
    
    val2 = get_or_load_cache_aside("user_1", cache, db_loader)
    assert val2 == "db_user_1"
    assert load_count == 1 # Served from cache!
'''
        }
    },
    "node-3-38": {
        "title": "Lesson 5.38: Cache Stampede Prevention",
        "handbook_markdown": r"""# Lesson 5.38: Cache Stampede Prevention

When a hot cache key expires, thousands of concurrent requests hit the database simultaneously (**Thundering Herd**).
**Probabilistic Early Expiration (XFetch)** recomputes the cache item before it expires based on compute time $\beta \cdot \delta \cdot \ln(\text{rand}())$.
""",
        "starter_code": {
            "solution.py": '''"""
Cache Stampede Prevention
Determine whether to trigger probabilistic early refresh.
"""

import math
import random

def should_early_refresh(expiry_time: float, delta_compute_time: float, beta: float = 1.0) -> bool:
    """Return True if time.time() - delta * beta * log(random()) > expiry_time."""
    # Simplified deterministic test proxy: if remaining time < delta * beta
    import time
    return (expiry_time - time.time()) < (delta_compute_time * beta)
'''
        },
        "test_suite": {
            "exercise_about": "Understand Cache Stampede mitigation using early refresh heuristics.",
            "exercise_goal": "Implement `should_early_refresh(expiry_time, delta_compute_time, beta)`.",
            "expected_output": "Trigger early recomputation when close to expiry.",
            "tests.py": '''import pytest
import time
from solution import should_early_refresh

def test_early_refresh():
    now = time.time()
    # 0.5s remaining, compute takes 1.0s -> trigger refresh
    assert should_early_refresh(now + 0.5, delta_compute_time=1.0) is True
    # 10s remaining, compute takes 1.0s -> do not trigger
    assert should_early_refresh(now + 10.0, delta_compute_time=1.0) is False
'''
        }
    },
    "node-3-39": {
        "title": "Lesson 5.39: Tiered Caching: L1 RAM + L2 SSD",
        "handbook_markdown": r"""# Lesson 5.39: Tiered Caching: L1 RAM + L2 SSD

Multi-level tiered caching serves hot items from ultra-fast L1 in-memory cache and falls back to larger L2 disk/SSD cache.
""",
        "starter_code": {
            "solution.py": '''"""
Tiered Caching: L1 RAM + L2 SSD
Two-tier cache hierarchy lookup.
"""

from typing import Dict, Any, Optional

class TieredCache:
    def __init__(self):
        self.l1_ram: Dict[str, Any] = {}
        self.l2_ssd: Dict[str, Any] = {}

    def get(self, key: str) -> Optional[Any]:
        if key in self.l1_ram:
            return self.l1_ram[key]
        if key in self.l2_ssd:
            val = self.l2_ssd[key]
            self.l1_ram[key] = val # Promote to L1
            return val
        return None
'''
        },
        "test_suite": {
            "exercise_about": "Build two-tier L1 RAM / L2 SSD caching with promotion.",
            "exercise_goal": "Implement `TieredCache`.",
            "expected_output": "Promote L2 items to L1 upon retrieval.",
            "tests.py": '''import pytest
from solution import TieredCache

def test_tiered_cache():
    tc = TieredCache()
    tc.l2_ssd["doc_1"] = "content"
    assert "doc_1" not in tc.l1_ram
    assert tc.get("doc_1") == "content"
    assert "doc_1" in tc.l1_ram # Promoted!
'''
        }
    },
    "node-3-40": {
        "title": "Lesson 5.40: Binary Search Trees (BST)",
        "handbook_markdown": r"""# Lesson 5.40: Binary Search Trees (BST)

A **Binary Search Tree (BST)** maintains the invariant: left child $<$ parent $<$ right child.
In-order traversal visits nodes in sorted order.
""",
        "starter_code": {
            "solution.py": '''"""
Binary Search Trees (BST)
Search a binary search tree.
"""

class BSTNode:
    def __init__(self, val: int):
        self.val = val
        self.left = None
        self.right = None

def bst_search(root: BSTNode, target: int) -> bool:
    curr = root
    while curr:
        if curr.val == target:
            return True
        elif target < curr.val:
            curr = curr.left
        else:
            curr = curr.right
    return False
'''
        },
        "test_suite": {
            "exercise_about": "Implement Binary Search Tree search.",
            "exercise_goal": "Implement `bst_search(root, target)`.",
            "expected_output": "Search BST in O(height) time.",
            "tests.py": '''import pytest
from solution import BSTNode, bst_search

def test_bst_search():
    root = BSTNode(10)
    root.left = BSTNode(5)
    root.right = BSTNode(15)
    assert bst_search(root, 15) is True
    assert bst_search(root, 7) is False
'''
        }
    },
    "node-3-41": {
        "title": "Lesson 5.41: Prefix Tries for Token Vocabularies",
        "handbook_markdown": r"""# Lesson 5.41: Prefix Tries for Token Vocabularies

Prefix Tries store token vocabularies for tokenizer longest-prefix matching.
""",
        "starter_code": {
            "solution.py": '''"""
Prefix Tries for Token Vocabularies
Find longest matching prefix in trie.
"""

from typing import List, Set

def find_longest_prefix(text: str, vocab: Set[str]) -> str:
    """Find longest prefix of text present in vocab."""
    longest = ""
    for i in range(1, len(text) + 1):
        prefix = text[:i]
        if prefix in vocab:
            longest = prefix
    return longest
'''
        },
        "test_suite": {
            "exercise_about": "Find longest token prefixes in vocabulary sets.",
            "exercise_goal": "Implement `find_longest_prefix(text, vocab)`.",
            "expected_output": "Return longest matching prefix string.",
            "tests.py": '''import pytest
from solution import find_longest_prefix

def test_longest_prefix():
    vocab = {"t", "th", "the", "then"}
    assert find_longest_prefix("there", vocab) == "the"
'''
        }
    },
    "node-3-42": {
        "title": "Lesson 5.42: Radix Trees & Path Compaction",
        "handbook_markdown": r"""# Lesson 5.42: Radix Trees & Path Compaction

**Radix Trees (Patricia Tries)** merge single-child node chains into compressed multi-character edge labels, cutting memory by 50%.
""",
        "starter_code": {
            "solution.py": '''"""
Radix Trees & Path Compaction
Calculate string common prefix length.
"""

def common_prefix_length(s1: str, s2: str) -> int:
    """Return number of matching leading characters between s1 and s2."""
    length = 0
    for c1, c2 in zip(s1, s2):
        if c1 != c2:
            break
        length += 1
    return length
'''
        },
        "test_suite": {
            "exercise_about": "Understand path compaction common prefix calculations in Radix trees.",
            "exercise_goal": "Implement `common_prefix_length(s1, s2)`.",
            "expected_output": "Compute common prefix length.",
            "tests.py": '''import pytest
from solution import common_prefix_length

def test_common_prefix():
    assert common_prefix_length("router", "route") == 5
    assert common_prefix_length("apple", "banana") == 0
'''
        }
    },
    "node-3-43": {
        "title": "Lesson 5.43: Segment Trees for Range Queries",
        "handbook_markdown": r"""# Lesson 5.43: Segment Trees for Range Queries

**Segment Trees** support both range queries and point updates in $O(\log N)$ time.
""",
        "starter_code": {
            "solution.py": '''"""
Segment Trees for Range Queries
Compute range minimum over interval.
"""

from typing import List

def range_minimum_query(nums: List[int], left: int, right: int) -> int:
    """Return min(nums[left..right]) inclusive."""
    return min(nums[left:right + 1])
'''
        },
        "test_suite": {
            "exercise_about": "Understand range minimum queries (RMQ).",
            "exercise_goal": "Implement `range_minimum_query(nums, left, right)`.",
            "expected_output": "Return minimum element in range.",
            "tests.py": '''import pytest
from solution import range_minimum_query

def test_rmq():
    nums = [5, 2, 8, 1, 9, 3]
    assert range_minimum_query(nums, 0, 2) == 2 # min(5, 2, 8)
    assert range_minimum_query(nums, 1, 4) == 1 # min(2, 8, 1, 9)
'''
        }
    },
    "node-3-44": {
        "title": "Lesson 5.44: Fenwick Trees (Binary Indexed)",
        "handbook_markdown": r"""# Lesson 5.44: Fenwick Trees (Binary Indexed)

A **Fenwick Tree (BIT)** computes prefix sums and updates in $O(\log N)$ time using the lowest set bit trick `i & (-i)`.
""",
        "starter_code": {
            "solution.py": '''"""
Fenwick Trees (Binary Indexed)
Calculate lowest set bit step index.
"""

def fenwick_lowest_set_bit(i: int) -> int:
    """Return isolated lowest set bit: i & (-i)."""
    return i & (-i)
'''
        },
        "test_suite": {
            "exercise_about": "Understand Fenwick tree binary index stepping.",
            "exercise_goal": "Implement `fenwick_lowest_set_bit(i)`.",
            "expected_output": "Isolate rightmost set bit.",
            "tests.py": '''import pytest
from solution import fenwick_lowest_set_bit

def test_fenwick_step():
    assert fenwick_lowest_set_bit(12) == 4 # 1100b -> 0100b (4)
    assert fenwick_lowest_set_bit(6) == 2  # 0110b -> 0010b (2)
'''
        }
    },
    "node-3-45": {
        "title": "Lesson 5.45: Interval Trees & Overlap Detection",
        "handbook_markdown": r"""# Lesson 5.45: Interval Trees & Overlap Detection

Two intervals $[a_1, b_1]$ and $[a_2, b_2]$ overlap if and only if:
$$\max(a_1, a_2) \le \min(b_1, b_2)$$
""",
        "starter_code": {
            "solution.py": '''"""
Interval Trees & Overlap Detection
Detect overlap between two time intervals.
"""

from typing import Tuple

def do_intervals_overlap(int1: Tuple[float, float], int2: Tuple[float, float]) -> bool:
    """Return True if intervals [start1, end1] and [start2, end2] overlap."""
    return max(int1[0], int2[0]) <= min(int1[1], int2[1])
'''
        },
        "test_suite": {
            "exercise_about": "Determine overlapping time and token intervals.",
            "exercise_goal": "Implement `do_intervals_overlap(int1, int2)`.",
            "expected_output": "Return True for overlapping intervals and False for disjoint intervals.",
            "tests.py": '''import pytest
from solution import do_intervals_overlap

def test_interval_overlap():
    assert do_intervals_overlap((1.0, 5.0), (3.0, 7.0)) is True
    assert do_intervals_overlap((1.0, 3.0), (4.0, 8.0)) is False
'''
        }
    },
    "node-3-46": {
        "title": "Lesson 5.46: Breadth-First Search (BFS)",
        "handbook_markdown": r"""# Lesson 5.46: Breadth-First Search (BFS)

**BFS** explores neighbors level-by-level using a FIFO queue, finding shortest path in unweighted graphs in $O(V + E)$ time.
""",
        "starter_code": {
            "solution.py": '''"""
Breadth-First Search (BFS)
Traverse graph in BFS level order.
"""

from typing import Dict, List
from collections import deque

def bfs_traversal(graph: Dict[str, List[str]], start_node: str) -> List[str]:
    """Return list of visited nodes in BFS level order."""
    visited = set([start_node])
    queue = deque([start_node])
    order = []
    while queue:
        u = queue.popleft()
        order.append(u)
        for v in graph.get(u, []):
            if v not in visited:
                visited.add(v)
                queue.append(v)
    return order
'''
        },
        "test_suite": {
            "exercise_about": "Implement Breadth-First Search level traversal.",
            "exercise_goal": "Implement `bfs_traversal(graph, start_node)`.",
            "expected_output": "Return nodes in BFS order.",
            "tests.py": '''import pytest
from solution import bfs_traversal

def test_bfs():
    graph = {
        "A": ["B", "C"],
        "B": ["D"],
        "C": [],
        "D": []
    }
    assert bfs_traversal(graph, "A") == ["A", "B", "C", "D"]
'''
        }
    },
    "node-3-47": {
        "title": "Lesson 5.47: Depth-First Search (DFS) & Reasoning",
        "handbook_markdown": r"""# Lesson 5.47: Depth-First Search (DFS) & Reasoning

**DFS** traverses down tree branches until backtracking, used in reasoning tree exploration (Tree-of-Thoughts).
""",
        "starter_code": {
            "solution.py": '''"""
Depth-First Search (DFS) & Reasoning
Traverse graph using recursive DFS.
"""

from typing import Dict, List, Set

def dfs_traversal(graph: Dict[str, List[str]], start_node: str) -> List[str]:
    """Return list of visited nodes in DFS depth order."""
    order = []
    visited: Set[str] = set()
    def dfs(u):
        visited.add(u)
        order.append(u)
        for v in graph.get(u, []):
            if v not in visited:
                dfs(v)
    dfs(start_node)
    return order
'''
        },
        "test_suite": {
            "exercise_about": "Implement Depth-First Search for tree exploration.",
            "exercise_goal": "Implement `dfs_traversal(graph, start_node)`.",
            "expected_output": "Return nodes in DFS order.",
            "tests.py": '''import pytest
from solution import dfs_traversal

def test_dfs():
    graph = {
        "A": ["B", "C"],
        "B": ["D"],
        "C": [],
        "D": []
    }
    assert dfs_traversal(graph, "A") == ["A", "B", "D", "C"]
'''
        }
    },
    "node-3-48": {
        "title": "Lesson 5.48: Dijkstras Cost-Optimized Routing",
        "handbook_markdown": r"""# Lesson 5.48: Dijkstras Cost-Optimized Routing

Routing requests across multiple LLM providers to minimize latency and token pricing.
""",
        "starter_code": {
            "solution.py": '''"""
Dijkstras Cost-Optimized Routing
Find lowest cost provider route.
"""

from typing import Dict, List, Tuple
import heapq

def pick_cheapest_provider(providers: Dict[str, float]) -> str:
    """Return provider name with minimum cost per token."""
    return min(providers.items(), key=lambda x: x[1])[0]
'''
        },
        "test_suite": {
            "exercise_about": "Cost-optimized routing selection.",
            "exercise_goal": "Implement `pick_cheapest_provider(providers)`.",
            "expected_output": "Return lowest cost provider.",
            "tests.py": '''import pytest
from solution import pick_cheapest_provider

def test_cheapest_provider():
    rates = {"provider_a": 0.002, "provider_b": 0.0005, "provider_c": 0.001}
    assert pick_cheapest_provider(rates) == "provider_b"
'''
        }
    },
    "node-3-49": {
        "title": "Lesson 5.49: A* Search for Agent Planning",
        "handbook_markdown": r"""# Lesson 5.49: A* Search for Agent Planning

**A* Search** guides graph exploration with an admissible heuristic:
$$f(n) = g(n) + h(n)$$
- $g(n)$: Exact cost from start to node $n$.
- $h(n)$: Estimated heuristic distance from $n$ to goal.
""",
        "starter_code": {
            "solution.py": '''"""
A* Search for Agent Planning
Calculate A* evaluation function f(n) = g(n) + h(n).
"""

def calculate_a_star_f_score(g_cost: float, h_heuristic: float) -> float:
    return g_cost + h_heuristic
'''
        },
        "test_suite": {
            "exercise_about": "Understand A* search heuristic evaluation scoring.",
            "exercise_goal": "Implement `calculate_a_star_f_score(g_cost, h_heuristic)`.",
            "expected_output": "Compute exact f(n) priority score.",
            "tests.py": '''import pytest
from solution import calculate_a_star_f_score

def test_a_star_score():
    assert calculate_a_star_f_score(10.0, 5.0) == 15.0
'''
        }
    },
    "node-3-50": {
        "title": "Lesson 5.50: Capstone: SemanticCache — In-Memory Token Buffer & High-Speed LRU Engine",
        "handbook_markdown": r"""# Lesson 5.50: Capstone: SemanticCache — In-Memory Token Buffer & High-Speed LRU Engine

Congratulations on completing Module 5!

In this capstone, you will assemble **SemanticCache** — an enterprise in-memory response cache combining:
1. **$O(1)$ LRU Eviction**: Bounded memory capacity with least-recently-used eviction.
2. **TTL Expiration**: Automatic lazy invalidation of expired responses.
3. **Prefix Query Normalization**: Trimming and case-folding prompt queries.
""",
        "starter_code": {
            "solution.py": '''"""
Capstone: SemanticCache — In-Memory Token Buffer & High-Speed LRU Engine
A production in-memory response cache combining LRU eviction and TTL expiration.
"""

from collections import OrderedDict
import time
from typing import Any, Optional, Dict, Tuple

class SemanticCache:
    def __init__(self, capacity: int = 100, default_ttl_sec: float = 300.0):
        self.capacity = capacity
        self.default_ttl = default_ttl_sec
        # key -> (value, expire_timestamp)
        self.cache: OrderedDict[str, Tuple[Any, float]] = OrderedDict()

    def _normalize(self, query: str) -> str:
        return query.strip().lower()

    def get(self, query: str) -> Optional[Any]:
        """Look up response for query. Evict if expired or return value."""
        key = self._normalize(query)
        if key not in self.cache:
            return None
        val, expire_at = self.cache[key]
        if time.time() > expire_at:
            del self.cache[key]
            return None
        self.cache.move_to_end(key)
        return val

    def put(self, query: str, response: Any, ttl_sec: Optional[float] = None) -> None:
        """Save response for query with TTL and maintain capacity limit."""
        key = self._normalize(query)
        ttl = ttl_sec if ttl_sec is not None else self.default_ttl
        expire_at = time.time() + ttl
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = (response, expire_at)
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)
'''
        },
        "test_suite": {
            "exercise_about": "Capstone Project: Build SemanticCache, an in-memory LLM response caching engine combining LRU eviction, TTL invalidation, and normalized query lookup.",
            "exercise_goal": "Implement `SemanticCache` with `get()` and `put()`.",
            "expected_output": "Normalize queries, evict least recently used entries on capacity, and invalidate expired TTL responses.",
            "tests.py": '''import pytest
from solution import SemanticCache

def test_semantic_cache_capstone():
    sc = SemanticCache(capacity=2, default_ttl_sec=60.0)
    sc.put("What is AI?", "Artificial Intelligence")
    sc.put("What is ML?", "Machine Learning")
    
    # Normalized case-insensitive lookup
    assert sc.get("  what is ai?  ") == "Artificial Intelligence"
    
    # Capacity eviction: "What is ML?" was least recently used
    sc.put("What is LLM?", "Large Language Model")
    assert sc.get("What is ML?") is None
    assert sc.get("What is AI?") == "Artificial Intelligence"
    assert sc.get("What is LLM?") == "Large Language Model"
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 5 (node-3-26 to node-3-50)...")
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
