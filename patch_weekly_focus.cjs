const fs = require('fs');
let code = fs.readFileSync('src/components/WeeklyTab.tsx', 'utf8');

code = code.replace(
  '      {/* Week Nutrition Rules Card - styled with apple-card */}',
  `      {/* Week Progression Focus */}
      {weekPlan.progressionFocus && weekPlan.progressionFocus.length > 0 && (
        <div className="apple-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold uppercase tracking-tight text-white">Week {selectedWeekNum} Progression Focus</h3>
          </div>
          <ul className="space-y-2">
            {weekPlan.progressionFocus.map((focus, i) => (
              <li key={i} className="text-sm text-zinc-300 leading-relaxed flex items-start gap-2">
                <span className="text-zinc-600 select-none">•</span>
                <span>{focus}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Week Nutrition Rules Card - styled with apple-card */}`
);

fs.writeFileSync('src/components/WeeklyTab.tsx', code);
