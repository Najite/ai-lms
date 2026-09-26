#!/usr/bin/env python3
"""
Batch patch Module 3: Discrete Math, Automata & Graph Algorithms (Lessons 3.1 to 3.10)
Enforces:
1. Intuitive physical mental models with zero unintroduced jargon.
2. 3-Part Briefing card schema (exercise_about, exercise_goal, expected_output).
3. Guided starter code (clean types, docstrings, # TODO comments, no spoilers).
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
    "node-2-1": {
        "title": "Lesson 3.1: Boolean Logic & Truth Tables",
        "handbook_markdown": """# Lesson 3.1: Boolean Logic & Truth Tables

In computational logic and search filtering, every decision boils down to combinations of truth values (`True` and `False`). Mastering foundational boolean operators allows you to model complex decision systems without logical bugs.

---

### 💡 The Mental Model: Light Switches on a Circuit
Think of boolean logic as electrical switches wired together:
- **AND ($\land$)**: Two switches wired in series. The bulb lights up only if Switch A **AND** Switch B are closed.
- **OR ($\lor$)**: Two switches wired in parallel. The bulb lights up if Switch A **OR** Switch B is closed.
- **NOT ($\lnot$)**: An inverter switch. Closing the switch turns the light off.
- **XOR ($\oplus$)**: A two-way staircase switch. The bulb lights up if exactly one switch is flipped, but turns off if both are in the same state.

A **Truth Table** is simply a master blueprint listing every possible combination of switch positions and the resulting circuit state.

---

### 🔍 Deep Dive: Truth Tables in Python
Python provides native logical operators (`and`, `or`, `not`) and bitwise operators (`&`, `|`, `^`, `~`).

```python
# Truth table generation for XOR (Exclusive OR)
def xor_gate(a: bool, b: bool) -> bool:
    return (a and not b) or (not a and b)

assert xor_gate(True, True) == False
assert xor_gate(True, False) == True
assert xor_gate(False, True) == True
assert xor_gate(False, False) == False
```

When building automated query filters or rule engines, generating truth tables verifies that no unexpected condition falls through unhandled.
""",
        "starter_code": {
            "solution.py": '''"""
Boolean Logic & Truth Tables
Build a truth table evaluator for logical formulas.
"""

from typing import Callable, List, Tuple, Dict

def evaluate_truth_table(
    variables: List[str],
    eval_func: Callable[[Dict[str, bool]], bool]
) -> List[Tuple[Tuple[bool, ...], bool]]:
    """
    Generate the complete truth table for a given set of boolean variables and an evaluator.

    Args:
        variables: Ordered list of variable names (e.g. ['A', 'B'])
        eval_func: Function receiving a dictionary of variable assignments and returning a boolean.

    Returns:
        A list of tuples, where each tuple is ((val1, val2, ...), result)
        Combinations should be generated in lexicographical order (False, False), (False, True), etc.
    """
    # TODO: Generate all 2^N combinations of True/False for the given variables
    # TODO: Evaluate each combination using eval_func
    # TODO: Return ordered tuples ((assignments...), result)
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Learn how boolean operators combine to form truth tables that systematically evaluate every possible state of a logic circuit or query filter.",
            "exercise_goal": "Implement `evaluate_truth_table(variables, eval_func)` which generates all $2^N$ boolean combinations for the given variable names in ascending order `(False, ...)` to `(True, ...)`, evaluates each combination using `eval_func`, and returns a list of `((assignment_tuple), result)` pairs.",
            "expected_output": "For variables=['A', 'B'] and eval_func calculating A AND B, return [((False, False), False), ((False, True), False), ((True, False), False), ((True, True), True)].",
            "tests.py": '''import pytest
from solution import evaluate_truth_table

def test_single_variable_not():
    # NOT A
    result = evaluate_truth_table(["A"], lambda env: not env["A"])
    assert result == [
        ((False,), True),
        ((True,), False)
    ]

def test_two_variables_and():
    # A AND B
    result = evaluate_truth_table(["A", "B"], lambda env: env["A"] and env["B"])
    assert result == [
        ((False, False), False),
        ((False, True), False),
        ((True, False), False),
        ((True, True), True)
    ]

def test_two_variables_xor():
    # A XOR B
    result = evaluate_truth_table(["A", "B"], lambda env: env["A"] != env["B"])
    assert result == [
        ((False, False), False),
        ((False, True), True),
        ((True, False), True),
        ((True, True), False)
    ]

def test_three_variables_majority():
    # At least 2 are True
    result = evaluate_truth_table(["A", "B", "C"], lambda env: sum([env["A"], env["B"], env["C"]]) >= 2)
    assert len(result) == 8
    assert result[0] == ((False, False, False), False)
    assert result[-1] == ((True, True, True), True)
    # Check (False, True, True) -> True
    assert result[3] == ((False, True, True), True)
'''
        }
    },
    "node-2-2": {
        "title": "Lesson 3.2: Logical Implication & Preconditions",
        "handbook_markdown": """# Lesson 3.2: Logical Implication & Preconditions

In formal verification and system reliability, **Logical Implication** ($P \implies Q$, read "P implies Q") expresses contract obligations, guardrails, and preconditions.

---

