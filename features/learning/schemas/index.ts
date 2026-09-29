import { z } from "zod";

/**
 * Standard Slug validation
 */
export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(120, "Slug must not exceed 120 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain lowercase alphanumeric characters and hyphens only");

/**
 * UUID Identifier validation
 */
export const uuidSchema = z.string().uuid("Invalid unique identifier format");

/**
 * Difficulty level validation
 */
export const difficultySchema = z.enum(["beginner", "intermediate", "advanced"]);

/**
 * Progress Status validation
 */
export const progressStatusSchema = z.enum(["not_started", "in_progress", "completed"]);

/**
 * Query schema for retrieving a learning path
 */
export const learningPathQuerySchema = z.object({
  pathSlug: slugSchema,
});

/**
 * Query schema for retrieving a module
 */
export const moduleQuerySchema = z.object({
  pathSlug: slugSchema,
  moduleSlug: slugSchema,
});

/**
 * Query schema for retrieving a lesson
 */
export const lessonQuerySchema = z.object({
  pathSlug: slugSchema,
  moduleSlug: slugSchema,
  lessonSlug: slugSchema,
});

/**
 * Input schema for starting a lesson
 */
export const startLessonSchema = z.object({
  pathSlug: slugSchema,
  moduleSlug: slugSchema,
  lessonSlug: slugSchema,
});

/**
 * Input schema for completing a lesson
 */
export const completeLessonSchema = z.object({
  pathSlug: slugSchema,
  moduleSlug: slugSchema,
  lessonSlug: slugSchema,
});

/**
 * Query schema for fetching user progress
 */
export const progressQuerySchema = z.object({
  pathId: uuidSchema.optional(),
  moduleId: uuidSchema.optional(),
  lessonId: uuidSchema.optional(),
});

export type LearningPathQueryInput = z.infer<typeof learningPathQuerySchema>;
export type ModuleQueryInput = z.infer<typeof moduleQuerySchema>;
export type LessonQueryInput = z.infer<typeof lessonQuerySchema>;
export type StartLessonInput = z.infer<typeof startLessonSchema>;
export type CompleteLessonInput = z.infer<typeof completeLessonSchema>;
export type ProgressQueryInput = z.infer<typeof progressQuerySchema>;
