const fs = require('fs');
let code = fs.readFileSync('src/utils/db.ts', 'utf8');

const regex = /const NAME_MIGRATIONS: Record<string, string> = {[\s\S]*?};\n\nconst applyMigrations = <T>\(data: Record<string, T>\): Record<string, T> => {[\s\S]*?  return migrated \? newData : data;\n};/;

const newLogic = `const CANONICAL_MAPPINGS: Record<string, string> = {
  "Smith or Goblet Squat": "smith-squat",
  "Smith Squat (Heavy)": "smith-squat",
  "Smith Squat": "smith-squat",

  "DB Bench Press": "flat-db-bench-press",
  "Flat DB Bench Press": "flat-db-bench-press",

  "Cable Row": "horizontal-row",
  "Cable or Chest-Supported Row": "horizontal-row",
  "Chest-Supported DB Row": "horizontal-row",
  "Selectorized Machine Row": "horizontal-row",

  "DB Lateral Raise": "lateral-raise",
  "Cable or DB Lateral Raise": "lateral-raise",
  "Cable Lateral Raise": "lateral-raise",

  "Plank": "plank",
  "RKC Plank": "plank",

  "Smith/Heavy DB RDL": "smith-rdl",
  "Smith RDL (Heavy)": "smith-rdl",
  "Smith Romanian Deadlift": "smith-rdl",

  "DB Shoulder Press": "db-shoulder-press",
  
  "Lat Pulldown": "lat-pulldown",
  
  "Cable Crunch": "cable-crunch",
  
  "Bulgarian Split Squat": "bulgarian-split-squat",

  "Incline DB Bench Press": "incline-db-bench-press",

  "1-Arm Cable Row": "one-arm-row",
  "One-Arm Cable or Machine Row": "one-arm-row",
  "One-Arm Selectorized Machine Row": "one-arm-row",

  "Cable Bicep Curl": "cable-curl",
  "Cable Curl": "cable-curl",

  "Rope Tricep Pressdown": "rope-pressdown",
  "Rope Pressdown": "rope-pressdown"
};

const getScore = (l: any) => {
  if (!l) return -1;
  if (l.weight && l.weight > 0) return (l.weight * 1000 + (l.reps || 0));
  if (l.duration) return l.duration;
  if (l.steps) return l.steps;
  if (l.assistance) return 1000 - l.assistance;
  return l.reps || 0;
};

const applyMigrations = <T>(data: Record<string, T>): Record<string, T> => {
  let migrated = false;
  const newData = { ...data };
  
  for (const [oldName, canonicalKey] of Object.entries(CANONICAL_MAPPINGS)) {
    if (newData[oldName]) {
      const existing = newData[canonicalKey];
      const newRec = newData[oldName];
      
      // Merge weekly best logic
      if (typeof existing === 'object' && existing !== null && !('weight' in existing) && !('duration' in existing) && !('date' in existing)) {
        // It's WeeklyBestSetLogs structure
        newData[canonicalKey] = { ...existing } as any;
        for (const [wk, entry] of Object.entries(newRec as any)) {
          const exWk = (newData[canonicalKey] as any)[wk];
          if (!exWk || getScore(entry) > getScore(exWk)) {
            (newData[canonicalKey] as any)[wk] = { ...entry, exerciseName: canonicalKey };
          }
        }
      } else {
        // BestSetLog structure
        if (!existing || getScore(newRec) > getScore(existing)) {
          newData[canonicalKey] = { ...newRec };
        }
      }

      delete newData[oldName];
      migrated = true;
    }
  }

  // Target-adherence activities must remain excluded
  if (newData["Zone 2 Indoor Trainer Ride"]) {
    delete newData["Zone 2 Indoor Trainer Ride"];
    migrated = true;
  }
  if (newData["Zwift Ride"]) {
    delete newData["Zwift Ride"];
    migrated = true;
  }

  return migrated ? newData : data;
};`;

code = code.replace(regex, newLogic);
fs.writeFileSync('src/utils/db.ts', code);
