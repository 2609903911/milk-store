// API请求工具

import { BASE_URL, TIMEOUT, REQUEST_METHODS } from './config';

/**
 * 通用请求函数
 * @param {Object} options 请求配置
 * @returns {Promise} 请求Promise
 */
export const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url.startsWith('http') ? options.url : BASE_URL + options.url,
      method: options.method || REQUEST_METHODS.GET,
      data: options.data || {},
      header: options.header || {},
      timeout: options.timeout || TIMEOUT,
      success: (res) => {
        // 请求成功
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          // HTTP错误
          console.error(`请求失败: ${res.statusCode}`, res.data);
          reject({
            statusCode: res.statusCode,
            message: res.data?.message || '请求失败',
            data: res.data
          });
        }
      },
      fail: (err) => {
        // 网络错误等
        console.error('请求异常:', err);
        reject({
          statusCode: -1,
          message: err.errMsg || '网络异常',
          error: err
        });
      }
    });
  });
};

/**
 * GET请求
 * @param {String} url 请求URL
 * @param {Object} params URL参数
 * @param {Object} options 其他选项
 * @returns {Promise} 请求Promise
 */
export const get = (url, params = {}, options = {}) => {
  // 处理GET参数
  let requestUrl = url;
  const queryParams = Object.keys(params).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  }).join('&');
  
  if (queryParams) {
    requestUrl += (url.includes('?') ? '&' : '?') + queryParams;
  }
  
  return request({
    url: requestUrl,
    method: REQUEST_METHODS.GET,
    ...options
  });
};

/**
 * POST请求
 * @param {String} url 请求URL
 * @param {Object} data 请求数据
 * @param {Object} options 其他选项
 * @returns {Promise} 请求Promise
 */
export const post = (url, data = {}, options = {}) => {
  return request({
    url,
    method: REQUEST_METHODS.POST,
    data,
    ...options
  });
};

/**
 * PUT请求
 * @param {String} url 请求URL
 * @param {Object} data 请求数据
 * @param {Object} options 其他选项
 * @returns {Promise} 请求Promise
 */
export const put = (url, data = {}, options = {}) => {
  return request({
    url,
    method: REQUEST_METHODS.PUT,
    data,
    ...options
  });
};

/**
 * DELETE请求
 * @param {String} url 请求URL
 * @param {Object} params URL参数
 * @param {Object} options 其他选项
 * @returns {Promise} 请求Promise
 */
export const del = (url, params = {}, options = {}) => {
  // 处理DELETE参数
  let requestUrl = url;
  const queryParams = Object.keys(params).map(key => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  }).join('&');
  
  if (queryParams) {
    requestUrl += (url.includes('?') ? '&' : '?') + queryParams;
  }
  
  return request({
    url: requestUrl,
    method: REQUEST_METHODS.DELETE,
    ...options
  });
}; 