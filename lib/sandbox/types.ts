export type SupportedLanguage = "python" | "javascript";

export interface ExecutionRequest {
  id: string;
  language: SupportedLanguage;
  code: string;
  testAssertions?: string;
  timeoutMs?: number;
}

export type ExecutionStatus =
  | "IDLE"
  | "RUNNING"
  | "SUCCESS"
  | "FAILED"
  | "TIMEOUT"
  | "SECURITY_VIOLATION"
  /** The runtime could not execute the code (offline / Pyodide unavailable).
   *  Callers MUST NOT treat this as a pass. */
  | "UNVERIFIED";

export interface ExecutionResult {
  id: string;
  status: ExecutionStatus;
  output: string;
  errorMessage?: string;
  executionDurationMs: number;
  assertionsPassed?: number;
  totalAssertions?: number;
  /** Which engine actually produced this result. */
  runtime?: "pyodide" | "unavailable";
}

export interface WorkerInMessage {
  type: "EXECUTE";
  payload: ExecutionRequest;
}

export interface WorkerOutMessage {
  type: "EXECUTION_COMPLETE" | "READY" | "LOG" | "RUNTIME_UNAVAILABLE";
  payload: ExecutionResult | { message: string };
}
