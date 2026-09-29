import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExerciseService } from "@/features/exercises/services/exercise-service";
import {
  useExerciseStore,
  useExerciseAttemptStore,
  useExerciseSubmissionStore,
  useExerciseCompletionStore,
} from "@/features/exercises/stores/use-exercise-store";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

describe("ExerciseService and Zustand Stores", () => {
  let mockSupabase: unknown;
  let service: ExerciseService;

  const mockCategoryRow = {
    id: "cat-1",
    slug: "spec-engineering",
    name: "Specification & Contract Engineering",
    description: "Machine-readable contracts",
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockExerciseRow = {
    id: "ex-1",
    lesson_id: "les-1",
    category_id: "cat-1",
    slug: "zod-schema-contract-validation",
    title: "Enforcing Strict Schema Contracts with Zod",
    description: "Implement executable Zod schema contracts",
    instructions: "1. Define ToolCallPayloadSchema",
    starter_code: "export const ToolCallPayloadSchema = null;",
    solution_template: "export const ToolCallPayloadSchema = z.object({});",
    validation_rules: {
      required_patterns: ["ToolCallPayloadSchema", "z.object"],
      min_length: 30,
    },
    estimated_minutes: 15,
    max_attempts: 3,
    order_index: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    exercise_categories: mockCategoryRow,
    exercise_competencies: [
      {
        weight: 1.5,
        competencies: {
          id: "comp-1",
          code: "SDD-02",
          title: "Schema Contract Enforcement",
          level: "intermediate",
        },
      },
    ],
  };

  const mockAttemptRow = {
    id: "att-1",
    user_id: "usr-1",
    exercise_id: "ex-1",
    attempt_number: 1,
    state: "in_progress" as const,
    started_at: new Date().toISOString(),
    submitted_at: null,
    completed_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const mockSubmissionRow = {
    id: "sub-1",
    attempt_id: "att-1",
    user_id: "usr-1",
    exercise_id: "ex-1",
    submitted_code: 'import { z } from "zod"; export const ToolCallPayloadSchema = z.object({});',
    status: "passed" as const,
    validation_output: {
      passed: true,
      score: 100,
      feedback: [],
      execution_time_ms: 5,
    },
    created_at: new Date().toISOString(),
  };

  const mockCompletionRow = {
    id: "comp-rec-1",
    user_id: "usr-1",
    exercise_id: "ex-1",
    best_attempt_id: "att-1",
    status: "completed",
    score: 100,
    completed_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    useExerciseStore.getState().reset();
    useExerciseAttemptStore.getState().reset();
    useExerciseSubmissionStore.getState().reset();
    useExerciseCompletionStore.getState().reset();

    mockSupabase = {
      from: vi.fn((table: string) => {
        if (table === "exercise_categories") {
          return {
            select: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: [mockCategoryRow], error: null }),
          };
        }
        if (table === "exercises") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: [mockExerciseRow], error: null }),
            single: vi.fn().mockResolvedValue({ data: mockExerciseRow, error: null }),
          };
        }
        if (table === "exercise_attempts") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockAttemptRow, error: null }),
            single: vi.fn().mockResolvedValue({ data: mockAttemptRow, error: null }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockAttemptRow, error: null }),
              }),
            }),
            update: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({
                    data: { ...mockAttemptRow, state: "validated" },
                    error: null,
                  }),
                }),
              }),
            }),
          };
        }
        if (table === "exercise_submissions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockSubmissionRow, error: null }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockSubmissionRow, error: null }),
              }),
            }),
          };
        }
        if (table === "exercise_completion") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockCompletionRow, error: null }),
            upsert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockCompletionRow, error: null }),
              }),
            }),
          };
        }
        if (table === "exercise_evidence" || table === "competency_evidence") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
            upsert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({
                  data: {
                    id: "ev-1",
                    user_id: "usr-1",
                    exercise_id: "ex-1",
                    attempt_id: "att-1",
                    competency_id: "comp-1",
                    summary: "Demonstrated competency in SDD-02",
                    created_at: new Date().toISOString(),
                  },
                  error: null,
                }),
              }),
            }),
            insert: vi.fn().mockResolvedValue({ error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    };

    service = new ExerciseService(mockSupabase as SupabaseClient<Database>);
  });

  describe("getCategories", () => {
    it("returns mapped exercise categories", async () => {
      const res = await service.getCategories();
      expect(res.success).toBe(true);
      expect(res.data).toBeDefined();
      expect(res.data?.length).toBe(1);
      expect(res.data?.[0]?.slug).toBe("spec-engineering");
    });
  });

  describe("getExercises", () => {
    it("returns published exercises with details", async () => {
      const res = await service.getExercises();
      expect(res.success).toBe(true);
      expect(res.data?.length).toBe(1);
      expect(res.data?.[0]?.slug).toBe("zod-schema-contract-validation");
      expect(res.data?.[0]?.category.name).toBe("Specification & Contract Engineering");
      expect(res.data?.[0]?.competencies.length).toBe(1);
      expect(res.data?.[0]?.competencies[0]?.code).toBe("SDD-02");
    });
  });

  describe("submitExercise", () => {
    it("evaluates submitted code and transitions attempt to validated state", async () => {
      const validCode = 'import { z } from "zod"; export const ToolCallPayloadSchema = z.object({});';
      const res = await service.submitExercise("usr-1", "ex-1", "att-1", validCode);

      expect(res.success).toBe(true);
      expect(res.data?.validationOutput.passed).toBe(true);
      expect(res.data?.submission.status).toBe("passed");
      expect(res.data?.attempt.state).toBe("validated");
    });
  });

  describe("Zustand Stores State Management", () => {
    it("ExerciseStore manages exercises and categories", () => {
      const store = useExerciseStore.getState();
      expect(store.exercises).toEqual([]);

      store.setCategories([
        {
          id: "cat-1",
          slug: "spec-engineering",
          name: "Specification",
          description: "Desc",
          orderIndex: 1,
          createdAt: "",
          updatedAt: "",
        },
      ]);
      expect(useExerciseStore.getState().categories.length).toBe(1);

      store.setSelectedCategorySlug("spec-engineering");
      expect(useExerciseStore.getState().selectedCategorySlug).toBe("spec-engineering");
    });

    it("ExerciseSubmissionStore manages code buffer and validation outputs", () => {
      const subStore = useExerciseSubmissionStore.getState();
      expect(subStore.codeBuffer).toBe("");

      subStore.setCodeBuffer("const a = 1;");
      expect(useExerciseSubmissionStore.getState().codeBuffer).toBe("const a = 1;");

      subStore.setIsSubmitting(true);
      expect(useExerciseSubmissionStore.getState().isSubmitting).toBe(true);
    });
  });
});
