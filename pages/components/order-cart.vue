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
                                    >{{ item.cupType }}, {{ item.sugar }},
                                    {{ item.temperature }}</text
                                >
                                <view class="item-counter">
                                    <view
                                        class="counter-btn minus"
                                        @tap="decreaseItem(index)"
                                        >-</view
                                    >
                                    <text class="counter-num">{{
                                        item.quantity
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
import { ref, computed, onMounted, watch } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { BASE_URL, API_PATHS } from '../../utils/api/config'

// 状态
const showDetail = ref(false)
const cartItems = ref([])
const selectedItems = ref(new Set())

// 检查购物车数据，确保符合规范格式
const validateCartItems = () => {
    const items = uni.getStorageSync('cartItems') || []
    // 过滤掉无效的项目
    const filteredItems = items.filter(
        (item) => item !== null && item !== undefined
    )

    const validatedItems = filteredItems.map((item) => {
        try {
            // 确保所有必须的属性存在
            const validItem = {
                id: item.id || (item.product ? item.product.id : Date.now()),
                cupType: item.cupType || '中杯',
                name: item.name || (item.product ? item.product.name : ''),
                price:
                    Number(item.price) ||
                    (item.product ? Number(item.product.price) : 0),
                quantity: Number(item.quantity) || 1,
                sugar: item.sugar || '全糖',
                temperature: item.temperature || '正常冰',
                toppings: Array.isArray(item.toppings) ? item.toppings : [],
                image: item.image || (item.product ? item.product.image : ''),
                desc:
                    item.desc ||
                    (item.product
                        ? item.product.desc || item.product.description || ''
                        : '')
            }

            // 计算总价
            const itemPrice = Number(validItem.price) || 0
            const itemQuantity = Number(validItem.quantity) || 1
            validItem.totalPrice = item.totalPrice || itemPrice * itemQuantity

            // 确保product对象存在
            if (!item.product) {
                validItem.product = {
                    id: validItem.id,
                    name: validItem.name,
                    desc: validItem.desc || '',
                    price: validItem.price,
                    image: validItem.image
                }
            } else {
                validItem.product = { ...item.product }
            }

            return validItem
        } catch (error) {
            // 如果处理某个项目时出错，返回一个有效的默认项目
            return {
                id: Date.now() + Math.random(),
                cupType: '中杯',
                name: '商品数据错误',
                price: 0,
                quantity: 1,
                sugar: '全糖',
                temperature: '正常冰',
                toppings: [],
                image: '/static/images/hot01.png',
                desc: '',
                totalPrice: 0,
                product: {
                    id: Date.now() + Math.random(),
                    name: '商品数据错误',
                    desc: '',
                    price: 0,
                    image: '/static/images/hot01.png'
                }
            }
        }
    })

    return validatedItems
}

// 从本地存储加载购物车数据
const loadCartItems = () => {
    const validatedItems = validateCartItems()
    cartItems.value = validatedItems

    // 默认选中所有商品
    selectedItems.value.clear()
    cartItems.value.forEach((item) => {
        if (item.id) {
            selectedItems.value.add(item.id)
        }
    })

    // 保存回本地存储以确保格式统一
    saveCartItems()
}

// 保存购物车数据到本地存储
const saveCartItems = () => {
    uni.setStorageSync('cartItems', cartItems.value)
}

// 在组件挂载和显示时加载购物车数据
onMounted(() => {
    loadCartItems()
})

onShow(() => {
    loadCartItems()
})

// 监听购物车数据变化，保存到本地存储
watch(
    cartItems,
    () => {
        saveCartItems()
    },
    { deep: true }
)

// 计算属性
const totalCount = computed(() => {
    return cartItems.value.reduce(
        (total, item) => total + (item.quantity || 1),
        0
    )
})

const totalPrice = computed(() => {
    return cartItems.value
        .reduce((total, item) => {
            return (
                total + (selectedItems.value.has(item.id) ? item.totalPrice : 0)
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
    // 确保item有基本属性
    if (!item) {
        return
    }

    // 标准化商品数据格式
    let productData = {
        id: item.id || (item.product ? item.product.id : Date.now()),
        cupType: item.cupType || '中杯',
        name: item.name || (item.product ? item.product.name : ''),
        price: item.price || (item.product ? item.product.price : 0),
        quantity: item.quantity || 1,
        sugar: item.sugar || '全糖',
        temperature: item.temperature || '正常冰',
        toppings: item.toppings || [],
        image: item.image || (item.product ? item.product.image : ''),
        desc:
            item.desc ||
            (item.product
                ? item.product.desc || item.product.description || ''
                : ''),
        totalPrice:
            item.totalPrice ||
            item.price * (item.quantity || 1) ||
            (item.product ? item.product.price : 0) * (item.quantity || 1)
    }

    // 确保product对象存在
    if (!item.product) {
        productData.product = {
            id: productData.id,
            name: productData.name,
            desc: productData.desc,
            price: productData.price,
            image: productData.image
        }
    } else {
        productData.product = { ...item.product }
    }

    // 加载当前购物车
    const currentCartItems = validateCartItems()

    // 查找购物车中是否已有相同商品
    const existingItemIndex = currentCartItems.findIndex((cartItem) => {
        // 基本信息匹配：商品ID、规格相同
        const basicMatch =
            cartItem.id === productData.id &&
            cartItem.cupType === productData.cupType &&
            cartItem.sugar === productData.sugar &&
            cartItem.temperature === productData.temperature

        // 加料匹配
        let toppingsMatch = true
        if (cartItem.toppings.length !== productData.toppings.length) {
            toppingsMatch = false
        } else {
            const sortedCartToppings = [...cartItem.toppings].sort()
            const sortedNewToppings = [...productData.toppings].sort()
            for (let i = 0; i < sortedCartToppings.length; i++) {
                if (sortedCartToppings[i] !== sortedNewToppings[i]) {
                    toppingsMatch = false
                    break
                }
            }
        }

        return basicMatch && toppingsMatch
    })

    if (existingItemIndex !== -1) {
        // 更新已有商品的数量和总价
        currentCartItems[existingItemIndex].quantity += productData.quantity
        // 重新计算总价
        currentCartItems[existingItemIndex].totalPrice =
            currentCartItems[existingItemIndex].price *
            currentCartItems[existingItemIndex].quantity
    } else {
        // 添加新商品
        currentCartItems.push(productData)
    }

    // 更新本地数据和状态
    cartItems.value = currentCartItems

    // 确保新商品被选中
    if (existingItemIndex === -1) {
        selectedItems.value.add(productData.id)
    }

    // 保存到本地存储
    saveCartItems()

    // 提示用户
    uni.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1500
    })
}

const increaseItem = (index) => {
    // 增加商品数量
    cartItems.value[index].quantity += 1
    // 重新计算总价
    updateItemTotalPrice(index)
    // 保存到本地存储
    saveCartItems()
}

const decreaseItem = (index) => {
    if (cartItems.value[index].quantity > 1) {
        // 减少商品数量
        cartItems.value[index].quantity -= 1
        // 重新计算总价
        updateItemTotalPrice(index)
    } else {
        // 移除商品
        cartItems.value.splice(index, 1)
        // 如果购物车为空，隐藏详情弹窗
        if (cartItems.value.length === 0) {
            hideCartDetail()
        }
    }
    // 保存到本地存储
    saveCartItems()
}

// 更新商品总价
const updateItemTotalPrice = (index) => {
    const item = cartItems.value[index]
    item.totalPrice = item.price * item.quantity
}

const clearCart = () => {
    cartItems.value = []
    uni.setStorageSync('cartItems', [])
    hideCartDetail()
}

// 结算方法
const goCheckout = () => {
    // 获取选择的商品
    const selectedCartItems = cartItems.value
        .filter((item) => selectedItems.value.has(item.id))
        .map((item) => {
            // 确保返回适配后的数据结构
            return {
                ...item,
                // 订单确认页面需要的额外字段
                specs: `${item.cupType}, ${item.sugar}, ${item.temperature}`
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
        .reduce((sum, item) => sum + item.totalPrice, 0)
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

    // 如果是外卖模式，则通过API获取用户地址后再跳转
    if (deliveryType === 'delivery') {
        // 获取用户ID
        const userInfo = uni.getStorageSync('userInfo')
        const userId = userInfo?.userId

        if (!userId) {
            uni.showToast({
                title: '请先登录并设置收货地址',
                icon: 'none'
            })
            return
        }

        // 显示加载中
        uni.showLoading({
            title: '获取地址信息...'
        })

        const requestUrl = `${BASE_URL}${API_PATHS.USER_DEFAULT_ADDRESS}?userId=${userId}`

        // 检查是否存在API路径配置，如果不存在则使用硬编码的路径
        let finalRequestUrl = requestUrl
        if (!API_PATHS.USER_DEFAULT_ADDRESS) {
            finalRequestUrl = `${BASE_URL}/api/user/default-address?userId=${userId}`
        }

        // 从API获取用户默认地址
        uni.request({
            url: finalRequestUrl,
            method: 'GET',
            success: (res) => {
                uni.hideLoading()

                let userAddress = '未设置收货地址'
                let contactName = ''
                let contactPhone = ''
                let gender = '' // 性别信息：male或female

                if (
                    res.data &&
                    res.data.code === 200 &&
                    res.data.data &&
                    res.data.data.address
                ) {
                    const addressData = res.data.data.address
                    userAddress = addressData.address

                    // 尝试多种可能的字段名
                    contactName =
                        addressData.contact_name ||
                        addressData.contactName ||
                        addressData.name ||
                        addressData.userName ||
                        ''

                    contactPhone =
                        addressData.phone || addressData.contactPhone || ''
                    gender = addressData.gender || ''

                    proceedToCheckout(
                        selectedCartItems,
                        totalPrice,
                        storeInfo,
                        deliveryType,
                        userAddress,
                        contactName,
                        contactPhone,
                        gender
                    )
                } else {
                    uni.showToast({
                        title: '请设置默认收货地址',
                        icon: 'none'
                    })
                }
            },
            fail: (err) => {
                uni.hideLoading()
                uni.showToast({
                    title: '获取地址失败，请重试',
                    icon: 'none'
                })
            }
        })
    } else {
        // 如果是自取模式，直接进行结算，不请求用户信息
        proceedToCheckout(
            selectedCartItems,
            totalPrice,
            storeInfo,
            deliveryType,
            '',
            '',
            '',
            ''
        )
    }
}

// 进行结算的实际逻辑
const proceedToCheckout = (
    selectedCartItems,
    totalPrice,
    storeInfo,
    deliveryType,
    userAddress,
    contactName,
    contactPhone,
    gender
) => {
    // 获取用户基本信息
    const userInfo = uni.getStorageSync('userInfo') || {}

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
        remark: uni.getStorageSync('orderRemark') || '', // 订单备注
        userAddress: userAddress, // 用户收货地址
        userName: userInfo.nickname || '匿名用户',
        userPhone: userInfo.phone || '',
        contactName: contactName, // 收件人姓名
        contactPhone: contactPhone, // 收件人电话
        gender: gender // 性别信息
    }

    // 存储订单数据到本地
    uni.setStorageSync('orderConfirmData', {
        items: selectedCartItems,
        totalPrice: totalPrice,
        store: storeInfo,
        deliveryType: deliveryType,
        userAddress: userAddress, // 用户收货地址
        contactName: contactName, // 收件人姓名
        contactPhone: contactPhone, // 收件人电话
        gender: gender, // 性别信息
        userInfo: {
            nickname: userInfo.nickname || '匿名用户',
            phone: userInfo.phone || ''
        }
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
    toggleSelectAll,
    loadCartItems
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
