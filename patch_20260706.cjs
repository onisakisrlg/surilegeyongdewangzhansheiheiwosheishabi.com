const fs = require('fs');

// Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  "import { Flow20260702 } from './components/Flow20260702';",
  "import { Flow20260702 } from './components/Flow20260702';\nimport { Flow20260706 } from './components/Flow20260706';"
);

appContent = appContent.replace(
  ") : selectedId === '20260515' ? (",
  ") : selectedId === '20260706' ? (\n                        <Flow20260706 />\n                      ) : selectedId === '20260515' ? ("
);

fs.writeFileSync('src/App.tsx', appContent);

// Update constants.tsx
let constContent = fs.readFileSync('src/constants.tsx', 'utf8');

const newProj = `  {
    id: "20260706",
    name: "结构化和确定指令",
    category: "仓库打包",
    description: "结构化和确定指令，左侧为移动端APP展示，右侧为管理端后台展示。",
    previewUrl: null,
    redmineUrl: null,
    subItems: [
      { id: "sub-0706-1", name: "APP端 (左侧)" },
      { id: "sub-0706-2", name: "管理端 (右侧)" }
    ],
    specs: [
      {
        title: "设计说明",
        content: "1. 采用分屏结构，左侧展示APP用户端界面，右侧展示管理端后台界面。\\n2. 用于展现新的用户提交打包交互体验与后台处理。"
      }
    ]
  },
`;

constContent = constContent.replace(
  "export const MOCK_PROJECTS: PrototypeProject[] = [",
  "export const MOCK_PROJECTS: PrototypeProject[] = [\n" + newProj
);

fs.writeFileSync('src/constants.tsx', constContent);

console.log("Patched 20260706!");
