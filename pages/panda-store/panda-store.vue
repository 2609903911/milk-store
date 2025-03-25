<template>
    <view class="panda-store-container">
        <!-- 顶部熊猫币信息区 -->
        <view class="panda-coins-section">
            <!-- 导航栏 -->
            <view class="navbar">
                <view class="back-btn" @click="goBack">
                    <uni-icons type="left" size="24"></uni-icons>
                </view>
            </view>
            <!-- 背景图片 -->
            <image
                class="panda-coins-bg"
                src="/static/images/panda-coins-bg.png"
                mode="aspectFill"
            ></image>

            <!-- 个人信息卡片 -->
            <view class="user-info-card">
                <!-- 我的熊猫币标签 -->
                <view class="my-coins-badge">
                    <text>我的熊猫币</text>
                </view>

                <view class="user-info-value">
                    <image
                        class="coin-icon"
                        src="/static/images/coin.png"
                        mode="aspectFit"
                    ></image>
                    {{ userState.pandaCoins }}
                </view>

                <view class="user-info-tabs">
                    <view class="tab-item">
                        <uni-icons type="" size="24"></uni-icons>
                        <view class="tab-text">熊猫币明细</view>
                    </view>
                    <view class="tab-item">
                        <view class="tab-text">熊猫币订单</view>
                    </view>
                    <view class="tab-item">
                        <view class="tab-text">熊猫币规则</view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 优惠券分类选项卡 -->
        <view class="coupon-tabs">
            <view
                v-for="(tab, index) in tabs"
                :key="index"
                class="tab-item"
                :class="{ active: currentTab === index }"
                @click="switchTab(index)"
            >
                {{ tab }}
            </view>
        </view>

        <!-- 优惠券列表 -->
        <scroll-view scroll-y class="coupon-list-scroll">
            <view class="coupon-list">
                <view
                    v-for="(coupon, index) in couponList"
                    :key="index"
                    class="coupon-exchange-item"
                    :class="[getCouponColorClass(coupon.type)]"
                >
                    <!-- 优惠券上部分 -->
                    <view class="coupon-top">
                        <view class="coupon-top-content">
                            <view class="coupon-image-container">
                                <image
                                    class="coupon-type-image"
                                    :src="getCouponTypeImage(coupon.type)"
                                    mode="aspectFit"
                                ></image>
                            </view>
                            <view class="coupon-value-container">
                                <view class="coupon-value">
                                    <template
                                        v-if="
                                            coupon.type ===
                                            COUPON_TYPES.DISCOUNT
                                        "
                                    >
                                        <text class="value">{{
                                            coupon.value
                                        }}</text>
                                        <text class="unit">折</text>
                                    </template>
                                    <template
                                        v-else-if="
                                            coupon.type === COUPON_TYPES.CASH
                                        "
                                    >
                                        <text class="symbol">¥</text>
                                        <text class="value">{{
                                            coupon.value
                                        }}</text>
                                    </template>
                                    <template
                                        v-else-if="
                                            coupon.type === COUPON_TYPES.FREE
                                        "
                                    >
                                        <text class="value">免单</text>
                                    </template>
                                    <template
                                        v-else-if="
                                            coupon.type ===
                                            COUPON_TYPES.BUY_ONE_GET_ONE
                                        "
                                    >
                                        <text class="value">买一赠一</text>
                                    </template>
                                    <template
                                        v-else-if="
                                            coupon.type ===
                                            COUPON_TYPES.SPECIAL_PRICE
                                        "
                                    >
                                        <text class="symbol">¥</text>
                                        <text class="value">{{
                                            coupon.value
                                        }}</text>
                                    </template>
                                    <template
                                        v-else-if="
                                            coupon.type ===
                                            COUPON_TYPES.SHIPPING
                                        "
                                    >
                                        <text class="value">免运费</text>
                                    </template>
                                </view>
                                <view
                                    class="coupon-limit"
                                    v-if="coupon.minOrderAmount > 0"
                                >
                                    满{{ coupon.minOrderAmount }}元可用
                                </view>
                            </view>
                        </view>
                    </view>

                    <!-- 中间分割线 -->
                    <view class="coupon-divider">
                        <view class="circle left"></view>
                        <view class="dashed-line"></view>
                        <view class="circle right"></view>
                    </view>

                    <!-- 优惠券下部分 -->
                    <view class="coupon-bottom">
                        <view class="coupon-title">{{ coupon.title }}</view>
                        <view class="coupon-desc">{{
                            coupon.description
                        }}</view>
                        <view class="coupon-validity">
                            有效期: {{ coupon.validity || '30天' }}
                        </view>

                        <view class="exchange-info">
                            <view class="coins-cost">
                                <image
                                    class="coins-icon"
                                    src="/static/images/coin.png"
                                    mode="aspectFit"
                                ></image>
                                <text class="coins-amount">{{
                                    coupon.coinsCost
                                }}</text>
                            </view>
                            <button
                                class="exchange-btn"
                                @click="exchangeCoupon(coupon)"
                                :disabled="
                                    userState.pandaCoins < coupon.coinsCost
                                "
                            >
                                {{
                                    userState.pandaCoins < coupon.coinsCost
                                        ? '熊猫币不足'
                                        : '立即兑换'
                                }}
                            </button>
                        </view>
                    </view>
                </view>

                <!-- 空状态 -->
                <view v-if="couponList.length === 0" class="empty-tip">
                    <image
                        src="/static/images/empty-coupon.png"
                        mode="aspectFit"
                    ></image>
                    <text>暂无可兑换优惠券</text>
                </view>
            </view>
        </scroll-view>

        <!-- 兑换成功弹窗 -->
        <view
            v-if="showSuccessPopup"
            class="success-popup-mask"
            @click="closeSuccessPopup"
        >
            <view class="success-popup" @click.stop>
                <view class="success-icon">🎉</view>
                <view class="success-title">兑换成功</view>
                <view class="success-desc">优惠券已添加到您的账户</view>
                <view class="success-btns">
                    <button class="success-btn" @click="navigateToCoupons">
                        查看我的优惠券
                    </button>
                    <button class="cancel-btn" @click="closeSuccessPopup">
                        继续浏览
                    </button>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { userState, updateUserState } from '../../utils/userState'
