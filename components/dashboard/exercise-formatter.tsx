import React, { useState } from "react";
import { 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Cpu, 
  Clock, 
  Layers, 
  Copy, 
  Check, 
  Code2,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ExerciseItem } from "@/lib/exercises-catalog";

interface ExerciseFormatterProps {
  exercise: ExerciseItem;
  onNavigateToTheory?: () => void;
  showTheoryLink?: boolean;
}

// Cleans LaTeX math syntax to crisp human readable unicode notation
// e.g. $-10^9 \le a, b \le 10^9$ -> -10⁹ ≤ a, b ≤ 10⁹
// e.g. $O(1)$ -> O(1)
// e.g. $2 \le \text{len}(nums) \le 10^5$ -> 2 ≤ len(nums) ≤ 10⁵
export function formatMathSymbols(text: string): string {
  if (!text) return "";
  return text
    // Strip surrounding math dollar signs
    .replace(/\$([^\$]+)\$/g, "$1")
    // Greek/math operators
    .replace(/\\le/g, "≤")
    .replace(/\\ge/g, "≥")
    .replace(/\\ne/g, "≠")
    .replace(/\\times/g, "×")
    .replace(/\\approx/g, "≈")
    .replace(/\\text\{([^}]+)\}/g, "$1")
    .replace(/\\_/g, "_")
    // Superscripts
    .replace(/\^0/g, "⁰")
    .replace(/\^1/g, "¹")
    .replace(/\^2/g, "²")
    .replace(/\^3/g, "³")
    .replace(/\^4/g, "⁴")
    .replace(/\^5/g, "⁵")
    .replace(/\^6/g, "⁶")
    .replace(/\^7/g, "⁷")
    .replace(/\^8/g, "⁸")
    .replace(/\^9/g, "⁹")
    .replace(/\^{([0-9]+)}/g, (_, exp) => {
      const supMap: Record<string, string> = {
        "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
        "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
      };
      return exp.split("").map((c: string) => supMap[c] || c).join("");
    });
}

// Inline parser for bold, inline code, and math symbols
function renderRichInline(text: string): React.ReactNode {
  if (!text) return null;

  // Split by code backticks first
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, pIdx) => {
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code
          key={`c-${pIdx}`}
          className="px-1.5 py-0.5 rounded bg-[#16171a] text-[#56b6c2] border border-[#23252a] text-[11px] font-mono mx-0.5"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Replace math symbols in plain text segment
    const formatted = formatMathSymbols(part);

    // Bold tags
    const boldParts = formatted.split(/(\*\*[^*]+\*\*)/g);
    return (
      <React.Fragment key={`fr-${pIdx}`}>
        {boldParts.map((bPart, bIdx) => {
          if (bPart.startsWith("**") && bPart.endsWith("**") && bPart.length >= 4) {
            return (
              <strong key={`b-${bIdx}`} className="font-semibold text-[#f7f8f8]">
                {bPart.slice(2, -2)}
              </strong>
            );
          }
          return bPart.replace(/\*\*/g, "");
        })}
      </React.Fragment>
    );
  });
}

interface ParsedExerciseDescription {
  problemDescription: string[];
  constraints: string[];
  examples: Array<{
    input?: string;
    output?: string;
    explanation?: string;
    rawCode?: string;
  }>;
}

