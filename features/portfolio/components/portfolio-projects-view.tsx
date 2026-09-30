import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FolderGit2, Plus, Calendar, Layers, CheckCircle2, Clock, Archive } from "lucide-react";
import type { PortfolioProject, PortfolioProjectStatus } from "../types";

export interface PortfolioProjectsViewProps {
  projects: PortfolioProject[];
  onOpenCreateModal?: () => void;
  isLoading?: boolean;
}

function getStatusBadge(status: PortfolioProjectStatus) {
  switch (status) {
    case "completed":
      return (
        <Badge
          variant="outline"
          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-mono text-xs gap-1 py-0.5"
        >
          <CheckCircle2 className="h-3 w-3" />
          <span>Completed</span>
        </Badge>
      );
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className="border-amber-500/30 bg-amber-500/10 text-amber-300 font-mono text-xs gap-1 py-0.5 animate-pulse"
        >
          <Clock className="h-3 w-3" />
          <span>In Progress</span>
        </Badge>
      );
    case "archived":
      return (
        <Badge
          variant="outline"
          className="border-zinc-700 bg-zinc-800/60 text-zinc-400 font-mono text-xs gap-1 py-0.5"
        >
          <Archive className="h-3 w-3" />
          <span>Archived</span>
        </Badge>
      );
    default:
      return null;
  }
}

export function PortfolioProjectsView({
  projects,
  onOpenCreateModal,
  isLoading,
}: PortfolioProjectsViewProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <FolderGit2 className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Featured Projects</h2>
            <p className="text-xs text-zinc-400">
              Curated software engineering implementations and architectural artifacts
            </p>
          </div>
        </div>

        {onOpenCreateModal && (
          <Button
            onClick={onOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs gap-1.5 h-9 px-3.5 shadow-lg shadow-blue-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-zinc-900/60 border border-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <Card className="border border-zinc-800/80 bg-zinc-900/30 p-8 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3 p-0">
            <FolderGit2 className="h-10 w-10 text-zinc-600" />
            <div className="text-sm font-medium text-zinc-400">No projects added yet</div>
            <p className="text-xs text-zinc-500 max-w-sm">
              Showcase your engineering capabilities by adding projects, exercises, and architectural repositories to your portfolio.
            </p>
            {onOpenCreateModal && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenCreateModal}
                className="mt-2 text-xs border-zinc-700 text-zinc-300 hover:text-white"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Your First Project
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all hover:border-zinc-700 group flex flex-col justify-between"
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="border-zinc-700 bg-zinc-800/50 text-zinc-300 font-mono text-[11px] capitalize flex items-center gap-1"
                  >
                    <Layers className="h-3 w-3 text-zinc-400" />
                    {project.projectType.replace(/_/g, " ")}
                  </Badge>
                  {getStatusBadge(project.status)}
                </div>
                <CardTitle className="text-base font-bold text-zinc-100 group-hover:text-blue-400 transition-colors pt-2">
                  {project.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-4">
                <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                  {project.description || "No project description provided."}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 border-t border-zinc-800/60 pt-3">
                  <Calendar className="h-3 w-3 text-zinc-600" />
                  <span>Added {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
