#!/usr/bin/env python3
"""
Database patcher for Lessons 1.1 to 1.10 (node-0-1 through node-0-10).
Populates curriculum handbooks, starter code, test suites, and rich 3-part
exercise briefing metadata (exercise_about, exercise_goal, expected_output).
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

LESSONS = {
    # --------------------------------------------------------------------------
    # LESSON 1.1: Data Types & Type Casting
    # --------------------------------------------------------------------------
    "node-0-1": {
        "title": "Lesson 1.1: Python Basics & Data Types",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 1 of 50",
        "cs_foundation": "Primitive Types (int, float, str, bool), Variables, and Explicit Type Casting",
        "ai_convergence": "Real-World Engineering: Converting Incoming Web Form String Data into Numbers for Checkout Billing",
        "handbook_markdown": """# Lesson 1.1: Python Basics & Data Types

When software receives data from user inputs, web forms, or external files, everything almost always arrives as plain text (strings).

Before a computer can calculate a receipt total, check an inventory count, or process a payment, it must convert that raw text into the appropriate numerical data type.

---

## 💡 The Real-World Mental Model: Labeled Storage Bins

Think of Python data types like labeled storage bins in a workshop:
- **`str` (Text String)**: Words, names, or unparsed text enclosed in quotes: `"Wireless Mouse"`, `"4"`, `"12.50"`.
- **`int` (Integer)**: Whole counting numbers with no decimal point: `4`, `10`, `-2`.
- **`float` (Floating-Point Number)**: Decimal numbers representing measurements or money: `12.50`, `99.99`.
- **`bool` (Boolean)**: Exact truth values: `True` or `False`.

```
┌────────────────────────────────────────────────────────┐
│               Type Conversion (Casting)                │
│  "4"     ─── int("4")   ───> 4      (Integer)         │
│  "12.50" ─── float("12.50") ─> 12.50  (Float)          │
└────────────────────────────────────────────────────────┘
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Why Type Casting is Mandatory
If you try to multiply raw string values:
```python
raw_quantity = "4"
raw_unit_price = "12.50"
# WRONG: Multiplying strings causes a TypeError!
# raw_quantity * raw_unit_price  -> ERROR
```

To calculate the subtotal correctly, you must explicitly convert (cast) the strings:
```python
quantity = int(raw_quantity)       # Converts "4" to integer 4
unit_price = float(raw_unit_price) # Converts "12.50" to float 12.50
total_price = quantity * unit_price # 4 * 12.50 = 50.0
```

---

## 🛠️ Step-by-Step Exercise Guide

Complete the checkout data conversion using the provided starter variables:

1. **Convert `raw_quantity`**: Use `int(raw_quantity)` and assign it to `quantity`.
2. **Convert `raw_unit_price`**: Use `float(raw_unit_price)` and assign it to `unit_price`.
3. **Calculate `total_price`**: Multiply `quantity` by `unit_price` (`quantity * unit_price`).

---

## ⚠️ Common Pitfalls

- **Forgetting quotes around string inputs**: `"4"` is a string; `4` is an integer.
- **Using `int()` on a decimal string**: Calling `int("12.50")` will raise a `ValueError`. Always use `float()` for numbers with decimal points.
""",
        "starter_code": {
            "solution.py": """# Raw inputs from a customer shopping cart
raw_quantity = "4"
raw_unit_price = "12.50"
item_name = "Wireless Mouse"
is_taxable = True

# TODO: Step 1 - Convert raw_quantity to an integer (int)
quantity = None

# TODO: Step 2 - Convert raw_unit_price to a float (float)
unit_price = None

# TODO: Step 3 - Calculate total_price by multiplying quantity and unit_price
total_price = None
"""
        },
        "test_suite": {
            "tests.py": """from solution import quantity, unit_price, total_price, raw_quantity, raw_unit_price

def test_data_types():
    assert isinstance(quantity, int), f"quantity should be int, got {type(quantity).__name__}"
    assert quantity == 4, f"Expected quantity to be 4, got {quantity}"
    assert isinstance(unit_price, float), f"unit_price should be float, got {type(unit_price).__name__}"
    assert unit_price == 12.50, f"Expected unit_price to be 12.50, got {unit_price}"
    assert total_price == 50.0, f"Expected total_price to be 50.0, got {total_price}"
    print("✓ All assertions passed for Lesson 1.1: Data Types & Casting")

if __name__ == '__main__':
    test_data_types()
""",
            "verification_criteria": "Convert raw_quantity to int, raw_unit_price to float, and compute total_price.",
            "failure_mode": "Missing type casting or using int() on decimal string.",
            "exercise_about": "When an online store receives a customer order from a web browser, quantity and price arrive as raw text strings. Before calculations or billing can take place, our software must cast them into proper Python numbers.",
            "exercise_goal": "1. Convert raw_quantity to an integer (int).\n2. Convert raw_unit_price to a decimal float (float).\n3. Multiply quantity and unit_price to calculate total_price.",
            "expected_output": "quantity = 4 (int)\nunit_price = 12.50 (float)\ntotal_price = 50.0 (float)"
        },
        "defense_prompts": [
            "Why does raw_quantity * raw_unit_price fail if both are strings?",
            "What is the difference between an integer and a floating-point number in Python?",
            "What happens if you call int() on the string '12.50'?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.2: Operators & Arithmetic Precedence
    # --------------------------------------------------------------------------
    "node-0-2": {
        "title": "Lesson 1.2: Operators & E-Commerce Bill Calculations",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 2 of 50",
        "cs_foundation": "Arithmetic Operators (+, -, *, /, //, %), PEMDAS Precedence, and Financial Rounding",
        "ai_convergence": "Real-World Engineering: Calculating Order Subtotals, Discounts, Sales Tax, and Final Billing",
        "handbook_markdown": """# Lesson 1.2: Operators & E-Commerce Bill Calculations

Every time you place an order in an online store, a computer calculates the item subtotal, applies discount percentages, computes sales tax, and determines the final amount to charge your payment card.

To calculate these amounts accurately without overcharging or undercharging customers, software programs use Python's arithmetic operators in a precise order.

---

## 💡 The Real-World Mental Model: The Cash Register Calculator

Think of Python's arithmetic operators like the buttons on an electronic cash register:
- **`+` (Addition)**: Combining item prices into a basket total.
- **`-` (Subtraction)**: Deducting promotional discounts or refunds.
- **`*` (Multiplication)**: Scaling quantities by unit prices.
- **`/` (Division)**: Splitting a restaurant bill equally among friends.
- **`//` (Floor Division)**: Finding how many whole boxes can be packed without fractions.
- **`%` (Modulo Remainder)**: Finding how many loose items are left over after packing full boxes.

