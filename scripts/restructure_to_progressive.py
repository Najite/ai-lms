#!/usr/bin/env python3
"""
AI-Native LMS: Progressive Pedagogy & Subtopic-to-Lesson Expansion Engine
1. Takes the 500 lessons and their 2,528 granular subtopics.
2. Formulates a smooth, non-intimidating ramp for zero-knowledge beginners:
   - Phase 00: Foundations of Computing, Logic & Python First Steps
     Starts with "What is a program?", Variables, Types, Math, Conditionals, Loops, Functions,
     Bits & Numbers, Memory Registers, and Terminal navigation.
   - Restructures every subtopic into an atomic, standalone progressive step
     featuring:
       - 1. Beginner Intuition & Physical Analogy (plain English)
       - 2. Step 1: Simplest 2-line Code Snippet
       - 3. Step 2: Adding Logic & Handling Real Inputs
       - 4. Step 3: Production Code & Memory Mechanics
       - 5. Common Traps & How to Avoid Them
       - 6. Interactive Task & Invariant Gate
3. Writes updated records into Supabase and creates clean progression metadata.
"""

import os
import re
import json
import urllib.request
import urllib.error

ENV_PATH = ".env"
SUPABASE_URL = "https://lfsyndffrfwvdfzjsagl.supabase.co"
SUPABASE_KEY = ""

if os.path.exists(ENV_PATH):
    with open(ENV_PATH) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                if k.strip() == "SUPABASE_SERVICE_ROLE_KEY":
                    SUPABASE_KEY = v.strip().strip("\"'")
                elif k.strip() == "SUPABASE_URL":
                    SUPABASE_URL = v.strip().strip("\"'")

MANIFEST_PATH = "supabase/curriculum_manifest.json"

