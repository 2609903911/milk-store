"use strict";
const common_vendor = require("../common/vendor.js");
const mockApi = {
  /**
   * 创建订单
   * @param {Object} orderData 订单数据
   * @returns {Object} 创建的订单
   */
  createOrder(orderData) {
    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1e3)}`;
    const order = {
      orderId,
      userId: orderData.userId,
      orderStatus: "pending",
      // 初始状态为待支付
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
    this.saveOrderToStorage(order);
    common_vendor.index.__f__("log", "at utils/mockApi.js:38", "Mock API - 创建订单成功:", order);
    return order;
  },
  /**
   * 获取用户订单列表
   * @param {string} userId 用户ID
   * @returns {Array} 用户订单列表
   */
  getUserOrders(userId) {
    const allOrders = this.getAllOrdersFromStorage();
    const userOrders = allOrders.filter((order) => order.userId === userId);
    userOrders.sort((a, b) => b.createTime - a.createTime);
    common_vendor.index.__f__("log", "at utils/mockApi.js:57", "Mock API - 获取用户订单:", userOrders.length, "条记录");
    return userOrders;
  },
  /**
   * 获取订单详情
   * @param {string} orderId 订单ID
   * @returns {Object|null} 订单详情
   */
  getOrderById(orderId) {
    const allOrders = this.getAllOrdersFromStorage();
    const order = allOrders.find((order2) => order2.orderId === orderId);
    common_vendor.index.__f__("log", "at utils/mockApi.js:73", "Mock API - 获取订单详情:", order ? "成功" : "未找到");
    return order || null;
  },
  /**
   * 取消订单
   * @param {string} orderId 订单ID
   * @returns {boolean} 操作结果
   */
  cancelOrder(orderId) {
    const allOrders = this.getAllOrdersFromStorage();
    const orderIndex = allOrders.findIndex((order) => order.orderId === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].orderStatus = "cancelled";
      allOrders[orderIndex].updateTime = Date.now();
      this.saveAllOrdersToStorage(allOrders);
      common_vendor.index.__f__("log", "at utils/mockApi.js:97", "Mock API - 取消订单成功:", orderId);
      return true;
    }
    common_vendor.index.__f__("log", "at utils/mockApi.js:101", "Mock API - 取消订单失败: 订单不存在", orderId);
    return false;
  },
  /**
   * 删除订单
   * @param {string} orderId 订单ID
   * @returns {boolean} 操作结果
   */
  deleteOrder(orderId) {
    const allOrders = this.getAllOrdersFromStorage();
    const orderIndex = allOrders.findIndex((order) => order.orderId === orderId);
    if (orderIndex !== -1) {
      allOrders.splice(orderIndex, 1);
      this.saveAllOrdersToStorage(allOrders);
      common_vendor.index.__f__("log", "at utils/mockApi.js:124", "Mock API - 删除订单成功:", orderId);
      return true;
    }
    common_vendor.index.__f__("log", "at utils/mockApi.js:128", "Mock API - 删除订单失败: 订单不存在", orderId);
    return false;
  },
  /**
   * 将订单保存到localStorage
   * @param {Object} order 订单对象
   */
  saveOrderToStorage(order) {
    const orders = this.getAllOrdersFromStorage();
    orders.push(order);
    this.saveAllOrdersToStorage(orders);
  },
  /**
   * 从localStorage获取所有订单
   * @returns {Array} 订单列表
   */
  getAllOrdersFromStorage() {
    try {
      const ordersStr = localStorage.getItem("milkstore_orders");
      return ordersStr ? JSON.parse(ordersStr) : [];
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/mockApi.js:156", "解析订单数据失败:", error);
      return [];
    }
  },
  /**
   * 将所有订单保存到localStorage
   * @param {Array} orders 订单列表
   */
  saveAllOrdersToStorage(orders) {
    try {
      localStorage.setItem("milkstore_orders", JSON.stringify(orders));
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/mockApi.js:169", "保存订单数据失败:", error);
    }
  },
  /**
   * 根据orderId支付订单（修改状态为 paid）
   * @param {string} orderId 订单ID
   * @returns {boolean} 操作结果
   */
  payOrder(orderId) {
    const allOrders = this.getAllOrdersFromStorage();
    const orderIndex = allOrders.findIndex((order) => order.orderId === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].orderStatus = "paid";
      allOrders[orderIndex].updateTime = Date.now();
      allOrders[orderIndex].payTime = Date.now();
      this.saveAllOrdersToStorage(allOrders);
      common_vendor.index.__f__("log", "at utils/mockApi.js:194", "Mock API - 支付订单成功:", orderId);
      return true;
    }
    common_vendor.index.__f__("log", "at utils/mockApi.js:198", "Mock API - 支付订单失败: 订单不存在", orderId);
    return false;
  },
  /**
   * 完成订单（修改状态为 completed）
   * @param {string} orderId 订单ID
   * @returns {boolean} 操作结果
   */
  completeOrder(orderId) {
    const allOrders = this.getAllOrdersFromStorage();
    const orderIndex = allOrders.findIndex((order) => order.orderId === orderId);
    if (orderIndex !== -1) {
      allOrders[orderIndex].orderStatus = "completed";
      allOrders[orderIndex].updateTime = Date.now();
      allOrders[orderIndex].completeTime = Date.now();
      this.saveAllOrdersToStorage(allOrders);
      common_vendor.index.__f__("log", "at utils/mockApi.js:223", "Mock API - 完成订单成功:", orderId);
      return true;
    }
    common_vendor.index.__f__("log", "at utils/mockApi.js:227", "Mock API - 完成订单失败: 订单不存在", orderId);
    return false;
  }
};
exports.mockApi = mockApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/mockApi.js.map
