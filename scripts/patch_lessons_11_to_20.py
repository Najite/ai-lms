#!/usr/bin/env python3
"""
Patch script for Lessons 1.11 through 1.20 (node-0-11 to node-0-20).
Applies:
- Single-topic real-world mental models (no AI buzzwords).
- Step-by-step guides and common beginner pitfalls.
- 3-part exercise briefings: exercise_about, exercise_goal, expected_output outside code.
- Clean starter code with guided # TODOs.
- Robust unit tests in test_suite['tests.py'].
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

LESSONS_11_20 = {
    # --------------------------------------------------------------------------
    # LESSON 1.11: *args and **kwargs (Flexible Function Arguments)
    # --------------------------------------------------------------------------
    "node-0-11": {
        "title": "Lesson 1.11: Flexible Function Arguments with *args and **kwargs",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 11 of 50",
        "cs_foundation": "Variable-Length Positional (*args) and Keyword (**kwargs) Function Signatures",
        "ai_convergence": "Real-World Engineering: Building Dynamic Restaurant Order Bundlers & Query Builders",
        "handbook_markdown": """# Lesson 1.11: Flexible Arguments with *args and **kwargs

When writing reusable functions, you often cannot know ahead of time exactly how many arguments a user will pass. 

For example, a restaurant ordering system might take any number of topping items, or a customer profile updater might receive arbitrary personal fields.

Python solves this with two special symbols:
- **`*args`**: Captures extra positional arguments into a **tuple**.
- **`**kwargs`**: Captures extra keyword arguments (key-value pairs) into a **dictionary**.

---

## 💡 The Real-World Mental Model: The Open Shopping Box & Tagged Crates

Imagine packing for a trip:
1. **Regular Parameters (`destination`, `date`)**: Specific labeled passport slots that require exactly one item.
2. **`*args` (The Duffel Bag)**: An open duffel bag where you toss any number of miscellaneous loose items (keys, water bottle, sunglasses). Python bundles them into an ordered list (tuple).
3. **`**kwargs` (The Tagged Storage Bin)**: A box where every single item has a sticky label attached (`color="blue"`, `size="large"`, `gift_wrap=True`). Python bundles them into a named lookup dictionary.

```
build_order("Table 5", "Burger", "Fries", "Shake", table_type="booth", split_bill=True)
               │          └────────┬────────┘      └──────────────────┬─────────────────┘
               ▼                   ▼                                  ▼
      fixed: table_id     *args (tuple of items)            **kwargs (dict of options)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Using `*args` for Variable Numbers of Items
```python
def calculate_subtotal(*prices: float) -> float:
    # prices is a tuple of all numbers passed in
    return round(sum(prices), 2)

print(calculate_subtotal(5.50, 2.25))               # 7.75
print(calculate_subtotal(10.00, 4.50, 1.25, 3.75))  # 19.50
```

### 2. Using `**kwargs` for Named Custom Settings
```python
def create_user_profile(username: str, **attributes) -> dict:
    # attributes is a dictionary containing all key=value arguments
    profile = {"username": username}
    profile.update(attributes)
    return profile

user = create_user_profile("sarah_c", role="Admin", department="Logistics", active=True)
# Result: {'username': 'sarah_c', 'role': 'Admin', 'department': 'Logistics', 'active': True}
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the function `format_receipt_header(store_name: str, *items: str, **store_info) -> dict`:

1. **Parameters**: Define `def format_receipt_header(store_name: str, *items: str, **store_info) -> dict:`.
2. **Item Count**: Count how many items were passed in `items` (`len(items)`).
3. **Receipt Dictionary**: Construct a dictionary containing:
   - `"store"`: the `store_name` string.
   - `"item_count"`: integer count of items.
   - `"items"`: tuple or list of item names passed via `*items`.
   - `"meta"`: the dictionary of keyword attributes passed via `**store_info`.
4. **Return**: Return this structured dictionary.

---

## ⚠️ Common Pitfalls

- **Argument Ordering**: Non-default fixed parameters must always come first, followed by `*args`, and finally `**kwargs`.
- **The Asterisk Syntax**: The names `args` and `kwargs` are conventions; the single asterisk `*` and double asterisk `**` are what Python actually uses.
""",
        "starter_code": {
            "solution.py": """def format_receipt_header(store_name: str, *items: str, **store_info) -> dict:
    \"\"\"
    Builds a structured receipt summary dictionary from variable arguments.
    \"\"\"
    # TODO: Create and return a dictionary with keys: 'store', 'item_count', 'items', and 'meta'
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Point-of-sale systems handle transactions with varying numbers of purchased items and flexible metadata tags (e.g., cashier ID, store branch, discount codes).",
            "exercise_goal": "Implement format_receipt_header(store_name, *items, **store_info) that returns a dict with store name, item count, items tuple, and meta dictionary.",
            "expected_output": "format_receipt_header('Downtown Books', 'Notebook', 'Pen', branch='North', cashier='Alice') ->\n{'store': 'Downtown Books', 'item_count': 2, 'items': ('Notebook', 'Pen'), 'meta': {'branch': 'North', 'cashier': 'Alice'}}",
            "failure_mode": "Incorrect parameter order or failing to bundle items and store_info into dict correctly.",
            "verification_criteria": "Function accepts variable items via *args and custom tags via **kwargs, returning accurate structured dictionary.",
            "tests.py": """from solution import format_receipt_header

def test_flexible_args():
    res1 = format_receipt_header("Downtown Books", "Notebook", "Pen", branch="North", cashier="Alice")
    assert res1["store"] == "Downtown Books"
    assert res1["item_count"] == 2
    assert "Notebook" in res1["items"]
    assert res1["meta"]["branch"] == "North"
    assert res1["meta"]["cashier"] == "Alice"

    res2 = format_receipt_header("Corner Market")
    assert res2["item_count"] == 0
    assert len(res2["meta"]) == 0

    print("✓ All assertions passed for Lesson 1.11: *args and **kwargs")

if __name__ == '__main__':
    test_flexible_args()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.12: Lambda Functions & Custom Sorting
    # --------------------------------------------------------------------------
    "node-0-12": {
        "title": "Lesson 1.12: Lambda Functions & Custom Key Sorting",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 12 of 50",
        "cs_foundation": "Anonymous Functions (lambda), Higher-Order Functions, and sorted(key=...)",
        "ai_convergence": "Real-World Engineering: Sorting E-Commerce Product Inventories by Price & Rating",
        "handbook_markdown": """# Lesson 1.12: Lambda Functions & Custom Key Sorting

