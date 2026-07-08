const fs = require('fs');
let content = fs.readFileSync('src/components/Flow20260708.tsx', 'utf8');

const newImports = `import React, { useState } from 'react';
import { ChevronLeft, Check, Copy, Search, Filter, AlertTriangle, Package, Info } from 'lucide-react';
import { MOCK_PACKAGE_ORDERS } from '../constants';

const LOGISTICS_INTENTS = [
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
    id: 'clothes_line', 
    title: '特定路线 - 衣服专线', 
    desc: '【仅限衣物】打包要求：仅使用打包袋，不使用纸箱！\n⚠️ 注意：若您内部有易碎品选错此项，打包员也会拿袋子装！导致破损自负，后续改换纸箱需加收打包人工费。',
    adminTags: ['【袋装】', '禁用纸箱', '衣服专线'],
    adminIntent: '衣服专线',
    isDanger: true
  }
];`;

content = content.replace(/import React, \{ useState \} from 'react';[\s\S]*?import \{ MOCK_PACKAGE_ORDERS \} from '\.\.\/constants';/, newImports);

const newStates = `export function Flow20260708() {
  const [appStep, setAppStep] = useState<'list' | 'form'>('list');
  const [selectedPackageOrders, setSelectedPackageOrders] = useState<string[]>([]);
  const [logisticsIntent, setLogisticsIntent] = useState<string>('default');`;

content = content.replace(/export function Flow20260708\(\) \{\s*const \[selectedPackageOrders, setSelectedPackageOrders\] = useState<string\[\]>\(\[\]\);/, newStates);

const adminViewRegex = /const AdminView = \(\) => \([\s\S]*?\n  \);/;
const newAdminView = `  const AdminView = () => {
    const currentIntent = LOGISTICS_INTENTS.find(i => i.id === logisticsIntent) || LOGISTICS_INTENTS[0];
    
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 space-y-6 text-sm">
        {/* 基本信息 */}
        <div className="bg-white border border-gray-200 shadow-sm">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="w-1 h-3.5 bg-blue-500 rounded-sm" />
            <h2 className="font-bold text-gray-800">基本信息</h2>
          </div>
          <div className="grid grid-cols-2 text-[13px]">
            <div className="flex border-b border-r border-gray-100">
              <div className="w-1/3 bg-gray-50 p-3 text-gray-500 border-r border-gray-100 flex items-center">出货单编号</div>
              <div className="w-2/3 p-3 text-gray-800 flex items-center">LO20260707005317796615</div>
            </div>
            <div className="flex border-b border-gray-100">
              <div className="w-1/3 bg-gray-50 p-3 text-gray-500 border-r border-gray-100 flex items-center">运单状态</div>
              <div className="w-2/3 p-3 text-gray-800 flex items-center">待出库打包</div>
            </div>
            <div className="flex border-b border-r border-gray-100">
              <div className="w-1/3 bg-gray-50 p-3 text-gray-500 border-r border-gray-100 flex items-center">会员ID</div>
              <div className="w-2/3 p-3 text-blue-600 flex items-center gap-1 cursor-pointer hover:underline">
                8783107904
              </div>
            </div>
            <div className="flex border-b border-gray-100">
              <div className="w-1/3 bg-gray-50 p-3 text-gray-500 border-r border-gray-100 flex items-center">会员入库ID</div>
              <div className="w-2/3 p-3 text-gray-800 flex items-center">131378</div>
            </div>
            <div className="flex border-b border-r border-gray-100">
              <div className="w-1/3 bg-gray-50 p-3 text-gray-500 border-r border-gray-100 flex items-center">商品总价</div>
              <div className="w-2/3 p-3 text-gray-800 flex items-center">3243 円</div>
            </div>
            <div className="flex border-b border-gray-100">
              <div className="w-1/3 bg-gray-50 p-3 text-gray-500 border-r border-gray-100 flex items-center">商品总价</div>
              <div className="w-2/3 p-3 text-gray-800 flex items-center">RMB 145.94</div>
            </div>
            <div className="flex border-r border-gray-100">
              <div className="w-1/3 bg-gray-50 p-3 text-gray-500 border-r border-gray-100 flex items-center">商品总重量</div>
              <div className="w-2/3 p-3 text-gray-800 flex items-center">4199 克</div>
            </div>
            <div className="flex">
              <div className="w-1/3 bg-gray-50 p-3 text-gray-500 border-r border-gray-100 flex items-center">已预付运费实际抵扣</div>
              <div className="w-2/3 p-3 text-green-600 font-medium flex items-center">1000 円</div>
            </div>
          </div>
        </div>

        {/* 打包信息 - 仓库直接看这里执行 */}
        <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-600" />
            <h2 className="font-bold text-blue-900">执行指令 (打包员重点看)</h2>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="flex gap-4 items-start">
              <div className="w-32 text-[13px] font-bold text-gray-600 shrink-0 mt-1">物流意向与容器</div>
              <div className="flex-1 space-y-3">
                <div className="text-[15px] font-bold text-gray-900">{currentIntent.adminIntent}</div>
                <div className="flex flex-wrap gap-2">
                  {currentIntent.adminTags.map(tag => (
                    <span key={tag} className={\`px-2.5 py-1 text-[13px] font-bold rounded \${tag.includes('袋装') ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}\`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-px bg-gray-100" />
            
            <div className="flex gap-4 items-start">
              <div className="w-32 text-[13px] font-bold text-gray-600 shrink-0 mt-1">客户人工备注</div>
              <div className="flex-1 text-[13px] text-gray-400 italic">
                (新版无客户自由备注，全部结构化选项)
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };`;
content = content.replace(adminViewRegex, newAdminView);

const buttonsRegex = /<button \n\s*disabled=\{selectedPackageOrders\.length === 0\}\n\s*className=\{`w-24 py-2 rounded-full text-\[14px\] font-medium transition-transform \${selectedPackageOrders\.length > 0 \? 'bg-\[#ffd200\] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`\}\n\s*>发起直邮<\/button>/g;
content = content.replace(buttonsRegex, `<button 
                  onClick={() => setAppStep('form')}
                  disabled={selectedPackageOrders.length === 0}
                  className={\`w-24 py-2 rounded-full text-[14px] font-medium transition-transform \${selectedPackageOrders.length > 0 ? 'bg-[#ffd200] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}\`}
                >发起直邮</button>`);

const rightColRegex = /\{\/\* Right Column: Web Admin \*\/\}/;
const formStepCode = `        {appStep === 'form' && (
          <div className="flex flex-col h-full relative bg-gray-50">
            <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-center border-b border-gray-100 shrink-0 sticky top-0 z-20">
              <button onClick={() => setAppStep('list')} className="absolute left-4 p-1 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-[17px] font-medium text-gray-900 tracking-wide">出库打包需求</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-32">
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
            </div>
          </div>
        )}
        
        {/* Right Column: Web Admin */}`;

content = content.replace(/\{\/\* Right Column: Web Admin \*\/\}/, formStepCode);

// We need to also hide appStep === 'list' when 'form'
content = content.replace(/<div className="flex flex-col h-full relative">/, `{appStep === 'list' && (<div className="flex flex-col h-full relative">`);
content = content.replace(/<\/div>\s*<\/div>\s*\{appStep === 'form'/, `</div>\n        )}\n\n        {appStep === 'form'`);

fs.writeFileSync('src/components/Flow20260708.tsx', content);
console.log("Done");
