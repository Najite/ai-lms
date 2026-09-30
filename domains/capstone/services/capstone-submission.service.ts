import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { CapstoneSubmissionRepository } from "../repositories/capstone-submission.repository";
import { CapstoneDeliverableRepository } from "../repositories/capstone-deliverable.repository";
import { UserCapstoneProgressRepository } from "../repositories/user-capstone-progress.repository";
import { CapstoneEvidenceRepository } from "../repositories/capstone-evidence.repository";
import { CapstonePolicy, PolicyUser } from "../policies/capstone-policy";
import type {
  CapstoneSubmission,
  CapstoneSubmissionDeliverableItem,
  DomainResponse,
} from "../models";

export class CapstoneSubmissionService {
  private readonly submissionRepo: CapstoneSubmissionRepository;
  private readonly deliverableRepo: CapstoneDeliverableRepository;
  private readonly progressRepo: UserCapstoneProgressRepository;
  private readonly evidenceRepo: CapstoneEvidenceRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.submissionRepo = new CapstoneSubmissionRepository(supabase);
    this.deliverableRepo = new CapstoneDeliverableRepository(supabase);
    this.progressRepo = new UserCapstoneProgressRepository(supabase);
    this.evidenceRepo = new CapstoneEvidenceRepository(supabase);
  }

  /**
   * Creates or updates a capstone submission
   */
  public async createSubmission(
    user: PolicyUser,
    capstoneId: string,
    deliverables: CapstoneSubmissionDeliverableItem[],
    repositoryUrl?: string | null,
    liveUrl?: string | null,
    documentationUrl?: string | null,
    notes?: string | null
  ): Promise<DomainResponse<CapstoneSubmission>> {
    // 1. Check progress status
    const currentProgress = await this.progressRepo.getProgress(user.id, capstoneId);
    const currentState = currentProgress?.status || "available";

    // 2. Validate authorization and FSM
    if (!CapstonePolicy.canSubmitCapstone(user, user.id, currentState)) {
      return {
        success: false,
        error: `Cannot submit capstone while in '${currentState}' state. Must be 'in_progress'.`,
      };
    }

    // 3. Verify all required deliverables are provided
    const requiredDeliverables = await this.deliverableRepo.getDeliverables(capstoneId);
    const submittedDeliverableIds = new Set(
      deliverables.filter((d) => (d.url && d.url.trim()) || (d.content && d.content.trim())).map((d) => d.deliverableId)
    );

    const missingRequired = requiredDeliverables.filter(
      (req) => req.required && !submittedDeliverableIds.has(req.id)
    );

    if (missingRequired.length > 0) {
      return {
        success: false,
        error: `Missing required deliverables: ${missingRequired.map((m) => m.title).join(", ")}.`,
      };
    }

    // 4. Create submission record
    const submission = await this.submissionRepo.createSubmission(
      capstoneId,
      user.id,
      deliverables,
      repositoryUrl,
      liveUrl,
      documentationUrl,
      notes
    );

    if (!submission) {
      return { success: false, error: "Failed to create capstone submission." };
    }

    // 5. Update progress to SUBMITTED (75% progress)
    await this.progressRepo.upsertProgress(user.id, capstoneId, "submitted", 75);

    // 6. Record evidence log
    if (repositoryUrl) {
      await this.evidenceRepo.createEvidence(
        capstoneId,
        user.id,
        "repository_submission",
        repositoryUrl
      );
    }

    return { success: true, data: submission };
  }

  /**
   * Retrieves the latest submission for a user on a capstone
   */
  public async retrieveSubmission(
    capstoneId: string,
    userId: string
  ): Promise<DomainResponse<CapstoneSubmission | null>> {
    const submission = await this.submissionRepo.getLatestSubmission(capstoneId, userId);
    return { success: true, data: submission };
  }

  /**
   * Retrieves all submissions for a user on a capstone
   */
  public async getSubmissions(
    capstoneId: string,
    userId: string
  ): Promise<DomainResponse<CapstoneSubmission[]>> {
    const submissions = await this.submissionRepo.getSubmissions(capstoneId, userId);
    return { success: true, data: submissions };
  }
}
