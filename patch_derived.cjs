const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const newDerived = `  const getDerivedCompletedDays = () => {
    const derived = { ...settings.completedDays };
    Object.keys(derived).forEach(key => {
      if (derived[key]) {
        const match = key.match(/W(\\d+)-D(\\d+)/);
        if (match) {
          const w = parseInt(match[1], 10);
          const d = parseInt(match[2], 10);
          const plan = SEEDED_PLANS[w - 1]?.days[d];
          if (plan) {
            let complete = true;
            plan.exercises.forEach(ex => {
              if (ex.required && (ex.minimumSteps || ex.minimumDuration)) {
                const isActiveEditing = activeWorkout && activeWorkout.weekNumber === w && activeWorkout.dayIndex === d;
                let stepCount = 0;
                let durationCount = 0;
                
                if (isActiveEditing && activeWorkout.logs[ex.id]) {
                  stepCount = activeWorkout.logs[ex.id].steps || 0;
                  durationCount = activeWorkout.logs[ex.id].duration || 0;
                } else {
                  const histKey = \`W\${w}-D\${d}\`;
                  const histLogs = historicalLogs[histKey];
                  if (histLogs && histLogs[ex.id]) {
                    stepCount = histLogs[ex.id].steps || 0;
                    durationCount = histLogs[ex.id].duration || 0;
                  }
                }
                
                if (ex.minimumSteps && stepCount < ex.minimumSteps) {
                  complete = false;
                }
                if (ex.minimumDuration && durationCount < ex.minimumDuration) {
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

const regex = /  const getDerivedCompletedDays = \(\) => \{[\s\S]*?  \};\n/m;
code = code.replace(regex, newDerived + '\n');
fs.writeFileSync('src/App.tsx', code);
