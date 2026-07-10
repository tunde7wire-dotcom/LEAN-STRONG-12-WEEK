const fs = require('fs');
let code = fs.readFileSync('src/components/OverviewTab.tsx', 'utf8');

code = code.replace(
  'style={{ width: `${(stats.completedCount / stats.requiredDaysInWeek) * 100}%` }}',
  'style={{ width: `${stats.requiredDaysInWeek > 0 ? Math.min((stats.completedCount / stats.requiredDaysInWeek) * 100, 100) : 100}%` }}'
);

fs.writeFileSync('src/components/OverviewTab.tsx', code);
