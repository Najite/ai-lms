import { describe, it, expect } from "vitest";
import { parseLessonContent } from "@/features/learning/utils/lesson-content-parser";

describe("Lesson Content Parser", () => {
  it("parses standard YAML frontmatter with delimiters", () => {
    const rawMarkdown = `---
lesson_code: "LES-00-04"
source_path: "lessons/les-00-04.md"
target_competency: "DEV-00"
prerequisites: ["LES-00-01", "LES-00-02"]
---

# LES-00-04: Git & Version Control from First Principles

## 1. Why This Matters
Version control prevents catastrophic loss of team collaboration.

## 2. What You Will Learn
- Master commit graphs and DAG models.
- Differentiate snapshots from deltas.

## Executive Overview
Content starts here.
`;

    const result = parseLessonContent(rawMarkdown);

    expect(result.metadata).not.toBeNull();
    expect(result.metadata?.lessonCode).toBe("LES-00-04");
    expect(result.metadata?.targetCompetency).toBe("DEV-00");
    expect(result.metadata?.prerequisites).toEqual(["LES-00-01", "LES-00-02"]);
    expect(result.whyThisMatters).toBe("Version control prevents catastrophic loss of team collaboration.");
    expect(result.learningOutcomes).toEqual([
      "Master commit graphs and DAG models.",
      "Differentiate snapshots from deltas.",
    ]);
    expect(result.cleanBody).not.toContain("```yaml");
    expect(result.cleanBody).not.toContain("lesson_code:");
    expect(result.cleanBody).not.toContain("# LES-00-04:");
    expect(result.cleanBody).toContain("## Executive Overview");
  });

  it("parses code block frontmatter (```yaml ... ```) and multi-line dash lists", () => {
    const rawMarkdown = `# LES-00-04: Git & Version Control from First Principles

\`\`\`yaml
lesson_id: LES-00-04
module_id: MOD-00
target_competency: DEV-00
prerequisites:
  - LES-00-01: Files and Folders
  - LES-00-02: Terminal Streams
\`\`\`

---

## Executive Overview & Mental Model Anchors
Git is an immutable snapshot database.
`;

    const result = parseLessonContent(rawMarkdown);

    expect(result.metadata).not.toBeNull();
    expect(result.metadata?.lessonCode).toBe("LES-00-04");
    expect(result.metadata?.targetCompetency).toBe("DEV-00");
    expect(result.metadata?.prerequisites).toEqual([
      "LES-00-01: Files and Folders",
      "LES-00-02: Terminal Streams",
    ]);
    expect(result.cleanBody).not.toContain("```yaml");
    expect(result.cleanBody).not.toContain("lesson_id: LES-00-04");
    expect(result.cleanBody).not.toContain("# LES-00-04:");
    expect(result.cleanBody).toContain("## Executive Overview & Mental Model Anchors");
  });

  it("handles null or empty content gracefully", () => {
    const result = parseLessonContent("", "Fallback summary");

    expect(result.metadata).toBeNull();
    expect(result.cleanBody).toBe("");
    expect(result.whyThisMatters).toBe("Fallback summary");
    expect(result.prerequisitesList).toEqual(["Zero prior programming experience required"]);
  });

  it("extracts prerequisites from markdown text when not in frontmatter", () => {
    const rawMarkdown = `---
lesson_code: "LES-00-01"
---

## Prerequisites
- Completed Terminal Basics
- Completed Operating System Fundamentals

## Card 1: Main Content
Core content goes here.
`;

    const result = parseLessonContent(rawMarkdown);

    expect(result.prerequisitesList).toEqual([
      "Completed Terminal Basics",
      "Completed Operating System Fundamentals",
    ]);
    expect(result.cleanBody).not.toContain("## Prerequisites");
    expect(result.cleanBody).toContain("## Card 1: Main Content");
  });

  it("parses actual les-00-04.md lesson file cleanly without metadata leakage", async () => {
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.resolve(process.cwd(), "lessons/les-00-04.md");
    const content = await fs.readFile(filePath, "utf-8");

    const result = parseLessonContent(content);

    expect(result.metadata).not.toBeNull();
    expect(result.metadata?.lessonCode).toBe("LES-00-04");
    expect(result.metadata?.prerequisites).toEqual(["LES-00-01", "LES-00-02", "LES-00-03"]);
    expect(result.cleanBody).not.toContain("```yaml");
    expect(result.cleanBody).not.toContain("lesson_code:");
    expect(result.cleanBody).not.toContain("# LES-00-04:");
    expect(result.cleanBody).toContain("## Executive Overview & Mental Model Anchors");
    expect(result.cleanBody).toContain("### Core Analogies Matrix");
    expect(result.cleanBody).toContain("## Card 1: The Problem Git Solves");
    expect(result.cleanBody).toContain("## Card 7: The Git DAG Mental Model & Synthesis");
  });
});
