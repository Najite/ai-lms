export type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

const LOG_LEVEL_WEIGHTS: Record<LogLevel, number> = {
  trace: 10,
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  fatal: 60,
};

export interface LogContext {
  userId?: string;
  traceId?: string;
  path?: string;
  component?: string;
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
    details?: unknown;
  };
}

class Logger {
  private currentLogLevel: LogLevel = "info";

  constructor() {
    const envLevel = process.env.LOG_LEVEL as LogLevel | undefined;
    if (envLevel && LOG_LEVEL_WEIGHTS[envLevel] !== undefined) {
      this.currentLogLevel = envLevel;
    } else if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      this.currentLogLevel = "debug";
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVEL_WEIGHTS[level] >= LOG_LEVEL_WEIGHTS[this.currentLogLevel];
  }

  private emit(level: LogLevel, message: string, context?: LogContext, err?: unknown): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    };

    if (err instanceof Error) {
      entry.error = {
        name: err.name,
        message: err.message,
        stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
      };
      if ("details" in err) {
        entry.error.details = (err as { details?: unknown }).details;
      }
    } else if (err) {
      entry.error = {
        name: "UnknownError",
        message: String(err),
      };
    }

    if (process.env.NODE_ENV === "production") {
      // Production: structured JSON to stdout/stderr
      const output = JSON.stringify(entry);
      if (level === "error" || level === "fatal") {
        console.error(output);
      } else if (level === "warn") {
        console.warn(output);
      } else {
        console.log(output);
      }
    } else {
      // Development: clean color-formatted terminal output
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
      if (level === "error" || level === "fatal") {
        console.error(prefix, message, context || "", err || "");
      } else if (level === "warn") {
        console.warn(prefix, message, context || "");
      } else {
        console.log(prefix, message, context || "");
      }
    }
  }

  public trace(message: string, context?: LogContext): void {
    this.emit("trace", message, context);
  }

  public debug(message: string, context?: LogContext): void {
    this.emit("debug", message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.emit("info", message, context);
  }

  public warn(message: string, context?: LogContext, err?: unknown): void {
    this.emit("warn", message, context, err);
  }

  public error(message: string, err?: unknown, context?: LogContext): void {
    this.emit("error", message, context, err);
  }

  public fatal(message: string, err?: unknown, context?: LogContext): void {
    this.emit("fatal", message, context, err);
  }
}

export const logger = new Logger();
