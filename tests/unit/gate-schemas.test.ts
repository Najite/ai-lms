import { describe, it, expect } from "vitest";
import {
  StartGateAttemptSchema,
  SubmitGateAttemptSchema,
  CollectGateEvidenceSchema,
  ValidateGateSchema,
  CompleteGateSchema,
  UpdateGateProgressSchema,
  GateQueryFiltersSchema,
} from "@/domains/gates/validators";

describe("Competency Gate Domain Schemas & Validation", () => {
  const validUUID = "a1000000-0000-4000-8000-000000000001";
  const validUserUUID = "b1000000-0000-4000-8000-000000000002";

  describe("StartGateAttemptSchema", () => {
    it("validates valid start attempt input", () => {
      const valid = {
        userId: validUserUUID,
        gateId: validUUID,
      };
      const result = StartGateAttemptSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects invalid UUID format", () => {
      const invalid = {
        userId: "not-a-uuid",
        gateId: validUUID,
      };
      const result = StartGateAttemptSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("CollectGateEvidenceSchema", () => {
    it("validates evidence with metadata", () => {
      const valid = {
        userId: validUserUUID,
        gateId: validUUID,
        evidenceType: "project_repository",
        evidenceReference: "https://github.com/org/repo",
        metadata: { branch: "main", commit: "abcdef1" },
      };
      const result = CollectGateEvidenceSchema.safeParse(valid);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.evidenceType).toBe("project_repository");
      }
    });

    it("rejects empty evidence reference", () => {
      const invalid = {
        userId: validUserUUID,
        gateId: validUUID,
        evidenceType: "project_repository",
        evidenceReference: "",
      };
      const result = CollectGateEvidenceSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("ValidateGateSchema", () => {
    it("validates passing evaluation with criteria results", () => {
      const valid = {
        userId: validUserUUID,
        gateId: validUUID,
        passed: true,
        score: 95,
        feedback: "Excellent architecture and test harness.",
        criteriaResults: [
          { criterion: "Schema validation", satisfied: true, details: "100% compliant" },
          { criterion: "Unit tests", satisfied: true, details: "100% pass rate" },
        ],
      };
      const result = ValidateGateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects scores outside 0-100 range", () => {
      const invalid = {
        userId: validUserUUID,
        gateId: validUUID,
        passed: true,
        score: 150,
      };
      const result = ValidateGateSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("CompleteGateSchema", () => {
    it("validates valid gate completion payload", () => {
      const valid = {
        userId: validUserUUID,
        gateId: validUUID,
      };
      const result = CompleteGateSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe("UpdateGateProgressSchema", () => {
    it("validates progress percentage and status", () => {
      const valid = {
        userId: validUserUUID,
        gateId: validUUID,
        progressPercentage: 80,
        status: "in_progress",
      };
      const result = UpdateGateProgressSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("rejects negative progress percentages", () => {
      const invalid = {
        userId: validUserUUID,
        gateId: validUUID,
        progressPercentage: -10,
      };
      const result = UpdateGateProgressSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("SubmitGateAttemptSchema", () => {
    it("validates valid gate attempt submission", () => {
      const valid = {
        userId: validUserUUID,
        gateId: validUUID,
        attemptId: validUUID,
        notes: "All evidence submitted",
      };
      const result = SubmitGateAttemptSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe("GateQueryFiltersSchema", () => {
    it("validates valid query filter parameters", () => {
      const valid = {
        gateLevel: 2,
        isActive: true,
        slug: "frontend-engineer",
      };
      const result = GateQueryFiltersSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });
});
