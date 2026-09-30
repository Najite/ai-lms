import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { PortfolioHiringSignal, HiringSignalType, HiringSignalStrength } from "../models";
import { logger } from "@/lib/logger";

type HiringSignalRow = Database["public"]["Tables"]["portfolio_hiring_signals"]["Row"];

export class PortfolioHiringSignalRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * Records a hiring signal for a portfolio
   */
  public async createSignal(
    portfolioId: string,
    signalType: HiringSignalType,
    signalStrength: HiringSignalStrength = "high"
  ): Promise<PortfolioHiringSignal | null> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_hiring_signals")
        .insert({
          portfolio_id: portfolioId,
          signal_type: signalType,
          signal_strength: signalStrength,
        })
        .select("*")
        .single();

      if (error || !data) {
        logger.error("Failed to create portfolio hiring signal", error);
        return null;
      }

      logger.info("portfolio.signal.generated", {
        portfolioId,
        signalId: data.id,
        signalType,
        signalStrength,
      });

      return this.mapSignal(data);
    } catch (err) {
      logger.error("Unexpected error in createSignal", err);
      return null;
    }
  }

  /**
   * Retrieves all hiring signals for a portfolio
   */
  public async getSignals(portfolioId: string): Promise<PortfolioHiringSignal[]> {
    try {
      const { data, error } = await this.supabase
        .from("portfolio_hiring_signals")
        .select("*")
        .eq("portfolio_id", portfolioId)
        .order("generated_at", { ascending: false });

      if (error) {
        logger.error("Failed to fetch portfolio hiring signals", error);
        return [];
      }

      return (data || []).map((row) => this.mapSignal(row));
    } catch (err) {
      logger.error("Unexpected error in getSignals", err);
      return [];
    }
  }

  private mapSignal(row: HiringSignalRow): PortfolioHiringSignal {
    return {
      id: row.id,
      portfolioId: row.portfolio_id,
      signalType: row.signal_type as HiringSignalType,
      signalStrength: row.signal_strength as HiringSignalStrength,
      generatedAt: row.generated_at,
    };
  }
}
