import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { GateValidationRepository } from "../repositories/gate-validation.repository";
import { GateAttemptRepository } from "../repositories/gate-attempt.repository";
import { GateProgressRepository } from "../repositories/gate-progress.repository";
import type { GateValidation, GateDomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class GateValidationService {
  private readonly validationRepo: GateValidationRepository;
  private readonly attemptRepo: GateAttemptRepository;
  private readonly progressRepo: GateProgressRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.validationRepo = new GateValidationRepository(supabase);
    this.attemptRepo = new GateAttemptRepository(supabase);
    this.progressRepo = new GateProgressRepository(supabase);
  }

  /**
   * Validates a gate attempt evaluation result and updates progress states
   */
  public async validateGate(
    userId: string,
    gateId: string,
    passed: boolean,
    score: number = passed ? 100 : 0,
    feedback: string = passed ? "All gate validation criteria satisfied." : "Validation criteria not fully met.",
    criteriaResults: Array<{ criterion: string; satisfied: boolean; details?: string }> = [],
    attemptId?: string | null
  ): Promise<GateDomainResponse<GateValidation>> {
    try {
      const validationResult = {
        passed,
        score,
        feedback,
        criteriaResults,
      };

      const validation = await this.validationRepo.createValidation(
        userId,
        gateId,
        validationResult,
        attemptId
      );

      if (!validation) {
        return { success: false, error: "Failed to persist gate validation record." };
      }

      // Update attempt status if attempt provided
      if (attemptId) {
        await this.attemptRepo.updateAttemptStatus(
          attemptId,
          passed ? "passed" : "failed",
          new Date().toISOString()
        );
      }

      // Update gate progress state
      if (passed) {
        await this.progressRepo.upsertProgress(userId, gateId, 95, "validated");
      } else {
        await this.progressRepo.upsertProgress(userId, gateId, 50, "in_progress");
      }

      logger.info("gate.validated", {
        userId,
        gateId,
        passed,
        score,
      });

      return { success: true, data: validation };
    } catch (err) {
      logger.error("Failed to validate gate", err);
      return { success: false, error: "Unable to validate gate." };
    }
  }
}
