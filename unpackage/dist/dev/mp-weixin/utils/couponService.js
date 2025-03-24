"use strict";
const common_vendor = require("../common/vendor.js");
const utils_userState = require("./userState.js");
const utils_couponModel = require("./couponModel.js");
const getUserCoupons = () => {
  return utils_userState.userState.coupons || [];
};
const getCouponsByStatus = (status) => {
  const coupons = getUserCoupons();
  if (!status)
    return coupons;
  return coupons.filter((coupon) => {
    const currentStatus = utils_couponModel.calculateCouponStatus(coupon);
    return currentStatus === status;
  });
};
const addCouponToUser = (coupon) => {
  try {
    if (!coupon || !coupon.id)
      return false;
    const currentCoupons = utils_userState.userState.coupons || [];
    if (currentCoupons.some((c) => c.id === coupon.id)) {
      common_vendor.index.__f__("warn", "at utils/couponService.js:176", "优惠券已存在", coupon.id);
      return false;
    }
    const newCoupons = [...currentCoupons, coupon];
    const updated = utils_userState.updateUserState({ coupons: newCoupons });
    return updated;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/couponService.js:188", "添加优惠券失败", error);
    return false;
  }
};
const claimCoupon = (coupon) => {
  try {
    if (!coupon) {
      return { success: false, message: "无效的优惠券" };
    }
    const couponWithClaimTime = {
      ...coupon,
      claimTime: Date.now()
    };
    const added = addCouponToUser(couponWithClaimTime);
    if (!added) {
      return { success: false, message: "领取优惠券失败" };
    }
    return { success: true, message: "优惠券领取成功", coupon: couponWithClaimTime };
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/couponService.js:218", "领取优惠券出错", error);
    return { success: false, message: "领取过程中发生错误" };
  }
};
const generateRandomCoupon = (type) => {
  const couponType = type || Object.values(utils_couponModel.COUPON_TYPES)[Math.floor(Math.random() * Object.values(utils_couponModel.COUPON_TYPES).length)];
  switch (couponType) {
    case utils_couponModel.COUPON_TYPES.DISCOUNT:
      const discountRate = (Math.floor(Math.random() * 25) + 70) / 10;
      return utils_couponModel.createDiscountCoupon(discountRate, Math.random() > 0.5 ? 30 : 0);
    case utils_couponModel.COUPON_TYPES.CASH:
      const cashAmount = Math.floor(Math.random() * 16) + 5;
      const minAmount = cashAmount * (Math.floor(Math.random() * 3) + 2);
      return utils_couponModel.createCashCoupon(cashAmount, minAmount);
    case utils_couponModel.COUPON_TYPES.FREE:
      return utils_couponModel.createFreeCoupon(Math.random() > 0.7 ? 30 : 0);
    case utils_couponModel.COUPON_TYPES.BUY_ONE_GET_ONE:
      return utils_couponModel.createBuyOneGetOneCoupon();
    case utils_couponModel.COUPON_TYPES.SPECIAL_PRICE:
      const productId = `product_${Math.floor(Math.random() * 100) + 1}`;
      const specialPrice = Math.floor(Math.random() * 10) + 5;
      return utils_couponModel.createSpecialPriceCoupon(productId, specialPrice);
    case utils_couponModel.COUPON_TYPES.SHIPPING:
      return utils_couponModel.createCoupon({
        type: utils_couponModel.COUPON_TYPES.SHIPPING,
        title: "免运费券",
        value: 0,
        description: "订单免除配送费"
      });
    default:
      return utils_couponModel.createDiscountCoupon(8, 30);
  }
};
exports.claimCoupon = claimCoupon;
exports.generateRandomCoupon = generateRandomCoupon;
exports.getCouponsByStatus = getCouponsByStatus;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/couponService.js.map
