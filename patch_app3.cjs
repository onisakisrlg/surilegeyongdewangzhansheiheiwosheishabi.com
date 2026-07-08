const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { Flow20260702 } from './components/Flow20260702';")) {
  code = code.replace("import { MOCK_PROJECTS", "import { Flow20260702 } from './components/Flow20260702';\nimport { MOCK_PROJECTS");
}

code = code.replace(
  "{selectedId === '20260701' ? (",
  `{selectedId === '20260702' ? (
        <Flow20260702 />
      ) : selectedId === '20260701' ? (`
);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched for 20260702');
