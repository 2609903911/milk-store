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
    } else {
    }
    return true;
  } catch (error) {
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
    return false;
  }
};
exports.initUserState = initUserState;
exports.updateUserState = updateUserState;
exports.userState = userState;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userState.js.map
