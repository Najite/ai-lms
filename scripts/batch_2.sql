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