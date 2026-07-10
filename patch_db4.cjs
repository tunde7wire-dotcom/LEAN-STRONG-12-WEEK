const fs = require('fs');
let code = fs.readFileSync('src/utils/db.ts', 'utf8');

code = code.replace(
  'const applyMigrations = <T>(data: Record<string, T>): Record<string, T> => {',
  'const applyMigrations = <T extends object>(data: Record<string, T>): Record<string, T> => {'
);

fs.writeFileSync('src/utils/db.ts', code);
