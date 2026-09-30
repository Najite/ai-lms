-- ==============================================================================
-- lesson-seed.sql: Master Seed Manifest for LES-00-04
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

-- 2. Clear Existing Child Records
DELETE FROM public.lesson_checkpoints WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004';
DELETE FROM public.lesson_sections WHERE lesson_id = 'c0000000-0000-0000-0000-000000000004';

-- 3. Include Sections
\i lessons/lesson_sections.sql

-- 4. Include Checkpoints
\i lessons/lesson_checkpoints.sql
