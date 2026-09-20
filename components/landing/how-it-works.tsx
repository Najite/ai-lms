import * as React from "react";
import { Terminal, Bot, GitPullRequest, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Terminal,
      title: "Interactive In-Browser Micro-Lessons",
      subtitle: "Educative + Codecademy Speed",
      description:
        "Every lesson pairs conceptual text with an instant in-browser coding sandbox. Write code, execute against unit tests in milliseconds using Pyodide WebAssembly, and solidify fundamentals without setting up environments.",
      badge: "< 20ms Feedback",
      details: ["Python 3.11 & SQLite WASM", "No environment setup needed", "Protected by 5s watchdog timer"],
    },
    {
      number: "02",
      icon: Bot,
      title: "Grounded RAG AI Tutor",
      subtitle: "Zero Hallucination Assistance",
      description:
        "Stuck on a tricky concept or algorithm? The AI Tutor retrieves the exact relevant subtopics from the 600-lesson corpus using pgvector HNSW search and streams precise, cited explanations via Server-Sent Events.",
      badge: "< 400ms Streaming TTFT",
      details: ["5,000 embedded knowledge chunks", "Direct citations to lesson paragraphs", "Unlimited queries on free tier"],
    },
    {
      number: "03",
      icon: GitPullRequest,
      title: "Real Local Workstation Capstones",
      subtitle: "Industry-Grade GitHub Grading",
      description:
        "Real systems aren't toys. Clone capstone starter templates to your machine, write production code in VS Code or Neovim with native compilers, and git push to your public GitHub repo. Automated CI runs the test suite.",
      badge: "Objective CI Evaluation",
      details: ["C, Rust, Go, & Python projects", "Immutable test suites prevent tampering", "Fails if repo is missing (404)"],
    },
  ];

  return (
    <section className="space-y-6">
      <div className="border-b border-[#23252a] pb-4">
        <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-[4px] bg-[#0f1012] border border-[#23252a] text-[11px] font-mono text-[#5e6ad2] mb-2">
          <span>THE DUAL-LOOP PEDAGOGY</span>
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-[#f7f8f8]">
          How The System Works
        </h2>
        <p className="text-xs text-[#8a8f98] mt-1">
          Combining the speed of browser sandboxes with the realism of local command-line development.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.number}
              className="rounded-[6px] border border-[#23252a] bg-[#08090a] p-5 space-y-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:border-[#3b3e48] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#565961] font-bold">{step.number}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-[3px] bg-[#0f1012] border border-[#1b1c20] text-[#4cb782]">
                    {step.badge}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-[4px] bg-[#0f1012] border border-[#23252a] flex items-center justify-center text-[#5e6ad2]">
                  <Icon className="w-4 h-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[#f7f8f8]">{step.title}</h3>
                  <span className="text-[11px] font-mono text-[#8a8f98]">{step.subtitle}</span>
                </div>

                <p className="text-xs text-[#8a8f98] leading-relaxed">{step.description}</p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-[#1b1c20]">
                {step.details.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-[11px] font-mono text-[#565961]">
                    <CheckCircle2 className="w-3 h-3 text-[#4cb782]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
