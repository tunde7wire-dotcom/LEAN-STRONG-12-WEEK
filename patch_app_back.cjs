const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const backCode = `onBackToWeekly={() => {
              if (activeWorkout && !hasMeaningfulWorkoutData(activeWorkout) && !timerEndTime) {
                setActiveWorkoutState(null);
                saveActiveWorkout(null);
              }
              setActiveTab("overview");
            }}`;

code = code.replace(/onBackToWeekly=\{\(\) => \{\s*setActiveTab\("overview"\);\s*\}\}/, backCode);
fs.writeFileSync('src/App.tsx', code);
console.log('App patched back');
