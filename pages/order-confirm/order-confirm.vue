<template>
    <scroll-view class="scroll-container" scroll-y>
        <view class="order-confirm">
            <!-- 商店信息 -->
            <view class="shop-info">
                <view class="shop-name-container">
                    <view class="tag">{{
                        deliveryType === 'self' ? '自取' : '外卖'
                    }}</view>
                    <view class="shop-name">{{ storeInfo.name }} ></view>
                </view>
                <view class="shop-distance">距您 {{ storeInfo.distance }}</view>
                <view class="shop-address">{{ storeInfo.address }}</view>
                <view class="shop-phone">
                    <text>联系电话</text>
                    <text class="phone-number">13027261672</text>
                    <text class="copy-icon" @tap="copyPhoneNumber">复制</text>
                </view>
            </view>

            <!-- 订单商品列表 -->
            <view class="order-items">
                <view class="order-title">
                    <text>订单详情</text>
                    <view class="drink-category">清爽夏日饮品推荐</view>
                </view>

                <!-- 商品列表 -->
                <view class="product-list">
                    <view
                        class="product-item"
                        v-for="(item, index) in orderItems"
                        :key="index"
                    >
                        <image
                            class="product-image"
                            :src="item.image"
                            mode="aspectFill"
                        ></image>
                        <view class="product-info">
                            <view class="product-name">{{ item.name }}</view>
                            <view class="product-specs">{{
                                item.specs || '常规'
                            }}</view>
                            <view class="product-quantity"
                                >×{{ item.quantity }}</view
                            >
                        </view>
                        <view class="product-price"
                            >¥{{ item.price.toFixed(2) }}</view
                        >
                    </view>
                </view>
            </view>

            <!-- 价格详情 -->
            <view class="price-detail">
                <view class="price-title">价格明细</view>

                <!-- 优惠券部分 -->
                <view class="coupon-section" @click="openCouponSelect">
                    <view class="coupon-tag">
                        <image
                            class="coupon-icon"
                            src="/static/images/coupon-icon.png"
                        ></image>
                        <text>优惠券</text>
                    </view>
                    <view class="coupon-action">
                        <text v-if="selectedCoupon" class="selected-coupon">
                            已选择: {{ selectedCoupon.title }}
                            <text class="discount-amount"
                                >(-¥{{ discountAmount }})</text
                            >
                        </text>
                        <text v-else>
                            {{
                                availableCoupons.length > 0
                                    ? `${availableCoupons.length}张优惠券可用`
                                    : '暂无可用优惠券'
                            }}
                        </text>
                        <uni-icons
                            class="arrow"
                            :style="{
                                color:
                                    availableCoupons.length > 0
                                        ? '#006de7'
                                        : '#999'
                            }"
                            type="right"
                            size="16"
                        ></uni-icons>
                    </view>
                </view>

                <!-- 优惠券选择弹框 -->
                <coupon-select
                    :show="showCouponSelect"
                    :order-amount="totalAmount"
                    :order-items="orderItems"
                    @update:show="showCouponSelect = $event"
                    @select="handleCouponSelect"
                />

                <view class="total-section">
                    <text>合计</text>
                    <text class="total-price">¥{{ totalPrice }}</text>
                </view>
            </view>

            <!-- 集杯活动 -->
            <view class="cup-collection">
                <view class="collection-title">集杯活动</view>
                <view class="collection-item">
                    <text>喝茶集点兑竹蔗芒茶杯（第二波）</text>
                    <text class="collection-count"
                        >本单预计可+{{ orderItems.length }}</text
                    >
                </view>
            </view>

            <!-- 支付方式 -->
            <view class="payment-method">
                <view class="payment-title">支付方式</view>
                <view class="payment-options">
                    <view class="payment-option selected">
                        <image
                            class="payment-icon"
                            src="/static/images/wechat-pay.png"
                        ></image>
                        <text>微信支付</text>
                        <view class="check-icon">✓</view>
                    </view>
                </view>
            </view>

            <!-- 底部支付栏 -->
            <view class="payment-bar">
                <view class="payment-amount">
                    <text>待支付：</text>
                    <text class="amount">¥{{ totalPrice }}</text>
                </view>
                <view class="pay-button" @tap="handlePayment">支付</view>
            </view>
        </view>
    </scroll-view>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import CouponSelect from '../components/coupon-select.vue'
