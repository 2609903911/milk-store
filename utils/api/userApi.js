import { request } from '../request'

/**
 * 获取用户资料信息
 * @param {string} userId 用户ID
 * @returns {Promise<Object>} 用户资料信息
 */
export const getUserProfile = (userId) => {
  return request({
    url: `/api/user/profile-info?userId=${userId}`,
    method: 'GET'
  })
} 