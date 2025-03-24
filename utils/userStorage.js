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
    
    return JSON.parse(userInfoStr);
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
    
    // 获取当前存储的用户信息
    const currentInfo = getUserInfo() || {};
    
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
 */
export const clearUserInfo = () => {
  try {
    uni.removeStorageSync(USER_INFO_KEY);
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