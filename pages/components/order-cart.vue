<template>
    <view class="cart-container">
        <!-- 购物车图标和价格显示，固定在底部 -->
        <view
            class="cart-bar"
            v-if="cartItems.length > 0"
            @tap="showCartDetail"
        >
            <view class="cart-icon-container">
                <view class="cart-badge">{{ totalCount }}</view>
                <!-- 使用图片代替图标 -->
                <image
                    class="cart-icon"
                    src="/static/images/cart-icon.png"
                ></image>
            </view>
            <view class="cart-price">¥{{ totalPrice }}</view>
            <view class="checkout-btn" @tap.stop="goCheckout">去结算</view>
        </view>

        <!-- 购物车详情弹窗 -->
        <view
            class="cart-detail-popup"
            :class="{ 'popup-show': showDetail }"
            @tap.stop="hideCartDetail"
        >
            <view class="cart-detail-content" @tap.stop>
                <!-- 已选购商品标题 -->
                <view class="cart-detail-header">
                    <text>已选购商品({{ totalCount }}件)</text>
                    <view class="cart-clear" @tap="clearCart">
                        <!-- 移除垃圾桶图标 -->
                    </view>
                </view>

                <!-- 购物车商品列表 -->
                <scroll-view class="cart-items-list" scroll-y>
                    <view class="cart-header">
                        <checkbox
                            class="header-checkbox"
                            :checked="isAllSelected"
                            @tap="toggleSelectAll"
                        ></checkbox>
                        <text>已选购商品({{ totalCount }}件)</text>
                        <view class="cart-clear" @tap="clearCart">
                            <uni-icons
                                type="trash"
                                size="20"
                                color="#999"
                            ></uni-icons>
                        </view>
                    </view>
                    <view
                        class="cart-item"
                        v-for="(item, index) in cartItems"
                        :key="index"
                    >
                        <checkbox
                            class="item-checkbox"
                            :checked="selectedItems.has(item.id)"
                            @tap="toggleItemSelection(item.id)"
                        />
                        <image
                            class="item-image"
                            :src="item.image"
                            mode="aspectFill"
                        ></image>
                        <view class="item-content">
                            <view class="item-top">
                                <text class="item-name">{{ item.name }}</text>
                                <text class="item-price"
                                    >¥ {{ item.price }}</text
                                >
                            </view>
                            <view class="item-bottom">
                                <text class="item-spec"
                                    >{{ item.size }}, {{ item.sugar }},
                                    {{ item.ice }}</text
                                >
                                <view class="item-counter">
                                    <view
                                        class="counter-btn minus"
                                        @tap="decreaseItem(index)"
                                        >-</view
                                    >
                                    <text class="counter-num">{{
                                        item.count
                                    }}</text>
                                    <view
                                        class="counter-btn plus"
                                        @tap="increaseItem(index)"
                                        >+</view
                                    >
                                </view>
                            </view>
                        </view>
                    </view>
                </scroll-view>

                <!-- 购物车底部结算区 -->
                <view class="cart-detail-footer">
                    <view class="cart-icon-container">
                        <view class="cart-badge">{{ totalCount }}</view>
                        <!-- 使用图片代替图标 -->
                        <image
                            class="cart-icon"
                            src="/static/images/cart-icon.png"
                        ></image>
                    </view>
                    <view class="cart-price">¥{{ totalPrice }}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'OrderCart',
    options: {
        styleIsolation: 'shared'
    }
}
</script>

<script setup>
// 引入 uni-icons 组件
import { ref, computed } from 'vue'

// 状态
const showDetail = ref(false)
const cartItems = ref([])
const selectedItems = ref(new Set())

// 计算属性
const totalCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.count, 0)
})

const totalPrice = computed(() => {
    return cartItems.value
        .reduce((total, item) => {
            return (
                total +
                (selectedItems.value.has(item.id) ? item.price * item.count : 0)
            )
        }, 0)
        .toFixed(2)
})

const isAllSelected = computed(() => {
    return (
        cartItems.value.length > 0 &&
        cartItems.value.every((item) => selectedItems.value.has(item.id))
    )
})

// 方法
const showCartDetail = () => {
    if (cartItems.value.length > 0) {
        showDetail.value = true
    }
}

const hideCartDetail = () => {
    showDetail.value = false
}

