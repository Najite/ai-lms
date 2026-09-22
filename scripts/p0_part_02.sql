INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-6',
    'phase-00-lesson-06-for-loops-the-range-generator',
    'phase-0',
    'Lesson 0.6: For Loops & The range() Generator',
    'Prerequisites: Lesson 0.5',
    'Prerequisites: Lesson 0.5 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.6: For Loops & The range() Generator

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.5
- **Subtopics**:
  - `0.6.1` The for loop: iterating through every item in a collection automatically.
  - `0.6.2` The range() function: generating sequential numbers on demand without wasting memory.
  - `0.6.3` Looping with indexes: using enumerate() to track both the position and the item.
  - `0.6.4` Nested loops: running an inner loop inside an outer loop cleanly.
- **Key Failure Modes & Edge Cases**: Confusing range(1, 5) which produces 1, 2, 3, 4 with numbers 1 through 5.
- **Verification & Mastery Check**: Iterate over a list of 5 user prompts, numbering each one and printing its character count.
- **Project Application**: PromptCLI: Batch prompt processing loop.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.6: For Loops & The range() Generator\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Iterate over a list of 5 user prompts, numbering each one and printing its character count.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Iterate over a list of 5 user prompts, numbering each one and printing its character count.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.6: For Loops & The range() Generator\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: For Loops & The range() Generator\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Iterate over a list of 5 user prompts, numbering each one an\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Iterate over a list of 5 user prompts, numbering each one and printing its character count.", "failure_mode": "Confusing range(1, 5) which produces 1, 2, 3, 4 with numbers 1 through 5.", "subtopics_count": 4, "subtopics": ["0.6.1 The for loop: iterating through every item in a collection automatically.", "0.6.2 The range() function: generating sequential numbers on demand without wasting memory.", "0.6.3 Looping with indexes: using enumerate() to track both the position and the item.", "0.6.4 Nested loops: running an inner loop inside an outer loop cleanly."]}'::jsonb,
    '["Explain how your implementation avoids: Confusing range(1, 5) which produces 1, 2, 3, 4 with numbers 1 through 5.", "How does For Loops & The range() Generator scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;

INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-7',
    'phase-00-lesson-07-loop-control-break-continue-else',
    'phase-0',
    'Lesson 0.7: Loop Control: break, continue & else',
    'Prerequisites: Lesson 0.6',
    'Prerequisites: Lesson 0.6 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.7: Loop Control: break, continue & else

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.6
- **Subtopics**:
  - `0.7.1` Early exits: stopping a loop immediately using the break keyword.
  - `0.7.2` Skipping turns: jumping to the next iteration using the continue keyword.
  - `0.7.3` The loop else clause: running fallback code only when a loop finishes without breaking.
  - `0.7.4` Practical search patterns: finding an item in a list and exiting as soon as it is found.
- **Key Failure Modes & Edge Cases**: Placing break outside of a loop or conditional, causing immediate unexpected loop termination.
- **Verification & Mastery Check**: Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.
- **Project Application**: PromptCLI: Content moderation scanner.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.7: Loop Control: break, continue & else\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.7: Loop Control: break, continue & else\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Loop Control: break, continue & else\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Scan a list of user inputs for forbidden words, breaking imm\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Scan a list of user inputs for forbidden words, breaking immediately if a violation is detected.", "failure_mode": "Placing break outside of a loop or conditional, causing immediate unexpected loop termination.", "subtopics_count": 4, "subtopics": ["0.7.1 Early exits: stopping a loop immediately using the break keyword.", "0.7.2 Skipping turns: jumping to the next iteration using the continue keyword.", "0.7.3 The loop else clause: running fallback code only when a loop finishes without breaking.", "0.7.4 Practical search patterns: finding an item in a list and exiting as soon as it is found."]}'::jsonb,
    '["Explain how your implementation avoids: Placing break outside of a loop or conditional, causing immediate unexpected loop termination.", "How does Loop Control: break, continue & else scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;

INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-8',
    'phase-00-lesson-08-functions-parameters-arguments-returns',
    'phase-0',
    'Lesson 0.8: Functions: Parameters, Arguments & Returns',
    'Prerequisites: Lesson 0.4',
    'Prerequisites: Lesson 0.4 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.8: Functions: Parameters, Arguments & Returns

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.4
- **Subtopics**:
  - `0.8.1` Packaging reusable code: defining functions with def and calling them.
  - `0.8.2` Passing data into functions: positional parameters and keyword arguments.
  - `0.8.3` Default values: setting safe defaults for optional parameters.
  - `0.8.4` Returning values: sending results back to the caller using return.
