const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const oldChecklistStr = `    {
      id: "macros",
      title: "Hit Macro Nutrient Targets",
      subtitle: \`\${macros.calories} kcal • \${macros.protein}g Protein\`,
      completed: false, // Self-check
      action: () => onNavigateToTab("meals"),
      icon: <Flame className="w-5 h-5 text-neutral-400" />
    }
  ];

  // Calculate overall day percentage completed
  const workoutCompleted = settings.completedDays[\`W\${currentWeekNum}-D\${currentDayIndex}\`] ? 1 : 0;
  const weighInCompleted = weightLoggedToday ? 1 : 0;
  const totalCompleted = workoutCompleted + weighInCompleted;`;

const newChecklistStr = `    {
      id: "macros",
      title: "Hit Macro Nutrient Targets",
      subtitle: \`\${macros.calories} kcal • \${macros.protein}g Protein\`,
      completed: macrosComplete, // Manual check
      action: () => onNavigateToTab("meals"),
      icon: <Flame className="w-5 h-5 text-neutral-400" />
    }
  ];

  // Calculate overall day percentage completed dynamically
  const totalTasks = checklist.length;
  const completedTasks = checklist.filter(item => item.completed).length;`;

code = code.replace(oldChecklistStr, newChecklistStr);
fs.writeFileSync('src/components/TodayTab.tsx', code);
