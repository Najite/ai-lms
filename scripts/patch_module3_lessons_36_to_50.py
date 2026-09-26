#!/usr/bin/env python3
"""
Batch patch Module 3: Lessons 3.36 to 3.50
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
    "node-2-36": {
        "title": "Lesson 3.36: Hoare Logic & Buffer Invariants",
        "handbook_markdown": r"""# Lesson 3.36: Hoare Logic & Buffer Invariants

**Hoare Logic** is a formal system for reasoning about program correctness using Hoare Triples:
$$\{P\} \quad C \quad \{Q\}$$
- $P$ is the **Precondition** (must hold before command $C$).
- $C$ is the **Command / Code Execution**.
- $Q$ is the **Postcondition** (guaranteed to hold after $C$).

---

### 💡 The Mental Model: The Bank Vault Airlock
- **Precondition ($P$)**: Outer door open, inner door locked, chamber empty.
- **Command ($C$)**: Guard enters chamber, outer door locks, air clears.
- **Postcondition ($Q$)**: Outer door locked, inner door ready to open safely.

---

### 🔍 Deep Dive: Circular Ring Buffer Invariant
In high-speed streaming AI pipelines, circular ring buffers store byte chunks without memory allocation:
- **Invariant**: $0 \le \text{count} \le \text{capacity}$.
- Write moves `write_ptr = (write_ptr + 1) % capacity`.
- Read moves `read_ptr = (read_ptr + 1) % capacity`.
""",
        "starter_code": {
            "solution.py": '''"""
Hoare Logic & Buffer Invariants
Implement a bounded circular ring buffer with strict capacity invariants.
"""

from typing import Any, Optional, List

class CircularRingBuffer:
    def __init__(self, capacity: int):
        if capacity <= 0:
            raise ValueError("Capacity must be positive")
        self.capacity = capacity
        self.buffer: List[Optional[Any]] = [None] * capacity
        self.read_ptr = 0
        self.write_ptr = 0
        self.count = 0

    def push(self, item: Any) -> bool:
        """
        Precondition: buffer may or may not be full.
        If count < capacity: write item at write_ptr, advance write_ptr, increment count, return True.
        If count == capacity: buffer full, reject item, return False.
        """
        # TODO: Implement push enforcing count <= capacity
        pass

    def pop(self) -> Optional[Any]:
        """
        Precondition: buffer may or may not be empty.
        If count > 0: read item at read_ptr, clear slot, advance read_ptr, decrement count, return item.
        If count == 0: return None.
        """
        # TODO: Implement pop enforcing count >= 0
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Hoare Logic preconditions and postconditions through a bounded circular ring buffer data structure.",
            "exercise_goal": "Implement `push(item)` and `pop()` on `CircularRingBuffer` maintaining count and pointer invariants.",
            "expected_output": "Correctly buffer items FIFO, wrap around capacity boundaries, reject overflow, and return None on empty pop.",
            "tests.py": '''import pytest
from solution import CircularRingBuffer

def test_ring_buffer_fifo_lifecycle():
    rb = CircularRingBuffer(3)
    assert rb.push("A") is True
    assert rb.push("B") is True
    assert rb.push("C") is True
    assert rb.push("D") is False # Full!
    
    assert rb.pop() == "A"
    assert rb.push("D") is True  # Wrapped slot
    assert rb.pop() == "B"
    assert rb.pop() == "C"
    assert rb.pop() == "D"
    assert rb.pop() is None      # Empty
'''
        }
    },
    "node-2-37": {
        "title": "Lesson 3.37: Z3 SMT Solver: Constraint Modeling",
        "handbook_markdown": r"""# Lesson 3.37: Z3 SMT Solver: Constraint Modeling

**Satisfiability Modulo Theories (SMT)** solvers (such as Microsoft Z3) generalize SAT to rich mathematical theories (linear arithmetic, bitvectors, arrays).

SMT solvers allow you to write mathematical declarations of what you need, and the solver automatically finds inputs that satisfy all constraints.

---

### 💡 The Mental Model: The Sudoku Master
Instead of writing 100 nested for-loops, you declare the rules:
1. Every row has numbers 1 to 9.
2. Every column has numbers 1 to 9.
3. Every 3x3 box has numbers 1 to 9.
The solver deduces the entire board instantly.

---

### 🔍 Deep Dive: Simple Pure-Python Constraint Solver
We can model a lightweight constraint propagation engine that solves arithmetic inequalities and resource allocations.
""",
        "starter_code": {
            "solution.py": '''"""
