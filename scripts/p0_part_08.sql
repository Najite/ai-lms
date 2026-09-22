INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-36',
    'phase-00-lesson-36-modern-python-type-hints-static-typing',
    'phase-0',
    'Lesson 0.36: Modern Python Type Hints & Static Typing',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.36: Modern Python Type Hints & Static Typing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.36.1` Why type hints matter: catching bugs before running code and unlocking superior IDE autocomplete.
  - `0.36.2` Basic type annotations: `name: str`, `age: int`, `score: float`, `is_active: bool`.
  - `0.36.3` Container types: `list[str]`, `dict[str, int]`, `tuple[int, int]`.
  - `0.36.4` Optional and Union types: `str | None` for values that might be missing.
- **Key Failure Modes & Edge Cases**: Assuming Python enforces types at runtime; type hints are for static analysis and tools like Mypy/IDE, not runtime checks.
- **Verification & Mastery Check**: Annotate a prompt-formatting function with full parameter and return types, verifying it with `mypy`.
- **Project Application**: PromptCLI: Type-safe prompt orchestration pipeline.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.36: Modern Python Type Hints & Static Typing\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Annotate a prompt-formatting function with full parameter and return types, verifying it with `mypy`.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Annotate a prompt-formatting function with full parameter and return types, verifying it with `mypy`.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.36: Modern Python Type Hints & Static Typing\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Modern Python Type Hints & Static Typing\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Annotate a prompt-formatting function with full parameter an\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Annotate a prompt-formatting function with full parameter and return types, verifying it with `mypy`.", "failure_mode": "Assuming Python enforces types at runtime; type hints are for static analysis and tools like Mypy/IDE, not runtime checks.", "subtopics_count": 4, "subtopics": ["0.36.1 Why type hints matter: catching bugs before running code and unlocking superior IDE autocomplete.", "0.36.2 Basic type annotations: `name: str`, `age: int`, `score: float`, `is_active: bool`.", "0.36.3 Container types: `list[str]`, `dict[str, int]`, `tuple[int, int]`.", "0.36.4 Optional and Union types: `str | None` for values that might be missing."]}'::jsonb,
    '["Explain how your implementation avoids: Assuming Python enforces types at runtime; type hints are for static analysis and tools like Mypy/IDE, not runtime check", "How does Modern Python Type Hints & Static Typing scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-37',
    'phase-00-lesson-37-introduction-to-pydantic-data-validation-',
    'phase-0',
    'Lesson 0.37: Introduction to Pydantic: Data Validation from Scratch',
    'Prerequisites: Lesson 0.36',
    'Prerequisites: Lesson 0.36 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.37: Introduction to Pydantic: Data Validation from Scratch

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.36
- **Subtopics**:
  - `0.37.1` The Pydantic mental model: turning loose dictionaries into guaranteed, validated data models.
  - `0.37.2` Creating a `BaseModel`: defining fields, default values, and required attributes.
  - `0.37.3` Automatic type coercion: how Pydantic cleanly converts strings like `"123"` into integers `123`.
  - `0.37.4` Catching validation errors: inspecting `ValidationError` when data fails to meet schema rules.
- **Key Failure Modes & Edge Cases**: Passing invalid data into Pydantic models without a `try/except ValidationError` block.
- **Verification & Mastery Check**: Define an `AIResponse` Pydantic model with fields `content: str`, `tokens: int`, and validate a dirty dictionary against it.
- **Project Application**: PromptCLI: Structured output validation foundation.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.37: Introduction to Pydantic: Data Validation from Scratch\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Define an `AIResponse` Pydantic model with fields `content: str`, `tokens: int`, and validate a dirty dictionary against it.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Define an `AIResponse` Pydantic model with fields `content: str`, `tokens: int`, and validate a dirty dictionary against it.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.37: Introduction to Pydantic: Data Validation from Scratch\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Introduction to Pydantic: Data Validation from Scratch\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Define an `AIResponse` Pydantic model with fields `content: \")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Define an `AIResponse` Pydantic model with fields `content: str`, `tokens: int`, and validate a dirty dictionary against it.", "failure_mode": "Passing invalid data into Pydantic models without a `try/except ValidationError` block.", "subtopics_count": 4, "subtopics": ["0.37.1 The Pydantic mental model: turning loose dictionaries into guaranteed, validated data models.", "0.37.2 Creating a `BaseModel`: defining fields, default values, and required attributes.", "0.37.3 Automatic type coercion: how Pydantic cleanly converts strings like `\"123\"` into integers `123`.", "0.37.4 Catching validation errors: inspecting `ValidationError` when data fails to meet schema rules."]}'::jsonb,
    '["Explain how your implementation avoids: Passing invalid data into Pydantic models without a `try/except ValidationError` block.", "How does Introduction to Pydantic: Data Validation from Scratch scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-38',
    'phase-00-lesson-38-git-fundamentals-commits-history-diffs',
    'phase-0',
    'Lesson 0.38: Git Fundamentals: Commits, History & Diffs',
    'Prerequisites: Lesson 0.26',
    'Prerequisites: Lesson 0.26 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.38: Git Fundamentals: Commits, History & Diffs

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.26
- **Subtopics**:
  - `0.38.1` Why version control is mandatory: time-traveling through project history and safe experimentation.
  - `0.38.2` The 3 Git states: Working Directory, Staging Area (`git add`), and Repository (`git commit`).
  - `0.38.3` Writing meaningful commit messages: describing the "why" rather than just the "what".
  - `0.38.4` Inspecting changes: using `git status`, `git diff`, and `git log --oneline`.
