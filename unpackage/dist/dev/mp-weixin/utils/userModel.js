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
  const defaultMedals = [
    // 季节勋章
    {
      id: "season_01",
      name: "节气 · 立春",
      icon: "/static/images/medal/season01.png",
      type: "seasonal",
      isActive: true,
      acquireTime: now - 60 * 24 * 60 * 60 * 1e3,
      description: "在立春节气期间下单获得"
    },
    {
      id: "season_02",
      name: "节气 · 雨水",
      icon: "/static/images/medal/season02.png",
      type: "seasonal",
      isActive: true,
      acquireTime: now - 45 * 24 * 60 * 60 * 1e3,
      description: "在雨水节气期间下单获得"
    },
    {
      id: "season_06",
      name: "节气 · 谷雨",
      icon: "/static/images/medal/season06.png",
      type: "seasonal",
      isActive: true,
      acquireTime: now - 20 * 24 * 60 * 60 * 1e3,
      description: "在谷雨节气期间下单获得"
    },
    {
      id: "season_08",
      name: "节气 · 小满",
      icon: "/static/images/medal/season08.png",
      type: "seasonal",
      isActive: true,
      acquireTime: now - 10 * 24 * 60 * 60 * 1e3,
      description: "在小满节气期间下单获得"
    },
    {
      id: "season_16",
      name: "节气 · 秋分",
      icon: "/static/images/medal/season16.png",
      type: "seasonal",
      isActive: true,
      acquireTime: now - 5 * 24 * 60 * 60 * 1e3,
      description: "在秋分节气期间下单获得"
    },
    {
      id: "season_19",
      name: "节气 · 立冬",
      icon: "/static/images/medal/season19.png",
      type: "seasonal",
      isActive: true,
      acquireTime: now - 2 * 24 * 60 * 60 * 1e3,
      description: "在立冬节气期间下单获得"
    },
    // 大自然限定勋章
    {
      id: "nature_bee",
      name: "大自然 · 蜜蜂",
      icon: "/static/images/medal/nature-bee.png",
      type: "nature",
      isActive: true,
      acquireTime: now - 30 * 24 * 60 * 60 * 1e3,
      description: "购买蜂蜜相关饮品获得"
    },
    {
      id: "nature_butterfly",
      name: "大自然 · 蝴蝶",
      icon: "/static/images/medal/nature-butterfly.png",
      type: "nature",
      isActive: true,
      acquireTime: now - 25 * 24 * 60 * 60 * 1e3,
      description: "夏季限定活动获得"
    },
    {
      id: "nature_cactus",
      name: "大自然 · 仙人掌",
      icon: "/static/images/medal/nature-cactus.png",
      type: "nature",
      isActive: true,
      acquireTime: now - 15 * 24 * 60 * 60 * 1e3,
      description: "沙漠主题活动获得"
    },
    // 等级勋章
    {
      id: "rank_01",
      name: "等级 · Lv1",
      icon: "/static/images/medal/rank01.png",
      type: "level",
      isActive: true,
      acquireTime: now - 90 * 24 * 60 * 60 * 1e3,
      description: "成为熊猫奶茶会员"
    },
    {
      id: "rank_02",
      name: "等级 · Lv2",
      icon: "/static/images/medal/rank02.png",
      type: "level",
      isActive: true,
      acquireTime: now - 75 * 24 * 60 * 60 * 1e3,
      description: "会员等级达到2级"
    },
    {
      id: "rank_03",
      name: "等级 · Lv3",
      icon: "/static/images/medal/rank03.png",
      type: "level",
      isActive: true,
      acquireTime: now - 50 * 24 * 60 * 60 * 1e3,
      description: "会员等级达到3级"
    },
    {
      id: "rank_04",
      name: "等级 · Lv4",
      icon: "/static/images/medal/rank04.png",
      type: "level",
      isActive: true,
      acquireTime: now - 30 * 24 * 60 * 60 * 1e3,
      description: "会员等级达到4级"
    }
  ];
  return {
    userId: "guest_" + Date.now(),
    // 用户唯一标识
    nickname: "熊猫奶茶会员",
    // 用户昵称
    avatar: "/static/images/avatar.png",
    // 头像地址
    phone: "13027261672",
    // 手机号
    gender: "male",
    // 性别：male-男，female-女
    birthday: "",
    // 生日，格式：YYYY-MM-DD
    addresses: [],
    // 收货地址列表
    pandaCoins: 856,
    // 熊猫币
    lightningStars: 5,
    // 点亮星，用于点亮勋章
    coupons: exampleCoupons,
    // 优惠券列表，默认赠送六种不同类型的优惠券
    medals: defaultMedals,
    // 勋章列表，默认赠送部分勋章
    memberLevel: 4,
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
const getUserMedalsByType = (medals = [], type) => {
  if (!Array.isArray(medals))
    return [];
  return medals.filter((medal) => medal.type === type && medal.isActive);
};
exports.createDefaultUserInfo = createDefaultUserInfo;
exports.getUserMedalsByType = getUserMedalsByType;
exports.mergeWithDefaultUserInfo = mergeWithDefaultUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/userModel.js.map
