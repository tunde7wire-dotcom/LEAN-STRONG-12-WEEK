const fs = require('fs');

let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import { hasMeaningfulWorkoutData }')) {
  code = code.replace('import WorkoutTab from "./components/WorkoutTab";', 'import WorkoutTab from "./components/WorkoutTab";\nimport { hasMeaningfulWorkoutData } from "./utils/activeWorkoutHelpers";');
}

code = code.replace(/{activeWorkout\?.isActive && \(/g, '{hasMeaningfulWorkoutData(activeWorkout) && (');

fs.writeFileSync('src/App.tsx', code);
console.log('App patched');
