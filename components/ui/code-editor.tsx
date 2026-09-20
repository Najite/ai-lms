"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeEditorProps {
  value: string;
  onChange?: (val: string) => void;
  onRun?: () => void;
  readOnly?: boolean;
  disabled?: boolean;
  minHeight?: string;
  className?: string;
  language?: string;
}

// Python reserved keywords
const PYTHON_KEYWORDS = new Set([
  "def",
  "class",
  "return",
  "if",
  "elif",
  "else",
  "while",
  "for",
  "in",
  "try",
  "except",
  "finally",
  "raise",
  "import",
  "from",
  "as",
  "pass",
  "break",
  "continue",
  "lambda",
  "with",
  "yield",
  "assert",
  "global",
  "nonlocal",
  "async",
  "await",
  "is",
  "not",
  "and",
  "or",
]);

// Python built-in constants & boolean literals
const PYTHON_LITERALS = new Set([
  "True",
  "False",
  "None",
]);

// Python standard built-in functions and types
const PYTHON_BUILTINS = new Set([
  "print",
  "len",
  "range",
  "str",
  "int",
  "float",
  "bool",
  "list",
  "dict",
  "set",
  "tuple",
  "min",
  "max",
  "sum",
  "enumerate",
  "zip",
  "map",
  "filter",
  "sorted",
  "reversed",
  "any",
  "all",
  "abs",
  "round",
  "hash",
  "isinstance",
  "issubclass",
  "type",
  "id",
  "input",
  "open",
  "super",
  "self",
  "cls",
]);

/**
 * High-performance, zero-external-dependency Python syntax highlighter.
 * Tokens:
 * - Comments: # ... (muted green/gray #6b7280)
 * - Strings: "..." or '...' or """...""" (vibrant amber/gold #f59e0b)
 * - Keywords: def, class, return, if, for, while... (electric purple #c084fc)
 * - Booleans/None: True, False, None (cyan #38bdf8)
 * - Built-ins: print, len, range, int, list... (emerald green #34d399)
 * - Decorators: @decorator (soft pink #f472b6)
 * - Numbers: 0-9, hex, binary (orange #fb923c)
 * - Functions being defined/called: name(...) (bright blue #60a5fa)
 */
