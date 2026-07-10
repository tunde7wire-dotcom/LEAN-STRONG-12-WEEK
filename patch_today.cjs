const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

code = code.replace(
  'subtitle: dayPlan.isTrainingDay ? "Target strength set progression" : "Active physical recovery & walk",',
  'subtitle: dayPlan.isTrainingDay ? "Target strength set progression" : (dayPlan.exercises[0]?.name === "Steps Focus Only" ? "Active physical recovery & walk" : "Complete required active recovery"),'
);

fs.writeFileSync('src/components/TodayTab.tsx', code);
