import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AchievementQueryService } from "@/domains/achievement/services/achievement-query.service";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const service = new AchievementQueryService(supabase);
    const result = await service.getUserAchievements(user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/users/me/achievements failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
