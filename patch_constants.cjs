const fs = require('fs');
let constantsContent = fs.readFileSync('src/constants.tsx', 'utf8');

const regex = /,\s*\{\s*id:\s*"20260701"[\s\S]*?\}\s*\]\s*\}/;
constantsContent = constantsContent.replace(regex, "");

fs.writeFileSync('src/constants.tsx', constantsContent);
