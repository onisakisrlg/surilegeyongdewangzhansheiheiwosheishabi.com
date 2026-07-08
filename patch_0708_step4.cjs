const fs = require('fs');
let content = fs.readFileSync('src/components/Flow20260708.tsx', 'utf8');

// Update LOGISTICS_INTENTS and add BOX_OPTIONS
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
    adminIntent: '控制体积重路线',
    hasSubOptions: true,
    subOptions: [
      {
        id: 'pg_jd',
        title: '蒲公英-京东',
        desc: '【必须使用付费新箱】时效快，派送质量高。',
        adminTags: ['【蒲公英】', '京东', '强制新箱'],
        adminIntent: '蒲公英-京东',
        requireNewBox: true
      },
      {
        id: 'pg_sf',
        title: '蒲公英-顺丰国际',
        desc: '【必须使用付费新箱】顺丰官方直邮。',
        adminTags: ['【蒲公英】', '顺丰', '强制新箱'],
        adminIntent: '蒲公英-顺丰国际',
        requireNewBox: true
      },
      {
        id: 'vol_other',
        title: '其他体积路线 (EMS等)',
        desc: '常规体积路线，可自由选择包装。',
        adminTags: ['控制体积重', '普通路线'],
        adminIntent: '其他体积路线',
        requireNewBox: false
      }
    ]
  },
  { 
    id: 'specific_route',
    title: '特定路线 (专线打包)',
    desc: '选择特定专线，需满足该专线的特定打包要求（例如不用纸箱、指定加固等）。',
    adminTags: [],
    adminIntent: '特定路线',
    hasSubOptions: true,
    subOptions: [
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
    ]
  }
];

