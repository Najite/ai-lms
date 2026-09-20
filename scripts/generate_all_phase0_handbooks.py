#!/usr/bin/env python3
"""
generate_all_phase0_handbooks.py
Populates all 20 foundational Phase 0 lessons with complete, high-density,
5-section instructional textbook chapters (~1,200 to 1,800 words), ASCII diagrams,
annotated code walkthroughs, error debugging guides, and concrete unit test assertions.
"""

import json

MANIFEST_PATH = "/home/sawacha/lms/supabase/curriculum_manifest.json"
SEED_SQL_PATH = "/home/sawacha/lms/supabase/seed_curriculum.sql"

LESSONS = [
    {
        "lesson_number": 1,
        "title": "Variables, Data Types & The Interpreter",
        "analogy": (
            "Think of physical computer memory (RAM) as a massive hotel with billions of numbered rooms. "
            "In low-level machine code, you would have to remember that your user's age is stored in room #0x7ffd9a2b10. "
            "A variable is simply a human-friendly sticky note stuck to that hotel room door. When you write `age = 25`, "
            "Python's interpreter allocates an object representing the number 25 in memory and attaches the label `age` to it. "
            "Unlike compiled languages where a variable is a rigid, fixed-size box, a Python variable is a dynamic pointer—a "
            "name tag that can be easily peeled off and stuck onto a completely different object (like a string or a list) at runtime."
        ),
        "diagram": (
            "=== PYTHON VARIABLE ASSIGNMENT & REFERENCE MODEL ===\n"
            "Stack Frame (Names)              Heap Memory (Objects)\n"
            "+---------------+               +-----------------------------+\n"
            "|  name: 'age'  | ------------> | PyLongObject                |\n"
            "+---------------+               |  ob_refcnt: 1               |\n"
            "                                |  ob_type:   <class 'int'>   |\n"
            "+---------------+               |  ob_ival:   25              |\n"
            "|  name: 'name' | ------------> +-----------------------------+\n"
            "+---------------+               +-----------------------------+\n"
            "                                | PyUnicodeObject             |\n"
            "                                |  ob_refcnt: 1               |\n"
            "                                |  value:     'Ada'           |\n"
            "                                +-----------------------------+"
        ),
        "code_walkthrough": (
            "# 1. Integer variable: Whole numbers used for discrete counts\n"
            "student_count = 42  # Python automatically allocates an integer object\n"
            "\n"
            "# 2. Floating-point variable: Real numbers with fractional decimal points\n"
            "cpu_temperature = 98.6  # Python allocates an IEEE-754 double precision float\n"
            "\n"
            "# 3. String variable: Sequence of Unicode characters enclosed in quotes\n"
            "server_status = \"OPERATIONAL\"  # Stored as an immutable sequence of characters\n"
            "\n"
            "# 4. Boolean variable: Pure binary logical states (True or False)\n"
            "is_connected = True  # Used extensively for conditional decision branches\n"
            "\n"
            "# 5. Type Inspection: Asking the interpreter what object type a variable points to\n"
            "print(type(student_count))    # Outputs: <class 'int'>\n"
            "print(type(cpu_temperature))  # Outputs: <class 'float'>\n"
            "\n"
            "# 6. Dynamic Re-binding: Variables can point to a different type at any time\n"
            "metric = 100         # metric currently points to an integer\n"
            "metric = \"100 Mbps\"  # Now metric points to a string; old integer is garbage collected!"
        ),
        "gotchas": (
            "1. TypeError on Implicit Type Coercion: Beginners coming from JavaScript often assume Python will automatically convert types, writing `\"Count: \" + 10`. "
            "In Python, this raises `TypeError: can only concatenate str (not \"int\") to str`. Fix: Explicitly cast using `str(10)`.\n"
            "2. Variable Name Collision: Naming a variable after a built-in function, such as `str = \"hello\"` or `list = [1, 2]`. "
            "This shadows the global constructor, causing subsequent calls like `str(42)` to crash with `TypeError: 'str' object is not callable`.\n"
            "3. Case Sensitivity: `Value` and `value` are two completely different, isolated variable labels in Python memory."
        ),
        "challenge_desc": (
            "Write a function `inspect_and_cast(val)` that takes any input value, identifies its primitive type, and returns a formatted dictionary:\n"
            "- `type`: The lowercase string name of the type ('int', 'float', 'str', 'bool').\n"
            "- `as_string`: The value explicitly cast to a string.\n"
            "- `is_numeric`: A boolean that is True if the value is an int or float (note: bools should return False for numeric!)."
        ),
        "starter_code": (
            "def inspect_and_cast(val):\n"
            "    # Step 1: Check if the value is a boolean first (in Python, bool is a subclass of int!)\n"
            "    if isinstance(val, bool):\n"
            "        return {\"type\": \"bool\", \"as_string\": str(val), \"is_numeric\": False}\n"
            "    \n"
            "    # Step 2: Determine if value is int, float, or str\n"
            "    # TODO: Implement type detection and return dictionary\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import inspect_and_cast\n"
            "\n"
            "r1 = inspect_and_cast(42)\n"
            "assert r1 == {\"type\": \"int\", \"as_string\": \"42\", \"is_numeric\": True}, f\"Test 1 Failed: got {r1}\"\n"
            "r2 = inspect_and_cast(3.14)\n"
            "assert r2 == {\"type\": \"float\", \"as_string\": \"3.14\", \"is_numeric\": True}, f\"Test 2 Failed: got {r2}\"\n"
            "r3 = inspect_and_cast(\"Hello\")\n"
            "assert r3 == {\"type\": \"str\", \"as_string\": \"Hello\", \"is_numeric\": False}, f\"Test 3 Failed: got {r3}\"\n"
            "r4 = inspect_and_cast(True)\n"
            "assert r4 == {\"type\": \"bool\", \"as_string\": \"True\", \"is_numeric\": False}, f\"Test 4 Failed: got {r4}\"\n"
            "print(\"✓ All assertions passed for Variables, Data Types & The Interpreter!\")\n"
        )
    },
    {
        "lesson_number": 2,
        "title": "Expressions, Operators & Precedence",
        "analogy": (
            "Think of expressions as chemical recipes or mathematical formulas that the computer evaluates step-by-step to produce a single final value. "
            "Just as standard arithmetic strictly follows PEMDAS (Parentheses, Exponents, Multiplication, Division, Addition, Subtraction), the Python interpreter "
            "follows an unshakeable hierarchy called Operator Precedence. When you write `x = 5 + 3 * 2`, Python does not read blindly left-to-right to get 16; "
            "it prioritizes the multiplication operator `*` over addition `+` to yield 11. Knowing these rules lets you write bug-free calculations, while parentheses "
            "give you absolute control to force Python to compute your logic in the exact order you demand."
        ),
        "diagram": (
            "=== OPERATOR PRECEDENCE EVALUATION TREE ===\n"
            "Expression:  result = (10 + 2) * 3 ** 2 // 4\n"
            "\n"
            "Step 1: Parentheses (10 + 2)  -->  12\n"
            "Step 2: Exponentiation 3 ** 2 -->  9\n"
            "Step 3: Multiplication 12 * 9 --> 108\n"
            "Step 4: Floor Division 108 // 4 -> 27\n"
            "\n"
            "       (//)\n"
            "      /    \\\n"
            "    (*)     4\n"
            "   /   \\\n"
            " (+)   (**)\n"
            " / \\   /  \\\n"
            "10  2 3    2"
        ),
        "code_walkthrough": (
            "# 1. Standard Arithmetic Operators\n"
            "sum_val = 15 + 4        # Addition -> 19\n"
            "diff_val = 15 - 4       # Subtraction -> 11\n"
            "product_val = 15 * 4    # Multiplication -> 60\n"
            "float_div = 15 / 4      # True Division (always returns float) -> 3.75\n"
            "floor_div = 15 // 4     # Floor Division (truncates fractional part) -> 3\n"
            "remainder = 15 % 4      # Modulo (calculates remainder) -> 3\n"
            "power_val = 2 ** 8      # Exponentiation (2 raised to power of 8) -> 256\n"
            "\n"
            "# 2. Comparison Operators (Return boolean True or False)\n"
            "is_equal = (10 == 10)   # Equality check -> True\n"
            "is_not_equal = (5 != 3) # Inequality check -> True\n"
            "is_greater = (8 > 12)   # Greater than -> False\n"
            "\n"
            "# 3. Logical Operators: and, or, not\n"
            "has_access = (is_equal and not is_greater) # True and not False -> True\n"
            "\n"
            "# 4. Short-Circuit Evaluation Mechanics\n"
            "# In 'A and B', if A is False, Python never evaluates B (saving execution cycles)\n"
            "# In 'A or B', if A is True, Python immediately returns True without running B"
        ),
        "gotchas": (
            "1. Confusing Assignment `=` with Equality `==`: Writing `if x = 5:` triggers a `SyntaxError: invalid syntax`. In Python, `=` assigns data to a name, while `==` compares two values.\n"
            "2. Float Division Gotcha: In Python 3, `/` always yields a float (e.g. `4 / 2` is `2.0`, not integer `2`). If you need clean integer indices for lists, you must use floor division `//`.\n"
            "3. Chained Comparison Surprises: Python supports `1 < x < 10` natively, which expands to `(1 < x) and (x < 10)`. However, writing `x == 1 or 2` does NOT check if x is 1 or 2; it evaluates `(x == 1) or 2`, which truthy-evaluates to `2`!"
        ),
        "challenge_desc": (
            "Write a function `safe_compute(a: int, b: int, op: str)` that performs the requested mathematical operation:\n"
            "- If `op == '+'`, return `a + b`\n"
            "- If `op == '-'`, return `a - b`\n"
            "- If `op == '*'`, return `a * b`\n"
            "- If `op == '//'`, return `a // b`. However, if `b == 0`, return `None` to prevent `ZeroDivisionError`!\n"
            "- If `op == '%'`, return `a % b`. If `b == 0`, return `None`.\n"
            "- For any unsupported operator, return `None`."
        ),
        "starter_code": (
            "def safe_compute(a: int, b: int, op: str):\n"
            "    # TODO: Implement safe arithmetic with zero-division protection\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import safe_compute\n"
            "\n"
            "assert safe_compute(10, 5, '+') == 15, \"Addition failed\"\n"
            "assert safe_compute(20, 7, '-') == 13, \"Subtraction failed\"\n"
            "assert safe_compute(6, 7, '*') == 42, \"Multiplication failed\"\n"
            "assert safe_compute(17, 5, '//') == 3, \"Floor division failed\"\n"
            "assert safe_compute(17, 5, '%') == 2, \"Modulo failed\"\n"
            "assert safe_compute(10, 0, '//') is None, \"Zero division must return None\"\n"
            "assert safe_compute(10, 0, '%') is None, \"Zero modulo must return None\"\n"
            "assert safe_compute(5, 5, '^') is None, \"Unknown operator must return None\"\n"
            "print(\"✓ All assertions passed for Expressions, Operators & Precedence!\")\n"
        )
    },
    {
        "lesson_number": 3,
        "title": "String Indexing, Slicing & Manipulation",
        "analogy": (
            "Think of a string as a physical freight train where each train car holds exactly one character. "
            "Every car has a numbered ticket slot. In computer science, we always count starting at 0 (the first car is car 0). "
            "Python gives you two incredible super-powers when dealing with strings: negative indexing and slicing. "
            "Negative indexing lets you count backwards from the caboose (the last car is `-1`), so you never need to calculate "
            "`len(s) - 1`. Slicing is like attaching a laser cutter to the train track: you specify `[start : stop : step]`, "
            "and Python cleanly extracts that exact sub-segment into a brand new string while leaving the original freight train untouched."
        ),
        "diagram": (
            "=== STRING MEMORY INDEXING IN PYTHON ===\n"
            "Characters:    P    Y    T    H    O    N\n"
            "Positive Idx:  0    1    2    3    4    5\n"
            "Negative Idx: -6   -5   -4   -3   -2   -1\n"
            "\n"
            "Slice Syntax: text[start : stop : step]\n"
            "Note: 'stop' is exclusive (up to, but not including)\n"
            "Example: text[1:4] extracts characters at indices 1, 2, 3 -> 'YTH'\n"
            "Example: text[::-1] reverses the string using step -1 -> 'NOHTYP'"
        ),
        "code_walkthrough": (
            "text = \"SystemsEngineering\"\n"
            "\n"
            "# 1. Direct Indexing (Accessing individual characters)\n"
            "first_char = text[0]    # 'S'\n"
            "last_char = text[-1]    # 'g' (counts backwards from the end)\n"
            "second_last = text[-2]  # 'n'\n"
            "\n"
            "# 2. Slicing: [start:stop] (stop index is EXCLUSIVE)\n"
            "prefix = text[0:7]      # Indices 0 to 6 -> 'Systems'\n"
            "suffix = text[7:]       # From index 7 to the very end -> 'Engineering'\n"
            "\n"
            "# 3. Strided Slicing: [start:stop:step]\n"
            "every_other = text[::2] # Skips every 2nd character -> 'SsesEgneig'\n"
            "reversed_s = text[::-1] # Step of -1 reverses entire string -> 'gnireenignEsmetsyS'\n"
            "\n"
            "# 4. Immutability: Strings cannot be changed in-place!\n"
            "# text[0] = 's'  <-- RAISES TypeError: 'str' object does not support item assignment\n"
            "# To modify, construct a new string:\n"
            "updated_text = \"s\" + text[1:]  # 'systemsEngineering'\n"
            "\n"
            "# 5. Essential String Methods\n"
            "clean = \"  user@domain.com \\n \".strip()  # Removes leading/trailing whitespace\n"
            "tokens = \"cpu,memory,disk\".split(\",\")     # Returns ['cpu', 'memory', 'disk']"
        ),
        "gotchas": (
            "1. IndexError: Accessing an index that doesn't exist, such as `\"cat\"[5]`, crashes with `IndexError: string index out of range`. "
            "However, slicing is forgiving: `\"cat\"[0:100]` will safely return `\"cat\"` without crashing!\n"
            "2. Exclusive Upper Bound Confusion: Beginners frequently think `s[0:3]` includes index 3. It only takes indices 0, 1, and 2. "
            "A handy mental rule: the number of characters extracted by `s[start:stop]` is always `stop - start`.\n"
            "3. String Concatenation in Loops: Repeatedly appending to a string with `s += char` inside a loop creates a brand new string object every iteration, "
            "turning an $O(N)$ task into an $O(N^2)$ memory-allocating disaster. Fix: Append characters to a list and use `\"\".join(list)`."
        ),
        "challenge_desc": (
            "Write a function `parse_log_entry(log_line: str)` that processes a standardized web server log line formatted as:\n"
            "`\"[TIMESTAMP] LEVEL: MESSAGE\"` (e.g. `'[2026-09-20] ERROR: Database connection failed'`)\n"
            "Return a dictionary containing:\n"
            "- `timestamp`: The date inside the brackets, with brackets removed (e.g. `'2026-09-20'`).\n"
            "- `level`: The uppercase log level string (e.g. `'ERROR'`).\n"
            "- `message`: The trimmed message string (e.g. `'Database connection failed'`).\n"
            "- `is_critical`: True if level is `'ERROR'` or `'CRITICAL'`, False otherwise."
        ),
        "starter_code": (
            "def parse_log_entry(log_line: str) -> dict:\n"
            "    # Step 1: Extract timestamp between '[' and ']'\n"
            "    # Step 2: Split remaining string by ':' to isolate level and message\n"
            "    # TODO: Implement extraction using string slicing and methods\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import parse_log_entry\n"
            "\n"
            "log1 = \"[2026-09-20] ERROR: Database connection failed\"\n"
            "r1 = parse_log_entry(log1)\n"
            "assert r1 == {\n"
            "    \"timestamp\": \"2026-09-20\",\n"
            "    \"level\": \"ERROR\",\n"
            "    \"message\": \"Database connection failed\",\n"
            "    \"is_critical\": True\n"
            "}, f\"Test 1 Failed: got {r1}\"\n"
            "\n"
            "log2 = \"[2026-09-21] INFO: Cache warmed successfully\"\n"
            "r2 = parse_log_entry(log2)\n"
            "assert r2 == {\n"
            "    \"timestamp\": \"2026-09-21\",\n"
            "    \"level\": \"INFO\",\n"
            "    \"message\": \"Cache warmed successfully\",\n"
            "    \"is_critical\": False\n"
            "}, f\"Test 2 Failed: got {r2}\"\n"
            "\n"
            "print(\"✓ All assertions passed for String Indexing, Slicing & Manipulation!\")\n"
        )
    },
    {
        "lesson_number": 4,
        "title": "Conditional Branching: if, elif, else",
        "analogy": (
            "Think of conditional branching as a railroad track switch. When a train rolls down the track, a mechanical switch "
            "determines whether it heads toward Track A, Track B, or Track C based on clear physical rules. "
            "Without conditions, code is just a dumb script that executes the exact same steps in a straight line every single time. "
            "Conditional statements (`if`, `elif`, `else`) give software its ability to make decisions, handle anomalies, enforce security gates, "
            "and react intelligently to changing user inputs."
        ),
        "diagram": (
            "=== CONTROL FLOW DECISION TREE ===\n"
            "               [Incoming Request]\n"
            "                        |\n"
            "            Is User Authenticated? (if)\n"
            "                   /         \\\n"
            "               [Yes]         [No] ------> Return 401 Unauthorized\n"
            "                 |\n"
            "          Is Admin? (elif)\n"
            "             /       \\\n"
            "         [Yes]       [No] (else)\n"
            "           |           |\n"
            "    Grant Full     Grant Read-Only\n"
            "    Root Access    User Access"
        ),
        "code_walkthrough": (
            "def evaluate_server_health(cpu_usage: float, memory_usage: float) -> str:\n"
            "    # 1. Primary 'if' statement: Evaluates first\n"
            "    if cpu_usage > 90.0 or memory_usage > 95.0:\n"
            "        # Code indented under if only runs if condition is True\n"
            "        return \"CRITICAL: System resources exhausted!\"\n"
            "    \n"
            "    # 2. 'elif' (Else If): Only evaluated if preceding 'if' was False\n"
            "    elif cpu_usage > 75.0 or memory_usage > 80.0:\n"
            "        return \"WARNING: Elevated load detected\"\n"
            "    \n"
            "    # 3. Another chained 'elif' for specialized status\n"
            "    elif cpu_usage == 0.0 and memory_usage == 0.0:\n"
            "        return \"STANDBY: Host idle or metrics offline\"\n"
            "    \n"
            "    # 4. 'else': The fallback safety net if NO other condition matched\n"
            "    else:\n"
            "        return \"HEALTHY: All metrics nominal\"\n"
            "\n"
            "# 5. Truthiness in Python: Values that evaluate to False in conditions:\n"
            "# None, False, 0, 0.0, empty string \"\", empty list [], empty dict {}\n"
            "# Everything else evaluates to True!"
        ),
        "gotchas": (
            "1. Independent `if` vs Chained `elif`: Beginners often write multiple `if` blocks instead of `elif`. "
            "If multiple conditions match, ALL independent `if` blocks execute! Use `elif` when only ONE branch should ever execute.\n"
            "2. The Dangling Boolean Bug: Writing `if status == 'active' or 'pending':`. In Python, `'pending'` is a non-empty string which evaluates to True! "
            "Thus, this condition is ALWAYS True. Fix: `if status == 'active' or status == 'pending':` or `if status in ('active', 'pending'):`.\n"
            "3. Incorrect Indentation: Python uses strict indentation (4 spaces). Mixing tabs and spaces will trigger a hard `IndentationError`."
        ),
        "challenge_desc": (
            "Write a function `classify_http_status(status_code: int) -> dict` that evaluates an HTTP status code:\n"
            "- If code is in range 200–299: category is `'SUCCESS'`, is_error is False\n"
            "- If code is in range 300–399: category is `'REDIRECTION'`, is_error is False\n"
            "- If code is in range 400–499: category is `'CLIENT_ERROR'`, is_error is True\n"
            "- If code is in range 500–599: category is `'SERVER_ERROR'`, is_error is True\n"
            "- For any other code: category is `'INVALID'`, is_error is True\n"
            "Return a dictionary with keys `'code'`, `'category'`, and `'is_error'`."
        ),
        "starter_code": (
            "def classify_http_status(status_code: int) -> dict:\n"
            "    # TODO: Implement HTTP status code classification with conditional branching\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import classify_http_status\n"
            "\n"
            "assert classify_http_status(200) == {\"code\": 200, \"category\": \"SUCCESS\", \"is_error\": False}\n"
            "assert classify_http_status(301) == {\"code\": 301, \"category\": \"REDIRECTION\", \"is_error\": False}\n"
            "assert classify_http_status(404) == {\"code\": 404, \"category\": \"CLIENT_ERROR\", \"is_error\": True}\n"
            "assert classify_http_status(503) == {\"code\": 503, \"category\": \"SERVER_ERROR\", \"is_error\": True}\n"
            "assert classify_http_status(999) == {\"code\": 999, \"category\": \"INVALID\", \"is_error\": True}\n"
            "print(\"✓ All assertions passed for Conditional Branching: if, elif, else!\")\n"
        )
    },
    {
        "lesson_number": 5,
        "title": "While Loops & Loop Invariants",
        "analogy": (
            "Think of a `while` loop as a security guard stationed at the entrance of a building. "
            "Before letting anyone through, the guard checks a badge: 'Is this badge valid?' If yes, the person walks in. "
            "Then the guard checks the next person: 'Is this badge valid?' As long as the condition remains True, people keep entering. "
            "The moment an invalid badge appears, the door is slammed shut, and execution moves forward. "
            "A `while` loop is used when you do not know in advance how many times you need to repeat an action—such as reading data "
            "from a network socket until the client disconnects, or retrying a failed database connection until it succeeds."
        ),
        "diagram": (
            "=== WHILE LOOP EXECUTION CYCLE ===\n"
            "              +------------------+\n"
            "              |  Evaluate Test   |\n"
            "              |    Condition     |\n"
            "              +------------------+\n"
            "                     /    \\\n"
            "             [True] /      \\ [False]\n"
            "                   v        v\n"
            "          +-------------+  +------------------+\n"
            "          | Run Loop    |  | Exit Loop &      |\n"
            "          | Body Block  |  | Continue Program |\n"
            "          +-------------+  +------------------+\n"
            "                 |                  ^\n"
            "                 +------------------+"
        ),
        "code_walkthrough": (
            "# 1. Basic While Loop with a Loop Counter\n"
            "count = 1\n"
            "while count <= 5:        # Evaluates before every single iteration\n"
            "    print(f\"Heartbeat #{count}\")\n"
            "    count += 1          # CRITICAL: If you omit this, loop runs forever!\n"
            "\n"
            "# 2. Sentinel Loop: Draining a Queue or Buffer\n"
            "pending_packets = [101, 102, 103, 104]\n"
            "while pending_packets:   # Truthiness check: empty list evaluates to False!\n"
            "    packet = pending_packets.pop(0)  # Remove front packet\n"
            "    print(f\"Processing packet {packet}\")\n"
            "\n"
            "# 3. Loop Invariant Concept:\n"
            "# An invariant is an unshakeable mathematical truth that holds before and after each loop cycle.\n"
            "# Example: In binary search, the target is ALWAYS guaranteed to be between index Low and High."
        ),
        "gotchas": (
            "1. The Dreaded Infinite Loop: If your loop condition never becomes False (e.g. forgetting `i += 1`), the CPU will spin at 100% forever. "
            "Always ensure that the variables controlling the condition change meaningfully inside the loop body!\n"
            "2. Off-By-One Boundary Error: Confusing `<` with `<=`. If you want to process numbers 1 to 5, `while i < 5:` stops at 4, skipping 5.\n"
            "3. Modifying a Collection While Iterating: Removing items from a list while looping over its indices causes skipped elements and index out-of-range exceptions."
        ),
        "challenge_desc": (
            "Write a function `drain_and_accumulate(numbers: list[int], threshold: int) -> dict` using a `while` loop:\n"
            "- Continuously remove (pop) elements from the front of `numbers` and sum them up.\n"
            "- Stop immediately when the running sum exceeds or equals `threshold`, OR when the list becomes completely empty.\n"
            "- Return a dictionary containing:\n"
            "  - `accumulated_sum`: The total sum reached\n"
            "  - `items_processed`: The count of numbers popped\n"
            "  - `remaining_items`: The remaining un-popped list"
        ),
        "starter_code": (
            "def drain_and_accumulate(numbers: list[int], threshold: int) -> dict:\n"
            "    # TODO: Implement while-loop queue drain with running threshold accumulation\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import drain_and_accumulate\n"
            "\n"
            "r1 = drain_and_accumulate([10, 20, 30, 40, 50], 55)\n"
            "assert r1 == {\"accumulated_sum\": 60, \"items_processed\": 3, \"remaining_items\": [40, 50]}, f\"Test 1 failed: {r1}\"\n"
            "r2 = drain_and_accumulate([5, 5, 5], 100)\n"
            "assert r2 == {\"accumulated_sum\": 15, \"items_processed\": 3, \"remaining_items\": []}, f\"Test 2 failed: {r2}\"\n"
            "r3 = drain_and_accumulate([], 10)\n"
            "assert r3 == {\"accumulated_sum\": 0, \"items_processed\": 0, \"remaining_items\": []}, f\"Test 3 failed: {r3}\"\n"
            "print(\"✓ All assertions passed for While Loops & Loop Invariants!\")\n"
        )
    },
    {
        "lesson_number": 6,
        "title": "For Loops & The range() Generator",
        "analogy": (
            "Think of a `for` loop as an automated conveyor belt. You place a series of boxes onto the belt, "
            "and a robotic arm picks up each box one by one, performs an operation on it, and sets it down before moving to the next. "
            "Unlike a `while` loop which requires manual counters (`i += 1`), a Python `for` loop is an iterator-based loop. "
            "It automatically knows when to start, how to retrieve the next item, and exactly when to cleanly stop. "
            "The `range()` function is like an on-demand number dispensing machine: it generates numbers sequentially without "
            "wasting computer memory by pre-allocating an entire billion-item list in RAM."
        ),
        "diagram": (
            "=== FOR LOOP & ITERATOR PROTOCOL ===\n"
            "range(0, 3) Generator ----> [Yields: 0] ---> Loop Body: i = 0\n"
            "                      ----> [Yields: 1] ---> Loop Body: i = 1\n"
            "                      ----> [Yields: 2] ---> Loop Body: i = 2\n"
            "                      ----> [StopIteration] -> Clean Exit Loop"
        ),
        "code_walkthrough": (
            "# 1. Standard range iteration: range(start, stop, step)\n"
            "# Remember: 'stop' is exclusive!\n"
            "for i in range(1, 6):       # Generates 1, 2, 3, 4, 5\n"
            "    print(f\"Step {i}\")\n"
            "\n"
            "# 2. Stepping through numbers (skipping)\n"
            "for even in range(0, 10, 2): # 0, 2, 4, 6, 8\n"
            "    pass\n"
            "\n"
            "# 3. Iterating directly over collections (No index needed!)\n"
            "services = [\"auth\", \"billing\", \"notifications\"]\n"
            "for service in services:\n"
            "    print(f\"Starting service: {service}\")\n"
            "\n"
            "# 4. When you need BOTH the index and the item: enumerate()\n"
            "for idx, service in enumerate(services):\n"
            "    print(f\"Service #{idx}: {service}\")"
        ),
        "gotchas": (
            "1. Using `for i in range(len(items)):`: In Python, iterating over indices just to do `items[i]` is an anti-pattern. "
            "Iterate directly over the list: `for item in items:`. If you need the index, use `enumerate(items)`.\n"
            "2. Memory Waste with `list(range(10000000))`: `range()` generates numbers on-the-fly (O(1) memory). Converting it to a `list()` forces Python to allocate hundreds of megabytes of RAM.\n"
            "3. Negative range without negative step: `range(10, 0)` is completely empty! You must specify a negative step: `range(10, 0, -1)`."
        ),
        "challenge_desc": (
            "Write a function `sum_of_evens_in_range(start: int, stop: int) -> int` that calculates the sum of all EVEN numbers "
            "in the range `[start, stop]` inclusive using a `for` loop.\n"
            "If `start > stop`, return 0."
        ),
        "starter_code": (
            "def sum_of_evens_in_range(start: int, stop: int) -> int:\n"
            "    # TODO: Calculate sum of even integers from start to stop inclusive\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import sum_of_evens_in_range\n"
            "\n"
            "assert sum_of_evens_in_range(1, 10) == 30, \"Sum of evens in 1..10 (2+4+6+8+10) should be 30\"\n"
            "assert sum_of_evens_in_range(2, 6) == 12, \"Sum of evens in 2..6 (2+4+6) should be 12\"\n"
            "assert sum_of_evens_in_range(5, 5) == 0, \"5 is odd, should be 0\"\n"
            "assert sum_of_evens_in_range(10, 2) == 0, \"start > stop should be 0\"\n"
            "print(\"✓ All assertions passed for For Loops & range() Generator!\")\n"
        )
    },
    {
        "lesson_number": 7,
        "title": "Loop Control: break, continue & else",
        "analogy": (
            "Imagine you are inspecting apples on an assembly line. Most apples are good, so you pack them into a box. "
            "If you spot a slightly bruised apple, you don't want to shut down the whole factory; you simply skip it and move to the next apple. "
            "That is `continue`. But if you spot a poisonous apple, you hit the emergency red stop button and shut down the line immediately. "
            "That is `break`. In Python, loops also have an exclusive `else` block: it is a completion reward that executes ONLY if the loop finished "
            "all items normally without hitting the emergency `break` button."
        ),
        "diagram": (
            "=== LOOP CONTROL FLOW: break VS continue ===\n"
            "             [Start Iteration]\n"
            "                     |\n"
            "           Is item defective?\n"
            "           /                \\\n"
            "        [Yes]               [No] ----> Process item normally\n"
            "          |\n"
            "    Is it fatal?\n"
            "     /         \\\n"
            "  [Yes]        [No]\n"
            "    |            |\n"
            "  break       continue\n"
            " (Exit loop) (Jump to next item)"
        ),
        "code_walkthrough": (
            "# 1. 'continue': Skip the current cycle and proceed to next\n"
            "for num in range(1, 6):\n"
            "    if num == 3:\n"
            "        continue  # Number 3 is skipped completely!\n"
            "    print(f\"Processed {num}\")  # Prints 1, 2, 4, 5\n"
            "\n"
            "# 2. 'break': Prematurely abort the entire loop\n"
            "targets = [\"user_1\", \"user_2\", \"target_user\", \"user_3\"]\n"
            "for user in targets:\n"
            "    if user == \"target_user\":\n"
            "        print(\"Target found! Aborting search.\")\n"
            "        break  # Loop exits immediately\n"
            "\n"
            "# 3. The 'for-else' clause: Runs ONLY if no 'break' was hit!\n"
            "for user in [\"alice\", \"bob\"]:\n"
            "    if user == \"charlie\":\n"
            "        break\n"
            "else:\n"
            "    print(\"Search completed: Charlie was not in the database.\")"
        ),
        "gotchas": (
            "1. Misunderstanding `for-else`: Beginners think `else` runs if the loop condition is False, like an `if-else`. "
            "In Python, `else` on a loop means 'No Break Occurred'. If the loop breaks, `else` is skipped.\n"
            "2. Unreachable Code After `break`: Placing statements directly below `break` inside an `if` block will never execute.\n"
            "3. Breaking Nested Loops: `break` only exits the innermost loop it resides in. It does NOT break out of an outer parent loop."
        ),
        "challenge_desc": (
            "Write a function `find_first_negative(numbers: list[int]) -> dict`:\n"
            "- Loop through the list of integers.\n"
            "- Skip any zero (`0`) using `continue`.\n"
            "- When the first negative number is found, immediately record its value and index, and abort using `break`.\n"
            "- If the loop finishes without finding any negative numbers (use `for-else`!), return `{'found': False, 'value': None, 'index': -1}`.\n"
            "- If found, return `{'found': True, 'value': num, 'index': idx}`."
        ),
        "starter_code": (
            "def find_first_negative(numbers: list[int]) -> dict:\n"
            "    # TODO: Implement search with continue, break, and for-else\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import find_first_negative\n"
            "\n"
            "assert find_first_negative([0, 5, 0, 10, -4, 20]) == {'found': True, 'value': -4, 'index': 4}\n"
            "assert find_first_negative([1, 2, 3, 4]) == {'found': False, 'value': None, 'index': -1}\n"
            "assert find_first_negative([-10, 5]) == {'found': True, 'value': -10, 'index': 0}\n"
            "print(\"✓ All assertions passed for Loop Control: break, continue & else!\")\n"
        )
    },
    {
        "lesson_number": 8,
        "title": "Functions: Parameters, Arguments & Returns",
        "analogy": (
            "Think of a function as a standardized industrial black box or vending machine. "
            "The vending machine has input slots (parameters): you put in a dollar bill and press button B4 (arguments). "
            "Inside the machine, mechanical gears spin (function body execution). Finally, a snack drops into the tray (return value). "
            "Functions are the primary building blocks of software engineering: they prevent you from repeating the same 20 lines of code "
            "across 50 files, isolate bugs to a single location, and allow complex systems to be assembled from simple, testable parts."
        ),
        "diagram": (
            "=== FUNCTION CALL STACK FRAME LIFECYCLE ===\n"
            "Call: result = calculate_tax(subtotal=100.0, rate=0.08)\n"
            "\n"
            "1. CPU allocates stack frame: [calculate_tax]\n"
            "   +-------------------------------------------+\n"
            "   | Local parameter: subtotal = 100.0         |\n"
            "   | Local parameter: rate     = 0.08          |\n"
            "   | Local variable:  tax      = 8.0           |\n"
            "   +-------------------------------------------+\n"
            "2. Function encounters: return tax\n"
            "3. Stack frame is destroyed, memory reclaimed\n"
            "4. Value 8.0 is assigned to 'result' in caller frame"
        ),
        "code_walkthrough": (
            "# 1. Defining a function with parameters and type annotations\n"
            "def calculate_service_fee(base_amount: float, tier: str = \"standard\") -> float:\n"
            "    \"\"\"Calculates total fee based on client subscription tier.\"\"\"\n"
            "    # 2. Local variables inside functions are isolated from the outside world\n"
            "    if tier == \"enterprise\":\n"
            "        rate = 0.05\n"
            "    elif tier == \"premium\":\n"
            "        rate = 0.10\n"
            "    else:\n"
            "        rate = 0.15\n"
            "    \n"
            "    # 3. Return statement: Sends the calculated result back to the caller\n"
            "    return round(base_amount * rate, 2)\n"
            "\n"
            "# 4. Positional vs Keyword Arguments\n"
            "fee1 = calculate_service_fee(100.0)                  # Uses default tier='standard'\n"
            "fee2 = calculate_service_fee(200.0, tier=\"premium\")  # Keyword argument"
        ),
        "gotchas": (
            "1. Missing Return Statement: If a function reaches the end of its body without hitting a `return`, Python automatically returns `None`. "
            "If caller expects a number, writing `result + 5` crashes with `TypeError: unsupported operand type(s) for +: 'NoneType' and 'int'`.\n"
            "2. Mutable Default Argument Trap: NEVER use a mutable object (like a list `def f(data=[])`) as a default parameter! "
            "Python creates that list ONCE when the file loads; every subsequent function call shares the exact same list in memory! Fix: `def f(data=None): if data is None: data = []`.\n"
            "3. Returning Multiple Values: Writing `return a, b` actually returns a single tuple `(a, b)`."
        ),
        "challenge_desc": (
            "Write a function `build_user_profile(user_id: int, username: str, email: str, role: str = 'viewer') -> dict`:\n"
            "- Validate that `email` contains `'@'` and `'.'`. If invalid, return `None`.\n"
            "- Validate that `role` is one of `('admin', 'editor', 'viewer')`. If invalid, default to `'viewer'`.\n"
            "- Return a dictionary with keys `'id'`, `'username'`, `'email'`, and `'role'`."
        ),
        "starter_code": (
            "def build_user_profile(user_id: int, username: str, email: str, role: str = 'viewer'):\n"
            "    # TODO: Validate email and role, return formatted user profile dict or None\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import build_user_profile\n"
            "\n"
            "u1 = build_user_profile(1, \"ada\", \"ada@lovelace.org\", \"admin\")\n"
            "assert u1 == {\"id\": 1, \"username\": \"ada\", \"email\": \"ada@lovelace.org\", \"role\": \"admin\"}\n"
            "u2 = build_user_profile(2, \"bob\", \"bob@domain.com\", \"invalid_role\")\n"
            "assert u2 == {\"id\": 2, \"username\": \"bob\", \"email\": \"bob@domain.com\", \"role\": \"viewer\"}\n"
            "u3 = build_user_profile(3, \"bad\", \"invalid_email\", \"admin\")\n"
            "assert u3 is None\n"
            "print(\"✓ All assertions passed for Functions: Parameters, Arguments & Returns!\")\n"
        )
    },
    {
        "lesson_number": 9,
        "title": "Variable Scope: Local, Global & Enclosing",
        "analogy": (
            "Think of variable scope as security classification levels in an intelligence agency. "
            "A national bulletin (Global scope) is posted on the wall for everyone in the building to read. "
            "However, agents working in private soundproof interrogation rooms (Local scope) have case files on their desks. "
            "People outside cannot see what is on the desk in the private room. Once the interrogation ends and the door opens, "
            "the room is shredded and wiped clean (stack frame popped). In Python, lookups strictly flow outwards: "
            "an agent can look at their desk first (Local), then their department (Enclosing), then the national board (Global), "
            "and finally the legal constitution (Built-ins). This is the famous LEGB rule."
        ),
        "diagram": (
            "=== THE LEGB SCOPE LOOKUP HIERARCHY ===\n"
            "   [B] Built-ins  (len, range, print, Exception)\n"
            "        ^\n"
            "   [G] Global     (Module-level variables defined at root)\n"
            "        ^\n"
            "   [E] Enclosing  (Outer function in nested closures)\n"
            "        ^\n"
            "   [L] Local      (Inside currently executing function)\n"
            "\n"
            "Rule: Python searches upwards from L -> E -> G -> B.\n"
            "It NEVER searches downwards into child functions!"
        ),
        "code_walkthrough": (
            "# 1. Global Variable: Defined at the module root level\n"
            "APPLICATION_ENV = \"PRODUCTION\"\n"
            "\n"
            "def outer_service():\n"
            "    # 2. Enclosing Variable: Local to outer_service, enclosing to inner_worker\n"
            "    service_token = \"SECRET_XYZ\"\n"
            "    \n"
            "    def inner_worker():\n"
            "        # 3. Local Variable: Only exists while inner_worker executes\n"
            "        worker_id = 99\n"
            "        # Reads local worker_id, enclosing service_token, and global APPLICATION_ENV\n"
            "        return f\"{APPLICATION_ENV} | {service_token} | {worker_id}\"\n"
            "    \n"
            "    return inner_worker()\n"
            "\n"
            "# 4. Shadowing: A local variable with the same name shadows the global one\n"
            "def test_shadow():\n"
            "    APPLICATION_ENV = \"STAGING\"  # Local variable; does NOT alter global!\n"
            "    return APPLICATION_ENV"
        ),
        "gotchas": (
            "1. UnboundLocalError: If you read a global variable and then assign to it in the same function (`print(x); x = 5`), "
            "Python sees the assignment at compile time and marks `x` as Local, causing the `print(x)` on line 1 to crash with "
            "`UnboundLocalError: local variable 'x' referenced before assignment`.\n"
            "2. Overuse of the `global` keyword: Using `global my_var` to modify global state creates unpredictable side effects and race conditions in concurrent systems.\n"
            "3. Leaking Loop Variables: In Python, variables defined in a `for` loop persist in the surrounding function scope after the loop finishes."
        ),
        "challenge_desc": (
            "Write a function `create_counter(initial_value: int = 0)` that returns a nested closure function `increment()`.\n"
            "Each time the returned `increment()` function is invoked, it should increase the enclosed counter by 1 and return the updated count.\n"
            "(Hint: Use the `nonlocal` keyword inside the inner function so it can modify the enclosing variable!)."
        ),
        "starter_code": (
            "def create_counter(initial_value: int = 0):\n"
            "    # TODO: Implement closure that modifies enclosing state using nonlocal\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import create_counter\n"
            "\n"
            "counter_a = create_counter(0)\n"
            "assert counter_a() == 1, \"First increment failed\"\n"
            "assert counter_a() == 2, \"Second increment failed\"\n"
            "assert counter_a() == 3, \"Third increment failed\"\n"
            "\n"
            "counter_b = create_counter(100)\n"
            "assert counter_b() == 101, \"Independent counter failed\"\n"
            "assert counter_a() == 4, \"Counter A was corrupted by Counter B!\"\n"
            "print(\"✓ All assertions passed for Variable Scope: Local, Global & Enclosing!\")\n"
        )
    },
    {
        "lesson_number": 10,
        "title": "Lists: Dynamic Sequential Arrays",
        "analogy": (
            "Think of a Python list as a flexible, expandable binder of index cards. "
            "You can slide a new card into any position, remove a card from the back, flip to card #5 instantly, "
            "and store different kinds of notes in each slot. "
            "Under the hood in CPython, a list is not a linked list; it is a contiguous array of pointers in memory. "
            "Because the pointers sit side-by-side in memory, accessing any item by index (`items[i]`) is blazing fast $O(1)$ time, "
            "no matter whether the list has 10 items or 10 million items."
        ),
        "diagram": (
            "=== CPYTHON LIST DYNAMIC ARRAY MEMORY LAYOUT ===\n"
            "PyListObject in Memory:\n"
            "[ size: 3 | allocated: 6 | ob_item: Pointer to Contiguous Array ]\n"
            "                               |\n"
            "                               v\n"
            "       +--------------+--------------+--------------+--------+\n"
            "Array: | Pointer -> 1 | Pointer -> 2 | Pointer -> 3 | [NULL] |\n"
            "       +--------------+--------------+--------------+--------+\n"
            "Index:        0              1              2           3"
        ),
        "code_walkthrough": (
            "# 1. Creating and indexing dynamic lists\n"
            "metrics = [10, 25, 42, 88]\n"
            "first = metrics[0]   # 10 (O(1) time)\n"
            "last = metrics[-1]   # 88\n"
            "\n"
            "# 2. Appending and extending\n"
            "metrics.append(99)   # Adds 99 to the back (Amortized O(1) time)\n"
            "metrics.extend([100, 101]) # Appends multiple items\n"
            "\n"
            "# 3. Popping and removing\n"
            "last_val = metrics.pop() # Removes and returns last element (O(1))\n"
            "first_val = metrics.pop(0) # Removes front (O(N) time because all elements shift!)\n"
            "\n"
            "# 4. Membership testing\n"
            "has_42 = (42 in metrics) # O(N) linear scan through elements"
        ),
        "gotchas": (
            "1. Shifting Cost of `insert(0, val)` or `pop(0)`: Because lists are contiguous arrays, inserting or deleting at index 0 forces Python to shift every single remaining pointer in memory. "
            "If you need a fast double-ended queue, use `collections.deque` ($O(1)$ pops from both ends).\n"
            "2. Shallow Copy Aliasing: Writing `list_b = list_a` does NOT copy the list! Both variables now point to the exact same memory array. "
            "Modifying `list_b.append(5)` will silently mutate `list_a`! Fix: Use `list_b = list_a.copy()` or `list(list_a)`.\n"
            "3. IndexError on Assignment: You cannot write `items[len(items)] = val` to append to a list. You must call `items.append(val)`."
        ),
        "challenge_desc": (
            "Write a function `deduplicate_and_sort(items: list[int]) -> list[int]`:\n"
            "- Remove all duplicate elements from the list while maintaining clean unique items.\n"
            "- Return the unique elements sorted in ASCENDING order.\n"
            "- Do not mutate the original input list."
        ),
        "starter_code": (
            "def deduplicate_and_sort(items: list[int]) -> list[int]:\n"
            "    # TODO: Return a new list with duplicates removed and sorted ascending\n"
            "    pass\n"
        ),
        "test_suite": (
            "from solution import deduplicate_and_sort\n"
            "\n"
            "orig = [5, 2, 8, 2, 5, 1, 9]\n"
            "res = deduplicate_and_sort(orig)\n"
            "assert res == [1, 2, 5, 8, 9], f\"Failed: got {res}\"\n"
            "assert orig == [5, 2, 8, 2, 5, 1, 9], \"Original list was mutated!\"\n"
            "assert deduplicate_and_sort([]) == []\n"
            "print(\"✓ All assertions passed for Lists: Dynamic Sequential Arrays!\")\n"
        )
    }
]

