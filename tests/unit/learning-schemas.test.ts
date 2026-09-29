import { describe, it, expect } from "vitest";
import {
  slugSchema,
  uuidSchema,
  startLessonSchema,
  completeLessonSchema,
  learningPathQuerySchema,
  moduleQuerySchema,
  lessonQuerySchema,
} from "@/features/learning/schemas";

describe("Learning Domain Schemas", () => {
  describe("slugSchema", () => {
    it("accepts valid lowercase alphanumeric slugs with hyphens", () => {
      expect(slugSchema.safeParse("foundations-of-ai-native-engineering").success).toBe(true);
      expect(slugSchema.safeParse("lesson-1").success).toBe(true);
      expect(slugSchema.safeParse("core").success).toBe(true);
      expect(slugSchema.safeParse("ai-native-101").success).toBe(true);
    });

    it("rejects uppercase letters, spaces, and special symbols", () => {
      expect(slugSchema.safeParse("Invalid Slug").success).toBe(false);
      expect(slugSchema.safeParse("Foundations").success).toBe(false);
      expect(slugSchema.safeParse("slug_with_underscores").success).toBe(false);
      expect(slugSchema.safeParse("slug-with-!").success).toBe(false);
      expect(slugSchema.safeParse("").success).toBe(false);
    });
  });

  describe("uuidSchema", () => {
    it("accepts valid UUIDs", () => {
      expect(uuidSchema.safeParse("123e4567-e89b-12d3-a456-426614174000").success).toBe(true);
    });

    it("rejects non-UUID strings", () => {
      expect(uuidSchema.safeParse("not-a-uuid").success).toBe(false);
      expect(uuidSchema.safeParse("12345").success).toBe(false);
    });
  });

  describe("action & query schemas", () => {
    it("validates startLessonSchema with valid slugs", () => {
      const valid = {
        pathSlug: "ai-native-engineering",
        moduleSlug: "foundations",
        lessonSlug: "paradigm-shift",
      };
      expect(startLessonSchema.safeParse(valid).success).toBe(true);
    });

    it("rejects startLessonSchema when missing a slug", () => {
      const invalid = {
        pathSlug: "ai-native-engineering",
        moduleSlug: "foundations",
      };
      expect(startLessonSchema.safeParse(invalid).success).toBe(false);
    });

    it("validates completeLessonSchema with valid slugs", () => {
      const valid = {
        pathSlug: "ai-native-engineering",
        moduleSlug: "foundations",
        lessonSlug: "paradigm-shift",
      };
      expect(completeLessonSchema.safeParse(valid).success).toBe(true);
    });

    it("validates learningPathQuerySchema", () => {
      expect(learningPathQuerySchema.safeParse({ pathSlug: "track-1" }).success).toBe(true);
      expect(learningPathQuerySchema.safeParse({ pathSlug: "" }).success).toBe(false);
    });

    it("validates moduleQuerySchema", () => {
      expect(
        moduleQuerySchema.safeParse({ pathSlug: "track-1", moduleSlug: "module-1" }).success
      ).toBe(true);
    });

    it("validates lessonQuerySchema", () => {
      expect(
        lessonQuerySchema.safeParse({
          pathSlug: "track-1",
          moduleSlug: "module-1",
          lessonSlug: "lesson-1",
        }).success
      ).toBe(true);
    });
  });
});
