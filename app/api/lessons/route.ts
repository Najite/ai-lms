import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");

    if (!id && !slug) {
      return NextResponse.json({ error: "Lesson 'id' or 'slug' is required" }, { status: 400 });
    }

    let query = supabase.from("curriculum_nodes").select("*");

    if (id) {
      query = query.eq("id", id);
    } else if (slug) {
      query = query.eq("slug", slug);
    }

    const { data: lesson, error } = await query.single();

    if (error || !lesson) {
      return NextResponse.json({ error: error?.message || "Lesson not found" }, { status: 404 });
    }

    return NextResponse.json({ lesson });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch lesson" }, { status: 500 });
  }
}