function highlightPythonCode(code: string): React.ReactNode[] {
  const lines = code.split("\n");

  return lines.map((line, lineIndex) => {
    const tokens: React.ReactNode[] = [];
    let i = 0;
    const len = line.length;

    while (i < len) {
      // 1. Single-line Comment: from '#' to end of line
      if (line[i] === "#") {
        const commentText = line.substring(i);
        tokens.push(
          <span key={`${lineIndex}-${i}`} className="text-[#6b7280] italic">
            {commentText}
          </span>
        );
        break;
      }

      // 2. Strings: Single/Double quoted or triple quoted
      if (line[i] === '"' || line[i] === "'") {
        const quoteChar = line[i];
        let strEnd = i + 1;
        let isEscaped = false;

        // Check for triple quotes
        if (line.substring(i, i + 3) === quoteChar.repeat(3)) {
          strEnd = i + 3;
          while (strEnd < len) {
            if (line.substring(strEnd, strEnd + 3) === quoteChar.repeat(3)) {
              strEnd += 3;
              break;
            }
            strEnd++;
          }
        } else {
          // Regular single line string
          while (strEnd < len) {
            if (line[strEnd] === "\\" && !isEscaped) {
              isEscaped = true;
              strEnd++;
              continue;
            }
            if (line[strEnd] === quoteChar && !isEscaped) {
              strEnd++;
              break;
            }
            isEscaped = false;
            strEnd++;
          }
        }

        const strContent = line.substring(i, strEnd);
        tokens.push(
          <span key={`${lineIndex}-${i}`} className="text-[#fbbf24]">
            {strContent}
          </span>
        );
        i = strEnd;
        continue;
      }

      // 3. Decorators: @identifier
      if (line[i] === "@" && (i === 0 || /\s/.test(line[i - 1]))) {
        let decEnd = i + 1;
        while (decEnd < len && /[a-zA-Z0-9_.]/.test(line[decEnd])) {
          decEnd++;
        }
        tokens.push(
          <span key={`${lineIndex}-${i}`} className="text-[#f472b6] font-semibold">
            {line.substring(i, decEnd)}
          </span>
        );
        i = decEnd;
        continue;
      }

      // 4. Numbers: digits, floats, hex (0x...), binary (0b...)
      if (
        /[0-9]/.test(line[i]) &&
        (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))
      ) {
        let numEnd = i + 1;
        while (numEnd < len && /[0-9a-fA-FxXbBoOeE_.]/.test(line[numEnd])) {
          numEnd++;
        }
        tokens.push(
          <span key={`${lineIndex}-${i}`} className="text-[#fb923c]">
            {line.substring(i, numEnd)}
          </span>
        );
        i = numEnd;
        continue;
      }

      // 5. Identifiers (Keywords, Builtins, Literals, Function definitions & calls)
      if (/[a-zA-Z_]/.test(line[i])) {
        let idEnd = i + 1;
        while (idEnd < len && /[a-zA-Z0-9_]/.test(line[idEnd])) {
          idEnd++;
        }
        const word = line.substring(i, idEnd);

        // Peek ahead to see if it's a function call (followed by '(')
        let peek = idEnd;
        while (peek < len && /\s/.test(line[peek])) peek++;
        const isFunctionCall = peek < len && line[peek] === "(";

        if (PYTHON_KEYWORDS.has(word)) {
          tokens.push(
            <span key={`${lineIndex}-${i}`} className="text-[#c084fc] font-semibold">
              {word}
            </span>
          );
        } else if (PYTHON_LITERALS.has(word)) {
          tokens.push(
            <span key={`${lineIndex}-${i}`} className="text-[#38bdf8] font-semibold">
              {word}
            </span>
          );
        } else if (PYTHON_BUILTINS.has(word)) {
          tokens.push(
            <span key={`${lineIndex}-${i}`} className="text-[#34d399] font-medium">
              {word}
            </span>
          );
        } else if (isFunctionCall) {
          tokens.push(
            <span key={`${lineIndex}-${i}`} className="text-[#60a5fa]">
              {word}
            </span>
          );
        } else {
          // Standard variable / parameter identifier
          tokens.push(
            <span key={`${lineIndex}-${i}`} className="text-[#f1f5f9]">
              {word}
            </span>
          );
        }

        i = idEnd;
        continue;
      }

      // 6. Operators & Punctuation: +, -, *, /, ==, !=, :, (, ), [, ], etc.
      if (/[+\-*/%=<>!&|^~:]/.test(line[i])) {
        tokens.push(
          <span key={`${lineIndex}-${i}`} className="text-[#f43f5e]">
            {line[i]}
          </span>
        );
        i++;
        continue;
      }

      // 7. Whitespace and other characters
      tokens.push(line[i]);
      i++;
    }

    return (
      <div key={lineIndex} className="leading-[22px] min-h-[22px]">
        {tokens.length > 0 ? tokens : <span>&nbsp;</span>}
      </div>
    );
  });
}