### 💡 The Mental Model: The Legal Contract
Think of implication as a business contract: *"If you deliver the cargo ($P$), then we pay the invoice ($Q$)."*
- **You deliver cargo ($P=\\text{True}$) and get paid ($Q=\\text{True}$)** $\to$ Contract honored ($\text{True}$).
- **You deliver cargo ($P=\\text{True}$) and DO NOT get paid ($Q=\\text{False}$)** $\to$ Contract violated ($\text{False}$).
- **You do NOT deliver cargo ($P=\\text{False}$)** $\to$ Regardless of whether payment was sent ($Q=\\text{True}$ or $\\text{False}$), the contract was **not broken** (vacuous truth $\\text{True}$).

Mathematically:
$$P \implies Q \iff (\lnot P \lor Q)$$

---

### 🔍 Deep Dive: Guardrails as Implications
When specifying system constraints:
- "If user is not authenticated ($P$), they cannot view private files ($Q$)."
- If $P$ is false (user IS authenticated), this rule is satisfied and does not restrict file access.

```python
def implies(premise: bool, conclusion: bool) -> bool:
    return (not premise) or conclusion

assert implies(True, True) is True
assert implies(True, False) is False
assert implies(False, True) is True
assert implies(False, False) is True
```
""",
        "starter_code": {
            "solution.py": '''"""
Logical Implication & Preconditions
Validate data records against conditional business rules.
"""

from typing import Dict, Any, Callable, List, Tuple

def validate_rule_implication(
    records: List[Dict[str, Any]],
    precondition: Callable[[Dict[str, Any]], bool],
    postcondition: Callable[[Dict[str, Any]], bool]
) -> Tuple[bool, List[Dict[str, Any]]]:
    """
    Verify that all records satisfy the implication: precondition(r) => postcondition(r).

    Args:
        records: List of dictionary data records.
        precondition: Predicate function P(r).
        postcondition: Predicate function Q(r).

    Returns:
        A tuple (is_valid, violating_records):
        - is_valid: True if ALL records satisfy P(r) => Q(r), False otherwise.
        - violating_records: List of records where P(r) is True but Q(r) is False.
    """
    # TODO: Iterate through each record
    # TODO: Check if precondition is True
    # TODO: If precondition is True and postcondition is False, record is violating
    # TODO: Return (len(violations) == 0, violations)
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand material implication (P => Q) and use it to validate conditional invariant rules across datasets.",
            "exercise_goal": "Write `validate_rule_implication(records, precondition, postcondition)` to detect any records where `precondition` is met (`True`) but `postcondition` fails (`False`).",
            "expected_output": "Return `(True, [])` if no records violate the implication, or `(False, [violating_record, ...])` containing only records where P was True and Q was False.",
            "tests.py": '''import pytest
from solution import validate_rule_implication

def test_all_valid_implications():
    records = [
        {"role": "admin", "has_2fa": True},
        {"role": "admin", "has_2fa": True},
        {"role": "guest", "has_2fa": False},
        {"role": "guest", "has_2fa": True},
    ]
    # Rule: If role == 'admin' => has_2fa == True
    is_valid, violations = validate_rule_implication(
        records,
        precondition=lambda r: r["role"] == "admin",
        postcondition=lambda r: r["has_2fa"] is True
    )
    assert is_valid is True
    assert violations == []

def test_implication_violations():
    records = [
        {"id": 1, "status": "shipped", "tracking_number": "TRK-101"},
        {"id": 2, "status": "pending", "tracking_number": None},
        {"id": 3, "status": "shipped", "tracking_number": None}, # VIOLATION
    ]
    # Rule: status == 'shipped' => tracking_number is not None
    is_valid, violations = validate_rule_implication(
        records,
        precondition=lambda r: r["status"] == "shipped",
        postcondition=lambda r: r["tracking_number"] is not None
    )
    assert is_valid is False
    assert len(violations) == 1
    assert violations[0]["id"] == 3

def test_vacuous_truth():
    records = [{"status": "draft", "signed": False}]
    # Precondition never met => rule passes vacuously
    is_valid, violations = validate_rule_implication(
        records,
        precondition=lambda r: r["status"] == "published",
        postcondition=lambda r: r["signed"] is True
    )
    assert is_valid is True
    assert violations == []
'''
        }
    },
    "node-2-3": {
        "title": "Lesson 3.3: De Morgans Laws & Query Filtering",
        "handbook_markdown": """# Lesson 3.3: De Morgan's Laws & Query Filtering

In database optimization and search filtering, complex nested `NOT` queries can be slow and error-prone. **De Morgan's Laws** provide the mathematical equivalence to simplify negations of compound statements.

---

### 💡 The Mental Model: The Denial of Compound Orders
Imagine a cafeteria menu with meal combos:
1. *"I do NOT want both a Burger AND Fries"* ($\lnot(A \land B)$):
   - This is identical to saying: *"Give me NO Burger OR NO Fries"* ($\lnot A \lor \lnot B$).
2. *"I do NOT want either Soup OR Salad"* ($\lnot(A \lor B)$):
   - This is identical to saying: *"Give me NO Soup AND NO Salad"* ($\lnot A \land \lnot B$).

---

### 🔍 Deep Dive: The Formal Laws
$$\lnot (P \land Q) \iff (\lnot P \lor \lnot Q)$$
$$\lnot (P \lor Q) \iff (\lnot P \land \lnot Q)$$

