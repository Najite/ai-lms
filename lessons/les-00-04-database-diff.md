# LES-00-04 Section-by-Section Database Diff & Audit Comparison

**Document Purpose:** Records the exact before-and-after database content diff for `LES-00-04` (`c0000000-0000-0000-0000-000000000004`).

---

## 1. `public.lesson_sections` Comparison Diff

### Card 1: `the-problem-git-solves`
```diff
  Section Title: The Problem Git Solves: Beyond File Copy Chaos
  Section Type: orientation
  Estimated Minutes: 12
  
  Content Focus:
- Why Backups Are NOT Version Control: 1) Atomic Whole-Project Snapshots, 2) Cryptographic Provenance, 3) Non-Destructive Branching, 4) Deterministic Merging.
+ Why Backups Are NOT Version Control: 1) Atomic Whole-Project Snapshots, 2) Author Provenance & Intent, 3) Non-Destructive Branching, 4) Deterministic Merging.
```

### Card 2: `repositories-and-snapshots`
```diff
  Section Title: Repositories & Snapshots: The Project Vault vs. The Workbench
  Section Type: concept_model
  Estimated Minutes: 15
  
  Content Focus:
- Git captures full photograph snapshots of the entire project state at every commit, sharing unchanged files via cryptographic pointers.
+ Git captures full photograph snapshots of the entire project state at every commit, sharing unchanged files seamlessly without duplicate disk usage.
  (De-emphasized low-level content-addressable storage mechanisms; elevated the photograph snapshot mental model).
```

### Card 3: `commits-and-history`
```diff
  Section Title: Commits & History: The Immutable Ledger of Decisions
  Section Type: concept_model
  Estimated Minutes: 15
  
  Content Focus:
- A commit is an immutable container with a 40-character SHA hash containing: 1) Tree Snapshot, 2) Author & Timestamp, 3) Commit Message, 4) Parent Pointer(s).
+ A commit is an immutable container identified by a unique fingerprint ID containing: 1) Tree Snapshot, 2) Author & Timestamp, 3) Commit Message, 4) Parent Pointer(s).
  (Shifted focus from SHA cryptographic hashing algorithms to the 4 essential structural components).
```

### Card 4: `branches-alternate-timelines`
```diff
  Section Title: Branches: Alternate Timelines as Lightweight Bookmarks
  Section Type: concept_model
  Estimated Minutes: 15
  
  Content Focus:
- A branch in Git is NOT a duplicate folder of files. It is simply a lightweight, 41-byte movable pointer (bookmark) storing a 40-character commit hash.
+ A branch in Git is NOT a duplicate folder of files. It is simply a lightweight, movable named pointer (bookmark) that holds the unique ID of the latest commit on that line of work.
  (Eliminated distracting 41-byte memory size trivia; reinforced the movable bookmark metaphor).
```

### Card 5: `merging-combining-parallel-work`
```diff
  Section Title: Merging: Combining Parallel Streams of Work
  Section Type: protocol_spec
  Estimated Minutes: 15
  
  Content Focus:
  - Fast-forward merge (pointer slide along linear path).
  - Three-way merge (common ancestor base commit comparison).
  - Merge commit anatomy: 2 parent pointers connecting separate history streams.
```

### Card 6: `local-vs-remote-repositories`
```diff
  Section Title: Local vs. Remote Repositories: Distributed Graph Synchronization
  Section Type: protocol_spec
  Estimated Minutes: 12
  
  Content Focus:
  - Distributed architecture (every clone is a complete repository database).
  - Push = Upload local commit nodes; Pull = Download remote commit nodes.
  - Complete offline autonomy.
```

### Card 7: `git-dag-mental-model-synthesis`
```diff
  Section Title: The Git DAG Mental Model: Mastering History as a Graph
  Section Type: synthesis
  Estimated Minutes: 15
  
  Content Focus:
  - Directed Acyclic Graph (Directed = backward parent arrows, Acyclic = no circular time loops, Graph = branching/merging network).
  - 4-Step Checklist for Reading Any Git Graph (HEAD, Branch Tips, Fork Points, Dual-Parent Merges).
```

---

## 2. `public.lesson_checkpoints` Comparison Diff

| Checkpoint # | Before (Recall Focus) | After (Deep Conceptual Understanding) | Target Concept |
| :---: | :--- | :--- | :--- |
| **1** | Generic disk space distractor | Distractors testing multi-developer concurrent modification and lack of atomic provenance | `VCS_CORE_PURPOSE_VS_MANUAL_BACKUPS` |
| **2** | Diff text patch vs OS kernel | Snapshot photograph vs transient terminal cache | `GIT_COMMIT_SNAPSHOT_MODEL` |
| **3** | Duplicate folder vs partition | Lightweight movable bookmark vs physical folder copy | `GIT_BRANCH_POINTER_SEMANTICS` |
| **4** | Deleting commits vs password check | Dual-parent ancestry binding vs history erasure | `GIT_MERGE_COMMIT_DUAL_PARENTS` |
| **5** | Circular sorting vs straight line | Backward parent arrows & one-way time flow vs server equations | `GIT_DAG_TOPOLOGY_INVARIANTS` |
