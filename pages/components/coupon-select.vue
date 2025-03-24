<template>
    <view class="coupon-select-mask" v-if="show" @click="close">
        <view class="coupon-select-content" @click.stop>
            <!-- 顶部标题栏 -->
            <view class="select-header">
                <text class="title">选择优惠券</text>
                <view class="close-btn" @click="close">
                    <uni-icons type="close" size="20"></uni-icons>
                </view>
            </view>

            <!-- 优惠券列表 -->
            <scroll-view scroll-y class="coupon-list-scroll">
                <view class="coupon-list">
                    <view
                        v-for="(coupon, index) in availableCoupons"
                        :key="index"
                        class="coupon-item"
                        :class="[
                            getCouponColorClass(coupon.type),
                            { selected: selectedCoupon?.id === coupon.id }
                        ]"
                        @click="selectCoupon(coupon)"
                    >
                        <!-- 优惠券左侧 -->
                        <view class="coupon-left">
                            <view class="coupon-value">
                                <template
                                    v-if="coupon.type === COUPON_TYPES.DISCOUNT"
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
                                        coupon.type === COUPON_TYPES.SHIPPING
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

                        <!-- 中间分割线 -->
                        <view class="coupon-divider">
                            <view class="circle top"></view>
                            <view class="dashed-line"></view>
                            <view class="circle bottom"></view>
                        </view>

                        <!-- 优惠券右侧 -->
                        <view class="coupon-right">
                            <view class="coupon-title">{{ coupon.title }}</view>
                            <view class="coupon-desc">
                                {{ coupon.description }}
                            </view>
                            <view class="coupon-validity">
                                有效期至: {{ formatDate(coupon.endTime) }}
                            </view>
                        </view>

                        <!-- 选中标记 -->
                        <view
                            class="selected-mark"
                            v-if="selectedCoupon?.id === coupon.id"
                        >
                            <uni-icons
                                type="checkmarkempty"
                                size="24"
                                color="#fff"
                            ></uni-icons>
                        </view>
                    </view>

                    <!-- 空状态 -->
                    <view
                        v-if="availableCoupons.length === 0"
                        class="empty-tip"
                    >
                        <image
                            src="/static/images/empty-coupon.png"
                            mode="aspectFit"
                        ></image>
                        <text>暂无可用的优惠券</text>
                    </view>
                </view>
            </scroll-view>

            <!-- 底部按钮 -->
            <view class="select-footer">
                <button
                    class="confirm-btn"
                    :disabled="!selectedCoupon"
                    @click="confirmSelect"
                >
                    确定使用
                </button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { userState } from '../../utils/userState'
import { COUPON_TYPES } from '../../utils/couponModel'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    orderAmount: {
        type: Number,
        default: 0
    }
})

const emit = defineEmits(['update:show', 'select'])

// 选中的优惠券
const selectedCoupon = ref(null)

// 可用的优惠券列表
const availableCoupons = computed(() => {
    return userState.coupons.filter((coupon) => {
        // 检查优惠券是否可用
        const now = Date.now()
        const isExpired = now > coupon.endTime
        const isUsed = coupon.status === 'used'
        const isDeleted = coupon.isDeleted

        // 检查订单金额是否满足优惠券使用条件
        const meetsAmount = props.orderAmount >= coupon.minOrderAmount

        return !isExpired && !isUsed && !isDeleted && meetsAmount
    })
})

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

// 格式化日期
const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0'
    )}-${String(date.getDate()).padStart(2, '0')}`
}

// 选择优惠券
const selectCoupon = (coupon) => {
    selectedCoupon.value = coupon
}

// 确认选择
const confirmSelect = () => {
    if (selectedCoupon.value) {
        emit('select', selectedCoupon.value)
        close()
    }
}

// 关闭弹框
const close = () => {
    selectedCoupon.value = null
    emit('update:show', false)
}
</script>

<style lang="scss" scoped>
.coupon-select-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999;
    display: flex;
    align-items: flex-end;
}

.coupon-select-content {
    width: 100%;
    height: 80vh;
    background-color: #f7f8fa;
    border-radius: 24rpx 24rpx 0 0;
    display: flex;
    flex-direction: column;
}

.select-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx;
    background-color: #fff;
    border-bottom: 1px solid #eee;
}

.title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.close-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.coupon-list-scroll {
    flex: 1;
    padding: 20rpx;
}

.coupon-list {
    padding-bottom: 20rpx;
}

.coupon-item {
    display: flex;
    margin-bottom: 20rpx;
    border-radius: 16rpx;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
    position: relative;
}

.coupon-item.selected {
    border: 2rpx solid #006de7;
}

.selected-mark {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 40rpx;
    height: 40rpx;
    background-color: #006de7;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

// 优惠券左侧
.coupon-left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20rpx;
    width: 200rpx;
    background-color: #006de7;
    color: #fff;
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
    font-size: 56rpx;
    font-weight: bold;
}

.coupon-value .unit {
    font-size: 32rpx;
    margin-left: 4rpx;
}

.coupon-limit {
    font-size: 24rpx;
    margin-top: 10rpx;
}

// 优惠券中间分割线
.coupon-divider {
    position: relative;
    width: 0;
}

.dashed-line {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-left: 2rpx dashed #e6e6e6;
    height: 100%;
}

.circle {
    position: absolute;
    width: 20rpx;
    height: 20rpx;
    background-color: #f7f8fa;
    border-radius: 50%;
    left: -10rpx;
}

.circle.top {
    top: -10rpx;
}

.circle.bottom {
    bottom: -10rpx;
}

// 优惠券右侧
.coupon-right {
    flex: 1;
    padding: 20rpx;
    position: relative;
}

.coupon-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
    color: #333;
}

.coupon-desc {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 10rpx;
    line-height: 1.4;
}

.coupon-validity {
    font-size: 24rpx;
    color: #999;
}

// 不同类型优惠券颜色
.discount-coupon .coupon-left {
    background-color: #ff9500;
}

.cash-coupon .coupon-left {
    background-color: #ff3b30;
}

.free-coupon .coupon-left {
    background-color: #5856d6;
}

.buy-one-coupon .coupon-left {
    background-color: #34c759;
}

.special-coupon .coupon-left {
    background-color: #af52de;
}

.shipping-coupon .coupon-left {
    background-color: #007aff;
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

// 底部按钮
.select-footer {
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-top: 1px solid #eee;
}

.confirm-btn {
    width: 100%;
    height: 80rpx;
    line-height: 80rpx;
    background-color: #006de7;
    color: #fff;
    font-size: 32rpx;
    border-radius: 40rpx;
}

.confirm-btn[disabled] {
    background-color: #ccc;
    opacity: 0.8;
}
</style>
