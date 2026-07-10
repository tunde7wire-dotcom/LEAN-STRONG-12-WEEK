const fs = require('fs');
let code = fs.readFileSync('src/utils/db.ts', 'utf8');

code = code.replace(
  '          newData[canonicalKey] = { ...newRec };',
  '          newData[canonicalKey] = { ...(newRec as any) };'
);

fs.writeFileSync('src/utils/db.ts', code);
