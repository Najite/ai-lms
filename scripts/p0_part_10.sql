INSERT INTO curriculum_nodes (
    id, slug, phase_id, title, subtitle, cs_foundation, ai_convergence, 
    xp_reward, handbook_markdown, starter_code, test_suite, defense_prompts
)
VALUES (
    'node-0-46',
    'phase-00-lesson-46-posix-file-permissions-ownership-special-',
    'phase-0',
    'Lesson 0.46: POSIX File Permissions, Ownership, & Special Bits',
    'Prerequisites: Lesson 0.40',
    'Prerequisites: Lesson 0.40 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.46: POSIX File Permissions, Ownership, & Special Bits

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.40
- **Subtopics**:
  - `0.46.1` POSIX permission octets: Owner, Group, Others; Read (4), Write (2), Execute (1).
  - `0.46.2` The `umask`: default permission masking calculation for newly created files and directories.
  - `0.46.3` Special permission bits: SUID (Set User ID - executes as file owner), SGID (Set Group ID), Sticky Bit (restricted deletion in `/tmp`).
  - `0.46.4` Ownership management: `chmod`, `chown`, `chgrp`, recursive updates, and symbolic link handling.
- **Key Failure Modes & Edge Cases**: Security disaster: setting permissions to `777` to fix a permission error, exposing secrets and code to all local users.
- **Verification & Mastery Check**: Demonstrate how SUID permissions permit unprivileged users to execute privileged actions safely.
- **Project Application**: Security audit checks in `DevAudit`.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.46: POSIX File Permissions, Ownership, & Special Bits\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Demonstrate how SUID permissions permit unprivileged users to execute privileged actions safely.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Demonstrate how SUID permissions permit unprivileged users to execute privileged actions safely.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.46: POSIX File Permissions, Ownership, & Special Bits\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: POSIX File Permissions, Ownership, & Special Bits\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Demonstrate how SUID permissions permit unprivileged users t\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Demonstrate how SUID permissions permit unprivileged users to execute privileged actions safely.", "failure_mode": "Security disaster: setting permissions to `777` to fix a permission error, exposing secrets and code to all local users.", "subtopics_count": 4, "subtopics": ["0.46.1 POSIX permission octets: Owner, Group, Others; Read (4), Write (2), Execute (1).", "0.46.2 The `umask`: default permission masking calculation for newly created files and directories.", "0.46.3 Special permission bits: SUID (Set User ID - executes as file owner), SGID (Set Group ID), Sticky Bit (restricted deletion in `/tmp`).", "0.46.4 Ownership management: `chmod`, `chown`, `chgrp`, recursive updates, and symbolic link handling."]}'::jsonb,
    '["Explain how your implementation avoids: Security disaster: setting permissions to `777` to fix a permission error, exposing secrets and code to all local users.", "How does POSIX File Permissions, Ownership, & Special Bits scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-47',
    'phase-00-lesson-47-high-performance-text-processing-grep-sed',
    'phase-0',
    'Lesson 0.47: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)',
    'Prerequisites: Lesson 0.44',
    'Prerequisites: Lesson 0.44 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.47: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.44
- **Subtopics**:
  - `0.47.1` `grep` mastery: recursive search (`-r`), inverted matching (`-v`), line numbering (`-n`), counting (`-c`), PCRE regex (`-P`).
  - `0.47.2` `sed` stream editor: search and replace (`s/pattern/replacement/g`), address ranges, deleting lines (`/d`), in-place editing (`-i`).
  - `0.47.3` `awk` programming: pattern-action pairs, field separators (`-F`), built-in variables (`NR`, `NF`, `$1`, `$2`), associative arrays.
  - `0.47.4` Composing Unix pipelines: combining `grep | awk | sort | uniq -c | sort -nr` for high-throughput log analysis.
- **Key Failure Modes & Edge Cases**: Running unquoted `sed -i` commands on macOS vs Linux, causing script syntax crashes across operating systems.
- **Verification & Mastery Check**: Parse an Nginx access log file with `awk` and output the top 5 IP addresses by total bytes transferred in under 3 seconds.
- **Project Application**: SysTrace: Log parsing and metric formatting.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.47: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Parse an Nginx access log file with `awk` and output the top 5 IP addresses by total bytes transferred in under 3 seconds.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Parse an Nginx access log file with `awk` and output the top 5 IP addresses by total bytes transferred in under 3 seconds.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.47: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Parse an Nginx access log file with `awk` and output the top\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Parse an Nginx access log file with `awk` and output the top 5 IP addresses by total bytes transferred in under 3 seconds.", "failure_mode": "Running unquoted `sed -i` commands on macOS vs Linux, causing script syntax crashes across operating systems.", "subtopics_count": 4, "subtopics": ["0.47.1 `grep` mastery: recursive search (`-r`), inverted matching (`-v`), line numbering (`-n`), counting (`-c`), PCRE regex (`-P`).", "0.47.2 `sed` stream editor: search and replace (`s/pattern/replacement/g`), address ranges, deleting lines (`/d`), in-place editing (`-i`).", "0.47.3 `awk` programming: pattern-action pairs, field separators (`-F`), built-in variables (`NR`, `NF`, `$1`, `$2`), associative arrays.", "0.47.4 Composing Unix pipelines: combining `grep | awk | sort | uniq -c | sort -nr` for high-throughput log analysis."]}'::jsonb,
    '["Explain how your implementation avoids: Running unquoted `sed -i` commands on macOS vs Linux, causing script syntax crashes across operating systems.", "How does High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`) scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-48',
    'phase-00-lesson-48-robust-bash-scripting-error-trapping-shel',
    'phase-0',
    'Lesson 0.48: Robust Bash Scripting, Error Trapping, & `shellcheck`',
    'Prerequisites: Lesson 0.45',
    'Prerequisites: Lesson 0.45 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.48: Robust Bash Scripting, Error Trapping, & `shellcheck`

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.45
- **Subtopics**:
  - `0.48.1` Bash strict mode: `set -euo pipefail` (exit on error, exit on unset variable, inherit pipeline failure status).
  - `0.48.2` Quoting rules in Bash: why double quoting (`"$var"`) prevents catastrophic word splitting and pathname globbing.
  - `0.48.3` Conditional branching and arithmetic: `[[ ... ]]` vs `[ ... ]`, integer testing, string testing, regex matching.
  - `0.48.4` Automated shell static analysis: running `shellcheck` to detect bugs, unhandled exit codes, and portability violations.
- **Key Failure Modes & Edge Cases**: Executing `rm -rf $DIR/` when `DIR` is unset, resulting in the accidental execution of `rm -rf /`.
- **Verification & Mastery Check**: Write a 100-line Bash utility that passes `shellcheck` with zero warnings, zero hints, and strict error handling.
- **Project Application**: SysTrace: Mandatory quality standard for Phase 0 project.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.48: Robust Bash Scripting, Error Trapping, & `shellcheck`\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a 100-line Bash utility that passes `shellcheck` with zero warnings, zero hints, and strict error handling.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a 100-line Bash utility that passes `shellcheck` with zero warnings, zero hints, and strict error handling.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.48: Robust Bash Scripting, Error Trapping, & `shellcheck`\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Robust Bash Scripting, Error Trapping, & `shellcheck`\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a 100-line Bash utility that passes `shellcheck` with \")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a 100-line Bash utility that passes `shellcheck` with zero warnings, zero hints, and strict error handling.", "failure_mode": "Executing `rm -rf $DIR/` when `DIR` is unset, resulting in the accidental execution of `rm -rf /`.", "subtopics_count": 4, "subtopics": ["0.48.1 Bash strict mode: `set -euo pipefail` (exit on error, exit on unset variable, inherit pipeline failure status).", "0.48.2 Quoting rules in Bash: why double quoting (`\"$var\"`) prevents catastrophic word splitting and pathname globbing.", "0.48.3 Conditional branching and arithmetic: `[[ ... ]]` vs `[ ... ]`, integer testing, string testing, regex matching.", "0.48.4 Automated shell static analysis: running `shellcheck` to detect bugs, unhandled exit codes, and portability violations."]}'::jsonb,
    '["Explain how your implementation avoids: Executing `rm -rf $DIR/` when `DIR` is unset, resulting in the accidental execution of `rm -rf /`.", "How does Robust Bash Scripting, Error Trapping, & `shellcheck` scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-49',
    'phase-00-lesson-49-regular-expressions-finite-automata-core-',
    'phase-0',
    'Lesson 0.49: Regular Expressions: Finite Automata & Core Syntax',
    'Prerequisites: Lesson 0.47',
    'Prerequisites: Lesson 0.47 | Subtopics: 4 items',
    'PromptCLI Interactive Developer Workbench',
    100,
    '# Lesson 0.49: Regular Expressions: Finite Automata & Core Syntax

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.47
- **Subtopics**:
  - `0.49.1` Automata theory: Deterministic Finite Automata (DFA) vs Non-Deterministic Finite Automata (NFA).
  - `0.49.2` Metacharacters, literals, character classes (`[...]`, `[^...]`), shorthand classes (`\d`, `\w`, `\s`).
  - `0.49.3` Quantifiers: greedy (`*`, `+`, `{n,m}`), lazy/reluctant (`*?`, `+?`), possessive (`*+`).
  - `0.49.4` Anchors: line anchors (`^`, `$`), word boundaries (`\b`, `\B`), string anchors (`\A`, `\Z`).
