"use strict";
const COUPON_TYPES = {
  DISCOUNT: "discount",
  // 折扣券（如8折）
  CASH: "cash",
  // 现金券（如满50减10）
  FREE: "free",
  // 免单券
  SPECIAL_PRICE: "specialPrice",
  // 特价券（某商品固定价格）
  SHIPPING: "shipping"
  // 免运费券
};
const COUPON_SCOPES = {
  ALL: "all",
  // 全部商品
  CATEGORY: "category",
  // 特定分类
  PRODUCT: "product",
  // 特定商品
  NEW_USER: "newUser",
  // 新用户专享
  MEMBER: "member"
  // 会员专享
};
const COUPON_STATUS = {
  VALID: "valid",
  // 有效
  USED: "used",
  // 已使用
  EXPIRED: "expired",
  // 已过期
  NOT_STARTED: "notStarted"
  // 未开始
};
const createCoupon = (couponData) => {
  const now = Date.now();
  const defaultCoupon = {
    id: `coupon_${now}_${Math.floor(Math.random() * 1e6)}`,
    // 唯一ID
    title: "默认优惠券",
    // 优惠券标题
    type: COUPON_TYPES.DISCOUNT,
    // 优惠券类型
    value: 0,
    // 优惠券面值或折扣率
    minOrderAmount: 0,
    // 使用门槛（最低消费）
    scope: COUPON_SCOPES.ALL,
    // 使用范围
    scopeIds: [],
    // 适用的分类或商品ID
    startTime: now,
    // 生效时间
    endTime: now + 30 * 24 * 60 * 60 * 1e3,
    // 失效时间（默认30天）
    status: COUPON_STATUS.VALID,
    // 优惠券状态
    description: "",
    // 使用说明
    imageUrl: "/static/images/coupon1.png",
    // 优惠券图片
    isDeleted: false,
    // 是否删除
    createTime: now,
    // 创建时间
    usedTime: null,
    // 使用时间
    source: "system"
    // 优惠券来源
  };
  return { ...defaultCoupon, ...couponData };
};
const createDiscountCoupon = (discountRate, minOrderAmount = 0, options = {}) => {
  return createCoupon({
    type: COUPON_TYPES.DISCOUNT,
    title: `${discountRate}折优惠券`,
    value: discountRate,
    // 折扣率，例如8表示8折
    minOrderAmount,
    description: `满${minOrderAmount}元可用，${discountRate}折优惠`,
    ...options
  });
};
const createCashCoupon = (amount, minOrderAmount = 0, options = {}) => {
  return createCoupon({
    type: COUPON_TYPES.CASH,
    title: `${amount}元现金券`,
    value: amount,
    // 优惠金额
    minOrderAmount,
    description: `满${minOrderAmount}元减${amount}元`,
    ...options
  });
};
const createFreeCoupon = (maxAmount = 0, options = {}) => {
  return createCoupon({
    type: COUPON_TYPES.FREE,
    title: "免单券",
    value: maxAmount,
    // 最高免除金额，0表示无上限
    description: maxAmount > 0 ? `最高免${maxAmount}元` : "免除订单金额",
    ...options
  });
};
exports.COUPON_STATUS = COUPON_STATUS;
exports.COUPON_TYPES = COUPON_TYPES;
exports.createCashCoupon = createCashCoupon;
exports.createDiscountCoupon = createDiscountCoupon;
exports.createFreeCoupon = createFreeCoupon;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/couponModel.js.map