Z3 SMT Solver: Constraint Modeling
Solve resource allocation constraints using backtracking search.
"""

from typing import Dict, List, Optional, Tuple

def solve_resource_allocation(
    workers: List[str],
    task_costs: Dict[str, int],
    worker_budgets: Dict[str, int]
) -> Optional[Dict[str, str]]:
    """
    Find an assignment of tasks to workers such that no worker exceeds their budget.
    
    Args:
        workers: List of worker IDs.
        task_costs: Mapping of task_id -> cost (int).
        worker_budgets: Mapping of worker_id -> max_budget (int).

    Returns:
        Mapping of task_id -> worker_id if a valid assignment exists, else None.
    """
    # TODO: Implement backtracking search to assign every task to a worker
    # TODO: Enforce sum(task_costs assigned to worker) <= worker_budgets[worker]
    # TODO: Return assignment dictionary or None
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Satisfiability Modulo Theories (SMT) constraint modeling for multi-variable resource allocation.",
            "exercise_goal": "Implement `solve_resource_allocation(workers, task_costs, worker_budgets)` using constraint satisfaction search.",
            "expected_output": "Return a valid `{task: worker}` assignment adhering to all worker budget caps, or None if impossible.",
            "tests.py": '''import pytest
from solution import solve_resource_allocation

def test_satisfiable_allocation():
    workers = ["w1", "w2"]
    tasks = {"t1": 10, "t2": 20, "t3": 15}
    budgets = {"w1": 25, "w2": 25}
    
    assignment = solve_resource_allocation(workers, tasks, budgets)
    assert assignment is not None
    # Verify budgets
    w1_cost = sum(tasks[t] for t, w in assignment.items() if w == "w1")
    w2_cost = sum(tasks[t] for t, w in assignment.items() if w == "w2")
    assert w1_cost <= 25
    assert w2_cost <= 25

def test_unsatisfiable_budget():
    workers = ["w1"]
    tasks = {"t1": 50, "t2": 60}
    budgets = {"w1": 100}
    assert solve_resource_allocation(workers, tasks, budgets) is None
'''
        }
    },
    "node-2-38": {
        "title": "Lesson 3.38: Z3 SMT Solver: Test Case Generation",
        "handbook_markdown": r"""# Lesson 3.38: Z3 SMT Solver: Test Case Generation

In automated fuzzing and concolic testing, SMT solvers invert program execution paths to generate inputs that trigger specific code branches and edge-case exceptions.

---

### 💡 The Mental Model: The Lockpicker's Key Mold
Instead of randomly guessing passwords, an SMT solver looks at the tumblers inside the lock mechanism and molds a brass key designed specifically to match all tumblers simultaneously.

---

### 🔍 Deep Dive: Boundary Condition Solvers
Find boundary inputs $(x, y)$ that satisfy branch conditions such as $x > 0 \land y < 0 \land x + y = 42$.
""",
        "starter_code": {
            "solution.py": '''"""
Z3 SMT Solver: Test Case Generation
Generate boundary inputs satisfying compound branch inequalities.
"""

from typing import Optional, Tuple

def find_boundary_test_inputs(
    min_sum: int,
    max_sum: int,
    diff_target: int
) -> Optional[Tuple[int, int]]:
    """
    Find integer inputs (x, y) satisfying:
    1. min_sum <= x + y <= max_sum
    2. x - y == diff_target
    3. x >= 0 and y >= 0

    Returns:
        (x, y) if valid integers exist, else None.
    """
    # TODO: Solve equations algebraically or search discrete domain
    # TODO: Verify all boundary inequalities
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand how constraint solvers generate test inputs targeting specific branch conditions.",
            "exercise_goal": "Implement `find_boundary_test_inputs(min_sum, max_sum, diff_target)` to compute valid test parameters.",
            "expected_output": "Return a valid `(x, y)` integer pair meeting all constraints, or None if unsatisfiable.",
            "tests.py": '''import pytest
from solution import find_boundary_test_inputs

def test_valid_boundary_case():
    # x + y in [20, 30], x - y = 10 -> e.g. x=15, y=5 -> sum=20, diff=10
    res = find_boundary_test_inputs(20, 30, 10)
    assert res is not None
    x, y = res
    assert 20 <= x + y <= 30
    assert x - y == 10
    assert x >= 0 and y >= 0

def test_impossible_boundary():
    # Impossible with non-negative integers
    assert find_boundary_test_inputs(10, 20, 50) is None
'''
        }
    },
    "node-2-39": {
        "title": "Lesson 3.39: Temporal Logic & Trace Checking",
        "handbook_markdown": r"""# Lesson 3.39: Temporal Logic & Trace Checking

**Linear Temporal Logic (LTL)** allows specifying rules across time and execution traces:
- **Always ($\Box P$)**: Property $P$ must be True at every single step in the trace.
- **Eventually ($\Diamond P$)**: Property $P$ must become True at least once before the trace ends.
- **Next ($\bigcirc P$)**: Property $P$ must hold in the immediate next state.

---

### 💡 The Mental Model: Flight Black Box Recorders
- **Safety ($\Box \text{NoEngineFire}$)**: Nothing bad ever happens.
- **Liveness ($\Diamond \text{SafeLanding}$)**: Something good eventually happens.

---

### 🔍 Deep Dive: Trace Verification Engine
Auditing historical agent log traces against temporal logic formulas.
""",
        "starter_code": {
            "solution.py": '''"""
