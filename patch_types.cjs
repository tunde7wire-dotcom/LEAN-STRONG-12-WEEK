const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf8');

code = code.replace(
  '  required?: boolean;\n}',
  '  required?: boolean;\n  minimumDuration?: number;\n  canonicalId?: string;\n  format?: string;\n  rest?: string;\n}'
);

code = code.replace(
  '  finisherSupportingLabel?: string;\n}',
  '  finisherSupportingLabel?: string;\n  timeBox?: string;\n  warmUp?: string[];\n  sessionGuidance?: string[];\n  supersetInstructions?: string[];\n}'
);

code = code.replace(
  '  days: DayPlan[];\n}',
  '  days: DayPlan[];\n  progressionFocus?: string[];\n}'
);

fs.writeFileSync('src/types.ts', code);
