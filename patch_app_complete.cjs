const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    // Save logs
    setBestSetLogs(newBestSetLogs);
    saveBestSetLogs(newBestSetLogs);
    setWeeklyBestSetLogs(newWeeklyBestSetLogs);
    saveWeeklyBestSetLogs(newWeeklyBestSetLogs);`;

const replaceStr = `    // Save logs
    setBestSetLogs(newBestSetLogs);
    saveBestSetLogs(newBestSetLogs);
    setWeeklyBestSetLogs(newWeeklyBestSetLogs);
    saveWeeklyBestSetLogs(newWeeklyBestSetLogs);

    // Save historical logs for this specific day
    const histKey = \`W\${selectedWeekNum}-D\${selectedDayIndex}\`;
    const newHistoricalLogs = {
      ...historicalLogs,
      [histKey]: loggedSets as any
    };
    setHistoricalLogs(newHistoricalLogs);
    saveHistoricalLogs(newHistoricalLogs);`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
