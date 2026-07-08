const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// Remove rendering block
const renderBlock = `                      ) : selectedId === '20260701' ? (
                        <Flow20260701 />
`;
appContent = appContent.replace(renderBlock, "");

fs.writeFileSync('src/App.tsx', appContent);
