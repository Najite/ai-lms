-- ==============================================================================
-- Sync Modernized AI-Native Curriculum to Supabase
-- ==============================================================================

UPDATE curriculum_phases SET title = 'Phase 0: Programming Foundations & Terminal Fluency', description = 'Beginner-friendly computing fundamentals: writing clean Python, command-line mastery, virtual environments, Git branching, JSON handling, and making your first AI API calls.' WHERE id = 'phase-0';
UPDATE curriculum_phases SET title = 'Phase 1: Software Craftsmanship & Data Contracts', description = 'Building production software: object-oriented design, static typing, Pydantic data validation schemas, automated unit testing with pytest, and structured AI outputs.' WHERE id = 'phase-1';
UPDATE curriculum_phases SET title = 'Phase 2: Intuitive Math, Vectors & Numerical Computing', description = 'Visual mathematics for AI: 2D/3D coordinates, vectors, dot products, cosine similarity, dimensions, token embeddings, and NumPy array computing from scratch.' WHERE id = 'phase-2';
UPDATE curriculum_phases SET title = 'Phase 3: Data Structures & Practical Problem Solving', description = 'Algorithmic mastery: hash maps, sliding windows, two-pointers, stacks, queues, trees, and text tokenization algorithms required for data pipelines.' WHERE id = 'phase-3';
UPDATE curriculum_phases SET title = 'Phase 4: Web Architecture, HTTP & Asynchronous APIs', description = 'How modern web systems communicate: HTTP/1.1 and HTTP/2, REST APIs, Python asyncio event loops, Server-Sent Events (SSE) for token streaming, and Docker containerization.' WHERE id = 'phase-4';
UPDATE curriculum_phases SET title = 'Phase 5: Relational Databases, PostgreSQL & Semantic Caching', description = 'Persistent data systems: relational modeling, SQL optimization, PostgreSQL indexing, connection pooling, ACID transactions, and Redis semantic caching for AI responses.' WHERE id = 'phase-5';
UPDATE curriculum_phases SET title = 'Phase 10: Production RAG, Hybrid Retrieval & pgvector', description = 'Production RAG architectures: semantic chunking, PostgreSQL pgvector with HNSW indexing, hybrid sparse (BM25) + dense search, cross-encoder re-ranking, and grounded citation pipelines.' WHERE id = 'phase-10';
UPDATE curriculum_phases SET title = 'Phase 11: AI Evals, Observability & OpenTelemetry', description = 'Testing and observing generative AI: LLM-as-a-judge evaluation frameworks (Ragas/DeepEval), synthetic test sets, OpenTelemetry distributed tracing (Langfuse), latency (TTFT), and cost telemetry.' WHERE id = 'phase-11';
UPDATE curriculum_phases SET title = 'Phase 12: Autonomous Agents, State Machines & Model Context Protocol', description = 'Stateful autonomous agent systems: ReAct reasoning loops, tool calling interfaces, LangGraph cyclic state machines, Model Context Protocol (MCP) tool integration, and secure sandbox execution.' WHERE id = 'phase-12';

-- 2. Update Modernized Phase 0 Nodes

UPDATE curriculum_nodes 
SET title = 'Lesson 0.1: Variables, Data Types & The Interpreter', 
    subtitle = 'Prerequisites: None', 
    cs_foundation = 'Prerequisites: None | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.1: Variables, Data Types & The Interpreter

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: None
- **Subtopics**:
  - `0.1.1` What is physical computer memory: RAM as numbered storage boxes.
  - `0.1.2` Variables as named sticky notes: assigning integers, floats, strings, and booleans.
  - `0.1.3` How Python''s interpreter runs code line-by-line in real time.
  - `0.1.4` Dynamic types: checking variable types with type() and changing types safely.
- **Key Failure Modes & Edge Cases**: Mixing incompatible data types (like adding text to a number), which triggers a TypeError.
- **Verification & Mastery Check**: Write a script that creates variables for an AI model''s name, version, and cost, and print their types.
- **Project Application**: PromptCLI: Storing user prompt settings and configurations.'
WHERE id = 'node-0-1';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.2: Expressions, Operators & Precedence', 
    subtitle = 'Prerequisites: Lesson 0.1', 
    cs_foundation = 'Prerequisites: Lesson 0.1 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.2: Expressions, Operators & Precedence

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.1
- **Subtopics**:
  - `0.2.1` Math operators in code: addition, subtraction, multiplication, division, and modulo remainder.
  - `0.2.2` Order of operations (PEMDAS): how Python prioritizes math calculations.
  - `0.2.3` Comparison operators: checking if values are equal, greater than, or less than.
  - `0.2.4` Boolean logic: combining decisions with and, or, and not.
- **Key Failure Modes & Edge Cases**: Confusing assignment (=) with equality comparison (==), causing syntax crashes.
- **Verification & Mastery Check**: Calculate the total token cost of an AI request using math operators and print the rounded result.
- **Project Application**: PromptCLI: Token budget calculation utility.'
WHERE id = 'node-0-2';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.3: String Indexing, Slicing & Manipulation', 
    subtitle = 'Prerequisites: Lesson 0.1', 
    cs_foundation = 'Prerequisites: Lesson 0.1 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.3: String Indexing, Slicing & Manipulation

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.1
- **Subtopics**:
  - `0.3.1` Strings as sequences: character positions starting from index 0.
  - `0.3.2` Negative indexing: easily getting the last characters of a word with -1.
  - `0.3.3` Slicing strings: cutting out substrings using [start:stop:step].
  - `0.3.4` Helpful string tools: stripping whitespace, changing case, splitting sentences, and joining words.
- **Key Failure Modes & Edge Cases**: Asking for an index beyond the end of the text, causing an IndexError.
- **Verification & Mastery Check**: Clean a messy user prompt string by stripping unwanted spaces and extracting the first 50 characters.
- **Project Application**: PromptCLI: Prompt cleaning and input truncation engine.'
WHERE id = 'node-0-3';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.4: Conditional Branching: if, elif, else', 
    subtitle = 'Prerequisites: Lesson 0.2', 
    cs_foundation = 'Prerequisites: Lesson 0.2 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.4: Conditional Branching: if, elif, else

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.2
- **Subtopics**:
  - `0.4.1` Making decisions in code: the if statement and boolean tests.
  - `0.4.2` Alternative paths: using elif for multiple choices and else for fallbacks.
  - `0.4.3` Python indentation rules: using consistent 4 spaces to define code blocks.
  - `0.4.4` Truthiness: understanding which values count as True and which count as False.
