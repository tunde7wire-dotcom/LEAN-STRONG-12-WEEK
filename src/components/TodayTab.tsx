/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, Flame, Dumbbell, Award, Edit3, Save, Calendar, ArrowRight, Beef, Apple, Droplet } from "lucide-react";
import { WeekPlan, DayPlan, AppSettings } from "../types";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/db";
import { getLocalTodayString } from "../utils/dateUtils";

interface TodayTabProps {
  currentWeekNum: number;
  currentDayIndex: number; // 0 to 6
  weekPlan: WeekPlan;
  dayPlan: DayPlan;
  settings: AppSettings;
  planStatus?: 'pre-start' | 'active' | 'completed';
  elapsedDays?: number;
  onStartWorkout: () => void;
  onNavigateToTab: (tabId: string) => void;
  onNavigateToWeek: (weekNum: number) => void;
  weightLoggedToday: boolean;
  weightValueToday: number | null;
  checkins: import("../types").WeeklyCheckIn[];
}

export default function TodayTab({
  currentWeekNum,
  currentDayIndex,
  weekPlan,
  dayPlan,
  settings,
  planStatus = 'active',
  elapsedDays = 0,
  onStartWorkout,
  onNavigateToTab,
  onNavigateToWeek,
  weightLoggedToday,
  weightValueToday,
  checkins,
}: TodayTabProps) {
  const noteKey = `lean_strong_note_W${currentWeekNum}_D${currentDayIndex}`;
  const todayStr = getLocalTodayString();
  const macrosKey = `lean_strong_macros_complete_${todayStr}`;
  const [macrosComplete, setMacrosComplete] = useState(() => loadFromLocalStorage<boolean>(macrosKey, false));

  const toggleMacrosComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newVal = !macrosComplete;
    setMacrosComplete(newVal);
    saveToLocalStorage(macrosKey, newVal);
  };

  const [note, setNote] = useState(() => loadFromLocalStorage<string>(noteKey, ""));
  const [isSaved, setIsSaved] = useState(false);

  // Auto-save notes
  useEffect(() => {
    saveToLocalStorage(noteKey, note);
  }, [note, noteKey]);

  const handleSaveNote = () => {
    saveToLocalStorage(noteKey, note);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const macros = dayPlan.isTrainingDay ? weekPlan.nutrition.training : weekPlan.nutrition.nonTraining;

  const openTodaysSession = () => {
    if (planStatus === 'active' && dayPlan.exercises.length > 0) {
      onStartWorkout();
    }
  };

  // Checklist computation

  const currentDayOfWeek = new Date().getDay(); // Local day of week
  const isWeighInDay = currentDayOfWeek === 1 || currentDayOfWeek === 3 || currentDayOfWeek === 5;
  const isWaistDay = currentDayOfWeek === 5;
  const waistLoggedToday = checkins.some(c => c.waist !== undefined && c.date === todayStr);

  const fullChecklist = [
    {
      id: "workout",
      title: dayPlan.exercises.length > 1 ? `Log Workout: ${dayPlan.name}` : `Active Recovery: ${dayPlan.name}`,
      subtitle: dayPlan.isTrainingDay ? "Target strength set progression" : "Active physical recovery & walk",
      completed: settings.completedDays[`W${currentWeekNum}-D${currentDayIndex}`] || false,
      action: undefined, // We'll handle workout row click separately
      icon: <Dumbbell className="w-5 h-5 text-neutral-400" />
    },
    {
      id: "weighin",
      title: "Morning Fasted Weigh-In",
      subtitle: weightLoggedToday ? `Logged: ${weightValueToday} ${settings.units === "imperial" ? "lbs" : "kg"}` : "Track weight for weekly averaging",
      completed: weightLoggedToday,
      action: () => onNavigateToTab("progress"),
      icon: <Calendar className="w-5 h-5 text-neutral-400" />
    },
    {
      id: "waist",
      title: "Weekly Waist Measurement",
      subtitle: "Measure under consistent conditions for weekly trend tracking.",
      completed: waistLoggedToday,
      action: () => onNavigateToTab("progress"),
      icon: <Award className="w-5 h-5 text-neutral-400" />
    },
    {
      id: "macros",
      title: "Hit Macro Nutrient Targets",
      subtitle: `${macros.calories} kcal • ${macros.protein}g Protein`,
      completed: macrosComplete, // Manual check
      action: () => onNavigateToTab("meals"),
      icon: <Flame className="w-5 h-5 text-neutral-400" />
    }
  ];

  const checklist = fullChecklist.filter(item => {
    if (item.id === "weighin" && !isWeighInDay) return false;
    if (item.id === "waist" && !isWaistDay) return false;
    if (item.id === "workout" && !dayPlan.exercises.some(ex => ex.required)) return false;
    return true;
  });

  const workoutCompleted = settings.completedDays[`W${currentWeekNum}-D${currentDayIndex}`] ? 1 : 0;
  // Calculate overall day percentage completed dynamically
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(item => item.completed).length;

  if (planStatus === 'pre-start') {
    const daysUntilStart = Math.abs(elapsedDays);
    return (
      <div id="today-dashboard" className="max-w-md mx-auto px-4 pb-24 pt-4 text-center">
        <div className="mt-20 mb-8">
          <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">
            Preparation
          </h1>
          <p className="text-zinc-400 font-mono">
            Your plan starts in {daysUntilStart} day{daysUntilStart !== 1 ? 's' : ''}.
          </p>
        </div>
        <button
          onClick={() => onNavigateToWeek(1)}
          className="bg-white/10 text-white font-bold uppercase tracking-wider py-3 px-6 rounded hover:bg-white/20 transition-colors"
        >
          View Roadmap
        </button>
      </div>
    );
  }

  if (planStatus === 'completed') {
    return (
      <div id="today-dashboard" className="max-w-md mx-auto px-4 pb-24 pt-4 text-center">
        <div className="mt-20 mb-8">
          <Award className="w-12 h-12 text-white mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">
            12-Week Plan Complete
          </h1>
          <p className="text-zinc-400 font-mono">
            Congratulations on finishing the program.
          </p>
        </div>
        <button
          onClick={() => onNavigateToWeek(12)}
          className="bg-white/10 text-white font-bold uppercase tracking-wider py-3 px-6 rounded hover:bg-white/20 transition-colors"
        >
          Browse Roadmap
        </button>
      </div>
    );
  }

  return (
    <div id="today-dashboard" className="max-w-md mx-auto px-4 pb-24 pt-4">
      {/* Header section with Bold Typography design */}
      <div className="mb-8">
        <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">
          {weekPlan.isDeload ? "PHASE: DELOAD • ACTIVE COOLDOWN" : "PHASE 1: FOUNDATION • STRENGTH"}
        </p>
        <h1 className="large-type text-white mb-2">
          WEEK<br />
          {String(currentWeekNum).padStart(2, "0")}/12
        </h1>
        <div className="flex items-baseline gap-4 mt-4">
          <span className="text-4xl font-light text-zinc-400">{dayPlan.dayName}</span>
          <span className="bg-white text-black px-3 py-1 text-sm font-extrabold rounded">
            {dayPlan.isTrainingDay ? (dayPlan.name.includes(":") ? dayPlan.name.split(":")[0].trim() : "WORKOUT") : "RECOVERY"}
          </span>
          <button
            id="today-btn-view-week"
            onClick={() => onNavigateToWeek(currentWeekNum)}
            className="ml-auto text-xs font-bold text-white underline hover:text-neutral-300 inline-flex items-center gap-1 uppercase tracking-wider"
          >
            Roadmap <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Progress ring or summary panel - styled with apple-card */}
      <div className="apple-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-white" />
            <h3 className="text-sm font-bold uppercase tracking-tight text-white">Today's Focus</h3>
          </div>
          <span className="text-xs font-mono bg-white/10 border border-white/10 px-2.5 py-1 rounded-full text-white font-bold">
            {completedTasks}/{totalTasks} DONE
          </span>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => {
            const isWorkoutRowClickable = item.id === "workout" && planStatus === 'active' && dayPlan.exercises.length > 0;
            const Wrapper = isWorkoutRowClickable ? "button" : "div";
            
            const wrapperProps = isWorkoutRowClickable 
              ? {
                  onClick: openTodaysSession,
                  className: `w-full text-left flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/10 active:scale-[0.99] border-white/20 hover:border-white/40 ${
                    item.completed ? "bg-white/5 border-white/5 text-neutral-500" : "bg-white/5 text-white"
                  }`
                }
              : {
                  className: `flex items-start justify-between p-4 rounded-xl border transition-all ${
                    item.completed 
                      ? "bg-white/5 border-white/5 text-neutral-500" 
                      : "bg-white/5 border-white/10 hover:border-white/20 text-white"
                  }`
                };

            return (
              <Wrapper
                id={`checklist-item-${item.id}`}
                key={item.id}
                {...(wrapperProps as any)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.completed ? (
                      <div className="tracking-dot" />
                    ) : (
                      <div className="w-2 h-2 rounded-full border border-white/40 mt-1" />
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${item.completed ? "line-through text-neutral-500" : "text-white"}`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 h-full">
                  {item.id === "macros" ? (
                    <>
                      <button
                        onClick={toggleMacrosComplete}
                        className="text-xs font-bold border border-white/20 text-white py-1 px-3 rounded hover:bg-white/10 transition-colors uppercase tracking-wider"
                      >
                        {item.completed ? "Undo" : "Done"}
                      </button>
                      <button
                        id={`btn-action-${item.id}`}
                        onClick={item.action}
                        className="text-xs font-bold bg-white text-black py-1 px-3 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider"
                      >
                        Go
                      </button>
                    </>
                  ) : isWorkoutRowClickable ? (
                    <div className="p-1 text-neutral-500 flex items-center gap-1">
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ) : item.action && !item.completed ? (
                    <button
                      id={`btn-action-${item.id}`}
                      onClick={item.action}
                      className="text-xs font-bold bg-white text-black py-1 px-3 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider"
                    >
                      Go
                    </button>
                  ) : (
                    <div className="p-1">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-600" />
                      )}
                    </div>
                  )}
                </div>
              </Wrapper>
            );
          })}
        </div>

      </div>

      {/* Daily Notes Panel - styled with apple-card */}
      <div className="apple-card p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold uppercase tracking-tight text-white">Session Notes & RPE</h3>
          </div>
          {note.trim() && (
            <button
              id="notes-btn-save"
              onClick={handleSaveNote}
              className="text-xs text-white flex items-center gap-1 border border-white/20 hover:bg-white/10 px-3 py-1 rounded transition-colors uppercase font-bold tracking-wider"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaved ? "Saved" : "Save"}
            </button>
          )}
        </div>
        <textarea
          id="notes-textarea-today"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Log sleep, mood, workout fatigue cues, hydration levels, or specific exercise notes..."
          rows={3}
          className="w-full text-sm placeholder:text-zinc-500 rounded-xl resize-none text-white focus:ring-1 focus:ring-white focus:border-white bg-white/5 border-white/10"
        />
        <div className="text-[10px] text-zinc-500 mt-1 text-right font-mono uppercase tracking-wider">
          Auto-saves to browser storage
        </div>
      </div>
    </div>
  );
}
