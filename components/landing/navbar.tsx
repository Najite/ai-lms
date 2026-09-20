"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Bot, Terminal, BookOpen, Layers, GitPullRequest, LayoutDashboard } from "lucide-react";

interface NavbarProps {
  onOpenTutor: () => void;
}

export function Navbar({ onOpenTutor }: NavbarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#23252a] bg-[#010102]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Logo & Platform Tag */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-[4px] bg-[#5e6ad2] flex items-center justify-center text-white font-mono text-xs font-bold shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
              L
            </div>
            <span className="font-mono text-xs tracking-wider text-[#f7f8f8] uppercase font-semibold">
              AI-Native LMS
            </span>
          </Link>
          <span className="text-[#383b42] text-xs">/</span>
          <StatusChip status="passed" label="ZERO URGENCY" size="sm" />
        </div>

        {/* Center Nav Links (Educative / Codecademy style) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#8a8f98]">
          <Link
            href="/dashboard"
            className="text-[#f7f8f8] hover:text-white transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>Dashboard</span>
          </Link>
          <button
            onClick={() => scrollTo("learning-paths")}
            className="hover:text-[#f7f8f8] transition-colors"
          >
            Skill Paths
          </button>
          <button
            onClick={() => scrollTo("curriculum-section")}
            className="hover:text-[#f7f8f8] transition-colors"
          >
            600 Lessons
          </button>
          <button
            onClick={() => scrollTo("sandbox-section")}
            className="hover:text-[#f7f8f8] transition-colors"
          >
            Playground
          </button>
          <button
            onClick={() => scrollTo("capstone-section")}
            className="hover:text-[#f7f8f8] transition-colors"
          >
            Capstone Grading
          </button>
          <button
            onClick={() => scrollTo("benchmarks-section")}
            className="hover:text-[#f7f8f8] transition-colors"
          >
            Why Us
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="xs"
            onClick={onOpenTutor}
            className="gap-1.5 font-mono text-[11px]"
          >
            <Bot className="w-3.5 h-3.5 text-[#5e6ad2]" />
            <span>AI Tutor</span>
          </Button>

          <Link href="/dashboard">
            <Button
              variant="primary"
              size="xs"
              className="font-mono text-[11px]"
            >
              Start Free
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
