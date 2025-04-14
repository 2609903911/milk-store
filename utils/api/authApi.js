// 认证相关API

import { post, get } from './request';
import { API_PATHS } from './config';

/**
 * 发送验证码
 * @param {string} phone - 手机号码
 * @param {string} type - 验证码类型，默认为login
 * @returns {Promise<Object>} - 返回结果
 */
export function sendVerificationCode(phone, type = 'login') {
  // 使用get方法，将参数放在URL中
  return get(API_PATHS.AUTH_SEND_CODE, {
    phone,
    type
  });
}

/**
 * 验证码登录
 * @param {string} phone - 手机号码
 * @param {string} code - 验证码
 * @returns {Promise<Object>} - 返回用户信息和token
 */
export function loginWithCode(phone, code) {
  // 使用get方法，将参数放在URL中
  return get(API_PATHS.AUTH_LOGIN_CODE, {
    phone,
    code
  });
}

/**
 * 退出登录
 * @returns {Promise<Object>} - 返回结果
 */
export function logout() {
  return post(API_PATHS.AUTH_LOGOUT, {});
}

/**
 * 检查登录状态
 * @returns {Promise<Object>} - 返回用户信息
 */
export function checkLoginStatus() {
  return get(API_PATHS.AUTH_STATUS);
} 