const addToCart = (item) => {
    console.log('购物车组件收到商品:', item)

    // 确保item有基本属性
    if (!item) {
        console.error('商品数据为空')
        return
    }

    // 从不同的数据结构中提取商品信息
    let productData = {
        name: '',
        price: 0,
        count: 1
    }

    // 如果是从order-detail传来的数据
    if (item.product) {
        productData = {
            id: item.product.id || Date.now().toString(),
            name: item.product.name,
            price: item.product.price,
            size: item.cupType || '中杯',
            sugar: item.sugar || '无糖',
            ice: item.temperature || '正常冰',
            image: item.product.image,
            category: item.product.category,
            count: item.quantity || 1,
            toppings: item.toppings || []
        }
    } else {
        // 直接传入的商品数据
        productData = {
            id: item.id || Date.now().toString(),
            name: item.name,
            price: item.price,
            size: item.size || '中杯',
            sugar: item.sugar || '无糖',
            ice: item.ice || '正常冰',
            image: item.image,
            count: item.count || 1,
            toppings: item.toppings || []
        }
    }

    // 检查处理后的数据是否合法
    if (!productData.name || !productData.price) {
        console.error('处理后的商品数据不完整:', productData)
        return
    }

    // 定义一个深度比较函数用于比较加料数组
    const areArraysEqual = (arr1 = [], arr2 = []) => {
        if (arr1.length !== arr2.length) return false

        // 对加料数组进行排序以确保比较一致性
        const sorted1 = [...arr1].sort((a, b) =>
            (a.id || a.name).localeCompare(b.id || b.name)
        )
        const sorted2 = [...arr2].sort((a, b) =>
            (a.id || a.name).localeCompare(b.id || b.name)
        )

        // 比较每个加料项
        for (let i = 0; i < sorted1.length; i++) {
            const item1 = sorted1[i]
            const item2 = sorted2[i]

            // 比较重要属性，如id、名称、数量等
            if (
                item1.id !== item2.id ||
                item1.name !== item2.name ||
                item1.count !== item2.count
            ) {
                return false
            }
        }

        return true
    }

    // 查找购物车中是否已有完全相同的商品
    const existingItemIndex = cartItems.value.findIndex((cartItem) => {
        // 首先比较基本属性
        const basicMatch =
            cartItem.name === productData.name &&
            cartItem.size === productData.size &&
            cartItem.sugar === productData.sugar &&
            cartItem.ice === productData.ice

        // 然后比较加料
        const toppingsMatch = areArraysEqual(
            cartItem.toppings,
            productData.toppings
        )

        // 商品属性和加料都必须匹配
        return basicMatch && toppingsMatch
    })

    console.log(
        '查找结果:',
        existingItemIndex,
        existingItemIndex !== -1 ? '找到相同商品' : '未找到相同商品'
    )

    if (existingItemIndex !== -1) {
        // 如果商品完全一致，增加数量
        cartItems.value[existingItemIndex].count += productData.count
        console.log('更新后的商品:', cartItems.value[existingItemIndex])
    } else {
        // 否则添加新商品
        cartItems.value.push(productData)
        // 默认选中新添加的商品
        selectedItems.value.add(productData.id)
        console.log('添加新商品:', productData)
    }

    console.log('当前购物车商品:', cartItems.value)
}

const increaseItem = (index) => {
    cartItems.value[index].count += 1
}

const decreaseItem = (index) => {
    if (cartItems.value[index].count > 1) {
        cartItems.value[index].count -= 1
    } else {
        cartItems.value.splice(index, 1)
        if (cartItems.value.length === 0) {
            hideCartDetail()
        }
    }
}

const clearCart = () => {
    cartItems.value = []
    hideCartDetail()
}

// 结算方法
const goCheckout = () => {
    console.log('去结算，商品列表:', cartItems.value)
    // TODO: 这里可以跳转到结算页面
    uni.showToast({
        title: '正在开发中...',
        icon: 'none'
    })
}

// 新增：切换商品选中状态
const toggleItemSelection = (itemId) => {
    if (selectedItems.value.has(itemId)) {
        selectedItems.value.delete(itemId)
    } else {
        selectedItems.value.add(itemId)
    }
}

