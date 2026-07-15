const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const importStr = `import { ChevronLeft, Dumbbell, Timer, ArrowRight, RotateCcw, AlertCircle, ArrowRightLeft, Check, CheckSquare, Save, Play } from "lucide-react";
import ExerciseFormGuideModal from "./ExerciseFormGuideModal";
import { getExerciseFormGuide, ExerciseFormGuide } from "../utils/exerciseFormGuides";`;

code = code.replace(
  'import { ChevronLeft, Dumbbell, Timer, ArrowRight, RotateCcw, AlertCircle, ArrowRightLeft, Check, CheckSquare, Save } from "lucide-react";',
  importStr
);

const stateStr = `  const [swappingExId, setSwappingExId] = useState<string | null>(null);
  const [customSwapName, setCustomSwapName] = useState("");
  const [customSwapTracking, setCustomSwapTracking] = useState<import("../types").TrackingType>("load_reps");
  const [showBikeCompleted, setShowBikeCompleted] = useState(false);

  // Form Guide Modal State
  const [formGuideOpen, setFormGuideOpen] = useState(false);
  const [activeGuideData, setActiveGuideData] = useState<ExerciseFormGuide | ExerciseFormGuide[] | null>(null);
  const [activeGuideExerciseName, setActiveGuideExerciseName] = useState("");
  const [activeGuideTempoCue, setActiveGuideTempoCue] = useState("");
  const [activeGuideEffortCue, setActiveGuideEffortCue] = useState("");

  const handleOpenFormGuide = (ex: Exercise, swapData: any, guideData: ExerciseFormGuide | ExerciseFormGuide[]) => {
    setActiveGuideData(guideData);
    setActiveGuideExerciseName(typeof swapData === 'string' ? swapData : (swapData?.name || ex.name));
    setActiveGuideTempoCue(ex.tempoCue || "");
    setActiveGuideEffortCue(ex.effortCue || "");
    setFormGuideOpen(true);
  };`;

code = code.replace(
  '  const [swappingExId, setSwappingExId] = useState<string | null>(null);\n  const [customSwapName, setCustomSwapName] = useState("");\n  const [customSwapTracking, setCustomSwapTracking] = useState<import("../types").TrackingType>("load_reps");\n  const [showBikeCompleted, setShowBikeCompleted] = useState(false);',
  stateStr
);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