```
┌────────────────────────────────────────────────────────┐
│               PEMDAS Order of Operations               │
│  1. ( ) Parentheses       -> Calculations inside fences │
│  2. **  Exponents         -> Powers (e.g., 2 ** 3 = 8)  │
│  3. * / // % Multiply/Div -> Evaluated left-to-right    │
│  4. + - Add/Subtract      -> Evaluated last             │
└────────────────────────────────────────────────────────┘
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Order of Operations Matters
In Python, multiplication and division always run **before** addition and subtraction.

If an item costs $120.00 and has a 20% discount, the discount amount is:
```python
discount_amount = items_cost * (discount_percent / 100.0)  # 120.0 * 0.20 = 24.0
```
Then the discounted price is:
```python
discounted_items_cost = items_cost - discount_amount  # 120.0 - 24.0 = 96.0
```

### 2. Parentheses Give You Control
Whenever you want an addition or subtraction to happen first, wrap it in parentheses:
```python
# Without parentheses (WRONG):
wrong_total = 100 + 20 * 0.9  # Python does 20 * 0.9 = 18, then 100 + 18 = 118

# With parentheses (CORRECT):
correct_total = (100 + 20) * 0.9  # Python does (100 + 20) = 120, then 120 * 0.9 = 108.0
```

### 3. Financial Rounding with `round()`
Computers represent decimal fractions in binary, which can sometimes produce tiny fractions (e.g. `7.680000000000001`). In financial calculations, always round final currency values to 2 decimal places using `round(value, 2)`.

---

## 🛠️ Step-by-Step Exercise Guide

Calculate the customer bill step by step using the provided variables:

1. **Calculate `discount_amount`**: Multiply `items_cost` by `(discount_percent / 100.0)`.
2. **Calculate `discounted_items_cost`**: Subtract `discount_amount` from `items_cost`.
3. **Calculate `sales_tax`**: Multiply `discounted_items_cost` by `tax_rate`.
4. **Calculate `final_bill`**: Add `discounted_items_cost`, `sales_tax`, and `shipping_cost`, rounded to 2 decimal places with `round(..., 2)`.

---

## ⚠️ Common Pitfalls

- **Forgetting Parentheses**: Writing `discount_percent / 100.0` ensures the discount percentage is converted to a decimal factor (e.g. 20.0 -> 0.20).
- **Subtracting Discount from the Wrong Total**: Discount applies only to the `items_cost`, not the shipping cost!
""",
        "starter_code": {
            "solution.py": """# Store checkout prices
items_cost = 120.00
shipping_cost = 15.00
discount_percent = 20.0    # 20% discount on items
tax_rate = 0.08            # 8% sales tax on discounted items

# TODO: Step 1 - Calculate discount_amount (items_cost multiplied by discount_percent divided by 100.0)
discount_amount = None

# TODO: Step 2 - Calculate discounted_items_cost (items_cost minus discount_amount)
discounted_items_cost = None

# TODO: Step 3 - Calculate sales_tax (discounted_items_cost multiplied by tax_rate)
sales_tax = None

# TODO: Step 4 - Calculate final_bill (discounted_items_cost + sales_tax + shipping_cost) rounded to 2 decimal places using round(...)
final_bill = None
"""
        },
        "test_suite": {
            "tests.py": """import solution

def test_calculations():
    assert hasattr(solution, 'discount_amount'), "Missing variable: discount_amount"
    assert hasattr(solution, 'discounted_items_cost'), "Missing variable: discounted_items_cost"
    assert hasattr(solution, 'sales_tax'), "Missing variable: sales_tax"
    assert hasattr(solution, 'final_bill'), "Missing variable: final_bill"

    assert isinstance(solution.discount_amount, (int, float)), "discount_amount must be a number"
    assert round(solution.discount_amount, 2) == 24.00, f"Expected discount_amount to be 24.00, got {solution.discount_amount}"

    assert isinstance(solution.discounted_items_cost, (int, float)), "discounted_items_cost must be a number"
    assert round(solution.discounted_items_cost, 2) == 96.00, f"Expected discounted_items_cost to be 96.00, got {solution.discounted_items_cost}"

    assert isinstance(solution.sales_tax, (int, float)), "sales_tax must be a number"
    assert round(solution.sales_tax, 2) == 7.68, f"Expected sales_tax to be 7.68, got {solution.sales_tax}"

    assert isinstance(solution.final_bill, (int, float)), "final_bill must be a number"
    assert round(solution.final_bill, 2) == 118.68, f"Expected final_bill to be 118.68, got {solution.final_bill}"

    print("✓ All assertions passed for Lesson 1.2: Order Total Calculation")

if __name__ == '__main__':
    test_calculations()
""",
            "verification_criteria": "Compute discount_amount, discounted_items_cost, sales_tax, and rounded final_bill using arithmetic operators and round().",
            "failure_mode": "Missing parentheses or applying discount to shipping cost.",
            "exercise_about": "Online checkout systems calculate customer billing by adding item prices, subtracting promotional discounts, and computing state sales tax before charging the payment card.",
            "exercise_goal": "1. Calculate discount_amount = items_cost * (discount_percent / 100.0).\n2. Calculate discounted_items_cost = items_cost - discount_amount.\n3. Calculate sales_tax = discounted_items_cost * tax_rate.\n4. Calculate final_bill = round(discounted_items_cost + sales_tax + shipping_cost, 2).",
            "expected_output": "discount_amount = 24.00\ndiscounted_items_cost = 96.00\nsales_tax = 7.68\nfinal_bill = 118.68"
        },
        "defense_prompts": [
            "Why do we wrap operations in parentheses when we want them to run before multiplication?",
            "How does Python determine which arithmetic operation to execute first?",
            "Why is round() used for currency calculations?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.3: String Indexing, Slicing & Formatting
    # --------------------------------------------------------------------------
    "node-0-3": {
        "title": "Lesson 1.3: String Slicing & Customer Notification Previews",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 3 of 50",
        "cs_foundation": "String Indexing [0], Slicing [start:stop], len(), and f-strings",
        "ai_convergence": "Real-World Engineering: Formatting Customer Names and Safely Slicing Long Notification Updates",
        "handbook_markdown": """# Lesson 1.3: String Slicing & Customer Notification Previews

Mobile notifications and SMS text messages have character limits. If an order update or customer feedback message is too long, the software trims it neatly and adds an ellipsis (`"..."`) so it fits cleanly on a mobile screen.

In Python, we inspect, clean, and extract parts of text using **string indexing, slicing, and methods**.

---

## 💡 The Real-World Mental Model: A Strip of Numbered Tickets

Imagine a strip of paper tickets with letters printed on each ticket:
- In Python, counting **always starts at index 0** (the first character is at position 0).
- Slicing is like using scissors to cut out a section between two positions: `text[start:stop]`.
- The `start` index is **included**, but the `stop` index is **excluded** (Python stops right before `stop`).

```
Index:    0   1   2   3   4   5   6   7   8   9   10
Text:     H   e   l   l   o       W   o   r   l   d
Slice:   [─────────]
          text[0:5] -> "Hello" (stops before index 5)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Cleaning Strings: `.strip()` and `.title()`
Customer inputs often have accidental extra spaces or mixed casing:
```python
name = "  sarah connor  "
cleaned_name = name.strip()          # Removes leading/trailing spaces -> "sarah connor"
formatted_name = cleaned_name.title() # Capitalizes each word -> "Sarah Connor"
```

