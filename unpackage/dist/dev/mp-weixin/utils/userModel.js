"use strict";
const createDefaultUserInfo = () => {
  const now = Date.now();
  return {
    userId: "guest_" + Date.now(),
    // 用户唯一标识
    nickname: "熊猫奶茶会员",
    // 用户昵称
    avatar: "/static/images/avatar.png",
    // 头像地址
    phone: "",
    // 手机号
    gender: "",
    // 性别：male-男，female-女
    birthday: "",
    // 生日，格式：YYYY-MM-DD
    addresses: [],
    // 收货地址列表
    pandaCoins: 0,
    // 熊猫币
    lightningStars: 0,
    // 点亮星，用于点亮勋章
    coupons: [],
    // 优惠券列表
    medals: [],
    // 勋章列表
    memberLevel: 1,
    // 会员等级
    createTime: now,
    // 创建时间
    lastLoginTime: now
    // 最后登录时间
  };
};
const mergeWithDefaultUserInfo = (userInfo = {}) => {
  const defaultInfo = createDefaultUserInfo();
  return { ...defaultInfo, ...userInfo };
};
exports.createDefaultUserInfo = createDefaultUserInfo;
exports.mergeWithDefaultUserInfo = mergeWithDefaultUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userModel.js.map
