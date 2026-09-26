#!/usr/bin/env python3
"""
Patch script for Module 2, Lessons 2.36 through 2.50 (node-1-36 to node-1-50).
Applies:
- High-density real-world engineering handbooks with physical mental models.
- 3-part exercise briefings (exercise_about, exercise_goal, expected_output outside code).
- Clean starter code with guided # TODOs.
- Strict unit tests in test_suite['tests.py'].
"""

import os
import json
import urllib.request
import ssl

ENV_PATH = "/home/sawacha/lms/.env"
API_KEY = None
SUPABASE_URL = None

if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r") as f:
        for line in f:
            line = line.strip()
            if line.startswith("#") or "=" not in line:
                continue
            k, v = line.split("=", 1)
            k, v = k.strip(), v.strip().strip("'").strip('"')
            if k == "SUPABASE_SERVICE_ROLE_KEY" and not API_KEY:
                API_KEY = v
            elif k == "SUPABASE_ANON_KEY" and not API_KEY:
                API_KEY = v
            elif k == "NEXT_PUBLIC_SUPABASE_URL" and not SUPABASE_URL:
                SUPABASE_URL = v
            elif k == "SUPABASE_URL" and not SUPABASE_URL:
                SUPABASE_URL = v

if not API_KEY or not SUPABASE_URL:
    raise RuntimeError("Missing Supabase credentials")

