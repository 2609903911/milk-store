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
import { ref, computed, onMounted } from 'vue'

// 状态
const showDetail = ref(false)
const cartItems = ref([])
const selectedItems = ref(new Set())

// 检测平台并适当调整
onMounted(() => {
    // 检查是否是H5环境
    // #ifdef H5
    console.log('当前运行在H5环境中')
    // 在H5环境下可能需要额外调整
    // #endif

    // 检查是否是微信小程序环境
    // #ifdef MP-WEIXIN
    console.log('当前运行在微信小程序环境中')
    // #endif
})

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

    // 如果是从shop-detail传来的数据
    if (item.product) {
        // 使用从shop-detail传递过来的totalPrice作为商品价格
        const itemPrice =
            item.totalPrice !== undefined
                ? item.totalPrice / item.quantity
                : item.product.price

        productData = {
            id: item.product.id || Date.now().toString(),
            name: item.product.name,
            // 使用每件商品的单价，而不是原始价格
            price: itemPrice,
            size: item.cupType || '中杯',
            sugar: item.sugar || '无糖',
            ice: item.temperature || '正常冰',
            image: item.product.image,
            category: item.product.category,
            count: item.quantity || 1,
            toppings: item.toppings || [],
            // 存储原始商品信息，方便后续使用
            originalProduct: item.product
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
        const sorted1 = [...arr1].sort((a, b) => {
            // 处理不同类型的加料数据结构
            const aValue = typeof a === 'string' ? a : a.id || a.name || ''
            const bValue = typeof b === 'string' ? b : b.id || b.name || ''
            return aValue.localeCompare(bValue)
        })
        const sorted2 = [...arr2].sort((a, b) => {
            // 处理不同类型的加料数据结构
            const aValue = typeof a === 'string' ? a : a.id || a.name || ''
            const bValue = typeof b === 'string' ? b : b.id || b.name || ''
            return aValue.localeCompare(bValue)
        })

        // 比较每个加料项
        for (let i = 0; i < sorted1.length; i++) {
            const item1 = sorted1[i]
            const item2 = sorted2[i]

            // 如果是字符串，直接比较
            if (typeof item1 === 'string' && typeof item2 === 'string') {
                if (item1 !== item2) return false
                continue
            }

            // 如果是对象，比较重要属性
            const id1 =
                typeof item1 === 'string' ? item1 : item1.id || item1.name
            const id2 =
                typeof item2 === 'string' ? item2 : item2.id || item2.name
            const count1 = typeof item1 === 'string' ? 1 : item1.count || 1
            const count2 = typeof item2 === 'string' ? 1 : item2.count || 1

            if (id1 !== id2 || count1 !== count2) {
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
    // 获取选择的商品
    const selectedCartItems = cartItems.value
        .filter((item) => selectedItems.value.has(item.id))
        .map((item) => {
            // 确保属性名称一致，将count转换为quantity
            return {
                ...item,
                quantity: item.count,
                specs: `${item.size}, ${item.sugar}, ${item.ice}` // 添加规格信息，方便在订单详情页显示
            }
        })

    if (selectedCartItems.length === 0) {
        uni.showToast({
            title: '请选择商品',
            icon: 'none'
        })
        return
    }

    // 计算总价
    const totalPrice = selectedCartItems
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
        .toFixed(2)

    // 判断总价是否为0
    if (parseFloat(totalPrice) == 0) {
        uni.showToast({
            title: '请选择商品',
            icon: 'none'
        })
        return
    }

    // 获取当前选择的门店信息
    const storeInfo = uni.getStorageSync('selectedStore') || {
        name: '九江中心店',
        distance: '0.97km',
        address: '九江市中心区繁华路88号',
        phone: '13027261672'
    }

    // 获取配送方式（默认为自取）
    const deliveryType = uni.getStorageSync('deliveryType') || 'self'

    // 从购物车中删除已选择的商品
    const selectedIds = new Set([...selectedItems.value])
    // 删除选中的商品
    cartItems.value = cartItems.value.filter(
        (item) => !selectedIds.has(item.id)
    )
    // 清空选中状态
    selectedItems.value.clear()

    // 如果购物车为空，隐藏详情弹窗
    if (cartItems.value.length === 0) {
        hideCartDetail()
    }

    // 创建完整的订单数据，准备传递给订单详情页
    const orderDetailData = {
        id: 'ORD' + Date.now().toString().slice(-8), // 生成订单编号
        items: selectedCartItems,
        totalPrice: totalPrice,
        storeName: storeInfo.name,
        storeAddress: storeInfo.address,
        storePhone: storeInfo.phone,
        deliveryType: deliveryType,
        status: 'pending', // 初始状态为进行中
        time: Date.now(), // 下单时间戳
        remark: uni.getStorageSync('orderRemark') || '' // 订单备注
    }

    // 存储订单数据到本地
    uni.setStorageSync('orderConfirmData', {
        items: selectedCartItems,
        totalPrice: totalPrice,
        store: storeInfo,
        deliveryType: deliveryType
    })

    // 同时存储订单详情数据
    uni.setStorageSync('currentOrderDetail', orderDetailData)

    // 跳转到确认订单页面
    uni.navigateTo({
        url: '/pages/order-confirm/order-confirm'
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
