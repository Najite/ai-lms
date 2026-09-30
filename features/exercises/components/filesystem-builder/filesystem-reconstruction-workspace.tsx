"use client";

import React, { useState } from "react";
import {
  FolderTree,
  Compass,
  Shield,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Award,
  Loader2,
  Check,
} from "lucide-react";
import {
  FilesystemTreeBuilder,
  INITIAL_DIRECTORY_NODES,
  type DirectoryNode,
} from "./filesystem-tree-builder";
import { PathChallengeWorkbench } from "./path-challenge-workbench";
import {
  PermissionsMatrixEditor,
  type FileSecurityConfig,
} from "./permissions-matrix-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { ValidationResultOutput } from "../../types";

export interface FilesystemReconstructionWorkspaceProps {
  exerciseTitle: string;
  estimatedMinutes: number;
  isSubmitting: boolean;
  isCompleting: boolean;
  validationOutput: ValidationResultOutput | null;
  activeAttemptState?: string;
  isCompleted: boolean;
  onSubmitPayload: (jsonPayload: string) => void;
  onCompleteExercise: () => void;
}

export function FilesystemReconstructionWorkspace({
  exerciseTitle,
  estimatedMinutes,
  isSubmitting,
  isCompleting,
  validationOutput,
  isCompleted,
  onSubmitPayload,
  onCompleteExercise,
}: FilesystemReconstructionWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"topology" | "paths" | "security">("topology");

  // Section 1 State: Topology Nodes
  const [nodes, setNodes] = useState<DirectoryNode[]>(INITIAL_DIRECTORY_NODES);

  // Section 2 & 3 State: Absolute & Relative Paths
  const [absolutePaths, setAbsolutePaths] = useState({
    nginx_config: "",
    application_log: "",
    architecture_notes: "",
    production_env_secrets: "",
    application_entrypoint: "",
  });

  const [relativePaths, setRelativePaths] = useState({
    from_cloud_app_to_package_json: "",
    from_cloud_app_to_index_js: "",
    from_cloud_app_to_architecture_notes: "",
    from_src_to_application_log: "",
    from_home_to_env_secrets: "",
  });

  // Section 4 State: Permissions & Dotfiles
  const [permissions, setPermissions] = useState<{
    nginx_config: FileSecurityConfig;
    env_secrets: FileSecurityConfig;
    application_entrypoint: FileSecurityConfig;
  }>({
    nginx_config: {
      is_hidden: false,
      owner: { read: true, write: true, execute: false },
      group: { read: true, write: false, execute: false },
      others: { read: true, write: false, execute: false },
    },
    env_secrets: {
      is_hidden: false,
      owner: { read: true, write: true, execute: false },
      group: { read: false, write: false, execute: false },
      others: { read: false, write: false, execute: false },
    },
    application_entrypoint: {
      is_hidden: false,
      owner: { read: true, write: true, execute: false },
      group: { read: true, write: false, execute: false },
      others: { read: true, write: false, execute: false },
    },
  });

  // Automatically compile visual state into JSON manifest payload
  const generatePayload = () => {
    return JSON.stringify({
      exercise_code: "EXE-00-01",
      learner_workspace: "/home/alex",
      section_1_topology: nodes.map((n) => ({
        path: n.path,
        parent: n.parent,
        type: n.type,
      })),
      section_2_absolute_paths: absolutePaths,
      section_3_relative_paths: relativePaths,
      section_4_permissions_and_dotfiles: permissions,
    });
  };

  const handleNodeParentChange = (path: string, newParent: string | null) => {
    setNodes((prev) =>
      prev.map((n) => (n.path === path ? { ...n, parent: newParent } : n))
    );
  };

  const handleAbsolutePathChange = (key: string, value: string) => {
    setAbsolutePaths((prev) => ({ ...prev, [key]: value }));
  };

  const handleRelativePathChange = (key: string, value: string) => {
    setRelativePaths((prev) => ({ ...prev, [key]: value }));
  };

  const handlePermissionChange = (
    fileKey: "nginx_config" | "env_secrets" | "application_entrypoint",
    updated: FileSecurityConfig
  ) => {
    setPermissions((prev) => ({ ...prev, [fileKey]: updated }));
  };

  const handleQuickPresetSolution = () => {
    // Correct topology
    setNodes([
      { path: "/", name: "/ (Root Origin)", parent: null, allowedParents: [null], description: "Root", type: "directory" },
      { path: "/bin", name: "bin", parent: "/", allowedParents: ["/"], description: "Binaries", type: "directory" },
      { path: "/etc", name: "etc", parent: "/", allowedParents: ["/"], description: "System configs", type: "directory" },
      { path: "/home", name: "home", parent: "/", allowedParents: ["/"], description: "Home container", type: "directory" },
      { path: "/var", name: "var", parent: "/", allowedParents: ["/"], description: "Variable storage", type: "directory" },
      { path: "/tmp", name: "tmp", parent: "/", allowedParents: ["/"], description: "Temp storage", type: "directory" },
      { path: "/var/log", name: "log", parent: "/var", allowedParents: ["/var"], description: "Logs", type: "directory" },
      { path: "/home/alex", name: "alex (~)", parent: "/home", allowedParents: ["/home"], description: "Alex workspace", type: "directory" },
      { path: "/home/alex/Documents", name: "Documents", parent: "/home/alex", allowedParents: ["/home/alex"], description: "Docs", type: "directory" },
      { path: "/home/alex/projects", name: "projects", parent: "/home/alex", allowedParents: ["/home/alex"], description: "Projects", type: "directory" },
      { path: "/home/alex/projects/cloud-app", name: "cloud-app", parent: "/home/alex/projects", allowedParents: ["/home/alex/projects"], description: "App repo", type: "directory" },
      { path: "/home/alex/projects/cloud-app/src", name: "src", parent: "/home/alex/projects/cloud-app", allowedParents: ["/home/alex/projects/cloud-app"], description: "Source code", type: "directory" },
    ]);

    // Correct Absolute Paths
    setAbsolutePaths({
      nginx_config: "/etc/nginx.conf",
      application_log: "/var/log/app.log",
      architecture_notes: "/home/alex/Documents/architecture-notes.md",
      production_env_secrets: "/home/alex/projects/cloud-app/.env",
      application_entrypoint: "/home/alex/projects/cloud-app/src/index.js",
    });

    // Correct Relative Paths
    setRelativePaths({
      from_cloud_app_to_package_json: "package.json",
      from_cloud_app_to_index_js: "src/index.js",
      from_cloud_app_to_architecture_notes: "../../Documents/architecture-notes.md",
      from_src_to_application_log: "../../../../var/log/app.log",
      from_home_to_env_secrets: "projects/cloud-app/.env",
    });

    // Correct Permissions
    setPermissions({
      nginx_config: {
        is_hidden: false,
        owner: { read: true, write: true, execute: false },
        group: { read: true, write: false, execute: false },
        others: { read: true, write: false, execute: false },
      },
      env_secrets: {
        is_hidden: true,
        owner: { read: true, write: true, execute: false },
        group: { read: false, write: false, execute: false },
        others: { read: false, write: false, execute: false },
      },
      application_entrypoint: {
        is_hidden: false,
        owner: { read: true, write: true, execute: true },
        group: { read: true, write: false, execute: true },
        others: { read: true, write: false, execute: true },
      },
    });
  };

  const handleReset = () => {
    setNodes(INITIAL_DIRECTORY_NODES);
    setAbsolutePaths({
      nginx_config: "",
      application_log: "",
      architecture_notes: "",
      production_env_secrets: "",
      application_entrypoint: "",
    });
    setRelativePaths({
      from_cloud_app_to_package_json: "",
      from_cloud_app_to_index_js: "",
      from_cloud_app_to_architecture_notes: "",
      from_src_to_application_log: "",
      from_home_to_env_secrets: "",
    });
  };

  const handleRunVerification = () => {
    const payload = generatePayload();
    onSubmitPayload(payload);
  };

  // Calculate completion percentage
  const topologyDone = nodes.filter((n) => n.path === "/" || n.parent !== null).length >= 12;
  const absDone = Object.values(absolutePaths).filter(Boolean).length === 5;
  const relDone = Object.values(relativePaths).filter(Boolean).length === 5;
  const permsDone = permissions.env_secrets.is_hidden === true;

  const passedScore = validationOutput?.score ?? 0;
  const isPassed = validationOutput?.passed === true && passedScore >= 90;

  return (
    <div className="space-y-6">
      {/* Exercise Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900/80 border border-border/80 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-primary font-mono text-xs border-primary/30">
              Interactive Visual Workbench
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              DEV-00 Competency
            </Badge>
            {isCompleted && (
              <Badge variant="success" className="gap-1 text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>Competency Verified</span>
              </Badge>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {exerciseTitle}
          </h2>
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{estimatedMinutes} Minutes Effort</span>
            </span>
            <span>•</span>
            <span>Target: Rebuilding NovaCloud Production Server</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="text-xs h-9 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleQuickPresetSolution}
            className="text-xs h-9 gap-1.5 font-mono text-muted-foreground hover:text-foreground"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auto-Fill Solution</span>
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleRunVerification}
            disabled={isSubmitting}
            className="text-xs h-9 gap-2 shadow-md shadow-primary/20 font-bold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Run Automated Tests</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-zinc-900/80 border border-border/60 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("topology")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "topology"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <FolderTree className="w-4 h-4" />
          <span>1. Directory Tree Topology</span>
          {topologyDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("paths")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "paths"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>2. Path Coordinates & Navigation</span>
          {absDone && relDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 ${
            activeTab === "security"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>3. Security & Permissions</span>
          {permsDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
        </button>
      </div>

      {/* Active Tab View */}
      <div className="min-h-[400px]">
        {activeTab === "topology" && (
          <FilesystemTreeBuilder
            nodes={nodes}
            onNodeParentChange={handleNodeParentChange}
          />
        )}

        {activeTab === "paths" && (
          <PathChallengeWorkbench
            absolutePaths={absolutePaths}
            relativePaths={relativePaths}
            onAbsolutePathChange={handleAbsolutePathChange}
            onRelativePathChange={handleRelativePathChange}
          />
        )}

        {activeTab === "security" && (
          <PermissionsMatrixEditor
            permissions={permissions}
            onPermissionChange={handlePermissionChange}
          />
        )}
      </div>

      {/* Test Results & Competency Award Box */}
      {validationOutput && (
        <Card
          className={`p-6 rounded-2xl border transition-all ${
            isPassed
              ? "bg-emerald-950/20 border-emerald-500/40"
              : "bg-zinc-950/80 border-border/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4 mb-4">
            <div className="flex items-center gap-3">
              {isPassed ? (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <Award className="w-6 h-6" />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}
              <div>
                <h4 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span>Automated Assessment Result:</span>
                  <span
                    className={
                      isPassed ? "text-emerald-400 font-mono" : "text-amber-400 font-mono"
                    }
                  >
                    {passedScore}% Score
                  </span>
                </h4>
                <p className="text-xs text-muted-foreground">
                  {isPassed
                    ? "Congratulations! You have satisfied 100% of visible and hidden filesystem invariants."
                    : "Pass criteria: Score >= 90%. Review failing checks below and adjust your configuration."}
                </p>
              </div>
            </div>

            {isPassed && (
              <Button
                type="button"
                onClick={onCompleteExercise}
                disabled={isCompleting || isCompleted}
                variant="default"
                className="gap-2 font-bold shadow-md shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white shrink-0"
              >
                {isCompleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Emitting Evidence...</span>
                  </>
                ) : isCompleted ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Competency Verified</span>
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Claim DEV-00 Competency</span>
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Itemized Assertion Results */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {validationOutput.feedback.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  item.passed
                    ? "bg-emerald-950/10 border-emerald-500/30 text-zinc-200"
                    : "bg-destructive/10 border-destructive/30 text-destructive-foreground"
                }`}
              >
                {item.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold font-mono block mb-0.5">{item.rule}</span>
                  <span className="text-muted-foreground">{item.message}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
