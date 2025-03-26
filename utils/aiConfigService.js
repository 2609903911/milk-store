/**
 * AI配置服务
 * 管理AI相关的配置信息
 */

import { userState } from './userState';

// 在实际环境中，应该从后端服务获取这些密钥
// 或使用环境变量等方式存储，不要硬编码
export const getAIConfig = () => {
  return {
    // 使用我们自己的后端API，不直接调用DeepSeek
    baseURL: 'http://localhost:8082/api/ai',
    defaultModel: 'deepseek-chat',
    maxTokens: 2000,
    temperature: 0.7
  };
};

/**
 * 获取DeepSeek API请求配置
 * @returns {Object} 请求配置对象
 */
export const getAIRequestConfig = async () => {
  const config = getAIConfig();
  
  return {
    url: `${config.baseURL}/chat`,
    method: 'POST',
    header: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    timeout: 30000, // 设置30秒超时
    withCredentials: true,
    success: (res) => {
      console.log('请求成功:', res);
      return res;
    },
    fail: (err) => {
      console.error('请求失败:', err);
      throw err;
    }
  };
}; 