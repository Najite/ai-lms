"use client";

import * as React from "react";
import { supabase } from "./supabase";

export interface CapstoneSubmissionState {
  capstoneId: string;
  repoUrl: string;
  verifiedAt: string;
  score: number;
}

export type NetworkStatus = "online" | "slow-2g" | "offline";

export interface PendingSyncItem {
  id: string;
  type: "LESSON_COMPLETED" | "EXERCISE_COMPLETED" | "CAPSTONE_VERIFIED";
  lessonId?: string;
  savedCode?: string;
  exerciseId?: string;
  capstoneId?: string;
  repoUrl?: string;
  score?: number;
  timestamp: string;
  retries: number;
}

export interface AppProgressState {
  completedLessons: string[];
  completedExercises: string[];
  verifiedCapstones: Record<string, CapstoneSubmissionState>;
  lastActiveLessonId: string;
  activityLog: Record<string, number>;
  networkStatus: NetworkStatus;
  pendingSyncQueue: PendingSyncItem[];
}

const STORAGE_KEYS = {
  COMPLETED_LESSONS: "ai_lms_completed_lessons",
  COMPLETED_EXERCISES: "ai_lms_completed_exercises",
  VERIFIED_CAPSTONES: "ai_lms_verified_capstones",
  LAST_ACTIVE_LESSON: "ai_lms_last_active_lesson",
  ACTIVITY_LOG: "ai_lms_activity_log",
  PENDING_SYNC: "ai_lms_pending_sync_queue",
} as const;

let activeUserId: string | null = null;

function scopedStorageKey(key: string): string {
  return `ai_lms:${activeUserId ?? "anonymous"}:${key}`;
}

const DEFAULT_LESSON_ID = "node-0-1";

/** Hard ceiling on the durable offline queue so localStorage cannot blow its ~5MB quota. */
const MAX_PENDING_SYNC_ITEMS = 200;
/** After this many failed flushes an item is dropped, so the queue cannot grow forever. */
const MAX_SYNC_RETRIES = 5;

function safeGetStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Failed to parse localStorage key "${key}"`, err);
    return fallback;
  }
}

/**
 * @returns true when the value was persisted. Quota failures are reported rather
 *          than swallowed, because silence here means lost learner progress.
 */
function safeSetStorage(key: string, value: unknown): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to persist localStorage key "${key}"`, err);
    return false;
  }
}

function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

/** Single owner of the activity log: additive-only, never synthesised from other state. */
function bumpActivity(
  log: Record<string, number>,
  delta: number
): Record<string, number> {
  if (delta <= 0) return log;
  const key = todayKey();
  return { ...log, [key]: (log[key] || 0) + delta };
}

/** Identity of a queue entry, used for de-duplication. One entry per target. */
function syncKeyOf(item: PendingSyncItem): string {
  const target = item.lessonId || item.exerciseId || item.capstoneId || item.id;
  return `${item.type}:${target}`;
}

let currentState: AppProgressState = {
  completedLessons: [],
  completedExercises: [],
  verifiedCapstones: {},
  lastActiveLessonId: DEFAULT_LESSON_ID,
  activityLog: {},
  networkStatus: "online",
  pendingSyncQueue: [],
};

