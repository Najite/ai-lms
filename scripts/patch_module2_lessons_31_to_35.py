#!/usr/bin/env python3
"""
Patch script for Module 2, Lessons 2.31 through 2.50 (node-1-31 to node-1-50).
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

LESSONS_2_31_TO_50 = {
    # --------------------------------------------------------------------------
    # 2.31: Dependency Inversion Principle (DIP)
    # --------------------------------------------------------------------------
    "node-1-31": {
        "title": "Lesson 2.31: Dependency Inversion Principle (DIP)",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 31 of 50",
        "cs_foundation": "SOLID Principles, Dependency Inversion (DIP), and Inverting Concrete Dependencies to Abstractions",
        "ai_convergence": "Real-World Engineering: Decoupling Business Services from Direct Database Connectors",
        "handbook_markdown": """# Lesson 2.31: Dependency Inversion Principle (DIP)

The **Dependency Inversion Principle (DIP)**—the 'D' in SOLID—states:
1. *High-level business modules should not depend on low-level technical details. Both should depend on abstractions.*
2. *Abstractions should not depend on details. Details should depend on abstractions.*

Your checkout calculation business logic should depend on a generic `DatabaseRepository` interface, never on a concrete `PostgreSQLClient` directly.

---

## 💡 The Real-World Mental Model: A Standard Lamp Plug vs Solder

- **Violation (High-level depends on low-level)**: Soldering your living room desk lamp wires directly into the municipal underground power station cables. If the power grid upgrades, your lamp catches fire.
- **DIP Architecture**: Both the power plant and the desk lamp depend on a universal **wall outlet specification** (the Abstraction). You can swap the power source to solar batteries without rewiring the lamp.

```
High-Level:  [OrderService]
                    │
            Depends on Interface (Abstraction)
                    ▼
Interface:   [PaymentGatewayProtocol]
                    ▲
            Implements Interface
                    │
Low-Level:   [StripeAdapter] or [MockTestGateway]
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement DIP-compliant notification logging:

1. **`class BaseLoggerProtocol`**:
   - `def log_event(self, event_name: str) -> str`: pass.
2. **`class InMemoryLogger(BaseLoggerProtocol)`**:
   - `def __init__(self)`: `self.logs = []`.
   - `def log_event(self, event_name: str) -> str`:
     - Appends `event_name` to `self.logs`.
     - Returns `f"LOGGED: {event_name}"`.
3. **`class UserService` (High-level module)**:
   - `def __init__(self, logger: BaseLoggerProtocol)`: stores `self.logger = logger`.
   - `def register_user(self, username: str) -> str`:
     - Calls and returns `self.logger.log_event(f"user_created_{username}")`.

---

## ⚠️ Common Pitfalls

- **Instantiating low-level loggers inside `UserService.__init__`**: Always pass the abstraction in via dependency injection.
""",
        "starter_code": {
            "solution.py": """class BaseLoggerProtocol:
    def log_event(self, event_name: str) -> str:
        pass


class InMemoryLogger(BaseLoggerProtocol):
    def __init__(self):
        self.logs = []

    def log_event(self, event_name: str) -> str:
        # TODO: Append event_name to self.logs and return 'LOGGED: {event_name}'
        pass


class UserService:
    \"\"\"High-level module depending strictly on BaseLoggerProtocol abstraction.\"\"\"
    def __init__(self, logger: BaseLoggerProtocol):
        # TODO: Store logger abstraction
        pass

    def register_user(self, username: str) -> str:
        # TODO: Dispatch log event and return result
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Service architectures invert dependencies by depending strictly on abstract logger protocols, allowing unit test mocks and production sinks to be swapped seamlessly.",
            "exercise_goal": "Implement InMemoryLogger and UserService depending on BaseLoggerProtocol.",
            "expected_output": "logger = InMemoryLogger()\nsvc = UserService(logger)\nsvc.register_user('alice') -> 'LOGGED: user_created_alice'",
            "failure_mode": "Failing to inject logger or failing to record event in logs list.",
            "verification_criteria": "UserService decouples from concrete logger via dependency inversion.",
            "tests.py": """from solution import InMemoryLogger, UserService

def test_dip_principle():
    logger = InMemoryLogger()
    service = UserService(logger)

    res = service.register_user("bob_smith")
    assert res == "LOGGED: user_created_bob_smith"
    assert logger.logs == ["user_created_bob_smith"]

    print("✓ All assertions passed for Lesson 2.31: Dependency Inversion Principle")

if __name__ == '__main__':
    test_dip_principle()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.32: Code Smells & Refactoring
    # --------------------------------------------------------------------------
    "node-1-32": {
        "title": "Lesson 2.32: Code Smells & Clean Refactoring",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 32 of 50",
        "cs_foundation": "Identifying Code Smells (Long Methods, Feature Envy, Primitive Obsession), and Extract Method Refactoring",
        "ai_convergence": "Real-World Engineering: Refactoring Tangled Order Parsers into Clean Atomic Helpers",
        "handbook_markdown": """# Lesson 2.32: Code Smells & Clean Refactoring

A **code smell** is a surface indication that usually corresponds to a deeper problem in the software system (e.g. 200-line monolithic functions, copy-pasted blocks, or functions with 10 parameters).

The **Extract Method** refactoring technique identifies cohesive blocks of code within a long function and breaks them into small, descriptive private helper functions.

---

## 💡 The Real-World Mental Model: A Knotted Ball of Yarn vs Spools

- **Smelly Code (Long Method)**: A tangled bird's nest of loose yarn with 5 colors knotted together. If you pull one thread, the whole ball tightens into a hard knot.
- **Refactored Code**: Untangled, color-coded spools organized in labeled compartments. Each spool can be unrolled and inspected independently.

```
Long Method (Smell):
process_order() -> [Validates + Calculates Tax + Discounts + Formats + Sends Email]

