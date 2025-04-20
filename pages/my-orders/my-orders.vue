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
                    </view>
                    <view class="order-status">{{
                        getStatusText(order.orderStatus)
                    }}</view>
                </view>

                <view class="order-content" @tap="viewOrderDetail(order)">
                    <image
                        class="product-image"
                        :src="getOrderFirstItemImage(order)"
                        mode="aspectFill"
                    ></image>
                    <view class="order-info">
                        <view class="product-summary">
                            {{ getOrderFirstItemName(order) }}
                            <text v-if="getOrderItemsCount(order) > 1"
                                >等{{ getOrderItemsCount(order) }}件商品</text
                            >
                        </view>
                        <view class="order-time">{{
                            formatTime(order.createTime)
                        }}</view>
                        <view
                            class="discount-info"
                            v-if="
                                order.discountAmount &&
                                Number(order.discountAmount) > 0
                            "
                        >
                            <text class="discount-text"
                                >已优惠: ¥{{ order.discountAmount }}</text
                            >
                        </view>
                        <view
                            class="panda-coins"
                            v-if="order.orderStatus !== 'cancelled'"
                        >
                            <text class="panda-coins-text"
                                >获得熊猫币:
                                {{
                                    getPandaCoins(order.totalAmount || 0)
                                }}</text
                            >
                        </view>
                    </view>
                    <view class="order-price">
                        <view class="price-tag">¥{{ order.actualAmount }}</view>
                        <view class="price-detail"
                            >共{{ getTotalQuantity(order) }}件</view
                        >
                        <view
                            class="original-price"
                            v-if="
                                order.discountAmount &&
                                Number(order.discountAmount) > 0
                            "
                        >
                            <text>原价: ¥{{ Number(order.totalAmount) }}</text>
                        </view>
                    </view>
                </view>

                <view class="order-footer">
                    <view
                        class="action-btn"
                        v-if="order.orderStatus === 'completed'"
                        @tap="reorder(order)"
                        >再来一单</view
                    >
                    <view
                        class="action-btn"
                        v-if="order.orderStatus === 'pending'"
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
import { onShow } from '@dcloudio/uni-app'
import { userState, updateUserState } from '../../utils/userState'
import {
    fetchUserOrders,
    cancelOrder as apiCancelOrder,
    deleteOrder as apiDeleteOrder,
    fetchOrderById
} from '../../utils/api/orderApi'

// 页面数据
const hasOrders = ref(false)
const orders = ref([])

// 解析订单商品数据的辅助函数
const parseOrderItems = (order) => {
    if (!order || !order.orderItems) return []

    try {
        const items =
            typeof order.orderItems === 'string'
                ? JSON.parse(order.orderItems)
                : order.orderItems
        return items
    } catch (error) {
        return []
    }
}

// 获取订单第一个商品的图片
const getOrderFirstItemImage = (order) => {
    const items = parseOrderItems(order)
    const imageUrl =
        items.length > 0 && items[0].image
            ? items[0].image
            : '/static/images/default-product.png'
    return imageUrl
}

// 获取订单第一个商品的名称
const getOrderFirstItemName = (order) => {
    const items = parseOrderItems(order)
    const name = items.length > 0 && items[0].name ? items[0].name : '未知商品'
    return name
}

// 获取订单商品数量
const getOrderItemsCount = (order) => {
    const items = parseOrderItems(order)
    return items.length
}

// 刷新订单数据
const refreshOrders = async () => {
    try {
        // 获取当前用户ID
        const userId = userState.userId
        if (!userId) {
            hasOrders.value = false
            orders.value = []
            return
        }

        // 使用订单API从后端获取订单数据
        const userOrders = await fetchUserOrders(userId)

        // 处理订单数据
        if (userOrders && userOrders.length > 0) {
            // 可以在这里处理订单数据格式，如果需要的话
            orders.value = userOrders
            hasOrders.value = true
        } else {
            orders.value = []
            hasOrders.value = false
        }
    } catch (error) {
        uni.showToast({
            title: '获取订单失败',
            icon: 'none'
        })
        orders.value = []
        hasOrders.value = false
    }
}

// 初始化页面数据
onMounted(() => {
    refreshOrders()
})

// 每次显示页面时刷新数据
onShow(() => {
    // 检查是否有刷新标记（从支付页面返回时）
    const needRefresh = uni.getStorageSync('ordersNeedRefresh')
    if (needRefresh) {
        // 清除刷新标记
        uni.removeStorageSync('ordersNeedRefresh')
    }

    // 无论如何都刷新订单数据
    refreshOrders()
})

// 跳转到点单页面
const goToOrder = () => {
    uni.switchTab({
        url: '/pages/order/order'
    })
}

