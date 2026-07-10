const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const targetStr = `  activeWorkout: ActiveWorkoutState | null;
  previousBestSets: Record<string, BestSetLog>; // exerciseName -> BestSetLog
  swaps: Record<string, import("../types").CustomExerciseSwap | string>;`;

const replaceStr = `  activeWorkout: ActiveWorkoutState | null;
  previousBestSets: Record<string, BestSetLog>; // exerciseName -> BestSetLog
  swaps: Record<string, import("../types").CustomExerciseSwap | string>;
  historicalLogs: import("../types").HistoricalWorkoutLogs;`;

code = code.replace(targetStr, replaceStr);

const targetProps = `  activeWorkout,
  previousBestSets,
  swaps,
  onSaveActiveWorkout,`;

const replaceProps = `  activeWorkout,
  previousBestSets,
  swaps,
  historicalLogs,
  onSaveActiveWorkout,`;

code = code.replace(targetProps, replaceProps);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