### 2. Slicing Strings: `text[start:stop]`
- `order_id = "ORD-98234-X"`
- `order_id[4:9]` cuts out characters from index 4 up to index 9 -> `"98234"`.
- `text[:25]` cuts out the first 25 characters (from index 0 up to 25).

### 3. Combining with f-strings
An f-string lets you plug variables directly into text using `{variable_name}`:
```python
summary = f"Hello {formatted_name}, your order #{order_number} is ready!"
```

---

## 🛠️ Step-by-Step Exercise Guide

Complete the notification formatting steps using the provided variables:

1. **Format `formatted_name`**: Clean `raw_customer_name` using `.strip().title()`.
2. **Extract `order_number`**: Extract the 5 digits `"98234"` from `order_id` using slice `[4:9]`.
3. **Create `preview_text`**: Slice the first `max_preview_length` (25) characters of `full_message` and append `...` to the end (`full_message[:max_preview_length] + "..."`).
4. **Build `summary_sms`**: Assemble the final message using an f-string:
   `"Order #98234 for Sarah Connor: Your package has been pic..."`

---

## ⚠️ Common Pitfalls

- **Off-By-One Slice**: `order_id[4:9]` grabs exactly 5 characters (indexes 4, 5, 6, 7, 8). The stop index 9 is not included.
- **Forgetting `.strip()`**: Leading spaces before text can cause `.title()` or slicing to produce unexpected results.
""",
        "starter_code": {
            "solution.py": """# Customer notification details
raw_customer_name = "  sarah connor  "
order_id = "ORD-98234-X"
full_message = "Your package has been picked up by courier and is on the way"
max_preview_length = 25

# TODO: Step 1 - Clean and capitalize formatted_name using .strip().title()
formatted_name = None

# TODO: Step 2 - Extract the 5-digit number from order_id using slice [4:9]
order_number = None

# TODO: Step 3 - Slice the first max_preview_length characters of full_message and append "..."
preview_text = None

# TODO: Step 4 - Build summary_sms using an f-string:
# "Order #98234 for Sarah Connor: Your package has been pic..."
summary_sms = None
"""
        },
        "test_suite": {
            "tests.py": """import solution

def test_string_formatting():
    assert hasattr(solution, 'formatted_name'), "Missing variable: formatted_name"
    assert hasattr(solution, 'order_number'), "Missing variable: order_number"
    assert hasattr(solution, 'preview_text'), "Missing variable: preview_text"
    assert hasattr(solution, 'summary_sms'), "Missing variable: summary_sms"

    assert solution.formatted_name == "Sarah Connor", f"Expected formatted_name 'Sarah Connor', got '{solution.formatted_name}'"
    assert solution.order_number == "98234", f"Expected order_number '98234', got '{solution.order_number}'"
    assert solution.preview_text == "Your package has been pic...", f"Expected preview_text 'Your package has been pic...', got '{solution.preview_text}'"
    assert solution.summary_sms == "Order #98234 for Sarah Connor: Your package has been pic...", f"Expected summary_sms 'Order #98234 for Sarah Connor: Your package has been pic...', got '{solution.summary_sms}'"

    print("✓ All assertions passed for Lesson 1.3: String Slicing & Previews")

if __name__ == '__main__':
    test_string_formatting()
""",
            "verification_criteria": "Format name with .strip().title(), slice order number [4:9], slice preview text [:25] + '...', and assemble f-string summary.",
            "failure_mode": "Off-by-one indexing error in slice or incorrect f-string formatting.",
            "exercise_about": "Mobile alerts and SMS notification systems format customer names and trim long delivery messages so they fit within standard character display limits.",
            "exercise_goal": "1. Format raw_customer_name into formatted_name using .strip().title().\n2. Extract the 5-digit number from order_id using slice [4:9].\n3. Slice the first 25 characters of full_message and append '...' to preview_text.\n4. Build summary_sms using an f-string.",
            "expected_output": "formatted_name = 'Sarah Connor'\norder_number = '98234'\npreview_text = 'Your package has been pic...'\nsummary_sms = 'Order #98234 for Sarah Connor: Your package has been pic...'"
        },
        "defense_prompts": [
            "Why is the stop index in Python slicing excluded from the result?",
            "What does .strip() do to a string with leading and trailing spaces?",
            "How do f-strings make variable interpolation cleaner than string concatenation?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.4: Conditionals & Delivery Tier Routing
    # --------------------------------------------------------------------------
    "node-0-4": {
        "title": "Lesson 1.4: Conditionals & Delivery Tier Routing",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 4 of 50",
        "cs_foundation": "Conditional Branching (if, elif, else), Comparison Operators, and Logical Flags",
        "ai_convergence": "Real-World Engineering: Routing Customer Shipments by Package Weight and VIP Subscription Status",
        "handbook_markdown": """# Lesson 1.4: Conditionals & Delivery Tier Routing

Software makes decisions constantly. When a customer checks out an online order, the system inspects several rules:
- Is this an international shipment?
- Is the customer a VIP member?
- Is the package light or heavy?

We make these decisions using **conditional branching** (`if`, `elif`, and `else`).

---

## 💡 The Real-World Mental Model: The Fork in the Road

Think of a conditional statement like a train track switch:
1. The train approaches a checkpoint.
2. A sensor tests a condition (e.g., `if is_international:`).
3. If **True**, the train takes the first track and ignores all other tracks.
4. If **False**, it rolls forward to test the next `elif` condition.
5. If none of the conditions matched, the default `else` track is taken.

```
       [ Incoming Order ]
               │
     is_international? ────YES───> "International" ($45.00)
               │ NO
      is_vip_member or
     weight <= 2.0 kg? ────YES───> "Express Free" ($0.00)
               │ NO
      weight <= 20.0 kg? ──YES───> "Standard Ground" ($12.50)
               │ NO
               └───> "Heavy Freight" ($35.00)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The Structure of `if / elif / else`
Python evaluates conditions from top to bottom. As soon as one condition evaluates to `True`, Python executes its indented block and skips the rest of the branch:

```python
if is_international:
    shipping_tier = "International"
    shipping_fee = 45.00
elif is_vip_member or package_weight_kg <= 2.0:
    shipping_tier = "Express Free"
    shipping_fee = 0.00
elif package_weight_kg <= 20.0:
    shipping_tier = "Standard Ground"
    shipping_fee = 12.50
else:
    shipping_tier = "Heavy Freight"
    shipping_fee = 35.00
