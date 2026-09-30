# EXE-00-04 Blueprint: Visual Git Graph Reconstruction & Version Control Diagnostics

**Document Version:** 1.0.0  
**Exercise Code:** `EXE-00-04`  
**Parent Module:** `MOD-00 Digital Foundations`  
**Target Competency:** `DEV-00` (*Developer Environment & Tooling Fluency*)  
**Competency State Progression:** `Advanced Practicing` &rarr; `Mastered` (Terminal State for DEV-00)  
**Prerequisites:** `LES-00-04: Git & Version Control from First Principles: Snapshots, Repositories, Branches & DAG Thinking`  
**Successor:** `LES-00-05: AI-Assisted Engineering: Context, Verification & Evals`  
**Estimated Time:** 45–60 minutes (Visual interactive DAG investigation)  
**Pass Threshold:** $\ge 90\%$ (Visible Suite: 40%, Hidden Suite: 60%)  

---

## 1. Executive Summary & Assessment Philosophy

`EXE-00-04` is a zero-code, visual interactive simulation exercise designed to evaluate a learner's deep mental model of version control, immutable commit snapshots, branch pointer mechanics, 3-way merge topology, and Directed Acyclic Graph (DAG) reasoning.

In modern software engineering, developers who rely on memorizing magical command incantations (`git merge`, `git pull`, `git rebase`) frequently cause repository corruption, accidental data overwrites, and catastrophic merge conflict errors. True mastery of version control comes from visualizing the commit graph as an immutable ledger of snapshots linked directedly backward through parent pointers.

Rather than running CLI commands in a terminal, `EXE-00-04` places the learner in the role of a **Lead Version Control Forensic Investigator** diagnosing **Incident #5012: The Helios Core Repository Timeline Desynchronization**. A team of 4 distributed developers has created divergent branches, parallel feature timelines, and an unverified merge commit. The visual commit graph has been fragmented, and the learner must analyze commit snapshots, trace parent ancestry, locate common ancestors, identify branch tips, verify merge dual-parent integrity, and detect potential DAG violations without executing a single terminal command.

---

## 2. Assessment Objectives & Competency Alignment

| Objective ID | Competency Dimension | Observable Assessment Indicator |
| :--- | :--- | :--- |
| **OBJ-01** | `DEV-00.GIT.01` | Identify repository root genesis commit having zero parent pointers (`C0`). |
| **OBJ-02** | `DEV-00.GIT.02` | Distinguish commits as whole-project immutable snapshots vs deltas. |
| **OBJ-03** | `DEV-00.GIT.03` | Trace backwards commit ancestry through single and multiple parent links. |
| **OBJ-04** | `DEV-00.GIT.04` | Identify branch pointers as lightweight named bookmarks and locate the active `HEAD` pointer. |
| **OBJ-05** | `DEV-00.GIT.05` | Locate the Common Ancestor (Base Commit) where two parallel development branches forked. |
| **OBJ-06** | `DEV-00.GIT.06` | Identify 3-way merge commits by validating dual parent pointers (`Parent 1` and `Parent 2`). |
| **OBJ-07** | `DEV-00.GIT.07` | Enforce DAG topology invariants (time flows one-way, zero circular causality loops). |
| **OBJ-08** | `DEV-00.GIT.08` | Reason about distributed synchronization differences between local and remote (`origin`) graphs. |

---

## 3. Incident Scenario: Helios Core Incident #5012

### Context
At 16:45 UTC, during a pre-launch integration freeze for **Helios Core Engine v2.0**, automated CI/CD pipelines halted due to an unverified merge topology. Four engineers (Alice, Bob, Carol, and Dave) submitted commits across divergent lines:
- `main` branch: Production foundation and database schema upgrades.
- `feature/auth-gateway` branch: JWT token validation and cryptographic middleware.
- `hotfix/latency-patch` branch: High-priority caching optimization.
- `origin/main` remote: Central cloud mirror holding historical commits.

