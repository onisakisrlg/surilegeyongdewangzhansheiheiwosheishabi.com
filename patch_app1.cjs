const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { Flow20260701 } from './components/Flow20260701';")) {
  code = code.replace("import { MOCK_PROJECTS", "import { Flow20260701 } from './components/Flow20260701';\nimport { MOCK_PROJECTS");
}

const extractedStr = fs.readFileSync('extracted.txt', 'utf8');
code = code.replace(extractedStr, `                        <Flow20260701 />\n`);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched for 20260701');
