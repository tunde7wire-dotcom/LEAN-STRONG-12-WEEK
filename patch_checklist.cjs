const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const checklistRenderRegex = /<div className="space-y-3">\s*\{checklist\.map\(\(item\) => \([\s\S]*?\}\)\}\s*<\/div>/;

const newChecklistRender = `<div className="space-y-3">
          {checklist.map((item) => {
            const isWorkoutRowClickable = item.id === "workout" && planStatus === 'active' && dayPlan.exercises.length > 0;
            const Wrapper = isWorkoutRowClickable ? "button" : "div";
            
            const wrapperProps = isWorkoutRowClickable 
              ? {
                  onClick: openTodaysSession,
                  className: \`w-full text-left flex items-start justify-between p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/10 active:scale-[0.99] border-white/20 hover:border-white/40 \${
                    item.completed ? "bg-white/5 border-white/5 text-neutral-500" : "bg-white/5 text-white"
                  }\`
                }
              : {
                  className: \`flex items-start justify-between p-4 rounded-xl border transition-all \${
                    item.completed 
                      ? "bg-white/5 border-white/5 text-neutral-500" 
                      : "bg-white/5 border-white/10 hover:border-white/20 text-white"
                  }\`
                };

            return (
              <Wrapper
                id={\`checklist-item-\${item.id}\`}
                key={item.id}
                {...(wrapperProps as any)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {item.completed ? (
                      <div className="tracking-dot" />
                    ) : (
                      <div className="w-2 h-2 rounded-full border border-white/40 mt-1" />
                    )}
                  </div>
                  <div>
                    <h4 className={\`text-sm font-bold \${item.completed ? "line-through text-neutral-500" : "text-white"}\`}>
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{item.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center h-full">
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
                </div>
              </Wrapper>
            );
          })}
        </div>`;

code = code.replace(checklistRenderRegex, newChecklistRender);
fs.writeFileSync('src/components/TodayTab.tsx', code);
