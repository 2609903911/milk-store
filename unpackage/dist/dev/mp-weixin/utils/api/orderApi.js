"use strict";
const utils_api_request = require("./request.js");
const utils_api_config = require("./config.js");
require("../userState.js");
const utils_mockApi = require("../mockApi.js");
const fetchUserOrders = async (userId) => {
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/user/${userId}`,
      method: "GET"
    });
    return response.data;
  } catch (error) {
    return utils_mockApi.mockApi.getUserOrders(userId);
  }
};
const fetchUserOrdersByStatus = async (userId, status) => {
  try {
    const result = await utils_api_request.request({
      url: `${utils_api_config.API_PATHS.ORDERS_BY_USER}/${userId}/status/${status}`,
      method: "GET"
    });
    if (result.code === 200 && result.data) {
      return result.data;
    }
    return [];
  } catch (error) {
    throw error;
  }
};
const createOrder = async (orderData) => {
  try {
    const response = await utils_api_request.request({
      url: "/api/orders",
      method: "POST",
      data: orderData
    });
    let orderResult = null;
    if (response && response.data) {
      orderResult = response.data;
    } else if (response && response.code === 200) {
      orderResult = response;
    } else if (response) {
      orderResult = response;
    }
    if (orderResult && !orderResult.orderId) {
      orderResult.orderId = `order_${Date.now()}_${Math.floor(
        Math.random() * 1e4
      )}`;
    }
    if (!orderResult) {
      orderResult = {
        orderId: `order_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
        ...orderData,
        createdTime: (/* @__PURE__ */ new Date()).toISOString()
      };
    }
    return orderResult;
  } catch (error) {
    const fallbackOrder = {
      orderId: `order_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
      ...orderData,
      createdTime: (/* @__PURE__ */ new Date()).toISOString(),
      error: error.message || "创建订单失败"
    };
    return fallbackOrder;
  }
};
const fetchOrderById = async (orderId) => {
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}`,
      method: "GET"
    });
    return response.data;
  } catch (error) {
    return utils_mockApi.mockApi.getOrderById(orderId);
  }
};
const cancelOrder = async (orderId) => {
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}/cancel`,
      method: "PUT"
    });
    return response.data;
  } catch (error) {
    return utils_mockApi.mockApi.cancelOrder(orderId);
  }
};
const payOrder = async (orderId, paymentMethod) => {
  try {
    const result = await utils_api_request.request({
      url: `${utils_api_config.API_PATHS.ORDER_BY_ID}/${orderId}/pay`,
      method: "PUT",
      data: { paymentMethod }
    });
    if (result.code === 200) {
      return result.data || { success: true };
    }
    throw new Error(result.message || "支付订单失败");
  } catch (error) {
    throw error;
  }
};
const completeOrder = async (orderId) => {
  try {
    const result = await utils_api_request.request({
      url: `${utils_api_config.API_PATHS.ORDER_BY_ID}/${orderId}/complete`,
      method: "PUT"
    });
    if (result.code === 200) {
      return result.data || { success: true };
    }
    throw new Error(result.message || "完成订单失败");
  } catch (error) {
    throw error;
  }
};
const deleteOrder = async (orderId) => {
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}`,
      method: "DELETE"
    });
    return response.data;
  } catch (error) {
    return utils_mockApi.mockApi.deleteOrder(orderId);
  }
};
const updateCouponUsed = async (couponId, orderId) => {
  const numericCouponId = Number(couponId);
  try {
    const apiUrl = `/api/user-coupons/${numericCouponId}/use?orderId=${encodeURIComponent(
      orderId
    )}`;
    const response = await utils_api_request.request({
      url: apiUrl,
      method: "PUT"
    });
    return response.data || response;
  } catch (error) {
    return { success: false, message: error.message };
  }
};
const getCouponById = async (couponId) => {
  try {
    const response = await utils_api_request.request({
      url: `/api/user-coupons/${couponId}`,
      method: "GET"
    });
    return response.data;
  } catch (error) {
    return null;
  }
};
const orderApi = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  cancelOrder,
  completeOrder,
  createOrder,
  deleteOrder,
  fetchOrderById,
  fetchUserOrders,
  fetchUserOrdersByStatus,
  getCouponById,
  payOrder,
  updateCouponUsed
}, Symbol.toStringTag, { value: "Module" }));
exports.cancelOrder = cancelOrder;
exports.deleteOrder = deleteOrder;
exports.fetchOrderById = fetchOrderById;
exports.fetchUserOrders = fetchUserOrders;
exports.getCouponById = getCouponById;
exports.orderApi = orderApi;
exports.updateCouponUsed = updateCouponUsed;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/orderApi.js.map
