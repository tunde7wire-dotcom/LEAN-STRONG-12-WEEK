const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');

code = code.replace(
  '        name: "Bike Zone 2",\n        originalName: "Bike Zone 2",\n        sets: "1",\n        reps: isDeload ? "20-25 min" : "25-35 min",\n        tempoCue: "Pace: sustainable and conversational",',
  '        canonicalId: "zone-2-indoor-trainer-ride",\n        name: "Bike Zone 2",\n        originalName: "Bike Zone 2",\n        sets: "1",\n        reps: isDeload ? "20-25 min" : "25-35 min",\n        minimumDuration: isDeload ? 20 : 25,\n        tempoCue: "Pace: sustainable and conversational",'
);

code = code.replace(
  '        name: "Bike Zone 2",\n        originalName: "Bike Zone 2",\n        sets: "1",\n        reps: "25-35 min", minimumDuration: 25,',
  '        canonicalId: "zone-2-indoor-trainer-ride",\n        name: "Bike Zone 2",\n        originalName: "Bike Zone 2",\n        sets: "1",\n        reps: "25-35 min", minimumDuration: 25,'
);

fs.writeFileSync('src/utils/planData.ts', code);