import {
    COUPON_TYPES,
    COUPON_STATUS,
    createDiscountCoupon,
    createCashCoupon,
    createFreeCoupon,
    createBuyOneGetOneCoupon
} from '../../utils/couponModel'

// 标签页
const tabs = ref(['人气兑换', '折扣券', '现金券', '免费券', '特价券'])
const currentTab = ref(0)

// 当前显示的优惠券列表
const couponList = ref([])

// 弹窗状态
const showSuccessPopup = ref(false)
const exchangedCoupon = ref(null)

// 所有可兑换的优惠券
const allCoupons = reactive([
    // 折扣券
    {
        id: 'ex_discount_1',
        title: '奶茶8折券',
        type: COUPON_TYPES.DISCOUNT,
        value: 8,
        minOrderAmount: 20,
        description: '全场奶茶8折优惠',
        validity: '30天',
        coinsCost: 100,
        category: 'discount'
    },
    {
        id: 'ex_discount_2',
        title: '饮品7折券',
        type: COUPON_TYPES.DISCOUNT,
        value: 7,
        minOrderAmount: 30,
        description: '全场饮品7折优惠',
        validity: '15天',
        coinsCost: 150,
        category: 'discount'
    },
    // 现金券
    {
        id: 'ex_cash_1',
        title: '满30减10元券',
        type: COUPON_TYPES.CASH,
        value: 10,
        minOrderAmount: 30,
        description: '满30元立减10元',
        validity: '30天',
        coinsCost: 120,
        category: 'cash'
    },
    {
        id: 'ex_cash_2',
        title: '满50减20元券',
        type: COUPON_TYPES.CASH,
        value: 20,
        minOrderAmount: 50,
        description: '满50元立减20元',
        validity: '30天',
        coinsCost: 200,
        category: 'cash'
    },
    // 免单券
    {
        id: 'ex_free_1',
        title: '小杯饮品免单券',
        type: COUPON_TYPES.FREE,
        value: 15,
        minOrderAmount: 0,
        description: '小杯饮品免费，最高15元',
        validity: '7天',
        coinsCost: 300,
        category: 'free'
    },
    // 买一赠一券
    {
        id: 'ex_buy1get1_1',
        title: '招牌奶茶买一赠一',
        type: COUPON_TYPES.BUY_ONE_GET_ONE,
        value: 1,
        minOrderAmount: 0,
        description: '招牌奶茶系列买一赠一',
        validity: '15天',
        coinsCost: 250,
        category: 'buyOneGetOne'
    },
    // 特价券
    {
        id: 'ex_special_1',
        title: '杨梅吐气特价券',
        type: COUPON_TYPES.SPECIAL_PRICE,
        value: 9.9,
        minOrderAmount: 0,
        description: '杨梅吐气特价9.9元',
        validity: '7天',
        coinsCost: 180,
        category: 'specialPrice'
    },
    // 免运费券
    {
        id: 'ex_shipping_1',
        title: '免运费券',
        type: COUPON_TYPES.SHIPPING,
        value: 0,
        minOrderAmount: 20,
        description: '满20元免除配送费',
        validity: '30天',
        coinsCost: 80,
        category: 'shipping'
    }
])

