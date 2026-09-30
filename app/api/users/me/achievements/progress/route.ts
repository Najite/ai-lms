import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AchievementProgressRepository } from "@/domains/achievement/repositories/achievement-progress.repository";
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

    const repo = new AchievementProgressRepository(supabase);
    const progressList = await repo.getUserProgressList(user.id);

    return NextResponse.json({ data: progressList }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/users/me/achievements/progress failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
