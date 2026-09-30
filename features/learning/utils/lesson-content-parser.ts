import type { StaffLessonMetadata } from "../types";

export interface ParsedLessonContent {
  metadata: StaffLessonMetadata | null;
  cleanBody: string;
  whyThisMatters: string | null;
  learningOutcomes: string[];
  prerequisitesList: string[];
}

/**
 * Extracts YAML frontmatter and key pedagogical sections from raw markdown lesson content.
 * Ensures learners see clean instructional content while staff metadata is isolated.
 */
export function parseLessonContent(rawContent: string, lessonSummary?: string | null): ParsedLessonContent {
  if (!rawContent) {
    return {
      metadata: null,
      cleanBody: "",
      whyThisMatters: lessonSummary || null,
      learningOutcomes: [],
      prerequisitesList: ["Zero prior programming experience required"],
    };
  }

  let content = rawContent.trim();
  let metadata: StaffLessonMetadata | null = null;

  // 1. Parse YAML frontmatter if present (standard --- fences OR ```yaml / ```frontmatter blocks)
  const standardFenceMatch = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(\r?\n|$)/);
  const codeBlockMatch = content.match(/^(?:#\s+[^\n]+\r?\n+)?```(?:ya?ml|frontmatter)\s*\r?\n([\s\S]*?)\r?\n```\s*(\r?\n|$)/i);

  if (standardFenceMatch && standardFenceMatch[1]) {
    metadata = parseFrontmatterBlock(standardFenceMatch[1]);
    content = content.slice(standardFenceMatch[0].length).trim();
  } else if (codeBlockMatch && codeBlockMatch[1]) {
    metadata = parseFrontmatterBlock(codeBlockMatch[1]);
    content = content.slice(codeBlockMatch[0].length).trim();
  }

  // 2. Strip leading H1 title if present (e.g. "# LES-00-04: Git & Version Control...")
  content = content.replace(/^#\s+[^\n]+\r?\n+/g, "").trim();

  // 3. Strip initial metadata key-value lines (e.g. "**Module:** MOD-00...", "**Phase:** Phase 1...", etc.)
  content = content.replace(/^(?:\*\*(?:Module|Phase|Target Competency|Estimated Total Effort|Estimated Time|Prerequisites|State Progression|Successor|Successor Exercise):\*\*.*?\r?\n)+/gim, "").trim();

  // 4. Strip internal curriculum source lines if present (e.g. "*Canonical lesson source: ...*")
  content = content.replace(/\*Canonical lesson source:.*?\*\r?\n*/gi, "");
  content = content.replace(/\*Blueprint specification:.*?\*\r?\n*/gi, "");
  content = content.replace(/\*Parent module:.*?\*\r?\n*/gi, "");

  // 5. Extract "Why This Matters"
  let whyThisMatters: string | null = null;

  // Check for explicit "Why This Matters" block in content (including numbered headers like ## 1. Why This Matters)
  const whyBlockMatch = content.match(/#{2,3}\s*(?:\d+\.\s*)?Why This Matters[^\n]*\n+([\s\S]*?)(?=\n#{2,3}\s*(?:\d+\.|\b[A-Z])|\n---|$)/i);
  if (whyBlockMatch && whyBlockMatch[1]) {
    // Extract first meaningful text paragraph (skip subheadings like ### Why Should You Care?)
    const lines = whyBlockMatch[1].split("\n");
    const paragraphs: string[] = [];
    let currentP = "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("###") || trimmed.startsWith("##") || trimmed.startsWith("```")) {
        if (currentP) {
          paragraphs.push(currentP);
          currentP = "";
        }
        continue;
      }
      if (trimmed === "") {
        if (currentP) {
          paragraphs.push(currentP);
          currentP = "";
        }
      } else {
        currentP = currentP ? `${currentP} ${trimmed}` : trimmed;
      }
    }
    if (currentP) paragraphs.push(currentP);

    if (paragraphs.length > 0) {
      whyThisMatters = paragraphs.slice(0, 2).join("\n\n");
    }
  }

  if (!whyThisMatters) {
    // Check for pedagogical summary block
    const pedSummaryMatch = content.match(/#{2,3}\s*Pedagogical Summary\s*\n+([^#\n][^\n]+(?:\n[^#\n][^\n]+)*)/i);
    if (pedSummaryMatch && pedSummaryMatch[1]) {
      whyThisMatters = pedSummaryMatch[1].trim();
    } else if (lessonSummary) {
      whyThisMatters = lessonSummary;
    }
  }

  // 6. Extract "Learning Outcomes" / "What You Will Learn"
  const outcomes: string[] = [];
  const outcomeBlockMatch = content.match(/#{2,3}\s*(?:\d+\.\s*)?(?:Learning Objectives|Learning Outcomes|What You Will Learn|Key Takeaways)[^\n]*\n+([\s\S]*?)(?=\n#{2,3}\s*(?:\d+\.|\b[A-Z])|\n---|$)/i);
  if (outcomeBlockMatch && outcomeBlockMatch[1]) {
    const lines = outcomeBlockMatch[1].split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      const bulletMatch = trimmed.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
      if (bulletMatch && bulletMatch[1]) {
        // Strip leading bold formatting if present (e.g. "**Outcome**: details" -> "Outcome: details")
        const cleanBullet = bulletMatch[1].trim();
        outcomes.push(cleanBullet);
      }
    }
  }

  // Fallback default outcomes if not explicitly partitioned
  if (outcomes.length === 0 && lessonSummary) {
    outcomes.push(
      "Master core mental models and spatial architecture.",
      "Understand practical operations and failure prevention in software systems.",
      "Apply knowledge directly to real-world command-line and development workflows."
    );
  }

  // 7. Extract Prerequisites from markdown content or metadata
  const prereqs: string[] = [];
  const prereqBlockMatch = content.match(/#{2,3}\s*(?:\d+\.\s*)?(?:Prerequisites|Prerequisite Check)[^\n]*\n+([\s\S]*?)(?=\n#{2,3}\s*(?:\d+\.|\b[A-Z])|\n---|$)/i);
  if (prereqBlockMatch && prereqBlockMatch[1]) {
    const lines = prereqBlockMatch[1].split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      const bulletMatch = trimmed.match(/^(?:[-*]|\d+\.)\s+(.+)$/);
      if (bulletMatch && bulletMatch[1]) {
        prereqs.push(bulletMatch[1].trim());
      }
    }
  }

  if (prereqs.length === 0) {
    if (metadata?.prerequisites && Array.isArray(metadata.prerequisites) && metadata.prerequisites.length > 0) {
      prereqs.push(...metadata.prerequisites.map((p) => `Completed ${p}`));
    } else {
      prereqs.push("Zero prior programming or command-line experience required");
    }
  }

  // 8. Clean body: Strip redundant launch sections so they don't duplicate under the cards
  let cleanBody = content;
  // Remove pedagogical summary if present
  cleanBody = cleanBody.replace(/#{2,3}\s*Pedagogical Summary\s*\n+([^#\n][^\n]+(?:\n[^#\n][^\n]+)*)/gi, "").trim();
  // Remove explicit Why This Matters block if extracted
  cleanBody = cleanBody.replace(/#{2,3}\s*(?:\d+\.\s*)?Why This Matters[^\n]*\n+([\s\S]*?)(?=\n#{2,3}\s*(?:\d+\.|\b[A-Z])|\n---|$)/gi, "").trim();
  // Remove What You Will Learn / Learning Outcomes block if extracted
  cleanBody = cleanBody.replace(/#{2,3}\s*(?:\d+\.\s*)?(?:Learning Objectives|Learning Outcomes|What You Will Learn)[^\n]*\n+([\s\S]*?)(?=\n#{2,3}\s*(?:\d+\.|\b[A-Z])|\n---|$)/gi, "").trim();
  // Remove Prerequisites block if extracted
  cleanBody = cleanBody.replace(/#{2,3}\s*(?:\d+\.\s*)?(?:Prerequisites|Prerequisite Check)[^\n]*\n+([\s\S]*?)(?=\n#{2,3}\s*(?:\d+\.|\b[A-Z])|\n---|$)/gi, "").trim();
  // Clean up adjacent horizontal dividers or leading dividers
  cleanBody = cleanBody.replace(/(?:\r?\n\s*---\s*)+/g, "\n\n---\n\n").replace(/^\s*---\s*\n+/g, "").trim();

  return {
    metadata,
    cleanBody,
    whyThisMatters,
    learningOutcomes: outcomes.slice(0, 5), // Top 5 for executive clarity
    prerequisitesList: prereqs.slice(0, 4),
  };
}

function parseFrontmatterBlock(raw: string): StaffLessonMetadata {
  const result: Record<string, unknown> = {};
  const lines = raw.split("\n");

  let currentListKey: string | null = null;
  let currentList: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Check for list item under current list key (e.g. "  - LES-00-01")
    const listItemMatch = line.match(/^\s*-\s+(.+)$/);
    if (listItemMatch && listItemMatch[1] && currentListKey) {
      const itemVal = listItemMatch[1].trim().replace(/^["']|["']$/g, "");
      currentList.push(itemVal);
      result[currentListKey] = currentList;
      continue;
    }

    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) {
      currentListKey = null;
      continue;
    }

    const key = line.slice(0, colonIndex).trim();
    let val = line.slice(colonIndex + 1).trim();

    // Check if key starts a multi-line list
    if (val === "") {
      currentListKey = key;
      currentList = [];
      result[key] = currentList;
      continue;
    }

    currentListKey = null;

    // Strip quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }

    // Parse inline array [a, b]
    if (val.startsWith("[") && val.endsWith("]")) {
      const inner = val.slice(1, -1).trim();
      result[key] = inner
        ? inner
            .split(",")
            .map((item) => item.trim().replace(/^["']|["']$/g, ""))
        : [];
    } else {
      result[key] = val;
    }
  }

  const rawPrereqs = result.prerequisites;
  const prerequisites = Array.isArray(rawPrereqs)
    ? rawPrereqs.map((p) => String(p))
    : typeof rawPrereqs === "string" && rawPrereqs.trim().length > 0
      ? [rawPrereqs.trim()]
      : [];

  return {
    lessonCode:
      (result.lesson_code as string) ||
      (result.lesson_id as string) ||
      (result.code as string) ||
      (result.id as string) ||
      null,
    sourcePath: (result.source_path as string) || null,
    blueprintPath: (result.blueprint_path as string) || null,
    version: (result.version as string) || null,
    status: (result.status as string) || null,
    targetCompetency: (result.target_competency as string) || null,
    targetGate: (result.target_gate as string) || null,
    prerequisites,
  };
}
