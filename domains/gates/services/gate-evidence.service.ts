import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { GateEvidenceRepository } from "../repositories/gate-evidence.repository";
import type { GateEvidence, GateDomainResponse } from "../models";
import { logger } from "@/lib/logger";

export class GateEvidenceService {
  private readonly evidenceRepo: GateEvidenceRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.evidenceRepo = new GateEvidenceRepository(supabase);
  }

  /**
   * Collects and records an auditable evidence artifact for a gate attempt
   */
  public async collectEvidence(
    userId: string,
    gateId: string,
    evidenceType: string,
    evidenceReference: string,
    attemptId?: string | null,
    metadata: Record<string, unknown> = {}
  ): Promise<GateDomainResponse<GateEvidence>> {
    try {
      const evidence = await this.evidenceRepo.createEvidence(
        userId,
        gateId,
        evidenceType,
        evidenceReference,
        attemptId,
        metadata
      );

      if (!evidence) {
        return { success: false, error: "Failed to persist gate evidence record." };
      }

      logger.info("gate.evidence.collected", {
        userId,
        gateId,
        attemptId,
        evidenceType,
      });

      return { success: true, data: evidence };
    } catch (err) {
      logger.error("Failed to collect gate evidence", err);
      return { success: false, error: "Unable to collect gate evidence." };
    }
  }

  /**
   * Retrieves all evidence records for a user on a gate
   */
  public async retrieveEvidence(
    userId: string,
    gateId?: string
  ): Promise<GateDomainResponse<GateEvidence[]>> {
    try {
      const evidenceList = await this.evidenceRepo.getEvidence(userId, gateId);
      return { success: true, data: evidenceList };
    } catch (err) {
      logger.error("Failed to retrieve gate evidence", err);
      return { success: false, error: "Unable to retrieve gate evidence." };
    }
  }
}
