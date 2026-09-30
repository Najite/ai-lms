"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PortfolioQueryService } from "@/domains/portfolio/services/portfolio-query.service";
import { PortfolioProjectService } from "@/domains/portfolio/services/portfolio-project.service";
import { PortfolioArtifactService } from "@/domains/portfolio/services/portfolio-artifact.service";
import { PortfolioAggregationService } from "@/domains/portfolio/services/portfolio-aggregation.service";
import {
  CreatePortfolioProjectSchema,
  CreatePortfolioArtifactSchema,
} from "@/domains/portfolio/validators";
import type {
  PortfolioSummaryView,
  PortfolioProject,
  PortfolioArtifact,
  DomainResponse,
} from "@/domains/portfolio/models";

/**
 * Server Action to fetch aggregated portfolio summary
 */
export async function getPortfolioSummaryAction(): Promise<DomainResponse<PortfolioSummaryView>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const aggregationService = new PortfolioAggregationService(supabase);
    await aggregationService.aggregateUserPortfolio(user.id);

    const queryService = new PortfolioQueryService(supabase);
    return await queryService.getPortfolioSummary(user.id);
  } catch {
    return { success: false, error: "Failed to load portfolio summary." };
  }
}

/**
 * Server Action to create a custom project in the portfolio
 */
export async function createPortfolioProjectAction(payload: {
  title: string;
  description?: string | null;
  projectType?: string;
  status?: "in_progress" | "completed" | "archived";
}): Promise<DomainResponse<PortfolioProject>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const queryService = new PortfolioQueryService(supabase);
    const portfolioRes = await queryService.getPortfolio(user.id);
    if (!portfolioRes.success || !portfolioRes.data) {
      return { success: false, error: "Portfolio not found." };
    }

    const parsed = CreatePortfolioProjectSchema.safeParse({
      portfolioId: portfolioRes.data.id,
      ...payload,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const projectService = new PortfolioProjectService(supabase);
    const result = await projectService.createProject(
      user.id,
      parsed.data.title,
      parsed.data.description,
      parsed.data.projectType,
      parsed.data.status
    );

    if (result.success) {
      revalidatePath("/portfolio");
    }

    return result;
  } catch {
    return { success: false, error: "Failed to create portfolio project." };
  }
}

/**
 * Server Action to create an artifact
 */
export async function createPortfolioArtifactAction(payload: {
  artifactType:
    | "lesson_evidence"
    | "exercise_evidence"
    | "competency_evidence"
    | "achievement_evidence"
    | "gate_evidence"
    | "documentation_artifact"
    | "design_artifact"
    | "project_artifact";
  sourceDomain: string;
  title: string;
  description?: string | null;
  sourceId?: string | null;
}): Promise<DomainResponse<PortfolioArtifact>> {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const queryService = new PortfolioQueryService(supabase);
    const portfolioRes = await queryService.getPortfolio(user.id);
    if (!portfolioRes.success || !portfolioRes.data) {
      return { success: false, error: "Portfolio not found." };
    }

    const parsed = CreatePortfolioArtifactSchema.safeParse({
      portfolioId: portfolioRes.data.id,
      ...payload,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Validation failed" };
    }

    const artifactService = new PortfolioArtifactService(supabase);
    const result = await artifactService.createArtifact(
      user.id,
      parsed.data.artifactType,
      parsed.data.sourceDomain,
      parsed.data.title,
      parsed.data.description,
      parsed.data.sourceId
    );

    if (result.success) {
      revalidatePath("/portfolio");
    }

    return result;
  } catch {
    return { success: false, error: "Failed to create portfolio artifact." };
  }
}
