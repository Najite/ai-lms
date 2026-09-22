INSERT INTO curriculum_nodes (id, slug, phase_id, order_index, title, subtitle, cs_foundation, ai_convergence, xp_reward, level_required, position_x, position_y, handbook_markdown, starter_code, test_suite, defense_prompts) VALUES
('node-0-11', 'phase-00-lesson-11-list-comprehensions-transforms', 'module-1', 11, 'Lesson 1.11: List Comprehensions & Transforms', 'Prerequisites: Lesson 0.10', 'Prerequisites: Lesson 0.10 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 550.0, '# Lesson 0.11: List Comprehensions & Transforms

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.11.1` Readable transforms: replacing multi-line for loops with single-line comprehensions.
  - `0.11.2` Filtering with if: keeping only items that match specific criteria.
  - `0.11.3` Comprehension syntax: [expression for item in iterable if condition].
  - `0.11.4` Performance benefits: why list comprehensions run faster than manual append loops.
- **Key Failure Modes & Edge Cases**: Writing overly complex nested comprehensions that are unreadable to other engineers.
- **Verification & Mastery Check**: Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.
- **Project Application**: PromptCLI: High-speed prompt batch normalization.', '{"solution.py": "# Phase 0 // Lesson 0.11: List Comprehensions & Transforms\n\ndef solve():\n    \"\"\"\n    Verification: Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.11", "subtopics_count": 4, "verification_criteria": "Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.", "subtopics": ["0.11.1 Readable transforms: replacing multi-line for loops with single-line comprehensions.", "0.11.2 Filtering with if: keeping only items that match specific criteria.", "0.11.3 Comprehension syntax: [expression for item in iterable if condition].", "0.11.4 Performance benefits: why list comprehensions run faster than manual append loops."]}'::jsonb, '["Explain how this implementation prevents: Writing overly complex nested comprehensions that are unreadable to other engineers.", "How does List Comprehensions & Transforms scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-12', 'phase-00-lesson-12-tuples-fixed-immutable-sequences', 'module-1', 12, 'Lesson 1.12: Tuples: Fixed Immutable Sequences', 'Prerequisites: Lesson 0.10', 'Prerequisites: Lesson 0.10 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 600.0, '# Lesson 0.12: Tuples: Fixed Immutable Sequences

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.12.1` Immutable collections: creating fixed groups of items with parentheses ().
  - `0.12.2` Why immutability matters: safety against accidental changes and lower memory usage.
  - `0.12.3` Tuple unpacking: assigning multiple variables at once from a single tuple.
  - `0.12.4` Returning multiple values: returning tuples from functions cleanly.
- **Key Failure Modes & Edge Cases**: Attempting to modify a tuple element, causing a TypeError.
- **Verification & Mastery Check**: Write a function that returns the token count, character count, and estimated cost as an unpacked tuple.
- **Project Application**: PromptCLI: Multi-value metrics calculation.', '{"solution.py": "# Phase 0 // Lesson 0.12: Tuples: Fixed Immutable Sequences\n\ndef solve():\n    \"\"\"\n    Verification: Write a function that returns the token count, character count, and estimated cost as an unpacked tu\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.12", "subtopics_count": 4, "verification_criteria": "Write a function that returns the token count, character count, and estimated cost as an unpacked tuple.", "subtopics": ["0.12.1 Immutable collections: creating fixed groups of items with parentheses ().", "0.12.2 Why immutability matters: safety against accidental changes and lower memory usage.", "0.12.3 Tuple unpacking: assigning multiple variables at once from a single tuple.", "0.12.4 Returning multiple values: returning tuples from functions cleanly."]}'::jsonb, '["Explain how this implementation prevents: Attempting to modify a tuple element, causing a TypeError.", "How does Tuples: Fixed Immutable Sequences scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-13', 'phase-00-lesson-13-dictionaries-key-value-hash-maps', 'module-1', 13, 'Lesson 1.13: Dictionaries: Key-Value Hash Maps', 'Prerequisites: Lesson 0.10', 'Prerequisites: Lesson 0.10 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 650.0, '# Lesson 0.13: Dictionaries: Key-Value Hash Maps

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.13.1` Mapping relationships: pairing unique keys with values using dictionaries {}.
  - `0.13.2` Accessing data safely: using square brackets [] vs the safe get() method with fallbacks.
  - `0.13.3` Updating and deleting: adding new keys, updating existing keys, and using pop().
  - `0.13.4` Iterating dictionaries: looping over keys(), values(), and items() key-value pairs.
- **Key Failure Modes & Edge Cases**: Accessing a non-existent key with [] instead of get(), triggering a KeyError crash.
- **Verification & Mastery Check**: Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely.
- **Project Application**: PromptCLI: Model hyperparameter state management.', '{"solution.py": "# Phase 0 // Lesson 0.13: Dictionaries: Key-Value Hash Maps\n\ndef solve():\n    \"\"\"\n    Verification: Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.13", "subtopics_count": 4, "verification_criteria": "Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely.", "subtopics": ["0.13.1 Mapping relationships: pairing unique keys with values using dictionaries {}.", "0.13.2 Accessing data safely: using square brackets [] vs the safe get() method with fallbacks.", "0.13.3 Updating and deleting: adding new keys, updating existing keys, and using pop().", "0.13.4 Iterating dictionaries: looping over keys(), values(), and items() key-value pairs."]}'::jsonb, '["Explain how this implementation prevents: Accessing a non-existent key with [] instead of get(), triggering a KeyError crash.", "How does Dictionaries: Key-Value Hash Maps scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-14', 'phase-00-lesson-14-sets-unique-elements-set-algebra', 'module-1', 14, 'Lesson 1.14: Sets: Unique Elements & Set Algebra', 'Prerequisites: Lesson 0.13', 'Prerequisites: Lesson 0.13 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 700.0, '# Lesson 0.14: Sets: Unique Elements & Set Algebra

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.13
- **Subtopics**:
  - `0.14.1` Unique collections: automatically deduplicating items with sets {}.
  - `0.14.2` High-speed lookups: why in checks are virtually instantaneous in sets.
  - `0.14.3` Mathematical set operations: union (|), intersection (&), and difference (-).
  - `0.14.4` When to use sets: removing duplicate user tags or detecting shared vocabulary.
- **Key Failure Modes & Edge Cases**: Attempting to put a mutable list into a set, triggering a TypeError: unhashable type.
- **Verification & Mastery Check**: Find all unique words used in two different user prompts and calculate their overlap using intersection.
- **Project Application**: PromptCLI: Prompt vocabulary similarity calculator.', '{"solution.py": "# Phase 0 // Lesson 0.14: Sets: Unique Elements & Set Algebra\n\ndef solve():\n    \"\"\"\n    Verification: Find all unique words used in two different user prompts and calculate their overlap using intersect\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.14", "subtopics_count": 4, "verification_criteria": "Find all unique words used in two different user prompts and calculate their overlap using intersection.", "subtopics": ["0.14.1 Unique collections: automatically deduplicating items with sets {}.", "0.14.2 High-speed lookups: why in checks are virtually instantaneous in sets.", "0.14.3 Mathematical set operations: union (|), intersection (&), and difference (-).", "0.14.4 When to use sets: removing duplicate user tags or detecting shared vocabulary."]}'::jsonb, '["Explain how this implementation prevents: Attempting to put a mutable list into a set, triggering a TypeError: unhashable type.", "How does Sets: Unique Elements & Set Algebra scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-15', 'phase-00-lesson-15-file-i-o-reading-writing-files', 'module-1', 15, 'Lesson 1.15: File I/O: Reading & Writing Files', 'Prerequisites: Lesson 0.8', 'Prerequisites: Lesson 0.8 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 750.0, '# Lesson 0.15: File I/O: Reading & Writing Files

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.15.1` Interacting with disk files: opening, reading, and writing text files.
  - `0.15.2` The with open() context manager: automatically closing files even if errors happen.
  - `0.15.3` Reading modes: read(), readline(), and readlines() line-by-line.
  - `0.15.4` Writing vs appending: overwriting files with ''w'' vs adding new lines with ''a''.
- **Key Failure Modes & Edge Cases**: Forgetting with open(), leaving file handles locked in the operating system.
- **Verification & Mastery Check**: Read a system prompt template from a local file, replace a placeholder with user input, and save the result.
- **Project Application**: PromptCLI: Prompt template file loader.', '{"solution.py": "# Phase 0 // Lesson 0.15: File I/O: Reading & Writing Files\n\ndef solve():\n    \"\"\"\n    Verification: Read a system prompt template from a local file, replace a placeholder with user input, and save the\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.15", "subtopics_count": 4, "verification_criteria": "Read a system prompt template from a local file, replace a placeholder with user input, and save the result.", "subtopics": ["0.15.1 Interacting with disk files: opening, reading, and writing text files.", "0.15.2 The with open() context manager: automatically closing files even if errors happen.", "0.15.3 Reading modes: read(), readline(), and readlines() line-by-line.", "0.15.4 Writing vs appending: overwriting files with ''w'' vs adding new lines with ''a''."]}'::jsonb, '["Explain how this implementation prevents: Forgetting with open(), leaving file handles locked in the operating system.", "How does File I/O: Reading & Writing Files scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
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
- **Project Application**: PromptCLI: Interactive troubleshooting and bug fixing.', '{"solution.py": "# Phase 0 // Lesson 0.20: Debugging with print & Python pdb\n\ndef solve():\n    \"\"\"\n    Verification: Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.20", "subtopics_count": 4, "verification_criteria": "Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.", "subtopics": ["0.20.1 Debugging mindset: how to track down why code behaves differently than you expected.", "0.20.2 Strategic print debugging: using f-strings to inspect variable states at key checkpoints.", "0.20.3 Interactive debugging with breakpoint(): pausing program execution in the terminal.", "0.20.4 Core debugger commands: n (next line), s (step inside), c (continue), and p (print variable)."]}'::jsonb, '["Explain how this implementation prevents: Leaving leftover debugging print statements scattered across production codebases.", "How does Debugging with print & Python pdb scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, phase_id = EXCLUDED.phase_id, order_index = EXCLUDED.order_index, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, cs_foundation = EXCLUDED.cs_foundation, ai_convergence = EXCLUDED.ai_convergence, xp_reward = EXCLUDED.xp_reward, level_required = EXCLUDED.level_required, position_x = EXCLUDED.position_x, position_y = EXCLUDED.position_y, handbook_markdown = EXCLUDED.handbook_markdown, starter_code = EXCLUDED.starter_code, test_suite = EXCLUDED.test_suite, defense_prompts = EXCLUDED.defense_prompts;