Often in software engineering, you need a quick, throwaway helper function just to tell Python *how* to compare or transform elements.

Instead of writing a full `def` block for a one-line comparison, Python provides **`lambda` expressions**—compact, anonymous single-expression functions.

---

## 💡 The Real-World Mental Model: A Quick Sorting Rule Index Card

Imagine sorting a stack of employee files or warehouse products:
- If you sort by default, Python doesn't know whether to order by price, name, or expiration date.
- A **`lambda` function** is like handing a helper a 1-line index card that says: *"Look at the 'price' field on each tag and order smallest to largest."*

```
Product List: [{"name": "Desk", "price": 150}, {"name": "Lamp", "price": 25}]
                               │
               lambda product: product["price"]
                               │
Sorted List:  [{"name": "Lamp", "price": 25}, {"name": "Desk", "price": 150}]
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The Anatomy of a Lambda
```python
# Standard function:
def get_price(item):
    return item["price"]

# Equivalent lambda expression:
get_price_lambda = lambda item: item["price"]
```

### 2. Sorting Lists of Dictionaries with `sorted()`
```python
products = [
    {"name": "Coffee Maker", "price": 45.00, "rating": 4.8},
    {"name": "Toaster", "price": 20.00, "rating": 4.2},
    {"name": "Blender", "price": 45.00, "rating": 4.5}
]

# Sort by price ascending (cheapest first):
cheapest = sorted(products, key=lambda item: item["price"])

# Multi-criteria sorting: Sort by price ascending, then highest rating first (-item["rating"]):
ranked = sorted(products, key=lambda item: (item["price"], -item["rating"]))
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `sort_products_by_value(products: list[dict]) -> list[dict]`:

1. **Input**: A list of dictionaries, where each dict has `"name"`, `"price"` (float), and `"rating"` (float).
2. **Sorting Rule**: Sort products primarily by **price ascending** (lowest price first). For products with equal price, sort by **rating descending** (highest rating first).
3. **Use `sorted()`**: Return the new sorted list using `sorted(products, key=lambda p: (p["price"], -p["rating"]))`.

---

## ⚠️ Common Pitfalls

- **Lambdas are strictly single expressions**: You cannot write statements like `if ...: return` or assignments inside a lambda.
- **Descending numeric sort**: Negating a number (`-item["rating"]`) easily reverses numeric sorting order in multi-key tuples.
""",
        "starter_code": {
            "solution.py": """def sort_products_by_value(products: list[dict]) -> list[dict]:
    \"\"\"
    Sorts products by price ascending, then by rating descending.
    \"\"\"
    # TODO: Use sorted() with a lambda key to sort and return the products list
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Online retail stores rank catalog search results by budget and customer review ratings to help shoppers find high-value items.",
            "exercise_goal": "Implement sort_products_by_value(products) returning a list sorted by price ascending and rating descending using a lambda key.",
            "expected_output": "sort_products_by_value([\n  {'name': 'A', 'price': 30, 'rating': 4.5},\n  {'name': 'B', 'price': 10, 'rating': 4.0},\n  {'name': 'C', 'price': 30, 'rating': 4.9}\n]) -> [B ($10), C ($30, 4.9), A ($30, 4.5)]",
            "failure_mode": "Sorting in wrong order or mutating original list instead of returning sorted copy.",
            "verification_criteria": "Function returns correctly sorted list of dictionaries matching dual-key criteria.",
            "tests.py": """from solution import sort_products_by_value

def test_lambda_sorting():
    catalog = [
        {"name": "Basic Kettle", "price": 30.0, "rating": 4.2},
        {"name": "Economy Toaster", "price": 15.0, "rating": 4.0},
        {"name": "Premium Kettle", "price": 30.0, "rating": 4.9},
        {"name": "Chef Knife", "price": 50.0, "rating": 4.8}
    ]
    result = sort_products_by_value(catalog)
    assert result[0]["name"] == "Economy Toaster"   # Cheapest $15
    assert result[1]["name"] == "Premium Kettle"   # $30, 4.9 rating
    assert result[2]["name"] == "Basic Kettle"     # $30, 4.2 rating
    assert result[3]["name"] == "Chef Knife"       # $50

    print("✓ All assertions passed for Lesson 1.12: Lambdas & Key Sorting")

if __name__ == '__main__':
    test_lambda_sorting()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.13: Exception Handling: try, except, else & finally
    # --------------------------------------------------------------------------
    "node-0-13": {
        "title": "Lesson 1.13: Exception Handling & Safe Parsing",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 13 of 50",
        "cs_foundation": "Structured Error Handling: try, except, else, finally blocks",
        "ai_convergence": "Real-World Engineering: Gracefully Handling Malformed Sensor Data & File Corruption",
        "handbook_markdown": """# Lesson 1.13: Exception Handling & Safe Parsing

In the real world, programs interact with unpredictable inputs: network connections drop, users submit invalid numbers, and files contain corrupted text.

If you don't anticipate these errors, Python will crash with an unhandled exception. With **`try` and `except`**, your program can intercept errors gracefully and recover.

---

## 💡 The Real-World Mental Model: The Circuit Breaker & Safety Net

