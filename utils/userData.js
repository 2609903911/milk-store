/**
 * 用户数据管理模块
 * 从本地存储获取用户ID和token，并通过API获取最新的用户数据
 */
import { reactive } from "vue";
import { getUserFromStorage } from "./api/authApi";
import { get } from "./api/request";
import { API_PATHS } from "./api/config";

// 创建默认用户数据对象
const createDefaultUserData = () => {
  return {
    userId: "",
    token: "",
    nickname: "游客",
    avatar: "/static/images/avatar.png",
    backgroundImage: "/static/images/profile-background.jpg",
    bio: "记录生活的点滴，热爱分享☀",
    phone: "",
    gender: "unknown",
    birthday: null,
    pandaCoins: 0,
    lightningStars: 0,
    memberLevel: 1,
    createTime: null,
    lastLoginTime: null,
    followingCount: 0, // 关注数
    followersCount: 0, // 粉丝数
    likesReceivedCount: 0, // 获赞数
    medals: [],
    coupons: [],
    addresses: [],
    isLoading: false,
  };
};

// 创建响应式用户数据对象
export const userData = reactive(createDefaultUserData());

// 从服务器获取最新用户数据
export const fetchUserDataFromServer = async () => {
  if (!userData.userId) {
    return false;
  }

  try {
    // 标记数据加载中
    userData.isLoading = true;

    // 调用API获取最新用户数据
    const result = await get(
      `${API_PATHS.USER_PROFILE}?userId=${userData.userId}`
    );

    if (result.code === 200 && result.data) {
      // 将API返回的用户数据更新到响应式对象
      const serverUserData = result.data;

      // 打印服务器返回的完整用户数据

      // 如果有地址数据，单独打印出来
      if (serverUserData.addresses && serverUserData.addresses.length > 0) {
      }

      // 如果有默认地址，单独打印出来
      if (serverUserData.defaultAddress) {
      }

      // 更新基本用户信息
      Object.keys(userData).forEach((key) => {
        // 跳过userId、token、coupons、medals和isLoading属性
        if (
          key !== "userId" &&
          key !== "token" &&
          key !== "isLoading" &&
          key !== "coupons" &&
          key !== "medals"
        ) {
          userData[key] = serverUserData[key] || userData[key];
        }
      });

      // 确保特别处理关注数、粉丝数和获赞数
      userData.followingCount = serverUserData.followingCount || 0;
      userData.followersCount = serverUserData.followersCount || 0;
      userData.likesReceivedCount = serverUserData.likesReceivedCount || 0;

      // 确保处理背景图片字段
      userData.backgroundImage =
        serverUserData.backgroundImage ||
        "/static/images/profile-background.jpg";

      // 确保处理bio简介字段
      userData.bio = serverUserData.bio || "记录生活的点滴，热爱分享☀";

      // 获取用户勋章数据
      try {
        const medalsResult = await get(
          `${API_PATHS.USER_MEDALS}/${userData.userId}`
        );

        if (medalsResult.code === 200 && medalsResult.data) {
          userData.medals = medalsResult.data;
        } else {
        }
      } catch (medalsError) {}

      // 获取用户优惠券数据
      try {
        const couponsResult = await get(
          `${API_PATHS.USER_COUPONS}/${userData.userId}/with-template`
        );

        if (couponsResult.code === 200 && couponsResult.data) {
          userData.coupons = couponsResult.data;
        } else {
        }
      } catch (couponsError) {}

      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  } finally {
    userData.isLoading = false;
  }
};

// 初始化用户数据
export const initUserData = async () => {
  try {
    // 从本地存储获取用户ID和token
    const storedUserData = getUserFromStorage();

    if (storedUserData && storedUserData.userId) {
      // 设置用户ID和token
      userData.userId = storedUserData.userId;
      userData.token = storedUserData.token || "";

      // 从服务器获取最新用户数据
      await fetchUserDataFromServer();
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

// 检查用户是否已登录
export const isLoggedIn = () => {
  return !!userData.userId;
};
