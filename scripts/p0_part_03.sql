INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-11',
    'phase-00-lesson-11-list-comprehensions-transforms',
    'phase-0',
    'Lesson 0.11: List Comprehensions & Transforms',
    'Prerequisites: Lesson 0.10',
    'Prerequisites: Lesson 0.10 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.11: List Comprehensions & Transforms

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.11.1` Readable transforms: replacing multi-line for loops with single-line comprehensions.
  - `0.11.2` Filtering with if: keeping only items that match specific criteria.
  - `0.11.3` Comprehension syntax: [expression for item in iterable if condition].
  - `0.11.4` Performance benefits: why list comprehensions run faster than manual append loops.
- **Key Failure Modes & Edge Cases**: Writing overly complex nested comprehensions that are unreadable to other engineers.
- **Verification & Mastery Check**: Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.
- **Project Application**: PromptCLI: High-speed prompt batch normalization.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.11: List Comprehensions & Transforms\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.11: List Comprehensions & Transforms\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: List Comprehensions & Transforms\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Transform a list of raw prompt strings into clean, trimmed l\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Transform a list of raw prompt strings into clean, trimmed lowercase strings in one line.", "failure_mode": "Writing overly complex nested comprehensions that are unreadable to other engineers.", "subtopics_count": 4, "subtopics": ["0.11.1 Readable transforms: replacing multi-line for loops with single-line comprehensions.", "0.11.2 Filtering with if: keeping only items that match specific criteria.", "0.11.3 Comprehension syntax: [expression for item in iterable if condition].", "0.11.4 Performance benefits: why list comprehensions run faster than manual append loops."]}'::jsonb,
    '["Explain how your implementation avoids: Writing overly complex nested comprehensions that are unreadable to other engineers.", "How does List Comprehensions & Transforms scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-12',
    'phase-00-lesson-12-tuples-fixed-immutable-sequences',
    'phase-0',
    'Lesson 0.12: Tuples: Fixed Immutable Sequences',
    'Prerequisites: Lesson 0.10',
    'Prerequisites: Lesson 0.10 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.12: Tuples: Fixed Immutable Sequences

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.12.1` Immutable collections: creating fixed groups of items with parentheses ().
  - `0.12.2` Why immutability matters: safety against accidental changes and lower memory usage.
  - `0.12.3` Tuple unpacking: assigning multiple variables at once from a single tuple.
  - `0.12.4` Returning multiple values: returning tuples from functions cleanly.
- **Key Failure Modes & Edge Cases**: Attempting to modify a tuple element, causing a TypeError.
- **Verification & Mastery Check**: Write a function that returns the token count, character count, and estimated cost as an unpacked tuple.
- **Project Application**: PromptCLI: Multi-value metrics calculation.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.12: Tuples: Fixed Immutable Sequences\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a function that returns the token count, character count, and estimated cost as an unpacked tuple.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a function that returns the token count, character count, and estimated cost as an unpacked tuple.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.12: Tuples: Fixed Immutable Sequences\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Tuples: Fixed Immutable Sequences\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a function that returns the token count, character cou\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a function that returns the token count, character count, and estimated cost as an unpacked tuple.", "failure_mode": "Attempting to modify a tuple element, causing a TypeError.", "subtopics_count": 4, "subtopics": ["0.12.1 Immutable collections: creating fixed groups of items with parentheses ().", "0.12.2 Why immutability matters: safety against accidental changes and lower memory usage.", "0.12.3 Tuple unpacking: assigning multiple variables at once from a single tuple.", "0.12.4 Returning multiple values: returning tuples from functions cleanly."]}'::jsonb,
    '["Explain how your implementation avoids: Attempting to modify a tuple element, causing a TypeError.", "How does Tuples: Fixed Immutable Sequences scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-13',
    'phase-00-lesson-13-dictionaries-key-value-hash-maps',
    'phase-0',
    'Lesson 0.13: Dictionaries: Key-Value Hash Maps',
    'Prerequisites: Lesson 0.10',
    'Prerequisites: Lesson 0.10 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.13: Dictionaries: Key-Value Hash Maps

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.10
- **Subtopics**:
  - `0.13.1` Mapping relationships: pairing unique keys with values using dictionaries {}.
  - `0.13.2` Accessing data safely: using square brackets [] vs the safe get() method with fallbacks.
  - `0.13.3` Updating and deleting: adding new keys, updating existing keys, and using pop().
  - `0.13.4` Iterating dictionaries: looping over keys(), values(), and items() key-value pairs.
