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
- **Project Application**: PromptCLI: Network retry loop for API requests.', '{"solution.py": "# Phase 0 // Lesson 0.5: While Loops & Loop Invariants\n\ndef solve():\n    \"\"\"\n    Verification: Write a retry loop that attempts an imaginary network connection up to 3 times before giving up.\n    \"\"\"\n    pass\n"}'::jsonb, '{"lesson": "0.5", "subtopics_count": 4, "verification_criteria": "Write a retry loop that attempts an imaginary network connection up to 3 times before giving up.", "subtopics": ["0.5.1 Repetition in programming: repeating actions while a condition remains True.", "0.5.2 Loop counters: updating variables to prevent programs from running forever.", "0.5.3 Sentinel loops: draining a list of items until none remain.", "0.5.4 Understanding loop safety: ensuring your loop always reaches a stopping point."]}'::jsonb, '["Explain how this implementation prevents: Forgetting to increment the loop counter, causing an infinite loop that freezes your terminal.", "How does While Loops & Loop Invariants scale under memory and concurrency constraints?", "Defend the architectural tradeoffs of this design in production."]'::jsonb) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;