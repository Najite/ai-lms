import React from "react";
import { AlertTriangle, Info, Terminal, Sparkles, BookOpen } from "lucide-react";

interface HandbookViewerProps {
  content: string;
}

export const HandbookViewer: React.FC<HandbookViewerProps> = ({ content }) => {
  if (!content) {
    return (
      <div className="text-xs font-mono text-[#8a8f98] italic p-4">
        No handbook content loaded.
      </div>
    );
  }

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLang = "";
  let inTable = false;
  let tableRows: string[][] = [];

  const flushCode = (key: string) => {
    if (codeBuffer.length > 0) {
      elements.push(
        <div key={key} className="my-3 rounded-lg overflow-hidden border border-[#23252a] bg-[#050506]">
          {codeLang && (
            <div className="px-3 py-1.5 bg-[#0e1013] border-b border-[#23252a] text-[11px] font-mono text-[#8a8f98] flex items-center justify-between">
              <span>{codeLang}</span>
              <Terminal className="w-3 h-3 text-[#565961]" />
            </div>
          )}
          <pre className="p-3.5 text-[12px] font-mono leading-relaxed text-[#56b6c2] overflow-x-auto selection:bg-[#5e6ad2]/30">
            <code>{codeBuffer.join("\n")}</code>
          </pre>
        </div>
      );
      codeBuffer = [];
      codeLang = "";
    }
  };

  const flushTable = (key: string) => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const bodyRows = tableRows.slice(1).filter((r) => !r.every((c) => c.match(/^:?-+:?$/)));

      elements.push(
        <div key={key} className="my-4 overflow-x-auto rounded-lg border border-[#23252a]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#0f1012] border-b border-[#23252a] text-[#8a8f98]">
              <tr>
                {headerRow.map((col, idx) => (
                  <th key={idx} className="px-3 py-2 font-semibold">
                    {renderFormattedInline(col.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23252a] bg-[#08090a]">
              {bodyRows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-[#0e1013] transition-colors">
                  {row.map((col, cIdx) => (
                    <td key={cIdx} className="px-3 py-2 text-[#d0d6e0]">
                      {renderFormattedInline(col.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];

    // Code blocks
    if (rawLine.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCode(`code-${i}`);
      } else {
        if (inTable) flushTable(`table-${i}`);
        inCodeBlock = true;
        codeLang = rawLine.replace("```", "").trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    // Tables
    if (rawLine.trim().startsWith("|") && rawLine.trim().endsWith("|")) {
      const cells = rawLine
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      inTable = true;
      tableRows.push(cells);
      continue;
    } else if (inTable) {
      flushTable(`table-${i}`);
    }

    // Horizontal Rule
    if (rawLine.trim() === "---" || rawLine.trim() === "***") {
      elements.push(<hr key={`hr-${i}`} className="my-5 border-[#23252a]" />);
      continue;
    }

    // Markdown Images: ![alt](url)
    const imgMatch = rawLine.trim().match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imgMatch) {
      const altText = imgMatch[1];
      const imgSrc = imgMatch[2];
      elements.push(
        <figure key={`img-${i}`} className="my-6 rounded-xl border border-[#23252a] bg-[#07080a] p-2 overflow-hidden shadow-2xl">
          <div className="relative overflow-hidden rounded-lg border border-[#1b1c20] bg-black flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgSrc}
              alt={altText || "Diagram Illustration"}
              className="w-full max-h-[480px] object-contain rounded"
              loading="lazy"
            />
          </div>
          {altText && (
            <figcaption className="mt-2.5 px-2 pb-1 text-center text-xs font-mono text-[#8a8f98] flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" />
              <span className="text-[#a0a5af] font-medium">Figure:</span> {altText}
            </figcaption>
          )}
        </figure>
      );
      continue;
    }

    // Headers
    if (rawLine.startsWith("# ")) {
      elements.push(
        <div key={`h1-${i}`} className="mt-2 mb-4 pb-2 border-b border-[#23252a]">
          <h1 className="text-lg font-bold text-[#f7f8f8] tracking-tight flex items-center gap-2">
            <span>{renderFormattedInline(rawLine.replace("# ", "").trim())}</span>
          </h1>
        </div>
      );
      continue;
    }

    if (rawLine.startsWith("## ")) {
      const title = rawLine.replace("## ", "").trim();
      elements.push(
        <div key={`h2-${i}`} className="mt-6 mb-3 flex items-center gap-2 border-l-2 border-[#5e6ad2] pl-3 py-0.5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#f7f8f8] font-mono">
            {renderFormattedInline(title)}
          </h2>
        </div>
      );
      continue;
    }

    if (rawLine.startsWith("### ")) {
      const title = rawLine.replace("### ", "").trim();
      elements.push(
        <div key={`h3-${i}`} className="mt-4 mb-2 bg-[#0e1013] border border-[#23252a] px-3 py-2 rounded-lg">
          <h3 className="text-xs font-semibold text-[#6f7be8] font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>{renderFormattedInline(title)}</span>
          </h3>
        </div>
      );
      continue;
    }

    if (rawLine.startsWith("#### ")) {
      const title = rawLine.replace("#### ", "").trim();
      elements.push(
        <h4 key={`h4-${i}`} className="text-xs font-semibold text-[#f7f8f8] font-mono mt-3 mb-1.5 flex items-center gap-1.5">
          <span className="text-[#5e6ad2]">▸</span>
          <span>{renderFormattedInline(title)}</span>
        </h4>
      );
      continue;
    }

    // Callout alerts
    if (rawLine.startsWith("> [!WARNING]")) {
      const alertLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith(">")) {
        alertLines.push(lines[j].replace(/^>\s*/, ""));
        j++;
      }
      i = j - 1;
      elements.push(
        <div
          key={`alert-warn-${i}`}
          className="my-3 p-3.5 rounded-lg border border-[#eb5757]/40 bg-[#eb5757]/10 text-[#f7f8f8] text-xs font-mono"
        >
          <div className="flex items-center gap-2 text-[#eb5757] font-semibold mb-1">
            <AlertTriangle className="w-4 h-4" />
            <span>CRITICAL FAILURE MODE & PITFALL</span>
          </div>
          <div className="text-[#d0d6e0] leading-relaxed pl-6 space-y-1">
            {alertLines.map((al, idx) => (
              <p key={idx}>{renderFormattedInline(al)}</p>
            ))}
          </div>
        </div>
      );
      continue;
    }

    if (rawLine.startsWith("> [!IMPORTANT]") || rawLine.startsWith("> [!NOTE]")) {
      const alertLines: string[] = [];
      let j = i + 1;
      while (j < lines.length && lines[j].startsWith(">")) {
        alertLines.push(lines[j].replace(/^>\s*/, ""));
        j++;
      }
      i = j - 1;
      elements.push(
        <div
          key={`alert-info-${i}`}
          className="my-3 p-3.5 rounded-lg border border-[#5e6ad2]/40 bg-[#5e6ad2]/10 text-[#f7f8f8] text-xs font-mono"
        >
          <div className="flex items-center gap-2 text-[#5e6ad2] font-semibold mb-1">
            <Info className="w-4 h-4" />
            <span>VERIFICATION GATE & INVARIANTS</span>
          </div>
          <div className="text-[#d0d6e0] leading-relaxed pl-6 space-y-1">
            {alertLines.map((al, idx) => (
              <p key={idx}>{renderFormattedInline(al)}</p>
            ))}
          </div>
        </div>
      );
      continue;
    }

    // Standard Blockquotes
    if (rawLine.startsWith("> ")) {
      const quoteText = rawLine.replace(/^>\s*/, "");
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="border-l-2 border-[#5e6ad2] pl-3 py-1 my-2 text-xs font-mono text-[#d0d6e0] bg-[#0c0d10] rounded-r"
        >
          {renderFormattedInline(quoteText)}
        </blockquote>
      );
      continue;
    }

    // Unordered lists
    if (rawLine.trim().startsWith("- ") || rawLine.trim().startsWith("* ")) {
      const text = rawLine.trim().substring(2);
      elements.push(
        <li key={`li-${i}`} className="text-xs text-[#d0d6e0] leading-relaxed my-1 list-disc ml-5 font-mono">
          {renderFormattedInline(text)}
        </li>
      );
      continue;
    }

    // Ordered lists
    if (rawLine.trim().match(/^\d+\.\s+/)) {
      elements.push(
        <li key={`ol-${i}`} className="text-xs text-[#d0d6e0] leading-relaxed my-1 list-decimal ml-5 font-mono">
          {renderFormattedInline(rawLine.trim().replace(/^\d+\.\s+/, ""))}
        </li>
      );
      continue;
    }

    // Paragraph
    if (rawLine.trim().length > 0) {
      elements.push(
        <p key={`p-${i}`} className="text-xs text-[#c1c7d0] leading-relaxed my-2 font-sans">
          {renderFormattedInline(rawLine)}
        </p>
      );
    }
  }

  if (inCodeBlock) flushCode("code-end");
  if (inTable) flushTable("table-end");

  return <div className="space-y-1.5">{elements}</div>;
};

// Robust recursive inline formatter for bold (**...**), inline code (`...`), and italic (*...*)
function renderFormattedInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split tokens by code backticks `...`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, pIdx) => {
    // If it's a code block
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={`code-${pIdx}`}
          className="px-1.5 py-0.5 rounded bg-[#16171a] text-[#56b6c2] border border-[#23252a] text-[11px] font-mono"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Otherwise, parse bold **...** and clean up any stray asterisks
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);

    return (
      <React.Fragment key={`frag-${pIdx}`}>
        {boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith("**") && bPart.endsWith("**") && bPart.length >= 4) {
            return (
              <strong key={`bold-${bIdx}`} className="font-semibold text-[#f7f8f8]">
                {bPart.slice(2, -2)}
              </strong>
            );
          }
          // Remove any stray orphaned ** or * left unclosed
          const cleanText = bPart.replace(/\*\*/g, "");
          return cleanText;
        })}
      </React.Fragment>
    );
  });
}
