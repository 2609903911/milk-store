"use strict";
require("./userState.js");
const getAIConfig = () => {
  return {
    // 使用我们自己的后端API，不直接调用DeepSeek
    baseURL: "http://localhost:8082/api/ai",
    defaultModel: "deepseek-chat",
    maxTokens: 2e3,
    temperature: 0.7
  };
};
const getAIRequestConfig = async () => {
  const config = getAIConfig();
  return {
    url: `${config.baseURL}/chat`,
    method: "POST",
    header: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    timeout: 3e4,
    // 设置30秒超时
    withCredentials: true,
    success: (res) => {
      return res;
    },
    fail: (err) => {
      throw err;
    }
  };
};
exports.getAIRequestConfig = getAIRequestConfig;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/aiConfigService.js.map
