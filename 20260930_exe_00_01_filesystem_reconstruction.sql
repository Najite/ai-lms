-- Migration & Seeding: EXE-00-01 POSIX Filesystem Navigation & Directory Tree Reconstruction
-- Target Module: MOD-00 Digital Foundations (Phase 1, Week 1)
-- Target Competency: DEV-00 (Developer Environment & Tooling Fluency)

-- 1. Ensure exercise category for Developer Environment exists
INSERT INTO public.exercise_categories (id, slug, name, description, order_index, created_at, updated_at)
VALUES (
  'a0000000-0000-4000-8000-000000000000',
  'developer-environment',
  'Developer Environment & Systems Architecture',
  'Foundational developer environment configuration, POSIX mental models, and local system navigation.',
  0,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();

-- 2. Seed EXE-00-01 in public.exercises
INSERT INTO public.exercises (
  id,
  lesson_id,
  category_id,
  slug,
  title,
  description,
  objective,
  instructions,
  expected_outcome,
  success_criteria,
  difficulty,
  estimated_minutes,
  max_attempts,
  order_index,
  is_published,
  starter_code,
  solution_template,
  validation_rules,
  created_at,
  updated_at
)
VALUES (
  'e0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-4000-8000-000000000000',
  'exe-00-01-posix-filesystem-reconstruction',
  'EXE-00-01: POSIX Filesystem Navigation & Directory Tree Reconstruction',
  'Reconstruct a corrupted cloud server filesystem, resolve absolute and relative path vectors, flag hidden dotfiles, and enforce least-privilege POSIX permissions using an interactive visual workspace.',
  'Master the POSIX directory hierarchy, path addressing algorithms, dotfile isolation, and 3-tier rwx permissions without requiring terminal commands or programming syntax.',
  'Use the interactive Filesystem Reconstruction Workspace to build the directory tree, map path coordinates, flag configuration dotfiles, and set safe permissions for the NovaCloud web server.',
  'A verified, secure filesystem topology scoring >= 90% across visible and hidden test suites, generating DEV-00 competency evidence.',
  'Score >= 90% with 100% green on all security invariants',
  'beginner',
  45,
  NULL,
  1,
  TRUE,
  '{"exercise_code":"EXE-00-01","learner_workspace":"/home/alex","section_1_topology":[],"section_2_absolute_paths":{},"section_3_relative_paths":{},"section_4_permissions_and_dotfiles":{}}',
  '{"exercise_code":"EXE-00-01","learner_workspace":"/home/alex","section_1_topology":[{"path":"/","parent":null,"type":"directory"},{"path":"/bin","parent":"/","type":"directory"},{"path":"/etc","parent":"/","type":"directory"},{"path":"/home","parent":"/","type":"directory"},{"path":"/var","parent":"/","type":"directory"},{"path":"/tmp","parent":"/","type":"directory"},{"path":"/var/log","parent":"/var","type":"directory"},{"path":"/home/alex","parent":"/home","type":"directory"},{"path":"/home/alex/Documents","parent":"/home/alex","type":"directory"},{"path":"/home/alex/projects","parent":"/home/alex","type":"directory"},{"path":"/home/alex/projects/cloud-app","parent":"/home/alex/projects","type":"directory"},{"path":"/home/alex/projects/cloud-app/src","parent":"/home/alex/projects/cloud-app","type":"directory"}],"section_2_absolute_paths":{"nginx_config":"/etc/nginx.conf","application_log":"/var/log/app.log","architecture_notes":"/home/alex/Documents/architecture-notes.md","production_env_secrets":"/home/alex/projects/cloud-app/.env","application_entrypoint":"/home/alex/projects/cloud-app/src/index.js"},"section_3_relative_paths":{"from_cloud_app_to_package_json":"package.json","from_cloud_app_to_index_js":"src/index.js","from_cloud_app_to_architecture_notes":"../../Documents/architecture-notes.md","from_src_to_application_log":"../../../../var/log/app.log","from_home_to_env_secrets":"projects/cloud-app/.env"},"section_4_permissions_and_dotfiles":{"nginx_config":{"is_hidden":false,"owner":{"read":true,"write":true,"execute":false},"group":{"read":true,"write":false,"execute":false},"others":{"read":true,"write":false,"execute":false}},"env_secrets":{"is_hidden":true,"owner":{"read":true,"write":true,"execute":false},"group":{"read":false,"write":false,"execute":false},"others":{"read":false,"write":false,"execute":false}},"application_entrypoint":{"is_hidden":false,"owner":{"read":true,"write":true,"execute":true},"group":{"read":true,"write":false,"execute":true},"others":{"read":true,"write":false,"execute":true}}}}'::text,
  '{"exercise_type":"visual_filesystem_reconstruction","pass_threshold":90,"visible_weight":40,"hidden_weight":60,"competency_code":"DEV-00","target_state":"practicing"}'::jsonb,
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  lesson_id = EXCLUDED.lesson_id,
  category_id = EXCLUDED.category_id,
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  objective = EXCLUDED.objective,
  instructions = EXCLUDED.instructions,
  expected_outcome = EXCLUDED.expected_outcome,
  success_criteria = EXCLUDED.success_criteria,
  starter_code = EXCLUDED.starter_code,
  solution_template = EXCLUDED.solution_template,
  validation_rules = EXCLUDED.validation_rules,
  updated_at = NOW();

-- 3. Map EXE-00-01 to Competency DEV-00
INSERT INTO public.exercise_competencies (
  id,
  exercise_id,
  competency_id,
  weight,
  created_at
)
VALUES (
  'ec000000-0000-0000-0000-000000000001',
  'e0000000-0000-0000-0000-000000000001',
  '93703d9b-b9c0-41f3-8f82-a753eb7bfdbd',
  1.0,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  exercise_id = EXCLUDED.exercise_id,
  competency_id = EXCLUDED.competency_id,
  weight = EXCLUDED.weight;
