"use strict";
const common_vendor = require("../../common/vendor.js");
const fetchUserOrders = async (userId) => {
  try {
    const savedOrders = common_vendor.index.getStorageSync("savedOrders") || [];
    return savedOrders;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:17", "获取用户订单失败:", error);
    throw error;
  }
};
const createOrder = async (orderData) => {
  try {
    const orderId = "ORDER" + Date.now().toString();
    const newOrder = {
      id: orderId,
      ...orderData,
      status: "pending",
      time: Date.now()
    };
    const savedOrders = common_vendor.index.getStorageSync("savedOrders") || [];
    savedOrders.unshift(newOrder);
    common_vendor.index.setStorageSync("savedOrders", savedOrders);
    return newOrder;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:47", "创建订单失败:", error);
    throw error;
  }
};
const updateOrderStatus = async (orderId, status) => {
  try {
    const savedOrders = common_vendor.index.getStorageSync("savedOrders") || [];
    const orderIndex = savedOrders.findIndex((order) => order.id === orderId);
    if (orderIndex === -1) {
      throw new Error(`未找到ID为${orderId}的订单`);
    }
    savedOrders[orderIndex].status = status;
    common_vendor.index.setStorageSync("savedOrders", savedOrders);
    return savedOrders[orderIndex];
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:76", `更新订单${orderId}状态失败:`, error);
    throw error;
  }
};
const fetchOrderById = async (orderId) => {
  try {
    const savedOrders = common_vendor.index.getStorageSync("savedOrders") || [];
    const order = savedOrders.find((item) => item.id === orderId);
    if (!order) {
      throw new Error(`未找到ID为${orderId}的订单`);
    }
    return order;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:98", `获取订单${orderId}详情失败:`, error);
    throw error;
  }
};
const cancelOrder = async (orderId) => {
  return await updateOrderStatus(orderId, "cancelled");
};
exports.cancelOrder = cancelOrder;
exports.createOrder = createOrder;
exports.fetchOrderById = fetchOrderById;
exports.fetchUserOrders = fetchUserOrders;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/orderApi.js.map
