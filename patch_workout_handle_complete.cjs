const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const targetStr = `      const parsed: any = {};
      if (log.weight) parsed.weight = parseFloat(log.weight);
      if (log.reps) parsed.reps = parseInt(log.reps, 10);
      if (log.duration) parsed.duration = parseFloat(log.duration);
      if (log.steps) parsed.steps = parseInt(log.steps, 10);
      if (log.assistance) parsed.assistance = parseFloat(log.assistance);
      if (log.completed !== undefined) parsed.completed = log.completed;`;

const replaceStr = `      const parsed: any = {};
      if (log.weight !== undefined && log.weight !== "") {
        const wt = parseFloat(log.weight);
        if (!isNaN(wt)) parsed.weight = wt;
      }
      if (log.reps !== undefined && log.reps !== "") {
        const rp = parseInt(log.reps, 10);
        if (!isNaN(rp)) parsed.reps = rp;
      }
      if (log.duration !== undefined && log.duration !== "") {
        const dur = parseFloat(log.duration);
        if (!isNaN(dur) && dur > 0) parsed.duration = dur;
      }
      if (log.steps !== undefined && log.steps !== "") {
        const st = parseInt(log.steps, 10);
        if (!isNaN(st) && st > 0) parsed.steps = st;
      }
      if (log.assistance !== undefined && log.assistance !== "") {
        const ast = parseFloat(log.assistance);
        if (!isNaN(ast)) parsed.assistance = ast;
      }
      if (log.completed !== undefined) {
        parsed.completed = log.completed;
      }`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
