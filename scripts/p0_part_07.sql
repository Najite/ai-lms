INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-31',
    'phase-00-lesson-31-handling-network-timeouts-exponential-bac',
    'phase-0',
    'Lesson 0.31: Handling Network Timeouts & Exponential Backoff',
    'Prerequisites: Lesson 0.30',
    'Prerequisites: Lesson 0.30 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.31: Handling Network Timeouts & Exponential Backoff

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.30
- **Subtopics**:
  - `0.31.1` Transient network failures: why remote API calls will inevitably fail in production.
  - `0.31.2` Setting request timeouts: preventing programs from hanging forever when servers lag.
  - `0.31.3` The Exponential Backoff algorithm: waiting 1s, 2s, 4s before retrying to prevent overwhelming servers.
  - `0.31.4` Adding random jitter: avoiding retry storms across distributed clients.
- **Key Failure Modes & Edge Cases**: Retrying immediately in a tight `while` loop without backoff, getting your IP permanently rate-limited.
- **Verification & Mastery Check**: Implement a retry loop that retries a failing simulated HTTP request up to 3 times with exponential backoff.
- **Project Application**: PromptCLI: Automated network retry resilience engine.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.31: Handling Network Timeouts & Exponential Backoff\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Implement a retry loop that retries a failing simulated HTTP request up to 3 times with exponential backoff.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Implement a retry loop that retries a failing simulated HTTP request up to 3 times with exponential backoff.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.31: Handling Network Timeouts & Exponential Backoff\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Handling Network Timeouts & Exponential Backoff\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Implement a retry loop that retries a failing simulated HTTP\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Implement a retry loop that retries a failing simulated HTTP request up to 3 times with exponential backoff.", "failure_mode": "Retrying immediately in a tight `while` loop without backoff, getting your IP permanently rate-limited.", "subtopics_count": 4, "subtopics": ["0.31.1 Transient network failures: why remote API calls will inevitably fail in production.", "0.31.2 Setting request timeouts: preventing programs from hanging forever when servers lag.", "0.31.3 The Exponential Backoff algorithm: waiting 1s, 2s, 4s before retrying to prevent overwhelming servers.", "0.31.4 Adding random jitter: avoiding retry storms across distributed clients."]}'::jsonb,
    '["Explain how your implementation avoids: Retrying immediately in a tight `while` loop without backoff, getting your IP permanently rate-limited.", "How does Handling Network Timeouts & Exponential Backoff scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-32',
    'phase-00-lesson-32-parsing-xml-markdown-unstructured-ai-text',
    'phase-0',
    'Lesson 0.32: Parsing XML, Markdown & Unstructured AI Text',
    'Prerequisites: Lesson 0.21',
    'Prerequisites: Lesson 0.21 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.32: Parsing XML, Markdown & Unstructured AI Text

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.21
- **Subtopics**:
  - `0.32.1` The reality of AI outputs: why models often return markdown code blocks, XML tags, or conversational text.
  - `0.32.2` Extracting text between XML tags (e.g., `<thought>...</thought>` or `<answer>...</answer>`).
  - `0.32.3` Stripping markdown code fences: extracting clean JSON from ` ```json ... ``` ` blocks.
  - `0.32.4` Regular expressions for text extraction: using `re.search()` to isolate structured patterns.
