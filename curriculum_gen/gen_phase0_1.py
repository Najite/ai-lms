from helper import format_lesson

def get_content():
    p0_lessons = [
        ("Bits, Bytes, & Number Representations", "None", [
            "Binary, octal, decimal, and hexadecimal numeral systems; conversion mechanics.",
            "Bitwise representation of data in physical registers; byte sizing and word boundaries.",
            "ASCII, Extended ASCII, and Unicode UTF-8 variable-length byte encoding mechanics.",
            "Data serialization into binary streams; endianness bit-patterns."
        ], "Assuming fixed-width character byte sizing, leading to string truncation on multi-byte UTF-8 characters.",
        "Convert arbitrary hexadecimal dumps into IEEE-754 floats and UTF-8 strings manually without libraries.",
        "SysTrace: Binary parsing of system records."),

        ("Two's Complement & Signed Integer Arithmetic", "Lesson 0.1", [
            "Signed vs unsigned integer representation in hardware; sign bit conventions.",
            "Two's complement derivation: inverting bits and adding 1; algebraic symmetry.",
            "Why signed 32-bit -1 is represented as 0xFFFFFFFF in memory registers.",
            "Integer overflow, underflow, and silent wrap-around vulnerabilities in systems code."
        ], "Integer overflow leading to buffer allocation bypasses or infinite loops in arithmetic bounds checks.",
        "Calculate the exact binary representation of negative integers across 8-bit, 16-bit, and 32-bit words.",
        "SysTrace: Accurate parsing of signed process priority and nice values from `/proc`."),

        ("Bitwise Operators & Bit Manipulation Hacks", "Lesson 0.2", [
            "Fundamental bitwise operations: AND, OR, XOR, NOT, left-shift, and right-shift.",
            "Logical right-shift vs arithmetic right-shift (sign preservation mechanics).",
            "Bitmasking: setting, clearing, toggling, and testing individual register bits.",
            "Canonical bit hacks: Brian Kernighan’s set-bit counting, power-of-two testing (`(x & (x-1)) == 0`)."
        ], "Off-by-one bit-shifts causing undefined behavior or shifting into the sign bit.",
        "Implement a bitset array supporting 1,000,000 boolean flags using an array of 64-bit integers.",
        "SysTrace: Bitmask decoding of Linux process state flags."),

        ("CPU Instruction Execution & Pipeline Architecture", "Lesson 0.1", [
            "The Von Neumann architecture: CPU, memory bus, registers, and arithmetic logic unit (ALU).",
            "The Instruction Cycle: Fetch, Decode, Execute, Memory Access, Write-Back.",
            "Instruction Set Architecture (ISA): x86-64 CISC vs ARM64 RISC design philosophies.",
            "CPU Instruction Pipelining: hazards (structural, data, control) and speculative execution."
        ], "Branch mispredictions flushing the instruction pipeline, degrading execution throughput by 10x.",
        "Inspect disassembly of a simple loop using `objdump -d` and trace register movements through the pipeline.",
        "SysTrace: Inspecting CPU hardware counters via `/proc/cpuinfo`."),

        ("Clock Speeds, Cycles, & Instructions Per Cycle (IPC)", "Lesson 0.4", [
            "CPU clock frequency: physical quartz oscillations, clock period in nanoseconds.",
            "Instructions Per Cycle (IPC) vs Clock Speed: why gigahertz alone does not measure performance.",
            "Thermal throttling, dynamic voltage and frequency scaling (DVFS), and turbo frequencies.",
            "Superscalar execution and out-of-order execution engines in modern microprocessors."
        ], "Benchmarking algorithms without disabling CPU frequency scaling, yielding wildly noisy latency results.",
        "Measure and graph CPU cycle variations under varying thermal loads using hardware monitoring tools.",
        "SysTrace: CPU utilization metrics calculation."),

        ("CPU Cache Hierarchy (L1, L2, L3) & Cache Lines", "Lesson 0.4", [
            "Memory latency gap: CPU execution speed vs physical DRAM access latency.",
            "Cache hierarchy: L1 Data/Instruction (32KB, ~4 cycles), L2 (~512KB, ~14 cycles), L3 Shared (~32MB, ~50 cycles).",
            "Cache lines: standard 64-byte transfer units between memory and CPU caches.",
            "Direct-mapped vs Set-Associative caches: cache ways, tags, indexes, and replacement policies."
        ], "Cache thrashing when two frequently accessed memory blocks map to the same set in a low-associativity cache.",
        "Demonstrate cache line eviction by measuring access times across arrays with varying strides.",
        "SysTrace: Memory access optimization and cache-aware profiling."),

        ("Cache Misses, Locality of Reference, & False Sharing", "Lesson 0.6", [
            "Temporal Locality: recently accessed memory is likely to be accessed again soon.",
            "Spatial Locality: memory physically adjacent to accessed memory will be fetched into the cache line.",
            "Matrix traversal performance: Row-major vs Column-major memory access in C and Python.",
            "False Sharing in multi-threaded systems: independent variables on the same 64-byte cache line causing cross-core invalidations."
        ], "Traversing multi-gigabyte matrices column-first, triggering cache misses on every read and degrading performance by 20x.",
        "Benchmark row-major vs column-major array traversal in C/Python, demonstrating a 10x throughput delta.",
        "Core foundation for NumPy array performance in Phase 2."),

        ("RAM Architecture, Memory Bus, & Endianness", "Lesson 0.1", [
            "DRAM physical structure: capacitor cells, refresh cycles, rows, columns, banks, and DDR channels.",
            "Memory bus bandwidth: bus width, transfer rates, dual-channel vs quad-channel architectures.",
            "Memory Alignment: why unaligned memory accesses cause hardware traps or multi-cycle penalty reads.",
            "Endianness: Little-Endian (x86, ARM) vs Big-Endian (network byte order); conversion with `htons`/`ntohl`."
        ], "Network socket data corruption caused by sending host byte order integers over Big-Endian network streams.",
        "Write a C/Python script to detect system endianness and perform raw byte-swapping without standard library functions.",
        "SysTrace: Correct parsing of binary network addresses and raw memory dumps."),

        ("Virtual Memory, MMU, & Page Tables", "Lesson 0.8", [
            "Why Virtual Memory: process isolation, security boundaries, and abstracting physical RAM addresses.",
            "Memory Management Unit (MMU): hardware translation of virtual addresses to physical addresses.",
            "Page Tables: multi-level page table hierarchies (PML4/PML5 in x86-64); Page Directory Pointers and Page Entries.",
            "Standard 4KB page frames vs HugePages (2MB, 1GB); memory footprint of page table trees."
        ], "Page table bloat when allocating millions of tiny mappings, consuming gigabytes of un-swappable kernel RAM.",
        "Inspect page table size and virtual address mappings of a running process via `/proc/<pid>/status`.",
        "SysTrace: Virtual memory vs physical RSS reporting."),

        ("Translation Lookaside Buffer (TLB) & Page Faults", "Lesson 0.9", [
            "The Translation Lookaside Buffer (TLB): hardware associative cache for page translations.",
            "TLB Miss latency penalty: multi-level page table walk in physical RAM.",
            "Minor Page Fault: virtual memory address mapped to newly allocated physical frame without disk I/O.",
            "Major Page Fault: page evicted to swap storage or memory-mapped file; synchronous disk block read required."
        ], "Severe application stutter caused by Major Page Faults during memory pressure when swapping is active.",
        "Write a program that intentionally triggers Minor Page Faults, measuring the overhead using `getrusage`.",
        "SysTrace: Page fault monitoring and system pressure metrics."),

        ("Stack Allocation Dynamics & Stack Overflow Mechanics", "Lesson 0.9", [
            "The Process Stack: memory segment growing downward; stack pointer (RSP) and base/frame pointer (RBP).",
            "Stack frames: local variables, return addresses, saved registers, function arguments.",
            "Stack allocation speed: moving the stack pointer by $N$ bytes ($O(1)$ assembly instruction).",
            "Stack Overflow: unbounded recursion or massive local arrays exceeding the OS stack limit (`ulimit -s`)."
        ], "Crashing production services with unrecoverable `SIGSEGV` by declaring multi-megabyte buffers on the stack.",
        "Calculate the exact stack frame size of a recursive function and predict the exact depth that triggers a stack overflow.",
        "LoxLang: Call stack and scope frame allocation in Phase 1."),

        ("Heap Allocation Dynamics & Memory Fragmentation", "Lesson 0.9", [
            "The Process Heap: memory segment growing upward via `brk()` and `sbrk()` syscalls.",
            "Heap allocators: `malloc`, `free`, `jemalloc`, `tcmalloc`; free lists, bins, and chunk headers.",
            "Internal Fragmentation: allocated chunk larger than requested payload.",
            "External Fragmentation: sufficient total free memory exists, but no single contiguous block satisfies allocation."
        ], "Long-running processes experiencing Out-Of-Memory crashes despite low total memory usage due to heap fragmentation.",
        "Simulate heap fragmentation by executing alternating allocation and deallocation patterns, measuring heap growth.",
        "Foundation for CPython memory analysis in Phase 1."),

        ("Compilation Toolchain: Preprocessing & Parsing", "Lesson 0.1", [
            "Source code to binary executable pipeline overview.",
            "The C Preprocessor (`cpp`): macro expansion, header file inclusion (`#include`), conditional compilation (`#ifdef`).",
            "Lexical Analysis: tokenizing source text streams into structured language tokens.",
            "Syntax Analysis: Abstract Syntax Tree (AST) construction and context-free grammar validation."
        ], "Macro expansion bugs causing silent logic errors due to missing parentheses in preprocessor definitions.",
        "Run the preprocessor on a C source file using `gcc -E` and analyze the resulting 20,000-line expanded output.",
        "LoxLang: Scanner and recursive descent parser implementation in Phase 1."),

        ("Compilation Toolchain: Assembly, Object Files, & Linkers", "Lesson 0.13", [
            "Intermediate Representation (IR) and code generation: emitting architecture-specific assembly language (`.s`).",
            "The Assembler (`as`): converting assembly instructions into machine code object files (`.o`).",
            "Executable and Linkable Format (ELF): Header, `.text`, `.data`, `.rodata`, `.bss`, symbol tables.",
            "The Linker (`ld`): symbol resolution, address relocation, combining multiple object files into an executable."
        ], "Linker errors: undefined reference to symbol vs multiple definition of symbol; understanding declaration vs definition.",
        "Inspect an ELF object file using `readelf -S` and identify the byte boundaries of the `.text` and `.data` sections.",
        "SysTrace: Inspecting process memory maps against ELF segments."),

        ("Dynamic Linking vs Static Linking & Shared Libraries", "Lesson 0.14", [
            "Static Linking: bundling all library dependencies into a single self-contained binary executable.",
            "Dynamic Linking: resolving shared objects (`.so`, `.dll`) at runtime via the dynamic loader (`ld.so`).",
            "Global Offset Table (GOT) and Procedure Linkage Table (PLT): Position Independent Code (PIC).",
            "Shared library search paths: `LD_LIBRARY_PATH`, `/etc/ld.so.conf`, `rpath`, and security implications."
        ], "`error while loading shared libraries: cannot open shared object file`: resolving runtime library linkage failures.",
        "Inspect dynamically linked symbols of a system binary using `ldd` and `nm -D`, tracing dynamic resolution.",
        "Docker multi-stage builds: understanding shared library dependencies in distroless containers (Phase 4)."),

        ("CPU Privilege Rings & User/Kernel Space Boundaries", "Lesson 0.4", [
            "Hardware privilege rings: Ring 0 (Kernel Space, full hardware access) vs Ring 3 (User Space, restricted).",
            "Why hardware protection matters: preventing user processes from corrupting hardware or other processes.",
            "Trap instructions and CPU state transitions: saving registers, switching stacks, loading kernel entrypoint.",
            "System call overhead: cost of context switching between Ring 3 and Ring 0 (~100 to ~1500 CPU cycles)."
        ], "Making excessive micro-syscalls inside high-throughput loops, incurring massive context-switching overhead.",
        "Measure the exact CPU cycle cost of an empty system call (`getpid()`) vs a user-space function call.",
        "SysTrace: Monitoring user vs system CPU time distribution."),

        ("POSIX System Call Mechanics & Software Traps", "Lesson 0.16", [
            "System call invocation mechanics: loading syscall number into `RAX`, parameters into registers, executing `syscall`.",
            "Kernel System Call Table: mapping syscall numbers to internal kernel C function pointers.",
            "Return values and error handling: negative return codes, setting `errno`, `strerror()` interpretation.",
            "Tracing system calls in Linux: using `strace` with timing (`-T`), summary (`-c`), and filtering (`-e trace=...`)."
        ], "Failing to check return values of syscalls, causing cascading failures when file operations return `-1`.",
        "Run `strace -c` on a common CLI utility and produce a profile of the most frequent system calls executed.",
        "SysTrace: Core debugging foundation for process introspection."),

        ("Core POSIX Syscalls: File I/O Mechanics", "Lesson 0.17", [
            "`openat()` system call: path resolution, flags (`O_RDONLY`, `O_WRONLY`, `O_CREAT`, `O_TRUNC`, `O_NONBLOCK`).",
            "`read()` and `write()`: byte streaming, partial reads/writes, buffer boundaries, handling `EINTR` interrupts.",
            "`close()`: releasing file descriptors, kernel cleanup, file descriptor leak mechanics.",
            "`lseek()`: manipulating file offsets; sparse files and file holes; append-only mode (`O_APPEND`)."
        ], "Failing to loop over `write()` when writing large buffers, resulting in silent data truncation on partial writes.",
        "Write a file copy utility in pure POSIX C/Python syscalls that handles partial reads, writes, and `EINTR` signals.",
        "NanoHTTP: Raw socket stream reading and writing in Phase 4."),

        ("Advanced POSIX Syscalls: Memory & Process Control", "Lesson 0.17", [
            "`mmap()` in depth: parameters (length, protection flags, map flags, fd, offset); zero-copy disk mapping.",
            "`brk()` and `sbrk()`: modifying the heap break pointer directly.",
            "`clone()` system call: the unified kernel primitive underpinning processes, threads, and Linux containers.",
            "`execve()`: replacing process image, argument arrays (`argv`), and environment arrays (`envp`)."
        ], "Memory corruption from reading beyond `mmap` boundaries, triggering uncatchable `SIGBUS` signals.",
        "Use `mmap` to inspect and modify an on-disk binary structure without calling `read()` or `write()`.",
        "DataSift and NanoHTTP: Zero-copy file processing."),

        ("File Descriptors, Standard Streams, & Inode Tables", "Lesson 0.18", [
            "The File Descriptor table: per-process array of pointers to global open file table entries.",
            "Standard File Descriptors: 0 (stdin), 1 (stdout), 2 (stderr); redirection mechanics.",
            "Inodes: filesystem metadata records, permissions, timestamps, block pointers, hard links vs soft links.",
            "File descriptor limits: soft limits, hard limits (`ulimit -n`), and `EMFILE` (Too many open files) exhaustion."
        ], "File descriptor leaks in web servers exhausting process limits and rejecting all subsequent client connections.",
        "Inspect the `/proc/<pid>/fd` directory of a running process, identifying all open files, sockets, and pipes.",
        "SysTrace: Tracking open file descriptor counts per PID."),

        ("Process Lifecycle, States, & Context Switching", "Lesson 0.17", [
            "Process Control Block (PCB): task structure in kernel memory, PID, PPID, credentials, scheduling state.",
            "Linux Process States: TASK_RUNNING (R), TASK_INTERRUPTIBLE (S), TASK_UNINTERRUPTIBLE (D), TASK_ZOMBIE (Z), TASK_STOPPED (T).",
            "Uninterruptible Sleep (D State): process waiting on hardware I/O; why `kill -9` cannot terminate a D-state process.",
            "Context Switching: saving CPU register context, switching page tables (TLB flush), loading new task state."
        ], "Zombie process accumulation exhausting system PID limits when parent processes fail to call `waitpid()`.",
        "Write a script that deliberately spawns an uninterruptible sleep or zombie process and inspects it via `ps`.",
        "SysTrace: Process lifecycle state categorization."),

        ("The Linux `/proc` Filesystem & Kernel Introspection", "Lesson 0.21", [
            "Virtual filesystems: `/proc` as a window into real-time kernel data structures; zero disk storage.",
            "Global system metrics: `/proc/cpuinfo`, `/proc/meminfo`, `/proc/stat`, `/proc/loadavg`.",
            "Per-process introspection: `/proc/<pid>/status`, `/proc/<pid>/maps`, `/proc/<pid>/cmdline`, `/proc/<pid>/stat`.",
            "Parsing `/proc/<pid>/maps`: memory region start/end, permissions (rwxp), offsets, devices, inodes, pathnames."
        ], "Parsing `/proc` files with static character index assumptions rather than dynamic whitespace splitting.",
        "Write a script to calculate total Resident Set Size (RSS) across all processes by parsing `/proc/*/status`.",
        "Core mechanism of the `SysTrace` Phase 0 Project."),

        ("Linux Terminal Architecture, Shells, & Environment", "Lesson 0.17", [
            "Terminal Emulators, Pseudo-Terminals (PTY), and Line Discipline (cooked mode vs raw mode).",
            "POSIX Shell execution model: command lookup, PATH traversal, subshells, process substitution.",
            "Environment variables: inherited environment, exporting variables (`export`), local variables.",
            "Shell configuration lifecycle: `/etc/profile`, `~/.bash_profile`, `~/.bashrc`, interactive vs non-interactive shells."
        ], "Modifying environment variables in subshells and wondering why parent process environments remain unchanged.",
        "Trace environment variable inheritance across nested subshells and background processes.",
        "SysTrace: Execution environment and path configuration."),

        ("Standard Streams, Redirection, & Pipes", "Lesson 0.20", [
            "Stream redirection syntax: `>`, `>>`, `<`, `2>`, `2>&1`, `&>`.",
            "The UNIX Pipe (`|`): kernel anonymous pipe connecting stdout of process A to stdin of process B.",
            "Buffering semantics: fully buffered (block buffered when redirected to file) vs line buffered (TTY terminals).",
            "Process substitution (`<()`, `>()`): passing command outputs as file paths to commands expecting files."
        ], "Pipeline deadlocks or silent data loss when mixing stdout and stderr redirection in wrong order (`2>&1 >file`).",
        "Construct a pipeline that redirects stdout to a file and stderr to a background alerting script simultaneously.",
        "Core text manipulation pipeline in `SysTrace`."),

        ("Process Control Signals (`SIGTERM`, `SIGKILL`, `SIGINT`)", "Lesson 0.21", [
            "POSIX signals: asynchronous kernel notifications sent to processes.",
            "Standard signals: `SIGINT` (2, Ctrl+C), `SIGQUIT` (3), `SIGKILL` (9, non-catchable), `SIGTERM` (15, graceful exit request), `SIGHUP` (1, hangup/reload).",
            "Signal handling in Bash: the `trap` command, executing cleanup routines on script termination.",
            "Process groups and sessions: sending signals to entire process trees using negative PID syntax (`kill -- -PGID`)."
        ], "Using `kill -9` as the default termination command, leaving database locks, temporary files, and socket ports locked.",
        "Write a Bash script with a `trap` handler that cleanly removes temporary directories even when terminated via `SIGINT`.",
        "SysTrace: Clean shutdown and signal trapping."),

        ("POSIX File Permissions, Ownership, & Special Bits", "Lesson 0.20", [
            "POSIX permission octets: Owner, Group, Others; Read (4), Write (2), Execute (1).",
            "The `umask`: default permission masking calculation for newly created files and directories.",
            "Special permission bits: SUID (Set User ID - executes as file owner), SGID (Set Group ID), Sticky Bit (restricted deletion in `/tmp`).",
            "Ownership management: `chmod`, `chown`, `chgrp`, recursive updates, and symbolic link handling."
        ], "Security disaster: setting permissions to `777` to fix a permission error, exposing secrets and code to all local users.",
        "Demonstrate how SUID permissions permit unprivileged users to execute privileged actions safely.",
        "Security audit checks in `DevAudit`."),

        ("High-Performance Text Processing (`grep`, `sed`, `awk`, `cut`)", "Lesson 0.24", [
            "`grep` mastery: recursive search (`-r`), inverted matching (`-v`), line numbering (`-n`), counting (`-c`), PCRE regex (`-P`).",
            "`sed` stream editor: search and replace (`s/pattern/replacement/g`), address ranges, deleting lines (`/d`), in-place editing (`-i`).",
            "`awk` programming: pattern-action pairs, field separators (`-F`), built-in variables (`NR`, `NF`, `$1`, `$2`), associative arrays.",
            "Composing Unix pipelines: combining `grep | awk | sort | uniq -c | sort -nr` for high-throughput log analysis."
        ], "Running unquoted `sed -i` commands on macOS vs Linux, causing script syntax crashes across operating systems.",
        "Parse an Nginx access log file with `awk` and output the top 5 IP addresses by total bytes transferred in under 3 seconds.",
        "SysTrace: Log parsing and metric formatting."),

        ("Robust Bash Scripting, Error Trapping, & `shellcheck`", "Lesson 0.25", [
            "Bash strict mode: `set -euo pipefail` (exit on error, exit on unset variable, inherit pipeline failure status).",
            "Quoting rules in Bash: why double quoting (`\"$var\"`) prevents catastrophic word splitting and pathname globbing.",
            "Conditional branching and arithmetic: `[[ ... ]]` vs `[ ... ]`, integer testing, string testing, regex matching.",
            "Automated shell static analysis: running `shellcheck` to detect bugs, unhandled exit codes, and portability violations."
        ], "Executing `rm -rf $DIR/` when `DIR` is unset, resulting in the accidental execution of `rm -rf /`.",
        "Write a 100-line Bash utility that passes `shellcheck` with zero warnings, zero hints, and strict error handling.",
        "SysTrace: Mandatory quality standard for Phase 0 project."),

        ("Regular Expressions: Finite Automata & Core Syntax", "Lesson 0.27", [
            "Automata theory: Deterministic Finite Automata (DFA) vs Non-Deterministic Finite Automata (NFA).",
            "Metacharacters, literals, character classes (`[...]`, `[^...]`), shorthand classes (`\\d`, `\\w`, `\\s`).",
            "Quantifiers: greedy (`*`, `+`, `{n,m}`), lazy/reluctant (`*?`, `+?`), possessive (`*+`).",
            "Anchors: line anchors (`^`, `$`), word boundaries (`\\b`, `\\B`), string anchors (`\\A`, `\\Z`)."
        ], "Greedy quantifiers consuming unexpected characters across multi-line inputs, extracting corrupted substrings.",
        "Write a regular expression that matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255) without false positives.",
        "DevAudit: Secret detection pattern matching engine."),

        ("ReDoS, Catastrophic Backtracking, & CPython `listobject.c` Reading", "Lesson 0.29", [
            "Catastrophic Backtracking in NFA engines: exponential branching ($O(2^n)$) on ambiguous nested quantifiers (e.g., `(a+)+$`).",
            "Regular Expression Denial of Service (ReDoS): how an adversarial 30-character string freezes a web server for minutes.",
            "Safe regex design: eliminating overlapping branches, atomic groups, possessive quantifiers.",
            "CPython Source Archeology: reading `Objects/listobject.c`; dissecting `list_resize()` dynamic over-allocation."
        ], "Production outage caused by an un-anchored, nested regex executed against user-submitted input in an API gateway.",
        "Identify and fix a catastrophic backtracking regex, and write a 500-word teardown of CPython `list_resize()` over-allocation.",
        "Exit benchmark requirement for Phase 0.")
    ]

    p0_rendered = []
    for idx, (title, prereqs, subtopics, fail, verif, proj) in enumerate(p0_lessons, 1):
        p0_rendered.append(format_lesson(0, idx, title, prereqs, subtopics, fail, verif, proj))

    # Phase 1: 50 lessons
    p1_lessons = [
        # 1.1 - 1.10: Python Object Model, Scopes, Memory, GIL
        ("Python Object Model & `PyObject` C-Struct", "Phase 0 (Lesson 0.1)", [
            "Everything is an object: `type()`, `id()`, `isinstance()`, and pointer references in CPython.",
            "The `PyObject` structure: `ob_refcnt` (reference count) and `ob_type` (pointer to type object).",
            "`PyVarObject` for variable-length items (lists, tuples, strings): `ob_size` field.",
            "Type objects as instances of `type`: how Python implements class objects in memory."
        ], "Confusing object identity (`is`) with value equality (`==`), causing subtle bugs with interned integers.",
        "Inspect the raw C-level memory address of a Python object and verify its type pointer using `ctypes`.",
        "LoxLang: Object model and value representation."),

        ("Reference Counting & Memory Management", "Lesson 1.1", [
            "Reference counting mechanics: incrementing references on assignment, passing to functions, storing in lists.",
            "Decrementing references on `del`, scope exit, reassignment; immediate deallocation when `ob_refcnt == 0`.",
            "Inspecting reference counts with `sys.getrefcount()` (accounting for the temporary reference passed to the function).",
            "Destructors: the `__del__` method, when it executes, and why relying on `__del__` for resource cleanup is dangerous."
        ], "Resource leaks when file handles or sockets rely on `__del__` rather than explicit context managers.",
        "Track reference counts of an object through various data structures and predict the exact moment of deallocation.",
        "LoxLang: Memory reclamation and scope exit."),

        ("Cyclic Garbage Collection & Generational Thresholds", "Lesson 1.2", [
            "The limitation of reference counting: circular references ($A \to B \to A$) preventing reference counts from reaching zero.",
            "CPython Cyclic GC: tracking container objects (`PyGC_Head` linked list), ignoring atomic types (integers, strings).",
            "The three GC generations (Gen 0, Gen 1, Gen 2): survival heuristics and collection frequencies.",
            "Tuning and disabling GC: `gc.collect()`, `gc.disable()`, `gc.get_stats()`, and Instagram's GC optimization."
        ], "Massive memory leaks in long-running web workers caused by circular references holding large caches in memory.",
        "Construct a circular reference, prove that `del` fails to free memory, and trigger manual reclamation via `gc.collect()`.",
        "DevAudit: Memory leak detection algorithms."),

        ("Python Scoping: LEGB Rule & Variable Resolution", "Lesson 1.1", [
            "Variable resolution hierarchy: Local $\to$ Enclosing $\to$ Global $\to$ Built-in.",
            "Namespace dictionaries: `locals()`, `globals()`, and `__builtins__`.",
            "The `global` keyword: modifying module-level variables from inner scopes.",
            "The `nonlocal` keyword: binding enclosing variables across nested function closures."
        ], "`UnboundLocalError: local variable referenced before assignment` caused by assigning to an outer variable without `global`/`nonlocal`.",
        "Demonstrate an example where variable shadowing causes silent logic bugs, and fix it using strict scoping rules.",
        "LoxLang: Resolving lexical environments in the interpreter."),

        ("Closures & Late Binding Trap in Lambdas", "Lesson 1.4", [
            "Closure mechanics: functions retaining references to lexical environments after the outer scope terminates.",
            "Cell objects: how CPython stores closed-over variables in `__closure__`.",
            "The Late Binding trap: loops creating lambdas that capture the variable name, not its value at iteration time.",
            "Fixing late binding: default argument binding (`lambda x, i=i: ...`) or `functools.partial`."
        ], "Event handlers or callback lists in UI loops all executing with the loop's final index value.",
        "Write a loop creating 10 functions that return their index, demonstrate the late binding bug, and apply the correct fix.",
        "TypeTrace: Event listener closure mechanics."),

        ("Mutable vs Immutable Types & Memory Interning", "Lesson 1.1", [
            "Mutable types (`list`, `dict`, `set`) vs Immutable types (`int`, `float`, `str`, `tuple`, `frozenset`).",
            "The Default Mutable Argument trap: `def add(item, lst=[])` sharing state across calls.",
            "Integer interning: CPython pre-allocating small integers (-5 to 256) at startup for global reuse.",
            "String interning: compile-time interning of identifier-like strings; manual interning via `sys.intern()`."
        ], "Default mutable arguments causing shared state pollution across concurrent API requests.",
        "Prove integer and string interning boundaries using `id()` and explain why `a = 256; b = 256; a is b` is True but 257 is False in REPL.",
        "DevAudit: Detecting mutable default arguments statically."),

        ("The Global Interpreter Lock (GIL) Architecture", "Phase 0 (Lesson 0.2), Lesson 1.2", [
            "What the GIL is: a mutual exclusion lock preventing multiple native threads from executing CPython bytecode simultaneously.",
            "Why CPython has a GIL: thread-safety for reference counting memory management and C-extension integration.",
            "GIL acquisition and release: thread switching intervals (5ms or instruction ticks); CPU contention.",
            "The GIL in Python 3.13+: Free-threaded CPython (PEP 703), mimalloc allocator, and immortal objects."
        ], "Assuming multi-threaded Python programs achieve multi-core parallelism for CPU-bound computations.",
        "Demonstrate that a CPU-bound calculation takes longer with 2 threads than with 1 thread in standard CPython.",
        "NanoHTTP: Concurrency model trade-offs in Phase 4."),

        ("CPU-Bound vs I/O-Bound Execution & GIL Workarounds", "Lesson 1.7", [
            "I/O-bound tasks: file I/O, network sockets; why standard threads release the GIL during blocking I/O calls.",
            "CPU-bound tasks: mathematical modeling, data transformations; why multi-processing is mandatory.",
            "The `multiprocessing` module: forking child processes, separate memory address spaces, IPC via pipes/queues.",
            "Process pools: `concurrent.futures.ProcessPoolExecutor` vs `ThreadPoolExecutor`."
        ], "Spawning 50 processes for I/O-bound scraping tasks, exhausting system RAM when async or threads would use 50MB.",
        "Benchmark CPU-bound vs I/O-bound workloads across threads, processes, and asynchronous event loops.",
        "DataSift: Multi-core parallel chunk processing in Phase 3."),

        ("Dynamic Typing & Duck Typing Runtime Mechanics", "Lesson 1.1", [
            "Dynamic typing: variables are untyped references to typed objects in heap memory.",
            "Duck Typing philosophy: 'If it walks like a duck and quacks like a duck, it's a duck.'",
            "Attribute lookup: `getattr()`, `hasattr()`, `setattr()`, and `__getattr__`/`__getattribute__`.",
            "EAFP (Easier to Ask for Forgiveness than Permission) vs LBYL (Look Before You Leap) idioms."
        ], "Overusing `hasattr()` causing hidden exceptions inside properties to be silently swallowed.",
        "Implement a polymorphic data processing pipeline that accepts any iterable or file-like object using EAFP.",
        "LoxLang: Dynamic runtime type evaluation."),

        ("CPython Bytecode, Disassembly (`dis`), & Execution Loop", "Lesson 1.1", [
            "Compilation of Python source into bytecode: `.pyc` files, magic numbers, code objects (`co_code`).",
            "The CPython evaluation loop: `_PyEval_EvalFrameDefault` giant switch statement in C.",
            "Using the `dis` module: inspecting bytecode instructions (`LOAD_FAST`, `STORE_FAST`, `BINARY_OP`, `CALL`).",
            "Instruction optimization: constant folding, peephole optimizer, and specialized bytecode in Python 3.11+."
        ], "Writing micro-optimizations that confuse the compiler peephole optimizer and degrade bytecode execution speed.",
        "Disassemble two functionally identical Python functions, count bytecode instructions, and verify execution speed delta.",
        "LoxLang: Bytecode compilation concepts."),

        # 1.11 - 1.20: Object-Oriented, Dunder Protocol, Metaprogramming
        ("Dunder Protocol: Object Representation (`__repr__`, `__str__`)", "Lesson 1.1", [
            "The duality of representation: `__repr__` (unambiguous, for developers) vs `__str__` (readable, for users).",
            "Fallback mechanics: `__str__` falling back to `__repr__` if omitted; default `object.__repr__` memory address output.",
            "Formatting protocols: `__format__`, format specifiers, and f-string integration.",
            "Best practices: making `repr(x)` resemble valid Python code to recreate the object whenever possible."
        ], "Failing to implement `__repr__`, causing log files and debugger stack traces to output useless `<Object at 0x7f...>` pointers.",
        "Implement a domain model class with customized `__repr__` and `__str__` supporting custom f-string formatting flags.",
        "Applied across all library projects starting from `MathKit`."),

        ("Dunder Protocol: Collections & Emulating Containers", "Lesson 1.11", [
            "Sequence protocol: `__len__`, `__getitem__`, `__setitem__`, `__delitem__`.",
            "Handling slices: `slice` objects, `slice.indices()`, supporting step and negative indexing.",
            "Iterable protocol: `__iter__` returning an iterator object; fallback to `__getitem__` with integer indices.",
            "Membership testing: `__contains__` for $O(1)$ `in` queries (fallback to $O(n)$ linear iteration)."
        ], "Implementing `__getitem__` without checking slice arguments, causing runtime type crashes on slices.",
        "Build a custom Sliceable linked-list or array wrapper implementing the full sequence protocol with slice support.",
        "MathKit: Tensor and matrix container indexing."),

        ("Context Managers: Protocol & Exception Propagation", "Lesson 1.1", [
            "The context management protocol: `__enter__` and `__exit__` methods.",
            "`__exit__` parameters: `exc_type`, `exc_val`, `exc_tb`; suppressing exceptions by returning `True`.",
            "The `contextlib` module: `@contextmanager` generator decorator and `yield` mechanics.",
            "Re-entrant and exit-stack patterns: `contextlib.ExitStack` for dynamically managing variable numbers of contexts."
        ], "Returning `True` from `__exit__` unconditionally, silently swallowing catastrophic syntax and system exceptions.",
        "Write a transaction context manager that commits on clean exit and rolls back state when any exception is raised.",
        "SchemaVault: Database transaction management in Phase 5."),

        ("Class Construction, `type`, `__new__` vs `__init__`", "Lesson 1.1", [
            "The two-stage creation process: `__new__` (allocates and returns new instance) vs `__init__` (initializes attributes).",
            "When to override `__new__`: subclassing immutable types (`int`, `str`, `tuple`) and Singleton patterns.",
            "`type` as a metaclass: dynamically constructing classes at runtime (`type(name, bases, dict)`).",
            "Class decorators vs Metaclasses: choosing the simpler abstraction for class registration."
        ], "Returning a non-instance from `__new__`, causing Python to silently skip calling `__init__`.",
        "Implement a class using `__new__` that enforces the Singleton pattern across multi-threaded allocations.",
        "LoxLang: Class instantiation mechanics."),

        ("Inheritance & Method Resolution Order (C3 Linearization)", "Lesson 1.14", [
            "Multiple inheritance: the Diamond Problem and ambiguous method inheritance.",
            "C3 Linearization Algorithm: local precedence order and monotonicity guarantees.",
            "Inspecting MRO: `Class.__mro__` and `Class.mro()`.",
            "Inconsistent MRO errors: class hierarchies that cannot be resolved mathematically by C3."
        ], "Designing inheritance hierarchies that fail C3 linearization, causing compile-time `TypeError: Cannot create a consistent MRO`.",
        "Trace by hand the exact C3 linearization order for a complex diamond multiple inheritance hierarchy.",
        "DevAudit: Class inheritance hierarchy analyzer."),

        ("Cooperative Multiple Inheritance & `super()` Mechanics", "Lesson 1.15", [
            "What `super()` actually does: not calling parent class, but calling the *next class in the MRO*.",
            "Cooperative class design: ensuring every method in the chain calls `super()` with identical argument signatures.",
            "Passing `*args` and `**kwargs` through `super()` chains without dropping arguments.",
            "Common anti-patterns: mixing hardcoded parent calls (`Parent.__init__(self)`) with `super()`."
        ], "Hardcoding base class calls in multiple inheritance, causing base methods to execute multiple times or be skipped.",
        "Refactor a broken diamond inheritance class hierarchy into a clean cooperative hierarchy using `super()`.",
        "AuthForge: Middleware and mixin inheritance in Phase 5."),

        ("Memory Optimization with `__slots__`", "Lesson 1.1", [
            "The standard instance dictionary: `__dict__` overhead (~150+ bytes per object instance).",
            "How `__slots__` works: replacing `__dict__` with a fixed-size descriptor array of C-pointers.",
            "Memory footprint comparison: saving 60%–80% RAM when instantiating millions of small records.",
            "Caveats of `__slots__`: multiple inheritance constraints, descriptor behavior, and subclassing."
        ], "Adding `__slots__` to a base class but omitting it in a child class, silently re-introducing `__dict__` overhead.",
        "Benchmark memory usage of 1,000,000 instances with and without `__slots__` using `tracemalloc`.",
        "DataSift: Record profiling structures."),

        ("Function Decorators: Closures & Signature Preservation", "Lesson 1.5", [
            "Decorator foundations: functions taking callables and returning wrapped callables.",
            "The signature erasure problem: decorators replacing `__name__`, `__doc__`, and function annotations.",
            "The `functools.wraps` decorator: copying metadata, annotations, and setting `__wrapped__`.",
            "Timing, logging, and caching decorators: implementing standard non-intrusive wrappers."
        ], "Forgetting `@functools.wraps`, breaking FastAPI route registration and automated documentation generation.",
        "Build a timing and retry decorator that preserves function signatures, docstrings, and type hints perfectly.",
        "ModelPulse: Telemetry SDK client decorators in Phase 11."),

        ("Advanced Decorators: Parameterized & Class Decorators", "Lesson 1.18", [
            "Three-level closure architecture: decorator factories accepting configuration arguments.",
            "Decorating classes: mutating class dictionaries, adding methods, registering classes in registries.",
            "Stateful decorators: implementing decorators as classes with `__call__`.",
            "Preserving type safety: using `typing.ParamSpec` and `typing.Concatenate` to type decorators precisely."
        ], "Creating decorator factories that drop keyword arguments or alter the return type of decorated callables.",
        "Implement a parameterized rate-limiting decorator typed with `ParamSpec` that passes `mypy --strict`.",
        "AuthForge: Route permission decorators."),

        ("Abstract Base Classes (`abc.ABC`) vs `typing.Protocol`", "Lesson 1.9", [
            "Nominal subtyping with `abc.ABC` and `@abstractmethod`: runtime enforcement of interface contracts.",
            "Structural subtyping with `typing.Protocol`: compile-time duck typing without explicit inheritance.",
            "Runtime protocol checks: `@runtime_checkable` and `isinstance()` validation.",
            "When to use ABCs (shared implementation) vs Protocols (loose decoupling of independent modules)."
        ], "Coupling third-party integrations to concrete ABC inheritance instead of flexible structural protocols.",
        "Design a storage engine interface using `Protocol` and verify that arbitrary classes satisfy it at compile time.",
        "DevAudit: Pluggable rule strategy interfaces."),

        # 1.21 - 1.30: Functional Programming & Static Typing
        ("First-Class Functions & Higher-Order Composition", "Lesson 1.5", [
            "Functions as first-class citizens: storing in data structures, passing as arguments, returning from functions.",
            "Pure functions and referential transparency: eliminating side-effects, testing without mocks.",
            "Function currying and partial application using `functools.partial`.",
            "Composing functional pipelines: chaining transformations without intermediate mutable collections."
        ], "Modifying mutable arguments in place inside functions expected to be pure, introducing shared state bugs.",
        "Implement a functional data transformation pipeline using `partial` and function composition.",
        "DataSift: Streaming column transformations."),

        ("Generators, `yield`, & Generator Frames", "Phase 0 (Lesson 0.11), Lesson 1.5", [
            "Generator execution mechanics: execution suspension, saving CPU frame state, yielding values.",
            "Memory footprint: constant $O(1)$ memory regardless of collection length.",
            "Generator expressions vs list comprehensions: `(x for x in data)` vs `[x for x in data]`.",
            "Generator lifecycle: `StopIteration` exception, generator exhaustion, and single-pass iteration."
        ], "Iterating over a generator twice, causing the second loop to execute zero times because the generator is exhausted.",
        "Build a generator that streams lines from a 10GB file, filters matching rows, and outputs batches in $O(1)$ memory.",
        "DataSift: File streaming engine."),

        ("Bidirectional Generators: `.send()`, `.throw()`, `.close()`", "Lesson 1.22", [
            "Generators as consumers: `val = yield` syntax receiving data from callers via `.send()`.",
            "Priming coroutine generators: advancing execution to the first `yield` statement.",
            "Exception injection via `.throw()`: triggering custom error handling inside the suspended generator frame.",
            "Clean termination with `.close()`: triggering `GeneratorExit` exceptions for cleanup."
        ], "Calling `.send(data)` on an unprimed generator, raising `TypeError: can't send non-None value to a just-started generator`.",
        "Implement a streaming running average calculator using a bidirectional generator receiving numbers via `.send()`.",
        "Foundation for coroutine event loops."),

        ("Delegating Generators with `yield from`", "Lesson 1.23", [
            "Subgenerator delegation: transparently channeling iteration between caller and subgenerator.",
            "Bidirectional passing: forwarding `.send()` values and `.throw()` exceptions directly to subgenerators.",
            "Subgenerator return values: capturing values returned by subgenerators upon termination (`val = yield from subgen()`).",
            "Flattening deeply nested tree structures into linear streams using recursive `yield from`."
        ], "Manually looping over subgenerators with `for x in subgen(): yield x`, breaking bidirectional `.send()` and exception delegation.",
        "Write a recursive tree traversal generator using `yield from` that flattens arbitrary nested hierarchies.",
        "LoxLang: AST traversal pipelines."),

        ("Memory-Bounded Stream Processing with `itertools`", "Lesson 1.22", [
            "Infinite iterators: `count`, `cycle`, `repeat`.",
            "Terminating iterators: `accumulate`, `chain`, `compress`, `dropwhile`, `takewhile`, `filterfalse`, `islice`.",
            "Combinatoric iterators: `product`, `permutations`, `combinations`, `combinations_with_replacement`.",
            "Grouping streams: `groupby()` and why sorted input is strictly mandatory for grouping."
        ], "Using `itertools.groupby()` on unsorted streams, causing duplicate groups for non-contiguous identical keys.",
        "Process an unsorted access log stream using `itertools` to group requests by status code in memory-bounded batches.",
        "DataSift: Aggregations and percentile sweeps."),

        ("Memoization & Functional Utilities (`functools`)", "Lesson 1.21", [
            "Caching expensive calculations: `functools.lru_cache` and `functools.cache`.",
            "Cache key generation: hashing function arguments; handling unhashable mutable arguments.",
            "Cache sizing and eviction: `maxsize`, monitoring cache hits, misses, and cache eviction overhead.",
            "Function reduction: `functools.reduce` for folding operations; `operator` module primitives."
        ], "Applying `lru_cache` to functions taking unhashable types (dicts, lists), raising `TypeError: unhashable type`.",
        "Implement a custom LRU cache decorator from scratch using a dictionary and doubly linked list, then compare against `functools.lru_cache`.",
        "CacheKit: In-memory caching foundation in Phase 5."),

        ("Static Typing: Primitive, Composite, & Literal Types", "Phase 0 (Lesson 0.1)", [
            "Type hints syntax (PEP 484): annotating variables, parameters, return types.",
            "Composite collections: `list[T]`, `dict[K, V]`, `set[T]`, `tuple[T, ...]`.",
            "Optionality and Unions: `T | None` (modern) vs `Optional[T]`; `Union` types.",
            "Literal types and Type Aliases: restricting inputs to exact values (`Literal['read', 'write']`)."
        ], "Omitting return type annotations on functions returning `None`, causing mypy to infer untyped functions.",
        "Annotate a complex configuration dictionary parsing function using TypedDict and Literal types passing mypy.",
        "Standard across all Python codebases."),

        ("Generics, `TypeVar`, & Covariance/Contravariance", "Lesson 1.27", [
            "Generic functions and classes: `typing.Generic` and parameterized types.",
            "`TypeVar` definitions: bounded type variables (`TypeVar('T', bound=Base)`).",
            "Variance rules: Invariance (default), Covariance (`covariant=True`), Contravariance (`contravariant=True`).",
            "Why mutable containers are invariant while read-only containers can be covariant."
        ], "Treating `list[Dog]` as compatible with `list[Animal]` (lists are mutable; this allows inserting a `Cat` into a `Dog` list).",
        "Implement a generic read-only repository typed as covariant and prove type correctness in `mypy --strict`.",
        "TypeTrace and DevAudit."),

        ("Structural Subtyping with `typing.Protocol`", "Lesson 1.20, 1.28", [
            "Static duck typing: declaring expected methods and attributes without subclassing.",
            "Protocol inheritance: extending protocols and combining multi-role interfaces.",
            "Recursive protocols: defining self-referential tree and graph data structures.",
            "Using `TypeGuard` and `TypeIs` for safe runtime type narrowing."
        ], "Creating protocols that require mutable attributes without declaring them as read-only properties.",
        "Define a `Serializable` Protocol and write a serializer that operates on any compliant class without inheritance.",
        "DevAudit: Strategy patterns."),

        ("Static Analysis: Configuring `mypy --strict` for Zero-Escape", "Lesson 1.27–1.29", [
            "Configuring `mypy.ini` / `pyproject.toml` with `--strict` flags.",
            "Disallowing untyped definitions, untyped calls, implicit optional, and un-imported type ignores.",
            "Stub packages (`types-*`): typing third-party C-extensions and legacy libraries.",
            "Type narrowing patterns: `isinstance`, equality checks, and custom `TypeGuard` functions."
        ], "Using `# type: ignore` without specific error codes to bypass type checking, allowing type regressions to pass CI.",
        "Configure `mypy --strict` on an existing untyped script, fix all reported type errors, and achieve zero warnings.",
        "Mandatory quality standard across all Python projects."),

        # 1.31 - 1.40: Concurrency & Testing
        ("Cooperative Multitasking vs Preemptive Threading", "Phase 0 (Lesson 0.2), Lesson 1.7", [
            "Preemptive scheduling: OS timer interrupts preempting threads at arbitrary instruction boundaries.",
            "Cooperative scheduling: tasks explicitly yielding control at await suspension points.",
            "Memory footprint comparison: 8MB thread stacks vs 1KB coroutine frame objects.",
            "Why cooperative concurrency eliminates race conditions on CPU instructions between suspension points."
        ], "Assuming cooperative async code is immune to race conditions across multiple `await` boundaries.",
        "Measure memory usage of 10,000 idle OS threads vs 10,000 idle coroutines, proving a 100x memory difference.",
        "NanoHTTP: Architectural justification in Phase 4."),

        ("Python Asyncio: Event Loop, Coroutines, & Tasks", "Lesson 1.31", [
            "The Asyncio Event Loop: polling I/O multiplexers (`epoll`) and executing ready callbacks.",
            "Coroutines: functions defined with `async def` returning un-awaited coroutine objects.",
            "Tasks: wrapping coroutines into `asyncio.Task` to schedule them concurrently on the event loop.",
            "Awaiting tasks vs executing sequentially: understanding where suspension occurs."
        ], "Calling an `async def` function without `await` or `create_task`, causing the coroutine to never execute.",
        "Build a multi-task downloader that fetches 5 URLs concurrently using `asyncio.create_task` and `asyncio.gather`.",
        "NanoHTTP and AuthForge."),

        ("Structured Concurrency with `asyncio.TaskGroup`", "Lesson 1.32", [
            "The flaws of `asyncio.gather`: orphaned tasks running in background when one task fails.",
            "Structured Concurrency (PEP 654 / Python 3.11+): `async with asyncio.TaskGroup() as tg:`.",
            "Deterministic task lifetimes: parent context guarantees all child tasks finish or cancel together.",
            "`ExceptionGroup`: handling multiple concurrent task failures simultaneously."
        ], "Leaking un-cancelled background tasks after an unhandled exception in one concurrent branch.",
        "Refactor an `asyncio.gather` workflow into `asyncio.TaskGroup` with comprehensive `ExceptionGroup` handling.",
        "AuthForge: Service-to-service concurrent requests."),

        ("Async Synchronization: Locks, Semaphores, & Queues", "Lesson 1.32", [
            "Asynchronous race conditions: critical sections interrupted by `await` yielding control.",
            "`asyncio.Lock`: mutual exclusion for asynchronous coroutines.",
            "`asyncio.Semaphore`: rate limiting concurrency (e.g., maximum 10 concurrent HTTP requests).",
            "`asyncio.Queue`: producer-consumer pipelines with backpressure handling."
        ], "Using thread synchronization primitives (`threading.Lock`) inside async code, freezing the entire event loop.",
        "Build a rate-limited web scraper that uses `asyncio.Semaphore` to cap concurrent connections to 5.",
        "AuthForge: Rate limiting infrastructure."),

        ("Cancellation, Timeouts, & Shielding Coroutines", "Lesson 1.32", [
            "Task cancellation: `task.cancel()` injecting `asyncio.CancelledError` at the next await point.",
            "Timeout management: `async with asyncio.timeout(5.0):`.",
            "Shielding critical sections: `asyncio.shield()` to prevent cancellation during database commits.",
            "Graceful task cancellation cleanup: using `try...finally` blocks inside coroutines."
        ], "Catching `BaseException` or broad `Exception` and swallowing `asyncio.CancelledError`, breaking task cancellation.",
        "Implement a worker coroutine that catches cancellation, completes in-flight database cleanup, and exits gracefully.",
        "NanoHTTP: Graceful connection draining."),

        ("Test Architecture: The Testing Pyramid & AAA Pattern", "Phase 0 (Lesson 0.5)", [
            "The Testing Pyramid: Unit Tests (fast, isolated) $\to$ Integration Tests $\to$ End-to-End (E2E) Tests.",
            "The AAA Pattern: Arrange (set up state), Act (execute code), Assert (verify outcome).",
            "Single Responsibility per test: testing one behavior per test function.",
            "Testing public contracts vs testing private implementation details."
        ], "Writing fragile tests that assert private variables, breaking on internal refactoring despite correct behavior.",
        "Structure an entire test suite strictly following the AAA pattern with clear semantic boundaries.",
        "Applied across all 22 projects."),

        ("Pytest Mastery: Fixtures, Scopes, & Dependency Injection", "Lesson 1.36", [
            "Pytest fixture architecture: dependency injection via argument names.",
            "Fixture scoping: `function`, `class`, `module`, `package`, `session`.",
            "Yield fixtures: executing setup before yield and teardown after yield.",
            "Sharing fixtures: `conftest.py` hierarchies and autouse fixtures."
        ], "Using session-scoped fixtures with mutable state, causing test pollution and non-deterministic test order failures.",
        "Build a fixture hierarchy in `conftest.py` that spins up a test database, seeds data, and rolls back after each test.",
        "Standard testing harness across all projects."),

        ("Parametrized Testing & Edge-Case Sweeps", "Lesson 1.37", [
            "Parameterization with `@pytest.mark.parametrize`: testing multiple input-output pairs cleanly.",
            "Matrix parameterization: stacking multiple parametrize decorators to test Cartesian products.",
            "Test naming and IDs: custom test IDs for clear test runner output.",
            "Systematic edge-case sweeping: null values, empty collections, zero, negative numbers, boundary values."
        ], "Writing 15 repetitive test functions for different inputs instead of a single parameterized test.",
        "Write a parameterized test suite for an email validation function covering 20 edge-case strings.",
        "DevAudit: Regex pattern test suites."),

        ("Mocking & Test Doubles: Spies, Mocks, & Anti-Patterns", "Lesson 1.36", [
            "Test Doubles taxonomy: Dummy, Stub, Spy, Mock, Fake.",
            "The `unittest.mock` library: `Mock`, `MagicMock`, `@patch`, `patch.object`.",
            "Verification: `assert_called_once_with()`, call count assertions.",
            "When mocking becomes an anti-pattern: over-mocking business logic and testing mocks instead of code."
        ], "Mocking internal database libraries so thoroughly that the test passes even when the SQL syntax is invalid.",
        "Replace an over-mocked test suite with an in-memory Fake repository that validates real business behavior.",
        "AuthForge: Testing auth flows."),

        ("Property-Based Testing with `hypothesis`", "Lesson 1.38", [
            "Fuzzing vs Property-Based Testing: generating hundreds of randomized inputs matching type strategies.",
            "The `hypothesis` framework: `@given()`, strategies (`st.integers()`, `st.text()`, `st.lists()`).",
            "Invariants and properties: idempotency ($f(f(x)) = f(x)$), round-tripping ($decode(encode(x)) == x$).",
            "Test case shrinking: hypothesis automatically reducing failing test inputs to the minimal reproducing example."
        ], "Writing unit tests only with happy-path examples, missing edge cases in Unicode, empty bytes, and integer limits.",
        "Write a property-based test with `hypothesis` for a custom JSON parser that discovers unhandled edge cases.",
        "DevAudit and MathKit."),

        # 1.41 - 1.50: TypeScript & Software Design
        ("TypeScript Architecture & Structural Type System", "Phase 0 (Lesson 0.1)", [
            "TypeScript compiler (`tsc`): parsing AST, type checking, emitting clean JavaScript.",
            "Structural Typing (Duck Typing) vs Nominal Typing: shape compatibility across independent interfaces.",
            "Primitive types: `string`, `number`, `boolean`, `bigint`, `symbol`, `null`, `undefined`.",
            "Top and bottom types: `any` (disables type checker), `unknown` (safe top type), `never` (impossible state)."
        ], "Using `any` to silence compiler warnings, disabling type safety across all downstream application code.",
        "Configure `tsconfig.json` with strict mode and explain structural compatibility of two independent interface shapes.",
        "TypeTrace: Core library engine."),

        ("Union Types, Intersection Types, & Type Narrowing", "Lesson 1.41", [
            "Union types (`A | B`): representing values that can be one of several types.",
            "Intersection types (`A & B`): combining multiple types into a unified contract.",
            "Type Narrowing techniques: `typeof`, `instanceof`, `in` operator, truthiness checks.",
            "Custom Type Guards: functions returning `val is Type` for safe runtime narrowing."
        ], "Failing to narrow union types before accessing member properties, causing compile-time errors.",
        "Write a custom User Defined Type Guard function that safely validates and narrows untyped API JSON payloads.",
        "TypeTrace: Payload narrowing."),

        ("Discriminated Unions & Exhaustive Checks with `never`", "Lesson 1.42", [
            "Tagged / Discriminated Unions: sharing a common discriminant literal property across union variants.",
            "Pattern matching with `switch` statements: narrowing state based on discriminant tags.",
            "Exhaustiveness checking: assigning the default case to a `never` variable to force compile errors on missing cases.",
            "Modeling domain state machines: modeling Success, Loading, and Error states cleanly."
        ], "Adding a new variant to a union but forgetting to handle it in a switch statement, leading to silent unhandled runtime states.",
        "Build a state machine using Discriminated Unions where unhandled transitions trigger a compile-time `never` error.",
        "TenantIQ: UI state management in Phase 6."),

        ("TypeScript Generics & Type Constraints (`extends`)", "Lesson 1.41", [
            "Generic functions and interfaces: parameterizing types with `<T>`.",
            "Type constraints: `<T extends object>`, `<T extends { id: string }>`.",
            "Default generic parameters: `<T = string>`.",
            "Using `keyof`: capturing property names of types (`<K extends keyof T>`)."
        ], "Writing overly broad generics without constraints, preventing property access inside generic function bodies.",
        "Implement a type-safe `getProp(obj, key)` utility that autocompletes valid keys and infers the exact return type.",
        "TypeTrace: Event emitter generic signatures."),

        ("Mapped Types, Key Remapping, & Standard Utility Types", "Lesson 1.44", [
            "Mapped types syntax: `[P in keyof T]: T[P]`.",
            "Key remapping with `as`: modifying or filtering keys (`[P in keyof T as `on\${Capitalize<string & P>}`]: ...`).",
            "Built-in Utility Types: `Partial<T>`, `Required<T>`, `Readonly<T>`, `Record<K, T>`, `Pick<T, K>`, `Omit<T, K>`.",
            "Homomorphic mapped types: preserving property modifiers (`readonly`, `?`)."
        ], "Misusing `Omit` with non-existent keys, silently failing to omit intended properties due to loose string typing.",
        "Implement custom versions of `Partial<T>`, `Required<T>`, and `Readonly<T>` from scratch using mapped types.",
        "TypeTrace: Event mapping types."),

        ("Conditional Types & Type Extraction with `infer`", "Lesson 1.44", [
            "Conditional types: `T extends U ? X : Y`.",
            "Distributive conditional types: how naked type parameters distribute across unions.",
            "Type extraction with `infer`: capturing types within conditional expressions.",
            "Canonical utility implementations: `ReturnType<T>`, `Parameters<T>`, `Awaited<T>`."
        ], "Distributive conditional types unexpectedly splitting union types in generic utility functions.",
        "Implement a utility type `UnwrapPromise<T>` using `infer` that recursively unwraps nested Promise types.",
        "TypeTrace: Asynchronous event payload resolution."),

        ("JavaScript Event Loop: Microtasks vs Macrotasks", "Phase 0 (Lesson 0.2), Lesson 1.31", [
            "V8 Execution model: Call Stack, Web APIs / libuv worker threads, Task Queues.",
            "Microtask Queue: `Promise.then`, `process.nextTick`, `queueMicrotask` (executed immediately after current stack).",
            "Macrotask Queue: `setTimeout`, `setInterval`, `setImmediate`, I/O callbacks.",
            "Microtask starvation: recursive microtasks freezing UI rendering and macrotask I/O."
        ], "Calling recursive `Promise.resolve().then(...)`, completely freezing the Node.js process and dropping all I/O events.",
        "Predict and verify the exact console output order of a complex script mixing `setTimeout`, `Promise`, and `async/await`.",
        "TenantIQ: Client-side event timing in Phase 6."),

        ("Promises, Async/Await Desugaring, & Error Handling", "Lesson 1.47", [
            "Promise state machine: Pending, Fulfilled, Rejected; immutability of resolved state.",
            "Async/await desugaring: syntactic sugar over generator functions yielding promises.",
            "Error propagation: unhandled promise rejections, `try/catch` with async/await.",
            "Concurrent coordination: `Promise.all()`, `Promise.allSettled()`, `Promise.race()`, `Promise.any()`."
        ], "Using `forEach` with an async callback, causing iterations to run unawaited and fire-and-forget out of order.",
        "Implement a concurrency-limited `pLimit(concurrency)` utility in TypeScript using native Promises.",
        "TypeTrace: `emitAsync` parallel handler execution."),

        ("SOLID Design Principles in Software Craftsmanship", "Lesson 1.11, 1.20", [
            "Single Responsibility Principle (SRP): one reason to change; cohesion vs coupling.",
            "Open/Closed Principle (OCP): open for extension, closed for modification via strategy injection.",
            "Liskov Substitution Principle (LSP): subtypes must be substitutable for base types without altering correctness.",
            "Interface Segregation Principle (ISP): granular role interfaces over bloated monolithic interfaces.",
            "Dependency Inversion Principle (DIP): depending on abstractions, not concretions."
        ], "Subclasses violating LSP by throwing `NotImplementedError` or changing parameter preconditions.",
        "Refactor an un-architected e-commerce checkout script to strictly satisfy all 5 SOLID principles.",
        "DevAudit: Architecture of static analyzers."),

        ("Gang of Four Patterns: Strategy, Adapter, Decorator, Repository", "Lesson 1.49", [
            "Strategy Pattern: interchangeable algorithm family encapsulated behind a common interface.",
            "Adapter Pattern: converting the interface of an external library into a client-expected interface.",
            "Decorator Pattern: dynamic behavior augmentation without inheritance.",
            "Repository Pattern: mediating between domain logic and data mapping layers; decoupling persistence.",
            "Clean Architecture / Ports and Adapters: keeping business logic independent of databases and frameworks."
        ], "Over-engineering simple scripts with unnecessary pattern abstractions ('Patternitis') when a simple function suffices.",
        "Implement a decoupled storage engine supporting Memory, File, and Redis backends using the Repository pattern.",
        "Applied across all backend and CLI projects.")
    ]

    p1_rendered = []
    for idx, (title, prereqs, subtopics, fail, verif, proj) in enumerate(p1_lessons, 1):
        p1_rendered.append(format_lesson(1, idx, title, prereqs, subtopics, fail, verif, proj))

    p0_body = "\n".join(p0_rendered)
    p1_body = "\n".join(p1_rendered)

    return f"""
---

## Phase 0: Computing & Developer Environment
**Duration**: 4 weeks
**Total Lessons**: 30 Lessons (Lesson 0.1 to Lesson 0.30)
**Builds on**: First principles of physical hardware, digital logic, and operating systems.
**Introduces**: Computer architecture, memory hierarchy, operating system boundaries, POSIX syscalls, terminal mastery, shell automation, regular expressions & automata, Git version control, source-level code reading.

---

### Phase 0 Lesson Specifications (Lessons 0.1 – 0.30)

{p0_body}

---

### Phase 0 Project: SysTrace

- **Project Type**: Systems Engineering CLI Tool
- **Language**: Pure POSIX Bash
- **Dependencies**: Standard GNU coreutils, `lsof`, `jq` (Zero external language runtimes)
- **Specification**:
  - Introspects Linux processes via `/proc` filesystem and standard utilities.
  - Input: accepts `--pid <PID>` or `--name <process_name>`.
  - Metrics collected: Resident Set Size (RSS), Virtual Memory Peak (`VmPeak`), Open File Descriptors, Established Network Sockets, User/System CPU time.
  - Output formats: Human-readable terminal dashboard and machine-readable JSON via `jq`.
  - Modes:
    - `--watch <seconds>`: sampling interval loop with live delta calculation.
    - `--diff <file1.json> <file2.json>`: compares two system snapshots and outputs memory, socket, and FD drift.
- **Quality Standard**:
  - `shellcheck` passes with zero warnings.
  - Strict exit codes: `0` (Success), `1` (Process not found), `2` (Permission denied), `3` (Invalid arguments).
  - 100% automated regression verification using Bash Automated Testing System (BATS) or fixture diffing.

---

### Phase 0 Exit Benchmark

To be certified as completing Phase 0, the engineer must execute the following challenges live without AI assistance:
- [ ] Diagram and explain every hardware and OS operation triggered when executing `python3 script.py` (shell fork, execve, ELF loading, page faults, dynamic linking, CPython runtime init).
- [ ] Run `strace` on an unfamiliar binary, identify all opened files, network sockets, and allocated memory pages from raw syscall logs.
- [ ] Write a 50-line POSIX-compliant Bash script that processes a gigabyte-scale access log, filters records using regex, aggregates metrics with `awk`, and handles interrupts via `trap`.
- [ ] Manually resolve a three-way Git merge conflict involving reordered commits using interactive rebase (`git rebase -i`).
- [ ] Explain why catastrophic backtracking occurs in NFA regex engines and rewrite a vulnerable regex pattern into a linear-time safe pattern.

---

## Phase 1: Programming Mastery
**Duration**: 13 weeks
**Total Lessons**: 60 Lessons (Lesson 1.1 to Lesson 1.60)
**Builds on**: Phase 0 (memory models, terminal, Git, regex, CPython internals)
**Introduces**: Deep Python runtime, Python type system, asyncio event loops, TypeScript type system, testing theory, SOLID design principles, GoF design patterns, clean architecture, refactoring, tree-walk interpreters.

---

### Phase 1 Lesson Specifications (Lessons 1.1 – 1.50)

{p1_body}

---

### Phase 1 Projects

#### Project 1.1 (Mandatory): LoxLang — Tree-Walk Interpreter
- **Project Type**: Programming Language Runtime
- **Language**: Python (`mypy --strict`)
- **Specification**: Complete implementation of the Lox programming language from Part II of *Crafting Interpreters* (Bob Nystrom).
- **Architecture**:
  - **Scanner / Lexer**: Converts source code into tokens; tracks line numbers, lexemes, and literal values using finite-state logic.
  - **Parser**: Recursive descent parser building an Abstract Syntax Tree (AST); implements full operator precedence, expressions, and statements.
  - **Interpreter**: Evaluates AST nodes via the Visitor pattern; supports dynamic typing, arithmetic, string concatenation, and logical operators.
  - **Environment**: Linked scopes for variable bindings; handles lexical scoping and variable shadowing.
  - **Functions & Closures**: First-class functions, user-defined callables, argument binding, and lexical closures capturing surrounding environments.
  - **Classes & Object Orientation**: Class declarations, instance instantiation, field access/assignment, method binding, `this` resolution, and single inheritance with `super`.
  - **Error Handling**: Separate compile-time syntax errors from runtime errors.
- **Quality Standard**:
  - `mypy --strict` passes with zero errors.
  - `pytest` suite with $\\ge 95\%$ line coverage.
  - Performance benchmark: computes `fib(25)` in $<5$ seconds. Published to PyPI.

#### Project 1.2 (Mini-Project): TypeTrace — Type-Safe Event Emitter
- **Project Type**: TypeScript Open Source Library
- **Language**: TypeScript (`strict: true`)
- **Specification**: A strongly typed, generic event emitter published to npm.
- **Features**:
  - Event map generics: `TypedEmitter<EventMap>` where keys are event names and values are payload types.
  - Methods: `on`, `off`, `once`, `emit`, `removeAllListeners`, `emitAsync`.
  - Compile-time error prevention: rejects invalid event names or payload shape mismatches.
- **Quality Standard**:
  - Published to npm as `@<username>/typetracer`.
  - Comprehensive unit test suite with 100% branch coverage using Vitest.

#### Project 1.3 (Enterprise Project 1): DevAudit — Codebase Static Analysis CLI
- **Project Type**: Enterprise CLI & Static Analysis Tool
- **Language**: Python
- **Specification**: Command-line tool that audits codebases for security, complexity, and maintainability issues.
- **Detectors Implemented**:
  - Cyclomatic complexity analyzer.
  - High-entropy secret and credential detector (combining regex patterns with Shannon entropy scoring).
  - Missing test file detector (mapping source files to test files).
  - Circular import detector via module dependency graph analysis.
  - Dead function and unreachable code detector.
- **Design Architecture**:
  - `DetectionStrategy` interface following OCP.
  - Pluggable formatters (Terminal with `rich`, JSON, HTML) following Adapter pattern.
  - Configuration loader (`.devaudit.yaml`).
- **Quality Standard**:
  - `mypy --strict`, `ruff` passing with zero warnings.
  - Property-based testing of Shannon entropy secret detection using `hypothesis`.
  - Performance: scans 100K lines of code in $<45$ seconds. Published to PyPI.

---

### Phase 1 Exit Benchmark

- [ ] Explain how CPython manages memory across reference counting, cyclic garbage collection, and generational thresholds.
- [ ] Implement a custom class with full dunder protocol support (`__getitem__`, `__iter__`, `__enter__`, `__exit__`) and prove proper resource cleanup under exceptions.
- [ ] Implement a recursive descent parser for an arithmetic expression grammar that constructs an AST and evaluates it.
- [ ] Write a TypeScript utility type using conditional types and `infer` to extract and transform deeply nested function signatures.
- [ ] Refactor an un-architected code sample to strictly adhere to SOLID principles and demonstrate automated testability.
"""
