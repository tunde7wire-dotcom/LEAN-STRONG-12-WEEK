const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');

// Add timebox and warmup to the days in planData
const replacements = [
  {
    old: '  const revisedThursday: DayPlan = {\n    dayName: "Thursday",\n    name: "Lift Day B: Hinge + Shoulders + Vertical Pull + Chest",\n    isTrainingDay: true,\n    exercises: [',
    new: '  const revisedThursday: DayPlan = {\n    dayName: "Thursday",\n    name: "Lift Day B: Hinge + Shoulders + Vertical Pull + Chest",\n    isTrainingDay: true,\n    timeBox: "45-60 minutes",\n    warmUp: ["4-5 minutes easy bike or elliptical", "8 bodyweight squats", "8 push-ups", "10 light cable face pulls", "2-3 ramp-up sets before Smith RDL"],\n    supersetInstructions: [\n      "Superset A: lat pulldown, then standing cable fly, then rest 75-90 seconds. Complete 3 rounds.",\n      "Superset B: calf raise, then rope pressdown, then rest 60-75 seconds. Complete 2 paired rounds, then perform the third calf set alone."\n    ],\n    exercises: ['
  },
  {
    old: '  const revisedTuesday: DayPlan = {\n    dayName: "Tuesday",\n    name: "Lift Day A: Squat + Chest + Back + Hamstrings",\n    isTrainingDay: true,\n    exercises: [',
    new: '  const revisedTuesday: DayPlan = {\n    dayName: "Tuesday",\n    name: "Lift Day A: Squat + Chest + Back + Hamstrings",\n    isTrainingDay: true,\n    timeBox: "45-60 minutes",\n    warmUp: ["4-5 minutes easy bike or elliptical", "8 bodyweight squats", "8 push-ups", "10 light cable face pulls", "2-3 ramp-up sets before Smith squat"],\n    supersetInstructions: [\n      "Superset A: row, then stability-ball curl, then rest 75-90 seconds. Complete 3 rounds.",\n      "Superset B: lateral raise, then cable curl, then rest 60 seconds. Complete 2 rounds."\n    ],\n    exercises: ['
  },
  {
    old: '  const revisedSaturday: DayPlan = {\n    dayName: "Saturday",\n    name: "Lift Day C: Unilateral Legs + Upper Chest + Back + Arms",\n    isTrainingDay: true,\n    exercises: [',
    new: '  const revisedSaturday: DayPlan = {\n    dayName: "Saturday",\n    name: "Lift Day C: Unilateral Legs + Upper Chest + Back + Arms",\n    isTrainingDay: true,\n    timeBox: "45-60 minutes",\n    warmUp: ["4-5 minutes easy bike or elliptical", "8 bodyweight squats", "8 push-ups", "10 light cable face pulls", "1-2 lighter sets before split squats and incline pressing"],\n    supersetInstructions: [\n      "Arm superset: Perform cable curl, then rope pressdown, then rest 60 seconds.",\n      "Complete 3 rounds. Keep the row and lateral raise as straight, separate exercises."\n    ],\n    exercises: ['
  },
  {
    old: '  const revisedMonday: DayPlan = {\n    dayName: "Monday",\n    name: "Zone 2 Indoor Trainer Ride",\n    isTrainingDay: false,\n    exercises: [',
    new: '  const revisedMonday: DayPlan = {\n    dayName: "Monday",\n    name: "Zone 2 Indoor Trainer Ride",\n    isTrainingDay: false,\n    timeBox: isDeload ? "20-25 minutes" : "25-35 minutes",\n    exercises: ['
  },
  {
    old: '  const revisedWednesday: DayPlan = {\n    dayName: "Wednesday",\n    name: "Active-Recovery Zwift Ride",\n    isTrainingDay: false,\n    exercises: [',
    new: '  const revisedWednesday: DayPlan = {\n    dayName: "Wednesday",\n    name: "Active-Recovery Zwift Ride",\n    isTrainingDay: false,\n    timeBox: isDeload ? "20-25 minutes" : "30 minutes",\n    exercises: ['
  },
  {
    old: '  const revisedFriday: DayPlan = {\n    dayName: "Friday",\n    name: "Rest or Optional Mobility",\n    isTrainingDay: false,\n    exercises: [',
    new: '  const revisedFriday: DayPlan = {\n    dayName: "Friday",\n    name: "Rest or Optional Mobility",\n    isTrainingDay: false,\n    timeBox: "0-10 minutes",\n    exercises: ['
  },
  {
    old: '  const revisedSunday: DayPlan = {\n    dayName: "Sunday",\n    name: "Full Rest",\n    isTrainingDay: false,\n    exercises: []',
    new: '  const revisedSunday: DayPlan = {\n    dayName: "Sunday",\n    name: "Full Rest",\n    isTrainingDay: false,\n    timeBox: "-",\n    exercises: []'
  },
  {
    old: 'days: finalDays',
    new: `progressionFocus: weekNumber === 2 ? [
        "Full-volume Thursday and Saturday",
        "Normal working loads",
        "Compounds about 2 RIR",
        "Isolation work 1-2 RIR"
      ] : weekNumber === 3 ? [
        "Begin the full weekly schedule",
        "Establish repeatable baseline loads within each prescribed rep range"
      ] : weekNumber === 4 ? [
        "Add repetitions at the same loads where possible",
        "A single clean repetition counts as progress"
      ] : weekNumber === 5 ? [
        "Increase weight only after every set reaches the top of the rep range with clean form"
      ] : weekNumber === 6 ? [
        "Continue double progression",
        "Record the strongest technically clean set on each major lift"
      ] : weekNumber === 7 ? [
        "Deload. Use reduced sets, 10-20% less load, and about 4 RIR.",
        "Shorten both rides."
      ] : weekNumber === 8 ? [
        "Resume normal volume using Week 6 loads, usually at the lower end of each rep range"
      ] : weekNumber === 9 ? [
        "Build repetitions. Prioritize flat bench, incline bench, curls, pressdowns, and lateral raises."
      ] : weekNumber === 10 ? [
        "Increase load where all prescribed sets reached the top of the range.",
        "Use the smallest available increase."
      ] : weekNumber === 11 ? [
        "Pursue controlled rep bests.",
        "Final compound set about 1-2 RIR; final isolation set may reach 0-1 RIR with strict form."
      ] : weekNumber === 12 ? [
        "Consolidate. Match or slightly exceed Week 11; record final loads and repetitions.",
        "Do not test one-repetition maximums."
      ] : undefined,
      days: finalDays`
  }
];

replacements.forEach(r => {
  code = code.split(r.old).join(r.new);
});

fs.writeFileSync('src/utils/planData.ts', code);
