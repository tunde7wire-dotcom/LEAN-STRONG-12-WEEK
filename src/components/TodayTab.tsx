/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, Flame, Dumbbell, Award, Edit3, Save, Calendar, ArrowRight, Beef, Apple, Droplet } from "lucide-react";
import { WeekPlan, DayPlan, AppSettings } from "../types";
import { loadFromLocalStorage, saveToLocalStorage } from "../utils/db";

interface TodayTabProps {
  currentWeekNum: number;
  currentDayIndex: number; // 0 to 6
  weekPlan: WeekPlan;
  dayPlan: DayPlan;
  settings: AppSettings;
  onStartWorkout: () => void;
  onNavigateToTab: (tabId: string) => void;
  onNavigateToWeek: (weekNum: number) => void;
  weightLoggedToday: boolean;
  weightValueToday: number | null;
}

export default function TodayTab({
  currentWeekNum,
  currentDayIndex,
  weekPlan,
  dayPlan,
  settings,
  onStartWorkout,
  onNavigateToTab,
  onNavigateToWeek,
  weightLoggedToday,
  weightValueToday,
}: TodayTabProps) {
  const noteKey = `lean_strong_note_W${currentWeekNum}_D${currentDayIndex}`;
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

  // Checklist computation
  const checklist = [
    {
      id: "workout",
      title: dayPlan.exercises.length > 1 ? `Log Workout: ${dayPlan.name}` : `Active Recovery: ${dayPlan.name}`,
      subtitle: dayPlan.isTrainingDay ? "Target strength set progression" : "Active physical recovery & walk",
      completed: settings.completedDays[`W${currentWeekNum}-D${currentDayIndex}`] || false,
      action: dayPlan.isTrainingDay ? () => onNavigateToTab("workout") : undefined,
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
      id: "macros",
      title: "Hit Macro Nutrient Targets",
      subtitle: `${macros.calories} kcal • ${macros.protein}g Protein`,
      completed: false, // Self-check
      action: () => onNavigateToTab("meals"),
      icon: <Flame className="w-5 h-5 text-neutral-400" />
    }
  ];

  // Calculate overall day percentage completed
  const workoutCompleted = settings.completedDays[`W${currentWeekNum}-D${currentDayIndex}`] ? 1 : 0;
  const weighInCompleted = weightLoggedToday ? 1 : 0;
  const totalCompleted = workoutCompleted + weighInCompleted;

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
            {totalCompleted}/2 DONE
          </span>
        </div>

        <div className="space-y-3">
          {checklist.map((item) => (
            <div 
              id={`checklist-item-${item.id}`}
              key={item.id}
              className={`flex items-start justify-between p-4 rounded-xl border transition-all ${
                item.completed 
                  ? "bg-white/5 border-white/5 text-neutral-500" 
                  : "bg-white/5 border-white/10 hover:border-white/20 text-white"
              }`}
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
              <div className="flex items-center h-full">
                {item.action && !item.completed ? (
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
            </div>
          ))}
        </div>
      </div>

      {/* Daily Workout Summary Card - styled with apple-card */}
      <div className="apple-card p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
              Schedule Target
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {dayPlan.name}
            </h3>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded ${
            dayPlan.isTrainingDay ? "bg-white text-black" : "bg-white/10 text-white border border-white/10"
          }`}>
            {dayPlan.isTrainingDay ? "STRENGTH" : "RECOVERY"}
          </span>
        </div>

        {dayPlan.isTrainingDay ? (
          <div>
            <p className="text-xs text-zinc-400 mb-4">
              Consists of {dayPlan.exercises.length} structured movements, focusing on progressive best sets.
            </p>
            <button
              id="today-btn-start-workout"
              onClick={onStartWorkout}
              className="w-full bg-white text-black font-bold text-sm py-3 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Dumbbell className="w-4 h-4 fill-black" />
              {workoutCompleted ? "View Session Log" : "Launch Active Session"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dayPlan.exercises.map((ex, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <div className="font-bold text-base text-white">{ex.name}</div>
                <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-mono">Duration: {ex.reps}</div>
                <div className="text-xs text-zinc-500 mt-1">{ex.effortCue}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Target Nutrition Section - styled with apple-card */}
      <div className="apple-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
              Energy Dashboard
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              Macros Target
            </h3>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-bold text-zinc-400">
            <Flame className="w-4 h-4 text-white" />
            {macros.calories} KCAL
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <Beef className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
            <span className="text-[10px] font-mono text-zinc-500 block uppercase font-bold">Protein</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">{macros.protein}g</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <Apple className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
            <span className="text-[10px] font-mono text-zinc-500 block uppercase font-bold">Carbs</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">{macros.carbs}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
            <Droplet className="w-4 h-4 text-zinc-400 mx-auto mb-1" />
            <span className="text-[10px] font-mono text-zinc-500 block uppercase font-bold">Fat</span>
            <span className="text-base font-bold text-white font-mono mt-0.5 block">{macros.fat}</span>
          </div>
        </div>

        {dayPlan.isTrainingDay && (
          <div className="bg-white/5 border border-white/10 p-3.5 rounded-xl flex items-start gap-2.5">
            <span className="text-[10px] text-black bg-white px-1.5 py-0.5 rounded font-extrabold font-mono">POST</span>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consume a 35-50g high-quality protein shake 30-60 mins post-workout.
            </p>
          </div>
        )}
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
