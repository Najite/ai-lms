import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CompetencyService } from "@/features/competencies/services/competency-service";
import { logger } from "@/lib/logger";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const service = new CompetencyService(supabase);
    // Support querying by UUID id or by slug
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const query = isUuid ? { id } : { slug: id };

    const result = await service.getCompetencyDetail(query, user?.id);

    if (!result.success || !result.data) {
      return NextResponse.json({ error: result.error || "Competency not found" }, { status: 404 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/competencies/[id] failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