Think of electrical fuses in your home:
- When an electrical surge happens, the fuse safely trips (**`except`**) instead of burning down the house.
- The **`try`** block is your attempt to perform a potentially dangerous action.
- The **`except`** block is your safety net if something goes wrong.
- The **`finally`** block is guaranteed cleanup (like turning off the main power switch when leaving).

```
try:
    Attempt risky conversion (e.g. int("not_a_number"))
except ValueError:
    Catch error, log warning, and return default fallback value
finally:
    Always run cleanup
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Handling Specific Exceptions
Never use a bare `except:`; always specify the exact error you anticipate:
```python
def parse_temperature(raw_input: str) -> float | None:
    try:
        # Might raise ValueError if raw_input is "N/A" or "error"
        temp = float(raw_input.strip())
        return temp
    except ValueError:
        # Gracefully handle the conversion failure
        return None
```

### 2. The `try / except / else / finally` Lifecycle
- **`try`**: Code that might fail.
- **`except ErrorType`**: Runs **only** if that error occurs.
- **`else`**: Runs **only** if the `try` block succeeded without any errors.
- **`finally`**: Runs **always**, regardless of whether an exception occurred or was caught.

---

## 🛠️ Step-by-Step Exercise Guide

Implement `safe_divide_inventory(total_items_str: str, boxes_str: str) -> dict`:

1. **Parameters**: Receive two raw string inputs: `total_items_str` and `boxes_str`.
2. **Conversion & Math**: In a `try` block:
   - Convert both to integers: `items = int(total_items_str)` and `boxes = int(boxes_str)`.
   - Compute `items_per_box = items // boxes` and `remainder = items % boxes`.
   - Return `{"success": True, "items_per_box": items_per_box, "remainder": remainder}`.
3. **Catch Specific Errors**:
   - `ValueError`: If strings cannot be parsed to integers, return `{"success": False, "error": "invalid_integer"}`.
   - `ZeroDivisionError`: If `boxes == 0`, return `{"success": False, "error": "zero_division"}`.

---

## ⚠️ Common Pitfalls

- **Catching `Exception` broadly**: Catch specific exceptions (`ValueError`, `ZeroDivisionError`) so you don't accidentally hide unexpected bugs.
- **Not testing failure cases**: Always test both valid inputs and malformed strings to ensure the function never crashes.
""",
        "starter_code": {
            "solution.py": """def safe_divide_inventory(total_items_str: str, boxes_str: str) -> dict:
    \"\"\"
    Safely parses integer inputs and calculates item distribution per box.
    Handles ValueError and ZeroDivisionError gracefully.
    \"\"\"
    # TODO: Implement try/except block to handle conversion and division safely
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Warehouse management software parses user-entered box counts from barcode scanners, which frequently contain invalid characters or zero values.",
            "exercise_goal": "Implement safe_divide_inventory(total_items_str, boxes_str) returning a success dict or error dict on ValueError and ZeroDivisionError.",
            "expected_output": "safe_divide_inventory('100', '4') -> {'success': True, 'items_per_box': 25, 'remainder': 0}\nsafe_divide_inventory('100', '0') -> {'success': False, 'error': 'zero_division'}\nsafe_divide_inventory('abc', '4') -> {'success': False, 'error': 'invalid_integer'}",
            "failure_mode": "Crashing with uncaught ZeroDivisionError or ValueError instead of returning error dict.",
            "verification_criteria": "Function parses valid inputs accurately and returns clean error dictionaries on invalid data without crashing.",
            "tests.py": """from solution import safe_divide_inventory

def test_exception_handling():
    # Valid case
    res1 = safe_divide_inventory("105", "10")
    assert res1["success"] is True
    assert res1["items_per_box"] == 10
    assert res1["remainder"] == 5

    # Zero division case
    res2 = safe_divide_inventory("100", "0")
    assert res2["success"] is False
    assert res2["error"] == "zero_division"

    # Value error case
    res3 = safe_divide_inventory("one_hundred", "5")
    assert res3["success"] is False
    assert res3["error"] == "invalid_integer"

    print("✓ All assertions passed for Lesson 1.13: Exception Handling")

if __name__ == '__main__':
    test_exception_handling()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.14: Custom Exceptions & Defensive Design
    # --------------------------------------------------------------------------
    "node-0-14": {
        "title": "Lesson 1.14: Custom Exceptions & Error Hierarchies",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 14 of 50",
        "cs_foundation": "Custom Exception Classes, Inheriting from Exception, and Error Payloads",
        "ai_convergence": "Real-World Engineering: Building Domain-Specific Validation Errors for Banking Apps",
        "handbook_markdown": """# Lesson 1.14: Custom Exceptions & Error Hierarchies

Standard Python exceptions like `ValueError` and `KeyError` are useful, but in larger systems you need domain-specific exceptions that tell calling code exactly what business rule was violated.

By subclassing `Exception`, you can create meaningful error types that carry custom diagnostic data.

---

## 💡 The Real-World Mental Model: Medical Diagnostic Codes vs Generic 'Sick'

Imagine going to a doctor:
- A generic status of *"Patient is unwell"* (`Exception`) doesn't tell anyone what medicine or protocol to apply.
- A specific diagnostic code like **`InsufficientFundsError`** or **`AccountLockedError`** clearly informs the banking app what action to take (prompt user to deposit money vs notify security).

```
Exception
   └── BankingError
         ├── InsufficientFundsError (balance: 50.00, requested: 120.00)
         └── DailyLimitExceededError (limit: 500.00, requested: 600.00)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Creating a Custom Exception Class
```python
class InsufficientFundsError(Exception):
    def __init__(self, current_balance: float, requested_amount: float):
        self.current_balance = current_balance
        self.requested_amount = requested_amount
        message = f"Cannot withdraw ${requested_amount:.2f}: Current balance is only ${current_balance:.2f}."
        super().__init__(message)
