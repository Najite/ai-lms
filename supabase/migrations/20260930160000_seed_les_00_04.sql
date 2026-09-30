-- ==============================================================================
-- Migration: 20260930160000_seed_les_00_04.sql
-- Module: MOD-00 Digital Foundations
-- Lesson: LES-00-04 Git & Version Control from First Principles (DAG)
-- Target Competency: DEV-00 (Verified -> Advanced Practicing)
-- ==============================================================================

-- 1. Update/Ensure Lesson Record in public.lessons
INSERT INTO public.lessons (
  id,
  module_id,
  slug,
  title,
  summary,
  content,
  order_index,
  estimated_minutes,
  is_published,
  created_at,
  updated_at
) VALUES (
  'c0000000-0000-0000-0000-000000000004',
  'b2000000-0000-0000-0000-000000000000',
  'les-00-04-git-directed-acyclic-graphs',
  'Git & Version Control from First Principles: Snapshots, Repositories, Branches & DAG Thinking',
  'Master version control mental models from first principles: learn why manual backups fail, how Git stores whole-project snapshots, how branches function as lightweight pointers, how three-way merges combine parallel work, and how commit history forms a Directed Acyclic Graph (DAG).',
  'Comprehensive mental model lesson on Git, version control, whole-project snapshots, commit parentage, lightweight branch bookmarks, three-way merge topologies, distributed remotes, and Directed Acyclic Graphs (DAG).',
  4,
  90,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  summary = EXCLUDED.summary,
  content = EXCLUDED.content,
  estimated_minutes = EXCLUDED.estimated_minutes,
  is_published = EXCLUDED.is_published,
  updated_at = NOW();

-- 2. Clear existing sections and checkpoints for idempotent re-seeding
DELETE FROM public.lesson_checkpoints WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004';
DELETE FROM public.lesson_sections WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004';

-- 3. Seed Section 1: The Problem Git Solves
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
) VALUES (
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
4. **Storage Explosion**: Duplicating zip files wastes gigabytes of disk space and creates confusion over which copy is current.

### Why Backups Are NOT Version Control

A true Version Control System (VCS) provides four non-negotiable guarantees:
- **Atomic Whole-Project Snapshots**: Recording the state of the entire project as a single coherent unit.
- **Cryptographic Provenance**: Attributing every single modification to an author, a timestamp, and a commit rationale.
- **Non-Destructive Branching**: Enabling developers to explore isolated, experimental timelines without folder duplication.
- **Deterministic Merging**: Mathematically reconciling divergent lines of development against their common ancestor.',
  'Understand why manual file copying and backups fail in collaborative software engineering and identify the 4 fundamental guarantees of version control systems.',
  12,
  '{"type": "mermaid", "id": "manual-chaos-diagram"}'::jsonb,
  ARRAY[
    'Manual file copying (e.g. .zip backups) lacks atomic whole-project state, author attribution, and merge capabilities.',
    'Version control systems track project evolution across time with cryptographic integrity and non-destructive experimentation.',
    'Git was engineered to solve the multi-developer distributed coordination problem without relying on manual locks.'
  ],
  NOW(),
  NOW()
);

-- 4. Seed Section 2: Repositories & Snapshots
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
) VALUES (
  'c4000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000004',
  2,
  'concept_model',
  'Repositories & Snapshots: The Project Vault vs. The Workbench',
  'repositories-and-snapshots',
  '### Working Directory vs. The Git Repository

When a folder is initialized as a Git project, it is conceptually divided into two zones:
- **Working Directory (The Workbench)**: The visible files and folders you actively edit, run, and test on your computer.
- **Git Repository (The Vault)**: A hidden database stored inside `.git/` containing the complete chronological history of every snapshot and branch pointer.

### Deltas vs. Whole-Project Snapshots

Older version control systems (like CVS or SVN) tracked history as **deltas** (sequences of line-by-line file diffs). Reconstructing a historical version required sequentially replaying dozens of individual patches.

**Git uses a Snapshot Model**:
Whenever you record a commit, Git captures a **whole-project photograph snapshot** of all files in the repository.
- If a file changed, Git stores the new version in the database.
- If a file did not change, Git simply points to the existing file object already in storage.

This snapshot architecture makes switching between historical states instantaneous because Git only updates file pointers rather than computing diff patches.',
  'Differentiate the working directory from the .git repository database, and explain why Git uses a snapshot model instead of delta diff replay.',
  15,
  '{"type": "mermaid", "id": "snapshot-timeline-diagram"}'::jsonb,
  ARRAY[
    'The working directory is your active workbench; the .git directory is the complete repository database.',
    'Git stores history as whole-project photograph snapshots rather than cumulative delta diffs.',
    'Unchanged files between commits are shared via immutable cryptographic pointers, ensuring maximum speed and storage efficiency.'
  ],
  NOW(),
  NOW()
);

