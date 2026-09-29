import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type {
  UserCompetencyProgress,
  CompetencyEvidence,
  CompetencyState,
  CompetencyEvidenceSource,
} from "../types";
import { logger } from "@/lib/logger";

export class CompetencyProgressRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Fetches all user competency progress records
   */
  public async getUserCompetencyProgressList(
    userId: string
  ): Promise<UserCompetencyProgress[]> {
    try {
      const { data, error } = await this.supabase
        .from("user_competency_progress")
        .select("*")
        .eq("user_id", userId);

      if (error) {
        logger.error("Failed to fetch user competency progress list", { userId, error });
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        competencyId: row.competency_id,
        state: row.state,
        score: row.score,
        evidenceCount: row.evidence_count,
        firstDemonstratedAt: row.first_demonstrated_at,
        lastEvaluatedAt: row.last_evaluated_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getUserCompetencyProgressList", err);
      return [];
    }
  }

  /**
   * Fetches user competency progress for a specific competency
   */
  public async getUserCompetencyProgress(
    userId: string,
    competencyId: string
  ): Promise<UserCompetencyProgress | null> {
    try {
      const { data, error } = await this.supabase
        .from("user_competency_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("competency_id", competencyId)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        competencyId: data.competency_id,
        state: data.state,
        score: data.score,
        evidenceCount: data.evidence_count,
        firstDemonstratedAt: data.first_demonstrated_at,
        lastEvaluatedAt: data.last_evaluated_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in getUserCompetencyProgress", err);
      return null;
    }
  }

  /**
   * Upserts a user competency progress record idempotently
   */
  public async upsertCompetencyProgress(
    userId: string,
    competencyId: string,
    state: CompetencyState,
    score: number,
    evidenceCount: number,
    firstDemonstratedAt?: string | null
  ): Promise<UserCompetencyProgress | null> {
    try {
      const now = new Date().toISOString();

      const { data, error } = await this.supabase
        .from("user_competency_progress")
        .upsert(
          {
            user_id: userId,
            competency_id: competencyId,
            state,
            score,
            evidence_count: evidenceCount,
            first_demonstrated_at: firstDemonstratedAt || now,
            last_evaluated_at: now,
            updated_at: now,
          },
          {
            onConflict: "user_id,competency_id",
          }
        )
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to upsert competency progress", { userId, competencyId, error });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        competencyId: data.competency_id,
        state: data.state,
        score: data.score,
        evidenceCount: data.evidence_count,
        firstDemonstratedAt: data.first_demonstrated_at,
        lastEvaluatedAt: data.last_evaluated_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    } catch (err) {
      logger.error("Unexpected error in upsertCompetencyProgress", err);
      return null;
    }
  }

  /**
   * Records a new piece of verified competency evidence
   */
  public async recordCompetencyEvidence(evidence: {
    userId: string;
    competencyId: string;
    sourceType: CompetencyEvidenceSource;
    sourceId: string;
    sourceTitle: string;
    summary: string;
  }): Promise<CompetencyEvidence | null> {
    try {
      const { data, error } = await this.supabase
        .from("competency_evidence")
        .upsert(
          {
            user_id: evidence.userId,
            competency_id: evidence.competencyId,
            source_type: evidence.sourceType,
            source_id: evidence.sourceId,
            source_title: evidence.sourceTitle,
            summary: evidence.summary,
          },
          {
            onConflict: "user_id,competency_id,source_id,source_type",
          }
        )
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to record competency evidence", { evidence, error });
        return null;
      }

      return {
        id: data.id,
        userId: data.user_id,
        competencyId: data.competency_id,
        sourceType: data.source_type,
        sourceId: data.source_id,
        sourceTitle: data.source_title,
        summary: data.summary,
        createdAt: data.created_at,
      };
    } catch (err) {
      logger.error("Unexpected error in recordCompetencyEvidence", err);
      return null;
    }
  }

  /**
   * Retrieves historical evidence records for a user & competency
   */
  public async getCompetencyEvidenceList(
    userId: string,
    competencyId: string
  ): Promise<CompetencyEvidence[]> {
    try {
      const { data, error } = await this.supabase
        .from("competency_evidence")
        .select("*")
        .eq("user_id", userId)
        .eq("competency_id", competencyId)
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch competency evidence list", { userId, competencyId, error });
        return [];
      }

      return (data || []).map((row) => ({
        id: row.id,
        userId: row.user_id,
        competencyId: row.competency_id,
        sourceType: row.source_type,
        sourceId: row.source_id,
        sourceTitle: row.source_title,
        summary: row.summary,
        createdAt: row.created_at,
      }));
    } catch (err) {
      logger.error("Unexpected error in getCompetencyEvidenceList", err);
      return [];
    }
  }
}
