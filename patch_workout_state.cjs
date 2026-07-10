const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const targetStr = `  const [localLogs, setLocalLogs] = useState<Record<string, { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean }>>(() => {
    // If there is an activeWorkout, restore it
    if (activeWorkout && activeWorkout.weekNumber === selectedWeekNum && activeWorkout.dayIndex === dayIndex) {
      const restored: Record<string, { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean }> = {};
      Object.entries(activeWorkout.logs).forEach(([exId, log]: [string, any]) => {
        restored[exId] = { 
          weight: log.weight !== undefined ? log.weight.toString() : "", 
          reps: log.reps !== undefined ? log.reps.toString() : "",
          duration: log.duration !== undefined ? log.duration.toString() : "",
          steps: log.steps !== undefined ? log.steps.toString() : "",
          assistance: log.assistance !== undefined ? log.assistance.toString() : "",
          completed: log.completed
        };
      });
      return restored;
    }
    return {};
  });`;

const replaceStr = `  const [localLogs, setLocalLogs] = useState<Record<string, { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean }>>(() => {
    // If there is an activeWorkout, restore it
    if (activeWorkout && activeWorkout.weekNumber === selectedWeekNum && activeWorkout.dayIndex === dayIndex) {
      const restored: Record<string, { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean }> = {};
      Object.entries(activeWorkout.logs).forEach(([exId, log]: [string, any]) => {
        restored[exId] = { 
          weight: log.weight !== undefined ? log.weight.toString() : "", 
          reps: log.reps !== undefined ? log.reps.toString() : "",
          duration: log.duration !== undefined ? log.duration.toString() : "",
          steps: log.steps !== undefined ? log.steps.toString() : "",
          assistance: log.assistance !== undefined ? log.assistance.toString() : "",
          completed: log.completed
        };
      });
      return restored;
    }
    
    // Otherwise, check if there are historical logs for this day
    const histKey = \`W\${selectedWeekNum}-D\${dayIndex}\`;
    if (historicalLogs && historicalLogs[histKey]) {
      const restored: Record<string, { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean }> = {};
      Object.entries(historicalLogs[histKey]).forEach(([exId, log]: [string, any]) => {
        restored[exId] = { 
          weight: log.weight !== undefined ? log.weight.toString() : "", 
          reps: log.reps !== undefined ? log.reps.toString() : "",
          duration: log.duration !== undefined ? log.duration.toString() : "",
          steps: log.steps !== undefined ? log.steps.toString() : "",
          assistance: log.assistance !== undefined ? log.assistance.toString() : "",
          completed: log.completed
        };
      });
      return restored;
    }

    return {};
  });`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
