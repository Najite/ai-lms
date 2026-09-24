import { NextRequest } from "next/server";

export const runtime = "edge";

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[character] || character;
  });
}

function wrapLabel(value: string, maxLength: number): string[] {
  const words = value.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) lines.push(line);
  return lines.slice(0, 3);
}

export async function GET(
  _request: NextRequest,
  context: { params: { lessonId: string } }
): Promise<Response> {
  const lessonId = context.params.lessonId;
  const label = wrapLabel(lessonId.replace(/[-_]/g, " "), 22);
  const labelMarkup = label
    .map(
      (line, index) =>
        `<text x="600" y="${178 + index * 34}" text-anchor="middle" fill="#f7f8f8" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="26" font-weight="700">${escapeXml(line)}</text>`
    )
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="520" viewBox="0 0 1200 520" role="img" aria-labelledby="title desc">
  <title id="title">Lesson flow diagram for ${escapeXml(lessonId)}</title>
  <desc id="desc">A simple input, transformation, and output model for the lesson exercise.</desc>
  <rect width="1200" height="520" fill="#08090a"/>
  <rect x="44" y="44" width="1112" height="432" rx="12" fill="#0f1011" stroke="#23252a"/>
  <text x="82" y="98" fill="#8a8f98" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18" letter-spacing="1">LESSON FLOW // INPUT - TRANSFORM - VERIFY</text>
  <rect x="90" y="150" width="270" height="210" rx="8" fill="#141516" stroke="#34343a"/>
  <rect x="465" y="120" width="270" height="270" rx="8" fill="#111a27" stroke="#5e6ad2" stroke-width="2"/>
  <rect x="840" y="150" width="270" height="210" rx="8" fill="#141516" stroke="#34343a"/>
  <text x="225" y="205" text-anchor="middle" fill="#10b981" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18">01 // INPUT</text>
  <text x="600" y="175" text-anchor="middle" fill="#5e6ad2" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18">02 // TRANSFORM</text>
  <text x="975" y="205" text-anchor="middle" fill="#10b981" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18">03 // VERIFY</text>
  ${labelMarkup}
  <text x="600" y="314" text-anchor="middle" fill="#aeb5c0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="17">read the contract</text>
  <text x="600" y="345" text-anchor="middle" fill="#aeb5c0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="17">change one thing</text>
  <text x="225" y="294" text-anchor="middle" fill="#d0d6e0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20">given values</text>
  <text x="975" y="294" text-anchor="middle" fill="#d0d6e0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20">assertions</text>
  <path d="M360 255 H455" stroke="#5e6ad2" stroke-width="3"/><path d="m445 245 12 10-12 10" fill="none" stroke="#5e6ad2" stroke-width="3"/>
  <path d="M735 255 H830" stroke="#10b981" stroke-width="3"/><path d="m820 245 12 10-12 10" fill="none" stroke="#10b981" stroke-width="3"/>
  <text x="82" y="430" fill="#62666d" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="16">The diagram is a reading aid. The lesson specification and tests remain the source of truth.</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
