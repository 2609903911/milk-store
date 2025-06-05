/**
 * 用户服务模块
 * 提供用户登录、注册、信息管理等业务功能
 */
import {
  saveUserToStorage,
  getUserFromStorage,
  clearUserStorage,
} from "./api/authApi";
import {
  createDefaultUserInfo,
  validateUserInfo,
  mergeWithDefaultUserInfo,
} from "./userModel";
import { userState, updateUserState, resetUserState } from "./userState";
import { post, get } from "./api/request"; // 导入请求方法
import { API_PATHS } from "./api/config"; // 导入API路径配置

/**
 * 生成唯一用户ID
 * @returns {String} 唯一ID
 */
const generateUserId = () => {
  return "user_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
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
      return { success: false, message: "手机号不能为空" };
    }

    // 创建用户信息
    const userId = generateUserId();
    const newUser = mergeWithDefaultUserInfo({
      ...userInfo,
      userId,
      createTime: Date.now(),
      lastLoginTime: Date.now(),
    });

    // 只保存用户ID到本地
    const saved = saveUserToStorage({ userId: newUser.userId }, "");
    if (!saved) {
      return { success: false, message: "用户ID保存失败" };
    }

    // 更新全局用户状态
    updateUserState(newUser);

    return { success: true, userInfo: newUser };
  } catch (error) {
    return { success: false, message: "注册过程中发生错误" };
  }
};

/**
 * 用户登录
 * @param {String} phone - 手机号
 * @param {String} code - 验证码（本地模拟，实际应使用服务端验证）
 * @returns {Object} 包含成功状态和用户信息的对象
 */
export const loginUser = (phone, code = "000000") => {
  try {
    // 模拟登录验证
    if (!phone) {
      return { success: false, message: "手机号不能为空" };
    }

    // 本地验证码固定为000000（实际应使用服务端验证）
    if (code !== "000000" && !phone.startsWith("guest_")) {
      return { success: false, message: "验证码错误" };
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
    return { success: false, message: "登录过程中发生错误" };
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
    if (!profileInfo || typeof profileInfo !== "object") {
      return { success: false, message: "无效的个人资料" };
    }

    // 获取当前用户信息
    const currentUser = getUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      return { success: false, message: "用户未登录" };
    }

    // 更新个人资料（仅允许更新特定字段）
    const allowedFields = ["nickname", "avatar", "gender", "birthday"];
    const updateFields = {};

    allowedFields.forEach((field) => {
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
    return { success: false, message: "更新过程中发生错误" };
  }
};

/**
 * 添加熊猫币
 * @param {Number} amount - 要添加的熊猫币数量
 * @returns {Object} 包含成功状态和更新后用户信息的对象
 */
export const addPandaCoins = (amount) => {
  try {
    if (typeof amount !== "number" || amount <= 0) {
      return { success: false, message: "无效的熊猫币数量" };
    }

    // 获取当前用户信息
    const currentUser = getUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      return { success: false, message: "用户未登录" };
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
        pandaCoins: newCoins,
      },
    };
  } catch (error) {
    return { success: false, message: "操作过程中发生错误" };
  }
};

/**
 * 上传用户背景图片
 * @param {Object} options - 上传选项
 * @param {String} options.filePath - 本地文件路径
 * @param {String} options.userId - 用户ID
 * @returns {Promise} 包含上传结果的Promise
 *
 * 注意：后端应返回完整的URL（带http前缀），如：http://localhost:8082/uploads/post-background/image.jpg
 */
export const uploadBackgroundImage = (options) => {
  return new Promise((resolve, reject) => {
    if (!options || !options.filePath) {
      reject(new Error("文件路径不能为空"));
      return;
    }

    const currentUser = getUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      reject(new Error("用户未登录"));
      return;
    }

    const userId = options.userId || currentUser.userId;

    // 使用uni.uploadFile上传文件
    uni.uploadFile({
      url: "/api/user/upload-background", // 上传背景图片的API端点
      filePath: options.filePath,
      name: "backgroundFile",
      formData: {
        userId: userId,
      },
      success: (uploadRes) => {
        try {
          // 解析响应数据
          const result = JSON.parse(uploadRes.data);

          if (result.code === 200 && result.data && result.data.backgroundUrl) {
            // 检查返回的URL格式
            const backgroundUrl = result.data.backgroundUrl;

            // 上传成功后，更新背景URL
            updateUserState({ backgroundImage: backgroundUrl });
            resolve(result);
          } else {
            reject(new Error(result.message || "上传失败"));
          }
        } catch (parseError) {
          reject(new Error("解析响应数据失败"));
        }
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};

/**
 * 更新用户背景图片URL
 * @param {String} backgroundUrl - 完整的背景图片URL
 * @param {String} userId - 用户ID
 * @returns {Promise<Object>} 更新结果
 */
export const updateBackgroundUrl = async (backgroundUrl, userId) => {
  try {
    // 构建请求数据
    const requestData = {
      userId: userId,
      backgroundImage: backgroundUrl, // 使用完整URL
    };

    // 发送更新请求
    const response = await post("/api/user/update-background", requestData);

    if (
      response &&
      (response.code === 200 || (response.data && response.data.code === 200))
    ) {
      return {
        success: true,
        data: response.data || response,
      };
    } else {
      return {
        success: false,
        message: (response && response.message) || "更新背景URL失败",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || "网络错误，请稍后再试",
    };
  }
};

/**
 * 更新用户简介
 * @param {String} bio - 新的用户简介
 * @param {String} userId - 用户ID(可选，默认为当前用户)
 * @returns {Promise} 包含更新结果的Promise
 */
export const updateUserBio = async (bio, userId) => {
  try {
    // 获取当前用户信息
    const currentUser = getUserFromStorage();
    if (!currentUser || !currentUser.userId) {
      return { success: false, message: "用户未登录" };
    }

    const targetUserId = userId || currentUser.userId;

    // 调用API更新用户简介
    const response = await post("/api/user/update-bio", {
      userId: targetUserId,
      bio: bio,
    });

    if (response && response.code === 200) {
      // 更新全局用户状态
      updateUserState({ bio: bio });

      return {
        success: true,
        message: "简介更新成功",
        data: { bio },
      };
    } else {
      return {
        success: false,
        message: response?.message || "简介更新失败",
      };
    }
  } catch (error) {
    return { success: false, message: "更新简介过程中发生错误" };
  }
};
