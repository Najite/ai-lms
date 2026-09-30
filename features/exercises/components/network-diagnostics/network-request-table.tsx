"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Lock,
  Unlock,
  FileCode,
  Globe,
  Image as ImageIcon,
} from "lucide-react";
import { type NetworkRequestItem } from "./network-mock-data";
import { cn } from "@/lib/utils";

export type FilterTab = "all" | "fetch" | "doc" | "img" | "insecure" | "errors";

export interface NetworkRequestTableProps {
  requests: NetworkRequestItem[];
  selectedRequestId: string | null;
  onSelectRequest: (requestId: string) => void;
}

export function NetworkRequestTable({
  requests,
  selectedRequestId,
  onSelectRequest,
}: NetworkRequestTableProps) {
  const [activeFilter, setActiveFilter] = useState<"all" | "fetch" | "doc" | "img" | "insecure" | "errors">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Filter tab
      if (activeFilter === "fetch" && req.type !== "fetch") return false;
      if (activeFilter === "doc" && req.type !== "doc") return false;
      if (activeFilter === "img" && req.type !== "img") return false;
      if (activeFilter === "insecure" && req.scheme !== "http") return false;
      if (activeFilter === "errors" && req.status < 400) return false;

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = req.name.toLowerCase().includes(query);
        const matchesUrl = req.url.toLowerCase().includes(query);
        const matchesStatus = req.status.toString().includes(query);
        const matchesMethod = req.method.toLowerCase().includes(query);
        if (!matchesName && !matchesUrl && !matchesStatus && !matchesMethod) return false;
      }

      return true;
    });
  }, [requests, activeFilter, searchQuery]);

  const getStatusBadge = (status: number) => {
    if (status >= 200 && status < 300) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          {status}
        </span>
      );
    }
    if (status >= 300 && status < 400) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
          {status}
        </span>
      );
    }
    if (status >= 400 && status < 500) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-500/15 text-orange-400 border border-orange-500/30">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 animate-pulse">
        {status}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "doc":
        return <Globe className="w-3.5 h-3.5 text-blue-400" />;
      case "fetch":
        return <FileCode className="w-3.5 h-3.5 text-purple-400" />;
      case "img":
        return <ImageIcon className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <FileCode className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden shadow-xs">
      {/* DevTools Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 border-b border-border/60 bg-muted/40 text-xs">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {([
            { id: "all", label: "All" },
            { id: "fetch", label: "Fetch/XHR" },
            { id: "doc", label: "Doc" },
            { id: "img", label: "Img" },
            { id: "insecure", label: "⚠️ Insecure (HTTP)" },
            { id: "errors", label: "❌ Errors (4xx/5xx)" },
          ] as Array<{ id: FilterTab; label: string }>).map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap",
                activeFilter === f.id
                  ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search filter */}
        <div className="relative w-full sm:w-48">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-2.5 py-1 text-xs rounded bg-background border border-border/70 focus:outline-hidden focus:ring-1 focus:ring-primary font-mono"
          />
        </div>
      </div>

      {/* Network Log Table */}
      <div className="flex-1 overflow-y-auto min-h-[300px]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground font-mono text-[11px] uppercase tracking-wider sticky top-0 backdrop-blur-md">
              <th className="py-2 px-3 font-semibold w-12">ID</th>
              <th className="py-2 px-3 font-semibold">Name / Endpoint</th>
              <th className="py-2 px-2 font-semibold w-14">Status</th>
              <th className="py-2 px-2 font-semibold w-14">Method</th>
              <th className="py-2 px-3 font-semibold hidden md:table-cell">Domain</th>
              <th className="py-2 px-2 font-semibold hidden sm:table-cell w-14">Type</th>
              <th className="py-2 px-2 font-semibold hidden sm:table-cell w-16">Size</th>
              <th className="py-2 px-2 font-semibold w-16">Time</th>
              <th className="py-2 px-3 font-semibold hidden lg:table-cell w-28">Waterfall</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono">
            {filteredRequests.map((req) => {
              const isSelected = selectedRequestId === req.id;
              const hasError = req.status >= 400;
              const isInsecure = req.scheme === "http";

              return (
                <tr
                  key={req.id}
                  onClick={() => onSelectRequest(req.id)}
                  className={cn(
                    "cursor-pointer transition-colors group",
                    isSelected
                      ? "bg-primary/15 border-l-2 border-l-primary"
                      : "hover:bg-muted/40",
                    hasError && !isSelected && "bg-rose-500/5 hover:bg-rose-500/10",
                    isInsecure && !isSelected && "bg-amber-500/5 hover:bg-amber-500/10"
                  )}
                >
                  {/* Request ID Badge */}
                  <td className="py-2 px-3 font-bold text-foreground">
                    <span className="px-1.5 py-0.5 rounded bg-secondary text-[11px] border border-border">
                      {req.id}
                    </span>
                  </td>

                  {/* Name & Security Icon */}
                  <td className="py-2 px-3 max-w-[200px] sm:max-w-[260px] truncate">
                    <div className="flex items-center gap-1.5">
                      {isInsecure ? (
                        <span title="Insecure HTTP cleartext">
                          <Unlock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        </span>
                      ) : (
                        <span title="Secure HTTPS TLS">
                          <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        </span>
                      )}
                      <span
                        className={cn(
                          "truncate font-semibold",
                          hasError ? "text-rose-400" : "text-foreground group-hover:text-primary"
                        )}
                        title={req.url}
                      >
                        {req.name}
                      </span>
                    </div>
                  </td>

                  {/* Status Code */}
                  <td className="py-2 px-2">{getStatusBadge(req.status)}</td>

                  {/* Method */}
                  <td className="py-2 px-2">
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase",
                        req.method === "GET" && "bg-blue-500/10 text-blue-400",
                        req.method === "POST" && "bg-emerald-500/10 text-emerald-400"
                      )}
                    >
                      {req.method}
                    </span>
                  </td>

                  {/* Domain */}
                  <td className="py-2 px-3 text-muted-foreground hidden md:table-cell truncate max-w-[140px]">
                    {req.domain}
                  </td>

                  {/* Type */}
                  <td className="py-2 px-2 hidden sm:table-cell">
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      {getTypeIcon(req.type)}
                      <span>{req.type}</span>
                    </div>
                  </td>

                  {/* Size */}
                  <td className="py-2 px-2 text-muted-foreground hidden sm:table-cell text-[11px]">
                    {req.size}
                  </td>

                  {/* Time */}
                  <td className="py-2 px-2 text-[11px]">
                    <span
                      className={cn(
                        req.timeMs > 1000 ? "text-rose-400 font-bold" : "text-muted-foreground"
                      )}
                    >
                      {req.timeMs >= 1000 ? `${(req.timeMs / 1000).toFixed(1)}s` : `${req.timeMs}ms`}
                    </span>
                  </td>

                  {/* Visual Waterfall Bar */}
                  <td className="py-2 px-3 hidden lg:table-cell">
                    <div className="w-full bg-secondary/60 h-2 rounded-full overflow-hidden flex">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          req.timeMs > 5000
                            ? "bg-rose-500 w-full animate-pulse"
                            : req.timeMs > 200
                            ? "bg-amber-400 w-3/4"
                            : "bg-emerald-500 w-1/4"
                        )}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer Status */}
      <div className="p-2 border-t border-border/60 bg-muted/30 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
        <span>{filteredRequests.length} requests displayed (9 captured total)</span>
        <span className="text-primary">Click any row to inspect Headers, Payloads & Response bodies</span>
      </div>
    </div>
  );
}
