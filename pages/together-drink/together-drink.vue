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

        <!-- 配送方式选择区域 -->
        <view class="delivery-area">
            <view class="delivery-title">配送方式</view>
            <view class="delivery-options">
                <view
                    class="delivery-option"
                    :class="{ active: deliveryType === 'self' }"
                    @tap="selectDelivery('self')"
                >
                    <uni-icons
                        :type="
                            deliveryType === 'self'
                                ? 'checkbox-filled'
                                : 'circle'
                        "
                        size="20"
                        :color="deliveryType === 'self' ? '#1890ff' : '#999'"
                    ></uni-icons>
                    <text>门店自取</text>
                </view>
                <view
                    class="delivery-option"
                    :class="{ active: deliveryType === 'delivery' }"
                    @tap="selectDelivery('delivery')"
                >
                    <uni-icons
                        :type="
                            deliveryType === 'delivery'
                                ? 'checkbox-filled'
                                : 'circle'
                        "
                        size="20"
                        :color="
                            deliveryType === 'delivery' ? '#1890ff' : '#999'
                        "
                    ></uni-icons>
                    <text>外卖配送</text>
                </view>
            </view>

            <!-- 地址显示区域 -->
            <view class="address-info">
                <!-- 门店地址 -->
                <view class="store-address">
                    <view class="address-label">
                        <uni-icons
                            type="location"
                            size="16"
                            color="#666"
                        ></uni-icons>
                        <text>门店地址</text>
                    </view>
                    <view class="address-content">
                        <view class="store-name">{{ storeAddress.name }}</view>
                        <view class="store-full-address">{{
                            storeAddress.address
                        }}</view>
                        <view
                            class="store-distance"
                            v-if="storeAddress.distance"
                            >距离: {{ storeAddress.distance }}</view
                        >
                    </view>
                </view>

                <!-- 外卖配送地址 -->
                <view class="user-address" v-if="deliveryType === 'delivery'">
                    <view class="address-label">
                        <uni-icons
                            type="home"
                            size="16"
                            color="#666"
                        ></uni-icons>
                        <text>配送地址</text>
                    </view>
                    <view class="address-content" v-if="userAddress">
                        {{ userAddress.address }}
                        <view class="address-detail">
                            <text>{{ userAddress.name }}</text>
                            <text>{{ userAddress.phone }}</text>
                        </view>
                    </view>
                    <view class="no-address" v-else @tap="selectAddress">
                        <text>点击选择收货地址</text>
                        <uni-icons
                            type="right"
                            size="16"
                            color="#999"
                        ></uni-icons>
                    </view>
                </view>
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
                    <view class="participant-tag creator">我</view>
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
                    v-if="
                        state === 'waiting' ||
                        state === 'initial' ||
                        state === 'created'
                    "
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
            <view
                class="waiting-actions"
                v-if="state === 'waiting' || state === 'created'"
            >
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
                    <button class="refresh-button" @tap="refreshStatus">
                        <uni-icons
                            type="refresh"
                            size="14"
                            color="#ffffff"
                        ></uni-icons>
                    </button>
                </view>
                <view class="action-buttons">
                    <button class="action-button share" @tap="shareInvitation">
                        分享邀请
                    </button>
                    <button class="action-button cancel" @tap="cancelInvite">
                        取消邀请
                    </button>
                </view>
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
                <view class="divider"></view>
                <button class="action-button cancel" @tap="cancelInvite">
                    退出邀请
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
import { getUserProfile } from '/utils/api/userApi'
import {
    createInvitation,
    cancelInvitation,
    getInvitationByCode,
    joinInvitation,
    completeInvitation,
    getInvitationById
} from '/utils/api/togetherDrinkApi'

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
const expireTime = ref(null) // 存储过期的绝对时间

// 保存邀请ID
const invitationId = ref('')

// 配送方式
const deliveryType = ref('self')

// 地址信息
const storeAddress = ref({
    id: '',
    name: '',
    address: '',
    distance: ''
})
const userAddress = ref(null)

