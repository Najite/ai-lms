"use client";

import * as React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Award,
  Compass,
  Layers,
  BookmarkCheck,
  Terminal,
  Code2,
  BookOpen,
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  Activity,
  Bot,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CURRICULUM_META } from "@/lib/curriculum-meta";

export type DashboardView =
  | "overview"
  | "skill-iq"
  | "role-iq"
  | "paths"
  | "channels"
  | "workspace"
  | "exercises"
  | "curriculum"
  | "capstones"
  | "notes";

interface DashboardSidebarProps {
  activeView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  onOpenTutor: () => void;
  completedLessonsCount: number;
  /** Live lesson total from the shared catalog. Never hardcode this. */
  totalLessons: number;
}

interface NavItem {
  id: DashboardView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isNew?: boolean;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

export function DashboardSidebar({
  activeView,
  onViewChange,
  onOpenTutor,
  completedLessonsCount,
  totalLessons,
}: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const navGroups: NavGroup[] = [
    {
      groupName: "DASHBOARD",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
      ],
    },
    {
      groupName: `YOUR LEARNING (${totalLessons} LESSONS)`,
      items: [
        { id: "curriculum", label: "Learning map", icon: BookOpen, badge: `${Math.max(1, totalLessons / 50)} Modules` },
        { id: "paths", label: "Learning paths", icon: Compass, badge: "Structured" },
      ],
    },
    {
      groupName: "LEARN BY DOING",
      items: [
        { id: "workspace", label: "Learn & practice", icon: Terminal, badge: "Guided" },
        { id: "exercises", label: "Practice", icon: Code2 },
        { id: "capstones", label: "Build projects", icon: FolderGit2, badge: `${CURRICULUM_META.totalCapstones} Projects` },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between border-r border-[#23252a] bg-[#08090a] transition-all duration-200 shrink-0 select-none",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Top Header & Platform Tag */}
      <div>
        <div className="flex items-center justify-between h-14 px-4 border-b border-[#23252a] bg-[#010102]">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded-[4px] bg-[#5e6ad2] flex items-center justify-center text-white font-mono text-xs font-bold shrink-0 shadow-md">
                L
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-mono text-xs font-bold text-[#f7f8f8] tracking-wider uppercase truncate">
                  AI-Native LMS
                </span>
                <span className="text-[10px] font-mono text-[#565961] truncate">
                  AI-Native Engineering Engine
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="w-8 h-8 mx-auto rounded-[4px] bg-[#5e6ad2] flex items-center justify-center text-white font-mono text-xs font-bold shadow-md">
              L
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-[4px] text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#141516] transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Back to Landing Link */}
        <div className="p-2 border-b border-[#1b1c20]">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 px-2.5 py-1.5 rounded-[4px] text-xs font-mono text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] transition-colors",
              isCollapsed && "justify-center px-0"
            )}
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>Landing Page</span>}
          </Link>
        </div>

        {/* Navigation Group Sections */}
        <div className="p-2 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-2.5 py-1 text-[10px] font-mono tracking-wider text-[#565961] uppercase">
                  {group.groupName}
                </div>
              )}

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onViewChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-[5px] text-xs font-medium transition-all group text-left",
                        isActive
                          ? "bg-[#141516] text-[#f7f8f8] border border-[#2e3038] shadow-sm font-semibold"
                          : "text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#0f1011] border border-transparent",
                        isCollapsed && "justify-center px-0"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0 transition-colors",
                          isActive
                            ? "text-[#5e6ad2]"
                            : "text-[#8a8f98] group-hover:text-[#f7f8f8]"
                        )}
                      />

                      {!isCollapsed && (
                        <div className="flex-1 flex items-center justify-between overflow-hidden">
                          <span className="truncate">{item.label}</span>
                          {item.badge && (
                            <span
                              className={cn(
                                "text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border shrink-0",
                                item.isNew
                                  ? "bg-[#5e6ad2]/15 text-[#5e6ad2] border-[#5e6ad2]/30"
                                  : "bg-[#16171a] text-[#8a8f98] border-[#23252a]"
                              )}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile / Quick Action Widget */}
      <div className="p-3 border-t border-[#23252a] bg-[#010102] space-y-2">
        <button
          onClick={onOpenTutor}
          className={cn(
            "w-full flex items-center gap-2 p-2 rounded-[5px] bg-[#0f1011] border border-[#23252a] hover:border-[#5e6ad2]/50 transition-colors text-xs font-mono text-[#f7f8f8]",
            isCollapsed && "justify-center p-2"
          )}
          title="Open AI Tutor"
        >
          <Bot className="w-4 h-4 text-[#5e6ad2] shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 text-left truncate">
              <span className="block font-semibold">Ask for help</span>
              <span className="text-[10px] text-[#8a8f98] block truncate">Uses your lesson content</span>
            </div>
          )}
        </button>

        {!isCollapsed && (
          <div className="px-1 pt-1 flex items-center justify-between text-[11px] font-mono text-[#565961]">
            <span className="flex items-center gap-1 text-[#10b981]">
              <ShieldCheck className="w-3 h-3" />
              Free Permanent Tier
            </span>
            <span>{completedLessonsCount} / {totalLessons}</span>
          </div>
        )}
      </div>
    </aside>
  );
}