function hydrateStateForUser(userId: string | null): void {
  activeUserId = userId;
  if (typeof window === "undefined") return;

  const compLessons = safeGetStorage<string[]>(scopedStorageKey(STORAGE_KEYS.COMPLETED_LESSONS), []);
  const compExercises = safeGetStorage<string[]>(scopedStorageKey(STORAGE_KEYS.COMPLETED_EXERCISES), []);
  const capstones = safeGetStorage<Record<string, CapstoneSubmissionState>>(
    scopedStorageKey(STORAGE_KEYS.VERIFIED_CAPSTONES),
    {}
  );
  const lastActive = localStorage.getItem(scopedStorageKey(STORAGE_KEYS.LAST_ACTIVE_LESSON)) || DEFAULT_LESSON_ID;
  const activity = safeGetStorage<Record<string, number>>(scopedStorageKey(STORAGE_KEYS.ACTIVITY_LOG), {});
  const syncQueue = safeGetStorage<PendingSyncItem[]>(scopedStorageKey(STORAGE_KEYS.PENDING_SYNC), []);
  let netStatus: NetworkStatus = "online";
  if (!navigator.onLine) {
    netStatus = "offline";
  } else if (
    (navigator as any).connection?.effectiveType === "2g" ||
    (navigator as any).connection?.saveData
  ) {
    netStatus = "slow-2g";
  }

  currentState = {
    completedLessons: Array.isArray(compLessons) ? compLessons : [],
    completedExercises: Array.isArray(compExercises) ? compExercises : [],
    verifiedCapstones:
      typeof capstones === "object" && capstones !== null ? capstones : {},
    lastActiveLessonId: lastActive,
    activityLog: typeof activity === "object" && activity !== null ? activity : {},
    networkStatus: netStatus,
    pendingSyncQueue: Array.isArray(syncQueue)
      ? syncQueue.slice(-MAX_PENDING_SYNC_ITEMS)
      : [],
  };
  notifyListeners();
}

if (typeof window !== "undefined") {
  void supabase.auth.getSession().then(({ data }) => {
    hydrateStateForUser(data.session?.user?.id ?? null);
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    hydrateStateForUser(session?.user?.id ?? null);
  });
}

const listeners = new Set<() => void>();

function notifyListeners(): void {
  listeners.forEach((listener) => {
    listener();
  });
}

/**
 * The server snapshot MUST be referentially stable. The previous revision built a
 * fresh object literal on every call, so selectors that allocate (e.g.
 * `s => s.completedLessons`) appeared to change on every render and defeated
 * `useSyncExternalStore`'s change detection during hydration.
 */
const SERVER_COMPLETED_LESSONS: string[] = [];
const SERVER_COMPLETED_EXERCISES: string[] = [];
const SERVER_VERIFIED_CAPSTONES: Record<string, CapstoneSubmissionState> = {};
const SERVER_ACTIVITY_LOG: Record<string, number> = {};
const SERVER_PENDING_SYNC: PendingSyncItem[] = [];

const SERVER_SNAPSHOT: AppProgressState = Object.freeze({
  completedLessons: SERVER_COMPLETED_LESSONS,
  completedExercises: SERVER_COMPLETED_EXERCISES,
  verifiedCapstones: SERVER_VERIFIED_CAPSTONES,
  lastActiveLessonId: DEFAULT_LESSON_ID,
  activityLog: SERVER_ACTIVITY_LOG,
  networkStatus: "online" as NetworkStatus,
  pendingSyncQueue: SERVER_PENDING_SYNC,
});

function resolveNetworkStatus(): NetworkStatus {
  if (!navigator.onLine) return "offline";
  const connection = (navigator as any).connection;
  if (
    connection?.effectiveType === "2g" ||
    connection?.effectiveType === "slow-2g" ||
    connection?.saveData
  ) {
    return "slow-2g";
  }
  return "online";
}

function updateNetworkStatus(status: NetworkStatus): void {
  if (currentState.networkStatus !== status) {
    currentState = { ...currentState, networkStatus: status };
    notifyListeners();
  }
}

/** Replaces the durable queue and mirrors it to storage + subscribers. */
function replacePendingQueue(queue: PendingSyncItem[]): void {
  const capped =
    queue.length > MAX_PENDING_SYNC_ITEMS ? queue.slice(-MAX_PENDING_SYNC_ITEMS) : queue;
  currentState = { ...currentState, pendingSyncQueue: capped };
  safeSetStorage(scopedStorageKey(STORAGE_KEYS.PENDING_SYNC), capped);
  notifyListeners();
}

