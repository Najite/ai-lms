export interface ProductionCapstoneSpec {
  phaseId: number;
  phaseName: string;
  projectSlug: string;
  title: string;
  oneLineHook: string; // The "Show HN" / Resume bullet line
  industryArchetype: string; // e.g. "Datadog / vLLM / Cursor / Modal / Temporal"
  employabilityRating: number; // e.g. 98%
  employabilityBadge: "Tier 1 Elite" | "Production Systems" | "Frontier AI";
  salaryBand2026: string; // e.g. "$165k – $220k (Mid/Senior AI Systems Engineer)"
  technologies: string[];
  systemArchitecture: string;
  whyThisMatters2026: string; // Brutal truth about 2026 industry demand
  whatToBuild: string[];
  automatedChecks: string[];
  portfolioProof: {
    githubRepoTemplate: string;
    liveDemoType: "Live Service API" | "Interactive Web App" | "CLI / Docker Engine" | "Distributed Cluster";
    resumeImpactBullet: string;
  };
}

export const PRODUCTION_CAPSTONES_2026: ProductionCapstoneSpec[] = [
  // =========================================================================
  // PHASE 0: Computing & Systems Foundations
  // =========================================================================
  {
    phaseId: 0,
    phaseName: "Phase 0: Computing & Developer Environment",
    projectSlug: "phase-00-capstone-posix-container-runtime",
    title: "Mini-Docker: Lightweight Linux Cgroup & Namespace Container Engine",
    oneLineHook: "Built a zero-dependency Linux container runtime in C/Python using raw unshare, clone, and cgroups v2 to isolate processes, network, and RAM.",
    industryArchetype: "Docker / containerd / runc (Infrastructure Core)",
    employabilityRating: 91,
    employabilityBadge: "Production Systems",
    salaryBand2026: "$140k – $175k (Systems / Cloud Native Engineer)",
    technologies: ["Linux Namespaces", "cgroups v2", "chroot / pivot_root", "OverlayFS", "Python", "POSIX"],
    systemArchitecture: "User Space CLI -> Syscall Gateway (`clone(CLONE_NEWPID | CLONE_NEWNS)`) -> Rootfs Layering (`overlayfs`) -> Cgroup V2 Resource Controller (`memory.max`, `cpu.weight`) -> Ephemeral Isolated Process Sandbox.",
    whyThisMatters2026: "In 2026, AI agents run millions of arbitrary untrusted code executions per hour (e.g. Cursor, Devin, Modal, E2B). Engineers who understand Linux namespaces, isolation boundaries, and kernel cgroups are urgently hired to build agent execution sandboxes.",
    whatToBuild: [
      "Process isolation: spawn sandboxed sub-processes using PID, Mount, UTS, and Network namespaces.",
      "Filesystem isolation: mount an Alpine Linux root filesystem using `pivot_root` and layered OverlayFS.",
      "Resource governance: limit memory consumption to 128MB and CPU execution quota via cgroups v2.",
      "Container lifecycle: implement `run`, `ps`, `exec`, and automatic cleanup on process SIGTERM."
    ],
    automatedChecks: [
      "Process sandbox: verify PID 1 inside container cannot inspect or signal host PID space.",
      "OOM killer invariant: exceeding memory limit terminates container process with exit code 137.",
      "Filesystem immutability: host filesystem remains 100% read-only and unmodified after container operations."
    ],
    portfolioProof: {
      githubRepoTemplate: "mini-docker-runtime-posix",
      liveDemoType: "CLI / Docker Engine",
      resumeImpactBullet: "Engineered a zero-dependency Linux container sandbox utilizing cgroups v2 and POSIX namespaces; provides secure sub-50ms execution isolation for untrusted AI agent scripts."
    }
  },

  // =========================================================================
  // PHASE 1: Programming Mastery & Concurrency
  // =========================================================================
  {
    phaseId: 1,
    phaseName: "Phase 1: Programming Mastery",
    projectSlug: "phase-01-capstone-async-event-loop",
    title: "High-Throughput Async Event Loop & Cooperative Task Scheduler",
    oneLineHook: "Architected a custom Python asyncio-compatible cooperative event loop with non-blocking I/O multiplexing (epoll/kqueue) and priority queue scheduling.",
    industryArchetype: "Node.js libuv / Python uvloop / Tokio (Async Runtime Core)",
    employabilityRating: 92,
    employabilityBadge: "Production Systems",
    salaryBand2026: "$150k – $185k (Backend / Infrastructure Engineer)",
    technologies: ["Async/Await Internals", "Generators / Coroutines", "epoll / kqueue", "Heapq Priority Schedulers", "Socket I/O"],
    systemArchitecture: "Selector Loop (`select.epoll`) -> Coroutine Yield Demuxer -> Ready Queue + Timed Heap Queue -> Socket I/O Multiplexer -> Zero-blocking Concurrent Stream Processing.",
    whyThisMatters2026: "AI pipelines bottleneck not on compute, but on massive async network I/O: concurrent streaming tokens from 50 LLMs, webhook fanouts, and WebSocket audio channels. Writing custom async orchestrators demonstrates deep mastery beyond naive `asyncio.gather`.",
    whatToBuild: [
      "Custom coroutine driver: advance generator/coroutine frames using `.send()` and handle `StopIteration` yields.",
      "I/O multiplexer: register socket file descriptors with non-blocking `select.epoll` (or `kqueue` on macOS).",
      "Timer engine: min-heap priority scheduler supporting `sleep()`, timeouts, and non-drift recurring tasks.",
      "Async network primitives: implement custom `StreamReader` and `StreamWriter` echo server handling 5,000 concurrent sockets."
    ],
    automatedChecks: [
      "Zero GIL-stall: 5,000 concurrent socket connections serviced with p99 latency < 15ms.",
      "Task cancellation: scheduled tasks cleanly propagate CancelledError and trigger finalizer context managers.",
      "Starvation prevention: fair round-robin scheduling between I/O tasks and CPU compute slices."
    ],
    portfolioProof: {
      githubRepoTemplate: "cooperative-async-engine",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Authored an epoll-based async event loop from raw coroutine primitives, sustaining 5,000+ non-blocking socket connections with sub-15ms p99 response times."
    }
  },

  // =========================================================================
  // PHASE 2: Mathematics for Engineers & Numerical Computing
  // =========================================================================
  {
    phaseId: 2,
    phaseName: "Phase 2: Mathematics for Engineers & Numerical Computing",
    projectSlug: "phase-02-capstone-micro-autograd-tensor-engine",
    title: "MicroGrad-Vector: Vectorized Automatic Differentiation & Neural Engine",
    oneLineHook: "Built a NumPy-accelerated reverse-mode automatic differentiation engine supporting multidimensional tensors, broadcast calculus, and transformer attention heads.",
    industryArchetype: "PyTorch Core / TinyGrad / JAX (Deep Learning Foundations)",
    employabilityRating: 95,
    employabilityBadge: "Frontier AI",
    salaryBand2026: "$165k – $210k (ML Infrastructure / Applied AI Engineer)",
    technologies: ["Reverse-Mode Autograd", "Computational DAGs", "Tensor Broadcasting", "Jacobian Vector Products", "NumPy Vectorization"],
    systemArchitecture: "Tensor Node (`data`, `grad`, `_prev`, `_op`) -> Dynamic Tape Generator -> Topological Sort -> Backward Pass Chain Rule Propagator -> Fused Multi-Head Self-Attention Calculation.",
    whyThisMatters2026: "Framework consumers who only call `model.forward()` are a dime a dozen. Engineers who understand computational graphs, gradient tape accumulators, and memory layouts can debug distributed training hangs, write custom loss functions, and optimize quantization boundaries.",
    whatToBuild: [
      "Tensor computation DAG: track forward operations (`add`, `matmul`, `relu`, `softmax`, `cross_entropy`) in a dynamic tape.",
      "Reverse-mode chain rule: recursive topological sorting with automated gradient accumulation avoiding inplace memory mutations.",
      "Broadcasting gradient reducer: properly sum out broadcasted dimensions during backward propagation.",
      "Mini-Transformer layer: train a 2-layer self-attention network on character-level language generation with verified loss convergence."
    ],
    automatedChecks: [
      "Numerical gradient check: analytical gradients match finite-difference approximations within epsilon 1e-5.",
      "Zero graph cycle leaks: computational graph cleans up without reference cycle memory leaks.",
      "Loss convergence: reaches cross-entropy loss < 0.5 on binary classification within 100 epochs."
    ],
    portfolioProof: {
      githubRepoTemplate: "micrograd-tensor-vector-engine",
      liveDemoType: "Interactive Web App",
      resumeImpactBullet: "Constructed a reverse-mode automatic differentiation engine from scratch; verified gradient accuracy against PyTorch within 1e-5 across multi-head attention forward/backward passes."
    }
  },

  // =========================================================================
  // PHASE 3: Data Structures, Algorithms & Problem Solving
  // =========================================================================
  {
    phaseId: 3,
    phaseName: "Phase 3: Data Structures, Algorithms & Problem Solving",
    projectSlug: "phase-03-capstone-lsm-tree-storage-engine",
    title: "Log-Structured Merge-Tree (LSM) Key-Value Database Engine",
    oneLineHook: "Engineered an append-only LSM storage engine with in-memory SkipList MemTable, Write-Ahead Log (WAL), Bloom filter indexing, and multi-tier SSTable compaction.",
    industryArchetype: "RocksDB / LevelDB / Cassandra (High-Performance Storage)",
    employabilityRating: 94,
    employabilityBadge: "Production Systems",
    salaryBand2026: "$160k – $200k (Database Internals / Core Systems Engineer)",
    technologies: ["LSM-Tree", "SkipList", "Bloom Filters", "Write-Ahead Log (WAL)", "SSTables", "Compaction Algorithms"],
    systemArchitecture: "Concurrent Client Put/Get -> Write-Ahead Log (WAL) for durability -> In-Memory SkipList (MemTable) -> Immutable Frozen MemTable -> Flush to Disk SSTable -> Leveled Compaction Worker.",
    whyThisMatters2026: "Vector databases, time-series metrics engines, and distributed LLM caches all rely on LSM trees (e.g. RocksDB underpinning Meta and ByteDance systems). Knowing how disk sequential writes outperform random writes makes you stand out immediately.",
    whatToBuild: [
      "Durability WAL: append-only binary log guaranteeing zero data loss on sudden power loss/crash.",
      "SkipList MemTable: concurrent probabilistic index providing O(log N) search and in-order sequential scans.",
      "Binary SSTable encoder: encode block-compressed keys and values with sparse block indexes.",
      "Bloom filter gate: eliminate 98% of unnecessary disk seeks for non-existent keys.",
      "Compaction coordinator: background thread merging sorted SSTable runs to eliminate tombstones and duplicate writes."
    ],
    automatedChecks: [
      "Crash recovery: kill -9 during active write burst; 100% of acknowledged keys recovered from WAL upon restart.",
      "Bloom filter efficacy: 0 false negatives, false positive rate calibrated strictly below 1.5%.",
      "Compaction invariant: disk footprint shrinks after deletes and key updates."
    ],
    portfolioProof: {
      githubRepoTemplate: "lsm-tree-storage-engine",
      liveDemoType: "CLI / Docker Engine",
      resumeImpactBullet: "Architected a crash-resilient LSM-tree key-value engine with Write-Ahead Logging and Bloom filters, achieving 45,000 write ops/sec with guaranteed crash recovery."
    }
  },

  // =========================================================================
  // PHASE 4: Systems Internals: OS, Concurrency, Networks, Docker
  // =========================================================================
  {
    phaseId: 4,
    phaseName: "Phase 4: Systems Internals: OS, Concurrency, Networks, Docker",
    projectSlug: "phase-04-capstone-zero-copy-http-proxy",
    title: "High-Performance Reverse Proxy & Layer-7 Dynamic Load Balancer",
    oneLineHook: "Constructed a zero-copy HTTP/1.1 & WebSocket reverse proxy with active health checking, round-robin/least-conn balancing, and connection pooling.",
    industryArchetype: "Nginx / Envoy / HAProxy (Cloud Networking Tier)",
    employabilityRating: 93,
    employabilityBadge: "Production Systems",
    salaryBand2026: "$155k – $190k (Cloud Networking / SRE / Platform Engineer)",
    technologies: ["Zero-Copy sendfile", "Socket Splice", "Layer-7 Routing", "Circuit Breakers", "Health Probers", "HTTP Parsing"],
    systemArchitecture: "Edge Ingress Socket -> HTTP Parser -> Upstream Circuit Breaker & Pool -> Epoll Zero-Copy Proxying (`os.splice`/`sendfile`) -> Upstream Fleet.",
    whyThisMatters2026: "Every modern AI infrastructure stack routes inference requests through specialized reverse proxies to load-balance vLLM GPU worker nodes, handle streaming SSE connections, and reject prompt injection DDoS attacks.",
    whatToBuild: [
      "Streaming HTTP/1.1 parser: zero-copy chunked transfer encoding and pipelined request framing.",
      "Load balancing algorithms: Weighted Round-Robin, Least Connections, and Consistent Hash based on IP or session headers.",
      "Upstream connection pool: maintain warm HTTP keep-alive socket pools to eliminate TCP handshake latency.",
      "Health probing & circuit breaking: active background HTTP probes trip circuit breakers on consecutive 5xx errors."
    ],
    automatedChecks: [
      "Zero socket leaks: sustains 100,000 proxied requests without file descriptor leaks (`lsof` check).",
      "Graceful failover: failing an upstream host automatically redirects 100% of traffic to healthy replicas under 50ms.",
      "SSE streaming transparency: token streams flush chunk-by-chunk without proxy buffering delays."
    ],
    portfolioProof: {
      githubRepoTemplate: "l7-reverse-proxy-loadbalancer",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Engineered a low-latency Layer-7 reverse proxy with active circuit breaking and connection pooling, sustaining 20,000 req/sec with sub-5ms routing overhead."
    }
  },

  // =========================================================================
  // PHASE 5: Backend Systems & API Engineering
  // =========================================================================
  {
    phaseId: 5,
    phaseName: "Phase 5: Backend Systems & API Engineering",
    projectSlug: "phase-05-capstone-distributed-rate-limiter",
    title: "Multi-Tenant API Gateway with Distributed Sliding Window Rate Limiting",
    oneLineHook: "Built a production-grade enterprise API gateway with Redis-backed Sliding Window Log rate limiting, HMAC request signing, idempotency keys, and tenant usage metering.",
    industryArchetype: "Stripe API Infrastructure / Cloudflare Gateway / Kong",
    employabilityRating: 96,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "$160k – $205k (Senior Backend / API Platform Engineer)",
    technologies: ["FastAPI", "Redis Lua Scripts", "Sliding Window Counter", "HMAC-SHA256", "Idempotency Keys", "PostgreSQL"],
    systemArchitecture: "Client API Request -> HMAC Signature Verification -> Redis Atomic Lua Sliding Window Limiter -> Idempotency Cache -> Downstream Service -> Metering & Billing Counter.",
    whyThisMatters2026: "With AI tokens costing real money per millisecond, every tech company in 2026 requires strict token budgets, tier-based rate limiters, and idempotency guarantees to prevent duplicate charges or runaway billing.",
    whatToBuild: [
      "Atomic sliding window limiter: Redis Lua script combining timestamped sorted sets to enforce sub-millisecond precision quotas.",
      "Idempotency engine: lock request hashes for 24 hours, guaranteeing duplicate network retries return exact identical cached responses.",
      "HMAC request signing: verify request integrity and replay attack prevention using nonce timestamps.",
      "Multi-tenant usage metering: stream usage metrics asynchronously to PostgreSQL partitioned tables for billing reconciliation."
    ],
    automatedChecks: [
      "Concurrency race test: 50 concurrent requests fired at a 10-req quota allow exactly 10 requests through and return 429 to 40.",
      "Idempotent replay: sending the same payment payload with same Idempotency-Key returns cached response without duplicate side-effects.",
      "Sub-2ms overhead: Redis rate-limit verification adds < 2ms to total request duration."
    ],
    portfolioProof: {
      githubRepoTemplate: "enterprise-api-gateway-limiter",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Developed an enterprise API gateway featuring atomic Redis Lua sliding-window rate limiters and idempotency guards, mitigating duplicate billing and burst traffic at 15,000 QPS."
    }
  },

  // =========================================================================
  // PHASE 6: Full-Stack Frontend Engineering & Real-Time Next.js
  // =========================================================================
  {
    phaseId: 6,
    phaseName: "Phase 6: Full-Stack Frontend Engineering, Browser Internals, and Modern React/Next.js",
    projectSlug: "phase-06-capstone-realtime-ai-workspace",
    title: "Real-Time AI Collaborative Canvas & Multi-Stream Streaming IDE",
    oneLineHook: "Created an ultra-high density real-time collaborative workspace with Server-Sent Events (SSE) token demuxing, virtualized diff rendering, and local-first offline state.",
    industryArchetype: "Cursor / Linear / v0.dev / Figma (Modern AI Frontend)",
    employabilityRating: 97,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "$155k – $200k (Full-Stack / Frontend Systems Engineer)",
    technologies: ["Next.js 15 App Router", "React Server Components", "Server-Sent Events (SSE)", "CRDT Offline Sync", "TailwindCSS", "Monaco Editor"],
    systemArchitecture: "RSC Server Shell -> Client SSE Event Stream -> In-Memory Token Buffer -> Delta-Patch Syntax Highlighter -> Virtualized 60fps Terminal & Editor Canvas.",
    whyThisMatters2026: "The 2026 job market rejects generic portfolio sites and generic to-do apps with a passion. Employers want frontends that handle high-velocity streaming, interactive code diffs, low-latency optimistic UI, and zero-flicker re-renders.",
    whatToBuild: [
      "Multi-stream token receiver: demux parallel SSE streams (model reasoning trace, code diffs, terminal stdout).",
      "Non-destructive line-targeted diff viewer: visual side-by-side patch applicator with accept/reject hunk controls.",
      "Optimistic UI state machine: instant local mutations with rollback on server validation failure.",
      "Sub-16ms render loop: virtualized list handling 100,000 lines of log telemetry at stable 60 FPS without memory bloat."
    ],
    automatedChecks: [
      "60fps scroll benchmark: zero dropped animation frames during high-throughput SSE token streaming.",
      "Lighthouse metrics: 98+ Performance score, 0.00 CLS (Cumulative Layout Shift).",
      "Network disconnect recovery: seamlessly reconnects SSE stream with last-event-id without losing conversational context."
    ],
    portfolioProof: {
      githubRepoTemplate: "nextjs-ai-streaming-workspace",
      liveDemoType: "Interactive Web App",
      resumeImpactBullet: "Built a high-performance streaming AI workspace in Next.js 15 supporting parallel SSE streams and virtualized code diffing, maintaining 60 FPS under continuous token generation."
    }
  },

  // =========================================================================
  // PHASE 7: Distributed Systems, Cloud Infrastructure & DevOps
  // =========================================================================
  {
    phaseId: 7,
    phaseName: "Phase 7: Distributed Systems, Cloud Infrastructure, and Production DevOps",
    projectSlug: "phase-07-capstone-raft-consensus-cluster",
    title: "Distributed Raft Consensus KV Cluster with Automated Leader Election",
    oneLineHook: "Implemented the Raft distributed consensus protocol from scratch with leader election, log replication, heartbeat leases, and network partition recovery.",
    industryArchetype: "etcd / CockroachDB / Consul / Kafka KRaft (Distributed Core)",
    employabilityRating: 98,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "$175k – $230k (Staff / Distributed Systems Engineer)",
    technologies: ["Raft Protocol", "RPC Messaging", "Leader Election", "Log Compaction", "Network Partition Healing", "Docker Compose"],
    systemArchitecture: "Cluster Node Fleet (Follower/Candidate/Leader) -> Heartbeat Lease Timer -> RequestVote RPC -> AppendEntries RPC -> Commit Index Advancement -> State Machine Application.",
    whyThisMatters2026: "Anyone can deploy a managed database. Being able to explain and write consensus, split-brain resolution, and quorum quashing proves you are in the top 5% of systems engineers worldwide.",
    whatToBuild: [
      "Leader election state machine: randomized election timeouts preventing split votes, candidate state transitions, and term voting.",
      "Log replication pipeline: leader broadcasts `AppendEntries` RPCs; commits state once quorum ($N/2 + 1$) acknowledges.",
      "Safety invariant enforcement: election restriction guaranteeing only candidates with up-to-date logs can become leaders.",
      "Chaos partition test: simulate split-brain network partition; verify that isolated minority cannot commit writes and re-converges cleanly upon partition heal."
    ],
    automatedChecks: [
      "Leader election under 300ms: cleanly elects a leader when primary node is killed (`kill -9`).",
      "Linearizable read/write consistency: zero split-brain write collisions during Jepsen-style network partition simulations.",
      "Log convergence: uncommitted log entries on partitioned nodes are correctly overwritten by elected cluster leader."
    ],
    portfolioProof: {
      githubRepoTemplate: "raft-consensus-distributed-cluster",
      liveDemoType: "Distributed Cluster",
      resumeImpactBullet: "Implemented the Raft consensus algorithm from scratch across a 5-node cluster, achieving sub-300ms leader election and proven linearizability under simulated network partitions."
    }
  },

  // =========================================================================
  // PHASE 8: Systems Design & High-Availability Architectures
  // =========================================================================
  {
    phaseId: 8,
    phaseName: "Phase 8: Systems Design, High-Availability Architectures & Interview Mastery",
    projectSlug: "phase-08-capstone-distributed-event-sourcing",
    title: "Global Event-Sourced Ledger Engine with CQRS & Outbox Pattern",
    oneLineHook: "Designed a financial-grade event-sourced audit ledger using CQRS, Kafka event streaming, the Transactional Outbox pattern, and idempotent projection workers.",
    industryArchetype: "Brex / Square / Stripe Ledger / Adyen (Financial Systems)",
    employabilityRating: 97,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "$170k – $220k (Systems Architect / Senior Backend Engineer)",
    technologies: ["Event Sourcing", "CQRS", "Transactional Outbox", "PostgreSQL CDC", "Apache Kafka", "Redis Cache"],
    systemArchitecture: "Write Command -> PostgreSQL Append-Only Event Table + Outbox -> Debezium / CDC Poller -> Kafka Topic -> Materialized CQRS Projections -> Read-Optimized Views.",
    whyThisMatters2026: "Traditional CRUD models fail in complex enterprise environments. Event sourcing provides immutable audit trails, time-travel debugging, and guaranteed zero double-spend anomalies in high-value transactions.",
    whatToBuild: [
      "Append-only event store: immutable state transitions with optimistic concurrency version checking.",
      "Transactional outbox publisher: dual-write prevention guaranteeing every committed database transaction publishes an event to Kafka.",
      "CQRS read projections: asynchronous consumers projecting raw events into denormalized fast-read PostgreSQL views.",
      "Time-travel state reconstruction: replay an account's event stream from inception to any timestamp to verify historical balances."
    ],
    automatedChecks: [
      "Zero double-spend: simultaneous concurrent withdrawal attempts fail with OptimisticLockException.",
      "At-least-once with idempotent replay: re-processing the same Kafka event stream 100 times produces identical balance states.",
      "Audit trail completeness: 100% of state changes correlate to an immutable, cryptographically signed event ID."
    ],
    portfolioProof: {
      githubRepoTemplate: "event-sourced-ledger-cqrs",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Architected a high-concurrency event-sourced ledger using CQRS and the Transactional Outbox pattern, ensuring zero data discrepancies across distributed read projections."
    }
  },

  // =========================================================================
  // PHASE 9: Deep Learning Math & Core Neural Architectures
  // =========================================================================
  {
    phaseId: 9,
    phaseName: "Phase 9: Mathematics of Deep Learning, Autograd & Core Neural Architectures",
    projectSlug: "phase-09-capstone-transformer-from-scratch",
    title: "Production Transformer Architecture with FlashAttention & RoPE",
    oneLineHook: "Implemented a decoder-only LLM architecture (Llama/Mistral style) in PyTorch from mathematical foundations, featuring Rotary Positional Embeddings (RoPE), SwiGLU, and FlashAttention.",
    industryArchetype: "Mistral AI / Anthropic / Meta Llama (Foundation Model Engineering)",
    employabilityRating: 98,
    employabilityBadge: "Frontier AI",
    salaryBand2026: "$180k – $240k (Foundation Model Engineer / AI Systems Scientist)",
    technologies: ["PyTorch", "Rotary Embeddings (RoPE)", "SwiGLU Activations", "RMSNorm", "FlashAttention", "KV-Cache"],
    systemArchitecture: "Token IDs -> Embedding Layer -> N Transformer Decoder Blocks [RMSNorm -> Multi-Head Self-Attention with RoPE & FlashAttention -> SwiGLU FFN] -> RMSNorm -> LM Head.",
    whyThisMatters2026: "In 2026, standard vanilla Transformers with Absolute Positional Embeddings and GELU are obsolete. Candidates who know RoPE complex rotation math, SwiGLU gating, and KV cache layout are hired to train and fine-tune proprietary LLMs.",
    whatToBuild: [
      "Rotary Positional Embeddings (RoPE): complex vector rotation preserving relative token distances without learnable positional bias.",
      "SwiGLU feed-forward network: gating mechanism ($x \\cdot \\sigma(W x) \\cdot V x$) providing superior gradient flow over standard GELU.",
      "RMSNorm: parameter-efficient root-mean-square normalization replacing LayerNorm without computing mean variance.",
      "Inference KV-Cache: rolling tensor cache storing previous Key and Value tensors for $O(1)$ token generation."
    ],
    automatedChecks: [
      "Perplexity verification: trains on TinyStories/WikiText and exhibits monotonically decreasing validation loss.",
      "KV-cache parity: autoregressive generation with KV-cache produces identical output logits as full forward pass.",
      "Weight transfer check: successfully load pre-trained Llama-3B weights and generate coherent English tokens."
    ],
    portfolioProof: {
      githubRepoTemplate: "transformer-rope-swiglu-scratch",
      liveDemoType: "CLI / Docker Engine",
      resumeImpactBullet: "Built a modern decoder-only transformer architecture with RoPE, SwiGLU, and KV-caching; loaded Llama weights to achieve verified autoregressive token generation."
    }
  },

  // =========================================================================
  // PHASE 10: Generative AI, RAG & Vector Systems
  // =========================================================================
  {
    phaseId: 10,
    phaseName: "Phase 10: Generative AI, Retrieval-Augmented Generation (RAG) & Vector Systems",
    projectSlug: "phase-10-capstone-enterprise-hybrid-rag-engine",
    title: "Production Multi-Tenant Hybrid RAG Engine with Cross-Encoder Re-Ranking",
    oneLineHook: "Architected an enterprise RAG pipeline combining dense vector embeddings (HNSW) with sparse BM25 keyword search, Reciprocal Rank Fusion, and Cross-Encoder re-ranking.",
    industryArchetype: "Cohere / Pinecone / Perplexity Enterprise (AI Search & Retrieval)",
    employabilityRating: 99,
    employabilityBadge: "Frontier AI",
    salaryBand2026: "$175k – $225k (Senior AI/RAG Solutions Engineer)",
    technologies: ["pgvector (HNSW)", "BM25 Sparse Retrieval", "Reciprocal Rank Fusion (RRF)", "BAAI bge-reranker", "LangChain/LlamaIndex", "Semantic Caching"],
    systemArchitecture: "User Query -> Query Rewriter & Multi-Query Expander -> Parallel [Dense HNSW Search + Sparse BM25 Search] -> Reciprocal Rank Fusion (RRF) -> Cross-Encoder Re-Ranker -> Context-Grounded LLM Stream.",
    whyThisMatters2026: "Basic naive RAG (OpenAI embedding + Chroma + prompt stuffing) is dead. Companies need production RAG that eliminates hallucination, respects multi-tenant document permissions, and uses hybrid keyword+semantic fusion with re-ranking.",
    whatToBuild: [
      "Dual-stream hybrid index: execute vector cosine similarity on pgvector and full-text BM25 in a single PostgreSQL query.",
      "Reciprocal Rank Fusion (RRF): combine top-50 results from dense and sparse streams without score normalization distortion.",
      "Cross-Encoder re-ranker: score top-20 candidates down to the top-4 most semantically relevant chunks with `bge-reranker-large`.",
      "Hallucination verification gate: automated Ragas/G-Eval check verifying that 100% of facts in answer exist in retrieved context."
    ],
    automatedChecks: [
      "Context precision > 0.90: evaluated on synthetic enterprise QA benchmark datasets.",
      "Sub-150ms retrieval latency: end-to-end hybrid retrieval and re-ranking finishes within 150ms.",
      "Row-level security isolation: tenant A queries never retrieve documents belonging to tenant B under any adversarial prompt injection."
    ],
    portfolioProof: {
      githubRepoTemplate: "enterprise-hybrid-rag-engine",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Deployed an enterprise hybrid RAG engine pairing pgvector HNSW with BM25 and Cross-Encoder re-ranking, boosting retrieval precision to 94% with sub-150ms p95 latency."
    }
  },

  // =========================================================================
  // PHASE 11: Production Engineering, Performance Profiling & MLOps
  // =========================================================================
  {
    phaseId: 11,
    phaseName: "Phase 11: Production Engineering, Performance Profiling & MLOps",
    projectSlug: "phase-11-capstone-llm-inference-serving-cluster",
    title: "High-Throughput PagedAttention GPU Inference Engine & Continuous Batching",
    oneLineHook: "Constructed an LLM inference server featuring PagedAttention KV-cache memory management, continuous dynamic batching, and speculative decoding.",
    industryArchetype: "vLLM / TensorRT-LLM / Fireworks.ai / Together AI (Inference Tier)",
    employabilityRating: 99,
    employabilityBadge: "Frontier AI",
    salaryBand2026: "$190k – $260k (MLOps / AI Systems / Performance Engineer)",
    technologies: ["PagedAttention", "Continuous Dynamic Batching", "Speculative Decoding", "CUDA / PyTorch", "Prometheus Metrics", "Triton Server"],
    systemArchitecture: "Client Request Stream -> Request Priority Queue -> Continuous Batch Scheduler -> Non-Contiguous PagedAttention KV-Cache -> Tensor Parallel Inference -> SSE Token Streamer.",
    whyThisMatters2026: "The biggest bottleneck for AI startups in 2026 is GPU cost. Engineers who can maximize token throughput per dollar using PagedAttention, continuous batching, and draft model speculative decoding command the highest salaries in tech.",
    whatToBuild: [
      "PagedAttention KV-cache allocator: allocate non-contiguous memory blocks in GPU VRAM to eliminate 60% memory fragmentation waste.",
      "Continuous batch scheduler: insert new prompts into running generation batches on every decode tick without waiting for sequence completion.",
      "Speculative decoding pipeline: utilize a lightweight draft model to speculate 4 tokens verified in 1 forward pass of target model.",
      "Production telemetry: export Time-To-First-Token (TTFT), Inter-Token Latency (ITL), and GPU KV-cache usage to Prometheus."
    ],
    automatedChecks: [
      "4x throughput improvement: delivers 4x higher token throughput compared to naive sequential HuggingFace pipeline.",
      "Zero VRAM memory leaks: sustained 24-hour load test exhibits flat GPU memory utilization.",
      "TTFT p95 < 200ms: prompt prefill finishes within 200ms under 50 concurrent active sessions."
    ],
    portfolioProof: {
      githubRepoTemplate: "paged-attention-inference-server",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Constructed a continuous-batching inference server with PagedAttention KV-memory management, multiplying GPU serving throughput by 4.2x while cutting TTFT to 180ms."
    }
  },

  // =========================================================================
  // PHASE 12: Autonomous AI Agents & Multi-Agent Systems
  // =========================================================================
  {
    phaseId: 12,
    phaseName: "Phase 12: Autonomous AI Agents, Multi-Agent Systems & Tool Orchestration",
    projectSlug: "phase-12-capstone-autonomous-software-engineer",
    title: "CodeAgent: Autonomous Multi-Agent Software Engineer with Docker Sandboxes",
    oneLineHook: "Engineered an autonomous multi-agent engineering team (Planner, Coder, Reviewer, Tester) with LangGraph state graphs, hardened Docker sandboxes, and AST diff patching.",
    industryArchetype: "Cognition Devin / Factory / Cursor Agent / SWE-Bench Leaderboard",
    employabilityRating: 100,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "$185k – $250k (Senior AI Agent Architect / Applied AI Lead)",
    technologies: ["LangGraph", "Docker gVisor Sandbox", "AST Patching (Tree-sitter)", "Human-in-the-Loop", "Async Postgres Saver", "Git Automation"],
    systemArchitecture: "GitHub Issue Ingestion -> Planner Agent (DAG decomposition) -> Researcher (RAG over codebase) -> Coder (AST patch generator) -> Docker Sandbox (Pytest validation loop) -> Human Review Gate -> Pull Request.",
    whyThisMatters2026: "This is the flagship definition of an AI-Native Software Engineer in 2026. Companies are replacing rigid scripts with autonomous multi-agent systems that ingest Jira/GitHub issues, write tests, fix bugs in sandboxes, and submit PRs.",
    whatToBuild: [
      "LangGraph cyclical state machine: orchestrate Planner, Coder, and QA Reviewer with persistent state checkpoints in PostgreSQL.",
      "Ephemeral Docker sandbox: execute arbitrary Python/Bash commands in an isolated gVisor container with strict timeout quotas.",
      "Tree-sitter AST symbol search: locate function definitions, references, and dependencies across multi-file repositories.",
      "Autonomous test-driven repair: agent inspects test failure stack traces, formulates hypothesis, edits code, and verifies test passes."
    ],
    automatedChecks: [
      "SWE-bench mini validation: autonomously resolves and opens verified PRs on real open-source bugs with zero human edits.",
      "Sandbox breakout containment: blocks malicious prompt injection attempts to access host network or environment variables.",
      "Human-in-the-Loop gate: pauses execution graph at critical deployment milestones and resumes seamlessly upon user approval."
    ],
    portfolioProof: {
      githubRepoTemplate: "codeagent-autonomous-swe",
      liveDemoType: "Interactive Web App",
      resumeImpactBullet: "Engineered CodeAgent, an autonomous multi-agent SWE system using LangGraph and Docker sandboxes that navigates AST symbols, fixes repository bugs, and opens verified PRs."
    }
  },

  // =========================================================================
  // PHASE 13: Specialized Production Tracks
  // =========================================================================
  {
    phaseId: 13,
    phaseName: "Phase 13: Specialized Production Tracks",
    projectSlug: "phase-13-capstone-frontier-triton-fsdp-ebpf",
    title: "Choose 1 of 4 Specialized Frontier Tracks: Triton / FSDP / eBPF / Local-First",
    oneLineHook: "Delivered an advanced specialization milestone: Custom Triton GPU Kernels, Distributed FSDP Multi-GPU Training, Kernel-Level eBPF Security, or Local-First CRDTs.",
    industryArchetype: "Specialized Frontier Engineering (Meta / OpenAI / Datadog / Linear)",
    employabilityRating: 100,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "$195k – $275k (Staff / Principal Domain Specialist)",
    technologies: ["OpenAI Triton", "PyTorch FSDP", "eBPF (Cilium/Tetragon)", "Yjs CRDTs", "GPU SRAM Kernels"],
    systemArchitecture: "Track A: Local-First Canvas Engine || Track B: Distributed FSDP ZeRO-3 Pipeline || Track C: eBPF Kernel Threat Defense || Track D: Custom FlashAttention Triton Kernel.",
    whyThisMatters2026: "Specialists earn 30-50% more than generalists. Demonstrating either custom GPU kernel programming (Triton), distributed multi-GPU training (FSDP), or kernel security (eBPF) establishes undeniable senior-level authority.",
    whatToBuild: [
      "Track A: Local-first multi-user collaborative canvas with Yjs CRDTs, IndexedDB persistence, and WebSockets.",
      "Track B: Distributed FSDP ZeRO-3 training pipeline sharding 70B parameter models across multi-GPU nodes with Ring-AllReduce.",
      "Track C: Kernel eBPF runtime security probe intercepting malicious syscalls and enforcing zero-trust service mesh.",
      "Track D: Custom fused FlashAttention kernel in OpenAI Triton achieving >80% peak hardware TFLOPs on NVIDIA GPUs."
    ],
    automatedChecks: [
      "Benchmark certification: verified against industry standard profiling tools (NVIDIA Nsight, flame graphs, or perf).",
      "Production defense: passes exhaustive edge-case failure mode and resilience verification."
    ],
    portfolioProof: {
      githubRepoTemplate: "specialized-frontier-track-2026",
      liveDemoType: "Distributed Cluster",
      resumeImpactBullet: "Implemented custom FlashAttention GPU kernels in OpenAI Triton achieving 82% peak TFLOPs efficiency, reducing self-attention memory overhead by 70%."
    }
  },

  // =========================================================================
  // PHASE 14: Comprehensive Capstone & Production Defense
  // =========================================================================
  {
    phaseId: 14,
    phaseName: "Phase 14: Comprehensive Capstone Project & Production Defense",
    projectSlug: "phase-14-capstone-enterprise-ai-platform",
    title: "Enterprise Autonomous Software Intelligence Platform (The Master Synthesis)",
    oneLineHook: "Architected, built, deployed, and defended a multi-tenant enterprise software intelligence platform with distributed microservices, hybrid RAG, LangGraph agents, Terraform GCP infrastructure, and a 60-minute technical defense.",
    industryArchetype: "Comprehensive Enterprise SaaS & AI Operations (Unicorn Grade)",
    employabilityRating: 100,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "$190k – $260k+ (Staff AI-Native Software Engineer)",
    technologies: [
      "Next.js 15", "FastAPI", "PostgreSQL RLS", "Apache Kafka", "pgvector HNSW",
      "LangGraph", "Docker Sandbox", "Terraform", "Kubernetes (GKE)", "OpenTelemetry", "k6 (25k QPS)"
    ],
    systemArchitecture: "Public Gateway -> Next.js RSC Web App + Live SSE -> FastAPI Microservices -> Kafka Event Backbone -> Hybrid RAG + Autonomous Agent Workers -> Multi-Region PostgreSQL + Cloud Storage -> GKE / Terraform GitOps Infrastructure -> OpenTelemetry Observability.",
    whyThisMatters2026: "This is the ultimate proof that you are not a tutorial follower or a prompt monkey. You have built a full-stack, distributed, cloud-native, AI-orchestrated enterprise platform with infrastructure as code, load testing reports, and automated CI/CD.",
    whatToBuild: [
      "Full-stack architecture: Next.js 15 front-end, FastAPI asynchronous microservice fleet, and Kafka message backbone.",
      "Multi-tenant data isolation: PostgreSQL with Row-Level Security (RLS) enforcing strict organizational boundaries.",
      "Autonomous intelligence loop: LangGraph multi-agent workflow integrated with pgvector hybrid search and ephemeral execution sandboxes.",
      "Production DevOps: modular Terraform provisioning GCP GKE clusters, Cloud SQL, and ArgoCD GitOps continuous delivery.",
      "Empirical load validation: distributed k6 stress test proving 25,000 requests/second with error rates < 0.01%.",
      "Production runbooks & defense: documented Disaster Recovery runbook, SLO burn-rate alerts, and 60-minute recorded architecture defense."
    ],
    automatedChecks: [
      "25,000 QPS load test: survives sustained traffic spike with p99 latency < 200ms and zero data loss.",
      "SOC2 / Security audit: zero critical vulnerabilities on Semgrep SAST, Trivy container scan, and OWASP ZAP penetration tests.",
      "Automated chaos drill: automated cluster recovery from primary database kill under 60 seconds."
    ],
    portfolioProof: {
      githubRepoTemplate: "enterprise-software-intelligence-platform",
      liveDemoType: "Distributed Cluster",
      resumeImpactBullet: "Architected and defended a multi-tenant AI intelligence platform supporting 25,000 QPS; orchestrated hybrid RAG, LangGraph agent workflows, and Kubernetes GitOps on GCP with zero CVEs."
    }
  }
];
