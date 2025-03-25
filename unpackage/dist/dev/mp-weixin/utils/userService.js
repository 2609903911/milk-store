"use strict";
const common_vendor = require("../common/vendor.js");
const utils_userStorage = require("./userStorage.js");
const utils_userModel = require("./userModel.js");
const utils_userState = require("./userState.js");
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
    const saved = utils_userStorage.saveUserInfo(newUser);
    if (!saved) {
      return { success: false, message: "用户信息保存失败" };
    }
    utils_userState.updateUserState(newUser);
    return { success: true, userInfo: newUser };
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userService.js:49", "用户注册失败", error);
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
    let userInfo = utils_userStorage.getUserInfo();
    if (!userInfo) {
      return registerUser({ phone });
    }
    userInfo.lastLoginTime = Date.now();
    const updated = utils_userStorage.updateUserInfo(userInfo);
    if (!updated) {
      return { success: false, message: "更新登录信息失败" };
    }
    utils_userState.updateUserState(userInfo);
    return { success: true, userInfo };
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/userService.js:93", "用户登录失败", error);
    return { success: false, message: "登录过程中发生错误" };
  }
};
exports.loginUser = loginUser;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userService.js.map
