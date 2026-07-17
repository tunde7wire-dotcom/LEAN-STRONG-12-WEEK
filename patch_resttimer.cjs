const fs = require('fs');
let code = fs.readFileSync('src/components/RestTimer.tsx', 'utf8');

// Update props
code = code.replace(
  'durationSeconds: number;\n  onClose?: () => void;',
  'durationSeconds: number;\n  remainingSeconds: number;\n  onClose?: () => void;'
);

code = code.replace(
  'onTimerPause: () => void;',
  'onTimerPause: (remainingSeconds: number) => void;'
);

code = code.replace(
  'durationSeconds,\n  onClose,',
  'durationSeconds,\n  remainingSeconds,\n  onClose,'
);

// Update useEffect
const effectCode = `
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (endTime !== null) {
      setIsPaused(false);
      const updateTimer = () => {
        const now = Date.now();
        const diff = Math.max(0, Math.ceil((endTime - now) / 1000));
        setTimeLeft(diff);
        if (diff <= 0) {
          if (timerRef.current) clearInterval(timerRef.current);
          playBeep();
          onTimerReset(); // This sets endTime to null
        }
      };
      
      updateTimer();
      timerRef.current = setInterval(updateTimer, 200);
    } else {
      setIsPaused(true);
      setTimeLeft(remainingSeconds);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [endTime, remainingSeconds]);
`;

code = code.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[endTime, durationSeconds\]\);/, effectCode);

// Update handlePause
code = code.replace(
  'const handlePause = () => {\n    onTimerPause();\n  };',
  'const handlePause = () => {\n    onTimerPause(timeLeft);\n  };'
);

// Update texts
code = code.replace(
  '{isPaused ? "REST TIMER READY" : "RESTING"}',
  '{isPaused ? (timeLeft < durationSeconds ? "PAUSED" : "REST TIMER READY") : "RESTING"}'
);

code = code.replace(
  '{isPaused ? "REHYDRATING & RECOVERY" : "FOCUS. NEXT SET IS CALLING."}',
  '{isPaused ? (timeLeft < durationSeconds ? "PAUSED" : "REHYDRATING & RECOVERY") : "FOCUS. NEXT SET IS CALLING."}'
);

code = code.replace(
  '>\n                <Play className="w-3.5 h-3.5 fill-black text-black" />\n                Start\n              </button>',
  '>\n                <Play className="w-3.5 h-3.5 fill-black text-black" />\n                {timeLeft < durationSeconds ? "Resume" : "Start"}\n              </button>'
);

fs.writeFileSync('src/components/RestTimer.tsx', code);
console.log('RestTimer patched');
