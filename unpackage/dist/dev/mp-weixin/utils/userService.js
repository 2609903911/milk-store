"use strict";
require("../common/vendor.js");
const utils_api_authApi = require("./api/authApi.js");
const utils_userModel = require("./userModel.js");
const utils_userState = require("./userState.js");
const utils_api_request = require("./api/request.js");
const generateUserId = () => {
  return "user_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
};
const registerUser = (userInfo = {}) => {
  try {
    if (!userInfo.phone) {
      return { success: false, message: "手机号不能为空" };
    }
    const userId = generateUserId();
    const newUser = utils_userModel.mergeWithDefaultUserInfo({
      ...userInfo,
      userId,
      createTime: Date.now(),
      lastLoginTime: Date.now()
    });
    const saved = utils_api_authApi.saveUserToStorage({ userId: newUser.userId }, "");
    if (!saved) {
      return { success: false, message: "用户ID保存失败" };
    }
    utils_userState.updateUserState(newUser);
    return { success: true, userInfo: newUser };
  } catch (error) {
    return { success: false, message: "注册过程中发生错误" };
  }
};
const loginUser = (phone, code = "000000") => {
  try {
    if (!phone) {
      return { success: false, message: "手机号不能为空" };
    }
    if (code !== "000000" && !phone.startsWith("guest_")) {
      return { success: false, message: "验证码错误" };
    }
    let userInfo = utils_api_authApi.getUserFromStorage();
    if (!userInfo || !userInfo.userId) {
      return registerUser({ phone });
    }
    utils_userState.updateUserState({ userId: userInfo.userId });
    return { success: true, userInfo };
  } catch (error) {
    return { success: false, message: "登录过程中发生错误" };
  }
};
const updateUserBio = async (bio, userId) => {
  try {
    const currentUser = utils_api_authApi.getUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      return { success: false, message: "用户未登录" };
    }
    const targetUserId = userId || currentUser.userId;
    const response = await utils_api_request.post("/api/user/update-bio", {
      userId: targetUserId,
      bio
    });
    if (response && response.code === 200) {
      utils_userState.updateUserState({ bio });
      return {
        success: true,
        message: "简介更新成功",
        data: { bio }
      };
    } else {
      return {
        success: false,
        message: (response == null ? void 0 : response.message) || "简介更新失败"
      };
    }
  } catch (error) {
    return { success: false, message: "更新简介过程中发生错误" };
  }
};
exports.loginUser = loginUser;
exports.updateUserBio = updateUserBio;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userService.js.map