LESSONS_2_36_TO_50 = {
    # --------------------------------------------------------------------------
    # 2.36: Parametrized Testing & Test Matrices
    # --------------------------------------------------------------------------
    "node-1-36": {
        "title": "Lesson 2.36: Parametrized Testing & Input Matrices",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 36 of 50",
        "cs_foundation": "Test Parameterization, @pytest.mark.parametrize, Test Matrices, and Combinatorial Testing",
        "ai_convergence": "Real-World Engineering: Running Multi-Scenario Discount & Currency Conversion Tests",
        "handbook_markdown": """# Lesson 2.36: Parametrized Testing & Input Matrices

Testing a function with a single input value leaves dozens of edge cases unverified. Copy-pasting 10 separate test functions to test 10 numbers is messy and hard to maintain.

**Parametrized Testing (`@pytest.mark.parametrize`)** allows you to define a table of input scenarios and expected outputs, automatically executing a distinct test case for every row in the matrix.

---

## 💡 The Real-World Mental Model: Automated Tire Pressure Stress Testing

- **Single Test**: Testing a car tire on one sunny afternoon at 70°F.
- **Parametrized Matrix**: Testing the tire in an environmental test chamber across a structured matrix of inputs:
  - `-20°F (Sub-zero snow)` $\to$ Expect Grip $\ge 80\%$
  - `70°F (Dry road)` $\to$ Expect Grip $\ge 95\%$
  - `120°F (Desert heat)` $\to$ Expect Grip $\ge 90\%$

```python
import pytest

@pytest.mark.parametrize("subtotal, tier, expected", [
    (100.0, "standard", 100.0),
    (100.0, "vip", 80.0),
    (100.0, "employee", 50.0),
])
def test_discount_tiers(subtotal, tier, expected):
    assert calculate_tier_price(subtotal, tier) == expected
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the discount evaluator function designed for matrix testing:

1. **`calculate_member_discount(amount: float, membership_level: str) -> float`**:
   - Level `"bronze"`: 5% off (`amount * 0.95`).
   - Level `"silver"`: 10% off (`amount * 0.90`).
   - Level `"gold"`: 20% off (`amount * 0.80`).
   - Any other level: 0% off (`amount * 1.0`).
   - Return `round(final_amount, 2)`.

---

## ⚠️ Common Pitfalls

- **Missing edge cases in test matrix**: Always include edge cases (e.g. `0.0`, negative amounts, unknown membership strings).
""",
        "starter_code": {
            "solution.py": """def calculate_member_discount(amount: float, membership_level: str) -> float:
    \"\"\"
    Calculates discounted price based on membership tier:
    bronze -> 5%, silver -> 10%, gold -> 20%, other -> 0%.
    \"\"\"
    # TODO: Calculate and return discounted price rounded to 2 decimals
    pass
"""
        },
        "test_suite": {
            "exercise_about": "E-commerce promotion engines use parametrized test matrices to verify that loyalty discount tiers apply exact deduction percentages across all customer categories.",
            "exercise_goal": "Implement calculate_member_discount supporting bronze, silver, gold, and standard tiers.",
            "expected_output": "calculate_member_discount(100.0, 'gold') -> 80.00\ncalculate_member_discount(100.0, 'none') -> 100.00",
            "failure_mode": "Incorrect discount percentages or failing on uppercase tier strings.",
            "verification_criteria": "Function returns exact expected price across all matrix tier scenarios.",
            "tests.py": """from solution import calculate_member_discount

def test_parametrized_matrix():
    test_matrix = [
        (100.0, "gold", 80.00),
        (100.0, "silver", 90.00),
        (100.0, "bronze", 95.00),
        (100.0, "guest", 100.00),
        (50.0, "GOLD", 40.00) # Case insensitivity
    ]
    for amount, tier, expected in test_matrix:
        assert calculate_member_discount(amount, tier) == expected, f"Failed for {tier}"

    print("✓ All assertions passed for Lesson 2.36: Parametrized Testing")

if __name__ == '__main__':
    test_parametrized_matrix()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.37: Mocking External APIs with unittest.mock
    # --------------------------------------------------------------------------
    "node-1-37": {
        "title": "Lesson 2.37: Mocking External Services with unittest.mock",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 37 of 50",
        "cs_foundation": "Test Isolation, Mocking & Patching (unittest.mock.Mock, patch), and Simulating Network Failures",
        "ai_convergence": "Real-World Engineering: Simulating Payment Gateway Outages in Unit Tests Without Real Money",
        "handbook_markdown": """# Lesson 2.37: Mocking External Services with unittest.mock

When testing code that calls third-party APIs (like credit card processors or email dispatchers), running real network requests during unit tests is slow, expensive, and fails when Wi-Fi is offline.

Python's built-in **`unittest.mock`** module allows you to replace real external network calls with simulated **Mock objects** that return predetermined test responses instantly.

---

## 💡 The Real-World Mental Model: A Flight Simulator

- **Testing with Real Network**: Putting a student pilot directly into a real $100M commercial jet and cutting engine power in mid-air to test emergency handling.
- **Testing with Mocks**: Placing the pilot into a hydraulic flight simulator cockpit. The simulator recreates the exact cockpit signals, dials, and engine stall errors with 100% fidelity without risking an actual plane.

```python
from unittest.mock import Mock

mock_payment_api = Mock()
mock_payment_api.charge.return_value = {"status": "success", "tx_id": "TX_99"}
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `process_customer_checkout`:

1. **Parameters**: `cart_total: float`, `payment_gateway_mock` (mock object).
2. **Execution**:
   - Call `resp = payment_gateway_mock.charge(cart_total)`.
   - If `resp.get("status") == "approved"`:
     - Return `{"success": True, "transaction_id": resp["transaction_id"]}`.
   - Else:
     - Return `{"success": False, "error": "declined"}`.

---

## ⚠️ Common Pitfalls

- **Over-mocking internal logic**: Only mock external boundary services (network, disk, clock); never mock the internal business logic you are trying to test.
""",
        "starter_code": {
            "solution.py": """def process_customer_checkout(cart_total: float, payment_gateway) -> dict:
    \"\"\"
    Processes checkout by delegating charge to payment_gateway and evaluating response.
    \"\"\"
    # TODO: Call payment_gateway.charge(cart_total) and evaluate approval status
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Payment processing pipelines use mock objects in automated unit tests to simulate credit card approvals and declines without touching live bank APIs.",
            "exercise_goal": "Implement process_customer_checkout delegating to payment gateway mock.",
            "expected_output": "mock_gw = Mock(); mock_gw.charge.return_value = {'status': 'approved', 'transaction_id': 'TX-101'}\nprocess_customer_checkout(50.0, mock_gw) -> {'success': True, 'transaction_id': 'TX-101'}",
            "failure_mode": "Failing to inspect response status or crashing on declined payments.",
            "verification_criteria": "Function interacts with mock gateway and returns clean status dictionary.",
            "tests.py": """from unittest.mock import Mock
from solution import process_customer_checkout

def test_mocking_apis():
    # Success scenario
    mock_gw = Mock()
    mock_gw.charge.return_value = {"status": "approved", "transaction_id": "TX_9921"}

    res = process_customer_checkout(100.0, mock_gw)
    assert res["success"] is True
    assert res["transaction_id"] == "TX_9921"
    mock_gw.charge.assert_called_once_with(100.0)

    # Declined scenario
    mock_fail_gw = Mock()
    mock_fail_gw.charge.return_value = {"status": "declined"}
    res_fail = process_customer_checkout(50.0, mock_fail_gw)
    assert res_fail["success"] is False
    assert res_fail["error"] == "declined"

    print("✓ All assertions passed for Lesson 2.37: Mocking External APIs")

if __name__ == '__main__':
    test_mocking_apis()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.38: Property-Based Testing
    # --------------------------------------------------------------------------
    "node-1-38": {
        "title": "Lesson 2.38: Property-Based Testing & Invariant Verification",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 38 of 50",
        "cs_foundation": "Property-Based Testing, Invariants (Symmetry, Idempotence), and Fuzzing Inputs",
        "ai_convergence": "Real-World Engineering: Verifying Reversible Encoding & Normalization Invariants",
        "handbook_markdown": """# Lesson 2.38: Property-Based Testing & Invariant Verification

Example-based tests check specific hardcoded numbers (e.g. `assert add(2, 3) == 5`). However, humans rarely think of bizarre edge cases (e.g. empty strings, Unicode nulls, extreme floats).

**Property-Based Testing** tests universal mathematical **invariants** across hundreds of randomly generated inputs:
- **Idempotence**: `clean(clean(x)) == clean(x)`.
- **Round-Trip Symmetry**: `decode(encode(x)) == x`.

---

## 💡 The Real-World Mental Model: A Fuzzing Tumbler Machine

- **Standard Test**: Dropping a smartphone onto a soft carpet once from 1 foot high.
- **Property-Based Testing**: Placing the smartphone into an automated steel tumbler that spins and drops it 10,000 times at random angles and temperatures to prove the screen glass never shatters.

```python
# Invariant: encode followed by decode must always return original text
def test_encoding_symmetry(sample_text):
    assert decode(encode(sample_text)) == sample_text
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the reversible obfuscator pair:

1. **`encode_rot13_simple(text: str) -> str`**:
   - Shifts lowercase ASCII letters by 13 positions (wrapping `a-z`).
2. **`verify_rot13_symmetry(samples: list[str]) -> bool`**:
   - For each sample string in `samples`:
     - Computes `encoded = encode_rot13_simple(sample)`.
     - Computes `decoded = encode_rot13_simple(encoded)` (since ROT13 is symmetric).
     - If `decoded != sample`, return `False`.
   - Return `True`.

---

## ⚠️ Common Pitfalls

- **Non-symmetric transformations**: If an encoding step is lossy (e.g. converting to lowercase), round-trip symmetry is broken.
""",
        "starter_code": {
            "solution.py": """def encode_rot13_simple(text: str) -> str:
    \"\"\"Applies symmetric ROT13 character shift to lowercase ASCII letters.\"\"\"
    # TODO: Shift lowercase letters by 13 positions wrapping a-z
    pass


def verify_rot13_symmetry(samples: list[str]) -> bool:
    \"\"\"Verifies property-based symmetry invariant: encode(encode(s)) == s for all samples.\"\"\"
    # TODO: Verify roundtrip symmetry across all sample strings
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Data serialization pipelines use property-based invariant verification to ensure all encoders and decoders maintain 100% roundtrip data fidelity.",
            "exercise_goal": "Implement encode_rot13_simple and verify_rot13_symmetry property checker.",
            "expected_output": "verify_rot13_symmetry(['hello', 'python', 'world']) -> True",
            "failure_mode": "Failing to wrap alphabet correctly or asymmetric decoding.",
            "verification_criteria": "Property checker proves roundtrip invariant holds across diverse sample inputs.",
            "tests.py": """from solution import encode_rot13_simple, verify_rot13_symmetry

def test_property_invariants():
    sample_corpus = ["hello", "system", "architecture", "data", "abcxyz"]
    assert verify_rot13_symmetry(sample_corpus) is True

    # Test single transformation
    assert encode_rot13_simple("abc") == "nop"
    assert encode_rot13_simple("nop") == "abc"

    print("✓ All assertions passed for Lesson 2.38: Property-Based Testing")

if __name__ == '__main__':
    test_property_invariants()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.39: Test-Driven Development (TDD)
    # --------------------------------------------------------------------------
    "node-1-39": {
        "title": "Lesson 2.39: Test-Driven Development (TDD) Red-Green-Refactor",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 39 of 50",
        "cs_foundation": "Test-Driven Development (TDD), Red-Green-Refactor Cycle, and Writing Minimal Implementations",
        "ai_convergence": "Real-World Engineering: Designing Resilient String Tokenizers via TDD Cycles",
        "handbook_markdown": """# Lesson 2.39: Test-Driven Development (TDD)

**Test-Driven Development (TDD)** is an engineering discipline where you write the automated test **before** writing any implementation code.

TDD follows the strict **Red-Green-Refactor cycle**:
1. 🔴 **Red**: Write a failing test for the next small feature.
2. 🟢 **Green**: Write the minimal code required to pass the test.
3. 🔵 **Refactor**: Clean up and optimize the code while keeping all tests passing.

---

## 💡 The Real-World Mental Model: Pre-Drilled Precision Peg Holes

- **Code-First**: Hand-carving a wooden peg and hoping it fits into an unknown wall hole later.
- **TDD (Test-First)**: First drilling a precision 10mm template hole (**The Test**). Then carving the wooden peg until it snaps into the hole with micrometer precision (**The Implementation**).

```
1. Write failing test ──► 2. Write minimal fix ──► 3. Clean & Refactor
         ▲                                                 │
         └─────────────────── Repeat Cycle ────────────────┘
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `SlugGenerator` class following TDD specifications:

1. **`class SlugGenerator`**:
   - `def create_slug(self, raw_title: str) -> str`:
     - Strips leading/trailing whitespace.
     - Converts to lowercase.
     - Replaces spaces and non-alphanumeric characters with hyphens `-`.
     - Removes consecutive duplicate hyphens (`--` $\to$ `-`).
     - Strips leading/trailing hyphens.

---

## ⚠️ Common Pitfalls

- **Writing more code than the test requires**: In TDD, write only enough code to turn the current failing test green.
""",
        "starter_code": {
            "solution.py": """import re

class SlugGenerator:
    \"\"\"Generates clean, URL-safe slug strings from raw titles.\"\"\"
    def create_slug(self, raw_title: str) -> str:
        # TODO: Implement clean URL slug transformation (lowercase, hyphen-separated, deduplicated)
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Content management routing systems use TDD-developed slug generators to convert arbitrary article titles into clean, URL-safe endpoint slugs.",
            "exercise_goal": "Implement SlugGenerator.create_slug following TDD edge case requirements.",
            "expected_output": "SlugGenerator().create_slug('  Hello World! (2026)  ') -> 'hello-world-2026'",
            "failure_mode": "Leaving consecutive hyphens or trailing hyphens in output.",
            "verification_criteria": "Slug generator satisfies all automated test cases cleanly.",
            "tests.py": """from solution import SlugGenerator

def test_tdd_slug_generator():
    slugger = SlugGenerator()
    assert slugger.create_slug("Python 101 Basics") == "python-101-basics"
    assert slugger.create_slug("  Architecture & Design!  ") == "architecture-design"
    assert slugger.create_slug("Special---Characters???") == "special-characters"

    print("✓ All assertions passed for Lesson 2.39: Test-Driven Development (TDD)")

if __name__ == '__main__':
    test_tdd_slug_generator()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.40: Code Coverage & Branch Testing
    # --------------------------------------------------------------------------
    "node-1-40": {
        "title": "Lesson 2.40: Code Coverage & Branch Testing",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 40 of 50",
        "cs_foundation": "Line Coverage vs Branch Coverage, Uncovered Code Paths, and pytest-cov",
        "ai_convergence": "Real-World Engineering: Ensuring 100% Branch Coverage on Critical Safety Valves",
        "handbook_markdown": """# Lesson 2.40: Code Coverage & Branch Testing

**Code Coverage** measures the percentage of your source code executed during automated test runs.

However, 100% *line coverage* is misleading if you miss **Branch Coverage**: testing both the `True` and `False` paths of every conditional `if` branch.

---

## 💡 The Real-World Mental Model: A Highway Network Inspection

- **Line Coverage**: Driving down the main highway once. You touched the asphalt, but you never checked the emergency exit ramps or runaway truck lanes.
- **Branch Coverage**: Inspecting every single off-ramp, detour sign, and emergency pullout lane under both day and night conditions.

```python
def check_safety_valve(pressure: float, is_emergency: bool) -> str:
    if pressure > 100.0 or is_emergency:
        return "VENT_OPEN"
    return "VENT_CLOSED"
# Requires testing 4 combinations: (High/True), (High/False), (Low/True), (Low/False)!
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the branch-guarded safety controller:

1. **`evaluate_safety_valve(pressure: float, is_emergency: bool, manual_override: bool = False) -> str`**:
   - If `manual_override is True`: return `"MANUAL_OVERRIDE"`.
   - If `pressure >= 100.0` or `is_emergency is True`: return `"VENT_OPEN"`.
   - Otherwise: return `"VENT_CLOSED"`.

---

## ⚠️ Common Pitfalls

- **Testing only the happy path**: Always test every boolean combination of `and` / `or` compound conditionals.
""",
        "starter_code": {
            "solution.py": """def evaluate_safety_valve(pressure: float, is_emergency: bool, manual_override: bool = False) -> str:
    \"\"\"
    Evaluates industrial safety valve state across all operational branches.
    \"\"\"
    # TODO: Evaluate branches: manual_override, pressure >= 100.0 or is_emergency, else VENT_CLOSED
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Industrial control systems require 100% branch coverage across all emergency trigger conditionals to guarantee valve response under pressure.",
            "exercise_goal": "Implement evaluate_safety_valve covering all branch conditions.",
            "expected_output": "evaluate_safety_valve(105.0, False) -> 'VENT_OPEN'\nevaluate_safety_valve(50.0, False, manual_override=True) -> 'MANUAL_OVERRIDE'",
            "failure_mode": "Missing branch checks or incorrect evaluation priority.",
            "verification_criteria": "Function returns correct status across all branch combinations.",
            "tests.py": """from solution import evaluate_safety_valve

def test_branch_coverage():
    # Branch 1: Manual override
    assert evaluate_safety_valve(50.0, False, manual_override=True) == "MANUAL_OVERRIDE"
    assert evaluate_safety_valve(150.0, True, manual_override=True) == "MANUAL_OVERRIDE"

    # Branch 2: High pressure
    assert evaluate_safety_valve(100.0, False) == "VENT_OPEN"
    assert evaluate_safety_valve(120.0, False) == "VENT_OPEN"

    # Branch 3: Emergency flag
    assert evaluate_safety_valve(40.0, True) == "VENT_OPEN"

    # Branch 4: Normal operation
    assert evaluate_safety_valve(80.0, False) == "VENT_CLOSED"

    print("✓ All assertions passed for Lesson 2.40: Code Coverage & Branch Testing")

if __name__ == '__main__':
    test_branch_coverage()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.41: Integration Testing & Subsystem Handshakes
    # --------------------------------------------------------------------------
    "node-1-41": {
        "title": "Lesson 2.41: Integration Testing & Subsystem Handshakes",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 41 of 50",
        "cs_foundation": "Unit Testing vs Integration Testing, Subsystem Wiring, and State Persistence Checks",
        "ai_convergence": "Real-World Engineering: Verifying Complete Checkout $\\to$ Inventory $\\to$ Ledger Workflows",
        "handbook_markdown": """# Lesson 2.41: Integration Testing & Subsystem Handshakes

While unit tests prove that individual functions work in isolation, **Integration Tests** verify that multiple components work together properly when wired into a real system workflow.

An integration test tests the complete path: submitting an order $\\to$ deducting stock $\\to$ updating user balance $\\to$ emitting an audit event.

---

## 💡 The Real-World Mental Model: Space Rocket Stage Separation

- **Unit Test**: Firing Rocket Engine A on a test stand in the desert. It works. Firing Engine B in a factory. It works.
- **Integration Test**: Fastening Stage A and Stage B together and verifying the physical explosive bolt separation and electronic telemetry handshakes succeed in sequence.

```
[Order Endpoint] ──► [Inventory Service] ──► [Billing Ledger]
        │                     │                     │
        └───────────── Integrated Workflow ─────────┘
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the integrated workflow:

1. **`InventoryStore`**:
   - `__init__(self, stock: int = 10)`: `self.stock = stock`.
   - `deduct(self, qty: int) -> bool`: If `self.stock >= qty`, deducts and returns `True`, else `False`.
2. **`BillingLedger`**:
   - `__init__(self)`: `self.transactions = []`.
   - `record_charge(self, user: str, amount: float) -> None`: Appends `{"user": user, "amount": amount}` to `self.transactions`.
3. **`IntegratedCheckoutPipeline`**:
   - `__init__(self, inventory: InventoryStore, ledger: BillingLedger)`: stores components.
   - `execute_purchase(self, user: str, qty: int, price_per_unit: float) -> bool`:
     - If `self.inventory.deduct(qty)` succeeds:
       - Calls `self.ledger.record_charge(user, round(qty * price_per_unit, 2))`.
       - Returns `True`.
     - Else returns `False`.

---

## ⚠️ Common Pitfalls

- **Failing to check intermediate failure states**: If inventory deduction fails, no billing record should be written.
""",
        "starter_code": {
            "solution.py": """class InventoryStore:
    def __init__(self, stock: int = 10):
        self.stock = stock

    def deduct(self, qty: int) -> bool:
        # TODO: Deduct qty if available and return True, else False
        pass


class BillingLedger:
    def __init__(self):
        self.transactions = []

    def record_charge(self, user: str, amount: float) -> None:
        # TODO: Append transaction dict to self.transactions
        pass


class IntegratedCheckoutPipeline:
    def __init__(self, inventory: InventoryStore, ledger: BillingLedger):
        # TODO: Store inventory and ledger dependencies
        pass

    def execute_purchase(self, user: str, qty: int, price_per_unit: float) -> bool:
        # TODO: Deduct inventory, record charge if successful, and return True/False
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Integration testing harnesses verify that checkout pipelines coordinate inventory deduction and ledger charges without state corruption.",
            "exercise_goal": "Implement IntegratedCheckoutPipeline wiring InventoryStore and BillingLedger.",
            "expected_output": "pipe = IntegratedCheckoutPipeline(InventoryStore(5), BillingLedger())\npipe.execute_purchase('Alice', 2, 10.0) -> True",
            "failure_mode": "Recording charges when inventory is out of stock.",
            "verification_criteria": "Pipeline coordinates subsystems properly across successful and failed transactions.",
            "tests.py": """from solution import InventoryStore, BillingLedger, IntegratedCheckoutPipeline

def test_integration_pipeline():
    inventory = InventoryStore(stock=5)
    ledger = BillingLedger()
    pipeline = IntegratedCheckoutPipeline(inventory, ledger)

    # Successful purchase
    assert pipeline.execute_purchase("Alice", 2, 20.00) is True
    assert inventory.stock == 3
    assert len(ledger.transactions) == 1
    assert ledger.transactions[0] == {"user": "Alice", "amount": 40.00}

    # Insufficient stock purchase
    assert pipeline.execute_purchase("Bob", 10, 20.00) is False
    assert inventory.stock == 3 # Stock unchanged!
    assert len(ledger.transactions) == 1 # No charge recorded!

    print("✓ All assertions passed for Lesson 2.41: Integration Testing")

if __name__ == '__main__':
    test_integration_pipeline()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.42: Test Architecture & Conftest
    # --------------------------------------------------------------------------
    "node-1-42": {
        "title": "Lesson 2.42: Test Architecture & Global Conftest Scopes",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 42 of 50",
        "cs_foundation": "Test Architecture, conftest.py, Fixture Scopes (function, module, session), and Autouse",
        "ai_convergence": "Real-World Engineering: Structuring Enterprise Pytest Suites with Shared Root Fixtures",
        "handbook_markdown": """# Lesson 2.42: Test Architecture & Global Conftest

In large software projects with hundreds of test files, sharing common test configuration and database fixtures across directory hierarchies is handled by **`conftest.py`**.

Pytest automatically discovers `conftest.py` files in root and subdirectories, injecting shared fixtures across all test files without requiring explicit import statements.

---

## 💡 The Real-World Mental Model: Central City Water Supply vs Private Wells

- **Without `conftest.py`**: Every single house having to dig its own private 500-foot well in the front yard.
- **With `conftest.py`**: A shared central municipal water purification plant. Every house in the neighborhood simply turns on their tap and receives clean, sterilized water instantly.

```
tests/
   ├── conftest.py          # Shared root fixtures (e.g. mock DB pool)
   ├── unit/
   │     └── test_auth.py   # Automatically uses root fixtures!
   └── integration/
         └── test_orders.py # Automatically uses root fixtures!
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement shared test configuration registry helpers:

1. **`class GlobalTestContext`**:
   - `_environment = "test"`
   - `_active_fixtures = {}`
   - `@classmethod def register_fixture(cls, name: str, value)`: Stores `cls._active_fixtures[name] = value`.
   - `@classmethod def get_fixture(cls, name: str)`: Returns `cls._active_fixtures.get(name)`.
   - `@classmethod def clear(cls)`: Clears `cls._active_fixtures.clear()`.

---

## ⚠️ Common Pitfalls

- **Never import from `conftest.py` directly**: Pytest automatically discovers it. Explicitly importing `from conftest import ...` causes duplicate plugin warnings.
""",
        "starter_code": {
            "solution.py": """class GlobalTestContext:
    \"\"\"Shared global test context simulating pytest root conftest registry.\"\"\"
    _active_fixtures = {}

    @classmethod
    def register_fixture(cls, name: str, value):
        # TODO: Store fixture in _active_fixtures
        pass

    @classmethod
    def get_fixture(cls, name: str):
        # TODO: Return fixture value from _active_fixtures
        pass

    @classmethod
    def clear(cls):
        # TODO: Clear _active_fixtures
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Test infrastructure frameworks use centralized fixture registries to share database clients and environment flags across multi-file test suites.",
            "exercise_goal": "Implement GlobalTestContext fixture registry methods.",
            "expected_output": "GlobalTestContext.register_fixture('db', 'mock_db')\nGlobalTestContext.get_fixture('db') -> 'mock_db'",
            "failure_mode": "Failing to store or retrieve registered fixtures.",
            "verification_criteria": "Registry correctly manages shared test fixture bindings.",
            "tests.py": """from solution import GlobalTestContext

def test_conftest_architecture():
    GlobalTestContext.clear()
    GlobalTestContext.register_fixture("db_client", {"host": "localhost", "port": 5432})
    GlobalTestContext.register_fixture("auth_token", "Bearer test_token")

    assert GlobalTestContext.get_fixture("db_client")["port"] == 5432
    assert GlobalTestContext.get_fixture("auth_token") == "Bearer test_token"

    GlobalTestContext.clear()
    assert GlobalTestContext.get_fixture("db_client") is None

    print("✓ All assertions passed for Lesson 2.42: Test Architecture & Conftest")

if __name__ == '__main__':
    test_conftest_architecture()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.43: LLM Provider Abstractions
    # --------------------------------------------------------------------------
    "node-1-43": {
        "title": "Lesson 2.43: Multi-Provider LLM Client Abstractions",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 43 of 50",
        "cs_foundation": "Provider Abstraction Layer, Standardized Request/Response Contracts, and Unified Errors",
        "ai_convergence": "Real-World Engineering: Architecting Vendor-Agnostic LLM Client Gateways",
        "handbook_markdown": """# Lesson 2.43: Multi-Provider LLM Client Abstractions

Different LLM providers (OpenAI, Anthropic, Google Gemini, local Ollama) use completely different JSON payload formats and SDK method signatures.

Building a **Provider Abstraction Layer** creates a unified internal interface (`generate_completion(prompt, max_tokens)`) that translates your app's standard contract to any external provider.

---

## 💡 The Real-World Mental Model: Universal Television Remote Controls

- **Without Abstraction**: Having 5 distinct remote controls on your coffee table with different button shapes for volume, power, and input.
- **Universal Remote (Abstraction)**: One sleek remote control with standard buttons. Pressing `Power` sends the exact signal needed regardless of whether the TV is Sony, LG, or Samsung.

```
Application Logic ──► [Unified LLM Gateway]
                              │
               Translates to provider SDKs
                              ▼
            ├── OpenAIProvider (messages, temperature)
            └── AnthropicProvider (prompt, max_tokens_to_sample)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the unified model gateway adapter:

1. **`class UnifiedModelGateway`**:
   - `def __init__(self, provider_name: str)`: stores `self.provider = provider_name.lower()`.
   - `def format_payload(self, prompt: str, max_tokens: int = 100) -> dict`:
     - If `self.provider == "openai"`:
       - Returns `{"model": "gpt-4o", "messages": [{"role": "user", "content": prompt}], "max_tokens": max_tokens}`.
     - Else (defaulting to `"anthropic"`):
       - Returns `{"model": "claude-3-5-sonnet", "prompt": prompt, "max_tokens_to_sample": max_tokens}`.

---

## ⚠️ Common Pitfalls

- **Leaking vendor-specific terminology into the gateway interface**: The public gateway method should use generic names like `prompt` and `max_tokens`.
""",
        "starter_code": {
            "solution.py": """class UnifiedModelGateway:
    \"\"\"
    Translates standard prompt requests into provider-specific API payloads.
    \"\"\"
    def __init__(self, provider_name: str):
        # TODO: Store provider name normalized
        pass

    def format_payload(self, prompt: str, max_tokens: int = 100) -> dict:
        # TODO: Format payload for 'openai' or 'anthropic' contracts
        pass
"""
        },
        "test_suite": {
            "exercise_about": "AI application gateways normalize request formats across OpenAI and Anthropic to allow vendor swapping without changing application code.",
            "exercise_goal": "Implement UnifiedModelGateway.format_payload supporting openai and anthropic formats.",
            "expected_output": "gw = UnifiedModelGateway('openai')\ngw.format_payload('Hello', 50) -> {'model': 'gpt-4o', 'messages': [{'role': 'user', 'content': 'Hello'}], 'max_tokens': 50}",
            "failure_mode": "Incorrect payload structure or failing to map provider parameters.",
            "verification_criteria": "Gateway formats valid provider-specific payloads.",
            "tests.py": """from solution import UnifiedModelGateway

def test_llm_provider_abstraction():
    # OpenAI format
    openai_gw = UnifiedModelGateway("OpenAI")
    p_openai = openai_gw.format_payload("Explain gravity", 200)
    assert p_openai["model"] == "gpt-4o"
    assert p_openai["messages"][0]["content"] == "Explain gravity"
    assert p_openai["max_tokens"] == 200

    # Anthropic format
    claude_gw = UnifiedModelGateway("Anthropic")
    p_claude = claude_gw.format_payload("Explain gravity", 200)
    assert p_claude["model"] == "claude-3-5-sonnet"
    assert p_claude["prompt"] == "Explain gravity"
    assert p_claude["max_tokens_to_sample"] == 200

    print("✓ All assertions passed for Lesson 2.43: LLM Provider Abstractions")

if __name__ == '__main__':
    test_llm_provider_abstraction()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.44: Request & Response Middleware
    # --------------------------------------------------------------------------
    "node-1-44": {
        "title": "Lesson 2.44: Request & Response Interceptors (Middleware)",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 44 of 50",
        "cs_foundation": "HTTP Interceptor Pattern, Pre-Request Hooks, Post-Response Transforms, and Context Passing",
        "ai_convergence": "Real-World Engineering: Injecting Tracking Headers & Masking PII in Request Pipelines",
        "handbook_markdown": """# Lesson 2.44: Request & Response Interceptors

When building SDKs, you need to execute cross-cutting transformations on every outgoing request (e.g. attaching API keys, generating correlation IDs) and incoming response (e.g. logging latency, masking credit cards).

**Interceptors (Middleware)** wrap the core execution step with pre-request and post-response hook functions.

---

## 💡 The Real-World Mental Model: Airport Security Baggage Tags & Customs Inspection

- **Pre-Request Interceptor (Outbound)**: Airline staff attaching a printed barcode baggage tag and priority VIP sticker to your luggage before it enters the cargo hold.
- **Core Action**: Airplane flying the luggage across the ocean (**Network Request**).
- **Post-Response Interceptor (Inbound)**: Customs inspecting the incoming luggage, stamping the entry clearance seal, and handing it to baggage claim.

```
Request ──► [Pre-Hook: Add Auth Header] ──► [Send Request] ──► [Post-Hook: Mask Secrets] ──► Response
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the request pipeline interceptor:

1. **`class RequestPipeline`**:
   - `def __init__(self)`: `self._pre_hooks = []` and `self._post_hooks = []`.
   - `add_pre_hook(self, hook: callable)`: appends `hook`.
   - `add_post_hook(self, hook: callable)`: appends `hook`.
   - `execute(self, request_payload: dict) -> dict`:
     - For `hook` in `self._pre_hooks`: `request_payload = hook(request_payload)`.
     - Core simulation: `response = {"status": "ok", "echo": request_payload}`.
     - For `hook` in `self._post_hooks`: `response = hook(response)`.
     - Returns `response`.

---

## ⚠️ Common Pitfalls

- **Hooks mutating payloads in place vs returning**: Always design hooks to return the modified payload cleanly.
""",
        "starter_code": {
            "solution.py": """class RequestPipeline:
    \"\"\"
    Executes request pipeline with pre-request and post-response middleware hooks.
    \"\"\"
    def __init__(self):
        # TODO: Initialize pre and post hook lists
        pass

    def add_pre_hook(self, hook) -> None:
        # TODO: Append pre-hook
        pass

    def add_post_hook(self, hook) -> None:
        # TODO: Append post-hook
        pass

    def execute(self, request_payload: dict) -> dict:
        # TODO: Run pre-hooks, build response, run post-hooks, return final response
        pass
"""
        },
        "test_suite": {
            "exercise_about": "API client SDKs use request/response middleware pipelines to inject security headers and transform response payloads transparently.",
            "exercise_goal": "Implement RequestPipeline with pre-hooks and post-hooks.",
            "expected_output": "pipe = RequestPipeline()\npipe.add_pre_hook(lambda req: {**req, 'auth': True})\npipe.execute({'q': 'hi'}) -> {'status': 'ok', 'echo': {'q': 'hi', 'auth': True}}",
            "failure_mode": "Failing to pass payload through hook chain sequentially.",
            "verification_criteria": "Pipeline executes pre-hooks and post-hooks in order.",
            "tests.py": """from solution import RequestPipeline

def test_middleware_pipeline():
    pipeline = RequestPipeline()

    # Pre-hook adds tracking ID
    def add_tracking(req):
        return {**req, "tracking_id": "TRK-101"}

    # Post-hook adds timestamp tag
    def tag_response(res):
        return {**res, "processed": True}

    pipeline.add_pre_hook(add_tracking)
    pipeline.add_post_hook(tag_response)

    res = pipeline.execute({"query": "search_items"})
    assert res["echo"]["tracking_id"] == "TRK-101"
    assert res["processed"] is True

    print("✓ All assertions passed for Lesson 2.44: Request & Response Middleware")

if __name__ == '__main__':
    test_middleware_pipeline()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.45: Plugin Tool Architecture
    # --------------------------------------------------------------------------
    "node-1-45": {
        "title": "Lesson 2.45: Extensible Plugin & Tool Architecture",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 45 of 50",
        "cs_foundation": "Plugin Architecture, Dynamic Tool Registration, Schema Discovery, and Tool Execution",
        "ai_convergence": "Real-World Engineering: Building Extensible Tool Registries for AI Agent Execution",
        "handbook_markdown": """# Lesson 2.45: Extensible Plugin & Tool Architecture

AI agents interact with the external world by executing tools (e.g. calculator, weather lookup, database query).

An **Extensible Plugin Registry** allows third-party tools to register their schema definition and execution callback into a central dispatcher dynamically.

---

## 💡 The Real-World Mental Model: A Smart Home Hub

- **The Smart Home Hub (Registry)**: A central control station in your hallway.
- **The Smart Devices (Plugins)**: When you buy a new smart lightbulb or smart thermostat, it connects to the hub, registers its name and capabilities (`turn_on`, `set_brightness`), and the hub can now trigger it anytime.

```
┌─────────────────────────────────┐
│ ToolRegistry                    │
│ - tools: {name: ToolDefinition} │
│ + register(tool)                │
│ + execute(name, **kwargs)       │
└─────────────────────────────────┘
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `ToolRegistry`:

1. **`class ToolRegistry`**:
   - `def __init__(self)`: `self._tools = {}`.
   - `def register(self, name: str, description: str, func: callable)`:
     - Stores `self._tools[name.lower()] = {"name": name.lower(), "description": description, "func": func}`.
   - `def get_tool_definitions(self) -> list[dict]`:
     - Returns list of `{"name": t["name"], "description": t["description"]}` for all registered tools.
   - `def execute_tool(self, name: str, **kwargs)`:
     - Look up tool by `name.lower()`. If missing, raise `KeyError(f"Tool not found: {name}")`.
     - Call and return `tool["func"](**kwargs)`.

---

## ⚠️ Common Pitfalls

- **Not normalizing tool names**: Lowercase tool names to avoid case mismatch errors between LLM generation and internal dispatch.
""",
        "starter_code": {
            "solution.py": """class ToolRegistry:
    \"\"\"
    Central tool registry managing tool schema definitions and execution dispatch.
    \"\"\"
    def __init__(self):
        # TODO: Initialize tool storage dict
        pass

    def register(self, name: str, description: str, func) -> None:
        # TODO: Register tool dictionary
        pass

    def get_tool_definitions(self) -> list[dict]:
        # TODO: Return list of schema dictionaries (name, description)
        pass

    def execute_tool(self, name: str, **kwargs):
        # TODO: Look up and execute tool callable with kwargs
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Autonomous AI agent platforms use tool registries to expose available functions to language models and dispatch tool calls safely.",
            "exercise_goal": "Implement ToolRegistry with register, get_tool_definitions, and execute_tool.",
            "expected_output": "reg = ToolRegistry()\nreg.register('add', 'Adds numbers', lambda a, b: a + b)\nreg.execute_tool('add', a=2, b=3) -> 5",
            "failure_mode": "Failing to execute tool or missing tool definition extraction.",
            "verification_criteria": "Registry registers, inspects schemas, and executes tools properly.",
            "tests.py": """from solution import ToolRegistry

def test_plugin_tool_registry():
    registry = ToolRegistry()

    def calc_tax(subtotal, rate=0.1):
        return round(subtotal * rate, 2)

    registry.register("calculate_tax", "Calculates sales tax on amount", calc_tax)

    # Inspect schemas
    schemas = registry.get_tool_definitions()
    assert len(schemas) == 1
    assert schemas[0]["name"] == "calculate_tax"

    # Execute
    assert registry.execute_tool("calculate_tax", subtotal=100.0, rate=0.08) == 8.00

    # Missing tool
    try:
        registry.execute_tool("unknown_tool")
        assert False, "Expected KeyError for unregistered tool"
    except KeyError:
        pass

    print("✓ All assertions passed for Lesson 2.45: Plugin Tool Architecture")

if __name__ == '__main__':
    test_plugin_tool_registry()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.46: Conversation State Buffers
    # --------------------------------------------------------------------------
    "node-1-46": {
        "title": "Lesson 2.46: Conversation State & Token Window Trimming",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 46 of 50",
        "cs_foundation": "Sliding Context Window, Message History Management, and Token Budget Pruning",
        "ai_convergence": "Real-World Engineering: Pruning Long Chat Histories to Fit Strict Context Limits",
        "handbook_markdown": """# Lesson 2.46: Conversation State & Token Window Trimming

When users chat with an AI assistant over dozens of turns, the conversation history grows continuously. If you send the entire raw history every turn, you will exceed the model's context window limit.

A **Sliding Conversation Buffer** manages message history, preserving the immutable system prompt while pruning the oldest user/assistant turns when total messages exceed capacity.

---

## 💡 The Real-World Mental Model: A Rolling Blackboard

- **The Header (System Prompt)**: Important emergency instructions permanently painted in bold white paint at the top of the board. They are never erased.
- **The Chalk Body (User & Assistant Turns)**: As the teacher writes new lecture notes at the bottom, the oldest notes near the top are wiped with an eraser to keep the blackboard within frame.

```
+───────────────────────────────────────────────────────────+
│ SYSTEM: You are a helpful financial assistant (Permanent) │
+───────────────────────────────────────────────────────────+
│ [Turn 1: Erased when buffer full]                         │
│ Turn 2: User: "What is my balance?"                       │
│ Turn 3: Assistant: "$450.00"                              │
│ Turn 4: User: "Transfer $50" (Newest!)                    │
+───────────────────────────────────────────────────────────+
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `ConversationBuffer`:

1. **`__init__(self, system_prompt: str, max_turns: int = 4)`**:
   - `self.system_prompt = system_prompt`
   - `self.max_turns = max_turns`
   - `self._messages = []`
2. **`add_message(self, role: str, content: str) -> None`**:
   - Appends `{"role": role, "content": content}` to `self._messages`.
   - If `len(self._messages) > self.max_turns`:
     - Trims oldest message: `self._messages = self._messages[-self.max_turns:]`.
3. **`get_payload(self) -> list[dict]`**:
   - Returns `[{"role": "system", "content": self.system_prompt}] + list(self._messages)`.

---

## ⚠️ Common Pitfalls

- **Accidentally trimming the system prompt**: Never store the system prompt in the sliding `_messages` list; always prepend it dynamically in `get_payload()`.
""",
        "starter_code": {
            "solution.py": """class ConversationBuffer:
    \"\"\"
    Manages sliding conversation history, preserving system prompt and trimming oldest turns.
    \"\"\"
    def __init__(self, system_prompt: str, max_turns: int = 4):
        # TODO: Initialize system_prompt, max_turns, and messages list
        pass

    def add_message(self, role: str, content: str) -> None:
        # TODO: Append message dict and trim to max_turns
        pass

    def get_payload(self) -> list[dict]:
        # TODO: Return system message + sliding messages list
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Chatbot runtime backends manage sliding conversation buffers to keep active message turns within model context token budgets.",
            "exercise_goal": "Implement ConversationBuffer with add_message and get_payload sliding trimming.",
            "expected_output": "buf = ConversationBuffer('System prompt', max_turns=2)\nbuf.add_message('user', 'm1'); buf.add_message('assistant', 'm2'); buf.add_message('user', 'm3')\nlen(buf.get_payload()) == 3 (System + m2 + m3)",
            "failure_mode": "Trimming system prompt or failing to prune oldest message turns.",
            "verification_criteria": "Buffer maintains fixed max turn capacity and always prepends system prompt.",
            "tests.py": """from solution import ConversationBuffer

def test_conversation_buffer():
    buffer = ConversationBuffer("You are an assistant.", max_turns=2)
    buffer.add_message("user", "Hello")
    buffer.add_message("assistant", "Hi there!")
    
    payload1 = buffer.get_payload()
    assert len(payload1) == 3
    assert payload1[0]["role"] == "system"

    # Add 3rd message (evicts "Hello")
    buffer.add_message("user", "What is the weather?")
    payload2 = buffer.get_payload()
    assert len(payload2) == 3
    assert payload2[1]["content"] == "Hi there!"
    assert payload2[2]["content"] == "What is the weather?"

    print("✓ All assertions passed for Lesson 2.46: Conversation State Buffers")

if __name__ == '__main__':
    test_conversation_buffer()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.47: Tool Calling & Dispatch
    # --------------------------------------------------------------------------
    "node-1-47": {
        "title": "Lesson 2.47: Function Calling & Tool Dispatching",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 47 of 50",
        "cs_foundation": "Function Calling Protocol, JSON Argument Parsing, Tool Dispatching, and Exception Recovery",
        "ai_convergence": "Real-World Engineering: Parsing & Executing LLM Tool Calls Safely in Sandbox Loops",
        "handbook_markdown": """# Lesson 2.47: Function Calling & Tool Dispatching

When an AI model decides to call an external function, it outputs a structured JSON tool call payload (e.g. `{"name": "check_balance", "arguments": "{\\"account_id\\": \\"101\\"}"}`).

A **Tool Dispatcher** safely parses the model's raw string arguments, validates them, calls the registered Python function, and returns the result in a standard format.

---

## 💡 The Real-World Mental Model: A Radio 911 Emergency Dispatcher

- **The Caller (AI Model)**: Calls 911 and states the emergency: *"Send an ambulance to 452 Elm Street"*.
- **The Dispatcher**: Verifies the address format, locates the local medical squad, dispatches the team (**Tool Execution**), and logs the response back to the computer.

```
Model Output: {"name": "get_stock", "arguments": "{\\"sku\\": \\"A1\\"}"}
                         │
               ToolDispatcher.dispatch()
                         │
             Calls get_stock(sku="A1")
                         ▼
Result: {"tool_name": "get_stock", "output": 25, "status": "success"}
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `ToolDispatcher`:

1. **`class ToolDispatcher`**:
   - `def __init__(self)`: `self._handlers = {}`.
   - `def register(self, name: str, func: callable)`: `self._handlers[name] = func`.
   - `def dispatch(self, tool_call_dict: dict) -> dict`:
     - Extract `name = tool_call_dict.get("name")`.
     - If `name not in self._handlers`: return `{"status": "error", "error": "unknown_tool"}`.
     - Parse arguments: `args = tool_call_dict.get("arguments", {})`. If `args` is a JSON string, parse with `json.loads(args)`.
     - In `try` block: call `res = self._handlers[name](**args)`. Return `{"status": "success", "tool": name, "result": res}`.
     - `except Exception as e`: return `{"status": "error", "error": str(e)}`.

---

## ⚠️ Common Pitfalls

- **Handling arguments as string vs dict**: AI APIs often return arguments as a stringified JSON string `"{'id': 1}"`; always check `isinstance(args, str)` and parse safely.
""",
        "starter_code": {
            "solution.py": """import json

class ToolDispatcher:
    \"\"\"
    Dispatches structured tool call requests to registered Python handler functions.
    \"\"\"
    def __init__(self):
        # TODO: Initialize handlers dict
        pass

    def register(self, name: str, func) -> None:
        # TODO: Register handler function
        pass

    def dispatch(self, tool_call_dict: dict) -> dict:
        # TODO: Parse arguments, look up handler, execute safely, and return result dict
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Autonomous agent runtime engines use tool dispatchers to parse LLM function-calling JSON payloads and safely execute target Python handlers.",
            "exercise_goal": "Implement ToolDispatcher with register and dispatch methods.",
            "expected_output": "disp = ToolDispatcher()\ndisp.register('add', lambda a, b: a + b)\ndisp.dispatch({'name': 'add', 'arguments': '{\"a\": 2, \"b\": 3}'}) -> {'status': 'success', 'tool': 'add', 'result': 5}",
            "failure_mode": "Crashing on malformed JSON or failing to catch execution exceptions.",
            "verification_criteria": "Dispatcher parses string/dict arguments and handles unknown tools or errors gracefully.",
            "tests.py": """from solution import ToolDispatcher

def test_tool_dispatcher():
    dispatcher = ToolDispatcher()
    dispatcher.register("multiply", lambda x, y: x * y)

    # Stringified JSON args
    call_str = {"name": "multiply", "arguments": '{"x": 4, "y": 5}'}
    res1 = dispatcher.dispatch(call_str)
    assert res1["status"] == "success"
    assert res1["result"] == 20

    # Dict args
    call_dict = {"name": "multiply", "arguments": {"x": 10, "y": 3}}
    res2 = dispatcher.dispatch(call_dict)
    assert res2["result"] == 30

    # Unknown tool
    res_err = dispatcher.dispatch({"name": "non_existent"})
    assert res_err["status"] == "error"

    print("✓ All assertions passed for Lesson 2.47: Tool Calling & Dispatch")

if __name__ == '__main__':
    test_tool_dispatcher()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.48: Token Bucket Rate Limiting
    # --------------------------------------------------------------------------
    "node-1-48": {
        "title": "Lesson 2.48: Rate Limiting & The Token Bucket Algorithm",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 48 of 50",
        "cs_foundation": "Token Bucket Algorithm, Rate Limiting, Capacity Bursts, and Refill Rate Calculation",
        "ai_convergence": "Real-World Engineering: Throttling API Callers to Prevent Exceeding OpenAI Rate Limits",
        "handbook_markdown": """# Lesson 2.48: Rate Limiting & The Token Bucket Algorithm

External AI APIs enforce strict rate limits (e.g. 60 requests per minute). Exceeding these limits results in HTTP `429 Too Many Requests` crashes.

The **Token Bucket Algorithm** is the industry standard for client-side rate limiting: a bucket holds up to $C$ tokens and refills at a steady rate of $R$ tokens per second. Each request consumes 1 token. If the bucket is empty, the request is throttled.

---

## 💡 The Real-World Mental Model: An Arcade Token Dispenser

- **The Bucket Capacity ($C = 10$)**: A small coin cup on your belt that can hold at most 10 arcade tokens.
- **The Refill Machine ($R = 1\\text{ token/sec}$)**: An automated machine that drops 1 fresh coin into your cup every second.
- **Playing an Arcade Game**: Inserting 1 coin from your cup to start a game. If your cup is empty, you must wait for the dispenser to drop the next coin.

```
Token Bucket (Capacity: 5 tokens, Refill: 1 token/sec)
Tokens Available: 5 ──(3 requests burst)──► Tokens Remaining: 2
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `TokenBucketLimiter`:

1. **`__init__(self, capacity: int = 5, refill_rate_per_sec: float = 1.0)`**:
   - `self.capacity = float(capacity)`
   - `self.tokens = float(capacity)`
   - `self.refill_rate = refill_rate_per_sec`
   - `self.last_refill_time = time.time()`
2. **`_refill(self)`**:
   - `now = time.time()`
   - `delta = now - self.last_refill_time`
   - `self.tokens = min(self.capacity, self.tokens + (delta * self.refill_rate))`
   - `self.last_refill_time = now`
3. **`allow_request(self, tokens_needed: int = 1) -> bool`**:
   - Calls `self._refill()`.
   - If `self.tokens >= tokens_needed`:
     - `self.tokens -= tokens_needed`
     - Return `True`.
   - Else return `False`.

---

## ⚠️ Common Pitfalls

- **Forgetting to cap tokens at `capacity`**: Tokens can never exceed `self.capacity`.
""",
        "starter_code": {
            "solution.py": """import time

class TokenBucketLimiter:
    \"\"\"
    Implements Token Bucket algorithm to throttle request bursts and enforce steady rates.
    \"\"\"
    def __init__(self, capacity: int = 5, refill_rate_per_sec: float = 1.0):
        # TODO: Initialize capacity, current tokens, refill rate, and timestamp
        pass

    def allow_request(self, tokens_needed: int = 1) -> bool:
        # TODO: Refill elapsed tokens, check availability, deduct tokens, return True/False
        pass
"""
        },
        "test_suite": {
            "exercise_about": "API gateways and client SDKs implement the Token Bucket rate limiting algorithm to prevent traffic spikes from exceeding upstream quotas.",
            "exercise_goal": "Implement TokenBucketLimiter with capacity, refill rate, and allow_request check.",
            "expected_output": "limiter = TokenBucketLimiter(capacity=2)\nlimiter.allow_request() -> True\nlimiter.allow_request() -> True\nlimiter.allow_request() -> False (bucket empty)",
            "failure_mode": "Failing to cap tokens at capacity or failing to deduct tokens on allowed requests.",
            "verification_criteria": "Limiter allows burst up to capacity and rejects requests when tokens are exhausted.",
            "tests.py": """import time
from solution import TokenBucketLimiter

def test_token_bucket_limiter():
    limiter = TokenBucketLimiter(capacity=3, refill_rate_per_sec=10.0)

    # Consume 3 tokens (capacity)
    assert limiter.allow_request() is True
    assert limiter.allow_request() is True
    assert limiter.allow_request() is True

    # 4th request exceeds capacity
    assert limiter.allow_request() is False

    # Wait for refill
    time.sleep(0.15) # 0.15s * 10 tokens/sec = 1.5 tokens refilled
    assert limiter.allow_request() is True

    print("✓ All assertions passed for Lesson 2.48: Token Bucket Rate Limiting")

if __name__ == '__main__':
    test_token_bucket_limiter()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.49: Response Caching Layer
    # --------------------------------------------------------------------------
    "node-1-49": {
        "title": "Lesson 2.49: In-Memory TTL & Semantic Response Caching",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 49 of 50",
        "cs_foundation": "Caching Strategies, Time-To-Live (TTL) Expiration, Cache Keys, and Cache Invalidation",
        "ai_convergence": "Real-World Engineering: Caching Identical Prompt Embeddings & Model Responses",
        "handbook_markdown": """# Lesson 2.49: Response Caching & TTL Expiration

Sending identical queries repeatedly to external web services wastes bandwidth and money.

An **In-Memory Cache with Time-To-Live (TTL)** stores previous responses in a hash map. When a request arrives, if a fresh unexpired cached response exists, the cache returns it in $<1\\text{ms}$ without making any network calls.

---

## 💡 The Real-World Mental Model: A Fast-Food Heated Holding Shelf

- **Cook to Order (Cache Miss)**: A customer orders French Fries. The kitchen cuts fresh potatoes and fries them for 4 minutes before serving.
- **Heated Holding Shelf (Cache Hit)**: The kitchen keeps a batch of hot fries on the heated shelf with a 10-minute timer (**TTL**). If another customer orders fries 2 minutes later, the cashier serves them instantly in 5 seconds. If the timer expires, the cold fries are discarded.

```
Request ──► [Check Cache (Key: hash(query))]
                  ├── If Found & TTL Valid ──► Return Cached Result (<1ms!)
                  └── If Miss / Expired    ──► Fetch Remote & Save to Cache
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `TTLCache`:

1. **`__init__(self, default_ttl_seconds: float = 60.0)`**:
   - `self._storage = {}`
   - `self.default_ttl = default_ttl_seconds`
2. **`set(self, key: str, value, ttl: float = None) -> None`**:
   - `expires_at = time.time() + (ttl if ttl is not None else self.default_ttl)`
   - Stores `self._storage[key] = {"value": value, "expires_at": expires_at}`.
3. **`get(self, key: str)`**:
   - If `key` not in `self._storage`: return `None`.
   - Entry = `self._storage[key]`.
   - If `time.time() > entry["expires_at"]`:
     - Delete `del self._storage[key]` and return `None` (Expired!).
   - Else return `entry["value"]`.

---

## ⚠️ Common Pitfalls

- **Serving stale expired entries**: Always check `time.time() > expires_at` before returning cached values.
""",
        "starter_code": {
            "solution.py": """import time

class TTLCache:
    \"\"\"
    In-memory key-value cache supporting Time-To-Live (TTL) expiration.
    \"\"\"
    def __init__(self, default_ttl_seconds: float = 60.0):
        # TODO: Initialize storage dict and default TTL
        pass

    def set(self, key: str, value, ttl: float = None) -> None:
        # TODO: Store value with computed expiration timestamp
        pass

    def get(self, key: str):
        # TODO: Return value if fresh, or evict and return None if expired
        pass
"""
        },
        "test_suite": {
            "exercise_about": "High-performance API clients use in-memory TTL caching to eliminate redundant remote calls for repeated query lookups.",
            "exercise_goal": "Implement TTLCache with set and get methods enforcing TTL expiration.",
            "expected_output": "cache = TTLCache(default_ttl_seconds=10)\ncache.set('q1', 'ans1')\ncache.get('q1') -> 'ans1'",
            "failure_mode": "Returning expired values or failing to evict expired keys.",
            "verification_criteria": "Cache returns fresh values and returns None when TTL expires.",
            "tests.py": """import time
from solution import TTLCache

def test_ttl_cache():
    cache = TTLCache(default_ttl_seconds=0.1) # 100ms TTL

    cache.set("query_1", {"response": "Processed answer"})
    assert cache.get("query_1") == {"response": "Processed answer"}

    # Wait for TTL to expire
    time.sleep(0.15)
    assert cache.get("query_1") is None

    # Missing key test
    assert cache.get("non_existent_key") is None

    print("✓ All assertions passed for Lesson 2.49: Response Caching Layer")

if __name__ == '__main__':
    test_ttl_cache()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.50: Capstone: SchemaAgent — Resilient Client SDK
    # --------------------------------------------------------------------------
    "node-1-50": {
        "title": "Lesson 2.50: Module 2 Capstone: SchemaAgent — Resilient Client SDK",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 50 of 50",
        "cs_foundation": "Enterprise SDK Architecture: Contracts, Middleware, Caching, Rate Limiting, and Telemetry",
        "ai_convergence": "Real-World Engineering: Assembling a Production-Grade Resilient AI Client SDK",
        "handbook_markdown": """# Lesson 2.50: Module 2 Capstone: SchemaAgent — Resilient Client SDK

Congratulations on reaching the **Module 2 Capstone**!

In this comprehensive capstone project, you will synthesize all object-oriented architecture, design patterns, and reliability primitives mastered across Lessons 2.1 through 2.49:
- **Provider Abstraction & Strategy Pattern**
- **Token Bucket Rate Limiting**
- **In-Memory TTL Response Caching**
- **Structured Middleware Pipelines**
- **Comprehensive Unit Testing Verification**

---

## 💡 The Real-World Mental Model: An Armored Transport Vehicle

Your **`SchemaAgentSDK`** is not a simple script; it is a battle-hardened client engine:
1. **Rate Limiter Shield**: Prevents sending traffic faster than quota allowances.
2. **TTL Cache Memory**: Instantly returns answers to repeat queries without burning API credits.
3. **Telemetry & Validation**: Formats clean, structured payloads and logs execution events.

```
+─────────────────────────────────────────────────────────────+
│                       SCHEMA AGENT SDK                      │
│                                                             │
│  [Rate Limiter] ──► [TTL Cache] ──► [Provider Adapter]      │
│         │                  │                 │              │
│      Throttles          Hits <1ms         Dispatches        │
+─────────────────────────────────────────────────────────────+
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the `SchemaAgentSDK` client orchestrator:

1. **`__init__(self, api_key: str, rate_limit_capacity: int = 5, cache_ttl: float = 60.0)`**:
   - Stores `self.api_key = api_key` (raises `ValueError` if empty).
   - Initializes `self._cache = {}` (mapping `key` to `{"val": val, "exp": exp}`).
   - Initializes `self._tokens = float(rate_limit_capacity)`.
   - Stores `self._cache_ttl = cache_ttl`.
   - Initializes `self.request_history = []`.

2. **`query(self, prompt: str) -> dict`**:
   - Normalizes `key = prompt.strip().lower()`.
   - **Check Cache**: If `key in self._cache` and `time.time() <= self._cache[key]["exp"]`:
     - Return `{"source": "cache", "result": self._cache[key]["val"]}`.
   - **Rate Limit**: If `self._tokens < 1.0`:
     - Return `{"source": "rate_limiter", "error": "quota_exceeded"}`.
   - `self._tokens -= 1.0`
   - **Simulate Execution**: `result = f"COMPLETED: {prompt.strip()}"`.
   - Save to cache: `self._cache[key] = {"val": result, "exp": time.time() + self._cache_ttl}`.
   - Append `prompt` to `self.request_history`.
   - Return `{"source": "network", "result": result}`.

---

## ⚠️ Common Pitfalls

- **Empty API Key validation**: Validate `api_key.strip()` in constructor and raise `ValueError` if missing.
""",
        "starter_code": {
            "solution.py": """import time

class SchemaAgentSDK:
    \"\"\"
    Production-grade AI Client SDK combining rate limiting, TTL caching, and robust execution.
    \"\"\"
    def __init__(self, api_key: str, rate_limit_capacity: int = 5, cache_ttl: float = 60.0):
        # TODO: Initialize SDK state, validate api_key, set up rate limiter and cache
        pass

    def query(self, prompt: str) -> dict:
        \"\"\"
        Executes query through cache check, rate limiter guard, and mock provider dispatch.
        \"\"\"
        # TODO: Implement query flow returning {'source': 'cache'|'network'|'rate_limiter', ...}
        pass
"""
        },
        "test_suite": {
            "exercise_about": "The Module 2 Capstone builds a complete enterprise AI client SDK orchestrating caching, rate limiting, and provider dispatch.",
            "exercise_goal": "Implement SchemaAgentSDK integrating validation, caching, rate limiting, and execution.",
            "expected_output": "sdk = SchemaAgentSDK('sk-test')\nsdk.query('hello') -> {'source': 'network', 'result': 'COMPLETED: hello'}\nsdk.query('hello') -> {'source': 'cache', 'result': 'COMPLETED: hello'}",
            "failure_mode": "Failing to validate API key or failing to serve cached response.",
            "verification_criteria": "SchemaAgentSDK orchestrates all reliability primitives correctly.",
            "tests.py": """import time
from solution import SchemaAgentSDK

def test_schema_agent_capstone():
    # Validation test
    try:
        SchemaAgentSDK("")
        assert False, "Expected ValueError on empty api_key"
    except ValueError:
        pass

    sdk = SchemaAgentSDK("sk_live_12345", rate_limit_capacity=2, cache_ttl=0.2)

    # 1. Initial query (Network)
    res1 = sdk.query("Summarize quarterly report")
    assert res1["source"] == "network"
    assert res1["result"] == "COMPLETED: Summarize quarterly report"

    # 2. Repeated query (Cache Hit)
    res2 = sdk.query("Summarize quarterly report")
    assert res2["source"] == "cache"
    assert res2["result"] == "COMPLETED: Summarize quarterly report"

    # 3. New query (Consumes 2nd token)
    res3 = sdk.query("Translate invoice")
    assert res3["source"] == "network"

    # 4. 3rd new query exceeds capacity
    res4 = sdk.query("Extract entities")
    assert res4["source"] == "rate_limiter"
    assert res4["error"] == "quota_exceeded"

    print("✓ All assertions passed for Lesson 2.50: Module 2 Capstone Project!")

if __name__ == '__main__':
    test_schema_agent_capstone()
"""
        }
    }
}

def apply_patch():
    print(f"Applying patch to {len(LESSONS_2_36_TO_50)} lessons in Module 2 (node-1-36 to node-1-50)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for node_id, data in LESSONS_2_36_TO_50.items():
        payload = {
            "title": data["title"],
            "subtitle": data["subtitle"],
            "cs_foundation": data["cs_foundation"],
            "ai_convergence": data["ai_convergence"],
            "handbook_markdown": data["handbook_markdown"],
            "starter_code": data["starter_code"],
            "test_suite": data["test_suite"]
        }
        url = f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}"
        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "apikey": API_KEY,
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            method="PATCH"
        )
        try:
            with urllib.request.urlopen(req, context=ctx) as response:
                print(f"✓ Patched {node_id} ({data['title']}) -> HTTP {response.status}")
        except Exception as e:
            print(f"✗ Failed to patch {node_id}: {e}")

if __name__ == "__main__":
    apply_patch()
