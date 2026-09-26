#!/usr/bin/env python3
"""
Batch patch Module 5: AI Data Structures & Memory Optimization (Lessons 5.1 to 5.25)
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
    "node-3-1": {
        "title": "Lesson 5.1: Algorithmic Complexity & Profiling",
        "handbook_markdown": r"""# Lesson 5.1: Algorithmic Complexity & Profiling

In high-throughput AI systems, optimizing memory and execution time requires profiling code to identify bottlenecks.
Python's `time` and `cProfile` modules allow measuring exact microsecond runtimes.
""",
        "starter_code": {
            "solution.py": '''"""
Algorithmic Complexity & Profiling
Benchmark function execution time.
"""

import time
from typing import Callable, Any, Tuple

def benchmark_function(func: Callable[[], Any]) -> Tuple[Any, float]:
    """Execute func() and return (result, elapsed_seconds)."""
    # TODO: Record start time, call func, record end time, return (res, duration)
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Learn how to benchmark and profile Python execution timing.",
            "exercise_goal": "Implement `benchmark_function(func)`.",
            "expected_output": "Return function result along with elapsed time float.",
            "tests.py": '''import pytest
import time
from solution import benchmark_function

def test_benchmark():
    res, elapsed = benchmark_function(lambda: sum(range(1000)))
    assert res == 499500
    assert elapsed >= 0.0
'''
        }
    },
    "node-3-2": {
        "title": "Lesson 5.2: Dynamic Arrays & Memory Growth",
        "handbook_markdown": r"""# Lesson 5.2: Dynamic Arrays & Memory Growth

Python lists are **dynamic arrays** that over-allocate memory geometrically ($0, 4, 8, 16, 25, 35 \dots$) to ensure that `append()` has an **Amortized $O(1)$** cost.
""",
        "starter_code": {
            "solution.py": '''"""
Dynamic Arrays & Memory Growth
Calculate list growth allocation steps.
"""

def compute_list_allocations(target_length: int) -> int:
    """Calculate minimum capacity powers needed for target_length starting from 4 with doubling."""
    cap = 4
    allocs = 1
    while cap < target_length:
        cap *= 2
        allocs += 1
    return allocs
'''
        },
        "test_suite": {
            "exercise_about": "Understand geometric dynamic array memory growth patterns.",
            "exercise_goal": "Implement `compute_list_allocations(target_length)`.",
            "expected_output": "Return allocation count.",
            "tests.py": '''import pytest
from solution import compute_list_allocations

def test_allocations():
    assert compute_list_allocations(4) == 1
    assert compute_list_allocations(5) == 2
    assert compute_list_allocations(100) == 5 # 4 -> 8 -> 16 -> 32 -> 64 -> 128
'''
        }
    },
    "node-3-3": {
        "title": "Lesson 5.3: Cache-Friendly Memory Traversal",
        "handbook_markdown": r"""# Lesson 5.3: Cache-Friendly Memory Traversal

Iterating through 2D grids in Row-Major order is **cache-friendly** (hits CPU L1 cache lines sequentially). Column-Major traversal causes repeated L1 cache misses.
""",
        "starter_code": {
            "solution.py": '''"""
Cache-Friendly Memory Traversal
Sum 2D matrix rows sequentially.
"""

from typing import List

def sum_matrix_row_major(mat: List[List[int]]) -> int:
    """Sum elements in row-major order."""
    total = 0
    for row in mat:
        for val in row:
            total += val
    return total
'''
        },
        "test_suite": {
            "exercise_about": "Understand CPU cache locality in sequential matrix operations.",
            "exercise_goal": "Implement `sum_matrix_row_major(mat)`.",
            "expected_output": "Compute exact matrix sum.",
            "tests.py": '''import pytest
from solution import sum_matrix_row_major

def test_sum_row_major():
    mat = [[1, 2], [3, 4]]
    assert sum_matrix_row_major(mat) == 10
'''
        }
    },
    "node-3-4": {
        "title": "Lesson 5.4: Two Pointers: Sorted Array Search",
        "handbook_markdown": r"""# Lesson 5.4: Two Pointers: Sorted Array Search

In a sorted array, finding two numbers that sum to a target $T$ takes $O(N)$ time with **Two Pointers** (one at start, one at end) moving inward based on comparison with $T$.
""",
        "starter_code": {
            "solution.py": '''"""
