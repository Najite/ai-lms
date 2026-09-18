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
import { LockedNodeModal } from "@/components/LockedNodeModal";
import { UnlockedCelebrationModal } from "@/components/UnlockedCelebrationModal";
import { getNodeStatus, getMissingPrerequisites, NodeStatus } from "@/lib/prerequisites";
import { Loader2, AlertCircle, RefreshCw, Lock, ArrowRight, ShieldAlert } from "lucide-react";
import confetti from "canvas-confetti";

export default function Home() {
  const [currentView, setCurrentView] = useState<"landing" | "galaxy" | "workspace">("landing");
  const [nodes, setNodes] = useState<CurriculumNode[]>([]);
  const [edges, setEdges] = useState<CurriculumEdge[]>([]);
  const [phases, setPhases] = useState<CurriculumPhase[]>([]);
  const [selectedNode, setSelectedNode] = useState<CurriculumNode | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // User Game Stats & State Tracking with LocalStorage Persistence
  const [xp, setXp] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ainative_xp");
      if (saved) return parseInt(saved, 10) || 150;
    }
    return 150;
  });

  const [hackerXp, setHackerXp] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ainative_hacker_xp");
      if (saved) return parseInt(saved, 10) || 0;
    }
    return 0;
  });

  const [level, setLevel] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ainative_level");
      if (saved) return parseInt(saved, 10) || 1;
    }
    return 1;
  });

  const [streak, setStreak] = useState<number>(14);

  // Initial user progress: ONLY the foundation lesson (Phase 1, Node 1.1) is available/in_progress!
  // Every other lesson is strictly LOCKED until prerequisites are mastered!
  const [userProgress, setUserProgress] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ainative_user_progress");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return {
      "node-1-1-bpe-tokenizer": "in_progress",
    };
  });

  // Modals
  const [isDefenseModalOpen, setIsDefenseModalOpen] = useState(false);
  const [isChaosModalOpen, setIsChaosModalOpen] = useState(false);
  const [isRedTeamModalOpen, setIsRedTeamModalOpen] = useState(false);

  // Locked & Unlocked Celebration Modals
  const [lockedModalData, setLockedModalData] = useState<{
    node: CurriculumNode | null;
    missingPrereqs: CurriculumNode[];
  } | null>(null);

  const [celebrationData, setCelebrationData] = useState<{
    completedNode: CurriculumNode | null;
    newlyUnlocked: CurriculumNode[];
  } | null>(null);

  // Persist progression to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ainative_user_progress", JSON.stringify(userProgress));
      localStorage.setItem("ainative_xp", xp.toString());
      localStorage.setItem("ainative_hacker_xp", hackerXp.toString());
      localStorage.setItem("ainative_level", level.toString());
    }
  }, [userProgress, xp, hackerXp, level]);

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
    const status = getNodeStatus(node.id, edges, userProgress);

    // If locked, show locked dialog detailing prerequisites
    if (status === "locked") {
      const missing = getMissingPrerequisites(node.id, nodes, edges, userProgress);
      setLockedModalData({
        node,
        missingPrereqs: missing,
      });
      return;
    }

    // Otherwise, open in workspace
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

    const updatedProgress = {
      ...userProgress,
      [selectedNode.id]: "mastered",
    };
    setUserProgress(updatedProgress);

    // Trigger celebration confetti
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ["#06b6d4", "#10b981", "#8b5cf6"],
    });

    // Check which downstream nodes were unlocked by mastering this node
    const downstreamNodes = edges
      .filter((e) => e.source_node_id === selectedNode.id)
      .map((e) => nodes.find((n) => n.id === e.target_node_id))
      .filter((n): n is CurriculumNode => {
        if (!n) return false;
        // Verify node is now unlocked under updated progress
        return getNodeStatus(n.id, edges, updatedProgress) !== "locked";
      });

    if (downstreamNodes.length > 0) {
      setCelebrationData({
        completedNode: selectedNode,
        newlyUnlocked: downstreamNodes,
      });
    }
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
  const activeNodeStatus: NodeStatus = activeNode
    ? getNodeStatus(activeNode.id, edges, userProgress)
    : "available";

  // If on Landing Page view, render immediately
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
          /* View 1: The Interactive Skill Galaxy DAG Graph with Prerequisite Enforcement */
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
            activeNodeStatus === "locked" ? (
              /* Access Denied Gate if navigated to locked lesson */
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center font-mono space-y-4">
                <div className="p-8 rounded-2xl border border-[#f43f5e]/30 bg-[#0e1017] max-w-lg space-y-4 shadow-2xl">
                  <div className="w-12 h-12 rounded-full border border-[#f43f5e]/40 bg-[#f43f5e]/10 flex items-center justify-center text-[#f43f5e] mx-auto">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-100">
                    MODULE ACCESS LOCKED
                  </h2>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">
                    You cannot work on <strong className="text-slate-200">{activeNode.title}</strong> yet. You must master the foundational prerequisites in the DAG first.
                  </p>
                  <button
                    onClick={() => {
                      const missing = getMissingPrerequisites(activeNode.id, nodes, edges, userProgress);
                      if (missing[0]) {
                        setSelectedNode(missing[0]);
                      } else {
                        setCurrentView("galaxy");
                      }
                    }}
                    className="px-5 py-2.5 rounded bg-[#06b6d4] hover:bg-[#22d3ee] text-[#07080b] text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] inline-flex items-center gap-2"
                  >
                    <span>Go to Foundational Lesson</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
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
            )
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

      {/* Locked Node Intercept Modal */}
      <LockedNodeModal
        node={lockedModalData?.node || null}
        missingPrereqs={lockedModalData?.missingPrereqs || []}
        isOpen={!!lockedModalData}
        onClose={() => setLockedModalData(null)}
        onSelectPrereq={(prereq) => {
          setLockedModalData(null);
          setSelectedNode(prereq);
          setCurrentView("workspace");
        }}
      />

      {/* Unlocked Celebration Modal */}
      <UnlockedCelebrationModal
        completedNode={celebrationData?.completedNode || null}
        newlyUnlocked={celebrationData?.newlyUnlocked || []}
        isOpen={!!celebrationData}
        onClose={() => setCelebrationData(null)}
        onSelectNextNode={(next) => {
          setCelebrationData(null);
          setSelectedNode(next);
          setCurrentView("workspace");
        }}
      />
    </div>
  );
}
