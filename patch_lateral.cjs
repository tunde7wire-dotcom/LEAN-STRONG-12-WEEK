const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');
console.log(code.includes("Cable or DB Lateral Raise"));
