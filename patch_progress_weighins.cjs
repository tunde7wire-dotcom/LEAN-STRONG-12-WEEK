const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressTab.tsx', 'utf8');

const anchor1 = `  const weekAverage = calculateAverage(currentWeekLogs);`;
const newAnchor1 = `  const weekAverage = calculateAverage(currentWeekLogs);

  const scheduledCount = currentWeekLogs.filter((log) => {
    const [y, m, d] = log.date.split('-').map(Number);
    const day = new Date(y, m - 1, d).getDay();
    return day === 1 || day === 3 || day === 5;
  }).length;`;
code = code.replace(anchor1, newAnchor1);

const anchor2 = `        {currentWeekLogs.length > 0 ? (
          <div>
            <div className="flex justify-between items-center py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Week {selectedWeekNum} Average:</span>
              <span className="text-base font-black text-white font-mono">
                {weekAverage} {unitsStr}
              </span>
            </div>`;

const newAnchor2 = `        {currentWeekLogs.length > 0 ? (
          <div>
            <div className="flex justify-between items-center py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl mb-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
                {Math.min(scheduledCount, 3)} of 3 weigh-ins logged
              </span>
            </div>
            <div className="flex justify-between items-center py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl mb-3">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Week {selectedWeekNum} Average:</span>
              <span className="text-base font-black text-white font-mono">
                {weekAverage} {unitsStr}
              </span>
            </div>`;
code = code.replace(anchor2, newAnchor2);

fs.writeFileSync('src/components/ProgressTab.tsx', code);
