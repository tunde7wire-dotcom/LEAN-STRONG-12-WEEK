/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Exercise {
  id: string;
  name: string;
  originalName: string; // for reset
  sets: string; // e.g., "3" or "3-4"
  reps: string; // e.g., "6-8" or "8-12"
  tempoCue?: string;
  effortCue?: string;
  isSuperset?: boolean;
  supersetWith?: string; // Exercise ID it is paired with
  category: "strength" | "cardio" | "core" | "mobility";
}

export interface DayPlan {
  name: string; // e.g. "Day A", "Zone 2 Cardio", "Steps only"
  dayName: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  isTrainingDay: boolean;
  exercises: Exercise[];
  bikeFinisher?: string;
  finisherSupportingLabel?: string;
}

export interface WeekPlan {
  weekNumber: number; // 1 to 12
  isDeload: boolean;
  nutrition: {
    training: {
      calories: number;
      protein: number;
      fat: string;
      carbs: string;
    };
    nonTraining: {
      calories: number;
      protein: number;
      fat: string;
      carbs: string;
    };
    tips: string[];
  };
  days: DayPlan[];
}

export interface BestSetLog {
  weight: number;
  reps: number;
  date: string;
}

// Log index: exerciseId -> BestSetLog
export type BestSetLogs = Record<string, BestSetLog>;

export interface WeeklyBestSetLog {
  weekNumber: number;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  date: string;
}

export type WeeklyBestSetLogs = Record<string, Record<number, WeeklyBestSetLog>>;

export interface DailyWeightLog {
  date: string; // YYYY-MM-DD
  weight: number;
}

export interface WeeklyCheckIn {
  weekNumber: number; // 1 to 12
  waist?: number;
  highlights: string;
  improvements: string;
  completed: boolean;
  date: string;
}

export interface AppSettings {
  startDate: string; // YYYY-MM-DD
  units: "metric" | "imperial"; // kg vs lbs
  timerDuration: number; // in seconds
  soundEnabled: boolean;
  completedDays: Record<string, boolean>; // key: "W{week}-D{day}"
}

export interface ActiveWorkoutState {
  weekNumber: number;
  dayIndex: number; // 0 to 6
  startTime: number; // timestamp
  elapsedSeconds: number;
  logs: Record<string, { weight: number; reps: number }>; // exerciseId -> { weight, reps }
  currentExerciseIndex: number;
  isActive: boolean;
  timerEndTime: number | null; // For persistent rest timer recovery
  timerDurationSeconds: number; // Current timer setting
}

export interface StoredPDF {
  weekNumber: number;
  fileName: string;
  fileType: string;
  uploadedAt: string;
  dataUrl: string; // base64 representation of the PDF for rendering and saving
}
