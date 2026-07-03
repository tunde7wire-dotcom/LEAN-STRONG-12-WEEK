const fs = require('fs');
let code = fs.readFileSync('.github/workflows/deploy.yml', 'utf8');

const oldStr = `      - name: Install dependencies
        run: npm install
      - name: Build application
        run: npm run build`;

const newStr = `      - name: Install dependencies
        run: npm install

      - name: Type-check application
        run: npm run lint

      - name: Build application
        run: npm run build`;

code = code.replace(oldStr, newStr);
fs.writeFileSync('.github/workflows/deploy.yml', code);
