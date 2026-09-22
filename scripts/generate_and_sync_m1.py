#!/usr/bin/env python3
"""
scripts/generate_and_sync_m1.py
Complete sync script: generates clean lesson content for all 50 Module 1 nodes
and updates Supabase via the Management API in batches of 10.
"""

import json
import urllib.request
import sys
import os

# Read OAuth token
TOKEN_PATH = "/home/gamp/.gemini/antigravity-ide/mcp_oauth_tokens.json"
PROJECT_REF = "lfsyndffrfwvdfzjsagl"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"

with open(TOKEN_PATH, "r") as f:
    token_data = json.load(f)

ACCESS_TOKEN = token_data["https://mcp.supabase.com/mcp"]["token"]["access_token"]

def execute_sql(sql_query: str, label: str = ""):
    """Execute a SQL query via Supabase Management API."""
    req = urllib.request.Request(
        API_URL,
        data=json.dumps({"query": sql_query}).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {ACCESS_TOKEN}",
            "Content-Type": "application/json"
        },
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            if label:
                print(f"  ✓ {label}")
            return result
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        print(f"  ✗ {label} - HTTP {e.code}: {body[:200]}")
        raise

def esc(text: str) -> str:
    """Escape single quotes for SQL string literals."""
    if text is None:
        return "NULL"
    return text.replace("'", "''")

def make_json_sql(obj) -> str:
    """Convert Python object to SQL JSONB literal."""
    return f"'{esc(json.dumps(obj))}'::jsonb"

def make_json_array_sql(arr: list) -> str:
    """Convert Python list to SQL JSONB array literal."""
    return f"'{esc(json.dumps(arr))}'::jsonb"


# ==============================================================================
# LESSON DATA: All 50 Lessons for Module 1
# ==============================================================================

# Import Part 1 (lessons 1-10) and Parts 2-6 (lessons 11-50) from their files
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# ----- Part 1 lessons (1.1 - 1.10) -----
M1_PART1 = [
    {
        "num": 1,
        "title": "Variables, Data Types & The Python Interpreter",
        "xp": 100,
        "subtopics": [
            "1.1.1 RAM architecture and heap object allocation model in CPython",
            "1.1.2 Primitive types: int, float, str, and bool definitions",
            "1.1.3 Variable naming conventions (PEP 8 snake_case) and assignment mechanics",
            "1.1.4 Dynamic typing vs static typing and runtime type introspection via type()"
        ],
        "failure_mode": "Implicit type coercion assumptions (e.g. attempting 'Tokens: ' + 100 instead of str(100)), causing TypeError.",
        "verification_criteria": "Implement `parse_model_spec(name, tokens, cost)` returning a validated dict with proper types.",
        "starter_code": {"solution.py": "def parse_model_spec(name, tokens, cost):\n    \"\"\"\n    Returns {'name': str, 'tokens': int, 'cost': float} with proper type casting.\n    \"\"\"\n    # TODO: Implement type casting and dictionary formation\n    pass\n"},
        "test_suite": {"tests.py": "from solution import parse_model_spec\n\ndef test_parse():\n    res = parse_model_spec('claude-3-5-sonnet', '8192', '0.003')\n    assert res == {'name': 'claude-3-5-sonnet', 'tokens': 8192, 'cost': 0.003}\n    assert isinstance(res['tokens'], int)\n    assert isinstance(res['cost'], float)\n    print('✓ All assertions passed for Lesson 1.1')\n\nif __name__ == '__main__':\n    test_parse()\n", "verification_criteria": "Implement parse_model_spec with proper type casting.", "failure_mode": "Implicit type coercion causing TypeError."},
        "defense_prompts": ["What are the runtime implications of dynamic typing in production Python?", "How does CPython's PyObject reference counting affect memory management?", "When should you use str(x) vs f'{x}' for type coercion?"]
    },
    {
        "num": 2,
        "title": "Expressions, Operators & Precedence Hierarchy",
        "xp": 100,
        "subtopics": [
            "1.2.1 Arithmetic operators: +, -, *, /, //, %, **",
            "1.2.2 Comparison and relational operators: ==, !=, <, >, <=, >=",
            "1.2.3 Boolean operators: and, or, not and short-circuit evaluation semantics",
            "1.2.4 Explicit grouping with parentheses to eliminate precedence ambiguity"
        ],
        "failure_mode": "Confusing assignment (=) with equality comparison (==), or wrong operator precedence in financial calculations.",
        "verification_criteria": "Implement compute_token_bill(input_tokens, output_tokens, rate_per_k, discount_tier) correctly.",
        "starter_code": {"solution.py": "def compute_token_bill(input_tokens: int, output_tokens: int, rate_per_k: float, discount_tier: float) -> float:\n    \"\"\"\n    Returns: round(((input+output)/1000) * rate_per_k * (1.0 - discount_tier), 4)\n    \"\"\"\n    # TODO: Implement calculation\n    pass\n"},
        "test_suite": {"tests.py": "from solution import compute_token_bill\n\ndef test_bill():\n    cost = compute_token_bill(1000, 2000, 0.015, 0.10)\n    assert round(cost, 4) == 0.0405\n    print('✓ All assertions passed for Lesson 1.2')\n\nif __name__ == '__main__':\n    test_bill()\n", "verification_criteria": "Compute token bill correctly with all operators.", "failure_mode": "Wrong operator precedence in calculation."},
        "defense_prompts": ["Why does Python 3 use true division (/) by default instead of floor division?", "What is short-circuit evaluation and why is it critical for guard clause logic?", "Explain why (a or b and c) evaluates differently than (a or b) and c."]
    },
    {
        "num": 3,
        "title": "String Indexing, Slicing & Immutability",
        "xp": 100,
        "subtopics": [
            "1.3.1 Zero-based indexing and negative index wrapping",
            "1.3.2 Slice notation: [start:stop:step] mechanics and default bounds",
            "1.3.3 String immutability in CPython and memory safety implications",
            "1.3.4 Common string introspection: len(), in membership tests, and slicing boundaries"
        ],
        "failure_mode": "Attempting in-place character assignment on strings, or off-by-one errors in stop index of slices.",
        "verification_criteria": "Implement extract_prompt_prefix(raw_text, max_len) returning first max_len chars with '...' if truncated.",
        "starter_code": {"solution.py": "def extract_prompt_prefix(raw_text: str, max_len: int) -> str:\n    \"\"\"\n    Returns the first max_len characters. Appends '...' if truncated.\n    \"\"\"\n    # TODO: Implement slice-based truncation\n    pass\n"},
        "test_suite": {"tests.py": "from solution import extract_prompt_prefix\n\ndef test_slice():\n    assert extract_prompt_prefix('Hello World', 5) == 'Hello...'\n    assert extract_prompt_prefix('Hi', 5) == 'Hi'\n    print('✓ All assertions passed for Lesson 1.3')\n\nif __name__ == '__main__':\n    test_slice()\n", "verification_criteria": "Truncate and slice strings correctly.", "failure_mode": "Off-by-one in stop index."},
        "defense_prompts": ["Why are Python strings immutable and what memory safety benefit does this provide?", "How does Python's slice notation [start:stop:step] handle negative step values?", "What is the performance implication of string concatenation in a loop?"]
    },
    {
        "num": 4,
        "title": "Conditional Branching & Guard Clauses",
        "xp": 100,
        "subtopics": [
            "1.4.1 if, elif, else syntax and 4-space indentation discipline",
            "1.4.2 Truth value testing: truthy vs falsy values in Python",
            "1.4.3 Guard clause pattern and reducing cognitive complexity",
            "1.4.4 Ternary conditional expressions"
        ],
        "failure_mode": "Deeply nested conditionals or mishandling truthiness (treating 0 as non-existent).",
        "verification_criteria": "Implement classify_model_tier(token_count, is_vip) with guard clauses.",
        "starter_code": {"solution.py": "def classify_model_tier(token_count: int, is_vip: bool) -> str:\n    \"\"\"\n    Rules: <= 0 -> 'error', is_vip -> 'opus', > 4000 -> 'sonnet', else -> 'haiku'\n    \"\"\"\n    # TODO: Implement with guard clauses\n    pass\n"},
        "test_suite": {"tests.py": "from solution import classify_model_tier\n\ndef test_tier():\n    assert classify_model_tier(-5, False) == 'error'\n    assert classify_model_tier(100, True) == 'opus'\n    assert classify_model_tier(5000, False) == 'sonnet'\n    assert classify_model_tier(500, False) == 'haiku'\n    print('✓ All assertions passed for Lesson 1.4')\n\nif __name__ == '__main__':\n    test_tier()\n", "verification_criteria": "Route models using guard clauses.", "failure_mode": "Nested pyramid instead of guard clauses."},
        "defense_prompts": ["What is the cognitive complexity difference between nested if-else and guard clauses?", "Why is 0, empty string, and empty list falsy in Python?", "When should you use ternary expressions vs explicit if statements?"]
    },
    {
        "num": 5,
        "title": "While Loops & State-Driven Iteration",
        "xp": 100,
        "subtopics": [
            "1.5.1 While loop syntax and boolean termination predicates",
            "1.5.2 Loop state mutation and avoiding infinite execution",
            "1.5.3 Sentinel values and polling loops",
            "1.5.4 Simulating network retries and exponential sleep intervals"
        ],
        "failure_mode": "Forgetting to advance loop state, creating an infinite loop pegging CPU at 100%.",
        "verification_criteria": "Implement simulate_retry(max_tries, target_success_attempt) returning total attempts.",
        "starter_code": {"solution.py": "def simulate_retry(max_tries: int, target_success_attempt: int) -> int:\n    \"\"\"\n    Retries until attempt == target_success_attempt or max_tries exhausted.\n    Returns total number of attempts.\n    \"\"\"\n    # TODO: Implement state-driven while loop\n    pass\n"},
        "test_suite": {"tests.py": "from solution import simulate_retry\n\ndef test_retry():\n    assert simulate_retry(5, 3) == 3\n    assert simulate_retry(3, 10) == 3\n    print('✓ All assertions passed for Lesson 1.5')\n\nif __name__ == '__main__':\n    test_retry()\n", "verification_criteria": "Correctly count retry attempts.", "failure_mode": "Infinite loop from missing state update."},
        "defense_prompts": ["What mechanism prevents while loops from running indefinitely in production?", "How does a sentinel value differ from a counter-based termination condition?", "Why is a while True loop with a break safer than a while condition loop in some cases?"]
    },
    {
        "num": 6,
        "title": "For Loops, Iterables & The range() Generator",
        "xp": 100,
        "subtopics": [
            "1.6.1 The Python iteration protocol and iterable traversal",
            "1.6.2 The range() built-in: lazy evaluation and step increments",
            "1.6.3 Simultaneous index and element tracking with enumerate()",
            "1.6.4 Parallel iteration across multiple sequences with zip()"
        ],
        "failure_mode": "Assuming range(1, 5) includes 5 (it stops before 5), causing off-by-one errors.",
        "verification_criteria": "Implement batch_prompts(prompt_list, batch_size) returning a list of prompt batches.",
        "starter_code": {"solution.py": "def batch_prompts(prompts: list, batch_size: int) -> list:\n    \"\"\"\n    Chunks list into sub-lists of length batch_size using range().\n    \"\"\"\n    # TODO: Implement chunking\n    pass\n"},
        "test_suite": {"tests.py": "from solution import batch_prompts\n\ndef test_batch():\n    data = ['p1', 'p2', 'p3', 'p4', 'p5']\n    batches = batch_prompts(data, 2)\n    assert batches == [['p1', 'p2'], ['p3', 'p4'], ['p5']]\n    print('✓ All assertions passed for Lesson 1.6')\n\nif __name__ == '__main__':\n    test_batch()\n", "verification_criteria": "Correctly chunk prompts into batches.", "failure_mode": "Off-by-one error in range stop index."},
        "defense_prompts": ["How does Python's iterator protocol work under the hood?", "What is the memory advantage of range() over list(range())?", "How do enumerate() and zip() prevent index-related bugs?"]
    },
    {
        "num": 7,
        "title": "Loop Control: break, continue & The else Clause",
        "xp": 100,
        "subtopics": [
            "1.7.1 Immediate loop exit using break",
            "1.7.2 Cycle skipping with continue",
            "1.7.3 The for-else and while-else search completion construct",
            "1.7.4 Eliminating boolean search flag anti-patterns"
        ],
        "failure_mode": "Misinterpreting loop else as running after every iteration rather than only when no break occurred.",
        "verification_criteria": "Implement validate_stream_cleanliness(tokens, forbidden_word) using for-else.",
        "starter_code": {"solution.py": "def validate_stream_cleanliness(tokens: list, forbidden_word: str) -> bool:\n    \"\"\"\n    Returns True if forbidden_word not found (loop completes), False if found (break).\n    \"\"\"\n    # TODO: Use for-else pattern\n    pass\n"},
        "test_suite": {"tests.py": "from solution import validate_stream_cleanliness\n\ndef test_clean():\n    assert validate_stream_cleanliness(['user', 'query', 'clear'], 'inject') is True\n    assert validate_stream_cleanliness(['user', 'inject', 'query'], 'inject') is False\n    print('✓ All assertions passed for Lesson 1.7')\n\nif __name__ == '__main__':\n    test_clean()\n", "verification_criteria": "Correctly validate stream using for-else.", "failure_mode": "Using boolean flag instead of for-else idiom."},
        "defense_prompts": ["What is the semantic difference between break and return inside a loop?", "Why does Python's for-else clause help eliminate boolean search flags?", "When would you use continue vs filtering with a list comprehension?"]
    },
    {
        "num": 8,
        "title": "Functions: Signatures, Parameters & Return Values",
        "xp": 100,
        "subtopics": [
            "1.8.1 Defining functions with def and specifying return contracts",
            "1.8.2 Positional arguments, keyword arguments, and default parameters",
            "1.8.3 The mutable default argument trap and the None sentinel pattern",
            "1.8.4 Pure functions, deterministic output, and side-effect minimization"
        ],
        "failure_mode": "Using mutable default arguments (def fn(cache=[]):) which persist across calls causing state corruption.",
        "verification_criteria": "Implement build_prompt_payload(query, system_prompt, temp) returning structured request dict.",
        "starter_code": {"solution.py": "def build_prompt_payload(query: str, system_prompt: str = 'You are an AI', temp: float = 0.7) -> dict:\n    \"\"\"\n    Returns {'system': system_prompt, 'query': query, 'temperature': temp}.\n    \"\"\"\n    # TODO: Implement parameter binding\n    pass\n"},
        "test_suite": {"tests.py": "from solution import build_prompt_payload\n\ndef test_payload():\n    p = build_prompt_payload('Summarize text')\n    assert p == {'system': 'You are an AI', 'query': 'Summarize text', 'temperature': 0.7}\n    print('✓ All assertions passed for Lesson 1.8')\n\nif __name__ == '__main__':\n    test_payload()\n", "verification_criteria": "Build correct payload dict.", "failure_mode": "Mutable default argument corruption."},
        "defense_prompts": ["Why is using a mutable default argument a dangerous Python anti-pattern?", "What makes a function 'pure' and why does purity improve testability?", "How do keyword arguments improve API readability over positional-only arguments?"]
    },
    {
        "num": 9,
        "title": "Variable Scope, Namespaces & The LEGB Rule",
        "xp": 100,
        "subtopics": [
            "1.9.1 The LEGB lookup resolution order: Local, Enclosing, Global, Built-in",
            "1.9.2 Global variable hazards and why pure functions avoid global state mutation",
            "1.9.3 Resolving UnboundLocalError when referencing variables before assignment",
            "1.9.4 Built-in namespace protection and shadow prevention"
        ],
        "failure_mode": "Accidentally shadowing Python built-ins (list, dict, str, type) disabling them globally.",
        "verification_criteria": "Implement make_cost_tracker(rate_per_token) returning a closure that accumulates costs.",
        "starter_code": {"solution.py": "def make_cost_tracker(rate_per_token: float):\n    total_bill = 0.0\n    def track(tokens: int) -> float:\n        nonlocal total_bill\n        total_bill += tokens * rate_per_token\n        return round(total_bill, 4)\n    return track\n"},
        "test_suite": {"tests.py": "from solution import make_cost_tracker\n\ndef test_tracker():\n    t = make_cost_tracker(0.01)\n    assert t(100) == 1.0\n    assert t(200) == 3.0\n    print('✓ All assertions passed for Lesson 1.9')\n\nif __name__ == '__main__':\n    test_tracker()\n", "verification_criteria": "Correctly accumulate costs in closure.", "failure_mode": "Using global variable instead of closure."},
        "defense_prompts": ["What is the LEGB rule and in what order does Python resolve names?", "Why does an UnboundLocalError occur when you assign to a variable inside a function that references it before assignment?", "What is the nonlocal keyword for and when is it necessary?"]
    },
    {
        "num": 10,
        "title": "Debugging Discipline: Print Debugging, Assertions & pdb",
        "xp": 100,
        "subtopics": [
            "1.10.1 Structured logging and state inspection techniques with f-strings",
            "1.10.2 Invariant verification with defensive assert statements",
            "1.10.3 The built-in breakpoint() hook and pdb navigation commands",
            "1.10.4 Reading and interpreting Python tracebacks from top to bottom"
        ],
        "failure_mode": "Leaving print() statements in production code or missing assert guards on critical inputs.",
        "verification_criteria": "Implement safe_divide_tokens(total_tokens, chunks) with assert guard against chunks <= 0.",
        "starter_code": {"solution.py": "def safe_divide_tokens(total_tokens: int, chunks: int) -> int:\n    \"\"\"\n    Asserts chunks > 0 with message 'chunks must be positive', then returns total_tokens // chunks.\n    \"\"\"\n    # TODO: Implement assertion guard\n    pass\n"},
        "test_suite": {"tests.py": "from solution import safe_divide_tokens\n\ndef test_debug():\n    assert safe_divide_tokens(1000, 4) == 250\n    try:\n        safe_divide_tokens(1000, 0)\n        assert False\n    except AssertionError as e:\n        assert 'chunks must be positive' in str(e)\n    print('✓ All assertions passed for Lesson 1.10')\n\nif __name__ == '__main__':\n    test_debug()\n", "verification_criteria": "Guard against invalid inputs with assertions.", "failure_mode": "Missing assert leaves ZeroDivisionError unguarded."},
        "defense_prompts": ["When should you use assert vs raising a custom exception?", "Why should assertions be disabled in production Python (python -O flag)?", "How do you read a Python traceback from bottom to top to find the root cause?"]
    },
]

