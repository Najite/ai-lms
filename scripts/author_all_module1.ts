import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envContent = fs.existsSync('.env.local')
  ? fs.readFileSync('.env.local', 'utf8')
  : fs.existsSync('.env')
  ? fs.readFileSync('.env', 'utf8')
  : '';

const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1]?.trim() ||
  '';
const serviceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.*)/)?.[1]?.trim() ||
  '';

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, serviceRoleKey);

interface LessonSpec {
  id: string;
  title: string;
  hook: string;
  mentalModel: string;
  deepDive: string;
  stepByStep: string[];
  gotchas: string[];
  aiRelevance: string;
}

const MODULE_1_SPECS: Record<string, Omit<LessonSpec, 'id' | 'title'>> = {
  "node-0-1": {
    hook: "When we write software, the very first thing our computer needs to understand is what kind of data it is dealing with. Whether it's the name of an AI model, the number of tokens processed in a request, or the cost per API call, every piece of information has a distinct type.",
    mentalModel: "Think of Python data types like labeled storage containers in a workshop. You wouldn't pour liquid into an open cardboard box or store heavy steel rods in a paper envelope. Similarly, Python expects whole numbers (integers) in one container, decimal numbers (floats) in another, and written text (strings) in another.",
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
      "Accept incoming arguments: a string for model name, a token count, and a cost rate.",
      "Convert the token count into a proper integer using `int(tokens)` so arithmetic operations work.",
      "Convert the cost value into a floating-point number using `float(cost)` so currency calculations are accurate.",
      "Bundle these cleaned values into a clean Python dictionary with keys `'name'`, `'tokens'`, and `'cost'`."
    ],
    gotchas: [
      "Performing arithmetic on strings: `\"100\" + \"50\"` results in `\"10050\"`, not `150`. Always convert numeric strings to `int` or `float` first.",
      "Passing invalid text to numeric converters: calling `int(\"abc\")` will raise a `ValueError`."
    ],
    aiRelevance: "Modern LLM APIs return JSON payloads containing token counts, latency timestamps, and cost metrics. Properly casting and validating these types is the first step in building reliable AI pipelines."
  },

  "node-0-2": {
    hook: "Every time you interact with an AI model, tokens are counted, multiplied by a unit price, adjusted for discounts, and totaled up. Understanding arithmetic operators and mathematical precedence in Python ensures you never miscalculate usage costs.",
    mentalModel: "Think of operators like the buttons on an engineer's calculator. When computing a bill, Python follows standard mathematical precedence (Parentheses, Exponents, Multiplication & Division, Addition & Subtraction) from left to right. Using parentheses is like putting an explicit fence around the calculations you want done first.",
    deepDive: `Python provides a comprehensive suite of mathematical and logical operators:

### Arithmetic Operators
- \`+\` and \`-\`: Addition and subtraction.
- \`*\` and \`/\`: Multiplication and standard float division (\`7 / 2\` gives \`3.5\`).
- \`//\`: Floor (integer) division, discarding remainders (\`7 // 2\` gives \`3\`).
- \`%\`: Modulo operator, returning the remainder of division (\`7 % 2\` gives \`1\`).
- \`**\`: Exponentiation (\`2 ** 3\` gives \`8\`).

### Precedence Hierarchy
In financial and scientific equations, multiplication and division always execute before addition and subtraction unless parentheses force a specific order:
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
      "Apply the discount factor `(1.0 - discount_tier)` and round the final result to 4 decimal places."
    ],
    gotchas: [
      "Confusing assignment (`=`) with equality check (`==`).",
      "Relying on implicit operator precedence instead of grouping with clear parentheses in billing formulas."
    ],
    aiRelevance: "LLM providers charge differently for prompt tokens versus completion tokens, usually priced per 1,000 or 1,000,000 tokens. Accurate token accounting prevents costly billing overruns."
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
    gotchas: [
      "Off-by-one errors: `text[:5]` returns 5 characters (indices 0, 1, 2, 3, 4), not 6.",
      "Trying to mutate string characters directly instead of creating a sliced copy."
    ],
    aiRelevance: "Prompt truncation, snippet previews, and chat message summaries all rely on precise string slicing to prevent exceeding LLM context windows."
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
    gotchas: [
      "Order of conditions: Placing general conditions before specific ones can cause specific branches to never execute.",
      "Using `=` instead of `==` in comparisons."
    ],
    aiRelevance: "Intelligent model gateways dynamically route simple queries to fast, cheap models (like Haiku or Flash) and complex reasoning queries to frontier models (like Opus or Pro)."
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
      "Check if `attempts == target_success_attempt`; if so, return the attempt count immediately.",
      "After the loop finishes, return the final recorded attempts count."
    ],
    gotchas: [
      "Forgetting to increment the loop counter inside the loop body, causing an infinite loop.",
      "Off-by-one errors when comparing `<` versus `<=` against the maximum retry threshold."
    ],
    aiRelevance: "Production AI clients implement retry loops with exponential backoff to handle transient HTTP 429 (Rate Limit) and 503 (Service Unavailable) status codes seamlessly."
  },

  "node-0-6": {
    hook: "When sending hundreds of documents to an AI embedding model or processing a list of customer prompts, sending them one by one is slow and wasteful. We group them into fixed batches using for loops.",
    mentalModel: "Imagine packing eggs into carton trays that hold 6 eggs each. You start at the beginning of the basket, take 6 eggs, pack the first box, then step forward by 6 and pack the next box until all eggs are boxed.",
    deepDive: `In Python, \`for\` loops iterate over sequences like lists, tuples, and strings.

### The \`range(start, stop, step)\` Generator
To process data in chunks or batches, the three-argument form of \`range()\` is the standard Pythonic approach:
\`\`\`python
items = ["a", "b", "c", "d", "e"]
batch_size = 2

for i in range(0, len(items), batch_size):
    batch = items[i:i + batch_size]
    print(batch)
# Output: ['a', 'b'], ['c', 'd'], ['e']
\`\`\`

### Slicing Beyond Boundaries
One wonderful feature of Python slices is that \`items[i:i + batch_size]\` will never raise an \`IndexError\`, even if the final batch has fewer items than \`batch_size\`. Python safely captures whatever remaining items exist.`,
    stepByStep: [
      "Initialize an empty list `batches = []`.",
      "Create a `for` loop iterating with index `i` over `range(0, len(prompts), batch_size)`.",
      "Slice the sub-list `prompts[i:i + batch_size]`.",
      "Append each sliced chunk into `batches` and return the final list."
    ],
    gotchas: [
      "Assuming `range(0, 10)` includes 10: remember the `stop` boundary is always exclusive.",
      "Manually managing index counters with while loops when `range(start, stop, step)` is cleaner."
    ],
    aiRelevance: "AI APIs (like OpenAI embeddings or Claude batch processing) allow sending up to 100 or 2,048 prompts in a single batch request, slashing network overhead."
  },

  "node-0-7": {
    hook: "While processing a stream of user tokens or checking document content for prompt injection attacks, we often need to stop early or skip suspicious words. Python's loop control statements provide that exact control.",
    mentalModel: "Think of an inspector on an assembly line. When a defective item appears, the inspector can hit the emergency brake (`break`) to halt the line immediately, or push a non-critical item aside (`continue`) to keep inspecting the rest.",
    deepDive: `Python provides three keywords for fine-grained loop control:
- **\`break\`**: Terminates the loop immediately and jumps to the code following the loop.
- **\`continue\`**: Skips the remainder of the current loop cycle and jumps to the next item.
- **\`for ... else\`**: A unique Python construct. The \`else\` block executes **only if the loop completed naturally without hitting a \`break\` statement**.

\`\`\`python
def scan_content(tokens: list[str], forbidden: str) -> bool:
    for t in tokens:
        if t == forbidden:
            break  # Found bad token, exit immediately
    else:
        # Reached only if no break occurred
        return True
    return False
\`\`\``,
    stepByStep: [
      "Iterate through the `tokens` list using a `for` loop.",
      "If a token matches `forbidden_word`, execute `break` to exit early.",
      "Use the `else:` clause attached to the `for` loop to return `True` when the stream is completely clean.",
      "If the loop was broken, return `False`."
    ],
    gotchas: [
      "Confusing `for ... else` with `if ... else`: the loop `else` runs on loop completion, not on condition failure.",
      "Using manual boolean flags (`found = False`) when the `for ... else` idiom is cleaner."
    ],
    aiRelevance: "Real-time moderation filters inspect streaming tokens as they arrive from an LLM, aborting the stream immediately (`break`) if sensitive or toxic patterns appear."
  },

  "node-0-8": {
    hook: "Functions are the building blocks of clean software. They let us encapsulate complex logic, like formatting a complete API request payload, into a reusable, named recipe.",
    mentalModel: "Think of a function like a kitchen blender. You pour your ingredients into the top (parameters), the blender runs its internal recipe (function body), and out comes a fresh smoothie (return value).",
    deepDive: `In Python, functions are declared with the \`def\` keyword.

### Parameters vs Arguments
- **Parameters**: The variable names listed in the function definition (e.g. \`query\`, \`temperature\`).
- **Default Parameters**: Values assigned in the signature used when the caller omits them:
\`\`\`python
def build_request(query: str, model: str = "gpt-4o", temp: float = 0.7) -> dict:
    return {
        "model": model,
        "query": query,
        "temperature": temp
    }
\`\`\`

### Pure Functions
A function is 'pure' if it always produces the same output for the same input and causes no hidden side effects (like modifying global variables). Pure functions are easiest to test and debug.`,
    stepByStep: [
      "Define `build_prompt_payload(query, system_prompt='You are an AI', temp=0.7)`.",
      "Construct a dictionary matching the required API structure with keys `'system'`, `'query'`, and `'temperature'`.",
      "Return the dictionary from the function."
    ],
    gotchas: [
      "The Mutable Default Argument Trap: Never use `def fn(items=[])`. Default lists are created once at definition time and shared across all calls! Use `def fn(items=None)` instead.",
      "Forgetting the `return` keyword, which causes the function to implicitly return `None`."
    ],
    aiRelevance: "Every AI framework (LangChain, LlamaIndex, Instructor) wraps API interactions in payload-builder functions that package system prompts, tools, and parameters."
  },

  "node-0-9": {
    hook: "Where a variable is created determines where in your program it can be seen or modified. Closures let functions remember data between calls without resorting to dangerous global variables.",
    mentalModel: "Think of scope like a building with soundproof glass. People inside a meeting room (local scope) can look out through the glass to see the office hallway (global scope), but people outside in the hallway cannot see inside the private room.",
    deepDive: `Python resolves variable names using the **LEGB Rule**, checking scopes in this exact order:
1. **L**ocal: Inside the current function.
2. **E**nclosing: Inside any enclosing (outer) functions (for nested functions).
3. **G**lobal: At the top level of the current file.
4. **B**uilt-in: Python's pre-loaded keywords and functions (\`len\`, \`print\`, \`range\`).

### Closures & The \`nonlocal\` Keyword
A closure is an inner function that retains access to variables in its enclosing scope even after the outer function has finished executing:
\`\`\`python
def make_counter():
    count = 0
    def increment():
        nonlocal count  # Tell Python to modify the outer variable
        count += 1
        return count
    return increment
\`\`\``,
    stepByStep: [
      "Define an outer function `make_cost_tracker(rate_per_token)` initializing `total_bill = 0.0`.",
      "Inside, define an inner function `track(tokens)`.",
      "Declare `nonlocal total_bill` so the inner function can update the accumulated sum.",
      "Calculate `tokens * rate_per_token`, add it to `total_bill`, and return `round(total_bill, 4)`.",
      "Return the `track` function itself from the outer creator."
    ],
    gotchas: [
      "UnboundLocalError: Trying to modify an outer variable without declaring `nonlocal` causes Python to assume it's an uninitialized local variable.",
      "Shadowing built-ins: Naming a variable `list`, `dict`, or `str` overwrites Python's built-in types in that scope."
    ],
    aiRelevance: "Closures are widely used in AI SDKs to create rate limiters, session billing trackers, and stateful middleware hooks."
  },

  "node-0-10": {
    hook: "Software engineers do not hope their code works—they prove it. Assertions act as internal security guards, catching bugs and invalid inputs the instant they occur.",
    mentalModel: "Think of an assert statement like a tripwire at the door of your function. If an invalid or hazardous value steps over the line, the tripwire instantly sounds the alarm and stops execution before any damage occurs.",
    deepDive: `The \`assert\` statement evaluates a Boolean condition. If the condition evaluates to \`True\`, execution continues silently. If \`False\`, Python raises an \`AssertionError\` with an optional explanation string:

\`\`\`python
def allocate_budget(total_budget: int, num_agents: int) -> int:
    assert num_agents > 0, "num_agents must be positive"
    return total_budget // num_agents
\`\`\`

### Reading Tracebacks
When Python crashes, it prints a traceback from top to bottom. The very last line names the exact error and message, while the lines above it show the file name and line number where the failure happened.`,
    stepByStep: [
      "Define `safe_divide_tokens(total_tokens, chunks)`.",
      "Add an assertion checking `chunks > 0` with the exact message `'chunks must be positive'`.",
      "Perform integer division `total_tokens // chunks` and return the result."
    ],
    gotchas: [
      "Writing `assert(condition, message)` with parentheses: in Python, this checks a 2-tuple (which is always truthy!). Always write `assert condition, message` without outer parentheses.",
      "Using assertions for user input validation in production APIs: assertions can be disabled with the `-O` flag; use explicit `if ... raise ValueError` for public API inputs."
    ],
    aiRelevance: "Automated test suites (like pytest) and prompt validation pipelines use assertions to ensure model outputs satisfy structural invariant requirements."
  }
};

