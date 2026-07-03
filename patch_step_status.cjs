const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const oldStepsInput = `                                {resolvedTrackingType === 'steps' && (
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
                      {parseInt(stepsVal || "0") >= 8000 && (
                        <div className="mt-2 text-[10px] text-emerald-500 font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                           <Check className="w-3 h-3" /> Target Met
                        </div>
                      )}
                  </div>
                )}`;

const newStepsInput = `                                {resolvedTrackingType === 'steps' && (
                  <div className="flex-1">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 font-bold tracking-wider">
                        Actual Steps
                      </label>
                      <div className="flex flex-col gap-1">
                        <input
                          id={\`input-steps-\${ex.id}\`}
                          type="number"
                          placeholder="e.g. 8500"
                          value={stepsVal}
                          onChange={(e) => handleInputChange(ex.id, "steps", e.target.value)}
                          className="w-full text-sm py-2 px-3 focus:border-white text-white rounded-xl bg-white/5 border border-white/10"
                        />
                        {ex.minimumSteps ? (
                          <div className="mt-1 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                            {parseInt(stepsVal || "0") >= ex.minimumSteps ? (
                              <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> STEP TARGET MET</span>
                            ) : (
                              <span className="text-amber-500 flex items-center gap-1">{ex.minimumSteps - parseInt(stepsVal || "0")} steps remaining • STEP TARGET NOT MET</span>
                            )}
                          </div>
                        ) : null}
                      </div>
                  </div>
                )}`;

code = code.replace(oldStepsInput, newStepsInput);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
