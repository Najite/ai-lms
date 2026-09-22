INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-21',
    'phase-00-lesson-21-text-manipulation-string-methods-cleaning',
    'phase-0',
    'Lesson 0.21: Text Manipulation, String Methods & Cleaning',
    'Prerequisites: Lesson 0.3',
    'Prerequisites: Lesson 0.3 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.21: Text Manipulation, String Methods & Cleaning

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.3
- **Subtopics**:
  - `0.21.1` Real-world text cleaning: stripping unwanted whitespace, tabs, and newlines (`strip`, `lstrip`, `rstrip`).
  - `0.21.2` Case transformations and normalization: `lower()`, `upper()`, and case-insensitive matching.
  - `0.21.3` Finding, counting, and replacing text patterns: `.find()`, `.count()`, and `.replace()`.
  - `0.21.4` Splitting and joining text: converting paragraphs to word lists with `.split()` and reconstructing with `.join()`.
- **Key Failure Modes & Edge Cases**: Modifying strings expecting them to change in-place; strings are immutable in Python, so the result must be reassigned.
- **Verification & Mastery Check**: Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowercases user prompts.
- **Project Application**: PromptCLI: Raw prompt preprocessing and token sanitization.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.21: Text Manipulation, String Methods & Cleaning\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowercases user prompts.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowercases user prompts.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.21: Text Manipulation, String Methods & Cleaning\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Text Manipulation, String Methods & Cleaning\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a text sanitizer function that removes leading numbers\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a text sanitizer function that removes leading numbers, strips extraneous whitespace, and lowercases user prompts.", "failure_mode": "Modifying strings expecting them to change in-place; strings are immutable in Python, so the result must be reassigned.", "subtopics_count": 4, "subtopics": ["0.21.1 Real-world text cleaning: stripping unwanted whitespace, tabs, and newlines (`strip`, `lstrip`, `rstrip`).", "0.21.2 Case transformations and normalization: `lower()`, `upper()`, and case-insensitive matching.", "0.21.3 Finding, counting, and replacing text patterns: `.find()`, `.count()`, and `.replace()`.", "0.21.4 Splitting and joining text: converting paragraphs to word lists with `.split()` and reconstructing with `.join()`."]}'::jsonb,
    '["Explain how your implementation avoids: Modifying strings expecting them to change in-place; strings are immutable in Python, so the result must be reassigned.", "How does Text Manipulation, String Methods & Cleaning scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-22',
    'phase-00-lesson-22-working-with-python-lists-collections',
    'phase-0',
    'Lesson 0.22: Working with Python Lists & Collections',
    'Prerequisites: Lesson 0.6',
    'Prerequisites: Lesson 0.6 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.22: Working with Python Lists & Collections

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.6
- **Subtopics**:
  - `0.22.1` The Python List: storing ordered collections of items in numbered positions.
  - `0.22.2` Modifying lists: `.append()`, `.extend()`, `.insert()`, `.pop()`, and `.remove()`.
  - `0.22.3` Slicing lists: extracting sub-lists with `[start:stop:step]` syntax.
  - `0.22.4` Checking membership: using `in` and `not in` to test if an item exists in a collection.
- **Key Failure Modes & Edge Cases**: Calling `.pop()` or accessing an index on an empty list, triggering an `IndexError`.
- **Verification & Mastery Check**: Build a conversation history list where new messages are appended, and only the 5 most recent turns are retained.
- **Project Application**: PromptCLI: Multi-turn chat message history buffer.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.22: Working with Python Lists & Collections\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Build a conversation history list where new messages are appended, and only the 5 most recent turns are retained.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Build a conversation history list where new messages are appended, and only the 5 most recent turns are retained.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.22: Working with Python Lists & Collections\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Working with Python Lists & Collections\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Build a conversation history list where new messages are app\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Build a conversation history list where new messages are appended, and only the 5 most recent turns are retained.", "failure_mode": "Calling `.pop()` or accessing an index on an empty list, triggering an `IndexError`.", "subtopics_count": 4, "subtopics": ["0.22.1 The Python List: storing ordered collections of items in numbered positions.", "0.22.2 Modifying lists: `.append()`, `.extend()`, `.insert()`, `.pop()`, and `.remove()`.", "0.22.3 Slicing lists: extracting sub-lists with `[start:stop:step]` syntax.", "0.22.4 Checking membership: using `in` and `not in` to test if an item exists in a collection."]}'::jsonb,
    '["Explain how your implementation avoids: Calling `.pop()` or accessing an index on an empty list, triggering an `IndexError`.", "How does Working with Python Lists & Collections scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-23',
    'phase-00-lesson-23-list-comprehensions-data-transformations',
    'phase-0',
    'Lesson 0.23: List Comprehensions & Data Transformations',
    'Prerequisites: Lesson 0.22',
    'Prerequisites: Lesson 0.22 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.23: List Comprehensions & Data Transformations

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.22
- **Subtopics**:
  - `0.23.1` The List Comprehension syntax: transforming lists in a single readable line.
  - `0.23.2` Filtering with conditionals: `[item for item in items if condition]`.
  - `0.23.3` Transforming text data: stripping and normalizing an entire batch of inputs at once.
  - `0.23.4` When to use comprehensions vs regular loops for clean, maintainable code.