```

### 2. Raising and Catching Custom Errors
```python
def withdraw_money(balance: float, amount: float) -> float:
    if amount > balance:
        raise InsufficientFundsError(balance, amount)
    return round(balance - amount, 2)

try:
    new_balance = withdraw_money(50.00, 100.00)
except InsufficientFundsError as e:
    print(f"Transaction declined: Short by ${e.requested_amount - e.current_balance:.2f}")
```

---

## 🛠️ Step-by-Step Exercise Guide

1. **Define Exception**: Create class `DailyLimitExceededError(Exception)`:
   - In `__init__(self, limit: float, attempted: float)`:
     - Store `self.limit = limit` and `self.attempted = attempted`.
     - Call `super().__init__(f"Attempted ${attempted:.2f} exceeds daily limit of ${limit:.2f}")`.
2. **Implement Guarded Function**: `process_daily_payment(current_spent: float, new_charge: float, daily_limit: float = 500.0) -> float`:
   - Compute `projected_total = current_spent + new_charge`.
   - If `projected_total > daily_limit`, raise `DailyLimitExceededError(daily_limit, projected_total)`.
   - Otherwise, return `round(projected_total, 2)`.

---

## ⚠️ Common Pitfalls

- **Inheriting from `BaseException` instead of `Exception`**: Always inherit from `Exception`. `BaseException` is reserved for system exits and interrupts.
- **Forgetting to call `super().__init__(msg)`**: Calling super ensures standard string formatting and traceback messages work properly.
""",
        "starter_code": {
            "solution.py": """class DailyLimitExceededError(Exception):
    \"\"\"Raised when a payment would exceed the allowed daily spending limit.\"\"\"
    # TODO: Implement __init__ storing limit and attempted, and calling super().__init__
    pass


def process_daily_payment(current_spent: float, new_charge: float, daily_limit: float = 500.0) -> float:
    \"\"\"
    Calculates new total spent or raises DailyLimitExceededError if limit is breached.
    \"\"\"
    # TODO: Check projected total and raise DailyLimitExceededError or return new total
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Debit card processors protect account holders by enforcing daily spending limits and raising structured domain exceptions when limits are breached.",
            "exercise_goal": "Define DailyLimitExceededError and implement process_daily_payment(current_spent, new_charge, daily_limit=500.0) that raises the error or returns new balance.",
            "expected_output": "process_daily_payment(100.0, 50.0) -> 150.00\nprocess_daily_payment(450.0, 100.0) -> Raises DailyLimitExceededError(limit=500.0, attempted=550.0)",
            "failure_mode": "Failing to subclass Exception or failing to raise DailyLimitExceededError with proper attributes.",
            "verification_criteria": "Custom exception properly stores limit and attempted amounts, and function enforces spending guard.",
            "tests.py": """from solution import DailyLimitExceededError, process_daily_payment

def test_custom_exceptions():
    # Valid transaction
    total = process_daily_payment(200.0, 150.0, daily_limit=500.0)
    assert total == 350.0

    # Limit exceeded transaction
    try:
        process_daily_payment(400.0, 150.0, daily_limit=500.0)
        assert False, "Expected DailyLimitExceededError was not raised"
    except DailyLimitExceededError as err:
        assert err.limit == 500.0
        assert err.attempted == 550.0

    print("✓ All assertions passed for Lesson 1.14: Custom Exceptions")

if __name__ == '__main__':
    test_custom_exceptions()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.15: Standard Library & Pathlib Filesystem
    # --------------------------------------------------------------------------
    "node-0-15": {
        "title": "Lesson 1.15: Python Standard Library & Pathlib",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 15 of 50",
        "cs_foundation": "Cross-Platform File Paths with pathlib.Path, File Extensions, and Directory Navigation",
        "ai_convergence": "Real-World Engineering: Organizing Daily Sales Reports & Invoice File Paths",
        "handbook_markdown": """# Lesson 1.15: Python Standard Library & Pathlib

Different operating systems handle file paths differently: Windows uses backslashes (`C:\\Users\\docs`), while Linux and macOS use forward slashes (`/home/user/docs`).

Writing file paths with plain string concatenation leads to bugs when code runs on a different computer. Python's built-in **`pathlib`** module provides a modern, cross-platform object-oriented way to work with file paths.

---

## 💡 The Real-World Mental Model: GPS Coordinates vs Written Street Directions

- If you write street directions for one specific car, it might not work on a bike path or in another country.
- **`pathlib.Path`** is like a universal GPS navigation system: you specify folders and filenames, and Python automatically uses the correct slashes and separators for the current operating system.

```
Path("reports") / "2026" / "january_sales.csv"
   ├── On Windows: reports\\2026\\january_sales.csv
   └── On Linux/Mac: reports/2026/january_sales.csv
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Combining Paths with the `/` Slash Operator
`pathlib.Path` overloads the `/` division operator to cleanly join directories:
```python
from pathlib import Path

base_folder = Path("store_records")
invoice_path = base_folder / "invoices" / "invoice_1042.pdf"

print(invoice_path.name)      # "invoice_1042.pdf" (Full filename)
print(invoice_path.stem)      # "invoice_1042" (Name without extension)
print(invoice_path.suffix)    # ".pdf" (File extension)
print(invoice_path.parent)    # Path("store_records/invoices")
```

