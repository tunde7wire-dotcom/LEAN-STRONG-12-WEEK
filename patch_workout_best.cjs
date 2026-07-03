const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const targetStr = `              {/* Double Progression / Previous best set info */}
              <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex justify-between items-center mb-4">
                <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Progression Double Rule</span>
                <span className="text-xs font-mono font-bold text-zinc-300">
                  {prevBest ? (
                    <span className="text-white">
                      Prev Best Set: {prevBest.weight} {settings.units === "imperial" ? "lbs" : "kg"} x {prevBest.reps} reps
                    </span>
                  ) : (
                    "No logged best set history"
                  )}
                </span>
              </div>`;

const replaceStr = `              {/* Double Progression / Previous best set info */}
              {resolvedProgressMode === 'weekly_best' && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex justify-between items-center mb-4">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Progression Double Rule</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {prevBest ? (
                      <span className="text-white">
                        {resolvedTrackingType === 'load_reps' && \`Prev Best Set: \${prevBest.weight} \${settings.units === "imperial" ? "lbs" : "kg"} x \${prevBest.reps} reps\`}
                        {resolvedTrackingType === 'duration' && \`Previous Best: \${prevBest.duration} \${ex.category === 'core' ? "sec" : "min"}\`}
                        {resolvedTrackingType === 'reps_only' && \`Previous Best: \${prevBest.reps} reps\`}
                        {resolvedTrackingType === 'assistance_reps' && \`Previous Best: -\${prevBest.assistance} \${settings.units === "imperial" ? "lbs" : "kg"} x \${prevBest.reps} reps\`}
                      </span>
                    ) : (
                      "No logged best set history"
                    )}
                  </span>
                </div>
              )}`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
