import React, { useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Lock,
  Eye,
  Smartphone,
  CreditCard,
  Wallet,
  Send,
  Copy,
  Check,
  Headphones,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Info,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Timer,
  ShieldAlert,
  Calendar,
  Filter,
  CheckCheck,
  Trash2,
  Building,
  Anchor,
  Receipt,
  Scale,
  Ban,
  ShoppingBag,
  Package,
  Layers,
  ArrowRight,
  Store,
  Bell,
  User,
  Heart,
  Bookmark,
  Gavel,
  XCircle,
  Pencil,
  Footprints,
  Settings,
  Globe,
  ExternalLink,
  LogOut,
  LogIn,
  MessageCircle
} from 'lucide-react';

export type FeeCategory = '退运邮费' | '入库到付' | '包裹税金' | '海关补交税金' | '海运退运费' | '航空退运费' | '运费差额补缴' | '违规及对应手续费' | '超期滞仓费' | '增值服务费';

export interface AdminFeeOrder {
  id: string;
  feeName: string; // 收费项名称 (管理端选择/输入)
  mainOrderNo: string; // 主订单编号(OR或LO)
  subOrderNo?: string; // 子订单编号(OR或LO)
  memberId: string; // 会员ID
  feeCategory: FeeCategory; // 费用类型
  feeDesc: string; // 收费项说明 / 详细原因 (管理端可输入)
  amountJpy: number; // 金额 (日元，管理端输入)
  amountRmb?: number; // 金额 (RMB)
  status: '未支付' | '已支付' | '已过期作废' | '已退款'; // 支付状态
  isForced: boolean; // 是否强制支付 (后台业务标记)
  validityHours: number; // 0 表示无倒计时，>0 表示有时效倒计时(如24小时)
  validityText: string; // 管理端展示文案
  remainingHours?: number; // 剩余时效
  creator: string; // 创建人
  createTime: string; // 创建时间
  payTime?: string; // 支付时间
  payNo?: string; // 支付单号
  proofImages?: string[]; // 图片凭证 (海关税单、称重记录、退运单据等，管理端可上传)
  categoryIcon?: 'tax' | 'sea' | 'air' | 'freight' | 'violation' | 'storage' | 'extra';
}

const DEFAULT_PROOF_IMAGES = {
  tax: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80', // 海关税单/收据
  sea: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80', // 海运集装箱/海关退运单
  weight: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80', // 仓库实秤
  package: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80' // 包裹实物
};

const INITIAL_ORDERS: AdminFeeOrder[] = [
  {
    id: 'fee-101',
    feeName: '海关清关关税差额补缴',
    mainOrderNo: 'LO20260806001928371944',
    subOrderNo: '',
    memberId: '5086662130',
    feeCategory: '海关补交税金',
    feeDesc: '包裹在海关实际妥投清关环节产生税费查验差额，需补缴税金差额。请在APP内完成支付。',
    amountJpy: 1249,
    amountRmb: 56.70,
    status: '未支付',
    isForced: true,
    validityHours: 0,
    validityText: '无倒计时 (常规必付)',
    creator: 'shaoxiaoxiao',
    createTime: '2026-08-07 13:40:21',
    categoryIcon: 'tax',
    proofImages: [DEFAULT_PROOF_IMAGES.tax]
  },
  {
    id: 'fee-101-cod2',
    feeName: '入库到付快递包裹代垫费',
    mainOrderNo: 'OR20260807182200192831',
    subOrderNo: 'OR20260807182200192831001',
    memberId: '5086662130',
    feeCategory: '入库到付',
    feeDesc: '包裹到仓由仓库代垫顺丰到付运费 ¥880 日元（一单一单独立处理，不与其他到付单合并）。',
    amountJpy: 880,
    amountRmb: 39.95,
    status: '未支付',
    isForced: true,
    validityHours: 0,
    validityText: '无倒计时 (常规必付)',
    creator: 'shaoxiaoxiao',
    createTime: '2026-08-07 15:10:00',
    categoryIcon: 'tax',
    proofImages: [DEFAULT_PROOF_IMAGES.package]
  },
  {
    id: 'fee-102',
    feeName: '日本邮局海运退运运费',
    mainOrderNo: 'LO20260718102344192801',
    subOrderNo: '',
    memberId: '5086662130',
    feeCategory: '海运退运费',
    feeDesc: '因收件人未在清关期内完成申报导致包裹退运，日本邮局收取海运退回运费。支付完成后可重新安排转寄或仓库退件。',
    amountJpy: 3850,
    amountRmb: 174.79,
    status: '已支付',
    isForced: true,
    validityHours: 0,
    validityText: '无倒计时 (常规必付)',
    creator: 'CS19',
    createTime: '2026-08-05 09:12:00',
    payTime: '2026-08-05 11:20:15',
    payNo: 'CO20260805091233819200',
    categoryIcon: 'sea',
    proofImages: [DEFAULT_PROOF_IMAGES.sea]
  },
  {
    id: 'fee-103',
    feeName: '特殊商品复核与拍照增值服务',
    mainOrderNo: 'OR20260728234012406436',
    subOrderNo: 'OR20260728234012406436001',
    memberId: '2409751625',
    feeCategory: '增值服务费',
    feeDesc: '会员申请开箱拍摄高精度商品细节图3张。请在限时时效内完成支付，超时未支付将自动作废关闭。',
    amountJpy: 300,
    amountRmb: 13.62,
    status: '未支付',
    isForced: false,
    validityHours: 24,
    validityText: '24小时倒计时',
    remainingHours: 16,
    creator: 'CS19',
    createTime: '2026-08-07 05:24:08',
    categoryIcon: 'extra',
    proofImages: [DEFAULT_PROOF_IMAGES.package]
  },
  {
    id: 'fee-104',
    feeName: '违规及禁运品查验对应手续费',
    mainOrderNo: 'LO20260716122531517160',
    subOrderNo: '',
    memberId: '3712873917',
    feeCategory: '违规及对应手续费',
    feeDesc: '包裹内含航空违禁液体，仓库已安排单独取出封存并代扣分拣处置手续费。请在APP内完成支付。',
    amountJpy: 600,
    amountRmb: 27.24,
    status: '已支付',
    isForced: true,
    validityHours: 0,
    validityText: '无倒计时 (常规必付)',
    creator: 'shaoxiaoxiao',
    createTime: '2026-08-04 13:15:27',
    payTime: '2026-08-04 14:02:11',
    payNo: 'CO20260804131548192837',
    categoryIcon: 'violation',
    proofImages: [DEFAULT_PROOF_IMAGES.weight]
  },
  {
    id: 'fee-105',
    feeName: '普通运费超差补缴 (选配)',
    mainOrderNo: 'LO20260701192837461928',
    subOrderNo: '',
    memberId: '1306162206',
    feeCategory: '运费差额补缴',
    feeDesc: '普通服务单：24小时内未支付自动作废，包裹将按原定平邮低速仓发运。',
    amountJpy: 450,
    amountRmb: 20.43,
    status: '已过期作废',
    isForced: false,
    validityHours: 24,
    validityText: '已过期 (24小时超时自动关闭)',
    creator: 'CS08',
    createTime: '2026-08-01 10:00:00',
    categoryIcon: 'freight'
  }
];

