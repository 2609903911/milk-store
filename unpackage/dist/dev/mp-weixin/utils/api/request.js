"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_config = require("./config.js");
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url: options.url.startsWith("http") ? options.url : utils_api_config.BASE_URL + options.url,
      method: options.method || utils_api_config.REQUEST_METHODS.GET,
      data: options.data || {},
      header: options.header || {},
      timeout: options.timeout || utils_api_config.TIMEOUT,
      success: (res) => {
        var _a, _b;
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject({
            statusCode: res.statusCode,
            message: ((_a = res.data) == null ? void 0 : _a.message) || ((_b = res.data) == null ? void 0 : _b.error) || "请求失败",
            data: res.data
          });
        }
      },
      fail: (err) => {
        reject({
          statusCode: -1,
          message: err.errMsg || "网络异常",
          error: err
        });
      }
    });
  });
};
const get = (url, params = {}, options = {}) => {
  let requestUrl = url;
  const queryParams = Object.keys(params).map((key) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  }).join("&");
  if (queryParams) {
    requestUrl += (url.includes("?") ? "&" : "?") + queryParams;
  }
  return request({
    url: requestUrl,
    method: utils_api_config.REQUEST_METHODS.GET,
    ...options
  });
};
const post = (url, data = {}, options = {}) => {
  if (data.userId !== void 0 && data.userId !== null) {
    data.userId = String(data.userId);
  }
  const requestOptions = {
    url,
    method: utils_api_config.REQUEST_METHODS.POST,
    data,
    ...options
  };
  if (options.userId && !data.userId) {
    const separator = url.includes("?") ? "&" : "?";
    requestOptions.url = `${url}${separator}userId=${options.userId}`;
  }
  return request(requestOptions);
};
const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: utils_api_config.REQUEST_METHODS.PUT,
    data,
    ...options
  });
};
const del = (url, params = {}, options = {}) => {
  let requestUrl = url;
  const queryParams = Object.keys(params).map((key) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  }).join("&");
  if (queryParams) {
    requestUrl += (url.includes("?") ? "&" : "?") + queryParams;
  }
  return request({
    url: requestUrl,
    method: utils_api_config.REQUEST_METHODS.DELETE,
    ...options
  });
};
exports.del = del;
exports.get = get;
exports.post = post;
exports.put = put;
exports.request = request;
//# sourceMappingURL=../../../.sourcemap/mp-weixin/utils/api/request.js.map
