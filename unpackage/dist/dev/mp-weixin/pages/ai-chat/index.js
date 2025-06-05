"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_aiConfigService = require("../../utils/aiConfigService.js");
const utils_aiPromptService = require("../../utils/aiPromptService.js");
const utils_userState = require("../../utils/userState.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const messages = common_vendor.ref([]);
    const inputMessage = common_vendor.ref("");
    const loading = common_vendor.ref(false);
    const systemPrompt = common_vendor.ref("");
    const scrollToView = common_vendor.ref("");
    const userAvatar = common_vendor.ref("/static/images/user-avatar.png");
    const messageIdCounter = common_vendor.ref(0);
    const generateMessageId = () => {
      messageIdCounter.value += 1;
      return `msg-id-${messageIdCounter.value}-${Date.now()}`;
    };
    const messagesWithCopyButton = common_vendor.computed(() => {
      return messages.value.map((msg) => {
        return {
          ...msg,
          showCopyButton: msg.role === "assistant" && !msg.isTyping,
          updateKey: msg.updateKey || Date.now()
          // 添加更新键，用于强制重渲染
        };
      });
    });
    const initChat = async () => {
      loading.value = true;
      try {
        systemPrompt.value = await utils_aiPromptService.generateSystemPrompt();
        await fetchUserAvatar();
        messages.value.push({
          id: generateMessageId(),
          // 添加唯一ID
          role: "assistant",
          content: "您好！我是Panda管家，有什么可以帮您的吗？",
          isTyping: true,
          showCopyButton: false
          // 初始不显示复制按钮
        });
        setTimeout(() => {
          if (messages.value.length > 0) {
            const firstMessageId = messages.value[0].id;
            const messageIndex = messages.value.findIndex(
              (msg) => msg.id === firstMessageId
            );
            if (messageIndex !== -1) {
              const updatedMsg = {
                ...messages.value[messageIndex],
                isTyping: false,
                showCopyButton: true,
                // 打字完成后显示复制按钮
                updateKey: Date.now()
                // 添加更新键，强制重渲染
              };
              messages.value.splice(messageIndex, 1, updatedMsg);
            }
          }
        }, 1500);
      } catch (error) {
      } finally {
        loading.value = false;
      }
    };
    const fetchUserAvatar = async () => {
      try {
        if (utils_userState.userState) {
          common_vendor.index.request({
            url: `http://localhost:8082/api/user/profile-info?userId=${utils_userState.userState.userId}`,
            method: "GET",
            success: (res) => {
              if (res.statusCode === 200) {
                const platform = common_vendor.index.getSystemInfoSync().platform;
                let avatarUrl = "";
                if (res.data && res.data.data && res.data.data.avatar) {
                  avatarUrl = res.data.data.avatar;
                  if (platform === "h5") {
                    if (!avatarUrl.startsWith("http")) {
                      avatarUrl = "http://localhost:8082" + avatarUrl;
                    }
                  } else if (platform === "mp-weixin") {
                    if (avatarUrl.startsWith("http:")) {
                      avatarUrl = avatarUrl.replace("http:", "https:");
                    }
                  }
                  userAvatar.value = avatarUrl;
                } else {
                }
              }
            },
            fail: (err) => {
            }
          });
        }
      } catch (error) {
      }
    };
    const copyMessageText = (text) => {
      common_vendor.index.setClipboardData({
        data: text,
        success: () => {
          common_vendor.index.showToast({
            title: "复制成功",
            icon: "success",
            duration: 1500
          });
        },
        fail: (err) => {
          common_vendor.index.showToast({
            title: "复制失败",
            icon: "none",
            duration: 1500
          });
        }
      });
    };
    const sendMessage = async () => {
      if (!inputMessage.value.trim() || loading.value)
        return;
      const userMessage = inputMessage.value.trim();
      messages.value.push({
        id: generateMessageId(),
        // 添加唯一ID
        role: "user",
        content: userMessage,
        showCopyButton: false
        // 用户消息不显示复制按钮
      });
      inputMessage.value = "";
      await scrollToBottom();
      loading.value = true;
      try {
        const requestConfig = await utils_aiConfigService.getAIRequestConfig();
        common_vendor.index.request({
          ...requestConfig,
          data: {
            messages: prepareMessages(),
            systemPrompt: systemPrompt.value
          },
          success: (res) => {
            if (res.statusCode === 200 && res.data) {
              const aiMessageId = generateMessageId();
              const aiResponse = {
                id: aiMessageId,
                // 使用唯一ID
                role: "assistant",
                content: res.data.content || "抱歉，我无法理解您的问题。",
                isTyping: true,
                showCopyButton: false
                // 打字时不显示复制按钮
              };
              messages.value.push(aiResponse);
              setTimeout(() => {
                const messageIndex = messages.value.findIndex(
                  (msg) => msg.id === aiMessageId
                );
                if (messageIndex !== -1) {
                  const updatedMsg = {
                    ...messages.value[messageIndex],
                    isTyping: false,
                    showCopyButton: true,
                    // 打字完成后显示复制按钮
                    updateKey: Date.now()
                    // 添加更新键，强制重渲染
                  };
                  messages.value.splice(messageIndex, 1, updatedMsg);
                  common_vendor.nextTick$1(() => {
                  });
                }
              }, 1e3);
            } else {
              messages.value.push({
                id: generateMessageId(),
                // 添加唯一ID
                role: "assistant",
                content: "抱歉，服务出现问题，请稍后再试。",
                isTyping: false,
                showCopyButton: true
                // 直接显示复制按钮
              });
            }
          },
          fail: (err) => {
            messages.value.push({
              id: generateMessageId(),
              // 添加唯一ID
              role: "assistant",
              content: "抱歉，网络连接出现问题，请检查您的网络设置。",
              isTyping: false,
              showCopyButton: true
              // 直接显示复制按钮
            });
          },
          complete: () => {
            loading.value = false;
            scrollToBottom();
          }
        });
      } catch (error) {
        messages.value.push({
          id: generateMessageId(),
          // 添加唯一ID
          role: "assistant",
          content: "抱歉，发生未知错误，请稍后再试。",
          isTyping: false,
          showCopyButton: true
          // 直接显示复制按钮
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
    };
    common_vendor.onMounted(() => {
      initChat();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(messagesWithCopyButton.value, (message, index, i0) => {
          return common_vendor.e({
            a: message.role === "user" ? userAvatar.value : "/static/images/ai-avatar.png",
            b: common_vendor.t(message.content),
            c: message.isTyping ? 1 : "",
            d: message.role === "assistant" && !message.isTyping
          }, message.role === "assistant" && !message.isTyping ? {
            e: common_vendor.o(($event) => copyMessageText(message.content), "msg-" + index + "-" + message.updateKey)
          } : {}, {
            f: "msg-" + index + "-" + message.updateKey,
            g: "msg-" + index,
            h: common_vendor.n(message.role === "user" ? "message-user" : "message-assistant")
          });
        }),
        b: loading.value
      }, loading.value ? {
        c: common_assets._imports_0$12
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
