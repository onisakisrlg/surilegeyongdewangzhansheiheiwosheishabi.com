import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, Copy, Check, Info, AlertCircle, X, PackagePlus, Plus, Eye, ChevronRight } from 'lucide-react';
import { MOCK_PACKAGE_ORDERS } from '../constants';

export const Flow20260702 = () => {
  const [appStep, setAppStep] = useState<'list' | 'form'>('list');
  const [selectedPackageOrders, setSelectedPackageOrders] = useState<string[]>([]);
  
  // --- Form State ---
  const [boxType, setBoxType] = useState<string | null>(null);
  const [needAddons, setNeedAddons] = useState<boolean | null>(null);
  
  // Sub 1
  const [sub1_1, setSub1_1] = useState<string[]>([]);
  const [sub1_2, setSub1_2] = useState<string[]>([]);
  const [sub1_3, setSub1_3] = useState<string[]>([]);
  const [sub1_4_count, setSub1_4_count] = useState<number>(0);
  
  // Sub 2
  const [sub2_1, setSub2_1] = useState<string[]>([]);
  const [sub2_2, setSub2_2] = useState<boolean>(false);
  const [sub2_2_count, setSub2_2_count] = useState<number>(1);
  const [sub2_2_agreed, setSub2_2_agreed] = useState<boolean>(false);
  
  // Sub 3
  const [sub3, setSub3] = useState<string | null>(null);
  
  // Sub 4
  const [sub4_1, setSub4_1] = useState<string[]>([]);
  const [sub4_2, setSub4_2] = useState<boolean>(false);
  const [sub4_3, setSub4_3] = useState<boolean>(false);
  const [sub4_4, setSub4_4] = useState<boolean>(false);
  
  // Sub 5
  const [sub5_1, setSub5_1] = useState<boolean>(false);
  const [sub5_2, setSub5_2] = useState<string[]>([]);
  const [sub5_3, setSub5_3] = useState<string[]>([]);
  
  // Sub 6
  const [sub6, setSub6] = useState<boolean>(false);
  const [sub6_agreed, setSub6_agreed] = useState<boolean>(false);
  
  // Note
  const [note, setNote] = useState<string>('');

  // --- Modals State ---
  const [orderModalTarget, setOrderModalTarget] = useState<string | null>(null);
  const [tempOrders, setTempOrders] = useState<string[]>([]);
  const [showImageModal, setShowImageModal] = useState<boolean>(false);
  const [showSub6Modal, setShowSub6Modal] = useState<boolean>(false);

  // Computed
  const { selectedTotalAmount, selectedTotalWeight } = useMemo(() => {
    let amount = 0;
    let weight = 0;
    selectedPackageOrders.forEach(id => {
      const order = MOCK_PACKAGE_ORDERS.find(o => o.id === id);
      if (order) {
        amount += order.price;
        weight += order.weight;
      }
    });
    return { selectedTotalAmount: amount, selectedTotalWeight: weight };
  }, [selectedPackageOrders]);

  const canSubmit = useMemo(() => {
    if (!boxType) return false;
    if (needAddons === null) return false;
    if (needAddons) {
      if (sub2_2 && !sub2_2_agreed) return false;
      if (sub6 && !sub6_agreed) return false;
    }
    return true;
  }, [boxType, needAddons, sub2_2, sub2_2_agreed, sub6, sub6_agreed]);

  // Handle Order Selection Modal
  const openOrderModal = (target: string) => {
    setOrderModalTarget(target);
    let initial: string[] = [];
    if (target === 'sub1_1') initial = sub1_1;
    if (target === 'sub1_2') initial = sub1_2;
    if (target === 'sub1_3') initial = sub1_3;
    if (target === 'sub2_1') initial = sub2_1;
    if (target === 'sub4_1') initial = sub4_1;
    if (target === 'sub5_2') initial = sub5_2;
    if (target === 'sub5_3') initial = sub5_3;
    
    // Auto sync with selectedPackageOrders
    initial = initial.filter(id => selectedPackageOrders.includes(id));
    setTempOrders(initial);
  };

  const confirmOrderModal = () => {
    if (orderModalTarget === 'sub1_1') setSub1_1(tempOrders);
    if (orderModalTarget === 'sub1_2') setSub1_2(tempOrders);
    if (orderModalTarget === 'sub1_3') setSub1_3(tempOrders);
    if (orderModalTarget === 'sub2_1') setSub2_1(tempOrders);
    if (orderModalTarget === 'sub4_1') setSub4_1(tempOrders);
    if (orderModalTarget === 'sub5_2') setSub5_2(tempOrders);
    if (orderModalTarget === 'sub5_3') setSub5_3(tempOrders);
    setOrderModalTarget(null);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#f0f2f5] gap-px overflow-hidden">
      {/* Left Column: APP User Preview View - App */}
      <div className="w-[440px] flex-shrink-0 bg-gray-100 border-r border-gray-200 flex flex-col h-full relative">
        
        {appStep === 'list' && (
          <div className="flex flex-col h-full relative bg-[#f5f5f5]">
            {/* App Header (System Bar & Navbar) */}
            <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-between border-b border-gray-100 shrink-0 sticky top-0 z-20 shadow-sm">
              <button className="p-1 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-lg font-bold text-gray-900 tracking-wide">我的订单</h1>
              <div className="w-8"></div> {/* Spacer for center alignment */}
            </div>
            
            {/* Weight Warning Header */}
            {selectedTotalWeight > 0 && (
              <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-start gap-2 shrink-0">
                <span className="text-[14px] mt-0.5">⚠️</span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-amber-900 mb-0.5">
                    已选商品总重: <span className="font-mono">{selectedTotalWeight}g</span>
                  </span>
                  <span className="text-[11px] text-amber-700/80 leading-relaxed">
                    订单重量仅供参考，可能出现不准确的情况，请勿过度依赖。
                  </span>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white flex items-center px-2 border-b border-gray-100 shrink-0 relative z-10">
              {['交易中', '入库', '出库', '全部', '已取消'].map((tab, idx) => (
                <div key={idx} className="flex-1 text-center py-3 relative cursor-pointer active:bg-gray-50 transition-colors">
                  <span className={`text-[15px] ${tab === '入库' ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>
                    {tab}
                  </span>
                  {tab === '入库' && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-rose-400 rounded-full" />
                  )}
                </div>
              ))}
            </div>

            {/* Search & Filter */}
            <div className="bg-white px-3 py-3 flex gap-2 shrink-0 relative z-10 border-b border-gray-100">
              <div className="flex-1 bg-gray-50 rounded-full flex items-center px-4 h-9 border border-gray-100">
                <input 
                  type="text" 
                  placeholder="入库编号，订单号" 
                  className="bg-transparent text-sm w-full outline-none placeholder-gray-400 font-medium"
                />
                <Search className="w-4 h-4 text-gray-500" />
              </div>
              <button className="bg-gray-50 rounded-full h-9 px-4 flex items-center gap-1.5 border border-gray-100 active:scale-95 transition-transform text-sm text-gray-600 font-medium">
                筛选 <span className="text-rose-400 text-xs font-bold border-l border-gray-200 pl-1.5 ml-0.5">全部</span>
              </button>
            </div>

            {/* Scrollable List Content */}
            <div className="flex-1 overflow-y-auto pb-32">
              {MOCK_PACKAGE_ORDERS.map((order) => {
                const isSelected = selectedPackageOrders.includes(order.id);
                return (
                  <div key={order.id} className="bg-white m-3 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
                    <div className="px-3 py-3 border-b border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] text-gray-700 font-medium">入库编号:{order.id}</span>
                        <Copy className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600 active:scale-90 transition-all" />
                      </div>
                      <span className="text-[13px] text-rose-500 font-bold">可出库</span>
                    </div>
                    <div className="p-3 flex items-center gap-3">
                      <div 
                        onClick={() => {
                          setSelectedPackageOrders(prev => 
                            prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id]
                          );
                        }}
                        className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-colors ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <div className="w-24 h-24 rounded-lg bg-gray-100 relative overflow-hidden shrink-0 border border-gray-100">
                        <img src={order.image} alt="Product" className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 text-white text-[10px] px-1.5 py-0.5 font-bold rounded-br-lg shadow-sm" style={{ backgroundColor: order.color }}>
                          {order.platform}
                        </div>
                      </div>
                      <div className="flex-1 flex flex-col justify-between h-24 py-0.5">
                        <div>
                          <h3 className="text-[13.5px] font-bold text-gray-800 leading-snug line-clamp-2">{order.title}</h3>
                          <div className="mt-1">
                            <span className="bg-pink-400/90 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm">优购</span>
                          </div>
                        </div>
                        <div className="flex flex-col mt-auto">
                          <span className="text-[11px] text-gray-400 font-medium tracking-wide">重量: {order.weight}g</span>
                          <span className="text-base text-rose-500 font-bold font-mono tracking-tight -mb-1 mt-0.5">{order.price} <span className="text-xs">円</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="text-center py-6 text-[13px] text-gray-400 font-medium">没有更多数据了</div>
            </div>

            {/* Bottom Action Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] z-30 pb-safe">
              <div className="px-4 py-2 flex items-center justify-between border-b border-gray-50">
                <span className="text-[13px] font-medium text-gray-800">已选总金额: <span className="font-mono">{selectedTotalAmount} 円({(selectedTotalAmount * 0.0508).toFixed(2)}元)</span></span>
                <span className="text-[13px] font-medium text-gray-800">已选总重: <span className="font-mono">{selectedTotalWeight}g</span></span>
              </div>
              <div className="px-4 py-2 flex items-center justify-between gap-3">
                <button 
                  onClick={() => setSelectedPackageOrders([])}
                  className="px-6 py-2.5 rounded-full border border-blue-400 text-blue-500 text-sm font-bold active:bg-blue-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={() => {
                    if (selectedPackageOrders.length > 0) setAppStep('form');
                  }}
                  className={`px-8 py-2.5 rounded-full text-sm font-bold shadow-sm transition-transform ${selectedPackageOrders.length > 0 ? 'bg-[#ffd200] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400'}`}
                >
                  申请打包
                </button>
              </div>
            </div>
          </div>
        )}

        {appStep === 'form' && (
          <div className="flex flex-col h-full relative bg-[#f5f5f5]">
            <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-center border-b border-gray-100 shrink-0 sticky top-0 z-20 shadow-sm relative">
              <button onClick={() => setAppStep('list')} className="absolute left-4 p-1 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-lg font-bold text-gray-900 tracking-wide">申请打包</h1>
            </div>

            {/* Weight Warning Header for Form */}
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-start gap-2 shrink-0">
              <span className="text-[14px] mt-0.5">⚠️</span>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-amber-900 mb-0.5">
                  已选商品总重: <span className="font-mono">{selectedTotalWeight}g</span>
                </span>
                <span className="text-[11px] text-amber-700/80 leading-relaxed">
                  订单重量仅供参考，可能出现不准确的情况，请勿过度依赖。
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-32">
              <div className="px-4 py-4 space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-[15px] font-bold text-gray-800">包裹处理需求调查表</h2>
                  <p className="text-[12px] text-gray-500 mt-1">根据您的实际需求，为您定制打包方案</p>
                </div>

                {/* Section 1 */}
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border-t-[3px] border-blue-400 overflow-hidden">
                  <div className="bg-blue-50/50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-600 text-[11px] font-bold px-1.5 py-0.5 rounded">第一部分</span>
                    <h3 className="text-[14px] font-bold text-gray-800">箱子使用方式 <span className="text-rose-500 font-normal text-[12px]">(请选择一项，必选)</span></h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {[
                      { id: 'b1', title: '只用入库时自带纸箱/海报筒', desc: '若入库时不带纸箱或纸箱不合适，仓库将默认换成收费箱。选择此选项可能无法有效控制包裹体积。若自带箱不便于长途运输，仓库将默认换成收费箱。' },
                      { id: 'b2', title: '使用免费箱（邮局/宅急便）', desc: '若包裹预估超重、超体积，或仓库无免费箱库存，无法使用免费箱时，仓库将默认换成收费箱。' },
                      { id: 'b3', title: '我不清楚，使用收费箱', desc: '保底选项，无任何限制，仓库根据实际尺寸选用最合适的收费纸箱。' },
                      { id: 'b4', title: '我的商品是海报/挂画，使用收费海报筒', desc: '保底选项，无任何限制，专门保护长条形易折商品。' },
                    ].map(opt => (
                      <div 
                        key={opt.id}
                        onClick={() => setBoxType(opt.id)}
                        className={`p-3 rounded-lg border flex items-start gap-3 cursor-pointer transition-colors ${boxType === opt.id ? 'border-blue-500 bg-blue-50/30' : 'border-gray-200 bg-white hover:border-blue-200'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${boxType === opt.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                          {boxType === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-gray-800 leading-snug">{opt.title}</div>
                          <div className="text-[11px] text-gray-500 mt-1.5 leading-relaxed bg-gray-50 p-2 rounded">※ {opt.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 2 */}
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border-t-[3px] border-emerald-400 overflow-hidden">
                  <div className="bg-emerald-50/50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-600 text-[11px] font-bold px-1.5 py-0.5 rounded">第二部分</span>
                    <h3 className="text-[14px] font-bold text-gray-800">附加服务</h3>
                  </div>
                  <div className="p-3">
                    <div className="text-[13px] font-bold text-gray-800 mb-3">您是否需要任何附加服务？</div>
                    <div className="flex flex-col gap-2">
                      <div 
                        onClick={() => setNeedAddons(false)}
                        className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${needAddons === false ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${needAddons === false ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                          {needAddons === false && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div className="text-[13px] font-bold text-gray-800">不需要任何附加服务 <span className="text-[11px] text-gray-400 font-normal">(选中后下方全部隐藏)</span></div>
                      </div>
                      <div 
                        onClick={() => setNeedAddons(true)}
                        className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${needAddons === true ? 'border-emerald-500 bg-emerald-50/30' : 'border-gray-200 bg-white'}`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${needAddons === true ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                          {needAddons === true && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div className="text-[13px] font-bold text-gray-800">我需要附加服务 <span className="text-[11px] text-gray-400 font-normal">(选中后展开下方列表)</span></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-sections (Only show if needAddons is true) */}
                {needAddons === true && (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 justify-center py-2">
                      <div className="h-px bg-gray-300 flex-1" />
                      <span className="text-[12px] text-gray-500 font-medium">展开服务列表</span>
                      <div className="h-px bg-gray-300 flex-1" />
                    </div>

                    {/* Sub 1 */}
                    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-100">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-800">【子类1】加固 (可多选)</span>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => sub1_1.length > 0 ? setSub1_1([]) : openOrderModal('sub1_1')}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub1_1.length > 0 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub1_1.length > 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">每个订单外泡泡膜加固</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">100块/订单</span>
                            <button onClick={() => openOrderModal('sub1_1')} className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-600 active:scale-95">+</button>
                            <button onClick={() => setShowImageModal(true)} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[11px] font-bold active:scale-95 flex items-center gap-1"><Eye className="w-3 h-3"/>查看示例</button>
                          </div>
                        </div>
                        {sub1_1.length > 0 && <div className="ml-6 text-[10px] text-rose-500 font-bold">已选 {sub1_1.length} 单</div>}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => sub1_2.length > 0 ? setSub1_2([]) : openOrderModal('sub1_2')}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub1_2.length > 0 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub1_2.length > 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">每个订单单独纸板加固</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">100块/订单</span>
                            <button onClick={() => openOrderModal('sub1_2')} className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-600 active:scale-95">+</button>
                            <button onClick={() => setShowImageModal(true)} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[11px] font-bold active:scale-95 flex items-center gap-1"><Eye className="w-3 h-3"/>查看示例</button>
                          </div>
                        </div>
                        {sub1_2.length > 0 && <div className="ml-6 text-[10px] text-rose-500 font-bold">已选 {sub1_2.length} 单</div>}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => sub1_3.length > 0 ? setSub1_3([]) : openOrderModal('sub1_3')}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub1_3.length > 0 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub1_3.length > 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">每个订单纸板+泡泡膜加固</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">150块/订单</span>
                            <button onClick={() => openOrderModal('sub1_3')} className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-600 active:scale-95">+</button>
                            <button onClick={() => setShowImageModal(true)} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[11px] font-bold active:scale-95 flex items-center gap-1"><Eye className="w-3 h-3"/>查看示例</button>
                          </div>
                        </div>
                        {sub1_3.length > 0 && <div className="ml-6 text-[10px] text-rose-500 font-bold">已选 {sub1_3.length} 单</div>}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => setSub1_4_count(prev => prev > 0 ? 0 : 10)}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub1_4_count > 0 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub1_4_count > 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">徽章寿司卷加固</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">100块/每10个</span>
                            {sub1_4_count > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-[11px]">数量:</span>
                                <input 
                                  type="number" 
                                  value={sub1_4_count || ''}
                                  onChange={(e) => setSub1_4_count(Number(e.target.value) || 0)}
                                  placeholder="10的倍数"
                                  className="w-16 h-6 border rounded text-[11px] px-1 text-center bg-gray-50 outline-none focus:border-blue-300"
                                />
                                <span className="text-[11px]">个</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sub 2 */}
                    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-100">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-800">【子类2】拆纸板和丢弃 (可多选)</span>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => sub2_1.length > 0 ? setSub2_1([]) : openOrderModal('sub2_1')}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub2_1.length > 0 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub2_1.length > 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">拆纸板</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">50块/订单</span>
                            <button onClick={() => openOrderModal('sub2_1')} className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-600 active:scale-95">+</button>
                          </div>
                        </div>
                        {sub2_1.length > 0 && <div className="ml-6 text-[10px] text-rose-500 font-bold">已选 {sub2_1.length} 单</div>}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => {
                                setSub2_2(!sub2_2);
                                if (sub2_2) setSub2_2_agreed(false);
                              }}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub2_2 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub2_2 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">丢弃其他物品</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">200块 起</span>
                            {sub2_2 && (
                              <div className="flex items-center gap-1">
                                <span className="text-[11px]">份数:</span>
                                <input 
                                  type="number" 
                                  value={sub2_2_count}
                                  onChange={(e) => setSub2_2_count(Number(e.target.value) || 1)}
                                  className="w-10 h-6 border rounded text-[11px] px-1 text-center bg-gray-50 outline-none focus:border-blue-300"
                                />
                                <span className="text-[11px]">份</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {sub2_2 && (
                          <div className="ml-6 mt-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
                            <div className="text-[11px] font-bold text-amber-800 mb-2">⚠️ 您已勾选“丢弃其他物品”，请确认以下授权：</div>
                            <div className="flex items-start gap-2">
                              <div 
                                onClick={() => setSub2_2_agreed(!sub2_2_agreed)}
                                className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${sub2_2_agreed ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}
                              >
                                {sub2_2_agreed && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-[11px] text-amber-900 leading-relaxed cursor-pointer" onClick={() => setSub2_2_agreed(!sub2_2_agreed)}>
                                我同意：若实际丢弃数量超出我购买的份数，授权仓库按实际数量追加收费。
                                <div className="text-gray-500 mt-1 font-bold">(此授权复选框未打勾时，【提交】按钮不可用)</div>
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Sub 3 */}
                    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-100">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-800">【子类3】分箱 (请选择一项，互斥单选)</span>
                      </div>
                      <div className="p-3 space-y-2">
                        {[
                          { id: '20', title: '低于20个商品分箱', price: '200块/箱' },
                          { id: '30', title: '低于30个商品分箱', price: '300块/箱' },
                          { id: '50', title: '低于50个商品分箱', price: '500块/箱' },
                          { id: 'custom', title: '指定分箱', price: '500块/箱', extra: '(请在备注写明要求)' }
                        ].map(opt => (
                          <div 
                            key={opt.id}
                            onClick={() => setSub3(sub3 === opt.id ? null : opt.id)}
                            className="flex items-center justify-between cursor-pointer group"
                          >
                            <div className="flex items-center gap-2 py-1">
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${sub3 === opt.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                {sub3 === opt.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                              </div>
                              <span className="text-[13px] text-gray-800">{opt.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-gray-500 w-16 text-right">{opt.price}</span>
                              {opt.extra && <span className="text-[11px] text-gray-400">{opt.extra}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sub 4 */}
                    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-100">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-800">【子类4】取出订单 (可多选)</span>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => sub4_1.length > 0 ? setSub4_1([]) : openOrderModal('sub4_1')}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub4_1.length > 0 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub4_1.length > 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">指定取出</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">200块/单</span>
                            <button onClick={() => openOrderModal('sub4_1')} className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-600 active:scale-95">+</button>
                          </div>
                        </div>
                        {sub4_1.length > 0 && <div className="ml-6 text-[10px] text-rose-500 font-bold">已选 {sub4_1.length} 单</div>}

                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setSub4_2(!sub4_2)}>
                          <div className="flex items-center gap-2 flex-1 py-1">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub4_2 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                              {sub4_2 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">随机取出</span>
                          </div>
                          <span className="text-[11px] text-gray-500">100块/单</span>
                        </div>

                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setSub4_3(!sub4_3)}>
                          <div className="flex items-center gap-2 flex-1 py-1">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub4_3 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                              {sub4_3 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">简单拆分</span>
                          </div>
                          <span className="text-[11px] text-gray-500">200块</span>
                        </div>

                        <div className="flex items-center justify-between cursor-pointer" onClick={() => setSub4_4(!sub4_4)}>
                          <div className="flex items-center gap-2 flex-1 py-1">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub4_4 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                              {sub4_4 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">指定拆分</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500">500块</span>
                            <span className="text-[11px] text-gray-400 font-normal">(请在备注写明要求)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sub 5 */}
                    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-100">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-800">【子类5】电池相关 (可多选，有强依赖规则)</span>
                      </div>
                      <div className="p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 py-1 cursor-pointer" onClick={() => setSub5_1(!sub5_1)}>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub5_1 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                              {sub5_1 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">检查电池</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500">100块</span>
                            <button onClick={() => setSub5_1(!sub5_1)} className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-600 active:scale-95">+</button>
                          </div>
                        </div>

                        <div className="ml-6 bg-rose-50 p-2.5 rounded border border-rose-100">
                          <div className="text-[11px] font-bold text-rose-800 mb-1">🔴 重要提醒：</div>
                          <div className="text-[10px] text-rose-700 leading-relaxed">
                            勾选“检查电池”时，建议同时勾选下方“丢弃电池”或“内置电池”。<br/>
                            若未搭配，则仅执行拍照检查，检查费(100块)不退；未搭配的丢弃/内置费用将自动退回。
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => sub5_2.length > 0 ? setSub5_2([]) : openOrderModal('sub5_2')}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub5_2.length > 0 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub5_2.length > 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">丢弃电池</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">100块/订单</span>
                            <button onClick={() => openOrderModal('sub5_2')} className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-600 active:scale-95">+</button>
                          </div>
                        </div>
                        {sub5_2.length > 0 && <div className="ml-6 text-[10px] text-rose-500 font-bold">已选 {sub5_2.length} 单</div>}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 pr-2">
                            <div 
                              onClick={() => sub5_3.length > 0 ? setSub5_3([]) : openOrderModal('sub5_3')}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub5_3.length > 0 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}
                            >
                              {sub5_3.length > 0 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">内置电池</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-[11px] text-gray-500 w-16 text-right">100块/订单</span>
                            <button onClick={() => openOrderModal('sub5_3')} className="px-2 py-0.5 bg-gray-100 rounded text-[11px] font-bold text-gray-600 active:scale-95">+</button>
                          </div>
                        </div>
                        {sub5_3.length > 0 && <div className="ml-6 text-[10px] text-rose-500 font-bold">已选 {sub5_3.length} 单</div>}
                      </div>
                    </div>

                    {/* Sub 6 */}
                    <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] overflow-hidden border border-gray-100">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-800">【子类6】定制服务 (特殊单项)</span>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <div 
                            className="flex items-center gap-2 flex-1 py-1 cursor-pointer" 
                            onClick={() => {
                              const nextVal = !sub6;
                              setSub6(nextVal);
                              if (nextVal) {
                                setShowSub6Modal(true);
                              } else {
                                setSub6_agreed(false);
                              }
                            }}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${sub6 ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                              {sub6 && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <span className="text-[13px] text-gray-800 leading-tight">我不知道该怎么选，需要定制服务</span>
                          </div>
                          <span className="text-[11px] text-gray-500">500日元定制费</span>
                        </div>
                        {sub6 && sub6_agreed && (
                          <div className="ml-6 mt-1 text-[11px] text-emerald-600 font-bold">✓ 已知悉定制服务规则</div>
                        )}
                      </div>
                    </div>
                    
                    {/* Sub 7 */}
                    <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 border-dashed opacity-60">
                      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex items-center gap-2">
                        <span className="text-[13px] font-bold text-gray-500">【子类7】整箱优购免费附加</span>
                      </div>
                      <div className="p-3 text-center text-[12px] text-gray-400">
                        (此子类当前暂不开放，待定)
                      </div>
                    </div>

                  </div>
                )}
                
                {/* Note Field */}
                <div className="bg-white rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-gray-200 overflow-hidden mt-4">
                  <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                    <span className="text-[13px] font-bold text-gray-800">备注栏 (选填)</span>
                  </div>
                  <div className="p-3">
                    <textarea 
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="[ 如有其他特殊需求，请在此处填写 ]"
                      className="w-full h-20 bg-gray-50 border border-gray-200 rounded-lg p-3 text-[13px] resize-none focus:outline-none focus:border-blue-400 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="bg-white p-4 border-t border-gray-200 absolute bottom-0 left-0 right-0 z-30 pb-safe shadow-[0_-4px_16px_rgba(0,0,0,0.03)] shrink-0">
              <button 
                className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-sm text-sm ${canSubmit ? 'bg-[#ffd200] hover:bg-[#f5c900] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
              >
                {canSubmit ? '提交' : '请完善必选项'}
              </button>
              <div className="text-center mt-2 text-[10px] text-gray-400">(提交前自动校验所有规则)</div>
            </div>
          </div>
        )}

      </div>

      {/* Right Column: Management Backend View */}
      <div className="flex-1 overflow-y-auto bg-white p-4 md:p-8 space-y-6 relative">
        <div className="bg-white pb-4 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-base font-bold text-gray-800">管理端后台预览</h2>
          <div className="flex gap-2">
            <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-1 rounded border border-blue-100 uppercase">Admin Role</span>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
          <p className="text-[13px] text-gray-500 font-medium">请在左侧预览移动端流程。</p>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* Order Selection Modal */}
      {orderModalTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-[360px] max-w-[90%] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-gray-800">可操作订单列表</h3>
              <button onClick={() => setOrderModalTarget(null)} className="p-1 active:scale-95"><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {selectedPackageOrders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-[13px]">暂无可操作订单</div>
              ) : (
                selectedPackageOrders.map(id => {
                  const order = MOCK_PACKAGE_ORDERS.find(o => o.id === id);
                  if (!order) return null;
                  const isChecked = tempOrders.includes(id);
                  return (
                    <div 
                      key={id} 
                      onClick={() => setTempOrders(prev => prev.includes(id) ? prev.filter(tid => tid !== id) : [...prev, id])}
                      className={`p-3 m-1 border rounded-xl flex items-center gap-3 cursor-pointer transition-colors ${isChecked ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-white hover:border-blue-200'}`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                        {isChecked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                        <img src={order.image} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div className="text-[12px] font-bold text-gray-800 line-clamp-1">{order.title}</div>
                        <div className="text-[11px] text-gray-500 mt-0.5">{order.id}</div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
              <button 
                onClick={confirmOrderModal}
                className="w-full bg-[#ffd200] hover:bg-[#f5c900] text-gray-900 font-bold py-3 rounded-xl active:scale-95 transition-all shadow-sm text-[13px]"
              >
                确认返回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Example Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-[90%] max-h-[90vh]">
            <img src="https://images.unsplash.com/photo-1626244799015-6435c43d3b73?auto=format&fit=crop&w=600&q=80" alt="示例" className="rounded-xl shadow-2xl" />
            <button className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95">
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}

      {/* Sub 6 Alert Modal */}
      {showSub6Modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-[320px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2 text-[15px]">⚠️ 勾选后将弹出提醒</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                “请务必联系客服额外说明具体需求，否则定制无法执行，费用不退。”
              </p>
            </div>
            <div className="border-t border-gray-100 flex">
              <button 
                onClick={() => {
                  setSub6(false);
                  setSub6_agreed(false);
                  setShowSub6Modal(false);
                }}
                className="flex-1 py-3.5 text-[13px] font-bold text-gray-500 active:bg-gray-50 border-r border-gray-100"
              >
                联系客服
              </button>
              <button 
                onClick={() => {
                  setSub6_agreed(true);
                  setShowSub6Modal(false);
                }}
                className="flex-1 py-3.5 text-[13px] font-bold text-blue-500 active:bg-blue-50"
              >
                我已了解，继续
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
