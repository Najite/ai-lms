import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GateAttemptRepository } from "@/domains/gates/repositories/gate-attempt.repository";
import { GateProgressService } from "@/domains/gates/services/gate-progress.service";
import { GateQueryService } from "@/domains/gates/services/gate-query.service";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const queryService = new GateQueryService(supabase);
    const statusRes = await queryService.getUserGateStatus(user.id, id);
    if (!statusRes.success || !statusRes.data) {
      return NextResponse.json({ error: "Gate not found." }, { status: 404 });
    }

    if (statusRes.data.status === "locked") {
      return NextResponse.json(
        { error: "Gate is locked. Complete prerequisite gates and requirements first." },
        { status: 403 }
      );
    }

    if (statusRes.data.isCompleted) {
      return NextResponse.json(
        { error: "Gate is already completed." },
        { status: 400 }
      );
    }

    const attemptRepo = new GateAttemptRepository(supabase);
    const progressService = new GateProgressService(supabase);

    // Check existing active attempt
    let attempt = await attemptRepo.getActiveAttempt(user.id, statusRes.data.gate.id);
    if (!attempt) {
      attempt = await attemptRepo.createAttempt(user.id, statusRes.data.gate.id);
    }

    if (!attempt) {
      return NextResponse.json({ error: "Failed to initialize gate attempt." }, { status: 500 });
    }

    // Transition progress to in_progress
    await progressService.updateProgress(user.id, statusRes.data.gate.id, 70, "in_progress");

    return NextResponse.json({ data: attempt }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while starting gate attempt." },
      { status: 500 }
    );
  }
}
