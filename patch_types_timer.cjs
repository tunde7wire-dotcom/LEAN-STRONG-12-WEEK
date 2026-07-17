const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');
code = code.replace(
  'timerEndTime: number | null; // For persistent rest timer recovery',
  'timerEndTime: number | null; // For persistent rest timer recovery\n  timerRemainingSeconds?: number; // Paused remaining time'
);
fs.writeFileSync('src/types.ts', code);
console.log('types patched');
