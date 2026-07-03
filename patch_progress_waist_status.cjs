const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressTab.tsx', 'utf8');

const anchor = `      <div className="apple-card p-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
          <Edit className="w-4 h-4 text-white" />
          Week {selectedWeekNum} Check-In
        </h3>
        <div className="space-y-4">`;

const newAnchor = `      <div className="apple-card p-5">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-4 flex items-center gap-1.5">
          <Edit className="w-4 h-4 text-white" />
          Week {selectedWeekNum} Check-In
        </h3>
        <div className="flex justify-between items-center py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl mb-4">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
            {activeCheckin.waist !== undefined && new Date(activeCheckin.date.split('-')[0], parseInt(activeCheckin.date.split('-')[1]) - 1, activeCheckin.date.split('-')[2]).getDay() === 5
              ? "Weekly waist measurement complete"
              : "Weekly waist measurement not logged"}
          </span>
        </div>
        <div className="space-y-4">`;

code = code.replace(anchor, newAnchor);
fs.writeFileSync('src/components/ProgressTab.tsx', code);
