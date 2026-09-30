import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioQueryService } from "@/domains/portfolio/services/portfolio-query.service";
import { PortfolioProjectService } from "@/domains/portfolio/services/portfolio-project.service";
import { PortfolioArtifactService } from "@/domains/portfolio/services/portfolio-artifact.service";
import { PortfolioEvidenceService } from "@/domains/portfolio/services/portfolio-evidence.service";
import { PortfolioCompetencyService } from "@/domains/portfolio/services/portfolio-competency.service";
import { PortfolioAchievementService } from "@/domains/portfolio/services/portfolio-achievement.service";
import { HiringSignalService } from "@/domains/portfolio/services/hiring-signal.service";

describe("Portfolio Domain Services", () => {
  let mockSupabase: SupabaseClient<Database>;
  let mockFrom: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFrom = vi.fn();
    mockSupabase = {
      from: mockFrom,
    } as unknown as SupabaseClient<Database>;
  });

  describe("PortfolioQueryService", () => {
    it("retrieves or auto-initializes portfolio for user", async () => {
      const mockPortfolio = {
        id: "port-1",
        user_id: "user-1",
        title: "Software Engineer Portfolio",
        description: "Professional proof",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
      });

      const service = new PortfolioQueryService(mockSupabase);
      const res = await service.getPortfolio("user-1");

      expect(res.success).toBe(true);
      expect(res.data?.id).toBe("port-1");
      expect(res.data?.userId).toBe("user-1");
    });

    it("retrieves complete portfolio summary and stats", async () => {
      const mockPortfolio = {
        id: "port-1",
        user_id: "user-1",
        title: "Engineer Portfolio",
        description: "Evidence Record",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const mockSections = [
        { id: "sec-1", portfolio_id: "port-1", section_type: "projects", title: "Projects", display_order: 1 },
      ];
      const mockProjects = [
        { id: "proj-1", portfolio_id: "port-1", title: "Distributed DB", project_type: "project", status: "completed", created_at: new Date().toISOString() },
      ];

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
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockSections, error: null }),
          };
        }
        if (table === "portfolio_projects") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            order: vi.fn().mockResolvedValue({ data: mockProjects, error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockResolvedValue({ data: [], error: null }),
        };
      });

      const service = new PortfolioQueryService(mockSupabase);
      const res = await service.getPortfolioSummary("user-1");

      expect(res.success).toBe(true);
      expect(res.data?.portfolio.id).toBe("port-1");
      expect(res.data?.sections).toHaveLength(1);
      expect(res.data?.projects).toHaveLength(1);
      expect(res.data?.stats.totalProjects).toBe(1);
    });
  });

  describe("PortfolioProjectService", () => {
    it("creates project successfully", async () => {
      const mockPortfolio = { id: "port-1", user_id: "user-1", title: "Portfolio" };
      const mockProject = {
        id: "proj-1",
        portfolio_id: "port-1",
        title: "K-V Store Engine",
        description: "LSM-Tree storage",
        project_type: "project",
        status: "completed",
        created_at: new Date().toISOString(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "portfolios") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
          };
        }
        if (table === "portfolio_projects") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockProject, error: null }),
          };
        }
        return {};
      });

      const service = new PortfolioProjectService(mockSupabase);
      const res = await service.createProject("user-1", "K-V Store Engine", "LSM-Tree storage", "project", "completed");

      expect(res.success).toBe(true);
      expect(res.data?.title).toBe("K-V Store Engine");
      expect(res.data?.status).toBe("completed");
    });
  });

  describe("PortfolioArtifactService", () => {
    it("creates artifact record", async () => {
      const mockPortfolio = { id: "port-1", user_id: "user-1" };
      const mockArtifact = {
        id: "art-1",
        portfolio_id: "port-1",
        artifact_type: "exercise_evidence",
        source_domain: "exercise",
        source_id: "ex-1",
        title: "BST Solution",
        description: "Passed tests",
        created_at: new Date().toISOString(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "portfolios") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
          };
        }
        if (table === "portfolio_artifacts") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockArtifact, error: null }),
          };
        }
        return {};
      });

      const service = new PortfolioArtifactService(mockSupabase);
      const res = await service.createArtifact(
        "user-1",
        "exercise_evidence",
        "exercise",
        "BST Solution",
        "Passed tests",
        "ex-1"
      );

      expect(res.success).toBe(true);
      expect(res.data?.artifactType).toBe("exercise_evidence");
      expect(res.data?.sourceDomain).toBe("exercise");
    });
  });

  describe("PortfolioEvidenceService", () => {
    it("collects and logs evidence record", async () => {
      const mockPortfolio = { id: "port-1", user_id: "user-1" };
      const mockEvidence = {
        id: "ev-1",
        portfolio_id: "port-1",
        evidence_type: "gate_completed",
        evidence_reference: "gate://gate-level-1",
        competency_id: "comp-1",
        created_at: new Date().toISOString(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "portfolios") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
          };
        }
        if (table === "portfolio_evidence") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockEvidence, error: null }),
          };
        }
        return {};
      });

      const service = new PortfolioEvidenceService(mockSupabase);
      const res = await service.collectEvidence("user-1", "gate_completed", "gate://gate-level-1", "comp-1");

      expect(res.success).toBe(true);
      expect(res.data?.evidenceType).toBe("gate_completed");
      expect(res.data?.evidenceReference).toBe("gate://gate-level-1");
    });
  });

  describe("PortfolioCompetencyService & PortfolioAchievementService", () => {
    it("syncs competencies to portfolio", async () => {
      const mockPortfolio = { id: "port-1", user_id: "user-1" };
      mockFrom.mockImplementation((table: string) => {
        if (table === "portfolios") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
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
        return {};
      });

      const service = new PortfolioCompetencyService(mockSupabase);
      const res = await service.syncCompetencies("user-1", ["comp-1"]);

      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
    });

    it("syncs achievements to portfolio", async () => {
      const mockPortfolio = { id: "port-1", user_id: "user-1" };
      mockFrom.mockImplementation((table: string) => {
        if (table === "portfolios") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
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
        return {};
      });

      const service = new PortfolioAchievementService(mockSupabase);
      const res = await service.syncAchievements("user-1", ["ach-1"]);

      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
    });
  });

  describe("HiringSignalService", () => {
    it("generates and stores hiring signal", async () => {
      const mockPortfolio = { id: "port-1", user_id: "user-1" };
      const mockSignal = {
        id: "sig-1",
        portfolio_id: "port-1",
        signal_type: "competency_demonstrated",
        signal_strength: "strong",
        generated_at: new Date().toISOString(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "portfolios") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockPortfolio, error: null }),
          };
        }
        if (table === "portfolio_hiring_signals") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockSignal, error: null }),
          };
        }
        return {};
      });

      const service = new HiringSignalService(mockSupabase);
      const res = await service.generateSignal("user-1", "competency_demonstrated", "strong");

      expect(res.success).toBe(true);
      expect(res.data?.signalType).toBe("competency_demonstrated");
      expect(res.data?.signalStrength).toBe("strong");
    });
  });
});
