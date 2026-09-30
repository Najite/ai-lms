import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { CapstoneReviewRepository } from "../repositories/capstone-review.repository";
import { CapstoneSubmissionRepository } from "../repositories/capstone-submission.repository";
import { UserCapstoneProgressRepository } from "../repositories/user-capstone-progress.repository";
import { CapstoneEvidenceRepository } from "../repositories/capstone-evidence.repository";
import { CapstonePolicy, PolicyUser } from "../policies/capstone-policy";
import type {
  CapstoneReview,
  CapstoneReviewType,
  CapstoneReviewResult,
  DomainResponse,
} from "../models";

export class CapstoneReviewService {
  private readonly reviewRepo: CapstoneReviewRepository;
  private readonly submissionRepo: CapstoneSubmissionRepository;
  private readonly progressRepo: UserCapstoneProgressRepository;
  private readonly evidenceRepo: CapstoneEvidenceRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.reviewRepo = new CapstoneReviewRepository(supabase);
    this.submissionRepo = new CapstoneSubmissionRepository(supabase);
    this.progressRepo = new UserCapstoneProgressRepository(supabase);
    this.evidenceRepo = new CapstoneEvidenceRepository(supabase);
  }

  /**
   * Evaluates a capstone submission and records review with feedback
   */
  public async reviewCapstone(
    reviewer: PolicyUser,
    capstoneId: string,
    userId: string,
    reviewType: CapstoneReviewType,
    reviewResult: CapstoneReviewResult,
    score?: number | null,
    feedbackText = "",
    submissionId?: string | null
  ): Promise<DomainResponse<CapstoneReview>> {
    // 1. RBAC check
    if (!CapstonePolicy.canReviewCapstone(reviewer)) {
      return {
        success: false,
        error: "Unauthorized. Only instructors and admins can review capstone submissions.",
      };
    }

    // 2. Record review
    const review = await this.reviewRepo.createReview(
      capstoneId,
      userId,
      reviewType,
      reviewResult,
      score,
      feedbackText,
      reviewer.id,
      submissionId
    );

    if (!review) {
      return { success: false, error: "Failed to record capstone review." };
    }

    // 3. Update submission and user progress based on review outcome
    if (submissionId) {
      const subStatus =
        reviewResult === "approved"
          ? "approved"
          : reviewResult === "changes_requested"
            ? "changes_requested"
            : "rejected";
      await this.submissionRepo.updateSubmissionStatus(submissionId, subStatus);
    }

    if (reviewResult === "approved") {
      await this.progressRepo.upsertProgress(userId, capstoneId, "approved", 90);
      await this.evidenceRepo.createEvidence(
        capstoneId,
        userId,
        "capstone_review_approval",
        `Review approval by ${reviewer.role} (Score: ${score || 100}%)`
      );
    } else {
      // Changes requested: move back to in_progress so learner can update deliverables
      await this.progressRepo.upsertProgress(userId, capstoneId, "in_progress", 50);
    }

    return { success: true, data: review };
  }

  /**
   * Retrieves all reviews for a user on a capstone
   */
  public async retrieveReviews(
    capstoneId: string,
    userId: string
  ): Promise<DomainResponse<CapstoneReview[]>> {
    const reviews = await this.reviewRepo.getReviews(capstoneId, userId);
    return { success: true, data: reviews };
  }

  /**
   * Retrieves the latest review for a user on a capstone
   */
  public async getLatestReview(
    capstoneId: string,
    userId: string
  ): Promise<DomainResponse<CapstoneReview | null>> {
    const review = await this.reviewRepo.getLatestReview(capstoneId, userId);
    return { success: true, data: review };
  }
}