Temporal Logic & Trace Checking
Audit agent execution logs against temporal safety and liveness rules.
"""

from typing import List, Dict, Any, Callable

def check_always(trace: List[Dict[str, Any]], predicate: Callable[[Dict[str, Any]], bool]) -> bool:
    """Safety property (Box P): predicate must hold at EVERY step in trace."""
    # TODO: Return True if all states in trace satisfy predicate
    pass

def check_eventually(trace: List[Dict[str, Any]], predicate: Callable[[Dict[str, Any]], bool]) -> bool:
    """Liveness property (Diamond P): predicate must hold at AT LEAST ONE step in trace."""
    # TODO: Return True if at least one state in trace satisfies predicate
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Linear Temporal Logic (LTL) properties (Safety vs Liveness) and verify system execution traces.",
            "exercise_goal": "Implement `check_always(trace, predicate)` and `check_eventually(trace, predicate)`.",
            "expected_output": "Properly audit log event lists against temporal assertions.",
            "tests.py": '''import pytest
from solution import check_always, check_eventually

@pytest.fixture
def sample_trace():
    return [
        {"step": 1, "state": "INIT", "memory_mb": 100},
        {"step": 2, "state": "PROCESSING", "memory_mb": 250},
        {"step": 3, "state": "DONE", "memory_mb": 150},
    ]

def test_temporal_safety(sample_trace):
    # Safety: Memory is always under 500MB
    assert check_always(sample_trace, lambda s: s["memory_mb"] < 500) is True
    # Safety violated: Memory is always under 200MB (fails at step 2)
    assert check_always(sample_trace, lambda s: s["memory_mb"] < 200) is False

def test_temporal_liveness(sample_trace):
    # Liveness: State eventually reaches DONE
    assert check_eventually(sample_trace, lambda s: s["state"] == "DONE") is True
    # Liveness failed: State never reaches ERROR
    assert check_eventually(sample_trace, lambda s: s["state"] == "ERROR") is False
'''
        }
    },
    "node-2-40": {
        "title": "Lesson 3.40: Petri Nets & Concurrency Modeling",
        "handbook_markdown": r"""# Lesson 3.40: Petri Nets & Concurrency Modeling

A **Petri Net** models concurrent, asynchronous distributed systems using:
- **Places** (circles holding Tokens $\bullet$).
- **Transitions** (bars representing actions).
- **Directed Arcs** connecting Places to Transitions and Transitions to Places.

---

### 💡 The Mental Model: Vending Machine Token Dispensers
A transition fires only when **all its input places have sufficient tokens**. Firing consumes tokens from input places and deposits new tokens into output places.

---

### 🔍 Deep Dive: Fireability & Execution
A transition $T$ is enabled if for every input place $P$, $\text{tokens}(P) \ge \text{arc\_weight}(P, T)$.
""",
        "starter_code": {
            "solution.py": '''"""
Petri Nets & Concurrency Modeling
Implement a Petri Net token simulator with transition firing mechanics.
"""

from typing import Dict, List, Tuple

class PetriNet:
    def __init__(self, initial_tokens: Dict[str, int]):
        self.tokens = dict(initial_tokens)
        # transition_name -> (input_places_with_weights, output_places_with_weights)
        self.transitions: Dict[str, Tuple[Dict[str, int], Dict[str, int]]] = {}

    def add_transition(self, name: str, inputs: Dict[str, int], outputs: Dict[str, int]) -> None:
        """Register a transition with required input token costs and generated output tokens."""
        self.transitions[name] = (inputs, outputs)

    def can_fire(self, name: str) -> bool:
        """Return True if transition exists and all input places have enough tokens."""
        # TODO: Check token availability
        pass

    def fire(self, name: str) -> bool:
        """
        If can_fire(name) is True:
        - Deduct input tokens
        - Add output tokens
        - Return True
        Otherwise return False without changing token state.
        """
        # TODO: Execute atomic token transition
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Petri Nets for modeling concurrent systems and token-driven synchronization.",
            "exercise_goal": "Implement `add_transition()`, `can_fire(name)`, and `fire(name)` on `PetriNet`.",
            "expected_output": "Correctly evaluate transition enabling and atomically transfer tokens across places.",
            "tests.py": '''import pytest
from solution import PetriNet

def test_petri_net_firing():
    # Producer-Consumer with shared mutex
    net = PetriNet({"ready_to_send": 1, "channel_free": 1, "received": 0})
    net.add_transition(
        "transmit",
        inputs={"ready_to_send": 1, "channel_free": 1},
        outputs={"received": 1, "channel_free": 1}
    )
    
    assert net.can_fire("transmit") is True
    assert net.fire("transmit") is True
    assert net.tokens["ready_to_send"] == 0
    assert net.tokens["received"] == 1
    assert net.tokens["channel_free"] == 1
    
    # Cannot fire a second time because ready_to_send is 0
    assert net.can_fire("transmit") is False
    assert net.fire("transmit") is False
'''
        }
    },
    "node-2-41": {
        "title": "Lesson 3.41: Python AST & Code Sandboxing",
        "handbook_markdown": r"""# Lesson 3.41: Python AST & Code Sandboxing

When LLMs generate code to execute locally, running raw `eval()` or `exec()` is a critical security vulnerability.

Python's built-in `ast` module allows parsing Python code into an **Abstract Syntax Tree (AST)** and inspecting every syntax node to block unsafe operations (`import os`, `subprocess`, `open`, `__import__`).

---

### 💡 The Mental Model: Airport Security Baggage Scanner
Before baggage code is loaded onto the plane, the X-ray scanner inspects every item. If it detects banned contraband (e.g. `eval`, `os.system`), the scanner rejects the entire bag before execution.

---

### 🔍 Deep Dive: `ast.NodeVisitor`
Subclassing `ast.NodeVisitor` lets you inspect function calls, imports, and attribute lookups.
""",
        "starter_code": {
            "solution.py": '''"""
