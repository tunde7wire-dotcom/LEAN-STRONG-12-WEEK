const fs = require('fs');
let code = fs.readFileSync('src/utils/db.ts', 'utf8');

code = code.replace(
  '(newData[canonicalKey] as any)[wk] = { ...entry, exerciseName: canonicalKey };',
  '(newData[canonicalKey] as any)[wk] = { ...(entry as any), exerciseName: canonicalKey };'
);

fs.writeFileSync('src/utils/db.ts', code);
