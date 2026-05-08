/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  ChevronRight, 
  ChevronDown, 
  Layout, 
  Code2, 
  Eye, 
  ExternalLink,
  Search,
  BookOpen,
  ArrowRight,
  Monitor,
  Smartphone,
  Tablet,
  Box,
  Check,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
  Trash2,
  Undo2,
  Lock,
  CornerDownLeft,
  ArrowLeft
} from 'lucide-react';
import { MOCK_PROJECTS } from './constants';
import { PrototypeProject } from './types';

const LOGISTICS_METHODS = [
  { id: 'ems', name: 'EMS【税费自理】', price: 9800, boxFee: 200, subtext: '' },
  { id: 'sea', name: '国际邮包海运【税费自理】', price: 5000, boxFee: 200, subtext: '' },
  { id: 'air', name: '国际邮包空运【税费自理】', price: 7650, boxFee: 200, subtext: '' },
  { id: 'sf', name: '顺丰大件', price: 18000, boxFee: 200, subtext: '不足4KG将按4KG收费' },
  { id: 'cloth', name: '衣服品类专线', price: 15120, boxFee: 200, subtext: '不足4KG将按4KG收费' },
  { id: 'shoes', name: '鞋子品类专线', price: 15120, boxFee: 200, subtext: '不足4KG将按4KG收费' },
  { id: 'helmet', name: '头盔品类专线', price: 10080, boxFee: 200, subtext: '按个收费' },
  { id: 'doll', name: '玩偶手办模型品类专线', price: 15120, boxFee: 200, subtext: '不足4KG将按4KG收费' },
  { id: 'photo', name: '相纸拍立得品类专线', price: 15120, boxFee: 200, subtext: '不足4KG将按4KG收费' },
];

