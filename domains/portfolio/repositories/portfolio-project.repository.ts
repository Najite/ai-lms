import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PortfolioProject, PortfolioProjectStatus } from "../models";
import { logger } from "@/lib/logger";

type ProjectRow = Database["public"]["Tables"]["portfolio_projects"]["Row"];

export class PortfolioProjectRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Adds a project to the portfolio
   */
  public async createProject(
    portfolioId: string,
    title: string,
    description?: string | null,
    projectType = "production_app",
    status: PortfolioProjectStatus = "completed"
  ): Promise<PortfolioProject | null> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_projects")
        .insert({
          portfolio_id: portfolioId,
          title,
          description: description || null,
          project_type: projectType,
          status,
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create portfolio project", error);
        return null;
      }

      logger.info("portfolio.project.created", {
        portfolioId,
        projectId: data.id,
        title,
      });

      return this.mapProject(data);
    } catch (err) {
      logger.error("Unexpected error in createProject", err);
      return null;
    }
  }

  /**
   * Retrieves all projects for a portfolio
   */
  public async getProjects(portfolioId: string): Promise<PortfolioProject[]> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_projects")
        .select("*")
        .eq("portfolio_id", portfolioId)
        .order("created_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch portfolio projects", error);
        return [];
      }

      return (data || []).map((row) => this.mapProject(row));
    } catch (err) {
      logger.error("Unexpected error in getProjects", err);
      return [];
    }
  }

  /**
   * Updates an existing portfolio project
   */
  public async updateProject(
    projectId: string,
    updates: {
      title?: string;
      description?: string | null;
      projectType?: string;
      status?: PortfolioProjectStatus;
    }
  ): Promise<PortfolioProject | null> {
    try {
      const dbUpdates: Partial<Database["public"]["Tables"]["portfolio_projects"]["Update"]> = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.projectType !== undefined) dbUpdates.project_type = updates.projectType;
      if (updates.status !== undefined) dbUpdates.status = updates.status;

      const { data, error } = await this.supabase
        .from("portfolio_projects")
        .update(dbUpdates)
        .eq("id", projectId)
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to update portfolio project", error);
        return null;
      }

      return this.mapProject(data);
    } catch (err) {
      logger.error("Unexpected error in updateProject", err);
      return null;
    }
  }

  private mapProject(row: ProjectRow): PortfolioProject {
    return {
      id: row.id,
      portfolioId: row.portfolio_id,
      title: row.title,
      description: row.description,
      projectType: row.project_type,
      status: row.status as PortfolioProjectStatus,
      createdAt: row.created_at,
    };
  }
}
