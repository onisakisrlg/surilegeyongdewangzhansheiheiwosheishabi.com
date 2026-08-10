import { PrototypeProject } from "./types";

export const MOCK_PROJECTS: PrototypeProject[] = [
  {
    id: "20260806",
    name: "通用支付强制支付",
    category: "账单与支付",
    description: "针对仓储超期费、海关清关补税、运费差额补缴及特殊加固等场景，设计的通用支付创建与APP端强制支付硬拦截管控全流程需求规范。",
    previewUrl: null,
    redmineUrl: "https://redmine.rakutao.vip/issues/15208",
    status: "in-progress",
    specs: [
      {
        title: "一、 需求背景与核心目标",
        content: "1. 业务痛点：用户包裹在仓库超期占用空间、海关实际妥投清关环节产生税费查验补缴差额、或实际发货重超出预估产生运费补缴时，需由仓库向指定用户发起通用补缴账单。过去部分失联或放弃包裹的用户存在欠款拒付风险，导致仓库亏损。\n2. 核心目标：建立管理端灵活创建账单能力，并在APP端实现【强制支付】与【非强制支付】硬拦截规则，确保欠费即时扣缴并恢复业务出库。"
      },
      {
        title: "二、 管理端（后台）订单创建规范",
        content: "1. 会员ID录入：支持手动输入或快速选取目标会员ID（如 5086662130）。\n2. 支付标题与快捷预设：提供常用快捷预设（海关清关关税差额补缴、日本邮局海运退运运费、包裹超期仓储滞留费、特殊拆包加固服务费等），同时支持自定义标题。\n3. 支付金额 (JPY)：仅输入日元金额（如 1249 JPY），页面不显示任何折合人民币 (RMB) 换算，保持结算币种统一。\n4. 拦截模式 (二选一必选)：\n   - 禁止默认勾选任何选项，创建时必须由管理员人工主动二选一选择。\n   - 强制支付模式：开启后全屏锁定APP客户端，用户打开APP仅展示待支付卡片，无法进行打包出库、余额提现或新订单提交；不显示倒计时。\n   - 非强制支付模式：不锁定APP常规功能，带有时效倒计时（可设12h/24h/48h/72h，超时自动作废）。\n5. 详细原因与说明：填入具体费用说明（如“包裹在海关实际妥投清关环节产生税费查验差额…”）。\n6. 凭证图片上传（仅限1张 & 支持粘贴）：\n   - 限制数量：仅支持上传 1 张凭证图片（海关税单、称重记录等）。\n   - 快捷粘贴：支持点击上传，同时支持在弹窗内直接按 Ctrl+V / Cmd+V 快捷粘贴剪贴板中的图片，大幅提升仓库开单效率。"
      },
      {
        title: "三、 APP移动端展示与支付规范",
        content: "1. 全屏卡片展示：强制支付模式下，APP进入全屏账单待支付状态。\n2. 金额与详情列示：仅展示待支付日元金额（¥1,249 日元），隐藏折合人民币；展示详细费用说明及单张凭证（点击放大预览）。\n3. 头部信息精简：顶部仅展示【待支付】状态标签，隐藏冗余的费种分类标签，且不显示关联合约主单号，保持页面整洁。\n4. 支付渠道选择：提供【微信支付】、【支付宝支付】、【预存金支付】（展示可用余额）、【银联支付】4种标准渠道；所有选项使用纯文字标题列示，不包含图标/Logo，默认选中【微信支付】。\n5. 支付解除：用户完成支付后，系统即时更新订单状态为[已支付]，自动解除APP硬拦截锁定。"
      },
      {
        title: "四、 异常处理与账单撤销流程",
        content: "1. 订单作废与撤销：对于存在争议的账单，后台主管可以一键执行“作废/删除”，系统即时释放APP端的锁定状态。\n2. 记录与追溯：管理端订单列表清晰展示创建时间、应付金额、拦截模式及处理人信息，具备全链路追溯能力。"
      }
    ]
  },
  {
    id: "20260708",
    name: "出库与管理端结构化",
    category: "仓库打包",
    description: "展示app端和管理端。app端对应的操作会让管理端显示什么标签。",
    previewUrl: null,
    redmineUrl: null,
    status: "completed",
    specs: [
      {
        title: "设计说明",
        content: "1. 左侧APP端我的订单列表及发起打包交互。\n2. 右侧管理端展示最终仓库执行单的结构化信息。"
      },
      {
        title: "步骤1：选择物流意向 (选项列表)",
        content: "1. 体积重量取大值路线\n  - 蒲公英-顺丰国际\n  - 蒲公英-京东物流\n  - 顺丰杂货\n  - 顺丰饰品专线\n  - 顺丰衣物特快小包\n  - 顺丰娃娃专线\n  - 顺丰手办玩偶专线\n  - 中通杂货\n  - 申通杂货\n\n2. 纯重量路线 (不看体积)\n  - 【EMS-日本邮政】\n  - 【空运-日本邮政】\n  - 【海运-日本邮政】\n  - 【EPL小包裹-日本邮政】\n\n3. 特定路线 (专线打包)\n  - 衣服专线\n  - 玩偶专线\n  - 大件专线\n  - 奢侈品专线\n\n4. 我不知道，打包后再看看"
      },
      {
        title: "步骤2：箱子选项",
        content: "1. 尽量用免费旧纸箱\n2. 【付费】必须用全新纸箱（顺丰/京东国际等路线强制）\n3. 【付费】原箱打包不更换（适合本身带结实外箱的单件）\n4. 【免费】直接套快递袋发货（适合毛绒/衣服）"
      },
      {
        title: "步骤3：控制重量/体积",
        content: "1. 正常打包（不刻意控制）\n2. 控制总重量不超过（可设置克数）\n3. 取出指定入库单包裹（可选择）\n4. 取出最重的包裹\n5. 取出体积最大的包裹"
      },
      {
        title: "步骤4：拆包要求",
        content: "1. 不拆原包裹的快递纸箱\n2. 拆除原快递纸箱，保留商品原包装\n3. 极致减重：丢弃商品外包装/鞋盒等"
      },
      {
        title: "步骤5：其他增值服务",
        content: "1. 使用加厚气泡柱加固\n2. 拍照核验商品状态"
      }
    ]
  },

  {
    id: "20260508",
    name: "海运退运方案",
    category: "跨境物流",
    description: "针对日本邮局海运包裹派送失败退回的潜在高额追加运费痛点，设计的退运运费预扣费选项原型。",
    previewUrl: null,
    redmineUrl: "https://redmine.rakutao.vip/issues/14325",
    specs: [
      {
        title: "设计要点",
        content: (
          <span className="text-red-500 font-bold">当用户选择原路寄回时，文件导出代码为0，当用户选择放弃包裹时，代码为2</span>
        )
      },
      {
        title: "交互点击逻辑",
        content: "1. 当用户进入运单选择主页面，默认选中‘国际邮包海运’渠道。\n2. 此时，下级物流选项区域会高亮并滑入展示日本邮局海运/空运退回额外费用的提示，以及【原路寄回】与【放弃包裹】两选一选项。\n3. 该特别处理选项是由日本邮政官方规则导致，主要解决包裹退运时被强征退回运费的行业痛点。\n4. 若用户点击选择切换到其他渠道（如 EMS、顺丰大件 等），则会隐藏该选项卡。"
      },
      {
        title: "退运运费预扣与计算规则",
        content: "1. 当用户勾选【📦 【原路寄回】】并支付时：常规运费 5000円 + 箱子费 200円 + 预收退运运费 5000円 (与正常运费等额) = 实付共 10200円（支付时在右下角合计中实时体现）。\n2. 当用户勾选【🗑 【放弃包裹】】并支付时：由于不再需要退运回航路费，实付款不征收退运运费，共计 5200円（运费 5000円 + 200円箱子费）。"
      },
      {
        title: "正常派送妥退规则与退还步骤",
        content: "1. 只要包裹可以顺利配送给国内用户，确认完妥投签收后，用户即可凭收件记录联系客服申请全额原口径返还 5000 JPY 退运运费。"
      },
      {
        title: "业务背景",
        content: "由于海外退回日本运金极高（常等同于发件邮资），若用户在失联或拒付情况下强行要求退回，会导致仓库被迫代为垫付，长期累计亏损沉重。本交互通过前置双重确认把控，让用户对退运逻辑有直白地了解，不仅能极大减轻垫资风险，还免去了繁杂的工单站内信频繁沟通负担。"
      }
    ]
  },
  {
    id: "20260511",
    name: "打包异常图片显示",
    category: "仓库打包",
    description: "展示打包过程中出现的异常图片及处理流程。",
    previewUrl: null,
    redmineUrl: "https://redmine.rakutao.vip/issues/14370",
    specs: [
      {
        title: "设计说明",
        content: "1. 管理端提供【取出】【拆分】【丢弃】【破损】四个功能按钮，点击展开【拍照】与【上传】菜单。经与人员确认，目前每个异常项仅支持 1 张存证照片，暂不支持多图。\n2. 管理端异常处理状态流：\n   - 初始状态：显示功能标签，背景白色。\n   - 上传成功：背景变为绿色，显示“√[名称]已上传”。\n   - 撤销：点击图片右上角删除按钮可清除照片并重置为初始状态。\n3. 用户端（APP）显示逻辑：\n   - 包裹附件状态看板：显示四个异常处理项状态按钮。\n   - 无异常情况：显示绿色背景，文字显示为“无[名称]”（如：无取出）。\n   - 有异常情况：显示红色背景并带有呼吸环效果，文字显示为“有[名称]”（如：有取出），点击按钮可调起唯一一张存证照片的大图查看界面。\n4. 标准打包图逻辑：\n   - 管理端：提供首个标准拍照位，后续点击“+”号占位符可连续添加多张打包过程图（区别于异常处理的单图逻辑）。"
      }
    ]
  },
  {
    id: "20260515",
    name: "入库新增按钮",
    category: "仓储管理",
    description: "复刻管理端 仓储入库(2.0) 界面，包含关联订单搜索与入库记录展示。",
    previewUrl: null,
    redmineUrl: "https://redmine.rakutao.vip/issues/14629",
    status: "completed",
    specs: [
      {
        title: "入库控制与订单标签说明",
        content: "1. 问题单标记：入库期间如发现商品/包装出现异常或为问题包裹，可点击【问题单】按钮，系统将在订单标签中即时追加【问题单】状态，方便后续在管理端直接筛选和检索。\n2. 带箱入库标记：点击【设为带箱】按钮，订单标签中将追加显示【含箱重量】，用于针对重货附纸箱在内的重量资费特殊计算。\n3. 高价标记：点击【设为高价】按钮，订单标签中将追加显示【高价】，用以在仓内对高价值贵重商品进行特别标记与保管。\n4. 流转箱扫码与流转逻辑：\n   - 【首次双箱绑定】：入库人员首次入库时，需要扫码绑定2个流转箱，包含普通流转箱及高价流转箱。其中普通流转箱由入库人员根据作业进度自行切换；高价流转箱由主管每日提供共用编码（供多人共用，方便每日高价件集中计数）。\n   - 【问题单流转规则】：当点击【设为问题】时，入库成功后该异常包裹/问题单【不会】被记录到任何流转箱中，而继续入库下一单时，界面将【自动保持】当前的普通流转箱编码不变。\n   - 【高价单流转规则】：当点击【设为高价】时，入库成功后该订单将【自动记录】到提前绑定/扫码好的【高价流转箱】中；入库下一单其流转箱自动【复原/恢复】为当前的普通流转箱编码，无需人工频繁切换。"
      }
    ]
  }
];

