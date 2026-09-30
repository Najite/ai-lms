import { z } from "zod";

/**
 * Validator for awarding XP
 */
export const AwardXPSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  sourceType: z.enum(["lesson_completion", "exercise_completion", "competency_progression", "achievement"], {
    message: "Invalid XP source type",
  }),
  sourceId: z.string().min(1, "Source ID is required"),
  amount: z.number().int().positive("XP amount must be a positive integer").optional(),
});

export const awardXPSchema = AwardXPSchema;
export type AwardXPInput = z.infer<typeof AwardXPSchema>;

/**
 * Validator for creating an XP transaction
 */
export const CreateXPTransactionSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  sourceType: z.enum(["lesson_completion", "exercise_completion", "competency_progression", "achievement"]),
  sourceId: z.string().min(1, "Source ID is required"),
  amount: z.number().int().positive("XP amount must be a positive integer"),
});

export const createXPTransactionSchema = CreateXPTransactionSchema;
export type CreateXPTransactionInput = z.infer<typeof CreateXPTransactionSchema>;

/**
 * Validator for updating achievement progress
 */
export const UpdateAchievementProgressSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  achievementId: z.string().uuid("Invalid achievement ID format"),
  progressValue: z.number().int().nonnegative("Progress value must be non-negative"),
});

export const updateAchievementProgressSchema = UpdateAchievementProgressSchema;
export type UpdateAchievementProgressInput = z.infer<typeof UpdateAchievementProgressSchema>;

/**
 * Validator for awarding an achievement
 */
export const AwardAchievementSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  achievementId: z.string().uuid("Invalid achievement ID format"),
  evidenceType: z.string().optional().default("milestone_evaluation"),
  evidenceReference: z.string().optional(),
});

export const awardAchievementSchema = AwardAchievementSchema;
export type AwardAchievementInput = z.infer<typeof AwardAchievementSchema>;

/**
 * Validator for creating achievement evidence
 */
export const CreateAchievementEvidenceSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  achievementId: z.string().uuid("Invalid achievement ID format"),
  evidenceType: z.string().min(1, "Evidence type is required"),
  evidenceReference: z.string().min(1, "Evidence reference is required"),
});

export const createAchievementEvidenceSchema = CreateAchievementEvidenceSchema;
export type CreateAchievementEvidenceInput = z.infer<typeof CreateAchievementEvidenceSchema>;

/**
 * Validator for querying achievements
 */
export const AchievementQueryFiltersSchema = z.object({
  categoryId: z.string().uuid().optional(),
  slug: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const achievementQueryFiltersSchema = AchievementQueryFiltersSchema;
export type AchievementQueryFiltersInput = z.infer<typeof AchievementQueryFiltersSchema>;
