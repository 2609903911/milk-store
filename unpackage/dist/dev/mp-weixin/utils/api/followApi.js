"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_request = require("./request.js");
const followUser = (followedId) => {
  const currentUser = common_vendor.index.getStorageSync("userInfo");
  const follower_id = currentUser == null ? void 0 : currentUser.userId;
  if (!follower_id) {
    return Promise.reject(new Error("未登录或用户ID不存在"));
  }
  return utils_api_request.request({
    url: `/api/follow/${followedId}?follower_id=${encodeURIComponent(
      follower_id
    )}`,
    method: "POST"
  });
};
const unfollowUser = (followedId) => {
  const currentUser = common_vendor.index.getStorageSync("userInfo");
  const follower_id = currentUser == null ? void 0 : currentUser.userId;
  if (!follower_id) {
    return Promise.reject(new Error("未登录或用户ID不存在"));
  }
  return utils_api_request.request({
    url: `/api/follow/${followedId}?follower_id=${encodeURIComponent(
      follower_id
    )}`,
    method: "DELETE"
  });
};
const checkFollowStatus = (followedId) => {
  const currentUser = common_vendor.index.getStorageSync("userInfo");
  const follower_id = currentUser == null ? void 0 : currentUser.userId;
  if (!follower_id) {
    return Promise.reject(new Error("未登录或用户ID不存在"));
  }
  return utils_api_request.request({
    url: `/api/follow/check/${followedId}?follower_id=${encodeURIComponent(
      follower_id
    )}`,
    method: "GET"
  });
};
const batchCheckFollowStatus = (followedIds) => {
  const currentUser = common_vendor.index.getStorageSync("userInfo");
  const follower_id = currentUser == null ? void 0 : currentUser.userId;
  if (!follower_id) {
    return Promise.reject(new Error("未登录或用户ID不存在"));
  }
  return utils_api_request.request({
    url: `/api/follow/check/batch?follower_id=${encodeURIComponent(
      follower_id
    )}`,
    method: "POST",
    data: followedIds
  });
};
const getUserFollowing = (userId, page = 1, size = 10) => {
  const currentUser = common_vendor.index.getStorageSync("userInfo");
  const current_user_id = currentUser == null ? void 0 : currentUser.userId;
  let url = `/api/follow/following/${userId}?page=${page}&size=${size}`;
  if (current_user_id) {
    url += `&current_user_id=${encodeURIComponent(current_user_id)}`;
  }
  return utils_api_request.request({
    url,
    method: "GET"
  });
};
const getUserFollowers = (userId, page = 1, size = 10) => {
  const currentUser = common_vendor.index.getStorageSync("userInfo");
  const current_user_id = currentUser == null ? void 0 : currentUser.userId;
  let url = `/api/follow/followers/${userId}?page=${page}&size=${size}`;
  if (current_user_id) {
    url += `&current_user_id=${encodeURIComponent(current_user_id)}`;
  }
  return utils_api_request.request({
    url,
    method: "GET"
  });
};
const followApi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  batchCheckFollowStatus,
  checkFollowStatus,
  followUser,
  getUserFollowers,
  getUserFollowing,
  unfollowUser
}, Symbol.toStringTag, { value: "Module" }));
exports.checkFollowStatus = checkFollowStatus;
exports.followApi = followApi;
exports.followUser = followUser;
exports.unfollowUser = unfollowUser;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/followApi.js.map
