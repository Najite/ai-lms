#!/usr/bin/env python3
"""
Generates lib/exercises-catalog.ts with crystal-clear 3-part descriptions for every exercise:
1. 🎯 What This Exercise Is About (Real-world context)
2. 🧠 What We Are Trying to Solve (Exact problem & logic)
3. 📋 What The Expected Result Looks Like (Clear inputs, outputs, and explanations)
"""

CATALOG_TS = """export type ExerciseDifficulty = "Easy" | "Medium" | "Hard";

export type ExerciseTier =
  | "Concept Warmup"
  | "Logical Application"
  | "Edge Case Check"
  | "Practical Scenario"
  | "Warmup"
  | "LeetCode Canonical"
  | "Hard Boundary"
  | "Resilience & Fault Trap"
  | "Enterprise Domain Stress"
  | "AI/Systems Engineering";

export interface ExerciseItem {
  id: string; // e.g., 'ex-0-1-1'
  lessonId: string; // e.g., 'node-0-1'
  orderIndex: number; // 1, 2, 3, 4, 5, 6
  title: string;
  difficulty: ExerciseDifficulty;
  tier: ExerciseTier;
  leetcodeEquivalent?: string;
  tags: string[];
  descriptionMarkdown: string;
  starterCode: string;
  testSuite: string;
  hints: string[];
}

/**
 * 4-tier progressive exercise ladder per lesson:
 * Level 1 (Concept Warmup): Direct syntax and basic logical check, zero steepness.
 * Level 2 (Logical Application): Real-world application of the single concept.
 * Level 3 (Edge Case Check): Clean handling of zeros, negatives, or boundary states.
 * Level 4 (Practical Scenario): Multi-step practical problem solving in a realistic context.
 */
export const COMPREHENSIVE_EXERCISES_CATALOG: ExerciseItem[] = [
  // =========================================================================
  // LESSON 1.1 (node-0-1): Python Basics & Data Types
  // =========================================================================
  {
    id: "ex-0-1-1",
    lessonId: "node-0-1",
    orderIndex: 1,
    title: "Parse & Multiply Cart Quantity",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "Basic Type Conversion",
    tags: ["Types", "Casting", "Basics"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
When customers submit an online checkout form, information sent from the web browser arrives as text strings (like \`"4"\` items for \`"12.50"\` dollars each). Before any calculations or billing can take place, our software must convert these text strings into proper Python numbers.

### 🧠 What We Are Trying to Solve
We need to write a clean conversion function \`parse_and_multiply(qty_str: str, price_str: str) -> float\`:
1. Convert \`qty_str\` into a whole number integer using \`int()\`.
2. Convert \`price_str\` into a decimal number using \`float()\`.
3. Multiply the quantity by the unit price.
4. Return the total cost rounded to 2 decimal places using \`round(total, 2)\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: parse_and_multiply("4", "12.50")
Output: 50.00
Explanation: Converts "4" to 4, "12.50" to 12.50, and computes 4 * 12.50 = 50.00.

Input: parse_and_multiply("1", "0.99")
Output: 0.99
Explanation: Converts "1" to 1, "0.99" to 0.99, and computes 1 * 0.99 = 0.99.
\`\`\``,
    starterCode: `def parse_and_multiply(qty_str: str, price_str: str) -> float:
    # TODO: Convert qty_str to int, price_str to float, and return total rounded to 2 decimals
    pass
`,
    testSuite: `from solution import parse_and_multiply

assert parse_and_multiply("4", "12.50") == 50.00, "Test 1 failed: parse_and_multiply('4', '12.50')"
assert parse_and_multiply("1", "0.99") == 0.99, "Test 2 failed: parse_and_multiply('1', '0.99')"
assert parse_and_multiply("10", "5.25") == 52.50, "Test 3 failed: parse_and_multiply('10', '5.25')"
print("✓ All assertions passed for Parse & Multiply Cart Quantity")
`,
    hints: [
      "Use int(qty_str) to convert text into a whole number integer.",
      "Use float(price_str) to convert text into a decimal number float.",
      "Multiply them and use round(result, 2) before returning.",
    ],
  },
  {
    id: "ex-0-1-2",
    lessonId: "node-0-1",
    orderIndex: 2,
    title: "Item Subtotal with Sales Tax",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "Arithmetic Application",
    tags: ["Types", "Math", "Financial"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Stores and checkout systems must accurately compute sales tax on customer purchases so receipts reflect the true legal bill amount.

### 🧠 What We Are Trying to Solve
Implement \`calculate_item_total(price: float, quantity: int, tax_rate: float) -> float\`:
1. Calculate the raw item subtotal: \`price * quantity\`.
2. Apply the sales tax by multiplying the subtotal by \`(1.0 + tax_rate)\`.
3. Return the grand total rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: calculate_item_total(10.0, 2, 0.05)
Output: 21.00
Explanation: 2 items at $10.00 each is $20.00. With 5% sales tax (0.05), total is 20.00 * 1.05 = 21.00.

Input: calculate_item_total(5.50, 4, 0.10)
Output: 24.20
Explanation: 4 items at $5.50 is $22.00. With 10% tax (0.10), total is 22.00 * 1.10 = 24.20.
\`\`\``,
    starterCode: `def calculate_item_total(price: float, quantity: int, tax_rate: float) -> float:
    # TODO: Calculate subtotal, apply sales tax, and return rounded total
    pass
`,
    testSuite: `from solution import calculate_item_total

assert calculate_item_total(10.0, 2, 0.05) == 21.00, "Test 1 failed"
assert calculate_item_total(5.50, 4, 0.10) == 24.20, "Test 2 failed"
assert calculate_item_total(100.0, 1, 0.00) == 100.00, "Test 3 failed"
print("✓ All assertions passed for Item Subtotal with Sales Tax")
`,
    hints: [
      "Subtotal is price * quantity.",
      "Total with tax is subtotal * (1.0 + tax_rate).",
      "Round the final result with round(..., 2).",
    ],
  },
  {
    id: "ex-0-1-3",
    lessonId: "node-0-1",
    orderIndex: 3,
    title: "Fahrenheit to Celsius Converter",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "Unit Conversion",
    tags: ["Floats", "Formula", "Conversion"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Weather monitoring apps receive data in Fahrenheit from certain sensors, but standard international meteorological records require temperatures in Celsius.

### 🧠 What We Are Trying to Solve
Implement \`fahrenheit_to_celsius(f_temp: float) -> float\`:
- Use the standard scientific formula: $C = (F - 32) \\times \\frac{5}{9}$.
- Return the converted Celsius temperature rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: fahrenheit_to_celsius(32.0)
Output: 0.0
Explanation: 32°F is the freezing point of water, which is exactly 0.0°C.

Input: fahrenheit_to_celsius(212.0)
Output: 100.0
Explanation: 212°F is the boiling point of water, which is exactly 100.0°C.
\`\`\``,
    starterCode: `def fahrenheit_to_celsius(f_temp: float) -> float:
    # TODO: Convert f_temp to Celsius and return rounded to 2 decimals
    pass
`,
    testSuite: `from solution import fahrenheit_to_celsius

assert fahrenheit_to_celsius(32.0) == 0.0, "Failed at 32°F"
assert fahrenheit_to_celsius(212.0) == 100.0, "Failed at 212°F"
assert fahrenheit_to_celsius(98.6) == 37.0, "Failed at body temperature 98.6°F"
assert fahrenheit_to_celsius(-40.0) == -40.0, "Failed at -40°F"
print("✓ All assertions passed for Fahrenheit to Celsius Converter")
`,
    hints: [
      "Wrap (f_temp - 32.0) in parentheses so subtraction happens before multiplication.",
      "Multiply by (5.0 / 9.0) and use round(..., 2).",
    ],
  },
  {
    id: "ex-0-1-4",
    lessonId: "node-0-1",
    orderIndex: 4,
    title: "Vending Machine Coin Change Breakdown",
    difficulty: "Medium",
    tier: "Practical Scenario",
    leetcodeEquivalent: "Modulo & Floor Division Breakdown",
    tags: ["Integers", "Modulo", "Floor Division"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
A self-service vending machine or payment kiosk needs to dispense coins to customers. It dispenses as many 25-cent quarters as possible, then counts any leftover pennies.

### 🧠 What We Are Trying to Solve
Implement \`calculate_change_breakdown(total_cents: int) -> tuple[int, int]\`:
1. Use floor division (\`// 25\`) to determine how many full 25-cent quarters can be dispensed.
2. Use modulo remainder (\`% 25\`) to determine the leftover cents.
3. Return the pair as a tuple: \`(quarters, remaining_cents)\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: calculate_change_breakdown(87)
Output: (3, 12)
Explanation: 87 cents = 3 quarters (75 cents) + 12 loose pennies.

Input: calculate_change_breakdown(100)
Output: (4, 0)
Explanation: Exactly 4 quarters with 0 cents left over.
\`\`\``,
    starterCode: `def calculate_change_breakdown(total_cents: int) -> tuple[int, int]:
    # TODO: Calculate quarters and remaining loose cents using // and %
    pass
`,
    testSuite: `from solution import calculate_change_breakdown

assert calculate_change_breakdown(87) == (3, 12), "Failed 87 cents"
assert calculate_change_breakdown(100) == (4, 0), "Failed 100 cents"
assert calculate_change_breakdown(20) == (0, 20), "Failed 20 cents"
assert calculate_change_breakdown(0) == (0, 0), "Failed 0 cents"
print("✓ All assertions passed for Vending Machine Coin Change Breakdown")
`,
    hints: [
      "full_quarters = total_cents // 25",
      "leftover_cents = total_cents % 25",
      "Return them together as (full_quarters, leftover_cents).",
    ],
  },

  // =========================================================================
  // LESSON 1.2 (node-0-2): Operators & Arithmetic Precedence
  // =========================================================================
  {
    id: "ex-0-2-1",
    lessonId: "node-0-2",
    orderIndex: 1,
    title: "Store Promotional Discount Calculator",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "Precedence & Percentage Math",
    tags: ["Operators", "Precedence", "Discounts"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
During seasonal sales events, retail stores apply percentage discounts (like 20% off) to item prices.

### 🧠 What We Are Trying to Solve
Implement \`apply_store_discount(price: float, discount_percent: float) -> float\`:
1. Convert the discount percentage into a fraction: \`discount_percent / 100.0\`.
2. Multiply the original price by the discounted factor: \`price * (1.0 - (discount_percent / 100.0))\`.
3. Return the final price rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: apply_store_discount(100.0, 20.0)
Output: 80.00
Explanation: 20% off $100.00 leaves $80.00.

Input: apply_store_discount(50.0, 10.0)
Output: 45.00
Explanation: 10% off $50.00 ($5 discount) leaves $45.00.
\`\`\``,
    starterCode: `def apply_store_discount(price: float, discount_percent: float) -> float:
    # TODO: Calculate discounted price and return rounded to 2 decimals
    pass
`,
    testSuite: `from solution import apply_store_discount

assert apply_store_discount(100.0, 20.0) == 80.00, "Failed on 20% of 100"
assert apply_store_discount(50.0, 10.0) == 45.00, "Failed on 10% of 50"
assert apply_store_discount(80.0, 0.0) == 80.00, "Failed on 0% discount"
assert apply_store_discount(40.0, 50.0) == 20.00, "Failed on 50% discount"
print("✓ All assertions passed for Store Promotional Discount Calculator")
`,
    hints: [
      "Convert discount_percent into a decimal fraction: discount_percent / 100.0.",
      "Multiply price by (1.0 - (discount_percent / 100.0)).",
      "Round using round(..., 2).",
    ],
  },
  {
    id: "ex-0-2-2",
    lessonId: "node-0-2",
    orderIndex: 2,
    title: "Restaurant Bill Splitting with Tip",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "Even Distribution Formula",
    tags: ["Operators", "Financial", "Division"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
When friends share a meal at a restaurant, the total bill (including a gratuity tip percentage) must be split fairly and equally among all diners.

### 🧠 What We Are Trying to Solve
Implement \`split_restaurant_bill(subtotal: float, tip_percent: float, num_people: int) -> float\`:
1. Calculate the total bill including tip: \`subtotal * (1.0 + (tip_percent / 100.0))\`.
2. Divide the total bill equally by \`num_people\`.
3. Return each individual person's share rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: split_restaurant_bill(100.0, 20.0, 4)
Output: 30.00
Explanation: $100.00 bill with 20% tip = $120.00 total. Divided among 4 people = $30.00 each.

Input: split_restaurant_bill(45.0, 0.0, 3)
Output: 15.00
Explanation: $45.00 bill with 0% tip divided among 3 people = $15.00 each.
\`\`\``,
    starterCode: `def split_restaurant_bill(subtotal: float, tip_percent: float, num_people: int) -> float:
    # TODO: Compute grand total with tip and divide by num_people, rounded to 2 decimals
    pass
`,
    testSuite: `from solution import split_restaurant_bill

assert split_restaurant_bill(100.0, 20.0, 4) == 30.00, "Failed test 1"
assert split_restaurant_bill(45.0, 0.0, 3) == 15.00, "Failed test 2"
assert split_restaurant_bill(75.50, 15.0, 2) == 43.41, "Failed test 3"
print("✓ All assertions passed for Restaurant Bill Splitting with Tip")
`,
    hints: [
      "First find total_with_tip = subtotal * (1.0 + (tip_percent / 100.0)).",
      "Divide total_with_tip / num_people.",
      "Use round(..., 2) on the final result.",
    ],
  },
  {
    id: "ex-0-2-3",
    lessonId: "node-0-2",
    orderIndex: 3,
    title: "Warehouse Shipping Box Packer",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "Floor Division & Modulo Pairing",
    tags: ["Operators", "Modulo", "Logistics"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Warehouse fulfilment centers pack individual products into standard cardboard boxes of fixed capacity before loading them onto delivery trucks.

### 🧠 What We Are Trying to Solve
Implement \`compute_packing_boxes(total_items: int, box_capacity: int) -> tuple[int, int]\`:
- Use floor division (\`//\`) to find how many full boxes are packed.
- Use modulo remainder (\`%\`) to find how many loose items remain.
- Return the tuple \`(full_boxes, leftover_items)\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: compute_packing_boxes(23, 5)
Output: (4, 3)
Explanation: 23 items fit into 4 full boxes (20 items) with 3 leftover loose items.

Input: compute_packing_boxes(10, 5)
Output: (2, 0)
Explanation: 10 items fit perfectly into 2 full boxes with 0 leftovers.
\`\`\``,
    starterCode: `def compute_packing_boxes(total_items: int, box_capacity: int) -> tuple[int, int]:
    # TODO: Calculate full boxes and leftovers
    pass
`,
    testSuite: `from solution import compute_packing_boxes

assert compute_packing_boxes(23, 5) == (4, 3), "Failed 23 items with capacity 5"
assert compute_packing_boxes(10, 5) == (2, 0), "Failed 10 items with capacity 5"
assert compute_packing_boxes(3, 10) == (0, 3), "Failed 3 items with capacity 10"
print("✓ All assertions passed for Warehouse Shipping Box Packer")
`,
    hints: [
      "full_boxes = total_items // box_capacity",
      "leftovers = total_items % box_capacity",
    ],
  },
  {
    id: "ex-0-2-4",
    lessonId: "node-0-2",
    orderIndex: 4,
    title: "Exam Grade Average Calculator",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "Mean Average Calculation",
    tags: ["Operators", "Average", "Precedence"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Academic grading portals calculate the average performance of a student across three exams.

### 🧠 What We Are Trying to Solve
Implement \`calculate_average_score(score1: float, score2: float, score3: float) -> float\`:
1. Sum all three scores inside parentheses: \`(score1 + score2 + score3)\`.
2. Divide the combined sum by 3.0.
3. Return the average rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: calculate_average_score(80.0, 90.0, 100.0)
Output: 90.00
Explanation: (80 + 90 + 100) / 3 = 270 / 3 = 90.00.

Input: calculate_average_score(70.0, 70.0, 71.0)
Output: 70.33
Explanation: (70 + 70 + 71) / 3 = 211 / 3 = 70.33.
\`\`\``,
    starterCode: `def calculate_average_score(score1: float, score2: float, score3: float) -> float:
    # TODO: Calculate average score with parentheses and round to 2 decimals
    pass
`,
    testSuite: `from solution import calculate_average_score

assert calculate_average_score(80.0, 90.0, 100.0) == 90.00, "Failed test 1"
assert calculate_average_score(75.0, 85.0, 95.0) == 85.00, "Failed test 2"
assert calculate_average_score(70.0, 70.0, 71.0) == 70.33, "Failed test 3"
print("✓ All assertions passed for Exam Grade Average Calculator")
`,
    hints: [
      "Wrap the sum in parentheses: (score1 + score2 + score3) / 3.0.",
      "Without parentheses, Python would divide only score3 by 3.0 due to operator precedence!",
    ],
  },

  // =========================================================================
  // LESSON 1.3 (node-0-3): String Slicing & Formatting
  // =========================================================================
  {
    id: "ex-0-3-1",
    lessonId: "node-0-3",
    orderIndex: 1,
    title: "First & Last Character Extractor",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "String Indexing",
    tags: ["Strings", "Indexing"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Software systems often generate abbreviations or badge acronyms by extracting boundary letters from user identifiers.

### 🧠 What We Are Trying to Solve
Implement \`get_first_and_last_char(text: str) -> str\`:
- If \`text\` is empty (\`""\`), return \`""\`.
- Otherwise, extract the character at index \`0\` and index \`-1\`, and join them together.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: get_first_and_last_char("Python")
Output: "Pn"
Explanation: First letter is 'P' (index 0), last letter is 'n' (index -1).

Input: get_first_and_last_char("A")
Output: "AA"
Explanation: For a single character, both index 0 and index -1 are 'A'.
\`\`\``,
    starterCode: `def get_first_and_last_char(text: str) -> str:
    # TODO: Extract first and last characters or return empty string
    pass
`,
    testSuite: `from solution import get_first_and_last_char

assert get_first_and_last_char("Python") == "Pn", "Failed on 'Python'"
assert get_first_and_last_char("A") == "AA", "Failed on 'A'"
assert get_first_and_last_char("") == "", "Failed on empty string"
assert get_first_and_last_char("Antigravity") == "Ay", "Failed on 'Antigravity'"
print("✓ All assertions passed for First & Last Character Extractor")
`,
    hints: [
      "Check if not text: return '' first to handle empty strings safely.",
      "Combine text[0] + text[-1].",
    ],
  },
  {
    id: "ex-0-3-2",
    lessonId: "node-0-3",
    orderIndex: 2,
    title: "Notification Message Trimmer",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "String Slicing & Length Guard",
    tags: ["Strings", "Slicing", "UI"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Smartphones, watch displays, and SMS alerts have strict screen limits. If an order update or notification message is too long, the system safely cuts the text and appends an ellipsis (\`"..."\`).

### 🧠 What We Are Trying to Solve
Implement \`format_notification_preview(message: str, max_len: int) -> str\`:
- If \`len(message) <= max_len\`, return \`message\` unchanged.
- If it exceeds \`max_len\`, slice the first \`max_len\` characters (\`message[:max_len]\`) and append \`"..."\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: format_notification_preview("Hello World", 5)
Output: "Hello..."
Explanation: "Hello World" (length 11) is longer than 5, so it is sliced to first 5 letters + "...".

Input: format_notification_preview("Hi", 5)
Output: "Hi"
Explanation: "Hi" (length 2) fits within 5 characters, so no ellipsis is added.
\`\`\``,
    starterCode: `def format_notification_preview(message: str, max_len: int) -> str:
    # TODO: Check length and slice message if longer than max_len
    pass
`,
    testSuite: `from solution import format_notification_preview

assert format_notification_preview("Hello World", 5) == "Hello...", "Failed long text"
assert format_notification_preview("Hi", 5) == "Hi", "Failed short text"
assert format_notification_preview("Exact", 5) == "Exact", "Failed exact length"
assert format_notification_preview("", 10) == "", "Failed empty text"
print("✓ All assertions passed for Notification Message Trimmer")
`,
    hints: [
      "Use len(message) to test against max_len.",
      "Use slice notation message[:max_len] + '...' when trimming.",
    ],
  },
  {
    id: "ex-0-3-3",
    lessonId: "node-0-3",
    orderIndex: 3,
    title: "User Handle Formatter",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "String Cleaning & f-strings",
    tags: ["Strings", "Formatting", "f-strings"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
User registration forms frequently receive inputs with messy spaces or mixed uppercase and lowercase letters. A registration system standardizes these into clean username tags.

### 🧠 What We Are Trying to Solve
Implement \`format_user_tag(first_name: str, last_name: str) -> str\`:
1. Clean leading and trailing whitespace using \`.strip()\`.
2. Capitalize the first letter using \`.capitalize()\`.
3. Combine them with an underscore in an f-string: \`f"{clean_first}_{clean_last}"\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: format_user_tag("  alice ", " smith  ")
Output: "Alice_Smith"
Explanation: Strips spaces, capitalizes "Alice" and "Smith", and joins them with "_".
\`\`\``,
    starterCode: `def format_user_tag(first_name: str, last_name: str) -> str:
    # TODO: Clean, capitalize, and combine first and last names with an underscore
    pass
`,
    testSuite: `from solution import format_user_tag

assert format_user_tag("  alice ", " smith  ") == "Alice_Smith", "Failed messy spaces"
assert format_user_tag("BOB", "jones") == "Bob_Jones", "Failed mixed casing"
assert format_user_tag("sarah", "connor") == "Sarah_Connor", "Failed clean input"
print("✓ All assertions passed for User Handle Formatter")
`,
    hints: [
      "Use first_name.strip().capitalize() for both names.",
      "Format as f'{first}_{last}'.",
    ],
  },
  {
    id: "ex-0-3-4",
    lessonId: "node-0-3",
    orderIndex: 4,
    title: "Email Domain Extractor",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "String Partitioning",
    tags: ["Strings", "Splitting", "Parsing"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Enterprise software systems inspect user email addresses to identify the organization or company domain (e.g., verifying if an email belongs to \`"company.org"\`).

### 🧠 What We Are Trying to Solve
Implement \`extract_domain_from_email(email: str) -> str\`:
- If \`"@" not in email\`, return \`""\` (empty string).
- Otherwise, extract and return the domain substring appearing after the \`"@"\` symbol.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: extract_domain_from_email("user@example.com")
Output: "example.com"
Explanation: Extracts the portion after '@'.

Input: extract_domain_from_email("no_at_sign")
Output: ""
Explanation: Returns empty string when '@' is missing.
\`\`\``,
    starterCode: `def extract_domain_from_email(email: str) -> str:
    # TODO: Check for '@' and return domain substring
    pass
`,
    testSuite: `from solution import extract_domain_from_email

assert extract_domain_from_email("user@example.com") == "example.com", "Failed standard email"
assert extract_domain_from_email("admin@company.org") == "company.org", "Failed org domain"
assert extract_domain_from_email("no_at_sign") == "", "Failed missing @"
print("✓ All assertions passed for Email Domain Extractor")
`,
    hints: [
      "Check if '@' in email: ... else: return ''.",
      "You can use email.split('@')[1] to get the domain.",
    ],
  },

  // =========================================================================
  // LESSON 1.4 (node-0-4): Conditionals & Branching
  // =========================================================================
  {
    id: "ex-0-4-1",
    lessonId: "node-0-4",
    orderIndex: 1,
    title: "Movie Theater Ticket Pricing",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "Conditional Pricing Ladder",
    tags: ["Conditionals", "Branching"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
A movie theater box office automatically calculates ticket prices based on customer age categories.

### 🧠 What We Are Trying to Solve
Implement \`get_movie_ticket_price(age: int) -> float\`:
- Children (under 12): $8.00
- Seniors (65 and older): $10.00
- Standard Adults (all other ages): $15.00

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: get_movie_ticket_price(8)
Output: 8.00
Explanation: Age 8 is under 12 (Child).

Input: get_movie_ticket_price(70)
Output: 10.00
Explanation: Age 70 is 65 or older (Senior).

Input: get_movie_ticket_price(25)
Output: 15.00
Explanation: Age 25 falls in the standard Adult bracket.
\`\`\``,
    starterCode: `def get_movie_ticket_price(age: int) -> float:
    # TODO: Return ticket price based on age rules
    pass
`,
    testSuite: `from solution import get_movie_ticket_price

assert get_movie_ticket_price(8) == 8.00, "Failed child price"
assert get_movie_ticket_price(11) == 8.00, "Failed age 11"
assert get_movie_ticket_price(70) == 10.00, "Failed senior price"
assert get_movie_ticket_price(65) == 10.00, "Failed age 65"
assert get_movie_ticket_price(25) == 15.00, "Failed adult price"
print("✓ All assertions passed for Movie Theater Ticket Pricing")
`,
    hints: [
      "Use if age < 12: return 8.00.",
      "Use elif age >= 65: return 10.00.",
      "Use else: return 15.00.",
    ],
  },
  {
    id: "ex-0-4-2",
    lessonId: "node-0-4",
    orderIndex: 2,
    title: "Student Exam Letter Grade Assignor",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "Range Classification",
    tags: ["Conditionals", "Comparison"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
School grading portals convert numeric test scores (0 to 100) into standard letter grades (A, B, C, D, F).

### 🧠 What We Are Trying to Solve
Implement \`evaluate_letter_grade(score: int) -> str\`:
- Score $\\ge 90$: \`"A"\`
- Score $\\ge 80$: \`"B"\`
- Score $\\ge 70$: \`"C"\`
- Score $\\ge 60$: \`"D"\`
- Otherwise: \`"F"\`

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: evaluate_letter_grade(95)
Output: "A"
Explanation: Score is 90 or higher.

Input: evaluate_letter_grade(82)
Output: "B"
Explanation: Score is between 80 and 89.

Input: evaluate_letter_grade(55)
Output: "F"
Explanation: Score is below 60.
\`\`\``,
    starterCode: `def evaluate_letter_grade(score: int) -> str:
    # TODO: Return letter grade based on score threshold
    pass
`,
    testSuite: `from solution import evaluate_letter_grade

assert evaluate_letter_grade(95) == "A", "Failed on 95"
assert evaluate_letter_grade(82) == "B", "Failed on 82"
assert evaluate_letter_grade(74) == "C", "Failed on 74"
assert evaluate_letter_grade(61) == "D", "Failed on 61"
assert evaluate_letter_grade(55) == "F", "Failed on 55"
print("✓ All assertions passed for Student Exam Letter Grade Assignor")
`,
    hints: [
      "Test the highest thresholds first (score >= 90) before moving down to lower scores.",
    ],
  },
  {
    id: "ex-0-4-3",
    lessonId: "node-0-4",
    orderIndex: 3,
    title: "Delivery Speed Selector with Flags",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "Boolean Logic & Flag Inspection",
    tags: ["Booleans", "Conditionals", "Flags"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
E-commerce shipping routers decide whether an order qualifies for Express Air delivery based on customer membership and priority shipping selections.

### 🧠 What We Are Trying to Solve
Implement \`calculate_shipping_speed(is_express: bool, is_member: bool) -> str\`:
- If \`is_express\` is \`True\` **or** \`is_member\` is \`True\`: return \`"Express Delivery"\`.
- Otherwise: return \`"Standard Delivery"\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: calculate_shipping_speed(True, False)
Output: "Express Delivery"
Explanation: Express flag is True.

Input: calculate_shipping_speed(False, False)
Output: "Standard Delivery"
Explanation: Neither express nor membership flag is True.
\`\`\``,
    starterCode: `def calculate_shipping_speed(is_express: bool, is_member: bool) -> str:
    # TODO: Return shipping speed based on flags
    pass
`,
    testSuite: `from solution import calculate_shipping_speed

assert calculate_shipping_speed(True, False) == "Express Delivery", "Failed express"
assert calculate_shipping_speed(False, True) == "Express Delivery", "Failed member"
assert calculate_shipping_speed(True, True) == "Express Delivery", "Failed both true"
assert calculate_shipping_speed(False, False) == "Standard Delivery", "Failed both false"
print("✓ All assertions passed for Delivery Speed Selector")
`,
    hints: [
      "Use the 'or' operator: if is_express or is_member: ...",
    ],
  },
  {
    id: "ex-0-4-4",
    lessonId: "node-0-4",
    orderIndex: 4,
    title: "Password Length Validator",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "Range Boundaries & Logic",
    tags: ["Conditionals", "Security", "Validation"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Security registration portals check whether a newly created password satisfies standard length constraints before allowing the user to create an account.

### 🧠 What We Are Trying to Solve
Implement \`validate_password_length(password: str) -> bool\`:
- Password length must be at least 8 characters.
- Password length must be at most 32 characters.
- Return \`True\` if valid, or \`False\` otherwise.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: validate_password_length("secret123")
Output: True
Explanation: Length is 9 characters (between 8 and 32).

Input: validate_password_length("short")
Output: False
Explanation: Length is only 5 characters (less than 8).
\`\`\``,
    starterCode: `def validate_password_length(password: str) -> bool:
    # TODO: Return True if length is between 8 and 32 inclusive
    pass
`,
    testSuite: `from solution import validate_password_length

assert validate_password_length("secret123") is True, "Failed valid password"
assert validate_password_length("short") is False, "Failed short password"
assert validate_password_length("12345678") is True, "Failed 8 chars boundary"
assert validate_password_length("a" * 32) is True, "Failed 32 chars boundary"
assert validate_password_length("a" * 33) is False, "Failed 33 chars"
print("✓ All assertions passed for Password Length Validator")
`,
    hints: [
      "Use len(password) to check length.",
      "In Python you can cleanly write: return 8 <= len(password) <= 32.",
    ],
  },

  // =========================================================================
  // LESSON 1.5 (node-0-5): While Loops & State-Driven Iteration
  // =========================================================================
  {
    id: "ex-0-5-1",
    lessonId: "node-0-5",
    orderIndex: 1,
    title: "Countdown Sequence Generator",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "Decrementing While Loop",
    tags: ["While Loops", "Iteration"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Launch timers and animation counters count down from a starting number to zero.

### 🧠 What We Are Trying to Solve
Implement \`count_down_to_zero(start_num: int) -> list[int]\`:
- Start with an empty list \`result = []\` and \`current = start_num\`.
- While \`current >= 0\`, append \`current\` to \`result\` and subtract 1 from \`current\`.
- Return \`result\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: count_down_to_zero(3)
Output: [3, 2, 1, 0]
Explanation: Counts down 3 -> 2 -> 1 -> 0.

Input: count_down_to_zero(0)
Output: [0]
Explanation: 0 is already at zero, so list contains [0].
\`\`\``,
    starterCode: `def count_down_to_zero(start_num: int) -> list[int]:
    # TODO: Build countdown list from start_num down to 0 using a while loop
    pass
`,
    testSuite: `from solution import count_down_to_zero

assert count_down_to_zero(3) == [3, 2, 1, 0], "Failed on 3"
assert count_down_to_zero(0) == [0], "Failed on 0"
assert count_down_to_zero(5) == [5, 4, 3, 2, 1, 0], "Failed on 5"
print("✓ All assertions passed for Countdown Sequence Generator")
`,
    hints: [
      "Initialize result = [] and current = start_num.",
      "while current >= 0: append current and subtract 1 from current.",
    ],
  },
  {
    id: "ex-0-5-2",
    lessonId: "node-0-5",
    orderIndex: 2,
    title: "Monthly Savings Duration Calculator",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "Accumulator Loop",
    tags: ["While Loops", "Finance", "Counters"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Financial goal planners calculate how many months of disciplined recurring deposits are needed to reach a desired target savings amount.

### 🧠 What We Are Trying to Solve
Implement \`calculate_months_to_save(target: float, monthly_deposit: float) -> int\`:
- Start with \`balance = 0.0\` and \`months = 0\`.
- While \`balance < target\`, add \`monthly_deposit\` to \`balance\` and increment \`months\` by 1.
- Return the final count of \`months\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: calculate_months_to_save(500.0, 100.0)
Output: 5
Explanation: Month 1: $100, Month 2: $200, Month 3: $300, Month 4: $400, Month 5: $500 (Reached!).

Input: calculate_months_to_save(550.0, 100.0)
Output: 6
Explanation: Reaches $600 at Month 6, which meets the $550 goal.
\`\`\``,
    starterCode: `def calculate_months_to_save(target: float, monthly_deposit: float) -> int:
    # TODO: While balance < target, add deposit and count months
    pass
`,
    testSuite: `from solution import calculate_months_to_save

assert calculate_months_to_save(500.0, 100.0) == 5, "Failed 500 by 100"
assert calculate_months_to_save(550.0, 100.0) == 6, "Failed 550 by 100"
assert calculate_months_to_save(0.0, 50.0) == 0, "Failed 0 target"
print("✓ All assertions passed for Monthly Savings Duration Calculator")
`,
    hints: [
      "Initialize balance = 0.0 and months = 0.",
      "Use while balance < target: balance += monthly_deposit; months += 1.",
    ],
  },
  {
    id: "ex-0-5-3",
    lessonId: "node-0-5",
    orderIndex: 3,
    title: "Halving Step Counter",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "Integer Reduction Steps",
    tags: ["While Loops", "Math", "Reduction"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Binary search algorithms and data compression reduce numbers by repeatedly halving them.

### 🧠 What We Are Trying to Solve
Implement \`count_halvings(num: int) -> int\`:
- Start with \`steps = 0\`.
- While \`num > 1\`, update \`num = num // 2\` and increment \`steps\` by 1.
- Return \`steps\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: count_halvings(16)
Output: 4
Explanation: 16 -> 8 -> 4 -> 2 -> 1 (4 divisions).

Input: count_halvings(1)
Output: 0
Explanation: 1 is already at 1, so 0 steps are required.
\`\`\``,
    starterCode: `def count_halvings(num: int) -> int:
    # TODO: Count how many integer divisions by 2 are needed to reach 1
    pass
`,
    testSuite: `from solution import count_halvings

assert count_halvings(16) == 4, "Failed on 16"
assert count_halvings(1) == 0, "Failed on 1"
assert count_halvings(8) == 3, "Failed on 8"
assert count_halvings(7) == 2, "Failed on 7 (7 -> 3 -> 1)"
print("✓ All assertions passed for Halving Step Counter")
`,
    hints: [
      "Initialize steps = 0.",
      "while num > 1: num = num // 2; steps += 1.",
    ],
  },
  {
    id: "ex-0-5-4",
    lessonId: "node-0-5",
    orderIndex: 4,
    title: "Sum Integers Until Budget Cap",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "Bounded Accumulator",
    tags: ["While Loops", "Accumulator"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Procurement systems add items with sequentially increasing costs ($1, $2, $3, $4, \\dots$) to a cart as long as the total cost stays within an approved budget.

### 🧠 What We Are Trying to Solve
Implement \`sum_until_budget(budget_cap: int) -> int\`:
- Start with \`total = 0\` and \`next_num = 1\`.
- While adding \`next_num\` does not exceed \`budget_cap\` (\`total + next_num <= budget_cap\`):
  - Add \`next_num\` to \`total\`.
  - Increment \`next_num\` by 1.
- Return \`total\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: sum_until_budget(10)
Output: 10
Explanation: 1 + 2 + 3 + 4 = 10 (Adding 5 would make 15 > 10).

Input: sum_until_budget(5)
Output: 3
Explanation: 1 + 2 = 3 (Adding 3 would make 6 > 5).
\`\`\``,
    starterCode: `def sum_until_budget(budget_cap: int) -> int:
    # TODO: While total + next_num <= budget_cap, add next_num and advance
    pass
`,
    testSuite: `from solution import sum_until_budget

assert sum_until_budget(10) == 10, "Failed on budget 10"
assert sum_until_budget(5) == 3, "Failed on budget 5"
assert sum_until_budget(0) == 0, "Failed on budget 0"
assert sum_until_budget(20) == 15, "Failed on budget 20 (1+2+3+4+5=15)"
print("✓ All assertions passed for Sum Integers Until Budget Cap")
`,
    hints: [
      "Check the condition before adding: while total + next_num <= budget_cap.",
    ],
  },

  // =========================================================================
  // LESSON 1.6 (node-0-6): For Loops & Iteration
  // =========================================================================
  {
    id: "ex-0-6-1",
    lessonId: "node-0-6",
    orderIndex: 1,
    title: "Daily Sales Revenue Totalizer",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "List Summation",
    tags: ["For Loops", "Lists", "Accumulator"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Retail managers review a list of daily store sales transactions to calculate total store revenue for the week.

### 🧠 What We Are Trying to Solve
Implement \`sum_daily_sales(sales: list[float]) -> float\`:
1. Initialize a running total \`total = 0.0\`.
2. Iterate through each number in \`sales\` using a \`for\` loop and add it to \`total\`.
3. Return the total rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: sum_daily_sales([10.50, 20.00, 5.25])
Output: 35.75
Explanation: 10.50 + 20.00 + 5.25 = 35.75.

Input: sum_daily_sales([])
Output: 0.0
Explanation: Empty list produces 0.0 revenue.
\`\`\``,
    starterCode: `def sum_daily_sales(sales: list[float]) -> float:
    # TODO: Sum sales with a for loop and return rounded total
    pass
`,
    testSuite: `from solution import sum_daily_sales

assert sum_daily_sales([10.50, 20.00, 5.25]) == 35.75, "Failed 3 sales"
assert sum_daily_sales([]) == 0.0, "Failed empty list"
assert sum_daily_sales([100.0]) == 100.0, "Failed single item"
print("✓ All assertions passed for Daily Sales Revenue Totalizer")
`,
    hints: [
      "Initialize total = 0.0 before the loop.",
      "for s in sales: total += s.",
      "return round(total, 2).",
    ],
  },
  {
    id: "ex-0-6-2",
    lessonId: "node-0-6",
    orderIndex: 2,
    title: "High Performance Score Counter",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "List Filter Count",
    tags: ["For Loops", "Counters"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Educational analytics tools scan a class roster of test scores to report how many students achieved honor-roll status.

### 🧠 What We Are Trying to Solve
Implement \`count_high_scores(scores: list[int], threshold: int) -> int\`:
1. Initialize a counter \`count = 0\`.
2. Iterate through \`scores\` with a \`for\` loop.
3. If a score is $\\ge$ \`threshold\`, increment \`count\` by 1.
4. Return the final count.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: count_high_scores([50, 75, 80, 95, 60], 75)
Output: 3
Explanation: The 3 qualifying scores are 75, 80, and 95.
\`\`\``,
    starterCode: `def count_high_scores(scores: list[int], threshold: int) -> int:
    # TODO: Iterate and count items >= threshold
    pass
`,
    testSuite: `from solution import count_high_scores

assert count_high_scores([50, 75, 80, 95, 60], 75) == 3, "Failed test 1"
assert count_high_scores([10, 20, 30], 50) == 0, "Failed test 2"
assert count_high_scores([], 50) == 0, "Failed empty list"
print("✓ All assertions passed for High Performance Score Counter")
`,
    hints: [
      "Initialize count = 0.",
      "for score in scores: if score >= threshold: count += 1.",
    ],
  },
  {
    id: "ex-0-6-3",
    lessonId: "node-0-6",
    orderIndex: 3,
    title: "Find Maximum Score without max()",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "Linear Scan Maximum",
    tags: ["For Loops", "Search", "Linear Scan"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Understanding how computers find the largest value in a list by scanning each element one by one.

### 🧠 What We Are Trying to Solve
Implement \`find_maximum_score(scores: list[int]) -> int\` without calling Python's built-in \`max()\`:
- If \`scores\` is empty, return \`0\`.
- Initialize \`highest = scores[0]\`.
- Iterate through the scores; whenever you see a score greater than \`highest\`, update \`highest = score\`.
- Return \`highest\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: find_maximum_score([12, 45, 89, 23, 7])
Output: 89
Explanation: Scans the numbers and determines 89 is the highest.
\`\`\``,
    starterCode: `def find_maximum_score(scores: list[int]) -> int:
    # TODO: Find maximum score with a for loop
    pass
`,
    testSuite: `from solution import find_maximum_score

assert find_maximum_score([12, 45, 89, 23, 7]) == 89, "Failed standard list"
assert find_maximum_score([100]) == 100, "Failed single item"
assert find_maximum_score([]) == 0, "Failed empty list"
assert find_maximum_score([-5, -2, -10]) == -2, "Failed negative numbers"
print("✓ All assertions passed for Find Maximum Score")
`,
    hints: [
      "Check if not scores: return 0 first.",
      "Set highest = scores[0], then iterate through scores.",
    ],
  },
  {
    id: "ex-0-6-4",
    lessonId: "node-0-6",
    orderIndex: 4,
    title: "Scale Inventory Prices by Multiplier",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "List Transformation",
    tags: ["For Loops", "Transformation", "Lists"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Store inventory software updates prices across an entire product catalog (e.g. applying a 10% discount multiplier of \`0.9\`).

### 🧠 What We Are Trying to Solve
Implement \`scale_inventory_prices(prices: list[float], multiplier: float) -> list[float]\`:
1. Create an empty list \`scaled = []\`.
2. For each price in \`prices\`, multiply by \`multiplier\`, round to 2 decimals, and append to \`scaled\`.
3. Return the new list \`scaled\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: scale_inventory_prices([10.0, 20.0, 30.0], 0.9)
Output: [9.0, 18.0, 27.0]
Explanation: Multiplies 10*0.9=9, 20*0.9=18, and 30*0.9=27.
\`\`\``,
    starterCode: `def scale_inventory_prices(prices: list[float], multiplier: float) -> list[float]:
    # TODO: Multiply each price and return new scaled list
    pass
`,
    testSuite: `from solution import scale_inventory_prices

assert scale_inventory_prices([10.0, 20.0, 30.0], 0.9) == [9.0, 18.0, 27.0], "Failed 10% discount"
assert scale_inventory_prices([5.0], 2.0) == [10.0], "Failed doubling"
assert scale_inventory_prices([], 1.5) == [], "Failed empty list"
print("✓ All assertions passed for Scale Inventory Prices")
`,
    hints: [
      "Initialize scaled = [].",
      "for p in prices: scaled.append(round(p * multiplier, 2)).",
    ],
  },

  // =========================================================================
  // LESSON 1.7 (node-0-7): Loop Control (break & continue)
  // =========================================================================
  {
    id: "ex-0-7-1",
    lessonId: "node-0-7",
    orderIndex: 1,
    title: "First Negative Number Scanner",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "Early Search with break",
    tags: ["Loop Control", "break", "Search"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Accounting audit tools scan transaction lists to catch the first overdraft or negative balance event and stop scanning immediately.

### 🧠 What We Are Trying to Solve
Implement \`find_first_negative_number(numbers: list[int])\`:
- Iterate through \`numbers\`.
- As soon as you find a number $< 0$, stop scanning and return it immediately.
- If all numbers are non-negative, return \`None\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: find_first_negative_number([5, 12, -3, 8, -9])
Output: -3
Explanation: Stops on the first negative number (-3) without checking the rest of the list.

Input: find_first_negative_number([1, 2, 3])
Output: None
Explanation: No negative numbers found.
\`\`\``,
    starterCode: `def find_first_negative_number(numbers: list[int]):
    # TODO: Find first negative number and return it immediately
    pass
`,
    testSuite: `from solution import find_first_negative_number

assert find_first_negative_number([5, 12, -3, 8, -9]) == -3, "Failed negative found"
assert find_first_negative_number([1, 2, 3]) is None, "Failed all positive"
assert find_first_negative_number([]) is None, "Failed empty list"
print("✓ All assertions passed for First Negative Number Scanner")
`,
    hints: [
      "for num in numbers: if num < 0: return num.",
      "After the loop finishes, return None.",
    ],
  },
  {
    id: "ex-0-7-2",
    lessonId: "node-0-7",
    orderIndex: 2,
    title: "Sum Only Positive Numbers",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "Filtering with continue",
    tags: ["Loop Control", "continue", "Accumulator"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Financial reporting filters out debit deductions (negative numbers) to calculate gross incoming revenue totals.

### 🧠 What We Are Trying to Solve
Implement \`sum_positive_numbers(numbers: list[int]) -> int\`:
- Start with \`total = 0\`.
- For each number in \`numbers\`:
  - If \`num < 0\`, skip to the next iteration using \`continue\`.
  - Otherwise, add \`num\` to \`total\`.
- Return \`total\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: sum_positive_numbers([10, -5, 20, -1, 30])
Output: 60
Explanation: Sums 10 + 20 + 30 = 60, skipping -5 and -1.
\`\`\``,
    starterCode: `def sum_positive_numbers(numbers: list[int]) -> int:
    # TODO: Sum positive numbers using continue to skip negative values
    pass
`,
    testSuite: `from solution import sum_positive_numbers

assert sum_positive_numbers([10, -5, 20, -1, 30]) == 60, "Failed test 1"
assert sum_positive_numbers([-1, -2, -3]) == 0, "Failed all negative"
assert sum_positive_numbers([5, 5, 5]) == 15, "Failed all positive"
print("✓ All assertions passed for Sum Only Positive Numbers")
`,
    hints: [
      "for num in numbers: if num < 0: continue; total += num.",
    ],
  },
  {
    id: "ex-0-7-3",
    lessonId: "node-0-7",
    orderIndex: 3,
    title: "Word Collector Until Stop Sentinel",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "Sentinel Termination",
    tags: ["Loop Control", "break", "Lists"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Message parsers process words sequentially until they encounter a termination sentinel like \`"STOP"\`.

### 🧠 What We Are Trying to Solve
Implement \`collect_words_before_stop(words: list[str]) -> list[str]\`:
- Iterate through \`words\`.
- If \`word == "STOP"\`, immediately halt the loop using \`break\`.
- Otherwise, append \`word\` to your collected list.
- Return the collected list.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: collect_words_before_stop(["ready", "set", "STOP", "go"])
Output: ["ready", "set"]
Explanation: Collects "ready" and "set", then terminates when "STOP" is reached.
\`\`\``,
    starterCode: `def collect_words_before_stop(words: list[str]) -> list[str]:
    # TODO: Collect words until 'STOP' sentinel is seen
    pass
`,
    testSuite: `from solution import collect_words_before_stop

assert collect_words_before_stop(["ready", "set", "STOP", "go"]) == ["ready", "set"], "Failed stop test"
assert collect_words_before_stop(["apple", "banana"]) == ["apple", "banana"], "Failed no stop"
assert collect_words_before_stop(["STOP", "first"]) == [], "Failed stop at start"
print("✓ All assertions passed for Word Collector Until Stop Sentinel")
`,
    hints: [
      "for word in words: if word == 'STOP': break; collected.append(word).",
    ],
  },
  {
    id: "ex-0-7-4",
    lessonId: "node-0-7",
    orderIndex: 4,
    title: "Quality Control Blemish Filter",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "Prefix Filter with continue",
    tags: ["Loop Control", "continue", "Inspection"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Automated conveyor belts at fruit packing facilities scan produce items, skipping any blemished items and sending clean items forward for packaging.

### 🧠 What We Are Trying to Solve
Implement \`filter_blemished_products(items: list[str]) -> list[str]\`:
- Iterate through \`items\`.
- If \`item.startswith("blemished_")\`, skip it using \`continue\`.
- Otherwise, append \`item\` to an approved list.
- Return the approved list.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: filter_blemished_products(["fresh_apple", "blemished_orange", "fresh_grape"])
Output: ["fresh_apple", "fresh_grape"]
Explanation: Skips "blemished_orange" and approves "fresh_apple" and "fresh_grape".
\`\`\``,
    starterCode: `def filter_blemished_products(items: list[str]) -> list[str]:
    # TODO: Filter items using continue on blemished products
    pass
`,
    testSuite: `from solution import filter_blemished_products

assert filter_blemished_products(["fresh_apple", "blemished_orange", "fresh_grape"]) == ["fresh_apple", "fresh_grape"]
assert filter_blemished_products(["blemished_pear"]) == []
assert filter_blemished_products([]) == []
print("✓ All assertions passed for Quality Control Blemish Filter")
`,
    hints: [
      "for item in items: if item.startswith('blemished_'): continue; approved.append(item).",
    ],
  },

  // =========================================================================
  // LESSON 1.8 (node-0-8): Functions & Reusable Calculators
  // =========================================================================
  {
    id: "ex-0-8-1",
    lessonId: "node-0-8",
    orderIndex: 1,
    title: "Customer Welcome Greeter with Default Title",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "Default Arguments & String Return",
    tags: ["Functions", "Default Arguments"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Customer relationship management (CRM) software generates personalized greeting headers with a default title for regular members.

### 🧠 What We Are Trying to Solve
Implement \`greet_customer(name: str, title: str = "Valued Customer") -> str\`:
- Use an f-string to return: \`f"Welcome, {name} ({title})!"\`.
- If the caller does not pass a \`title\`, Python uses the default \`"Valued Customer"\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: greet_customer("Alice")
Output: "Welcome, Alice (Valued Customer)!"
Explanation: Uses default title.

Input: greet_customer("Bob", "VIP Member")
Output: "Welcome, Bob (VIP Member)!"
Explanation: Overrides with custom title "VIP Member".
\`\`\``,
    starterCode: `def greet_customer(name: str, title: str = "Valued Customer") -> str:
    # TODO: Return formatted greeting string
    pass
`,
    testSuite: `from solution import greet_customer

assert greet_customer("Alice") == "Welcome, Alice (Valued Customer)!", "Failed default title"
assert greet_customer("Bob", "VIP Member") == "Welcome, Bob (VIP Member)!", "Failed custom title"
print("✓ All assertions passed for Customer Welcome Greeter")
`,
    hints: [
      "Use an f-string: f'Welcome, {name} ({title})!'",
    ],
  },
  {
    id: "ex-0-8-2",
    lessonId: "node-0-8",
    orderIndex: 2,
    title: "Shipping Box Volume Calculator",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "Multi-parameter Function",
    tags: ["Functions", "Math"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Courier shipping dispatchers compute package cubic volumes to select appropriate delivery vans.

### 🧠 What We Are Trying to Solve
Implement \`calculate_box_volume(width: float, height: float, depth: float = 1.0) -> float\`:
- Multiply \`width * height * depth\`.
- Return the volume rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: calculate_box_volume(2.0, 3.0)
Output: 6.00
Explanation: 2.0 * 3.0 * default depth (1.0) = 6.00.

Input: calculate_box_volume(2.0, 3.0, 4.0)
Output: 24.00
Explanation: 2.0 * 3.0 * 4.0 = 24.00.
\`\`\``,
    starterCode: `def calculate_box_volume(width: float, height: float, depth: float = 1.0) -> float:
    # TODO: Calculate width * height * depth and return rounded to 2 decimals
    pass
`,
    testSuite: `from solution import calculate_box_volume

assert calculate_box_volume(2.0, 3.0) == 6.00, "Failed default depth"
assert calculate_box_volume(2.0, 3.0, 4.0) == 24.00, "Failed custom depth"
assert calculate_box_volume(1.5, 2.5, 3.5) == 13.12, "Failed float math"
print("✓ All assertions passed for Shipping Box Volume Calculator")
`,
    hints: [
      "return round(width * height * depth, 2)",
    ],
  },
  {
    id: "ex-0-8-3",
    lessonId: "node-0-8",
    orderIndex: 3,
    title: "Currency Exchange Rate Converter",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "Conversion Function",
    tags: ["Functions", "Financial"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Travel and international banking apps convert transactions between world currencies using exchange rates.

### 🧠 What We Are Trying to Solve
Implement \`convert_currency(amount: float, exchange_rate: float = 1.25) -> float\`:
- Multiply \`amount * exchange_rate\`.
- Return the converted amount rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: convert_currency(100.0)
Output: 125.00
Explanation: 100.0 * default exchange rate (1.25) = 125.00.

Input: convert_currency(100.0, 1.10)
Output: 110.00
Explanation: 100.0 * 1.10 = 110.00.
\`\`\``,
    starterCode: `def convert_currency(amount: float, exchange_rate: float = 1.25) -> float:
    # TODO: Convert currency amount using exchange rate
    pass
`,
    testSuite: `from solution import convert_currency

assert convert_currency(100.0) == 125.00, "Failed default rate"
assert convert_currency(100.0, 1.10) == 110.00, "Failed custom rate"
assert convert_currency(0.0) == 0.00, "Failed 0 amount"
print("✓ All assertions passed for Currency Exchange Rate Converter")
`,
    hints: [
      "return round(amount * exchange_rate, 2)",
    ],
  },
  {
    id: "ex-0-8-4",
    lessonId: "node-0-8",
    orderIndex: 4,
    title: "Structured Order Subtotal Helper",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "Multi-parameter Order Function",
    tags: ["Functions", "Retail"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Point-of-Sale (POS) cash registers calculate the line-item total for purchases with custom quantities and tax rates.

### 🧠 What We Are Trying to Solve
Implement \`calculate_order_subtotal(unit_price: float, quantity: int = 1, tax_rate: float = 0.05) -> float\`:
- Compute \`(unit_price * quantity) * (1.0 + tax_rate)\`.
- Return the result rounded to 2 decimal places.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: calculate_order_subtotal(20.0)
Output: 21.00
Explanation: (20.0 * 1) * 1.05 = 21.00.

Input: calculate_order_subtotal(10.0, quantity=3)
Output: 31.50
Explanation: (10.0 * 3) * 1.05 = 31.50.
\`\`\``,
    starterCode: `def calculate_order_subtotal(unit_price: float, quantity: int = 1, tax_rate: float = 0.05) -> float:
    # TODO: Calculate subtotal with quantity and tax
    pass
`,
    testSuite: `from solution import calculate_order_subtotal

assert calculate_order_subtotal(20.0) == 21.00, "Failed default quantity & tax"
assert calculate_order_subtotal(10.0, quantity=3) == 31.50, "Failed quantity 3"
assert calculate_order_subtotal(100.0, quantity=1, tax_rate=0.08) == 108.00, "Failed 8% tax"
print("✓ All assertions passed for Structured Order Subtotal Helper")
`,
    hints: [
      "return round((unit_price * quantity) * (1.0 + tax_rate), 2)",
    ],
  },

  // =========================================================================
  // LESSON 1.9 (node-0-9): Variable Scope & Closures
  // =========================================================================
  {
    id: "ex-0-9-1",
    lessonId: "node-0-9",
    orderIndex: 1,
    title: "Step Counter Closure Factory",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "Closure State Counter",
    tags: ["Scope", "Closures", "nonlocal"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Fitness tracking wearables maintain an encapsulated step counter that preserves state in memory.

### 🧠 What We Are Trying to Solve
Implement \`create_step_counter(start: int = 0)\`:
1. Initialize an enclosing variable \`count = start\`.
2. Define an inner function \`step() -> int\` that increments \`count\` by 1 using \`nonlocal count\` and returns \`count\`.
3. Return the \`step\` function itself.

### 📋 What The Expected Result Looks Like
\`\`\`python
counter = create_step_counter(0)
counter()  # Returns 1
counter()  # Returns 2
\`\`\``,
    starterCode: `def create_step_counter(start: int = 0):
    # TODO: Initialize count, define step closure with nonlocal, and return step
    pass
`,
    testSuite: `from solution import create_step_counter

c1 = create_step_counter(0)
assert c1() == 1, "Failed step 1"
assert c1() == 2, "Failed step 2"

c2 = create_step_counter(10)
assert c2() == 11, "Failed isolated step"
assert c1() == 3, "Failed c1 isolation"
print("✓ All assertions passed for Step Counter Closure Factory")
`,
    hints: [
      "Inside step(), write nonlocal count; count += 1; return count.",
      "At the end of create_step_counter, return step (without parentheses).",
    ],
  },
  {
    id: "ex-0-9-2",
    lessonId: "node-0-9",
    orderIndex: 2,
    title: "Dedicated Savings Accumulator Closure",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "Stateful Accumulator",
    tags: ["Scope", "Closures", "Finance"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Banking apps create dedicated customer balance trackers that remember running savings across multiple deposits.

### 🧠 What We Are Trying to Solve
Implement \`create_savings_accumulator(initial_balance: float = 0.0)\`:
1. Initialize \`balance = initial_balance\`.
2. Define an inner function \`deposit(amount: float) -> float\` that adds \`amount\` to \`balance\` using \`nonlocal balance\` and returns \`round(balance, 2)\`.
3. Return \`deposit\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
saver = create_savings_accumulator(50.0)
saver(25.0)  # Returns 75.00
saver(10.0)  # Returns 85.00
\`\`\``,
    starterCode: `def create_savings_accumulator(initial_balance: float = 0.0):
    # TODO: Build deposit closure with nonlocal balance
    pass
`,
    testSuite: `from solution import create_savings_accumulator

s = create_savings_accumulator(50.0)
assert s(25.0) == 75.00, "Failed deposit 1"
assert s(10.0) == 85.00, "Failed deposit 2"
print("✓ All assertions passed for Dedicated Savings Accumulator")
`,
    hints: [
      "Declare nonlocal balance inside deposit.",
    ],
  },
  {
    id: "ex-0-9-3",
    lessonId: "node-0-9",
    orderIndex: 3,
    title: "Multiplier Function Generator",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "Currying / Function Multiplier",
    tags: ["Scope", "Closures", "Higher Order"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Functional utilities generate specialized scaling functions (like doubling or tripling prices).

### 🧠 What We Are Trying to Solve
Implement \`create_multiplier(factor: float)\`:
- Define an inner function \`multiply(x: float) -> float\` that returns \`round(x * factor, 2)\`.
- Return \`multiply\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
double = create_multiplier(2.0)
double(5.0)  # Returns 10.00

triple = create_multiplier(3.0)
triple(4.0)  # Returns 12.00
\`\`\``,
    starterCode: `def create_multiplier(factor: float):
    # TODO: Return multiply function that scales input by factor
    pass
`,
    testSuite: `from solution import create_multiplier

double = create_multiplier(2.0)
assert double(5.0) == 10.00, "Failed doubling"
triple = create_multiplier(3.0)
assert triple(4.0) == 12.00, "Failed tripling"
print("✓ All assertions passed for Multiplier Function Generator")
`,
    hints: [
      "Inner function multiply(x): return round(x * factor, 2).",
    ],
  },
  {
    id: "ex-0-9-4",
    lessonId: "node-0-9",
    orderIndex: 4,
    title: "Sequential Order ID Generator",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "Sequential ID Generator",
    tags: ["Scope", "Closures", "IDs"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
E-commerce order dispatchers generate unique, sequential ticket numbers with custom store prefixes.

### 🧠 What We Are Trying to Solve
Implement \`create_id_generator(prefix: str = "ORD-", start_num: int = 1000)\`:
1. Track \`current_id = start_num\`.
2. Define an inner function \`next_id() -> str\` that:
   - Assembles the formatted string: \`f"{prefix}{current_id}"\`.
   - Increments \`current_id\` by 1 using \`nonlocal current_id\`.
   - Returns the formatted string.
3. Return \`next_id\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
gen = create_id_generator("ORD-", 1000)
gen()  # Returns "ORD-1000"
gen()  # Returns "ORD-1001"
\`\`\``,
    starterCode: `def create_id_generator(prefix: str = "ORD-", start_num: int = 1000):
    # TODO: Build next_id closure returning sequential prefixed IDs
    pass
`,
    testSuite: `from solution import create_id_generator

gen = create_id_generator("ORD-", 1000)
assert gen() == "ORD-1000", "Failed first ID"
assert gen() == "ORD-1001", "Failed second ID"
assert gen() == "ORD-1002", "Failed third ID"
print("✓ All assertions passed for Sequential Order ID Generator")
`,
    hints: [
      "Store formatted = f'{prefix}{current_id}', increment current_id += 1 with nonlocal, and return formatted.",
    ],
  },

  // =========================================================================
  // LESSON 1.10 (node-0-10): Assertions & Defensive Programming
  // =========================================================================
  {
    id: "ex-0-10-1",
    lessonId: "node-0-10",
    orderIndex: 1,
    title: "Assert Strictly Positive Price",
    difficulty: "Easy",
    tier: "Concept Warmup",
    leetcodeEquivalent: "Precondition Assertion",
    tags: ["Assertions", "Defensive"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
E-commerce catalog managers validate product entries defensively to prevent negative or zero prices from being saved to the database.

### 🧠 What We Are Trying to Solve
Implement \`validate_positive_price(price: float) -> float\`:
- Use \`assert price > 0.0, "Price must be strictly positive"\`.
- Return \`round(price, 2)\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: validate_positive_price(19.99)
Output: 19.99
Explanation: Price is positive, assertion passes.

Input: validate_positive_price(-5.0)
Output: Raises AssertionError
Explanation: Price is negative, assertion halts execution.
\`\`\``,
    starterCode: `def validate_positive_price(price: float) -> float:
    # TODO: Assert price > 0.0 and return rounded price
    pass
`,
    testSuite: `from solution import validate_positive_price

assert validate_positive_price(19.99) == 19.99, "Failed valid price"

try:
    validate_positive_price(-5.0)
    assert False, "Should raise AssertionError on negative price"
except AssertionError:
    pass

try:
    validate_positive_price(0.0)
    assert False, "Should raise AssertionError on zero price"
except AssertionError:
    pass

print("✓ All assertions passed for Assert Strictly Positive Price")
`,
    hints: [
      "Write assert price > 0.0, 'Price must be strictly positive'.",
    ],
  },
  {
    id: "ex-0-10-2",
    lessonId: "node-0-10",
    orderIndex: 2,
    title: "Assert Percentage Score Bounds (0-100)",
    difficulty: "Easy",
    tier: "Logical Application",
    leetcodeEquivalent: "Range Bound Assertion",
    tags: ["Assertions", "Validation"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Online exam systems validate that scores entered by teachers fall strictly within the valid range of 0 to 100 percent.

### 🧠 What We Are Trying to Solve
Implement \`validate_score_range(score: int) -> int\`:
- Assert that \`0 <= score <= 100\`.
- Return \`score\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: validate_score_range(85)
Output: 85
Explanation: 85 is within the 0 to 100 range.

Input: validate_score_range(105)
Output: Raises AssertionError
Explanation: 105 exceeds 100, assertion halts execution.
\`\`\``,
    starterCode: `def validate_score_range(score: int) -> int:
    # TODO: Assert 0 <= score <= 100 and return score
    pass
`,
    testSuite: `from solution import validate_score_range

assert validate_score_range(85) == 85, "Failed valid score"
assert validate_score_range(0) == 0, "Failed score 0"
assert validate_score_range(100) == 100, "Failed score 100"

try:
    validate_score_range(-1)
    assert False, "Should raise AssertionError on -1"
except AssertionError:
    pass

try:
    validate_score_range(101)
    assert False, "Should raise AssertionError on 101"
except AssertionError:
    pass

print("✓ All assertions passed for Assert Percentage Score Bounds")
`,
    hints: [
      "Use chained comparison: assert 0 <= score <= 100, 'Score must be between 0 and 100'.",
    ],
  },
  {
    id: "ex-0-10-3",
    lessonId: "node-0-10",
    orderIndex: 3,
    title: "Assert Non-Empty Username",
    difficulty: "Easy",
    tier: "Edge Case Check",
    leetcodeEquivalent: "String Precondition Assertion",
    tags: ["Assertions", "Strings"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
User profile services verify that usernames are not blank or too short before saving them.

### 🧠 What We Are Trying to Solve
Implement \`validate_username_format(username: str) -> str\`:
1. Clean whitespace with \`cleaned = username.strip()\`.
2. Assert that \`len(cleaned) >= 3, "Username must have at least 3 characters"\`.
3. Return \`cleaned\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: validate_username_format("  alice  ")
Output: "alice"
Explanation: Strips whitespace and verifies length >= 3.

Input: validate_username_format("ab")
Output: Raises AssertionError
Explanation: Only 2 characters long, assertion halts execution.
\`\`\``,
    starterCode: `def validate_username_format(username: str) -> str:
    # TODO: Strip whitespace, assert length >= 3, and return cleaned username
    pass
`,
    testSuite: `from solution import validate_username_format

assert validate_username_format("  alice  ") == "alice", "Failed valid username"

try:
    validate_username_format("ab")
    assert False, "Should raise AssertionError for length < 3"
except AssertionError:
    pass

try:
    validate_username_format("   ")
    assert False, "Should raise AssertionError for empty string"
except AssertionError:
    pass

print("✓ All assertions passed for Assert Non-Empty Username")
`,
    hints: [
      "First cleaned = username.strip(), then assert len(cleaned) >= 3.",
    ],
  },
  {
    id: "ex-0-10-4",
    lessonId: "node-0-10",
    orderIndex: 4,
    title: "Safe Division with Non-Zero Divisor Assertion",
    difficulty: "Easy",
    tier: "Practical Scenario",
    leetcodeEquivalent: "Zero-Division Guard Assertion",
    tags: ["Assertions", "Math", "Safety"],
    descriptionMarkdown: `### 🎯 What This Exercise Is About
Mathematical calculation engines protect themselves against crashing by defensively asserting that divisors are non-zero before dividing.

### 🧠 What We Are Trying to Solve
Implement \`safe_divide(numerator: float, denominator: float) -> float\`:
- Assert that \`denominator != 0.0, "Denominator cannot be zero"\`.
- Return \`round(numerator / denominator, 2)\`.

### 📋 What The Expected Result Looks Like
\`\`\`python
Input: safe_divide(10.0, 2.0)
Output: 5.00
Explanation: 10.0 / 2.0 = 5.00.

Input: safe_divide(10.0, 0.0)
Output: Raises AssertionError
Explanation: Denominator is zero, assertion stops division before ZeroDivisionError can happen.
\`\`\``,
    starterCode: `def safe_divide(numerator: float, denominator: float) -> float:
    # TODO: Assert denominator != 0.0 and return rounded quotient
    pass
`,
    testSuite: `from solution import safe_divide

assert safe_divide(10.0, 2.0) == 5.00, "Failed standard division"
assert safe_divide(7.0, 2.0) == 3.50, "Failed fractional division"

try:
    safe_divide(10.0, 0.0)
    assert False, "Should raise AssertionError for zero denominator"
except AssertionError:
    pass

print("✓ All assertions passed for Safe Division Guard")
`,
    hints: [
      "assert denominator != 0.0, 'Denominator cannot be zero'",
    ],
  },
];

/**
 * Generates progressive reinforcement ladder for any curriculum node:
 * 1. Tier 1: Concept Warmup (Easy)
 * 2. Tier 2: Logical Application (Easy)
 * 3. Tier 3: Edge Case Check (Medium)
 * 4. Tier 4: Practical Scenario (Medium)
 */
export function createExercisesFromNode(node: {
  id: string;
  title: string;
  phase_id?: string;
  starter_code?: any;
  test_suite?: any;
  handbook_markdown?: string;
  defense_prompts?: string[];
}): ExerciseItem[] {
  let sc = "";
  if (typeof node.starter_code === "object" && node.starter_code !== null) {
    sc = node.starter_code["solution.py"] || JSON.stringify(node.starter_code, null, 2);
  } else if (typeof node.starter_code === "string") {
    sc = node.starter_code;
  }

  let ts = "";
  let criteria = "";
  let failureMode = "";
  if (typeof node.test_suite === "object" && node.test_suite !== null) {
    ts = node.test_suite["tests.py"] || "";
    criteria = node.test_suite["verification_criteria"] || "";
    failureMode = node.test_suite["failure_mode"] || "";
  } else if (typeof node.test_suite === "string") {
    ts = node.test_suite;
  }

  const promptHints = Array.isArray(node.defense_prompts) && node.defense_prompts.length > 0
    ? node.defense_prompts
    : [
        "Read the lesson instructions and variables carefully.",
        "Take your time to understand the logical steps.",
        "Verify your calculation matches the expected scenario.",
      ];

  const cleanTitle = node.title.replace(/^Lesson\s+[\d.]+:\s*/i, "");
  const baseKey = node.id.replace("node-", "");

  const tierConfigs: Array<{
    orderIndex: number;
    suffix: string;
    tier: ExerciseTier;
    difficulty: ExerciseDifficulty;
    subTitle: string;
    focus: string;
  }> = [
    {
      orderIndex: 1,
      suffix: "1",
      tier: "Concept Warmup",
      difficulty: "Easy",
      subTitle: "Concept Warmup",
      focus: "Direct and approachable introduction to reinforce basic syntax and rules.",
    },
    {
      orderIndex: 2,
      suffix: "2",
      tier: "Logical Application",
      difficulty: "Easy",
      subTitle: "Logical Application",
      focus: "Apply the core concept to a clean real-world scenario.",
    },
    {
      orderIndex: 3,
      suffix: "3",
      tier: "Edge Case Check",
      difficulty: "Medium",
      subTitle: "Edge Case Check",
      focus: "Handle zero, empty inputs, or boundary values cleanly.",
    },
    {
      orderIndex: 4,
      suffix: "4",
      tier: "Practical Scenario",
      difficulty: "Medium",
      subTitle: "Practical Scenario",
      focus: failureMode
        ? `Ensure code handles edge cases: ${failureMode}.`
        : "Practical problem solving combining steps in a realistic context.",
    },
  ];

  return tierConfigs.map((cfg) => {
    const descMd = `### 🎯 What This Exercise Is About
Practice and reinforce the concepts learned in **${node.title}**. This exercise guides you through real-world problem solving.

### 🧠 What We Are Trying to Solve
${cfg.focus}
${criteria ? `\\n**Goal:** ${criteria}` : ""}

### 📋 What The Expected Result Looks Like
Write code in \`solution.py\` that passes all validation checks in the interactive test suite.`;

    return {
      id: `ex-${baseKey}-${cfg.orderIndex}`,
      lessonId: node.id,
      orderIndex: cfg.orderIndex,
      title: `${cleanTitle}: ${cfg.subTitle}`,
      difficulty: cfg.difficulty,
      tier: cfg.tier,
      tags: ["Practice", cfg.tier, node.phase_id || "Foundations"],
      descriptionMarkdown: descMd,
      starterCode:
        sc ||
        `# Practice ${cfg.orderIndex} (${cfg.tier}): ${cfg.subTitle}\\n# TODO: Complete the exercise logic\\n`,
      testSuite:
        ts ||
        `import solution\\nprint("✓ Practice ${cfg.orderIndex} passed for ${cleanTitle}")\\n`,
      hints: [
        promptHints[(cfg.orderIndex - 1) % promptHints.length],
        `Keep your solution clear, step-by-step, and focused on ${cfg.tier.toLowerCase()}.`,
      ],
    };
  });
}

/**
 * Backward compatibility alias for single-item requests.
 */
export function createExerciseFromNode(node: {
  id: string;
  title: string;
  phase_id?: string;
  starter_code?: any;
  test_suite?: any;
  handbook_markdown?: string;
  defense_prompts?: string[];
}): ExerciseItem {
  return createExercisesFromNode(node)[0];
}

/**
 * Helper to get all exercises for a specific lesson ID.
 */
export function getExercisesForLesson(lessonId: string): ExerciseItem[] {
  const custom = COMPREHENSIVE_EXERCISES_CATALOG.filter((ex) => ex.lessonId === lessonId);
  if (custom.length > 0) return custom;
  return [];
}

/**
 * Helper to check if a specific exercise is unlocked:
 * Rule:
 * 1. The first exercise of node-0-1 is always unlocked for beginner onboarding.
 * 2. If parent lesson is completed, its associated exercises are unlocked.
 * 3. Progressive ladder within lesson: Level 1 warmup is accessible immediately once lesson is done.
 */
export function isExerciseUnlocked(
  exercise: ExerciseItem,
  completedLessonIds: ReadonlySet<string>,
  completedExerciseIds: ReadonlySet<string>
): boolean {
  // First exercise of node-0-1 is always unlocked for beginner onboarding
  if (exercise.id === "ex-0-1-1") return true;

  // Parent lesson must be completed
  if (!completedLessonIds.has(exercise.lessonId)) {
    return false;
  }

  // Level 1 (Warmup) is unlocked immediately once parent lesson is completed
  if (exercise.orderIndex === 1) {
    return true;
  }

  // Progressive ladder: if orderIndex > 1, previous exercise in the lesson must be completed
  if (exercise.orderIndex > 1) {
    const prevExerciseId = `ex-${exercise.lessonId.replace("node-", "")}-${exercise.orderIndex - 1}`;
    if (!completedExerciseIds.has(prevExerciseId)) {
      return false;
    }
  }

  return true;
}
"""

with open("/home/sawacha/lms/lib/exercises-catalog.ts", "w") as f:
    f.write(CATALOG_TS)

print("✓ Successfully regenerated lib/exercises-catalog.ts with 3-part structured descriptions!")
