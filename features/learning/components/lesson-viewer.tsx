"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { MermaidViewer } from "./mermaid-viewer";
import {
  AlertCircle,
  Lightbulb,
  Info,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";

export interface LessonViewerProps {
  content: string;
  title: string;
  summary?: string | null;
  className?: string;
}

/**
 * Robust, client-safe Markdown renderer tailored for AI-Native LMS lesson content.
 * Provides support for code blocks, dedicated Mermaid architecture diagrams,
 * GitHub callout alerts, responsive tables, lists, and formatted typography.
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

      // Code Block or Mermaid Diagram
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

        // 1. Dedicated Mermaid Architecture Diagram
        if (lang.toLowerCase() === "mermaid") {
          elements.push(
            <MermaidViewer
              key={`mermaid-${i}`}
              chart={codeLines.join("\n")}
            />
          );
          continue;
        }

        // 2. Standard Code Block
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

      // Markdown Table
      if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
        const tableLines: string[] = [trimmed];
        i++;
        while (i < lines.length) {
          const nextL = lines[i];
          if (nextL !== undefined && nextL.trim().startsWith("|") && nextL.trim().endsWith("|")) {
            tableLines.push(nextL.trim());
            i++;
          } else {
            break;
          }
        }

        if (tableLines.length >= 2) {
          const headerLine = tableLines[0];
          if (!headerLine) continue;

          const rawHeaders = headerLine
            .split("|")
            .slice(1, -1)
            .map((c) => c.trim());

          // Skip delimiter row (tableLines[1], e.g. | :--- | :--- |)
          const dataRows = tableLines.slice(2).map((rowStr) =>
            rowStr
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim())
          );

          elements.push(
            <div
              key={`table-${i}`}
              className="my-6 w-full overflow-x-auto rounded-xl border border-border/70 bg-zinc-950/60 shadow-lg shadow-black/20"
            >
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-zinc-900/90 border-b border-border text-xs uppercase font-bold tracking-wider text-muted-foreground">
                  <tr>
                    {rawHeaders.map((headerText, hIdx) => (
                      <th
                        key={hIdx}
                        className="px-4 py-3.5 font-semibold text-foreground border-r border-border/30 last:border-r-0"
                      >
                        {renderInline(headerText)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 font-sans">
                  {dataRows.map((rowCells, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-zinc-900/50 transition-colors duration-150 odd:bg-zinc-950/30 even:bg-zinc-900/20"
                    >
                      {rowCells.map((cellText, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-4 py-3 text-foreground/90 align-top leading-relaxed text-xs sm:text-sm border-r border-border/20 last:border-r-0"
                        >
                          {renderInline(cellText)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Blockquote or GitHub Alert Callout
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

        const firstLine = quoteLines[0] || "";
        const alertMatch = firstLine.match(/^\[!(IMPORTANT|TIP|NOTE|WARNING|CAUTION)\]/i);

        if (alertMatch && alertMatch[1]) {
          const alertType = alertMatch[1].toUpperCase();
          const remainingLines = [
            firstLine.slice(alertMatch[0].length).trim(),
            ...quoteLines.slice(1),
          ].filter((l) => l.length > 0);

          const alertStyles = {
            IMPORTANT: {
              border: "border-primary/50",
              bg: "bg-primary/10",
              text: "text-primary",
              label: "Important Mindset",
              icon: AlertCircle,
            },
            TIP: {
              border: "border-emerald-500/50",
              bg: "bg-emerald-950/20",
              text: "text-emerald-400",
              label: "Architectural Tip",
              icon: Lightbulb,
            },
            NOTE: {
              border: "border-cyan-500/50",
              bg: "bg-cyan-950/20",
              text: "text-cyan-400",
              label: "Pedagogical Note",
              icon: Info,
            },
            WARNING: {
              border: "border-amber-500/50",
              bg: "bg-amber-950/20",
              text: "text-amber-400",
              label: "Warning & Anti-Pattern",
              icon: AlertTriangle,
            },
            CAUTION: {
              border: "border-rose-500/50",
              bg: "bg-rose-950/20",
              text: "text-rose-400",
              label: "Critical Caution",
              icon: ShieldAlert,
            },
          }[alertType] || {
            border: "border-primary/50",
            bg: "bg-primary/10",
            text: "text-primary",
            label: "Notice",
            icon: Info,
          };

          const IconComponent = alertStyles.icon;

          elements.push(
            <div
              key={`callout-${i}`}
              className={cn(
                "my-6 rounded-xl border p-4 sm:p-5 backdrop-blur-sm shadow-sm transition-all",
                alertStyles.border,
                alertStyles.bg
              )}
            >
              <div className="flex items-center gap-2 mb-2">
                <IconComponent className={cn("w-4 h-4 shrink-0", alertStyles.text)} />
                <span className={cn("text-xs font-bold uppercase tracking-wider", alertStyles.text)}>
                  {alertStyles.label}
                </span>
              </div>
              <div className="space-y-2 text-sm text-foreground/90 leading-relaxed font-sans pl-6">
                {remainingLines.map((q, qIdx) => (
                  <p key={qIdx}>{renderInline(q)}</p>
                ))}
              </div>
            </div>
          );
          continue;
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
            !nextL.trim().startsWith("|") &&
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

  // Inline styling: bold, inline code, links
  const renderInline = (text: string): React.ReactNode => {
    const tokenRegex = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, idx) => {
      if (!part) return null;

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

      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch && linkMatch[1] && linkMatch[2]) {
        const linkText = linkMatch[1];
        const linkUrl = linkMatch[2];
        const isExternal = linkUrl.startsWith("http");

        return (
          <a
            key={idx}
            href={linkUrl}
            className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium"
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
          >
            {linkText}
          </a>
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
