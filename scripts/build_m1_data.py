#!/usr/bin/env python3
"""
scripts/build_m1_data.py
Defines the authoritative 50 lessons for Module 1: Python Programming Foundations.
Organized into 6 clean blocks:
1. Lessons 1.1-1.10: Core Syntax, Expressions, Conditionals & Loops
2. Lessons 1.11-1.18: Functions, Scope, Exceptions & Standard Library
3. Lessons 1.19-1.28: Advanced Collections, Comprehensions & Hashing
4. Lessons 1.29-1.36: Modern File I/O, Pathlib, Serialization, Virtualenvs & CLI
5. Lessons 1.37-1.46: AI-Native Engineering Foundations (APIs, HTTPX, Backoff, Token Budgets, Templates, Delimiters, SSE, Pydantic)
6. Lessons 1.47-1.50: Git Workflow, Pytest Testing & Module Capstone
"""

import json

M1_LESSONS = [
    # -------------------------------------------------------------------------
    # PART 1: Core Syntax, Expressions, Conditionals & Loops (1.1 - 1.10)
    # -------------------------------------------------------------------------
    {
        "num": 1,
        "title": "Variables, Data Types & The Python Interpreter",
        "subtitle": "Module 1 Python Foundations | Lesson 1 of 50",
        "xp": 100,
        "analogy": (
            "Think of a variable as a label on a container in a kitchen. The label tells you what is inside: "
            "`model_name` can label a container holding text, while `max_tokens` can label one holding a whole number. "
            "Python lets you replace what a label points to, but clear names help people understand the program. "
            "We will learn the behavior first and leave interpreter internals for a later systems lesson."
        ),
        "diagram": (
            "=== PYTHON VARIABLES AS LABELED CONTAINERS ===\n"
            "Names                              Values\n"
            "+---------------------+             +-----------------------------+\n"
            "| model_name          | ----------> | 'gpt-4o' (text)             |\n"
            "+---------------------+             +-----------------------------+\n"
            "| max_tokens          | ----------> | 4096 (whole number)         |\n"
            "+---------------------+             +-----------------------------+\n"
            "| is_available        | ----------> | True (yes/no value)         |\n"
            "+---------------------+             +-----------------------------+"
        ),
        "walkthrough": (
            "# 1. Primitive Python Data Types\n"
            "model_name: str = 'gpt-4o'          # Unicode text sequence\n"
            "context_window: int = 128000        # Arbitrary precision integer\n"
            "cost_per_1k_tokens: float = 0.005  # IEEE-754 double precision float\n"
            "is_active: bool = True              # Boolean flag (True or False)\n"
            "\n"
            "# 2. Inspecting Types at Runtime\n"
            "print(type(model_name))             # <class 'str'>\n"
            "print(type(context_window))         # <class 'int'>\n"
            "\n"
            "# 3. Dynamic Rebinding\n"
            "active_config = 'low-latency'       # Points to string\n"
            "active_config = 42                  # Points to int; string is garbage collected"
        ),
        "failure_mode": "Implicit type coercion assumptions (e.g. attempting 'Tokens: ' + 100 instead of str(100)), causing TypeError.",
        "subtopics": [
            "1.1.1 Python values and variables: names that help us use stored information",
            "1.1.2 Primitive types: int, float, str, and bool definitions",
            "1.1.3 Variable naming conventions (PEP 8 snake_case) and assignment mechanics",
            "1.1.4 Dynamic typing vs static typing and runtime type introspection via type()"
        ],
        "verification_criteria": "Implement a function `parse_model_spec(name, tokens, cost)` that returns a validated dictionary casting each field cleanly.",
        "starter_code": (
            "def parse_model_spec(name, tokens, cost):\n"
            "    \"\"\"\n"
            "    Parses model specification arguments and returns a dictionary with:\n"
            "    - 'name': str\n"
            "    - 'tokens': int\n"
            "    - 'cost': float\n"
            "    \"\"\"\n"
            "    # TODO: Implement type casting and dictionary formation\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import parse_model_spec\n"
            "\n"
            "def test_parse():\n"
            "    res = parse_model_spec('claude-3-5-sonnet', '8192', '0.003')\n"
            "    assert res == {'name': 'claude-3-5-sonnet', 'tokens': 8192, 'cost': 0.003}\n"
            "    assert isinstance(res['tokens'], int)\n"
            "    assert isinstance(res['cost'], float)\n"
            "    print('✓ All assertions passed for Lesson 1.1')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_parse()\n"
        )
    },
    {
        "num": 2,
        "title": "Expressions, Operators & Precedence Hierarchy",
        "subtitle": "Module 1 Python Foundations | Lesson 2 of 50",
        "xp": 100,
        "analogy": (
            "Just as standard arithmetic strictly honors PEMDAS to eliminate ambiguity in equations, Python's "
            "interpreter processes every statement through a deterministic operator precedence hierarchy. When evaluating "
            "compound expressions such as token price estimates or discount tiers, knowing whether exponentiation `**` precedes "
            "multiplication `*` or division `/` prevents catastrophic financial calculation errors."
        ),
        "diagram": (
            "=== OPERATOR PRECEDENCE EVALUATION HIERARCHY ===\n"
            "Highest Priority: Parentheses ()               -> Forces explicit order\n"
            "Exponents:        **                          -> Right-to-left associativity\n"
            "Arithmetic:       * , / , // , %              -> High-precedence math\n"
            "Addition/Sub:     + , -                       -> Standard arithmetic\n"
            "Comparisons:      == , != , < , <= , > , >=   -> Boolean results\n"
            "Logical:          not , and , or              -> Short-circuit logic"
        ),
        "walkthrough": (
            "# 1. Integer vs Floating-Point Division\n"
            "total_tokens = 5000\n"
            "batch_size = 3\n"
            "print(total_tokens / batch_size)    # 1666.6666... (float division)\n"
            "print(total_tokens // batch_size)   # 1666 (floor division integer)\n"
            "print(total_tokens % batch_size)    # 2 (remainder modulo)\n"
            "\n"
            "# 2. Short-Circuit Logical Operators\n"
            "is_authorized = True\n"
            "has_budget = False\n"
            "# Short-circuit: if left is False, 'and' halts without checking right\n"
            "can_call_model = is_authorized and has_budget"
        ),
        "failure_mode": "Confusing assignment (=) with equality comparison (==), or relying on implicit precedence without parentheses in complex boolean logic.",
        "subtopics": [
            "1.2.1 Arithmetic operators: +, -, *, /, //, %, **",
            "1.2.2 Comparison and relational operators: ==, !=, <, >, <=, >=",
            "1.2.3 Boolean operators: and, or, not and short-circuit evaluation semantics",
            "1.2.4 Explicit grouping with parentheses to eliminate precedence ambiguity"
        ],
        "verification_criteria": "Implement `compute_token_bill(input_tokens, output_tokens, rate_per_k, discount_tier)` calculating total cents correctly.",
        "starter_code": (
            "def compute_token_bill(input_tokens: int, output_tokens: int, rate_per_k: float, discount_tier: float) -> float:\n"
            "    \"\"\"\n"
            "    Calculates the total dollar cost: ((input_tokens + output_tokens) / 1000) * rate_per_k * (1.0 - discount_tier).\n"
            "    Rounds the result to 4 decimal places.\n"
            "    \"\"\"\n"
            "    # TODO: Implement token bill calculation\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import compute_token_bill\n"
            "\n"
            "def test_bill():\n"
            "    cost = compute_token_bill(1000, 2000, 0.015, 0.10)\n"
            "    # 3 * 0.015 * 0.90 = 0.0405\n"
            "    assert round(cost, 4) == 0.0405\n"
            "    print('✓ All assertions passed for Lesson 1.2')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_bill()\n"
        )
    },
    {
        "num": 3,
        "title": "String Indexing, Slicing & Immutability",
        "subtitle": "Module 1 Python Foundations | Lesson 3 of 50",
        "xp": 100,
        "analogy": (
            "In Python, a string is an immutable contiguous array of Unicode codepoints. When you slice or index a string, "
            "you are referencing specific positional coordinates (0 to length-1). Unlike arrays in C or Go where individual "
            "characters can be mutated in place (`s[0] = 'X'`), Python strings are strictly read-only. Any modification creates "
            "a brand new string in memory, ensuring that prompt templates and shared variables cannot be mutated by side effects."
        ),
        "diagram": (
            "=== STRING INDEXING & SLICING POSITIONS ===\n"
            "String:   'P  R  O  M  P  T'\n"
            "Forward:   0  1  2  3  4  5\n"
            "Negative: -6 -5 -4 -3 -2 -1\n"
            "\n"
            "Slice [1:4] -> 'ROM' (starts at index 1, stops BEFORE index 4)\n"
            "Slice [:-1]  -> 'PROMP' (all except last character)"
        ),
        "walkthrough": (
            "# 1. Positional Indexing\n"
            "text = 'SYSTEM_PROMPT'\n"
            "print(text[0])       # 'S'\n"
            "print(text[-1])      # 'T' (last character)\n"
            "\n"
            "# 2. Slicing with [start:stop:step]\n"
            "print(text[0:6])     # 'SYSTEM'\n"
            "print(text[7:])      # 'PROMPT'\n"
            "print(text[::-1])    # 'TPMORP_METSYS' (reversed)\n"
            "\n"
            "# 3. Immutability Guarantee\n"
            "# text[0] = 'X'     # RAISES: TypeError: 'str' object does not support item assignment\n"
            "updated_text = 'USER_' + text[7:] # Generates a new string"
        ),
        "failure_mode": "Attempting in-place character assignment on strings, or assuming slicing off-by-one stops at index stop rather than before.",
        "subtopics": [
            "1.3.1 Zero-based indexing and negative index wrapping",
            "1.3.2 Slice notation: [start:stop:step] mechanics and default bounds",
            "1.3.3 String immutability in CPython and memory safety implications",
            "1.3.4 Common string introspection: len(), in membership tests, and slicing boundaries"
        ],
        "verification_criteria": "Implement `extract_prompt_prefix(raw_text, max_len)` returning the first max_len characters with '...' appended if truncated.",
        "starter_code": (
            "def extract_prompt_prefix(raw_text: str, max_len: int) -> str:\n"
            "    \"\"\"\n"
            "    If len(raw_text) > max_len, returns the slice of length max_len with '...' appended.\n"
            "    Otherwise, returns raw_text unchanged.\n"
            "    \"\"\"\n"
            "    # TODO: Implement slice-based prompt truncation\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import extract_prompt_prefix\n"
            "\n"
            "def test_slice():\n"
            "    assert extract_prompt_prefix('Hello World', 5) == 'Hello...'\n"
            "    assert extract_prompt_prefix('Hi', 5) == 'Hi'\n"
            "    print('✓ All assertions passed for Lesson 1.3')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_slice()\n"
        )
    },
    {
        "num": 4,
        "title": "Conditional Branching & Guard Clauses",
        "subtitle": "Module 1 Python Foundations | Lesson 4 of 50",
        "xp": 100,
        "analogy": (
            "Control flow is the railway switchboard of code. Instead of executing lines sequentially from top to bottom, "
            "conditional branching evaluates dynamic predicates to steer execution down distinct tracks. In professional software, "
            "we favor 'guard clauses' (early returns on invalid conditions) over deep, heavily indented nested if/else pyramids."
        ),
        "diagram": (
            "=== CONTROL FLOW: GUARD CLAUSES VS PYRAMID OF DOOM ===\n"
            "Guard Clause (Clean, Flat):            Pyramid of Doom (Fragile):\n"
            "def route_model(tokens):\n"
            "    if tokens <= 0: return 'invalid'   if tokens > 0:\n"
            "    if tokens > 100000: return 'opus'      if tokens <= 100000:\n"
            "    return 'sonnet'                            return 'sonnet'\n"
            "                                           else: return 'opus'"
        ),
        "walkthrough": (
            "# 1. If / Elif / Else Ladder\n"
            "latency_ms = 45\n"
            "if latency_ms < 50:\n"
            "    tier = 'ultra-fast'\n"
            "elif latency_ms < 200:\n"
            "    tier = 'standard'\n"
            "else:\n"
            "    tier = 'degraded'\n"
            "\n"
            "# 2. Python Truthiness\n"
            "# Empty strings '', empty collections [], 0, and None evaluate to False\n"
            "user_prompt = ''\n"
            "if not user_prompt:\n"
            "    print('Warning: empty prompt submitted')"
        ),
        "failure_mode": "Creating deeply nested conditionals that obscure happy paths, or mishandling truthiness (e.g. treating 0 as non-existent value).",
        "subtopics": [
            "1.4.1 if, elif, else syntax and 4-space indentation discipline",
            "1.4.2 Truth value testing: truthy vs falsy values in Python",
            "1.4.3 Guard clause pattern and reducing cognitive complexity",
            "1.4.4 Ternary conditional expressions (value_if_true if cond else value_if_false)"
        ],
        "verification_criteria": "Implement `classify_model_tier(token_count, is_vip)` routing to 'haiku', 'sonnet', or 'opus' with guard clauses.",
        "starter_code": (
            "def classify_model_tier(token_count: int, is_vip: bool) -> str:\n"
            "    \"\"\"\n"
            "    Rules:\n"
            "    - If token_count <= 0: return 'error'\n"
            "    - If is_vip is True: return 'opus'\n"
            "    - If token_count > 4000: return 'sonnet'\n"
            "    - Otherwise: return 'haiku'\n"
            "    \"\"\"\n"
            "    # TODO: Implement classification with guard clauses\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import classify_model_tier\n"
            "\n"
            "def test_tier():\n"
            "    assert classify_model_tier(-5, False) == 'error'\n"
            "    assert classify_model_tier(100, True) == 'opus'\n"
            "    assert classify_model_tier(5000, False) == 'sonnet'\n"
            "    assert classify_model_tier(500, False) == 'haiku'\n"
            "    print('✓ All assertions passed for Lesson 1.4')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_tier()\n"
        )
    },
    {
        "num": 5,
        "title": "While Loops & State-Driven Iteration",
        "subtitle": "Module 1 Python Foundations | Lesson 5 of 50",
        "xp": 100,
        "analogy": (
            "A while loop is a continuous polling mechanism: it repeatedly executes a code block as long as its governing "
            "predicate remains True. While loops are the foundation of network connection retries, streaming token consumers, "
            "and event dispatch loops where the exact number of iterations is unknown in advance."
        ),
        "diagram": (
            "=== WHILE LOOP EXECUTION FLOW ===\n"
            "           [Check Condition]\n"
            "             /          \\\n"
            "       (True)            (False)\n"
            "         /                  \\\n"
            "  [Execute Block]        [Exit Loop]\n"
            "         |\n"
            "  [Update State]\n"
            "         |\n"
            "  (Loop Back)"
        ),
        "walkthrough": (
            "# 1. State-Driven While Loop\n"
            "attempt = 0\n"
            "max_attempts = 3\n"
            "success = False\n"
            "\n"
            "while attempt < max_attempts and not success:\n"
            "    attempt += 1\n"
            "    # Simulate condition becoming true on 2nd try\n"
            "    if attempt == 2:\n"
            "        success = True\n"
            "\n"
            "# 2. Infinite Loop Guardrails\n"
            "# Always ensure state moves toward condition termination!"
        ),
        "failure_mode": "Failing to advance loop state inside the block, creating an infinite loop that pegs the CPU at 100%.",
        "subtopics": [
            "1.5.1 While loop syntax and boolean termination predicates",
            "1.5.2 Loop state mutation and avoiding infinite execution",
            "1.5.3 Sentinel values and polling loops",
            "1.5.4 Simulating network retries and exponential sleep intervals"
        ],
        "verification_criteria": "Implement `simulate_retry(max_tries)` that increments attempt counter and returns total attempts until mock success.",
        "starter_code": (
            "def simulate_retry(max_tries: int, target_success_attempt: int) -> int:\n"
            "    \"\"\"\n"
            "    Simulates retrying until attempt == target_success_attempt or attempt reaches max_tries.\n"
            "    Returns the total number of attempts executed.\n"
            "    \"\"\"\n"
            "    # TODO: Implement state-driven while loop\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import simulate_retry\n"
            "\n"
            "def test_retry():\n"
            "    assert simulate_retry(5, 3) == 3\n"
            "    assert simulate_retry(3, 10) == 3\n"
            "    print('✓ All assertions passed for Lesson 1.5')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_retry()\n"
        )
    },
    {
        "num": 6,
        "title": "For Loops, Iterables & The range() Generator",
        "subtitle": "Module 1 Python Foundations | Lesson 6 of 50",
        "xp": 100,
        "analogy": (
            "In Python, `for` loops do not use traditional C-style index manipulation (`for (int i=0; i<n; i++)`). "
            "Instead, Python `for` loops are universal iterator consumers: they directly traverse items from any iterable "
            "(strings, lists, generators). The built-in `range(start, stop, step)` object generates integers lazily on demand "
            "with O(1) memory overhead, regardless of whether you generate 10 numbers or 10 billion."
        ),
        "diagram": (
            "=== FOR LOOP ITERATION PROTOCOL ===\n"
            "Iterable [range(0, 3)] ---> Iterator [__iter__()] ---> Next Item [__next__()]\n"
            "Iteration 1: i = 0\n"
            "Iteration 2: i = 1\n"
            "Iteration 3: i = 2\n"
            "Iteration 4: Raises StopIteration -> Python catches and terminates cleanly"
        ),
        "walkthrough": (
            "# 1. Traversing Sequences\n"
            "models = ['claude', 'gpt', 'gemini']\n"
            "for m in models:\n"
            "    print(f'Active model: {m}')\n"
            "\n"
            "# 2. Lazy Integer Generation with range()\n"
            "for step in range(1, 4):  # 1, 2, 3\n"
            "    print(f'Execution step {step}')\n"
            "\n"
            "# 3. Enumerate for Index Tracking\n"
            "for idx, m in enumerate(models, start=1):\n"
            "    print(f'{idx}. {m}')"
        ),
        "failure_mode": "Assuming range(1, 5) includes the integer 5 (it stops before 5), causing off-by-one errors.",
        "subtopics": [
            "1.6.1 The Python iteration protocol and iterable traversal",
            "1.6.2 The range() built-in: lazy evaluation and step increments",
            "1.6.3 Simultaneous index and element tracking with enumerate()",
            "1.6.4 Parallel iteration across multiple sequences with zip()"
        ],
        "verification_criteria": "Implement `batch_prompts(prompt_list, batch_size)` returning a list of prompt batches.",
        "starter_code": (
            "def batch_prompts(prompts: list, batch_size: int) -> list:\n"
            "    \"\"\"\n"
            "    Chunks a list of prompts into sub-lists of length batch_size using range().\n"
            "    \"\"\"\n"
            "    # TODO: Implement chunking with range(0, len(prompts), batch_size)\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import batch_prompts\n"
            "\n"
            "def test_batch():\n"
            "    data = ['p1', 'p2', 'p3', 'p4', 'p5']\n"
            "    batches = batch_prompts(data, 2)\n"
            "    assert batches == [['p1', 'p2'], ['p3', 'p4'], ['p5']]\n"
            "    print('✓ All assertions passed for Lesson 1.6')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_batch()\n"
        )
    },
    {
        "num": 7,
        "title": "Loop Control: break, continue & The else Clause",
        "subtitle": "Module 1 Python Foundations | Lesson 7 of 50",
        "xp": 100,
        "analogy": (
            "Loop control statements alter normal iteration. `break` immediately halts the loop and jumps out. `continue` "
            "skips the remaining statements in the current iteration and jumps to the next cycle. Python also features an uncommon "
            "construct: the `for...else` or `while...else` clause, where the `else` block executes exclusively if the loop completes "
            "naturally without hitting a `break`. This eliminates the need for messy boolean flags when searching sequences."
        ),
        "diagram": (
            "=== FOR / ELSE SEARCH PATTERN ===\n"
            "for item in stream:\n"
            "    if item == target:\n"
            "        found = item\n"
            "        break  -------------> [Exits Loop, SKIPS else block]\n"
            "else:\n"
            "    [Runs ONLY if loop completed without encountering break]"
        ),
        "walkthrough": (
            "# 1. Early Termination with break\n"
            "tokens = ['Hello', '<STOP>', 'World']\n"
            "output = []\n"
            "for t in tokens:\n"
            "    if t == '<STOP>':\n"
            "        break\n"
            "    output.append(t)\n"
            "\n"
            "# 2. Skipping Iterations with continue\n"
            "clean_tokens = []\n"
            "for t in tokens:\n"
            "    if t.startswith('<'):\n"
            "        continue  # Skip delimiters\n"
            "    clean_tokens.append(t)\n"
            "\n"
            "# 3. The for-else Search idiom\n"
            "for t in tokens:\n"
            "    if t == 'TARGET':\n"
            "        break\n"
            "else:\n"
            "    print('Target not found in stream')"
        ),
        "failure_mode": "Misinterpreting loop else as running on every loop step, or leaving break statements unconditioned.",
        "subtopics": [
            "1.7.1 Immediate loop exit using break",
            "1.7.2 Cycle skipping with continue",
            "1.7.3 The for-else and while-else search completion construct",
            "1.7.4 Eliminating boolean search flag anti-patterns"
        ],
        "verification_criteria": "Implement `find_forbidden_word(text_stream, forbidden)` using for-else, returning True if clean.",
        "starter_code": (
            "def validate_stream_cleanliness(tokens: list, forbidden_word: str) -> bool:\n"
            "    \"\"\"\n"
            "    Iterates through tokens. If forbidden_word is found, break immediately and return False.\n"
            "    Use the loop else clause to return True if the stream is clean.\n"
            "    \"\"\"\n"
            "    # TODO: Implement stream validator using loop control\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import validate_stream_cleanliness\n"
            "\n"
            "def test_clean():\n"
            "    assert validate_stream_cleanliness(['user', 'query', 'clear'], 'inject') is True\n"
            "    assert validate_stream_cleanliness(['user', 'inject', 'query'], 'inject') is False\n"
            "    print('✓ All assertions passed for Lesson 1.7')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_clean()\n"
        )
    },
    {
        "num": 8,
        "title": "Functions: Signatures, Parameters & Return Values",
        "subtitle": "Module 1 Python Foundations | Lesson 8 of 50",
        "xp": 100,
        "analogy": (
            "A function is an encapsulated, reusable computational contract. It isolates inputs through parameter signatures, "
            "executes deterministic transformations in its local stack frame, and explicitly returns computed results. Writing small, "
            "pure functions with single responsibilities makes code testable, composable, and free of spooky action at a distance."
        ),
        "diagram": (
            "=== FUNCTION CALL & STACK FRAME LIFECYCLE ===\n"
            "Main Stack Frame                  Function Stack Frame (format_prompt)\n"
            "+----------------------+          +-----------------------------------+\n"
            "| prompt = '...'       |          | template: 'You are an AI...'       |\n"
            "| call format_prompt() | -------> | user_input: 'Hello'               |\n"
            "| result = <returned>  | <------- | return: hydrated string           |\n"
            "+----------------------+          +-----------------------------------+\n"
            "                                  [Stack frame destroyed on return!]"
        ),
        "walkthrough": (
            "# 1. Positional and Keyword Parameters\n"
            "def build_system_message(role: str, content: str, priority: int = 1) -> dict:\n"
            "    return {\n"
            "        'role': role,\n"
            "        'content': content,\n"
            "        'priority': priority\n"
            "    }\n"
            "\n"
            "# 2. Calling with Positional vs Keyword Arguments\n"
            "msg1 = build_system_message('system', 'You are helpful')\n"
            "msg2 = build_system_message(content='Execute task', role='user', priority=5)\n"
            "\n"
            "# 3. Early Returns and Single Responsibility\n"
            "def sanitize_input(text: str) -> str:\n"
            "    if not text:\n"
            "        return ''\n"
            "    return text.strip()"
        ),
        "failure_mode": "Using mutable default arguments (e.g. def fn(cache=[]):) which persist across calls, causing state corruption.",
        "subtopics": [
            "1.8.1 Defining functions with def and specifying return contracts",
            "1.8.2 Positional arguments, keyword arguments, and default parameters",
            "1.8.3 The mutable default argument trap (def fn(arg=[]):) and the None sentinel pattern",
            "1.8.4 Pure functions, deterministic output, and side-effect minimization"
        ],
        "verification_criteria": "Implement `build_prompt_payload(query, system_prompt='You are an AI', temp=0.7)` returning a structured request dict.",
        "starter_code": (
            "def build_prompt_payload(query: str, system_prompt: str = 'You are an AI', temp: float = 0.7) -> dict:\n"
            "    \"\"\"\n"
            "    Constructs an API payload dictionary containing:\n"
            "    - 'system': system_prompt\n"
            "    - 'query': query\n"
            "    - 'temperature': temp\n"
            "    \"\"\"\n"
            "    # TODO: Implement parameter binding\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import build_prompt_payload\n"
            "\n"
            "def test_payload():\n"
            "    p = build_prompt_payload('Summarize text')\n"
            "    assert p == {'system': 'You are an AI', 'query': 'Summarize text', 'temperature': 0.7}\n"
            "    p2 = build_prompt_payload('Code', 'You are a dev', 0.2)\n"
            "    assert p2['temperature'] == 0.2\n"
            "    print('✓ All assertions passed for Lesson 1.8')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_payload()\n"
        )
    },
    {
        "num": 9,
        "title": "Variable Scope, Namespaces & The LEGB Rule",
        "subtitle": "Module 1 Python Foundations | Lesson 9 of 50",
        "xp": 100,
        "analogy": (
            "Namespaces are the phonebooks of programming languages. When you refer to a variable name `x`, Python does not "
            "guess which `x` you mean: it searches four strictly nested scopes in order: Local, Enclosing, Global, Built-in (LEGB). "
            "Understanding this lookup hierarchy stops you from accidentally shadowing built-in functions or introducing "
            "mysterious UnboundLocalError bugs."
        ),
        "diagram": (
            "=== THE LEGB SCOPE LOOKUP HIERARCHY ===\n"
            "  [L] Local      -> Defined inside the currently executing function\n"
            "      ▲\n"
            "  [E] Enclosing  -> Defined in outer enclosing functions (closures)\n"
            "      ▲\n"
            "  [G] Global     -> Defined at module top-level\n"
            "      ▲\n"
            "  [B] Built-in   -> Pre-loaded Python names (len, range, dict, open)"
        ),
        "walkthrough": (
            "# 1. Local vs Global Scope\n"
            "GLOBAL_MODEL = 'claude-3-haiku'\n"
            "\n"
            "def get_runtime_model():\n"
            "    LOCAL_MODEL = 'gpt-4o'  # Only exists inside this function\n"
            "    return LOCAL_MODEL\n"
            "\n"
            "# 2. The UnboundLocalError Trap\n"
            "# If you assign to a name inside a function, Python marks it local for the ENTIRE function!\n"
            "count = 10\n"
            "def buggy_increment():\n"
            "    # print(count)  # Crashes if followed by count = count + 1 without global keyword\n"
            "    pass"
        ),
        "failure_mode": "Accidentally shadowing Python built-ins by naming variables 'list', 'dict', 'str', or 'type', disabling them globally.",
        "subtopics": [
            "1.9.1 The LEGB lookup resolution order: Local, Enclosing, Global, Built-in",
            "1.9.2 Global variable hazards and why pure functions avoid global state mutation",
            "1.9.3 Resolving UnboundLocalError when referencing variables before assignment",
            "1.9.4 Built-in namespace protection and shadow prevention"
        ],
        "verification_criteria": "Implement a closure generator `make_cost_tracker(rate_per_token)` returning a function that updates running total locally.",
        "starter_code": (
            "def make_cost_tracker(rate_per_token: float):\n"
            "    \"\"\"\n"
            "    Returns a function track(tokens: int) -> float that accumulates\n"
            "    and returns the total bill across calls using non-global state.\n"
            "    \"\"\"\n"
            "    total_bill = 0.0\n"
            "    def track(tokens: int) -> float:\n"
            "        nonlocal total_bill\n"
            "        total_bill += tokens * rate_per_token\n"
            "        return round(total_bill, 4)\n"
            "    return track\n"
        ),
        "test_suite": (
            "from solution import make_cost_tracker\n"
            "\n"
            "def test_tracker():\n"
            "    t = make_cost_tracker(0.01)\n"
            "    assert t(100) == 1.0\n"
            "    assert t(200) == 3.0\n"
            "    print('✓ All assertions passed for Lesson 1.9')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_tracker()\n"
        )
    },
    {
        "num": 10,
        "title": "Debugging Discipline: Print Debugging, Assertions & pdb",
        "subtitle": "Module 1 Python Foundations | Lesson 10 of 50",
        "xp": 100,
        "analogy": (
            "Writing software without systematic debugging tools is like navigating a pitch-black cave with your eyes closed. "
            "Professional engineers don't guess why code failed; they inspect runtime state. From structured f-string inspection "
            "to defensive `assert` statements and the interactive `breakpoint()` debugger, you will learn to pause program execution, "
            "step line-by-line, and verify hypotheses with surgical precision."
        ),
        "diagram": (
            "=== THE INTERACTIVE DEBUGGER (PDB) WORKFLOW ===\n"
            "Execution Stream: line 1 -> line 2 -> breakpoint() [EXECUTION PAUSED]\n"
            "Terminal Prompt: (Pdb) >\n"
            "Commands:\n"
            "  'n' (next)      -> Execute current line and advance\n"
            "  's' (step in)   -> Step inside the called function\n"
            "  'c' (continue)  -> Resume execution until next breakpoint\n"
            "  'p <variable>'  -> Print the live runtime value of variable"
        ),
        "walkthrough": (
            "# 1. Strategic State Inspection with f-strings\n"
            "def calculate_average(scores: list[float]) -> float:\n"
            "    assert len(scores) > 0, 'scores list cannot be empty'\n"
            "    total = sum(scores)\n"
            "    count = len(scores)\n"
            "    return total / count\n"
            "\n"
            "# 2. Using Python 3.7+ breakpoint()\n"
            "# Inserting breakpoint() halts execution and drops into pdb\n"
            "# pdb commands: n (next line), s (step in), c (continue), q (quit)"
        ),
        "failure_mode": "Scattering uncommented print() calls in production code or failing to test edge cases with empty input sequences.",
        "subtopics": [
            "1.10.1 Structured logging and state inspection techniques with f-strings",
            "1.10.2 Invariant verification with defensive assert statements",
            "1.10.3 The built-in breakpoint() hook and pdb navigation commands (n, s, c, p)",
            "1.10.4 Reading and interpreting Python tracebacks from top to bottom"
        ],
        "verification_criteria": "Implement `safe_divide_tokens(total_tokens, chunks)` with an assert guard against chunks <= 0, returning tokens per chunk.",
        "starter_code": (
            "def safe_divide_tokens(total_tokens: int, chunks: int) -> int:\n"
            "    \"\"\"\n"
            "    Validates that chunks > 0 with an assertion, then returns total_tokens // chunks.\n"
            "    If chunks <= 0, raises AssertionError with message 'chunks must be positive'.\n"
            "    \"\"\"\n"
            "    # TODO: Implement assertion guard and division\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import safe_divide_tokens\n"
            "\n"
            "def test_debug():\n"
            "    assert safe_divide_tokens(1000, 4) == 250\n"
            "    try:\n"
            "        safe_divide_tokens(1000, 0)\n"
            "        assert False, 'Should have raised AssertionError'\n"
            "    except AssertionError as e:\n"
            "        assert 'chunks must be positive' in str(e)\n"
            "    print('✓ All assertions passed for Lesson 1.10')\n"
            "\n"
            "if __name__ == '__main__':\n"
            "    test_debug()\n"
        )
    }
]

print(f"Loaded {len(M1_LESSONS)} core lessons in Part 1.")