- **Key Failure Modes & Edge Cases**: Accessing a non-existent key with [] instead of get(), triggering a KeyError crash.
- **Verification & Mastery Check**: Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely.
- **Project Application**: PromptCLI: Model hyperparameter state management.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.13: Dictionaries: Key-Value Hash Maps\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.13: Dictionaries: Key-Value Hash Maps\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Dictionaries: Key-Value Hash Maps\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Store user preferences (temperature, model name, max tokens)\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Store user preferences (temperature, model name, max tokens) in a dictionary and look up keys safely.", "failure_mode": "Accessing a non-existent key with [] instead of get(), triggering a KeyError crash.", "subtopics_count": 4, "subtopics": ["0.13.1 Mapping relationships: pairing unique keys with values using dictionaries {}.", "0.13.2 Accessing data safely: using square brackets [] vs the safe get() method with fallbacks.", "0.13.3 Updating and deleting: adding new keys, updating existing keys, and using pop().", "0.13.4 Iterating dictionaries: looping over keys(), values(), and items() key-value pairs."]}'::jsonb,
    '["Explain how your implementation avoids: Accessing a non-existent key with [] instead of get(), triggering a KeyError crash.", "How does Dictionaries: Key-Value Hash Maps scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-14',
    'phase-00-lesson-14-sets-unique-elements-set-algebra',
    'phase-0',
    'Lesson 0.14: Sets: Unique Elements & Set Algebra',
    'Prerequisites: Lesson 0.13',
    'Prerequisites: Lesson 0.13 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.14: Sets: Unique Elements & Set Algebra

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.13
- **Subtopics**:
  - `0.14.1` Unique collections: automatically deduplicating items with sets {}.
  - `0.14.2` High-speed lookups: why in checks are virtually instantaneous in sets.
  - `0.14.3` Mathematical set operations: union (|), intersection (&), and difference (-).
  - `0.14.4` When to use sets: removing duplicate user tags or detecting shared vocabulary.
- **Key Failure Modes & Edge Cases**: Attempting to put a mutable list into a set, triggering a TypeError: unhashable type.
- **Verification & Mastery Check**: Find all unique words used in two different user prompts and calculate their overlap using intersection.
- **Project Application**: PromptCLI: Prompt vocabulary similarity calculator.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.14: Sets: Unique Elements & Set Algebra\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Find all unique words used in two different user prompts and calculate their overlap using intersection.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Find all unique words used in two different user prompts and calculate their overlap using intersection.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.14: Sets: Unique Elements & Set Algebra\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Sets: Unique Elements & Set Algebra\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Find all unique words used in two different user prompts and\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Find all unique words used in two different user prompts and calculate their overlap using intersection.", "failure_mode": "Attempting to put a mutable list into a set, triggering a TypeError: unhashable type.", "subtopics_count": 4, "subtopics": ["0.14.1 Unique collections: automatically deduplicating items with sets {}.", "0.14.2 High-speed lookups: why in checks are virtually instantaneous in sets.", "0.14.3 Mathematical set operations: union (|), intersection (&), and difference (-).", "0.14.4 When to use sets: removing duplicate user tags or detecting shared vocabulary."]}'::jsonb,
    '["Explain how your implementation avoids: Attempting to put a mutable list into a set, triggering a TypeError: unhashable type.", "How does Sets: Unique Elements & Set Algebra scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-15',
    'phase-00-lesson-15-file-i-o-reading-writing-files',
    'phase-0',
    'Lesson 0.15: File I/O: Reading & Writing Files',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.15: File I/O: Reading & Writing Files

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.15.1` Interacting with disk files: opening, reading, and writing text files.
  - `0.15.2` The with open() context manager: automatically closing files even if errors happen.
  - `0.15.3` Reading modes: read(), readline(), and readlines() line-by-line.
  - `0.15.4` Writing vs appending: overwriting files with ''w'' vs adding new lines with ''a''.
- **Key Failure Modes & Edge Cases**: Forgetting with open(), leaving file handles locked in the operating system.
- **Verification & Mastery Check**: Read a system prompt template from a local file, replace a placeholder with user input, and save the result.
- **Project Application**: PromptCLI: Prompt template file loader.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.15: File I/O: Reading & Writing Files\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Read a system prompt template from a local file, replace a placeholder with user input, and save the result.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Read a system prompt template from a local file, replace a placeholder with user input, and save the result.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.15: File I/O: Reading & Writing Files\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: File I/O: Reading & Writing Files\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Read a system prompt template from a local file, replace a p\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Read a system prompt template from a local file, replace a placeholder with user input, and save the result.", "failure_mode": "Forgetting with open(), leaving file handles locked in the operating system.", "subtopics_count": 4, "subtopics": ["0.15.1 Interacting with disk files: opening, reading, and writing text files.", "0.15.2 The with open() context manager: automatically closing files even if errors happen.", "0.15.3 Reading modes: read(), readline(), and readlines() line-by-line.", "0.15.4 Writing vs appending: overwriting files with ''w'' vs adding new lines with ''a''."]}'::jsonb,
    '["Explain how your implementation avoids: Forgetting with open(), leaving file handles locked in the operating system.", "How does File I/O: Reading & Writing Files scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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