"use strict";
const common_vendor = require("../common/vendor.js");
const utils_api_authApi = require("./api/authApi.js");
const utils_userModel = require("./userModel.js");
const userState = common_vendor.reactive(utils_userModel.createDefaultUserInfo());
const initUserState = async () => {
  try {
    const storedUserInfo = utils_api_authApi.getUserFromStorage();
    if (storedUserInfo && storedUserInfo.userId) {
      Object.keys(userState).forEach((key) => {
        delete userState[key];
      });
      userState.userId = storedUserInfo.userId;
      common_vendor.index.__f__("log", "at utils/userState.js:34", "已从本地存储加载用户ID");
    } else {
      common_vendor.index.__f__("log", "at utils/userState.js:36", "未找到用户信息，使用默认值");
    }
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userState.js:40", "初始化用户状态失败", error);
    return false;
  }
};
const updateUserState = (newInfo) => {
  try {
    if (!newInfo || typeof newInfo !== "object") {
      return false;
    }
    Object.assign(userState, newInfo);
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userState.js:62", "更新用户状态失败", error);
    return false;
  }
};
exports.initUserState = initUserState;
exports.updateUserState = updateUserState;
exports.userState = userState;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userState.js.map