export const MOCK_PACKAGE_ORDERS = [
  { id: "S7-00042752", title: "進撃の巨人 一番くじ アクスタ B エレン ライナー ベルト...", platform: "煤炉", weight: 17, price: 300, image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=300&q=80", color: "#e71f19" },
  { id: "S7-00042753", title: "SPY×FAMILY アーニャ フィギュア", platform: "骏河屋", weight: 150, price: 1200, image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=300&q=80", color: "#005baa" },
  { id: "S7-00042754", title: "呪術廻戦 0 乙骨憂太 缶バッジ", platform: "乐天市场", weight: 25, price: 450, image: "https://images.unsplash.com/photo-1580477667995-2b94f01c9516?auto=format&fit=crop&w=300&q=80", color: "#bf0000" },
  { id: "S7-00042755", title: "ポケモンカード ピカチュウ プロモ", platform: "雅虎拍卖", weight: 10, price: 3500, image: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=300&q=80", color: "#fdcd04" },
  { id: "S7-00042756", title: "鬼滅の刃 煉獄杏寿郎 アクリルスタンド", platform: "煤炉", weight: 35, price: 800, image: "https://images.unsplash.com/photo-1606660265514-358ebbadc80d?auto=format&fit=crop&w=300&q=80", color: "#e71f19" },
  { id: "S7-00042757", title: "チェンソーマン マキマ ぬいぐるみ", platform: "骏河屋", weight: 200, price: 2500, image: "https://images.unsplash.com/photo-1555529902-5261145633bf?auto=format&fit=crop&w=300&q=80", color: "#005baa" },
  { id: "S7-00042758", title: "初音ミク フィギュア 2024ver", platform: "乐天市场", weight: 450, price: 8500, image: "https://images.unsplash.com/photo-1614298135832-6a454d63da6f?auto=format&fit=crop&w=300&q=80", color: "#bf0000" },
  { id: "S7-00042759", title: "ワンピース ルフィ ギア5 フィギュア", platform: "雅虎拍卖", weight: 600, price: 12000, image: "https://images.unsplash.com/photo-1560933758-d51a660d3dce?auto=format&fit=crop&w=300&q=80", color: "#fdcd04" },
  { id: "S7-00042760", title: "僕のヒーローアカデミア 爆豪勝己 アクキー", platform: "煤炉", weight: 15, price: 500, image: "https://images.unsplash.com/photo-1533230635443-bd217e5831dc?auto=format&fit=crop&w=300&q=80", color: "#e71f19" },
  { id: "S7-00042761", title: "ブルーロック 潔世一 タオル", platform: "骏河屋", weight: 100, price: 1500, image: "https://images.unsplash.com/photo-1629897048514-3dd7414bc7fb?auto=format&fit=crop&w=300&q=80", color: "#005baa" },
  { id: "S7-00042762", title: "ハイキュー!! 日向翔陽 ポスター", platform: "乐天市场", weight: 80, price: 900, image: "https://images.unsplash.com/photo-1579208031304-43666d925505?auto=format&fit=crop&w=300&q=80", color: "#bf0000" },
  { id: "S7-00042763", title: "五等分の花嫁 中野三玖 Tシャツ", platform: "雅虎拍卖", weight: 250, price: 3200, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=300&q=80", color: "#fdcd04" },
  { id: "S7-00042764", title: "ソードアート・オンライン アスナ フィギュア", platform: "煤炉", weight: 350, price: 4500, image: "https://images.unsplash.com/photo-1570534241033-ce20ec075b22?auto=format&fit=crop&w=300&q=80", color: "#e71f19" },
  { id: "S7-00042765", title: "Re:ゼロから始める異世界生活 レム マグカップ", platform: "骏河屋", weight: 300, price: 1800, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=300&q=80", color: "#005baa" },
  { id: "S7-00042766", title: "ウマ娘 プリティーダービー スペシャルウィーク ぬいぐるみ", platform: "乐天市场", weight: 180, price: 2200, image: "https://images.unsplash.com/photo-1582298538104-fe2e74cb3caa?auto=format&fit=crop&w=300&q=80", color: "#bf0000" },
  { id: "S7-00042767", title: "Fate/Grand Order マシュ キーホルダー", platform: "雅虎拍卖", weight: 20, price: 600, image: "https://images.unsplash.com/photo-1627067822997-74ff91962325?auto=format&fit=crop&w=300&q=80", color: "#fdcd04" },
  { id: "S7-00042768", title: "名探偵コナン 江戸川コナン クリアファイル", platform: "煤炉", weight: 50, price: 400, image: "https://images.unsplash.com/photo-1512413914486-5d66ccb392ee?auto=format&fit=crop&w=300&q=80", color: "#e71f19" },
  { id: "S7-00042769", title: "ドラえもん のび太 フィギュア", platform: "骏河屋", weight: 120, price: 1100, image: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?auto=format&fit=crop&w=300&q=80", color: "#005baa" },
  { id: "S7-00042770", title: "NARUTO ナルト うずまきナルト クッション", platform: "乐天市场", weight: 400, price: 2800, image: "https://images.unsplash.com/photo-1563261629-9e8c3b9b4f7f?auto=format&fit=crop&w=300&q=80", color: "#bf0000" },
  { id: "S7-00042771", title: "銀魂 坂田銀時 コスプレ衣装", platform: "雅虎拍卖", weight: 800, price: 6500, image: "https://images.unsplash.com/photo-1596489379659-1972f10b777a?auto=format&fit=crop&w=300&q=80", color: "#fdcd04" },
  { id: "S7-00042772", title: "ジョジョの奇妙な冒険 空条承太郎 フィギュア", platform: "煤炉", weight: 450, price: 5500, image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=300&q=80", color: "#e71f19" },
  { id: "S7-00042773", title: "HUNTER×HUNTER キルア アクリルキーホルダー", platform: "骏河屋", weight: 25, price: 850, image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=300&q=80", color: "#005baa" }
];

export const ADDONS_LIST = [
  { id: 'keep_box', name: '整箱发货', price: 300, desc: '保留原箱直接发货，体积可能偏大' },
  { id: 'bubble', name: '气泡柱加固', price: 500, desc: '全面防震保护，适合易碎品' },
  { id: 'remove_box', name: '去除原包装', price: 0, desc: '极致减重，可能影响商品完好' },
  { id: 'photo', name: '打包后拍照', price: 200, desc: '发货前确认状态，多角度拍摄' },
];

export const LOGISTICS_ROUTES = [
  { id: 'ems', name: 'EMS-邮政路线', type: 'weight', desc: '首重轻，按重量计费，通关快' },
  { id: 'sea', name: '海运-邮政路线', type: 'weight', desc: '时效较慢，大重量性价比极高' },
  { id: 'air', name: '空运-邮政路线', type: 'weight', desc: '速度快，纯重量计费，适合轻包裹' },
  { id: 'epl', name: 'EPL-邮政路线', type: 'weight', desc: '特惠邮政线路，性价比之选' },
  { id: 'sf_misc', name: '顺丰杂货', type: 'volume', desc: '按体积重计费，适合重小件' },
  { id: 'dande_jd', name: '蒲公英-京东', type: 'volume', desc: '阳光清关，体积计费，时效稳定' },
  { id: 'dande_sf', name: '蒲公英-顺丰国际', type: 'volume', desc: '速度快，体积计费，服务好' },
  { id: 'large', name: '大件路线', type: 'volume', desc: '超大体积专属，不限泡' },
];