-- 5. Seed Section 3: Commits & History
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
) VALUES (
  'c4000000-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000004',
  3,
  'concept_model',
  'Commits & History: The Immutable Ledger of Decisions',
  'commits-and-history',
  '### Anatomy of a Git Commit Object

A **commit** is the fundamental atomic unit of history in Git. Every commit is an immutable container identified by a unique 40-character cryptographic SHA hash.

A commit contains four elements:
1. **Tree Snapshot**: A cryptographic pointer to the exact root directory and file contents captured by the commit.
2. **Author & Timestamp**: The verified identity of the engineer and the exact time of creation.
3. **Commit Message**: A human-readable statement explaining *why* the change was introduced.
4. **Parent Pointer(s)**: A reference pointing backward to the commit that immediately preceded this state.

### The Arrow of Time: Parent Pointers Point Backward

In a Git history diagram, arrows point **backward in time to ancestors** ($C_2 \to C_1 \to C_0$).
- When $C_0$ was created, $C_1$ did not exist yet.
- When $C_1$ was created, Git recorded $C_0$ as its parent.
- Each commit knows where it came from, forming an unbroken provenance chain from the latest commit back to the project origin.',
  'Analyze the 4 components of a Git commit object and explain why commit parent pointers point backward to ancestors.',
  15,
  '{"type": "mermaid", "id": "commit-chain-diagram"}'::jsonb,
  ARRAY[
    'A commit is an immutable container with a tree snapshot, author metadata, commit message, and parent pointer(s).',
    'Commits are content-addressed by cryptographic hashes (SHA); altering any file or metadata creates a new hash.',
    'Parent pointers point backward in time, creating a verifiable chronological chain of custody.'
  ],
  NOW(),
  NOW()
);

-- 6. Seed Section 4: Branches
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
) VALUES (
  'c4000000-0000-0000-0000-000000000004',
  'c0000000-0000-0000-0000-000000000004',
  4,
  'concept_model',
  'Branches: Alternate Timelines as Lightweight Bookmarks',
  'branches-alternate-timelines',
  '### Demystifying Branches: A Branch is Just a Pointer

Many beginners imagine a "branch" as a massive folder copy. In Git, creating a branch takes 1 millisecond and consumes only **41 bytes** on disk.

> **Definition**: A branch in Git is simply a **lightweight, movable named pointer (a bookmark)** that stores the commit hash of the latest commit on that line of work.

### The Special `HEAD` Pointer: You Are Here

How does Git know which branch and commit you are currently looking at on your workbench?
- Git uses a special pointer called **`HEAD`**.
- When `HEAD` points to `main` (`HEAD -> main`), making a new commit automatically advances the `main` pointer to the new commit.
- If you switch to `feature/auth` (`HEAD -> feature/auth`), your working files change to match that branch. New commits advance `feature/auth`, while `main` stays stationary at its previous commit.',
  'Define what a Git branch is in memory/disk and describe how the HEAD pointer directs active workspace checkout.',
  15,
  '{"type": "mermaid", "id": "branch-pointer-diagram"}'::jsonb,
  ARRAY[
    'A branch is not a duplicate directory; it is a lightweight, 41-byte movable pointer referencing a commit hash.',
    'HEAD is the special pointer that indicates which branch/commit is currently checked out on your workbench.',
    'Committing advances the currently active branch pointer automatically while leaving other branch pointers unchanged.'
  ],
  NOW(),
  NOW()
);

