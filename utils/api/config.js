// API基础配置

// API基础URL
export const BASE_URL = 'http://localhost:8082';

// 通用请求超时时间（毫秒）
export const TIMEOUT = 10000;

// API路径
export const API_PATHS = {
  // 轮播图相关
  BANNERS: '/api/banners',
  
  // 城市相关
  CITIES: '/api/cities',
  HOT_CITIES: '/api/cities/hot',
  CITIES_BY_LETTER: '/api/cities/letter',
  
  // 产品相关
  PRODUCTS: '/api/milk-products',
  PRODUCTS_ALL: '/api/milk-products/all',
  PRODUCTS_BY_ID: '/api/milk-products',  // 需要拼接ID
  PRODUCTS_BY_CATEGORY: '/api/milk-products/category', // 需要拼接分类ID
  PRODUCTS_SEARCH: '/api/milk-products/search', // 根据名称搜索产品
  
  // 产品分类相关
  CATEGORIES: '/api/categories',
  CATEGORY_BY_ID: '/api/categories', // 需要拼接ID

  // 订单相关
  ORDERS: '/api/orders',
  ORDERS_BY_USER: '/api/orders/user', // 需要拼接用户ID
  ORDER_BY_ID: '/api/orders', // 需要拼接订单ID
  ORDER_STATUS: '/api/orders/status' // 需要拼接订单ID
};

// 请求方法
export const REQUEST_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
}; 