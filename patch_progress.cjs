const fs = require('fs');
let code = fs.readFileSync('src/components/ProgressTab.tsx', 'utf8');

const waistCode = `
  // Waist Progress Data
  const waistHistory = checkins
    .filter(
      (checkin) =>
        typeof checkin.waist === "number" &&
        Number.isFinite(checkin.waist) &&
        checkin.waist > 0
    )
    .sort((a, b) => a.weekNumber - b.weekNumber);

  let latestWaist: number | null = null;
  let baselineWaist: number | null = null;
  let totalWaistChange: number | null = null;
  let changeFromPriorWaist: number | null = null;

  if (waistHistory.length > 0) {
    const latestRecord = waistHistory[waistHistory.length - 1];
    const baselineRecord = waistHistory[0];
    
    latestWaist = latestRecord.waist!;
    baselineWaist = baselineRecord.waist!;
    
    if (waistHistory.length > 1) {
      totalWaistChange = latestWaist - baselineWaist;
      const priorRecord = waistHistory[waistHistory.length - 2];
      changeFromPriorWaist = latestWaist - priorRecord.waist!;
    }
  }

  const formatChangeFull = (change: number, unit: string) => {
    const absChange = Math.abs(change).toFixed(1);
    if (change < 0) return \`Down \${absChange} \${unit}\`;
    if (change > 0) return \`Up \${absChange} \${unit}\`;
    return "No change";
  };
`;

code = code.replace(
  'const unitsStr = settings.units === "imperial" ? "lbs" : "kg";',
  'const unitsStr = settings.units === "imperial" ? "lbs" : "kg";\n' + waistCode
);

const waistCard = `
      {/* Waist Progress */}
      <div className="apple-card p-5 mb-6">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1.5">
          <LineChart className="w-4 h-4 text-white" />
          Waist Progress
        </h3>
        
        {waistHistory.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1">Latest</div>
                <div className="text-base font-black font-mono text-white">{latestWaist?.toFixed(1)} {settings.units === "imperial" ? "in" : "cm"}</div>
                {changeFromPriorWaist !== null && (
                  <div className="text-[9px] font-mono text-zinc-400 mt-1">
                    {formatChangeFull(changeFromPriorWaist, settings.units === "imperial" ? "in" : "cm")} from prior
                  </div>
                )}
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                <div className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-1">Baseline</div>
                <div className="text-base font-black font-mono text-white">{baselineWaist?.toFixed(1)} {settings.units === "imperial" ? "in" : "cm"}</div>
                <div className="text-[9px] font-mono text-zinc-400 mt-1">
                  {totalWaistChange !== null ? \`\${formatChangeFull(totalWaistChange, settings.units === "imperial" ? "in" : "cm")} total\` : "Not enough data"}
                </div>
              </div>
            </div>
            
            {/* SVG Chart */}
            <div className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-2 relative flex items-center justify-center">
              {(() => {
                const minWaist = Math.min(...waistHistory.map((w) => w.waist!));
                const maxWaist = Math.max(...waistHistory.map((w) => w.waist!));
                
                const range = Math.max(maxWaist - minWaist, 1);
                const padding = range * 0.4; 
                const yMin = minWaist - padding;
                const yMax = maxWaist + padding;
                const yRange = yMax - yMin;
                
                const points = waistHistory.map(w => {
                  const x = ((w.weekNumber - 1) / 11) * 100;
                  const y = 100 - (((w.waist! - yMin) / yRange) * 100);
                  return \`\${x},\${y}\`;
                }).join(" ");
                
                return (
                  <div className="w-full h-full pb-3 pt-2">
                    <svg viewBox="-5 -10 110 115" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                      {/* Grid lines for each week (1-12) */}
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(week => {
                        const x = ((week - 1) / 11) * 100;
                        return (
                          <g key={week}>
                            <line x1={x} y1="0" x2={x} y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            {/* X-axis labels (every week for smaller numbers, or maybe 1, 4, 8, 12, or just the ones that fit) */}
                            {week % 2 !== 0 || week === 12 ? (
                              <text x={x} y="110" fill="#71717a" fontSize="5" textAnchor="middle" fontFamily="monospace">
                                {week}
                              </text>
                            ) : null}
                          </g>
                        );
                      })}
                      
                      <polyline 
                        points={points} 
                        fill="none" 
                        stroke="rgba(255,255,255,0.3)" 
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      
                      {waistHistory.map(w => {
                        const x = ((w.weekNumber - 1) / 11) * 100;
                        const y = 100 - (((w.waist! - yMin) / yRange) * 100);
                        const isCurrent = w.weekNumber === selectedWeekNum;
                        return (
                          <g key={w.weekNumber}>
                            <circle cx={x} cy={y} r={isCurrent ? "2.5" : "1.5"} fill={isCurrent ? "#ffffff" : "#a1a1aa"} />
                            <text x={x} y={y - 4} fill={isCurrent ? "#ffffff" : "#a1a1aa"} fontSize="5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                              {w.waist?.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                );
              })()}
            </div>
            
            {/* History List */}
            <div className="space-y-1">
              {waistHistory.map((w, idx) => {
                let changeStr = "";
                let changeColor = "text-zinc-500";
                if (idx > 0) {
                  const diff = w.waist! - waistHistory[idx - 1].waist!;
                  if (diff < 0) {
                    changeStr = \`Down \${Math.abs(diff).toFixed(1)} \${settings.units === "imperial" ? "in" : "cm"}\`;
                    changeColor = "text-emerald-500";
                  } else if (diff > 0) {
                    changeStr = \`Up \${Math.abs(diff).toFixed(1)} \${settings.units === "imperial" ? "in" : "cm"}\`;
                    changeColor = "text-zinc-400";
                  } else {
                    changeStr = "No change";
                  }
                }
                
                return (
                  <div key={w.weekNumber} className={\`flex items-center justify-between text-xs py-2 border-b border-white/10 last:border-0 \${w.weekNumber === selectedWeekNum ? 'bg-white/5 px-2 -mx-2 rounded' : ''}\`}>
                    <div className="flex flex-col gap-1">
                      <span className={\`font-mono font-bold uppercase \${w.weekNumber === selectedWeekNum ? 'text-white' : 'text-zinc-400'}\`}>Week {w.weekNumber}</span>
                      {changeStr && (
                        <span className={\`text-[10px] font-mono tracking-wider \${changeColor}\`}>{changeStr}</span>
                      )}
                    </div>
                    <div className="font-mono font-bold text-white">
                      {w.waist?.toFixed(1)} {settings.units === "imperial" ? "in" : "cm"}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-white/5 border border-white/10 rounded-xl">
            <Info className="w-5 h-5 text-zinc-600 mx-auto mb-1.5" />
            <span className="text-[11px] text-zinc-400 font-mono uppercase tracking-wider block mb-1">No waist measurements logged yet.</span>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wide px-4 block">Add your weekly waist measurement in the check-in below to begin tracking your trend.</span>
          </div>
        )}
      </div>
`;

code = code.replace(
  '{/* Weekly Check-In form */}',
  waistCard + '\n      {/* Weekly Check-In form */}'
);

fs.writeFileSync('src/components/ProgressTab.tsx', code);
console.log('patched ProgressTab');
