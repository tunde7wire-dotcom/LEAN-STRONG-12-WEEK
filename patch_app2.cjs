const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const discardFn = `
  const handleDiscardWorkout = () => {
    setActiveWorkoutState(null);
    saveActiveWorkout(null);
    setTimerEndTime(null);
  };
`;

code = code.replace('  // Handle active rest timers', discardFn + '\n  // Handle active rest timers');

code = code.replace('onCompleteWorkout={handleCompleteActiveWorkout}', 'onCompleteWorkout={handleCompleteActiveWorkout}\n            onDiscardWorkout={handleDiscardWorkout}');

fs.writeFileSync('src/App.tsx', code);
console.log('App patched 2');