// 新增：切换全选状态
const toggleSelectAll = () => {
    if (isAllSelected.value) {
        // 如果全部选中，则取消全选
        selectedItems.value.clear()
    } else {
        // 如果未全选，则选中所有
        cartItems.value.forEach((item) => selectedItems.value.add(item.id))
    }
}

// 导出方法供其他组件调用
defineExpose({
    addToCart,
    showCartDetail,
    hideCartDetail,
    clearCart,
    goCheckout,
    toggleItemSelection,
    toggleSelectAll
})
</script>

<style>
.cart-container {
    position: relative;
    width: 100%;
}

/* 购物车底部栏样式 */
.cart-bar {
    position: fixed;
    /* 使用条件编译处理不同平台的底部位置 */
    /* #ifdef H5 */
    bottom: 50px; /* H5环境下，考虑tabBar的高度 */
    /* #endif */
    /* #ifdef MP-WEIXIN */
    bottom: 0; /* 微信小程序环境下，贴着底部 */
    /* #endif */
    left: 0;
    width: 100%;
    height: 140rpx;
    background-color: #fff; /* 修改为白色背景 */
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    z-index: 99;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05); /* 添加上阴影 */
}

.cart-icon-container {
    position: relative;
    margin-right: 20rpx;
}

.cart-icon {
    width: 60rpx;
    height: 60rpx;
    display: block;
}

.cart-badge {
    position: absolute;
    top: -15rpx;
    right: -15rpx;
    background-color: #ff4500;
    color: white;
    font-size: 24rpx;
    border-radius: 50%;
    width: 40rpx;
    height: 40rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.cart-price {
    flex: 1;
    color: #333; /* 修改为黑色 */
    font-size: 32rpx;
    font-weight: bold;
}

.checkout-btn {
    background-color: #006de7;
    color: white;
    padding: 20rpx 30rpx;
    border-radius: 30rpx;
    font-size: 30rpx;
    margin-left: 20rpx; /* 添加左边距 */
    margin-right: 50rpx;
}

/* 购物车详情弹窗样式 */
.cart-detail-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: none;
}

.popup-show {
    display: block;
}

.cart-detail-content {
    position: absolute;
    /* 使用条件编译处理不同平台的底部位置 */
    /* #ifdef H5 */
    bottom: 50px; /* H5环境下，考虑tabBar的高度 */
    /* #endif */
    /* #ifdef MP-WEIXIN */
    bottom: 0; /* 微信小程序环境下，贴着底部 */
    /* #endif */
    left: 0;
    width: 100%;
    background-color: white;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    max-height: 70vh;
    display: flex;
    flex-direction: column;
}

.cart-detail-header {
    padding: 30rpx;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    display: none; /* 隐藏原有的header */
}

.cart-header {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #f5f5f5;
}

.header-checkbox {
    margin-right: 15rpx;
    transform: scale(0.8);
}

.cart-clear {
    margin-left: auto;
}

.cart-items-list {
    max-height: 60vh;
    padding: 0;
}

.cart-item {
    display: flex;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #f5f5f5;
    align-items: center;
}

.item-checkbox {
    transform: scale(0.8);
    margin-right: 15rpx;
}

.item-image {
    width: 120rpx;
    height: 120rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
}

.item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.item-top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15rpx;
}

.item-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item-name {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

.item-spec {
    font-size: 24rpx;
    color: #999;
}

.item-price {
    font-size: 28rpx;
    color: #333;
    font-weight: bold;
}

.item-counter {
    display: flex;
    align-items: center;
}

.counter-btn {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36rpx;
}

.minus {
    border: 1px solid #ddd;
    color: #666;
    background-color: #f5f5f5;
}

.plus {
    background-color: #1890ff;
    color: white;
    border: none;
}

.counter-num {
    margin: 0 20rpx;
    font-size: 28rpx;
    min-width: 30rpx;
    text-align: center;
}

.cart-detail-footer {
    padding: 20rpx 0 20rpx 30rpx;
    display: flex;
    height: 100rpx;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f5f5f5;
    background-color: #fff;
}

.total-section {
    display: flex;
    align-items: center;
}

.total-price {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-left: 10rpx;
}

.checkout-btn {
    background-color: #006de7;
    color: white;
    padding: 20rpx 30rpx;
    border-radius: 30rpx;
    font-size: 30rpx;
    margin-left: 20rpx; /* 添加左边距 */
}
</style>
