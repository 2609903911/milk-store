/**
 * 用户数据管理模块
 * 从本地存储获取后端返回的用户数据
 */
import { reactive } from 'vue';
import { getUserFromStorage } from './api/authApi';

// 创建默认用户数据对象
const createDefaultUserData = () => {
    return {
        userId: '',
        nickname: '游客',
        avatar: '/static/images/avatar.png',
        phone: '',
        gender: 'unknown',
        birthday: null,
        pandaCoins: 0,
        lightningStars: 0,
        memberLevel: 1,
        createTime: null,
        lastLoginTime: null,
        medals: [],
        coupons: [],
        addresses: []
    };
};

// 创建响应式用户数据对象
export const userData = reactive(createDefaultUserData());

// 初始化用户数据
export const initUserData = () => {
    try {
        // 从本地存储获取用户数据
        const storedUserData = getUserFromStorage();
        
        if (storedUserData) {
            // 将存储的用户数据同步到响应式对象
            Object.keys(userData).forEach(key => {
                // 删除所有现有的属性（保持响应式）
                delete userData[key];
            });
            
            // 添加存储的信息
            Object.entries(storedUserData).forEach(([key, value]) => {
                userData[key] = value;
            });
            
            console.log('已从本地存储加载用户数据');
            return true;
        } else {
            console.log('未找到用户数据，使用默认值');
            return false;
        }
    } catch (error) {
        console.error('初始化用户数据失败', error);
        return false;
    }
};

// 检查用户是否已登录
export const isLoggedIn = () => {
    return !!userData.userId;
}; 