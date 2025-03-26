"use strict";
const common_vendor = require("../common/vendor.js");
const USER_INFO_KEY = "MILK_STORE_USER_INFO";
const saveUserInfo = (userInfo) => {
  try {
    if (!userInfo || typeof userInfo !== "object") {
      common_vendor.index.__f__("error", "at utils/userStorage.js:18", "保存的用户信息格式不正确");
      return false;
    }
    common_vendor.index.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo));
    common_vendor.index.__f__("log", "at utils/userStorage.js:24", "已保存用户信息到本地存储");
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userStorage.js:27", "保存用户信息失败", error);
    return false;
  }
};
const getUserInfo = () => {
  try {
    const userInfoStr = common_vendor.index.getStorageSync(USER_INFO_KEY);
    if (!userInfoStr)
      return null;
    const userInfo = JSON.parse(userInfoStr);
    common_vendor.index.__f__("log", "at utils/userStorage.js:43", "已从本地存储获取用户信息");
    return userInfo;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userStorage.js:46", "获取用户信息失败", error);
    return null;
  }
};
const updateUserInfo = (partialInfo) => {
  try {
    if (!partialInfo || typeof partialInfo !== "object") {
      common_vendor.index.__f__("error", "at utils/userStorage.js:59", "更新的用户信息格式不正确");
      return false;
    }
    if (partialInfo.userId && partialInfo.coupons) {
      return saveUserInfo(partialInfo);
    }
    const currentInfo = getUserInfo() || {};
    if (partialInfo.coupons && Array.isArray(partialInfo.coupons)) {
      if (currentInfo.coupons && Array.isArray(currentInfo.coupons)) {
        const couponMap = {};
        currentInfo.coupons.forEach((coupon) => {
          couponMap[coupon.id] = coupon;
        });
        partialInfo.coupons.forEach((coupon) => {
          if (couponMap[coupon.id] && couponMap[coupon.id].status === "used") {
            coupon.status = "used";
            coupon.usedTime = couponMap[coupon.id].usedTime;
          }
        });
      }
    }
    const newInfo = { ...currentInfo, ...partialInfo };
    return saveUserInfo(newInfo);
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userStorage.js:96", "更新用户信息失败", error);
    return false;
  }
};
exports.getUserInfo = getUserInfo;
exports.saveUserInfo = saveUserInfo;
exports.updateUserInfo = updateUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userStorage.js.map