- **Key Failure Modes & Edge Cases**: Inconsistent indentation mixing tabs and spaces, triggering IndentationError.
- **Verification & Mastery Check**: Write a decision tree that routes a user prompt to either a fast model or a smart model based on length.
- **Project Application**: PromptCLI: Smart model routing logic.'
WHERE id = 'node-0-4';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.5: While Loops & Loop Invariants', 
    subtitle = 'Prerequisites: Lesson 0.4', 
    cs_foundation = 'Prerequisites: Lesson 0.4 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.5: While Loops & Loop Invariants

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.4
- **Subtopics**:
  - `0.5.1` Repetition in programming: repeating actions while a condition remains True.
  - `0.5.2` Loop counters: updating variables to prevent programs from running forever.
  - `0.5.3` Sentinel loops: draining a list of items until none remain.
  - `0.5.4` Understanding loop safety: ensuring your loop always reaches a stopping point.
- **Key Failure Modes & Edge Cases**: Forgetting to increment the loop counter, causing an infinite loop that freezes your terminal.
- **Verification & Mastery Check**: Write a retry loop that attempts an imaginary network connection up to 3 times before giving up.
- **Project Application**: PromptCLI: Network retry loop for API requests.'
WHERE id = 'node-0-5';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.6: For Loops & The range() Generator', 
    subtitle = 'Prerequisites: Lesson 0.5', 
    cs_foundation = 'Prerequisites: Lesson 0.5 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.6: For Loops & The range() Generator

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.5
- **Subtopics**:
  - `0.6.1` The for loop: iterating through every item in a collection automatically.
  - `0.6.2` The range() function: generating sequential numbers on demand without wasting memory.
  - `0.6.3` Looping with indexes: using enumerate() to track both the position and the item.
  - `0.6.4` Nested loops: running an inner loop inside an outer loop cleanly.
- **Key Failure Modes & Edge Cases**: Confusing range(1, 5) which produces 1, 2, 3, 4 with numbers 1 through 5.
- **Verification & Mastery Check**: Iterate over a list of 5 user prompts, numbering each one and printing its character count.
- **Project Application**: PromptCLI: Batch prompt processing loop.'
WHERE id = 'node-0-6';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.7: Loop Control: break, continue & else', 
    subtitle = 'Prerequisites: Lesson 0.6', 
    cs_foundation = 'Prerequisites: Lesson 0.6 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.7: Loop Control: break, continue & else

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.6
- **Subtopics**:
  - `0.7.1` Early exits: stopping a loop immediately using the break keyword.
  - `0.7.2` Skipping turns: jumping to the next iteration using the continue keyword.
  - `0.7.3` The loop else clause: running fallback code only when a loop finishes without breaking.
  - `0.7.4` Practical search patterns: finding an item in a list and exiting as soon as it is found.
- **Key Failure Modes & Edge Cases**: Placing break outside of a loop or conditional, causing immediate unexpected loop termination.
- **Verification & Mastery Check**: Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.
- **Project Application**: PromptCLI: Content moderation scanner.'
WHERE id = 'node-0-7';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.8: Functions: Parameters, Arguments & Returns', 
    subtitle = 'Prerequisites: Lesson 0.4', 
    cs_foundation = 'Prerequisites: Lesson 0.4 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.8: Functions: Parameters, Arguments & Returns

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.4
- **Subtopics**:
  - `0.8.1` Packaging reusable code: defining functions with def and calling them.
  - `0.8.2` Passing data into functions: positional parameters and keyword arguments.
  - `0.8.3` Default values: setting safe defaults for optional parameters.
  - `0.8.4` Returning values: sending results back to the caller using return.
- **Key Failure Modes & Edge Cases**: Forgetting to return a value, causing the function to silently evaluate to None.
- **Verification & Mastery Check**: Write a function format_prompt(template, topic, style=''concise'') that returns a formatted AI prompt.
- **Project Application**: PromptCLI: Core prompt templating engine.'
WHERE id = 'node-0-8';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.9: Variable Scope: Local, Global & Enclosing', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.9: Variable Scope: Local, Global & Enclosing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.9.1` Scope boundaries: why variables created inside a function cannot be seen outside.
  - `0.9.2` The LEGB lookup order: how Python searches for variable names.
  - `0.9.3` Global variables: when to read them and why modifying them from functions is risky.
  - `0.9.4` Clean function design: passing arguments explicitly rather than relying on global state.
- **Key Failure Modes & Edge Cases**: UnboundLocalError caused by trying to modify a global variable inside a function without declaring it.
- **Verification & Mastery Check**: Refactor code that relies on 3 global variables into pure functions that take inputs and return outputs.
- **Project Application**: PromptCLI: Configuration isolation.'
WHERE id = 'node-0-9';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.10: Lists: Dynamic Sequential Arrays', 
    subtitle = 'Prerequisites: Lesson 0.3', 
    cs_foundation = 'Prerequisites: Lesson 0.3 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.10: Lists: Dynamic Sequential Arrays

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.3
- **Subtopics**:
  - `0.10.1` Ordered collections: storing multiple items in a Python list.
  - `0.10.2` Adding and removing items: append(), extend(), insert(), and pop().
  - `0.10.3` Searching and counting: using in, index(), and count().
  - `0.10.4` Sorting lists: sorting in-place with sort() vs creating a new list with sorted().
- **Key Failure Modes & Edge Cases**: Modifying a list while looping over it, causing items to be skipped unintentionally.
- **Verification & Mastery Check**: Build a history tracker that appends user messages, limits history to 10 items, and prints them in order.
- **Project Application**: PromptCLI: Conversation history list manager.'
WHERE id = 'node-0-10';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.11: List Comprehensions & Transforms', 
    subtitle = 'Prerequisites: Lesson 0.10', 
    cs_foundation = 'Prerequisites: Lesson 0.10 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.11: List Comprehensions & Transforms

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.11.1` Readable transforms: replacing multi-line for loops with single-line comprehensions.
  - `0.11.2` Filtering with if: keeping only items that match specific criteria.
  - `0.11.3` Comprehension syntax: [expression for item in iterable if condition].
  - `0.11.4` Performance benefits: why list comprehensions run faster than manual append loops.
- **Key Failure Modes & Edge Cases**: Writing overly complex nested comprehensions that are unreadable to other engineers.
- **Verification & Mastery Check**: Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.
- **Project Application**: PromptCLI: High-speed prompt batch normalization.'
WHERE id = 'node-0-11';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.12: Tuples: Fixed Immutable Sequences', 
    subtitle = 'Prerequisites: Lesson 0.10', 
    cs_foundation = 'Prerequisites: Lesson 0.10 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.12: Tuples: Fixed Immutable Sequences

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.12.1` Immutable collections: creating fixed groups of items with parentheses ().
  - `0.12.2` Why immutability matters: safety against accidental changes and lower memory usage.
  - `0.12.3` Tuple unpacking: assigning multiple variables at once from a single tuple.
  - `0.12.4` Returning multiple values: returning tuples from functions cleanly.
