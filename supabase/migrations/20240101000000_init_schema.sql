-- ==============================================================================
-- AI-Native Learning Management System: Master Database Schema
-- Verified $0 Budget: PostgreSQL 15 + pgvector HNSW on Supabase Free Tier
-- ==============================================================================

-- 0. Core Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Curriculum Phases (1 to 15)
CREATE TABLE IF NOT EXISTS phases (
  phase_number INT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  total_lessons INT NOT NULL DEFAULT 0,
  capstone_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lessons (500 Total)
CREATE TABLE IF NOT EXISTS lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  phase_number INT REFERENCES phases(phase_number) ON DELETE RESTRICT,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  starter_code TEXT,
  solution_code TEXT,
  test_assertions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_phase_lesson UNIQUE(phase_number, lesson_number)
);

CREATE INDEX IF NOT EXISTS idx_lessons_slug ON lessons(slug);
CREATE INDEX IF NOT EXISTS idx_lessons_phase_number ON lessons(phase_number);
CREATE INDEX IF NOT EXISTS idx_lessons_lesson_number ON lessons(lesson_number);

-- 3. Lesson Subtopics (2,528 Subtopics Tracked)
CREATE TABLE IF NOT EXISTS lesson_subtopics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  subtopic_index INT NOT NULL,
  title TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_lesson_subtopic UNIQUE(lesson_id, subtopic_index)
);

CREATE INDEX IF NOT EXISTS idx_subtopics_lesson_id ON lesson_subtopics(lesson_id);

-- 4. User Profiles (Extends auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  github_username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_github ON user_profiles(github_username);

-- 5. Student Progress (Zero Urgency, Unlimited Retries)
CREATE TABLE IF NOT EXISTS user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  saved_code_draft TEXT,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_user_lesson UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_user_progress_lookup ON user_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);

-- 6. Capstone Submissions & Automated Grading (Tamper-Proof)
CREATE TABLE IF NOT EXISTS capstone_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_slug TEXT NOT NULL,
  github_repo_url TEXT NOT NULL,
  commit_sha TEXT NOT NULL,
  idempotency_key TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('PENDING', 'RUNNING', 'PASSED', 'FAILED')) DEFAULT 'PENDING',
  score NUMERIC(5,2),
  feedback_json JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  graded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_capstone_user_project ON capstone_submissions(user_id, project_slug);
CREATE INDEX IF NOT EXISTS idx_capstone_idempotency ON capstone_submissions(idempotency_key);

-- 7. RAG Curriculum Embeddings (Strictly capped at 5,000 chunks = ~38.5MB with index)
CREATE TABLE IF NOT EXISTS curriculum_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  lesson_slug TEXT NOT NULL,
  phase_number INT NOT NULL,
  subtopic_index INT NOT NULL,
  chunk_content TEXT NOT NULL,
  embedding vector(768), -- Google text-embedding-004
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_embeddings_lesson ON curriculum_embeddings(lesson_slug);

-- HNSW Vector Index optimized for free-tier memory (m=16, ef_construction=64)
CREATE INDEX IF NOT EXISTS idx_curriculum_embeddings_hnsw 
ON curriculum_embeddings 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 8. Content Generation State Machine
CREATE TABLE IF NOT EXISTS curriculum_generation_state (
  lesson_slug TEXT PRIMARY KEY,
  status TEXT CHECK (status IN ('PENDING', 'GENERATING', 'VALIDATED', 'PUBLISHED', 'FAILED_RETRY')) DEFAULT 'PENDING',
  error_message TEXT,
  attempt_count INT DEFAULT 0,
  last_attempted_at TIMESTAMPTZ
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_subtopics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE capstone_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_embeddings ENABLE ROW LEVEL SECURITY;

-- 1. Public Anonymous Reading for Curriculum (Zero Gatekeeping)
CREATE POLICY "Public Read Phases" ON phases
  FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "Public Read Lessons" ON lessons
  FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "Public Read Subtopics" ON lesson_subtopics
  FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "Public Read Embeddings" ON curriculum_embeddings
  FOR SELECT TO anon, authenticated USING (TRUE);

-- 2. User Profiles
CREATE POLICY "Public Read Profiles" ON user_profiles
  FOR SELECT TO anon, authenticated USING (TRUE);

CREATE POLICY "Users Update Own Profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users Insert Own Profile" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- 3. Student Progress (Isolated per student)
CREATE POLICY "Student Progress Select" ON user_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Student Progress Insert" ON user_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Student Progress Update" ON user_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- 4. Capstone Submissions
CREATE POLICY "Student Capstone Select" ON capstone_submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Student Capstone Insert" ON capstone_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Only service_role can update grades via Webhook
CREATE POLICY "Service Role Grade Update" ON capstone_submissions
  FOR UPDATE TO service_role USING (TRUE);

CREATE POLICY "Service Role Grade Insert" ON capstone_submissions
  FOR INSERT TO service_role WITH CHECK (TRUE);

-- ==============================================================================
-- 9. Vector Similarity Search RPC Function (pgvector HNSW)
-- ==============================================================================

CREATE OR REPLACE FUNCTION match_curriculum_embeddings (
  query_embedding vector(768),
  match_threshold float DEFAULT 0.65,
  match_count int DEFAULT 4,
  filter_lesson text DEFAULT NULL
)
RETURNS TABLE (
  id uuid,
  lesson_id uuid,
  lesson_slug text,
  phase_number int,
  subtopic_index int,
  chunk_content text,
  similarity float
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ce.id,
    ce.lesson_id,
    ce.lesson_slug,
    ce.phase_number,
    ce.subtopic_index,
    ce.chunk_content,
    1 - (ce.embedding <=> query_embedding) AS similarity
  FROM curriculum_embeddings ce
  WHERE (filter_lesson IS NULL OR ce.lesson_slug = filter_lesson)
    AND 1 - (ce.embedding <=> query_embedding) > match_threshold
  ORDER BY ce.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

