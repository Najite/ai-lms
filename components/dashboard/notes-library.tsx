"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import {
  BookmarkCheck,
  Cpu,
  Terminal,
  Network,
  Database,
  Lock,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReferenceNote {
  id: string;
  category: "Hardware" | "POSIX" | "Distributed" | "Databases" | "Concurrency";
  title: string;
  phaseRef: string;
  snippet: string;
  summary: string;
}

const NOTES: ReferenceNote[] = [
  {
    id: "note-01",
    category: "Hardware",
    title: "Latency Numbers Every Systems Programmer Must Memorize",
    phaseRef: "Phase 01 // Lesson 018",
    summary: "Physical limits of CPU caching, main memory, and disk/network I/O.",
    snippet: `L1 cache reference:       1 ns      (0.5m scale)
Branch mispredict:        3 ns
L2 cache reference:       4 ns      (2m scale)
Mutex lock/unlock:       17 ns
Main memory (DRAM):     100 ns      (20m scale)
SSD random read (NVMe):  16,000 ns   (16 μs)
Round trip in same DC:  500,000 ns  (0.5 ms)
HDD seek:            10,000,000 ns  (10 ms)
Send packet CA -> NL: 150,000,000 ns (150 ms)`,
  },
  {
    id: "note-02",
    category: "POSIX",
    title: "Linux epoll(7) Event Multiplexing Loop",
    phaseRef: "Phase 05 // Lesson 152",
    summary: "O(1) scalable I/O event notification mechanism replacing O(N) select/poll.",
    snippet: `int epoll_fd = epoll_create1(0);
struct epoll_event ev, events[MAX_EVENTS];
ev.events = EPOLLIN | EPOLLET; // Edge-triggered
ev.data.fd = listen_sock;
epoll_ctl(epoll_fd, EPOLL_CTL_ADD, listen_sock, &ev);

while (1) {
    int nfds = epoll_wait(epoll_fd, events, MAX_EVENTS, -1);
    for (int n = 0; n < nfds; ++n) {
        handle_connection(events[n].data.fd);
    }
}`,
  },
  {
    id: "note-03",
    category: "Distributed",
    title: "Raft Consensus Protocol Safety Invariants",
    phaseRef: "Phase 09 // Lesson 281",
    summary: "Formal correctness criteria for state machine replication without Paxos complexity.",
    snippet: `1. Election Safety: At most one leader can be elected in a given term.
2. Leader Append-Only: A leader never overwrites or truncates its log.
3. Log Matching: If two logs contain an entry with same index and term,
   then logs are identical in all entries up through that index.
4. Leader Completeness: If a log entry is committed in a given term,
   that entry will be present in logs of leaders for all higher terms.
5. State Machine Safety: If a server has applied a log entry at an index,
   no other server will ever apply a different log entry for the same index.`,
  },
  {
    id: "note-04",
    category: "Databases",
    title: "ARIES Protocol: 3-Phase Crash Recovery",
    phaseRef: "Phase 08 // Lesson 254",
    summary: "Write-Ahead Logging (WAL) and physiological redo/undo recovery logic.",
    snippet: `Phase 1: Analysis
- Scan log forward from the most recent checkpoint.
- Reconstruct the Dirty Page Table (DPT) and Transaction Table (TT).

Phase 2: Redo
- Scan forward from the minimum recLSN in the DPT.
- Reapply all logged operations ("repeating history") to bring database to crash state.

Phase 3: Undo
- Scan backward from the end of the log.
- Roll back all active (uncommitted) transactions using Compensation Log Records (CLRs).`,
  },
  {
    id: "note-05",
    category: "Concurrency",
    title: "C11/C++20 Memory Orders & Barrier Primitives",
    phaseRef: "Phase 06 // Lesson 189",
    summary: "Hardware memory model reordering guarantees for lock-free data structures.",
    snippet: `memory_order_relaxed: Atomicity only; no synchronization or ordering guarantees.
memory_order_consume: Data-dependency ordering with concurrent writes.
memory_order_acquire: Ensures subsequent reads/writes cannot be reordered BEFORE this load.
memory_order_release: Ensures prior reads/writes cannot be reordered AFTER this store.
memory_order_acq_rel: Combines acquire (on load) and release (on store).
memory_order_seq_cst: Enforces a globally consistent total order across all threads.`,
  },
];

export function NotesLibrary() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const categories = ["ALL", "Hardware", "POSIX", "Distributed", "Databases", "Concurrency"];

  const filtered = NOTES.filter(
    (n) => selectedCategory === "ALL" || n.category === selectedCategory
  );

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#23252a] gap-2">
        <div>
          <h3 className="text-base font-semibold text-[#f7f8f8] flex items-center gap-2">
            <span>Architectural Reference Library</span>
            <span className="text-xs font-mono text-[#8a8f98]">Educative-Style Reference Notes</span>
          </h3>
          <p className="text-xs text-[#8a8f98]">
            Curated system invariant cheat-sheets, latency metrics, and POSIX reference implementations.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-mono transition-colors whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-[#5e6ad2] text-white"
                  : "bg-[#0f1011] text-[#8a8f98] hover:text-[#f7f8f8] border border-[#23252a]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((note) => (
          <div
            key={note.id}
            className="rounded-lg bg-[#08090a] border border-[#23252a] p-5 space-y-3 flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-[#5e6ad2] uppercase">
                  {note.phaseRef}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141516] border border-[#23252a] text-[#8a8f98]">
                  {note.category}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-[#f7f8f8] mb-1">{note.title}</h4>
              <p className="text-xs text-[#8a8f98]">{note.summary}</p>

              {/* Code snippet */}
              <div className="mt-3 relative rounded bg-[#030304] border border-[#1b1c20] p-3 font-mono text-[11px] text-[#d0d6e0] leading-relaxed overflow-x-auto">
                <button
                  onClick={() => handleCopy(note.id, note.snippet)}
                  className="absolute right-2 top-2 p-1 rounded bg-[#141516] border border-[#23252a] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
                  title="Copy snippet"
                >
                  {copiedId === note.id ? (
                    <Check className="w-3.5 h-3.5 text-[#10b981]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <pre className="pr-8">{note.snippet}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
