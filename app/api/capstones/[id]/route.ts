import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CapstoneQueryService } from "@/domains/capstone/services/capstone-query.service";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const queryService = new CapstoneQueryService(supabase);

    const result = await queryService.getCapstoneById(id);
    if (!result.success) {
      // Fallback to slug lookup if ID lookup fails
      const slugResult = await queryService.getCapstoneBySlug(id);
      if (!slugResult.success) {
        return NextResponse.json({ error: result.error || "Capstone not found" }, { status: 404 });
      }
      return NextResponse.json({ data: slugResult.data }, { status: 200 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