```

### 2. Logical Operators: `and`, `or`, `not`
- **`or`**: Evaluates to `True` if *at least one* side is True.
- **`and`**: Evaluates to `True` *only if both* sides are True.
- **`not`**: Inverts a boolean (`not True` becomes `False`).

---

## 🛠️ Step-by-Step Exercise Guide

Write the `if / elif / else` branching logic for the delivery order:

1. If `is_international` is `True`:
   - `shipping_tier = "International"`
   - `shipping_fee = 45.00`
2. Else if `is_vip_member` is `True` or `package_weight_kg <= 2.0`:
   - `shipping_tier = "Express Free"`
   - `shipping_fee = 0.00`
3. Else if `package_weight_kg <= 20.0`:
   - `shipping_tier = "Standard Ground"`
   - `shipping_fee = 12.50`
4. Else:
   - `shipping_tier = "Heavy Freight"`
   - `shipping_fee = 35.00`

---

## ⚠️ Common Pitfalls

- **Order of Conditions**: Always test special cases (like `is_international` or VIP) before broad general ranges.
- **Assignment vs Comparison**: In condition headers, use `==` or boolean variable names, not `=` (`=` is for assigning values).
""",
        "starter_code": {
            "solution.py": """# Shipment package details
package_weight_kg = 18.5
is_vip_member = True
is_international = False

# Shipping tier rules:
# 1. If is_international is True:
#    shipping_tier = "International"
#    shipping_fee = 45.00
# 2. Else if is_vip_member is True or package_weight_kg <= 2.0:
#    shipping_tier = "Express Free"
#    shipping_fee = 0.00
# 3. Else if package_weight_kg <= 20.0:
#    shipping_tier = "Standard Ground"
#    shipping_fee = 12.50
# 4. Else:
#    shipping_tier = "Heavy Freight"
#    shipping_fee = 35.00

shipping_tier = None
shipping_fee = None

# TODO: Write if / elif / else branching logic to assign shipping_tier and shipping_fee
"""
        },
        "test_suite": {
            "tests.py": """import solution

def test_routing():
    assert hasattr(solution, 'shipping_tier'), "Missing variable: shipping_tier"
    assert hasattr(solution, 'shipping_fee'), "Missing variable: shipping_fee"

    assert solution.shipping_tier == "Express Free", f"Expected shipping_tier to be 'Express Free', got '{solution.shipping_tier}'"
    assert solution.shipping_fee == 0.00, f"Expected shipping_fee to be 0.00, got {solution.shipping_fee}"

    print("✓ All assertions passed for Lesson 1.4: Delivery Tier Routing")

if __name__ == '__main__':
    test_routing()
""",
            "verification_criteria": "Implement if / elif / else branching assigning shipping_tier and shipping_fee based on international flag, VIP status, and weight.",
            "failure_mode": "Incorrect conditional ordering or missing branches.",
            "exercise_about": "E-commerce shipping routers inspect customer orders to assign appropriate delivery tiers and calculate shipping fees based on package weight, membership status, and destination.",
            "exercise_goal": "Write if / elif / else branching logic to evaluate the package and set shipping_tier and shipping_fee according to the specified business rules.",
            "expected_output": "shipping_tier = 'Express Free'\nshipping_fee = 0.00\n(Because is_vip_member is True)"
        },
        "defense_prompts": [
            "Why is condition ordering critical in an if / elif / else structure?",
            "What is the difference between 'and' and 'or' logical operators in Python?",
            "What happens if no condition in an if / elif ladder evaluates to True and there is no else block?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.5: While Loops & Savings Goal Planning
    # --------------------------------------------------------------------------
    "node-0-5": {
        "title": "Lesson 1.5: While Loops & Savings Goal Planning",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 5 of 50",
        "cs_foundation": "While Loops, Loop Conditionals, Counters, and Accumulators",
        "ai_convergence": "Real-World Engineering: Calculating Number of Months Required to Reach a Target Savings Goal",
        "handbook_markdown": """# Lesson 1.5: While Loops & Savings Goal Planning

When planning personal finances or setting up automated recurring deposits, you might want to know: *How many months will it take to reach a $1,000 savings goal if I save $150 each month?*

Instead of doing manual calculations over and over, we can use a **`while` loop** in Python to repeat an action until a specific goal is achieved.

---

## 💡 The Real-World Mental Model: Filling a Water Pitcher

Imagine filling a pitcher with a cup:
1. You start with a pitcher that already has a little water in it (`current_savings = starting_balance`).
2. You check: *Is the pitcher full yet?* (`while current_savings < target_amount:`).
3. If not full, you pour in one cup of water (`current_savings += monthly_deposit`) and count `1` pour (`months_saved += 1`).
4. You repeat this until the pitcher is full, then you stop.

```
Start: Balance = $200.00, Months = 0
Month 1: Balance = $350.00, Months = 1
Month 2: Balance = $500.00, Months = 2
Month 3: Balance = $650.00, Months = 3
Month 4: Balance = $800.00, Months = 4
Month 5: Balance = $950.00, Months = 5
Month 6: Balance = $1100.00, Months = 6 -> Target ($1000) reached! Stop loop.
```

---

## 🔍 Deep Dive: Understanding the Concept

### The 3 Parts of Every Safe `while` Loop
A `while` loop checks its condition before every round. To make sure the loop finishes properly without freezing:

1. **Starting value**: Define variables before the loop (e.g. `current_savings = starting_balance`, `months_saved = 0`).
2. **Loop condition**: e.g., `while current_savings < target_amount:`.
3. **State update**: Inside the loop, change the values so the condition eventually becomes `False` (e.g. `current_savings += monthly_deposit`, `months_saved += 1`).

```python
while current_savings < target_amount:
    current_savings += monthly_deposit
    months_saved += 1
