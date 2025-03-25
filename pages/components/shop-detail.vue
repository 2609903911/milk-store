<template>
    <view
        class="popup-container"
        :class="{ 'popup-show': visible }"
        @tap.stop="onBackgroundTap"
        id="popup-container"
    >
        <view class="popup-content" @tap.stop="contentTap">
            <!-- 商品详情内容区域 - 使用scroll-view包裹 -->
            <scroll-view class="detail-scroll-area" scroll-y>
                <!-- 商品详情内容 -->
                <view class="product-detail">
                    <!-- 商品图片 -->
                    <image
                        class="product-image"
                        :src="product.image || '/static/images/hot01.png'"
                        mode="aspectFill"
                    ></image>

                    <!-- 商品信息 -->
                    <view class="product-info">
                        <view class="product-name">{{
                            product.name || '商品名称'
                        }}</view>
                        <view class="product-desc">{{
                            product.desc || '商品描述'
                        }}</view>
                        <view class="product-price"
                            >¥{{ product.price || '0.00' }}</view
                        >
                    </view>

                    <!-- 关闭按钮 -->
                    <view class="close-btn" @tap="closePopup">
                        <text class="close-icon">×</text>
                    </view>
                </view>

                <!-- 选项区域 -->
                <view class="options-container">
                    <!-- 温度选择 -->
                    <view class="option-section">
                        <view class="option-title">温度</view>
                        <view class="option-list">
                            <view
                                v-for="(temp, index) in temperatures"
                                :key="'temp-' + index"
                                class="option-item"
                                :class="{
                                    'option-selected': selectedTemp === temp
                                }"
                                @tap="selectedTemp = temp"
                            >
                                {{ temp }}
                            </view>
                        </view>
                    </view>

                    <!-- 糖度选择 -->
                    <view class="option-section">
                        <view class="option-title">糖度</view>
                        <view class="option-list">
                            <view
                                v-for="(sugar, index) in sugarLevels"
                                :key="'sugar-' + index"
                                class="option-item"
                                :class="{
                                    'option-selected': selectedSugar === sugar
                                }"
                                @tap="selectedSugar = sugar"
                            >
                                {{ sugar }}
                            </view>
                        </view>
                    </view>

                    <!-- 加料选择 -->
                    <view class="option-section">
                        <view class="option-title">加料</view>
                        <view class="option-list">
                            <view
                                v-for="(topping, index) in toppings"
                                :key="'topping-' + index"
                                class="option-item"
                                :class="{
                                    'option-selected':
                                        selectedToppings.includes(topping.name)
                                }"
                                @tap="toggleTopping(topping.name)"
                            >
                                {{ topping.name }}
                                <text class="option-price"
                                    >+¥{{ topping.price }}</text
                                >
                            </view>
                        </view>
                    </view>

                    <!-- 杯型选择 -->
                    <view class="option-section">
                        <view class="option-title">杯型</view>
                        <view class="option-list">
                            <view
                                v-for="(cup, index) in cupTypes"
                                :key="'cup-' + index"
                                class="option-item"
                                :class="{
                                    'option-selected': selectedCup === cup.type
                                }"
                                @tap="selectedCup = cup.type"
                            >
                                {{ cup.type }}
                                <text class="option-price" v-if="cup.price > 0"
                                    >+¥{{ cup.price }}</text
                                >
                            </view>
                        </view>
                    </view>
                </view>

                <!-- 数量选择 -->
                <view class="quantity-section">
                    <view class="quantity-title">数量</view>
                    <view class="quantity-control">
                        <view class="quantity-btn minus" @tap="decreaseQuantity"
                            >-</view
                        >
                        <view class="quantity-value">{{ quantity }}</view>
                        <view
                            class="quantity-btn plus"
                            @tap="increaseQuantity"
                            style="background-color: #006de7; color: #fff"
                            >+</view
                        >
                    </view>
                </view>
            </scroll-view>

            <!-- 操作栏 - 固定在底部 -->
            <view class="action-bar">
                <view class="total-price">
                    总计：<text class="price-value">¥{{ totalPrice }}</text>
                </view>
                <view class="add-to-cart-btn" @tap="addToCart">
                    加入购物车
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {
    name: 'OrderDetail',
    options: {
        styleIsolation: 'shared'
    }
}
</script>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

// 接收参数
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    product: {
        type: Object,
        default: () => ({
            id: '',
            name: '',
            desc: '',
            price: 0,
            image: ''
        })
    }
})