-- 7. Seed Section 5: Merging
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
) VALUES (
  'c4000000-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000005',
  5,
  'protocol_spec',
  'Merging: Combining Parallel Streams of Work',
  'merging-combining-parallel-work',
  '### How Git Merges Divergent Timelines

When work on a feature branch is complete, it is merged back into `main`. Git inspects the commit graph to determine the merge strategy:

1. **Fast-Forward Merge (No Divergence)**:
   If `main` has had zero new commits since the feature branched off, Git simply slides the `main` pointer forward along the existing chain.

2. **Three-Way Merge (Divergent History)**:
   When both branches have added new commits since they split, history has diverged:
   - Git locates the **Common Ancestor (Base Commit)** where the branches parted ways.
   - It compares the Base commit with the tip of `main` and the tip of `feature`.
   - It automatically blends non-conflicting changes and creates a new **Merge Commit**.

### The Anatomy of a Merge Commit

What makes a merge commit unique? **It has two parent pointers!**
- `Parent 1` points to the branch you were standing on (`main`).
- `Parent 2` points to the incoming branch (`feature`).
This dual-parent link preserves the complete historical evolution of both branches in the graph forever.',
  'Distinguish fast-forward merges from three-way merges, and explain the dual-parent structure of a merge commit.',
  15,
  '{"type": "mermaid", "id": "merge-flow-diagram"}'::jsonb,
  ARRAY[
    'A fast-forward merge simply advances the branch pointer when no divergence exists.',
    'A three-way merge compares the common ancestor base commit with both divergent branch tips.',
    'A merge commit has two parent pointers, recording the permanent union of two separate timelines.'
  ],
  NOW(),
  NOW()
);

-- 8. Seed Section 6: Local vs Remote Repositories
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
) VALUES (
  'c4000000-0000-0000-0000-000000000006',
  'c0000000-0000-0000-0000-000000000004',
  6,
  'protocol_spec',
  'Local vs. Remote Repositories: Distributed Graph Synchronization',
  'local-vs-remote-repositories',
  '### Centralized vs. Distributed VCS

In older centralized systems, the repository database lived on a central company server. If your internet dropped, you could not commit or inspect history.

**Git is Fully Distributed**:
When you clone a repository from GitHub or GitLab, you download a **100% complete, standalone copy of the entire repository database** onto your machine. You can branch, commit, merge, and inspect history completely offline.

### What Push and Pull Mean Conceptually

Collaboration in Git is the process of synchronizing two graph databases:
- **`push` (Upload Graph Nodes)**: Sends your new local commit nodes over the network to the remote repository and advances the remote branch pointer.
- **`fetch` / `pull` (Download Graph Nodes)**: Downloads new commit nodes created by teammates from the remote into your local database and merges them into your active branch.',
  'Describe the distributed nature of Git repositories and explain push and pull as commit graph synchronization operations.',
  12,
  '{"type": "mermaid", "id": "distributed-sync-diagram"}'::jsonb,
  ARRAY[
    'Git is fully distributed: every local clone contains the entire repository database and complete history.',
    'Pushing uploads local commit nodes to the remote graph; pulling downloads remote commit nodes to your local graph.',
    'Distributed architecture provides offline autonomy and eliminates single-point-of-failure vulnerabilities.'
  ],
  NOW(),
  NOW()
);

-- 9. Seed Section 7: Git DAG Mental Model & Synthesis
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
) VALUES (
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
4. **Which commits have two parent arrows?** -> Identifies merge commits where parallel timelines converged.

### Mental Model Misconceptions Debunked

- *Misconception*: "Creating a branch copies the entire codebase."
  *Reality*: A branch is a 41-byte text pointer holding a commit hash.
- *Misconception*: "Deleting a branch deletes my files."
  *Reality*: Deleting a branch only removes the named pointer bookmark; the underlying commit objects remain safely in the DAG.
- *Misconception*: "Commits store line-by-line diff patches."
  *Reality*: Commits store whole-project snapshot trees with cryptographic content sharing.',
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

-- 10. Seed Formative Checkpoints (5 Database-Driven Checkpoints)

-- Checkpoint 1 (The Problem Git Solves)
INSERT INTO public.lesson_checkpoints (
  id,
  lesson_id,
  section_id,
  checkpoint_order,
  question,
  options,
  correct_option_index,
  explanation,
  target_concept,
  created_at,
  updated_at
) VALUES (
  'd4000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000001',
  1,
  'Why is saving manual file copies like "project_v1.zip", "project_v2_final.zip", and "project_final_FINAL.zip" fundamentally inadequate compared to a real version control system?',
  '[
    "Zip files take up too much memory for modern CPU caches to unpack.",
    "Manual copies lack atomic whole-project snapshots, author provenance, commit rationales, and the ability to branch and merge parallel work safely.",
    "Operating systems automatically delete files containing the word \"final\".",
    "Git is only needed when working with more than 10,000 files simultaneously."
  ]'::jsonb,
  1,
  'Manual zip backups create chaos because they lack atomic state guarantees, do not attribute who made what change and why, and cannot automatically reconcile parallel edits made by multiple teammates through three-way merging.',
  'VCS_CORE_PURPOSE_VS_MANUAL_BACKUPS',
  NOW(),
  NOW()
);

