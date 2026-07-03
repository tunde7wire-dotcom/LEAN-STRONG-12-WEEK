const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const targetStr = `    const logsForParent: Record<string, { weight: number; reps: number }> = {};
    Object.entries(updated).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string };
      const wt = parseFloat(log.weight);
      const rp = parseInt(log.reps, 10);
      if (!isNaN(wt) && !isNaN(rp)) {
        logsForParent[exId] = { weight: wt, reps: rp };
      }
    });`;

const replacementStr = `    const logsForParent: Record<string, any> = {};
    Object.entries(updated).forEach(([exId, logEntry]) => {
      const log = logEntry as { weight?: string; reps?: string; duration?: string; steps?: string; assistance?: string; completed?: boolean };
      const out: any = {};
      
      if (log.weight !== undefined && log.weight !== "") {
        const wt = parseFloat(log.weight);
        if (!isNaN(wt)) out.weight = wt;
      }
      if (log.reps !== undefined && log.reps !== "") {
        const rp = parseInt(log.reps, 10);
        if (!isNaN(rp)) out.reps = rp;
      }
      if (log.duration !== undefined && log.duration !== "") {
        const dur = parseFloat(log.duration);
        if (!isNaN(dur) && dur > 0) out.duration = dur;
      }
      if (log.steps !== undefined && log.steps !== "") {
        const st = parseInt(log.steps, 10);
        if (!isNaN(st) && st > 0) out.steps = st;
      }
      if (log.assistance !== undefined && log.assistance !== "") {
        const ast = parseFloat(log.assistance);
        if (!isNaN(ast)) out.assistance = ast;
      }
      if (log.completed !== undefined) {
        out.completed = log.completed;
      }
      
      if (Object.keys(out).length > 0) {
        logsForParent[exId] = out;
      }
    });`;

code = code.replace(targetStr, replacementStr);
fs.writeFileSync('src/components/WorkoutTab.tsx', code);