Python AST & Code Sandboxing
Validate Python code safety using AST static analysis before execution.
"""

import ast
from typing import List, Tuple

class SafeCodeAuditor(ast.NodeVisitor):
    BANNED_IMPORTS = {"os", "sys", "subprocess", "shutil", "socket"}
    BANNED_CALLS = {"eval", "exec", "open", "__import__"}

    def __init__(self):
        self.violations: List[str] = []

    def visit_Import(self, node: ast.Import) -> None:
        for alias in node.names:
            if alias.name in self.BANNED_IMPORTS:
                self.violations.append(f"Banned import: {alias.name}")
        self.generic_visit(node)

    def visit_ImportFrom(self, node: ast.ImportFrom) -> None:
        if node.module in self.BANNED_IMPORTS:
            self.violations.append(f"Banned import: {node.module}")
        self.generic_visit(node)

    def visit_Call(self, node: ast.Call) -> None:
        if isinstance(node.func, ast.Name) and node.func.id in self.BANNED_CALLS:
            self.violations.append(f"Banned function call: {node.func.id}")
        self.generic_visit(node)

def audit_python_code(source_code: str) -> Tuple[bool, List[str]]:
    """
    Parse source_code into an AST and audit for safety violations.
    
    Returns:
        (is_safe, list_of_violations)
    """
    # TODO: Parse source_code with ast.parse()
    # TODO: Run SafeCodeAuditor
    # TODO: Return (len(violations) == 0, violations)
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master Python AST static analysis to inspect code syntax trees and sandbox untrusted AI-generated scripts.",
            "exercise_goal": "Implement `audit_python_code(source_code)` to detect unsafe imports and dangerous function calls.",
            "expected_output": "Return (True, []) for clean code and (False, [violations...]) for malicious scripts.",
            "tests.py": '''import pytest
from solution import audit_python_code

def test_safe_code():
    code = """
def calculate_metrics(nums):
    return sum(x * 2 for x in nums)
"""
    is_safe, violations = audit_python_code(code)
    assert is_safe is True
    assert violations == []

def test_dangerous_imports():
    code = """
import os
import math
os.remove('/etc/passwd')
"""
    is_safe, violations = audit_python_code(code)
    assert is_safe is False
    assert any("os" in v for v in violations)

def test_banned_eval_call():
    code = """
result = eval("2 + 2")
"""
    is_safe, violations = audit_python_code(code)
    assert is_safe is False
    assert any("eval" in v for v in violations)
'''
        }
    },
    "node-2-42": {
        "title": "Lesson 3.42: Expression Evaluator (Shunting-Yard)",
        "handbook_markdown": r"""# Lesson 3.42: Expression Evaluator (Shunting-Yard)

Edsger Dijkstra's **Shunting-Yard Algorithm** parses infix expressions (`3 + 4 * 2`) into **Reverse Polish Notation (RPN)** (`3 4 2 * +`), which can then be evaluated using a simple stack.

---

### 💡 The Mental Model: The Train Switchyard
Imagine railcars with numbers and operator engines arriving on a single track:
- Numbers roll straight through to the output train.
- Operators wait on a side track (the stack) until all higher-precedence operators have cleared the intersection.

---

### 🔍 Deep Dive: Postfix (RPN) Evaluation
To evaluate RPN tokens `['3', '4', '2', '*', '+']`:
1. Push numbers onto stack: `[3, 4, 2]`.
2. See `*`: pop 2, 4 $\to$ calculate $4 \times 2 = 8 \to$ push 8: `[3, 8]`.
3. See `+`: pop 8, 3 $\to$ calculate $3 + 8 = 11 \to$ push 11: `[11]`.
""",
        "starter_code": {
            "solution.py": '''"""
Expression Evaluator (Shunting-Yard)
Evaluate Reverse Polish Notation (RPN) postfix expression token lists.
"""

from typing import List

def evaluate_rpn(tokens: List[str]) -> float:
    """
    Evaluate an arithmetic expression in Reverse Polish Notation (RPN).
    Supports '+', '-', '*', '/'.
    
    Args:
        tokens: List of strings (numbers or operator symbols).

    Returns:
        The calculated result as a float.
    """
    # TODO: Use a stack to push operand numbers
    # TODO: On operator, pop top two operands (right then left)
    # TODO: Apply operator and push result back to stack
    # TODO: Return final number on stack
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand Reverse Polish Notation (RPN) stack evaluation used in pocket calculators and bytecode virtual machines.",
            "exercise_goal": "Implement `evaluate_rpn(tokens)` to compute arithmetic outcomes from postfix token sequences.",
            "expected_output": "Accurately compute float results for composite RPN calculations.",
            "tests.py": '''import pytest
from solution import evaluate_rpn

def test_rpn_simple():
    # 3 4 + -> 7
    assert evaluate_rpn(["3", "4", "+"]) == 7.0

def test_rpn_complex_precedence():
    # 3 4 2 * + -> 3 + (4 * 2) = 11
    assert evaluate_rpn(["3", "4", "2", "*", "+"]) == 11.0
    
    # 5 1 2 + 4 * + 3 - -> 5 + ((1 + 2) * 4) - 3 = 14
    assert evaluate_rpn(["5", "1", "2", "+", "4", "*", "+", "3", "-"]) == 14.0
'''
        }
    },
    "node-2-43": {
        "title": "Lesson 3.43: Trie (Prefix Tree) Structures",
        "handbook_markdown": r"""# Lesson 3.43: Trie (Prefix Tree) Structures

A **Trie** (derived from "re**trie**val") is an ordered tree data structure used for high-speed autocomplete, spell-checking, and IP routing lookups.

All descendants of a node share a common string prefix.

---

### 💡 The Mental Model: The Phone Contact Keypad
When typing `"AL"`:
- Jump to `'A'` branch $\to$ jump to `'L'` branch.
- Every contact under this subtree starts with `"AL"` (`"ALICE"`, `"ALEX"`, `"ALAN"`). Lookups take $O(L)$ time proportional only to the word length $L$, completely independent of whether the dictionary has 100 or 10,000,000 words.

