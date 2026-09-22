INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-16',
    'phase-00-lesson-16-working-with-json-data',
    'phase-0',
    'Lesson 0.16: Working with JSON Data',
    'Prerequisites: Lesson 0.13, Lesson 0.15',
    'Prerequisites: Lesson 0.13, Lesson 0.15 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.16: Working with JSON Data

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.13, Lesson 0.15
- **Subtopics**:
  - `0.16.1` What is JSON: the universal language of modern web APIs and AI models.
  - `0.16.2` Parsing JSON text: converting raw text strings into Python dictionaries with json.loads().
  - `0.16.3` Writing JSON data: converting Python dictionaries into formatted JSON text with json.dumps().
  - `0.16.4` Handling files: using json.load() and json.dump() directly with file objects.
- **Key Failure Modes & Edge Cases**: Crashing on invalid JSON syntax with JSONDecodeError when reading corrupted API responses.
- **Verification & Mastery Check**: Parse an LLM''s raw JSON string output into a typed Python dictionary and extract a structured answer.
- **Project Application**: PromptCLI: Structured AI output parser.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.16: Working with JSON Data\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Parse an LLM''s raw JSON string output into a typed Python dictionary and extract a structured answer.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Parse an LLM''s raw JSON string output into a typed Python dictionary and extract a structured answer.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.16: Working with JSON Data\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Working with JSON Data\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Parse an LLM''s raw JSON string output into a typed Python di\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Parse an LLM''s raw JSON string output into a typed Python dictionary and extract a structured answer.", "failure_mode": "Crashing on invalid JSON syntax with JSONDecodeError when reading corrupted API responses.", "subtopics_count": 4, "subtopics": ["0.16.1 What is JSON: the universal language of modern web APIs and AI models.", "0.16.2 Parsing JSON text: converting raw text strings into Python dictionaries with json.loads().", "0.16.3 Writing JSON data: converting Python dictionaries into formatted JSON text with json.dumps().", "0.16.4 Handling files: using json.load() and json.dump() directly with file objects."]}'::jsonb,
    '["Explain how your implementation avoids: Crashing on invalid JSON syntax with JSONDecodeError when reading corrupted API responses.", "How does Working with JSON Data scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-17',
    'phase-00-lesson-17-error-handling-try-except-finally',
    'phase-0',
    'Lesson 0.17: Error Handling: try, except, finally',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.17: Error Handling: try, except, finally

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.17.1` Handling failures gracefully: catching runtime exceptions before they crash your program.
  - `0.17.2` Catching specific errors: handling ValueError, FileNotFoundError, and KeyError individually.
  - `0.17.3` The else block: running code only when no errors occurred.
  - `0.17.4` The finally block: guaranteeing cleanup routines (like closing connections) always run.
- **Key Failure Modes & Edge Cases**: Using a bare except: which hides real bugs and catches system interrupts like Ctrl+C.
- **Verification & Mastery Check**: Wrap a file reading and JSON parsing function in defensive error handling that logs clear error messages.
- **Project Application**: PromptCLI: Resilient API response decoder.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.17: Error Handling: try, except, finally\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Wrap a file reading and JSON parsing function in defensive error handling that logs clear error messages.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Wrap a file reading and JSON parsing function in defensive error handling that logs clear error messages.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.17: Error Handling: try, except, finally\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Error Handling: try, except, finally\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Wrap a file reading and JSON parsing function in defensive e\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Wrap a file reading and JSON parsing function in defensive error handling that logs clear error messages.", "failure_mode": "Using a bare except: which hides real bugs and catches system interrupts like Ctrl+C.", "subtopics_count": 4, "subtopics": ["0.17.1 Handling failures gracefully: catching runtime exceptions before they crash your program.", "0.17.2 Catching specific errors: handling ValueError, FileNotFoundError, and KeyError individually.", "0.17.3 The else block: running code only when no errors occurred.", "0.17.4 The finally block: guaranteeing cleanup routines (like closing connections) always run."]}'::jsonb,
    '["Explain how your implementation avoids: Using a bare except: which hides real bugs and catches system interrupts like Ctrl+C.", "How does Error Handling: try, except, finally scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-18',
    'phase-00-lesson-18-modules-the-import-system',
    'phase-0',
    'Lesson 0.18: Modules & The import System',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.18: Modules & The import System

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.18.1` Organizing code into multiple files: splitting projects into reusable Python modules.
  - `0.18.2` The import statement: importing entire modules, specific functions, or using aliases.
  - `0.18.3` Standard library tour: essential built-in modules like os, sys, math, and random.
  - `0.18.4` Understanding __name__ == ''__main__'': writing files that can be both imported and run directly.