function parseExerciseMarkdown(markdown: string): ParsedExerciseDescription {
  const lines = markdown.split("\n");
  const result: ParsedExerciseDescription = {
    problemDescription: [],
    constraints: [],
    examples: [],
  };

  let section: "desc" | "constraints" | "examples" = "desc";
  let inCodeBlock = false;
  let codeBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("### Problem Description")) {
      section = "desc";
      continue;
    }
    if (trimmed.startsWith("#### Constraints")) {
      section = "constraints";
      continue;
    }
    if (trimmed.startsWith("#### Example")) {
      section = "examples";
      continue;
    }

    // Code block inside examples
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        inCodeBlock = false;
        if (codeBuffer.length > 0) {
          // Parse lines like "Input: ...", "Output: ...", "Explanation: ..."
          let currentInput = "";
          let currentOutput = "";
          let currentExplanation = "";
          const rawLines = codeBuffer.join("\n");

          codeBuffer.forEach((cLine) => {
            const cTrimmed = cLine.trim();
            if (cTrimmed.startsWith("Input:")) {
              currentInput = cTrimmed.replace(/^Input:\s*/, "");
            } else if (cTrimmed.startsWith("Output:")) {
              currentOutput = cTrimmed.replace(/^Output:\s*/, "");
            } else if (cTrimmed.startsWith("Explanation:") || cTrimmed.startsWith("#")) {
              currentExplanation = cTrimmed.replace(/^(Explanation:\s*|#\s*)/, "");
            }
          });

          if (currentInput || currentOutput) {
            result.examples.push({
              input: currentInput,
              output: currentOutput,
              explanation: currentExplanation,
              rawCode: rawLines,
            });
          } else {
            result.examples.push({ rawCode: rawLines });
          }
          codeBuffer = [];
        }
      } else {
        inCodeBlock = true;
        codeBuffer = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      continue;
    }

    if (!trimmed) continue;

    if (section === "desc") {
      result.problemDescription.push(line);
    } else if (section === "constraints") {
      if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        result.constraints.push(trimmed.replace(/^[-*]\s*/, ""));
      } else {
        result.constraints.push(trimmed);
      }
    } else if (section === "examples") {
      // Freeform example line outside of code block
      if (trimmed.includes("Input:") || trimmed.includes("Output:")) {
        const parts = trimmed.split(/->|Output:/);
        if (parts.length >= 2) {
          result.examples.push({
            input: parts[0].replace(/^Input:\s*/, "").trim(),
            output: parts[1].trim(),
          });
        }
      }
    }
  }

  return result;
}

