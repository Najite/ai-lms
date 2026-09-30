import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { CapstoneEvidenceRepository } from "../repositories/capstone-evidence.repository";
import type { CapstoneEvidence, DomainResponse } from "../models";

export class CapstoneEvidenceService {
  private readonly evidenceRepo: CapstoneEvidenceRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.evidenceRepo = new CapstoneEvidenceRepository(supabase);
  }

  /**
   * Creates an auditable evidence record for a capstone
   */
  public async createEvidence(
    userId: string,
    capstoneId: string,
    evidenceType: string,
    evidenceReference: string
  ): Promise<DomainResponse<CapstoneEvidence>> {
    const evidence = await this.evidenceRepo.createEvidence(
      capstoneId,
      userId,
      evidenceType,
      evidenceReference
    );

    if (!evidence) {
      return { success: false, error: "Failed to record capstone evidence." };
    }

    return { success: true, data: evidence };
  }

  /**
   * Retrieves all evidence records for a user on a capstone
   */
  public async retrieveEvidence(
    capstoneId: string,
    userId: string
  ): Promise<DomainResponse<CapstoneEvidence[]>> {
    const evidenceList = await this.evidenceRepo.getEvidence(capstoneId, userId);
    return { success: true, data: evidenceList };
  }
}
