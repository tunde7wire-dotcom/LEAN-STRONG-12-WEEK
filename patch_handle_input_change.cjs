const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const oldHandleInput = `    // Build the format for active workout storage
    const logsForParent: Record<string, { weight: number; reps: number }> = {};
    Object.entries(updated).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string };
      const wt = parseFloat(log.weight);
      const rp = parseInt(log.reps, 10);
      if (!isNaN(wt) && !isNaN(rp)) {
        logsForParent[exId] = { weight: wt, reps: rp };
      }
    });

    onSaveActiveWorkout({
      weekNumber: selectedWeekNum,
      dayIndex,
      startTime: activeWorkout?.startTime || Date.now(),
      elapsedSeconds: activeWorkout?.elapsedSeconds || 0,
      logs: logsForParent,
      currentExerciseIndex: 0,
      isActive: true,
      timerEndTime: activeWorkout?.timerEndTime || null,
      timerDurationSeconds: activeWorkout?.timerDurationSeconds || settings.timerDuration
    });`;

const newHandleInput = `    // Build the format for active workout storage
    const logsForParent: any = {};
    Object.entries(updated).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean };
      const parsed: any = {};
      if (log.weight) parsed.weight = parseFloat(log.weight);
      if (log.reps) parsed.reps = parseInt(log.reps, 10);
      if (log.duration) parsed.duration = parseFloat(log.duration);
      if (log.steps) parsed.steps = parseInt(log.steps, 10);
      if (log.assistance) parsed.assistance = parseFloat(log.assistance);
      if (log.completed !== undefined) parsed.completed = log.completed;
      if (Object.keys(parsed).length > 0) {
        logsForParent[exId] = parsed;
      }
    });

    onSaveActiveWorkout({
      weekNumber: selectedWeekNum,
      dayIndex,
      startTime: activeWorkout?.startTime || Date.now(),
      elapsedSeconds: activeWorkout?.elapsedSeconds || 0,
      logs: logsForParent,
      currentExerciseIndex: 0,
      isActive: true,
      timerEndTime: activeWorkout?.timerEndTime || null,
      timerDurationSeconds: activeWorkout?.timerDurationSeconds || settings.timerDuration
    });`;

code = code.replace(oldHandleInput, newHandleInput);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