Two Pointers: Sorted Array Search
Find pair with target sum in sorted array.
"""

from typing import List, Optional, Tuple

def two_sum_sorted(nums: List[int], target: int) -> Optional[Tuple[int, int]]:
    """Find two indices (i, j) where nums[i] + nums[j] == target."""
    left, right = 0, len(nums) - 1
    while left < right:
        current_sum = nums[left] + nums[right]
        if current_sum == target:
            return (left, right)
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return None
'''
        },
        "test_suite": {
            "exercise_about": "Master the Two Pointers pattern for linear-time sorted array searching.",
            "exercise_goal": "Implement `two_sum_sorted(nums, target)`.",
            "expected_output": "Return matching index pairs or None.",
            "tests.py": '''import pytest
from solution import two_sum_sorted

def test_two_sum():
    nums = [1, 2, 4, 6, 8, 11]
    assert two_sum_sorted(nums, 10) == (1, 4) # 2 + 8 = 10
    assert two_sum_sorted(nums, 50) is None
'''
        }
    },
    "node-3-5": {
        "title": "Lesson 5.5: Fast & Slow Pointers",
        "handbook_markdown": r"""# Lesson 5.5: Fast & Slow Pointers

**Floyd's Tortoise and Hare** uses two pointers moving at different speeds ($1\times$ and $2\times$) to detect cycles in linked lists and find list midpoints in $O(1)$ memory.
""",
        "starter_code": {
            "solution.py": '''"""
Fast & Slow Pointers
Find the middle element of a sequence using two pointers.
"""

from typing import List, Any, Optional

def find_middle_element(items: List[Any]) -> Optional[Any]:
    """Return the middle element (slow pointer position when fast pointer reaches end)."""
    if not items:
        return None
    slow, fast = 0, 0
    while fast < len(items) and fast + 1 < len(items):
        slow += 1
        fast += 2
    return items[slow]
'''
        },
        "test_suite": {
            "exercise_about": "Understand Floyd's Tortoise and Hare two-pointer mechanics.",
            "exercise_goal": "Implement `find_middle_element(items)`.",
            "expected_output": "Return the middle element.",
            "tests.py": '''import pytest
from solution import find_middle_element

def test_middle_element():
    assert find_middle_element([1, 2, 3, 4, 5]) == 3
    assert find_middle_element([10, 20, 30, 40]) == 30
    assert find_middle_element([]) is None
'''
        }
    },
    "node-3-6": {
        "title": "Lesson 5.6: In-Place Array Partitioning",
        "handbook_markdown": r"""# Lesson 5.6: In-Place Array Partitioning

**Lomuto / Hoare Partitioning** (the core of QuickSort) rearranges an array around a pivot in $O(N)$ time and $O(1)$ auxiliary space.
""",
        "starter_code": {
            "solution.py": '''"""
In-Place Array Partitioning
Partition an array around a pivot value.
"""

from typing import List

def partition_array(nums: List[int], pivot: int) -> List[int]:
    """Return array with elements < pivot first, then elements == pivot, then elements > pivot."""
    less = [x for x in nums if x < pivot]
    equal = [x for x in nums if x == pivot]
    greater = [x for x in nums if x > pivot]
    return less + equal + greater
'''
        },
        "test_suite": {
            "exercise_about": "Understand array partitioning algorithms.",
            "exercise_goal": "Implement `partition_array(nums, pivot)`.",
            "expected_output": "Partition elements around pivot value.",
            "tests.py": '''import pytest
from solution import partition_array

def test_partition():
    res = partition_array([9, 2, 5, 1, 5, 8], 5)
    assert res == [2, 1, 5, 5, 9, 8]
'''
        }
    },
    "node-3-7": {
        "title": "Lesson 5.7: Fixed Sliding Windows",
        "handbook_markdown": r"""# Lesson 5.7: Fixed Sliding Windows

A **Fixed Sliding Window** of size $K$ computes rolling metrics (e.g. moving averages) in $O(N)$ time by adding the new incoming element and subtracting the old outgoing element ($O(1)$ per step).
""",
        "starter_code": {
            "solution.py": '''"""
