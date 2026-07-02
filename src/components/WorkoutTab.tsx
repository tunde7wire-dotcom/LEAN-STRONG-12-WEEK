/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { ChevronLeft, Dumbbell, Timer, ArrowRight, RotateCcw, AlertCircle, ArrowRightLeft, Check, CheckSquare, Save } from "lucide-react";
import { WeekPlan, DayPlan, Exercise, BestSetLog, AppSettings, ActiveWorkoutState } from "../types";

interface WorkoutTabProps {
  currentWeekNum: number;
  selectedWeekNum: number;
  dayIndex: number; // 0 to 6
  weekPlan: WeekPlan;
  dayPlan: DayPlan;
  settings: AppSettings;
  activeWorkout: ActiveWorkoutState | null;
  previousBestSets: Record<string, BestSetLog>; // exerciseName -> BestSetLog
  swaps: Record<string, string>; // originalExerciseId -> customExerciseName
  onSaveActiveWorkout: (state: ActiveWorkoutState | null) => void;
  onCompleteWorkout: (logs: Record<string, { weight: number; reps: number }>) => void;
  onTriggerRestTimer: () => void;
  onBackToWeekly: () => void;
  onSaveExerciseSwap: (originalId: string, customName: string) => void;
  onResetExerciseSwap: (originalId: string) => void;
}

// Preset Swaps for high-quality workouts
const PRESET_SWAPS: Record<string, string[]> = {
  "Smith/Goblet Squat": ["Smith Squat (Heavy)", "Goblet Squat", "Barbell Back Squat", "Hack Squat", "Leg Press"],
  "Smith or Goblet Squat": ["Smith Squat", "Goblet Squat", "Barbell Back Squat", "Hack Squat"],
  "DB Bench Press": ["DB Bench Press", "Barbell Bench Press", "Weighted Push-ups", "Chest Press Machine"],
  "Cable Row": ["Cable Row", "Chest-Supported DB Row", "Barbell Row", "T-Bar Row"],
  "DB RDL": ["DB RDL", "Barbell RDL", "Cable Pull-Through", "Single-Leg DB RDL"],
  "DB Lateral Raise": ["DB Lateral Raise", "Cable Lateral Raise", "Machine Lateral Raise"],
  "Plank": ["Plank", "RKC Plank", "Hanging Knee Raise", "Ab Wheel Rollout"],
  "Smith/Heavy DB RDL": ["Smith RDL (Heavy)", "Heavy DB RDL", "Barbell Deadlift", "Barbell RDL"],
  "DB Shoulder Press": ["DB Shoulder Press", "Seated Barbell Press", "Single-Arm Kettlebell Press", "Dumbbell Push Press"],
  "Lat Pulldown": ["Lat Pulldown", "Pull-ups", "Chin-ups", "Assisted Pull-ups"],
  "DB Split Squat": ["DB Split Squat", "Reverse Lunge", "High Box Step-up", "Walking Lunges"],
  "Face Pull": ["Face Pull", "Band Pull-Apart", "Reverse Pec Dec", "Rear Delt DB Fly"],
  "Cable Crunch": ["Cable Crunch", "Ab Wheel Rollout", "Decline Sit-up", "Hanging Leg Raise"],
  "Bulgarian Split Squat": ["Bulgarian Split Squat", "Deficit Reverse Lunge", "Step-up (Weighted)", "Leg Press"],
  "Incline DB Bench Press": ["Incline DB Bench Press", "Incline Barbell Bench", "Incline Machine Chest Press"],
  "1-Arm Cable Row": ["1-Arm Cable Row", "1-Arm Dumbbell Row", "Meadows Row", "Dumbbell Row"],
  "Hip Thrust": ["Hip Thrust", "Glute Bridge", "Single-Leg Hip Thrust", "Barbell Hip Thrust"],
  "Cable Bicep Curl": ["Cable Bicep Curl", "Incline DB Curl", "EZ Bar Curl", "Hammer Curl"],
  "Rope Tricep Pressdown": ["Rope Tricep Pressdown", "Overhead Cable Extension", "Skull Crusher", "Weighted Dips"]
};

