import { describe, it, expect } from "vitest";
import {
  startExerciseSchema,
  submitExerciseSchema,
  completeExerciseSchema,
  exerciseQuerySchema,
  exerciseIdentifierSchema,
} from "@/features/exercises/schemas";

describe("Exercise Domain Zod Schemas", () => {
  describe("startExerciseSchema", () => {
    it("validates a valid UUID for exerciseId", () => {
      const valid = { exerciseId: "a1111111-1111-4111-8111-111111111111" };
      const parsed = startExerciseSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it("rejects invalid UUID format", () => {
      const invalid = { exerciseId: "non-uuid-string" };
      const parsed = startExerciseSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it("rejects missing exerciseId", () => {
      const invalid = {};
      const parsed = startExerciseSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe("submitExerciseSchema", () => {
    it("validates a valid submission payload", () => {
      const valid = {
        exerciseId: "a1111111-1111-4111-8111-111111111111",
        attemptId: "b2222222-2222-4222-8222-222222222222",
        submittedCode: 'export const hello = "world";',
      };
      const parsed = submitExerciseSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it("rejects empty submittedCode", () => {
      const invalid = {
        exerciseId: "a1111111-1111-4111-8111-111111111111",
        attemptId: "b2222222-2222-4222-8222-222222222222",
        submittedCode: "",
      };
      const parsed = submitExerciseSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });

    it("rejects malformed UUIDs in exerciseId or attemptId", () => {
      const invalid = {
        exerciseId: "bad-id",
        attemptId: "b2222222-2222-4222-8222-222222222222",
        submittedCode: "console.log('test');",
      };
      const parsed = submitExerciseSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe("completeExerciseSchema", () => {
    it("validates valid complete exercise payload", () => {
      const valid = {
        exerciseId: "a1111111-1111-4111-8111-111111111111",
        attemptId: "b2222222-2222-4222-8222-222222222222",
      };
      const parsed = completeExerciseSchema.safeParse(valid);
      expect(parsed.success).toBe(true);
    });

    it("rejects invalid UUIDs", () => {
      const invalid = {
        exerciseId: "a1111111-1111-4111-8111-111111111111",
        attemptId: "not-a-uuid",
      };
      const parsed = completeExerciseSchema.safeParse(invalid);
      expect(parsed.success).toBe(false);
    });
  });

  describe("exerciseQuerySchema", () => {
    it("validates optional parameters", () => {
      expect(exerciseQuerySchema.safeParse({}).success).toBe(true);
      expect(
        exerciseQuerySchema.safeParse({
          lessonId: "a1111111-1111-4111-8111-111111111111",
          slug: "test-exercise",
        }).success
      ).toBe(true);
    });
  });

  describe("exerciseIdentifierSchema", () => {
    it("validates non-empty string identifier", () => {
      expect(exerciseIdentifierSchema.safeParse({ idOrSlug: "zod-validation" }).success).toBe(true);
      expect(exerciseIdentifierSchema.safeParse({ idOrSlug: "" }).success).toBe(false);
    });
  });
});
