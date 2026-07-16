const fs = require('fs');
let code = fs.readFileSync('src/utils/activeWorkoutHelpers.ts', 'utf8');

if (!code.includes('if (log.completed) return true;')) {
  code = code.replace('if (log.weight !== undefined', 'if (log.completed) return true;\n    if (log.weight !== undefined');
}

fs.writeFileSync('src/utils/activeWorkoutHelpers.ts', code);
console.log('patched completed');