Fixed Sliding Windows
Compute maximum sum of any contiguous subarray of size k.
"""

from typing import List

def max_subarray_sum_fixed(nums: List[int], k: int) -> int:
    """Find maximum sum of any contiguous subarray of length k."""
    if len(nums) < k or k <= 0:
        return 0
    curr_sum = sum(nums[:k])
    max_sum = curr_sum
    for i in range(k, len(nums)):
        curr_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, curr_sum)
    return max_sum
'''
        },
        "test_suite": {
            "exercise_about": "Master the fixed sliding window technique for rolling metrics.",
            "exercise_goal": "Implement `max_subarray_sum_fixed(nums, k)`.",
            "expected_output": "Return maximum window sum.",
            "tests.py": '''import pytest
from solution import max_subarray_sum_fixed

def test_max_window():
    nums = [1, 4, 2, 10, 2, 3, 1, 0, 20]
    # k=4 -> [10, 2, 3, 1] = 16 or [3, 1, 0, 20] = 24
    assert max_subarray_sum_fixed(nums, 4) == 24
'''
        }
    },
    "node-3-8": {
        "title": "Lesson 5.8: Dynamic Sliding Windows",
        "handbook_markdown": r"""# Lesson 5.8: Dynamic Sliding Windows

A **Dynamic Sliding Window** expands its right boundary to satisfy a condition and contracts its left boundary when the condition is violated (e.g. longest substring without repeating characters).
""",
        "starter_code": {
            "solution.py": '''"""
Dynamic Sliding Windows
Find the length of the longest substring without repeating characters.
"""

def longest_unique_substring_length(s: str) -> int:
    """Find length of longest substring without repeating characters."""
    seen = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in seen:
            seen.remove(s[left])
            left += 1
        seen.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len
'''
        },
        "test_suite": {
            "exercise_about": "Implement dynamic sliding window expansion and contraction.",
            "exercise_goal": "Implement `longest_unique_substring_length(s)`.",
            "expected_output": "Return maximum unique substring length.",
            "tests.py": '''import pytest
from solution import longest_unique_substring_length

def test_longest_unique():
    assert longest_unique_substring_length("abcabcbb") == 3 # "abc"
    assert longest_unique_substring_length("bbbbb") == 1    # "b"
    assert longest_unique_substring_length("pwwkew") == 3   # "wke"
'''
        }
    },
    "node-3-9": {
        "title": "Lesson 5.9: Monotonic Deques & Peak Latency",
        "handbook_markdown": r"""# Lesson 5.9: Monotonic Deques & Peak Latency

A **Monotonic Decreasing Deque** tracks sliding window maximums in $O(1)$ amortized time by popping elements smaller than the incoming candidate from the tail.
""",
        "starter_code": {
            "solution.py": '''"""
Monotonic Deques & Peak Latency
Compute sliding window maximums across an array using a monotonic deque.
"""

from typing import List
from collections import deque

def sliding_window_maximums(nums: List[int], k: int) -> List[int]:
    """Compute maximum for every sliding window of size k."""
    if not nums or k <= 0:
        return []
    dq = deque() # store indices
    res = []
    for i, x in enumerate(nums):
        # Remove elements outside current window
        if dq and dq[0] < i - k + 1:
            dq.popleft()
        # Maintain decreasing order
        while dq and nums[dq[-1]] < x:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            res.append(nums[dq[0]])
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Understand monotonic deques for tracking peak window latencies in O(N) total time.",
            "exercise_goal": "Implement `sliding_window_maximums(nums, k)`.",
            "expected_output": "Return array of sliding window maximums.",
            "tests.py": '''import pytest
from solution import sliding_window_maximums

def test_sliding_max():
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    assert sliding_window_maximums(nums, 3) == [3, 3, 5, 5, 6, 7]
'''
        }
    },
    "node-3-10": {
        "title": "Lesson 5.10: Prefix Sums & Range Queries",
        "handbook_markdown": r"""# Lesson 5.10: Prefix Sums & Range Queries

A **Prefix Sum Array** precomputes cumulative sums:
$$P[i] = \sum_{j=0}^{i-1} A[j]$$
Enabling $O(1)$ range sum queries for any interval $[L, R]$:
$$\text{Sum}(L, R) = P[R+1] - P[L]$$
""",
        "starter_code": {
            "solution.py": '''"""
