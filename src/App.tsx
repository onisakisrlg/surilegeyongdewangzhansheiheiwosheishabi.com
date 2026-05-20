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
  Headset,
  RotateCcw,
  Maximize2,
  Languages,
  User,
  Home,
  Users,
  ShoppingCart,
  Gavel,
  Warehouse,
  PackageCheck,
  ClipboardList,
  MoreHorizontal,
  Settings,
  Wrench,
  Smile,
  History,
  Package,
  Mail
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

// --- Custom SVGs for Products (To avoid network failures and match images perfectly) ---
const CarsCupSvg = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 rounded-md bg-red-50 border border-red-100 p-1 shadow-sm shrink-0">
    <rect x="0" y="0" width="100" height="100" fill="#fee2e2" rx="6" />
    <rect x="25" y="20" width="45" height="60" rx="10" fill="#ef4444" stroke="#dc2626" strokeWidth="2.5" />
    <path d="M 70 30 C 85 30, 85 70, 70 70" fill="none" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
    <path d="M 70 30 C 85 30, 85 70, 70 70" fill="none" stroke="#fee2e2" strokeWidth="2" strokeLinecap="round" />
    <polygon points="40,30 55,48 45,48 53,65 38,45 48,45" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />
    <ellipse cx="47.5" cy="20" rx="22.5" ry="4" fill="#b91c1c" />
    <line x1="28" y1="72" x2="68" y2="72" stroke="#fbbf24" strokeWidth="3" />
    <line x1="28" y1="76" x2="68" y2="76" stroke="#fbbf24" strokeWidth="1.5" />
  </svg>
);

const ExerciseBandsSvg = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 rounded-md bg-cyan-50 border border-cyan-100 p-1 shadow-sm shrink-0">
    <rect x="0" y="0" width="100" height="100" fill="#ecfeff" rx="6" />
    <rect x="15" y="22" width="70" height="14" rx="3" fill="#06b6d4" stroke="#0891b2" strokeWidth="1.5" />
    <line x1="25" y1="29" x2="75" y2="29" stroke="#22d3ee" strokeWidth="3" strokeDasharray="4 2" />
    <rect x="15" y="43" width="70" height="14" rx="3" fill="#4b5563" stroke="#374151" strokeWidth="1.5" />
    <line x1="25" y1="50" x2="75" y2="50" stroke="#9ca3af" strokeWidth="3" strokeDasharray="4 2" />
    <rect x="15" y="64" width="70" height="14" rx="3" fill="#84cc16" stroke="#65a30d" strokeWidth="1.5" />
    <line x1="25" y1="71" x2="75" y2="71" stroke="#a3e635" strokeWidth="3" strokeDasharray="4 2" />
    <rect x="42" y="26" width="16" height="6" fill="#fff" rx="1" opacity="0.9" />
    <text x="50" y="31" fontSize="5" fontWeight="bold" fill="#0891b2" textAnchor="middle">VRTX</text>
    <rect x="42" y="47" width="16" height="6" fill="#fff" rx="1" opacity="0.9" />
    <text x="50" y="52" fontSize="5" fontWeight="bold" fill="#374151" textAnchor="middle">VRTX</text>
    <rect x="42" y="68" width="16" height="6" fill="#fff" rx="1" opacity="0.9" />
    <text x="50" y="73" fontSize="5" fontWeight="bold" fill="#65a30d" textAnchor="middle">VRTX</text>
  </svg>
);