// 初始化数据
onMounted(() => {
    updateCouponList()
})

// 根据当前标签更新优惠券列表
const updateCouponList = () => {
    if (currentTab.value === 0) {
        // 人气兑换 - 显示所有优惠券
        couponList.value = allCoupons
    } else {
        // 根据类型过滤
        const categoryMap = ['', 'discount', 'cash', 'free', 'specialPrice']
        const selectedCategory = categoryMap[currentTab.value]

        couponList.value = allCoupons.filter(
            (coupon) => coupon.category === selectedCategory
        )
    }
}

// 切换标签
const switchTab = (index) => {
    currentTab.value = index
    updateCouponList()
}

// 获取优惠券颜色类名
const getCouponColorClass = (type) => {
    switch (type) {
        case COUPON_TYPES.DISCOUNT:
            return 'discount-coupon'
        case COUPON_TYPES.CASH:
            return 'cash-coupon'
        case COUPON_TYPES.FREE:
            return 'free-coupon'
        case COUPON_TYPES.BUY_ONE_GET_ONE:
            return 'buy-one-coupon'
        case COUPON_TYPES.SPECIAL_PRICE:
            return 'special-coupon'
        case COUPON_TYPES.SHIPPING:
            return 'shipping-coupon'
        default:
            return ''
    }
}

// 获取优惠券类型对应的图片
const getCouponTypeImage = (type) => {
    switch (type) {
        case COUPON_TYPES.DISCOUNT:
            return '/static/images/coupon/coupon-discount.png'
        case COUPON_TYPES.CASH:
            return '/static/images/coupon/coupon-cash.png'
        case COUPON_TYPES.FREE:
            return '/static/images/coupon/coupon-free.png'
        case COUPON_TYPES.BUY_ONE_GET_ONE:
            return '/static/images/coupon/coupon-buy1get1.png'
        case COUPON_TYPES.SPECIAL_PRICE:
            return '/static/images/coupon/coupon-special.png'
        case COUPON_TYPES.SHIPPING:
            return '/static/images/coupon/coupon-shipping.png'
        default:
            return '/static/images/coupon/coupon-default.png'
    }
}

// 兑换优惠券
const exchangeCoupon = (coupon) => {
    // 检查熊猫币是否足够
    if (userState.pandaCoins < coupon.coinsCost) {
        uni.showToast({
            title: '熊猫币不足',
            icon: 'none'
        })
        return
    }

    // 减少熊猫币
    const newCoins = userState.pandaCoins - coupon.coinsCost

    // 创建新的优惠券实例
    let newCoupon
    const now = Date.now()
    const endTime = now + 30 * 24 * 60 * 60 * 1000 // 默认30天后过期

    // 根据不同类型创建对应优惠券
    switch (coupon.type) {
        case COUPON_TYPES.DISCOUNT:
            newCoupon = createDiscountCoupon(
                coupon.value,
                coupon.minOrderAmount,
                {
                    title: coupon.title,
                    description: coupon.description,
                    endTime:
                        now + parseInt(coupon.validity) * 24 * 60 * 60 * 1000
                }
            )
            break
        case COUPON_TYPES.CASH:
            newCoupon = createCashCoupon(coupon.value, coupon.minOrderAmount, {
                title: coupon.title,
                description: coupon.description,
                endTime: now + parseInt(coupon.validity) * 24 * 60 * 60 * 1000
            })
            break
        case COUPON_TYPES.FREE:
            newCoupon = createFreeCoupon(coupon.value, {
                title: coupon.title,
                description: coupon.description,
                endTime: now + parseInt(coupon.validity) * 24 * 60 * 60 * 1000
            })
            break
        default:
            // 其他类型直接复用模板创建
            newCoupon = {
                id: `coupon_${now}_${Math.floor(Math.random() * 1000000)}`,
                title: coupon.title,
                type: coupon.type,
                value: coupon.value,
                minOrderAmount: coupon.minOrderAmount,
                scope: 'all',
                scopeIds: [],
                startTime: now,
                endTime: now + parseInt(coupon.validity) * 24 * 60 * 60 * 1000,
                status: COUPON_STATUS.VALID,
                description: coupon.description,
                imageUrl: '/static/images/coupon1.png',
                isDeleted: false,
                createTime: now,
                usedTime: null,
                source: 'pandaStore'
            }
    }

    // 更新用户状态
    const updatedUserInfo = {
        pandaCoins: newCoins,
        coupons: [...userState.coupons, newCoupon]
    }

    updateUserState(updatedUserInfo)

    // 记录兑换的优惠券
    exchangedCoupon.value = newCoupon

    // 显示成功弹窗
    showSuccessPopup.value = true
}

