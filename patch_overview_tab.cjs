const fs = require('fs');
let code = fs.readFileSync('src/components/OverviewTab.tsx', 'utf8');

// Add import SEEDED_PLANS if not present, but it probably is. Wait, it's not. Let's check imports.
// Actually let's just use `import { SEEDED_PLANS } from "../utils/planData";` if it's there.

code = code.replace(
  '  // Compute stats for each week\n  const getWeekStats = (wkNum: number) => {',
  `  // Compute stats for each week
  const getWeekStats = (wkNum: number) => {
    const weekPlan = SEEDED_PLANS[wkNum - 1];
    let requiredDaysInWeek = 0;
    if (weekPlan) {
      requiredDaysInWeek = weekPlan.days.filter(d => d.exercises.some(ex => ex.required)).length;
    } else {
      requiredDaysInWeek = 7; // fallback
    }`
);

code = code.replace(
  '    let completedCount = 0;\n    for (let d = 0; d < 7; d++) {',
  '    let completedCount = 0;\n    for (let d = 0; d < 7; d++) {'
);

// We need to also replace the display parts
code = code.replace(
  'style={{ width: `${(stats.completedCount / 7) * 100}%` }}',
  'style={{ width: `${(stats.completedCount / stats.requiredDaysInWeek) * 100}%` }}'
);
code = code.replace(
  '<span className="text-xs font-mono text-zinc-300 font-bold">{stats.completedCount}/7</span>',
  '<span className="text-xs font-mono text-zinc-300 font-bold">{stats.completedCount}/{stats.requiredDaysInWeek}</span>'
);

code = code.replace(
  '    return {\n      completedCount,\n      hasCheckin,\n    };',
  '    return {\n      completedCount,\n      hasCheckin,\n      requiredDaysInWeek\n    };'
);

// Ensure SEEDED_PLANS is imported
if (!code.includes('SEEDED_PLANS')) {
  code = code.replace(
    'import {',
    'import { SEEDED_PLANS } from "../utils/planData";\nimport {'
  );
}

fs.writeFileSync('src/components/OverviewTab.tsx', code);