```

---

## 🛠️ Step-by-Step Exercise Guide

Write a `while` loop that runs as long as `current_savings` is strictly less than `target_amount`:

1. Check the condition: `while current_savings < target_amount:`.
2. Inside the indented loop body:
   - Add `monthly_deposit` to `current_savings` (`current_savings += monthly_deposit`).
   - Add `1` to `months_saved` (`months_saved += 1`).
3. Once the loop finishes, both `current_savings` and `months_saved` will hold the final calculated values.

---

## ⚠️ Common Pitfalls

- **Forgetting to update values inside the loop**: If you don't update `current_savings`, the condition `current_savings < target_amount` remains `True` forever, causing an infinite loop!
- **Using `<` vs `<=`**: Check the goal requirement carefully (`current_savings < target_amount` stops as soon as current savings reaches or passes the target).
""",
        "starter_code": {
            "solution.py": """# Personal savings goal
target_amount = 1000.00
starting_balance = 200.00
monthly_deposit = 150.00

current_savings = starting_balance
months_saved = 0

# TODO: Write a while loop that runs while current_savings is less than target_amount
# Inside the loop:
# 1. Add monthly_deposit to current_savings
# 2. Add 1 to months_saved
"""
        },
        "test_suite": {
            "tests.py": """import solution

def test_savings_loop():
    assert hasattr(solution, 'current_savings'), "Missing variable: current_savings"
    assert hasattr(solution, 'months_saved'), "Missing variable: months_saved"

    assert solution.months_saved == 6, f"Expected months_saved to be 6, got {solution.months_saved}"
    assert solution.current_savings == 1100.00, f"Expected current_savings to be 1100.00, got {solution.current_savings}"

    print("✓ All assertions passed for Lesson 1.5: While Loops & Savings Planning")

if __name__ == '__main__':
    test_savings_loop()
""",
            "verification_criteria": "Accumulate current_savings and increment months_saved in a while loop until current_savings >= target_amount.",
            "failure_mode": "Infinite loop from missing accumulator step or incorrect loop condition.",
            "exercise_about": "Personal finance calculators use recurring while loops to determine how many months of regular monthly deposits are needed to reach a target savings balance.",
            "exercise_goal": "Write a while loop that increments months_saved by 1 and adds monthly_deposit to current_savings as long as current_savings is less than target_amount.",
            "expected_output": "months_saved = 6\ncurrent_savings = 1100.00\n(Target $1000 reached after 6 months)"
        },
        "defense_prompts": [
            "What causes an infinite loop in Python, and how do we prevent it?",
            "Why must accumulator variables be initialized before the while loop begins?",
            "How does a while loop decide when to stop running?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.6: For Loops & Retail Sales Auditing
    # --------------------------------------------------------------------------
    "node-0-6": {
        "title": "Lesson 1.6: For Loops & Retail Sales Auditing",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 6 of 50",
        "cs_foundation": "For Loops, Iteration over Lists, Accumulator Variables, and len()",
        "ai_convergence": "Real-World Engineering: Auditing Weekly Store Sales to Calculate Total Revenue, High-Value Days, and Highest Sale",
        "handbook_markdown": """# Lesson 1.6: For Loops & Retail Sales Auditing

In retail businesses and financial accounting, managers review lists of daily sales receipts at the end of each week to calculate:
- Total weekly revenue
- How many days reached high sales targets
- The highest single sales record of the week

In Python, when you have an existing list of items and want to process every item one by one, the most natural tool is a **`for` loop**.

---

## 💡 The Real-World Mental Model: Turning Pages in a Ledger

Imagine a store accountant flipping through a notebook of receipts:
- The notebook contains 7 daily sales figures: `[450, 620, 310, 890, 740, 1050, 520]`.
- For each page (each number):
  1. Add the number to your running revenue total.
  2. If the number is at least 700, mark a tally for high-value days.
  3. If the number is bigger than any number you've seen so far, update your record for highest sale.

```
Sale: 450  -> Total: 450,  High-value days: 0, Highest: 450
Sale: 620  -> Total: 1070, High-value days: 0, Highest: 620
Sale: 310  -> Total: 1380, High-value days: 0, Highest: 620
Sale: 890  -> Total: 2270, High-value days: 1, Highest: 890
Sale: 740  -> Total: 3010, High-value days: 2, Highest: 890
Sale: 1050 -> Total: 4060, High-value days: 3, Highest: 1050
Sale: 520  -> Total: 4580, High-value days: 3, Highest: 1050
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The `for item in sequence:` Syntax
Unlike `while` loops where you manage counters manually, a `for` loop automatically steps through every item in a list from start to finish:

```python
for sale in daily_sales:
    total_revenue += sale
```

### 2. Updating Conditions Inside a Loop
You can combine `if` statements inside your loop body to inspect each element:
```python
for sale in daily_sales:
    total_revenue += sale
    if sale >= 700:
        high_value_days_count += 1
    if sale > highest_single_sale:
        highest_single_sale = sale
```

---

## 🛠️ Step-by-Step Exercise Guide

Write a `for` loop that iterates over each number in `daily_sales`:

1. **Accumulate total revenue**: Add the current sale to `total_revenue` (`total_revenue += sale`).
2. **Count high-value days**: If `sale >= 700`, increment `high_value_days_count` by 1.
3. **Track highest sale**: If `sale > highest_single_sale`, assign `highest_single_sale = sale`.

---

## ⚠️ Common Pitfalls

- **Resetting variables inside the loop**: `total_revenue = 0` must be outside and before the loop. If you place it inside the loop, it resets on every iteration!
- **Indentation**: All statements that should run for each element must be indented inside the `for` loop block.
""",
        "starter_code": {
            "solution.py": """# Daily store sales records for one week (in dollars)
daily_sales = [450, 620, 310, 890, 740, 1050, 520]

total_revenue = 0
high_value_days_count = 0  # Count of days where sale was >= 700
highest_single_sale = 0

# TODO: Write a for loop over daily_sales to calculate:
# 1. total_revenue: add each day's sale to total_revenue
# 2. high_value_days_count: increment by 1 if the day's sale is >= 700
# 3. highest_single_sale: update if the day's sale is greater than highest_single_sale
"""
        },
        "test_suite": {
            "tests.py": """import solution

def test_sales_audit():
    assert hasattr(solution, 'total_revenue'), "Missing variable: total_revenue"
    assert hasattr(solution, 'high_value_days_count'), "Missing variable: high_value_days_count"
    assert hasattr(solution, 'highest_single_sale'), "Missing variable: highest_single_sale"

    assert solution.total_revenue == 4580, f"Expected total_revenue 4580, got {solution.total_revenue}"
    assert solution.high_value_days_count == 3, f"Expected high_value_days_count 3, got {solution.high_value_days_count}"
    assert solution.highest_single_sale == 1050, f"Expected highest_single_sale 1050, got {solution.highest_single_sale}"

    print("✓ All assertions passed for Lesson 1.6: For Loops & Sales Auditing")

if __name__ == '__main__':
    test_sales_audit()
""",
            "verification_criteria": "Iterate through daily_sales using a for loop to compute sum, count >= 700, and maximum value.",
            "failure_mode": "Initializing accumulator variables inside loop body or incorrect comparison operators.",
            "exercise_about": "Retail accounting audits review weekly sales receipts to calculate total weekly revenue, count how many days hit high sales targets, and find the top sales record.",
            "exercise_goal": "Iterate through daily_sales with a for loop to:\n1. Sum all sales into total_revenue.\n2. Count days with sales >= 700 into high_value_days_count.\n3. Track the highest single sale in highest_single_sale.",
            "expected_output": "total_revenue = 4580\nhigh_value_days_count = 3 (890, 740, 1050)\nhighest_single_sale = 1050"
        },
        "defense_prompts": [
            "Why is a for loop safer than a while loop when iterating over a fixed list of items?",
            "What happens if the list provided to a for loop is empty []?",
            "How does tracking the maximum value in a loop work without calling max()?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.7: Loop Control (break & continue)
    # --------------------------------------------------------------------------
    "node-0-7": {
        "title": "Lesson 1.7: Loop Control & Inventory Quality Inspection",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 7 of 50",
        "cs_foundation": "Loop Flow Control: The 'break' and 'continue' Keywords",
        "ai_convergence": "Real-World Engineering: Inspecting Warehouse Products on a Conveyor Belt, Skipping Blemished Items, and Halting on Hazards",
        "handbook_markdown": """# Lesson 1.7: Loop Control & Quality Inspection

In warehouse logistics and food packaging, products move along automated conveyor belts through optical scanners.
- If a fruit has a small blemish, the machine **skips** it and moves to the next item (`continue`).
- If the scanner detects a broken glass hazard, it **halts the entire belt immediately** (`break`) for safety.

In Python, we control the flow of loops using two keywords: **`continue`** (skip to next item) and **`break`** (exit loop immediately).

---

## 💡 The Real-World Mental Model: Airport Security Scanner

Imagine an X-ray scanner at an airport conveyor belt:
- Bags roll along one by one.
- If a bag is an empty plastic tray, the officer **skips** it (`continue`) to focus on real luggage.
- If a dangerous item is detected, the officer hits the emergency stop button (`break`), stopping the belt immediately without checking the remaining bags.

