import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Check, Copy, Search, Filter, AlertTriangle, Package, Info, Edit2, Plus, X } from 'lucide-react';
import { MOCK_PACKAGE_ORDERS } from '../constants';

const LOGISTICS_INTENTS = [
  { 
    id: 'pg_route', 
    title: '【蒲公英专线】', 
    desc: '⚠️注意：蒲公英专线涉及人工审核，打包后切换非蒲公英需支付额外费用。',
    adminTags: ['蒲公英', '人工预审', '尽可能紧凑'],
    adminIntent: '蒲公英路线',
    hasSubOptions: true,
    subOptions: [
      {
        id: 'pg_sf',
        title: '蒲公英-顺丰国际',
        desc: '【必须使用付费新箱】顺丰官方直邮。',
        adminTags: ['【蒲公英】', '顺丰', '强制新箱'],
        adminIntent: '蒲公英-顺丰国际',
        requireNewBox: true,
      },
      {
        id: 'pg_jd',
        title: '蒲公英-京东物流',
        desc: '【必须使用付费新箱】时效快，派送质量高。',
        adminTags: ['【蒲公英】', '京东', '强制新箱'],
        adminIntent: '蒲公英-京东物流',
        requireNewBox: true,
      }
    ]
  },
  { 
    id: 'vol_weight_non_pg', 
    title: '体积重量取大值 (常规杂货)', 
    desc: '涵盖各类专线杂货路线。发此路线需兼顾体积与实重，打包员会尽量压缩体积。',
    adminTags: ['常规纸箱', '严格控制体积', '尽可能紧凑'],
    adminIntent: '控制体积重路线',
    hasSubOptions: true,
    subOptions: [
      {
        id: 'sf_za',
        title: '顺丰杂货',
        desc: '常规包装。',
        adminTags: ['顺丰', '杂货'],
        adminIntent: '顺丰杂货',
        requireNewBox: false,
        maxOrders: 20
      },
      {
        id: 'sf_shipin',
        title: '顺丰饰品专线',
        desc: '适合小包裹。',
        adminTags: ['顺丰', '饰品'],
        adminIntent: '顺丰饰品专线',
        requireNewBox: false,
        maxOrders: 20
      },
      {
        id: 'sf_clothes',
        title: '顺丰衣物特快小包',
        desc: '适合衣物。',
        adminTags: ['顺丰', '衣物特快小包'],
        adminIntent: '顺丰衣物特快小包',
        requireNewBox: false,
        maxOrders: 20
      },
      {
        id: 'sf_dolls',
        title: '顺丰娃娃专线',
        desc: '适合娃娃及相关配件。',
        adminTags: ['顺丰', '娃娃专线'],
        adminIntent: '顺丰娃娃专线',
        requireNewBox: false,
        maxOrders: 20
      },
      {
        id: 'sf_shouban',
        title: '顺丰手办玩偶专线',
        desc: '适合手办等需保护物品。',
        adminTags: ['顺丰', '手办玩偶'],
        adminIntent: '顺丰手办玩偶专线',
        requireNewBox: false,
        maxOrders: 20
      },
      {
        id: 'zt_za',
        title: '中通杂货',
        desc: '高性价比专线。',
        adminTags: ['中通', '杂货'],
        adminIntent: '中通杂货',
        requireNewBox: false,
        maxOrders: 20
      },
      {
        id: 'st_za',
        title: '申通杂货',
        desc: '经济实惠专线。',
        adminTags: ['申通', '杂货'],
        adminIntent: '申通杂货',
        requireNewBox: false,
        maxOrders: 20
      }
    ]
  },
  { 
    id: 'pure_weight', 
    title: '纯重量路线 (不看体积)', 
    desc: '发此路线不看体积重，只需注意实重。打包员无需刻意挤压体积。',
    adminTags: ['常规纸箱', '无视体积重'],
    adminIntent: '纯重量路线'
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
        desc: '【仅限衣物】仅使用打包袋，不使用纸箱！\n⚠️ 若有易碎品破损自负。',
        adminTags: ['【袋装】', '禁用纸箱', '衣服专线'],
        adminIntent: '衣服专线',
        isDanger: true,
        isBag: true
      },
      {
        id: 'dolls',
        title: '玩偶专线',
        desc: '【仅限毛绒玩偶】使用快递袋打包，不使用纸箱以减少体积重。',
        adminTags: ['【袋装】', '禁用纸箱', '玩偶专线'],
        adminIntent: '玩偶专线',
        isDanger: true,
        isBag: true
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
  },
  { 
    id: 'default', 
    title: '我不知道，打包后再看看', 
    desc: '暂不确定线路，仓库按常规标准使用纸箱打包',
    adminTags: ['常规纸箱', '正常打包'],
    adminIntent: '未指定路线'
  }
];

