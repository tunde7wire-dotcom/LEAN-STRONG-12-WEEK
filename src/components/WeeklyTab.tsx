/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ChevronLeft, CheckCircle2, Circle, ArrowRight, Dumbbell, Calendar, Flame, FileText, CheckSquare } from "lucide-react";
import { WeekPlan, AppSettings, WeeklyCheckIn } from "../types";

interface WeeklyTabProps {
  selectedWeekNum: number;
  weekPlan: WeekPlan;
  settings: AppSettings;
  checkins: WeeklyCheckIn[];
  onBackToOverview: () => void;
  onSelectDay: (dayIndex: number) => void;
  onNavigateToTab: (tabId: string) => void;
  onExportWeek?: (format: "csv" | "json") => void;
}

export default function WeeklyTab({
  selectedWeekNum,
  weekPlan,
  settings,
  checkins,
  onBackToOverview,
  onSelectDay,
  onNavigateToTab,
  onExportWeek,
}: WeeklyTabProps) {

  const macros = weekPlan.nutrition.training; // reference training day macros for summary
  const checkin = checkins.find((c) => c.weekNumber === selectedWeekNum);
  const isCompletedCheckin = checkin?.completed || false;

  return (
    <div id="weekly-dashboard" className="max-w-md mx-auto px-4 pb-24 pt-4">
      {/* Navigation header */}
      <button
        id="weekly-btn-back"
        onClick={onBackToOverview}
        className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white mb-5 transition-colors font-mono font-bold uppercase tracking-wider"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Roadmap
      </button>

      <div className="mb-8 flex justify-between items-end">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-500 block uppercase">
            WEEKLY PLANNER
          </span>
          <h1 className="text-4xl font-black tracking-tighter text-white mt-1 uppercase">
            Week {String(selectedWeekNum).padStart(2, "0")}
          </h1>
          <p className="text-xs text-zinc-400 mt-1 uppercase tracking-wider">
            {weekPlan.isDeload ? "Deload & Active Recovery" : "Phase Program Active"}
          </p>
        </div>
        {weekPlan.isDeload && (
          <span className="bg-white text-black text-[9px] font-mono font-extrabold uppercase tracking-widest px-2 py-1 rounded">
            Deload Active
          </span>
        )}
      </div>

      
      {/* Quick Action Navigation links */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          id="weekly-btn-goto-meals"
          onClick={() => onNavigateToTab("meals")}
          className="flex flex-col items-start p-4 apple-card hover:border-white/20 text-left transition-colors"
        >
          <FileText className="w-5 h-5 text-white mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Meal Plan & PDFs</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono uppercase">Week {selectedWeekNum} files</span>
        </button>
        <button
          id="weekly-btn-goto-checkin"
          onClick={() => onNavigateToTab("progress")}
          className="flex flex-col items-start p-4 apple-card hover:border-white/20 text-left transition-colors"
        >
          <CheckSquare className="w-5 h-5 text-white mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Weekly Check-in</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono uppercase">
            {isCompletedCheckin ? "Status: Logged" : "Status: Pending"}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onExportWeek?.("csv")}
          className="flex flex-col items-start p-4 apple-card hover:border-white/20 text-left transition-colors"
        >
          <FileText className="w-5 h-5 text-white mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Export CSV</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono uppercase">Spreadsheet Format</span>
        </button>
        <button
          onClick={() => onExportWeek?.("json")}
          className="flex flex-col items-start p-4 apple-card hover:border-white/20 text-left transition-colors"
        >
          <FileText className="w-5 h-5 text-white mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Export JSON</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono uppercase">Data Format</span>
        </button>
      </div>

      {/* 7-Day Workout Agenda List */}
      <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-3">
        Weekly Training Agenda
      </h3>

      <div className="space-y-3 mb-6">
        {weekPlan.days.map((day, index) => {
          const isRequired = day.exercises.some(ex => ex.required);
          const isCompleted = isRequired ? (settings.completedDays[`W${selectedWeekNum}-D${index}`] || false) : false;
          let labelText = day.isTrainingDay ? "Strength" : "Active Rest";
          if (!isRequired) {
            labelText = day.exercises.length > 0 ? "Optional" : "Rest";
          }
          if (day.dayName === "Sunday") labelText = "Full Rest";

          return (
            <div
              id={`weekly-day-card-${index}`}
              key={index}
              onClick={() => onSelectDay(index)}
              className={`flex items-center justify-between p-4 apple-card cursor-pointer hover:border-white/20 transition-all ${
                isCompleted ? "opacity-60" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {isCompleted ? (
                    <div className="tracking-dot" />
                  ) : (
                    <div className="w-2 h-2 rounded-full border border-white/40 mt-1" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                      {day.dayName.substring(0, 3)}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 uppercase font-bold">
                      {labelText}
                    </span>
                  </div>
                  <h4 className={`text-sm font-bold mt-0.5 ${isCompleted ? "line-through text-zinc-500" : "text-white"}`}>
                    {day.name}
                  </h4>
                  {day.bikeFinisher && (
                    <span className="text-[10px] font-mono text-zinc-400 block mt-0.5 uppercase tracking-wide">
                      + Bike Finisher Included
                    </span>
                  )}
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-zinc-500 rotate-180" />
            </div>
          );
        })}
      </div>

      {/* Week Progression Focus */}
      {weekPlan.progressionFocus && weekPlan.progressionFocus.length > 0 && (
        <div className="apple-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-tight text-white">Week {selectedWeekNum} Progression Focus</h3>
          </div>
          <ul className="space-y-2">
            {weekPlan.progressionFocus.map((focus, i) => (
              <li key={i} className="text-sm text-zinc-300 leading-relaxed flex items-start gap-2">
                <span className="text-zinc-600 select-none">•</span>
                <span>{focus}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Week Nutrition Rules Card - styled with apple-card */}
      <div className="apple-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-white" />
            <h3 className="text-sm font-bold uppercase tracking-tight text-white">Week {selectedWeekNum} Nutrition Guide</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Training Days</span>
            <span className="text-sm font-bold text-white block mt-1">{weekPlan.nutrition.training.calories.toLocaleString()} kcal</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">{weekPlan.nutrition.training.protein}g P / {weekPlan.nutrition.training.fat} F / {weekPlan.nutrition.training.carbs} C</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Non-Training Days</span>
            <span className="text-sm font-bold text-white block mt-1">{weekPlan.nutrition.nonTraining.calories.toLocaleString()} kcal</span>
            <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">{weekPlan.nutrition.nonTraining.protein}g P / {weekPlan.nutrition.nonTraining.fat} F / {weekPlan.nutrition.nonTraining.carbs} C</span>
          </div>
        </div>

        <div className="space-y-2">
          {weekPlan.nutrition.tips.map((tip, i) => (
            <div key={i} className="text-xs text-zinc-400 leading-relaxed flex items-start gap-2">
              <span className="text-zinc-600 select-none">•</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
