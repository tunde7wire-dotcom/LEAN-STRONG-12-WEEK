const fs = require('fs');
let code = fs.readFileSync('src/components/OverviewTab.tsx', 'utf8');

code = code.replace(
  '    // 7 days in a week\n    let completedCount = 0;\n    for (let d = 0; d < 7; d++) {\n      if (settings.completedDays[`W${wkNum}-D${d}`]) {\n        completedCount++;\n      }\n    }',
  `    let completedCount = 0;\n    for (let d = 0; d < 7; d++) {\n      if (weekPlan && weekPlan.days[d] && weekPlan.days[d].exercises.some(ex => ex.required)) {\n        if (settings.completedDays[\`W\${wkNum}-D\${d}\`]) {\n          completedCount++;\n        }\n      }\n    }`
);

fs.writeFileSync('src/components/OverviewTab.tsx', code);