const BOX_OPTIONS = [
  { id: 'free_box', title: '免费旧箱', desc: '使用仓库二手纸箱打包。若选择了袋装路线，会使用快递袋。', price: 0 },
  { id: 'new_box', title: '付费新箱', desc: '使用全新加厚纸箱打包，更安全。', price: 200 },
  { id: 'original_box', title: '岛内原箱', desc: '要求此次合单中某单的原箱可用，默认使用其中最大的原箱来装下所有订单。', price: 0 }
];

export function Flow20260708() {
  const [appStep, setAppStep] = useState<'list' | 'form'>('list');
  const [selectedPackageOrders, setSelectedPackageOrders] = useState<string[]>([]);
  
  const [logisticsIntent, setLogisticsIntent] = useState<string>('pg_route');
  const [specificRoute, setSpecificRoute] = useState<string>('pg_sf');
  
  const [boxOption, setBoxOption] = useState<string>('free_box');
  const [weightControlOption, setWeightControlOption] = useState<string>('no_control');
  const [specifiedRemoveOrder, setSpecifiedRemoveOrder] = useState<string | null>(null);
  const [showOrderSelectModal, setShowOrderSelectModal] = useState<boolean>(false);
  const [packagingOption, setPackagingOption] = useState<string>('remove_shipping');
  const [valueAddedServices, setValueAddedServices] = useState<string[]>([]);
  
  const [orderServices, setOrderServices] = useState<Record<string, { service: string, remark: string }>>({});
  const [showOrderServiceModal, setShowOrderServiceModal] = useState<string | null>(null);
  const [editingServiceType, setEditingServiceType] = useState<string>('单件丢弃');
  const [editingServiceRemark, setEditingServiceRemark] = useState<string>('');
  
  const [formActiveStep, setFormActiveStep] = useState(1);
  const [boxConfirmModal, setBoxConfirmModal] = useState<{show: boolean, targetBox: string, targetBoxTitle: string, routeTitle: string, isBagConflict?: boolean} | null>(null);
  
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const step4Ref = useRef<HTMLDivElement>(null);
  const step5Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formActiveStep === 2 && step2Ref.current) {
      setTimeout(() => step2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (formActiveStep === 3 && step3Ref.current) {
      setTimeout(() => step3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (formActiveStep === 4 && step4Ref.current) {
      setTimeout(() => step4Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    } else if (formActiveStep === 5 && step5Ref.current) {
      setTimeout(() => step5Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }, [formActiveStep]);
  
  const selectedTotalAmount = selectedPackageOrders.reduce((sum, id) => {
    return sum + (MOCK_PACKAGE_ORDERS.find(o => o.id === id)?.price || 0);
  }, 0);
  
  const selectedTotalWeight = selectedPackageOrders.reduce((sum, id) => {
    return sum + (MOCK_PACKAGE_ORDERS.find(o => o.id === id)?.weight || 0);
  }, 0);

  const toggleOrder = (id: string) => {
    setSelectedPackageOrders(prev => {
      const next = prev.includes(id) ? prev.filter(orderId => orderId !== id) : [...prev, id];
      if (!next.includes(id) && orderServices[id]) {
        // If unselected, maybe remove the service? The user said "if the user has an additional service for an order, give them a button when they check the order". So if they uncheck, we could either keep or clear it. Let's keep it in state, it just won't be visible/used.
      }
      return next;
    });
  };

  const openOrderServiceModal = (orderId: string) => {
    if (orderServices[orderId]) {
      setEditingServiceType(orderServices[orderId].service);
      setEditingServiceRemark(orderServices[orderId].remark);
    } else {
      setEditingServiceType('单件丢弃');
      setEditingServiceRemark('');
    }
    setShowOrderServiceModal(orderId);
  };

  const AdminView = () => {
    let currentIntent = LOGISTICS_INTENTS.find(i => i.id === logisticsIntent) || LOGISTICS_INTENTS[0];
    if (currentIntent.hasSubOptions) {
      const subRoute = currentIntent.subOptions?.find(r => r.id === specificRoute);
      if (subRoute) {
        currentIntent = {
          ...currentIntent,
          adminIntent: subRoute.adminIntent,
          adminTags: subRoute.adminTags
        };
      }
    }
    
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
                  <span className="px-2.5 py-1 text-[13px] font-bold rounded bg-blue-100 text-blue-700 border border-blue-200">
                    {BOX_OPTIONS.find(o => o.id === boxOption)?.title}
                  </span>
                  {currentIntent.adminTags.map(tag => (
                    <span key={tag} className={`px-2.5 py-1 text-[13px] font-bold rounded ${tag.includes('袋装') ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="h-px bg-gray-100" />
            
            <div className="flex gap-4 items-start">
              <div className="w-32 text-[13px] font-bold text-gray-600 shrink-0 mt-1">内部包装与加固</div>
              <div className="flex-1 space-y-2">
                <div className="text-[13px] text-gray-900">
                  <span className="font-bold">拆包:</span> {packagingOption === 'keep_all' ? '保留所有包装' : packagingOption === 'remove_shipping' ? '仅拆除快递箱' : '拆除所有外包装'}
                </div>
                {valueAddedServices.length > 0 && (
                  <div className="text-[13px] text-gray-900">
                    <span className="font-bold">加固/其他:</span> {valueAddedServices.map(v => v === 'photo' ? '拍照核验' : '气泡膜加固').join('、')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#f0f2f5] gap-px overflow-hidden">
      {/* Left Column: APP View */}
      <div className="w-[375px] shrink-0 border-r border-gray-200 bg-[#f5f5f5] flex flex-col relative font-sans">
        
        {appStep === 'list' && (
          <div className="flex flex-col h-full relative">
            <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-between border-b border-gray-100 shrink-0 sticky top-0 z-20">
              <button className="p-1 active:scale-95 transition-transform -ml-1">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-[17px] font-medium text-gray-900 tracking-wide">我的订单</h1>
              <div className="w-8"></div>
            </div>

            <div className="bg-white px-4 flex items-center justify-between border-b border-gray-100 text-[14px]">
              <div className="py-2.5 text-gray-500 cursor-pointer">交易中</div>
              <div className="py-2.5 text-[#d1586e] border-b-2 border-[#d1586e] font-medium">入库</div>
              <div className="py-2.5 text-gray-500 cursor-pointer">出库</div>
              <div className="py-2.5 text-gray-500 cursor-pointer">全部</div>
              <div className="py-2.5 text-gray-500 cursor-pointer">已取消</div>
            </div>
            
            <div className="bg-white p-3 flex gap-2 border-b border-gray-100">
              <div className="flex-1 bg-gray-100 rounded-full flex items-center px-3 py-1.5">
                <input type="text" placeholder="入库编号，订单号" className="bg-transparent border-none outline-none text-[13px] w-full text-gray-700 placeholder-gray-400" />
                <Search className="w-4 h-4 text-gray-400 shrink-0" />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 text-[13px]">
                筛选 <div className="w-px h-3 bg-gray-300" /> <span className="text-[#d1586e]">全部平台/日期</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-[#f5f5f5] pb-32">
              {MOCK_PACKAGE_ORDERS.map((order) => {
                const isSelected = selectedPackageOrders.includes(order.id);
                return (
                  <div key={order.id} className="bg-white m-3 rounded-lg shadow-sm overflow-hidden border border-gray-100">
                    <div className="px-3 py-2.5 border-b border-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] text-gray-700 font-medium">入库编号:{order.id}</span>
                        <Copy className="w-3.5 h-3.5 text-gray-400 cursor-pointer hover:text-gray-600" />
                      </div>
                      <span className="text-[13px] text-[#d1586e] font-medium">可出库</span>
                    </div>
                    
                    <div className="p-3 flex items-center gap-3">
                      <div 
                        onClick={() => toggleOrder(order.id)}
                        className={`w-5 h-5 rounded flex items-center justify-center shrink-0 cursor-pointer transition-colors ${isSelected ? 'border border-[#1677ff] bg-white' : 'border border-gray-300 bg-white'}`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-[#1677ff]" strokeWidth={3} />}
                      </div>
                      
                      <div className="w-20 h-20 rounded bg-gray-100 relative overflow-hidden shrink-0 border border-gray-100">
                        <img src={order.image} alt="Product" className="w-full h-full object-cover" />
                        <div className="absolute top-0 left-0 text-white text-[10px] px-1.5 py-0.5 rounded-br" style={{ backgroundColor: order.color }}>
                          {order.platform}
                        </div>
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between h-20 py-0.5 min-w-0">
                        <div className="min-w-0">
                          <h3 className="text-[13px] font-medium text-gray-800 leading-snug truncate">{order.title}</h3>
                          <div className="inline-block px-1.5 py-0.5 bg-[#d1586e] text-white rounded text-[10px] mt-1">优购</div>
                        </div>
                        <div className="flex flex-col mt-auto">
                          <span className="text-[11px] text-gray-400">重量: {order.weight}g</span>
                          <div className="flex items-center justify-between mt-0.5">
                            <span className="text-[15px] text-[#d1586e] font-medium">{order.price} 円</span>
                            {isSelected && (
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openOrderServiceModal(order.id);
                                }}
                                className="flex items-center gap-1 text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 active:bg-blue-100 transition-colors"
                              >
                                {orderServices[order.id] ? (
                                  <>
                                    <Edit2 className="w-3 h-3" />
                                    {orderServices[order.id].service}
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3 h-3" />
                                    附加项
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          {isSelected && orderServices[order.id] && orderServices[order.id].remark && (
                            <div className="mt-1.5 text-[11px] text-blue-800 bg-blue-50/50 p-1.5 rounded border border-blue-100/50 break-all leading-snug">
                              备注: {orderServices[order.id].remark}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="text-center py-4 text-[13px] text-gray-400">没有更多数据了</div>
            </div>
            
            <div className="absolute bottom-20 right-4 z-20">
               <button className="bg-[#ffd200] text-gray-900 text-[13px] font-medium px-4 py-2 rounded shadow-sm">
                  单件速发
               </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 pb-safe">
              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-[13px] font-medium text-gray-800">已选总金额: <span className="font-mono">{selectedTotalAmount}</span> 円</span>
                <span className="text-[13px] font-medium text-gray-800">已选总重: <span className="font-mono">{selectedTotalWeight}</span>克</span>
              </div>
              <div className="px-4 py-2 flex items-center justify-between gap-3">
                <button 
                  onClick={() => setSelectedPackageOrders([])}
                  className="w-20 py-2 rounded-full border border-[#1677ff] text-[#1677ff] text-[14px] font-medium active:bg-blue-50 transition-colors"
                >取消</button>
                <div className="flex gap-2.5 flex-1 justify-end">
                  <button 
                    onClick={() => setAppStep('form')}
                    disabled={selectedPackageOrders.length === 0}
                    className={`w-24 py-2 rounded-full text-[14px] font-medium transition-transform ${selectedPackageOrders.length > 0 ? 'bg-[#ffd200] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >发起直邮</button>
                  <button 
                    disabled={selectedPackageOrders.length === 0}
                    className={`w-24 py-2 rounded-full text-[14px] font-medium transition-transform ${selectedPackageOrders.length > 0 ? 'bg-[#ffd200] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >发起拼邮</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {appStep === 'form' && (
          <div className="flex flex-col h-full relative bg-gray-50">
            <div className="bg-white px-4 pt-10 pb-3 flex items-center justify-center border-b border-gray-100 shrink-0 sticky top-0 z-20">
              <button onClick={() => setAppStep('list')} className="absolute left-4 p-1 active:scale-95 transition-transform">
                <ChevronLeft className="w-6 h-6 text-gray-800" />
              </button>
              <h1 className="text-[17px] font-medium text-gray-900 tracking-wide">出库打包需求</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-32 space-y-4">
              <div className="mb-2 text-[13px] text-gray-500 font-medium">请依次确认打包需求，确保仓库准确执行</div>
              
              {/* Step 1: 物流意向 */}
              <div className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${formActiveStep === 1 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold ${formActiveStep > 1 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
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
                            onClick={() => {
                              setLogisticsIntent(intent.id);
                              if (intent.subOptions && intent.subOptions.length > 0) {
                                const firstRoute = intent.subOptions[0];
                                setSpecificRoute(firstRoute.id);
                                if ((firstRoute as any).isBag) {
                                  setBoxOption('free_box');
                                }
                              } else {
                                setSpecificRoute('');
                              }
                            }}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                              </div>
                              <div className="flex-1">
                                <div className={`font-bold text-[14px] ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
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
                                  const maxOrders = (route as any).maxOrders;
                                  const isMaxOrdersExceeded = maxOrders !== undefined && selectedPackageOrders.length > maxOrders;
                                  return (
                                    <div 
                                      key={route.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (isMaxOrdersExceeded) return;
                                        setSpecificRoute(route.id);
                                        if ((route as any).isBag) {
                                          setBoxOption('free_box');
                                        }
                                      }}
                                      className={`p-2.5 rounded border ${isMaxOrdersExceeded ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed' : isRouteSelected ? 'border-blue-400 bg-white' : 'border-gray-200 bg-white hover:border-blue-300'}`}
                                    >
                                      <div className="flex items-start gap-2">
                                        <div className={`w-3.5 h-3.5 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${isRouteSelected && !isMaxOrdersExceeded ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                          {isRouteSelected && !isMaxOrdersExceeded && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                        </div>
                                        <div className="flex-1">
                                          <div className={`font-bold text-[13px] ${isMaxOrdersExceeded ? 'text-gray-500' : isRouteSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                                            {route.title}
                                            {route.isDanger && <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${isMaxOrdersExceeded ? 'bg-gray-200 text-gray-500' : 'bg-amber-100 text-amber-700'}`}>免责</span>}
                                            {(route as any).requireNewBox && <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${isMaxOrdersExceeded ? 'bg-gray-200 text-gray-500' : 'bg-blue-100 text-blue-700'}`}>仅限新箱</span>}
                                          </div>
                                          <div className="text-[11px] text-gray-500 mt-0.5 whitespace-pre-wrap leading-relaxed">
                                            {route.desc}
                                          </div>
                                          {isMaxOrdersExceeded && (
                                            <div className="mt-2 text-[11px] text-rose-500 font-medium">
                                              此路线最多支持{maxOrders}个订单合单。您当前已选{selectedPackageOrders.length}单，已超限无法选择。
                                            </div>
                                          )}
                                          {isRouteSelected && (route as any).isBag && !isMaxOrdersExceeded && (
                                            <div className="mt-2 p-2 bg-purple-50 rounded text-[11px] text-purple-700 flex gap-1.5 items-start border border-purple-100">
                                              <Package className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                              <div className="leading-relaxed">
                                                <span className="font-bold">袋装打包提示：</span>当前选择为袋装打包路线，将自动禁用所有纸箱选项。仓库打包员将仅使用快递袋/编织袋打包。
                                                <br/><span className="text-purple-600">⚠️ 打包完成后，若要更换为需要纸箱的路线，需额外收取人工操作费。</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                            {isSelected && intent.id === 'pure_weight' && (
                              <div className="mt-3 ml-7 space-y-2 border-t border-blue-100 pt-3">
                                <div className="text-[12px] text-blue-800 font-bold mb-1 flex items-center gap-1.5">
                                  <Info className="w-3.5 h-3.5" />
                                  该意向包含以下纯重量路线：
                                </div>
                                <div className="space-y-2">
                                  {[
                                    { title: '【EMS-日本邮政】', desc: '时效最快，首重与续重均按纯重量计费，不计算体积重。' },
                                    { title: '【空运-日本邮政】', desc: '时效稳定，航空运输，纯重量计费。' },
                                    { title: '【海运-日本邮政】', desc: '经济实惠，适合大件或非紧急物品，纯重量计费。' },
                                    { title: '【EPL小包裹-日本邮政】', desc: '极具性价比的轻小件专属纯重量邮递路线（重量2000g为止）。' }
                                  ].map((route, rIdx) => (
                                    <div 
                                      key={rIdx}
                                      className="p-2.5 rounded border border-blue-100 bg-white"
                                    >
                                      <div className="flex items-start gap-2">
                                        <div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" />
                                        <div className="flex-1">
                                          <div className="font-bold text-[13px] text-blue-950">
                                            {route.title}
                                          </div>
                                          <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                                            {route.desc}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex justify-end">
                      {(() => {
                        const currentIntentObj = LOGISTICS_INTENTS.find(i => i.id === logisticsIntent);
                        const currentSubRouteObj = currentIntentObj?.subOptions?.find(s => s.id === specificRoute);
                        const isCurrentRouteInvalid = currentIntentObj?.hasSubOptions && currentSubRouteObj && (currentSubRouteObj as any).maxOrders !== undefined && selectedPackageOrders.length > (currentSubRouteObj as any).maxOrders;

                        return (
                          <div className="flex items-center gap-3">
                            {isCurrentRouteInvalid && (
                              <span className="text-[12px] text-rose-500 font-medium">当前路线订单数超限，请重新选择</span>
                            )}
                            <button 
                              disabled={isCurrentRouteInvalid}
                              onClick={() => {
                                if ((currentSubRouteObj as any)?.isBag) {
                                   setBoxOption('free_box');
                                } else if ((currentSubRouteObj as any)?.requireNewBox) {
                                   setBoxOption('new_box');
                                }
                                setFormActiveStep(2);
                              }}
                              className={`px-6 py-2 rounded-full text-[14px] font-bold transition-transform ${isCurrentRouteInvalid ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-[#ffd200] text-gray-900 active:scale-95'}`}
                            >
                              确认意向，下一步
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="text-[13px] text-gray-500">已选意向</div>
                      <div className="font-medium text-[14px] text-gray-900 mt-1">
                        {LOGISTICS_INTENTS.find(i => i.id === logisticsIntent)?.title}
                        {LOGISTICS_INTENTS.find(i => i.id === logisticsIntent)?.hasSubOptions && specificRoute && (
                          <span className="text-blue-600"> - {LOGISTICS_INTENTS.find(i => i.id === logisticsIntent)?.subOptions?.find(r => r.id === specificRoute)?.title}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Step 2: 箱子选项 */}
              {formActiveStep >= 2 && (
                <div ref={step2Ref} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${formActiveStep === 2 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold ${formActiveStep > 2 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
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
                                
                                if ((currentSubRoute as any)?.isBag && opt.id !== 'free_box') {
                                  setBoxConfirmModal({
                                    show: true,
                                    targetBox: opt.id,
                                    targetBoxTitle: opt.title,
                                    routeTitle: currentSubRoute.title,
                                    isBagConflict: true
                                  });
                                } else if ((currentSubRoute as any)?.requireNewBox && opt.id !== 'new_box') {
                                  setBoxConfirmModal({
                                    show: true,
                                    targetBox: opt.id,
                                    targetBoxTitle: opt.title,
                                    routeTitle: currentSubRoute.title
                                  });
                                } else {
                                  setBoxOption(opt.id);
                                }
                              }}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                </div>
                                <div className="flex-1 flex justify-between items-start">
                                  <div className="flex-1 mr-4">
                                    <div className={`font-bold text-[14px] ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                                      {opt.title}
                                    </div>
                                    <div className="text-[12px] text-gray-500 mt-1">
                                      {opt.desc}
                                    </div>
                                    {opt.id === 'original_box' && (
                                      <div className="mt-2 p-2 bg-amber-50/80 rounded text-[11px] text-amber-700 flex gap-1.5 items-start border border-amber-100">
                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                        <div className="leading-relaxed">
                                          若无可用原箱或不符合标准，将改用<span className="font-bold">免费旧箱</span>；若无旧箱则使用<span className="font-bold">付费新箱 (200円)</span>。
                                        </div>
                                      </div>
                                    )}
                                    {opt.id === 'free_box' && (
                                      <div className="mt-2 p-2 bg-amber-50/80 rounded text-[11px] text-amber-700 flex gap-1.5 items-start border border-amber-100">
                                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                        <div className="leading-relaxed">
                                          若无匹配尺寸的旧箱，将改用<span className="font-bold">付费新箱 (200円)</span>。
                                        </div>
                                      </div>
                                    )}
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

              
              {/* Step 3: 控制重量/体积 */}
              {formActiveStep >= 3 && (
                <div ref={step3Ref} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${formActiveStep === 3 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold ${formActiveStep > 3 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                        {formActiveStep > 3 ? <Check className="w-3 h-3" strokeWidth={3} /> : '3'}
                      </span>
                      <h2 className="font-bold text-[14px] text-gray-800">控制重量/体积</h2>
                    </div>
                    {formActiveStep > 3 && (
                      <button onClick={() => setFormActiveStep(3)} className="text-blue-500 text-[12px] flex items-center gap-1 hover:underline">
                        <Edit2 className="w-3 h-3" /> 修改
                      </button>
                    )}
                  </div>
                  
                  {formActiveStep === 3 ? (
                    <div className="p-3">
                      <div className="space-y-3">
                        {[
                          { id: 'no_control', title: '不控制，我要全发', desc: '包裹内所有物品全部发出。' },
                          { id: 'auto_remove', title: '控制到最近的档位（随机取出）', desc: '若满足不了，随机取出1-2单。', tag: '免费' },
                          { id: 'specify_remove', title: '控制到最近的档位（指定取出）', desc: '若满足不了，指定取出一个订单。', tag: '付费' }
                        ].map(opt => {
                          const isSelected = weightControlOption === opt.id;
                          return (
                            <div 
                              key={opt.id}
                              onClick={() => setWeightControlOption(opt.id)}
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                </div>
                                <div className="flex-1">
                                  <div className={`font-bold text-[14px] flex items-center gap-2 ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
                                    {opt.title}
                                    {opt.tag && (
                                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider ${opt.tag === '免费' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-orange-100 text-orange-700 border border-orange-200'}`}>
                                        {opt.tag}
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[12px] text-gray-500 mt-1">
                                    {opt.desc}
                                  </div>
                                  {(opt.id === 'auto_remove' || opt.id === 'specify_remove') && (
                                    <div className="mt-2 p-2 bg-amber-50/80 rounded text-[11px] text-amber-700 flex gap-1.5 items-start border border-amber-100">
                                      <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                      <div className="leading-relaxed">
                                        <span className="font-bold">注意：</span>取出的商品将恢复为<span className="font-bold">入库状态</span>。若该商品已超出免费仓储期，在此期间将产生<span className="font-bold text-red-600">逾期仓储费</span>。
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {weightControlOption === 'specify_remove' && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                          <div className="text-[13px] text-blue-800 mb-2 font-medium">请选择要指定取出的订单（仅限1个）：</div>
                          {specifiedRemoveOrder ? (
                            <div className="flex items-center justify-between bg-white border border-blue-200 p-2 rounded">
                              <span className="text-[13px] font-bold text-gray-800">入库编号: {specifiedRemoveOrder}</span>
                              <button onClick={() => setShowOrderSelectModal(true)} className="text-blue-600 text-[12px] hover:underline">更换</button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setShowOrderSelectModal(true)}
                              className="w-full py-2 bg-white border border-blue-300 text-blue-600 rounded text-[13px] font-medium hover:bg-blue-50 transition-colors"
                            >
                              + 点击选择订单
                            </button>
                          )}
                          <div className="mt-3 text-[12px] text-red-600 leading-relaxed">
                            <span className="font-bold">提示：</span>若指定取出后仍无法满足重量/体积限制，因已产生人工操作，包裹将直接封箱发货，可能无法避免运费跳档。
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => setFormActiveStep(4)}
                          className="bg-[#ffd200] text-gray-900 px-6 py-2 rounded-full text-[14px] font-bold active:scale-95 transition-transform"
                        >
                          确认控制要求，下一步
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4">
                      <div className="text-[13px] text-gray-500">已选要求</div>
                      <div className="font-medium text-[14px] text-gray-900 mt-1">
                        {weightControlOption === 'no_control' ? '不控制' : weightControlOption === 'auto_remove' ? '随机取出' : `指定取出 ${specifiedRemoveOrder ? '[' + specifiedRemoveOrder + ']' : ''}`}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: 拆包要求 */}
              {formActiveStep >= 4 && (
                <div ref={step4Ref} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${formActiveStep === 4 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold ${formActiveStep > 4 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                        {formActiveStep > 4 ? <Check className="w-3 h-3" strokeWidth={3} /> : '4'}
                      </span>
                      <h2 className="font-bold text-[14px] text-gray-800">拆除包装要求</h2>
                    </div>
                    {formActiveStep > 4 && (
                      <button onClick={() => setFormActiveStep(4)} className="text-blue-500 text-[12px] flex items-center gap-1 hover:underline">
                        <Edit2 className="w-3 h-3" /> 修改
                      </button>
                    )}
                  </div>
                  
                  {formActiveStep === 4 ? (
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
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                </div>
                                <div className="flex-1">
                                  <div className={`font-bold text-[14px] ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
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
                          onClick={() => setFormActiveStep(5)}
                          className="bg-[#ffd200] text-gray-900 px-6 py-2 rounded-full text-[14px] font-bold active:scale-95 transition-transform"
                        >
                          确认拆包要求，下一步
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

              {/* Step 5: 其他增值服务 */}
              {formActiveStep >= 5 && (
                <div ref={step5Ref} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${formActiveStep === 5 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[12px] font-bold">5</span>
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
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-blue-200'}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-4 h-4 mt-0.5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>
                                {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                              </div>
                              <div className="flex-1">
                                <div className={`font-bold text-[14px] ${isSelected ? 'text-blue-900' : 'text-gray-800'}`}>
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

            {formActiveStep === 5 && (
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
            )}
          </div>
        )}

        {/* Box Confirm Modal */}
        {boxConfirmModal?.show && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl w-full p-5 shadow-xl animate-in fade-in zoom-in duration-200">
              <div className="flex items-center gap-2 text-amber-600 mb-3">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="font-bold text-[16px]">路线冲突提示</h3>
              </div>
              <div className="text-[14px] text-gray-600 mb-6 leading-relaxed">
                您当前选择的意向【<span className="font-bold text-gray-800">{boxConfirmModal.routeTitle}</span>】{boxConfirmModal.isBagConflict ? '仅使用袋装发货（不使用纸箱）。' : '仅限使用付费新箱。'}
                <br/><br/>
                如果强制选择【<span className="font-bold text-gray-800">{boxConfirmModal.targetBoxTitle}</span>】，将<span className="font-bold text-rose-500">自动禁用该路线</span>，并需要您返回步骤1重新选择物流意向。是否继续？
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => {
                    setBoxOption(boxConfirmModal.targetBox);
                    setLogisticsIntent('default');
                    setSpecificRoute('');
                    setFormActiveStep(1);
                    setBoxConfirmModal(null);
                  }}
                  className="w-full py-2.5 rounded-lg text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  继续更换箱子并重选路线
                </button>
                <button 
                  onClick={() => setBoxConfirmModal(null)}
                  className="w-full py-2.5 rounded-lg text-[14px] font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  取消，继续使用{boxConfirmModal.isBagConflict ? '袋装' : '新箱'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Order Service Modal */}
        {showOrderServiceModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-xl w-full flex flex-col animate-in slide-in-from-bottom-full duration-300">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-[16px]">选择附加项</h3>
                <button onClick={() => setShowOrderServiceModal(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="text-[13px] text-gray-700 font-medium mb-2">附加项服务</div>
                  <div className="flex flex-wrap gap-2">
                    {['单件丢弃', '单件清点', '单件拍照'].map(srv => (
                      <button
                        key={srv}
                        onClick={() => setEditingServiceType(srv)}
                        className={`px-3 py-1.5 text-[13px] rounded-full border ${editingServiceType === srv ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'border-gray-200 text-gray-600'}`}
                      >
                        {srv}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[13px] text-gray-700 font-medium mb-2">备注</div>
                  <textarea
                    value={editingServiceRemark}
                    onChange={(e) => setEditingServiceRemark(e.target.value)}
                    placeholder="请输入备注，例如：丢弃书"
                    className="w-full h-20 p-2 text-[13px] border border-gray-200 rounded-lg resize-none outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (orderServices[showOrderServiceModal]) {
                        const newServices = { ...orderServices };
                        delete newServices[showOrderServiceModal];
                        setOrderServices(newServices);
                      }
                      setShowOrderServiceModal(null);
                    }}
                    className="flex-1 py-2.5 rounded-full border border-gray-300 text-gray-700 text-[14px] font-medium"
                  >
                    清除附加项
                  </button>
                  <button
                    onClick={() => {
                      setOrderServices(prev => ({
                        ...prev,
                        [showOrderServiceModal]: {
                          service: editingServiceType,
                          remark: editingServiceRemark
                        }
                      }));
                      setShowOrderServiceModal(null);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-[#ffd200] text-gray-900 text-[14px] font-bold"
                  >
                    保存
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Select Modal for Weight Control */}
        {showOrderSelectModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex flex-col justify-end">
            <div className="bg-white rounded-t-xl w-full max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-full duration-300">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-bold text-[16px]">选择要取出的订单</h3>
                <button onClick={() => setShowOrderSelectModal(false)} className="text-gray-400 hover:text-gray-600">
                  <span className="text-[20px]">&times;</span>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedPackageOrders.map(orderId => {
                  const order = MOCK_PACKAGE_ORDERS.find(o => o.id === orderId);
                  if (!order) return null;
                  return (
                    <div 
                      key={orderId}
                      onClick={() => {
                        setSpecifiedRemoveOrder(orderId);
                        setShowOrderSelectModal(false);
                      }}
                      className="border border-gray-200 rounded-lg p-3 flex gap-3 cursor-pointer hover:border-blue-300 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden shrink-0">
                        <img src={order.image} alt="Product" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-gray-800">入库编号: {order.id}</div>
                        <div className="text-[12px] text-gray-500 mt-1 truncate">{order.title}</div>
                        <div className="text-[12px] text-gray-400 mt-1">重量: {order.weight}g</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminView />
    </div>
  );
}
