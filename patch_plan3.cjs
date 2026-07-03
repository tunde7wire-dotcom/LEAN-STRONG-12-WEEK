const fs = require('fs');
let code = fs.readFileSync('src/utils/planData.ts', 'utf8');

let blocks = code.split(/(?=\{[^{]*originalName:\s*"(?:[^"\\]|\\.)*")/);
for (let i = 1; i < blocks.length; i++) {
  let block = blocks[i];
  let originalNameMatch = block.match(/originalName:\s*"([^"]+)"/);
  if (originalNameMatch) {
    let name = originalNameMatch[1].toLowerCase();
    let isOptional = name.includes('optional');
    let requiredStr = isOptional ? 'false' : 'true';
    
    // Add required: ... before category:
    if (!block.includes('required:')) {
      block = block.replace(/category:\s*"/, `required: ${requiredStr},\n          category: "`);
    }
  }
  blocks[i] = block;
}

fs.writeFileSync('src/utils/planData.ts', blocks.join(''));
