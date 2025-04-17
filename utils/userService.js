/**
 * 用户服务模块
 * 提供用户登录、注册、信息管理等业务功能
 */
import { saveUserToStorage, getUserFromStorage, clearUserStorage } from './api/authApi';
import { createDefaultUserInfo, validateUserInfo, mergeWithDefaultUserInfo } from './userModel';
import { userState, updateUserState, resetUserState } from './userState';

/**
 * 生成唯一用户ID
 * @returns {String} 唯一ID
 */
const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
};

/**
 * 用户注册
 * @param {Object} userInfo - 用户注册信息
 * @returns {Object} 包含成功状态和用户信息的对象
 */
export const registerUser = (userInfo = {}) => {
  try {
    // 验证必要字段
    if (!userInfo.phone) {
      return { success: false, message: '手机号不能为空' };
    }
    
    // 创建用户信息
    const userId = generateUserId();
    const newUser = mergeWithDefaultUserInfo({
      ...userInfo,
      userId,
      createTime: Date.now(),
      lastLoginTime: Date.now()
    });
    
    // 只保存用户ID到本地
    const saved = saveUserToStorage({ userId: newUser.userId }, '');
    if (!saved) {
      return { success: false, message: '用户ID保存失败' };
    }
    
    // 更新全局用户状态
    updateUserState(newUser);
    
    return { success: true, userInfo: newUser };
  } catch (error) {
    console.error('用户注册失败', error);
    return { success: false, message: '注册过程中发生错误' };
  }
};

/**
 * 用户登录
 * @param {String} phone - 手机号
 * @param {String} code - 验证码（本地模拟，实际应使用服务端验证）
 * @returns {Object} 包含成功状态和用户信息的对象
 */
export const loginUser = (phone, code = '000000') => {
  try {
    // 模拟登录验证
    if (!phone) {
      return { success: false, message: '手机号不能为空' };
    }
    
    // 本地验证码固定为000000（实际应使用服务端验证）
    if (code !== '000000' && !phone.startsWith('guest_')) {
      return { success: false, message: '验证码错误' };
    }
    
    // 获取已存储的用户信息
    let userInfo = getUserFromStorage();
    
    // 如果用户不存在，创建新用户
    if (!userInfo || !userInfo.userId) {
      return registerUser({ phone });
    }
    
    // 登录成功，使用后台获取的用户信息
    // 这里应该调用后端API获取完整用户信息
    
    // 更新全局用户状态 - 只更新用户ID
    updateUserState({ userId: userInfo.userId });
    
    return { success: true, userInfo };
  } catch (error) {
    console.error('用户登录失败', error);
    return { success: false, message: '登录过程中发生错误' };
  }
};

/**
 * 用户登出
 * @returns {Boolean} 是否成功登出
 */
export const logoutUser = () => {
  const cleared = clearUserStorage();
  
  // 重置全局用户状态
  if (cleared) {
    resetUserState();
  }
  
  return cleared;
};

/**
 * 更新用户个人资料
 * @param {Object} profileInfo - 要更新的个人资料
 * @returns {Object} 包含成功状态和用户信息的对象
 */
export const updateUserProfile = (profileInfo) => {
  try {
    if (!profileInfo || typeof profileInfo !== 'object') {
      return { success: false, message: '无效的个人资料' };
    }
    
    // 获取当前用户信息
    const currentUser = getUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      return { success: false, message: '用户未登录' };
    }
    
    // 更新个人资料（仅允许更新特定字段）
    const allowedFields = ['nickname', 'avatar', 'gender', 'birthday'];
    const updateFields = {};
    
    allowedFields.forEach(field => {
      if (profileInfo[field] !== undefined) {
        updateFields[field] = profileInfo[field];
      }
    });
    
    // 这里应该调用后端API更新用户信息
    // ...
    
    // 更新全局用户状态
    updateUserState(updateFields);
    
    return { success: true, userInfo: { ...currentUser, ...updateFields } };
  } catch (error) {
    console.error('更新个人资料失败', error);
    return { success: false, message: '更新过程中发生错误' };
  }
};

/**
 * 添加熊猫币
 * @param {Number} amount - 要添加的熊猫币数量
 * @returns {Object} 包含成功状态和更新后用户信息的对象
 */
export const addPandaCoins = (amount) => {
  try {
    if (typeof amount !== 'number' || amount <= 0) {
      return { success: false, message: '无效的熊猫币数量' };
    }
    
    // 获取当前用户信息
    const currentUser = getUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      return { success: false, message: '用户未登录' };
    }
    
    // 这里应该调用后端API更新熊猫币
    // ...
    
    // 计算新的熊猫币数量
    const newCoins = (userState.pandaCoins || 0) + amount;
    
    // 更新全局用户状态
    updateUserState({ pandaCoins: newCoins });
    
    return { 
      success: true, 
      userInfo: { 
        ...currentUser, 
        pandaCoins: newCoins 
      } 
    };
  } catch (error) {
    console.error('添加熊猫币失败', error);
    return { success: false, message: '操作过程中发生错误' };
  }
}; 