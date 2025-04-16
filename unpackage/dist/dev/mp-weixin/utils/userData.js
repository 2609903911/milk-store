"use strict";
const common_vendor = require("../common/vendor.js");
const utils_api_authApi = require("./api/authApi.js");
const utils_api_request = require("./api/request.js");
const utils_api_config = require("./api/config.js");
const createDefaultUserData = () => {
  return {
    userId: "",
    token: "",
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
    addresses: [],
    isLoading: false
  };
};
const userData = common_vendor.reactive(createDefaultUserData());
const fetchUserDataFromServer = async () => {
  if (!userData.userId) {
    common_vendor.index.__f__("log", "at utils/userData.js:38", "没有用户ID，无法获取用户数据");
    return false;
  }
  try {
    userData.isLoading = true;
    const result = await utils_api_request.get(`${utils_api_config.API_PATHS.USER_PROFILE}?userId=${userData.userId}`);
    if (result.code === 200 && result.data) {
      const serverUserData = result.data;
      Object.keys(userData).forEach((key) => {
        if (key !== "userId" && key !== "token" && key !== "isLoading") {
          userData[key] = serverUserData[key] || userData[key];
        }
      });
      common_vendor.index.__f__("log", "at utils/userData.js:60", "已从服务器获取最新用户数据");
      return true;
    } else {
      common_vendor.index.__f__("error", "at utils/userData.js:63", "获取用户数据失败:", result.message);
      return false;
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userData.js:67", "获取用户数据失败:", error);
    return false;
  } finally {
    userData.isLoading = false;
  }
};
const initUserData = async () => {
  try {
    const storedUserData = utils_api_authApi.getUserFromStorage();
    if (storedUserData && storedUserData.userId) {
      userData.userId = storedUserData.userId;
      userData.token = storedUserData.token || "";
      await fetchUserDataFromServer();
      common_vendor.index.__f__("log", "at utils/userData.js:88", "已初始化用户数据");
      return true;
    } else {
      common_vendor.index.__f__("log", "at utils/userData.js:91", "未找到用户数据，使用默认值");
      return false;
    }
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userData.js:95", "初始化用户数据失败", error);
    return false;
  }
};
exports.fetchUserDataFromServer = fetchUserDataFromServer;
exports.initUserData = initUserData;
exports.userData = userData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userData.js.map
