INSERT INTO curriculum_nodes (id, slug, phase_id, order_index, title, subtitle, cs_foundation, ai_convergence, xp_reward, level_required, position_x, position_y, handbook_markdown, starter_code, test_suite, defense_prompts) VALUES
('node-0-1', 'phase-00-lesson-01-variables-data-types-the-interpreter', 'module-1', 1, 'Lesson 1.1: Variables, Data Types & The Interpreter', 'Prerequisites: None', 'Prerequisites: None | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 50.0, '# Lesson 0.1: Variables, Data Types & The Interpreter

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: None
- **Subtopics**:
  - `0.1.1` What is physical computer memory: RAM as numbered storage boxes.
  - `0.1.2` Variables as named sticky notes: assigning integers, floats, strings, and booleans.
  - `0.1.3` How Python''s interpreter runs code line-by-line in real time.
  - `0.1.4` Dynamic types: checking variable types with type() and changing types safely.
- **Key Failure Modes & Edge Cases**: Mixing incompatible data types (like adding text to a number), which triggers a TypeError.
- **Verification & Mastery Check**: Write a script that creates variables for an AI model''s name, version, and cost, and print their types.
- **Project Application**: PromptCLI: Storing user prompt settings and configurations.', '{"solution.py": "# Phase 0 // Lesson 0.1: Variables, Data Types & The Interpreter\n\ndef solve():\n    \"\"\"\n    Verification: Write a script that creates variables for an AI model''s name, version, and cost, and print their typ\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.1", "subtopics_count": 4, "verification_criteria": "Write a script that creates variables for an AI model''s name, version, and cost, and print their types.", "subtopics": ["0.1.1 What is physical computer memory: RAM as numbered storage boxes.", "0.1.2 Variables as named sticky notes: assigning integers, floats, strings, and booleans.", "0.1.3 How Python''s interpreter runs code line-by-line in real time.", "0.1.4 Dynamic types: checking variable types with type() and changing types safely."]}'::jsonb, '["Explain how this implementation prevents: Mixing incompatible data types (like adding text to a number), which triggers a TypeError.", "How does Variables, Data Types & The Interpreter scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-2', 'phase-00-lesson-02-expressions-operators-precedence', 'module-1', 2, 'Lesson 1.2: Expressions, Operators & Precedence', 'Prerequisites: Lesson 0.1', 'Prerequisites: Lesson 0.1 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 100.0, '# Lesson 0.2: Expressions, Operators & Precedence

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.1
- **Subtopics**:
  - `0.2.1` Math operators in code: addition, subtraction, multiplication, division, and modulo remainder.
  - `0.2.2` Order of operations (PEMDAS): how Python prioritizes math calculations.
  - `0.2.3` Comparison operators: checking if values are equal, greater than, or less than.
  - `0.2.4` Boolean logic: combining decisions with and, or, and not.
- **Key Failure Modes & Edge Cases**: Confusing assignment (=) with equality comparison (==), causing syntax crashes.
- **Verification & Mastery Check**: Calculate the total token cost of an AI request using math operators and print the rounded result.
- **Project Application**: PromptCLI: Token budget calculation utility.', '{"solution.py": "# Phase 0 // Lesson 0.2: Expressions, Operators & Precedence\n\ndef solve():\n    \"\"\"\n    Verification: Calculate the total token cost of an AI request using math operators and print the rounded result.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.2", "subtopics_count": 4, "verification_criteria": "Calculate the total token cost of an AI request using math operators and print the rounded result.", "subtopics": ["0.2.1 Math operators in code: addition, subtraction, multiplication, division, and modulo remainder.", "0.2.2 Order of operations (PEMDAS): how Python prioritizes math calculations.", "0.2.3 Comparison operators: checking if values are equal, greater than, or less than.", "0.2.4 Boolean logic: combining decisions with and, or, and not."]}'::jsonb, '["Explain how this implementation prevents: Confusing assignment (=) with equality comparison (==), causing syntax crashes.", "How does Expressions, Operators & Precedence scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-3', 'phase-00-lesson-03-string-indexing-slicing-manipulation', 'module-1', 3, 'Lesson 1.3: String Indexing, Slicing & Manipulation', 'Prerequisites: Lesson 0.1', 'Prerequisites: Lesson 0.1 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 150.0, '# Lesson 0.3: String Indexing, Slicing & Manipulation

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.1
- **Subtopics**:
  - `0.3.1` Strings as sequences: character positions starting from index 0.
  - `0.3.2` Negative indexing: easily getting the last characters of a word with -1.
  - `0.3.3` Slicing strings: cutting out substrings using [start:stop:step].
  - `0.3.4` Helpful string tools: stripping whitespace, changing case, splitting sentences, and joining words.
- **Key Failure Modes & Edge Cases**: Asking for an index beyond the end of the text, causing an IndexError.
- **Verification & Mastery Check**: Clean a messy user prompt string by stripping unwanted spaces and extracting the first 50 characters.
- **Project Application**: PromptCLI: Prompt cleaning and input truncation engine.', '{"solution.py": "# Phase 0 // Lesson 0.3: String Indexing, Slicing & Manipulation\n\ndef solve():\n    \"\"\"\n    Verification: Clean a messy user prompt string by stripping unwanted spaces and extracting the first 50 characters\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.3", "subtopics_count": 4, "verification_criteria": "Clean a messy user prompt string by stripping unwanted spaces and extracting the first 50 characters.", "subtopics": ["0.3.1 Strings as sequences: character positions starting from index 0.", "0.3.2 Negative indexing: easily getting the last characters of a word with -1.", "0.3.3 Slicing strings: cutting out substrings using [start:stop:step].", "0.3.4 Helpful string tools: stripping whitespace, changing case, splitting sentences, and joining words."]}'::jsonb, '["Explain how this implementation prevents: Asking for an index beyond the end of the text, causing an IndexError.", "How does String Indexing, Slicing & Manipulation scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-4', 'phase-00-lesson-04-conditional-branching-if-elif-else', 'module-1', 4, 'Lesson 1.4: Conditional Branching: if, elif, else', 'Prerequisites: Lesson 0.2', 'Prerequisites: Lesson 0.2 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 200.0, '# Lesson 0.4: Conditional Branching: if, elif, else

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.2
- **Subtopics**:
  - `0.4.1` Making decisions in code: the if statement and boolean tests.
  - `0.4.2` Alternative paths: using elif for multiple choices and else for fallbacks.
  - `0.4.3` Python indentation rules: using consistent 4 spaces to define code blocks.
  - `0.4.4` Truthiness: understanding which values count as True and which count as False.
- **Key Failure Modes & Edge Cases**: Inconsistent indentation mixing tabs and spaces, triggering IndentationError.
- **Verification & Mastery Check**: Write a decision tree that routes a user prompt to either a fast model or a smart model based on length.
- **Project Application**: PromptCLI: Smart model routing logic.', '{"solution.py": "# Phase 0 // Lesson 0.4: Conditional Branching: if, elif, else\n\ndef solve():\n    \"\"\"\n    Verification: Write a decision tree that routes a user prompt to either a fast model or a smart model based on len\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.4", "subtopics_count": 4, "verification_criteria": "Write a decision tree that routes a user prompt to either a fast model or a smart model based on length.", "subtopics": ["0.4.1 Making decisions in code: the if statement and boolean tests.", "0.4.2 Alternative paths: using elif for multiple choices and else for fallbacks.", "0.4.3 Python indentation rules: using consistent 4 spaces to define code blocks.", "0.4.4 Truthiness: understanding which values count as True and which count as False."]}'::jsonb, '["Explain how this implementation prevents: Inconsistent indentation mixing tabs and spaces, triggering IndentationError.", "How does Conditional Branching: if, elif, else scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-5', 'phase-00-lesson-05-while-loops-loop-invariants', 'module-1', 5, 'Lesson 1.5: While Loops & Loop Invariants', 'Prerequisites: Lesson 0.4', 'Prerequisites: Lesson 0.4 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 250.0, '# Lesson 0.5: While Loops & Loop Invariants

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.4
- **Subtopics**:
  - `0.5.1` Repetition in programming: repeating actions while a condition remains True.
  - `0.5.2` Loop counters: updating variables to prevent programs from running forever.
  - `0.5.3` Sentinel loops: draining a list of items until none remain.
  - `0.5.4` Understanding loop safety: ensuring your loop always reaches a stopping point.
- **Key Failure Modes & Edge Cases**: Forgetting to increment the loop counter, causing an infinite loop that freezes your terminal.
- **Verification & Mastery Check**: Write a retry loop that attempts an imaginary network connection up to 3 times before giving up.
- **Project Application**: PromptCLI: Network retry loop for API requests.', '{"solution.py": "# Phase 0 // Lesson 0.5: While Loops & Loop Invariants\n\ndef solve():\n    \"\"\"\n    Verification: Write a retry loop that attempts an imaginary network connection up to 3 times before giving up.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.5", "subtopics_count": 4, "verification_criteria": "Write a retry loop that attempts an imaginary network connection up to 3 times before giving up.", "subtopics": ["0.5.1 Repetition in programming: repeating actions while a condition remains True.", "0.5.2 Loop counters: updating variables to prevent programs from running forever.", "0.5.3 Sentinel loops: draining a list of items until none remain.", "0.5.4 Understanding loop safety: ensuring your loop always reaches a stopping point."]}'::jsonb, '["Explain how this implementation prevents: Forgetting to increment the loop counter, causing an infinite loop that freezes your terminal.", "How does While Loops & Loop Invariants scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-6', 'phase-00-lesson-06-for-loops-the-range-generator', 'module-1', 6, 'Lesson 1.6: For Loops & The range() Generator', 'Prerequisites: Lesson 0.5', 'Prerequisites: Lesson 0.5 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 300.0, '# Lesson 0.6: For Loops & The range() Generator

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.5
- **Subtopics**:
  - `0.6.1` The for loop: iterating through every item in a collection automatically.
  - `0.6.2` The range() function: generating sequential numbers on demand without wasting memory.
  - `0.6.3` Looping with indexes: using enumerate() to track both the position and the item.
  - `0.6.4` Nested loops: running an inner loop inside an outer loop cleanly.
- **Key Failure Modes & Edge Cases**: Confusing range(1, 5) which produces 1, 2, 3, 4 with numbers 1 through 5.
- **Verification & Mastery Check**: Iterate over a list of 5 user prompts, numbering each one and printing its character count.
- **Project Application**: PromptCLI: Batch prompt processing loop.', '{"solution.py": "# Phase 0 // Lesson 0.6: For Loops & The range() Generator\n\ndef solve():\n    \"\"\"\n    Verification: Iterate over a list of 5 user prompts, numbering each one and printing its character count.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.6", "subtopics_count": 4, "verification_criteria": "Iterate over a list of 5 user prompts, numbering each one and printing its character count.", "subtopics": ["0.6.1 The for loop: iterating through every item in a collection automatically.", "0.6.2 The range() function: generating sequential numbers on demand without wasting memory.", "0.6.3 Looping with indexes: using enumerate() to track both the position and the item.", "0.6.4 Nested loops: running an inner loop inside an outer loop cleanly."]}'::jsonb, '["Explain how this implementation prevents: Confusing range(1, 5) which produces 1, 2, 3, 4 with numbers 1 through 5.", "How does For Loops & The range() Generator scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-7', 'phase-00-lesson-07-loop-control-break-continue-else', 'module-1', 7, 'Lesson 1.7: Loop Control: break, continue & else', 'Prerequisites: Lesson 0.6', 'Prerequisites: Lesson 0.6 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 350.0, '# Lesson 0.7: Loop Control: break, continue & else

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.6
- **Subtopics**:
  - `0.7.1` Early exits: stopping a loop immediately using the break keyword.
  - `0.7.2` Skipping turns: jumping to the next iteration using the continue keyword.
  - `0.7.3` The loop else clause: running fallback code only when a loop finishes without breaking.
  - `0.7.4` Practical search patterns: finding an item in a list and exiting as soon as it is found.
- **Key Failure Modes & Edge Cases**: Placing break outside of a loop or conditional, causing immediate unexpected loop termination.
- **Verification & Mastery Check**: Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.
- **Project Application**: PromptCLI: Content moderation scanner.', '{"solution.py": "# Phase 0 // Lesson 0.7: Loop Control: break, continue & else\n\ndef solve():\n    \"\"\"\n    Verification: Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.7", "subtopics_count": 4, "verification_criteria": "Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.", "subtopics": ["0.7.1 Early exits: stopping a loop immediately using the break keyword.", "0.7.2 Skipping turns: jumping to the next iteration using the continue keyword.", "0.7.3 The loop else clause: running fallback code only when a loop finishes without breaking.", "0.7.4 Practical search patterns: finding an item in a list and exiting as soon as it is found."]}'::jsonb, '["Explain how this implementation prevents: Placing break outside of a loop or conditional, causing immediate unexpected loop termination.", "How does Loop Control: break, continue & else scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-8', 'phase-00-lesson-08-functions-parameters-arguments-returns', 'module-1', 8, 'Lesson 1.8: Functions: Parameters, Arguments & Returns', 'Prerequisites: Lesson 0.4', 'Prerequisites: Lesson 0.4 | Subtopics: 4 items', 'Systems project application', 100, 1, 120.0, 400.0, '# Lesson 0.8: Functions: Parameters, Arguments & Returns

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.4
- **Subtopics**:
  - `0.8.1` Packaging reusable code: defining functions with def and calling them.
  - `0.8.2` Passing data into functions: positional parameters and keyword arguments.
  - `0.8.3` Default values: setting safe defaults for optional parameters.
  - `0.8.4` Returning values: sending results back to the caller using return.
- **Key Failure Modes & Edge Cases**: Forgetting to return a value, causing the function to silently evaluate to None.
- **Verification & Mastery Check**: Write a function format_prompt(template, topic, style=''concise'') that returns a formatted AI prompt.
- **Project Application**: PromptCLI: Core prompt templating engine.', '{"solution.py": "# Phase 0 // Lesson 0.8: Functions: Parameters, Arguments & Returns\n\ndef solve():\n    \"\"\"\n    Verification: Write a function format_prompt(template, topic, style=''concise'') that returns a formatted AI prompt.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.8", "subtopics_count": 4, "verification_criteria": "Write a function format_prompt(template, topic, style=''concise'') that returns a formatted AI prompt.", "subtopics": ["0.8.1 Packaging reusable code: defining functions with def and calling them.", "0.8.2 Passing data into functions: positional parameters and keyword arguments.", "0.8.3 Default values: setting safe defaults for optional parameters.", "0.8.4 Returning values: sending results back to the caller using return."]}'::jsonb, '["Explain how this implementation prevents: Forgetting to return a value, causing the function to silently evaluate to None.", "How does Functions: Parameters, Arguments & Returns scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-9', 'phase-00-lesson-09-variable-scope-local-global-enclosing', 'module-1', 9, 'Lesson 1.9: Variable Scope: Local, Global & Enclosing', 'Prerequisites: Lesson 0.8', 'Prerequisites: Lesson 0.8 | Subtopics: 4 items', 'Systems project application', 100, 1, 0.0, 450.0, '# Lesson 0.9: Variable Scope: Local, Global & Enclosing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.9.1` Scope boundaries: why variables created inside a function cannot be seen outside.
  - `0.9.2` The LEGB lookup order: how Python searches for variable names.
  - `0.9.3` Global variables: when to read them and why modifying them from functions is risky.
  - `0.9.4` Clean function design: passing arguments explicitly rather than relying on global state.
- **Key Failure Modes & Edge Cases**: UnboundLocalError caused by trying to modify a global variable inside a function without declaring it.
- **Verification & Mastery Check**: Refactor code that relies on 3 global variables into pure functions that take inputs and return outputs.
- **Project Application**: PromptCLI: Configuration isolation.', '{"solution.py": "# Phase 0 // Lesson 0.9: Variable Scope: Local, Global & Enclosing\n\ndef solve():\n    \"\"\"\n    Verification: Refactor code that relies on 3 global variables into pure functions that take inputs and return outp\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.9", "subtopics_count": 4, "verification_criteria": "Refactor code that relies on 3 global variables into pure functions that take inputs and return outputs.", "subtopics": ["0.9.1 Scope boundaries: why variables created inside a function cannot be seen outside.", "0.9.2 The LEGB lookup order: how Python searches for variable names.", "0.9.3 Global variables: when to read them and why modifying them from functions is risky.", "0.9.4 Clean function design: passing arguments explicitly rather than relying on global state."]}'::jsonb, '["Explain how this implementation prevents: UnboundLocalError caused by trying to modify a global variable inside a function without declaring it.", "How does Variable Scope: Local, Global & Enclosing scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
('node-0-10', 'phase-00-lesson-10-lists-dynamic-sequential-arrays', 'module-1', 10, 'Lesson 1.10: Lists: Dynamic Sequential Arrays', 'Prerequisites: Lesson 0.3', 'Prerequisites: Lesson 0.3 | Subtopics: 4 items', 'Systems project application', 100, 1, 60.0, 500.0, '# Lesson 0.10: Lists: Dynamic Sequential Arrays

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.3
- **Subtopics**:
  - `0.10.1` Ordered collections: storing multiple items in a Python list.
  - `0.10.2` Adding and removing items: append(), extend(), insert(), and pop().
  - `0.10.3` Searching and counting: using in, index(), and count().
  - `0.10.4` Sorting lists: sorting in-place with sort() vs creating a new list with sorted().
- **Key Failure Modes & Edge Cases**: Modifying a list while looping over it, causing items to be skipped unintentionally.
- **Verification & Mastery Check**: Build a history tracker that appends user messages, limits history to 10 items, and prints them in order.
- **Project Application**: PromptCLI: Conversation history list manager.', '{"solution.py": "# Phase 0 // Lesson 0.10: Lists: Dynamic Sequential Arrays\n\ndef solve():\n    \"\"\"\n    Verification: Build a history tracker that appends user messages, limits history to 10 items, and prints them in o\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.10", "subtopics_count": 4, "verification_criteria": "Build a history tracker that appends user messages, limits history to 10 items, and prints them in order.", "subtopics": ["0.10.1 Ordered collections: storing multiple items in a Python list.", "0.10.2 Adding and removing items: append(), extend(), insert(), and pop().", "0.10.3 Searching and counting: using in, index(), and count().", "0.10.4 Sorting lists: sorting in-place with sort() vs creating a new list with sorted()."]}'::jsonb, '["Explain how this implementation prevents: Modifying a list while looping over it, causing items to be skipped unintentionally.", "How does Lists: Dynamic Sequential Arrays scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb),
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
- **Project Application**: PromptCLI: User prompt tag deduplication and stopword filtering.', '{"solution.py": "# Phase 0 // Lesson 0.25: Sets & Unique Item Filtering\n\ndef solve():\n    \"\"\"\n    Verification: Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.25", "subtopics_count": 4, "verification_criteria": "Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.", "subtopics": ["0.25.1 What is a Set: an unordered collection that automatically enforces uniqueness.", "0.25.2 Instant deduplication: turning lists into sets with `set(my_list)`.", "0.25.3 Fast membership testing: why checking `item in my_set` is lightning-fast compared to lists.", "0.25.4 Set operations: union, intersection, and difference between collections."]}'::jsonb, '["Explain how this implementation prevents: Trying to index into a set with `my_set[0]`; sets are unordered and do not support indexing.", "How does Sets & Unique Item Filtering scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb)
ON CONFLICT (id) DO UPDATE SET slug = EXCLUDED.slug, phase_id = EXCLUDED.phase_id, order_index = EXCLUDED.order_index, title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, cs_foundation = EXCLUDED.cs_foundation, ai_convergence = EXCLUDED.ai_convergence, xp_reward = EXCLUDED.xp_reward, level_required = EXCLUDED.level_required, position_x = EXCLUDED.position_x, position_y = EXCLUDED.position_y, handbook_markdown = EXCLUDED.handbook_markdown, starter_code = EXCLUDED.starter_code, test_suite = EXCLUDED.test_suite, defense_prompts = EXCLUDED.defense_prompts;
