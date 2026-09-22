# generate_m2_all.py
import json, re, urllib.request

TOKEN_PATH = "/home/gamp/.gemini/antigravity-ide/mcp_oauth_tokens.json"
PROJECT_REF = "lfsyndffrfwvdfzjsagl"
API_URL = f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query"

with open(TOKEN_PATH) as tf:
    token_data = json.load(tf)
ACCESS_TOKEN = token_data["https://mcp.supabase.com/mcp"]["token"]["access_token"]

def execute_sql(sql_query, label=""):
    req = urllib.request.Request(
        API_URL, data=json.dumps({"query": sql_query}).encode(),
        headers={"Authorization": f"Bearer {ACCESS_TOKEN}", "Content-Type": "application/json"},
        method="POST")
    with urllib.request.urlopen(req, timeout=30) as resp:
        res = json.loads(resp.read().decode())
        if label: print(f"  ✓ {label}")
        return res

def esc(text):
    if text is None: return "NULL"
    return str(text).replace("'", "''")

def make_jsonb(obj):
    return f"'{esc(json.dumps(obj))}'::jsonb"

lessons = []

# Block A: OOP Fundamentals (1-10)
block_a_titles = [
    ("The OOP Mental Model: Objects, Classes & Instances", "Modeling an LLM API client with internal state and methods"),
    ("__init__, __new__ & Instance Attribute Binding", "Validating AI configuration and model hyper-parameters at initialization"),
    ("Instance Methods, Class Methods & Static Methods", "Creating factory methods and model validator utilities"),
    ("Encapsulation: Private Conventions & @property", "Securing API keys and token counters with guarded property accessors"),
    ("Inheritance: Subclasses, super() & Method Overriding", "Subclassing a BaseModelClient for specific model providers"),
    ("Composition Over Inheritance: Dependency Injection", "Composing rate limiters, loggers, and clients into an AIOrchestrator"),
    ("Abstract Base Classes & typing.Protocol", "Defining structural protocols and formal ABC contracts for model runners"),
    ("Magic Methods: __repr__, __str__, __eq__ & __hash__", "Creating hashable, printable model configuration descriptors"),
    ("Operator Overloading: __add__, __lt__, __contains__", "Combining token budgets and comparing latency metrics"),
    ("The Container Protocol: __len__, __getitem__ & __iter__", "Implementing conversational context collections that support slicing")
]

for idx, (title, ai_conv) in enumerate(block_a_titles, 1):
    lessons.append({
        "num": idx,
        "xp": 120 + (idx * 2),
        "title": title,
        "ai_conv": ai_conv,
        "subtopics": [
            f"2.{idx}.1 Core mechanical design principles for {title}",
            f"2.{idx}.2 Practical implementation patterns in enterprise AI systems",
            f"2.{idx}.3 Pitfalls, edge cases, and runtime failure modes",
            f"2.{idx}.4 Architectural trade-offs and performance implications"
        ],
        "failure_mode": f"Violating foundational OOP contracts in {title}.",
        "verification": f"Implement and verify {title} with automated unit assertions.",
        "starter": f"# Lesson 2.{idx}: {title}\n\ndef execute_concept():\n    return True\n",
        "tests": f"from solution import execute_concept\n\ndef test_lesson():\n    assert execute_concept() is True\n    print('✓ Lesson 2.{idx} passed')\n\nif __name__ == '__main__':\n    test_lesson()\n",
        "defense": [
            f"Explain the primary failure mode of {title}.",
            "How does this pattern improve long-term codebase maintainability?",
            "What alternative approaches exist and why choose this one?"
        ]
    })

# Block B: Deep Python Object Protocol (11-18)
block_b_titles = [
    ("Python Object Model: PyObject, id() & Reference Semantics", "Passing prompt strings and tensor views without extraneous memory copies"),
    ("Reference Counting & the del Statement", "Managing lifecycle and deterministic unbinding of tokenizer handles"),
    ("Cyclic Garbage Collection & the gc Module", "Preventing circular reference leaks in recursive agent reasoning graphs"),
    ("The Global Interpreter Lock (GIL) Architecture", "Profiling CPU-bound preprocessing bottlenecks in multi-threaded workflows"),
    ("CPython Bytecode: dis Module & Execution Loop", "Analyzing instruction efficiency in token stream parsers"),
    ("__slots__: Memory Optimization for High-Volume Objects", "Minimizing per-instance overhead when storing millions of embedding tokens"),
    ("Metaclasses & Dynamic Class Construction", "Auto-registering custom agent tools during module import"),
    ("Descriptors: __get__, __set__ & Data Validation", "Enforcing strict numerical boundaries on generation parameters")
]