import { userState } from '../../utils/userState'
import { updateUserState } from '../../utils/userState'
import { orderApi } from '../../utils/api'
import { userData, initUserData } from '../../utils/userData'

// 定义数据
const orderItems = ref([])
const totalPrice = ref('0.00')
const storeInfo = ref({
    name: '九江中心店',
    distance: '0.97km',
    address: '九江市中心区繁华路88号',
    phone: '13027261672'
})
const deliveryType = ref('self') // 'self'自取, 'delivery'外卖

// 优惠券选择相关
const showCouponSelect = ref(false)
const selectedCoupon = ref(null)
const totalAmount = ref(0)

// 可用优惠券列表 - 从userData中获取
const availableCoupons = computed(() => {
    // 优先从userData中获取优惠券，如果没有再从userState获取
    const userCoupons =
        userData.coupons && userData.coupons.length > 0
            ? userData.coupons
            : userState.coupons || []

    return userCoupons.filter((coupon) => {
        // 检查优惠券是否可用
        const now = Date.now()
        const isExpired = now > coupon.endTime
        const isUsed = coupon.status === 'used'
        const isDeleted = coupon.isDeleted

        // 检查订单金额是否满足优惠券使用条件
        const meetsAmount = totalAmount.value >= coupon.minOrderAmount

        return !isExpired && !isUsed && !isDeleted && meetsAmount
    })
})

// 优惠券折扣金额
const discountAmount = ref('0.00')
const originalPrice = ref('0.00')

// 获取传递的数据
onMounted(() => {
    // 初始化用户数据，确保获取到最新的优惠券信息
    initUserData()

    try {
        // 从本地存储中获取订单数据
        const orderData = uni.getStorageSync('orderConfirmData')

        if (orderData) {
            console.log('从本地存储获取订单数据:', orderData)
            orderItems.value = orderData.items || []
            totalPrice.value = orderData.totalPrice || '0.00'
            originalPrice.value = orderData.totalPrice || '0.00'

            // 计算总金额
            calculateTotalAmount()

            if (orderData.store) {
                storeInfo.value = orderData.store
            }

            if (orderData.deliveryType) {
                deliveryType.value = orderData.deliveryType
            }

            // 可以选择性地清除本地存储
            // uni.removeStorageSync('orderConfirmData')
        }
    } catch (error) {
        console.error('获取订单数据失败', error)
        uni.showToast({
            title: '获取订单数据失败',
            icon: 'none'
        })
    }
})

// 复制电话号码
const copyPhoneNumber = () => {
    uni.setClipboardData({
        data: storeInfo.value.phone,
        success: () => {
            uni.showToast({
                title: '电话已复制',
                icon: 'success'
            })
        }
    })
}

