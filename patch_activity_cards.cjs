const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const activityCardsRegex = /<div className="space-y-3">\s*\{dayPlan\.exercises\.map\(\(ex, i\) => \(\s*<div key=\{i\} className="bg-white\/5 border border-white\/10 p-4 rounded-xl">[\s\S]*?<\/div>\s*\)\}\s*<\/div>/;

const newActivityCardsRender = `<div className="space-y-3">
            {dayPlan.exercises.map((ex, i) => {
              const isClickable = planStatus === 'active' && dayPlan.exercises.length > 0;
              const Wrapper = isClickable ? "button" : "div";
              return (
                <Wrapper 
                  key={i} 
                  onClick={isClickable ? openTodaysSession : undefined}
                  className={\`w-full text-left bg-white/5 border border-white/10 p-4 rounded-xl \${
                    isClickable ? "cursor-pointer hover:bg-white/10 active:scale-[0.99] transition-all" : ""
                  }\`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-base text-white">{ex.name}</div>
                      <div className="text-xs text-zinc-400 mt-1 uppercase tracking-wider font-mono">Duration: {ex.reps}</div>
                      <div className="text-xs text-zinc-500 mt-1">{ex.effortCue}</div>
                    </div>
                    {isClickable && (
                      <ArrowRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>`;

code = code.replace(activityCardsRegex, newActivityCardsRender);
fs.writeFileSync('src/components/TodayTab.tsx', code);
