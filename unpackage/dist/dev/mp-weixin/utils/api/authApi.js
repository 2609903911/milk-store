"use strict";
const common_vendor = require("../../common/vendor.js");
const saveUserToStorage = (userData, token) => {
  try {
    const userMinimalInfo = {
      userId: userData.userId
    };
    common_vendor.index.setStorageSync("userInfo", userMinimalInfo);
    common_vendor.index.setStorageSync("token", token);
    common_vendor.index.__f__("log", "at utils/api/authApi.js:62", "用户ID和token已保存到本地存储");
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/authApi.js:65", "保存用户数据失败:", error);
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
    common_vendor.index.__f__("error", "at utils/api/authApi.js:85", "获取用户数据失败:", error);
    return null;
  }
};
exports.getUserFromStorage = getUserFromStorage;
exports.saveUserToStorage = saveUserToStorage;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/authApi.js.map