export function CodeEditor({
  value,
  onChange,
  onRun,
  readOnly = false,
  disabled = false,
  minHeight = "320px",
  className,
  language = "python",
}: CodeEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = React.useRef<HTMLDivElement>(null);
  const highlightOverlayRef = React.useRef<HTMLDivElement>(null);

  // Synchronize vertical and horizontal scrolling across textarea, line numbers, and syntax overlay
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const top = e.currentTarget.scrollTop;
    const left = e.currentTarget.scrollLeft;

    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = top;
    }
    if (highlightOverlayRef.current) {
      highlightOverlayRef.current.scrollTop = top;
      highlightOverlayRef.current.scrollLeft = left;
    }
  };

  // Keyboard navigation, intelligent indentation, tab handling, bracket pairing
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 1. Run shortcut: Ctrl+Enter or Cmd+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      if (onRun) onRun();
      return;
    }

    if (readOnly || disabled || !onChange) return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value: currentVal } = textarea;

    // 2. Tab key handling: Indent or Unindent 4 spaces
    if (e.key === "Tab") {
      e.preventDefault();
      const tabStr = "    "; // 4 spaces standard PEP-8 Python

      if (e.shiftKey) {
        // Shift+Tab: Unindent current line or selected lines
        const beforeCursor = currentVal.substring(0, selectionStart);
        const lineStartIndex = beforeCursor.lastIndexOf("\n") + 1;
        const lineContent = currentVal.substring(lineStartIndex, selectionStart);

        if (lineContent.startsWith("    ")) {
          const newVal =
            currentVal.substring(0, lineStartIndex) +
            currentVal.substring(lineStartIndex + 4);
          onChange(newVal);
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(
              lineStartIndex,
              selectionStart - 4
            );
          });
        } else if (lineContent.startsWith("  ")) {
          const newVal =
            currentVal.substring(0, lineStartIndex) +
            currentVal.substring(lineStartIndex + 2);
          onChange(newVal);
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(
              lineStartIndex,
              selectionStart - 2
            );
          });
        }
      } else {
        // Single Tab: Insert 4 spaces at cursor or indent selection
        if (selectionStart === selectionEnd) {
          const newVal =
            currentVal.substring(0, selectionStart) +
            tabStr +
            currentVal.substring(selectionEnd);
          onChange(newVal);
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart + 4;
          });
        } else {
          // Multi-line indent
          const startLine = currentVal.lastIndexOf("\n", selectionStart - 1) + 1;
          const endLine = currentVal.indexOf("\n", selectionEnd);
          const actualEnd = endLine === -1 ? currentVal.length : endLine;
          const selectedBlock = currentVal.substring(startLine, actualEnd);

          const indentedBlock = selectedBlock
            .split("\n")
            .map((line) => tabStr + line)
            .join("\n");

          const newVal =
            currentVal.substring(0, startLine) +
            indentedBlock +
            currentVal.substring(actualEnd);

          onChange(newVal);
          requestAnimationFrame(() => {
            textarea.selectionStart = startLine;
            textarea.selectionEnd = startLine + indentedBlock.length;
          });
        }
      }
      return;
    }

    // 3. Enter key handling: Auto-indent to match previous line, plus extra 4 spaces if ends in ':'
    if (e.key === "Enter") {
      e.preventDefault();
      const beforeCursor = currentVal.substring(0, selectionStart);
      const afterCursor = currentVal.substring(selectionEnd);

      const lastNewLineIndex = beforeCursor.lastIndexOf("\n");
      const currentLine =
        lastNewLineIndex === -1
          ? beforeCursor
          : beforeCursor.substring(lastNewLineIndex + 1);

      // Extract leading spaces
      const match = currentLine.match(/^(\s*)/);
      let indent = match ? match[1] : "";

      // If the current line trimmed ends with a colon ':', increase indentation by 4 spaces
      const trimmedLine = currentLine.trimEnd();
      if (trimmedLine.endsWith(":")) {
        indent += "    ";
      }

      const insertion = "\n" + indent;
      const newVal = beforeCursor + insertion + afterCursor;
      onChange(newVal);

      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd =
          selectionStart + insertion.length;
      });
      return;
    }

    // 4. Bracket and Quote Auto-Pairing
    const pairs: Record<string, string> = {
      "(": ")",
      "[": "]",
      "{": "}",
      '"': '"',
      "'": "'",
    };

    if (pairs[e.key]) {
      const open = e.key;
      const close = pairs[open];

      // If text is selected, wrap selection in pair
      if (selectionStart !== selectionEnd) {
        e.preventDefault();
        const selectedText = currentVal.substring(selectionStart, selectionEnd);
        const newVal =
          currentVal.substring(0, selectionStart) +
          open +
          selectedText +
          close +
          currentVal.substring(selectionEnd);
        onChange(newVal);
        requestAnimationFrame(() => {
          textarea.selectionStart = selectionStart + 1;
          textarea.selectionEnd = selectionEnd + 1;
        });
        return;
      }

      // If cursor is right before the closing character already, just skip over it
      if (currentVal[selectionStart] === close && open === close) {
        e.preventDefault();
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
        return;
      }

      // Auto-insert pair
      e.preventDefault();
      const newVal =
        currentVal.substring(0, selectionStart) +
        open +
        close +
        currentVal.substring(selectionEnd);
      onChange(newVal);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1;
      });
      return;
    }

    // 5. Backspace handling for paired brackets and 4-space un-indent
    if (e.key === "Backspace" && selectionStart === selectionEnd && selectionStart > 0) {
      const charBefore = currentVal[selectionStart - 1];
      const charAfter = currentVal[selectionStart];

      // If between matching pair, delete both
      if (
        (charBefore === "(" && charAfter === ")") ||
        (charBefore === "[" && charAfter === "]") ||
        (charBefore === "{" && charAfter === "}") ||
        (charBefore === '"' && charAfter === '"') ||
        (charBefore === "'" && charAfter === "'")
      ) {
        e.preventDefault();
        const newVal =
          currentVal.substring(0, selectionStart - 1) +
          currentVal.substring(selectionStart + 1);
        onChange(newVal);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = selectionStart - 1;
        });
        return;
      }

      // If 4 spaces immediately precede cursor, backspace removes all 4
      const beforeCursor = currentVal.substring(0, selectionStart);
      if (beforeCursor.endsWith("    ")) {
        const lastNewLine = beforeCursor.lastIndexOf("\n");
        const lineContent =
          lastNewLine === -1
            ? beforeCursor
            : beforeCursor.substring(lastNewLine + 1);

        // Only collapse 4 spaces if it's pure indentation on that line
        if (/^\s+$/.test(lineContent)) {
          e.preventDefault();
          const newVal =
            currentVal.substring(0, selectionStart - 4) +
            currentVal.substring(selectionStart);
          onChange(newVal);
          requestAnimationFrame(() => {
            textarea.selectionStart = textarea.selectionEnd = selectionStart - 4;
          });
        }
      }
    }
  };

  const lines = (value || "").split("\n");
  const lineCount = Math.max(lines.length, 1);
  const highlightedTokens = React.useMemo(() => highlightPythonCode(value || ""), [value]);

  return (
    <div
      className={cn(
        "relative flex w-full font-mono text-xs bg-[#010102] border-t border-[#1e2025] select-text overflow-hidden",
        className
      )}
      style={{ minHeight }}
    >
      {/* Line Numbers Gutter */}
      <div
        ref={lineNumbersRef}
        aria-hidden="true"
        className="shrink-0 w-12 py-4 pl-3 pr-2 text-right bg-[#050607] border-r border-[#1e2025] text-[#444750] select-none overflow-hidden font-mono text-[11px] leading-[22px]"
      >
        {Array.from({ length: lineCount }).map((_, i) => (
          <div key={i} className="hover:text-[#8a8f98] transition-colors">
            {i + 1}
          </div>
        ))}
      </div>

      {/* Editor Container with Highlighting Overlay and Transparent Textarea */}
      <div className="relative flex-1 h-full min-h-inherit overflow-hidden">
        {/* Real-time Syntax Highlight Render Overlay */}
        <div
          ref={highlightOverlayRef}
          aria-hidden="true"
          className="absolute inset-0 p-4 pl-3 pointer-events-none font-mono text-xs leading-[22px] whitespace-pre overflow-hidden tab-4"
          style={{
            tabSize: 4,
          }}
        >
          {highlightedTokens}
        </div>

        {/* Interactive Editing Textarea (Caret, Typing, Selection with transparent text) */}
        <textarea
          ref={textareaRef}
          value={value}
          readOnly={readOnly}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          className={cn(
            "relative w-full h-full min-h-[inherit] bg-transparent text-transparent caret-white font-mono text-xs p-4 pl-3 leading-[22px] focus:outline-none resize-none selection:bg-[#5e6ad2]/30 tab-4 whitespace-pre overflow-auto",
            disabled && "opacity-50 cursor-not-allowed",
            readOnly && "cursor-default"
          )}
          style={{
            tabSize: 4,
            minHeight,
          }}
        />
      </div>
    </div>
  );
}
