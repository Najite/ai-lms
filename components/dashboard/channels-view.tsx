"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  Layers,
  Sparkles,
  Network,
  Terminal,
  BookmarkCheck,
  Plus,
  ArrowRight,
  BookOpen,
  FolderGit2,
  CheckCircle2,
  Clock,
} from "lucide-react";

export interface Channel {
  id: string;
  title: string;
  description: string;
  tag: string;
  itemsCount: number;
  estHours: number;
  completedItems: number;
  curator: string;
  icon: React.ComponentType<{ className?: string }>;
  items: {
    title: string;
    type: "Lesson" | "Capstone" | "Lab";
    lessonId?: string;
  }[];
}

const PRESET_CHANNELS: Channel[] = [
  {
    id: "staff-distributed",
    title: "Staff SWE: Distributed Systems & Consensus Mastery",
    description:
      "A laser-focused channel curated for staff-level systems design interviews. Covers Raft state machines, failure detectors, leader election, and partitioned replication.",
    tag: "High-Priority Systems Design",
    itemsCount: 8,
    estHours: 24,
    completedItems: 3,
    curator: "AI-Native LMS Staff Faculty",
    icon: Network,
    items: [
      { title: "Lesson 10.1: Distributed Systems Foundations & CAP Theorem", type: "Lesson", lessonId: "node-7-1" },
      { title: "Lesson 10.2: Failure Detectors & Heartbeat Protocols", type: "Lesson", lessonId: "node-7-2" },
      { title: "Lesson 10.3: Leader Election & Bully Algorithm", type: "Lesson", lessonId: "node-7-3" },
      { title: "Module 10 Capstone: QuorumCore Distributed Raft Cluster", type: "Capstone" },
    ],
  },
  {
    id: "transformers-scratch",
    title: "AI Systems: From First-Principles Autograd to Vector Engines",
    description:
      "Zero high-level abstraction libraries. Build computational graph reverse-mode AD from scratch, self-attention, and paged KV-cache memory management.",
    tag: "Deep Learning Systems",
    itemsCount: 12,
    estHours: 35,
    completedItems: 1,
    curator: "AI-Native LMS Staff Faculty",
    icon: Sparkles,
    items: [
      { title: "Lesson 4.8: Automatic Differentiation & Tape Recording", type: "Lesson", lessonId: "node-9-8" },
      { title: "Lesson 11.1: Dense Vector Embeddings & Similarity Math", type: "Lesson", lessonId: "node-10-1" },
      { title: "Lesson 13.1: Autonomous Agent Loops & Memory Primitives", type: "Lesson", lessonId: "node-12-1" },
      { title: "Module 4 Capstone: TensorCore Micro-Autograd Engine", type: "Capstone" },
    ],
  },
  {
    id: "ai-prompt-systems",
    title: "AI Systems Engineering: Prompts, Tokens & API Resilience",
    description:
      "Python 3.12, dynamic prompt templates, context token budgeting, exponential backoff retries, and Pydantic JSON contracts.",
    tag: "AI Systems",
    itemsCount: 7,
    estHours: 18,
    completedItems: 4,
    curator: "AI-Native LMS Staff Faculty",
    icon: Terminal,
    items: [
      { title: "Lesson 1.7: Loop Control & Content Moderation Filters", type: "Lesson", lessonId: "node-0-7" },
      { title: "Lesson 1.8: Functions, Parameters & Prompt Payloads", type: "Lesson", lessonId: "node-0-8" },
      { title: "Module 1 Capstone: PromptCLI Developer AI Workbench", type: "Capstone" },
    ],
  },
];

export function ChannelsView({
  onSelectLesson,
}: {
  onSelectLesson: (lessonId: string) => void;
}) {
  const [channels, setChannels] = React.useState<Channel[]>(PRESET_CHANNELS);
  const [activeChannelId, setActiveChannelId] = React.useState<string>(PRESET_CHANNELS[0].id);

  const selectedChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#23252a] gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-4 h-4 text-[#5e6ad2]" />
            <h3 className="text-base font-semibold text-[#f7f8f8]">
              Pluralsight Channels (Curated Playlists)
            </h3>
          </div>
          <p className="text-xs text-[#8a8f98]">
            Organize and pin specific collections of lessons, capstones, and labs around your target engineering goals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#8a8f98]">3 Channels Active</span>
        </div>
      </div>

      {/* Grid of Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const isSelected = channel.id === activeChannelId;
          const pct = Math.round((channel.completedItems / channel.itemsCount) * 100);

          return (
            <div
              key={channel.id}
              onClick={() => setActiveChannelId(channel.id)}
              className={`rounded-xl bg-[#0f1011] border p-5 flex flex-col justify-between space-y-4 cursor-pointer transition-all duration-150 ${
                isSelected
                  ? "border-[#5e6ad2] shadow-lg shadow-[#5e6ad2]/10"
                  : "border-[#23252a] hover:border-[#3b3e48]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-md bg-[#08090a] border border-[#23252a] flex items-center justify-center text-[#5e6ad2]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#16171a] border border-[#23252a] text-[#8a8f98]">
                    {channel.tag}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#f7f8f8] hover:text-white transition-colors">
                    {channel.title}
                  </h4>
                  <p className="text-xs text-[#8a8f98] line-clamp-2 pt-1 leading-relaxed">
                    {channel.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#18191a]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#8a8f98]">
                  <span>{channel.completedItems} / {channel.itemsCount} Completed</span>
                  <span className="text-[#5e6ad2]">{pct}%</span>
                </div>
                <div className="w-full bg-[#18191a] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#5e6ad2] h-full rounded-full"
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Channel Breakdown Drawer/Card */}
      <div className="rounded-xl bg-[#08090a] border border-[#23252a] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1b1c20] pb-3">
          <div className="flex items-center gap-2">
            <selectedChannel.icon className="w-4 h-4 text-[#5e6ad2]" />
            <span className="text-sm font-bold text-[#f7f8f8]">{selectedChannel.title}</span>
          </div>
          <span className="text-xs font-mono text-[#8a8f98]">
            Curator: {selectedChannel.curator}
          </span>
        </div>

        <div className="divide-y divide-[#18191a]">
          {selectedChannel.items.map((item, idx) => (
            <div
              key={idx}
              className="py-3 flex items-center justify-between gap-4 text-xs font-mono"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-[#565961] text-right">{idx + 1}.</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-semibold ${
                    item.type === "Capstone"
                      ? "bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30"
                      : "bg-[#5e6ad2]/15 text-[#5e6ad2] border border-[#5e6ad2]/30"
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-[#f7f8f8] font-medium">{item.title}</span>
              </div>

              {item.lessonId && (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => onSelectLesson(item.lessonId!)}
                  className="text-[#5e6ad2] hover:text-[#6f7cf0] gap-1 text-[11px]"
                >
                  <span>Launch Item</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