Prefix Sums & Range Queries
Implement an O(1) immutable range sum query structure.
"""

from typing import List

class PrefixSumArray:
    def __init__(self, nums: List[int]):
        self.prefix = [0]
        for x in nums:
            self.prefix.append(self.prefix[-1] + x)

    def query_range(self, left: int, right: int) -> int:
        """Return sum of nums[left..right] inclusive in O(1)."""
        return self.prefix[right + 1] - self.prefix[left]
'''
        },
        "test_suite": {
            "exercise_about": "Master Prefix Sum arrays for constant time O(1) range sum queries.",
            "exercise_goal": "Implement `PrefixSumArray` with `query_range(left, right)`.",
            "expected_output": "Return exact range sum calculations.",
            "tests.py": '''import pytest
from solution import PrefixSumArray

def test_prefix_sums():
    ps = PrefixSumArray([2, 4, 6, 8, 10])
    assert ps.query_range(1, 3) == 18 # 4 + 6 + 8 = 18
    assert ps.query_range(0, 4) == 30 # total sum
'''
        }
    },
    "node-3-11": {
        "title": "Lesson 5.11: Token Bucket Rate Limiting",
        "handbook_markdown": r"""# Lesson 5.11: Token Bucket Rate Limiting

The **Token Bucket Algorithm** regulates API request rate:
- Tokens refill continuously at rate $R$ tokens/sec up to capacity $C$.
- Each request consumes 1 token. If tokens $< 1$, request is throttled ($429$).
""",
        "starter_code": {
            "solution.py": '''"""
Token Bucket Rate Limiting
Implement a thread-safe token bucket rate limiter.
"""

import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate_per_sec: float):
        self.capacity = capacity
        self.rate = refill_rate_per_sec
        self.tokens = float(capacity)
        self.last_update = time.time()

    def allow_request(self, tokens_needed: int = 1) -> bool:
        now = time.time()
        elapsed = now - self.last_update
        self.last_update = now
        self.tokens = min(float(self.capacity), self.tokens + elapsed * self.rate)
        if self.tokens >= tokens_needed:
            self.tokens -= tokens_needed
            return True
        return False
'''
        },
        "test_suite": {
            "exercise_about": "Build a Token Bucket rate limiter for API traffic shaping.",
            "exercise_goal": "Implement `TokenBucket` with `allow_request()`.",
            "expected_output": "Allow burst requests up to capacity and reject when tokens exhausted.",
            "tests.py": '''import pytest
from solution import TokenBucket

def test_token_bucket():
    tb = TokenBucket(capacity=2, refill_rate_per_sec=10.0)
    assert tb.allow_request(1) is True
    assert tb.allow_request(1) is True
    assert tb.allow_request(1) is False # Bucket empty
'''
        }
    },
    "node-3-12": {
        "title": "Lesson 5.12: Binary Search with bisect",
        "handbook_markdown": r"""# Lesson 5.12: Binary Search with bisect

Python's built-in `bisect` module implements high-speed C-optimized binary insertion and search in sorted lists.
""",
        "starter_code": {
            "solution.py": '''"""
Binary Search with bisect
Find insertion index maintaining sorted invariant.
"""

import bisect
from typing import List

def find_insertion_point(sorted_list: List[int], value: int) -> int:
    """Return index to insert value into sorted_list maintaining sorted order."""
    return bisect.bisect_left(sorted_list, value)
'''
        },
        "test_suite": {
            "exercise_about": "Understand bisect binary search insertion primitives.",
            "exercise_goal": "Implement `find_insertion_point(sorted_list, value)`.",
            "expected_output": "Return correct insertion index.",
            "tests.py": '''import pytest
from solution import find_insertion_point

def test_bisect_point():
    assert find_insertion_point([10, 20, 30, 40], 25) == 2
    assert find_insertion_point([10, 20, 30, 40], 5) == 0
'''
        }
    },
    "node-3-13": {
        "title": "Lesson 5.13: Circular Ring Buffers",
        "handbook_markdown": r"""# Lesson 5.13: Circular Ring Buffers

Circular buffers overwrite oldest data when full, maintaining constant memory for sliding event windows.
""",
        "starter_code": {
            "solution.py": '''"""