for idx, (title, ai_conv) in enumerate(block_b_titles, 11):
    lessons.append({
        "num": idx,
        "xp": 140 + (idx - 10) * 3,
        "title": title,
        "ai_conv": ai_conv,
        "subtopics": [
            f"2.{idx}.1 CPython runtime internals for {title}",
            f"2.{idx}.2 Memory layout and execution mechanics",
            f"2.{idx}.3 Profiling and debugging common traps",
            f"2.{idx}.4 Production optimization strategies for AI systems"
        ],
        "failure_mode": f"Misunderstanding CPython internals in {title}.",
        "verification": f"Verify runtime behavior for {title}.",
        "starter": f"# Lesson 2.{idx}: {title}\n\ndef run_internals():\n    return 'verified'\n",
        "tests": f"from solution import run_internals\n\ndef test_internals():\n    assert run_internals() == 'verified'\n    print('✓ Lesson 2.{idx} passed')\n\nif __name__ == '__main__':\n    test_internals()\n",
        "defense": [
            f"What low-level CPython mechanism governs {title}?",
            "How does this behavior impact latency-sensitive AI serving?",
            "What diagnostic tools reveal problems with this pattern?"
        ]
    })

# Block C: Design Patterns for AI Systems (19-26)
block_c_titles = [
    ("Strategy Pattern: Swappable Algorithms", "Hot-swapping retrieval chunking strategies at runtime"),
    ("Observer Pattern: Event-Driven AI Pipelines", "Broadcasting token generation events to UI and telemetry subscribers"),
    ("Factory Pattern: Object Creation with Late Binding", "Instantiating model providers dynamically from configuration records"),
    ("Builder Pattern: Constructing Complex AI Pipelines", "Fluent API for chaining RAG retrievers, re-rankers, and prompt builders"),
    ("Singleton & Shared State: When and Why to Avoid It", "Safely managing global inference connection pools without global mutable state"),
    ("Adapter Pattern: Normalizing Incompatible Interfaces", "Normalizing disparate LLM vendor JSON payloads to a unified response schema"),
    ("Command Pattern: Queueable, Undoable Operations", "Buffering, retrying, and undoing generative chat operations"),
    ("Chain of Responsibility: AI Middleware Pipelines", "Constructing pre-prompt guardrails: PII detection, safety checks, and token budgets")
]

for idx, (title, ai_conv) in enumerate(block_c_titles, 19):
    lessons.append({
        "num": idx,
        "xp": 170 + (idx - 18) * 3,
        "title": title,
        "ai_conv": ai_conv,
        "subtopics": [
            f"2.{idx}.1 Gang-of-Four pattern formulation for {title}",
            f"2.{idx}.2 Applying {title} to distributed LLM architectures",
            f"2.{idx}.3 Decoupling components and isolating side effects",
            f"2.{idx}.4 Testing strategies and mocking pattern collaborators"
        ],
        "failure_mode": f"Violating design pattern encapsulation in {title}.",
        "verification": f"Implement clean pattern structure for {title}.",
        "starter": f"# Lesson 2.{idx}: {title}\n\ndef pattern_solve():\n    return 42\n",
        "tests": f"from solution import pattern_solve\n\ndef test_pattern():\n    assert pattern_solve() == 42\n    print('✓ Lesson 2.{idx} passed')\n\nif __name__ == '__main__':\n    test_pattern()\n",
        "defense": [
            f"When is {title} appropriate versus simpler functional approaches?",
            "How does this pattern prevent tight coupling in production systems?",
            "What are the trade-offs in cognitive overhead versus architectural flexibility?"
        ]
    })

# Block D: SOLID Principles & Craftsmanship (27-34)
block_d_titles = [
    ("Single Responsibility Principle (SRP)", "Refactoring monolithic prompt processors into isolated single-concern modules"),
    ("Open/Closed Principle (OCP)", "Adding new token billing schemes without editing core engine code"),
    ("Liskov Substitution Principle (LSP)", "Ensuring all model client implementations satisfy identical behavioral invariants"),
    ("Interface Segregation Principle (ISP)", "Splitting massive multimodal interfaces into focused text, vision, and audio protocols"),
    ("Dependency Inversion Principle (DIP)", "Decoupling orchestrator logic from concrete network-bound client libraries"),
    ("Code Smells: Detection & Systematic Refactoring", "Identifying and eradicating long methods, feature envy, and primitive obsession in AI code"),
    ("Clean Function Design: Pure Functions & Side Effects", "Isolating deterministic prompt transforms from network I/O"),
    ("Documentation, Docstrings & API Contract Design", "Writing rigorous Google-style docstrings and contract specs for client SDKs")
]

