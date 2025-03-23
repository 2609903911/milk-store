<template>
    <scroll-view class="scroll-container" scroll-y>
        <view class="order-detail-container">
            <!-- 顶部状态区域 -->
            <view class="status-banner">
                <!-- 背景图片 -->
                <image
                    class="banner-background"
                    src="/static/images/order-background.jpg"
                    mode="aspectFill"
                ></image>

                <!-- 标题和返回按钮 -->
                <view class="nav-header">
                    <view class="back-icon" @tap="goBack">
                        <uni-icons
                            type="left"
                            size="24"
                            color="#333"
                        ></uni-icons>
                    </view>
                </view>

                <!-- 订单状态显示 -->
                <view class="order-status">
                    <text class="status-text"
                        >商品{{ getStatusText(orderStatus) }}</text
                    >
                </view>
            </view>

            <!-- 操作提示区域 - 压在顶部图片底部 -->
            <view class="action-tip-bar">
                <view class="tip-area">
                    <image
                        class="tip-icon"
                        src="/static/images/coin.png"
                        mode="aspectFit"
                    ></image>
                    <text class="tip-text">下单赠能量，前往兑好礼 ></text>
                </view>
                <view class="reorder-btn" @tap="reorderItems">再来一单</view>
            </view>

            <!-- 店铺信息 -->
            <view class="store-info-section">
                <view class="store-header">
                    <view class="store-name">{{ storeName }}</view>
                    <view class="store-actions">
                        <view class="action-item phone-action">
                            <image
                                class="action-icon"
                                src="/static/images/phone.png"
                                mode="aspectFit"
                            ></image>
                            <text class="action-text">电话</text>
                        </view>
                        <view class="action-item nav-action">
                            <image
                                class="action-icon"
                                src="/static/images/navigation.png"
                                mode="aspectFit"
                            ></image>
                            <text class="action-text">导航</text>
                        </view>
                    </view>
                </view>
                <view class="store-address">{{ storeAddress }}</view>
            </view>

            <!-- 商品信息 -->
            <view class="product-section">
                <view
                    class="product-item"
                    v-for="item in orderItems"
                    :key="item.name"
                >
                    <view class="product-image-wrapper">
                        <image
                            class="product-image"
                            :src="item.image"
                            mode="aspectFill"
                        ></image>
                    </view>
                    <view class="product-details">
                        <view class="product-name">{{ item.name }}</view>
                        <view class="product-spec">{{ item.specs }}</view>
                    </view>
                    <view class="product-price-info">
                        <text class="price">¥{{ item.price.toFixed(2) }}</text>
                        <text class="quantity">x{{ item.quantity }}</text>
                    </view>
                </view>
            </view>

            <!-- 价格信息 -->
            <view class="price-summary">
                <view class="discount-info">
                    <text class="discount-label">优惠合计</text>
                    <text class="discount-value">- ¥ {{ discount }}</text>
                </view>
                <view class="discount-detail">
                    <text class="discount-desc">LV0新会员指定果茶...</text>
                </view>
                <view class="total-price">
                    <text class="total-label"
                        >共计{{ totalQuantity }}件商品，合计</text
                    >
                    <text class="total-value">¥ {{ totalPrice }}</text>
                </view>
            </view>

            <!-- 订单信息 -->
            <view class="order-info">
                <view class="info-title">订单信息</view>
                <view class="info-item">
                    <text class="info-label">取餐码</text>
                    <text class="info-value">暂无</text>
                </view>
                <view class="info-item">
                    <text class="info-label">备注</text>
                    <text class="info-value">无</text>
                </view>
                <view class="info-item">
                    <text class="info-label">下单时间</text>
                    <text class="info-value">{{ orderTime }}</text>
                </view>
                <view class="info-item">
                    <text class="info-label">订单号</text>
                    <text class="info-value order-number">{{ orderId }}</text>
                    <text class="copy-btn" @tap="copyOrderNumber">复制</text>
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 订单信息
const orderId = ref('')
const orderStatus = ref('')
const storeName = ref('')
const storeAddress = ref('')
const orderItems = ref([])
const totalPrice = ref('')
const orderTime = ref('')

// 计算优惠金额（示例：总是按10%计算）
const discount = computed(() => {
    if (!totalPrice.value) return '0.00'
    const total = parseFloat(totalPrice.value)
    return (total * 0.1).toFixed(2)
})

