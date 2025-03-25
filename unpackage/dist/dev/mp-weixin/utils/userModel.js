"use strict";
const createDefaultUserInfo = () => {
  const now = Date.now();
  const exampleCoupons = [
    // 1. 折扣券示例
    {
      id: `coupon_${now}_1`,
      title: "奶茶8折券",
      type: "discount",
      value: 8,
      // 8折
      minOrderAmount: 30,
      // 最低消费30元
      scope: "all",
      scopeIds: [],
      startTime: now,
      endTime: now + 30 * 24 * 60 * 60 * 1e3,
      // 30天后过期
      status: "valid",
      description: "满30元可用，全场通用8折优惠",
      imageUrl: "/static/images/coupon1.png",
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: "system"
    },
    // 2. 现金券示例
    {
      id: `coupon_${now}_2`,
      title: "满50减10元券",
      type: "cash",
      value: 10,
      // 减10元
      minOrderAmount: 50,
      // 最低消费50元
      scope: "all",
      scopeIds: [],
      startTime: now,
      endTime: now + 15 * 24 * 60 * 60 * 1e3,
      // 15天后过期
      status: "valid",
      description: "满50元可用，立减10元",
      imageUrl: "/static/images/coupon2.png",
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: "newUser"
    },
    // 3. 免单券示例
    {
      id: `coupon_${now}_3`,
      title: "免单券",
      type: "free",
      value: 50,
      // 最高优惠50元
      minOrderAmount: 0,
      // 无最低消费
      scope: "all",
      scopeIds: [],
      startTime: now,
      endTime: now + 7 * 24 * 60 * 60 * 1e3,
      // 7天后过期
      status: "valid",
      description: "满50元以下订单全额免单",
      imageUrl: "/static/images/coupon3.png",
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: "newUser"
    },
    // 5. 特价券示例
    {
      id: `coupon_${now}_5`,
      title: "杨梅吐气特价券",
      type: "specialPrice",
      value: 9.9,
      // 特价9.9元
      minOrderAmount: 0,
      // 无最低消费
      scope: "product",
      scopeIds: ["杨梅吐气"],
      // 只适用于特定商品
      startTime: now,
      endTime: now + 10 * 24 * 60 * 60 * 1e3,
      // 10天后过期
      status: "valid",
      description: "杨梅吐气特价9.9元",
      imageUrl: "/static/images/coupon5.png",
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: "promotion"
    },
    // 6. 免运费券示例
    {
      id: `coupon_${now}_6`,
      title: "免运费券",
      type: "shipping",
      value: 0,
      // 无金额属性
      minOrderAmount: 20,
      // 最低消费20元
      scope: "all",
      scopeIds: [],
      startTime: now,
      endTime: now + 30 * 24 * 60 * 60 * 1e3,
      // 30天后过期
      status: "valid",
      description: "满20元免除配送费",
      imageUrl: "/static/images/coupon6.png",
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: "delivery"
    }
  ];
  return {
    userId: "",
    // 用户唯一标识
    nickname: "熊猫奶茶会员",
    // 用户昵称
    avatar: "/static/images/avatar.png",
    // 头像地址
    phone: "",
    // 手机号
    pandaCoins: 237,
    // 熊猫币
    coupons: exampleCoupons,
    // 优惠券列表，默认赠送六种不同类型的优惠券
    medals: [],
    // 勋章列表
    memberLevel: 0,
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
