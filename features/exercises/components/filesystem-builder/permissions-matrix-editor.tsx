"use client";

import React from "react";
import { Shield, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface PermissionSet {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface FileSecurityConfig {
  is_hidden: boolean;
  owner: PermissionSet;
  group: PermissionSet;
  others: PermissionSet;
}

export interface PermissionsMatrixEditorProps {
  permissions: {
    nginx_config: FileSecurityConfig;
    env_secrets: FileSecurityConfig;
    application_entrypoint: FileSecurityConfig;
  };
  onPermissionChange: (
    fileKey: "nginx_config" | "env_secrets" | "application_entrypoint",
    updated: FileSecurityConfig
  ) => void;
}

export function PermissionsMatrixEditor({
  permissions,
  onPermissionChange,
}: PermissionsMatrixEditorProps) {
  const files: Array<{
    key: "nginx_config" | "env_secrets" | "application_entrypoint";
    name: string;
    description: string;
    isDotfile: boolean;
    expectedHidden: boolean;
    expectedMode: string;
  }> = [
    {
      key: "nginx_config",
      name: "nginx.conf (System Web Server Config)",
      description: "Must be readable by all, editable only by system owner, and NEVER executable.",
      isDotfile: false,
      expectedHidden: false,
      expectedMode: "-rw-r--r--",
    },
    {
      key: "env_secrets",
      name: ".env (Production API Keys & Secrets)",
      description: "Production database secrets. Must be hidden (dotfile) and strictly locked to owner only.",
      isDotfile: true,
      expectedHidden: true,
      expectedMode: "-rw-------",
    },
    {
      key: "application_entrypoint",
      name: "index.js (Application Entrypoint Script)",
      description: "Executable server script. Must have execution rights for owner, group, and others.",
      isDotfile: false,
      expectedHidden: false,
      expectedMode: "-rwxr-xr-x",
    },
  ];

  const formatModeString = (config: FileSecurityConfig) => {
    const r = (b: boolean, c: string) => (b ? c : "-");
    const o = `${r(config.owner.read, "r")}${r(config.owner.write, "w")}${r(config.owner.execute, "x")}`;
    const g = `${r(config.group.read, "r")}${r(config.group.write, "w")}${r(config.group.execute, "x")}`;
    const ot = `${r(config.others.read, "r")}${r(config.others.write, "w")}${r(config.others.execute, "x")}`;
    return `-${o}${g}${ot}`;
  };

  const isConfigCorrect = (
    key: "nginx_config" | "env_secrets" | "application_entrypoint",
    config: FileSecurityConfig
  ) => {
    if (key === "env_secrets") {
      return (
        config.is_hidden === true &&
        config.owner.read === true &&
        config.owner.write === true &&
        !config.group.read &&
        !config.others.read
      );
    }
    if (key === "nginx_config") {
      return (
        config.is_hidden === false &&
        config.owner.read === true &&
        config.owner.write === true &&
        !config.owner.execute &&
        !config.group.write &&
        !config.others.write
      );
    }
    if (key === "application_entrypoint") {
      return (
        config.is_hidden === false &&
        config.owner.execute === true &&
        config.group.execute === true &&
        config.others.execute === true &&
        !config.group.write &&
        !config.others.write
      );
    }
    return false;
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-border/60 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Challenge 4: Dotfiles & 3-Tier POSIX Permissions Matrix</span>
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Configure hidden file flags and Read (r), Write (w), and Execute (x) permissions for each server asset.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-mono text-emerald-400 border-emerald-500/30">
          Least Privilege Mode
        </Badge>
      </div>

      <div className="space-y-6">
        {files.map((file) => {
          const config = permissions[file.key];
          const modeStr = formatModeString(config);
          const correct = isConfigCorrect(file.key, config);

          return (
            <div
              key={file.key}
              className={`p-5 rounded-2xl border transition-all ${
                correct
                  ? "bg-emerald-950/15 border-emerald-500/40"
                  : "bg-zinc-950/80 border-border/80"
              }`}
            >
              {/* File Title & Mode Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-zinc-900 text-primary border border-border/60">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground font-mono">{file.name}</h4>
                    <p className="text-xs text-muted-foreground">{file.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="font-mono text-xs text-primary px-2.5 py-1">
                    Mode: {modeStr}
                  </Badge>
                  {correct ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
              </div>

              {/* Dotfile Toggle Switch */}
              <div className="mb-4 p-3 rounded-xl bg-zinc-900/60 border border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <EyeOff className="w-4 h-4 text-zinc-400" />
                  <div>
                    <span className="text-xs font-bold text-foreground block">
                      Is this a Hidden File (Dotfile)?
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      Starts with a period (.) to store background application settings.
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onPermissionChange(file.key, {
                      ...config,
                      is_hidden: !config.is_hidden,
                    })
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    config.is_hidden
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-zinc-800 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {config.is_hidden ? "Hidden (.dotfile)" : "Visible File"}
                </button>
              </div>

              {/* 3-Tier Permissions Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Owner Tier */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-border/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-xs font-bold text-foreground">1. Owner (Alex/Root)</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      User
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    {(["read", "write", "execute"] as const).map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center justify-between text-xs font-mono cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <span className="capitalize">{perm} ({perm[0]})</span>
                        <input
                          type="checkbox"
                          checked={config.owner[perm]}
                          onChange={(e) =>
                            onPermissionChange(file.key, {
                              ...config,
                              owner: { ...config.owner, [perm]: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Group Tier */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-border/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-xs font-bold text-foreground">2. Group (Teammates)</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      Group
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    {(["read", "write", "execute"] as const).map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center justify-between text-xs font-mono cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <span className="capitalize">{perm} ({perm[0]})</span>
                        <input
                          type="checkbox"
                          checked={config.group[perm]}
                          onChange={(e) =>
                            onPermissionChange(file.key, {
                              ...config,
                              group: { ...config.group, [perm]: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Others Tier */}
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-border/50 space-y-2">
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
                    <span className="text-xs font-bold text-foreground">3. Others (Public/All)</span>
                    <Badge variant="secondary" className="text-[10px] font-mono">
                      World
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    {(["read", "write", "execute"] as const).map((perm) => (
                      <label
                        key={perm}
                        className="flex items-center justify-between text-xs font-mono cursor-pointer text-muted-foreground hover:text-foreground"
                      >
                        <span className="capitalize">{perm} ({perm[0]})</span>
                        <input
                          type="checkbox"
                          checked={config.others[perm]}
                          onChange={(e) =>
                            onPermissionChange(file.key, {
                              ...config,
                              others: { ...config.others, [perm]: e.target.checked },
                            })
                          }
                          className="w-4 h-4 accent-primary rounded cursor-pointer"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
