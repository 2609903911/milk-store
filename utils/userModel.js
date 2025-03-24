/**
 * 用户信息模型
 * 定义用户信息的数据结构和默认值
 */

/**
 * 创建默认用户信息
 * @returns {Object} 默认用户信息对象
 */
export const createDefaultUserInfo = () => {
  // 当前时间戳
  const now = Date.now();
  
  // 创建各类优惠券示例，方便测试
  const exampleCoupons = [
    // 1. 折扣券示例
    {
      id: `coupon_${now}_1`,
      title: '奶茶8折券',
      type: 'discount',
      value: 8, // 8折
      minOrderAmount: 30, // 最低消费30元
      scope: 'all',
      scopeIds: [],
      startTime: now,
      endTime: now + 30 * 24 * 60 * 60 * 1000, // 30天后过期
      status: 'valid',
      description: '满30元可用，全场通用8折优惠',
      imageUrl: '/static/images/coupon1.png',
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: 'system'
    },
    
    // 2. 现金券示例
    {
      id: `coupon_${now}_2`,
      title: '满50减10元券',
      type: 'cash',
      value: 10, // 减10元
      minOrderAmount: 50, // 最低消费50元
      scope: 'all',
      scopeIds: [],
      startTime: now,
      endTime: now + 15 * 24 * 60 * 60 * 1000, // 15天后过期
      status: 'valid',
      description: '满50元可用，立减10元',
      imageUrl: '/static/images/coupon2.png',
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: 'newUser'
    },
    
    // 3. 免单券示例
    {
      id: `coupon_${now}_3`,
      title: '免单券（最高30元）',
      type: 'free',
      value: 30, // 最高免除30元
      minOrderAmount: 0, // 无最低消费
      scope: 'member',
      scopeIds: [],
      startTime: now,
      endTime: now + 7 * 24 * 60 * 60 * 1000, // 7天后过期
      status: 'valid',
      description: '订单金额直接免除，最高30元',
      imageUrl: '/static/images/coupon3.png',
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: 'activity'
    },
    
    // 4. 买一赠一券示例
    {
      id: `coupon_${now}_4`,
      title: '买一赠一券',
      type: 'buyOneGetOne',
      value: 1, // 赠送1份
      minOrderAmount: 0, // 无最低消费
      scope: 'category',
      scopeIds: ['招牌奶茶', '真鲜奶茶'], // 只适用于特定分类
      startTime: now,
      endTime: now + 20 * 24 * 60 * 60 * 1000, // 20天后过期
      status: 'valid',
      description: '指定奶茶类别买一赠一',
      imageUrl: '/static/images/coupon4.png',
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: 'memberDay'
    },
    
    // 5. 特价券示例
    {
      id: `coupon_${now}_5`,
      title: '杨梅吐气特价券',
      type: 'specialPrice',
      value: 9.9, // 特价9.9元
      minOrderAmount: 0, // 无最低消费
      scope: 'product',
      scopeIds: ['杨梅吐气'], // 只适用于特定商品
      startTime: now,
      endTime: now + 10 * 24 * 60 * 60 * 1000, // 10天后过期
      status: 'valid',
      description: '杨梅吐气特价9.9元',
      imageUrl: '/static/images/coupon5.png',
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: 'promotion'
    },
    
    // 6. 免运费券示例
    {
      id: `coupon_${now}_6`,
      title: '免运费券',
      type: 'shipping',
      value: 0, // 无金额属性
      minOrderAmount: 20, // 最低消费20元
      scope: 'all',
      scopeIds: [],
      startTime: now,
      endTime: now + 30 * 24 * 60 * 60 * 1000, // 30天后过期
      status: 'valid',
      description: '满20元免除配送费',
      imageUrl: '/static/images/coupon6.png',
      isDeleted: false,
      createTime: now,
      usedTime: null,
      source: 'delivery'
    }
  ];
  
  return {
    userId: '', // 用户唯一标识
    nickname: '熊猫奶茶会员', // 用户昵称
    avatar: '/static/images/avatar.png', // 头像地址
    phone: '', // 手机号
    pandaCoins: 237, // 熊猫币
    coupons: exampleCoupons, // 优惠券列表，默认赠送六种不同类型的优惠券
    medals: [], // 勋章列表
    memberLevel: 0, // 会员等级
    createTime: now, // 创建时间
    lastLoginTime: now, // 最后登录时间
  };
};

/**
 * 验证用户信息字段是否合法
 * @param {Object} userInfo - 用户信息对象
 * @returns {Boolean} 是否合法
 */
export const validateUserInfo = (userInfo) => {
  if (!userInfo || typeof userInfo !== 'object') {
    return false;
  }
  
  // 基本字段类型验证
  if (userInfo.userId && typeof userInfo.userId !== 'string') return false;
  if (userInfo.nickname && typeof userInfo.nickname !== 'string') return false;
  if (userInfo.phone && typeof userInfo.phone !== 'string') return false;
  if (userInfo.pandaCoins !== undefined && typeof userInfo.pandaCoins !== 'number') return false;
  
  // 数组类型验证
  if (userInfo.coupons && !Array.isArray(userInfo.coupons)) return false;
  if (userInfo.medals && !Array.isArray(userInfo.medals)) return false;
  
  return true;
};

/**
 * 合并用户信息，使用默认值填充缺失字段
 * @param {Object} userInfo - 用户提供的信息
 * @returns {Object} 合并后的完整用户信息
 */
export const mergeWithDefaultUserInfo = (userInfo = {}) => {
  const defaultInfo = createDefaultUserInfo();
  return { ...defaultInfo, ...userInfo };
}; 