- **Key Failure Modes & Edge Cases**: Attempting to modify a tuple element, causing a TypeError.
- **Verification & Mastery Check**: Write a function that returns the token count, character count, and estimated cost as an unpacked tuple.
- **Project Application**: PromptCLI: Multi-value metrics calculation.'
WHERE id = 'node-0-12';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.13: Dictionaries: Key-Value Hash Maps', 
    subtitle = 'Prerequisites: Lesson 0.10', 
    cs_foundation = 'Prerequisites: Lesson 0.10 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.13: Dictionaries: Key-Value Hash Maps

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.13.1` Mapping relationships: pairing unique keys with values using dictionaries {}.
  - `0.13.2` Accessing data safely: using square brackets [] vs the safe get() method with fallbacks.
  - `0.13.3` Updating and deleting: adding new keys, updating existing keys, and using pop().
  - `0.13.4` Iterating dictionaries: looping over keys(), values(), and items() key-value pairs.
- **Key Failure Modes & Edge Cases**: Accessing a non-existent key with [] instead of get(), triggering a KeyError crash.
- **Verification & Mastery Check**: Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely.
- **Project Application**: PromptCLI: Model hyperparameter state management.'
WHERE id = 'node-0-13';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.14: Sets: Unique Elements & Set Algebra', 
    subtitle = 'Prerequisites: Lesson 0.13', 
    cs_foundation = 'Prerequisites: Lesson 0.13 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.14: Sets: Unique Elements & Set Algebra

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.13
- **Subtopics**:
  - `0.14.1` Unique collections: automatically deduplicating items with sets {}.
  - `0.14.2` High-speed lookups: why in checks are virtually instantaneous in sets.
  - `0.14.3` Mathematical set operations: union (|), intersection (&), and difference (-).
  - `0.14.4` When to use sets: removing duplicate user tags or detecting shared vocabulary.
- **Key Failure Modes & Edge Cases**: Attempting to put a mutable list into a set, triggering a TypeError: unhashable type.
- **Verification & Mastery Check**: Find all unique words used in two different user prompts and calculate their overlap using intersection.
- **Project Application**: PromptCLI: Prompt vocabulary similarity calculator.'
WHERE id = 'node-0-14';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.15: File I/O: Reading & Writing Files', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.15: File I/O: Reading & Writing Files

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.15.1` Interacting with disk files: opening, reading, and writing text files.
  - `0.15.2` The with open() context manager: automatically closing files even if errors happen.
  - `0.15.3` Reading modes: read(), readline(), and readlines() line-by-line.
  - `0.15.4` Writing vs appending: overwriting files with ''w'' vs adding new lines with ''a''.
- **Key Failure Modes & Edge Cases**: Forgetting with open(), leaving file handles locked in the operating system.
- **Verification & Mastery Check**: Read a system prompt template from a local file, replace a placeholder with user input, and save the result.
- **Project Application**: PromptCLI: Prompt template file loader.'
WHERE id = 'node-0-15';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.16: Working with JSON Data', 
    subtitle = 'Prerequisites: Lesson 0.13, Lesson 0.15', 
    cs_foundation = 'Prerequisites: Lesson 0.13, Lesson 0.15 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.16: Working with JSON Data

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.13, Lesson 0.15
- **Subtopics**:
  - `0.16.1` What is JSON: the universal language of modern web APIs and AI models.
  - `0.16.2` Parsing JSON text: converting raw text strings into Python dictionaries with json.loads().
  - `0.16.3` Writing JSON data: converting Python dictionaries into formatted JSON text with json.dumps().
  - `0.16.4` Handling files: using json.load() and json.dump() directly with file objects.
- **Key Failure Modes & Edge Cases**: Crashing on invalid JSON syntax with JSONDecodeError when reading corrupted API responses.
- **Verification & Mastery Check**: Parse an LLM''s raw JSON string output into a typed Python dictionary and extract a structured answer.
- **Project Application**: PromptCLI: Structured AI output parser.'
WHERE id = 'node-0-16';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.17: Error Handling: try, except, finally', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.17: Error Handling: try, except, finally

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.17.1` Handling failures gracefully: catching runtime exceptions before they crash your program.
  - `0.17.2` Catching specific errors: handling ValueError, FileNotFoundError, and KeyError individually.
  - `0.17.3` The else block: running code only when no errors occurred.
  - `0.17.4` The finally block: guaranteeing cleanup routines (like closing connections) always run.
- **Key Failure Modes & Edge Cases**: Using a bare except: which hides real bugs and catches system interrupts like Ctrl+C.
- **Verification & Mastery Check**: Wrap a file reading and JSON parsing function in defensive error handling that logs clear error messages.
- **Project Application**: PromptCLI: Resilient API response decoder.'
WHERE id = 'node-0-17';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.18: Modules & The import System', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.18: Modules & The import System

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.18.1` Organizing code into multiple files: splitting projects into reusable Python modules.
  - `0.18.2` The import statement: importing entire modules, specific functions, or using aliases.
  - `0.18.3` Standard library tour: essential built-in modules like os, sys, math, and random.
  - `0.18.4` Understanding __name__ == ''__main__'': writing files that can be both imported and run directly.
- **Key Failure Modes & Edge Cases**: Creating circular imports between two files that import each other, causing ImportError.
- **Verification & Mastery Check**: Split a prompt helper into a separate module file and import its functions into your main CLI runner.
- **Project Application**: PromptCLI: Modular multi-file tool architecture.'
WHERE id = 'node-0-18';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.19: Writing Pythonic & PEP 8 Code', 
    subtitle = 'Prerequisites: Lesson 0.18', 
    cs_foundation = 'Prerequisites: Lesson 0.18 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.19: Writing Pythonic & PEP 8 Code

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.18
- **Subtopics**:
  - `0.19.1` The Zen of Python: readability counts, explicit is better than implicit, simple is better than complex.
  - `0.19.2` PEP 8 style guide: snake_case for variables, PascalCase for classes, spacing, and line length.
  - `0.19.3` Docstrings and comments: writing clear explanations for your future self and teammates.
  - `0.19.4` Automated formatters: using modern tools like Black or Ruff to format code effortlessly.
