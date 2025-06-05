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
    backgroundImage: "/static/images/profile-background.jpg",
    bio: "记录生活的点滴，热爱分享☀",
    phone: "",
    gender: "unknown",
    birthday: null,
    pandaCoins: 0,
    lightningStars: 0,
    memberLevel: 1,
    createTime: null,
    lastLoginTime: null,
    followingCount: 0,
    // 关注数
    followersCount: 0,
    // 粉丝数
    likesReceivedCount: 0,
    // 获赞数
    medals: [],
    coupons: [],
    addresses: [],
    isLoading: false
  };
};
const userData = common_vendor.reactive(createDefaultUserData());
const fetchUserDataFromServer = async () => {
  if (!userData.userId) {
    return false;
  }
  try {
    userData.isLoading = true;
    const result = await utils_api_request.get(
      `${utils_api_config.API_PATHS.USER_PROFILE}?userId=${userData.userId}`
    );
    if (result.code === 200 && result.data) {
      const serverUserData = result.data;
      if (serverUserData.addresses && serverUserData.addresses.length > 0) {
      }
      if (serverUserData.defaultAddress) {
      }
      Object.keys(userData).forEach((key) => {
        if (key !== "userId" && key !== "token" && key !== "isLoading" && key !== "coupons" && key !== "medals") {
          userData[key] = serverUserData[key] || userData[key];
        }
      });
      userData.followingCount = serverUserData.followingCount || 0;
      userData.followersCount = serverUserData.followersCount || 0;
      userData.likesReceivedCount = serverUserData.likesReceivedCount || 0;
      userData.backgroundImage = serverUserData.backgroundImage || "/static/images/profile-background.jpg";
      userData.bio = serverUserData.bio || "记录生活的点滴，热爱分享☀";
      try {
        const medalsResult = await utils_api_request.get(
          `${utils_api_config.API_PATHS.USER_MEDALS}/${userData.userId}`
        );
        if (medalsResult.code === 200 && medalsResult.data) {
          userData.medals = medalsResult.data;
        } else {
        }
      } catch (medalsError) {
      }
      try {
        const couponsResult = await utils_api_request.get(
          `${utils_api_config.API_PATHS.USER_COUPONS}/${userData.userId}/with-template`
        );
        if (couponsResult.code === 200 && couponsResult.data) {
          userData.coupons = couponsResult.data;
        } else {
        }
      } catch (couponsError) {
      }
      return true;
    } else {
      return false;
    }
  } catch (error) {
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
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
exports.fetchUserDataFromServer = fetchUserDataFromServer;
exports.initUserData = initUserData;
exports.userData = userData;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userData.js.map
