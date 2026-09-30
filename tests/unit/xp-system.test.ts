import { describe, it, expect, vi, beforeEach } from "vitest";
import { XP_REWARDS } from "@/domains/achievement/models";
import { AchievementPolicy } from "@/domains/achievement/policies/achievement-policy";
import { XPTransactionService } from "@/domains/achievement/services/xp-transaction.service";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

describe("XP System & Ledger Architecture", () => {
  describe("XP Configuration & Rewards", () => {
    it("defines reward values for all 4 supported sources", () => {
      expect(XP_REWARDS.lesson_completion).toBe(50);
      expect(XP_REWARDS.exercise_completion).toBe(75);
      expect(XP_REWARDS.competency_progression).toBe(100);
      expect(XP_REWARDS.achievement).toBe(100);
    });
  });

  describe("AchievementPolicy", () => {
    it("allows learners to view their own XP and progress", () => {
      expect(AchievementPolicy.canViewXP({ id: "user-1", role: "learner" }, "user-1")).toBe(true);
      expect(AchievementPolicy.canViewXP({ id: "user-2", role: "learner" }, "user-1")).toBe(false);
      expect(AchievementPolicy.canViewXP({ id: "admin-1", role: "admin" }, "user-1")).toBe(true);
    });

    it("restricts catalog management to administrators", () => {
      expect(AchievementPolicy.canManageAchievements({ id: "user-1", role: "learner" })).toBe(false);
      expect(AchievementPolicy.canManageAchievements({ id: "admin-1", role: "admin" })).toBe(true);
    });
  });

  describe("XP Transaction Service & Idempotency", () => {
    let mockSupabase: SupabaseClient<Database>;
    let mockFrom: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockFrom = vi.fn();
      mockSupabase = {
        from: mockFrom,
      } as unknown as SupabaseClient<Database>;
    });

    it("rejects non-positive transaction amounts", async () => {
      const service = new XPTransactionService(mockSupabase);
      const res = await service.createTransaction("user-1", "lesson_completion", "les-1", 0);
      expect(res.success).toBe(false);
      expect(res.error).toContain("positive");
    });

    it("returns existing transaction without duplicate grant on idempotent call", async () => {
      const existingTx = {
        id: "tx-existing",
        user_id: "user-1",
        source_type: "lesson_completion",
        source_id: "les-01",
        amount: 50,
        created_at: new Date().toISOString(),
      };

      // Mock lookup returning existing
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: existingTx, error: null }),
      });

      const service = new XPTransactionService(mockSupabase);
      const res = await service.awardXP("user-1", "lesson_completion", "les-01");

      expect(res.success).toBe(true);
      expect(res.data?.isDuplicateGrant).toBe(true);
      expect(res.data?.transaction.id).toBe("tx-existing");
    });
  });
});
