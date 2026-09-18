"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, Activity, CheckCircle2, ShieldAlert, X, Terminal, ArrowRight, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { StaffAIAgent, ChaosIncident } from "@/lib/agent/staffAgent";
import { supabase } from "@/lib/supabase";

interface ChaosIncidentSimulatorProps {
  nodeId: string;
  isOpen: boolean;
  onClose: () => void;
  onIncidentResolved: (earnedXp: number) => void;
}

export function ChaosIncidentSimulator({
  nodeId,
  isOpen,
  onClose,
  onIncidentResolved,
}: ChaosIncidentSimulatorProps) {
  const [incident, setIncident] = useState<ChaosIncident>(() => StaffAIAgent.generateChaosIncident(nodeId));
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(incident.slaMinutes * 60);
  const [errorRate, setErrorRate] = useState<number>(incident.initialErrorRate);
  const [isPatching, setIsPatching] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);
  const [patchCode, setPatchCode] = useState<string>("# Hotfix patch for production incident\n# Apply fix to stop memory allocation leak:\n");

  useEffect(() => {
    setIncident(StaffAIAgent.generateChaosIncident(nodeId));
    setTimeLeftSeconds(StaffAIAgent.generateChaosIncident(nodeId).slaMinutes * 60);
    setErrorRate(StaffAIAgent.generateChaosIncident(nodeId).initialErrorRate);
    setIsResolved(false);
  }, [nodeId]);

  // Countdown clock
  useEffect(() => {
    if (!isOpen || isResolved || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isResolved, timeLeftSeconds]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleDeployHotfix = async () => {
    setIsPatching(true);

    setTimeout(async () => {
      setIsPatching(false);
      setIsResolved(true);
      setErrorRate(0.0);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ["#10b981", "#06b6d4", "#f43f5e"],
      });

      onIncidentResolved(500);

      // Save real resolution into Supabase incident_simulations table
      try {
        await supabase.from("incident_simulations").insert({
          node_id: nodeId,
          title: incident.title,
          severity: incident.severity,
          time_taken_seconds: incident.slaMinutes * 60 - timeLeftSeconds,
          sla_seconds: incident.slaMinutes * 60,
          resolved: true,
          error_telemetry: incident.errorLogs,
          patch_code: patchCode,
        });
      } catch (err) {
        console.warn("Incident telemetry notice:", err);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none">
      <div className="w-full max-w-3xl rounded-xl border border-[#f43f5e]/40 bg-[#07080b] shadow-[0_0_50px_rgba(244,63,94,0.15)] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200 font-mono">
        {/* Urgent Alarm Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#f43f5e]/30 bg-[#f43f5e]/10 text-[#f43f5e]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#f43f5e]/20 border border-[#f43f5e]/40 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-5 h-5 text-[#f43f5e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-[#f43f5e] text-black font-bold text-xs">
                  {incident.severity} CRITICAL
                </span>
                <span className="text-xs tracking-wider text-slate-100 font-bold">
                  PRODUCTION INCIDENT ROOM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Automated Datadog/Better Stack Incident Trigger
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Clock */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-sm font-bold ${
              timeLeftSeconds < 300
                ? "bg-red-500/20 border-red-500 text-red-400 animate-bounce"
                : "bg-[#111318] border-[#2a3041] text-slate-100"
            }`}>
              <Clock className="w-4 h-4 text-[#f43f5e]" />
              <span>SLA: {timeFormatted}</span>
            </div>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded hover:bg-[#1b1f2c] flex items-center justify-center text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry Dashboard */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Incident title and metric strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-[#1e222e] bg-[#0e1017]">
              <span className="text-[10px] text-slate-500 uppercase">Error Rate</span>
              <div className="text-xl font-bold flex items-center gap-2 mt-0.5">
                <span className={errorRate > 0 ? "text-[#f43f5e]" : "text-[#10b981]"}>
                  {errorRate}%
                </span>
                <Activity className={`w-4 h-4 ${errorRate > 0 ? "text-[#f43f5e] animate-pulse" : "text-[#10b981]"}`} />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-[#1e222e] bg-[#0e1017]">
              <span className="text-[10px] text-slate-500 uppercase">Failing Component</span>
              <div className="text-xs text-slate-200 font-semibold truncate mt-1">
                {incident.failingComponent}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-[#1e222e] bg-[#0e1017]">
              <span className="text-[10px] text-slate-500 uppercase">Bounty Reward</span>
              <div className="text-xs text-amber-400 font-bold mt-1">
                +500 XP & Incident Badge
              </div>
            </div>
          </div>

          {/* Description & Diagnostic Hint */}
          <div className="p-3.5 rounded-lg border border-[#1e222e] bg-[#0e1017] space-y-1.5 text-xs">
            <h3 className="text-slate-100 font-bold">{incident.title}</h3>
            <p className="text-slate-300 leading-relaxed">{incident.description}</p>
            <p className="text-[#06b6d4] pt-1">
              <strong>Senior SRE Hint:</strong> {incident.diagnosticHint}
            </p>
          </div>

          {/* Live Error Logs Stream */}
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#f43f5e]" />
              Live Server Log Traceback:
            </span>
            <div className="p-3 rounded-lg bg-[#07080b] border border-[#2a3041] text-[11px] text-rose-300 space-y-1 overflow-x-auto max-h-36">
              {incident.errorLogs.map((log, i) => (
                <div key={i} className="font-mono">{log}</div>
              ))}
            </div>
          </div>

          {/* Hotfix Code Editor Area */}
          {!isResolved ? (
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-semibold flex items-center justify-between">
                <span>Hotfix Patch Solution:</span>
                <span className="text-[10px] text-slate-500 font-normal">Directly applied to production sandbox</span>
              </label>
              <textarea
                value={patchCode}
                onChange={(e) => setPatchCode(e.target.value)}
                rows={4}
                className="w-full rounded-lg bg-[#0e1017] border border-[#2a3041] p-3 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-[#f43f5e] font-mono leading-relaxed resize-none"
              />
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-[#10b981]/15 border border-[#10b981]/40 text-[#10b981] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle2 className="w-5 h-5" />
                INCIDENT RESOLVED — CLUSTER STABILIZED (0.0% ERROR RATE)
              </div>
              <p className="text-slate-300">
                Your hotfix patch arrested the runaway memory leak and restored healthy response times. Post-mortem recorded. +500 XP granted.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#1e222e] bg-[#0e1017]">
          <span className="text-[11px] text-slate-500">
            {isResolved ? "Incident Closed" : "Status: ACTIVE OUTAGE"}
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isResolved ? "Close Incident" : "Leave Room"}
            </button>

            {!isResolved ? (
              <button
                onClick={handleDeployHotfix}
                disabled={isPatching}
                className="flex items-center gap-2 px-5 py-2 rounded bg-[#f43f5e] hover:bg-rose-600 text-white text-xs font-bold transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] disabled:opacity-50"
              >
                {isPatching ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Deploying Hotfix Patch...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3.5 h-3.5" />
                    Deploy Production Hotfix
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2 rounded bg-[#10b981] hover:bg-emerald-600 text-black text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
