/**
 * API接口统一出口
 */
import * as orderApi from "./orderApi";
import * as followApi from "./followApi";
import * as postApi from "./postApi";

// 导出所有API接口
export const api = {
  order: orderApi,
  follow: followApi,
  post: postApi,
};

// 直接导出orderApi模块
export { orderApi };
export { followApi };
export { postApi };

// 也可以通过对象形式调用
export default {
  orderApi,
  followApi,
  postApi,
};

// API服务入口

// 导出配置
export * from "./config";

// 导出请求工具
export * from "./request";

// 导出各模块API
export * as bannerApi from "./bannerApi";
export * as cityApi from "./cityApi";
export * as productApi from "./productApi";
export * as categoryApi from "./categoryApi";
export * as authApi from "./authApi";
