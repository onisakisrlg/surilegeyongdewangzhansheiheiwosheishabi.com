const fs = require('fs');
let content = fs.readFileSync('src/components/Flow20260708.tsx', 'utf8');

const newImports = `import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Check, Copy, Search, Filter, AlertTriangle, Package, Info, Edit2 } from 'lucide-react';
import { MOCK_PACKAGE_ORDERS } from '../constants';`;
content = content.replace(/import React, \{ useState \} from 'react';\nimport \{ ChevronLeft, Check, Copy, Search, Filter, AlertTriangle, Package, Info \} from 'lucide-react';\nimport \{ MOCK_PACKAGE_ORDERS \} from '\.\.\/constants';/, newImports);

const newStates = `export function Flow20260708() {
  const [appStep, setAppStep] = useState<'list' | 'form'>('list');
  const [selectedPackageOrders, setSelectedPackageOrders] = useState<string[]>([]);
  const [logisticsIntent, setLogisticsIntent] = useState<string>('default');
  const [specificRoute, setSpecificRoute] = useState<string>('clothes');
  
  // Progressive disclosure state
  const [formActiveStep, setFormActiveStep] = useState(1);
  const [packagingOption, setPackagingOption] = useState<string>('remove_shipping');
  const [valueAddedServices, setValueAddedServices] = useState<string[]>([]);
  
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formActiveStep === 2 && step2Ref.current) {
      setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (formActiveStep === 3 && step3Ref.current) {
      setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }, [formActiveStep]);`;

