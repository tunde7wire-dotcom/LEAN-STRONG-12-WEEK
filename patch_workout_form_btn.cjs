const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const injection = `
          // Form Guide Resolution
          const formGuide = getExerciseFormGuide({
            canonicalId: ex.canonicalId,
            selectedSubstitutionId: typeof swapData === 'object' ? swapData.canonicalId : (typeof swapData === 'string' ? swapData : undefined),
            resolvedExerciseName: currentName,
          });

          return (`;

code = code.replace('          return (', injection);

const buttonInjection = `                {/* Form Guide & Swap actions */}
                <div className="flex items-center gap-2">
                  {formGuide && (
                    <button
                      onClick={() => handleOpenFormGuide(ex, swapData, formGuide)}
                      className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-1 rounded transition-colors flex items-center gap-1 shrink-0"
                    >
                      <Play className="w-3 h-3" /> View Form
                    </button>
                  )}
                  {swappingExId !== ex.id ? (
                    <button
                      id={\`exercise-btn-swap-trigger-\${ex.id}\`}
                      onClick={() => handleOpenSwap(ex)}
                      className="text-xs text-zinc-400 hover:text-white p-1 border border-white/10 hover:border-white/20 rounded transition-colors flex items-center gap-1 shrink-0"
                      title="Swap exercise"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      id={\`exercise-btn-swap-cancel-\${ex.id}\`}
                      onClick={() => setSwappingExId(null)}
                      className="text-xs text-zinc-400 hover:text-white font-mono font-bold uppercase tracking-wider shrink-0"
                    >
                      Cancel
                    </button>
                  )}
                </div>`;

code = code.replace(
  /                \{\/\* Inline Exercise swap action \*\/\}[\s\S]*?                  \)\}\n                \)\}/m,
  buttonInjection
);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
