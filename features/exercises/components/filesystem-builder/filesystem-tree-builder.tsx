"use client";

import React from "react";
import { Folder, FolderTree, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface DirectoryNode {
  path: string;
  name: string;
  parent: string | null;
  allowedParents: (string | null)[];
  description: string;
  type: "directory";
}

export const INITIAL_DIRECTORY_NODES: DirectoryNode[] = [
  {
    path: "/",
    name: "/ (Root Origin)",
    parent: null,
    allowedParents: [null],
    description: "The absolute top origin of the computer. Has no parent.",
    type: "directory",
  },
  {
    path: "/bin",
    name: "bin",
    parent: "/",
    allowedParents: ["/"],
    description: "Core operating system executables and binary programs.",
    type: "directory",
  },
  {
    path: "/etc",
    name: "etc",
    parent: "/",
    allowedParents: ["/"],
    description: "System-wide configuration files (e.g. nginx.conf).",
    type: "directory",
  },
  {
    path: "/home",
    name: "home",
    parent: "/",
    allowedParents: ["/"],
    description: "Top-level container for all user workspaces.",
    type: "directory",
  },
  {
    path: "/var",
    name: "var",
    parent: "/",
    allowedParents: ["/"],
    description: "Variable runtime data, spools, and system log files.",
    type: "directory",
  },
  {
    path: "/tmp",
    name: "tmp",
    parent: "/",
    allowedParents: ["/"],
    description: "Temporary files automatically cleared on reboot.",
    type: "directory",
  },
  {
    path: "/var/log",
    name: "log",
    parent: null, // Learner needs to assign to /var
    allowedParents: ["/var", "/", "/tmp", "/etc"],
    description: "System and application log files.",
    type: "directory",
  },
  {
    path: "/home/alex",
    name: "alex (~ Home Workspace)",
    parent: null, // Learner needs to assign to /home
    allowedParents: ["/home", "/", "/var", "/tmp"],
    description: "Personal user account directory for Alex.",
    type: "directory",
  },
  {
    path: "/home/alex/Documents",
    name: "Documents",
    parent: null, // Learner needs to assign to /home/alex
    allowedParents: ["/home/alex", "/home", "/"],
    description: "User documentation and architecture notes.",
    type: "directory",
  },
  {
    path: "/home/alex/projects",
    name: "projects",
    parent: null, // Learner needs to assign to /home/alex
    allowedParents: ["/home/alex", "/home", "/"],
    description: "Development projects workspace folder.",
    type: "directory",
  },
  {
    path: "/home/alex/projects/cloud-app",
    name: "cloud-app",
    parent: null, // Learner needs to assign to /home/alex/projects
    allowedParents: ["/home/alex/projects", "/home/alex", "/home"],
    description: "Production web application repository folder.",
    type: "directory",
  },
  {
    path: "/home/alex/projects/cloud-app/src",
    name: "src",
    parent: null, // Learner needs to assign to /home/alex/projects/cloud-app
    allowedParents: ["/home/alex/projects/cloud-app", "/home/alex/projects", "/home/alex"],
    description: "Application source code directory containing index.js.",
    type: "directory",
  },
];

export interface FilesystemTreeBuilderProps {
  nodes: DirectoryNode[];
  onNodeParentChange: (path: string, newParent: string | null) => void;
}

export function FilesystemTreeBuilder({
  nodes,
  onNodeParentChange,
}: FilesystemTreeBuilderProps) {
  const isCorrect = (node: DirectoryNode) => {
    if (node.path === "/") return node.parent === null;
    if (node.path === "/var/log") return node.parent === "/var";
    if (node.path === "/home/alex") return node.parent === "/home";
    if (node.path === "/home/alex/Documents") return node.parent === "/home/alex";
    if (node.path === "/home/alex/projects") return node.parent === "/home/alex";
    if (node.path === "/home/alex/projects/cloud-app") return node.parent === "/home/alex/projects";
    if (node.path === "/home/alex/projects/cloud-app/src")
      return node.parent === "/home/alex/projects/cloud-app";
    return node.parent === "/";
  };

  const configuredCount = nodes.filter(
    (n) => n.path === "/" || (n.parent !== null && isCorrect(n))
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-zinc-900/60 border border-border/60">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-primary" />
            <span>Challenge 1: Directory Tree Topology & Anchors</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Reconstruct the server hierarchy by assigning each directory to its correct parent container.
          </p>
        </div>
        <Badge
          variant={configuredCount === nodes.length ? "success" : "secondary"}
          className="text-xs px-3 py-1 font-mono shrink-0"
        >
          {configuredCount} / {nodes.length} Directories Mapped
        </Badge>
      </div>

      {/* Directory Node Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => {
          const correct = isCorrect(node);
          const isRoot = node.path === "/";

          return (
            <div
              key={node.path}
              className={`p-4 rounded-xl border transition-all ${
                isRoot
                  ? "bg-red-950/20 border-red-500/40"
                  : node.parent === null
                  ? "bg-zinc-950/60 border-amber-500/40 shadow-sm"
                  : correct
                  ? "bg-emerald-950/15 border-emerald-500/40"
                  : "bg-destructive/10 border-destructive/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isRoot
                        ? "bg-red-500/20 text-red-400"
                        : node.path.includes("alex")
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    <Folder className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-mono text-sm font-bold text-foreground block truncate">
                      {node.name}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground block truncate">
                      {node.path}
                    </span>
                  </div>
                </div>

                {isRoot ? (
                  <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30">
                    Root Origin
                  </Badge>
                ) : correct ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                )}
              </div>

              <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{node.description}</p>

              {/* Parent Selector */}
              {isRoot ? (
                <div className="text-xs font-mono text-zinc-400 bg-zinc-900/80 px-3 py-2 rounded-lg border border-border/40 flex items-center justify-between">
                  <span>Parent Directory:</span>
                  <span className="text-red-400 font-bold">null (Origin)</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground flex items-center justify-between">
                    <span>Select Parent Directory:</span>
                    {node.parent && (
                      <span className="font-mono text-[10px] text-zinc-400">
                        Lives inside: {node.parent}
                      </span>
                    )}
                  </label>
                  <select
                    value={node.parent || ""}
                    onChange={(e) => onNodeParentChange(node.path, e.target.value || null)}
                    className="w-full text-xs font-mono bg-zinc-900/90 border border-border/80 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Choose Parent Folder --</option>
                    {node.allowedParents.map((parentOption) => (
                      <option key={parentOption || "null"} value={parentOption || ""}>
                        {parentOption === null ? "null (Top Level)" : parentOption}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