export default function WorkoutTab({
  currentWeekNum,
  selectedWeekNum,
  dayIndex,
  weekPlan,
  dayPlan,
  settings,
  activeWorkout,
  previousBestSets,
  swaps,
  onSaveActiveWorkout,
  onCompleteWorkout,
  onTriggerRestTimer,
  onBackToWeekly,
  onSaveExerciseSwap,
  onResetExerciseSwap,
}: WorkoutTabProps) {

  const [localLogs, setLocalLogs] = useState<Record<string, { weight: string; reps: string }>>(() => {
    // If there is an activeWorkout, restore it
    if (activeWorkout && activeWorkout.weekNumber === selectedWeekNum && activeWorkout.dayIndex === dayIndex) {
      const restored: Record<string, { weight: string; reps: string }> = {};
      Object.entries(activeWorkout.logs).forEach(([exId, log]) => {
        restored[exId] = { weight: log.weight.toString(), reps: log.reps.toString() };
      });
      return restored;
    }
    return {};
  });

  const [swappingExId, setSwappingExId] = useState<string | null>(null);
  const [customSwapName, setCustomSwapName] = useState("");
  const [showBikeCompleted, setShowBikeCompleted] = useState(false);

  // Sync state to parent active workout
  const handleInputChange = (exerciseId: string, field: "weight" | "reps", value: string) => {
    const updated = {
      ...localLogs,
      [exerciseId]: {
        ...localLogs[exerciseId],
        [field]: value
      }
    };
    setLocalLogs(updated);

    // Build the format for active workout storage
    const logsForParent: Record<string, { weight: number; reps: number }> = {};
    Object.entries(updated).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight: string; reps: string };
      const wt = parseFloat(log.weight);
      const rp = parseInt(log.reps, 10);
      if (!isNaN(wt) && !isNaN(rp)) {
        logsForParent[exId] = { weight: wt, reps: rp };
      }
    });

    onSaveActiveWorkout({
      weekNumber: selectedWeekNum,
      dayIndex,
      startTime: activeWorkout?.startTime || Date.now(),
      elapsedSeconds: activeWorkout?.elapsedSeconds || 0,
      logs: logsForParent,
      currentExerciseIndex: activeWorkout?.currentExerciseIndex || 0,
      isActive: true,
      timerEndTime: activeWorkout?.timerEndTime || null,
      timerDurationSeconds: activeWorkout?.timerDurationSeconds || settings.timerDuration,
    });
  };

  const handleStartTimer = () => {
    onTriggerRestTimer();
  };

  const handleComplete = () => {
    // Convert current logs to numbers
    const finalLogs: Record<string, { weight: number; reps: number }> = {};
    Object.entries(localLogs).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight: string; reps: string };
      const wt = parseFloat(log.weight);
      const rp = parseInt(log.reps, 10);
      if (!isNaN(wt) && !isNaN(rp)) {
        finalLogs[exId] = { weight: wt, reps: rp };
      }
    });

    onCompleteWorkout(finalLogs);
  };

  const handleOpenSwap = (ex: Exercise) => {
    setSwappingExId(ex.id);
    setCustomSwapName("");
  };

  const handleApplySwap = (exId: string, name: string) => {
    if (name.trim()) {
      onSaveExerciseSwap(exId, name.trim());
      setSwappingExId(null);
    }
  };

  const handleResetSwap = (exId: string) => {
    onResetExerciseSwap(exId);
    setSwappingExId(null);
  };

  const isCompletedDay = settings.completedDays[`W${selectedWeekNum}-D${dayIndex}`] || false;

  return (
    <div id="workout-tracker-tab" className="max-w-md mx-auto px-4 pb-28 pt-4">
      {/* Back to week header */}
      <button
        id="workout-btn-back"
        onClick={onBackToWeekly}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-5 transition-colors font-mono font-bold uppercase tracking-wider"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Week {selectedWeekNum}
      </button>

      {/* Hero Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
            {dayPlan.dayName} Workout Session
          </span>
          <h1 className="text-3xl font-black text-white mt-1 leading-none uppercase tracking-tight">
            {dayPlan.name.includes(":") ? dayPlan.name.split(":")[0].trim() : "WORKOUT"}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">
            {dayPlan.name.includes(":") ? dayPlan.name.split(":").slice(1).join(":").trim() : dayPlan.name}
          </p>
        </div>
        <button
          id="workout-btn-trigger-timer"
          onClick={handleStartTimer}
          className="flex items-center gap-1 bg-white text-black hover:bg-neutral-200 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider"
        >
          <Timer className="w-3.5 h-3.5" />
          Rest Timer
        </button>
      </div>

      {/* Exercise Cards List */}
      <div className="space-y-4">
        {dayPlan.exercises.map((ex) => {
          // Resolve if swapped name exists
          const currentName = swaps[ex.id] || ex.name;
          const isSwapped = !!swaps[ex.id];

          // Lookup previous best set for progression comparison
          const prevBest = previousBestSets[currentName];

          // Set inputs
          const weightVal = localLogs[ex.id]?.weight || "";
          const repsVal = localLogs[ex.id]?.reps || "";

          // Get presets for swapping
          const originalRootName = ex.originalName;
          const presetList = PRESET_SWAPS[originalRootName] || [];

          return (
            <div
              id={`exercise-card-${ex.id}`}
              key={ex.id}
              className={`apple-card p-5 transition-all ${
                weightVal && repsVal ? "border-white/20 bg-white/5" : "hover:border-white/20"
              }`}
            >
              {/* Card top banner */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {ex.isSuperset && (
                      <span className="bg-white text-black font-mono font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase">
                        Superset
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                      Target: {ex.sets} Sets x {ex.reps} Reps
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1 leading-tight flex items-center gap-1.5">
                    {currentName}
                    {isSwapped && (
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                        (Swapped)
                      </span>
                    )}
                  </h3>
                </div>

                {/* Inline Exercise swap action */}
                {swappingExId !== ex.id ? (
                  <button
                    id={`exercise-btn-swap-trigger-${ex.id}`}
                    onClick={() => handleOpenSwap(ex)}
                    className="text-xs text-zinc-400 hover:text-white p-1 border border-white/10 hover:border-white/20 rounded transition-colors flex items-center gap-1"
                    title="Swap exercise"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    id={`exercise-btn-swap-cancel-${ex.id}`}
                    onClick={() => setSwappingExId(null)}
                    className="text-xs text-zinc-400 hover:text-white font-mono font-bold uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Swapping Options Area */}
              {swappingExId === ex.id && (
                <div className="my-3 bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-[9px] font-mono font-bold uppercase text-zinc-500 block mb-2 tracking-widest">
                    Substitute {originalRootName}
                  </span>
                  
                  {/* Presets */}
                  {presetList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {presetList.map((preset, index) => (
                        <button
                          key={index}
                          onClick={() => handleApplySwap(ex.id, preset)}
                          className="text-[10px] font-bold bg-white/5 border border-white/10 text-white px-2 py-1 rounded hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-wider"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Custom swap text input */}
                  <div className="flex gap-2">
                    <input
                      id={`swap-custom-input-${ex.id}`}
                      type="text"
                      placeholder="Or enter custom exercise..."
                      value={customSwapName}
                      onChange={(e) => setCustomSwapName(e.target.value)}
                      className="flex-1 text-xs py-1.5 px-3 rounded bg-white/5 border border-white/10"
                    />
                    <button
                      id={`swap-btn-save-custom-${ex.id}`}
                      onClick={() => handleApplySwap(ex.id, customSwapName)}
                      className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider"
                    >
                      Apply
                    </button>
                  </div>

                  {isSwapped && (
                    <button
                      id={`swap-btn-reset-${ex.id}`}
                      onClick={() => handleResetSwap(ex.id)}
                      className="text-[10px] text-zinc-400 hover:text-white underline mt-3 block font-bold uppercase tracking-wider font-mono"
                    >
                      Reset to standard plan ({originalRootName})
                    </button>
                  )}
                </div>
              )}

              {/* Double Progression / Previous best set info */}
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Progression Double Rule</span>
                <span className="text-xs font-mono font-bold text-zinc-300">
                  {prevBest ? (
                    <span className="text-white">
                      Prev Best Set: {prevBest.weight} {settings.units === "imperial" ? "lbs" : "kg"} x {prevBest.reps} reps
                    </span>
                  ) : (
                    "No logged best set history"
                  )}
                </span>
              </div>

              {/* Log Input for "Best Set" (Weight x Reps) */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
                    Best Set Load ({settings.units === "imperial" ? "lbs" : "kg"})
                  </label>
                  <input
                    id={`input-weight-${ex.id}`}
                    type="number"
                    step="any"
                    placeholder="e.g. 135"
                    value={weightVal}
                    onChange={(e) => handleInputChange(ex.id, "weight", e.target.value)}
                    className="w-full text-sm py-2 px-3 focus:border-white text-white rounded-xl"
                  />
                </div>
                <div className="w-24">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
                    Total Reps
                  </label>
                  <input
                    id={`input-reps-${ex.id}`}
                    type="number"
                    placeholder="e.g. 8"
                    value={repsVal}
                    onChange={(e) => handleInputChange(ex.id, "reps", e.target.value)}
                    className="w-full text-sm py-2 px-3 focus:border-white text-white rounded-xl"
                  />
                </div>

                {/* Set completion indicator */}
                <div className="self-end pb-1 pr-1">
                  {weightVal && repsVal ? (
                    <button
                      id={`btn-trigger-timer-on-completion-${ex.id}`}
                      onClick={handleStartTimer}
                      className="p-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl transition-colors"
                      title="Trigger rest timer"
                    >
                      <Timer className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="p-2.5 bg-white/5 border border-white/10 text-zinc-600 rounded-xl">
                      <Timer className="w-4 h-4 opacity-30" />
                    </div>
                  )}
                </div>
              </div>

              {/* Tempo / Effort cueing */}
              {(ex.tempoCue || ex.effortCue) && (
                <div className="mt-3.5 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                  {ex.tempoCue && (
                    <div>
                      <span className="text-zinc-500 block font-bold">TEMPO:</span>
                      {ex.tempoCue}
                    </div>
                  )}
                  {ex.effortCue && (
                    <div>
                      <span className="text-zinc-500 block font-bold">EFFORT CUE:</span>
                      {ex.effortCue}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Thursday Bike Finisher Extra Details */}
      {dayPlan.bikeFinisher && (
        <div className="mt-6 apple-card p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 tracking-wider">High Intensity Finisher</span>
              <h4 className="text-sm font-bold text-white mt-0.5">Bike Finisher</h4>
            </div>
            <button
              id="btn-toggle-bike-finisher"
              onClick={() => setShowBikeCompleted(!showBikeCompleted)}
              className={`text-xs px-3 py-1 rounded font-bold transition-all uppercase tracking-wider ${
                showBikeCompleted ? "bg-white text-black" : "bg-white/5 border border-white/10 text-zinc-400"
              }`}
            >
              {showBikeCompleted ? "Completed" : "Mark Done"}
            </button>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed mt-2">
            {dayPlan.bikeFinisher}
          </p>
        </div>
      )}

      {/* Bottom Save Action Button */}
      <div className="mt-8 pt-4 border-t border-white/10">
        <button
          id="workout-btn-complete-workout"
          onClick={handleComplete}
          disabled={Object.keys(localLogs).length === 0}
          className="w-full flex items-center justify-center gap-2 bg-white text-black disabled:bg-white/10 disabled:text-zinc-500 font-extrabold text-sm py-4 rounded-xl hover:bg-neutral-200 transition-all shadow-xl uppercase tracking-wider"
        >
          <CheckSquare className="w-4 h-4" />
          Complete & Save Session
        </button>
        <p className="text-center text-[10px] text-zinc-500 font-mono mt-2.5 uppercase tracking-wider">
          This will update your progression metrics and log this day as completed.
        </p>
      </div>
    </div>
  );
}
