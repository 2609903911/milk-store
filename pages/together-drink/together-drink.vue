<template>
    <view class="together-drink-container">
        <!-- 顶部商品展示区 -->
        <view class="product-area">
            <image
                class="product-image"
                :src="product.imageUrl"
                mode="aspectFill"
            ></image>
            <view class="product-info">
                <view class="product-name">{{ product.name }}</view>
                <view class="product-desc">{{ product.description }}</view>
                <view class="product-price">¥{{ product.price }}</view>
            </view>
        </view>

        <!-- 参与者信息区 -->
        <view class="participants-area">
            <view class="participant-title">参与者</view>
            <view class="participants-box">
                <!-- 创建者信息 -->
                <view class="participant-item">
                    <image
                        class="participant-avatar"
                        :src="userInfo.avatar || '/static/images/avatar.png'"
                        mode="aspectFill"
                    ></image>
                    <view class="participant-name">{{
                        userInfo.nickname || '我'
                    }}</view>
                    <view class="participant-tag creator">发起者</view>
                </view>

                <!-- 被邀请者信息（如果已加入） -->
                <view
                    class="participant-item"
                    v-if="state === 'joined' || state === 'ready'"
                >
                    <image
                        class="participant-avatar"
                        :src="partnerInfo.avatar || '/static/images/avatar.png'"
                        mode="aspectFill"
                    ></image>
                    <view class="participant-name">{{
                        partnerInfo.nickname || '好友'
                    }}</view>
                    <view class="participant-tag partner">参与者</view>
                </view>

                <!-- 等待加入占位 -->
                <view
                    class="participant-item empty"
                    v-if="state === 'waiting' || state === 'initial'"
                >
                    <view class="empty-avatar">
                        <uni-icons
                            type="contact"
                            size="30"
                            color="#CCCCCC"
                        ></uni-icons>
                    </view>
                    <view class="empty-text">等待好友加入...</view>
                </view>
            </view>
        </view>

        <!-- 邀请操作区 -->
        <view class="action-area">
            <!-- 初始状态：选择创建邀请或加入邀请 -->
            <view class="initial-actions" v-if="state === 'initial'">
                <button class="action-button primary" @tap="generateInviteCode">
                    创建邀请
                </button>
                <view class="divider">
                    <view class="line"></view>
                    <text>或</text>
                    <view class="line"></view>
                </view>
                <view class="join-form">
                    <input
                        class="invite-input"
                        v-model="inputCode"
                        placeholder="输入8位邀请码"
                        maxlength="8"
                        @input="formatInviteCode"
                    />
                    <button
                        class="action-button join"
                        @tap="joinByCode"
                        :disabled="!inputCode || inputCode.length < 8"
                    >
                        加入邀请
                    </button>
                </view>
            </view>

            <!-- 等待状态：显示邀请码和倒计时 -->
            <view class="waiting-actions" v-if="state === 'waiting'">
                <view class="code-display">
                    <text class="code-label">邀请码</text>
                    <text class="code-value">{{ inviteCode }}</text>
                    <button class="copy-button" @tap="copyInviteCode">
                        复制
                    </button>
                </view>
                <view class="countdown">
                    <text class="countdown-text"
                        >有效期：{{ formatCountdown }}</text
                    >
                </view>
                <button class="action-button cancel" @tap="cancelInvite">
                    取消邀请
                </button>
            </view>

            <!-- 已加入状态：显示邀请者信息 -->
            <view class="joined-actions" v-if="state === 'joined'">
                <view class="join-success">
                    <uni-icons
                        type="checkbox-filled"
                        size="24"
                        color="#07c160"
                    ></uni-icons>
                    <text>已成功加入{{ partnerInfo.nickname }}的邀请</text>
                </view>
            </view>

            <!-- 准备状态：显示支付按钮 -->
            <view class="ready-actions" v-if="state === 'ready'">
                <view class="total-price">
                    <text class="price-label">总计</text>
                    <text class="price-value">¥{{ totalPrice }}</text>
                </view>
                <button
                    class="action-button primary pay-button"
                    @tap="payOrder"
                >
                    立即支付
                </button>
            </view>
        </view>

        <!-- 底部说明区 -->
        <view class="instruction-area">
            <view class="instruction-title">
                <view class="title-icon"></view>
                <text>活动说明</text>
            </view>
            <view class="instruction-content">
                <text class="instruction-item"
                    >1. 邀请好友一起喝，共享欢乐时光</text
                >
                <text class="instruction-item"
                    >2. 邀请码有效期为10分钟，请及时分享给好友</text
                >
                <text class="instruction-item"
                    >3. 每位用户仅能邀请一位好友共享套餐</text
                >
                <text class="instruction-item"
                    >4. 支付完成后，可到店出示订单号领取商品</text
                >
                <text class="instruction-item">5. 本活动解释权归本店所有</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { toast } from '/utils/uniUtils'
import { userData, initUserData } from '/utils/userData'
import { fetchProductById } from '/utils/api/productApi'

// 状态：initial(初始), waiting(等待加入), joined(已加入), ready(准备支付)
const state = ref('initial')

