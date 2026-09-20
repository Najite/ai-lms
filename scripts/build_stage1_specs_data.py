import json

# Phase 0: 20 beginner lessons
PHASE_0_BEGINNER = [
    (1, "Variables, Data Types & The Interpreter",
     "None",
     [
         "What is physical computer memory: RAM as numbered storage boxes.",
         "Variables as named sticky notes: assigning integers, floats, strings, and booleans.",
         "How Python's interpreter runs code line-by-line in real time.",
         "Dynamic types: checking variable types with type() and changing types safely."
     ],
     "Mixing incompatible data types (like adding text to a number), which triggers a TypeError.",
     "Write a script that creates variables for an AI model's name, version, and cost, and print their types.",
     "PromptCLI: Storing user prompt settings and configurations."),

    (2, "Expressions, Operators & Precedence",
     "Lesson 0.1",
     [
         "Math operators in code: addition, subtraction, multiplication, division, and modulo remainder.",
         "Order of operations (PEMDAS): how Python prioritizes math calculations.",
         "Comparison operators: checking if values are equal, greater than, or less than.",
         "Boolean logic: combining decisions with and, or, and not."
     ],
     "Confusing assignment (=) with equality comparison (==), causing syntax crashes.",
     "Calculate the total token cost of an AI request using math operators and print the rounded result.",
     "PromptCLI: Token budget calculation utility."),

    (3, "String Indexing, Slicing & Manipulation",
     "Lesson 0.1",
     [
         "Strings as sequences: character positions starting from index 0.",
         "Negative indexing: easily getting the last characters of a word with -1.",
         "Slicing strings: cutting out substrings using [start:stop:step].",
         "Helpful string tools: stripping whitespace, changing case, splitting sentences, and joining words."
     ],
     "Asking for an index beyond the end of the text, causing an IndexError.",
     "Clean a messy user prompt string by stripping unwanted spaces and extracting the first 50 characters.",
     "PromptCLI: Prompt cleaning and input truncation engine."),

    (4, "Conditional Branching: if, elif, else",
     "Lesson 0.2",
     [
         "Making decisions in code: the if statement and boolean tests.",
         "Alternative paths: using elif for multiple choices and else for fallbacks.",
         "Python indentation rules: using consistent 4 spaces to define code blocks.",
         "Truthiness: understanding which values count as True and which count as False."
     ],
     "Inconsistent indentation mixing tabs and spaces, triggering IndentationError.",
     "Write a decision tree that routes a user prompt to either a fast model or a smart model based on length.",
     "PromptCLI: Smart model routing logic."),

    (5, "While Loops & Loop Invariants",
     "Lesson 0.4",
     [
         "Repetition in programming: repeating actions while a condition remains True.",
         "Loop counters: updating variables to prevent programs from running forever.",
         "Sentinel loops: draining a list of items until none remain.",
         "Understanding loop safety: ensuring your loop always reaches a stopping point."
     ],
     "Forgetting to increment the loop counter, causing an infinite loop that freezes your terminal.",
     "Write a retry loop that attempts an imaginary network connection up to 3 times before giving up.",
     "PromptCLI: Network retry loop for API requests."),

    (6, "For Loops & The range() Generator",
     "Lesson 0.5",
     [
         "The for loop: iterating through every item in a collection automatically.",
         "The range() function: generating sequential numbers on demand without wasting memory.",
         "Looping with indexes: using enumerate() to track both the position and the item.",
         "Nested loops: running an inner loop inside an outer loop cleanly."
     ],
     "Confusing range(1, 5) which produces 1, 2, 3, 4 with numbers 1 through 5.",
     "Iterate over a list of 5 user prompts, numbering each one and printing its character count.",
     "PromptCLI: Batch prompt processing loop."),

    (7, "Loop Control: break, continue & else",
     "Lesson 0.6",
     [
         "Early exits: stopping a loop immediately using the break keyword.",
         "Skipping turns: jumping to the next iteration using the continue keyword.",
         "The loop else clause: running fallback code only when a loop finishes without breaking.",
         "Practical search patterns: finding an item in a list and exiting as soon as it is found."
     ],
     "Placing break outside of a loop or conditional, causing immediate unexpected loop termination.",
     "Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.",
     "PromptCLI: Content moderation scanner."),

    (8, "Functions: Parameters, Arguments & Returns",
     "Lesson 0.4",
     [
         "Packaging reusable code: defining functions with def and calling them.",
         "Passing data into functions: positional parameters and keyword arguments.",
         "Default values: setting safe defaults for optional parameters.",
         "Returning values: sending results back to the caller using return."
     ],
     "Forgetting to return a value, causing the function to silently evaluate to None.",
     "Write a function format_prompt(template, topic, style='concise') that returns a formatted AI prompt.",
     "PromptCLI: Core prompt templating engine."),

    (9, "Variable Scope: Local, Global & Enclosing",
     "Lesson 0.8",
     [
         "Scope boundaries: why variables created inside a function cannot be seen outside.",
         "The LEGB lookup order: how Python searches for variable names.",
         "Global variables: when to read them and why modifying them from functions is risky.",
         "Clean function design: passing arguments explicitly rather than relying on global state."
     ],
     "UnboundLocalError caused by trying to modify a global variable inside a function without declaring it.",
     "Refactor code that relies on 3 global variables into pure functions that take inputs and return outputs.",
     "PromptCLI: Configuration isolation."),

    (10, "Lists: Dynamic Sequential Arrays",
     "Lesson 0.3",
     [
         "Ordered collections: storing multiple items in a Python list.",
         "Adding and removing items: append(), extend(), insert(), and pop().",
         "Searching and counting: using in, index(), and count().",
         "Sorting lists: sorting in-place with sort() vs creating a new list with sorted()."
     ],
     "Modifying a list while looping over it, causing items to be skipped unintentionally.",
     "Build a history tracker that appends user messages, limits history to 10 items, and prints them in order.",
     "PromptCLI: Conversation history list manager."),

    (11, "List Comprehensions & Transforms",
     "Lesson 0.10",
     [
         "Readable transforms: replacing multi-line for loops with single-line comprehensions.",
         "Filtering with if: keeping only items that match specific criteria.",
         "Comprehension syntax: [expression for item in iterable if condition].",
         "Performance benefits: why list comprehensions run faster than manual append loops."
     ],
     "Writing overly complex nested comprehensions that are unreadable to other engineers.",
     "Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.",
     "PromptCLI: High-speed prompt batch normalization."),

    (12, "Tuples: Fixed Immutable Sequences",
     "Lesson 0.10",
     [
         "Immutable collections: creating fixed groups of items with parentheses ().",
         "Why immutability matters: safety against accidental changes and lower memory usage.",
         "Tuple unpacking: assigning multiple variables at once from a single tuple.",
         "Returning multiple values: returning tuples from functions cleanly."
     ],
     "Attempting to modify a tuple element, causing a TypeError.",
     "Write a function that returns the token count, character count, and estimated cost as an unpacked tuple.",
     "PromptCLI: Multi-value metrics calculation."),

    (13, "Dictionaries: Key-Value Hash Maps",
     "Lesson 0.10",
     [
         "Mapping relationships: pairing unique keys with values using dictionaries {}.",
         "Accessing data safely: using square brackets [] vs the safe get() method with fallbacks.",
         "Updating and deleting: adding new keys, updating existing keys, and using pop().",
         "Iterating dictionaries: looping over keys(), values(), and items() key-value pairs."
     ],
     "Accessing a non-existent key with [] instead of get(), triggering a KeyError crash.",
     "Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely.",
     "PromptCLI: Model hyperparameter state management."),

    (14, "Sets: Unique Elements & Set Algebra",
     "Lesson 0.13",
     [
         "Unique collections: automatically deduplicating items with sets {}.",
         "High-speed lookups: why in checks are virtually instantaneous in sets.",
         "Mathematical set operations: union (|), intersection (&), and difference (-).",
         "When to use sets: removing duplicate user tags or detecting shared vocabulary."
     ],
     "Attempting to put a mutable list into a set, triggering a TypeError: unhashable type.",
     "Find all unique words used in two different user prompts and calculate their overlap using intersection.",
     "PromptCLI: Prompt vocabulary similarity calculator."),

    (15, "File I/O: Reading & Writing Files",
     "Lesson 0.8",
     [
         "Interacting with disk files: opening, reading, and writing text files.",
         "The with open() context manager: automatically closing files even if errors happen.",
         "Reading modes: read(), readline(), and readlines() line-by-line.",
         "Writing vs appending: overwriting files with 'w' vs adding new lines with 'a'."
     ],
     "Forgetting with open(), leaving file handles locked in the operating system.",
     "Read a system prompt template from a local file, replace a placeholder with user input, and save the result.",
     "PromptCLI: Prompt template file loader."),

    (16, "Working with JSON Data",
     "Lesson 0.13, Lesson 0.15",
     [
         "What is JSON: the universal language of modern web APIs and AI models.",
         "Parsing JSON text: converting raw text strings into Python dictionaries with json.loads().",
         "Writing JSON data: converting Python dictionaries into formatted JSON text with json.dumps().",
         "Handling files: using json.load() and json.dump() directly with file objects."
     ],
     "Crashing on invalid JSON syntax with JSONDecodeError when reading corrupted API responses.",
     "Parse an LLM's raw JSON string output into a typed Python dictionary and extract a structured answer.",
     "PromptCLI: Structured AI output parser."),

    (17, "Error Handling: try, except, finally",
     "Lesson 0.8",
     [
         "Handling failures gracefully: catching runtime exceptions before they crash your program.",
         "Catching specific errors: handling ValueError, FileNotFoundError, and KeyError individually.",
         "The else block: running code only when no errors occurred.",
         "The finally block: guaranteeing cleanup routines (like closing connections) always run."
     ],
     "Using a bare except: which hides real bugs and catches system interrupts like Ctrl+C.",
     "Wrap a file reading and JSON parsing function in defensive error handling that logs clear error messages.",
     "PromptCLI: Resilient API response decoder."),

    (18, "Modules & The import System",
     "Lesson 0.8",
     [
         "Organizing code into multiple files: splitting projects into reusable Python modules.",
         "The import statement: importing entire modules, specific functions, or using aliases.",
         "Standard library tour: essential built-in modules like os, sys, math, and random.",
         "Understanding __name__ == '__main__': writing files that can be both imported and run directly."
     ],
     "Creating circular imports between two files that import each other, causing ImportError.",
     "Split a prompt helper into a separate module file and import its functions into your main CLI runner.",
     "PromptCLI: Modular multi-file tool architecture."),

    (19, "Writing Pythonic & PEP 8 Code",
     "Lesson 0.18",
     [
         "The Zen of Python: readability counts, explicit is better than implicit, simple is better than complex.",
         "PEP 8 style guide: snake_case for variables, PascalCase for classes, spacing, and line length.",
         "Docstrings and comments: writing clear explanations for your future self and teammates.",
         "Automated formatters: using modern tools like Black or Ruff to format code effortlessly."
     ],
     "Writing single-letter variable names or 200-line unreadable functions that teammates cannot maintain.",
     "Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.",
     "PromptCLI: Code quality standards across all projects."),

    (20, "Debugging with print & Python pdb",
     "Lesson 0.17",
     [
         "Debugging mindset: how to track down why code behaves differently than you expected.",
         "Strategic print debugging: using f-strings to inspect variable states at key checkpoints.",
         "Interactive debugging with breakpoint(): pausing program execution in the terminal.",
         "Core debugger commands: n (next line), s (step inside), c (continue), and p (print variable)."
     ],
     "Leaving leftover debugging print statements scattered across production codebases.",
     "Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.",
     "PromptCLI: Interactive troubleshooting and bug fixing.")
]

