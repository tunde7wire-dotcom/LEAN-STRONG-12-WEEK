const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We need to calculate if the day is fully complete
const originalCompleteStr = `    // Save completed day status
    const updatedCompletedDays = {
      ...settings.completedDays,
      [\`W\${selectedWeekNum}-D\${selectedDayIndex}\`]: true
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

    alert("Workout successfully completed! Excellent progression effort. Rest timer cleared.");`;

const newCompleteStr = `    // Save completed day status
    const dayPlan = SEEDED_PLANS[selectedWeekNum - 1].days[selectedDayIndex];
    let isDayComplete = true;
    let unmetStepTarget = false;

    if (!dayPlan.isTrainingDay) {
      // For active recovery, calculate completion based on logs
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
          }
        }
      });
    }

    const updatedCompletedDays = { ...settings.completedDays };
    if (isDayComplete) {
      updatedCompletedDays[\`W\${selectedWeekNum}-D\${selectedDayIndex}\`] = true;
    } else {
      delete updatedCompletedDays[\`W\${selectedWeekNum}-D\${selectedDayIndex}\`];
    }

    const updatedSettings = {
      ...settings,
      completedDays: updatedCompletedDays
    };
    setSettings(updatedSettings);
    saveAppSettings(updatedSettings);

    // Only clear if the day is complete, or if it's training day (where we just mark complete)? 
    // Wait, if unmetStepTarget, do we clear the active workout? 
    // The prompt says:
    // If the user taps the completion action while the required step threshold is unmet:
    // - save the entered data
    // - keep the overall day incomplete
    // - show a small explanation such as: “Step target not yet met.”
    // - do not add a "Complete anyway" override.
    
    // We already save the bestSetLogs which acts as the entered data.
    // BUT what about ActiveWorkoutState? If we clear it, the user will lose uncommitted data if they haven't finished? 
    // But they just clicked complete. Let's just save the logs to ActiveWorkoutState so it's not lost.
    
    if (!isDayComplete) {
      // Just save active workout so data isn't lost
      const newActiveWorkout = {
        weekNumber: selectedWeekNum,
        dayIndex: selectedDayIndex,
        startTime: activeWorkoutState?.startTime || Date.now(),
        elapsedSeconds: activeWorkoutState?.elapsedSeconds || 0,
        logs: loggedSets as any,
        currentExerciseIndex: 0,
        isActive: true,
        timerEndTime: timerEndTime,
        timerDurationSeconds: 0
      };
      setActiveWorkoutState(newActiveWorkout);
      saveActiveWorkout(newActiveWorkout);
      
      if (unmetStepTarget) {
        alert("Session saved. Step target not yet met.");
      } else {
        alert("Session saved. Some required activities are incomplete.");
      }
    } else {
      setActiveWorkoutState(null);
      saveActiveWorkout(null);
      setTimerEndTime(null);
      alert("Workout successfully completed! Excellent progression effort. Rest timer cleared.");
    }
`;

code = code.replace(originalCompleteStr, newCompleteStr);
fs.writeFileSync('src/App.tsx', code);
