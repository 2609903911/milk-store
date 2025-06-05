"use strict";
const common_vendor = require("../../common/vendor.js");
const saveUserToStorage = (userData, token) => {
  try {
    const userMinimalInfo = {
      userId: userData.userId
    };
    common_vendor.index.setStorageSync("userInfo", userMinimalInfo);
    common_vendor.index.setStorageSync("token", token);
    return true;
  } catch (error) {
    return false;
  }
};
const getUserFromStorage = () => {
  try {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    const token = common_vendor.index.getStorageSync("token");
    if (!userInfo || !userInfo.userId) {
      return null;
    }
    return {
      ...userInfo,
      token
    };
  } catch (error) {
    return null;
  }
};
exports.getUserFromStorage = getUserFromStorage;
exports.saveUserToStorage = saveUserToStorage;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/authApi.js.map
