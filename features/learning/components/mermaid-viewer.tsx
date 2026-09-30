"use client";

import React, { useEffect, useState, useId } from "react";
import { Loader2, GitBranch, Workflow, Network, Layers } from "lucide-react";

export interface MermaidViewerProps {
  chart: string;
  className?: string;
}

/**
 * Client-safe, dynamic Mermaid diagram renderer for LMS instructional content.
 * Dynamically loads the Mermaid rendering engine on the client to preserve fast SSR
 * and render SVG architecture diagrams with dark-theme styling.
 */
export function MermaidViewer({ chart, className }: MermaidViewerProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const uniqueId = useId().replace(/[^a-zA-Z0-9]/g, "_");

  const getDiagramMeta = (chartCode: string) => {
    const lower = chartCode.toLowerCase();
    if (lower.includes("git") || lower.includes("dag") || lower.includes("branch") || lower.includes("commit") || lower.includes("graph rl") || lower.includes("graph lr")) {
      return {
        label: "Git DAG / Branch Graph",
        icon: GitBranch,
      };
    }
    if (lower.includes("http") || lower.includes("request") || lower.includes("dns") || lower.includes("tcp") || lower.includes("server")) {
      return {
        label: "Network & HTTP Flow",
        icon: Network,
      };
    }
    if (lower.includes("posix") || lower.includes("pipe") || lower.includes("stdin") || lower.includes("stdout") || lower.includes("stderr")) {
      return {
        label: "POSIX Stream Architecture",
        icon: Workflow,
      };
    }
    return {
      label: "Architecture & System Model",
      icon: Layers,
    };
  };

  const meta = getDiagramMeta(chart);
  const IconComponent = meta.icon;

  useEffect(() => {
    let isMounted = true;

    async function renderChart() {
      try {
        setIsLoading(true);
        setError(null);

        // Dynamically import Mermaid from ESM CDN on the client
        // @ts-expect-error - dynamic module from CDN
        const { default: mermaid } = await import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs");

        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          themeVariables: {
            darkMode: true,
            background: "#09090b",
            primaryColor: "#1e293b",
            primaryTextColor: "#f8fafc",
            primaryBorderColor: "#3b82f6",
            lineColor: "#64748b",
            secondaryColor: "#0f172a",
            tertiaryColor: "#020617",
            nodeBorder: "#3b82f6",
            clusterBkg: "#09090b",
            titleColor: "#f8fafc",
            edgeLabelBackground: "#09090b",
          },
        });

        const id = `mermaid_${uniqueId}_${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(id, chart);

        if (isMounted) {
          setSvg(renderedSvg);
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          // Fallback gracefully without breaking page rendering
          setError(err instanceof Error ? err.message : "Diagram rendering in fallback mode");
          setIsLoading(false);
        }
      }
    }

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, uniqueId]);

  return (
    <div
      className={`my-6 rounded-2xl border border-border/80 bg-zinc-950/90 overflow-hidden shadow-lg shadow-black/40 backdrop-blur-sm ${
        className || ""
      }`}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40 bg-zinc-900/60 text-xs">
        <div className="flex items-center gap-2 text-primary font-medium">
          <IconComponent className="w-3.5 h-3.5 text-primary" />
          <span className="font-semibold uppercase tracking-wider text-[11px]">
            Architecture & Dataflow Diagram
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground font-mono bg-zinc-800/80 px-2 py-0.5 rounded border border-border/30">
          {meta.label}
        </span>
      </div>

      <div className="p-4 sm:p-6 flex items-center justify-center overflow-x-auto min-h-[140px]">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
            <span>Rendering visual architecture graph...</span>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-left w-full space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground border-b border-border/30 pb-1.5">
              <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-primary" />
                Structural Topology Specification
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">Declarative DAG Spec</span>
            </div>
            <pre className="p-3.5 bg-black/60 rounded-xl text-xs font-mono text-zinc-300 overflow-x-auto border border-border/40 leading-relaxed">
              <code>{chart}</code>
            </pre>
          </div>
        )}

        {!isLoading && svg && (
          <div
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto [&>svg]:mx-auto"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        )}
      </div>
    </div>
  );
}