# -------------------------------------------------------------------------
# Parts 2-6: Lessons 11-50 (inline for deployment simplicity)
# -------------------------------------------------------------------------
M1_PART2_6 = [
    {
        "num": 11,
        "title": "Advanced Functions: *args, **kwargs & Higher-Order Functions",
        "xp": 110,
        "subtopics": ["1.11.1 Variadic positional arguments with *args", "1.11.2 Keyword variadic arguments with **kwargs", "1.11.3 Higher-order functions: passing and returning functions", "1.11.4 functools.partial for pre-filling arguments"],
        "failure_mode": "Mixing *args and **kwargs in wrong order in function signature.",
        "verification_criteria": "Implement make_api_caller(base_url, **default_headers) returning a callable that merges headers.",
        "starter_code": {"solution.py": "def make_api_caller(base_url: str, **default_headers):\n    def call(endpoint: str, **extra_headers) -> dict:\n        merged = {**default_headers, **extra_headers}\n        return {'url': f'{base_url}{endpoint}', 'headers': merged}\n    return call\n"},
        "test_suite": {"tests.py": "from solution import make_api_caller\n\ndef test_caller():\n    caller = make_api_caller('https://api.example.com', Authorization='Bearer TOKEN')\n    result = caller('/v1/chat', X_Version='2024-01')\n    assert result['url'] == 'https://api.example.com/v1/chat'\n    assert result['headers']['Authorization'] == 'Bearer TOKEN'\n    assert result['headers']['X_Version'] == '2024-01'\n    print('✓ All assertions passed for Lesson 1.11')\n\nif __name__ == '__main__':\n    test_caller()\n", "verification_criteria": "Merge headers correctly using **kwargs.", "failure_mode": "Wrong argument ordering in signature."},
        "defense_prompts": ["What is the difference between *args and **kwargs in a function signature?", "How does Python handle argument passing when both positional and keyword arguments are mixed?", "What is functools.partial and when is it preferable to writing a new function?"]
    },
    {
        "num": 12,
        "title": "Lambda Functions & Functional Programming Primitives",
        "xp": 110,
        "subtopics": ["1.12.1 Lambda expressions: anonymous single-expression function literals", "1.12.2 map(): applying a transformation function across an iterable", "1.12.3 filter(): selecting items where predicate returns True", "1.12.4 sorted() with key= parameter for custom ordering"],
        "failure_mode": "Writing complex multi-step logic in lambdas; lambdas must be single-expression.",
        "verification_criteria": "Implement rank_models(model_list) sorting by cost_per_1k ascending then context_window descending.",
        "starter_code": {"solution.py": "def rank_models(models: list[dict]) -> list[dict]:\n    \"\"\"\n    Sorts by cost_per_1k ascending, then context_window descending.\n    \"\"\"\n    return sorted(models, key=lambda m: (m['cost_per_1k'], -m['context_window']))\n"},
        "test_suite": {"tests.py": "from solution import rank_models\n\ndef test_rank():\n    models = [{'name': 'A', 'cost_per_1k': 0.02, 'context_window': 8000}, {'name': 'B', 'cost_per_1k': 0.01, 'context_window': 16000}, {'name': 'C', 'cost_per_1k': 0.01, 'context_window': 32000}]\n    ranked = rank_models(models)\n    assert ranked[0]['name'] == 'C'\n    assert ranked[1]['name'] == 'B'\n    assert ranked[2]['name'] == 'A'\n    print('✓ All assertions passed for Lesson 1.12')\n\nif __name__ == '__main__':\n    test_rank()\n", "verification_criteria": "Sort models by composite key correctly.", "failure_mode": "Using multi-line logic in lambda."},
        "defense_prompts": ["When should you prefer a named function over a lambda?", "How does sorted() with a key function avoid modifying the original list?", "What is the difference between map() returning an iterator vs a list comprehension?"]
    },
    {
        "num": 13,
        "title": "Exception Handling: try, except, else & finally",
        "xp": 110,
        "subtopics": ["1.13.1 Python exception hierarchy: BaseException and common subclasses", "1.13.2 Catching specific exception types to prevent masking failures", "1.13.3 The else clause: runs only when no exception was raised", "1.13.4 The finally clause: guaranteed cleanup regardless of success or failure"],
        "failure_mode": "Using bare except: which catches SystemExit and KeyboardInterrupt, making Ctrl+C impossible.",
        "verification_criteria": "Implement safe_json_parse(raw_text) returning parsed dict or None on json.JSONDecodeError.",
        "starter_code": {"solution.py": "import json\n\ndef safe_json_parse(raw_text: str) -> dict | None:\n    try:\n        return json.loads(raw_text)\n    except (json.JSONDecodeError, ValueError):\n        return None\n"},
        "test_suite": {"tests.py": "from solution import safe_json_parse\n\ndef test_parse():\n    assert safe_json_parse('{\"model\": \"gpt-4o\"}') == {'model': 'gpt-4o'}\n    assert safe_json_parse('not json at all') is None\n    assert safe_json_parse('') is None\n    print('✓ All assertions passed for Lesson 1.13')\n\nif __name__ == '__main__':\n    test_parse()\n", "verification_criteria": "Parse JSON safely without crashes.", "failure_mode": "Bare except masking SystemExit."},
        "defense_prompts": ["Why should you always catch specific exceptions rather than using bare except?", "What is the purpose of the else clause in a try-except block?", "When does the finally clause run and what makes it useful for resource cleanup?"]
    },
    {
        "num": 14,
        "title": "Custom Exceptions & Defensive Error Design",
        "xp": 110,
        "subtopics": ["1.14.1 Defining custom exception classes by subclassing Exception", "1.14.2 Adding structured metadata to exceptions with __init__", "1.14.3 Re-raising exceptions with raise from for traceback preservation", "1.14.4 Building error hierarchies: ModelError -> RateLimitError, ContextWindowError"],
        "failure_mode": "Swallowing exceptions without re-raising or logging, making production bugs completely invisible.",
        "verification_criteria": "Define TokenBudgetExceededError(budget, actual) and enforce_budget(tokens, budget).",
        "starter_code": {"solution.py": "class TokenBudgetExceededError(Exception):\n    def __init__(self, budget: int, actual: int):\n        self.budget = budget\n        self.actual = actual\n        super().__init__(f'Token budget exceeded: {actual} > {budget}')\n\ndef enforce_budget(tokens: int, budget: int) -> None:\n    if tokens > budget:\n        raise TokenBudgetExceededError(budget=budget, actual=tokens)\n"},
        "test_suite": {"tests.py": "from solution import TokenBudgetExceededError, enforce_budget\n\ndef test_budget():\n    enforce_budget(100, 200)\n    try:\n        enforce_budget(500, 200)\n        assert False\n    except TokenBudgetExceededError as e:\n        assert e.budget == 200\n        assert e.actual == 500\n    print('✓ All assertions passed for Lesson 1.14')\n\nif __name__ == '__main__':\n    test_budget()\n", "verification_criteria": "Raise structured exception with metadata.", "failure_mode": "Using generic Exception instead of custom class."},
        "defense_prompts": ["Why define custom exception classes instead of raising generic Exception?", "What does 'raise X from Y' do to the exception chain?", "How do error hierarchies help callers catch exceptions at the right abstraction level?"]
    },
    {
        "num": 15,
        "title": "Python Standard Library: os, sys, pathlib & datetime",
        "xp": 110,
        "subtopics": ["1.15.1 The os module: process environment and path manipulation", "1.15.2 The sys module: argv and graceful exit control", "1.15.3 pathlib.Path: object-oriented cross-platform filesystem navigation", "1.15.4 datetime and timezone-aware timestamps for log entries"],
        "failure_mode": "Using string concatenation for file paths which breaks on Windows; use pathlib.Path instead.",
        "verification_criteria": "Implement build_log_path(base_dir, model_name) using pathlib returning a timestamped .jsonl path.",
        "starter_code": {"solution.py": "from pathlib import Path\nfrom datetime import datetime\n\ndef build_log_path(base_dir: str, model_name: str) -> Path:\n    today = datetime.now().strftime('%Y%m%d')\n    return Path(base_dir) / 'logs' / f'{model_name}_{today}.jsonl'\n"},
        "test_suite": {"tests.py": "from solution import build_log_path\nfrom pathlib import Path\nfrom datetime import datetime\n\ndef test_log_path():\n    today = datetime.now().strftime('%Y%m%d')\n    p = build_log_path('/var/logs', 'gpt-4o')\n    assert isinstance(p, Path)\n    assert p.name == f'gpt-4o_{today}.jsonl'\n    assert 'logs' in str(p)\n    print('✓ All assertions passed for Lesson 1.15')\n\nif __name__ == '__main__':\n    test_log_path()\n", "verification_criteria": "Build cross-platform path using pathlib.", "failure_mode": "String path concatenation fails on Windows."},
        "defense_prompts": ["Why is pathlib.Path safer than os.path.join() for file path construction?", "What is the difference between os.getenv() and os.environ[] for reading environment variables?", "How does Python's datetime.now() differ from datetime.utcnow() for production logging?"]
    },
    {
        "num": 16,
        "title": "Generators, Iterators & Lazy Evaluation",
        "xp": 110,
        "subtopics": ["1.16.1 The Iterator Protocol: __iter__, __next__, and StopIteration", "1.16.2 Generator functions with yield: suspending and resuming execution", "1.16.3 Generator expressions: memory-efficient transforms without list materialization", "1.16.4 Use cases: streaming AI token responses and large log file processing"],
        "failure_mode": "Materializing a generator into a list before needed, losing all memory efficiency.",
        "verification_criteria": "Implement token_stream_generator(text, chunk_size) yielding text chunks.",
        "starter_code": {"solution.py": "def token_stream_generator(text: str, chunk_size: int):\n    for i in range(0, len(text), chunk_size):\n        yield text[i:i + chunk_size]\n"},
        "test_suite": {"tests.py": "from solution import token_stream_generator\n\ndef test_generator():\n    chunks = list(token_stream_generator('Hello World', 3))\n    assert chunks == ['Hel', 'lo ', 'Wor', 'ld']\n    assert ''.join(token_stream_generator('ABCDE', 2)) == 'ABCDE'\n    print('✓ All assertions passed for Lesson 1.16')\n\nif __name__ == '__main__':\n    test_generator()\n", "verification_criteria": "Yield correct text chunks lazily.", "failure_mode": "Collecting all chunks into memory before yielding."},
        "defense_prompts": ["What is the memory advantage of yield vs returning a full list?", "How does Python's StopIteration exception signal the end of an iterator?", "When would you choose a generator expression over a list comprehension?"]
    },
    {
        "num": 17,
        "title": "Decorators: Function Wrappers & @functools.wraps",
        "xp": 110,
        "subtopics": ["1.17.1 Functions as first-class objects in Python", "1.17.2 The decorator pattern: adding cross-cutting behavior without modifying the original function", "1.17.3 functools.wraps: preserving __name__, __doc__, and __annotations__", "1.17.4 Use cases: timing, retry logic, authentication, and structured logging"],
        "failure_mode": "Forgetting @functools.wraps causing all wrapped functions to appear as 'wrapper' in stack traces.",
        "verification_criteria": "Implement @retry_on_exception(max_attempts) decorator retrying the function on any Exception.",
        "starter_code": {"solution.py": "import functools\n\ndef retry_on_exception(max_attempts: int):\n    def decorator(fn):\n        @functools.wraps(fn)\n        def wrapper(*args, **kwargs):\n            last_exc = None\n            for _ in range(max_attempts):\n                try:\n                    return fn(*args, **kwargs)\n                except Exception as e:\n                    last_exc = e\n            raise last_exc\n        return wrapper\n    return decorator\n"},
        "test_suite": {"tests.py": "from solution import retry_on_exception\n\ndef test_retry_decorator():\n    call_count = [0]\n    @retry_on_exception(3)\n    def flaky():\n        call_count[0] += 1\n        if call_count[0] < 3:\n            raise ValueError('not ready')\n        return 'done'\n    assert flaky() == 'done'\n    assert call_count[0] == 3\n    print('✓ All assertions passed for Lesson 1.17')\n\nif __name__ == '__main__':\n    test_retry_decorator()\n", "verification_criteria": "Decorator retries correctly on exception.", "failure_mode": "Missing @functools.wraps corrupts function metadata."},
        "defense_prompts": ["What is a decorator factory and why does it need two levels of nested functions?", "Why is @functools.wraps critical for debuggable production code?", "How would you implement a memoization decorator using a closure?"]
    },
    {
        "num": 18,
        "title": "Context Managers: with Statements & Resource Lifecycle",
        "xp": 110,
        "subtopics": ["1.18.1 The context manager protocol: __enter__ and __exit__ contracts", "1.18.2 Guaranteed resource cleanup via the with statement", "1.18.3 contextlib.contextmanager for generator-based context managers", "1.18.4 Use cases: file handles, HTTP clients, database connections, timers"],
        "failure_mode": "Not using with for file operations, leaving open file descriptors and causing OS resource exhaustion.",
        "verification_criteria": "Implement TimerContext class using __enter__/__exit__ that records elapsed_ms.",
        "starter_code": {"solution.py": "import time\n\nclass TimerContext:\n    def __init__(self):\n        self.elapsed_ms = 0.0\n        self._start = None\n\n    def __enter__(self):\n        self._start = time.perf_counter()\n        return self\n\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        self.elapsed_ms = (time.perf_counter() - self._start) * 1000\n        return False\n"},
        "test_suite": {"tests.py": "from solution import TimerContext\nimport time\n\ndef test_timer():\n    with TimerContext() as t:\n        time.sleep(0.01)\n    assert t.elapsed_ms >= 10.0, f'Expected >= 10ms, got {t.elapsed_ms}'\n    print('✓ All assertions passed for Lesson 1.18')\n\nif __name__ == '__main__':\n    test_timer()\n", "verification_criteria": "Correctly measure elapsed time.", "failure_mode": "Unclosed resources on exception."},
        "defense_prompts": ["What happens if __exit__ returns True vs False?", "How does contextlib.contextmanager simplify writing context managers?", "Why is with open() safer than f = open() followed by f.close()?"]
    },
    {
        "num": 19,
        "title": "Lists In Depth: Mutation, Copying & O(n) Complexity",
        "xp": 120,
        "subtopics": ["1.19.1 List as a dynamic array: amortized O(1) append, O(n) insert/remove", "1.19.2 Shallow copy vs deep copy: copy.copy() vs copy.deepcopy()", "1.19.3 In-place mutation: sort() vs sorted(), reverse() vs reversed()", "1.19.4 List concatenation cost: += is O(k) but + creates new O(n+k) list"],
        "failure_mode": "Using list.copy() or slice [:] on nested structures and assuming inner objects are independent.",
        "verification_criteria": "Implement deep_copy_conversation(history) returning an independent deep copy.",
        "starter_code": {"solution.py": "import copy\n\ndef deep_copy_conversation(history: list[dict]) -> list[dict]:\n    return copy.deepcopy(history)\n"},
        "test_suite": {"tests.py": "from solution import deep_copy_conversation\n\ndef test_deep_copy():\n    original = [{'role': 'user', 'content': 'Hello'}]\n    copied = deep_copy_conversation(original)\n    copied[0]['content'] = 'Modified'\n    assert original[0]['content'] == 'Hello'\n    print('✓ All assertions passed for Lesson 1.19')\n\nif __name__ == '__main__':\n    test_deep_copy()\n", "verification_criteria": "Deep copy preserves original independence.", "failure_mode": "Shallow copy shares references to inner dicts."},
        "defense_prompts": ["What is the difference between a shallow copy and a deep copy?", "When is it safe to use a shallow copy vs when must you use deepcopy?", "What is the time complexity of list.insert(0, x) and why?"]
    },
    {
        "num": 20,
        "title": "List & Dict Comprehensions: Idiomatic Data Transforms",
        "xp": 120,
        "subtopics": ["1.20.1 List comprehension: [expr for item in iterable if condition]", "1.20.2 Dict comprehension: {key: val for item in iterable}", "1.20.3 Set comprehensions for unique element extraction", "1.20.4 Nested comprehensions and readability tradeoffs"],
        "failure_mode": "Three-level nested comprehensions sacrificing readability for brevity.",
        "verification_criteria": "Implement normalize_messages(messages) using a list comprehension to strip and lowercase content.",
        "starter_code": {"solution.py": "def normalize_messages(messages: list[dict]) -> list[dict]:\n    return [{**msg, 'content': msg['content'].strip().lower()} for msg in messages]\n"},
        "test_suite": {"tests.py": "from solution import normalize_messages\n\ndef test_normalize():\n    msgs = [{'role': 'user', 'content': '  Hello WORLD  '}]\n    result = normalize_messages(msgs)\n    assert result == [{'role': 'user', 'content': 'hello world'}]\n    assert msgs[0]['content'] == '  Hello WORLD  '\n    print('✓ All assertions passed for Lesson 1.20')\n\nif __name__ == '__main__':\n    test_normalize()\n", "verification_criteria": "Transform messages without mutating originals.", "failure_mode": "Mutating the original list in place."},
        "defense_prompts": ["Why are list comprehensions faster than equivalent for-loop append patterns?", "When should you use a dict comprehension instead of a for loop?", "What is the readability threshold for nesting comprehensions?"]
    },
    {
        "num": 21,
        "title": "Tuples: Immutable Sequences & Structural Unpacking",
        "xp": 120,
        "subtopics": ["1.21.1 Tuples as heterogeneous immutable records vs homogeneous mutable lists", "1.21.2 Tuple packing and sequence unpacking: a, b, c = (1, 2, 3)", "1.21.3 Extended unpacking with *rest: first, *middle, last = iterable", "1.21.4 namedtuple for readable positional record types"],
        "failure_mode": "Confusing single-element tuple syntax: (42) is an int, but (42,) is a tuple.",
        "verification_criteria": "Implement parse_model_response(response_tuple) unpacking (role, content, tokens_used) into a dict.",
        "starter_code": {"solution.py": "def parse_model_response(response_tuple: tuple) -> dict:\n    role, content, tokens_used = response_tuple\n    return {'role': role, 'content': content, 'tokens_used': tokens_used}\n"},
        "test_suite": {"tests.py": "from solution import parse_model_response\n\ndef test_unpack():\n    r = parse_model_response(('assistant', 'Here is the answer', 150))\n    assert r['role'] == 'assistant'\n    assert r['tokens_used'] == 150\n    print('✓ All assertions passed for Lesson 1.21')\n\nif __name__ == '__main__':\n    test_unpack()\n", "verification_criteria": "Unpack tuple into dict correctly.", "failure_mode": "Forgetting trailing comma in single-element tuple."},
        "defense_prompts": ["Why are tuples preferred over lists for function return values with multiple items?", "What is the memory difference between a list and a tuple of the same length?", "How does named tuple provide both positional access and named attribute access?"]
    },
    {
        "num": 22,
        "title": "Dictionaries: Hash Maps, O(1) Lookups & Key Contracts",
        "xp": 120,
        "subtopics": ["1.22.1 Hash tables: O(1) average lookup via hash() and open addressing", "1.22.2 Safe key access: dict.get(key, default) vs dict[key] raising KeyError", "1.22.3 Dictionary merging: {**a, **b} spread and dict.update()", "1.22.4 Hashable key requirements: why lists cannot be dict keys"],
        "failure_mode": "Using mutable objects (lists) as dictionary keys causing TypeError: unhashable type.",
        "verification_criteria": "Implement merge_model_configs(base_config, overrides) using dict spread without mutating inputs.",
        "starter_code": {"solution.py": "def merge_model_configs(base_config: dict, overrides: dict) -> dict:\n    return {**base_config, **overrides}\n"},
        "test_suite": {"tests.py": "from solution import merge_model_configs\n\ndef test_merge():\n    base = {'model': 'haiku', 'temp': 0.7, 'max_tokens': 1024}\n    overrides = {'model': 'sonnet', 'max_tokens': 4096}\n    merged = merge_model_configs(base, overrides)\n    assert merged == {'model': 'sonnet', 'temp': 0.7, 'max_tokens': 4096}\n    assert base['model'] == 'haiku'\n    print('✓ All assertions passed for Lesson 1.22')\n\nif __name__ == '__main__':\n    test_merge()\n", "verification_criteria": "Merge dicts without mutating inputs.", "failure_mode": "Mutating base_config with update()."},
        "defense_prompts": ["What is a hash collision and how does Python's dict handle it?", "Why does dict.get(key, default) prevent KeyError crashes?", "What makes an object hashable in Python?"]
    },
    {
        "num": 23,
        "title": "Sets: Hashing, Deduplication & Set Algebra",
        "xp": 120,
        "subtopics": ["1.23.1 Set hash table: O(1) membership testing vs O(n) list search", "1.23.2 Set construction and automatic deduplication via set(collection)", "1.23.3 Set operations: union (|), intersection (&), difference (-)", "1.23.4 Frozenset: immutable hashable sets for use as dictionary keys"],
        "failure_mode": "Expecting ordered iteration from sets; sets are unordered.",
        "verification_criteria": "Implement find_shared_capabilities(caps_a, caps_b) using intersection and difference.",
        "starter_code": {"solution.py": "def find_shared_capabilities(caps_a: set, caps_b: set) -> tuple:\n    shared = caps_a & caps_b\n    exclusive_a = caps_a - caps_b\n    return shared, exclusive_a\n"},
        "test_suite": {"tests.py": "from solution import find_shared_capabilities\n\ndef test_sets():\n    a = {'vision', 'code', 'reasoning'}\n    b = {'vision', 'reasoning', 'audio'}\n    shared, exclusive = find_shared_capabilities(a, b)\n    assert shared == {'vision', 'reasoning'}\n    assert exclusive == {'code'}\n    print('✓ All assertions passed for Lesson 1.23')\n\nif __name__ == '__main__':\n    test_sets()\n", "verification_criteria": "Correctly compute shared and exclusive capabilities.", "failure_mode": "Assuming set iteration is ordered."},
        "defense_prompts": ["Why is 'item in my_set' O(1) while 'item in my_list' is O(n)?", "When would you use frozenset instead of set?", "What set operation finds elements in A but not in B?"]
    },
    {
        "num": 24,
        "title": "Collections Module: Counter, defaultdict & deque",
        "xp": 120,
        "subtopics": ["1.24.1 Counter: O(n) frequency counting for any iterable", "1.24.2 defaultdict: auto-initializing missing keys with factory functions", "1.24.3 deque: O(1) append and popleft for queues and sliding windows", "1.24.4 OrderedDict: preserved insertion order and move_to_end()"],
        "failure_mode": "Using regular dict for counting and crashing with KeyError on first unseen key.",
        "verification_criteria": "Implement count_token_frequencies(token_list) using Counter returning top 3 tokens.",
        "starter_code": {"solution.py": "from collections import Counter\n\ndef count_token_frequencies(token_list: list[str]) -> list[tuple]:\n    return Counter(token_list).most_common(3)\n"},
        "test_suite": {"tests.py": "from solution import count_token_frequencies\n\ndef test_counter():\n    tokens = ['the', 'cat', 'sat', 'the', 'cat', 'the']\n    top3 = count_token_frequencies(tokens)\n    assert top3[0] == ('the', 3)\n    assert top3[1] == ('cat', 2)\n    print('✓ All assertions passed for Lesson 1.24')\n\nif __name__ == '__main__':\n    test_counter()\n", "verification_criteria": "Count and rank token frequencies correctly.", "failure_mode": "Using dict with manual KeyError handling."},
        "defense_prompts": ["What is the time complexity of Counter(my_list)?", "When is defaultdict(list) more appropriate than a regular dict?", "Why is deque O(1) for both ends while list.insert(0,x) is O(n)?"]
    },
    {
        "num": 25,
        "title": "String Formatting: f-strings, Templates & Prompt Hydration",
        "xp": 120,
        "subtopics": ["1.25.1 f-string expressions and format specs (:.2f, :>10, :0>5)", "1.25.2 str.format() positional and named substitution", "1.25.3 string.Template safer substitution preventing injection", "1.25.4 Prompt template hydration with variable slots"],
        "failure_mode": "Building prompts via string concatenation making multi-variable prompts unmaintainable.",
        "verification_criteria": "Implement hydrate_prompt(template, variables) using str.format_map().",
        "starter_code": {"solution.py": "def hydrate_prompt(template: str, variables: dict) -> str:\n    return template.format_map(variables)\n"},
        "test_suite": {"tests.py": "from solution import hydrate_prompt\n\ndef test_hydrate():\n    tmpl = 'You are a {role}. Answer about {topic} in {lang}.'\n    result = hydrate_prompt(tmpl, {'role': 'developer', 'topic': 'Python', 'lang': 'English'})\n    assert result == 'You are a developer. Answer about Python in English.'\n    try:\n        hydrate_prompt(tmpl, {'role': 'dev'})\n        assert False\n    except KeyError:\n        pass\n    print('✓ All assertions passed for Lesson 1.25')\n\nif __name__ == '__main__':\n    test_hydrate()\n", "verification_criteria": "Hydrate prompt template correctly and raise on missing keys.", "failure_mode": "String concatenation vs structured templates."},
        "defense_prompts": ["Why is format_map() safer than % formatting for user-controlled inputs?", "What are f-string format specifiers and when do you use :.2f vs :>10?", "How do you prevent prompt injection via template hydration?"]
    },
    {
        "num": 26,
        "title": "Regular Expressions: Pattern Matching & Text Extraction",
        "xp": 120,
        "subtopics": ["1.26.1 The re module: compile(), search(), match(), findall(), sub()", "1.26.2 Core metacharacters: . * + ? ^ $ [] () | \\", "1.26.3 Named capture groups: (?P<name>...) for structured extraction", "1.26.4 Greedy vs lazy quantifiers in AI response parsing"],
        "failure_mode": "Using greedy .* consuming multiple blocks instead of the first one in LLM response extraction.",
        "verification_criteria": "Implement extract_json_block(text) using non-greedy regex to pull first ```json...``` block.",
        "starter_code": {"solution.py": "import re\n\ndef extract_json_block(text: str) -> str | None:\n    match = re.search(r'```(?:json)?\\s*([\\s\\S]*?)```', text)\n    if match:\n        return match.group(1).strip()\n    return None\n"},
        "test_suite": {"tests.py": "from solution import extract_json_block\n\ndef test_extract():\n    text = 'Here is the output:\\n```json\\n{\"key\": \"value\"}\\n```\\nDone.'\n    result = extract_json_block(text)\n    assert result is not None\n    assert '{\"key\": \"value\"}' in result\n    assert '```' not in result\n    assert extract_json_block('No code block here') is None\n    print('✓ All assertions passed for Lesson 1.26')\n\nif __name__ == '__main__':\n    test_extract()\n", "verification_criteria": "Extract JSON blocks correctly with non-greedy regex.", "failure_mode": "Greedy quantifier captures too much."},
        "defense_prompts": ["What is the difference between re.search() and re.match()?", "How does a lazy quantifier (*?) differ from a greedy quantifier (*)?", "When would you use re.compile() instead of calling re.search() directly?"]
    },
    {
        "num": 27,
        "title": "Type Hints & Static Analysis with mypy",
        "xp": 120,
        "subtopics": ["1.27.1 Type annotation syntax for variables, parameters, and returns", "1.27.2 Generic containers: list[str], dict[str, int], Optional[T]", "1.27.3 Union types: str | None (Python 3.10+)", "1.27.4 Running mypy for static validation"],
        "failure_mode": "Assuming type hints enforce runtime behavior; they are analysis-only tools.",
        "verification_criteria": "Implement fully annotated parse_completion(response_body) with complete type signatures.",
        "starter_code": {"solution.py": "from typing import Optional\n\ndef parse_completion(response_body: dict) -> Optional[str]:\n    try:\n        return response_body['choices'][0]['message']['content']\n    except (KeyError, IndexError, TypeError):\n        return None\n"},
        "test_suite": {"tests.py": "from solution import parse_completion\n\ndef test_parse():\n    valid = {'choices': [{'message': {'content': 'Hello world'}}]}\n    assert parse_completion(valid) == 'Hello world'\n    assert parse_completion({}) is None\n    assert parse_completion({'choices': []}) is None\n    print('✓ All assertions passed for Lesson 1.27')\n\nif __name__ == '__main__':\n    test_parse()\n", "verification_criteria": "Parse completion response with full type annotations.", "failure_mode": "Assuming type hints provide runtime enforcement."},
        "defense_prompts": ["What does mypy check that Python's runtime does not?", "What is the difference between Optional[str] and str | None in Python 3.10+?", "When would you use TypeVar for generic function signatures?"]
    },
    {
        "num": 28,
        "title": "Dataclasses & Named Records",
        "xp": 120,
        "subtopics": ["1.28.1 @dataclass decorator: auto-generating __init__, __repr__, __eq__", "1.28.2 field() with default_factory for mutable defaults", "1.28.3 Frozen dataclasses: immutable records", "1.28.4 __post_init__ for business logic validation"],
        "failure_mode": "Setting mutable default without field(default_factory=list) causing instance state sharing.",
        "verification_criteria": "Define @dataclass ModelConfig with post-init validation for temperature range.",
        "starter_code": {"solution.py": "from dataclasses import dataclass, field\n\n@dataclass\nclass ModelConfig:\n    name: str\n    temperature: float = 0.7\n    max_tokens: int = 2048\n    tags: list[str] = field(default_factory=list)\n\n    def __post_init__(self):\n        if not (0.0 <= self.temperature <= 2.0):\n            raise ValueError(f'temperature {self.temperature} out of [0.0, 2.0]')\n        if self.max_tokens <= 0:\n            raise ValueError('max_tokens must be positive')\n"},
        "test_suite": {"tests.py": "from solution import ModelConfig\n\ndef test_dataclass():\n    cfg = ModelConfig('gpt-4o', 0.5, 1024)\n    assert cfg.name == 'gpt-4o'\n    assert cfg.tags == []\n    try:\n        ModelConfig('x', temperature=5.0)\n        assert False\n    except ValueError:\n        pass\n    print('✓ All assertions passed for Lesson 1.28')\n\nif __name__ == '__main__':\n    test_dataclass()\n", "verification_criteria": "Dataclass validates post-init correctly.", "failure_mode": "Mutable default argument shared across instances."},
        "defense_prompts": ["Why is @dataclass(frozen=True) useful for configuration objects?", "What does field(default_factory=list) solve that field(default=[]) does not?", "How does __post_init__ relate to __init__ in a dataclass?"]
    },
    {
        "num": 29,
        "title": "File I/O: Reading, Writing & pathlib Path Objects",
        "xp": 130,
        "subtopics": ["1.29.1 Context manager file access: with open(path, mode) lifecycle", "1.29.2 Read modes: r, rb, a, w", "1.29.3 pathlib.Path for cross-platform path composition with / operator", "1.29.4 Streaming large files efficiently by iterating lines"],
        "failure_mode": "Using write ('w') mode and accidentally truncating log files to zero bytes.",
        "verification_criteria": "Implement append_session_log(log_path, entry_dict) appending JSONL entries using pathlib.",
        "starter_code": {"solution.py": "import json\nfrom pathlib import Path\n\ndef append_session_log(log_path: Path, entry: dict) -> None:\n    with open(log_path, 'a', encoding='utf-8') as f:\n        f.write(json.dumps(entry) + '\\n')\n"},
        "test_suite": {"tests.py": "from solution import append_session_log\nfrom pathlib import Path\nimport json, tempfile\n\ndef test_log():\n    with tempfile.TemporaryDirectory() as tmp:\n        p = Path(tmp) / 'session.jsonl'\n        append_session_log(p, {'role': 'user', 'tokens': 10})\n        append_session_log(p, {'role': 'assistant', 'tokens': 50})\n        lines = p.read_text().strip().split('\\n')\n        assert len(lines) == 2\n        assert json.loads(lines[0])['role'] == 'user'\n        print('✓ All assertions passed for Lesson 1.29')\n\nif __name__ == '__main__':\n    test_log()\n", "verification_criteria": "Append JSONL entries without truncating.", "failure_mode": "Using 'w' mode instead of 'a' erases existing log."},
        "defense_prompts": ["What is JSONL format and why is it preferred for log files over JSON arrays?", "How does pathlib's / operator prevent cross-platform path bugs?", "When would you use 'rb' binary mode instead of 'r' text mode?"]
    },
    {
        "num": 30,
        "title": "JSON Serialization: Encoding, Decoding & Schema Validation",
        "xp": 130,
        "subtopics": ["1.30.1 json.loads() and json.dumps(): in-memory string parsing and serialization", "1.30.2 json.load() and json.dump() for file object streaming", "1.30.3 Custom serialization with default= for datetime and custom objects", "1.30.4 Schema validation: checking required keys before processing"],
        "failure_mode": "Passing datetime objects to json.dumps() without a custom serializer.",
        "verification_criteria": "Implement serialize_api_log(record) serializing datetime values as ISO 8601 strings.",
        "starter_code": {"solution.py": "import json\nfrom datetime import datetime\n\ndef serialize_api_log(record: dict) -> str:\n    def default_encoder(obj):\n        if isinstance(obj, datetime):\n            return obj.isoformat()\n        raise TypeError(f'Not serializable: {type(obj)}')\n    return json.dumps(record, default=default_encoder)\n"},
        "test_suite": {"tests.py": "from solution import serialize_api_log\nimport json\nfrom datetime import datetime\n\ndef test_serialize():\n    record = {'model': 'gpt-4o', 'called_at': datetime(2024, 1, 15, 12, 0, 0), 'tokens': 100}\n    result = serialize_api_log(record)\n    parsed = json.loads(result)\n    assert parsed['called_at'] == '2024-01-15T12:00:00'\n    assert parsed['tokens'] == 100\n    print('✓ All assertions passed for Lesson 1.30')\n\nif __name__ == '__main__':\n    test_serialize()\n", "verification_criteria": "Serialize datetime fields to ISO 8601.", "failure_mode": "TypeError on datetime without custom encoder."},
        "defense_prompts": ["What is ISO 8601 and why is it the correct format for serializing timestamps?", "When should you use json.dump() to file vs json.dumps() to string?", "How would you write a custom JSON encoder class instead of using the default= parameter?"]
    },
    {
        "num": 31,
        "title": "CSV & Structured Data Processing",
        "xp": 130,
        "subtopics": ["1.31.1 csv.reader and csv.DictReader: reading tabular data", "1.31.2 csv.writer and csv.DictWriter: writing structured rows", "1.31.3 Encoding: always specifying encoding='utf-8' and newline=''", "1.31.4 Streaming rows vs loading all into memory"],
        "failure_mode": "Omitting newline='' in open() on Windows causing blank lines between CSV rows.",
        "verification_criteria": "Implement load_model_benchmarks(csv_path) returning list of dicts from CSV with headers.",
        "starter_code": {"solution.py": "import csv\nfrom pathlib import Path\n\ndef load_model_benchmarks(csv_path: Path) -> list[dict]:\n    with open(csv_path, 'r', encoding='utf-8', newline='') as f:\n        return list(csv.DictReader(f))\n"},
        "test_suite": {"tests.py": "from solution import load_model_benchmarks\nfrom pathlib import Path\nimport tempfile, os\n\ndef test_csv():\n    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False, encoding='utf-8', newline='') as f:\n        f.write('model,score\\n')\n        f.write('gpt-4o,0.92\\n')\n        f.write('claude-sonnet,0.95\\n')\n        tmp = f.name\n    try:\n        rows = load_model_benchmarks(Path(tmp))\n        assert len(rows) == 2\n        assert rows[0]['model'] == 'gpt-4o'\n    finally:\n        os.unlink(tmp)\n    print('✓ All assertions passed for Lesson 1.31')\n\nif __name__ == '__main__':\n    test_csv()\n", "verification_criteria": "Load CSV rows as dicts correctly.", "failure_mode": "Missing newline='' causes extra blank lines."},
        "defense_prompts": ["Why does csv.DictReader map headers automatically while csv.reader does not?", "What is the newline='' parameter doing in open() for CSV files?", "When would you stream CSV rows one by one vs loading all into memory?"]
    },
    {
        "num": 32,
        "title": "Environment Variables & Secrets Management",
        "xp": 130,
        "subtopics": ["1.32.1 Why hardcoding secrets is catastrophic for security", "1.32.2 os.environ and os.getenv() for safe access", "1.32.3 .env files with python-dotenv for local injection", "1.32.4 .gitignore for excluding secrets from version control"],
        "failure_mode": "Committing .env files with API keys to a public GitHub repository.",
        "verification_criteria": "Implement get_required_env(key) raising EnvironmentError with clear message if key is missing.",
        "starter_code": {"solution.py": "import os\n\ndef get_required_env(key: str) -> str:\n    value = os.environ.get(key)\n    if value is None:\n        raise EnvironmentError(f'Missing required environment variable: {key}')\n    return value\n"},
        "test_suite": {"tests.py": "from solution import get_required_env\nimport os\n\ndef test_env():\n    os.environ['TEST_API_KEY'] = 'abc123'\n    assert get_required_env('TEST_API_KEY') == 'abc123'\n    try:\n        get_required_env('NONEXISTENT_XYZ_KEY')\n        assert False\n    except EnvironmentError as e:\n        assert 'NONEXISTENT_XYZ_KEY' in str(e)\n    print('✓ All assertions passed for Lesson 1.32')\n\nif __name__ == '__main__':\n    test_env()\n", "verification_criteria": "Raise clear error on missing env var.", "failure_mode": "Hardcoding secrets instead of reading from environment."},
        "defense_prompts": ["Why is committing secrets to git dangerous even if the repo is later made private?", "What is the difference between os.getenv() returning None vs os.environ[] raising KeyError?", "How does python-dotenv load .env files and when should you use load_dotenv()?"]
    },
    {
        "num": 33,
        "title": "Command-Line Interfaces with argparse",
        "xp": 130,
        "subtopics": ["1.33.1 ArgumentParser: CLI metadata, description, and epilog", "1.33.2 Positional vs optional arguments with flags", "1.33.3 Type casting: type=int, type=float, choices=[]", "1.33.4 Subcommands with add_subparsers for multi-command CLIs"],
        "failure_mode": "Using optional flags for required arguments without required=True.",
        "verification_criteria": "Implement build_prompt_cli_parser() returning a configured ArgumentParser.",
        "starter_code": {"solution.py": "import argparse\n\ndef build_prompt_cli_parser() -> argparse.ArgumentParser:\n    parser = argparse.ArgumentParser(description='AI Prompt CLI')\n    parser.add_argument('--model', type=str, default='gpt-4o')\n    parser.add_argument('--temp', type=float, default=0.7)\n    parser.add_argument('--prompt', type=str, required=True)\n    return parser\n"},
        "test_suite": {"tests.py": "from solution import build_prompt_cli_parser\n\ndef test_parser():\n    parser = build_prompt_cli_parser()\n    args = parser.parse_args(['--prompt', 'Summarize this', '--model', 'claude-haiku', '--temp', '0.3'])\n    assert args.prompt == 'Summarize this'\n    assert args.model == 'claude-haiku'\n    assert args.temp == 0.3\n    print('✓ All assertions passed for Lesson 1.33')\n\nif __name__ == '__main__':\n    test_parser()\n", "verification_criteria": "Parse CLI arguments correctly.", "failure_mode": "Missing required=True on required argument."},
        "defense_prompts": ["What is the difference between positional and optional arguments in argparse?", "How does add_subparsers() enable git-style multi-command CLIs?", "When would you use choices=[] to restrict argument values?"]
    },
    {
        "num": 34,
        "title": "Virtual Environments & Dependency Management with uv",
        "xp": 130,
        "subtopics": ["1.34.1 Virtual environments: preventing global package pollution", "1.34.2 Creating environments with python -m venv .venv", "1.34.3 uv: uv pip install, uv lock, uv sync for fast dependency management", "1.34.4 requirements.txt vs pyproject.toml for reproducible deployments"],
        "failure_mode": "Installing production dependencies into system Python causing version conflicts.",
        "verification_criteria": "Implement verify_required_packages(packages) checking if package names are importable.",
        "starter_code": {"solution.py": "import importlib\n\ndef verify_required_packages(packages: list[str]) -> dict[str, bool]:\n    result = {}\n    for pkg in packages:\n        try:\n            importlib.import_module(pkg)\n            result[pkg] = True\n        except ImportError:\n            result[pkg] = False\n    return result\n"},
        "test_suite": {"tests.py": "from solution import verify_required_packages\n\ndef test_packages():\n    res = verify_required_packages(['json', 'os', 'nonexistent_package_xyz'])\n    assert res['json'] is True\n    assert res['os'] is True\n    assert res['nonexistent_package_xyz'] is False\n    print('✓ All assertions passed for Lesson 1.34')\n\nif __name__ == '__main__':\n    test_packages()\n", "verification_criteria": "Check package importability correctly.", "failure_mode": "Installing to global Python instead of venv."},
        "defense_prompts": ["What is the difference between pip install and uv pip install?", "Why does pyproject.toml supersede requirements.txt for modern projects?", "How does a virtual environment isolate dependencies from system Python?"]
    },
    {
        "num": 35,
        "title": "Modules, Packages & Import Architecture",
        "xp": 130,
        "subtopics": ["1.35.1 Python module system: .py files, sys.path, and sys.modules caching", "1.35.2 Package structure: __init__.py and __all__ for public API", "1.35.3 Relative vs absolute imports", "1.35.4 Avoiding circular imports via dependency injection"],
        "failure_mode": "Creating circular imports causing ImportError or partially-initialized module errors.",
        "verification_criteria": "Implement format_cost and format_latency with __all__ defining the public API.",
        "starter_code": {"solution.py": "__all__ = ['format_cost', 'format_latency']\n\ndef format_cost(cents: float) -> str:\n    return f'${cents / 100:.4f}'\n\ndef format_latency(ms: float) -> str:\n    return f'{ms:.1f}ms'\n\ndef _internal_helper():\n    pass\n"},
        "test_suite": {"tests.py": "import solution as m\n\ndef test_module():\n    assert hasattr(m, 'format_cost')\n    assert hasattr(m, 'format_latency')\n    assert m.format_cost(250.0) == '$2.5000'\n    print('✓ All assertions passed for Lesson 1.35')\n\nif __name__ == '__main__':\n    test_module()\n", "verification_criteria": "Export public API via __all__.", "failure_mode": "Circular imports crash on startup."},
        "defense_prompts": ["What does __all__ control and why is it important for library authors?", "What is sys.modules and how does Python prevent re-importing modules?", "How do you break circular import dependencies in large projects?"]
    },
    {
        "num": 36,
        "title": "Pythonic Code: PEP 8, Linting & Automated Formatters",
        "xp": 130,
        "subtopics": ["1.36.1 PEP 8: snake_case, 79-char limits, spacing rules", "1.36.2 Ruff/Pyflakes for unused imports and undefined names", "1.36.3 Black formatter for deterministic opinionated code formatting", "1.36.4 Self-documenting code: meaningful identifiers over inline comments"],
        "failure_mode": "Naming variables l, O, I which are visually indistinguishable from 1, 0, 1 in most fonts.",
        "verification_criteria": "Implement calculate_adjusted_total(base, bonus, double) with full PEP 8 compliance and docstring.",
        "starter_code": {"solution.py": "BASE_RATE_PER_TOKEN = 0.000015\nVISION_MULTIPLIER = 1.5\n\ndef calculate_adjusted_total(base: float, bonus: float, double: bool = False) -> float:\n    \"\"\"\n    Calculates total of base and bonus, optionally doubled.\n\n    Args:\n        base: Base numeric value.\n        bonus: Bonus to add to base.\n        double: If True, doubles the result.\n\n    Returns:\n        The computed float total.\n    \"\"\"\n    result = base + bonus\n    if double:\n        result *= 2\n    return result\n"},
        "test_suite": {"tests.py": "from solution import calculate_adjusted_total\n\ndef test_pep8():\n    assert calculate_adjusted_total(10.0, 5.0) == 15.0\n    assert calculate_adjusted_total(10.0, 5.0, double=True) == 30.0\n    print('✓ All assertions passed for Lesson 1.36')\n\nif __name__ == '__main__':\n    test_pep8()\n", "verification_criteria": "Function is PEP 8 compliant with docstring.", "failure_mode": "Using ambiguous variable names or magic numbers."},
        "defense_prompts": ["What is the Ruff linter and how does it differ from flake8?", "Why does Black's opinionated formatting eliminate style debates?", "What are the most common PEP 8 violations in Python codebases?"]
    },
    {
        "num": 37,
        "title": "Making LLM API Calls with HTTPX: GET, POST & Auth Headers",
        "xp": 150,
        "subtopics": ["1.37.1 The HTTPX library: sync vs async clients and keep-alive", "1.37.2 POST requests: JSON body serialization and Content-Type headers", "1.37.3 Bearer token authentication via Authorization header", "1.37.4 Response validation: status_code, raise_for_status(), and JSON parsing"],
        "failure_mode": "Not calling raise_for_status() before parsing, causing silent failures on 4xx/5xx responses.",
        "verification_criteria": "Implement call_chat_completion(api_key, model, messages) using httpx posting to a chat completions endpoint.",
        "starter_code": {"solution.py": "import httpx\n\ndef call_chat_completion(api_key: str, model: str, messages: list[dict], base_url: str = 'https://api.openai.com') -> dict:\n    payload = {'model': model, 'messages': messages}\n    headers = {'Authorization': f'Bearer {api_key}', 'Content-Type': 'application/json'}\n    with httpx.Client(timeout=30.0) as client:\n        resp = client.post(f'{base_url}/v1/chat/completions', json=payload, headers=headers)\n        resp.raise_for_status()\n        return resp.json()\n"},
        "test_suite": {"tests.py": "from unittest.mock import patch, MagicMock\nfrom solution import call_chat_completion\n\ndef test_api_call():\n    mock_resp = MagicMock()\n    mock_resp.json.return_value = {'choices': [{'message': {'content': 'Hello'}}]}\n    mock_resp.raise_for_status.return_value = None\n    with patch('httpx.Client') as cls:\n        cls.return_value.__enter__.return_value.post.return_value = mock_resp\n        result = call_chat_completion('sk-test', 'gpt-4o', [{'role': 'user', 'content': 'Hi'}])\n        assert result['choices'][0]['message']['content'] == 'Hello'\n    print('✓ All assertions passed for Lesson 1.37')\n\nif __name__ == '__main__':\n    test_api_call()\n", "verification_criteria": "Make mocked API call and parse response.", "failure_mode": "Missing raise_for_status() allows silent 4xx failures."},
        "defense_prompts": ["What is the difference between httpx.Client and httpx.AsyncClient?", "Why should you always call raise_for_status() before parsing JSON from an API response?", "What is a Bearer token and how does it differ from Basic auth?"]
    },
    {
        "num": 38,
        "title": "Exponential Backoff & Jitter for Resilient API Calls",
        "xp": 150,
        "subtopics": ["1.38.1 429 Too Many Requests: server-side rate limiting", "1.38.2 Exponential backoff: wait = base * 2^attempt", "1.38.3 Full jitter and equal jitter to prevent thundering herds", "1.38.4 Integrating retry logic with HTTPX"],
        "failure_mode": "Tight retry loop without sleep consuming the entire rate limit budget instantly.",
        "verification_criteria": "Implement exponential_backoff_sleep(attempt, base_delay, cap, jitter) computing wait time.",
        "starter_code": {"solution.py": "import random\n\ndef exponential_backoff_sleep(attempt: int, base_delay: float = 1.0, cap: float = 60.0, jitter: bool = True) -> float:\n    wait = min(cap, base_delay * (2 ** attempt))\n    if jitter:\n        wait = random.uniform(0, wait)\n    return wait\n"},
        "test_suite": {"tests.py": "from solution import exponential_backoff_sleep\n\ndef test_backoff():\n    assert exponential_backoff_sleep(0, base_delay=1.0, jitter=False) == 1.0\n    assert exponential_backoff_sleep(1, base_delay=1.0, jitter=False) == 2.0\n    assert exponential_backoff_sleep(2, base_delay=1.0, jitter=False) == 4.0\n    assert exponential_backoff_sleep(10, base_delay=1.0, cap=30.0, jitter=False) == 30.0\n    print('✓ All assertions passed for Lesson 1.38')\n\nif __name__ == '__main__':\n    test_backoff()\n", "verification_criteria": "Compute backoff wait times correctly.", "failure_mode": "Retry loop without delay triggers rate limit."},
        "defense_prompts": ["What is a thundering herd and how does random jitter prevent it?", "What is the mathematical formula for exponential backoff?", "Why is there a cap on exponential backoff wait times?"]
    },
    {
        "num": 39,
        "title": "Token Budgets & Counting Tokens with tiktoken",
        "xp": 150,
        "subtopics": ["1.39.1 Tokens as BPE subword units: why character count != token count", "1.39.2 The tiktoken library for model-aware tokenization", "1.39.3 Counting tokens before sending to avoid context window overflow", "1.39.4 Token budget enforcement: hard limits and truncation strategies"],
        "failure_mode": "Estimating tokens by dividing character count by 4, wildly miscounting non-ASCII text.",
        "verification_criteria": "Implement count_message_tokens(messages, model) using tiktoken to count chat message tokens.",
        "starter_code": {"solution.py": "def count_message_tokens(messages: list[dict], model: str = 'gpt-4o') -> int:\n    try:\n        import tiktoken\n        enc = tiktoken.encoding_for_model(model)\n    except Exception:\n        total_chars = sum(len(m.get('content', '')) + len(m.get('role', '')) for m in messages)\n        return total_chars // 4 + 2\n    total = 0\n    for msg in messages:\n        total += 4\n        total += len(enc.encode(msg.get('role', '')))\n        total += len(enc.encode(msg.get('content', '')))\n    total += 2\n    return total\n"},
        "test_suite": {"tests.py": "from solution import count_message_tokens\n\ndef test_token_count():\n    messages = [{'role': 'user', 'content': 'Hello, how are you?'}]\n    count = count_message_tokens(messages)\n    assert isinstance(count, int)\n    assert 5 < count < 50\n    print('✓ All assertions passed for Lesson 1.39')\n\nif __name__ == '__main__':\n    test_token_count()\n", "verification_criteria": "Count tokens accurately using tiktoken.", "failure_mode": "Character / 4 estimate is wildly inaccurate."},
        "defense_prompts": ["What is Byte Pair Encoding (BPE) and why do different models have different tokenizers?", "Why does token count matter for both cost and context window limits?", "What is the overhead token count per message in OpenAI's chat format?"]
    },
    {
        "num": 40,
        "title": "Structured Prompt Templates & XML Delimiters",
        "xp": 150,
        "subtopics": ["1.40.1 Prompt engineering: system/user/assistant role patterns", "1.40.2 XML delimiters: <context>, <question>, <instructions> grounding", "1.40.3 Multi-variable template hydration with validation", "1.40.4 Few-shot prompting: example (input, output) pairs in messages"],
        "failure_mode": "Flat unstructured prompt strings making programmatic updates impossible.",
        "verification_criteria": "Implement build_rag_prompt(context_text, user_question, instructions) building XML-delimited messages.",
        "starter_code": {"solution.py": "def build_rag_prompt(context_text: str, user_question: str, instructions: str = 'Answer based on the context only.') -> list[dict]:\n    system_content = f'<instructions>{instructions}</instructions>\\n<context>{context_text}</context>'\n    return [\n        {'role': 'system', 'content': system_content},\n        {'role': 'user', 'content': user_question},\n    ]\n"},
        "test_suite": {"tests.py": "from solution import build_rag_prompt\n\ndef test_rag_prompt():\n    msgs = build_rag_prompt('Python is a language.', 'What is Python?')\n    assert len(msgs) == 2\n    assert '<context>' in msgs[0]['content']\n    assert '<instructions>' in msgs[0]['content']\n    assert msgs[1]['content'] == 'What is Python?'\n    print('✓ All assertions passed for Lesson 1.40')\n\nif __name__ == '__main__':\n    test_rag_prompt()\n", "verification_criteria": "Build XML-delimited RAG prompt correctly.", "failure_mode": "Unstructured flat prompt prevents programmatic updates."},
        "defense_prompts": ["Why are XML delimiters effective for grounding LLM responses?", "What is the system role in a chat messages array and how does it differ from user?", "How does few-shot prompting reduce the need for fine-tuning?"]
    },
    {
        "num": 41,
        "title": "Parsing LLM Responses: JSON Extraction & Error Recovery",
        "xp": 150,
        "subtopics": ["1.41.1 Why LLMs wrap JSON in markdown fences and conversational text", "1.41.2 Regex fence stripping: removing ```json...``` wrappers", "1.41.3 XML tag extraction as fallback: <json>...</json>", "1.41.4 JSON mode and response schemas in modern APIs"],
        "failure_mode": "Calling json.loads() on raw LLM output without stripping markdown fences first.",
        "verification_criteria": "Implement parse_llm_structured_output(raw_response) trying JSON, XML, then direct parse.",
        "starter_code": {"solution.py": "import re, json\n\ndef parse_llm_structured_output(raw_response: str) -> dict | None:\n    fence_match = re.search(r'```(?:json)?\\s*([\\s\\S]*?)```', raw_response)\n    if fence_match:\n        try:\n            return json.loads(fence_match.group(1).strip())\n        except json.JSONDecodeError:\n            pass\n    xml_match = re.search(r'<json>(.*?)</json>', raw_response, re.DOTALL)\n    if xml_match:\n        try:\n            return json.loads(xml_match.group(1).strip())\n        except json.JSONDecodeError:\n            pass\n    try:\n        return json.loads(raw_response.strip())\n    except json.JSONDecodeError:\n        return None\n"},
        "test_suite": {"tests.py": "from solution import parse_llm_structured_output\n\ndef test_parse():\n    assert parse_llm_structured_output('```json\\n{\"key\": \"value\"}\\n```') == {'key': 'value'}\n    assert parse_llm_structured_output('{\"key\": \"value\"}') == {'key': 'value'}\n    assert parse_llm_structured_output('Not JSON at all') is None\n    print('✓ All assertions passed for Lesson 1.41')\n\nif __name__ == '__main__':\n    test_parse()\n", "verification_criteria": "Parse structured output with fallback chain.", "failure_mode": "Direct json.loads() on markdown-wrapped output."},
        "defense_prompts": ["What is JSON mode in the OpenAI API and how does it differ from prompt-based JSON extraction?", "Why is a fallback chain safer than assuming a single format?", "How would you handle LLM responses that include preamble before the JSON?"]
    },
    {
        "num": 42,
        "title": "Server-Sent Events (SSE): Streaming Token Responses",
        "xp": 150,
        "subtopics": ["1.42.1 SSE protocol: text/event-stream, data: prefix, [DONE] sentinel", "1.42.2 HTTP streaming with httpx iter_lines() on streamed response", "1.42.3 Parsing SSE: splitting on 'data: ' and skipping empty lines", "1.42.4 Progressive rendering: printing tokens as they arrive"],
        "failure_mode": "Buffering all SSE lines before processing, negating the latency benefit of streaming.",
        "verification_criteria": "Implement parse_sse_line(line) extracting JSON payload from SSE data: lines.",
        "starter_code": {"solution.py": "import json\n\ndef parse_sse_line(line: str) -> dict | None:\n    line = line.strip()\n    if not line or line == 'data: [DONE]':\n        return None\n    if line.startswith('data: '):\n        payload = line[len('data: '):]\n        try:\n            return json.loads(payload)\n        except json.JSONDecodeError:\n            return None\n    return None\n"},
        "test_suite": {"tests.py": "from solution import parse_sse_line\n\ndef test_sse():\n    chunk = parse_sse_line('data: {\"choices\": [{\"delta\": {\"content\": \"Hello\"}}]}')\n    assert chunk is not None\n    assert chunk['choices'][0]['delta']['content'] == 'Hello'\n    assert parse_sse_line('data: [DONE]') is None\n    assert parse_sse_line('') is None\n    print('✓ All assertions passed for Lesson 1.42')\n\nif __name__ == '__main__':\n    test_sse()\n", "verification_criteria": "Parse SSE lines and handle DONE sentinel.", "failure_mode": "Buffering all chunks before processing."},
        "defense_prompts": ["What is Server-Sent Events (SSE) and how does it differ from WebSockets?", "Why is streaming important for user experience in LLM-powered applications?", "What is the [DONE] sentinel in OpenAI SSE and how do you handle it?"]
    },
    {
        "num": 43,
        "title": "Pydantic v2: Data Validation & Structured Contracts",
        "xp": 150,
        "subtopics": ["1.43.1 Pydantic v2 BaseModel: type coercion, validation, schema generation", "1.43.2 @field_validator and @model_validator for custom validation", "1.43.3 model_validate() and model_validate_json() for parsing", "1.43.4 ValidationError introspection: error locations and messages"],
        "failure_mode": "Catching BaseModel instantiation errors with bare except instead of except ValidationError.",
        "verification_criteria": "Define ChatMessage Pydantic model with Literal role validation and non-empty content validation.",
        "starter_code": {"solution.py": "from pydantic import BaseModel, field_validator\nfrom typing import Literal\n\nclass ChatMessage(BaseModel):\n    role: Literal['system', 'user', 'assistant']\n    content: str\n\n    @field_validator('content')\n    @classmethod\n    def content_must_not_be_empty(cls, v: str) -> str:\n        if not v.strip():\n            raise ValueError('content must not be empty or whitespace-only')\n        return v\n"},
        "test_suite": {"tests.py": "from solution import ChatMessage\nfrom pydantic import ValidationError\n\ndef test_pydantic():\n    msg = ChatMessage(role='user', content='Hello')\n    assert msg.role == 'user'\n    try:\n        ChatMessage(role='invalid_role', content='Hi')\n        assert False\n    except ValidationError:\n        pass\n    try:\n        ChatMessage(role='user', content='   ')\n        assert False\n    except ValidationError:\n        pass\n    print('✓ All assertions passed for Lesson 1.43')\n\nif __name__ == '__main__':\n    test_pydantic()\n", "verification_criteria": "Validate role and content constraints.", "failure_mode": "Bare except masking ValidationError details."},
        "defense_prompts": ["What is the difference between Pydantic v1 and v2's validation approach?", "How does model_validate_json() differ from model_validate()?", "When would you use @model_validator vs @field_validator?"]
    },
    {
        "num": 44,
        "title": "Structured AI Outputs: Enforcing JSON Schemas from LLMs",
        "xp": 150,
        "subtopics": ["1.44.1 The structured output problem: schema enforcement from LLMs", "1.44.2 JSON mode and structured output APIs (OpenAI response_format)", "1.44.3 Pydantic model_json_schema(): generating JSON Schema for API injection", "1.44.4 End-to-end pipeline: prompt -> API -> Pydantic parse -> typed object"],
        "failure_mode": "Manually writing JSON Schema strings instead of generating them from Pydantic, causing schema drift.",
        "verification_criteria": "Implement validate_and_parse_completion(raw_json, model_class) using model_validate_json with error recovery.",
        "starter_code": {"solution.py": "from pydantic import BaseModel, ValidationError\nfrom typing import Type, TypeVar\n\nT = TypeVar('T', bound=BaseModel)\n\ndef validate_and_parse_completion(raw_json: str, model_class: Type[T]) -> T | None:\n    try:\n        return model_class.model_validate_json(raw_json)\n    except (ValidationError, ValueError):\n        return None\n"},
        "test_suite": {"tests.py": "from solution import validate_and_parse_completion\nfrom pydantic import BaseModel\n\nclass SummaryOutput(BaseModel):\n    title: str\n    points: list[str]\n\ndef test_structured():\n    valid = '{\"title\": \"Python Guide\", \"points\": [\"easy\", \"readable\"]}'\n    result = validate_and_parse_completion(valid, SummaryOutput)\n    assert result.title == 'Python Guide'\n    assert validate_and_parse_completion('not valid json', SummaryOutput) is None\n    print('✓ All assertions passed for Lesson 1.44')\n\nif __name__ == '__main__':\n    test_structured()\n", "verification_criteria": "Parse and validate structured completion output.", "failure_mode": "Manual JSON Schema construction diverges from Pydantic model."},
        "defense_prompts": ["What is model_json_schema() used for in API structured output mode?", "How does Pydantic's ValidationError differ from a Python ValueError?", "What is the benefit of using TypeVar bound to BaseModel?"]
    },
    {
        "num": 45,
        "title": "Async Python Basics: asyncio, await & Concurrent IO",
        "xp": 150,
        "subtopics": ["1.45.1 The event loop: single-threaded cooperative multitasking", "1.45.2 async def and await: declaring coroutines and suspending at IO", "1.45.3 asyncio.gather(): concurrent coroutines without threads", "1.45.4 async with and async for: async context managers and iterators"],
        "failure_mode": "Blocking the event loop with time.sleep() instead of await asyncio.sleep().",
        "verification_criteria": "Implement fetch_all_concurrently(urls) using asyncio.gather and httpx.AsyncClient.",
        "starter_code": {"solution.py": "import asyncio\nimport httpx\n\nasync def fetch_one(client: httpx.AsyncClient, url: str) -> dict:\n    try:\n        resp = await client.get(url, timeout=10.0)\n        return {'url': url, 'status': resp.status_code}\n    except Exception as e:\n        return {'url': url, 'status': -1, 'error': str(e)}\n\nasync def fetch_all_concurrently(urls: list[str]) -> list[dict]:\n    async with httpx.AsyncClient() as client:\n        return await asyncio.gather(*[fetch_one(client, url) for url in urls])\n"},
        "test_suite": {"tests.py": "import asyncio\nfrom solution import fetch_all_concurrently\n\ndef test_async_fetch():\n    async def run():\n        results = await fetch_all_concurrently(['https://httpbin.org/get'])\n        assert len(results) == 1\n        assert 'status' in results[0]\n    asyncio.run(run())\n    print('✓ All assertions passed for Lesson 1.45')\n\nif __name__ == '__main__':\n    test_async_fetch()\n", "verification_criteria": "Fetch URLs concurrently with asyncio.", "failure_mode": "time.sleep() blocks the entire event loop."},
        "defense_prompts": ["What is cooperative multitasking and how does Python's event loop implement it?", "Why does asyncio.gather() run coroutines concurrently even in a single thread?", "When should you use asyncio vs threading vs multiprocessing?"]
    },
    {
        "num": 46,
        "title": "Logging & Structured Observability for AI Applications",
        "xp": 150,
        "subtopics": ["1.46.1 Python logging module: Logger, Handler, Formatter hierarchy", "1.46.2 Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL", "1.46.3 Structured JSON logging for machine-parseable log pipelines", "1.46.4 Logging AI API calls: request_id, model, latency_ms, tokens, cost"],
        "failure_mode": "Using print() for production observability instead of logging module, losing timestamps and levels.",
        "verification_criteria": "Implement setup_json_logger(name, level) returning a logger emitting structured JSON.",
        "starter_code": {"solution.py": "import logging, json\n\nclass JSONFormatter(logging.Formatter):\n    def format(self, record: logging.LogRecord) -> str:\n        entry = {'level': record.levelname, 'name': record.name, 'message': record.getMessage()}\n        if record.exc_info:\n            entry['exception'] = self.formatException(record.exc_info)\n        return json.dumps(entry)\n\ndef setup_json_logger(name: str, level: int = logging.INFO) -> logging.Logger:\n    logger = logging.getLogger(name)\n    logger.setLevel(level)\n    if not logger.handlers:\n        h = logging.StreamHandler()\n        h.setFormatter(JSONFormatter())\n        logger.addHandler(h)\n    return logger\n"},
        "test_suite": {"tests.py": "import json, logging\nfrom io import StringIO\nfrom solution import setup_json_logger, JSONFormatter\n\ndef test_json_logger():\n    logger = setup_json_logger('test_logger')\n    stream = StringIO()\n    h = logging.StreamHandler(stream)\n    h.setFormatter(JSONFormatter())\n    logger.addHandler(h)\n    logger.info('API call completed')\n    output = stream.getvalue().strip().split('\\n')[-1]\n    record = json.loads(output)\n    assert record['level'] == 'INFO'\n    assert 'API call completed' in record['message']\n    print('✓ All assertions passed for Lesson 1.46')\n\nif __name__ == '__main__':\n    test_json_logger()\n", "verification_criteria": "Emit structured JSON log entries.", "failure_mode": "Using print() instead of logging loses log levels."},
        "defense_prompts": ["What is the difference between a Logger, a Handler, and a Formatter in Python logging?", "Why is structured JSON logging preferable to free-text log lines in production?", "What logging level should you use for AI API call metrics?"]
    },
    {
        "num": 47,
        "title": "Git Fundamentals: Commits, Branches & Diffs",
        "xp": 120,
        "subtopics": ["1.47.1 Git object model: blobs, trees, commits, and DAG history", "1.47.2 The 3 Git areas: Working Directory, Staging Index, Repository", "1.47.3 Branching: git switch -c and merging without panic", "1.47.4 Inspecting history: git log --oneline --graph and git diff HEAD~1"],
        "failure_mode": "Running git add . without git status first, committing .env or build artifacts.",
        "verification_criteria": "Implement parse_git_log_line(line) extracting commit hash and message.",
        "starter_code": {"solution.py": "import re\n\ndef parse_git_log_line(line: str) -> dict | None:\n    match = re.match(r'^([a-f0-9]{7,40})\\s+(.+)$', line.strip())\n    if match:\n        return {'hash': match.group(1), 'message': match.group(2)}\n    return None\n"},
        "test_suite": {"tests.py": "from solution import parse_git_log_line\n\ndef test_git_log():\n    result = parse_git_log_line('a1b2c3d feat: add token budget enforcement')\n    assert result == {'hash': 'a1b2c3d', 'message': 'feat: add token budget enforcement'}\n    assert parse_git_log_line('not a log line') is None\n    print('✓ All assertions passed for Lesson 1.47')\n\nif __name__ == '__main__':\n    test_git_log()\n", "verification_criteria": "Parse git log lines correctly.", "failure_mode": "Committing secrets via git add . without status check."},
        "defense_prompts": ["What is the Git object model and how are commits linked as a DAG?", "What is the difference between git merge and git rebase?", "How does .gitignore protect sensitive files from being tracked?"]
    },
    {
        "num": 48,
        "title": "Automated Testing with pytest: Fixtures, Parametrize & Coverage",
        "xp": 120,
        "subtopics": ["1.48.1 pytest test discovery: test_*.py and test_* functions", "1.48.2 @pytest.fixture for reusable setup objects", "1.48.3 @pytest.mark.parametrize for matrix testing", "1.48.4 pytest-cov for coverage measurement"],
        "failure_mode": "Writing tests that always pass because they never assert specific outcomes.",
        "verification_criteria": "Write parametrized pytest test suite for compute_token_bill covering 3 edge cases.",
        "starter_code": {"solution.py": "import pytest\n\ndef compute_token_bill(input_tokens: int, output_tokens: int, rate_per_k: float, discount: float) -> float:\n    total = ((input_tokens + output_tokens) / 1000) * rate_per_k * (1.0 - discount)\n    return round(total, 4)\n\n@pytest.mark.parametrize('inp, out, rate, disc, expected', [\n    (1000, 2000, 0.015, 0.10, 0.0405),\n    (0, 0, 0.01, 0.0, 0.0),\n    (5000, 5000, 0.020, 0.50, 0.1),\n])\ndef test_token_bill(inp, out, rate, disc, expected):\n    assert compute_token_bill(inp, out, rate, disc) == expected\n"},
        "test_suite": {"tests.py": "import pytest\nfrom solution import compute_token_bill\n\n@pytest.mark.parametrize('inp, out, rate, disc, expected', [\n    (1000, 2000, 0.015, 0.10, 0.0405),\n    (0, 0, 0.01, 0.0, 0.0),\n    (5000, 5000, 0.020, 0.50, 0.1),\n])\ndef test_token_bill(inp, out, rate, disc, expected):\n    assert compute_token_bill(inp, out, rate, disc) == expected\n\nif __name__ == '__main__':\n    print('✓ Parametrized tests defined for Lesson 1.48')\n", "verification_criteria": "Parametrized tests pass all 3 edge cases.", "failure_mode": "Tests without assert statements give false confidence."},
        "defense_prompts": ["What is test parametrization and why does it catch more bugs than single test cases?", "What is the scope parameter in @pytest.fixture and when would you use session scope?", "What does code coverage measure and what coverage percentage is considered good?"]
    },
    {
        "num": 49,
        "title": "Code Reviews, Refactoring & Technical Debt Recognition",
        "xp": 120,
        "subtopics": ["1.49.1 Code review: correctness, clarity, and maintainability checks", "1.49.2 Technical debt signals: long parameter lists, god functions, magic numbers", "1.49.3 Refactoring patterns: Extract Function, Rename Variable, Replace Magic Number", "1.49.4 The Boy Scout Rule: leave code cleaner on every commit"],
        "failure_mode": "Refactoring production code without a test suite, breaking behavior invisibly.",
        "verification_criteria": "Refactor calculate_llm_cost from magic numbers to named constants with full docstring.",
        "starter_code": {"solution.py": "BASE_RATE_PER_TOKEN = 0.000015\nVISION_MULTIPLIER = 1.5\n\ndef calculate_llm_cost(token_count: int, num_requests: int, has_vision: bool = False) -> float:\n    \"\"\"\n    Calculates estimated USD cost for LLM API calls.\n\n    Args:\n        token_count: Tokens per request.\n        num_requests: Number of API requests.\n        has_vision: Whether vision processing is involved (1.5x multiplier).\n\n    Returns:\n        Estimated cost in USD rounded to 6 decimal places.\n    \"\"\"\n    base_cost = token_count * num_requests * BASE_RATE_PER_TOKEN\n    if has_vision:\n        base_cost *= VISION_MULTIPLIER\n    return round(base_cost, 6)\n"},
        "test_suite": {"tests.py": "from solution import calculate_llm_cost\n\ndef test_refactored():\n    assert calculate_llm_cost(1000, 1) == round(1000 * 1 * 0.000015, 6)\n    assert calculate_llm_cost(1000, 1, has_vision=True) == round(0.015 * 1.5, 6)\n    print('✓ All assertions passed for Lesson 1.49')\n\nif __name__ == '__main__':\n    test_refactored()\n", "verification_criteria": "Refactored code is clean and tests pass.", "failure_mode": "Refactoring without tests breaks behavior silently."},
        "defense_prompts": ["What is technical debt and how does it compound over time?", "What is the Boy Scout Rule and how does it prevent code rot?", "Why should you always have tests before refactoring?"]
    },
    {
        "num": 50,
        "title": "Module 1 Capstone: PromptCLI — AI Prompt Engineering Workbench",
        "xp": 200,
        "subtopics": ["1.50.1 Integration: combining all 49 lessons into a production-grade CLI application", "1.50.2 PromptCLI features: multi-model routing, token budgeting, structured output, session logging", "1.50.3 Pydantic configuration, argparse CLI, and HTTPX API integration", "1.50.4 Complete pytest coverage across all modules"],
        "failure_mode": "Building as a monolithic single-file script; must be a proper Python package with separate modules.",
        "verification_criteria": "Build PromptCLI package with CLI parser, config validator, API caller, response parser, and session logger.",
        "starter_code": {"solution.py": "# PromptCLI Capstone Integration\nfrom pydantic import BaseModel, field_validator\nfrom typing import Literal\nimport argparse\n\nclass PromptCLIConfig(BaseModel):\n    model: Literal['gpt-4o', 'claude-3-5-sonnet', 'claude-3-haiku'] = 'gpt-4o'\n    temperature: float = 0.7\n    max_tokens: int = 2048\n    token_budget: int = 100000\n\n    @field_validator('temperature')\n    @classmethod\n    def validate_temp(cls, v):\n        if not 0.0 <= v <= 2.0:\n            raise ValueError(f'temperature {v} not in [0.0, 2.0]')\n        return v\n\ndef build_parser():\n    parser = argparse.ArgumentParser(description='PromptCLI - AI Engineering Workbench')\n    parser.add_argument('--model', default='gpt-4o')\n    parser.add_argument('--temp', type=float, default=0.7)\n    parser.add_argument('--prompt', required=True)\n    parser.add_argument('--budget', type=int, default=100000)\n    return parser\n"},
        "test_suite": {"tests.py": "from solution import PromptCLIConfig, build_parser\nfrom pydantic import ValidationError\n\ndef test_capstone():\n    cfg = PromptCLIConfig(model='claude-3-haiku', temperature=0.3, max_tokens=512)\n    assert cfg.model == 'claude-3-haiku'\n    try:\n        PromptCLIConfig(temperature=5.0)\n        assert False\n    except ValidationError:\n        pass\n    parser = build_parser()\n    args = parser.parse_args(['--prompt', 'Hello world'])\n    assert args.model == 'gpt-4o'\n    print('✓ PromptCLI Capstone passed for Lesson 1.50')\n\nif __name__ == '__main__':\n    test_capstone()\n", "verification_criteria": "Full PromptCLI integration validates correctly.", "failure_mode": "Monolithic script is not testable or modular."},
        "defense_prompts": ["How would you extend PromptCLI to support streaming token output?", "What production monitoring would you add to a deployed PromptCLI tool?", "How would you add multi-turn conversation memory to PromptCLI?"]
    },
]

