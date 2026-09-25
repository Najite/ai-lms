/**
 * Authoring library for Module 1 Lesson Handbooks (Lessons 1.1 to 1.50)
 * Style: Medium-post format — educational, beginner-friendly, calm tone, zero hallucination, zero false urgency.
 * Bridges beginner programming concepts directly into AI Engineering concepts.
 */

interface LessonHandbookData {
  hook: string;
  mentalModel: string;
  deepDive: string;
  stepByStep: string[];
  commonGotchas: string[];
  relevanceToAI: string;
}

export const MODULE_1_HANDBOOKS: Record<string, LessonHandbookData> = {
  "node-0-1": {
    hook: "When we write software, the very first thing our computer needs to understand is what kind of data it is dealing with. Whether it's the name of an AI model, the number of tokens processed in a request, or the cost per API call, every piece of information has a distinct type.",
    mentalModel: "Think of Python data types like labeled storage containers in a warehouse. You wouldn't pour liquid into an open cardboard box or store heavy steel rods in a paper envelope. Similarly, Python expects whole numbers (integers) in one container, decimal numbers (floats) in another, and written text (strings) in another.",
    deepDive: `In Python, data types are dynamic, meaning Python figures out the type of a variable automatically at runtime. However, when data arrives from external sources—such as user inputs, web APIs, or JSON files—everything often arrives as plain text (\`str\`).

Here are the fundamental primitive types you will interact with constantly:
- **\`str\` (String)**: Represents textual data, enclosed in quotes like \`"claude-3-5-sonnet"\`.
- **\`int\` (Integer)**: Represents whole numbers without decimals, such as \`8192\` or \`-10\`.
- **\`float\` (Floating-Point Number)**: Represents numbers with fractional parts or decimals, such as \`0.003\` or \`19.99\`.
- **\`bool\` (Boolean)**: Represents binary truth values: either \`True\` or \`False\`.

### Type Casting & Conversion
When an API or user gives you numbers disguised as text (for example, the string \`"8192"\`), you must explicitly cast them using Python's built-in converter functions:
- \`int("8192")\` converts text to an integer.
- \`float("0.003")\` converts text to a floating-point number.
- \`str(100)\` converts a number back into text.`,
    stepByStep: [
      "Accept incoming arguments: a string for name, a token count value, and a cost value.",
      "Convert the token count into a proper integer using `int(tokens)` so mathematical operations work.",
      "Convert the cost value into a floating-point number using `float(cost)` so currency calculations are accurate.",
      "Bundle these cleaned values into a clean Python dictionary with keys `'name'`, `'tokens'`, and `'cost'`."
    ],
    commonGotchas: [
      "Performing arithmetic on strings: `\"100\" + \"50\"` results in `\"10050\"`, not `150`. Always convert numeric strings to `int` or `float` first.",
      "Passing invalid text to numeric converters: calling `int(\"abc\")` will raise a `ValueError`."
    ],
    relevanceToAI: "Modern LLM APIs return JSON responses containing token counts, latency timestamps, and cost metrics. Properly casting and validating these types is the first step in building reliable AI pipelines."
  },

  "node-0-2": {
    hook: "Every time you interact with an AI model, tokens are counted, multiplied by a unit price, adjusted for discounts, and totaled up. Understanding arithmetic operators and mathematical precedence in Python ensures you never miscalculate usage costs.",
    mentalModel: "Think of operators like the buttons on an engineer's calculator. When computing a bill, Python follows PEMDAS rules (Parentheses, Exponents, Multiplication & Division, Addition & Subtraction) from left to right. Using parentheses is like putting an explicit fence around the calculations you want done first.",
    deepDive: `Python provides a comprehensive suite of mathematical and logical operators:

### Arithmetic Operators
- \`+\` and \`-\`: Addition and subtraction.
- \`*\` and \`/\`: Multiplication and standard float division (\`7 / 2\` gives \`3.5\`).
- \`//\`: Floor (integer) division, discarding remainders (\`7 // 2\` gives \`3\`).
- \`%\`: Modulo operator, returning the remainder of division (\`7 % 2\` gives \`1\`).
- \`**\`: Exponentiation (\`2 ** 3\` gives \`8\`).

### Precedence Hierarchy
In complex financial equations, multiplication and division always execute before addition and subtraction unless parentheses force a specific order:
\`\`\`python
# Without parentheses: 1000 + (2000 / 1000) * 0.015 -> 1000.03
total = 1000 + 2000 / 1000 * 0.015

# With explicit parentheses: ((1000 + 2000) / 1000) * 0.015 -> 0.045
total = ((1000 + 2000) / 1000) * 0.015
\`\`\`

Rounding with \`round(number, decimals)\` cleans up minor floating-point precision artifacts in currency displays.`,
    stepByStep: [
      "Combine input and output token counts into a single total.",
      "Divide the total tokens by 1,000 to find the number of thousand-token units.",
      "Multiply by the specified `rate_per_k` pricing tier.",
      "Apply the discount factor `(1.0 - discount_tier)` and round to 4 decimal places."
    ],
    commonGotchas: [
      "Confusing assignment (`=`) with equality check (`==`).",
      "Relying on implicit operator precedence instead of grouping with clear parentheses in billing formulas."
    ],
    relevanceToAI: "LLM providers charge differently for prompt tokens versus completion tokens, usually priced per 1,000 or 1,000,000 tokens. Accurate token accounting prevents costly billing overruns."
  },

  "node-0-3": {
    hook: "Large Language Models have finite context windows. When handling lengthy user queries or documentation passages, software engineers must safely measure, inspect, slice, and trim text without crashing their systems.",
    mentalModel: "Think of a Python string as a numbered strip of film. Each character sits in its own labeled frame, starting at index 0 on the left. You can cut a continuous strip out of the film by specifying where to start and where to stop.",
    deepDive: `Strings in Python are sequences of characters that support zero-based indexing and slice notation.

### Slicing Syntax: \`string[start:stop:step]\`
- \`start\`: The zero-based index where your slice begins (inclusive).
- \`stop\`: The index where your slice ends (**exclusive**—Python stops right before this character).
- \`step\`: How many characters to advance on each hop (defaults to 1).

\`\`\`python
text = "Artificial Intelligence"
print(text[0:10])  # Output: "Artificial"
print(text[:4])    # Output: "Arti" (defaults start to 0)
print(text[-12:])  # Output: "Intelligence" (negative indices count from end)
\`\`\`

### Immutability
Strings in Python are *immutable*. You cannot modify characters in-place (\`text[0] = 'a'\` will raise a \`TypeError\`). Slicing always produces a brand-new string in memory.`,
    stepByStep: [
      "Check the length of the string using `len(raw_text)` against `max_len`.",
      "If the text fits within `max_len`, return it unchanged.",
      "If the text exceeds `max_len`, slice the first `max_len` characters (`raw_text[:max_len]`) and append `'...'` to indicate truncation."
    ],
    commonGotchas: [
      "Off-by-one errors: `text[:5]` returns 5 characters (indices 0, 1, 2, 3, 4), not 6.",
      "Trying to mutate string characters directly instead of creating a sliced copy."
    ],
    relevanceToAI: "Prompt truncation, snippet previews, and chat message summaries all rely on precise string slicing to prevent exceeding LLM context windows."
  },

  "node-0-4": {
    hook: "Software makes decisions by evaluating conditions. In AI engineering, routing requests to the appropriate model based on query complexity or user tiers is a primary architectural responsibility.",
    mentalModel: "Think of conditional statements like a railway switch track. As a train (your data) approaches, the switch checks a signal (your condition). If green, the train takes track A; otherwise, it diverts to track B.",
    deepDive: `Python uses \`if\`, \`elif\` (else if), and \`else\` statements to control the flow of execution.

### Guard Clauses vs Nested Pyramids
A clean, readable codebase avoids deeply nested \`if\` blocks (often called the 'Pyramid of Doom'). Instead, experienced engineers use **guard clauses** to exit early when validation fails or edge cases occur:

\`\`\`python
# Guard clause approach: clean, flat, and legible
def classify_request(tokens: int, is_admin: bool) -> str:
    if tokens <= 0:
        return "error"
    if is_admin:
        return "priority_tier"
    if tokens > 4000:
        return "heavy_compute"
    return "standard"
\`\`\`

### Truthy and Falsy Values
In Python, values other than Booleans can evaluate to \`True\` or \`False\`:
- **Falsy**: \`0\`, \`0.0\`, \`\"\"\` (empty string), \`[]\` (empty list), \`{}\` (empty dict), and \`None\`.
- **Truthy**: Non-zero numbers, non-empty strings, and non-empty collections.`,
    stepByStep: [
      "Check if `token_count <= 0` first as an invalid input guard clause, returning `'error'`.",
      "Check if the `is_vip` flag is `True`, routing immediately to the high-performance tier (`'opus'`).",
      "Check if `token_count > 4000`, routing large context workloads to `'sonnet'`.",
      "Default all remaining standard requests to `'haiku'`."
    ],
    commonGotchas: [
      "Order of conditions: Placing general conditions before specific ones can cause specific branches to never execute.",
      "Using `=` instead of `==` in comparisons."
    ],
    relevanceToAI: "Intelligent model gateways dynamically route simple queries to fast, cheap models (like Haiku or Flash) and complex reasoning queries to frontier models (like Opus or Pro)."
  },

  "node-0-5": {
    hook: "External networks and AI providers occasionally experience hiccups or rate limits. When that happens, a software program must repeat its request patiently until it succeeds or reaches a safety limit.",
    mentalModel: "Think of a while loop like knocking on a colleague's office door. You knock, wait a moment, check if they answered, and if not, knock again—repeating the process until they open the door or you hit your limit of 5 tries and walk away.",
    deepDive: `A \`while\` loop repeatedly executes a block of code as long as a specified Boolean condition remains \`True\`.

### Structure of a Controlled While Loop
Every while loop requires three components to avoid running infinitely:
1. **Initial state setup**: Defining counters or status variables before the loop.
2. **Evaluation condition**: Checking whether to continue running.
3. **State advancement**: Modifying the state variable inside the loop body on every iteration.

\`\`\`python
attempts = 0
max_retries = 3
success = False

while attempts < max_retries and not success:
    attempts += 1
    # Attempt network call...
\`\`\`

### Avoiding Infinite Loops
If the condition never becomes \`False\` (for example, if you forget to increment \`attempts += 1\`), the program will lock the CPU in an infinite loop. Always guarantee an exit path.`,
    stepByStep: [
      "Initialize an `attempts = 0` counter.",
      "Construct a `while` loop that runs while `attempts < max_tries`.",
      "Inside the loop, increment `attempts += 1`.",
      "Check if `attempts == target_success_attempt`; if so, break or return the attempt count.",
      "After the loop finishes, return the final recorded attempts count."
    ],
    commonGotchas: [
      "Forgetting to increment the loop counter inside the loop body, causing an infinite loop.",
      "Off-by-one errors when comparing `<` versus `<=` against the maximum retry threshold."
    ],
    relevanceToAI: "Production AI clients implement retry loops with exponential backoff to handle transient HTTP 429 (Rate Limit) and 503 (Service Unavailable) status codes seamlessly."
  }
};