#### Why This Matters in Engineering:
When executing SQL or Elasticsearch filters, `NOT (department = 'HR' AND active = true)` can be converted into `department != 'HR' OR active = false`, allowing query planners to leverage index lookups rather than full-table scans.
""",
        "starter_code": {
            "solution.py": '''"""
De Morgan's Laws & Query Filtering
Filter document collections by applying inverted compound predicates.
"""

from typing import Dict, Any, List

def filter_not_both(records: List[Dict[str, Any]], key_a: str, key_b: str) -> List[Dict[str, Any]]:
    """
    Filter records satisfying NOT (record[key_a] is True AND record[key_b] is True).
    Applies De Morgan's Law: NOT (A and B) <=> (NOT A) or (NOT B).

    Args:
        records: List of record dictionaries.
        key_a: First boolean key name.
        key_b: Second boolean key name.

    Returns:
        Filtered list of records where at least one key is False (or missing/falsy).
    """
    # TODO: Implement using De Morgan's transformation
    pass

def filter_neither(records: List[Dict[str, Any]], key_a: str, key_b: str) -> List[Dict[str, Any]]:
    """
    Filter records satisfying NOT (record[key_a] is True OR record[key_b] is True).
    Applies De Morgan's Law: NOT (A or B) <=> (NOT A) and (NOT B).

    Args:
        records: List of record dictionaries.
        key_a: First boolean key name.
        key_b: Second boolean key name.

    Returns:
        Filtered list of records where BOTH keys are False (or missing/falsy).
    """
    # TODO: Implement using De Morgan's transformation
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Apply De Morgan's laws to simplify inverted compound query filters over structured record datasets.",
            "exercise_goal": "Implement `filter_not_both(records, key_a, key_b)` to return items where NOT (A AND B) holds, and `filter_neither(records, key_a, key_b)` to return items where NOT (A OR B) holds.",
            "expected_output": "`filter_not_both` excludes records where both keys are True; `filter_neither` includes only records where both keys are False/absent.",
            "tests.py": '''import pytest
from solution import filter_not_both, filter_neither

@pytest.fixture
def sample_dataset():
    return [
        {"id": 1, "is_vip": True, "is_flagged": True},
        {"id": 2, "is_vip": True, "is_flagged": False},
        {"id": 3, "is_vip": False, "is_flagged": True},
        {"id": 4, "is_vip": False, "is_flagged": False},
    ]

def test_filter_not_both(sample_dataset):
    # NOT (is_vip AND is_flagged) should keep IDs 2, 3, 4
    result = filter_not_both(sample_dataset, "is_vip", "is_flagged")
    ids = [r["id"] for r in result]
    assert ids == [2, 3, 4]

def test_filter_neither(sample_dataset):
    # NOT (is_vip OR is_flagged) should keep only ID 4
    result = filter_neither(sample_dataset, "is_vip", "is_flagged")
    ids = [r["id"] for r in result]
    assert ids == [4]

def test_filter_missing_keys():
    records = [
        {"id": 10},
        {"id": 11, "a": True},
        {"id": 12, "a": True, "b": True}
    ]
    result_neither = filter_neither(records, "a", "b")
    assert [r["id"] for r in result_neither] == [10]
'''
        }
    },
    "node-2-4": {
        "title": "Lesson 3.4: Boolean Formulas & Query Trees",
        "handbook_markdown": """# Lesson 3.4: Boolean Formulas & Query Trees

When querying documents, search engines don't evaluate raw string queries linearly. They parse expressions like `(python OR rust) AND NOT deprecated` into an **Abstract Syntax Tree (AST)** of boolean operations.

---

### 💡 The Mental Model: The Family Tree of Decisions
Think of an evaluation tree where leaves are questions and branch nodes are logical connectors:
```
           [ AND ]
          /       \
      [ OR ]     [ NOT ]
      /    \        |
'python'  'rust' 'deprecated'
```
To evaluate a document, you evaluate from the bottom leaves upward to the root:
1. Is 'python' in doc? $\to \text{True}$.
2. Is 'rust' in doc? $\to \text{False}$.
3. Left branch: `True OR False` $\to \text{True}$.
4. Is 'deprecated' in doc? $\to \text{False}$.
5. Right branch: `NOT False` $\to \text{True}$.
6. Root: `True AND True` $\to \text{True}$ (Document matches!).

---

### 🔍 Deep Dive: Representing Query Nodes in Python
Using tuples or dictionaries, we can build a lightweight AST evaluator:
- Leaf: `("TERM", "python")`
- AND: `("AND", left_node, right_node)`
- OR: `("OR", left_node, right_node)`
- NOT: `("NOT", child_node)`
""",
        "starter_code": {
            "solution.py": '''"""
