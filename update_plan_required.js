const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');

// Replace `progressMode: "..."` with `progressMode: "...", required: true` or `false`
// based on whether the `name:` before it has "Optional".
// Actually, it's easier to find `originalName: "..."` and then replace.

const matches = [...code.matchAll(/originalName:\s*"([^"]+)"/g)];
for (const match of matches) {
  const originalName = match[1];
  const isOptional = originalName.toLowerCase().includes('optional');
  // We'll replace the next `progressMode: "..."` or `progressMode: '...'` or similar, but what if it's already followed by required?
}
