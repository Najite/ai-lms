INSERT INTO curriculum_nodes (id, slug, phase_id, order_index, title, subtitle, cs_foundation, ai_convergence, xp_reward, level_required, position_x, position_y, handbook_markdown, starter_code, test_suite, defense_prompts) VALUES
('node-0-16', 'phase-00-lesson-16-working-with-json-data', 'module-1', 16, 'Lesson 1.16: Working with JSON Data', 'Prerequisites: Lesson 0.13, Lesson 0.15', 'Prerequisites: Lesson 0.13, Lesson 0.15 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 800.0, '# Lesson 0.16: Working with JSON Data

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.13, Lesson 0.15
- **Subtopics**:
  - `0.16.1` What is JSON: the universal language of modern web APIs and AI models.
  - `0.16.2` Parsing JSON text: converting raw text strings into Python dictionaries with json.loads().
  - `0.16.3` Writing JSON data: converting Python dictionaries into formatted JSON text with json.dumps().
  - `0.16.4` Handling files: using json.load() and json.dump() directly with file objects.
- **Key Failure Modes & Edge Cases**: Crashing on invalid JSON syntax with JSONDecodeError when reading corrupted API responses.
- **Verification & Mastery Check**: Parse an LLM''s raw JSON string output into a typed Python dictionary and extract a structured answer.
- **Project Application**: PromptCLI: Structured AI output parser.', '{"solution.py": "# Phase 0 // Lesson 0.16: Working with JSON Data\n\ndef solve():\n    \"\"\"\n    Verification: Parse an LLM''s raw JSON string output into a typed Python dictionary and extract a structured answer\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.16", "subtopics_count": 4, "verification_criteria": "Parse an LLM''s raw JSON string output into a typed Python dictionary and extract a structured answer.", "subtopics": ["0.16.1 What is JSON: the universal language of modern web APIs and AI models.", "0.16.2 Parsing JSON text: converting raw text strings into Python dictionaries with json.loads().", "0.16.3 Writing JSON data: converting Python dictionaries into formatted JSON text with json.dumps().", "0.16.4 Handling files: using json.load() and json.dump() directly with file objects."]}'::jsonb, '["Explain how this implementation prevents: Crashing on invalid JSON syntax with JSONDecodeError when reading corrupted API responses.", "How does Working with JSON Data scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-17', 'phase-00-lesson-17-error-handling-try-except-finally', 'module-1', 17, 'Lesson 1.17: Error Handling: try, except, finally', 'Prerequisites: Lesson 0.8', 'Prerequisites: Lesson 0.8 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 850.0, '# Lesson 0.17: Error Handling: try, except, finally

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.17.1` Handling failures gracefully: catching runtime exceptions before they crash your program.
  - `0.17.2` Catching specific errors: handling ValueError, FileNotFoundError, and KeyError individually.
  - `0.17.3` The else block: running code only when no errors occurred.
  - `0.17.4` The finally block: guaranteeing cleanup routines (like closing connections) always run.
- **Key Failure Modes & Edge Cases**: Using a bare except: which hides real bugs and catches system interrupts like Ctrl+C.
- **Verification & Mastery Check**: Wrap a file reading and JSON parsing function in defensive error handling that logs clear error messages.
- **Project Application**: PromptCLI: Resilient API response decoder.', '{"solution.py": "# Phase 0 // Lesson 0.17: Error Handling: try, except, finally\n\ndef solve():\n    \"\"\"\n    Verification: Wrap a file reading and JSON parsing function in defensive error handling that logs clear error mess\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.17", "subtopics_count": 4, "verification_criteria": "Wrap a file reading and JSON parsing function in defensive error handling that logs clear error messages.", "subtopics": ["0.17.1 Handling failures gracefully: catching runtime exceptions before they crash your program.", "0.17.2 Catching specific errors: handling ValueError, FileNotFoundError, and KeyError individually.", "0.17.3 The else block: running code only when no errors occurred.", "0.17.4 The finally block: guaranteeing cleanup routines (like closing connections) always run."]}'::jsonb, '["Explain how this implementation prevents: Using a bare except: which hides real bugs and catches system interrupts like Ctrl+C.", "How does Error Handling: try, except, finally scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-18', 'phase-00-lesson-18-modules-the-import-system', 'module-1', 18, 'Lesson 1.18: Modules & The import System', 'Prerequisites: Lesson 0.8', 'Prerequisites: Lesson 0.8 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 900.0, '# Lesson 0.18: Modules & The import System

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.18.1` Organizing code into multiple files: splitting projects into reusable Python modules.
  - `0.18.2` The import statement: importing entire modules, specific functions, or using aliases.
  - `0.18.3` Standard library tour: essential built-in modules like os, sys, math, and random.
  - `0.18.4` Understanding __name__ == ''__main__'': writing files that can be both imported and run directly.
- **Key Failure Modes & Edge Cases**: Creating circular imports between two files that import each other, causing ImportError.
- **Verification & Mastery Check**: Split a prompt helper into a separate module file and import its functions into your main CLI runner.
- **Project Application**: PromptCLI: Modular multi-file tool architecture.', '{"solution.py": "# Phase 0 // Lesson 0.18: Modules & The import System\n\ndef solve():\n    \"\"\"\n    Verification: Split a prompt helper into a separate module file and import its functions into your main CLI runner\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.18", "subtopics_count": 4, "verification_criteria": "Split a prompt helper into a separate module file and import its functions into your main CLI runner.", "subtopics": ["0.18.1 Organizing code into multiple files: splitting projects into reusable Python modules.", "0.18.2 The import statement: importing entire modules, specific functions, or using aliases.", "0.18.3 Standard library tour: essential built-in modules like os, sys, math, and random.", "0.18.4 Understanding __name__ == ''__main__'': writing files that can be both imported and run directly."]}'::jsonb, '["Explain how this implementation prevents: Creating circular imports between two files that import each other, causing ImportError.", "How does Modules & The import System scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-19', 'phase-00-lesson-19-writing-pythonic-pep-8-code', 'module-1', 19, 'Lesson 1.19: Writing Pythonic & PEP 8 Code', 'Prerequisites: Lesson 0.18', 'Prerequisites: Lesson 0.18 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 950.0, '# Lesson 0.19: Writing Pythonic & PEP 8 Code

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.18
- **Subtopics**:
  - `0.19.1` The Zen of Python: readability counts, explicit is better than implicit, simple is better than complex.
  - `0.19.2` PEP 8 style guide: snake_case for variables, PascalCase for classes, spacing, and line length.
  - `0.19.3` Docstrings and comments: writing clear explanations for your future self and teammates.
  - `0.19.4` Automated formatters: using modern tools like Black or Ruff to format code effortlessly.
- **Key Failure Modes & Edge Cases**: Writing single-letter variable names or 200-line unreadable functions that teammates cannot maintain.
- **Verification & Mastery Check**: Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.
- **Project Application**: PromptCLI: Code quality standards across all projects.', '{"solution.py": "# Phase 0 // Lesson 0.19: Writing Pythonic & PEP 8 Code\n\ndef solve():\n    \"\"\"\n    Verification: Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.19", "subtopics_count": 4, "verification_criteria": "Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.", "subtopics": ["0.19.1 The Zen of Python: readability counts, explicit is better than implicit, simple is better than complex.", "0.19.2 PEP 8 style guide: snake_case for variables, PascalCase for classes, spacing, and line length.", "0.19.3 Docstrings and comments: writing clear explanations for your future self and teammates.", "0.19.4 Automated formatters: using modern tools like Black or Ruff to format code effortlessly."]}'::jsonb, '["Explain how this implementation prevents: Writing single-letter variable names or 200-line unreadable functions that teammates cannot maintain.", "How does Writing Pythonic & PEP 8 Code scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-20', 'phase-00-lesson-20-debugging-with-print-python-pdb', 'module-1', 20, 'Lesson 1.20: Debugging with print & Python pdb', 'Prerequisites: Lesson 0.17', 'Prerequisites: Lesson 0.17 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 1000.0, '# Lesson 0.20: Debugging with print & Python pdb

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.17
- **Subtopics**:
  - `0.20.1` Debugging mindset: how to track down why code behaves differently than you expected.
  - `0.20.2` Strategic print debugging: using f-strings to inspect variable states at key checkpoints.
  - `0.20.3` Interactive debugging with breakpoint(): pausing program execution in the terminal.
  - `0.20.4` Core debugger commands: n (next line), s (step inside), c (continue), and p (print variable).
- **Key Failure Modes & Edge Cases**: Leaving leftover debugging print statements scattered across production codebases.
- **Verification & Mastery Check**: Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.
- **Project Application**: PromptCLI: Interactive troubleshooting and bug fixing.', '{"solution.py": "# Phase 0 // Lesson 0.20: Debugging with print & Python pdb\n\ndef solve():\n    \"\"\"\n    Verification: Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.20", "subtopics_count": 4, "verification_criteria": "Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.", "subtopics": ["0.20.1 Debugging mindset: how to track down why code behaves differently than you expected.", "0.20.2 Strategic print debugging: using f-strings to inspect variable states at key checkpoints.", "0.20.3 Interactive debugging with breakpoint(): pausing program execution in the terminal.", "0.20.4 Core debugger commands: n (next line), s (step inside), c (continue), and p (print variable)."]}'::jsonb, '["Explain how this implementation prevents: Leaving leftover debugging print statements scattered across production codebases.", "How does Debugging with print & Python pdb scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-21', 'phase-00-lesson-21-text-manipulation-string-methods-cleaning', 'module-1', 21, 'Lesson 1.21: Text Manipulation, String Methods & Cleaning', 'Prerequisites: Lesson 0.3', 'Prerequisites: Lesson 0.3 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 1050.0, '# Lesson 0.21: Text Manipulation, String Methods & Cleaning

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.3
- **Subtopics**:
  - `0.21.1` Real-world text cleaning: stripping unwanted whitespace, tabs, and newlines (`strip`, `lstrip`, `rstrip`).
  - `0.21.2` Case transformations and normalization: `lower()`, `upper()`, and case-insensitive matching.
  - `0.21.3` Finding, counting, and replacing text patterns: `.find()`, `.count()`, and `.replace()`.
  - `0.21.4` Splitting and joining text: converting paragraphs to word lists with `.split()` and reconstructing with `.join()`.
- **Key Failure Modes & Edge Cases**: Modifying strings expecting them to change in-place; strings are immutable in Python, so the result must be reassigned.
- **Verification & Mastery Check**: Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowercases user prompts.
- **Project Application**: PromptCLI: Raw prompt preprocessing and token sanitization.', '{"solution.py": "# Phase 0 // Lesson 0.21: Text Manipulation, String Methods & Cleaning\n\ndef solve():\n    \"\"\"\n    Verification: Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowe\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.21", "subtopics_count": 4, "verification_criteria": "Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowercases user prompts.", "subtopics": ["0.21.1 Real-world text cleaning: stripping unwanted whitespace, tabs, and newlines (`strip`, `lstrip`, `rstrip`).", "0.21.2 Case transformations and normalization: `lower()`, `upper()`, and case-insensitive matching.", "0.21.3 Finding, counting, and replacing text patterns: `.find()`, `.count()`, and `.replace()`.", "0.21.4 Splitting and joining text: converting paragraphs to word lists with `.split()` and reconstructing with `.join()`."]}'::jsonb, '["Explain how this implementation prevents: Modifying strings expecting them to change in-place; strings are immutable in Python, so the result must be reassigned.", "How does Text Manipulation, String Methods & Cleaning scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-22', 'phase-00-lesson-22-working-with-python-lists-collections', 'module-1', 22, 'Lesson 1.22: Working with Python Lists & Collections', 'Prerequisites: Lesson 0.6', 'Prerequisites: Lesson 0.6 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 1100.0, '# Lesson 0.22: Working with Python Lists & Collections

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.6
- **Subtopics**:
  - `0.22.1` The Python List: storing ordered collections of items in numbered positions.
  - `0.22.2` Modifying lists: `.append()`, `.extend()`, `.insert()`, `.pop()`, and `.remove()`.
  - `0.22.3` Slicing lists: extracting sub-lists with `[start:stop:step]` syntax.
  - `0.22.4` Checking membership: using `in` and `not in` to test if an item exists in a collection.
- **Key Failure Modes & Edge Cases**: Calling `.pop()` or accessing an index on an empty list, triggering an `IndexError`.
- **Verification & Mastery Check**: Build a conversation history list where new messages are appended, and only the 5 most recent turns are retained.
- **Project Application**: PromptCLI: Multi-turn chat message history buffer.', '{"solution.py": "# Phase 0 // Lesson 0.22: Working with Python Lists & Collections\n\ndef solve():\n    \"\"\"\n    Verification: Build a conversation history list where new messages are appended, and only the 5 most recent turns \n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.22", "subtopics_count": 4, "verification_criteria": "Build a conversation history list where new messages are appended, and only the 5 most recent turns are retained.", "subtopics": ["0.22.1 The Python List: storing ordered collections of items in numbered positions.", "0.22.2 Modifying lists: `.append()`, `.extend()`, `.insert()`, `.pop()`, and `.remove()`.", "0.22.3 Slicing lists: extracting sub-lists with `[start:stop:step]` syntax.", "0.22.4 Checking membership: using `in` and `not in` to test if an item exists in a collection."]}'::jsonb, '["Explain how this implementation prevents: Calling `.pop()` or accessing an index on an empty list, triggering an `IndexError`.", "How does Working with Python Lists & Collections scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-23', 'phase-00-lesson-23-list-comprehensions-data-transformations', 'module-1', 23, 'Lesson 1.23: List Comprehensions & Data Transformations', 'Prerequisites: Lesson 0.22', 'Prerequisites: Lesson 0.22 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 1150.0, '# Lesson 0.23: List Comprehensions & Data Transformations

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.22
- **Subtopics**:
  - `0.23.1` The List Comprehension syntax: transforming lists in a single readable line.
  - `0.23.2` Filtering with conditionals: `[item for item in items if condition]`.
  - `0.23.3` Transforming text data: stripping and normalizing an entire batch of inputs at once.
  - `0.23.4` When to use comprehensions vs regular loops for clean, maintainable code.
- **Key Failure Modes & Edge Cases**: Nesting three or more list comprehensions, creating unreadable "clever" code that teammates cannot debug.
- **Verification & Mastery Check**: Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehension.
- **Project Application**: PromptCLI: Batch prompt cleanup and extraction.', '{"solution.py": "# Phase 0 // Lesson 0.23: List Comprehensions & Data Transformations\n\ndef solve():\n    \"\"\"\n    Verification: Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehen\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.23", "subtopics_count": 4, "verification_criteria": "Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehension.", "subtopics": ["0.23.1 The List Comprehension syntax: transforming lists in a single readable line.", "0.23.2 Filtering with conditionals: `[item for item in items if condition]`.", "0.23.3 Transforming text data: stripping and normalizing an entire batch of inputs at once.", "0.23.4 When to use comprehensions vs regular loops for clean, maintainable code."]}'::jsonb, '["Explain how this implementation prevents: Nesting three or more list comprehensions, creating unreadable \"clever\" code that teammates cannot debug.", "How does List Comprehensions & Data Transformations scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-24', 'phase-00-lesson-24-dictionaries-keys-values-fast-lookups', 'module-1', 24, 'Lesson 1.24: Dictionaries: Keys, Values & Fast Lookups', 'Prerequisites: Lesson 0.22', 'Prerequisites: Lesson 0.22 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 1200.0, '# Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.22
- **Subtopics**:
  - `0.24.1` The Dictionary mental model: pairing unique keys with stored values (like a phone contact list).
  - `0.24.2` Adding, updating, and removing dictionary entries.
  - `0.24.3` Safe lookups: using `.get(key, default)` to prevent unhandled `KeyError` crashes.
  - `0.24.4` Iterating over dictionaries: accessing `.keys()`, `.values()`, and `.items()`.
- **Key Failure Modes & Edge Cases**: Accessing a missing dictionary key with brackets (`dict[key]`) rather than `.get()`, crashing the application.
- **Verification & Mastery Check**: Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.
- **Project Application**: PromptCLI: Dynamic AI model parameter and pricing lookup.', '{"solution.py": "# Phase 0 // Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups\n\ndef solve():\n    \"\"\"\n    Verification: Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.24", "subtopics_count": 4, "verification_criteria": "Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.", "subtopics": ["0.24.1 The Dictionary mental model: pairing unique keys with stored values (like a phone contact list).", "0.24.2 Adding, updating, and removing dictionary entries.", "0.24.3 Safe lookups: using `.get(key, default)` to prevent unhandled `KeyError` crashes.", "0.24.4 Iterating over dictionaries: accessing `.keys()`, `.values()`, and `.items()`."]}'::jsonb, '["Explain how this implementation prevents: Accessing a missing dictionary key with brackets (`dict[key]`) rather than `.get()`, crashing the application.", "How does Dictionaries: Keys, Values & Fast Lookups scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-25', 'phase-00-lesson-25-sets-unique-item-filtering', 'module-1', 25, 'Lesson 1.25: Sets & Unique Item Filtering', 'Prerequisites: Lesson 0.24', 'Prerequisites: Lesson 0.24 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 1250.0, '# Lesson 0.25: Sets & Unique Item Filtering

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.24
- **Subtopics**:
  - `0.25.1` What is a Set: an unordered collection that automatically enforces uniqueness.
  - `0.25.2` Instant deduplication: turning lists into sets with `set(my_list)`.
  - `0.25.3` Fast membership testing: why checking `item in my_set` is lightning-fast compared to lists.
  - `0.25.4` Set operations: union, intersection, and difference between collections.
- **Key Failure Modes & Edge Cases**: Trying to index into a set with `my_set[0]`; sets are unordered and do not support indexing.
- **Verification & Mastery Check**: Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.
- **Project Application**: PromptCLI: User prompt tag deduplication and stopword filtering.', '{"solution.py": "# Phase 0 // Lesson 0.25: Sets & Unique Item Filtering\n\ndef solve():\n    \"\"\"\n    Verification: Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.25", "subtopics_count": 4, "verification_criteria": "Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.", "subtopics": ["0.25.1 What is a Set: an unordered collection that automatically enforces uniqueness.", "0.25.2 Instant deduplication: turning lists into sets with `set(my_list)`.", "0.25.3 Fast membership testing: why checking `item in my_set` is lightning-fast compared to lists.", "0.25.4 Set operations: union, intersection, and difference between collections."]}'::jsonb, '["Explain how this implementation prevents: Trying to index into a set with `my_set[0]`; sets are unordered and do not support indexing.", "How does Sets & Unique Item Filtering scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-26', 'phase-00-lesson-26-reading-and-writing-files-in-python', 'module-1', 26, 'Lesson 1.26: Reading and Writing Files in Python', 'Prerequisites: Lesson 0.8', 'Prerequisites: Lesson 0.8 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 1300.0, '# Lesson 0.26: Reading and Writing Files in Python

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.26.1` The file system mental model: folders, files, relative paths vs absolute paths.
  - `0.26.2` Opening files safely: the `with open(...) as f:` context manager that closes files automatically.
  - `0.26.3` Reading files: `.read()`, `.readline()`, and iterating over lines efficiently.
  - `0.26.4` Writing files: write mode (`"w"`) vs append mode (`"a"`).
- **Key Failure Modes & Edge Cases**: Using write mode (`"w"`) instead of append mode (`"a"`), accidentally erasing existing file contents.
- **Verification & Mastery Check**: Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and appends the result to a log file.
- **Project Application**: PromptCLI: Local prompt template loading and output logging.', '{"solution.py": "# Phase 0 // Lesson 0.26: Reading and Writing Files in Python\n\ndef solve():\n    \"\"\"\n    Verification: Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and app\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.26", "subtopics_count": 4, "verification_criteria": "Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and appends the result to a log file.", "subtopics": ["0.26.1 The file system mental model: folders, files, relative paths vs absolute paths.", "0.26.2 Opening files safely: the `with open(...) as f:` context manager that closes files automatically.", "0.26.3 Reading files: `.read()`, `.readline()`, and iterating over lines efficiently.", "0.26.4 Writing files: write mode (`\"w\"`) vs append mode (`\"a\"`)."]}'::jsonb, '["Explain how this implementation prevents: Using write mode (`\"w\"`) instead of append mode (`\"a\"`), accidentally erasing existing file contents.", "How does Reading and Writing Files in Python scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-27', 'phase-00-lesson-27-json-data-serialization-and-parsing', 'module-1', 27, 'Lesson 1.27: JSON Data: Serialization and Parsing', 'Prerequisites: Lesson 0.24, Lesson 0.26', 'Prerequisites: Lesson 0.24, Lesson 0.26 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 1350.0, '# Lesson 0.27: JSON Data: Serialization and Parsing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.24, Lesson 0.26
- **Subtopics**:
  - `0.27.1` What is JSON: the universal data format used by modern web apps and AI APIs.
  - `0.27.2` Parsing JSON text into Python dictionaries using `json.loads()`.
  - `0.27.3` Serializing Python dictionaries into JSON text using `json.dumps()`.
  - `0.27.4` Reading and writing `.json` files directly with `json.load()` and `json.dump()`.
- **Key Failure Modes & Edge Cases**: Passing invalid JSON strings (like single quotes or trailing commas) to `json.loads()`, causing `JSONDecodeError`.
- **Verification & Mastery Check**: Parse a simulated LLM JSON response string, extract the message content, and save the structured record to `session.json`.
- **Project Application**: PromptCLI: Configuration management and structured response logging.', '{"solution.py": "# Phase 0 // Lesson 0.27: JSON Data: Serialization and Parsing\n\ndef solve():\n    \"\"\"\n    Verification: Parse a simulated LLM JSON response string, extract the message content, and save the structured rec\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.27", "subtopics_count": 4, "verification_criteria": "Parse a simulated LLM JSON response string, extract the message content, and save the structured record to `session.json`.", "subtopics": ["0.27.1 What is JSON: the universal data format used by modern web apps and AI APIs.", "0.27.2 Parsing JSON text into Python dictionaries using `json.loads()`.", "0.27.3 Serializing Python dictionaries into JSON text using `json.dumps()`.", "0.27.4 Reading and writing `.json` files directly with `json.load()` and `json.dump()`."]}'::jsonb, '["Explain how this implementation prevents: Passing invalid JSON strings (like single quotes or trailing commas) to `json.loads()`, causing `JSONDecodeError`.", "How does JSON Data: Serialization and Parsing scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-28', 'phase-00-lesson-28-error-handling-try-except-graceful-recove', 'module-1', 28, 'Lesson 1.28: Error Handling: try, except & Graceful Recovery', 'Prerequisites: Lesson 0.8', 'Prerequisites: Lesson 0.8 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 1400.0, '# Lesson 0.28: Error Handling: try, except & Graceful Recovery

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.28.1` Why programs fail: syntax errors vs runtime exceptions.
  - `0.28.2` Catching errors with `try` and `except`: keeping your application running when inputs are invalid.
  - `0.28.3` Specific exception types: `ValueError`, `KeyError`, `FileNotFoundError`, `TypeError`.
  - `0.28.4` The `finally` and `else` blocks: running cleanup routines reliably.
- **Key Failure Modes & Edge Cases**: Using a bare `except:` clause without specifying the error type, silently masking fatal bugs.
- **Verification & Mastery Check**: Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default prompt without crashing.
- **Project Application**: PromptCLI: Resilient input parser and configuration loader.', '{"solution.py": "# Phase 0 // Lesson 0.28: Error Handling: try, except & Graceful Recovery\n\ndef solve():\n    \"\"\"\n    Verification: Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.28", "subtopics_count": 4, "verification_criteria": "Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default prompt without crashing.", "subtopics": ["0.28.1 Why programs fail: syntax errors vs runtime exceptions.", "0.28.2 Catching errors with `try` and `except`: keeping your application running when inputs are invalid.", "0.28.3 Specific exception types: `ValueError`, `KeyError`, `FileNotFoundError`, `TypeError`.", "0.28.4 The `finally` and `else` blocks: running cleanup routines reliably."]}'::jsonb, '["Explain how this implementation prevents: Using a bare `except:` clause without specifying the error type, silently masking fatal bugs.", "How does Error Handling: try, except & Graceful Recovery scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-29', 'phase-00-lesson-29-environment-variables-secrets-management', 'module-1', 29, 'Lesson 1.29: Environment Variables & Secrets Management', 'Prerequisites: Lesson 0.26', 'Prerequisites: Lesson 0.26 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 1450.0, '# Lesson 0.29: Environment Variables & Secrets Management

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.26
- **Subtopics**:
  - `0.29.1` Why hardcoding secrets is dangerous: keeping API keys out of Git repositories.
  - `0.29.2` Reading environment variables with Python''s built-in `os.environ` and `os.getenv()`.
  - `0.29.3` Using `.env` files locally with `python-dotenv`.
  - `0.29.4` The `.gitignore` file: preventing secrets and local caches from ever being committed to GitHub.
- **Key Failure Modes & Edge Cases**: Committing an un-ignored `.env` file to a public repository, exposing production AI API keys.
- **Verification & Mastery Check**: Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the key is missing.
- **Project Application**: PromptCLI: Secure API key configuration manager.', '{"solution.py": "# Phase 0 // Lesson 0.29: Environment Variables & Secrets Management\n\ndef solve():\n    \"\"\"\n    Verification: Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.29", "subtopics_count": 4, "verification_criteria": "Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the key is missing.", "subtopics": ["0.29.1 Why hardcoding secrets is dangerous: keeping API keys out of Git repositories.", "0.29.2 Reading environment variables with Python''s built-in `os.environ` and `os.getenv()`.", "0.29.3 Using `.env` files locally with `python-dotenv`.", "0.29.4 The `.gitignore` file: preventing secrets and local caches from ever being committed to GitHub."]}'::jsonb, '["Explain how this implementation prevents: Committing an un-ignored `.env` file to a public repository, exposing production AI API keys.", "How does Environment Variables & Secrets Management scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-30', 'phase-00-lesson-30-making-http-get-and-post-requests-with-ht', 'module-1', 30, 'Lesson 1.30: Making HTTP GET and POST Requests with HTTPX', 'Prerequisites: Lesson 0.27, Lesson 0.29', 'Prerequisites: Lesson 0.27, Lesson 0.29 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 1500.0, '# Lesson 0.30: Making HTTP GET and POST Requests with HTTPX

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.27, Lesson 0.29
- **Subtopics**:
  - `0.30.1` The Client-Server model: how your computer talks to remote API servers across the internet.
  - `0.30.2` HTTP verbs: GET (fetching data) vs POST (submitting prompts and payloads).
  - `0.30.3` Sending headers: authentication tokens (`Bearer ...`) and Content-Type (`application/json`).
  - `0.30.4` Checking status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limited), 500 (Server Error).
- **Key Failure Modes & Edge Cases**: Forgetting to check `.status_code` or call `.raise_for_status()`, leading to subtle bugs on failed requests.
- **Verification & Mastery Check**: Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.
- **Project Application**: PromptCLI: Remote AI inference gateway client.', '{"solution.py": "# Phase 0 // Lesson 0.30: Making HTTP GET and POST Requests with HTTPX\n\ndef solve():\n    \"\"\"\n    Verification: Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.30", "subtopics_count": 4, "verification_criteria": "Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.", "subtopics": ["0.30.1 The Client-Server model: how your computer talks to remote API servers across the internet.", "0.30.2 HTTP verbs: GET (fetching data) vs POST (submitting prompts and payloads).", "0.30.3 Sending headers: authentication tokens (`Bearer ...`) and Content-Type (`application/json`).", "0.30.4 Checking status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limited), 500 (Server Error)."]}'::jsonb, '["Explain how this implementation prevents: Forgetting to check `.status_code` or call `.raise_for_status()`, leading to subtle bugs on failed requests.", "How does Making HTTP GET and POST Requests with HTTPX scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, phase_id = EXCLUDED.phase_id, order_index = EXCLUDED.order_index, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, cs_foundation = EXCLUDED.cs_foundation, ai_convergence = EXCLUDED.ai_convergence, xp_reward = EXCLUDED.xp_reward, level_required = EXCLUDED.level_required, position_x = EXCLUDED.position_x, position_y = EXCLUDED.position_y, handbook_markdown = EXCLUDED.handbook_markdown, starter_code = EXCLUDED.starter_code, test_suite = EXCLUDED.test_suite, defense_prompts = EXCLUDED.defense_prompts;
