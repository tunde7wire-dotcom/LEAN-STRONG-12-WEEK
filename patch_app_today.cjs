const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  '            weightValueToday={weightValueToday}\n          />',
  '            weightValueToday={weightValueToday}\n            checkins={checkins}\n          />'
);

fs.writeFileSync('src/App.tsx', code);
