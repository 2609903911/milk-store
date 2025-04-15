"use strict";
const common_vendor = require("../common/vendor.js");
const utils_api_authApi = require("./api/authApi.js");
const createDefaultUserData = () => {
  return {
    userId: "",
    nickname: "游客",
    avatar: "/static/images/avatar.png",
    phone: "",
    gender: "unknown",
    birthday: null,
    pandaCoins: 0,
    lightningStars: 0,
    memberLevel: 1,
    createTime: null,
    lastLoginTime: null,
    medals: [],
    coupons: [],
    addresses: []
  };
};
const userData = common_vendor.reactive(createDefaultUserData());
const initUserData = () => {
  try {
    const storedUserData = utils_api_authApi.getUserFromStorage();
    if (storedUserData) {
      Object.keys(userData).forEach((key) => {
        delete userData[key];
      });
      Object.entries(storedUserData).forEach(([key, value]) => {
        userData[key] = value;
      });
      common_vendor.index.__f__("log", "at utils/userData.js:49", "已从本地存储加载用户数据");
      return true;
    } else {
      common_vendor.index.__f__("log", "at utils/userData.js:52", "未找到用户数据，使用默认值");
      return false;
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userData.js:56", "初始化用户数据失败", error);
    return false;
  }
};
exports.initUserData = initUserData;
exports.userData = userData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userData.js.map
