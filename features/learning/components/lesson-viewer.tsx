"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface LessonViewerProps {
  content: string;
  title: string;
  summary?: string | null;
  className?: string;
}

/**
 * Robust, client-safe Markdown renderer tailored for AI-Native LMS lesson content.
 */
export function LessonViewer({ content, summary, className }: LessonViewerProps) {
  // Parse markdown into blocks
  const parseMarkdownBlocks = (raw: string) => {
    const lines = raw.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const currentLine = lines[i];
      if (currentLine === undefined) {
        i++;
        continue;
      }

      const trimmed = currentLine.trim();

      // Code Block
      if (trimmed.startsWith("```")) {
        const lang = trimmed.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length) {
          const l = lines[i];
          if (l === undefined || l.trim().startsWith("```")) break;
          codeLines.push(l);
          i++;
        }
        i++; // skip closing ```
        elements.push(
          <div
            key={`code-${i}`}
            className="my-6 rounded-xl border border-border/80 bg-zinc-950/90 overflow-hidden shadow-lg shadow-black/40 font-mono text-sm"
          >
            {lang && (
              <div className="flex items-center justify-between px-4 py-2 border-b border-border/40 bg-zinc-900/60 text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">{lang}</span>
                <span className="text-[10px] text-zinc-500">Code Artifact</span>
              </div>
            )}
            <pre className="p-4 overflow-x-auto text-zinc-200 leading-relaxed">
              <code>{codeLines.join("\n")}</code>
            </pre>
          </div>
        );
        continue;
      }

      // Heading 1
      if (currentLine.startsWith("# ")) {
        elements.push(
          <h1
            key={`h1-${i}`}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-8 mb-4 border-b border-border/40 pb-2"
          >
            {renderInline(currentLine.slice(2))}
          </h1>
        );
        i++;
        continue;
      }

      // Heading 2
      if (currentLine.startsWith("## ")) {
        elements.push(
          <h2
            key={`h2-${i}`}
            className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-8 mb-3 flex items-center gap-2"
          >
            <span className="w-1.5 h-5 bg-primary rounded-full inline-block" />
            {renderInline(currentLine.slice(3))}
          </h2>
        );
        i++;
        continue;
      }

      // Heading 3
      if (currentLine.startsWith("### ")) {
        elements.push(
          <h3
            key={`h3-${i}`}
            className="text-lg font-semibold tracking-tight text-foreground mt-6 mb-2"
          >
            {renderInline(currentLine.slice(4))}
          </h3>
        );
        i++;
        continue;
      }

      // Horizontal Rule
      if (trimmed === "---" || trimmed === "***") {
        elements.push(<hr key={`hr-${i}`} className="my-8 border-border/50" />);
        i++;
        continue;
      }

      // Blockquote
      if (currentLine.startsWith("> ")) {
        const quoteLines: string[] = [currentLine.slice(2)];
        i++;
        while (i < lines.length) {
          const nextL = lines[i];
          if (nextL !== undefined && nextL.startsWith("> ")) {
            quoteLines.push(nextL.slice(2));
            i++;
          } else {
            break;
          }
        }
        elements.push(
          <blockquote
            key={`quote-${i}`}
            className="my-4 border-l-4 border-primary/60 bg-primary/5 px-4 py-3 rounded-r-lg text-sm italic text-foreground/90 leading-relaxed"
          >
            {quoteLines.map((q, qIdx) => (
              <p key={qIdx}>{renderInline(q)}</p>
            ))}
          </blockquote>
        );
        continue;
      }

      // Unordered List
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const listItems: string[] = [trimmed.slice(2)];
        i++;
        while (i < lines.length) {
          const nextL = lines[i];
          if (nextL !== undefined && (nextL.trim().startsWith("- ") || nextL.trim().startsWith("* "))) {
            listItems.push(nextL.trim().slice(2));
            i++;
          } else {
            break;
          }
        }
        elements.push(
          <ul key={`ul-${i}`} className="my-4 space-y-2 pl-4 list-disc text-foreground/90">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="leading-relaxed text-sm">
                {renderInline(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // Numbered List
      if (/^\d+\.\s/.test(trimmed)) {
        const listItems: string[] = [trimmed.replace(/^\d+\.\s/, "")];
        i++;
        while (i < lines.length) {
          const nextL = lines[i];
          if (nextL !== undefined && /^\d+\.\s/.test(nextL.trim())) {
            listItems.push(nextL.trim().replace(/^\d+\.\s/, ""));
            i++;
          } else {
            break;
          }
        }
        elements.push(
          <ol key={`ol-${i}`} className="my-4 space-y-2 pl-5 list-decimal text-foreground/90">
            {listItems.map((item, itemIdx) => (
              <li key={itemIdx} className="leading-relaxed text-sm">
                {renderInline(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // Paragraph
      if (trimmed.length > 0) {
        const paraLines: string[] = [currentLine];
        i++;
        while (i < lines.length) {
          const nextL = lines[i];
          if (
            nextL !== undefined &&
            nextL.trim().length > 0 &&
            !nextL.startsWith("#") &&
            !nextL.startsWith("```") &&
            !nextL.startsWith("> ") &&
            !nextL.trim().startsWith("- ") &&
            !/^\d+\.\s/.test(nextL.trim()) &&
            nextL.trim() !== "---"
          ) {
            paraLines.push(nextL);
            i++;
          } else {
            break;
          }
        }
        elements.push(
          <p key={`p-${i}`} className="my-4 text-sm sm:text-base text-foreground/90 leading-relaxed">
            {renderInline(paraLines.join(" "))}
          </p>
        );
        continue;
      }

      i++;
    }

    return elements;
  };

  // Inline styling: bold, inline code
  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);

    return parts.map((part, idx) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-muted font-mono text-xs text-primary border border-border/50"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <article
      className={cn(
        "prose-custom max-w-none text-foreground/90 select-text leading-relaxed",
        className
      )}
    >
      {summary && (
        <div className="mb-6 p-4 rounded-xl bg-secondary/50 border border-border/60 text-muted-foreground text-sm leading-relaxed">
          <span className="font-semibold text-foreground mr-1.5">Summary:</span>
          {summary}
        </div>
      )}

      <div>{parseMarkdownBlocks(content)}</div>
    </article>
  );
}
