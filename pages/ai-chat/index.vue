<template>
  <view class="ai-chat-container">
    <scroll-view
      class="chat-content"
      :scroll-y="true"
      :scroll-with-animation="true"
      :scroll-into-view="scrollToView"
      @scrolltoupper="loadMoreHistory"
    >
      <view class="message-container" id="message-container">
        <view
          v-for="(message, index) in messagesWithCopyButton"
          :key="'msg-' + index + '-' + message.updateKey"
          :id="'msg-' + index"
          class="message-item"
          :class="
            message.role === 'user' ? 'message-user' : 'message-assistant'
          "
        >
          <image
            class="avatar"
            :src="
              message.role === 'user'
                ? userAvatar
                : '/static/images/ai-avatar.png'
            "
            mode="aspectFill"
          ></image>
          <view class="message-bubble">
            <text
              class="message-text"
              :class="{ 'typing-animation': message.isTyping }"
              >{{ message.content }}</text
            >

            <!-- 简化版复制按钮 -->
            <text
              v-if="message.role === 'assistant' && !message.isTyping"
              class="simple-copy-button"
              @tap.stop="copyMessageText(message.content)"
              >复制</text
            >
          </view>
        </view>

        <view v-if="loading" class="message-item message-assistant">
          <image
            class="avatar"
            src="/static/images/ai-avatar.png"
            mode="aspectFill"
          ></image>
          <view class="message-bubble loading-bubble">
            <view class="loading-dots">
              <view class="dot"></view>
              <view class="dot"></view>
              <view class="dot"></view>
            </view>
          </view>
        </view>
      </view>
    </scroll-view>

    <view class="input-area">
      <textarea
        class="message-input"
        v-model="inputMessage"
        placeholder="请输入您的问题..."
        :disabled="loading"
        @confirm="sendMessage"
        :adjust-position="true"
        :cursor-spacing="20"
        :show-confirm-bar="false"
        :auto-height="true"
        :maxlength="-1"
        confirm-type="send"
      />
      <view
        class="send-button"
        :class="{ 'button-disabled': loading || !inputMessage.trim() }"
        @tap="sendMessage"
      >
        <text class="send-text">发送</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import { getAIRequestConfig } from "../../utils/aiConfigService.js";
import { generateSystemPrompt } from "../../utils/aiPromptService.js";
import { userState } from "../../utils/userState.js";

// 聊天消息列表
const messages = ref([]);
// 输入的消息
const inputMessage = ref("");
// 加载状态
const loading = ref(false);
// 系统提示词
const systemPrompt = ref("");
// 滚动控制
const scrollToView = ref("");
// 用户头像
const userAvatar = ref("/static/images/user-avatar.png");
// 消息ID计数器
const messageIdCounter = ref(0);

// 生成唯一消息ID
const generateMessageId = () => {
  messageIdCounter.value += 1;
  return `msg-id-${messageIdCounter.value}-${Date.now()}`;
};

// 添加计算属性，用于处理复制按钮的显示
const messagesWithCopyButton = computed(() => {
  return messages.value.map((msg) => {
    return {
      ...msg,
      showCopyButton: msg.role === "assistant" && !msg.isTyping,
      updateKey: msg.updateKey || Date.now(), // 添加更新键，用于强制重渲染
    };
  });
});

// 初始化聊天界面
const initChat = async () => {
  loading.value = true;

  try {
    // 生成系统提示词
    systemPrompt.value = await generateSystemPrompt();

    // 获取用户头像
    await fetchUserAvatar();

    // 添加AI的欢迎消息
    messages.value.push({
      id: generateMessageId(), // 添加唯一ID
      role: "assistant",
      content: "您好！我是Panda管家，有什么可以帮您的吗？",
      isTyping: true,
      showCopyButton: false, // 初始不显示复制按钮
    });

    // 模拟打字完成
    setTimeout(() => {
      if (messages.value.length > 0) {
        // 通过ID更新欢迎消息
        const firstMessageId = messages.value[0].id;
        const messageIndex = messages.value.findIndex(
          (msg) => msg.id === firstMessageId
        );

        if (messageIndex !== -1) {
          const updatedMsg = {
            ...messages.value[messageIndex],
            isTyping: false,
            showCopyButton: true, // 打字完成后显示复制按钮
            updateKey: Date.now(), // 添加更新键，强制重渲染
          };
          // 替换原消息对象
          messages.value.splice(messageIndex, 1, updatedMsg);
        }
      }
    }, 1500);
  } catch (error) {
  } finally {
    loading.value = false;
  }
};

