import { describe, it, expect, vi, beforeEach } from "vitest";
import { ExercisePolicy } from "@/domains/exercise/policies/exercise-policy";
import { ExerciseQueryService } from "@/domains/exercise/services/exercise-query.service";
import { ExerciseAttemptService } from "@/domains/exercise/services/exercise-attempt.service";
import { ExerciseSubmissionService } from "@/domains/exercise/services/exercise-submission.service";
import { ExerciseCompletionService } from "@/domains/exercise/services/exercise-completion.service";
import { ExerciseEvidenceService } from "@/domains/exercise/services/exercise-evidence.service";
import {
  StartExerciseSchema,
  SubmitExerciseSchema,
  CompleteExerciseSchema,
  ExerciseEvidenceSchema,
  ExerciseQueryFiltersSchema,
} from "@/domains/exercise/validators";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

describe("Exercise Domain DDD Services & Policies", () => {
  describe("ExercisePolicy", () => {
    it("allows learners to read published exercises", () => {
      expect(ExercisePolicy.canReadPublishedExercises(null)).toBe(true);
      expect(ExercisePolicy.canReadPublishedExercises({ id: "u-1", role: "learner" })).toBe(true);
    });

    it("restricts unpublished exercises to admins and instructors", () => {
      expect(ExercisePolicy.canReadUnpublishedExercises(null)).toBe(false);
      expect(ExercisePolicy.canReadUnpublishedExercises({ id: "u-1", role: "learner" })).toBe(false);
      expect(ExercisePolicy.canReadUnpublishedExercises({ id: "u-2", role: "admin" })).toBe(true);
      expect(ExercisePolicy.canReadUnpublishedExercises({ id: "u-3", role: "instructor" })).toBe(true);
    });

    it("allows starting attempt on published exercise", () => {
      const exercise = {
        id: "ex-1",
        lessonId: "les-1",
        categoryId: "cat-1",
        slug: "ex-slug",
        title: "Exercise 1",
        description: "Desc",
        instructions: "Inst",
        starterCode: "",
        solutionTemplate: "",
        validationRules: {},
        estimatedMinutes: 10,
        maxAttempts: 3,
        orderIndex: 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(ExercisePolicy.canStartAttempt({ id: "u-1" }, exercise)).toBe(true);
      expect(ExercisePolicy.canStartAttempt(null, exercise)).toBe(false);
    });

    it("validates submission policy per user ownership", () => {
      const attempt = {
        id: "att-1",
        userId: "u-1",
        exerciseId: "ex-1",
        attemptNumber: 1,
        state: "in_progress" as const,
        startedAt: new Date().toISOString(),
        submittedAt: null,
        completedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      expect(ExercisePolicy.canSubmitWork({ id: "u-1" }, attempt)).toBe(true);
      expect(ExercisePolicy.canSubmitWork({ id: "u-2" }, attempt)).toBe(false);
    });
  });

  describe("Zod Validators (domains/exercise/validators)", () => {
    it("validates StartExerciseSchema correctly", () => {
      const valid = StartExerciseSchema.safeParse({ exerciseId: "11111111-1111-4111-a111-111111111111" });
      expect(valid.success).toBe(true);

      const invalid = StartExerciseSchema.safeParse({ exerciseId: "invalid-id" });
      expect(invalid.success).toBe(false);
    });

    it("validates SubmitExerciseSchema correctly", () => {
      const valid = SubmitExerciseSchema.safeParse({
        exerciseId: "11111111-1111-4111-a111-111111111111",
        attemptId: "22222222-2222-4222-a222-222222222222",
        submittedCode: "const a = 1;",
      });
      expect(valid.success).toBe(true);

      const emptyCode = SubmitExerciseSchema.safeParse({
        exerciseId: "11111111-1111-4111-a111-111111111111",
        attemptId: "22222222-2222-4222-a222-222222222222",
        submittedCode: "",
      });
      expect(emptyCode.success).toBe(false);
    });

    it("validates CompleteExerciseSchema correctly", () => {
      const valid = CompleteExerciseSchema.safeParse({
        exerciseId: "11111111-1111-4111-a111-111111111111",
        attemptId: "22222222-2222-4222-a222-222222222222",
      });
      expect(valid.success).toBe(true);
    });

    it("validates ExerciseEvidenceSchema correctly", () => {
      const valid = ExerciseEvidenceSchema.safeParse({
        exerciseId: "11111111-1111-4111-a111-111111111111",
        attemptId: "22222222-2222-4222-a222-222222222222",
        competencyId: "33333333-3333-4333-a333-333333333333",
        summary: "Demonstrated competency.",
      });
      expect(valid.success).toBe(true);
    });

    it("validates ExerciseQueryFiltersSchema correctly", () => {
      const valid = ExerciseQueryFiltersSchema.safeParse({
        lessonId: "11111111-1111-4111-a111-111111111111",
        isPublished: true,
      });
      expect(valid.success).toBe(true);
    });
  });

  describe("Service Instantiation & Method Contracts", () => {
    let mockSupabase: SupabaseClient<Database>;

    beforeEach(() => {
      mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          upsert: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          neq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      } as unknown as SupabaseClient<Database>;
    });

    it("instantiates ExerciseQueryService, ExerciseAttemptService, ExerciseSubmissionService, ExerciseCompletionService, ExerciseEvidenceService", () => {
      const queryService = new ExerciseQueryService(mockSupabase);
      const attemptService = new ExerciseAttemptService(mockSupabase);
      const submissionService = new ExerciseSubmissionService(mockSupabase);
      const completionService = new ExerciseCompletionService(mockSupabase);
      const evidenceService = new ExerciseEvidenceService(mockSupabase);

      expect(typeof queryService.getById).toBe("function");
      expect(typeof queryService.getByLesson).toBe("function");
      expect(typeof queryService.getByCompetency).toBe("function");

      expect(typeof attemptService.startAttempt).toBe("function");
      expect(typeof attemptService.resumeAttempt).toBe("function");
      expect(typeof attemptService.cancelAttempt).toBe("function");

      expect(typeof submissionService.submit).toBe("function");

      expect(typeof completionService.validateCompletion).toBe("function");
      expect(typeof completionService.completeExercise).toBe("function");

      expect(typeof evidenceService.createEvidence).toBe("function");
      expect(typeof evidenceService.retrieveEvidence).toBe("function");
    });
  });
});
