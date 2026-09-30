import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { GateRepository } from "../repositories/gate.repository";
import { GateEvidenceRepository } from "../repositories/gate-evidence.repository";
import type {
  CompetencyGate,
  GateRequirementType,
  GateDomainResponse,
} from "../models";
import { logger } from "@/lib/logger";

export interface RequirementEvaluationResult {
  type: GateRequirementType;
  required: Record<string, unknown>;
  satisfied: boolean;
  currentValue?: unknown;
  message?: string;
}

export class GateRequirementService {
  private readonly gateRepo: GateRepository;
  private readonly evidenceRepo: GateEvidenceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.gateRepo = new GateRepository(supabase);
    this.evidenceRepo = new GateEvidenceRepository(supabase);
  }

  /**
   * Evaluates all requirements for a gate against the user's actual progress data
   */
  public async evaluateRequirements(
    userId: string,
    gateIdOrSlug: string
  ): Promise<
    GateDomainResponse<{
      gate: CompetencyGate;
      allSatisfied: boolean;
      evaluation: RequirementEvaluationResult[];
      satisfiedCount: number;
      totalCount: number;
    }>
  > {
    try {
      const gate = await this.gateRepo.getGateByIdOrSlug(gateIdOrSlug);
      if (!gate) {
        return { success: false, error: `Gate '${gateIdOrSlug}' not found.` };
      }

      const requirements = gate.requirements || [];
      if (requirements.length === 0) {
        return {
          success: true,
          data: {
            gate,
            allSatisfied: true,
            evaluation: [],
            satisfiedCount: 0,
            totalCount: 0,
          },
        };
      }

      // Fetch user data across domains concurrently
      const [
        competencyRes,
        learningRes,
        exerciseRes,
        achievementRes,
        xpRes,
        evidenceList,
      ] = await Promise.all([
        this.supabase
          .from("user_competency_progress")
          .select("competency_id, state, score, competencies(code)")
          .eq("user_id", userId),
        this.supabase
          .from("user_learning_progress")
          .select("id, status")
          .eq("user_id", userId)
          .eq("status", "completed"),
        this.supabase
          .from("exercise_completion")
          .select("id, status, score")
          .eq("user_id", userId)
          .eq("status", "passed"),
        this.supabase
          .from("achievement_awards")
          .select("id, achievement_id")
          .eq("user_id", userId),
        this.supabase
          .from("xp_balances")
          .select("total_xp")
          .eq("user_id", userId)
          .maybeSingle(),
        this.evidenceRepo.getEvidence(userId, gate.id),
      ]);

      type CompetencyProgressRow = {
        competency_id: string;
        state: string;
        score: number | null;
        competencies: { code: string } | null;
      };

      const userCompetencies = (competencyRes.data || []) as unknown as CompetencyProgressRow[];
      const completedLessonsCount = (learningRes.data || []).length;
      const passedExercisesCount = (exerciseRes.data || []).length;
      const earnedAchievementsCount = (achievementRes.data || []).length;
      const totalXp = xpRes.data ? xpRes.data.total_xp : 0;

      const evaluation: RequirementEvaluationResult[] = [];

      for (const req of requirements) {
        const val = req.requirementValue || {};

        switch (req.requirementType) {
          case "competency": {
            const requiredCodes: string[] = Array.isArray(val.competency_codes)
              ? (val.competency_codes as string[])
              : [];
            const minState = (val.minimum_state as string) || "mastered";

            // State precedence: mastered > reinforced > practicing > introduced > not_started
            const stateRank: Record<string, number> = {
              mastered: 4,
              reinforced: 3,
              practicing: 2,
              introduced: 1,
              not_started: 0,
            };

            const targetRank = stateRank[minState] ?? 4;

            let compSatisfied = true;
            const checkedCodes: string[] = [];

            for (const code of requiredCodes) {
              const userComp = userCompetencies.find(
                (c) => c.competencies?.code === code
              );
              const userRank = userComp ? stateRank[userComp.state] ?? 0 : 0;
              if (userRank >= targetRank) {
                checkedCodes.push(code);
              } else {
                compSatisfied = false;
              }
            }

            // Also check gate_competencies if no specific codes defined
            if (requiredCodes.length === 0 && gate.competencies && gate.competencies.length > 0) {
              for (const gc of gate.competencies) {
                const userComp = userCompetencies.find(
                  (c) => c.competency_id === gc.competencyId
                );
                const userRank = userComp ? stateRank[userComp.state] ?? 0 : 0;
                if (userRank >= targetRank) {
                  if (gc.competency?.code) checkedCodes.push(gc.competency.code);
                } else {
                  compSatisfied = false;
                }
              }
            }

            evaluation.push({
              type: "competency",
              required: val,
              satisfied: compSatisfied,
              currentValue: checkedCodes,
              message: compSatisfied
                ? "All required competencies validated."
                : `Requires ${requiredCodes.join(", ") || "mapped competencies"} at '${minState}' level.`,
            });
            break;
          }

          case "lesson": {
            const targetCount = Number(val.count || 1);
            const satisfied = completedLessonsCount >= targetCount;
            evaluation.push({
              type: "lesson",
              required: val,
              satisfied,
              currentValue: completedLessonsCount,
              message: `${completedLessonsCount}/${targetCount} lessons completed.`,
            });
            break;
          }

          case "exercise": {
            const targetCount = Number(val.count || 1);
            const satisfied = passedExercisesCount >= targetCount;
            evaluation.push({
              type: "exercise",
              required: val,
              satisfied,
              currentValue: passedExercisesCount,
              message: `${passedExercisesCount}/${targetCount} exercises passed.`,
            });
            break;
          }

          case "achievement": {
            const targetCount = Number(val.count || 1);
            const satisfied = earnedAchievementsCount >= targetCount;
            evaluation.push({
              type: "achievement",
              required: val,
              satisfied,
              currentValue: earnedAchievementsCount,
              message: `${earnedAchievementsCount}/${targetCount} achievements unlocked.`,
            });
            break;
          }

          case "xp": {
            const minXp = Number(val.min_xp || 0);
            const satisfied = totalXp >= minXp;
            evaluation.push({
              type: "xp",
              required: val,
              satisfied,
              currentValue: totalXp,
              message: `${totalXp}/${minXp} XP accumulated.`,
            });
            break;
          }

          case "artifact": {
            const targetCount = Number(val.count || 1);
            const satisfied = evidenceList.length >= targetCount;
            evaluation.push({
              type: "artifact",
              required: val,
              satisfied,
              currentValue: evidenceList.length,
              message: `${evidenceList.length}/${targetCount} evidence artifacts submitted.`,
            });
            break;
          }

          default: {
            evaluation.push({
              type: req.requirementType,
              required: val,
              satisfied: true,
              message: "Custom requirement satisfied.",
            });
          }
        }
      }

      const satisfiedCount = evaluation.filter((e) => e.satisfied).length;
      const totalCount = evaluation.length;
      const allSatisfied = totalCount > 0 && satisfiedCount === totalCount;

      return {
        success: true,
        data: {
          gate,
          allSatisfied,
          evaluation,
          satisfiedCount,
          totalCount,
        },
      };
    } catch (err) {
      logger.error("Failed to evaluate gate requirements", err);
      return { success: false, error: "Unable to evaluate gate requirements." };
    }
  }
}
