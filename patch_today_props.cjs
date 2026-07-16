const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

if (!code.includes('hasMeaningfulActiveWorkout?: boolean;')) {
  code = code.replace('planStatus?: \'pre-start\' | \'active\' | \'completed\';', 'planStatus?: \'pre-start\' | \'active\' | \'completed\';\n  hasMeaningfulActiveWorkout?: boolean;');
}

if (!code.includes('hasMeaningfulActiveWorkout,')) {
  code = code.replace('planStatus = \'active\',', 'planStatus = \'active\',\n  hasMeaningfulActiveWorkout = false,');
}

// Change title
const titleLogic = `title: (hasMeaningfulActiveWorkout && planStatus === 'active' && dayPlan.exercises.length > 0) ? "Resume Workout" : (dayPlan.exercises.length > 1 ? \`Log Workout: \${dayPlan.name}\` : \`Active Recovery: \${dayPlan.name}\`),`;
code = code.replace(/title: dayPlan\.exercises\.length > 1 \? `Log Workout: \$\{dayPlan\.name\}` : `Active Recovery: \$\{dayPlan\.name\}`,/, titleLogic);

fs.writeFileSync('src/components/TodayTab.tsx', code);
console.log('TodayTab patched');
