const fs = require('fs');

const injection = `
              {/* Log Input for Exercise */}
              <div className="mt-4">
                {['target_adherence', 'none'].includes(resolvedProgressMode) || ['steps', 'completion'].includes(resolvedTrackingType) ? (
                  /* Legacy / Single Row for Cardio, Steps, Completion */
                  <div className="flex items-center gap-3 relative">
                    {resolvedTrackingType === 'duration' && (
                      <div className="flex-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
                            Duration {ex.category === 'core' ? "(Seconds)" : "(Minutes)"}
                          </label>
                          <input
                            id={\`input-duration-\${ex.id}\`}
                            type="number"
                            placeholder={ex.category === 'core' ? "e.g. 45" : "e.g. 20"}
                            value={durationVal}
                            onChange={(e) => handleInputChange(ex.id, "duration", e.target.value)}
                            className="w-full text-sm py-2 px-3 focus:border-white text-white rounded-xl bg-white/5 border border-white/10"
                          />
                      </div>
                    )}
                    {resolvedTrackingType === 'steps' && (
                      <div className="flex-1">
                          <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
                            Actual Steps
                          </label>
                          <input
                            id={\`input-steps-\${ex.id}\`}
                            type="number"
                            placeholder="e.g. 8500"
                            value={stepsVal}
                            onChange={(e) => handleInputChange(ex.id, "steps", e.target.value)}
                            className="w-full text-sm py-2 px-3 focus:border-white text-white rounded-xl bg-white/5 border border-white/10"
                          />
                      </div>
                    )}
                    {resolvedTrackingType === 'completion' && (
                      <div className="flex-1 flex items-center">
                          <button
                            onClick={() => {
                              const updated = { ...localLogs };
                              if (updated[ex.id]?.completed) {
                                delete updated[ex.id];
                              } else {
                                updated[ex.id] = { ...updated[ex.id], completed: true };
                              }
                              setLocalLogs(updated);
                            }}
                            className={\`text-xs py-2 px-4 rounded-xl font-bold uppercase tracking-wider transition-colors \${localLogs[ex.id]?.completed ? 'bg-emerald-500 text-black' : 'bg-white/5 border border-white/10 text-white'}\`}
                          >
                             {localLogs[ex.id]?.completed ? 'Completed' : 'Mark Done'}
                          </button>
                      </div>
                    )}
                    
                    <div className="self-end pb-1 pr-1">
                      <button
                        id={\`btn-trigger-timer-\${ex.id}\`}
                        onClick={handleStartTimer}
                        className="p-2.5 bg-white text-black hover:bg-neutral-200 rounded-xl transition-colors"
                        title="Trigger rest timer"
                      >
                        <Timer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Set-by-Set Logging for Strength / Weekly Best */
                  <div className="space-y-3">
                    {(() => {
                      const prescribedSetsMatch = ex.sets?.match(/(\d+)/g);
                      let maxSets = 1;
                      if (prescribedSetsMatch) {
                        maxSets = Math.max(...prescribedSetsMatch.map(n => parseInt(n, 10)));
                      }
                      
                      const setsList = Array.from({ length: maxSets }, (_, i) => i);
                      
                      return setsList.map(setIdx => {
                        const setLog = localLogs[ex.id]?.sets?.[setIdx] || { setNumber: setIdx + 1 };
                        
                        return (
                          <div key={setIdx} className="p-3 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase w-12 shrink-0">
                                Set {setIdx + 1}
                              </span>
                              
                              {resolvedTrackingType === 'load_reps' && (
                                <>
                                  <input
                                    type="number"
                                    step="any"
                                    placeholder="Weight"
                                    value={setLog.weight || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "weight", e.target.value)}
                                    className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Reps"
                                    value={setLog.reps || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                    className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                </>
                              )}
                              
                              {resolvedTrackingType === 'reps_only' && (
                                <input
                                  type="number"
                                  placeholder="Reps"
                                  value={setLog.reps || ""}
                                  onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                  className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                />
                              )}
                              
                              {resolvedTrackingType === 'assistance_reps' && (
                                <>
                                  <input
                                    type="number"
                                    step="any"
                                    placeholder="Assist"
                                    value={setLog.assistance || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "assistance", e.target.value)}
                                    className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                  <input
                                    type="number"
                                    placeholder="Reps"
                                    value={setLog.reps || ""}
                                    onChange={(e) => handleSetInputChange(ex.id, setIdx, "reps", e.target.value)}
                                    className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                  />
                                </>
                              )}
                              
                              {resolvedTrackingType === 'duration' && (
                                <input
                                  type="number"
                                  placeholder={ex.category === 'core' ? "Secs" : "Mins"}
                                  value={setLog.duration || ""}
                                  onChange={(e) => handleSetInputChange(ex.id, setIdx, "duration", e.target.value)}
                                  className="flex-1 text-sm py-1.5 px-2 focus:border-white text-white rounded bg-white/5 border border-white/10"
                                />
                              )}
                              
                              <button
                                onClick={handleStartTimer}
                                className="p-1.5 bg-white text-black hover:bg-neutral-200 rounded shrink-0 transition-colors"
                                title="Rest timer"
                              >
                                <Timer className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            {/* Effort Controls */}
                            <div className="flex gap-1.5 w-full">
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "easy" ? "" : "easy")}
                                aria-pressed={setLog.effort === "easy"}
                                className={\`flex-1 text-[10px] font-mono font-bold py-1.5 rounded uppercase tracking-wider transition-all \${setLog.effort === "easy" ? "bg-emerald-500 text-black" : "bg-white/5 text-emerald-500 border border-emerald-500/30"}\`}
                              >
                                Easy
                              </button>
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "on_target" ? "" : "on_target")}
                                aria-pressed={setLog.effort === "on_target"}
                                className={\`flex-1 text-[10px] font-mono font-bold py-1.5 rounded uppercase tracking-wider transition-all \${setLog.effort === "on_target" ? "bg-yellow-500 text-black" : "bg-white/5 text-yellow-500 border border-yellow-500/30"}\`}
                              >
                                On Target
                              </button>
                              <button
                                onClick={() => handleSetInputChange(ex.id, setIdx, "effort", setLog.effort === "very_hard" ? "" : "very_hard")}
                                aria-pressed={setLog.effort === "very_hard"}
                                className={\`flex-1 text-[10px] font-mono font-bold py-1.5 rounded uppercase tracking-wider transition-all \${setLog.effort === "very_hard" ? "bg-red-500 text-white" : "bg-white/5 text-red-500 border border-red-500/30"}\`}
                              >
                                Very Hard
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </div>
`;

let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

code = code.replace(
  /\s*\{\/\* Log Input for Exercise \*\/\}\s*<div className="flex items-center gap-3 relative">[\s\S]*?\{\/\* Tempo \/ Effort cueing \*\/\}/m,
  injection + '\n              {/* Tempo / Effort cueing */}'
);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