// 商品信息
const product = ref({
    id: 1,
    name: '奶茶双人套餐',
    description: '两杯奶茶，一份甜蜜',
    price: 39.9,
    imageUrl: '/static/images/default-product.png'
})

// 总价
const totalPrice = computed(() => {
    return product.value.price
})

// 用户信息
const userInfo = computed(() => {
    return {
        id: userData.userId,
        nickname: userData.nickname,
        avatar: userData.avatar
    }
})

// 参与者信息
const partnerInfo = ref({
    id: '',
    nickname: '',
    avatar: ''
})

// 邀请码
const inviteCode = ref('')
const inputCode = ref('')

// 倒计时
const countdown = ref(600) // 10分钟
const countdownTimer = ref(null)

// 获取商品信息
const fetchProductInfo = async (productId = 1) => {
    try {
        toast('加载商品信息...', 'loading')
        const productData = await fetchProductById(productId)

        if (productData) {
            product.value = {
                id: productData.id,
                name: productData.name,
                description: productData.description || '特选双人奶茶套餐',
                price: productData.price,
                imageUrl:
                    productData.imageUrl || '/static/images/default-product.png'
            }
            toast('商品信息加载成功', 'success', 500)
        }
    } catch (error) {
        console.error('获取商品信息失败:', error)
        toast('获取商品信息失败，使用默认商品', 'none', 2000)
    }
}

// 格式化倒计时
const formatCountdown = computed(() => {
    const minutes = Math.floor(countdown.value / 60)
    const seconds = countdown.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
})

// 生成随机邀请码
const generateInviteCode = () => {
    // 检查用户是否登录
    if (!userData.userId) {
        toast('请先登录后再创建邀请', 'none', 2000)

        // 可以添加跳转到登录页面的逻辑
        setTimeout(() => {
            uni.navigateTo({
                url: '/pages/login/login'
            })
        }, 1500)
        return
    }

    // 生成8位随机字母数字组合
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        )
    }
    inviteCode.value = result

    // 更新状态
    state.value = 'waiting'

    // 启动倒计时
    startCountdown()

    // 提示用户
    toast('邀请已创建，请分享邀请码给好友')
}

// 倒计时
const startCountdown = () => {
    countdownTimer.value = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            // 邀请码过期
            clearInterval(countdownTimer.value)
            if (state.value === 'waiting') {
                state.value = 'initial'
                toast('邀请已过期')
            }
        }
    }, 1000)
}

// 格式化邀请码输入
const formatInviteCode = () => {
    inputCode.value = inputCode.value.toUpperCase()
}

// 通过邀请码加入
const joinByCode = () => {
    if (inputCode.value.length < 8) {
        toast('请输入完整的邀请码')
        return
    }

    // 检查用户是否登录
    if (!userData.userId) {
        toast('请先登录后再加入邀请', 'none', 2000)

        // 可以添加跳转到登录页面的逻辑
        setTimeout(() => {
            uni.navigateTo({
                url: '/pages/login/login'
            })
        }, 1500)
        return
    }

    // 模拟验证邀请码
    toast('正在验证邀请码...', 'loading')
    setTimeout(() => {
        // 假设成功加入
        state.value = 'joined'

        // 模拟设置参与者信息
        partnerInfo.value = {
            id: 'creator123',
            nickname: '奶茶达人',
            avatar: '/static/images/avatar-default.png'
        }

        // 延迟后准备支付
        setTimeout(() => {
            state.value = 'ready'
        }, 2000)

        toast('成功加入邀请', 'success')
    }, 1000)
}

// 复制邀请码
const copyInviteCode = () => {
    uni.setClipboardData({
        data: inviteCode.value,
        success: () => {
            toast('邀请码已复制')
        }
    })
}

// 取消邀请
const cancelInvite = () => {
    state.value = 'initial'
    inviteCode.value = ''
    clearInterval(countdownTimer.value)
    countdown.value = 600
    toast('邀请已取消')
}

// 支付
const payOrder = () => {
    toast('正在处理支付...', 'loading')

    // 检查用户是否登录
    if (!userData.userId) {
        toast('请先登录后再支付', 'none', 2000)

        // 可以添加跳转到登录页面的逻辑
        setTimeout(() => {
            uni.navigateTo({
                url: '/pages/login/login'
            })
        }, 1500)
        return
    }

    // 模拟支付过程
    setTimeout(() => {
        toast('支付成功，订单已创建', 'success')

        // 跳转到订单详情页
        setTimeout(() => {
            const orderId = 'TD' + Date.now() // 生成临时订单ID
            uni.navigateTo({
                url: `/pages/order-detail/order-detail?id=${orderId}`
            })
        }, 1500)
    }, 2000)
}

// 页面加载时
onMounted(() => {
    // 初始化用户数据
    initUserData()
    console.log('用户数据:', userData)

    // 获取默认商品信息（ID为1的奶茶双人套餐）
    fetchProductInfo(1)
})

// 页面卸载时清除定时器
onUnmounted(() => {
    if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
    }
})
</script>

