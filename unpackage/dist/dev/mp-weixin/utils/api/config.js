"use strict";
const BASE_URL = "http://localhost:8082";
const TIMEOUT = 1e4;
const getFullUrl = (path) => {
  return `${BASE_URL}${path}`;
};
const API_PATHS = {
  // 轮播图相关
  BANNERS: "/api/banners",
  // 城市相关
  CITIES: "/api/cities",
  HOT_CITIES: "/api/cities/hot",
  CITIES_BY_LETTER: "/api/cities/letter",
  // 产品相关
  PRODUCTS: "/api/milk-products",
  PRODUCTS_ALL: "/api/milk-products/all",
  PRODUCTS_BY_ID: "/api/milk-products",
  // 需要拼接ID
  PRODUCTS_BY_CATEGORY: "/api/milk-products/category",
  // 需要拼接分类ID
  PRODUCTS_SEARCH: "/api/milk-products/search",
  // 根据名称搜索产品
  // 产品分类相关
  CATEGORIES: "/api/categories",
  CATEGORY_BY_ID: "/api/categories",
  // 需要拼接ID
  // 订单相关
  ORDERS: "/api/orders",
  ORDERS_BY_USER: "/api/orders/user",
  // 需要拼接用户ID
  ORDER_BY_ID: "/api/orders",
  // 需要拼接订单ID
  ORDER_STATUS: "/api/orders/status",
  // 需要拼接订单ID
  // 认证相关
  AUTH_SEND_CODE: "/api/auth/code/send",
  AUTH_LOGIN_CODE: "/api/auth/login/code",
  AUTH_LOGOUT: "/api/auth/logout",
  AUTH_STATUS: "/api/auth/status",
  // 用户相关
  USER_PROFILE: "/api/user/profile-info",
  // 获取用户详细信息
  USER_UPDATE: "/api/user/update-info",
  // 更新用户信息
  USER_AVATAR_UPLOAD: "/api/user/upload-avatar",
  // 上传用户头像
  USER_UPDATE_PHONE: "/api/user/update-phone",
  // 更新用户手机号
  USER_DEFAULT_ADDRESS: "/api/user/default-address"
  // 获取用户默认地址
};
const REQUEST_METHODS = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE"
};
exports.API_PATHS = API_PATHS;
exports.BASE_URL = BASE_URL;
exports.REQUEST_METHODS = REQUEST_METHODS;
exports.TIMEOUT = TIMEOUT;
exports.getFullUrl = getFullUrl;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/config.js.map
