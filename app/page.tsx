import * as React from "react";
import { HeroSplit } from "@/components/landing/hero-split";
import { SocialProof } from "@/components/landing/social-proof";
import { InteractiveAdvantage } from "@/components/landing/interactive-advantage";
import { LearningPaths } from "@/components/landing/learning-paths";
import { CurriculumBrowser } from "@/components/landing/curriculum-browser";
import { PracticeSandbox } from "@/components/sandbox/practice-sandbox";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CapstoneSection } from "@/components/landing/capstone-section";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { Terminal, Github } from "lucide-react";
import { CURRICULUM_META } from "@/lib/curriculum-meta";
import { COMPREHENSIVE_ENTERPRISE_CAPSTONES } from "@/lib/production-capstones";
import {
  LandingTutorProvider,
  LandingNavbar,
  TutorCtaButton,
} from "@/components/landing/landing-client-wrapper";

export default function LandingPage() {
  return (
    <LandingTutorProvider>
      <div className="min-h-screen bg-[#010102] text-[#f7f8f8] selection:bg-[#5e6ad2]/30 selection:text-white flex flex-col justify-between">
        {/* Top sticky navigation */}
        <LandingNavbar />

      <main className="flex-1">
        {/* Section 1: Hero Split (Educative interactive intent search + multi-tab live sandbox) */}
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeroSplit />
          </div>
        </section>

        {/* Section 2: Developer Validation Strip (Educative social proof) */}
        <SocialProof />

        {/* Section 3: The Educative Advantage (Text & Sandboxes vs. 40-Hour Video Hell) */}
        <section id="advantage" className="py-20 border-b border-[#23252a] bg-[#010102]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <InteractiveAdvantage />
          </div>
        </section>

        {/* Section 4: Learning Paths (Educative structured tracks) */}
        <section id="learning-paths" className="py-20 border-b border-[#23252a] bg-[#010102]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <LearningPaths />
          </div>
        </section>

        {/* Section 5: Curriculum Browser */}
        <div id="curriculum-section">
          <CurriculumBrowser />
        </div>

        {/* Section 6: Interactive In-Browser Practice Sandbox (Codecademy instant tests) */}
        <PracticeSandbox />

        {/* Section 7: How It Works (The Dual-Loop Pedagogy) */}
        <section className="py-20 border-b border-[#23252a] bg-[#010102]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HowItWorks />
          </div>
        </section>

        {/* Section 8: Capstone Verification Engine (22 Portfolio Projects) */}
        <div id="capstone-section">
          <CapstoneSection />
        </div>

        {/* Section 9: Personal Engineering Launchpad */}
        <section className="py-20 bg-[#08090a] border-b border-[#23252a]">
          <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
            <div className="inline-flex items-center gap-2">
              <StatusChip status="brand" label="PERSONAL AI ENGINEERING OS" />
              <span className="text-xs font-mono text-[#8a8f98]">700 Lessons • 14 Modules • 100% Practical</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#f7f8f8]">
              Ready to build autonomous AI systems?
            </h2>

            <p className="text-sm text-[#8a8f98] max-w-2xl mx-auto leading-relaxed">
              Continue your sequential path through structured data contracts, vector search, streaming APIs,
              and multi-agent state machines in your local browser sandbox.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/dashboard">
                <Button
                  variant="primary"
                  size="md"
                  className="gap-2 font-mono text-xs w-full sm:w-auto bg-[#5e6ad2] hover:bg-[#6f7cf0]"
                >
                  <Terminal className="w-4 h-4" />
                  <span>Resume Workspace</span>
                </Button>
              </a>
              <TutorCtaButton />
            </div>
          </div>
        </section>
      </main>

      {/* Footer (Linear Mechanical Minimalism) */}
      <footer className="py-12 bg-[#010102] border-t border-[#23252a] text-xs font-mono text-[#8a8f98]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-[4px] bg-[#5e6ad2] flex items-center justify-center text-white text-[10px] font-bold">
              L
            </div>
            <span className="text-[#f7f8f8] font-semibold">AI-Native LMS</span>
            <span className="text-[#383b42]">/</span>
            <span>Personal AI-Native Software Engineering OS</span>
          </div>

          <div className="flex items-center gap-6 text-[#8a8f98]">
            <a href="#curriculum-section" className="hover:text-[#f7f8f8] transition-colors">
              {CURRICULUM_META.totalLessons} Lessons
            </a>
            <a href="#capstone-section" className="hover:text-[#f7f8f8] transition-colors">
              {COMPREHENSIVE_ENTERPRISE_CAPSTONES.length} Capstones
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#f7f8f8] transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>

          <div className="text-[11px] text-[#565961]">
            Strictly AI-Native Software Engineering
          </div>
        </div>
      </footer>
    </div>
    </LandingTutorProvider>
  );
}