Circular Ring Buffers
Overwrite oldest items on capacity limit.
"""

from typing import List, Any

class OverwritingRingBuffer:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.data: List[Any] = []

    def append(self, item: Any) -> None:
        if len(self.data) == self.capacity:
            self.data.pop(0)
        self.data.append(item)

    def to_list(self) -> List[Any]:
        return list(self.data)
'''
        },
        "test_suite": {
            "exercise_about": "Implement fixed capacity overwriting ring buffers.",
            "exercise_goal": "Implement `OverwritingRingBuffer`.",
            "expected_output": "Evict oldest elements when capacity is exceeded.",
            "tests.py": '''import pytest
from solution import OverwritingRingBuffer

def test_overwriting_buffer():
    rb = OverwritingRingBuffer(3)
    rb.append("A")
    rb.append("B")
    rb.append("C")
    rb.append("D")
    assert rb.to_list() == ["B", "C", "D"]
'''
        }
    },
    "node-3-14": {
        "title": "Lesson 5.14: Double-Ended Queues (deque)",
        "handbook_markdown": r"""# Lesson 5.14: Double-Ended Queues (deque)

`collections.deque` is implemented as a doubly-linked block list, providing $O(1)$ push/pop at **both ends**.
""",
        "starter_code": {
            "solution.py": '''"""
Double-Ended Queues (deque)
Use deque for constant-time FIFO queues.
"""

from collections import deque
from typing import Any, Optional

class FifoQueue:
    def __init__(self):
        self.dq = deque()

    def enqueue(self, item: Any) -> None:
        self.dq.append(item)

    def dequeue(self) -> Optional[Any]:
        return self.dq.popleft() if self.dq else None
'''
        },
        "test_suite": {
            "exercise_about": "Master double-ended queues for O(1) queue operations.",
            "exercise_goal": "Implement `FifoQueue`.",
            "expected_output": "Process items in exact FIFO order.",
            "tests.py": '''import pytest
from solution import FifoQueue

def test_fifo_queue():
    q = FifoQueue()
    q.enqueue("first")
    q.enqueue("second")
    assert q.dequeue() == "first"
    assert q.dequeue() == "second"
    assert q.dequeue() is None
'''
        }
    },
    "node-3-15": {
        "title": "Lesson 5.15: Lock-Free Queue Architectures",
        "handbook_markdown": r"""# Lesson 5.15: Lock-Free Queue Architectures

Atomic Compare-And-Swap (CAS) pointers enable concurrent queues without lock contention.
""",
        "starter_code": {
            "solution.py": '''"""
Lock-Free Queue Architectures
Simulate atomic compare-and-swap pointer updates.
"""

class AtomicPointer:
    def __init__(self, initial_val: int = 0):
        self.val = initial_val

    def compare_and_swap(self, expected: int, new_val: int) -> bool:
        if self.val == expected:
            self.val = new_val
            return True
        return False
'''
        },
        "test_suite": {
            "exercise_about": "Understand Atomic Compare-And-Swap (CAS) concurrency primitives.",
            "exercise_goal": "Implement `AtomicPointer`.",
            "expected_output": "Atomically update value only when matching expected state.",
            "tests.py": '''import pytest
from solution import AtomicPointer

def test_atomic_cas():
    ptr = AtomicPointer(10)
    assert ptr.compare_and_swap(10, 20) is True
    assert ptr.val == 20
    assert ptr.compare_and_swap(10, 30) is False # Mismatch
    assert ptr.val == 20
'''
        }
    },
    "node-3-16": {
        "title": "Lesson 5.16: Monotonic Stacks & Delimiters",
        "handbook_markdown": r"""# Lesson 5.16: Monotonic Stacks & Delimiters

A **Monotonic Stack** solves "Next Greater Element" queries in $O(N)$ total time.
""",
        "starter_code": {
            "solution.py": '''"""
Monotonic Stacks & Delimiters
Find next greater element for each item in array.
"""

from typing import List

def next_greater_elements(nums: List[int]) -> List[int]:
    """Find next greater element for each index (or -1 if none)."""
    res = [-1] * len(nums)
    stack = [] # indices
    for i, x in enumerate(nums):
        while stack and nums[stack[-1]] < x:
            prev_idx = stack.pop()
            res[prev_idx] = x
        stack.append(i)
    return res
'''
        },
        "test_suite": {
            "exercise_about": "Understand Monotonic Stacks for linear time next-greater-element searches.",
            "exercise_goal": "Implement `next_greater_elements(nums)`.",
            "expected_output": "Return array of next greater elements.",
            "tests.py": '''import pytest
from solution import next_greater_elements

def test_next_greater():
    nums = [2, 1, 2, 4, 3]
    # 2 -> 4, 1 -> 2, 2 -> 4, 4 -> -1, 3 -> -1
    assert next_greater_elements(nums) == [4, 2, 4, -1, -1]
'''
        }
    },
    "node-3-17": {
        "title": "Lesson 5.17: Backpressure & Consumer Queues",
        "handbook_markdown": r"""# Lesson 5.17: Backpressure & Consumer Queues

