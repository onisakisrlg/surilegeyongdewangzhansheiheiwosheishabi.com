const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const startIndex = code.indexOf("selectedId === '20260701' ? (");
let count = 0;
let endIndex = -1;

for (let i = startIndex + 29; i < code.length; i++) {
  if (code[i] === '(') count++;
  if (code[i] === ')') {
    if (count === 0) {
      endIndex = i;
      break;
    }
    count--;
  }
}

const extracted = code.substring(startIndex + 29, endIndex);
fs.writeFileSync('extracted.txt', extracted);
console.log("Extracted!");
