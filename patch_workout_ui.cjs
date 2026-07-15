const fs = require('fs');

let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

// 1. Container padding
code = code.replace(
  'className="max-w-md mx-auto px-4 pb-28 pt-4"',
  'className="max-w-md mx-auto px-4 pb-32 sm:pb-28 pt-4"'
);

// 2. Exercise Card Padding
code = code.replace(
  'className={`apple-card p-5 transition-all ${',
  'className={`apple-card p-4 sm:p-5 transition-all ${'
);

// 3. Exercise Header Layout
const headerRegex = /<div className="flex justify-between items-start mb-3">\s*<div className="flex-1">\s*<div className="flex items-center gap-1\.5 flex-wrap">[\s\S]*?(<h3 className="text-lg font-bold text-white mt-1 leading-tight flex items-center gap-1\.5">)\s*(\{currentName\})\s*(\{isSwapped && \(\s*<span className="text-\[10px\] font-mono font-bold text-zinc-500 uppercase tracking-wider">\s*\(Swapped\)\s*<\/span>\s*\)\})\s*<\/h3>\s*<\/div>\s*\{\/\* Action Area: View Form & Swap \*\/\}\s*<div className="flex items-center gap-2">/;

code = code.replace(headerRegex, (match, p1, p2, p3) => {
  return `<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-3">
                <div className="flex-1 min-w-0">
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
                  <h3 className="text-lg font-bold text-white mt-1 leading-tight flex items-center gap-1.5 flex-wrap">
                    <span className="min-w-0 break-words">{currentName}</span>
                    {isSwapped && (
                      <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                        (Swapped)
                      </span>
                    )}
                  </h3>
                </div>
                {/* Action Area: View Form & Swap */}
                <div className="flex items-center gap-2 flex-wrap">`;
});

// 4. Double Progression / Previous best set info
const prevBestRegex = /<div className="bg-white\/5 border border-white\/10 rounded-xl px-3 py-2\.5 flex justify-between items-center mb-4">\s*<span className="text-\[10px\] font-mono text-zinc-500 uppercase font-bold tracking-wider">Progression Double Rule<\/span>\s*<span className="text-xs font-mono font-bold text-zinc-300">[\s\S]*?(<span className="text-white">)[\s\S]*?(<\/span>)\s*\)\s*:\s*\(\s*"No logged best set history"\s*\)\s*\}\s*<\/span>\s*<\/div>/;

code = code.replace(prevBestRegex, `<div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-1">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-bold tracking-wider">Progression Double Rule</span>
                  <span className="text-xs font-mono font-bold text-zinc-300">
                    {prevBest ? (
                      <span className="text-white break-words">
                        {resolvedTrackingType === 'load_reps' && \`Prev Best: \${prevBest.weight} \${settings.units === "imperial" ? "lbs" : "kg"} x \${prevBest.reps} reps\`}
                        {resolvedTrackingType === 'duration' && \`Prev Best: \${prevBest.duration} \${ex.category === 'core' ? "sec" : "min"}\`}
                        {resolvedTrackingType === 'reps_only' && \`Prev Best: \${prevBest.reps} reps\`}
                        {resolvedTrackingType === 'assistance_reps' && \`Prev Best: -\${prevBest.assistance} \${settings.units === "imperial" ? "lbs" : "kg"} x \${prevBest.reps} reps\`}
                      </span>
                    ) : (
                      "No best set history"
                    )}
                  </span>
                </div>`);

// 5. Single Row Inputs min-w-0
code = code.replace(/<div className="flex items-center gap-3 relative">/g, '<div className="flex items-center gap-3 relative flex-wrap sm:flex-nowrap">');
code = code.replace(/<div className="flex-1">/g, '<div className="flex-1 min-w-0 w-full sm:w-auto">');

// 6. Set-by-Set Logging Row
const setRowRegex = /<div key=\{setIdx\} className="p-3 bg-white\/5 border border-white\/10 rounded-xl flex flex-col gap-2">\s*<div className="flex items-center gap-2">[\s\S]*?(<span className="text-\[10px\] font-mono text-zinc-500 font-bold uppercase w-12 shrink-0">\s*Set \{setIdx \+ 1\}\s*<\/span>)[\s\S]*?(<button\s*type="button"\s*onClick=\{handleStartTimer\}\s*className="p-1\.5 bg-white text-black hover:bg-neutral-200 rounded shrink-0 transition-colors"\s*title="Rest timer"\s*>\s*<Timer className="w-3\.5 h-3\.5" \/>\s*<\/button>\s*<\/div>\s*\{\/\* Effort Controls \*\/\}\s*<div className="flex gap-1\.5 w-full">)[\s\S]*?(<\/div>\s*<\/div>)/m;