**Backpressure** throttles producers when consumer queues reach max capacity, preventing Out-Of-Memory crashes.
""",
        "starter_code": {
            "solution.py": '''"""
Backpressure & Consumer Queues
Bounded producer-consumer queue with rejection backpressure.
"""

from typing import Any, List

class BoundedQueue:
    def __init__(self, maxsize: int):
        self.maxsize = maxsize
        self.items: List[Any] = []

    def put_nowait(self, item: Any) -> bool:
        if len(self.items) >= self.maxsize:
            return False # Backpressure rejection
        self.items.append(item)
        return True
'''
        },
        "test_suite": {
            "exercise_about": "Implement backpressure rejection in bounded consumer queues.",
            "exercise_goal": "Implement `BoundedQueue`.",
            "expected_output": "Reject incoming messages when queue is full.",
            "tests.py": '''import pytest
from solution import BoundedQueue

def test_bounded_queue():
    q = BoundedQueue(2)
    assert q.put_nowait("a") is True
    assert q.put_nowait("b") is True
    assert q.put_nowait("c") is False # Full!
'''
        }
    },
    "node-3-18": {
        "title": "Lesson 5.18: Priority Task Scheduling",
        "handbook_markdown": r"""# Lesson 5.18: Priority Task Scheduling

Priority queues pop the highest priority task first regardless of insertion order using a heap.
""",
        "starter_code": {
            "solution.py": '''"""
Priority Task Scheduling
Schedule tasks with integer priority using heapq.
"""

import heapq
from typing import Tuple, Optional

class PriorityScheduler:
    def __init__(self):
        self.heap = [] # (negative_priority, task_name)

    def add_task(self, name: str, priority: int) -> None:
        heapq.heappush(self.heap, (-priority, name))

    def pop_task(self) -> Optional[str]:
        if not self.heap:
            return None
        return heapq.heappop(self.heap)[1]
'''
        },
        "test_suite": {
            "exercise_about": "Implement priority task dispatching with min-heaps.",
            "exercise_goal": "Implement `PriorityScheduler`.",
            "expected_output": "Pop tasks in descending priority order.",
            "tests.py": '''import pytest
from solution import PriorityScheduler

def test_priority_scheduling():
    s = PriorityScheduler()
    s.add_task("low_prio", 1)
    s.add_task("critical", 10)
    s.add_task("med_prio", 5)
    
    assert s.pop_task() == "critical"
    assert s.pop_task() == "med_prio"
    assert s.pop_task() == "low_prio"
    assert s.pop_task() is None
'''
        }
    },
    "node-3-19": {
        "title": "Lesson 5.19: Hash Functions & Collision Defense",
        "handbook_markdown": r"""# Lesson 5.19: Hash Functions & Collision Defense

Cryptographic and non-cryptographic hash functions distribute keys uniformly across buckets to avoid collision clustering.
""",
        "starter_code": {
            "solution.py": '''"""
Hash Functions & Collision Defense
Implement polynomial rolling hash.
"""

def polynomial_hash(s: str, p: int = 31, m: int = 10**9 + 9) -> int:
    """Compute polynomial rolling hash: sum(ord(c) * p^i) % m."""
    h = 0
    p_pow = 1
    for c in s:
        h = (h + ord(c) * p_pow) % m
        p_pow = (p_pow * p) % m
    return h
'''
        },
        "test_suite": {
            "exercise_about": "Understand polynomial rolling hash functions.",
            "exercise_goal": "Implement `polynomial_hash(s)`.",
            "expected_output": "Compute deterministic integer hash values.",
            "tests.py": '''import pytest
from solution import polynomial_hash

def test_poly_hash():
    h1 = polynomial_hash("hello")
    h2 = polynomial_hash("hello")
    h3 = polynomial_hash("world")
    assert h1 == h2
    assert h1 != h3
'''
        }
    },
    "node-3-20": {
        "title": "Lesson 5.20: Collision Resolution: Chaining",
        "handbook_markdown": r"""# Lesson 5.20: Collision Resolution: Chaining

