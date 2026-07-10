const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  'export interface CustomExerciseSwap {',
  'export interface CustomExerciseSwap {\n  canonicalId?: string;'
);

fs.writeFileSync('src/types.ts', code);
