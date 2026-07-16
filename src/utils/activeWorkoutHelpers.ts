import { ActiveWorkoutState } from "../types";

export function hasMeaningfulWorkoutData(activeWorkout: ActiveWorkoutState | null): boolean {
  if (!activeWorkout || !activeWorkout.logs) return false;

  const logs = Object.values(activeWorkout.logs);
  if (logs.length === 0) return false;

  for (const log of logs) {
    if (log.completed) return true;
    if (log.weight !== undefined && log.weight !== null && log.weight.toString().trim() !== "") return true;
    if (log.reps !== undefined && log.reps !== null && log.reps.toString().trim() !== "") return true;
    if (log.duration !== undefined && log.duration !== null && log.duration.toString().trim() !== "") return true;
    if (log.assistance !== undefined && log.assistance !== null && log.assistance.toString().trim() !== "") return true;
    if (log.steps !== undefined && log.steps !== null && log.steps.toString().trim() !== "") return true;
    
    // Check sets
    if (log.sets && Array.isArray(log.sets)) {
      for (const set of log.sets) {
        if (set.effort && set.effort.trim().length > 0) return true;
        if (set.weight !== undefined && set.weight !== null && set.weight.toString().trim() !== "") return true;
        if (set.reps !== undefined && set.reps !== null && set.reps.toString().trim() !== "") return true;
        if (set.duration !== undefined && set.duration !== null && set.duration.toString().trim() !== "") return true;
        if (set.assistance !== undefined && set.assistance !== null && set.assistance.toString().trim() !== "") return true;
      }
    }
  }

  return false;
}