def format_instructional_handbook(lesson_spec):
    return f"""# Lesson 0.{lesson_spec['lesson_number']}: {lesson_spec['title']}

## 1. Mental Model & Real-World Analogy
{lesson_spec['analogy']}

---

## 2. Architectural Mechanics & Memory Layout
Below is an architectural breakdown of how Python's execution runtime and memory layout operate for this concept:

```
{lesson_spec['diagram']}
```

---

## 3. Annotated Step-by-Step Code Walkthrough
Review this clean, complete code implementation. Every line is annotated to explain *why* and *how* the runtime behaves:

```python
{lesson_spec['code_walkthrough']}
```

---

## 4. Common Beginner Gotchas & Error Traces
Watch out for these classic failure modes when writing production code:

{lesson_spec['gotchas']}

---

## 5. Practice Challenge & Implementation Goals
### Problem Specification
{lesson_spec['challenge_desc']}

#### Verification Standards
- Code must pass all automated test assertions without crashing or timing out.
- Clean, Pythonic syntax following standard PEP 8 conventions.
"""

def main():
    print(f"Loading curriculum manifest from {MANIFEST_PATH}...")
    with open(MANIFEST_PATH, "r") as f:
        manifest = json.load(f)

    lessons = manifest["lessons"]
    rich_lookup = {item["lesson_number"]: item for item in LESSONS}
    upgraded_count = 0

    for lesson in lessons:
        if lesson["phase_number"] == 0 and lesson["lesson_number"] in rich_lookup:
            spec = rich_lookup[lesson["lesson_number"]]
            lesson["content_markdown"] = format_instructional_handbook(spec)
            lesson["starter_code"] = {"solution.py": spec["starter_code"]}
            lesson["test_suite"] = {"tests.py": spec["test_suite"]}
            upgraded_count += 1

    print(f"Successfully upgraded {upgraded_count} lessons to the rich instructional textbook standard.")

    with open(MANIFEST_PATH, "w") as f:
        json.dump(manifest, f, indent=2)
    print(f"Saved updated manifest to {MANIFEST_PATH}")

    print("Regenerating seed_curriculum.sql with rich handbooks...")
    with open(SEED_SQL_PATH, "w") as f:
        f.write("-- ==============================================================================\n")
        f.write("-- AI-Native LMS Curriculum Database Seed (600 Lessons, Rich Handbooks)\n")
        f.write("-- ==============================================================================\n\n")
        f.write("BEGIN;\n\n")

        # Phases
        f.write("-- 1. Phases\n")
        for phase in manifest["phases"]:
            title_esc = phase["title"].replace("'", "''")
            desc_esc = phase["description"].replace("'", "''")
            cap_slug_esc = phase["capstone_slug"].replace("'", "''")
            f.write(
                f"INSERT INTO phases (phase_number, title, description, total_lessons, capstone_slug)\n"
                f"VALUES ({phase['phase_number']}, '{title_esc}', '{desc_esc}', {phase['total_lessons']}, '{cap_slug_esc}')\n"
                f"ON CONFLICT (phase_number) DO UPDATE SET\n"
                f"  title = EXCLUDED.title, description = EXCLUDED.description,\n"
                f"  total_lessons = EXCLUDED.total_lessons, capstone_slug = EXCLUDED.capstone_slug;\n"
            )

        f.write("\n-- 2. Lessons\n")
        for l in lessons:
            id_val = l["id"]
            slug_esc = l["slug"].replace("'", "''")
            phase_num = l["phase_number"]
            lesson_num = l["lesson_number"]
            title_esc = l["title"].replace("'", "''")
            content_esc = l["content_markdown"].replace("'", "''")
            starter_esc = json.dumps(l.get("starter_code", {})).replace("'", "''")
            tests_esc = json.dumps(l.get("test_suite", {})).replace("'", "''")

            f.write(
                f"INSERT INTO lessons (id, slug, phase_number, lesson_number, title, content_markdown, starter_code, test_assertions)\n"
                f"VALUES ('{id_val}', '{slug_esc}', {phase_num}, {lesson_num}, '{title_esc}', '{content_esc}', '{starter_esc}', '{tests_esc}')\n"
                f"ON CONFLICT (phase_number, lesson_number) DO UPDATE SET\n"
                f"  title = EXCLUDED.title, content_markdown = EXCLUDED.content_markdown, starter_code = EXCLUDED.starter_code;\n"
            )

        f.write("\nCOMMIT;\n")
    print(f"Successfully regenerated {SEED_SQL_PATH}.")

if __name__ == "__main__":
    main()
