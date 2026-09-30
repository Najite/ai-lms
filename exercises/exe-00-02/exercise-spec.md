# Exercise Specification: EXE-00-02
# Shell Streams, Pipes & Command Flow Investigation

**Document Version:** 1.0.0  
**Exercise Slug:** `exe-00-02-shell-streams-pipes-investigation`  
**Classification:** Production Assessment Engine Specification  
**Target Competency:** `DEV-00` (Developer Environment & Tooling Fluency)  
**State Progression:** `Practicing` &rarr; `Reinforced`

---

## 1. Exercise Overview & Scenario Narrative

### 1.1 The Production Incident Scenario: Gateway Outage Investigation
At 14:02 UTC, the primary API Gateway (`gateway-prod-01`) began returning elevated HTTP `502 Bad Gateway` and `500 Internal Server Error` responses. The on-call engineering team generated three log streams:
- Application Access Log: `/var/log/api-gateway/access.log`
- System Error Log: `/var/log/api-gateway/error.log`
- Deployment Check Telemetry: `/var/log/deploy/healthcheck.raw`

The learner acts as the **Site Reliability & Incident Triage Engineer**. Rather than writing custom scripts or programs, the learner must use standard CLI streams, file redirection, and multi-stage Unix pipe flows to extract actionable diagnostics, separate error streams from normal outputs, and isolate the root cause.

---

## 2. Interactive Workbench Schema & Submission Payload

The visual interactive workbench synthesizes learner actions into a type-safe JSON submission payload adhering to the following TypeScript contract:

```typescript
export interface ShellInvestigationSubmissionPayload {
  version: "1.0.0";
  exercise_slug: "exe-00-02-shell-streams-pipes-investigation";
  
  // Stage 1: Terminal vs Shell & Command Anatomy
  command_anatomy: {
    terminal_vs_shell_classification: {
      terminal_role: "display_input_window";
      shell_role: "interpreter_process_launcher";
    };
    deconstructed_commands: Array<{
      command_id: string; // e.g. "CMD-01", "CMD-02", "CMD-03"
      raw_string: string;
      executable: string;
      flags: string[];
      arguments: string[];
    }>;
  };

  // Stage 2: Standard Streams & Redirection Router
  stream_routing: {
    redirection_challenges: Array<{
      challenge_id: string; // e.g. "REDIR-01", "REDIR-02", "REDIR-03"
      command_string: string;
      stdout_destination: string; // e.g. "/var/log/deploy/stdout.log", "terminal", "/dev/null"
      stderr_destination: string; // e.g. "/var/log/deploy/error.log", "terminal", "/dev/null"
      operator_used: ">" | ">>" | "2>" | "2>&1" | "<";
      file_write_mode: "overwrite" | "append" | "merge" | "read";
    }>;
  };

  // Stage 3: Multi-Stage Pipe Composition
  pipeline_composition: {
    incident_pipeline: {
      pipeline_id: "INCIDENT-500-TRIAGE";
      stages: Array<{
        stage_index: number;
        executable: "cat" | "grep" | "sort" | "uniq" | "head" | "tail" | "wc";
        flags: string[];
        arguments: string[];
        input_stream: "file_path" | "stdin_from_pipe";
        output_stream: "stdout_to_pipe" | "stdout_to_file";
      }>;
      final_redirect_target: string;
    };
  };

  // Stage 4: Broken Pipeline Diagnosis & Stream Forensics
  diagnostic_triage: Array<{
    bug_id: string; // e.g. "BUG-01", "BUG-02", "BUG-03"
    failing_command: string;
    root_cause_category: "pipe_vs_redirect_confusion" | "stderr_leakage_to_terminal" | "accidental_file_truncation";
    corrected_command: string;
    explanation: string;
  }>;
}
```

---

## 3. Challenge Stages & Detailed Requirements

### 3.1 Stage 1: Command Anatomy & Environment Deconstruction
Learners must analyze three production commands and correctly isolate their component parts:
1. `grep -i -n "FATAL" /var/log/api-gateway/error.log`
   - **Executable**: `grep`
   - **Flags**: `["-i", "-n"]` (or `["-in"]`)
   - **Arguments**: `["FATAL", "/var/log/api-gateway/error.log"]`
2. `tail -n 50 /var/log/api-gateway/access.log`
   - **Executable**: `tail`
   - **Flags**: `["-n", "50"]` (or flag `-n` with value `50`)
   - **Arguments**: `["/var/log/api-gateway/access.log"]`
3. `curl -s -v --connect-timeout 5 https://api.internal/health`
   - **Executable**: `curl`
   - **Flags**: `["-s", "-v", "--connect-timeout 5"]`
   - **Arguments**: `["https://api.internal/health"]`

### 3.2 Stage 2: Standard Streams & Redirection Router
Learners must route standard streams to fulfill three incident triage routing requirements:
1. **Challenge `REDIR-01`**: Run health check, capture clean status to `/tmp/health.txt` while overwriting existing contents.
   - Operator: `>`
   - `stdout_destination`: `/tmp/health.txt`
   - `stderr_destination`: `terminal`