// 关闭成功弹窗
const closeSuccessPopup = () => {
    showSuccessPopup.value = false
}

// 导航到我的优惠券页面
const navigateToCoupons = () => {
    showSuccessPopup.value = false
    uni.navigateTo({
        url: '/pages/coupons/coupons'
    })
}

// 跳转到赚取熊猫币任务页面
const navigateToTask = () => {
    uni.showToast({
        title: '即将上线，敬请期待',
        icon: 'none'
    })
}

// 显示熊猫币使用记录
const showCoinsHistory = () => {
    uni.showToast({
        title: '即将上线，敬请期待',
        icon: 'none'
    })
}

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.panda-store-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f7f8fa;
    position: relative;
    overflow: hidden;
}

// 导航栏
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    position: relative;
    z-index: 10;
    margin-top: 40rpx;
}

.back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.back-icon {
    font-size: 40rpx;
    color: #333;
}

.title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
}

.right-btns {
    display: flex;
    align-items: center;
}

.more-btn,
.func-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #333;
}

// 熊猫币信息区域
.panda-coins-section {
    position: relative;
    height: 360rpx;
    margin-bottom: 100rpx;
    overflow: visible;
    flex-shrink: 0;
}

.panda-coins-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 115%;
    z-index: 0;
}

// 我的熊猫币标签
.my-coins-badge {
    position: absolute;
    top: 10rpx;
    right: -25rpx;
    background-color: #006de7;
    color: #fff;
    padding: 8rpx 16rpx;
    border-radius: 8rpx;
    font-size: 24rpx;
    z-index: 10;
    transform: rotate(45deg);
    transform-origin: center center;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.2);
}

// 用户信息卡片
.user-info-card {
    position: absolute;
    top: 180rpx;
    left: 30rpx;
    right: 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    z-index: 5;
}

.user-info-title {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 10rpx;
    text-align: center;
}

.user-info-value {
    font-size: 72rpx;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.coin-icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 10rpx;
}

.user-info-desc {
    font-size: 24rpx;
    color: #666;
    text-align: center;
}

.user-info-tabs {
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #eee;
    padding-top: 20rpx;
}

.tab-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}

.tab-icon {
    font-size: 36rpx;
    margin-bottom: 10rpx;
    color: #666;
}

.tab-text {
    font-size: 24rpx;
    color: #666;
}

// 选项卡样式
.coupon-tabs {
    display: flex;
    overflow-x: scroll;
    background-color: #fff;
    padding: 0 10rpx;
    white-space: nowrap;
    margin-bottom: 20rpx;
    flex-shrink: 0;
}

.coupon-tabs::-webkit-scrollbar {
    display: none;
}

.tab-item {
    padding: 20rpx 30rpx;
    font-size: 28rpx;
    color: #666;
    position: relative;
    display: inline-block;
}

.tab-item.active {
    color: #006de7;
    font-weight: bold;
}

.tab-item.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 40rpx;
    height: 4rpx;
    background-color: #006de7;
    border-radius: 2rpx;
}

// 优惠券列表
.coupon-list-scroll {
    flex: 1;
    padding: 0 20rpx;
    margin-top: 10rpx;
    height: calc(100vh - 460rpx);
    box-sizing: border-box;
}