// 获取用户头像
const fetchUserAvatar = async () => {
  try {
    if (userState) {
      // 直接使用uni.request发送请求
      uni.request({
        url: `http://localhost:8082/api/user/profile-info?userId=${userState.userId}`,
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200) {
            // 检查平台类型
            const platform = uni.getSystemInfoSync().platform;

            let avatarUrl = "";
            if (res.data && res.data.data && res.data.data.avatar) {
              avatarUrl = res.data.data.avatar;

              // 根据平台处理头像URL
              if (platform === "h5") {
                // H5环境可能需要处理跨域或完整URL
                if (!avatarUrl.startsWith("http")) {
                  // 如果是相对路径，添加基础URL
                  avatarUrl = "http://localhost:8082" + avatarUrl;
                }
              } else if (platform === "mp-weixin") {
                // 微信小程序环境处理
                // 如果是完整URL，确保是https
                if (avatarUrl.startsWith("http:")) {
                  avatarUrl = avatarUrl.replace("http:", "https:");
                }
              }

              userAvatar.value = avatarUrl;
            } else {
            }
          }
        },
        fail: (err) => {},
      });
    }
  } catch (error) {}
};

// 复制消息文本
const copyMessageText = (text) => {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({
        title: "复制成功",
        icon: "success",
        duration: 1500,
      });
    },
    fail: (err) => {
      uni.showToast({
        title: "复制失败",
        icon: "none",
        duration: 1500,
      });
    },
  });
};

// 发送消息
const sendMessage = async () => {
  // 检查消息是否为空
  if (!inputMessage.value.trim() || loading.value) return;

  // 添加用户消息到列表
  const userMessage = inputMessage.value.trim();
  messages.value.push({
    id: generateMessageId(), // 添加唯一ID
    role: "user",
    content: userMessage,
    showCopyButton: false, // 用户消息不显示复制按钮
  });

  // 清空输入框
  inputMessage.value = "";

  // 滚动到底部
  await scrollToBottom();

  // 设置加载状态
  loading.value = true;

  try {
    // 获取请求配置
    const requestConfig = await getAIRequestConfig();

    // 发送请求到后端
    uni.request({
      ...requestConfig,
      data: {
        messages: prepareMessages(),
        systemPrompt: systemPrompt.value,
      },
      success: (res) => {
        if (res.statusCode === 200 && res.data) {
          // 生成唯一ID
          const aiMessageId = generateMessageId();

          // 添加AI回复到消息列表，设置为正在打字状态
          const aiResponse = {
            id: aiMessageId, // 使用唯一ID
            role: "assistant",
            content: res.data.content || "抱歉，我无法理解您的问题。",
            isTyping: true,
            showCopyButton: false, // 打字时不显示复制按钮
          };
          messages.value.push(aiResponse);

          // 模拟打字完成
          setTimeout(() => {
            // 通过ID查找消息
            const messageIndex = messages.value.findIndex(
              (msg) => msg.id === aiMessageId
            );

            if (messageIndex !== -1) {
              // 更新消息对象
              const updatedMsg = {
                ...messages.value[messageIndex],
                isTyping: false,
                showCopyButton: true, // 打字完成后显示复制按钮
                updateKey: Date.now(), // 添加更新键，强制重渲染
              };
              // 替换原消息对象
              messages.value.splice(messageIndex, 1, updatedMsg);

              // 使用nextTick确保DOM更新
              nextTick(() => {});
            }
          }, 1000);
        } else {
          // 处理错误
          messages.value.push({
            id: generateMessageId(), // 添加唯一ID
            role: "assistant",
            content: "抱歉，服务出现问题，请稍后再试。",
            isTyping: false,
            showCopyButton: true, // 直接显示复制按钮
          });
        }
      },
      fail: (err) => {
        messages.value.push({
          id: generateMessageId(), // 添加唯一ID
          role: "assistant",
          content: "抱歉，网络连接出现问题，请检查您的网络设置。",
          isTyping: false,
          showCopyButton: true, // 直接显示复制按钮
        });
      },
      complete: () => {
        loading.value = false;
        // 滚动到底部
        scrollToBottom();
      },
    });
  } catch (error) {
    messages.value.push({
      id: generateMessageId(), // 添加唯一ID
      role: "assistant",
      content: "抱歉，发生未知错误，请稍后再试。",
      isTyping: false,
      showCopyButton: true, // 直接显示复制按钮
    });
    loading.value = false;
    // 滚动到底部
    scrollToBottom();
  }
};