- **Key Failure Modes & Edge Cases**: Writing single-letter variable names or 200-line unreadable functions that teammates cannot maintain.
- **Verification & Mastery Check**: Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.
- **Project Application**: PromptCLI: Code quality standards across all projects.'
WHERE id = 'node-0-19';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.20: Debugging with print & Python pdb', 
    subtitle = 'Prerequisites: Lesson 0.17', 
    cs_foundation = 'Prerequisites: Lesson 0.17 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.20: Debugging with print & Python pdb

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.17
- **Subtopics**:
  - `0.20.1` Debugging mindset: how to track down why code behaves differently than you expected.
  - `0.20.2` Strategic print debugging: using f-strings to inspect variable states at key checkpoints.
  - `0.20.3` Interactive debugging with breakpoint(): pausing program execution in the terminal.
  - `0.20.4` Core debugger commands: n (next line), s (step inside), c (continue), and p (print variable).
- **Key Failure Modes & Edge Cases**: Leaving leftover debugging print statements scattered across production codebases.
- **Verification & Mastery Check**: Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.
- **Project Application**: PromptCLI: Interactive troubleshooting and bug fixing.'
WHERE id = 'node-0-20';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.21: Text Manipulation, String Methods & Cleaning', 
    subtitle = 'Prerequisites: Lesson 0.3', 
    cs_foundation = 'Prerequisites: Lesson 0.3 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.21: Text Manipulation, String Methods & Cleaning

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.3
- **Subtopics**:
  - `0.21.1` Real-world text cleaning: stripping unwanted whitespace, tabs, and newlines (`strip`, `lstrip`, `rstrip`).
  - `0.21.2` Case transformations and normalization: `lower()`, `upper()`, and case-insensitive matching.
  - `0.21.3` Finding, counting, and replacing text patterns: `.find()`, `.count()`, and `.replace()`.
  - `0.21.4` Splitting and joining text: converting paragraphs to word lists with `.split()` and reconstructing with `.join()`.
- **Key Failure Modes & Edge Cases**: Modifying strings expecting them to change in-place; strings are immutable in Python, so the result must be reassigned.
- **Verification & Mastery Check**: Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowercases user prompts.
- **Project Application**: PromptCLI: Raw prompt preprocessing and token sanitization.'
WHERE id = 'node-0-21';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.22: Working with Python Lists & Collections', 
    subtitle = 'Prerequisites: Lesson 0.6', 
    cs_foundation = 'Prerequisites: Lesson 0.6 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.22: Working with Python Lists & Collections

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.6
- **Subtopics**:
  - `0.22.1` The Python List: storing ordered collections of items in numbered positions.
  - `0.22.2` Modifying lists: `.append()`, `.extend()`, `.insert()`, `.pop()`, and `.remove()`.
  - `0.22.3` Slicing lists: extracting sub-lists with `[start:stop:step]` syntax.
  - `0.22.4` Checking membership: using `in` and `not in` to test if an item exists in a collection.
- **Key Failure Modes & Edge Cases**: Calling `.pop()` or accessing an index on an empty list, triggering an `IndexError`.
- **Verification & Mastery Check**: Build a conversation history list where new messages are appended, and only the 5 most recent turns are retained.
- **Project Application**: PromptCLI: Multi-turn chat message history buffer.'
WHERE id = 'node-0-22';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.23: List Comprehensions & Data Transformations', 
    subtitle = 'Prerequisites: Lesson 0.22', 
    cs_foundation = 'Prerequisites: Lesson 0.22 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.23: List Comprehensions & Data Transformations

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.22
- **Subtopics**:
  - `0.23.1` The List Comprehension syntax: transforming lists in a single readable line.
  - `0.23.2` Filtering with conditionals: `[item for item in items if condition]`.
  - `0.23.3` Transforming text data: stripping and normalizing an entire batch of inputs at once.
  - `0.23.4` When to use comprehensions vs regular loops for clean, maintainable code.
- **Key Failure Modes & Edge Cases**: Nesting three or more list comprehensions, creating unreadable "clever" code that teammates cannot debug.
- **Verification & Mastery Check**: Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehension.
- **Project Application**: PromptCLI: Batch prompt cleanup and extraction.'
WHERE id = 'node-0-23';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups', 
    subtitle = 'Prerequisites: Lesson 0.22', 
    cs_foundation = 'Prerequisites: Lesson 0.22 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.22
- **Subtopics**:
  - `0.24.1` The Dictionary mental model: pairing unique keys with stored values (like a phone contact list).
  - `0.24.2` Adding, updating, and removing dictionary entries.
  - `0.24.3` Safe lookups: using `.get(key, default)` to prevent unhandled `KeyError` crashes.
  - `0.24.4` Iterating over dictionaries: accessing `.keys()`, `.values()`, and `.items()`.
- **Key Failure Modes & Edge Cases**: Accessing a missing dictionary key with brackets (`dict[key]`) rather than `.get()`, crashing the application.
- **Verification & Mastery Check**: Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.
- **Project Application**: PromptCLI: Dynamic AI model parameter and pricing lookup.'
WHERE id = 'node-0-24';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.25: Sets & Unique Item Filtering', 
    subtitle = 'Prerequisites: Lesson 0.24', 
    cs_foundation = 'Prerequisites: Lesson 0.24 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.25: Sets & Unique Item Filtering

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.24
- **Subtopics**:
  - `0.25.1` What is a Set: an unordered collection that automatically enforces uniqueness.
  - `0.25.2` Instant deduplication: turning lists into sets with `set(my_list)`.
  - `0.25.3` Fast membership testing: why checking `item in my_set` is lightning-fast compared to lists.
  - `0.25.4` Set operations: union, intersection, and difference between collections.
