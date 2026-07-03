const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

// add checkins to interface
code = code.replace(
  '  weightValueToday: number | null;\n}',
  '  weightValueToday: number | null;\n  checkins: import("../types").WeeklyCheckIn[];\n}'
);

// add checkins to props destructuring
code = code.replace(
  '  weightValueToday,\n}: TodayTabProps)',
  '  weightValueToday,\n  checkins,\n}: TodayTabProps)'
);

fs.writeFileSync('src/components/TodayTab.tsx', code);