Boolean Formulas & Query Trees
Evaluate tree-structured boolean queries against document tags.
"""

from typing import Union, Tuple, Set

# Node types:
# ("TERM", "tag_name")
# ("NOT", child_node)
# ("AND", left_node, right_node)
# ("OR", left_node, right_node)
QueryNode = Union[
    Tuple[str, str],
    Tuple[str, "QueryNode"],
    Tuple[str, "QueryNode", "QueryNode"]
]

def evaluate_query_tree(node: QueryNode, document_tags: Set[str]) -> bool:
    """
    Recursively evaluate an AST boolean query node against a set of document tags.

    Args:
        node: The root query AST node tuple.
        document_tags: Set of tags present on the document.

    Returns:
        True if the document tags satisfy the query formula, False otherwise.
    """
    # TODO: Identify node operation ("TERM", "NOT", "AND", "OR")
    # TODO: Recursively evaluate child nodes
    # TODO: Return boolean evaluation result
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Learn recursive tree evaluation for boolean expressions used in search engine query filters and policy engines.",
            "exercise_goal": "Implement `evaluate_query_tree(node, document_tags)` to recursively process `('TERM', tag)`, `('NOT', child)`, `('AND', left, right)`, and `('OR', left, right)` tuples against a set of string tags.",
            "expected_output": "Return `True` if the document tags satisfy the logical AST formula, and `False` otherwise.",
            "tests.py": '''import pytest
from solution import evaluate_query_tree

def test_term_evaluation():
    tags = {"python", "ai", "backend"}
    assert evaluate_query_tree(("TERM", "python"), tags) is True
    assert evaluate_query_tree(("TERM", "java"), tags) is False

def test_not_evaluation():
    tags = {"python", "ai"}
    assert evaluate_query_tree(("NOT", ("TERM", "java")), tags) is True
    assert evaluate_query_tree(("NOT", ("TERM", "python")), tags) is False

def test_and_evaluation():
    tags = {"python", "ai"}
    and_node = ("AND", ("TERM", "python"), ("TERM", "ai"))
    assert evaluate_query_tree(and_node, tags) is True
    
    missing_and = ("AND", ("TERM", "python"), ("TERM", "rust"))
    assert evaluate_query_tree(missing_and, tags) is False

def test_nested_complex_query():
    # (python OR rust) AND NOT legacy
    query = (
        "AND",
        ("OR", ("TERM", "python"), ("TERM", "rust")),
        ("NOT", ("TERM", "legacy"))
    )
    
    doc1 = {"python", "modern"}
    assert evaluate_query_tree(query, doc1) is True
    
    doc2 = {"rust", "legacy"}
    assert evaluate_query_tree(query, doc2) is False # has legacy
    
    doc3 = {"javascript"}
    assert evaluate_query_tree(query, doc3) is False # neither python nor rust
'''
        }
    },
    "node-2-5": {
        "title": "Lesson 3.5: SAT Solving & Constraint Satisfaction",
        "handbook_markdown": """# Lesson 3.5: SAT Solving & Constraint Satisfaction

The **Boolean Satisfiability Problem (SAT)** asks: given a boolean formula, is there an assignment of truth values to variables that makes the entire formula `True`?

SAT is foundational to computer science (the first proven NP-complete problem). SAT solvers power package dependency resolvers (like `pip` and `cargo`), cloud IAM security policy checkers, and hardware verification circuits.

---

### 💡 The Mental Model: The Seating Arrangement
Imagine arranging dinner guests with constraints:
- "Alice wants to sit next to Bob or Charlie ($A \land (B \lor C)$)."
- "Bob refuses to sit with Alice if David is present."
A SAT solver systematically searches assignments until it finds a seating chart that violates zero rules, or proves that no valid seating chart can possibly exist.

---

### 🔍 Deep Dive: Conjunctive Normal Form (CNF)
Most SAT solvers expect formulas in **CNF** (AND of ORs):
$$(A \lor B) \land (\lnot A \lor C) \land (\lnot B \lor \lnot C)$$
- Each parenthesized group is a **clause** (literals connected with OR).
- The whole formula is satisfied only if **every clause** evaluates to `True`.
""",
        "starter_code": {
            "solution.py": '''"""
SAT Solving & Constraint Satisfaction
A simple backtracking SAT solver for formulas in Conjunctive Normal Form (CNF).
"""

from typing import List, Dict, Optional

# A literal is an integer:
# Positive integer k means variable k is True.
# Negative integer -k means variable k is False.
# A clause is a list of integers: [1, -2] means (x1 OR NOT x2).
# A CNF formula is a list of clauses.
CNFFormula = List[List[int]]

def solve_cnf_sat(num_vars: int, clauses: CNFFormula) -> Optional[Dict[int, bool]]:
    """
    Find a satisfying assignment for a CNF formula with variables 1..num_vars using backtracking.

    Args:
        num_vars: Number of boolean variables (indexed 1 to num_vars).
        clauses: List of disjunctive clauses (e.g. [[1, -2], [2, 3]]).

    Returns:
        A dictionary mapping variable index (1..num_vars) -> bool if satisfiable,
        or None if no satisfying assignment exists.
    """
    # TODO: Implement recursive backtracking search (DPLL / Branch & Bound)
    # TODO: At each step, choose an unassigned variable and try True then False
    # TODO: Check if current assignment violates any clause
    # TODO: Return assignment dict if all clauses satisfied, else None
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand the Boolean Satisfiability problem (SAT) in Conjunctive Normal Form (CNF) and implement a backtracking solver.",
            "exercise_goal": "Write `solve_cnf_sat(num_vars, clauses)` that finds a valid `{var: bool}` assignment satisfying all clauses, or returns `None` if unsatisfiable.",
            "expected_output": "For clauses [[1, 2], [-1]], return an assignment where var 1=False and var 2=True.",
            "tests.py": '''import pytest
from solution import solve_cnf_sat

def test_simple_satisfiable():
    # (x1 OR x2) AND (NOT x1)
    clauses = [[1, 2], [-1]]
    result = solve_cnf_sat(2, clauses)
    assert result is not None
    assert result[1] is False
    assert result[2] is True

def test_simple_unsatisfiable():
    # (x1) AND (NOT x1)
    clauses = [[1], [-1]]
    result = solve_cnf_sat(1, clauses)
    assert result is None

def test_three_variable_cnf():
    # (x1 OR x2 OR x3) AND (NOT x1 OR NOT x2) AND (NOT x3)
    clauses = [
        [1, 2, 3],
        [-1, -2],
        [-3]
    ]
    result = solve_cnf_sat(3, clauses)
    assert result is not None
    assert result[3] is False
    # Verify the formula evaluates to True with returned result
    for clause in clauses:
        clause_val = False
        for lit in clause:
            var = abs(lit)
            val = result[var] if lit > 0 else not result[var]
            if val:
                clause_val = True
                break
        assert clause_val is True
'''
        }
    },
    "node-2-6": {
        "title": "Lesson 3.6: Predicate Logic & Quantifiers",
        "handbook_markdown": """# Lesson 3.6: Predicate Logic & Quantifiers

