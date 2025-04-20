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
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:61", "调用createOrder API，提交的数据:", orderData);
  try {
    const response = await utils_api_request.request({
      url: "/api/orders",
      method: "POST",
      data: orderData
    });
    common_vendor.index.__f__("log", "at utils/api/orderApi.js:70", "创建订单API原始响应:", response);
    let orderResult = null;
    if (response && response.data) {
      orderResult = response.data;
    } else if (response && response.code === 200) {
      orderResult = response;
    } else if (response) {
      orderResult = response;
    }
    if (orderResult && !orderResult.orderId) {
      orderResult.orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1e4)}`;
      common_vendor.index.__f__("log", "at utils/api/orderApi.js:90", "API返回数据中没有orderId，已生成临时ID:", orderResult.orderId);
    }
    if (!orderResult) {
      orderResult = {
        orderId: `order_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
        ...orderData,
        createdTime: (/* @__PURE__ */ new Date()).toISOString()
      };
      common_vendor.index.__f__("log", "at utils/api/orderApi.js:100", "API未返回有效数据，已创建最小订单对象:", orderResult);
    }
    common_vendor.index.__f__("log", "at utils/api/orderApi.js:103", "最终处理后的订单数据:", orderResult);
    return orderResult;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:106", "创建订单API错误:", error);
    const fallbackOrder = {
      orderId: `order_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
      ...orderData,
      createdTime: (/* @__PURE__ */ new Date()).toISOString(),
      error: error.message || "创建订单失败"
    };
    common_vendor.index.__f__("log", "at utils/api/orderApi.js:114", "出错后创建的备用订单对象:", fallbackOrder);
    return fallbackOrder;
  }
};
const fetchOrderById = async (orderId) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:125", "调用fetchOrderById API, orderId:", orderId);
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}`,
      method: "GET"
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:135", "获取订单详情API错误:", error);
    return utils_mockApi.mockApi.getOrderById(orderId);
  }
};
const cancelOrder = async (orderId) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:147", "调用cancelOrder API, orderId:", orderId);
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}/cancel`,
      method: "PUT"
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:157", "取消订单API错误:", error);
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
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:183", `支付订单${orderId}失败:`, error);
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
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:206", `完成订单${orderId}失败:`, error);
    throw error;
  }
};
const deleteOrder = async (orderId) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:217", "调用deleteOrder API, orderId:", orderId);
  try {
    const response = await utils_api_request.request({
      url: `/api/orders/${orderId}`,
      method: "DELETE"
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:227", "删除订单API错误:", error);
    return utils_mockApi.mockApi.deleteOrder(orderId);
  }
};
const updateCouponUsed = async (couponId, orderId) => {
  const numericCouponId = Number(couponId);
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:238", "调用updateCouponUsed API, couponId:", numericCouponId, "orderId:", orderId);
  try {
    const apiUrl = `/api/user-coupons/${numericCouponId}/use?orderId=${encodeURIComponent(orderId)}`;
    common_vendor.index.__f__("log", "at utils/api/orderApi.js:243", "完整请求URL:", apiUrl);
    const response = await utils_api_request.request({
      url: apiUrl,
      method: "PUT"
    });
    common_vendor.index.__f__("log", "at utils/api/orderApi.js:251", "优惠券更新API原始响应:", response);
    return response.data || response;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:254", "更新优惠券状态API错误详情:", error);
    return { success: false, message: error.message };
  }
};
const getCouponById = async (couponId) => {
  common_vendor.index.__f__("log", "at utils/api/orderApi.js:262", "调用getCouponById API, couponId:", couponId);
  try {
    const response = await utils_api_request.request({
      url: `/api/user-coupons/${couponId}`,
      method: "GET"
    });
    return response.data;
  } catch (error) {
    common_vendor.index.__f__("error", "at utils/api/orderApi.js:272", "获取优惠券详情API错误:", error);
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
