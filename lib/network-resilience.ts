"use client";

/**
 * Enterprise Network Resilience Engine
 * Features:
 * - Exponential backoff with full jitter
 * - Timeout handling
 * - Network speed / 2G / offline quality detection
 */

export interface RetryOptions {
  maxRetries?: number;
  baseDelayMs?: number;
  maxDelayMs?: number;
  timeoutMs?: number;
}

export type RetryOperation<T> = (attempt: number, signal: AbortSignal) => Promise<T>;

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelayMs: 800,
  maxDelayMs: 4000,
  timeoutMs: 8000,
};

/**
 * Sleep helper for backoff
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute an async operation with exponential backoff and jitter.
 * Prevents thundering herds and recovers gracefully from 2G packet loss.
 */
export async function withExponentialBackoff<T>(
  fn: RetryOperation<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries, baseDelayMs, maxDelayMs, timeoutMs } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  };

  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;
    try {
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => {
          controller.abort();
          reject(new Error(`Operation timed out after ${timeoutMs}ms (Attempt ${attempt}/${maxRetries})`));
        }, timeoutMs);
      });

      return await Promise.race([fn(attempt, controller.signal), timeoutPromise]);
    } catch (err: any) {
      lastError = err;

      // Don't sleep after the final failed attempt
      if (attempt < maxRetries) {
        // Full jitter formula: random between 0 and min(maxDelay, baseDelay * 2^(attempt-1))
        const exponentialDelay = Math.min(maxDelayMs, baseDelayMs * Math.pow(2, attempt - 1));
        const jitteredDelay = Math.floor(Math.random() * exponentialDelay);
        await sleep(jitteredDelay);
      }
    } finally {
      if (timeoutHandle) clearTimeout(timeoutHandle);
      controller.abort();
    }
  }

  throw lastError;
}

/**
 * Detects if the user is on a low-bandwidth (2G/3G or Data-Saver) connection
 */
export function isSlowNetwork(): boolean {
  if (typeof window === "undefined" || !navigator) return false;
  if (!navigator.onLine) return true;

  const conn = (navigator as any).connection;
  if (!conn) return false;

  return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g" || conn.saveData === true;
}

/**
 * Check if the browser is currently online
 */
export function isOnline(): boolean {
  if (typeof window === "undefined" || !navigator) return true;
  return navigator.onLine;
}
