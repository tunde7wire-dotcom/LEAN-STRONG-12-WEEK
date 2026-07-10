const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  'clearAllDatabase\n} from "./utils/db";',
  'clearAllDatabase,\n  getHistoricalLogs,\n  saveHistoricalLogs\n} from "./utils/db";'
);

fs.writeFileSync('src/App.tsx', code);
