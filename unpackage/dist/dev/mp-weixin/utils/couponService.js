"use strict";
require("../common/vendor.js");
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
exports.getCouponsByStatus = getCouponsByStatus;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/couponService.js.map