- **Key Failure Modes & Edge Cases**: Trying to index into a set with `my_set[0]`; sets are unordered and do not support indexing.
- **Verification & Mastery Check**: Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.
- **Project Application**: PromptCLI: User prompt tag deduplication and stopword filtering.'
WHERE id = 'node-0-25';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.26: Reading and Writing Files in Python', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.26: Reading and Writing Files in Python

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.26.1` The file system mental model: folders, files, relative paths vs absolute paths.
  - `0.26.2` Opening files safely: the `with open(...) as f:` context manager that closes files automatically.
  - `0.26.3` Reading files: `.read()`, `.readline()`, and iterating over lines efficiently.
  - `0.26.4` Writing files: write mode (`"w"`) vs append mode (`"a"`).
- **Key Failure Modes & Edge Cases**: Using write mode (`"w"`) instead of append mode (`"a"`), accidentally erasing existing file contents.
- **Verification & Mastery Check**: Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and appends the result to a log file.
- **Project Application**: PromptCLI: Local prompt template loading and output logging.'
WHERE id = 'node-0-26';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.27: JSON Data: Serialization and Parsing', 
    subtitle = 'Prerequisites: Lesson 0.24, Lesson 0.26', 
    cs_foundation = 'Prerequisites: Lesson 0.24, Lesson 0.26 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.27: JSON Data: Serialization and Parsing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.24, Lesson 0.26
- **Subtopics**:
  - `0.27.1` What is JSON: the universal data format used by modern web apps and AI APIs.
  - `0.27.2` Parsing JSON text into Python dictionaries using `json.loads()`.
  - `0.27.3` Serializing Python dictionaries into JSON text using `json.dumps()`.
  - `0.27.4` Reading and writing `.json` files directly with `json.load()` and `json.dump()`.
- **Key Failure Modes & Edge Cases**: Passing invalid JSON strings (like single quotes or trailing commas) to `json.loads()`, causing `JSONDecodeError`.
- **Verification & Mastery Check**: Parse a simulated LLM JSON response string, extract the message content, and save the structured record to `session.json`.
- **Project Application**: PromptCLI: Configuration management and structured response logging.'
WHERE id = 'node-0-27';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.28: Error Handling: try, except & Graceful Recovery', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.28: Error Handling: try, except & Graceful Recovery

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.28.1` Why programs fail: syntax errors vs runtime exceptions.
  - `0.28.2` Catching errors with `try` and `except`: keeping your application running when inputs are invalid.
  - `0.28.3` Specific exception types: `ValueError`, `KeyError`, `FileNotFoundError`, `TypeError`.
  - `0.28.4` The `finally` and `else` blocks: running cleanup routines reliably.
- **Key Failure Modes & Edge Cases**: Using a bare `except:` clause without specifying the error type, silently masking fatal bugs.
- **Verification & Mastery Check**: Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default prompt without crashing.
- **Project Application**: PromptCLI: Resilient input parser and configuration loader.'
WHERE id = 'node-0-28';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.29: Environment Variables & Secrets Management', 
    subtitle = 'Prerequisites: Lesson 0.26', 
    cs_foundation = 'Prerequisites: Lesson 0.26 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.29: Environment Variables & Secrets Management

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.26
- **Subtopics**:
  - `0.29.1` Why hardcoding secrets is dangerous: keeping API keys out of Git repositories.
  - `0.29.2` Reading environment variables with Python''s built-in `os.environ` and `os.getenv()`.
  - `0.29.3` Using `.env` files locally with `python-dotenv`.
  - `0.29.4` The `.gitignore` file: preventing secrets and local caches from ever being committed to GitHub.
- **Key Failure Modes & Edge Cases**: Committing an un-ignored `.env` file to a public repository, exposing production AI API keys.
- **Verification & Mastery Check**: Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the key is missing.
- **Project Application**: PromptCLI: Secure API key configuration manager.'
WHERE id = 'node-0-29';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.30: Making HTTP GET and POST Requests with HTTPX', 
    subtitle = 'Prerequisites: Lesson 0.27, Lesson 0.29', 
    cs_foundation = 'Prerequisites: Lesson 0.27, Lesson 0.29 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.30: Making HTTP GET and POST Requests with HTTPX

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.27, Lesson 0.29
- **Subtopics**:
  - `0.30.1` The Client-Server model: how your computer talks to remote API servers across the internet.
  - `0.30.2` HTTP verbs: GET (fetching data) vs POST (submitting prompts and payloads).
  - `0.30.3` Sending headers: authentication tokens (`Bearer ...`) and Content-Type (`application/json`).
  - `0.30.4` Checking status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limited), 500 (Server Error).
- **Key Failure Modes & Edge Cases**: Forgetting to check `.status_code` or call `.raise_for_status()`, leading to subtle bugs on failed requests.
- **Verification & Mastery Check**: Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.
- **Project Application**: PromptCLI: Remote AI inference gateway client.'
WHERE id = 'node-0-30';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.31: Handling Network Timeouts & Exponential Backoff', 
    subtitle = 'Prerequisites: Lesson 0.30', 
    cs_foundation = 'Prerequisites: Lesson 0.30 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.31: Handling Network Timeouts & Exponential Backoff

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.30
- **Subtopics**:
  - `0.31.1` Transient network failures: why remote API calls will inevitably fail in production.
  - `0.31.2` Setting request timeouts: preventing programs from hanging forever when servers lag.
  - `0.31.3` The Exponential Backoff algorithm: waiting 1s, 2s, 4s before retrying to prevent overwhelming servers.
  - `0.31.4` Adding random jitter: avoiding retry storms across distributed clients.
- **Key Failure Modes & Edge Cases**: Retrying immediately in a tight `while` loop without backoff, getting your IP permanently rate-limited.
- **Verification & Mastery Check**: Implement a retry loop that retries a failing simulated HTTP request up to 3 times with exponential backoff.
- **Project Application**: PromptCLI: Automated network retry resilience engine.'
WHERE id = 'node-0-31';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.32: Parsing XML, Markdown & Unstructured AI Text', 
    subtitle = 'Prerequisites: Lesson 0.21', 
    cs_foundation = 'Prerequisites: Lesson 0.21 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.32: Parsing XML, Markdown & Unstructured AI Text

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.21
- **Subtopics**:
  - `0.32.1` The reality of AI outputs: why models often return markdown code blocks, XML tags, or conversational text.
  - `0.32.2` Extracting text between XML tags (e.g., `<thought>...</thought>` or `<answer>...</answer>`).
  - `0.32.3` Stripping markdown code fences: extracting clean JSON from ` ```json ... ``` ` blocks.
  - `0.32.4` Regular expressions for text extraction: using `re.search()` to isolate structured patterns.
