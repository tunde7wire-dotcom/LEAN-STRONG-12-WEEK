const fs = require('fs');
let code = fs.readFileSync('src/components/WeeklyTab.tsx', 'utf8');

code = code.replace(
  '<span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Training Days</span>\n            <span className="text-sm font-bold text-white block mt-1">2,450 kcal</span>\n            <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">200g P / 70-85g F / 200-260g C</span>',
  '<span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Training Days</span>\n            <span className="text-sm font-bold text-white block mt-1">{weekPlan.nutrition.training.calories.toLocaleString()} kcal</span>\n            <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">{weekPlan.nutrition.training.protein}g P / {weekPlan.nutrition.training.fat} F / {weekPlan.nutrition.training.carbs} C</span>'
);

code = code.replace(
  '<span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Rest Days</span>\n            <span className="text-sm font-bold text-white block mt-1">2,400 kcal</span>\n            <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">200g P / 75-90g F / 160-220g C</span>',
  '<span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Non-Training Days</span>\n            <span className="text-sm font-bold text-white block mt-1">{weekPlan.nutrition.nonTraining.calories.toLocaleString()} kcal</span>\n            <span className="text-[10px] text-zinc-400 block mt-0.5 font-mono">{weekPlan.nutrition.nonTraining.protein}g P / {weekPlan.nutrition.nonTraining.fat} F / {weekPlan.nutrition.nonTraining.carbs} C</span>'
);

fs.writeFileSync('src/components/WeeklyTab.tsx', code);
