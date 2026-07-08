const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

const regexState = /\/\/ 20260701 State[\s\S]*?\}, \[selectedPackageOrders\]\);/g;
appContent = appContent.replace(regexState, "");

fs.writeFileSync('src/App.tsx', appContent);
