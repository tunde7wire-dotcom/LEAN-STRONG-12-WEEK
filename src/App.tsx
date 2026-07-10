/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getLocalTodayString } from "./utils/dateUtils";
import React, { useState, useEffect } from "react";
import { 
  Dumbbell, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Settings as SettingsIcon, 
  Activity, 
  CheckCircle,
  Timer
} from "lucide-react";

// Subcomponents
import TodayTab from "./components/TodayTab";
import OverviewTab from "./components/OverviewTab";
import WeeklyTab from "./components/WeeklyTab";
import WorkoutTab from "./components/WorkoutTab";
import MealsTab from "./components/MealsTab";
import ProgressTab from "./components/ProgressTab";
import SettingsTab from "./components/SettingsTab";
import RestTimer from "./components/RestTimer";

// Models & Seed Data
import { SEEDED_PLANS } from "./utils/planData";
import { WeekPlan, DayPlan, AppSettings, DailyWeightLog, WeeklyCheckIn, BestSetLog, WeeklyBestSetLogs, ActiveWorkoutState } from "./types";

// DB utilities
import { 
  getBestSetLogs, 
  saveBestSetLogs, 
  getWeeklyBestSetLogs,
  saveWeeklyBestSetLogs,
  getDailyWeightLogs, 
  saveDailyWeightLogs, 
  getWeeklyCheckIns, 
  saveWeeklyCheckIns, 
  getAppSettings, 
  saveAppSettings, 
  getActiveWorkout, 
  saveActiveWorkout, 
  getExerciseSwaps, 
  saveExerciseSwaps,
  clearAllDatabase, getHistoricalLogs, saveHistoricalLogs } from "./utils/db";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>("today"); // today, overview, meals, progress, settings, workout
  
  // Current Live Week/Day from Start Date
  const [liveWeekNum, setLiveWeekNum] = useState(1);
  const [liveDayIndex, setLiveDayIndex] = useState(0);

  // User Selection Overrides (allows navigating around weeks/days)
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(1);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  // Database / LocalStorage state
  const [settings, setSettings] = useState<AppSettings>(getAppSettings);
  const [weightLogs, setWeightLogs] = useState<DailyWeightLog[]>(getDailyWeightLogs);
  const [checkins, setCheckins] = useState<WeeklyCheckIn[]>(getWeeklyCheckIns);
  const [bestSetLogs, setBestSetLogs] = useState<Record<string, BestSetLog>>(getBestSetLogs);
  const [weeklyBestSetLogs, setWeeklyBestSetLogs] = useState<WeeklyBestSetLogs>(getWeeklyBestSetLogs);
  const [exerciseSwaps, setExerciseSwaps] = useState<Record<string, import("./types").CustomExerciseSwap | string>>(getExerciseSwaps);

  const [activeWorkout, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(getActiveWorkout);
  const [historicalLogs, setHistoricalLogs] = useState<import("./types").HistoricalWorkoutLogs>(getHistoricalLogs);

  // Dynamically calculate completion
  const getDerivedCompletedDays = () => {
    const derived = { ...settings.completedDays };
    // For each completed day, check if it's an active recovery day with unmet steps
    Object.keys(derived).forEach(key => {
      if (derived[key]) {
        const match = key.match(/W(\d+)-D(\d+)/);
        if (match) {
          const w = parseInt(match[1], 10);
          const d = parseInt(match[2], 10);
          const plan = SEEDED_PLANS[w - 1]?.days[d];
          if (plan && !plan.isTrainingDay) {
            let complete = true;
            plan.exercises.forEach(ex => {
              if (ex.required && ex.minimumSteps) {
                // Check if the user is currently editing this workout
                const isActiveEditing = activeWorkout && activeWorkout.weekNumber === w && activeWorkout.dayIndex === d;
                let stepCount = 0;
                
                if (isActiveEditing && activeWorkout.logs[ex.id]) {
                  stepCount = activeWorkout.logs[ex.id].steps || 0;
                } else {
                  const histKey = `W${w}-D${d}`;
                  const histLogs = historicalLogs[histKey];
                  if (histLogs && histLogs[ex.id]) {
                    stepCount = histLogs[ex.id].steps || 0;
                  }
                }
                
                if (stepCount < ex.minimumSteps) {
                  complete = false;
                }
              }
            });
            if (!complete) {
              derived[key] = false;
            }
          }
        }
      }
    });
    return derived;
  };

  const derivedCompletedDays = getDerivedCompletedDays();
  const derivedSettings = { ...settings, completedDays: derivedCompletedDays };


  // Timer State (Embedded in Bottom Floating Timer)
  const [timerEndTime, setTimerEndTime] = useState<number | null>(() => activeWorkout?.timerEndTime || null);
  const [timerDuration, setTimerDuration] = useState<number>(() => settings.timerDuration);
  const [timerOpen, setTimerOpen] = useState(false);

  const [planStatus, setPlanStatus] = useState<'pre-start' | 'active' | 'completed'>('active');
  const [elapsedDays, setElapsedDays] = useState(0);

  // Calculate and sync current plan position based on Start Date
  useEffect(() => {
    const [year, month, day] = settings.startDate.split('-').map(Number);
    const start = new Date(year, month - 1, day);
    start.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const msPerDay = 1000 * 60 * 60 * 24;
    const utcStart = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const utcToday = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((utcToday - utcStart) / msPerDay);
    
    setElapsedDays(diffDays);

    let currentWeek: number;
    let currentDayIndex: number;
    let status: 'pre-start' | 'active' | 'completed';

    if (diffDays < 0) {
      status = 'pre-start';
      currentWeek = 1;
      currentDayIndex = 0;
    } else if (diffDays >= 84) {
      status = 'completed';
      currentWeek = 12;
      currentDayIndex = 6;
    } else {
      status = 'active';
      currentWeek = Math.floor(diffDays / 7) + 1;
      currentDayIndex = diffDays % 7;
    }

    setPlanStatus(status);
    setLiveWeekNum(currentWeek);
    setLiveDayIndex(currentDayIndex);

    // Default user views to this live position on first load
    setSelectedWeekNum(currentWeek);
    setSelectedDayIndex(currentDayIndex);
  }, [settings.startDate]);

  // Handle setting updates
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveAppSettings(newSettings);
    setTimerDuration(newSettings.timerDuration);
  };

  // Log weights
  const handleLogWeight = (weight: number, date: string) => {
    const updated = [...weightLogs.filter((w) => w.date !== date), { weight, date }].sort((a, b) => a.date.localeCompare(b.date));
    setWeightLogs(updated);
    saveDailyWeightLogs(updated);
  };

  const handleDeleteWeight = (date: string) => {
    const updated = weightLogs.filter((w) => w.date !== date);
    setWeightLogs(updated);
    saveDailyWeightLogs(updated);
  };

  // Save weekly check-ins
  const handleSaveCheckIn = (checkIn: WeeklyCheckIn) => {
    const updated = [...checkins.filter((c) => c.weekNumber !== checkIn.weekNumber), checkIn];
    setCheckins(updated);
    saveWeeklyCheckIns(updated);
  };

  // Swap exercise names
  const handleSaveExerciseSwap = (originalId: string, customSwap: import("./types").CustomExerciseSwap | string) => {
    const updated = { ...exerciseSwaps, [originalId]: customSwap };
    setExerciseSwaps(updated);
    saveExerciseSwaps(updated);
  };

  const handleResetExerciseSwap = (originalId: string) => {
    const updated = { ...exerciseSwaps };
    delete updated[originalId];
    setExerciseSwaps(updated);
    saveExerciseSwaps(updated);
  };

  // Save/Restore active workout state
  const handleSaveActiveWorkoutState = (state: ActiveWorkoutState | null) => {
    setActiveWorkoutState(state);
    saveActiveWorkout(state);
    if (state) {
      setTimerEndTime(state.timerEndTime);
    }
  };

  // Complete Active Workout
  const handleCompleteActiveWorkout = (loggedSets: Record<string, { weight?: number; reps?: number; duration?: number; steps?: number; assistance?: number; completed?: boolean }>) => {
    const todayStr = getLocalTodayString();
    const newBestSetLogs = { ...bestSetLogs };
    const newWeeklyBestSetLogs = { ...weeklyBestSetLogs };

    const dayPlan = SEEDED_PLANS[selectedWeekNum - 1].days[selectedDayIndex];

    // Commit logged sets to our Best Set History
    Object.entries(loggedSets).forEach(([exId, log]) => {
      const originalEx = dayPlan.exercises.find((e) => e.id === exId);
      if (originalEx) {
        const swapData = exerciseSwaps[exId];
        const resolvedName = typeof swapData === 'string' ? swapData : (swapData?.name || originalEx.name);
        const resolvedTrackingType = typeof swapData === 'object' ? swapData.trackingType : originalEx.trackingType;
        const resolvedProgressMode = typeof swapData === 'object' ? swapData.progressMode : originalEx.progressMode;
        const canonicalId = typeof swapData === 'object' ? swapData.canonicalId : originalEx.canonicalId;

        const progressKey = canonicalId || resolvedName;
        
        if (resolvedProgressMode === 'weekly_best') {
          const getScore = (l: any) => {
            if (!l) return -1;
            if (resolvedTrackingType === 'duration') return l.duration || 0;
            if (resolvedTrackingType === 'steps') return l.steps || 0;
            if (resolvedTrackingType === 'reps_only') return l.reps || 0;
            if (resolvedTrackingType === 'assistance_reps') return (l.assistance ? (1000 - l.assistance) : l.reps) || 0;
            return (l.weight && l.weight > 0) ? (l.weight * 1000 + l.reps) : (l.reps || 0);
          };

          const logScore = getScore(log);
          
          const prev = bestSetLogs[progressKey];
          if (!prev || logScore > getScore(prev)) {
            newBestSetLogs[progressKey] = {
              weight: log.weight || 0,
              reps: log.reps || 0,
              duration: log.duration,
              steps: log.steps,
              assistance: log.assistance,
              date: todayStr
            };
          }
          
          if (!newWeeklyBestSetLogs[progressKey]) {
            newWeeklyBestSetLogs[progressKey] = {};
          }
          const prevWeekly = newWeeklyBestSetLogs[progressKey][selectedWeekNum];
          if (!prevWeekly || logScore > getScore(prevWeekly)) {
            newWeeklyBestSetLogs[progressKey][selectedWeekNum] = {
              weekNumber: selectedWeekNum,
              exerciseId: exId,
              exerciseName: progressKey,
              weight: log.weight || 0,
              reps: log.reps || 0,
              duration: log.duration,
              steps: log.steps,
              assistance: log.assistance,
              date: todayStr
            };
          }
        }
      }
    });

    setBestSetLogs(newBestSetLogs);
    saveBestSetLogs(newBestSetLogs);
    setWeeklyBestSetLogs(newWeeklyBestSetLogs);
    saveWeeklyBestSetLogs(newWeeklyBestSetLogs);

    let isDayComplete = true;
    let unmetStepTarget = false;
    let unmetDurationTarget = false;
    let unmetDurationMsg = "";
    
    // Always validate required fields against entered logs
    dayPlan.exercises.forEach(ex => {
      if (ex.required) {
        const log = loggedSets[ex.id];
        if (!log) {
          isDayComplete = false;
        } else {
          if (ex.minimumSteps && (log.steps || 0) < ex.minimumSteps) {
            isDayComplete = false;
            unmetStepTarget = true;
          }
          if (ex.minimumDuration && (log.duration || 0) < ex.minimumDuration) {
            isDayComplete = false;
            unmetDurationTarget = true;
            unmetDurationMsg = `Session saved. Complete at least ${ex.minimumDuration} minutes of ${ex.name} to finish this session.`;
          }
        }
      }
    });

    const isRequiredDay = dayPlan.exercises.some(ex => ex.required);

    // Persist all valid entries into HistoricalLogs
    const dayKey = `W${selectedWeekNum}-D${selectedDayIndex}`;
    const newHistoricalLogs = { ...historicalLogs };
    const validLogsForDay: Record<string, any> = { ...(newHistoricalLogs[dayKey] || {}) };
    
    Object.entries(loggedSets).forEach(([exId, log]) => {
      if (
        (log.weight !== undefined && !isNaN(log.weight)) ||
        (log.reps !== undefined && !isNaN(log.reps)) ||
        (log.duration !== undefined && !isNaN(log.duration)) ||
        (log.steps !== undefined && !isNaN(log.steps)) ||
        (log.assistance !== undefined && !isNaN(log.assistance)) ||
        log.completed !== undefined
      ) {
        validLogsForDay[exId] = { ...validLogsForDay[exId], ...log };
      }
    });

    if (Object.keys(validLogsForDay).length > 0) {
      newHistoricalLogs[dayKey] = validLogsForDay;
      setHistoricalLogs(newHistoricalLogs);
      saveHistoricalLogs(newHistoricalLogs);
    }

    const updatedCompletedDays = { ...settings.completedDays };
    // Only consider the day "completed" for required days
    if (isRequiredDay) {
      if (isDayComplete) {
        updatedCompletedDays[dayKey] = true;
      } else {
        delete updatedCompletedDays[dayKey];
      }
    }
    
    const updatedSettings = {
      ...settings,
      completedDays: updatedCompletedDays
    };
    setSettings(updatedSettings);
    saveAppSettings(updatedSettings);

    setActiveWorkoutState(null);
    saveActiveWorkout(null);
    setTimerEndTime(null);

    if (isRequiredDay && !isDayComplete) {
      if (unmetDurationTarget) {
        alert(unmetDurationMsg);
      } else if (unmetStepTarget) {
        alert("Session saved. Step target not yet met.");
      } else {
        alert("Session saved. Some required activities are incomplete.");
      }
    } else if (isRequiredDay && isDayComplete) {
      alert("Workout successfully completed! Excellent progression effort. Rest timer cleared.");
    } else {
      alert("Optional session saved.");
    }

    setActiveTab("overview");
  };

  // Handle active rest timers
  const handleTimerStart = (seconds: number) => {
    const endTime = Date.now() + seconds * 1000;
    setTimerEndTime(endTime);
    
    if (activeWorkout) {
      const updated = { ...activeWorkout, timerEndTime };
      setActiveWorkoutState(updated);
      saveActiveWorkout(updated);
    }
  };

  const handleTimerPause = () => {
    setTimerEndTime(null);
    if (activeWorkout) {
      const updated = { ...activeWorkout, timerEndTime: null };
      setActiveWorkoutState(updated);
      saveActiveWorkout(updated);
    }
  };

  const handleTimerReset = () => {
    setTimerEndTime(null);
    if (activeWorkout) {
      const updated = { ...activeWorkout, timerEndTime: null };
      setActiveWorkoutState(updated);
      saveActiveWorkout(updated);
    }
  };

  const handleTriggerRestTimer = () => {
    setTimerOpen(true);
    handleTimerStart(settings.timerDuration);
  };

  // Determine current active plan week data
  const weekPlan: WeekPlan = SEEDED_PLANS[selectedWeekNum - 1] || SEEDED_PLANS[0];
  const dayPlan: DayPlan = weekPlan.days[selectedDayIndex] || weekPlan.days[0];

  // Helper to check if weight was logged today (fasted morning weight)
  const todayStr = getLocalTodayString();
  const todayWeightLog = weightLogs.find((w) => w.date === todayStr);
  const weightLoggedToday = !!todayWeightLog;
  const weightValueToday = todayWeightLog?.weight || null;

  // Clear data
  const handleClearAllData = async () => {
    await clearAllDatabase();
    setSettings(getAppSettings());
    setWeightLogs([]);
    setCheckins([]);
    setBestSetLogs({});
    setExerciseSwaps({});
    setActiveWorkoutState(null);
    setTimerEndTime(null);
  };

  // Navigation handlers
  const handleSelectWeekFromRoadmap = (weekNum: number) => {
    setSelectedWeekNum(weekNum);
    setSelectedDayIndex(0); // Start from Monday
  };

  const handleSelectDayFromWeekly = (dayIndex: number) => {
    setSelectedDayIndex(dayIndex);
    setActiveTab("workout");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none pb-20">
      
      {/* Top App Bar Header */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5 px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white" />
          <span className="font-mono text-xs font-black tracking-widest text-white uppercase">LEAN + STRONG</span>
        </div>
        
        {/* Active Workout Quick Indicator */}
        {activeWorkout?.isActive && (
          <button 
            id="header-btn-active-workout"
            onClick={() => {
              setSelectedWeekNum(activeWorkout.weekNumber);
              setSelectedDayIndex(activeWorkout.dayIndex);
              setActiveTab("workout");
            }}
            className="bg-white text-black font-mono font-black text-[9px] px-3 py-1.5 rounded flex items-center gap-1.5 uppercase animate-pulse hover:bg-neutral-200 transition-colors tracking-wider"
          >
            <Dumbbell className="w-3.5 h-3.5 fill-black text-black" />
            Live Workout
          </button>
        )}
      </header>

      {/* Main Tab Render Space */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "today" && (
          <TodayTab
            currentWeekNum={liveWeekNum}
            currentDayIndex={liveDayIndex}
            weekPlan={SEEDED_PLANS[liveWeekNum - 1] || SEEDED_PLANS[0]}
            dayPlan={(SEEDED_PLANS[liveWeekNum - 1] || SEEDED_PLANS[0]).days[liveDayIndex] || SEEDED_PLANS[0].days[0]}
            settings={derivedSettings}
            planStatus={planStatus}
            elapsedDays={elapsedDays}
            onStartWorkout={() => {
              setSelectedWeekNum(liveWeekNum);
              setSelectedDayIndex(liveDayIndex);
              setActiveTab("workout");
            }}
            onNavigateToTab={setActiveTab}
            onNavigateToWeek={(wk) => {
              setSelectedWeekNum(wk);
              setActiveTab("overview");
            }}
            weightLoggedToday={weightLoggedToday}
            weightValueToday={weightValueToday}
            checkins={checkins}
          />
        )}

        {activeTab === "overview" && (
          // Toggle between full roadmap overview or specific selected week dashboard
          selectedWeekNum ? (
            <WeeklyTab
              selectedWeekNum={selectedWeekNum}
              weekPlan={weekPlan}
              settings={derivedSettings}
              checkins={checkins}
              onBackToOverview={() => setSelectedWeekNum(0)}
              onSelectDay={handleSelectDayFromWeekly}
              onNavigateToTab={setActiveTab}
            />
          ) : (
            <OverviewTab
              currentWeekNum={planStatus === "active" ? liveWeekNum : 0}
              weeks={SEEDED_PLANS}
              settings={derivedSettings}
              checkins={checkins}
              onSelectWeek={handleSelectWeekFromRoadmap}
            />
          )
        )}

        {activeTab === "workout" && (
          <WorkoutTab
            currentWeekNum={planStatus === "active" ? liveWeekNum : 0}
            selectedWeekNum={selectedWeekNum}
            dayIndex={selectedDayIndex}
            weekPlan={weekPlan}
            dayPlan={dayPlan}
            settings={derivedSettings}
            activeWorkout={activeWorkout}
            previousBestSets={bestSetLogs}
            swaps={exerciseSwaps}
            historicalLogs={historicalLogs}
            onSaveActiveWorkout={handleSaveActiveWorkoutState}
            onCompleteWorkout={handleCompleteActiveWorkout}
            onTriggerRestTimer={handleTriggerRestTimer}
            onBackToWeekly={() => {
              setActiveTab("overview");
            }}
            onSaveExerciseSwap={handleSaveExerciseSwap}
            onResetExerciseSwap={handleResetExerciseSwap}
          />
        )}

        {activeTab === "meals" && (
          <MealsTab 
            selectedWeekNum={selectedWeekNum || liveWeekNum} 
            weekPlan={SEEDED_PLANS[(selectedWeekNum || liveWeekNum) - 1]} 
          />
        )}

        {activeTab === "progress" && (
          <ProgressTab
            selectedWeekNum={selectedWeekNum || liveWeekNum}
            weeks={SEEDED_PLANS}
            settings={derivedSettings}
            weightLogs={weightLogs}
            checkins={checkins}
            bestSetLogs={bestSetLogs}
            weeklyBestSetLogs={weeklyBestSetLogs}
            exerciseSwaps={exerciseSwaps}
            onLogWeight={handleLogWeight}
            onDeleteWeight={handleDeleteWeight}
            onSaveCheckIn={handleSaveCheckIn}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            settings={derivedSettings}
            onUpdateSettings={handleUpdateSettings}
            onClearAllData={handleClearAllData}
          />
        )}
      </main>

      {/* Persistent Floating Rest Timer */}
      {(timerOpen || timerEndTime !== null) && (
        <RestTimer
          durationSeconds={timerDuration}
          soundEnabled={settings.soundEnabled}
          onSoundToggle={(enabled) => handleUpdateSettings({ ...settings, soundEnabled: enabled })}
          onClose={() => setTimerOpen(false)}
          endTime={timerEndTime}
          onTimerStart={handleTimerStart}
          onTimerPause={handleTimerPause}
          onTimerReset={handleTimerReset}
        />
      )}

      {/* Persistent iOS Bottom Bar Navigation Menu */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 border-t border-white/5 pb-safe backdrop-blur-md">
        <div className="max-w-md mx-auto grid grid-cols-5 text-center py-2.5">
          
          <button
            id="nav-btn-today"
            onClick={() => setActiveTab("today")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "today" ? "text-white font-black" : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span className="text-[9px] font-mono uppercase tracking-wider">Today</span>
          </button>

          <button
            id="nav-btn-overview"
            onClick={() => {
              // Reset week selection to let user view overview list
              setSelectedWeekNum(0);
              setActiveTab("overview");
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "overview" && selectedWeekNum === 0 ? "text-white font-black" : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-[9px] font-mono uppercase tracking-wider">Roadmap</span>
          </button>

          <button
            id="nav-btn-meals"
            onClick={() => {
              if (selectedWeekNum === 0) {
                setSelectedWeekNum(liveWeekNum);
              }
              setActiveTab("meals");
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "meals" ? "text-white font-black" : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[9px] font-mono uppercase tracking-wider">Nutrition</span>
          </button>

          <button
            id="nav-btn-progress"
            onClick={() => {
              if (selectedWeekNum === 0) {
                setSelectedWeekNum(liveWeekNum);
              }
              setActiveTab("progress");
            }}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "progress" ? "text-white font-black" : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span className="text-[9px] font-mono uppercase tracking-wider">Progress</span>
          </button>

          <button
            id="nav-btn-settings"
            onClick={() => setActiveTab("settings")}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === "settings" ? "text-white font-black" : "text-zinc-500 hover:text-zinc-350"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span className="text-[9px] font-mono uppercase tracking-wider">Settings</span>
          </button>

        </div>
      </nav>

    </div>
  );
}
