"use strict";
const common_vendor = require("../common/vendor.js");
const utils_userStorage = require("./userStorage.js");
const utils_userModel = require("./userModel.js");
const userState = common_vendor.reactive(utils_userModel.createDefaultUserInfo());
const initUserState = () => {
  try {
    const storedUserInfo = utils_userStorage.getUserInfo();
    if (storedUserInfo) {
      Object.assign(userState, storedUserInfo);
      common_vendor.index.__f__("log", "at utils/userState.js:22", "已从本地存储加载用户信息");
    } else {
      common_vendor.index.__f__("log", "at utils/userState.js:24", "未找到用户信息，使用默认值");
    }
    return true;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userState.js:28", "初始化用户状态失败", error);
    return false;
  }
};
const updateUserState = (newInfo) => {
  try {
    if (!newInfo || typeof newInfo !== "object") {
      return false;
    }
    Object.assign(userState, newInfo);
    return utils_userStorage.updateUserInfo(newInfo);
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userState.js:50", "更新用户状态失败", error);
    return false;
  }
};
exports.initUserState = initUserState;
exports.updateUserState = updateUserState;
exports.userState = userState;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userState.js.map
