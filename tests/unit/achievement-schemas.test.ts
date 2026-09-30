import { describe, it, expect } from "vitest";
import {
  AwardXPSchema,
  CreateXPTransactionSchema,
  UpdateAchievementProgressSchema,
  AwardAchievementSchema,
  CreateAchievementEvidenceSchema,
  AchievementQueryFiltersSchema,
} from "@/domains/achievement/validators";

describe("Achievement & XP Zod Validators", () => {
  describe("AwardXPSchema", () => {
    it("accepts valid XP award payload for lesson completion", () => {
      const valid = AwardXPSchema.safeParse({
        userId: "11111111-1111-4111-a111-111111111111",
        sourceType: "lesson_completion",
        sourceId: "les-01",
        amount: 50,
      });
      expect(valid.success).toBe(true);
    });

    it("accepts all 4 supported XP source types", () => {
      const sources = [
        "lesson_completion",
        "exercise_completion",
        "competency_progression",
        "achievement",
      ];
      sources.forEach((src) => {
        const res = AwardXPSchema.safeParse({
          userId: "11111111-1111-4111-a111-111111111111",
          sourceType: src,
          sourceId: "id-123",
        });
        expect(res.success).toBe(true);
      });
    });

    it("rejects invalid source type and negative amounts", () => {
      const invalidSource = AwardXPSchema.safeParse({
        userId: "11111111-1111-4111-a111-111111111111",
        sourceType: "invalid_source",
        sourceId: "id-1",
      });
      expect(invalidSource.success).toBe(false);

      const negativeAmount = AwardXPSchema.safeParse({
        userId: "11111111-1111-4111-a111-111111111111",
        sourceType: "lesson_completion",
        sourceId: "id-1",
        amount: -20,
      });
      expect(negativeAmount.success).toBe(false);
    });
  });

  describe("CreateXPTransactionSchema", () => {
    it("validates transaction creation payload", () => {
      const valid = CreateXPTransactionSchema.safeParse({
        userId: "11111111-1111-4111-a111-111111111111",
        sourceType: "exercise_completion",
        sourceId: "ex-01",
        amount: 75,
      });
      expect(valid.success).toBe(true);
    });
  });

  describe("UpdateAchievementProgressSchema", () => {
    it("validates achievement progress update", () => {
      const valid = UpdateAchievementProgressSchema.safeParse({
        userId: "11111111-1111-4111-a111-111111111111",
        achievementId: "22222222-2222-4222-a222-222222222222",
        progressValue: 3,
      });
      expect(valid.success).toBe(true);
    });

    it("rejects negative progress values", () => {
      const invalid = UpdateAchievementProgressSchema.safeParse({
        userId: "11111111-1111-4111-a111-111111111111",
        achievementId: "22222222-2222-4222-a222-222222222222",
        progressValue: -1,
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("AwardAchievementSchema & CreateAchievementEvidenceSchema", () => {
    it("validates award and evidence payload", () => {
      const award = AwardAchievementSchema.safeParse({
        userId: "11111111-1111-4111-a111-111111111111",
        achievementId: "22222222-2222-4222-a222-222222222222",
        evidenceReference: "Lesson completion trigger",
      });
      expect(award.success).toBe(true);

      const evidence = CreateAchievementEvidenceSchema.safeParse({
        userId: "11111111-1111-4111-a111-111111111111",
        achievementId: "22222222-2222-4222-a222-222222222222",
        evidenceType: "exercise_completion",
        evidenceReference: "ex-01",
      });
      expect(evidence.success).toBe(true);
    });
  });

  describe("AchievementQueryFiltersSchema", () => {
    it("validates query filters", () => {
      const valid = AchievementQueryFiltersSchema.safeParse({
        categoryId: "11111111-1111-4111-a111-111111111111",
        isActive: true,
      });
      expect(valid.success).toBe(true);
    });
  });
});
