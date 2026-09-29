import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { CompetencyRepository } from "../repositories/competency-repository";
import { CompetencyProgressRepository } from "../repositories/competency-progress-repository";
import { CompetencyStateMachine } from "../state-machine/competency-state-machine";
import type {
  CompetencyCategory,
  CompetencyWithProgress,
  CompetencyDetail,
  UserCompetencyProgress,
  CompetencyResponse,
  Competency,
  CompetencyState,
} from "../types";
import type { UpdateCompetencyProgressInput } from "../schemas";
import { logger } from "@/lib/logger";

export class CompetencyService {
  private readonly compRepo: CompetencyRepository;
  private readonly progressRepo: CompetencyProgressRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.compRepo = new CompetencyRepository(supabase);
    this.progressRepo = new CompetencyProgressRepository(supabase);
  }

  /**
   * Retrieves all published competencies enriched with user progress if authenticated
   */
  public async getCompetencies(
    userId?: string
  ): Promise<CompetencyResponse<CompetencyWithProgress[]>> {
    try {
      const competencies = await this.compRepo.getPublishedCompetencies();
      const userProgress = userId
        ? await this.progressRepo.getUserCompetencyProgressList(userId)
        : [];

      const progressByComp = new Map<string, UserCompetencyProgress>();
      userProgress.forEach((p) => progressByComp.set(p.competencyId, p));

      const enriched: CompetencyWithProgress[] = competencies.map((comp) => ({
        ...comp,
        progress: progressByComp.get(comp.id) || null,
      }));

      return {
        success: true,
        data: enriched,
      };
    } catch (err) {
      logger.error("Failed to fetch competencies", err);
      return { success: false, error: "Failed to retrieve competencies." };
    }
  }

  /**
   * Retrieves all competency categories
   */
  public async getCategories(): Promise<CompetencyResponse<CompetencyCategory[]>> {
    try {
      const categories = await this.compRepo.getCategories();
      return {
        success: true,
        data: categories,
      };
    } catch (err) {
      logger.error("Failed to fetch competency categories", err);
      return { success: false, error: "Failed to retrieve categories." };
    }
  }

  /**
   * Retrieves full details for a single competency
   */
  public async getCompetencyDetail(
    query: { slug?: string; id?: string },
    userId?: string
  ): Promise<CompetencyResponse<CompetencyDetail>> {
    try {
      let comp = null;
      if (query.slug) {
        comp = await this.compRepo.getCompetencyBySlug(query.slug);
      } else if (query.id) {
        comp = await this.compRepo.getCompetencyById(query.id);
      }

      if (!comp) {
        return { success: false, error: "Competency not found." };
      }

      const progress = userId
        ? await this.progressRepo.getUserCompetencyProgress(userId, comp.id)
        : null;

      const evidence = userId
        ? await this.progressRepo.getCompetencyEvidenceList(userId, comp.id)
        : [];

      const relatedModules = await this.compRepo.getRelatedModulesForCompetency(comp.id);
      const relatedLessons = await this.compRepo.getRelatedLessonsForCompetency(comp.id);

      return {
        success: true,
        data: {
          ...comp,
          progress,
          evidence,
          relatedModules,
          relatedLessons,
        },
      };
    } catch (err) {
      logger.error("Failed to fetch competency detail", { query, err });
      return { success: false, error: "Failed to retrieve competency details." };
    }
  }

  /**
   * Retrieves competencies associated with a specific module
   */
  public async getCompetenciesByModuleId(
    moduleId: string,
    userId?: string
  ): Promise<
    CompetencyResponse<(Competency & { weight: number; progress?: UserCompetencyProgress | null })[]>
  > {
    try {
      const items = await this.compRepo.getCompetenciesByModuleId(moduleId);
      const userProgress = userId
        ? await this.progressRepo.getUserCompetencyProgressList(userId)
        : [];

      const progressMap = new Map<string, UserCompetencyProgress>();
      userProgress.forEach((p) => progressMap.set(p.competencyId, p));

      const enriched = items.map((item) => ({
        ...item.competency,
        weight: item.weight,
        progress: progressMap.get(item.competency.id) || null,
      }));

      return {
        success: true,
        data: enriched,
      };
    } catch (err) {
      logger.error("Failed to fetch competencies for module", { moduleId, err });
      return { success: false, error: "Failed to retrieve module competencies." };
    }
  }

  /**
   * Retrieves competencies associated with a specific lesson
   */
  public async getCompetenciesByLessonId(
    lessonId: string,
    userId?: string
  ): Promise<
    CompetencyResponse<
      (Competency & {
        targetState: CompetencyState;
        contributionPoints: number;
        progress?: UserCompetencyProgress | null;
      })[]
    >
  > {
    try {
      const items = await this.compRepo.getCompetenciesByLessonId(lessonId);
      const userProgress = userId
        ? await this.progressRepo.getUserCompetencyProgressList(userId)
        : [];

      const progressMap = new Map<string, UserCompetencyProgress>();
      userProgress.forEach((p) => progressMap.set(p.competencyId, p));

      const enriched = items.map((item) => ({
        ...item.competency,
        targetState: item.targetState,
        contributionPoints: item.contributionPoints,
        progress: progressMap.get(item.competency.id) || null,
      }));

      return {
        success: true,
        data: enriched,
      };
    } catch (err) {
      logger.error("Failed to fetch competencies for lesson", { lessonId, err });
      return { success: false, error: "Failed to retrieve lesson competencies." };
    }
  }

  /**
   * Retrieves all competency progress records for a user
   */
  public async getUserCompetencies(
    userId: string
  ): Promise<CompetencyResponse<UserCompetencyProgress[]>> {
    try {
      const progress = await this.progressRepo.getUserCompetencyProgressList(userId);
      return {
        success: true,
        data: progress,
      };
    } catch (err) {
      logger.error("Failed to fetch user competency progress list", { userId, err });
      return { success: false, error: "Failed to retrieve user competency progress." };
    }
  }

  /**
   * Updates user competency progress with verified evidence and state machine calculation
   */
  public async updateCompetencyProgress(
    userId: string,
    input: UpdateCompetencyProgressInput
  ): Promise<CompetencyResponse<UserCompetencyProgress>> {
    try {
      const comp = await this.compRepo.getCompetencyById(input.competencyId);
      if (!comp) {
        return { success: false, error: "Competency does not exist." };
      }

      // Record evidence item
      await this.progressRepo.recordCompetencyEvidence({
        userId,
        competencyId: input.competencyId,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        sourceTitle: input.sourceTitle,
        summary: input.summary,
      });

      // Get current progress
      const currentProgress = await this.progressRepo.getUserCompetencyProgress(
        userId,
        input.competencyId
      );

      const currentState: CompetencyState = currentProgress?.state || "not_started";
      const currentScore = currentProgress?.score || 0;
      const currentEvidenceCount = currentProgress?.evidenceCount || 0;

      // Compute progression via pure state machine
      const { nextState, nextScore } = CompetencyStateMachine.computeProgression(
        currentState,
        currentScore,
        input.contributionPoints,
        input.targetState
      );

      const updatedProgress = await this.progressRepo.upsertCompetencyProgress(
        userId,
        input.competencyId,
        nextState,
        nextScore,
        currentEvidenceCount + 1,
        currentProgress?.firstDemonstratedAt || new Date().toISOString()
      );

      if (!updatedProgress) {
        return { success: false, error: "Failed to update competency progress." };
      }

      logger.info("Competency progress updated", {
        userId,
        competencyCode: comp.code,
        previousState: currentState,
        newState: nextState,
        score: nextScore,
      });

      return {
        success: true,
        data: updatedProgress,
      };
    } catch (err) {
      logger.error("Unexpected error in updateCompetencyProgress", { userId, input, err });
      return { success: false, error: "Failed to update competency progress." };
    }
  }
}
