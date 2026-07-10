const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `                if (isActiveEditing && activeWorkout.logs[ex.id]) {
                  stepCount = activeWorkout.logs[ex.id].steps || 0;
                } else {
                  const swapData = exerciseSwaps[ex.id];
                  const resolvedName = typeof swapData === 'string' ? swapData : (swapData?.name || ex.name);
                  const weeklyLog = weeklyBestSetLogs[resolvedName]?.[w];
                  if (weeklyLog) {
                    stepCount = weeklyLog.steps || 0;
                  }
                }`;

const replaceStr = `                if (isActiveEditing && activeWorkout.logs[ex.id]) {
                  stepCount = activeWorkout.logs[ex.id].steps || 0;
                } else {
                  const histKey = \`W\${w}-D\${d}\`;
                  const histLogs = historicalLogs[histKey];
                  if (histLogs && histLogs[ex.id]) {
                    stepCount = histLogs[ex.id].steps || 0;
                  }
                }`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
