-- ==============================================================================
-- Schema Migration: Database-Driven Lesson Sections & Formative Checkpoints
-- Module: MOD-00 Digital Foundations
-- Target: Decomposing monolithic lessons into progressive, queryable card sections
-- ==============================================================================

-- 1. Create lesson_sections table
CREATE TABLE IF NOT EXISTS public.lesson_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  section_order INTEGER NOT NULL,
  section_type TEXT NOT NULL CHECK (section_type IN ('orientation', 'concept_model', 'protocol_spec', 'security_spec', 'tooling_guide', 'synthesis', 'interactive_drill')),
  section_title TEXT NOT NULL,
  section_slug TEXT NOT NULL,
  section_content TEXT NOT NULL,
  section_learning_goal TEXT NOT NULL,
  estimated_minutes INTEGER NOT NULL DEFAULT 10,
  diagram_reference JSONB DEFAULT NULL,
  key_takeaways TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_lesson_section_order UNIQUE(lesson_id, section_order),
  CONSTRAINT uq_lesson_section_slug UNIQUE(lesson_id, section_slug)
);

-- 2. Create lesson_checkpoints table
CREATE TABLE IF NOT EXISTS public.lesson_checkpoints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  section_id UUID REFERENCES public.lesson_sections(id) ON DELETE CASCADE,
  checkpoint_order INTEGER NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_option_index INTEGER NOT NULL CHECK (correct_option_index >= 0),
  explanation TEXT NOT NULL,
  target_concept TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_lesson_checkpoint_order UNIQUE(lesson_id, checkpoint_order)
);

-- 3. Enable Row-Level Security
ALTER TABLE public.lesson_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_checkpoints ENABLE ROW LEVEL SECURITY;

-- 4. RLS Read Policies (Open to all learners and authenticated users)
CREATE POLICY "Allow public read access on lesson_sections"
  ON public.lesson_sections FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access on lesson_checkpoints"
  ON public.lesson_checkpoints FOR SELECT
  USING (true);

-- 5. RLS Write Policies (Restricted to Instructor / Admin roles)
CREATE POLICY "Allow instructor/admin write access on lesson_sections"
  ON public.lesson_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('instructor', 'admin')
    )
  );

CREATE POLICY "Allow instructor/admin write access on lesson_checkpoints"
  ON public.lesson_checkpoints FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role IN ('instructor', 'admin')
    )
  );

-- 6. Indexes for rapid relational traversal
CREATE INDEX IF NOT EXISTS idx_lesson_sections_lesson_id ON public.lesson_sections(lesson_id, section_order);
CREATE INDEX IF NOT EXISTS idx_lesson_checkpoints_lesson_id ON public.lesson_checkpoints(lesson_id, checkpoint_order);
CREATE INDEX IF NOT EXISTS idx_lesson_checkpoints_section_id ON public.lesson_checkpoints(section_id);
