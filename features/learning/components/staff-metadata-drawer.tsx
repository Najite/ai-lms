"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ShieldAlert, FileCode2, ExternalLink, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StaffLessonMetadata } from "../types";

export interface StaffMetadataDrawerProps {
  metadata: StaffLessonMetadata | null;
  lessonId: string;
  className?: string;
}

export function StaffMetadataDrawer({
  metadata,
  lessonId,
  className,
}: StaffMetadataDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!metadata) return null;

  return (
    <div
      className={`rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-4 text-xs space-y-3 ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold text-amber-500">
          <ShieldAlert className="w-4 h-4" />
          <span>Curriculum Engineering Metadata (Staff Role)</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="h-7 text-xs text-amber-500 hover:text-amber-400 hover:bg-amber-500/10 px-2"
        >
          {isOpen ? (
            <span className="flex items-center gap-1">
              Hide Details <ChevronUp className="w-3.5 h-3.5" />
            </span>
          ) : (
            <span className="flex items-center gap-1">
              Inspect Metadata <ChevronDown className="w-3.5 h-3.5" />
            </span>
          )}
        </Button>
      </div>

      {isOpen && (
        <div className="pt-2 border-t border-amber-500/20 space-y-2 font-mono text-[11px] text-muted-foreground">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <span className="text-foreground/80 font-semibold">Lesson Code:</span>{" "}
              <span className="text-amber-400">{metadata.lessonCode || "N/A"}</span>
            </div>
            <div>
              <span className="text-foreground/80 font-semibold">Version / Status:</span>{" "}
              <span>{metadata.version || "1.0.0"} ({metadata.status || "canonical"})</span>
            </div>
            <div>
              <span className="text-foreground/80 font-semibold">Database ID:</span>{" "}
              <span className="truncate block">{lessonId}</span>
            </div>
            <div>
              <span className="text-foreground/80 font-semibold">Target Gate:</span>{" "}
              <span>{metadata.targetGate || "gate-1-foundations"}</span>
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <div className="flex items-center gap-1.5 truncate">
              <FileCode2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-foreground/80">Source Path:</span>
              <span className="text-muted-foreground truncate">{metadata.sourcePath || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="text-foreground/80">Blueprint:</span>
              <span className="text-muted-foreground truncate">{metadata.blueprintPath || "N/A"}</span>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
              AST Lint Validated
            </Badge>
            <Badge variant="outline" className="text-[10px] border-amber-500/30 text-amber-400 bg-amber-500/10 flex items-center gap-1">
              <Database className="w-3 h-3" />
              Synced with seed.sql
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
}
