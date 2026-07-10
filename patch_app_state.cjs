const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '  const [activeWorkout, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(getActiveWorkout);',
  '  const [activeWorkout, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(getActiveWorkout);\n  const [historicalLogs, setHistoricalLogs] = useState<import("./types").HistoricalWorkoutLogs>(getHistoricalLogs);'
);

fs.writeFileSync('src/App.tsx', code);
