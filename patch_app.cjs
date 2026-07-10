const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetMigration = `  // Targeted migration for Week 2 Wednesday (W2-D2)
  useEffect(() => {
    let changed = false;
    const newSettings = { ...settings };
    
    // Check W2-D2
    const w2d2Logs = historicalLogs["W2-D2"];
    const w2d2RideDuration = w2d2Logs?.["w2-d3-ex1"]?.duration || 0;
    
    if (settings.completedDays["W2-D2"] && w2d2RideDuration < 20) {
      newSettings.completedDays = { ...newSettings.completedDays };
      delete newSettings.completedDays["W2-D2"];
      changed = true;
    }
    
    if (changed) {
      setSettings(newSettings);
      saveAppSettings(newSettings);
    }
  }, []);

  // Calculate and sync current plan position based on Start Date`;

code = code.replace(
  '  // Calculate and sync current plan position based on Start Date',
  targetMigration
);

fs.writeFileSync('src/App.tsx', code);
