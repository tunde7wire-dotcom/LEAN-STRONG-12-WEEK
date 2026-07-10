const fs = require('fs');
let code = fs.readFileSync('src/utils/db.ts', 'utf8');

const migrationLogic = `
const NAME_MIGRATIONS: Record<string, string> = {
  "Smith or Goblet Squat": "Smith Squat",
  "Smith Squat (Heavy)": "Smith Squat",
  "DB Bench Press": "Flat DB Bench Press",
  "Cable Row": "Cable or Chest-Supported Row",
  "Smith/Heavy DB RDL": "Smith Romanian Deadlift",
  "1-Arm Cable Row": "One-Arm Cable or Machine Row",
  "Cable Bicep Curl": "Cable Curl",
  "Rope Tricep Pressdown": "Rope Pressdown"
};

const applyMigrations = <T>(data: Record<string, T>): Record<string, T> => {
  let migrated = false;
  const newData = { ...data };
  for (const [oldName, newName] of Object.entries(NAME_MIGRATIONS)) {
    if (newData[oldName]) {
      if (!newData[newName]) {
        newData[newName] = newData[oldName];
      }
      delete newData[oldName];
      migrated = true;
    }
  }
  return migrated ? newData : data;
};
`;

code = code.replace(
  'export const getBestSetLogs = (): Record<string, BestSetLog> => {',
  migrationLogic + '\nexport const getBestSetLogs = (): Record<string, BestSetLog> => {'
);

code = code.replace(
  /export const getBestSetLogs = \(\): Record<string, BestSetLog> => \{\s*const data = loadFromLocalStorage<Record<string, BestSetLog>>\(KEY_BEST_SETS, \{\}\);\s*if \(data\["Bike Zone 2"\]\) \{\s*delete data\["Bike Zone 2"\];\s*saveToLocalStorage\(KEY_BEST_SETS, data\);\s*\}/,
  'export const getBestSetLogs = (): Record<string, BestSetLog> => {\n  let data = loadFromLocalStorage<Record<string, BestSetLog>>(KEY_BEST_SETS, {});\n  if (data["Bike Zone 2"]) {\n    delete data["Bike Zone 2"];\n    saveToLocalStorage(KEY_BEST_SETS, data);\n  }\n  const migrated = applyMigrations(data);\n  if (migrated !== data) saveToLocalStorage(KEY_BEST_SETS, migrated);\n  data = migrated;'
);

code = code.replace(
  /export const getWeeklyBestSetLogs = \(\): import\("\.\.\/types"\)\.WeeklyBestSetLogs => \{\s*const data = loadFromLocalStorage<import\("\.\.\/types"\)\.WeeklyBestSetLogs>\(KEY_WEEKLY_BEST_SETS, \{\}\);\s*if \(data\["Bike Zone 2"\]\) \{\s*delete data\["Bike Zone 2"\];\s*saveToLocalStorage\(KEY_WEEKLY_BEST_SETS, data\);\s*\}/,
  'export const getWeeklyBestSetLogs = (): import("../types").WeeklyBestSetLogs => {\n  let data = loadFromLocalStorage<import("../types").WeeklyBestSetLogs>(KEY_WEEKLY_BEST_SETS, {});\n  if (data["Bike Zone 2"]) {\n    delete data["Bike Zone 2"];\n    saveToLocalStorage(KEY_WEEKLY_BEST_SETS, data);\n  }\n  const migrated = applyMigrations(data);\n  if (migrated !== data) saveToLocalStorage(KEY_WEEKLY_BEST_SETS, migrated);\n  data = migrated;'
);

fs.writeFileSync('src/utils/db.ts', code);
