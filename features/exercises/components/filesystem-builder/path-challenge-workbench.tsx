"use client";

import React from "react";
import { Compass, Navigation, ArrowUpRight, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PathChallengeWorkbenchProps {
  absolutePaths: {
    nginx_config: string;
    application_log: string;
    architecture_notes: string;
    production_env_secrets: string;
    application_entrypoint: string;
  };
  relativePaths: {
    from_cloud_app_to_package_json: string;
    from_cloud_app_to_index_js: string;
    from_cloud_app_to_architecture_notes: string;
    from_src_to_application_log: string;
    from_home_to_env_secrets: string;
  };
  onAbsolutePathChange: (key: string, value: string) => void;
  onRelativePathChange: (key: string, value: string) => void;
}

export function PathChallengeWorkbench({
  absolutePaths,
  relativePaths,
  onAbsolutePathChange,
  onRelativePathChange,
}: PathChallengeWorkbenchProps) {
  // Absolute Path Options
  const absoluteQuestions = [
    {
      key: "nginx_config",
      title: "1. Web Server Configuration File",
      fileLeaf: "nginx.conf",
      hint: "Stored inside the system configuration directory /etc.",
      expected: "/etc/nginx.conf",
      options: [
        "/etc/nginx.conf",
        "etc/nginx.conf",
        "/var/log/nginx.conf",
        "/home/alex/nginx.conf",
      ],
    },
    {
      key: "application_log",
      title: "2. Server Application Runtime Log",
      fileLeaf: "app.log",
      hint: "Stored inside the log subfolder of variable system storage /var.",
      expected: "/var/log/app.log",
      options: [
        "/var/log/app.log",
        "/var/app.log",
        "var/log/app.log",
        "/tmp/app.log",
      ],
    },
    {
      key: "architecture_notes",
      title: "3. Developer Architecture Documentation",
      fileLeaf: "architecture-notes.md",
      hint: "Located inside Alex's Documents folder.",
      expected: "/home/alex/Documents/architecture-notes.md",
      options: [
        "/home/alex/Documents/architecture-notes.md",
        "/home/alex/architecture-notes.md",
        "Documents/architecture-notes.md",
        "/Documents/architecture-notes.md",
      ],
    },
    {
      key: "production_env_secrets",
      title: "4. Production Environment API Keys & Secrets",
      fileLeaf: ".env",
      hint: "Located directly inside the cloud-app project directory.",
      expected: "/home/alex/projects/cloud-app/.env",
      options: [
        "/home/alex/projects/cloud-app/.env",
        "/home/alex/.env",
        "/projects/cloud-app/.env",
        "cloud-app/.env",
      ],
    },
    {
      key: "application_entrypoint",
      title: "5. Production Web App Entrypoint Script",
      fileLeaf: "index.js",
      hint: "Located inside the src subfolder of cloud-app.",
      expected: "/home/alex/projects/cloud-app/src/index.js",
      options: [
        "/home/alex/projects/cloud-app/src/index.js",
        "/home/alex/projects/cloud-app/index.js",
        "/src/index.js",
        "src/index.js",
      ],
    },
  ];

  // Relative Path Traversal Questions
  const relativeQuestions = [
    {
      key: "from_cloud_app_to_package_json",
      title: "1. Same Folder Relative Reference",
      cwd: "/home/alex/projects/cloud-app",
      target: "package.json (in current folder)",
      hint: "When a target is in the exact folder you are standing in, use package.json or ./package.json.",
      expected: "package.json",
      options: [
        "package.json",
        "/home/alex/projects/cloud-app/package.json",
        "../package.json",
        "/package.json",
      ],
    },
    {
      key: "from_cloud_app_to_index_js",
      title: "2. Downward Child Folder Reference",
      cwd: "/home/alex/projects/cloud-app",
      target: "index.js (inside src subfolder)",
      hint: "Step down into the src folder without a starting slash.",
      expected: "src/index.js",
      options: [
        "src/index.js",
        "/src/index.js",
        "./src/index.js",
        "../src/index.js",
      ],
    },
    {
      key: "from_cloud_app_to_architecture_notes",
      title: "3. Sibling Directory Traversal (Multi-Hop ..)",
      cwd: "/home/alex/projects/cloud-app",
      target: "architecture-notes.md (in /home/alex/Documents)",
      hint: "Step up to projects (..), step up to alex (..), then enter Documents/.",
      expected: "../../Documents/architecture-notes.md",
      options: [
        "../../Documents/architecture-notes.md",
        "../Documents/architecture-notes.md",
        "Documents/architecture-notes.md",
        "/home/alex/Documents/architecture-notes.md",
      ],
    },
    {
      key: "from_src_to_application_log",
      title: "4. Cross-System Traversal to Server Log",
      cwd: "/home/alex/projects/cloud-app/src",
      target: "app.log (in /var/log)",
      hint: "Step up 4 levels to Root (../../../../), then enter var/log/app.log.",
      expected: "../../../../var/log/app.log",
      options: [
        "../../../../var/log/app.log",
        "../../../var/log/app.log",
        "../../var/log/app.log",
        "/var/log/app.log",
      ],
    },
    {
      key: "from_home_to_env_secrets",
      title: "5. Downward Traversal from Home Workspace",
      cwd: "/home/alex (~)",
      target: ".env (in /home/alex/projects/cloud-app)",
      hint: "Descend into projects/cloud-app/.env without a leading slash.",
      expected: "projects/cloud-app/.env",
      options: [
        "projects/cloud-app/.env",
        "/projects/cloud-app/.env",
        "~/.env",
        "../projects/cloud-app/.env",
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* Absolute Paths Section */}
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span>Challenge 2: Absolute Path Coordinates (Global Addresses)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Select the exact, unambiguous global path starting all the way from Root (/) for each server asset.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-blue-400 border-blue-500/30">
            Starts with /
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {absoluteQuestions.map((q) => {
            const currentVal = absolutePaths[q.key as keyof typeof absolutePaths] || "";
            const isCorrect = currentVal === q.expected;

            return (
              <div
                key={q.key}
                className={`p-4 rounded-xl border transition-all ${
                  !currentVal
                    ? "bg-zinc-950/60 border-border/80"
                    : isCorrect
                    ? "bg-emerald-950/15 border-emerald-500/40"
                    : "bg-destructive/10 border-destructive/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-bold text-sm text-foreground">{q.title}</span>
                  </div>
                  {currentVal && (
                    isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )
                  )}
                </div>

                <p className="text-xs text-muted-foreground mb-3">{q.hint}</p>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Choose Absolute Path:
                  </label>
                  <select
                    value={currentVal}
                    onChange={(e) => onAbsolutePathChange(q.key, e.target.value)}
                    className="w-full text-xs font-mono bg-zinc-900/90 border border-border/80 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Select Global Path Coordinates --</option>
                    {q.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Relative Paths Section */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-border/60 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <Navigation className="w-5 h-5 text-amber-400" />
              <span>Challenge 3: Relative Path Traversal (Navigational Vectors)</span>
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Give step-by-step directions from your Current Working Directory using parent dots (..) and child folders.
            </p>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-amber-400 border-amber-500/30">
            No starting /
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relativeQuestions.map((q) => {
            const currentVal = relativePaths[q.key as keyof typeof relativePaths] || "";
            const isCorrect =
              currentVal === q.expected ||
              (q.key === "from_cloud_app_to_package_json" && currentVal === "./package.json") ||
              (q.key === "from_cloud_app_to_index_js" && currentVal === "./src/index.js");

            return (
              <div
                key={q.key}
                className={`p-4 rounded-xl border transition-all ${
                  !currentVal
                    ? "bg-zinc-950/60 border-border/80"
                    : isCorrect
                    ? "bg-emerald-950/15 border-emerald-500/40"
                    : "bg-destructive/10 border-destructive/40"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="font-bold text-sm text-foreground">{q.title}</span>
                  </div>
                  {currentVal && (
                    isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    )
                  )}
                </div>

                <div className="space-y-1 mb-2 bg-zinc-900/60 p-2 rounded-lg border border-border/40 font-mono text-[11px]">
                  <div className="text-zinc-400">
                    Standing in (CWD): <span className="text-primary font-bold">{q.cwd}</span>
                  </div>
                  <div className="text-zinc-400">
                    Target File: <span className="text-emerald-400 font-bold">{q.target}</span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-3">{q.hint}</p>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-muted-foreground">
                    Choose Relative Navigation Vector:
                  </label>
                  <select
                    value={currentVal}
                    onChange={(e) => onRelativePathChange(q.key, e.target.value)}
                    className="w-full text-xs font-mono bg-zinc-900/90 border border-border/80 rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Select Relative Traversal --</option>
                    {q.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
