"use client";

import React, { useMemo } from "react";
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
import { getNodeStatus, NodeStatus } from "@/lib/prerequisites";
import { Compass, Sparkles, Lock, CheckCircle2, Shield } from "lucide-react";

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
  // Convert Supabase curriculum_nodes into ReactFlow nodes with prerequisite-evaluated status
  const flowNodes: Node[] = useMemo(() => {
    return nodes.map((node) => {
      const status: NodeStatus = getNodeStatus(node.id, edges, userProgress);
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
  }, [nodes, edges, selectedNodeId, onSelectNode, userProgress]);

  // Convert Supabase curriculum_edges into dynamic ReactFlow edges
  const flowEdges: Edge[] = useMemo(() => {
    return edges.map((edge) => {
      const targetStatus = getNodeStatus(edge.target_node_id, edges, userProgress);
      const isTargetUnlocked = targetStatus !== "locked";

      return {
        id: edge.id,
        source: edge.source_node_id,
        target: edge.target_node_id,
        animated: isTargetUnlocked,
        style: {
          stroke: isTargetUnlocked ? "#06b6d4" : "#1e222e",
          strokeWidth: isTargetUnlocked ? 2 : 1.5,
          strokeDasharray: isTargetUnlocked ? undefined : "4 4",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isTargetUnlocked ? "#06b6d4" : "#1e222e",
        },
      };
    });
  }, [edges, userProgress]);

  return (
    <div
      className="w-full h-full flex-1 relative bg-[#07080b] overflow-hidden select-none"
      style={{ width: "100%", height: "100%", minHeight: "600px" }}
    >
      {/* Top Banner overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 p-3.5 rounded-xl border border-[#1e222e] bg-[#0e1017]/95 backdrop-blur-md max-w-md shadow-2xl font-mono">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg border border-[#06b6d4]/40 bg-[#06b6d4]/10 flex items-center justify-center text-[#06b6d4]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              THE SKILL CONSTELLATION <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" />
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Prerequisite DAG discipline. Foundation lessons must be mastered to unlock the next branches.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 pt-2 border-t border-[#1e222e] text-[10px] text-slate-400">
          <span className="flex items-center gap-1 text-[#10b981]">
            <CheckCircle2 className="w-3 h-3" /> Mastered
          </span>
          <span className="flex items-center gap-1 text-[#06b6d4]">
            <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" /> Unlocked
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Lock className="w-3 h-3 text-[#f43f5e]" /> Locked
          </span>
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
