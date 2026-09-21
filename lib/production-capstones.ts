export type EnterpriseSector =
  | "Enterprise Software & Cloud Platforms"
  | "Financial Systems & Payment Infrastructure"
  | "Real-Time Communications & Streaming"
  | "Healthcare & Clinical Informatics"
  | "Autonomous AI & Intelligent Systems";

export interface ProductionCapstoneSpec {
  phaseId: number;
  displayPhaseNumber?: number;
  sector?: EnterpriseSector;
  phaseName: string;
  projectSlug: string;
  title: string;
  oneLineHook: string;
  industryArchetype: string;
  employabilityRating: number;
  employabilityBadge: "Tier 1 Elite" | "Production Systems" | "Frontier AI";
  salaryBand2026: string;
  technologies: string[];
  storyScenario: string;
  problemToSolve: string;
  systemArchitecture: string;
  whyThisMatters2026: string;
  whatToBuild: string[];
  automatedChecks: string[];
  portfolioProof: {
    githubRepoTemplate: string;
    liveDemoType: "Live Service API" | "Interactive Web App" | "CLI / Docker Engine" | "Distributed Cluster";
    resumeImpactBullet: string;
  };
}

export const PRODUCTION_CAPSTONES_2026: ProductionCapstoneSpec[] = [
  {
    phaseId: 0,
    displayPhaseNumber: 1,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 1: Computing & Developer Environment",
    projectSlug: "phase-01-capstone-developer-sandbox-runtime",
    title: "CodeBox: Lightweight Secure Code Execution Sandbox Runtime",
    oneLineHook: "Engineered a zero-dependency CLI execution sandbox in Python and POSIX system utilities to execute untrusted user code safely inside isolated memory and directory boundaries.",
    industryArchetype: "Judge0 / Replit Runtime / GitHub Codespaces / LeetCode Execution Engine",
    employabilityRating: 94,
    employabilityBadge: "Production Systems",
    salaryBand2026: "45k – 80k (Platform / Software Systems Engineer)",
    technologies: [
      "Python 3",
      "Process Subprocesses",
      "POSIX Signals (SIGKILL/SIGXCPU)",
      "Resource Limits (setrlimit)",
      "Temporary Virtual Chroot",
      "JSON Stream Telemetry"
    ],
    storyScenario: "When building an interactive coding platform, interview screening tool, or automated grading system, users submit arbitrary code that must be run on your servers. Without an execution sandbox, a student or candidate script can consume 100% of the host RAM, spawn infinite recursive fork-bombs, or read sensitive server configuration files. CodeBox provides an isolated execution manager that runs submitted code inside strict memory ceilings (128MB), process count limits (max 5 threads), and 3-second hard CPU timeouts with clean exit diagnostics.",
    problemToSolve: "Safely execute untrusted third-party code on standard cloud servers without allowing infinite loops, memory exhaustion, or unauthorized host filesystem access.",
    systemArchitecture: "User Code Submission -> CodeBox CLI Runner -> Sandboxed Child Process (setrlimit for RLIMIT_AS & RLIMIT_CPU) -> Isolated Working Directory -> Subprocess Pipe Capture -> Output Telemetry JSON.",
    whyThisMatters2026: "Every modern developer platform (Replit, Cursor, GitHub Codespaces, LeetCode) relies on software execution sandboxes. Building a process runner that reliably enforces memory, CPU, and filesystem boundaries is the foundation of backend and platform engineering.",
    whatToBuild: [
      "Subprocess Isolation Wrapper: spawn user code as a restricted child process with stripped environment variables.",
      "Resource Limit Controller: use OS resource limits (setrlimit) to cap virtual memory to 128MB and execution time to 3.0s.",
      "Filesystem Jail: execute each run inside an ephemeral temporary directory and automatically scrub artifacts on completion.",
      "Structured Telemetry Formatter: capture stdout, stderr, execution wall-clock time, and memory usage into structured JSON."
    ],
    automatedChecks: [
      "Infinite loop protection: scripts with \"while True: pass\" terminate cleanly within 3.0 seconds with SIGXCPU/timeout error.",
      "Memory runaway containment: scripts attempting to allocate 500MB fail immediately with a MemoryError without crashing the host.",
      "Filesystem boundary test: scripts attempting to read parent directory paths (../../) receive permission errors."
    ],
    portfolioProof: {
      githubRepoTemplate: "codebox-secure-code-runner",
      liveDemoType: "CLI / Docker Engine",
      resumeImpactBullet: "Engineered CodeBox, a zero-dependency code execution runner enforcing strict memory (128MB) and CPU timeouts via OS resource limits; safely executes 1,000+ untrusted submissions per hour."
    }
  },
  {
    phaseId: 1,
    displayPhaseNumber: 2,
    sector: "Real-Time Communications & Streaming",
    phaseName: "Phase 2: Programming Mastery",
    projectSlug: "phase-02-capstone-async-task-event-loop",
    title: "TaskPulse: High-Throughput Cooperative Async Task & Event Engine",
    oneLineHook: "Built a cooperative asynchronous event loop and task scheduler from scratch in pure Python using generators, priority heaps, and non-blocking socket streams.",
    industryArchetype: "FastAPI / Node.js libuv / Twisted / Redis Event Core",
    employabilityRating: 94,
    employabilityBadge: "Production Systems",
    salaryBand2026: "50k – 90k (Core Python / Systems Infrastructure Engineer)",
    technologies: [
      "Python Generators",
      "Coroutine Frame Driving (.send/.throw)",
      "Priority Min-Heaps",
      "Non-Blocking Sockets",
      "Select/Poll Multiplexing"
    ],
    storyScenario: "Modern web APIs and real-time messaging servers handle thousands of concurrent client connections simultaneously. Traditional synchronous thread-per-connection servers choke under operating system thread switching overhead and memory bloat. TaskPulse implements a cooperative asynchronous event loop from fundamental computer science principles: tasks yield control on I/O, a priority min-heap schedules delayed timers, and non-blocking socket multiplexing handles 5,000 concurrent client streams on a single CPU thread.",
    problemToSolve: "Eliminate operating system thread overhead and memory exhaustion when managing thousands of concurrent network connections by implementing cooperative asynchronous scheduling.",
    systemArchitecture: "Client Sockets -> Non-Blocking Socket Multiplexer -> Coroutine Task Queue -> Generator Frame Dispatcher -> Priority Timer Min-Heap -> Completed Task Callback.",
    whyThisMatters2026: "Async programming is standard in modern high-scale backend engineering (FastAPI, Node.js, Go). Engineers who understand how coroutine frames advance, pause, and resume build the fastest, most reliable API services.",
    whatToBuild: [
      "Coroutine Frame Runner: advance generator frames using .send() and .throw() to handle cooperative task execution.",
      "Non-Drift Timer Heap: min-heap priority scheduler supporting millisecond-precision task delays, timeouts, and recurring ticks.",
      "Socket I/O Poller: multiplex client socket read/write readiness using non-blocking OS selectors without busy loops.",
      "Graceful Shutdown Manager: support task cancellation, context propagation, and proper resource cleanup on SIGINT."
    ],
    automatedChecks: [
      "Concurrency stress test: services 2,500 simultaneous socket connections with p99 latency under 20ms on a single thread.",
      "Cancellation propagation: cancelling a parent task properly cleans up nested child coroutines and releases sockets.",
      "Timer precision: delayed tasks execute within 2ms of their scheduled target time under high queue load."
    ],
    portfolioProof: {
      githubRepoTemplate: "taskpulse-async-event-engine",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Authored TaskPulse, an async event loop and task scheduler in Python using generators and min-heaps, sustaining 2,500 concurrent connections on a single thread with sub-20ms latency."
    }
  },
  {
    phaseId: 2,
    displayPhaseNumber: 3,
    sector: "Autonomous AI & Intelligent Systems",
    phaseName: "Phase 3: Mathematics for Engineers & Numerical Computing",
    projectSlug: "phase-03-capstone-vectorized-autograd-engine",
    title: "MathGrad: Reverse-Mode Automatic Differentiation & Tensor Engine",
    oneLineHook: "Constructed a NumPy-accelerated computational graph engine and reverse-mode automatic differentiation library for training machine learning models from scratch.",
    industryArchetype: "PyTorch Core / Micrograd / JAX Autodiff / Numerical ML Systems",
    employabilityRating: 96,
    employabilityBadge: "Frontier AI",
    salaryBand2026: "70k – 20k (Machine Learning / Numerical Systems Engineer)",
    technologies: [
      "Reverse-Mode Autodiff",
      "Computational DAGs",
      "Vectorized Matrix Algebra",
      "NumPy Strides",
      "Topological Sorting",
      "Gradient Descent"
    ],
    storyScenario: "Every modern deep learning framework (PyTorch, JAX, TensorFlow) depends on automatic differentiation to calculate gradients of loss functions with respect to millions of model parameters. Without understanding how the computational graph tracks forward operations and recursively backpropagates gradients via the chain rule, debugging numerical instability or designing custom loss functions becomes guesswork. MathGrad constructs a dynamic computational DAG with tensor broadcasting, exact analytical gradients, and optimization passes.",
    problemToSolve: "Calculate exact analytical gradients through multi-layer mathematical operations efficiently without the inaccuracy and computational cost of numerical approximations.",
    systemArchitecture: "Input Tensors -> Forward Operation Graph (matmul, add, relu, log) -> Dynamic Computational Tape -> Reverse Topological Sort -> Gradient Backpropagation -> Parameter Optimizer.",
    whyThisMatters2026: "Understanding the mathematics of computational graphs, backward propagation, and numerical stability is essential for optimizing AI models, writing custom loss functions, and building production machine learning systems.",
    whatToBuild: [
      "Tensor Value Container: track numeric arrays, accumulated gradients, and parent operational pointers.",
      "Vectorized Operation Library: implement forward and backward passes for matrix multiplication, broadcasting additions, ReLU, and Cross-Entropy.",
      "Topological Graph Traversal: recursively sort nodes in the computational DAG to guarantee proper backward execution order.",
      "Multi-Layer Model Optimizer: train a multi-layer neural network on non-linear synthetic data using gradient descent."
    ],
    automatedChecks: [
      "Gradient accuracy: analytical gradients match finite-difference numerical benchmarks within 1e-5 across all operations.",
      "Broadcasting integrity: gradients correctly sum across broadcasted dimensions during backward propagation.",
      "Convergence test: a 2-layer neural network built with MathGrad converges to > 98% accuracy on a classification dataset."
    ],
    portfolioProof: {
      githubRepoTemplate: "mathgrad-tensor-autodiff-engine",
      liveDemoType: "Interactive Web App",
      resumeImpactBullet: "Constructed MathGrad, a reverse-mode automatic differentiation engine from scratch; validated analytical gradients against PyTorch within 1e-5 across multidimensional tensor graphs."
    }
  },
  {
    phaseId: 3,
    displayPhaseNumber: 4,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 4: Data Structures, Algorithms & Problem Solving",
    projectSlug: "phase-04-capstone-high-performance-key-value-store",
    title: "FlashKV: Crash-Resilient Key-Value Storage Engine with Write-Ahead Logging",
    oneLineHook: "Engineered an append-only, crash-resilient key-value storage engine featuring an in-memory SkipList index, binary Write-Ahead Log (WAL), and fast Bloom filter lookups.",
    industryArchetype: "RocksDB / LevelDB / Redis Persistence / SQLite Storage Core",
    employabilityRating: 96,
    employabilityBadge: "Production Systems",
    salaryBand2026: "65k – 10k (Backend Infrastructure / Database Systems Engineer)",
    technologies: [
      "SkipList Data Structure",
      "Write-Ahead Log (WAL)",
      "Bloom Filter",
      "Binary File I/O",
      "CRC32 Checksums",
      "Disk Compaction"
    ],
    storyScenario: "Modern applications require database storage engines that can sustain thousands of writes per second without losing data when a server unexpectedly restarts. In-memory hash maps are fast but volatile, while naive file writes corrupt easily under concurrent load. FlashKV implements a Log-Structured storage engine: all incoming writes append sequentially to an on-disk Write-Ahead Log and an in-memory SkipList. Point queries check a Bloom filter to eliminate unnecessary disk reads, and background compaction purges obsolete values.",
    problemToSolve: "Provide high-speed read and write operations with guaranteed crash recovery, avoiding data corruption and random disk access bottlenecks.",
    systemArchitecture: "Write Request -> Sequential Append-Only Write-Ahead Log (WAL) -> In-Memory SkipList Index -> Bloom Filter Probe -> Disk Compaction Worker -> Verified Data File.",
    whyThisMatters2026: "Databases, search indexes, and caching systems all rely on log-structured storage and probabilistic filters. Understanding these algorithms is what separates junior coders from systems engineers who build reliable data platforms.",
    whatToBuild: [
      "Concurrent SkipList: implement a probabilistic sorted data structure providing O(log N) inserts, searches, and range scans.",
      "Binary Write-Ahead Log: write structured binary records with CRC32 checksums before acknowledging client writes.",
      "Bloom Filter Index: create an in-memory bit array with multiple hash functions to reject queries for non-existent keys in O(1).",
      "Crash Recovery Routine: read the WAL on startup to replay transactions and reconstruct the active memory index completely."
    ],
    automatedChecks: [
      "Crash resilience: killing the process with SIGKILL during a 10,000-write burst recovers 100% of acknowledged entries upon restart.",
      "Bloom filter efficiency: false positive rate stays below 2.0% with zero false negatives.",
      "Range scan correctness: range queries return keys in lexicographical order in O(log N + K) time."
    ],
    portfolioProof: {
      githubRepoTemplate: "flashkv-crash-resilient-store",
      liveDemoType: "CLI / Docker Engine",
      resumeImpactBullet: "Engineered FlashKV, an append-only storage engine with Write-Ahead Logging and Bloom filters, achieving 40,000 writes/sec and verified 100% crash recovery after unexpected termination."
    }
  },
  {
    phaseId: 4,
    displayPhaseNumber: 5,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 5: Systems Internals: OS, Concurrency, Networks, Docker",
    projectSlug: "phase-05-capstone-reverse-proxy-load-balancer",
    title: "RouteMaster: High-Performance Layer-7 Reverse Proxy & Load Balancer",
    oneLineHook: "Built a multi-worker Layer-7 reverse proxy in Python and networking primitives with dynamic upstream health checking, round-robin load balancing, and circuit breakers.",
    industryArchetype: "Nginx / Envoy / Traefik / Cloudflare Edge Router",
    employabilityRating: 95,
    employabilityBadge: "Production Systems",
    salaryBand2026: "60k – 95k (DevOps / Systems Engineer / Site Reliability Engineer)",
    technologies: [
      "TCP Socket Programming",
      "HTTP/1.1 Protocol Parsing",
      "Round-Robin & Least-Connections",
      "Active Health Checking",
      "Circuit Breaker Pattern",
      "Docker Multi-Container"
    ],
    storyScenario: "When modern web applications scale, incoming user traffic cannot be handled by a single server instance. Upstream servers can crash, suffer memory leaks, or experience network drops. RouteMaster acts as an intelligent traffic gateway that receives incoming client HTTP requests, balances traffic across a cluster of backend servers using configurable algorithms, and automatically trips circuit breakers to bypass failing instances within 100 milliseconds.",
    problemToSolve: "Prevent system outages and traffic bottlenecks by evenly distributing client requests across healthy backend servers and isolating failing instances automatically.",
    systemArchitecture: "Client Traffic -> RouteMaster Listening Socket -> HTTP Header Parser -> Upstream Selector (Least-Connections / Round-Robin) -> Backend Connection Pool -> Response Relay.",
    whyThisMatters2026: "Every modern cloud platform relies on reverse proxies and load balancers to route traffic and ensure high availability. Building one from scratch gives you a thorough understanding of the networking stack and HTTP protocol.",
    whatToBuild: [
      "HTTP Stream Parser: read and parse request methods, headers, and content-length without buffering large payloads.",
      "Load Balancing Algorithms: implement Round-Robin and Least-Connections distribution across upstream pools.",
      "Active Health Check Worker: background thread periodically probing /health endpoints and tracking latency.",
      "Circuit Breaker Failover: automatically mark backend servers as down after 3 consecutive failures and redirect traffic."
    ],
    automatedChecks: [
      "Zero-downtime failover: dropping an upstream backend causes 100% of new traffic to redirect to healthy replicas within 100ms.",
      "High-throughput stability: handles 10,000 requests without socket descriptor leaks or memory degradation.",
      "Streaming transparency: chunked HTTP responses and Server-Sent Events pass through without buffering delays."
    ],
    portfolioProof: {
      githubRepoTemplate: "routemaster-reverse-proxy",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Built RouteMaster, an intelligent Layer-7 reverse proxy with active health probing and circuit breakers; maintained 99.99% uptime during simulated upstream node outages."
    }
  },
  {
    phaseId: 5,
    displayPhaseNumber: 6,
    sector: "Financial Systems & Payment Infrastructure",
    phaseName: "Phase 6: Backend Systems & API Engineering",
    projectSlug: "phase-06-capstone-payment-gateway-api",
    title: "PayFlow: Multi-Tenant Payment API Gateway with Idempotency & Rate Limiting",
    oneLineHook: "Built a production-grade payment API gateway in FastAPI and PostgreSQL with atomic Redis sliding-window rate limiting, cryptographic HMAC signatures, and 24-hour idempotency keys.",
    industryArchetype: "Stripe API / Adyen / Plaid / Modern Treasury Gateway",
    employabilityRating: 97,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "65k – 10k (Senior Backend / API Platform Engineer)",
    technologies: [
      "FastAPI (Python)",
      "PostgreSQL",
      "Redis Lua Scripts",
      "Sliding-Window Rate Limiting",
      "HMAC-SHA256 Signatures",
      "Idempotency Keys"
    ],
    storyScenario: "In digital payment processing, network drops often cause client applications to retry transactions. Without robust idempotency mechanisms, a user tapping Pay Now on a slow connection could be charged multiple times. Abusive traffic from one merchant can also exhaust API resources for all others. PayFlow provides an enterprise API gateway that verifies HMAC request signatures, enforces atomic Redis rate limits per merchant, and locks idempotency keys for 24 hours to guarantee zero duplicate charges.",
    problemToSolve: "Prevent double-billing from duplicate client retries and protect backend infrastructure from API abuse across multi-tenant payment platforms.",
    systemArchitecture: "Client Payment Request -> HMAC Signature Guard -> Redis Sliding-Window Rate Limiter -> 24h Idempotency Cache Lock -> Payment Processing Service -> Audit Event Log.",
    whyThisMatters2026: "Enterprise API engineering requires rock-solid reliability: idempotency, rate limiting, and request verification are the most heavily tested concepts in senior backend engineering interviews.",
    whatToBuild: [
      "Atomic Rate Limiter: write a Redis Lua script implementing sliding-window rate limiting with sub-2ms verification latency.",
      "24-Hour Idempotency Cache: store hashed payload keys to return identical responses for duplicate client requests.",
      "HMAC Webhook & Request Signer: verify SHA-256 signatures and timestamp nonces to prevent replay attacks.",
      "Relational Database Schema: design normalized PostgreSQL tables with foreign keys and indexes for merchants and charges."
    ],
    automatedChecks: [
      "Duplicate charge prevention: sending 50 concurrent requests with the identical idempotency key executes the charge exactly once.",
      "Rate limit enforcement: sending 15 requests on a 10-req/min quota returns exactly ten 200s and five 429 Too Many Requests.",
      "Signature verification: tampering with any character in the payload causes immediate 401 Unauthorized rejection."
    ],
    portfolioProof: {
      githubRepoTemplate: "payflow-payment-api-gateway",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Engineered PayFlow, a payment API gateway with atomic Redis sliding-window rate limiting and idempotency locks, guaranteeing zero duplicate transactions across 10,000 QPS."
    }
  },
  {
    phaseId: 6,
    displayPhaseNumber: 7,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 7: Full-Stack Frontend Engineering, Browser Internals, and Modern React/Next.js",
    projectSlug: "phase-07-capstone-collaborative-workspace-canvas",
    title: "BoardSync: Real-Time Collaborative Workspace with Live Streaming & Optimistic UI",
    oneLineHook: "Built a high-performance interactive collaborative workspace in Next.js 15 featuring Server-Sent Events (SSE) streaming, optimistic UI updates, and an HTML5 60 FPS canvas.",
    industryArchetype: "Miro / Figma / Linear / Notion Live Collaboration",
    employabilityRating: 97,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "60k – 05k (Full-Stack / Frontend Systems Engineer)",
    technologies: [
      "Next.js 15 (App Router)",
      "React Server Components",
      "Server-Sent Events (SSE)",
      "HTML5 Canvas API",
      "Optimistic UI State",
      "TailwindCSS"
    ],
    storyScenario: "Modern remote teams rely on visual collaborative tools (like Figma, Miro, and Linear) where changes made by one team member must appear instantly for everyone else without page reloads or UI lag. Building these applications requires mastering browser rendering lifecycles, avoiding unnecessary React re-renders, and managing optimistic updates that make the UI feel instantaneous even on high-latency networks. BoardSync provides a 60 FPS collaborative workspace with live event streaming and instant local state updates.",
    problemToSolve: "Deliver a fluid, responsive collaborative workspace that synchronizes state across users in real time without screen flicker, frame drops, or layout shifts.",
    systemArchitecture: "Next.js 15 App Shell -> Live SSE Event Stream -> Optimistic State Store -> Reconciliation Engine -> 60 FPS HTML5 Canvas Renderer.",
    whyThisMatters2026: "Companies value frontend engineers who understand browser rendering pipelines, WebSockets/SSE streaming, and how to build responsive interfaces that stay buttery smooth under rapid user interaction.",
    whatToBuild: [
      "Streaming Event Receiver: consume Server-Sent Events to stream live user cursors and workspace updates in real time.",
      "Optimistic State Updates: update the client UI immediately upon user action and reconcile with server confirmation in background.",
      "Interactive 60 FPS Canvas: render elements, shapes, and annotations using the HTML5 Canvas API without React DOM bloat.",
      "Virtualized Feed: render extensive project revision histories smoothly using DOM node recycling."
    ],
    automatedChecks: [
      "Frame rate consistency: maintains 60 FPS during continuous user dragging and incoming streaming updates.",
      "Zero Layout Shift: scores 0.00 Cumulative Layout Shift (CLS) on Google Lighthouse audits.",
      "Reconnect recovery: automatically re-establishes SSE streaming with Last-Event-ID on network interruption without state loss."
    ],
    portfolioProof: {
      githubRepoTemplate: "boardsync-collaborative-workspace",
      liveDemoType: "Interactive Web App",
      resumeImpactBullet: "Developed BoardSync, a real-time collaborative workspace in Next.js 15 with Server-Sent Events and HTML5 Canvas, sustaining 60 FPS under continuous multi-user synchronization."
    }
  },
  {
    phaseId: 7,
    displayPhaseNumber: 8,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 8: Distributed Systems, Cloud Infrastructure, and Production DevOps",
    projectSlug: "phase-08-capstone-distributed-consensus-cluster",
    title: "QuorumCore: Distributed Fault-Tolerant Consensus Cluster (Raft Protocol)",
    oneLineHook: "Implemented the Raft distributed consensus protocol from scratch in Python across a 5-node cluster with leader elections, log replication, and partition resilience.",
    industryArchetype: "etcd / HashiCorp Consul / CockroachDB Core / Apache ZooKeeper",
    employabilityRating: 98,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "75k – 30k (Staff / Distributed Systems Engineer)",
    technologies: [
      "Raft Protocol",
      "RPC Communication",
      "Leader Election Timers",
      "Log Replication Quorum",
      "Split-Brain Prevention",
      "Docker Compose"
    ],
    storyScenario: "When software runs across multiple servers in a cloud cluster, individual machines can crash or network cables can fail at any time. If two servers both believe they are the leader and accept conflicting user commands, the database suffers catastrophic data divergence (split-brain). QuorumCore implements the gold-standard Raft consensus algorithm: cluster nodes elect a single leader via randomized election timeouts and replicate state changes to a quorum (N/2 + 1) of nodes before committing.",
    problemToSolve: "Maintain strict data consistency and high availability across a cluster of distributed servers, even when individual nodes crash or network partitions isolate parts of the cluster.",
    systemArchitecture: "Cluster Nodes (Follower -> Candidate -> Leader) -> Randomized Election Timers -> RequestVote RPC -> AppendEntries RPC -> Quorum Commit Index -> State Machine.",
    whyThisMatters2026: "Distributed consensus is the bedrock of Kubernetes (etcd), cloud databases (CockroachDB), and distributed storage. Building Raft proves you can master and debug complex distributed systems.",
    whatToBuild: [
      "Leader Election State Machine: randomized election timeouts (150-300ms), candidate term tracking, and vote tallying.",
      "Log Replication Pipeline: replicate AppendEntries RPCs across nodes and advance the commit index upon quorum acknowledgment.",
      "Safety Invariant Enforcer: guarantee that only candidates with up-to-date log records can ever win an election.",
      "Partition Simulator: demonstrate that an isolated minority cannot commit writes and re-converges cleanly when the partition heals."
    ],
    automatedChecks: [
      "Fast leader election: cluster elects a new stable leader in under 300ms following the crash of the active leader.",
      "Split-brain immunity: during a simulated 3-2 network partition, the minority 2 nodes reject write requests.",
      "Log convergence: uncommitted logs on rejoined nodes are cleanly overwritten and synchronized with the elected leader."
    ],
    portfolioProof: {
      githubRepoTemplate: "quorumcore-raft-consensus-cluster",
      liveDemoType: "Distributed Cluster",
      resumeImpactBullet: "Implemented QuorumCore, a 5-node Raft consensus cluster from scratch; achieved sub-300ms leader election and proven linearizability under simulated network partitions."
    }
  },
  {
    phaseId: 8,
    displayPhaseNumber: 9,
    sector: "Financial Systems & Payment Infrastructure",
    phaseName: "Phase 9: Systems Design, High-Availability Architectures & Interview Mastery",
    projectSlug: "phase-09-capstone-event-sourced-banking-ledger",
    title: "VaultStream: Event-Sourced Banking Ledger with CQRS & Transactional Outbox",
    oneLineHook: "Designed and implemented an event-sourced core banking ledger using CQRS, Kafka message streaming, and the Transactional Outbox pattern for complete financial auditability.",
    industryArchetype: "Brex / Square / Stripe Ledger / Adyen Financial Core",
    employabilityRating: 98,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "75k – 25k (Principal Architect / Senior Systems Engineer)",
    technologies: [
      "Event Sourcing",
      "CQRS Pattern",
      "Transactional Outbox",
      "Apache Kafka",
      "PostgreSQL",
      "Redis Caching"
    ],
    storyScenario: "In commercial banking and fintech, database designs that update account balance columns in-place are dangerous: an update statement erases historical transitions and makes forensic auditing impossible after a bug or fraud incident. VaultStream implements Event Sourcing: every transaction (deposit, withdrawal, transfer) is recorded as an immutable event. The Transactional Outbox pattern guarantees that events publish to Kafka reliably, while background workers project the events into read-optimized account tables.",
    problemToSolve: "Eliminate balance discrepancy risks and provide a 100% immutable, tamper-evident audit trail for financial accounts under high concurrent transaction volume.",
    systemArchitecture: "Write Command -> Append-Only Event Table + Outbox Table -> Change Data Capture Worker -> Kafka Message Bus -> CQRS Consumer -> Read-Optimized Account Balance View.",
    whyThisMatters2026: "Event sourcing and CQRS are standard architectural patterns in banking, logistics, and large-scale enterprise systems where auditability, reliability, and clear separation of concerns are non-negotiable.",
    whatToBuild: [
      "Immutable Event Store: append-only PostgreSQL table with optimistic concurrency control to prevent conflicting account edits.",
      "Transactional Outbox Worker: guarantee message delivery to Kafka within the same database transaction as the event write.",
      "Asynchronous CQRS Projections: background consumer building queryable account balance summaries from event streams.",
      "Time-Travel Rebuilder: replay account events from inception to reconstruct the exact balance at any past date and time."
    ],
    automatedChecks: [
      "Zero double-spend guarantee: concurrent withdrawal attempts against the same balance trigger optimistic lock exceptions.",
      "Idempotent projection: replaying the entire Kafka event stream produces identical balance projections without deviation.",
      "Audit completeness: every account state change links to an immutable signed event record with timestamps."
    ],
    portfolioProof: {
      githubRepoTemplate: "vaultstream-event-sourced-ledger",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Architected VaultStream, an event-sourced banking ledger using CQRS and the Transactional Outbox pattern; eliminated balance discrepancies across 20,000 transactions/sec."
    }
  },
  {
    phaseId: 9,
    displayPhaseNumber: 10,
    sector: "Autonomous AI & Intelligent Systems",
    phaseName: "Phase 10: Mathematics of Deep Learning, Autograd & Core Neural Architectures",
    projectSlug: "phase-10-capstone-neural-transformer-from-scratch",
    title: "NanoLlama: Decoder-Only Transformer Language Model from Scratch",
    oneLineHook: "Built a modern decoder-only transformer architecture in PyTorch from mathematical principles, featuring Rotary Positional Embeddings (RoPE), SwiGLU activations, and KV-caching.",
    industryArchetype: "Mistral AI / Anthropic / Meta Llama / Hugging Face Core",
    employabilityRating: 98,
    employabilityBadge: "Frontier AI",
    salaryBand2026: "80k – 40k (Foundation Model / AI Systems Engineer)",
    technologies: [
      "PyTorch",
      "Rotary Embeddings (RoPE)",
      "SwiGLU Activations",
      "RMSNorm",
      "KV-Cache Memory",
      "Autoregressive Generation"
    ],
    storyScenario: "Engineers who only call third-party AI APIs often struggle when models hallucinate, run out of GPU memory, or produce unexpected outputs. Understanding how language models work at the token, matrix, and attention level is what sets deep learning engineers apart. NanoLlama implements a modern decoder-only transformer architecture from first principles using Rotary Positional Embeddings (RoPE), SwiGLU gating, and an inference KV-cache, enabling verifiable local training and token generation.",
    problemToSolve: "Build a parameter-efficient, modern transformer language model from mathematical foundations and optimize autoregressive token generation with KV-caching.",
    systemArchitecture: "Input Tokens -> Token Embedding Layer -> Transformer Decoder Blocks (RMSNorm -> Multi-Head Attention with RoPE -> SwiGLU FFN) -> RMSNorm -> Linear LM Head -> Autoregressive Sampler.",
    whyThisMatters2026: "Understanding modern transformer internals—RoPE rotations, SwiGLU feed-forward networks, and KV cache memory—is essential for training, adapting, and optimizing local foundation models.",
    whatToBuild: [
      "Rotary Positional Embeddings (RoPE): implement complex vector rotations encoding relative token positions without learned parameters.",
      "SwiGLU Feed-Forward Network: dual-weight gating mechanism providing superior gradient flow compared to standard GELU.",
      "RMSNorm Layer: parameter-efficient normalization eliminating mean calculations while stabilizing deep layer training.",
      "Autoregressive KV-Cache: rolling key/value tensor cache enabling O(1) step computation during sequential token generation."
    ],
    automatedChecks: [
      "Perplexity validation: demonstrates monotonically decreasing cross-entropy loss during training on sample text datasets.",
      "KV-cache output parity: cached autoregressive generation outputs match full forward pass predictions exactly.",
      "Weight transfer compatibility: loads open-weights (e.g. Llama-style checkpoints) and generates coherent tokens."
    ],
    portfolioProof: {
      githubRepoTemplate: "nanollama-transformer-from-scratch",
      liveDemoType: "CLI / Docker Engine",
      resumeImpactBullet: "Built NanoLlama, a modern decoder-only transformer architecture with RoPE, SwiGLU, and KV-caching; verified output parity against open-weights for autoregressive token generation."
    }
  },
  {
    phaseId: 10,
    displayPhaseNumber: 11,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 11: Generative AI, Retrieval-Augmented Generation (RAG) & Vector Systems",
    projectSlug: "phase-11-capstone-enterprise-hybrid-rag-engine",
    title: "DocuMind: Enterprise Hybrid RAG Engine with Dense & Sparse Search",
    oneLineHook: "Architected an enterprise RAG knowledge engine combining dense vector embeddings (HNSW) with sparse BM25 keyword search, Reciprocal Rank Fusion, and Cross-Encoder re-ranking.",
    industryArchetype: "Perplexity Enterprise / Pinecone / Cohere / Notion Q&A Engine",
    employabilityRating: 99,
    employabilityBadge: "Frontier AI",
    salaryBand2026: "75k – 25k (Senior AI / RAG Solutions Engineer)",
    technologies: [
      "pgvector (PostgreSQL HNSW)",
      "BM25 Keyword Search",
      "Reciprocal Rank Fusion (RRF)",
      "Cross-Encoder Re-Ranking",
      "Semantic Caching",
      "Row-Level Security (RLS)"
    ],
    storyScenario: "When companies connect LLMs to their internal documents (contracts, product specs, policies), naive vector search frequently fails: it misses specific acronyms, product SKUs, and exact numerical values. Keyword search alone misses conceptual synonyms. DocuMind implements production-grade hybrid retrieval: dense vector search and sparse BM25 run in parallel, fused via Reciprocal Rank Fusion and re-ranked with a Cross-Encoder, with strict Row-Level Security ensuring users only see authorized data.",
    problemToSolve: "Eliminate hallucinations and retrieval omissions in enterprise document Q&A by combining semantic understanding with exact keyword precision and multi-tenant security.",
    systemArchitecture: "User Query -> Parallel Retrieval (Dense pgvector HNSW + Sparse BM25) -> Reciprocal Rank Fusion (RRF) -> Cross-Encoder Re-Ranker -> Context-Grounded LLM Stream.",
    whyThisMatters2026: "Enterprises have moved past naive vector-only RAG. Production systems require hybrid search, rank fusion, cross-encoder re-ranking, and tenant isolation to deliver trusted, zero-hallucination answers.",
    whatToBuild: [
      "Dual-Index Engine: execute dense cosine similarity and sparse BM25 queries within a single PostgreSQL query.",
      "Reciprocal Rank Fusion: merge top results from dense and sparse streams without score distortion.",
      "Cross-Encoder Re-Ranker: re-score top candidate chunks using a deep cross-encoder to select high-relevance context.",
      "Tenant Isolation & Hallucination Guard: enforce PostgreSQL Row-Level Security and verify fact grounding in retrieved context."
    ],
    automatedChecks: [
      "Context precision benchmark: achieves > 0.90 context precision on clinical and technical QA evaluation sets.",
      "Sub-150ms retrieval latency: end-to-end hybrid retrieval and re-ranking completes within 150ms.",
      "Row-Level Security guarantee: tenant queries never return documents outside their assigned authorization boundary."
    ],
    portfolioProof: {
      githubRepoTemplate: "documind-hybrid-rag-engine",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Deployed DocuMind, an enterprise hybrid RAG engine pairing pgvector HNSW with BM25 and Cross-Encoder re-ranking, boosting retrieval precision to 94% with sub-150ms p95 latency."
    }
  },
  {
    phaseId: 11,
    displayPhaseNumber: 12,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 12: Production Engineering, Performance Profiling & MLOps",
    projectSlug: "phase-12-capstone-llm-inference-serving-engine",
    title: "BatchServe: High-Throughput LLM Inference Server with Continuous Batching",
    oneLineHook: "Constructed a high-throughput LLM inference server featuring PagedAttention KV-cache memory management, continuous dynamic batching, and Prometheus performance metrics.",
    industryArchetype: "vLLM / TensorRT-LLM / Together AI / Fireworks.ai Serving",
    employabilityRating: 99,
    employabilityBadge: "Frontier AI",
    salaryBand2026: "90k – 60k (MLOps / AI Systems / Performance Engineer)",
    technologies: [
      "PagedAttention Memory Model",
      "Continuous Dynamic Batching",
      "Virtual Memory Paging",
      "PyTorch / Python",
      "Prometheus Telemetry",
      "Server-Sent Events (SSE)"
    ],
    storyScenario: "Deploying large language models across thousands of concurrent users is notoriously expensive because GPUs quickly run out of memory. Standard inference setups allocate large contiguous memory buffers for each request based on maximum possible output length, wasting up to 70% of GPU memory. BatchServe implements PagedAttention: KV cache memory is allocated dynamically in non-contiguous physical blocks with virtual paging, multiplying concurrent request capacity by 4x on the same hardware.",
    problemToSolve: "Eliminate GPU memory fragmentation and maximize inference throughput per server during concurrent request bursts.",
    systemArchitecture: "Incoming Request Stream -> Priority Queue -> Continuous Batch Scheduler -> PagedAttention Non-Contiguous Memory -> Model Forward Pass -> SSE Streamer.",
    whyThisMatters2026: "GPU compute is the single largest operational cost for AI infrastructure. Engineers who can optimize memory management and continuous batching are among the most sought-after systems specialists.",
    whatToBuild: [
      "PagedAttention Allocator: manage non-contiguous GPU memory blocks to eliminate internal memory fragmentation.",
      "Continuous Batching Scheduler: insert incoming requests into active decoding iterations on every generation step.",
      "Dynamic Request Queue: prioritize requests and manage preemption under high GPU memory utilization.",
      "Production Telemetry Dashboard: export Time-To-First-Token (TTFT) and Inter-Token Latency (ITL) to Prometheus."
    ],
    automatedChecks: [
      "4x throughput multiplier: sustains 4x higher token generation throughput than sequential baseline serving.",
      "Zero VRAM memory leaks: continuous 24-hour stress tests maintain stable GPU memory utilization.",
      "Sub-200ms TTFT: prompt prefill completes within 200ms under 50 concurrent active streaming sessions."
    ],
    portfolioProof: {
      githubRepoTemplate: "batchserve-continuous-batching-engine",
      liveDemoType: "Live Service API",
      resumeImpactBullet: "Constructed BatchServe, a continuous-batching inference server with PagedAttention KV-memory management, multiplying GPU serving throughput by 4.2x while cutting TTFT to 180ms."
    }
  },
  {
    phaseId: 12,
    displayPhaseNumber: 13,
    sector: "Autonomous AI & Intelligent Systems",
    phaseName: "Phase 13: Autonomous AI Agents, Multi-Agent Systems & Tool Orchestration",
    projectSlug: "phase-13-capstone-autonomous-coding-agent",
    title: "CodeCraft: Autonomous Multi-Agent Software Engineer with Docker Sandboxes",
    oneLineHook: "Engineered an autonomous multi-agent engineering system (Planner, Coder, Reviewer, Tester) with LangGraph state graphs, Docker sandboxes, and AST diff patching.",
    industryArchetype: "Cognition Devin / Factory / Cursor Agent / SWE-Bench Framework",
    employabilityRating: 100,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "85k – 50k (Senior AI Agent Architect / Applied AI Lead)",
    technologies: [
      "LangGraph",
      "Docker Execution Sandbox",
      "Tree-sitter AST Patching",
      "Human-in-the-Loop",
      "PostgreSQL Checkpointing",
      "Git CLI Automation"
    ],
    storyScenario: "Engineering teams spend hundreds of hours per quarter triaging dependency updates, fixing minor bug reports, and writing boilerplate regression tests. Static scripts cannot reason about unfamiliar codebases or recover from failing unit tests. CodeCraft builds an autonomous multi-agent engineering team: a Planner decomposes issues, a Researcher explores symbols using Tree-sitter ASTs, a Coder drafts patches, and a Tester executes Pytest inside an isolated Docker sandbox until all tests pass.",
    problemToSolve: "Automate end-to-end repository issue resolution while isolating code execution safely within secured ephemeral sandboxes.",
    systemArchitecture: "Issue Intake -> Planner Agent (DAG decomposition) -> Tree-sitter AST Search -> Coder Agent -> Docker Sandbox (Pytest validation loop) -> Reviewer -> Verified Pull Request.",
    whyThisMatters2026: "Autonomous agent architectures that can navigate repositories, execute commands safely in sandboxes, and iteratively fix test failures define the frontier of software engineering in 2026.",
    whatToBuild: [
      "LangGraph Cyclical State Machine: coordinate Planner, Coder, and Reviewer with state persistence in PostgreSQL.",
      "Ephemeral Docker Sandbox: execute arbitrary test scripts safely inside an isolated container with timeout limits.",
      "Tree-sitter AST Symbol Navigator: index function definitions, call sites, and import trees across multi-file codebases.",
      "Iterative Repair Loop: inspect error stack traces, formulate hypotheses, edit code, and re-run tests until green."
    ],
    automatedChecks: [
      "Autonomous issue resolution: cleanly resolves real open-source bug benchmarks and opens verified pull requests.",
      "Sandbox breakout containment: blocks unauthorized access attempts to host network or environment variables.",
      "Human-in-the-loop checkpointing: supports pausing execution at critical milestones and resuming seamlessly upon user review."
    ],
    portfolioProof: {
      githubRepoTemplate: "codecraft-autonomous-coding-agent",
      liveDemoType: "Interactive Web App",
      resumeImpactBullet: "Engineered CodeCraft, an autonomous multi-agent software engineering system using LangGraph and Docker sandboxes that navigates AST symbols, fixes repository bugs, and opens verified PRs."
    }
  },
  {
    phaseId: 13,
    displayPhaseNumber: 14,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 14: Specialized Production Tracks",
    projectSlug: "phase-14-capstone-specialized-engineering-tracks",
    title: "Choose 1 of 4 Specialized Advanced Engineering Tracks: WebGL / MLOps / Security / Triton",
    oneLineHook: "Delivered an advanced specialization milestone: Custom Triton GPU Kernels, Distributed FSDP Multi-GPU Training, Kernel-Level eBPF Security, or Local-First CRDTs.",
    industryArchetype: "Specialized Frontier Engineering (OpenAI / Meta / Datadog / Linear)",
    employabilityRating: 100,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "95k – 75k (Staff / Principal Domain Specialist)",
    technologies: [
      "OpenAI Triton",
      "PyTorch FSDP",
      "eBPF Cilium/Tetragon",
      "Yjs CRDTs",
      "GPU SRAM Kernels"
    ],
    storyScenario: "Senior and staff engineering roles require deep, specialized authority in one core technical domain. Whether training 70B parameter models across distributed clusters, writing custom GPU kernels that bypass PyTorch memory overhead, inspecting Linux kernel syscalls with eBPF for zero-trust security, or building local-first collaborative canvas engines with CRDTs, this milestone lets engineers demonstrate world-class depth in their chosen domain.",
    problemToSolve: "Demonstrate deep specialization in one high-leverage systems domain: GPU kernel optimization, distributed training, kernel security, or real-time local-first collaboration.",
    systemArchitecture: "Track A: Local-First Canvas Engine || Track B: Distributed FSDP ZeRO-3 Pipeline || Track C: eBPF Kernel Security Probe || Track D: Custom FlashAttention Triton Kernel.",
    whyThisMatters2026: "Specialists who can write custom GPU kernels or orchestrate distributed multi-GPU training clusters solve the most expensive technical challenges in modern computing.",
    whatToBuild: [
      "Track A: Local-first multi-user collaborative canvas with Yjs CRDTs, IndexedDB persistence, and WebSockets.",
      "Track B: Distributed FSDP ZeRO-3 training pipeline sharding 70B parameter models across multi-GPU nodes.",
      "Track C: Kernel eBPF runtime security probe intercepting malicious syscalls and enforcing network policies.",
      "Track D: Custom fused FlashAttention kernel in OpenAI Triton achieving high hardware efficiency on NVIDIA GPUs."
    ],
    automatedChecks: [
      "Benchmark verification: verified against profiling tools (Nsight, flame graphs, or perf) confirming performance gains.",
      "Production resilience: passes comprehensive edge-case and failure-mode validation suites."
    ],
    portfolioProof: {
      githubRepoTemplate: "specialized-engineering-track",
      liveDemoType: "Distributed Cluster",
      resumeImpactBullet: "Implemented custom FlashAttention GPU kernels in OpenAI Triton achieving 82% peak TFLOPs efficiency, reducing self-attention memory overhead by 70%."
    }
  },
  {
    phaseId: 14,
    displayPhaseNumber: 15,
    sector: "Enterprise Software & Cloud Platforms",
    phaseName: "Phase 15: Comprehensive Capstone Project & Production Defense",
    projectSlug: "phase-15-capstone-master-ai-platform",
    title: "CloudMatrix: Enterprise Multi-Tenant AI Platform with Distributed Microservices",
    oneLineHook: "Architected, built, deployed, and defended a multi-tenant enterprise AI platform with distributed microservices, hybrid RAG, LangGraph agents, Terraform GCP infrastructure, and a technical defense.",
    industryArchetype: "Comprehensive Enterprise SaaS & AI Operations (Unicorn Grade)",
    employabilityRating: 100,
    employabilityBadge: "Tier 1 Elite",
    salaryBand2026: "90k – 60k+ (Staff AI-Native Software Engineer)",
    technologies: [
      "Next.js 15",
      "FastAPI",
      "PostgreSQL RLS",
      "Apache Kafka",
      "pgvector HNSW",
      "LangGraph",
      "Docker Sandbox",
      "Terraform",
      "Kubernetes GKE",
      "OpenTelemetry",
      "k6 Load Testing"
    ],
    storyScenario: "Modern technology enterprises need unified platforms that combine secure multi-tenant data access, intelligent autonomous agents, and real-time interactive user interfaces. Building disconnected prototypes fails to demonstrate enterprise readiness. CloudMatrix unifies every layer: a modern Next.js 15 interface, asynchronous FastAPI services, a Kafka event backbone, hybrid RAG with pgvector, LangGraph agent workflows, and automated Terraform infrastructure.",
    problemToSolve: "Unify frontend streaming, asynchronous distributed microservices, multi-tenant hybrid RAG, and autonomous agent orchestration into a cohesive, production-grade cloud platform.",
    systemArchitecture: "Public Gateway -> Next.js RSC Web App + Live SSE -> FastAPI Microservices -> Kafka Event Backbone -> Hybrid RAG + Agent Workers -> Multi-Region PostgreSQL + Cloud Storage -> GKE / Terraform Infrastructure -> OpenTelemetry Observability.",
    whyThisMatters2026: "This represents the complete synthesis of an AI-Native Software Engineer: you have designed, built, load-tested, and defended a full-stack, distributed, cloud-native platform from first principles.",
    whatToBuild: [
      "Full-Stack Architecture: Next.js 15 frontend, FastAPI microservice fleet, and Kafka message backbone.",
      "Multi-Tenant Data Layer: PostgreSQL with Row-Level Security (RLS) enforcing strict tenant boundaries.",
      "Autonomous Intelligence Loop: LangGraph multi-agent workflow integrated with pgvector hybrid search and sandboxes.",
      "Infrastructure as Code: modular Terraform provisioning GCP GKE clusters, Cloud SQL, and continuous delivery.",
      "Distributed Load Validation: k6 stress testing proving 25,000 requests/second with error rates < 0.01%.",
      "Production Runbooks & Defense: documented disaster recovery runbook, SLO alerts, and recorded architecture defense."
    ],
    automatedChecks: [
      "25,000 QPS load test: sustains traffic spike with p99 latency < 200ms and zero data loss.",
      "Security audit verification: zero critical vulnerabilities across Semgrep SAST, container scans, and OWASP testing.",
      "Automated disaster drill: automated cluster recovery from simulated database failure under 60 seconds."
    ],
    portfolioProof: {
      githubRepoTemplate: "cloudmatrix-enterprise-ai-platform",
      liveDemoType: "Distributed Cluster",
      resumeImpactBullet: "Architected and defended CloudMatrix, a multi-tenant AI platform supporting 25,000 QPS; orchestrated hybrid RAG, LangGraph agent workflows, and Kubernetes GitOps with zero CVEs."
    }
  }
];