<style lang="scss">
.together-drink-container {
    padding: 20rpx;
    background-color: #f8f8f8;
    min-height: 100vh;

    .product-area {
        background-color: #fff;
        border-radius: 12rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;
        display: flex;

        .product-image {
            width: 200rpx;
            height: 200rpx;
            border-radius: 8rpx;
            margin-right: 20rpx;
        }

        .product-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .product-name {
                font-size: 34rpx;
                font-weight: bold;
                margin-bottom: 10rpx;
            }

            .product-desc {
                font-size: 28rpx;
                color: #666;
                margin-bottom: 20rpx;
            }

            .product-price {
                font-size: 36rpx;
                color: #ff4d4f;
                font-weight: bold;
            }
        }
    }

    .participants-area {
        background-color: #fff;
        border-radius: 12rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;

        .participant-title {
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
        }

        .participants-box {
            display: flex;
            justify-content: space-around;
            padding: 20rpx 0;

            .participant-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 45%;

                .participant-avatar {
                    width: 120rpx;
                    height: 120rpx;
                    border-radius: 60rpx;
                    margin-bottom: 15rpx;
                }

                .participant-name {
                    font-size: 28rpx;
                    margin-bottom: 10rpx;
                }

                .participant-tag {
                    font-size: 24rpx;
                    padding: 4rpx 16rpx;
                    border-radius: 20rpx;

                    &.creator {
                        background-color: #e6f7ff;
                        color: #1890ff;
                    }

                    &.partner {
                        background-color: #f6ffed;
                        color: #52c41a;
                    }
                }

                &.empty {
                    opacity: 0.6;

                    .empty-avatar {
                        width: 120rpx;
                        height: 120rpx;
                        border-radius: 60rpx;
                        background-color: #f0f0f0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 15rpx;
                    }

                    .empty-text {
                        font-size: 28rpx;
                        color: #999;
                    }
                }
            }
        }
    }

    .action-area {
        background-color: #fff;
        border-radius: 12rpx;
        padding: 30rpx 20rpx;
        margin-bottom: 20rpx;

        .initial-actions {
            .action-button {
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 30rpx;

                &.primary {
                    background-color: #1890ff;
                    color: #fff;
                }

                &.join {
                    background-color: #fff;
                    color: #1890ff;
                    border: 1rpx solid #1890ff;
                }
            }

            .divider {
                display: flex;
                align-items: center;
                margin: 30rpx 0;

                .line {
                    flex: 1;
                    height: 1rpx;
                    background-color: #eee;
                }

                text {
                    margin: 0 20rpx;
                    color: #999;
                    font-size: 28rpx;
                }
            }

            .join-form {
                .invite-input {
                    border: 1rpx solid #ddd;
                    border-radius: 8rpx;
                    padding: 15rpx;
                    margin-bottom: 20rpx;
                    font-size: 30rpx;
                    text-align: center;
                    letter-spacing: 5rpx;
                }
            }
        }

        .waiting-actions {
            .code-display {
                background-color: #f9f9f9;
                padding: 20rpx;
                border-radius: 8rpx;
                display: flex;
                align-items: center;
                margin-bottom: 20rpx;

                .code-label {
                    font-size: 28rpx;
                    color: #666;
                    margin-right: 20rpx;
                }

                .code-value {
                    flex: 1;
                    font-size: 36rpx;
                    font-weight: bold;
                    letter-spacing: 5rpx;
                }

                .copy-button {
                    font-size: 26rpx;
                    padding: 6rpx 20rpx;
                    background-color: #1890ff;
                    color: #fff;
                    border-radius: 30rpx;
                    margin-left: 20rpx;
                }
            }

            .countdown {
                text-align: center;
                margin-bottom: 30rpx;

                .countdown-text {
                    font-size: 28rpx;
                    color: #ff4d4f;
                }
            }

            .action-button.cancel {
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 30rpx;
                background-color: #f5f5f5;
                color: #666;
            }
        }

        .joined-actions {
            .join-success {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30rpx;

                uni-icons {
                    margin-right: 10rpx;
                }
            }
        }

        .ready-actions {
            .total-price {
                display: flex;
                justify-content: space-between;
                padding: 20rpx 0;
                margin-bottom: 30rpx;
                border-bottom: 1rpx solid #eee;

                .price-label {
                    font-size: 30rpx;
                    color: #666;
                }

                .price-value {
                    font-size: 36rpx;
                    color: #ff4d4f;
                    font-weight: bold;
                }
            }

            .pay-button {
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                font-size: 30rpx;
                background-color: #ff4d4f;
                color: #fff;
            }
        }
    }

    .instruction-area {
        background-color: #fff;
        border-radius: 12rpx;
        padding: 20rpx;

        .instruction-title {
            display: flex;
            align-items: center;
            margin-bottom: 20rpx;
            font-size: 32rpx;
            font-weight: bold;

            .title-icon {
                width: 8rpx;
                height: 30rpx;
                background-color: #1890ff;
                margin-right: 15rpx;
                border-radius: 4rpx;
            }
        }

        .instruction-content {
            .instruction-item {
                font-size: 28rpx;
                color: #666;
                line-height: 1.6;
                padding: 10rpx 0;
                display: block;
            }
        }
    }
}
</style> 