Refactored (Clean):
process_order() ->
   ├── _validate_items()
   ├── _calculate_tax()
   └── _dispatch_notice()
```

---

## 🛠️ Step-by-Step Exercise Guide

Refactor a raw order processor into clean helper methods:

1. **`class CleanOrderProcessor`**:
   - `def validate_order(self, order: dict) -> bool`: Returns `True` if `"items"` in `order` and `len(order["items"]) > 0`, else `False`.
   - `def calculate_total(self, order: dict) -> float`: Sums `price * qty` for all items in `order["items"]`, returned rounded to 2 decimals.
   - `def process(self, order: dict) -> dict`:
     - If not `self.validate_order(order)`: return `{"success": False, "error": "empty_order"}`.
     - Else return `{"success": True, "total": self.calculate_total(order)}`.

---

## ⚠️ Common Pitfalls

- **Refactoring without tests**: Never refactor code without automated test assertions verifying that the output behavior remains identical before and after.
""",
        "starter_code": {
            "solution.py": """class CleanOrderProcessor:
    \"\"\"Refactored order processor with extracted validation and calculation helpers.\"\"\"
    def validate_order(self, order: dict) -> bool:
        # TODO: Return True if order has non-empty 'items' list, else False
        pass

    def calculate_total(self, order: dict) -> float:
        # TODO: Sum price * qty for items in order
        pass

    def process(self, order: dict) -> dict:
        # TODO: Validate and return success dict with total, or error dict
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Refactoring pipelines decompose complex long methods into clean, testable validation and calculation helpers.",
            "exercise_goal": "Implement CleanOrderProcessor with validate_order, calculate_total, and process.",
            "expected_output": "proc = CleanOrderProcessor()\nproc.process({'items': [{'price': 10.0, 'qty': 2}]}) -> {'success': True, 'total': 20.00}",
            "failure_mode": "Failing to validate empty items or incorrect total summation.",
            "verification_criteria": "Processor decomposes logic cleanly into testable helper methods.",
            "tests.py": """from solution import CleanOrderProcessor

def test_clean_refactoring():
    proc = CleanOrderProcessor()
    
    # Valid order
    valid = {"items": [{"price": 15.0, "qty": 2}, {"price": 5.0, "qty": 1}]}
    res = proc.process(valid)
    assert res["success"] is True
    assert res["total"] == 35.0

    # Invalid empty order
    invalid = {"items": []}
    res_err = proc.process(invalid)
    assert res_err["success"] is False
    assert res_err["error"] == "empty_order"

    print("✓ All assertions passed for Lesson 2.32: Code Smells & Refactoring")

if __name__ == '__main__':
    test_clean_refactoring()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.33: Clean Function Design & Immutability
    # --------------------------------------------------------------------------
    "node-1-33": {
        "title": "Lesson 2.33: Pure Functions & Side-Effect Minimization",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 33 of 50",
        "cs_foundation": "Pure Functions, Deterministic Outputs, Side-Effect Minimization, and Immutability",
        "ai_convergence": "Real-World Engineering: Writing Deterministic Financial Calculation Pipelines",
        "handbook_markdown": """# Lesson 2.33: Pure Functions & Side-Effect Minimization

A **Pure Function** is a function that:
1. Always returns the **exact same output** when given the same input parameters (deterministic).
2. Has **zero side effects** (does not mutate global variables, modify passed-in lists, or alter external hardware state).

Pure functions are dramatically easier to test, debug, and parallelize across multiple CPU cores.

---

## 💡 The Real-World Mental Model: A Math Calculator vs A Vending Machine

- **Impure Function (Vending Machine)**: Dropping a quarter inside changes the physical inventory of the machine, dispenses a can, and updates the internal coin counter (**side effects**).
- **Pure Function (Handheld Calculator)**: Punching in `2 + 2 = 4`. The calculator returns `4` every single time without changing the temperature in the room or erasing your bank account.

```python
# Impure (Mutates input list in-place!):
def add_tax_impure(cart):
    for item in cart:
        item["price"] *= 1.08  # Secretly alters caller's data!

