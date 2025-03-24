"use strict";
const createDefaultUserInfo = () => {
  return {
    userId: "",
    // 用户唯一标识
    nickname: "熊猫奶茶会员",
    // 用户昵称
    avatar: "/static/images/avatar.png",
    // 头像地址
    phone: "",
    // 手机号
    pandaCoins: 271,
    // 熊猫币
    coupons: [],
    // 优惠券列表
    medals: [],
    // 勋章列表
    memberLevel: 0,
    // 会员等级
    createTime: Date.now(),
    // 创建时间
    lastLoginTime: Date.now()
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
