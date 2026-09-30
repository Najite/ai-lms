import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CapstoneQueryService } from "@/domains/capstone/services/capstone-query.service";
import type { CapstoneDifficulty } from "@/domains/capstone/models";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { searchParams } = new URL(req.url);

    const typeSlug = searchParams.get("typeSlug") || undefined;
    const difficulty = (searchParams.get("difficulty") as CapstoneDifficulty) || undefined;
    const status = searchParams.get("status") || "active";

    const queryService = new CapstoneQueryService(supabase);
    const result = await queryService.getCapstones({ typeSlug, difficulty, status });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
