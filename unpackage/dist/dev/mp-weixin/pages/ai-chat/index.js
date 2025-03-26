"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_aiConfigService = require("../../utils/aiConfigService.js");
const utils_aiPromptService = require("../../utils/aiPromptService.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const messages = common_vendor.ref([]);
    const inputMessage = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const systemPrompt = common_vendor.ref("");
    const scrollToView = common_vendor.ref("");
    const initChat = async () => {
      loading.value = true;
      try {
        systemPrompt.value = await utils_aiPromptService.generateSystemPrompt();
        messages.value.push({
          role: "assistant",
          content: "您好！我是奶茶AI助手，有什么可以帮您的吗？"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ai-chat/index.vue:112", "初始化聊天失败:", error);
      } finally {
        loading.value = false;
      }
    };
    const sendMessage = async () => {
      if (!inputMessage.value.trim() || loading.value)
        return;
      const userMessage = inputMessage.value.trim();
      messages.value.push({
        role: "user",
        content: userMessage
      });
      inputMessage.value = "";
      await scrollToBottom();
      loading.value = true;
      try {
        const requestConfig = await utils_aiConfigService.getAIRequestConfig();
        common_vendor.index.__f__("log", "at pages/ai-chat/index.vue:142", "发送请求配置:", requestConfig);
        common_vendor.index.request({
          ...requestConfig,
          data: {
            messages: prepareMessages(),
            systemPrompt: systemPrompt.value
          },
          success: (res) => {
            common_vendor.index.__f__("log", "at pages/ai-chat/index.vue:152", "收到响应:", res);
            if (res.statusCode === 200 && res.data) {
              messages.value.push({
                role: "assistant",
                content: res.data.content || "抱歉，我无法理解您的问题。"
              });
            } else {
              common_vendor.index.__f__("error", "at pages/ai-chat/index.vue:162", "响应错误:", res);
              messages.value.push({
                role: "assistant",
                content: "抱歉，服务出现问题，请稍后再试。"
              });
            }
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/ai-chat/index.vue:170", "请求失败:", err);
            messages.value.push({
              role: "assistant",
              content: "抱歉，网络连接出现问题，请检查您的网络设置。"
            });
          },
          complete: () => {
            loading.value = false;
            scrollToBottom();
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ai-chat/index.vue:183", "发送消息失败:", error);
        messages.value.push({
          role: "assistant",
          content: "抱歉，发生未知错误，请稍后再试。"
        });
        loading.value = false;
        scrollToBottom();
      }
    };
    const prepareMessages = () => {
      const recentMessages = messages.value.slice(-10);
      return recentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content
      }));
    };
    const scrollToBottom = async () => {
      await common_vendor.nextTick$1();
      if (messages.value.length > 0) {
        scrollToView.value = "msg-" + (messages.value.length - 1);
      }
    };
    const loadMoreHistory = () => {
      common_vendor.index.__f__("log", "at pages/ai-chat/index.vue:215", "加载更多历史记录");
    };
    common_vendor.onMounted(() => {
      initChat();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(messages.value, (message, index, i0) => {
          return {
            a: message.role === "user" ? "/static/images/user-avatar.png" : "/static/images/ai-avatar.png",
            b: common_vendor.t(message.content),
            c: index,
            d: "msg-" + index,
            e: common_vendor.n(message.role === "user" ? "message-user" : "message-assistant")
          };
        }),
        b: loading.value
      }, loading.value ? {
        c: common_assets._imports_0$11
      } : {}, {
        d: scrollToView.value,
        e: common_vendor.o(loadMoreHistory),
        f: loading.value,
        g: common_vendor.o(sendMessage),
        h: -1,
        i: inputMessage.value,
        j: common_vendor.o(($event) => inputMessage.value = $event.detail.value),
        k: loading.value || !inputMessage.value.trim() ? 1 : "",
        l: common_vendor.o(sendMessage)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ai-chat/index.js.map
