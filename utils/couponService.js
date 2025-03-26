/**
 * 优惠券服务模块
 * 提供优惠券的发放、领取、使用和计算折扣等功能
 */
import { userState, updateUserState } from './userState';
import { getUserInfo, updateUserInfo } from './userStorage';
import { 
  COUPON_TYPES, 
  COUPON_SCOPES, 
  COUPON_STATUS, 
  calculateCouponStatus,
  createCoupon,
  createDiscountCoupon,
  createCashCoupon,
  createFreeCoupon,
  createSpecialPriceCoupon
} from './couponModel';

/**
 * 获取用户优惠券
 * @returns {Array} 用户优惠券列表
 */
export const getUserCoupons = () => {
  return userState.coupons || [];
};

/**
 * 根据状态获取用户优惠券
 * @param {String} status 优惠券状态，不传则获取所有
 * @returns {Array} 过滤后的优惠券列表
 */
export const getCouponsByStatus = (status) => {
  const coupons = getUserCoupons();
  if (!status) return coupons;
  
  // 更新每个优惠券的最新状态
  return coupons.filter(coupon => {
    // 如果优惠券状态已经是USED，则保持使用过的状态
    if (coupon.status === COUPON_STATUS.USED) {
      return status === COUPON_STATUS.USED;
    }
    // 否则通过计算来判断优惠券状态
    const currentStatus = calculateCouponStatus(coupon);
    return currentStatus === status;
  });
};

/**
 * 获取可用优惠券
 * @param {Object} orderInfo 订单信息
 * @returns {Array} 可用优惠券列表
 */
export const getAvailableCoupons = (orderInfo) => {
  const validCoupons = getCouponsByStatus(COUPON_STATUS.VALID);
  
  if (!orderInfo) return validCoupons;
  
  return validCoupons.filter(coupon => {
    // 检查最低消费条件
    if (coupon.minOrderAmount > 0 && orderInfo.totalAmount < coupon.minOrderAmount) {
      return false;
    }
    
    // 检查使用范围
    switch (coupon.scope) {
      case COUPON_SCOPES.ALL:
        return true;
        
      case COUPON_SCOPES.CATEGORY:
        // 检查订单中是否包含指定分类商品
        return orderInfo.items.some(item => 
          coupon.scopeIds.includes(item.categoryId)
        );
        
      case COUPON_SCOPES.PRODUCT:
        // 检查订单中是否包含指定商品
        return orderInfo.items.some(item => 
          coupon.scopeIds.includes(item.productId)
        );
        
      case COUPON_SCOPES.NEW_USER:
        // 检查是否为新用户
        return userState.createTime && 
               (Date.now() - userState.createTime < 7 * 24 * 60 * 60 * 1000); // 7天内视为新用户
        
      case COUPON_SCOPES.MEMBER:
        // 检查是否为会员
        return userState.memberLevel > 0;
        
      default:
        return false;
    }
  });
};

/**
 * 计算优惠券折扣金额
 * @param {Object} coupon 优惠券对象
 * @param {Object} orderInfo 订单信息
 * @returns {Number} 折扣金额
 */
export const calculateDiscount = (coupon, orderInfo) => {
  if (!coupon || !orderInfo) return 0;
  
  // 如果优惠券已被使用，直接返回0
  if (coupon.status === COUPON_STATUS.USED) {
    return 0;
  }
  
  // 获取最新状态，检查是否可用
  const status = calculateCouponStatus(coupon);
  if (status !== COUPON_STATUS.VALID) return 0;
  
  // 检查最低消费
  if (coupon.minOrderAmount > 0 && orderInfo.totalAmount < coupon.minOrderAmount) {
    return 0;
  }
  
  // 根据不同类型计算折扣
  switch (coupon.type) {
    case COUPON_TYPES.DISCOUNT:
      // 折扣券，如8折
      return parseFloat((orderInfo.totalAmount * (1 - coupon.value / 10)).toFixed(2));
      
    case COUPON_TYPES.CASH:
      // 现金券，如满50减10
      return Math.min(coupon.value, orderInfo.totalAmount);
      
    case COUPON_TYPES.FREE:
      // 免单券，可能有最高限额
      return coupon.value > 0 ? Math.min(coupon.value, orderInfo.totalAmount) : orderInfo.totalAmount;
      
    case COUPON_TYPES.SPECIAL_PRICE:
      // 特价券，将指定商品价格变为特价
      let specialDiscount = 0;
      orderInfo.items.forEach(item => {
        if (coupon.scopeIds.includes(item.productId)) {
          // 原价与特价的差额
          const itemDiscount = (item.price - coupon.value) * item.quantity;
          if (itemDiscount > 0) {
            specialDiscount += itemDiscount;
          }
        }
      });
      return specialDiscount;
      
    case COUPON_TYPES.SHIPPING:
      // 免运费券
      return orderInfo.shippingFee || 0;
      
    default:
      return 0;
  }
};

/**
 * 添加优惠券到用户账户
 * @param {Object} coupon 优惠券对象
 * @returns {Boolean} 是否成功添加
 */