export const ExerciseFormatter: React.FC<ExerciseFormatterProps> = ({
  exercise,
  onNavigateToTheory,
  showTheoryLink = true,
}) => {
  const [showHints, setShowHints] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const parsed = parseExerciseMarkdown(exercise.descriptionMarkdown);

  const handleCopyInput = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "Easy":
        return "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30";
      case "Medium":
        return "bg-[#e5993e]/10 text-[#e5993e] border-[#e5993e]/30";
      case "Hard":
        return "bg-[#eb5757]/10 text-[#eb5757] border-[#eb5757]/30";
      default:
        return "bg-[#8a8f98]/10 text-[#8a8f98] border-[#8a8f98]/30";
    }
  };

  return (
    <div className="rounded-xl bg-[#0b0c0e] border border-[#23252a] p-5 space-y-5 shadow-xl text-left">
      {/* 1. Header Bar: Identity, Level, Tier, & Optional Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f2126]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#16171a] text-[#8a8f98] border border-[#2e3038] font-semibold uppercase">
              {exercise.id}
            </span>
            <span
              className={cn(
                "text-[11px] font-mono px-2 py-0.5 rounded font-semibold border",
                getDifficultyBadge(exercise.difficulty)
              )}
            >
              {exercise.difficulty}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#5e6ad2]/10 text-[#707cf0] border border-[#5e6ad2]/30 font-medium">
              {exercise.tier}
            </span>
            {exercise.tags && exercise.tags.length > 0 && (
              <span className="text-xs text-[#565961] hidden md:inline">•</span>
            )}
            <div className="hidden md:flex items-center gap-1.5">
              {exercise.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono text-[#8a8f98] bg-[#121316] px-1.5 py-0.5 rounded border border-[#23252a]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#f7f8f8] tracking-tight">
            {exercise.title}
          </h2>
          {exercise.leetcodeEquivalent && (
            <p className="text-xs font-mono text-[#8a8f98]">
              Interview Equivalent:{" "}
              <span className="text-[#d0d6e0] font-semibold">
                {exercise.leetcodeEquivalent}
              </span>
            </p>
          )}
        </div>

        {showTheoryLink && onNavigateToTheory && (
          <button
            onClick={onNavigateToTheory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2e3038] bg-[#141517] hover:bg-[#1a1c20] text-xs font-mono text-[#8a8f98] hover:text-white transition-all shrink-0 self-start sm:self-auto"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>Review Theory</span>
            <ArrowRight className="w-3 h-3 text-[#565961]" />
          </button>
        )}
      </div>

      {/* 2. Problem Statement (Plain English, Friendly, Formatted) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8a8f98] uppercase tracking-wider">
          <Code2 className="w-3.5 h-3.5 text-[#5e6ad2]" />
          <span>Challenge Invariant</span>
        </div>
        <div className="text-xs sm:text-sm text-[#d0d6e0] leading-relaxed font-sans space-y-2">
          {parsed.problemDescription.length > 0 ? (
            parsed.problemDescription.map((descLine, idx) => (
              <p key={idx}>{renderRichInline(descLine)}</p>
            ))
          ) : (
            <p>
              Implement the logic adhering to the module specifications and pass all automated test assertions.
            </p>
          )}
        </div>
      </div>

      {/* 3. Examples Section (Structured LeetCode-style cards) */}
      {parsed.examples.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8a8f98] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Test Case Demonstration</span>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {parsed.examples.map((ex, exIdx) => (
              <div
                key={exIdx}
                className="rounded-lg bg-[#070809] border border-[#23252a] p-3 text-xs font-mono space-y-2"
              >
                {ex.input && (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <span className="text-[#8a8f98] shrink-0 font-semibold text-[11px]">Input:</span>
                      <span className="text-[#56b6c2] break-all">{formatMathSymbols(ex.input)}</span>
                    </div>
                    <button
                      onClick={() => handleCopyInput(ex.input || "", exIdx)}
                      title="Copy input"
                      className="text-[#565961] hover:text-[#8a8f98] p-1 rounded transition-colors"
                    >
                      {copiedIdx === exIdx ? (
                        <Check className="w-3 h-3 text-[#10b981]" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
                {ex.output && (
                  <div className="flex items-start gap-2">
                    <span className="text-[#8a8f98] shrink-0 font-semibold text-[11px]">Output:</span>
                    <span className="text-[#10b981] font-semibold break-all">
                      {formatMathSymbols(ex.output)}
                    </span>
                  </div>
                )}
                {ex.explanation && (
                  <div className="text-[11px] text-[#8a8f98] border-t border-[#1a1b1f] pt-1.5 italic">
                    💡 Explanation: {formatMathSymbols(ex.explanation)}
                  </div>
                )}
                {ex.rawCode && !ex.input && !ex.output && (
                  <pre className="text-xs text-[#56b6c2] whitespace-pre-wrap">
                    {formatMathSymbols(ex.rawCode)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Constraints Section (Badges / Clean Pills) */}
      {parsed.constraints.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-[#8a8f98] uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-[#e5993e]" />
            <span>Boundary Invariants & Target Complexity</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {parsed.constraints.map((c, cIdx) => (
              <div
                key={cIdx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#121316] border border-[#23252a] text-xs font-mono text-[#c1c7d0]"
              >
                {c.toLowerCase().includes("time") ? (
                  <Clock className="w-3 h-3 text-[#5e6ad2]" />
                ) : c.toLowerCase().includes("space") ? (
                  <Layers className="w-3 h-3 text-[#10b981]" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e5993e]" />
                )}
                <span>{renderRichInline(c)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Progressive Hint Helper (Anti-Stuck Guarantee) */}
      {exercise.hints && exercise.hints.length > 0 && (
        <div className="pt-2 border-t border-[#1f2126]">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-xs font-mono text-[#5e6ad2] hover:text-[#7b87f5] transition-colors py-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="font-semibold">
              {showHints ? "Hide Algorithmic Guidance" : "Stuck? View Guided Invariants & Hints"}
            </span>
            {showHints ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showHints && (
            <div className="mt-3 p-3.5 rounded-lg bg-[#0e1013] border border-[#5e6ad2]/20 space-y-2 animate-fadeIn">
              <div className="text-[11px] font-mono font-semibold text-[#5e6ad2] flex items-center gap-1.5">
                <span>💡 GUIDED THINKING PROCESS (ZERO SPOILERS)</span>
              </div>
              <ul className="space-y-1.5 pl-4 list-disc text-xs font-sans text-[#a0a5af] leading-relaxed">
                {exercise.hints.map((hint, hIdx) => (
                  <li key={hIdx}>
                    {renderRichInline(hint)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
