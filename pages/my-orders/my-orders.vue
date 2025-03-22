<template>
    <view class="order-container">
        <!-- 无订单状态 -->
        <view class="empty-state" v-if="!hasOrders">
            <image
                class="empty-image"
                src="/static/images/empty-order.png"
                mode="aspectFit"
            ></image>
            <view class="empty-tip">您还没有订单</view>
            <view class="go-order-btn" @tap="goToOrder">去下单</view>
        </view>

        <!-- 有订单时显示的列表 -->
        <view class="order-list" v-if="hasOrders">
            <view
                class="order-item"
                v-for="(order, index) in orders"
                :key="index"
            >
                <view class="order-header">
                    <view class="shop-info">
                        <view class="tag">{{
                            order.deliveryType === 'self' ? '自取' : '外卖'
                        }}</view>
                        <view class="shop-name">{{ order.storeName }}</view>
                        <view class="shop-address">{{
                            order.storeAddress
                        }}</view>
                    </view>
                    <view class="order-status">{{
                        getStatusText(order.status)
                    }}</view>
                </view>

                <view class="order-content" @tap="viewOrderDetail(order)">
                    <image
                        class="product-image"
                        :src="order.items[0].image"
                        mode="aspectFill"
                    ></image>
                    <view class="order-info">
                        <view class="product-summary">
                            {{ order.items[0].name }}
                            <text v-if="order.items.length > 1"
                                >等{{ order.items.length }}件商品</text
                            >
                        </view>
                        <view class="order-time">{{
                            formatTime(order.time)
                        }}</view>
                    </view>
                    <view class="order-price">
                        <view class="price-tag">¥{{ order.totalPrice }}</view>
                        <view class="price-detail"
                            >共{{ getTotalQuantity(order) }}件</view
                        >
                    </view>
                </view>

                <view class="order-footer">
                    <view
                        class="action-btn"
                        v-if="order.status === 'completed'"
                        @tap="reorder(order)"
                        >再来一单</view
                    >
                    <view
                        class="action-btn"
                        v-if="order.status === 'pending'"
                        @tap="cancelOrder(index)"
                        >取消订单</view
                    >
                    <view
                        class="action-btn delete-btn"
                        @tap="deleteOrder(index)"
                        >删除订单</view
                    >
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 页面数据
const hasOrders = ref(false)
const orders = ref([])

// 初始化页面数据
onMounted(() => {
    // 模拟从本地存储获取订单数据
    const savedOrders = uni.getStorageSync('savedOrders')
    if (savedOrders && savedOrders.length) {
        orders.value = savedOrders
        hasOrders.value = true
    } else {
        // 模拟订单数据（开发测试用）
        mockOrderData()
    }
})

// 模拟订单数据（仅开发测试使用）
const mockOrderData = () => {
    // 当前日期对象
    const now = new Date()

    orders.value = [
        {
            id: '2023032001',
            storeName: '九江学院四食堂店',
            storeAddress: '江西省九江市浔阳区前进东路58号九江学院四食堂',
            deliveryType: 'self',
            status: 'completed',
            time: new Date(now.getTime() - 3600000).getTime(), // 1小时前
            items: [
                {
                    image: '/static/images/hot01.png',
                    name: '杨梅吐气',
                    price: 12,
                    quantity: 1,
                    specs: '常规'
                }
            ],
            totalPrice: '12.00'
        },
        {
            id: '2023032002',
            storeName: '九江中心店',
            storeAddress: '九江市中心区繁华路88号',
            deliveryType: 'delivery',
            status: 'pending',
            time: now.getTime(),
            items: [
                {
                    image: '/static/images/fruit01.png',
                    name: '满杯百香',
                    price: 16,
                    quantity: 1,
                    specs: '去冰'
                },
                {
                    image: '/static/images/classic01.png',
                    name: '芝芝莓莓',
                    price: 22,
                    quantity: 1,
                    specs: '少糖'
                }
            ],
            totalPrice: '38.00'
        }
    ]

    hasOrders.value = true

    // 将模拟数据保存到本地存储
    uni.setStorageSync('savedOrders', orders.value)
}

// 跳转到点单页面
const goToOrder = () => {
    uni.switchTab({
        url: '/pages/order/order'
    })
}

