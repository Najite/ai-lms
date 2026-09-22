"use client";

import * as React from "react";
import { Terminal, CheckCircle2, GitCommit, ShieldCheck, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityDay {
  date: string;
  count: number; // number of AST assertions / test runs
}

// Generate deterministic 12-week activity data without streak gamification
function generateActivityMatrix(): ActivityDay[][] {
  const weeks: ActivityDay[][] = [];
  const today = new Date();

  for (let w = 11; w >= 0; w--) {
    const days: ActivityDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      // Deterministic simulation based on day of week and week index
      const seed = (w * 7 + d) % 9;
      const count = seed === 0 ? 0 : seed === 1 ? 4 : seed === 3 ? 12 : seed === 5 ? 8 : 2;
      days.push({
        date: date.toISOString().split("T")[0],
        count,
      });
    }
    weeks.push(days);
  }
  return weeks;
}

const RECENT_VERIFICATIONS = [
  {
    id: "run-948",
    lesson: "Phase 03 // L116: LRU Cache O(1) Eviction",
    type: "Pyodide WASM AST",
    assertions: "14/14 Passed",
    duration: "18ms",
    time: "2 hours ago",
    status: "SUCCESS",
  },
  {
    id: "run-947",
    lesson: "Phase 02 // L045: Dynamic Array Geometric Expansion",
    type: "Pyodide WASM AST",
    assertions: "3/3 Passed",
    duration: "12ms",
    time: "Yesterday",
    status: "SUCCESS",
  },
  {
    id: "run-946",
    lesson: "Phase 00 // Capstone 01: PromptCLI AI Workbench",
    type: "GitHub Actions CI",
    assertions: "Pytest: 12/12 Passed / 100% Coverage",
    duration: "4.2s",
    time: "3 days ago",
    status: "SUCCESS",
  },
];

export function ActivityGrid() {
  const weeks = React.useMemo(() => generateActivityMatrix(), []);

  return (
    <div className="space-y-6">
      {/* Activity Heatmap Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#23252a] gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#f7f8f8] flex items-center gap-2">
            <span>Verified Engineering Telemetry</span>
            <span className="text-xs font-mono text-[#10b981]">100% Self-Paced</span>
          </h3>
          <p className="text-xs text-[#8a8f98]">
            Objective historical record of verified AST rubrics and GitHub Actions test runs. Zero artificial streaks.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-[#8a8f98]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#18191a] border border-[#23252a]" />
            <span className="text-[10px]">0</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#5e6ad2]/30 border border-[#5e6ad2]/50" />
            <span className="text-[10px]">1-4</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#5e6ad2]/70" />
            <span className="text-[10px]">5-9</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#5e6ad2]" />
            <span className="text-[10px]">10+</span>
          </div>
        </div>
      </div>

      {/* Linear Obsidian Grid Container */}
      <div className="p-4 rounded-lg bg-[#08090a] border border-[#23252a] overflow-x-auto shadow-inner">
        <div className="inline-flex gap-1.5">
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => {
                const colorClass =
                  day.count === 0
                    ? "bg-[#101114] border border-[#1b1c20]"
                    : day.count <= 4
                    ? "bg-[#5e6ad2]/20 border border-[#5e6ad2]/30"
                    : day.count <= 8
                    ? "bg-[#5e6ad2]/60"
                    : "bg-[#5e6ad2] shadow-sm";

                return (
                  <div
                    key={dIdx}
                    title={`${day.date}: ${day.count} verified checks`}
                    className={cn(
                      "w-3.5 h-3.5 rounded-[2px] transition-all hover:scale-125 cursor-pointer",
                      colorClass
                    )}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="pt-3 text-[10px] font-mono text-[#565961] flex justify-between">
          <span>12 weeks ago</span>
          <span>Today (Self-Paced Mastery)</span>
        </div>
      </div>

      {/* Recent Verifications Log Table */}
      <div className="rounded-lg border border-[#23252a] bg-[#08090a] overflow-hidden">
        <div className="px-4 py-2.5 bg-[#0f1011] border-b border-[#23252a] flex items-center justify-between text-xs font-mono text-[#8a8f98]">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-[#5e6ad2]" />
            RECENT AST & CI VERIFICATIONS
          </span>
          <span>STATUS</span>
        </div>

        <div className="divide-y divide-[#18191a] text-xs font-mono">
          {RECENT_VERIFICATIONS.map((item) => (
            <div
              key={item.id}
              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-[#0f1011] transition-colors"
            >
              <div className="space-y-0.5">
                <div className="text-[#f7f8f8] font-medium">{item.lesson}</div>
                <div className="text-[11px] text-[#8a8f98] flex items-center gap-2">
                  <span className="text-[#5e6ad2]">{item.type}</span>
                  <span>•</span>
                  <span>{item.assertions}</span>
                  <span>•</span>
                  <span>{item.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#565961]">{item.time}</span>
                <span className="px-2 py-0.5 rounded bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 text-[10px] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  PASSED
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
