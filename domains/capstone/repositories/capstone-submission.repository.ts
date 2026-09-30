import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database, Json } from "@/lib/supabase/types";
import type {
  CapstoneSubmission,
  CapstoneSubmissionStatus,
  CapstoneSubmissionDeliverableItem,
} from "../models";
import { logger } from "@/lib/logger";

type SubmissionRow = Database["public"]["Tables"]["capstone_submissions"]["Row"];

export class CapstoneSubmissionRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Records a capstone submission
   */
  public async createSubmission(
    capstoneId: string,
    userId: string,
    deliverables: CapstoneSubmissionDeliverableItem[],
    repositoryUrl?: string | null,
    liveUrl?: string | null,
    documentationUrl?: string | null,
    notes?: string | null
  ): Promise<CapstoneSubmission | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_submissions")
        .insert({
          capstone_id: capstoneId,
          user_id: userId,
          deliverables_payload: deliverables as unknown as Json,
          repository_url: repositoryUrl || null,
          live_url: liveUrl || null,
          documentation_url: documentationUrl || null,
          notes: notes || null,
          status: "submitted",
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create capstone submission", error);
        return null;
      }

      logger.info("capstone.submitted", {
        capstoneId,
        userId,
        submissionId: data.id,
      });

      return this.mapSubmission(data);
    } catch (err) {
      logger.error("Unexpected error in createSubmission", err);
      return null;
    }
  }

  /**
   * Retrieves the latest submission for a user on a capstone
   */
  public async getLatestSubmission(
    capstoneId: string,
    userId: string
  ): Promise<CapstoneSubmission | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_submissions")
        .select("*")
        .eq("capstone_id", capstoneId)
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        if (error) logger.error("Failed to fetch latest capstone submission", error);
        return null;
      }

      return this.mapSubmission(data);
    } catch (err) {
      logger.error("Unexpected error in getLatestSubmission", err);
      return null;
    }
  }

  /**
   * Retrieves all submissions for a user on a capstone
   */
  public async getSubmissions(capstoneId: string, userId: string): Promise<CapstoneSubmission[]> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_submissions")
        .select("*")
        .eq("capstone_id", capstoneId)
        .eq("user_id", userId)
        .order("submitted_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch capstone submissions", error);
        return [];
      }

      return (data || []).map((row) => this.mapSubmission(row));
    } catch (err) {
      logger.error("Unexpected error in getSubmissions", err);
      return [];
    }
  }

  /**
   * Updates submission status
   */
  public async updateSubmissionStatus(
    submissionId: string,
    status: CapstoneSubmissionStatus
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from("capstone_submissions")
        .update({ status })
        .eq("id", submissionId);

      if (error) {
        logger.error("Failed to update capstone submission status", error);
        return false;
      }

      return true;
    } catch (err) {
      logger.error("Unexpected error in updateSubmissionStatus", err);
      return false;
    }
  }

  private mapSubmission(row: SubmissionRow): CapstoneSubmission {
    return {
      id: row.id,
      capstoneId: row.capstone_id,
      userId: row.user_id,
      deliverablesPayload: (row.deliverables_payload || []) as unknown as CapstoneSubmissionDeliverableItem[],
      repositoryUrl: row.repository_url,
      liveUrl: row.live_url,
      documentationUrl: row.documentation_url,
      notes: row.notes,
      submittedAt: row.submitted_at,
      status: row.status as CapstoneSubmissionStatus,
    };
  }
}
