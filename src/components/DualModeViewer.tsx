"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Markdown from "markdown-to-jsx";
import {
  BookOpen,
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ExternalLink,
  Sparkles,
  Upload,
  User,
  Radio,
  FileAudio,
} from "lucide-react";
import { CurriculumNode } from "@/lib/supabase";
import { getDialogueForNode, DialogueTurn } from "@/lib/notebooklmData";

interface DualModeViewerProps {
  node: CurriculumNode;
}

export function DualModeViewer({ node }: DualModeViewerProps) {
  const [activeTab, setActiveTab] = useState<"handbook" | "notebooklm">("handbook");

  // Audio Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [customAudioUrl, setCustomAudioUrl] = useState<string | null>(null);
  const [customAudioFileName, setCustomAudioFileName] = useState<string | null>(null);
  const [isPromptCopied, setIsPromptCopied] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dialogue = useMemo(() => {
    return getDialogueForNode(node.id, node.title);
  }, [node.id, node.title]);

  const totalDurationSec = useMemo(() => {
    return dialogue.reduce((acc, d) => acc + d.durationSec, 0);
  }, [dialogue]);

  const elapsedSec = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < currentLineIndex; i++) {
      sum += dialogue[i]?.durationSec || 0;
    }
    return sum;
  }, [currentLineIndex, dialogue]);

  const progressPercent = Math.min(100, Math.round((elapsedSec / Math.max(1, totalDurationSec)) * 100));

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Reset playback when node changes
  useEffect(() => {
    stopPlayback();
    setCurrentLineIndex(0);
    setCustomAudioUrl(null);
    setCustomAudioFileName(null);
  }, [node.id]);

  const speakLine = (index: number) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    if (index >= dialogue.length) {
      setIsPlaying(false);
      setCurrentLineIndex(0);
      return;
    }

    const turn = dialogue[index];
    const utterance = new SpeechSynthesisUtterance(turn.text);
    utteranceRef.current = utterance;

    utterance.rate = playbackSpeed;
    // Host 1 (Alex): higher pitch / Host 2 (Jordan): deeper pitch
    utterance.pitch = turn.avatar === "alex" ? 1.08 : 0.88;

    // Pick appropriate voices if available
    const voices = synthRef.current.getVoices();
    if (voices.length > 0) {
      const englishVoices = voices.filter((v) => v.lang.startsWith("en"));
      if (turn.avatar === "alex") {
        utterance.voice = englishVoices[0] || voices[0];
      } else {
        utterance.voice = englishVoices[1] || englishVoices[0] || voices[0];
      }
    }

    utterance.onend = () => {
      setCurrentLineIndex((prev) => {
        const next = prev + 1;
        if (next < dialogue.length) {
          speakLine(next);
          return next;
        } else {
          setIsPlaying(false);
          return 0;
        }
      });
    };

    utterance.onerror = (err) => {
      console.warn("SpeechSynthesis error:", err);
      setIsPlaying(false);
    };

    synthRef.current.speak(utterance);
  };

  const handlePlayPause = () => {
    // If playing uploaded audio file
    if (customAudioUrl && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      return;
    }

    // Speech synthesis mode
    if (!synthRef.current) {
      alert("Web Speech synthesis is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      speakLine(currentLineIndex);
    }
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleRestart = () => {
    stopPlayback();
    setCurrentLineIndex(0);
    setTimeout(() => {
      setIsPlaying(true);
      speakLine(0);
    }, 150);
  };

  const handleSeekLine = (index: number) => {
    setCurrentLineIndex(index);
    if (isPlaying) {
      speakLine(index);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
    if (isPlaying && synthRef.current) {
      // Re-trigger current line with new speed
      speakLine(currentLineIndex);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopPlayback();
    const url = URL.createObjectURL(file);
    setCustomAudioUrl(url);
    setCustomAudioFileName(file.name);
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }, 200);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const notebookLmPrompt = `You are hosting an advanced engineering deep-dive discussion between two staff engineers on "${node.title}".
Analyze the transition from the classical CS foundation (${node.cs_foundation}) to the modern AI-native convergence (${node.ai_convergence}).
Discuss production edge-cases, why naive implementations fail at scale, and explain the code architecture step-by-step. Keep the discussion technical, fast-paced, and engaging.`;

  const copyNotebookLmPrompt = () => {
    navigator.clipboard.writeText(notebookLmPrompt);
    setIsPromptCopied(true);
    setTimeout(() => setIsPromptCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e1017] border-r border-[#1e222e]">
      {/* Hidden audio element for uploaded custom audio files */}
      {customAudioUrl && (
        <audio
          ref={audioRef}
          src={customAudioUrl}
          onEnded={() => setIsPlaying(false)}
          muted={isMuted}
        />
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="audio/*"
        className="hidden"
      />

      {/* Header Tabs */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e222e] bg-[#07080b]/50">
        <div className="flex items-center gap-1 p-0.5 rounded border border-[#1e222e] bg-[#07080b]">
          <button
            onClick={() => setActiveTab("handbook")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
              activeTab === "handbook"
                ? "bg-[#1b1f2c] text-slate-100 border border-[#2a3041]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#06b6d4]" />
            Technical Handbook
          </button>
          <button
            onClick={() => setActiveTab("notebooklm")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-all ${
              activeTab === "notebooklm"
                ? "bg-[#1b1f2c] text-slate-100 border border-[#2a3041]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-[#8b5cf6]" />
            NotebookLM Audio
            {isPlaying && (
              <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse ml-0.5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase">
            XP Reward: <span className="text-amber-400 font-bold">+{node.xp_reward}</span>
          </span>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "handbook" ? (
          <div className="max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
            {/* Phase & Title metadata */}
            <div className="pb-4 border-b border-[#1e222e]">
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#06b6d4] uppercase mb-1">
                <span>{node.phase_id.replace("-", " // ")}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-100 tracking-tight">
                {node.title}
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {node.subtitle}
              </p>
            </div>

            {/* Classical CS vs AI Convergence Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
              <div className="p-3 rounded-lg border border-[#1e222e] bg-[#07080b]/60">
                <div className="text-[10px] font-mono uppercase text-slate-500 mb-1">
                  Classical CS Foundation
                </div>
                <div className="text-xs text-slate-200 font-medium font-mono">
                  {node.cs_foundation}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-[#06b6d4]/20 bg-[#06b6d4]/5">
                <div className="text-[10px] font-mono uppercase text-[#06b6d4] mb-1">
                  AI-Native Convergence
                </div>
                <div className="text-xs text-slate-200 font-medium font-mono">
                  {node.ai_convergence}
                </div>
              </div>
            </div>

            {/* Rendered Technical Markdown */}
            <div className="prose prose-invert prose-headings:text-slate-100 prose-headings:font-mono prose-p:text-slate-300 prose-pre:bg-[#07080b] prose-pre:border prose-pre:border-[#1e222e] prose-code:text-[#06b6d4] prose-code:font-mono prose-strong:text-slate-100">
              <Markdown>{node.handbook_markdown}</Markdown>
            </div>
          </div>
        ) : (
          /* NotebookLM Audio Player & Transcript Pane */
          <div className="flex flex-col space-y-6">
            {/* Primary Player Card */}
            <div className="p-5 rounded-xl border border-[#2a3041] bg-[#07080b] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#8b5cf6]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#8b5cf6]">
                  <Radio className="w-4 h-4 animate-pulse" />
                  <span className="font-bold">NOTEBOOKLM CO-HOST AUDIO EXPLAINER</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500">
                    {formatTime(elapsedSec)} / {formatTime(totalDurationSec)}
                  </span>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload exported NotebookLM .mp3"
                    className="p-1.5 rounded border border-[#1e222e] hover:border-[#8b5cf6] text-slate-400 hover:text-[#8b5cf6] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-base font-semibold text-slate-100 mb-1 flex items-center gap-2">
                {customAudioFileName ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                    <FileAudio className="w-4 h-4" /> {customAudioFileName}
                  </span>
                ) : (
                  <>
                    <span>{node.title}</span>
                    <span className="text-[10px] text-slate-500 font-mono px-1.5 py-0.5 rounded bg-[#1e222e]">
                      Dual-Host Synthesis
                    </span>
                  </>
                )}
              </h3>
              <p className="text-xs text-slate-400 mb-5">
                Staff Engineers Alex & Jordan dissect the architecture, trade-offs, and memory boundaries.
              </p>

              {/* Animated Waveform Visualizer */}
              <div className="h-14 flex items-center justify-between gap-1 px-3 py-2 rounded-lg bg-[#0e1017] border border-[#1e222e] mb-4">
                {Array.from({ length: 42 }).map((_, i) => {
                  const isActive = i < (progressPercent / 100) * 42;
                  return (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-150 ${
                        isActive
                          ? "bg-gradient-to-t from-[#06b6d4] to-[#8b5cf6]"
                          : "bg-[#1e222e]"
                      }`}
                      style={{
                        height: isPlaying
                          ? `${Math.max(15, Math.sin(i * 0.5 + Date.now() * 0.003) * 75 + 25)}%`
                          : `${(i % 5 + 2) * 16}%`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Scrubber Progress Bar */}
              <div className="w-full bg-[#1b1f2c] h-1.5 rounded-full overflow-hidden mb-4">
                <div
                  className="bg-gradient-to-r from-[#06b6d4] to-[#8b5cf6] h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Audio Controls Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  {/* Play / Pause */}
                  <button
                    onClick={handlePlayPause}
                    className="w-10 h-10 rounded-full bg-[#8b5cf6] hover:bg-[#9d72f9] text-white flex items-center justify-center transition-all active:scale-95 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5 fill-current" />}
                  </button>

                  {/* Reset */}
                  <button
                    onClick={handleRestart}
                    title="Restart from beginning"
                    className="w-8 h-8 rounded border border-[#1e222e] hover:border-[#2a3041] flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Speed Controls */}
                  <div className="flex items-center rounded border border-[#1e222e] p-0.5 text-xs font-mono bg-[#0e1017]">
                    {[1, 1.25, 1.5, 2].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`px-2 py-0.5 rounded transition-all ${
                          playbackSpeed === speed
                            ? "bg-[#1e222e] text-[#06b6d4] font-bold"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  {/* Mute Toggle */}
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-400 hover:text-slate-200"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Synchronized Dialogue Transcript */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-200">
                  <Sparkles className="w-3.5 h-3.5 text-[#06b6d4]" /> Synchronized Co-Host Transcript
                </span>
                <span className="text-[10px] text-slate-500">Click any line to seek</span>
              </div>

              <div className="space-y-2.5">
                {dialogue.map((turn, index) => {
                  const isCurrent = index === currentLineIndex;
                  const isAlex = turn.avatar === "alex";

                  return (
                    <div
                      key={index}
                      onClick={() => handleSeekLine(index)}
                      className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                        isCurrent
                          ? isAlex
                            ? "border-[#06b6d4] bg-[#06b6d4]/10 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                            : "border-[#8b5cf6] bg-[#8b5cf6]/10 shadow-[0_0_12px_rgba(139,92,246,0.15)]"
                          : "border-[#1e222e] bg-[#07080b]/60 hover:border-[#2a3041]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[11px] font-mono font-bold flex items-center gap-1.5 ${
                            isAlex ? "text-[#06b6d4]" : "text-[#8b5cf6]"
                          }`}
                        >
                          <User className="w-3 h-3" />
                          {turn.speaker}
                        </span>
                        {isCurrent && isPlaying && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#1e222e] text-emerald-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Speaking
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {turn.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Google NotebookLM External Studio Integration */}
            <div className="p-4 rounded-lg border border-[#1e222e] bg-[#07080b]/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#06b6d4]" />
                  NotebookLM Source Prompt
                </span>
                <a
                  href="https://notebooklm.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] font-mono text-[#06b6d4] hover:underline flex items-center gap-1"
                >
                  Open NotebookLM <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <p className="text-xs text-slate-400">
                Want to generate a custom 15-minute studio audio episode in Google NotebookLM? Copy this tailored source prompt, paste into your NotebookLM Audio Overview prompt box, export the MP3, and upload it above.
              </p>

              <div className="p-3 rounded bg-[#0e1017] border border-[#1e222e] font-mono text-xs text-slate-300 select-all">
                {notebookLmPrompt}
              </div>

              <button
                onClick={copyNotebookLmPrompt}
                className="w-full py-2 rounded bg-[#1b1f2c] hover:bg-[#252a3a] border border-[#2a3041] text-xs font-mono text-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                {isPromptCopied ? "✓ Copied to Clipboard!" : "Copy NotebookLM Source Prompt"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