2. **Challenge `REDIR-02`**: Run diagnostic audit, preserve existing audit history by appending new findings to `/var/log/audit.log`.
   - Operator: `>>`
   - `stdout_destination`: `/var/log/audit.log`
   - `file_write_mode`: `append`
3. **Challenge `REDIR-03`**: Run failing database check, isolate error stream into `/var/log/db_errors.log` without letting error messages pollute normal stdout.
   - Operator: `2>`
   - `stdout_destination`: `terminal`
   - `stderr_destination`: `/var/log/db_errors.log`
4. **Challenge `REDIR-04`**: Combine both standard output and error diagnostics into a single merged log `/var/log/full-incident.log`.
   - Operator: `2>&1` or `> ... 2>&1`
   - `stdout_destination`: `/var/log/full-incident.log`
   - `stderr_destination`: `merged_with_stdout`

### 3.3 Stage 3: Multi-Stage Pipe Composition
Learners connect visual command nodes to construct the 5-stage incident log triage pipeline:
1. **Stage 0**: `cat /var/log/api-gateway/access.log` (Inlet: reads log file)
2. **Stage 1**: `grep " 500 "` (Filter: keeps only HTTP 500 error rows)
3. **Stage 2**: `sort` (Ordering: groups identical endpoint occurrences together)
4. **Stage 3**: `uniq -c` (Aggregation: prefixes occurrence count to each unique error line)
5. **Stage 4**: `head -n 5` (Extraction: selects the top 5 highest-frequency error sources)
6. **Final Sink**: `> /home/developer/reports/top-5-outages.txt` (Redirection to final forensic report)

### 3.4 Stage 4: Broken Pipeline Diagnosis
Learners triage 3 common command stream bugs:
1. **`BUG-01` (Redirect vs. Pipe)**:
   - *Failing*: `cat /var/log/app.log > grep "ERROR"`
   - *Diagnosis*: `>` redirects stdout to create a literal file named `grep`, destroying the intended pipe flow.
   - *Fix*: `cat /var/log/app.log | grep "ERROR"`
2. **`BUG-02` (Stderr Pipe Leakage)**:
   - *Failing*: `check-services /nonexistent | wc -l`
   - *Diagnosis*: Standard pipes (`|`) only transfer `stdout (1)`. The error message on `stderr (2)` bypasses the pipe and prints directly to terminal, resulting in a count of 0 lines.
   - *Fix*: `check-services /nonexistent 2>&1 | wc -l`
3. **`BUG-03` (Accidental Truncation)**:
   - *Failing*: `record_incident_step > /var/log/incident.log` in an hourly loop.
   - *Diagnosis*: Single `>` truncates and overwrites `/var/log/incident.log`, deleting previous incident history.
   - *Fix*: `record_incident_step >> /var/log/incident.log`

---

## 4. Invariant Assertion Matrix & Test Rules

| Rule ID | Tier | Assertion Description | Weight |
| :--- | :--- | :--- | :--- |
| `EXE-02-RULE-01` | Visible | Terminal (display/window) vs Shell (interpreter process) correctly identified | 5% |
| `EXE-02-RULE-02` | Visible | Command anatomy of `grep` correctly decomposed into executable, flags, arguments | 5% |
| `EXE-02-RULE-03` | Visible | Command anatomy of `tail` and `curl` correctly decomposed | 10% |
| `EXE-02-RULE-04` | Visible | Basic stdout overwrite redirection (`>`) destination correctly mapped | 5% |
| `EXE-02-RULE-05` | Visible | Safe append redirection (`>>`) mode and target correctly configured | 5% |
| `EXE-02-RULE-06` | Visible | Linear pipe flow (`cat | grep | sort | uniq -c | head -n 5`) sequence validated | 10% |
| `EXE-02-RULE-07` | Hidden | Stderr separation redirection (`2>`) correctly routes error stream away from stdout | 8% |
| `EXE-02-RULE-08` | Hidden | Combined stream redirection (`2>&1`) correctly merges error into output file | 8% |
| `EXE-02-RULE-09` | Hidden | Pipeline stage input/output binding: intermediate nodes consume `stdin` and produce `stdout` | 10% |
| `EXE-02-RULE-10` | Hidden | Pipeline filter precision: `grep " 500 "` correctly isolates HTTP status codes | 8% |
| `EXE-02-RULE-11` | Hidden | Pipeline sorting precondition: `uniq -c` must be immediately preceded by `sort` | 8% |
| `EXE-02-RULE-12` | Hidden | Diagnosis `BUG-01`: Correctly detects pipe vs redirect syntax error | 6% |
| `EXE-02-RULE-13` | Hidden | Diagnosis `BUG-02`: Correctly detects unpiped stderr stream leakage | 6% |
| `EXE-02-RULE-14` | Hidden | Diagnosis `BUG-03`: Correctly identifies accidental log file truncation | 6% |

**Total Cumulative Weight:** 100%  
**Pass Threshold:** &ge; 90%
