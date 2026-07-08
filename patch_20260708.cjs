const fs = require('fs');

// Update App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  "import { Flow20260702 } from './components/Flow20260702';",
  "import { Flow20260702 } from './components/Flow20260702';\nimport { Flow20260708 } from './components/Flow20260708';"
);

appContent = appContent.replace(
  ") : selectedId === '20260515' ? (",
  ") : selectedId === '20260708' ? (\n                        <Flow20260708 />\n                      ) : selectedId === '20260515' ? ("
);

fs.writeFileSync('src/App.tsx', appContent);

// Update constants.tsx
let constContent = fs.readFileSync('src/constants.tsx', 'utf8');

const newProj = `  {
    id: "20260708",
    name: "出库与管理端结构化",
    category: "仓库打包",
    description: "展示app端和管理端。app端对应的操作会让管理端显示什么标签。",
    previewUrl: null,
    redmineUrl: null,
    subItems: [
      { id: "sub-0708-1", name: "APP端 (左侧)" },
      { id: "sub-0708-2", name: "管理端 (右侧)" }
    ],
    specs: [
      {
        title: "设计说明",
        content: "1. 左侧APP端我的订单列表及发起打包交互。\\n2. 右侧管理端展示最终仓库执行单的结构化信息。"
      }
    ]
  },
`;

constContent = constContent.replace(
  "export const MOCK_PROJECTS: PrototypeProject[] = [",
  "export const MOCK_PROJECTS: PrototypeProject[] = [\n" + newProj
);

fs.writeFileSync('src/constants.tsx', constContent);

console.log("Patched 20260708 routes!");