# Combine all 50 lessons
ALL_LESSONS = M1_PART1 + M1_PART2_6
assert len(ALL_LESSONS) == 50, f"Expected 50 lessons, got {len(ALL_LESSONS)}"
print(f"✓ Total lessons loaded: {len(ALL_LESSONS)}")

# ==============================================================================
# SQL GENERATION & BATCH UPDATE
# ==============================================================================

def build_update_sql(lesson: dict) -> str:
    """Build a single UPDATE SQL statement for a node."""
    num = lesson["num"]
    node_id = f"node-0-{num}"
    mod_num = num  # order_index is 1-based

    title = f"Lesson 1.{num}: {lesson['title']}"
    slug = f"module-01-lesson-{num:02d}-{title.lower()}"[:80]
    slug = __import__('re').sub(r'[^a-z0-9-]', '-', slug).strip('-')

    subtitle = lesson.get("subtitle", f"Module 1 Python Foundations | Lesson {num} of 50")
    cs_foundation = f"Subtopics: {len(lesson['subtopics'])} items"
    ai_convergence = f"PromptCLI: {lesson['verification_criteria'][:60]}"
    xp_reward = lesson.get("xp", 100)

    # Build handbook_markdown
    subtopics_md = "\n".join(f"  - `{st}`" for st in lesson["subtopics"])
    handbook = (
        f"# {title}\n\n"
        f"- **Module**: `Module 1: Python Programming Foundations`\n"
        f"- **Status**: `[State: Active | Production Standard | Core]`\n"
        f"- **Subtopics**:\n{subtopics_md}\n\n"
        f"- **Key Failure Modes & Edge Cases**: {lesson['failure_mode']}\n"
        f"- **Verification & Mastery Check**: {lesson['verification_criteria']}\n"
    )

    # Build defense_prompts
    defense = lesson.get("defense_prompts", [
        f"Explain the key design decisions in {lesson['title']}.",
        f"How does this lesson's concept scale under production load?",
        f"Defend the architectural tradeoffs of this approach in modern AI systems."
    ])

    sql = f"""UPDATE curriculum_nodes
SET
    slug = '{esc(slug)}',
    phase_id = 'module-1',
    title = '{esc(title)}',
    subtitle = '{esc(subtitle)}',
    cs_foundation = '{esc(cs_foundation)}',
    ai_convergence = '{esc(ai_convergence)}',
    xp_reward = {xp_reward},
    order_index = {mod_num},
    handbook_markdown = '{esc(handbook)}',
    starter_code = {make_json_sql(lesson["starter_code"])},
    test_suite = {make_json_sql(lesson["test_suite"])},
    defense_prompts = {make_json_array_sql(defense)}
WHERE id = '{node_id}';"""
    return sql


