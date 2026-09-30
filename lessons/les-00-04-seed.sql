-- ==============================================================================
-- Seed Script: les-00-04-seed.sql
-- Full Seed Package for LES-00-04: Git & Version Control from First Principles (DAG)
-- ==============================================================================

-- 1. Ensure Lesson Master Record
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

-- 2. Clear Existing Sections and Checkpoints
DELETE FROM public.lesson_checkpoints WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004';
DELETE FROM public.lesson_sections WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004';

-- 3. Seed 7 Relational Sections
INSERT INTO public.lesson_sections (id, lesson_id, section_order, section_type, section_title, section_slug, section_content, section_learning_goal, estimated_minutes, diagram_reference, key_takeaways)
VALUES
(
  'c4000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000004',
  1,
  'orientation',
  'The Problem Git Solves: Beyond File Copy Chaos',
  'the-problem-git-solves',
  '### The Anti-Pattern: Manual File Copying Chaos\n\nImagine collaborating on a group software project without version control. Within days, folders fill up with names like `app.js`, `app_backup.js`, `app_backup_FINAL.js`, and `app_FINAL_v2_real_FINAL.zip`.\n\nThis ad-hoc approach quickly breaks down with accidental overwrites, loss of attribution, destructive experimentation, and storage explosion.\n\n### Why Backups Are NOT Version Control\nA true VCS guarantees atomic whole-project snapshots, cryptographic provenance, non-destructive branching, and deterministic merging.',
  'Understand why manual file copying fails and identify the 4 fundamental guarantees of version control systems.',
  12,
  '{"type": "mermaid", "id": "manual-chaos-diagram"}'::jsonb,
  ARRAY['Manual file copying lacks atomic state, author provenance, and merge capabilities.', 'Version control systems provide non-destructive branching and cryptographic history.', 'Git solves the distributed multi-developer coordination problem without file locks.']
),
(
  'c4000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000004',
  2,
  'concept_model',
  'Repositories & Snapshots: The Project Vault vs. The Workbench',
  'repositories-and-snapshots',
  '### Working Directory vs. The Git Repository\n\nThe Working Directory is your tangible workbench where you edit files. The Git Repository (`.git/`) is the complete immutable database storing every historical snapshot and branch pointer.\n\n### Deltas vs. Whole-Project Snapshots\nOlder VCS tools stored cumulative deltas (line diffs). Git captures full photograph snapshots of the entire project state at every commit, sharing unchanged files via cryptographic pointers.',
  'Differentiate the working directory from the .git repository database and explain the snapshot storage model.',
  15,
  '{"type": "mermaid", "id": "snapshot-timeline-diagram"}'::jsonb,
  ARRAY['The working directory is the workbench; .git is the complete repository database.', 'Git stores history as whole-project photograph snapshots rather than delta diffs.', 'Unchanged files are shared via immutable cryptographic pointers.']
),
(
  'c4000000-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000004',
  3,
  'concept_model',
  'Commits & History: The Immutable Ledger of Decisions',
  'commits-and-history',
  '### Anatomy of a Git Commit Object\n\nA commit is an immutable container with a 40-character SHA hash containing: 1) Tree Snapshot, 2) Author & Timestamp, 3) Commit Message, and 4) Parent Pointer(s).\n\n### Parent Pointers Point Backward\nCommit arrows point backward to ancestors (C2 -> C1 -> C0) because each commit references the state from which it originated.',
  'Analyze the 4 components of a commit object and explain why parent pointers point backward to ancestors.',
  15,
  '{"type": "mermaid", "id": "commit-chain-diagram"}'::jsonb,
  ARRAY['A commit contains a tree snapshot, author metadata, commit message, and parent pointer(s).', 'Commits are addressed by cryptographic SHA hashes.', 'Parent pointers point backward in time, creating an unbroken chain of custody.']
),
(
  'c4000000-0000-0000-0000-000000000004',
  'c0000000-0000-0000-0000-000000000004',
  4,
  'concept_model',
  'Branches: Alternate Timelines as Lightweight Bookmarks',
  'branches-alternate-timelines',
  '### Demystifying Branches: Just a Movable Pointer\n\nA branch in Git is NOT a duplicate folder of files. It is simply a lightweight, 41-byte movable pointer (bookmark) storing a 40-character commit hash.\n\n### The HEAD Pointer\nHEAD indicates which branch/commit is currently checked out on your workbench. Committing advances the active branch pointer automatically while other branches remain stationary.',
  'Define what a Git branch is in storage and describe how HEAD directs active checkout.',
  15,
  '{"type": "mermaid", "id": "branch-pointer-diagram"}'::jsonb,
  ARRAY['A branch is a lightweight 41-byte movable pointer referencing a commit hash.', 'HEAD indicates which branch/commit is currently checked out on the workbench.', 'Committing advances the active branch pointer automatically.']
),
(
  'c4000000-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000005',
  5,
  'protocol_spec',
  'Merging: Combining Parallel Streams of Work',
  'merging-combining-parallel-work',
  '### Fast-Forward vs. Three-Way Merge\n\nA fast-forward merge simply advances the branch pointer when no divergence exists. A three-way merge compares the common ancestor base commit with both divergent tips to create a Merge Commit.\n\n### Merge Commits Have Two Parents\nA merge commit is unique because it references two parents (Parent 1 on the current branch, Parent 2 on the incoming branch).',
  'Distinguish fast-forward from three-way merges and explain the dual-parent structure of merge commits.',
  15,
  '{"type": "mermaid", "id": "merge-flow-diagram"}'::jsonb,
  ARRAY['Fast-forward merges advance the pointer without divergence.', 'Three-way merges reconcile divergent branches against their common ancestor.', 'Merge commits have two parent pointers.']
),
(
  'c4000000-0000-0000-0000-000000000006',
  'c0000000-0000-0000-0000-000000000004',
  6,
  'protocol_spec',
  'Local vs. Remote Repositories: Distributed Graph Synchronization',
  'local-vs-remote-repositories',
  '### Distributed Graph Architecture\n\nEvery Git clone is a complete, full repository database. Pushing uploads local commit nodes to the remote graph; pulling downloads remote commit nodes into your local graph.',
  'Explain the distributed nature of Git repositories and define push and pull as graph synchronization operations.',
  12,
  '{"type": "mermaid", "id": "distributed-sync-diagram"}'::jsonb,
  ARRAY['Git is fully distributed: every clone contains the complete repository database.', 'Push uploads local commit nodes; pull downloads remote commit nodes.', 'Distributed architecture provides complete offline autonomy.']
),
(
  'c4000000-0000-0000-0000-000000000007',
  'c0000000-0000-0000-0000-000000000004',
  7,
  'synthesis',
  'The Git DAG Mental Model: Mastering History as a Graph',
  'git-dag-mental-model-synthesis',
  '### The Directed Acyclic Graph (DAG)\n\nGit history is a Directed Acyclic Graph: Directed (edges point backward to parents), Acyclic (no loops; time moves in one direction), Graph (branches and merges form a multi-dimensional network).\n\n### 4-Step Checklist for Reading Any Git Graph\n1. Where is HEAD?\n2. Where are the branch pointers?\n3. Where did branches fork (common ancestor)?\n4. Which commits have two parent arrows (merges)?',
  'Synthesize all Git concepts into the DAG mental model and apply the 4-step graph reading checklist.',
  15,
  '{"type": "mermaid", "id": "full-dag-diagram"}'::jsonb,
  ARRAY['Git history is a Directed Acyclic Graph (DAG) with immutable commits and backward parent edges.', 'Acyclicity prevents circular time-travel loops.', 'Mastering the DAG mental model prepares learners for visual Git graph diagnostics.']
);

