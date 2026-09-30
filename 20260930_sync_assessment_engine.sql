-- ============================================================================
-- AI-Native Software Engineering LMS - Assessment Engine Harmonization Migration
-- File: 20260930_sync_assessment_engine.sql
-- Date: 2026-09-30
-- Authority: Principal Assessment Systems Architect & Head of Platform Engineering
-- Classification: Core Infrastructure Migration
-- ============================================================================

BEGIN;

-- 1. Extend competency_evidence_source enum to support all canonical assessment sources
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'competency_evidence_source' AND pg_enum.enumlabel = 'gate_validation'
    ) THEN
        ALTER TYPE public.competency_evidence_source ADD VALUE 'gate_validation';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'competency_evidence_source' AND pg_enum.enumlabel = 'capstone_submission'
    ) THEN
        ALTER TYPE public.competency_evidence_source ADD VALUE 'capstone_submission';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
        WHERE pg_type.typname = 'competency_evidence_source' AND pg_enum.enumlabel = 'oral_defense'
    ) THEN
        ALTER TYPE public.competency_evidence_source ADD VALUE 'oral_defense';
    END IF;
END $$;

-- 2. Create public.assessment_runs table for immutable cryptographic execution telemetry
CREATE TABLE IF NOT EXISTS public.assessment_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL CHECK (status IN ('PASSED', 'FAILED', 'TIMEOUT', 'SECURITY_VIOLATION', 'SYSTEM_ERROR')),
    raw_score NUMERIC(5,2) NOT NULL CHECK (raw_score >= 0 AND raw_score <= 100),
    final_score NUMERIC(5,2) NOT NULL CHECK (final_score >= 0 AND final_score <= 100),
    execution_duration_ms INTEGER NOT NULL CHECK (execution_duration_ms >= 0),
    memory_usage_bytes BIGINT NOT NULL CHECK (memory_usage_bytes >= 0),
    anti_cheat_score NUMERIC(5,2) NOT NULL CHECK (anti_cheat_score >= 0 AND anti_cheat_score <= 100),
    signature VARCHAR(64) NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Enable Row-Level Security on assessment_runs
ALTER TABLE public.assessment_runs ENABLE ROW LEVEL SECURITY;

-- 4. Create granular RLS Policies for assessment_runs
DROP POLICY IF EXISTS "Users can view their own assessment runs" ON public.assessment_runs;
CREATE POLICY "Users can view their own assessment runs"
    ON public.assessment_runs FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own assessment runs" ON public.assessment_runs;
CREATE POLICY "Users can insert their own assessment runs"
    ON public.assessment_runs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Service role full access on assessment runs" ON public.assessment_runs;
CREATE POLICY "Service role full access on assessment runs"
    ON public.assessment_runs FOR ALL
    USING ((auth.jwt() ->> 'role') = 'service_role');

-- 5. Create Performance and Audit Indexes on assessment_runs
CREATE INDEX IF NOT EXISTS idx_assessment_runs_user_exercise 
    ON public.assessment_runs(user_id, exercise_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_runs_status 
    ON public.assessment_runs(status);

CREATE INDEX IF NOT EXISTS idx_assessment_runs_created_at 
    ON public.assessment_runs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_runs_signature
    ON public.assessment_runs(signature);

-- 6. Update default schema for exercises.validation_rules column to canonical Vitest runner specification
ALTER TABLE public.exercises 
    ALTER COLUMN validation_rules 
    SET DEFAULT '{
      "test_runner": "vitest",
      "timeout_ms": 2500,
      "visible_tests_fixture": "",
      "hidden_tests_fixture": "",
      "assertion_weights": {
        "visible": 0.40,
        "hidden": 0.60
      },
      "anti_cheat": {
        "ast_lint": true,
        "mutation_fuzzing": true
      }
    }'::jsonb;

-- 7. Add validation comments for schema documentation
COMMENT ON TABLE public.assessment_runs IS 'Immutable telemetry and cryptographic audit log for sandboxed code assessments.';
COMMENT ON COLUMN public.assessment_runs.raw_score IS 'Pre-penalty weighted score computed from visible (40%) and hidden (60%) test assertions.';
COMMENT ON COLUMN public.assessment_runs.final_score IS 'Post-penalty score after applying timeout, linting, and retry decay deductions.';
COMMENT ON COLUMN public.assessment_runs.anti_cheat_score IS 'Anti-cheating confidence score (0-100%) from mutation fuzzing, AST fingerprinting, and velocity heuristics.';
COMMENT ON COLUMN public.assessment_runs.signature IS 'HMAC-SHA256 digest sealing execution parameters and preventing telemetry tampering.';

COMMIT;
