const fs = require('fs');

const code = `
import { WeekPlan, DayPlan } from "../types";

const MACROS_TRAINING = { calories: 2100, protein: 160, fat: "60g", carbs: "230g" };
const MACROS_NON_TRAINING = { calories: 1800, protein: 160, fat: "60g", carbs: "155g" };

export function getPlanForWeek(weekNumber: number): WeekPlan {
  const isDeload = weekNumber === 7;

  // Helper to adjust sets for legacy Deload (50% working sets, minimum of 1 set)
  const adjustSetsLegacy = (originalSetsStr: string): string => {
    if (!isDeload) return originalSetsStr;
    const match = originalSetsStr.match(/(\\d+)-?(\\d+)?/);
    if (!match) return "1";
    const num = parseInt(match[2] || match[1], 10);
    const deloadSets = Math.max(1, Math.round(num * 0.5));
    return deloadSets.toString();
  };

  const deloadCueLegacy = isDeload ? " [DELOAD: Reduce weight by 10-20%]" : "";

  // ---------------------------------------------------------
  // LEGACY DAYS
  // ---------------------------------------------------------
  const legacyMonday: DayPlan = {
    dayName: "Monday",
    name: "Zone 2 Cardio & Mobility",
    isTrainingDay: false,
    exercises: [
      {
        id: \`w\${weekNumber}-d1-ex1\`,
        name: "Bike Zone 2",
        originalName: "Bike Zone 2",
        sets: "1",
        reps: "25-35 min",
        tempoCue: "Continuous low-intensity steady state (LISS)",
        effortCue: \`RPE 4-5. Talk-test pace.\${deloadCueLegacy}\`,
        required: true,
        category: "cardio", trackingType: "duration", progressMode: "target_adherence"
      },
      {
        id: \`w\${weekNumber}-d1-ex2\`,
        name: "Optional Full-Body Mobility",
        originalName: "Optional Full-Body Mobility",
        sets: "1",
        reps: "5-10 min",
        tempoCue: "Slow and controlled",
        effortCue: "Focus on hip flexors, thoracic spine, and hamstrings.",
        required: false,
        category: "mobility", trackingType: "duration", progressMode: "target_adherence"
      }
    ]
  };

  const legacyTuesday: DayPlan = {
    dayName: "Tuesday",
    name: "Day A: Squat & Horizontal Push/Pull",
    isTrainingDay: true,
    exercises: [
      {
        id: \`w\${weekNumber}-d2-ex1\`,
        name: weekNumber <= 2 ? "Smith or Goblet Squat" : "Smith Squat (Heavy)",
        originalName: "Smith or Goblet Squat",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "3" : "4"),
        reps: weekNumber <= 2 ? "6-8" : "6-10",
        tempoCue: "3-0-1-0 tempo (3s negative, 1s up)",
        effortCue: \`RPE 8-9. Control the descent.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex2\`,
        name: "DB Bench Press",
        originalName: "DB Bench Press",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "3" : "4"),
        reps: weekNumber <= 2 ? "6-10" : "6-10",
        tempoCue: "2-0-1-0 tempo",
        effortCue: \`RPE 8-9. Push from heels, keep shoulder blades packed.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex3\`,
        name: "Cable Row",
        originalName: "Cable Row",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "3" : "4"),
        reps: "8-12",
        tempoCue: "2-1-1-1 tempo (hold squeeze for 1s)",
        effortCue: \`RPE 8. Squeeze shoulder blades together.\${deloadCueLegacy}\`,
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d2-ex4\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex4\`,
        name: "DB RDL",
        originalName: "DB RDL",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "2" : "3"),
        reps: "8-10",
        tempoCue: "3-0-1-0 tempo",
        effortCue: \`RPE 8. Push hips back, feel deep stretch in hamstrings.\${deloadCueLegacy}\`,
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d2-ex3\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex5\`,
        name: "DB Lateral Raise",
        originalName: "DB Lateral Raise",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "2" : "3"),
        reps: "12-15",
        tempoCue: "2-0-1-0 tempo",
        effortCue: \`RPE 9. Slight forward lean.\${deloadCueLegacy}\`,
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d2-ex6\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex6\`,
        name: "Plank",
        originalName: "Plank",
        sets: adjustSetsLegacy("2"),
        reps: "30-60 sec",
        tempoCue: "Static hold",
        effortCue: \`RPE 8-9. Squeeze glutes and core.\${deloadCueLegacy}\`,
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d2-ex5\`,
        required: true,
        category: "core", trackingType: "duration", progressMode: "weekly_best"
      }
    ]
  };

  const legacyWednesday: DayPlan = {
    dayName: "Wednesday",
    name: "Active Recovery (Steps & Mobility)",
    isTrainingDay: false,
    exercises: [
      {
        id: \`w\${weekNumber}-d3-ex1\`,
        name: "Steps Focus Only",
        originalName: "Steps Focus Only",
        sets: "1",
        reps: "8,000-10,000 steps", minimumSteps: 8000, required: true,
        tempoCue: "Normal walking speed",
        effortCue: "Outdoor active walk. Low stress recovery.",
        category: "cardio", trackingType: "steps", progressMode: "target_adherence"
      },
      {
        id: \`w\${weekNumber}-d3-ex2\`,
        name: "Optional Hip & Ankle Mobility",
        originalName: "Optional Hip & Ankle Mobility",
        sets: "1",
        reps: "10 min",
        tempoCue: "Relaxed deep stretches",
        effortCue: "Target lower body tightness.",
        required: false,
        category: "mobility", trackingType: "duration", progressMode: "target_adherence"
      }
    ]
  };

  const legacyThursday: DayPlan = {
    dayName: "Thursday",
    name: "Day B: Posterior Chain & Overhead Press",
    isTrainingDay: true,
    exercises: [
      {
        id: \`w\${weekNumber}-d4-ex1\`,
        name: "Smith/Heavy DB RDL",
        originalName: "Smith/Heavy DB RDL",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "3" : "4"),
        reps: weekNumber <= 2 ? "6-8" : "6-10",
        tempoCue: "3-0-1-0 tempo",
        effortCue: \`RPE 8-9. Load the hamstrings and keep back completely flat.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex2\`,
        name: "DB Shoulder Press",
        originalName: "DB Shoulder Press",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "3" : "4"),
        reps: weekNumber <= 2 ? "6-10" : "6-10",
        tempoCue: "2-0-1-0 tempo",
        effortCue: \`RPE 8-9. Control weight down to ear-level.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex3\`,
        name: "Lat Pulldown",
        originalName: "Lat Pulldown",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "3" : "4"),
        reps: "8-12",
        tempoCue: "2-0-1-1 tempo (hold squeeze)",
        effortCue: \`RPE 8. Pull with elbows, chest up tall.\${deloadCueLegacy}\`,
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d4-ex4\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex4\`,
        name: "DB Split Squat",
        originalName: "DB Split Squat",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "2" : "3"),
        reps: "8-10 / leg",
        tempoCue: "2-1-1-0 tempo",
        effortCue: \`RPE 8. Maintain upright posture, drive through front heel.\${deloadCueLegacy}\`,
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d4-ex3\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex5\`,
        name: "Face Pull",
        originalName: "Face Pull",
        sets: adjustSetsLegacy("2"),
        reps: "12-15",
        tempoCue: "1-0-1-2 tempo",
        effortCue: \`RPE 8-9. Pull rope towards ears, squeeze rear delts.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex6\`,
        name: "Cable Crunch",
        originalName: "Cable Crunch",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "2" : "3"),
        reps: "10-15",
        tempoCue: "2-0-1-1 tempo",
        effortCue: \`RPE 8. Contract abs to pull head towards knees, don't use arms.\${deloadCueLegacy}\`,
        required: true,
        category: "core", trackingType: "load_reps", progressMode: "weekly_best"
      }
    ],
    bikeFinisher: isDeload ? undefined : "8 minutes total on the stationary bike or elliptical: 1 min easy, then 6 rounds of 20 sec hard / 40 sec easy, followed by 1 min easy. Keep hard intervals controlled at RPE 8/10, not all-out.",
    finisherSupportingLabel: weekNumber <= 2 && !isDeload ? "Skip during Weeks 1–2 or whenever recovery, energy, or time is limited." : undefined
  };

  const legacyFriday: DayPlan = {
    dayName: "Friday",
    name: "Active Recovery (Steps & Lifestyle)",
    isTrainingDay: false,
    exercises: [
      {
        id: \`w\${weekNumber}-d5-ex1\`,
        name: "Steps Focus Only",
        originalName: "Steps Focus Only",
        sets: "1",
        reps: "8,000-10,000 steps", minimumSteps: 8000, required: true,
        tempoCue: "Active brisk walk",
        effortCue: "Promotes cardiovascular health and blood flow for muscle recovery.",
        category: "cardio", trackingType: "steps", progressMode: "target_adherence"
      }
    ]
  };

  const legacySaturday: DayPlan = {
    dayName: "Saturday",
    name: "Day C: Unilateral Legs & Incline Push",
    isTrainingDay: true,
    exercises: [
      {
        id: \`w\${weekNumber}-d6-ex1\`,
        name: "Bulgarian Split Squat",
        originalName: "Bulgarian Split Squat",
        sets: adjustSetsLegacy("3"),
        reps: "8 / leg",
        tempoCue: "3-0-1-0 tempo",
        effortCue: \`RPE 9. Elevate back leg. Keep torso slightly leaning forward.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex2\`,
        name: "Incline DB Bench Press",
        originalName: "Incline DB Bench Press",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "3" : "4"),
        reps: weekNumber <= 2 ? "8-12" : "8-12",
        tempoCue: "2-1-1-0 tempo",
        effortCue: \`RPE 8-9. Bench at 30-45 degree angle. Squeeze chest.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex3\`,
        name: "1-Arm Cable Row",
        originalName: "1-Arm Cable Row",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "3" : "4"),
        reps: "10-12",
        tempoCue: "2-1-1-1 tempo",
        effortCue: \`RPE 8. Reach at the start of each rep for deep lat stretch.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex4\`,
        name: "Hip Thrust",
        originalName: "Hip Thrust",
        sets: adjustSetsLegacy(weekNumber <= 2 ? "2" : "3"),
        reps: "8-12",
        tempoCue: "2-0-1-2 tempo (2s pause at top)",
        effortCue: \`RPE 9. Keep chin tucked and drive through heels to lock out.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex5\`,
        name: "Cable Bicep Curl",
        originalName: "Cable Bicep Curl",
        sets: adjustSetsLegacy("2"),
        reps: "10-12",
        tempoCue: "2-0-1-0 tempo",
        effortCue: \`RPE 9. Keep elbows locked to your sides.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex6\`,
        name: "Rope Tricep Pressdown",
        originalName: "Rope Tricep Pressdown",
        sets: adjustSetsLegacy("2"),
        reps: "10-12",
        tempoCue: "2-0-1-1 tempo",
        effortCue: \`RPE 9. Flout ropes at the bottom of the movement.\${deloadCueLegacy}\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      }
    ]
  };

  const legacySunday: DayPlan = {
    dayName: "Sunday",
    name: "Rest Day (Light Walking & Prep)",
    isTrainingDay: false,
    exercises: [
      {
        id: \`w\${weekNumber}-d7-ex1\`,
        name: "Rest / Light Walk",
        originalName: "Rest / Light Walk",
        sets: "1",
        reps: "Optional 20-30 min walk",
        tempoCue: "Relaxed",
        effortCue: "Mental recharge and physical prep for the upcoming week.",
        required: true,
        category: "cardio", trackingType: "duration", progressMode: "target_adherence"
      }
    ]
  };

  // ---------------------------------------------------------
  // REVISED DAYS
  // ---------------------------------------------------------
  
  const revisedMonday: DayPlan = {
    dayName: "Monday",
    name: "Zone 2 Indoor Trainer",
    isTrainingDay: false,
    exercises: [
      {
        id: \`w\${weekNumber}-d1-ex1\`,
        name: "Bike Zone 2",
        originalName: "Bike Zone 2",
        sets: "1",
        reps: isDeload ? "20-25 min" : "25-35 min",
        tempoCue: "Pace: sustainable and conversational",
        effortCue: "RPE 4-5. No sprints, climbs, or interval blocks.",
        required: true,
        category: "cardio", trackingType: "duration", progressMode: "target_adherence"
      }
    ]
  };

  const revisedTuesday: DayPlan = {
    dayName: "Tuesday",
    name: "Lift Day A: Squat + Chest + Back + Hamstrings",
    isTrainingDay: true,
    exercises: [
      {
        id: \`w\${weekNumber}-d2-ex1\`,
        name: "Smith Squat",
        originalName: "Smith Squat",
        sets: isDeload ? "2" : "4",
        reps: isDeload ? "6-8" : "6-10",
        tempoCue: "Controlled",
        effortCue: "Brace, use a controlled depth, and keep the full foot planted.",
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex2\`,
        name: "Flat DB Bench Press",
        originalName: "Flat DB Bench Press",
        sets: isDeload ? "2" : "4",
        reps: isDeload ? "6-8" : "6-10",
        tempoCue: "Controlled",
        effortCue: "Keep shoulders packed; controlled touch and smooth lockout.",
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex3\`,
        name: "Cable or Chest-Supported Row",
        originalName: "Cable or Chest-Supported Row",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "8-10" : "8-12",
        tempoCue: "Controlled",
        effortCue: "Pull elbows toward the hips and pause briefly at the squeeze.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d2-ex4\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex4\`,
        name: "Stability-Ball Hamstring Curl",
        originalName: "Stability-Ball Hamstring Curl",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "10" : "10-15",
        tempoCue: "Controlled",
        effortCue: "Keep hips elevated; extend slowly without losing position.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d2-ex3\`,
        required: true,
        category: "strength", trackingType: "reps_only", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex5\`,
        name: "DB Lateral Raise",
        originalName: "DB Lateral Raise",
        sets: isDeload ? "1" : "2",
        reps: isDeload ? "12-15" : "12-20",
        tempoCue: "Controlled",
        effortCue: "Slight forward lean; stop before the traps dominate.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d2-ex6\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex6\`,
        name: "Cable Curl",
        originalName: "Cable Curl",
        sets: isDeload ? "1" : "2",
        reps: isDeload ? "10-12" : "10-15",
        tempoCue: "Controlled",
        effortCue: "Keep elbows pinned and use a full controlled range.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d2-ex5\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d2-ex7\`,
        name: "Plank",
        originalName: "Plank",
        sets: isDeload ? "1" : "2",
        reps: isDeload ? "30 sec" : "30-60 sec",
        tempoCue: "Static hold",
        effortCue: "Ribs down, glutes tight, and breathe behind the brace.",
        required: true,
        category: "core", trackingType: "duration", progressMode: "weekly_best"
      }
    ]
  };

  const revisedWednesday: DayPlan = {
    dayName: "Wednesday",
    name: "Active-Recovery Zwift Ride",
    isTrainingDay: false,
    exercises: [
      {
        id: \`w\${weekNumber}-d3-ex1\`,
        name: "Zwift Ride",
        originalName: "Zwift Ride",
        sets: "1",
        reps: isDeload ? "20-25 min" : "30 min",
        tempoCue: "Cadence 80-95 rpm",
        effortCue: "RPE 2-3. 5m progressive warm-up, 20m @ 52% FTP, 5m cooldown.",
        required: true,
        category: "cardio", trackingType: "duration", progressMode: "target_adherence"
      }
    ]
  };

  const revisedThursday: DayPlan = {
    dayName: "Thursday",
    name: "Lift Day B: Hinge + Shoulders + Vertical Pull + Chest",
    isTrainingDay: true,
    exercises: [
      {
        id: \`w\${weekNumber}-d4-ex1\`,
        name: "Smith Romanian Deadlift",
        originalName: "Smith Romanian Deadlift",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "6" : "6-10",
        tempoCue: "Controlled",
        effortCue: "Push hips back; maintain a neutral spine and controlled stretch.",
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex2\`,
        name: "DB Shoulder Press",
        originalName: "DB Shoulder Press",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "6-8" : "6-10",
        tempoCue: "Controlled",
        effortCue: "Keep ribs down and avoid leaning through the lower back.",
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex3\`,
        name: "Lat Pulldown",
        originalName: "Lat Pulldown",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "8-10" : "8-12",
        tempoCue: "Controlled",
        effortCue: "Drive elbows down; use a full stretch without swinging.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d4-ex4\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex4\`,
        name: "Standing Cable Fly",
        originalName: "Standing Cable Fly",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "10-12" : "10-15",
        tempoCue: "Controlled",
        effortCue: "Mid-chest pulley height; sweep arms across without turning it into a press.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d4-ex3\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex5\`,
        name: "Smith Standing Calf Raise",
        originalName: "Smith Standing Calf Raise",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "10" : "8-15",
        tempoCue: "Controlled",
        effortCue: "Pause in the stretch and at the top; use a secure platform.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d4-ex6\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex6\`,
        name: "Rope Pressdown",
        originalName: "Rope Pressdown",
        sets: isDeload ? "1" : "2",
        reps: isDeload ? "10-12" : "10-15",
        tempoCue: "Controlled",
        effortCue: "Keep elbows fixed and separate the rope at the bottom.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d4-ex5\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d4-ex7\`,
        name: "Cable Crunch",
        originalName: "Cable Crunch",
        sets: isDeload ? "1" : "2",
        reps: isDeload ? "10" : "10-15",
        tempoCue: "Controlled",
        effortCue: "Curl ribs toward the pelvis; avoid hinging at the hips.",
        required: true,
        category: "core", trackingType: "load_reps", progressMode: "weekly_best"
      }
    ]
  };

  const revisedFriday: DayPlan = {
    dayName: "Friday",
    name: "Rest or Optional Mobility",
    isTrainingDay: false,
    exercises: [
      {
        id: \`w\${weekNumber}-d5-ex1\`,
        name: "Optional Full-Body Mobility",
        originalName: "Optional Full-Body Mobility",
        sets: "1",
        reps: "0-10 min",
        tempoCue: "Slow and controlled",
        effortCue: "Hip-flexor, hamstring, thoracic rotation, band pull-aparts.",
        required: false,
        category: "mobility", trackingType: "duration", progressMode: "target_adherence"
      }
    ]
  };

  const revisedSaturday: DayPlan = {
    dayName: "Saturday",
    name: "Lift Day C: Unilateral Legs + Upper Chest + Back + Arms",
    isTrainingDay: true,
    exercises: [
      {
        id: \`w\${weekNumber}-d6-ex1\`,
        name: "Bulgarian Split Squat",
        originalName: "Bulgarian Split Squat",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "6 / leg" : "8-10 / leg",
        tempoCue: "Controlled",
        effortCue: "Stay controlled; knee tracks over toes and front foot remains planted.",
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex2\`,
        name: "Incline DB Bench Press",
        originalName: "Incline DB Bench Press",
        sets: isDeload ? "2" : "4",
        reps: isDeload ? "8" : "8-12",
        tempoCue: "Controlled",
        effortCue: "Upper-chest focus; control the bottom and avoid excessive elbow flare.",
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex3\`,
        name: "One-Arm Cable or Machine Row",
        originalName: "One-Arm Cable or Machine Row",
        sets: isDeload ? "2" : "3",
        reps: isDeload ? "8-10" : "8-12",
        tempoCue: "Controlled",
        effortCue: "Reach for a controlled stretch, then drive the elbow toward the hip.",
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex4\`,
        name: "Cable or DB Lateral Raise",
        originalName: "Cable or DB Lateral Raise",
        sets: isDeload ? "1" : "3",
        reps: isDeload ? "12-15" : "12-20",
        tempoCue: "Controlled",
        effortCue: "Lead with the elbows and stop before the traps take over.",
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex5\`,
        name: "Cable Curl",
        originalName: "Cable Curl",
        sets: isDeload ? "1" : "3",
        reps: isDeload ? "10-12" : "10-15",
        tempoCue: "Controlled",
        effortCue: "Keep elbows pinned; squeeze without swinging.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d6-ex6\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      },
      {
        id: \`w\${weekNumber}-d6-ex6\`,
        name: "Rope Pressdown",
        originalName: "Rope Pressdown",
        sets: isDeload ? "1" : "3",
        reps: isDeload ? "10-12" : "10-15",
        tempoCue: "Controlled",
        effortCue: "Keep shoulders quiet and fully extend without losing elbow position.",
        isSuperset: true,
        supersetWith: \`w\${weekNumber}-d6-ex5\`,
        required: true,
        category: "strength", trackingType: "load_reps", progressMode: "weekly_best"
      }
    ]
  };

  const revisedSunday: DayPlan = {
    dayName: "Sunday",
    name: "Full Rest",
    isTrainingDay: false,
    exercises: []
  };

  const legacyDays = [
    legacyMonday,
    legacyTuesday,
    legacyWednesday,
    legacyThursday,
    legacyFriday,
    legacySaturday,
    legacySunday
  ];

  const revisedDays = [
    revisedMonday,
    revisedTuesday,
    revisedWednesday,
    revisedThursday,
    revisedFriday,
    revisedSaturday,
    revisedSunday
  ];

  const finalDays = legacyDays.map((legacy, dayIndex) => {
    const isRevised = weekNumber > 2 || (weekNumber === 2 && dayIndex >= 3);
    return isRevised ? revisedDays[dayIndex] : legacy;
  });

  return {
    weekNumber,
    isDeload,
    nutrition: {
      training: MACROS_TRAINING,
      nonTraining: MACROS_NON_TRAINING,
      tips: [
        "Fasted morning lifters must consume a 35-50g protein shake 30-60 mins post-workout.",
        "Ensure high hydration: 3-4 liters of water minimum.",
        isDeload
          ? "Deload Week: Prioritize recovery. 10-20% less weight, ~4 RIR."
          : "Double Progression: Add clean reps first. Increase load only after all sets reach top of range."
      ]
    },
    days: finalDays
  };
}

export const SEEDED_PLANS: WeekPlan[] = Array.from({ length: 12 }, (_, i) => getPlanForWeek(i + 1));
`;

fs.writeFileSync('src/utils/planData.ts', code);
