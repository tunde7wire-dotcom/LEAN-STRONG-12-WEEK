const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressTab.tsx', 'utf8');

const targetStr = `  const loggedExercises = Object.keys(weeklyBestSetLogs).filter(name => {
    const meta = exerciseMetadata[name];
    // If we can't find metadata, default to showing it to preserve data
    if (!meta) return true;
    return meta.progressMode === 'weekly_best';
  }).sort();`;

const replaceStr = `  const loggedExercises = Object.keys(weeklyBestSetLogs).filter(name => {
    const meta = exerciseMetadata[name];
    return meta && meta.progressMode === 'weekly_best';
  }).sort();`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/ProgressTab.tsx', code);
