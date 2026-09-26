import * as React from "react";

export function SocialProof() {
  const pillars = [
    "Autonomous Agents",
    "Model Context Protocol",
    "pgvector & Hybrid RAG",
    "Pydantic Data Contracts",
    "Token Streaming SSE",
    "Autograd & Tensors",
    "FastAPI & Asyncio",
    "LLM Evals & Guardrails",
  ];

  return (
    <div className="w-full border-y border-[#23252a] bg-[#08090a] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-5">
          <p className="font-mono text-xs text-[#8a8f98] tracking-wider uppercase text-center flex flex-wrap items-center justify-center gap-1.5">
            <span>Core Pillars of </span>
            <span className="text-[#5e6ad2] font-semibold">AI-Native Software Engineering</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full text-xs font-mono text-[#8a8f98]">
            {pillars.map((pillar) => (
              <div
                key={pillar}
                className="rounded-full border border-[#23252a] bg-[#0f1012] px-3 py-1.5 tracking-[0.08em] uppercase"
              >
                {pillar}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