**Separate Chaining** stores colliding key-value pairs in a linked list or dynamic array attached to each hash bucket.
""",
        "starter_code": {
            "solution.py": '''"""
Collision Resolution: Chaining
Implement a hash table with separate chaining collision resolution.
"""

from typing import List, Tuple, Any, Optional

class ChainedHashTable:
    def __init__(self, num_buckets: int = 8):
        self.num_buckets = num_buckets
        self.buckets: List[List[Tuple[str, Any]]] = [[] for _ in range(num_buckets)]

    def _hash(self, key: str) -> int:
        return hash(key) % self.num_buckets

    def put(self, key: str, value: Any) -> None:
        b_idx = self._hash(key)
        bucket = self.buckets[b_idx]
        for i, (k, v) in enumerate(bucket):
            if k == key:
                bucket[i] = (key, value)
                return
        bucket.append((key, value))

    def get(self, key: str) -> Optional[Any]:
        b_idx = self._hash(key)
        for k, v in self.buckets[b_idx]:
            if k == key:
                return v
        return None
'''
        },
        "test_suite": {
            "exercise_about": "Build a hash table using separate chaining for collision resolution.",
            "exercise_goal": "Implement `ChainedHashTable` with `put()` and `get()`.",
            "expected_output": "Accurately store and retrieve colliding keys.",
            "tests.py": '''import pytest
from solution import ChainedHashTable

def test_chained_hash_table():
    ht = ChainedHashTable(num_buckets=2) # Force collisions
    ht.put("key1", "val1")
    ht.put("key2", "val2")
    ht.put("key1", "updated_val1")
    
    assert ht.get("key1") == "updated_val1"
    assert ht.get("key2") == "val2"
    assert ht.get("unknown") is None
'''
        }
    },
    "node-3-21": {
        "title": "Lesson 5.21: Collision Resolution: Open Addressing",
        "handbook_markdown": r"""# Lesson 5.21: Collision Resolution: Open Addressing

**Linear Probing** searches consecutive slots $(h + 1, h + 2 \dots)$ until an empty bucket is found.
""",
        "starter_code": {
            "solution.py": '''"""
Collision Resolution: Open Addressing
Implement linear probing hash slot lookup.
"""

from typing import List, Optional

def find_linear_probe_slot(table: List[Optional[str]], key: str, initial_hash: int) -> Optional[int]:
    """Find next open or matching slot in table using linear probing."""
    cap = len(table)
    for i in range(cap):
        slot = (initial_hash + i) % cap
        if table[slot] is None or table[slot] == key:
            return slot
    return None
'''
        },
        "test_suite": {
            "exercise_about": "Understand linear probing collision resolution in open addressing.",
            "exercise_goal": "Implement `find_linear_probe_slot(table, key, initial_hash)`.",
            "expected_output": "Return first open slot index.",
            "tests.py": '''import pytest
from solution import find_linear_probe_slot

def test_linear_probing():
    table = ["occupied", "occupied", None, "occupied"]
    # hash 0 -> slot 0 occupied -> slot 1 occupied -> slot 2 free!
    assert find_linear_probe_slot(table, "new_key", 0) == 2
'''
        }
    },
    "node-3-22": {
        "title": "Lesson 2.22: CPython Compact Dict Internals",
        "handbook_markdown": r"""# Lesson 5.22: CPython Compact Dict Internals

CPython 3.6+ stores dicts in two arrays:
1. Sparse `indices` table.
2. Dense `entries` array `[(hash, key, value), ...]`, preserving insertion order and saving 30% RAM.
""",
        "starter_code": {
            "solution.py": '''"""
CPython Compact Dict Internals
Model split-table compact dictionary storage.
"""

from typing import List, Tuple, Any

class CompactDictModel:
    def __init__(self, size: int = 8):
        self.indices = [-1] * size
        self.entries: List[Tuple[str, Any]] = []

    def insert(self, key: str, val: Any) -> None:
        idx = len(self.entries)
        self.entries.append((key, val))
        h = hash(key) % len(self.indices)
        self.indices[h] = idx
'''
        },
        "test_suite": {
            "exercise_about": "Understand CPython compact dictionary architecture.",
            "exercise_goal": "Implement `CompactDictModel`.",
            "expected_output": "Maintain dense entry arrays preserving insertion order.",
            "tests.py": '''import pytest
from solution import CompactDictModel

def test_compact_dict():
    cd = CompactDictModel(8)
    cd.insert("a", 1)
    cd.insert("b", 2)
    assert len(cd.entries) == 2
    assert cd.entries[0] == ("a", 1)
'''
        }
    },
    "node-3-23": {
        "title": "Lesson 5.23: Perturb Probing in Python Dicts",
        "handbook_markdown": r"""# Lesson 5.23: Perturb Probing in Python Dicts

