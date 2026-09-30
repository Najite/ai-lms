import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { PortfolioRepository } from "../repositories/portfolio.repository";
import { PortfolioHiringSignalRepository } from "../repositories/portfolio-hiring-signal.repository";
import type {
  PortfolioHiringSignal,
  HiringSignalType,
  HiringSignalStrength,
  DomainResponse,
} from "../models";
import { logger } from "@/lib/logger";

export class HiringSignalService {
  private readonly portfolioRepo: PortfolioRepository;
  private readonly signalRepo: PortfolioHiringSignalRepository;

  constructor(private readonly supabase: SupabaseClient<Database>) {
    this.portfolioRepo = new PortfolioRepository(supabase);
    this.signalRepo = new PortfolioHiringSignalRepository(supabase);
  }

  /**
   * Generates and stores a hiring signal for a user's portfolio
   */
  public async generateSignal(
    userId: string,
    signalType: HiringSignalType,
    signalStrength: HiringSignalStrength = "high"
  ): Promise<DomainResponse<PortfolioHiringSignal>> {
    try {
      const portfolio = await this.portfolioRepo.getOrCreatePortfolio(userId);
      if (!portfolio) {
        return { success: false, error: "Portfolio not found." };
      }

      const signal = await this.signalRepo.createSignal(portfolio.id, signalType, signalStrength);
      if (!signal) {
        return { success: false, error: "Failed to generate hiring signal." };
      }

      return { success: true, data: signal };
    } catch (err) {
      logger.error("Error in generateSignal", err);
      return { success: false, error: "Internal error generating hiring signal." };
    }
  }

  /**
   * Retrieves all hiring signals for a user's portfolio
   */
  public async retrieveSignals(userId: string): Promise<DomainResponse<PortfolioHiringSignal[]>> {
    try {
      const portfolio = await this.portfolioRepo.getByUserId(userId);
      if (!portfolio) {
        return { success: true, data: [] };
      }

      const signals = await this.signalRepo.getSignals(portfolio.id);
      return { success: true, data: signals };
    } catch (err) {
      logger.error("Error in retrieveSignals", err);
      return { success: false, error: "Failed to retrieve hiring signals." };
    }
  }
}
