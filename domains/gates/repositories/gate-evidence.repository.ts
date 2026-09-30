import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { GateEvidence } from "../models";
import { logger } from "@/lib/logger";

type GateEvidenceRow = Database["public"]["Tables"]["gate_evidence"]["Row"];

export class GateEvidenceRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Creates an evidence record for a user and gate attempt
   */
  public async createEvidence(
    userId: string,
    gateId: string,
    evidenceType: string,
    evidenceReference: string,
    attemptId?: string | null,
    metadata: Record<string, unknown> = {}
  ): Promise<GateEvidence | null> {
    try {
      const { data, error } = await this.supabase
        .from("gate_evidence")
        .insert({
          user_id: userId,
          gate_id: gateId,
          attempt_id: attemptId || null,
          evidence_type: evidenceType,
          evidence_reference: evidenceReference,
          metadata: metadata as Database["public"]["Tables"]["gate_evidence"]["Insert"]["metadata"],
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create gate evidence", error);
        return null;
      }

      return this.mapEvidence(data);
    } catch (err) {
      logger.error("Unexpected error in createEvidence", err);
      return null;
    }
  }

  /**
   * Retrieves all evidence records for a user on a gate
   */
  public async getEvidence(
    userId: string,
    gateId?: string
  ): Promise<GateEvidence[]> {
    try {
      let query = this.supabase
        .from("gate_evidence")
        .select("*")
        .eq("user_id", userId);

      if (gateId) {
        query = query.eq("gate_id", gateId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch gate evidence", error);
        return [];
      }

      return (data || []).map((row) => this.mapEvidence(row));
    } catch (err) {
      logger.error("Unexpected error in getEvidence", err);
      return [];
    }
  }

  private mapEvidence(row: GateEvidenceRow): GateEvidence {
    return {
      id: row.id,
      userId: row.user_id,
      gateId: row.gate_id,
      attemptId: row.attempt_id,
      evidenceType: row.evidence_type,
      evidenceReference: row.evidence_reference,
      metadata: (row.metadata as Record<string, unknown>) || {},
      createdAt: row.created_at,
    };
  }
}