// 准备发送给API的消息
const prepareMessages = () => {
  // 只发送最近的10条消息，以避免超出token限制
  const recentMessages = messages.value.slice(-10);
  return recentMessages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
};

// 滚动到底部
const scrollToBottom = async () => {
  await nextTick();
  if (messages.value.length > 0) {
    scrollToView.value = "msg-" + (messages.value.length - 1);
  }
};

// 加载更多历史记录
const loadMoreHistory = () => {
  // 暂不实现历史记录加载
};

// 页面加载时初始化聊天
onMounted(() => {
  initChat();
});
</script>

<style>
.ai-chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f6f6f6;
}

.chat-header {
  padding: 30rpx;
  background-color: #8c6e55;
  color: #ffffff;
  text-align: center;
  position: relative;
  padding-top: var(--status-bar-height);
}

.chat-title {
  font-size: 36rpx;
  font-weight: bold;
}

.chat-content {
  flex: 1;
}

.message-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 20rpx;
}

.message-item {
  display: flex;
  margin-bottom: 30rpx;
  align-items: flex-start;
  padding: 0 10rpx;
}

.message-user {
  flex-direction: row-reverse;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  margin: 0 15rpx;
  flex-shrink: 0;
}

.message-bubble {
  max-width: 70%;
  padding: 20rpx;
  border-radius: 20rpx;
  word-break: break-all;
  position: relative;
}

.message-user .message-bubble {
  background-color: #a68dad;
  color: #fff;
  border-top-right-radius: 0;
  margin-right: 10rpx;
}

.message-assistant .message-bubble {
  background-color: #ffffff;
  color: #333333;
  border-top-left-radius: 0;
  margin-left: 10rpx;
}

.message-text {
  font-size: 28rpx;
  line-height: 40rpx;
}

/* 简化版复制按钮样式 */
.simple-copy-button {
  display: block;
  text-align: right;
  font-size: 24rpx;
  color: #a68dad;
  padding-top: 10rpx;
  margin-top: 10rpx;
  border-top: 1px dashed #f0f0f0;
}

/* 打字机效果 */
.typing-animation {
  display: inline-block;
  overflow: hidden;
  white-space: pre-wrap;
  animation: typing 1s steps(30, end);
}

@keyframes typing {
  from {
    max-height: 0;
    opacity: 0;
  }
  to {
    max-height: 1000px;
    opacity: 1;
  }
}

.input-area {
  display: flex;
  padding: 20rpx;
  background-color: #ffffff;
  border-top: 1px solid #eeeeee;
  align-items: flex-end;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.message-input {
  flex: 1;
  padding: 20rpx;
  background-color: #f8f8f8;
  border-radius: 36rpx;
  min-height: 50rpx;
  line-height: 40rpx;
  padding: 15rpx 25rpx;
  border: 1px solid #e0e0e0;
  font-size: 28rpx;
  transition: all 0.3s ease;
  box-shadow: inset 0 1rpx 3rpx rgba(0, 0, 0, 0.05);
}

.message-input:focus {
  border-color: #c4ae87;
  background-color: #ffffff;
}

.send-button {
  width: 120rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20rpx;
  background-color: #c4ae87;
  border-radius: 36rpx;
  transition: all 0.3s ease;
}

.send-button:active {
  transform: scale(0.95);
  background-color: #b39d76;
}

.button-disabled {
  background-color: #d9d9d9;
  opacity: 0.7;
}

.send-text {
  font-size: 28rpx;
  color: #ffffff;
  font-weight: 500;
}

/* 加载动画样式 */
.loading-bubble {
  min-width: 100rpx;
  min-height: 60rpx;
}

.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 50%;
  background-color: #c4ae87;
  margin: 0 6rpx;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
</style>
