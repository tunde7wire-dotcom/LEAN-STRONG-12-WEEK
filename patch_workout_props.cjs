const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

if (!code.includes('onDiscardWorkout: () => void;')) {
  code = code.replace('onCompleteWorkout: (logs:', 'onDiscardWorkout: () => void;\n  onCompleteWorkout: (logs:');
}

if (!code.includes('onDiscardWorkout,')) {
  code = code.replace('onCompleteWorkout,', 'onDiscardWorkout,\n  onCompleteWorkout,');
}

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
console.log('Props patched');