export function Flow20260806() {
  const [orders, setOrders] = useState<AdminFeeOrder[]>(INITIAL_ORDERS);
  const currentAppMemberId = '5086662130';

  // Filters State for Admin Table
  const [searchFeeName, setSearchFeeName] = useState('');
  const [searchMainOrder, setSearchMainOrder] = useState('');
  const [searchDetailQuery, setSearchDetailQuery] = useState(''); // 详细输入栏 / 唯一值检索
  const [searchSubOrder, setSearchSubOrder] = useState('');
  const [searchMemberId, setSearchMemberId] = useState('');
  const [searchFeeCategory, setSearchFeeCategory] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [searchIsForced, setSearchIsForced] = useState('');

  // Modal State for New Charge Order (Right Admin Side)
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalFeeName, setModalFeeName] = useState('海关清关关税差额补缴');
  const [modalMainOrder, setModalMainOrder] = useState('LO20260806001928371944');
  const [modalSubOrder, setModalSubOrder] = useState('');
  const [modalMemberId, setModalMemberId] = useState(currentAppMemberId);
  const [modalFeeCategory, setModalFeeCategory] = useState<FeeCategory>('海关补交税金');
  const [modalAmountJpy, setModalAmountJpy] = useState<number>(1249);
  const [modalIsForced, setModalIsForced] = useState<boolean | null>(null);
  const [modalHasCountdown, setModalHasCountdown] = useState<boolean>(false);
  const [modalValidityHours, setModalValidityHours] = useState<number>(24);
  const [modalDetailReason, setModalDetailReason] = useState<string>(
    '包裹在海关实际妥投清关环节产生税费查验差额，需补缴税金差额。请在APP内完成支付。'
  );
  const [modalImageUrls, setModalImageUrls] = useState<string[]>([DEFAULT_PROOF_IMAGES.tax]);
  const [modalCustomImageUrl, setModalCustomImageUrl] = useState<string>('');

  // Handle Clipboard Paste for Image Upload
  const handlePasteImage = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = event => {
            if (event.target?.result) {
              setModalImageUrls([event.target.result as string]);
              showToast('📋 已通过剪贴板粘贴导入凭证图片！');
            }
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  // Proof Image Preview Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Platform View Mode in Simulator: 'app' (手机APP原生端) | 'h5' (微信公众号【乐酷淘】H5端)
  const [clientViewMode, setClientViewMode] = useState<'app' | 'h5'>('app');
  // Account Restriction Modal in Native App (App Store compliance)
  const [showAccountRestrictedModal, setShowAccountRestrictedModal] = useState<boolean>(true);

  // App Client State
  const [selectedPayMethod, setSelectedPayMethod] = useState<'wechat' | 'alipay' | 'balance' | 'unionpay' | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [showContactCsModal, setShowContactCsModal] = useState(false);
  const [copiedNo, setCopiedNo] = useState(false);
  const [csMessage, setCsMessage] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dynamic Countdown Timer (for orders with countdowns)
  const [countdownSeconds, setCountdownSeconds] = useState<number>(15 * 3600 + 42 * 60 + 18);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Online CS Chat History
  const [csChatHistory, setCsChatHistory] = useState<{ sender: 'user' | 'cs'; text: string; time: string }[]>([
    {
      sender: 'cs',
      text: '您好！我是乐淘专属人工客服。系统检测到您有一笔待支付费用（如海关补交税金/海运退运费等）。请问有什么可以协助您核对凭证或操作说明的吗？',
      time: '13:42'
    }
  ]);

  // Find ALL active forced unpaid orders for current App member
  const forcedUnpaidOrders = orders.filter(
    o => o.memberId === currentAppMemberId && o.isForced && o.status === '未支付'
  );
  // Current active forced order (first unpaid forced order)
  const currentForcedOrder = forcedUnpaidOrders[0];

  // Non-forced unpaid orders for current member
  const currentNonForcedOrders = orders.filter(
    o => o.memberId === currentAppMemberId && !o.isForced && o.status === '未支付'
  );

  // Active Tab in Mobile App when unlocked
  const [mobileTab, setMobileTab] = useState<'home' | 'packages' | 'messages' | 'mine'>('home');
  // Station letter / In-app message detail modal state
  const [selectedStationMessage, setSelectedStationMessage] = useState<AdminFeeOrder | null>(null);
  const [showNonForcedPayModal, setShowNonForcedPayModal] = useState<AdminFeeOrder | null>(null);
  const [inAppNoticeDismissed, setInAppNoticeDismissed] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyText = (text: string, label: string = '内容') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    showToast(`📋 已复制${label}到剪贴板！`);
  };

  // Quick switch between demo scenarios
  const handleQuickDemoSwitch = (scenario: 'forced' | 'non_forced' | 'cleared') => {
    if (scenario === 'forced') {
      setOrders(prev => [
        {
          id: `fee-forced-demo`,
          feeName: '海关清关关税差额补缴',
          mainOrderNo: 'LO20260806001928371944',
          subOrderNo: '',
          memberId: currentAppMemberId,
          feeCategory: '海关补交税金',
          feeDesc: '包裹在海关实际妥投清关环节产生税费查验差额，需补缴税金差额。请在微信公众号【乐酷淘】H5内完成支付。',
          amountJpy: 1249,
          amountRmb: 56.70,
          status: '未支付',
          isForced: true,
          validityHours: 0,
          validityText: '无倒计时 (常规必付)',
          creator: 'shaoxiaoxiao',
          createTime: '2026-08-07 13:40:21',
          categoryIcon: 'tax',
          proofImages: [DEFAULT_PROOF_IMAGES.tax]
        },
        ...prev.filter(o => o.id !== 'fee-forced-demo')
      ]);
      setClientViewMode('app');
      setShowAccountRestrictedModal(true);
      setInAppNoticeDismissed(false);
      showToast('已切换至【强制支付】合规场景：APP端强制登出并提示限制，引导前往公众号【乐酷淘】H5处理');
    } else if (scenario === 'non_forced') {
      setOrders(prev => [
        {
          id: `fee-nonforced-demo`,
          feeName: '特殊商品复核与拍照增值服务',
          mainOrderNo: 'OR20260728234012406436',
          subOrderNo: 'OR20260728234012406436001',
          memberId: currentAppMemberId,
          feeCategory: '增值服务费',
          feeDesc: '会员申请开箱拍摄高精度商品细节图3张。请在限时时效内完成支付，超时未支付将自动作废关闭，不影响常规正常出库。',
          amountJpy: 300,
          amountRmb: 13.62,
          status: '未支付',
          isForced: false,
          validityHours: 24,
          validityText: '24小时倒计时',
          remainingHours: 16,
          creator: 'CS19',
          createTime: '2026-08-07 05:24:08',
          categoryIcon: 'extra',
          proofImages: [DEFAULT_PROOF_IMAGES.package]
        },
        ...prev
          .filter(o => o.id !== 'fee-nonforced-demo')
          .map(o => (o.isForced && o.status === '未支付' ? { ...o, status: '已支付' as const } : o))
      ]);
      setClientViewMode('app');
      setShowAccountRestrictedModal(false);
      setInAppNoticeDismissed(false);
      showToast('已切换至【非强制支付】模式：用户打开APP正常使用，仅显示一条站内信通知');
    } else {
      setOrders(prev =>
        prev.map(o => (o.memberId === currentAppMemberId ? { ...o, status: '已支付' } : o))
      );
      setClientViewMode('app');
      setShowAccountRestrictedModal(false);
      showToast('已切换至【全部已结清】模式：APP与H5端均畅通无阻');
    }
  };

  // Pre-fill modal reasons based on category and default to forced payment for top 3 presets
  const handleCategoryPresetChange = (cat: FeeCategory) => {
    setModalFeeCategory(cat);
    if (cat === '退运邮费') {
      setModalFeeName('退运邮费');
      setModalDetailReason('包裹因清关逾期或无人签收导致退运，仓库产生退回邮费运费。请在APP内完成支付。');
      setModalImageUrls([DEFAULT_PROOF_IMAGES.sea]);
      setModalIsForced(true); // 默认选中【强制支付】
      setModalHasCountdown(false);
    } else if (cat === '入库到付') {
      setModalFeeName('入库到付');
      setModalDetailReason('包裹入库时由仓库代垫的国内/日本本土快递到付服务费用。请在APP内完成支付。');
      setModalImageUrls([DEFAULT_PROOF_IMAGES.package]);
      setModalIsForced(true); // 默认选中【强制支付】
      setModalHasCountdown(false);
    } else if (cat === '包裹税金' || cat === '海关补交税金') {
      setModalFeeName('包裹税金');
      setModalDetailReason('包裹在海关实际妥投清关环节产生税费查验差额，需补缴税金差额。请在APP内完成支付。');
      setModalImageUrls([DEFAULT_PROOF_IMAGES.tax]);
      setModalIsForced(true); // 默认选中【强制支付】
      setModalHasCountdown(false);
    } else if (cat === '海运退运费') {
      setModalFeeName('日本邮局海运退运运费');
      setModalDetailReason('因收件方清关逾期或无人签收导致包裹退运，日本邮局产生海运退回运费。请在APP内完成支付。');
      setModalImageUrls([DEFAULT_PROOF_IMAGES.sea]);
      setModalIsForced(true);
      setModalHasCountdown(false);
    } else if (cat === '航空退运费') {
      setModalFeeName('航空干线退运运费');
      setModalDetailReason('航空退运产生的返程机位差价与运输费用。需支付该款项以继续安排后续转运操作。');
      setModalImageUrls([DEFAULT_PROOF_IMAGES.sea]);
      setModalIsForced(true);
      setModalHasCountdown(false);
    } else if (cat === '运费差额补缴') {
      setModalFeeName('包裹实重与体积重差额补缴');
      setModalDetailReason('仓库打包后实秤重量与入库预估产生差额，需补缴运费差额以完成最终放行与出库。');
      setModalImageUrls([DEFAULT_PROOF_IMAGES.weight]);
    } else if (cat === '违规及对应手续费') {
      setModalFeeName('违禁品单独处置与查验手续费');
      setModalDetailReason('包裹内含违禁或限制出境品类，仓库已安排人工单独查验与分装处置，请在APP内完成支付。');
      setModalImageUrls([DEFAULT_PROOF_IMAGES.package]);
    } else {
      setModalFeeName(`${cat}`);
      setModalDetailReason(`针对主订单产生的${cat}，请核对明细并及时处理。`);
      setModalImageUrls([]);
    }
  };

  // Filtered Orders for Admin Table
  const filteredOrders = orders.filter(item => {
    if (searchFeeName && !item.feeName.includes(searchFeeName)) return false;
    if (searchMainOrder && !item.mainOrderNo.includes(searchMainOrder)) return false;
    if (searchSubOrder && item.subOrderNo && !item.subOrderNo.includes(searchSubOrder)) return false;
    if (searchMemberId && !item.memberId.includes(searchMemberId)) return false;
    if (searchFeeCategory && item.feeCategory !== searchFeeCategory) return false;
    if (searchStatus && item.status !== searchStatus) return false;
    if (searchIsForced !== '') {
      const isForcedBool = searchIsForced === 'true';
      if (item.isForced !== isForcedBool) return false;
    }
    if (searchDetailQuery) {
      const q = searchDetailQuery.trim().toLowerCase();
      const matchDetail =
        item.mainOrderNo.toLowerCase().includes(q) ||
        (item.subOrderNo && item.subOrderNo.toLowerCase().includes(q)) ||
        (item.payNo && item.payNo.toLowerCase().includes(q)) ||
        item.id.toLowerCase().includes(q) ||
        item.memberId.toLowerCase().includes(q) ||
        item.feeName.toLowerCase().includes(q) ||
        item.feeDesc.toLowerCase().includes(q);
      if (!matchDetail) return false;
    }
    return true;
  });

  // Handle Admin Add Order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalFeeName || !modalAmountJpy) {
      alert('请完整填写收费项名称和日元金额！');
      return;
    }

    if (modalIsForced === null) {
      alert('请选择【强制支付】或【非强制支付】（二选一必选）！');
      return;
    }

    // 非强制支付固定默认24小时倒计时
    const validityHoursVal = modalIsForced ? 0 : 24;
    const validityText = modalIsForced ? '无倒计时 (常规必付)' : '24小时倒计时';

    const newOrder: AdminFeeOrder = {
      id: `fee-${Date.now()}`,
      feeName: modalFeeName,
      mainOrderNo: modalMainOrder || `LO${Date.now()}`,
      subOrderNo: modalSubOrder,
      memberId: modalMemberId || currentAppMemberId,
      feeCategory: modalFeeCategory,
      feeDesc: modalDetailReason ? modalDetailReason : `费用类别: ${modalFeeCategory}，说明: ${modalFeeName}`,
      amountJpy: Number(modalAmountJpy),
      amountRmb: Number((Number(modalAmountJpy) * 0.0454).toFixed(2)),
      status: '未支付',
      isForced: modalIsForced,
      validityHours: validityHoursVal,
      validityText: validityText,
      remainingHours: modalHasCountdown ? modalValidityHours : undefined,
      creator: 'shaoxiaoxiao',
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      proofImages: modalImageUrls.filter(Boolean)
    };

    setOrders(prev => [newOrder, ...prev]);
    setShowAddModal(false);
    showToast('已成功创建支付订单！' + (modalIsForced ? ' (APP端已锁定展示支付界面)' : ''));
  };

  // Handle Admin Delete
  const handleDeleteOrder = (id: string) => {
    if (confirm('确认删除该收费订单吗？若已锁定APP将同步解除。')) {
      setOrders(prev => prev.filter(o => o.id !== id));
      showToast('已删除订单');
    }
  };

  // Handle App Pay
  const handleAppPay = () => {
    if (!currentForcedOrder) return;
    if (!selectedPayMethod) {
      showToast('⚠️ 请先选择支付方式后再进行结算！');
      return;
    }
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setSelectedPayMethod(null);
      setOrders(prev =>
        prev.map(o =>
          o.id === currentForcedOrder.id
            ? {
                ...o,
                status: '已支付',
                payTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
                payNo: `CO${Date.now()}`
              }
            : o
        )
      );
      showToast('🎉 支付成功！费用已支付完成！');
    }, 700);
  };

  // Send CS Message
  const handleSendCsMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csMessage.trim()) return;
    const userMsg = csMessage;
    setCsChatHistory(prev => [
      ...prev,
      { sender: 'user', text: userMsg, time: new Date().toTimeString().substring(0, 5) }
    ]);
    setCsMessage('');
    setTimeout(() => {
      setCsChatHistory(prev => [
        ...prev,
        {
          sender: 'cs',
          text: `已收到您的咨询。关于主订单 ${currentForcedOrder?.mainOrderNo || '相关款项'}，我们已核对相关税单与单据凭证。如有重量或明细疑问，客服可为您发起二次复核。`,
          time: new Date().toTimeString().substring(0, 5)
        }
      ]);
    }, 800);
  };

  const handleCopyOrderNo = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNo(true);
    setTimeout(() => setCopiedNo(false), 1500);
    showToast('已复制单号到剪贴板');
  };

  // Handle Non-Forced Order Pay from Station Message
  const handleNonForcedPay = (orderToPay: AdminFeeOrder) => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setOrders(prev =>
        prev.map(o =>
          o.id === orderToPay.id
            ? {
                ...o,
                status: '已支付',
                payTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
                payNo: `CO${Date.now()}`
              }
            : o
        )
      );
      setShowNonForcedPayModal(null);
      setSelectedStationMessage(null);
      showToast('🎉 支付成功！已完成该笔站内信费用支付！');
    }, 700);
  };

  return (
    <div className="w-full h-full flex flex-col xl:flex-row bg-[#eaedf1] overflow-hidden select-none font-sans text-gray-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-gray-700">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= LEFT SIDE: USER APP CLIENT (MOBILE SIMULATOR) ================= */}
      <div className="w-full xl:w-[410px] shrink-0 border-r border-gray-200 bg-[#f5f6f9] flex flex-col relative h-[620px] xl:h-full shadow-md z-10">
        {/* Top Control Bar: Platform View Mode Switcher + Scenario Shortcuts */}
        <div className="bg-gray-900 text-white p-2 shrink-0 border-b border-gray-800 space-y-1.5 text-xs">
          {/* Platform Tab Switcher: App vs WeChat H5 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-gray-800 p-0.5 rounded-lg border border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setClientViewMode('app');
                  if (currentForcedOrder) setShowAccountRestrictedModal(true);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  clientViewMode === 'app'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>📱 手机APP端</span>
                {currentForcedOrder && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setClientViewMode('h5')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  clientViewMode === 'h5'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>🌐 公众号H5【乐酷淘】</span>
                {currentForcedOrder && (
                  <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold">
                    {forcedUnpaidOrders.length}
                  </span>
                )}
              </button>
            </div>

            <span className="text-[10px] text-gray-400 font-mono">
              {clientViewMode === 'app' ? (currentForcedOrder ? 'APP已强制登出' : 'APP正常') : '微信H5网页'}
            </span>
          </div>

          {/* Scenario Shortcuts */}
          <div className="flex items-center justify-between text-[10.5px] pt-1 border-t border-gray-800/80">
            <span className="text-gray-400 text-[10px]">快速测试场景:</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('forced')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  currentForcedOrder ? 'bg-red-600 text-white' : 'text-gray-400 hover:text-white bg-gray-800'
                }`}
                title="强制支付：APP强制登出拦截，提示去公众号【乐酷淘】H5登录锁定支付"
              >
                ① 强制支付 (APP登出+H5锁屏)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('non_forced')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  !currentForcedOrder && currentNonForcedOrders.length > 0
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white bg-gray-800'
                }`}
                title="非强制支付：APP端正常登录使用，仅显示一条站内信通知"
              >
                ② 非强制 (站内信)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoSwitch('cleared')}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all ${
                  !currentForcedOrder && currentNonForcedOrders.length === 0
                    ? 'bg-emerald-600 text-white'
                    : 'text-gray-400 hover:text-white bg-gray-800'
                }`}
                title="全部已结清：APP与H5完全正常"
              >
                ③ 全部结清
              </button>
            </div>
          </div>
        </div>

        {/* Top Device / Browser Bar */}
        {clientViewMode === 'app' ? (
          <div className="h-6 bg-white border-b border-gray-100 flex items-center justify-between px-4 text-[10px] text-gray-500 font-semibold shrink-0">
            <span>9:41</span>
            <span className="text-[9.5px] font-bold text-gray-700">乐淘日本海淘转运 APP</span>
            <div className="flex items-center gap-1.5 text-[9px]">
              <span>5G 📶</span>
              <div className="w-3.5 h-2 border border-gray-400 rounded-xs relative">
                <div className="absolute inset-0.5 bg-emerald-500 rounded-2xs"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#2c2c2c] text-white px-3 py-1.5 flex items-center justify-between text-xs shrink-0 border-b border-gray-700">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[10px] font-bold">
                微
              </div>
              <span className="font-bold text-[11px]">微信公众号 · 乐酷淘 (网页)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <RotateCcw className="w-3 h-3 hover:text-white cursor-pointer" onClick={() => showToast('已刷新H5页面')} />
              <span className="tracking-widest cursor-pointer hover:text-white">···</span>
            </div>
          </div>
        )}

        {/* App / H5 Main Scroll Body */}
        <div className="flex-1 overflow-y-auto bg-[#f5f6f9] p-3 space-y-3 custom-scrollbar flex flex-col justify-between relative">
          {clientViewMode === 'app' ? (
            /* ======================================================== */
            /* ==================== 📱 手机APP端 (原生APP) ================== */
            /* ======================================================== */
            currentForcedOrder ? (
              /* --- APP CASE 1: FORCED PAYMENT -> APP FORCE LOGOUT & LOGIN RESTRICTION --- */
              <div className="flex-1 flex flex-col justify-between space-y-4 animate-in fade-in duration-200">
                <div className="space-y-4 pt-2">
                  {/* Brand Header */}
                  <div className="text-center space-y-1 py-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xl flex items-center justify-center mx-auto shadow-md">
                      乐
                    </div>
                    <h2 className="text-base font-black text-gray-900 pt-1">乐淘日本海淘转运</h2>
                    <p className="text-[11px] text-gray-500">跨境直邮 · 日本转运仓储服务中心</p>
                  </div>

                  {/* Force Logout Alert Banner */}
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-2 text-red-700 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
                      <span>账号限制中 · APP已强制登出</span>
                    </div>
                    <p className="text-[11px] text-red-800 leading-relaxed pl-6">
                      系统检测到该账号存在待处理的重要账单事项（如海关税金/到付代垫等）。为符合应用商店合规要求，APP端已执行强制登出。
                    </p>
                  </div>

                  {/* App Login Form */}
                  <div className="bg-white rounded-2xl p-4 border border-gray-200/90 shadow-2xs space-y-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">登录账号 / 手机号</label>
                      <input
                        type="text"
                        disabled
                        value="138****2130 (会员ID: 5086662130)"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-gray-700">登录密码 / 验证码</label>
                      <input
                        type="password"
                        disabled
                        value="••••••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-600"
                      />
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAccountRestrictedModal(true);
                          showToast('⚠️ 账号登录受限：请前往微信公众号【乐酷淘】H5登录处理！');
                        }}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>登 录</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setClientViewMode('h5')}
                        className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                      >
                        <Globe className="w-3.5 h-3.5 text-emerald-600" />
                        <span>前往微信公众号【乐酷淘】H5处理</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compliance & Store Policy Note */}
                <div className="bg-gray-100 border border-gray-200 rounded-xl p-2.5 text-[10.5px] text-gray-500 leading-relaxed">
                  <div className="font-bold text-gray-700 mb-0.5 flex items-center gap-1">
                    <Info className="w-3 h-3 text-blue-600" />
                    <span>App Store / Google Play 商店合规说明:</span>
                  </div>
                  原生APP内严格禁止非IAP强制锁屏支付。系统对存在强制账单的用户执行APP登出与登录拦截，引导至微信公众号H5独立完成核对与结算。
                </div>

                {/* ============ ACCOUNT RESTRICTION MODAL IN APP (账号限制提示弹窗) ============ */}
                {showAccountRestrictedModal && (
                  <div className="absolute inset-0 z-30 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl w-full p-5 shadow-2xl space-y-4 border border-gray-200 text-center animate-in zoom-in-95 duration-200">
                      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                        <ShieldAlert className="w-6 h-6" />
                      </div>

                      <div className="space-y-1.5">
                        <h3 className="font-extrabold text-sm text-gray-900">账号限制提示</h3>
                        <p className="text-xs text-gray-600 leading-relaxed text-left bg-amber-50/70 p-3 rounded-2xl border border-amber-200/70">
                          尊敬的用户，您的账号存在待处理的重要账单事项（如海关关税/入库到付等），当前APP登录受限。
                          <br />
                          <br />
                          <strong>请去公众号【乐酷淘】选择H5登录处理。</strong>
                        </p>
                      </div>

                      <div className="space-y-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAccountRestrictedModal(false);
                            setClientViewMode('h5');
                            showToast('已进入微信公众号【乐酷淘】H5账单处理页面');
                          }}
                          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <Globe className="w-4 h-4" />
                          <span>去公众号处理 (一键跳转H5)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopyText('乐酷淘', '公众号名称')}
                          className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5 text-gray-500" />
                          <span>复制公众号名称【乐酷淘】</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowAccountRestrictedModal(false)}
                          className="text-[11px] text-gray-400 hover:text-gray-600 py-1 transition-colors block mx-auto font-medium"
                        >
                          我知道了 (暂不处理)
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
            /* ============ CASE 2: NON-FORCED OR ALL-CLEARED - FULL WORKING NORMAL APP ============ */
            <div className="space-y-3 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {/* Normal Mobile App Header */}
                <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      乐
                    </div>
                    <div>
                      <h1 className="text-xs font-extrabold text-gray-900">乐淘日本海淘转运</h1>
                      <div className="text-[9.5px] text-gray-400">会员ID: {currentAppMemberId}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Message Bell Icon with unread badge */}
                    <button
                      type="button"
                      onClick={() => setMobileTab('messages')}
                      className="relative p-1.5 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-xl border border-gray-200 transition-colors"
                      title="查看站内信"
                    >
                      <Send className="w-3.5 h-3.5 rotate-[-20deg]" />
                      {currentNonForcedOrders.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                          {currentNonForcedOrders.length}
                        </span>
                      )}
                    </button>
                    <div className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                      账号正常
                    </div>
                  </div>
                </div>



                {/* App Content Switcher based on mobileTab */}
                {mobileTab === 'home' && (
                  <div className="space-y-3 pb-2">
                    {/* Header: 个人中心 */}
                    <div className="flex items-center justify-between px-1">
                      <h1 className="text-base font-extrabold text-gray-900">个人中心</h1>
                      <button
                        type="button"
                        onClick={() => showToast('已打开账户设置')}
                        className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Profile Header Card */}
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs flex items-center justify-between">
                      <div className="space-y-2">
                        <h2 className="text-lg font-black text-gray-900">Rick Sanchez</h2>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 0 已绑定
                          </span>
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span> 聊天 已绑定
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono flex items-center gap-1 pt-0.5">
                          <span>ID: 3847821117</span>
                          <button
                            type="button"
                            onClick={() => showToast('已复制会员ID')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Avatar */}
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 p-0.5 shadow-md">
                          <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center overflow-hidden font-bold text-gray-700">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                              alt="Rick Sanchez"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-gray-600 text-white flex items-center justify-center border-2 border-white shadow-xs">
                          <Pencil className="w-3 h-3" />
                        </span>
                      </div>
                    </div>

                    {/* My Footprint / 足迹 Button */}
                    <div
                      onClick={() => showToast('已进入我的足迹')}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl px-4 py-3 shadow-sm flex items-center justify-between cursor-pointer transition-all font-bold text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Footprints className="w-4 h-4 text-amber-200" />
                        <span>我的足迹</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-amber-200" />
                    </div>

                    {/* Gold / Yellow Deposit Card */}
                    <div className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-400 rounded-2xl p-4 shadow-sm text-gray-900 space-y-3 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                          <Wallet className="w-4 h-4 text-gray-900" />
                          <span>支付预存金 (日元)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('已打开转入充值通道')}
                          className="text-xs font-bold text-gray-900 flex items-center gap-0.5 hover:underline"
                        >
                          <span>转入</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black font-mono tracking-tight">0</span>
                          <span className="text-xs text-gray-700 font-medium">当前积分：<strong className="text-red-700 font-mono">9500</strong></span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMobileTab('messages')}
                          className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] rounded-full shadow-2xs transition-colors"
                        >
                          流水查询
                        </button>
                      </div>
                    </div>

                    {/* My Orders (我的订单) */}
                    <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs space-y-3">
                      <div className="text-xs font-bold text-gray-900">我的订单</div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div
                          onClick={() => showToast('查看交易中订单')}
                          className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1.5"
                        >
                          <Wallet className="w-5 h-5 mx-auto text-rose-500" />
                          <span className="text-[11px] text-gray-700 font-medium block">交易中</span>
                        </div>
                        <div
                          onClick={() => setMobileTab('packages')}
                          className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1.5"
                        >
                          <Package className="w-5 h-5 mx-auto text-amber-500" />
                          <span className="text-[11px] text-gray-700 font-medium block">入库</span>
                        </div>
                        <div
                          onClick={() => showToast('查看出库包裹')}
                          className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1.5"
                        >
                          <Upload className="w-5 h-5 mx-auto text-orange-500" />
                          <span className="text-[11px] text-gray-700 font-medium block">出库</span>
                        </div>
                        <div
                          onClick={() => showToast('查看全部订单')}
                          className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1.5"
                        >
                          <FileText className="w-5 h-5 mx-auto text-indigo-500" />
                          <span className="text-[11px] text-gray-700 font-medium block">全部</span>
                        </div>
                      </div>
                    </div>

                    {/* Auction Center (竞拍中心) */}
                    <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs space-y-3">
                      <div className="text-xs font-bold text-gray-900">竞拍中心</div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div
                          onClick={() => showToast('查看正在竞拍的项目')}
                          className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1.5"
                        >
                          <Gavel className="w-5 h-5 mx-auto text-blue-600" />
                          <span className="text-[11px] text-gray-700 font-medium block">竞拍中</span>
                        </div>
                        <div
                          onClick={() => showToast('查看已得标拍品')}
                          className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1.5"
                        >
                          <CheckCircle2 className="w-5 h-5 mx-auto text-emerald-600" />
                          <span className="text-[11px] text-gray-700 font-medium block">已得标</span>
                        </div>
                        <div
                          onClick={() => showToast('查看未得标拍品')}
                          className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1.5"
                        >
                          <XCircle className="w-5 h-5 mx-auto text-gray-400" />
                          <span className="text-[11px] text-gray-700 font-medium block">未得标</span>
                        </div>
                        <div
                          onClick={() => showToast('查看关注中的拍品')}
                          className="p-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors space-y-1.5"
                        >
                          <Heart className="w-5 h-5 mx-auto text-rose-500" />
                          <span className="text-[11px] text-gray-700 font-medium block">关注中</span>
                        </div>
                      </div>
                    </div>

                    {/* Daily Sign-In (每日签到) */}
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 shadow-sm text-white space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <Calendar className="w-4 h-4 text-white" />
                          <span>每日签到</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => showToast('签到成功！积分 +50')}
                          className="px-4 py-1.5 bg-yellow-300 hover:bg-yellow-400 text-gray-950 font-black text-xs rounded-full shadow-xs transition-colors"
                        >
                          本日签到
                        </button>
                      </div>

                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2.5 text-xs font-medium text-white">
                        8月已签到 <strong className="text-yellow-200 font-bold">0</strong> 天
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Packages */}
                {mobileTab === 'packages' && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3 text-xs">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-gray-800">日本仓库包裹清单 (4件)</span>
                      <span className="text-[10px] text-gray-400">全部正常无拦截</span>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      由于当前未产生强制支付订单，所有仓库包裹均可自由选择海运、空运或极速邮政进行集中打包出库。
                    </p>
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-blue-800 text-[11px] flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      <span>账号出库功能完全开放，可随时提交合箱转运请求。</span>
                    </div>
                  </div>
                )}

                {/* Tab: Messages / 站内信列表 */}
                {mobileTab === 'messages' && (
                  <div className="space-y-2.5">
                    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                        <Send className="w-3.5 h-3.5 text-blue-600 rotate-[-15deg]" />
                        <span>站内信消息中心</span>
                      </div>
                      <span className="text-[10.5px] text-gray-400">
                        未读通知: <strong className="text-red-600">{currentNonForcedOrders.length}</strong> 封
                      </span>
                    </div>

                    {currentNonForcedOrders.length === 0 ? (
                      <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center space-y-2 text-xs">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                        <div className="font-bold text-gray-800">暂无待处理站内信通知</div>
                        <p className="text-[11px] text-gray-400">您的所有账单与转运通知均已处理完成。</p>
                      </div>
                    ) : (
                      currentNonForcedOrders.map(order => (
                        <div
                          key={order.id}
                          onClick={() => setSelectedStationMessage(order)}
                          className="bg-white hover:bg-blue-50/30 rounded-2xl p-3.5 border border-blue-100/80 shadow-2xs cursor-pointer transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                              【费用通知】{order.feeCategory}
                            </span>
                            <span className="text-[10px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full">
                              非强制 · 待支付
                            </span>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{order.feeName}</h4>
                            <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                              {order.feeDesc}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[11px]">
                            <div className="font-mono text-gray-900 font-bold">
                              金额: <span className="text-red-600">¥{order.amountJpy.toLocaleString()}</span> JPY
                            </div>
                            <span className="text-blue-600 font-bold flex items-center gap-0.5 text-[10.5px]">
                              <span>查阅信件并处理</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Tab: Mine */}
                {mobileTab === 'mine' && (
                  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-3 text-xs">
                    <div className="flex items-center gap-3 border-b pb-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                        508
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">会员账号 {currentAppMemberId}</div>
                        <div className="text-[10px] text-gray-400">已实名认证 · 信用良好</div>
                      </div>
                    </div>
                    <div className="space-y-1.5 text-gray-600 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span>乐淘钱包可用余额</span>
                        <span className="font-mono font-bold text-gray-900">¥8,900 JPY</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-50">
                        <span>国内默认收件地址</span>
                        <span className="text-gray-900 font-medium">北京市朝阳区***街道</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Mobile Tab Bar */}
              <div className="bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm flex items-center justify-around text-[10px] text-gray-500 shrink-0 mt-3">
                <button
                  type="button"
                  onClick={() => setMobileTab('home')}
                  className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                    mobileTab === 'home' ? 'text-rose-500 font-bold bg-rose-50/60' : 'hover:text-gray-800'
                  }`}
                >
                  <Store className="w-4 h-4" />
                  <span>首页</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('packages')}
                  className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                    mobileTab === 'packages' ? 'text-rose-500 font-bold bg-rose-50/60' : 'hover:text-gray-800'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>收藏</span>
                </button>
                <button
                  type="button"
                  onClick={() => showToast('已打开购物车')}
                  className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all hover:text-gray-800"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>购物车</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('messages')}
                  className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
                    mobileTab === 'messages' ? 'text-rose-500 font-bold bg-rose-50/60' : 'hover:text-gray-800'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  <span>通知</span>
                  {!currentForcedOrder && currentNonForcedOrders.length > 0 && (
                    <span className="absolute top-0.5 right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      1
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab('mine')}
                  className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
                    mobileTab === 'mine' ? 'text-rose-500 font-bold bg-rose-50/60' : 'hover:text-gray-800'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>我的</span>
                </button>
              </div>
            </div>
          )
        ) : (
            /* ======================================================== */
            /* =========== 🌐 微信公众号【乐酷淘】H5端 (网页端) ========== */
            /* ======================================================== */
            currentForcedOrder ? (
              /* --- H5 CASE 1: FORCED PAYMENT LOCKED FULL SCREEN CARD --- */
              <div className="space-y-3 animate-in fade-in duration-200">
                {/* H5 Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-900 font-medium flex items-center justify-between gap-2 shadow-2xs">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>微信公众号【乐酷淘】· 安全支付通道</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-mono">会员: {currentAppMemberId}</span>
                </div>

                {/* If multiple forced unpaid orders exist, display single-order independent payment alert */}
                {forcedUnpaidOrders.length > 1 && (
                  <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-2.5 text-[11px] text-amber-900 font-bold flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>含有 {forcedUnpaidOrders.length} 笔待付账单（逐单独立核对，不合并）</span>
                    </div>
                    <span className="bg-amber-200/90 text-amber-950 px-2 py-0.5 rounded-full text-[10px] shrink-0 font-extrabold border border-amber-300">
                      第 1/{forcedUnpaidOrders.length} 笔
                    </span>
                  </div>
                )}

                {/* Main Bill Card */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100/90 space-y-3.5">
                  {/* Title & Status */}
                  <div className="border-b border-gray-50 pb-2.5 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10.5px] text-blue-700 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                          {currentForcedOrder.feeCategory}
                        </span>
                        {/* Conditional Countdown Display */}
                        {(currentForcedOrder.validityHours > 0 || (currentForcedOrder.remainingHours && currentForcedOrder.remainingHours > 0)) && (
                          <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                            <span>剩余支付时间: {formatCountdown(countdownSeconds)}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded-full shrink-0 border border-red-100">
                        强制待支付
                      </span>
                    </div>

                    {/* Prominent Payment Title */}
                    <h3 className="text-sm font-extrabold text-gray-900 leading-snug pt-0.5">
                      {currentForcedOrder.feeName}
                    </h3>
                  </div>

                  {/* Amount Center Box */}
                  <div className="text-center py-3 bg-gradient-to-b from-[#fafbfc] to-[#f4f7fb] rounded-xl border border-gray-100 shadow-2xs">
                    <span className="text-[10.5px] text-gray-400 block font-normal">待支付金额 (JPY)</span>
                    <div className="text-2xl font-black text-gray-900 font-mono tracking-tight mt-0.5">
                      ¥{currentForcedOrder.amountJpy.toLocaleString()}
                      <span className="text-xs font-bold text-gray-600 ml-1.5">日元</span>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1 font-medium">
                      参考折合人民币: <span className="text-gray-700 font-mono font-bold">￥{(currentForcedOrder.amountRmb || currentForcedOrder.amountJpy * 0.0454).toFixed(2)}</span> RMB
                    </div>
                  </div>

                  {/* Key-Value Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">关联主订单号</span>
                      <span className="font-mono text-gray-700 font-medium">{currentForcedOrder.mainOrderNo}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-600">
                      <span className="text-gray-400">费用产生时间</span>
                      <span className="font-mono text-gray-700">{currentForcedOrder.createTime}</span>
                    </div>
                  </div>

                  {/* Detailed Reason Box */}
                  <div className="bg-[#f9fafc] border border-blue-100/80 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[11.5px] font-bold text-gray-800">
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>费用说明与详细原因</span>
                    </div>
                    <p className="text-[11.5px] text-gray-600 leading-relaxed pl-5 whitespace-pre-line">
                      {currentForcedOrder.feeDesc.replace(/^收费项:.*\n说明:\s*/, '') || currentForcedOrder.feeDesc}
                    </p>
                  </div>

                  {/* Proof Images Gallery */}
                  {currentForcedOrder.proofImages && currentForcedOrder.proofImages.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span className="flex items-center gap-1 font-semibold text-gray-700">
                          <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                          <span>单据凭证 / 官方税单</span>
                        </span>
                        <span
                          onClick={() => setPreviewImage(currentForcedOrder.proofImages![0])}
                          className="text-blue-600 text-[10.5px] cursor-pointer hover:underline"
                        >
                          点击放大查看
                        </span>
                      </div>
                      <div
                        onClick={() => setPreviewImage(currentForcedOrder.proofImages![0])}
                        className="relative h-28 rounded-xl overflow-hidden border border-gray-200 cursor-pointer group bg-gray-50 shadow-2xs"
                      >
                        <img
                          src={currentForcedOrder.proofImages[0]}
                          alt="Proof"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium gap-1">
                          <Eye className="w-3.5 h-3.5" /> 点击查看大图
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Channel Selection */}
                  <div className="pt-2 border-t border-gray-100 space-y-2">
                    <span className="text-[11px] font-bold text-gray-700 block">选择支付方式 (请自主勾选)</span>
                    <div className="space-y-1.5">
                      {/* WeChat Pay */}
                      <div
                        onClick={() => setSelectedPayMethod('wechat')}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedPayMethod === 'wechat'
                            ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-medium text-gray-800">微信支付 (公众号推荐)</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedPayMethod === 'wechat' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300'
                        }`}>
                          {selectedPayMethod === 'wechat' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>

                      {/* Alipay */}
                      <div
                        onClick={() => setSelectedPayMethod('alipay')}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedPayMethod === 'alipay'
                            ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-medium text-gray-800">支付宝支付</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedPayMethod === 'alipay' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                        }`}>
                          {selectedPayMethod === 'alipay' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>

                      {/* Balance Payment */}
                      <div
                        onClick={() => setSelectedPayMethod('balance')}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedPayMethod === 'balance'
                            ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-gray-800">预存金支付</span>
                          <span className="text-[10px] text-gray-400">(可用: ¥8,900 JPY)</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedPayMethod === 'balance' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                        }`}>
                          {selectedPayMethod === 'balance' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>

                      {/* UnionPay */}
                      <div
                        onClick={() => setSelectedPayMethod('unionpay')}
                        className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          selectedPayMethod === 'unionpay'
                            ? 'border-blue-500 bg-blue-50/40 shadow-xs'
                            : 'border-gray-200 bg-white hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-xs font-medium text-gray-800">银联支付</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          selectedPayMethod === 'unionpay' ? 'border-blue-500 bg-blue-500 text-white' : 'border-gray-300'
                        }`}>
                          {selectedPayMethod === 'unionpay' && <Check className="w-2.5 h-2.5" />}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Area */}
                <div className="pt-1 pb-2 space-y-2">
                  <button
                    type="button"
                    onClick={handleAppPay}
                    disabled={isPaying}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {isPaying ? (
                      <div className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>正在处理H5安全支付...</span>
                      </div>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>立即支付 ¥{currentForcedOrder.amountJpy.toLocaleString()} 日元</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowContactCsModal(true)}
                    className="w-full py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 font-medium text-xs rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Headphones className="w-3.5 h-3.5 text-emerald-600" />
                    <span>对此费用有疑问？联系专属客服核对</span>
                  </button>
                </div>
              </div>
            ) : (
              /* --- H5 CASE 2: ALL FORCED BILLS CLEARED -> PROMPT TO RETURN TO APP --- */
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center space-y-4 my-auto animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-gray-900">🎉 所有强制账单已全部结清</h3>
                  <p className="text-xs text-gray-500 leading-relaxed max-w-xs mx-auto">
                    您的账号限制已即时解除，出库及常规操作已全面恢复。您现在可以返回原生APP正常登录并使用。
                  </p>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 text-[11px] text-emerald-800 font-medium">
                  当前会员: <strong>5086662130</strong> · 状态: <strong>正常可用</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setClientViewMode('app');
                    setShowAccountRestrictedModal(false);
                    showToast('已返回原生APP端！');
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>返回原生APP登录</span>
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* ================= STATION MESSAGE DETAIL MODAL (站内信详细内容弹窗) ================= */}
      {selectedStationMessage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 border border-gray-100 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Send className="w-3.5 h-3.5 rotate-[-15deg]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">站内信通知详情</h3>
                  <div className="text-[10px] text-gray-400">发件方: 乐淘日本转运服务中心</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStationMessage(null)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] text-blue-700 font-bold bg-white px-2 py-0.5 rounded border border-blue-200">
                    {selectedStationMessage.feeCategory}
                  </span>
                  <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {selectedStationMessage.validityText}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-gray-900 pt-0.5">{selectedStationMessage.feeName}</h4>
                <div className="text-base font-black text-gray-900 font-mono pt-1">
                  ¥{selectedStationMessage.amountJpy.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-gray-500">JPY</span>
                  <span className="text-xs text-gray-400 font-normal ml-2">
                    (折合 ￥{selectedStationMessage.amountRmb || (selectedStationMessage.amountJpy * 0.0454).toFixed(2)} RMB)
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-gray-600">
                <div className="flex justify-between py-1 border-b border-gray-50 text-[11px]">
                  <span className="text-gray-400">通知发出时间</span>
                  <span className="font-mono text-gray-700">{selectedStationMessage.createTime}</span>
                </div>
              </div>

              <div className="bg-[#f9fafc] border border-gray-100 rounded-xl p-3 space-y-1 text-[11.5px]">
                <div className="font-bold text-gray-800 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>详细原因与内容说明</span>
                </div>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line pl-4">
                  {selectedStationMessage.feeDesc}
                </p>
              </div>

              {selectedStationMessage.proofImages && selectedStationMessage.proofImages.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>相关单据与凭证 ({selectedStationMessage.proofImages.length}张)</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedStationMessage.proofImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPreviewImage(img)}
                        className="relative h-20 rounded-xl overflow-hidden border border-gray-200 cursor-pointer bg-gray-50 group"
                      >
                        <img src={img} alt="Proof" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px]">
                          点击放大
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleNonForcedPay(selectedStationMessage)}
                disabled={isPaying}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                {isPaying ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>立即自主支付 (¥{selectedStationMessage.amountJpy.toLocaleString()} JPY)</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setSelectedStationMessage(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
              >
                已阅关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= RIGHT SIDE: ADMIN MANAGEMENT VIEW (DETAILED WORKFLOW & VALIDITY CONFIG) ================= */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden text-xs">
        {/* Top Breadcrumbs & Menu Header */}
        <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <span className="cursor-pointer hover:text-gray-900">首页</span>
            <span>/</span>
            <span className="cursor-pointer hover:text-gray-900">财务中心</span>
            <span>/</span>
            <span className="cursor-pointer hover:text-gray-900">通用支付</span>
            <span>/</span>
            <span className="text-gray-900 font-bold">通用收费与垫付订单管理</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-blue-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>当前测试会员: {currentAppMemberId}</span>
            </div>
          </div>
        </div>

        {/* Secondary Page Tabs Bar */}
        <div className="bg-[#f5f7fa] border-b border-gray-200 px-4 py-1.5 flex items-center gap-2 shrink-0 overflow-x-auto">
          <span className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded cursor-pointer">首页</span>
          <span className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded cursor-pointer flex items-center gap-1">
            会员列表 <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </span>
          <span className="px-2.5 py-1 text-xs text-gray-600 hover:bg-gray-200 rounded cursor-pointer flex items-center gap-1">
            仓库出库管理 <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </span>
          <span className="px-3 py-1 text-xs text-blue-700 bg-white border border-gray-300 rounded font-bold flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            通用支付订单管理 (含强制拦截与时效配置) <X className="w-3 h-3 text-gray-400 hover:text-gray-600" />
          </span>
        </div>

        {/* Filter / Search Bar (Rich Search Controls) */}
        <div className="p-4 bg-white border-b border-gray-200 space-y-3 shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2.5">
            <div className="col-span-2 sm:col-span-2 md:col-span-2">
              <label className="text-[11px] font-bold text-blue-700 block mb-1 flex items-center gap-1">
                <Search className="w-3 h-3 text-blue-600" /> 详细输入栏 (唯一值搜索)
              </label>
              <input
                type="text"
                placeholder="搜索主单号/分单号/支付单号/会员ID..."
                value={searchDetailQuery}
                onChange={e => setSearchDetailQuery(e.target.value)}
                className="w-full border border-blue-300 bg-blue-50/30 rounded-lg px-2.5 py-1.5 text-xs text-blue-950 font-mono font-medium focus:outline-none focus:border-blue-600 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">收费项名称</label>
              <input
                type="text"
                placeholder="如: 税金/退运费..."
                value={searchFeeName}
                onChange={e => setSearchFeeName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">主订单号(LO/OR)</label>
              <input
                type="text"
                placeholder="主订单编号"
                value={searchMainOrder}
                onChange={e => setSearchMainOrder(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">会员账号ID</label>
              <input
                type="text"
                placeholder="如: 5086662130"
                value={searchMemberId}
                onChange={e => setSearchMemberId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">费用类别</label>
              <select
                value={searchFeeCategory}
                onChange={e => setSearchFeeCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="">全部费用类别</option>
                <option value="退运邮费">【退运邮费】(高频硬拦截)</option>
                <option value="入库到付">【入库到付】(高频硬拦截)</option>
                <option value="包裹税金">【包裹税金】(高频硬拦截)</option>
                <option value="海关补交税金">海关关税/清关关税补缴</option>
                <option value="海运退运费">海运退运费</option>
                <option value="航空退运费">航空退运费</option>
                <option value="运费差额补缴">运费差额补缴</option>
                <option value="违规及对应手续费">违规及对应手续费</option>
                <option value="超期滞仓费">超期滞仓费</option>
                <option value="增值服务费">增值服务费</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">拦截属性</label>
              <select
                value={searchIsForced}
                onChange={e => setSearchIsForced(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="">全部拦截属性</option>
                <option value="true">强制支付 (锁定APP全屏)</option>
                <option value="false">非强制 (普通服务)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-gray-500 block mb-1">支付状态</label>
              <select
                value={searchStatus}
                onChange={e => setSearchStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
              >
                <option value="">全部支付状态</option>
                <option value="未支付">未支付</option>
                <option value="已支付">已支付</option>
                <option value="已过期作废">已过期作废</option>
              </select>
            </div>

            <div className="flex items-end gap-1.5 col-span-2 sm:col-span-1">
              <button
                type="button"
                onClick={() => {
                  setSearchFeeName('');
                  setSearchMainOrder('');
                  setSearchDetailQuery('');
                  setSearchSubOrder('');
                  setSearchMemberId('');
                  setSearchFeeCategory('');
                  setSearchStatus('');
                  setSearchIsForced('');
                }}
                className="border border-gray-300 hover:bg-gray-50 text-gray-600 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors h-[31px]"
              >
                <RotateCcw className="w-3 h-3" /> 重置
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setModalIsForced(null);
                  setShowAddModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Plus className="w-3.5 h-3.5" /> 创建通用支付订单
              </button>

              <span className="text-[11px] text-gray-400 ml-2">
                共找到 <strong className="text-gray-800">{filteredOrders.length}</strong> 笔订单
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> 强制支付 = 锁定用户端全屏支付
              </span>
              <span className="flex items-center gap-1 ml-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> 非强制 = 普通业务 (有时效倒计时/超时自动作废)
              </span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto bg-white custom-scrollbar">
          <table className="w-full text-left border-collapse text-[12px] min-w-[1200px]">
            <thead>
              <tr className="bg-[#fafafa] border-b border-gray-200 text-gray-600 font-medium">
                <th className="py-2.5 px-3">收费项名称 (管理端选择/输入)</th>
                <th className="py-2.5 px-3">主订单编号(OR/LO)</th>
                <th className="py-2.5 px-3">会员ID</th>
                <th className="py-2.5 px-3">费用类别</th>
                <th className="py-2.5 px-3">拦截属性</th>
                <th className="py-2.5 px-3 w-[160px]">时效配置 (APP端倒计时)</th>
                <th className="py-2.5 px-3 w-[280px]">详细原因与凭证 (管理端输入/上传)</th>
                <th className="py-2.5 px-3">金额 (JPY)</th>
                <th className="py-2.5 px-3">RMB折合</th>
                <th className="py-2.5 px-3">支付状态</th>
                <th className="py-2.5 px-3">创建时间</th>
                <th className="py-2.5 px-3">支付单号</th>
                <th className="py-2.5 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredOrders.map(item => (
                <tr key={item.id} className="hover:bg-blue-50/25 transition-colors">
                  {/* Name */}
                  <td className="py-3 px-3 font-bold text-gray-900">
                    <div className="flex items-center gap-1.5">
                      <span>{item.feeName}</span>
                    </div>
                  </td>

                  {/* Order No */}
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-700">
                    {item.mainOrderNo}
                  </td>

                  {/* Member ID */}
                  <td className="py-3 px-3 font-mono font-medium text-gray-800">
                    {item.memberId}
                  </td>

                  {/* Fee Category */}
                  <td className="py-3 px-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px] font-medium border border-gray-200">
                      {item.feeCategory}
                    </span>
                  </td>

                  {/* Forced / Advanced Attribute */}
                  <td className="py-3 px-3">
                    {item.isForced ? (
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[10.5px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
                        <Lock className="w-3 h-3 text-red-600" /> 强制支付 (锁定APP)
                      </span>
                    ) : (
                      <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10.5px] px-2 py-0.5 rounded-full font-medium inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-600" /> 非强制 (普通)
                      </span>
                    )}
                  </td>

                  {/* Validity / Timeliness Column */}
                  <td className="py-3 px-3 text-[11px]">
                    {item.validityHours === 0 ? (
                      <div className="text-gray-700 font-medium bg-gray-50 px-2 py-1 rounded border border-gray-200">
                        无倒计时
                        <span className="block text-[9.5px] text-gray-400 font-normal">APP端不显示倒计时</span>
                      </div>
                    ) : (
                      <div className="text-amber-800 bg-amber-50/80 px-2 py-1 rounded border border-amber-200/80">
                        {item.validityHours}小时倒计时
                        <span className="block text-[9.5px] text-amber-600 font-normal">APP端显示倒计时</span>
                      </div>
                    )}
                  </td>

                  {/* Description & Images */}
                  <td className="py-3 px-3 text-[11.5px] leading-relaxed text-gray-600">
                    <p className="line-clamp-2">{item.feeDesc}</p>
                    {item.proofImages && item.proofImages.length > 0 && (
                      <div
                        className="mt-1 flex items-center gap-1 text-blue-600 cursor-pointer hover:underline text-[11px] font-medium"
                        onClick={() => setPreviewImage(item.proofImages![0])}
                      >
                        <ImageIcon className="w-3 h-3" />
                        <span>含 {item.proofImages.length} 张单据/称重凭据 (点击查看)</span>
                      </div>
                    )}
                  </td>

                  {/* Amount JPY */}
                  <td className="py-3 px-3 font-mono font-bold text-gray-900 text-xs">
                    ¥{item.amountJpy.toLocaleString()} JPY
                  </td>

                  {/* Amount RMB */}
                  <td className="py-3 px-3 font-mono text-gray-600 text-xs">
                    ￥{item.amountRmb || (item.amountJpy * 0.0454).toFixed(2)}
                  </td>

                  {/* Payment Status */}
                  <td className="py-3 px-3 font-medium">
                    {item.status === '未支付' ? (
                      <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        未支付
                      </span>
                    ) : item.status === '已支付' ? (
                      <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                        已支付
                      </span>
                    ) : (
                      <span className="text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        已过期作废
                      </span>
                    )}
                  </td>

                  {/* Create Time */}
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-500">
                    {item.createTime}
                  </td>

                  {/* Pay No */}
                  <td className="py-3 px-3 font-mono text-[11px] text-gray-500">
                    {item.payNo || '-'}
                  </td>

                  {/* Operations */}
                  <td className="py-3 px-3 text-center">
                    {item.status === '未支付' ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(item.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 px-2.5 py-1 rounded text-xs transition-colors"
                      >
                        删除
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">已归档</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: 新增通用支付订单 ================= */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[580px] max-w-full overflow-hidden animate-in zoom-in-95 duration-150 border border-gray-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#f8fafd]">
              <div>
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>创建通用支付订单</span>
                </h3>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  支持海关补交税金、海运退运费、航空退运费、运费差额补缴及各类费用
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleCreateOrder} onPaste={handlePasteImage} className="p-6 space-y-4 text-xs overflow-y-auto custom-scrollbar flex-1">
              {/* 会员ID (强制输入) */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-gray-600 shrink-0 font-medium">
                  <span className="text-red-500 mr-0.5">*</span> 用户ID (会员ID)
                </label>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="请输入会员账号ID (如 5086662130)"
                    value={modalMemberId}
                    onChange={e => setModalMemberId(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs font-mono text-gray-800 focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* 支付标题 (强制输入，支持可选或自定义输入) */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-gray-600 shrink-0 font-medium">
                  <span className="text-red-500 mr-0.5">*</span> 支付标题
                </label>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    placeholder="请输入支付标题（将明确展示在APP用户端）"
                    value={modalFeeName}
                    onChange={e => setModalFeeName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-800 font-medium focus:outline-none focus:border-blue-500"
                    required
                  />
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="text-gray-500 font-medium">高频预设 (默认硬拦截):</span>
                      <button
                        type="button"
                        onClick={() => handleCategoryPresetChange('退运邮费')}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          modalFeeCategory === '退运邮费'
                            ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        <span>【退运邮费】</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCategoryPresetChange('入库到付')}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          modalFeeCategory === '入库到付'
                            ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        <span>【入库到付】</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCategoryPresetChange('包裹税金')}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          modalFeeCategory === '包裹税金'
                            ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                            : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                        }`}
                      >
                        <span>【包裹税金】</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                      <span>更多预设:</span>
                      <select
                        onChange={e => {
                          if (e.target.value) handleCategoryPresetChange(e.target.value as FeeCategory);
                        }}
                        value={modalFeeCategory}
                        className="border border-gray-200 rounded px-2 py-0.5 text-[11px] bg-white text-gray-700 font-medium"
                      >
                        <option value="" disabled>选择预设标题...</option>
                        <option value="退运邮费">【退运邮费】(退回包裹运费 · 默认强制支付)</option>
                        <option value="入库到付">【入库到付】(仓库到付包裹垫付款 · 默认强制支付)</option>
                        <option value="包裹税金">【包裹税金】(海关清关查验税费 · 默认强制支付)</option>
                        <option value="运费差额补缴">运费差额补缴 (实重与体积重超差)</option>
                        <option value="违规及对应手续费">违规及对应手续费 (违禁品处置)</option>
                        <option value="超期滞仓费">超期滞仓费 (超期仓储收费)</option>
                        <option value="增值服务费">增值服务费 (拍照/加固等)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* 支付金额 (强制输入) */}
              <div className="flex items-center gap-3">
                <label className="w-24 text-right text-gray-600 shrink-0 font-medium">
                  <span className="text-red-500 mr-0.5">*</span> 支付金额 (JPY)
                </label>
                <div className="flex-1 flex">
                  <input
                    type="number"
                    placeholder="请输入日元金额"
                    value={modalAmountJpy}
                    onChange={e => setModalAmountJpy(Number(e.target.value))}
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-1.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                    required
                    min={1}
                  />
                  <span className="bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg px-3 py-1.5 text-gray-700 font-bold text-xs flex items-center shrink-0">
                    日元
                  </span>
                </div>
              </div>

              {/* 是否强制支付 (必须人工主动二选一选择) */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right text-gray-700 font-bold shrink-0 pt-1">
                  <span className="text-red-500 mr-0.5">*</span> 是否强制支付
                </label>
                <div className="flex-1 space-y-2">
                  {modalIsForced === null && (
                    <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1 font-semibold animate-pulse">
                      ⚠️ 请人工主动选择拦截模式（二选一必选）
                    </div>
                  )}

                  <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    modalIsForced === true ? 'bg-red-50/90 border-red-400 ring-2 ring-red-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="isForced_modal"
                      checked={modalIsForced === true}
                      onChange={() => {
                        setModalIsForced(true);
                        setModalHasCountdown(false);
                      }}
                      className="mt-0.5 text-red-600 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-red-700 text-xs flex items-center gap-1">
                        <Lock className="w-3 h-3" /> 强制支付 (锁定APP用户端全屏)
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        强制支付模式下：用户打开APP仅展示此支付界面，无法进行其他操作。<strong>无倒计时显示</strong>。
                      </p>
                    </div>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    modalIsForced === false ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-200' : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="isForced_modal"
                      checked={modalIsForced === false}
                      onChange={() => {
                        setModalIsForced(false);
                        setModalHasCountdown(true);
                      }}
                      className="mt-0.5 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-blue-700 text-xs flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 非强制支付 (带倒计时时效)
                      </div>
                      <p className="text-[11px] text-gray-600 mt-0.5">
                        非强制支付模式下：不锁定APP其他常规功能，<strong>带有时效倒计时</strong>（超时自动作废）。
                      </p>
                      {modalIsForced === false && (
                        <div className="mt-2 flex items-center gap-2 pt-1.5 border-t border-blue-200/60">
                          <span className="text-[11px] text-blue-900 font-bold bg-blue-100/80 px-2.5 py-1 rounded-md border border-blue-200/80 inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            倒计时时长：默认 24 小时倒计时 (系统自动设定，无需手动选择)
                          </span>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* 详细输入栏 */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right text-gray-600 shrink-0 pt-1.5 font-medium">
                  详细输入栏
                </label>
                <div className="flex-1">
                  <textarea
                    rows={3}
                    placeholder="请输入详细原因与说明（如海关实际查验差额、退运原因等，将完整展示给APP用户）..."
                    value={modalDetailReason}
                    onChange={e => setModalDetailReason(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* 图片上传栏 (仅限1张，支持点击选择文件或直接 Ctrl+V / Cmd+V 剪贴板粘贴) */}
              <div className="flex items-start gap-3">
                <label className="w-24 text-right text-gray-600 shrink-0 pt-1 font-medium">
                  图片上传栏
                </label>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    {modalImageUrls.length > 0 && (
                      <div className="relative w-16 h-16 rounded-xl border border-gray-200 overflow-hidden group shadow-2xs shrink-0">
                        <img src={modalImageUrls[0]} alt="Proof" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setModalImageUrls([])}
                          className="absolute top-0.5 right-0.5 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-xs transition-colors"
                          title="删除图片"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    )}

                    <label className="h-16 flex-1 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:text-blue-600 transition-colors bg-gray-50/80 hover:bg-blue-50/20 p-2 text-center">
                      <ImageIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-[11px] font-bold mt-0.5 text-gray-700">
                        {modalImageUrls.length > 0 ? '点击更换凭证 (或直接按 Ctrl+V 粘贴覆盖)' : '点击上传 或 复制图片直接 Ctrl+V / Cmd+V 粘贴'}
                      </span>
                      <span className="text-[9.5px] text-gray-400">仅限 1 张单据凭证</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = event => {
                              if (event.target?.result) {
                                setModalImageUrls([event.target!.result as string]);
                                showToast('已成功导入图片');
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10.5px] text-gray-400 leading-snug">
                    支持海关税单、称重凭证、退运照片等（仅支持1张）。复制图片后可在此处直接按 <strong>Ctrl+V / Cmd+V</strong> 快捷粘贴。
                  </p>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-600 rounded-lg text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  确定创建
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: CONTACT CUSTOMER SERVICE ================= */}
      {showContactCsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-[380px] max-w-full overflow-hidden flex flex-col h-[500px] border border-gray-100 animate-in zoom-in-95">
            {/* CS Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs">乐淘专属人工客服</h4>
                  <p className="text-[10px] text-blue-100">在线为您核实海关垫付税单与退运明细</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowContactCsModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#f8f9fb] text-xs custom-scrollbar">
              {csChatHistory.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      item.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-xs'
                        : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    <p className="leading-relaxed text-[11.5px]">{item.text}</p>
                    <span
                      className={`text-[9.5px] block text-right mt-1 font-mono ${
                        item.sender === 'user' ? 'text-blue-200' : 'text-gray-400'
                      }`}
                    >
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendCsMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2">
              <input
                type="text"
                placeholder="发送消息咨询关于此笔垫付费用的疑义..."
                value={csMessage}
                onChange={e => setCsMessage(e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition-all"
              >
                <Send className="w-3 h-3" /> 发送
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROOF IMAGE ZOOM ================= */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-3 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2.5 px-2 text-xs text-gray-700 font-bold border-b border-gray-100 mb-2">
              <span className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                <span>官方垫付单据 / 海关税单 / 称重凭证预览</span>
              </span>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="text-gray-400 hover:text-gray-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img src={previewImage} alt="Preview" className="w-full max-h-[70vh] object-contain rounded-xl bg-gray-50" />
          </div>
        </div>
      )}
    </div>
  );
}