While propositional logic deals with static truth statements, **Predicate Logic** evaluates statements over domains of objects using quantifiers:
- **Universal Quantifier ($\forall$, "For All")**: $\forall x \in S, P(x)$ asserts that predicate $P$ holds for **every single** element in $S$.
- **Existential Quantifier ($\exists$, "There Exists")**: $\exists x \in S, P(x)$ asserts that predicate $P$ holds for **at least one** element in $S$.

---

### 💡 The Mental Model: Security Checkpoints
- **Universal Guard ($\forall$)**: *"Every passenger on board ($\forall p$) must have a valid ticket ($T(p)$)."*
  - If even 1 passenger lacks a ticket, the universal claim fails.
- **Existential Guard ($\exists$)**: *"There is at least one doctor on the plane ($\exists p, D(p)$)."*
  - If you find 1 doctor, the existential claim succeeds immediately.

---

### 🔍 Deep Dive: Python's `all()` and `any()`
Python provides first-class support for quantifiers via built-ins:
```python
users = [{"name": "Alice", "active": True}, {"name": "Bob", "active": False}]

# Universal: For all users, user is active?
all_active = all(u["active"] for u in users) # False

# Existential: Exists at least one active user?
any_active = any(u["active"] for u in users) # True
```
""",
        "starter_code": {
            "solution.py": '''"""
Predicate Logic & Quantifiers
Build a declarative rule auditor using universal and existential quantifiers.
"""

from typing import List, Dict, Any, Callable

def for_all(items: List[Any], predicate: Callable[[Any], bool]) -> bool:
    """
    Universal quantifier: Returns True if predicate(x) is True for ALL items.
    Returns True for an empty list (vacuous truth).
    """
    # TODO: Implement universal quantifier
    pass

def exists(items: List[Any], predicate: Callable[[Any], bool]) -> bool:
    """
    Existential quantifier: Returns True if predicate(x) is True for AT LEAST ONE item.
    Returns False for an empty list.
    """
    # TODO: Implement existential quantifier
    pass

def audit_dataset_invariants(
    records: List[Dict[str, Any]],
    universal_rules: List[Callable[[Dict[str, Any]], bool]],
    existential_rules: List[Callable[[Dict[str, Any]], bool]]
) -> Dict[str, bool]:
    """
    Audit a dataset against lists of universal and existential rules.

    Returns:
        Dict {"universal_passed": bool, "existential_passed": bool}
    """
    # TODO: Verify all universal_rules hold for ALL records
    # TODO: Verify all existential_rules hold for AT LEAST ONE record
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master universal (forall) and existential (exists) quantifiers to audit system invariants and policy compliance.",
            "exercise_goal": "Implement `for_all(items, predicate)`, `exists(items, predicate)`, and `audit_dataset_invariants(records, universal_rules, existential_rules)`.",
            "expected_output": "Return boolean results proving all universal rules pass across all records and every existential rule is matched by at least one record.",
            "tests.py": '''import pytest
from solution import for_all, exists, audit_dataset_invariants

def test_for_all_and_exists_primitives():
    nums = [2, 4, 6, 8]
    assert for_all(nums, lambda x: x % 2 == 0) is True
    assert for_all(nums, lambda x: x > 5) is False
    assert exists(nums, lambda x: x == 6) is True
    assert exists(nums, lambda x: x == 7) is False

def test_empty_list_quantifier_semantics():
    assert for_all([], lambda x: False) is True  # Vacuously true
    assert exists([], lambda x: True) is False   # Nothing exists

def test_audit_dataset_invariants():
    users = [
        {"id": 1, "role": "admin", "score": 95},
        {"id": 2, "role": "editor", "score": 80},
        {"id": 3, "role": "viewer", "score": 70},
    ]
    
    univ_rules = [
        lambda u: u["score"] >= 50,
        lambda u: "id" in u
    ]
    exist_rules = [
        lambda u: u["role"] == "admin",
        lambda u: u["score"] > 90
    ]
    
    result = audit_dataset_invariants(users, univ_rules, exist_rules)
    assert result == {
        "universal_passed": True,
        "existential_passed": True
    }
'''
        }
    },
    "node-2-7": {
        "title": "Lesson 3.7: Bitwise Operations & Masking",
        "handbook_markdown": """# Lesson 3.7: Bitwise Operations & Masking

