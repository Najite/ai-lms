from helper import format_lesson

def get_content():
    # Phase 4: 40 lessons
    p4_lessons = [
        # Virtual Memory & Process Internals (4.1 - 4.10)
        ("Process Address Space: Segments & Memory Layout", "Phase 0 (Lesson 0.9)", [
            "The 64-bit virtual memory address space: user space (lower addresses) vs kernel space (upper canonical addresses).",
            "Segment breakdown: Text (.text), Initialized Data (.data), Uninitialized Data (.bss), Heap, Memory Mapping, Stack.",
            "Address Space Layout Randomization (ASLR): randomizing base addresses to prevent buffer overflow exploits.",
            "Inspecting process memory maps via `/proc/<pid>/maps` and runtime segment boundaries."
        ], "Assuming fixed memory addresses across program executions, broken by ASLR security mitigations.",
        "Write a C/Python script to inspect and print the memory addresses of stack, heap, and text variables in real time.",
        "NanoHTTP: Memory-mapped static file buffers."),

        ("Multi-Level Page Tables & Page Directory Pointers", "Lesson 4.1", [
            "4-level paging in x86-64: Page Map Level 4 (PML4), Page Directory Pointer Table (PDPT), Page Directory (PD), Page Table (PT).",
            "Virtual Address Bit Breakdown: 9 bits per level ($4 \times 9 = 36$ bits) + 12-bit page offset ($2^{12} = 4096$ bytes).",
            "Page Table Entries (PTE): Present bit, Read/Write bit, User/Supervisor bit, Accessed/Dirty bits, No-Execute (NX) bit.",
            "5-level paging (PML5): extending virtual address space to 57 bits (128 petabytes) in modern enterprise datacenters."
        ], "Paging memory overhead: allocating millions of tiny sparse mappings causing excessive page table memory consumption.",
        "Calculate the physical memory required to store the page table for a process mapping 10GB of fragmented RAM.",
        "Systems foundation for OS memory understanding."),

        ("Translation Lookaside Buffer (TLB) & Hardware Walkers", "Lesson 4.2", [
            "TLB hardware cache: associative lookups converting virtual page numbers to physical frame numbers in $<1$ clock cycle.",
            "TLB Miss penalty: hardware page table walker traversing physical RAM across 4 memory references.",
            "TLB Shootdowns: multi-core cache coherency inter-processor interrupts (IPI) invalidating TLB entries across cores.",
            "HugePages (2MB, 1GB): reducing TLB misses by covering $512\times$ to $262,144\times$ more memory per TLB entry."
        ], "Severe multi-threaded latency spikes caused by frequent TLB shootdowns during active memory re-mapping.",
        "Configure Linux Transparent HugePages (THP) and benchmark memory access latency on a 10GB array.",
        "High-performance memory tuning for vector search in Phase 10."),

        ("Zero-Copy I/O & Memory-Mapped Files with `mmap`", "Lesson 4.1", [
            "Traditional file I/O overhead: disk $\to$ kernel page cache $\to$ user space buffer (`read`) $\to$ socket buffer (`write`).",
            "`mmap()` zero-copy architecture: mapping disk blocks directly into the process virtual address space.",
            "Memory protection flags: `PROT_READ`, `PROT_WRITE`, `PROT_EXEC`; sharing modes: `MAP_SHARED` vs `MAP_PRIVATE` (COW).",
            "Kernel zero-copy syscalls: `sendfile()` transferring bytes directly from page cache to socket descriptor."
        ], "Triggering `SIGBUS` crashes when reading from an `mmap` region after another process truncates the underlying file.",
        "Implement a static file server using `sendfile()` and `mmap()` that serves multi-gigabyte files with zero user-space copying.",
        "NanoHTTP: Static file serving engine."),

        ("The Linux Out-Of-Memory (OOM) Killer & Memory Cgroups", "Lesson 4.1", [
            "Memory overcommit (`vm.overcommit_memory`): why Linux permits allocating more virtual memory than physical RAM exists.",
            "The OOM Killer invocation: kernel heuristics evaluating `oom_score` and `oom_score_adj` (-1000 to +1000).",
            "Control Groups (cgroups v2) Memory limits: `memory.max`, `memory.high`, and container OOM termination (`OOMKilled: 137`).",
            "Swap space dynamics: page swapping mechanics, swappiness tuning (`vm.swappiness`), and swap thrashing."
        ], "Production container terminations with exit code 137 caused by exceeding cgroup `memory.max` limits without metrics visibility.",
        "Simulate an OOM condition inside a constrained cgroup and analyze the kernel dmesg OOM kill log.",
        "Docker container memory limit configuration in Phase 4 and Phase 7."),

        ("Process Forking, Copy-On-Write (COW), & `execve`", "Phase 0 (Lesson 0.21)", [
            "The `fork()` system call: duplicating process address space, file descriptors, and signal masks.",
            "Copy-On-Write (COW) mechanics: sharing identical physical pages marked read-only until a process writes to a page.",
            "The `execve()` system call: clearing virtual address space, loading new ELF binary, initializing new stack and heap.",
            "The `posix_spawn()` optimized interface: avoiding memory table duplication overhead on modern Linux."
        ], "Redis background save (`BGSAVE`) memory spikes: COW dirty page copies exhausting RAM when writes are heavy during saves.",
        "Measure physical RAM usage before and after `fork()` with varying write workloads to demonstrate COW in action.",
        "NanoHTTP and systems tooling."),

        ("Inter-Process Communication: Pipes & Named FIFOs", "Phase 0 (Lesson 0.24)", [
            "Anonymous pipes (`pipe()`): unidirectional kernel ring buffer (64KB default capacity).",
            "Blocking behavior: `write()` blocks when pipe buffer is full; `read()` blocks when pipe buffer is empty.",
            "Broken pipe signal: `SIGPIPE` generated when writing to a pipe with zero active read file descriptors.",
            "Named pipes (`mkfifo()`): filesystem entries enabling IPC between unrelated processes without parent-child ancestry."
        ], "Crashing on unhandled `SIGPIPE` when downstream readers close connections abruptly while writer continues writing.",
        "Implement a bidirectional IPC communication channel between two processes using a pair of named FIFOs.",
        "SysTrace and systems IPC."),

        ("Unix Domain Sockets & Passing File Descriptors", "Lesson 4.7", [
            "Unix Domain Sockets (`AF_UNIX`): bidirectional local IPC bypassing network stack, checksums, and TCP headers.",
            "Stream (`SOCK_STREAM`) vs Datagram (`SOCK_DGRAM`) Unix sockets; filesystem socket nodes.",
            "Passing Open File Descriptors: utilizing `sendmsg()` and `recvmsg()` with `SCM_RIGHTS` ancillary control messages.",
            "Why UDS outperforms loopback TCP (`127.0.0.1`): 2x throughput, lower latency, filesystem permission security."
        ], "Dangling socket files on filesystem after unclean process termination preventing service restarts.",
        "Build a parent process that opens a TCP socket and passes the active file descriptor to a child worker via UDS.",
        "PgBouncer local connections in Phase 5."),

        ("POSIX Signals: Asynchronous Interruption & Re-entrancy", "Phase 0 (Lesson 0.25)", [
            "Signal delivery mechanics: kernel interrupting user-space instruction stream and executing registered signal handler.",
            "Signal masks: blocking and unblocking signals via `sigprocmask()` during critical sections.",
            "Signal Re-entrancy: why calling non-reentrant functions (`printf`, `malloc`, `free`) inside signal handlers causes deadlocks.",
            "Async-signal-safe functions list: POSIX standard guarantees; setting `sig_atomic_t` or `volatile` flags."
        ], "Deadlocks in production signal handlers caused by attempting to acquire a mutex or allocate memory inside the handler.",
        "Write a signal handler that safely coordinates graceful shutdown using `sig_atomic_t` flags and self-pipe trick.",
        "NanoHTTP: Graceful shutdown signal engine."),

        ("Zombie Processes, Orphan Reaping, & `waitpid`", "Lesson 4.6", [
            "Process termination lifecycle: child process exits, becomes Zombie (`Z` state), retains exit status in PCB.",
            "Reaping zombies: parent calling `wait()` or `waitpid()` to read child exit status and release kernel PCB memory.",
            "Orphan processes: parent terminating before child; child adopted by init process (PID 1 / systemd).",
            "Subreaper processes: using `prctl(PR_SET_CHILD_SUBREAPER)` in process managers to reap orphaned descendant trees."
        ], "Zombie accumulation exhausting kernel PID limits in container environments where PID 1 fails to reap children.",
        "Write a process supervisor that spawns worker processes, handles `SIGCHLD`, and reaps terminated workers immediately.",
        "Container process management in Phase 4 and Phase 7."),

        # Concurrency, Threading, & Synchronization (4.11 - 4.18)
        ("Kernel Threads vs User-Space Green Threads", "Phase 1 (Lesson 1.31)", [
            "1:1 Threading Model: each application thread maps directly to a Linux kernel thread (NPTL - Native POSIX Thread Library).",
            "M:N Threading Model: $M$ user-space green threads multiplexed over $N$ OS threads (Go goroutines, Erlang actors).",
            "Context-switch cost: saving CPU registers, flushing pipeline, kernel transition overhead (~1–2 microseconds).",
            "Thread stack allocation: 8MB default stack vs customizable thread stack sizes (`pthread_attr_setstacksize`)."
        ], "Spawning 10,000 OS threads simultaneously, exhausting virtual memory and collapsing system under context switching.",
        "Measure and compare the memory usage and creation latency of 1,000 native OS threads vs 1,000 coroutines.",
        "NanoHTTP: Version 1 (Multi-Threaded Server)."),

        ("Race Conditions, Critical Sections, & Mutual Exclusion", "Lesson 4.11", [
            "Race conditions defined: output non-deterministically dependent on relative execution timing of concurrent threads.",
            "Critical Section: code block accessing shared mutable state that must execute atomically.",
            "Mutual Exclusion (Mutex): binary lock ensuring at most one thread executes inside the critical section.",
            "Mutex performance: futex (Fast Userspace Mutex) in Linux — avoiding syscalls on uncontended lock acquisitions."
        ], "Data corruption in concurrent bank account balances caused by unprotected read-modify-write operations.",
        "Demonstrate a multi-threaded integer counter race condition in Python/C, verify failure, and fix it using a Mutex.",
        "NanoHTTP: Shared connection metrics."),

        ("Deadlocks, Coffman Conditions, & Lock Ordering", "Lesson 4.12", [
            "Deadlock definition: two or more threads permanently blocked, each waiting for a lock held by the other.",
            "The Four Coffman Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
            "Deadlock prevention via strict Lock Ordering: establishing a global lock hierarchy (always acquire Lock A before Lock B).",
            "Deadlock detection: resource allocation graphs and cycle detection; lock acquisition timeouts (`try_lock`)."
        ], "Intermittent production deadlocks occurring when two background jobs acquire database table locks in reverse order.",
        "Write a multi-threaded program that reliably deadlocks, trace it with `gdb`, and resolve it using strict lock hierarchies.",
        "Database transaction concurrency in Phase 5."),

        ("Condition Variables & Thread Signaling", "Lesson 4.12", [
            "The need for Condition Variables: waiting for a state condition to become true without busy-waiting (spinning).",
            "Condition Variable primitives: `wait(mutex)` (atomically releases mutex and sleeps), `signal()` / `notify()`, `broadcast()`.",
            "Spurious Wakeups: why condition variables must ALWAYS be checked inside a `while (!condition)` loop.",
            "Lost Wakeups: signaling a condition variable before a waiting thread has entered the wait state."
        ], "Using an `if` statement instead of `while` with condition variables, causing data corruption on spurious wakeups.",
        "Implement a thread-safe Bounded Blocking Queue using a mutex and two condition variables (`not_full`, `not_empty`).",
        "NanoHTTP: Thread pool task queue."),

        ("Read-Write Locks & Reader-Writer Priority Dilemmas", "Lesson 4.12", [
            "Shared-Exclusive Locking (Read-Write Lock / `rwlock`): multiple concurrent readers OR single exclusive writer.",
            "Reader-Preference locks: allows continuous readers; risks Writer Starvation under heavy read traffic.",
            "Writer-Preference locks: incoming readers wait once a writer requests the lock; prevents writer starvation.",
            "Fair Read-Write locks: FIFO ordering of readers and writers."
        ], "Writer starvation in read-heavy caches where writers are permanently blocked from updating expired cache keys.",
        "Implement an in-memory thread-safe key-value cache using reader-writer locks and benchmark read throughput vs standard mutex.",
        "CacheKit: Multi-threaded cache design."),

        ("Spinlocks, Atomic Operations, & Compare-And-Swap (CAS)", "Lesson 4.12", [
            "Spinlocks: busy-waiting in a tight loop checking a lock flag; optimal when lock hold time is less than context-switch cost.",
            "Atomic CPU Instructions: `LOCK CMPXCHG` (Compare-And-Swap), `LOCK XADD` (Fetch-And-Add).",
            "Lock-Free Programming concepts: building concurrent data structures without mutexes using CAS loops.",
            "The ABA Problem in lock-free structures: memory reuse masking intermediate state modifications."
        ], "Using spinlocks on single-core systems or holding spinlocks while performing blocking I/O, freezing the CPU core.",
        "Implement a lock-free concurrent counter using atomic Compare-And-Swap operations.",
        "High-performance concurrency foundation."),

        ("The Producer-Consumer Pattern & Thread Pools", "Lesson 4.14", [
            "Architecture of the Producer-Consumer pattern: decoupling task generation from task processing via bounded buffer.",
            "Backpressure handling: blocking producers when the task buffer reaches high-water mark capacity.",
            "Thread Pool architecture: pre-allocated worker threads listening on a shared task queue.",
            "Graceful thread pool shutdown: poison pill / sentinel task patterns to terminate idle worker threads."
        ], "Unbounded task queues growing infinitely during traffic spikes until the process crashes via Out-Of-Memory.",
        "Build a complete multi-threaded Thread Pool from scratch in C or Python supporting task submission and graceful shutdown.",
        "NanoHTTP: Multi-threaded request worker pool."),

        ("Livelock, Priority Inversion, & Starvation", "Lesson 4.13", [
            "Livelock: threads actively changing state in response to each other without making forward progress (e.g., hallway passing problem).",
            "Starvation: thread repeatedly denied access to shared resources due to scheduling imbalances or greedy competitors.",
            "Priority Inversion: low-priority thread holding a lock required by high-priority thread; preempted by medium-priority thread.",
            "Priority Inheritance Protocol: temporarily boosting low-priority thread's priority to match waiting high-priority thread."
        ], "The Mars Pathfinder spacecraft reset incident: classic priority inversion between audio task and bus task.",
        "Construct a simulation demonstrating priority inversion and implement a priority inheritance wrapper to resolve it.",
        "Systems concurrency mastery."),

        # I/O Multiplexing, Sockets, & Linux epoll (4.19 - 4.24)
        ("Socket Abstractions & Non-Blocking File Descriptors", "Phase 0 (Lesson 0.20)", [
            "BSD Socket API: `socket()`, `bind()`, `listen()`, `accept()`, `connect()`, `send()`, `recv()`.",
            "Blocking Sockets: calls block thread execution until data arrives or OS buffer drains.",
            "Non-Blocking Sockets: setting `O_NONBLOCK` via `fcntl()`; returning `EWOULDBLOCK` or `EAGAIN` immediately.",
            "The C10K Problem: why thread-per-connection architectures collapse when scaling past 10,000 concurrent sockets."
        ], "Calling `recv()` in a tight while loop on non-blocking sockets without I/O multiplexing, pinning CPU at 100%.",
        "Create a non-blocking TCP socket server and handle `EWOULDBLOCK` exceptions cleanly.",
        "NanoHTTP: Socket configuration."),

        ("Evolution of Multiplexing: `select()` and `poll()`", "Lesson 4.19", [
            "I/O Multiplexing concept: asking the OS kernel to monitor multiple file descriptors and notify when any are ready.",
            "`select()` mechanics: bitmap arrays of file descriptors (`fd_set`); 1024 FD limit (`FD_SETSIZE`); $O(n)$ scanning.",
            "`poll()` mechanics: array of `pollfd` structs; removing 1024 limit; still suffers from $O(n)$ kernel-user scanning.",
            "Why `select` and `poll` scale poorly: copying file descriptor arrays back and forth between user and kernel space on every call."
        ], "Attempting to monitor 10,000 connections with `select()`, triggering buffer overflow or severe $O(n)$ latency penalties.",
        "Write a server using `select()` that multiplexes 50 client connections and measure performance degradation as connection count increases.",
        "Systems evolution understanding."),

        ("Linux `epoll` Architecture: Red-Black Trees & Ready Lists", "Lesson 4.20", [
            "Why `epoll` is $O(1)$: kernel-maintained data structures persisting across system calls.",
            "The Interest List: Red-Black tree storing monitored file descriptors; efficient insertion, deletion, modification in $O(\log n)$.",
            "The Ready List: doubly linked list of file descriptors with ready I/O events; populated asynchronously by kernel driver callbacks.",
            "`epoll` system calls: `epoll_create1(EPOLL_CLOEXEC)`, `epoll_ctl()` (EPOLL_CTL_ADD, MOD, DEL), `epoll_wait()`."
        ], "Failing to remove closed file descriptors from epoll sets, leading to spurious wakeups or memory leaks in older kernels.",
        "Write a raw C or Python script invoking `epoll_create1`, registering sockets, and handling events via `epoll_wait`.",
        "NanoHTTP: Version 2 (Async/Event-driven server)."),

        ("Level-Triggered (LT) vs Edge-Triggered (ET) epoll", "Lesson 4.21", [
            "Level-Triggered (LT) mode: `epoll_wait()` returns as long as buffer has unread data (safe, forgiving default).",
            "Edge-Triggered (ET) mode (`EPOLLET`): `epoll_wait()` notifies ONLY on state change (data arrival transition).",
            "The Edge-Triggered contract: must read socket in a loop until it returns `EAGAIN` / `EWOULDBLOCK`.",
            "Starvation in ET: long-running loops reading a single chatty socket while other sockets wait in ready list."
        ], "Using Edge-Triggered epoll but reading only once, causing the connection to hang indefinitely waiting for the next packet.",
        "Implement an Edge-Triggered epoll event loop that correctly reads until `EAGAIN` and handles concurrent connections.",
        "NanoHTTP: High-concurrency socket engine."),

        ("Event Loop Architectures: Reactor vs Proactor Patterns", "Lesson 4.21", [
            "The Reactor Pattern: synchronous event demultiplexer notifying application event handlers when resources are ready (Node.js, Redis, Nginx, Python asyncio).",
            "The Proactor Pattern: asynchronous I/O completion framework; OS initiates I/O and notifies handlers upon completion (Windows IOCP, Linux io_uring).",
            "Linux `io_uring`: modern submission and completion ring buffers sharing memory between kernel and user space; zero syscalls.",
            "Thread-safe event loops: wake-up pipes / eventfd primitives for signaling event loops from other threads."
        ], "Blocking the single-threaded Reactor event loop with synchronous CPU work, freezing all concurrent network connections.",
        "Design and implement a single-threaded Reactor event loop from scratch handling timer events and network events.",
        "Foundation for Phase 1 Python asyncio and Node.js in Phase 6."),

        ("Socket Options & Tuning: `SO_REUSEADDR`, `SO_REUSEPORT`, `TCP_NODELAY`", "Phase 0 (Lesson 0.20), Lesson 4.19", [
            "`SO_REUSEADDR`: allowing immediate binding to a local address in `TIME_WAIT` state upon server restarts.",
            "`SO_REUSEPORT`: allowing multiple independent server sockets to bind to the exact same port; kernel-level load balancing across processes.",
            "`TCP_NODELAY`: disabling Nagle's algorithm to eliminate artificial packet batching latency in real-time RPC protocols.",
            "Socket buffer sizing: `SO_RCVBUF` and `SO_SNDBUF`; TCP auto-tuning and bandwidth-delay product."
        ], "`OSError: [Errno 98] Address already in use` upon server restarts caused by omitting `SO_REUSEADDR`.",
        "Demonstrate server restart failure without `SO_REUSEADDR`, fix it, and benchmark latency reduction of `TCP_NODELAY`.",
        "NanoHTTP: Mandatory socket configuration."),

        # Network Protocols: TCP/IP, DNS, TLS 1.3, HTTP (4.25 - 4.30)
        ("The TCP Three-Way Handshake & Connection State Machine", "Phase 0 (Lesson 0.6)", [
            "TCP Three-Way Handshake: SYN (Seq=x) $\to$ SYN-ACK (Seq=y, Ack=x+1) $\to$ ACK (Seq=x+1, Ack=y+1).",
            "TCP State Machine: LISTEN, SYN_SENT, SYN_RECEIVED, ESTABLISHED, FIN_WAIT_1, FIN_WAIT_2, CLOSE_WAIT, CLOSING, LAST_ACK, TIME_WAIT, CLOSED.",
            "SYN Flood attacks: half-open connections exhausting backlog queues; defense via SYN Cookies (`tcp_syncookies`).",
            "Connection teardown: four-way FIN handshake and `TIME_WAIT` duration (2MSL - Maximum Segment Lifetime, typically 60s)."
        ], "SYN backlog exhaustion crashing production servers during sudden traffic spikes.",
        "Capture a complete TCP three-way handshake using `tcpdump` and inspect sequence numbers in Wireshark.",
        "NanoHTTP: Connection lifecycle."),

        ("TCP Reliability, Flow Control, & Congestion Control", "Lesson 4.25", [
            "Sequence numbers and cumulative ACKs: detecting packet loss, duplicates, and out-of-order delivery.",
            "Sliding Window Flow Control: receiver's Advertised Window (`rwnd`) preventing sender from overwhelming receiver's buffer.",
            "Zero Window Probing: sender probing receiver when window drops to 0.",
            "Congestion Control: Congestion Window (`cwnd`), Slow Start, Congestion Avoidance, Fast Retransmit (3 duplicate ACKs), Fast Recovery; TCP CUBIC and BBR."
        ], "Packet buffer bloat causing severe latency spikes on lossy network connections.",
        "Simulate packet loss using Linux `tc` (traffic control) and observe TCP window contraction and retransmission behavior.",
        "Systems network optimization."),

        ("DNS Resolution, Record Types, & Caching Hierarchies", "Lesson 4.25", [
            "DNS hierarchy: Root servers (13 named authorities), Top-Level Domain (TLD) servers, Authoritative nameservers.",
            "Recursive Resolvers vs Iterative Resolvers; caching and Time-To-Live (TTL) expiration.",
            "Record types: `A` (IPv4), `AAAA` (IPv6), `CNAME` (canonical alias), `MX` (mail), `TXT` (SPF/verification), `SRV` (service discovery).",
            "Debugging DNS with `dig`: `dig +trace`, `dig +short`, inspecting EDNS client subnet headers."
        ], "DNS TTL misconfigurations causing multi-day customer outages after cloud IP address migrations.",
        "Perform a full recursive trace of a domain from root servers to authoritative nameservers using `dig +trace`.",
        "InfraBlueprint: Cloud DNS configuration in Phase 7."),

        ("TLS 1.3 Handshake, Perfect Forward Secrecy, & PKI", "Lesson 4.25", [
            "Transport Layer Security (TLS 1.3) vs legacy TLS 1.2: removing insecure ciphers, mandating 1-RTT handshake.",
            "Key Exchange via Ephemeral Diffie-Hellman (ECDHE): deriving session keys over insecure channels without transmitting secrets.",
            "Perfect Forward Secrecy (PFS): compromising server private key does NOT compromise previously recorded session traffic.",
            "Public Key Infrastructure (PKI): X.509 certificate format, Certificate Authorities, intermediate chains, OCSP stapling."
        ], "Serving broken certificate chains lacking intermediate CA certificates, causing untrusted certificate warnings on mobile clients.",
        "Inspect a TLS 1.3 handshake using `openssl s_client -connect host:443 -tls1_3` and verify cipher suite and certificate chain.",
        "InfraBlueprint: SSL termination."),

        ("HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC) Framing", "Lesson 4.25", [
            "HTTP/1.1 limitations: plaintext framing, Head-of-Line (HoL) blocking on TCP connection, persistent connection reuse.",
            "HTTP/2 binary framing: Streams, Frames (HEADERS, DATA, SETTINGS), stream multiplexing over a single TCP connection, HPACK compression.",
            "HTTP/2 Head-of-Line blocking at TCP level: a single dropped packet stalls all multiplexed streams.",
            "HTTP/3 & QUIC: running over UDP; independent streams eliminating TCP HoL blocking; 0-RTT connection resumption; connection migration across IP changes."
        ], "Creating dozens of parallel TCP connections for HTTP/1.1 domain sharding when HTTP/2 multiplexing makes it an anti-pattern.",
        "Capture and decode HTTP/2 binary frames using Wireshark, identifying stream IDs and HPACK header compression.",
        "NanoHTTP and API gateway architectures."),

        ("Network & Socket Benchmarking with `wrk`", "Lesson 4.25", [
            "Benchmarking methodology: open vs closed workload models; Coordinated Omission problem and latency percentile skew.",
            "The `wrk` benchmarking engine: multi-threaded, epoll-driven load generation; executing Lua scripts for dynamic payloads.",
            "Interpreting metrics: Throughput (RPS), Latency percentiles (p50, p90, p99, p99.9), Error counts.",
            "OS kernel tuning for high load: `sysctl` parameters (`net.core.somaxconn`, `net.ipv4.tcp_max_syn_backlog`, ephemeral port ranges)."
        ], "Reporting average latency instead of p99/p99.9 tail latencies, hiding severe multi-second stutter affecting 1% of users.",
        "Execute a load test with `wrk -t4 -c100 -d30s` against an HTTP server, measure p99 latency, and identify kernel bottlenecks.",
        "NanoHTTP: Performance benchmarking."),

        # Benchmarking & Profiling (4.31 - 4.34)
        ("Operating System Metrics: CPU, Load Average, & Runqueues", "Phase 0 (Lesson 0.5)", [
            "CPU metrics: User time (%usr), System time (%sys), I/O wait (%iowait), Idle time (%idle), Steal time (%steal).",
            "Understanding Linux Load Average: 1, 5, 15-minute metrics; count of processes in TASK_RUNNING and TASK_UNINTERRUPTIBLE states.",
            "CPU Runqueues: measuring thread scheduling queues via `vmstat` and identifying CPU saturation.",
            "Distinguishing CPU saturation from I/O bottleneck using `vmstat` and `iostat`."
        ], "Misinterpreting high `%iowait` as a CPU processing bottleneck when the disk storage array is saturated.",
        "Run a CPU stress script, observe load average and runqueue depth using `vmstat 1`, and analyze metric changes.",
        "SysTrace: System health dashboard."),

        ("Disk I/O Profiling: IOPS, Latency, & `iostat`", "Lesson 4.31", [
            "Disk performance primitives: Throughput (MB/s) vs Input/Output Operations Per Second (IOPS).",
            "Rotational latency and seek time (HDD) vs NAND flash memory cell wear and page read/write (SSD/NVMe).",
            "Using `iostat -xz 1`: r/s (read IOPS), w/s (write IOPS), r_await / w_await (I/O latency in ms), %util (device saturation).",
            "Write Amplification in SSDs and file system page cache flushing (`sync`, `fsync`)."
        ], "Saturating disk IOPS with unbuffered random small writes, causing global application latency spikes.",
        "Generate random disk write workloads using `dd` and profile IOPS, wait times, and utilization using `iostat`.",
        "Database performance tuning in Phase 5."),

        ("Network Profiling: Sockets, Drops, & `ss` / `netstat`", "Lesson 4.25", [
            "Socket statistics with `ss`: inspecting TCP socket states (`ss -tulpn`), send/receive buffer queues.",
            "Detecting dropped packets: parsing `/proc/net/snmp` and `netstat -s` (ListenOverflows, ListenDrops).",
            "Socket buffer queue filling: identifying slow application processing when Recv-Q remains non-zero.",
            "Bandwidth monitoring with `iftop` and `nload`; packet loss detection with `mtr`."
        ], "Ignoring `ListenOverflows` in `ss -s`, missing silent kernel TCP connection drops during traffic bursts.",
        "Simulate socket backlog saturation on an HTTP server and observe `ListenDrops` counters incrementing in real time.",
        "SysTrace and InfraBlueprint."),

        ("Dynamic Tracing with `strace` & Kernel Call Profiling", "Phase 0 (Lesson 0.17)", [
            "Attaching `strace` to running processes (`strace -p <PID> -f`): following child forks and threads.",
            "Syscall timing analysis: `strace -T` measuring elapsed time spent inside individual kernel system calls.",
            "Syscall aggregation: `strace -c` producing summary tables of calls, errors, and percentage time spent.",
            "The performance overhead of ptrace: why `strace` slows target processes by 10x and must be used with caution in production."
        ], "Running `strace` on high-traffic production databases, causing severe performance degradation due to ptrace breakpoint traps.",
        "Diagnose an unfamiliar hanging process using `strace -p <PID>` and identify the blocking system call.",
        "SysTrace: Core debugging foundation."),

        # Linux Container Primitives & Security (4.35 - 4.40)
        ("Linux Namespaces: Process, Mount, & UTS Isolation", "Phase 0 (Lesson 0.2)", [
            "Demystifying containers: containers are standard Linux processes isolated via kernel namespaces and cgroups.",
            "PID Namespace: virtualizing process IDs; process becoming PID 1 inside container while having standard PID on host.",
            "Mount Namespace (`mnt`): isolated filesystem hierarchy view; `pivot_root` and `chroot` mechanics.",
            "UTS Namespace: isolating hostnames and domain names without affecting host system."
        ], "Running applications in containers with broken PID 1 setups, leading to un-reaped zombie processes and signal handling failures.",
        "Create an isolated process manually using `unshare --pid --mount --uts --fork /bin/bash` and observe PID 1 mapping.",
        "Core container architecture."),

        ("Linux Namespaces: Network & IPC Isolation", "Lesson 4.35", [
            "Network Namespace (`net`): isolated virtual network interfaces, routing tables, iptables rules, port spaces.",
            "Virtual Ethernet pairs (`veth`): connecting container network namespace to host bridge (`docker0`).",
            "IPC Namespace: isolating POSIX message queues and shared memory segments.",
            "User Namespace (`user`): mapping unprivileged user IDs (UID 1000) inside container to root (UID 0) inside namespace."
        ], "Port conflicts and security exposure from running containers in host network mode (`--net=host`) unintentionally.",
        "Create two isolated network namespaces and connect them using a virtual ethernet (`veth`) pair and ping between them.",
        "Kubernetes Pod networking foundation in Phase 7."),

        ("Control Groups (cgroups v2): CPU, Memory, & I/O Limits", "Lesson 4.5, 4.35", [
            "cgroups v2 unified hierarchy: filesystem interface mounted at `/sys/fs/cgroup/`.",
            "Memory constraints: configuring `memory.max` (hard limit $\to$ OOM kill) and `memory.high` (soft throttle).",
            "CPU Bandwidth enforcement: Completely Fair Scheduler (CFS) bandwidth quota (`cpu.max = $QUOTA $PERIOD`).",
            "I/O throttling: `io.max` constraining read/write bytes per second and IOPS on storage devices."
        ], "Setting CFS CPU quotas too low, causing severe micro-throttling on multi-threaded runtimes even when host CPU is idle.",
        "Create a cgroup manually, assign a memory limit of 100MB, launch a Python memory allocator, and observe cgroup OOM termination.",
        "Kubernetes resource management in Phase 7."),

        ("Union Filesystems: OverlayFS Architecture & Image Layers", "Lesson 4.35", [
            "Union filesystem concept: layering multiple directories into a single unified merged filesystem view.",
            "OverlayFS architecture: Lower directory (read-only base image layers), Upper directory (writable container layer).",
            "Merged view: presentation layer; Copy-on-Write (COW) when modifying files from lower layers.",
            "Whiteout files: deleting lower-layer files represented as character devices in the upper layer."
        ], "Modifying large files in container writable layers, triggering expensive multi-gigabyte COW file copies from lower layers.",
        "Mount an OverlayFS filesystem manually using `mount -t overlay` with upper, lower, and work directories and observe COW changes.",
        "Docker image build mechanics."),

        ("Container Security Hardening & Vulnerability Scanning with Trivy", "Lesson 4.37, 4.38", [
            "Container threat models: container breakouts, host kernel exploits, privilege escalation, secret leakage.",
            "Dropping Linux Capabilities: `cap_drop = [\"ALL\"]`, adding back only required capabilities (`NET_BIND_SERVICE`).",
            "Non-root execution: why running containers as `root` (UID 0) is a critical security vulnerability; creating unprivileged users (`USER 10001`).",
            "Vulnerability scanning with Trivy: scanning OS package layers and application language dependencies for CVEs."
        ], "Running production containers with default root permissions and `CAP_SYS_ADMIN`, allowing container escape vulnerabilities.",
        "Scan a Docker image with Trivy, identify a Critical CVE in an OS package, patch the base image, and achieve clean scan results.",
        "Container security in NanoHTTP and Phase 5."),

        ("Multi-Stage Dockerfile Engineering & Cache Invalidation", "Lesson 4.38, 4.39", [
            "Multi-stage build architecture: separating build-time dependencies (compilers, headers) from runtime images.",
            "Distroless and minimal base images: reducing attack surface and reducing image size from 1.2GB to 60MB.",
            "Cache layer ordering: ordering Dockerfile instructions by change frequency (source code last, dependencies first).",
            "Container health checks: configuring `HEALTHCHECK` instructions; exit codes (`0` healthy, `1` unhealthy)."
        ], "Copying application source code before installing package dependencies, invalidating layer caches on every minor code edit.",
        "Construct a production multi-stage Dockerfile for a Python application running as non-root with an automated health check.",
        "NanoHTTP and production container packaging.")
    ]

    p4_rendered = []
    for idx, (title, prereqs, subtopics, fail, verif, proj) in enumerate(p4_lessons, 1):
        p4_rendered.append(format_lesson(4, idx, title, prereqs, subtopics, fail, verif, proj))

    # Phase 5: 50 lessons
    p5_lessons = [
        # RESTful Design & FastAPI (5.1 - 5.8)
        ("RESTful Architecture: Resource Modeling & Verbs", "Phase 4 (Lesson 4.29)", [
            "Resource-oriented URI design: resources as plural nouns (`/api/v1/projects/{id}/artifacts`).",
            "HTTP verb semantic contracts: `GET` (safe, idempotent), `POST` (non-idempotent), `PUT` (idempotent replace), `PATCH` (partial update), `DELETE`.",
            "Nesting resources vs flat resource paths: trade-offs in sub-resource modeling.",
            "Hypermedia and HATEOAS: dynamic discoverability of API action links."
        ], "Exposing RPC verbs in REST paths (e.g., `POST /api/v1/deleteUser`), violating HTTP caching and semantic specifications.",
        "Design a RESTful API specification for a multi-tenant project management platform adhering strictly to RFC specifications.",
        "AuthForge and TenantIQ API surfaces."),

        ("HTTP Status Codes Precision & RFC Semantics", "Lesson 5.1", [
            "2xx Success: 200 OK, 201 Created (with `Location` header), 204 No Content.",
            "4xx Client Errors: 400 Bad Request, 401 Unauthorized (unauthenticated), 403 Forbidden (authenticated, unauthorized), 404 Not Found, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests.",
            "5xx Server Errors: 500 Internal Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout.",
            "Error response standards: RFC 7807 Problem Details for HTTP APIs (`type`, `title`, `status`, `detail`, `instance`)."
        ], "Returning `200 OK` with `{\"error\": true}` in the JSON payload, breaking client error handling and upstream HTTP proxies.",
        "Implement custom error handlers in FastAPI returning standardized RFC 7807 problem detail payloads.",
        "AuthForge: API error handling."),

        ("Safe Retries & Idempotency Key Architecture", "Lesson 5.1", [
            "The network retry hazard: network timeout on `POST` requests causing duplicate credit card charges or order creation.",
            "Idempotency Key mechanism: client transmits UUID in `Idempotency-Key` header.",
            "Server-side idempotency state machine in Redis: Pending, Processing, Completed; storing response payload with TTL.",
            "Concurrency handling: locking idempotency keys to reject simultaneous duplicate requests with `409 Conflict`."
        ], "Double-charging customers during network blips due to non-idempotent order submission endpoints.",
        "Build an Idempotency Middleware in FastAPI using Redis that guarantees zero duplicate executions for repeated identical requests.",
        "AuthForge and TenantIQ: Stripe payment and mutation endpoints."),

        ("Pagination Architectures: Offset vs Keyset Cursors", "Lesson 5.1, Phase 3 (Lesson 3.26)", [
            "Offset-based pagination: `LIMIT 20 OFFSET 1000`; $O(n)$ database scan overhead; offset drift (missing or duplicate rows during insertions).",
            "Keyset / Cursor-based pagination: `WHERE (created_at, id) < (:cursor_time, :cursor_id) ORDER BY created_at DESC, id DESC LIMIT 20`.",
            "Cursor encoding: base64 encoding opaque composite cursor strings.",
            "Performance comparison: $O(1)$ indexed seek vs $O(n)$ full scan across deep pagination pages."
        ], "Database CPU saturation caused by web crawlers scraping deep pages on offset-paginated tables with 10M rows.",
        "Implement keyset cursor pagination on a high-throughput table, verify constant-time query latency across deep offsets.",
        "TenantIQ: Activity feed pagination."),

        ("API Versioning Methodologies & Deprecation Policies", "Lesson 5.1", [
            "URI Path versioning (`/v1/users`): clarity, simple caching, routing isolation.",
            "Header versioning: `Accept: application/vnd.app.v1+json`; clean URIs, client complexity.",
            "Query parameter versioning: `/users?version=1`.",
            "Managing backward compatibility: additive schema updates, Sunset headers (`Sunset: Wed, 11 Nov 2026 00:00:00 GMT`), graceful migration windows."
        ], "Breaking mobile client applications by removing or modifying fields on active API versions without backward compatibility.",
        "Design and implement a versioned API supporting both v1 and v2 simultaneously with automated deprecation warning headers.",
        "AuthForge and TenantIQ API versioning."),

        ("FastAPI Architecture, Uvicorn, & The ASGI Specification", "Phase 1 (Lesson 1.32), Phase 4 (Lesson 4.23)", [
            "Asynchronous Server Gateway Interface (ASGI): scope dictionary, receive callable, send callable.",
            "Uvicorn server: libuv/asyncio-backed ASGI HTTP server.",
            "Starlette core: routing, middleware stack, request/response cycle.",
            "FastAPI enhancements: automatic OpenAPI documentation (`/docs`), Swagger UI, ReDoc, and validation integration."
        ], "Running CPU-intensive tasks inside FastAPI async route handlers, blocking the single event loop thread for all requests.",
        "Write a raw ASGI application callable from scratch without frameworks, and run it directly with Uvicorn.",
        "AuthForge: Core web service engine."),

        ("Pydantic v2 Internals & High-Speed Schema Validation", "Phase 1 (Lesson 1.4)", [
            "Pydantic v2 core: `pydantic-core` C/Rust validation engine delivering 5x–20x speedups over v1.",
            "Data validation with `BaseModel`: field types, constraints (`Field(gt=0, max_length=100)`), custom regex.",
            "Field validators (`@field_validator`) vs Model validators (`@model_validator(mode='before')`).",
            "Serialization: `model_dump()`, `model_dump_json()`, excluding unset fields (`exclude_unset=True`)."
        ], "Using Pydantic models for high-throughput batch transformations without understanding serialization overhead.",
        "Define strict nested Pydantic models validating complex API payloads with cross-field conditional validation.",
        "AuthForge: Request/Response validation schemas."),

        ("FastAPI Dependency Injection Hierarchy & Lifespan Hooks", "Phase 1 (Lesson 1.50), Lesson 5.6", [
            "FastAPI Dependency Injection: `fastapi.Depends`, sub-dependencies, hierarchical dependency resolution.",
            "Yield dependencies: resource provisioning and cleanup (database sessions, transaction scopes).",
            "Authentication dependencies: extracting Bearer tokens, decoding claims, injecting `CurrentUser` models.",
            "Application Lifespan: `lifespan(app)` context manager for managing global connection pools on startup/shutdown."
        ], "Opening database connections inside individual route dependencies without pooling or cleanup yields, leaking connections.",
        "Build a multi-level dependency tree that validates API keys, checks database tenancy, and injects a scoped DB session.",
        "AuthForge: Route security dependencies."),

        # Relational Databases, Modeling, & SQL Deep Dive (5.9 - 5.16)
        ("Relational Algebra & Normalization: 1NF, 2NF, 3NF, BCNF", "Phase 2 (Lesson 2.5)", [
            "Relational Algebra primitives: Selection ($\sigma$), Projection ($\pi$), Cartesian Product ($\times$), Join ($\bowtie$).",
            "First Normal Form (1NF): atomic values, unique column names, primary key defined.",
            "Second Normal Form (2NF): 1NF + no partial dependencies (non-key attributes dependent on full composite key).",
            "Third Normal Form (3NF): 2NF + no transitive dependencies (non-key attributes dependent only on primary key).",
            "Boyce-Codd Normal Form (BCNF): every determinant is a candidate key; anomalies eliminated."
        ], "Storing comma-separated lists in database columns (violating 1NF), making indexing and joins impossible.",
        "Take an un-normalized, redundant spreadsheet schema and normalize it through 1NF, 2NF, and 3NF into relational tables.",
        "SchemaVault: Normalized relational models."),

        ("Pragmatic Denormalization & Write Amplification", "Lesson 5.9", [
            "When to violate 3NF: read-heavy workloads where joins across 8 tables cause severe latency.",
            "Denormalization strategies: pre-computed counters, caching parent status in child records, summary tables.",
            "Maintaining consistency in denormalized data: database triggers vs application-level transactions.",
            "Write Amplification: calculating the extra disk writes incurred across multiple denormalized copies during updates."
        ], "Denormalizing data without transactional synchronization, causing permanent data divergence between tables.",
        "Benchmark query performance between a fully normalized 3NF schema and a pragmatic denormalized schema under read/write load.",
        "TenantIQ: Precomputed DORA metric summaries."),

        ("SQL Execution Order & Core Dialect Mechanics", "Phase 2 (Lesson 2.1)", [
            "SQL physical processing order: `FROM` $\to$ `JOIN` $\to$ `WHERE` $\to$ `GROUP BY` $\to$ `HAVING` $\to$ `SELECT` $\to$ `DISTINCT` $\to$ `ORDER BY` $\to$ `LIMIT`.",
            "Why column aliases defined in `SELECT` cannot be referenced in `WHERE` clauses.",
            "NULL semantics: Three-Valued Logic (True, False, Unknown); `IS NULL` vs `= NULL` (which always evaluates to Unknown).",
            "Filtering grouped data: `WHERE` (filters rows before aggregation) vs `HAVING` (filters groups after aggregation)."
        ], "Writing `WHERE col = NULL` instead of `IS NULL`, causing queries to silently return zero rows.",
        "Demonstrate how three-valued logic produces counter-intuitive results in `NOT IN` subqueries containing nulls.",
        "SchemaVault: Raw SQL queries."),

        ("Joins Deep Dive: Inner, Outer, Cross, & Self Joins", "Lesson 5.11", [
            "Join mechanics: combining rows from two or more tables based on join predicates.",
            "`INNER JOIN`: intersection of matching rows.",
            "`LEFT OUTER JOIN` / `RIGHT OUTER JOIN`: preserving unmatched rows from left/right table with null-padding.",
            "`FULL OUTER JOIN`: union of matches and un-matches from both tables.",
            "`CROSS JOIN`: Cartesian product ($M \times N$ rows); generating test permutations.",
            "Self-Joins: joining a table to itself for hierarchical parent-child relationships."
        ], "Accidental Cartesian explosion: missing join predicates in multi-table queries producing millions of unwanted rows.",
        "Write a self-join query that identifies employees who earn more than their direct managers in a single query.",
        "DataSift and SchemaVault."),

        ("Subqueries: Correlated, Scalar, & Set Membership", "Lesson 5.12", [
            "Scalar Subqueries: subqueries returning a single row and single column for use in expressions.",
            "Subqueries in `FROM` clauses (Derived Tables): aliasing and materialization.",
            "`IN` vs `EXISTS`: why `EXISTS` short-circuits upon finding the first matching row.",
            "Correlated Subqueries: subqueries referencing columns from the outer query; row-by-row execution penalties."
        ], "Using correlated subqueries inside `SELECT` lists across 100,000 rows, forcing 100,000 separate subquery executions.",
        "Refactor an inefficient correlated subquery into a set-based `JOIN` with aggregation, measuring query speedup.",
        "SchemaVault: Database migration queries."),

        ("Data Manipulation Language (DML): Upserts & RETURNING", "Lesson 5.11", [
            "Atomic Upserts: `INSERT ... ON CONFLICT (id) DO UPDATE SET ...`.",
            "`ON CONFLICT DO NOTHING`: idempotent insertion patterns.",
            "The `RETURNING` clause: returning modified rows (`RETURNING id, created_at`) without issuing secondary queries.",
            "Multi-row batch inserts: parameterized batch syntax to maximize database throughput."
        ], "Performing check-then-insert operations in separate application statements, introducing race conditions under concurrency.",
        "Write an atomic batch upsert query in PostgreSQL using `ON CONFLICT` and `RETURNING`.",
        "AuthForge: User profile upserts."),

        ("Data Definition Language (DDL): Constraints & Alter Table", "Lesson 5.9", [
            "Integrity constraints: `PRIMARY KEY`, `FOREIGN KEY` (referential integrity), `UNIQUE`, `CHECK`, `NOT NULL`.",
            "Foreign key cascade options: `ON DELETE CASCADE`, `ON DELETE SET NULL`, `ON DELETE RESTRICT`.",
            "Zero-downtime schema changes: adding nullable columns vs columns with default values.",
            "PostgreSQL Table Locks during `ALTER TABLE`: avoiding exclusive `ACCESS EXCLUSIVE` table locks in production."
        ], "Adding a column with a dynamic default value on a 50M-row table, taking an exclusive lock and freezing web traffic for minutes.",
        "Execute a zero-downtime migration in PostgreSQL that safely adds a column with default values to an active table.",
        "SchemaVault: Core migration tool features."),

        ("PostgreSQL Power Features: JSONB, Arrays, & Trigrams", "Lesson 5.15", [
            "`JSONB` datatype: binary-format indexed JSON storage; containment operators (`@>`), key extraction (`->`, `->>`).",
            "Indexing JSONB: GIN (Generalized Inverted Index) for fast key/value queries on unstructured attributes.",
            "PostgreSQL native Arrays: `text[]`, `integer[]`, array containment (`&&`, `@>`).",
            "Fuzzy text search with `pg_trgm`: trigram matching and GIN/GiST similarity queries (`%` operator)."
        ], "Using `JSON` instead of `JSONB`, losing binary compression and forcing re-parsing on every query.",
        "Build a fuzzy product search query using `pg_trgm` that handles misspellings on an indexed million-row table.",
        "DocuMind and TenantIQ."),

        # SQL Window Functions, CTEs, & Advanced Queries (5.17 - 5.22)
        ("Window Functions Foundations: Partitions & Ordering", "Lesson 5.11", [
            "The Window Function concept: computing row-level analytics across subsets without collapsing rows via `GROUP BY`.",
            "The `OVER()` clause: `PARTITION BY` (segmenting data) and `ORDER BY` (establishing evaluation sequence).",
            "Aggregate window functions: `SUM() OVER(...)`, `AVG() OVER(...)`, `COUNT() OVER(...)`.",
            "Mixing row attributes with group aggregates in a single query pass."
        ], "Confusing `PARTITION BY` in window functions with `GROUP BY`, expecting rows to collapse.",
        "Write a query calculating each transaction's percentage contribution to its user's total monthly spend.",
        "TenantIQ: DORA metrics calculation."),

        ("Ranking Window Functions: `ROW_NUMBER`, `RANK`, `DENSE_RANK`", "Lesson 5.17", [
            "`ROW_NUMBER()`: sequential integer assigned to each row within partition, breaking ties deterministically.",
            "`RANK()`: assigns identical rank to tied values, skipping subsequent ranks (1, 2, 2, 4).",
            "`DENSE_RANK()`: assigns identical rank to tied values without skipping subsequent ranks (1, 2, 2, 3).",
            "`NTILE(n)`: dividing partitions into $n$ equal frequency buckets (percentiles, quartiles)."
        ], "Using `ROW_NUMBER` for leaderboards where ties exist, arbitrarily ranking tied users differently without deterministic secondary sorts.",
        "Write a query that extracts the top 3 highest spending customers per region using `DENSE_RANK()`.",
        "DataSift: Top-N analysis."),

        ("Value Window Functions: `LAG`, `LEAD`, & Offsets", "Lesson 5.17", [
            "`LAG(col, offset, default)`: accessing values from preceding rows within partition.",
            "`LEAD(col, offset, default)`: accessing values from subsequent rows within partition.",
            "`FIRST_VALUE()` and `LAST_VALUE()`: boundary value retrieval.",
            "Period-over-period calculations: computing day-over-day growth rates and time elapsed between user events."
        ], "Calling `LAST_VALUE()` with default window framing, returning current row value instead of true partition end.",
        "Calculate the time delta in minutes between consecutive user login events across a dataset using `LAG()`.",
        "TenantIQ: Lead Time for Changes calculation."),

        ("Window Framing: Physical Rows vs Logical Ranges", "Lesson 5.17", [
            "The Window Frame: specifying exact sliding row subsets within the ordered partition.",
            "`ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`: cumulative running totals.",
            "`ROWS BETWEEN 6 PRECEDING AND CURRENT ROW`: 7-day rolling moving averages.",
            "`RANGE` framing: evaluating offsets based on logical value differences rather than physical row counts."
        ], "Omitting explicit window framing on `ORDER BY` window queries, triggering default framing that degrades query speed.",
        "Implement a 30-day moving average and a cumulative sum of daily active users in a single SQL query.",
        "TenantIQ: DORA metrics rolling averages."),

        ("Common Table Expressions (CTEs): Clean Query Pipelines", "Lesson 5.11", [
            "The CTE syntax: `WITH cte_name AS (SELECT ...) SELECT ... FROM cte_name`.",
            "Query readability: breaking massive, unmaintainable subquery joins into step-by-step readable modules.",
            "PostgreSQL CTE Optimization: `AS MATERIALIZED` vs `AS NOT MATERIALIZED` (inlined query pushdown).",
            "Multiple CTE chaining: composing multi-stage transformation pipelines."
        ], "Accidental materialization fences in older PostgreSQL versions preventing index pushdown predicates into CTEs.",
        "Refactor an unreadable 4-level nested subquery into a clean 3-stage CTE pipeline.",
        "SchemaVault and TenantIQ."),

        ("Recursive CTEs: Hierarchies, Trees, & Graphs in SQL", "Lesson 5.21", [
            "Recursive CTE architecture: `WITH RECURSIVE`; Anchor member $\to$ `UNION ALL` $\to$ Recursive member.",
            "Termination conditions: recursion halting when recursive member returns zero rows.",
            "Tree traversal in SQL: calculating node depth, path strings, and subtree aggregations (org charts, categories).",
            "Cycle prevention: tracking visited node arrays (`ARRAY[id]`) to prevent infinite recursion on cyclic graphs."
        ], "Infinite recursion in recursive CTEs caused by cyclic graph data, crashing database backends via memory exhaustion.",
        "Write a recursive CTE that traverses a category hierarchy of arbitrary depth and outputs the full breadcrumb path for every node.",
        "TenantIQ: Team and organization permission hierarchy."),

        # Index Internals, B-Trees, & Query Execution Plans (5.23 - 5.28)
        ("PostgreSQL Physical Storage: Heap Files, Pages, & Tuples", "Phase 0 (Lesson 0.9)", [
            "Database Cluster architecture: Database $\to$ Tablespace $\to$ Relational File $\to$ 8KB Pages.",
            "Page anatomy: Page Header (24 bytes), Item Identifiers (Line Pointers), Free Space, Tuple Data.",
            "The Tuple ID (`ctid`): physical address identifier `(block_number, offset_number)`.",
            "Heap-Only Tuples (HOT): updating tuples within the same 8KB page without modifying index pointers."
        ], "Assuming database rows are stored contiguously on disk in primary key order (PostgreSQL uses un-ordered heap files).",
        "Inspect raw tuple headers and `ctid` pointers using the `pageinspect` PostgreSQL extension.",
        "Database internals mastery."),

        ("B-Tree Index Architecture & Search Depth", "Phase 3 (Lesson 3.15), Lesson 5.23", [
            "B-Tree index structure in PostgreSQL: Metapage, Root page, Internal branch pages, Leaf pages.",
            "High Fan-Out: each 8KB index page storing hundreds of keys; logarithmic search depth ($O(\log n)$, depth 3 for 10M rows).",
            "Leaf page structure: sorted keys and pointer arrays to heap `ctid` entries; bidirectional sibling pointers.",
            "Index Traversal: traversing from root to leaf to obtain `ctid`, then fetching physical page from heap."
        ], "Creating single-column indexes on every table column, multiplying write amplification without aiding composite queries.",
        "Calculate the exact B-Tree depth and page count for a table with 50 million 64-bit integer records.",
        "SchemaVault: Index design."),

        ("Composite Indexes & The Leftmost Prefix Rule", "Lesson 5.24", [
            "Composite Index structure: index on multiple columns `(tenant_id, status, created_at)`.",
            "The Leftmost Prefix Rule: an index on `(A, B, C)` accelerates queries on `A`, `(A, B)`, and `(A, B, C)`; useless for queries on `B` alone.",
            "Column ordering heuristics: placing equality columns first, followed by range/sort columns.",
            "Index Skip Scans: how modern engines emulate multi-column indexing across low-cardinality prefixes."
        ], "Ordering composite index columns as `(created_at, tenant_id)`, rendering the index useless for queries filtering on `tenant_id` alone.",
        "Design the optimal composite index for an API query filtering by tenant, filtering by date range, and sorting by ID.",
        "TenantIQ: Composite metric indexes."),

        ("Covering Indexes & Index-Only Scans", "Lesson 5.24", [
            "The Cost of Heap Lookups: fetching heap pages after scanning index leaf pages.",
            "Index-Only Scan: satisfying query columns entirely from the index without accessing the heap table.",
            "The `INCLUDE` clause: `CREATE INDEX ... ON orders (user_id) INCLUDE (amount, status)`.",
            "The Visibility Map (VM): why Index-Only scans must check the VM to confirm all tuples on the heap page are visible to all transactions."
        ], "Assuming an index scan will be an Index-Only scan when the Visibility Map is dirty due to lack of vacuuming.",
        "Create a covering index with `INCLUDE` and prove using `EXPLAIN` that the query executes an Index-Only Scan with zero heap fetches.",
        "AuthForge: High-speed token validation query."),

        ("Specialized Indexes: Partial, Expression, GIN, & BRIN", "Lesson 5.24", [
            "Partial Indexes: `CREATE INDEX ... WHERE status = 'pending'`; indexing 1% of active data, saving 99% RAM.",
            "Expression Indexes: `CREATE INDEX ... ON users (LOWER(email))`; accelerating function calls in `WHERE` clauses.",
            "Generalized Inverted Index (GIN): indexing composite items (JSONB keys, array elements, text tokens).",
            "Block Range Index (BRIN): storing min/max values per disk block range; tiny footprint for append-only time-series data."
        ], "Creating a standard B-Tree index on a timestamp column in an append-only 1TB time-series table instead of a BRIN index (saving 99% space).",
        "Compare index size and query speed of B-Tree vs BRIN on an append-only 10M row table.",
        "TenantIQ: Metric event indexing."),

        ("Query Execution Plan Analysis with `EXPLAIN (ANALYZE, BUFFERS)`", "Lesson 5.23–5.27", [
            "The PostgreSQL Query Optimizer: cost-based planner, sequential page cost (`seq_page_cost`), random page cost (`random_page_cost`).",
            "`EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)`: executing queries and measuring real execution time vs estimated costs.",
            "Interpreting scan nodes: `Seq Scan`, `Index Scan`, `Index Only Scan`, `Bitmap Index Scan` + `Bitmap Heap Scan`.",
            "Interpreting join nodes: `Nested Loop` (small datasets), `Hash Join` (unsorted large sets), `Merge Join` (pre-sorted sets).",
            "Buffer hit ratio analysis: counting `Buffers: shared hit` (RAM) vs `read` (disk)."
        ], "Misinterpreting query plan estimates (`cost=...`) as actual milliseconds without running `EXPLAIN ANALYZE`.",
        "Analyze a complex slow query plan, identify sequential scans and buffer reads, create targeted indexes, and achieve 50x speedup.",
        "AuthForge and TenantIQ: Database query optimization."),

        # Transaction Isolation, ACID, & Concurrency Anomalies (5.29 - 5.33)
        ("ACID Properties & Write-Ahead Logging (WAL) Mechanics", "Phase 0 (Lesson 0.18)", [
            "ACID breakdown: Atomicity, Consistency, Isolation, Durability.",
            "Write-Ahead Logging (WAL): recording transaction changes sequentially to disk before writing dirty pages to table heap.",
            "Checkpoints: flushing dirty shared buffers to disk and advancing WAL restart checkpoints.",
            "Crash recovery: redo log replaying committed transactions; undo log discarding uncommitted transactions."
        ], "Disabling `fsync` or setting `synchronous_commit = off` without understanding potential data loss on sudden power failure.",
        "Trace WAL generation and checkpoint frequency during a high-throughput write load in PostgreSQL.",
        "Database reliability engineering."),

        ("Concurrency Read Anomalies: Dirty, Non-Repeatable, & Phantom", "Lesson 5.29", [
            "Dirty Read: reading data written by an uncommitted, concurrent transaction that subsequently rolls back.",
            "Non-Repeatable Read (Fuzzy Read): re-reading a row within a transaction and finding data modified by another committed transaction.",
            "Phantom Read: re-executing a range query and finding newly inserted rows committed by another transaction.",
            "The ANSI SQL Isolation Level Matrix: mapping isolation levels to permitted anomalies."
        ], "Relying on default isolation levels and experiencing silent data corruption during concurrent inventory allocation.",
        "Reproduce a non-repeatable read anomaly between two concurrent database sessions using Python.",
        "AuthForge: Account consistency."),

        ("Serialization Anomaly & Write Skew in Practice", "Lesson 5.30", [
            "Serialization Anomaly: concurrent transactions execute without serial equivalent ordering, violating business invariants.",
            "Write Skew anomaly: transactions read overlapping data sets, make disjoint writes, and violate a global constraint (e.g., on-call doctor shift minimum).",
            "Why `REPEATABLE READ` fails to prevent Write Skew: snapshot isolation only checks for conflicts on the *same* row.",
            "Resolving Write Skew: explicit locking (`SELECT FOR UPDATE`) or upgrading to `SERIALIZABLE` isolation."
        ], "Double-booking hospital shifts or hotel rooms due to write skew under `REPEATABLE READ` isolation.",
        "Write a Python script with two concurrent threads that triggers a Write Skew anomaly on a shared balance constraint.",
        "AuthForge: Concurrency test suite."),

        ("The Four ANSI SQL Isolation Levels in PostgreSQL", "Lesson 5.30, 5.31", [
            "`READ UNCOMMITTED`: treated as `READ COMMITTED` in PostgreSQL (dirty reads are physically impossible under MVCC).",
            "`READ COMMITTED` (PostgreSQL default): each statement sees a new snapshot of committed data; non-repeatable reads possible.",
            "`REPEATABLE READ`: transaction sees a consistent snapshot taken at the beginning of the *transaction*; non-repeatable reads eliminated.",
            "`SERIALIZABLE`: Serializable Snapshot Isolation (SSI); tracks read-write dependencies (SIREAD locks); aborts conflicting transactions with `40001 serialization_failure`."
        ], "Failing to implement retry loops in application code when running under `SERIALIZABLE` isolation, causing unhandled 40001 errors.",
        "Implement a database transaction wrapper in Python that catches serialization failures and retries with exponential backoff.",
        "AuthForge: Financial transaction logic."),

        ("Explicit Locking: Row Locks, Table Locks, & `SKIP LOCKED`", "Phase 4 (Lesson 4.12), Lesson 5.32", [
            "Row-level locking: `SELECT ... FOR UPDATE` (exclusive lock) and `SELECT ... FOR SHARE` (shared lock).",
            "Non-blocking locking: `NOWAIT` (fails immediately if row is locked) vs `SKIP LOCKED` (skips locked rows).",
            "Building High-Performance Queues in PostgreSQL: `SELECT id FROM tasks WHERE status = 'pending' ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 1`.",
            "Table locks: `ACCESS SHARE`, `ROW SHARE`, `EXCLUSIVE`, `ACCESS EXCLUSIVE`; lock conflict matrices."
        ], "Deadlocks caused by workers locking task rows without `SKIP LOCKED`, stalling queue throughput.",
        "Build a multi-worker job queue on PostgreSQL using `FOR UPDATE SKIP LOCKED` and verify zero duplicate task processing.",
        "SchemaVault and Celery queues."),

        # MVCC & PostgreSQL Internals (5.34 - 5.37)
        ("Multi-Version Concurrency Control (MVCC) Architecture", "Lesson 5.23, 5.32", [
            "The core MVCC guarantee: readers never block writers, and writers never block readers.",
            "Tuple versioning: updates create a new tuple version; deletes mark tuple as expired.",
            "Transaction snapshots: tracking `xmin` (inserting TXID), `xmax` (deleting/updating TXID), and active transaction arrays.",
            "Snapshot visibility rules: determining whether a tuple version is visible to a running query."
        ], "Long-running analytic queries holding snapshots open, preventing vacuuming and causing massive table bloat.",
        "Inspect hidden `xmin` and `xmax` fields on active tables across concurrent transactions.",
        "PostgreSQL engine mastery."),

        ("Dead Tuples, Table Bloat, & The VACUUM Engine", "Lesson 5.34", [
            "Dead Tuples: expired tuple versions that are no longer visible to any active transaction.",
            "Measuring bloat: `pg_stat_user_tables.n_dead_tup` and dead-to-live tuple ratios.",
            "Standard `VACUUM`: marks dead tuple space as reusable in the Free Space Map (FSM); does NOT shrink table file on disk.",
            "`VACUUM FULL`: acquires exclusive table lock, rewrites table into a compact file; emergency bloat remediation."
        ], "Table files consuming 500GB disk space for 10GB of real data due to dead tuple bloat from un-vacuumed updates.",
        "Generate 100,000 updates, monitor dead tuple accumulation, execute `VACUUM`, and inspect the Free Space Map.",
        "SchemaVault: Database maintenance procedures."),

        ("Autovacuum Architecture, Freezing, & Wraparound Catastrophe", "Lesson 5.35", [
            "Autovacuum daemon: background workers continuously monitoring table modification thresholds.",
            "Tuning autovacuum: `autovacuum_vacuum_scale_factor`, `autovacuum_vacuum_cost_limit`.",
            "The 32-bit Transaction ID (TXID) Wraparound: why TXIDs wrap around after ~2 billion transactions.",
            "Tuple Freezing: setting the `frozen` bit on tuples to mark them as older than all past and future TXIDs; preventing data invisibility."
        ], "PostgreSQL entering emergency read-only shutdown mode because autovacuum was disabled and TXID wraparound threshold was reached.",
        "Inspect table ages with `pg_class.relfrozenxid` and calculate distance to wraparound threshold.",
        "InfraBlueprint: Production Cloud SQL operations."),

        ("PostgreSQL Row-Level Security (RLS) for Multi-Tenancy", "Lesson 5.15", [
            "Multi-tenancy models: Database-per-tenant vs Schema-per-tenant vs Shared-database with Tenant ID.",
            "Row-Level Security (RLS): database-level policy enforcement preventing cross-tenant data access.",
            "Enabling RLS: `ALTER TABLE documents ENABLE ROW LEVEL SECURITY;`.",
            "Policy creation: `CREATE POLICY tenant_isolation ON documents USING (tenant_id = current_setting('app.current_tenant')::uuid);`.",
            "Session configuration: `SET LOCAL app.current_tenant = :tenant_id;` inside transactions."
        ], "Relying on application-level `WHERE tenant_id = :id` filters, where a single forgotten filter exposes all customer data.",
        "Implement a complete multi-tenant database schema in PostgreSQL enforced by RLS, proving cross-tenant data leakage is impossible.",
        "TenantIQ: Core multi-tenant isolation architecture."),

        # Connection Pooling & PgBouncer (5.38 - 5.40)
        ("PostgreSQL Process-per-Connection Overhead & Resource Limits", "Phase 4 (Lesson 4.1), Lesson 5.34", [
            "Process-based connection model: each client connection forks a dedicated backend process consuming ~5–10MB RAM.",
            "Connection creation latency: TCP + TLS + process fork + authentication taking 30ms–50ms.",
            "Connection saturation: why 500 concurrent direct connections degrade CPU performance through context switching thrashing.",
            "The `max_connections` setting: sizing formula: `connections = ((core_count * 2) + effective_spindle_count)`."
        ], "Spawning 1,000 container instances each configured with a connection pool of 20, crushing PostgreSQL with 20,000 connections.",
        "Benchmark query throughput against direct PostgreSQL connections as connection count scales from 10 to 1,000.",
        "InfraBlueprint: Database capacity sizing."),

        ("PgBouncer Architecture & Pooling Modes", "Lesson 5.38", [
            "PgBouncer proxy: lightweight connection pooler managing thousands of client connections with minimal overhead.",
            "Session Pooling: server connection assigned to client until disconnect (minimal pooling advantage).",
            "Transaction Pooling (Production Standard): server connection returned to pool immediately upon transaction commit/rollback.",
            "Statement Pooling: connection returned after every statement (breaks multi-statement transactions; rarely used)."
        ], "Attempting to use session-level features (`SET timezone`, prepared statements, temporary tables) under Transaction Pooling.",
        "Deploy PgBouncer in Docker, configure Transaction Pooling, and demonstrate 5,000 client connections served by 20 PostgreSQL backends.",
        "InfraBlueprint: Database proxy deployment."),

        ("gRPC Health Checking Protocol & Kubernetes Integration", "Phase 4 (Lesson 4.29)", [
            "The gRPC Health Checking Protocol standard: `grpc.health.v1.Health` service definition.",
            "RPC methods: `Check(HealthCheckRequest)` (unary check) and `Watch(HealthCheckRequest)` (streaming status updates).",
            "Health status states: `UNKNOWN`, `SERVING`, `NOT_SERVING`, `SERVICE_UNKNOWN`.",
            "Container lifecycle probing: using the `grpc_health_probe` binary inside Kubernetes liveness and readiness probes."
        ], "Kubernetes killing healthy gRPC containers because naive HTTP health probes fail on gRPC HTTP/2 ports.",
        "Implement `grpc.health.v1.Health` in Python/gRPC, and verify health probing using `grpc_health_probe` CLI binary.",
        "AuthForge and InfraBlueprint: Kubernetes health checks."),

        # High-Performance RPC with gRPC, Protobufs (5.41 - 5.42)
        ("Protocol Buffers (Protobuf v3): Binary Encoding & Schema Evolution", "Phase 4 (Lesson 4.29)", [
            "Protobuf binary encoding: Varints, Wire Types, ZigZag encoding for signed integers.",
            "The `.proto` interface definition: syntax, packages, message fields, field numbers (tags).",
            "Schema evolution rules: never change a field number, never delete a field tag (use `reserved`), handling unknown fields.",
            "Code generation: using `protoc` compiler to generate Python and TypeScript interfaces."
        ], "Re-using previously deleted field numbers in `.proto` files, corrupting deserialization data in older service clients.",
        "Inspect the raw binary byte stream of a serialized Protobuf message and decode field tags and varints manually.",
        "AuthForge: gRPC service definitions."),

        ("gRPC Services, Streaming, & Deadline Propagation", "Lesson 5.41", [
            "gRPC service types: Unary RPC, Server Streaming, Client Streaming, Bidirectional Streaming.",
            "gRPC Interceptors: client and server middleware for auth, structured logging, and distributed tracing.",
            "Deadline Propagation: passing deadlines across distributed RPC chains (`grpc-timeout` header); failing fast on expired calls.",
            "gRPC Error Model: rich error details, status codes (`OK`, `UNAUTHENTICATED`, `DEADLINE_EXCEEDED`, `NOT_FOUND`)."
        ], "Omitting RPC call deadlines, allowing hung downstream microservices to tie up worker threads indefinitely.",
        "Implement a unary and server-streaming gRPC service with client interceptors enforcing 500ms call deadlines.",
        "AuthForge: Token validation service."),

        # Asynchronous Background Tasks & Queues with Celery/Redis (5.43 - 5.46)
        ("Distributed Task Queues: Producer-Broker-Worker Architecture", "Phase 4 (Lesson 4.17)", [
            "Why background queues: decoupling slow operations (emails, PDF generation, webhooks) from HTTP request-response cycle.",
            "Architecture: Producers (FastAPI), Message Broker (Redis/RabbitMQ), Workers (Celery), Result Backend (Redis/PostgreSQL).",
            "Message serialization: JSON vs Pickle (security risks of Pickle deserialization exploits).",
            "Worker concurrency models: prefork (multi-process for CPU work), gevent/eventlet (green threads for I/O), solo."
        ], "Using pickle serialization in message brokers, allowing remote code execution via forged task payloads.",
        "Configure Celery with Redis broker and JSON serialization, dispatching tasks from a FastAPI endpoint.",
        "TenantIQ: Asynchronous webhook ingestion."),

        ("Task Idempotency, Delivery Guarantees, & Acknowledgments", "Lesson 5.43", [
            "Message delivery semantics: At-Least-Once delivery (default) vs At-Most-Once delivery.",
            "Why tasks MUST be idempotent: broker retries and network partitions will deliver tasks multiple times.",
            "Late Acknowledgments: `task_acks_late = True`; acknowledging tasks only after successful execution.",
            "Designing idempotent tasks: using database transactions, unique constraints, or Redis locks."
        ], "Non-idempotent billing tasks charging a customer twice after a network timeout during worker task acknowledgment.",
        "Implement an idempotent task that safely handles duplicate deliveries without duplicating state modifications.",
        "TenantIQ: Metric calculation workers."),

        ("Task Retries, Exponential Backoff, & Dead-Letter Queues (DLQ)", "Lesson 5.44", [
            "Handling transient failures: database deadlocks, third-party API rate limits.",
            "Exponential backoff with jitter: $T = 2^{\text{retry}} + \text{random}(0, 1)$; preventing thundering herd on recovery.",
            "The Poison Pill problem: tasks that crash workers permanently on invalid inputs.",
            "Dead-Letter Queues (DLQ): routing permanently failed tasks to an error queue for human inspection."
        ], "Retrying failed tasks immediately without backoff, flooding an already degraded external API and worsening outages.",
        "Build a Celery task with exponential backoff and automatic routing to a dead-letter queue after 5 failed retries.",
        "TenantIQ: GitHub webhook retry engine."),

        ("Periodic Tasks, Distributed Schedulers, & Celery Beat", "Lesson 5.43", [
            "Cron-style scheduling in distributed systems: Celery Beat scheduler.",
            "Schedule configuration: intervals, crontab syntax, solar events.",
            "The Singleton Scheduler constraint: why running multiple Celery Beat instances causes duplicate task dispatch.",
            "Distributed leader election for high-availability schedulers using Redis distributed locks."
        ], "Running Celery Beat on multiple container replicas, causing scheduled tasks to execute multiple times simultaneously.",
        "Configure Celery Beat to execute periodic database cleanup and metric rollups on a strict cron schedule.",
        "TenantIQ: Daily DORA metric aggregations."),

        # Redis Data Structures & Caching Patterns (5.47)
        ("Redis Core Data Structures & Caching Strategy Execution", "Phase 3 (Lesson 3.2), Phase 4 (Lesson 4.23)", [
            "Redis memory architecture: in-memory key-value store, single-threaded event loop, non-blocking epoll I/O.",
            "Data structures: Strings, Hashes, Lists, Sets, Sorted Sets (SkipLists for leaderboards and rate limiting), HyperLogLog.",
            "Atomic operations with Lua scripting: `EVAL` and `EVALSHA` executing multi-step operations without concurrency races.",
            "Caching Strategies: Cache-Aside (lazy loading), Write-Through, Write-Behind (write-back), Read-Through.",
            "Cache failure modes: Cache Stampede (XFetch early expiry mitigation), Cache Penetration (Bloom filters), Cache Avalanche (jittered TTLs)."
        ], "Massive database outage caused by cache stampede when a high-traffic key expired without mutex locking.",
        "Build the `CacheKit` library implementing Cache-Aside with probabilistic early expiration (XFetch algorithm).",
        "CacheKit Phase 5 Mini-Project."),

        # Security Engineering: Cryptography, Auth, JWTs, OWASP Top 10 (5.48 - 5.49)
        ("Security Engineering: Cryptography, Passwords, & Timing Attacks", "Phase 0 (Lesson 0.1)", [
            "Cryptographic hashing: SHA-256 vs SHA-3; why raw hashing is broken for passwords (GPU brute-force).",
            "Memory-hard password hashing: Argon2id (`argon2-cffi`), bcrypt; tuning memory cost, time cost, and parallelism.",
            "HMAC (Hash-based Message Authentication Code): `HMAC-SHA256` for webhook signatures and tamper-proofing.",
            "Timing attacks: byte-by-byte comparison short-circuits leaking secrets; constant-time comparison with `hmac.compare_digest()`."
        ], "Comparing password hashes or webhook signatures using standard `==`, enabling side-channel timing recovery of secrets.",
        "Write an exploit demonstrating timing differences on string comparison, then verify fix using `hmac.compare_digest()`.",
        "AuthForge: Security foundations."),

        ("Identity Protocols: JWT Vulnerabilities, OAuth 2.0, & OWASP Top 10", "Lesson 5.48", [
            "JWT anatomy: `Header.Payload.Signature`; `alg: none` exploit, RS256 to HS256 algorithm confusion attack.",
            "Dual-token session architecture: 15-minute JWT Access Tokens + stateful 7-day Refresh Tokens in Redis.",
            "OAuth 2.0 Authorization Code Flow with PKCE (Proof Key for Code Exchange): code verifiers, challenges, code interception defense.",
            "OWASP Top 10 Hands-On: Insecure Direct Object References (IDOR), SQLi, SSRF via metadata services (`169.254.169.254`), Rate Limiting (Token Bucket)."
        ], "Accepting JWTs without validating the `alg` header, allowing attackers to forge arbitrary tokens using `alg: none`.",
        "Build a complete OAuth 2.0 PKCE flow and execute an IDOR attack exploit, proving remediation in code.",
        "AuthForge: Core microservice."),

        # Automated CI/CD with GitHub Actions (5.50)
        ("Automated CI/CD Pipelines with GitHub Actions & Container Scanning", "Phase 0 (Lesson 0.5), Phase 4 (Lesson 4.39)", [
            "Continuous Integration principles: automated testing, linting, and type checking on every pull request.",
            "GitHub Actions workflow syntax: `.github/workflows/*.yaml`, triggers (`push`, `pull_request`), jobs, matrix runners.",
            "Pipeline caching: caching pip dependencies and Docker layer caches to accelerate builds by 10x.",
            "Quality & Security Gates: running `ruff`, `mypy --strict`, `pytest --cov=85`, and Trivy container vulnerability scans in CI."
        ], "Allowing failing unit tests or Critical security CVEs to bypass CI and deploy automatically to staging environments.",
        "Write a complete GitHub Actions workflow that runs linters, static type checking, tests with coverage gates, and scans Docker images with Trivy.",
        "Applied across all projects.")
    ]

    p5_rendered = []
    for idx, (title, prereqs, subtopics, fail, verif, proj) in enumerate(p5_lessons, 1):
        p5_rendered.append(format_lesson(5, idx, title, prereqs, subtopics, fail, verif, proj))

    p4_body = "\n".join(p4_rendered)
    p5_body = "\n".join(p5_rendered)

    return f"""
---

## Phase 4: Systems Internals: OS, Concurrency, Networks, Docker
**Duration**: 8 weeks
**Total Lessons**: 40 Lessons (Lesson 4.1 to Lesson 4.40)
**Builds on**: Phase 0 (syscalls, processes, memory layout), Phase 1 (Python async, typing)
**Introduces**: Advanced OS memory internals, POSIX IPC, thread synchronization, Linux `epoll` I/O multiplexing, TCP/IP network stack, DNS resolution, TLS 1.3 cryptography, HTTP protocol versions, Linux container primitives (namespaces, cgroups, OverlayFS), Docker multi-stage builds, Trivy container scanning.

---

### Phase 4 Lesson Specifications (Lessons 4.1 – 4.40)

{p4_body}

---

### Phase 4 Project: NanoHTTP

- **Project Type**: Low-Level Network Systems Server
- **Language**: Python (`mypy --strict`)
- **Dependencies**: Zero external web frameworks (built strictly from standard `socket` and `asyncio` modules)
- **Specification**: Complete HTTP/1.1 web server built directly from raw TCP sockets.
- **Architectural Deliverables**:
  - **Version 1 (Multi-Threaded Server)**:
    - Raw TCP socket initialized with `socket.AF_INET, socket.SOCK_STREAM`.
    - Socket options configured with `SO_REUSEADDR` and `TCP_NODELAY`.
    - Thread-per-connection concurrency model using `threading.Thread`.
  - **Version 2 (Event-Driven Async Server)**:
    - Re-implemented using `asyncio.start_server()` and `StreamReader`/`StreamWriter`.
    - Non-blocking socket I/O multiplexed by the Linux `epoll` kernel mechanism.
  - **HTTP/1.1 Protocol Engine**:
    - Complete request parser: parsing Request Line (Method, Path, HTTP Version), Headers (case-insensitive dictionary), and Body.
    - Persistent connection manager honoring `Connection: keep-alive` and enforcing `Content-Length`.
    - Chunked Transfer Encoding parser and emitter (`Transfer-Encoding: chunked`).
    - Static file server mapping URI paths to filesystem assets with correct MIME types and `mmap` zero-copy acceleration.
  - **Security & Resiliency Hardening**:
    - Path traversal attack mitigation: blocking `../` paths with immediate `403 Forbidden`.
    - Slowloris attack defense: enforcing a 5-second socket timeout for incomplete request header transmission.
    - Request body size limiter: rejecting payloads exceeding 1MB with `413 Content Too Large`.
    - Graceful termination: trapping `SIGTERM` to stop accepting new sockets while finishing active requests.
- **Verification & Benchmarking**:
  - Automated integration test suite spawning server in a subprocess and verifying RFC compliance with `httpx`.
  - Performance benchmarking via `wrk -t4 -c100 -d30s`: comparison report documenting throughput, p99 latency, and memory footprint of Threaded vs Async models.
  - Containerized with multi-stage Dockerfile passing Trivy vulnerability scanner.

---

### Phase 4 Exit Benchmark

- [ ] Explain the complete lifecycle of a web request from keystroke to screen across DNS, TCP, TLS, and HTTP protocol layers.
- [ ] Write a program in raw sockets that sets up an epoll-driven event loop and handles 1,000 concurrent echo connections.
- [ ] Explain why a server requires `SO_REUSEADDR` and what state machine transitions occur in TCP when an application restarts.
- [ ] Write a multi-threaded program, introduce a race condition deliberately, demonstrate it failing under load, and fix it using mutual exclusion.
- [ ] Create a multi-stage Dockerfile running as non-root with an integrated health check, and verify zero Critical vulnerabilities with Trivy.

---

## Phase 5: Backend Systems & API Engineering
**Duration**: 10 weeks
**Total Lessons**: 50 Lessons (Lesson 5.1 to Lesson 5.50)
**Builds on**: Phase 1 (Python, testing, SOLID, patterns), Phase 3 (data structures), Phase 4 (networks, concurrency, Docker)
**Introduces**: RESTful API design, FastAPI framework, deep SQL mastery, PostgreSQL engine internals, B-Tree index engineering, transaction isolation levels, Multi-Version Concurrency Control (MVCC), PgBouncer connection pooling, cryptography fundamentals, JWT security & OAuth 2.0 / PKCE, OWASP Top 10 hands-on attacks and defenses, token bucket rate limiting, Redis data structures & caching patterns, gRPC / Protocol Buffers & health probes, Celery background worker queues, GitHub Actions CI/CD pipelines.

---

### Phase 5 Lesson Specifications (Lessons 5.1 – 5.50)

{p5_body}

---

### Phase 5 Projects

#### Project 5.1 (Mini-Project): SchemaVault — Database Migration Engine
- **Project Type**: Database Systems Infrastructure
- **Language**: Python (`psycopg2` direct connection, zero ORMs)
- **Specification**: A database migration CLI engine built from scratch.
- **Features**:
  - Sequential forward migrations and rollbacks via numbered SQL files (`001_create_tables.sql`).
  - Atomic execution: migrations executed within explicit transactions, rolling back on error.
  - Distributed concurrency protection: utilizes PostgreSQL Advisory Locks (`pg_advisory_lock`) to prevent concurrent migration executions across distributed containers.
  - State tracking table (`schema_migrations`) tracking applied checksums to detect file tampering.
  - Dry-run mode (`--dry-run`) printing generated SQL statements without executing.
- **Quality Standard**:
  - Automated integration testing against real PostgreSQL instances via `pytest-docker`.

#### Project 5.2 (Mini-Project): CacheKit — Caching Strategy Library
- **Project Type**: Distributed Systems Caching Library
- **Language**: Python (built on Redis)
- **Specification**: Python library implementing canonical caching and rate limiting strategies.
- **Implementations**:
  - `CacheAside(redis, loader_fn, ttl)`: Lazy-loading cache with probabilistic early expiration (XFetch) to eliminate cache stampedes.
  - `WriteThrough(redis, writer_fn)`: Synchronous cache and database write coordination.
  - `TokenBucketRateLimiter(redis, capacity, refill_rate)`: Atomic rate limiting implemented via Lua script.
  - `SlidingWindowLogRateLimiter(redis, limit, window_seconds)`: High-accuracy rate limiting via Redis Sorted Sets.
- **Quality Standard**:
  - Benchmarked latency reports comparing cache hit rates (100%, 50%, 0%) under concurrent load.

#### Project 5.3 (Enterprise Project 3): AuthForge — Identity & Security Service
- **Project Type**: Production Enterprise Microservice
- **Language**: Python (FastAPI + gRPC + PostgreSQL + Redis)
- **Specification**: Complete multi-protocol identity, authentication, and authorization service.
- **Features**:
  - User registration, password hashing with Argon2id, login, logout.
  - Dual-token authentication: 15-minute JWT access tokens + 7-day refresh tokens stored in Redis with revocation blocklist.
  - OAuth 2.0 Authorization Code Flow with PKCE for third-party identity providers ("Sign in with Google").
  - Role-Based Access Control (RBAC) with granular database-persisted permissions.
  - Dual Protocol APIs:
    - Public REST API for user authentication, profile management, and OAuth redirects.
    - Internal high-performance gRPC API: implementing `ValidateToken` and `RefreshToken` RPCs with `grpc.health.v1.Health` checks for internal service-to-service validation.
  - Rate limiting via `CacheKit`: maximum 5 failed login attempts per minute per IP.
  - Security audit logging: structured JSON logs tracking authentication events, IP addresses, and user-agent strings.
- **Security Standard**:
  - All 10 OWASP mitigations verified in test suite; `pip-audit` zero findings.
  - Load test: sustains $>1,000$ token validations per second via gRPC at $p95 < 30$ms using `k6`.
  - Packaged as a production multi-stage Docker image passing Trivy vulnerability scans.

---

### Phase 5 Exit Benchmark

- [ ] Explain the internal page structure of a PostgreSQL B-Tree and how the query planner decides between a sequential scan and an index scan.
- [ ] Reproduce a Write Skew anomaly between two concurrent database connections and fix it using `SELECT FOR UPDATE` or `SERIALIZABLE` isolation.
- [ ] Demonstrate a JWT algorithm confusion exploit and an IDOR attack in code, and write unit tests proving the vulnerability is resolved.
- [ ] Implement the Token Bucket rate limiting algorithm atomically using Redis and Lua script from memory.
- [ ] Define a `.proto` file with a health checking service, generate stubs, run a gRPC server, and verify health status with `grpc_health_probe`.
"""
