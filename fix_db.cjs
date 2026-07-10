const fs = require('fs');
let code = fs.readFileSync('src/utils/db.ts', 'utf8');

// Strip all previous NAME_MIGRATIONS blocks
code = code.replace(/const NAME_MIGRATIONS[^}]+};\s*const applyMigrations =[^}]+};\s*};/g, '');
code = code.replace(/const NAME_MIGRATIONS: Record<string, string> = {[\s\S]*?return migrated \? newData : data;\n};/g, '');

const cleanLogic = `
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
  cleanLogic + '\nexport const getBestSetLogs = (): Record<string, BestSetLog> => {'
);

fs.writeFileSync('src/utils/db.ts', code);
