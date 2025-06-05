/**
 * Mock API - 用于在没有后端服务时模拟API请求
 */

export const mockApi = {
  /**
   * 创建订单
   * @param {Object} orderData 订单数据
   * @returns {Object} 创建的订单
   */
  createOrder(orderData) {
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
    this.saveOrderToStorage(order);

    return order;
  },

  /**
   * 获取用户订单列表
   * @param {string} userId 用户ID
   * @returns {Array} 用户订单列表
   */
  getUserOrders(userId) {
    // 从localStorage获取所有订单
    const allOrders = this.getAllOrdersFromStorage();

    // 过滤出当前用户的订单
    const userOrders = allOrders.filter((order) => order.userId === userId);

    // 按创建时间倒序排序
    userOrders.sort((a, b) => b.createTime - a.createTime);

    return userOrders;
  },

  /**
   * 获取订单详情
   * @param {string} orderId 订单ID
   * @returns {Object|null} 订单详情
   */
  getOrderById(orderId) {
    // 从localStorage获取所有订单
    const allOrders = this.getAllOrdersFromStorage();

    // 查找指定订单
    const order = allOrders.find((order) => order.orderId === orderId);

    return order || null;
  },

  /**
   * 取消订单
   * @param {string} orderId 订单ID
   * @returns {boolean} 操作结果
   */
  cancelOrder(orderId) {
    // 从localStorage获取所有订单
    const allOrders = this.getAllOrdersFromStorage();

    // 查找指定订单索引
    const orderIndex = allOrders.findIndex(
      (order) => order.orderId === orderId
    );

    if (orderIndex !== -1) {
      // 更新订单状态
      allOrders[orderIndex].orderStatus = "cancelled";
      allOrders[orderIndex].updateTime = Date.now();

      // 保存更新后的订单列表
      this.saveAllOrdersToStorage(allOrders);

      return true;
    }

    return false;
  },

  /**
   * 删除订单
   * @param {string} orderId 订单ID
   * @returns {boolean} 操作结果
   */
  deleteOrder(orderId) {
    // 从localStorage获取所有订单
    const allOrders = this.getAllOrdersFromStorage();

    // 查找指定订单索引
    const orderIndex = allOrders.findIndex(
      (order) => order.orderId === orderId
    );

    if (orderIndex !== -1) {
      // 从数组中移除订单
      allOrders.splice(orderIndex, 1);

      // 保存更新后的订单列表
      this.saveAllOrdersToStorage(allOrders);

      return true;
    }

    return false;
  },

  /**
   * 将订单保存到localStorage
   * @param {Object} order 订单对象
   */
  saveOrderToStorage(order) {
    // 获取现有订单列表
    const orders = this.getAllOrdersFromStorage();

    // 添加新订单
    orders.push(order);

    // 保存到localStorage
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
    } catch (error) {}
  },

  /**
   * 根据orderId支付订单（修改状态为 paid）
   * @param {string} orderId 订单ID
   * @returns {boolean} 操作结果
   */
  payOrder(orderId) {
    // 从localStorage获取所有订单
    const allOrders = this.getAllOrdersFromStorage();

    // 查找指定订单索引
    const orderIndex = allOrders.findIndex(
      (order) => order.orderId === orderId
    );

    if (orderIndex !== -1) {
      // 更新订单状态
      allOrders[orderIndex].orderStatus = "paid";
      allOrders[orderIndex].updateTime = Date.now();
      allOrders[orderIndex].payTime = Date.now();

      // 保存更新后的订单列表
      this.saveAllOrdersToStorage(allOrders);

      return true;
    }

    return false;
  },

  /**
   * 完成订单（修改状态为 completed）
   * @param {string} orderId 订单ID
   * @returns {boolean} 操作结果
   */
  completeOrder(orderId) {
    // 从localStorage获取所有订单
    const allOrders = this.getAllOrdersFromStorage();

    // 查找指定订单索引
    const orderIndex = allOrders.findIndex(
      (order) => order.orderId === orderId
    );

    if (orderIndex !== -1) {
      // 更新订单状态
      allOrders[orderIndex].orderStatus = "completed";
      allOrders[orderIndex].updateTime = Date.now();
      allOrders[orderIndex].completeTime = Date.now();

      // 保存更新后的订单列表
      this.saveAllOrdersToStorage(allOrders);

      return true;
    }

    return false;
  },
};
