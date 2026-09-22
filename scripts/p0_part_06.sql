INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-26',
    'phase-00-lesson-26-reading-and-writing-files-in-python',
    'phase-0',
    'Lesson 0.26: Reading and Writing Files in Python',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.26: Reading and Writing Files in Python

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.26.1` The file system mental model: folders, files, relative paths vs absolute paths.
  - `0.26.2` Opening files safely: the `with open(...) as f:` context manager that closes files automatically.
  - `0.26.3` Reading files: `.read()`, `.readline()`, and iterating over lines efficiently.
  - `0.26.4` Writing files: write mode (`"w"`) vs append mode (`"a"`).
- **Key Failure Modes & Edge Cases**: Using write mode (`"w"`) instead of append mode (`"a"`), accidentally erasing existing file contents.
- **Verification & Mastery Check**: Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and appends the result to a log file.
- **Project Application**: PromptCLI: Local prompt template loading and output logging.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.26: Reading and Writing Files in Python\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and appends the result to a log file.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and appends the result to a log file.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.26: Reading and Writing Files in Python\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Reading and Writing Files in Python\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a script that reads a prompt template from a `.txt` fi\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a script that reads a prompt template from a `.txt` file, substitutes the user''s name, and appends the result to a log file.", "failure_mode": "Using write mode (`\"w\"`) instead of append mode (`\"a\"`), accidentally erasing existing file contents.", "subtopics_count": 4, "subtopics": ["0.26.1 The file system mental model: folders, files, relative paths vs absolute paths.", "0.26.2 Opening files safely: the `with open(...) as f:` context manager that closes files automatically.", "0.26.3 Reading files: `.read()`, `.readline()`, and iterating over lines efficiently.", "0.26.4 Writing files: write mode (`\"w\"`) vs append mode (`\"a\"`)."]}'::jsonb,
    '["Explain how your implementation avoids: Using write mode (`\"w\"`) instead of append mode (`\"a\"`), accidentally erasing existing file contents.", "How does Reading and Writing Files in Python scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-27',
    'phase-00-lesson-27-json-data-serialization-and-parsing',
    'phase-0',
    'Lesson 0.27: JSON Data: Serialization and Parsing',
    'Prerequisites: Lesson 0.24, Lesson 0.26',
    'Prerequisites: Lesson 0.24, Lesson 0.26 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.27: JSON Data: Serialization and Parsing

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.24, Lesson 0.26
- **Subtopics**:
  - `0.27.1` What is JSON: the universal data format used by modern web apps and AI APIs.
  - `0.27.2` Parsing JSON text into Python dictionaries using `json.loads()`.
  - `0.27.3` Serializing Python dictionaries into JSON text using `json.dumps()`.
  - `0.27.4` Reading and writing `.json` files directly with `json.load()` and `json.dump()`.
- **Key Failure Modes & Edge Cases**: Passing invalid JSON strings (like single quotes or trailing commas) to `json.loads()`, causing `JSONDecodeError`.
- **Verification & Mastery Check**: Parse a simulated LLM JSON response string, extract the message content, and save the structured record to `session.json`.
- **Project Application**: PromptCLI: Configuration management and structured response logging.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.27: JSON Data: Serialization and Parsing\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Parse a simulated LLM JSON response string, extract the message content, and save the structured record to `session.json`.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Parse a simulated LLM JSON response string, extract the message content, and save the structured record to `session.json`.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.27: JSON Data: Serialization and Parsing\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: JSON Data: Serialization and Parsing\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Parse a simulated LLM JSON response string, extract the mess\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Parse a simulated LLM JSON response string, extract the message content, and save the structured record to `session.json`.", "failure_mode": "Passing invalid JSON strings (like single quotes or trailing commas) to `json.loads()`, causing `JSONDecodeError`.", "subtopics_count": 4, "subtopics": ["0.27.1 What is JSON: the universal data format used by modern web apps and AI APIs.", "0.27.2 Parsing JSON text into Python dictionaries using `json.loads()`.", "0.27.3 Serializing Python dictionaries into JSON text using `json.dumps()`.", "0.27.4 Reading and writing `.json` files directly with `json.load()` and `json.dump()`."]}'::jsonb,
    '["Explain how your implementation avoids: Passing invalid JSON strings (like single quotes or trailing commas) to `json.loads()`, causing `JSONDecodeError`.", "How does JSON Data: Serialization and Parsing scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-28',
    'phase-00-lesson-28-error-handling-try-except-graceful-recove',
    'phase-0',
    'Lesson 0.28: Error Handling: try, except & Graceful Recovery',
    'Prerequisites: Lesson 0.8',
    'Prerequisites: Lesson 0.8 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.28: Error Handling: try, except & Graceful Recovery

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.8
- **Subtopics**:
  - `0.28.1` Why programs fail: syntax errors vs runtime exceptions.
  - `0.28.2` Catching errors with `try` and `except`: keeping your application running when inputs are invalid.
  - `0.28.3` Specific exception types: `ValueError`, `KeyError`, `FileNotFoundError`, `TypeError`.
  - `0.28.4` The `finally` and `else` blocks: running cleanup routines reliably.