export const addCouponToUser = (coupon) => {
  try {
    if (!coupon || !coupon.id) return false;
    
    // 获取用户当前优惠券列表
    const currentCoupons = userState.coupons || [];
    
    // 检查优惠券是否已存在
    if (currentCoupons.some(c => c.id === coupon.id)) {
      console.warn('优惠券已存在', coupon.id);
      return false;
    }
    
    // 添加新优惠券
    const newCoupons = [...currentCoupons, coupon];
    
    // 更新用户状态
    const updated = updateUserState({ coupons: newCoupons });
    
    return updated;
  } catch (error) {
    console.error('添加优惠券失败', error);
    return false;
  }
};

/**
 * 领取优惠券
 * @param {Object} coupon 优惠券对象
 * @returns {Object} 结果对象
 */
export const claimCoupon = (coupon) => {
  try {
    if (!coupon) {
      return { success: false, message: '无效的优惠券' };
    }
    
    // 添加领取时间标记
    const couponWithClaimTime = {
      ...coupon,
      claimTime: Date.now()
    };
    
    const added = addCouponToUser(couponWithClaimTime);
    
    if (!added) {
      return { success: false, message: '领取优惠券失败' };
    }
    
    return { success: true, message: '优惠券领取成功', coupon: couponWithClaimTime };
  } catch (error) {
    console.error('领取优惠券出错', error);
    return { success: false, message: '领取过程中发生错误' };
  }
};

/**
 * 使用优惠券
 * @param {String} couponId 优惠券ID
 * @param {Object} orderInfo 订单信息
 * @returns {Object} 结果对象，包含成功状态和折扣金额
 */
export const useCoupon = (couponId, orderInfo) => {
  try {
    if (!couponId || !orderInfo) {
      return { success: false, message: '参数不完整', discount: 0 };
    }
    
    // 获取用户优惠券
    const userCoupons = getUserCoupons();
    const couponIndex = userCoupons.findIndex(c => c.id === couponId);
    
    if (couponIndex === -1) {
      return { success: false, message: '优惠券不存在', discount: 0 };
    }
    
    const coupon = userCoupons[couponIndex];
    
    // 如果优惠券已经被使用，返回错误
    if (coupon.status === COUPON_STATUS.USED) {
      return { success: false, message: '优惠券已被使用', discount: 0 };
    }
    
    // 检查优惠券状态
    const status = calculateCouponStatus(coupon);
    if (status !== COUPON_STATUS.VALID) {
      return { success: false, message: '优惠券已失效', discount: 0 };
    }
    
    // 计算折扣
    const discount = calculateDiscount(coupon, orderInfo);
    
    if (discount <= 0) {
      return { success: false, message: '此订单不满足优惠券使用条件', discount: 0 };
    }
    
    // 标记优惠券为已使用
    const updatedCoupons = [...userCoupons];
    updatedCoupons[couponIndex] = {
      ...coupon,
      status: COUPON_STATUS.USED,
      usedTime: Date.now()
    };
    
    // 更新用户状态和本地存储
    const updated = updateUserState({ coupons: updatedCoupons });
    
    if (!updated) {
      return { success: false, message: '使用优惠券失败', discount: 0 };
    }
    
    return { 
      success: true, 
      message: '优惠券使用成功', 
      discount,
      coupon: updatedCoupons[couponIndex]
    };
  } catch (error) {
    console.error('使用优惠券出错', error);
    return { success: false, message: '使用过程中发生错误', discount: 0 };
  }
};

/**
 * 生成随机优惠券
 * @param {String} type 优惠券类型，不传则随机生成
 * @returns {Object} 优惠券对象
 */
export const generateRandomCoupon = (type) => {
  // 如果未指定类型，随机选择一种
  const couponType = type || Object.values(COUPON_TYPES)[
    Math.floor(Math.random() * Object.values(COUPON_TYPES).length)
  ];
  
  // 根据类型创建不同的优惠券
  switch (couponType) {
    case COUPON_TYPES.DISCOUNT:
      // 随机折扣率，7-9.5折
      const discountRate = (Math.floor(Math.random() * 25) + 70) / 10;
      return createDiscountCoupon(discountRate, Math.random() > 0.5 ? 30 : 0);
      
    case COUPON_TYPES.CASH:
      // 随机减免金额，5-20元
      const cashAmount = Math.floor(Math.random() * 16) + 5;
      const minAmount = cashAmount * (Math.floor(Math.random() * 3) + 2); // 最低消费是减免金额的2-4倍
      return createCashCoupon(cashAmount, minAmount);
      
    case COUPON_TYPES.FREE:
      // 免单券，可能有最高限额
      return createFreeCoupon(Math.random() > 0.7 ? 30 : 0);
      
    case COUPON_TYPES.SPECIAL_PRICE:
      // 随机特价券
      const productId = `product_${Math.floor(Math.random() * 100) + 1}`;
      const specialPrice = Math.floor(Math.random() * 10) + 5; // 5-15元
      return createSpecialPriceCoupon(productId, specialPrice);
      
    case COUPON_TYPES.SHIPPING:
      // 免运费券
      return createCoupon({
        type: COUPON_TYPES.SHIPPING,
        title: '免运费券',
        value: 0,
        description: '订单免除配送费'
      });
      
    default:
      // 默认创建折扣券
      return createDiscountCoupon(8, 30);
  }
}; 