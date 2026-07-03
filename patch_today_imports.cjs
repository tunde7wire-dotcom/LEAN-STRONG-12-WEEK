const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');
if (!code.includes('getLocalTodayString')) {
  code = code.replace(
    'import { loadFromLocalStorage, saveToLocalStorage } from "../utils/db";',
    'import { loadFromLocalStorage, saveToLocalStorage } from "../utils/db";\nimport { getLocalTodayString } from "../utils/dateUtils";'
  );
  fs.writeFileSync('src/components/TodayTab.tsx', code);
}