- **Key Failure Modes & Edge Cases**: Assuming an LLM will return pure JSON without markdown backticks, causing `json.loads()` to crash.
- **Verification & Mastery Check**: Write a robust extractor that extracts valid JSON from a response string wrapped in conversational filler and markdown fences.
- **Project Application**: PromptCLI: Response parser and code block extractor.'
WHERE id = 'node-0-32';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.33: Command-Line Arguments with Argparse', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.33: Command-Line Arguments with Argparse

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.33.1` Why CLI tools matter: running scripts with flags and options directly from the terminal.
  - `0.33.2` Python''s `argparse` module: defining positional arguments and optional flags (`--model`, `--temp`).
  - `0.33.3` Type casting and default values: automatically converting string inputs to integers or floats.
  - `0.33.4` Generating automated help menus: `--help` documentation generated directly from argument descriptions.
- **Key Failure Modes & Edge Cases**: Failing to provide help descriptions, making command-line tools impossible for teammates to use.
- **Verification & Mastery Check**: Build a CLI script `prompt_tool.py` that takes `--prompt`, `--temperature`, and `--verbose` flags and prints the settings.
- **Project Application**: PromptCLI: Terminal CLI argument parsing interface.'
WHERE id = 'node-0-33';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.34: Packaging Reusable Modules & Python Imports', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.34: Packaging Reusable Modules & Python Imports

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.34.1` Breaking scripts into modules: separating logic into multiple `.py` files.
  - `0.34.2` Import statements: `import utils`, `from config import MODEL_NAME`.
  - `0.34.3` The `if __name__ == "__main__":` idiom: making files both importable modules and executable scripts.
  - `0.34.4` Creating packages: using folders and `__init__.py` to organize multi-file projects.
- **Key Failure Modes & Edge Cases**: Circular imports where module A imports module B and module B imports module A, causing import crashes.
- **Verification & Mastery Check**: Organize a 3-file project (`main.py`, `prompt_templates.py`, `api_client.py`) and successfully run the application.
- **Project Application**: PromptCLI: Modular codebase architecture.'
WHERE id = 'node-0-34';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.35: Virtual Environments & Modern Package Management (uv / pip)', 
    subtitle = 'Prerequisites: Lesson 0.34', 
    cs_foundation = 'Prerequisites: Lesson 0.34 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.35: Virtual Environments & Modern Package Management (uv / pip)

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.34
- **Subtopics**:
  - `0.35.1` Why virtual environments exist: preventing dependency version conflicts across projects.
  - `0.35.2` Creating and activating environments with `python -m venv .venv`.
  - `0.35.3` Installing dependencies with `pip install` and generating `requirements.txt`.
  - `0.35.4` Ultra-fast modern package management with `uv`: lightning-fast dependency resolution.
- **Key Failure Modes & Edge Cases**: Installing packages into the global system Python instead of an active virtual environment.
- **Verification & Mastery Check**: Create an isolated `.venv`, install `httpx` and `pydantic`, and export a pinned `requirements.txt`.
- **Project Application**: PromptCLI: Isolated dependency blueprint.'
WHERE id = 'node-0-35';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.36: Modern Python Type Hints & Static Typing', 
    subtitle = 'Prerequisites: Lesson 0.8', 
    cs_foundation = 'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.36: Modern Python Type Hints & Static Typing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.36.1` Why type hints matter: catching bugs before running code and unlocking superior IDE autocomplete.
  - `0.36.2` Basic type annotations: `name: str`, `age: int`, `score: float`, `is_active: bool`.
  - `0.36.3` Container types: `list[str]`, `dict[str, int]`, `tuple[int, int]`.
  - `0.36.4` Optional and Union types: `str | None` for values that might be missing.
- **Key Failure Modes & Edge Cases**: Assuming Python enforces types at runtime; type hints are for static analysis and tools like Mypy/IDE, not runtime checks.
- **Verification & Mastery Check**: Annotate a prompt-formatting function with full parameter and return types, verifying it with `mypy`.
- **Project Application**: PromptCLI: Type-safe prompt orchestration pipeline.'
WHERE id = 'node-0-36';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.37: Introduction to Pydantic: Data Validation from Scratch', 
    subtitle = 'Prerequisites: Lesson 0.36', 
    cs_foundation = 'Prerequisites: Lesson 0.36 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.37: Introduction to Pydantic: Data Validation from Scratch

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.36
- **Subtopics**:
  - `0.37.1` The Pydantic mental model: turning loose dictionaries into guaranteed, validated data models.
  - `0.37.2` Creating a `BaseModel`: defining fields, default values, and required attributes.
  - `0.37.3` Automatic type coercion: how Pydantic cleanly converts strings like `"123"` into integers `123`.
  - `0.37.4` Catching validation errors: inspecting `ValidationError` when data fails to meet schema rules.
- **Key Failure Modes & Edge Cases**: Passing invalid data into Pydantic models without a `try/except ValidationError` block.
- **Verification & Mastery Check**: Define an `AIResponse` Pydantic model with fields `content: str`, `tokens: int`, and validate a dirty dictionary against it.
- **Project Application**: PromptCLI: Structured output validation foundation.'
WHERE id = 'node-0-37';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.38: Git Fundamentals: Commits, History & Diffs', 
    subtitle = 'Prerequisites: Lesson 0.26', 
    cs_foundation = 'Prerequisites: Lesson 0.26 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.38: Git Fundamentals: Commits, History & Diffs

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.26
- **Subtopics**:
  - `0.38.1` Why version control is mandatory: time-traveling through project history and safe experimentation.
  - `0.38.2` The 3 Git states: Working Directory, Staging Area (`git add`), and Repository (`git commit`).
  - `0.38.3` Writing meaningful commit messages: describing the "why" rather than just the "what".
  - `0.38.4` Inspecting changes: using `git status`, `git diff`, and `git log --oneline`.
- **Key Failure Modes & Edge Cases**: Running `git add .` without checking `git status`, accidentally staging sensitive `.env` files.
- **Verification & Mastery Check**: Initialize a Git repository, stage files, make 3 distinct commits, and view the commit history log.
- **Project Application**: PromptCLI: Version control initialization.'
WHERE id = 'node-0-38';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.39: Git Branching & Merging Workflows', 
    subtitle = 'Prerequisites: Lesson 0.38', 
    cs_foundation = 'Prerequisites: Lesson 0.38 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.39: Git Branching & Merging Workflows

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.38
- **Subtopics**:
  - `0.39.1` Why branch: developing new features or prompt experiments in isolation without breaking the main codebase.
  - `0.39.2` Creating and switching branches: `git branch` and `git switch -c feature-prompt-v2`.
  - `0.39.3` Merging branches: bringing feature changes cleanly into the `main` branch.
  - `0.39.4` Resolving merge conflicts calmly: understanding conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