.coupon-list {
    padding-bottom: 50rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

// 优惠券兑换项
.coupon-exchange-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    width: calc(50% - 10rpx);
    height: 340rpx; // 设置固定高度确保一致性
}

// 优惠券上部分
.coupon-top {
    padding: 16rpx;
    background-color: #006de7;
    color: #fff;
    height: 160rpx;
    display: flex;
    align-items: center;
}

.coupon-top-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
}

.coupon-image-container {
    width: 100rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 16rpx;
}

.coupon-type-image {
    width: 100%;
    height: 100%;
}

.coupon-value-container {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.coupon-value {
    display: flex;
    align-items: baseline;
}

.coupon-value .symbol {
    font-size: 36rpx;
    margin-right: 4rpx;
}

.coupon-value .value {
    font-size: 45rpx;
    font-weight: bold;
}

.coupon-value .unit {
    font-size: 32rpx;
    margin-left: 4rpx;
}

.coupon-limit {
    font-size: 24rpx;
    margin-top: 4rpx;
}

// 优惠券中间分割线
.coupon-divider {
    position: relative;
    height: 0;
    border-top: 2rpx dashed #e6e6e6;
}

.dashed-line {
    position: absolute;
    left: 0;
    right: 0;
    border-top: 2rpx dashed #e6e6e6;
}

.circle {
    position: absolute;
    width: 16rpx;
    height: 16rpx;
    background-color: #f7f8fa;
    border-radius: 50%;
    top: -8rpx;
}

.circle.left {
    left: -8rpx;
}

.circle.right {
    right: -8rpx;
}

// 优惠券下部分
.coupon-bottom {
    flex: 1;
    padding: 16rpx;
    position: relative;
    display: flex;
    flex-direction: column;
}

.coupon-title {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 8rpx;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.coupon-desc {
    font-size: 22rpx;
    color: #666;
    margin-bottom: 6rpx;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.coupon-validity {
    font-size: 22rpx;
    color: #999;
    margin-bottom: 10rpx;
}

.exchange-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 10rpx;
}

.coins-cost {
    display: flex;
    align-items: center;
}

.coins-icon {
    font-size: 24rpx;
    color: #f8b500;
    margin-right: 6rpx;
}

.coins-amount {
    font-size: 28rpx;
    font-weight: bold;
    color: #f8b500;
}

.exchange-btn {
    background-color: #006de7;
    color: #fff;
    font-size: 24rpx;
    padding: 8rpx 20rpx;
    border-radius: 8rpx;
    line-height: 1.6;
    margin: 0;
    min-width: 120rpx;
    text-align: center;
}

.exchange-btn[disabled] {
    background-color: #ccc;
    opacity: 0.8;
}

// 空状态提示
.empty-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
}

.empty-tip image {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
}

.empty-tip text {
    font-size: 28rpx;
    color: #999;
}

// 不同类型优惠券颜色
.discount-coupon .coupon-top {
    background-color: #ff9500;
}

.cash-coupon .coupon-top {
    background-color: #ff3b30;
}

.free-coupon .coupon-top {
    background-color: #5856d6;
}

.buy-one-coupon .coupon-top {
    background-color: #34c759;
}

.special-coupon .coupon-top {
    background-color: #af52de;
}

.shipping-coupon .coupon-top {
    background-color: #007aff;
}

// 成功弹窗
.success-popup-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
}

.success-popup {
    width: 80%;
    background-color: #fff;
    border-radius: 16rpx;
    padding: 40rpx 30rpx;
    text-align: center;
}

.success-icon {
    font-size: 80rpx;
    margin-bottom: 20rpx;
}

.success-title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
    color: #333;
}

.success-desc {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 40rpx;
}

.success-btns {
    display: flex;
    flex-direction: column;
}

.success-btn {
    background-color: #36b37e;
    color: #fff;
    font-size: 30rpx;
    margin-bottom: 20rpx;
    border-radius: 12rpx;
}

.cancel-btn {
    background-color: #f5f5f5;
    color: #666;
    font-size: 30rpx;
    border-radius: 12rpx;
}

// 去掉旧的coins-info相关样式
.coins-info {
    display: none;
}
.coins-icon {
    width: 30rpx;
    height: 30rpx;
}

.coins-title,
.coins-value,
.coins-desc,
.coins-actions,
.action-item,
.action-icon,
.action-text {
    display: none;
}
</style>
