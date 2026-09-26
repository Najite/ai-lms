#!/usr/bin/env python3
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
            k = k.strip()
            v = v.strip().strip("'").strip('"')
            if k == "SUPABASE_SERVICE_ROLE_KEY" and not API_KEY:
                API_KEY = v
            elif k == "SUPABASE_ANON_KEY" and not API_KEY:
                API_KEY = v
            elif k == "NEXT_PUBLIC_SUPABASE_URL" and not SUPABASE_URL:
                SUPABASE_URL = v
            elif k == "SUPABASE_URL" and not SUPABASE_URL:
                SUPABASE_URL = v

if not API_KEY or not SUPABASE_URL:
    raise RuntimeError("Missing SUPABASE credentials in .env")

lesson1_handbook = """# Lesson 1.1: Python Basics & Data Types

Every computer program in the world works with information. When you buy groceries, order a coffee, or pay a bill online, a computer must store and process that information.

To do this correctly, Python must know what **kind** of information each value is. This is known as a **data type**.

---

## 💡 The Real-World Mental Model: Physical Storage Boxes

Imagine you are unpacking groceries at home into specific storage containers:

- **Text Box (`str`)**: Labeled storage for words, names, and labels. Like writing "Apples" on a chalkboard.
- **Whole Number Box (`int`)**: Labeled storage for counting items. You buy 3 apples, not 3.4 apples.
- **Decimal Box (`float`)**: Labeled storage for measurements and money. An apple costs $1.25, which has cents.
- **Yes/No Box (`bool`)**: Labeled storage for a simple switch: `True` or `False`. (Is the store open? `True`).

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  String (str)   │   │  Integer (int)  │   │  Float (float)  │   │  Boolean (bool) │
│   Text / Names  │   │  Whole Numbers  │   │ Decimals/Prices │   │    True/False   │
│   "Fresh Apple" │   │        4        │   │      2.50       │   │       True      │
└─────────────────┘   └─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## 🔍 Deep Dive: The Core Concept

### 1. Variables Hold Your Information
A **variable** is simply a friendly name you give to a value so you can reuse it later. Think of it like sticking a name tag onto a box:

```python
item_name = "Apples"
quantity = 4
unit_price = 2.50
in_stock = True
```

Python automatically recognizes:
- `"Apples"` in quotes is a **string** (`str`).
- `4` with no decimal point is an **integer** (`int`).
- `2.50` with a decimal point is a **float** (`float`).
- `True` is a **boolean** (`bool`).

---

### 2. The Real-World Problem: Everything Starts as Plain Text

When a customer types their order into a website or scans a barcode at a grocery checkout register, the computer initially receives **everything as plain text (`str`)**:

```python
raw_quantity = "4"     # Notice the quotes: Python sees this as text!
raw_price = "2.50"     # Python sees this as characters, not money!
```

If you try to do math directly on text, Python either crashes or gives you unexpected results:

```python
# What happens if you try to add text?
"4" + "4"  # Result: "44" (Python glued the words together!)

# What happens if you try to multiply text by money?
"4" * "2.50"  # Crash! TypeError: can't multiply sequence by non-int
```

---

### 3. The Solution: Explicit Type Conversion

To calculate a bill or update an inventory count, you must convert the incoming text into proper numbers using Python's built-in converter functions:

- `int("4")` converts the text `"4"` into the whole number `4`.
- `float("2.50")` converts the text `"2.50"` into the decimal number `2.50`.

```python
# Clean conversion from text to numbers:
quantity = int(raw_quantity)      # Now quantity is the integer 4
price = float(raw_price)          # Now price is the decimal 2.50

# Now arithmetic works accurately:
total_cost = quantity * price     # 4 * 2.50 = 10.0
```

---

## 🛠️ Step-by-Step Exercise Guide

You are setting up the cashier register system for a neighborhood store.

Two values have arrived from the checkout scanner as raw text:
1. `raw_quantity = "5"` (the number of items purchased)
2. `raw_price = "3.20"` (the price per item in dollars)

Your task:
1. Convert `raw_quantity` into an integer and assign it to a variable named `quantity`.
2. Convert `raw_price` into a float and assign it to a variable named `price`.
3. Multiply `quantity` by `price` and assign the result to a variable named `total_cost`.

---

## ⚠️ Common Pitfalls

- **Leaving quotes around converted numbers**: `quantity = "5"` is still text. Write `quantity = int(raw_quantity)` without quotes.
- **Using the wrong converter**: Converting `"3.20"` with `int("3.20")` will cause a `ValueError` because an integer cannot have a decimal point. Always use `float()` for numbers with decimals.
- **Exact variable names**: Python is case-sensitive. `total_cost` is not the same as `Total_Cost` or `totalcost`.

---

## 🎯 Quick Self-Check

- Why does `"5"` + `"5"` equal `"55"` instead of `10`?
- Which converter function would you use for a customer's age? (`int` or `float`?)
- Which converter function would you use for an item's weight in kilograms (e.g. `1.75`)?
"""

