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
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userStorage.js:26", "保存用户信息失败", error);
    return false;
  }
};
const getUserInfo = () => {
  try {
    const userInfoStr = common_vendor.index.getStorageSync(USER_INFO_KEY);
    if (!userInfoStr)
      return null;
    return JSON.parse(userInfoStr);
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userStorage.js:42", "获取用户信息失败", error);
    return null;
  }
};
const updateUserInfo = (partialInfo) => {
  try {
    if (!partialInfo || typeof partialInfo !== "object") {
      common_vendor.index.__f__("error", "at utils/userStorage.js:55", "更新的用户信息格式不正确");
      return false;
    }
    const currentInfo = getUserInfo() || {};
    const newInfo = { ...currentInfo, ...partialInfo };
    return saveUserInfo(newInfo);
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userStorage.js:66", "更新用户信息失败", error);
    return false;
  }
};
exports.getUserInfo = getUserInfo;
exports.saveUserInfo = saveUserInfo;
exports.updateUserInfo = updateUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userStorage.js.map