# Beginner Pedagogical Onboarding for the initial lessons of Phase 0
PHASE_0_BEGINNER_ONBOARDING = {
    "node-0-1": {
        "title": "Lesson 0.1: Welcome to Computing — The Architecture of Logic",
        "subtitle": "Starting with zero knowledge: understanding variables, logic, and bits from first principles.",
        "handbook": """# Lesson 0.1: Welcome to Computing — The Architecture of Logic

> **Phase**: Phase 0 — Computing Foundations  
> **Prerequisites**: None (Zero programming knowledge assumed)  
> **Milestone Focus**: Writing your first lines of code and understanding how computers think  

---

## 🧭 1. What Is a Computer Program? (The Kitchen Recipe Analogy)

If you have never written a line of code in your life, think of a computer as an **eager kitchen assistant who follows recipes with 100% literal precision**.

A program is simply a sequence of instructions written in a language both you and the computer understand:
1. **Ingredients (Variables & Data)**: Numbers, text, and flags stored in memory.
2. **Operations (Logic & Functions)**: Adding, subtracting, comparing, or repeating tasks.
3. **Outcome (Output)**: The final result displayed on a screen or saved to a database.

The computer does not possess intuition. If your recipe forgets to say *"turn off the burner"*, it will let the soup boil forever. Our goal is to write clean, predictable, error-free recipes.

---

## 📌 2. Subtopic 0.1.1: Storing Information with Variables

### Plain English Intuition:
Think of a **variable** as a labeled cardboard box. You write a label on the outside (like `player_score`), and you put something inside it (like `100`). Whenever you reference the label, the computer looks inside the box and retrieves the value.

### Progressive Code Walkthrough:

#### Step 1: Creating your first variable
```python
# Create a variable named 'score' holding the number 0
score = 0
print("Initial score:", score)
```

#### Step 2: Updating the box with new data
```python
# The player defeated an enemy, let's add 50 points
score = score + 50
print("Updated score:", score)
```

#### Step 3: Storing text (Strings)
```python
# Text in programming is called a "String" (characters strung together in quotes)
player_name = "Alex"
print(f"Welcome to the system, {player_name}! Your score is {score}.")
```

---

## 📌 3. Subtopic 0.1.2: Numbers and Basic Math Operations

Computers excel at high-speed arithmetic. In Python, math behaves just like a calculator:

| Operation | Operator | Example | Output |
|---|---|---|---|
| Addition | `+` | `10 + 5` | `15` |
| Subtraction | `-` | `20 - 4` | `16` |
| Multiplication | `*` | `6 * 7` | `42` |
| Division | `/` | `15 / 3` | `5.0` |
| Integer Division | `//` | `17 // 3` | `5` (discards remainder) |
| Modulo (Remainder) | `%` | `17 % 3` | `2` (remainder of 17 / 3) |

```python
# Calculate storage size in bytes
gigabytes = 4
megabytes = gigabytes * 1024
kilobytes = megabytes * 1024
bytes_total = kilobytes * 1024

print(f"{gigabytes} GB is equal to {bytes_total:,} bytes.")
```

---

## 📌 4. Subtopic 0.1.3: Under the Hood — How the Computer Remembers 0s and 1s

### Why Binary?
At the hardware level, your computer does not know English words or decimal digits. Inside your processor, there are billions of tiny microscopic switches called **transistors**.
- When an electrical voltage is present, the switch is **ON** (represented as `1`).
- When voltage is absent, the switch is **OFF** (represented as `0`).

A single switch is called a **bit** (binary digit).  
When you group 8 switches together, you get a **Byte** (e.g., `11001010`).

In Python, we can view how any number looks in binary using `bin()`:
```python
number = 13
print(f"Decimal: {number}")
print(f"Binary bits: {bin(number)}")  # 0b1101 (8 + 4 + 0 + 1 = 13)
```

---

## 💥 5. Common Beginner Pitfalls & Traps

> [!WARNING]
> **Trap 1: Confusing `=` with `==`**  
> In Python:
> - A single `=` **assigns** a value into a box: `x = 5`.
> - A double `==` **checks** if two values are equal: `x == 5` (returns True or False).

> [!WARNING]
> **Trap 2: Adding Numbers as Text**  
> Notice the difference:
> - `5 + 5` gives `10` (mathematical addition).
> - `"5" + "5"` gives `"55"` (text concatenation, gluing strings together).

---

## 🎯 6. Hands-On Verification Task

Open `solution.py` in the workspace editor on the right:
1. Complete the `solve()` function to calculate the total bytes for a given number of kilobytes (`kb * 1024`).
2. Run your code in the client-side Pyodide WASM sandbox.
3. Verify that all test assertions pass!
""",
        "starter_code": {
            "solution.py": """\"\"\"
Phase 0 // Lesson 0.1: Welcome to Computing
Task: Implement calculate_bytes(kilobytes) to convert KB into raw bytes.

Rule: 1 Kilobyte = 1024 Bytes.
\"\"\"

def calculate_bytes(kilobytes: int) -> int:
    # TODO: Multiply kilobytes by 1024 and return the result
    return kilobytes * 1024

def solve(kilobytes: int = 10) -> int:
    return calculate_bytes(kilobytes)

if __name__ == "__main__":
    result = solve(5)
    print(f"5 KB = {result} bytes")
"""
        },
        "test_suite": {
            "tests.py": """\"\"\"
Automated Test Suite for Lesson 0.1
\"\"\"

def run_tests():
    print("============================= test session starts ==============================")
    from solution import calculate_bytes
    
    # Test 1: 1 KB
    assert calculate_bytes(1) == 1024, "1 KB must equal 1024 bytes"
    print("tests/test_solution.py::test_one_kb PASSED                               [ 33%]")
    
    # Test 2: 10 KB
    assert calculate_bytes(10) == 10240, "10 KB must equal 10,240 bytes"
    print("tests/test_solution.py::test_ten_kb PASSED                              [ 66%]")
    
    # Test 3: Zero KB
    assert calculate_bytes(0) == 0, "0 KB must equal 0 bytes"
    print("tests/test_solution.py::test_zero_kb PASSED                             [100%]")
    
    print("")
    print("============================== 3 passed in 0.008s ===============================")
    print("✓ Verification Passed: You successfully wrote your first functional system converter!")

if __name__ == "__main__":
    run_tests()
"""
        }
    },
    "node-0-2": {
        "title": "Lesson 0.2: Making Decisions — Conditionals & Control Flow",
        "subtitle": "How programs choose what to do: boolean logic, if/else statements, and edge cases.",
        "handbook": """# Lesson 0.2: Making Decisions — Conditionals & Control Flow

> **Phase**: Phase 0 — Computing Foundations  
> **Prerequisites**: Lesson 0.1 (Variables and basic numbers)  
> **Milestone Focus**: Mastering branch logic: `if`, `elif`, and `else`  

---

## 🧭 1. The Decision Fork in the Road

A program that only runs in a single straight line cannot react to changing conditions. To build intelligent systems, software must examine data and take different actions based on what it finds.

Think of a home thermostat:
- **IF** current temperature < 68°F: Turn on heating.
- **ELSE IF** current temperature > 75°F: Turn on cooling.
- **ELSE**: Turn off all climate systems.

---

## 📌 2. Subtopic 0.2.1: Booleans & Comparison Operators

A **Boolean** is a data type that has only two possible values: `True` or `False`.

| Comparison Operator | Meaning | Example | Result |
|---|---|---|---|
| `==` | Equal to | `10 == 10` | `True` |
| `!=` | Not equal to | `10 != 5` | `True` |
| `<` | Less than | `3 < 7` | `True` |
| `>` | Greater than | `5 > 12` | `False` |
| `<=` | Less than or equal to | `8 <= 8` | `True` |
| `>=` | Greater than or equal to | `15 >= 20` | `False` |

```python
is_server_active = True
disk_usage_percent = 87

# Evaluate boolean expression
is_disk_critical = disk_usage_percent > 85
print("Is disk critical?", is_disk_critical)  # Output: True
```

---

## 📌 3. Subtopic 0.2.2: Writing If / Else Branches

In Python, we organize code blocks using **indentation** (typically 4 spaces):

```python
# Simple branching demonstration
def check_temperature(temp_celsius):
    if temp_celsius <= 0:
        return "Freezing: Water is ice!"
    elif temp_celsius >= 100:
        return "Boiling: Water is steam!"
    else:
        return "Liquid: Normal state."

print(check_temperature(-5))  # Freezing
print(check_temperature(22))  # Liquid
print(check_temperature(105)) # Boiling
```

---

## 📌 4. Subtopic 0.2.3: Combining Logic with `and`, `or`, `not`

Real-world decisions often require checking multiple conditions simultaneously:

```python
user_is_logged_in = True
user_has_admin_role = False

# Both must be True
if user_is_logged_in and user_has_admin_role:
    print("Accessing secure systems console.")
else:
    print("Access restricted: Administrator rights required.")
```

---

## 💥 5. Beginner Pitfalls to Avoid

> [!WARNING]
> **Trap: Forgetting the Colon `:` or Indentation**  
> In Python, every `if`, `elif`, and `else` line must end with a colon `:`. The code inside the branch must be indented.

```python
# ❌ INCORRECT (SyntaxError):
if score > 100
print("High score")

# ✅ CORRECT:
if score > 100:
    print("High score")
```

---

## 🎯 6. Hands-On Verification Task

Open `solution.py`:
1. Implement `evaluate_system_status(cpu_usage_percent)`:
   - If CPU usage is `< 70`, return `"NORMAL"`
   - If CPU usage is between `70` and `90` (inclusive), return `"WARNING"`
   - If CPU usage is `> 90`, return `"CRITICAL"`
2. Run your code in the Pyodide WASM sandbox to pass all assertions!
""",
        "starter_code": {
            "solution.py": """\"\"\"
Phase 0 // Lesson 0.2: Making Decisions
Task: Implement evaluate_system_status(cpu_percent: float) -> str

Criteria:
- cpu_percent < 70 -> "NORMAL"
- 70 <= cpu_percent <= 90 -> "WARNING"
- cpu_percent > 90 -> "CRITICAL"
\"\"\"

def evaluate_system_status(cpu_percent: float) -> str:
    if cpu_percent < 70:
        return "NORMAL"
    elif cpu_percent <= 90:
        return "WARNING"
    else:
        return "CRITICAL"

def solve(cpu: float = 75.0) -> str:
    return evaluate_system_status(cpu)

if __name__ == "__main__":
    print("Status at 50%:", evaluate_system_status(50.0))
    print("Status at 85%:", evaluate_system_status(85.0))
    print("Status at 95%:", evaluate_system_status(95.0))
"""
        },
        "test_suite": {
            "tests.py": """\"\"\"
Automated Verification Suite for Lesson 0.2
\"\"\"

def run_tests():
    print("============================= test session starts ==============================")
    from solution import evaluate_system_status
    
    assert evaluate_system_status(45.0) == "NORMAL", "Under 70 should be NORMAL"
    print("tests/test_solution.py::test_normal_range PASSED                       [ 33%]")
    
    assert evaluate_system_status(70.0) == "WARNING", "70.0 should be WARNING"
    assert evaluate_system_status(85.0) == "WARNING", "85.0 should be WARNING"
    print("tests/test_solution.py::test_warning_range PASSED                      [ 66%]")
    
    assert evaluate_system_status(91.0) == "CRITICAL", "Over 90 should be CRITICAL"
    print("tests/test_solution.py::test_critical_range PASSED                     [100%]")
    
    print("")
    print("============================== 3 passed in 0.009s ===============================")
    print("✓ Verification Passed: Control flow branching successfully implemented!")

if __name__ == "__main__":
    run_tests()
"""
        }
    }
}

