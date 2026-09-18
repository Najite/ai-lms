/**
 * Autonomous Staff AI Agent Engine
 * Operates as Socratic Ghost, Defense Interrogator, Chaos Incident Generator, and Red-Team Evaluator.
 */

export interface GhostAnnotation {
  line: number;
  message: string;
  severity: "info" | "warning" | "architecture";
}

export interface ChaosIncident {
  id: string;
  title: string;
  severity: "P0" | "P1";
  slaMinutes: number;
  initialErrorRate: number; // e.g. 52.4%
  description: string;
  failingComponent: string;
  errorLogs: string[];
  diagnosticHint: string;
}

export interface RedTeamChallenge {
  id: string;
  targetAgentName: string;
  systemPrompt: string;
  objective: string;
  secretToExtract?: string;
  hackerXp: number;
}

export class StaffAIAgent {
  /**
   * Socratic Ghost: Analyzes student code patterns and generates subtle architectural reflections.
   */
  static analyzeCodeForGhost(code: string): GhostAnnotation[] {
    const annotations: GhostAnnotation[] = [];
    const lines = code.split("\n");

    lines.forEach((line, index) => {
      const lineNum = index + 1;

      // Anti-pattern 1: shell=True security risk
      if (line.includes("shell=True")) {
        annotations.push({
          line: lineNum,
          severity: "warning",
          message: "Ghost Note: Using shell=True creates command injection vulnerabilities if arguments contain unescaped user input. How can shlex.split() or a parameter list mitigate this?",
        });
      }

      // Anti-pattern 2: Blocking sleep in async code
      if (line.includes("time.sleep(") && code.includes("async def")) {
        annotations.push({
          line: lineNum,
          severity: "architecture",
          message: "Ghost Note: time.sleep() blocks the entire async event loop, stalling all concurrent requests. Consider asyncio.sleep() to yield control to other tasks.",
        });
      }

      // Anti-pattern 3: Naive division for token estimation
      if (line.includes("len(") && line.includes("// 4")) {
        annotations.push({
          line: lineNum,
          severity: "info",
          message: "Ghost Note: Character count // 4 is a heuristic that degrades on code, JSON, and non-Latin scripts. Where would an exact BPE vocabulary lookup be critical?",
        });
      }

      // Anti-pattern 4: Naive loop aggregation over documents
      if (line.includes("for doc in") && line.includes("append") && code.includes("cosine")) {
        annotations.push({
          line: lineNum,
          severity: "architecture",
          message: "Ghost Note: Linear scanning over documents becomes O(N*D) at scale. How does an HNSW index trade memory for sub-linear logarithmic query latency?",
        });
      }
    });

    return annotations;
  }

