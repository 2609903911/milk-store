/**
 * 统一请求工具
 */

// API基础URL配置
const BASE_URL = 'http://localhost:8082'; // 开发环境
// const BASE_URL = ''; // 生产环境，根据实际部署情况配置

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
            : `${BASE_URL}${options.url}`;
        
        // 显示加载中提示
        if (options.loading !== false) {
            uni.showLoading({
                title: options.loadingText || '加载中',
                mask: true
            });
        }
        
        // 发送请求
        uni.request({
            url,
            method: options.method || 'GET',
            data: options.data,
            header: options.header,
            success: (res) => {
                // 请求成功，但需检查业务状态码
                if (res.statusCode === 200) {
                    // 业务状态码检查
                    if (res.data.code === 200) {
                        resolve(res.data);
                    } else {
                        // 业务错误处理
                        const errorMsg = res.data.msg || '请求失败';
                        if (options.showError !== false) {
                            uni.showToast({
                                title: errorMsg,
                                icon: 'none'
                            });
                        }
                        reject({ code: res.data.code, message: errorMsg });
                    }
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
                console.error('请求失败:', err);
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
    getFullUrl,
    BASE_URL
}; 