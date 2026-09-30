/**
 * Utility functions for formatting lesson and module durations in learner-friendly terminology.
 * Strict Rule: Never display "X Minutes Read" for full dedicated study allocations.
 * Converts database estimated_minutes into clear, human-readable effort spans.
 */

/**
 * Formats duration into full descriptive text: e.g. "6 Hours Estimated Effort"
 */
export function formatEffort(minutes: number): string {
  if (!minutes || minutes <= 0) {
    return "Self-Paced Effort";
  }

  if (minutes < 60) {
    return `${minutes} Minutes Estimated Effort`;
  }

  const hours = minutes / 60;
  if (Number.isInteger(hours)) {
    return `${hours} ${hours === 1 ? "Hour" : "Hours"} Estimated Effort`;
  }

  return `${hours.toFixed(1)} Hours Estimated Effort`;
}

/**
 * Formats duration into compact badge string: e.g. "6h", "8.5h", "45m"
 */
export function formatShortEffort(minutes: number): string {
  if (!minutes || minutes <= 0) {
    return "Self-Paced";
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = minutes / 60;
  if (Number.isInteger(hours)) {
    return `${hours}h`;
  }

  return `${hours.toFixed(1)}h`;
}
