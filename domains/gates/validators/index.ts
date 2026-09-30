import { z } from "zod";

export const StartGateAttemptSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  gateId: z.string().uuid("Invalid gate ID format"),
});

export const startGateAttemptSchema = StartGateAttemptSchema;
export type StartGateAttemptInput = z.infer<typeof StartGateAttemptSchema>;

export const SubmitGateAttemptSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  gateId: z.string().uuid("Invalid gate ID format"),
  attemptId: z.string().uuid("Invalid attempt ID format"),
  notes: z.string().optional(),
});

export const submitGateAttemptSchema = SubmitGateAttemptSchema;
export type SubmitGateAttemptInput = z.infer<typeof SubmitGateAttemptSchema>;

export const CollectGateEvidenceSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  gateId: z.string().uuid("Invalid gate ID format"),
  attemptId: z.string().uuid("Invalid attempt ID format").optional(),
  evidenceType: z.string().min(1, "Evidence type is required"),
  evidenceReference: z.string().min(1, "Evidence reference is required"),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
});

export const collectGateEvidenceSchema = CollectGateEvidenceSchema;
export type CollectGateEvidenceInput = z.infer<typeof CollectGateEvidenceSchema>;

export const ValidateGateSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  gateId: z.string().uuid("Invalid gate ID format"),
  attemptId: z.string().uuid("Invalid attempt ID format").optional(),
  passed: z.boolean(),
  score: z.number().min(0).max(100).optional(),
  feedback: z.string().optional(),
  criteriaResults: z
    .array(
      z.object({
        criterion: z.string(),
        satisfied: z.boolean(),
        details: z.string().optional(),
      })
    )
    .optional(),
});

export const validateGateSchema = ValidateGateSchema;
export type ValidateGateInput = z.infer<typeof ValidateGateSchema>;

export const CompleteGateSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  gateId: z.string().uuid("Invalid gate ID format"),
});

export const completeGateSchema = CompleteGateSchema;
export type CompleteGateInput = z.infer<typeof CompleteGateSchema>;

export const UpdateGateProgressSchema = z.object({
  userId: z.string().uuid("Invalid user ID format"),
  gateId: z.string().uuid("Invalid gate ID format"),
  progressPercentage: z.number().int().min(0).max(100),
  status: z
    .enum(["locked", "available", "in_progress", "under_review", "validated", "completed"])
    .optional(),
});

export const updateGateProgressSchema = UpdateGateProgressSchema;
export type UpdateGateProgressInput = z.infer<typeof UpdateGateProgressSchema>;

export const GateQueryFiltersSchema = z.object({
  gateLevel: z.number().int().positive().optional(),
  slug: z.string().optional(),
  isActive: z.boolean().optional(),
});

export const gateQueryFiltersSchema = GateQueryFiltersSchema;
export type GateQueryFiltersInput = z.infer<typeof GateQueryFiltersSchema>;