# Pure (Returns new data, original untouched!):
def add_tax_pure(cart: list[dict]) -> list[dict]:
    return [{**item, "price": round(item["price"] * 1.08, 2)} for item in cart]
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the pure function `apply_fixed_fee_pure(items: list[dict], fee: float) -> list[dict]`:

1. **Parameters**: `items` (list of dicts with `"name"` and `"price"`) and `fee` (float).
2. **Pure Transformation**:
   - Build a new list of dictionaries using a list comprehension or copying.
   - Each new dictionary must have `"price"` increased by `fee`: `round(item["price"] + fee, 2)`.
3. **Verify Zero Side Effects**: Ensure the original `items` list passed in by the caller is completely unmodified.

---

## ⚠️ Common Pitfalls

- **Mutating dictionary keys in a loop**: Always create fresh copies of nested dictionaries using `{**item, "key": new_value}`.
""",
        "starter_code": {
            "solution.py": """def apply_fixed_fee_pure(items: list[dict], fee: float) -> list[dict]:
    \"\"\"
    Pure function that returns a new list of items with fees applied,
    guaranteeing zero mutation to the input list.
    \"\"\"
    # TODO: Return new list with fee added to prices without mutating input
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Financial processing pipelines use pure functions to calculate adjusted item prices deterministically without mutating original ledger databases.",
            "exercise_goal": "Implement apply_fixed_fee_pure(items, fee) returning new list without mutating input.",
            "expected_output": "apply_fixed_fee_pure([{'name': 'Pen', 'price': 2.0}], 1.0) -> [{'name': 'Pen', 'price': 3.0}]",
            "failure_mode": "Mutating original input list or dictionaries in place.",
            "verification_criteria": "Function returns correct calculation and leaves original input completely unchanged.",
            "tests.py": """from solution import apply_fixed_fee_pure

def test_pure_functions():
    original = [
        {"name": "Notebook", "price": 5.00},
        {"name": "Eraser", "price": 1.50}
    ]
    result = apply_fixed_fee_pure(original, fee=2.00)

    assert result[0]["price"] == 7.00
    assert result[1]["price"] == 3.50

    # Verify original was NOT mutated
    assert original[0]["price"] == 5.00
    assert original[1]["price"] == 1.50

    print("✓ All assertions passed for Lesson 2.33: Pure Functions & Immutability")

if __name__ == '__main__':
    test_pure_functions()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.34: Docstrings & API Contracts
    # --------------------------------------------------------------------------
    "node-1-34": {
        "title": "Lesson 2.34: Docstrings & Google-Style API Contracts",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 34 of 50",
        "cs_foundation": "PEP 257 Docstring Conventions, Google/Sphinx Format, Args, Returns, and Raises Contracts",
        "ai_convergence": "Real-World Engineering: Documenting Production SDK Interfaces for Developer Consumption",
        "handbook_markdown": """# Lesson 2.34: Docstrings & Google-Style API Contracts

