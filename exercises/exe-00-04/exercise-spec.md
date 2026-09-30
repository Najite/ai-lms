# EXE-00-04 Specification: Visual Git Graph Reconstruction & Version Control Diagnostics

**Exercise Code:** `EXE-00-04`  
**Parent Module:** `MOD-00 Digital Foundations`  
**Target Competency:** `DEV-00` (*Developer Environment & Tooling Fluency*)  
**State Progression:** `Advanced Practicing` &rarr; `Mastered`  
**Estimated Time:** 45–60 Minutes  
**Pass Criteria:** $\ge 90\%$ Score (Automated Verification)  

---

## 1. Exercise Overview

In this exercise, you assume the role of a **Lead Version Control Forensic Investigator** diagnosing an unverified timeline integration in the **Helios Core Engine** repository.

Using the built-in **Visual Git Workspace** (an interactive spatial commit graph builder, branch timeline inspector, and 3-way merge analyzer), you will inspect 8 commit snapshot objects, trace parent pointer lineages, locate common ancestors, verify merge parent integrity, and diagnose distributed synchronization status—without typing any terminal commands.

---

## 2. The 8 Captured Commit Objects

```
┌────┬──────────┬──────────────┬──────────────┬────────────────────────────────┬────────────────────────┐
│ ID │ SHA-1    │ Author       │ Parents      │ Commit Message                 │ Snapshot Files         │
├────┼──────────┼──────────────┼──────────────┼────────────────────────────────┼────────────────────────┤
│ C0 │ 3a9f1b04 │ Alice Chen   │ (None)       │ Initial project genesis        │ 8 files (Root Tree)    │
│ C1 │ 8b2e4c19 │ Alice Chen   │ C0           │ Setup database connection pool │ 4 files (Pool adapter) │
│ C2 │ e7d09a55 │ Bob Smith    │ C1           │ Add user authentication schema │ 3 files (Auth schema)  │
│ C3 │ f4c18d82 │ Carol Vance  │ C1           │ Scaffold auth gateway routes   │ 5 files (API routes)   │
│ C4 │ d19a7e30 │ Carol Vance  │ C3           │ Implement JWT token validation │ 2 files (JWT handler)  │
│ C5 │ 5c8b2011 │ Dave Miller  │ C2           │ Database query index hotfix    │ 1 file (Query optimizer│
│ M6 │ 9e4a2f78 │ Alice Chen   │ C5, C4       │ Merge auth-gateway into main   │ 7 files (Integrated)   │
│ C7 │ 7f3b8c44 │ Dave Miller  │ M6           │ Post-merge telemetry probes    │ 2 files (Telemetry)    │
└────┴──────────┴──────────────┴──────────────┴────────────────────────────────┴────────────────────────┘
```

---

## 3. Investigation Station Structure

To complete the exercise, you will record your forensic determinations in the **Investigation Station**:

### Section 1: Genesis & Branch Tip Identification
1. **Root Genesis Commit**: Select the Commit ID that represents the repository genesis root (0 parent pointers).
2. **Active HEAD Bookmark**: Select the branch name currently pointed to by the `HEAD` pin.
3. **Active HEAD Commit**: Select the specific Commit ID where `HEAD` is currently standing.
4. **Feature Branch Tip**: Select the tip commit representing the latest work on `feature/auth-gateway`.

### Section 2: Ancestry & Lineage Tracing
1. **Direct Parent of C2**: Identify the single parent commit hash of `C2`.
2. **Full Ancestry Chain of C4**: Trace the ordered chain of ancestors from `C4` backwards to root (`C4 -> C3 -> C1 -> C0`).
3. **Arrow Direction Invariant**: Confirm the physical direction of commit arrows in a Git commit DAG.

### Section 3: Branch Forking & Common Ancestor Analysis
1. **Common Ancestor of C5 and C4**: Identify the Base Commit (`C1`) where `feature/auth-gateway` and `main` originally split.
2. **Branch Storage Nature**: Identify what a Git branch actually is in storage terms (a 41-byte named text pointer vs a full folder duplicate).

### Section 4: 3-Way Merge Commit Diagnostics
1. **Merge Commit ID**: Identify the specific commit that fused the two divergent lines of history together (`M6`).
2. **Merge Parent 1 (Target Branch)**: Select the commit ID referenced as Parent 1 of `M6` (the branch you were standing on: `main` / `C5`).
3. **Merge Parent 2 (Incoming Branch)**: Select the commit ID referenced as Parent 2 of `M6` (the branch merged in: `feature/auth-gateway` / `C4`).
4. **Merge Structural Invariant**: Identify why merge commits preserve complete history (dual parent pointers).

### Section 5: DAG Topology & Remote Synchronization
1. **Acyclic Property**: Confirm why Git history cannot contain circular commit loops.
2. **Remote Delta Reasoning**: Given that `origin/main` is currently at `C5`, determine which commits (`M6`, `C7`) are local and pending a `git push` synchronization.

---

## 4. Submission Schema Specification

When the learner clicks **Submit Forensic Report**, the UI serializes the answers into the following JSON submission payload:

```json
{
  "exercise_id": "exe-00-04",
  "task_1_root_genesis_commit_id": "C0",
  "task_1_active_head_branch": "main",
  "task_1_active_head_commit_id": "C7",
  "task_1_feature_branch_tip_id": "C4",
  "task_2_direct_parent_of_c2": "C1",
  "task_2_c4_ancestry_chain": ["C4", "C3", "C1", "C0"],
  "task_2_arrow_direction": "backward_to_past",
  "task_3_common_ancestor_base_commit": "C1",
  "task_3_branch_storage_type": "lightweight_pointer",
  "task_4_merge_commit_id": "M6",
  "task_4_merge_parent_1_id": "C5",
  "task_4_merge_parent_2_id": "C4",
  "task_5_dag_acyclic_guarantee": "time_one_way_no_loops",
  "task_5_unpushed_local_commits": ["M6", "C7"]
}
```
