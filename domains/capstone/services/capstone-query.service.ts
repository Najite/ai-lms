import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { CapstoneRepository } from "../repositories/capstone.repository";
import { CapstoneSubmissionRepository } from "../repositories/capstone-submission.repository";
import { CapstoneReviewRepository } from "../repositories/capstone-review.repository";
import { CapstoneCompletionRepository } from "../repositories/capstone-completion.repository";
import { CapstoneEvidenceRepository } from "../repositories/capstone-evidence.repository";
import { UserCapstoneProgressRepository } from "../repositories/user-capstone-progress.repository";
import { CapstoneDependencyService } from "./capstone-dependency.service";
import type {
  Capstone,
  CapstoneDifficulty,
  UserCapstoneStatusView,
  DomainResponse,
  CapstoneState,
} from "../models";

export class CapstoneQueryService {
  private readonly capstoneRepo: CapstoneRepository;
  private readonly submissionRepo: CapstoneSubmissionRepository;
  private readonly reviewRepo: CapstoneReviewRepository;
  private readonly completionRepo: CapstoneCompletionRepository;
  private readonly evidenceRepo: CapstoneEvidenceRepository;
  private readonly progressRepo: UserCapstoneProgressRepository;
  private readonly dependencyService: CapstoneDependencyService;

  constructor(supabase: SupabaseClient<Database>) {
    this.capstoneRepo = new CapstoneRepository(supabase);
    this.submissionRepo = new CapstoneSubmissionRepository(supabase);
    this.reviewRepo = new CapstoneReviewRepository(supabase);
    this.completionRepo = new CapstoneCompletionRepository(supabase);
    this.evidenceRepo = new CapstoneEvidenceRepository(supabase);
    this.progressRepo = new UserCapstoneProgressRepository(supabase);
    this.dependencyService = new CapstoneDependencyService(supabase);
  }

  /**
   * Retrieves all capstones matching optional criteria
   */
  public async getCapstones(filters?: {
    typeSlug?: string;
    status?: string;
    difficulty?: CapstoneDifficulty;
  }): Promise<DomainResponse<Capstone[]>> {
    const capstones = await this.capstoneRepo.getCapstones(filters);
    return { success: true, data: capstones };
  }

  /**
   * Retrieves a single capstone by ID
   */
  public async getCapstoneById(id: string): Promise<DomainResponse<Capstone>> {
    const capstone = await this.capstoneRepo.getCapstoneById(id);
    if (!capstone) {
      return { success: false, error: `Capstone with ID '${id}' not found.` };
    }
    return { success: true, data: capstone };
  }

  /**
   * Retrieves a single capstone by slug
   */
  public async getCapstoneBySlug(slug: string): Promise<DomainResponse<Capstone>> {
    const capstone = await this.capstoneRepo.getCapstoneBySlug(slug);
    if (!capstone) {
      return { success: false, error: `Capstone with slug '${slug}' not found.` };
    }
    return { success: true, data: capstone };
  }

  /**
   * Retrieves capstones by type slug
   */
  public async getCapstonesByType(typeSlug: string): Promise<DomainResponse<Capstone[]>> {
    const capstones = await this.capstoneRepo.getCapstones({ typeSlug });
    return { success: true, data: capstones };
  }

  /**
   * Retrieves complete overview of all capstones and user progress statuses
   */
  public async getUserCapstonesOverview(
    userId: string
  ): Promise<DomainResponse<UserCapstoneStatusView[]>> {
    const capstones = await this.capstoneRepo.getCapstones({ status: "active" });
    const userProgressList = await this.progressRepo.getUserProgressList(userId);
    const userCompletions = await this.completionRepo.getUserCompletions(userId);

    const progressMap = new Map(userProgressList.map((p) => [p.capstoneId, p]));
    const completionMap = new Map(userCompletions.map((c) => [c.capstoneId, c]));

    const results: UserCapstoneStatusView[] = [];

    for (const capstone of capstones) {
      const completion = completionMap.get(capstone.id);
      const isCompleted = !!completion;

      const prereq = await this.dependencyService.checkPrerequisitesMet(capstone.id, userId);
      const isUnlocked = prereq.allMet;

      const progress = progressMap.get(capstone.id);
      let status: CapstoneState = "available";

      if (isCompleted) {
        status = "completed";
      } else if (!isUnlocked) {
        status = "locked";
      } else if (progress) {
        status = progress.status;
      }

      const progressPercentage = isCompleted
        ? 100
        : !isUnlocked
          ? 0
          : progress?.progressPercentage || 0;

      const [submission, latestReview, evidenceList] = await Promise.all([
        this.submissionRepo.getLatestSubmission(capstone.id, userId),
        this.reviewRepo.getLatestReview(capstone.id, userId),
        this.evidenceRepo.getEvidence(capstone.id, userId),
      ]);

      results.push({
        capstone,
        status,
        progressPercentage,
        isUnlocked,
        isCompleted,
        completedAt: completion?.completedAt || null,
        submission,
        latestReview,
        evidenceCount: evidenceList.length,
        unmetDependencies: prereq.unmetDependencies,
      });
    }

    return { success: true, data: results };
  }

  /**
   * Retrieves detailed status view for a specific capstone for a user
   */
  public async getUserCapstoneDetail(
    userId: string,
    capstoneIdOrSlug: string
  ): Promise<DomainResponse<UserCapstoneStatusView>> {
    const capstone =
      (await this.capstoneRepo.getCapstoneBySlug(capstoneIdOrSlug)) ||
      (await this.capstoneRepo.getCapstoneById(capstoneIdOrSlug));

    if (!capstone) {
      return { success: false, error: "Capstone not found." };
    }

    const prereq = await this.dependencyService.checkPrerequisitesMet(capstone.id, userId);
    const completion = await this.completionRepo.getCompletion(capstone.id, userId);
    const isCompleted = !!completion;
    const isUnlocked = prereq.allMet;

    const progress = await this.progressRepo.getProgress(userId, capstone.id);

    let status: CapstoneState = "available";
    if (isCompleted) {
      status = "completed";
    } else if (!isUnlocked) {
      status = "locked";
    } else if (progress) {
      status = progress.status;
    }

    const progressPercentage = isCompleted
      ? 100
      : !isUnlocked
        ? 0
        : progress?.progressPercentage || 0;

    const [submission, latestReview, evidenceList] = await Promise.all([
      this.submissionRepo.getLatestSubmission(capstone.id, userId),
      this.reviewRepo.getLatestReview(capstone.id, userId),
      this.evidenceRepo.getEvidence(capstone.id, userId),
    ]);

    return {
      success: true,
      data: {
        capstone,
        status,
        progressPercentage,
        isUnlocked,
        isCompleted,
        completedAt: completion?.completedAt || null,
        submission,
        latestReview,
        evidenceCount: evidenceList.length,
        unmetDependencies: prereq.unmetDependencies,
      },
    };
  }
}