---

### 🔍 Deep Dive: Trie Node Architecture
Each node holds a dictionary `children: Dict[str, TrieNode]` and a boolean `is_end_of_word`.
""",
        "starter_code": {
            "solution.py": '''"""
Trie (Prefix Tree) Structures
Implement a Trie supporting word insertions, exact lookups, and prefix searching.
"""

from typing import List, Dict

class TrieNode:
    def __init__(self):
        self.children: Dict[str, TrieNode] = {}
        self.is_end_of_word: bool = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        """Insert a word into the Trie."""
        # TODO: Traverse/create child nodes for each character and mark end of word
        pass

    def search(self, word: str) -> bool:
        """Return True if the exact word is in the Trie, False otherwise."""
        # TODO: Traverse nodes; return True if found and is_end_of_word is True
        pass

    def starts_with(self, prefix: str) -> bool:
        """Return True if there is any word in the Trie that starts with the given prefix."""
        # TODO: Traverse nodes; return True if prefix path exists
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Build a Trie (Prefix Tree) data structure for constant-time-per-character string prefix matching and autocomplete engines.",
            "exercise_goal": "Implement `insert(word)`, `search(word)`, and `starts_with(prefix)` on `Trie`.",
            "expected_output": "Correctly store strings, detect exact matches, and verify shared prefix presence.",
            "tests.py": '''import pytest
from solution import Trie

def test_trie_insert_and_search():
    trie = Trie()
    trie.insert("apple")
    assert trie.search("apple") is True
    assert trie.search("app") is False # prefix, not full word
    assert trie.starts_with("app") is True
    
    trie.insert("app")
    assert trie.search("app") is True

def test_trie_missing():
    trie = Trie()
    trie.insert("agent")
    assert trie.search("banana") is False
    assert trie.starts_with("ban") is False
'''
        }
    },
    "node-2-44": {
        "title": "Lesson 3.44: Aho-Corasick Multi-Pattern Search",
        "handbook_markdown": r"""# Lesson 3.44: Aho-Corasick Multi-Pattern Search

When filtering sensitive content or searching for 10,000 keyword patterns in a streaming text, scanning with individual regexes takes $O(N \times K)$ time (far too slow).

The **Aho-Corasick Algorithm** combines a Trie with suffix failure links to find **all occurrences of all patterns simultaneously in a single linear scan** ($O(N + M)$).

---

### 💡 The Mental Model: Guard Dogs on Sentry Duty
Instead of walking through the library 1,000 times looking for 1,000 different banned books, you walk through once with a trained team of sentry dogs. Whenever any matching keyword is seen, an alert triggers instantly without rewinding your walk.
""",
        "starter_code": {
            "solution.py": '''"""
Aho-Corasick Multi-Pattern Search
Find all occurrences of multiple search keywords in a target text.
"""

from typing import List, Dict, Tuple

def multi_keyword_search(keywords: List[str], text: str) -> List[Tuple[str, int]]:
    """
    Find all occurrences of all keywords in `text`.
    
    Args:
        keywords: List of target keyword strings.
        text: Source text to search.

    Returns:
        List of (matched_keyword, start_index) tuples, sorted by start_index.
    """
    # TODO: Find matches for all keywords across text
    # TODO: Return ordered (keyword, start_index) tuples
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand multi-pattern string matching algorithms and scan texts for keyword sets in linear time.",
            "exercise_goal": "Implement `multi_keyword_search(keywords, text)` returning all matching keywords and their starting indices.",
            "expected_output": "Return a sorted list of `(keyword, start_index)` tuples capturing all matches.",
            "tests.py": '''import pytest
from solution import multi_keyword_search

def test_multi_keyword_search():
    keywords = ["he", "she", "his", "hers"]
    text = "ushers"
    # Matches:
    # "she" at index 1
    # "he" at index 2
    # "hers" at index 2
    matches = multi_keyword_search(keywords, text)
    matched_words = [m[0] for m in matches]
    assert "she" in matched_words
    assert "he" in matched_words
    assert "hers" in matched_words
'''
        }
    },
    "node-2-45": {
        "title": "Lesson 3.45: Grammar-Guided Constrained Decoding",
        "handbook_markdown": r"""# Lesson 3.45: Grammar-Guided Constrained Decoding

When generating JSON or SQL from LLMs, models can hallucinate invalid syntax. **Grammar-Guided Constrained Decoding** forces the model's token logits at every generation step to only permit tokens that are legally valid according to a formal grammar state.

---

### 💡 The Mental Model: The Train on Rails
Instead of letting a car drive off-road and hoping it arrives at the station, the LLM is placed on railroad tracks. At every junction, switches physically lock out any track that violates the grammar.

---

### 🔍 Deep Dive: Token Masking with Prefixes
If current state is inside a JSON string expecting a key name, permit only `[a-zA-Z_]` and `"`. Block `{`, `}`, `[`, `]`.
""",
        "starter_code": {
            "solution.py": '''"""
