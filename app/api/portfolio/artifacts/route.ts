import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PortfolioArtifactService } from "@/domains/portfolio/services/portfolio-artifact.service";

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

    const artifactService = new PortfolioArtifactService(supabase);
    const result = await artifactService.retrieveArtifacts(user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching portfolio artifacts." },
      { status: 500 }
    );
  }
}
