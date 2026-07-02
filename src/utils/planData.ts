/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WeekPlan, DayPlan, Exercise } from "../types";

export const MACROS_TRAINING = {
  calories: 2450,
  protein: 200,
  fat: "70-85g",
  carbs: "200-260g",
};

export const MACROS_NON_TRAINING = {
  calories: 2400,
  protein: 200,
  fat: "75-90g",
  carbs: "160-220g",
};

export function getPlanForWeek(weekNumber: number): WeekPlan {
  const isDeload = weekNumber === 7;

  // Helper to adjust sets for Deload (50% working sets, minimum of 1 set)
  const adjustSets = (originalSetsStr: string): string => {
    if (!isDeload) return originalSetsStr;
    const match = originalSetsStr.match(/(\d+)-?(\d+)?/);
    if (!match) return "1";
    const num = parseInt(match[2] || match[1], 10);
    const deloadSets = Math.max(1, Math.round(num * 0.5));
    return deloadSets.toString();
  };

  const deloadCue = isDeload ? " [DELOAD: Reduce weight by 10-20%]" : "";

  // Days mapping
  const days: DayPlan[] = [
    {
      dayName: "Monday",
      name: "Zone 2 Cardio & Mobility",
      isTrainingDay: false,
      exercises: [
        {
          id: `w${weekNumber}-d1-ex1`,
          name: "Bike Zone 2",
          originalName: "Bike Zone 2",
          sets: "1",
          reps: "25-35 min",
          tempoCue: "Continuous low-intensity steady state (LISS)",
          effortCue: `RPE 4-5. Talk-test pace.${deloadCue}`,
          category: "cardio"
        },
        {
          id: `w${weekNumber}-d1-ex2`,
          name: "Optional Full-Body Mobility",
          originalName: "Optional Full-Body Mobility",
          sets: "1",
          reps: "5-10 min",
          tempoCue: "Slow and controlled",
          effortCue: "Focus on hip flexors, thoracic spine, and hamstrings.",
          category: "mobility"
        }
      ]
    },
    {
      dayName: "Tuesday",
      name: "Day A: Squat & Horizontal Push/Pull",
      isTrainingDay: true,
      exercises: [
        {
          id: `w${weekNumber}-d2-ex1`,
          name: weekNumber <= 2 ? "Smith or Goblet Squat" : "Smith Squat (Heavy)",
          originalName: "Smith or Goblet Squat",
          sets: adjustSets(weekNumber <= 2 ? "3" : "4"),
          reps: weekNumber <= 2 ? "6-8" : "6-10",
          tempoCue: "3-0-1-0 tempo (3s negative, 1s up)",
          effortCue: `RPE 8-9. Control the descent.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d2-ex2`,
          name: "DB Bench Press",
          originalName: "DB Bench Press",
          sets: adjustSets(weekNumber <= 2 ? "3" : "4"),
          reps: weekNumber <= 2 ? "6-10" : "6-10",
          tempoCue: "2-0-1-0 tempo",
          effortCue: `RPE 8-9. Push from heels, keep shoulder blades packed.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d2-ex3`,
          name: "Cable Row",
          originalName: "Cable Row",
          sets: adjustSets(weekNumber <= 2 ? "3" : "4"),
          reps: "8-12",
          tempoCue: "2-1-1-1 tempo (hold squeeze for 1s)",
          effortCue: `RPE 8. Squeeze shoulder blades together.${deloadCue}`,
          isSuperset: true,
          supersetWith: `w${weekNumber}-d2-ex4`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d2-ex4`,
          name: "DB RDL",
          originalName: "DB RDL",
          sets: adjustSets(weekNumber <= 2 ? "2" : "3"),
          reps: "8-10",
          tempoCue: "3-0-1-0 tempo",
          effortCue: `RPE 8. Push hips back, feel deep stretch in hamstrings.${deloadCue}`,
          isSuperset: true,
          supersetWith: `w${weekNumber}-d2-ex3`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d2-ex5`,
          name: "DB Lateral Raise",
          originalName: "DB Lateral Raise",
          sets: adjustSets("2"),
          reps: "12-20",
          tempoCue: "1-0-1-1 tempo",
          effortCue: `RPE 9. Keep pinkies slightly up, lead with elbows.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d2-ex6`,
          name: "Plank",
          originalName: "Plank",
          sets: adjustSets("2"),
          reps: "30-60s",
          tempoCue: "Maximum contraction",
          effortCue: `Focus on rigid brace and glute squeeze.${deloadCue}`,
          category: "core"
        }
      ]
    },
    {
      dayName: "Wednesday",
      name: "Active Recovery (Steps & Mobility)",
      isTrainingDay: false,
      exercises: [
        {
          id: `w${weekNumber}-d3-ex1`,
          name: "Steps Focus Only",
          originalName: "Steps Focus Only",
          sets: "1",
          reps: "8,000-10,000 steps",
          tempoCue: "Normal walking speed",
          effortCue: "Outdoor active walk. Low stress recovery.",
          category: "cardio"
        },
        {
          id: `w${weekNumber}-d3-ex2`,
          name: "Optional Hip & Ankle Mobility",
          originalName: "Optional Hip & Ankle Mobility",
          sets: "1",
          reps: "10 min",
          tempoCue: "Relaxed deep stretches",
          effortCue: "Target lower body tightness.",
          category: "mobility"
        }
      ]
    },
    {
      dayName: "Thursday",
      name: "Day B: Posterior Chain & Overhead Press",
      isTrainingDay: true,
      exercises: [
        {
          id: `w${weekNumber}-d4-ex1`,
          name: "Smith/Heavy DB RDL",
          originalName: "Smith/Heavy DB RDL",
          sets: adjustSets(weekNumber <= 2 ? "3" : "4"),
          reps: weekNumber <= 2 ? "6-8" : "6-10",
          tempoCue: "3-0-1-0 tempo",
          effortCue: `RPE 8-9. Load the hamstrings and keep back completely flat.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d4-ex2`,
          name: "DB Shoulder Press",
          originalName: "DB Shoulder Press",
          sets: adjustSets(weekNumber <= 2 ? "3" : "4"),
          reps: weekNumber <= 2 ? "6-10" : "6-10",
          tempoCue: "2-0-1-0 tempo",
          effortCue: `RPE 8-9. Control weight down to ear-level.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d4-ex3`,
          name: "Lat Pulldown",
          originalName: "Lat Pulldown",
          sets: adjustSets(weekNumber <= 2 ? "3" : "4"),
          reps: "8-12",
          tempoCue: "2-0-1-1 tempo (hold squeeze)",
          effortCue: `RPE 8. Pull with elbows, chest up tall.${deloadCue}`,
          isSuperset: true,
          supersetWith: `w${weekNumber}-d4-ex4`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d4-ex4`,
          name: "DB Split Squat",
          originalName: "DB Split Squat",
          sets: adjustSets(weekNumber <= 2 ? "2" : "3"),
          reps: "8-10 / leg",
          tempoCue: "2-1-1-0 tempo",
          effortCue: `RPE 8. Maintain upright posture, drive through front heel.${deloadCue}`,
          isSuperset: true,
          supersetWith: `w${weekNumber}-d4-ex3`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d4-ex5`,
          name: "Face Pull",
          originalName: "Face Pull",
          sets: adjustSets("2"),
          reps: "12-15",
          tempoCue: "1-0-1-2 tempo",
          effortCue: `RPE 8-9. Pull rope towards ears, squeeze rear delts.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d4-ex6`,
          name: "Cable Crunch",
          originalName: "Cable Crunch",
          sets: adjustSets(weekNumber <= 2 ? "2" : "3"),
          reps: "10-15",
          tempoCue: "2-0-1-1 tempo",
          effortCue: `RPE 8. Contract abs to pull head towards knees, don't use arms.${deloadCue}`,
          category: "core"
        }
      ],
      bikeFinisher: isDeload ? undefined : "8 minutes total on the stationary bike or elliptical: 1 min easy, then 6 rounds of 20 sec hard / 40 sec easy, followed by 1 min easy. Keep hard intervals controlled at RPE 8/10, not all-out.",
      finisherSupportingLabel: weekNumber <= 2 && !isDeload ? "Skip during Weeks 1–2 or whenever recovery, energy, or time is limited." : undefined
    },
    {
      dayName: "Friday",
      name: "Active Recovery (Steps & Lifestyle)",
      isTrainingDay: false,
      exercises: [
        {
          id: `w${weekNumber}-d5-ex1`,
          name: "Steps Focus Only",
          originalName: "Steps Focus Only",
          sets: "1",
          reps: "8,000-10,000 steps",
          tempoCue: "Active brisk walk",
          effortCue: "Promotes cardiovascular health and blood flow for muscle recovery.",
          category: "cardio"
        }
      ]
    },
    {
      dayName: "Saturday",
      name: "Day C: Unilateral Legs & Incline Push",
      isTrainingDay: true,
      exercises: [
        {
          id: `w${weekNumber}-d6-ex1`,
          name: "Bulgarian Split Squat",
          originalName: "Bulgarian Split Squat",
          sets: adjustSets("3"),
          reps: "8 / leg",
          tempoCue: "3-0-1-0 tempo",
          effortCue: `RPE 9. Elevate back leg. Keep torso slightly leaning forward.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d6-ex2`,
          name: "Incline DB Bench Press",
          originalName: "Incline DB Bench Press",
          sets: adjustSets(weekNumber <= 2 ? "3" : "4"),
          reps: weekNumber <= 2 ? "8-12" : "8-12",
          tempoCue: "2-1-1-0 tempo",
          effortCue: `RPE 8-9. Bench at 30-45 degree angle. Squeeze chest.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d6-ex3`,
          name: "1-Arm Cable Row",
          originalName: "1-Arm Cable Row",
          sets: adjustSets(weekNumber <= 2 ? "3" : "4"),
          reps: "10-12",
          tempoCue: "2-1-1-1 tempo",
          effortCue: `RPE 8. Reach at the start of each rep for deep lat stretch.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d6-ex4`,
          name: "Hip Thrust",
          originalName: "Hip Thrust",
          sets: adjustSets(weekNumber <= 2 ? "2" : "3"),
          reps: "8-12",
          tempoCue: "2-0-1-2 tempo (2s pause at top)",
          effortCue: `RPE 9. Keep chin tucked and drive through heels to lock out.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d6-ex5`,
          name: "Cable Bicep Curl",
          originalName: "Cable Bicep Curl",
          sets: adjustSets("2"),
          reps: "10-12",
          tempoCue: "2-0-1-0 tempo",
          effortCue: `RPE 9. Keep elbows locked to your sides.${deloadCue}`,
          category: "strength"
        },
        {
          id: `w${weekNumber}-d6-ex6`,
          name: "Rope Tricep Pressdown",
          originalName: "Rope Tricep Pressdown",
          sets: adjustSets("2"),
          reps: "10-12",
          tempoCue: "2-0-1-1 tempo",
          effortCue: `RPE 9. Flout ropes at the bottom of the movement.${deloadCue}`,
          category: "strength"
        }
      ]
    },
    {
      dayName: "Sunday",
      name: "Rest Day (Light Walking & Prep)",
      isTrainingDay: false,
      exercises: [
        {
          id: `w${weekNumber}-d7-ex1`,
          name: "Rest / Light Walk",
          originalName: "Rest / Light Walk",
          sets: "1",
          reps: "Optional 20-30 min walk",
          tempoCue: "Relaxed",
          effortCue: "Mental recharge and physical prep for the upcoming week.",
          category: "cardio"
        }
      ]
    }
  ];

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
          ? "Deload Week: Prioritize recovery and Joint healing. Do not push to failure."
          : "Double Progression: Stay at same weight until hitting top of rep range cleanly, then increase."
      ]
    },
    days
  };
}

// Generate all 12 weeks of plans
export const SEEDED_PLANS: WeekPlan[] = Array.from({ length: 12 }, (_, i) => getPlanForWeek(i + 1));
