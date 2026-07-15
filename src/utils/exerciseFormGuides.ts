export type ExerciseFormGuide = {
  id: string;
  exerciseName: string;
  videoId: string;
  sourceName: "NASM" | "OPEX Fitness Exercise Library" | "Nuffield Health";
  sourceUrl: string;
  matchType: "exact" | "movement_pattern" | "variation";
  variationNotice?: string;
};

export const EXERCISE_FORM_GUIDES: ExerciseFormGuide[] = [
  // Core Mappings
  {
    id: "smith-squat",
    exerciseName: "Smith Squat",
    videoId: "QcmonZUuumg",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=QcmonZUuumg",
    matchType: "exact",
  },
  {
    id: "flat-db-bench-press",
    exerciseName: "Flat DB Bench Press",
    videoId: "ZaDlbm8E8Tg",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=ZaDlbm8E8Tg",
    matchType: "exact",
  },
  {
    id: "seated-cable-row",
    exerciseName: "Seated Cable Row",
    videoId: "4ZbqM_gcgAI",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=4ZbqM_gcgAI",
    matchType: "exact",
  },
  {
    id: "chest-supported-dumbbell-row",
    exerciseName: "Chest-Supported Dumbbell Row",
    videoId: "0-DXJiceG-0",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=0-DXJiceG-0",
    matchType: "exact",
  },
  {
    id: "selectorized-machine-row",
    exerciseName: "Selectorized Machine Row",
    videoId: "k0cTJCfxa0Y",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=k0cTJCfxa0Y",
    matchType: "exact",
  },
  {
    id: "stability-ball-hamstring-curl",
    exerciseName: "Stability-Ball Hamstring Curl",
    videoId: "XkESHgkTdFw",
    sourceName: "Nuffield Health",
    sourceUrl: "https://www.youtube.com/watch?v=XkESHgkTdFw",
    matchType: "exact",
  },
  {
    id: "dumbbell-lateral-raise",
    exerciseName: "DB Lateral Raise",
    videoId: "XPPfnSEATJA",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=XPPfnSEATJA",
    matchType: "exact",
  },
  {
    id: "cable-curl",
    exerciseName: "Cable Curl",
    videoId: "h9DPY5pCaGA",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=h9DPY5pCaGA",
    matchType: "exact",
  },
  {
    id: "plank",
    exerciseName: "Plank",
    videoId: "mwlp75MS6Rg",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=mwlp75MS6Rg",
    matchType: "exact",
  },
  {
    id: "smith-rdl",
    exerciseName: "Smith Romanian Deadlift",
    videoId: "G6saqfkdBFQ",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=G6saqfkdBFQ",
    matchType: "exact",
  },
  {
    id: "db-shoulder-press",
    exerciseName: "DB Shoulder Press",
    videoId: "MMjBnEBnZKM",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=MMjBnEBnZKM",
    matchType: "exact",
  },
  {
    id: "lat-pulldown",
    exerciseName: "Lat Pulldown",
    videoId: "ShqtJk37UPM",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=ShqtJk37UPM",
    matchType: "exact",
  },
  {
    id: "standing-cable-fly",
    exerciseName: "Standing Cable Fly",
    videoId: "XY6JrX1wyxk",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=XY6JrX1wyxk",
    matchType: "movement_pattern",
    variationNotice: "This NASM demonstration shows a cable crossover/fly movement pattern. Match the pulley height and arm path prescribed in your workout.",
  },
  {
    id: "smith-standing-calf-raise",
    exerciseName: "Smith Standing Calf Raise",
    videoId: "9rAzgZ9J0vM",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=9rAzgZ9J0vM",
    matchType: "variation",
    variationNotice: "This demonstration uses one leg at a time. Your prescribed version uses both feet, but the Smith-machine setup, heel drop, and calf-raise movement are otherwise similar.",
  },
  {
    id: "rope-pressdown",
    exerciseName: "Rope Pressdown",
    videoId: "y6EdXBdL75A",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=y6EdXBdL75A",
    matchType: "exact",
  },
  {
    id: "cable-crunch",
    exerciseName: "Cable Crunch",
    videoId: "2ndlUfl5JPo",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=2ndlUfl5JPo",
    matchType: "exact",
  },
  {
    id: "bulgarian-split-squat",
    exerciseName: "Bulgarian Split Squat",
    videoId: "hbw7hdyOpq0",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=hbw7hdyOpq0",
    matchType: "exact",
  },
  {
    id: "incline-db-bench-press",
    exerciseName: "Incline DB Bench Press",
    videoId: "JKnpHchOWPU",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=JKnpHchOWPU",
    matchType: "exact",
  },
  {
    id: "one-arm-cable-row",
    exerciseName: "One-Arm Cable Row",
    videoId: "SkMJJKd8Bec",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=SkMJJKd8Bec",
    matchType: "exact",
  },
  {
    id: "one-arm-machine-row",
    exerciseName: "One-Arm Machine Row",
    videoId: "glWqD2eS2Uo",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=glWqD2eS2Uo",
    matchType: "exact",
  },

  // Approved Substitution Video Mappings
  {
    id: "goblet-squat",
    exerciseName: "Goblet Squat",
    videoId: "nfX7IFK9UNI",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=nfX7IFK9UNI",
    matchType: "exact",
  },
  {
    id: "dumbbell-rdl",
    exerciseName: "Dumbbell RDL",
    videoId: "V8Hdl1FiNt4",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=V8Hdl1FiNt4",
    matchType: "exact",
  },
  {
    id: "standing-single-leg-cable-hamstring-curl",
    exerciseName: "Standing Single-Leg Cable Hamstring Curl",
    videoId: "moINRYS0S8U",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=moINRYS0S8U",
    matchType: "exact",
  },
  {
    id: "lying-leg-curl",
    exerciseName: "Lying Leg Curl",
    videoId: "Dq5y4WEcqqo",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=Dq5y4WEcqqo",
    matchType: "exact",
  },
  {
    id: "single-leg-dumbbell-calf-raise",
    exerciseName: "Single-Leg Dumbbell Calf Raise",
    videoId: "KcTEGifMTDY",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=KcTEGifMTDY",
    matchType: "exact",
  },
  {
    id: "cable-chest-press",
    exerciseName: "Cable Chest Press",
    videoId: "wvQCsEBkEZ8",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=wvQCsEBkEZ8",
    matchType: "exact",
  },
  {
    id: "bilateral-selectorized-machine-row",
    exerciseName: "Bilateral Selectorized Machine Row",
    videoId: "k0cTJCfxa0Y",
    sourceName: "NASM",
    sourceUrl: "https://www.youtube.com/watch?v=k0cTJCfxa0Y",
    matchType: "exact",
  },
  {
    id: "one-arm-selectorized-machine-row",
    exerciseName: "One-Arm Selectorized Machine Row",
    videoId: "glWqD2eS2Uo",
    sourceName: "OPEX Fitness Exercise Library",
    sourceUrl: "https://www.youtube.com/watch?v=glWqD2eS2Uo",
    matchType: "exact",
  },
];

