import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AchievementQueryService } from "@/domains/achievement/services/achievement-query.service";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const service = new AchievementQueryService(supabase);

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const slug = searchParams.get("slug") || undefined;

    const [achievementsRes, categoriesRes] = await Promise.all([
      service.getAchievements({ categoryId, slug, isActive: true }),
      service.getCategories(),
    ]);

    if (!achievementsRes.success) {
      return NextResponse.json({ error: achievementsRes.error }, { status: 400 });
    }

    return NextResponse.json(
      {
        data: {
          achievements: achievementsRes.data || [],
          categories: categoriesRes.data || [],
        },
      },
      { status: 200 }
    );
  } catch (err) {
    logger.error("API GET /api/achievements failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
