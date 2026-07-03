const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const checklistAnchor = `  const checklist = [`;

const newChecklistLogic = `  const todayStr = getLocalTodayString();
  const currentDayOfWeek = new Date().getDay(); // Local day of week
  const isWeighInDay = currentDayOfWeek === 1 || currentDayOfWeek === 3 || currentDayOfWeek === 5;

  const fullChecklist = [
    {
      id: "workout",
      title: dayPlan.exercises.length > 1 ? \`Log Workout: \${dayPlan.name}\` : \`Active Recovery: \${dayPlan.name}\`,
      subtitle: dayPlan.isTrainingDay ? "Target strength set progression" : "Active physical recovery & walk",
      completed: settings.completedDays[\`W\${currentWeekNum}-D\${currentDayIndex}\`] || false,
      action: undefined, // We'll handle workout row click separately
      icon: <Dumbbell className="w-5 h-5 text-neutral-400" />
    },
    {
      id: "weighin",
      title: "Morning Fasted Weigh-In",
      subtitle: weightLoggedToday ? \`Logged: \${weightValueToday} \${settings.units === "imperial" ? "lbs" : "kg"}\` : "Track weight for weekly averaging",
      completed: weightLoggedToday,
      action: () => onNavigateToTab("progress"),
      icon: <Calendar className="w-5 h-5 text-neutral-400" />
    },
    {
      id: "macros",
      title: "Hit Macro Nutrient Targets",
      subtitle: \`\${macros.calories} kcal • \${macros.protein}g Protein\`,
      completed: macrosComplete, // Manual check
      action: () => onNavigateToTab("meals"),
      icon: <Flame className="w-5 h-5 text-neutral-400" />
    }
  ];

  const checklist = fullChecklist.filter(item => {
    if (item.id === "weighin" && !isWeighInDay) return false;
    return true;
  });`;

// Replace from `const checklist = [` to `  ];`
code = code.replace(/  const checklist = \[[\s\S]*?  \];/, newChecklistLogic);

fs.writeFileSync('src/components/TodayTab.tsx', code);
