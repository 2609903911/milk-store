/**
 * 订单API模块
 * 提供订单相关的API接口
 */
import { request } from './request';
import { API_PATHS } from './config';
import { userState } from '../userState';
import { mockApi } from '../mockApi';

/**
 * 获取用户所有订单
 * @param {String} userId 用户ID
 * @returns {Promise} 订单数据列表
 */
export const fetchUserOrders = async (userId) => {
  console.log('调用fetchUserOrders API, userId:', userId);
  try {
    // 调用后端API
    const response = await request({
      url: `/api/orders/user/${userId}`,
      method: 'GET'
    });
    
    return response.data;
  } catch (error) {
    console.error('获取用户订单API错误:', error);
    // 使用Mock数据作为替代
    return mockApi.getUserOrders(userId);
  }
};

/**
 * 获取用户特定状态的订单
 * @param {String} userId 用户ID
 * @param {String} status 订单状态
 * @returns {Promise} 订单数据列表
 */
export const fetchUserOrdersByStatus = async (userId, status) => {
  try {
    const result = await request({
      url: `${API_PATHS.ORDERS_BY_USER}/${userId}/status/${status}`,
      method: 'GET'
    });
    
    if (result.code === 200 && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error(`获取用户${status}状态订单失败:`, error);
    throw error;
  }
};

/**
 * 创建订单
 * @param {Object} orderData 订单数据
 * @returns {Promise} 创建的订单数据
 */
export const createOrder = async (orderData) => {
  console.log('调用createOrder API:', orderData);
  try {
    // 调用后端API
    const response = await request({
      url: '/api/orders',
      method: 'POST',
      data: orderData
    });
    
    return response.data;
  } catch (error) {
    console.error('创建订单API错误:', error);
    // 使用Mock数据作为替代
    return mockApi.createOrder(orderData);
  }
};

/**
 * 根据ID获取订单详情
 * @param {String} orderId 订单ID
 * @returns {Promise} 订单详情数据
 */
export const fetchOrderById = async (orderId) => {
  console.log('调用fetchOrderById API, orderId:', orderId);
  try {
    // 调用后端API
    const response = await request({
      url: `/api/orders/${orderId}`,
      method: 'GET'
    });
    
    return response.data;
  } catch (error) {
    console.error('获取订单详情API错误:', error);
    // 使用Mock数据作为替代
    return mockApi.getOrderById(orderId);
  }
};

/**
 * 取消订单
 * @param {String} orderId 订单ID
 * @returns {Promise} 操作结果
 */
export const cancelOrder = async (orderId) => {
  console.log('调用cancelOrder API, orderId:', orderId);
  try {
    // 调用后端API
    const response = await request({
      url: `/api/orders/${orderId}/cancel`,
      method: 'PUT'
    });
    
    return response.data;
  } catch (error) {
    console.error('取消订单API错误:', error);
    // 使用Mock数据作为替代
    return mockApi.cancelOrder(orderId);
  }
};

/**
 * 支付订单
 * @param {String} orderId 订单ID
 * @param {String} paymentMethod 支付方式
 * @returns {Promise} 操作结果
 */
export const payOrder = async (orderId, paymentMethod) => {
  try {
    const result = await request({
      url: `${API_PATHS.ORDER_BY_ID}/${orderId}/pay`,
      method: 'PUT',
      data: { paymentMethod }
    });
    
    if (result.code === 200) {
      return result.data || { success: true };
    }
    
    throw new Error(result.message || '支付订单失败');
  } catch (error) {
    console.error(`支付订单${orderId}失败:`, error);
    throw error;
  }
};

/**
 * 完成订单
 * @param {String} orderId 订单ID
 * @returns {Promise} 操作结果
 */
export const completeOrder = async (orderId) => {
  try {
    const result = await request({
      url: `${API_PATHS.ORDER_BY_ID}/${orderId}/complete`,
      method: 'PUT'
    });
    
    if (result.code === 200) {
      return result.data || { success: true };
    }
    
    throw new Error(result.message || '完成订单失败');
  } catch (error) {
    console.error(`完成订单${orderId}失败:`, error);
    throw error;
  }
};

/**
 * 删除订单
 * @param {String} orderId 订单ID
 * @returns {Promise} 操作结果
 */
export const deleteOrder = async (orderId) => {
  console.log('调用deleteOrder API, orderId:', orderId);
  try {
    // 调用后端API
    const response = await request({
      url: `/api/orders/${orderId}`,
      method: 'DELETE'
    });
    
    return response.data;
  } catch (error) {
    console.error('删除订单API错误:', error);
    // 使用Mock数据作为替代
    return mockApi.deleteOrder(orderId);
  }
};

// Mock数据函数实现
// -------------------------------

// Mock - 创建订单
const mockCreateOrder = (orderData) => {
  // 生成订单ID
  const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // 创建订单记录
  const order = {
    orderId: orderId,
    userId: orderData.userId,
    orderStatus: 'pending', // 初始状态为待支付
    totalAmount: orderData.totalAmount,
    discountAmount: orderData.discountAmount,
    actualAmount: orderData.actualAmount,
    couponId: orderData.couponId,
    deliveryType: orderData.deliveryType,
    storeName: orderData.storeName,
    storeAddress: orderData.storeAddress,
    contactName: orderData.contactName,
    contactPhone: orderData.contactPhone,
    deliveryAddress: orderData.deliveryAddress,
    orderItems: orderData.orderItems,
    createTime: Date.now(),
    updateTime: Date.now()
  };
  
  // 保存到localStorage
  mockApi.saveOrderToStorage(order);
  
  return order;
};

// Mock - 获取用户订单列表
const mockGetUserOrders = (userId) => {
  // 从localStorage获取所有订单
  const allOrders = mockApi.getAllOrdersFromStorage();
  
  // 过滤出当前用户的订单
  const userOrders = allOrders.filter(order => order.userId === userId);
  
  // 按创建时间倒序排序
  userOrders.sort((a, b) => b.createTime - a.createTime);
  
  console.log('Mock获取用户订单:', userOrders);
  return userOrders;
};

// Mock - 获取订单详情
const mockGetOrderById = (orderId) => {
  // 从localStorage获取所有订单
  const allOrders = mockApi.getAllOrdersFromStorage();
  
  // 查找指定订单
  const order = allOrders.find(order => order.orderId === orderId);
  
  console.log('Mock获取订单详情:', order);
  return order || null;
};

// Mock - 取消订单
const mockCancelOrder = (orderId) => {
  // 从localStorage获取所有订单
  const allOrders = mockApi.getAllOrdersFromStorage();
  
  // 查找指定订单索引
  const orderIndex = allOrders.findIndex(order => order.orderId === orderId);
  
  if (orderIndex !== -1) {
    // 更新订单状态
    allOrders[orderIndex].orderStatus = 'cancelled';
    allOrders[orderIndex].updateTime = Date.now();
    
    // 保存更新后的订单列表
    mockApi.saveAllOrdersToStorage(allOrders);
    
    console.log('Mock取消订单成功:', orderId);
    return true;
  }
  
  console.log('Mock取消订单失败: 订单不存在', orderId);
  return false;
};

// Mock - 删除订单
const mockDeleteOrder = (orderId) => {
  // 从localStorage获取所有订单
  const allOrders = mockApi.getAllOrdersFromStorage();
  
  // 查找指定订单索引
  const orderIndex = allOrders.findIndex(order => order.orderId === orderId);
  
  if (orderIndex !== -1) {
    // 从数组中移除订单
    allOrders.splice(orderIndex, 1);
    
    // 保存更新后的订单列表
    mockApi.saveAllOrdersToStorage(allOrders);
    
    console.log('Mock删除订单成功:', orderId);
    return true;
  }
  
  console.log('Mock删除订单失败: 订单不存在', orderId);
  return false;
};

// 辅助函数 - 将订单保存到localStorage
const saveOrderToStorage = (order) => {
  // 获取现有订单列表
  const orders = mockApi.getAllOrdersFromStorage();
  
  // 添加新订单
  orders.push(order);
  
  // 保存到localStorage
  mockApi.saveAllOrdersToStorage(orders);
};

// 辅助函数 - 从localStorage获取所有订单
const getAllOrdersFromStorage = () => {
  try {
    const ordersStr = localStorage.getItem('milkstore_orders');
    return ordersStr ? JSON.parse(ordersStr) : [];
  } catch (error) {
    console.error('解析订单数据失败:', error);
    return [];
  }
};

// 辅助函数 - 将所有订单保存到localStorage
const saveAllOrdersToStorage = (orders) => {
  try {
    localStorage.setItem('milkstore_orders', JSON.stringify(orders));
  } catch (error) {
    console.error('保存订单数据失败:', error);
  }
}; 