const setRowReplacement = `<div key={setIdx} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                            <div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">
                              <div className="flex items-center gap-2 w-full sm:w-auto mb-1 sm:mb-0">
                                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase shrink-0 min-w-[3rem]">
                                  Set {setIdx + 1}
                                </span>
                              </div>
                                                            
                              {resolvedTrackingType === 'load_reps' && (
                                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)] gap-2 flex-1 w-full sm:w-auto">
                                  <div className="min-w-0">
                                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">Weight {settings.units === "imperial" ? "(lb)" : "(kg)"}</label>
                                    <input
                                      type="number"
                                      step="any"
                                      placeholder="Weight"
                                      value={setLog.weight || ""}
                                      onChange={(e) => handleSetInputChange(ex.id, setIdx, "weight", e.target.value)}
                                      className="w-full text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">Reps</label>
                                    <input
                                      type="number"
                                      placeholder="Reps"
                                      value={setLog.reps || ""}
                                      onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                      className="w-full text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                    />
                                  </div>
                                </div>
                              )}
                                                            
                              {resolvedTrackingType === 'reps_only' && (
                                <div className="flex-1 min-w-0 w-full sm:w-auto">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">Reps</label>
                                  <input
                                    type="number"
                                    placeholder="Reps"
                                    value={setLog.reps || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                    className="w-full text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                </div>
                              )}
                                                            
                              {resolvedTrackingType === 'assistance_reps' && (
                                <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)] gap-2 flex-1 w-full sm:w-auto">
                                  <div className="min-w-0">
                                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">Assist</label>
                                    <input
                                      type="number"
                                      step="any"
                                      placeholder="Assist"
                                      value={setLog.assistance || ""}
                                      onChange={(e) => handleSetInputChange(ex.id, setIdx, "assistance", e.target.value)}
                                      className="w-full text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">Reps</label>
                                    <input
                                      type="number"
                                      placeholder="Reps"
                                      value={setLog.reps || ""}
                                      onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                      className="w-full text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                    />
                                  </div>
                                </div>
                              )}
                                                            
                              {resolvedTrackingType === 'duration' && (
                                <div className="flex-1 min-w-0 w-full sm:w-auto">
                                  <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
                                    {ex.category === 'core' ? "Seconds" : "Minutes"}
                                  </label>
                                  <input
                                    type="number"
                                    placeholder={ex.category === 'core' ? "Secs" : "Mins"}
                                    value={setLog.duration || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "duration", e.target.value)}
                                    className="w-full text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                </div>
                              )}
                                                            
                              <div className="flex shrink-0">
                                <button
                                  type="button"
                                  onClick={handleStartTimer}
                                  className="p-[10px] bg-white text-black hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center min-w-[40px] min-h-[40px]"
                                  title="Rest timer"
                                >
                                  <Timer className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                                                        
                            {/* Effort Controls */}
                            <div className="grid grid-cols-3 gap-1.5 w-full mt-1">
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "easy" ? "" : "easy")}
                                aria-pressed={setLog.effort === "easy"}
                                className={\`min-w-0 text-[10px] font-mono font-bold py-2 rounded uppercase tracking-wider transition-all break-words leading-tight \${setLog.effort === "easy" ? "bg-emerald-500 text-black" : "bg-white/5 text-emerald-500 border border-emerald-500/30"}\`}
                              >
                                Easy
                              </button>
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "on_target" ? "" : "on_target")}
                                aria-pressed={setLog.effort === "on_target"}
                                className={\`min-w-0 text-[10px] font-mono font-bold py-2 px-0.5 sm:px-1 rounded uppercase tracking-wider transition-all break-words leading-tight \${setLog.effort === "on_target" ? "bg-yellow-500 text-black" : "bg-white/5 text-yellow-500 border border-yellow-500/30"}\`}
                              >
                                On Target
                              </button>
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "very_hard" ? "" : "very_hard")}
                                aria-pressed={setLog.effort === "very_hard"}
                                className={\`min-w-0 text-[10px] font-mono font-bold py-2 rounded uppercase tracking-wider transition-all break-words leading-tight \${setLog.effort === "very_hard" ? "bg-red-500 text-white" : "bg-white/5 text-red-500 border border-red-500/30"}\`}
                              >
                                Very Hard
                              </button>
                            </div>
                          </div>`;

code = code.replace(setRowRegex, setRowReplacement);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
console.log('Done replacing.');
