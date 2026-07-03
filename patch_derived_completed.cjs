const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const derivedStr = `  const [exerciseSwaps, setExerciseSwaps] = useState<Record<string, import("./types").CustomExerciseSwap | string>>(getExerciseSwaps);

  // Dynamically calculate completion
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
  };

  const derivedCompletedDays = getDerivedCompletedDays();
  const derivedSettings = { ...settings, completedDays: derivedCompletedDays };
`;

code = code.replace(`  const [exerciseSwaps, setExerciseSwaps] = useState<Record<string, import("./types").CustomExerciseSwap | string>>(getExerciseSwaps);`, derivedStr);

// Now replace all `settings={settings}` passed to children with `settings={derivedSettings}` where appropriate.
// Also inside TodayTab and OverviewTab and ProgressTab we pass settings.

code = code.replace(/settings=\{settings\}/g, "settings={derivedSettings}");
fs.writeFileSync('src/App.tsx', code);