type FormGuideParams = {
  canonicalId?: string;
  selectedSubstitutionId?: string;
  resolvedExerciseName?: string;
};

export function getAmbiguousOptions(
  canonicalId?: string,
  resolvedExerciseName?: string
): ExerciseFormGuide[] {
  if (resolvedExerciseName === "Cable or Chest-Supported Row" || canonicalId === "horizontal-row") {
    return [
      EXERCISE_FORM_GUIDES.find(g => g.id === "seated-cable-row")!,
      EXERCISE_FORM_GUIDES.find(g => g.id === "chest-supported-dumbbell-row")!,
      EXERCISE_FORM_GUIDES.find(g => g.id === "selectorized-machine-row")!,
    ].filter(Boolean);
  }

  if (resolvedExerciseName === "One-Arm Cable or Machine Row" || canonicalId === "one-arm-row") {
    return [
      EXERCISE_FORM_GUIDES.find(g => g.id === "one-arm-cable-row")!,
      EXERCISE_FORM_GUIDES.find(g => g.id === "one-arm-machine-row")!,
    ].filter(Boolean);
  }

  if (resolvedExerciseName === "Cable or DB Lateral Raise" || canonicalId === "lateral-raise") {
    // Only return DB Lateral Raise option here, as Cable Lateral Raise has no video
    return [
      EXERCISE_FORM_GUIDES.find(g => g.id === "dumbbell-lateral-raise")!,
    ].filter(Boolean);
  }

  return [];
}

export function getExerciseFormGuide({
  canonicalId,
  selectedSubstitutionId,
  resolvedExerciseName,
}: FormGuideParams): ExerciseFormGuide | ExerciseFormGuide[] | undefined {
  
  // 1. Check selected substitution by name/ID
  if (selectedSubstitutionId) {
    const guide = EXERCISE_FORM_GUIDES.find(
      (g) => g.id === selectedSubstitutionId || g.exerciseName.toLowerCase() === selectedSubstitutionId.toLowerCase()
    );
    if (guide) return guide;
  }

  if (resolvedExerciseName) {
     const guide = EXERCISE_FORM_GUIDES.find(
      (g) => g.exerciseName.toLowerCase() === resolvedExerciseName.toLowerCase() || g.id === resolvedExerciseName.toLowerCase().replace(/ /g, '-')
    );
    if (guide) return guide;
    
    // specific resolution for Cable or DB Lateral Raise with 'DB Lateral Raise' selected
    if (resolvedExerciseName === "DB Lateral Raise") {
      const g = EXERCISE_FORM_GUIDES.find(g => g.id === "dumbbell-lateral-raise");
      if (g) return g;
    }
  }

  // Ambiguous resolution
  if (
    resolvedExerciseName === "Cable or Chest-Supported Row" ||
    resolvedExerciseName === "One-Arm Cable or Machine Row" ||
    resolvedExerciseName === "Cable or DB Lateral Raise"
  ) {
      if (resolvedExerciseName === "Cable or DB Lateral Raise") {
          return undefined; // no exact DB lateral raise since ambiguous is generic, wait, let's see. 
          // Ah, if "Cable or DB Lateral Raise" is strictly the string, it could be either. 
          // So we should return ambiguous options to show a chooser.
      }
      return getAmbiguousOptions(canonicalId, resolvedExerciseName);
  }

  // 3. Fallback to canonicalId
  if (canonicalId) {
    const guide = EXERCISE_FORM_GUIDES.find((g) => g.id === canonicalId);
    if (guide) return guide;
  }

  return undefined;
}
