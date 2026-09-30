import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { GateQueryService } from "@/domains/gates/services/gate-query.service";
import { GateRequirementService } from "@/domains/gates/services/gate-requirement.service";
import { GateProgressService } from "@/domains/gates/services/gate-progress.service";
import { GateEvidenceService } from "@/domains/gates/services/gate-evidence.service";
import { GateValidationService } from "@/domains/gates/services/gate-validation.service";
import { GateCompletionService } from "@/domains/gates/services/gate-completion.service";

describe("Competency Gate Domain Services", () => {
  let mockSupabase: SupabaseClient<Database>;
  let mockFrom: ReturnType<typeof vi.fn>;

  const mockGate1 = {
    id: "gate-1",
    slug: "gate-1-ai-builder",
    name: "Gate 1: AI-Assisted Builder",
    description: "Validates foundation AI builder skills",
    gate_level: 1,
    is_active: true,
    created_at: new Date().toISOString(),
    gate_requirements: [
      {
        id: "req-1",
        gate_id: "gate-1",
        requirement_type: "lesson",
        requirement_value: { count: 1 },
        created_at: new Date().toISOString(),
      },
      {
        id: "req-2",
        gate_id: "gate-1",
        requirement_type: "xp",
        requirement_value: { min_xp: 50 },
        created_at: new Date().toISOString(),
      },
    ],
    gate_competencies: [],
  };

  beforeEach(() => {
    mockFrom = vi.fn();
    mockSupabase = {
      from: mockFrom,
    } as unknown as SupabaseClient<Database>;
  });

  describe("GateQueryService", () => {
    it("retrieves active competency gates ordered by level", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [mockGate1], error: null }),
      });

      const service = new GateQueryService(mockSupabase);
      const res = await service.getGates({ isActive: true });

      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
      expect(res.data?.[0]?.slug).toBe("gate-1-ai-builder");
      expect(res.data?.[0]?.gateLevel).toBe(1);
    });

    it("retrieves a single gate by slug", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockGate1, error: null }),
      });

      const service = new GateQueryService(mockSupabase);
      const res = await service.getGateById("gate-1-ai-builder");

      expect(res.success).toBe(true);
      expect(res.data?.name).toBe("Gate 1: AI-Assisted Builder");
      expect(res.data?.requirements).toHaveLength(2);
    });
  });

  describe("GateRequirementService", () => {
    it("evaluates requirements accurately across domains", async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === "competency_gates") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockGate1, error: null }),
          };
        }
        if (table === "user_competency_progress") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        if (table === "user_learning_progress") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: (resolve: (value: unknown) => void) => resolve({ data: [{ id: "lp-1", status: "completed" }], error: null }),
          };
        }
        if (table === "exercise_completion") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: (resolve: (value: unknown) => void) => resolve({ data: [{ id: "ex-1", status: "passed" }], error: null }),
          };
        }
        if (table === "achievement_awards") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        if (table === "xp_balances") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: { total_xp: 150 }, error: null }),
          };
        }
        if (table === "gate_evidence") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {};
      });

      const service = new GateRequirementService(mockSupabase);
      const res = await service.evaluateRequirements("user-1", "gate-1");

      expect(res.success).toBe(true);
      expect(res.data?.allSatisfied).toBe(true);
      expect(res.data?.satisfiedCount).toBe(2);
      expect(res.data?.totalCount).toBe(2);
    });
  });

  describe("GateProgressService", () => {
    it("calculates progress and state transition", async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === "competency_gates") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockGate1, error: null }),
          };
        }
        if (table === "gate_completion") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        if (table === "user_learning_progress" || table === "exercise_completion") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: (resolve: (value: unknown) => void) => resolve({ data: [{ id: "1" }], error: null }),
          };
        }
        if (table === "xp_balances") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: { total_xp: 100 }, error: null }),
          };
        }
        if (table === "gate_attempts") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: "att-1", user_id: "user-1", gate_id: "gate-1", status: "in_progress", started_at: new Date().toISOString() },
              error: null,
            }),
          };
        }
        if (table === "gate_validation") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          };
        }
        if (table === "user_gate_progress") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            upsert: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: "ugp-1", user_id: "user-1", gate_id: "gate-1", progress_percentage: 70, status: "in_progress", updated_at: new Date().toISOString() },
              error: null,
            }),
          };
        }
        if (table === "gate_evidence") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      const service = new GateProgressService(mockSupabase);
      const res = await service.calculateProgress("user-1", "gate-1");

      expect(res.success).toBe(true);
      expect(res.data?.status).toBe("in_progress");
      expect(res.data?.isCompleted).toBe(false);
    });
  });

  describe("GateEvidenceService", () => {
    it("collects and retrieves traceable evidence", async () => {
      const mockEvidence = {
        id: "ev-1",
        user_id: "user-1",
        gate_id: "gate-1",
        attempt_id: "att-1",
        evidence_type: "project_repository",
        evidence_reference: "https://github.com/user/project",
        metadata: { branch: "main" },
        created_at: new Date().toISOString(),
      };

      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockEvidence, error: null }),
      });

      const service = new GateEvidenceService(mockSupabase);
      const res = await service.collectEvidence(
        "user-1",
        "gate-1",
        "project_repository",
        "https://github.com/user/project",
        "att-1",
        { branch: "main" }
      );

      expect(res.success).toBe(true);
      expect(res.data?.evidenceReference).toContain("github.com");
      expect(res.data?.evidenceType).toBe("project_repository");
    });
  });

  describe("GateValidationService", () => {
    it("persists validation result and updates gate progress to validated", async () => {
      const mockValidation = {
        id: "val-1",
        user_id: "user-1",
        gate_id: "gate-1",
        attempt_id: "att-1",
        validation_result: { passed: true, score: 100 },
        validated_at: new Date().toISOString(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "gate_validation") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockValidation, error: null }),
          };
        }
        if (table === "gate_attempts") {
          return {
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: { id: "att-1", status: "passed" }, error: null }),
          };
        }
        if (table === "user_gate_progress") {
          return {
            upsert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: "ugp-1", user_id: "user-1", gate_id: "gate-1", progress_percentage: 95, status: "validated", updated_at: new Date().toISOString() },
              error: null,
            }),
          };
        }
        return {};
      });

      const service = new GateValidationService(mockSupabase);
      const res = await service.validateGate("user-1", "gate-1", true, 100, "Approved", [], "att-1");

      expect(res.success).toBe(true);
      expect(res.data?.validationResult.passed).toBe(true);
    });
  });

  describe("GateCompletionService", () => {
    it("completes gate permanently when all requirements and validations pass", async () => {
      const mockCompletion = {
        id: "comp-1",
        user_id: "user-1",
        gate_id: "gate-1",
        completed_at: new Date().toISOString(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "competency_gates") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockGate1, error: null }),
          };
        }
        if (table === "gate_completion") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            insert: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockCompletion, error: null }),
          };
        }
        if (table === "user_learning_progress" || table === "exercise_completion") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            then: (resolve: (value: unknown) => void) => resolve({ data: [{ id: "1" }], error: null }),
          };
        }
        if (table === "xp_balances") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: { total_xp: 200 }, error: null }),
          };
        }
        if (table === "gate_evidence") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({
              data: [{ id: "ev-1", user_id: "user-1", gate_id: "gate-1", evidence_type: "proof", evidence_reference: "ref" }],
              error: null,
            }),
            insert: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({
                data: { id: "ev-1", user_id: "user-1", gate_id: "gate-1", evidence_type: "proof", evidence_reference: "ref", metadata: {}, created_at: new Date().toISOString() },
                error: null,
              }),
            }),
          };
        }
        if (table === "gate_validation") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: { id: "val-1", user_id: "user-1", gate_id: "gate-1", validation_result: { passed: true } },
              error: null,
            }),
          };
        }
        if (table === "user_gate_progress") {
          return {
            upsert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: "ugp-1", user_id: "user-1", gate_id: "gate-1", progress_percentage: 100, status: "completed", updated_at: new Date().toISOString() },
              error: null,
            }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      });

      const service = new GateCompletionService(mockSupabase);
      const res = await service.completeGate("user-1", "gate-1");

      expect(res.success).toBe(true);
      expect(res.data?.gateId).toBe("gate-1");
    });
  });
});
