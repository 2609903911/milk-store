"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:8082";
const isXHRSupported = () => {
  try {
    const isMiniProgram = typeof common_vendor.index !== "undefined" && !!common_vendor.index.getSystemInfoSync && (typeof window === "undefined" || !window.XMLHttpRequest);
    if (isMiniProgram) {
      return false;
    }
    return typeof XMLHttpRequest === "function";
  } catch (e) {
    return false;
  }
};
const request = (options) => {
  return new Promise((resolve, reject) => {
    const url = options.url.startsWith("http") ? options.url : `${BASE_URL}${options.url}`;
    if (options.loading !== false) {
      common_vendor.index.showLoading({
        title: options.loadingText || "加载中",
        mask: true
      });
    }
    const header = {
      "Content-Type": "application/json",
      ...options.header
      // 合并自定义请求头
    };
    const useXHR = isXHRSupported();
    if (useXHR) {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open(options.method || "GET", url, true);
        for (const key in header) {
          xhr.setRequestHeader(key, header[key]);
        }
        xhr.timeout = options.timeout || 6e4;
        xhr.onload = function() {
          if (options.loading !== false) {
            common_vendor.index.hideLoading();
          }
          if (xhr.status >= 200 && xhr.status < 300) {
            let response;
            try {
              response = JSON.parse(xhr.responseText);
            } catch (e) {
              response = xhr.responseText;
            }
            resolve({ data: response, statusCode: xhr.status });
          } else {
            if (options.showError !== false) {
              common_vendor.index.showToast({
                title: `请求失败(${xhr.status})`,
                icon: "none"
              });
            }
            reject({ code: xhr.status, message: xhr.statusText });
          }
        };
        xhr.onerror = function(e) {
          if (options.loading !== false) {
            common_vendor.index.hideLoading();
          }
          if (options.showError !== false) {
            common_vendor.index.showToast({
              title: "网络异常，请稍后再试",
              icon: "none"
            });
          }
          reject({ message: "网络异常" });
        };
        xhr.ontimeout = function() {
          if (options.loading !== false) {
            common_vendor.index.hideLoading();
          }
          if (options.showError !== false) {
            common_vendor.index.showToast({
              title: "请求超时",
              icon: "none"
            });
          }
          reject({ message: "请求超时" });
        };
        if (options.method === "GET" || !options.data) {
          xhr.send();
        } else {
          xhr.send(JSON.stringify(options.data));
        }
        return;
      } catch (e) {
      }
    }
    common_vendor.index.request({
      url,
      method: options.method || "GET",
      data: options.data,
      header,
      withCredentials: false,
      // 跨域请求不发送cookie
      success: (res) => {
        var _a, _b;
        if (res.statusCode === 200) {
          if (typeof res.data === "object" && res.data !== null) {
            resolve(res);
          } else if (res.data && res.data.code === 200) {
            resolve(res.data);
          } else {
            const errorMsg = ((_a = res.data) == null ? void 0 : _a.msg) || "请求失败";
            if (options.showError !== false) {
              common_vendor.index.showToast({
                title: errorMsg,
                icon: "none"
              });
            }
            reject({ code: (_b = res.data) == null ? void 0 : _b.code, message: errorMsg });
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