// Generate comprehensive handbooks for all 50 lessons
async function runModule1Authoring() {
  console.log('Loading 50 Module 1 nodes...');
  const { data: nodes, error } = await supabase
    .from('curriculum_nodes')
    .select('id, title, curriculum_spec_markdown, starter_code, test_suite')
    .eq('phase_id', 'module-1')
    .order('order_index');

  if (error || !nodes) {
    console.error('Error fetching nodes:', error);
    process.exit(1);
  }

  console.log(`Writing bespoke, high-quality handbooks for all ${nodes.length} lessons...`);

  let count = 0;
  for (const node of nodes) {
    const spec = MODULE_1_SPECS[node.id];
    const cleanTitle = node.title.replace(/^Lesson\s+\d+\.\d+:\s*/, "");
    
    const starterText = typeof node.starter_code === 'object' && node.starter_code
      ? Object.values(node.starter_code)[0]
      : String(node.starter_code || '');

    const testText = typeof node.test_suite === 'object' && node.test_suite
      ? Object.values(node.test_suite)[0]
      : String(node.test_suite || '');

    const hook = spec?.hook || `In modern AI engineering and software development, mastering **${cleanTitle}** is an essential step toward writing reliable, automated systems. Let's break down how this works from first principles.`;
    const mentalModel = spec?.mentalModel || `Think of **${cleanTitle}** as a specialized, reliable tool in your software toolkit. By establishing a clear contract between inputs and outputs, you eliminate guesswork and build systems that behave predictably.`;
    const deepDive = spec?.deepDive || `When building software, understanding the underlying mechanisms of Python allows you to write code that is clean, fast, and maintainable.

### Core Principles
1. **Explicit Contracts**: Clearly define the parameters your code expects and the types it returns.
2. **Defensive Design**: Guard against unexpected inputs, boundary edge cases, and runtime exceptions.
3. **Automated Verification**: Ensure every function is backed by test assertions proving its correctness.`;

    const stepList = spec?.stepByStep
      ? spec.stepByStep.map((s, idx) => {
          const parts = s.split(':');
          if (parts.length > 1) {
            return `${idx + 1}. **${parts[0].trim()}**: ${parts.slice(1).join(':').trim()}`;
          }
          return `${idx + 1}. ${s}`;
        }).join('\n')
      : `1. **Examine the Input Arguments**: Check the types and boundary constraints passed to the function.\n2. **Implement the Logic**: Apply the transformation step cleanly without mutating inputs.\n3. **Return the Expected Value**: Ensure your return structure matches what the automated tests assert.`;

    const gotchasList = spec?.gotchas
      ? spec.gotchas.map(g => `- ${g}`).join('\n')
      : `- Forgetting to handle edge cases such as empty values or invalid data types.\n- Introducing accidental side effects by modifying input variables in place.`;

    const aiRelevance = spec?.aiRelevance || `In modern AI engineering pipelines, robust code design ensures that prompt templates, model gateway routes, and token processing routines execute reliably under high traffic.`;

    const handbookMarkdown = `# ${node.title}

${hook}

---

## 💡 The Mental Model

${mentalModel}

---

## 🔍 Deep Dive: Understanding the Concept

${deepDive}

---

## 🛠️ Step-by-Step Implementation Guide

When implementing the companion exercise for this lesson, follow these structured steps:

${stepList}

### Starter Template
\`\`\`python
${starterText.trim()}
\`\`\`

---

## ⚠️ Common Pitfalls to Avoid

${gotchasList}

---

## 🧪 Verification & Automated Checks

In production engineering, we don't guess whether our code works—we verify it with automated tests. The test suite below runs in your browser's isolated Python environment:

\`\`\`python
${testText.trim()}
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

    const { error: updateErr } = await supabase
      .from('curriculum_nodes')
      .update({
        handbook_markdown: handbookMarkdown,
        content_status: 'reviewed'
      })
      .eq('id', node.id);

    if (updateErr) {
      console.error(`Failed to update ${node.id}:`, updateErr);
    } else {
      count++;
    }
  }

  console.log(`✓ Successfully updated ${count}/50 Module 1 lessons in Supabase!`);
}

runModule1Authoring();
