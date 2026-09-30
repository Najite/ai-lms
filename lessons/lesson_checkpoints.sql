-- ==============================================================================
-- lesson_checkpoints.sql: Upgraded Formative Checkpoints for LES-00-04
-- Target: Testing Deep Conceptual Understanding (Zero Rote Memorization)
-- ==============================================================================

DELETE FROM public.lesson_checkpoints WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004';

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
) VALUES 
(
  'd4000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000001',
  1,
  'Why is saving manual backup files like "project_v1.zip" and "project_final_v2.zip" fundamentally inadequate for engineering teams compared to a true Version Control System?',
  '[
    "Zip compression files cannot be extracted on standard developer operating systems.",
    "Manual file copies cannot record who made each change, why it was made, or safely merge parallel work created by multiple developers simultaneously.",
    "Operating systems automatically lock folders containing multiple file versions.",
    "Version control is only required when a software project exceeds 10,000 files."
  ]'::jsonb,
  1,
  'Manual zip backups create chaos because they lack atomic whole-project state, author attribution, and commit rationales, making it impossible to safely combine parallel work from multiple teammates without destructive overwrites.',
  'VCS_CORE_PURPOSE_VS_MANUAL_BACKUPS',
  NOW(),
  NOW()
),
(
  'd4000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000003',
  2,
  'In Git''s mental model, what does a single commit represent?',
  '[
    "A temporary text file listing only the deleted lines of code.",
    "A full duplicate copy of your entire hard drive and operating system.",
    "An immutable photograph snapshot of the entire project state at a specific moment in time, linked with author metadata and parent commit pointer(s).",
    "A temporary cache that is automatically cleared whenever the computer reboots."
  ]'::jsonb,
  2,
  'A Git commit is an immutable whole-project snapshot. It captures the exact state of all project files at a specific moment in time, bundled with author attribution, an explanation message, and a parent pointer referencing the preceding commit.',
  'GIT_COMMIT_SNAPSHOT_MODEL',
  NOW(),
  NOW()
),
(
  'd4000000-0000-0000-0000-000000000003',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000004',
  3,
  'What actually happens when you create a new branch in Git?',
  '[
    "Git duplicates all project files into a new physical folder on your disk.",
    "Git creates a lightweight, movable named bookmark (pointer) that references the current commit.",
    "Git locks the repository to prevent anyone else from viewing the project history.",
    "Git deletes the previous commits on the main timeline to make room for new work."
  ]'::jsonb,
  1,
  'A branch in Git is simply a lightweight, movable pointer (bookmark) that references a specific commit. Creating a branch is instantaneous because Git never duplicates project files on disk.',
  'GIT_BRANCH_POINTER_SEMANTICS',
  NOW(),
  NOW()
),
(
  'd4000000-0000-0000-0000-000000000004',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000005',
  4,
  'When Git completes a three-way merge to combine two divergent branches, what is structurally unique about the resulting merge commit?',
  '[
    "It permanently erases the commit history of the incoming branch.",
    "It has two (or more) parent commit pointers, preserving the full ancestral heritage of both development lines.",
    "It converts all repository files into read-only permissions.",
    "It requires both developers to submit their passwords to verify the merge."
  ]'::jsonb,
  1,
  'A merge commit is unique because it has two parent pointers: Parent 1 references the branch you were on (e.g. main) and Parent 2 references the incoming branch (e.g. feature), uniting both historical streams into one unified DAG.',
  'GIT_MERGE_COMMIT_DUAL_PARENTS',
  NOW(),
  NOW()
),
(
  'd4000000-0000-0000-0000-000000000005',
  'c0000000-0000-0000-0000-000000000004',
  'c4000000-0000-0000-0000-000000000007',
  5,
  'Why is Git''s commit history described as a Directed Acyclic Graph (DAG)?',
  '[
    "Because commit arrows point directedly backward to parent ancestors, and it is acyclic because time flows in one direction with zero circular time-travel loops.",
    "Because all commits must be arranged in a straight vertical line without branching.",
    "Because Git requires an active internet connection to calculate server graph equations.",
    "Because project files are sorted alphabetically in a circular loop."
  ]'::jsonb,
  0,
  'Git commit history is a Directed Acyclic Graph (DAG) because edges point directedly backward to parents, and it is acyclic because no commit can ever be its own ancestor, guaranteeing that history never forms circular loops.',
  'GIT_DAG_TOPOLOGY_INVARIANTS',
  NOW(),
  NOW()
);