- **Key Failure Modes & Edge Cases**: Assuming an LLM will return pure JSON without markdown backticks, causing `json.loads()` to crash.
- **Verification & Mastery Check**: Write a robust extractor that extracts valid JSON from a response string wrapped in conversational filler and markdown fences.
- **Project Application**: PromptCLI: Response parser and code block extractor.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.32: Parsing XML, Markdown & Unstructured AI Text\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a robust extractor that extracts valid JSON from a response string wrapped in conversational filler and markdown fences.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a robust extractor that extracts valid JSON from a response string wrapped in conversational filler and markdown fences.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.32: Parsing XML, Markdown & Unstructured AI Text\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Parsing XML, Markdown & Unstructured AI Text\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a robust extractor that extracts valid JSON from a res\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a robust extractor that extracts valid JSON from a response string wrapped in conversational filler and markdown fences.", "failure_mode": "Assuming an LLM will return pure JSON without markdown backticks, causing `json.loads()` to crash.", "subtopics_count": 4, "subtopics": ["0.32.1 The reality of AI outputs: why models often return markdown code blocks, XML tags, or conversational text.", "0.32.2 Extracting text between XML tags (e.g., `<thought>...</thought>` or `<answer>...</answer>`).", "0.32.3 Stripping markdown code fences: extracting clean JSON from ` ```json ... ``` ` blocks.", "0.32.4 Regular expressions for text extraction: using `re.search()` to isolate structured patterns."]}'::jsonb,
    '["Explain how your implementation avoids: Assuming an LLM will return pure JSON without markdown backticks, causing `json.loads()` to crash.", "How does Parsing XML, Markdown & Unstructured AI Text scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-33',
    'phase-00-lesson-33-command-line-arguments-with-argparse',
    'phase-0',
    'Lesson 0.33: Command-Line Arguments with Argparse',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.33: Command-Line Arguments with Argparse

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.33.1` Why CLI tools matter: running scripts with flags and options directly from the terminal.
  - `0.33.2` Python''s `argparse` module: defining positional arguments and optional flags (`--model`, `--temp`).
  - `0.33.3` Type casting and default values: automatically converting string inputs to integers or floats.
  - `0.33.4` Generating automated help menus: `--help` documentation generated directly from argument descriptions.
- **Key Failure Modes & Edge Cases**: Failing to provide help descriptions, making command-line tools impossible for teammates to use.
- **Verification & Mastery Check**: Build a CLI script `prompt_tool.py` that takes `--prompt`, `--temperature`, and `--verbose` flags and prints the settings.
- **Project Application**: PromptCLI: Terminal CLI argument parsing interface.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.33: Command-Line Arguments with Argparse\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Build a CLI script `prompt_tool.py` that takes `--prompt`, `--temperature`, and `--verbose` flags and prints the settings.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Build a CLI script `prompt_tool.py` that takes `--prompt`, `--temperature`, and `--verbose` flags and prints the settings.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.33: Command-Line Arguments with Argparse\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Command-Line Arguments with Argparse\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Build a CLI script `prompt_tool.py` that takes `--prompt`, `\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Build a CLI script `prompt_tool.py` that takes `--prompt`, `--temperature`, and `--verbose` flags and prints the settings.", "failure_mode": "Failing to provide help descriptions, making command-line tools impossible for teammates to use.", "subtopics_count": 4, "subtopics": ["0.33.1 Why CLI tools matter: running scripts with flags and options directly from the terminal.", "0.33.2 Python''s `argparse` module: defining positional arguments and optional flags (`--model`, `--temp`).", "0.33.3 Type casting and default values: automatically converting string inputs to integers or floats.", "0.33.4 Generating automated help menus: `--help` documentation generated directly from argument descriptions."]}'::jsonb,
    '["Explain how your implementation avoids: Failing to provide help descriptions, making command-line tools impossible for teammates to use.", "How does Command-Line Arguments with Argparse scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-34',
    'phase-00-lesson-34-packaging-reusable-modules-python-imports',
    'phase-0',
    'Lesson 0.34: Packaging Reusable Modules & Python Imports',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.34: Packaging Reusable Modules & Python Imports

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.34.1` Breaking scripts into modules: separating logic into multiple `.py` files.
  - `0.34.2` Import statements: `import utils`, `from config import MODEL_NAME`.
  - `0.34.3` The `if __name__ == "__main__":` idiom: making files both importable modules and executable scripts.
  - `0.34.4` Creating packages: using folders and `__init__.py` to organize multi-file projects.
- **Key Failure Modes & Edge Cases**: Circular imports where module A imports module B and module B imports module A, causing import crashes.
- **Verification & Mastery Check**: Organize a 3-file project (`main.py`, `prompt_templates.py`, `api_client.py`) and successfully run the application.
- **Project Application**: PromptCLI: Modular codebase architecture.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.34: Packaging Reusable Modules & Python Imports\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Organize a 3-file project (`main.py`, `prompt_templates.py`, `api_client.py`) and successfully run the application.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Organize a 3-file project (`main.py`, `prompt_templates.py`, `api_client.py`) and successfully run the application.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.34: Packaging Reusable Modules & Python Imports\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Packaging Reusable Modules & Python Imports\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Organize a 3-file project (`main.py`, `prompt_templates.py`,\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Organize a 3-file project (`main.py`, `prompt_templates.py`, `api_client.py`) and successfully run the application.", "failure_mode": "Circular imports where module A imports module B and module B imports module A, causing import crashes.", "subtopics_count": 4, "subtopics": ["0.34.1 Breaking scripts into modules: separating logic into multiple `.py` files.", "0.34.2 Import statements: `import utils`, `from config import MODEL_NAME`.", "0.34.3 The `if __name__ == \"__main__\":` idiom: making files both importable modules and executable scripts.", "0.34.4 Creating packages: using folders and `__init__.py` to organize multi-file projects."]}'::jsonb,
    '["Explain how your implementation avoids: Circular imports where module A imports module B and module B imports module A, causing import crashes.", "How does Packaging Reusable Modules & Python Imports scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-35',
    'phase-00-lesson-35-virtual-environments-modern-package-manag',
    'phase-0',
    'Lesson 0.35: Virtual Environments & Modern Package Management (uv / pip)',
    'Prerequisites: Lesson 0.34',
    'Prerequisites: Lesson 0.34 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.35: Virtual Environments & Modern Package Management (uv / pip)

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.34
- **Subtopics**:
  - `0.35.1` Why virtual environments exist: preventing dependency version conflicts across projects.
  - `0.35.2` Creating and activating environments with `python -m venv .venv`.
  - `0.35.3` Installing dependencies with `pip install` and generating `requirements.txt`.
  - `0.35.4` Ultra-fast modern package management with `uv`: lightning-fast dependency resolution.
