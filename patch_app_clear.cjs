const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    if (!isDayComplete) {
      // Just save active workout so data isn't lost
      const newActiveWorkout = {
        weekNumber: selectedWeekNum,
        dayIndex: selectedDayIndex,
        startTime: activeWorkout?.startTime || Date.now(),
        elapsedSeconds: activeWorkout?.elapsedSeconds || 0,
        logs: loggedSets as any,
        currentExerciseIndex: 0,
        isActive: true,
        timerEndTime: timerEndTime,
        timerDurationSeconds: 0
      };
      setActiveWorkoutState(newActiveWorkout);
      saveActiveWorkout(newActiveWorkout);
      
      if (unmetDurationTarget) {
        alert("Session saved. Complete at least 25 minutes of Bike Zone 2 to finish this session.");
      } else if (unmetStepTarget) {
        alert("Session saved. Step target not yet met.");
      } else {
        alert("Session saved. Some required activities are incomplete.");
      }
    } else {
      setActiveWorkoutState(null);
      saveActiveWorkout(null);
      setTimerEndTime(null);
      alert("Workout successfully completed! Excellent progression effort. Rest timer cleared.");
    }`;

const replaceStr = `    // Always clear active workout after saving, whether complete or incomplete
    setActiveWorkoutState(null);
    saveActiveWorkout(null);
    setTimerEndTime(null);

    if (!isDayComplete) {
      if (unmetDurationTarget) {
        alert("Session saved. Complete at least 25 minutes of Bike Zone 2 to finish this session.");
      } else if (unmetStepTarget) {
        alert("Session saved. Step target not yet met.");
      } else {
        alert("Session saved. Some required activities are incomplete.");
      }
    } else {
      alert("Workout successfully completed! Excellent progression effort. Rest timer cleared.");
    }`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
