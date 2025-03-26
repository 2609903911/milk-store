/**
 * 全局用户状态管理
 * 提供统一的用户信息访问和管理方式
 */
import { reactive } from 'vue';
import { getUserInfo, updateUserInfo } from './userStorage';
import { createDefaultUserInfo } from './userModel';

// 创建全局响应式用户状态对象
export const userState = reactive(createDefaultUserInfo());

/**
 * 初始化用户状态
 * 从本地存储加载用户信息
 */
export const initUserState = () => {
  try {
    const storedUserInfo = getUserInfo();
    if (storedUserInfo) {
      // 将存储的用户信息同步到响应式状态
      // 这里需要完全替换用户状态，而不是简单合并对象，以保证优惠券的状态等信息被完整保留
      Object.keys(userState).forEach(key => {
        // 删除所有现有的属性（保持响应式）
        delete userState[key];
      });
      
      // 添加存储的信息
      Object.entries(storedUserInfo).forEach(([key, value]) => {
        userState[key] = value;
      });
      
      console.log('已从本地存储加载用户信息');
    } else {
      console.log('未找到用户信息，使用默认值');
    }
    return true;
  } catch (error) {
    console.error('初始化用户状态失败', error);
    return false;
  }
};

/**
 * 更新用户状态
 * @param {Object} newInfo - 要更新的用户信息
 * @returns {Boolean} - 更新是否成功
 */
export const updateUserState = (newInfo) => {
  try {
    if (!newInfo || typeof newInfo !== 'object') {
      return false;
    }
    
    // 更新响应式状态
    Object.assign(userState, newInfo);
    
    // 同步到本地存储，确保完整更新用户信息
    // 而不是仅更新部分字段
    return updateUserInfo(userState);
  } catch (error) {
    console.error('更新用户状态失败', error);
    return false;
  }
};

/**
 * 重置用户状态(同步到默认值)
 */
export const resetUserState = () => {
  const defaultInfo = createDefaultUserInfo();
  Object.assign(userState, defaultInfo);
  
  // 清除本地存储的用户信息
  updateUserInfo(defaultInfo);
}; 