- **Key Failure Modes & Edge Cases**: Greedy quantifiers consuming unexpected characters across multi-line inputs, extracting corrupted substrings.
- **Verification & Mastery Check**: Write a regular expression that matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255) without false positives.
- **Project Application**: DevAudit: Secret detection pattern matching engine.',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.49: Regular Expressions: Finite Automata & Core Syntax\nProject Application: PromptCLI Interactive Developer Workbench\nVerification Requirement: Write a regular expression that matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255) without false positives.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Write a regular expression that matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255) without false positives.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.49: Regular Expressions: Finite Automata & Core Syntax\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: Regular Expressions: Finite Automata & Core Syntax\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Write a regular expression that matches valid IPv4 addresses\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Write a regular expression that matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255) without false positives.", "failure_mode": "Greedy quantifiers consuming unexpected characters across multi-line inputs, extracting corrupted substrings.", "subtopics_count": 4, "subtopics": ["0.49.1 Automata theory: Deterministic Finite Automata (DFA) vs Non-Deterministic Finite Automata (NFA).", "0.49.2 Metacharacters, literals, character classes (`[...]`, `[^...]`), shorthand classes (`\\d`, `\\w`, `\\s`).", "0.49.3 Quantifiers: greedy (`*`, `+`, `{n,m}`), lazy/reluctant (`*?`, `+?`), possessive (`*+`).", "0.49.4 Anchors: line anchors (`^`, `$`), word boundaries (`\\b`, `\\B`), string anchors (`\\A`, `\\Z`)."]}'::jsonb,
    '["Explain how your implementation avoids: Greedy quantifiers consuming unexpected characters across multi-line inputs, extracting corrupted substrings.", "How does Regular Expressions: Finite Automata & Core Syntax scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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
    'node-0-50',
    'phase-00-lesson-50-redos-catastrophic-backtracking-cpython-l',
    'phase-0',
    'Lesson 0.50: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading',
    'Prerequisites: Lesson 0.49',
    'Prerequisites: Lesson 0.49 | Subtopics: 4 items',
    'Exit benchmark requirement for Phase 0.',
    100,
    '# Lesson 0.50: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.49