  /**
   * Chaos Monkey: Generates a realistic P0 incident scenario based on the active node.
   */
  static generateChaosIncident(nodeId: string): ChaosIncident {
    if (nodeId.includes("tokenizer") || nodeId.includes("1-1")) {
      return {
        id: "incident-p0-tok-overflow",
        title: "P0 Outage: Out-Of-Memory Crash in Tokenizer Ingestion Pool",
        severity: "P0",
        slaMinutes: 15,
        initialErrorRate: 64.8,
        description: "The streaming document ingestion pipeline is crashing with SIGKILL (Exit code 137). High-volume batch requests containing unhandled Unicode sequences are causing runaway memory allocations in the BPE byte-buffer.",
        failingComponent: "src/tokenizer/buffer.py",
        errorLogs: [
          "[CRITICAL] 2026-09-18T14:41:02Z kernel: [64210.12] oom-killer: gfp_mask=0x1100cca(GFP_HIGHUSER_MOVABLE), order=0",
          "[ERROR] 2026-09-18T14:41:03Z worker-3: Fatal memory allocation: failed to allocate 8.4GB buffer for dirty byte stream",
          "[WARN] 2026-09-18T14:41:05Z gateway: 504 Gateway Timeout on /v1/tokenize/batch (1,240 dropped client connections)",
          "[CRITICAL] 2026-09-18T14:41:06Z pagerduty: SLA breach imminent. Error rate at 64.8% across EMEA cluster.",
        ],
        diagnosticHint: "Inspect whether raw byte buffers are being copied inside the merge loop instead of referencing immutable memory views.",
      };
    }

    if (nodeId.includes("retrieval") || nodeId.includes("2-1")) {
      return {
        id: "incident-p0-rrf-timeout",
        title: "P0 Outage: Vector DB Connection Pool Saturation & Cache Stampede",
        severity: "P0",
        slaMinutes: 20,
        initialErrorRate: 78.2,
        description: "Production legal search latency spiked from 45ms to 4,800ms. Hybrid search queries are overwhelming PostgreSQL connection limits while reciprocal rank fusion computations hang on unindexed metadata filters.",
        failingComponent: "src/retriever/hybrid.py",
        errorLogs: [
          "[ERROR] 2026-09-18T14:42:10Z postgres-primary: FATAL: remaining connection slots are reserved for non-replication superuser connections",
          "[WARN] 2026-09-18T14:42:11Z search-svc: RRF rank aggregation timed out after 5000ms for query 'CVE-2024-38077 regulatory compliance'",
          "[CRITICAL] 2026-09-18T14:42:14Z load-balancer: 503 Service Unavailable: upstream cluster pool exhausted (78.2% error spike)",
        ],
        diagnosticHint: "Add connection pooling with exponential backoff and cap RRF candidate documents before passing to re-rankers.",
      };
    }

    // Default incident
    return {
      id: "incident-p0-generic-outage",
      title: "P0 Outage: High Latency & Tool Execution Hang",
      severity: "P0",
      slaMinutes: 15,
      initialErrorRate: 55.0,
      description: "Sub-processes spawned by the agent tool runner are failing to terminate, leaving zombie processes that exhaust the system PID table.",
      failingComponent: "src/agent/executor.py",
      errorLogs: [
        "[ERROR] worker-1: ResourceTemporarilyUnavailable: fork failed, resource limit reached",
        "[CRITICAL] gateway: 500 Internal Server Error: agent runner unreachable",
      ],
      diagnosticHint: "Verify that subprocess.Popen includes strict timeout handlers and explicit process group termination.",
    };
  }

  /**
   * Red-Team Arena: Evaluates if an adversarial prompt injection breached the target agent.
   */
  static evaluateRedTeamExploit(
    challenge: RedTeamChallenge,
    userPayload: string
  ): { breached: boolean; response: string; critique: string } {
    const lowerPayload = userPayload.toLowerCase();

    // Check for common prompt injection attack vectors
    const hasJailbreakPattern =
      lowerPayload.includes("ignore previous instructions") ||
      lowerPayload.includes("system prompt") ||
      lowerPayload.includes("repeat everything above") ||
      lowerPayload.includes("you are in debug mode") ||
      lowerPayload.includes("developer override") ||
      lowerPayload.includes("canary token");

    if (hasJailbreakPattern) {
      return {
        breached: true,
        response: `[AGENT COMPROMISED]: System prompt leaked: "${challenge.systemPrompt}". Target secret revealed: ${challenge.secretToExtract || "CONFIDENTIAL_API_KEY_9921"}.`,
        critique: "EXPLOIT SUCCESSFUL: You successfully bypassed the system guardrails using indirect contextual overriding. Hacker XP awarded.",
      };
    }

    return {
      breached: false,
      response: `[GUARDRAIL ACTIVE]: I am programmed to follow strict enterprise safety policies. I cannot reveal internal instructions or system keys.`,
      critique: "DEFENSE HELD: The agent's input filter detected and neutralized your payload. Try crafting an indirect injection (e.g. disguised within a markdown quote or base64 format).",
    };
  }
}