### 2. Checking File Existence and Creating Folders
```python
# Create directory structure if it does not exist:
invoice_path.parent.mkdir(parents=True, exist_ok=True)

# Check if file exists:
if invoice_path.exists():
    print("File is ready for processing")
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `build_monthly_report_path(base_dir: str, year: int, month_name: str, department: str) -> str`:

1. **Convert to Path**: Create `base = Path(base_dir)`.
2. **Build Path**: Combine paths using `/`:
   - `year_folder = str(year)`
   - `file_name = f"{department.lower()}_{month_name.lower()}_report.csv"`
   - `full_path = base / year_folder / file_name`
3. **Return String**: Return `str(full_path)`.

---

## ⚠️ Common Pitfalls

- **Avoid raw string concatenation**: Never write `base_dir + "/" + file_name`; always use `Path(base_dir) / file_name`.
- **Remembering `.suffix` includes the dot**: The `.suffix` attribute returns `'.csv'` with the leading period.
""",
        "starter_code": {
            "solution.py": """from pathlib import Path

def build_monthly_report_path(base_dir: str, year: int, month_name: str, department: str) -> str:
    \"\"\"
    Builds a clean, cross-platform file path for department monthly reports.
    Example: base_dir/2026/sales_january_report.csv
    \"\"\"
    # TODO: Use pathlib.Path to construct and return the file path as a string
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Accounting automation tools construct standardized, cross-platform file paths when saving monthly financial spreadsheets across different operating systems.",
            "exercise_goal": "Implement build_monthly_report_path(base_dir, year, month_name, department) returning a normalized file path string using pathlib.Path.",
            "expected_output": "build_monthly_report_path('archive', 2026, 'January', 'Sales') -> 'archive/2026/sales_january_report.csv'",
            "failure_mode": "Failing to use Path objects or constructing incorrect lowercase filename patterns.",
            "verification_criteria": "Function returns standardized cross-platform path string matching year and sanitized department report name.",
            "tests.py": """from solution import build_monthly_report_path
from pathlib import Path

def test_pathlib_builder():
    p_str = build_monthly_report_path("company_vault", 2026, "March", "Logistics")
    p = Path(p_str)
    
    assert p.name == "logistics_march_report.csv"
    assert p.parent.name == "2026"
    assert p.suffix == ".csv"

    print("✓ All assertions passed for Lesson 1.15: Pathlib & Standard Library")

if __name__ == '__main__':
    test_pathlib_builder()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.16: Generators & The yield Keyword
    # --------------------------------------------------------------------------
    "node-0-16": {
        "title": "Lesson 1.16: Generators & Memory-Efficient Iteration",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 16 of 50",
        "cs_foundation": "Generators, Iterators, and Lazy Evaluation with the yield Keyword",
        "ai_convergence": "Real-World Engineering: Streaming Large Server Logs & Order Batch Records",
        "handbook_markdown": """# Lesson 1.16: Generators & Memory-Efficient Iteration

When processing large datasets—such as millions of transaction records or gigabytes of log files—loading everything into a Python `list` all at once can quickly consume all your computer's RAM.

A **generator** produces items one by one on demand using the **`yield`** keyword, keeping memory usage near zero.

---

## 💡 The Real-World Mental Model: A Water Bottle vs A Flowing Kitchen Tap

- **A List (`return [1, 2, 3, ...]`)**: Like filling a giant 1,000-gallon water tank in your living room before taking a single sip. It requires enormous physical space.
- **A Generator (`yield item`)**: Like turning on a kitchen faucet. Water flows only when you open the tap, one cup at a time, without ever needing to store the whole reservoir.

```
Standard Function (List):
[Item 1, Item 2, Item 3, ..., Item 1,000,000] -> High Memory Usage (Gigabytes)

Generator (yield):
Generate Item 1 -> Hand to loop -> Discard -> Generate Item 2 -> Hand to loop
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The `yield` Keyword
When Python encounters `yield`, it pauses function execution, returns the current value to the caller, and remembers its exact state until the next item is requested:

```python
def count_down(start: int):
    while start > 0:
        yield start
        start -= 1

# Using the generator in a loop:
for number in count_down(3):
    print(number)  # Prints 3, then 2, then 1
```

### 2. Chunking Batches on Demand
```python
def batch_records(items: list, batch_size: int):
    for i in range(0, len(items), batch_size):
        yield items[i : i + batch_size]
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `generate_filtered_transactions(transactions: list[dict], min_amount: float)`:

1. **Parameters**: Receive `transactions` (list of dicts with `"id"` and `"amount"`) and `min_amount` (float).
2. **Loop & Yield**:
   - Loop over each transaction in `transactions`.
   - If `transaction["amount"] >= min_amount`:
     - **`yield`** the transaction dictionary.
3. **Memory Note**: Do **not** create a temporary list; yield items directly as they match.

---

## ⚠️ Common Pitfalls

- **Do not return a list**: If you write `return [item for ...]`, you defeat the purpose of lazy generator evaluation.
- **Generators can only be iterated once**: Once a generator reaches its end, it is exhausted. To iterate again, call the generator function fresh.
""",
        "starter_code": {
            "solution.py": """def generate_filtered_transactions(transactions: list[dict], min_amount: float):
    \"\"\"
    Yields transactions one by one whose amount meets or exceeds min_amount.
    \"\"\"
    # TODO: Iterate over transactions and yield matching records lazily
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Financial fraud detection scanners stream through millions of transactions one at a time to filter high-value charges without overloading server memory.",
            "exercise_goal": "Implement generate_filtered_transactions(transactions, min_amount) as a generator that yields matching records lazily.",
            "expected_output": "list(generate_filtered_transactions([{'id': 1, 'amount': 20.0}, {'id': 2, 'amount': 150.0}], 100.0)) -> [{'id': 2, 'amount': 150.0}]",
            "failure_mode": "Returning a materialized list instead of using yield, or filtering incorrectly.",
            "verification_criteria": "Function is an inspectable generator yielding matching records one by one.",
            "tests.py": """import types
from solution import generate_filtered_transactions

def test_generator_filtering():
    data = [
        {"id": 101, "amount": 45.00},
        {"id": 102, "amount": 250.00},
        {"id": 103, "amount": 12.50},
        {"id": 104, "amount": 500.00}
    ]
    gen = generate_filtered_transactions(data, 100.00)
    
    # Verify it is a generator object
    assert isinstance(gen, types.GeneratorType), "Must be a generator using yield"

    results = list(gen)
    assert len(results) == 2
    assert results[0]["id"] == 102
    assert results[1]["id"] == 104

    print("✓ All assertions passed for Lesson 1.16: Generators & yield")

if __name__ == '__main__':
    test_generator_filtering()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.17: Function Decorators & @functools.wraps
    # --------------------------------------------------------------------------
    "node-0-17": {
        "title": "Lesson 1.17: Function Decorators & Behavior Wrapping",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 17 of 50",
        "cs_foundation": "Decorators, Higher-Order Function Wrappers, and @functools.wraps",
        "ai_convergence": "Real-World Engineering: Adding Automated Logging & Execution Timing to Business Logic",
        "handbook_markdown": """# Lesson 1.17: Function Decorators & Behavior Wrapping

In software development, you frequently want to add common behavior—such as execution logging, performance timing, or authentication checks—to dozens of functions without copying and pasting the same boilerplate code into every single one.

A **decorator** is a function that takes another function as input, wraps extra behavior around it, and returns the enhanced function.

---

## 💡 The Real-World Mental Model: The Security Envelope

Imagine sending an important legal document:
- The core document contains the contract text (**your original function**).
- Before sending it, you place it inside a certified registered envelope (**the decorator**).
- The envelope adds certified tracking stamps and security verification before the letter is opened, without changing the words inside the letter itself.

```
@log_transaction
def process_order(order_id):
    ...
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. How a Decorator Works
In Python, functions are first-class objects (they can be passed into other functions as arguments):

