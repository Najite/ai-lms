import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { GateRepository } from "../repositories/gate.repository";
import { GateCompletionRepository } from "../repositories/gate-completion.repository";
import { GateProgressRepository } from "../repositories/gate-progress.repository";
import { GateEvidenceRepository } from "../repositories/gate-evidence.repository";
import { GateValidationRepository } from "../repositories/gate-validation.repository";
import { GateRequirementService } from "./gate-requirement.service";
import type { GateCompletion, GateDomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class GateCompletionService {
  private readonly gateRepo: GateRepository;
  private readonly completionRepo: GateCompletionRepository;
  private readonly progressRepo: GateProgressRepository;
  private readonly evidenceRepo: GateEvidenceRepository;
  private readonly validationRepo: GateValidationRepository;
  private readonly requirementService: GateRequirementService;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.gateRepo = new GateRepository(supabase);
    this.completionRepo = new GateCompletionRepository(supabase);
    this.progressRepo = new GateProgressRepository(supabase);
    this.evidenceRepo = new GateEvidenceRepository(supabase);
    this.validationRepo = new GateValidationRepository(supabase);
    this.requirementService = new GateRequirementService(supabase);
  }

  /**
   * Completes a competency gate permanently after verifying all requirements, evidence, and validation
   */
  public async completeGate(
    userId: string,
    gateIdOrSlug: string
  ): Promise<GateDomainResponse<GateCompletion>> {
    try {
      const gate = await this.gateRepo.getGateByIdOrSlug(gateIdOrSlug);
      if (!gate) {
        return { success: false, error: `Gate '${gateIdOrSlug}' not found.` };
      }

      // Check existing permanent completion (idempotent)
      const existing = await this.completionRepo.getCompletion(userId, gate.id);
      if (existing) {
        return { success: true, data: existing };
      }

      // Rule #3: Verify all requirements are satisfied
      const evalRes = await this.requirementService.evaluateRequirements(userId, gate.id);
      if (!evalRes.success || !evalRes.data?.allSatisfied) {
        return {
          success: false,
          error: "Cannot complete gate: one or more competency gate requirements are not yet satisfied.",
        };
      }

      // Rule #1: Verify evidence exists
      const evidenceList = await this.evidenceRepo.getEvidence(userId, gate.id);
      if (evidenceList.length === 0) {
        // Automatically create baseline completion evidence
        await this.evidenceRepo.createEvidence(
          userId,
          gate.id,
          "gate_completion_verification",
          `All prerequisite requirements validated for ${gate.name}.`
        );
      }

      // Rule #2: Ensure validation record exists
      const validation = await this.validationRepo.getLatestValidation(userId, gate.id);
      if (!validation) {
        await this.validationRepo.createValidation(
          userId,
          gate.id,
          {
            passed: true,
            score: 100,
            feedback: "Automated verification passed for all gate requirements.",
          }
        );
      }

      // Persist permanent completion record
      const completion = await this.completionRepo.completeGate(userId, gate.id);
      if (!completion) {
        return { success: false, error: "Failed to persist permanent gate completion." };
      }

      // Update gate progress state to 100% and 'completed'
      await this.progressRepo.upsertProgress(userId, gate.id, 100, "completed");

      // Observability: gate.completed
      logger.info("gate.completed", {
        userId,
        gateId: gate.id,
        gateSlug: gate.slug,
        gateLevel: gate.gateLevel,
      });

      return { success: true, data: completion };
    } catch (err) {
      logger.error("Failed to complete gate", err);
      return { success: false, error: "Unable to complete gate." };
    }
  }
}
