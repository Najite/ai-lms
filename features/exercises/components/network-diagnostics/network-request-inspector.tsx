"use client";

import React, { useState } from "react";
import {
  FileText,
  Layers,
  Code2,
  Clock,
  Lock,
  Unlock,
  Copy,
  Check,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { type NetworkRequestItem } from "./network-mock-data";
import { cn } from "@/lib/utils";

export type InspectorTab = "headers" | "payload" | "response" | "timing";

export interface NetworkRequestInspectorProps {
  request: NetworkRequestItem | null;
}

export function NetworkRequestInspector({ request }: NetworkRequestInspectorProps) {
  const [activeTab, setActiveTab] = useState<"headers" | "payload" | "response" | "timing">("headers");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground border border-border/80 bg-card/40 rounded-xl">
        <Activity className="w-8 h-8 mb-2 opacity-40 text-primary animate-pulse" />
        <p className="text-xs font-mono font-medium">Select a network request from the table above to inspect details.</p>
      </div>
    );
  }

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isError = request.status >= 400;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border/80 bg-card/60 backdrop-blur-md overflow-hidden shadow-xs">
      {/* Inspector Top Tabs Header */}
      <div className="flex items-center justify-between p-2 border-b border-border/60 bg-muted/40">
        <div className="flex items-center gap-1">
          {([
            { id: "headers", label: "Headers", icon: Layers },
            { id: "payload", label: "Payload", icon: FileText, badge: request.requestBody || request.queryParams ? "Data" : undefined },
            { id: "response", label: "Response", icon: Code2 },
            { id: "timing", label: "Timing", icon: Clock },
          ] as Array<{ id: InspectorTab; label: string; icon: LucideIcon; badge?: string }>).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-primary-foreground/20 font-mono">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 font-mono text-xs pr-2">
          <span className="font-bold text-foreground">[{request.id}]</span>
          <span className={cn("px-1.5 py-0.5 rounded text-[11px] font-bold", isError ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400")}>
            {request.status} {request.statusText}
          </span>
        </div>
      </div>

      {/* Inspector Body Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
        {/* Tab 1: Headers */}
        {activeTab === "headers" && (
          <div className="space-y-4">
            {/* General Section */}
            <div className="rounded-lg border border-border/70 bg-background/50 p-3 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between border-b border-border/50 pb-1.5">
                <span>General Request Summary</span>
                {request.scheme === "http" ? (
                  <span className="text-amber-400 flex items-center gap-1 text-[10px]">
                    <Unlock className="w-3 h-3" /> Unencrypted HTTP (Port 80)
                  </span>
                ) : (
                  <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                    <Lock className="w-3 h-3" /> TLS 1.3 Encrypted (Port 443)
                  </span>
                )}
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="text-muted-foreground font-semibold">Request URL:</span>
                  <div className="flex items-center gap-1">
                    <span className="text-foreground break-all">{request.url}</span>
                    <button
                      onClick={() => handleCopy(request.url, "url")}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Copy URL"
                    >
                      {copiedKey === "url" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Request Method:</span>
                  <span className="text-primary font-bold">{request.method}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Status Code:</span>
                  <span className={isError ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
                    {request.status} {request.statusText}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-semibold">Remote Address (DNS IP):</span>
                  <div className="flex items-center gap-1">
                    <span className="text-amber-300 font-bold">{request.remoteAddress}</span>
                    <button
                      onClick={() => handleCopy((request.remoteAddress || "").split(":")[0] || "", "ip")}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Copy IP Address"
                    >
                      {copiedKey === "ip" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Headers */}
            <div className="rounded-lg border border-border/70 bg-background/50 p-3 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1.5 flex items-center justify-between">
                <span>Response Headers</span>
                <span className="text-[10px] text-muted-foreground font-normal">
                  {Object.keys(request.responseHeaders).length} headers received
                </span>
              </div>
              <div className="space-y-1.5 divide-y divide-border/30">
                {Object.entries(request.responseHeaders).map(([key, val]) => (
                  <div key={key} className="pt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-blue-400 font-semibold">{key}:</span>
                    <div className="flex items-center gap-1">
                      <span className="text-foreground break-all">{val}</span>
                      <button
                        onClick={() => handleCopy(val, key)}
                        className="p-1 text-muted-foreground hover:text-foreground"
                        title="Copy Header Value"
                      >
                        {copiedKey === key ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Headers */}
            <div className="rounded-lg border border-border/70 bg-background/50 p-3 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1.5">
                <span>Request Headers</span>
              </div>
              <div className="space-y-1.5 divide-y divide-border/30">
                {Object.entries(request.requestHeaders).map(([key, val]) => (
                  <div key={key} className="pt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-purple-400 font-semibold">{key}:</span>
                    <span className="text-foreground break-all">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Payload */}
        {activeTab === "payload" && (
          <div className="space-y-4">
            {request.queryParams && (
              <div className="rounded-lg border border-border/70 bg-background/50 p-3 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1.5">
                  Query String Parameters
                </div>
                <div className="space-y-1">
                  {Object.entries(request.queryParams).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="text-amber-400">{k}:</span>
                      <span className="text-foreground">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {request.requestBody ? (
              <div className="rounded-lg border border-border/70 bg-background/50 p-3 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1.5 flex items-center justify-between">
                  <span>Request Payload (POST Body)</span>
                  <button
                    onClick={() => handleCopy(request.requestBody || "", "req_body")}
                    className="p-1 text-muted-foreground hover:text-foreground flex items-center gap-1 text-[10px]"
                  >
                    {copiedKey === "req_body" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copy JSON</span>
                  </button>
                </div>
                <pre className="p-2.5 rounded bg-muted/40 text-foreground overflow-x-auto text-[11px]">
                  {request.requestBody}
                </pre>
              </div>
            ) : !request.queryParams ? (
              <div className="p-6 text-center text-muted-foreground">
                <p>This request does not contain a request body or query parameters.</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Tab 3: Response */}
        {activeTab === "response" && (
          <div className="rounded-lg border border-border/70 bg-background/50 p-3 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1.5 flex items-center justify-between">
              <span>Response Body ({request.responseType.toUpperCase()})</span>
              <button
                onClick={() => handleCopy(request.responseBody, "res_body")}
                className="p-1 text-muted-foreground hover:text-foreground flex items-center gap-1 text-[10px]"
              >
                {copiedKey === "res_body" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>Copy Body</span>
              </button>
            </div>
            <pre
              className={cn(
                "p-3 rounded overflow-x-auto text-[11px] leading-relaxed",
                isError ? "bg-rose-500/10 text-rose-200 border border-rose-500/20" : "bg-muted/40 text-foreground"
              )}
            >
              {request.responseBody}
            </pre>
          </div>
        )}

        {/* Tab 4: Timing / Waterfall */}
        {activeTab === "timing" && (
          <div className="rounded-lg border border-border/70 bg-background/50 p-3 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1.5 flex items-center justify-between">
              <span>Connection Lifecycle & Latency Breakdown</span>
              <span className={cn("font-bold", request.timeMs > 1000 ? "text-rose-400" : "text-emerald-400")}>
                Total: {request.timeMs >= 1000 ? `${(request.timeMs / 1000).toFixed(2)}s` : `${request.timeMs}ms`}
              </span>
            </div>
            <div className="space-y-2 text-[11px]">
              {[
                { label: "1. Queueing", val: `${request.timing.queueingMs} ms`, color: "bg-slate-400" },
                { label: "2. DNS Lookup", val: `${request.timing.dnsLookupMs} ms`, color: "bg-blue-400" },
                { label: "3. Initial Connection (TCP)", val: `${request.timing.tcpHandshakeMs} ms`, color: "bg-amber-400" },
                { label: "4. TLS Handshake (HTTPS)", val: `${request.timing.tlsHandshakeMs} ms`, color: "bg-purple-400" },
                { label: "5. Request Sent", val: `${request.timing.requestSentMs} ms`, color: "bg-teal-400" },
                { label: "6. Waiting for Server (TTFB)", val: `${request.timing.ttfbMs} ms`, color: "bg-emerald-400" },
                { label: "7. Content Download", val: `${request.timing.contentDownloadMs} ms`, color: "bg-indigo-400" },
              ].map((step) => (
                <div key={step.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full", step.color)} />
                    <span className="text-muted-foreground">{step.label}</span>
                  </div>
                  <span className="font-bold text-foreground">{step.val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
