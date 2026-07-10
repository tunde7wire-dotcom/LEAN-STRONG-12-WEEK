const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Replace the handleCompleteActiveWorkout logic

const oldStart = '  const handleCompleteActiveWorkout = (loggedSets: Record<string, { weight?: number; reps?: number; duration?: number; steps?: number; assistance?: number; completed?: boolean }>) => {';
const oldEnd = '    // Redirect back to Weekly Planner\n    setActiveTab("overview");\n  };';

const regex = new RegExp(oldStart.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') + '[\\s\\S]*?' + oldEnd.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'));

const newLogic = `  const handleCompleteActiveWorkout = (loggedSets: Record<string, { weight?: number; reps?: number; duration?: number; steps?: number; assistance?: number; completed?: boolean }>) => {
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
            unmetDurationMsg = \`Session saved. Complete at least \${ex.minimumDuration} minutes of \${ex.name} to finish this session.\`;
          }
        }
      }
    });

    const isRequiredDay = dayPlan.exercises.some(ex => ex.required);

    // Persist all valid entries into HistoricalLogs
    const dayKey = \`W\${selectedWeekNum}-D\${selectedDayIndex}\`;
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
  };`;

if (!regex.test(code)) {
  console.log("Could not find block to replace.");
}
code = code.replace(regex, newLogic);
fs.writeFileSync('src/App.tsx', code);
