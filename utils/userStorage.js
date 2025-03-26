/**
 * 用户信息存储管理工具
 * 提供用户信息的本地存储和读取功能
 */

// 用户信息存储的键名
const USER_INFO_KEY = 'MILK_STORE_USER_INFO';

/**
 * 保存用户信息到本地
 * @param {Object} userInfo - 用户信息对象
 * @returns {Boolean} - 保存是否成功
 */
export const saveUserInfo = (userInfo) => {
  try {
    // 保存前可以进行数据校验
    if (!userInfo || typeof userInfo !== 'object') {
      console.error('保存的用户信息格式不正确');
      return false;
    }
    
    // 将对象转换为JSON字符串并保存
    uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo));
    console.log('已保存用户信息到本地存储');
    return true;
  } catch (error) {
    console.error('保存用户信息失败', error);
    return false;
  }
};

/**
 * 获取本地存储的用户信息
 * @returns {Object|null} - 用户信息对象，如果不存在则返回null
 */
export const getUserInfo = () => {
  try {
    const userInfoStr = uni.getStorageSync(USER_INFO_KEY);
    if (!userInfoStr) return null;
    
    // 解析存储的用户信息
    const userInfo = JSON.parse(userInfoStr);
    console.log('已从本地存储获取用户信息');
    return userInfo;
  } catch (error) {
    console.error('获取用户信息失败', error);
    return null;
  }
};

/**
 * 更新用户信息（部分更新）
 * @param {Object} partialInfo - 需要更新的部分用户信息
 * @returns {Boolean} - 更新是否成功
 */
export const updateUserInfo = (partialInfo) => {
  try {
    if (!partialInfo || typeof partialInfo !== 'object') {
      console.error('更新的用户信息格式不正确');
      return false;
    }
    
    // 如果提供的是完整的用户信息对象，直接保存
    if (partialInfo.userId && partialInfo.coupons) {
      return saveUserInfo(partialInfo);
    }
    
    // 否则获取当前存储的用户信息并合并
    const currentInfo = getUserInfo() || {};
    
    // 特殊处理优惠券数组，确保已使用状态被保留
    if (partialInfo.coupons && Array.isArray(partialInfo.coupons)) {
      // 如果currentInfo中有优惠券信息
      if (currentInfo.coupons && Array.isArray(currentInfo.coupons)) {
        // 创建一个优惠券ID到优惠券对象的映射，以便快速查找
        const couponMap = {};
        currentInfo.coupons.forEach(coupon => {
          couponMap[coupon.id] = coupon;
        });
        
        // 更新现有优惠券的状态
        partialInfo.coupons.forEach(coupon => {
          // 如果本地存储中存在相同ID的优惠券且状态为"已使用"，则保留该状态
          if (couponMap[coupon.id] && couponMap[coupon.id].status === 'used') {
            coupon.status = 'used';
            coupon.usedTime = couponMap[coupon.id].usedTime;
          }
        });
      }
    }
    
    // 合并信息并保存
    const newInfo = { ...currentInfo, ...partialInfo };
    return saveUserInfo(newInfo);
  } catch (error) {
    console.error('更新用户信息失败', error);
    return false;
  }
};

/**
 * 清除本地存储的用户信息
 * @returns {Boolean} - 清除是否成功
 * 
 */
export const clearUserInfo = () => {
  try {
    uni.removeStorageSync(USER_INFO_KEY);
    console.log('已清除本地存储的用户信息');
    return true;
  } catch (error) {
    console.error('清除用户信息失败', error);
    return false;
  }
};

/**
 * 检查用户是否已登录
 * @returns {Boolean} - 是否已登录
 */
export const isUserLoggedIn = () => {
  const userInfo = getUserInfo();
  // 根据实际业务逻辑判断用户是否已登录
  // 例如检查是否有token或userId等关键字段
  return userInfo !== null && userInfo.hasOwnProperty('userId');
}; 