# ==============================================================================
# EXECUTE BATCHES OF 10
# ==============================================================================

BATCH_SIZE = 10
batches = [ALL_LESSONS[i:i+BATCH_SIZE] for i in range(0, len(ALL_LESSONS), BATCH_SIZE)]

print(f"\nExecuting {len(batches)} batches of up to {BATCH_SIZE} updates each...")
print("=" * 60)

total_updated = 0
for batch_num, batch in enumerate(batches, 1):
    lesson_nums = [l["num"] for l in batch]
    print(f"\nBatch {batch_num}/{len(batches)}: Lessons {lesson_nums[0]}-{lesson_nums[-1]}")

    # Build combined SQL for the batch
    stmts = []
    for lesson in batch:
        stmts.append(build_update_sql(lesson))

    combined_sql = "\n".join(stmts)

    try:
        result = execute_sql(combined_sql, label=f"Batch {batch_num} ({lesson_nums[0]}-{lesson_nums[-1]})")
        total_updated += len(batch)
    except Exception as e:
        print(f"  ✗ Batch {batch_num} failed: {e}")
        # Try individual updates as fallback
        print(f"  Attempting individual updates...")
        for lesson in batch:
            try:
                sql = build_update_sql(lesson)
                execute_sql(sql, label=f"  node-0-{lesson['num']}")
                total_updated += 1
            except Exception as e2:
                print(f"  ✗ Lesson 1.{lesson['num']} failed: {e2}")

print(f"\n{'=' * 60}")
print(f"✓ Completed: {total_updated}/50 nodes updated.")

# ==============================================================================
# VERIFY
# ==============================================================================
print("\nVerifying database state...")
verify_sql = """
SELECT id, title, order_index, xp_reward
FROM curriculum_nodes
WHERE phase_id = 'module-1'
ORDER BY order_index ASC;
"""
result = execute_sql(verify_sql)
rows = result if isinstance(result, list) else []

print(f"  Total module-1 nodes: {len(rows)}")
if rows:
    print(f"  First: {rows[0]['id']} -> {rows[0]['title']}")
    print(f"  Last:  {rows[-1]['id']} -> {rows[-1]['title']}")

count_sql = "SELECT count(*) FROM curriculum_nodes;"
count_result = execute_sql(count_sql)
total_count = count_result[0]['count'] if count_result else '?'
print(f"  Total curriculum nodes: {total_count} (must remain 520)")

print("\n✓ Module 1 sync complete!")