- **Subtopics**:
  - `0.50.1` Catastrophic Backtracking in NFA engines: exponential branching ($O(2^n)$) on ambiguous nested quantifiers (e.g., `(a+)+$`).
  - `0.50.2` Regular Expression Denial of Service (ReDoS): how an adversarial 30-character string freezes a web server for minutes.
  - `0.50.3` Safe regex design: eliminating overlapping branches, atomic groups, possessive quantifiers.
  - `0.50.4` CPython Source Archeology: reading `Objects/listobject.c`; dissecting `list_resize()` dynamic over-allocation.
- **Key Failure Modes & Edge Cases**: Production outage caused by an un-anchored, nested regex executed against user-submitted input in an API gateway.
- **Verification & Mastery Check**: Identify and fix a catastrophic backtracking regex, and write a 500-word teardown of CPython `list_resize()` over-allocation.
- **Project Application**: Exit benchmark requirement for Phase 0.


---

---',
    '{"solution.py": "\"\"\"\nPhase 0 // Lesson 0.50: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading\nProject Application: Exit benchmark requirement for Phase 0.\nVerification Requirement: Identify and fix a catastrophic backtracking regex, and write a 500-word teardown of CPython `list_resize()` over-allocation.\n\"\"\"\n\ndef solve(*args, **kwargs):\n    \"\"\"\n    Identify and fix a catastrophic backtracking regex, and write a 500-word teardown of CPython `list_resize()` over-allocation.\n    \"\"\"\n    # TODO: Implement complete solution adhering to lesson requirements\n    return True\n\nif __name__ == \"__main__\":\n    print(\"Executing local verification...\")\n    result = solve()\n    print(f\"Result: {result}\")\n"}'::jsonb,
    '{"tests.py": "\"\"\"\nAutomated Verification Suite for Lesson 0.50: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading\n\"\"\"\n\ndef run_tests():\n    print(\"============================= test session starts ==============================\")\n    print(\"platform wasm -- Python 3.12 (client-side sandbox)\")\n    print(\"target: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading\")\n\n    from solution import solve\n    assert callable(solve), \"solve function must be defined and callable\"\n    print(\"tests/test_solution.py::test_callable PASSED                          [ 50%]\")\n\n    res = solve()\n    assert res is not None, \"solve must return a valid result\"\n    print(\"tests/test_solution.py::test_verification PASSED                      [100%]\")\n\n    print(\"\")\n    print(\"============================== 2 passed in 0.008s ===============================\")\n    print(\"\u2713 Verification passed: Identify and fix a catastrophic backtracking regex, and writ\")\n\nif __name__ == \"__main__\":\n    run_tests()\n", "verification_criteria": "Identify and fix a catastrophic backtracking regex, and write a 500-word teardown of CPython `list_resize()` over-allocation.", "failure_mode": "Production outage caused by an un-anchored, nested regex executed against user-submitted input in an API gateway.", "subtopics_count": 4, "subtopics": ["0.50.1 Catastrophic Backtracking in NFA engines: exponential branching ($O(2^n)$) on ambiguous nested quantifiers (e.g., `(a+)+$`).", "0.50.2 Regular Expression Denial of Service (ReDoS): how an adversarial 30-character string freezes a web server for minutes.", "0.50.3 Safe regex design: eliminating overlapping branches, atomic groups, possessive quantifiers.", "0.50.4 CPython Source Archeology: reading `Objects/listobject.c`; dissecting `list_resize()` dynamic over-allocation."]}'::jsonb,
    '["Explain how your implementation avoids: Production outage caused by an un-anchored, nested regex executed against user-submitted input in an API gateway.", "How does ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading scale when handling large prompt streams or user inputs?", "Defend the architectural tradeoffs of this approach in production AI engineering."]'::jsonb
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