export function buildMediumStyleHandbook(
  nodeId: string,
  title: string,
  spec: string,
  starterCode: string,
  testSuite: string,
  custom?: LessonHandbookData
): string {
  const cleanTitle = title.replace(/^Lesson\s+\d+\.\d+:\s*/, "");
  
  const hook = custom?.hook || `In modern software engineering, mastering **${cleanTitle}** is a foundational step toward building reliable, automated systems and AI applications. Let's explore how this concept works from first principles.`;
  
  const mentalModel = custom?.mentalModel || `Think of **${cleanTitle}** as a specialized tool in your engineering workshop. Rather than writing repetitive or brittle code, this pattern gives you a clean, standardized way to process inputs and guarantee expected outputs.`;
  
  const deepDive = custom?.deepDive || `When working with Python, understanding how data flows and how functions operate allows you to design systems that are both predictable and easy to debug.

### Core Concepts & Mechanics
Every program is built upon clear contracts:
1. **Inputs**: What data enters the routine and what types are expected.
2. **Transformation**: The operations, algorithms, or logic applied to that data.
3. **Outputs & Verification**: The return value or side effect produced, verified by automated tests.

By keeping your logic modular and clean, you make your code testable and resilient to unexpected inputs.`;

  const stepsList = custom?.stepByStep && custom.stepByStep.length > 0
    ? custom.stepByStep.map((s, i) => `${i + 1}. **${s.split(':')[0]}**: ${s.split(':').slice(1).join(':') || s}`).join('\n')
    : `1. **Review the inputs**: Identify the required arguments, types, and constraints.\n2. **Implement the logic**: Apply the transformation described in the lesson.\n3. **Verify the output**: Check your result against the test assertions.`;

  const gotchasList = custom?.commonGotchas && custom.commonGotchas.length > 0
    ? custom.commonGotchas.map(g => `- ${g}`).join('\n')
    : `- Not accounting for edge cases like empty inputs or boundary values.\n- Assuming types without verifying or casting when necessary.`;

  const aiRelevance = custom?.relevanceToAI || `In AI systems development, clean data pipelines and robust function design ensure your prompts, model outputs, and API integrations remain deterministic and stable in production.`;

  return `# ${title}

${hook}

---

## 💡 The Mental Model

${mentalModel}

---

## 🔍 Deep Dive: Understanding the Concept

${deepDive}

---

## 🛠️ Step-by-Step Implementation Guide

When working through the companion exercise for this lesson, follow these structured steps:

${stepsList}

### Starter Template
\`\`\`python
${starterCode.trim()}
\`\`\`

---

## ⚠️ Common Pitfalls to Avoid

${gotchasList}

---

## 🧪 Verification & Automated Checks

In production engineering, we don't guess whether our code works—we verify it with automated tests. The test suite below runs in your browser's isolated Python environment:

\`\`\`python
${testSuite.trim()}
\`\`\`

### What This Test Verifies
The test suite checks your implementation against concrete assertions, ensuring your return values and data structures match the exact contract required by the system.

---

## 🤖 Real-World Relevance for AI Engineers

${aiRelevance}

---

## 🎯 Quick Self-Check
Before moving to the next lesson, take a quiet moment to reflect on these questions:
- What are the exact input parameters and types entering your function?
- What transformation takes place inside the function body?
- Which specific assertion in the test suite verifies that your logic succeeded?
`;
}
