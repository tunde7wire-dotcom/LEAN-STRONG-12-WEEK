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
  clearAllDatabase 
} from "./utils/db";

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
  const [exerciseSwaps, setExerciseSwaps] = useState<Record<string, string>>(getExerciseSwaps);
  const [activeWorkout, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(getActiveWorkout);

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
  const handleSaveExerciseSwap = (originalId: string, customName: string) => {
    const updated = { ...exerciseSwaps, [originalId]: customName };
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
  const handleCompleteActiveWorkout = (loggedSets: Record<string, { weight: number; reps: number }>) => {
    const todayStr = getLocalTodayString();
    const newBestSetLogs = { ...bestSetLogs };
    const newWeeklyBestSetLogs = { ...weeklyBestSetLogs };

    // Commit logged sets to our Best Set History
    Object.entries(loggedSets).forEach(([exId, log]) => {
      // Find the workout name (either original or swapped)
      const originalEx = SEEDED_PLANS[selectedWeekNum - 1].days[selectedDayIndex].exercises.find((e) => e.id === exId);
      if (originalEx) {
        const resolvedName = exerciseSwaps[exId] || originalEx.name;
        
        // Update all-time best
        const prev = bestSetLogs[resolvedName];
        if (!prev || log.weight > prev.weight || (log.weight === prev.weight && log.reps > prev.reps)) {
          newBestSetLogs[resolvedName] = {
            weight: log.weight,
            reps: log.reps,
            date: todayStr
          };
        }

        // Update weekly best
        if (!newWeeklyBestSetLogs[resolvedName]) {
          newWeeklyBestSetLogs[resolvedName] = {};
        }
        const prevWeekly = newWeeklyBestSetLogs[resolvedName][selectedWeekNum];
        if (!prevWeekly || log.weight > prevWeekly.weight || (log.weight === prevWeekly.weight && log.reps > prevWeekly.reps)) {
          newWeeklyBestSetLogs[resolvedName][selectedWeekNum] = {
            weekNumber: selectedWeekNum,
            exerciseId: exId,
            exerciseName: resolvedName,
            weight: log.weight,
            reps: log.reps,
            date: todayStr
          };
        }
      }
    });

    // Save logs
    setBestSetLogs(newBestSetLogs);
    saveBestSetLogs(newBestSetLogs);

    setWeeklyBestSetLogs(newWeeklyBestSetLogs);
    saveWeeklyBestSetLogs(newWeeklyBestSetLogs);

    // Save completed day status
    const updatedCompletedDays = {
      ...settings.completedDays,
      [`W${selectedWeekNum}-D${selectedDayIndex}`]: true
    };
    const updatedSettings = {
      ...settings,
      completedDays: updatedCompletedDays
    };
    setSettings(updatedSettings);
    saveAppSettings(updatedSettings);

    // Clear active workout state
    setActiveWorkoutState(null);
    saveActiveWorkout(null);
    setTimerEndTime(null);

    alert("Workout successfully completed! Excellent progression effort. Rest timer cleared.");
    
    // Redirect back to Weekly Planner
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
            settings={settings}
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
          />
        )}

        {activeTab === "overview" && (
          // Toggle between full roadmap overview or specific selected week dashboard
          selectedWeekNum ? (
            <WeeklyTab
              selectedWeekNum={selectedWeekNum}
              weekPlan={weekPlan}
              settings={settings}
              checkins={checkins}
              onBackToOverview={() => setSelectedWeekNum(0)}
              onSelectDay={handleSelectDayFromWeekly}
              onNavigateToTab={setActiveTab}
            />
          ) : (
            <OverviewTab
              currentWeekNum={planStatus === "active" ? liveWeekNum : 0}
              weeks={SEEDED_PLANS}
              settings={settings}
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
            settings={settings}
            activeWorkout={activeWorkout}
            previousBestSets={bestSetLogs}
            swaps={exerciseSwaps}
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
            settings={settings}
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
            settings={settings}
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
