-- ==============================================================================
-- Database Seed: EXE-00-03 Network Request Investigation & HTTP Diagnostics
-- Module: MOD-00 Digital Foundations
-- Target: public.exercises & public.exercise_competencies
-- ==============================================================================

DO $$
DECLARE
  v_category_id UUID := 'a0000000-0000-4000-8000-000000000000';
  v_exercise_id UUID := 'e0000000-0000-0000-0000-000000000003';
  v_competency_id UUID := '93703d9b-b9c0-41f3-8f82-a753eb7bfdbd';
BEGIN

  INSERT INTO public.exercises (
    id,
    category_id,
    slug,
    title,
    description,
    difficulty,
    estimated_minutes,
    starter_code,
    solution_code,
    validation_rules,
    is_published,
    created_at,
    updated_at
  ) VALUES (
    v_exercise_id,
    v_category_id,
    'exe-00-03-network-request-investigation-http-diagnostics',
    'EXE-00-03: Network Request Investigation & HTTP Diagnostics',
    'Investigate a simulated cloud application incident in Browser DevTools. Inspect live HTTP requests, status codes (200, 301, 401, 403, 404, 500, 504), metadata headers, JSON payloads, DNS mappings, and synthesize the root cause of production failures.',
    'intermediate',
    50,
    '{"exercise_id": "exe-00-03", "task_1_successful_catalog_request_id": "", "task_1_missing_asset_request_id": "", "task_2_redirect_target_url": "", "task_2_insecure_http_request_id": "", "task_3_unauthenticated_request_id": "", "task_3_forbidden_request_id": "", "task_4_backend_crash_request_id": "", "task_4_timeout_bottleneck_request_id": "", "task_5_resolved_api_ip_address": "", "task_5_error_code_payload": "", "task_6_primary_root_cause": ""}',
    '{"exercise_id": "exe-00-03", "task_1_successful_catalog_request_id": "R3", "task_1_missing_asset_request_id": "R4", "task_2_redirect_target_url": "https://octostore.app", "task_2_insecure_http_request_id": "R7", "task_3_unauthenticated_request_id": "R5", "task_3_forbidden_request_id": "R6", "task_4_backend_crash_request_id": "R8", "task_4_timeout_bottleneck_request_id": "R9", "task_5_resolved_api_ip_address": "140.82.121.34", "task_5_error_code_payload": "DB_CONN_TIMEOUT", "task_6_primary_root_cause": "database_connection_crash"}',
    '{"exercise_type": "network_request_diagnostics", "pass_threshold": 90, "visible_suite_weight": 40, "hidden_suite_weight": 60}'::jsonb,
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    starter_code = EXCLUDED.starter_code,
    solution_code = EXCLUDED.solution_code,
    validation_rules = EXCLUDED.validation_rules,
    updated_at = NOW();

  INSERT INTO public.exercise_competencies (
    exercise_id,
    competency_id,
    contribution_weight
  ) VALUES (
    v_exercise_id,
    v_competency_id,
    1.00
  )
  ON CONFLICT (exercise_id, competency_id) DO UPDATE SET
    contribution_weight = EXCLUDED.contribution_weight;

END $$;
