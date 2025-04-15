"use strict";
const common_vendor = require("../../common/vendor.js");
const saveUserToStorage = (userData, token) => {
  try {
    common_vendor.index.setStorageSync("userInfo", userData);
    common_vendor.index.setStorageSync("token", token);
    common_vendor.index.__f__("log", "at utils/api/authApi.js:57", "用户数据已保存到本地存储");
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/authApi.js:60", "保存用户数据失败:", error);
    return false;
  }
};
const getUserFromStorage = () => {
  try {
    const userInfo = common_vendor.index.getStorageSync("userInfo");
    return userInfo || null;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/authApi.js:71", "获取用户数据失败:", error);
    return null;
  }
};
exports.getUserFromStorage = getUserFromStorage;
exports.saveUserToStorage = saveUserToStorage;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/authApi.js.map
