import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioAggregationService } from "@/domains/portfolio/services/portfolio-aggregation.service";

describe("Portfolio Domain Aggregation Engine", () => {
  let mockSupabase: SupabaseClient<Database>;
  let mockFrom: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFrom = vi.fn();
    mockSupabase = {
      from: mockFrom,
    } as unknown as SupabaseClient<Database>;
  });

  it("aggregates completed exercises, gates, achievements, and competencies into portfolio", async () => {
    const mockPortfolio = {
      id: "port-1",
      user_id: "user-1",
      title: "Portfolio",
      description: "Auto aggregated",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const mockPassedExercises = [
      {
        exercise_id: "ex-1",
        score: 100,
        exercises: { title: "Two Sum", slug: "two-sum" },
      },
    ];

    const mockCompletedGates = [
      {
        gate_id: "gate-1",
        competency_gates: { name: "Core Software Architect Gate", slug: "core-architect", gate_level: 1 },
      },
    ];

    const mockAwardedAchievements = [
      {
        achievement_id: "ach-1",
        achievements: { name: "First Gate Cleared", slug: "first-gate", tier: "bronze", xp_reward: 50 },
      },
    ];

    const mockMasteredCompetencies = [
      {
        competency_id: "comp-1",
        state: "mastered",
        score: 95,
        competencies: { code: "ARCH-101", title: "Domain Driven Design" },
      },
    ];

    const insertedEvidence: Record<string, unknown>[] = [];
    const insertedArtifacts: Record<string, unknown>[] = [];
    const insertedSignals: Record<string, unknown>[] = [];

    mockFrom.mockImplementation((table: string) => {
      if (table === "portfolios") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
        };
      }
      if (table === "portfolio_sections") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }
      if (table === "portfolio_evidence") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: insertedEvidence, error: null }),
          }),
          insert: vi.fn().mockImplementation((payload: Record<string, unknown>) => {
            insertedEvidence.push(payload);
            return {
              select: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({ data: { id: "ev-auto", ...payload }, error: null }),
            };
          }),
        };
      }
      if (table === "portfolio_artifacts") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: insertedArtifacts, error: null }),
          }),
          insert: vi.fn().mockImplementation((payload: Record<string, unknown>) => {
            insertedArtifacts.push(payload);
            return {
              select: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({ data: { id: "art-auto", ...payload }, error: null }),
            };
          }),
        };
      }
      if (table === "portfolio_hiring_signals") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: insertedSignals, error: null }),
          }),
          insert: vi.fn().mockImplementation((payload: Record<string, unknown>) => {
            insertedSignals.push(payload);
            return {
              select: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({ data: { id: "sig-auto", ...payload }, error: null }),
            };
          }),
        };
      }
      if (table === "exercise_completion") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (resolve: (value: { data: typeof mockPassedExercises; error: null }) => void) =>
            resolve({ data: mockPassedExercises, error: null }),
        };
      }
      if (table === "gate_completion") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: mockCompletedGates, error: null }),
        };
      }
      if (table === "achievement_awards") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: mockAwardedAchievements, error: null }),
        };
      }
      if (table === "user_competency_progress") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockResolvedValue({ data: mockMasteredCompetencies, error: null }),
        };
      }
      if (table === "portfolio_competencies") {
        return {
          upsert: vi.fn().mockResolvedValue({ error: null }),
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [{ id: "pc-1", portfolio_id: "port-1", competency_id: "comp-1" }],
            error: null,
          }),
        };
      }
      if (table === "portfolio_achievements") {
        return {
          upsert: vi.fn().mockResolvedValue({ error: null }),
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({
            data: [{ id: "pa-1", portfolio_id: "port-1", achievement_id: "ach-1" }],
            error: null,
          }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const aggregationService = new PortfolioAggregationService(mockSupabase);
    const result = await aggregationService.aggregateUserPortfolio("user-1");

    expect(result.success).toBe(true);
    expect(result.data?.aggregatedEvidenceCount).toBeGreaterThanOrEqual(2);
    expect(result.data?.aggregatedArtifactCount).toBeGreaterThanOrEqual(1);
    expect(result.data?.aggregatedSignalsCount).toBeGreaterThanOrEqual(2);
    expect(result.data?.aggregatedCompetenciesCount).toBe(1);
    expect(result.data?.aggregatedAchievementsCount).toBe(1);
  });

  it("is idempotent: subsequent aggregation does not duplicate existing evidence or artifacts", async () => {
    const mockPortfolio = {
      id: "port-1",
      user_id: "user-1",
      title: "Portfolio",
      description: "Auto aggregated",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const existingEvidenceRow = {
      id: "e1",
      portfolio_id: "port-1",
      evidence_type: "exercise_completion",
      evidence_reference: "exercise://two-sum",
      competency_id: null,
      created_at: new Date().toISOString(),
    };
    const existingArtifactRow = {
      id: "a1",
      portfolio_id: "port-1",
      artifact_type: "exercise_evidence",
      source_domain: "exercise",
      source_id: "ex-1",
      title: "Two Sum",
      description: "Proof",
      created_at: new Date().toISOString(),
    };
    const existingSignalRow = {
      id: "s1",
      portfolio_id: "port-1",
      signal_type: "exercise_completed",
      signal_strength: "high",
      generated_at: new Date().toISOString(),
    };

    const insertEvidenceSpy = vi.fn();
    const insertArtifactSpy = vi.fn();
    const insertSignalSpy = vi.fn();

    mockFrom.mockImplementation((table: string) => {
      if (table === "portfolios") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
        };
      }
      if (table === "portfolio_sections") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
          insert: vi.fn().mockResolvedValue({ error: null }),
        };
      }
      if (table === "portfolio_evidence") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [existingEvidenceRow], error: null }),
          }),
          insert: insertEvidenceSpy,
        };
      }
      if (table === "portfolio_artifacts") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [existingArtifactRow], error: null }),
          }),
          insert: insertArtifactSpy,
        };
      }
      if (table === "portfolio_hiring_signals") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [existingSignalRow], error: null }),
          }),
          insert: insertSignalSpy,
        };
      }
      if (table === "exercise_completion") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          then: (
            resolve: (value: {
              data: { exercise_id: string; score: number; exercises: { title: string; slug: string } }[];
              error: null;
            }) => void
          ) =>
            resolve({
              data: [
                {
                  exercise_id: "ex-1",
                  score: 100,
                  exercises: { title: "Two Sum", slug: "two-sum" },
                },
              ],
              error: null,
            }),
        };
      }
      if (table === "gate_completion" || table === "achievement_awards") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        };
      }
      if (table === "user_competency_progress") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockResolvedValue({ data: [], error: null }),
        };
      }
      if (table === "portfolio_competencies" || table === "portfolio_achievements") {
        return {
          upsert: vi.fn().mockResolvedValue({ error: null }),
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockResolvedValue({ data: [], error: null }),
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
    });

    const aggregationService = new PortfolioAggregationService(mockSupabase);
    await aggregationService.aggregateUserPortfolio("user-1");

    expect(insertEvidenceSpy).not.toHaveBeenCalled();
    expect(insertArtifactSpy).not.toHaveBeenCalled();
    expect(insertSignalSpy).not.toHaveBeenCalled();
  });
});