At the silicon level, data is stored as streams of binary bits (`0` and `1`). Bitwise operations allow you to manipulate individual bits directly with maximum hardware execution speed.

---

### 💡 The Mental Model: The Stencil Mask
Think of bitwise masking like painting with a stencil:
- **Bitwise AND (`&`)**: The stencil. Only holes in the stencil let paint through. Useful to test or extract specific flags.
- **Bitwise OR (`|`)**: Combining layers. Stencils overlay and combine colored shapes. Useful to set flags.
- **Bitwise XOR (`^`)**: The toggle switch. Applying the stencil inverts the color.
- **Bitwise NOT (`~`)**: Negative film inversion. 0s become 1s, 1s become 0s.
- **Bit Shift (`<<`, `>>`)**: Sliding the entire conveyor belt left or right. Left shift by 1 multiplies by 2; right shift by 1 divides by 2.

---

### 🔍 Deep Dive: Flag Bitmasks
```python
# Permission flags
READ    = 1 << 0  # 0001 (1)
WRITE   = 1 << 1  # 0010 (2)
EXECUTE = 1 << 2  # 0100 (4)

# Set Read and Execute:
user_perms = READ | EXECUTE  # 0101 (5)

# Check if Write is permitted:
has_write = (user_perms & WRITE) != 0  # False
```
""",
        "starter_code": {
            "solution.py": '''"""
Bitwise Operations & Masking
Implement a compact, high-performance permission manager using bitmasks.
"""

class PermissionFlags:
    READ = 1 << 0       # Bit 0 (Value 1)
    WRITE = 1 << 1      # Bit 1 (Value 2)
    EXECUTE = 1 << 2    # Bit 2 (Value 4)
    DELETE = 1 << 3     # Bit 3 (Value 8)

class UserRoleMask:
    def __init__(self, initial_mask: int = 0):
        self.mask = initial_mask

    def grant(self, permission_flag: int) -> None:
        """Add a permission flag to the mask."""
        # TODO: Use bitwise OR to set flag
        pass

    def revoke(self, permission_flag: int) -> None:
        """Remove a permission flag from the mask."""
        # TODO: Use bitwise AND with inverted flag to clear
        pass

    def has_permission(self, permission_flag: int) -> bool:
        """Check if a specific permission flag is present in the mask."""
        # TODO: Use bitwise AND to test flag
        pass

    def toggle(self, permission_flag: int) -> None:
        """Invert the state of a specific permission flag."""
        # TODO: Use bitwise XOR to toggle flag
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Learn bitwise operators (&, |, ^, ~, <<) to build high-speed, memory-efficient bitmask permission flags.",
            "exercise_goal": "Implement `grant()`, `revoke()`, `has_permission()`, and `toggle()` on `UserRoleMask` using bitwise operations.",
            "expected_output": "Correctly manipulate the integer bitmask allowing multi-flag querying and in-place updates.",
            "tests.py": '''import pytest
from solution import PermissionFlags, UserRoleMask

def test_initial_empty_mask():
    user = UserRoleMask()
    assert user.has_permission(PermissionFlags.READ) is False
    assert user.mask == 0

def test_grant_and_check_permissions():
    user = UserRoleMask()
    user.grant(PermissionFlags.READ)
    user.grant(PermissionFlags.WRITE)
    
    assert user.has_permission(PermissionFlags.READ) is True
    assert user.has_permission(PermissionFlags.WRITE) is True
    assert user.has_permission(PermissionFlags.EXECUTE) is False
    assert user.mask == 3

def test_revoke_permissions():
    user = UserRoleMask(PermissionFlags.READ | PermissionFlags.WRITE | PermissionFlags.EXECUTE)
    user.revoke(PermissionFlags.WRITE)
    
    assert user.has_permission(PermissionFlags.READ) is True
    assert user.has_permission(PermissionFlags.WRITE) is False
    assert user.has_permission(PermissionFlags.EXECUTE) is True

def test_toggle_permissions():
    user = UserRoleMask()
    user.toggle(PermissionFlags.DELETE)
    assert user.has_permission(PermissionFlags.DELETE) is True
    user.toggle(PermissionFlags.DELETE)
    assert user.has_permission(PermissionFlags.DELETE) is False
'''
        }
    },
    "node-2-8": {
        "title": "Lesson 3.8: Bitsets & High-Speed Flags",
        "handbook_markdown": """# Lesson 3.8: Bitsets & High-Speed Flags

A standard Python `bool` object consumes **28 bytes** of heap memory. In high-throughput systems tracking millions of items (such as user IDs or visited URLs), storing 10 million booleans in a standard list requires ~280 MB of RAM.

A **Bitset** (or Bit Array) stores 8 boolean flags per single byte, compressing memory by **224x** and allowing CPU registers to execute 64 checks simultaneously.

---