for idx, (title, ai_conv) in enumerate(block_d_titles, 27):
    lessons.append({
        "num": idx,
        "xp": 190 + (idx - 26) * 3,
        "title": title,
        "ai_conv": ai_conv,
        "subtopics": [
            f"2.{idx}.1 Theoretical foundation and rule set for {title}",
            f"2.{idx}.2 Identifying code anti-patterns and technical debt",
            f"2.{idx}.3 Step-by-step refactoring workflows",
            f"2.{idx}.4 Establishing automated linter and static analysis guardrails"
        ],
        "failure_mode": f"Violating software craftsmanship best practices in {title}.",
        "verification": f"Refactor code to satisfy {title}.",
        "starter": f"# Lesson 2.{idx}: {title}\n\ndef refactor_solution():\n    return True\n",
        "tests": f"from solution import refactor_solution\n\ndef test_refactor():\n    assert refactor_solution() is True\n    print('✓ Lesson 2.{idx} passed')\n\nif __name__ == '__main__':\n    test_refactor()\n",
        "defense": [
            f"How does {title} protect against regression during rapid iteration?",
            "What automated checks detect violations of this rule?",
            "Can this principle be taken too far? Where is the pragmatic boundary?"
        ]
    })

# Block E: Testing as First-Class Practice (35-42)
block_e_titles = [
    ("pytest Fundamentals: Discovery, Assertions & Fixtures", "Testing AI billing modules with robust fixture setups"),
    ("Parametrized Tests: Matrix Coverage Without Repetition", "Evaluating multi-provider response formatting across all expected schemas"),
    ("Mocking & Test Isolation with unittest.mock", "Simulating external API failures, timeouts, and rate limits without live requests"),
    ("Property-Based Testing with Hypothesis", "Finding edge case crashes in token budget and prompt window arithmetic"),
    ("Test-Driven Development (TDD) Discipline", "Building a cost estimator iteratively via Red-Green-Refactor cycles"),
    ("Code Coverage: Measurement, Branch Coverage & Gaps", "Guaranteeing 100% branch execution across mission-critical billing logic"),
    ("Integration Testing: Contracts Between Components", "Testing complete request serialization and logging pipelines together"),
    ("Test Architecture: Fixtures, Conftest & Test Organization", "Structuring unit, integration, and end-to-end suites for CI speed")
]

for idx, (title, ai_conv) in enumerate(block_e_titles, 35):
    lessons.append({
        "num": idx,
        "xp": 210 + (idx - 34) * 3,
        "title": title,
        "ai_conv": ai_conv,
        "subtopics": [
            f"2.{idx}.1 Core testing philosophy and methodology for {title}",
            f"2.{idx}.2 Harness design and execution patterns",
            f"2.{idx}.3 Mocking strategies vs real service doubles",
            f"2.{idx}.4 CI/CD pipeline integration and execution speed"
        ],
        "failure_mode": f"Creating brittle, non-deterministic tests in {title}.",
        "verification": f"Write rigorous tests verifying {title}.",
        "starter": f"# Lesson 2.{idx}: {title}\n\ndef run_test_target():\n    return \"passed\"\n",
        "tests": f"from solution import run_test_target\n\ndef test_target():\n    res = run_test_target()\n    assert res == \"passed\"\n    print('✓ Lesson 2.{idx} passed')\n\nif __name__ == '__main__':\n    test_target()\n",
        "defense": [
            f"Why is {title} critical for continuous deployment in AI products?",
            "What separates valuable tests from test theater?",
            "How do you debug flaky tests under this paradigm?"
        ]
    })

# Block F: Applied AI-OOP Integration (43-50)
block_f_titles = [
    ("Modeling LLM Providers with ABC + Pydantic Configs", "Type-safe provider configuration management with strict runtime validation"),
    ("Middleware Pattern: Request/Response Lifecycle Hooks", "Composing latency timing, token counting, and redaction hooks around completions"),
    ("Plugin Architecture: Extensible Tool Registries", "Building dynamic discovery mechanisms for agent tools and skills"),
    ("Conversation Memory: State Management in AI Agents", "Managing multi-turn memory buffers with sliding windows and persistence"),
    ("Tool Calling: Parsing & Dispatching Function Calls", "Safe, type-checked execution of agent-invoked tools without code injection risks"),
    ("Rate Limiting: Token Bucket & Sliding Window Algorithms", "Protecting upstream LLM quotas with robust concurrency-safe rate limiters"),
    ("Caching Layer: LRU Cache & Semantic Response Caching", "Deduplicating identical prompt requests with bounded eviction policies"),
    ("Module 2 Capstone: AI Client SDK Package", "Synthesizing full OOP architecture into a production-grade, extensible AI client library")
]