- **Key Failure Modes & Edge Cases**: Creating circular imports between two files that import each other, causing ImportError.
- **Verification & Mastery Check**: Split a prompt helper into a separate module file and import its functions into your main CLI runner.
- **Project Application**: PromptCLI: Modular multi-file tool architecture.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.18: Modules & The import System\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Split a prompt helper into a separate module file and import its functions into your main CLI runner.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Split a prompt helper into a separate module file and import its functions into your main CLI runner.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.18: Modules & The import System\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Modules & The import System\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Split a prompt helper into a separate module file and import\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Split a prompt helper into a separate module file and import its functions into your main CLI runner.", "failure_mode": "Creating circular imports between two files that import each other, causing ImportError.", "subtopics_count": 4, "subtopics": ["0.18.1 Organizing code into multiple files: splitting projects into reusable Python modules.", "0.18.2 The import statement: importing entire modules, specific functions, or using aliases.", "0.18.3 Standard library tour: essential built-in modules like os, sys, math, and random.", "0.18.4 Understanding __name__ == ''__main__'': writing files that can be both imported and run directly."]}'::jsonb,
    '["Explain how your implementation avoids: Creating circular imports between two files that import each other, causing ImportError.", "How does Modules & The import System scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-19',
    'phase-00-lesson-19-writing-pythonic-pep-8-code',
    'phase-0',
    'Lesson 0.19: Writing Pythonic & PEP 8 Code',
    'Prerequisites: Lesson 0.18',
    'Prerequisites: Lesson 0.18 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.19: Writing Pythonic & PEP 8 Code

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.18
- **Subtopics**:
  - `0.19.1` The Zen of Python: readability counts, explicit is better than implicit, simple is better than complex.
  - `0.19.2` PEP 8 style guide: snake_case for variables, PascalCase for classes, spacing, and line length.
  - `0.19.3` Docstrings and comments: writing clear explanations for your future self and teammates.
  - `0.19.4` Automated formatters: using modern tools like Black or Ruff to format code effortlessly.
- **Key Failure Modes & Edge Cases**: Writing single-letter variable names or 200-line unreadable functions that teammates cannot maintain.
- **Verification & Mastery Check**: Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.
- **Project Application**: PromptCLI: Code quality standards across all projects.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.19: Writing Pythonic & PEP 8 Code\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.19: Writing Pythonic & PEP 8 Code\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Writing Pythonic & PEP 8 Code\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Format and clean an unreadable 50-line script to strictly ad\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Format and clean an unreadable 50-line script to strictly adhere to PEP 8 naming and docstrings.", "failure_mode": "Writing single-letter variable names or 200-line unreadable functions that teammates cannot maintain.", "subtopics_count": 4, "subtopics": ["0.19.1 The Zen of Python: readability counts, explicit is better than implicit, simple is better than complex.", "0.19.2 PEP 8 style guide: snake_case for variables, PascalCase for classes, spacing, and line length.", "0.19.3 Docstrings and comments: writing clear explanations for your future self and teammates.", "0.19.4 Automated formatters: using modern tools like Black or Ruff to format code effortlessly."]}'::jsonb,
    '["Explain how your implementation avoids: Writing single-letter variable names or 200-line unreadable functions that teammates cannot maintain.", "How does Writing Pythonic & PEP 8 Code scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-20',
    'phase-00-lesson-20-debugging-with-print-python-pdb',
    'phase-0',
    'Lesson 0.20: Debugging with print & Python pdb',
    'Prerequisites: Lesson 0.17',
    'Prerequisites: Lesson 0.17 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.20: Debugging with print & Python pdb

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.17
- **Subtopics**:
  - `0.20.1` Debugging mindset: how to track down why code behaves differently than you expected.
  - `0.20.2` Strategic print debugging: using f-strings to inspect variable states at key checkpoints.
  - `0.20.3` Interactive debugging with breakpoint(): pausing program execution in the terminal.
  - `0.20.4` Core debugger commands: n (next line), s (step inside), c (continue), and p (print variable).
- **Key Failure Modes & Edge Cases**: Leaving leftover debugging print statements scattered across production codebases.
- **Verification & Mastery Check**: Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.
- **Project Application**: PromptCLI: Interactive troubleshooting and bug fixing.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.20: Debugging with print & Python pdb\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.20: Debugging with print & Python pdb\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Debugging with print & Python pdb\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Use breakpoint() to step through a malfunctioning prompt-for\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Use breakpoint() to step through a malfunctioning prompt-formatting loop and identify the exact off-by-one bug.", "failure_mode": "Leaving leftover debugging print statements scattered across production codebases.", "subtopics_count": 4, "subtopics": ["0.20.1 Debugging mindset: how to track down why code behaves differently than you expected.", "0.20.2 Strategic print debugging: using f-strings to inspect variable states at key checkpoints.", "0.20.3 Interactive debugging with breakpoint(): pausing program execution in the terminal.", "0.20.4 Core debugger commands: n (next line), s (step inside), c (continue), and p (print variable)."]}'::jsonb,
    '["Explain how your implementation avoids: Leaving leftover debugging print statements scattered across production codebases.", "How does Debugging with print & Python pdb scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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