#!/usr/bin/env python3
"""
Patch script for Lessons 1.21 through 1.35 (node-0-21 to node-0-35).
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

LESSONS_21_35 = {
    # --------------------------------------------------------------------------
    # LESSON 1.21: Tuples & Structural Unpacking
    # --------------------------------------------------------------------------
    "node-0-21": {
        "title": "Lesson 1.21: Tuples & Structural Unpacking",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 21 of 50",
        "cs_foundation": "Immutable Sequences (Tuples), Packing, Unpacking, and Star Unpacking (*rest)",
        "ai_convergence": "Real-World Engineering: Unpacking GPS Coordinates & Flight Booking Records",
        "handbook_markdown": """# Lesson 1.21: Tuples & Structural Unpacking

While lists are meant for collections of items that can grow or change, **tuples** represent fixed, immutable records whose values should never be altered after creation.

Tuples also support **structural unpacking**, allowing you to extract multiple values in a single clean assignment statement.

---

## 💡 The Real-World Mental Model: Sealed Tamper-Evident Envelopes

- **A List (`[]`)**: A loose binder ring where you can add, remove, or swap pages anytime.
- **A Tuple (`()`)**: A sealed, tamper-evident envelope stamped with official records (like a passport with `(first_name, last_name, birth_year)`). Once created, you cannot change a single entry without creating a completely new envelope.

```
record = ("ORD-9021", "2026-03-15", 149.99, "Delivered")
order_id, date, amount, status = record   # Unpacked into 4 distinct variables!
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Basic & Star Unpacking
```python
# Unpack head, middle items, and tail with *rest:
scores = (100, 95, 88, 72, 60)
top_score, *middle_scores, lowest_score = scores

print(top_score)       # 100
print(middle_scores)   # [95, 88, 72]
print(lowest_score)    # 60
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `parse_coordinate_record(raw_record: tuple) -> dict`:

1. **Input**: A tuple structured as `(location_name, latitude, longitude, *extra_notes)`.
2. **Unpacking**: Use star unpacking to separate `name`, `lat`, `lon`, and `*notes`.
3. **Return**: A dictionary with keys `"name"` (str), `"lat"` (float), `"lon"` (float), and `"notes"` (list of str).

---

## ⚠️ Common Pitfalls

- **Unpacking count mismatch**: If a tuple has 3 items and you assign to 2 variables without `*`, Python raises `ValueError: too many values to unpack`.
""",
        "starter_code": {
            "solution.py": """def parse_coordinate_record(raw_record: tuple) -> dict:
    \"\"\"
    Unpacks a (location_name, latitude, longitude, *extra_notes) tuple
    and returns a structured coordinate dictionary.
    \"\"\"
    # TODO: Unpack raw_record and return dict with name, lat, lon, and notes
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Mapping and dispatch routing software unpacks GPS coordinate tuples and station telemetry records into structured destination points.",
            "exercise_goal": "Implement parse_coordinate_record(raw_record) using star unpacking to separate name, coordinates, and optional notes.",
            "expected_output": "parse_coordinate_record(('Central Station', 40.71, -74.00, 'Track 4', 'North Entrance')) ->\n{'name': 'Central Station', 'lat': 40.71, 'lon': -74.0, 'notes': ['Track 4', 'North Entrance']}",
            "failure_mode": "Failing to handle variable extra notes with star unpacking.",
            "verification_criteria": "Function cleanly unpacks tuple and returns dictionary.",
            "tests.py": """from solution import parse_coordinate_record

def test_tuple_unpacking():
    record = ("Central Station", 40.7128, -74.0060, "Platform A", "Gate 3")
    res = parse_coordinate_record(record)
    assert res["name"] == "Central Station"
    assert res["lat"] == 40.7128
    assert res["lon"] == -74.0060
    assert res["notes"] == ["Platform A", "Gate 3"]

    print("✓ All assertions passed for Lesson 1.21: Tuples & Unpacking")

if __name__ == '__main__':
    test_tuple_unpacking()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.22: Dictionaries & Config Merging
    # --------------------------------------------------------------------------
    "node-0-22": {
        "title": "Lesson 1.22: Dictionaries & Safe Key Lookups",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 22 of 50",
        "cs_foundation": "Hash Map Mechanics, Dictionary Methods (.get(), .setdefault()), and Dictionary Merging",
        "ai_convergence": "Real-World Engineering: Merging Default App Settings with User Preferences",
        "handbook_markdown": """# Lesson 1.22: Dictionaries & Safe Key Lookups

Dictionaries store data as **key-value pairs**, allowing instant $O(1)$ lookups by name.

Accessing a missing key with `dict[key]` crashes with `KeyError`. Learning safe lookup patterns like `.get()` and modern dictionary merging (`|`) ensures resilient configuration handling.

---

## 💡 The Real-World Mental Model: A Keyed Post Office Box

- **`dict[key]`**: Demanding the postmaster open Box #402. If Box #402 doesn't exist, the postmaster sounds an emergency alarm (`KeyError`).
- **`dict.get(key, default)`**: Asking *"Is there mail in Box #402? If not, just hand me a blank receipt."* No alarms, no crashes.

```
base_settings = {"theme": "light", "font_size": 14, "notifications": True}
user_overrides = {"theme": "dark", "font_size": 18}
final_config = base_settings | user_overrides  # Merged!
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Safe Access & Default Values
```python
user = {"name": "Alice"}
role = user.get("role", "Guest")  # Returns "Guest" instead of crashing
```

### 2. Modern Merging with `|`
Python 3.9+ supports the pipe operator `|` to merge dictionaries:
```python
defaults = {"timeout": 30, "retries": 3, "debug": False}
custom = {"retries": 5, "debug": True}
active = defaults | custom  # custom values overwrite defaults
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `merge_app_preferences(default_config: dict, user_overrides: dict) -> dict`:

1. **Parameters**: Receive `default_config` and `user_overrides`.
2. **Merge**: Combine them so that any keys present in `user_overrides` overwrite values from `default_config`.
3. **Verification**: Ensure missing keys from overrides safely fall back to the default config.
4. **Return**: The merged dictionary.

---

## ⚠️ Common Pitfalls

- **Direct subscripting without checking**: Avoid `config["optional_key"]`; use `config.get("optional_key", fallback)`.
""",
        "starter_code": {
            "solution.py": """def merge_app_preferences(default_config: dict, user_overrides: dict) -> dict:
    \"\"\"
    Merges user overrides into default application configuration.
    \"\"\"
    # TODO: Merge default_config and user_overrides, returning the resulting config
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Software applications load default system configurations and safely overlay user custom preferences without crashing on missing keys.",
            "exercise_goal": "Implement merge_app_preferences(default_config, user_overrides) returning merged settings.",
            "expected_output": "merge_app_preferences({'theme': 'light', 'volume': 50}, {'volume': 80}) -> {'theme': 'light', 'volume': 80}",
            "failure_mode": "Failing to merge dictionaries or mutating default configuration object.",
            "verification_criteria": "Function returns correct merged settings dict with user overrides taking precedence.",
            "tests.py": """from solution import merge_app_preferences

def test_dict_merging():
    defaults = {"theme": "light", "volume": 50, "autoplay": False}
    user = {"volume": 80, "autoplay": True}
    merged = merge_app_preferences(defaults, user)
    
    assert merged["theme"] == "light"
    assert merged["volume"] == 80
    assert merged["autoplay"] is True

    print("✓ All assertions passed for Lesson 1.22: Dictionaries & Config Merging")

if __name__ == '__main__':
    test_dict_merging()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.23: Sets & Set Operations
    # --------------------------------------------------------------------------
    "node-0-23": {
        "title": "Lesson 1.23: Sets & Unique Membership Operations",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 23 of 50",
        "cs_foundation": "Hash Sets, Deduplication, and Mathematical Set Operations (&, |, -, ^)",
        "ai_convergence": "Real-World Engineering: Finding Common Attendees & Discrepancies Across Event Rosters",
        "handbook_markdown": """# Lesson 1.23: Sets & Unique Membership Operations

