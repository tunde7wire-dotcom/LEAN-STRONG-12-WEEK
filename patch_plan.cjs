const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');

// We need to add minimumSteps: 8000, required: true to all exercises where reps: "8,000-10,000 steps"
code = code.replace(/reps: "8,000-10,000 steps",/g, 'reps: "8,000-10,000 steps", minimumSteps: 8000, required: true,');

// What about other steps? Let's check if there are others.
fs.writeFileSync('src/utils/planData.ts', code);
