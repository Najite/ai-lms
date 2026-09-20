import { ExecutionRequest, ExecutionResult } from "./types";

class SandboxController {
  private worker: Worker | null = null;
  private currentReject: ((reason?: any) => void) | null = null;
  private watchdogTimer: ReturnType<typeof setTimeout> | null = null;

  private initWorker(): Worker {
    if (typeof window === "undefined") {
      throw new Error("Sandbox cannot be initialized on server side");
    }

    if (this.worker) {
      return this.worker;
    }

    this.worker = new Worker("/workers/python-worker.js");
    return this.worker;
  }

  public async execute(request: ExecutionRequest): Promise<ExecutionResult> {
    if (typeof window === "undefined") {
      return {
        id: request.id,
        status: "FAILED",
        output: "",
        errorMessage: "Cannot execute on server side",
        executionDurationMs: 0,
      };
    }

    const timeout = request.timeoutMs || 5000;

    return new Promise((resolve) => {
      try {
        const worker = this.initWorker();

        // Setup 5,000ms watchdog timer
        this.watchdogTimer = setTimeout(() => {
          if (this.worker) {
            this.worker.terminate();
            this.worker = null;
          }
          resolve({
            id: request.id,
            status: "TIMEOUT",
            output: "Watchdog timer exceeded 5,000ms limit.",
            errorMessage: "Execution timed out and was killed to prevent browser freeze.",
            executionDurationMs: timeout,
          });
        }, timeout);

        const messageHandler = (e: MessageEvent) => {
          const { type, payload } = e.data;
          if (type === "EXECUTION_COMPLETE") {
            if (this.watchdogTimer) {
              clearTimeout(this.watchdogTimer);
              this.watchdogTimer = null;
            }
            worker.removeEventListener("message", messageHandler);
            resolve(payload as ExecutionResult);
          }
        };

        worker.addEventListener("message", messageHandler);

        worker.postMessage({
          type: "EXECUTE",
          payload: request,
        });
      } catch (err: any) {
        if (this.watchdogTimer) {
          clearTimeout(this.watchdogTimer);
          this.watchdogTimer = null;
        }
        resolve({
          id: request.id,
          status: "FAILED",
          output: "",
          errorMessage: err.message || "Failed to initialize worker",
          executionDurationMs: 0,
        });
      }
    });
  }

  public terminate(): void {
    if (this.watchdogTimer) {
      clearTimeout(this.watchdogTimer);
      this.watchdogTimer = null;
    }
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

let controllerInstance: SandboxController | null = null;

export function getSandboxController(): SandboxController {
  if (!controllerInstance) {
    controllerInstance = new SandboxController();
  }
  return controllerInstance;
}
