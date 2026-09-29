import { z } from "zod";

/**
 * Schema for starting an exercise attempt
 */
export const StartExerciseSchema = z.object({
  exerciseId: z.string().uuid("Invalid exercise ID format"),
});

export const startExerciseSchema = StartExerciseSchema;
export type StartExerciseInput = z.infer<typeof StartExerciseSchema>;

/**
 * Schema for submitting an exercise code solution
 */
export const SubmitExerciseSchema = z.object({
  exerciseId: z.string().uuid("Invalid exercise ID format"),
  attemptId: z.string().uuid("Invalid attempt ID format"),
  submittedCode: z
    .string()
    .min(1, "Submitted code cannot be empty")
    .max(50000, "Submitted code exceeds maximum size limit of 50KB"),
  content: z.string().max(50000).optional(),
});

export const submitExerciseSchema = SubmitExerciseSchema;
export type SubmitExerciseInput = z.infer<typeof SubmitExerciseSchema>;

/**
 * Schema for completing an exercise after successful validation
 */
export const CompleteExerciseSchema = z.object({
  exerciseId: z.string().uuid("Invalid exercise ID format"),
  attemptId: z.string().uuid("Invalid attempt ID format"),
});

export const completeExerciseSchema = CompleteExerciseSchema;
export type CompleteExerciseInput = z.infer<typeof CompleteExerciseSchema>;

/**
 * Schema for creating exercise evidence
 */
export const ExerciseEvidenceSchema = z.object({
  exerciseId: z.string().uuid("Invalid exercise ID format"),
  attemptId: z.string().uuid("Invalid attempt ID format"),
  competencyId: z.string().uuid("Invalid competency ID format"),
  summary: z.string().min(1, "Summary is required"),
  evidenceType: z.string().optional().default("exercise_validation"),
  evidencePayload: z.record(z.string(), z.unknown()).optional(),
});

export const exerciseEvidenceSchema = ExerciseEvidenceSchema;
export type ExerciseEvidenceInput = z.infer<typeof ExerciseEvidenceSchema>;

/**
 * Schema for querying and filtering exercises
 */
export const ExerciseQueryFiltersSchema = z.object({
  lessonId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  competencyId: z.string().uuid().optional(),
  slug: z.string().optional(),
  isPublished: z.boolean().optional(),
});

export const exerciseQuerySchema = ExerciseQueryFiltersSchema;
export const exerciseQueryFiltersSchema = ExerciseQueryFiltersSchema;
export type ExerciseQueryInput = z.infer<typeof ExerciseQueryFiltersSchema>;
export type ExerciseQueryFiltersInput = z.infer<typeof ExerciseQueryFiltersSchema>;

/**
 * Schema for single exercise ID / slug parameters
 */
export const ExerciseIdentifierSchema = z.object({
  idOrSlug: z.string().min(1, "Exercise identifier is required"),
});

export const exerciseIdentifierSchema = ExerciseIdentifierSchema;
export type ExerciseIdentifierInput = z.infer<typeof ExerciseIdentifierSchema>;
