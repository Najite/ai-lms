import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Award,
  ShieldCheck,
  FileCode,
  FolderGit2,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import type { PortfolioSummaryView } from "../types";

export interface PortfolioOverviewProps {
  summary: PortfolioSummaryView | null;
  isLoading?: boolean;
}

export function PortfolioOverview({ summary, isLoading }: PortfolioOverviewProps) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-zinc-900/60 border border-zinc-800/80" />
        ))}
      </div>
    );
  }

  const { portfolio, stats } = summary;

  const statItems = [
    {
      label: "Projects",
      value: stats.totalProjects,
      icon: FolderGit2,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Evidence Items",
      value: stats.totalEvidence,
      icon: ShieldCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      label: "Artifacts",
      value: stats.totalArtifacts,
      icon: FileCode,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      label: "Competencies",
      value: stats.totalCompetencies,
      icon: Briefcase,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    {
      label: "Achievements",
      value: stats.totalAchievements,
      icon: Award,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      label: "Hiring Signals",
      value: stats.totalSignals,
      icon: Sparkles,
      color: "text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Header Profile Card */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100">
                {portfolio.title || "AI Software Engineer Portfolio"}
              </h1>
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs px-3 py-1 flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Mastery</span>
              </Badge>
            </div>
            <p className="text-zinc-400 text-sm md:text-base max-w-3xl leading-relaxed">
              {portfolio.description ||
                "A comprehensive, cryptographically verified record of software engineering competencies, automated exercise completions, verified milestone gates, and production artifacts."}
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className={`border ${item.borderColor} bg-zinc-900/40 backdrop-blur-sm transition-all hover:bg-zinc-900/80 hover:scale-[1.02]`}
            >
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <div className={`p-2 rounded-lg ${item.bgColor}`}>
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono text-zinc-100">{item.value}</div>
                  <div className="text-xs font-medium text-zinc-400">{item.label}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
