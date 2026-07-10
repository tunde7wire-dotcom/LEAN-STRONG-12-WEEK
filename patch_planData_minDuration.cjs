const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');

// Legacy Zone 2:
code = code.replace(
  'name: "Bike Zone 2",\n        originalName: "Bike Zone 2",\n        sets: "1",\n        reps: "25-35 min",',
  'name: "Bike Zone 2",\n        originalName: "Bike Zone 2",\n        sets: "1",\n        reps: "25-35 min", minimumDuration: 25,'
);

// Revised Zone 2:
code = code.replace(
  'name: "Zone 2 Indoor Trainer Ride",\n        originalName: "Zone 2 Indoor Trainer Ride",\n        sets: "1",\n        reps: isDeload ? "20-25 min" : "25-35 min",',
  'name: "Zone 2 Indoor Trainer Ride",\n        originalName: "Zone 2 Indoor Trainer Ride",\n        sets: "1",\n        reps: isDeload ? "20-25 min" : "25-35 min",\n        minimumDuration: isDeload ? 20 : 25,'
);

// Revised Wednesday Ride:
code = code.replace(
  'name: "Zwift Ride",\n        originalName: "Zwift Ride",\n        sets: "1",\n        reps: isDeload ? "20-25 min" : "30 min",',
  'name: "Zwift Ride",\n        originalName: "Zwift Ride",\n        sets: "1",\n        reps: isDeload ? "20-25 min" : "30 min",\n        minimumDuration: 20,'
);

fs.writeFileSync('src/utils/planData.ts', code);
