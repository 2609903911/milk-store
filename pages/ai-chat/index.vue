<template>
    <view class="ai-chat-container">
        <view class="chat-header">
            <text class="chat-title">奶茶AI助手</text>
        </view>

        <scroll-view
            class="chat-content"
            :scroll-y="true"
            :scroll-with-animation="true"
            :scroll-into-view="scrollToView"
            @scrolltoupper="loadMoreHistory"
        >
            <view class="message-container" id="message-container">
                <view
                    v-for="(message, index) in messages"
                    :key="index"
                    :id="'msg-' + index"
                    class="message-item"
                    :class="
                        message.role === 'user'
                            ? 'message-user'
                            : 'message-assistant'
                    "
                >
                    <image
                        class="avatar"
                        :src="
                            message.role === 'user'
                                ? '/static/images/user-avatar.png'
                                : '/static/images/ai-avatar.png'
                        "
                        mode="aspectFill"
                    ></image>
                    <view class="message-bubble">
                        <text class="message-text">{{ message.content }}</text>
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
import { ref, onMounted, nextTick, computed } from 'vue'
import { getAIRequestConfig } from '../../utils/aiConfigService.js'
import { generateSystemPrompt } from '../../utils/aiPromptService.js'

// 聊天消息列表
const messages = ref([])
// 输入的消息
const inputMessage = ref('')
// 加载状态
const loading = ref(false)
// 系统提示词
const systemPrompt = ref('')
// 滚动控制
const scrollToView = ref('')

// 初始化聊天界面
const initChat = async () => {
    loading.value = true

    try {
        // 生成系统提示词
        systemPrompt.value = await generateSystemPrompt()

        // 添加AI的欢迎消息
        messages.value.push({
            role: 'assistant',
            content: '您好！我是奶茶AI助手，有什么可以帮您的吗？'
        })
    } catch (error) {
        console.error('初始化聊天失败:', error)
    } finally {
        loading.value = false
    }
}

// 发送消息
const sendMessage = async () => {
    // 检查消息是否为空
    if (!inputMessage.value.trim() || loading.value) return

    // 添加用户消息到列表
    const userMessage = inputMessage.value.trim()
    messages.value.push({
        role: 'user',
        content: userMessage
    })

    // 清空输入框
    inputMessage.value = ''

    // 滚动到底部
    await scrollToBottom()

    // 设置加载状态
    loading.value = true

    try {
        // 获取请求配置
        const requestConfig = await getAIRequestConfig()
        console.log('发送请求配置:', requestConfig)

        // 发送请求到后端
        uni.request({
            ...requestConfig,
            data: {
                messages: prepareMessages(),
                systemPrompt: systemPrompt.value
            },
            success: (res) => {
                console.log('收到响应:', res)
                if (res.statusCode === 200 && res.data) {
                    // 添加AI回复到消息列表
                    messages.value.push({
                        role: 'assistant',
                        content:
                            res.data.content || '抱歉，我无法理解您的问题。'
                    })
                } else {
                    // 处理错误
                    console.error('响应错误:', res)
                    messages.value.push({
                        role: 'assistant',
                        content: '抱歉，服务出现问题，请稍后再试。'
                    })
                }
            },
            fail: (err) => {
                console.error('请求失败:', err)
                messages.value.push({
                    role: 'assistant',
                    content: '抱歉，网络连接出现问题，请检查您的网络设置。'
                })
            },
            complete: () => {
                loading.value = false
                // 滚动到底部
                scrollToBottom()
            }
        })
    } catch (error) {
        console.error('发送消息失败:', error)
        messages.value.push({
            role: 'assistant',
            content: '抱歉，发生未知错误，请稍后再试。'
        })
        loading.value = false
        // 滚动到底部
        scrollToBottom()
    }
}

// 准备发送给API的消息
const prepareMessages = () => {
    // 只发送最近的10条消息，以避免超出token限制
    const recentMessages = messages.value.slice(-10)
    return recentMessages.map((msg) => ({
        role: msg.role,
        content: msg.content
    }))
}

// 滚动到底部
const scrollToBottom = async () => {
    await nextTick()
    if (messages.value.length > 0) {
        scrollToView.value = 'msg-' + (messages.value.length - 1)
    }
}

// 加载更多历史记录
const loadMoreHistory = () => {
    // 暂不实现历史记录加载
    console.log('加载更多历史记录')
}

// 页面加载时初始化聊天
onMounted(() => {
    initChat()
})
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
    padding: 20rpx;
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
}

.message-user {
    flex-direction: row-reverse;
}

.avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    margin: 0 15rpx;
}

.message-bubble {
    max-width: 70%;
    padding: 20rpx;
    border-radius: 20rpx;
    word-break: break-all;
}

.message-user .message-bubble {
    background-color: #a68dad;
    color: #fff;
    border-top-right-radius: 0;
}

.message-assistant .message-bubble {
    background-color: #ffffff;
    color: #333333;
    border-top-left-radius: 0;
}

.message-text {
    font-size: 28rpx;
    line-height: 40rpx;
}

.input-area {
    display: flex;
    padding: 20rpx;
    background-color: #ffffff;
    border-top: 1px solid #eeeeee;
    align-items: flex-end;
}

.message-input {
    flex: 1;
    padding: 20rpx;
    background-color: #f0f0f0;
    border-radius: 10rpx;
    height: 80rpx;
    line-height: 40rpx;
    padding: 10rpx 20rpx;
    border: 1px solid #dddddd;
    border-radius: 10rpx;
    font-size: 28rpx;
}

.send-btn {
    width: 150rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    margin-left: 20rpx;
    background-color: #12b7f5;
    color: #ffffff;
    border-radius: 10rpx;
    font-size: 28rpx;
}
</style> 