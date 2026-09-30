import { describe, it, expect } from "vitest";
import {
  CreatePortfolioProjectSchema,
  CreatePortfolioArtifactSchema,
  CollectPortfolioEvidenceSchema,
  CreatePortfolioSectionSchema,
  CreateHiringSignalSchema,
  SyncPortfolioCompetenciesSchema,
  SyncPortfolioAchievementsSchema,
} from "@/domains/portfolio/validators";

describe("Portfolio Domain Schemas & Validation", () => {
  const validUUID = "a1000000-0000-4000-8000-000000000001";
  const validCompUUID = "c1000000-0000-4000-8000-000000000002";
  const validAchUUID = "d1000000-0000-4000-8000-000000000003";

  describe("CreatePortfolioProjectSchema", () => {
    it("validates valid project payload", () => {
      const valid = {
        portfolioId: validUUID,
        title: "Distributed Message Broker",
        description: "Built a high-throughput event streaming broker in Go/Rust.",
        projectType: "project",
        status: "completed",
      };
      const result = CreatePortfolioProjectSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Distributed Message Broker");
        expect(result.data.status).toBe("completed");
      }
    });

    it("rejects project with empty title", () => {
      const invalid = {
        portfolioId: validUUID,
        title: "",
      };
      const result = CreatePortfolioProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("rejects invalid status", () => {
      const invalid = {
        portfolioId: validUUID,
        title: "Valid Title",
        status: "unknown_status",
      };
      const result = CreatePortfolioProjectSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("CreatePortfolioArtifactSchema", () => {
    it("validates valid artifact payload", () => {
      const valid = {
        portfolioId: validUUID,
        artifactType: "exercise_evidence",
        sourceDomain: "exercise",
        sourceId: validUUID,
        title: "Binary Search Tree Implementation",
        description: "Passed 100% test coverage with automated runner.",
      };
      const result = CreatePortfolioArtifactSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.artifactType).toBe("exercise_evidence");
      }
    });

    it("rejects unsupported artifact types (e.g. capstone / job readiness)", () => {
      const invalid = {
        portfolioId: validUUID,
        artifactType: "capstone_evidence",
        sourceDomain: "capstone",
        title: "Capstone Submission",
      };
      const result = CreatePortfolioArtifactSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("CollectPortfolioEvidenceSchema", () => {
    it("validates valid evidence payload", () => {
      const valid = {
        portfolioId: validUUID,
        evidenceType: "exercise_pass",
        evidenceReference: "exercise://submission-12345",
        competencyId: validCompUUID,
      };
      const result = CollectPortfolioEvidenceSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.evidenceReference).toBe("exercise://submission-12345");
      }
    });

    it("rejects empty evidence reference", () => {
      const invalid = {
        portfolioId: validUUID,
        evidenceType: "gate_pass",
        evidenceReference: "",
      };
      const result = CollectPortfolioEvidenceSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("CreatePortfolioSectionSchema", () => {
    it("validates valid section type and display order", () => {
      const valid = {
        portfolioId: validUUID,
        sectionType: "projects",
        title: "Featured Engineering Builds",
        displayOrder: 1,
      };
      const result = CreatePortfolioSectionSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects negative display order", () => {
      const invalid = {
        portfolioId: validUUID,
        sectionType: "projects",
        title: "Featured Engineering Builds",
        displayOrder: -1,
      };
      const result = CreatePortfolioSectionSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateHiringSignalSchema", () => {
    it("validates supported signal types and signal strength", () => {
      const valid = {
        portfolioId: validUUID,
        signalType: "gate_completed",
        signalStrength: "strong",
      };
      const result = CreateHiringSignalSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects unsupported signal types", () => {
      const invalid = {
        portfolioId: validUUID,
        signalType: "job_readiness_score",
        signalStrength: "high",
      };
      const result = CreateHiringSignalSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("SyncPortfolioCompetenciesSchema & SyncPortfolioAchievementsSchema", () => {
    it("validates competency ID sync list", () => {
      const valid = {
        portfolioId: validUUID,
        competencyIds: [validCompUUID],
      };
      const result = SyncPortfolioCompetenciesSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("validates achievement ID sync list", () => {
      const valid = {
        portfolioId: validUUID,
        achievementIds: [validAchUUID],
      };
      const result = SyncPortfolioAchievementsSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });
});