Grammar-Guided Constrained Decoding
Filter next allowed vocabulary tokens based on prefix grammar rules.
"""

from typing import List, Set

def get_allowed_next_tokens(
    current_prefix: str,
    vocabulary: List[str]
) -> List[str]:
    """
    Given a current prefix and a candidate vocabulary, return only tokens that,
    when appended to current_prefix, keep parentheses/brackets balanced or legally openable.
    
    Rule:
    Brackets '(', '[' must not be closed unless properly opened.
    Total count of closing brackets must never exceed opening brackets.
    """
    # TODO: Check each token in vocabulary
    # TODO: Verify whether current_prefix + token maintains valid bracket prefix invariant
    # TODO: Return list of allowed tokens
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand constrained generation mask techniques that enforce formal grammar validity during token sampling.",
            "exercise_goal": "Implement `get_allowed_next_tokens(current_prefix, vocabulary)` ensuring legal bracket prefix state.",
            "expected_output": "Filter candidate tokens, banning syntax-violating closures.",
            "tests.py": '''import pytest
from solution import get_allowed_next_tokens

def test_constrained_bracket_filtering():
    vocab = ["(", ")", "[", "]", "x"]
    
    # Prefix: "" -> can open '(' or '[', or 'x', but cannot close ')' or ']'
    allowed = get_allowed_next_tokens("", vocab)
    assert set(allowed) == {"(", "[", "x"}
    
    # Prefix: "(" -> can close ')' or open '(' or '[', or 'x', but cannot close ']'
    allowed_nested = get_allowed_next_tokens("(", vocab)
    assert set(allowed_nested) == {"(", ")", "[", "x"}
'''
        }
    },
    "node-2-46": {
        "title": "Lesson 3.46: Strongly Connected Components",
        "handbook_markdown": r"""# Lesson 3.46: Strongly Connected Components

In a directed graph, a **Strongly Connected Component (SCC)** is a maximal subgraph where every vertex is reachable from every other vertex within that subgraph.

---

### 💡 The Mental Model: Roundabout Islands in City Traffic
Imagine a one-way street network:
- A group of streets in downtown form a continuous loop: you can drive from any building to any other building (**SCC**).
- A one-way highway leaves downtown to the airport. Once at the airport, you can never drive back downtown (Airport is a separate component).

---

### 🔍 Deep Dive: Kosaraju's / Tarjan's Algorithm
Tarjan's algorithm uses DFS with `lowlink` values to discover all SCCs in a single pass in $O(V + E)$ time.
""",
        "starter_code": {
            "solution.py": '''"""
Strongly Connected Components
Find all strongly connected components in a directed graph using Tarjan's algorithm.
"""

from typing import Dict, List, Set

def find_strongly_connected_components(graph: Dict[str, List[str]]) -> List[Set[str]]:
    """
    Compute all Strongly Connected Components (SCCs) of a directed graph.

    Args:
        graph: Adjacency list mapping node -> list of neighbor nodes.

    Returns:
        List of sets, where each set contains node IDs belonging to the same SCC.
    """
    # TODO: Implement Tarjan's SCC algorithm with DFS, index, and lowlink tracking
    # TODO: Return list of all discovered SCC component sets
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master Tarjan's / Kosaraju's algorithm to partition directed graphs into maximal Strongly Connected Components.",
            "exercise_goal": "Implement `find_strongly_connected_components(graph)` to find all mutually reachable subgraphs.",
            "expected_output": "Return a list of disjoint sets grouping strongly connected vertices.",
            "tests.py": '''import pytest
from solution import find_strongly_connected_components

def test_scc_simple_cycle_and_isolated():
    # A <-> B (cycle/SCC), C -> A (one-way into cycle)
    graph = {
        "A": ["B"],
        "B": ["A"],
        "C": ["A"]
    }
    sccs = find_strongly_connected_components(graph)
    sorted_sccs = sorted([sorted(list(s)) for s in sccs])
    assert sorted_sccs == [["A", "B"], ["C"]]

def test_dag_all_isolated_sccs():
    # In a pure DAG, every node is its own single-element SCC
    graph = {
        "A": ["B"],
        "B": ["C"],
        "C": []
    }
    sccs = find_strongly_connected_components(graph)
    assert len(sccs) == 3
'''
        }
    },
    "node-2-47": {
        "title": "Lesson 3.47: Minimum Spanning Trees (MST)",
        "handbook_markdown": r"""# Lesson 3.47: Minimum Spanning Trees (MST)

A **Minimum Spanning Tree (MST)** connects all vertices in an undirected, weighted graph with the minimum possible total edge weight, using zero cycles.

---

### 💡 The Mental Model: Laying Fiber-Optic Cables Between Cities
You need to connect 10 cities to high-speed internet.
Digging trenches costs money per mile.
The MST gives the exact blueprint to connect all 10 cities together with the minimum total miles of cable.

---

### 🔍 Deep Dive: Kruskal's Algorithm with Disjoint Set Union (DSU)
1. Sort all edges by weight ascending.
2. Iterate through sorted edges:
   - If the two endpoints belong to different DSU sets, include the edge in the MST and union their sets.
   - If they already belong to the same set, discard the edge (prevents cycles).
""",
        "starter_code": {
            "solution.py": '''"""
