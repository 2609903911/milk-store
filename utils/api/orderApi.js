// 订单API服务

import { get, post, put } from './request';
import { API_PATHS } from './config';

/**
 * 获取用户所有订单
 * @param {String} userId 用户ID
 * @returns {Promise} 订单数据列表
 */
export const fetchUserOrders = async (userId) => {
  try {
    // 目前使用本地存储，实际项目中应该请求服务器API
    const savedOrders = uni.getStorageSync('savedOrders') || [];
    return savedOrders;
  } catch (error) {
    console.error('获取用户订单失败:', error);
    throw error;
  }
};

/**
 * 创建订单
 * @param {Object} orderData 订单数据
 * @returns {Promise} 创建的订单数据
 */
export const createOrder = async (orderData) => {
  try {
    // 创建订单ID
    const orderId = 'ORDER' + Date.now().toString();
    const newOrder = {
      id: orderId,
      ...orderData,
      status: 'pending',
      time: Date.now()
    };
    
    // 获取现有订单并添加新订单
    const savedOrders = uni.getStorageSync('savedOrders') || [];
    savedOrders.unshift(newOrder);
    
    // 保存到本地存储
    uni.setStorageSync('savedOrders', savedOrders);
    
    return newOrder;
  } catch (error) {
    console.error('创建订单失败:', error);
    throw error;
  }
};

/**
 * 更新订单状态
 * @param {String} orderId 订单ID
 * @param {String} status 订单新状态
 * @returns {Promise} 更新后的订单数据
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    // 获取现有订单
    const savedOrders = uni.getStorageSync('savedOrders') || [];
    const orderIndex = savedOrders.findIndex(order => order.id === orderId);
    
    if (orderIndex === -1) {
      throw new Error(`未找到ID为${orderId}的订单`);
    }
    
    // 更新订单状态
    savedOrders[orderIndex].status = status;
    
    // 保存更新后的订单
    uni.setStorageSync('savedOrders', savedOrders);
    
    return savedOrders[orderIndex];
  } catch (error) {
    console.error(`更新订单${orderId}状态失败:`, error);
    throw error;
  }
};

/**
 * 根据ID获取订单详情
 * @param {String} orderId 订单ID
 * @returns {Promise} 订单详情数据
 */
export const fetchOrderById = async (orderId) => {
  try {
    // 获取所有订单
    const savedOrders = uni.getStorageSync('savedOrders') || [];
    const order = savedOrders.find(item => item.id === orderId);
    
    if (!order) {
      throw new Error(`未找到ID为${orderId}的订单`);
    }
    
    return order;
  } catch (error) {
    console.error(`获取订单${orderId}详情失败:`, error);
    throw error;
  }
};

/**
 * 取消订单
 * @param {String} orderId 订单ID
 * @returns {Promise} 更新后的订单数据
 */
export const cancelOrder = async (orderId) => {
  return await updateOrderStatus(orderId, 'cancelled');
};

/**
 * 完成订单
 * @param {String} orderId 订单ID
 * @returns {Promise} 更新后的订单数据
 */
export const completeOrder = async (orderId) => {
  return await updateOrderStatus(orderId, 'completed');
}; 