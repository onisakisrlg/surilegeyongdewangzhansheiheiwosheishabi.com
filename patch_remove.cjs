const fs = require('fs');

// 1. Remove from App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace("import { Flow20260701 } from './components/Flow20260701';\n", "");

const renderBlock = `                      ) : selectedId === '20260701' ? (
                        <Flow20260701 />\n`;
appContent = appContent.replace(renderBlock, "");
fs.writeFileSync('src/App.tsx', appContent);

// 2. Remove from constants.tsx
let constantsContent = fs.readFileSync('src/constants.tsx', 'utf8');
const projectBlockRegex = /,\s*\{\s*id:\s*"20260701"[\s\S]*?\}\s*\]\s*\}\s*\]\s*\}/g;
// actually, let's find it.