Minimum Spanning Trees (MST)
Compute the minimum spanning tree weight of an undirected graph using Kruskal's algorithm.
"""

from typing import List, Tuple, Dict

class DSU:
    def __init__(self, nodes: List[str]):
        self.parent = {n: n for n in nodes}

    def find(self, i: str) -> str:
        if self.parent[i] == i:
            return i
        self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i: str, j: str) -> bool:
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i != root_j:
            self.parent[root_i] = root_j
            return True
        return False

def compute_mst_kruskal(
    nodes: List[str],
    edges: List[Tuple[str, str, float]] # (u, v, weight)
) -> Tuple[float, List[Tuple[str, str, float]]]:
    """
    Calculate the Minimum Spanning Tree using Kruskal's algorithm.

    Returns:
        (total_mst_weight, list_of_mst_edges)
    """
    # TODO: Sort edges by weight
    # TODO: Use DSU to greedily pick non-cyclic edges
    # TODO: Return total weight and edge list
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master Kruskal's algorithm with Disjoint Set Union (Union-Find) to compute optimal Minimum Spanning Trees.",
            "exercise_goal": "Implement `compute_mst_kruskal(nodes, edges)` returning total tree cost and selected edge list.",
            "expected_output": "Connect all graph vertices with minimal cost and zero cycles.",
            "tests.py": '''import pytest
from solution import compute_mst_kruskal

def test_kruskal_mst():
    nodes = ["A", "B", "C", "D"]
    edges = [
        ("A", "B", 1.0),
        ("B", "C", 4.0),
        ("A", "C", 2.0),
        ("C", "D", 3.0),
        ("B", "D", 5.0)
    ]
    # MST should pick: (A, B, 1.0), (A, C, 2.0), (C, D, 3.0) -> Total weight = 6.0
    total_weight, mst_edges = compute_mst_kruskal(nodes, edges)
    assert total_weight == 6.0
    assert len(mst_edges) == 3
'''
        }
    },
    "node-2-48": {
        "title": "Lesson 3.48: Network Flow & Capacity Planning",
        "handbook_markdown": r"""# Lesson 3.48: Network Flow & Capacity Planning

The **Max-Flow Min-Cut Theorem** calculates the maximum volume of traffic or data packets that can flow through a network with edge capacity constraints from a Source ($S$) to a Sink ($T$).

---

### 💡 The Mental Model: Oil Pipelines
Imagine a network of pipes with different diameter capacities (gallons per minute):
The total oil you can pump from the refinery ($S$) to the city harbor ($T$) is bottlenecked by the narrowest constriction (**Min-Cut**).

---

### 🔍 Deep Dive: Ford-Fulkerson with BFS (Edmonds-Karp)
Find augmenting paths with positive residual capacity using BFS and push maximum bottleneck flow along each path until no augmenting path remains.
""",
        "starter_code": {
            "solution.py": '''"""
Network Flow & Capacity Planning
Calculate maximum network flow from source to sink using Edmonds-Karp.
"""

from typing import Dict, List
from collections import deque

def calculate_max_flow(
    capacities: Dict[str, Dict[str, float]],
    source: str,
    sink: str
) -> float:
    """
    Calculate maximum flow from source to sink using the Edmonds-Karp algorithm.

    Args:
        capacities: Nested dict capacities[u][v] = capacity.
        source: Source node ID.
        sink: Sink node ID.

    Returns:
        The maximum flow float value.
    """
    # TODO: Build residual capacity graph
    # TODO: While BFS finds augmenting path from source to sink:
    # TODO:   Compute bottleneck capacity
    # TODO:   Update residual capacities along path
    # TODO: Return total flow sent
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand network flow optimization and implement Edmonds-Karp maximum flow calculation for capacity planning.",
            "exercise_goal": "Implement `calculate_max_flow(capacities, source, sink)` using augmenting path residual graphs.",
            "expected_output": "Compute exact maximum flow capacity across directed bottleneck networks.",
            "tests.py": '''import pytest
from solution import calculate_max_flow

def test_max_flow_simple_diamond():
    # Source -> A (10), Source -> B (5)
    # A -> Sink (10), B -> Sink (10)
    capacities = {
        "S": {"A": 10.0, "B": 5.0},
        "A": {"T": 10.0},
        "B": {"T": 10.0},
        "T": {}
    }
    # Max flow = 10 (via A) + 5 (via B) = 15.0
    assert calculate_max_flow(capacities, "S", "T") == 15.0
'''
        }
    },
    "node-2-49": {
        "title": "Lesson 3.49: HyperLogLog Cardinality Estimation",
        "handbook_markdown": r"""# Lesson 3.49: HyperLogLog Cardinality Estimation

Counting unique items (e.g. 1 billion unique daily visitors) using an exact hash set requires **gigabytes of RAM**.

**HyperLogLog (HLL)** is a probabilistic algorithm that estimates cardinality of billions of items using **only 1.5 KB of memory** with a typical error rate of $\approx 1\%$.

---

### 💡 The Mental Model: Flipping Consecutive Heads in Coin Tosses
If someone flips a fair coin repeatedly:
- Getting 1 head in a row ($H$): Common (expected every 2 tosses).
- Getting 10 heads in a row ($HHHHHHHHHH$): Rare (expected 1 in 1,024 tosses).
- If the longest sequence of leading zeros in a 64-bit hash is $Z$, you can estimate you have seen approximately $2^{Z+1}$ unique items.

---

### 🔍 Deep Dive: Register Bucketing
HLL uses the first $b$ bits of a hash to select one of $m = 2^b$ registers, and records the maximum leading zero count observed in that bucket.
""",
        "starter_code": {
            "solution.py": '''"""
