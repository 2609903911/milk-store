import { request } from "./request";

/**
 * 关注用户
 * @param {string} followedId 被关注用户ID
 * @returns {Promise<Object>} 关注结果
 */
export const followUser = (followedId) => {
  const currentUser = uni.getStorageSync("userInfo");
  const follower_id = currentUser?.userId;

  // 检查follower_id是否存在
  if (!follower_id) {
    return Promise.reject(new Error("未登录或用户ID不存在"));
  }

  // 直接在URL中添加follower_id参数
  return request({
    url: `/api/follow/${followedId}?follower_id=${encodeURIComponent(
      follower_id
    )}`,
    method: "POST",
  });
};

/**
 * 取消关注
 * @param {string} followedId 被关注用户ID
 * @returns {Promise<Object>} 取消关注结果
 */
export const unfollowUser = (followedId) => {
  const currentUser = uni.getStorageSync("userInfo");
  const follower_id = currentUser?.userId;

  // 检查follower_id是否存在
  if (!follower_id) {
    return Promise.reject(new Error("未登录或用户ID不存在"));
  }

  // 直接在URL中添加follower_id参数
  return request({
    url: `/api/follow/${followedId}?follower_id=${encodeURIComponent(
      follower_id
    )}`,
    method: "DELETE",
  });
};

/**
 * 检查关注状态
 * @param {string} followedId 被关注用户ID
 * @returns {Promise<Object>} 关注状态
 */
export const checkFollowStatus = (followedId) => {
  const currentUser = uni.getStorageSync("userInfo");
  const follower_id = currentUser?.userId;

  // 检查follower_id是否存在
  if (!follower_id) {
    return Promise.reject(new Error("未登录或用户ID不存在"));
  }

  // 直接在URL中添加follower_id参数
  return request({
    url: `/api/follow/check/${followedId}?follower_id=${encodeURIComponent(
      follower_id
    )}`,
    method: "GET",
  });
};

/**
 * 批量检查关注状态
 * @param {Array<string>} followedIds 被关注用户ID列表
 * @returns {Promise<Object>} 批量关注状态
 */
export const batchCheckFollowStatus = (followedIds) => {
  const currentUser = uni.getStorageSync("userInfo");
  const follower_id = currentUser?.userId;

  // 检查follower_id是否存在
  if (!follower_id) {
    return Promise.reject(new Error("未登录或用户ID不存在"));
  }

  // 直接在URL中添加follower_id参数
  return request({
    url: `/api/follow/check/batch?follower_id=${encodeURIComponent(
      follower_id
    )}`,
    method: "POST",
    data: followedIds,
  });
};

/**
 * 获取用户关注列表
 * @param {string} userId 用户ID
 * @param {number} page 页码（默认1）
 * @param {number} size 每页数量（默认10）
 * @returns {Promise<Object>} 用户关注列表
 */
export const getUserFollowing = (userId, page = 1, size = 10) => {
  const currentUser = uni.getStorageSync("userInfo");
  const current_user_id = currentUser?.userId;

  // 构建URL查询参数
  let url = `/api/follow/following/${userId}?page=${page}&size=${size}`;
  if (current_user_id) {
    url += `&current_user_id=${encodeURIComponent(current_user_id)}`;
  }

  return request({
    url,
    method: "GET",
  });
};

/**
 * 获取用户粉丝列表
 * @param {string} userId 用户ID
 * @param {number} page 页码（默认1）
 * @param {number} size 每页数量（默认10）
 * @returns {Promise<Object>} 用户粉丝列表
 */
export const getUserFollowers = (userId, page = 1, size = 10) => {
  const currentUser = uni.getStorageSync("userInfo");
  const current_user_id = currentUser?.userId;

  // 构建URL查询参数
  let url = `/api/follow/followers/${userId}?page=${page}&size=${size}`;
  if (current_user_id) {
    url += `&current_user_id=${encodeURIComponent(current_user_id)}`;
  }

  return request({
    url,
    method: "GET",
  });
};
