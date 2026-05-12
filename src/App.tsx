/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  ChevronRight, 
  ChevronLeft,
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
  ArrowLeft,
  Copy,
  Camera,
  Upload,
  Image as ImageIcon,
  FileText,
  Layers,
  Plus,
  X,
  Headset
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
  const extra = (['sea', 'air'].includes(methodId) && option === 'return') ? method.price : 0;
  const discount = 490;
  const total = base + boxFee + extra - discount;
  const rmb = (total * 0.0454).toFixed(2);
  return { base, boxFee, extra, discount, total, rmb };
};

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile' | 'tablet'>('desktop');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSpecsCollapsed, setIsSpecsCollapsed] = useState(false);

  // 海运/空运退运方案互动状态
  const [activeMethod, setActiveMethod] = useState<string>('sea');
  const [returnOption, setReturnOption] = useState<'return' | 'abandon'>('return');
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [showReturnModal, setShowReturnModal] = useState<boolean>(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewingPhotoUrl, setViewingPhotoUrl] = useState<string | null>(null);

  // 打包异常图片 state
  const [uploadedPhotos, setUploadedPhotos] = useState<Record<string, boolean>>({});
  const [activeAnomalyMenu, setActiveAnomalyMenu] = useState<string | null>(null);

  const togglePhoto = (id: string, force?: boolean) => {
    setUploadedPhotos(prev => ({
      ...prev,
      [id]: force !== undefined ? force : !prev[id]
    }));
    // If we are deleting, or if we just uploaded, clear the menu
    setActiveAnomalyMenu(null);
  };

  useEffect(() => {
    if (selectedId === '20260508') {
      if (selectedSubId === 'sub-3-1') {
        setShowReturnModal(true);
      } else {
        setShowReturnModal(false);
      }
    }
  }, [selectedId, selectedSubId]);

  // URL state management
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectId = params.get('project');
    if (projectId && MOCK_PROJECTS.some(p => p.id === projectId)) {
      setSelectedId(projectId);
      setExpandedItems(prev => ({ ...prev, [projectId]: true }));
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedId) {
      url.searchParams.set('project', selectedId);
    } else {
      url.searchParams.delete('project');
    }
    window.history.replaceState({}, '', url.toString());
  }, [selectedId]);

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    });
  };

  const selectedProject = MOCK_PROJECTS.find(p => p.id === selectedId);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return MOCK_PROJECTS;
    const lowerQuery = searchQuery.toLowerCase().trim().replace(/^#+/, '');
    
    return MOCK_PROJECTS.filter(project => {
      return (
        project.id.toLowerCase().includes(lowerQuery) ||
        project.name.toLowerCase().includes(lowerQuery) ||
        project.category.toLowerCase().includes(lowerQuery) ||
        project.description.toLowerCase().includes(lowerQuery) ||
        (project.subItems && project.subItems.some(sub => sub.name.toLowerCase().includes(lowerQuery)))
      );
    });
  }, [searchQuery]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const currentStatus = selectedId ? "已选择项目" : "等待选择";

  return (
    <>
      <div className="md:hidden fixed inset-0 z-[100] bg-[#f8f9fa] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-6 text-gray-400">
          <Smartphone className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">请使用大屏设备</h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-[280px]">
          本原型专门为电脑或平板端设计，手机端无法完整展示交互流程，请去电脑或者平板访问。
        </p>
      </div>

      <div className="hidden md:flex h-screen w-full bg-[#f8f9fa] text-[#1a1a1b] font-sans overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-12' : 'w-72'} transition-all duration-300 flex-shrink-0 bg-white border-r border-[#e9ecef] flex flex-col h-full z-30 relative group`}>
          {/* Toggle Button */}
          <button 
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-40 hover:bg-black hover:text-white transition-all transition-colors"
          >
            {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>

          {!isSidebarCollapsed ? (
            <>
              <div className="p-6 border-bottom border-[#f1f3f5]">
                <div 
                  className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => {
                    setSelectedId(null);
                    setSelectedSubId(null);
                  }}
                >
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#f1f3f5] rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  />
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
                <div className="px-3 mb-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  项目列表
                </div>
                {filteredProjects.length === 0 ? (
                  <div className="px-3 py-6 text-center text-xs text-gray-400">
                    未找到匹配的项目
                  </div>
                ) : (
                  filteredProjects.map((project) => (
                    <div key={project.id} className="space-y-1">
                      <div
                        onClick={() => {
                        setSelectedId(project.id);
                        setSelectedSubId(null);
                        toggleExpand(project.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all group border cursor-pointer ${
                        selectedId === project.id 
                          ? 'bg-black text-white font-medium border-black shadow-md' 
                          : 'text-gray-600 hover:bg-gray-100 border-transparent'
                      }`}
                    >
                      <div className={`p-1 rounded-md ${selectedId === project.id ? 'bg-white/10' : 'bg-gray-100'}`}>
                        {expandedItems[project.id] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`block text-[10px] font-semibold tracking-wider uppercase ${selectedId === project.id ? 'text-gray-300' : 'text-gray-400 group-hover:text-black/60'}`}>
                            ID: #{project.id}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(project.id).then(() => {
                                setCopiedId(project.id);
                                setTimeout(() => setCopiedId(null), 2000);
                              });
                            }}
                            className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${selectedId === project.id ? 'hover:bg-white/20 text-white/70 hover:text-white' : 'hover:bg-black/5 text-gray-400 hover:text-gray-700'}`}
                            title="复制 ID"
                          >
                            {copiedId === project.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="font-bold text-sm truncate mt-0.5">{project.name}</p>
                      </div>
                    </div>

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
                )))}
              </nav>
            </>
          ) : (
            <div className="flex flex-col items-center py-10 gap-8">
              <Box className="w-6 h-6 text-black" />
              <div className="flex flex-col gap-4 items-center">
                <div className="w-6 h-px bg-gray-200" />
                <Layout className="w-4 h-4 text-gray-300" />
                <div className="w-6 h-px bg-gray-200" />
              </div>
            </div>
          )}
        </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden bg-white">
        
        {/* Central Spec Panel (Conditional) */}
        <AnimatePresence mode="wait">
          {selectedProject && (
            <motion.div
              initial={{ width: 0, opacity: 0, x: -20 }}
              animate={{ 
                width: isSpecsCollapsed ? 48 : 420, 
                opacity: 1, 
                x: 0 
              }}
              exit={{ width: 0, opacity: 0, x: -20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="border-r border-[#e9ecef] flex flex-col h-full bg-[#fdfdfd] overflow-hidden relative group/spec"
            >
              {/* Toggle Button for Specs */}
              <button 
                onClick={() => setIsSpecsCollapsed(!isSpecsCollapsed)}
                className="absolute right-3 top-20 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm z-40 hover:bg-black hover:text-white transition-all transition-colors"
              >
                {isSpecsCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
              </button>

              {!isSpecsCollapsed ? (
                <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-indigo-600 mb-2 font-medium text-xs tracking-wider uppercase">
                      <BookOpen className="w-4 h-4" />
                      <span>核心设计要点</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-3">{selectedProject.name}</h1>
                    <p className="text-gray-500 leading-relaxed text-sm">
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
                        <div className="pl-4 prose prose-sm text-gray-600 whitespace-pre-wrap leading-relaxed border-l border-gray-100 text-xs">
                          {spec.content}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center py-10 gap-8">
                  <FileText className="w-5 h-5 text-gray-300" />
                  <div className="flex flex-col gap-4 items-center">
                    <div className="w-6 h-px bg-gray-200" />
                    <BookOpen className="w-4 h-4 text-gray-300" />
                    <div className="w-6 h-px bg-gray-200" />
                  </div>
                </div>
              )}
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
              {selectedProject?.redmineUrl ? (
                <a 
                  href={selectedProject.redmineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-full text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  查看redmine链接
                </a>
              ) : (
                <button 
                  disabled
                  title="暂无Redmine链接"
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 cursor-not-allowed rounded-full text-xs font-semibold"
                >
                  <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                  无可查看链接
                </button>
              )}
              <button 
                onClick={handleShareClick}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-black/90 transition-colors rounded-full text-xs font-semibold relative"
              >
                分享
                <ArrowRight className="w-3.5 h-3.5" />
                <AnimatePresence>
                  {showCopyToast && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[10px] px-3 py-1.5 rounded-lg shadow-xl font-normal"
                    >
                      链接已复制
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-solid border-4 border-transparent border-b-black"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
                                        if (['sea', 'air'].includes(method.id)) {
                                          setShowReturnModal(true);
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

                                    {/* Embedded Visual Feedback for Special Regulation Sea/Air Options */}
                                    {['sea', 'air'].includes(method.id) && isSelected && (
                                      <div className="flex flex-col mt-2 pl-7">
                                        <button
                                          onClick={() => setShowReturnModal(true)}
                                          className="self-start py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[10px] text-amber-800 font-bold rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                                        >
                                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                                          已配策略: {returnOption === 'return' ? '📦 【原路寄回】 (+' + LOGISTICS_METHODS.find(m => m.id === method.id)?.price + '円)' : '🗑 【放弃包裹】 (0円)'} (点击修改)
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
                      ) : selectedId === '20260511' ? (
                        <div className="h-full flex flex-col md:flex-row bg-[#f0f2f5] gap-px overflow-hidden">
                          {/* Left Column: Management Backend View - Admin */}
                          <div className="flex-1 overflow-y-auto bg-white p-4 md:p-8 space-y-6">
                            {/* Header Section */}
                            <div className="bg-white pb-4 flex items-center justify-between border-b border-gray-200">
                              <h2 className="text-base font-bold text-gray-800">管理端后台预览</h2>
                              <div className="flex gap-2">
                                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded border border-blue-100 uppercase">Admin Role</span>
                                <span className="bg-gray-50 text-gray-400 text-[10px] font-bold px-2 py-1 rounded border border-gray-100">Live Editing</span>
                              </div>
                            </div>

                            {/* Surcharge Table */}
                            <div className="bg-white border-x border-t border-gray-200 rounded-lg overflow-hidden shadow-sm">
                              <table className="w-full text-center text-xs">
                                <thead className="bg-[#f5f7fa]">
                                  <tr className="border-b border-gray-200">
                                    <th className="py-3 font-bold text-gray-600 w-1/4 border-r border-gray-200 uppercase tracking-wider">附加项名称</th>
                                    <th className="py-3 font-bold text-gray-600 w-1/4 border-r border-gray-200 uppercase tracking-wider">数量</th>
                                    <th className="py-3 font-bold text-gray-600 w-1/4 border-r border-gray-200 uppercase tracking-wider">单位</th>
                                    <th className="py-3 font-bold text-gray-600 w-1/4 uppercase tracking-wider">附加项金额</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className="border-b border-gray-200 h-16">
                                    <td colSpan={4} className="text-gray-400 font-medium italic">空数据占位符</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            {/* Form Section */}
                            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden shadow-sm">
                              <div className="p-4 grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-3 text-xs font-black text-gray-600 bg-gray-50 py-3 border border-gray-200 rounded-lg text-center">
                                  用户申请备注
                                </div>
                                <div className="col-span-9">
                                  <input 
                                    type="text" 
                                    disabled
                                    placeholder="请不要拆商品原包装，快递包装随意哦" 
                                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-xs focus:outline-none bg-gray-50 font-medium italic"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Packing Images Section */}
                            <div className="bg-[#f5f7fa] p-6 border border-gray-200 rounded-xl space-y-8 shadow-inner">
                              <div className="space-y-4">
                                <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                  <ImageIcon className="w-4 h-4 text-gray-400" />
                                  标准打包图 (必填):
                                </div>
                                <div className="flex flex-wrap gap-4">
                                  <div 
                                    onClick={() => togglePhoto('standard-1')}
                                    className="w-24 h-24 bg-white border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group overflow-hidden shadow-sm"
                                  >
                                    {uploadedPhotos['standard-1'] ? (
                                      <div className="relative w-full h-full">
                                        <img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaad21?w=200" className="w-full h-full object-cover" />
                                        <div 
                                          onClick={(e) => { e.stopPropagation(); togglePhoto('standard-1'); }}
                                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                          <X className="w-3 h-3" />
                                        </div>
                                      </div>
                                    ) : (
                                      <>
                                        <Camera className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                                        <span className="text-[9px] text-gray-400 font-medium text-center px-2">点击拍照/上传图片</span>
                                      </>
                                    )}
                                  </div>
                                  <div className="w-24 h-24 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 text-gray-400 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-all">
                                    <Plus className="w-5 h-5" />
                                    <span className="text-[9px]">添加更多</span>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-4 pt-4 border-t border-gray-200/60">
                                <div className="text-xs font-bold text-red-600 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  异常处理附件 (如遇异常按需拍照):
                                </div>
                                <div className="flex flex-wrap gap-4 items-start">
                                  {[
                                    { id: 'takeout', label: '取出', img: 'https://images.unsplash.com/photo-1586528116311-ad86d738111e?w=400' },
                                    { id: 'split', label: '拆分', img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=400' },
                                    { id: 'discard', label: '丢弃', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400' },
                                    { id: 'damage', label: '破损', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400' }
                                  ].map((opt) => {
                                    const hasPhoto = uploadedPhotos[opt.id];
                                    const isMenuOpen = activeAnomalyMenu === opt.id;
                                    
                                    return (
                                      <div key={opt.id} className="flex flex-col gap-3 relative">
                                        {isMenuOpen && !hasPhoto ? (
                                          <div className="flex flex-col gap-2 p-2 bg-white border border-red-500 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200 z-10">
                                            <button 
                                              onClick={() => togglePhoto(opt.id, true)}
                                              className="px-4 py-2 bg-black text-white text-[10px] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-black/90 active:scale-95 transition-all"
                                            >
                                              <Camera className="w-3.5 h-3.5" />
                                              拍照
                                            </button>
                                            <button 
                                              onClick={() => togglePhoto(opt.id, true)}
                                              className="px-4 py-2 bg-gray-100 text-gray-900 text-[10px] font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 active:scale-95 transition-all"
                                            >
                                              <Upload className="w-3.5 h-3.5" />
                                              上传
                                            </button>
                                            <button 
                                              onClick={() => setActiveAnomalyMenu(null)}
                                              className="mt-1 text-[9px] text-gray-400 hover:text-gray-600 font-bold"
                                            >
                                              取消
                                            </button>
                                          </div>
                                        ) : (
                                          <button 
                                            onClick={() => {
                                              if (!hasPhoto) {
                                                setActiveAnomalyMenu(opt.id);
                                              }
                                            }}
                                            disabled={hasPhoto}
                                            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all border flex items-center gap-2 shadow-sm ${
                                              hasPhoto 
                                                ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-200 ring-2 ring-emerald-100' 
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-red-500 hover:text-red-600 hover:shadow-md'
                                            } disabled:cursor-default`}
                                          >
                                            {hasPhoto ? <Check className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
                                            {opt.label}{hasPhoto ? '已上传' : ''}
                                          </button>
                                        )}
                                        
                                        {hasPhoto && (
                                          <div className="relative group self-center animate-in scale-in-90 duration-200">
                                            <div className="w-32 h-24 bg-white border-2 border-emerald-500/20 rounded-xl overflow-hidden shadow-lg group-hover:border-emerald-500/40 transition-all">
                                              <img src={opt.img} className="w-full h-full object-cover" alt={opt.label} />
                                            </div>
                                            <div className="absolute top-1.5 right-1.5 flex gap-1">
                                              <button 
                                                onClick={() => togglePhoto(opt.id, false)}
                                                className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg shadow-red-200 transition-all active:scale-90"
                                              >
                                                <X className="w-3 h-3" />
                                              </button>
                                            </div>
                                            <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-[2px] py-1 px-2 border-t border-white/10">
                                              <p className="text-[8px] text-white font-bold text-center tracking-wider">{opt.label}存证照</p>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Right Column: APP User Preview View - App */}
                          <div className="w-[440px] flex-shrink-0 bg-gray-100 border-l border-gray-200 flex flex-col h-full">
                            <div className="h-14 bg-white border-b border-gray-200 px-6 flex items-center justify-between flex-shrink-0">
                              <span className="text-sm font-black text-gray-800 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-pink-500" />
                                用户端 APP 预览
                              </span>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" />
                                <div className="w-2 h-2 bg-pink-200 rounded-full" />
                              </div>
                            </div>

                            <div className="flex-1 overflow-y-auto flex flex-col items-center py-4 bg-gray-50/50">
                              <div className="w-[375px] space-y-3 pb-8">
                                {/* Shipping Label Info */}
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mx-3">
                                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                                    <h3 className="text-sm font-bold text-gray-800">面单信息</h3>
                                    <div className="flex items-center gap-1 text-[11px] text-pink-500 font-medium">
                                      查看全部 <ChevronRight className="w-3.5 h-3.5" />
                                    </div>
                                  </div>
                                  <div className="p-4 space-y-3 relative">
                                    <div className="space-y-1">
                                      <p className="text-[11px] text-gray-500 leading-none font-medium">品类: 未知品类/未知商品 / 数量: 1</p>
                                    </div>
                                    <div className="space-y-1">
                                      <p className="text-[11px] text-gray-500 leading-none font-medium">品类: 未知品类/未知商品 / 数量: 1</p>
                                    </div>
                                    <div className="absolute right-4 bottom-4 w-10 h-10 bg-white shadow-xl rounded-full border border-pink-100 flex items-center justify-center text-pink-500">
                                      <Headset className="w-5 h-5" />
                                    </div>
                                  </div>
                                </div>

                                {/* Outbound Labels */}
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mx-3">
                                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                                    <h3 className="text-sm font-bold text-gray-800">出库标签 <span className="text-[11px] text-pink-400 font-normal ml-1">已选择3个标签</span></h3>
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  </div>
                                  <div className="p-5 flex flex-wrap gap-2.5 justify-center">
                                    <div className="px-4 py-1.5 rounded-full border border-pink-300 text-[10px] text-pink-500 bg-pink-50/30 font-bold">
                                      控制重量和体积重 (500G内)
                                    </div>
                                    <div className="px-6 py-1.5 rounded-full border border-gray-300 text-[10px] text-gray-500 bg-white font-bold">
                                      不要弯折
                                    </div>
                                    <div className="px-8 py-1.5 rounded-full border border-pink-300 text-[10px] text-pink-500 bg-pink-50/30 font-bold">
                                      请按顺丰规格打包
                                    </div>
                                  </div>
                                </div>

                                {/* Packing Images Carousel */}
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mx-3">
                                  <div className="p-4 flex items-center justify-between border-b border-gray-50">
                                    <h3 className="text-sm font-bold text-gray-800">出库平铺图</h3>
                                    <div className="flex items-center gap-1 text-[11px] text-pink-500 font-medium">
                                      查看全部 <ChevronRight className="w-3.5 h-3.5" />
                                    </div>
                                  </div>
                                  <div className="p-0 relative group">
                                    <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
                                      <img src="https://images.unsplash.com/photo-1586528116311-ad86d738111e?w=800" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute left-4 bottom-4 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-sm text-[10px] text-white font-mono">1/4</div>
                                  </div>
                                </div>

                                {/* 包裹其他相关 Section */}
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mx-3">
                                  <div className="p-3.5 flex items-center justify-between border-b border-gray-50">
                                    <h3 className="text-sm font-bold text-gray-800">包裹其他相关</h3>
                                    <HelpCircle className="w-3.5 h-3.5 text-gray-300" />
                                  </div>
                                  <div className="p-4 flex flex-col gap-4">
                                    {[
                                      { id: 'takeout', label: '取出', img: 'https://images.unsplash.com/photo-1586528116311-ad86d738111e?w=800' },
                                      { id: 'split', label: '拆分', img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800' },
                                      { id: 'discard', label: '丢弃', img: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800' },
                                      { id: 'damage', label: '破损', img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800' }
                                    ].map((opt) => {
                                      const hasPhoto = uploadedPhotos[opt.id];
                                      return (
                                        <div key={opt.id} className="space-y-2">
                                          <button
                                            onClick={() => { if (hasPhoto) setViewingPhotoUrl(opt.img); }}
                                            className={`w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl text-[11px] font-black transition-all shadow-sm active:scale-95 border ${
                                              hasPhoto 
                                                ? 'bg-red-500 border-red-600 text-white shadow-red-200 animate-pulse-slow' 
                                                : 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-100'
                                            }`}
                                          >
                                            {hasPhoto ? '有' : '无'}{opt.label}
                                          </button>
                                          {hasPhoto && (
                                            <div 
                                              className="rounded-xl overflow-hidden border border-red-100 shadow-sm transition-all animate-in fade-in slide-in-from-top-2 duration-300 cursor-pointer"
                                              onClick={() => setViewingPhotoUrl(opt.img)}
                                            >
                                              <img 
                                                src={opt.img} 
                                                className="w-full h-auto object-cover max-h-48"
                                                alt={`${opt.label}存证图`}
                                              />
                                              <div className="bg-red-50 py-1.5 px-3 flex items-center justify-between">
                                                <span className="text-[10px] text-red-600 font-bold">{opt.label}情况存证照片</span>
                                                <ChevronRight className="w-3 h-3 text-red-300" />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Grouped Items List */}
                                <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mx-3">
                                  <div className="p-4 flex items-center gap-2 border-b border-gray-50">
                                    <div className="w-1.5 h-4 bg-blue-500 rounded-full" />
                                    <h3 className="text-sm font-bold text-gray-800">参与当前拼邮的商品(9件)</h3>
                                  </div>
                                  <div className="p-8 flex flex-col items-center gap-4">
                                    <div className="relative">
                                      <div className="w-16 h-16 rounded-full border-2 border-white shadow-lg overflow-hidden ring-4 ring-gray-50">
                                        <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200" className="w-full h-full object-cover" alt="Item" />
                                      </div>
                                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center">
                                        <Sparkles className="w-2.5 h-2.5 text-white" />
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-gray-400 font-bold cursor-pointer hover:text-gray-600">
                                      点击展开商品详情 <ChevronDown className="w-3.5 h-3.5" />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
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
                  {selectedId === '20260508' && (!selectedSubId || selectedSubId === 'sub-3-1') && (
                    <div className="p-4 bg-white border-t border-gray-100 flex-shrink-0 flex items-center justify-between z-20">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-[10px] font-medium text-gray-500">合计:</span>
                          <span className="text-sm font-extrabold text-red-500">
                            {getPriceDetails(activeMethod, returnOption).total + 490}円 <span className="text-[9px] font-normal text-gray-400">-490円</span>
                          </span>
                        </div>
                        <span className="text-[9.5px] text-gray-400">
                          约 {getPriceDetails(activeMethod, returnOption).rmb} 人民币
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

                  {/* Bottom Sheet Drawer for Sea/Air Choice */}
                  <AnimatePresence>
                    {showReturnModal && ['sea', 'air'].includes(activeMethod) && selectedId === '20260508' && (!selectedSubId || selectedSubId === 'sub-3-1') && (
                      <div className="absolute inset-0 z-50 flex flex-col justify-end">
                        {/* Backdrop */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 0.5 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowReturnModal(false)}
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
                                <h4 className="font-extrabold text-[12px] text-gray-900 leading-snug">日本邮局{activeMethod === 'sea' ? '海运' : '空运'}退回额外费用</h4>
                              </div>
                              <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                                根据日本邮局规定，针对{activeMethod === 'sea' ? '海运' : '空运'}退回有额外费用。为避免包裹出现派送异常产生亏损，请您提前选择包裹无法派送时的处理方案：
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2.5">
                            {/* Option A */}
                            <button
                              onClick={() => setReturnOption('return')}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                                returnOption === 'return' ? 'bg-amber-50/50 border-amber-400 shadow-sm' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <input 
                                  type="radio" 
                                  name="return_option_drawer"
                                  checked={returnOption === 'return'}
                                  onChange={() => setReturnOption('return')}
                                  className="mt-0.5 accent-amber-600"
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex justify-between items-center">
                                    <span className="font-extrabold text-xs text-gray-800">📦 【原路寄回】</span>
                                    <span className="text-[10px] font-bold text-red-500">+{LOGISTICS_METHODS.find(m => m.id === activeMethod)?.price}円 退运运费</span>
                                  </div>
                                  <p className="text-[9px] text-gray-400 mt-1.5 leading-relaxed">
                                    当包裹因收件人联系不上或未申报等任何导致包裹无法进行配送而需要退回时，需要额外支付一份退运运费。若包裹正常配送，则不产生退运运费，用户可在配送成功提供相关凭证联系客服申请全额退回退运运费。
                                  </p>
                                </div>
                              </div>
                            </button>

                            {/* Option B */}
                            <button
                              onClick={() => setReturnOption('abandon')}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                                returnOption === 'abandon' ? 'bg-amber-50/50 border-amber-400 shadow-sm' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start gap-2.5">
                                <input 
                                  type="radio" 
                                  name="return_option_drawer"
                                  checked={returnOption === 'abandon'}
                                  onChange={() => setReturnOption('abandon')}
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
                            onClick={() => setShowReturnModal(false)}
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

      {/* User Side Packing Photo Viewer Modal */}
      {viewingPhotoUrl && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setViewingPhotoUrl(null)}
        >
          <div 
            className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={() => setViewingPhotoUrl(null)}
              className="absolute top-4 right-4 p-2 bg-black/10 hover:bg-black/20 text-gray-800 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full aspect-square bg-gray-100">
              <img 
                src={viewingPhotoUrl} 
                className="w-full h-full object-cover" 
                alt="Viewing Photo" 
              />
            </div>
            <div className="p-6 bg-white">
              <h4 className="text-sm font-bold text-gray-900 mb-2">打包异常存证图片</h4>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                这是仓库打包员在处理您的包裹时拍摄的异常证据照片。您可以点击图片放大查看，如有异议请联系在线客服。
              </p>
              <button 
                onClick={() => setViewingPhotoUrl(null)}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg active:scale-[0.98] transition-all"
              >
                确认并返回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
