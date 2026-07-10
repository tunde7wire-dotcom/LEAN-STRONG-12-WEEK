const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');

const replacements = [
  { old: 'name: "Smith or Goblet Squat",', new: 'canonicalId: "smith-squat",\n        name: "Smith or Goblet Squat",' },
  { old: 'name: "Smith Squat (Heavy)",', new: 'canonicalId: "smith-squat",\n        name: "Smith Squat (Heavy)",' },
  { old: 'name: "Smith Squat",', new: 'canonicalId: "smith-squat",\n        name: "Smith Squat",' },
  { old: 'name: "DB Bench Press",', new: 'canonicalId: "flat-db-bench-press",\n        name: "DB Bench Press",' },
  { old: 'name: "Flat DB Bench Press",', new: 'canonicalId: "flat-db-bench-press",\n        name: "Flat DB Bench Press",' },
  { old: 'name: "Chest-Supported DB Row",', new: 'canonicalId: "horizontal-row",\n        name: "Chest-Supported DB Row",' },
  { old: 'name: "Cable Row",', new: 'canonicalId: "horizontal-row",\n        name: "Cable Row",' },
  { old: 'name: "Cable or Chest-Supported Row",', new: 'canonicalId: "horizontal-row",\n        name: "Cable or Chest-Supported Row",' },
  { old: 'name: "DB Lateral Raise",', new: 'canonicalId: "lateral-raise",\n        name: "DB Lateral Raise",' },
  { old: 'name: "Cable or DB Lateral Raise",', new: 'canonicalId: "lateral-raise",\n        name: "Cable or DB Lateral Raise",' },
  { old: 'name: "Plank",', new: 'canonicalId: "plank",\n        name: "Plank",' },
  { old: 'name: "Smith/Heavy DB RDL",', new: 'canonicalId: "smith-rdl",\n        name: "Smith/Heavy DB RDL",' },
  { old: 'name: "Smith RDL (Heavy)",', new: 'canonicalId: "smith-rdl",\n        name: "Smith RDL (Heavy)",' },
  { old: 'name: "Smith Romanian Deadlift",', new: 'canonicalId: "smith-rdl",\n        name: "Smith Romanian Deadlift",' },
  { old: 'name: "DB Shoulder Press",', new: 'canonicalId: "db-shoulder-press",\n        name: "DB Shoulder Press",' },
  { old: 'name: "Lat Pulldown",', new: 'canonicalId: "lat-pulldown",\n        name: "Lat Pulldown",' },
  { old: 'name: "Cable Crunch",', new: 'canonicalId: "cable-crunch",\n        name: "Cable Crunch",' },
  { old: 'name: "Bulgarian Split Squat",', new: 'canonicalId: "bulgarian-split-squat",\n        name: "Bulgarian Split Squat",' },
  { old: 'name: "Incline DB Bench Press",', new: 'canonicalId: "incline-db-bench-press",\n        name: "Incline DB Bench Press",' },
  { old: 'name: "1-Arm Cable Row",', new: 'canonicalId: "one-arm-row",\n        name: "1-Arm Cable Row",' },
  { old: 'name: "One-Arm Cable or Machine Row",', new: 'canonicalId: "one-arm-row",\n        name: "One-Arm Cable or Machine Row",' },
  { old: 'name: "Cable Bicep Curl",', new: 'canonicalId: "cable-curl",\n        name: "Cable Bicep Curl",' },
  { old: 'name: "Cable Curl",', new: 'canonicalId: "cable-curl",\n        name: "Cable Curl",' },
  { old: 'name: "Rope Tricep Pressdown",', new: 'canonicalId: "rope-pressdown",\n        name: "Rope Tricep Pressdown",' },
  { old: 'name: "Rope Pressdown",', new: 'canonicalId: "rope-pressdown",\n        name: "Rope Pressdown",' },
  { old: 'name: "Stability-Ball Hamstring Curl",', new: 'canonicalId: "stability-ball-hamstring-curl",\n        name: "Stability-Ball Hamstring Curl",' },
  { old: 'name: "Standing Cable Fly",', new: 'canonicalId: "standing-cable-fly",\n        name: "Standing Cable Fly",' },
  { old: 'name: "Smith Standing Calf Raise",', new: 'canonicalId: "smith-standing-calf-raise",\n        name: "Smith Standing Calf Raise",' }
];

// Perform global replacement, because there can be multiple of the same exercise
replacements.forEach(r => {
  code = code.split(r.old).join(r.new);
});

fs.writeFileSync('src/utils/planData.ts', code);
