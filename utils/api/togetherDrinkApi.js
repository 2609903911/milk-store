import { request } from '../request'

/**
 * 创建邀请
 * @param {Object} data 请求数据
 * @param {string} data.userId 创建者用户ID
 * @param {string|number} data.productId 产品ID
 * @param {string} data.productName 产品名称
 * @param {string} data.productImage 产品图片
 * @param {number} data.productPrice 产品价格
 * @param {number} data.participantsLimit 参与人数限制
 * @param {string} [data.expireTime] 过期时间（可选）
 * @returns {Promise<Object>} 返回创建的邀请信息，包含invitationId和inviteCode
 */
export const createInvitation = (data) => {
  console.log('【创建邀请】请求数据:', JSON.stringify(data, null, 2))
  return request({
    url: '/api/together-drink/invitations',
    method: 'POST',
    data
  }).then(response => {
    console.log('【创建邀请】成功响应:', JSON.stringify(response, null, 2))
    return response
  }).catch(error => {
    console.error('【创建邀请】错误响应:', error)
    throw error
  })
}

/**
 * 获取邀请详情
 * @param {string} invitationId 邀请ID
 * @returns {Promise<Object>} 邀请详情
 */
export const getInvitationById = (invitationId) => {
  return request({
    url: `/api/together-drink/invitations/${invitationId}`,
    method: 'GET'
  })
}

/**
 * 通过邀请码获取邀请详情
 * @param {string} inviteCode 邀请码
 * @returns {Promise<Object>} 邀请详情
 */
export const getInvitationByCode = (inviteCode) => {
  return request({
    url: `/api/together-drink/invitations/code/${inviteCode}`,
    method: 'GET'
  })
}

/**
 * 加入邀请
 * @param {string} invitationId 邀请ID
 * @param {Object} data 请求数据
 * @param {string} data.userId 参与者用户ID
 * @returns {Promise<Object>} 加入结果
 */
export const joinInvitation = (invitationId, data) => {
  console.log('【加入邀请】开始请求，邀请ID:', invitationId, '请求数据:', JSON.stringify(data))
  return request({
    url: `/api/together-drink/invitations/${invitationId}/join`,
    method: 'POST',
    data,
    loading: true,
    loadingText: '正在加入邀请...'
  }).then(response => {
    console.log('【加入邀请】成功响应:', JSON.stringify(response))
    return response
  }).catch(error => {
    console.error('【加入邀请】请求失败:', error)
    throw error
  })
}

/**
 * 取消邀请
 * @param {string} invitationId 邀请ID
 * @param {Object} data 请求数据
 * @param {string} data.userId 取消者用户ID（必须是创建者）
 * @returns {Promise<Object>} 取消结果
 */
export const cancelInvitation = (invitationId, data) => {
  return request({
    url: `/api/together-drink/invitations/${invitationId}/cancel`,
    method: 'PUT',
    data
  })
}

/**
 * 完成邀请并创建订单
 * @param {string} invitationId 邀请ID
 * @param {Object} data 请求数据
 * @param {string} data.orderAddress 订单配送地址
 * @returns {Promise<Object>} 创建的订单信息
 */
export const completeInvitation = (invitationId, data) => {
  return request({
    url: `/api/together-drink/invitations/${invitationId}/complete`,
    method: 'POST',
    data
  })
}

/**
 * 获取用户参与的邀请
 * @param {string} userId 用户ID
 * @returns {Promise<Array>} 用户参与的邀请列表
 */
export const getUserInvitations = (userId) => {
  return request({
    url: `/api/together-drink/invitations/user/${userId}`,
    method: 'GET'
  })
} 