print(f"Loaded {len(PHASE_0_BEGINNER)} Phase 0 beginner lesson specs.")

# Phase 1: 25 beginner lessons
PHASE_1_BEGINNER = [
    (1, "Object-Oriented Programming Mental Model",
     "Phase 0",
     [
         "Real-world mental model: modeling software entities as objects with attributes and behaviors.",
         "Classes as blueprints: defining templates for creating multiple independent instances.",
         "Instances as physical objects: how each object maintains its own isolated memory state.",
         "Why OOP matters in AI engineering: modeling PromptTemplates, ChatMessages, and AgentSessions as clean objects."
     ],
     "Treating a class definition as an active object rather than instantiating it with parentheses ().",
     "Define a ChatMessage class representing an AI message, create instances for user and assistant, and inspect them.",
     "SchemaAgent: Message domain models."),

    (2, "Constructors: __init__ and Instance Attributes",
     "Lesson 1.1",
     [
         "The constructor method: initializing new instances automatically using __init__.",
         "The self parameter: how methods know which specific object instance they are working with.",
         "Instance attributes: binding state directly to self.attribute_name.",
         "Input validation in constructors: checking that required parameters are provided cleanly."
     ],
     "Omitting self as the first parameter of __init__, triggering TypeError: takes 0 positional arguments.",
     "Build a ModelConfig class that validates temperature (0.0 to 2.0) and raises ValueError if out of bounds.",
     "SchemaAgent: LLM configuration builder."),

    (3, "Instance Methods vs Class Methods vs Static Methods",
     "Lesson 1.2",
     [
         "Instance methods: regular methods operating on self and modifying instance state.",
         "Class methods with @classmethod: operating on the class (cls) for alternative constructors.",
         "Static methods with @staticmethod: utility functions that live inside a class without needing self or cls.",
         "When to choose each method type in clean software architecture."
     ],
     "Accidentally calling an instance method from a class without creating an instance first.",
     "Implement a Prompt class with an instance method .render() and a @classmethod .from_file(path).",
     "SchemaAgent: Alternative constructor factory methods."),

    (4, "Encapsulation & Private Attribute Conventions",
     "Lesson 1.2",
     [
         "Encapsulation principle: bundling data and methods together while protecting internal state.",
         "Private variable naming conventions in Python: using leading underscores (_variable and __variable).",
         "Name mangling in Python: how __attribute is transformed to prevent accidental child class overrides.",
         "Public interfaces: exposing only what consumers need to use, hiding internal implementation details."
     ],
     "Reaching directly into private internal attributes of external libraries, breaking when the library updates.",
     "Create an ApiClient class that keeps API keys private while exposing a clean public .generate() method.",
     "SchemaAgent: Secure credential encapsulation."),

    (5, "Properties: @property Getters & Setters",
     "Lesson 1.4",
     [
         "Pythonic attribute access: accessing methods like normal attributes using @property.",
         "Getters: calculating values on-the-fly when an attribute is read.",
         "Setters with @attribute.setter: intercepting assignments to validate data before saving.",
         "Refactoring legacy code: turning raw attributes into validated properties without breaking existing callers."
     ],
     "Creating an infinite recursion loop by setting self.name inside a setter that defines name.",
     "Add a validated @property for temperature that rejects negative numbers and rounds floats to 2 decimal places.",
     "SchemaAgent: Attribute validation descriptors."),

    (6, "Inheritance: Subclasses & Polymorphism",
     "Lesson 1.1",
     [
         "Code reuse through inheritance: creating specialized child classes from a common parent class.",
         "Method overriding: customizing or replacing a parent method inside a child class.",
         "Polymorphism principle: treating different child classes through a single common interface.",
         "When inheritance is appropriate vs when it creates rigid, fragile hierarchies."
     ],
     "Creating deeply nested 5-level inheritance hierarchies that are impossible to maintain or debug.",
     "Create a base Tool class and two child classes (SearchTool and CalculatorTool) implementing .run().",
     "SchemaAgent: Tool execution polymorphism."),

    (7, "Super(): Method Resolution Order (MRO)",
     "Lesson 1.6",
     [
         "Calling parent methods: using super().__init__() to ensure parent initialization runs.",
         "Extending parent behavior: calling super().method() before or after adding child-specific logic.",
         "Method Resolution Order (MRO): the exact order Python uses to search for methods in class hierarchies.",
         "Inspecting class order: using ClassName.mro() to see the inheritance chain."
     ],
     "Forgetting to call super().__init__() in a subclass, leaving parent attributes uninitialized.",
     "Build a SafeTool subclass that calls super().run() and adds automated execution time logging.",
     "SchemaAgent: Middleware tool wrapping."),

    (8, "Composition Over Inheritance",
     "Lesson 1.6",
     [
         "The architectural golden rule: favor object composition ('has-a') over class inheritance ('is-a').",
         "Building systems out of modular parts: assembling an agent from a model, a memory buffer, and tools.",
         "Flexibility benefits: easily swapping components at runtime without changing class inheritance.",
         "Refactoring rigid class hierarchies into clean composed objects."
     ],
     "Forcing a class to inherit from a parent just to reuse a single helper function.",
     "Build an AIAgent class that takes an LLMClient instance and a MemoryBuffer instance via its constructor.",
     "SchemaAgent: Composable agent architecture."),

    (9, "Dunder Methods: __repr__ and __str__",
     "Lesson 1.2",
     [
         "Special double-underscore methods: customizing how Python handles your custom objects.",
         "The duality of display: __str__ for human-friendly messages vs __repr__ for unambiguous debugging.",
         "Default object printing: why omitting these methods shows useless <Object at 0x7f...> pointers.",
         "Formatting best practices: making repr(obj) look like valid Python code to recreate the object."
     ],
     "Failing to implement __repr__, making log files and debugger inspection frustratingly opaque.",
     "Implement clean __str__ and __repr__ methods for an AgentAction class showing tool name and arguments.",
     "SchemaAgent: Clear debugging telemetry."),

    (10, "Operator Overloading: __add__, __eq__, __lt__",
     "Lesson 1.9",
     [
         "Teaching custom objects to use math operators: overloading +, ==, <, and >.",
         "Value equality with __eq__: comparing object contents rather than memory addresses.",
         "Adding objects with __add__: combining two PromptTemplates into a single merged template.",
         "Ordering objects with __lt__: enabling Python's sorted() to sort custom objects automatically."
     ],
     "Implementing __eq__ without handling type checks, causing crashes when comparing with None.",
     "Implement __add__ on PromptSegment so that prompt_a + prompt_b cleanly concatenates their text blocks.",
     "SchemaAgent: Composable prompt segments."),

    (11, "Containers Protocol: __len__ and __getitem__",
     "Lesson 1.9",
     [
         "Creating custom collections: making your classes behave like native Python lists or dicts.",
         "Supporting len(): implementing __len__ to return the item count.",
         "Supporting indexing: implementing __getitem__ to allow square bracket access obj[key] or obj[index].",
         "Iteration for free: how Python automatically loops over objects that implement __getitem__."
     ],
     "Returning negative numbers or non-integers from __len__, triggering TypeError.",
     "Build a MessageHistory class that supports len(history) and indexing history[0] to get messages.",
     "SchemaAgent: Custom collection containers."),

    (12, "Context Managers: __enter__ and __exit__",
     "Lesson 1.2, Phase 0 (Lesson 0.15)",
     [
         "Resource safety: managing setup and teardown automatically with the with statement.",
         "The context manager protocol: implementing __enter__ and __exit__.",
         "Exception handling in __exit__: inspecting errors and deciding whether to suppress them.",
         "Writing lightweight context managers with the @contextmanager decorator from contextlib."
     ],
     "Unconditionally returning True from __exit__, which silently swallows catastrophic syntax errors.",
     "Write a Timer context manager that measures and prints the exact execution time of any code block.",
     "SchemaAgent: Automated latency profiling context."),

    (13, "Iterators Protocol: __iter__ and __next__",
     "Lesson 1.11",
     [
         "How iteration works behind the scenes: the Iterator design pattern in Python.",
         "The __iter__ method: returning an iterator object.",
         "The __next__ method: producing the next item or raising StopIteration when finished.",
         "Building custom stream iterators that process endless streams of incoming AI tokens."
     ],
     "Forgetting to raise StopIteration, causing for loops over your custom object to run forever.",
     "Build a TokenStream class that yields words from a response one-by-one with simulated delays.",
     "SchemaAgent: Simulated token streaming iterator."),

    (14, "Generators & The yield Keyword",
     "Lesson 1.13",
     [
         "Lightweight stream producers: writing generator functions using the yield keyword.",
         "Memory efficiency: why generators use zero extra memory even when yielding billions of items.",
         "Generator state preservation: pausing function execution and resuming seamlessly on next().",
         "Generator expressions: writing single-line memory-efficient streaming pipelines."
     ],
     "Treating a generator like a reusable list; once consumed, a generator is empty and cannot be re-run!",
     "Write a generator function stream_chunks(text, chunk_size) that yields fixed-size text segments.",
     "SchemaAgent: Memory-bounded document chunking."),

    (15, "Decorators: Function Wrapping & Wraps",
     "Lesson 1.2, Phase 0 (Lesson 0.8)",
     [
         "Decorators as function wrappers: augmenting function behavior without modifying original code.",
         "Higher-order functions: functions that accept functions as arguments and return new functions.",
         "Preserving metadata: using @functools.wraps to protect the original function name and docstring.",
         "Practical use cases: automated logging, timing, authentication checks, and input sanitization."
     ],
     "Forgetting @functools.wraps, causing decorated functions to lose their name and breaking debugging tools.",
     "Write a @log_call decorator that prints the function name, arguments, and return value for every invocation.",
     "SchemaAgent: Observability logging wrappers."),

    (16, "Decorators with Arguments",
     "Lesson 1.15",
     [
         "Configurable decorators: writing decorators that take options (like @retry(max_attempts=3)).",
         "The three-tier closure structure: outer function for arguments, middle for wrapper, inner for execution.",
         "Building production-grade retry decorators with exponential backoff for flaky AI API endpoints.",
         "Clean error handling inside decorator closures."
     ],
     "Getting confused by the 3 nested function levels, mixing up where arguments are received.",
     "Write a @retry(times=3) decorator that catches network exceptions and retries the function up to 3 times.",
     "SchemaAgent: Production API retry decorator."),

    (17, "Unit Testing Fundamentals with pytest",
     "Phase 0 (Lesson 0.17)",
     [
         "Why automated testing is mandatory for professional software engineers: preventing regressions.",
         "Writing tests with pytest: simple assert statements without boilerplate.",
         "Structuring test files: naming conventions (test_*.py and test_* functions).",
         "Running tests: using the pytest command in the terminal and reading test failure reports."
     ],
     "Writing tests that pass blindly without asserting any real condition, giving false confidence.",
     "Write a comprehensive test suite for a PromptFormatter function covering valid inputs and edge cases.",
     "SchemaAgent: Unit test suites."),

    (18, "pytest Fixtures: Setup & Teardown",
     "Lesson 1.17",
     [
         "Test fixtures: preparing test data, mock connections, and clean state using @pytest.fixture.",
         "Dependency injection: passing fixtures cleanly into test functions as named arguments.",
         "Fixture scopes: function, module, and session scopes for optimizing test execution speed.",
         "Teardown with yield: automatically cleaning up temporary files after test execution."
     ],
     "Sharing mutable state across tests via module-scoped fixtures, causing tests to fail when run in random order.",
     "Create a sample_agent fixture that initializes a fresh agent instance for each unit test.",
     "SchemaAgent: Test fixture harness."),

    (19, "Parameterized Tests in pytest",
     "Lesson 1.17",
     [
         "Testing multiple inputs efficiently: using @pytest.mark.parametrize.",
         "Eliminating duplicate test code: running one test function across dozens of input/output pairs.",
         "Edge case sweeps: testing empty strings, special characters, huge inputs, and negative numbers.",
         "Readable test reports: giving descriptive IDs to parameterized test cases."
     ],
     "Writing 10 copy-pasted test functions that could be expressed in a single 5-line parameterized test.",
     "Parametrize a prompt validation test across 6 different inputs (valid prompts, empty text, whitespace, null).",
     "SchemaAgent: Automated input boundary testing."),

    (20, "Mocking & Test Isolation with unittest.mock",
     "Lesson 1.17",
     [
         "Why we mock external services: avoiding slow, expensive, and flaky real network API calls during tests.",
         "The Mock object: simulating external dependencies and verifying they were called correctly.",
         "Patching with patch(): temporarily swapping real API functions with mock objects during tests.",
         "Asserting mock behavior: assert_called_once(), assert_called_with(), and mock return values."
     ],
     "Patching the wrong import path (patching where the object is defined instead of where it is imported).",
     "Write a test that patches an OpenAI API call, returns a fake JSON response, and verifies agent processing.",
     "SchemaAgent: Offline API test simulation."),

    (21, "Dataclasses: @dataclass Boilerplate Reduction",
     "Lesson 1.2",
     [
         "Modern Python data containers: using the built-in @dataclass decorator.",
         "Automatic code generation: how @dataclass generates __init__, __repr__, and __eq__ automatically.",
         "Default values and default_factory: safely initializing default mutable lists with field().",
         "Frozen dataclasses: creating immutable data structures using @dataclass(frozen=True)."
     ],
     "Using a mutable default like tags: list = [] in a dataclass instead of field(default_factory=list).",
     "Define a UserProfile and ChatMessage using dataclasses with typed attributes and safe default values.",
     "SchemaAgent: Structured data transfer objects."),

    (22, "Type Annotations & Static Typing with mypy",
     "Lesson 1.21",
     [
         "Static typing in modern Python: writing type hints (x: int, name: str, items: list[str]).",
         "The typing module: Optional, Union, Any, and Callable type signatures.",
         "Static type checking with mypy: running mypy in terminal to catch bugs before your code runs.",
         "Type narrowing: how if checks allow type checkers to verify safety in complex branches."
     ],
     "Overusing Any, which completely disables type safety and lets bugs slip into production unnoticed.",
     "Annotate a complete 50-line module with strict type hints and verify that mypy passes with 0 errors.",
     "SchemaAgent: Strict type-checked codebase."),

    (23, "Refactoring Monolithic Functions",
     "Lesson 1.8, Lesson 1.17",
     [
         "The single responsibility principle: functions should do exactly one thing and do it well.",
         "Extract Function refactoring: breaking 100-line monolithic scripts into small, testable helpers.",
         "Reducing cyclomatic complexity: eliminating deeply nested if-else ladders.",
         "Refactoring with confidence: using unit tests as a safety net to ensure behavior never changes."
     ],
     "Refactoring production code without having an automated test suite in place first.",
     "Refactor a messy 80-line API response handler into 3 focused, well-named functions with full tests.",
     "SchemaAgent: Clean code refactoring."),

    (24, "Code Smells: Identifying & Fixing Anti-Patterns",
     "Lesson 1.23",
     [
         "What is a code smell: warning signs of poor design (long methods, duplicate code, dead code).",
         "Primitive obsession: using raw strings/dicts instead of creating small typed domain objects.",
         "Feature envy and shotgun surgery: symptoms of misaligned class responsibilities.",
         "Automated linting: using modern tools like Ruff to catch code smells automatically."
     ],
     "Ignoring code smells until technical debt makes adding simple new features painfully slow and fragile.",
     "Audit a provided buggy script, identify 4 distinct code smells, and rewrite it into clean architecture.",
     "SchemaAgent: Code quality audit."),

    (25, "Building a Clean CLI Application",
     "Lesson 1.8, Lesson 1.21",
     [
         "Command-line user interfaces: building ergonomic developer tools in the terminal.",
         "Parsing arguments: using Python's built-in argparse module for flags and options.",
         "Subcommands: building multi-command tools (like git commit or docker run) cleanly.",
         "Terminal output styling: using clean formatting and clear error exit codes (sys.exit(1))."
     ],
     "Crashing with ugly Python stack traces when users pass invalid arguments instead of showing helpful usage tips.",
     "Build a complete CLI tool prompt-runner with --model, --temp, and input arguments that runs cleanly.",
     "SchemaAgent: End-to-end CLI tool packaging.")
]

