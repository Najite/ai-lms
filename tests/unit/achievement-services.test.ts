import { describe, it, expect, vi, beforeEach } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { AchievementQueryService } from "@/domains/achievement/services/achievement-query.service";
import { AchievementProgressService } from "@/domains/achievement/services/achievement-progress.service";
import { AchievementAwardService } from "@/domains/achievement/services/achievement-award.service";
import { AchievementEvidenceService } from "@/domains/achievement/services/achievement-evidence.service";
import { XPBalanceService } from "@/domains/achievement/services/xp-balance.service";

describe("Achievement Domain Services", () => {
  let mockSupabase: SupabaseClient<Database>;
  let mockFrom: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFrom = vi.fn();
    mockSupabase = {
      from: mockFrom,
    } as unknown as SupabaseClient<Database>;
  });

  describe("AchievementQueryService", () => {
    it("retrieves categories successfully", async () => {
      const mockCategories = [
        {
          id: "cat-1",
          name: "Learning Milestones",
          slug: "learning-milestones",
          description: "Milestones",
          created_at: new Date().toISOString(),
        },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockCategories, error: null }),
      });

      const service = new AchievementQueryService(mockSupabase);
      const res = await service.getCategories();

      expect(res.success).toBe(true);
      expect(res.data).toHaveLength(1);
      expect(res.data?.[0]?.slug).toBe("learning-milestones");
    });

    it("retrieves a single achievement by ID", async () => {
      const mockAch = {
        id: "ach-1",
        category_id: "cat-1",
        name: "First Lesson",
        slug: "first-lesson",
        description: "Complete your first lesson",
        icon: "BookOpen",
        xp_reward: 50,
        is_active: true,
        created_at: new Date().toISOString(),
        achievement_requirements: [{ id: "req-1", achievement_id: "ach-1", requirement_type: "lessons_completed", requirement_value: 1 }],
      };

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockAch, error: null }),
      });

      const service = new AchievementQueryService(mockSupabase);
      const res = await service.getAchievementById("ach-1");

      expect(res.success).toBe(true);
      expect(res.data?.name).toBe("First Lesson");
      expect(res.data?.xpReward).toBe(50);
      expect(res.data?.requirements).toHaveLength(1);
    });

    it("returns error when achievement is not found", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      const service = new AchievementQueryService(mockSupabase);
      const res = await service.getAchievementById("non-existent");

      expect(res.success).toBe(false);
      expect(res.error).toContain("not found");
    });
  });

  describe("AchievementProgressService", () => {
    it("calculates progress percentage accurately", async () => {
      const mockAch = {
        id: "ach-streak",
        category_id: "cat-1",
        name: "7-Day Streak",
        slug: "7-day-streak",
        description: "Learn for 7 consecutive days",
        icon: "Flame",
        xp_reward: 100,
        is_active: true,
        created_at: new Date().toISOString(),
        achievement_requirements: [{ id: "req-1", achievement_id: "ach-streak", requirement_type: "consecutive_days", requirement_value: 7 }],
      };

      const mockProgress = {
        id: "prog-1",
        user_id: "user-1",
        achievement_id: "ach-streak",
        progress_value: 5,
        completed_at: null,
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "achievements") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockAch, error: null }),
          };
        }
        if (table === "achievement_progress") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockProgress, error: null }),
          };
        }
        return {};
      });

      const service = new AchievementProgressService(mockSupabase);
      const res = await service.calculateProgress("user-1", "ach-streak");

      expect(res.success).toBe(true);
      expect(res.data?.progressValue).toBe(5);
      expect(res.data?.targetValue).toBe(7);
      expect(res.data?.percentage).toBe(71); // 5/7 = 71.4% -> 71%
      expect(res.data?.isCompleted).toBe(false);
    });
  });

  describe("AchievementAwardService", () => {
    it("awards achievement, grants XP, and creates evidence", async () => {
      const mockAch = {
        id: "ach-100",
        category_id: "cat-1",
        name: "Master Architect",
        slug: "master-architect",
        description: "Master 10 competencies",
        icon: "Award",
        xp_reward: 250,
        is_active: true,
        created_at: new Date().toISOString(),
        achievement_requirements: [{ id: "req-1", achievement_id: "ach-100", requirement_type: "competencies_mastered", requirement_value: 10 }],
      };

      const mockAward = {
        id: "award-1",
        user_id: "user-1",
        achievement_id: "ach-100",
        awarded_at: new Date().toISOString(),
      };

      const mockTx = {
        id: "tx-1",
        user_id: "user-1",
        source_type: "achievement",
        source_id: "ach-100",
        amount: 250,
        created_at: new Date().toISOString(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "achievements") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockAch, error: null }),
          };
        }
        if (table === "achievement_awards") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }), // No existing award
            insert: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockAward, error: null }),
          };
        }
        if (table === "achievement_progress") {
          return {
            upsert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: "p1", user_id: "user-1", achievement_id: "ach-100", progress_value: 10, completed_at: new Date().toISOString() },
              error: null,
            }),
          };
        }
        if (table === "achievement_evidence") {
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { id: "ev-1", user_id: "user-1", achievement_id: "ach-100", evidence_type: "test", evidence_reference: "ref", created_at: new Date().toISOString() },
              error: null,
            }),
          };
        }
        if (table === "xp_transactions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            insert: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({ data: mockTx, error: null }),
          };
        }
        return {};
      });

      const service = new AchievementAwardService(mockSupabase);
      const res = await service.awardAchievement("user-1", "ach-100", "test", "ref");

      expect(res.success).toBe(true);
      expect(res.data?.award.achievementId).toBe("ach-100");
      expect(res.data?.xpGranted).toBe(250);
    });

    it("is idempotent: returns existing award without re-granting XP", async () => {
      const mockAch = {
        id: "ach-100",
        category_id: "cat-1",
        name: "Master Architect",
        slug: "master-architect",
        description: "Master 10 competencies",
        icon: "Award",
        xp_reward: 250,
        is_active: true,
        created_at: new Date().toISOString(),
        achievement_requirements: [],
      };

      const existingAward = {
        id: "award-existing",
        user_id: "user-1",
        achievement_id: "ach-100",
        awarded_at: new Date().toISOString(),
      };

      mockFrom.mockImplementation((table: string) => {
        if (table === "achievements") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockAch, error: null }),
          };
        }
        if (table === "achievement_awards") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: existingAward, error: null }),
          };
        }
        return {};
      });

      const service = new AchievementAwardService(mockSupabase);
      const res = await service.awardAchievement("user-1", "ach-100");

      expect(res.success).toBe(true);
      expect(res.data?.award.id).toBe("award-existing");
      expect(res.data?.xpGranted).toBe(0); // No XP re-granted
    });
  });

  describe("AchievementEvidenceService", () => {
    it("creates and retrieves evidence records", async () => {
      const mockEvidence = {
        id: "ev-1",
        user_id: "user-1",
        achievement_id: "ach-1",
        evidence_type: "exercise_completion",
        evidence_reference: "Completed Exercise 42 with score 100%",
        created_at: new Date().toISOString(),
      };

      mockFrom.mockReturnValue({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockEvidence, error: null }),
      });

      const service = new AchievementEvidenceService(mockSupabase);
      const res = await service.createEvidence(
        "user-1",
        "ach-1",
        "exercise_completion",
        "Completed Exercise 42 with score 100%"
      );

      expect(res.success).toBe(true);
      expect(res.data?.evidenceType).toBe("exercise_completion");
      expect(res.data?.evidenceReference).toContain("Exercise 42");
    });
  });

  describe("XPBalanceService", () => {
    it("returns default 0 balance when no balance record exists yet", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      });

      const service = new XPBalanceService(mockSupabase);
      const res = await service.getBalance("user-new");

      expect(res.success).toBe(true);
      expect(res.data?.totalXp).toBe(0);
      expect(res.data?.userId).toBe("user-new");
    });

    it("recalculates balance correctly from transaction ledger", async () => {
      const mockTransactions = [
        { amount: 50 },
        { amount: 75 },
        { amount: 100 },
      ];

      mockFrom.mockImplementation((table: string) => {
        if (table === "xp_transactions") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockResolvedValue({ data: mockTransactions, error: null }),
          };
        }
        if (table === "xp_balances") {
          return {
            upsert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValue({
              data: { user_id: "user-1", total_xp: 225, updated_at: new Date().toISOString() },
              error: null,
            }),
          };
        }
        return {};
      });

      const service = new XPBalanceService(mockSupabase);
      const res = await service.calculateBalance("user-1");

      expect(res.success).toBe(true);
      expect(res.data?.totalXp).toBe(225);
    });
  });
});
