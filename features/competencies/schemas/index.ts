import { z } from "zod";

/**
 * Competency State Schema
 */
export const competencyStateSchema = z.enum([
  "not_started",
  "introduced",
  "practicing",
  "reinforced",
  "mastered",
]);

/**
 * Competency Level Schema
 */
export const competencyLevelSchema = z.enum([
  "foundational",
  "intermediate",
  "advanced",
  "expert",
]);

/**
 * Competency Evidence Source Schema
 */
export const competencyEvidenceSourceSchema = z.enum([
  "lesson_completion",
  "learning_activity",
]);

/**
 * UUID Identifier validation
 */
export const uuidSchema = z.string().uuid("Invalid unique identifier format");

/**
 * Slug validation
 */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(120, "Slug must not exceed 120 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain lowercase alphanumeric characters and hyphens only");

/**
 * Competency Query Schema (by slug or UUID)
 */
export const competencyQuerySchema = z.object({
  slug: slugSchema.optional(),
  id: uuidSchema.optional(),
}).refine((data) => data.slug || data.id, {
  message: "Either slug or id must be provided",
});

/**
 * Module Competency Query Schema
 */
export const moduleCompetenciesQuerySchema = z.object({
  moduleId: uuidSchema,
});

/**
 * Lesson Competency Query Schema
 */
export const lessonCompetenciesQuerySchema = z.object({
  lessonId: uuidSchema,
});

/**
 * Update Competency Progress Input Schema
 */
export const updateCompetencyProgressSchema = z.object({
  competencyId: uuidSchema,
  sourceType: competencyEvidenceSourceSchema.default("lesson_completion"),
  sourceId: uuidSchema,
  sourceTitle: z.string().min(1, "Source title is required").max(200),
  summary: z.string().min(1, "Evidence summary is required").max(1000),
  contributionPoints: z.number().int().min(1).max(100).default(10),
  targetState: competencyStateSchema.optional(),
});

export type CompetencyQueryInput = z.infer<typeof competencyQuerySchema>;
export type ModuleCompetenciesQueryInput = z.infer<typeof moduleCompetenciesQuerySchema>;
export type LessonCompetenciesQueryInput = z.infer<typeof lessonCompetenciesQuerySchema>;
export type UpdateCompetencyProgressInput = z.infer<typeof updateCompetencyProgressSchema>;