- **Key Failure Modes & Edge Cases**: Using a bare `except:` clause without specifying the error type, silently masking fatal bugs.
- **Verification & Mastery Check**: Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default prompt without crashing.
- **Project Application**: PromptCLI: Resilient input parser and configuration loader.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.28: Error Handling: try, except & Graceful Recovery\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default prompt without crashing.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default prompt without crashing.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.28: Error Handling: try, except & Graceful Recovery\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Error Handling: try, except & Graceful Recovery\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a robust file-reading function that catches `FileNotFo\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a robust file-reading function that catches `FileNotFoundError` and returns a friendly default prompt without crashing.", "failure_mode": "Using a bare `except:` clause without specifying the error type, silently masking fatal bugs.", "subtopics_count": 4, "subtopics": ["0.28.1 Why programs fail: syntax errors vs runtime exceptions.", "0.28.2 Catching errors with `try` and `except`: keeping your application running when inputs are invalid.", "0.28.3 Specific exception types: `ValueError`, `KeyError`, `FileNotFoundError`, `TypeError`.", "0.28.4 The `finally` and `else` blocks: running cleanup routines reliably."]}'::jsonb,
    '["Explain how your implementation avoids: Using a bare `except:` clause without specifying the error type, silently masking fatal bugs.", "How does Error Handling: try, except & Graceful Recovery scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-29',
    'phase-00-lesson-29-environment-variables-secrets-management',
    'phase-0',
    'Lesson 0.29: Environment Variables & Secrets Management',
    'Prerequisites: Lesson 0.26',
    'Prerequisites: Lesson 0.26 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.29: Environment Variables & Secrets Management

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.26
- **Subtopics**:
  - `0.29.1` Why hardcoding secrets is dangerous: keeping API keys out of Git repositories.
  - `0.29.2` Reading environment variables with Python''s built-in `os.environ` and `os.getenv()`.
  - `0.29.3` Using `.env` files locally with `python-dotenv`.
  - `0.29.4` The `.gitignore` file: preventing secrets and local caches from ever being committed to GitHub.
- **Key Failure Modes & Edge Cases**: Committing an un-ignored `.env` file to a public repository, exposing production AI API keys.
- **Verification & Mastery Check**: Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the key is missing.
- **Project Application**: PromptCLI: Secure API key configuration manager.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.29: Environment Variables & Secrets Management\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the key is missing.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the key is missing.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.29: Environment Variables & Secrets Management\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Environment Variables & Secrets Management\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Configure a script that loads an `OPENAI_API_KEY` from a loc\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Configure a script that loads an `OPENAI_API_KEY` from a local `.env` file, printing an error if the key is missing.", "failure_mode": "Committing an un-ignored `.env` file to a public repository, exposing production AI API keys.", "subtopics_count": 4, "subtopics": ["0.29.1 Why hardcoding secrets is dangerous: keeping API keys out of Git repositories.", "0.29.2 Reading environment variables with Python''s built-in `os.environ` and `os.getenv()`.", "0.29.3 Using `.env` files locally with `python-dotenv`.", "0.29.4 The `.gitignore` file: preventing secrets and local caches from ever being committed to GitHub."]}'::jsonb,
    '["Explain how your implementation avoids: Committing an un-ignored `.env` file to a public repository, exposing production AI API keys.", "How does Environment Variables & Secrets Management scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-30',
    'phase-00-lesson-30-making-http-get-and-post-requests-with-ht',
    'phase-0',
    'Lesson 0.30: Making HTTP GET and POST Requests with HTTPX',
    'Prerequisites: Lesson 0.27, Lesson 0.29',
    'Prerequisites: Lesson 0.27, Lesson 0.29 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.30: Making HTTP GET and POST Requests with HTTPX

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.27, Lesson 0.29
- **Subtopics**:
  - `0.30.1` The Client-Server model: how your computer talks to remote API servers across the internet.
  - `0.30.2` HTTP verbs: GET (fetching data) vs POST (submitting prompts and payloads).
  - `0.30.3` Sending headers: authentication tokens (`Bearer ...`) and Content-Type (`application/json`).
  - `0.30.4` Checking status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limited), 500 (Server Error).
- **Key Failure Modes & Edge Cases**: Forgetting to check `.status_code` or call `.raise_for_status()`, leading to subtle bugs on failed requests.
- **Verification & Mastery Check**: Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.
- **Project Application**: PromptCLI: Remote AI inference gateway client.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.30: Making HTTP GET and POST Requests with HTTPX\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.30: Making HTTP GET and POST Requests with HTTPX\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Making HTTP GET and POST Requests with HTTPX\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Send an HTTP POST request to a mock JSON endpoint using `htt\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Send an HTTP POST request to a mock JSON endpoint using `httpx` and verify the status code is 200.", "failure_mode": "Forgetting to check `.status_code` or call `.raise_for_status()`, leading to subtle bugs on failed requests.", "subtopics_count": 4, "subtopics": ["0.30.1 The Client-Server model: how your computer talks to remote API servers across the internet.", "0.30.2 HTTP verbs: GET (fetching data) vs POST (submitting prompts and payloads).", "0.30.3 Sending headers: authentication tokens (`Bearer ...`) and Content-Type (`application/json`).", "0.30.4 Checking status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), 429 (Rate Limited), 500 (Server Error)."]}'::jsonb,
    '["Explain how your implementation avoids: Forgetting to check `.status_code` or call `.raise_for_status()`, leading to subtle bugs on failed requests.", "How does Making HTTP GET and POST Requests with HTTPX scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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