Writing clean code includes writing clear, machine-readable documentation. In professional software engineering, **docstrings** (PEP 257) document the input constraints, return contracts, and potential exceptions of every public function.

Using standard **Google-style docstrings** enables automated documentation generators (like Sphinx) and IDE autocomplete hovers.

---

## 💡 The Real-World Mental Model: Prescription Medication Labels

- **Unlabeled Medicine Bottle**: A blank white pill bottle. Even if the medicine inside is life-saving, nobody knows what dosage to take or what side effects to expect.
- **Google-Style Docstring**: The official pharmacist label detailing:
  - **Purpose**: What the medicine treats.
  - **Args (Dosage)**: Exactly how many pills to take.
  - **Returns (Expected Effect)**: Pain relief within 30 minutes.
  - **Raises (Contraindications)**: Do not take with alcohol.

```python
def calculate_compound_interest(principal: float, rate: float, years: int) -> float:
    \"\"\"Calculates total compound interest earned on an investment.

    Args:
        principal: Initial investment amount in USD (must be > 0).
        rate: Annual interest rate as a decimal (e.g. 0.05 for 5%).
        years: Number of investment years (must be >= 1).

    Returns:
        Total accumulated balance rounded to 2 decimal places.

    Raises:
        ValueError: If principal <= 0 or years < 1.
    \"\"\"
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement and document `calculate_compound_interest`:

1. **Write Function with Google-Style Docstring**:
   - `def calculate_compound_interest(principal: float, rate: float, years: int) -> float:`
2. **Validation**:
   - If `principal <= 0` or `years < 1`: raise `ValueError("Invalid principal or years")`.
3. **Calculation**:
   - `total = principal * ((1 + rate) ** years)`.
   - Return `round(total, 2)`.

---

## ⚠️ Common Pitfalls

- **Vague parameter descriptions**: Clearly specify units (e.g. `USD`, `milliseconds`, `decimal percentage`).
""",
        "starter_code": {
            "solution.py": """def calculate_compound_interest(principal: float, rate: float, years: int) -> float:
    \"\"\"
    Calculates total accumulated balance with annual compound interest.

    Args:
        principal: Initial deposit in USD (must be > 0).
        rate: Annual interest rate as a decimal (e.g. 0.05).
        years: Total duration in years (must be >= 1).

    Returns:
        Total accumulated balance rounded to 2 decimal places.

    Raises:
        ValueError: If principal <= 0 or years < 1.
    \"\"\"
    # TODO: Validate constraints and compute principal * ((1 + rate) ** years)
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Financial SDKs enforce strict Google-style docstring API contracts and input validation for all interest and billing calculations.",
            "exercise_goal": "Implement calculate_compound_interest with input validation and docstring contracts.",
            "expected_output": "calculate_compound_interest(1000.0, 0.05, 2) -> 1102.50",
            "failure_mode": "Failing to validate inputs or incorrect compound interest formula.",
            "verification_criteria": "Function calculates compound interest accurately and enforces contract exceptions.",
            "tests.py": """from solution import calculate_compound_interest

def test_docstring_contracts():
    assert calculate_compound_interest(1000.0, 0.10, 1) == 1100.00
    assert calculate_compound_interest(1000.0, 0.05, 2) == 1102.50

    try:
        calculate_compound_interest(-500.0, 0.05, 1)
        assert False, "Expected ValueError on negative principal"
    except ValueError:
        pass

    print("✓ All assertions passed for Lesson 2.34: Docstrings & API Contracts")

if __name__ == '__main__':
    test_docstring_contracts()
"""
        }
    },

    # --------------------------------------------------------------------------
    # 2.35: Pytest Fundamentals & Fixtures
    # --------------------------------------------------------------------------
    "node-1-35": {
        "title": "Lesson 2.35: Pytest Fixtures & Test Setup Lifecycle",
        "subtitle": "Module 2: AI Software Architecture & Data Contracts | Lesson 35 of 50",
        "cs_foundation": "Test Automation, @pytest.fixture, Setup/Teardown Lifecycles, and Test Isolation",
        "ai_convergence": "Real-World Engineering: Provisioning Clean Test Databases & Mock User Accounts",
        "handbook_markdown": """# Lesson 2.35: Pytest Fixtures & Test Lifecycles

In automated testing, copy-pasting the same 10 lines of setup code (e.g. creating test databases, seeding mock users) into 50 test functions creates maintenance nightmares.

**Pytest Fixtures (`@pytest.fixture`)** provide reusable, isolated setup and teardown helpers that inject clean test dependencies directly into test functions.

---

## 💡 The Real-World Mental Model: A Sterile Operating Room Prep Table

- **Without Fixtures**: A doctor having to wash their own surgical tools, disinfect the room, and build the operating table by hand before every single 5-minute procedure.
- **With Pytest Fixtures**: A sterile surgical tray pre-assembled by the preparation team. When the doctor walks into the operating theater, the exact required tools are laid out cleanly, and waste is sterilized immediately afterward (**teardown**).

```python
import pytest

