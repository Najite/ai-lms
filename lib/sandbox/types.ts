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
  | "SECURITY_VIOLATION";

export interface ExecutionResult {
  id: string;
  status: ExecutionStatus;
  output: string;
  errorMessage?: string;
  executionDurationMs: number;
  assertionsPassed?: number;
  totalAssertions?: number;
}

export interface WorkerInMessage {
  type: "EXECUTE";
  payload: ExecutionRequest;
}

export interface WorkerOutMessage {
  type: "EXECUTION_COMPLETE" | "READY" | "LOG";
  payload: ExecutionResult | { message: string };
}
