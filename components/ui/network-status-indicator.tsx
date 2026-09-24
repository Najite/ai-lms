"use client";

import * as React from "react";
import { Wifi, WifiOff, Zap } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function NetworkStatusIndicator() {
  const networkStatus = useAppStore((s) => s.networkStatus);
  const pendingSyncCount = useAppStore((s) => s.pendingSyncQueue.length);

  return (
    <div
      title={
        networkStatus === "offline"
          ? "Offline Mode: All lessons and exercises are operating from persistent local cache. Changes will sync when reconnected."
          : networkStatus === "slow-2g"
          ? "2G Network Detected: Tiered payload compression active. Loading ~4KB on-demand payloads."
          : "Connected: Real-time database verification active."
      }
      role="status"
      aria-live="polite"
      className={cn(
        "flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-mono border transition-colors select-none",
        networkStatus === "offline"
          ? "bg-[#141517] border-[#383b42] text-[#8a8f98]"
          : networkStatus === "slow-2g"
          ? "bg-[#291b00] border-[#b45309]/50 text-[#f59e0b]"
          : "bg-[#0f1011] border-[#23252a] text-[#8a8f98] hover:border-[#10b981]/40"
      )}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        {networkStatus === "online" && <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />}
        {networkStatus === "slow-2g" && <span className="relative inline-flex rounded-full h-2 w-2 bg-[#f59e0b]" />}
        {networkStatus === "offline" && <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ef4444]" />}
      </span>

      <span className="font-medium">
        {networkStatus === "offline" ? (
          "Offline (Cached)"
        ) : networkStatus === "slow-2g" ? (
          "2G Low Bandwidth"
        ) : (
          "Online"
        )}
      </span>

      {pendingSyncCount > 0 && (
        <span className="ml-1 px-1 rounded bg-[#5e6ad2]/20 text-[#5e6ad2] text-[10px] font-bold">
          {pendingSyncCount} pending
        </span>
      )}
    </div>
  );
}