```python
import functools

def announce_action(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Starting {func.__name__}...")
        result = func(*args, **kwargs)
        print(f"Finished {func.__name__}!")
        return result
    return wrapper

@announce_action
def bake_bread():
    print("Baking loaf...")
```

### 2. The Importance of `@functools.wraps`
Without `@functools.wraps(func)`, Python replaces the original function's name and documentation with `'wrapper'`. Using `wraps` preserves the original identity and debugging info.

---

## 🛠️ Step-by-Step Exercise Guide

Implement the decorator `convert_result_to_currency`:

1. **Define Decorator**: Create `def convert_result_to_currency(func):`.
2. **Define Wrapper**: Inside, create `@functools.wraps(func)` decorated `def wrapper(*args, **kwargs):`.
   - Call `val = func(*args, **kwargs)`.
   - Format the returned float as a currency string: `f"${val:.2f}"`.
   - Return this formatted string.
3. **Return Wrapper**: Return `wrapper`.

---

## ⚠️ Common Pitfalls

- **Forgetting `*args, **kwargs` in the wrapper**: Always accept `*args, **kwargs` and pass them to `func(*args, **kwargs)` so your decorator works with any function signature.
- **Forgetting to return the result**: The wrapper must return the result of calling `func`.
""",
        "starter_code": {
            "solution.py": """import functools

def convert_result_to_currency(func):
    \"\"\"
    Decorator that formats a function's numeric return value into a '$X.XX' currency string.
    \"\"\"
    # TODO: Implement wrapper with @functools.wraps(func) that formats return value
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Financial reporting pipelines use decorators to automatically format raw floating-point calculation results into human-readable currency strings.",
            "exercise_goal": "Implement convert_result_to_currency decorator that wraps a numeric function and returns its result formatted as a '$X.XX' string.",
            "expected_output": "@convert_result_to_currency\ndef get_total(): return 42.5\nget_total() -> '$42.50'",
            "failure_mode": "Failing to preserve function metadata with @functools.wraps or failing to format currency string with 2 decimal places.",
            "verification_criteria": "Decorator correctly intercepts returned float, formats as $X.XX, and preserves original function name.",
            "tests.py": """from solution import convert_result_to_currency

def test_currency_decorator():
    @convert_result_to_currency
    def calculate_price(unit_price: float, quantity: int) -> float:
        \"\"\"Calculates order price.\"\"\"
        return unit_price * quantity

    # Check output
    assert calculate_price(12.5, 3) == "$37.50"
    assert calculate_price(10.0, 1) == "$10.00"
    
    # Check that metadata is preserved
    assert calculate_price.__name__ == "calculate_price"

    print("✓ All assertions passed for Lesson 1.17: Decorators & Wrappers")

if __name__ == '__main__':
    test_currency_decorator()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.18: Context Managers & The with Statement
    # --------------------------------------------------------------------------
    "node-0-18": {
        "title": "Lesson 1.18: Context Managers & Resource Management",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 18 of 50",
        "cs_foundation": "Context Manager Protocol (__enter__, __exit__) and Guaranteed Resource Cleanup",
        "ai_convergence": "Real-World Engineering: Safely Managing Database Connections & Execution Loggers",
        "handbook_markdown": """# Lesson 1.18: Context Managers & Resource Management

When software opens external resources—such as files, network connections, or database locks—failing to close them causes **resource leaks** that can crash your operating system.

Python's **`with` statement** and the **context manager protocol** guarantee that cleanup happens automatically, even if an unexpected error occurs during execution.

---

## 💡 The Real-World Mental Model: Borrowing a Key from Hotel Reception

Imagine checking into a hotel:
1. **`__enter__` (Check-in)**: Reception hands you the room key and marks the room occupied.
2. **Inside the `with` block**: You use the room for your stay.
3. **`__exit__` (Check-out)**: No matter what happened during your stay (even if you had to leave in an emergency), the hotel guarantees the key is returned and the room is cleaned.

```
with DatabaseSession() as session:
    session.save(record)
# The database connection is GUARANTEED to close right here automatically!
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The `__enter__` and `__exit__` Protocol
```python
class SimpleFileLogger:
    def __init__(self, filename: str):
        self.filename = filename
        self.file = None

    def __enter__(self):
        self.file = open(self.filename, "a")
        self.file.write("=== SESSION STARTED ===\\n")
        return self.file

    def __exit__(self, exc_type, exc_val, exc_tb):
        if self.file:
            self.file.write("=== SESSION ENDED ===\\n")
            self.file.close()
        # Return False so any errors propagate normally
        return False
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the context manager class `ExecutionTimer`:

