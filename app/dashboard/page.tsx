"use client";

import * as React from "react";
import { DashboardNav, DashboardTab } from "@/components/dashboard/dashboard-nav";
import { ResumeHero } from "@/components/dashboard/resume-hero";
import { ProgressMatrix } from "@/components/dashboard/progress-matrix";
import { ActivityGrid } from "@/components/dashboard/activity-grid";
import { CapstoneTracker } from "@/components/dashboard/capstone-tracker";
import { WorkspaceView } from "@/components/dashboard/workspace-view";
import { ExerciseView } from "@/components/dashboard/exercise-view";
import { NotesLibrary } from "@/components/dashboard/notes-library";
import { CurriculumBrowser } from "@/components/landing/curriculum-browser";
import { TutorDrawer } from "@/components/tutor/tutor-drawer";
import { useCurriculumProgress } from "@/lib/progress-tracker";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = React.useState<DashboardTab>("overview");
  const [isTutorOpen, setIsTutorOpen] = React.useState(false);
  const [selectedLessonId, setSelectedLessonId] = React.useState<string | null>(null);

  const { completedCount, lastActiveLessonId } = useCurriculumProgress();
  const completedLessonsCount = completedCount;

  // Restore active tab and lesson from query param or hash if present
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "") as DashboardTab;
      if (["overview", "workspace", "exercises", "curriculum", "capstones", "notes"].includes(hash)) {
        setActiveTab(hash);
      }

      const params = new URLSearchParams(window.location.search);
      const lessonParam = params.get("lesson");
      if (lessonParam) {
        setSelectedLessonId(lessonParam);
      }
    }
  }, []);

  const handleTabChange = (tab: DashboardTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.location.hash = tab;
    }
  };

  const handleStartLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab("workspace");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", `/dashboard?lesson=${encodeURIComponent(lessonId)}#workspace`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] selection:bg-[#5e6ad2]/30 selection:text-white flex flex-col justify-between">
      {/* Top Dashboard Navigation */}
      <DashboardNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenTutor={() => setIsTutorOpen(true)}
        completedLessonsCount={completedLessonsCount}
      />

      {/* Main Tab View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* 1. Codecademy Resume Learning Hero */}
            <ResumeHero
              onResumeWorkspace={(lessonId) => {
                const target = lessonId || lastActiveLessonId || "node-0-1";
                handleStartLesson(target);
              }}
              onViewCurriculum={() => handleTabChange("curriculum")}
              completedLessonsCount={completedLessonsCount}
            />

            {/* 2. Educative-Grade Structured Skill Paths */}
            <ProgressMatrix onSelectTrack={() => handleTabChange("curriculum")} />

            {/* 3. Linear Engineering Telemetry & Verification Grid (Zero Urgency) */}
            <ActivityGrid />
          </div>
        )}

        {activeTab === "workspace" && (
          <div className="animate-fadeIn">
            <WorkspaceView
              onOpenTutor={() => setIsTutorOpen(true)}
              initialLessonId={selectedLessonId}
            />
          </div>
        )}

        {activeTab === "exercises" && (
          <div className="animate-fadeIn">
            <ExerciseView
              initialLessonId={selectedLessonId}
              onNavigateToLesson={handleStartLesson}
            />
          </div>
        )}

        {activeTab === "curriculum" && (
          <div className="animate-fadeIn -mt-16">
            <CurriculumBrowser onStartLesson={handleStartLesson} />
          </div>
        )}

        {activeTab === "capstones" && (
          <div className="animate-fadeIn">
            <CapstoneTracker />
          </div>
        )}

        {activeTab === "notes" && (
          <div className="animate-fadeIn">
            <NotesLibrary />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 bg-[#010102] border-t border-[#23252a] text-xs font-mono text-[#8a8f98]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#f7f8f8]">AI-Native LMS</span>
            <span className="text-[#383b42]">/</span>
            <span>Student Dashboard</span>
            <span className="text-[#383b42]">•</span>
            <span className="text-[#10b981]">100% Self-Paced Guarantee</span>
          </div>

          <div className="text-[11px] text-[#565961]">
            Client-Side Pyodide WASM • Tamper-Proof GitHub Actions CI
          </div>
        </div>
      </footer>

      {/* Grounded Curriculum RAG AI Tutor Drawer */}
      <TutorDrawer isOpen={isTutorOpen} onClose={() => setIsTutorOpen(false)} />
    </div>
  );
}
