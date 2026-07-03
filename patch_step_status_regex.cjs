const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const regex = /\{parseInt\(stepsVal \|\| "0"\) >= 8000 && \([\s\S]*?<\/[Dd]iv>\s*\)\}/m;

code = code.replace(regex, `{ex.minimumSteps ? (
                          <div className="mt-2 text-[10px] font-mono font-bold tracking-wider uppercase flex items-center gap-1">
                            {parseInt(stepsVal || "0") >= ex.minimumSteps ? (
                              <span className="text-emerald-500 flex items-center gap-1"><Check className="w-3 h-3" /> STEP TARGET MET</span>
                            ) : (
                              <span className="text-amber-500 flex items-center gap-1">{ex.minimumSteps - parseInt(stepsVal || "0")} steps remaining • STEP TARGET NOT MET</span>
                            )}
                          </div>
                        ) : null}`);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