print(f"Loaded {len(PHASE_1_BEGINNER)} Phase 1 beginner lesson specs.")

# Phase 2: 25 beginner lessons
PHASE_2_BEGINNER = [
    (1, "Mental Model: Why Math Powers Systems & AI",
     "Phase 1",
     [
         "Why modern software and AI run on math: transforming fuzzy ideas into precise numbers.",
         "From code to geometry: how words and documents are represented as points in multi-dimensional space.",
         "No advanced prerequisites: building intuition through pictures, arrows, and physical metaphors first.",
         "The mathematical roadmap: moving from simple coordinates to vectors, slopes, and AI optimization."
     ],
     "Believing math is abstract memorization rather than practical tools for measuring similarity and movement.",
     "Write a 200-word explanation comparing how a librarian sorts books by category vs how an AI maps words in space.",
     "VectorCore: Mathematical mental foundations."),

    (2, "Algebraic Equations & Unknown Variables",
     "Lesson 2.1",
     [
         "Variables in math vs variables in code: unknown values to solve for vs named boxes in memory.",
         "Linear equations: solving simple equations like y = mx + b step-by-step.",
         "Balancing equations: applying the same operation to both sides without changing equality.",
         "Translating engineering problems into algebraic formulas (calculating cloud server costs and token limits)."
     ],
     "Forgetting order of operations when rearranging algebraic equations, leading to incorrect calculations.",
     "Write a Python function that solves for the maximum requests allowed given a monthly budget and cost per call.",
     "VectorCore: Rate and capacity budgeting formulas."),

    (3, "Functions as Mappings: Inputs to Outputs",
     "Lesson 2.2",
     [
         "Mathematical functions: rules that map every input in a domain to exactly one output.",
         "Visualizing functions as graphs: plots of f(x) showing curves, trends, and plateaus.",
         "Linear vs non-linear functions: why straight lines cannot model complex human language or vision.",
         "Activation functions preview: introducing functions that turn numbers on or off like light switches."
     ],
     "Assuming all real-world relationships are straight lines, failing to model exponential growth or saturation.",
     "Plot a simple non-linear mapping (like a threshold function) in terminal text and explain its behavior.",
     "VectorCore: Function mapping foundations."),

    (4, "Cartesian Coordinates: 2D & 3D Space",
     "Lesson 2.3",
     [
         "The coordinate plane: measuring positions along X and Y perpendicular axes.",
         "Extending to 3D: adding the Z depth axis to represent physical objects in 3D space.",
         "Points as coordinates: representing a location as an ordered pair (x, y) or triplet (x, y, z).",
         "Plotting data: how scatter plots reveal clusters, patterns, and outliers in datasets."
     ],
     "Mixing up the order of axes (confusing (x, y) with (row, column) in matrix grids).",
     "Create a Point2D class that calculates the midpoint between any two coordinate points.",
     "VectorCore: Spatial coordinate systems."),

    (5, "Distance Metrics: Euclidean vs Manhattan",
     "Lesson 2.4",
     [
         "Measuring distance between points: straight-line distance vs grid-based distance.",
         "Euclidean distance: the Pythagorean theorem in action (square root of sum of squared differences).",
         "Manhattan distance: city-block distance along grid lines (|x1 - x2| + |y1 - y2|).",
         "When to use which metric: physical navigation vs high-dimensional data similarity."
     ],
     "Forgetting the square root in Euclidean distance, accidentally calculating squared distance.",
     "Implement both distance metrics in pure Python and compare their outputs on a grid of points.",
     "VectorCore: Distance and proximity calculation."),

    (6, "Vectors: Magnitude, Direction & Components",
     "Lesson 2.5",
     [
         "What is a vector: an arrow pointing from the origin (0, 0) to a coordinate point.",
         "The two key properties: magnitude (the length of the arrow) and direction (where it points).",
         "Vector components: breaking an arrow into horizontal and vertical steps.",
         "Adding vectors: placing arrows head-to-tail to compute net movement."
     ],
     "Confusing a single scalar number (like speed: 60) with a vector (like velocity: 60 mph North).",
     "Build a Vector2D class that implements vector addition and calculates length (magnitude).",
     "VectorCore: Core vector data types."),

    (7, "Vector Dot Product & Angular Similarity",
     "Lesson 2.6",
     [
         "The dot product operation: multiplying matching components and summing the results.",
         "Geometric meaning: measuring how much two vectors point in the exact same direction.",
         "Orthogonal vectors: why a dot product of 0 means two vectors are at a perfect 90-degree right angle.",
         "The secret behind AI search: how dot products determine whether a query matches a document."
     ],
     "Assuming a higher dot product always means closer meaning, without normalizing for vector lengths.",
     "Calculate the dot product of two simple 3D vectors manually and verify with Python code.",
     "VectorCore: Vector similarity scoring engine."),

    (8, "Matrices as Coordinate Transformers",
     "Lesson 2.6",
     [
         "What is a matrix: a 2D grid of numbers organized into rows and columns.",
         "Geometric view of matrices: instructions for stretching, rotating, and skewing space.",
         "Basis vectors: how the standard grid unit arrows (1,0) and (0,1) move under a transformation.",
         "Identity matrix: the 'do nothing' matrix that leaves all coordinates completely unchanged."
     ],
     "Confusing rows with columns, causing dimensional shape mismatch errors.",
     "Write a function that multiplies a 2D coordinate vector by a scaling matrix to double its size.",
     "VectorCore: Coordinate transformation engine."),

    (9, "Matrix Multiplication: Row-by-Column Mechanics",
     "Lesson 2.8",
     [
         "The dot product rule: computing each output element as the dot product of a row and a column.",
         "Shape compatibility rules: why multiplying an (M x K) matrix by a (K x N) matrix yields an (M x N) matrix.",
         "Non-commutative property: why A * B does NOT equal B * A in matrix multiplication.",
         "Why GPUs excel at AI: performing billions of row-by-column multiplications in parallel."
     ],
     "Attempting to multiply two matrices where the inner dimensions do not match, causing dimension mismatch.",
     "Multiply two (2x2) matrices by hand on paper, then write a Python function to verify your answer.",
     "VectorCore: Matrix multiplication kernels."),

    (10, "Transposition & Symmetric Matrices",
     "Lesson 2.9",
     [
         "Matrix transposition: flipping a matrix over its diagonal so rows become columns.",
         "Shorthand notation: A^T representing the transposed matrix.",
         "Symmetric matrices: special matrices where A equals A^T (like pairwise distance tables).",
         "Practical engineering use: reorienting data shapes so they align properly for matrix multiplication."
     ],
     "Flipping non-square matrices and expecting their diagonal elements to remain in the same positions.",
     "Implement a matrix transpose function that turns an (M x N) nested list into an (N x M) nested list.",
     "VectorCore: Data orientation and reshaping."),

    (11, "Linear Systems of Equations & Gaussian Elimination",
     "Lesson 2.9",
     [
         "Systems of equations: finding values that simultaneously satisfy multiple linear constraints.",
         "Matrix form: expressing systems cleanly as A * x = b.",
         "Gaussian elimination: systematically adding and subtracting rows to eliminate unknowns.",
         "Unique solutions vs infinite solutions vs no solution."
     ],
     "Dividing by zero during row elimination when a pivot element is zero, requiring row swapping.",
     "Solve a 2-variable linear system using Python code and verify by plugging answers back into formulas.",
     "VectorCore: Linear equation solver."),

    (12, "Determinants: Area Scaling & Invertibility",
     "Lesson 2.8",
     [
         "What is a determinant: a single number measuring how much a matrix stretches or shrinks area.",
         "Geometric intuition: a determinant of 2 doubles area; a determinant of 0 squashes area into a flat line.",
         "Invertibility: why a matrix with a determinant of 0 has no inverse (information was permanently lost).",
         "Calculating the determinant of a simple (2x2) matrix: ad - bc."
     ],
     "Attempting to invert a matrix whose determinant is 0, causing mathematical singularity errors.",
     "Calculate the determinant of a 2x2 matrix and state whether the transformation can be reversed.",
     "VectorCore: Matrix invertibility checks."),

    (13, "Intuitive Slope: Rate of Change",
     "Lesson 2.3",
     [
         "What is a slope: rise over run, or how much output changes when input moves by 1 unit.",
         "Secant lines vs tangent lines: measuring average speed over time vs instantaneous speed on a speedometer.",
         "The fundamental idea of calculus: zooming in so close to a curve that it looks like a straight line.",
         "Why rates of change matter: knowing which direction moves a machine learning model toward lower error."
     ],
     "Confusing the value of a function at a point with the slope of the function at that point.",
     "Compute the average rate of change of f(x) = x^2 between x=2 and x=2.001 using Python arithmetic.",
     "VectorCore: Numerical slope approximations."),

    (14, "Derivatives of Polynomials: Power Rule",
     "Lesson 2.13",
     [
         "The derivative function f'(x): a formula that tells you the slope at any input x.",
         "The Power Rule: taking the derivative of x^n by multiplying by n and subtracting 1 from exponent (n * x^(n-1)).",
         "Constant rules: why the derivative of a flat constant number is always 0.",
         "Sum rule: finding derivatives of multi-term polynomials by differentiating term-by-term."
     ],
     "Applying the power rule to exponential functions like 2^x instead of polynomial functions like x^2.",
     "Write a Python function that computes both the exact analytical derivative and the numerical derivative of x^3.",
     "VectorCore: Symbolic and numerical derivatives."),

    (15, "The Chain Rule: Combining Derivatives",
     "Lesson 2.14",
     [
         "Composite functions: functions nested inside other functions (f(g(x))).",
         "The Chain Rule intuition: multiplying the rates of change along each link in the chain.",
         "Real-world analogy: gear ratios in a bicycle (pedal to chainwheel to wheel speed).",
         "The mathematical foundation of deep learning: how error signals flow backward through neural layers."
     ],
     "Forgetting to multiply by the derivative of the inner function, a classic calculus mistake.",
     "Calculate the derivative of f(x) = (3x + 2)^2 using the chain rule and verify with numerical steps.",
     "VectorCore: Chain rule backpropagation foundations."),

    (16, "Partial Derivatives: Multi-Variable Gradients",
     "Lesson 2.15",
     [
         "Functions of multiple variables: functions taking multiple inputs, like cost(price, quantity).",
         "The partial derivative trick: treating all other variables as frozen constants while differentiating one.",
         "Notation: ∂f/∂x measuring sensitivity to x, and ∂f/∂y measuring sensitivity to y.",
         "Interpreting results: which input knob has the biggest impact on the final output."
     ],
     "Accidentally changing multiple variables simultaneously instead of holding one variable strictly constant.",
     "Given f(x, y) = x^2 * y + 3y, calculate both partial derivatives at the point (2, 5).",
     "VectorCore: Multi-variable sensitivity analysis."),

    (17, "The Gradient Vector: Direction of Steepest Ascent",
     "Lesson 2.16",
     [
         "Packing partial derivatives into a vector: the gradient ∇f.",
         "Geometric meaning: the gradient arrow always points directly toward the steepest uphill climb.",
         "Magnitude of the gradient: how steep the hill is at that exact coordinate.",
         "Negative gradient: pointing directly in the opposite direction—the fastest way downhill toward minimum error."
     ],
     "Assuming the gradient points downhill; the gradient points uphill, so we must subtract it to go down!",
     "Compute the gradient vector for a 2D bowl function at point (3, 4) and print the downhill direction.",
     "VectorCore: Gradient vector computation."),

    (18, "Gradient Descent Intuition: Walking Downhill",
     "Lesson 2.17",
     [
         "The fog on the mountain metaphor: finding your way down to the valley by feeling the slope under your boots.",
         "The update formula: new_position = old_position - (learning_rate * gradient).",
         "The learning rate (step size): taking small careful steps vs large reckless leaps.",
         "Visualizing convergence: watching parameters step closer and closer to the bottom of the bowl."
     ],
     "Setting the learning rate too large, causing the algorithm to oscillate wildly and explode to infinity.",
     "Implement a 20-step gradient descent loop in Python that finds the minimum of f(x) = (x - 4)^2.",
     "VectorCore: 1D Gradient descent optimizer."),

    (19, "Probability Basics: Sample Spaces & Events",
     "Phase 0",
     [
         "Quantifying uncertainty: assigning numbers between 0.0 (impossible) and 1.0 (certain) to outcomes.",
         "Sample spaces: the complete collection of all possible outcomes.",
         "Events: specific outcomes we are interested in measuring.",
         "Probability axioms: probabilities must sum to 1.0; no probability can ever be negative."
     ],
     "Assigning probabilities that sum to more than 1.0, breaking fundamental probability laws.",
     "Simulate rolling two dice 10,000 times in Python and verify that the empirical probabilities match theory.",
     "VectorCore: Probability simulation."),

    (20, "Independent vs Dependent Events & Conditional Prob",
     "Lesson 2.19",
     [
         "Independent events: when one outcome has zero influence on another (like coin flips).",
         "Dependent events: when the outcome of the first event changes the odds of the second (drawing cards without replacement).",
         "Conditional probability P(A|B): what are the odds of A, given that we already know B happened?",
         "AI context: predicting the next word given the preceding sentence context."
     ],
     "Treating dependent events as independent, leading to massive underestimation of risk.",
     "Calculate the conditional probability that an email is spam given that it contains the word 'free'.",
     "VectorCore: Conditional probability models."),

    (21, "Mean, Median & Mode: Central Tendency",
     "Lesson 2.19",
     [
         "Summarizing datasets: finding the center of a group of numbers.",
         "The Mean (average): summing all values and dividing by total count.",
         "The Median: the physical middle value when numbers are sorted in order.",
         "The Mode: the most frequently occurring value in the dataset.",
         "Handling outliers: why median is far more reliable than mean when measuring response latency."
     ],
     "Relying solely on the average latency of an API, hiding the fact that 5% of users experience 10-second lag.",
     "Write a function that calculates mean, median, and 95th percentile latency from a list of request times.",
     "VectorCore: Latency summary statistics."),

    (22, "Variance & Standard Deviation: Spread of Data",
     "Lesson 2.21",
     [
         "Measuring spread: how dispersed numbers are around their average.",
         "Variance: the average squared difference from the mean.",
         "Standard deviation: the square root of variance, returning the spread back to original units.",
         "Consistent systems: why low standard deviation is the hallmark of reliable software systems."
     ],
     "Forgetting to take the square root of variance, confusing squared units with actual data units.",
     "Implement variance and standard deviation from scratch in pure Python without using math libraries.",
     "VectorCore: Distribution dispersion metrics."),

    (23, "Normal Gaussian Distribution: The Bell Curve",
     "Lesson 2.22",
     [
         "The classic bell curve: why natural processes and measurement errors cluster around the center.",
         "Mean (center) and Standard Deviation (width) as the two parameters defining the entire curve.",
         "The 68-95-99.7 empirical rule: what percentage of data falls within 1, 2, and 3 standard deviations.",
         "Standardizing scores (Z-scores): converting arbitrary numbers into distance from the mean."
     ],
     "Assuming all software metrics follow normal curves, when server traffic and response times are heavily skewed.",
     "Generate 1,000 normal random samples in Python and verify that ~68% fall within 1 standard deviation.",
     "VectorCore: Statistical distributions."),

    (24, "Softmax Function: Numbers to Probabilities",
     "Lesson 2.3, Lesson 2.20",
     [
         "The challenge of raw model outputs (logits): unconstrained positive and negative real numbers.",
         "The Softmax formula: exponentiating numbers to make them strictly positive, then dividing by their sum.",
         "Two magical properties: all outputs are between 0 and 1, and the entire output array sums to exactly 1.0.",
         "The temperature parameter: controlling whether probabilities are sharp (confident) or smooth (creative)."
     ],
     "Numerical overflow: exponentiating large numbers like e^1000 causing float overflow to infinity.",
     "Implement a numerically stable softmax function that subtracts the maximum logit before exponentiating.",
     "VectorCore: Logit-to-probability converter."),

    (25, "Cross-Entropy Loss: Measuring Prediction Error",
     "Lesson 2.24",
     [
         "Loss functions: mathematical scorecards that tell an AI model how wrong its predictions were.",
         "Cross-entropy loss: comparing the predicted probability distribution against the true target label.",
         "The negative log penalty: heavily penalizing models that are confidently wrong.",
         "Why cross-entropy guides neural networks to learn faster and more accurately than squared error."
     ],
     "Computing log(0.0) when a predicted probability is 0, which crashes with a math domain error.",
     "Calculate cross-entropy loss for two scenarios: a confident correct guess vs a confident incorrect guess.",
     "VectorCore: Classification loss calculation.")
]

