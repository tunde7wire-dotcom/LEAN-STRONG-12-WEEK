const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const regex = /        \}?\)?\s*<\/div>\s*\{\/\* Target Nutrition Section - styled with apple-card \*\/\}/;

const targetStr = `      {/* Target Nutrition Section - styled with apple-card */}`;

code = code.replace(targetStr, `      </div>

      {/* Daily Workout Summary Card - styled with apple-card */}
      <div className="apple-card p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-zinc-500 uppercase">
              Schedule Target
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              {dayPlan.name}
            </h3>
          </div>
          <span className={\`text-xs font-bold px-3 py-1 rounded \${
            dayPlan.isTrainingDay ? "bg-white text-black" : "bg-white/10 text-white border border-white/10"
          }\`}>
            {dayPlan.isTrainingDay ? "STRENGTH" : "RECOVERY"}
          </span>
        </div>
        {dayPlan.isTrainingDay ? (
          <div>
            <p className="text-xs text-zinc-400 mb-4">
              Consists of {dayPlan.exercises.length} structured movements, focusing on progressive best sets.
            </p>
            <button
              id="today-btn-start-workout"
              onClick={onStartWorkout}
              className="w-full bg-white text-black font-bold text-sm py-3 rounded-xl hover:bg-neutral-200 transition-all flex items-center justify-center gap-2 uppercase tracking-wider"
            >
              <Dumbbell className="w-4 h-4 fill-black" />
              {workoutCompleted ? "View Session Log" : "Launch Active Session"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
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
          </div>
        )}
      </div>

      {/* Target Nutrition Section - styled with apple-card */}`);

fs.writeFileSync('src/components/TodayTab.tsx', code);