### 💡 The Mental Model: The Locker Room Key Rack
Think of a bitset as a grid of 64 locker keys per shelf:
- Item ID 0 is bit 0 on shelf 0.
- Item ID 63 is bit 63 on shelf 0.
- Item ID 64 is bit 0 on shelf 1 (`64 // 64 = shelf 1`, `64 % 64 = bit 0`).

---

### 🔍 Deep Dive: Implementing a Dynamic Bitset
To set index $i$:
1. Array index: `word_index = i >> 6` (divide by 64).
2. Bit position: `bit_offset = i & 63` (modulo 64).
3. Set bit: `words[word_index] |= (1 << bit_offset)`.
""",
        "starter_code": {
            "solution.py": '''"""
Bitsets & High-Speed Flags
Implement an expandable, memory-efficient Bitset for tracking integer presence.
"""

from typing import List

class BitSet:
    def __init__(self, size: int = 64):
        """Initialize bitset capable of holding at least `size` bits."""
        num_words = (size + 63) // 64
        self.words: List[int] = [0] * max(1, num_words)

    def add(self, index: int) -> None:
        """Mark `index` as present (set bit to 1). Resize dynamically if necessary."""
        # TODO: Expand self.words if index exceeds current capacity
        # TODO: Set the corresponding bit using bitwise OR
        pass

    def remove(self, index: int) -> None:
        """Mark `index` as absent (set bit to 0)."""
        # TODO: Clear the corresponding bit using bitwise AND NOT
        pass

    def contains(self, index: int) -> bool:
        """Return True if `index` is present, False otherwise."""
        # TODO: Test the corresponding bit
        pass

    def count(self) -> int:
        """Return the total number of set bits (popcount)."""
        # TODO: Sum the bit_count() across all words
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Build an ultra-compact BitSet array storing 64 boolean flags per 64-bit integer word.",
            "exercise_goal": "Implement `BitSet` with `add(index)`, `remove(index)`, `contains(index)`, and `count()` supporting dynamic resizing.",
            "expected_output": "Efficiently track sparse and dense integer indices, accurately reporting membership and active population count.",
            "tests.py": '''import pytest
from solution import BitSet

def test_basic_set_and_contains():
    bs = BitSet(64)
    assert bs.contains(5) is False
    bs.add(5)
    bs.add(10)
    assert bs.contains(5) is True
    assert bs.contains(10) is True
    assert bs.contains(6) is False

def test_remove_bit():
    bs = BitSet(64)
    bs.add(42)
    assert bs.contains(42) is True
    bs.remove(42)
    assert bs.contains(42) is False

def test_dynamic_expansion_across_word_boundaries():
    bs = BitSet(64)
    bs.add(150) # In word index 150 // 64 = 2
    assert bs.contains(150) is True
    assert bs.contains(0) is False

def test_population_count():
    bs = BitSet()
    assert bs.count() == 0
    bs.add(1)
    bs.add(2)
    bs.add(300)
    assert bs.count() == 3
    bs.remove(2)
    assert bs.count() == 2
'''
        }
    },
    "node-2-9": {
        "title": "Lesson 3.9: Bit Manipulation Tricks",
        "handbook_markdown": """# Lesson 3.9: Bit Manipulation Tricks

In low-level algorithm design, mathematical properties of binary two's-complement arithmetic enable constant-time $O(1)$ calculations that would otherwise require loops.

---

### 💡 The Core Bit Tricks
1. **Check Power of 2**:
   - A power of 2 has exactly one binary `1` bit (e.g. $8 = 1000_2$, $7 = 0111_2$).
   - `n & (n - 1) == 0` clears the lowest bit. If $n > 0$ and `n & (n - 1) == 0`, $n$ is a power of 2.
2. **Clear the Lowest Set Bit**:
   - `n & (n - 1)` strips the least significant 1-bit.
3. **Isolate the Lowest Set Bit**:
   - `n & -n` isolates the rightmost 1-bit.
4. **Fast Parity (Even or Odd)**:
   - `n & 1 == 0` (Even), `n & 1 == 1` (Odd).

---

### 🔍 Deep Dive: Brian Kernighan’s Algorithm
To count set bits without looping 64 times, Kernighan's algorithm iterates only as many times as there are `1` bits:
```python
def count_set_bits(n: int) -> int:
    count = 0
    while n > 0:
        n &= (n - 1)  # Clear lowest set bit
        count += 1
    return count
```
""",
        "starter_code": {
            "solution.py": '''"""
Bit Manipulation Tricks
Fast constant-time and Kernighan bitwise algorithms.
"""

def is_power_of_two(n: int) -> bool:
    """Return True if n is a positive power of 2, False otherwise."""
    # TODO: Implement in O(1) using bit manipulation
    pass

def get_lowest_set_bit(n: int) -> int:
    """Return the value of the isolated lowest set bit (e.g. 12 (1100b) -> 4 (0100b)). Return 0 if n == 0."""
    # TODO: Implement in O(1) using two's complement trick
    pass

def count_set_bits_kernighan(n: int) -> int:
    """Count the number of 1-bits in n using Brian Kernighan's algorithm."""
    # TODO: Implement Kernighan loop
    pass