- **Key Failure Modes & Edge Cases**: Panic-deleting code during merge conflicts; conflict markers are simply Git asking you to choose which version to keep.
- **Verification & Mastery Check**: Create a feature branch, make a change, merge it into main, and cleanly delete the feature branch.
- **Project Application**: PromptCLI: Feature branch workflow for prompt enhancements.'
WHERE id = 'node-0-39';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.40: Remote Repositories & GitHub Collaboration', 
    subtitle = 'Prerequisites: Lesson 0.39', 
    cs_foundation = 'Prerequisites: Lesson 0.39 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.40: Remote Repositories & GitHub Collaboration

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.39
- **Subtopics**:
  - `0.40.1` Local vs Remote: connecting local Git repositories to GitHub with `git remote add origin`.
  - `0.40.2` Pushing and pulling: `git push -u origin main` and `git pull`.
  - `0.40.3` Pull Requests (PRs): proposing changes, code review etiquette, and automated CI checks.
  - `0.40.4` Writing a professional README.md: explaining how to install, configure, and run your project.
- **Key Failure Modes & Edge Cases**: Pushing directly to `main` without testing, breaking the production deployment for other engineers.
- **Verification & Mastery Check**: Write a clean, comprehensive `README.md` for a project including installation, configuration, and example usage.
- **Project Application**: PromptCLI: Open-source project portfolio presentation.'
WHERE id = 'node-0-40';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.41: Writing Your First Automated Test with Pytest', 
    subtitle = 'Prerequisites: Lesson 0.34', 
    cs_foundation = 'Prerequisites: Lesson 0.34 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.41: Writing Your First Automated Test with Pytest

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.34
- **Subtopics**:
  - `0.41.1` The Testing mindset: why manual testing does not scale and automated tests guarantee reliability.
  - `0.41.2` The `pytest` framework: writing test functions named `test_*` and using plain Python `assert`.
  - `0.41.3` Running test suites: executing `pytest` from the terminal and interpreting green/red results.
  - `0.41.4` Testing edge cases: empty strings, extreme numbers, and unexpected inputs.
- **Key Failure Modes & Edge Cases**: Writing tests that test nothing (missing `assert`), giving false confidence in broken code.
- **Verification & Mastery Check**: Write a test suite with 4 distinct assertions testing a prompt sanitization function against normal and edge-case inputs.
- **Project Application**: PromptCLI: Automated regression test suite.'
WHERE id = 'node-0-41';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.42: Test Fixtures & Mocking External APIs', 
    subtitle = 'Prerequisites: Lesson 0.41', 
    cs_foundation = 'Prerequisites: Lesson 0.41 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.42: Test Fixtures & Mocking External APIs

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.41
- **Subtopics**:
  - `0.42.1` Why we don''t call real AI APIs in unit tests: cost, latency, and unpredictable outputs.
  - `0.42.2` Pytest fixtures: reusing setup objects and mock configurations across multiple test cases.
  - `0.42.3` Mocking HTTP requests: using `unittest.mock` or `pytest-mock` to simulate API responses.
  - `0.42.4` Testing failure modes: verifying that your application handles 500 errors and timeouts without crashing.
- **Key Failure Modes & Edge Cases**: Allowing unit tests to make live internet calls, causing test suites to fail when internet drops or API balances run out.
- **Verification & Mastery Check**: Write an automated test that mocks an AI API response and verifies that your parser extracts the answer correctly.
- **Project Application**: PromptCLI: Mocked API test coverage.'
WHERE id = 'node-0-42';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.43: Linux Terminal Architecture, Shells, & Environment', 
    subtitle = 'Prerequisites: Lesson 0.37', 
    cs_foundation = 'Prerequisites: Lesson 0.37 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.43: Linux Terminal Architecture, Shells, & Environment

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.37
- **Subtopics**:
  - `0.43.1` Terminal Emulators, Pseudo-Terminals (PTY), and Line Discipline (cooked mode vs raw mode).
  - `0.43.2` POSIX Shell execution model: command lookup, PATH traversal, subshells, process substitution.
  - `0.43.3` Environment variables: inherited environment, exporting variables (`export`), local variables.
  - `0.43.4` Shell configuration lifecycle: `/etc/profile`, `~/.bash_profile`, `~/.bashrc`, interactive vs non-interactive shells.
- **Key Failure Modes & Edge Cases**: Modifying environment variables in subshells and wondering why parent process environments remain unchanged.
- **Verification & Mastery Check**: Trace environment variable inheritance across nested subshells and background processes.
- **Project Application**: SysTrace: Execution environment and path configuration.'
WHERE id = 'node-0-43';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.44: Standard Streams, Redirection, & Pipes', 
    subtitle = 'Prerequisites: Lesson 0.40', 
    cs_foundation = 'Prerequisites: Lesson 0.40 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.44: Standard Streams, Redirection, & Pipes

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.40
- **Subtopics**:
  - `0.44.1` Stream redirection syntax: `>`, `>>`, `<`, `2>`, `2>&1`, `&>`.
  - `0.44.2` The UNIX Pipe (`|`): kernel anonymous pipe connecting stdout of process A to stdin of process B.
  - `0.44.3` Buffering semantics: fully buffered (block buffered when redirected to file) vs line buffered (TTY terminals).
  - `0.44.4` Process substitution (`<()`, `>()`): passing command outputs as file paths to commands expecting files.
- **Key Failure Modes & Edge Cases**: Pipeline deadlocks or silent data loss when mixing stdout and stderr redirection in wrong order (`2>&1 >file`).
- **Verification & Mastery Check**: Construct a pipeline that redirects stdout to a file and stderr to a background alerting script simultaneously.
- **Project Application**: Core text manipulation pipeline in `SysTrace`.'
WHERE id = 'node-0-44';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.45: Process Control Signals (`SIGTERM`, `SIGKILL`, `SIGINT`)', 
    subtitle = 'Prerequisites: Lesson 0.41', 
    cs_foundation = 'Prerequisites: Lesson 0.41 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.45: Process Control Signals (`SIGTERM`, `SIGKILL`, `SIGINT`)

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.41
- **Subtopics**:
  - `0.45.1` POSIX signals: asynchronous kernel notifications sent to processes.
  - `0.45.2` Standard signals: `SIGINT` (2, Ctrl+C), `SIGQUIT` (3), `SIGKILL` (9, non-catchable), `SIGTERM` (15, graceful exit request), `SIGHUP` (1, hangup/reload).
  - `0.45.3` Signal handling in Bash: the `trap` command, executing cleanup routines on script termination.
  - `0.45.4` Process groups and sessions: sending signals to entire process trees using negative PID syntax (`kill -- -PGID`).