// 获取商品总数量
const totalQuantity = computed(() => {
    return orderItems.value.reduce((total, item) => total + item.quantity, 0)
})

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 获取订单状态文本
const getStatusText = (status) => {
    const statusMap = {
        pending: '待取餐',
        completed: '已完成',
        cancelled: '已取消'
    }
    return statusMap[status] || '未知状态'
}

// 在页面加载时获取订单数据
onMounted(() => {
    try {
        console.log('订单详情页面已加载')

        // 针对不同平台获取页面参数
        let urlOrderId = ''

        // #ifdef MP-WEIXIN
        // 微信小程序环境
        const mpPages = getCurrentPages()
        if (mpPages && mpPages.length > 0) {
            const currentPage = mpPages[mpPages.length - 1]
            // 微信小程序直接从options获取
            urlOrderId = currentPage.options?.orderId || ''
            console.log('微信小程序环境，获取订单ID:', urlOrderId)
        }
        // #endif

        // #ifndef MP-WEIXIN
        // 非微信小程序环境（H5等）
        const pages = getCurrentPages()
        const currentPage = pages[pages.length - 1]
        const options = currentPage?.$page?.options || {}
        urlOrderId = options.orderId || ''
        console.log('其他环境，获取订单ID:', urlOrderId)
        // #endif

        // 从本地存储获取完整订单信息
        const orderDetail = uni.getStorageSync('currentOrderDetail')
        console.log('本地存储订单信息:', orderDetail)

        // 验证参数 - 允许没有urlOrderId也可以显示，只要有orderDetail
        if (
            orderDetail &&
            (urlOrderId === '' || orderDetail.id === urlOrderId)
        ) {
            // 从本地存储加载所有订单数据
            orderId.value = orderDetail.id || ''
            orderStatus.value = orderDetail.status || ''
            storeName.value = orderDetail.storeName || ''
            storeAddress.value = orderDetail.storeAddress || ''
            orderItems.value = orderDetail.items || []
            totalPrice.value = orderDetail.totalPrice || '0.00'

            console.log('店铺地址:', storeAddress.value)

            // 格式化时间
            if (orderDetail.time) {
                const date = new Date(orderDetail.time)
                orderTime.value = `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, '0')}-${String(date.getDate()).padStart(
                    2,
                    '0'
                )} ${String(date.getHours()).padStart(2, '0')}:${String(
                    date.getMinutes()
                ).padStart(2, '0')}:${String(date.getSeconds()).padStart(
                    2,
                    '0'
                )}`
            }
        } else {
            console.error('订单ID不匹配或未找到订单信息')
            uni.showToast({
                title: '未找到订单信息',
                icon: 'none'
            })

            // 延迟返回
            setTimeout(() => {
                uni.navigateBack()
            }, 1500)
        }
    } catch (error) {
        console.error('获取订单详情出错:', error)
        uni.showToast({
            title: '获取订单信息失败',
            icon: 'none'
        })
    }
})

// 复制订单号
const copyOrderNumber = () => {
    uni.setClipboardData({
        data: orderId.value,
        success: () => {
            uni.showToast({
                title: '复制成功'
            })
        }
    })
}

// 再来一单功能
const reorderItems = () => {
    console.log('再来一单')

    // 复制当前订单信息
    const orderData = {
        items: orderItems.value,
        totalPrice: totalPrice.value,
        store: {
            name: storeName.value,
            address: storeAddress.value
        },
        deliveryType: 'self' // 默认自取
    }

    console.log('准备提交的订单数据:', orderData)

    // 保存到本地存储，供订单确认页使用
    uni.setStorageSync('orderConfirmData', orderData)

    // 跳转到订单确认页
    uni.navigateTo({
        url: '/pages/order-confirm/order-confirm'
    })
}
</script>

<style scoped>
.scroll-container {
    height: 100vh;
    width: 100%;
    position: relative;
    overflow: hidden;
}

.order-detail-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    padding-bottom: 60rpx; /* 底部增加一些内边距，确保内容完全可见 */
}

/* 顶部状态区域 */
.status-banner {
    position: relative;
    height: 400rpx;
    color: #ff2b6a;
    overflow: hidden;
}

.banner-background {
    position: absolute;
    width: 150%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
}

.nav-header {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: flex-start;
    padding: 20rpx;
}

