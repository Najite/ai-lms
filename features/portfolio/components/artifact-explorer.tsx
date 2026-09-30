"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FileCode,
  Search,
  BookOpen,
  CheckSquare,
  Briefcase,
  Award,
  ShieldCheck,
  FileText,
  Palette,
  FolderGit2,
  Calendar,
  Layers,
} from "lucide-react";
import type { PortfolioArtifact, PortfolioArtifactType } from "../types";

export interface ArtifactExplorerProps {
  artifacts: PortfolioArtifact[];
  isLoading?: boolean;
}

function getArtifactIcon(artifactType: PortfolioArtifactType | string) {
  switch (artifactType) {
    case "lesson_evidence":
      return <BookOpen className="h-4 w-4 text-blue-400" />;
    case "exercise_evidence":
      return <CheckSquare className="h-4 w-4 text-emerald-400" />;
    case "competency_evidence":
      return <Briefcase className="h-4 w-4 text-indigo-400" />;
    case "achievement_evidence":
      return <Award className="h-4 w-4 text-purple-400" />;
    case "gate_evidence":
      return <ShieldCheck className="h-4 w-4 text-teal-400" />;
    case "documentation_artifact":
      return <FileText className="h-4 w-4 text-amber-400" />;
    case "design_artifact":
      return <Palette className="h-4 w-4 text-rose-400" />;
    case "project_artifact":
      return <FolderGit2 className="h-4 w-4 text-cyan-400" />;
    default:
      return <FileCode className="h-4 w-4 text-zinc-400" />;
  }
}

export function ArtifactExplorer({ artifacts, isLoading }: ArtifactExplorerProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredArtifacts = artifacts.filter((artifact) => {
    const matchesFilter = filterType === "all" || artifact.artifactType === filterType;
    const matchesSearch =
      searchQuery.trim() === "" ||
      artifact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (artifact.description && artifact.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      artifact.sourceDomain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = [
    { label: "All Artifacts", value: "all" },
    { label: "Exercise Evidence", value: "exercise_evidence" },
    { label: "Gate Evidence", value: "gate_evidence" },
    { label: "Competency Evidence", value: "competency_evidence" },
    { label: "Achievement Evidence", value: "achievement_evidence" },
    { label: "Documentation", value: "documentation_artifact" },
    { label: "Design", value: "design_artifact" },
    { label: "Project", value: "project_artifact" },
  ];

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <FileCode className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Artifact Explorer</h2>
            <p className="text-xs text-zinc-400">
              Browse validated technical code artifacts, documentation, and architectural designs
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search artifacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-zinc-900/60 border-zinc-800 text-xs text-zinc-200 placeholder:text-zinc-500 h-9"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = filterType === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFilterType(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold"
                  : "bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : filteredArtifacts.length === 0 ? (
        <Card className="border border-zinc-800/80 bg-zinc-900/30 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-2 p-0">
            <FileCode className="h-10 w-10 text-zinc-600" />
            <div className="text-sm font-medium text-zinc-400">No matching artifacts found</div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Artifacts are automatically cataloged as you write code, submit exercises, and complete learning units.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArtifacts.map((artifact) => (
            <Card
              key={artifact.id}
              className="border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all p-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-zinc-800/60 border border-zinc-700/50">
                      {getArtifactIcon(artifact.artifactType)}
                    </div>
                    <Badge
                      variant="outline"
                      className="border-zinc-700 bg-zinc-800/60 text-zinc-300 font-mono text-[10px] capitalize"
                    >
                      {artifact.artifactType.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="border-zinc-800 bg-zinc-800/40 text-zinc-500 font-mono text-[10px]">
                    {artifact.sourceDomain}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-100 line-clamp-1">{artifact.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    {artifact.description || "Validated engineering artifact registered to portfolio record."}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/60 text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3" />
                  <span>Domain: {artifact.sourceDomain}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(artifact.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
