const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const todayProp = `
            planStatus={planStatus}
            elapsedDays={elapsedDays}
            hasMeaningfulActiveWorkout={hasMeaningfulWorkoutData(activeWorkout) && activeWorkout?.weekNumber === liveWeekNum && activeWorkout?.dayIndex === liveDayIndex}
            onStartWorkout={() => {
`;

code = code.replace(/planStatus=\{planStatus\}\s*elapsedDays=\{elapsedDays\}\s*onStartWorkout=\{\(\) => \{/, todayProp);

fs.writeFileSync('src/App.tsx', code);
console.log('App today patched');
