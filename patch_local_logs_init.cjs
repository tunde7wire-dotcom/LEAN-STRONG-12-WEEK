const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const oldInit = `      Object.entries(activeWorkout.logs).forEach(([exId, log]) => {
        restored[exId] = { weight: log.weight.toString(), reps: log.reps.toString() };
      });`;

const newInit = `      Object.entries(activeWorkout.logs).forEach(([exId, log]: [string, any]) => {
        restored[exId] = { 
          weight: log.weight !== undefined ? log.weight.toString() : "", 
          reps: log.reps !== undefined ? log.reps.toString() : "",
          duration: log.duration !== undefined ? log.duration.toString() : "",
          steps: log.steps !== undefined ? log.steps.toString() : "",
          assistance: log.assistance !== undefined ? log.assistance.toString() : "",
          completed: log.completed
        };
      });`;

code = code.replace(oldInit, newInit);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
