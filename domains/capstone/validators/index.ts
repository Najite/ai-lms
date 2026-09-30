import { z } from "zod";

export const CapstoneDifficultySchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
  "expert",
]);

export const CapstoneStateSchema = z.enum([
  "locked",
  "available",
  "in_progress",
  "submitted",
  "under_review",
  "approved",
  "completed",
]);

export const CapstoneReviewTypeSchema = z.enum(["automated", "peer", "instructor"]);

export const CapstoneReviewResultSchema = z.enum([
  "approved",
  "changes_requested",
  "rejected",
]);

export const DeliverableTypeSchema = z.enum([
  "repository",
  "architecture_doc",
  "live_deployment",
  "test_suite",
  "video_walkthrough",
]);

export const CreateCapstoneSchema = z.object({
  typeId: z.string().uuid("Invalid type UUID"),
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100),
  description: z.string().min(1, "Description is required").max(10000),
  difficulty: CapstoneDifficultySchema.default("intermediate"),
  status: z.enum(["draft", "active", "archived"]).default("active"),
  estimatedHours: z.number().int().min(1).max(500).default(20),
  competencyIds: z.array(z.string().uuid("Invalid competency UUID")).optional(),
  dependencyCapstoneIds: z.array(z.string().uuid("Invalid capstone UUID")).optional(),
});

export const CreateCapstoneDeliverableSchema = z.object({
  capstoneId: z.string().uuid("Invalid capstone UUID"),
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(2000),
  required: z.boolean().default(true),
  deliverableType: DeliverableTypeSchema.default("repository"),
});

export const CapstoneDeliverableSubmissionItemSchema = z.object({
  deliverableId: z.string().uuid("Invalid deliverable UUID"),
  title: z.string().min(1).max(200),
  url: z.string().url("Invalid deliverable URL").optional().or(z.literal("")),
  content: z.string().max(10000).optional(),
});

export const SubmitCapstoneSchema = z.object({
  capstoneId: z.string().uuid("Invalid capstone UUID"),
  userId: z.string().uuid("Invalid user UUID"),
  deliverables: z
    .array(CapstoneDeliverableSubmissionItemSchema)
    .min(1, "At least one deliverable submission is required"),
  repositoryUrl: z.string().url("Invalid repository URL").optional().nullable().or(z.literal("")),
  liveUrl: z.string().url("Invalid deployment URL").optional().nullable().or(z.literal("")),
  documentationUrl: z.string().url("Invalid docs URL").optional().nullable().or(z.literal("")),
  notes: z.string().max(3000).optional().nullable(),
});

export const ReviewCapstoneSchema = z.object({
  capstoneId: z.string().uuid("Invalid capstone UUID"),
  userId: z.string().uuid("Invalid user UUID"),
  submissionId: z.string().uuid("Invalid submission UUID").optional().nullable(),
  reviewerId: z.string().uuid("Invalid reviewer UUID").optional().nullable(),
  reviewType: CapstoneReviewTypeSchema,
  reviewResult: CapstoneReviewResultSchema,
  score: z.number().int().min(0).max(100).optional().nullable(),
  feedbackText: z.string().min(1, "Feedback text is required").max(5000),
});

export const CollectCapstoneEvidenceSchema = z.object({
  capstoneId: z.string().uuid("Invalid capstone UUID"),
  userId: z.string().uuid("Invalid user UUID"),
  evidenceType: z.string().min(1, "Evidence type is required").max(100),
  evidenceReference: z.string().min(1, "Evidence reference is required").max(1000),
});

export const CompleteCapstoneSchema = z.object({
  capstoneId: z.string().uuid("Invalid capstone UUID"),
  userId: z.string().uuid("Invalid user UUID"),
});

export const StartCapstoneSchema = z.object({
  capstoneId: z.string().uuid("Invalid capstone UUID"),
  userId: z.string().uuid("Invalid user UUID"),
});

export const UpdateCapstoneProgressSchema = z.object({
  capstoneId: z.string().uuid("Invalid capstone UUID"),
  userId: z.string().uuid("Invalid user UUID"),
  status: CapstoneStateSchema.optional(),
  progressPercentage: z.number().int().min(0).max(100).optional(),
});
