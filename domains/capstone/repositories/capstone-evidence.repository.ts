import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { CapstoneEvidence } from "../models";
import { logger } from "@/lib/logger";

type EvidenceRow = Database["public"]["Tables"]["capstone_evidence"]["Row"];

export class CapstoneEvidenceRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Records capstone evidence
   */
  public async createEvidence(
    capstoneId: string,
    userId: string,
    evidenceType: string,
    evidenceReference: string
  ): Promise<CapstoneEvidence | null> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_evidence")
        .insert({
          capstone_id: capstoneId,
          user_id: userId,
          evidence_type: evidenceType,
          evidence_reference: evidenceReference,
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create capstone evidence", error);
        return null;
      }

      logger.info("capstone.evidence.created", {
        capstoneId,
        userId,
        evidenceId: data.id,
      });

      return this.mapEvidence(data);
    } catch (err) {
      logger.error("Unexpected error in createEvidence", err);
      return null;
    }
  }

  /**
   * Retrieves all evidence for a user on a capstone
   */
  public async getEvidence(capstoneId: string, userId: string): Promise<CapstoneEvidence[]> {
    try {
      const { data, error } = await this.supabase
        .from("capstone_evidence")
        .select("*")
        .eq("capstone_id", capstoneId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch capstone evidence", error);
        return [];
      }

      return (data || []).map((row) => this.mapEvidence(row));
    } catch (err) {
      logger.error("Unexpected error in getEvidence", err);
      return [];
    }
  }

  private mapEvidence(row: EvidenceRow): CapstoneEvidence {
    return {
      id: row.id,
      capstoneId: row.capstone_id,
      userId: row.user_id,
      evidenceType: row.evidence_type,
      evidenceReference: row.evidence_reference,
      createdAt: row.created_at,
    };
  }
}