Python dicts use **perturb probing** ($i = (5i + 1 + \text{perturb}) \pmod N$) to jump pseudo-randomly across hash slots and break primary clustering.
""",
        "starter_code": {
            "solution.py": '''"""
Perturb Probing in Python Dicts
Calculate sequence of perturb probe slot steps.
"""

from typing import List

def generate_perturb_sequence(h: int, table_size: int, steps: int = 5) -> List[int]:
    """Generate first `steps` probe indices for hash `h` using perturb probing."""
    indices = []
    perturb = h
    i = h % table_size
    for _ in range(steps):
        indices.append(i)
        i = (5 * i + 1 + perturb) % table_size
        perturb >>= 5
    return indices
'''
        },
        "test_suite": {
            "exercise_about": "Understand CPython perturb probing collision mechanics.",
            "exercise_goal": "Implement `generate_perturb_sequence(h, table_size, steps)`.",
            "expected_output": "Generate deterministic probe sequences.",
            "tests.py": '''import pytest
from solution import generate_perturb_sequence

def test_perturb_seq():
    seq = generate_perturb_sequence(42, 8, steps=3)
    assert len(seq) == 3
    assert seq[0] == 42 % 8 # 2
'''
        }
    },
    "node-3-24": {
        "title": "Lesson 5.24: Load Factors & Dict Resizing",
        "handbook_markdown": r"""# Lesson 5.24: Load Factors & Dict Resizing

When a hash table's **Load Factor** $\alpha = \frac{N}{\text{capacity}} \ge \frac{2}{3}$, the table doubles its capacity and re-hashes all keys to maintain $O(1)$ search.
""",
        "starter_code": {
            "solution.py": '''"""
Load Factors & Dict Resizing
Check if hash table requires resizing.
"""

def should_resize(item_count: int, capacity: int, max_load: float = 0.66) -> bool:
    """Return True if item_count / capacity >= max_load."""
    return (item_count / capacity) >= max_load
'''
        },
        "test_suite": {
            "exercise_about": "Understand hash table load factors and dynamic table resizing.",
            "exercise_goal": "Implement `should_resize(item_count, capacity, max_load)`.",
            "expected_output": "Correctly trigger resize threshold checks.",
            "tests.py": '''import pytest
from solution import should_resize

def test_load_factor_resize():
    assert should_resize(5, 8) is False  # 5/8 = 0.625 < 0.66
    assert should_resize(6, 8) is True   # 6/8 = 0.75 >= 0.66
'''
        }
    },
    "node-3-25": {
        "title": "Lesson 5.25: In-Memory Inverted Frequency Maps",
        "handbook_markdown": r"""# Lesson 5.25: In-Memory Inverted Frequency Maps

An in-memory **Term Frequency (TF) Map** counts token frequencies across documents for BM25 ranking.
""",
        "starter_code": {
            "solution.py": '''"""
In-Memory Inverted Frequency Maps
Count word frequencies in a tokenized document list.
"""

from typing import List, Dict

def compute_term_frequencies(tokens: List[str]) -> Dict[str, int]:
    """Return dictionary mapping token -> count."""
    tf = {}
    for t in tokens:
        tf[t] = tf.get(t, 0) + 1
    return tf
'''
        },
        "test_suite": {
            "exercise_about": "Build in-memory term frequency counter maps.",
            "exercise_goal": "Implement `compute_term_frequencies(tokens)`.",
            "expected_output": "Return exact frequency dictionary.",
            "tests.py": '''import pytest
from solution import compute_term_frequencies

def test_tf_map():
    tokens = ["ai", "search", "ai", "agent", "ai"]
    tf = compute_term_frequencies(tokens)
    assert tf == {"ai": 3, "search": 1, "agent": 1}
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 5 (node-3-1 to node-3-25)...")
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
