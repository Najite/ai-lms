-- ==============================================================================
-- lesson_sections.sql: Streamlined Relational Sections for LES-00-04
-- Target: Pure Mental Models & Visual Graph Thinking (Zero Implementation Trivia)
-- ==============================================================================

DELETE FROM public.lesson_sections WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004';

INSERT INTO public.lesson_sections (
  id,
  lesson_id,
  section_order,
  section_type,
  section_title,
  section_slug,
  section_content,
  section_learning_goal,
  estimated_minutes,
  diagram_reference,
  key_takeaways,
  created_at,
  updated_at
) VALUES 
(
  'c4000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000004',
  1,
  'orientation',
  'The Problem Git Solves: Beyond File Copy Chaos',
  'the-problem-git-solves',
  '### The Anti-Pattern: Manual File Copying Chaos

Imagine collaborating on a group software project without version control. Within days, folders fill up with names like `app.js`, `app_backup.js`, `app_backup_FINAL.js`, and `app_FINAL_v2_real_FINAL.zip`.

This ad-hoc approach quickly breaks down:
1. **Accidental Overwrites**: One teammate saves their work and silently destroys edits made by another teammate.
2. **Loss of Causality & Attribution**: When a bug appears, nobody knows who wrote the change, when it occurred, or why.
3. **Destructive Experimentation**: Trying out a risky feature requires copying the entire project folder, disconnecting work from the team.
4. **Storage Explosion**: Duplicating zip files wastes disk space and creates confusion over which copy is current.

### Why Backups Are NOT Version Control

A true Version Control System (VCS) provides four non-negotiable guarantees:
- **Atomic Whole-Project Snapshots**: Recording the state of the entire project as a single coherent unit.
- **Author Provenance & Intent**: Attributing every modification to an author, timestamp, and explanation message.
- **Non-Destructive Branching**: Exploring experimental ideas in isolated timelines without duplicating folders on disk.
- **Deterministic Merging**: Reconciling parallel lines of development against their common ancestor.',
  'Understand why manual file copying fails in collaborative engineering and identify the 4 core guarantees of version control systems.',
  12,
  '{"type": "mermaid", "id": "manual-chaos-diagram"}'::jsonb,
  ARRAY[
    'Manual file copying lacks atomic state, author provenance, and safe merge capabilities.',
    'Version control systems track project evolution across time with complete historical integrity.',
    'Git solves the multi-developer collaboration challenge without manual file locks.'
  ],
  NOW(),
  NOW()
),
(
  'c4000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000004',
  2,
  'concept_model',
  'Repositories & Snapshots: The Project Vault vs. The Workbench',
  'repositories-and-snapshots',
  '### Working Directory vs. The Git Repository

When a folder is initialized as a Git project, it is divided into two conceptual zones:
- **Working Directory (The Workbench)**: The visible files and folders you actively edit, run, and test on your computer.
- **Git Repository (The Vault)**: A hidden database inside `.git/` containing the complete chronological history of every snapshot and branch pointer.

### Deltas vs. Whole-Project Snapshots

Older version control systems tracked history as **deltas** (sequences of line-by-line file diffs). Reconstructing a past state required sequentially replaying many diff patches.

**Git uses a Snapshot Model**:
Whenever you record a commit, Git takes a **whole-project photograph snapshot** of all files in the repository.
- If a file changed, Git stores the new version in the database.
- If a file did not change, Git simply points to the existing file already in storage.

This snapshot model makes jumping between historical versions instantaneous because Git updates file pointers rather than computing patch diffs.',
  'Differentiate the active working directory from the repository archive, and explain why Git uses a snapshot model instead of delta diff replay.',
  15,
  '{"type": "mermaid", "id": "snapshot-timeline-diagram"}'::jsonb,
  ARRAY[
    'The working directory is your active workbench; the .git directory is the complete repository archive.',
    'Git records history as whole-project photograph snapshots rather than cumulative delta diffs.',
    'Unchanged files are shared efficiently between snapshots without duplicating disk space.'
  ],
  NOW(),
  NOW()
),
(
  'c4000000-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000004',
  3,
  'concept_model',
  'Commits & History: The Immutable Ledger of Decisions',
  'commits-and-history',
  '### Anatomy of a Git Commit

A **commit** is the fundamental atomic unit of history in Git. Every commit is an immutable container identified by a unique fingerprint ID.

A commit contains four elements:
1. **Tree Snapshot**: A pointer to the exact project files captured by the commit.
2. **Author & Timestamp**: Who made the change and exactly when.
3. **Commit Message**: A human statement explaining *why* the change was introduced.
4. **Parent Pointer(s)**: A reference pointing backward to the commit that immediately preceded this state.

### The Arrow of Time: Parent Pointers Point Backward

In a Git history diagram, arrows point **backward in time to ancestors** ($C_2 \to C_1 \to C_0$).
- When $C_0$ was created, $C_1$ did not exist yet.
- When $C_1$ was created, Git recorded $C_0$ as its parent.
- Each commit knows its heritage, forming an unbroken historical chain from the latest commit back to the project genesis.',
  'Analyze the 4 components of a Git commit and explain why commit parent pointers point backward to ancestors.',
  15,
  '{"type": "mermaid", "id": "commit-chain-diagram"}'::jsonb,
  ARRAY[
    'A commit is an immutable record containing a snapshot, author metadata, why message, and parent pointer(s).',
    'Commits are permanently identified by unique fingerprint IDs.',
    'Parent pointers point backward in time, creating a verifiable chronological chain of custody.'
  ],
  NOW(),
  NOW()
),
(
  'c4000000-0000-0000-0000-000000000004',
  'c0000000-0000-0000-0000-000000000004',
  4,
  'concept_model',
  'Branches: Alternate Timelines as Lightweight Bookmarks',
  'branches-alternate-timelines',
  '### Demystifying Branches: A Branch is Just a Pointer

Many beginners imagine a "branch" as a duplicate folder of files. In Git, creating a branch is instant and consumes almost zero memory.

> **Definition**: A branch in Git is simply a **lightweight, movable named pointer (a bookmark)** that holds the unique ID of the latest commit on that line of work.

### The Special `HEAD` Pointer: You Are Here

How does Git know which branch and commit you are currently looking at on your workbench?
- Git uses a special pointer called **`HEAD`**.
- When `HEAD` points to `main` (`HEAD -> main`), making a new commit automatically advances the `main` pointer forward.
- If you switch to `feature/ui` (`HEAD -> feature/ui`), your working files change to match that branch. New commits advance `feature/ui`, while `main` stays stationary at its previous commit.',
  'Define what a Git branch is conceptually and describe how the HEAD pointer directs active workspace checkout.',
  15,
  '{"type": "mermaid", "id": "branch-pointer-diagram"}'::jsonb,
  ARRAY[
    'A branch is not a duplicate directory; it is a lightweight movable pointer (bookmark) referencing a commit.',
    'HEAD is the special pointer that indicates which branch/commit is currently checked out on your workbench.',
    'Committing advances the active branch pointer automatically while leaving other branch pointers unchanged.'
  ],
  NOW(),
  NOW()
),
(
  'c4000000-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000004',
  5,
  'protocol_spec',
  'Merging: Combining Parallel Streams of Work',
  'merging-combining-parallel-work',
  '### How Git Merges Divergent Timelines

When work on a feature branch is ready, it is merged back into `main`. Git inspects the commit graph to determine the merge strategy:

1. **Fast-Forward Merge (No Divergence)**:
   If `main` has had zero new commits since the feature branched off, Git simply slides the `main` pointer forward along the existing chain.

2. **Three-Way Merge (Divergent History)**:
   When both branches have added new commits since they split, history has diverged:
   - Git locates the **Common Ancestor (Base Commit)** where the branches parted ways.
   - It compares the Base commit with the tip of `main` and the tip of `feature`.
   - It blends non-conflicting changes and creates a new **Merge Commit**.

### The Anatomy of a Merge Commit

What makes a merge commit unique? **It has two parent pointers!**
- `Parent 1` points to the branch you were standing on (`main`).
- `Parent 2` points to the incoming branch (`feature`).
This dual-parent link preserves the complete evolutionary history of both branches in the graph forever.',
  'Distinguish fast-forward merges from three-way merges, and explain the dual-parent structure of a merge commit.',
  15,
  '{"type": "mermaid", "id": "merge-flow-diagram"}'::jsonb,
  ARRAY[
    'A fast-forward merge simply advances the branch pointer when no divergence exists.',
    'A three-way merge compares the common ancestor base commit with both divergent branch tips.',
    'A merge commit has two parent pointers, preserving the history of both development streams.'
  ],
  NOW(),
  NOW()
),
(
  'c4000000-0000-0000-0000-000000000006',
  'c0000000-0000-0000-0000-000000000004',
  6,
  'protocol_spec',
  'Local vs. Remote Repositories: Distributed Graph Synchronization',
  'local-vs-remote-repositories',
  '### Centralized vs. Distributed VCS

In older centralized systems, the repository database lived solely on a central server. If your internet dropped, you could not commit or inspect history.

**Git is Fully Distributed**:
When you clone a repository from GitHub or GitLab, you download a **100% complete, standalone copy of the entire repository database** onto your machine. You can branch, commit, merge, and inspect history completely offline.

### What Push and Pull Mean Conceptually

Collaboration in Git is simply synchronizing two graph databases:
- **`push` (Upload Graph Nodes)**: Sends your new local commit nodes over the network to the remote repository and advances the remote branch pointer.
- **`fetch` / `pull` (Download Graph Nodes)**: Downloads new commit nodes created by teammates from the remote into your local database and merges them into your active branch.',
  'Describe the distributed nature of Git repositories and explain push and pull as commit graph synchronization operations.',
  12,
  '{"type": "mermaid", "id": "distributed-sync-diagram"}'::jsonb,
  ARRAY[
    'Git is fully distributed: every local clone contains the entire repository database and complete history.',
    'Pushing uploads local commit nodes to the remote graph; pulling downloads remote commit nodes to your local graph.',
    'Distributed architecture provides offline autonomy and eliminates single-point-of-failure risks.'
  ],
  NOW(),
  NOW()
),
(
  'c4000000-0000-0000-0000-000000000007',
  'c0000000-0000-0000-0000-000000000004',
  7,
  'synthesis',
  'The Git DAG Mental Model: Mastering History as a Graph',
  'git-dag-mental-model-synthesis',
  '### What is a Directed Acyclic Graph (DAG)?

All of Git''s operations operate on a mathematical data structure known as a **Directed Acyclic Graph (DAG)**:
- **Directed**: Edges have a strict direction (commit parent pointers point backward to ancestors).
- **Acyclic**: No loops exist; you can never traverse parent arrows and circle back to the same commit.
- **Graph**: Commits and branches form a multi-dimensional topological network of nodes and edges rather than a single linear list.

### 4-Step Checklist for Reading Any Git Graph

Whenever you inspect a Git history graph, evaluate these 4 questions:
1. **Where is `HEAD`?** -> Shows the active commit and branch currently on your workbench.
2. **Where are the branch pointers?** -> Shows the current tip of each active line of work.
3. **Where did branches fork?** -> Locates the common ancestor base commit.
4. **Which commits have two parent arrows?** -> Identifies merge commits where parallel timelines converged.',
  'Synthesize all Git concepts into the Directed Acyclic Graph (DAG) mental model and apply the 4-step graph reading checklist.',
  15,
  '{"type": "mermaid", "id": "full-dag-diagram"}'::jsonb,
  ARRAY[
    'Git history is a Directed Acyclic Graph (DAG) where nodes are immutable commits and edges are backward parent pointers.',
    'Acyclicity guarantees time flows in one direction with zero circular causality loops.',
    'Mastering the DAG mental model makes all Git operations visual, predictable, and diagnostic-ready.'
  ],
  NOW(),
  NOW()
);
