const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(/clearAllDatabase\s*\}\s*from\s*"([^"]+)"/, 'clearAllDatabase, getHistoricalLogs, saveHistoricalLogs } from "$1"');

fs.writeFileSync('src/App.tsx', code);
