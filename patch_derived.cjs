const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `            plan.exercises.forEach(ex => {
              if (ex.required) {
                // Check if the user is currently editing this workout
                const isActiveEditing = activeWorkout && activeWorkout.weekNumber === w && activeWorkout.dayIndex === d;
                let stepCount = 0;
                let hasLog = false;
                
                if (isActiveEditing && activeWorkout.logs[ex.id]) {
                  hasLog = true;
                  stepCount = activeWorkout.logs[ex.id].steps || 0;
                } else {
                  const swapData = exerciseSwaps[ex.id];
                  const resolvedName = typeof swapData === 'string' ? swapData : (swapData?.name || ex.name);
                  const weeklyLog = weeklyBestSetLogs[resolvedName]?.[w];
                  if (weeklyLog) {
                    hasLog = true;
                    stepCount = weeklyLog.steps || 0;
                  }
                }
                
                if (!hasLog) {
                  complete = false;
                } else if (ex.minimumSteps && stepCount < ex.minimumSteps) {
                  complete = false;
                }
              }
            });`;

const replaceStr = `            plan.exercises.forEach(ex => {
              if (ex.required && ex.minimumSteps) {
                // Check if the user is currently editing this workout
                const isActiveEditing = activeWorkout && activeWorkout.weekNumber === w && activeWorkout.dayIndex === d;
                let stepCount = 0;
                
                if (isActiveEditing && activeWorkout.logs[ex.id]) {
                  stepCount = activeWorkout.logs[ex.id].steps || 0;
                } else {
                  const swapData = exerciseSwaps[ex.id];
                  const resolvedName = typeof swapData === 'string' ? swapData : (swapData?.name || ex.name);
                  const weeklyLog = weeklyBestSetLogs[resolvedName]?.[w];
                  if (weeklyLog) {
                    stepCount = weeklyLog.steps || 0;
                  }
                }
                
                if (stepCount < ex.minimumSteps) {
                  complete = false;
                }
              }
            });`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