const getPriceDetails = (methodId: string, option: 'return' | 'abandon') => {
  const method = LOGISTICS_METHODS.find(m => m.id === methodId) || LOGISTICS_METHODS[0];
  const base = method.price;
  const boxFee = method.boxFee;
  const extra = (methodId === 'sea' && option === 'return') ? method.price : 0;
  const discount = 490;
  const total = base + boxFee + extra - discount;
  const rmb = (total * 0.0454).toFixed(2);
  return { base, boxFee, extra, discount, total, rmb };
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>('20260508');
  const [selectedSubId, setSelectedSubId] = useState<string | null>('sub-3-1');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    'proj-001': false,
    '20260508': true
  });
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'tablet'>('mobile');

  // 海运退运方案互动状态
  const [activeMethod, setActiveMethod] = useState<string>('sea');
  const [seaOption, setSeaOption] = useState<'return' | 'abandon'>('return');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [showSeaModal, setShowSeaModal] = useState<boolean>(true);

  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedId);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentStatus = selectedId ? "已选择项目" : "等待选择";

  return (
    <div className="flex h-screen w-full bg-[#f8f9fa] text-[#1a1a1b] font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 flex-shrink-0 bg-white border-r border-[#e9ecef] flex flex-col h-full z-30">
        <div className="p-6 border-bottom border-[#f1f3f5]">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Box className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight">原型中心</span>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-black transition-colors" />
            <input 
              type="text" 
              placeholder="搜索项目..." 
              className="w-full bg-[#f1f3f5] rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            项目列表
          </div>
          {MOCK_PROJECTS.map((project) => (
            <div key={project.id} className="space-y-1">
              <button
                onClick={() => {
                  setSelectedId(project.id);
                  setSelectedSubId(null);
                  toggleExpand(project.id);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all group border ${
                  selectedId === project.id 
                    ? 'bg-black text-white font-medium border-black shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100 border-transparent'
                }`}
              >
                <div className={`p-1 rounded-md ${selectedId === project.id ? 'bg-white/10' : 'bg-gray-100'}`}>
                  {expandedItems[project.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <span className={`block text-[10px] font-semibold tracking-wider uppercase ${selectedId === project.id ? 'text-gray-300' : 'text-gray-400 group-hover:text-black/60'}`}>
                    ID: #{project.id}
                  </span>
                  <p className="font-bold text-sm truncate mt-0.5">{project.name}</p>
                </div>
              </button>

              <AnimatePresence>
                {expandedItems[project.id] && project.subItems && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="ml-4 pl-4 border-l border-gray-100 space-y-1 overflow-hidden"
                  >
                    {project.subItems.map(subItem => (
                      <button
                        key={subItem.id}
                        onClick={() => {
                          setSelectedId(project.id);
                          setSelectedSubId(subItem.id);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors ${
                          selectedSubId === subItem.id 
                            ? 'text-black font-semibold bg-gray-100' 
                            : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        {subItem.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>


      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden bg-white">
        
        {/* Central Spec Panel (Conditional) */}
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ width: 420, opacity: 1, x: 0 }}
              exit={{ width: 0, opacity: 0, x: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="border-r border-[#e9ecef] flex flex-col h-full bg-[#fdfdfd] overflow-hidden"
            >
              <div className="p-8 h-full overflow-y-auto">
                <div className="mb-8">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2 font-medium text-xs tracking-wider uppercase">
                    <BookOpen className="w-4 h-4" />
                    <span>核心设计要点</span>
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight mb-3">{selectedProject.name}</h1>
                  <p className="text-gray-500 leading-relaxed">
                    {selectedProject.description}
                  </p>
                </div>

                <div className="space-y-10">
                  {selectedProject.specs.map((spec, i) => (
                    <section key={i} className="group">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-6 w-1 bg-black rounded-full transition-all group-hover:h-8" />
                        <h3 className="font-bold text-sm uppercase tracking-widest text-[#1a1a1b]">
                          {spec.title}
                        </h3>
                      </div>
                      <div className="pl-4 prose prose-sm text-gray-600 whitespace-pre-wrap leading-relaxed border-l border-gray-100">
                        {spec.content}
                      </div>
                    </section>
                  ))}
                </div>


              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Right Preview Stage */}
        <section className={`flex-1 flex flex-col bg-[#f8f9fa] shadow-inner transition-all relative`}>
          {/* Stage Controls */}
          <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur border-b border-[#e9ecef] px-6 flex items-center justify-between z-10">
            <div className="flex items-center gap-6">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'desktop', icon: Monitor },
                  { id: 'tablet', icon: Tablet },
                  { id: 'mobile', icon: Smartphone }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setViewMode(item.id as any)}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === item.id ? 'bg-white shadow-sm text-black' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
              
              <div className="h-4 w-px bg-gray-200" />
              
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium text-black">
                  {selectedSubId ? MOCK_PROJECTS.find(p => p.id === selectedId)?.subItems?.find(s => s.id === selectedSubId)?.name : '完整预览'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-xs font-semibold">
                <ExternalLink className="w-3.5 h-3.5" />
                在线原型
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/90 transition-colors rounded-full text-xs font-semibold">
                分享规范
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Actual Stage */}
          <div className="flex-1 overflow-auto p-12 flex justify-center items-start">
            {!selectedProject ? (
              <div className="h-full w-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-8 animate-pulse">
                  <Layout className="w-10 h-10 text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold mb-4 italic serif tracking-tight">请选择一个原型开始</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  从左侧列表中浏览项目，查看可直接交付给开发的互动原型和详细技术规范。
                </p>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-4 bg-white border border-gray-100 rounded-xl text-left">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1 tracking-wider">第一步</p>
                    <p className="text-xs font-medium">选择展示项目</p>
                  </div>
                  <div className="p-4 bg-white border border-gray-100 rounded-xl text-left">
                    <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1 tracking-wider">第二步</p>
                    <p className="text-xs font-medium">查阅技术细节</p>
                  </div>
                </div>
              </div>
            ) : (
              <motion.div 
                key={`${selectedId}-${viewMode}`}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`transition-all duration-500 ease-in-out h-full ${
                  viewMode === 'mobile' ? 'w-[375px] max-h-[812px]' : 
                  viewMode === 'tablet' ? 'w-[768px] max-h-[1024px]' : 
                  'w-full max-w-[1280px] h-full'
                }`}
              >
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 h-full overflow-hidden flex flex-col relative group">
                  {/* Status Bar for mobile/tablet */}
                  {viewMode !== 'desktop' && (
                    <div className="h-10 bg-[#f8f9fa] border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
                      <div className="text-[11px] font-bold tracking-tight text-gray-500">9:41 信号 📶</div>
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1 py-0.2 rounded">5G</span>
                        <div className="w-4 h-2.5 bg-black rounded-sm relative"><div className="absolute right-[-1.5px] top-[2.5px] w-[2px] h-[3px] bg-black rounded-sm" /></div>
                      </div>
                    </div>
                  )}

                  {/* Custom Simulated Header */}
                  <div className="h-12 bg-white border-b border-gray-100 flex items-center justify-between px-4 flex-shrink-0">
                    <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                      <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <span className="font-bold text-sm text-gray-800">
                      {selectedId === '20260508' ? '运单详情' : '原型预览'}
                    </span>
                    <div className="w-7 h-7 bg-indigo-50 rounded-full flex items-center justify-center font-bold text-[10px] text-indigo-600">
                      oni
                    </div>
                  </div>

                  {/* Mock Content */}
                  <div className="flex-1 overflow-y-auto relative bg-[#f1f3f5] p-4">
                    {selectedId === '20260508' ? (
                      /* Main Logistics Selection UI */
                      <div className="space-y-4">
                          {/* Inner Card */}
                          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                              <h3 className="font-extrabold text-sm text-gray-800">物流选择</h3>
                              <div className="flex gap-2 text-[10px] text-gray-400 font-medium">
                                <span>包裹三边: 47*34*15</span>
                                <span>•</span>
                                <span>包裹重量: 8913g</span>
                              </div>
                            </div>

                            {/* Logistics Options */}
                            <div className="divide-y divide-gray-100 mt-1">
                              {LOGISTICS_METHODS.map((method) => {
                                const isSelected = activeMethod === method.id;
                                return (
                                  <div key={method.id} className="py-3.5 first:pt-1">
                                    <button
                                      onClick={() => {
                                        setActiveMethod(method.id);
                                        if (method.id === 'sea') {
                                          setShowSeaModal(true);
                                        }
                                      }}
                                      className="w-full flex items-center justify-between text-left group"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="pt-0.5">
                                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                            isSelected ? 'border-[#EF4444] bg-[#EF4444]' : 'border-gray-300'
                                          }`}>
                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-xs font-bold text-gray-850 tracking-tight block">
                                            {method.name}
                                          </span>
                                          {method.subtext && (
                                            <span className="text-[10px] text-gray-450 font-medium block mt-0.5">
                                              {method.subtext}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-xs font-bold text-red-500 block">
                                          {method.price}円 <span className="text-gray-400 font-normal">+{method.boxFee}円箱子费</span>
                                        </span>
                                      </div>
                                    </button>

                                    {/* Embedded Visual Feedback for Special Regulation Sea Options */}
                                    {method.id === 'sea' && isSelected && (
                                      <div className="flex flex-col mt-2 pl-7">
                                        <button
                                          onClick={() => setShowSeaModal(true)}
                                          className="self-start py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[10px] text-amber-800 font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                                        >
                                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                                          已配策略: {seaOption === 'return' ? '📦 【原路寄回】 (+' + LOGISTICS_METHODS.find(m => m.id === 'sea')?.price + '円)' : '🗑 【放弃包裹】 (0円)'} (点击修改)
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Top Warning Explanation Block */}
                          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase tracking-wider">
                              技术细节实现备注
                            </span>
                            <p className="text-[10px] text-gray-500 leading-relaxed">
                              本交互有效防范返程死账垫付问题。选择海运且选择「原路寄回」后，会将「+{LOGISTICS_METHODS.find(m => m.id === 'sea')?.price}円 预收退运运费」实时追加并显示在右下角的“合计费用”中。
                            </p>
                          </div>
                        </div>
                    ) : (
                      /* Standard fallback image content for pre-existing items */
                      <div className="h-full relative overflow-hidden rounded-2xl bg-white border border-gray-200">
                        <img 
                          src={selectedProject.previewUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200'} 
                          alt="Mockup"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/5 cursor-crosshair flex items-center justify-center group">
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-xl flex items-center gap-2">
                            <p className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
                            交互区域
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Simulated bottom payment bar or notification */}
                  {selectedId === '20260508' && selectedSubId === 'sub-3-1' && (
                    <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0 flex items-center justify-between z-20">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] font-medium text-gray-500">合计:</span>
                          <span className="text-sm font-extrabold text-red-500">
                            {getPriceDetails(activeMethod, seaOption).total + 490}円 <span className="text-[9px] font-normal text-gray-400">-490円</span>
                          </span>
                        </div>
                        <span className="text-[9.5px] text-gray-400">
                          约 {getPriceDetails(activeMethod, seaOption).rmb} 人民币
                        </span>
                      </div>

                      {isPaid ? (
                        <button className="px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md">
                          <Check className="w-3.5 h-3.5" />
                          已付款
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            setIsPaid(true);
                            setTimeout(() => setIsPaid(false), 4500);
                          }}
                          className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 active:scale-95 transition-all text-black font-extrabold text-xs rounded-xl shadow-lg shadow-yellow-100"
                        >
                          预存金支付
                        </button>
                      )}
                    </div>
                  )}

                  {/* Bottom Sheet Drawer for Sea Choice */}
                  <AnimatePresence>
                    {showSeaModal && activeMethod === 'sea' && selectedId === '20260508' && selectedSubId === 'sub-3-1' && (
                      <div className="absolute inset-0 z-50 flex flex-col justify-end">
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowSeaModal(false)}
                          className="absolute inset-0 bg-black/60 cursor-pointer"
                        />
                        {/* Drawer Panel */}
                        <motion.div
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          exit={{ y: "100%" }}
                          transition={{ type: "spring", damping: 25, stiffness: 220 }}
                          className="relative bg-white rounded-t-3xl p-5 shadow-2xl border-t border-gray-100 flex flex-col gap-4 z-10 text-left select-none max-h-[85%] overflow-y-auto"
                        >
                          <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-1" />
                          
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-extrabold text-[12px] text-gray-900 leading-snug">日本邮局海运退回额外费用</h4>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                                根据日本邮局规定，针对海运退回有额外费用。为避免包裹出现派送异常产生亏损，请您提前选择包裹无法派送时的处理方案：
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {/* Option A */}
                            <button
                              onClick={() => setSeaOption('return')}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                                seaOption === 'return' ? 'bg-amber-50/50 border-amber-400 shadow-sm' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <input 
                                  type="radio" 
                                  name="sea_option_drawer"
                                  checked={seaOption === 'return'}
                                  onChange={() => setSeaOption('return')}
                                  className="mt-0.5 accent-amber-600"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-xs text-gray-800">📦 【原路寄回】</span>
                                    <span className="text-[10px] font-bold text-red-500">+{LOGISTICS_METHODS.find(m => m.id === 'sea')?.price}円 退运运费</span>
                                  </div>
                                  <p className="text-[9px] text-gray-400 mt-1.5 leading-relaxed">
                                    当包裹因收件人联系不上或未申报等任何导致包裹无法进行配送而需要退回时，需要额外支付一份退运运费。若包裹正常配送，则不产生退运运费，用户可在配送成功提供相关凭证联系客服申请全额退回退运运费。
                                  </p>
                                </div>
                              </div>
                            </button>

                            {/* Option B */}
                            <button
                              onClick={() => setSeaOption('abandon')}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                                seaOption === 'abandon' ? 'bg-amber-50/50 border-amber-400 shadow-sm' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <input 
                                  type="radio" 
                                  name="sea_option_drawer"
                                  checked={seaOption === 'abandon'}
                                  onChange={() => setSeaOption('abandon')}
                                  className="mt-0.5 accent-amber-600"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-xs text-gray-800">🗑 【放弃包裹】</span>
                                    <span className="text-[10px] font-bold text-gray-400">0円 (免费)</span>
                                  </div>
                                  <p className="text-[9px] text-gray-400 mt-1.5 leading-relaxed">
                                    收件地国家邮政官方进行当地销毁，无须原路寄回，亦无须额外支付退运费用。
                                  </p>
                                </div>
                              </div>
                            </button>
                          </div>

                          <button
                            onClick={() => setShowSeaModal(false)}
                            className="mt-2 w-full py-3 bg-black text-white hover:bg-black/90 active:scale-95 transition-all rounded-xl font-bold text-xs shadow-lg"
                          >
                            确定并应用此未妥投方案
                          </button>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Floating Annotation Tag */}
                  <div className="absolute bottom-16 right-4 flex flex-col gap-2 pointer-events-none">
                    <div className="bg-black/95 text-white py-1.5 px-3 rounded-lg rounded-br-none text-[9.5px] font-semibold shadow-md leading-none border border-white/10">
                      视图: {selectedSubId ? selectedProject?.subItems?.find(s => s.id === selectedSubId)?.name : '基础路由'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Canvas Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-300 tracking-[0.2em] uppercase pointer-events-none whitespace-nowrap">
            原型模拟沙盒环境 • v1.0
          </div>
        </section>
      </main>
    </div>
  );
}