// 自定义事件
const emit = defineEmits(['update:visible', 'add-to-cart'])

// 点击背景
const onBackgroundTap = (e) => {
    // 判断是否点击的是背景区域
    // 在微信小程序中，target和currentTarget相同时表示点击的是当前元素本身
    if (
        e &&
        e.target &&
        e.currentTarget &&
        e.target.id === e.currentTarget.id
    ) {
        closePopup()
    } else {
    }
}

// 关闭弹窗
const closePopup = () => {
    // 先触发动画，然后更新可见状态
    emit('update:visible', false)
}

// 内容区域点击，阻止冒泡
const contentTap = (e) => {
    e.stopPropagation()
}

// 温度选项
const temperatures = ref(['正常冰', '少冰', '去冰', '温', '热'])
const selectedTemp = ref('正常冰')

// 糖度选项
const sugarLevels = ref(['全糖', '7分糖', '5分糖', '3分糖', '无糖'])
const selectedSugar = ref('全糖')

// 加料选项
const toppings = ref([
    { name: '珍珠', price: 2 },
    { name: '椰果', price: 2 },
    { name: '芋圆', price: 3 },
    { name: '仙草', price: 3 },
    { name: '布丁', price: 3 }
])
const selectedToppings = ref([])

// 杯型选项
const cupTypes = ref([
    { type: '中杯', price: 0 },
    { type: '大杯', price: 2 }
])
const selectedCup = ref('中杯')

// 数量
const quantity = ref(1)

// 增加数量
const increaseQuantity = () => {
    quantity.value += 1
}

// 减少数量
const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value -= 1
    }
}

// 切换加料选择
const toggleTopping = (toppingName) => {
    if (selectedToppings.value.includes(toppingName)) {
        selectedToppings.value = selectedToppings.value.filter(
            (item) => item !== toppingName
        )
    } else {
        selectedToppings.value.push(toppingName)
    }
}

// 计算总价
const totalPrice = computed(() => {
    // 基础价格
    let price = props.product.price * quantity.value

    // 加料价格
    selectedToppings.value.forEach((selected) => {
        const topping = toppings.value.find((t) => t.name === selected)
        if (topping) {
            price += topping.price * quantity.value
        }
    })

    // 杯型价格
    const cupPrice =
        cupTypes.value.find((c) => c.type === selectedCup.value)?.price || 0
    price += cupPrice * quantity.value

    return price.toFixed(2)
})

// 添加到购物车
const addToCart = () => {
    const orderItem = {
        product: props.product,
        quantity: quantity.value,
        temperature: selectedTemp.value,
        sugar: selectedSugar.value,
        toppings: selectedToppings.value,
        cupType: selectedCup.value,
        totalPrice: parseFloat(totalPrice.value)
    }

    emit('add-to-cart', orderItem)
    closePopup()
}

// 监听visible变化
watch(
    () => props.visible,
    (newVal) => {
        if (newVal) {
            // 当弹窗显示时，重置所有选项到默认值
            selectedTemp.value = '正常冰'
            selectedSugar.value = '全糖'
            selectedToppings.value = []
            selectedCup.value = '中杯'
            quantity.value = 1

            // #ifdef MP-WEIXIN
            // 确保在微信小程序中正确显示弹窗
            nextTick(() => {
                // 使用延迟确保微信小程序中的动画能正常执行
                setTimeout(() => {
                    // 这里可以添加额外的动画控制
                }, 50)
            })
            // #endif

            // #ifdef H5
            // 确保在下一个渲染周期DOM更新后添加背景点击事件
            nextTick(() => {
                // 添加背景点击事件
                const popupContainer =
                    document.querySelector('.popup-container')
                if (popupContainer) {
                    popupContainer.addEventListener('click', (e) => {
                        if (e.target === popupContainer) {
                            closePopup()
                        }
                    })
                }
            })
            // #endif
        } else {
            // 弹窗隐藏时的处理
            // #ifdef MP-WEIXIN
            // 这里可以添加额外的微信小程序特定处理
            // #endif
        }
    },
    { immediate: true }
)

// 微信小程序专用背景点击处理
// #ifdef MP-WEIXIN
const handleContentTouchMove = () => {
    // 阻止冒泡
    return false
}

// 在组件挂载时添加点击处理
onMounted(() => {
    console.log('微信小程序组件挂载完成')
})
// #endif
</script>

<style lang="scss" scoped>
/* #ifdef MP-WEIXIN */
page {
    overflow: hidden;
}

