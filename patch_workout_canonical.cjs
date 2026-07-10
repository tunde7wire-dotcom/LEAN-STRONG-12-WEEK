const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

code = code.replace(
  "const currentName = typeof swapData === 'string' ? swapData : (swapData?.name || ex.name);",
  "const currentName = typeof swapData === 'string' ? swapData : (swapData?.name || ex.name);\n  const canonicalId = typeof swapData === 'object' ? swapData.canonicalId : ex.canonicalId;"
);

code = code.replace(
  'const prevBest = previousBestSets[currentName];',
  'const prevBest = previousBestSets[canonicalId || currentName];'
);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
