import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AchievementQueryService } from "@/domains/achievement/services/achievement-query.service";
import { logger } from "@/lib/logger";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Achievement identifier is required" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const service = new AchievementQueryService(supabase);
    const result = await service.getAchievementById(id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/achievements/:id failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