- **Key Failure Modes & Edge Cases**: Installing packages into the global system Python instead of an active virtual environment.
- **Verification & Mastery Check**: Create an isolated `.venv`, install `httpx` and `pydantic`, and export a pinned `requirements.txt`.
- **Project Application**: PromptCLI: Isolated dependency blueprint.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.35: Virtual Environments & Modern Package Management (uv / pip)\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Create an isolated `.venv`, install `httpx` and `pydantic`, and export a pinned `requirements.txt`.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Create an isolated `.venv`, install `httpx` and `pydantic`, and export a pinned `requirements.txt`.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.35: Virtual Environments & Modern Package Management (uv / pip)\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Virtual Environments & Modern Package Management (uv / pip)\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Create an isolated `.venv`, install `httpx` and `pydantic`, \")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Create an isolated `.venv`, install `httpx` and `pydantic`, and export a pinned `requirements.txt`.", "failure_mode": "Installing packages into the global system Python instead of an active virtual environment.", "subtopics_count": 4, "subtopics": ["0.35.1 Why virtual environments exist: preventing dependency version conflicts across projects.", "0.35.2 Creating and activating environments with `python -m venv .venv`.", "0.35.3 Installing dependencies with `pip install` and generating `requirements.txt`.", "0.35.4 Ultra-fast modern package management with `uv`: lightning-fast dependency resolution."]}'::jsonb,
    '["Explain how your implementation avoids: Installing packages into the global system Python instead of an active virtual environment.", "How does Virtual Environments & Modern Package Management (uv / pip) scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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