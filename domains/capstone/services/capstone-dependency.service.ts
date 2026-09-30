import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { CapstoneDependencyRepository } from "../repositories/capstone-dependency.repository";
import { CapstoneCompletionRepository } from "../repositories/capstone-completion.repository";
import type { CapstoneDependency, DomainResponse } from "../models";

export class CapstoneDependencyService {
  private readonly dependencyRepo: CapstoneDependencyRepository;
  private readonly completionRepo: CapstoneCompletionRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.dependencyRepo = new CapstoneDependencyRepository(supabase);
    this.completionRepo = new CapstoneCompletionRepository(supabase);
  }

  /**
   * Retrieves all dependencies for a capstone
   */
  public async retrieveDependencies(
    capstoneId: string
  ): Promise<DomainResponse<CapstoneDependency[]>> {
    const dependencies = await this.dependencyRepo.getDependencies(capstoneId);
    return { success: true, data: dependencies };
  }

  /**
   * Checks if all prerequisite parent capstones have been completed by the user
   */
  public async checkPrerequisitesMet(
    capstoneId: string,
    userId: string
  ): Promise<{
    allMet: boolean;
    unmetDependencies: string[];
    dependencies: CapstoneDependency[];
  }> {
    const dependencies = await this.dependencyRepo.getDependencies(capstoneId);
    if (dependencies.length === 0) {
      return { allMet: true, unmetDependencies: [], dependencies: [] };
    }

    const userCompletions = await this.completionRepo.getUserCompletions(userId);
    const completedCapstoneIds = new Set(userCompletions.map((c) => c.capstoneId));

    const unmet: string[] = [];
    for (const dep of dependencies) {
      if (!completedCapstoneIds.has(dep.parentCapstoneId)) {
        unmet.push(dep.parentCapstone?.title || dep.parentCapstoneId);
      }
    }

    return {
      allMet: unmet.length === 0,
      unmetDependencies: unmet,
      dependencies,
    };
  }

  /**
   * Validates dependencies and returns standard domain response
   */
  public async validateDependencies(
    capstoneId: string,
    userId: string
  ): Promise<
    DomainResponse<{
      allMet: boolean;
      unmetDependencies: string[];
    }>
  > {
    const result = await this.checkPrerequisitesMet(capstoneId, userId);
    return {
      success: true,
      data: {
        allMet: result.allMet,
        unmetDependencies: result.unmetDependencies,
      },
    };
  }
}
