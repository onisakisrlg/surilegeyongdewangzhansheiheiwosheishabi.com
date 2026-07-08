const fs = require('fs');
let content = fs.readFileSync('src/components/Flow20260708.tsx', 'utf8');

const newIntents = `const LOGISTICS_INTENTS = [
  { 
    id: 'default', 
    title: '我不知道，打包后再看看', 
    desc: '暂不确定线路，仓库按常规标准使用纸箱打包',
    adminTags: ['常规纸箱', '正常打包'],
    adminIntent: '未指定路线'
  },
  { 
    id: 'pure_weight', 
    title: '纯重量路线 (不看体积)', 
    desc: '发此路线不看体积重，只需注意实重。打包员无需刻意挤压体积。',
    adminTags: ['常规纸箱', '无视体积重'],
    adminIntent: '纯重量路线'
  },
  { 
    id: 'vol_weight', 
    title: '体积重量取大值路线', 
    desc: '发此路线需兼顾体积与实重。打包员会尽量压缩体积。',
    adminTags: ['常规纸箱', '严格控制体积', '尽可能紧凑'],
    adminIntent: '控制体积重路线'
  },
  { 
    id: 'specific_route',
    title: '特定路线 (专线打包)',
    desc: '选择特定专线，需满足该专线的特定打包要求（例如不用纸箱、指定加固等）。',
    adminTags: [],
    adminIntent: '特定路线',
    hasSubOptions: true
  }
];

const SPECIFIC_ROUTES = [
  {
    id: 'clothes',
    title: '衣服专线',
    desc: '【仅限衣物】仅使用打包袋，不使用纸箱！\\n⚠️ 若有易碎品破损自负。',
    adminTags: ['【袋装】', '禁用纸箱', '衣服专线'],
    adminIntent: '衣服专线',
    isDanger: true
  },
  {
    id: 'dolls',
    title: '玩偶专线',
    desc: '【仅限毛绒玩偶】使用快递袋打包，不使用纸箱以减少体积重。',
    adminTags: ['【袋装】', '禁用纸箱', '玩偶专线'],
    adminIntent: '玩偶专线',
    isDanger: true
  },
  {
    id: 'large_item',
    title: '大件专线',
    desc: '【超大体积】适用于单件超大商品，将采用特殊大件打包标准。',
    adminTags: ['【大件打包】', '特定专线', '常规纸箱/异形'],
    adminIntent: '大件专线',
    isDanger: false
  },
  {
    id: 'luxury',
    title: '奢侈品专线',
    desc: '【高价值品】必须使用防盗胶带、高级加固及特定纸箱。',
    adminTags: ['【高价值加固】', '防盗封箱', '奢侈品专线'],
    adminIntent: '奢侈品专线',
    isDanger: false
  }
];`;

content = content.replace(/const LOGISTICS_INTENTS = \[[\s\S]*?\];/, newIntents);

const newStates = `export function Flow20260708() {
  const [appStep, setAppStep] = useState<'list' | 'form'>('list');
  const [selectedPackageOrders, setSelectedPackageOrders] = useState<string[]>([]);
  const [logisticsIntent, setLogisticsIntent] = useState<string>('default');
  const [specificRoute, setSpecificRoute] = useState<string>('clothes');`;

content = content.replace(/export function Flow20260708\(\) \{\s*const \[appStep, setAppStep\] = useState<'list' \| 'form'>\('list'\);\s*const \[selectedPackageOrders, setSelectedPackageOrders\] = useState<string\[\]>\(\[\]\);\s*const \[logisticsIntent, setLogisticsIntent\] = useState<string>\('default'\);/, newStates);

const newAdminViewLogic = `  const AdminView = () => {
    let currentIntent = LOGISTICS_INTENTS.find(i => i.id === logisticsIntent) || LOGISTICS_INTENTS[0];
    if (currentIntent.hasSubOptions) {
      const subRoute = SPECIFIC_ROUTES.find(r => r.id === specificRoute);
      if (subRoute) {
        currentIntent = {
          ...currentIntent,
          adminIntent: \`特定路线 - \${subRoute.adminIntent}\`,
          adminTags: subRoute.adminTags
        };
      }
    }`;

content = content.replace(/  const AdminView = \(\) => \{\s*const currentIntent = LOGISTICS_INTENTS\.find\(i => i\.id === logisticsIntent\) \|\| LOGISTICS_INTENTS\[0\];/, newAdminViewLogic);

const renderSubOptions = `
                          </div>
                        </div>
                        
                        {isSelected && intent.hasSubOptions && (
                          <div className="mt-3 ml-7 space-y-2 border-t border-blue-100 pt-3">
                            {SPECIFIC_ROUTES.map(route => {
                              const isRouteSelected = specificRoute === route.id;
                              return (
                                <div 
                                  key={route.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSpecificRoute(route.id);
                                  }}
                                  className={\`p-2.5 rounded border \${isRouteSelected ? 'border-blue-400 bg-white' : 'border-gray-200 bg-white hover:border-blue-300'}\`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className={\`w-3.5 h-3.5 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center \${isRouteSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}\`}>
                                      {isRouteSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                    </div>
                                    <div className="flex-1">
                                      <div className={\`font-bold text-[13px] \${isRouteSelected ? 'text-blue-900' : 'text-gray-800'}\`}>
                                        {route.title}
                                        {route.isDanger && <span className="ml-2 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">免责</span>}
                                      </div>
                                      <div className="text-[11px] text-gray-500 mt-0.5 whitespace-pre-wrap leading-relaxed">
                                        {route.desc}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
`;

content = content.replace(/                          <\/div>\s*<\/div>\s*<\/div>\s*\);\s*\}\)\}\s*<\/div>/, renderSubOptions + '                    );\n                  })}\n                </div>');

fs.writeFileSync('src/components/Flow20260708.tsx', content);
console.log("Done");
