import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PortfolioQueryService } from "@/domains/portfolio/services/portfolio-query.service";
import { PortfolioAggregationService } from "@/domains/portfolio/services/portfolio-aggregation.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Trigger portfolio aggregation before returning summary
    const aggregationService = new PortfolioAggregationService(supabase);
    await aggregationService.aggregateUserPortfolio(user.id);

    const queryService = new PortfolioQueryService(supabase);
    const result = await queryService.getPortfolioSummary(user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching portfolio summary." },
      { status: 500 }
    );
  }
}