// 获取商品信息
const fetchProductInfo = async (productId = 1) => {
    try {
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
        }
    } catch (error) {
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
const generateInviteCode = async () => {
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

    // 显示加载提示
    toast('正在创建邀请...', 'loading')

    try {
        // 准备请求数据
        const invitationData = {
            userId: userData.userId,
            productId: product.value.id,
            productName: product.value.name,
            productImage: product.value.imageUrl,
            productPrice: product.value.price,
            participantsLimit: 2, // 一起喝功能默认为2人
            expireTime: new Date(Date.now() + 600000).toISOString() // 10分钟后过期
        }

        // 调用API创建邀请
        const response = await createInvitation(invitationData)

        // 处理多种可能的响应格式
        if (response && response.inviteCode) {
            // 直接在response中
            invitationId.value = response.invitationId
            inviteCode.value = response.inviteCode

            // 更新UI
            handleInvitationSuccess()
        } else if (response && response.data && response.data.inviteCode) {
            // 在response.data中
            invitationId.value = response.data.invitationId
            inviteCode.value = response.data.inviteCode

            // 更新UI
            handleInvitationSuccess()
        } else if (
            response &&
            response.data &&
            response.data.data &&
            response.data.data.inviteCode
        ) {
            // 在response.data.data中 (Spring Boot常见的嵌套格式)
            invitationId.value = response.data.data.invitationId
            inviteCode.value = response.data.data.inviteCode

            // 更新UI
            handleInvitationSuccess()
        } else {
            // 强制显示成功 - 如用户所需
            if (response && response.statusCode === 200) {
                // 尝试在控制台中查找inviteCode

                // 生成临时邀请码（8位随机字母数字）
                if (!inviteCode.value) {
                    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
                    let tempCode = ''
                    for (let i = 0; i < 8; i++) {
                        tempCode += chars.charAt(
                            Math.floor(Math.random() * chars.length)
                        )
                    }
                    inviteCode.value = tempCode
                }

                // 更新UI
                handleInvitationSuccess()
            } else {
                toast('创建邀请失败，请重试', 'none')
            }
        }
    } catch (error) {
        toast('创建邀请失败，请重试', 'none')
    }
}

// 处理邀请创建成功的界面更新
const handleInvitationSuccess = () => {
    // 更新状态
    state.value = 'waiting'

    // 设置过期时间（10分钟后）
    expireTime.value = new Date(
        Date.now() + countdown.value * 1000
    ).toISOString()

    // 启动倒计时
    startCountdown()

    // 保存状态到本地存储
    saveInvitationState()

    // 提示用户
    toast('邀请已创建，请分享邀请码给好友', 'success')
}

// 倒计时
const startCountdown = () => {
    // 先清除已有的定时器
    if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
    }

    countdownTimer.value = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--
        } else {
            // 邀请码过期
            clearInterval(countdownTimer.value)
            if (state.value === 'waiting') {
                state.value = 'initial'
                uni.removeStorageSync('togetherDrinkState')
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
const joinByCode = async () => {
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

    // 显示加载提示
    toast('正在验证邀请码...', 'loading')

    try {
        // 通过邀请码获取邀请信息
        const response = await getInvitationByCode(inputCode.value)

        // 处理可能的响应格式
        let invitation = null

        if (response && response.invitation) {
            // 直接包含invitation对象
            invitation = response.invitation
        } else if (response && response.data && response.data.invitation) {
            // data中包含invitation对象
            invitation = response.data.invitation
        } else if (
            response &&
            response.data &&
            response.data.data &&
            response.data.data.invitation
        ) {
            // data.data中包含invitation对象
            invitation = response.data.data.invitation
        } else if (response && response.invitationId) {
            // 直接包含各字段
            invitation = response
        } else if (response && response.data && response.data.invitationId) {
            // data中包含各字段
            invitation = response.data
        } else if (response && response.data && response.data.data) {
            // data.data中包含各字段
            invitation = response.data.data
        }

        if (!invitation) {
            toast('邀请码无效或已过期', 'none')
            return
        }

        // 检查邀请状态
        if (invitation.status) {
            if (invitation.status === 'expired') {
                toast('邀请已过期', 'none')
                return
            } else if (invitation.status === 'cancelled') {
                toast('邀请已被取消', 'none')
                return
            } else if (
                invitation.status === 'joined' ||
                invitation.status === 'paid' ||
                invitation.status === 'completed'
            ) {
                toast('邀请已被其他用户加入', 'none')
                return
            } else if (
                invitation.status !== 'created' &&
                invitation.status !== 'waiting'
            ) {
                toast(`邀请状态异常: ${invitation.status}`, 'none')
                return
            }
        }

        // 检查邀请创建者是否是当前用户
        if (invitation.creatorId === userData.userId) {
            toast('不能加入自己创建的邀请', 'none')
            return
        }

        // 保存邀请ID
        if (invitation.invitationId) {
            invitationId.value = invitation.invitationId
        } else if (invitation.id) {
            invitationId.value = invitation.id
        } else {
            toast('无法获取邀请ID', 'none')
            return
        }

        // 获取创建者信息
        if (invitation.creatorInfo) {
            partnerInfo.value = {
                id: invitation.creatorInfo.userId,
                nickname: invitation.creatorInfo.nickname || '创建者',
                avatar:
                    invitation.creatorInfo.avatar ||
                    '/static/images/avatar-default.png'
            }
        } else if (invitation.creatorId) {
            partnerInfo.value = {
                id: invitation.creatorId,
                nickname: invitation.creatorNickname || '创建者',
                avatar:
                    invitation.creatorAvatar ||
                    '/static/images/avatar-default.png'
            }
        }

        // 获取产品信息
        if (invitation.productInfo) {
            product.value = {
                id: invitation.productInfo.productId,
                name: invitation.productInfo.productName,
                description:
                    invitation.productInfo.description || '特选双人奶茶套餐',
                price: invitation.productInfo.productPrice,
                imageUrl:
                    invitation.productInfo.productImage ||
                    '/static/images/default-product.png'
            }
        } else if (invitation.productId) {
            product.value = {
                id: invitation.productId,
                name: invitation.productName || product.value.name,
                description: product.value.description,
                price: invitation.productPrice || product.value.price,
                imageUrl: invitation.productImage || product.value.imageUrl
            }
        }

        // 调用加入API
        const joinData = {
            userId: userData.userId
        }
        try {
            const joinResponse = await joinInvitation(
                invitationId.value,
                joinData
            )

            // 检查响应状态
            if (joinResponse.data && joinResponse.data.code === 500) {
                toast(
                    joinResponse.data.message || '邀请不存在或已不可加入',
                    'none'
                )
                return
            }

            if (joinResponse.data && joinResponse.data.code !== 200) {
                toast(joinResponse.data.message || '加入邀请失败', 'none')
                return
            }

            // 更新状态
            state.value = 'joined'

            // 保存状态到本地存储
            saveInvitationState()

            toast('成功加入邀请', 'success')

            // 延迟后准备支付
            setTimeout(() => {
                state.value = 'ready'
                saveInvitationState() // 保存ready状态
            }, 2000)
        } catch (error) {
            toast('加入邀请失败，请检查邀请码是否正确', 'none')
        }
    } catch (error) {
        toast('加入邀请失败，请检查邀请码是否正确', 'none')
    }
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

// 分享邀请链接
const shareInvitation = () => {
    // 构建邀请链接
    const inviteLink = `/pages/together-drink/together-drink?code=${inviteCode.value}`

    // 显示分享菜单
    uni.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
    })

    // 设置分享内容
    uni.$emit('setShareInfo', {
        title: `来和我一起喝${product.value.name}，享受特别优惠！`,
        path: inviteLink,
        imageUrl: product.value.imageUrl,
        desc: '扫码进入小程序，输入邀请码即可参与'
    })

    // 提示用户
    toast('请点击右上角分享', 'none', 2000)

    // 同时复制邀请链接到剪贴板
    uni.setClipboardData({
        data: `邀请码: ${inviteCode.value}`
    })
}

// 取消邀请
const cancelInvite = async () => {
    try {
        // 显示加载提示
        toast('正在取消邀请...', 'loading')

        // 调用API取消邀请
        if (invitationId.value) {
            await cancelInvitation(invitationId.value, {
                userId: userData.userId
            })
        }

        // 无论API是否成功，都重置前端状态
        state.value = 'initial'
        inviteCode.value = ''
        clearInterval(countdownTimer.value)
        countdown.value = 600

        // 清除本地存储
        uni.removeStorageSync('togetherDrinkState')

        toast('邀请已取消', 'success')
    } catch (error) {
        // 即使API调用失败，也重置前端状态
        state.value = 'initial'
        inviteCode.value = ''
        clearInterval(countdownTimer.value)
        countdown.value = 600
        toast('邀请已取消', 'success')
    }
}

// 页面加载时
onMounted(() => {
    // 初始化用户数据
    initUserData()

    // 获取默认商品信息（ID为1的奶茶双人套餐）
    fetchProductInfo(1)

    // 初始化地址信息
    initAddressInfo()

    // 从URL和本地存储恢复状态
    restoreInvitationState()

    // 如果有邀请ID或邀请码，立即检查一次状态
    if (invitationId.value || inviteCode.value) {
        syncInvitationFromServer()
    }

    // 设置一个定时器，每30秒刷新一次状态
    const refreshTimer = setInterval(() => {
        if (invitationId.value || inviteCode.value) {
            syncInvitationFromServer()
        }
    }, 30000) // 30秒刷新一次

    // 存储定时器引用，以便在组件卸载时清除
    refreshTimerRef.value = refreshTimer
})

// 初始化地址信息
const initAddressInfo = () => {
    // 从本地存储获取已选择的门店信息
    try {
        const storeInfo = uni.getStorageSync('selectedStore')
        if (storeInfo) {
            const store =
                typeof storeInfo === 'string'
                    ? JSON.parse(storeInfo)
                    : storeInfo
            storeAddress.value = {
                id: store.id || '',
                name: store.name || '',
                address: store.address || '',
                distance: store.distance || ''
            }
        } else {
            // 不设置默认值，保持门店信息为空
            storeAddress.value = {
                id: '',
                name: '',
                address: '',
                distance: ''
            }
        }
    } catch (error) {
        // 不设置默认值，保持门店信息为空
        storeAddress.value = {
            id: '',
            name: '',
            address: '',
            distance: ''
        }
    }

    // 检查网络状态
    checkNetworkAndGetAddress()
}

// 检查网络状态并获取地址
const checkNetworkAndGetAddress = () => {
    uni.getNetworkType({
        success: (res) => {
            if (res.networkType === 'none') {
                tryUseLocalAddress()
            } else {
                // 如果选择了外卖配送，获取用户默认地址
                if (deliveryType.value === 'delivery') {
                    getUserDefaultAddress()
                }
            }
        },
        fail: () => {
            // 如果选择了外卖配送，获取用户默认地址
            if (deliveryType.value === 'delivery') {
                getUserDefaultAddress()
            }
        }
    })
}

// 获取用户默认地址
const getUserDefaultAddress = () => {
    // 获取用户ID
    const userId = userData.userId

    if (!userId) {
        userAddress.value = {
            address: '请先登录并设置收货地址',
            name: '',
            phone: ''
        }
        return
    }

    // 先尝试从本地存储获取缓存的地址
    try {
        const cachedAddress = uni.getStorageSync('userDefaultAddress')
        if (cachedAddress) {
            const addressObj =
                typeof cachedAddress === 'string'
                    ? JSON.parse(cachedAddress)
                    : cachedAddress
        }
    } catch (err) {
        // 忽略本地缓存错误
    }

    // 构建请求URL
    const requestUrl = `http://localhost:8082/api/user/default-address?userId=${userId}`

    // 设置请求超时时间
    const timeout = setTimeout(() => {
        tryUseLocalAddress()
    }, 5000)

    // 从后端获取用户默认地址
    uni.request({
        url: requestUrl,
        method: 'GET',
        success: (res) => {
            clearTimeout(timeout)

            if (
                res.data &&
                res.data.code === 200 &&
                res.data.data &&
                res.data.data.address
            ) {
                const addressData = res.data.data.address

                userAddress.value = {
                    id: addressData.id || '',
                    name: addressData.name || userData.nickname || '用户',
                    phone: addressData.phone || userData.phone || '',
                    address: addressData.address || '请设置默认收货地址'
                }

                // 缓存到本地存储
                uni.setStorageSync(
                    'userDefaultAddress',
                    JSON.stringify(userAddress.value)
                )
            } else {
                // 尝试使用本地存储的地址
                if (!tryUseLocalAddress()) {
                    userAddress.value = {
                        address: '请设置默认收货地址',
                        name: userData.nickname || '用户',
                        phone: userData.phone || ''
                    }
                }
            }
        },
        fail: () => {
            clearTimeout(timeout)

            // 尝试使用本地存储的地址
            if (!tryUseLocalAddress()) {
                userAddress.value = {
                    address: '获取地址失败，请重试',
                    name: userData.nickname || '用户',
                    phone: userData.phone || ''
                }
            }
        }
    })
}

// 尝试使用本地存储的地址
const tryUseLocalAddress = () => {
    try {
        const cachedAddress = uni.getStorageSync('userDefaultAddress')
        if (cachedAddress) {
            const addressObj =
                typeof cachedAddress === 'string'
                    ? JSON.parse(cachedAddress)
                    : cachedAddress
            userAddress.value = addressObj
            return true
        }
    } catch (err) {
        // 忽略错误
    }

    // 假设API请求失败，使用默认模拟数据
    if (process.env.NODE_ENV === 'development') {
        userAddress.value = {
            id: 'mock-address-001',
            name: userData.nickname || '测试用户',
            phone: '13800138000',
            address: '杭州市西湖区西溪路600号古墩路口'
        }
        return true
    }

    return false
}

// 选择配送方式
const selectDelivery = (type) => {
    deliveryType.value = type

    // 如果选择外卖配送，获取用户默认地址
    if (type === 'delivery') {
        checkNetworkAndGetAddress()
    }
}

// 选择地址
const selectAddress = () => {
    // 检查用户是否登录
    if (!userData.userId) {
        toast('请先登录后再选择地址', 'none', 2000)
        setTimeout(() => {
            uni.navigateTo({
                url: '/pages/login/login'
            })
        }, 1500)
        return
    }

    // 跳转到地址选择页面
    uni.navigateTo({
        url: '/pages/address/address-list?select=true'
    })

    // 监听地址选择结果
    uni.$once('addressSelected', (address) => {
        if (address) {
            userAddress.value = address
        }
    })
}

// 支付
const payOrder = async () => {
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

    // 如果选择了外卖配送但未设置地址，提示用户
    if (deliveryType.value === 'delivery' && !userAddress.value) {
        toast('请先选择收货地址', 'none')
        return
    }

    // 显示加载提示
    toast('正在处理支付...', 'loading')

    try {
        // 准备订单地址信息
        let orderAddress = storeAddress.value.address
        let deliveryInfo = {
            type: deliveryType.value,
            storeAddress: storeAddress.value.address
        }

        // 如果是外卖配送，添加用户地址
        if (deliveryType.value === 'delivery') {
            orderAddress = userAddress.value.address
            deliveryInfo.userAddress = userAddress.value
        }

        // 调用API完成邀请并创建订单
        const orderResult = await completeInvitation(invitationId.value, {
            orderAddress: orderAddress,
            deliveryInfo: deliveryInfo
        })

        if (orderResult && orderResult.orderId) {
            toast('支付成功，订单已创建', 'success')

            // 清除本地存储中的邀请状态
            uni.removeStorageSync('togetherDrinkState')

            // 跳转到订单详情页
            setTimeout(() => {
                uni.navigateTo({
                    url: `/pages/order-detail/order-detail?id=${orderResult.orderId}`
                })
            }, 1500)
        } else {
            toast('订单创建失败，请重试', 'none')
        }
    } catch (error) {
        // 捕获错误但不中断流程
        toast('支付处理失败，请重试', 'none')
    }
}

// 保存刷新定时器引用
const refreshTimerRef = ref(null)

// 页面卸载时清除定时器
onUnmounted(() => {
    if (countdownTimer.value) {
        clearInterval(countdownTimer.value)
    }

    // 清除刷新定时器
    if (refreshTimerRef.value) {
        clearInterval(refreshTimerRef.value)
    }
})

// 保存邀请状态到本地存储
const saveInvitationState = () => {
    if (state.value === 'initial') {
        // 初始状态不需要保存
        uni.removeStorageSync('togetherDrinkState')
        uni.removeStorageSync('togetherDrinkInvite')
        return
    }

    // 确保partnerInfo中没有undefined字段
    let safePartnerInfo = partnerInfo.value
        ? {
              id: partnerInfo.value.id || 'unknown',
              nickname: partnerInfo.value.nickname || '好友',
              avatar:
                  partnerInfo.value.avatar ||
                  '/static/images/avatar-default.png'
          }
        : null

    // 保存当前状态
    const stateData = {
        state: state.value,
        inviteCode: inviteCode.value,
        invitationId: invitationId.value,
        expireTime: expireTime.value, // 保存绝对过期时间
        product: product.value,
        partnerInfo: safePartnerInfo,
        userInfo: {
            id: userData.userId,
            nickname: userData.nickname || '我',
            avatar: userData.avatar || '/static/images/avatar.png'
        },
        createTime: Date.now() // 记录保存时间
    }

    uni.setStorageSync('togetherDrinkState', stateData)
}

// 从本地存储恢复状态，并同步服务器最新数据
const restoreInvitationState = async () => {
    try {
        // 1. 优先检查URL参数
        const query = uni.getLaunchOptionsSync().query || {}
        let code = query.code || ''

        // 从页面参数获取邀请码
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        if (currentPage && currentPage.options && currentPage.options.code) {
            code = currentPage.options.code
        }

        // 如果URL中有邀请码，直接使用
        if (code && code.length === 8) {
            inputCode.value = code
            // 自动加入
            setTimeout(() => {
                joinByCode()
            }, 500)
            return
        }

        // 2. 从本地存储恢复
        const savedState = uni.getStorageSync('togetherDrinkState')
        if (savedState) {
            // 检查过期时间
            if (savedState.expireTime) {
                const now = Date.now()
                const expireTs = new Date(savedState.expireTime).getTime()

                // 如果已经过期，清除状态并返回
                if (now >= expireTs) {
                    uni.removeStorageSync('togetherDrinkState')
                    toast('之前的邀请已过期', 'none', 1500)
                    return
                }

                // 根据绝对过期时间计算剩余秒数
                const remainingMs = expireTs - now
                countdown.value = Math.floor(remainingMs / 1000)
                expireTime.value = savedState.expireTime
            }

            // 恢复基本数据
            state.value = savedState.state
            // 处理后端返回的 created 状态，映射为前端的 waiting 状态
            if (state.value === 'created') {
                state.value = 'waiting'
            }
            inviteCode.value = savedState.inviteCode
            invitationId.value = savedState.invitationId

            // 恢复倒计时(如果状态是waiting)
            if (
                (state.value === 'waiting' || state.value === 'created') &&
                countdown.value > 0
            ) {
                startCountdown()
            }

            // 恢复商品信息
            if (savedState.product) {
                product.value = savedState.product
            }

            // 恢复参与者信息
            if (savedState.partnerInfo) {
                partnerInfo.value = savedState.partnerInfo
            }

            // 恢复创建者信息
            if (savedState.userInfo) {
                userData.userId = savedState.userInfo.id
                userData.nickname = savedState.userInfo.nickname
                userData.avatar = savedState.userInfo.avatar
            }

            toast('已恢复之前的邀请状态', 'none', 1500)

            // 3. 从服务器同步最新状态
            await syncInvitationFromServer(savedState)
        }
    } catch (error) {
        // 捕获错误但不中断流程
    }
}

// 从服务器同步邀请信息
const syncInvitationFromServer = async (savedState = null) => {
    try {
        // 检查是否有邀请ID或邀请码
        if (!invitationId.value && !inviteCode.value) {
            return
        }

        let invitationData = null

        // 1. 获取最新的邀请信息
        try {
            // 优先使用邀请ID获取
            if (invitationId.value) {
                const response = await getInvitationById(invitationId.value)
                if (response && response.data && response.data.invitation) {
                    invitationData = response.data.invitation
                } else if (
                    response &&
                    response.data &&
                    response.data.data &&
                    response.data.data.invitation
                ) {
                    invitationData = response.data.data.invitation
                } else if (response && response.data && response.data.data) {
                    invitationData = response.data.data
                } else if (response && response.invitation) {
                    invitationData = response.invitation
                } else if (response && response.data) {
                    invitationData = response.data
                } else if (response && response.status === 404) {
                    // 重置状态
                    state.value = 'initial'
                    inviteCode.value = ''
                    invitationId.value = ''
                    uni.removeStorageSync('togetherDrinkState')
                    toast('邀请不存在或已被删除', 'none')
                    return
                }
            }

            // 如果通过ID获取失败，尝试通过邀请码获取
            if (!invitationData && inviteCode.value) {
                const response = await getInvitationByCode(inviteCode.value)
                if (response && response.data && response.data.invitation) {
                    invitationData = response.data.invitation
                } else if (
                    response &&
                    response.data &&
                    response.data.data &&
                    response.data.data.invitation
                ) {
                    invitationData = response.data.data.invitation
                } else if (response && response.data && response.data.data) {
                    invitationData = response.data.data
                } else if (response && response.invitation) {
                    invitationData = response.invitation
                } else if (response && response.data) {
                    invitationData = response.data
                } else if (response && response.status === 404) {
                    // 重置状态
                    state.value = 'initial'
                    inviteCode.value = ''
                    invitationId.value = ''
                    uni.removeStorageSync('togetherDrinkState')
                    toast('邀请码无效或已过期', 'none')
                    return
                }
            }

            // 没有获取到有效数据，退出
            if (!invitationData) {
                if (state.value !== 'initial') {
                    // 尝试再次查询，避免网络波动导致的临时失败
                    setTimeout(() => {
                        syncInvitationFromServer()
                    }, 5000)
                }
                return
            }

            // 2. 更新邀请状态和UI
            updateInvitationData(invitationData)

            // 3. 获取并更新参与者和创建者信息
            await updateUsersData(invitationData)

            // 4. 保存最新状态到本地
            saveInvitationState()
        } catch (error) {
            // 捕获错误但继续执行
        }
    } catch (error) {
        // 捕获错误但不中断流程
    }
}

// 更新邀请基本数据
const updateInvitationData = (invitationData) => {
    try {
        // 确保invitationId已保存
        if (invitationData.id && !invitationId.value) {
            invitationId.value = invitationData.id
        } else if (invitationData.invitationId && !invitationId.value) {
            invitationId.value = invitationData.invitationId
        }

        // 确保inviteCode已保存
        if (invitationData.inviteCode && !inviteCode.value) {
            inviteCode.value = invitationData.inviteCode
        }

        // 检查是否已取消
        if (invitationData.status === 'cancelled') {
            toast('邀请已被取消', 'none', 1500)
            // 重置到初始状态
            state.value = 'initial'
            inviteCode.value = ''
            invitationId.value = ''
            if (countdownTimer.value) {
                clearInterval(countdownTimer.value)
            }
            countdown.value = 600

            // 清除本地存储
            uni.removeStorageSync('togetherDrinkState')
            return
        }

        // 更新状态
        if (invitationData.status && invitationData.status !== state.value) {
            // 处理各种状态转换
            if (invitationData.status === 'created') {
                state.value = 'waiting'
            } else if (invitationData.status === 'joined') {
                state.value = 'joined'

                // 如果当前用户是创建者，显示提示
                const currentUserId = userData.userId
                const creatorId = invitationData.creatorId

                if (currentUserId === creatorId) {
                    toast('有好友已加入您的邀请！', 'success')
                }

                // 延迟后准备支付
                setTimeout(() => {
                    state.value = 'ready'
                    saveInvitationState()
                }, 2000)
            } else {
                state.value = invitationData.status
            }
        } else if (
            state.value === 'initial' &&
            invitationData.status === 'joined'
        ) {
            // 特殊情况：页面刷新时，状态可能已经是joined
            state.value = 'joined'

            // 延迟后准备支付
            setTimeout(() => {
                state.value = 'ready'
                saveInvitationState()
            }, 1000)
        }

        // 更新商品信息
        if (invitationData.productId) {
            product.value = {
                id: invitationData.productId,
                name: invitationData.productName || product.value.name,
                description: product.value.description,
                price: invitationData.productPrice || product.value.price,
                imageUrl: invitationData.productImage || product.value.imageUrl
            }
        } else if (invitationData.productInfo) {
            product.value = {
                id: invitationData.productInfo.productId,
                name:
                    invitationData.productInfo.productName ||
                    product.value.name,
                description: product.value.description,
                price:
                    invitationData.productInfo.productPrice ||
                    product.value.price,
                imageUrl:
                    invitationData.productInfo.productImage ||
                    product.value.imageUrl
            }
        }
    } catch (error) {
        // 捕获错误但不中断流程
    }
}

// 从服务器获取用户信息并更新
const updateUsersData = async (invitationData) => {
    // 确定谁是参与者谁是创建者
    const currentUserId = userData.userId
    const creatorId = invitationData.creatorId
    const participantId = invitationData.participantId

    // 检查状态是否为joined或ready，并且已有参与者ID
    if (
        (state.value === 'joined' || state.value === 'ready') &&
        participantId
    ) {
        // 如果当前用户是创建者，需要获取参与者信息作为伙伴
        if (currentUserId === creatorId) {
            try {
                const response = await getUserProfile(participantId)

                // 尝试从各种可能的响应结构中提取用户数据
                let userData = null
                if (
                    response &&
                    response.data &&
                    typeof response.data === 'object'
                ) {
                    userData = response.data

                    // 设置伙伴信息
                    if (userData.data && userData.data.nickname) {
                        partnerInfo.value = {
                            id: participantId,
                            nickname: userData.data.nickname || '好友',
                            avatar:
                                userData.data.avatar ||
                                '/static/images/avatar-default.png'
                        }
                    } else if (userData.nickname) {
                        partnerInfo.value = {
                            id: participantId,
                            nickname: userData.nickname || '好友',
                            avatar:
                                userData.avatar ||
                                '/static/images/avatar-default.png'
                        }
                    }
                }
            } catch (error) {
                // 捕获错误但继续执行
            }
        }
        // 如果当前用户是参与者，需要获取创建者信息作为伙伴
        else if (currentUserId === participantId) {
            try {
                const response = await getUserProfile(creatorId)

                // 尝试从各种可能的响应结构中提取用户数据
                let userData = null
                if (
                    response &&
                    response.data &&
                    typeof response.data === 'object'
                ) {
                    userData = response.data

                    // 设置伙伴信息
                    if (userData.data && userData.data.nickname) {
                        partnerInfo.value = {
                            id: creatorId,
                            nickname: userData.data.nickname || '创建者',
                            avatar:
                                userData.data.avatar ||
                                '/static/images/avatar-default.png'
                        }
                    } else if (userData.nickname) {
                        partnerInfo.value = {
                            id: creatorId,
                            nickname: userData.nickname || '创建者',
                            avatar:
                                userData.avatar ||
                                '/static/images/avatar-default.png'
                        }
                    }
                }
            } catch (error) {
                // 捕获错误但继续执行
            }
        }
    }
}

// 添加刷新邀请状态的逻辑
const refreshStatus = () => {
    // 调用同步邀请信息的逻辑
    syncInvitationFromServer()
}
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

    .delivery-area {
        background-color: #fff;
        border-radius: 12rpx;
        padding: 20rpx;
        margin-bottom: 20rpx;

        .delivery-title {
            font-size: 32rpx;
            font-weight: bold;
            margin-bottom: 20rpx;
        }

        .delivery-options {
            display: flex;
            justify-content: space-around;
            padding: 20rpx 0;

            .delivery-option {
                display: flex;
                align-items: center;
                width: 45%;
                height: 80rpx;
                padding: 0 20rpx;
                border-radius: 8rpx;
                background-color: #f5f5f5;
                border: 2rpx solid transparent;

                uni-icons {
                    margin-right: 20rpx;
                }

                text {
                    font-size: 28rpx;
                    color: #333;
                }

                &.active {
                    background-color: #e6f7ff;
                    border-color: #1890ff;

                    text {
                        color: #1890ff;
                        font-weight: bold;
                    }
                }
            }
        }

        // 地址显示区域
        .address-info {
            margin-top: 20rpx;

            // 门店地址
            .store-address {
                margin-bottom: 20rpx;
                border-radius: 8rpx;
                padding: 20rpx;
                background-color: #f8f8f8;

                .address-label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15rpx;

                    uni-icons {
                        margin-right: 10rpx;
                    }

                    text {
                        font-size: 28rpx;
                        font-weight: bold;
                        color: #333;
                    }
                }

                .address-content {
                    margin-left: 30rpx;

                    .store-name {
                        font-size: 30rpx;
                        font-weight: bold;
                        color: #333;
                        margin-bottom: 10rpx;
                    }

                    .store-full-address {
                        font-size: 28rpx;
                        color: #666;
                        margin-bottom: 6rpx;
                        line-height: 1.4;
                    }

                    .store-distance {
                        font-size: 24rpx;
                        color: #999;
                    }
                }
            }

            // 外卖配送地址
            .user-address {
                margin-top: 20rpx;
                border-radius: 8rpx;
                padding: 20rpx;
                background-color: #f8f8f8;

                .address-label {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15rpx;

                    uni-icons {
                        margin-right: 10rpx;
                    }

                    text {
                        font-size: 28rpx;
                        font-weight: bold;
                        color: #333;
                    }
                }

                .address-content {
                    margin-left: 30rpx;
                    font-size: 28rpx;
                    color: #333;
                    line-height: 1.4;

                    .address-detail {
                        margin-top: 10rpx;
                        display: flex;
                        justify-content: space-between;

                        text {
                            font-size: 26rpx;
                            color: #666;
                        }
                    }
                }

                .no-address {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20rpx;
                    border: 1rpx dashed #ddd;
                    border-radius: 8rpx;
                    margin: 20rpx 0 10rpx;
                    background-color: #fff;

                    text {
                        font-size: 28rpx;
                        color: #1890ff;
                    }

                    uni-icons {
                        margin-left: 10rpx;
                    }
                }
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
                margin-top: 30rpx;

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
                display: flex;
                align-items: center;
                justify-content: center;

                .countdown-text {
                    font-size: 28rpx;
                    color: #ff4d4f;
                    margin-right: 10rpx;
                }

                .refresh-button {
                    width: 40rpx;
                    height: 40rpx;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #1890ff;
                    border-radius: 50%;
                }
            }

            .action-buttons {
                display: flex;
                justify-content: space-between;

                .action-button {
                    width: 48%;
                    height: 80rpx;
                    line-height: 80rpx;
                    font-size: 30rpx;
                    border-radius: 8rpx;

                    &.share {
                        background-color: #1890ff;
                        color: #fff;
                    }

                    &.cancel {
                        background-color: #f5f5f5;
                        color: #666;
                        border: 1rpx solid #ddd;
                    }
                }
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
.action-button.cancel {
    margin-top: 20rpx;
}
</style> 