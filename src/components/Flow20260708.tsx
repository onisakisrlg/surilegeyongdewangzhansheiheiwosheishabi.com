import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, Check, Copy, Search, Filter, AlertTriangle, Package, Info, Edit2, Plus, X, Trash2, Minus } from 'lucide-react';
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

const NEW_BOX_MODELS = [
  { model: '我不知道，仓库决定', length: 0, width: 0, height: 0, weight: 0, volWeight: 0, sum: 0, price: 200, isDefault: true },
  { model: 'CL-NE-25', length: 15, width: 10, height: 3, weight: 35, volWeight: 0.08, sum: 28, price: 100 },
  { model: 'mini', length: 20, width: 15, height: 6, weight: 67, volWeight: 0.3, sum: 41, price: 100 },
  { model: '新K-50', length: 22, width: 16, height: 6, weight: 90, volWeight: 0.35, sum: 44, price: 100 },
  { model: 'NA4-H26', length: 32, width: 24, height: 3, weight: 100, volWeight: 0.38, sum: 59, price: 100 },
  { model: 'M50-1', length: 26, width: 21, height: 5, weight: 116, volWeight: 0.46, sum: 52, price: 100 },
  { model: '0.5印刷', length: 20, width: 15, height: 10, weight: 132, volWeight: 0.5, sum: 45, price: 100 },
  { model: 'MA60-272', length: 26, width: 18, height: 11, weight: 104, volWeight: 0.78, sum: 53, price: 100 },
  { model: '新MA80-1118', length: 33, width: 24, height: 6, weight: 176, volWeight: 0.79, sum: 63, price: 100 },
  { model: 'MA60-339', length: 20, width: 15, height: 16, weight: 110, volWeight: 0.8, sum: 51, price: 100 },
  { model: '新K-A460', length: 31, width: 22, height: 8, weight: 146, volWeight: 0.91, sum: 61, price: 100 },
  { model: 'S1', length: 25, width: 20, height: 12, weight: 206, volWeight: 1.0, sum: 57, price: 100 },
  { model: 'K-60', length: 27, width: 20, height: 12, weight: 120, volWeight: 1.08, sum: 59, price: 100 },
  { model: 'WE-1500', length: 45, width: 32, height: 6, weight: 282, volWeight: 1.44, sum: 83, price: 100 },
  { model: '新MA80-1222', length: 33, width: 24, height: 11, weight: 202, volWeight: 1.45, sum: 66, price: 100 },
  { model: '1.5印刷', length: 32, width: 21, height: 13, weight: 257, volWeight: 1.46, sum: 66, price: 100 },
  { model: 'K-80', length: 32, width: 23, height: 15, weight: 165, volWeight: 1.84, sum: 70, price: 100 },
  { model: 'A3-90', length: 47, width: 34, height: 7, weight: 320, volWeight: 1.86, sum: 88, price: 100 },
  { model: 'S-K100', length: 38, width: 18, height: 17, weight: 138, volWeight: 1.94, sum: 73, price: 100 },
  { model: '新S-K90', length: 40, width: 30, height: 10, weight: 275, volWeight: 2.0, sum: 80, price: 100 },
  { model: '2.5印刷', length: 38, width: 25, height: 15, weight: 362, volWeight: 2.38, sum: 78, price: 100 },
  { model: '新MA80-1446', length: 37, width: 26, height: 15, weight: 258, volWeight: 2.41, sum: 78, price: 100 },
  { model: '新K-100', length: 38, width: 27, height: 16, weight: 300, volWeight: 2.74, sum: 81, price: 100 },
  { model: '新WE-A3100', length: 45, width: 32, height: 12, weight: 338, volWeight: 2.88, sum: 89, price: 100 },
  { model: 'G3', length: 38, width: 27, height: 17, weight: 416, volWeight: 2.91, sum: 82, price: 100 },
  { model: '新K-A480', length: 32, width: 22, height: 25, weight: 256, volWeight: 2.93, sum: 79, price: 100 },
  { model: 'A2海报筒', length: 44, width: 6, height: 6, weight: 62, volWeight: 0.26, sum: 56, price: 150 },
  { model: 'B2海报筒', length: 54, width: 6, height: 6, weight: 74, volWeight: 0.32, sum: 66, price: 150 },
  { model: 'A1海报筒', length: 62, width: 6, height: 6, weight: 82, volWeight: 0.37, sum: 74, price: 150 },
  { model: 'B1海报筒', length: 75, width: 6, height: 6, weight: 100, volWeight: 0.45, sum: 87, price: 150 },
  { model: 'RKT-120', length: 75, width: 30, height: 7, weight: 347, volWeight: 2.63, sum: 112, price: 200 },
  { model: 'Q3', length: 75, width: 34, height: 8, weight: 546, volWeight: 3.4, sum: 117, price: 200 },
  { model: 'MA-1193', length: 47, width: 34, height: 15, weight: 376, volWeight: 4.0, sum: 96, price: 200 },
  { model: '新MK-100', length: 38, width: 27, height: 29, weight: 436, volWeight: 4.96, sum: 94, price: 200 },
  { model: 'A6', length: 50, width: 30, height: 24, weight: 646, volWeight: 8.0, sum: 104, price: 200 },
  { model: 'MA120-088', length: 50, width: 40, height: 20, weight: 584, volWeight: 6.67, sum: 110, price: 200 },
  { model: '新K-DA009', length: 47, width: 33, height: 30, weight: 594, volWeight: 7.76, sum: 110, price: 200 },
  { model: 'K-120', length: 45, width: 36, height: 37, weight: 712, volWeight: 9.99, sum: 118, price: 200 },
  { model: 'A4.5', length: 90, width: 20, height: 15, weight: 522, volWeight: 4.5, sum: 125, price: 300 },
  { model: 'C12', length: 50, width: 36, height: 40, weight: 970, volWeight: 12.0, sum: 126, price: 300 },
  { model: 'A12', length: 60, width: 40, height: 30, weight: 1030, volWeight: 12.0, sum: 130, price: 300 },
  { model: 'K-160', length: 64, width: 44, height: 45, weight: 1118, volWeight: 21.12, sum: 153, price: 300 },
  { model: '25', length: 55, width: 55, height: 49, weight: 1540, volWeight: 24.7, sum: 159, price: 300 },
  { model: '滑雪板专用箱', length: 178, width: 32, height: 10, weight: 1340, volWeight: 9.49, sum: 220, price: 400 },
  { model: '36.5', length: 75, width: 54, height: 54, weight: 1900, volWeight: 36.45, sum: 183, price: 400 },
  { model: '加厚海报筒', length: 60, width: 6, height: 6, weight: 92, volWeight: 0.36, sum: 72, price: 300 },
  { model: '加厚小', length: 28, width: 22, height: 11, weight: 222, volWeight: 1.13, sum: 61, price: 300 },
  { model: 'MA80-016(加厚)', length: 26, width: 24, height: 12, weight: 285, volWeight: 1.25, sum: 62, price: 300 },
  { model: 'MA80-049(加厚)', length: 35, width: 26, height: 13, weight: 347, volWeight: 1.97, sum: 74, price: 300 },
  { model: 'MA100-020(加厚)', length: 39, width: 27, height: 15, weight: 442, volWeight: 2.63, sum: 81, price: 300 },
  { model: '加厚大', length: 31, width: 34, height: 20, weight: 470, volWeight: 3.51, sum: 85, price: 300 },
  { model: '加厚MA160-085', length: 64, width: 44, height: 36, weight: 1380, volWeight: 16.9, sum: 144, price: 500 }
];

interface PackageAddon {
  id: string;
  category: string;
  name: string;
  price: number | '需确认';
  unit: string;
  target: string;
  instruction: string;
  tips: string;
  requireExtra?: boolean;
}

const PACKAGE_ADDONS: PackageAddon[] = [
  {
    id: 'reinforce_discount',
    category: '整箱/整包加固',
    name: '整箱加固折扣购（徽章立牌仅泡泡纸不超过50枚）',
    price: 1000,
    unit: '箱',
    target: '整个出库箱/包裹',
    instruction: '对整箱进行加固；徽章立牌仅泡泡纸且不超过50枚',
    tips: ''
  },
  {
    id: 'desiccant',
    category: '包材/耗材',
    name: '干燥剂55mm×33mm',
    price: 10,
    unit: '个',
    target: '整个包裹',
    instruction: '包裹内放入干燥剂',
    tips: ''
  }
];

export interface OrderAddon {
  id: string;
  category: string;
  name: string;
  price: number;
  unit: string;
  target: string;
  instruction: string;
  tips: string;
  scope: 'entire_order' | 'single_item';
}

export interface SelectedOrderAddon {
  addonId: string;
  qty: number;
  remark: string;
}

