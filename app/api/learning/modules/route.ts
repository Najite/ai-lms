import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { LearningService } from "@/features/learning/services/learning-service";
import { moduleQuerySchema } from "@/features/learning/schemas";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pathSlug = searchParams.get("pathSlug");
    const moduleSlug = searchParams.get("moduleSlug");

    if (!pathSlug || !moduleSlug) {
      return NextResponse.json(
        { error: "pathSlug and moduleSlug query parameters are required." },
        { status: 400 }
      );
    }

    const validation = moduleQuerySchema.safeParse({ pathSlug, moduleSlug });
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters.", details: validation.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const learningService = new LearningService(supabase);
    const result = await learningService.getModuleDetail(
      validation.data.pathSlug,
      validation.data.moduleSlug,
      user?.id
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch (err) {
    logger.error("API GET /api/learning/modules failed", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
