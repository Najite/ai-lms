import React from "react";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, PlayCircle, Eye, CheckCircle2, ShieldCheck } from "lucide-react";
import type { GateStatus } from "../types";

export interface GateBadgeProps {
  status: GateStatus;
  className?: string;
}

export function GateBadge({ status, className }: GateBadgeProps) {
  switch (status) {
    case "locked":
      return (
        <Badge
          variant="outline"
          className={`border-zinc-700 bg-zinc-900/60 text-zinc-400 font-mono text-xs gap-1.5 py-0.5 px-2.5 ${className}`}
        >
          <Lock className="h-3 w-3 text-zinc-500" />
          <span>Locked</span>
        </Badge>
      );
    case "available":
      return (
        <Badge
          variant="outline"
          className={`border-blue-500/40 bg-blue-500/10 text-blue-400 font-mono text-xs gap-1.5 py-0.5 px-2.5 ${className}`}
        >
          <Unlock className="h-3 w-3 text-blue-400" />
          <span>Available</span>
        </Badge>
      );
    case "in_progress":
      return (
        <Badge
          variant="outline"
          className={`border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-xs gap-1.5 py-0.5 px-2.5 animate-pulse ${className}`}
        >
          <PlayCircle className="h-3 w-3 text-amber-400" />
          <span>In Progress</span>
        </Badge>
      );
    case "under_review":
      return (
        <Badge
          variant="outline"
          className={`border-purple-500/40 bg-purple-500/10 text-purple-300 font-mono text-xs gap-1.5 py-0.5 px-2.5 ${className}`}
        >
          <Eye className="h-3 w-3 text-purple-400" />
          <span>Under Review</span>
        </Badge>
      );
    case "validated":
      return (
        <Badge
          variant="outline"
          className={`border-teal-500/40 bg-teal-500/10 text-teal-300 font-mono text-xs gap-1.5 py-0.5 px-2.5 ${className}`}
        >
          <CheckCircle2 className="h-3 w-3 text-teal-400" />
          <span>Validated</span>
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className={`border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-mono text-xs gap-1.5 py-0.5 px-2.5 shadow-sm shadow-emerald-900/20 ${className}`}
        >
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Mastered</span>
        </Badge>
      );
    default:
      return null;
  }
}
