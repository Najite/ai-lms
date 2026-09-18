"use client";

import React, { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import { CurriculumNode, CurriculumEdge } from "@/lib/supabase";
import { CustomQuestNode } from "./CustomQuestNode";
import { Compass, Sparkles } from "lucide-react";

interface SkillGraphProps {
  nodes: CurriculumNode[];
  edges: CurriculumEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: CurriculumNode) => void;
  userProgress: Record<string, string>;
}

const nodeTypes = {
  questNode: CustomQuestNode,
};

export function SkillGraph({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  userProgress,
}: SkillGraphProps) {
  // Convert Supabase curriculum_nodes into ReactFlow nodes
  const flowNodes: Node[] = useMemo(() => {
    return nodes.map((node) => {
      const status = (userProgress[node.id] || "available") as any;
      return {
        id: node.id,
        type: "questNode",
        position: { x: node.position_x, y: node.position_y },
        data: {
          node,
          status,
          isSelected: node.id === selectedNodeId,
          onSelect: onSelectNode,
        },
      };
    });
  }, [nodes, selectedNodeId, onSelectNode, userProgress]);

  // Convert Supabase curriculum_edges into ReactFlow edges
  const flowEdges: Edge[] = useMemo(() => {
    return edges.map((edge) => ({
      id: edge.id,
      source: edge.source_node_id,
      target: edge.target_node_id,
      animated: true,
      style: { stroke: "#2a3041", strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#2a3041",
      },
    }));
  }, [edges]);

  return (
    <div
      className="w-full h-full flex-1 relative bg-[#07080b] overflow-hidden"
      style={{ width: "100%", height: "100%", minHeight: "600px" }}
    >
      {/* Top Banner overlay */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 p-3 rounded-lg border border-[#1e222e] bg-[#0e1017]/90 backdrop-blur-md">
        <div className="w-7 h-7 rounded border border-[#06b6d4]/40 bg-[#06b6d4]/10 flex items-center justify-center text-[#06b6d4]">
          <Compass className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-xs font-mono font-bold text-slate-100 flex items-center gap-2">
            THE SKILL CONSTELLATION <Sparkles className="w-3 h-3 text-[#f59e0b]" />
          </h2>
          <p className="text-[11px] text-slate-400 font-mono">
            Click any node to enter its deep-dive handbook and live execution sandbox.
          </p>
        </div>
      </div>

      <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
          style={{ width: "100%", height: "100%" }}
          className="w-full h-full"
        >
          <Background color="#1e222e" gap={24} size={1} />
          <Controls className="!bg-[#0e1017] !border !border-[#1e222e] !rounded-lg overflow-hidden [&_button]:!border-b [&_button]:!border-[#1e222e] [&_button]:!fill-slate-300 hover:[&_button]:!bg-[#1b1f2c]" />
        </ReactFlow>
      </div>
    </div>
  );
}