/**
 * Atomic enqueue: de-duplicates by target so repeatedly failing the same lesson
 * cannot grow the queue without bound, then trims the oldest entries.
 */
function enqueuePendingSync(item: PendingSyncItem): void {
  if (typeof window === "undefined") return;
  const key = syncKeyOf(item);
  const withoutDuplicate = currentState.pendingSyncQueue.filter(
    (existing) => syncKeyOf(existing) !== key
  );
  replacePendingQueue([...withoutDuplicate, item]);
}

function retryPendingQueue(): void {
  const survivors: PendingSyncItem[] = [];
  for (const item of currentState.pendingSyncQueue) {
    const next = { ...item, retries: item.retries + 1 };
    if (next.retries < MAX_SYNC_RETRIES) {
      survivors.push(next);
    } else {
      console.warn(
        `Dropping sync item ${syncKeyOf(item)} after ${MAX_SYNC_RETRIES} failed attempts.`
      );
    }
  }
  replacePendingQueue(survivors);
}

/**
 * Applies a cross-tab `storage` event. Now covers ACTIVITY_LOG and PENDING_SYNC
 * too — previously those two keys were ignored, so tabs silently diverged on
 * exactly the state that carries correctness.
 */
function applyStorageEvent(event: StorageEvent): void {
  if (!event.key || event.newValue === null) return;
  try {
    switch (event.key) {
      case scopedStorageKey(STORAGE_KEYS.COMPLETED_LESSONS):
        currentState = { ...currentState, completedLessons: JSON.parse(event.newValue) };
        break;
      case scopedStorageKey(STORAGE_KEYS.COMPLETED_EXERCISES):
        currentState = { ...currentState, completedExercises: JSON.parse(event.newValue) };
        break;
      case scopedStorageKey(STORAGE_KEYS.VERIFIED_CAPSTONES):
        currentState = { ...currentState, verifiedCapstones: JSON.parse(event.newValue) };
        break;
      case scopedStorageKey(STORAGE_KEYS.ACTIVITY_LOG):
        currentState = { ...currentState, activityLog: JSON.parse(event.newValue) };
        break;
      case scopedStorageKey(STORAGE_KEYS.PENDING_SYNC):
        currentState = { ...currentState, pendingSyncQueue: JSON.parse(event.newValue) };
        break;
      case scopedStorageKey(STORAGE_KEYS.LAST_ACTIVE_LESSON):
        currentState = { ...currentState, lastActiveLessonId: event.newValue };
        break;
      default:
        return;
    }
    notifyListeners();
  } catch (err) {
    console.warn(`Ignoring malformed storage event for key "${event.key}"`, err);
  }
}

interface BrowserListenerHandles {
  storage: (event: StorageEvent) => void;
  online: () => void;
  offline: () => void;
  connectionChange: () => void;
  visibilityChange: () => void;
  pageHide: () => void;
  connection?: any;
}

const HANDLES_KEY = "__aiLmsStoreListenerHandles";

function detachBrowserListeners(handles: BrowserListenerHandles): void {
  window.removeEventListener("storage", handles.storage);
  window.removeEventListener("online", handles.online);
  window.removeEventListener("offline", handles.offline);
  window.removeEventListener("pagehide", handles.pageHide);
  document.removeEventListener("visibilitychange", handles.visibilityChange);
  handles.connection?.removeEventListener("change", handles.connectionChange);
}

/**
 * Idempotent listener registration. Handles are parked on `window` so a Fast
 * Refresh re-evaluation detaches the previous generation instead of stacking a
 * second set of listeners onto the same events.
 */
