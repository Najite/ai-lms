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