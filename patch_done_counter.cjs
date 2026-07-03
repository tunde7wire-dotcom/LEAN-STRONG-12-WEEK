const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

code = code.replace(
  '{totalCompleted}/2 DONE',
  '{completedTasks}/{totalTasks} DONE'
);

fs.writeFileSync('src/components/TodayTab.tsx', code);