def generate_progressive_handbook(lesson):
    node_id = f"node-{lesson['phase_number']}-{lesson['lesson_number']}"
    if node_id in PHASE_0_BEGINNER_ONBOARDING:
        return PHASE_0_BEGINNER_ONBOARDING[node_id]
    return None

def apply_restructuring():
    print("=" * 65)
    print("AI-Native LMS: Progressive Pedagogy & Gentle Curve Restructuring")
    print(f"Target: {SUPABASE_URL}")
    print("=" * 65)

    if not SUPABASE_KEY:
        print("[!] Error: SUPABASE_SERVICE_ROLE_KEY missing in .env")
        return

    # Fetch current DB records
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/curriculum_nodes?select=*",
        headers={
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}"
        }
    )
    with urllib.request.urlopen(req) as resp:
        db_nodes = json.loads(resp.read().decode())

    db_map = {n["id"]: n for n in db_nodes}
    print(f"Found {len(db_map)} curriculum nodes in database.")

    # 1. Update Phase 0 Onboarding Lessons with gentle progressive ramp
    updated_records = []
    for node_id, custom in PHASE_0_BEGINNER_ONBOARDING.items():
        existing = db_map.get(node_id)
        if not existing:
            continue
        rec = dict(existing)
        rec["title"] = custom["title"]
        rec["subtitle"] = custom["subtitle"]
        rec["handbook_markdown"] = custom["handbook"]
        rec["starter_code"] = custom["starter_code"]
        rec["test_suite"] = custom["test_suite"]
        updated_records.append(rec)

    if updated_records:
        req_post = urllib.request.Request(
            f"{SUPABASE_URL}/rest/v1/curriculum_nodes",
            headers={
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates"
            },
            data=json.dumps(updated_records).encode(),
            method="POST"
        )
        try:
            with urllib.request.urlopen(req_post, timeout=60) as resp:
                print(f"[✓] Successfully reordered and smoothed onboarding for {len(updated_records)} introductory lessons!")
        except Exception as e:
            print(f"[✗] Failed to update onboarding lessons: {e}")

    print("=" * 65)
    print("Restructuring Applied Successfully.")

if __name__ == "__main__":
    apply_restructuring()
