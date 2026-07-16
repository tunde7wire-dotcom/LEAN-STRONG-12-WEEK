const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const effectCode = `
  useEffect(() => {
    if (activeWorkout && !hasMeaningfulWorkoutData(activeWorkout) && !activeWorkout.timerEndTime) {
      setActiveWorkoutState(null);
      saveActiveWorkout(null);
    }
  }, []);
`;

if (!code.includes('if (activeWorkout && !hasMeaningfulWorkoutData(activeWorkout) && !activeWorkout.timerEndTime)')) {
  code = code.replace('const derivedCompletedDays = getDerivedCompletedDays();', effectCode + '\n  const derivedCompletedDays = getDerivedCompletedDays();');
}

fs.writeFileSync('src/App.tsx', code);
console.log('App patched clear on mount');
