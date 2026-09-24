import { ExecutionRequest, ExecutionResult } from "./types";

const DEFAULT_TIMEOUT_MS = 5000;

interface PendingExecution {
  resolve: (result: ExecutionResult) => void;
  timer: ReturnType<typeof setTimeout>;
}

interface QueuedExecution {
  request: ExecutionRequest;
  timeoutMs: number;
  resolve: (result: ExecutionResult) => void;
}

/**
 * Owns a single Python worker and guarantees:
 *
 *  1. **No cross-talk.** Exactly one execution is active at a time, and results
 *     are matched to requests by `payload.id`. Previously every `execute()` call
 *     attached its own unfiltered `message` listener against a single shared
 *     `watchdogTimer`, so two concurrent runs resolved each other's promises and
 *     the second watchdog killed the worker serving the first.
 *  2. **Per-request watchdogs.** Each request owns its timer; a timeout only
 *     affects its own request.
 *  3. **Serialized queueing.** Concurrent callers are queued, not raced.
 */
class SandboxController {
  private worker: Worker | null = null;
  private workerListenersAttached = false;
  private readonly pending = new Map<string, PendingExecution>();
  private readonly queue: QueuedExecution[] = [];
  private activeId: string | null = null;

  private readonly handleMessage = (e: MessageEvent) => {
    const data = e.data || {};
    if (data.type !== "EXECUTION_COMPLETE") return;

    const payload = data.payload as ExecutionResult | undefined;
    if (!payload || typeof payload.id !== "string") return;

    // Ignore late results from an execution that has already been resolved.
    if (!this.pending.has(payload.id)) return;

    this.settle(payload.id, payload);
  };

  private readonly handleWorkerError = () => {
    // The worker is dead: fail everything in flight rather than hanging forever.
    this.failAll(
      "Python sandbox worker crashed before returning a result.",
      "FAILED"
    );
    this.disposeWorker();
  };

  private initWorker(): Worker {
    if (typeof window === "undefined") {
      throw new Error("Sandbox cannot be initialized on server side");
    }
    if (this.worker) {
      return this.worker;
    }

    const worker = new Worker("/workers/python-worker.js");
    worker.addEventListener("message", this.handleMessage);
    worker.addEventListener("error", this.handleWorkerError);
    this.worker = worker;
    this.workerListenersAttached = true;
    return worker;
  }

  private disposeWorker(): void {
    if (this.worker && this.workerListenersAttached) {
      this.worker.removeEventListener("message", this.handleMessage);
      this.worker.removeEventListener("error", this.handleWorkerError);
    }
    this.workerListenersAttached = false;
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }

  private settle(id: string, result: ExecutionResult): void {
    const pending = this.pending.get(id);
    if (!pending) return;
    this.pending.delete(id);
    clearTimeout(pending.timer);
    if (this.activeId === id) {
      this.activeId = null;
    }
    pending.resolve(result);
    this.drain();
  }

  private failAll(message: string, status: ExecutionResult["status"]): void {
    const entries = Array.from(this.pending.entries());
    this.pending.clear();
    this.activeId = null;
    for (const [id, pending] of entries) {
      clearTimeout(pending.timer);
      pending.resolve({
        id,
        status,
        output: "",
        errorMessage: message,
        executionDurationMs: 0,
      });
    }
  }

  /** Dispatches the next queued request once nothing else is running. */
  private drain(): void {
    if (this.activeId || this.queue.length === 0) return;

    const next = this.queue.shift();
    if (!next) return;

    let worker: Worker;
    try {
      worker = this.initWorker();
    } catch (err: any) {
      next.resolve({
        id: next.request.id,
        status: "FAILED",
        output: "",
        errorMessage: err?.message || "Failed to initialize worker",
        executionDurationMs: 0,
      });
      this.drain();
      return;
    }

    this.activeId = next.request.id;

    const timer = setTimeout(() => {
      // Only this request is affected. The worker is recycled because Pyodide
      // state cannot be trusted after an interrupted run.
      this.settle(next.request.id, {
        id: next.request.id,
        status: "TIMEOUT",
        output: "",
        errorMessage: `Execution exceeded the ${next.timeoutMs}ms watchdog limit and was killed to prevent a browser freeze.`,
        executionDurationMs: next.timeoutMs,
      });
      this.disposeWorker();
      this.failAll(
        "Sandbox was recycled after a watchdog timeout; please re-run.",
        "FAILED"
      );
    }, next.timeoutMs);

    this.pending.set(next.request.id, { resolve: next.resolve, timer });

    try {
      worker.postMessage({ type: "EXECUTE", payload: next.request });
    } catch (err: any) {
      this.settle(next.request.id, {
        id: next.request.id,
        status: "FAILED",
        output: "",
        errorMessage: err?.message || "Failed to post message to the worker.",
        executionDurationMs: 0,
      });
    }
  }

  public execute(request: ExecutionRequest): Promise<ExecutionResult> {
    if (typeof window === "undefined") {
      return Promise.resolve({
        id: request.id,
        status: "FAILED",
        output: "",
        errorMessage: "Cannot execute on server side",
        executionDurationMs: 0,
      });
    }

    return new Promise<ExecutionResult>((resolve) => {
      this.queue.push({
        request,
        timeoutMs: request.timeoutMs || DEFAULT_TIMEOUT_MS,
        resolve,
      });
      this.drain();
    });
  }

  public terminate(): void {
    this.queue.length = 0;
    this.failAll("Sandbox terminated by the caller.", "FAILED");
    this.disposeWorker();
  }
}

let controllerInstance: SandboxController | null = null;

export function getSandboxController(): SandboxController {
  if (!controllerInstance) {
    controllerInstance = new SandboxController();
  }
  return controllerInstance;
}
