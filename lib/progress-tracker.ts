"use client";

import * as React from "react";
import {
  useAppStore,
  markLessonCompleted as storeMarkLessonCompleted,
  markExerciseCompleted as storeMarkExerciseCompleted,
  setLastActiveLessonId as storeSetLastActiveLessonId,
  saveVerifiedCapstone as storeSaveVerifiedCapstone,
  CapstoneSubmissionState,
  getSnapshot,
} from "./store";

export type { CapstoneSubmissionState };

export interface UserProgressState {
  completedLessons: string[];
  completedExercises: string[];
  lastActiveLessonId: string;
}

export function getCompletedExercises(): string[] {
  return getSnapshot().completedExercises;
}

export function markExerciseCompleted(
  exerciseId: string
): { success: boolean; completedExercises: string[] } {
  return storeMarkExerciseCompleted(exerciseId);
}

export function getCompletedLessons(): string[] {
  return getSnapshot().completedLessons;
}

export function getLastActiveLessonId(): string {
  return getSnapshot().lastActiveLessonId;
}

export function setLastActiveLessonId(lessonId: string): void {
  storeSetLastActiveLessonId(lessonId);
}

export async function markLessonCompleted(
  lessonId: string,
  savedCode?: string
): Promise<{ success: boolean; completedLessons: string[]; isNewlyCompleted: boolean }> {
  return storeMarkLessonCompleted(lessonId, savedCode);
}

/**
 * Determine if a lesson is unlocked with O(1) average time complexity.
 * Rule:
 * 1. The first lesson (node-0-1 or index 0) is always unlocked.
 * 2. Any completed lesson is unlocked.
 * 3. The first lesson of each module is unlocked.
 * 4. A lesson is unlocked if the immediately preceding lesson in the sequential curriculum is completed.
 */
const FIRST_LESSON_IDS = new Set([
  "node-0-1",  // Module 1: Python Foundations
  "node-1-1",  // Module 2: Software Craftsmanship & OOP
  "node-2-1",  // Module 3: Discrete Mathematics
  "node-9-1",  // Module 4: Linear Algebra & Autograd
  "node-3-1",  // Module 5: Data Structures & Algorithms
  "node-4-1",  // Module 6: Web Protocols & ASGI
  "node-5-1",  // Module 7: PostgreSQL Internals
  "node-6-1",  // Module 8: Modern Frontend Engineering
  "node-8-1",  // Module 9: System Design & Scalability
  "node-7-1",  // Module 10: Distributed Systems & Consensus
  "node-10-1", // Module 11: Production RAG & Vector Search
  "node-11-1", // Module 12: Performance Profiling & AI Observability
  "node-12-1", // Module 13: Autonomous AI Agents
  "node-13-1", // Module 14: Advanced Infrastructure & Capstones
]);

export function isLessonUnlocked(
  lessonId: string,
  allLessonIds: string[],
  completedLessons: string[] | Set<string>,
  lessonIndexMap?: Map<string, number>
): boolean {
  if (!lessonId) return false;
  const completedSet = completedLessons instanceof Set ? completedLessons : new Set(completedLessons);

  // Already completed is always unlocked
  if (completedSet.has(lessonId)) return true;

  // First lesson of each module is unlocked
  if (FIRST_LESSON_IDS.has(lessonId)) {
    return true;
  }

  // Fast index resolution: O(1) if Map provided, O(N) fallback if array lookup
  const currentIndex = lessonIndexMap ? (lessonIndexMap.get(lessonId) ?? -1) : allLessonIds.indexOf(lessonId);

  if (currentIndex > 0 && currentIndex < allLessonIds.length) {
    const prevLessonId = allLessonIds[currentIndex - 1];
    return completedSet.has(prevLessonId);
  }

  return false;
}

export function getNextLessonId(
  currentLessonId: string,
  allLessonIds: string[]
): string | null {
  const currentIndex = allLessonIds.indexOf(currentLessonId);
  if (currentIndex >= 0 && currentIndex < allLessonIds.length - 1) {
    return allLessonIds[currentIndex + 1];
  }
  return null;
}

export function getVerifiedCapstones(): Record<string, CapstoneSubmissionState> {
  return getSnapshot().verifiedCapstones;
}

export function saveVerifiedCapstone(
  capstoneId: string,
  repoUrl: string,
  score: number = 100
): Record<string, CapstoneSubmissionState> {
  return storeSaveVerifiedCapstone(capstoneId, repoUrl, score);
}

/**
 * High-performance React hook consuming centralized store via useSyncExternalStore.
 * Guarantees instantaneous cross-tab synchronization and zero hydration tearing.
 */
export function useCurriculumProgress() {
  const completedLessons = useAppStore((s) => s.completedLessons);
  const completedExercises = useAppStore((s) => s.completedExercises);
  const verifiedCapstones = useAppStore((s) => s.verifiedCapstones);
  const lastActiveLessonId = useAppStore((s) => s.lastActiveLessonId);
  const networkStatus = useAppStore((s) => s.networkStatus);
  // The store is the ONE owner of the activity log; views must not read or write
  // `ai_lms_activity_log` directly.
  const activityLog = useAppStore((s) => s.activityLog);

  return {
    completedLessons,
    completedExercises,
    verifiedCapstones,
    lastActiveLessonId,
    networkStatus,
    activityLog,
    completedCount: completedLessons.length,
    completedExercisesCount: completedExercises.length,
    verifiedCapstonesCount: Object.keys(verifiedCapstones).length,
    markCompleted: markLessonCompleted,
    markExerciseCompleted,
    saveVerifiedCapstone,
    setLastActive: setLastActiveLessonId,
  };
}