// 处理支付
const handlePayment = async () => {
    // 创建一个获取购物车组件的引用
    const pages = getCurrentPages()
    const homePage = pages.find((page) => page.route === 'pages/index/index')

    // 设置一个标志以便在回到首页后清除购物车中的已选商品
    uni.setStorageSync('clearCartAfterPayment', 'true')

    // 设置标志通知my-orders页面刷新数据
    uni.setStorageSync('ordersNeedRefresh', 'true')

    // 获取选中的商品ID以便删除
    const orderConfirmData = uni.getStorageSync('orderConfirmData') || {}
    const selectedItemIds = (orderConfirmData.items || []).map(
        (item) => item.id
    )

    // 保存需要删除的商品ID
    uni.setStorageSync('itemsToDeleteFromCart', selectedItemIds)

    // 构建订单数据
    const orderData = {
        storeName: orderConfirmData.store?.name || '默认店铺',
        storeAddress: orderConfirmData.store?.address || '默认地址',
        deliveryType: orderConfirmData.deliveryType || 'self',
        items: orderConfirmData.items || [],
        totalPrice: totalPrice.value,
        discount: {
            amount: discountAmount.value,
            originalPrice: originalPrice.value,
            coupon: selectedCoupon.value
                ? {
                      id: selectedCoupon.value.id,
                      title: selectedCoupon.value.title,
                      type: selectedCoupon.value.type,
                      value: selectedCoupon.value.value
                  }
                : null
        }
    }

    try {
        // 使用订单API创建订单
        const newOrder = await orderApi.createOrder(orderData)
        console.log('订单创建成功:', newOrder)

        // 如果使用了优惠券，将其标记为已使用
        if (selectedCoupon.value) {
            // 更新userState中的优惠券状态
            const stateIndex = userState.coupons.findIndex(
                (c) => c.id === selectedCoupon.value.id
            )
            if (stateIndex !== -1) {
                console.log('更新userState中的优惠券状态')
                userState.coupons[stateIndex].status = 'used'
                userState.coupons[stateIndex].usedTime = Date.now()
                // 使用updateUserState保存完整的用户状态
                updateUserState({ coupons: userState.coupons })
            }

            // 同时更新userData中的优惠券状态
            const dataIndex = userData.coupons.findIndex(
                (c) => c.id === selectedCoupon.value.id
            )
            if (dataIndex !== -1) {
                console.log('更新userData中的优惠券状态')
                userData.coupons[dataIndex].status = 'used'
                userData.coupons[dataIndex].usedTime = Date.now()
                console.log('优惠券状态:', userData.coupons[dataIndex].status)
                console.log(
                    '优惠券使用时间:',
                    new Date(
                        userData.coupons[dataIndex].usedTime
                    ).toLocaleString()
                )
            }
        }

        // 显示支付成功提示
        uni.showToast({
            title: '模拟支付成功',
            icon: 'success',
            success: () => {
                setTimeout(() => {
                    // 支付成功后跳转到订单列表
                    uni.switchTab({
                        url: '/pages/my-orders/my-orders'
                    })
                }, 1500)
            }
        })
    } catch (error) {
        console.error('创建订单失败:', error)
        uni.showToast({
            title: '订单创建失败',
            icon: 'none'
        })
    }
}

// 计算总金额
const calculateTotalAmount = () => {
    totalAmount.value = orderItems.value.reduce((sum, item) => {
        return sum + item.price * item.quantity
    }, 0)
}

// 监听订单项变化
watch(
    orderItems,
    () => {
        calculateTotalAmount()
    },
    { deep: true }
)

// 显示优惠券选择弹框
const openCouponSelect = () => {
    showCouponSelect.value = true
}

// 处理优惠券选择
const handleCouponSelect = (coupon) => {
    console.log('优惠券选择:', coupon)
    // 重置价格为原始价格
    totalPrice.value = originalPrice.value
    let finalPrice = parseFloat(totalPrice.value)
    let discount = 0

    if (coupon) {
        selectedCoupon.value = coupon

        if (coupon.type === 'cash') {
            // 满减券：直接减去value值
            discount = coupon.value
            console.log('减去的价格：', discount)
            finalPrice = Math.max(0, finalPrice - discount)
        } else if (coupon.type === 'discount') {
            // 折扣券：按折扣比例计算
            const originalAmount = parseFloat(originalPrice.value)
            const discountedAmount = originalAmount * (coupon.value / 10)
            discount = originalAmount - discountedAmount
            finalPrice = discountedAmount
        } else if (coupon.type === 'specialPrice') {
            // 特价券：将原价替换为特价
            const matchingItem = orderItems.value.find(
                (item) => coupon.scopeIds && coupon.scopeIds.includes(item.id)
            )
            if (matchingItem) {
                // 记录原价
                const originalItemPrice = matchingItem.price
                // 计算所有符合条件商品的总原价
                const originalItemsTotal =
                    originalItemPrice * matchingItem.quantity
                // 计算所有符合条件商品的总特价
                const specialItemsTotal = coupon.value * matchingItem.quantity
                // 计算折扣金额
                discount = originalItemsTotal - specialItemsTotal
                // 从总价中减去折扣金额
                finalPrice = Math.max(0, finalPrice - discount)
            }
        } else if (coupon.type === 'free') {
            // 免单券：直接将总价设置为0
            discount = parseFloat(originalPrice.value)
            finalPrice = 0
        }

        // 更新折扣金额和最终价格
        discountAmount.value = discount.toFixed(2)
        totalPrice.value = finalPrice.toFixed(2)

        console.log('应用优惠券后:', {
            优惠券: coupon.title,
            原价: originalPrice.value,
            折扣: discountAmount.value,
            最终价格: totalPrice.value
        })
    } else {
        // 如果取消选择优惠券，恢复原价
        selectedCoupon.value = null
        discountAmount.value = '0.00'
        totalPrice.value = originalPrice.value
    }
}
</script>

