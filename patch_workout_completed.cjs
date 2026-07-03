const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const oldChecklistStr = `  // Calculate overall day percentage completed dynamically
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(item => item.completed).length;`;

const newChecklistStr = `  const workoutCompleted = settings.completedDays[\`W\${currentWeekNum}-D\${currentDayIndex}\`] ? 1 : 0;
  // Calculate overall day percentage completed dynamically
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(item => item.completed).length;`;

code = code.replace(oldChecklistStr, newChecklistStr);
fs.writeFileSync('src/components/TodayTab.tsx', code);