When you need to store unique items and check membership at lightning speed ($O(1)$ lookup time), Python **`set`** is the ideal data structure.

Sets automatically discard duplicate entries and provide powerful mathematical operations like union, intersection, and difference.

---

## 💡 The Real-World Mental Model: Guest Wristbands at an Event

- **A List**: A sign-in sheet where someone could accidentally write their name 5 times. Checking if someone is on the list requires scanning every single line.
- **A Set**: A VIP wristband system. Each person gets exactly one wristband. Finding out who attended both Day 1 and Day 2 is an instant Venn diagram intersection (**`&`**).

```
Day 1 Guests: {"Alice", "Bob", "Charlie"}
Day 2 Guests: {"Charlie", "David"}

Intersection (&):  {"Charlie"}            (Attended both days)
Difference (-):    {"Alice", "Bob"}        (Attended Day 1 only)
Union (|):         {"Alice", "Bob", "Charlie", "David"} (All unique visitors)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Set Syntax & Fast Lookups
```python
registered_ids = {101, 102, 103}

# Instant membership check:
if 102 in registered_ids:
    print("Welcome back!")
```

### 2. Common Set Operations
- **`set_a & set_b`**: Intersection (items present in both).
- **`set_a - set_b`**: Difference (items in A but not in B).
- **`set_a | set_b`**: Union (all unique items combined).

---

## 🛠️ Step-by-Step Exercise Guide

Implement `audit_event_attendance(day_1_attendees: list[str], day_2_attendees: list[str]) -> dict`:

1. **Convert to Sets**: Convert both input lists to sets of lowercase strings.
2. **Compute Metrics**:
   - `"both_days"`: sorted list of names who attended both days (`set_1 & set_2`).
   - `"day_1_only"`: sorted list of names who attended Day 1 only (`set_1 - set_2`).
   - `"total_unique_count"`: integer count of total unique attendees across both days (`len(set_1 | set_2)`).
3. **Return**: The summary dictionary.

---

## ⚠️ Common Pitfalls

- **Empty set literal**: `{}` creates an empty dictionary, not an empty set. Use `set()` to create an empty set.
""",
        "starter_code": {
            "solution.py": """def audit_event_attendance(day_1_attendees: list[str], day_2_attendees: list[str]) -> dict:
    \"\"\"
    Uses set operations to calculate both-day attendees, day-1-only attendees,
    and total unique visitor count.
    \"\"\"
    # TODO: Convert lists to sets, compute set operations, and return summary dict
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Event management systems analyze visitor attendance logs across multi-day conferences to determine retention and unique attendees.",
            "exercise_goal": "Implement audit_event_attendance(day_1, day_2) returning both_days, day_1_only, and total_unique_count.",
            "expected_output": "audit_event_attendance(['Alice', 'Bob'], ['Bob', 'Charlie']) ->\n{'both_days': ['Bob'], 'day_1_only': ['Alice'], 'total_unique_count': 3}",
            "failure_mode": "Failing to deduplicate or using slow list iterations instead of set algebra.",
            "verification_criteria": "Function uses set operations and returns correct dictionary with sorted lists.",
            "tests.py": """from solution import audit_event_attendance

def test_set_operations():
    d1 = ["Alice", "Bob", "Charlie", "Alice"]
    d2 = ["Charlie", "David", "Bob"]
    res = audit_event_attendance(d1, d2)
    
    assert sorted(res["both_days"]) == ["Bob", "Charlie"]
    assert res["day_1_only"] == ["Alice"]
    assert res["total_unique_count"] == 4

    print("✓ All assertions passed for Lesson 1.23: Sets & Set Operations")

if __name__ == '__main__':
    test_set_operations()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.24: Collections Module (Counter, defaultdict)
    # --------------------------------------------------------------------------
    "node-0-24": {
        "title": "Lesson 1.24: The Collections Module: Counter & defaultdict",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 24 of 50",
        "cs_foundation": "Specialized Container Datatypes: collections.Counter and collections.defaultdict",
        "ai_convergence": "Real-World Engineering: Analyzing Word Frequencies & Customer Support Ticket Categories",
        "handbook_markdown": """# Lesson 1.24: The Collections Module: Counter & defaultdict

Python's built-in `collections` module provides specialized data structures that eliminate boilerplate when counting items or grouping related records.

Two of the most valuable tools are:
- **`Counter`**: Automatically counts frequencies of items in an iterable.
- **`defaultdict`**: Automatically initializes missing keys with a default factory (like `list` or `int`), preventing `KeyError`.

---

## 💡 The Real-World Mental Model: Automated Vote Tallying & Department Mail Slots

- **`Counter`**: An electronic vote counting machine. You feed in a pile of paper ballots, and it instantly outputs exact vote totals for every candidate.
- **`defaultdict(list)`**: A wall of mail cubbies in a corporate mailroom. If a new employee arrives, the mailroom instantly creates an empty cubby for them without rejecting their letter.

```
from collections import Counter
votes = ["Coffee", "Tea", "Coffee", "Water", "Coffee"]
tally = Counter(votes)  # Counter({'Coffee': 3, 'Tea': 1, 'Water': 1})
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Grouping with `defaultdict(list)`
```python
from collections import defaultdict

tickets_by_department = defaultdict(list)
tickets_by_department["Billing"].append("Invoice #101 error")
# No KeyError even though "Billing" was never explicitly created!
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `group_and_tally_feedback(feedback_list: list[dict]) -> dict`:

1. **Input**: A list of feedback dicts: `[{"category": "Shipping", "sentiment": "negative"}, ...]`.
2. **Category Tally**: Use `Counter` to count how many feedbacks exist for each `"category"`.
3. **Sentiment Grouping**: Use `defaultdict(list)` to group feedback categories under `"positive"`, `"neutral"`, or `"negative"`.
4. **Return**: A dictionary with:
   - `"category_counts"`: dict of category counts.
   - `"sentiment_groups"`: dict mapping sentiment strings to lists of categories.

---

## ⚠️ Common Pitfalls

- **Accessing `defaultdict` keys creates them**: Simply referencing `my_defaultdict["nonexistent"]` inserts that key into the dictionary.
""",
        "starter_code": {
            "solution.py": """from collections import Counter, defaultdict

def group_and_tally_feedback(feedback_list: list[dict]) -> dict:
    \"\"\"
    Tallies feedback categories using Counter and groups categories by sentiment using defaultdict.
    \"\"\"
    # TODO: Implement Counter and defaultdict to build and return the summary dictionary
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Customer satisfaction analytics systems group customer feedback comments by sentiment and calculate frequency counts per product department.",
            "exercise_goal": "Implement group_and_tally_feedback(feedback_list) using Counter and defaultdict.",
            "expected_output": "group_and_tally_feedback([\n  {'category': 'Billing', 'sentiment': 'negative'},\n  {'category': 'Billing', 'sentiment': 'negative'}\n]) -> {'category_counts': {'Billing': 2}, 'sentiment_groups': {'negative': ['Billing', 'Billing']}}",
            "failure_mode": "Failing to use Counter or defaultdict properly, or returning wrong structure.",
            "verification_criteria": "Function uses collections utilities and returns accurate counts and groupings.",
            "tests.py": """from solution import group_and_tally_feedback

def test_collections():
    data = [
        {"category": "Delivery", "sentiment": "negative"},
        {"category": "Quality", "sentiment": "positive"},
        {"category": "Delivery", "sentiment": "negative"},
        {"category": "Pricing", "sentiment": "neutral"}
    ]
    res = group_and_tally_feedback(data)
    assert res["category_counts"]["Delivery"] == 2
    assert res["category_counts"]["Quality"] == 1
    assert "Delivery" in res["sentiment_groups"]["negative"]

    print("✓ All assertions passed for Lesson 1.24: Collections Module")

if __name__ == '__main__':
    test_collections()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.25: String Formatting & Templates
    # --------------------------------------------------------------------------
    "node-0-25": {
        "title": "Lesson 1.25: String Templates & Clean Text Formatting",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 25 of 50",
        "cs_foundation": "f-Strings, string.Template, Safe Substitution, and Format Specifiers",
        "ai_convergence": "Real-World Engineering: Generating Standardized Customer Email Notifications & Invoices",
        "handbook_markdown": """# Lesson 1.25: String Templates & Clean Text Formatting

Building dynamic emails, receipts, and system alerts requires formatting text cleanly with numbers, dates, and currency values.

Python provides modern **f-strings** with precision format specifiers, as well as `string.Template` for safe user-supplied substitutions.

---

## 💡 The Real-World Mental Model: Fill-In-The-Blank Certificates

Think of a printed award certificate:
- The standard borders and text are fixed (**the template**).
- Blank underline spaces allow you to fill in the recipient's name and award date cleanly without reprinting the whole page.

```
f"Dear {customer_name}, your balance of ${balance:,.2f} is due on {due_date}."
# Formats 1250.5 -> "$1,250.50" with comma separator and 2 decimals!
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. f-String Format Specifiers
- **`:.2f`**: Float rounded to 2 decimal places.
- **`:,`**: Integer or float with thousands comma separator (`1,000,000`).
- **`:04d`**: Integer padded with leading zeros (`0042`).

