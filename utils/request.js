/**
 * 统一请求工具
 */

// API基础URL配置
const BASE_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8080'  // 开发环境
    : 'https://api.milkstore.com'  // 生产环境

// 请求超时时间
const TIMEOUT = 10000

/**
 * 检查当前环境是否支持XMLHttpRequest
 * @returns {boolean} 是否支持XMLHttpRequest
 */
const isXHRSupported = () => {
    try {
        // 检查是否在小程序环境
        const isMiniProgram = typeof uni !== 'undefined' && !!uni.getSystemInfoSync 
            && (typeof window === 'undefined' || !window.XMLHttpRequest);
        
        // 如果是小程序环境或XMLHttpRequest不存在则返回false
        if (isMiniProgram) {
            return false;
        }
        
        // 检查XMLHttpRequest是否存在且可用
        return typeof XMLHttpRequest === 'function';
    } catch (e) {
        return false;
    }
};

/**
 * 发送请求的统一方法
 * @param {Object} options - 请求配置
 * @returns {Promise} 请求结果的Promise
 */
export const request = (options) => {
    return new Promise((resolve, reject) => {
        // 构建完整URL
        const url = options.url.startsWith('http') 
            ? options.url 
            : BASE_URL + options.url;
        
        // 显示加载中提示
        if (options.loading !== false) {
            uni.showLoading({
                title: options.loadingText || '加载中',
                mask: true
            });
        }
        
        // 准备请求头
        const header = {
            'Content-Type': 'application/json',
            ...options.header, // 合并自定义请求头
            ...(uni.getStorageSync('token') && { 'Authorization': `Bearer ${uni.getStorageSync('token')}` })
        };
        
        // 判断是否使用XMLHttpRequest
        const useXHR = process.env.NODE_ENV === 'development' && isXHRSupported();
        
        if (useXHR) {
            try {
                // 创建XHR对象
                const xhr = new XMLHttpRequest();
                xhr.open(options.method || 'GET', url, true);
                
                // 设置请求头
                for (const key in header) {
                    xhr.setRequestHeader(key, header[key]);
                }
                
                // 设置超时时间
                xhr.timeout = options.timeout || TIMEOUT;
                
                // 处理响应
                xhr.onload = function() {
                    if (options.loading !== false) {
                        uni.hideLoading();
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
                            uni.showToast({
                                title: `请求失败(${xhr.status})`,
                                icon: 'none'
                            });
                        }
                        reject({ code: xhr.status, message: xhr.statusText });
                    }
                };
                
                // 处理错误
                xhr.onerror = function(e) {
                    if (options.loading !== false) {
                        uni.hideLoading();
                    }
                    if (options.showError !== false) {
                        uni.showToast({
                            title: '网络异常，请稍后再试',
                            icon: 'none'
                        });
                    }
                    reject({ message: '网络异常' });
                };
                
                // 处理超时
                xhr.ontimeout = function() {
                    if (options.loading !== false) {
                        uni.hideLoading();
                    }
                    if (options.showError !== false) {
                        uni.showToast({
                            title: '请求超时',
                            icon: 'none'
                        });
                    }
                    reject({ message: '请求超时' });
                };
                
                // 发送请求
                if (options.method === 'GET' || !options.data) {
                    xhr.send();
                } else {
                    xhr.send(JSON.stringify(options.data));
                }
                
                return;
            } catch (e) {
                // 如果XHR模式失败，回退到uni.request
            }
        }
        
        // 使用uni.request
        uni.request({
            url,
            method: options.method || 'GET',
            data: options.data,
            header,
            timeout: options.timeout || TIMEOUT,
            withCredentials: false, // 跨域请求不发送cookie
            success: (res) => {
                // 请求成功，但需检查业务状态码
                if (res.statusCode === 200) {
                    // 如果返回直接是数据对象，则直接使用
                    if (typeof res.data === 'object' && res.data !== null) {
                        resolve(res);
                    } 
                    // 业务状态码检查
                    else if (res.data && res.data.code === 200) {
                        resolve(res.data);
                    } else {
                        // 业务错误处理
                        const errorMsg = res.data?.msg || '请求失败';
                        if (options.showError !== false) {
                            uni.showToast({
                                title: errorMsg,
                                icon: 'none'
                            });
                        }
                        reject({ code: res.data?.code, message: errorMsg });
                    }
                } else if (res.statusCode === 401) {
                    uni.showToast({
                        title: '登录已过期，请重新登录',
                        icon: 'none'
                    });
                    
                    // 清除token和用户信息
                    uni.removeStorageSync('token');
                    uni.removeStorageSync('userInfo');
                    
                    // 跳转到登录页
                    setTimeout(() => {
                        uni.navigateTo({
                            url: '/pages/login/login'
                        });
                    }, 1500);
                    
                    reject(new Error('未授权，请登录'));
                } else if (res.statusCode === 403) {
                    uni.showToast({
                        title: '没有权限访问',
                        icon: 'none'
                    });
                    reject(new Error('没有权限'));
                } else if (res.statusCode === 404) {
                    uni.showToast({
                        title: '请求的资源不存在',
                        icon: 'none'
                    });
                    reject(new Error('资源不存在'));
                } else if (res.statusCode >= 500) {
                    uni.showToast({
                        title: '服务器异常，请稍后重试',
                        icon: 'none'
                    });
                    reject(new Error('服务器异常'));
                } else {
                    // HTTP状态码错误处理
                    const errorMsg = `请求失败(${res.statusCode})`;
                    if (options.showError !== false) {
                        uni.showToast({
                            title: errorMsg,
                            icon: 'none'
                        });
                    }
                    reject({ code: res.statusCode, message: errorMsg });
                }
            },
            fail: (err) => {
                // 网络错误或其他错误
                const errorMsg = err.errMsg || '网络异常，请稍后再试';
                if (options.showError !== false) {
                    uni.showToast({
                        title: errorMsg,
                        icon: 'none'
                    });
                }
                reject(err);
            },
            complete: () => {
                // 隐藏加载提示
                if (options.loading !== false) {
                    uni.hideLoading();
                }
                
                // 自定义完成回调
                if (typeof options.complete === 'function') {
                    options.complete();
                }
            }
        });
    });
};

/**
 * GET请求
 * @param {String} url - 请求URL
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他选项
 * @returns {Promise} 请求结果
 */
export const get = (url, data = {}, options = {}) => {
    return request({
        ...options,
        url,
        method: 'GET',
        data
    });
};

/**
 * POST请求
 * @param {String} url - 请求URL
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他选项
 * @returns {Promise} 请求结果
 */
export const post = (url, data = {}, options = {}) => {
    return request({
        ...options,
        url,
        method: 'POST',
        data
    });
};

/**
 * PUT请求
 * @param {String} url - 请求URL
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他选项
 * @returns {Promise} 请求结果
 */
export const put = (url, data = {}, options = {}) => {
    return request({
        ...options,
        url,
        method: 'PUT',
        data
    });
};

/**
 * DELETE请求
 * @param {String} url - 请求URL
 * @param {Object} data - 请求参数
 * @param {Object} options - 其他选项
 * @returns {Promise} 请求结果
 */
export const del = (url, data = {}, options = {}) => {
    return request({
        ...options,
        url,
        method: 'DELETE',
        data
    });
};

/**
 * 获取完整的API URL
 * @param {String} path - API路径
 * @returns {String} 完整URL
 */
export const getFullUrl = (path) => {
    return `${BASE_URL}${path}`;
};

export default {
    request,
    get,
    post,
    put,
    del,
    getFullUrl,
    BASE_URL
}; 