const fs = require('fs');
let code = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');

code = code.replace(
  "      - name: Install dependencies\n        run: npm install\n      - name: Type-check application\n        run: npm run lint\n\n      - name: Build application\n        run: npm run build",
  "      - name: Install dependencies\n        run: npm install\n\n      - name: Type-check application\n        run: npm run lint\n\n      - name: Build application\n        run: npm run build"
);

fs.writeFileSync('.github/workflows/deploy.yml', code);