.back-icon {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(40rpx);
}

.icon-back {
    font-size: 44rpx;
}

.banner-title {
    text-align: left;
    padding: 10rpx 40rpx;
}

.title-text {
    font-size: 40rpx;
    font-weight: bold;
    color: #111;
    font-style: italic;
}

.order-status {
    transform: translateY(60rpx);
    text-align: left;
    margin-top: 30rpx;
    padding: 0 40rpx;
    position: relative;
    z-index: 2;
}

.status-text {
    font-size: 45rpx;
    font-weight: bold;
    color: #111;
}

/* 操作提示区域 - 压在顶部图片底部 */
.action-tip-bar {
    position: relative;
    margin-top: -20rpx;
    background-color: #ffffff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 20rpx 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    border-bottom: 1px solid #f0f0f0;
}

.tip-area {
    display: flex;
    align-items: center;
}

.tip-icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 10rpx;
}

.tip-text {
    font-size: 26rpx;
    color: #3088eb;
}

.reorder-btn {
    background-color: transparent;
    color: #348bec;
    font-size: 28rpx;
    padding: 8rpx 24rpx;
    border-radius: 30rpx;
    border: 1px solid #348bec;
}

/* 店铺信息 */
.store-info-section {
    background-color: white;
    padding: 30rpx;
    margin: 0;
    border-radius: 0;
    border-bottom: 20rpx solid #f5f5f5;
}

.store-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15rpx;
}

.store-name {
    font-size: 32rpx;
    font-weight: bold;
}

.store-address {
    font-size: 26rpx;
    color: #666;
}

.store-actions {
    display: flex;
    align-items: center;
}

.action-item {
    display: flex;
    align-items: center;
    margin-left: 30rpx;
}

.action-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;
}

.action-text {
    font-size: 24rpx;
    color: #666;
}

/* 商品信息 */
.product-section {
    background-color: white;
    padding: 30rpx;
    margin: 0;
    border-radius: 0;
    border-bottom: 20rpx solid #f5f5f5;
}

.product-item {
    display: flex;
    align-items: center;
    padding: 15rpx 0;
}

.product-image-wrapper {
    width: 90rpx;
    height: 90rpx;
    margin-right: 20rpx;
    border-radius: 8rpx;
    overflow: hidden;
    position: relative;
    flex-shrink: 0;
    background-color: #f5f5f5;
}

.product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8rpx;
}

.product-details {
    flex: 1;
    padding: 0 10rpx;
}

.product-name {
    font-size: 28rpx;
    margin-bottom: 6rpx;
    color: #333;
}

.product-spec {
    font-size: 24rpx;
    color: #999;
}

.product-price-info {
    text-align: right;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.price {
    font-size: 28rpx;
    color: #333;
    font-weight: normal;
    display: block;
    margin-bottom: 6rpx;
}

.quantity {
    font-size: 24rpx;
    color: #999;
}

/* 价格信息 */
.price-summary {
    background-color: white;
    padding: 24rpx 30rpx;
    margin: 0;
    border-radius: 0;
    border-bottom: 20rpx solid #f5f5f5;
}

.discount-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 6rpx;
}

.discount-label {
    font-size: 26rpx;
    color: #666;
}

.discount-value {
    font-size: 26rpx;
    color: #ff3030;
}

.discount-detail {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 16rpx;
}

.total-price {
    display: flex;
    justify-content: flex-end;
    padding-top: 16rpx;
    border-top: 1px solid #f0f0f0;
}

.total-label {
    font-size: 26rpx;
    color: #666;
    margin-right: 10rpx;
}

.total-value {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
}

/* 订单信息 */
.order-info {
    background-color: white;
    padding: 30rpx;
    margin: 0;
    border-radius: 0;
}

.info-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: #333;
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    align-items: center;
}

.info-label {
    flex: 1;
    font-size: 26rpx;
    color: #666;
}

.info-value {
    font-size: 26rpx;
    color: #333;
    text-align: right;
}

.order-number {
    max-width: 220rpx;
    overflow: hidden;
    text-overflow: ellipsis;
}

.copy-btn {
    font-size: 24rpx;
    color: #3088eb;
    background-color: #f0f8ff;
    padding: 2rpx 16rpx;
    border-radius: 30rpx;
    margin-left: 10rpx;
}
</style>