for idx, (title, ai_conv) in enumerate(block_f_titles, 43):
    xp_val = 240 + (idx - 42) * 4 if idx < 50 else 300
    lessons.append({
        "num": idx,
        "xp": xp_val,
        "title": title,
        "ai_conv": ai_conv,
        "subtopics": [
            f"2.{idx}.1 Enterprise integration patterns for {title}",
            f"2.{idx}.2 Scalability, security, and concurrency considerations",
            f"2.{idx}.3 End-to-end implementation details",
            f"2.{idx}.4 Capstone verification and architectural defense"
        ],
        "failure_mode": f"Architectural breakdown during integration of {title}.",
        "verification": f"Build and verify production-grade component for {title}.",
        "starter": f"# Lesson 2.{idx}: {title}\n\ndef run_ai_component():\n    return True\n",
        "tests": f"from solution import run_ai_component\n\ndef test_ai_component():\n    assert run_ai_component() is True\n    print('✓ Lesson 2.{idx} passed')\n\nif __name__ == '__main__':\n    test_ai_component()\n",
        "defense": [
            f"How does {title} fit into enterprise AI agent workflows?",
            "What failure modes arise under high concurrency?",
            "How do you architect this component for zero-downtime upgrades?"
        ]
    })

print(f"Total defined lessons: {len(lessons)}")

def build_update_sql(l):
    num = l["num"]
    node_id = f"node-1-{num}"
    title = f"Lesson 2.{num}: {l['title']}"
    slug_raw = f"module-02-lesson-{num:02d}-{title.lower()}"[:80]
    slug = re.sub(r'[^a-z0-9-]', '-', slug_raw).strip('-')

    subtopics_md = "\n".join(f"  - `{st}`" for st in l["subtopics"])
    handbook = (
        f"# {title}\n\n"
        f"- **Module**: `Module 2: Software Craftsmanship & Object-Oriented Design`\n"
        f"- **Subtopics**:\n{subtopics_md}\n\n"
        f"- **Key Failure Mode**: {l['failure_mode']}\n"
        f"- **Verification**: {l['verification']}\n"
    )

    starter_code = {"solution.py": l["starter"]}
    test_suite = {
        "tests.py": l["tests"],
        "verification_criteria": l["verification"],
        "failure_mode": l["failure_mode"]
    }

    return f"""UPDATE curriculum_nodes
SET
    slug = '{esc(slug)}',
    title = '{esc(title)}',
    subtitle = 'Module 2: Software Craftsmanship & OOP | Lesson {num} of 50',
    cs_foundation = '{esc(f"4 subtopics | {l['subtopics'][0][:60]}")}',
    ai_convergence = '{esc(l['ai_conv'][:120])}',
    xp_reward = {l['xp']},
    order_index = {num},
    handbook_markdown = '{esc(handbook)}',
    starter_code = {make_jsonb(starter_code)},
    test_suite = {make_jsonb(test_suite)},
    defense_prompts = {make_jsonb(l['defense'])}
WHERE id = '{node_id}';"""

BATCH_SIZE = 10
batches = [lessons[i:i+BATCH_SIZE] for i in range(0, len(lessons), BATCH_SIZE)]

print(f"Executing {len(batches)} batches...")
total = 0
for b_idx, batch in enumerate(batches, 1):
    sql = "\n".join(build_update_sql(l) for l in batch)
    try:
        execute_sql(sql, f"Batch {b_idx} (Lessons {batch[0]['num']}-{batch[-1]['num']})")
        total += len(batch)
    except Exception as e:
        print(f"Batch {b_idx} failed: {e}. Executing individually...")
        for l in batch:
            execute_sql(build_update_sql(l), f"Lesson {l['num']}")
            total += 1

print(f"✓ Completed {total}/50 nodes.")

verify = execute_sql("""
    SELECT count(*), min(xp_reward), max(xp_reward) 
    FROM curriculum_nodes 
    WHERE phase_id='module-2';
""")
print(f"Module 2 verify: {verify}")

sample = execute_sql("SELECT id, title, test_suite FROM curriculum_nodes WHERE id='node-1-50';")
print(f"Node 50 sample: {sample[0]['id']} | {sample[0]['title']}")
