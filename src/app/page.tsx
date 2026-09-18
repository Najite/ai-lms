"use client";

import React, { useState, useEffect } from "react";
import { supabase, CurriculumNode, CurriculumEdge, CurriculumPhase } from "@/lib/supabase";
import { Navbar } from "@/components/Navbar";
import { SkillGraph } from "@/components/SkillGraph";
import { DualModeViewer } from "@/components/DualModeViewer";
import { MonacoWorkspace } from "@/components/MonacoWorkspace";
import { SocraticDefenseModal } from "@/components/SocraticDefenseModal";
import { ChaosIncidentSimulator } from "@/components/ChaosIncidentSimulator";
import { RedTeamArena } from "@/components/RedTeamArena";
import { LandingPage } from "@/components/LandingPage";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "galaxy" | "workspace">("landing");
  const [nodes, setNodes] = useState<CurriculumNode[]>([]);
  const [edges, setEdges] = useState<CurriculumEdge[]>([]);
  const [phases, setPhases] = useState<CurriculumPhase[]>([]);
  const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // User Game Stats & State Tracking
  const [xp, setXp] = useState<number>(150);
  const [hackerXp, setHackerXp] = useState<number>(0);
  const [level, setLevel] = useState<number>(1);
  const [streak, setStreak] = useState<number>(14);
  const [userProgress, setUserProgress] = useState<Record<string, string>>({
    "node-1-1-bpe-tokenizer": "in_progress",
    "node-1-2-cli-orchestrator": "available",
    "node-2-1-hybrid-retrieval": "available",
  });

  // Modal states
  const [isDefenseModalOpen, setIsDefenseModalOpen] = useState(false);
  const [isChaosModalOpen, setIsChaosModalOpen] = useState(false);
  const [isRedTeamModalOpen, setIsRedTeamModalOpen] = useState(false);

  // Fetch real data from live Supabase
  const fetchData = async () => {
    setIsLoading(true);
    setDbError(null);

    try {
      const [nodesRes, edgesRes, phasesRes] = await Promise.all([
        supabase.from("curriculum_nodes").select("*").order("level_required", { ascending: true }),
        supabase.from("curriculum_edges").select("*"),
        supabase.from("curriculum_phases").select("*").order("order_index", { ascending: true }),
      ]);

      if (nodesRes.error) throw nodesRes.error;
      if (edgesRes.error) throw edgesRes.error;

      const fetchedNodes = nodesRes.data || [];
      setNodes(fetchedNodes);
      setEdges(edgesRes.data || []);
      setPhases(phasesRes.data || []);

      if (fetchedNodes.length > 0) {
        setSelectedNode((prev) => prev || fetchedNodes[0]);
      }
    } catch (err: any) {
      console.error("Supabase fetch error:", err);
      setDbError(err.message || "Failed to connect to Supabase database");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectNode = (node: CurriculumNode) => {
    setSelectedNode(node);
    setCurrentView("workspace");
  };

  const handleTestsPassed = () => {
    if (!selectedNode) return;
    setUserProgress((prev) => ({
      ...prev,
      [selectedNode.id]: "tests_passed",
    }));
  };

  const handleDefensePassed = (earnedXp: number) => {
    if (!selectedNode) return;
    const newXp = xp + earnedXp;
    setXp(newXp);
    const newLevel = Math.floor(newXp / 300) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }

    setUserProgress((prev) => ({
      ...prev,
      [selectedNode.id]: "mastered",
    }));
  };

  const handleIncidentResolved = (earnedXp: number) => {
    const newXp = xp + earnedXp;
    setXp(newXp);
    const newLevel = Math.floor(newXp / 300) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  };

  const handleExploitPassed = (earnedHackerXp: number) => {
    setHackerXp((prev) => prev + earnedHackerXp);
    const newXp = xp + earnedHackerXp;
    setXp(newXp);
  };

  const activeNode = selectedNode || nodes[0];
  const activeNodeId = activeNode?.id || "node-1-1-bpe-tokenizer";

  // If on Landing Page view, render immediately (non-blocking)
  if (currentView === "landing") {
    return (
      <>
        <LandingPage
          onEnterApp={() => setCurrentView("galaxy")}
          onOpenChaos={() => setIsChaosModalOpen(true)}
          onOpenRedTeam={() => setIsRedTeamModalOpen(true)}
        />

        {/* P0 Chaos Outage Simulator Modal */}
        <ChaosIncidentSimulator
          nodeId={activeNodeId}
          isOpen={isChaosModalOpen}
          onClose={() => setIsChaosModalOpen(false)}
          onIncidentResolved={handleIncidentResolved}
        />

        {/* Red-Team Adversarial Arena Modal */}
        <RedTeamArena
          nodeId={activeNodeId}
          isOpen={isRedTeamModalOpen}
          onClose={() => setIsRedTeamModalOpen(false)}
          onExploitPassed={handleExploitPassed}
        />
      </>
    );
  }

  // If loading while in Galaxy or Workspace view
  if (isLoading && nodes.length === 0) {
    return (
      <div className="min-h-screen bg-[#07080b] flex flex-col items-center justify-center text-slate-300 font-mono space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-[#06b6d4]" />
        <div className="text-sm font-semibold tracking-wider text-slate-200">
          INITIALIZING AI-NATIVE SYSTEMS LMS...
        </div>
        <p className="text-xs text-slate-500">Querying real database records from Supabase.</p>
      </div>
    );
  }

  if (dbError && nodes.length === 0) {
    return (
      <div className="min-h-screen bg-[#07080b] flex flex-col items-center justify-center p-6 text-slate-300 font-mono space-y-4">
        <div className="p-4 rounded-xl border border-[#f43f5e]/30 bg-[#f43f5e]/10 text-[#f43f5e] max-w-md text-center space-y-2">
          <AlertCircle className="w-8 h-8 mx-auto" />
          <h2 className="text-base font-bold">DATABASE CONNECTIVITY NOTICE</h2>
          <p className="text-xs">{dbError}</p>
          <button
            onClick={fetchData}
            className="mt-3 px-4 py-1.5 rounded bg-[#f43f5e] hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 mx-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const isCurrentNodeDefensePassed =
    activeNode ? userProgress[activeNode.id] === "mastered" : false;

  return (
    <div className="min-h-screen flex flex-col bg-[#07080b] text-slate-100">
      {/* Top Telemetry Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        activeNodeTitle={activeNode?.title}
        xp={xp}
        hackerXp={hackerXp}
        level={level}
        streak={streak}
        onOpenChaos={() => setIsChaosModalOpen(true)}
        onOpenRedTeam={() => setIsRedTeamModalOpen(true)}
      />

      {/* Main View Area */}
      <main
        className="w-full flex-1 flex flex-col overflow-hidden relative"
        style={{ width: "100%", height: "calc(100vh - 3.5rem)" }}
      >
        {currentView === "galaxy" ? (
          /* View 1: The Interactive Skill Galaxy DAG Graph */
          <SkillGraph
            nodes={nodes}
            edges={edges}
            selectedNodeId={activeNode?.id || null}
            onSelectNode={handleSelectNode}
            userProgress={userProgress}
          />
        ) : (
          /* View 2: Split-Pane Workspace (Handbook & NotebookLM | Monaco IDE & Test Runner) */
          activeNode ? (
            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
              {/* Left Pane: Dual Mode Viewer (Technical Handbook + NotebookLM Player) */}
              <div className="h-full overflow-hidden">
                <DualModeViewer node={activeNode} />
              </div>

              {/* Right Pane: Monaco Code Editor + In-Browser Pyodide Test Runner */}
              <div className="h-full overflow-hidden">
                <MonacoWorkspace
                  node={activeNode}
                  onOpenDefense={() => setIsDefenseModalOpen(true)}
                  onTestsPassed={handleTestsPassed}
                  isDefensePassed={isCurrentNodeDefensePassed}
                />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center font-mono text-xs text-slate-500">
              No module selected. Click Skill Galaxy to select a module.
            </div>
          )
        )}
      </main>

      {/* Socratic Defense Modal */}
      {activeNode && (
        <SocraticDefenseModal
          node={activeNode}
          isOpen={isDefenseModalOpen}
          onClose={() => setIsDefenseModalOpen(false)}
          onDefensePassed={handleDefensePassed}
        />
      )}

      {/* P0 Chaos Outage Simulator Modal */}
      <ChaosIncidentSimulator
        nodeId={activeNodeId}
        isOpen={isChaosModalOpen}
        onClose={() => setIsChaosModalOpen(false)}
        onIncidentResolved={handleIncidentResolved}
      />

      {/* Red-Team Adversarial Arena Modal */}
      <RedTeamArena
        nodeId={activeNodeId}
        isOpen={isRedTeamModalOpen}
        onClose={() => setIsRedTeamModalOpen(false)}
        onExploitPassed={handleExploitPassed}
      />
    </div>
  );
}