'''
        },
        "test_suite": {
            "exercise_about": "Master classic binary tricks (Kernighan's algorithm, power of two detection, lowest set bit isolation) operating in optimal time.",
            "exercise_goal": "Implement `is_power_of_two(n)`, `get_lowest_set_bit(n)`, and `count_set_bits_kernighan(n)`.",
            "expected_output": "Accurately compute powers of two, bit isolations, and bit counts for positive integers.",
            "tests.py": '''import pytest
from solution import is_power_of_two, get_lowest_set_bit, count_set_bits_kernighan

def test_is_power_of_two():
    assert is_power_of_two(1) is True   # 2^0
    assert is_power_of_two(2) is True   # 2^1
    assert is_power_of_two(16) is True  # 2^4
    assert is_power_of_two(1024) is True
    
    assert is_power_of_two(0) is False
    assert is_power_of_two(-8) is False
    assert is_power_of_two(14) is False

def test_get_lowest_set_bit():
    assert get_lowest_set_bit(0) == 0
    assert get_lowest_set_bit(1) == 1       # 0001 -> 1
    assert get_lowest_set_bit(12) == 4      # 1100 -> 0100 (4)
    assert get_lowest_set_bit(40) == 8      # 101000 -> 001000 (8)

def test_count_set_bits_kernighan():
    assert count_set_bits_kernighan(0) == 0
    assert count_set_bits_kernighan(7) == 3   # 0111
    assert count_set_bits_kernighan(15) == 4  # 1111
    assert count_set_bits_kernighan(1023) == 10
'''
        }
    },
    "node-2-10": {
        "title": "Lesson 3.10: Bloom Filters: Fast Membership",
        "handbook_markdown": """# Lesson 3.10: Bloom Filters: Fast Membership

A **Bloom Filter** is a space-efficient probabilistic data structure used to test whether an element is a member of a set.

It can return:
- **"Definitely not in set"** (Zero false negatives: 100% guaranteed).
- **"Possibly in set"** (Small, tunable false positive rate).

---

### 💡 The Mental Model: The Bouncer's Scratchpad
Imagine a nightclub bouncer with a 1,000-cell grid:
- When a VIP arrives, the bouncer hashes their name with 3 different colored stamps to mark 3 specific grid numbers.
- When an unknown guest asks for entry, the bouncer checks those 3 numbers:
  - If **any** of the 3 numbers is blank, the person has **definitely never registered**.
  - If all 3 numbers are marked, they **probably registered** (though other guests' stamps might have accidentally marked those same cells).

---

### 🔍 Deep Dive: Architecture
1. A bit array of size $m$ initialized to all 0s.
2. $k$ independent hash functions mapping an item string to $[0, m-1]$.
3. **Add item**: Hash item with all $k$ functions and set those bit indices to 1.
4. **Query item**: Hash item with all $k$ functions. If **all** bits are 1, return `True` (maybe present). If **any** bit is 0, return `False` (definitely not present).
""",
        "starter_code": {
            "solution.py": '''"""
Bloom Filters: Fast Membership
Implement a fixed-size probabilistic Bloom filter using hash functions.
"""

import hashlib
from typing import List

class BloomFilter:
    def __init__(self, size: int = 256, hash_count: int = 3):
        self.size = size
        self.hash_count = hash_count
        self.bit_array = [False] * size

    def _hashes(self, item: str) -> List[int]:
        """Generate `hash_count` deterministic integer hash indices for `item` in range [0, self.size - 1]."""
        indices = []
        for seed in range(self.hash_count):
            h = int(hashlib.sha256(f"{seed}:{item}".encode()).hexdigest(), 16)
            indices.append(h % self.size)
        return indices

    def add(self, item: str) -> None:
        """Add an item to the Bloom filter."""
        # TODO: Compute _hashes(item) and set those bit_array positions to True
        pass

    def might_contain(self, item: str) -> bool:
        """
        Check if item might be in the set.
        Returns False if item is DEFINITELY not present.
        Returns True if item is PROBABLY present.
        """
        # TODO: Compute _hashes(item) and verify if all positions are True
        pass
'''
        },
        "test_suite": {
            "exercise_about": "Understand probabilistic data structures and implement a Bloom filter for high-speed set membership with zero false negatives.",
            "exercise_goal": "Implement `add(item)` and `might_contain(item)` on `BloomFilter` using multi-hash bit array indexing.",
            "expected_output": "Never return False for an added item (zero false negatives), and return False for unadded items when hash bits are unset.",
            "tests.py": '''import pytest
from solution import BloomFilter

def test_zero_false_negatives():
    bf = BloomFilter(size=512, hash_count=3)
    items = ["apple", "banana", "cherry", "date"]
    for item in items:
        bf.add(item)
    
    # Every added item must return True
    for item in items:
        assert bf.might_contain(item) is True

def test_definitely_not_present():
    bf = BloomFilter(size=512, hash_count=3)
    bf.add("known_user_123")
    
    # An unrelated item with unset bits returns False
    assert bf.might_contain("unknown_random_user_9999") is False

def test_empty_filter():
    bf = BloomFilter(size=128, hash_count=2)
    assert bf.might_contain("anything") is False
'''
        }
    }
}

def apply_patches():
    print(f"Applying patch to {len(LESSONS_DATA)} lessons in Module 3 (node-2-1 to node-2-10)...")
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
