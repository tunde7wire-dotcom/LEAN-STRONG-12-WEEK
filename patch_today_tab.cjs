const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

code = code.replace(
  '    if (item.id === "weighin" && !isWeighInDay) return false;\n    if (item.id === "waist" && !isWaistDay) return false;\n    return true;',
  `    if (item.id === "weighin" && !isWeighInDay) return false;
    if (item.id === "waist" && !isWaistDay) return false;
    if (item.id === "workout" && !dayPlan.exercises.some(ex => ex.required)) return false;
    return true;`
);

fs.writeFileSync('src/components/TodayTab.tsx', code);
