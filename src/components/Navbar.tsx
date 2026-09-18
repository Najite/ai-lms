"use client";

import React from "react";
import { Terminal, Flame, Database, Layers, Code2, AlertTriangle, ShieldAlert, Home } from "lucide-react";

interface NavbarProps {
  currentView: "landing" | "galaxy" | "workspace";
  onViewChange: (view: "landing" | "galaxy" | "workspace") => void;
  activeNodeTitle?: string;
  xp: number;
  hackerXp: number;
  level: number;
  streak: number;
  onOpenChaos: () => void;
  onOpenRedTeam: () => void;
}

export function Navbar({
  currentView,
  onViewChange,
  activeNodeTitle,
  xp,
  hackerXp,
  level,
  streak,
  onOpenChaos,
  onOpenRedTeam,
}: NavbarProps) {
  const xpNeeded = level * 300;
  const progressPercent = Math.min(100, Math.round((xp / xpNeeded) * 100));

  return (
    <header className="h-14 border-b border-[#1e222e] bg-[#07080b]/90 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 select-none font-mono">
      {/* Brand & Mode Switcher */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => onViewChange("landing")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded border border-[#2a3041] bg-[#0e1017] group-hover:border-[#06b6d4] flex items-center justify-center text-[#06b6d4] transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wider text-slate-100 flex items-center gap-1.5">
              AI:NATIVE<span className="text-[#06b6d4] text-[10px] uppercase border border-[#06b6d4]/40 px-1 rounded">OS</span>
            </span>
            <span className="text-[10px] text-slate-500 tracking-tight">Enterprise Systems LMS</span>
          </div>
        </div>

        <div className="h-4 w-px bg-[#1e222e] hidden sm:block" />

        {/* View Switcher Buttons */}
        <div className="flex items-center p-0.5 rounded border border-[#1e222e] bg-[#0e1017]">
          <button
            onClick={() => onViewChange("landing")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
              currentView === "landing"
                ? "bg-[#1b1f2c] text-slate-100 border border-[#2a3041]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Home className="w-3.5 h-3.5 text-slate-400" />
            Home
          </button>
          <button
            onClick={() => onViewChange("galaxy")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
              currentView === "galaxy"
                ? "bg-[#1b1f2c] text-slate-100 border border-[#2a3041]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#8b5cf6]" />
            Skill Galaxy
          </button>
          <button
            onClick={() => onViewChange("workspace")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
              currentView === "workspace"
                ? "bg-[#1b1f2c] text-slate-100 border border-[#2a3041]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-[#06b6d4]" />
            Workspace
          </button>
        </div>

        {/* Action Triggers: Chaos Outage & Red-Team Arena */}
        <div className="hidden xl:flex items-center gap-2">
          <button
            onClick={onOpenChaos}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f43f5e]/15 hover:bg-[#f43f5e]/25 text-[#f43f5e] border border-[#f43f5e]/30 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(244,63,94,0.15)]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>P0 Chaos Outage</span>
          </button>

          <button
            onClick={onOpenRedTeam}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8b5cf6]/15 hover:bg-[#8b5cf6]/25 text-[#8b5cf6] border border-[#8b5cf6]/30 text-xs font-semibold transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Red-Team Arena</span>
          </button>
        </div>
      </div>

      {/* Telemetry & User Stats */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Supabase Live Telemetry */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 rounded border border-[#1e222e] bg-[#0e1017] text-[10px] text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-telemetry" />
          <Database className="w-3 h-3 text-[#10b981]" />
          <span>SUPABASE LIVE</span>
        </div>

        {/* Hacker XP */}
        {hackerXp > 0 && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded border border-[#f43f5e]/30 bg-[#f43f5e]/10 text-xs text-[#f43f5e]">
            <ShieldAlert className="w-3 h-3 text-[#f43f5e]" />
            <span>{hackerXp} H-XP</span>
          </div>
        )}

        {/* Streak */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#1e222e] bg-[#0e1017] text-xs text-amber-400">
          <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
          <span className="font-semibold">{streak}</span>
          <span className="text-[9px] text-slate-500 uppercase">Day</span>
        </div>

        {/* Level & XP Gauge */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1">
              <span className="text-[10px] uppercase text-slate-400">Lvl</span>
              <span className="text-xs font-bold text-slate-100 px-1 py-0.2 rounded bg-[#1e222e] border border-[#2a3041]">
                {level}
              </span>
            </div>
            <div className="text-[9px] text-slate-500">
              {xp} / {xpNeeded} XP
            </div>
          </div>
          <div className="w-14 h-1.5 bg-[#1b1f2c] rounded-full overflow-hidden border border-[#2a3041]">
            <div
              className="h-full bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
