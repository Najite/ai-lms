-- ==============================================================================
-- Migration: 20260930170000_seed_exe_00_04.sql
-- Module: MOD-00 Digital Foundations
-- Exercise: EXE-00-04 Visual Git Graph Reconstruction & Diagnostics
-- ==============================================================================

DO $$
DECLARE
  v_category_id UUID := 'a0000000-0000-4000-8000-000000000000';
  v_lesson_id UUID := 'c0000000-0000-0000-0000-000000000004';
  v_exercise_id UUID := 'e0000000-0000-0000-0000-000000000004';
  v_competency_id UUID := '93703d9b-b9c0-41f3-8f82-a753eb7bfdbd';
BEGIN

  -- 1. Insert or update the exercise record
  INSERT INTO public.exercises (
    id,
    lesson_id,
    category_id,
    slug,
    title,
    description,
    instructions,
    objective,
    expected_outcome,
    success_criteria,
    difficulty,
    estimated_minutes,
    starter_code,
    solution_template,
    validation_rules,
    is_published,
    created_at,
    updated_at
  ) VALUES (
    v_exercise_id,
    v_lesson_id,
    v_category_id,
    'exe-00-04-visual-git-graph-reconstruction-diagnostics',
    'EXE-00-04: Visual Git Graph Reconstruction & Version Control Diagnostics',
    'Investigate a simulated Git repository timeline desynchronization in the Visual Git Workspace. Trace whole-project snapshots, commit parent arrows, lightweight branch bookmarks, 3-way merge dual-parent topology, and Directed Acyclic Graph (DAG) invariants without typing command-line flags.',
    'Use the interactive Visual Git Workspace to inspect the 8 raw commit objects, trace single and dual parent ancestry arrows, determine the Common Ancestor fork point, analyze the 3-way merge commit M6, and verify local vs remote synchronization.',
    'Demonstrate deep spatial and topological understanding of Git commit graphs, snapshot immutability, branch bookmarks, and merge causality without memorizing CLI command incantations.',
    'Complete forensic investigation report achieving >= 90% score across visible and hidden test suites, advancing DEV-00 to Mastered state.',
    'Identify genesis root C0, active HEAD on main at C7, feature tip C4, common ancestor C1, 3-way merge commit M6 (parents C5 and C4), and unpushed local commits [M6, C7].',
    'intermediate',
    50,
    '{"exercise_id": "exe-00-04", "task_1_root_genesis_commit_id": "", "task_1_active_head_branch": "", "task_1_active_head_commit_id": "", "task_1_feature_branch_tip_id": "", "task_2_direct_parent_of_c2": "", "task_2_c4_ancestry_chain": [], "task_2_arrow_direction": "", "task_3_common_ancestor_base_commit": "", "task_3_branch_storage_type": "", "task_4_merge_commit_id": "", "task_4_merge_parent_1_id": "", "task_4_merge_parent_2_id": "", "task_5_dag_acyclic_guarantee": "", "task_5_unpushed_local_commits": []}',
    '{"exercise_id": "exe-00-04", "task_1_root_genesis_commit_id": "C0", "task_1_active_head_branch": "main", "task_1_active_head_commit_id": "C7", "task_1_feature_branch_tip_id": "C4", "task_2_direct_parent_of_c2": "C1", "task_2_c4_ancestry_chain": ["C4", "C3", "C1", "C0"], "task_2_arrow_direction": "backward_to_past", "task_3_common_ancestor_base_commit": "C1", "task_3_branch_storage_type": "lightweight_pointer", "task_4_merge_commit_id": "M6", "task_4_merge_parent_1_id": "C5", "task_4_merge_parent_2_id": "C4", "task_5_dag_acyclic_guarantee": "time_one_way_no_loops", "task_5_unpushed_local_commits": ["M6", "C7"]}',
    '{"exercise_type": "visual_git_graph_reconstruction", "pass_threshold": 90, "visible_suite_weight": 40, "hidden_suite_weight": 60}'::jsonb,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    lesson_id = EXCLUDED.lesson_id,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    instructions = EXCLUDED.instructions,
    objective = EXCLUDED.objective,
    expected_outcome = EXCLUDED.expected_outcome,
    success_criteria = EXCLUDED.success_criteria,
    starter_code = EXCLUDED.starter_code,
    solution_template = EXCLUDED.solution_template,
    validation_rules = EXCLUDED.validation_rules,
    updated_at = NOW();

  -- 2. Link Exercise to DEV-00 Competency
  INSERT INTO public.exercise_competencies (
    exercise_id,
    competency_id,
    weight
  ) VALUES (
    v_exercise_id,
    v_competency_id,
    1.00
  )
  ON CONFLICT (exercise_id, competency_id) DO NOTHING;

END $$;
