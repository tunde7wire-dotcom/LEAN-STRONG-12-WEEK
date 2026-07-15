/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { ChevronLeft, Dumbbell, Timer, ArrowRight, RotateCcw, AlertCircle, ArrowRightLeft, Check, CheckSquare, Save, Play } from "lucide-react";
import ExerciseFormGuideModal from "./ExerciseFormGuideModal";
import { getExerciseFormGuide, ExerciseFormGuide } from "../utils/exerciseFormGuides";
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
  swaps: Record<string, import("../types").CustomExerciseSwap | string>;
  historicalLogs: import("../types").HistoricalWorkoutLogs;
  onSaveActiveWorkout: (state: ActiveWorkoutState | null) => void;
  onCompleteWorkout: (logs: Record<string, { weight?: number; reps?: number; duration?: number; steps?: number; assistance?: number; completed?: boolean }>) => void;
  onTriggerRestTimer: () => void;
  onBackToWeekly: () => void;
  onSaveExerciseSwap: (originalId: string, customSwap: import("../types").CustomExerciseSwap | string) => void;
  onResetExerciseSwap: (originalId: string) => void;
}

// Preset Swaps for high-quality workouts
const PRESET_SWAPS: Record<string, {name: string, trackingType: import("../types").TrackingType, progressMode: import("../types").ProgressMode}[]> = {
  "Stability-Ball Hamstring Curl": [
    {name: "Standing Single-Leg Cable Curl with ankle cuff", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Smith Standing Calf Raise": [
    {name: "Single-Leg Dumbbell Calf Raise", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Cable or Chest-Supported Row": [
    {name: "Selectorized Machine Row", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "One-Arm Cable or Machine Row": [
    {name: "One-Arm Selectorized Machine Row", trackingType: "load_reps", progressMode: "weekly_best"},
    {name: "Bilateral Selectorized Machine Row", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Standing Cable Fly": [
    {name: "Cable Press", trackingType: "load_reps", progressMode: "weekly_best"}
  ],

  "Smith/Goblet Squat": [
    {name: "Smith Squat (Heavy)", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Goblet Squat", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Barbell Back Squat", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Hack Squat", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Leg Press", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Smith or Goblet Squat": [
    {name: "Smith Squat", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Goblet Squat", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Barbell Back Squat", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Hack Squat", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "DB Bench Press": [
    {name: "DB Bench Press", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Barbell Bench Press", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Weighted Push-ups", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Chest Press Machine", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Cable Row": [
    {name: "Cable Row", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Chest-Supported DB Row", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Barbell Row", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "T-Bar Row", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "DB RDL": [
    {name: "DB RDL", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Barbell RDL", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Cable Pull-Through", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Single-Leg DB RDL", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "DB Lateral Raise": [
    {name: "DB Lateral Raise", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Cable Lateral Raise", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Machine Lateral Raise", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Plank": [
    {name: "Plank", trackingType: "duration", progressMode: "weekly_best"}, 
    {name: "RKC Plank", trackingType: "duration", progressMode: "weekly_best"}, 
    {name: "Hanging Knee Raise", trackingType: "reps_only", progressMode: "weekly_best"}, 
    {name: "Ab Wheel Rollout", trackingType: "reps_only", progressMode: "weekly_best"}
  ],
  "Smith/Heavy DB RDL": [
    {name: "Smith RDL (Heavy)", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Heavy DB RDL", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Barbell Deadlift", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Barbell RDL", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "DB Shoulder Press": [
    {name: "DB Shoulder Press", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Seated Barbell Press", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Single-Arm Kettlebell Press", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Dumbbell Push Press", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Lat Pulldown": [
    {name: "Lat Pulldown", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Pull-ups", trackingType: "reps_only", progressMode: "weekly_best"}, 
    {name: "Chin-ups", trackingType: "reps_only", progressMode: "weekly_best"}, 
    {name: "Assisted Pull-ups", trackingType: "assistance_reps", progressMode: "weekly_best"}
  ],
  "DB Split Squat": [
    {name: "DB Split Squat", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Reverse Lunge", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "High Box Step-up", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Walking Lunges", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Face Pull": [
    {name: "Face Pull", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Reverse Pec Dec", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Rear Delt DB Fly", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Band Pull-Apart", trackingType: "reps_only", progressMode: "weekly_best"}
  ],
  "Cable Crunch": [
    {name: "Cable Crunch", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Ab Wheel Rollout", trackingType: "reps_only", progressMode: "weekly_best"}, 
    {name: "Decline Sit-up", trackingType: "reps_only", progressMode: "weekly_best"}, 
    {name: "Hanging Leg Raise", trackingType: "reps_only", progressMode: "weekly_best"}
  ],
  "Bulgarian Split Squat": [
    {name: "Bulgarian Split Squat", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Reverse Lunge", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Incline DB Bench Press": [
    {name: "Incline DB Bench Press", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Incline Barbell Press", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Incline Chest Press Machine", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "1-Arm Cable Row": [
    {name: "1-Arm Cable Row", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "1-Arm DB Row", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Machine Row", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Hip Thrust": [
    {name: "Hip Thrust", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Barbell Hip Thrust", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Glute Bridge", trackingType: "reps_only", progressMode: "weekly_best"}, 
    {name: "Single-Leg Hip Thrust", trackingType: "reps_only", progressMode: "weekly_best"}
  ],
  "Cable Bicep Curl": [
    {name: "Cable Bicep Curl", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "DB Bicep Curl", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "EZ Bar Curl", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Rope Tricep Pressdown": [
    {name: "Rope Tricep Pressdown", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Overhead Tricep Extension", trackingType: "load_reps", progressMode: "weekly_best"}, 
    {name: "Skullcrushers", trackingType: "load_reps", progressMode: "weekly_best"}
  ]
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
  historicalLogs,
  onSaveActiveWorkout,
  onCompleteWorkout,
  onTriggerRestTimer,
  onBackToWeekly,
  onSaveExerciseSwap,
  onResetExerciseSwap,
}: WorkoutTabProps) {

  const [localLogs, setLocalLogs] = useState<Record<string, { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean; sets?: import("../types").WorkingSetLog[] }>>(() => {
    // If there is an activeWorkout, restore it
    if (activeWorkout && activeWorkout.weekNumber === selectedWeekNum && activeWorkout.dayIndex === dayIndex) {
      const restored: Record<string, { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean; sets?: import("../types").WorkingSetLog[] }> = {};
      Object.entries(activeWorkout.logs).forEach(([exId, log]: [string, any]) => {
        restored[exId] = { 
          weight: log.weight !== undefined ? log.weight.toString() : "", 
          reps: log.reps !== undefined ? log.reps.toString() : "",
          duration: log.duration !== undefined ? log.duration.toString() : "",
          steps: log.steps !== undefined ? log.steps.toString() : "",
          assistance: log.assistance !== undefined ? log.assistance.toString() : "",
          completed: log.completed,
          sets: log.sets
        };
      });
      return restored;
    }
    
    // Otherwise, check if there are historical logs for this day
    const histKey = `W${selectedWeekNum}-D${dayIndex}`;
    if (historicalLogs && historicalLogs[histKey]) {
      const restored: Record<string, { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean; sets?: import("../types").WorkingSetLog[] }> = {};
      Object.entries(historicalLogs[histKey]).forEach(([exId, log]: [string, any]) => {
        restored[exId] = { 
          weight: log.weight !== undefined ? log.weight.toString() : "", 
          reps: log.reps !== undefined ? log.reps.toString() : "",
          duration: log.duration !== undefined ? log.duration.toString() : "",
          steps: log.steps !== undefined ? log.steps.toString() : "",
          assistance: log.assistance !== undefined ? log.assistance.toString() : "",
          completed: log.completed,
          sets: log.sets
        };
      });
      return restored;
    }

    return {};
  });

  const [swappingExId, setSwappingExId] = useState<string | null>(null);
  const [customSwapName, setCustomSwapName] = useState("");
  const [customSwapTracking, setCustomSwapTracking] = useState<import("../types").TrackingType>("load_reps");
  const [showBikeCompleted, setShowBikeCompleted] = useState(false);

  // Form Guide Modal State
  const [formGuideOpen, setFormGuideOpen] = useState(false);
  const [activeGuideData, setActiveGuideData] = useState<ExerciseFormGuide | ExerciseFormGuide[] | null>(null);
  const [activeGuideExerciseName, setActiveGuideExerciseName] = useState("");
  const [activeGuideTempoCue, setActiveGuideTempoCue] = useState("");
  const [activeGuideEffortCue, setActiveGuideEffortCue] = useState("");

  const handleOpenFormGuide = (ex: Exercise, swapData: any, guideData: ExerciseFormGuide | ExerciseFormGuide[]) => {
    setActiveGuideData(guideData);
    setActiveGuideExerciseName(typeof swapData === 'string' ? swapData : (swapData?.name || ex.name));
    setActiveGuideTempoCue(ex.tempoCue || "");
    setActiveGuideEffortCue(ex.effortCue || "");
    setFormGuideOpen(true);
  };

  // Sync state to parent active workout
  const handleInputChange = (exerciseId: string, field: "weight" | "reps" | "duration" | "steps" | "assistance", value: string) => {
    const updated = {
      ...localLogs,
      [exerciseId]: {
        ...localLogs[exerciseId],
        [field]: value
      }
    };
    setLocalLogs(updated);

    // Build the format for active workout storage
    const logsForParent: Record<string, any> = {};
    Object.entries(updated).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean; sets?: import("../types").WorkingSetLog[] };
      const out: any = {};
      
      if (log.weight !== undefined && log.weight !== "") {
        const wt = parseFloat(log.weight);
        if (!isNaN(wt)) out.weight = wt;
      }
      if (log.reps !== undefined && log.reps !== "") {
        const rp = parseInt(log.reps, 10);
        if (!isNaN(rp)) out.reps = rp;
      }
      if (log.duration !== undefined && log.duration !== "") {
        const dur = parseFloat(log.duration);
        if (!isNaN(dur) && dur > 0) out.duration = dur;
      }
      if (log.steps !== undefined && log.steps !== "") {
        const st = parseInt(log.steps, 10);
        if (!isNaN(st) && st > 0) out.steps = st;
      }
      if (log.assistance !== undefined && log.assistance !== "") {
        const ast = parseFloat(log.assistance);
        if (!isNaN(ast)) out.assistance = ast;
      }
      if (log.completed !== undefined) {
        out.completed = log.completed;
      }
      if (log.sets && log.sets.length > 0) {
        out.sets = log.sets;
      }
      
      if (Object.keys(out).length > 0) {
        logsForParent[exId] = out;
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


  const handleSetInputChange = (
    exerciseId: string,
    setIndex: number,
    field: "weight" | "reps" | "duration" | "assistance" | "effort",
    value: string
  ) => {
    setLocalLogs(prev => {
      const exLog = prev[exerciseId] || {};
      const currentSets = exLog.sets ? [...exLog.sets] : [];
      
      // Ensure the set exists
      if (!currentSets[setIndex]) {
        currentSets[setIndex] = { setNumber: setIndex + 1 };
      }
      
      if (field === "effort") {
        currentSets[setIndex] = { ...currentSets[setIndex], [field]: value || undefined };
      } else {
        const numVal = parseFloat(value);
        if (value === "") {
          currentSets[setIndex] = { ...currentSets[setIndex], [field]: undefined };
        } else if (!isNaN(numVal)) {
          currentSets[setIndex] = { ...currentSets[setIndex], [field]: numVal };
        }
      }
      
      const updated = {
        ...prev,
        [exerciseId]: {
          ...exLog,
          sets: currentSets
        }
      };

      // Also persist to activeWorkout immediately
      const logsForParent: Record<string, any> = {};
      Object.entries(updated).forEach(([exId, logEntry]) => {
        const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean; sets?: import("../types").WorkingSetLog[] };
        const out: any = {};
        
        if (log.weight !== undefined && log.weight !== "") {
          const wt = parseFloat(log.weight);
          if (!isNaN(wt)) out.weight = wt;
        }
        if (log.reps !== undefined && log.reps !== "") {
          const rp = parseInt(log.reps, 10);
          if (!isNaN(rp)) out.reps = rp;
        }
        if (log.duration !== undefined && log.duration !== "") {
          const dur = parseFloat(log.duration);
          if (!isNaN(dur) && dur > 0) out.duration = dur;
        }
        if (log.steps !== undefined && log.steps !== "") {
          const st = parseInt(log.steps, 10);
          if (!isNaN(st) && st > 0) out.steps = st;
        }
        if (log.assistance !== undefined && log.assistance !== "") {
          const ast = parseFloat(log.assistance);
          if (!isNaN(ast)) out.assistance = ast;
        }
        if (log.completed !== undefined) {
          out.completed = log.completed;
        }
        if (log.sets && log.sets.length > 0) {
          out.sets = log.sets;
        }
        
        if (Object.keys(out).length > 0) {
          logsForParent[exId] = out;
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

      return updated;
    });
  };

  const handleStartTimer = () => {
    onTriggerRestTimer();
  };

  const handleComplete = () => {
    // Convert current logs to numbers where applicable
    const finalLogs: Record<string, { weight?: number; reps?: number; duration?: number; steps?: number; assistance?: number; completed?: boolean }> = {};
    Object.entries(localLogs).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean; sets?: import("../types").WorkingSetLog[] };
      
      const parsed: any = {};
      if (log.weight !== undefined && log.weight !== "") {
        const wt = parseFloat(log.weight);
        if (!isNaN(wt)) parsed.weight = wt;
      }
      if (log.reps !== undefined && log.reps !== "") {
        const rp = parseInt(log.reps, 10);
        if (!isNaN(rp)) parsed.reps = rp;
      }
      if (log.duration !== undefined && log.duration !== "") {
        const dur = parseFloat(log.duration);
        if (!isNaN(dur) && dur > 0) parsed.duration = dur;
      }
      if (log.steps !== undefined && log.steps !== "") {
        const st = parseInt(log.steps, 10);
        if (!isNaN(st) && st > 0) parsed.steps = st;
      }
      if (log.assistance !== undefined && log.assistance !== "") {
        const ast = parseFloat(log.assistance);
        if (!isNaN(ast)) parsed.assistance = ast;
      }
      if (log.completed !== undefined) {
        parsed.completed = log.completed;
      }
      if (log.sets && log.sets.length > 0) {
        parsed.sets = log.sets;
      }
      
      if (Object.keys(parsed).length > 0) {
        finalLogs[exId] = parsed;
      }
    });

    onCompleteWorkout(finalLogs);
  };

  const handleOpenSwap = (ex: Exercise) => {
    setSwappingExId(ex.id);
    setCustomSwapName("");
  };

  const handleApplySwap = (exId: string, swapData: import("../types").CustomExerciseSwap | string) => {
    onSaveExerciseSwap(exId, swapData);
    setSwappingExId(null);
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

            {/* Effort Legend */}
      {dayPlan.isTrainingDay && (
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6">
          <h4 className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider mb-2">
            Effort Rating Guide
          </h4>
          <div className="flex flex-col gap-1.5 mb-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-16 shrink-0 font-mono font-bold text-emerald-400">Easy</span>
              <span className="text-zinc-300">3+ Reps in Reserve</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-16 shrink-0 font-mono font-bold text-yellow-400">On Target</span>
              <span className="text-zinc-300">1-2 Reps in Reserve</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-16 shrink-0 font-mono font-bold text-red-400">Very Hard</span>
              <span className="text-zinc-300">0 RIR or form breakdown</span>
            </div>
          </div>
          <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">
            For most normal working sets, On Target is the intended result. During the Week 7 deload, Easy may be appropriate.
          </p>
        </div>
      )}
      
      {/* Exercise Cards List */}
      <div className="space-y-4">
        {dayPlan.exercises.map((ex) => {
          // Resolve if swapped name exists
          const swapData = swaps[ex.id];
  const isSwapped = !!swapData;
  const currentName = typeof swapData === 'string' ? swapData : (swapData?.name || ex.name);
  const canonicalId = typeof swapData === 'object' ? swapData.canonicalId : ex.canonicalId;
  const resolvedTrackingType = typeof swapData === 'object' ? swapData.trackingType : ex.trackingType;
  const resolvedProgressMode = typeof swapData === 'object' ? swapData.progressMode : ex.progressMode;
          

          // Lookup previous best set for progression comparison
          const prevBest = previousBestSets[canonicalId || currentName];

          // Set inputs
          const weightVal = localLogs[ex.id]?.weight || "";
          const repsVal = localLogs[ex.id]?.reps || "";
          const durationVal = localLogs[ex.id]?.duration || "";
          const stepsVal = localLogs[ex.id]?.steps || "";
          const assistanceVal = localLogs[ex.id]?.assistance || "";
          const hasAnySetData = localLogs[ex.id]?.sets && localLogs[ex.id]?.sets.some(s => (s.weight || s.reps || s.duration || s.assistance || s.effort));

          // Get presets for swapping
          const originalRootName = ex.originalName;
          const presetList = PRESET_SWAPS[originalRootName] || [];


          // Form Guide Resolution
          const formGuide = getExerciseFormGuide({
            canonicalId: ex.canonicalId,
            selectedSubstitutionId: typeof swapData === 'object' ? swapData.canonicalId : (typeof swapData === 'string' ? swapData : undefined),
            resolvedExerciseName: currentName,
          });

          return (
            <div
              id={`exercise-card-${ex.id}`}
              key={ex.id}
              className={`apple-card p-5 transition-all ${
                (weightVal && repsVal) || hasAnySetData ? "border-white/20 bg-white/5" : "hover:border-white/20"
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

                {/* Action Area: View Form & Swap */}
                <div className="flex items-center gap-2">
                  {formGuide && (
                    <button
                      type="button"
                      id={`exercise-btn-view-form-${ex.id}`}
                      aria-label={`View form demonstration for ${currentName}`}
                      onClick={() => handleOpenFormGuide(ex, swapData, formGuide)}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/30 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Play className="w-3.5 h-3.5" /> View Form
                    </button>
                  )}
                  {swappingExId !== ex.id ? (
                    <button
                      id={`exercise-btn-swap-trigger-${ex.id}`}
                      onClick={() => handleOpenSwap(ex)}
                      className="text-xs text-zinc-400 hover:text-white p-1.5 border border-white/10 hover:border-white/20 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                      title="Swap exercise"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      id={`exercise-btn-swap-cancel-${ex.id}`}
                      onClick={() => setSwappingExId(null)}
                      className="text-[10px] text-zinc-400 hover:text-white font-mono font-bold uppercase tracking-wider px-2 py-1.5 shrink-0"
                    >
                      Cancel
                    </button>
                  )}
                </div>
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
                        <button key={index} onClick={() => handleApplySwap(ex.id, preset)}
                          className="text-[10px] font-bold bg-white/5 border border-white/10 text-white px-2 py-1 rounded hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-wider"
                        >
                          {preset.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Custom swap text input */}
                  <div className="flex flex-col gap-2">
                    <input
                      id={`swap-custom-input-${ex.id}`}
                      type="text"
                      placeholder="Or enter custom exercise..."
                      value={customSwapName}
                      onChange={(e) => setCustomSwapName(e.target.value)}
                      className="flex-1 text-xs py-1.5 px-3 rounded bg-white/5 border border-white/10"
                    />
                    <select
                      value={customSwapTracking}
                      onChange={(e) => setCustomSwapTracking(e.target.value as any)}
                      className="text-xs py-1.5 px-3 rounded bg-white/5 border border-white/10 text-white"
                    >
                      <option value="load_reps">Load + reps</option>
                      <option value="reps_only">Reps only</option>
                      <option value="duration">Duration</option>
                      <option value="assistance_reps">Assistance + reps</option>
                      <option value="completion">Completion only</option>
                    </select>
                    <button
                      id={`swap-btn-save-custom-${ex.id}`}
                      onClick={() => handleApplySwap(ex.id, {
                        name: customSwapName,
                        trackingType: customSwapTracking,
                        progressMode: customSwapTracking === 'completion' ? 'none' : (customSwapTracking === 'duration' ? 'target_adherence' : 'weekly_best')
                      })}
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
              {resolvedProgressMode === 'weekly_best' && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Progression Double Rule</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {prevBest ? (
                      <span className="text-white">
                        {resolvedTrackingType === 'load_reps' && `Prev Best Set: ${prevBest.weight} ${settings.units === "imperial" ? "lbs" : "kg"} x ${prevBest.reps} reps`}
                        {resolvedTrackingType === 'duration' && `Previous Best: ${prevBest.duration} ${ex.category === 'core' ? "sec" : "min"}`}
                        {resolvedTrackingType === 'reps_only' && `Previous Best: ${prevBest.reps} reps`}
                        {resolvedTrackingType === 'assistance_reps' && `Previous Best: -${prevBest.assistance} ${settings.units === "imperial" ? "lbs" : "kg"} x ${prevBest.reps} reps`}
                      </span>
                    ) : (
                      "No logged best set history"
                    )}
                  </span>
                </div>
              )}
              {/* Log Input for Exercise */}
              <div className="mt-4">
                {['target_adherence', 'none'].includes(resolvedProgressMode) || ['steps', 'completion'].includes(resolvedTrackingType) ? (
                  /* Legacy / Single Row for Cardio, Steps, Completion */
                  <div className="flex items-center gap-3 relative">
                    {resolvedTrackingType === 'duration' && (
                      <div className="flex-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
                            Duration {ex.category === 'core' ? "(Seconds)" : "(Minutes)"}
                          </label>
                          <input
                            id={`input-duration-${ex.id}`}
                            type="number"
                            placeholder={ex.category === 'core' ? "e.g. 45" : "e.g. 20"}
                            value={durationVal}
                            onChange={(e) => handleInputChange(ex.id, "duration", e.target.value)}
                            className="w-full text-sm py-2 px-3 focus:border-white text-white rounded-xl bg-white/5 border border-white/10"
                          />
                      </div>
                    )}
                    {resolvedTrackingType === 'steps' && (
                      <div className="flex-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
                            Actual Steps
                          </label>
                          <input
                            id={`input-steps-${ex.id}`}
                            type="number"
                            placeholder="e.g. 8500"
                            value={stepsVal}
                            onChange={(e) => handleInputChange(ex.id, "steps", e.target.value)}
                            className="w-full text-sm py-2 px-3 focus:border-white text-white rounded-xl bg-white/5 border border-white/10"
                          />
                      </div>
                    )}
                    {resolvedTrackingType === 'completion' && (
                      <div className="flex-1 flex items-center">
                          <button
                            onClick={() => {
                              const updated = { ...localLogs };
                              if (updated[ex.id]?.completed) {
                                delete updated[ex.id];
                              } else {
                                updated[ex.id] = { ...updated[ex.id], completed: true };
                              }
                              setLocalLogs(updated);
                            }}
                            className={`text-xs py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-colors ${localLogs[ex.id]?.completed ? 'bg-emerald-500 text-black' : 'bg-white/5 border border-white/10 text-white'}`}
                          >
                             {localLogs[ex.id]?.completed ? 'Completed' : 'Mark Done'}
                          </button>
                      </div>
                    )}
                    
                    <div className="self-end pb-1 pr-1">
                      <button
                        id={`btn-trigger-timer-${ex.id}`}
                        onClick={handleStartTimer}
                        className="p-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl transition-colors"
                        title="Trigger rest timer"
                      >
                        <Timer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Set-by-Set Logging for Strength / Weekly Best */
                  <div className="space-y-3">
                    {(() => {
                      const prescribedSetsMatch = ex.sets?.match(/(d+)/g);
                      let maxSets = 1;
                      if (prescribedSetsMatch) {
                        maxSets = Math.max(...prescribedSetsMatch.map(n => parseInt(n, 10)));
                      }
                      
                      const setsList = Array.from({ length: maxSets }, (_, i) => i);
                      
                      return setsList.map(setIdx => {
                        const setLog = localLogs[ex.id]?.sets?.[setIdx] || { setNumber: setIdx + 1 };
                        
                        return (
                          <div key={setIdx} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase w-12 shrink-0">
                                Set {setIdx + 1}
                              </span>
                              
                              {resolvedTrackingType === 'load_reps' && (
                                <>
                                  <input
                                    type="number"
                                    step="any"
                                    placeholder="Weight"
                                    value={setLog.weight || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "weight", e.target.value)}
                                    className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Reps"
                                    value={setLog.reps || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                    className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                </>
                              )}
                              
                              {resolvedTrackingType === 'reps_only' && (
                                <input
                                  type="number"
                                  placeholder="Reps"
                                  value={setLog.reps || ""}
                                  onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                  className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                />
                              )}
                              
                              {resolvedTrackingType === 'assistance_reps' && (
                                <>
                                  <input
                                    type="number"
                                    step="any"
                                    placeholder="Assist"
                                    value={setLog.assistance || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "assistance", e.target.value)}
                                    className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Reps"
                                    value={setLog.reps || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                    className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                </>
                              )}
                              
                              {resolvedTrackingType === 'duration' && (
                                <input
                                  type="number"
                                  placeholder={ex.category === 'core' ? "Secs" : "Mins"}
                                  value={setLog.duration || ""}
                                  onChange={(e) => handleSetInputChange(ex.id, setIdx, "duration", e.target.value)}
                                  className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                />
                              )}
                              
                              <button
                                onClick={handleStartTimer}
                                className="p-1.5 bg-white text-black hover:bg-neutral-200 rounded shrink-0 transition-colors"
                                title="Rest timer"
                              >
                                <Timer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            {/* Effort Controls */}
                            <div className="flex gap-1.5 w-full">
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "easy" ? "" : "easy")}
                                aria-pressed={setLog.effort === "easy"}
                                className={`flex-1 text-[10px] font-mono font-bold py-1.5 rounded uppercase tracking-wider transition-all ${setLog.effort === "easy" ? "bg-emerald-500 text-black" : "bg-white/5 text-emerald-500 border border-emerald-500/30"}`}
                              >
                                Easy
                              </button>
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "on_target" ? "" : "on_target")}
                                aria-pressed={setLog.effort === "on_target"}
                                className={`flex-1 text-[10px] font-mono font-bold py-1.5 rounded uppercase tracking-wider transition-all ${setLog.effort === "on_target" ? "bg-yellow-500 text-black" : "bg-white/5 text-yellow-500 border border-yellow-500/30"}`}
                              >
                                On Target
                              </button>
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "very_hard" ? "" : "very_hard")}
                                aria-pressed={setLog.effort === "very_hard"}
                                className={`flex-1 text-[10px] font-mono font-bold py-1.5 rounded uppercase tracking-wider transition-all ${setLog.effort === "very_hard" ? "bg-red-500 text-white" : "bg-white/5 text-red-500 border border-red-500/30"}`}
                              >
                                Very Hard
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
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
              <span className="text-[10px] font-mono font-bold uppercase text-zinc-500 tracking-wider">Optional Conditioning</span>
              <h4 className="text-sm font-bold text-white mt-0.5">Gym Cardio Finisher</h4>
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
          {dayPlan.finisherSupportingLabel && (
            <p className="text-[10px] text-zinc-500 leading-relaxed mt-2 italic">
              {dayPlan.finisherSupportingLabel}
            </p>
          )}
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
      {/* Form Guide Modal */}
      {activeGuideData && (
        <ExerciseFormGuideModal
          isOpen={formGuideOpen}
          onClose={() => setFormGuideOpen(false)}
          guideData={activeGuideData}
          originalExerciseName={activeGuideExerciseName}
          tempoCue={activeGuideTempoCue}
          effortCue={activeGuideEffortCue}
        />
      )}
    </div>
  );
}
