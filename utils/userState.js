/**
 * 全局用户状态管理
 * 提供统一的用户信息访问和管理方式
 */
import { reactive } from 'vue';
import { getUserFromStorage } from './api/authApi';
import { createDefaultUserInfo } from './userModel';

// 创建全局响应式用户状态对象
export const userState = reactive(createDefaultUserInfo());

/**
 * 初始化用户状态
 * 从本地存储加载用户信息
 */
export const initUserState = async () => {
  try {
    // 从authApi中获取用户信息
    const storedUserInfo = getUserFromStorage();
    
    if (storedUserInfo && storedUserInfo.userId) {
      // TODO: 如果只有userId，需要从后端加载完整信息
      // 可以在这里调用后端API获取完整的用户信息
      
      // 将存储的用户信息同步到响应式状态
      Object.keys(userState).forEach(key => {
        // 删除所有现有的属性（保持响应式）
        delete userState[key];
      });
      
      // 添加存储的用户ID
      userState.userId = storedUserInfo.userId;
      
      console.log('已从本地存储加载用户ID');
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
    
    // 用户信息不再存储到本地，无需调用updateUserInfo
    return true;
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
}; 