const BOX_OPTIONS = [
  { id: 'free_box', title: '免费旧箱', desc: '使用仓库二手纸箱打包。', price: 0 },
  { id: 'new_box', title: '付费新箱', desc: '使用全新加厚纸箱打包，更安全。', price: 200 },
  { id: 'original_box', title: '岛内原箱', desc: '直接使用原卖家发来的箱子（若无合适外箱则使用免费旧箱）。', price: 0 }
];
`;

content = content.replace(/const LOGISTICS_INTENTS = \[[\s\S]*?\];\s*const SPECIFIC_ROUTES = \[[\s\S]*?\];/, newIntents);

const newStatesRegex = /const \[packagingOption, setPackagingOption\] = useState<string>\('remove_shipping'\);/;
content = content.replace(newStatesRegex, `const [boxOption, setBoxOption] = useState<string>('free_box');\n  const [packagingOption, setPackagingOption] = useState<string>('remove_shipping');`);

const adminViewRegex = /let currentIntent = LOGISTICS_INTENTS\.find\(i => i\.id === logisticsIntent\) \|\| LOGISTICS_INTENTS\[0\];\s*if \(currentIntent\.hasSubOptions\) \{\s*const subRoute = SPECIFIC_ROUTES\.find\(r => r\.id === specificRoute\);\s*if \(subRoute\) \{\s*currentIntent = \{\s*\.\.\.currentIntent,\s*adminIntent: \`特定路线 - \$\{subRoute\.adminIntent\}\`,\s*adminTags: subRoute\.adminTags\s*\};\s*\}\s*\}/;

content = content.replace(adminViewRegex, `let currentIntent = LOGISTICS_INTENTS.find(i => i.id === logisticsIntent) || LOGISTICS_INTENTS[0];
    if (currentIntent.hasSubOptions) {
      const subRoute = currentIntent.subOptions?.find(r => r.id === specificRoute);
      if (subRoute) {
        currentIntent = {
          ...currentIntent,
          adminIntent: subRoute.adminIntent,
          adminTags: subRoute.adminTags
        };
      }
    }`);

const formActiveStep1Regex = /\{LOGISTICS_INTENTS\.map\(intent => \{[\s\S]*?\{isSelected && intent\.hasSubOptions && \([\s\S]*?\{SPECIFIC_ROUTES\.map\(route => \{[\s\S]*?\}\)\}\s*<\/div>\s*\)\}\s*<\/div>\s*\);\s*\}\)\}/;

const newFormStep1 = `{LOGISTICS_INTENTS.map(intent => {
                        const isSelected = logisticsIntent === intent.id;
                        return (
                          <div 
                            key={intent.id}
                            onClick={() => {
                              setLogisticsIntent(intent.id);
                              if (intent.subOptions && intent.subOptions.length > 0) {
                                setSpecificRoute(intent.subOptions[0].id);
                              } else {
                                setSpecificRoute('');
                              }
                            }}
                            className={\`p-3 rounded-lg border-2 cursor-pointer transition-all \${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}\`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={\`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center \${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}\`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                              </div>
                              <div className="flex-1">
                                <div className={\`font-bold text-[14px] \${isSelected ? 'text-blue-900' : 'text-gray-800'}\`}>
                                  {intent.title}
                                </div>
                                <div className="text-[12px] text-gray-500 mt-1 whitespace-pre-wrap leading-relaxed">
                                  {intent.desc}
                                </div>
                              </div>
                            </div>
                            
                            {isSelected && intent.hasSubOptions && (
                              <div className="mt-3 ml-7 space-y-2 border-t border-blue-100 pt-3">
                                {intent.subOptions?.map(route => {
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
                                            {route.requireNewBox && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">仅限新箱</span>}
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
                        );
                      })}`;

content = content.replace(formActiveStep1Regex, newFormStep1);

const confirmIntentNext = `                      <button 
                        onClick={() => {
                          const currentIntent = LOGISTICS_INTENTS.find(i => i.id === logisticsIntent);
                          const currentSubRoute = currentIntent?.subOptions?.find(s => s.id === specificRoute);
                          if (currentSubRoute?.requireNewBox) {
                             setBoxOption('new_box');
                          }
                          setFormActiveStep(2);
                        }}
                        className="bg-[#ffd200] text-gray-900 px-6 py-2 rounded-full text-[14px] font-bold active:scale-95 transition-transform"
                      >
                        确认意向，下一步
                      </button>`;
content = content.replace(/<button \n\s*onClick=\{.*?setFormActiveStep\(2\).*?\}\n\s*className="bg-\[#ffd200\].*?>\n\s*确认意向，下一步\n\s*<\/button>/s, confirmIntentNext);

// Add Step 2 for Box Option, move old Step 2 to Step 3, old Step 3 to Step 4
const step2Regex = /\{\/\* Step 2: 拆除包装选项 \*\/\}/;

const newStep2BoxOption = `{/* Step 2: 箱子选项 */}
              {formActiveStep >= 2 && (
                <div ref={step2Ref} className={\`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 \${formActiveStep === 2 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}\`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={\`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold \${formActiveStep > 2 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}\`}>
                        {formActiveStep > 2 ? <Check className="w-3 h-3" strokeWidth={3} /> : '2'}
                      </span>
                      <h2 className="font-bold text-[14px] text-gray-800">选择箱子</h2>
                    </div>
                    {formActiveStep > 2 && (
                      <button onClick={() => setFormActiveStep(2)} className="text-blue-500 text-[12px] flex items-center gap-1 hover:underline">
                        <Edit2 className="w-3 h-3" /> 修改
                      </button>
                    )}
                  </div>
                  
                  {formActiveStep === 2 ? (
                    <div className="p-3">
                      <div className="space-y-3">
                        {BOX_OPTIONS.map(opt => {
                          const isSelected = boxOption === opt.id;
                          return (
                            <div 
                              key={opt.id}
                              onClick={() => {
                                const currentIntent = LOGISTICS_INTENTS.find(i => i.id === logisticsIntent);
                                const currentSubRoute = currentIntent?.subOptions?.find(s => s.id === specificRoute);
                                if (currentSubRoute?.requireNewBox && opt.id !== 'new_box') {
                                  if (window.confirm(\`【\${currentSubRoute.title}】仅限使用付费新箱。如果选择\${opt.title}，将禁用该路线并重新选择意向。是否继续？\`)) {
                                    setBoxOption(opt.id);
                                    setLogisticsIntent('default');
                                    setSpecificRoute('');
                                    setFormActiveStep(1);
                                  }
                                } else {
                                  setBoxOption(opt.id);
                                }
                              }}
                              className={\`p-3 rounded-lg border-2 cursor-pointer transition-all \${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}\`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={\`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center \${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}\`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                </div>
                                <div className="flex-1 flex justify-between items-start">
                                  <div>
                                    <div className={\`font-bold text-[14px] \${isSelected ? 'text-blue-900' : 'text-gray-800'}\`}>
                                      {opt.title}
                                    </div>
                                    <div className="text-[12px] text-gray-500 mt-1">
                                      {opt.desc}
                                    </div>
                                  </div>
                                  {opt.price > 0 && (
                                    <div className="text-[13px] font-bold text-rose-500 shrink-0">
                                      {opt.price} 円
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => setFormActiveStep(3)}
                          className="bg-[#ffd200] text-gray-900 px-6 py-2 rounded-full text-[14px] font-bold active:scale-95 transition-transform"
                        >
                          确认箱子，下一步
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="text-[13px] text-gray-500">已选箱子</div>
                      <div className="font-medium text-[14px] text-gray-900 mt-1">
                        {BOX_OPTIONS.find(o => o.id === boxOption)?.title}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: 拆除包装选项 */}`;

content = content.replace(step2Regex, newStep2BoxOption);

// Change Step 2 numbers to Step 3, Step 3 to Step 4
content = content.replace(/formActiveStep >= 2 && \(\n\s*<div ref=\{step2Ref\}/, `formActiveStep >= 3 && (\n                <div ref={step3Ref}`);
content = content.replace(/formActiveStep === 2 \? 'border-blue-400 ring-2 ring-blue-100'/, `formActiveStep === 3 ? 'border-blue-400 ring-2 ring-blue-100'`);
content = content.replace(/formActiveStep > 2 \? 'bg-green-500/g, `formActiveStep > 3 ? 'bg-green-500`);
content = content.replace(/\{formActiveStep > 2 \? <Check/g, `{formActiveStep > 3 ? <Check`);
content = content.replace(/onClick=\{.*?setFormActiveStep\(2\).*?\} className="text-blue-500/g, `onClick={() => setFormActiveStep(3)} className="text-blue-500`);
content = content.replace(/formActiveStep === 2 \? \(/g, `formActiveStep === 3 ? (`);
content = content.replace(/setFormActiveStep\(3\).*?确认包装，下一步/s, `setFormActiveStep(4)}\n                          className="bg-[#ffd200] text-gray-900 px-6 py-2 rounded-full text-[14px] font-bold active:scale-95 transition-transform"\n                        >\n                          确认包装，下一步`);

// Change old Step 3 to Step 4
content = content.replace(/\{\/\* Step 3: 其他增值服务 \*\/\}/, `{/* Step 4: 其他增值服务 */}`);
content = content.replace(/formActiveStep >= 3 && \(\n\s*<div ref=\{step3Ref\}/, `formActiveStep >= 4 && (\n                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"`); // Removing step 4 ref for now, or just leave it
content = content.replace(/formActiveStep === 3 \? 'border-blue-400 ring-2 ring-blue-100'/g, `formActiveStep === 4 ? 'border-blue-400 ring-2 ring-blue-100'`);
content = content.replace(/<span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-\[12px\] font-bold">3<\/span>/, `<span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[12px] font-bold">4</span>`);

content = content.replace(/\{formActiveStep === 3 && \(/, `{formActiveStep === 4 && (`);


// We need to update useEffect for scrolling
const newUseEffect = `  useEffect(() => {
    if (formActiveStep === 2 && step2Ref.current) {
      setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (formActiveStep === 3 && step3Ref.current) {
      setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (formActiveStep === 4) {
      setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100);
    }
  }, [formActiveStep]);`;
content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[formActiveStep\]\);/, newUseEffect);

// Update step3Ref definition
content = content.replace(/const step3Ref = useRef<HTMLDivElement>\(null\);/, `const step3Ref = useRef<HTMLDivElement>(null);\n  const step4Ref = useRef<HTMLDivElement>(null);`);
// Replace the added step4 logic to just use body scrolling, or use step4Ref
content = content.replace(/<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"/, `<div ref={step4Ref} className={\`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 \${formActiveStep === 4 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}\`}`);

// Also fix Admin tags display: Add box option
const adminViewAddBoxTag = `<div className="flex gap-4 items-start">
              <div className="w-32 text-[13px] font-bold text-gray-600 shrink-0 mt-1">物流意向与容器</div>
              <div className="flex-1 space-y-3">
                <div className="text-[15px] font-bold text-gray-900">{currentIntent.adminIntent}</div>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 text-[13px] font-bold rounded bg-blue-100 text-blue-700 border border-blue-200">
                    {BOX_OPTIONS.find(o => o.id === boxOption)?.title}
                  </span>
                  {currentIntent.adminTags.map(tag => (`;
content = content.replace(/<div className="flex gap-4 items-start">\s*<div className="w-32 text-\[13px\] font-bold text-gray-600 shrink-0 mt-1">物流意向与容器<\/div>\s*<div className="flex-1 space-y-3">\s*<div className="text-\[15px\] font-bold text-gray-900">\{currentIntent\.adminIntent\}<\/div>\s*<div className="flex flex-wrap gap-2">\s*\{currentIntent\.adminTags\.map\(tag => \(/, adminViewAddBoxTag);

// Display current intent info safely
content = content.replace(
  /\{LOGISTICS_INTENTS\.find\(i => i\.id === logisticsIntent\)\?\.hasSubOptions && specificRoute && \(\s*<span className="text-blue-600"> - \{SPECIFIC_ROUTES\.find\(r => r\.id === specificRoute\)\?\.title\}<\/span>\s*\)\}/,
  `{LOGISTICS_INTENTS.find(i => i.id === logisticsIntent)?.hasSubOptions && specificRoute && (
                          <span className="text-blue-600"> - {LOGISTICS_INTENTS.find(i => i.id === logisticsIntent)?.subOptions?.find(r => r.id === specificRoute)?.title}</span>
                        )}`
);

fs.writeFileSync('src/components/Flow20260708.tsx', content);
console.log("Done");
