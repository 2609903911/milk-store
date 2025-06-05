/**
 * uni-app 常用工具函数封装
 */

/**
 * 显示消息提示框
 * @param {string} title 提示的内容
 * @param {string} icon 图标，有效值为 success、loading、none、error
 * @param {number} duration 提示的延迟时间，单位毫秒
 * @param {boolean} mask 是否显示透明蒙层，防止触摸穿透
 */
export const toast = (title, icon = "none", duration = 1500, mask = false) => {
  uni.showToast({
    title,
    icon,
    duration,
    mask,
  });
};

/**
 * 显示模态弹窗
 * @param {string} title 提示的标题
 * @param {string} content 提示的内容
 * @param {boolean} showCancel 是否显示取消按钮
 * @param {string} cancelText 取消按钮的文字
 * @param {string} confirmText 确认按钮的文字
 * @returns {Promise} 返回一个Promise，点击确认按钮时resolved为true，点击取消按钮时resolved为false
 */
export const modal = (
  title,
  content,
  showCancel = true,
  cancelText = "取消",
  confirmText = "确定"
) => {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      showCancel,
      cancelText,
      confirmText,
      success: (res) => {
        if (res.confirm) {
          resolve(true);
        } else if (res.cancel) {
          resolve(false);
        }
      },
      fail: () => {
        resolve(false);
      },
    });
  });
};

/**
 * 显示loading提示框
 * @param {string} title 提示的内容
 * @param {boolean} mask 是否显示透明蒙层，防止触摸穿透
 */
export const showLoading = (title = "加载中", mask = true) => {
  uni.showLoading({
    title,
    mask,
  });
};

/**
 * 隐藏loading提示框
 */
export const hideLoading = () => {
  uni.hideLoading();
};

/**
 * 保存数据到本地存储
 * @param {string} key 本地缓存中的指定的key
 * @param {any} data 需要存储的内容，只支持原生类型、Date、及能够通过JSON.stringify序列化的对象
 */
export const setStorage = (key, data) => {
  try {
    uni.setStorageSync(key, data);
  } catch (e) {}
};

/**
 * 从本地存储中获取数据
 * @param {string} key 本地缓存中的指定的key
 * @returns {any} key对应的内容
 */
export const getStorage = (key) => {
  try {
    return uni.getStorageSync(key);
  } catch (e) {
    return null;
  }
};

/**
 * 从本地存储中移除数据
 * @param {string} key 本地缓存中的指定的key
 */
export const removeStorage = (key) => {
  try {
    uni.removeStorageSync(key);
  } catch (e) {}
};

/**
 * 清理本地数据存储
 */
export const clearStorage = () => {
  try {
    uni.clearStorageSync();
  } catch (e) {}
};

/**
 * 格式化日期
 * @param {Date|string|number} date 日期对象、日期字符串或时间戳
 * @param {string} format 格式化模式，如 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date, format = "YYYY-MM-DD HH:mm:ss") => {
  if (!date) return "";

  // 如果是时间戳或日期字符串，转为Date对象
  if (typeof date !== "object") {
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const paddedMonth = month.toString().padStart(2, "0");
  const paddedDay = day.toString().padStart(2, "0");
  const paddedHour = hour.toString().padStart(2, "0");
  const paddedMinute = minute.toString().padStart(2, "0");
  const paddedSecond = second.toString().padStart(2, "0");

  return format
    .replace(/YYYY/g, year)
    .replace(/MM/g, paddedMonth)
    .replace(/DD/g, paddedDay)
    .replace(/HH/g, paddedHour)
    .replace(/mm/g, paddedMinute)
    .replace(/ss/g, paddedSecond);
};

/**
 * 节流函数
 * @param {Function} fn 需要执行的函数
 * @param {number} wait 等待时间，单位毫秒
 * @returns {Function} 节流后的函数
 */
export const throttle = (fn, wait = 300) => {
  let lastTime = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastTime >= wait) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
};

/**
 * 防抖函数
 * @param {Function} fn 需要执行的函数
 * @param {number} delay 延迟时间，单位毫秒
 * @returns {Function} 防抖后的函数
 */
export const debounce = (fn, delay = 300) => {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

/**
 * 深拷贝对象
 * @param {Object} obj 需要拷贝的对象
 * @returns {Object} 拷贝后的新对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    return obj;
  }
};

export default {
  toast,
  modal,
  showLoading,
  hideLoading,
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  formatDate,
  throttle,
  debounce,
  deepClone,
};