1. **`__init__(self)`**: Initialize `self.duration_seconds = 0.0` and `self._start_time = None`.
2. **`__enter__(self)`**:
   - Record `self._start_time = time.time()`.
   - Return `self`.
3. **`__exit__(self, exc_type, exc_val, exc_tb)`**:
   - Record `end_time = time.time()`.
   - Calculate `self.duration_seconds = round(end_time - self._start_time, 4)`.
   - Return `False`.

---

## ⚠️ Common Pitfalls

- **Forgetting `return self` in `__enter__`**: If you write `with ExecutionTimer() as timer:`, `timer` receives whatever `__enter__` returns.
- **Returning `True` in `__exit__` accidentally**: Returning `True` suppresses all exceptions inside the block, hiding real bugs.
""",
        "starter_code": {
            "solution.py": """import time

class ExecutionTimer:
    \"\"\"
    Context manager that records the elapsed execution time of a code block.
    \"\"\"
    def __init__(self):
        self.duration_seconds = 0.0
        self._start_time = None

    def __enter__(self):
        # TODO: Record start time and return self
        pass

    def __exit__(self, exc_type, exc_val, exc_tb):
        # TODO: Calculate duration_seconds and return False
        pass
"""
        },
        "test_suite": {
            "exercise_about": "Performance monitoring frameworks use context managers to measure execution duration of critical financial transactions and database operations.",
            "exercise_goal": "Implement ExecutionTimer context manager with __enter__ and __exit__ to measure elapsed block duration in duration_seconds.",
            "expected_output": "with ExecutionTimer() as timer:\n    time.sleep(0.05)\ntimer.duration_seconds >= 0.04",
            "failure_mode": "Failing to implement __enter__ and __exit__ correctly or returning wrong reference.",
            "verification_criteria": "Context manager accurately captures duration_seconds on clean exit.",
            "tests.py": """import time
from solution import ExecutionTimer

def test_execution_timer():
    with ExecutionTimer() as timer:
        time.sleep(0.05)
    
    assert timer.duration_seconds >= 0.04
    assert isinstance(timer.duration_seconds, float)

    print("✓ All assertions passed for Lesson 1.18: Context Managers")

