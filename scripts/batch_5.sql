UPDATE curriculum_nodes 
SET title = 'Lesson 0.41: Writing Your First Automated Test with Pytest', 
    subtitle = 'Prerequisites: Lesson 0.34', 
    cs_foundation = 'Prerequisites: Lesson 0.34 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.41: Writing Your First Automated Test with Pytest

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.34
- **Subtopics**:
  - `0.41.1` The Testing mindset: why manual testing does not scale and automated tests guarantee reliability.
  - `0.41.2` The `pytest` framework: writing test functions named `test_*` and using plain Python `assert`.
  - `0.41.3` Running test suites: executing `pytest` from the terminal and interpreting green/red results.
  - `0.41.4` Testing edge cases: empty strings, extreme numbers, and unexpected inputs.
- **Key Failure Modes & Edge Cases**: Writing tests that test nothing (missing `assert`), giving false confidence in broken code.
- **Verification & Mastery Check**: Write a test suite with 4 distinct assertions testing a prompt sanitization function against normal and edge-case inputs.
- **Project Application**: PromptCLI: Automated regression test suite.'
WHERE id = 'node-0-41';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.42: Test Fixtures & Mocking External APIs', 
    subtitle = 'Prerequisites: Lesson 0.41', 
    cs_foundation = 'Prerequisites: Lesson 0.41 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.42: Test Fixtures & Mocking External APIs

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.41
- **Subtopics**:
  - `0.42.1` Why we don''t call real AI APIs in unit tests: cost, latency, and unpredictable outputs.
  - `0.42.2` Pytest fixtures: reusing setup objects and mock configurations across multiple test cases.
  - `0.42.3` Mocking HTTP requests: using `unittest.mock` or `pytest-mock` to simulate API responses.
  - `0.42.4` Testing failure modes: verifying that your application handles 500 errors and timeouts without crashing.
- **Key Failure Modes & Edge Cases**: Allowing unit tests to make live internet calls, causing test suites to fail when internet drops or API balances run out.
- **Verification & Mastery Check**: Write an automated test that mocks an AI API response and verifies that your parser extracts the answer correctly.
- **Project Application**: PromptCLI: Mocked API test coverage.'
WHERE id = 'node-0-42';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.43: Linux Terminal Architecture, Shells, & Environment', 
    subtitle = 'Prerequisites: Lesson 0.37', 
    cs_foundation = 'Prerequisites: Lesson 0.37 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.43: Linux Terminal Architecture, Shells, & Environment

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.37
- **Subtopics**:
  - `0.43.1` Terminal Emulators, Pseudo-Terminals (PTY), and Line Discipline (cooked mode vs raw mode).
  - `0.43.2` POSIX Shell execution model: command lookup, PATH traversal, subshells, process substitution.
  - `0.43.3` Environment variables: inherited environment, exporting variables (`export`), local variables.
  - `0.43.4` Shell configuration lifecycle: `/etc/profile`, `~/.bash_profile`, `~/.bashrc`, interactive vs non-interactive shells.
- **Key Failure Modes & Edge Cases**: Modifying environment variables in subshells and wondering why parent process environments remain unchanged.
- **Verification & Mastery Check**: Trace environment variable inheritance across nested subshells and background processes.
- **Project Application**: SysTrace: Execution environment and path configuration.'
WHERE id = 'node-0-43';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.44: Standard Streams, Redirection, & Pipes', 
    subtitle = 'Prerequisites: Lesson 0.40', 
    cs_foundation = 'Prerequisites: Lesson 0.40 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.44: Standard Streams, Redirection, & Pipes

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.40
- **Subtopics**:
  - `0.44.1` Stream redirection syntax: `>`, `>>`, `<`, `2>`, `2>&1`, `&>`.
  - `0.44.2` The UNIX Pipe (`|`): kernel anonymous pipe connecting stdout of process A to stdin of process B.
  - `0.44.3` Buffering semantics: fully buffered (block buffered when redirected to file) vs line buffered (TTY terminals).
  - `0.44.4` Process substitution (`<()`, `>()`): passing command outputs as file paths to commands expecting files.
- **Key Failure Modes & Edge Cases**: Pipeline deadlocks or silent data loss when mixing stdout and stderr redirection in wrong order (`2>&1 >file`).
- **Verification & Mastery Check**: Construct a pipeline that redirects stdout to a file and stderr to a background alerting script simultaneously.
- **Project Application**: Core text manipulation pipeline in `SysTrace`.'
WHERE id = 'node-0-44';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.45: Process Control Signals (`SIGTERM`, `SIGKILL`, `SIGINT`)', 
    subtitle = 'Prerequisites: Lesson 0.41', 
    cs_foundation = 'Prerequisites: Lesson 0.41 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.45: Process Control Signals (`SIGTERM`, `SIGKILL`, `SIGINT`)

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.41
- **Subtopics**:
  - `0.45.1` POSIX signals: asynchronous kernel notifications sent to processes.
  - `0.45.2` Standard signals: `SIGINT` (2, Ctrl+C), `SIGQUIT` (3), `SIGKILL` (9, non-catchable), `SIGTERM` (15, graceful exit request), `SIGHUP` (1, hangup/reload).
  - `0.45.3` Signal handling in Bash: the `trap` command, executing cleanup routines on script termination.
  - `0.45.4` Process groups and sessions: sending signals to entire process trees using negative PID syntax (`kill -- -PGID`).
