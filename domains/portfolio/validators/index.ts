import { z } from "zod";

export const CreatePortfolioSchema = z.object({
  userId: z.string().uuid("Invalid user UUID"),
  title: z.string().min(1, "Title is required").max(200).optional(),
  description: z.string().max(2000).optional(),
});

export const UpdatePortfolioSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional().nullable(),
});

export const PortfolioSectionTypeSchema = z.enum([
  "projects",
  "competencies",
  "achievements",
  "artifacts",
  "professional_evidence",
  "generated_work",
]);

export const CreatePortfolioSectionSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio UUID"),
  sectionType: PortfolioSectionTypeSchema,
  title: z.string().min(1, "Section title is required").max(100),
  displayOrder: z.number().int().min(0).optional(),
});

export const PortfolioArtifactTypeSchema = z.enum([
  "lesson_evidence",
  "exercise_evidence",
  "competency_evidence",
  "achievement_evidence",
  "gate_evidence",
  "documentation_artifact",
  "design_artifact",
  "project_artifact",
]);

export const CreatePortfolioArtifactSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio UUID"),
  artifactType: PortfolioArtifactTypeSchema,
  sourceDomain: z.string().min(1).max(100),
  sourceId: z.string().uuid("Invalid source UUID").optional().nullable(),
  title: z.string().min(1, "Artifact title is required").max(250),
  description: z.string().max(2000).optional().nullable(),
});

export const CreatePortfolioEvidenceSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio UUID"),
  evidenceType: z.string().min(1, "Evidence type is required").max(100),
  evidenceReference: z.string().min(1, "Evidence reference is required").max(1000),
  competencyId: z.string().uuid("Invalid competency UUID").optional().nullable(),
});

export const CollectPortfolioEvidenceSchema = CreatePortfolioEvidenceSchema;

export const PortfolioProjectStatusSchema = z.enum([
  "in_progress",
  "completed",
  "archived",
]);

export const CreatePortfolioProjectSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio UUID"),
  title: z.string().min(1, "Project title is required").max(200),
  description: z.string().max(3000).optional().nullable(),
  projectType: z.string().min(1).max(100).default("production_app"),
  status: PortfolioProjectStatusSchema.default("completed"),
});

export const UpdatePortfolioProjectSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(3000).optional().nullable(),
  projectType: z.string().min(1).max(100).optional(),
  status: PortfolioProjectStatusSchema.optional(),
});

export const SyncPortfolioCompetenciesSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio UUID"),
  competencyIds: z.array(z.string().uuid("Invalid competency UUID")),
});

export const SyncPortfolioAchievementsSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio UUID"),
  achievementIds: z.array(z.string().uuid("Invalid achievement UUID")),
});

export const HiringSignalTypeSchema = z.enum([
  "competency_demonstrated",
  "exercise_completed",
  "achievement_earned",
  "gate_completed",
  "artifact_produced",
]);

export const HiringSignalStrengthSchema = z.enum([
  "high",
  "medium",
  "low",
  "strong",
  "moderate",
]);

export const CreateHiringSignalSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio UUID"),
  signalType: HiringSignalTypeSchema,
  signalStrength: HiringSignalStrengthSchema,
});

export const GenerateHiringSignalsSchema = z.object({
  portfolioId: z.string().uuid("Invalid portfolio UUID"),
  signals: z.array(
    z.object({
      signalType: HiringSignalTypeSchema,
      signalStrength: HiringSignalStrengthSchema,
    })
  ),
});
