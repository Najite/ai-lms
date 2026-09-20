import * as React from "react";
import { Check, X, ShieldAlert, Zap } from "lucide-react";

export function BenchmarkMatrix() {
  const benchmarks = [
    {
      feature: "Cost to Student",
      ourLms: "$0.00 Forever",
      codecademy: "$150 - $240 / year",
      educative: "$199 - $399 / year",
      bootcamp: "$10,000 - $25,000",
      highlight: true,
    },
    {
      feature: "Curriculum Scope & Depth",
      ourLms: "600 Lessons • 3,000 Subtopics",
      codecademy: "Scattered Short Courses",
      educative: "Isolated Course Modules",
      bootcamp: "40 - 80 Condensed Topics",
      highlight: true,
    },
    {
      feature: "Local Workstation Capstones",
      ourLms: "22 Production Projects (Git & CI)",
      codecademy: "Limited Browser Sandbox",
      educative: "Limited In-Browser Docker",
      bootcamp: "2 - 3 Guided Group Projects",
      highlight: true,
    },
    {
      feature: "Automated Grading Integrity",
      ourLms: "Immutable Test Suite + GitHub Actions",
      codecademy: "Proprietary Test Checks",
      educative: "In-Browser Output Checkers",
      bootcamp: "Subjective TA Reviews",
      highlight: false,
    },
    {
      feature: "Pacing & Urgency Model",
      ourLms: "100% Self-Paced • Zero Urgency",
      codecademy: "Daily Streaks & Gamification",
      educative: "Self-Paced (Subscription Clock)",
      bootcamp: "High-Stress Fixed Cohorts",
      highlight: true,
    },
    {
      feature: "AI Assistance Architecture",
      ourLms: "Grounded RAG (<400ms SSE Stream)",
      codecademy: "Generic LLM Wrapper",
      educative: "Basic Chat AI Assistant",
      bootcamp: "Delayed Office Hours",
      highlight: false,
    },
    {
      feature: "Systems Engineering Scope",
      ourLms: "Compilers, Raft, vLLM, Kernels",
      codecademy: "Primarily Web & Python Basics",
      educative: "Theory-Heavy System Design",
      bootcamp: "Standard Full-Stack Web App",
      highlight: true,
    },
  ];

  return (
    <section id="benchmarks-section" className="space-y-6">
      <div className="border-b border-[#23252a] pb-4">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-[4px] bg-[#0f1012] border border-[#23252a] text-[11px] font-mono text-[#5e6ad2] mb-2">
          <span>RIGOR & VALUE COMPARISON</span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-[#f7f8f8]">
          Architectural & Pedagogical Benchmark
        </h2>
        <p className="text-xs text-[#8a8f98] mt-1">
          How our open, zero-budget, high-density platform compares to traditional commercial alternatives.
        </p>
      </div>

      <div className="overflow-x-auto rounded-[6px] border border-[#23252a] bg-[#08090a] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#1b1c20] bg-[#0f1012] text-[#8a8f98] font-mono">
              <th className="p-3.5 pl-4 font-medium">Evaluation Criterion</th>
              <th className="p-3.5 font-semibold text-[#5e6ad2] bg-[#5e6ad2]/5 border-x border-[#23252a]">
                This LMS (AI-Native)
              </th>
              <th className="p-3.5 font-medium">Codecademy</th>
              <th className="p-3.5 font-medium">Educative.io</th>
              <th className="p-3.5 pr-4 font-medium">Traditional Bootcamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1b1c20] text-[#8a8f98]">
            {benchmarks.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-[#0f1012]/40 transition-colors font-mono text-[11px]"
              >
                <td className="p-3.5 pl-4 font-sans font-medium text-[#f7f8f8]">
                  {row.feature}
                </td>
                <td className="p-3.5 font-semibold text-[#4cb782] bg-[#5e6ad2]/5 border-x border-[#23252a]">
                  {row.ourLms}
                </td>
                <td className="p-3.5">{row.codecademy}</td>
                <td className="p-3.5">{row.educative}</td>
                <td className="p-3.5 pr-4">{row.bootcamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