starter_code = {
    "solution.py": """# Grocery Checkout Register: Converting Raw Scanner Inputs
# When items are scanned, the values arrive as plain text (strings).

raw_quantity = "5"
raw_price = "3.20"

# Step 1: Convert raw_quantity to an integer
quantity = int(raw_quantity)

# Step 2: Convert raw_price to a float (decimal)
price = float(raw_price)

# Step 3: Calculate the total cost (quantity multiplied by price)
total_cost = quantity * price
"""
}

# The learner's initial starter code gives clear guidance and blanks:
initial_starter_code = {
    "solution.py": """# Grocery Checkout Register: Converting Raw Scanner Inputs
# When items are scanned, the values arrive as plain text (strings).

raw_quantity = "5"
raw_price = "3.20"

# TODO 1: Convert raw_quantity into an integer
quantity = ...

# TODO 2: Convert raw_price into a float (decimal number)
price = ...

# TODO 3: Calculate the total cost by multiplying quantity and price
total_cost = ...
"""
}

test_suite = {
    "tests.py": """from solution import quantity, price, total_cost

# Test 1: Verify quantity is an integer with the correct value
assert isinstance(quantity, int), f"Expected quantity to be int, but got {type(quantity).__name__}"
assert quantity == 5, f"Expected quantity to equal 5, got {quantity}"

# Test 2: Verify price is a float with the correct value
assert isinstance(price, float), f"Expected price to be float, but got {type(price).__name__}"
assert price == 3.20, f"Expected price to equal 3.20, got {price}"

# Test 3: Verify total_cost is calculated correctly
assert isinstance(total_cost, float), f"Expected total_cost to be float, but got {type(total_cost).__name__}"
assert round(total_cost, 2) == 16.00, f"Expected total_cost to equal 16.00, got {total_cost}"

print("✓ All checks passed! You successfully converted text inputs and computed the receipt total.")
""",
    "verification_criteria": "Convert raw_quantity to int, raw_price to float, and calculate total_cost.",
    "failure_mode": "Performing arithmetic directly on raw text strings without explicit int() or float() conversion."
}

defense_prompts = [
    "Why does Python treat \"5\" differently than the number 5?",
    "What error happens if you try to pass \"3.20\" to int() instead of float()?",
    "In a real checkout system, what would happen if total_cost was calculated as \"5\" * \"3.20\"?"
]

payload = {
    "title": "Lesson 1.1: Python Basics & Data Types",
    "subtitle": "Module 1: Python Programming Foundations | Lesson 1 of 50",
    "cs_foundation": "Core Primitive Data Types: str, int, float, bool, and explicit type casting",
    "ai_convergence": "Real-World Data Processing: Parsing and converting raw input data into typed numeric values",
    "handbook_markdown": lesson1_handbook,
    "starter_code": initial_starter_code,
    "test_suite": test_suite,
    "defense_prompts": defense_prompts,
    "content_status": "reviewed"
}

url = f"{SUPABASE_URL.rstrip('/')}/rest/v1/curriculum_nodes?id=eq.node-0-1"
data = json.dumps(payload).encode("utf-8")
headers = {
    "apikey": API_KEY,
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

req = urllib.request.Request(url, data=data, headers=headers, method="PATCH")
ctx = ssl.create_default_context()

with urllib.request.urlopen(req, context=ctx, timeout=30) as resp:
    res = json.loads(resp.read().decode("utf-8"))
    print("Successfully updated Lesson 1.1 in Supabase:")
    print("ID:", res[0]["id"])
    print("Title:", res[0]["title"])
    print("Verification Criteria:", res[0]["test_suite"]["verification_criteria"])
