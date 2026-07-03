const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// 2. Replace all instances of `activeWorkoutState` (except setActiveWorkoutState)
// We know the exact substrings:
code = code.replace(/activeWorkoutState && activeWorkoutState\.weekNumber/g, "activeWorkout && activeWorkout.weekNumber");
code = code.replace(/activeWorkoutState\.dayIndex/g, "activeWorkout.dayIndex");
code = code.replace(/activeWorkoutState\.logs/g, "activeWorkout.logs");
code = code.replace(/activeWorkoutState\?\.startTime/g, "activeWorkout?.startTime");
code = code.replace(/activeWorkoutState\?\.elapsedSeconds/g, "activeWorkout?.elapsedSeconds");

fs.writeFileSync('src/App.tsx', code);
