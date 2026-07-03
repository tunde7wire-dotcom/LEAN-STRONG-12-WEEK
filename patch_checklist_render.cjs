const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const oldRender = `                <div className="flex items-center h-full">
                  {isWorkoutRowClickable ? (
                    <div className="p-1 text-neutral-500 flex items-center gap-1">
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ) : item.action && !item.completed ? (
                    <button
                      id={\`btn-action-\${item.id}\`}
                      onClick={item.action}
                      className="text-xs font-bold bg-white text-black py-1 px-3 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider"
                    >
                      Go
                    </button>
                  ) : (
                    <div className="p-1">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-600" />
                      )}
                    </div>
                  )}
                </div>`;

const newRender = `                <div className="flex items-center gap-2 h-full">
                  {item.id === "macros" && (
                    <button
                      onClick={toggleMacrosComplete}
                      className="text-xs font-bold border border-white/20 text-white py-1 px-3 rounded hover:bg-white/10 transition-colors uppercase tracking-wider"
                    >
                      {item.completed ? "Undo" : "Done"}
                    </button>
                  )}
                  {isWorkoutRowClickable ? (
                    <div className="p-1 text-neutral-500 flex items-center gap-1">
                      {item.completed && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  ) : item.action ? (
                    <button
                      id={\`btn-action-\${item.id}\`}
                      onClick={item.action}
                      className="text-xs font-bold bg-white text-black py-1 px-3 rounded hover:bg-neutral-200 transition-colors uppercase tracking-wider"
                    >
                      Go
                    </button>
                  ) : (
                    <div className="p-1">
                      {item.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-600" />
                      )}
                    </div>
                  )}
                </div>`;

code = code.replace(oldRender, newRender);
fs.writeFileSync('src/components/TodayTab.tsx', code);
