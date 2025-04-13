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
                        <view
                            class="discount-info"
                            v-if="order.discount && order.discount.amount > 0"
                        >
                            <text class="discount-text"
                                >已优惠: ¥{{ order.discount.amount }}</text
                            >
                        </view>
                        <view
                            class="panda-coins"
                            v-if="order.status !== 'cancelled'"
                        >
                            <text class="panda-coins-text"
                                >获得熊猫币:
                                {{
                                    order.pandaCoins ||
                                    getPandaCoins(
                                        order.totalPrice,
                                        order.discount?.amount || 0
                                    )
                                }}</text
                            >
                        </view>
                    </view>
                    <view class="order-price">
                        <view class="price-tag">¥{{ order.totalPrice }}</view>
                        <view class="price-detail"
                            >共{{ getTotalQuantity(order) }}件</view
                        >
                        <view
                            class="original-price"
                            v-if="order.discount && order.discount.amount > 0"
                        >
                            <text
                                >原价: ¥{{ order.discount.originalPrice }}</text
                            >
                        </view>
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
import { userState, updateUserState } from '../../utils/userState'
import { orderApi } from '../../utils/api'
console.log(userState)

// 页面数据
const hasOrders = ref(false)
const orders = ref([])

// 刷新订单数据
const refreshOrders = async () => {
    try {
        // 使用订单API获取订单数据
        const userOrders = await orderApi.fetchUserOrders()

        // 遍历所有订单，检查是否有未添加熊猫币的订单
        let totalCoinsToAdd = 0

        userOrders.forEach((order) => {
            // 只处理未取消且没有添加过熊猫币的订单
            if (order.status !== 'cancelled' && !order.pandaCoins) {
                // 计算熊猫币
                const coinsForOrder = getPandaCoins(
                    order.totalPrice,
                    order.discount?.amount || 0
                )

                // 更新订单的熊猫币信息
                order.pandaCoins = coinsForOrder

                // 累计需要添加的熊猫币
                totalCoinsToAdd += coinsForOrder
            }
        })

        // 如果有新的熊猫币需要添加
        if (totalCoinsToAdd > 0) {
            // 更新用户熊猫币总数
            userState.pandaCoins += totalCoinsToAdd

            // 更新本地存储中的用户信息
            updateUserState({ pandaCoins: userState.pandaCoins })

            // 更新本地存储中的订单信息
            uni.setStorageSync('savedOrders', userOrders)

            console.log(
                `已添加${totalCoinsToAdd}熊猫币，当前总数：${userState.pandaCoins}`
            )
        }

        orders.value = userOrders
        hasOrders.value = userOrders.length > 0
    } catch (error) {
        console.error('获取订单列表失败:', error)
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

// 定义页面生命周期函数
defineExpose({
    onShow() {
        // 每次显示页面时刷新数据
        refreshOrders()
    }
})

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

// 计算获得的熊猫币数量（向上取整）
const getPandaCoins = (price, discount = 0) => {
    // 使用原价（折扣前价格）计算熊猫币
    const originalPrice = Number(price) + Number(discount)
    return Math.ceil(originalPrice)
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
        deliveryType: order.deliveryType,
        // 计算将要获得的熊猫币数量
        pandaCoins: getPandaCoins(order.totalPrice, order.discount?.amount || 0)
    }

    // 保存到本地存储，供订单确认页使用
    uni.setStorageSync('orderConfirmData', orderData)

    // 跳转到订单确认页
    uni.navigateTo({
        url: '/pages/order-confirm/order-confirm?fromReorder=true'
    })
}

// 查看订单详情
const viewOrderDetail = (order) => {
    console.log('查看订单详情:', order.id)

    // 如果订单没有熊猫币信息，则添加
    if (!order.pandaCoins && order.status !== 'cancelled') {
        // 计算熊猫币
        const coinsToAdd = getPandaCoins(
            order.totalPrice,
            order.discount?.amount || 0
        )

        // 更新订单的熊猫币信息
        order.pandaCoins = coinsToAdd

        // 更新用户熊猫币总数
        userState.pandaCoins += coinsToAdd

        // 更新本地存储中的订单信息
        uni.setStorageSync('savedOrders', orders.value)

        // 更新本地存储中的用户信息
        updateUserState({ pandaCoins: userState.pandaCoins })

        console.log(
            `已添加${coinsToAdd}熊猫币，当前总数：${userState.pandaCoins}`
        )
    }

    // 将当前订单保存到本地存储，以便订单详情页面可以访问
    uni.setStorageSync('currentOrderDetail', order)

    // 只传递订单ID，其他信息从本地存储获取
    uni.navigateTo({
        url: `/pages/order-detail/order-detail?orderId=${order.id}`
    })
}

// 更新订单取消函数
const cancelOrder = async (index) => {
    uni.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success: async function (res) {
            if (res.confirm) {
                try {
                    // 获取要取消的订单ID
                    const orderId = orders.value[index].id

                    // 使用API取消订单
                    const updatedOrder = await orderApi.cancelOrder(orderId)

                    // 更新本地订单列表
                    orders.value[index] = updatedOrder

                    // 如果有熊猫币，需要减去
                    if (updatedOrder.pandaCoins) {
                        userState.pandaCoins -= updatedOrder.pandaCoins
                        // 更新用户状态
                        updateUserState({ pandaCoins: userState.pandaCoins })
                    }

                    // 提示用户
                    uni.showToast({
                        title: '订单已取消',
                        icon: 'success'
                    })
                } catch (error) {
                    console.error('取消订单失败:', error)
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
const deleteOrder = (index) => {
    uni.showModal({
        title: '提示',
        content: '确定要删除此订单吗？',
        success: function (res) {
            if (res.confirm) {
                // 从列表中删除订单
                const orderToDelete = orders.value[index]
                orders.value.splice(index, 1)

                // 更新本地存储
                uni.setStorageSync('savedOrders', orders.value)

                // 如果删除后没有订单，显示空状态
                if (orders.value.length === 0) {
                    hasOrders.value = false
                }

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