const fs = require('fs');

let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

// 1. Fix Exercise Header
const headerRegex = /<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">[\s\S]*?(<div className="flex items-center gap-2 flex-wrap">)/m;
const headerReplacement = `<div className="flex flex-col gap-3 mb-4">
                <div className="flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {ex.isSuperset && (
                      <span className="bg-white text-black font-mono font-extrabold text-[8px] px-1.5 py-0.5 rounded uppercase">
                        Superset
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-wider">
                      Target: {ex.sets} Sets x {ex.reps} Reps
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight flex items-center gap-1.5 flex-wrap min-w-0">
                    <span className="min-w-0 break-words flex-1">{currentName}</span>
                    {isSwapped && (
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap shrink-0">
                        (Swapped)
                      </span>
                    )}
                  </h3>
                </div>
                {/* Action Area: View Form & Swap */}
                $1`;

code = code.replace(headerRegex, headerReplacement);

// 2. Fix Previous Best Layout
const prevBestRegex = /\{resolvedProgressMode === 'weekly_best' && \(\s*<div className="bg-white\/5 border border-white\/10 rounded-xl px-3 py-2\.5 flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-1">[\s\S]*?\{resolvedTrackingType === 'load_reps' && `Prev Best: \$\{prevBest.weight\} \$\{settings.units === "imperial" \? "lbs" : "kg"\} x \$\{prevBest.reps\} reps`\}[\s\S]*?\{resolvedTrackingType === 'duration' && `Prev Best: \$\{prevBest.duration\} \$\{ex.category === 'core' \? "sec" : "min"\}`\}[\s\S]*?\{resolvedTrackingType === 'reps_only' && `Prev Best: \$\{prevBest.reps\} reps`\}[\s\S]*?\{resolvedTrackingType === 'assistance_reps' && `Prev Best: -\$\{prevBest.assistance\} \$\{settings.units === "imperial" \? "lbs" : "kg"\} x \$\{prevBest.reps\} reps`\}[\s\S]*?<\/div>\s*\)/m;

const prevBestReplacement = `{resolvedProgressMode === 'weekly_best' && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex flex-col mb-4 gap-1 min-w-0">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Progression Double Rule</span>
                  <span className="text-xs font-mono font-bold text-zinc-300 min-w-0">
                    {prevBest ? (
                      <span className="text-white break-words min-w-0 block">
                        {resolvedTrackingType === 'load_reps' && \`Previous Best: \${prevBest.weight} \${settings.units === "imperial" ? "lb" : "kg"} × \${prevBest.reps} reps\`}
                        {resolvedTrackingType === 'duration' && \`Previous Best: \${prevBest.duration} \${ex.category === 'core' ? "sec" : "min"}\`}
                        {resolvedTrackingType === 'reps_only' && \`Previous Best: \${prevBest.reps} reps\`}
                        {resolvedTrackingType === 'assistance_reps' && \`Previous Best: -\${prevBest.assistance} \${settings.units === "imperial" ? "lb" : "kg"} × \${prevBest.reps} reps\`}
                      </span>
                    ) : (
                      "No best set history"
                    )}
                  </span>
                </div>
              )}`;

code = code.replace(prevBestRegex, prevBestReplacement);

// 3. Fix Effort Buttons wrapping and gap
const effortRegex = /<div className="grid grid-cols-3 gap-1\.5 w-full mt-1">/g;
code = code.replace(effortRegex, '<div className="grid grid-cols-3 gap-1 w-full mt-1 min-w-0">');

const effortBtnRegex = /className=\{`min-w-0 text-\[10px\] font-mono font-bold py-2/g;
code = code.replace(effortBtnRegex, 'className={`min-w-0 text-[10px] font-mono font-bold py-2 min-h-[44px]');

// 4. Container bottom padding with safe-area
const containerRegex = /<div id="workout-tracker-tab" className="max-w-md mx-auto px-4 pb-32 sm:pb-28 pt-4">/;
code = code.replace(containerRegex, '<div id="workout-tracker-tab" className="max-w-md mx-auto px-4 pt-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">');

// 5. Apply min-w-0 to the outer exercise card flex container if needed (actually max-w-md prevents it, but min-w-0 inside helps)
// The card has class="apple-card p-4 sm:p-5..." - we can add min-w-0
const cardRegex = /className=\{`apple-card p-4 sm:p-5 transition-all/g;
code = code.replace(cardRegex, 'className={`apple-card min-w-0 p-4 transition-all');

// 6. Also reduce exercise card padding slightly for mobile `p-4` (already done by replacing `p-4 sm:p-5` with `p-4` which works well for mobile)

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
console.log('Done replacing part 3.');