// 格式化订单时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes().toString().padStart(2, '0')

    return `${month}月${day}日 ${hour}:${minute}`
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

// 获取订单总商品数量
const getTotalQuantity = (order) => {
    return order.items.reduce((total, item) => total + item.quantity, 0)
}

// 再来一单
const reorder = (order) => {
    // 复制当前订单信息
    const orderData = {
        items: order.items,
        totalPrice: order.totalPrice,
        store: {
            name: order.storeName
            // 其他门店信息可以在实际应用中补充
        },
        deliveryType: order.deliveryType
    }

    // 保存到本地存储，供订单确认页使用
    uni.setStorageSync('orderConfirmData', orderData)

    // 跳转到订单确认页
    uni.navigateTo({
        url: '/pages/order-confirm/order-confirm'
    })
}

// 查看订单详情
const viewOrderDetail = (order) => {
    // 将当前订单保存到本地存储，以便订单详情页面可以访问
    uni.setStorageSync('currentOrderDetail', order)

    // 跳转到订单详情页面，并传递订单ID
    uni.navigateTo({
        url: `/pages/order-detail/order-detail?orderId=${order.id}`
    })
}

// 取消订单
const cancelOrder = (index) => {
    uni.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success: function (res) {
            if (res.confirm) {
                // 更新订单状态
                orders.value[index].status = 'cancelled'

                // 更新本地存储
                uni.setStorageSync('savedOrders', orders.value)

                // 提示用户
                uni.showToast({
                    title: '订单已取消',
                    icon: 'success'
                })
            }
        }
    })
}

// 删除订单
const deleteOrder = (index) => {
    uni.showModal({
        title: '提示',
        content: '确定要删除这条订单记录吗？',
        success: function (res) {
            if (res.confirm) {
                // 从数组中删除订单
                orders.value.splice(index, 1)

                // 如果删除后没有订单了，更新状态
                if (orders.value.length === 0) {
                    hasOrders.value = false
                }

                // 更新本地存储
                uni.setStorageSync('savedOrders', orders.value)

                // 提示用户
                uni.showToast({
                    title: '订单已删除',
                    icon: 'success'
                })
            }
        }
    })
}
</script>

<style>
.order-container {
    min-height: 100vh;
    background-color: #f5f5f5;
    display: flex;
    flex-direction: column;
}

/* 页面标题样式 */
.page-title {
    background-color: #ffffff;
    padding: 30rpx;
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
    text-align: center;
}

/* 空状态样式 */
.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 100rpx 50rpx;
}

.empty-image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 30rpx;
}

.empty-tip {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 40rpx;
}

.go-order-btn {
    background-color: #0066cc;
    color: #fff;
    font-size: 28rpx;
    padding: 20rpx 60rpx;
    border-radius: 30rpx;
}

/* 订单列表样式 */
.order-list {
    padding: 20rpx;
}

.order-item {
    background-color: #ffffff;
    border-radius: 12rpx;
    margin-bottom: 20rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #f5f5f5;
}

.shop-info {
    display: flex;
    align-items: center;
}

.tag {
    background-color: #333;
    color: #fff;
    font-size: 24rpx;
    padding: 4rpx 10rpx;
    border-radius: 4rpx;
    margin-right: 10rpx;
}

.shop-name {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 6rpx;
}

.shop-address {
    font-size: 24rpx;
    color: #999;
    max-width: 400rpx;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.order-status {
    font-size: 28rpx;
    color: #0066cc;
}

.order-content {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #f5f5f5;
}

.product-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
}

.order-info {
    flex: 1;
}

.product-summary {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 10rpx;
}

.order-time {
    font-size: 24rpx;
    color: #999;
}

.order-price {
    text-align: right;
}

.price-tag {
    font-size: 32rpx;
    color: #333;
    font-weight: 500;
    margin-bottom: 10rpx;
}

.price-detail {
    font-size: 24rpx;
    color: #999;
}

.order-footer {
    display: flex;
    justify-content: flex-end;
    padding: 20rpx 30rpx;
}

.action-btn {
    font-size: 26rpx;
    padding: 10rpx 30rpx;
    border-radius: 30rpx;
    margin-left: 20rpx;
    border: 1px solid #ddd;
    color: #666;
}

.delete-btn {
    color: #ff3030;
    border-color: #ffdddd;
}
</style> 