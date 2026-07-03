const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const oldDerived = `  // Dynamically calculate completion
  const getDerivedCompletedDays = () => {
    const derived = { ...settings.completedDays };
    // For each completed day, check if it's an active recovery day with unmet steps
    Object.keys(derived).forEach(key => {
      if (derived[key]) {
        const match = key.match(/W(\\d+)-D(\\d+)/);
        if (match) {
          const w = parseInt(match[1], 10);
          const d = parseInt(match[2], 10);
          const plan = SEEDED_PLANS[w - 1]?.days[d];
          if (plan && !plan.isTrainingDay) {
            let complete = true;
            plan.exercises.forEach(ex => {
              if (ex.required) {
                // Check if we have logs for this exercise in this week
                // weeklyBestSetLogs uses resolvedName (either from swap or originalName)
                const swapData = exerciseSwaps[ex.id];
                const resolvedName = typeof swapData === 'string' ? swapData : (swapData?.name || ex.name);
                
                const weeklyLog = weeklyBestSetLogs[resolvedName]?.[w];
                if (!weeklyLog) {
                  complete = false;
                } else if (ex.minimumSteps && (weeklyLog.steps || 0) < ex.minimumSteps) {
                  complete = false;
                }
              }
            });
            if (!complete) {
              derived[key] = false;
            }
          }
        }
      }
    });
    return derived;
  };`;

const newDerived = `  // Dynamically calculate completion
  const getDerivedCompletedDays = () => {
    const derived = { ...settings.completedDays };
    // For each completed day, check if it's an active recovery day with unmet steps
    Object.keys(derived).forEach(key => {
      if (derived[key]) {
        const match = key.match(/W(\\d+)-D(\\d+)/);
        if (match) {
          const w = parseInt(match[1], 10);
          const d = parseInt(match[2], 10);
          const plan = SEEDED_PLANS[w - 1]?.days[d];
          if (plan && !plan.isTrainingDay) {
            let complete = true;
            plan.exercises.forEach(ex => {
              if (ex.required) {
                // Check if the user is currently editing this workout
                const isActiveEditing = activeWorkoutState && activeWorkoutState.weekNumber === w && activeWorkoutState.dayIndex === d;
                let stepCount = 0;
                let hasLog = false;
                
                if (isActiveEditing && activeWorkoutState.logs[ex.id]) {
                  hasLog = true;
                  stepCount = activeWorkoutState.logs[ex.id].steps || 0;
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
            });
            if (!complete) {
              derived[key] = false;
            }
          }
        }
      }
    });
    return derived;
  };`;

code = code.replace(oldDerived, newDerived);
fs.writeFileSync('src/App.tsx', code);
