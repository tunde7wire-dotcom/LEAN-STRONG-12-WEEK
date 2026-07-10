const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = `  getActiveWorkout,
  saveActiveWorkout,
  getExerciseSwaps,
  saveExerciseSwaps,
} from "./utils/db";`;

const replaceImport = `  getActiveWorkout,
  saveActiveWorkout,
  getExerciseSwaps,
  saveExerciseSwaps,
  getHistoricalLogs,
  saveHistoricalLogs,
} from "./utils/db";`;
code = code.replace(targetImport, replaceImport);

const targetState = `  const [exerciseSwaps, setExerciseSwaps] = useState<Record<string, import("./types").CustomExerciseSwap | string>>(getExerciseSwaps);
  const [activeWorkout, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(getActiveWorkout);`;

const replaceState = `  const [exerciseSwaps, setExerciseSwaps] = useState<Record<string, import("./types").CustomExerciseSwap | string>>(getExerciseSwaps);
  const [activeWorkout, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(getActiveWorkout);
  const [historicalLogs, setHistoricalLogs] = useState<import("./types").HistoricalWorkoutLogs>(getHistoricalLogs);`;

code = code.replace(targetState, replaceState);
fs.writeFileSync('src/App.tsx', code);