function attachBrowserListeners(): void {
  if (typeof window === "undefined") return;

  const store = window as any;
  const previous = store[HANDLES_KEY] as BrowserListenerHandles | undefined;
  if (previous) {
    detachBrowserListeners(previous);
  }

  const handles: BrowserListenerHandles = {
    storage: applyStorageEvent,
    online: () => {
      updateNetworkStatus(resolveNetworkStatus());
      void flushSyncQueue();
    },
    offline: () => {
      updateNetworkStatus("offline");
    },
    connectionChange: () => {
      updateNetworkStatus(resolveNetworkStatus());
    },
    visibilityChange: () => {
      if (document.visibilityState === "hidden") {
        void flushSyncQueue();
      }
    },
    pageHide: () => {
      void flushSyncQueue();
    },
  };

  const connection = (navigator as any).connection;
  if (connection) {
    handles.connection = connection;
  }

  store[HANDLES_KEY] = handles;

  window.addEventListener("storage", handles.storage);
  window.addEventListener("online", handles.online);
  window.addEventListener("offline", handles.offline);
  window.addEventListener("pagehide", handles.pageHide);
  document.addEventListener("visibilitychange", handles.visibilityChange);
  handles.connection?.addEventListener("change", handles.connectionChange);
}

/**
 * React 18 useSyncExternalStore subscription.
 */
export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): AppProgressState {
  return currentState;
}

export function getServerSnapshot(): AppProgressState {
  return SERVER_SNAPSHOT;
}

/**
 * Universal reactive hook built on useSyncExternalStore.
 */
export function useAppStore<T>(selector: (state: AppProgressState) => T): T {
  return React.useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getServerSnapshot())
  );
}

// ---------------------------------------------------------------------------
// Transactional mutators
// ---------------------------------------------------------------------------

export function markLessonCompleted(
  lessonId: string,
  savedCode?: string
): { success: boolean; completedLessons: string[]; isNewlyCompleted: boolean } {
  if (!lessonId) {
    return {
      success: false,
      completedLessons: currentState.completedLessons,
      isNewlyCompleted: false,
    };
  }

  const set = new Set(currentState.completedLessons);
  const wasAlreadyCompleted = set.has(lessonId);
  set.add(lessonId);
  const updatedList = Array.from(set);
  const updatedActivity = bumpActivity(
    currentState.activityLog,
    wasAlreadyCompleted ? 0 : 1
  );

  currentState = {
    ...currentState,
    completedLessons: updatedList,
    activityLog: updatedActivity,
  };

  const lessonsPersisted = safeSetStorage(scopedStorageKey(STORAGE_KEYS.COMPLETED_LESSONS), updatedList);
  safeSetStorage(scopedStorageKey(STORAGE_KEYS.ACTIVITY_LOG), updatedActivity);
  notifyListeners();

  void queueOrSyncProgress({
    id: `sync-lesson-${lessonId}-${Date.now()}`,
    type: "LESSON_COMPLETED",
    lessonId,
    savedCode,
    timestamp: new Date().toISOString(),
    retries: 0,
  });

  // `success` now reflects whether the write actually reached localStorage,
  // instead of being hardcoded to true during a quota failure.
  return { success: lessonsPersisted, completedLessons: updatedList, isNewlyCompleted: !wasAlreadyCompleted };
}

export function markExerciseCompleted(
  exerciseId: string
): { success: boolean; completedExercises: string[] } {
  if (!exerciseId) {
    return { success: false, completedExercises: currentState.completedExercises };
  }

  const set = new Set(currentState.completedExercises);
  const wasAlreadyCompleted = set.has(exerciseId);
  set.add(exerciseId);
  const updatedList = Array.from(set);
  const updatedActivity = bumpActivity(
    currentState.activityLog,
    wasAlreadyCompleted ? 0 : 1
  );

  currentState = {
    ...currentState,
    completedExercises: updatedList,
    activityLog: updatedActivity,
  };

  const persisted = safeSetStorage(scopedStorageKey(STORAGE_KEYS.COMPLETED_EXERCISES), updatedList);
  safeSetStorage(scopedStorageKey(STORAGE_KEYS.ACTIVITY_LOG), updatedActivity);
  notifyListeners();

  return { success: persisted, completedExercises: updatedList };
}