```
Item 1: "fresh_apple"      -> Clean. Add to approved list.
Item 2: "fresh_banana"     -> Clean. Add to approved list.
Item 3: "blemished_orange" -> Blemished! Skip (continue).
Item 4: "fresh_grape"      -> Clean. Add to approved list.
Item 5: "hazardous_glass"  -> HAZARD! Set flag and stop belt (break).
Item 6: "fresh_peach"      -> Never inspected because belt stopped.
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. `continue`: Skip to the Next Item
When Python sees `continue`, it skips the rest of the code in the current iteration and jumps straight to the next item:
```python
for item in items:
    if item.startswith("blemished_"):
        continue  # Skips directly to the next item!
    approved_items.append(item)
```

### 2. `break`: Exit the Loop Immediately
When Python sees `break`, it terminates the loop instantly. Any items remaining in the list are never processed:
```python
for item in items:
    if item.startswith("hazardous_"):
        scanner_stopped_early = True
        break  # Stops the entire loop!
```

---

## 🛠️ Step-by-Step Exercise Guide

Inspect `inspection_belt` items using a `for` loop:

1. **Check for blemishes**: If `item.startswith("blemished_")`:
   - Skip to the next item using `continue`.
2. **Check for hazards**: If `item.startswith("hazardous_")`:
   - Set `scanner_stopped_early = True`
   - Exit the loop immediately using `break`.
3. **Approve clean items**: If neither condition matched, append `item` to `approved_items` using `approved_items.append(item)`.

---

## ⚠️ Common Pitfalls

- **Order of Checks**: Check for `blemished_` and `hazardous_` *before* appending to `approved_items`.
- **`continue` vs `break`**: `continue` only skips the *current item*; `break` stops the *entire loop*.
""",
        "starter_code": {
            "solution.py": """# Inspection list of items passing on a quality control conveyor belt
inspection_belt = ["fresh_apple", "fresh_banana", "blemished_orange", "fresh_grape", "hazardous_glass", "fresh_peach"]

approved_items = []
scanner_stopped_early = False

# TODO: Iterate through inspection_belt using a for loop:
# 1. If an item starts with "blemished_", skip it using continue (do NOT add to approved_items)
# 2. If an item starts with "hazardous_", set scanner_stopped_early = True and immediately stop the loop using break
# 3. Otherwise, append the clean item to approved_items
"""
        },
        "test_suite": {
            "tests.py": """import solution

def test_quality_control():
    assert hasattr(solution, 'approved_items'), "Missing variable: approved_items"
    assert hasattr(solution, 'scanner_stopped_early'), "Missing variable: scanner_stopped_early"

    expected_approved = ["fresh_apple", "fresh_banana", "fresh_grape"]
    assert solution.approved_items == expected_approved, f"Expected approved_items {expected_approved}, got {solution.approved_items}"
    assert solution.scanner_stopped_early is True, "Expected scanner_stopped_early to be True"

    print("✓ All assertions passed for Lesson 1.7: Loop Control & Quality Inspection")

if __name__ == '__main__':
    test_quality_control()
""",
            "verification_criteria": "Filter inspection_belt using continue on blemished items, break on hazardous items, and append clean items to approved_items.",
            "failure_mode": "Adding blemished or hazardous items to approved_items or not breaking on hazard.",
            "exercise_about": "Automated factory conveyor belts inspect products, skipping blemished items with continue and emergency-stopping the belt with break if a hazardous object is detected.",
            "exercise_goal": "Iterate through inspection_belt with a for loop:\n1. If item starts with 'blemished_', skip with continue.\n2. If item starts with 'hazardous_', set scanner_stopped_early = True and break.\n3. Otherwise, append item to approved_items.",
            "expected_output": "approved_items = ['fresh_apple', 'fresh_banana', 'fresh_grape']\nscanner_stopped_early = True\n('fresh_peach' is never inspected)"
        },
        "defense_prompts": [
            "Why is break used for emergency stopping rather than letting the loop finish?",
            "What is the exact behavioral difference between continue and break?",
            "Why was 'fresh_peach' not added to approved_items in this exercise?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.8: Functions & Reusable Calculators
    # --------------------------------------------------------------------------
    "node-0-8": {
        "title": "Lesson 1.8: Functions & Customer Shipping Calculators",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 8 of 50",
        "cs_foundation": "Function Signatures (def), Parameters, Default Arguments, and Return Values",
        "ai_convergence": "Real-World Engineering: Packaging Customer Delivery Fee Calculations into a Reusable Function",
        "handbook_markdown": """# Lesson 1.8: Functions & Customer Shipping Calculators

Up to this point, our Python code ran top-to-bottom once. But in real-world applications—like an online store calculating delivery costs for thousands of different shopping carts—we cannot rewrite code every time.

Instead, we package our logic into a reusable block called a **function** using the **`def`** keyword.

---

## 💡 The Real-World Mental Model: A Postal Rate Calculator Machine

Think of a function like a postage calculating machine at a post office:
- **Inputs (Parameters)**: You place a parcel on the scale (weight) and type the destination distance.
- **Default Options**: You can choose regular delivery or express air delivery (defaults to regular if not chosen).
- **The Internal Logic**: The machine applies the standard pricing formula.
- **The Output (`return`)**: The machine displays and returns the final fee.

```
                  ┌──────────────────────────────────────────────┐
  weight_kg  ───> │                                              │
 distance_km ───> │  calculate_shipping_cost(weight, dist, ...)  │ ───> Final Delivery Fee
  is_express ───> │                                              │
                  └──────────────────────────────────────────────┘
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Defining a Function with `def` and `return`
A function begins with `def`, followed by the function name, parentheses containing parameters, and a colon `:`. It hands its result back using `return`:

```python
def calculate_shipping_cost(weight_kg: float, distance_km: float, is_express: bool = False) -> float:
    base_fee = 5.00
    weight_cost = weight_kg * 1.50
    distance_cost = distance_km * 0.10
    
    express_fee = 10.00 if is_express else 0.00
    
    total = base_fee + weight_cost + distance_cost + express_fee
    return round(total, 2)
```

### 2. Default Parameter Values
Notice `is_express: bool = False`. If a customer doesn't specify express shipping, Python automatically uses `False`:
- `calculate_shipping_cost(2.0, 10.0)` -> Uses `is_express = False`.
- `calculate_shipping_cost(2.0, 10.0, is_express=True)` -> Overrides with `True`.

---

## 🛠️ Step-by-Step Exercise Guide

Implement the reusable function `calculate_shipping_cost`:

1. **Function Signature**: Define `def calculate_shipping_cost(weight_kg: float, distance_km: float, is_express: bool = False) -> float:`.
2. **Compute components**:
   - `base_fee = 5.00`
   - `weight_cost = weight_kg * 1.50`
   - `distance_cost = distance_km * 0.10`
   - `express_fee = 10.00` if `is_express` is `True`, else `0.00`
3. **Calculate and return total**: Return `round(base_fee + weight_cost + distance_cost + express_fee, 2)`.

---

## ⚠️ Common Pitfalls