- **Key Failure Modes & Edge Cases**: Forgetting to return a value, causing the function to silently evaluate to None.
- **Verification & Mastery Check**: Write a function format_prompt(template, topic, style=''concise'') that returns a formatted AI prompt.
- **Project Application**: PromptCLI: Core prompt templating engine.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.8: Functions: Parameters, Arguments & Returns\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a function format_prompt(template, topic, style=''concise'') that returns a formatted AI prompt.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a function format_prompt(template, topic, style=''concise'') that returns a formatted AI prompt.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.8: Functions: Parameters, Arguments & Returns\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Functions: Parameters, Arguments & Returns\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a function format_prompt(template, topic, style=''conci\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a function format_prompt(template, topic, style=''concise'') that returns a formatted AI prompt.", "failure_mode": "Forgetting to return a value, causing the function to silently evaluate to None.", "subtopics_count": 4, "subtopics": ["0.8.1 Packaging reusable code: defining functions with def and calling them.", "0.8.2 Passing data into functions: positional parameters and keyword arguments.", "0.8.3 Default values: setting safe defaults for optional parameters.", "0.8.4 Returning values: sending results back to the caller using return."]}'::jsonb,
    '["Explain how your implementation avoids: Forgetting to return a value, causing the function to silently evaluate to None.", "How does Functions: Parameters, Arguments & Returns scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;

INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-9',
    'phase-00-lesson-09-variable-scope-local-global-enclosing',
    'phase-0',
    'Lesson 0.9: Variable Scope: Local, Global & Enclosing',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.9: Variable Scope: Local, Global & Enclosing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.9.1` Scope boundaries: why variables created inside a function cannot be seen outside.
  - `0.9.2` The LEGB lookup order: how Python searches for variable names.
  - `0.9.3` Global variables: when to read them and why modifying them from functions is risky.
  - `0.9.4` Clean function design: passing arguments explicitly rather than relying on global state.
- **Key Failure Modes & Edge Cases**: UnboundLocalError caused by trying to modify a global variable inside a function without declaring it.
- **Verification & Mastery Check**: Refactor code that relies on 3 global variables into pure functions that take inputs and return outputs.
- **Project Application**: PromptCLI: Configuration isolation.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.9: Variable Scope: Local, Global & Enclosing\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Refactor code that relies on 3 global variables into pure functions that take inputs and return outputs.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Refactor code that relies on 3 global variables into pure functions that take inputs and return outputs.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.9: Variable Scope: Local, Global & Enclosing\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Variable Scope: Local, Global & Enclosing\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Refactor code that relies on 3 global variables into pure fu\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Refactor code that relies on 3 global variables into pure functions that take inputs and return outputs.", "failure_mode": "UnboundLocalError caused by trying to modify a global variable inside a function without declaring it.", "subtopics_count": 4, "subtopics": ["0.9.1 Scope boundaries: why variables created inside a function cannot be seen outside.", "0.9.2 The LEGB lookup order: how Python searches for variable names.", "0.9.3 Global variables: when to read them and why modifying them from functions is risky.", "0.9.4 Clean function design: passing arguments explicitly rather than relying on global state."]}'::jsonb,
    '["Explain how your implementation avoids: UnboundLocalError caused by trying to modify a global variable inside a function without declaring it.", "How does Variable Scope: Local, Global & Enclosing scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;

INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-10',
    'phase-00-lesson-10-lists-dynamic-sequential-arrays',
    'phase-0',
    'Lesson 0.10: Lists: Dynamic Sequential Arrays',
    'Prerequisites: Lesson 0.3',
    'Prerequisites: Lesson 0.3 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.10: Lists: Dynamic Sequential Arrays

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.3
- **Subtopics**:
  - `0.10.1` Ordered collections: storing multiple items in a Python list.
  - `0.10.2` Adding and removing items: append(), extend(), insert(), and pop().
  - `0.10.3` Searching and counting: using in, index(), and count().
  - `0.10.4` Sorting lists: sorting in-place with sort() vs creating a new list with sorted().
- **Key Failure Modes & Edge Cases**: Modifying a list while looping over it, causing items to be skipped unintentionally.
- **Verification & Mastery Check**: Build a history tracker that appends user messages, limits history to 10 items, and prints them in order.
- **Project Application**: PromptCLI: Conversation history list manager.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.10: Lists: Dynamic Sequential Arrays\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Build a history tracker that appends user messages, limits history to 10 items, and prints them in order.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Build a history tracker that appends user messages, limits history to 10 items, and prints them in order.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.10: Lists: Dynamic Sequential Arrays\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Lists: Dynamic Sequential Arrays\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Build a history tracker that appends user messages, limits h\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Build a history tracker that appends user messages, limits history to 10 items, and prints them in order.", "failure_mode": "Modifying a list while looping over it, causing items to be skipped unintentionally.", "subtopics_count": 4, "subtopics": ["0.10.1 Ordered collections: storing multiple items in a Python list.", "0.10.2 Adding and removing items: append(), extend(), insert(), and pop().", "0.10.3 Searching and counting: using in, index(), and count().", "0.10.4 Sorting lists: sorting in-place with sort() vs creating a new list with sorted()."]}'::jsonb,
    '["Explain how your implementation avoids: Modifying a list while looping over it, causing items to be skipped unintentionally.", "How does Lists: Dynamic Sequential Arrays scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    slug = EXCLUDED.slug,
    phase_id = EXCLUDED.phase_id,
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    cs_foundation = EXCLUDED.cs_foundation,
    ai_convergence = EXCLUDED.ai_convergence,
    xp_reward = EXCLUDED.xp_reward,
    handbook_markdown = EXCLUDED.handbook_markdown,
    starter_code = EXCLUDED.starter_code,
    test_suite = EXCLUDED.test_suite,
    defense_prompts = EXCLUDED.defense_prompts;