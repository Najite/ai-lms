import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { PortfolioProjectService } from "@/domains/portfolio/services/portfolio-project.service";
import { CreatePortfolioProjectSchema } from "@/domains/portfolio/validators";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectService = new PortfolioProjectService(supabase);
    const result = await projectService.retrieveProjects(user.id);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while fetching portfolio projects." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const parsed = CreatePortfolioProjectSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const projectService = new PortfolioProjectService(supabase);
    const result = await projectService.createProject(
      user.id,
      parsed.data.title,
      parsed.data.description,
      parsed.data.projectType,
      parsed.data.status
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ data: result.data }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error while creating portfolio project." },
      { status: 500 }
    );
  }
}
