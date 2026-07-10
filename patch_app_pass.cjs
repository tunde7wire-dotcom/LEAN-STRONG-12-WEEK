const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `            activeWorkout={activeWorkout}
            previousBestSets={bestSetLogs}
            swaps={exerciseSwaps}`;

const replaceStr = `            activeWorkout={activeWorkout}
            previousBestSets={bestSetLogs}
            swaps={exerciseSwaps}
            historicalLogs={historicalLogs}`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