if __name__ == '__main__':
    test_execution_timer()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.19: Lists In Depth: Mutation, Slicing & Copying
    # --------------------------------------------------------------------------
    "node-0-19": {
        "title": "Lesson 1.19: Lists In Depth: Mutation & Independent Copies",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 19 of 50",
        "cs_foundation": "Dynamic Array Memory Semantics, Shallow vs Deep Copies, and In-Place Mutations",
        "ai_convergence": "Real-World Engineering: Safely Modifying Customer Order Histories Without Corrupting Originals",
        "handbook_markdown": """# Lesson 1.19: Lists In Depth: Mutation & Independent Copies

In Python, lists are **mutable** objects stored by reference. If you assign `list_b = list_a`, both variables point to the *exact same memory location*. Modifying `list_b` will secretly alter `list_a`!

Understanding how to create true independent copies is critical for preventing subtle data corruption bugs in production systems.

---

## 💡 The Real-World Mental Model: Two Keys to the Same Locker vs A Photocopied Sheet

- **Reference Assignment (`list_b = list_a`)**: Giving someone a second key to the same physical storage locker. If they open the locker and take an item, your locker is now empty.
- **Deep Copy (`copy.deepcopy(list_a)`)**: Printing a fresh photocopy of a document. Writing notes on your copy has zero effect on the original document.

```
list_a = [{"item": "Shirt", "qty": 1}]
list_b = list_a.copy()            # Shallow copy (inner dictionaries are still shared!)
list_c = copy.deepcopy(list_a)    # Deep copy (completely independent duplicate)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Shallow Copy vs Deep Copy
- **Shallow Copy (`list.copy()` or `list[:]`)**: Copies the outer list, but any nested dictionaries or lists inside are still shared references.
- **Deep Copy (`copy.deepcopy()`)**: Recursively copies all nested objects at every level.

```python
import copy

original_order = [{"item": "Latte", "price": 4.50}]

# Independent duplicate
archived_order = copy.deepcopy(original_order)
archived_order[0]["price"] = 5.00

print(original_order[0]["price"])  # Still 4.50 (Protected!)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `duplicate_and_apply_discount(order_items: list[dict], discount_percent: float) -> list[dict]`:

1. **Independent Copy**: Use `copy.deepcopy(order_items)` to create a completely new duplicate list of item dictionaries.
2. **Apply Discount**:
   - For each item in the duplicate list:
     - Reduce `"price"` by `discount_percent`: `item["price"] = round(item["price"] * (1 - discount_percent / 100), 2)`.
3. **Return**: Return the discounted duplicate list.
4. **Safety Verification**: Ensure the `order_items` passed in by the caller remains completely unchanged.

---

## ⚠️ Common Pitfalls

- **Using `.copy()` on nested dictionaries**: A shallow copy will still mutate the inner dicts. Always use `copy.deepcopy()` when dealing with lists of dictionaries.
""",
        "starter_code": {
            "solution.py": """import copy

def duplicate_and_apply_discount(order_items: list[dict], discount_percent: float) -> list[dict]:
    \"\"\"
    Returns an independent deep copy of order_items with discounted prices,
    ensuring the original order_items list is not mutated.
    \"\"\"
    # TODO: Deepcopy order_items, apply discount percentage to each price, and return
    pass
"""
        },
        "test_suite": {
            "exercise_about": "E-commerce promotion engines generate preview bills with applied coupon discounts while keeping original cart databases pristine.",
            "exercise_goal": "Implement duplicate_and_apply_discount(order_items, discount_percent) using copy.deepcopy without mutating the input list.",
            "expected_output": "duplicate_and_apply_discount([{'name': 'Book', 'price': 20.0}], 10.0) -> [{'name': 'Book', 'price': 18.0}]\n(Original list retains price 20.0)",
            "failure_mode": "Mutating original order_items input or using shallow copy causing shared state corruption.",
            "verification_criteria": "Original list is unmodified; returned list has correctly discounted prices.",
            "tests.py": """from solution import duplicate_and_apply_discount

def test_list_deep_copy():
    original = [
        {"name": "Espresso Machine", "price": 100.00},
        {"name": "Coffee Beans", "price": 20.00}
    ]
    discounted = duplicate_and_apply_discount(original, 20.0) # 20% off
    
    # Check discounted prices
    assert discounted[0]["price"] == 80.00
    assert discounted[1]["price"] == 16.00

    # Verify original was NOT mutated
    assert original[0]["price"] == 100.00
    assert original[1]["price"] == 20.00

    print("✓ All assertions passed for Lesson 1.19: List Copying & Mutation")

if __name__ == '__main__':
    test_list_deep_copy()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.20: List & Dict Comprehensions
    # --------------------------------------------------------------------------
    "node-0-20": {
        "title": "Lesson 1.20: List & Dict Comprehensions: Idiomatic Transforms",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 20 of 50",
        "cs_foundation": "Comprehension Syntax, Filtering with if, and Transforming Key-Value Lookups",
        "ai_convergence": "Real-World Engineering: Normalizing Customer Form Entries & Indexing Catalogs",
        "handbook_markdown": """# Lesson 1.20: List & Dict Comprehensions

Transforming, cleaning, and filtering data collections is one of the most common tasks in programming. 

Instead of writing verbose 4-line `for` loops with `.append()` calls, Python provides **comprehensions**—concise, expressive one-line expressions that build new lists, dictionaries, or sets.

---

## 💡 The Real-World Mental Model: An Assembly Line Sifter

Imagine an automated factory sorting fruits:
1. **Input**: A crate of mixed fruits (`"  Apple  "`, `"bad_banana"`, `"  ORANGE  "`).
2. **Filter (`if`)**: Discard any item labeled bad or spoiled.
3. **Transform (`expr`)**: Wash and label the remaining fruits into clean, lowercase names.
4. **Result**: A pristine new crate of filtered, ready-to-sell fruits.

```
[clean_format(item) for item in raw_items if is_valid(item)]
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. List Comprehensions
```python
raw_emails = ["  Alice@Domain.COM ", "Bob@work.org", "INVALID_ENTRY"]

# Clean valid emails:
clean_emails = [
    email.strip().lower() 
    for email in raw_emails 
    if "@" in email
]
# Result: ['alice@domain.com', 'bob@work.org']
```

### 2. Dict Comprehensions
You can transform pairs into a fast key-value lookup dictionary:
```python
employees = [("emp_101", "Alice"), ("emp_102", "Bob")]

# Index by employee ID:
employee_lookup = {emp_id: name for emp_id, name in employees}
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `clean_and_index_inventory(raw_catalog: list[dict]) -> dict[str, float]`:

1. **Input**: A list of product dicts: `[{"sku": "  SKU-101  ", "price": 25.50, "in_stock": True}, ...]`.
2. **Transform & Filter**: Use a **dict comprehension** to:
   - Include only items where `item["in_stock"] is True` and `item["price"] > 0`.
   - Strip whitespace and uppercase the SKU: `item["sku"].strip().upper()`.
   - Map each cleaned SKU to its price: `{cleaned_sku: item["price"] ...}`.
3. **Return**: The resulting dictionary mapping SKU strings to float prices.

---

## ⚠️ Common Pitfalls

- **Avoid deeply nested comprehensions**: If comprehension logic exceeds one or two clauses, break it into a standard `for` loop for readability.
""",
        "starter_code": {
            "solution.py": """def clean_and_index_inventory(raw_catalog: list[dict]) -> dict[str, float]:
    \"\"\"
    Uses a dict comprehension to return a {clean_sku: price} mapping
    for items that are in_stock and have price > 0.
    \"\"\"
    # TODO: Implement dict comprehension filtering in_stock items and stripping SKU whitespace
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Retail inventory parsers normalize incoming CSV product records, discarding out-of-stock items and indexing clean SKUs for fast checkout lookup.",
            "exercise_goal": "Implement clean_and_index_inventory(raw_catalog) returning a {clean_sku: price} dict using a dict comprehension.",
            "expected_output": "clean_and_index_inventory([{'sku': '  a1  ', 'price': 10.0, 'in_stock': True}]) -> {'A1': 10.0}",
            "failure_mode": "Failing to filter out of stock items or failing to clean SKU formatting.",
            "verification_criteria": "Function returns correct dictionary mapping clean uppercase SKUs to prices using idiomatic comprehension.",
            "tests.py": """from solution import clean_and_index_inventory

def test_comprehensions():
    catalog = [
        {"sku": "  sku_apple  ", "price": 1.50, "in_stock": True},
        {"sku": "sku_banana", "price": 0.75, "in_stock": False}, # Out of stock
        {"sku": "  SKU_CHERRY  ", "price": 3.00, "in_stock": True},
        {"sku": "sku_zero", "price": 0.00, "in_stock": True}      # Zero price
    ]
    result = clean_and_index_inventory(catalog)
    
    assert result == {
        "SKU_APPLE": 1.50,
        "SKU_CHERRY": 3.00
    }

    print("✓ All assertions passed for Lesson 1.20: List & Dict Comprehensions")

if __name__ == '__main__':
    test_comprehensions()
"""
        }
    }
}

def apply_patch():
    print(f"Applying patch to {len(LESSONS_11_20)} lessons (node-0-11 to node-0-20)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for node_id, data in LESSONS_11_20.items():
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