@pytest.fixture
def sample_user():
    # Setup:
    user = {"id": 101, "name": "Alice", "role": "admin"}
    return user
    # Teardown (if using yield)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement fixture simulation helpers:

1. **`create_test_cart_fixture() -> dict`**:
   - Returns a fresh dictionary: `{"cart_id": "TEST-CART-1", "items": [{"name": "Widget", "price": 10.0, "qty": 2}], "status": "OPEN"}`.
2. **`calculate_cart_subtotal(cart: dict) -> float`**:
   - Sums `price * qty` for all items in `cart["items"]`.
   - Returns rounded float.

---

## ⚠️ Common Pitfalls

- **Mutating shared fixture state across tests**: Fixtures should return fresh, independent data objects for each test to guarantee test isolation.
""",
        "starter_code": {
            "solution.py": """def create_test_cart_fixture() -> dict:
    \"\"\"Fixture helper generating an isolated test shopping cart dictionary.\"\"\"
    # TODO: Return test cart with cart_id, items list, and status
    pass


def calculate_cart_subtotal(cart: dict) -> float:
    \"\"\"Calculates subtotal of items in cart.\"\"\"
    # TODO: Sum price * qty for items in cart
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Automated testing frameworks use fixtures to provision clean, isolated sample datasets for testing calculations without database dependencies.",
            "exercise_goal": "Implement create_test_cart_fixture and calculate_cart_subtotal.",
            "expected_output": "cart = create_test_cart_fixture()\ncalculate_cart_subtotal(cart) -> 20.00",
            "failure_mode": "Failing to return expected cart structure or calculation errors.",
            "verification_criteria": "Fixture generates valid test cart and subtotal calculation verifies accurately.",
            "tests.py": """from solution import create_test_cart_fixture, calculate_cart_subtotal

def test_pytest_fixtures():
    cart = create_test_cart_fixture()
    assert cart["cart_id"] == "TEST-CART-1"
    assert len(cart["items"]) == 1

    subtotal = calculate_cart_subtotal(cart)
    assert subtotal == 20.00

    print("✓ All assertions passed for Lesson 2.35: Pytest Fixtures")

if __name__ == '__main__':
    test_pytest_fixtures()
"""
        }
    }
}

def apply_patch():
    print(f"Applying patch to {len(LESSONS_2_31_TO_50)} lessons in Module 2 (node-1-31 to node-1-35)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for node_id, data in LESSONS_2_31_TO_50.items():
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
