import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phaseId = searchParams.get("phase_id");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "1000", 10);

    // 1. Fetch Phases
    const { data: phases, error: phasesError } = await supabase
      .from("curriculum_phases")
      .select("*")
      .order("order_index", { ascending: true });

    if (phasesError) {
      return NextResponse.json({ error: phasesError.message }, { status: 500 });
    }

    // 2. Fetch Nodes
    let query = supabase
      .from("curriculum_nodes")
      .select("id, slug, phase_id, order_index, title, subtitle, xp_reward, starter_code, test_suite, defense_prompts")
      .order("order_index", { ascending: true })
      .limit(limit);

    if (phaseId) {
      query = query.eq("phase_id", phaseId);
    }

    if (search) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data: nodes, error: nodesError } = await query;

    if (nodesError) {
      return NextResponse.json({ error: nodesError.message }, { status: 500 });
    }

    return NextResponse.json({
      phases: phases || [],
      nodes: nodes || [],
      totalLessons: nodes?.length || 0,
      totalPhases: phases?.length || 0,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch curriculum" }, { status: 500 });
  }
}
