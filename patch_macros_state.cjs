const fs = require('fs');
let code = fs.readFileSync('src/components/TodayTab.tsx', 'utf8');

const anchor = `  const [note, setNote] = useState(() => loadFromLocalStorage<string>(noteKey, ""));`;

const newCode = `  const todayStr = getLocalTodayString();
  const macrosKey = \`lean_strong_macros_complete_\${todayStr}\`;
  const [macrosComplete, setMacrosComplete] = useState(() => loadFromLocalStorage<boolean>(macrosKey, false));

  const toggleMacrosComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newVal = !macrosComplete;
    setMacrosComplete(newVal);
    saveToLocalStorage(macrosKey, newVal);
  };

  const [note, setNote] = useState(() => loadFromLocalStorage<string>(noteKey, ""));`;

code = code.replace(anchor, newCode);
fs.writeFileSync('src/components/TodayTab.tsx', code);
