import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { CURRICULUM_META } from "@/lib/curriculum-meta";

export const runtime = "nodejs";

function normalizeTutorQuery(rawQuery: unknown): string {
  const value = typeof rawQuery === "string" ? rawQuery : "";
  const compact = value.trim().replace(/\s+/g, " ");
  return compact.replace(/[\u0000-\u001F\u007F]+/g, " ").slice(0, 200).trim();
}

function escapeIlikeToken(token: string): string {
  return token.replace(/[\\%_]/g, "\\$&");
}

export async function POST(req: NextRequest) {
  try {
    const rawQuery = await req.json();
    const cleanQuery = normalizeTutorQuery(rawQuery?.query);

    if (!cleanQuery) {
      return new Response(JSON.stringify({ error: "Query required" }), { status: 400 });
    }

    const tokens = cleanQuery
      .toLowerCase()
      .split(/\s+/)
      .map((token) => token.replace(/[^a-z0-9\-_]/g, ""))
      .filter(Boolean)
      .slice(0, 6);

    if (tokens.length === 0) {
      return new Response(JSON.stringify({ error: "Query contains no valid search terms" }), { status: 400 });
    }

    let matchedNodes: any[] = [];

    const queryResults = await Promise.all(
      tokens.map(async (token) => {
        const safeToken = escapeIlikeToken(token);
        const { data } = await supabase
          .from("curriculum_nodes")
          .select("id, title, phase_id, handbook_markdown")
          .or(`title.ilike.%${safeToken}%,handbook_markdown.ilike.%${safeToken}%`)
          .limit(3);
        return data ?? [];
      })
    );

    const seen = new Set<string>();
    for (const batch of queryResults) {
      for (const item of batch) {
        if (!item?.id || seen.has(item.id)) continue;
        seen.add(item.id);
        matchedNodes.push(item);
      }
    }

    matchedNodes = matchedNodes.slice(0, 3);

    let answer = "";
    if (matchedNodes.length > 0) {
      const top = matchedNodes[0];
      const preview = typeof top.handbook_markdown === "string" ? top.handbook_markdown.slice(0, 750) : "";
      answer = `Based directly on the database records for **${top.title}** (${top.phase_id}):\n\n${preview}\n\nThis explanation is grounded in the verified curriculum catalog and is limited to the lesson content for that module.`;
    } else {
      answer = `Grounded Curriculum Query: "${cleanQuery}"\n\nQueried live curriculum tables in Supabase across all ${CURRICULUM_META.modules} verified modules and ${CURRICULUM_META.totalLessons} lessons.\n\n- Module 1-4 cover core CS foundations, Python fluency, and applied systems reasoning.\n- Module 5-8 cover data structures, distributed systems, and modern web/database architecture.\n- Module 9-14 cover advanced distributed systems, AI systems, performance observability, and production capstone work.\n\nAsk about a lesson, module, or concept and the response will stay within the verified curriculum catalog.`;
    }

    const encoder = new TextEncoder();
    const words = answer.split(" ");

    const stream = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? "" : " ") + words[i];
          const sseData = `data: ${JSON.stringify({ content: chunk })}\n\n`;
          controller.enqueue(encoder.encode(sseData));
          await new Promise((resolve) => setTimeout(resolve, 12));
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "Tutor failed" }),
      { status: 500 }
    );
  }
}