-- 4. Seed 5 Formative Checkpoints
INSERT INTO public.lesson_checkpoints (id, lesson_id, section_id, checkpoint_order, question, options, correct_option_index, explanation, target_concept)
VALUES
(
  'd4000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000001',
  1,
  'Why is saving manual file copies like "project_v1.zip", "project_v2_final.zip", and "project_final_FINAL.zip" fundamentally inadequate compared to a real version control system?',
  '["Zip files take up too much memory for modern CPU caches to unpack.", "Manual copies lack atomic whole-project snapshots, author provenance, commit rationales, and the ability to branch and merge parallel work safely.", "Operating systems automatically delete files containing the word \"final\".", "Git is only needed when working with more than 10,000 files simultaneously."]'::jsonb,
  1,
  'Manual zip backups create chaos because they lack atomic state guarantees, do not attribute who made what change and why, and cannot automatically reconcile parallel edits made by multiple teammates through three-way merging.',
  'VCS_CORE_PURPOSE_VS_MANUAL_BACKUPS'
),
(
  'd4000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000003',
  2,
  'In Git''s storage architecture, what does a single commit represent?',
  '["A diff text patch listing only the deleted lines of code.", "A compressed copy of the entire operating system kernel.", "An immutable photograph snapshot of the entire project state at a specific point in time, coupled with author metadata and parent commit pointer(s).", "A temporary cache that is wiped when the terminal is closed."]'::jsonb,
  2,
  'Git stores history as whole-project photograph snapshots rather than delta diffs. Each commit is an immutable, cryptographically identified record containing a tree snapshot, author metadata, timestamp, commit message, and parent pointer(s).',
  'GIT_COMMIT_SNAPSHOT_MODEL'
),
(
  'd4000000-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000004',
  3,
  'What is a Git branch under the hood?',
  '["A duplicate folder created on your hard drive containing a fresh copy of all project files.", "A lightweight, movable reference pointer (bookmark) that holds the cryptographic hash of a specific commit.", "A physical partition on the disk reserved for experimental features.", "A special locked file that prevents other team members from editing the code."]'::jsonb,
  1,
  'A Git branch is simply a lightweight, 41-byte movable pointer referencing a 40-character commit hash. Creating or deleting a branch never duplicates or deletes project files; it merely creates or removes the bookmark pointer.',
  'GIT_BRANCH_POINTER_SEMANTICS'
),
(
  'd4000000-0000-0000-0000-000000000004',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000005',
  4,
  'When Git performs a three-way merge to combine two divergent branches, what is unique about the resulting merge commit?',
  '["It deletes all previous commits from both branches to save disk space.", "It has exactly two (or more) parent commit pointers, tying the two separate historical lines of development back together.", "It converts the repository from a snapshot model into a delta diff format.", "It changes the cryptographic hash of all past commits in the repository."]'::jsonb,
  1,
  'A merge commit is unique because it possesses two parent pointers: Parent 1 references the active branch (e.g. main) and Parent 2 references the incoming branch (e.g. feature), preserving the complete ancestral history of both development streams.',
  'GIT_MERGE_COMMIT_DUAL_PARENTS'
),
(
  'd4000000-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000007',
  5,
  'Why is Git''s commit history described mathematically as a Directed Acyclic Graph (DAG)?',
  '["Because commits point directedly to parent ancestors, and it is acyclic because no commit can ever be its own ancestor (no circular loops in history).", "Because branches can never split into more than two paths.", "Because Git requires an internet connection to calculate graph algorithms on a central server.", "Because files are arranged alphabetically in a circle."]'::jsonb,
  0,
  'Git commit history is a Directed Acyclic Graph (DAG) because edges have a clear direction (pointing strictly backward to parent ancestors), and it is acyclic because time moves in one direction, preventing any commit from being its own ancestor.',
  'GIT_DAG_TOPOLOGY_INVARIANTS'
);