<style scoped>
.scroll-container {
    height: 100vh;
    width: 100%;
}

.order-confirm {
    padding-bottom: 120rpx;
    background-color: #f5f5f5;
    min-height: 100vh;
}

/* 商店信息 */
.shop-info {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
}

.shop-name-container {
    display: flex;
    align-items: center;
    margin-bottom: 15rpx;
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
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
}

.shop-distance {
    font-size: 26rpx;
    color: #666;
    text-align: right;
    margin-bottom: 10rpx;
}

.shop-address {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
}

.shop-phone {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #666;
}

.phone-number {
    margin: 0 20rpx;
    color: #333;
}

.copy-icon {
    color: #999;
}

/* 订单商品列表 */
.order-items {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
}

.order-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;
    font-size: 30rpx;
    color: #333;
}

.drink-category {
    font-size: 24rpx;
    color: #999;
    background-color: #f0f0f0;
    padding: 4rpx 12rpx;
    border-radius: 20rpx;
}

.product-list {
    padding-bottom: 10rpx;
}

.product-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #f5f5f5;
}

.product-item:last-child {
    border-bottom: none;
}

.product-image {
    width: 140rpx;
    height: 140rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.1);
    object-fit: cover;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 10rpx;
}

.product-specs {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 10rpx;
}

.product-quantity {
    font-size: 24rpx;
    color: #666;
}

.product-price {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
}

/* 价格详情 */
.price-detail {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
}

.price-title {
    font-size: 30rpx;
    color: #333;
    margin-bottom: 30rpx;
}

.coupon-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1px solid #f5f5f5;
}

.coupon-tag {
    display: flex;
    align-items: center;
}

.coupon-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
}

.coupon-action {
    color: #ff6a6a;
    display: flex;
    align-items: center;
    font-size: 28rpx;
}

.selected-coupon {
    color: #006de7;
}

.discount-amount {
    color: #ff6a6a;
    margin-left: 10rpx;
}

.arrow {
    margin-left: 10rpx;
}

.total-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 0 10rpx;
    font-size: 28rpx;
    color: #333;
}

.total-price {
    font-size: 36rpx;
    font-weight: bold;
}

/* 集杯活动 */
.cup-collection {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
}

.collection-title {
    font-size: 30rpx;
    color: #333;
    margin-bottom: 20rpx;
}

.collection-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    color: #666;
}

.collection-count {
    color: #0066cc;
}

/* 支付方式 */
.payment-method {
    background-color: #fff;
    padding: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
}

.payment-title {
    font-size: 30rpx;
    color: #333;
    margin-bottom: 20rpx;
}

.payment-option {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
}

.payment-icon {
    width: 44rpx;
    height: 44rpx;
    margin-right: 20rpx;
}

.check-icon {
    margin-left: auto;
    color: #0066cc;
    font-size: 32rpx;
}

/* 底部支付栏 */
.payment-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100rpx;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    z-index: 999;
}

.payment-amount {
    font-size: 28rpx;
    color: #333;
}

.amount {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
}

.pay-button {
    background-color: #2a88e6;
    color: #fff;
    font-size: 32rpx;
    padding: 15rpx 60rpx;
    border-radius: 20rpx;
    margin-right: 40rpx;
}
</style>
