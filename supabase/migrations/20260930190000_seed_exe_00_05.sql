-- ==============================================================================
-- Migration: 20260930190000_seed_exe_00_05.sql
-- Description: Seed EXE-00-05 (AI Verification & Evaluation Investigation)
-- ==============================================================================

DO $$
DECLARE
  v_category_id UUID := 'a0000000-0000-4000-8000-000000000000';
  v_lesson_id UUID := 'c0000000-0000-0000-0000-000000000005';
  v_exercise_id UUID := 'e0000000-0000-0000-0000-000000000005';
  v_competency_id UUID := 'a1e00000-0000-0000-0000-000000000000';
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
    'exe-00-05-ai-verification-evaluation-investigation',
    'EXE-00-05: AI Verification & Evaluation Investigation',
    'Investigate AI-generated pull requests, architectural recommendations, and deployment plans in the Visual AI Investigation Workspace. Detect phantom npm packages, fabricated RFC documentation citations, inverted boolean conditions, and multi-candidate comparative rankings without writing code.',
    'Step into the role of an AI Verification Analyst. Inspect 4 diagnostic cases across the AI Response Inspector, Hallucination Detection Panel, Verification Evidence Panel, Context Gap Analyzer, and Evaluation Scoring Matrix. Complete all forensic evaluations and submit solution achieving >= 90% score.',
    'Demonstrate practical engineering rigor when evaluating AI outputs by identifying hallucinations, detecting inverted logic, verifying compiler & registry ground truth, diagnosing context gaps, and objectively scoring candidate responses.',
    'Complete forensic AI verification audit achieving >= 90% score across visible (40%) and hidden (60%) test suites, advancing competency AIE-00 to Verified state.',
    'Accurately flag phantom package @auth/jwt-auto-verify-v2, fabricated RFC citation, inverted rate limiter logic, missing table schema context, and rank Candidate B > Candidate C > Candidate A.',
    'intermediate',
    50,
    '{"exercise_id": "exe-00-05", "task_1_hallucinated_package_name": "", "task_1_verification_evidence_source": "", "task_1_unsupported_performance_claim": "", "task_1_hallucinated_config_parameter": "", "task_2_fake_documentation_citation": "", "task_2_deployment_sequence_defect": "", "task_2_missing_context_element": "", "task_3_logic_defect_type": "", "task_3_confidence_misalignment": "", "task_3_false_api_property": "", "task_4_best_candidate_response_id": "", "task_4_worst_candidate_response_id": "", "task_4_candidate_rankings": [], "task_4_candidate_a_security_defect": ""}',
    '{"exercise_id": "exe-00-05", "task_1_hallucinated_package_name": "@auth/jwt-auto-verify-v2", "task_1_verification_evidence_source": "npm_registry_404_ts_compiler_ts2307", "task_1_unsupported_performance_claim": "zero_overhead_native_caching", "task_1_hallucinated_config_parameter": "cacheTtlSeconds", "task_2_fake_documentation_citation": "rfc_8812_postgres_migration", "task_2_deployment_sequence_defect": "workers_started_before_migration_completed", "task_2_missing_context_element": "table_schema_existing_row_volume", "task_3_logic_defect_type": "inverted_boolean_boundary", "task_3_confidence_misalignment": "authoritative_tone_with_flawed_logic", "task_3_false_api_property": "thread_safe_guarantee_unsupported", "task_4_best_candidate_response_id": "candidate_b", "task_4_worst_candidate_response_id": "candidate_a", "task_4_candidate_rankings": ["candidate_b", "candidate_c", "candidate_a"], "task_4_candidate_a_security_defect": "client_side_authorization_bypassing_rls"}',
    '{"exercise_type": "ai_verification_evaluation", "pass_threshold": 90, "visible_suite_weight": 40, "hidden_suite_weight": 60}'::jsonb,
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

  -- 2. Link Exercise to AIE-00 Competency
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