export function setLastActiveLessonId(lessonId: string): void {
  if (!lessonId || currentState.lastActiveLessonId === lessonId) return;

  currentState = {
    ...currentState,
    lastActiveLessonId: lessonId,
  };

  // Stored as a raw string; goes through the safe writer so a quota failure is
  // reported rather than thrown into an empty catch block.
  safeSetStorage(scopedStorageKey(STORAGE_KEYS.LAST_ACTIVE_LESSON), lessonId);
  notifyListeners();
}

export function saveVerifiedCapstone(
  capstoneId: string,
  repoUrl: string,
  score: number = 100
): Record<string, CapstoneSubmissionState> {
  if (!capstoneId) return currentState.verifiedCapstones;

  const updated: Record<string, CapstoneSubmissionState> = {
    ...currentState.verifiedCapstones,
    [capstoneId]: {
      capstoneId,
      repoUrl,
      verifiedAt: new Date().toISOString(),
      score,
    },
  };

  currentState = {
    ...currentState,
    verifiedCapstones: updated,
  };

  safeSetStorage(scopedStorageKey(STORAGE_KEYS.VERIFIED_CAPSTONES), updated);
  notifyListeners();

  return updated;
}

// ---------------------------------------------------------------------------
// Offline action sync queue
// ---------------------------------------------------------------------------

async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data?.session?.user?.id ?? null;
  } catch (err) {
    console.warn("[store] Unable to read the Supabase session", err);
    return null;
  }
}

function toProgressRow(userId: string, item: PendingSyncItem) {
  return {
    user_id: userId,
    lesson_id: item.lessonId,
    is_completed: true,
    saved_code_draft: item.savedCode || null,
    completed_at: item.timestamp,
    last_accessed_at: new Date().toISOString(),
  };
}

async function queueOrSyncProgress(item: PendingSyncItem): Promise<void> {
  if (typeof window === "undefined") return;

  if (!navigator.onLine) {
    enqueuePendingSync(item);
    return;
  }

  // `user_progress` is keyed by lesson_id; nothing else is persistable server-side.
  if (!item.lessonId) return;

  try {
    const userId = await getAuthenticatedUserId();
    // No session configured yet: progress stays local. Enqueueing here would only
    // accumulate entries that can never be flushed.
    if (!userId) return;

    const { error } = await supabase
      .from("user_progress")
      .upsert(toProgressRow(userId, item), { onConflict: "user_id, lesson_id" });

    if (error) throw error;
  } catch (err) {
    // Packet drop / 2G timeout: park the work for the next reconnect.
    enqueuePendingSync(item);
  }
}

let flushInFlight = false;

export async function flushSyncQueue(): Promise<void> {
  if (typeof window === "undefined" || !navigator.onLine) return;
  if (currentState.pendingSyncQueue.length === 0) return;
  // Re-entrancy guard: online + visibilitychange + pagehide can all fire together.
  if (flushInFlight) return;

  flushInFlight = true;
  try {
    // ONE session lookup for the whole batch. The previous revision awaited
    // getSession() inside the loop and issued one upsert per item, so on 2G a
    // 20-item queue cost 40 serialized round trips instead of 2.
    const userId = await getAuthenticatedUserId();
    if (!userId) return;

    const rows = currentState.pendingSyncQueue
      .filter((item) => Boolean(item.lessonId))
      .map((item) => toProgressRow(userId, item));

    if (rows.length === 0) {
      replacePendingQueue([]);
      return;
    }

    const { error } = await supabase
      .from("user_progress")
      .upsert(rows, { onConflict: "user_id, lesson_id" });

    if (error) throw error;

    replacePendingQueue([]);
  } catch (err) {
    console.warn("[store] Progress flush failed; retaining the queue for retry.", err);
    retryPendingQueue();
  } finally {
    flushInFlight = false;
  }
}

// Attach browser listeners last so every referenced function is initialised.
if (typeof window !== "undefined") {
  attachBrowserListeners();
}