export const ORDER_ADDONS: OrderAddon[] = [
  // 商品加固
  {
    id: 'entire_order_reinforce',
    category: '商品加固',
    name: '整单商品加固（所有商品包一层泡泡纸）',
    price: 200,
    unit: '单',
    target: '整个订单/所有商品',
    instruction: '对订单内所有商品进行基础泡泡纸包覆加固',
    tips: '',
    scope: 'entire_order'
  },
  {
    id: 'green_bubble',
    category: '商品加固',
    name: '绿色气泡膜加固/单个商品',
    price: 300,
    unit: '件',
    target: '指定单个商品',
    instruction: '对指定商品使用绿色气泡膜加固',
    tips: '易碎品破损无法赔付，需风险确认',
    scope: 'single_item'
  },
  {
    id: 'discount_bubble_1',
    category: '商品加固',
    name: '折扣购加固1件【泡泡纸一层】',
    price: 100,
    unit: '件',
    target: '折扣购；需指定入库编号',
    instruction: '对指定商品包一层泡泡纸',
    tips: '需确认入库编号，否则加固错误不予赔偿',
    scope: 'single_item'
  },
  {
    id: 'fragile_discount_buy',
    category: '商品加固',
    name: '易碎品特殊加固【折扣购】',
    price: 200,
    unit: '件',
    target: '折扣购；按易碎商品数量购买',
    instruction: '对指定易碎商品做一次泡泡纸加固',
    tips: '易碎品粉、CD壳、饼干、玻璃陶瓷等无法理赔',
    scope: 'single_item'
  },
  {
    id: 'fragile_optimal_buy',
    category: '商品加固',
    name: '易碎品特殊加固【优购】',
    price: 100,
    unit: '件',
    target: '优购；按易碎商品数量购买',
    instruction: '对指定易碎商品包一层泡泡纸',
    tips: '易碎品粉、CD壳、饼干、玻璃陶瓷等无法理赔',
    scope: 'single_item'
  },
  {
    id: 'bubble_column_fragile',
    category: '商品加固',
    name: '长条气泡柱【特殊加固，易碎品】',
    price: 500,
    unit: '件',
    target: '指定易碎商品',
    instruction: '对指定易碎商品使用长条气泡柱保护',
    tips: '易碎品破损无法赔付，需风险确认',
    scope: 'single_item'
  },
  // 立牌/徽章/吧唧
  {
    id: 'standee_reinforce_discount',
    category: '立牌/徽章/吧唧',
    name: '立牌加固（折扣购）',
    price: 100,
    unit: '个',
    target: '折扣购；指定立牌',
    instruction: '对指定立牌加固',
    tips: '需和拆除包装一起购买',
    scope: 'single_item'
  },
  {
    id: 'badge_standee_discount_bubble',
    category: '立牌/徽章/吧唧',
    name: '吧唧（立牌）加固（折扣购仅泡泡纸）',
    price: 100,
    unit: '个',
    target: '折扣购；指定吧唧/立牌',
    instruction: '对指定吧唧/立牌包泡泡纸',
    tips: '仅泡泡纸',
    scope: 'single_item'
  },
  {
    id: 'standee_reinforce_cardboard',
    category: '立牌/徽章/吧唧',
    name: '立牌加固（纸板+泡泡纸）',
    price: 150,
    unit: '个',
    target: '指定立牌',
    instruction: '对指定立牌使用纸板+泡泡纸加固',
    tips: '',
    scope: 'single_item'
  },
  {
    id: 'badge_under_10',
    category: '立牌/徽章/吧唧',
    name: '10个徽章（立牌）以下（仅泡泡纸）',
    price: 200,
    unit: '箱',
    target: '指定徽章/立牌批次',
    instruction: '对10个以下徽章/立牌批次包泡泡纸',
    tips: '仅泡泡纸',
    scope: 'entire_order'
  },
  {
    id: 'badge_under_30',
    category: '立牌/徽章/吧唧',
    name: '30个以下徽章（立牌）加固',
    price: 500,
    unit: '单',
    target: '指定徽章/立牌批次',
    instruction: '对30个以下徽章/立牌批次加固',
    tips: '',
    scope: 'entire_order'
  },
  {
    id: 'badge_under_100',
    category: '立牌/徽章/吧唧',
    name: '立牌（徽章）加固x100枚以下',
    price: 2000,
    unit: '单',
    target: '指定徽章/立牌批次',
    instruction: '对100枚以下徽章/立牌批次加固',
    tips: '',
    scope: 'entire_order'
  },
  {
    id: 'badge_under_200',
    category: '立牌/徽章/吧唧',
    name: '立牌（徽章）加固x200枚以下',
    price: 3000,
    unit: '单',
    target: '指定徽章/立牌批次',
    instruction: '对200枚以下徽章/立牌批次加固',
    tips: '',
    scope: 'entire_order'
  },
  {
    id: 'badge_under_300',
    category: '立牌/徽章/吧唧',
    name: '立牌（徽章）加固x300枚以下',
    price: 4000,
    unit: '单',
    target: '指定徽章/立牌批次',
    instruction: '对300枚以下徽章/立牌批次加固',
    tips: '',
    scope: 'entire_order'
  },
  {
    id: 'itabag_all_badge_reinforce',
    category: '立牌/徽章/吧唧',
    name: '拆痛包+全部徽章加固（1个包）',
    price: 1500,
    unit: '个包',
    target: '指定痛包',
    instruction: '拆指定痛包，并对全部徽章加固',
    tips: '',
    scope: 'single_item'
  },
  // 纸片/卡片/吊牌
  {
    id: 'paper_under_k50',
    category: '纸片/卡片/吊牌',
    name: '折扣购K50以下纸片加固',
    price: 200,
    unit: '箱',
    target: '折扣购；指定纸片/卡片批次',
    instruction: '对K50以下纸片进行加固',
    tips: '',
    scope: 'entire_order'
  },
  {
    id: 'card_under_10',
    category: '纸片/卡片/吊牌',
    name: '折扣购卡片加固10张以下',
    price: 200,
    unit: '单',
    target: '折扣购；指定卡片批次',
    instruction: '对10张以下卡片加固',
    tips: '',
    scope: 'entire_order'
  },
  {
    id: 'tag_cardboard',
    category: '纸片/卡片/吊牌',
    name: '吊牌需要夹硬纸板',
    price: 100,
    unit: '个',
    target: '指定吊牌',
    instruction: '对指定吊牌夹硬纸板',
    tips: '',
    scope: 'single_item'
  },
  // 卡盒
  {
    id: 'small_card_box_keep',
    category: '卡盒',
    name: '小卡盒内寸9*6*2.5cm（不拆硬纸板）',
    price: 200,
    unit: '个',
    target: '指定卡片/小卡商品',
    instruction: '使用小卡盒，不拆硬纸板',
    tips: '',
    scope: 'single_item'
  },
  {
    id: 'small_card_box_remove',
    category: '卡盒',
    name: '卡盒小号内寸9*6*2.5cm（含拆卡）',
    price: 500,
    unit: '个',
    target: '指定卡片/小卡商品',
    instruction: '拆卡后放入小号卡盒',
    tips: '与“新品未开封，别拆”冲突',
    scope: 'single_item'
  },
  {
    id: 'mid_card_box_keep',
    category: '卡盒',
    name: '中卡盒内寸15*11*3cm（不拆硬纸板）',
    price: 300,
    unit: '个',
    target: '指定卡片商品',
    instruction: '使用中卡盒，不拆硬纸板',
    tips: '',
    scope: 'single_item'
  },
  {
    id: 'mid_card_box_remove',
    category: '卡盒',
    name: '卡盒中号内寸15*11*3cm（含拆卡）',
    price: 800,
    unit: '个',
    target: '指定卡片商品',
    instruction: '拆卡后放入中号卡盒',
    tips: '与“新品未开封，别拆”冲突',
    scope: 'single_item'
  },
  {
    id: 'large_card_box_keep',
    category: '卡盒',
    name: '大卡盒内寸19*9.5*6cm（不拆硬纸板）',
    price: 400,
    unit: '个',
    target: '指定卡片商品',
    instruction: '使用大卡盒，不拆硬纸板',
    tips: '',
    scope: 'single_item'
  },
  {
    id: 'large_card_box_remove',
    category: '卡盒',
    name: '卡盒大号内寸19*9.5*6cm（含拆卡）',
    price: 1400,
    unit: '个',
    target: '指定卡片商品',
    instruction: '拆卡后放入大号卡盒',
    tips: '与“新品未开封，别拆”冲突',
    scope: 'single_item'
  },
  // 拆包/称重/返图
  {
    id: 'remove_pack_weigh_photo',
    category: '拆包/称重/返图',
    name: '去原包装称重返图',
    price: 100,
    unit: '件',
    target: '指定商品',
    instruction: '去除指定商品原包装，称重并返图',
    tips: '与“新品未开封，别拆”冲突',
    scope: 'single_item'
  },
  // 丢弃/取出/留仓
  {
    id: 'remove_cardboard',
    category: '丢弃/取出/留仓',
    name: '去纸板（运损不赔）',
    price: 50,
    unit: '个',
    target: '指定商品/指定纸板',
    instruction: '去除指定商品纸板',
    tips: '运损不赔，需风险确认；与纸板加固冲突',
    scope: 'single_item'
  },
  {
    id: 'simple_discard_1_2',
    category: '丢弃/取出/留仓',
    name: '简单丢弃（1-2件）',
    price: 300,
    unit: '单',
    target: '指定1-2件商品',
    instruction: '丢弃指定1-2件商品',
    tips: '折扣购需联系客服先确认商品图，否则丢错不予赔偿',
    scope: 'single_item'
  },
  {
    id: 'complex_discard',
    category: '丢弃/取出/留仓',
    name: '复杂丢弃',
    price: 500,
    unit: '单',
    target: '指定复杂丢弃商品',
    instruction: '按指定要求做复杂丢弃',
    tips: '丢弃重量超500g，每500g加收200日元',
    scope: 'single_item'
  },
  {
    id: 'overweight_discard_fee',
    category: '丢弃/取出/留仓',
    name: '按重量收取额外的丢弃费用',
    price: 200,
    unit: '每500g',
    target: '超重丢弃商品',
    instruction: '对已购买丢弃服务的商品按重量追加费用',
    tips: '需先购买丢弃服务',
    scope: 'entire_order'
  },
  {
    id: 'specify_remove_1',
    category: '丢弃/取出/留仓',
    name: '指定取出1件商品',
    price: 200,
    unit: '单',
    target: '指定商品',
    instruction: '从包裹中取出指定1件商品',
    tips: '必须选择具体商品',
    scope: 'single_item'
  },
  {
    id: 'warehouse_over_free_qty',
    category: '丢弃/取出/留仓',
    name: '需留仓库商品超出免费取出1-2单数量',
    price: 100,
    unit: '件',
    target: '指定留仓商品',
    instruction: '将指定商品取出并留仓',
    tips: '超过免费取出数量时收费',
    scope: 'single_item'
  },
  {
    id: 'split_set_recombine',
    category: '丢弃/取出/留仓',
    name: '拆分SET重新合并入库/合并打包',
    price: 200,
    unit: '个',
    target: '指定SET商品',
    instruction: '拆分SET后按要求重新合并入库或合并打包',
    tips: '适用于寄一半留一半；库内需有其他商品',
    scope: 'single_item'
  },
  {
    id: 'iron_discard',
    category: '丢弃/取出/留仓',
    name: '铁制品（铁盒子，铁块）丢弃',
    price: 500,
    unit: '单',
    target: '指定铁制品',
    instruction: '丢弃指定铁制品',
    tips: '',
    scope: 'single_item'
  },
  {
    id: 'hazard_discard',
    category: '丢弃/取出/留仓',
    name: '危险物品丢弃处理费用',
    price: 1000,
    unit: '单',
    target: '指定危险物品',
    instruction: '丢弃气罐/巨型电池/打火机等危险物品',
    tips: '易燃易爆风险，需风险确认',
    scope: 'single_item'
  },
  {
    id: 'large_garbage_fee',
    category: '丢弃/取出/留仓',
    name: '大型垃圾处理费用',
    price: 500,
    unit: '件',
    target: '指定大型商品/垃圾',
    instruction: '处理三边和超过100cm的大型垃圾',
    tips: '长宽高三边总和超过100cm',
    scope: 'single_item'
  },
  // 电池/电子产品
  {
    id: 'check_battery_discount',
    category: '电池/电子产品',
    name: '折扣购检查电池内置（或取出）',
    price: 100,
    unit: '件',
    target: '折扣购；指定数码/电子商品',
    instruction: '检查并内置或取出指定商品电池',
    tips: '与“新品未开封，别拆”冲突',
    scope: 'single_item'
  },
  {
    id: 'battery_action_electronic',
    category: '电池/电子产品',
    name: '电子产品拆下或安装电池',
    price: 100,
    unit: '件',
    target: '指定电子产品',
    instruction: '对指定电子产品拆下或安装电池',
    tips: '与“新品未开封，别拆”冲突',
    scope: 'single_item'
  },
  // 商品套袋
  {
    id: 'bagging_discount_a4_a5',
    category: '商品套袋',
    name: '折扣购商品套袋(A4-A5)服务',
    price: 100,
    unit: '单',
    target: '折扣购；指定商品或订单内商品',
    instruction: '对指定商品进行A4-A5套袋',
    tips: '',
    scope: 'entire_order'
  }
];

