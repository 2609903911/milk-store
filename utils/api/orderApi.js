/**
 * 订单API模块
 * 提供订单相关的API接口
 */
import { request } from "./request";
import { API_PATHS } from "./config";
import { userState } from "../userState";
import { mockApi } from "../mockApi";

/**
 * 获取用户所有订单
 * @param {String} userId 用户ID
 * @returns {Promise} 订单数据列表
 */
export const fetchUserOrders = async (userId) => {
  try {
    // 调用后端API
    const response = await request({
      url: `/api/orders/user/${userId}`,
      method: "GET",
    });

    return response.data;
  } catch (error) {
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
      method: "GET",
    });

    if (result.code === 200 && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
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
    // 调用后端API
    const response = await request({
      url: "/api/orders",
      method: "POST",
      data: orderData,
    });

    // 检查响应格式并提取订单数据
    let orderResult = null;

    if (response && response.data) {
      // 后端返回了嵌套的数据结构
      orderResult = response.data;
    } else if (response && response.code === 200) {
      // 返回了标准成功响应
      orderResult = response;
    } else if (response) {
      // 直接返回了订单数据
      orderResult = response;
    }

    // 如果没有订单ID，确保创建一个
    if (orderResult && !orderResult.orderId) {
      // 使用提交的数据生成订单ID
      orderResult.orderId = `order_${Date.now()}_${Math.floor(
        Math.random() * 10000
      )}`;
    }

    // 如果依然没有可用结果，创建一个最小订单对象
    if (!orderResult) {
      orderResult = {
        orderId: `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        ...orderData,
        createdTime: new Date().toISOString(),
      };
    }

    return orderResult;
  } catch (error) {
    // 创建一个包含必要信息的最小订单对象
    const fallbackOrder = {
      orderId: `order_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
      ...orderData,
      createdTime: new Date().toISOString(),
      error: error.message || "创建订单失败",
    };
    return fallbackOrder;
  }
};

/**
 * 根据ID获取订单详情
 * @param {String} orderId 订单ID
 * @returns {Promise} 订单详情数据
 */
export const fetchOrderById = async (orderId) => {
  try {
    // 调用后端API
    const response = await request({
      url: `/api/orders/${orderId}`,
      method: "GET",
    });

    return response.data;
  } catch (error) {
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
  try {
    // 调用后端API
    const response = await request({
      url: `/api/orders/${orderId}/cancel`,
      method: "PUT",
    });

    return response.data;
  } catch (error) {
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
      method: "PUT",
      data: { paymentMethod },
    });

    if (result.code === 200) {
      return result.data || { success: true };
    }

    throw new Error(result.message || "支付订单失败");
  } catch (error) {
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
      method: "PUT",
    });

    if (result.code === 200) {
      return result.data || { success: true };
    }

    throw new Error(result.message || "完成订单失败");
  } catch (error) {
    throw error;
  }
};

/**
 * 删除订单
 * @param {String} orderId 订单ID
 * @returns {Promise} 操作结果
 */
export const deleteOrder = async (orderId) => {
  try {
    // 调用后端API
    const response = await request({
      url: `/api/orders/${orderId}`,
      method: "DELETE",
    });

    return response.data;
  } catch (error) {
    // 使用Mock数据作为替代
    return mockApi.deleteOrder(orderId);
  }
};

// 更新优惠券使用状态
export const updateCouponUsed = async (couponId, orderId) => {
  // 确保couponId是数字
  const numericCouponId = Number(couponId);

  try {
    // 添加完整URL日志
    const apiUrl = `/api/user-coupons/${numericCouponId}/use?orderId=${encodeURIComponent(
      orderId
    )}`;

    // 调用后端API - 作为URL参数传递orderId，而不是请求体
    const response = await request({
      url: apiUrl,
      method: "PUT",
    });

    return response.data || response;
  } catch (error) {
    // 捕获错误但不抛出，让流程继续
    return { success: false, message: error.message };
  }
};

// 获取优惠券详情
export const getCouponById = async (couponId) => {
  try {
    // 调用后端API
    const response = await request({
      url: `/api/user-coupons/${couponId}`,
      method: "GET",
    });

    return response.data;
  } catch (error) {
    return null;
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
    orderStatus: "pending", // 初始状态为待支付
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
    updateTime: Date.now(),
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
  const userOrders = allOrders.filter((order) => order.userId === userId);

  // 按创建时间倒序排序
  userOrders.sort((a, b) => b.createTime - a.createTime);

  return userOrders;
};

// Mock - 获取订单详情
const mockGetOrderById = (orderId) => {
  // 从localStorage获取所有订单
  const allOrders = mockApi.getAllOrdersFromStorage();

  // 查找指定订单
  const order = allOrders.find((order) => order.orderId === orderId);

  return order || null;
};

// Mock - 取消订单
const mockCancelOrder = (orderId) => {
  // 从localStorage获取所有订单
  const allOrders = mockApi.getAllOrdersFromStorage();

  // 查找指定订单索引
  const orderIndex = allOrders.findIndex((order) => order.orderId === orderId);

  if (orderIndex !== -1) {
    // 更新订单状态
    allOrders[orderIndex].orderStatus = "cancelled";
    allOrders[orderIndex].updateTime = Date.now();

    // 保存更新后的订单列表
    mockApi.saveAllOrdersToStorage(allOrders);

    return true;
  }

  return false;
};

// Mock - 删除订单
const mockDeleteOrder = (orderId) => {
  // 从localStorage获取所有订单
  const allOrders = mockApi.getAllOrdersFromStorage();

  // 查找指定订单索引
  const orderIndex = allOrders.findIndex((order) => order.orderId === orderId);

  if (orderIndex !== -1) {
    // 从数组中移除订单
    allOrders.splice(orderIndex, 1);

    // 保存更新后的订单列表
    mockApi.saveAllOrdersToStorage(allOrders);

    return true;
  }

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
    const ordersStr = localStorage.getItem("milkstore_orders");
    return ordersStr ? JSON.parse(ordersStr) : [];
  } catch (error) {
    return [];
  }
};

// 辅助函数 - 将所有订单保存到localStorage
const saveAllOrdersToStorage = (orders) => {
  try {
    localStorage.setItem("milkstore_orders", JSON.stringify(orders));
  } catch (error) {}
};