```python
price = 14500.5
formatted = f"${price:,.2f}"  # "$14,500.50"
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `render_invoice_summary(client_name: str, invoice_id: int, subtotal: float, tax_rate: float) -> str`:

1. **Calculate**:
   - `tax_amount = subtotal * tax_rate`
   - `total_due = subtotal + tax_amount`
2. **Format**:
   - `invoice_id` padded to 5 digits (e.g. `00142`).
   - Format all monetary numbers with thousands commas and 2 decimals (e.g. `$1,050.00`).
3. **Template**: Return exactly:
   `f"Invoice #{invoice_id:05d} for {client_name.strip().title()}: Subtotal ${subtotal:,.2f}, Tax ${tax_amount:,.2f}, Total ${total_due:,.2f}"`

---

## ⚠️ Common Pitfalls

- **Forgetting the leading `f`**: Writing `"{price:.2f}"` without `f` leaves the raw placeholder as literal text.
""",
        "starter_code": {
            "solution.py": """def render_invoice_summary(client_name: str, invoice_id: int, subtotal: float, tax_rate: float) -> str:
    \"\"\"
    Renders a formatted invoice notification string with zero-padded IDs and formatted currency.
    \"\"\"
    # TODO: Calculate tax and total, then format string using f-string specifiers
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Automated billing software generates standardized customer invoice notices with zero-padded invoice numbers and comma-separated currency values.",
            "exercise_goal": "Implement render_invoice_summary(client_name, invoice_id, subtotal, tax_rate) returning formatted string.",
            "expected_output": "render_invoice_summary('acme corp', 42, 1000.0, 0.08) ->\n'Invoice #00042 for Acme Corp: Subtotal $1,000.00, Tax $80.00, Total $1,080.00'",
            "failure_mode": "Failing to pad invoice_id to 5 digits or missing thousands comma separators.",
            "verification_criteria": "Function returns exact formatted notification string matching formatting rules.",
            "tests.py": """from solution import render_invoice_summary

def test_string_formatting():
    res = render_invoice_summary("acme logistics", 89, 2500.00, 0.10)
    expected = "Invoice #00089 for Acme Logistics: Subtotal $2,500.00, Tax $250.00, Total $2,750.00"
    assert res == expected

    print("✓ All assertions passed for Lesson 1.25: String Formatting & Templates")

if __name__ == '__main__':
    test_string_formatting()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.26: Regular Expressions (re Module)
    # --------------------------------------------------------------------------
    "node-0-26": {
        "title": "Lesson 1.26: Regular Expressions & Pattern Extraction",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 26 of 50",
        "cs_foundation": "Regular Expressions (re module), Pattern Matching, Character Classes, and Capturing Groups",
        "ai_convergence": "Real-World Engineering: Extracting Order Tracking Numbers & Validating Phone Formats",
        "handbook_markdown": """# Lesson 1.26: Regular Expressions & Pattern Extraction

When searching through messy unstructured text for specific patterns—such as order tracking numbers, email addresses, or phone numbers—standard string methods like `.find()` fall short.

Python's built-in **`re` module** allows you to define flexible text patterns using **regular expressions**.

---

## 💡 The Real-World Mental Model: A Cookie Cutter for Text

- **Exact Match (`text == "123"`)**: Only matches one exact shape.
- **Regular Expression (`r"ORD-\d{5}"`)**: A custom-shaped cookie cutter that stamps out any order number starting with `"ORD-"` followed by exactly 5 digits (`ORD-98214`, `ORD-10023`), regardless of where it appears in a paragraph.

```
import re
text = "Contact support at help@store.com or call 555-0199 for Order ORD-48102."
order_match = re.search(r"ORD-(\d{5})", text)
order_number = order_match.group(1)  # "48102"
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Key Regex Tokens
- **`\d`**: Any single digit (`0-9`).
- **`\w`**: Any word character (alphanumeric + underscore).
- **`+`**: 1 or more occurrences.
- **`*`**: 0 or more occurrences.
- **`{n}`**: Exactly `n` occurrences.
- **`()`**: Capturing group to extract specific sub-parts.