.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    background-color: rgba(0, 0, 0, 0);
    transition: all 0.3s ease;
    pointer-events: none; /* 默认不接收点击事件 */
    opacity: 0;
}

.popup-container.popup-show {
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: auto; /* 显示时接收点击事件 */
    opacity: 1;
}

.popup-content {
    background-color: #fff;
    width: 100%;
    border-radius: 24rpx 24rpx 0 0;
    transition: all 0.3s ease;
    max-height: 85vh;
    pointer-events: auto; /* 内容区域始终接收点击事件 */
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
}

.popup-container.popup-show .popup-content {
    transform: translateY(0);
}

.action-bar {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 100;
    width: 100%;
    box-sizing: border-box;
    height: 120rpx;
    flex-shrink: 0;
    // padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
    // padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
}
/* #endif */

/* #ifdef H5 */
.popup-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    visibility: hidden;
    opacity: 0;
    transition: all 0.3s ease;
    pointer-events: none; /* 默认不接收点击事件 */
}

.popup-show {
    visibility: visible;
    opacity: 1;
    pointer-events: auto; /* 显示时接收点击事件 */
}

.popup-content {
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    transition: transform 0.3s ease;
    max-height: 85vh;
    transform: translateY(100%);
    pointer-events: auto; /* 内容区域始终接收点击事件 */
    display: flex;
    flex-direction: column;
    position: relative;
    max-height: calc(100vh - 50px); /* 留出tabBar的高度 */
}

.popup-show .popup-content {
    transform: translateY(0);
}

.action-bar {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
    position: sticky;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    width: 100%;
    box-sizing: border-box;
    flex-shrink: 0;
}

.detail-scroll-area {
    flex: 1;
    max-height: calc(85vh - 120rpx);
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; /* 增强iOS滚动体验 */
}
/* #endif */

/* #ifdef MP-WEIXIN */
.detail-scroll-area {
    flex: 1;
    height: calc(85vh - 120rpx); /* 减去操作栏高度 */
    overflow-y: auto;
}
/* #endif */

/* 通用样式 */
.product-detail {
    position: relative;
    padding: 30rpx;
    display: flex;
    border-bottom: 1rpx solid #f0f0f0;
}

.product-image {
    width: 180rpx;
    height: 180rpx;
    border-radius: 12rpx;
    margin-right: 20rpx;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
}

.product-desc {
    font-size: 26rpx;
    color: #999;
    margin-bottom: 20rpx;
}

.product-price {
    font-size: 36rpx;
    font-weight: bold;
    color: #ff5722;
}

.close-btn {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 60rpx;
    height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
}

.close-icon {
    font-size: 40rpx;
    color: #666;
}

.options-container {
    padding: 0 30rpx;
}

.option-section {
    padding: 30rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
}

.option-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
}

.option-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.option-item {
    padding: 12rpx 24rpx;
    font-size: 24rpx;
    color: #666;
    background-color: #f5f5f5;
    border-radius: 100rpx;
    transition: all 0.2s ease;
}

.option-selected {
    background-color: #006de7;
    color: #fff;
}

.option-price {
    font-size: 22rpx;
    color: inherit;
}

.quantity-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    border-bottom: 1rpx solid #f0f0f0;
}

.quantity-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
}

.quantity-control {
    display: flex;
    align-items: center;
}

.quantity-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 50%;
    font-size: 40rpx;
    font-weight: bold;
}

.quantity-value {
    width: 80rpx;
    text-align: center;
    font-size: 30rpx;
}

.total-price {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.price-value {
    font-size: 36rpx;
    font-weight: bold;
    color: #ff5722;
}

.add-to-cart-btn {
    padding: 20rpx 40rpx;
    background-color: #006de7;
    color: #fff;
    font-size: 28rpx;
    border-radius: 100rpx;
}

/* 添加动画过渡类 */
@keyframes slideUp {
    from {
        transform: translateY(100%);
    }
    to {
        transform: translateY(0);
    }
}

@keyframes slideDown {
    from {
        transform: translateY(0);
    }
    to {
        transform: translateY(100%);
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeOut {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}

.popup-container.popup-show {
    animation: fadeIn 0.3s ease forwards;
}

.popup-container.popup-show .popup-content {
    animation: slideUp 0.3s ease forwards;
}

.popup-container:not(.popup-show) {
    animation: fadeOut 0.3s ease forwards;
}

.popup-container:not(.popup-show) .popup-content {
    animation: slideDown 0.3s ease forwards;
}
</style>