HyperLogLog Cardinality Estimation
Implement a simplified HyperLogLog cardinality estimator.
"""

import hashlib
from typing import List

class SimpleHyperLogLog:
    def __init__(self, bucket_bits: int = 4):
        self.b = bucket_bits
        self.m = 1 << bucket_bits # 2^b buckets
        self.registers = [0] * self.m

    def _hash(self, item: str) -> int:
        return int(hashlib.sha256(item.encode()).hexdigest()[:16], 16)

    def add(self, item: str) -> None:
        """Hash item, determine bucket index from first b bits, count leading zeros in remainder, and update register."""
        # TODO: Compute hash
        # TODO: Extract bucket index and count leading zeros in remaining bits
        # TODO: registers[bucket] = max(registers[bucket], leading_zeros + 1)
        pass

    def estimate(self) -> float:
        """Compute the harmonic mean estimate of unique items across all registers."""
        # TODO: Calculate raw indicator E = alpha_m * m^2 / sum(2^(-reg))
        # TODO: Return estimated cardinality
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand probabilistic cardinality estimation (HyperLogLog) for tracking massive unique element counts in constant memory.",
            "exercise_goal": "Implement `add(item)` and `estimate()` on `SimpleHyperLogLog`.",
            "expected_output": "Estimate distinct item counts within reasonable statistical variance using minimal register memory.",
            "tests.py": '''import pytest
from solution import SimpleHyperLogLog

def test_hll_cardinality_growth():
    hll = SimpleHyperLogLog(bucket_bits=4) # 16 buckets
    for i in range(100):
        hll.add(f"user_{i}")
    
    est = hll.estimate()
    # Expect rough approximation around 100
    assert est > 30 and est < 300
'''
        }
    },
    "node-2-50": {
        "title": "Lesson 3.50: Capstone: WorkflowGraph — Deterministic Agent Workflow Engine",
        "handbook_markdown": r"""# Lesson 3.50: Capstone: WorkflowGraph — Deterministic Agent Workflow Engine

Congratulations on reaching the Module 3 Capstone!

In this project, you will build **WorkflowGraph** — a production-grade deterministic workflow engine combining:
1. **DAG Topological Scheduling**: Resolving task dependencies and detecting deadlocks.
2. **Guarded State Machines**: Enforcing valid state transitions.
3. **Trace Auditing & Invariant Verification**: Verifying safety conditions across execution steps.

---

### 💡 The Architecture of WorkflowGraph
```
[ Input State ] ---> [ DAG Scheduler ] ---> [ Step Execution ] ---> [ Invariant Audit ] ---> [ Output State ]
```
""",
        "starter_code": {
            "solution.py": '''"""
Capstone: WorkflowGraph — Deterministic Agent Workflow Engine
A comprehensive workflow orchestration engine combining DAGs, guarded steps, and invariants.
"""

from typing import Dict, List, Callable, Any, Optional
from collections import deque

class WorkflowGraph:
    def __init__(self):
        # task_id -> {"func": Callable, "deps": List[str], "guard": Optional[Callable]}
        self.tasks: Dict[str, Dict[str, Any]] = {}
        self.invariants: List[Callable[[Dict[str, Any]], bool]] = []

    def add_step(
        self,
        task_id: str,
        func: Callable[[Dict[str, Any]], Any],
        dependencies: List[str] = None,
        guard: Optional[Callable[[Dict[str, Any]], bool]] = None
    ) -> None:
        """Register a workflow step with dependencies and an optional execution guard."""
        self.tasks[task_id] = {
            "func": func,
            "deps": dependencies or [],
            "guard": guard
        }

    def add_invariant(self, invariant_func: Callable[[Dict[str, Any]], bool]) -> None:
        """Add a global system invariant that must hold after EVERY step."""
        self.invariants.append(invariant_func)

    def execute(self, initial_state: Dict[str, Any]) -> Tuple[bool, Dict[str, Any], List[str]]:
        """
        Execute workflow steps in topological order.
        After each step:
        - Check all global invariants. If any fail, abort immediately and return (False, state, history).
        - If guard is defined and returns False, skip the step.
        
        Returns:
            (success: bool, final_state: Dict[str, Any], executed_step_ids: List[str])
        """
        # TODO: Compute topological execution order
        # TODO: Iterate through tasks in order
        # TODO: Check guard -> execute func -> update state
        # TODO: Verify invariants -> abort on failure
        # TODO: Return (True, final_state, executed_step_ids)
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Capstone Project: Build WorkflowGraph, a deterministic agent workflow orchestration engine integrating DAGs, guarded steps, and system invariants.",
            "exercise_goal": "Implement `add_step()`, `add_invariant()`, and `execute(initial_state)` on `WorkflowGraph`.",
            "expected_output": "Correctly schedule dependent tasks, skip unguarded steps, enforce invariants after each transition, and return execution history.",
            "tests.py": '''import pytest
from solution import WorkflowGraph

def test_workflow_graph_successful_pipeline():
    wf = WorkflowGraph()
    wf.add_step("extract", lambda s: s["raw_text"].strip())
    wf.add_step("score", lambda s: len(s["extract"]), dependencies=["extract"])
    wf.add_step(
        "flag_high_score", 
        lambda s: True, 
        dependencies=["score"],
        guard=lambda s: s["score"] > 5
    )
    
    # Invariant: raw_text must never be deleted
    wf.add_invariant(lambda s: "raw_text" in s)
    
    success, state, history = wf.execute({"raw_text": "  hello agent  "})
    assert success is True
    assert state["extract"] == "hello agent"
    assert state["score"] == 11
    assert state["flag_high_score"] is True
    assert history == ["extract", "score", "flag_high_score"]

def test_workflow_invariant_violation_abort():
    wf = WorkflowGraph()
    wf.add_step("corrupt", lambda s: s.pop("critical_key", None))
    wf.add_invariant(lambda s: "critical_key" in s)
    
    success, state, history = wf.execute({"critical_key": "safe_val"})
    assert success is False
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 3 (node-2-36 to node-2-50)...")
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
