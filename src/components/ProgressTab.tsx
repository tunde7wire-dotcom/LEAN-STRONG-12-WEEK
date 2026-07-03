/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import { getLocalTodayString } from "../utils/dateUtils";
import React, { useState } from "react";
import { Scale, Calendar, LineChart, Edit, Check, TrendingDown, Info, Trash2, Save, Dumbbell, Trophy } from "lucide-react";
import { DailyWeightLog, WeeklyCheckIn, AppSettings, WeekPlan, BestSetLog, WeeklyBestSetLogs } from "../types";

interface ProgressTabProps {
  selectedWeekNum: number;
  weeks: WeekPlan[];
  settings: AppSettings;
  weightLogs: DailyWeightLog[];
  checkins: WeeklyCheckIn[];
  bestSetLogs: Record<string, BestSetLog>;
  weeklyBestSetLogs: WeeklyBestSetLogs;
  exerciseSwaps: Record<string, import("../types").CustomExerciseSwap | string>;
  onLogWeight: (weight: number, date: string) => void;
  onDeleteWeight: (date: string) => void;
  onSaveCheckIn: (checkIn: WeeklyCheckIn) => void;
}

export default function ProgressTab({
  selectedWeekNum,
  weeks,
  settings,
  weightLogs,
  checkins,
  bestSetLogs,
  weeklyBestSetLogs,
  exerciseSwaps,
  onLogWeight,
  onDeleteWeight,
  onSaveCheckIn,
}: ProgressTabProps) {
  const [newWeight, setNewWeight] = useState("");
  const [weightDate, setWeightDate] = useState(() => getLocalTodayString());

  // Checkin inputs
  const activeCheckin = checkins.find((c) => c.weekNumber === selectedWeekNum) || {
    weekNumber: selectedWeekNum,
    waist: undefined,
    highlights: "",
    improvements: "",
    completed: false,
    date: getLocalTodayString()
  };

  const [waist, setWaist] = useState<string>(activeCheckin.waist?.toString() || "");
  const [highlights, setHighlights] = useState(activeCheckin.highlights || "");
  const [improvements, setImprovements] = useState(activeCheckin.improvements || "");
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if week changes
  React.useEffect(() => {
    const updated = checkins.find((c) => c.weekNumber === selectedWeekNum) || {
      weekNumber: selectedWeekNum,
      waist: undefined,
      highlights: "",
      improvements: "",
      completed: false,
      date: getLocalTodayString()
    };
    setWaist(updated.waist?.toString() || "");
    setHighlights(updated.highlights || "");
    setImprovements(updated.improvements || "");
    setIsSaved(false);
  }, [selectedWeekNum, checkins]);

  // Strength Progression State
  // Build a map of exercise names to their tracking metadata
  const exerciseMetadata: Record<string, { trackingType: import("../types").TrackingType, progressMode: import("../types").ProgressMode, category?: string }> = {};
  
  // First from seeded plans
  weeks.forEach(week => {
    week.days.forEach(day => {
      day.exercises.forEach(ex => {
        exerciseMetadata[ex.name] = {
          trackingType: ex.trackingType,
          progressMode: ex.progressMode,
          category: ex.category
        };
      });
    });
  });
  
  // Then override with custom swaps
  Object.values(exerciseSwaps).forEach(swap => {
    if (typeof swap === 'object') {
      exerciseMetadata[swap.name] = {
        trackingType: swap.trackingType,
        progressMode: swap.progressMode
      };
    }
  });
  
  // Filter logged exercises by progressMode
  const loggedExercises = Object.keys(weeklyBestSetLogs).filter(name => {
    const meta = exerciseMetadata[name];
    // If we can't find metadata, default to showing it to preserve data
    if (!meta) return true;
    return meta.progressMode === 'weekly_best';
  }).sort();
  const [selectedExercise, setSelectedExercise] = useState<string>(loggedExercises[0] || "");

  // Update selected exercise if the list changes and nothing is selected
  React.useEffect(() => {
    if (!selectedExercise && loggedExercises.length > 0) {
      setSelectedExercise(loggedExercises[0]);
    }
  }, [loggedExercises, selectedExercise]);

  // Helper to get weight logs belonging to the currently selected week (W1-W12)
  const getLogsForWeek = (wkNum: number): DailyWeightLog[] => {
    const start = new Date(settings.startDate);
    
    return weightLogs.filter((log) => {
      const logDate = new Date(log.date);
      const diffTime = logDate.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const calcWeek = Math.floor(diffDays / 7) + 1;
      return calcWeek === wkNum;
    }).sort((a, b) => a.date.localeCompare(b.date));
  };

  const currentWeekLogs = getLogsForWeek(selectedWeekNum);

  // Automatically calculate the weekly average
  const calculateAverage = (logs: DailyWeightLog[]): number | null => {
    if (logs.length === 0) return null;
    const sum = logs.reduce((acc, log) => acc + log.weight, 0);
    return parseFloat((sum / logs.length).toFixed(2));
  };

  const weekAverage = calculateAverage(currentWeekLogs);

  // Calculate averages for ALL 12 weeks to display a progression trend list
  const allWeekAverages = weeks.map((w) => {
    const logs = getLogsForWeek(w.weekNumber);
    const avg = calculateAverage(logs);
    return {
      weekNumber: w.weekNumber,
      average: avg
    };
  });

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const wt = parseFloat(newWeight);
    if (!isNaN(wt) && wt > 0 && weightDate) {
      onLogWeight(wt, weightDate);
      setNewWeight("");
    }
  };

  const handleSaveCheckInLocal = () => {
    const waistNum = parseFloat(waist);
    onSaveCheckIn({
      weekNumber: selectedWeekNum,
      waist: !isNaN(waistNum) ? waistNum : undefined,
      highlights: highlights.trim(),
      improvements: improvements.trim(),
      completed: true,
      date: getLocalTodayString()
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const unitsStr = settings.units === "imperial" ? "lbs" : "kg";

  return (
    <div id="progress-tracker-system" className="max-w-md mx-auto px-4 pb-28 pt-4">
      <div className="mb-8">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">
          BIOMETRICS ENGINE
        </span>
        <h1 className="text-4xl font-black tracking-tighter text-white mt-1 uppercase">
          Week {String(selectedWeekNum).padStart(2, "0")} Progress
        </h1>
        <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
          Log morning weigh-ins to see your weekly averages, and perform physical checks of waist lines and athletic highlights to ensure your diet matches your targets.
        </p>
      </div>

      {/* Daily Weight Logger */}
      <div className="apple-card p-5 mb-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-white" />
          Morning Fasted Weigh-In
        </h3>

        <form onSubmit={handleAddWeight} className="space-y-3 mb-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                id="weight-input"
                type="number"
                step="any"
                placeholder={`Weight (${unitsStr})`}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                required
                className="w-full text-sm py-2.5 px-3 rounded-xl focus:border-white text-white"
              />
            </div>
            <div className="w-32">
              <input
                id="weight-date-input"
                type="date"
                value={weightDate}
                onChange={(e) => setWeightDate(e.target.value)}
                required
                className="w-full text-xs py-2.5 px-2 rounded-xl text-zinc-300 focus:border-white font-mono"
              />
            </div>
            <button
              id="weight-submit-btn"
              type="submit"
              className="bg-white text-black text-xs font-bold px-4 rounded-xl hover:bg-neutral-200 transition-colors uppercase tracking-wider font-mono"
            >
              Log
            </button>
          </div>
        </form>

        {/* Weekly Weight Data list */}
        {currentWeekLogs.length > 0 ? (
          <div>
            <div className="flex justify-between items-center py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Week {selectedWeekNum} Average:</span>
              <span className="text-base font-black text-white font-mono">
                {weekAverage} {unitsStr}
              </span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {currentWeekLogs.map((log) => (
                <div key={log.date} className="flex justify-between items-center text-xs py-1.5 px-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg">
                  <span className="font-mono text-zinc-400 font-bold uppercase">
                    {new Date(log.date).toLocaleDateString(undefined, { weekday: "short", month: "numeric", day: "numeric" })}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{log.weight} {unitsStr}</span>
                    <button
                      id={`weight-btn-delete-${log.date}`}
                      onClick={() => onDeleteWeight(log.date)}
                      className="text-zinc-500 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-white/5 border border-white/10 rounded-xl">
            <TrendingDown className="w-5 h-5 text-zinc-600 mx-auto mb-1.5" />
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">No weight entries yet.</span>
          </div>
        )}
      </div>

      {/* 12-Week Weight Progression Trend Chart */}
      <div className="apple-card p-5 mb-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <LineChart className="w-4 h-4 text-white" />
          12-Week Weight Trend Average
        </h3>

        <div className="space-y-2">
          {allWeekAverages.map((wk) => (
            <div key={wk.weekNumber} className="flex items-center justify-between text-xs py-2 border-b border-white/10 last:border-0">
              <span className={`font-mono font-bold uppercase ${wk.weekNumber === selectedWeekNum ? "text-white" : "text-zinc-500"}`}>
                Week {String(wk.weekNumber).padStart(2, "0")} {wk.weekNumber === selectedWeekNum ? " (Current)" : ""}
              </span>
              <span className="font-mono font-bold text-white">
                {wk.average ? `${wk.average} ${unitsStr}` : <span className="text-zinc-600 font-normal">—</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Progress */}
      <div className="apple-card p-5 mb-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <Dumbbell className="w-4 h-4 text-white" />
          Exercise Progress
        </h3>
        {loggedExercises.length > 0 ? (
          <div className="space-y-4">
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full text-sm py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono focus:border-white focus:outline-none"
            >
              {loggedExercises.map((ex) => (
                <option key={ex} value={ex} className="bg-neutral-900">
                  {ex}
                </option>
              ))}
            </select>

            {/* Simple Trend Chart */}
            <div className="h-16 flex items-end gap-1 px-1 pt-2 pb-1 border-b border-white/10">
              {(() => {
                const logs = weeklyBestSetLogs[selectedExercise] || {};
                const isBodyweight = Object.values(logs).every(l => !l.weight || l.weight === 0);
                const maxMetric = Math.max(1, ...Object.values(logs).map(l => isBodyweight ? l.reps : (l.weight || 0)));
                
                return weeks.map((w) => {
                  const log = logs[w.weekNumber];
                  const metric = log ? (isBodyweight ? log.reps : (log.weight || 0)) : 0;
                  const heightPct = log ? Math.max(10, (metric / maxMetric) * 100) : 0;
                  const isAllTimeBest = bestSetLogs[selectedExercise] && log && log.weight === bestSetLogs[selectedExercise].weight && log.reps === bestSetLogs[selectedExercise].reps;

                  return (
                    <div key={`chart-${w.weekNumber}`} className="flex-1 flex flex-col justify-end items-center h-full group relative" title={log ? (isBodyweight ? `${log.reps} reps` : `${log.weight} ${unitsStr} × ${log.reps}`) : "No entry"}>
                      {log && (
                        <div 
                          className={`w-full max-w-[12px] rounded-t-sm transition-all ${isAllTimeBest ? "bg-emerald-500" : (w.weekNumber === selectedWeekNum ? "bg-white" : "bg-zinc-600 group-hover:bg-zinc-400")}`} 
                          style={{ height: `${heightPct}%` }}
                        />
                      )}
                    </div>
                  );
                });
              })()}
            </div>

            <div className="space-y-2">
              {weeks.map((w, index) => {
                const log = weeklyBestSetLogs[selectedExercise]?.[w.weekNumber];
                
                // Find previous recorded log to calculate change
                let prevLog = null;
                for (let i = index - 1; i >= 0; i--) {
                  const pLog = weeklyBestSetLogs[selectedExercise]?.[weeks[i].weekNumber];
                  if (pLog) {
                    prevLog = pLog;
                    break;
                  }
                }
                
                let changeStr = null;
                let changeColor = "";
                
                if (log) {
                  if (prevLog) {
                    let improved = false;
                    let declined = false;
                    
                    if (log.weight > prevLog.weight) improved = true;
                    else if (log.weight < prevLog.weight) declined = true;
                    else if (log.reps > prevLog.reps) improved = true;
                    else if (log.reps < prevLog.reps) declined = true;

                    if (improved) {
                      changeStr = "Improved";
                      changeColor = "text-emerald-500";
                    } else if (declined) {
                      changeStr = "Below previous recorded week";
                      changeColor = "text-zinc-500";
                    } else {
                      changeStr = "Maintained";
                      changeColor = "text-zinc-500";
                    }
                  }
                }

                return (
                  <div key={w.weekNumber} className="flex flex-col text-xs py-2 border-b border-white/10 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className={`font-mono font-bold uppercase ${w.weekNumber === selectedWeekNum ? "text-white" : "text-zinc-500"}`}>
                          Week {String(w.weekNumber).padStart(2, "0")}
                        </span>
                        {changeStr && (
                          <span className={`text-[10px] font-mono tracking-wider ${changeColor}`}>
                            {changeStr}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="font-mono font-bold text-white">
                          {log ? (
                            <span>
                              {log.weight > 0 ? `${log.weight} ${unitsStr} ` : ''}<span className={log.weight > 0 ? "text-zinc-500 font-normal" : "hidden"}>x</span> {log.reps} {log.weight === 0 ? 'reps' : ''}
                            </span>
                          ) : (
                            <span className="text-zinc-600 font-normal">No entry</span>
                          )}
                        </span>
                        {log && log.date && (
                          <span className="text-[9px] text-zinc-500 font-mono">
                            {log.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {bestSetLogs[selectedExercise] && (() => {
              const allTime = bestSetLogs[selectedExercise];
              let allTimeWeek = null;
              for (const w of weeks) {
                const wl = weeklyBestSetLogs[selectedExercise]?.[w.weekNumber];
                if (wl && wl.weight === allTime.weight && wl.reps === allTime.reps) {
                  allTimeWeek = w.weekNumber;
                }
              }
              
              return (
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5" />
                    All-Time Best {allTimeWeek ? `(Week ${allTimeWeek})` : ''}
                  </span>
                  <span className="text-sm font-mono font-black text-white">
                    {allTime.weight > 0 ? `${allTime.weight} ${unitsStr} ` : ''}
                    <span className={allTime.weight > 0 ? "text-zinc-500 font-normal" : "hidden"}>x</span> {allTime.reps} {allTime.weight === 0 ? 'reps' : ''}
                  </span>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="text-center py-6 bg-white/5 border border-white/10 rounded-xl">
            <Info className="w-5 h-5 text-zinc-600 mx-auto mb-1.5" />
            <span className="text-xs text-zinc-500 font-mono uppercase tracking-wider">No workouts logged yet.</span>
          </div>
        )}
      </div>

      {/* Weekly Check-In form */}
      <div className="apple-card p-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
          <Edit className="w-4 h-4 text-white" />
          Week {selectedWeekNum} Check-In
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
              Waist Circumference ({settings.units === "imperial" ? "inches" : "cm"})
            </label>
            <input
              id="checkin-waist"
              type="number"
              step="any"
              placeholder="e.g. 32.5"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full text-sm py-2 px-3 text-white rounded-xl focus:border-white"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
              Athletic Performance Highlights
            </label>
            <textarea
              id="checkin-highlights"
              placeholder="e.g., Hit 10 reps on Squats effortlessly, strength levels moving upward..."
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 text-white rounded-xl focus:border-white placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
              What can be optimized next week?
            </label>
            <textarea
              id="checkin-improvements"
              placeholder="e.g., Get better sleep before heavy Saturday, prep high-protein shake on time..."
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              rows={3}
              className="w-full text-xs p-3 text-white rounded-xl focus:border-white placeholder:text-zinc-600"
            />
          </div>

          <button
            id="checkin-save-btn"
            onClick={handleSaveCheckInLocal}
            className="w-full bg-white text-black font-extrabold text-xs py-3.5 rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <Save className="w-4 h-4" />
            {isSaved ? "Saved Successfully!" : "Save Week Check-In"}
          </button>
        </div>
      </div>
    </div>
  );
}