```python
import re

phone_pattern = r"\b\d{3}-\d{3}-\d{4}\b"
found = re.findall(phone_pattern, "Call 800-555-0199 or 415-555-0122.")
# Result: ['800-555-0199', '415-555-0122']
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `extract_order_tracking_codes(raw_email_text: str) -> list[str]`:

1. **Pattern**: Match tracking codes formatted as `TRK-[A-Z]{3}-\d{4}` (e.g. `TRK-USA-4910`, `TRK-EUR-8821`).
2. **Search**: Use `re.findall(r"TRK-[A-Z]{3}-\d{4}", raw_email_text)` to find all matching codes in the text.
3. **Return**: The list of matched tracking codes in the order they appear.

---

## ⚠️ Common Pitfalls

- **Always use raw strings (`r"..."`)**: Using `r"..."` prevents Python from treating backslashes like `\d` as escape sequences.
""",
        "starter_code": {
            "solution.py": """import re

def extract_order_tracking_codes(raw_email_text: str) -> list[str]:
    \"\"\"
    Extracts all tracking codes matching 'TRK-[A-Z]{3}-\\d{4}' from text.
    \"\"\"
    # TODO: Use re.findall with raw string pattern to extract and return tracking codes
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Logistics email parsers scan incoming customer support messages to automatically extract parcel tracking numbers and route status updates.",
            "exercise_goal": "Implement extract_order_tracking_codes(raw_email_text) using re.findall to extract all TRK-XXX-0000 tracking codes.",
            "expected_output": "extract_order_tracking_codes('Packages TRK-USA-1042 and TRK-CAN-9921 are on transit.') -> ['TRK-USA-1042', 'TRK-CAN-9921']",
            "failure_mode": "Failing to match uppercase country codes or failing to use raw string regex pattern.",
            "verification_criteria": "Function correctly returns all valid tracking codes from sample text.",
            "tests.py": """from solution import extract_order_tracking_codes

def test_regex_extraction():
    sample = "Your package TRK-USA-8821 was shipped. Backup package TRK-GBR-1234 is delayed. Invalid: TRK-12-34."
    codes = extract_order_tracking_codes(sample)
    assert codes == ["TRK-USA-8821", "TRK-GBR-1234"]

    print("✓ All assertions passed for Lesson 1.26: Regular Expressions")

if __name__ == '__main__':
    test_regex_extraction()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.27: Type Hints & Static Verification
    # --------------------------------------------------------------------------
    "node-0-27": {
        "title": "Lesson 1.27: Modern Python Type Hints & Static Contracts",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 27 of 50",
        "cs_foundation": "Type Annotations, typing module (Union, Optional, Callable), and Static Type Safety",
        "ai_convergence": "Real-World Engineering: Documenting Function Contracts to Prevent Runtime Type Bugs",
        "handbook_markdown": """# Lesson 1.27: Modern Type Hints & Static Contracts

As codebases grow, understanding what types a function expects and returns becomes critical for team collaboration and bug prevention.

Python **type hints** allow you to document clear contracts directly in your function signatures. Modern IDEs use these hints to catch bugs before you even run your code.

---

## 💡 The Real-World Mental Model: Clear Electrical Socket Shapes

- **Untyped Python**: Universal sockets where anyone can plug in anything. If someone plugs a 220V appliance into a 110V socket, it catches fire at runtime.
- **Type Hints**: Specifically shaped, labeled sockets (e.g. `amount: float`, `is_active: bool`). If you try to plug a string into a number slot, your editor warns you immediately.

```python
def calculate_tax(subtotal: float, tax_rate: float) -> float:
    return round(subtotal * tax_rate, 2)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Modern Built-in Type Annotations (Python 3.10+)
```python
# Collections and optional values:
def summarize_inventory(items: list[str], counts: dict[str, int]) -> int:
    return sum(counts.values())

# Union types using the pipe operator (|):
def parse_id(raw_id: str | int) -> str:
    return f"ID_{raw_id}"
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `format_user_summary(user_id: int, username: str, roles: list[str], is_active: bool = True) -> dict[str, str | int | bool | list[str]]`:

1. **Annotations**: Use exact type hints in the function signature for all parameters and return value.
2. **Logic**: Return a dictionary containing:
   - `"id"`: `user_id`
   - `"user"`: `username.strip()`
   - `"roles"`: `roles`
   - `"status"`: `"Active"` if `is_active` else `"Inactive"`
   - `"role_count"`: `len(roles)`

---

## ⚠️ Common Pitfalls

- **Type hints do not enforce types at runtime by default**: Python allows execution even if types don't match, unless you use a static type checker like `mypy`.
""",
        "starter_code": {
            "solution.py": """def format_user_summary(user_id: int, username: str, roles: list[str], is_active: bool = True) -> dict:
    \"\"\"
    Constructs a type-annotated user summary dictionary.
    \"\"\"
    # TODO: Build and return the structured summary dictionary
    pass
"""
        },
        "test_suite": {
            "exercise_about": "User management services format clean, type-annotated profiles to ensure predictable contracts between API handlers and database layers.",
            "exercise_goal": "Implement format_user_summary with proper type hints returning structured dictionary.",
            "expected_output": "format_user_summary(101, 'sarah', ['admin', 'billing']) -> {'id': 101, 'user': 'sarah', 'roles': ['admin', 'billing'], 'status': 'Active', 'role_count': 2}",
            "failure_mode": "Failing to build dictionary matching expected keys or incorrect status mapping.",
            "verification_criteria": "Function returns correctly formatted profile dict with accurate active status.",
            "tests.py": """from solution import format_user_summary

def test_type_hints():
    res = format_user_summary(42, "  alex_c ", ["editor", "reviewer"], is_active=True)
    assert res["id"] == 42
    assert res["user"] == "alex_c"
    assert res["role_count"] == 2
    assert res["status"] == "Active"

    print("✓ All assertions passed for Lesson 1.27: Type Hints")

if __name__ == '__main__':
    test_type_hints()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.28: Dataclasses & Structured Models
    # --------------------------------------------------------------------------
    "node-0-28": {
        "title": "Lesson 1.28: Dataclasses & Structured Data Models",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 28 of 50",
        "cs_foundation": "The @dataclass Decorator, Auto-Generated __init__, __repr__, and __eq__ Methods",
        "ai_convergence": "Real-World Engineering: Representing Customer Orders & Warehouse Stock Items",
        "handbook_markdown": """# Lesson 1.28: Dataclasses & Structured Data Models

When creating classes primarily used to store data, writing repetitive `__init__`, `__repr__`, and `__eq__` methods is tedious boilerplate.

Python's built-in **`@dataclass` decorator** automatically generates these methods from simple type-annotated field definitions.

---

## 💡 The Real-World Mental Model: A Pre-Printed Form Template

- **A Standard Class**: Manually hand-drawing every box, line, and label on a blank piece of paper every single time you need a new form.
- **A Dataclass (`@dataclass`)**: A pre-printed standardized invoice template. You just list the fields (`item_name`, `price`, `quantity`), and Python automatically provides the printing, copying, and equality comparison machinery for you.

```python
from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 1

    def total_cost(self) -> float:
        return round(self.price * self.quantity, 2)
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Free Methods Provided by `@dataclass`
- **`__init__`**: Automatically creates the constructor taking all defined fields.
- **`__repr__`**: Prints clean readable strings like `Product(name='Desk', price=150.0, quantity=1)`.
- **`__eq__`**: Compares two instances by field values instead of memory addresses.

---

## 🛠️ Step-by-Step Exercise Guide

Create a dataclass `CustomerOrder`:

1. **Fields**:
   - `order_id: str`
   - `customer_name: str`
   - `item_price: float`
   - `quantity: int = 1`
   - `is_gift: bool = False`
2. **Method**: Add `def calculate_total(self, discount_rate: float = 0.0) -> float`:
   - Compute `subtotal = self.item_price * self.quantity`.
   - Apply discount: `total = subtotal * (1 - discount_rate)`.
   - Return `round(total, 2)`.

---

