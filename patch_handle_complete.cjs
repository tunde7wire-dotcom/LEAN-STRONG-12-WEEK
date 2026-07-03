const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    if (!dayPlan.isTrainingDay) {
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
    }`;

const replaceStr = `    let unmetDurationTarget = false;
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
            if (ex.name === "Bike Zone 2" && (log.duration || 0) < 25) {
              isDayComplete = false;
              unmetDurationTarget = true;
            }
          }
        }
      });
    }`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