export function Flow20260708() {
  const [appStep, setAppStep] = useState<'list' | 'form'>('list');
  const [selectedPackageOrders, setSelectedPackageOrders] = useState<string[]>([]);
  const [selectedPackageAddons, setSelectedPackageAddons] = useState<Record<string, any>>({});
  const [orderSplitConfig, setOrderSplitConfig] = useState<Record<string, { splitCount: number; remark: string }>>({});
  const [showSplitModal, setShowSplitModal] = useState<string | null>(null);
  
  const [logisticsIntent, setLogisticsIntent] = useState<string>('pg_route');
  const [specificRoute, setSpecificRoute] = useState<string>('pg_sf');
  
  const [boxOption, setBoxOption] = useState<string>('free_box');
  const [selectedCustomBoxModel, setSelectedCustomBoxModel] = useState<string>('我不知道，仓库决定');
  const [boxSearchQuery, setBoxSearchQuery] = useState<string>('');
  const [isBoxDropdownOpen, setIsBoxDropdownOpen] = useState<boolean>(false);
  
  const [weightControlOption, setWeightControlOption] = useState<string>('no_control');
  const [specifiedRemoveOrder, setSpecifiedRemoveOrder] = useState<string | null>(null);
  const [showOrderSelectModal, setShowOrderSelectModal] = useState<boolean>(false);
  const [packagingOption, setPackagingOption] = useState<string>('remove_shipping');
  const [valueAddedServices, setValueAddedServices] = useState<string[]>([]);
  
  const [orderServices, setOrderServices] = useState<Record<string, SelectedOrderAddon[]>>({});
  const [showOrderServiceModal, setShowOrderServiceModal] = useState<string | null>(null);
  const [activeModalCategory, setActiveModalCategory] = useState<string>('商品加固');
  const [tempOrderAddons, setTempOrderAddons] = useState<SelectedOrderAddon[]>([]);
  
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
    setTempOrderAddons(orderServices[orderId] || []);
    setActiveModalCategory('商品加固');
    setShowOrderServiceModal(orderId);
  };

  const togglePackageAddon = (addon: any) => {
    setSelectedPackageAddons(prev => {
      if (prev[addon.id]) {
        const next = { ...prev };
        delete next[addon.id];
        return next;
      } else {
        return {
          ...prev,
          [addon.id]: {
            id: addon.id,
            name: addon.name,
            category: addon.category,
            price: addon.price,
            unit: addon.unit,
            instruction: addon.instruction,
            tips: addon.tips || '',
            qty: 1,
            boxCount: addon.requireExtra ? 1 : undefined,
            boxType: addon.requireExtra ? '我不知道，仓库决定' : undefined,
            requirement: addon.requireExtra ? '' : undefined
          }
        };
      }
    });
  };

  const updatePackageAddonField = (addonId: string, field: string, value: any) => {
    setSelectedPackageAddons(prev => {
      if (!prev[addonId]) return prev;
      return {
        ...prev,
        [addonId]: {
          ...prev[addonId],
          [field]: value
        }
      };
    });
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
                    {boxOption === 'new_box' ? `付费新箱 (${selectedCustomBoxModel})` : BOX_OPTIONS.find(o => o.id === boxOption)?.title}
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
              <div className="w-32 text-[13px] font-bold text-gray-600 shrink-0 mt-1">包裹级附加项 & 要求</div>
              <div className="flex-1 space-y-2">
                <div className="text-[13px] text-gray-900">
                  <span className="font-bold">拆包要求:</span> {packagingOption === 'keep_all' ? '保留所有包装' : packagingOption === 'remove_shipping' ? '仅拆除快递箱 (推荐)' : '拆除所有外包装'}
                </div>
                
                {Object.keys(selectedPackageAddons).length > 0 ? (
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-200 space-y-2">
                    <div className="text-[12px] font-bold text-[#d1586e] flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" /> 包裹级附加项执行指令单：
                    </div>
                    {(Object.values(selectedPackageAddons) as any[]).map(addon => {
                      const isSplit = addon.id === 'complex_split' || addon.id.includes('split');
                      const isCustomBox = addon.category === '包装箱' || addon.category.includes('箱型');
                      const qtyToDisplay = addon.id === 'complex_split' ? (addon.boxCount || 1) : addon.qty;
                      return (
                        <div key={addon.id} className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-lg text-[12px] text-rose-950">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-[13px] text-gray-900">{addon.name}</span>
                            <span className="font-mono font-bold text-[#d1586e] shrink-0 ml-2">
                              {addon.price === '需确认' ? '价格待确认' : `${addon.price}円 × ${qtyToDisplay}${addon.unit}`}
                            </span>
                          </div>
                          <div className="text-gray-500 text-[11px] mt-1">
                            <span className="font-semibold text-gray-700">后台执行指令:</span> {addon.instruction}
                          </div>
                          {addon.tips && (
                            <div className="text-amber-700 text-[11px] mt-0.5">
                              <span className="font-semibold">前置/风险:</span> {addon.tips}
                            </div>
                          )}
                          
                          {/* Split/Custom box details as requested */}
                          {(addon.id === 'complex_split' || isCustomBox) && (
                            <div className="mt-2 p-2 bg-white border border-rose-100 rounded space-y-1 text-[11px] text-gray-800">
                              <div className="font-bold text-[11px] text-rose-800 pb-1 border-b border-rose-50 flex justify-between">
                                <span>分箱/箱型操作明细:</span>
                                <span>单价: {addon.price === '需确认' ? '待定' : `${addon.price}円`}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">操作箱数:</span> <span className="font-mono font-bold text-gray-950">{addon.id === 'complex_split' ? addon.boxCount : addon.qty} 箱</span>
                              </div>
                              {addon.boxType && (
                                <div>
                                  <span className="text-gray-500">指定箱型:</span> <span className="font-bold text-gray-950">{addon.boxType}</span>
                                </div>
                              )}
                              {addon.requirement && (
                                <div>
                                  <span className="text-gray-500">操作要求:</span> <span className="text-blue-900 font-medium bg-blue-50/50 px-1 py-0.5 rounded">"{addon.requirement}"</span>
                                </div>
                              )}
                              <div>
                                <span className="text-gray-500">预估费用:</span> <span className="font-bold text-rose-600">{addon.price === '需确认' ? '仓库实收' : `${(typeof addon.price === 'number' ? addon.price : 0) * (addon.id === 'complex_split' ? (addon.boxCount || 1) : addon.qty)} 円`}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-[12px] text-gray-400 italic mt-1">无增值附加服务</div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100" />

            {/* 单订单拆分指令 (针对单个包裹订单拆分) */}
            {(() => {
              const splitOrders = selectedPackageOrders.filter(id => orderSplitConfig[id]);
              if (splitOrders.length === 0) return null;

              return (
                <>
                  <div className="flex gap-4 items-start">
                    <div className="w-32 text-[13px] font-bold text-gray-600 shrink-0 mt-1">
                      单订单拆分执行单
                    </div>
                    <div className="flex-1 space-y-3">
                      {splitOrders.map(orderId => {
                        const orderObj = MOCK_PACKAGE_ORDERS.find(o => o.id === orderId);
                        const config = orderSplitConfig[orderId];
                        return (
                          <div key={orderId} className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 space-y-3 text-[13px] text-amber-950 shadow-sm">
                            <div className="flex items-center gap-2 border-b border-amber-200/50 pb-2">
                              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="font-bold text-[14px] text-amber-900">
                                ⚠️ 仓库执行动作：单订单拆分拣货指令
                              </span>
                            </div>

                            <div className="space-y-1 text-gray-800">
                              <div>
                                <span className="font-semibold text-gray-500">被拆分包裹:</span> <span className="font-medium text-gray-900">{orderObj?.title} ({orderId})</span>
                              </div>
                              <div>
                                <span className="font-semibold text-gray-500">要求拆分数:</span> <span className="font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[12px]">
                                  拆分为 {config.splitCount} 个独立的 LO 出库订单
                                </span>
                              </div>
                              <div className="mt-2.5">
                                <span className="font-bold text-gray-900 block border-l-2 border-amber-500 pl-1.5 mb-1 text-[12px]">
                                  📢 客户同步操作备注 (此要求同步影响这 {config.splitCount} 个分箱 LO 子单)：
                                </span>
                                <div className="bg-white border border-amber-200 p-2.5 rounded-lg text-gray-900 font-bold font-mono text-[13px] italic shadow-inner">
                                  💬 "{config.remark || '左上角的徽章'}"
                                </div>
                              </div>
                            </div>

                            <div className="bg-white/60 p-2.5 rounded border border-amber-100 text-[11px] text-gray-500 leading-relaxed">
                              <span className="font-bold text-gray-700 block mb-0.5">💡 仓库打包指引：</span>
                              该入库单已申请分箱拆发。系统将自动生成 <b>{config.splitCount} 个 LO 出库标签</b>。
                              由于此备注同时影响这 {config.splitCount} 个 LO 子单，打包人员需将 <b>"{config.remark || '左上角的徽章'}"</b> 的指示对每一个拆分出的 LO 件进行对应核对或配套加固操作。
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="h-px bg-gray-100" />
                </>
              );
            })()}

            {/* 商品级单独附加指令 (针对具体入库编号) */}
            <div className="flex gap-4 items-start">
              <div className="w-32 text-[13px] font-bold text-gray-600 shrink-0 mt-1">商品级单独附加指令</div>
              <div className="flex-1 space-y-3">
                {(() => {
                  const ordersWithServices = selectedPackageOrders.filter(id => orderServices[id] && orderServices[id].length > 0);
                  
                  if (ordersWithServices.length === 0) {
                    return <div className="text-[12px] text-gray-400 italic">无商品单独附加指令 (所有商品原包装合并打包)</div>;
                  }

                  return (
                    <div className="space-y-3">
                      {ordersWithServices.map(orderId => {
                        const orderObj = MOCK_PACKAGE_ORDERS.find(o => o.id === orderId);
                        const services = orderServices[orderId] || [];

                        return (
                          <div key={orderId} className="bg-blue-50/40 border border-blue-100 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2 border-b border-blue-100/50 pb-1.5">
                              <Package className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="font-bold text-[13px] text-gray-900 font-mono">
                                入库单号: {orderId}
                              </span>
                              <span className="text-[11px] text-gray-500 truncate max-w-[200px]">
                                ({orderObj?.title})
                              </span>
                            </div>
                            
                            <div className="space-y-2">
                              {services.map(srv => {
                                const addon = ORDER_ADDONS.find(a => a.id === srv.addonId);
                                if (!addon) return null;

                                return (
                                  <div key={srv.addonId} className="bg-white border border-gray-100 rounded p-2 text-[12px] text-gray-800 shadow-sm">
                                    <div className="flex justify-between items-start font-bold">
                                      <span className="text-blue-900 text-[12px]">
                                        👉 【{addon.category}】{addon.name}
                                      </span>
                                      <span className="text-gray-900 shrink-0 font-mono font-bold ml-2">
                                        × {srv.qty} {addon.unit}
                                      </span>
                                    </div>
                                    <div className="mt-1 text-gray-500 text-[11px] leading-relaxed">
                                      <span className="font-semibold text-gray-700">打包操作:</span> 对商品【{orderObj?.title}】进行{addon.instruction}。
                                    </div>
                                    {srv.remark && (
                                      <div className="mt-1 bg-amber-50 text-amber-900 border border-amber-100 p-1.5 rounded text-[11px] font-medium leading-normal">
                                        💬 客户备注要求: "{srv.remark}"
                                      </div>
                                    )}
                                    {addon.tips && (
                                      <div className="text-amber-600 text-[10px] mt-0.5 font-medium">
                                        ⚠️ 注意/风险: {addon.tips}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
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
                          <div className="flex items-center justify-between mt-0.5 gap-1.5">
                            <span className="text-[14px] text-[#d1586e] font-bold shrink-0">{order.price} 円</span>
                            {isSelected && (
                              <div className="flex gap-1">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openOrderServiceModal(order.id);
                                  }}
                                  className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 active:bg-blue-100 transition-colors shrink-0"
                                >
                                  {orderServices[order.id] && orderServices[order.id].length > 0 ? (
                                    <>
                                      <Edit2 className="w-2.5 h-2.5" />
                                      附加项 ({orderServices[order.id].length})
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-2.5 h-2.5" />
                                      附加项
                                    </>
                                  )}
                                </button>
                                
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedPackageOrders.length === 1) {
                                      setShowSplitModal(order.id);
                                    }
                                  }}
                                  disabled={selectedPackageOrders.length > 1}
                                  className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all shrink-0 ${
                                    selectedPackageOrders.length === 1 
                                      ? 'text-amber-700 bg-amber-50 border-amber-200 active:bg-amber-100' 
                                      : 'text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed'
                                  }`}
                                  title={selectedPackageOrders.length > 1 ? "仅支持单订单拆分" : "配置拆分需求"}
                                >
                                  <AlertTriangle className="w-2.5 h-2.5 text-amber-500" />
                                  {orderSplitConfig[order.id] ? '已设拆分' : '拆分订单'}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Split order configuration visualization */}
                          {isSelected && orderSplitConfig[order.id] && (
                            <div className="mt-1.5 bg-amber-50 border border-amber-200 p-2 rounded-lg text-[11px] text-amber-900 space-y-1">
                              <div className="flex items-center justify-between font-bold text-amber-800 text-[10px] pb-1 border-b border-amber-200/40">
                                <span className="flex items-center gap-1">
                                  <Package className="w-3 h-3 text-amber-600" />
                                  已设定拆分为 {orderSplitConfig[order.id].splitCount} 个出库子单
                                </span>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOrderSplitConfig(prev => {
                                      const next = { ...prev };
                                      delete next[order.id];
                                      return next;
                                    });
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:underline text-[9px]"
                                >
                                  撤销
                                </button>
                              </div>
                              <div className="text-[10px] text-gray-700 leading-normal">
                                <span className="font-semibold text-gray-500">同步备注:</span> <span className="text-gray-900 font-medium">"{orderSplitConfig[order.id].remark || '左上角的徽章'}"</span>
                              </div>
                              
                              {/* Visual Sub-LO packages */}
                              <div className="pt-1 grid grid-cols-1 gap-1">
                                {Array.from({ length: orderSplitConfig[order.id].splitCount }).map((_, sIdx) => (
                                  <div key={sIdx} className="flex justify-between items-center text-[9px] text-gray-500 bg-white/60 px-1.5 py-0.5 rounded border border-amber-100/30">
                                    <span className="font-mono text-gray-600">📦 LO-{order.id}-S{sIdx+1}</span>
                                    <span className="text-amber-800 font-medium truncate max-w-[110px] italic">📝 同步备注</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {isSelected && orderServices[order.id] && orderServices[order.id].length > 0 && (
                            <div className="mt-1.5 bg-blue-50/30 border border-blue-100 p-2 rounded-lg text-[11px] text-blue-900 space-y-1">
                              <div className="font-bold border-b border-blue-100/50 pb-1 mb-1 text-[10px] text-blue-800">已选商品级附加项:</div>
                              {orderServices[order.id].map(srv => {
                                const addon = ORDER_ADDONS.find(a => a.id === srv.addonId);
                                if (!addon) return null;
                                return (
                                  <div key={srv.addonId} className="flex justify-between items-start leading-snug">
                                    <div className="min-w-0">
                                      <span className="font-semibold">• {addon.name}</span>
                                      <span className="text-gray-500 ml-1">x{srv.qty}{addon.unit}</span>
                                      {srv.remark && (
                                        <span className="text-blue-700 text-[10px] block pl-2 mt-0.5">备注: {srv.remark}</span>
                                      )}
                                    </div>
                                    <span className="font-mono font-medium shrink-0 text-blue-700">+{addon.price * srv.qty}円</span>
                                  </div>
                                );
                              })}
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
            
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 pb-safe shadow-lg">
              {/* Split selection status warning/info panel */}
              <div className="px-4 py-1.5 flex items-center justify-between text-[11px] bg-amber-50 text-amber-800 border-b border-amber-100/50">
                {selectedPackageOrders.length === 1 ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-green-600" /> 
                    已选 1 个包裹，可进行<b>单订单拆分</b>操作
                  </span>
                ) : selectedPackageOrders.length > 1 ? (
                  <span className="flex items-center gap-1 text-red-600 font-medium">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" /> 
                    已选 {selectedPackageOrders.length} 个包裹。<b>多选状态下暂不支持拆分。</b>
                  </span>
                ) : (
                  <span className="text-gray-400">请勾选需要处理的包裹订单</span>
                )}
              </div>

              <div className="px-4 py-2 flex items-center justify-between">
                <span className="text-[13px] font-medium text-gray-800">已选总金额: <span className="font-mono">{selectedTotalAmount}</span> 円</span>
                <span className="text-[13px] font-medium text-gray-800">已选总重: <span className="font-mono">{selectedTotalWeight}</span>克</span>
              </div>
              <div className="px-4 py-2.5 flex items-center justify-between gap-2">
                <button 
                  onClick={() => setSelectedPackageOrders([])}
                  className="px-3.5 py-2 rounded-full border border-gray-300 text-gray-600 text-[13px] font-medium active:bg-blue-50 transition-colors"
                >取消</button>
                
                <div className="flex gap-1.5 flex-1 justify-end">
                  {/* Split Button */}
                  <button 
                    onClick={() => {
                      if (selectedPackageOrders.length === 1) {
                        setShowSplitModal(selectedPackageOrders[0]);
                      }
                    }}
                    disabled={selectedPackageOrders.length !== 1}
                    className={`px-3 py-2 rounded-full text-[13px] font-bold flex items-center gap-1 transition-all ${
                      selectedPackageOrders.length === 1 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200 active:bg-amber-100' 
                        : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed opacity-50'
                    }`}
                    title={selectedPackageOrders.length > 1 ? "仅支持单订单拆分" : "配置拆分要求"}
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-600" />
                    拆分
                  </button>

                  <button 
                    onClick={() => setAppStep('form')}
                    disabled={selectedPackageOrders.length === 0}
                    className={`w-20 py-2 rounded-full text-[13px] font-bold transition-transform ${selectedPackageOrders.length > 0 ? 'bg-[#ffd200] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >直邮</button>
                  <button 
                    disabled={selectedPackageOrders.length === 0}
                    className={`w-20 py-2 rounded-full text-[13px] font-bold transition-transform ${selectedPackageOrders.length > 0 ? 'bg-[#ffd200] text-gray-900 active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                  >拼邮</button>
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
                          const selectedCustomBoxInfo = NEW_BOX_MODELS.find(m => m.model === selectedCustomBoxModel) || NEW_BOX_MODELS[0];
                          const displayPrice = opt.id === 'new_box' ? selectedCustomBoxInfo.price : opt.price;
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
                              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-5/30' : 'border-gray-100 hover:border-blue-200'}`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-4 h-4 mt-0.5 rounded-full border-2 shrink-0 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                                  {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between items-start">
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
                                            若无可用原箱或不符合标准，将改用<span className="font-bold">免费旧箱</span>；若无旧箱则使用<span className="font-bold">付费新箱 (价格待定/按实收)</span>。
                                          </div>
                                        </div>
                                      )}
                                      {opt.id === 'free_box' && (
                                        <div className="mt-2 p-2 bg-amber-50/80 rounded text-[11px] text-amber-700 flex gap-1.5 items-start border border-amber-100">
                                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                          <div className="leading-relaxed">
                                            若无匹配尺寸的旧箱，将改用<span className="font-bold">付费新箱 (价格待定/按实收)</span>。
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-[13px] font-bold text-rose-500 shrink-0">
                                      {opt.id === 'new_box' && selectedCustomBoxModel === '我不知道，仓库决定' ? (
                                        '价格待定'
                                      ) : displayPrice > 0 ? (
                                        `${displayPrice} 円`
                                      ) : (
                                        '免费'
                                      )}
                                    </div>
                                  </div>

                                  {/* Custom New Box Selector under '付费新箱' */}
                                  {isSelected && opt.id === 'new_box' && (
                                    <div className="mt-3 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                                      <div className="text-[12px] font-bold text-gray-700 mb-1.5 flex items-center justify-between">
                                        <span>指定新箱型号 (可选):</span>
                                        <span className="text-blue-600 font-mono text-[11px] bg-blue-50 px-1.5 py-0.5 rounded font-bold">
                                          {selectedCustomBoxModel}
                                        </span>
                                      </div>
                                      
                                      <div className="relative">
                                        <div 
                                          onClick={() => setIsBoxDropdownOpen(!isBoxDropdownOpen)}
                                          className="w-full flex items-center justify-between p-2 text-[13px] border border-gray-200 rounded-lg bg-white cursor-pointer hover:border-blue-300 transition-colors"
                                        >
                                          <span className="text-gray-800 font-medium truncate">
                                            {selectedCustomBoxModel === '我不知道，仓库决定' ? '我不知道，仓库决定' : `${selectedCustomBoxModel} (三边和: ${selectedCustomBoxInfo.sum}cm, 重: ${selectedCustomBoxInfo.weight}g)`}
                                          </span>
                                          <span className="text-blue-500 text-[11px] font-medium shrink-0 ml-1">切换/搜索 ▾</span>
                                        </div>

                                        {isBoxDropdownOpen && (
                                          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-40 flex flex-col max-h-60 overflow-hidden">
                                            <div className="p-2 border-b border-gray-100 bg-gray-50">
                                              <input 
                                                type="text"
                                                value={boxSearchQuery}
                                                onChange={(e) => setBoxSearchQuery(e.target.value)}
                                                placeholder="输入型号搜索 (如 mini, 新K, 120)..."
                                                className="w-full p-1.5 text-[12px] border border-gray-200 rounded-md outline-none focus:border-blue-500 bg-white"
                                              />
                                            </div>
                                            
                                            <div className="overflow-y-auto divide-y divide-gray-50 flex-1">
                                              {NEW_BOX_MODELS.filter(m => 
                                                m.model.toLowerCase().includes(boxSearchQuery.toLowerCase())
                                              ).map(m => {
                                                const isCurrent = selectedCustomBoxModel === m.model;
                                                return (
                                                  <div
                                                    key={m.model}
                                                    onClick={() => {
                                                      setSelectedCustomBoxModel(m.model);
                                                      setIsBoxDropdownOpen(false);
                                                      setBoxSearchQuery('');
                                                    }}
                                                    className={`p-2.5 hover:bg-blue-50 cursor-pointer flex flex-col text-left transition-colors ${isCurrent ? 'bg-blue-50' : ''}`}
                                                  >
                                                    <div className="flex justify-between items-center">
                                                      <span className={`text-[12px] font-bold ${isCurrent ? 'text-blue-600' : 'text-gray-800'}`}>
                                                        {m.model}
                                                      </span>
                                                      <span className="text-[12px] font-bold text-rose-500">
                                                        {m.model === '我不知道，仓库决定' ? '价格待定' : `${m.price} 円`}
                                                      </span>
                                                    </div>
                                                    {m.length > 0 && (
                                                      <div className="text-[10px] text-gray-500 mt-1 flex flex-wrap gap-x-2 gap-y-0.5">
                                                        <span>尺寸: {m.length}×{m.width}×{m.height} cm</span>
                                                        <span>三边和: {m.sum}cm</span>
                                                        <span>重量: {m.weight}g</span>
                                                        <span>体积重: {m.volWeight}kg</span>
                                                      </div>
                                                    )}
                                                  </div>
                                                );
                                              })}
                                              {NEW_BOX_MODELS.filter(m => 
                                                m.model.toLowerCase().includes(boxSearchQuery.toLowerCase())
                                              ).length === 0 && (
                                                <div className="p-3 text-center text-gray-400 text-[12px]">未找到匹配的箱子</div>
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>

                                      {selectedCustomBoxModel !== '我不知道，仓库决定' ? (
                                        <div className="space-y-2">
                                          <div className="mt-2.5 p-2 bg-blue-50/50 border border-blue-100 rounded-lg text-[11px] text-blue-900 grid grid-cols-2 gap-x-3 gap-y-1">
                                            <div><span className="text-gray-500">外径尺寸:</span> <span className="font-mono font-medium">{selectedCustomBoxInfo.length}×{selectedCustomBoxInfo.width}×{selectedCustomBoxInfo.height} cm</span></div>
                                            <div><span className="text-gray-500">三边之和:</span> <span className="font-mono font-medium">{selectedCustomBoxInfo.sum} cm</span></div>
                                            <div><span className="text-gray-500">纸箱自重:</span> <span className="font-mono font-medium">{selectedCustomBoxInfo.weight} g</span></div>
                                            <div><span className="text-gray-500">体积重量:</span> <span className="font-mono font-medium">{selectedCustomBoxInfo.volWeight} kg</span></div>
                                          </div>
                                          
                                          <div className="p-2 bg-amber-50/80 rounded text-[11px] text-amber-700 flex gap-1.5 items-start border border-amber-100">
                                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                            <div className="leading-relaxed">
                                              <span className="font-bold">意向预估说明：</span>此价格（{selectedCustomBoxInfo.price}円）为基于您指定型号的预估费用。实际打包时，若商品无法装下或不适用，仓库将改用合适的型号并按实际价格计费（例如：即便您指定了100円的箱子，若实际最终使用了500円的箱子，也将按照500円收取）。
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="mt-2.5 p-2 bg-amber-50/80 rounded text-[11px] text-amber-700 flex gap-1.5 items-start border border-amber-100">
                                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                          <div className="leading-relaxed">
                                            <span className="font-bold">仓库决定计费：</span>由于您未指定型号，仓库打包人员将根据您合单后的总体积和重量为您匹配最优的新箱。最终费用以实际使用的纸箱型号价格为准（100円 - 500円不等），在此仅作意向收集，当前状态下价格待定。
                                          </div>
                                        </div>
                                      )}
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
                        {boxOption === 'new_box' ? (
                          <span>付费新箱 (型号: {selectedCustomBoxModel})</span>
                        ) : (
                          BOX_OPTIONS.find(o => o.id === boxOption)?.title
                        )}
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

              {/* Step 4: 包裹级附加服务与拆包 */}
              {formActiveStep >= 4 && (
                <div ref={step4Ref} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${formActiveStep === 4 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-bold ${formActiveStep > 4 ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                        {formActiveStep > 4 ? <Check className="w-3 h-3" strokeWidth={3} /> : '4'}
                      </span>
                      <h2 className="font-bold text-[14px] text-gray-800">包裹附加项 & 拆包</h2>
                    </div>
                    {formActiveStep > 4 && (
                      <button onClick={() => setFormActiveStep(4)} className="text-blue-500 text-[12px] flex items-center gap-1 hover:underline">
                        <Edit2 className="w-3 h-3" /> 修改
                      </button>
                    )}
                  </div>
                  
                  {formActiveStep === 4 ? (
                    <div className="p-3 space-y-4">
                      {/* Sub-section 1: 基础拆包要求 */}
                      <div className="space-y-2">
                        <div className="text-[12px] font-bold text-gray-700 flex items-center gap-1">
                          <span className="w-1 h-3.5 bg-blue-500 rounded-full inline-block"></span>
                          基础拆包规则 (必选)：
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                          {[
                            { id: 'keep_all', title: '保留所有包装', label: '原样保留' },
                            { id: 'remove_shipping', title: '仅拆除快递箱', label: '拆快递外箱' },
                            { id: 'remove_all', title: '拆除所有外包装', label: '拆除所有箱/盒' }
                          ].map(opt => {
                            const isSelected = packagingOption === opt.id;
                            return (
                              <div 
                                key={opt.id}
                                onClick={() => setPackagingOption(opt.id)}
                                className={`p-2 rounded border text-center cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'border-gray-200 bg-white text-gray-600'}`}
                              >
                                <div className="text-[11px] leading-tight">{opt.label}</div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded leading-relaxed border border-gray-100">
                          {packagingOption === 'keep_all' && '说明：保留商家发货的快递箱和原包装，原箱直接打包合箱。'}
                          {packagingOption === 'remove_shipping' && '说明：推荐。仅拆除商家的外层粗糙发货纸箱，内部商品包装（鞋盒、手办盒）均保留。'}
                          {packagingOption === 'remove_all' && '说明：拆除一切快递纸箱与商品盒子（丢弃原装鞋盒、手办原装卡纸包装等），仅留原封塑料袋，压缩率最高。'}
                        </div>
                      </div>

                      {/* Sub-section 2: 针对整个包裹的附加服务 */}
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="text-[12px] font-bold text-gray-700 flex items-center gap-1 justify-between">
                          <div className="flex items-center gap-1">
                            <span className="w-1 h-3.5 bg-blue-500 rounded-full inline-block"></span>
                            包裹附加服务列表 (可选)：
                          </div>
                          <span className="text-[10px] text-gray-400 font-normal">对整包/最终出库生效</span>
                        </div>

                        {/* Addons List grouped by Category */}
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                          {Array.from(new Set(PACKAGE_ADDONS.map(a => a.category))).map(cat => (
                            <div key={cat} className="space-y-1.5">
                              <div className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded flex justify-between items-center">
                                <span>{cat}</span>
                              </div>
                              <div className="space-y-1.5">
                                {PACKAGE_ADDONS.filter(a => a.category === cat).map(addon => {
                                  const isSelected = !!selectedPackageAddons[addon.id];
                                  const selectedInfo = selectedPackageAddons[addon.id];
                                  return (
                                    <div 
                                      key={addon.id} 
                                      className={`p-2 rounded-lg border transition-all ${isSelected ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 bg-white'}`}
                                    >
                                      {/* Header with checkbox */}
                                      <div 
                                        onClick={() => togglePackageAddon(addon)}
                                        className="flex items-start gap-2 cursor-pointer"
                                      >
                                        <div className={`w-3.5 h-3.5 mt-0.5 rounded border shrink-0 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'}`}>
                                          {isSelected && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-start gap-1">
                                            <span className={`text-[12px] font-bold leading-tight ${isSelected ? 'text-blue-950 font-extrabold' : 'text-gray-800'}`}>
                                              {addon.name}
                                            </span>
                                            <span className="text-rose-500 font-bold text-[11px] font-mono shrink-0 ml-1">
                                              {addon.price === '需确认' ? '待确认' : `${addon.price}円`}
                                            </span>
                                          </div>
                                          {addon.tips && (
                                            <div className="text-[10px] text-amber-700 font-medium mt-0.5 leading-snug">
                                              ⚠ {addon.tips}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Configurable inputs if selected */}
                                      {isSelected && selectedInfo && (
                                        <div className="mt-2 pt-2 border-t border-dashed border-blue-100 space-y-1.5 bg-blue-50/30 p-2 rounded animate-in slide-in-from-top-1 duration-100">
                                          {/* Standard Qty Counter for non-requireExtra items */}
                                          {!addon.requireExtra ? (
                                            <div className="flex justify-between items-center text-[11px]">
                                              <span className="text-gray-600">服务/包材数量:</span>
                                              <div className="flex items-center gap-2">
                                                <button 
                                                  onClick={() => updatePackageAddonField(addon.id, 'qty', Math.max(1, selectedInfo.qty - 1))}
                                                  className="w-4 h-4 bg-white border rounded flex items-center justify-center text-[12px] font-bold text-gray-600 active:scale-90"
                                                >
                                                  -
                                                </button>
                                                <span className="font-mono font-bold w-4 text-center text-gray-800">{selectedInfo.qty}</span>
                                                <button 
                                                  onClick={() => updatePackageAddonField(addon.id, 'qty', selectedInfo.qty + 1)}
                                                  className="w-4 h-4 bg-white border rounded flex items-center justify-center text-[12px] font-bold text-gray-600 active:scale-90"
                                                >
                                                  +
                                                </button>
                                                <span className="text-gray-500">{addon.unit}</span>
                                              </div>
                                            </div>
                                          ) : (
                                            /* Advanced Inputs for splits and box models */
                                            <div className="space-y-1.5 text-[11px]">
                                              {/* Quantity / Box Count */}
                                              <div className="flex justify-between items-center">
                                                <span className="text-gray-600">合箱拆分数量:</span>
                                                <div className="flex items-center gap-1.5">
                                                  <button 
                                                    onClick={() => updatePackageAddonField(addon.id, 'boxCount', Math.max(1, (selectedInfo.boxCount || 1) - 1))}
                                                    className="w-4 h-4 bg-white border rounded flex items-center justify-center font-bold text-gray-600"
                                                  >
                                                    -
                                                  </button>
                                                  <span className="font-mono font-bold w-4 text-center text-gray-800">{selectedInfo.boxCount || 1}</span>
                                                  <button 
                                                    onClick={() => updatePackageAddonField(addon.id, 'boxCount', (selectedInfo.boxCount || 1) + 1)}
                                                    className="w-4 h-4 bg-white border rounded flex items-center justify-center font-bold text-gray-600"
                                                  >
                                                    +
                                                  </button>
                                                  <span className="text-gray-500">箱</span>
                                                </div>
                                              </div>

                                              {/* Box Type dropdown/selector */}
                                              <div className="flex items-center gap-2">
                                                <span className="text-gray-600 shrink-0">指定分箱型号:</span>
                                                <select 
                                                  value={selectedInfo.boxType || '我不知道，仓库决定'}
                                                  onChange={(e) => updatePackageAddonField(addon.id, 'boxType', e.target.value)}
                                                  className="flex-1 bg-white border border-gray-200 rounded p-0.5 text-[11px] text-gray-800"
                                                >
                                                  <option value="我不知道，仓库决定">我不知道，仓库决定</option>
                                                  {NEW_BOX_MODELS.map(box => (
                                                    <option key={box.model} value={box.model}>
                                                      {box.model} (价格: {box.price}円)
                                                    </option>
                                                  ))}
                                                </select>
                                              </div>

                                              {/* Operation Notes / Requirements */}
                                              <div className="space-y-0.5">
                                                <span className="text-gray-600">分箱操作要求 (选填):</span>
                                                <textarea 
                                                  placeholder="例如：请按订单把书和CD分装在1号箱，立牌徽章装2号箱。"
                                                  value={selectedInfo.requirement || ''}
                                                  onChange={(e) => updatePackageAddonField(addon.id, 'requirement', e.target.value)}
                                                  className="w-full bg-white border border-gray-200 rounded p-1 text-[11px] h-10 focus:border-blue-400 focus:outline-none"
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button 
                          onClick={() => setFormActiveStep(5)}
                          className="bg-[#ffd200] text-gray-900 px-6 py-2 rounded-full text-[13px] font-bold active:scale-95 transition-transform"
                        >
                          确认附加项，下一步
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-gray-50/50">
                      <div className="text-[12px] text-gray-500">已选拆包与附加服务</div>
                      <div className="font-medium text-[13px] text-gray-900 mt-1 space-y-0.5">
                        <div>• {packagingOption === 'keep_all' ? '保留所有包装' : packagingOption === 'remove_shipping' ? '仅拆除快递箱' : '拆除所有外包装'}</div>
                        {Object.keys(selectedPackageAddons).length > 0 ? (
                          <div className="text-[12px] text-blue-600">
                            • 附加服务 ({Object.keys(selectedPackageAddons).length}项): {(Object.values(selectedPackageAddons) as any[]).map(a => a.name).join('、')}
                          </div>
                        ) : (
                          <div className="text-[11px] text-gray-400 italic">• 无包裹级额外增值项</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: 最终出库申请预览与提交 */}
              {formActiveStep >= 5 && (
                <div ref={step5Ref} className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-all duration-300 ${formActiveStep === 5 ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'}`}>
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[12px] font-bold">5</span>
                      <h2 className="font-bold text-[14px] text-gray-800">最终申请预览 & 提交</h2>
                    </div>
                  </div>
                  
                  <div className="p-3 space-y-3.5">
                    {/* Item 1: Selected Orders */}
                    <div className="space-y-1 text-[11px]">
                      <div className="font-bold text-gray-700 flex justify-between">
                        <span>合单打包商品 ({selectedPackageOrders.length}件):</span>
                        <span className="text-gray-900 font-mono">{selectedTotalAmount} 円 / {selectedTotalWeight}g</span>
                      </div>
                      <div className="max-h-20 overflow-y-auto border border-gray-100 rounded p-1.5 bg-gray-50/50 space-y-0.5 text-gray-500">
                        {selectedPackageOrders.map(id => {
                          const o = MOCK_PACKAGE_ORDERS.find(order => order.id === id);
                          return (
                            <div key={id} className="flex justify-between items-center">
                              <span className="truncate max-w-[200px]">📦 {o?.id} - {o?.title}</span>
                              <span className="font-mono">{o?.price}円</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Item 2: Box Option & Price Disclaimer under Rule 4 */}
                    <div className="space-y-1 text-[11px] border-t border-gray-100 pt-2.5">
                      <div className="font-bold text-gray-700 flex justify-between">
                        <span>指定发货包装箱方案:</span>
                        <span className="font-mono text-[#d1586e] font-bold">
                          {boxOption === 'new_box' && selectedCustomBoxModel === '我不知道，仓库决定' ? (
                            '待定 (仓库决定)'
                          ) : boxOption === 'new_box' ? (
                            `${(NEW_BOX_MODELS.find(m => m.model === selectedCustomBoxModel) || NEW_BOX_MODELS[0]).price} 円`
                          ) : boxOption === 'free_box' ? (
                            '免费旧箱 (首选)'
                          ) : (
                            '原箱不拆'
                          )}
                        </span>
                      </div>
                      
                      <div className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-100 space-y-1">
                        <div className="font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> 包装箱计费细则声明：
                        </div>
                        <p className="leading-relaxed">
                          您当前勾选的是: <span className="font-bold underline text-amber-950">{boxOption === 'new_box' ? `指定新箱 (${selectedCustomBoxModel})` : BOX_OPTIONS.find(o => o.id === boxOption)?.title}</span>。
                        </p>
                        <p className="leading-relaxed">
                          {boxOption === 'new_box' && selectedCustomBoxModel === '我不知道，仓库决定' ? (
                            <span className="text-red-700 font-bold">【重要】由于您选择了“我不知道，由仓库决定”，首包预计箱型价格为 [待定]。最终收费会按仓库打包时的实际出库纸箱尺寸收取（100-500日元不等）。</span>
                          ) : (
                            <span>【注意】当前价格为预估方案意向。合箱打包时若遇到因实物不规则或超出尺寸无法装下的情况，仓库打包员将自动为您升级更大新箱，费用按最终实际使用的包装箱收缴。</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Item 3: Selected Addons list */}
                    {/* Item 3: Selected Addons list */}
                    <div className="space-y-1.5 text-[11px] border-t border-gray-100 pt-2.5">
                      <div className="font-bold text-gray-700">已选增值附加服务:</div>
                      
                      {/* Package-level Addons */}
                      {Object.keys(selectedPackageAddons).length > 0 && (
                        <div className="space-y-1 bg-rose-50/20 p-1.5 rounded border border-rose-50">
                          <div className="font-bold text-[10px] text-rose-800">包裹级附加服务:</div>
                          {(Object.values(selectedPackageAddons) as any[]).map(addon => {
                            const addonPrice = addon.price === '需确认' ? 0 : addon.price;
                            const addonQty = addon.id === 'complex_split' ? (addon.boxCount || 1) : addon.qty;
                            const sumPrice = addonPrice * addonQty;
                            return (
                              <div key={addon.id} className="flex justify-between items-center text-gray-700 pl-1">
                                <span className="truncate max-w-[220px]">• {addon.name}</span>
                                <span className="font-mono font-bold text-rose-600 shrink-0">
                                  {addon.price === '需确认' ? '待定' : `+${sumPrice}円`}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Order-specific Addons */}
                      {(() => {
                        const ordersWithServices = selectedPackageOrders.filter(id => orderServices[id] && orderServices[id].length > 0);
                        if (ordersWithServices.length > 0) {
                          return (
                            <div className="space-y-1 bg-blue-50/20 p-1.5 rounded border border-blue-50">
                              <div className="font-bold text-[10px] text-blue-800">商品级单独服务:</div>
                              {ordersWithServices.map(orderId => {
                                const orderObj = MOCK_PACKAGE_ORDERS.find(o => o.id === orderId);
                                const services = orderServices[orderId] || [];
                                return (
                                  <div key={orderId} className="space-y-0.5 border-b border-blue-50 last:border-0 pb-1 last:pb-0 mb-1 last:mb-0">
                                    <div className="text-[10px] text-gray-500 font-mono">入库单 {orderId}:</div>
                                    {services.map(srv => {
                                      const addon = ORDER_ADDONS.find(a => a.id === srv.addonId);
                                      if (!addon) return null;
                                      return (
                                        <div key={srv.addonId} className="flex justify-between items-center text-gray-700 pl-1.5">
                                          <span className="truncate max-w-[220px]">• {addon.name} (x{srv.qty})</span>
                                          <span className="font-mono font-bold text-blue-700 shrink-0">
                                            +{addon.price * srv.qty}円
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return null;
                      })()}

                      {Object.keys(selectedPackageAddons).length === 0 && selectedPackageOrders.every(id => !orderServices[id] || orderServices[id].length === 0) && (
                        <div className="text-gray-400 italic">无额外增值附加项</div>
                      )}
                    </div>

                    {/* Bottom Sticky Action Bar in form card */}
                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                      <div>
                        <div className="text-[10px] text-gray-400 font-bold">预估增值附加费</div>
                        <div className="text-[13px] font-bold text-rose-600 mt-0.5">
                          {(() => {
                            let total = 0;
                            let isTBD = false;

                            // Calculate Box Price
                            if (boxOption === 'new_box') {
                              if (selectedCustomBoxModel === '我不知道，仓库决定') {
                                isTBD = true;
                              } else {
                                const box = NEW_BOX_MODELS.find(m => m.model === selectedCustomBoxModel);
                                total += box ? box.price : 0;
                              }
                            }

                            // Calculate Addon Prices (Package-level)
                            (Object.values(selectedPackageAddons) as any[]).forEach(addon => {
                              if (addon.price === '需确认') {
                                isTBD = true;
                              } else {
                                const qty = addon.id === 'complex_split' ? (addon.boxCount || 1) : addon.qty;
                                total += (addon.price as number) * qty;
                              }
                            });

                            // Calculate Order-specific Addon Prices (Item-level)
                            selectedPackageOrders.forEach(orderId => {
                              const services = orderServices[orderId] || [];
                              services.forEach(srv => {
                                const addon = ORDER_ADDONS.find(a => a.id === srv.addonId);
                                if (addon) {
                                  total += addon.price * srv.qty;
                                }
                              });
                            });

                            if (isTBD) {
                              return `${total > 0 ? total + '円' : '0円'} + 待定部分`;
                            }
                            return `${total} 円`;
                          })()}
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => alert('打包申请已成功提交！仓库管理端已同步更新。您可以在右侧 [合单执行指令 (打包员重点看)] 预览真实的后台工单详情！')}
                        className="bg-gray-900 text-[#ffd200] font-bold text-[12px] px-4 py-2 rounded-full active:scale-95 transition-transform"
                      >
                        提交出库合单
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
        {showOrderServiceModal && (() => {
          const currentOrder = MOCK_PACKAGE_ORDERS.find(o => o.id === showOrderServiceModal);
          const categories = ["商品加固", "立牌/徽章/吧唧", "纸片/卡片/吊牌", "卡盒", "拆包/称重/返图", "丢弃/取出/留仓", "电池/电子产品", "商品套袋"];
          const filteredAddons = ORDER_ADDONS.filter(addon => addon.category === activeModalCategory);
          const totalAddonPrice = tempOrderAddons.reduce((sum, srv) => {
            const addon = ORDER_ADDONS.find(a => a.id === srv.addonId);
            return sum + (addon ? addon.price * srv.qty : 0);
          }, 0);

          return (
            <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
              <div className="bg-white rounded-t-2xl w-full max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
                {/* Modal Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-2xl">
                  <div>
                    <h3 className="font-bold text-[15px] text-gray-900">设置商品附加项</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 font-mono">
                      入库编号: {showOrderServiceModal}
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowOrderServiceModal(null)} 
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 active:scale-90 transition-transform"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Selected Order Mini Info */}
                {currentOrder && (
                  <div className="px-4 py-2 bg-blue-50/50 border-b border-gray-100 flex gap-2 items-center text-[11px]">
                    <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 overflow-hidden shrink-0">
                      <img src={currentOrder.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-800 truncate">{currentOrder.title}</div>
                      <div className="text-gray-500 flex gap-2 mt-0.5">
                        <span>价格: {currentOrder.price}円</span>
                        <span>重量: {currentOrder.weight}g</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Tab Bar */}
                <div className="border-b border-gray-100 bg-white">
                  <div className="flex gap-1 overflow-x-auto p-2 scrollbar-none snap-x">
                    {categories.map(cat => {
                      const isActive = activeModalCategory === cat;
                      const selectedInCatCount = tempOrderAddons.filter(item => {
                        const original = ORDER_ADDONS.find(o => o.id === item.addonId);
                        return original && original.category === cat;
                      }).length;

                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveModalCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium whitespace-nowrap transition-all shrink-0 ${
                            isActive 
                              ? 'bg-blue-600 text-white font-semibold shadow-sm' 
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {cat}
                          {selectedInCatCount > 0 && (
                            <span className="ml-1 px-1.5 py-0.2 bg-red-500 text-white text-[9px] rounded-full font-bold">
                              {selectedInCatCount}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Addons List Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 max-h-[40vh]">
                  {filteredAddons.map(addon => {
                    const selectedItem = tempOrderAddons.find(a => a.addonId === addon.id);
                    const isSelected = !!selectedItem;

                    return (
                      <div 
                        key={addon.id} 
                        className={`p-3 bg-white rounded-xl border transition-all ${
                          isSelected ? 'border-blue-500 ring-1 ring-blue-100 shadow-sm' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-0.5 flex-1 min-w-0">
                            <h4 className="font-bold text-[13px] text-gray-900 leading-snug break-words flex flex-wrap items-center gap-1.5">
                              {addon.name}
                              {addon.scope === 'entire_order' ? (
                                <span className="bg-slate-100 text-slate-700 text-[9px] px-1.5 py-0.2 rounded font-bold border border-slate-200 shrink-0">整单服务</span>
                              ) : (
                                <span className="bg-orange-50 text-orange-700 text-[9px] px-1.5 py-0.2 rounded font-bold border border-orange-200 shrink-0">针对单件</span>
                              )}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500 mt-1">
                              <span className="font-mono text-[#d1586e] font-bold text-[12px]">
                                {addon.price} 円/{addon.unit}
                              </span>
                              <span className="text-gray-300">|</span>
                              <span>适用: {addon.target}</span>
                            </div>
                            {addon.tips && (
                              <div className="mt-1.5 p-1.5 bg-amber-50 rounded text-[10px] text-amber-700 flex gap-1 items-start border border-amber-100">
                                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                                <div className="leading-normal">⚠️ 风险提示: {addon.tips}</div>
                              </div>
                            )}
                          </div>

                          <div className="shrink-0 pt-0.5">
                            {isSelected ? (
                              <button
                                onClick={() => {
                                  setTempOrderAddons(prev => prev.filter(a => a.addonId !== addon.id));
                                }}
                                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-[11px] font-bold border border-red-100 flex items-center gap-0.5"
                              >
                                <Trash2 className="w-3 h-3" /> 移除
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setTempOrderAddons(prev => [...prev, { addonId: addon.id, qty: 1, remark: '' }]);
                                }}
                                className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[11px] font-bold border border-blue-100"
                              >
                                <Plus className="w-3 h-3 inline-block mr-0.5 -mt-0.5" /> 添加
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Selected configuration (quantity and remark) */}
                        {isSelected && selectedItem && (
                          <div className="mt-3 pt-2.5 border-t border-dashed border-gray-100 space-y-2 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-500 font-medium">数量要求：</span>
                              <div className="flex items-center gap-1.5 bg-gray-50 px-1.5 py-0.5 rounded border">
                                <button 
                                  onClick={() => {
                                    setTempOrderAddons(prev => prev.map(a => a.addonId === addon.id ? { ...a, qty: Math.max(1, a.qty - 1) } : a));
                                  }}
                                  className="w-4 h-4 bg-white border rounded flex items-center justify-center font-bold text-gray-600 active:scale-90"
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="font-mono font-bold w-4 text-center text-gray-800">{selectedItem.qty}</span>
                                <button 
                                  onClick={() => {
                                    setTempOrderAddons(prev => prev.map(a => a.addonId === addon.id ? { ...a, qty: a.qty + 1 } : a));
                                  }}
                                  className="w-4 h-4 bg-white border rounded flex items-center justify-center font-bold text-gray-600 active:scale-90"
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-gray-400 font-normal">{addon.unit}</span>
                              </div>
                            </div>
                            {addon.scope === 'single_item' && (
                              <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
                                <span className="text-gray-500 font-medium block">具体要求/操作指令 (选填)：</span>
                                <textarea 
                                  placeholder="例：指定加固该盒、拆除哪几张卡片、左上角的徽章等详细描述..."
                                  value={selectedItem.remark}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setTempOrderAddons(prev => prev.map(a => a.addonId === addon.id ? { ...a, remark: val } : a));
                                  }}
                                  className="w-full bg-gray-50 border border-gray-200 rounded p-1.5 text-[11px] h-12 focus:border-blue-400 focus:bg-white focus:outline-none transition-colors"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Sticky Summary Bar & Footer */}
                <div className="p-4 border-t border-gray-100 bg-white space-y-3">
                  {tempOrderAddons.length > 0 && (
                    <div className="flex justify-between items-center text-[12px] bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                      <div className="text-blue-800">
                        已选择 <span className="font-bold">{tempOrderAddons.length}</span> 项附加服务
                      </div>
                      <div className="font-bold text-blue-900">
                        费用预计: <span className="font-mono text-[14px] text-red-600">{totalAddonPrice}</span> 円
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setTempOrderAddons([]);
                      }}
                      className="w-28 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 active:scale-95 transition-transform text-[13px]"
                    >
                      清空选择
                    </button>
                    <button
                      onClick={() => {
                        setOrderServices(prev => ({
                          ...prev,
                          [showOrderServiceModal]: tempOrderAddons
                        }));
                        setShowOrderServiceModal(null);
                      }}
                      className="flex-1 py-2.5 rounded-full bg-[#ffd200] text-gray-900 text-[13px] font-bold hover:bg-[#ffe040] active:scale-95 transition-transform flex items-center justify-center gap-1 shadow-sm"
                    >
                      <Check className="w-4 h-4" /> 确定保存 ({tempOrderAddons.length} 项)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Order Split Modal */}
        {showSplitModal && (() => {
          const order = MOCK_PACKAGE_ORDERS.find(o => o.id === showSplitModal);
          if (!order) return null;

          return (
            <div className="absolute inset-0 bg-black/60 z-50 flex flex-col justify-end">
              <div 
                className="bg-white rounded-t-2xl w-full max-h-[85vh] flex flex-col animate-in slide-in-from-bottom-full duration-300 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-amber-50/50 rounded-t-2xl">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-amber-600" />
                    <div>
                      <h3 className="font-bold text-[15px] text-gray-900">配置单订单拆分方案</h3>
                      <p className="text-[10px] text-gray-400">仅支持单个包裹拆分为多个出库子单</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowSplitModal(null)} 
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 active:scale-90 transition-transform"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {/* Selected Item Info */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex gap-3">
                    <div className="w-14 h-14 rounded overflow-hidden shrink-0 border border-gray-200">
                      <img src={order.image} alt={order.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-gray-400 font-mono">入库单号: {order.id}</div>
                      <div className="text-[12px] font-bold text-gray-800 truncate">{order.title}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">重量: {order.weight}g | 价值: {order.price}円</div>
                    </div>
                  </div>

                  {/* Split count select */}
                  <div className="space-y-2">
                    <label className="text-[12px] font-bold text-gray-700 block">
                      1. 拆分成多个 LO 出库订单数（件数）：
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const val = Math.max(2, (orderSplitConfig[showSplitModal]?.splitCount || 3) - 1);
                          setOrderSplitConfig(prev => ({
                            ...prev,
                            [showSplitModal]: { ...prev[showSplitModal] || { remark: '' }, splitCount: val }
                          }));
                        }}
                        className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-[18px] font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-transform"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="flex-1 text-center bg-gray-50 border border-gray-200 rounded-lg py-2 font-mono font-bold text-[15px] text-amber-700">
                        {orderSplitConfig[showSplitModal]?.splitCount || 3} 个出库 LO 子单
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const val = Math.min(10, (orderSplitConfig[showSplitModal]?.splitCount || 3) + 1);
                          setOrderSplitConfig(prev => ({
                            ...prev,
                            [showSplitModal]: { ...prev[showSplitModal] || { remark: '' }, splitCount: val }
                          }));
                        }}
                        className="w-10 h-10 rounded-lg border border-gray-300 bg-white flex items-center justify-center text-[18px] font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[10px] text-gray-400 block">
                      ⚠️ 拆分订单数量范围：2 ~ 10。默认拆分为 3 个。
                    </span>
                  </div>

                  {/* Split remark */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[12px] font-bold text-gray-700 block">
                        2. 拆分操作备注栏（指定具体要求）：
                      </label>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">必填</span>
                    </div>
                    
                    <textarea
                      placeholder="例：左上角的徽章。或者输入: 请将包裹内的立牌、徽章、海报拆分成3份..."
                      value={orderSplitConfig[showSplitModal]?.remark || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOrderSplitConfig(prev => ({
                          ...prev,
                          [showSplitModal]: { ...prev[showSplitModal] || { splitCount: 3 }, remark: val }
                        }));
                      }}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-[12px] h-20 focus:border-amber-400 focus:bg-white focus:outline-none transition-colors"
                    />
                    
                    <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-2.5 space-y-1 text-[11px] text-amber-900 leading-relaxed">
                      <div className="font-bold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        什么是同步备注机制？
                      </div>
                      <p className="text-[10px] text-gray-600">
                        当该包裹拆分为 <span className="font-bold font-mono text-blue-600">{orderSplitConfig[showSplitModal]?.splitCount || 3}</span> 个 LO 出库订单时，此备注将<b>同时且自动附加到全部 {orderSplitConfig[showSplitModal]?.splitCount || 3} 个出库单中</b>，使打包员在对任何一个拆分子件进行后续加固等操作时，都能获得统一指示。
                      </p>
                    </div>
                  </div>

                  {/* Flow Simulation Visualization */}
                  <div className="space-y-2 border-t border-gray-100 pt-3">
                    <span className="text-[11px] font-bold text-gray-500">拆分后出库 LO 运单预览：</span>
                    <div className="space-y-1.5">
                      {Array.from({ length: orderSplitConfig[showSplitModal]?.splitCount || 3 }).map((_, sIdx) => (
                        <div key={sIdx} className="bg-amber-50/20 border border-amber-100/50 rounded-lg p-2 flex items-center justify-between text-[11px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="font-bold text-gray-700">LO-{order.id}-S{sIdx+1}</span>
                          </div>
                          <span className="text-gray-500 truncate max-w-[150px] font-sans">
                            📝 {orderSplitConfig[showSplitModal]?.remark ? `"${orderSplitConfig[showSplitModal].remark}"` : '(等待录入备注...)'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-gray-100 bg-white flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setOrderSplitConfig(prev => {
                        const next = { ...prev };
                        delete next[showSplitModal];
                        return next;
                      });
                      setShowSplitModal(null);
                    }}
                    className="w-1/3 py-2.5 rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 active:scale-95 transition-transform text-[13px] font-medium"
                  >
                    取消拆分
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!orderSplitConfig[showSplitModal]?.remark) {
                        setOrderSplitConfig(prev => ({
                          ...prev,
                          [showSplitModal]: { ...prev[showSplitModal] || { splitCount: 3 }, remark: '左上角的徽章' }
                        }));
                      }
                      setShowSplitModal(null);
                    }}
                    className="flex-1 py-2.5 rounded-full bg-amber-500 text-gray-900 text-[13px] font-bold hover:bg-amber-600 active:scale-95 transition-transform flex items-center justify-center gap-1 shadow-sm"
                  >
                    <Check className="w-4 h-4" /> 确定拆分方案
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

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
