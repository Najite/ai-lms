import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { GateRepository } from "../repositories/gate.repository";
import { GateProgressRepository } from "../repositories/gate-progress.repository";
import { GateAttemptRepository } from "../repositories/gate-attempt.repository";
import { GateEvidenceRepository } from "../repositories/gate-evidence.repository";
import { GateValidationRepository } from "../repositories/gate-validation.repository";
import { GateCompletionRepository } from "../repositories/gate-completion.repository";
import { GateRequirementService } from "./gate-requirement.service";
import type {
  CompetencyGate,
  UserGateStatusView,
  GateStatus,
  GateDomainResponse,
} from "../models";
import type { GateQueryFiltersDTO } from "../dto";
import { logger } from "@/lib/logger";

export class GateQueryService {
  private readonly gateRepo: GateRepository;
  private readonly progressRepo: GateProgressRepository;
  private readonly attemptRepo: GateAttemptRepository;
  private readonly evidenceRepo: GateEvidenceRepository;
  private readonly validationRepo: GateValidationRepository;
  private readonly completionRepo: GateCompletionRepository;
  private readonly requirementService: GateRequirementService;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.gateRepo = new GateRepository(supabase);
    this.progressRepo = new GateProgressRepository(supabase);
    this.attemptRepo = new GateAttemptRepository(supabase);
    this.evidenceRepo = new GateEvidenceRepository(supabase);
    this.validationRepo = new GateValidationRepository(supabase);
    this.completionRepo = new GateCompletionRepository(supabase);
    this.requirementService = new GateRequirementService(supabase);
  }

  /**
   * Retrieves all competency gates
   */
  public async getGates(
    filters?: GateQueryFiltersDTO
  ): Promise<GateDomainResponse<CompetencyGate[]>> {
    try {
      const gates = await this.gateRepo.getGates(filters);
      return { success: true, data: gates };
    } catch (err) {
      logger.error("Failed to retrieve competency gates", err);
      return { success: false, error: "Unable to retrieve competency gates." };
    }
  }

  /**
   * Retrieves a single competency gate by ID or slug
   */
  public async getGateById(
    idOrSlug: string
  ): Promise<GateDomainResponse<CompetencyGate>> {
    try {
      const gate = await this.gateRepo.getGateByIdOrSlug(idOrSlug);
      if (!gate) {
        return { success: false, error: `Gate '${idOrSlug}' not found.` };
      }
      return { success: true, data: gate };
    } catch (err) {
      logger.error(`Failed to retrieve gate '${idOrSlug}'`, err);
      return { success: false, error: "Unable to retrieve gate." };
    }
  }

  /**
   * Retrieves full status, requirement evaluation, and evidence for a user on a gate
   */
  public async getUserGateStatus(
    userId: string,
    gateIdOrSlug: string
  ): Promise<GateDomainResponse<UserGateStatusView>> {
    try {
      const gate = await this.gateRepo.getGateByIdOrSlug(gateIdOrSlug);
      if (!gate) {
        return { success: false, error: `Gate '${gateIdOrSlug}' not found.` };
      }

      const [
        progress,
        completion,
        activeAttempt,
        latestValidation,
        evidenceList,
        reqEvalRes,
      ] = await Promise.all([
        this.progressRepo.getProgress(userId, gate.id),
        this.completionRepo.getCompletion(userId, gate.id),
        this.attemptRepo.getActiveAttempt(userId, gate.id),
        this.validationRepo.getLatestValidation(userId, gate.id),
        this.evidenceRepo.getEvidence(userId, gate.id),
        this.requirementService.evaluateRequirements(userId, gate.id),
      ]);

      const isCompleted = !!completion;
      const requirementsEvaluation = reqEvalRes.data?.evaluation || [];
      const allRequirementsSatisfied = reqEvalRes.data?.allSatisfied || false;

      let status: GateStatus = isCompleted
        ? "completed"
        : progress?.status || (gate.gateLevel === 1 ? "available" : "locked");

      // Check level prerequisite if locked
      if (!isCompleted && status === "locked" && gate.gateLevel > 1) {
        const allGates = await this.gateRepo.getGates();
        const prevGate = allGates.find((g) => g.gateLevel === gate.gateLevel - 1);
        if (prevGate) {
          const prevComp = await this.completionRepo.getCompletion(userId, prevGate.id);
          if (prevComp) {
            status = "available";
          }
        }
      }

      const progressPercentage = isCompleted
        ? 100
        : progress?.progressPercentage ||
          (allRequirementsSatisfied ? 60 : reqEvalRes.data?.totalCount ? Math.round((reqEvalRes.data.satisfiedCount / reqEvalRes.data.totalCount) * 60) : 0);

      const statusView: UserGateStatusView = {
        gate,
        status,
        progressPercentage,
        isUnlocked: status !== "locked",
        isCompleted,
        completedAt: completion?.completedAt || null,
        activeAttempt: activeAttempt || undefined,
        latestValidation: latestValidation || undefined,
        evidenceCount: evidenceList.length,
        requirementsEvaluation,
      };

      return { success: true, data: statusView };
    } catch (err) {
      logger.error("Failed to retrieve user gate status", err);
      return { success: false, error: "Unable to retrieve user gate status." };
    }
  }

  /**
   * Retrieves overview status for all active gates for a user
   */
  public async getUserGatesOverview(
    userId: string
  ): Promise<GateDomainResponse<UserGateStatusView[]>> {
    try {
      const allGates = await this.gateRepo.getGates({ isActive: true });
      const statusViews: UserGateStatusView[] = [];

      for (const gate of allGates) {
        const statusRes = await this.getUserGateStatus(userId, gate.id);
        if (statusRes.success && statusRes.data) {
          statusViews.push(statusRes.data);
        }
      }

      return { success: true, data: statusViews };
    } catch (err) {
      logger.error("Failed to retrieve user gates overview", err);
      return { success: false, error: "Unable to retrieve user gates overview." };
    }
  }
}