-- Checkpoint 2 (Commits & Snapshots)
INSERT INTO public.lesson_checkpoints (
  id,
  lesson_id,
  section_id,
  checkpoint_order,
  question,
  options,
  correct_option_index,
  explanation,
  target_concept,
  created_at,
  updated_at
) VALUES (
  'd4000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000003',
  2,
  'In Git''s storage architecture, what does a single commit represent?',
  '[
    "A diff text patch listing only the deleted lines of code.",
    "A compressed copy of the entire operating system kernel.",
    "An immutable photograph snapshot of the entire project state at a specific point in time, coupled with author metadata and parent commit pointer(s).",
    "A temporary cache that is wiped when the terminal is closed."
  ]'::jsonb,
  2,
  'Git stores history as whole-project photograph snapshots rather than delta diffs. Each commit is an immutable, cryptographically identified record containing a tree snapshot, author metadata, timestamp, commit message, and parent pointer(s).',
  'GIT_COMMIT_SNAPSHOT_MODEL',
  NOW(),
  NOW()
);

-- Checkpoint 3 (Branches)
INSERT INTO public.lesson_checkpoints (
  id,
  lesson_id,
  section_id,
  checkpoint_order,
  question,
  options,
  correct_option_index,
  explanation,
  target_concept,
  created_at,
  updated_at
) VALUES (
  'd4000000-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000004',
  3,
  'What is a Git branch under the hood?',
  '[
    "A duplicate folder created on your hard drive containing a fresh copy of all project files.",
    "A lightweight, movable reference pointer (bookmark) that holds the cryptographic hash of a specific commit.",
    "A physical partition on the disk reserved for experimental features.",
    "A special locked file that prevents other team members from editing the code."
  ]'::jsonb,
  1,
  'A Git branch is simply a lightweight, 41-byte movable pointer referencing a 40-character commit hash. Creating or deleting a branch never duplicates or deletes project files; it merely creates or removes the bookmark pointer.',
  'GIT_BRANCH_POINTER_SEMANTICS',
  NOW(),
  NOW()
);

-- Checkpoint 4 (Merging)
INSERT INTO public.lesson_checkpoints (
  id,
  lesson_id,
  section_id,
  checkpoint_order,
  question,
  options,
  correct_option_index,
  explanation,
  target_concept,
  created_at,
  updated_at
) VALUES (
  'd4000000-0000-0000-0000-000000000004',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000005',
  4,
  'When Git performs a three-way merge to combine two divergent branches, what is unique about the resulting merge commit?',
  '[
    "It deletes all previous commits from both branches to save disk space.",
    "It has exactly two (or more) parent commit pointers, tying the two separate historical lines of development back together.",
    "It converts the repository from a snapshot model into a delta diff format.",
    "It changes the cryptographic hash of all past commits in the repository."
  ]'::jsonb,
  1,
  'A merge commit is unique because it possesses two parent pointers: Parent 1 references the active branch (e.g. main) and Parent 2 references the incoming branch (e.g. feature), preserving the complete ancestral history of both development streams.',
  'GIT_MERGE_COMMIT_DUAL_PARENTS',
  NOW(),
  NOW()
);

-- Checkpoint 5 (DAG Mental Model)
INSERT INTO public.lesson_checkpoints (
  id,
  lesson_id,
  section_id,
  checkpoint_order,
  question,
  options,
  correct_option_index,
  explanation,
  target_concept,
  created_at,
  updated_at
) VALUES (
  'd4000000-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000007',
  5,
  'Why is Git''s commit history described mathematically as a Directed Acyclic Graph (DAG)?',
  '[
    "Because commits point directedly to parent ancestors, and it is acyclic because no commit can ever be its own ancestor (no circular loops in history).",
    "Because branches can never split into more than two paths.",
    "Because Git requires an internet connection to calculate graph algorithms on a central server.",
    "Because files are arranged alphabetically in a circle."
  ]'::jsonb,
  0,
  'Git commit history is a Directed Acyclic Graph (DAG) because edges have a clear direction (pointing strictly backward to parent ancestors), and it is acyclic because time moves in one direction, preventing any commit from being its own ancestor.',
  'GIT_DAG_TOPOLOGY_INVARIANTS',
  NOW(),
  NOW()
);