const PawKeychainSvg = () => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 rounded-md bg-blue-900 border border-blue-950 p-1 shadow-sm shrink-0">
    <rect x="0" y="0" width="100" height="100" fill="#1e3a8a" rx="6" />
    <path d="M0,0 C30,40 70,20 100,100" stroke="#1d4ed8" strokeWidth="15" fill="none" opacity="0.3" />
    <circle cx="50" cy="22" r="10" fill="none" stroke="#cbd5e1" strokeWidth="3.5" />
    <ellipse cx="50" cy="35" rx="3" ry="6" fill="none" stroke="#94a3b8" strokeWidth="2.5" />
    <circle cx="50" cy="58" r="22" fill="#b91c1c" stroke="#dc2626" strokeWidth="1.5" />
    <circle cx="50" cy="58" r="19" fill="none" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 1.5" />
    <path d="M50,56 C45,56 42,60 42,66 C42,70 45,72 50,72 C55,72 58,70 58,66 C58,60 55,56 50,56 Z" fill="#450a0a" />
    <circle cx="41" cy="51" r="3.5" fill="#450a0a" />
    <circle cx="47" cy="46" r="3.5" fill="#450a0a" />
    <circle cx="53" cy="46" r="3.5" fill="#450a0a" />
    <circle cx="59" cy="51" r="3.5" fill="#450a0a" />
  </svg>
);

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

  // 20260515 Project States
  const [editBoxType, setEditBoxType] = useState<'normal' | 'high' | null>(null);
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [boxCode, setBoxCode] = useState('DD-00000001');
  const [vipBoxCode, setVipBoxCode] = useState('GJ-00000001');
  const [tempBoxCode, setTempBoxCode] = useState('DD-00000001');
  const [tempVipBoxCode, setTempVipBoxCode] = useState('GJ-00000001');
  const [boxError, setBoxError] = useState<string | null>(null);
  const [vipBoxError, setVipBoxError] = useState<string | null>(null);

  const handleIncrementNormal = (codeVal: string, isTemp: boolean) => {
    const code = codeVal.trim().toUpperCase();
    const match = code.match(/^([A-Z]{2})-(\d+)$/);
    if (match) {
      const prefix = match[1];
      const num = parseInt(match[2], 10) + 1;
      const padded = String(num).padStart(match[2].length, '0');
      const newVal = `${prefix}-${padded}`;
      if (isTemp) {
        setTempBoxCode(newVal);
        setBoxError(null);
      } else {
        setBoxCode(newVal);
      }
    } else {
      if (isTemp) {
        setTempBoxCode("DD-00000001");
      } else {
        setBoxCode("DD-00000001");
      }
    }
  };

  const handleIncrementVip = (codeVal: string, isTemp: boolean) => {
    const code = codeVal.trim().toUpperCase();
    const match = code.match(/^(GJ)-(\d+)$/);
    if (match) {
      const prefix = match[1];
      const num = parseInt(match[2], 10) + 1;
      const padded = String(num).padStart(match[2].length, '0');
      const newVal = `${prefix}-${padded}`;
      if (isTemp) {
        setTempVipBoxCode(newVal);
        setVipBoxError(null);
      } else {
        setVipBoxCode(newVal);
      }
    } else {
      if (isTemp) {
        setTempVipBoxCode("GJ-00000001");
      } else {
        setVipBoxCode("GJ-00000001");
      }
    }
  };

  const handleSaveBoxes = () => {
    if (editBoxType === 'normal') {
      const normVal = tempBoxCode.trim().toUpperCase();
      const normalOk = /^(DD|XX)-\d+$/i.test(normVal);
      if (!normalOk) {
        setBoxError("普通流转箱编码必须以 DD- 或 XX- 开头，后接数字编号，例如: DD-00000001");
        return;
      }
      setBoxError(null);
      setBoxCode(normVal);
      setEditBoxType(null);
    } else if (editBoxType === 'high') {
      const vipVal = tempVipBoxCode.trim().toUpperCase();
      const vipOk = /^GJ-\d+$/i.test(vipVal);
      if (!vipOk) {
        setVipBoxError("高价流转箱编码必须以 GJ- 开头，后接数字编号，例如: GJ-00000001");
        return;
      }
      setVipBoxError(null);
      setVipBoxCode(vipVal);
      setEditBoxType(null);
    } else {
      const normVal = tempBoxCode.trim().toUpperCase();
      const vipVal = tempVipBoxCode.trim().toUpperCase();
      
      const normalOk = /^(DD|XX)-\d+$/i.test(normVal);
      const vipOk = /^GJ-\d+$/i.test(vipVal);
      
      let hasError = false;
      if (!normalOk) {
        setBoxError("普通流转箱编码必须以 DD- 或 XX- 开头，后接数字编号，例如: DD-00000001");
        hasError = true;
      } else {
        setBoxError(null);
      }
      
      if (!vipOk) {
        setVipBoxError("高价流转箱编码必须以 GJ- 开头，后接数字编号，例如: GJ-00000001");
        hasError = true;
      } else {
        setVipBoxError(null);
      }
      
      if (hasError) return;
      
      setBoxCode(normVal);
      setVipBoxCode(vipVal);
      setShowBoxModal(false);
    }
  };

  const [isIssueOrder, setIsIssueOrder] = useState(false);
  const [isWithBox, setIsWithBox] = useState(false);
  const [isCC, setIsCC] = useState(false);
  const [selectedInboundOrder, setSelectedInboundOrder] = useState<any | null>(null);
  const [inboundRecords, setInboundRecords] = useState<any[]>([
    {
      id: "RK-202605190412",
      operator: "入库员02",
      productMid: "m12891249121",
      productName: "【限定販売】携帯用ミニ扇風機 ハンディファン 静音",
      productImage: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=100",
      inboundImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=100",
      memberId: "18620-1669803006",
      trackingCode: "YT-2038917823",
      codAmount: 0,
      weight: 124,
      boxCode: "RY-00000312",
      isIssueOrder: false,
      isWithBox: true,
      isCC: false,
      timestamp: "2026-05-19 14:20:11"
    }
  ]);
  const [inboundWeight, setInboundWeight] = useState<string>("320");
  const [inboundShelf, setInboundShelf] = useState<string>("A-04-12");
  const [inboundTracking, setInboundTracking] = useState<string>("");
  const [codAmountState, setCodAmountState] = useState<string>("0");
  const [inboundSuccessAnim, setInboundSuccessAnim] = useState<boolean>(false);
  const [weightAutoSuccess, setWeightAutoSuccess] = useState<boolean>(false);
  const [inboundQty, setInboundQty] = useState<string>("");
  const [inboundNote, setInboundNote] = useState<string>("");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showEditTracking, setShowEditTracking] = useState<boolean>(false);

  const [boxNotification, setBoxNotification] = useState<{ show: boolean; text: string; type: 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (boxNotification?.show) {
      const timer = setTimeout(() => {
        setBoxNotification(prev => prev ? { ...prev, show: false } : null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [boxNotification]);

  const handleToggleWithBox = () => {
    const newVal = !isWithBox;
    setIsWithBox(newVal);
    setBoxNotification({
      show: true,
      text: newVal 
        ? "【含箱提示】已开启带箱入库模式：系统将在计费中额外追加含箱重量资费计算。" 
        : "【含箱提示】已关闭带箱入库模式：系统将复原正常商品净重计费模式。",
      type: newVal ? 'success' : 'info'
    });
  };

  // Quick photograph on Space or Enter key during Step 2
  useEffect(() => {
    if (!selectedInboundOrder) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === "INPUT" || activeEl.tagName === "TEXTAREA" || activeEl.getAttribute("contenteditable") === "true")) {
        return;
      }

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setWeightAutoSuccess(true);
        setCapturedPhoto("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400");
        setTimeout(() => setWeightAutoSuccess(false), 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedInboundOrder]);

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
                                          <div
                                            className={`w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl text-[11px] font-black transition-all shadow-sm border ${
                                              hasPhoto 
                                                ? 'bg-red-500 border-red-600 text-white shadow-red-200 animate-pulse-slow' 
                                                : 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-100'
                                            }`}
                                          >
                                            {hasPhoto ? '有' : '无'}{opt.label}
                                          </div>
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
                      ) : selectedId === '20260515' ? (
                        /* Rakutao Management System Reconstruction */
                        <div className="h-full flex bg-[#001529] text-gray-300 font-sans overflow-hidden">
                          {/* Sidebar */}
                          <aside className="w-48 flex-shrink-0 flex flex-col h-full bg-[#001529]">
                            {/* Logo */}
                            <div className="h-12 bg-[#ff4d4f] flex items-center px-4 gap-2 shrink-0">
                              <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                                <Box className="w-4 h-4 text-[#ff4d4f]" />
                              </div>
                              <span className="text-white font-bold text-[13px] truncate">Rakutao管理端 V1.3.93</span>
                            </div>

                            {/* Nav Menu */}
                            <div className="flex-1 overflow-y-auto pt-2 custom-scrollbar">
                              <div className="px-4 py-3 flex items-center gap-3 hover:bg-white/5 cursor-pointer text-sm">
                                <Home className="w-4 h-4" />
                                <span>首页</span>
                              </div>
                              
                              <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-sm group">
                                <div className="flex items-center gap-3">
                                  <Users className="w-4 h-4" />
                                  <span>会员管理</span>
                                </div>
                                <ChevronDown className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                              </div>

                              <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-sm group">
                                <div className="flex items-center gap-3">
                                  <ShoppingCart className="w-4 h-4" />
                                  <span className="flex items-center gap-1">
                                    订单管理
                                    <div className="w-1.5 h-1.5 bg-[#ff4d4f] rounded-full" />
                                  </span>
                                </div>
                                <ChevronDown className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                              </div>

                              <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-sm group">
                                <div className="flex items-center gap-3">
                                  <Gavel className="w-4 h-4" />
                                  <span>拍卖订单</span>
                                </div>
                                <ChevronDown className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                              </div>

                              {/* Expanded Section: 仓储管理 */}
                              <div className="bg-black/20">
                                <div className="px-4 py-3 flex items-center justify-between hover:bg-white/5 cursor-pointer text-sm group text-[#1890ff] bg-[#1890ff]/10">
                                  <div className="flex items-center gap-3 font-medium">
                                    <Warehouse className="w-4 h-4" />
                                    <span>仓储管理</span>
                                  </div>
                                  <ChevronDown className="w-3 h-3 rotate-180" />
                                </div>
                                
                                <div className="py-1">
                                  {[
                                    { name: '包裹到仓验收', active: false },
                                    { name: '仓储入库', active: false },
                                    { name: '仓储列表', active: false },
                                    { name: '仓储入库(2.0)', active: true },
                                    { name: '入库编号设置', active: false },
                                    { name: '入库工单', active: false, badge: '99+' },
                                    { name: '入库上架分析', active: false },
                                  ].map((opt, i) => (
                                    <div 
                                      key={i} 
                                      className={`pl-11 py-2.5 flex items-center justify-between text-[11.5px] cursor-pointer transition-colors ${
                                        opt.active ? 'text-white bg-[#1890ff]' : 'text-gray-400 hover:text-white'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        {opt.name === '包裹到仓验收' && <ChevronRight className="w-3 h-3 -ml-5" />}
                                        {opt.name === '仓储入库' && <ClipboardList className="w-3.5 h-3.5 -ml-6" />}
                                        {opt.name === '仓储列表' && <Box className="w-3.5 h-3.5 -ml-6" />}
                                        {opt.name === '仓储入库(2.0)' && <Layout className="w-3.5 h-3.5 -ml-6" />}
                                        {opt.name === '入库编号设置' && <Settings className="w-3.5 h-3.5 -ml-6" />}
                                        {opt.name === '入库工单' && <Wrench className="w-3.5 h-3.5 -ml-6" />}
                                        {opt.name === '入库上架分析' && <History className="w-3.5 h-3.5 -ml-6" />}
                                        <span>{opt.name}</span>
                                      </div>
                                      {opt.badge && (
                                        <span className="bg-[#ffbb96] text-[#c41d7f] text-[9px] font-bold px-1 rounded mr-4">
                                          {opt.badge}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </aside>

                          {/* Main Content Pane */}
                          <div className="flex-1 flex flex-col bg-[#f0f2f5] overflow-hidden relative">
                            {/* Floating Custom Notification / Toast */}
                            <AnimatePresence>
                              {boxNotification?.show && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
                                  animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10, x: "-50%" }}
                                  className="absolute top-4 left-1/2 z-50 pointer-events-auto bg-[#e6f7ff] border border-[#91d5ff] rounded-lg shadow-lg px-4 py-2.5 flex items-center gap-3 max-w-md"
                                >
                                  <div className="bg-[#1890ff] text-white p-1 rounded">
                                    <Package className="w-4 h-4" />
                                  </div>
                                  <div className="text-left">
                                    <div className="text-xs text-[#0050b3] font-bold leading-normal">带箱状态变更提示</div>
                                    <div className="text-[10.5px] text-gray-700 font-medium leading-normal mt-0.5">{boxNotification.text}</div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Content Header (Toolbar) */}
                            <div className="h-12 bg-white flex items-center justify-between px-4 shrink-0 shadow-sm z-10">
                              <div className="flex items-center gap-4">
                                <Menu className="w-4 h-4 text-gray-500 cursor-pointer" />
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>首页</span>
                                  <span className="text-gray-300">/</span>
                                  <span>仓储管理</span>
                                  <span className="text-gray-300">/</span>
                                  <span className="text-gray-400">仓储入库(2.0)</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-5 text-gray-500">
                                <Search className="w-4 h-4 cursor-pointer hover:text-black" />
                                <Maximize2 className="w-4 h-4 cursor-pointer hover:text-black" />
                                <Languages className="w-4 h-4 cursor-pointer hover:text-black" />
                                <Smile className="w-4 h-4 cursor-pointer hover:text-black" />
                              </div>
                            </div>

                            {/* Tabs Bar */}
                            <div className="flex bg-white border-t border-gray-100 px-3 pt-2 shrink-0 overflow-x-auto gap-0.5 z-10">
                              <div className="px-3 py-1.5 text-xs text-gray-400 border border-gray-100 border-b-0 rounded-t cursor-pointer hover:bg-gray-50 bg-white">
                                首页
                              </div>
                              <div className="px-3 py-1.5 text-xs text-[#52c41a] font-medium border border-gray-100 border-b-0 rounded-t bg-[#f6ffed] flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#52c41a] rounded-full" />
                                仓储入库(2.0)
                                <X className="w-3 h-3 hover:bg-[#52c41a]/10 rounded" />
                              </div>
                            </div>

                            {/* Floating Buttons */}
                            <div className="absolute top-[108px] right-8 z-30 pointer-events-none flex flex-col gap-3">
                              {/* 高价流转箱 - 置于最上 (红色加粗，无文本描述，点击单独输入) */}
                              <button 
                                onClick={() => {
                                  setTempVipBoxCode(vipBoxCode);
                                  setVipBoxError(null);
                                  setEditBoxType('high');
                                }}
                                className="bg-red-50 border-2 border-red-500 text-red-600 px-3 py-2.5 rounded-xl flex flex-col items-center justify-center min-w-[84px] shadow-md pointer-events-auto active:scale-95 transition-all text-xs font-black relative cursor-pointer select-none"
                                title="高价流转箱：点击单独修改编码"
                              >
                                <Sparkles className="w-4 h-4 mb-1 text-red-550" />
                                <span className="text-[12px] font-black tracking-wider leading-none mt-0.5">{vipBoxCode || 'GJ-00000001'}</span>
                                {isCC && !isIssueOrder && (
                                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                  </span>
                                )}
                              </button>

                              {/* 设为问题 (Action Button) */}
                              <button 
                                onClick={() => setIsIssueOrder(!isIssueOrder)}
                                className={`${isIssueOrder ? 'bg-[#ff4d4f] scale-105 shadow-red-200' : 'bg-gray-400 opacity-60 hover:opacity-80'} text-white px-3 py-2 rounded-md flex flex-col items-center justify-center min-w-[72px] shadow-lg pointer-events-auto active:scale-95 transition-all outline-none cursor-pointer select-none`}
                              >
                                {isIssueOrder ? (
                                  <>
                                    <AlertTriangle className="w-4 h-4 mb-0.5" />
                                    <span className="text-[11px] font-bold">问题单</span>
                                  </>
                                ) : (
                                  <>
                                    <ClipboardList className="w-4 h-4 mb-0.5" />
                                    <span className="text-[11px] font-bold">设为问题</span>
                                  </>
                                )}
                              </button>

                              {/* 设为带箱 (Action Button) */}
                              <button 
                                onClick={handleToggleWithBox}
                                className={`${isWithBox ? 'bg-amber-500 scale-105 shadow-amber-200' : 'bg-gray-400 opacity-60 hover:opacity-80'} text-white px-3 py-2 rounded-md flex flex-col items-center justify-center min-w-[72px] shadow-lg pointer-events-auto active:scale-95 transition-all outline-none cursor-pointer select-none`}
                              >
                                {isWithBox ? (
                                  <>
                                    <Package className="w-4 h-4 mb-0.5" />
                                    <span className="text-[11px] font-bold">带箱</span>
                                  </>
                                ) : (
                                  <>
                                    <Box className="w-4 h-4 mb-0.5" />
                                    <span className="text-[11px] font-bold">设为带箱</span>
                                  </>
                                )}
                              </button>

                              {/* 设为高价 (Action Button - formerly 设为贵价) */}
                              <button 
                                onClick={() => setIsCC(!isCC)}
                                className={`${isCC ? 'bg-indigo-600 scale-105 shadow-indigo-200' : 'bg-gray-400 opacity-60 hover:opacity-80'} text-white px-3 py-2 rounded-md flex flex-col items-center justify-center min-w-[72px] shadow-lg pointer-events-auto active:scale-95 transition-all outline-none cursor-pointer select-none`}
                              >
                                {isCC ? (
                                  <>
                                    <Sparkles className="w-4 h-4 mb-0.5 animate-pulse" />
                                    <span className="text-[11px] font-bold">高价</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mb-0.5" />
                                    <span className="text-[11px] font-bold">设为高价</span>
                                  </>
                                )}
                              </button>

                              {/* 普通流转箱 - 置于最下 (蓝色加粗，无文本描述，点击单独输入) */}
                              <button 
                                onClick={() => {
                                  setTempBoxCode(boxCode);
                                  setBoxError(null);
                                  setEditBoxType('normal');
                                }}
                                className="bg-indigo-50 border-2 border-indigo-500 text-indigo-600 px-3 py-2.5 rounded-xl flex flex-col items-center justify-center min-w-[84px] shadow-md pointer-events-auto active:scale-95 transition-all text-xs font-black relative cursor-pointer select-none"
                                title="普通流转箱：点击单独修改编码"
                              >
                                <Warehouse className="w-4 h-4 mb-1 text-indigo-500" />
                                <span className="text-[12px] font-black tracking-wider leading-none mt-0.5">{boxCode || 'DD-00000001'}</span>
                                {!isCC && !isIssueOrder && (
                                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                  </span>
                                )}
                              </button>
                            </div>

                            {/* Content Scroll Area */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                              <div className="space-y-4 max-w-[1400px] mx-auto pb-10">
                                
                                {/* Step/Flow Header */}
                                <div className="bg-white p-4 rounded shadow-sm flex items-center h-16">
                                  <div className={`flex-1 flex items-center justify-center gap-4 border-r border-gray-50 transition-colors duration-300 ${selectedInboundOrder ? 'text-green-500' : 'text-blue-500'}`}>
                                    {selectedInboundOrder ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-500 animate-bounce" />
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                      </div>
                                    )}
                                    <span className="text-sm font-medium">选择关联订单</span>
                                  </div>
                                  <div className="w-20 flex items-center justify-center">
                                    <ChevronRight className="w-6 h-6 text-gray-200" />
                                  </div>
                                  <div className={`flex-1 flex items-center justify-center gap-4 transition-colors duration-300 ${selectedInboundOrder ? 'text-blue-500' : 'text-gray-300'}`}>
                                    {selectedInboundOrder ? (
                                      <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />
                                      </div>
                                    ) : (
                                      <div className="w-5 h-5 rounded-full border border-gray-200" />
                                    )}
                                    <span className="text-sm">完善商品信息</span>
                                  </div>
                                  <div className="shrink-0 pl-10 pr-2 opacity-0 pointer-events-none">
                                    <div className="w-24 h-8" />
                                  </div>
                                </div>

                                {/* Inbound Success Toast Banner */}
                                <AnimatePresence>
                                  {inboundSuccessAnim && (
                                    <motion.div 
                                      initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                      animate={{ opacity: 1, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                      className="bg-emerald-500 text-white p-4 rounded-xl shadow-lg flex items-center justify-between gap-4 z-40 mb-2 border border-emerald-400"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                                          <Check className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                          <p className="text-xs font-black">恭喜，商品已成功完成入库！</p>
                                          <p className="text-[10px] opacity-90 leading-tight">对应的电子标签、重量、货架及流转箱代号均已登记，并刷新记录。</p>
                                        </div>
                                      </div>
                                      <button onClick={() => setInboundSuccessAnim(false)} className="text-white hover:text-white/80 shrink-0">
                                        <X className="w-4 h-4" />
                                      </button>
                                    </motion.div>
                                  )}
                                </AnimatePresence>

                                {selectedInboundOrder === null ? (
                                  /* Order Association Card - STEP 1 (Selection) */
                                  <div className="bg-white rounded shadow-sm">
                                    <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                      <h3 className="text-sm font-bold text-gray-700">入库关联订单</h3>
                                      <div className="flex items-center gap-1 text-[11.5px] text-blue-400 cursor-pointer hover:text-blue-500">
                                        收起搜索 <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                                      </div>
                                    </div>
                                    
                                    <div className="p-6 space-y-5">
                                      <div className="flex flex-wrap gap-x-6 gap-y-4">
                                        {/* Search Fields Grid */}
                                        <div className="flex items-center gap-2 min-w-[200px]">
                                          <span className="text-[11.5px] text-gray-400 w-12 text-right">mid</span>
                                          <input type="text" placeholder="mid" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-100 outline-none" />
                                        </div>
                                        <div className="flex items-center gap-2 min-w-[320px]">
                                          <span className="text-[11.5px] text-gray-400 w-16 text-right">快递单号</span>
                                          <input type="text" placeholder="快递单号" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-100 outline-none" />
                                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1.5 rounded border border-gray-200">
                                            <span className="text-[10px] text-gray-400 font-bold">关</span>
                                            <div className="w-8 h-4 bg-blue-500 rounded-full relative">
                                              <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full" />
                                            </div>
                                            <span className="text-[10px] text-blue-500 font-bold">验</span>
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-[200px]">
                                          <span className="text-[11.5px] text-gray-400 w-16 text-right">平台单号</span>
                                          <input type="text" placeholder="平台单号" className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-100 outline-none" />
                                        </div>
                                        <div className="flex items-center gap-2 min-w-[200px]">
                                          <span className="text-[11.5px] text-gray-400 w-12 text-right">标签</span>
                                          <div className="flex-1 flex flex-wrap gap-1 items-center min-h-[32px] border border-gray-200 rounded px-2 py-1">
                                            {isIssueOrder && (
                                              <span className="bg-red-50 text-red-500 text-[10px] px-1.5 py-0.5 rounded border border-red-100 font-bold flex items-center gap-1">
                                                问题单
                                                <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setIsIssueOrder(false)} />
                                              </span>
                                            )}
                                            {isWithBox && (
                                              <span className="bg-amber-50 text-amber-600 text-[10px] px-1.5 py-0.5 rounded border border-amber-100 font-bold flex items-center gap-1">
                                                含箱重量
                                                <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setIsWithBox(false)} />
                                              </span>
                                            )}
                                            {isCC && (
                                              <span className="bg-indigo-50 text-indigo-600 text-[10px] px-1.5 py-0.5 rounded border border-indigo-100 font-bold flex items-center gap-1">
                                                高价
                                                <X className="w-2.5 h-2.5 cursor-pointer" onClick={() => setIsCC(false)} />
                                              </span>
                                            )}
                                            {!isIssueOrder && !isWithBox && !isCC && <span className="text-gray-300 text-xs">-</span>}
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-[200px]">
                                          <span className="text-[11.5px] text-gray-400 w-16 text-right">卖家ID</span>
                                          <input type="text" placeholder="卖家ID" className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-100 outline-none" />
                                        </div>
                                        <div className="flex items-center gap-2 min-w-[180px]">
                                          <span className="text-[11.5px] text-gray-400 w-16 text-right">入库ID</span>
                                          <input type="text" placeholder="入库ID" className="border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-100 outline-none" />
                                        </div>
                                        
                                        {/* Lower Search Row */}
                                        <div className="w-full flex flex-wrap gap-x-6 gap-y-4 pt-1 border-b border-gray-100 pb-5">
                                          <div className="flex items-center gap-2 min-w-[200px]">
                                            <span className="text-[11.5px] text-gray-400 w-12 text-right">购买账号</span>
                                            <input type="text" placeholder="购买账号" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-100 outline-none" />
                                          </div>
                                          <div className="flex items-center gap-2 min-w-[240px]">
                                            <span className="text-[11.5px] text-gray-400 w-16 text-right">商品名称</span>
                                            <input type="text" placeholder="商品名称" className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-blue-100 outline-none" />
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <div className="w-32 flex items-center border border-gray-200 rounded overflow-hidden">
                                              <div className="bg-gray-50 border-r border-gray-200 p-1.5">
                                                 <History className="w-3.5 h-3.5 text-gray-400" />
                                              </div>
                                              <input type="text" placeholder="开始" className="w-full px-2 py-1.5 text-xs outline-none text-center" value="2026-03-01" readOnly />
                                            </div>
                                            <span className="text-gray-300">-</span>
                                            <div className="w-32 border border-gray-200 rounded overflow-hidden">
                                              <input type="text" placeholder="结束" className="w-full px-2 py-1.5 text-xs outline-none text-center" value="2026-03-20" readOnly />
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-3">
                                            <span className="text-[11.5px] font-bold text-gray-600">平台</span>
                                            <select className="w-24 border border-gray-200 rounded px-2 py-1.5 text-xs bg-white outline-none">
                                              <option>全部</option>
                                            </select>
                                          </div>
                                          
                                          <div className="flex-1 flex justify-end gap-3 pr-2">
                                            <button className="bg-[#1890ff] text-white px-5 py-1.5 rounded flex items-center gap-2 text-xs shadow-sm hover:bg-[#40a9ff] transition-all">
                                              <Search className="w-3.5 h-3.5" />
                                              搜索
                                            </button>
                                            <button className="bg-white border border-gray-200 text-gray-500 px-5 py-1.5 rounded flex items-center gap-2 text-xs shadow-sm hover:bg-gray-50 transition-all">
                                              <RotateCcw className="w-3.5 h-3.5" />
                                              重置
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Associated Orders Table Section */}
                                      <div className="space-y-3 pt-2">
                                        <h4 className="text-[11.5px] font-bold text-[#5d5fb1] bg-[#5d5fb1]/5 px-3 py-2 rounded flex items-center gap-2">
                                          <Layout className="w-3.5 h-3.5 text-[#5d5fb1]" />
                                          查询到以下 3 个关联的可入库订单：
                                        </h4>
                                        <div className="border border-gray-100 rounded overflow-hidden">
                                          <div className="overflow-x-auto w-full">
                                            <table className="w-full border-collapse">
                                              <thead>
                                                <tr className="bg-gray-50/50 text-[11px] text-gray-400 font-bold border-b border-gray-100 text-left">
                                                  <th className="py-2.5 px-4 font-bold text-center w-20">图片</th>
                                                  <th className="py-2.5 px-4 font-bold text-center w-28">用户标签</th>
                                                  <th className="py-2.5 px-4 font-bold text-center w-28">卖家ID</th>
                                                  <th className="py-2.5 px-4 font-bold text-center w-36">商品MID</th>
                                                  <th className="py-2.5 px-4 font-bold text-center w-40">会员ID</th>
                                                  <th className="py-2.5 px-4 font-bold">商品名称</th>
                                                  <th className="py-2.5 px-4 font-bold text-center w-36">购买时间</th>
                                                  <th className="py-2.5 px-4 font-bold text-center w-24">操作</th>
                                                </tr>
                                              </thead>
                                              <tbody className="divide-y divide-gray-50">
                                                {[
                                                  {
                                                    id: "1",
                                                    title: "【再入荷】【キッズ用】ディズニー カーズ マグカップ コップ",
                                                    userTag: "保险柜存放",
                                                    sellerId: "426",
                                                    sellerLogo: "teway",
                                                    mid: "1773627111178",
                                                    midBadge: "优购",
                                                    extraMid: "平台单号:111",
                                                    memberId: "18635-5448029516",
                                                    purchaseTime: "2026-03-16 10:13:05",
                                                    renderImage: () => <CarsCupSvg />
                                                  },
                                                  {
                                                    id: "2",
                                                    title: "VRTX 米特許取得 トレーニングチューブ フィットネスバンド",
                                                    userTag: "保险柜存放",
                                                    sellerId: "774613110",
                                                    sellerLogo: "mercari",
                                                    mid: "m80096943213",
                                                    midBadge: "优购",
                                                    memberId: "18620-1669803006",
                                                    purchaseTime: "2026-03-13 16:01:38",
                                                    renderImage: () => <ExerciseBandsSvg />
                                                  },
                                                  {
                                                    id: "3",
                                                    title: "パターキャッチャー パターカバークリップ パグ・肉球デザイン",
                                                    userTag: "保险柜存放",
                                                    sellerId: "507610782",
                                                    sellerLogo: "mercari",
                                                    mid: "m32993047813",
                                                    midBadge: "折扣购",
                                                    memberId: "18620-1669803006",
                                                    purchaseTime: "2026-03-13 16:01:49",
                                                    renderImage: () => <PawKeychainSvg />
                                                  }
                                                ].map((row) => (
                                                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors text-xs text-slate-700">
                                                    <td className="py-3 px-4 flex items-center justify-center">
                                                      {row.renderImage()}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                      <div className="inline-flex flex-col items-center gap-1 justify-center">
                                                        <span className="bg-amber-100 text-[#b45309] border border-amber-200 rounded px-1.5 py-1 text-[10px] font-bold shadow-sm whitespace-nowrap">
                                                          {row.userTag}
                                                        </span>
                                                        <button className="border border-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-650 bg-white shadow-sm hover:bg-gray-50">
                                                          <Settings className="w-3 h-3" />
                                                        </button>
                                                      </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-bold text-gray-500">
                                                      <div className="flex flex-col items-center gap-1 justify-center">
                                                        {row.sellerLogo === 'teway' ? (
                                                          <span className="text-[#ff4d4f] font-extrabold italic text-[13px] tracking-tight border-b-2 border-[#ff4d4f]/20">
                                                            Teway+
                                                          </span>
                                                        ) : (
                                                          <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                                                            m
                                                          </span>
                                                        )}
                                                        <span className="text-[11px]">{row.sellerId}</span>
                                                      </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                      <div className="flex flex-col items-center justify-center">
                                                        <span className={`px-1.5 py-0.5 text-[9px] font-black rounded text-white ${row.midBadge === '优购' ? 'bg-red-500' : 'bg-gray-400'}`}>
                                                          {row.midBadge}
                                                        </span>
                                                        <span className="font-mono text-[11px] font-bold tracking-tight text-gray-700 mt-1">{row.mid}</span>
                                                        {row.extraMid && <span className="text-[9.5px] text-gray-400 font-bold mt-0.5">{row.extraMid}</span>}
                                                      </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                      <div className="flex items-center gap-1 justify-center text-blue-500 font-mono text-[11px] font-bold">
                                                        <Mail className="w-3.5 h-3.5 text-blue-400" />
                                                        <span>{row.memberId}</span>
                                                      </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-left font-bold text-gray-750 leading-relaxed max-w-[280px]">
                                                      {row.title}
                                                    </td>
                                                    <td className="py-3 px-4 text-center font-mono text-gray-500">
                                                      {row.purchaseTime}
                                                    </td>
                                                    <td className="py-3 px-4 text-center">
                                                      <button
                                                        onClick={() => {
                                                          setSelectedInboundOrder(row);
                                                          setInboundTracking("TR-" + Math.floor(10000000 + Math.random() * 90000000));
                                                          setInboundWeight(row.id === "1" ? "320" : row.id === "2" ? "450" : "110");
                                                        }}
                                                        className="bg-[#22c55e] hover:bg-[#16a34a] active:scale-95 transition-all text-white font-black text-xs px-4 py-2 rounded-lg shadow-md hover:shadow-green-150 flex items-center justify-center mx-auto"
                                                      >
                                                        选择入库
                                                      </button>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  /* COMPLETE INBOUND INFO - STEP 2 */
                                  <div className="bg-white rounded-lg p-6 space-y-6 text-gray-800">
                                    
                                    {/* 1. 订单信息 Section */}
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <h3 className="text-base font-bold text-gray-800 tracking-tight">订单信息</h3>
                                        
                                        {/* Purple Floating Code Badge (RY-00000465) */}
                                        <div className={`text-white pr-4 pl-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md font-extrabold text-xs tracking-wider select-none transform hover:scale-105 transition-all ${
                                          isIssueOrder 
                                            ? 'bg-rose-500 shadow-rose-100' 
                                            : isCC 
                                              ? 'bg-amber-500 shadow-amber-100' 
                                              : 'bg-[#6366f1] shadow-indigo-100'
                                        }`}>
                                          {isIssueOrder ? (
                                            <AlertCircle className="w-3.5 h-3.5" />
                                          ) : isCC ? (
                                            <Sparkles className="w-3.5 h-3.5 text-white" />
                                          ) : (
                                            <Warehouse className="w-3.5 h-3.5" />
                                          )}
                                          <span>
                                            {isIssueOrder 
                                              ? "不入箱" 
                                              : isCC 
                                                ? `高价箱: ${vipBoxCode || "GJ-00000001"}` 
                                                : `流转箱: ${boxCode || "DD-00000001"}`
                                            }
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className="overflow-x-auto border border-gray-150 rounded">
                                        <table className="w-full border-collapse text-xs">
                                          <tbody>
                                            <tr className="border-b border-gray-150">
                                              <td className="bg-gray-50/70 px-4 py-2 text-gray-500 font-medium border-r border-gray-150 w-24 text-center">订单类型</td>
                                              <td className="px-4 py-2 border-r border-gray-150 w-44">
                                                <span className="bg-[#ff4d4f] text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">优购</span>
                                              </td>
                                              <td className="bg-gray-50/70 px-4 py-2 text-gray-500 font-medium border-r border-gray-150 w-24 text-center">用户ID</td>
                                              <td className="px-4 py-2 border-r border-gray-150 font-mono text-gray-700 font-bold w-44">5448029516</td>
                                              <td className="bg-gray-50/70 px-4 py-2 text-gray-500 font-medium border-r border-gray-150 w-24 text-center">入库ID</td>
                                              <td className="px-4 py-2 border-r border-gray-150 font-mono text-gray-700 font-bold w-44">18635</td>
                                              <td className="bg-gray-50/70 px-4 py-2 text-gray-500 font-medium border-r border-gray-150 w-24 text-center">商品名称</td>
                                              <td className="px-4 py-2 text-gray-700 font-medium leading-relaxed max-w-[280px]">
                                                {selectedInboundOrder.title}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="bg-gray-50/70 px-4 py-2 text-gray-500 font-medium border-r border-gray-150 w-24 text-center">商品地址</td>
                                              <td className="px-4 py-2 border-r border-gray-150">
                                                <button 
                                                  onClick={() => alert("【商品收货地址】\n日本東京都江東区新砂 3-4-11 配送管理センター(A栋3楼)\n收件人 ID: 18635-54480\n电话: 03-5684-1289")} 
                                                  className="text-blue-500 hover:text-blue-600 font-bold underline cursor-pointer"
                                                >
                                                  点击查看
                                                </button>
                                              </td>
                                              <td className="bg-gray-50/70 px-4 py-2 text-gray-500 font-medium border-r border-gray-150 w-24 text-center">商品MID</td>
                                              <td className="px-4 py-2 border-r border-gray-150 font-mono text-gray-700 font-bold">
                                                {selectedInboundOrder.mid || "1773627111178"}
                                              </td>
                                              <td className="bg-gray-50/70 px-4 py-2 text-gray-500 font-medium border-r border-gray-150 w-24 text-center">快递单号</td>
                                              <td className="px-4 py-2 border-r border-gray-150">
                                                {showEditTracking ? (
                                                  <div className="flex gap-1 items-center">
                                                    <input 
                                                      type="text" 
                                                      value={inboundTracking} 
                                                      onChange={(e) => setInboundTracking(e.target.value)}
                                                      className="border border-blue-400 px-1.5 py-1 rounded text-[11px] w-28 text-slate-800 font-mono font-bold uppercase outline-none"
                                                      placeholder="输入快递单号"
                                                      autoFocus
                                                    />
                                                    <button 
                                                      onClick={() => setShowEditTracking(false)} 
                                                      className="bg-emerald-500 text-white rounded p-1 hover:bg-emerald-600 transition-colors"
                                                      title="保存"
                                                    >
                                                      <Check className="w-3 h-3" />
                                                    </button>
                                                  </div>
                                                ) : (
                                                  <button 
                                                    onClick={() => setShowEditTracking(true)} 
                                                    className="bg-[#1890ff] hover:bg-blue-600 active:scale-95 transition-all text-white px-3 py-1 rounded text-[11px] font-bold shadow-sm"
                                                  >
                                                    {inboundTracking ? inboundTracking : "补充快递单号"}
                                                  </button>
                                                )}
                                              </td>
                                              <td className="bg-gray-50/70 px-4 py-2 text-gray-500 font-medium border-r border-gray-150 w-24 text-center">商品金额</td>
                                              <td className="px-4 py-2 text-gray-700 font-mono font-bold">
                                                {selectedInboundOrder.id === "1" ? "700" : selectedInboundOrder.id === "2" ? "2100" : "1200"}
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* 2. 订单标签 Section */}
                                    <div className="border-l-[3px] border-[#1890ff] pl-3 space-y-3 mt-4">
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="space-y-1">
                                          <h3 className="text-xs font-bold text-gray-500 tracking-wide uppercase">订单标签</h3>
                                          <div className="flex flex-wrap gap-2 pt-0.5">
                                            <span className="bg-amber-100 text-[#b45309] border border-amber-200 rounded px-2.5 py-1 text-xs font-bold shadow-sm select-none">
                                              保险柜存放
                                            </span>
                                            {isIssueOrder && (
                                              <span className="bg-red-100 text-red-600 border border-red-200 rounded px-2.5 py-1 text-xs font-bold shadow-sm animate-pulse select-none">
                                                【问题单】
                                              </span>
                                            )}
                                            {isWithBox && (
                                              <span className="bg-orange-100 text-orange-600 border border-orange-200 rounded px-2.5 py-1 text-xs font-bold shadow-sm select-none">
                                                【含箱重量】
                                              </span>
                                            )}
                                            {isCC && (
                                              <span className="bg-indigo-100 text-indigo-600 border border-indigo-200 rounded px-2.5 py-1 text-xs font-bold shadow-sm select-none">
                                                【高价】
                                              </span>
                                            )}
                                          </div>
                                        </div>

                                        {/* Status Toggle Action Buttons */}
                                        <div className="flex flex-wrap gap-2 h-fit">
                                          <button
                                            type="button"
                                            onClick={() => setIsIssueOrder(!isIssueOrder)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                              isIssueOrder 
                                                ? 'bg-red-500 text-white border-red-500 hover:bg-red-600' 
                                                : 'bg-white text-red-500 border-red-200 hover:bg-red-50/50'
                                            }`}
                                          >
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                            <span>{isIssueOrder ? "取消问题单" : "问题单"}</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={handleToggleWithBox}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                              isWithBox 
                                                ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' 
                                                : 'bg-white text-orange-500 border-orange-200 hover:bg-orange-50/50'
                                            }`}
                                          >
                                            <Package className="w-3.5 h-3.5" />
                                            <span>{isWithBox ? "取消带箱" : "设为带箱"}</span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setIsCC(!isCC);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                                              isCC 
                                                ? 'bg-indigo-500 text-white border-indigo-500 hover:bg-indigo-600' 
                                                : 'bg-white text-indigo-500 border-indigo-200 hover:bg-indigo-50/55'
                                            }`}
                                          >
                                            <Sparkles className="w-3.5 h-3.5" />
                                            <span>{isCC ? "取消高价" : "设为高价"}</span>
                                          </button>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 3. 商品卖家图 Container */}
                                    <div className="border border-gray-150 rounded flex items-center justify-between text-xs overflow-hidden bg-white">
                                      <div className="bg-gray-50/70 px-4 py-3.5 text-gray-500 font-bold border-r border-gray-150 w-28 text-center shrink-0">
                                        商品卖家图
                                      </div>
                                      <div className="flex-1 px-4 py-2 flex justify-end">
                                        <div 
                                          onClick={() => alert("产品图解析：原包装盒装公仔，带完好吊牌。")} 
                                          className="w-8 h-8 rounded border border-gray-200 flex items-center justify-center bg-gray-50 text-gray-400 cursor-pointer hover:bg-gray-100 hover:text-blue-500 transition-all shadow-sm" 
                                          title="点击查看卖家图片详情"
                                        >
                                          <ImageIcon className="w-4 h-4" />
                                        </div>
                                      </div>
                                    </div>

                                    {/* 4. 商品信息 Section */}
                                    <div className="space-y-3 pt-2">
                                      <div className="border-l-[3px] border-[#ff4d4f] pl-3">
                                        <h3 className="text-base font-bold text-gray-800 tracking-tight">商品信息</h3>
                                      </div>
                                      
                                      <div className="border border-gray-150 rounded overflow-hidden">
                                        <table className="w-full border-collapse text-xs text-left">
                                          <thead>
                                            <tr className="bg-gray-50/70 text-gray-500 border-b border-gray-150">
                                              <th className="py-2.5 px-4 font-bold border-r border-gray-150 text-center w-24">Mid</th>
                                              <th className="py-2.5 px-4 font-bold border-r border-gray-150 text-left">商品名称</th>
                                              <th className="py-2.5 px-4 font-bold text-center w-36">商品数量</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr className="hover:bg-gray-50/20 transition-colors">
                                              <td className="py-3 px-4 border-r border-gray-150 text-center font-mono font-bold text-gray-600">
                                                {selectedInboundOrder.id === "1" ? "53429" : selectedInboundOrder.id === "2" ? "21049" : "39104"}
                                              </td>
                                              <td className="py-3 px-4 border-r border-gray-150 text-gray-800 font-bold leading-relaxed">
                                                {selectedInboundOrder.title}
                                              </td>
                                              <td className="py-3 px-4 text-center font-bold text-gray-700">1</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>

                                    {/* 5. 入库图片 Section */}
                                    <div className="space-y-4 pt-3">
                                      <div className="flex items-center gap-3">
                                        <h3 className="text-sm font-bold text-gray-700">入库图片</h3>
                                        <div className="bg-[#ff4d4f] text-white font-extrabold text-[10px] rounded px-2.5 py-1 tracking-wider shadow-sm select-none animate-pulse">
                                          双击空格回车快速拍照上传
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                        {/* Left Side: Live Webcam Area */}
                                        <div className="space-y-2">
                                          <div className="bg-gray-950 rounded-xl overflow-hidden relative border border-gray-800 shadow-md h-64 group flex flex-col justify-between">
                                            {/* Flash Trigger representation */}
                                            {weightAutoSuccess && (
                                              <div className="absolute inset-0 bg-white z-20 animate-fade-out" />
                                            )}

                                            {/* Webcam image. Replicates the wires, rack, 3M box layout in screenshots perfectly. */}
                                            <div 
                                              className="absolute inset-0 bg-cover bg-center opacity-85 group-hover:scale-102 duration-700 transition-transform" 
                                              style={{ 
                                                backgroundImage: capturedPhoto 
                                                  ? `url(${capturedPhoto})`
                                                  : `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=600')` 
                                              }} 
                                            />
                                            
                                            {/* Green sweep line */}
                                            <div className="absolute left-0 w-full h-0.5 bg-green-500 shadow-[0_0_12px_#22c55e] opacity-80 animate-shimmer" style={{ animationDuration: '3.5s' }} />

                                            {/* Webcam status */}
                                            <div className="p-3 bg-black/40 backdrop-blur-[2px] w-full flex items-center justify-between text-white text-[10.5px] z-10 font-bold">
                                              <div className="flex items-center gap-1.5">
                                                <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                                                <span>摄像流已联通 ｜ USB CAMERA #1</span>
                                              </div>
                                              <span className="font-mono text-gray-300">1080P_REFRESH</span>
                                            </div>

                                            {/* Center visual target guidelines */}
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                                              <div className="w-24 h-24 border-2 border-dashed border-white rounded-lg flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                              </div>
                                            </div>

                                            {/* Scan prompt details */}
                                            <div className="p-3 bg-gradient-to-t from-black/80 to-transparent w-full text-white text-[10px] z-10 leading-relaxed font-sans">
                                              <p className="font-bold flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} /> 温馨提示：您可以在本页面按下 <kbd className="bg-gray-800 text-yellow-300 font-mono px-1 rounded border border-gray-700 font-black">空格键</kbd> 或 <kbd className="bg-gray-800 text-yellow-300 font-mono px-1 rounded border border-gray-700 font-black">回车键</kbd> 瞬间快速拍照。</p>
                                            </div>
                                          </div>
                                        </div>

                                        {/* Right Side: Inputs, Capture, Manual Upload */}
                                        <div className="space-y-3.5">
                                          {/* Input 1: 订单数量 */}
                                          <div className="flex border border-gray-200 bg-white rounded text-xs overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                                            <div className="bg-gray-50 border-r border-gray-200 px-3.5 py-2.5 text-gray-500 font-bold w-24 text-center flex items-center justify-center shrink-0 select-none">
                                              订单数量
                                            </div>
                                            <input 
                                              type="text" 
                                              placeholder="请输入订单数量（可选）" 
                                              value={inboundQty}
                                              onChange={(e) => setInboundQty(e.target.value)}
                                              className="flex-1 px-4 py-2 text-slate-700 outline-none font-medium h-9"
                                            />
                                          </div>

                                          {/* Input 2: 附加说明 */}
                                          <div className="flex border border-gray-200 bg-white rounded text-xs overflow-hidden focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                                            <div className="bg-gray-50 border-r border-gray-200 px-3.5 py-2.5 text-gray-500 font-bold w-24 text-center flex items-center justify-center shrink-0 select-none">
                                              附加说明
                                            </div>
                                            <input 
                                              type="text" 
                                              placeholder="请输入附加说明（可选）" 
                                              value={inboundNote}
                                              onChange={(e) => setInboundNote(e.target.value)}
                                              className="flex-1 px-4 py-2 text-slate-700 outline-none font-medium h-9"
                                            />
                                          </div>

                                          {/* Grey Camera Capture Button */}
                                          <button 
                                            onClick={() => {
                                              setWeightAutoSuccess(true);
                                              // set mock captured photo
                                              setCapturedPhoto("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400");
                                              setTimeout(() => setWeightAutoSuccess(false), 500);
                                              alert("📸 已拍照存储！照片已生成并绑定为入库凭证。");
                                            }}
                                            className="w-full bg-[#8c8c8c] hover:bg-gray-500 active:scale-[0.99] transition-all text-white py-2 rounded-lg flex items-center justify-center gap-1.5 font-bold text-xs shadow-md select-none border border-gray-400 h-9"
                                          >
                                            <Camera className="w-4 h-4 text-white" />
                                            <span>点击拍摄快照</span>
                                          </button>

                                          {/* Dashed manual upload container */}
                                          <div 
                                            onClick={() => {
                                              // Simulate manual file selector trigger
                                              const fileList = [
                                                "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400",
                                                "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=400",
                                                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400"
                                              ];
                                              const randomUrl = fileList[Math.floor(Math.random() * fileList.length)];
                                              setCapturedPhoto(randomUrl);
                                              alert("📂 文件模拟成功：已手动选择本地商品照片作为补充凭证！");
                                            }}
                                            className="border-2 border-dashed border-gray-200 bg-gray-50/50 hover:bg-gray-50 rounded-xl p-5 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:border-blue-300 transition-all select-none group"
                                          >
                                            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-blue-500 group-hover:scale-110 transition-all border border-gray-100 shadow-sm">
                                              <Upload className="w-4 h-4" />
                                            </div>
                                            <div>
                                              <p className="text-xs font-bold text-gray-600">手动上传本地图片</p>
                                              <p className="text-[10px] text-gray-400 mt-0.5">支持 PNG, JPG格式，文件限 10M 以内</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* 6. Required Fields Area */}
                                    <div className="bg-gray-50/50 rounded-lg p-5 border border-gray-100 space-y-4 mt-6">
                                      {/* Item 1: 商品重量 */}
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1 select-none">
                                          <span className="text-red-500 font-black text-xs">*</span> 商品重量：
                                        </label>
                                        <div className="flex border border-gray-250 rounded bg-white overflow-hidden focus-within:ring-1 focus-within:ring-blue-400 focus-within:border-blue-400 transition-all shadow-sm">
                                          <input 
                                            type="text" 
                                            value={inboundWeight}
                                            onChange={(e) => setInboundWeight(e.target.value)}
                                            className="flex-1 px-4 py-2.5 text-xs font-mono font-bold text-gray-700 outline-none" 
                                            placeholder="请输入商品克数重量 (例如：320)"
                                          />
                                          
                                          {/* Calibration auxiliary trigger */}
                                          <button 
                                            onClick={() => {
                                              setWeightAutoSuccess(true);
                                              // Simulated weigh with random drift
                                              const orig = selectedInboundOrder.id === "1" ? 320 : selectedInboundOrder.id === "2" ? 450 : 110;
                                              const drift = Math.floor(Math.random() * 6) - 2;
                                              setInboundWeight(String(orig + drift));
                                              setTimeout(() => setWeightAutoSuccess(false), 800);
                                            }}
                                            className="px-3 border-l border-r border-gray-200 text-[10px] text-indigo-500 hover:bg-indigo-50/50 font-black select-none transition-colors"
                                          >
                                            地磅归零秤重
                                          </button>

                                          <div className="bg-gray-100 px-4 py-2.5 text-xs font-bold text-gray-500 select-none flex items-center justify-center min-w-[48px]">
                                            克
                                          </div>
                                        </div>
                                      </div>

                                      {/* Item 2: 入库编号 */}
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1 select-none">
                                          <span className="text-red-500 font-black text-xs">*</span> 入库编号
                                        </label>
                                        <input 
                                          type="text" 
                                          value={inboundShelf}
                                          onChange={(e) => setInboundShelf(e.target.value)}
                                          className="w-full border border-gray-250 rounded px-4 py-2.5 text-xs font-bold text-gray-700 outline-none bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 shadow-sm" 
                                          placeholder="请输入仓位货架分配代号（例如: A-04-12）"
                                        />
                                      </div>

                                      {/* Item 3: 货到付款价 */}
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-700 flex items-center gap-1 select-none">
                                          <span className="text-red-500 font-black text-xs">*</span> 货到付款价
                                        </label>
                                        <input 
                                          type="text" 
                                          value={codAmountState}
                                          onChange={(e) => setCodAmountState(e.target.value)}
                                          className="w-full border border-gray-250 rounded px-4 py-2.5 text-xs font-mono font-bold text-[#ff4d4f] outline-none bg-white focus:ring-1 focus:ring-blue-400 focus:border-blue-400 shadow-sm" 
                                          placeholder="货到支付的日元运费，若无则输入0 (例如: 0)"
                                        />
                                      </div>
                                    </div>

                                    {/* 7. Bottom Navigation & Confirmation Action Footer */}
                                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                                      <button 
                                        type="button"
                                        onClick={() => setSelectedInboundOrder(null)}
                                        className="px-6 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded hover:bg-gray-50 transition-colors cursor-pointer select-none"
                                      >
                                        上一步
                                      </button>
                                      
                                      <button 
                                        type="button"
                                        onClick={() => {
                                          if (!inboundWeight || Number(inboundWeight) <= 0) {
                                            alert("🚨 请填入正确的商品重量！");
                                            return;
                                          }
                                          if (!inboundShelf.trim()) {
                                            alert("🚨 请指定最终的入库编号/货架仓位！");
                                            return;
                                          }

                                          // Form completed, append to state list
                                          const entryId = "RK-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + String(Math.floor(1000 + Math.random() * 9000));
                                          const targetRecord = {
                                            id: entryId,
                                            operator: "管理员",
                                            productMid: selectedInboundOrder.mid || "1773627111178",
                                            productName: selectedInboundOrder.title,
                                            productImage: selectedInboundOrder.id === "1" ? "cars-mug" : selectedInboundOrder.id === "2" ? "yoga-bands" : "keychain",
                                            inboundImage: capturedPhoto || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=100",
                                            memberId: selectedInboundOrder.memberId || "18635-5448029516",
                                            trackingCode: inboundTracking || "YT-" + Math.floor(10000000 + Math.random() * 90000000),
                                            codAmount: Number(codAmountState) || 0,
                                            weight: Number(inboundWeight) || 320,
                                            boxCode: isIssueOrder ? "" : (isCC ? (vipBoxCode || "GJ-00000001") : (boxCode || "DD-00000001")),
                                            isIssueOrder: isIssueOrder,
                                            isWithBox: isWithBox,
                                            isCC: isCC,
                                            qty: inboundQty || "1",
                                            note: inboundNote || "正常入仓",
                                            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19)
                                          };
                                          
                                          // Clear flag triggers immediately after compiling target record data
                                          setIsIssueOrder(false);
                                          setIsCC(false);
                                          setIsWithBox(false);

                                          setInboundRecords([targetRecord, ...inboundRecords]);
                                          
                                          // Success flash
                                          setInboundSuccessAnim(true);
                                          setSelectedInboundOrder(null);
                                          
                                          // Clear edit parameters
                                          setInboundQty("");
                                          setInboundNote("");
                                          setCapturedPhoto(null);
                                          setCodAmountState("0");

                                          // Autohide notifications
                                          setTimeout(() => setInboundSuccessAnim(false), 3000);
                                        }}
                                        className="px-6 py-2 bg-[#1890ff] hover:bg-blue-600 font-extrabold text-white text-xs rounded shadow-lg transition-all active:scale-95 flex items-center gap-1 border border-[#1890ff] cursor-pointer"
                                      >
                                        确认提交
                                      </button>
                                    </div>
                                    
                                  </div>
                                )}

                                {/* Records Table Card - Dynamic */}
                                <div className="bg-white rounded shadow-sm overflow-hidden">
                                  <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-gray-700">最近成功入库记录 (自动刷新)</h3>
                                    <div className="text-[11.5px] text-blue-400 cursor-pointer hover:text-blue-500 flex items-center gap-1" onClick={() => {
                                      // Simulate random addition
                                      const rand = {
                                        id: "RK-202605190" + Math.floor(100+Math.random()*900),
                                        operator: "入库员01",
                                        productMid: "m" + Math.floor(100000000+Math.random()*900000000),
                                        productName: "【お買い得】パタゴニア アウトドア 登山用ジャケット",
                                        productImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=100",
                                        inboundImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=100",
                                        memberId: "18620-1669803006",
                                        trackingCode: "JP-7394851213",
                                        codAmount: 0,
                                        weight: 412,
                                        boxCode: isIssueOrder ? "" : (isCC ? (vipBoxCode || "GJ-00000001") : (boxCode || "DD-00000001")),
                                        isIssueOrder: isIssueOrder,
                                        isWithBox: isWithBox,
                                        isCC: isCC,
                                        timestamp: "2026-05-19 15:10:44"
                                      };
                                      
                                      // Clear flag triggers immediately on simulated input
                                      setIsIssueOrder(false);
                                      setIsCC(false);
                                      setIsWithBox(false);

                                      setInboundRecords([rand, ...inboundRecords]);
                                    }}>
                                      <RefreshCw className="w-3.5 h-3.5" /> 手动刷新 / 模拟加载
                                    </div>
                                  </div>
                                  
                                  <div className="overflow-x-auto w-full">
                                    <table className="w-full border-collapse">
                                      <thead className="bg-[#f8f9fb]">
                                        <tr>
                                          {['ID', '入库员', '商品MID', 'MID/商品名称与电子标签', '商品图片', '入库现场图片', '会员ID', '卖家快递单号', '到付金额', '商品重量/克'].map((h, i) => (
                                            <th key={i} className="py-3 px-4 border border-gray-100 text-[11.5px] font-bold text-gray-650 whitespace-nowrap text-center">
                                              {h}
                                            </th>
                                          ))}
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {inboundRecords.length === 0 ? (
                                          <tr className="border-b border-gray-100">
                                            <td colSpan={10} className="py-20 text-center">
                                              <div className="flex flex-col items-center justify-center opacity-30 text-gray-400">
                                                <div className="w-32 h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                                                  <div className="w-1/2 h-full bg-blue-500/50 animate-shimmer" />
                                                </div>
                                                <p className="text-xs font-medium tracking-[0.2em]">暂无数据</p>
                                              </div>
                                            </td>
                                          </tr>
                                        ) : (
                                          inboundRecords.map((rec) => (
                                            <tr key={rec.id} className="border-b border-gray-100 hover:bg-gray-50/40 text-xs text-center text-gray-700 font-sans transition-colors">
                                              <td className="py-3 px-4 font-mono font-bold text-slate-800">{rec.id}</td>
                                              <td className="py-3 px-4 text-gray-500 font-bold">{rec.operator}</td>
                                              <td className="py-3 px-4 font-mono font-bold text-gray-500">{rec.productMid}</td>
                                              <td className="py-3 px-4 text-left max-w-[260px]">
                                                <div className="font-bold text-gray-800 truncate mb-1" title={rec.productName}>{rec.productName}</div>
                                                <div className="flex flex-wrap gap-1 items-center">
                                                  {rec.boxCode && rec.boxCode !== '未设置' && (
                                                    <span className="bg-indigo-50 border border-indigo-120 text-[#5d5fb1] text-[9.5px] px-1 py-0.5 rounded font-black shadow-sm">
                                                      流转箱: {rec.boxCode}
                                                    </span>
                                                  )}
                                                  {rec.isIssueOrder && (
                                                    <span className="bg-red-50 border border-red-150 text-red-500 text-[9.5px] px-1 py-0.5 rounded font-black shadow-sm">
                                                      问题单
                                                    </span>
                                                  )}
                                                  {rec.isWithBox && (
                                                    <span className="bg-amber-50 border border-amber-150 text-amber-600 text-[9.5px] px-1 py-0.5 rounded font-black shadow-sm">
                                                      含箱重量
                                                    </span>
                                                  )}
                                                   {rec.isCC && (
                                                    <span className="bg-red-50 border border-red-200 text-red-600 text-[9.5px] px-1 py-0.5 rounded font-black shadow-sm animate-pulse">
                                                      高价
                                                    </span>
                                                  )}
                                                </div>
                                              </td>
                                              <td className="py-3 px-4">
                                                <div className="w-12 h-12 rounded border border-gray-100 overflow-hidden mx-auto bg-gray-50 flex items-center justify-center">
                                                  {rec.productImage === "cars-mug" ? (
                                                    <CarsCupSvg />
                                                  ) : rec.productImage === "yoga-bands" ? (
                                                    <ExerciseBandsSvg />
                                                  ) : rec.productImage === "keychain" ? (
                                                    <PawKeychainSvg />
                                                  ) : (
                                                    <img src={rec.productImage} alt="product photo" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                                  )}
                                                </div>
                                              </td>
                                              <td className="py-3 px-4">
                                                <div className="w-12 h-12 rounded border border-gray-150 overflow-hidden mx-auto bg-black relative flex items-center justify-center shadow-inner">
                                                  <img src={rec.inboundImage} alt="inbound package scan" className="w-full h-full object-cover opacity-75" referrerPolicy="no-referrer" />
                                                  <div className="absolute inset-x-0 bottom-0 py-0.5 bg-black/60 text-[7px] text-green-400 font-bold font-mono tracking-tighter">CAM_01</div>
                                                </div>
                                              </td>
                                              <td className="py-3 px-4 font-mono font-bold text-blue-500">{rec.memberId}</td>
                                              <td className="py-3 px-4 font-mono text-gray-500 font-bold">{rec.trackingCode}</td>
                                              <td className="py-3 px-4 text-gray-700 font-black font-mono">{rec.codAmount} 円</td>
                                              <td className="py-3 px-4 text-emerald-600 font-black font-mono">{rec.weight} g</td>
                                            </tr>
                                          )
                                        ))}
                                      </tbody>
                                    </table>
                                    {/* Table Scrollbar Handle Simulation */}
                                    <div className="bg-[#e9ecef] mx-4 my-3 h-1.5 rounded-full relative">
                                      <div className="absolute left-[20%] w-[50%] h-full bg-gray-400/40 rounded-full" />
                                      <ChevronLeft className="absolute -left-3 -top-1 w-3.5 h-3.5 text-gray-400 rotate-180" />
                                      <ChevronRight className="absolute -right-3 -top-1 w-3.5 h-3.5 text-gray-400" />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Circulation Box Modal */}
                              <AnimatePresence>
                                {editBoxType !== null && (
                                  <div className="absolute inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
                                    <motion.div 
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      onClick={() => setEditBoxType(null)}
                                      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                    />
                                    <motion.div 
                                      initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                      animate={{ scale: 1, opacity: 1, y: 0 }}
                                      exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                      className="bg-white rounded-2xl w-full max-w-[380px] shadow-2xl relative z-10 overflow-hidden text-gray-800"
                                    >
                                      {editBoxType === 'high' ? (
                                        // 高价流转箱 单独输入
                                        <>
                                          <div className="bg-red-500 p-5 text-white flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                                              </div>
                                              <div>
                                                <h4 className="font-bold text-sm">修改高价包裹流转箱</h4>
                                                <p className="text-[10px] text-white/70">请输入高价（GJ-）流转箱编码</p>
                                              </div>
                                            </div>
                                            <button onClick={() => setEditBoxType(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                              <X className="w-5 h-5" />
                                            </button>
                                          </div>

                                          <div className="p-6 space-y-4">
                                            <div className="space-y-1.5">
                                              <div className="flex items-center justify-between">
                                                <label className="text-[11px] font-bold text-red-600 uppercase tracking-wider pl-1 font-mono">
                                                  高价商品流转箱编号
                                                </label>
                                                <span className="text-[9px] bg-red-50 text-red-650 font-bold px-1.5 py-0.5 rounded">
                                                  主管每日提供
                                                </span>
                                              </div>
                                              <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                                  <Sparkles className="w-4 h-4 text-red-300 group-focus-within:text-red-550 transition-colors" />
                                                </div>
                                                <input 
                                                  autoFocus
                                                  type="text" 
                                                  placeholder="如: GJ-00000001"
                                                  value={tempVipBoxCode}
                                                  onChange={(e) => {
                                                    setTempVipBoxCode(e.target.value.toUpperCase());
                                                    setVipBoxError(null);
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                      handleSaveBoxes();
                                                    }
                                                  }}
                                                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono focus:border-red-500 focus:bg-white outline-none transition-all shadow-inner"
                                                />
                                              </div>
                                              {vipBoxError ? (
                                                <p className="text-[10.5px] text-rose-500 font-bold pl-1 mt-0.5 animate-pulse">{vipBoxError}</p>
                                              ) : (
                                                <p className="text-[9.5px] text-gray-400 pl-1">由主管发放多位作业员共用，用于高价值包裹专箱跟踪。</p>
                                              )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                              <button 
                                                onClick={() => {
                                                  setVipBoxError(null);
                                                  setEditBoxType(null);
                                                }}
                                                className="py-2.5 px-4 border-2 border-gray-100 text-gray-400 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer select-none"
                                              >
                                                取消
                                              </button>
                                              <button 
                                                onClick={handleSaveBoxes}
                                                className="py-2.5 px-4 bg-red-500 hover:bg-red-650 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-100 active:scale-95 transition-all cursor-pointer select-none"
                                              >
                                                保存设置
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        // 普通流转箱 单独输入
                                        <>
                                          <div className="bg-[#4f46e5] p-5 text-white flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                                                <Warehouse className="w-5 h-5 text-white animate-pulse" />
                                              </div>
                                              <div>
                                                <h4 className="font-bold text-sm">修改普通包裹流转箱</h4>
                                                <p className="text-[10px] text-white/70">请输入普通流转箱编码</p>
                                              </div>
                                            </div>
                                            <button onClick={() => setEditBoxType(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer">
                                              <X className="w-5 h-5" />
                                            </button>
                                          </div>

                                          <div className="p-6 space-y-4">
                                            <div className="space-y-1.5">
                                              <div className="flex items-center justify-between">
                                                <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider pl-1 font-mono">
                                                  普通包裹流转箱编号
                                                </label>
                                                <span className="text-[9px] bg-indigo-50 text-[#4f46e5] font-bold px-1.5 py-0.5 rounded">
                                                  扫码或手动
                                                </span>
                                              </div>
                                              <div className="relative group">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                                  <Code2 className="w-4 h-4 text-gray-300 group-focus-within:text-[#4f46e5] transition-colors" />
                                                </div>
                                                <input 
                                                  autoFocus
                                                  type="text" 
                                                  placeholder="如: DD-00000001"
                                                  value={tempBoxCode}
                                                  onChange={(e) => {
                                                    setTempBoxCode(e.target.value.toUpperCase());
                                                    setBoxError(null);
                                                  }}
                                                  onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                      handleSaveBoxes();
                                                    }
                                                  }}
                                                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-mono focus:border-[#4f46e5] focus:bg-white outline-none transition-all shadow-inner"
                                                />
                                              </div>
                                              {boxError ? (
                                                <p className="text-[10.5px] text-rose-500 font-bold pl-1 mt-0.5 animate-pulse">{boxError}</p>
                                              ) : (
                                                <p className="text-[9.5px] text-gray-400 pl-1">用于存放常规、正常重量与体积的集拼快件。</p>
                                              )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-2">
                                              <button 
                                                onClick={() => {
                                                  setBoxError(null);
                                                  setEditBoxType(null);
                                                }}
                                                className="py-2.5 px-4 border-2 border-gray-100 text-gray-400 text-xs font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer select-none"
                                              >
                                                取消
                                              </button>
                                              <button 
                                                onClick={handleSaveBoxes}
                                                className="py-2.5 px-4 bg-[#4f46e5] hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-100 active:scale-95 transition-all cursor-pointer select-none"
                                              >
                                                保存设置
                                              </button>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                      
                                      <div className="bg-amber-50 border-t border-amber-100 p-4 flex gap-2.5">
                                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                        <div className="text-[9.5px] text-amber-800 leading-normal space-y-1">
                                          <p className="font-bold">高价与普通箱编号逻辑规则：</p>
                                          <p>1. 高价流转箱前缀固定为 <b>GJ-</b>，普通流转箱支持 <b>DD-</b> 或 <b>XX-</b> 前缀。</p>
                                          <p>2. 通过在右侧面板点击对应颜色按钮，即可随时单独修改各自的临时流转编号。</p>
                                        </div>
                                      </div>
                                    </motion.div>
                                  </div>
                                )}
                              </AnimatePresence>
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
