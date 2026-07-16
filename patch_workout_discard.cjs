const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

// Insert State
const stateInsert = `
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleConfirmDiscard = () => {
    setLocalLogs({});
    setShowDiscardModal(false);
    onDiscardWorkout();
  };
`;
code = code.replace('const [showBikeCompleted, setShowBikeCompleted] = useState(false);', 'const [showBikeCompleted, setShowBikeCompleted] = useState(false);\n' + stateInsert);

// Insert modal JSX
const modalJSX = `
      {/* Discard Modal */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1c1e] rounded-2xl w-full max-w-sm overflow-hidden border border-white/10 shadow-2xl">
            <div className="p-6">
              <h3 className="text-lg font-bold text-white mb-2">Discard this workout?</h3>
              <p className="text-sm text-zinc-400">Your entries for this unfinished workout will be removed. Previously completed workouts will not be affected.</p>
            </div>
            <div className="flex border-t border-white/10 divide-x divide-white/10">
              <button
                onClick={() => setShowDiscardModal(false)}
                className="flex-1 py-4 text-sm font-bold text-white hover:bg-white/5 transition-colors"
              >
                Keep Workout
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="flex-1 py-4 text-sm font-bold text-red-500 hover:bg-white/5 transition-colors"
              >
                Discard Workout
              </button>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace('      {/* Form Guide Modal */}', modalJSX + '\n      {/* Form Guide Modal */}');

// Insert Discard Button in Header
const headerRegex = /<button\s*id="workout-btn-back"[\s\S]*?<\/button>/m;
const headerReplacement = `<div className="flex justify-between items-center mb-5">
        <button
          id="workout-btn-back"
          onClick={onBackToWeekly}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors font-mono font-bold uppercase tracking-wider"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Week {selectedWeekNum}
        </button>
        {activeWorkout && activeWorkout.weekNumber === selectedWeekNum && activeWorkout.dayIndex === dayIndex && hasMeaningfulWorkoutData(activeWorkout) && (
          <button
            onClick={() => setShowDiscardModal(true)}
            className="text-[10px] font-mono font-bold text-red-400 hover:text-red-300 uppercase tracking-wider border border-red-500/20 bg-red-500/10 px-2 py-1 rounded"
          >
            Cancel Workout
          </button>
        )}
      </div>`;

code = code.replace(/<button\s*id="workout-btn-back"[\s\S]*?<\/button>/m, headerReplacement);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
console.log('Discard patched');