- **Forgetting `return`**: If you write `print(...)` instead of `return ...`, the function returns `None` and other parts of the program cannot use the result.
- **Default Parameter Ordering**: Parameters with default values (like `is_express=False`) must always be placed **after** required parameters (`weight_kg`, `distance_km`).
""",
        "starter_code": {
            "solution.py": """def calculate_shipping_cost(weight_kg: float, distance_km: float, is_express: bool = False) -> float:
    \"\"\"
    Calculates delivery fee:
    - Base fee: $5.00
    - Weight cost: $1.50 per kg
    - Distance cost: $0.10 per km
    - Express surcharge: $10.00 if is_express is True, else $0.00
    Returns total cost rounded to 2 decimal places.
    \"\"\"
    # TODO: Calculate and return the total shipping cost rounded to 2 decimals
    pass
"""
        },
        "test_suite": {
            "tests.py": """from solution import calculate_shipping_cost

def test_shipping_calc():
    res1 = calculate_shipping_cost(2.0, 10.0)
    assert res1 == 9.00, f"Expected 9.00, got {res1}"

    res2 = calculate_shipping_cost(4.0, 50.0, is_express=True)
    assert res2 == 26.00, f"Expected 26.00, got {res2}"

    print("✓ All assertions passed for Lesson 1.8: Functions & Shipping Calculator")

if __name__ == '__main__':
    test_shipping_calc()
""",
            "verification_criteria": "Implement calculate_shipping_cost with default is_express=False parameter and correct price calculation.",
            "failure_mode": "Missing return statement or miscalculating express surcharge.",
            "exercise_about": "Rather than rewriting calculation scripts repeatedly, functions bundle delivery calculation into a reusable callable tool with default parameter options.",
            "exercise_goal": "Implement calculate_shipping_cost(weight_kg, distance_km, is_express=False):\n- Base fee: $5.00\n- Weight fee: $1.50/kg\n- Distance fee: $0.10/km\n- Express surcharge: $10.00 if True, else $0.00\n- Return total rounded to 2 decimal places.",
            "expected_output": "calculate_shipping_cost(2.0, 10.0) -> 9.00\ncalculate_shipping_cost(4.0, 50.0, is_express=True) -> 26.00"
        },
        "defense_prompts": [
            "Why must non-default parameters appear before parameters with default values in Python?",
            "What is the difference between printing a value and returning a value from a function?",
            "How do reusable functions reduce errors in large software codebases?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.9: Scope & Stateful Enclosures
    # --------------------------------------------------------------------------
    "node-0-9": {
        "title": "Lesson 1.9: Variable Scope & Running Tab Accumulators",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 9 of 50",
        "cs_foundation": "Variable Scope (Local vs Global), Enclosing Functions, and Closures with 'nonlocal'",
        "ai_convergence": "Real-World Engineering: Creating Dedicated Running Tab Trackers for Cafe Orders",
        "handbook_markdown": """# Lesson 1.9: Variable Scope & Running Tab Accumulators

In software engineering, variables have boundaries called **scope**. A variable created inside a function is **local** to that function. When the function finishes executing, local variables disappear from memory.

What if you want to create a dedicated cash register helper that remembers a customer's **running bill total** across multiple purchases?

In Python, we achieve this cleanly using **nested functions** and the **`nonlocal`** keyword.

---

## 💡 The Real-World Mental Model: A Cafe Table Tab

Imagine a cafe server opening a tab for Table 4:
- The server creates a dedicated tab starting at `$0.00` (or an initial balance).
- Every time Table 4 orders a pastry or coffee, the server adds the item price to *their specific tab*.
- Table 4's tab is completely separate from Table 2's tab.

```
create_order_tracker(initial_balance=0.0)
   ├── table_4_tracker(5.50) -> Returns 5.50  (Tab total: 5.50)
   ├── table_4_tracker(4.50) -> Returns 10.00 (Tab total: 10.00)
   └── table_2_tracker(12.00) -> Returns 12.00 (Independent tab!)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Local Scope vs Enclosing Scope
When a function is created inside another function, the inner function can access variables in the outer function:

```python
def create_order_tracker(initial_balance: float = 0.0):
    current_balance = initial_balance  # Enclosing variable

    def add_item(amount: float) -> float:
        nonlocal current_balance       # Tells Python to modify the outer variable
        current_balance += amount
        return round(current_balance, 2)

    return add_item                    # Return the inner function itself!
```

### 2. Why `nonlocal` is Needed
If you assign `current_balance += amount` without `nonlocal`, Python thinks you are creating a new local variable and throws an `UnboundLocalError`. Declaring `nonlocal current_balance` informs Python that we want to update the balance in the outer function.

---

## 🛠️ Step-by-Step Exercise Guide

Implement the factory function `create_order_tracker`:

1. **Outer Function**: Define `def create_order_tracker(initial_balance: float = 0.0):`.
2. **State Variable**: Initialize `current_balance = initial_balance`.
3. **Inner Function**: Define `def add_item(amount: float) -> float:`.
   - Declare `nonlocal current_balance`.
   - Add `amount` to `current_balance`.
   - Return `round(current_balance, 2)`.
4. **Return Inner Function**: At the end of `create_order_tracker`, return `add_item`.

---

## ⚠️ Common Pitfalls

- **Returning `add_item()` with parentheses**: You must return the function itself (`return add_item`), not the result of calling it (`return add_item()`).
- **Forgetting `nonlocal`**: Modifying an enclosing variable requires the `nonlocal` keyword.
""",
        "starter_code": {
            "solution.py": """def create_order_tracker(initial_balance: float = 0.0):
    \"\"\"
    Creates and returns an add_item function that maintains a running tab balance.
    \"\"\"
    current_balance = initial_balance

    def add_item(amount: float) -> float:
        # TODO: Declare nonlocal current_balance, add amount, and return rounded balance
        pass

    # TODO: Return the inner add_item function
    pass
"""
        },
        "test_suite": {
            "tests.py": """from solution import create_order_tracker

def test_order_tracker():
    tracker1 = create_order_tracker(10.00)
    assert tracker1(5.50) == 15.50, f"Expected 15.50, got {tracker1(5.50)}"
    assert tracker1(4.50) == 20.00, f"Expected 20.00, got {tracker1(4.50)}"

    tracker2 = create_order_tracker(0.00)
    assert tracker2(12.00) == 12.00, f"Expected 12.00, got {tracker2(12.00)}"
    assert tracker1(2.00) == 22.00, f"Expected tracker1 to be 22.00, got {tracker1(2.00)}"

    print("✓ All assertions passed for Lesson 1.9: Scope & Stateful Trackers")

if __name__ == '__main__':
    test_order_tracker()
""",
            "verification_criteria": "Implement create_order_tracker returning a closure that modifies nonlocal current_balance and returns running total.",
            "failure_mode": "Missing nonlocal declaration causing UnboundLocalError or returning add_item() call instead of function.",
            "exercise_about": "Cafe order registers use closures to maintain dedicated, stateful running tabs for individual tables that remember balance across multiple purchases.",
            "exercise_goal": "Implement create_order_tracker(initial_balance=0.0) that initializes current_balance and returns an inner add_item(amount) closure using nonlocal to update and return round(current_balance, 2).",
            "expected_output": "tracker = create_order_tracker(10.00)\ntracker(5.50) -> 15.50\ntracker(4.50) -> 20.00"
        },
        "defense_prompts": [
            "Why does modifying an enclosing variable require the nonlocal keyword in Python?",
            "What happens to local variables when a function finishes executing?",
            "How does returning a nested function enable stateful independent trackers?"
        ]
    },

    # --------------------------------------------------------------------------
    # LESSON 1.10: Assertions & Defensive Programming
    # --------------------------------------------------------------------------
    "node-0-10": {
        "title": "Lesson 1.10: Assertions & Defensive Input Validation",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 10 of 50",
        "cs_foundation": "Assertions (assert), Defensive Programming, Preconditions, and Clear Error Messages",
        "ai_convergence": "Real-World Engineering: Validating Employee Payroll Hours and Wage Rates Before Processing Paychecks",
        "handbook_markdown": """# Lesson 1.10: Assertions & Defensive Input Validation

In professional software development, functions frequently receive data from web forms, spreadsheets, or user inputs. If someone accidentally enters `-40` hours worked or `$0.00` as an hourly wage, processing the paycheck without checking could cause serious accounting errors.

To protect software from bad data, engineers use **defensive assertions** (`assert`) to verify that input conditions are valid before executing calculations.

---

## 💡 The Real-World Mental Model: A Security Turnstile

Think of an assertion like an electronic badge turnstile at a corporate office:
- When an employee swipes a valid badge, the gate opens smoothly and they walk in.
- If someone tries to enter with an expired badge or without scanning, the turnstile immediately locks and sounds an alarm (`AssertionError`), stopping invalid access on the spot.

```
[ Input: hours_worked, hourly_rate ]
                 │
  assert 0 <= hours_worked <= 80 ───FAIL───> Raises AssertionError ("Invalid hours worked")
                 │ PASS
     assert hourly_rate > 0.0    ───FAIL───> Raises AssertionError ("Hourly rate must be > 0")
                 │ PASS
    [ Calculate & Return Paycheck ]
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. The `assert` Statement Syntax
In Python, an assertion tests a condition. If the condition is `True`, execution continues normally. If `False`, Python immediately halts with an `AssertionError`:

```python
assert hours_worked >= 0, "Hours worked cannot be negative"
assert hours_worked <= 80, "Hours worked exceeds maximum weekly limit of 80"
assert hourly_rate > 0.0, "Hourly rate must be greater than zero"
```

### 2. Chained Comparisons in Python
Python allows clean chained comparisons:
```python
assert 0 <= hours_worked <= 80, "Hours worked must be between 0 and 80"
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement the payroll calculation function `calculate_weekly_pay` with defensive assertion guards:

1. **Add precondition assertions**:
   - Verify that `0 <= hours_worked <= 80`.
   - Verify that `hourly_rate > 0.0`.
2. **Calculate pay**: Multiply `hours_worked * hourly_rate`.
3. **Return rounded result**: Return the gross pay rounded to 2 decimal places using `round(pay, 2)`.

---

## ⚠️ Common Pitfalls

- **Asserting with Parentheses (Tuple Trap)**: Writing `assert(condition, "message")` in Python 3 can be treated as a non-empty tuple, which is always `True`! Always write `assert condition, "message"` without parentheses around the whole statement.
- **Assertion Messages**: Always include a clear descriptive message so engineers know exactly which rule was violated.
""",
        "starter_code": {
            "solution.py": """def calculate_weekly_pay(hours_worked: float, hourly_rate: float) -> float:
    \"\"\"
    Calculates gross pay with defensive assertion guards:
    - hours_worked must be between 0 and 80 inclusive
    - hourly_rate must be greater than 0.0
    Returns total pay rounded to 2 decimal places.
    \"\"\"
    # TODO: Add assert statements to validate hours_worked and hourly_rate
    # TODO: Calculate and return gross pay rounded to 2 decimals
    pass
"""
        },
        "test_suite": {
            "tests.py": """from solution import calculate_weekly_pay

def test_payroll_assertions():
    assert calculate_weekly_pay(40.0, 25.0) == 1000.00
    assert calculate_weekly_pay(0.0, 25.0) == 0.00

    try:
        calculate_weekly_pay(-5.0, 20.0)
        assert False, "Should have raised AssertionError for negative hours"
    except AssertionError:
        pass

    try:
        calculate_weekly_pay(95.0, 20.0)
        assert False, "Should have raised AssertionError for hours > 80"
    except AssertionError:
        pass

    try:
        calculate_weekly_pay(40.0, 0.0)
        assert False, "Should have raised AssertionError for zero hourly rate"
    except AssertionError:
        pass

    print("✓ All assertions passed for Lesson 1.10: Defensive Assertions")

if __name__ == '__main__':
    test_payroll_assertions()
""",
            "verification_criteria": "Validate 0 <= hours_worked <= 80 and hourly_rate > 0 using assert statements, returning rounded pay for valid inputs.",
            "failure_mode": "Failing to raise AssertionError on invalid inputs or incorrect gross pay calculation.",
            "exercise_about": "Payroll software guards accounting ledgers from corrupted data by defensively asserting that hours worked and hourly pay rates are valid before executing calculations.",
            "exercise_goal": "Implement calculate_weekly_pay(hours_worked, hourly_rate):\n- assert 0 <= hours_worked <= 80\n- assert hourly_rate > 0.0\n- return round(hours_worked * hourly_rate, 2)",
            "expected_output": "calculate_weekly_pay(40.0, 25.0) -> 1000.00\ncalculate_weekly_pay(-5.0, 20.0) -> Raises AssertionError"
        },
        "defense_prompts": [
            "Why is the 'assert(condition, message)' syntax considered a dangerous pitfall in Python?",
            "How do assertion guards protect downstream accounting systems from corrupt data?",
            "What is the difference between handling errors with try/except and asserting preconditions?"
        ]
    }
}


def patch_node(node_id: str, data: dict):
    url = f"{SUPABASE_URL}/rest/v1/curriculum_nodes?id=eq.{node_id}"
    
    payload = {
        "title": data["title"],
        "subtitle": data["subtitle"],
        "cs_foundation": data["cs_foundation"],
        "ai_convergence": data["ai_convergence"],
        "handbook_markdown": data["handbook_markdown"].strip(),
        "starter_code": data["starter_code"],
        "test_suite": data["test_suite"],
        "defense_prompts": data["defense_prompts"]
    }

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

    ctx = ssl.create_default_context()
    with urllib.request.urlopen(req, context=ctx) as response:
        status = response.status
        print(f"✓ Patched {node_id} ({data['title']}) -> HTTP {status}")


def main():
    print(f"Applying rich briefing patch to {len(LESSONS)} lessons (node-0-1 to node-0-10)...")
    for node_id, data in LESSONS.items():
        patch_node(node_id, data)
    print("\n✓ Successfully updated all 10 Foundation lessons in Supabase with exercise briefings!")


if __name__ == "__main__":
    main()
