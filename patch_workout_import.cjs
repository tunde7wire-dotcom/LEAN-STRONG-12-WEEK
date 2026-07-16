const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

if (!code.includes('import { hasMeaningfulWorkoutData }')) {
  code = code.replace('import { WeekPlan, DayPlan,', 'import { hasMeaningfulWorkoutData } from "../utils/activeWorkoutHelpers";\nimport { WeekPlan, DayPlan,');
}

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
console.log('Import patched');
