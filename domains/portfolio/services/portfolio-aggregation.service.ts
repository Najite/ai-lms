import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioArtifactRepository } from "../repositories/portfolio-artifact.repository";
import { PortfolioEvidenceRepository } from "../repositories/portfolio-evidence.repository";
import { PortfolioCompetencyRepository } from "../repositories/portfolio-competency.repository";
import { PortfolioAchievementRepository } from "../repositories/portfolio-achievement.repository";
import { PortfolioHiringSignalRepository } from "../repositories/portfolio-hiring-signal.repository";
import type { DomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class PortfolioAggregationService {
  private readonly portfolioRepo: PortfolioRepository;
  private readonly artifactRepo: PortfolioArtifactRepository;
  private readonly evidenceRepo: PortfolioEvidenceRepository;
  private readonly competencyRepo: PortfolioCompetencyRepository;
  private readonly achievementRepo: PortfolioAchievementRepository;
  private readonly signalRepo: PortfolioHiringSignalRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.artifactRepo = new PortfolioArtifactRepository(supabase);
    this.evidenceRepo = new PortfolioEvidenceRepository(supabase);
    this.competencyRepo = new PortfolioCompetencyRepository(supabase);
    this.achievementRepo = new PortfolioAchievementRepository(supabase);
    this.signalRepo = new PortfolioHiringSignalRepository(supabase);
  }

  /**
   * Aggregates live domain progress (exercises, gates, achievements, competencies) into portfolio
   * Idempotent: checks for existing records before inserting
   */
  public async aggregateUserPortfolio(userId: string): Promise<
    DomainResponse<{
      aggregatedEvidenceCount: number;
      aggregatedArtifactCount: number;
      aggregatedCompetenciesCount: number;
      aggregatedAchievementsCount: number;
      aggregatedSignalsCount: number;
    }>
  > {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Failed to initialize user portfolio." };
      }

      // Fetch live cross-domain state concurrently
      const [
        completedExercisesRes,
        completedGatesRes,
        awardedAchievementsRes,
        competencyProgressRes,
        existingEvidence,
        existingArtifacts,
        existingSignals,
      ] = await Promise.all([
        this.supabase
          .from("exercise_completion")
          .select("exercise_id, score, exercises(title, slug)")
          .eq("user_id", userId)
          .eq("status", "passed"),
        this.supabase
          .from("gate_completion")
          .select("gate_id, competency_gates(name, slug, gate_level)")
          .eq("user_id", userId),
        this.supabase
          .from("achievement_awards")
          .select("achievement_id, achievements(name, slug, tier, xp_reward)")
          .eq("user_id", userId),
        this.supabase
          .from("user_competency_progress")
          .select("competency_id, state, score, competencies(code, title)")
          .eq("user_id", userId)
          .in("state", ["mastered", "reinforced"]),
        this.evidenceRepo.getEvidence(portfolio.id),
        this.artifactRepo.getArtifacts(portfolio.id),
        this.signalRepo.getSignals(portfolio.id),
      ]);

      let newEvidenceCount = 0;
      let newArtifactCount = 0;
      let newSignalsCount = 0;

      // 1. Aggregate Completed Exercises -> Evidence & Signals
      const completedExercises = (completedExercisesRes.data || []) as {
        exercise_id: string;
        score: number;
        exercises?: { title: string; slug: string } | null;
      }[];

      for (const ec of completedExercises) {
        const ref = `exercise://${ec.exercises?.slug || ec.exercise_id}`;
        const alreadyHasEvidence = existingEvidence.some((e) => e.evidenceReference === ref);

        if (!alreadyHasEvidence) {
          await this.evidenceRepo.createEvidence(
            portfolio.id,
            "exercise_completion",
            ref,
            null
          );
          newEvidenceCount++;
        }

        const signalExists = existingSignals.some(
          (s) => s.signalType === "exercise_completed"
        );
        if (!signalExists && newSignalsCount === 0) {
          await this.signalRepo.createSignal(portfolio.id, "exercise_completed", "high");
          newSignalsCount++;
        }
      }

      // 2. Aggregate Completed Gates -> Evidence, Artifacts & Signals
      const completedGates = (completedGatesRes.data || []) as {
        gate_id: string;
        competency_gates?: { name: string; slug: string; gate_level: number } | null;
      }[];

      for (const gc of completedGates) {
        const ref = `gate://${gc.competency_gates?.slug || gc.gate_id}`;
        const alreadyHasEvidence = existingEvidence.some((e) => e.evidenceReference === ref);

        if (!alreadyHasEvidence) {
          await this.evidenceRepo.createEvidence(portfolio.id, "gate_completion", ref, null);
          newEvidenceCount++;
        }

        const alreadyHasArtifact = existingArtifacts.some(
          (a) => a.sourceDomain === "gates" && a.sourceId === gc.gate_id
        );

        if (!alreadyHasArtifact) {
          await this.artifactRepo.createArtifact(
            portfolio.id,
            "gate_evidence",
            "gates",
            gc.competency_gates?.name || "Competency Gate Proof",
            `Permanent mastery verification for Level ${gc.competency_gates?.gate_level || 1} Gate.`,
            gc.gate_id
          );
          newArtifactCount++;
        }

        const signalExists = existingSignals.some((s) => s.signalType === "gate_completed");
        if (!signalExists) {
          await this.signalRepo.createSignal(portfolio.id, "gate_completed", "strong");
          newSignalsCount++;
        }
      }

      // 3. Aggregate Awarded Achievements -> Portfolio Achievements & Signals
      const awardedAchievements = (awardedAchievementsRes.data || []) as {
        achievement_id: string;
      }[];
      const achievementIds = awardedAchievements.map((a) => a.achievement_id);
      let syncedAchievementsCount = 0;

      if (achievementIds.length > 0) {
        const synced = await this.achievementRepo.syncAchievements(portfolio.id, achievementIds);
        syncedAchievementsCount = synced.length;

        const signalExists = existingSignals.some((s) => s.signalType === "achievement_earned");
        if (!signalExists) {
          await this.signalRepo.createSignal(portfolio.id, "achievement_earned", "medium");
          newSignalsCount++;
        }
      }

      // 4. Aggregate Mastered/Reinforced Competencies -> Portfolio Competencies & Signals
      const userCompetencies = (competencyProgressRes.data || []) as {
        competency_id: string;
        state: string;
      }[];
      const competencyIds = userCompetencies.map((c) => c.competency_id);
      let syncedCompetenciesCount = 0;

      if (competencyIds.length > 0) {
        const synced = await this.competencyRepo.syncCompetencies(portfolio.id, competencyIds);
        syncedCompetenciesCount = synced.length;

        const signalExists = existingSignals.some(
          (s) => s.signalType === "competency_demonstrated"
        );
        if (!signalExists) {
          await this.signalRepo.createSignal(portfolio.id, "competency_demonstrated", "high");
          newSignalsCount++;
        }
      }

      return {
        success: true,
        data: {
          aggregatedEvidenceCount: newEvidenceCount,
          aggregatedArtifactCount: newArtifactCount,
          aggregatedCompetenciesCount: syncedCompetenciesCount,
          aggregatedAchievementsCount: syncedAchievementsCount,
          aggregatedSignalsCount: newSignalsCount,
        },
      };
    } catch (err) {
      logger.error("Error aggregating user portfolio", err);
      return { success: false, error: "Unable to aggregate portfolio evidence." };
    }
  }
}