## ⚠️ Common Pitfalls

- **Fields with default values must appear last**: Just like function arguments, fields with defaults (like `quantity: int = 1`) must come after fields without defaults.
""",
        "starter_code": {
            "solution.py": """from dataclasses import dataclass

@dataclass
class CustomerOrder:
    \"\"\"
    Represents a structured customer order record.
    \"\"\"
    # TODO: Define order_id, customer_name, item_price, quantity=1, is_gift=False
    # TODO: Implement calculate_total(discount_rate=0.0) -> float
    pass
"""
        },
        "test_suite": {
            "exercise_about": "E-commerce order services use dataclasses to cleanly model order state, calculate totals, and print readable debug logs.",
            "exercise_goal": "Define CustomerOrder dataclass with default fields and calculate_total method.",
            "expected_output": "order = CustomerOrder('ORD-1', 'Alice', 25.0, quantity=2)\norder.calculate_total(0.10) -> 45.00",
            "failure_mode": "Failing to use @dataclass or incorrect default field placement.",
            "verification_criteria": "Dataclass initializes properly, computes discounted totals, and has clean auto-generated repr.",
            "tests.py": """from solution import CustomerOrder

def test_dataclass():
    order1 = CustomerOrder(order_id="ORD-101", customer_name="Alice Smith", item_price=50.0, quantity=2)
    assert order1.quantity == 1 or order1.quantity == 2
    assert order1.calculate_total() == 100.00
    assert order1.calculate_total(discount_rate=0.20) == 80.00
    assert order1.is_gift is False

    print("✓ All assertions passed for Lesson 1.28: Dataclasses")

