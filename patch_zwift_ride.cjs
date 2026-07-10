const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');

code = code.replace(
  '        name: "Zwift Ride",\n        originalName: "Zwift Ride",',
  '        canonicalId: "active-recovery-zwift-ride",\n        name: "Zwift Ride",\n        originalName: "Zwift Ride",'
);

fs.writeFileSync('src/utils/planData.ts', code);
