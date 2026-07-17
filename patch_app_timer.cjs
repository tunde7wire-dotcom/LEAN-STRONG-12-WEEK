const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Add timerRemainingSeconds state
code = code.replace(
  'const [timerDuration, setTimerDuration] = useState<number>(() => settings.timerDuration);',
  'const [timerDuration, setTimerDuration] = useState<number>(() => settings.timerDuration);\n  const [timerRemainingSeconds, setTimerRemainingSeconds] = useState<number>(() => activeWorkout?.timerRemainingSeconds ?? settings.timerDuration);'
);

// Update save active workout to include timerRemainingSeconds
code = code.replace(
  'setTimerEndTime(state.timerEndTime);',
  'setTimerEndTime(state.timerEndTime);\n      if (state.timerRemainingSeconds !== undefined) setTimerRemainingSeconds(state.timerRemainingSeconds);'
);

// Update handleTimerStart
const handleTimerStart = `const handleTimerStart = (seconds: number) => {
    const endTime = Date.now() + seconds * 1000;
    setTimerEndTime(endTime);
    
    if (activeWorkout) {
      const updated = { ...activeWorkout, timerEndTime: endTime, timerRemainingSeconds: seconds };
      setActiveWorkoutState(updated);
      saveActiveWorkout(updated);
    }
  };`;
code = code.replace(/const handleTimerStart = \([\s\S]*?\}\n  \};\n/, handleTimerStart + '\n');

// Update handleTimerPause
const handleTimerPause = `const handleTimerPause = (remainingSeconds: number) => {
    setTimerEndTime(null);
    setTimerRemainingSeconds(remainingSeconds);
    if (activeWorkout) {
      const updated = { ...activeWorkout, timerEndTime: null, timerRemainingSeconds: remainingSeconds };
      setActiveWorkoutState(updated);
      saveActiveWorkout(updated);
    }
  };`;
code = code.replace(/const handleTimerPause = \(\) => \{[\s\S]*?\}\n  \};\n/, handleTimerPause + '\n');

// Update handleTimerReset
const handleTimerReset = `const handleTimerReset = () => {
    setTimerEndTime(null);
    setTimerRemainingSeconds(settings.timerDuration);
    if (activeWorkout) {
      const updated = { ...activeWorkout, timerEndTime: null, timerRemainingSeconds: settings.timerDuration };
      setActiveWorkoutState(updated);
      saveActiveWorkout(updated);
    }
  };`;
code = code.replace(/const handleTimerReset = \(\) => \{[\s\S]*?\}\n  \};\n/, handleTimerReset + '\n');

// handleTimerClose
const handleTimerClose = `const handleTimerClose = () => {
    setTimerEndTime(null);
    setTimerRemainingSeconds(settings.timerDuration);
    setTimerOpen(false);
    if (activeWorkout) {
      const updated = { ...activeWorkout, timerEndTime: null, timerRemainingSeconds: settings.timerDuration };
      setActiveWorkoutState(updated);
      saveActiveWorkout(updated);
    }
  };`;
code = code.replace('const handleTriggerRestTimer = () => {', handleTimerClose + '\n\n  const handleTriggerRestTimer = () => {');

// Update RestTimer props
code = code.replace(
  'durationSeconds={timerDuration}',
  'durationSeconds={timerDuration}\n          remainingSeconds={timerRemainingSeconds}'
);

code = code.replace(
  'onClose={() => setTimerOpen(false)}',
  'onClose={handleTimerClose}'
);

// Update handleTriggerRestTimer to use remaining time
code = code.replace(
  'handleTimerStart(settings.timerDuration);',
  'handleTimerStart(timerRemainingSeconds);'
);

// We need to fix RestTimer's sound generation so it doesn't beep repeatedly. The useEffect clears interval on unmount or when `endTime` changes, but wait...
// When it reaches 0, it clears the interval, plays beep, and calls `onTimerReset()`. `onTimerReset()` will set `timerEndTime(null)`. This updates `endTime` to null.
// The beep will only play once.

fs.writeFileSync('src/App.tsx', code);
console.log('App timer patched');
