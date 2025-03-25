/**
 * 优惠券数据模型
 * 定义优惠券的数据结构和类型
 */

// 优惠券类型枚举
export const COUPON_TYPES = {
  DISCOUNT: 'discount', // 折扣券（如8折）
  CASH: 'cash', // 现金券（如满50减10）
  FREE: 'free', // 免单券
  SPECIAL_PRICE: 'specialPrice', // 特价券（某商品固定价格）
  SHIPPING: 'shipping' // 免运费券
};

// 优惠券使用范围
export const COUPON_SCOPES = {
  ALL: 'all', // 全部商品
  CATEGORY: 'category', // 特定分类
  PRODUCT: 'product', // 特定商品
  NEW_USER: 'newUser', // 新用户专享
  MEMBER: 'member' // 会员专享
};

// 优惠券状态
export const COUPON_STATUS = {
  VALID: 'valid', // 有效
  USED: 'used', // 已使用
  EXPIRED: 'expired', // 已过期
  NOT_STARTED: 'notStarted' // 未开始
};

/**
 * 创建优惠券对象
 * @param {Object} couponData 优惠券数据
 * @returns {Object} 优惠券对象
 */
export const createCoupon = (couponData) => {
  const now = Date.now();
  
  // 默认优惠券结构
  const defaultCoupon = {
    id: `coupon_${now}_${Math.floor(Math.random() * 1000000)}`, // 唯一ID
    title: '默认优惠券', // 优惠券标题
    type: COUPON_TYPES.DISCOUNT, // 优惠券类型
    value: 0, // 优惠券面值或折扣率
    minOrderAmount: 0, // 使用门槛（最低消费）
    scope: COUPON_SCOPES.ALL, // 使用范围
    scopeIds: [], // 适用的分类或商品ID
    startTime: now, // 生效时间
    endTime: now + 30 * 24 * 60 * 60 * 1000, // 失效时间（默认30天）
    status: COUPON_STATUS.VALID, // 优惠券状态
    description: '', // 使用说明
    imageUrl: '/static/images/coupon1.png', // 优惠券图片
    isDeleted: false, // 是否删除
    createTime: now, // 创建时间
    usedTime: null, // 使用时间
    source: 'system' // 优惠券来源
  };
  
  // 合并传入的数据
  return { ...defaultCoupon, ...couponData };
};

/**
 * 计算优惠券状态
 * @param {Object} coupon 优惠券对象
 * @returns {String} 优惠券状态
 */
export const calculateCouponStatus = (coupon) => {
  const now = Date.now();
  
  if (coupon.status === COUPON_STATUS.USED) {
    return COUPON_STATUS.USED;
  }
  
  if (now < coupon.startTime) {
    return COUPON_STATUS.NOT_STARTED;
  }
  
  if (now > coupon.endTime) {
    return COUPON_STATUS.EXPIRED;
  }
  
  return COUPON_STATUS.VALID;
};

/**
 * 创建特定类型的优惠券
 */

// 创建折扣券
export const createDiscountCoupon = (discountRate, minOrderAmount = 0, options = {}) => {
  return createCoupon({
    type: COUPON_TYPES.DISCOUNT,
    title: `${discountRate}折优惠券`,
    value: discountRate, // 折扣率，例如8表示8折
    minOrderAmount,
    description: `满${minOrderAmount}元可用，${discountRate}折优惠`,
    ...options
  });
};

// 创建现金券
export const createCashCoupon = (amount, minOrderAmount = 0, options = {}) => {
  return createCoupon({
    type: COUPON_TYPES.CASH,
    title: `${amount}元现金券`,
    value: amount, // 优惠金额
    minOrderAmount,
    description: `满${minOrderAmount}元减${amount}元`,
    ...options
  });
};

// 创建免单券
export const createFreeCoupon = (maxAmount = 0, options = {}) => {
  return createCoupon({
    type: COUPON_TYPES.FREE,
    title: '免单券',
    value: maxAmount, // 最高免除金额，0表示无上限
    description: maxAmount > 0 ? `最高免${maxAmount}元` : '免除订单金额',
    ...options
  });
};

// 创建特价券
export const createSpecialPriceCoupon = (productId, specialPrice, options = {}) => {
  return createCoupon({
    type: COUPON_TYPES.SPECIAL_PRICE,
    title: '特价券',
    value: specialPrice, // 特价金额
    scope: COUPON_SCOPES.PRODUCT,
    scopeIds: [productId],
    description: `指定商品特价${specialPrice}元`,
    ...options
  });
}; 