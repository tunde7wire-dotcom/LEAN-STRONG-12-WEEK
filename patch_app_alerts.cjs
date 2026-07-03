const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `      if (unmetStepTarget) {
        alert("Session saved. Step target not yet met.");
      } else {
        alert("Session saved. Some required activities are incomplete.");
      }`;

const replaceStr = `      if (unmetDurationTarget) {
        alert("Session saved. Complete at least 25 minutes of Bike Zone 2 to finish this session.");
      } else if (unmetStepTarget) {
        alert("Session saved. Step target not yet met.");
      } else {
        alert("Session saved. Some required activities are incomplete.");
      }`;

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
