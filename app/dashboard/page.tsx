"use client";

import * as React from "react";
import { DashboardSidebar, DashboardView } from "@/components/dashboard/dashboard-sidebar";
import { ContinueLearningQueue } from "@/components/dashboard/continue-learning-queue";
import { SkillIQCard } from "@/components/dashboard/skill-iq-card";
import { RoleIQCard } from "@/components/dashboard/role-iq-card";
import { ChannelsView } from "@/components/dashboard/channels-view";
import { ProgressMatrix } from "@/components/dashboard/progress-matrix";
import { ActivityGrid } from "@/components/dashboard/activity-grid";
import { CapstoneTracker } from "@/components/dashboard/capstone-tracker";
import { WorkspaceView } from "@/components/dashboard/workspace-view";
import { ExerciseView } from "@/components/dashboard/exercise-view";
import { NotesLibrary } from "@/components/dashboard/notes-library";
import { CurriculumBrowser } from "@/components/landing/curriculum-browser";
import { TutorDrawer } from "@/components/tutor/tutor-drawer";
import { useCurriculumProgress } from "@/lib/progress-tracker";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Award,
  UserCheck,
  Zap,
  Terminal,
  Bot,
  Compass,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const [activeView, setActiveView] = React.useState<DashboardView>("overview");
  const [isTutorOpen, setIsTutorOpen] = React.useState(false);
  const [selectedLessonId, setSelectedLessonId] = React.useState<string | null>(null);

  const { completedCount } = useCurriculumProgress();
  const completedLessonsCount = completedCount;

  // Sync with URL hash and query params
  React.useEffect(() => {
    function handleSyncHash() {
      if (typeof window !== "undefined") {
        const hash = window.location.hash.replace("#", "") as DashboardView;
        const validViews: DashboardView[] = [
          "overview",
          "paths",
          "workspace",
          "exercises",
          "curriculum",
          "capstones",
          "notes",
        ];
        if (validViews.includes(hash)) {
          setActiveView(hash);
        }

        const params = new URLSearchParams(window.location.search);
        const lessonParam = params.get("lesson");
        if (lessonParam) {
          setSelectedLessonId(lessonParam);
        }
      }
    }

    handleSyncHash();
    window.addEventListener("hashchange", handleSyncHash);
    return () => {
      window.removeEventListener("hashchange", handleSyncHash);
    };
  }, []);

  const handleViewChange = (view: DashboardView) => {
    setActiveView(view);
    if (typeof window !== "undefined") {
      window.location.hash = view;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStartLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveView("workspace");
    if (typeof window !== "undefined") {
      window.history.pushState(
        null,
        "",
        `/dashboard?lesson=${encodeURIComponent(lessonId)}#workspace`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] selection:bg-[#5e6ad2]/30 selection:text-white flex">
      {/* Pluralsight Left Navigation Sidebar */}
      <DashboardSidebar
        activeView={activeView}
        onViewChange={handleViewChange}
        onOpenTutor={() => setIsTutorOpen(true)}
        completedLessonsCount={completedLessonsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar with Breadcrumb and Quick Telemetry */}
        <header className="sticky top-0 z-30 h-14 border-b border-[#23252a] bg-[#010102]/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-[#8a8f98]">
            <span className="text-[#f7f8f8] font-semibold">Dashboard</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#383b42]" />
            <span className="capitalize text-[#5e6ad2] font-semibold">
              {activeView.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Real Curriculum Progress Chip */}
            <div
              onClick={() => handleViewChange("curriculum")}
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0f1011] border border-[#23252a] hover:border-[#10b981]/50 cursor-pointer transition-colors text-xs font-mono"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-[#8a8f98]">Career Track:</span>
              <span className="text-[#f7f8f8] font-semibold">AI-Native Software Engineer</span>
            </div>

            {/* Modules completed count from DB/progress tracker */}
            <div
              onClick={() => handleViewChange("workspace")}
              className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0f1011] border border-[#23252a] hover:border-[#5e6ad2]/50 cursor-pointer transition-colors text-xs font-mono"
            >
              <Award className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span className="text-[#8a8f98]">Progress:</span>
              <span className="text-[#5e6ad2] font-semibold">{completedLessonsCount} / 700 Lessons</span>
            </div>

            <Button
              variant="outline"
              size="xs"
              onClick={() => setIsTutorOpen(true)}
              className="gap-1.5 font-mono text-[11px]"
            >
              <Bot className="w-3.5 h-3.5 text-[#5e6ad2]" />
              <span>AI Tutor</span>
            </Button>
          </div>
        </header>

        {/* Dynamic View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {activeView === "overview" && (
            <div className="space-y-8 animate-fadeIn">
              {/* 1. Continue Learning Queue tied to database progress */}
              <ContinueLearningQueue
                onResumeLesson={handleStartLesson}
                onViewCapstones={() => handleViewChange("capstones")}
                onViewSkillIQ={() => handleViewChange("paths")}
              />

              {/* 2. Structured Phase Tracks across 700 database lessons */}
              <ProgressMatrix
                onSelectTrack={() => handleViewChange("curriculum")}
                onResumeLesson={handleStartLesson}
              />

              {/* 3. Objective Telemetry Grid */}
              <ActivityGrid />
            </div>
          )}

          {activeView === "skill-iq" && (
            <div className="animate-fadeIn">
              <SkillIQCard onResumeLesson={handleStartLesson} />
            </div>
          )}

          {activeView === "role-iq" && (
            <div className="animate-fadeIn">
              <RoleIQCard onResumeLesson={handleStartLesson} />
            </div>
          )}

          {activeView === "paths" && (
            <div className="animate-fadeIn">
              <ProgressMatrix
                onSelectTrack={() => handleViewChange("curriculum")}
                onResumeLesson={handleStartLesson}
              />
            </div>
          )}

          {activeView === "channels" && (
            <div className="animate-fadeIn">
              <ChannelsView onSelectLesson={handleStartLesson} />
            </div>
          )}

          {activeView === "workspace" && (
            <div className="animate-fadeIn">
              <WorkspaceView
                onOpenTutor={() => setIsTutorOpen(true)}
                initialLessonId={selectedLessonId}
              />
            </div>
          )}

          {activeView === "exercises" && (
            <div className="animate-fadeIn">
              <ExerciseView
                initialLessonId={selectedLessonId}
                onNavigateToLesson={handleStartLesson}
              />
            </div>
          )}

          {activeView === "curriculum" && (
            <div className="animate-fadeIn -mt-16">
              <CurriculumBrowser onStartLesson={handleStartLesson} />
            </div>
          )}

          {activeView === "capstones" && (
            <div className="animate-fadeIn">
              <CapstoneTracker />
            </div>
          )}

          {activeView === "notes" && (
            <div className="animate-fadeIn">
              <NotesLibrary />
            </div>
          )}
        </main>

        {/* Clean Mechanical Footer */}
        <footer className="py-6 bg-[#010102] border-t border-[#23252a] text-xs font-mono text-[#8a8f98] mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[#f7f8f8] font-bold">AI-Native LMS</span>
              <span className="text-[#383b42]">/</span>
              <span>Zero-to-Job AI Software Engineer Curriculum</span>
              <span className="text-[#383b42]">•</span>
              <span className="text-[#10b981]">700 Lessons // 14 Modules // Real AST Verification</span>
            </div>
            <div className="text-[11px] text-[#565961]">
              100% Free Permanent License • Real AST Verification
            </div>
          </div>
        </footer>
      </div>

      {/* Slide-out Grounded RAG Architectural Tutor Drawer */}
      <TutorDrawer isOpen={isTutorOpen} onClose={() => setIsTutorOpen(false)} />
    </div>
  );
}
