import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { UserCapstoneProgressRepository } from "../repositories/user-capstone-progress.repository";
import { CapstoneDeliverableRepository } from "../repositories/capstone-deliverable.repository";
import { CapstoneSubmissionRepository } from "../repositories/capstone-submission.repository";
import { CapstoneCompletionRepository } from "../repositories/capstone-completion.repository";
import { CapstoneDependencyService } from "./capstone-dependency.service";
import { CapstonePolicy, PolicyUser } from "../policies/capstone-policy";
import type { UserCapstoneProgress, DomainResponse } from "../models";

export class CapstoneProgressService {
  private readonly progressRepo: UserCapstoneProgressRepository;
  private readonly deliverableRepo: CapstoneDeliverableRepository;
  private readonly submissionRepo: CapstoneSubmissionRepository;
  private readonly completionRepo: CapstoneCompletionRepository;
  private readonly dependencyService: CapstoneDependencyService;

  constructor(supabase: SupabaseClient<Database>) {
    this.progressRepo = new UserCapstoneProgressRepository(supabase);
    this.deliverableRepo = new CapstoneDeliverableRepository(supabase);
    this.submissionRepo = new CapstoneSubmissionRepository(supabase);
    this.completionRepo = new CapstoneCompletionRepository(supabase);
    this.dependencyService = new CapstoneDependencyService(supabase);
  }

  /**
   * Starts a capstone attempt
   */
  public async startCapstone(
    user: PolicyUser,
    capstoneId: string
  ): Promise<DomainResponse<UserCapstoneProgress>> {
    // 1. Check prerequisites
    const prereq = await this.dependencyService.checkPrerequisitesMet(capstoneId, user.id);
    if (!prereq.allMet) {
      return {
        success: false,
        error: `Prerequisites not met: ${prereq.unmetDependencies.join(", ")}.`,
      };
    }

    // 2. Check current state
    const currentProgress = await this.progressRepo.getProgress(user.id, capstoneId);
    const currentState = currentProgress?.status || "available";

    // 3. Authorization & policy
    if (!CapstonePolicy.canStartCapstone(user, user.id, currentState, prereq.allMet)) {
      return {
        success: false,
        error: `Cannot start capstone from '${currentState}' state.`,
      };
    }

    // 4. Update progress to IN_PROGRESS (25% initial progress)
    const progress = await this.progressRepo.upsertProgress(
      user.id,
      capstoneId,
      "in_progress",
      25,
      new Date().toISOString()
    );

    if (!progress) {
      return { success: false, error: "Failed to initialize capstone progress." };
    }

    return { success: true, data: progress };
  }

  /**
   * Retrieves user progress for a capstone
   */
  public async retrieveProgress(
    userId: string,
    capstoneId: string
  ): Promise<DomainResponse<UserCapstoneProgress | null>> {
    const progress = await this.progressRepo.getProgress(userId, capstoneId);
    return { success: true, data: progress };
  }

  /**
   * Recalculates progress percentage
   */
  public async calculateProgress(
    userId: string,
    capstoneId: string
  ): Promise<
    DomainResponse<{
      progressPercentage: number;
      isCompleted: boolean;
      deliverablesCompletedCount: number;
      totalDeliverablesCount: number;
    }>
  > {
    const isCompleted = await this.completionRepo.isCompleted(capstoneId, userId);
    if (isCompleted) {
      return {
        success: true,
        data: {
          progressPercentage: 100,
          isCompleted: true,
          deliverablesCompletedCount: 1,
          totalDeliverablesCount: 1,
        },
      };
    }

    const deliverables = await this.deliverableRepo.getDeliverables(capstoneId);
    const submission = await this.submissionRepo.getLatestSubmission(capstoneId, userId);

    let submittedCount = 0;
    if (submission) {
      const submittedIds = new Set(
        submission.deliverablesPayload
          .filter((d) => (d.url && d.url.trim()) || (d.content && d.content.trim()))
          .map((d) => d.deliverableId)
      );
      submittedCount = deliverables.filter((d) => submittedIds.has(d.id)).length;
    }

    let percentage = 0;
    if (deliverables.length > 0) {
      percentage = Math.round((submittedCount / deliverables.length) * 80);
    }
    if (submission?.status === "approved") {
      percentage = 90;
    }

    return {
      success: true,
      data: {
        progressPercentage: percentage,
        isCompleted: false,
        deliverablesCompletedCount: submittedCount,
        totalDeliverablesCount: deliverables.length,
      },
    };
  }
}
