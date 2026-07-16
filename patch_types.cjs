const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace('logs: Record<string, { weight?: number; reps?: number; duration?: number; steps?: number; assistance?: number; sets?: WorkingSetLog[] }>;', 'logs: Record<string, { weight?: number; reps?: number; duration?: number; steps?: number; assistance?: number; completed?: boolean; sets?: WorkingSetLog[] }>;');

fs.writeFileSync('src/types.ts', code);
console.log('Types patched');
