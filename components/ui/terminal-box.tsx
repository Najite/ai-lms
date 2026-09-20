"use client";

import * as React from "react";
import { Check, Copy, Terminal as TerminalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TerminalBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  command?: string;
  lines?: string[];
  output?: string[];
  statusText?: string;
  status?: "passed" | "failed" | "idle" | "running" | string;
  isSuccess?: boolean;
}

export function TerminalBox({
  title = "terminal_output.log",
  command,
  lines,
  output,
  statusText,
  status,
  isSuccess = true,
  className,
  ...props
}: TerminalBoxProps) {
  const [copied, setCopied] = React.useState(false);

  const displayLines = output || lines || [
    "$ python3 -m pytest tests/test_ast.py -v",
    "============================= test session starts ==============================",
    "collecting ... collected 14 items",
    "",
    "tests/test_ast.py::test_parse_binary_expressions PASSED                  [  7%]",
    "tests/test_ast.py::test_eval_precedence PASSED                          [ 14%]",
    "tests/test_ast.py::test_lexical_closure_scope PASSED                    [ 21%]",
    "tests/test_ast.py::test_recursion_tail_call PASSED                      [ 28%]",
    "tests/test_ast.py::test_memory_leak_free PASSED                         [100%]",
    "",
    "============================== 14 passed in 0.02s ==============================",
  ];

  const derivedSuccess = status ? status === "passed" : isSuccess;
  const derivedStatusText = statusText || (status ? (status === "passed" ? "PASSED" : status === "failed" ? "FAILED" : status.toUpperCase()) : "READY");

  const handleCopy = () => {
    const text = displayLines.join("\n");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={cn(
        "rounded-[6px] border border-[#23252a] bg-[#08090a] overflow-hidden font-mono shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]",
        className
      )}
      {...props}
    >
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#1b1c20] bg-[#0f1012] text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#eb5757]/60 border border-[#eb5757]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#e5993e]/60 border border-[#e5993e]/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cb782]/60 border border-[#4cb782]/80" />
          </div>
          <div className="flex items-center gap-1.5 ml-2 text-[#8a8f98]">
            <TerminalIcon className="w-3.5 h-3.5 text-[#565961]" />
            <span className="text-[#f7f8f8] text-[11px] font-medium">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {derivedStatusText && (
            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-[3px] border uppercase",
                derivedSuccess
                  ? "bg-[#4cb782]/10 text-[#4cb782] border-[#1b4332]"
                  : status === "idle"
                  ? "bg-[#16171a] text-[#8a8f98] border-[#23252a]"
                  : "bg-[#eb5757]/10 text-[#eb5757] border-[#4a1515]"
              )}
            >
              {derivedStatusText}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="text-[#8a8f98] hover:text-[#f7f8f8] p-1 rounded hover:bg-[#1e2023] transition-colors"
            title="Copy terminal contents"
            aria-label="Copy terminal output"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-[#4cb782]" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-3 text-[11px] leading-relaxed overflow-x-auto text-[#8a8f98] max-h-64">
        {command && (
          <div className="text-[#f7f8f8] font-semibold mb-2 flex items-center gap-2">
            <span className="text-[#5e6ad2] select-none">$</span>
            <span>{command}</span>
          </div>
        )}
        {displayLines.map((line, idx) => {
          let lineClass = "text-[#8a8f98]";
          if (line.startsWith("$")) {
            lineClass = "text-[#f7f8f8] font-semibold";
          } else if (line.includes("PASSED") || line.includes("14 passed") || line.includes("✔") || line.includes("Passed")) {
            lineClass = "text-[#4cb782]";
          } else if (line.includes("FAILED") || line.includes("ERROR") || line.includes("✖") || line.includes("TIMEOUT")) {
            lineClass = "text-[#eb5757]";
          } else if (line.startsWith("==")) {
            lineClass = "text-[#565961]";
          }

          return (
            <div key={idx} className={cn("whitespace-pre", lineClass)}>
              {line || "\u00A0"}
            </div>
          );
        })}
      </div>
    </div>
  );
}
