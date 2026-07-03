const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const oldComplete = `  const handleComplete = () => {
    // Convert current logs to numbers
    const finalLogs: Record<string, { weight: number; reps: number }> = {};
    Object.entries(localLogs).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string };
      const wt = parseFloat(log.weight);
      const rp = parseInt(log.reps, 10);
      if (!isNaN(wt) && !isNaN(rp)) {
        finalLogs[exId] = { weight: wt, reps: rp };
      }
    });

    onCompleteWorkout(finalLogs);
  };`;

const newComplete = `  const handleComplete = () => {
    // Convert current logs to numbers where applicable
    const finalLogs: Record<string, { weight?: number; reps?: number; duration?: number; steps?: number; assistance?: number; completed?: boolean }> = {};
    Object.entries(localLogs).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean };
      
      const parsed: any = {};
      if (log.weight) parsed.weight = parseFloat(log.weight);
      if (log.reps) parsed.reps = parseInt(log.reps, 10);
      if (log.duration) parsed.duration = parseFloat(log.duration);
      if (log.steps) parsed.steps = parseInt(log.steps, 10);
      if (log.assistance) parsed.assistance = parseFloat(log.assistance);
      if (log.completed !== undefined) parsed.completed = log.completed;
      
      if (Object.keys(parsed).length > 0) {
        finalLogs[exId] = parsed;
      }
    });

    onCompleteWorkout(finalLogs);
  };`;

code = code.replace(oldComplete, newComplete);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
