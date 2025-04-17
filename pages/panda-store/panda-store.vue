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

            <!-- 熊猫币信息 -->
            <view class="coin-info">
                <view class="coin-box">
                    <text class="coin-icon">🪙</text>
                    <text class="coin-amount">0</text>
                </view>
                <button class="earn-coins-btn" @click="showEarnCoinsPopup">
                    赚熊猫币
                </button>
            </view>

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
                    {{ userData.pandaCoins }}
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
                                            COUPON_TYPES.SPECIAL_PRICE
                                        "
                                    >
                                        <text class="value">{{
                                            coupon.value
                                        }}</text>
                                        <text class="unit">颗</text>
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
                                    userData.pandaCoins < coupon.coinsCost
                                "
                            >
                                {{
                                    userData.pandaCoins < coupon.coinsCost
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
                <view class="success-desc">
                    {{
                        exchangedCoupon?.category === 'lightStar'
                            ? '点亮星已添加到您的账户'
                            : '优惠券已添加到您的账户'
                    }}
                </view>
                <view class="success-btns">
                    <button class="success-btn" @click="navigateToCoupons">
                        {{
                            exchangedCoupon?.category === 'lightStar'
                                ? '查看我的徽章'
                                : '查看我的优惠券'
                        }}
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
import { updateUserState } from '../../utils/userState'
import { userData, initUserData } from '../../utils/userData'
import { COUPON_TYPES } from '../../utils/couponModel'
import { get, post } from '../../utils/request'

// 标签页
const tabs = ref(['人气兑换', '折扣券', '满减券', '免费券', '点亮星'])
const currentTab = ref(0)

// 当前显示的优惠券列表
const couponList = ref([])

// 弹窗状态
const showSuccessPopup = ref(false)
const exchangedCoupon = ref(null)
// 增加防止重复点击标志
const isExchanging = ref(false)

// 所有可兑换的优惠券
const allCoupons = reactive([])

// 初始化数据
onMounted(() => {
    // 初始化用户数据
    initUserData()
    // 从后端获取商城商品数据
    fetchStoreProducts()
})

// 从后端获取商城商品数据
const fetchStoreProducts = () => {
    return new Promise((resolve) => {
        // 使用统一请求工具
        get(
            '/api/store/home',
            {},
            {
                loading: true,
                loadingText: '加载中'
            }
        )
            .then((res) => {
                console.log('==== 检查后端返回的商品数据 ====')
                console.log('整个响应:', res)

                // 正确获取嵌套的数据结构
                if (res.data && res.data.data) {
                    const responseData = res.data.data
                    console.log('商品数据:', responseData.allProducts)

                    // 检查第一个商品的详细结构（如果存在）
                    if (
                        responseData.allProducts &&
                        responseData.allProducts.length > 0
                    ) {
                        const firstProduct = responseData.allProducts[0]
                        console.log('第一个商品详情:', firstProduct)
                        console.log('id类型:', typeof firstProduct.id)
                        console.log(
                            'couponTemplateId类型:',
                            typeof firstProduct.couponTemplateId
                        )
                        console.log(
                            'couponTemplateId值:',
                            firstProduct.couponTemplateId
                        )

                        // 清空原数组并添加新数据
                        allCoupons.splice(
                            0,
                            allCoupons.length,
                            ...responseData.allProducts
                        )

                        // 根据当前tab更新显示的优惠券
                        updateCouponList()
                    } else {
                        uni.showToast({
                            title: '暂无商品数据',
                            icon: 'none'
                        })
                    }
                } else {
                    console.error('响应数据格式不正确:', res)
                    uni.showToast({
                        title: '数据格式错误',
                        icon: 'none'
                    })
                }
            })
            .catch((err) => {
                console.error('获取商城商品失败:', err)
            })
            .finally(() => {
                resolve()
            })
    })
}

// 根据当前标签更新优惠券列表
const updateCouponList = () => {
    if (currentTab.value === 0) {
        // 人气兑换 - 显示所有优惠券
        couponList.value = allCoupons
    } else {
        // 根据类型过滤
        const categoryMap = ['', 'discount', 'cash', 'free', 'lightStar']
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
        case COUPON_TYPES.SPECIAL_PRICE:
            return 'lightstar-coupon'
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
        case COUPON_TYPES.SPECIAL_PRICE:
            return '/static/images/coupon/coupon-special.png'
        case COUPON_TYPES.SHIPPING:
            return '/static/images/coupon/coupon-shipping.png'
        default:
            return '/static/images/coupon/coupon-default.png'
    }
}

// 添加优惠券兑换主函数
const exchangeCoupon = (coupon, amount = 1) => {
    // 防止重复点击
    if (isExchanging.value) {
        return
    }

    isExchanging.value = true

    // 0. 在兑换前检查优惠券数据结构
    console.log('===== 兑换优惠券的详细数据 =====')
    console.log('优惠券完整数据:', coupon)
    console.log('id类型:', typeof coupon.id, '值:', coupon.id)
    console.log(
        'couponTemplateId类型:',
        typeof coupon.couponTemplateId,
        '值:',
        coupon.couponTemplateId
    )
    console.log(
        'coinsCost类型:',
        typeof coupon.coinsCost,
        '值:',
        coupon.coinsCost
    )

    // 1. 检查熊猫币是否足够
    if (userData.pandaCoins < coupon.coinsCost) {
        uni.showToast({
            title: '熊猫币不足',
            icon: 'none'
        })
        isExchanging.value = false
        return
    }

    // 显示处理中
    uni.showLoading({
        title: '兑换中...'
    })

    // 准备购买数据
    const purchaseData = {
        userId: userData.userId,
        productId: coupon.id,
        couponTemplateId: Number(coupon.couponTemplateId), // 确保是数字类型
        coinsSpent: coupon.coinsCost
    }

    console.log('准备发送的购买数据:', purchaseData)
    console.log('JSON数据:', JSON.stringify(purchaseData))

    // 直接调用购买接口
    post('/api/transactions/coupon', purchaseData, {
        showError: false,
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((res) => {
            console.log('购买响应:', res)

            if (res.data && res.data.success) {
                // 更新用户熊猫币
                userData.pandaCoins -= coupon.coinsCost

                // 保存用户数据更新
                updateUserState({
                    pandaCoins: userData.pandaCoins
                })

                // 设置成功弹窗数据
                exchangedCoupon.value = coupon
                showSuccessPopup.value = true

                // 显示成功消息
                uni.hideLoading()
                uni.showToast({
                    title: '兑换成功！',
                    icon: 'success'
                })
            } else {
                // 处理业务逻辑失败
                uni.hideLoading()
                uni.showToast({
                    title: res.data?.message || '兑换失败',
                    icon: 'none'
                })
            }
        })
        .catch((err) => {
            console.error('优惠券购买异常:', err)
            console.log(
                '错误详情:',
                err.response ? err.response.data : '无响应数据'
            )

            uni.hideLoading()
            uni.showToast({
                title: err?.message || '兑换失败',
                icon: 'none'
            })
        })
        .finally(() => {
            isExchanging.value = false
        })
}

// 关闭成功弹窗
const closeSuccessPopup = () => {
    showSuccessPopup.value = false
}

// 导航到我的优惠券页面
const navigateToCoupons = () => {
    showSuccessPopup.value = false
    if (exchangedCoupon.value?.category === 'lightStar') {
        uni.navigateTo({
            url: '/pages/order-medal/order-medal'
        })
    } else {
        uni.navigateTo({
            url: '/pages/coupons/coupons'
        })
    }
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

// 熊猫币信息
.coin-info {
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

.coin-box {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
}

.coin-icon {
    font-size: 40rpx;
    margin-right: 10rpx;
}

.coin-amount {
    font-size: 72rpx;
    font-weight: bold;
    color: #333;
}

.earn-coins-btn {
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

.lightstar-coupon .coupon-top {
    background-color: #ff9500;
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