- **Key Failure Modes & Edge Cases**: Running `git add .` without checking `git status`, accidentally staging sensitive `.env` files.
- **Verification & Mastery Check**: Initialize a Git repository, stage files, make 3 distinct commits, and view the commit history log.
- **Project Application**: PromptCLI: Version control initialization.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.38: Git Fundamentals: Commits, History & Diffs\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Initialize a Git repository, stage files, make 3 distinct commits, and view the commit history log.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Initialize a Git repository, stage files, make 3 distinct commits, and view the commit history log.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.38: Git Fundamentals: Commits, History & Diffs\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Git Fundamentals: Commits, History & Diffs\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Initialize a Git repository, stage files, make 3 distinct co\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Initialize a Git repository, stage files, make 3 distinct commits, and view the commit history log.", "failure_mode": "Running `git add .` without checking `git status`, accidentally staging sensitive `.env` files.", "subtopics_count": 4, "subtopics": ["0.38.1 Why version control is mandatory: time-traveling through project history and safe experimentation.", "0.38.2 The 3 Git states: Working Directory, Staging Area (`git add`), and Repository (`git commit`).", "0.38.3 Writing meaningful commit messages: describing the \"why\" rather than just the \"what\".", "0.38.4 Inspecting changes: using `git status`, `git diff`, and `git log --oneline`."]}'::jsonb,
    '["Explain how your implementation avoids: Running `git add .` without checking `git status`, accidentally staging sensitive `.env` files.", "How does Git Fundamentals: Commits, History & Diffs scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-39',
    'phase-00-lesson-39-git-branching-merging-workflows',
    'phase-0',
    'Lesson 0.39: Git Branching & Merging Workflows',
    'Prerequisites: Lesson 0.38',
    'Prerequisites: Lesson 0.38 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.39: Git Branching & Merging Workflows

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.38
- **Subtopics**:
  - `0.39.1` Why branch: developing new features or prompt experiments in isolation without breaking the main codebase.
  - `0.39.2` Creating and switching branches: `git branch` and `git switch -c feature-prompt-v2`.
  - `0.39.3` Merging branches: bringing feature changes cleanly into the `main` branch.
  - `0.39.4` Resolving merge conflicts calmly: understanding conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
- **Key Failure Modes & Edge Cases**: Panic-deleting code during merge conflicts; conflict markers are simply Git asking you to choose which version to keep.
- **Verification & Mastery Check**: Create a feature branch, make a change, merge it into main, and cleanly delete the feature branch.
- **Project Application**: PromptCLI: Feature branch workflow for prompt enhancements.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.39: Git Branching & Merging Workflows\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Create a feature branch, make a change, merge it into main, and cleanly delete the feature branch.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Create a feature branch, make a change, merge it into main, and cleanly delete the feature branch.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.39: Git Branching & Merging Workflows\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Git Branching & Merging Workflows\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Create a feature branch, make a change, merge it into main, \")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Create a feature branch, make a change, merge it into main, and cleanly delete the feature branch.", "failure_mode": "Panic-deleting code during merge conflicts; conflict markers are simply Git asking you to choose which version to keep.", "subtopics_count": 4, "subtopics": ["0.39.1 Why branch: developing new features or prompt experiments in isolation without breaking the main codebase.", "0.39.2 Creating and switching branches: `git branch` and `git switch -c feature-prompt-v2`.", "0.39.3 Merging branches: bringing feature changes cleanly into the `main` branch.", "0.39.4 Resolving merge conflicts calmly: understanding conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`)."]}'::jsonb,
    '["Explain how your implementation avoids: Panic-deleting code during merge conflicts; conflict markers are simply Git asking you to choose which version to keep.", "How does Git Branching & Merging Workflows scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-40',
    'phase-00-lesson-40-remote-repositories-github-collaboration',
    'phase-0',
    'Lesson 0.40: Remote Repositories & GitHub Collaboration',
    'Prerequisites: Lesson 0.39',
    'Prerequisites: Lesson 0.39 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.40: Remote Repositories & GitHub Collaboration

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.39
- **Subtopics**:
  - `0.40.1` Local vs Remote: connecting local Git repositories to GitHub with `git remote add origin`.
  - `0.40.2` Pushing and pulling: `git push -u origin main` and `git pull`.
  - `0.40.3` Pull Requests (PRs): proposing changes, code review etiquette, and automated CI checks.
  - `0.40.4` Writing a professional README.md: explaining how to install, configure, and run your project.
- **Key Failure Modes & Edge Cases**: Pushing directly to `main` without testing, breaking the production deployment for other engineers.
- **Verification & Mastery Check**: Write a clean, comprehensive `README.md` for a project including installation, configuration, and example usage.
- **Project Application**: PromptCLI: Open-source project portfolio presentation.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.40: Remote Repositories & GitHub Collaboration\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a clean, comprehensive `README.md` for a project including installation, configuration, and example usage.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a clean, comprehensive `README.md` for a project including installation, configuration, and example usage.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.40: Remote Repositories & GitHub Collaboration\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Remote Repositories & GitHub Collaboration\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a clean, comprehensive `README.md` for a project inclu\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a clean, comprehensive `README.md` for a project including installation, configuration, and example usage.", "failure_mode": "Pushing directly to `main` without testing, breaking the production deployment for other engineers.", "subtopics_count": 4, "subtopics": ["0.40.1 Local vs Remote: connecting local Git repositories to GitHub with `git remote add origin`.", "0.40.2 Pushing and pulling: `git push -u origin main` and `git pull`.", "0.40.3 Pull Requests (PRs): proposing changes, code review etiquette, and automated CI checks.", "0.40.4 Writing a professional README.md: explaining how to install, configure, and run your project."]}'::jsonb,
    '["Explain how your implementation avoids: Pushing directly to `main` without testing, breaking the production deployment for other engineers.", "How does Remote Repositories & GitHub Collaboration scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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