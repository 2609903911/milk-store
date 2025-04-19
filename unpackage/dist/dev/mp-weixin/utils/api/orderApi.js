"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_request = require("./request.js");
const utils_api_config = require("./config.js");
require("../userState.js");
const utils_mockApi = require("../mockApi.js");
const fetchUserOrders = async (userId) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:16", "调用fetchUserOrders API, userId:", userId);
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/user/${userId}`,
      method: "GET"
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:26", "获取用户订单API错误:", error);
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
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:50", `获取用户${status}状态订单失败:`, error);
    throw error;
  }
};
const createOrder = async (orderData) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:61", "调用createOrder API:", orderData);
  try {
    const response = await utils_api_request.request({
      url: "/api/orders",
      method: "POST",
      data: orderData
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:72", "创建订单API错误:", error);
    return utils_mockApi.mockApi.createOrder(orderData);
  }
};
const fetchOrderById = async (orderId) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:84", "调用fetchOrderById API, orderId:", orderId);
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}`,
      method: "GET"
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:94", "获取订单详情API错误:", error);
    return utils_mockApi.mockApi.getOrderById(orderId);
  }
};
const cancelOrder = async (orderId) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:106", "调用cancelOrder API, orderId:", orderId);
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}/cancel`,
      method: "PUT"
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:116", "取消订单API错误:", error);
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
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:142", `支付订单${orderId}失败:`, error);
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
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:165", `完成订单${orderId}失败:`, error);
    throw error;
  }
};
const deleteOrder = async (orderId) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:176", "调用deleteOrder API, orderId:", orderId);
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}`,
      method: "DELETE"
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:186", "删除订单API错误:", error);
    return utils_mockApi.mockApi.deleteOrder(orderId);
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
  payOrder
}, Symbol.toStringTag, { value: "Module" }));
exports.cancelOrder = cancelOrder;
exports.deleteOrder = deleteOrder;
exports.fetchOrderById = fetchOrderById;
exports.fetchUserOrders = fetchUserOrders;
exports.orderApi = orderApi;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/orderApi.js.map
