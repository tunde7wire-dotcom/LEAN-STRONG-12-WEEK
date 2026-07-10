const fs = require('fs');
let code = fs.readFileSync('src/components/WeeklyTab.tsx', 'utf8');

code = code.replace(
  '          const isCompleted = settings.completedDays[`W${selectedWeekNum}-D${index}`] || false;\n\n          return (',
  `          const isRequired = day.exercises.some(ex => ex.required);
          const isCompleted = isRequired ? (settings.completedDays[\`W\${selectedWeekNum}-D\${index}\`] || false) : false;
          let labelText = day.isTrainingDay ? "Strength" : "Active Rest";
          if (!isRequired) {
            labelText = day.exercises.length > 0 ? "Optional" : "Rest";
          }
          if (day.dayName === "Sunday") labelText = "Full Rest";

          return (`
);

code = code.replace(
  '{day.isTrainingDay ? "Strength" : "Active Rest"}',
  '{labelText}'
);

fs.writeFileSync('src/components/WeeklyTab.tsx', code);
