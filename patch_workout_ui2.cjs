const fs = require('fs');

let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

// Replace the Set Row to improve timer button placement
const setRowRegex = /<div key=\{setIdx\} className="p-3 bg-white\/5 border border-white\/10 rounded-xl flex flex-col gap-2">\s*<div className="flex items-end gap-2 flex-wrap sm:flex-nowrap">[\s\S]*?(<div className="grid grid-cols-3 gap-1\.5 w-full mt-1">)/m;

const setRowReplacement = `<div key={setIdx} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                            <div className="flex flex-col sm:flex-row sm:items-end gap-2">
                              <div className="flex items-center justify-between sm:justify-start gap-2 mb-1 sm:mb-0">
                                <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase shrink-0 min-w-[3rem]">
                                  Set {setIdx + 1}
                                </span>
                                
                                {/* Timer on mobile, next to Set label */}
                                <div className="flex sm:hidden shrink-0">
                                  <button
                                    type="button"
                                    onClick={handleStartTimer}
                                    className="p-[8px] bg-white text-black hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center min-w-[36px] min-h-[36px]"
                                    title="Rest timer"
                                  >
                                    <Timer className="w-4 h-4" />
                                  </button>
                                </div>
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
                                                            
                              {/* Timer on desktop, at the end */}
                              <div className="hidden sm:flex shrink-0">
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
                            $1`;

code = code.replace(setRowRegex, setRowReplacement);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
console.log('Done replacing part 2.');