print(f"Loaded {len(PHASE_2_BEGINNER)} Phase 2 beginner lesson specs.")

# Phase 3: 30 beginner lessons
PHASE_3_BEGINNER = [
    (1, "Algorithmic Complexity & Big-O Intuition",
     "Phase 0, Phase 2",
     [
         "Why algorithmic efficiency matters: code that works on 10 items can completely freeze on 1,000,000 items.",
         "Measuring scale, not clock time: why benchmarking milliseconds is misleading across different hardware.",
         "The Big-O notation mental model: describing how runtime grows as input size N increases.",
         "The Big-O hierarchy: O(1) constant, O(log N) logarithmic, O(N) linear, O(N log N), O(N^2) quadratic."
     ],
     "Confusing the best-case runtime with worst-case or average-case Big-O guarantees.",
     "Analyze three code snippets and write down their exact Big-O time and space complexity with justification.",
     "StreamBuffer: Complexity auditing."),

    (2, "Constant O(1) vs Linear O(N) Complexity",
     "Lesson 3.1",
     [
         "Constant time O(1): operations that take the exact same amount of time regardless of dataset size.",
         "Examples of O(1): looking up an array index, appending to a list, looking up a key in a dictionary.",
         "Linear time O(N): operations whose execution time doubles whenever the input dataset doubles.",
         "Examples of O(N): scanning an unsorted list with for, calculating sum(list), counting character matches."
     ],
     "Accidentally placing an O(N) operation inside a loop, unintentionally creating a quadratic O(N^2) disaster.",
     "Benchmark array index lookup vs linear scan across 10, 1,000, and 1,000,000 elements to prove O(1) vs O(N).",
     "StreamBuffer: Constant-time buffer indexing."),

    (3, "Quadratic O(N^2) & The Nested Loop Trap",
     "Lesson 3.2",
     [
         "The nested loop trap: running a loop of size N inside another loop of size N.",
         "Why O(N^2) breaks at scale: processing 1,000 items takes 1,000,000 steps; 100,000 items takes 10 billion steps!",
         "Common hidden nested loops: calling item in list or list.count() inside an outer for loop.",
         "How to identify quadratic bottlenecks in code reviews before they reach production."
     ],
     "Writing nested loops to check for duplicates across two lists instead of using a hash set.",
     "Take an O(N^2) duplicate finder and measure its runtime on a 50,000-item list.",
     "StreamBuffer: Identifying algorithmic bottlenecks."),

    (4, "Logarithmic O(log N) & Divide and Conquer",
     "Lesson 3.1",
     [
         "The power of cutting problems in half: why dividing search spaces is so blindingly fast.",
         "The phone book analogy: finding a name by opening to the middle and discarding half the book.",
         "Logarithmic scaling: searching 1,000 items takes 10 steps; searching 1,000,000,000 items takes only 30 steps!",
         "Identifying divide-and-conquer algorithms in real-world systems (binary search, balanced trees)."
     ],
     "Applying binary search to an unsorted list without sorting it first, producing completely wrong results.",
     "Calculate how many comparison steps binary search needs to locate an item in a dataset of 4 billion records.",
     "StreamBuffer: Scalable search mechanics."),

    (5, "Two Pointers: Opposing Direction Converging",
     "Lesson 3.2",
     [
         "The two-pointer technique: using two coordinate indices simultaneously to inspect an array.",
         "Opposing pointers: starting Left at index 0 and Right at index N-1, stepping inward toward each other.",
         "Solving Two-Sum on sorted arrays: moving Left when sum is too small, moving Right when sum is too large.",
         "Why two pointers turns an O(N^2) brute-force nested search into an optimal single-pass O(N) solution."
     ],
     "Pointer crossing bugs: forgetting the while left < right boundary condition, causing pointers to cross.",
     "Implement two-pointer Two-Sum on a sorted list and prove it finds target pairs in single-pass O(N) time.",
     "StreamBuffer: Paired token matching."),

    (6, "Two Pointers: Fast & Slow Pointer (Cycle Detection)",
     "Lesson 3.5",
     [
         "Same-direction pointers: two pointers starting at the beginning and moving forward at different speeds.",
         "The Tortoise and Hare algorithm: slow pointer moves 1 step while fast pointer moves 2 steps.",
         "Cycle detection intuition: if a runner and a walker circle a closed track, the runner will eventually lap the walker.",
         "Applications: detecting infinite loops, finding list midpoints, and cycle detection in state graphs."
     ],
     "Dereferencing null pointer in fast.next.next without checking if fast or fast.next is None.",
     "Implement Floyd's cycle-finding algorithm to detect whether a linked sequence contains an infinite loop.",
     "StreamBuffer: Agent loop cycle detection."),

    (7, "Sliding Window: Fixed Size Subarrays",
     "Lesson 3.2",
     [
         "The sliding window paradigm: maintaining a visible slice of size K across a continuous stream of data.",
         "Incremental updates: sliding the window by adding the new element on the right and subtracting the old on left.",
         "Why sliding windows achieve O(N): avoiding re-calculating the entire window from scratch on every step.",
         "Practical applications: calculating rolling average CPU usage, moving token limits, and network throughput."
     ],
     "Recomputing sum(window) inside every step, degenerating the algorithm back to O(N * K).",
     "Write a function that calculates the maximum sum of any contiguous subarray of fixed length K in O(N) time.",
     "StreamBuffer: Rolling metrics sliding window."),

    (8, "Sliding Window: Dynamic Size Subarrays",
     "Lesson 3.7",
     [
         "Flexible windows: expanding the right edge until a condition is met, then contracting the left edge.",
         "The dynamic pattern: expand right to explore, shrink left to satisfy constraints.",
         "Tracking window state: keeping character frequency counts or running sums inside the window.",
         "Canonical problems: shortest subarray with sum >= target, longest substring without repeating characters."
     ],
     "Shrinking the left pointer past the right pointer or failing to update the window state dictionary.",
     "Find the length of the longest substring without repeating characters using a dynamic sliding window in O(N).",
     "StreamBuffer: Variable-length context buffer slicing."),

    (9, "Prefix Sums: Range Sum Query in O(1)",
     "Lesson 3.2",
     [
         "Pre-computing cumulative sums: building an array where prefix[i] stores the sum of all elements up to i.",
         "Instant range queries: calculating the sum between index L and R in exact O(1) time: prefix[R] - prefix[L-1].",
         "Trading memory for speed: spending O(N) storage to make all future range calculations instantaneous.",
         "Applications: computing cumulative cost over time windows and fast 2D image box filtering."
     ],
     "Off-by-one errors when querying ranges that start at index 0, requiring a padded 0 at prefix[0].",
     "Build a PrefixSum class that takes an array of numbers and answers 1,000 range sum queries in O(1) each.",
     "StreamBuffer: Rapid range query calculations."),

    (10, "Frequency Maps: Counting Elements with Dicts",
     "Phase 0 (Lesson 0.13), Lesson 3.2",
     [
         "Counting frequencies: using hash maps to track how many times each item appears in a collection.",
         "The Python collections.Counter helper: counting elements in one line with high performance.",
         "Finding most common elements: getting top-K frequencies efficiently.",
         "Detecting anagrams and character distributions in text streams."
     ],
     "Looking up keys without default values, triggering KeyError when encountering new elements.",
     "Given a stream of user messages, count word frequencies and return the top 5 most common words.",
     "StreamBuffer: Stream token frequency analyzer."),

    (11, "Binary Search: Standard Sorted Array Lookup",
     "Lesson 3.4",
     [
         "Binary search requirements: why the underlying collection MUST be sorted before binary search can work.",
         "The three pointers: low, mid, and high.",
         "Avoiding integer overflow: calculating mid as low + (high - low) // 2.",
         "Updating bounds: mid + 1 when target is larger, mid - 1 when target is smaller."
     ],
     "Forgetting to add or subtract 1 when updating high and low, causing infinite while loops.",
     "Implement binary search from memory in pure Python and prove it finds targets in a 1,000,000-item sorted list.",
     "StreamBuffer: Fast log index lookup."),

    (12, "Binary Search: Finding Lower and Upper Bounds",
     "Lesson 3.11",
     [
         "Handling duplicates in sorted data: finding the first or last occurrence of a target value.",
         "Lower bound: finding the smallest index where array[index] >= target.",
         "Upper bound: finding the smallest index where array[index] > target.",
         "Range queries: counting how many times a value appears in a sorted list using upper_bound - lower_bound."
     ],
     "Returning the first match found without continuing search toward the left boundary when duplicates exist.",
     "Find the starting and ending index of a target value in a sorted array containing duplicate numbers.",
     "StreamBuffer: Timestamp boundary searches."),

    (13, "Binary Search on Solution Space",
     "Lesson 3.11",
     [
         "Searching without an array: using binary search to find an optimal answer value directly.",
         "Monotonic condition: if an answer X is possible, all values > X are also possible (or vice versa).",
         "The feasibility function: a helper function that checks can_fulfill(capacity) in O(N).",
         "Canonical problems: capacity to ship packages within D days, splitting arrays to minimize largest sum."
     ],
     "Setting improper search range boundaries (low and high) that fail to include the true optimal solution.",
     "Calculate the minimum rate limit bucket capacity needed to process a stream of jobs within a fixed deadline.",
     "StreamBuffer: Adaptive rate limit capacity tuning."),

    (14, "Recursion: Base Cases & Call Stack Frames",
     "Phase 0 (Lesson 0.8)",
     [
         "What is recursion: a function that solves a problem by calling itself on smaller sub-problems.",
         "The two essential parts: the Base Case (when to stop) and the Recursive Case (the step forward).",
         "The Call Stack: how Python allocates a new stack frame in memory for every recursive invocation.",
         "Recursion depth limits: understanding why Python stops at 1,000 nested calls to prevent stack overflow."
     ],
     "Omitting or incorrectly defining the base case, triggering RecursionError: maximum recursion depth exceeded.",
     "Write a recursive function that reverses a string and visualize its call stack frames on paper.",
     "StreamBuffer: Recursive document parsing."),

    (15, "Tree Traversals: Pre-Order, In-Order, Post-Order",
     "Lesson 3.14",
     [
         "Hierarchical data structures: trees composed of root, child nodes, and leaves.",
         "Binary trees: trees where each node has at most two children (left and right).",
         "Pre-Order traversal (Root, Left, Right): useful for copying or serializing trees.",
         "In-Order traversal (Left, Root, Right): visiting sorted binary search trees in ascending numerical order.",
         "Post-Order traversal (Left, Right, Root): useful for deleting trees or calculating bottom-up sizes."
     ],
     "Failing to check if current node is None before attempting to access node.left or node.right.",
     "Construct a simple 5-node binary tree and implement all three depth-first traversal orders.",
     "StreamBuffer: AST node traversal."),

    (16, "Breadth-First Search (BFS) with Queues",
     "Lesson 3.15",
     [
         "Level-by-level exploration: visiting all immediate neighbors before moving to the next depth tier.",
         "The Queue data structure (FIFO): using collections.deque for fast popleft() operations.",
         "Shortest path guarantee: why BFS is mathematically guaranteed to find the shortest path in unweighted graphs.",
         "Tracking visited nodes: preventing infinite loops when graphs contain cycles."
     ],
     "Using a Python list as a queue and calling pop(0), which is an O(N) memory shift instead of O(1).",
     "Implement BFS on a maze grid to find the shortest path from start to goal coordinates.",
     "StreamBuffer: Shortest path routing."),

    (17, "Depth-First Search (DFS) with Stacks",
     "Lesson 3.14, Lesson 3.15",
     [
         "Exploring as deep as possible before backtracking: the Depth-First Search strategy.",
         "DFS using recursion: utilizing the call stack implicitly.",
         "Iterative DFS: using an explicit Stack data structure (LIFO) with while stack:.",
         "Applications: finding connected components, detecting cycles, and path existence queries."
     ],
     "Allowing DFS to run on graphs with cycles without a visited set, leading to stack overflow crashes.",
     "Implement iterative DFS using a Python list as a stack to verify reachability between two system nodes.",
     "StreamBuffer: Graph connectivity exploration."),

    (18, "Topological Sorting: Course Prerequisites",
     "Lesson 3.16, Lesson 3.17",
     [
         "Directed Acyclic Graphs (DAGs): directed networks without circular dependency loops.",
         "Topological order: a linear ordering of vertices such that every directed edge u -> v comes before v.",
         "Kahn's Algorithm: tracking in-degrees (number of incoming prerequisites) and processing 0-in-degree nodes.",
         "Detecting impossible cyclic dependencies: when not all nodes can be processed (e.g. A needs B, B needs A)."
     ],
     "Attempting to topologically sort a graph that contains a cycle, causing dependency resolution deadlock.",
     "Given a list of tasks with prerequisites, compute a valid build order or raise an error if a circular cycle exists.",
     "StreamBuffer: Build dependency ordering."),

    (19, "Hash Collisions & Hash Table Chaining",
     "Phase 0 (Lesson 0.13), Lesson 3.2",
     [
         "How hash tables work: converting arbitrary keys into array bucket indices using a hash function.",
         "The Pigeonhole Principle: why multiple different keys will eventually hash to the exact same bucket.",
         "Separate Chaining: storing collided keys in a linked list or small array inside the bucket.",
         "Load factor: when to resize the underlying bucket array to maintain O(1) average lookup performance."
     ],
     "Writing a poor hash function that maps all keys to bucket 0, degrading hash map performance to O(N).",
     "Build a simplified hash map in Python with 10 buckets that handles collisions via separate chaining.",
     "StreamBuffer: Custom hash storage engines."),

    (20, "Stack Applications: Valid Parentheses Checking",
     "Lesson 3.2",
     [
         "The Stack LIFO principle (Last In, First Out): pushing items on top and popping from the top.",
         "Matching nested structures: opening brackets push, closing brackets pop and verify match.",
         "Checking balanced brackets: verifying (), [], and {} in code, JSON, and math expressions.",
         "Handling mismatched, unclosed, or premature closing brackets."
     ],
     "Popping from an empty stack when encountering an unexpected closing bracket at the start of input.",
     "Implement a syntax validator that checks if nested brackets in an input string are properly matched.",
     "StreamBuffer: Code and JSON bracket validator."),

    (21, "Queue Applications: Sliding Window Buffers",
     "Lesson 3.7, Lesson 3.16",
     [
         "The Queue FIFO principle (First In, First Out): adding to the back, removing from the front.",
         "Circular ring buffers: fixed-capacity queues that overwrite the oldest item when full.",
         "Producer-Consumer pattern: decoupling data producers from slower data processors via a queue.",
         "Queue thread safety preview: preventing data corruption when multiple workers access a queue."
     ],
     "Allowing an unbounded queue to grow indefinitely under high input traffic, exhausting server RAM.",
     "Build a CircularBuffer class of fixed capacity 5 that safely records the most recent 5 events in order.",
     "StreamBuffer: Fixed-memory stream buffer."),

    (22, "Heap / Priority Queue: Finding Top-K Elements",
     "Lesson 3.2",
     [
         "Priority Queues: retrieving the highest (or lowest) priority item in O(log N) time.",
         "Binary Heaps: min-heaps (parent <= children) vs max-heaps (parent >= children).",
         "The heapq module in Python: heappush(), heappop(), and nlargest().",
         "The Top-K pattern: finding the K largest elements in a stream of N items using a min-heap of size K in O(N log K)."
     ],
     "Sorting the entire N-element list (O(N log N)) just to find the top 5 elements, wasting CPU time.",
     "Find the 10 highest-scoring documents from an endless stream of 1,000,000 search results using a min-heap.",
     "StreamBuffer: Real-time top-K scoring buffer."),

    (23, "Greedy Algorithms: Interval Scheduling",
     "Lesson 3.2",
     [
         "The Greedy choice property: making the locally optimal decision at each step to find a global optimum.",
         "When greedy works vs when it fails: why greedy fails for the 0/1 knapsack problem but works for intervals.",
         "Interval scheduling: maximizing the number of non-overlapping meetings in a conference room.",
         "The optimal greedy strategy: sorting intervals by their earliest end times."
     ],
     "Sorting intervals by start time instead of end time, which fails to maximize scheduled meetings.",
     "Given a list of start and end times for tasks, compute the maximum number of non-overlapping tasks you can run.",
     "StreamBuffer: Task schedule optimizer."),

    (24, "Backtracking: Generating Subsets & Combinations",
     "Lesson 3.14",
     [
         "Exploring decision trees: making a choice, exploring consequences, and undoing the choice (backtracking).",
         "The three steps of backtracking: Choose, Explore, Un-choose.",
         "Generating all subsets (the power set): branching on whether to include or exclude each element.",
         "Combinations and permutations: systematically building valid configurations without duplicate work."
     ],
     "Forgetting to un-choose (pop) the candidate from the current path list before returning from recursion.",
     "Generate all unique subsets of a 3-element list using the recursive choose-explore-unchoose pattern.",
     "StreamBuffer: Combinatorial prompt permuter."),

    (25, "Dynamic Programming: Memoization (Top-Down)",
     "Lesson 3.14",
     [
         "Why naive recursion repeats work: Fibonacci numbers recalculating the same sub-problems exponentially.",
         "Overlapping sub-problems: noticing that identical calculations occur hundreds of times across branches.",
         "Memoization (Top-Down DP): caching the return value of a recursive function in a dictionary.",
         "Transforming exponential O(2^N) algorithms into linear O(N) algorithms effortlessly."
     ],
     "Using mutable unhashable objects (like lists) as keys in the memoization cache dictionary.",
     "Implement top-down Fibonacci with a dictionary cache and compute fib(100) instantly without recursion errors.",
     "StreamBuffer: Memoized sub-problem cache."),

    (26, "Dynamic Programming: Tabulation (Bottom-Up)",
     "Lesson 3.25",
     [
         "Bottom-Up DP: building solutions iteratively starting from the smallest base cases up to N.",
         "The DP table: using a 1D array where table[i] represents the answer for sub-problem of size i.",
         "Eliminating recursion overhead: saving stack frame memory and avoiding recursion depth limits entirely.",
         "Transition relations: writing the recurrence formula that computes table[i] from earlier cells."
     ],
     "Iterating in the wrong direction or accessing uninitialized table cells that haven't been computed yet.",
     "Implement bottom-up tabulation to compute Fibonacci numbers in iterative O(N) time with 0 recursion.",
     "StreamBuffer: Tabulation DP engine."),

    (27, "1D Dynamic Programming: Climbing Stairs & House Robber",
     "Lesson 3.26",
     [
         "The Climbing Stairs problem: how many ways to reach step N taking 1 or 2 steps at a time?",
         "The House Robber problem: maximizing loot without robbing two adjacent houses.",
         "Formulating the recurrence: dp[i] = max(dp[i-1], dp[i-2] + loot[i]).",
         "Space optimization: reducing memory from O(N) array down to O(1) by storing only the last two values."
     ],
     "Failing to handle edge cases for small inputs (like arrays with 0, 1, or 2 elements).",
     "Solve the House Robber problem with O(1) space optimization and verify maximum loot on test arrays.",
     "StreamBuffer: Optimal sequential selection."),

    (28, "2D Dynamic Programming: Grid Unique Paths",
     "Lesson 3.26",
     [
         "Extending DP to 2D grids: counting unique paths from top-left (0, 0) to bottom-right (M-1, N-1).",
         "Grid transitions: dp[row][col] = dp[row-1][col] + dp[row][col-1] (moving only right and down).",
         "Base cases: setting borders (top row and left column) to 1.",
         "Adding obstacles: zeroing out paths that hit blocked grid cells."
     ],
     "Swapping row and column coordinates when indexing 2D arrays, causing out-of-bounds errors.",
     "Write a function that counts unique paths across an M x N grid with obstacles in O(M * N) time.",
     "StreamBuffer: Grid traversal path optimizer."),

    (29, "Monotonic Stack: Next Greater Element",
     "Lesson 3.20",
     [
         "What is a monotonic stack: a stack where elements are strictly kept in increasing or decreasing order.",
         "The Next Greater Element problem: finding the first element to the right that is strictly larger.",
         "How it works: popping smaller elements off the stack as soon as a larger element arrives.",
         "Why it is O(N): every element is pushed onto the stack once and popped at most once."
     ],
     "Pushing values instead of indices onto the stack when the problem requires tracking index distances.",
     "Find the next greater element for every number in an array using a monotonic stack in single-pass O(N).",
     "StreamBuffer: Monotonic trend detection."),

    (30, "String Matching: Knuth-Morris-Pratt (KMP) Prefix Table",
     "Lesson 3.2, Phase 0 (Lesson 0.3)",
     [
         "The brute-force string search limitation: checking patterns against text takes O(N * M) time.",
         "The core insight of KMP: never re-examine characters in text that have already matched.",
         "The Longest Prefix Suffix (LPS) table: pre-computing pattern self-overlaps.",
         "Achieving linear time O(N + M) string search across massive documents and log files."
     ],
     "Incorrectly indexing the LPS table, causing the search pointer to backtrack too far or skip matches.",
     "Construct the LPS table for a search pattern on paper, then implement the KMP search algorithm in Python.",
     "StreamBuffer: Linear-time pattern search.")
]

print(f"Loaded {len(PHASE_3_BEGINNER)} Phase 3 beginner lesson specs.")
