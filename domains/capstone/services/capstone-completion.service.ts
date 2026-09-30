import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { CapstoneCompletionRepository } from "../repositories/capstone-completion.repository";
import { CapstoneDeliverableRepository } from "../repositories/capstone-deliverable.repository";
import { CapstoneSubmissionRepository } from "../repositories/capstone-submission.repository";
import { UserCapstoneProgressRepository } from "../repositories/user-capstone-progress.repository";
import { PortfolioIntegrationService } from "./portfolio-integration.service";
import type { CapstoneCompletion, DomainResponse } from "../models";

export class CapstoneCompletionService {
  private readonly completionRepo: CapstoneCompletionRepository;
  private readonly deliverableRepo: CapstoneDeliverableRepository;
  private readonly submissionRepo: CapstoneSubmissionRepository;
  private readonly progressRepo: UserCapstoneProgressRepository;
  private readonly portfolioIntegration: PortfolioIntegrationService;

  constructor(supabase: SupabaseClient<Database>) {
    this.completionRepo = new CapstoneCompletionRepository(supabase);
    this.deliverableRepo = new CapstoneDeliverableRepository(supabase);
    this.submissionRepo = new CapstoneSubmissionRepository(supabase);
    this.progressRepo = new UserCapstoneProgressRepository(supabase);
    this.portfolioIntegration = new PortfolioIntegrationService(supabase);
  }

  /**
   * Validates if all completion requirements are met
   */
  public async validateCompletion(
    userId: string,
    capstoneId: string
  ): Promise<
    DomainResponse<{
      isEligible: boolean;
      missingDeliverables: string[];
      hasApprovedSubmission: boolean;
    }>
  > {
    const requiredDeliverables = await this.deliverableRepo.getDeliverables(capstoneId);
    const submission = await this.submissionRepo.getLatestSubmission(capstoneId, userId);

    if (!submission) {
      return {
        success: true,
        data: {
          isEligible: false,
          missingDeliverables: requiredDeliverables.filter((d) => d.required).map((d) => d.title),
          hasApprovedSubmission: false,
        },
      };
    }

    const submittedDeliverableIds = new Set(
      submission.deliverablesPayload
        .filter((d) => (d.url && d.url.trim()) || (d.content && d.content.trim()))
        .map((d) => d.deliverableId)
    );

    const missingDeliverables = requiredDeliverables
      .filter((req) => req.required && !submittedDeliverableIds.has(req.id))
      .map((m) => m.title);

    const hasApprovedSubmission =
      submission.status === "approved" || submission.status === "submitted";
    const isEligible = missingDeliverables.length === 0 && hasApprovedSubmission;

    return {
      success: true,
      data: {
        isEligible,
        missingDeliverables,
        hasApprovedSubmission,
      },
    };
  }

  /**
   * Completes the capstone, seals progress to COMPLETED, and publishes portfolio artifacts
   */
  public async completeCapstone(
    userId: string,
    capstoneId: string
  ): Promise<DomainResponse<CapstoneCompletion>> {
    const validation = await this.validateCompletion(userId, capstoneId);
    if (!validation.success || !validation.data?.isEligible) {
      return {
        success: false,
        error: `Cannot complete capstone. Incomplete deliverables: ${validation.data?.missingDeliverables.join(", ") || "No valid submission"}`,
      };
    }

    // 1. Record completion idempotently
    const completion = await this.completionRepo.completeCapstone(capstoneId, userId);
    if (!completion) {
      return { success: false, error: "Failed to record capstone completion." };
    }

    // 2. Lock progress to COMPLETED (100% progress)
    await this.progressRepo.upsertProgress(userId, capstoneId, "completed", 100);

    // 3. Publish to Portfolio Domain
    await this.portfolioIntegration.publishCapstoneToPortfolio(userId, capstoneId);

    return { success: true, data: completion };
  }
}
