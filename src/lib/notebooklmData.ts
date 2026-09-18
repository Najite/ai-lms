export interface DialogueTurn {
  speaker: "Alex (Systems)" | "Jordan (AI Architect)";
  avatar: "alex" | "jordan";
  text: string;
  durationSec: number;
}

export const MODULE_DIALOGUES: Record<string, DialogueTurn[]> = {
  "node-1-1-bpe-tokenizer": [
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Welcome to today's deep-dive. We are unpacking Byte-Pair Encoding and the raw memory mechanics of tokens.",
      durationSec: 6,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "This is foundational. Most beginners think models read raw English text, but transformers strictly process discrete integer IDs.",
      durationSec: 7,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "And if you use character-level tokenization, your sequence length quadruples, which causes the quadratic self-attention memory to blow up GPU VRAM.",
      durationSec: 8,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Exactly. But whole-word tokenization has the Out-Of-Vocabulary nightmare. If a user types a typo or a new emoji, the model crashes or outputs unknown tokens.",
      durationSec: 8,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Byte-Pair Encoding solves both. By starting with 256 base byte tokens (0 to 255), you have a mathematical guarantee that zero text sequences can ever trigger an OOV crash.",
      durationSec: 9,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Then during training, you count adjacent frequency pairs and merge the top recurring pairs into new tokens. At inference, you apply those merge rules in priority order.",
      durationSec: 9,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "And that gives you the optimal balance: compact sequence length without runaway embedding matrix sizes. Let's inspect the code implementation in the workspace.",
      durationSec: 8,
    },
  ],

  "node-1-2-cli-orchestrator": [
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Today we are analyzing Unix process harnesses and why running agent tools without isolation is a catastrophic security risk.",
      durationSec: 7,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Right. When an LLM generates a bash command, executing it with shell=True is essentially giving an untrusted user root access to your machine.",
      durationSec: 8,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "We use shlex.split to parse command arguments into an explicit vector and pass them directly to subprocess.run without invoking a subshell.",
      durationSec: 8,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "And we enforce strict execution timeouts. If a model generates an accidental infinite while loop, our harness kills the process tree before it starves CPU cores.",
      durationSec: 8,
    },
  ],

  "node-2-1-hybrid-retrieval": [
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Let's talk about Hybrid Search and why naive cosine similarity alone causes high hallucination rates in enterprise RAG.",
      durationSec: 7,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Vector search is great at fuzzy semantics, but terrible at exact identifiers. If a user searches for Error Code 4092-B, vector embeddings often retrieve completely irrelevant errors.",
      durationSec: 9,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Which is why we pair sparse BM25 inverted indexes with dense vector embeddings. But here is the catch: you cannot add raw BM25 scores to cosine scores directly.",
      durationSec: 9,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Because BM25 is unbounded from zero to infinity, while cosine is between negative one and one. Reciprocal Rank Fusion normalizes both into rank positions with a smoothing constant of k equals 60.",
      durationSec: 10,
    },
  ],

  "node-2-2-graph-rag": [
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "In this module, we step beyond linear document chunks into Graph-RAG and multi-hop knowledge traversal.",
      durationSec: 7,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Chunk-based search fails when information is fragmented across disparate files. A knowledge graph links entities through explicit relationship edges.",
      durationSec: 8,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "We implement Breadth-First Search over adjacency lists to discover multi-hop reasoning paths, feeding the exact relational graph into the LLM context.",
      durationSec: 8,
    },
  ],

  "node-3-1-token-streaming": [
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Welcome back. Today we're optimizing Time-To-First-Token using asynchronous event loops and Server-Sent Events.",
      durationSec: 7,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Nothing feels slower to a developer than waiting 15 seconds for a model to finish generating 500 tokens before seeing a single word.",
      durationSec: 7,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "With SSE, we stream tokens over persistent HTTP chunked transfer as soon as the GPU completes each autoregressive forward pass.",
      durationSec: 8,
    },
  ],

  "node-3-2-parallel-tools": [
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Today we are building concurrent tool execution pipelines and learning how to avoid microservice deadlocks.",
      durationSec: 7,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "When an agent invokes three tools, running them sequentially takes nine seconds. Running them concurrently with asyncio.gather takes three seconds.",
      durationSec: 8,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "We use return_exceptions equals True so that a single flaky third-party API timeout doesn't crash the other passing tool results.",
      durationSec: 8,
    },
  ],

  "node-4-1-pgvector-index": [
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "In this session, we dissect PostgreSQL internals, pgvector extensions, and HNSW proximity graphs.",
      durationSec: 7,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Rather than running costly dedicated vector silos, keeping vectors alongside relational data gives you ACID transactions and Row-Level Security for free.",
      durationSec: 8,
    },
  ],

  "node-4-2-agent-wal": [
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Write-Ahead Logs are the backbone of resilient databases. Today we apply WAL principles to AI agent memory.",
      durationSec: 7,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "If an agent crashes mid-task, you should never lose state or trigger duplicate credit charges. WAL replay guarantees deterministic recovery.",
      durationSec: 8,
    },
  ],

  "node-5-1-eval-framework": [
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Welcome to Phase 5. Today we replace eyeball-testing with quantitative LLM-as-a-Judge evaluation matrices.",
      durationSec: 7,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "We use G-Eval rubrics and deterministic faithfulness bounds to gate CI/CD pipelines before any model prompt change is merged.",
      durationSec: 8,
    },
  ],

  "node-5-2-prompt-defense": [
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Prompt injection is the buffer overflow of the AI era. Today we construct heuristic firewalls and AST sanitizers.",
      durationSec: 7,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "We analyze adversarial jailbreak vectors and build dual-model architecture boundaries that separate untrusted reader agents from execution planners.",
      durationSec: 9,
    },
  ],

  "node-6-1-vllm-kv-cache": [
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "Welcome to Phase 6. We are exploring high-throughput serving architectures and vLLM PagedAttention.",
      durationSec: 7,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Traditional serving wasted up to 80% of GPU memory due to contiguous tensor allocation. PagedAttention eliminates fragmentation through virtual memory pages.",
      durationSec: 9,
    },
  ],

  "node-6-2-autonomous-capstone": [
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: "Congratulations on reaching the Enterprise Capstone. Today we assemble our autonomous multi-agent synthesis engine.",
      durationSec: 8,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: "We coordinate a planner, a sandboxed coder, and an automated eval judge into a self-healing consensus loop capable of resolving real production tickets.",
      durationSec: 9,
    },
  ],
};

export function getDialogueForNode(nodeId: string, nodeTitle: string): DialogueTurn[] {
  if (MODULE_DIALOGUES[nodeId]) {
    return MODULE_DIALOGUES[nodeId];
  }
  return [
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: `Welcome to this engineering deep-dive on ${nodeTitle}. Let's examine how classical systems foundations connect with modern AI architectures.`,
      durationSec: 7,
    },
    {
      speaker: "Jordan (AI Architect)",
      avatar: "jordan",
      text: `In this module, we focus on deterministic boundaries, production latency constraints, and avoiding naive hallucinations at scale.`,
      durationSec: 7,
    },
    {
      speaker: "Alex (Systems)",
      avatar: "alex",
      text: `Inspect the technical handbook and run the test suite in the Monaco editor to master the hands-on implementation.`,
      durationSec: 6,
    },
  ];
}