As the triage investigator, you are provided with 8 raw commit snapshot objects captured in the repository vault (`.git/objects`).

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 HELIOS REPOSITORY COMMIT VAULT (INCIDENT #5012)                                      │
├────┬──────────┬──────────────┬──────────────┬────────────────────────────────┬────────────────────────┬──────────────┤
│ ID │ SHA-1    │ Author       │ Parents      │ Commit Message                 │ Files Modified         │ Snapshot Ref │
├────┼──────────┼──────────────┼──────────────┼────────────────────────────────┼────────────────────────┼──────────────┤
│ C0 │ 3a9f1b04 │ Alice Chen   │ (None)       │ Initial project genesis        │ 8 files (Root Tree)    │ snap_root_v1 │
│ C1 │ 8b2e4c19 │ Alice Chen   │ C0           │ Setup database connection pool │ 4 files (Pool adapter) │ snap_db_v1   │
│ C2 │ e7d09a55 │ Bob Smith    │ C1           │ Add user authentication schema │ 3 files (Auth schema)  │ snap_auth_v1 │
│ C3 │ f4c18d82 │ Carol Vance  │ C1           │ Scaffold auth gateway routes   │ 5 files (API routes)   │ snap_gate_v1 │
│ C4 │ d19a7e30 │ Carol Vance  │ C3           │ Implement JWT token validation │ 2 files (JWT handler)  │ snap_jwt_v2  │
│ C5 │ 5c8b2011 │ Dave Miller  │ C2           │ Database query index hotfix    │ 1 file (Query optimizer│ snap_idx_v2  │
│ M6 │ 9e4a2f78 │ Alice Chen   │ C5, C4       │ Merge auth-gateway into main   │ 7 files (Integrated)   │ snap_mrg_v1  │
│ C7 │ 7f3b8c44 │ Dave Miller  │ M6           │ Post-merge telemetry probes    │ 2 files (Telemetry)    │ snap_tel_v1  │
└────┴──────────┴──────────────┴──────────────┴────────────────────────────────┴────────────────────────┴──────────────┘
```

---

## 4. Visual Diagnostic Workspace Architecture

The exercise provides 5 integrated diagnostic modules:
1. **Commit Graph Builder & Canvas**: Interactive spatial workspace visualizing commit nodes, directional edges (parent links), branch bookmarks (`main`, `feature/auth-gateway`, `hotfix/latency-patch`), and the `HEAD` map pin.
2. **Branch Timeline Viewer**: Multi-lane linear progression showing branch origins, branch split points, and commit tips.
3. **Merge Investigation Panel**: 3-way comparative matrix comparing `Base Commit` (Common Ancestor), `Target Branch Tip` (Parent 1), and `Incoming Branch Tip` (Parent 2).
4. **DAG Analysis Workspace**: Topology verification suite analyzing path reachability, cycle prevention, and ancestry validation.
5. **Commit Metadata Inspector**: Deep dive inspection drawer displaying author identity, cryptographic commit hashes, timestamps, and tree snapshots.

---

## 5. Assessment Rubric & Scoring Engine

The scoring model evaluates 14 discrete verification checkpoints:

### Visible Suite (40% Total Weight)
- **VIS-01 (6.67%)**: Identify Repository Genesis Root (`C0: 3a9f1b04` with 0 parents).
- **VIS-02 (6.67%)**: Identify Active HEAD Pointer (`HEAD -> main` pointing to `C7`).
- **VIS-03 (6.67%)**: Trace Single-Parent Commit Ancestry (`C4 -> C3 -> C1 -> C0`).
- **VIS-04 (6.67%)**: Identify 3-Way Merge Commit (`M6: 9e4a2f78` with dual parents `C5` and `C4`).
- **VIS-05 (6.67%)**: Determine Branch Fork Origin (`C1` as Common Ancestor for `auth-gateway` and `main`).
- **VIS-06 (6.65%)**: Identify Feature Branch Tip Commit (`C4` as the tip of `feature/auth-gateway`).

### Hidden Suite (60% Total Weight)
- **HID-01 (7.5%)**: Deep Multi-Tier Commit Ancestry Resolution (validating complete backwards chain from `C7` to `C0`).
- **HID-02 (7.5%)**: Common Ancestor Discovery between `C5` and `C4` (`C1: 8b2e4c19`).
- **HID-03 (7.5%)**: DAG Acyclic Invariant Enforcement (verifying no circular edges exist in commit history).
- **HID-04 (7.5%)**: Branch Reference Size & Mutation Mechanics (confirming branches are 41-byte movable pointers).
- **HID-05 (7.5%)**: Merge Parent Allocation (Parent 1 = `C5` on `main`, Parent 2 = `C4` on `feature/auth-gateway`).
- **HID-06 (7.5%)**: Remote vs Local Graph Delta Synchronization (identifying commits pending push to `origin`).
- **HID-07 (7.5%)**: Immutable Snapshot Integrity (confirming snapshot immutability via content hashing).
- **HID-08 (7.5%)**: Full Repository DAG Topology Synthesis (holistic validation of the complete 8-node graph).

---

## 6. Successor Transition: Preparation for LES-00-05

Upon achieving $\ge 90\%$ on `EXE-00-04`, the learner proves comprehensive mastery over foundational developer environments and version control models (`DEV-00: Mastered`).

The learner is fully unlocked and primed for **`LES-00-05: AI-Assisted Engineering: Context, Verification & Evals`**, where they will transition from manual tooling mechanics to driving autonomous AI agent loops, structured prompting, context provisioning, and automated evaluation harnesses.