if __name__ == '__main__':
    test_dataclass()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.29: File I/O & Text Files
    # --------------------------------------------------------------------------
    "node-0-29": {
        "title": "Lesson 1.29: File I/O: Reading, Writing & Safe File Lifecycles",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 29 of 50",
        "cs_foundation": "File Streams, Modes ('r', 'w', 'a'), with open(), and UTF-8 Encoding",
        "ai_convergence": "Real-World Engineering: Saving Daily Transaction Ledgers & Reading Configuration Files",
        "handbook_markdown": """# Lesson 1.29: File I/O: Reading & Writing Files

Persisting data to disk is essential for saving reports, audit logs, and application configurations.

Using Python's built-in **`open()`** function with the **`with` statement** ensures file streams are safely flushed and closed immediately when operations finish.

---

## 💡 The Real-World Mental Model: The Filing Cabinet Drawer

- **`open(..., "w")` (Write)**: Pulling out a folder and replacing the entire contents with a fresh blank sheet.
- **`open(..., "a")` (Append)**: Pulling out a folder and adding a new sheet to the very end of the stack without touching earlier papers.
- **`open(..., "r")` (Read)**: Opening the folder to read the papers without writing anything.
- **`with open(...)`**: Automatically locking and sliding the drawer shut when you step away from the cabinet.

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Reading and Writing Text Files
```python
# Writing to a file (creates or overwrites):
with open("daily_log.txt", "w", encoding="utf-8") as f:
    f.write("Store opened at 08:00 AM\\n")

# Appending a new line:
with open("daily_log.txt", "a", encoding="utf-8") as f:
    f.write("First transaction: $15.50\\n")

# Reading lines:
with open("daily_log.txt", "r", encoding="utf-8") as f:
    lines = f.readlines()
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement two functions:
1. `write_ledger_entry(file_path: str, entry_text: str)`:
   - Appends `f"{entry_text.strip()}\\n"` to `file_path` using mode `"a"` and `encoding="utf-8"`.
2. `count_ledger_entries(file_path: str) -> int`:
   - Reads `file_path` and returns the count of non-empty lines.

---

## ⚠️ Common Pitfalls

- **Always specify `encoding="utf-8"`**: Omitting the encoding can corrupt special characters and accented text on different operating systems.
""",
        "starter_code": {
            "solution.py": """def write_ledger_entry(file_path: str, entry_text: str) -> None:
    \"\"\"Appends a cleaned line of text to the specified file.\"\"\"
    # TODO: Open file in append mode with utf-8 encoding and write entry_text
    pass


def count_ledger_entries(file_path: str) -> int:
    \"\"\"Reads the file and returns the number of non-empty lines.\"\"\"
    # TODO: Read lines and return the count of non-empty lines
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Store accounting systems write timestamped journal entries to audit files and verify ledger row counts during daily reconciliations.",
            "exercise_goal": "Implement write_ledger_entry and count_ledger_entries using with open() and utf-8 encoding.",
            "expected_output": "write_ledger_entry('log.txt', 'Sale: $10')\ncount_ledger_entries('log.txt') -> 1",
            "failure_mode": "Failing to use with open() or omitting newline characters when appending.",
            "verification_criteria": "Functions append clean lines and return accurate line counts from disk.",
            "tests.py": """import os
import tempfile
from solution import write_ledger_entry, count_ledger_entries

def test_file_io():
    with tempfile.NamedTemporaryFile(delete=False, mode="w", encoding="utf-8") as tmp:
        tmp_path = tmp.name

    try:
        # Write initial entry
        write_ledger_entry(tmp_path, "Store Open: Cash $200")
        write_ledger_entry(tmp_path, "Sale #101: $45.50")
        write_ledger_entry(tmp_path, "Sale #102: $12.00")

        assert count_ledger_entries(tmp_path) == 3
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

    print("✓ All assertions passed for Lesson 1.29: File I/O")

if __name__ == '__main__':
    test_file_io()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.30: JSON Serialization & Parsing
    # --------------------------------------------------------------------------
    "node-0-30": {
        "title": "Lesson 1.30: JSON Serialization & Data Interchange",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 30 of 50",
        "cs_foundation": "JavaScript Object Notation (JSON), json.dumps(), json.loads(), and Type Mapping",
        "ai_convergence": "Real-World Engineering: Saving Customer Profiles & Exchanging API Payloads",
        "handbook_markdown": """# Lesson 1.30: JSON Serialization & Data Interchange

**JSON (JavaScript Object Notation)** is the universal data format used by web servers, APIs, and databases to exchange structured information.

Python's built-in **`json` module** makes it simple to convert Python dictionaries and lists into JSON strings (`json.dumps`) and parse JSON text back into Python objects (`json.loads`).

---

## 💡 The Real-World Mental Model: Packing & Unpacking Flat-Pack Furniture

- **Serialization (`json.dumps()`)**: Disassembling a physical wooden table into flat, labeled cardboard boxes with an instruction manual so it can be shipped across the country.
- **Deserialization (`json.loads()`)**: Opening the shipping box at the destination and assembling the parts back into a real wooden table.

```
Python Dictionary: {"name": "Alice", "active": True}
        │
        ▼  json.dumps(..., indent=2)
JSON Text String: '{"name": "Alice", "active": true}'
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Key Functions
- **`json.dumps(obj)`**: Converts a Python dict/list into a JSON string.
- **`json.loads(str)`**: Parses a JSON string into a Python dict/list.
- **`json.dump(obj, file)`**: Writes JSON directly to a file stream.
- **`json.load(file)`**: Reads and parses JSON directly from a file stream.

```python
import json

data = {"item": "Laptop", "price": 999.99, "in_stock": True}
json_string = json.dumps(data, indent=2)
parsed_dict = json.loads(json_string)
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `serialize_and_validate_order(order_dict: dict) -> str`:

1. **Input Validation**: Check that `order_dict` contains `"order_id"`, `"customer"`, and `"items"`. If any is missing, raise `ValueError("Missing required order fields")`.
2. **Serialization**: Use `json.dumps(order_dict, indent=2, sort_keys=True)` to convert the dictionary into a formatted JSON string.
3. **Return**: The resulting JSON string.

---

## ⚠️ Common Pitfalls

- **Python `True` vs JSON `true`**: Python uses capitalized `True` and `None`; JSON uses lowercase `true` and `null`. `json.dumps()` handles this conversion automatically.
""",
        "starter_code": {
            "solution.py": """import json

def serialize_and_validate_order(order_dict: dict) -> str:
    \"\"\"
    Validates required fields in order_dict and returns formatted JSON string with indent=2 and sort_keys=True.
    Raises ValueError if required fields are missing.
    \"\"\"
    # TODO: Validate keys and serialize with json.dumps
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Order dispatch microservices validate incoming e-commerce orders and serialize structured payloads to message queues.",
            "exercise_goal": "Implement serialize_and_validate_order(order_dict) validating fields and returning formatted JSON with indent=2 and sort_keys=True.",
            "expected_output": "serialize_and_validate_order({'order_id': 1, 'customer': 'Alice', 'items': ['Pen']}) ->\n'{\\n  \"customer\": \"Alice\",\\n  \"items\": [\\n    \"Pen\"\\n  ],\\n  \"order_id\": 1\\n}'",
            "failure_mode": "Failing to validate required fields or failing to use indent=2 / sort_keys=True.",
            "verification_criteria": "Function raises ValueError on missing keys and produces valid formatted JSON string.",
            "tests.py": """import json
from solution import serialize_and_validate_order

def test_json_serialization():
    valid_order = {"order_id": 1001, "customer": "Sarah", "items": ["Desk", "Chair"]}
    json_out = serialize_and_validate_order(valid_order)
    
    # Check that output parses back to original dict
    assert json.loads(json_out) == valid_order
    assert "  \"customer\": \"Sarah\"" in json_out

    # Check validation
    try:
        serialize_and_validate_order({"order_id": 1002})
        assert False, "Expected ValueError on missing fields"
    except ValueError:
        pass

    print("✓ All assertions passed for Lesson 1.30: JSON Serialization")

if __name__ == '__main__':
    test_json_serialization()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.31: CSV Data Processing
    # --------------------------------------------------------------------------
    "node-0-31": {
        "title": "Lesson 1.31: CSV Processing with the csv Module",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 31 of 50",
        "cs_foundation": "Comma-Separated Values (CSV), csv.reader, csv.DictReader, and csv.DictWriter",
        "ai_convergence": "Real-World Engineering: Importing Product Catalogs & Calculating Sales Revenue from Spreadsheets",
        "handbook_markdown": """# Lesson 1.31: CSV Processing with the csv Module

Spreadsheets and financial export reports are almost always saved as **CSV (Comma-Separated Values)** files.

Trying to parse CSVs by splitting on commas with `.split(",")` breaks whenever a field contains quotation marks or embedded commas. Python's built-in **`csv` module** handles all quote escaping and header mappings reliably.

---

## 💡 The Real-World Mental Model: A Structured Ledger Grid

- **Raw String Splitting (`.split(","))`)**: Looking at a messy page and drawing knife cuts wherever you see a comma. If someone wrote `"Smith, John"`, you accidentally slice their name in half!
- **`csv.DictReader`**: A skilled accountant reading columns by their header title (`row["Product"]`, `row["Price"]`), safely respecting quotes and commas.

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Reading CSV with `csv.DictReader`
```python
import csv

# Sample CSV file reading:
with open("products.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["name"], float(row["price"]))
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `calculate_csv_revenue(csv_lines: list[str]) -> dict`:

1. **Input**: A list of CSV string lines, where line 0 is the header: `["sku,item_name,price,quantity", "A1,Desk,150.00,2", ...]`.
2. **Parse**: Use `csv.DictReader(csv_lines)` to iterate through the records.
3. **Calculate**:
   - Total items sold (`sum of all quantity integers`).
   - Total gross revenue (`sum of price * quantity for all rows`).
4. **Return**: `{"total_items": total_items, "total_revenue": round(total_revenue, 2)}`.

---

## ⚠️ Common Pitfalls

- **CSV values are always strings**: `row["price"]` is a string like `"150.00"`; always cast to `float()` or `int()` before doing math.
""",
        "starter_code": {
            "solution.py": """import csv

def calculate_csv_revenue(csv_lines: list[str]) -> dict:
    \"\"\"
    Parses CSV lines with csv.DictReader and returns total items sold and total gross revenue.
    \"\"\"
    # TODO: Use csv.DictReader to iterate rows, convert numbers, and compute totals
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Retail management systems parse daily checkout CSV spreadsheet exports to calculate storewide sales revenue and product volume totals.",
            "exercise_goal": "Implement calculate_csv_revenue(csv_lines) using csv.DictReader to compute total items and revenue.",
            "expected_output": "calculate_csv_revenue(['sku,price,quantity', 'A1,10.00,3', 'B2,25.00,2']) -> {'total_items': 5, 'total_revenue': 80.00}",
            "failure_mode": "Failing to convert string values to numbers or failing to use csv.DictReader.",
            "verification_criteria": "Function accurately processes CSV records and returns revenue summary.",
            "tests.py": """from solution import calculate_csv_revenue

def test_csv_processing():
    sample_csv = [
        "sku,item_name,price,quantity",
        "SKU-1,Office Chair,120.00,2",
        "SKU-2,Desk Lamp,35.50,4",
        "SKU-3,Notebook,5.00,10"
    ]
    res = calculate_csv_revenue(sample_csv)
    assert res["total_items"] == 16
    assert res["total_revenue"] == 432.00

    print("✓ All assertions passed for Lesson 1.31: CSV Processing")

if __name__ == '__main__':
    test_csv_processing()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.32: Environment Variables & Secrets
    # --------------------------------------------------------------------------
    "node-0-32": {
        "title": "Lesson 1.32: Environment Variables & Secrets Management",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 32 of 50",
        "cs_foundation": "The os.environ Mapping, os.getenv(), Default Fallbacks, and .env Security",
        "ai_convergence": "Real-World Engineering: Safely Loading Database Passwords & Payment API Keys",
        "handbook_markdown": """# Lesson 1.32: Environment Variables & Secrets Management

Hardcoding passwords, database credentials, or secret API keys directly into your Python source code is a major security hazard. If you commit your code to GitHub, your secrets are exposed to the world.

Instead, production applications load credentials from **environment variables** using Python's **`os.environ`** and **`os.getenv()`**.

---

## 💡 The Real-World Mental Model: A Hotel Safe vs Writing the Code on the Front Door

- **Hardcoded Secret**: Writing your bank vault PIN with a permanent marker on the company lobby window where everyone can see it.
- **Environment Variable**: Putting the master key inside an employee-only security locker on the server. The software asks the operating system for the key at runtime without ever exposing it in the codebase.

```
import os
db_password = os.getenv("DATABASE_PASSWORD", "default_dev_password")
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. `os.environ` vs `os.getenv()`
- **`os.getenv(key, fallback)`**: Returns the value if found, or `fallback` (or `None`) if missing. Does **not** crash.
- **`os.environ[key]`**: Returns the value, but raises `KeyError` if the variable is not set. Useful when a variable is strictly mandatory.

---

## 🛠️ Step-by-Step Exercise Guide

Implement `load_service_credentials(required_keys: list[str]) -> dict`:

1. **Parameters**: Receive `required_keys` (list of environment variable name strings).
2. **Validation**:
   - For each key in `required_keys`:
     - Fetch the value using `os.getenv(key)`.
     - If the key is missing or empty string `""`, raise `KeyError(f"Missing mandatory environment variable: {key}")`.
3. **Return**: A dictionary mapping each key to its environment variable string value.

---

## ⚠️ Common Pitfalls

- **Never commit `.env` files to git**: Always add `.env` to your `.gitignore` file to protect secret keys.
""",
        "starter_code": {
            "solution.py": """import os

def load_service_credentials(required_keys: list[str]) -> dict:
    \"\"\"
    Loads and validates mandatory environment variables.
    Raises KeyError if any required variable is missing or empty.
    \"\"\"
    # TODO: Loop over required_keys, validate existence in os.environ/os.getenv, and return dict
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Backend application boots validate that all mandatory database passwords and payment gateway API secrets exist in the runtime environment before starting servers.",
            "exercise_goal": "Implement load_service_credentials(required_keys) that loads env variables or raises KeyError if missing.",
            "expected_output": "os.environ['DB_PORT'] = '5432'\nload_service_credentials(['DB_PORT']) -> {'DB_PORT': '5432'}",
            "failure_mode": "Failing to raise KeyError on missing keys or returning incomplete credentials dictionary.",
            "verification_criteria": "Function properly loads environment variables and raises descriptive KeyError on missing entries.",
            "tests.py": """import os
from solution import load_service_credentials

def test_env_secrets():
    os.environ["TEST_PAYMENT_KEY"] = "sk_live_12345"
    os.environ["TEST_DB_HOST"] = "localhost"

    # Valid load
    creds = load_service_credentials(["TEST_PAYMENT_KEY", "TEST_DB_HOST"])
    assert creds["TEST_PAYMENT_KEY"] == "sk_live_12345"
    assert creds["TEST_DB_HOST"] == "localhost"

    # Missing key
    try:
        load_service_credentials(["NON_EXISTENT_SECRET_XYZ"])
        assert False, "Expected KeyError for missing secret"
    except KeyError:
        pass

    print("✓ All assertions passed for Lesson 1.32: Environment Variables")

if __name__ == '__main__':
    test_env_secrets()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.33: Command-Line Tools with Argparse
    # --------------------------------------------------------------------------
    "node-0-33": {
        "title": "Lesson 1.33: Command-Line Interfaces with Argparse",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 33 of 50",
        "cs_foundation": "Command-Line Arguments, sys.argv, argparse.ArgumentParser, and Flags",
        "ai_convergence": "Real-World Engineering: Building Terminal Utilities for Batch File Processing",
        "handbook_markdown": """# Lesson 1.33: Command-Line Interfaces with Argparse

Software engineers build command-line interface (CLI) tools so scripts can be automated in terminal pipelines and server cron jobs.

Python's built-in **`argparse` module** handles argument parsing, flag validation, type conversion, and automatic `--help` documentation.

---

## 💡 The Real-World Mental Model: A Fast-Food Drive-Through Order Window

- **Positional Arguments (`filename`)**: The main order item that is strictly required (e.g. *"Burger"*).
- **Optional Flags (`--verbose`, `--limit 10`)**: Custom toppings and add-ons (e.g. *"--extra-cheese"*, *"--no-pickles"*). If you don't mention them, the kitchen uses standard defaults.

```
python backup.py /var/data --compress --limit 50
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Setting Up `ArgumentParser`
```python
import argparse

parser = argparse.ArgumentParser(description="Process warehouse inventory")
parser.add_argument("filename", help="Path to input CSV file")
parser.add_argument("--limit", type=int, default=100, help="Max records to process")
parser.add_argument("--verbose", action="store_true", help="Enable detailed logging")

# Parsing a list of argument strings:
args = parser.parse_args(["inventory.csv", "--limit", "25", "--verbose"])
print(args.filename)  # "inventory.csv"
print(args.limit)     # 25
print(args.verbose)   # True
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `create_cli_parser() -> argparse.ArgumentParser`:

1. **Parser**: Initialize `parser = argparse.ArgumentParser(description="Store audit tool")`.
2. **Arguments**:
   - Positional: `"store_id"` (string).
   - Optional: `"--min-amount"`, `type=float`, `default=0.0`, `help="Minimum purchase threshold"`.
   - Optional Flag: `"--export-csv"`, `action="store_true"`, `help="Export results to CSV"`.
3. **Return**: Return the configured `ArgumentParser` object.

---

## ⚠️ Common Pitfalls

- **Flags with `action="store_true"`**: Do not pass a `type` parameter when using `action="store_true"`. It automatically stores a boolean `True` if the flag is present and `False` if omitted.
""",
        "starter_code": {
            "solution.py": """import argparse

def create_cli_parser() -> argparse.ArgumentParser:
    \"\"\"
    Configures and returns an ArgumentParser with:
    - store_id (positional str)
    - --min-amount (float, default 0.0)
    - --export-csv (boolean flag, default False)
    \"\"\"
    # TODO: Build and return configured ArgumentParser
    pass
"""
        },
        "test_suite": {
            "exercise_about": "DevOps scripts and database migration utilities parse command-line arguments and configuration flags to automate terminal workflows.",
            "exercise_goal": "Implement create_cli_parser() returning an ArgumentParser with store_id, --min-amount, and --export-csv.",
            "expected_output": "parser = create_cli_parser()\nargs = parser.parse_args(['STORE-99', '--min-amount', '25.50', '--export-csv'])\nargs.store_id == 'STORE-99' and args.min_amount == 25.50 and args.export_csv is True",
            "failure_mode": "Missing argument declarations or wrong flag actions.",
            "verification_criteria": "Parser correctly parses valid CLI argument lists with correct types and defaults.",
            "tests.py": """from solution import create_cli_parser

def test_argparse_cli():
    parser = create_cli_parser()
    args = parser.parse_args(["STORE-101", "--min-amount", "50.0", "--export-csv"])
    
    assert args.store_id == "STORE-101"
    assert args.min_amount == 50.0
    assert args.export_csv is True

    # Test defaults
    args_default = parser.parse_args(["STORE-202"])
    assert args_default.store_id == "STORE-202"
    assert args_default.min_amount == 0.0
    assert args_default.export_csv is False

    print("✓ All assertions passed for Lesson 1.33: Argparse & CLI Tools")

if __name__ == '__main__':
    test_argparse_cli()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.34: Virtual Environments & Dependencies
    # --------------------------------------------------------------------------
    "node-0-34": {
        "title": "Lesson 1.34: Virtual Environments & Dependency Isolation",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 34 of 50",
        "cs_foundation": "Python Virtual Environments (venv), Dependency Isolation, and requirements.txt",
        "ai_convergence": "Real-World Engineering: Managing Conflicting Library Versions Across Multi-Project Repos",
        "handbook_markdown": """# Lesson 1.34: Virtual Environments & Dependency Isolation

When building software, different projects often require different versions of external libraries. If Project A needs `requests==2.25` and Project B needs `requests==2.31`, installing them globally creates dependency conflicts.

A **virtual environment** is an isolated Python directory containing its own interpreter and independent package collection.

---

## 💡 The Real-World Mental Model: Separate Toolboxes for Different Workshops

- **Global Python**: Dumping every single wrench, hammer, and electronic tool from five different contractors into one giant messy pile in the garage. Tools get lost or damaged.
- **Virtual Environment (`.venv`)**: A dedicated, labeled toolbox for each specific job. Project A has its exact tools, and Project B has its exact tools, completely isolated from each other.

```
my_project/
   ├── .venv/            # Isolated Python binaries and libraries
   ├── requirements.txt  # Manifest of exact package versions
   └── app.py
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Essential Terminal Commands
```bash
# Create a virtual environment:
python3 -m venv .venv

# Activate on Linux/macOS:
source .venv/bin/activate

# Install dependencies:
pip install requests==2.31.0

# Export exact dependencies:
pip freeze > requirements.txt
```

---

## 🛠️ Step-by-Step Exercise Guide

Implement `parse_requirements_file(requirements_content: str) -> dict[str, str]`:

1. **Input**: A multi-line string simulating `requirements.txt`:
   ```
   # Core dependencies
   requests==2.31.0
   pydantic==2.6.4
   pytest>=8.0.0
   ```
2. **Parse**:
   - Ignore empty lines and lines starting with `#`.
   - For lines containing `==` or `>=`:
     - Split package name and version specification.
     - Strip whitespace.
     - Store in dictionary: `{package_name: version_spec}`.
3. **Return**: The parsed dictionary.

---

## ⚠️ Common Pitfalls

- **Never commit the `.venv` directory to git**: Always add `.venv/` to `.gitignore`. Commit `requirements.txt` instead so teammates can recreate the environment.
""",
        "starter_code": {
            "solution.py": """def parse_requirements_file(requirements_content: str) -> dict[str, str]:
    \"\"\"
    Parses requirements.txt content, ignoring comments and returning {package_name: version} mapping.
    \"\"\"
    # TODO: Parse lines, ignore comments, extract package names and version specifiers
    pass
"""
        },
        "test_suite": {
            "exercise_about": "CI/CD automated deployment pipelines parse requirements.txt manifests to verify dependency versions before container builds.",
            "exercise_goal": "Implement parse_requirements_file(requirements_content) extracting clean package version mappings.",
            "expected_output": "parse_requirements_file('requests==2.31.0\\n# testing\\npytest==8.0.0') -> {'requests': '2.31.0', 'pytest': '8.0.0'}",
            "failure_mode": "Failing to ignore comments or handling whitespace incorrectly.",
            "verification_criteria": "Function parses requirements text into clean dictionary.",
            "tests.py": """from solution import parse_requirements_file

def test_requirements_parser():
    content = \"\"\"
    # Production API requirements
    httpx==0.27.0
    pydantic==2.6.4

    # Development tools
    pytest==8.1.1
    \"\"\"
    res = parse_requirements_file(content)
    assert res["httpx"] == "0.27.0"
    assert res["pydantic"] == "2.6.4"
    assert res["pytest"] == "8.1.1"
    assert len(res) == 3

    print("✓ All assertions passed for Lesson 1.34: Virtual Environments")

if __name__ == '__main__':
    test_requirements_parser()
"""
        }
    },

    # --------------------------------------------------------------------------
    # LESSON 1.35: Modules, Packages & Clean Imports
    # --------------------------------------------------------------------------
    "node-0-35": {
        "title": "Lesson 1.35: Modules, Packages & Clean Imports",
        "subtitle": "Module 1: Python Programming Foundations | Lesson 35 of 50",
        "cs_foundation": "Python Modules (.py files), Packages (__init__.py), Relative vs Absolute Imports",
        "ai_convergence": "Real-World Engineering: Architecting Multi-File Microservice Codebases",
        "handbook_markdown": """# Lesson 1.35: Modules, Packages & Clean Imports

As software projects grow beyond a single script, organizing functions, classes, and constants into clean **modules** and **packages** is essential for maintainability.

Every Python file is a **module**, and any folder containing an `__init__.py` file is a **package**.

---

## 💡 The Real-World Mental Model: Organizing Office Departments

- **Single Monolithic File**: Keeping invoices, engineering schematics, HR files, and payroll all jammed into one single giant drawer.
- **Modules and Packages**: Labeled department folders:
  - `billing/` (invoices, taxes, receipts)
  - `inventory/` (stock, warehouse, suppliers)
  - `auth/` (passwords, tokens, sessions)

```
store_backend/
   ├── __init__.py
   ├── billing.py       # module with tax and receipt logic
   └── inventory.py     # module with stock lookup logic
```

---

## 🔍 Deep Dive: Understanding the Concept

### 1. Clean Imports
- **Absolute Import**: `from store_backend.billing import calculate_tax` (Explicit, unambiguous).
- **Avoid Star Imports (`from module import *`)**: Pollutes your namespace and makes it impossible to know where functions originated.

---

## 🛠️ Step-by-Step Exercise Guide

Implement `validate_module_exports(module_dict: dict, expected_exports: list[str]) -> bool`:

1. **Parameters**:
   - `module_dict`: A dictionary representing a module's namespace (like `{"calculate_tax": ..., "DEFAULT_RATE": ...}`).
   - `expected_exports`: List of mandatory function/constant names.
2. **Verification**: Check if all names in `expected_exports` exist as keys in `module_dict`.
3. **Return**: `True` if all expected exports exist, otherwise `False`.

---

## ⚠️ Common Pitfalls

- **Circular Imports**: Module A importing Module B while Module B imports Module A causes runtime `ImportError`. Keep dependency graphs unidirectional.
""",
        "starter_code": {
            "solution.py": """def validate_module_exports(module_dict: dict, expected_exports: list[str]) -> bool:
    \"\"\"
    Verifies that a module namespace contains all expected public functions and constants.
    \"\"\"
    # TODO: Check that all expected_exports exist in module_dict
    pass
"""
        },
        "test_suite": {
            "exercise_about": "Architectural linting tools verify that public package interfaces export all required service contracts before publishing releases.",
            "exercise_goal": "Implement validate_module_exports(module_dict, expected_exports) returning boolean verification.",
            "expected_output": "validate_module_exports({'tax': 1, 'calc': 2}, ['tax', 'calc']) -> True",
            "failure_mode": "Failing to check all export keys.",
            "verification_criteria": "Function returns accurate boolean contract verification.",
            "tests.py": """from solution import validate_module_exports

def test_module_exports():
    fake_module = {
        "calculate_tax": lambda x: x * 0.1,
        "format_receipt": lambda r: str(r),
        "TAX_RATE": 0.08
    }
    assert validate_module_exports(fake_module, ["calculate_tax", "TAX_RATE"]) is True
    assert validate_module_exports(fake_module, ["calculate_tax", "NON_EXISTENT_FN"]) is False

    print("✓ All assertions passed for Lesson 1.35: Modules & Packages")

if __name__ == '__main__':
    test_module_exports()
"""
        }
    }
}

def apply_patch():
    print(f"Applying patch to {len(LESSONS_21_35)} lessons (node-0-21 to node-0-35)...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    for node_id, data in LESSONS_21_35.items():
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
