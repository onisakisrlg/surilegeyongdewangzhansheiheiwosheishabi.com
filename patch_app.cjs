const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import { Flow20260701A } from './components/Flow20260701A';")) {
  code = code.replace("import { MOCK_PROJECTS", "import { Flow20260701A } from './components/Flow20260701A';\nimport { MOCK_PROJECTS");
}

code = code.replace(
  "{selectedId === '20260702' ? (",
  `{selectedId === '20260701A' ? (
        <Flow20260701A />
      ) : selectedId === '20260702' ? (`
);

fs.writeFileSync('src/App.tsx', code);
console.log('App patched for 20260701A');
