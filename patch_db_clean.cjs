const fs = require('fs');
let code = fs.readFileSync('src/utils/db.ts', 'utf8');

const targetBest = `export const getBestSetLogs = (): Record<string, BestSetLog> =>
  loadFromLocalStorage<Record<string, BestSetLog>>(KEY_BEST_SETS, {});`;

const replaceBest = `export const getBestSetLogs = (): Record<string, BestSetLog> => {
  const data = loadFromLocalStorage<Record<string, BestSetLog>>(KEY_BEST_SETS, {});
  if (data["Bike Zone 2"]) {
    delete data["Bike Zone 2"];
    saveToLocalStorage(KEY_BEST_SETS, data);
  }
  return data;
};`;

code = code.replace(targetBest, replaceBest);

const targetWeekly = `export const getWeeklyBestSetLogs = (): import("../types").WeeklyBestSetLogs => {
  const data = loadFromLocalStorage<import("../types").WeeklyBestSetLogs>(KEY_WEEKLY_BEST_SETS, {});
  if (data["Bike Zone 2"]) {
    let modified = false;
    Object.keys(data["Bike Zone 2"]).forEach(wk => {
      const log = data["Bike Zone 2"][wk];
      if (log.weight !== undefined || log.reps !== undefined) {
        delete data["Bike Zone 2"][wk];
        modified = true;
      }
    });
    if (Object.keys(data["Bike Zone 2"]).length === 0) {
      delete data["Bike Zone 2"];
      modified = true;
    }
    if (modified) {
      saveToLocalStorage(KEY_WEEKLY_BEST_SETS, data);
    }
  }
  return data;
};`;

const replaceWeekly = `export const getWeeklyBestSetLogs = (): import("../types").WeeklyBestSetLogs => {
  const data = loadFromLocalStorage<import("../types").WeeklyBestSetLogs>(KEY_WEEKLY_BEST_SETS, {});
  if (data["Bike Zone 2"]) {
    delete data["Bike Zone 2"];
    saveToLocalStorage(KEY_WEEKLY_BEST_SETS, data);
  }
  return data;
};`;

code = code.replace(targetWeekly, replaceWeekly);
fs.writeFileSync('src/utils/db.ts', code);
