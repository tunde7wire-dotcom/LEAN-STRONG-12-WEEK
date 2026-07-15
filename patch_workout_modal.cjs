const fs = require('fs');
let code = fs.readFileSync('src/components/WorkoutTab.tsx', 'utf8');

const modalStr = `      {/* Form Guide Modal */}
      {activeGuideData && (
        <ExerciseFormGuideModal
          isOpen={formGuideOpen}
          onClose={() => setFormGuideOpen(false)}
          guideData={activeGuideData}
          originalExerciseName={activeGuideExerciseName}
          tempoCue={activeGuideTempoCue}
          effortCue={activeGuideEffortCue}
        />
      )}
    </div>
  );
}`;

code = code.replace(
  '    </div>\n  );\n}',
  modalStr
);

fs.writeFileSync('src/components/WorkoutTab.tsx', code);
