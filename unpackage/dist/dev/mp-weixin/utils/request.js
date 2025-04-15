"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8082";
const request = (options) => {
  return new Promise((resolve, reject) => {
    const url = options.url.startsWith("http") ? options.url : `${BASE_URL}${options.url}`;
    if (options.loading !== false) {
      common_vendor.index.showLoading({
        title: options.loadingText || "加载中",
        mask: true
      });
    }
    common_vendor.index.request({
      url,
      method: options.method || "GET",
      data: options.data,
      header: options.header,
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data);
          } else {
            const errorMsg = res.data.msg || "请求失败";
            if (options.showError !== false) {
              common_vendor.index.showToast({
                title: errorMsg,
                icon: "none"
              });
            }
            reject({ code: res.data.code, message: errorMsg });
          }
        } else {
          const errorMsg = `请求失败(${res.statusCode})`;
          if (options.showError !== false) {
            common_vendor.index.showToast({
              title: errorMsg,
              icon: "none"
            });
          }
          reject({ code: res.statusCode, message: errorMsg });
        }
      },
      fail: (err) => {
        const errorMsg = err.errMsg || "网络异常，请稍后再试";
        if (options.showError !== false) {
          common_vendor.index.showToast({
            title: errorMsg,
            icon: "none"
          });
        }
        common_vendor.index.__f__("error", "at utils/request.js:73", "请求失败:", err);
        reject(err);
      },
      complete: () => {
        if (options.loading !== false) {
          common_vendor.index.hideLoading();
        }
        if (typeof options.complete === "function") {
          options.complete();
        }
      }
    });
  });
};
const get = (url, data = {}, options = {}) => {
  return request({
    ...options,
    url,
    method: "GET",
    data
  });
};
const post = (url, data = {}, options = {}) => {
  return request({
    ...options,
    url,
    method: "POST",
    data
  });
};
exports.get = get;
exports.post = post;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
