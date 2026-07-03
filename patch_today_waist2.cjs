const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const oldStr = `  const isWeighInDay = currentDayOfWeek === 1 || currentDayOfWeek === 3 || currentDayOfWeek === 5;

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

const newStr = `  const isWeighInDay = currentDayOfWeek === 1 || currentDayOfWeek === 3 || currentDayOfWeek === 5;
  const isWaistDay = currentDayOfWeek === 5;
  const waistLoggedToday = checkins.some(c => c.waist !== undefined && c.date === todayStr);

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
      id: "waist",
      title: "Weekly Waist Measurement",
      subtitle: "Measure under consistent conditions for weekly trend tracking.",
      completed: waistLoggedToday,
      action: () => onNavigateToTab("progress"),
      icon: <Award className="w-5 h-5 text-neutral-400" />
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
    if (item.id === "waist" && !isWaistDay) return false;
    return true;
  });`;

code = code.replace(oldStr, newStr);

fs.writeFileSync('src/components/TodayTab.tsx', code);
