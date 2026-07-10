const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

code = code.replace(
  '{/* Workout Header */}\n      <div className="flex items-start justify-between mb-8">',
  `{/* Workout Header */}\n      <div className="flex flex-col gap-4 mb-8">\n        <div className="flex items-start justify-between">`
);

code = code.replace(
  '          </div>\n        </div>\n      </div>',
  `          </div>\n        </div>\n      </div>
      
        {dayPlan.timeBox && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 block font-bold">Time Box & Hard Stop</span>
            <p className="text-sm text-zinc-300">Target duration: {dayPlan.timeBox}. {dayPlan.isTrainingDay && "Hard stop at 60 minutes. Finish the set you are on, then leave."}</p>
          </div>
        )}

        {dayPlan.warmUp && dayPlan.warmUp.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 block font-bold">Warm-up</span>
            <ul className="space-y-1">
              {dayPlan.warmUp.map((w, idx) => (
                <li key={idx} className="text-sm text-zinc-300 flex items-start gap-2">
                  <span className="text-zinc-500">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dayPlan.supersetInstructions && dayPlan.supersetInstructions.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 block font-bold">Superset Instructions & Guardrails</span>
            <ul className="space-y-1 mb-2">
              {dayPlan.supersetInstructions.map((w, idx) => (
                <li key={idx} className="text-sm text-white font-medium flex items-start gap-2">
                  <span className="text-zinc-500">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-zinc-400 mt-3 border-t border-white/5 pt-2">
              <strong>Guardrails:</strong> Separate a pairing into straight sets if the second exercise repeatedly loses more than 2 repetitions. Do not preserve a superset when equipment transitions take longer than about 30-45 seconds. Stop the pairing if technique deteriorates or you become lightheaded. Supersets are intended to save time, not turn the session into conditioning.
            </p>
          </div>
        )}
      </div>`
);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
