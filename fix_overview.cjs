const fs = require('fs');
let code = fs.readFileSync('src/components/OverviewTab.tsx', 'utf8');

code = code.replace(
  'import React from "react";',
  'import React from "react";\nimport { SEEDED_PLANS } from "../utils/planData";'
);

fs.writeFileSync('src/components/OverviewTab.tsx', code);
