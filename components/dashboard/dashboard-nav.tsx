"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  LayoutDashboard,
  BookOpen,
  FolderGit2,
  Terminal,
  BookmarkCheck,
  Bot,
  ArrowLeft,
  ShieldCheck,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRICULUM_META, formatLessonTotal } from "@/lib/curriculum-meta";

export type DashboardTab = "overview" | "workspace" | "exercises" | "curriculum" | "capstones" | "notes";

interface DashboardNavProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onOpenTutor: () => void;
  completedLessonsCount: number;
}

export function DashboardNav({
  activeTab,
  onTabChange,
  onOpenTutor,
  completedLessonsCount,
}: DashboardNavProps) {
  const tabs: { id: DashboardTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "workspace", label: "Interactive IDE", icon: Terminal },
    { id: "exercises", label: "LeetCode & Systems Exercises", icon: Code2 },
    { id: "curriculum", label: "Curriculum Tree", icon: BookOpen },
    { id: "capstones", label: "Capstone Projects", icon: FolderGit2 },
    { id: "notes", label: "Architecture Notes", icon: BookmarkCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#23252a] bg-[#010102]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Brand & Home Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-mono text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Landing</span>
          </Link>

          <span className="text-[#383b42] text-xs">/</span>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-[4px] bg-[#5e6ad2] flex items-center justify-center text-white font-mono text-[10px] font-bold">
              L
            </div>
            <span className="font-mono text-xs text-[#f7f8f8] uppercase font-semibold hidden md:inline">
              Student Dashboard
            </span>
          </div>

          <StatusChip status="passed" label="ZERO URGENCY" size="sm" />
        </div>

        {/* Center Tab Navigation (Codecademy + Educative Hybrid) */}
        <nav className="flex items-center gap-1 bg-[#08090a] p-1 rounded-lg border border-[#23252a] overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-[#141516] text-[#f7f8f8] border border-[#34343a] shadow-sm"
                    : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011]"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-[#5e6ad2]" : "text-[#8a8f98]")} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Progress Telemetry & AI Tutor */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-[#08090a] border border-[#23252a] font-mono text-xs text-[#8a8f98]">
            <span className="text-[#10b981] font-semibold">{completedLessonsCount}</span>
            <span>/</span>
            <span>{formatLessonTotal(CURRICULUM_META.totalLessons)} Lessons</span>
          </div>

          <Button
            variant="outline"
            size="xs"
            onClick={onOpenTutor}
            className="gap-1.5 font-mono text-[11px]"
          >
            <Bot className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span className="hidden sm:inline">AI Tutor</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
