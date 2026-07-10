const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const newSwaps = `
  "Stability-Ball Hamstring Curl": [
    {name: "Standing Single-Leg Cable Curl with ankle cuff", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Smith Standing Calf Raise": [
    {name: "Single-Leg Dumbbell Calf Raise", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Cable or Chest-Supported Row": [
    {name: "Selectorized Machine Row", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "One-Arm Cable or Machine Row": [
    {name: "One-Arm Selectorized Machine Row", trackingType: "load_reps", progressMode: "weekly_best"},
    {name: "Bilateral Selectorized Machine Row", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
  "Standing Cable Fly": [
    {name: "Cable Press", trackingType: "load_reps", progressMode: "weekly_best"}
  ],
`;

code = code.replace(
  'const PRESET_SWAPS: Record<string, {name: string, trackingType: import("../types").TrackingType, progressMode: import("../types").ProgressMode}[]> = {',
  'const PRESET_SWAPS: Record<string, {name: string, trackingType: import("../types").TrackingType, progressMode: import("../types").ProgressMode}[]> = {' + newSwaps
);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