// 格式化订单时间
const formatTime = (timestamp) => {
    if (!timestamp) return '未知时间'

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
        pending: '待支付',
        paid: '待取餐',
        completed: '已完成',
        cancelled: '已取消',
        refunded: '已退款'
    }
    return statusMap[status] || '未知状态'
}

// 获取订单总商品数量
const getTotalQuantity = (order) => {
    if (!order.orderItems) return 0

    try {
        // 尝试解析订单商品JSON
        const items =
            typeof order.orderItems === 'string'
                ? JSON.parse(order.orderItems)
                : order.orderItems

        return items.reduce((total, item) => total + (item.quantity || 1), 0)
    } catch (error) {
        return 0
    }
}

// 计算获得的熊猫币数量（向上取整）
const getPandaCoins = (price, discount = 0) => {
    // 使用原价（折扣前价格）计算熊猫币
    const originalPrice = Number(price) + Number(discount)
    return Math.ceil(originalPrice)
}

// 再来一单
const reorder = (order) => {
    // 构建订单数据
    let orderItems
    try {
        orderItems =
            typeof order.orderItems === 'string'
                ? JSON.parse(order.orderItems)
                : order.orderItems
    } catch (error) {
        uni.showToast({
            title: '重新下单失败',
            icon: 'none'
        })
        return
    }

    // 复制当前订单信息
    const orderData = {
        items: orderItems,
        totalPrice: order.totalAmount,
        store: {
            name: order.storeName,
            address: order.storeAddress
        },
        deliveryType: order.deliveryType,
        // 计算将要获得的熊猫币数量
        pandaCoins: getPandaCoins(order.totalAmount, order.discountAmount || 0)
    }

    // 保存到本地存储，供订单确认页使用
    uni.setStorageSync('orderConfirmData', orderData)

    // 跳转到订单确认页
    uni.navigateTo({
        url: '/pages/order-confirm/order-confirm?fromReorder=true'
    })
}

// 查看订单详情
const viewOrderDetail = async (order) => {
    try {
        // 获取最新的订单详情
        const orderId = order.orderId
        const orderDetail = await fetchOrderById(orderId)

        // 将当前订单保存到本地存储，以便订单详情页面可以访问
        uni.setStorageSync('currentOrderDetail', orderDetail)

        // 跳转到订单详情页面
        uni.navigateTo({
            url: `/pages/order-detail/order-detail?orderId=${orderId}`
        })
    } catch (error) {
        uni.showToast({
            title: '获取订单详情失败',
            icon: 'none'
        })
    }
}

// 取消订单
const cancelOrder = async (index) => {
    uni.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success: async function (res) {
            if (res.confirm) {
                try {
                    // 获取要取消的订单ID
                    const orderId = orders.value[index].orderId

                    // 调用API取消订单
                    const result = await apiCancelOrder(orderId)

                    if (result) {
                        // 刷新订单列表
                        await refreshOrders()

                        // 提示用户
                        uni.showToast({
                            title: '订单已取消',
                            icon: 'success'
                        })
                    }
                } catch (error) {
                    uni.showToast({
                        title: '取消订单失败',
                        icon: 'none'
                    })
                }
            }
        }
    })
}

// 删除订单
const deleteOrder = async (index) => {
    uni.showModal({
        title: '提示',
        content: '确定要删除此订单吗？',
        success: async function (res) {
            if (res.confirm) {
                try {
                    // 获取要删除的订单ID
                    const orderId = orders.value[index].orderId

                    // 调用API删除订单
                    const result = await apiDeleteOrder(orderId)

                    // 无论API返回什么，都认为删除成功
                    // 因为mockAPI可能返回true，而真实API可能返回其他数据结构

                    // 从本地数组中移除已删除的订单
                    orders.value.splice(index, 1)

                    // 如果没有订单了，更新hasOrders状态
                    if (orders.value.length === 0) {
                        hasOrders.value = false
                    }

                    // 提示用户
                    uni.showToast({
                        title: '订单已删除',
                        icon: 'success',
                        duration: 2000
                    })
                } catch (error) {
                    uni.showToast({
                        title: '删除订单失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
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

.discount-info {
    font-size: 24rpx;
    color: #ff6a6a;
    margin-top: 6rpx;
}

.discount-text {
    display: inline-block;
    background-color: #fff0f0;
    padding: 4rpx 8rpx;
    border-radius: 4rpx;
}

.original-price {
    font-size: 24rpx;
    color: #999;
    text-decoration: line-through;
    margin-top: 6rpx;
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

.panda-coins {
    font-size: 24rpx;
    color: #ff9500;
    margin-top: 6rpx;
}

.panda-coins-text {
    display: inline-block;
    background-color: #fff8e6;
    padding: 4rpx 8rpx;
    border-radius: 4rpx;
}
</style> 