- **Key Failure Modes & Edge Cases**: Using `kill -9` as the default termination command, leaving database locks, temporary files, and socket ports locked.
- **Verification & Mastery Check**: Write a Bash script with a `trap` handler that cleanly removes temporary directories even when terminated via `SIGINT`.
- **Project Application**: SysTrace: Clean shutdown and signal trapping.'
WHERE id = 'node-0-45';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.46: POSIX File Permissions, Ownership, & Special Bits', 
    subtitle = 'Prerequisites: Lesson 0.40', 
    cs_foundation = 'Prerequisites: Lesson 0.40 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.46: POSIX File Permissions, Ownership, & Special Bits

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.40
- **Subtopics**:
  - `0.46.1` POSIX permission octets: Owner, Group, Others; Read (4), Write (2), Execute (1).
  - `0.46.2` The `umask`: default permission masking calculation for newly created files and directories.
  - `0.46.3` Special permission bits: SUID (Set User ID - executes as file owner), SGID (Set Group ID), Sticky Bit (restricted deletion in `/tmp`).
  - `0.46.4` Ownership management: `chmod`, `chown`, `chgrp`, recursive updates, and symbolic link handling.
- **Key Failure Modes & Edge Cases**: Security disaster: setting permissions to `777` to fix a permission error, exposing secrets and code to all local users.
- **Verification & Mastery Check**: Demonstrate how SUID permissions permit unprivileged users to execute privileged actions safely.
- **Project Application**: Security audit checks in `DevAudit`.'
WHERE id = 'node-0-46';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.47: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)', 
    subtitle = 'Prerequisites: Lesson 0.44', 
    cs_foundation = 'Prerequisites: Lesson 0.44 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.47: High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.44
- **Subtopics**:
  - `0.47.1` `grep` mastery: recursive search (`-r`), inverted matching (`-v`), line numbering (`-n`), counting (`-c`), PCRE regex (`-P`).
  - `0.47.2` `sed` stream editor: search and replace (`s/pattern/replacement/g`), address ranges, deleting lines (`/d`), in-place editing (`-i`).
  - `0.47.3` `awk` programming: pattern-action pairs, field separators (`-F`), built-in variables (`NR`, `NF`, `$1`, `$2`), associative arrays.
  - `0.47.4` Composing Unix pipelines: combining `grep | awk | sort | uniq -c | sort -nr` for high-throughput log analysis.
- **Key Failure Modes & Edge Cases**: Running unquoted `sed -i` commands on macOS vs Linux, causing script syntax crashes across operating systems.
- **Verification & Mastery Check**: Parse an Nginx access log file with `awk` and output the top 5 IP addresses by total bytes transferred in under 3 seconds.
- **Project Application**: SysTrace: Log parsing and metric formatting.'
WHERE id = 'node-0-47';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.48: Robust Bash Scripting, Error Trapping, & `shellcheck`', 
    subtitle = 'Prerequisites: Lesson 0.45', 
    cs_foundation = 'Prerequisites: Lesson 0.45 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.48: Robust Bash Scripting, Error Trapping, & `shellcheck`

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.45
- **Subtopics**:
  - `0.48.1` Bash strict mode: `set -euo pipefail` (exit on error, exit on unset variable, inherit pipeline failure status).
  - `0.48.2` Quoting rules in Bash: why double quoting (`"$var"`) prevents catastrophic word splitting and pathname globbing.
  - `0.48.3` Conditional branching and arithmetic: `[[ ... ]]` vs `[ ... ]`, integer testing, string testing, regex matching.
  - `0.48.4` Automated shell static analysis: running `shellcheck` to detect bugs, unhandled exit codes, and portability violations.
- **Key Failure Modes & Edge Cases**: Executing `rm -rf $DIR/` when `DIR` is unset, resulting in the accidental execution of `rm -rf /`.
- **Verification & Mastery Check**: Write a 100-line Bash utility that passes `shellcheck` with zero warnings, zero hints, and strict error handling.
- **Project Application**: SysTrace: Mandatory quality standard for Phase 0 project.'
WHERE id = 'node-0-48';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.49: Regular Expressions: Finite Automata & Core Syntax', 
    subtitle = 'Prerequisites: Lesson 0.47', 
    cs_foundation = 'Prerequisites: Lesson 0.47 | Subtopics: 4 items',
    ai_convergence = 'AI software application',
    handbook_markdown = '# Lesson 0.49: Regular Expressions: Finite Automata & Core Syntax

- **Status**: `[State: Active | Complete Specification | Core]`
- **Prerequisites**: Lesson 0.47
- **Subtopics**:
  - `0.49.1` Automata theory: Deterministic Finite Automata (DFA) vs Non-Deterministic Finite Automata (NFA).
  - `0.49.2` Metacharacters, literals, character classes (`[...]`, `[^...]`), shorthand classes (`\d`, `\w`, `\s`).
  - `0.49.3` Quantifiers: greedy (`*`, `+`, `{n,m}`), lazy/reluctant (`*?`, `+?`), possessive (`*+`).
  - `0.49.4` Anchors: line anchors (`^`, `$`), word boundaries (`\b`, `\B`), string anchors (`\A`, `\Z`).
- **Key Failure Modes & Edge Cases**: Greedy quantifiers consuming unexpected characters across multi-line inputs, extracting corrupted substrings.
- **Verification & Mastery Check**: Write a regular expression that matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255) without false positives.
- **Project Application**: DevAudit: Secret detection pattern matching engine.'
WHERE id = 'node-0-49';

UPDATE curriculum_nodes 
SET title = 'Lesson 0.50: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading', 
    subtitle = 'Prerequisites: Lesson 0.49', 
    cs_foundation = 'Prerequisites: Lesson 0.49 | Subtopics: 4 items',
    ai_convergence = 'Exit benchmark requirement for Phase 0.',
    handbook_markdown = '# Lesson 0.50: ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading

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

---'
WHERE id = 'node-0-50';