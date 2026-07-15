const fs = require('fs');
let code = fs.readFileSync('src/components/WeeklyTab.tsx', 'utf8');

code = code.replace(
  '  onExportWeek?: () => void;',
  '  onExportWeek?: (format: "csv" | "json") => void;'
);

const newButtons = `
      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => onExportWeek?.("csv")}
          className="flex flex-col items-start p-4 apple-card hover:border-white/20 text-left transition-colors"
        >
          <FileText className="w-5 h-5 text-white mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Export CSV</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono uppercase">Spreadsheet Format</span>
        </button>
        <button
          onClick={() => onExportWeek?.("json")}
          className="flex flex-col items-start p-4 apple-card hover:border-white/20 text-left transition-colors"
        >
          <FileText className="w-5 h-5 text-white mb-2" />
          <span className="text-xs font-bold uppercase tracking-wider text-white">Export JSON</span>
          <span className="text-[10px] text-zinc-400 mt-1 font-mono uppercase">Data Format</span>
        </button>
      </div>
      {/* 7-Day Workout Agenda List */}
`;

code = code.replace(
  /      <div className="mb-6">\n        <button[\s\S]*?<\/button>\n      <\/div>\n      \{\/\* 7-Day Workout Agenda List \*\/\}/,
  newButtons
);

fs.writeFileSync('src/components/WeeklyTab.tsx', code);
