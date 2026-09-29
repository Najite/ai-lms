import { describe, it, expect } from "vitest";
import {
  competencyQuerySchema,
  moduleCompetenciesQuerySchema,
  lessonCompetenciesQuerySchema,
  updateCompetencyProgressSchema,
  competencyStateSchema,
  competencyLevelSchema,
} from "@/features/competencies/schemas";

describe("Competency Domain Validation Schemas", () => {
  const validUuid = "123e4567-e89b-12d3-a456-426614174000";
  const validLessonUuid = "223e4567-e89b-12d3-a456-426614174000";

  describe("competencyStateSchema & competencyLevelSchema", () => {
    it("validates valid states and levels", () => {
      expect(competencyStateSchema.safeParse("mastered").success).toBe(true);
      expect(competencyStateSchema.safeParse("practicing").success).toBe(true);
      expect(competencyStateSchema.safeParse("invalid_state").success).toBe(false);

      expect(competencyLevelSchema.safeParse("foundational").success).toBe(true);
      expect(competencyLevelSchema.safeParse("expert").success).toBe(true);
      expect(competencyLevelSchema.safeParse("super_expert").success).toBe(false);
    });
  });

  describe("competencyQuerySchema", () => {
    it("accepts query with slug", () => {
      expect(competencyQuerySchema.safeParse({ slug: "intent-specification" }).success).toBe(true);
    });

    it("accepts query with UUID id", () => {
      expect(competencyQuerySchema.safeParse({ id: validUuid }).success).toBe(true);
    });

    it("rejects when neither slug nor id is provided", () => {
      expect(competencyQuerySchema.safeParse({}).success).toBe(false);
    });
  });

  describe("module & lesson query schemas", () => {
    it("validates moduleCompetenciesQuerySchema with valid UUID", () => {
      expect(moduleCompetenciesQuerySchema.safeParse({ moduleId: validUuid }).success).toBe(true);
      expect(moduleCompetenciesQuerySchema.safeParse({ moduleId: "not-uuid" }).success).toBe(false);
    });

    it("validates lessonCompetenciesQuerySchema with valid UUID", () => {
      expect(lessonCompetenciesQuerySchema.safeParse({ lessonId: validUuid }).success).toBe(true);
    });
  });

  describe("updateCompetencyProgressSchema", () => {
    it("validates valid progress update and evidence payload", () => {
      const valid = {
        competencyId: validUuid,
        sourceType: "lesson_completion",
        sourceId: validLessonUuid,
        sourceTitle: "The AI-Native Paradigm Shift",
        summary: "Completed introductory lesson on intent architecture and invariants.",
        contributionPoints: 25,
        targetState: "introduced",
      };

      const result = updateCompetencyProgressSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects negative or excessive contribution points", () => {
      const invalid = {
        competencyId: validUuid,
        sourceId: validLessonUuid,
        sourceTitle: "Lesson Title",
        summary: "Summary description",
        contributionPoints: -5,
      };

      expect(updateCompetencyProgressSchema.safeParse(invalid).success).toBe(false);
    });

    it("rejects empty source title or summary", () => {
      const invalid = {
        competencyId: validUuid,
        sourceId: validLessonUuid,
        sourceTitle: "",
        summary: "",
      };

      expect(updateCompetencyProgressSchema.safeParse(invalid).success).toBe(false);
    });
  });
});