content = content.replace(/export function Flow20260708\(\) \{\s*const \[appStep, setAppStep\] = useState<'list' \| 'form'>\('list'\);\s*const \[selectedPackageOrders, setSelectedPackageOrders\] = useState<string\[\]>\(\[\]\);\s*const \[logisticsIntent, setLogisticsIntent\] = useState<string>\('default'\);\s*const \[specificRoute, setSpecificRoute\] = useState<string>\('clothes'\);/, newStates);

const colorsRegex = /text-rose-500|border-rose-500|bg-rose-400|text-\[#db4c66\]|border-\[#db4c66\]|bg-\[#db4c66\]/g;
content = content.replace(colorsRegex, (match) => {
  if (match.includes('text-')) return 'text-[#d1586e]';
  if (match.includes('border-')) return 'border-[#d1586e]';
  if (match.includes('bg-')) return 'bg-[#d1586e]';
  return match;
});

const colorsRegex2 = /text-rose-500/g;
content = content.replace(colorsRegex2, 'text-[#d1586e]');

// Checkbox style fix
content = content.replace(
  /className=\{`w-5 h-5 rounded flex items-center justify-center shrink-0 cursor-pointer transition-colors \$\{isSelected \? 'bg-blue-500 border-blue-500' : 'border border-gray-300 bg-white'\}`\}/g,
  `className={\`w-5 h-5 rounded flex items-center justify-center shrink-0 cursor-pointer transition-colors \${isSelected ? 'border border-[#1677ff] bg-white' : 'border border-gray-300 bg-white'}\`}`
);
content = content.replace(
  /\{isSelected && <Check className="w-3\.5 h-3\.5 text-white" \/>\}/g,
  `{isSelected && <Check className="w-4 h-4 text-[#1677ff]" strokeWidth={3} />}`
);

// Buttons style fix
content = content.replace(
  /className="w-20 py-2 rounded-full border border-blue-400 text-blue-500 text-\[14px\] font-medium active:bg-blue-50 transition-colors"/g,
  `className="w-20 py-2 rounded-full border border-[#1677ff] text-[#1677ff] text-[14px] font-medium active:bg-blue-50 transition-colors"`
);

// New Steps Form Code
const formCodeOld = `            <div className="flex-1 overflow-y-auto p-4 pb-32">
              <div className="mb-2 text-[13px] text-gray-500 font-medium">请谨慎选择，仓库将严格按此执行</div>
              
              {/* Step 1: 物流意向 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[12px] font-bold">1</span>
                  <h2 className="font-bold text-[14px] text-gray-800">选择物流意向</h2>
                  <span className="text-[12px] text-gray-400 ml-auto">单选</span>
                </div>
                
                <div className="p-3 space-y-3">
                  {LOGISTICS_INTENTS.map(intent => {
                    const isSelected = logisticsIntent === intent.id;
                    return (
                      <div 
                        key={intent.id}
                        onClick={() => setLogisticsIntent(intent.id)}
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
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 pb-safe">
              <button 
                onClick={() => {}}
                className="w-full py-3 rounded-full bg-gray-900 text-white font-medium text-[15px] active:scale-95 transition-transform"
              >
                下一步
              </button>
            </div>`;

const formCodeNew = `            <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
              <div className="mb-2 text-[13px] text-gray-500 font-medium">请依次确认打包需求，确保仓库准确执行</div>
              
              {/* Step 1: 物流意向 */}
              <div className={\`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 \${formActiveStep === 1 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}\`}>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={\`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold \${formActiveStep > 1 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}\`}>
                      {formActiveStep > 1 ? <Check className="w-3 h-3" strokeWidth={3} /> : '1'}
                    </span>
                    <h2 className="font-bold text-[14px] text-gray-800">选择物流意向</h2>
                  </div>
                  {formActiveStep > 1 && (
                    <button onClick={() => setFormActiveStep(1)} className="text-blue-500 text-[12px] flex items-center gap-1 hover:underline">
                      <Edit2 className="w-3 h-3" /> 修改
                    </button>
                  )}
                </div>
                
                {formActiveStep === 1 ? (
                  <div className="p-3">
                    <div className="space-y-3">
                      {LOGISTICS_INTENTS.map(intent => {
                        const isSelected = logisticsIntent === intent.id;
                        return (
                          <div 
                            key={intent.id}
                            onClick={() => setLogisticsIntent(intent.id)}
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
                        );
                      })}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <button 
                        onClick={() => setFormActiveStep(2)}
                        className="bg-[#ffd200] text-gray-900 px-6 py-2 rounded-full text-[14px] font-bold active:scale-95 transition-transform"
                      >
                        确认意向，下一步
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-[13px] text-gray-500">已选意向</div>
                      <div className="font-medium text-[14px] text-gray-900 mt-1">
                        {LOGISTICS_INTENTS.find(i => i.id === logisticsIntent)?.title}
                        {LOGISTICS_INTENTS.find(i => i.id === logisticsIntent)?.hasSubOptions && specificRoute && (
                          <span className="text-blue-600"> - {SPECIFIC_ROUTES.find(r => r.id === specificRoute)?.title}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Step 2: 拆除包装选项 */}
              {formActiveStep >= 2 && (
                <div ref={step2Ref} className={\`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 \${formActiveStep === 2 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}\`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={\`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold \${formActiveStep > 2 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}\`}>
                        {formActiveStep > 2 ? <Check className="w-3 h-3" strokeWidth={3} /> : '2'}
                      </span>
                      <h2 className="font-bold text-[14px] text-gray-800">拆除包装要求</h2>
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
                        {[
                          { id: 'keep_all', title: '保留所有包装', desc: '原箱原包装直接合箱，最安全但体积可能较大。' },
                          { id: 'remove_shipping', title: '仅拆除快递箱 (推荐)', desc: '拆除商家发货的快递外箱，保留商品本身包装（如鞋盒、手办盒）。' },
                          { id: 'remove_all', title: '拆除所有外包装', desc: '拆除快递箱及商品原外包装（如去掉鞋盒），极限压缩体积，易碎品破损自负。' }
                        ].map(opt => {
                          const isSelected = packagingOption === opt.id;
                          return (
                            <div 
                              key={opt.id}
                              onClick={() => setPackagingOption(opt.id)}
                              className={\`p-3 rounded-lg border-2 cursor-pointer transition-all \${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}\`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={\`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center \${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}\`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                </div>
                                <div className="flex-1">
                                  <div className={\`font-bold text-[14px] \${isSelected ? 'text-blue-900' : 'text-gray-800'}\`}>
                                    {opt.title}
                                  </div>
                                  <div className="text-[12px] text-gray-500 mt-1">
                                    {opt.desc}
                                  </div>
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
                          确认包装，下一步
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="text-[13px] text-gray-500">已选拆包要求</div>
                      <div className="font-medium text-[14px] text-gray-900 mt-1">
                        {packagingOption === 'keep_all' ? '保留所有包装' : packagingOption === 'remove_shipping' ? '仅拆除快递箱' : '拆除所有外包装'}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: 其他增值服务 */}
              {formActiveStep >= 3 && (
                <div ref={step3Ref} className={\`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 \${formActiveStep === 3 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}\`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[12px] font-bold">3</span>
                    <h2 className="font-bold text-[14px] text-gray-800">增值服务 (可选)</h2>
                  </div>
                  <div className="p-3">
                    <div className="space-y-3">
                      {[
                        { id: 'photo', title: '入库拍照核验 (100円/件)', desc: '打开包裹拍摄内部商品情况，确认无误后再合箱。' },
                        { id: 'bubble', title: '气泡膜加固 (200円/单)', desc: '使用加厚气泡膜包裹商品，降低破损风险。' }
                      ].map(opt => {
                        const isSelected = valueAddedServices.includes(opt.id);
                        return (
                          <div 
                            key={opt.id}
                            onClick={() => setValueAddedServices(prev => prev.includes(opt.id) ? prev.filter(v => v !== opt.id) : [...prev, opt.id])}
                            className={\`p-3 rounded-lg border-2 cursor-pointer transition-all \${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}\`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={\`w-4 h-4 mt-0.5 rounded border-2 shrink-0 flex items-center justify-center transition-colors \${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}\`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                              </div>
                              <div className="flex-1">
                                <div className={\`font-bold text-[14px] \${isSelected ? 'text-blue-900' : 'text-gray-800'}\`}>
                                  {opt.title}
                                </div>
                                <div className="text-[12px] text-gray-500 mt-1">
                                  {opt.desc}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {formActiveStep === 3 && (
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-20 pb-safe animate-in slide-in-from-bottom-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-[13px] text-gray-500">基础打包费</div>
                  <div className="font-bold text-[15px] text-gray-900">免除 (会员权益)</div>
                </div>
                <button 
                  onClick={() => alert('打包申请已提交！仓库管理员将在管理端看到您的指令。')}
                  className="w-full py-3 rounded-full bg-gray-900 text-[#ffd200] font-bold text-[15px] active:scale-95 transition-transform"
                >
                  提交出库申请
                </button>
              </div>
            )}`;

content = content.replace(formCodeOld, formCodeNew);

fs.writeFileSync('src/components/Flow20260708.tsx', content);
console.log("Done");
