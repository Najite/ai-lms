#!/usr/bin/env python3
"""
scripts/build_m1_parts_2_6.py
Lessons 1.11 - 1.50 for Module 1: Python Programming Foundations.
Part 2: Functions, Scope, Exceptions & Standard Library (1.11–1.18)
Part 3: Advanced Collections, Comprehensions & Hashing (1.19–1.28)
Part 4: Modern File I/O, Pathlib, Serialization, Virtualenvs & CLI (1.29–1.36)
Part 5: AI-Native Engineering Foundations (1.37–1.46)
Part 6: Git Workflow, Pytest Testing & Module Capstone (1.47–1.50)
"""

M1_LESSONS_PART2 = [
    # -------------------------------------------------------------------------
    # PART 2: Functions Advanced, Exceptions & Standard Library (1.11 - 1.18)
    # -------------------------------------------------------------------------
    {
        "num": 11,
        "title": "Advanced Functions: *args, **kwargs & Higher-Order Functions",
        "subtitle": "Module 1 Python Foundations | Lesson 11 of 50",
        "xp": 110,
        "subtopics": [
            "1.11.1 Variadic positional arguments with *args: collecting unlimited arguments into a tuple",
            "1.11.2 Keyword variadic arguments with **kwargs: collecting unlimited named arguments into a dict",
            "1.11.3 Higher-order functions: functions that accept functions as parameters or return functions",
            "1.11.4 The functools.partial factory: pre-filling function arguments for reusable call interfaces"
        ],
        "failure_mode": "Mixing *args and **kwargs in wrong order (must be: positional, *args, keyword-defaults, **kwargs).",
        "verification_criteria": "Implement `make_api_caller(base_url, **default_headers)` returning a function that merges default headers with call-time overrides.",
        "starter_code": (
            "def make_api_caller(base_url: str, **default_headers):\n"
            "    \"\"\"\n"
            "    Returns a function call(endpoint, **extra_headers) that merges\n"
            "    default_headers with extra_headers and returns the full URL and headers dict.\n"
            "    \"\"\"\n"
            "    def call(endpoint: str, **extra_headers) -> dict:\n"
            "        merged = {**default_headers, **extra_headers}\n"
            "        return {'url': f'{base_url}{endpoint}', 'headers': merged}\n"
            "    return call\n"
        ),
        "test_suite": (
            "from solution import make_api_caller\n\n"
            "def test_caller():\n"
            "    caller = make_api_caller('https://api.example.com', Authorization='Bearer TOKEN')\n"
            "    result = caller('/v1/chat', X_Version='2024-01')\n"
            "    assert result['url'] == 'https://api.example.com/v1/chat'\n"
            "    assert result['headers']['Authorization'] == 'Bearer TOKEN'\n"
            "    assert result['headers']['X_Version'] == '2024-01'\n"
            "    print('✓ All assertions passed for Lesson 1.11')\n\n"
            "if __name__ == '__main__':\n"
            "    test_caller()\n"
        )
    },
    {
        "num": 12,
        "title": "Lambda Functions & Functional Programming Primitives",
        "subtitle": "Module 1 Python Foundations | Lesson 12 of 50",
        "xp": 110,
        "subtopics": [
            "1.12.1 Lambda expressions: anonymous single-expression function literals",
            "1.12.2 map(): applying a transformation function lazily across an iterable",
            "1.12.3 filter(): selecting items from an iterable where predicate returns True",
            "1.12.4 sorted() with key= parameter: using lambdas for custom comparison ordering"
        ],
        "failure_mode": "Writing complex multi-step logic in lambdas; lambdas are for single-expression transforms only.",
        "verification_criteria": "Implement `rank_models(model_list)` sorting by cost_per_1k ascending, then context_window descending, using sorted() with a lambda key.",
        "starter_code": (
            "def rank_models(models: list[dict]) -> list[dict]:\n"
            "    \"\"\"\n"
            "    Sorts a list of model dicts by cost_per_1k ascending, then context_window descending.\n"
            "    Each dict has keys: 'name' (str), 'cost_per_1k' (float), 'context_window' (int).\n"
            "    \"\"\"\n"
            "    # TODO: Use sorted() with a lambda key returning a tuple\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import rank_models\n\n"
            "def test_rank():\n"
            "    models = [\n"
            "        {'name': 'A', 'cost_per_1k': 0.02, 'context_window': 8000},\n"
            "        {'name': 'B', 'cost_per_1k': 0.01, 'context_window': 16000},\n"
            "        {'name': 'C', 'cost_per_1k': 0.01, 'context_window': 32000},\n"
            "    ]\n"
            "    ranked = rank_models(models)\n"
            "    assert ranked[0]['name'] == 'C'  # Cheapest AND biggest context\n"
            "    assert ranked[1]['name'] == 'B'\n"
            "    assert ranked[2]['name'] == 'A'\n"
            "    print('✓ All assertions passed for Lesson 1.12')\n\n"
            "if __name__ == '__main__':\n"
            "    test_rank()\n"
        )
    },
    {
        "num": 13,
        "title": "Exception Handling: try, except, else & finally",
        "subtitle": "Module 1 Python Foundations | Lesson 13 of 50",
        "xp": 110,
        "subtopics": [
            "1.13.1 Python exception hierarchy: BaseException, Exception, and common subclasses",
            "1.13.2 Catching specific exception types to prevent masking unrelated failures",
            "1.13.3 The else clause: code that runs only when no exception was raised",
            "1.13.4 The finally clause: guaranteed cleanup regardless of success or failure"
        ],
        "failure_mode": "Using bare except: which silently catches SystemExit and KeyboardInterrupt, making Ctrl+C impossible.",
        "verification_criteria": "Implement `safe_json_parse(raw_text)` returning parsed dict or None, wrapping both json.JSONDecodeError and ValueError specifically.",
        "starter_code": (
            "import json\n\n"
            "def safe_json_parse(raw_text: str) -> dict | None:\n"
            "    \"\"\"\n"
            "    Attempts to parse raw_text as JSON.\n"
            "    Returns the parsed dict on success, or None on json.JSONDecodeError or ValueError.\n"
            "    Never raises; always returns safely.\n"
            "    \"\"\"\n"
            "    # TODO: Implement specific exception catching\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import safe_json_parse\n\n"
            "def test_parse():\n"
            "    assert safe_json_parse('{\"model\": \"gpt-4o\"}') == {'model': 'gpt-4o'}\n"
            "    assert safe_json_parse('not json at all') is None\n"
            "    assert safe_json_parse('') is None\n"
            "    print('✓ All assertions passed for Lesson 1.13')\n\n"
            "if __name__ == '__main__':\n"
            "    test_parse()\n"
        )
    },
    {
        "num": 14,
        "title": "Custom Exceptions & Defensive Error Design",
        "subtitle": "Module 1 Python Foundations | Lesson 14 of 50",
        "xp": 110,
        "subtopics": [
            "1.14.1 Defining custom exception classes by subclassing Exception",
            "1.14.2 Adding structured metadata to exceptions with __init__ parameters",
            "1.14.3 Re-raising exceptions with raise from for exception chaining and traceback preservation",
            "1.14.4 Building error hierarchies: ModelError -> RateLimitError, ContextWindowError"
        ],
        "failure_mode": "Swallowing exceptions without re-raising or logging, making production bugs completely invisible.",
        "verification_criteria": "Define `TokenBudgetExceededError(budget, actual)` and a function `enforce_budget(tokens, budget)` that raises it.",
        "starter_code": (
            "class TokenBudgetExceededError(Exception):\n"
            "    \"\"\"\n"
            "    Raised when a token count exceeds the configured budget limit.\n"
            "    Attributes:\n"
            "        budget: int - The configured maximum token budget\n"
            "        actual: int - The actual token count that exceeded the budget\n"
            "    \"\"\"\n"
            "    def __init__(self, budget: int, actual: int):\n"
            "        self.budget = budget\n"
            "        self.actual = actual\n"
            "        super().__init__(f'Token budget exceeded: {actual} > {budget}')\n\n"
            "def enforce_budget(tokens: int, budget: int) -> None:\n"
            "    \"\"\"\n"
            "    Raises TokenBudgetExceededError if tokens > budget.\n"
            "    \"\"\"\n"
            "    # TODO: Implement budget enforcement\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import TokenBudgetExceededError, enforce_budget\n\n"
            "def test_budget():\n"
            "    enforce_budget(100, 200)  # Should not raise\n"
            "    try:\n"
            "        enforce_budget(500, 200)\n"
            "        assert False, 'Should have raised'\n"
            "    except TokenBudgetExceededError as e:\n"
            "        assert e.budget == 200\n"
            "        assert e.actual == 500\n"
            "        assert '500' in str(e)\n"
            "    print('✓ All assertions passed for Lesson 1.14')\n\n"
            "if __name__ == '__main__':\n"
            "    test_budget()\n"
        )
    },
    {
        "num": 15,
        "title": "Python Standard Library: os, sys, pathlib & datetime",
        "subtitle": "Module 1 Python Foundations | Lesson 15 of 50",
        "xp": 110,
        "subtopics": [
            "1.15.1 The os module: process environment, path manipulation, and subprocess spawning",
            "1.15.2 The sys module: interpreter introspection, argv, and graceful exit control",
            "1.15.3 pathlib.Path: object-oriented filesystem navigation and cross-platform path assembly",
            "1.15.4 datetime and timezone-aware timestamps for structured log entries"
        ],
        "failure_mode": "Using string concatenation for file paths (e.g. base_dir + '/file.txt') which breaks on Windows; use pathlib.Path instead.",
        "verification_criteria": "Implement `build_log_path(base_dir, model_name)` using pathlib returning a timestamped .jsonl log path.",
        "starter_code": (
            "from pathlib import Path\n"
            "from datetime import datetime\n\n"
            "def build_log_path(base_dir: str, model_name: str) -> Path:\n"
            "    \"\"\"\n"
            "    Constructs a Path object: base_dir / 'logs' / 'model_name_YYYYMMDD.jsonl'\n"
            "    The date is today's date in 'YYYYMMDD' format.\n"
            "    \"\"\"\n"
            "    # TODO: Use pathlib.Path and datetime.now().strftime\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import build_log_path\n"
            "from pathlib import Path\n"
            "from datetime import datetime\n\n"
            "def test_log_path():\n"
            "    today = datetime.now().strftime('%Y%m%d')\n"
            "    p = build_log_path('/var/logs', 'gpt-4o')\n"
            "    assert isinstance(p, Path)\n"
            "    assert p.name == f'gpt-4o_{today}.jsonl'\n"
            "    assert 'logs' in str(p)\n"
            "    print('✓ All assertions passed for Lesson 1.15')\n\n"
            "if __name__ == '__main__':\n"
            "    test_log_path()\n"
        )
    },
    {
        "num": 16,
        "title": "Generators, Iterators & Lazy Evaluation",
        "subtitle": "Module 1 Python Foundations | Lesson 16 of 50",
        "xp": 110,
        "subtopics": [
            "1.16.1 The Iterator Protocol: __iter__ and __next__ and StopIteration",
            "1.16.2 Generator functions with yield: suspending execution and resuming state",
            "1.16.3 Generator expressions: memory-efficient transforms without full list materialization",
            "1.16.4 When to use generators: streaming AI token responses, large log file processing"
        ],
        "failure_mode": "Materializing a generator into a list before iteration is needed, losing all memory efficiency benefits.",
        "verification_criteria": "Implement `token_stream_generator(text, chunk_size)` yielding text chunks simulating SSE token delivery.",
        "starter_code": (
            "def token_stream_generator(text: str, chunk_size: int):\n"
            "    \"\"\"\n"
            "    Yields successive chunks of length chunk_size from text.\n"
            "    Last chunk may be shorter if text length is not divisible by chunk_size.\n"
            "    \"\"\"\n"
            "    # TODO: Implement generator with yield\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import token_stream_generator\n\n"
            "def test_generator():\n"
            "    chunks = list(token_stream_generator('Hello World', 3))\n"
            "    assert chunks == ['Hel', 'lo ', 'Wor', 'ld']\n"
            "    total = ''.join(token_stream_generator('ABCDE', 2))\n"
            "    assert total == 'ABCDE'\n"
            "    print('✓ All assertions passed for Lesson 1.16')\n\n"
            "if __name__ == '__main__':\n"
            "    test_generator()\n"
        )
    },
    {
        "num": 17,
        "title": "Decorators: Function Wrappers & @functools.wraps",
        "subtitle": "Module 1 Python Foundations | Lesson 17 of 50",
        "xp": 110,
        "subtopics": [
            "1.17.1 Functions as first-class objects: passing and returning functions",
            "1.17.2 The decorator pattern: wrapping functions to add cross-cutting behavior",
            "1.17.3 functools.wraps: preserving the wrapped function's __name__ and __doc__",
            "1.17.4 Practical decorator use cases: timing, retry logic, structured logging"
        ],
        "failure_mode": "Forgetting @functools.wraps(fn) causing all wrapped functions to appear as 'wrapper' in stack traces and introspection.",
        "verification_criteria": "Implement `@retry_on_exception(max_attempts)` decorator that retries the wrapped function up to max_attempts times on any Exception.",
        "starter_code": (
            "import functools\n\n"
            "def retry_on_exception(max_attempts: int):\n"
            "    \"\"\"\n"
            "    Decorator factory that retries the wrapped function up to max_attempts times.\n"
            "    If all attempts fail, re-raises the last exception.\n"
            "    \"\"\"\n"
            "    def decorator(fn):\n"
            "        @functools.wraps(fn)\n"
            "        def wrapper(*args, **kwargs):\n"
            "            last_exc = None\n"
            "            for attempt in range(max_attempts):\n"
            "                try:\n"
            "                    return fn(*args, **kwargs)\n"
            "                except Exception as e:\n"
            "                    last_exc = e\n"
            "            raise last_exc\n"
            "        return wrapper\n"
            "    return decorator\n"
        ),
        "test_suite": (
            "from solution import retry_on_exception\n\n"
            "def test_retry_decorator():\n"
            "    call_count = [0]\n"
            "    @retry_on_exception(3)\n"
            "    def flaky_fn():\n"
            "        call_count[0] += 1\n"
            "        if call_count[0] < 3:\n"
            "            raise ValueError('not ready')\n"
            "        return 'done'\n"
            "    result = flaky_fn()\n"
            "    assert result == 'done'\n"
            "    assert call_count[0] == 3\n"
            "    print('✓ All assertions passed for Lesson 1.17')\n\n"
            "if __name__ == '__main__':\n"
            "    test_retry_decorator()\n"
        )
    },
    {
        "num": 18,
        "title": "Context Managers: with Statements & Resource Lifecycle",
        "subtitle": "Module 1 Python Foundations | Lesson 18 of 50",
        "xp": 110,
        "subtopics": [
            "1.18.1 The context manager protocol: __enter__ and __exit__ method contracts",
            "1.18.2 The with statement: guaranteed resource cleanup on exit or exception",
            "1.18.3 contextlib.contextmanager: building context managers with generator functions",
            "1.18.4 Practical use cases: file handles, HTTP clients, database connections, timer contexts"
        ],
        "failure_mode": "Failing to use with statements for file operations, leaving open file descriptors causing OS resource exhaustion.",
        "verification_criteria": "Implement a `TimerContext` class using __enter__/__exit__ that records elapsed time in milliseconds.",
        "starter_code": (
            "import time\n\n"
            "class TimerContext:\n"
            "    \"\"\"\n"
            "    Context manager that measures elapsed execution time.\n"
            "    After exiting: self.elapsed_ms is populated with elapsed milliseconds.\n"
            "    \"\"\"\n"
            "    def __init__(self):\n"
            "        self.elapsed_ms = 0.0\n"
            "        self._start = None\n\n"
            "    def __enter__(self):\n"
            "        self._start = time.perf_counter()\n"
            "        return self\n\n"
            "    def __exit__(self, exc_type, exc_val, exc_tb):\n"
            "        self.elapsed_ms = (time.perf_counter() - self._start) * 1000\n"
            "        return False  # Never suppress exceptions\n"
        ),
        "test_suite": (
            "from solution import TimerContext\n"
            "import time\n\n"
            "def test_timer():\n"
            "    with TimerContext() as t:\n"
            "        time.sleep(0.01)\n"
            "    assert t.elapsed_ms >= 10.0, f'Expected >= 10ms, got {t.elapsed_ms}'\n"
            "    print('✓ All assertions passed for Lesson 1.18')\n\n"
            "if __name__ == '__main__':\n"
            "    test_timer()\n"
        )
    },
    # -------------------------------------------------------------------------
    # PART 3: Advanced Collections, Comprehensions & Hashing (1.19 - 1.28)
    # -------------------------------------------------------------------------
    {
        "num": 19,
        "title": "Lists In Depth: Mutation, Copying & O(n) Complexity",
        "subtitle": "Module 1 Python Foundations | Lesson 19 of 50",
        "xp": 120,
        "subtopics": [
            "1.19.1 List as a dynamic array: amortized O(1) append and O(n) insert/remove",
            "1.19.2 Shallow copy vs deep copy: copy.copy() vs copy.deepcopy() mechanics",
            "1.19.3 In-place mutation: sort() vs sorted(), reverse() vs reversed()",
            "1.19.4 List concatenation cost: why += is O(k) but + creates a new O(n+k) list"
        ],
        "failure_mode": "Copying nested lists with list.copy() or slice [:] and assuming inner objects are independent copies.",
        "verification_criteria": "Implement `deep_copy_conversation(history)` returning an independent copy of a list of message dicts.",
        "starter_code": (
            "import copy\n\n"
            "def deep_copy_conversation(history: list[dict]) -> list[dict]:\n"
            "    \"\"\"\n"
            "    Returns a deep copy of history such that modifying returned values\n"
            "    does not affect the original history list or any inner dicts.\n"
            "    \"\"\"\n"
            "    # TODO: Use copy.deepcopy\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import deep_copy_conversation\n\n"
            "def test_deep_copy():\n"
            "    original = [{'role': 'user', 'content': 'Hello'}]\n"
            "    copied = deep_copy_conversation(original)\n"
            "    copied[0]['content'] = 'Modified'\n"
            "    assert original[0]['content'] == 'Hello', 'Original should be unchanged'\n"
            "    print('✓ All assertions passed for Lesson 1.19')\n\n"
            "if __name__ == '__main__':\n"
            "    test_deep_copy()\n"
        )
    },
    {
        "num": 20,
        "title": "List & Dict Comprehensions: Idiomatic Data Transforms",
        "subtitle": "Module 1 Python Foundations | Lesson 20 of 50",
        "xp": 120,
        "subtopics": [
            "1.20.1 List comprehension syntax: [expr for item in iterable if condition]",
            "1.20.2 Dict comprehension syntax: {key_expr: val_expr for item in iterable}",
            "1.20.3 Set comprehensions: {expr for item in iterable if condition}",
            "1.20.4 Nested comprehensions: flattening 2D structures vs readability costs"
        ],
        "failure_mode": "Using nested three-level comprehensions that sacrifice readability; over-compression is a code smell.",
        "verification_criteria": "Implement `normalize_messages(messages)` using a list comprehension to strip and lowercase all message content fields.",
        "starter_code": (
            "def normalize_messages(messages: list[dict]) -> list[dict]:\n"
            "    \"\"\"\n"
            "    Returns a new list where each message dict has its 'content' field\n"
            "    stripped of whitespace and lowercased. The 'role' field is unchanged.\n"
            "    Use a list comprehension and dict unpacking.\n"
            "    \"\"\"\n"
            "    # TODO: Implement with list comprehension\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import normalize_messages\n\n"
            "def test_normalize():\n"
            "    msgs = [{'role': 'user', 'content': '  Hello WORLD  '}]\n"
            "    result = normalize_messages(msgs)\n"
            "    assert result == [{'role': 'user', 'content': 'hello world'}]\n"
            "    assert msgs[0]['content'] == '  Hello WORLD  ', 'Original unchanged'\n"
            "    print('✓ All assertions passed for Lesson 1.20')\n\n"
            "if __name__ == '__main__':\n"
            "    test_normalize()\n"
        )
    },
    {
        "num": 21,
        "title": "Tuples: Immutable Sequences & Structural Unpacking",
        "subtitle": "Module 1 Python Foundations | Lesson 21 of 50",
        "xp": 120,
        "subtopics": [
            "1.21.1 Tuples as heterogeneous immutable records vs homogeneous mutable lists",
            "1.21.2 Tuple packing and sequence unpacking: a, b, c = (1, 2, 3)",
            "1.21.3 Extended unpacking with *rest: first, *middle, last = iterable",
            "1.21.4 Namedtuples for readable positional record types"
        ],
        "failure_mode": "Confusing single-element tuple syntax: (42) is an int, but (42,) is a tuple.",
        "verification_criteria": "Implement `parse_model_response(response_tuple)` unpacking a (role, content, tokens_used) tuple into a dict.",
        "starter_code": (
            "from collections import namedtuple\n\n"
            "ModelResponse = namedtuple('ModelResponse', ['role', 'content', 'tokens_used'])\n\n"
            "def parse_model_response(response_tuple: tuple) -> dict:\n"
            "    \"\"\"\n"
            "    Unpacks (role, content, tokens_used) tuple into a ModelResponse namedtuple,\n"
            "    then returns {'role': ..., 'content': ..., 'tokens_used': ...}.\n"
            "    \"\"\"\n"
            "    # TODO: Unpack and return dict\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import parse_model_response\n\n"
            "def test_unpack():\n"
            "    r = parse_model_response(('assistant', 'Here is the answer', 150))\n"
            "    assert r['role'] == 'assistant'\n"
            "    assert r['tokens_used'] == 150\n"
            "    print('✓ All assertions passed for Lesson 1.21')\n\n"
            "if __name__ == '__main__':\n"
            "    test_unpack()\n"
        )
    },
    {
        "num": 22,
        "title": "Dictionaries: Hash Maps, O(1) Lookups & Key Contracts",
        "subtitle": "Module 1 Python Foundations | Lesson 22 of 50",
        "xp": 120,
        "subtopics": [
            "1.22.1 Hash tables: how Python implements O(1) average lookup via hash() and table probing",
            "1.22.2 Safe key access patterns: dict.get(key, default) vs dict[key] raising KeyError",
            "1.22.3 Dictionary merging: {**a, **b} spread operator and dict.update() semantics",
            "1.22.4 Hashable key requirements: why lists cannot be dict keys but tuples can"
        ],
        "failure_mode": "Using mutable objects (lists, other dicts) as dictionary keys causing TypeError: unhashable type.",
        "verification_criteria": "Implement `merge_model_configs(base_config, overrides)` using dict spread, returning merged config dict.",
        "starter_code": (
            "def merge_model_configs(base_config: dict, overrides: dict) -> dict:\n"
            "    \"\"\"\n"
            "    Returns a new dict where all keys from base_config are present,\n"
            "    and any keys in overrides supersede the base_config values.\n"
            "    Neither input dict should be mutated.\n"
            "    \"\"\"\n"
            "    # TODO: Use dict spread {**base_config, **overrides}\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import merge_model_configs\n\n"
            "def test_merge():\n"
            "    base = {'model': 'haiku', 'temp': 0.7, 'max_tokens': 1024}\n"
            "    overrides = {'model': 'sonnet', 'max_tokens': 4096}\n"
            "    merged = merge_model_configs(base, overrides)\n"
            "    assert merged == {'model': 'sonnet', 'temp': 0.7, 'max_tokens': 4096}\n"
            "    assert base['model'] == 'haiku', 'base should be unchanged'\n"
            "    print('✓ All assertions passed for Lesson 1.22')\n\n"
            "if __name__ == '__main__':\n"
            "    test_merge()\n"
        )
    },
    {
        "num": 23,
        "title": "Sets: Hashing, Deduplication & Set Algebra",
        "subtitle": "Module 1 Python Foundations | Lesson 23 of 50",
        "xp": 120,
        "subtopics": [
            "1.23.1 Set internal hash table: O(1) membership testing vs O(n) linear search in lists",
            "1.23.2 Set construction and deduplication: set(collection) removes all duplicate elements",
            "1.23.3 Set operations: union (|), intersection (&), difference (-), symmetric difference (^)",
            "1.23.4 Frozenset: immutable hashable sets for use as dictionary keys"
        ],
        "failure_mode": "Expecting ordered iteration from sets; sets are unordered and iteration order is undefined.",
        "verification_criteria": "Implement `find_shared_capabilities(model_a_caps, model_b_caps)` using intersection to find common features.",
        "starter_code": (
            "def find_shared_capabilities(caps_a: set, caps_b: set) -> set:\n"
            "    \"\"\"\n"
            "    Returns the intersection of two capability sets.\n"
            "    Also returns the set of capabilities exclusive to caps_a.\n"
            "    \"\"\"\n"
            "    shared = caps_a & caps_b\n"
            "    exclusive_a = caps_a - caps_b\n"
            "    return shared, exclusive_a\n"
        ),
        "test_suite": (
            "from solution import find_shared_capabilities\n\n"
            "def test_sets():\n"
            "    a = {'vision', 'code', 'reasoning'}\n"
            "    b = {'vision', 'reasoning', 'audio'}\n"
            "    shared, exclusive = find_shared_capabilities(a, b)\n"
            "    assert shared == {'vision', 'reasoning'}\n"
            "    assert exclusive == {'code'}\n"
            "    print('✓ All assertions passed for Lesson 1.23')\n\n"
            "if __name__ == '__main__':\n"
            "    test_sets()\n"
        )
    },
    {
        "num": 24,
        "title": "Collections Module: Counter, defaultdict & deque",
        "subtitle": "Module 1 Python Foundations | Lesson 24 of 50",
        "xp": 120,
        "subtopics": [
            "1.24.1 Counter: frequency-counting any iterable in O(n) time",
            "1.24.2 defaultdict: auto-initializing missing keys with a factory function",
            "1.24.3 deque: O(1) append and popleft for sliding window and queue algorithms",
            "1.24.4 OrderedDict: preserved insertion order before Python 3.7 and move_to_end()"
        ],
        "failure_mode": "Using a regular dict for counting frequencies and crashing with KeyError on the first unseen key.",
        "verification_criteria": "Implement `count_token_frequencies(token_list)` using Counter, returning the top 3 most common tokens.",
        "starter_code": (
            "from collections import Counter\n\n"
            "def count_token_frequencies(token_list: list[str]) -> list[tuple]:\n"
            "    \"\"\"\n"
            "    Counts token frequencies and returns the top 3 as (token, count) tuples.\n"
            "    \"\"\"\n"
            "    # TODO: Use Counter.most_common(3)\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import count_token_frequencies\n\n"
            "def test_counter():\n"
            "    tokens = ['the', 'cat', 'sat', 'the', 'cat', 'the']\n"
            "    top3 = count_token_frequencies(tokens)\n"
            "    assert top3[0] == ('the', 3)\n"
            "    assert top3[1] == ('cat', 2)\n"
            "    print('✓ All assertions passed for Lesson 1.24')\n\n"
            "if __name__ == '__main__':\n"
            "    test_counter()\n"
        )
    },
    {
        "num": 25,
        "title": "String Formatting: f-strings, Templates & Prompt Hydration",
        "subtitle": "Module 1 Python Foundations | Lesson 25 of 50",
        "xp": 120,
        "subtopics": [
            "1.25.1 f-string expressions: inline evaluation, format specs (:.2f, :>10, :0>5)",
            "1.25.2 str.format() and positional vs named substitution",
            "1.25.3 Template strings from string.Template: safer substitution preventing injection",
            "1.25.4 Prompt template hydration: structuring system/user messages with variable slots"
        ],
        "failure_mode": "Building prompts via direct string concatenation instead of structured templates, making multi-variable prompts unmaintainable.",
        "verification_criteria": "Implement `hydrate_prompt(template, variables)` substituting all {key} placeholders using str.format_map().",
        "starter_code": (
            "def hydrate_prompt(template: str, variables: dict) -> str:\n"
            "    \"\"\"\n"
            "    Substitutes all {key} placeholders in template with values from variables dict.\n"
            "    Uses str.format_map() for safe substitution.\n"
            "    Raises KeyError if a required variable is missing.\n"
            "    \"\"\"\n"
            "    # TODO: Implement using template.format_map(variables)\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import hydrate_prompt\n\n"
            "def test_hydrate():\n"
            "    tmpl = 'You are a {role}. Answer about {topic} in {lang}.'\n"
            "    result = hydrate_prompt(tmpl, {'role': 'developer', 'topic': 'Python', 'lang': 'English'})\n"
            "    assert result == 'You are a developer. Answer about Python in English.'\n"
            "    try:\n"
            "        hydrate_prompt(tmpl, {'role': 'dev'})  # Missing keys\n"
            "        assert False, 'Should raise KeyError'\n"
            "    except KeyError:\n"
            "        pass\n"
            "    print('✓ All assertions passed for Lesson 1.25')\n\n"
            "if __name__ == '__main__':\n"
            "    test_hydrate()\n"
        )
    },
    {
        "num": 26,
        "title": "Regular Expressions: Pattern Matching & Text Extraction",
        "subtitle": "Module 1 Python Foundations | Lesson 26 of 50",
        "xp": 120,
        "subtopics": [
            "1.26.1 The re module: compile(), search(), match(), findall(), sub()",
            "1.26.2 Core metacharacters: . * + ? ^ $ [] () | \\",
            "1.26.3 Named capture groups: (?P<name>...) for structured extraction",
            "1.26.4 Greedy vs lazy quantifiers: .*? vs .* in AI response parsing"
        ],
        "failure_mode": "Using greedy .* to extract JSON content from LLM responses, consuming multiple JSON blocks instead of the first one.",
        "verification_criteria": "Implement `extract_json_block(text)` using a non-greedy regex to pull the first ```json ... ``` code block.",
        "starter_code": (
            "import re\n\n"
            "def extract_json_block(text: str) -> str | None:\n"
            "    \"\"\"\n"
            "    Extracts the content of the first ```json ... ``` fenced code block.\n"
            "    Returns the raw JSON string (no fences), or None if no match found.\n"
            "    Use a non-greedy quantifier to prevent over-capturing.\n"
            "    \"\"\"\n"
            "    # TODO: Implement re.search with a non-greedy pattern\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import extract_json_block\n\n"
            "def test_extract():\n"
            "    text = 'Here is the output:\\n```json\\n{\"key\": \"value\"}\\n```\\nDone.'\n"
            "    result = extract_json_block(text)\n"
            "    assert result is not None\n"
            "    assert '{\"key\": \"value\"}' in result\n"
            "    assert '```' not in result\n"
            "    assert extract_json_block('No code block here') is None\n"
            "    print('✓ All assertions passed for Lesson 1.26')\n\n"
            "if __name__ == '__main__':\n"
            "    test_extract()\n"
        )
    },
    {
        "num": 27,
        "title": "Type Hints & Static Analysis with mypy",
        "subtitle": "Module 1 Python Foundations | Lesson 27 of 50",
        "xp": 120,
        "subtopics": [
            "1.27.1 Type annotation syntax: variables, parameters, and return values",
            "1.27.2 Generic container types: list[str], dict[str, int], tuple[int, ...], Optional[T]",
            "1.27.3 Union types: str | None (Python 3.10+) and Optional from typing module",
            "1.27.4 Running mypy for static validation and fixing common type errors"
        ],
        "failure_mode": "Assuming type hints enforce runtime behavior; they are analysis-only and do not prevent runtime type mismatches.",
        "verification_criteria": "Write a fully annotated `parse_completion(response_body)` function with complete type signatures on all parameters and return types.",
        "starter_code": (
            "from typing import Optional\n\n"
            "def parse_completion(response_body: dict) -> Optional[str]:\n"
            "    \"\"\"\n"
            "    Safely extracts the text content from an OpenAI-style completion response.\n"
            "    Returns the content string, or None if the expected structure is missing.\n"
            "    Expected structure: {'choices': [{'message': {'content': '...'}}]}\n"
            "    \"\"\"\n"
            "    # TODO: Implement safe nested key extraction with type annotations\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import parse_completion\n\n"
            "def test_parse():\n"
            "    valid = {'choices': [{'message': {'content': 'Hello world'}}]}\n"
            "    assert parse_completion(valid) == 'Hello world'\n"
            "    assert parse_completion({}) is None\n"
            "    assert parse_completion({'choices': []}) is None\n"
            "    print('✓ All assertions passed for Lesson 1.27')\n\n"
            "if __name__ == '__main__':\n"
            "    test_parse()\n"
        )
    },
    {
        "num": 28,
        "title": "Dataclasses & Named Records",
        "subtitle": "Module 1 Python Foundations | Lesson 28 of 50",
        "xp": 120,
        "subtopics": [
            "1.28.1 @dataclass decorator: auto-generating __init__, __repr__, and __eq__",
            "1.28.2 Field defaults and field() with default_factory for mutable defaults",
            "1.28.3 Frozen dataclasses: immutable records equivalent to typed named tuples",
            "1.28.4 Post-init validation with __post_init__ for business logic enforcement"
        ],
        "failure_mode": "Setting a mutable default (e.g. field default=[]) without field(default_factory=list), causing state sharing across instances.",
        "verification_criteria": "Define `@dataclass class ModelConfig` with fields: name, temperature, max_tokens, and post-init validation.",
        "starter_code": (
            "from dataclasses import dataclass, field\n\n"
            "@dataclass\n"
            "class ModelConfig:\n"
            "    name: str\n"
            "    temperature: float = 0.7\n"
            "    max_tokens: int = 2048\n"
            "    tags: list[str] = field(default_factory=list)\n\n"
            "    def __post_init__(self):\n"
            "        if not (0.0 <= self.temperature <= 2.0):\n"
            "            raise ValueError(f'temperature {self.temperature} out of [0.0, 2.0] range')\n"
            "        if self.max_tokens <= 0:\n"
            "            raise ValueError('max_tokens must be positive')\n"
        ),
        "test_suite": (
            "from solution import ModelConfig\n\n"
            "def test_dataclass():\n"
            "    cfg = ModelConfig('gpt-4o', 0.5, 1024)\n"
            "    assert cfg.name == 'gpt-4o'\n"
            "    assert cfg.tags == []\n"
            "    try:\n"
            "        ModelConfig('x', temperature=5.0)  # Out of range\n"
            "        assert False, 'Should raise ValueError'\n"
            "    except ValueError:\n"
            "        pass\n"
            "    print('✓ All assertions passed for Lesson 1.28')\n\n"
            "if __name__ == '__main__':\n"
            "    test_dataclass()\n"
        )
    },
    # -------------------------------------------------------------------------
    # PART 4: File I/O, Pathlib, JSON, CSV, Virtualenvs & CLI (1.29 - 1.36)
    # -------------------------------------------------------------------------
    {
        "num": 29,
        "title": "File I/O: Reading, Writing & pathlib Path Objects",
        "subtitle": "Module 1 Python Foundations | Lesson 29 of 50",
        "xp": 130,
        "subtopics": [
            "1.29.1 Context manager file access: with open(path, mode) as f: lifecycle",
            "1.29.2 Read modes: 'r' (text), 'rb' (binary), 'a' (append), 'w' (overwrite)",
            "1.29.3 pathlib.Path for cross-platform path composition: / operator chaining",
            "1.29.4 Reading large files efficiently: iterating lines vs loading full content"
        ],
        "failure_mode": "Opening files in write ('w') mode accidentally truncating existing log or cache files to zero bytes.",
        "verification_criteria": "Implement `append_session_log(log_path, entry_dict)` that appends a JSONL entry to a log file using pathlib.",
        "starter_code": (
            "import json\n"
            "from pathlib import Path\n\n"
            "def append_session_log(log_path: Path, entry: dict) -> None:\n"
            "    \"\"\"\n"
            "    Appends entry as a single JSON line to log_path.\n"
            "    Creates the file if it does not exist. Never truncates existing content.\n"
            "    \"\"\"\n"
            "    # TODO: Use pathlib.Path and open with append mode\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import append_session_log\n"
            "from pathlib import Path\n"
            "import json, tempfile\n\n"
            "def test_log():\n"
            "    with tempfile.TemporaryDirectory() as tmp:\n"
            "        p = Path(tmp) / 'session.jsonl'\n"
            "        append_session_log(p, {'role': 'user', 'tokens': 10})\n"
            "        append_session_log(p, {'role': 'assistant', 'tokens': 50})\n"
            "        lines = p.read_text().strip().split('\\n')\n"
            "        assert len(lines) == 2\n"
            "        assert json.loads(lines[0])['role'] == 'user'\n"
            "        print('✓ All assertions passed for Lesson 1.29')\n\n"
            "if __name__ == '__main__':\n"
            "    test_log()\n"
        )
    },
    {
        "num": 30,
        "title": "JSON Serialization: Encoding, Decoding & Schema Validation",
        "subtitle": "Module 1 Python Foundations | Lesson 30 of 50",
        "xp": 130,
        "subtopics": [
            "1.30.1 json.loads() and json.dumps(): in-memory string parsing and serialization",
            "1.30.2 json.load() and json.dump(): file object streaming for large payloads",
            "1.30.3 Custom serialization with default= for datetime, Decimal, and custom objects",
            "1.30.4 Schema validation: checking required keys before processing API responses"
        ],
        "failure_mode": "Passing datetime objects to json.dumps() without a custom serializer, raising TypeError: Object of type datetime is not JSON serializable.",
        "verification_criteria": "Implement `serialize_api_log(record_dict)` that serializes a dict with datetime values to a JSON string.",
        "starter_code": (
            "import json\n"
            "from datetime import datetime\n\n"
            "def serialize_api_log(record: dict) -> str:\n"
            "    \"\"\"\n"
            "    Serializes record to a JSON string, converting datetime values to ISO 8601 strings.\n"
            "    \"\"\"\n"
            "    def default_encoder(obj):\n"
            "        if isinstance(obj, datetime):\n"
            "            return obj.isoformat()\n"
            "        raise TypeError(f'Object of type {type(obj)} is not JSON serializable')\n"
            "    return json.dumps(record, default=default_encoder)\n"
        ),
        "test_suite": (
            "from solution import serialize_api_log\n"
            "import json\n"
            "from datetime import datetime\n\n"
            "def test_serialize():\n"
            "    record = {'model': 'gpt-4o', 'called_at': datetime(2024, 1, 15, 12, 0, 0), 'tokens': 100}\n"
            "    result = serialize_api_log(record)\n"
            "    parsed = json.loads(result)\n"
            "    assert parsed['called_at'] == '2024-01-15T12:00:00'\n"
            "    assert parsed['tokens'] == 100\n"
            "    print('✓ All assertions passed for Lesson 1.30')\n\n"
            "if __name__ == '__main__':\n"
            "    test_serialize()\n"
        )
    },
    {
        "num": 31,
        "title": "CSV & Structured Data Processing",
        "subtitle": "Module 1 Python Foundations | Lesson 31 of 50",
        "xp": 130,
        "subtopics": [
            "1.31.1 csv.reader and csv.DictReader: reading tabular data with header mapping",
            "1.31.2 csv.writer and csv.DictWriter: writing structured rows with quoting policies",
            "1.31.3 Encoding awareness: always specifying encoding='utf-8' and newline='' on Windows",
            "1.31.4 Bulk data processing patterns: streaming rows vs loading all rows into memory"
        ],
        "failure_mode": "Omitting newline='' in open() on Windows causing extra blank lines between CSV rows.",
        "verification_criteria": "Implement `load_model_benchmarks(csv_path)` returning a list of dicts from a CSV with header row.",
        "starter_code": (
            "import csv\n"
            "from pathlib import Path\n\n"
            "def load_model_benchmarks(csv_path: Path) -> list[dict]:\n"
            "    \"\"\"\n"
            "    Reads a CSV file with headers and returns a list of row dicts.\n"
            "    Each dict maps header names to string values.\n"
            "    \"\"\"\n"
            "    # TODO: Use csv.DictReader with encoding='utf-8'\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import load_model_benchmarks\n"
            "from pathlib import Path\n"
            "import tempfile, os\n\n"
            "def test_csv():\n"
            "    with tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False, encoding='utf-8', newline='') as f:\n"
            "        f.write('model,score\\n')\n"
            "        f.write('gpt-4o,0.92\\n')\n"
            "        f.write('claude-sonnet,0.95\\n')\n"
            "        tmp_path = f.name\n"
            "    try:\n"
            "        rows = load_model_benchmarks(Path(tmp_path))\n"
            "        assert len(rows) == 2\n"
            "        assert rows[0]['model'] == 'gpt-4o'\n"
            "    finally:\n"
            "        os.unlink(tmp_path)\n"
            "    print('✓ All assertions passed for Lesson 1.31')\n\n"
            "if __name__ == '__main__':\n"
            "    test_csv()\n"
        )
    },
    {
        "num": 32,
        "title": "Environment Variables & Secrets Management",
        "subtitle": "Module 1 Python Foundations | Lesson 32 of 50",
        "xp": 130,
        "subtopics": [
            "1.32.1 Why hardcoding secrets is catastrophic: key exposure in git history and logs",
            "1.32.2 os.environ and os.getenv(key, default) for safe environment variable access",
            "1.32.3 .env files and python-dotenv: local secret injection without shell contamination",
            "1.32.4 .gitignore: excluding .env, __pycache__, .venv, and *.key from version control"
        ],
        "failure_mode": "Committing a .env file with production API keys to a public GitHub repository.",
        "verification_criteria": "Implement `get_required_env(key)` that reads an env var and raises `EnvironmentError` with a clear message if missing.",
        "starter_code": (
            "import os\n\n"
            "def get_required_env(key: str) -> str:\n"
            "    \"\"\"\n"
            "    Reads the environment variable 'key' from os.environ.\n"
            "    Raises EnvironmentError with message 'Missing required environment variable: {key}' if not set.\n"
            "    \"\"\"\n"
            "    # TODO: Implement safe env variable access\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import get_required_env\n"
            "import os\n\n"
            "def test_env():\n"
            "    os.environ['TEST_API_KEY'] = 'abc123'\n"
            "    assert get_required_env('TEST_API_KEY') == 'abc123'\n"
            "    try:\n"
            "        get_required_env('NONEXISTENT_XYZ_KEY')\n"
            "        assert False\n"
            "    except EnvironmentError as e:\n"
            "        assert 'NONEXISTENT_XYZ_KEY' in str(e)\n"
            "    print('✓ All assertions passed for Lesson 1.32')\n\n"
            "if __name__ == '__main__':\n"
            "    test_env()\n"
        )
    },
    {
        "num": 33,
        "title": "Command-Line Interfaces with argparse",
        "subtitle": "Module 1 Python Foundations | Lesson 33 of 50",
        "xp": 130,
        "subtopics": [
            "1.33.1 ArgumentParser: defining CLI tool metadata, description, and epilog",
            "1.33.2 Positional vs optional arguments: --model, --temp, --verbose flags",
            "1.33.3 Type casting and validation: type=int, type=float, choices=[]",
            "1.33.4 Subcommands with add_subparsers: building multi-command CLI tools"
        ],
        "failure_mode": "Defining required arguments as optional flags (--arg) without appropriate required=True or positional placement.",
        "verification_criteria": "Implement `build_prompt_cli_parser()` returning a configured ArgumentParser with --model, --temp, and --prompt arguments.",
        "starter_code": (
            "import argparse\n\n"
            "def build_prompt_cli_parser() -> argparse.ArgumentParser:\n"
            "    \"\"\"\n"
            "    Builds a CLI parser with:\n"
            "    - --model: str, default='gpt-4o'\n"
            "    - --temp: float, default=0.7, range [0.0, 2.0]\n"
            "    - --prompt: str, required=True\n"
            "    \"\"\"\n"
            "    parser = argparse.ArgumentParser(description='AI Prompt CLI')\n"
            "    parser.add_argument('--model', type=str, default='gpt-4o')\n"
            "    parser.add_argument('--temp', type=float, default=0.7)\n"
            "    parser.add_argument('--prompt', type=str, required=True)\n"
            "    return parser\n"
        ),
        "test_suite": (
            "from solution import build_prompt_cli_parser\n\n"
            "def test_parser():\n"
            "    parser = build_prompt_cli_parser()\n"
            "    args = parser.parse_args(['--prompt', 'Summarize this', '--model', 'claude-haiku', '--temp', '0.3'])\n"
            "    assert args.prompt == 'Summarize this'\n"
            "    assert args.model == 'claude-haiku'\n"
            "    assert args.temp == 0.3\n"
            "    print('✓ All assertions passed for Lesson 1.33')\n\n"
            "if __name__ == '__main__':\n"
            "    test_parser()\n"
        )
    },
    {
        "num": 34,
        "title": "Virtual Environments & Dependency Management with uv",
        "subtitle": "Module 1 Python Foundations | Lesson 34 of 50",
        "xp": 130,
        "subtopics": [
            "1.34.1 Why virtual environments exist: preventing global package pollution",
            "1.34.2 Creating environments: python -m venv .venv and activation scripts",
            "1.34.3 Ultra-fast dependency management with uv: uv pip install, uv lock, uv sync",
            "1.34.4 requirements.txt vs pyproject.toml for reproducible deployments"
        ],
        "failure_mode": "Installing production dependencies into system Python, causing version conflicts across projects.",
        "verification_criteria": "Implement `verify_required_packages(packages)` checking if given package names are importable in the current environment.",
        "starter_code": (
            "import importlib\n\n"
            "def verify_required_packages(packages: list[str]) -> dict[str, bool]:\n"
            "    \"\"\"\n"
            "    Checks if each package name is importable in the current Python environment.\n"
            "    Returns a dict mapping package name to True (importable) or False (missing).\n"
            "    \"\"\"\n"
            "    result = {}\n"
            "    for pkg in packages:\n"
            "        try:\n"
            "            importlib.import_module(pkg)\n"
            "            result[pkg] = True\n"
            "        except ImportError:\n"
            "            result[pkg] = False\n"
            "    return result\n"
        ),
        "test_suite": (
            "from solution import verify_required_packages\n\n"
            "def test_packages():\n"
            "    res = verify_required_packages(['json', 'os', 'nonexistent_package_xyz'])\n"
            "    assert res['json'] is True\n"
            "    assert res['os'] is True\n"
            "    assert res['nonexistent_package_xyz'] is False\n"
            "    print('✓ All assertions passed for Lesson 1.34')\n\n"
            "if __name__ == '__main__':\n"
            "    test_packages()\n"
        )
    },
    {
        "num": 35,
        "title": "Modules, Packages & Import Architecture",
        "subtitle": "Module 1 Python Foundations | Lesson 35 of 50",
        "xp": 130,
        "subtopics": [
            "1.35.1 Python module system: .py files, sys.path resolution, and import caching in sys.modules",
            "1.35.2 Package structure: __init__.py and public API definition via __all__",
            "1.35.3 Relative vs absolute imports: from .utils import helper vs from project.utils import helper",
            "1.35.4 Avoiding circular imports: dependency injection and late imports as escape hatches"
        ],
        "failure_mode": "Creating circular imports between modules, causing ImportError or partially-initialized module errors at startup.",
        "verification_criteria": "Design a 2-file module structure with a public API exported via __all__ and validate it with explicit import checks.",
        "starter_code": (
            "# utils.py (inner module)\n"
            "__all__ = ['format_cost', 'format_latency']\n\n"
            "def format_cost(cents: float) -> str:\n"
            "    return f'${cents / 100:.4f}'\n\n"
            "def format_latency(ms: float) -> str:\n"
            "    return f'{ms:.1f}ms'\n\n"
            "# Internal helper — NOT exported via __all__\n"
            "def _internal_helper():\n"
            "    pass\n"
        ),
        "test_suite": (
            "import importlib, sys\n\n"
            "def test_module():\n"
            "    # Simulate importing from solution module's __all__\n"
            "    import solution as m\n"
            "    assert hasattr(m, 'format_cost')\n"
            "    assert hasattr(m, 'format_latency')\n"
            "    assert m.format_cost(250.0) == '$2.5000'\n"
            "    print('✓ All assertions passed for Lesson 1.35')\n\n"
            "if __name__ == '__main__':\n"
            "    test_module()\n"
        )
    },
    {
        "num": 36,
        "title": "Pythonic Code: PEP 8, Linting & Automated Formatters",
        "subtitle": "Module 1 Python Foundations | Lesson 36 of 50",
        "xp": 130,
        "subtopics": [
            "1.36.1 PEP 8 conventions: snake_case, 79-char line limits, spacing rules",
            "1.36.2 Pyflakes/Ruff for unused imports, undefined names, and unreachable code",
            "1.36.3 Black formatter: deterministic opinionated formatting that eliminates style debates",
            "1.36.4 Writing self-documenting code: meaningful identifiers over inline comments"
        ],
        "failure_mode": "Naming variables 'l', 'O', or 'I' which are visually indistinguishable from 1, 0, and 1 in most fonts.",
        "verification_criteria": "Reformat an intentionally messy function to be fully PEP 8 compliant with proper docstring and type hints.",
        "starter_code": (
            "# Intentionally messy — format and correct this:\n"
            "def calc(X,Y,z=False):\n"
            "    '''compute thing'''\n"
            "    RES=X+Y\n"
            "    if z ==True:\n"
            "        RES = RES*2\n"
            "    return RES\n\n"
            "# Corrected version:\n"
            "def calculate_adjusted_total(base: float, bonus: float, double: bool = False) -> float:\n"
            "    \"\"\"\n"
            "    Calculates the total of base and bonus, optionally doubled.\n"
            "\n"
            "    Args:\n"
            "        base: The base numeric value.\n"
            "        bonus: The bonus to add to base.\n"
            "        double: If True, doubles the result.\n\n"
            "    Returns:\n"
            "        The computed float total.\n"
            "    \"\"\"\n"
            "    result = base + bonus\n"
            "    if double:\n"
            "        result *= 2\n"
            "    return result\n"
        ),
        "test_suite": (
            "from solution import calculate_adjusted_total\n\n"
            "def test_pep8():\n"
            "    assert calculate_adjusted_total(10.0, 5.0) == 15.0\n"
            "    assert calculate_adjusted_total(10.0, 5.0, double=True) == 30.0\n"
            "    print('✓ All assertions passed for Lesson 1.36')\n\n"
            "if __name__ == '__main__':\n"
            "    test_pep8()\n"
        )
    },
    # -------------------------------------------------------------------------
    # PART 5: AI-Native Engineering Foundations (1.37 - 1.46)
    # -------------------------------------------------------------------------
    {
        "num": 37,
        "title": "Making LLM API Calls with HTTPX: GET, POST & Auth Headers",
        "subtitle": "Module 1 Python Foundations | Lesson 37 of 50",
        "xp": 150,
        "subtopics": [
            "1.37.1 The HTTPX library: synchronous vs asynchronous HTTP clients and keep-alive connections",
            "1.37.2 Constructing POST requests: JSON body serialization and Content-Type headers",
            "1.37.3 Bearer token authentication: Authorization header injection for AI API access",
            "1.37.4 Response validation: checking status_code, calling raise_for_status(), and parsing JSON body"
        ],
        "failure_mode": "Failing to call response.raise_for_status() before parsing, causing silent failures on 4xx and 5xx API errors.",
        "verification_criteria": "Implement `call_chat_completion(api_key, model, messages)` using httpx to POST to a mock endpoint, returning parsed JSON.",
        "starter_code": (
            "import httpx\n"
            "import json\n\n"
            "def call_chat_completion(api_key: str, model: str, messages: list[dict], base_url: str = 'https://api.openai.com') -> dict:\n"
            "    \"\"\"\n"
            "    Sends a POST request to {base_url}/v1/chat/completions with the given model and messages.\n"
            "    Sets Authorization: Bearer {api_key} header.\n"
            "    Raises httpx.HTTPStatusError on non-2xx responses.\n"
            "    Returns the parsed JSON response dict.\n"
            "    \"\"\"\n"
            "    payload = {'model': model, 'messages': messages}\n"
            "    headers = {\n"
            "        'Authorization': f'Bearer {api_key}',\n"
            "        'Content-Type': 'application/json',\n"
            "    }\n"
            "    with httpx.Client(timeout=30.0) as client:\n"
            "        resp = client.post(f'{base_url}/v1/chat/completions', json=payload, headers=headers)\n"
            "        resp.raise_for_status()\n"
            "        return resp.json()\n"
        ),
        "test_suite": (
            "from unittest.mock import patch, MagicMock\n"
            "from solution import call_chat_completion\n\n"
            "def test_api_call():\n"
            "    mock_response = MagicMock()\n"
            "    mock_response.json.return_value = {'choices': [{'message': {'content': 'Hello'}}]}\n"
            "    mock_response.status_code = 200\n"
            "    mock_response.raise_for_status.return_value = None\n"
            "    with patch('httpx.Client') as mock_client_cls:\n"
            "        mock_client_cls.return_value.__enter__.return_value.post.return_value = mock_response\n"
            "        result = call_chat_completion('sk-test', 'gpt-4o', [{'role': 'user', 'content': 'Hi'}])\n"
            "        assert result['choices'][0]['message']['content'] == 'Hello'\n"
            "    print('✓ All assertions passed for Lesson 1.37')\n\n"
            "if __name__ == '__main__':\n"
            "    test_api_call()\n"
        )
    },
    {
        "num": 38,
        "title": "Exponential Backoff & Jitter for Resilient API Calls",
        "subtitle": "Module 1 Python Foundations | Lesson 38 of 50",
        "xp": 150,
        "subtopics": [
            "1.38.1 Why APIs rate-limit: server-side request throttling and 429 Too Many Requests",
            "1.38.2 Exponential backoff algorithm: wait = base * 2^attempt",
            "1.38.3 Random jitter: full jitter and equal jitter to prevent thundering herds",
            "1.38.4 Integrating retry logic with HTTPX using a decorator or context wrapper"
        ],
        "failure_mode": "Using a tight retry loop without sleep intervals, instantly consuming the API rate limit budget.",
        "verification_criteria": "Implement `exponential_backoff_sleep(attempt, base_delay, cap, jitter)` computing wait time in seconds.",
        "starter_code": (
            "import random\n"
            "import time\n\n"
            "def exponential_backoff_sleep(attempt: int, base_delay: float = 1.0, cap: float = 60.0, jitter: bool = True) -> float:\n"
            "    \"\"\"\n"
            "    Computes exponential backoff wait time: min(cap, base_delay * 2**attempt).\n"
            "    If jitter is True, applies full jitter: random.uniform(0, wait).\n"
            "    Returns the computed wait time in seconds (does NOT sleep).\n"
            "    \"\"\"\n"
            "    wait = min(cap, base_delay * (2 ** attempt))\n"
            "    if jitter:\n"
            "        wait = random.uniform(0, wait)\n"
            "    return wait\n"
        ),
        "test_suite": (
            "from solution import exponential_backoff_sleep\n\n"
            "def test_backoff():\n"
            "    # Without jitter: deterministic\n"
            "    w0 = exponential_backoff_sleep(0, base_delay=1.0, jitter=False)\n"
            "    w1 = exponential_backoff_sleep(1, base_delay=1.0, jitter=False)\n"
            "    w2 = exponential_backoff_sleep(2, base_delay=1.0, jitter=False)\n"
            "    assert w0 == 1.0\n"
            "    assert w1 == 2.0\n"
            "    assert w2 == 4.0\n"
            "    # With cap\n"
            "    w10 = exponential_backoff_sleep(10, base_delay=1.0, cap=30.0, jitter=False)\n"
            "    assert w10 == 30.0\n"
            "    print('✓ All assertions passed for Lesson 1.38')\n\n"
            "if __name__ == '__main__':\n"
            "    test_backoff()\n"
        )
    },
    {
        "num": 39,
        "title": "Token Budgets & Counting Tokens with tiktoken",
        "subtitle": "Module 1 Python Foundations | Lesson 39 of 50",
        "xp": 150,
        "subtopics": [
            "1.39.1 What tokens are: BPE subword units and why character count != token count",
            "1.39.2 The tiktoken library: model-aware tokenization encoding and decoding",
            "1.39.3 Computing token counts before sending API requests to avoid context window overflow",
            "1.39.4 Token budget enforcement: hard limits, soft warnings, and truncation strategies"
        ],
        "failure_mode": "Estimating tokens by dividing character count by 4, wildly miscounting non-ASCII text, code, or JSON payloads.",
        "verification_criteria": "Implement `count_message_tokens(messages, model)` using tiktoken to count tokens in a chat messages list.",
        "starter_code": (
            "def count_message_tokens(messages: list[dict], model: str = 'gpt-4o') -> int:\n"
            "    \"\"\"\n"
            "    Counts the total token count for a list of chat messages using tiktoken.\n"
            "    Each message contributes: 4 tokens overhead + tokens in 'role' + tokens in 'content'.\n"
            "    Adds 2 tokens for the reply prime.\n"
            "    Returns the total integer token count.\n"
            "    \"\"\"\n"
            "    try:\n"
            "        import tiktoken\n"
            "        enc = tiktoken.encoding_for_model(model)\n"
            "    except Exception:\n"
            "        # Fallback: rough estimate if tiktoken not available\n"
            "        total_chars = sum(len(m.get('content', '')) + len(m.get('role', '')) for m in messages)\n"
            "        return total_chars // 4 + 2\n"
            "    total = 0\n"
            "    for msg in messages:\n"
            "        total += 4  # per-message overhead\n"
            "        total += len(enc.encode(msg.get('role', '')))\n"
            "        total += len(enc.encode(msg.get('content', '')))\n"
            "    total += 2  # reply prime tokens\n"
            "    return total\n"
        ),
        "test_suite": (
            "from solution import count_message_tokens\n\n"
            "def test_token_count():\n"
            "    messages = [{'role': 'user', 'content': 'Hello, how are you?'}]\n"
            "    count = count_message_tokens(messages)\n"
            "    # Exact count varies by model but should be > 5 and < 50\n"
            "    assert isinstance(count, int)\n"
            "    assert 5 < count < 50\n"
            "    print('✓ All assertions passed for Lesson 1.39')\n\n"
            "if __name__ == '__main__':\n"
            "    test_token_count()\n"
        )
    },
    {
        "num": 40,
        "title": "Structured Prompt Templates & XML Delimiters",
        "subtitle": "Module 1 Python Foundations | Lesson 40 of 50",
        "xp": 150,
        "subtopics": [
            "1.40.1 Prompt engineering fundamentals: system role, user role, and assistant pre-fill patterns",
            "1.40.2 XML delimiters for grounding: <context>, <question>, <instructions> tags in system prompts",
            "1.40.3 Multi-variable template hydration with validation of all required slots",
            "1.40.4 Few-shot prompting: inserting example (input, output) pairs into structured messages"
        ],
        "failure_mode": "Writing prompts as flat unstructured strings, making it impossible to programmatically update individual sections.",
        "verification_criteria": "Implement `build_rag_prompt(context_text, user_question, instructions)` building a structured XML-delimited system message.",
        "starter_code": (
            "def build_rag_prompt(context_text: str, user_question: str, instructions: str = 'Answer based on the context only.') -> list[dict]:\n"
            "    \"\"\"\n"
            "    Returns a messages list with a system message using XML delimiters and a user message.\n"
            "    System message format:\n"
            "    <instructions>{instructions}</instructions>\n"
            "    <context>{context_text}</context>\n"
            "    \"\"\"\n"
            "    system_content = (\n"
            "        f'<instructions>{instructions}</instructions>\\n'\n"
            "        f'<context>{context_text}</context>'\n"
            "    )\n"
            "    return [\n"
            "        {'role': 'system', 'content': system_content},\n"
            "        {'role': 'user', 'content': user_question},\n"
            "    ]\n"
        ),
        "test_suite": (
            "from solution import build_rag_prompt\n\n"
            "def test_rag_prompt():\n"
            "    msgs = build_rag_prompt('Python is a language.', 'What is Python?')\n"
            "    assert len(msgs) == 2\n"
            "    assert msgs[0]['role'] == 'system'\n"
            "    assert '<context>' in msgs[0]['content']\n"
            "    assert '<instructions>' in msgs[0]['content']\n"
            "    assert msgs[1]['content'] == 'What is Python?'\n"
            "    print('✓ All assertions passed for Lesson 1.40')\n\n"
            "if __name__ == '__main__':\n"
            "    test_rag_prompt()\n"
        )
    },
    {
        "num": 41,
        "title": "Parsing LLM Responses: JSON Extraction & Error Recovery",
        "subtitle": "Module 1 Python Foundations | Lesson 41 of 50",
        "xp": 150,
        "subtopics": [
            "1.41.1 Why LLMs don't always return pure JSON: markdown fences, prose wrapping, and preamble",
            "1.41.2 Regex-based fence stripping: removing ```json ... ``` wrappers reliably",
            "1.41.3 Fallback XML tag extraction: pulling <answer>...</answer> when JSON fails",
            "1.41.4 Structured output modes: enabling JSON mode or response schemas in modern APIs"
        ],
        "failure_mode": "Calling json.loads() directly on raw LLM output without stripping markdown code fences first.",
        "verification_criteria": "Implement `parse_llm_structured_output(raw_response)` that tries JSON, then XML extraction, returning a dict or None.",
        "starter_code": (
            "import re\n"
            "import json\n\n"
            "def parse_llm_structured_output(raw_response: str) -> dict | None:\n"
            "    \"\"\"\n"
            "    Attempt order:\n"
            "    1. Strip ```json...``` fences and parse JSON.\n"
            "    2. Try extracting <json>...</json> XML tag content.\n"
            "    3. Try parsing the raw string directly as JSON.\n"
            "    4. Return None if all attempts fail.\n"
            "    \"\"\"\n"
            "    # Strip markdown fences\n"
            "    fence_match = re.search(r'```(?:json)?\\s*([\\s\\S]*?)```', raw_response)\n"
            "    if fence_match:\n"
            "        try:\n"
            "            return json.loads(fence_match.group(1).strip())\n"
            "        except json.JSONDecodeError:\n"
            "            pass\n"
            "    # XML tag extraction\n"
            "    xml_match = re.search(r'<json>(.*?)</json>', raw_response, re.DOTALL)\n"
            "    if xml_match:\n"
            "        try:\n"
            "            return json.loads(xml_match.group(1).strip())\n"
            "        except json.JSONDecodeError:\n"
            "            pass\n"
            "    # Direct parse\n"
            "    try:\n"
            "        return json.loads(raw_response.strip())\n"
            "    except json.JSONDecodeError:\n"
            "        return None\n"
        ),
        "test_suite": (
            "from solution import parse_llm_structured_output\n\n"
            "def test_parse():\n"
            "    assert parse_llm_structured_output('```json\\n{\"key\": \"value\"}\\n```') == {'key': 'value'}\n"
            "    assert parse_llm_structured_output('{\"key\": \"value\"}') == {'key': 'value'}\n"
            "    assert parse_llm_structured_output('Not JSON at all') is None\n"
            "    print('✓ All assertions passed for Lesson 1.41')\n\n"
            "if __name__ == '__main__':\n"
            "    test_parse()\n"
        )
    },
    {
        "num": 42,
        "title": "Server-Sent Events (SSE): Streaming Token Responses",
        "subtitle": "Module 1 Python Foundations | Lesson 42 of 50",
        "xp": 150,
        "subtopics": [
            "1.42.1 SSE protocol: text/event-stream, data: prefix, and [DONE] termination sentinel",
            "1.42.2 HTTP streaming with httpx: using iter_lines() on a streamed response context",
            "1.42.3 Parsing SSE lines: splitting on 'data: ', skipping empty lines and [DONE]",
            "1.42.4 Progressive UI rendering: printing tokens as they arrive without buffering the full response"
        ],
        "failure_mode": "Buffering all SSE lines before processing, negating the latency benefit of streaming.",
        "verification_criteria": "Implement `parse_sse_line(line)` extracting the JSON payload from an SSE data: line.",
        "starter_code": (
            "import json\n\n"
            "def parse_sse_line(line: str) -> dict | None:\n"
            "    \"\"\"\n"
            "    Parses an SSE event line in the format 'data: {JSON}'.\n"
            "    Returns the parsed dict if valid data, None if the line is empty or is '[DONE]'.\n"
            "    \"\"\"\n"
            "    line = line.strip()\n"
            "    if not line or line == 'data: [DONE]':\n"
            "        return None\n"
            "    if line.startswith('data: '):\n"
            "        payload = line[len('data: '):]\n"
            "        try:\n"
            "            return json.loads(payload)\n"
            "        except json.JSONDecodeError:\n"
            "            return None\n"
            "    return None\n"
        ),
        "test_suite": (
            "from solution import parse_sse_line\n\n"
            "def test_sse():\n"
            "    chunk = parse_sse_line('data: {\"choices\": [{\"delta\": {\"content\": \"Hello\"}}]}')\n"
            "    assert chunk is not None\n"
            "    assert chunk['choices'][0]['delta']['content'] == 'Hello'\n"
            "    assert parse_sse_line('data: [DONE]') is None\n"
            "    assert parse_sse_line('') is None\n"
            "    print('✓ All assertions passed for Lesson 1.42')\n\n"
            "if __name__ == '__main__':\n"
            "    test_sse()\n"
        )
    },
    {
        "num": 43,
        "title": "Pydantic v2: Data Validation & Structured Contracts",
        "subtitle": "Module 1 Python Foundations | Lesson 43 of 50",
        "xp": 150,
        "subtopics": [
            "1.43.1 Pydantic v2 BaseModel: field type coercion, validation, and schema generation",
            "1.43.2 Field validators using @field_validator and @model_validator",
            "1.43.3 Parsing raw dicts and JSON: model_validate() and model_validate_json()",
            "1.43.4 ValidationError introspection: accessing error locations and messages programmatically"
        ],
        "failure_mode": "Catching BaseModel instantiation errors with except Exception instead of except ValidationError, hiding field-level issues.",
        "verification_criteria": "Define a `ChatMessage` Pydantic model with role validation (must be system/user/assistant) and non-empty content.",
        "starter_code": (
            "from pydantic import BaseModel, field_validator\n"
            "from typing import Literal\n\n"
            "class ChatMessage(BaseModel):\n"
            "    role: Literal['system', 'user', 'assistant']\n"
            "    content: str\n\n"
            "    @field_validator('content')\n"
            "    @classmethod\n"
            "    def content_must_not_be_empty(cls, v: str) -> str:\n"
            "        if not v.strip():\n"
            "            raise ValueError('content must not be empty or whitespace-only')\n"
            "        return v\n"
        ),
        "test_suite": (
            "from solution import ChatMessage\n"
            "from pydantic import ValidationError\n\n"
            "def test_pydantic():\n"
            "    msg = ChatMessage(role='user', content='Hello')\n"
            "    assert msg.role == 'user'\n"
            "    try:\n"
            "        ChatMessage(role='invalid_role', content='Hi')\n"
            "        assert False, 'Should raise ValidationError'\n"
            "    except ValidationError:\n"
            "        pass\n"
            "    try:\n"
            "        ChatMessage(role='user', content='   ')\n"
            "        assert False, 'Empty content should raise'\n"
            "    except ValidationError:\n"
            "        pass\n"
            "    print('✓ All assertions passed for Lesson 1.43')\n\n"
            "if __name__ == '__main__':\n"
            "    test_pydantic()\n"
        )
    },
    {
        "num": 44,
        "title": "Structured AI Outputs: Enforcing JSON Schemas from LLMs",
        "subtitle": "Module 1 Python Foundations | Lesson 44 of 50",
        "xp": 150,
        "subtopics": [
            "1.44.1 The structured output problem: why LLMs produce free-text and how schema enforcement helps",
            "1.44.2 Response format enforcement: JSON mode and structured output APIs (OpenAI response_format)",
            "1.44.3 Pydantic model_json_schema(): generating JSON Schema from a BaseModel for API injection",
            "1.44.4 End-to-end pipeline: prompt -> API call -> Pydantic parse -> validated typed object"
        ],
        "failure_mode": "Manually constructing JSON Schema strings instead of generating them from Pydantic, causing schema drift.",
        "verification_criteria": "Implement `validate_and_parse_completion(raw_json, model_class)` using Pydantic model_validate_json with error recovery.",
        "starter_code": (
            "from pydantic import BaseModel, ValidationError\n"
            "from typing import Type, TypeVar\n\n"
            "T = TypeVar('T', bound=BaseModel)\n\n"
            "def validate_and_parse_completion(raw_json: str, model_class: Type[T]) -> T | None:\n"
            "    \"\"\"\n"
            "    Parses raw_json using model_class.model_validate_json().\n"
            "    Returns the validated model instance, or None if parsing fails.\n"
            "    \"\"\"\n"
            "    try:\n"
            "        return model_class.model_validate_json(raw_json)\n"
            "    except (ValidationError, ValueError):\n"
            "        return None\n"
        ),
        "test_suite": (
            "from solution import validate_and_parse_completion\n"
            "from pydantic import BaseModel\n\n"
            "class SummaryOutput(BaseModel):\n"
            "    title: str\n"
            "    points: list[str]\n\n"
            "def test_structured():\n"
            "    valid = '{\"title\": \"Python Guide\", \"points\": [\"easy\", \"readable\"]}'\n"
            "    result = validate_and_parse_completion(valid, SummaryOutput)\n"
            "    assert result.title == 'Python Guide'\n"
            "    assert result.points == ['easy', 'readable']\n"
            "    assert validate_and_parse_completion('not valid json', SummaryOutput) is None\n"
            "    print('✓ All assertions passed for Lesson 1.44')\n\n"
            "if __name__ == '__main__':\n"
            "    test_structured()\n"
        )
    },
    {
        "num": 45,
        "title": "Async Python Basics: asyncio, await & Concurrent IO",
        "subtitle": "Module 1 Python Foundations | Lesson 45 of 50",
        "xp": 150,
        "subtopics": [
            "1.45.1 The event loop: single-threaded cooperative multitasking vs OS threads",
            "1.45.2 async def and await: declaring coroutines and suspending at IO boundaries",
            "1.45.3 asyncio.gather(): running multiple coroutines concurrently without threads",
            "1.45.4 async with and async for: using async context managers and async iterators"
        ],
        "failure_mode": "Blocking the event loop with time.sleep() instead of await asyncio.sleep(), freezing all concurrent tasks.",
        "verification_criteria": "Implement `fetch_all_concurrently(urls)` using asyncio.gather and httpx.AsyncClient to fetch multiple URLs simultaneously.",
        "starter_code": (
            "import asyncio\n"
            "import httpx\n\n"
            "async def fetch_one(client: httpx.AsyncClient, url: str) -> dict:\n"
            "    \"\"\"Fetches a single URL and returns {'url': url, 'status': status_code}.\"\"\"\n"
            "    try:\n"
            "        resp = await client.get(url, timeout=10.0)\n"
            "        return {'url': url, 'status': resp.status_code}\n"
            "    except Exception as e:\n"
            "        return {'url': url, 'status': -1, 'error': str(e)}\n\n"
            "async def fetch_all_concurrently(urls: list[str]) -> list[dict]:\n"
            "    \"\"\"Fetches all URLs concurrently using asyncio.gather.\"\"\"\n"
            "    async with httpx.AsyncClient() as client:\n"
            "        tasks = [fetch_one(client, url) for url in urls]\n"
            "        return await asyncio.gather(*tasks)\n"
        ),
        "test_suite": (
            "import asyncio\n"
            "from solution import fetch_all_concurrently\n\n"
            "def test_async_fetch():\n"
            "    # Use locally verifiable test\n"
            "    async def run():\n"
            "        results = await fetch_all_concurrently(['https://httpbin.org/get'])\n"
            "        assert len(results) == 1\n"
            "        assert 'url' in results[0]\n"
            "        assert 'status' in results[0]\n"
            "    asyncio.run(run())\n"
            "    print('✓ All assertions passed for Lesson 1.45')\n\n"
            "if __name__ == '__main__':\n"
            "    test_async_fetch()\n"
        )
    },
    {
        "num": 46,
        "title": "Logging & Structured Observability for AI Applications",
        "subtitle": "Module 1 Python Foundations | Lesson 46 of 50",
        "xp": 150,
        "subtopics": [
            "1.46.1 Python logging module: Logger, Handler, Formatter hierarchy",
            "1.46.2 Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL and when to use each",
            "1.46.3 Structured logging with JSON format for machine-parseable log pipelines",
            "1.46.4 Logging AI API calls: request_id, model, latency_ms, tokens, cost for observability"
        ],
        "failure_mode": "Using print() statements for production observability instead of the logging module, losing log levels, timestamps, and formatters.",
        "verification_criteria": "Implement `setup_json_logger(name, level)` returning a logger that emits structured JSON log lines.",
        "starter_code": (
            "import logging\n"
            "import json\n\n"
            "class JSONFormatter(logging.Formatter):\n"
            "    \"\"\"Formats log records as single-line JSON strings.\"\"\"\n"
            "    def format(self, record: logging.LogRecord) -> str:\n"
            "        log_entry = {\n"
            "            'level': record.levelname,\n"
            "            'name': record.name,\n"
            "            'message': record.getMessage(),\n"
            "        }\n"
            "        if record.exc_info:\n"
            "            log_entry['exception'] = self.formatException(record.exc_info)\n"
            "        return json.dumps(log_entry)\n\n"
            "def setup_json_logger(name: str, level: int = logging.INFO) -> logging.Logger:\n"
            "    \"\"\"Creates and returns a logger with JSON formatting to stdout.\"\"\"\n"
            "    logger = logging.getLogger(name)\n"
            "    logger.setLevel(level)\n"
            "    if not logger.handlers:\n"
            "        handler = logging.StreamHandler()\n"
            "        handler.setFormatter(JSONFormatter())\n"
            "        logger.addHandler(handler)\n"
            "    return logger\n"
        ),
        "test_suite": (
            "import json, logging\n"
            "from io import StringIO\n"
            "from solution import setup_json_logger, JSONFormatter\n\n"
            "def test_json_logger():\n"
            "    logger = setup_json_logger('test_logger')\n"
            "    stream = StringIO()\n"
            "    handler = logging.StreamHandler(stream)\n"
            "    handler.setFormatter(JSONFormatter())\n"
            "    logger.addHandler(handler)\n"
            "    logger.info('API call completed')\n"
            "    output = stream.getvalue().strip()\n"
            "    record = json.loads(output)\n"
            "    assert record['level'] == 'INFO'\n"
            "    assert 'API call completed' in record['message']\n"
            "    print('✓ All assertions passed for Lesson 1.46')\n\n"
            "if __name__ == '__main__':\n"
            "    test_json_logger()\n"
        )
    },
    # -------------------------------------------------------------------------
    # PART 6: Git Workflow, Pytest & Module Capstone (1.47 - 1.50)
    # -------------------------------------------------------------------------
    {
        "num": 47,
        "title": "Git Fundamentals: Commits, Branches & Diffs",
        "subtitle": "Module 1 Python Foundations | Lesson 47 of 50",
        "xp": 120,
        "subtopics": [
            "1.47.1 Git object model: blobs, trees, commits, and the DAG structure of history",
            "1.47.2 The 3 Git areas: Working Directory, Staging Index (git add), and Repository (git commit)",
            "1.47.3 Branching: creating feature branches with git switch -c and merging without panic",
            "1.47.4 Inspecting history: git log --oneline --graph --decorate and git diff HEAD~1"
        ],
        "failure_mode": "Running git add . without reviewing git status first, accidentally committing .env files or build artifacts.",
        "verification_criteria": "Implement `parse_git_log_line(line)` that extracts commit hash and message from a --oneline log line.",
        "starter_code": (
            "import re\n\n"
            "def parse_git_log_line(line: str) -> dict | None:\n"
            "    \"\"\"\n"
            "    Parses a 'git log --oneline' output line.\n"
            "    Format: '<7-char-hash> <message>'\n"
            "    Returns {'hash': str, 'message': str} or None if pattern doesn't match.\n"
            "    \"\"\"\n"
            "    match = re.match(r'^([a-f0-9]{7,40})\\s+(.+)$', line.strip())\n"
            "    if match:\n"
            "        return {'hash': match.group(1), 'message': match.group(2)}\n"
            "    return None\n"
        ),
        "test_suite": (
            "from solution import parse_git_log_line\n\n"
            "def test_git_log():\n"
            "    result = parse_git_log_line('a1b2c3d feat: add token budget enforcement')\n"
            "    assert result == {'hash': 'a1b2c3d', 'message': 'feat: add token budget enforcement'}\n"
            "    assert parse_git_log_line('not a log line') is None\n"
            "    print('✓ All assertions passed for Lesson 1.47')\n\n"
            "if __name__ == '__main__':\n"
            "    test_git_log()\n"
        )
    },
    {
        "num": 48,
        "title": "Automated Testing with pytest: Fixtures, Parametrize & Coverage",
        "subtitle": "Module 1 Python Foundations | Lesson 48 of 50",
        "xp": 120,
        "subtopics": [
            "1.48.1 pytest test discovery: test_*.py files and test_* function naming conventions",
            "1.48.2 @pytest.fixture: providing reusable setup objects with scope control (function, session)",
            "1.48.3 @pytest.mark.parametrize: running the same test against multiple input/output pairs",
            "1.48.4 pytest-cov: measuring code coverage percentage and identifying untested branches"
        ],
        "failure_mode": "Writing tests that always pass because they never assert any specific outcome (assert True).",
        "verification_criteria": "Write a parametrized pytest test suite for `compute_token_bill` from Lesson 1.2 covering 3 edge cases.",
        "starter_code": (
            "import pytest\n\n"
            "# The function under test (import from solution in real test):\n"
            "def compute_token_bill(input_tokens: int, output_tokens: int, rate_per_k: float, discount: float) -> float:\n"
            "    total = ((input_tokens + output_tokens) / 1000) * rate_per_k * (1.0 - discount)\n"
            "    return round(total, 4)\n\n"
            "@pytest.mark.parametrize('inp, out, rate, disc, expected', [\n"
            "    (1000, 2000, 0.015, 0.10, 0.0405),\n"
            "    (0, 0, 0.01, 0.0, 0.0),\n"
            "    (5000, 5000, 0.020, 0.50, 0.1),\n"
            "])\n"
            "def test_token_bill(inp, out, rate, disc, expected):\n"
            "    assert compute_token_bill(inp, out, rate, disc) == expected\n"
        ),
        "test_suite": (
            "import pytest\n"
            "from solution import compute_token_bill\n\n"
            "@pytest.mark.parametrize('inp, out, rate, disc, expected', [\n"
            "    (1000, 2000, 0.015, 0.10, 0.0405),\n"
            "    (0, 0, 0.01, 0.0, 0.0),\n"
            "    (5000, 5000, 0.020, 0.50, 0.1),\n"
            "])\n"
            "def test_token_bill(inp, out, rate, disc, expected):\n"
            "    assert compute_token_bill(inp, out, rate, disc) == expected\n\n"
            "if __name__ == '__main__':\n"
            "    print('✓ Parametrized tests defined for Lesson 1.48')\n"
        )
    },
    {
        "num": 49,
        "title": "Code Reviews, Refactoring & Technical Debt Recognition",
        "subtitle": "Module 1 Python Foundations | Lesson 49 of 50",
        "xp": 120,
        "subtopics": [
            "1.49.1 Code review mindset: reviewing for correctness, clarity, and maintainability",
            "1.49.2 Common technical debt signals: long parameter lists, god functions, magic numbers",
            "1.49.3 Refactoring patterns: Extract Function, Rename Variable, Replace Magic Number with Constant",
            "1.49.4 The Boy Scout Rule: leave code cleaner than you found it on every commit"
        ],
        "failure_mode": "Refactoring production code without a test suite in place, breaking existing behavior invisibly.",
        "verification_criteria": "Refactor a provided messy function `calculate_llm_cost` with magic numbers into clean, documented, tested code.",
        "starter_code": (
            "# BEFORE (messy, magic numbers, no types):\n"
            "# def calc(n, t, v=False):\n"
            "#     r = n * t * 0.000015\n"
            "#     if v: r = r * 1.5\n"
            "#     return round(r, 6)\n\n"
            "# AFTER (clean, documented):\n"
            "BASE_RATE_PER_TOKEN = 0.000015  # USD per token (GPT-4o pricing)\n"
            "VISION_MULTIPLIER = 1.5         # Vision inputs cost 50% more\n\n"
            "def calculate_llm_cost(token_count: int, num_requests: int, has_vision: bool = False) -> float:\n"
            "    \"\"\"\n"
            "    Calculates the estimated USD cost for LLM API calls.\n"
            "\n"
            "    Args:\n"
            "        token_count: Tokens per request.\n"
            "        num_requests: Number of API requests.\n"
            "        has_vision: Whether vision processing is involved (1.5x multiplier).\n\n"
            "    Returns:\n"
            "        Estimated cost in USD rounded to 6 decimal places.\n"
            "    \"\"\"\n"
            "    base_cost = token_count * num_requests * BASE_RATE_PER_TOKEN\n"
            "    if has_vision:\n"
            "        base_cost *= VISION_MULTIPLIER\n"
            "    return round(base_cost, 6)\n"
        ),
        "test_suite": (
            "from solution import calculate_llm_cost\n\n"
            "def test_refactored():\n"
            "    assert calculate_llm_cost(1000, 1) == round(1000 * 1 * 0.000015, 6)\n"
            "    assert calculate_llm_cost(1000, 1, has_vision=True) == round(0.015 * 1.5, 6)\n"
            "    print('✓ All assertions passed for Lesson 1.49')\n\n"
            "if __name__ == '__main__':\n"
            "    test_refactored()\n"
        )
    },
    {
        "num": 50,
        "title": "Module 1 Capstone: PromptCLI — AI Prompt Engineering Workbench",
        "subtitle": "Module 1 Python Foundations | Capstone Lesson 50 of 50",
        "xp": 200,
        "subtopics": [
            "1.50.1 Project integration: combining all 49 prior lessons into a production-grade CLI application",
            "1.50.2 PromptCLI feature set: multi-model routing, token budgeting, structured output, and session logging",
            "1.50.3 Pydantic configuration schema, argparse CLI interface, and HTTPX API integration",
            "1.50.4 Test suite completeness: pytest coverage across all modules and edge cases"
        ],
        "failure_mode": "Building the capstone as a monolithic single-file script; the PromptCLI must be a proper Python package with separate modules.",
        "verification_criteria": "Build a complete PromptCLI package with: CLI parser, config validator, API caller, response parser, and session logger.",
        "starter_code": (
            "# promptcli/__init__.py\n"
            "\"\"\"PromptCLI: AI-Native Prompt Engineering Workbench\"\"\"\n"
            "__version__ = '1.0.0'\n\n"
            "# promptcli/config.py\n"
            "from pydantic import BaseModel, field_validator\n"
            "from typing import Literal\n\n"
            "class PromptCLIConfig(BaseModel):\n"
            "    model: Literal['gpt-4o', 'claude-3-5-sonnet', 'claude-3-haiku'] = 'gpt-4o'\n"
            "    temperature: float = 0.7\n"
            "    max_tokens: int = 2048\n"
            "    token_budget: int = 100000\n\n"
            "    @field_validator('temperature')\n"
            "    @classmethod\n"
            "    def validate_temp(cls, v):\n"
            "        if not 0.0 <= v <= 2.0:\n"
            "            raise ValueError(f'temperature {v} not in [0.0, 2.0]')\n"
            "        return v\n\n"
            "# promptcli/main.py\n"
            "import argparse\n\n"
            "def build_parser():\n"
            "    parser = argparse.ArgumentParser(description='PromptCLI - AI Engineering Workbench')\n"
            "    parser.add_argument('--model', default='gpt-4o')\n"
            "    parser.add_argument('--temp', type=float, default=0.7)\n"
            "    parser.add_argument('--prompt', required=True)\n"
            "    parser.add_argument('--budget', type=int, default=100000)\n"
            "    return parser\n"
        ),
        "test_suite": (
            "from solution import PromptCLIConfig, build_parser\n"
            "from pydantic import ValidationError\n\n"
            "def test_capstone():\n"
            "    cfg = PromptCLIConfig(model='claude-3-haiku', temperature=0.3, max_tokens=512)\n"
            "    assert cfg.model == 'claude-3-haiku'\n"
            "    try:\n"
            "        PromptCLIConfig(temperature=5.0)\n"
            "        assert False\n"
            "    except ValidationError:\n"
            "        pass\n"
            "    parser = build_parser()\n"
            "    args = parser.parse_args(['--prompt', 'Hello world'])\n"
            "    assert args.model == 'gpt-4o'\n"
            "    print('✓ PromptCLI Capstone validation passed for Lesson 1.50')\n\n"
            "if __name__ == '__main__':\n"
            "    test_capstone()\n"
        )
    },
]

print(f"Loaded {len(M1_LESSONS_PART2)} lessons (Parts 2-6).")