- **Key Failure Modes & Edge Cases**: Using `kill -9` as the default termination command, leaving database locks, temporary files, and socket ports locked.
- **Verification & Mastery Check**: Write a Bash script with a `trap` handler that cleanly removes temporary directories even when terminated via `SIGINT`.
- **Project Application**: SysTrace: Clean shutdown and signal trapping.'
WHERE id = 'node-0-45';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.46: POSIX File Permissions, Ownership, & Special Bits', 
    subtitle = 'Prerequisites: Lesson 0.40', 
    cs_foundation = 'Prerequisites: Lesson 0.40 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.46: POSIX File Permissions, Ownership, & Special Bits

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.40
- **Subtopics**:
  - `0.46.1` POSIX permission octets: Owner, Group, Others; Read (4), Write (2), Execute (1).
  - `0.46.2` The `umask`: default permission masking calculation for newly created files and directories.
  - `0.46.3` Special permission bits: SUID (Set User ID - executes as file owner), SGID (Set Group ID), Sticky Bit (restricted deletion in `/tmp`).
  - `0.46.4` Ownership management: `chmod`, `chown`, `chgrp`, recursive updates, and symbolic link handling.
- **Key Failure Modes & Edge Cases**: Security disaster: setting permissions to `777` to fix a permission error, exposing secrets and code to all local users.
- **Verification & Mastery Check**: Demonstrate how SUID permissions permit unprivileged users to execute privileged actions safely.
- **Project Application**: Security audit checks in `DevAudit`.'
WHERE id = 'node-0-46';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.47: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)', 
    subtitle = 'Prerequisites: Lesson 0.44', 
    cs_foundation = 'Prerequisites: Lesson 0.44 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.47: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.44
- **Subtopics**:
  - `0.47.1` `grep` mastery: recursive search (`-r`), inverted matching (`-v`), line numbering (`-n`), counting (`-c`), PCRE regex (`-P`).
  - `0.47.2` `sed` stream editor: search and replace (`s/pattern/replacement/g`), address ranges, deleting lines (`/d`), in-place editing (`-i`).
  - `0.47.3` `awk` programming: pattern-action pairs, field separators (`-F`), built-in variables (`NR`, `NF`, `$1`, `$2`), associative arrays.
  - `0.47.4` Composing Unix pipelines: combining `grep | awk | sort | uniq -c | sort -nr` for high-throughput log analysis.
- **Key Failure Modes & Edge Cases**: Running unquoted `sed -i` commands on macOS vs Linux, causing script syntax crashes across operating systems.
- **Verification & Mastery Check**: Parse an Nginx access log file with `awk` and output the top 5 IP addresses by total bytes transferred in under 3 seconds.
- **Project Application**: SysTrace: Log parsing and metric formatting.'
WHERE id = 'node-0-47';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.48: Robust Bash Scripting, Error Trapping, & `shellcheck`', 
    subtitle = 'Prerequisites: Lesson 0.45', 
    cs_foundation = 'Prerequisites: Lesson 0.45 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.48: Robust Bash Scripting, Error Trapping, & `shellcheck`

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.45
- **Subtopics**:
  - `0.48.1` Bash strict mode: `set -euo pipefail` (exit on error, exit on unset variable, inherit pipeline failure status).
  - `0.48.2` Quoting rules in Bash: why double quoting (`"$var"`) prevents catastrophic word splitting and pathname globbing.
  - `0.48.3` Conditional branching and arithmetic: `[[ ... ]]` vs `[ ... ]`, integer testing, string testing, regex matching.
  - `0.48.4` Automated shell static analysis: running `shellcheck` to detect bugs, unhandled exit codes, and portability violations.
- **Key Failure Modes & Edge Cases**: Executing `rm -rf $DIR/` when `DIR` is unset, resulting in the accidental execution of `rm -rf /`.
- **Verification & Mastery Check**: Write a 100-line Bash utility that passes `shellcheck` with zero warnings, zero hints, and strict error handling.
- **Project Application**: SysTrace: Mandatory quality standard for Phase 0 project.'
WHERE id = 'node-0-48';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.49: Regular Expressions: Finite Automata & Core Syntax', 
    subtitle = 'Prerequisites: Lesson 0.47', 
    cs_foundation = 'Prerequisites: Lesson 0.47 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.49: Regular Expressions: Finite Automata & Core Syntax

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.47
- **Subtopics**:
  - `0.49.1` Automata theory: Deterministic Finite Automata (DFA) vs Non-Deterministic Finite Automata (NFA).
  - `0.49.2` Metacharacters, literals, character classes (`[...]`, `[^...]`), shorthand classes (`\d`, `\w`, `\s`).
  - `0.49.3` Quantifiers: greedy (`*`, `+`, `{n,m}`), lazy/reluctant (`*?`, `+?`), possessive (`*+`).
  - `0.49.4` Anchors: line anchors (`^`, `$`), word boundaries (`\b`, `\B`), string anchors (`\A`, `\Z`).
- **Key Failure Modes & Edge Cases**: Greedy quantifiers consuming unexpected characters across multi-line inputs, extracting corrupted substrings.
- **Verification & Mastery Check**: Write a regular expression that matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255) without false positives.
- **Project Application**: DevAudit: Secret detection pattern matching engine.'
WHERE id = 'node-0-49';
UPDATE curriculum_nodes 
SET title = 'Lesson 0.50: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading', 
    subtitle = 'Prerequisites: Lesson 0.49', 
    cs_foundation = 'Prerequisites: Lesson 0.49 | Subtopics: 4 items',
    ai_convergence = 'Exit benchmark requirement for Phase 0.',
    handbook_markdown = '# Lesson 0.50: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.49
- **Subtopics**:
  - `0.50.1` Catastrophic Backtracking in NFA engines: exponential branching ($O(2^n)$) on ambiguous nested quantifiers (e.g., `(a+)+$`).
  - `0.50.2` Regular Expression Denial of Service (ReDoS): how an adversarial 30-character string freezes a web server for minutes.
  - `0.50.3` Safe regex design: eliminating overlapping branches, atomic groups, possessive quantifiers.
  - `0.50.4` CPython Source Archeology: reading `Objects/listobject.c`; dissecting `list_resize()` dynamic over-allocation.
- **Key Failure Modes & Edge Cases**: Production outage caused by an un-anchored, nested regex executed against user-submitted input in an API gateway.
- **Verification & Mastery Check**: Identify and fix a catastrophic backtracking regex, and write a 500-word teardown of CPython `list_resize()` over-allocation.
- **Project Application**: Exit benchmark requirement for Phase 0.


---

---'
WHERE id = 'node-0-50';