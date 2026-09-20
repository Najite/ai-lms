"use client";

import * as React from "react";
import { supabase } from "./supabase";

const COMPLETED_LESSONS_KEY = "ai_lms_completed_lessons";
const COMPLETED_EXERCISES_KEY = "ai_lms_completed_exercises";
const LAST_ACTIVE_LESSON_KEY = "ai_lms_last_active_lesson";
const PROGRESS_EVENT = "ai_lms_progress_updated";

export interface UserProgressState {
  completedLessons: string[];
  completedExercises: string[];
  lastActiveLessonId: string;
}

/**
 * Retrieve the set of completed exercise IDs from localStorage
 */
export function getCompletedExercises(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPLETED_EXERCISES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse completed exercises from localStorage", err);
    return [];
  }
}

/**
 * Mark an exercise as completed
 */
export function markExerciseCompleted(
  exerciseId: string
): { success: boolean; completedExercises: string[] } {
  if (typeof window === "undefined" || !exerciseId) {
    return { success: false, completedExercises: [] };
  }

  const current = getCompletedExercises();
  const set = new Set(current);
  set.add(exerciseId);
  const updatedList = Array.from(set);

  try {
    localStorage.setItem(COMPLETED_EXERCISES_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error("Failed to save completed exercise to localStorage", err);
  }

  window.dispatchEvent(
    new CustomEvent(PROGRESS_EVENT, {
      detail: {
        completedExercises: updatedList,
        justCompletedExerciseId: exerciseId,
      },
    })
  );

  return { success: true, completedExercises: updatedList };
}

/**
 * Retrieve the set of completed lesson IDs from localStorage
 */
export function getCompletedLessons(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(COMPLETED_LESSONS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to parse completed lessons from localStorage", err);
    return [];
  }
}

/**
 * Get the last active lesson ID, defaulting to 'node-0-1'
 */
export function getLastActiveLessonId(): string {
  if (typeof window === "undefined") return "node-0-1";
  try {
    return localStorage.getItem(LAST_ACTIVE_LESSON_KEY) || "node-0-1";
  } catch {
    return "node-0-1";
  }
}

/**
 * Set the last active lesson ID
 */
export function setLastActiveLessonId(lessonId: string): void {
  if (typeof window === "undefined" || !lessonId) return;
  try {
    localStorage.setItem(LAST_ACTIVE_LESSON_KEY, lessonId);
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { lastActiveLessonId: lessonId } }));
  } catch (err) {
    console.error("Failed to store last active lesson in localStorage", err);
  }
}

/**
 * Mark a lesson as completed, syncing with localStorage and Supabase user_progress table
 */
export async function markLessonCompleted(
  lessonId: string,
  savedCode?: string
): Promise<{ success: boolean; completedLessons: string[]; isNewlyCompleted: boolean }> {
  if (typeof window === "undefined" || !lessonId) {
    return { success: false, completedLessons: [], isNewlyCompleted: false };
  }

  const current = getCompletedLessons();
  const set = new Set(current);
  const wasAlreadyCompleted = set.has(lessonId);
  set.add(lessonId);
  const updatedList = Array.from(set);

  try {
    localStorage.setItem(COMPLETED_LESSONS_KEY, JSON.stringify(updatedList));
  } catch (err) {
    console.error("Failed to save completed lesson to localStorage", err);
  }

  // Notify listeners across all React components
  window.dispatchEvent(
    new CustomEvent(PROGRESS_EVENT, {
      detail: {
        completedLessons: updatedList,
        justCompletedLessonId: lessonId,
        wasAlreadyCompleted,
      },
    })
  );

  // Sync with Supabase user_progress if a session is present
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;

    if (userId) {
      await supabase.from("user_progress").upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          is_completed: true,
          saved_code_draft: savedCode || null,
          completed_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString(),
        },
        { onConflict: "user_id, lesson_id" }
      );
    }
  } catch (syncErr) {
    // Non-fatal: Guest and offline progress stays in localStorage
    console.warn("Could not sync lesson progress with Supabase backend", syncErr);
  }

  return { success: true, completedLessons: updatedList, isNewlyCompleted: !wasAlreadyCompleted };
}

/**
 * Determine if a lesson is unlocked.
 * Rule:
 * 1. The first lesson (node-0-1 or index 0) is always unlocked.
 * 2. Any completed lesson is unlocked.
 * 3. A lesson is unlocked if the immediately preceding lesson in the sequential curriculum is completed.
 * 4. For specialized tracks (Phase 13), the first lesson of each track (A, B, C, D) is unlocked.
 */
export function isLessonUnlocked(
  lessonId: string,
  allLessonIds: string[],
  completedLessons: string[]
): boolean {
  if (!lessonId) return false;
  const completedSet = new Set(completedLessons);

  // Already completed is always unlocked
  if (completedSet.has(lessonId)) return true;

  // First lesson in curriculum is always unlocked
  if (allLessonIds.length > 0 && (lessonId === allLessonIds[0] || lessonId === "node-0-1")) {
    return true;
  }

  // Specialized Phase 13 track starters (Track A: node-13-1, Track B: node-13-11, Track C: node-13-21, Track D: node-13-31)
  if (["node-13-1", "node-13-11", "node-13-21", "node-13-31"].includes(lessonId)) {
    return true;
  }

  // Check sequential index
  const currentIndex = allLessonIds.indexOf(lessonId);
  if (currentIndex > 0) {
    const prevLessonId = allLessonIds[currentIndex - 1];
    if (completedSet.has(prevLessonId)) {
      return true;
    }
  }

  return false;
}

/**
 * Get the next lesson ID in the curriculum after the given lesson.
 */
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

/**
 * React hook to observe completed lessons and progress events seamlessly.
 */
export function useCurriculumProgress() {
  const [completedLessons, setCompletedLessons] = React.useState<string[]>([]);
  const [completedExercises, setCompletedExercises] = React.useState<string[]>([]);
  const [lastActiveLessonId, setLastActive] = React.useState<string>("node-0-1");

  React.useEffect(() => {
    setCompletedLessons(getCompletedLessons());
    setCompletedExercises(getCompletedExercises());
    setLastActive(getLastActiveLessonId());

    const handleProgressUpdate = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail?.completedLessons) {
        setCompletedLessons(custom.detail.completedLessons);
      }
      if (custom.detail?.completedExercises) {
        setCompletedExercises(custom.detail.completedExercises);
      }
      if (custom.detail?.lastActiveLessonId) {
        setLastActive(custom.detail.lastActiveLessonId);
      }
    };

    window.addEventListener(PROGRESS_EVENT, handleProgressUpdate);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, handleProgressUpdate);
    };
  }, []);

  return {
    completedLessons,
    completedExercises,
    lastActiveLessonId,
    completedCount: completedLessons.length,
    completedExercisesCount: completedExercises.length,
    markCompleted: markLessonCompleted,
    markExerciseCompleted,
    setLastActive: setLastActiveLessonId,
  };
}
