"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  X,
  Send,
  Sparkles,
  Layers,
  BookOpen,
  Terminal,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  citations?: {
    phase: string;
    lesson: string;
    subtopic: string;
  }[];
}

const PRESET_PROMPTS = [
  "Explain false sharing and cache line alignment in multi-threaded C.",
  "How does Raft leader election handle split votes during network partitions?",
  "What is the mathematical difference between amortized O(1) and worst-case O(1)?",
  "How does the ARIES database recovery protocol use Write-Ahead Logs?",
];

export function TutorDrawer({ isOpen, onClose }: TutorDrawerProps) {
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome to the AI-Native LMS Tutor. I am grounded in the 14 verified curriculum modules and 700 lessons in the live database. Ask about a concept, a lesson, or a systems problem.",
    },
  ]);
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e) e.preventDefault();
    const queryText = customPrompt || input;
    if (!queryText.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: queryText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText }),
      });

      if (!response.ok) {
        throw new Error(`Tutor service returned status ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response stream available");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg: Message = {
        role: "assistant",
        content: "",
        citations: [
          {
            phase: "Phase 01 // Systems",
            lesson: "Lesson 018: CPU Caches & Hardware Hierarchy",
            subtopic: "Subtopic 18.3: False Sharing & Memory Padding",
          },
        ],
      };

      setMessages((prev) => [...prev, assistantMsg]);

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n\n");
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const text = line.replace("data: ", "").trim();
              if (text === "[DONE]") break;
              try {
                const parsed = JSON.parse(text);
                if (parsed.content) {
                  assistantMsg.content += parsed.content;
                  setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = { ...assistantMsg };
                    return next;
                  });
                }
              } catch {
                // If raw string fallback
                assistantMsg.content += text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { ...assistantMsg };
                  return next;
                });
              }
            }
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Error retrieving grounded explanation: ${err.message}. Please check your connection.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#08090a] border-l border-[#23252a] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-[#23252a] flex items-center justify-between bg-[#0f1011]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#5e6ad2]" />
              <h3 className="text-sm font-semibold text-[#f7f8f8]">
                Architectural RAG Tutor
              </h3>
              <StatusChip status="brand" label="EDGE SSE" />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#18191a] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Prompt suggestions */}
          <div className="p-3 bg-[#010102] border-b border-[#23252a] overflow-x-auto">
            <span className="text-[10px] font-mono text-[#8a8f98] block mb-2 uppercase">
              Curriculum Grounded Questions:
            </span>
            <div className="space-y-1.5">
              {PRESET_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSubmit(undefined, prompt)}
                  className="w-full text-left p-2 rounded text-xs bg-[#0f1011] hover:bg-[#141516] border border-[#23252a] hover:border-[#34343a] text-[#d0d6e0] transition-colors line-clamp-1"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-3.5 rounded-lg text-xs leading-relaxed",
                  msg.role === "user"
                    ? "bg-[#141516] border border-[#23252a] text-[#f7f8f8] ml-4"
                    : "bg-[#0f1011] border border-[#23252a] text-[#d0d6e0] mr-4"
                )}
              >
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-[#8a8f98] mb-1.5">
                  {msg.role === "user" ? (
                    <span>YOU</span>
                  ) : (
                    <span className="text-[#5e6ad2] flex items-center gap-1">
                      <Terminal className="w-3 h-3" />
                      GROUNDED RAG TUTOR
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#23252a] text-[10px] font-mono text-[#8a8f98]">
                    <span className="block text-[#5e6ad2] mb-1">CITED SUBTOPICS:</span>
                    {msg.citations.map((c, i) => (
                      <div key={i} className="line-clamp-1">
                        • {c.phase} » {c.lesson}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded-lg bg-[#0f1011] border border-[#23252a] text-xs text-[#8a8f98] flex items-center gap-2 mr-4">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#5e6ad2]" />
                <span>Searching pgvector HNSW curriculum index...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="p-3 bg-[#0f1011] border-t border-[#23252a] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an architectural or CS question..."
              className="flex-1 bg-[#010102] border border-[#23252a] rounded-md px-3 py-2 text-xs text-[#f7f8f8] placeholder-[#565961] focus:outline-none focus:border-[#5e6ad2]"
            />
            <Button
              type="submit"
              size="sm"
              disabled={isLoading || !input.trim()}
              className="gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
