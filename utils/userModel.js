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
  
  return {
    userId: 'guest_' + Date.now(), // 用户唯一标识
    nickname: '熊猫奶茶会员', // 用户昵称
    avatar: '/static/images/avatar.png', // 头像地址
    phone: '', // 手机号
    gender: '', // 性别：male-男，female-女
    birthday: '', // 生日，格式：YYYY-MM-DD
    addresses: [], // 收货地址列表
    pandaCoins: 0, // 熊猫币
    lightningStars: 0, // 点亮星，用于点亮勋章
    coupons: [], // 优惠券列表
    medals: [], // 勋章列表
    memberLevel: 1, // 会员等级
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
  if (userInfo.gender && !['male', 'female'].includes(userInfo.gender)) return false;
  if (userInfo.birthday && typeof userInfo.birthday !== 'string') return false;
  
  // 数组类型验证
  if (userInfo.coupons && !Array.isArray(userInfo.coupons)) return false;
  if (userInfo.medals && !Array.isArray(userInfo.medals)) return false;
  if (userInfo.addresses && !Array.isArray(userInfo.addresses)) return false;
  
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

/**
 * 根据类型获取用户勋章
 * @param {Array} medals - 用户拥有的勋章数组
 * @param {String} type - 勋章类型：seasonal(季节), nature(大自然), level(等级)
 * @returns {Array} 指定类型的勋章数组
 */
export const getUserMedalsByType = (medals = [], type) => {
  if (!Array.isArray(medals)) return [];
  return medals.filter(medal => medal.type === type && medal.isActive);
}; 