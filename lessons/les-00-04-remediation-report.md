# Curriculum Architecture & Pedagogical Blueprint Report
## `LES-00-04`: Git & Version Control from First Principles: Snapshots, Repositories, Branches & DAG Thinking

**Document Version:** 1.0.0  
**Curriculum Module:** `MOD-00: Digital Foundations`  
**Target Competency:** `DEV-00: Developer Environment & Tooling Fluency`  
**Competency Progression:** `Verified → Advanced Practicing`  
**Successor Exercise:** `EXE-00-04: Visual Git Graph Reconstruction & Version Control Diagnostics`  
**Pedagogical Methodology:** Database-Driven Relational Sections & Cognitive-Load-Managed First-Principles Mental Models

---

## 1. Executive Summary & Curriculum Position

`LES-00-04` bridges foundational computing abstractions (POSIX filesystems `LES-00-01`, CLI shell streams `LES-00-02`, and HTTP/browser network diagnostics `LES-00-03`) with professional collaborative software engineering workflows.

### Curriculum Lineage
```
+----------------------------------------------------------------------------------------------------+
|  [ LES-00-01 ] Files, Folders & POSIX Filesystem (Mental Model: Tree Topology & Inodes)           |
|         |                                                                                          |
|         v                                                                                          |
|  [ LES-00-02 ] The Command-Line Interface & Shell Streams (Mental Model: Pipes & File Descriptors)|
|         |                                                                                          |
|         v                                                                                          |
|  [ LES-00-03 ] How the Web Works: HTTP, Networks & DevTools (Mental Model: Wire Protocol & Client/Server)|
|         |                                                                                          |
|         v                                                                                          |
|  [ LES-00-04 ] Git & Version Control from First Principles (Mental Model: Directed Acyclic Graph)  |
|         |                                                                                          |
|         v                                                                                          |
|  [ EXE-00-04 ] Visual Git Graph Reconstruction & Diagnostics (Zero-Code Topological Analysis)      |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Cognitive Load Management & Structural Sequencing

To eliminate the common cognitive overload associated with traditional Git instruction, `LES-00-04` enforces four strict pedagogical constraints:

1. **Mental Model First, Zero CLI Flag Memorization**:
   The lesson intentionally does not teach commands like `rebase`, `cherry-pick`, `bisect`, `stash`, `reflog`, or complex flags. Git is presented as an immutable graph of whole-project snapshots.
2. **Strict Concept Dependency Ordering**:
   $$\text{Repository} \longrightarrow \text{Snapshot} \longrightarrow \text{Commit} \longrightarrow \text{Branch (Pointer)} \longrightarrow \text{Merge} \longrightarrow \text{Remote Synchronization} \longrightarrow \text{DAG Topology}$$
   - *Commit* is mastered before introducing *Branch*.
   - *Branch* is mastered as a lightweight movable bookmark before introducing *Merge*.
   - *Merge* is mastered locally before introducing *Remote Synchronization*.
3. **Everyday Concrete Analogies**:
   - Repository = *The Project Vault / Time Capsule*
   - Working Directory = *The Workbench*
   - Commit = *A High-Resolution Photograph Snapshot with Immutable Cryptographic Ledger Record*
   - Branch = *An Alternate Timeline Movable Bookmark (41 bytes)*
   - HEAD = *The "You Are Here" Pin on the Map*
   - Merge = *Combining Two Parallel Rivers into a Unified Flow*
   - DAG = *A Family Tree of Engineering Decisions (Time Moves Forward, Parent Pointers Point Backward)*

---

## 3. Relational Section Architecture (7 Cards)

The lesson is decomposed into 7 database-driven cards stored in `public.lesson_sections`:

| Card # | Section Slug | Section Type | Title | Est. Min | Core Mental Model Anchor |
| :---: | :--- | :--- | :--- | :---: | :--- |
| **1** | `the-problem-git-solves` | `orientation` | The Problem Git Solves: Beyond File Copy Chaos | 12 | The multi-author collaboration dilemma; why manual backups fail; 4 VCS guarantees. |
| **2** | `repositories-and-snapshots` | `concept_model` | Repositories & Snapshots: The Vault vs. The Workbench | 15 | Working Directory vs `.git` database; Delta diff replay vs Whole-Project Snapshot storage. |
| **3** | `commits-and-history` | `concept_model` | Commits & History: The Immutable Ledger of Decisions | 15 | Commit anatomy (Tree snapshot, metadata, message, parent pointer); backward parent arrows. |
| **4** | `branches-alternate-timelines` | `concept_model` | Branches: Alternate Timelines as Lightweight Bookmarks | 15 | Demystifying branches as 41-byte movable pointers; the `HEAD` pointer mechanics. |
| **5** | `merging-combining-parallel-work` | `protocol_spec` | Merging: Combining Parallel Streams of Work | 15 | Common ancestor base commit; fast-forward merges vs three-way merges with dual-parent commits. |
| **6** | `local-vs-remote-repositories` | `protocol_spec` | Local vs. Remote: Distributed Graph Synchronization | 12 | Centralized vs Distributed VCS; `push` and `pull` as graph node synchronization over the wire. |
| **7** | `git-dag-mental-model-synthesis` | `synthesis` | The Git DAG Mental Model: History as a Graph | 15 | Directed Acyclic Graph topology invariants; 4-step graph inspection checklist. |

---

## 4. Formative Assessment Checkpoints (5 Database Checkpoints)

Stored in `public.lesson_checkpoints` for active recall and formative evaluation:

1. **`d4000000-0000-0000-0000-000000000001` (Section 1)**:
   - *Target Concept*: `VCS_CORE_PURPOSE_VS_MANUAL_BACKUPS`
   - *Inquiry*: Why saving manual file copies (`project_v1.zip`, `project_final_FINAL.zip`) fails compared to a true VCS.
   - *Correct Option*: Index 1 (Lack of atomic snapshots, author attribution, commit rationales, and branching/merging safety).
2. **`d4000000-0000-0000-0000-000000000002` (Section 3)**:
   - *Target Concept*: `GIT_COMMIT_SNAPSHOT_MODEL`
   - *Inquiry*: What a single Git commit represents in storage architecture.
   - *Correct Option*: Index 2 (An immutable photograph snapshot of whole-project state, metadata, and backward parent pointers).
3. **`d4000000-0000-0000-0000-000000000003` (Section 4)**:
   - *Target Concept*: `GIT_BRANCH_POINTER_SEMANTICS`
   - *Inquiry*: What a Git branch actually is under the hood.
   - *Correct Option*: Index 1 (A lightweight movable reference pointer/bookmark storing a 40-character commit hash).
4. **`d4000000-0000-0000-0000-000000000004` (Section 5)**:
   - *Target Concept*: `GIT_MERGE_COMMIT_DUAL_PARENTS`
   - *Inquiry*: What is structurally unique about a three-way merge commit.
   - *Correct Option*: Index 1 (Possesses two parent pointers referencing both divergent branch tips).
5. **`d4000000-0000-0000-0000-000000000005` (Section 7)**:
   - *Target Concept*: `GIT_DAG_TOPOLOGY_INVARIANTS`
   - *Inquiry*: Why Git's history is mathematically a Directed Acyclic Graph.
   - *Correct Option*: Index 0 (Edges point directedly backward to parents; acyclic because time flows in one direction and no commit can be its own ancestor).

---

## 5. Duration & Effort Model

| Learning Phase | Allocated Duration | Pedagogical Focus |
| :--- | :---: | :--- |
| **Reading & Core Conceptual Modeling** | 45 min | Digesting the 7 structured card sections and mental model analogies. |
| **Formative Checkpoint Evaluation** | 15 min | Testing conceptual recall on the 5 database-driven checkpoints. |
| **Diagram Analysis & Reflection** | 15 min | Tracing the 5 Mermaid graph models (snapshot timeline, commit chain, branch movement, merge topology, DAG). |
| **Exercise Pre-Flight Readiness** | 15 min | Rehearsing the 4-step graph reading checklist in preparation for `EXE-00-04`. |
| **Total Learning Effort** | **90 min (1.5h)** | **Comprehensive Foundation Mastery** |

---

## 6. Preparation for `EXE-00-04`

`LES-00-04` establishes the exact visual and topological vocabulary required for `EXE-00-04: Visual Git Graph Reconstruction & Version Control Diagnostics`:
- Identifying the active commit via `HEAD`.
- Identifying branch tip commits and tracking pointer progression.
- Tracing commit ancestry backward to identify the **Common Ancestor** of divergent branches.
- Detecting fast-forward opportunities vs merge commit structures.
- Analyzing commit hash provenance and content addressing.

---

## 7. Database Verification Record

```sql
-- Verification Query 1: Lesson Record
SELECT id, slug, title, order_index, estimated_minutes, is_published
FROM public.lessons
WHERE id = 'c0000000-0000-0000-0000-000000000004';
-- Result: Verified active, order_index = 4, 90 mins, is_published = true.

-- Verification Query 2: Sections Seeding
SELECT section_order, section_type, section_title, estimated_minutes
FROM public.lesson_sections
WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004'
ORDER BY section_order;
-- Result: 7/7 Sections seeded and ordered (Sum = 99 min content breakdown).

-- Verification Query 3: Checkpoints Seeding
SELECT checkpoint_order, target_concept, correct_option_index
FROM public.lesson_checkpoints
WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004'
ORDER BY checkpoint_order;
-- Result: 5/5 Checkpoints seeded with valid JSON options and explanations.
```