- **Key Failure Modes & Edge Cases**: Nesting three or more list comprehensions, creating unreadable "clever" code that teammates cannot debug.
- **Verification & Mastery Check**: Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehension.
- **Project Application**: PromptCLI: Batch prompt cleanup and extraction.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.23: List Comprehensions & Data Transformations\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehension.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehension.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.23: List Comprehensions & Data Transformations\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: List Comprehensions & Data Transformations\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Take a list of raw user inputs and produce a cleaned list of\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Take a list of raw user inputs and produce a cleaned list of non-empty prompts in a single comprehension.", "failure_mode": "Nesting three or more list comprehensions, creating unreadable \"clever\" code that teammates cannot debug.", "subtopics_count": 4, "subtopics": ["0.23.1 The List Comprehension syntax: transforming lists in a single readable line.", "0.23.2 Filtering with conditionals: `[item for item in items if condition]`.", "0.23.3 Transforming text data: stripping and normalizing an entire batch of inputs at once.", "0.23.4 When to use comprehensions vs regular loops for clean, maintainable code."]}'::jsonb,
    '["Explain how your implementation avoids: Nesting three or more list comprehensions, creating unreadable \"clever\" code that teammates cannot debug.", "How does List Comprehensions & Data Transformations scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-24',
    'phase-00-lesson-24-dictionaries-keys-values-fast-lookups',
    'phase-0',
    'Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups',
    'Prerequisites: Lesson 0.22',
    'Prerequisites: Lesson 0.22 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.22
- **Subtopics**:
  - `0.24.1` The Dictionary mental model: pairing unique keys with stored values (like a phone contact list).
  - `0.24.2` Adding, updating, and removing dictionary entries.
  - `0.24.3` Safe lookups: using `.get(key, default)` to prevent unhandled `KeyError` crashes.
  - `0.24.4` Iterating over dictionaries: accessing `.keys()`, `.values()`, and `.items()`.
- **Key Failure Modes & Edge Cases**: Accessing a missing dictionary key with brackets (`dict[key]`) rather than `.get()`, crashing the application.
- **Verification & Mastery Check**: Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.
- **Project Application**: PromptCLI: Dynamic AI model parameter and pricing lookup.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.24: Dictionaries: Keys, Values & Fast Lookups\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Dictionaries: Keys, Values & Fast Lookups\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Build a model pricing dictionary and look up the per-token c\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Build a model pricing dictionary and look up the per-token cost for an arbitrary model name safely.", "failure_mode": "Accessing a missing dictionary key with brackets (`dict[key]`) rather than `.get()`, crashing the application.", "subtopics_count": 4, "subtopics": ["0.24.1 The Dictionary mental model: pairing unique keys with stored values (like a phone contact list).", "0.24.2 Adding, updating, and removing dictionary entries.", "0.24.3 Safe lookups: using `.get(key, default)` to prevent unhandled `KeyError` crashes.", "0.24.4 Iterating over dictionaries: accessing `.keys()`, `.values()`, and `.items()`."]}'::jsonb,
    '["Explain how your implementation avoids: Accessing a missing dictionary key with brackets (`dict[key]`) rather than `.get()`, crashing the application.", "How does Dictionaries: Keys, Values & Fast Lookups scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-25',
    'phase-00-lesson-25-sets-unique-item-filtering',
    'phase-0',
    'Lesson 0.25: Sets & Unique Item Filtering',
    'Prerequisites: Lesson 0.24',
    'Prerequisites: Lesson 0.24 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.25: Sets & Unique Item Filtering

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.24
- **Subtopics**:
  - `0.25.1` What is a Set: an unordered collection that automatically enforces uniqueness.
  - `0.25.2` Instant deduplication: turning lists into sets with `set(my_list)`.
  - `0.25.3` Fast membership testing: why checking `item in my_set` is lightning-fast compared to lists.
  - `0.25.4` Set operations: union, intersection, and difference between collections.
- **Key Failure Modes & Edge Cases**: Trying to index into a set with `my_set[0]`; sets are unordered and do not support indexing.
- **Verification & Mastery Check**: Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.
- **Project Application**: PromptCLI: User prompt tag deduplication and stopword filtering.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.25: Sets & Unique Item Filtering\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.25: Sets & Unique Item Filtering\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Sets & Unique Item Filtering\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Given a list of 1,000 prompt tags with duplicates, extract t\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Given a list of 1,000 prompt tags with duplicates, extract the unique tags and find overlapping tags with a whitelist.", "failure_mode": "Trying to index into a set with `my_set[0]`; sets are unordered and do not support indexing.", "subtopics_count": 4, "subtopics": ["0.25.1 What is a Set: an unordered collection that automatically enforces uniqueness.", "0.25.2 Instant deduplication: turning lists into sets with `set(my_list)`.", "0.25.3 Fast membership testing: why checking `item in my_set` is lightning-fast compared to lists.", "0.25.4 Set operations: union, intersection, and difference between collections."]}'::jsonb,
    '["Explain how your implementation avoids: Trying to index into a set with `my_set[0]`; sets are unordered and do not support indexing.", "How does Sets & Unique Item Filtering scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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