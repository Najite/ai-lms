import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { GateRepository } from "../repositories/gate.repository";
import { GateProgressRepository } from "../repositories/gate-progress.repository";
import { GateAttemptRepository } from "../repositories/gate-attempt.repository";
import { GateCompletionRepository } from "../repositories/gate-completion.repository";
import { GateValidationRepository } from "../repositories/gate-validation.repository";
import { GateRequirementService } from "./gate-requirement.service";
import { GatePolicy } from "../policies/gate-policy";
import type {
  UserGateProgress,
  GateStatus,
  GateDomainResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class GateProgressService {
  private readonly gateRepo: GateRepository;
  private readonly progressRepo: GateProgressRepository;
  private readonly attemptRepo: GateAttemptRepository;
  private readonly completionRepo: GateCompletionRepository;
  private readonly validationRepo: GateValidationRepository;
  private readonly requirementService: GateRequirementService;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.gateRepo = new GateRepository(supabase);
    this.progressRepo = new GateProgressRepository(supabase);
    this.attemptRepo = new GateAttemptRepository(supabase);
    this.completionRepo = new GateCompletionRepository(supabase);
    this.validationRepo = new GateValidationRepository(supabase);
    this.requirementService = new GateRequirementService(supabase);
  }

  /**
   * Calculates dynamic gate progress and derives next state
   */
  public async calculateProgress(
    userId: string,
    gateIdOrSlug: string
  ): Promise<
    GateDomainResponse<{
      gateId: string;
      progressPercentage: number;
      status: GateStatus;
      isCompleted: boolean;
      allRequirementsMet: boolean;
    }>
  > {
    try {
      const gate = await this.gateRepo.getGateByIdOrSlug(gateIdOrSlug);
      if (!gate) {
        return { success: false, error: "Gate not found." };
      }

      // Check permanent completion first
      const completion = await this.completionRepo.getCompletion(userId, gate.id);
      if (completion) {
        return {
          success: true,
          data: {
            gateId: gate.id,
            progressPercentage: 100,
            status: "completed",
            isCompleted: true,
            allRequirementsMet: true,
          },
        };
      }

      // Evaluate requirements
      const evalRes = await this.requirementService.evaluateRequirements(userId, gate.id);
      const totalReqs = evalRes.data?.totalCount || 0;
      const satisfiedReqs = evalRes.data?.satisfiedCount || 0;
      const allRequirementsMet = evalRes.data?.allSatisfied ?? false;

      // Base percentage from requirements
      const reqPercentage = totalReqs > 0 ? (satisfiedReqs / totalReqs) * 60 : 60; // 0-60% from prerequisites

      // Check active attempts and validations
      const [activeAttempt, latestValidation, currentProgress] = await Promise.all([
        this.attemptRepo.getActiveAttempt(userId, gate.id),
        this.validationRepo.getLatestValidation(userId, gate.id),
        this.progressRepo.getProgress(userId, gate.id),
      ]);

      let status: GateStatus = currentProgress?.status || "locked";
      let progressPercentage = reqPercentage;

      // Check prerequisite gate completion for level > 1
      if (gate.gateLevel > 1) {
        const allGates = await this.gateRepo.getGates();
        const prevGate = allGates.find((g) => g.gateLevel === gate.gateLevel - 1);
        if (prevGate) {
          const prevCompletion = await this.completionRepo.getCompletion(userId, prevGate.id);
          if (!prevCompletion) {
            status = "locked";
            progressPercentage = Math.min(progressPercentage, 30);
          } else if (status === "locked") {
            status = "available";
          }
        }
      } else if (status === "locked") {
        status = "available";
      }

      if (activeAttempt) {
        if (activeAttempt.status === "in_progress") {
          status = "in_progress";
          progressPercentage = Math.max(progressPercentage, 70);
        } else if (activeAttempt.status === "submitted") {
          status = "under_review";
          progressPercentage = Math.max(progressPercentage, 85);
        }
      }

      if (latestValidation && latestValidation.validationResult.passed) {
        status = "validated";
        progressPercentage = 95;
      }

      // Upsert progress cache
      await this.progressRepo.upsertProgress(
        userId,
        gate.id,
        progressPercentage,
        status
      );

      return {
        success: true,
        data: {
          gateId: gate.id,
          progressPercentage: Math.round(progressPercentage),
          status,
          isCompleted: false,
          allRequirementsMet,
        },
      };
    } catch (err) {
      logger.error("Failed to calculate gate progress", err);
      return { success: false, error: "Unable to calculate gate progress." };
    }
  }

  /**
   * Explicitly updates user progress and transitions gate state if allowed
   */
  public async updateProgress(
    userId: string,
    gateId: string,
    progressPercentage: number,
    nextStatus?: GateStatus
  ): Promise<GateDomainResponse<UserGateProgress>> {
    try {
      const current = await this.progressRepo.getProgress(userId, gateId);
      const currentStatus: GateStatus = current?.status || "locked";
      const targetStatus: GateStatus = nextStatus || currentStatus;

      // Enforce state transition rules
      if (nextStatus && nextStatus !== currentStatus) {
        const isAllowed = GatePolicy.canTransition(currentStatus, nextStatus);
        if (!isAllowed) {
          return {
            success: false,
            error: `Invalid state transition from '${currentStatus}' to '${nextStatus}'.`,
          };
        }
      }

      const updated = await this.progressRepo.upsertProgress(
        userId,
        gateId,
        progressPercentage,
        targetStatus
      );

      if (!updated) {
        return { success: false, error: "Failed to persist gate progress." };
      }

      return { success: true, data: updated };
    } catch (err) {
      logger.error("Failed to update gate progress", err);
      return { success: false, error: "Unable to update gate progress." };
    }
  }
}
