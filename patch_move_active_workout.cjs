const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// remove the existing declaration
code = code.replace(/^[ \t]*const \[activeWorkout, setActiveWorkoutState\] = useState<ActiveWorkoutState \| null>\(getActiveWorkout\);\r?\n?/m, '');

// insert it before getDerivedCompletedDays
code = code.replace(
  /^[ \t]*\/\/ Dynamically calculate completion/m,
  "  const [activeWorkout, setActiveWorkoutState] = useState<ActiveWorkoutState | null>(getActiveWorkout);\n\n  // Dynamically calculate completion"
);

fs.writeFileSync('src/App.tsx', code);
