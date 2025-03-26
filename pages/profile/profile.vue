<template>
    <scroll-view class="profile-scroll" scroll-y="true">
        <view class="profile-container">
            <!-- 顶部背景区域 -->
            <view class="profile-header">
                <image
                    class="bg-image"
                    src="/static/images/profile-background.jpg"
                    mode="aspectFill"
                ></image>
            </view>

            <!-- 用户信息区域 -->
            <view class="user-info-section">
                <view class="avatar-box">
                    <image
                        class="avatar"
                        :src="userState.avatar || '/static/images/avatar'"
                        @error="handleAvatarError"
                    ></image>
                </view>
                <view class="user-details">
                    <text class="nickname">{{ userState.nickname }}</text>
                    <view class="medal-wall-btn" @click="openMedalWall">
                        <image
                            class="medal-icon"
                            src="../../static/images/medal-icon.png"
                        ></image>
                        <text class="medal-text">勋章墙</text>
                    </view>
                </view>
            </view>

            <!-- 账户信息区域 -->
            <view class="account-section">
                <view class="account-row">
                    <view class="account-item">
                        <view class="account-label">熊猫币</view>
                        <view class="account-value">{{
                            userState.pandaCoins
                        }}</view>
                    </view>
                    <view class="divider"></view>
                    <view class="account-item" @click="navigateToCoupons">
                        <view class="account-label">优惠券</view>
                        <view class="account-value">{{
                            userState.coupons ? userState.coupons.length : 0
                        }}</view>
                    </view>
                </view>
            </view>

            <!-- 优惠券展示区域 -->
            <view class="coupon-showcase">
                <view class="showcase-header">
                    <view class="showcase-title">
                        <image
                            class="panda-icon"
                            src="/static/images/panda-icon.png"
                        ></image>
                        <text>熊猫币商城</text>
                    </view>
                    <view class="showcase-more" @click="goToMall">
                        <text>更多</text>
                        <text class="arrow">></text>
                    </view>
                </view>

                <scroll-view
                    class="coupon-scroll"
                    scroll-x="true"
                    show-scrollbar="false"
                >
                    <!-- 优惠券1 -->
                    <view class="coupon-item">
                        <image
                            class="coupon-image"
                            src="/static/images/coupon1.png"
                        ></image>
                        <view class="coupon-info">
                            <text class="coupon-title"
                                >【新会员秒杀】免单券2</text
                            >
                            <view class="coupon-price">
                                <text class="price-value">9</text>
                                <text class="price-unit">熊猫币</text>
                            </view>
                            <button class="coupon-btn btn-sold">已兑完</button>
                        </view>
                    </view>

                    <!-- 优惠券2 -->
                    <view class="coupon-item">
                        <image
                            class="coupon-image"
                            src="/static/images/coupon2.png"
                        ></image>
                        <view class="coupon-info">
                            <text class="coupon-title"
                                >【新会员秒杀】买一赠一券2</text
                            >
                            <view class="coupon-price">
                                <text class="price-value">9</text>
                                <text class="price-unit">熊猫币</text>
                            </view>
                            <button class="coupon-btn btn-buy">立即兑换</button>
                        </view>
                    </view>

                    <!-- 优惠券3 -->
                    <view class="coupon-item">
                        <image
                            class="coupon-image"
                            src="/static/images/coupon3.png"
                        ></image>
                        <view class="coupon-info">
                            <text class="coupon-title"
                                >鲜奶竹香乌龙单杯88折券</text
                            >
                            <view class="coupon-price">
                                <text class="price-value">40</text>
                                <text class="price-unit">熊猫币</text>
                            </view>
                            <button class="coupon-btn btn-exchange">
                                立即兑换
                            </button>
                        </view>
                    </view>
                </scroll-view>
            </view>

            <!-- 会员服务区域 -->
            <view class="member-services">
                <view class="services-header">
                    <image
                        class="service-icon"
                        src="../../static/images/service-icon.png"
                    ></image>
                    <text class="services-title">会员服务</text>
                </view>

                <view class="services-grid">
                    <view
                        class="service-item"
                        v-for="(item, index) in serviceItems"
                        :key="index"
                        @click="handleServiceClick(item.name)"
                    >
                        <image class="service-img" :src="item.icon"></image>
                        <text class="service-name">{{ item.name }}</text>
                    </view>
                    <view
                        class="service-item"
                        v-if="serviceItems.length % 4 !== 0"
                    >
                        <!-- 预留空位，保持布局整齐 -->
                    </view>
                </view>
            </view>
        </view>
    </scroll-view>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { userState } from '../../utils/userState'
import { updateUserProfile } from '../../utils/userService'

const title = ref('我的')

// 打开勋章墙
const openMedalWall = () => {
    // 跳转到勋章墙页面
    uni.navigateTo({
        url: '/pages/order-medal/order-medal'
    })
}

// 跳转到熊猫币商城
const goToMall = () => {
    uni.showToast({
        title: '正在前往熊猫币商城',
        icon: 'none'
    })
    // 此处可添加实际跳转逻辑
}

// 跳转到优惠券页面
const navigateToCoupons = () => {
    uni.navigateTo({
        url: '/pages/coupons/coupons'
    })
}

// 服务项目数据
const serviceItems = reactive([
    { name: '团餐', icon: '../../static/images/service/group.png' },
    { name: '礼品卡', icon: '../../static/images/service/gift-card.png' },
    { name: '礼券兑换', icon: '../../static/images/service/certificate.png' },
    {
        name: '我的徽章',
        icon: '../../static/images/service/medal.png',
        action: 'medal'
    },
    { name: '熊猫币商城', icon: '../../static/images/service/store.png' },
    { name: '加盟申请', icon: '../../static/images/service/franchise.png' },
    { name: '联系客服', icon: '../../static/images/service/contact.png' },
    {
        name: '个人资料',
        icon: '../../static/images/service/profile.png',
        action: 'editProfile'
    },
    { name: '抽奖公示', icon: '../../static/images/service/prize.png' }
])

// 处理服务点击事件
const handleServiceClick = (serviceName) => {
    // 根据不同服务名称跳转到不同页面
    const item = serviceItems.find((item) => item.name === serviceName)

    if (item && item.action === 'editProfile') {
        // 跳转到个人资料编辑页面
        uni.navigateTo({
            url: '/pages/personal-data/personal-data'
        })
        return
    }

    // 处理我的徽章点击事件
    if (item && item.action === 'medal') {
        // 跳转到勋章墙页面
        uni.navigateTo({
            url: '/pages/order-medal/order-medal'
        })
        return
    }

    uni.showToast({
        title: `您点击了${serviceName}`,
        icon: 'none'
    })
}

// 处理头像加载错误
const handleAvatarError = () => {
    // 当头像加载失败时，将使用默认的 src 属性值（已在模板中设置）
    console.log('头像加载失败，使用默认头像')
}
</script>

<style lang="scss" scoped>
.profile-scroll {
    height: 100vh;
}

.profile-container {
    display: flex;
    flex-direction: column;
    background-color: #f7f8fc;
    min-height: 100vh;
    padding-bottom: 30rpx;
}

// 顶部背景区域样式
.profile-header {
    position: relative;
    height: 300rpx;
    width: 100%;
    overflow: hidden;
}

.bg-image {
    width: 100%;
    height: 100%;
}

// 用户信息区域样式
.user-info-section {
    position: relative;
    margin-top: -60rpx;
    display: flex;
    align-items: center;
    margin-left: 30rpx;
    margin-right: 30rpx;
    background-color: transparent;
    border-radius: 16rpx;
    z-index: 10;
}

.avatar-box {
    margin-right: 30rpx;
}

.avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    border: 4rpx solid #ffffff;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.user-details {
    flex: 1;
}

.nickname {
    font-size: 36rpx;
    font-weight: 500;
    color: #333333;
    margin-bottom: 10rpx;
}

.medal-wall-btn {
    display: flex;
    align-items: center;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    padding: 6rpx 20rpx;
    display: inline-flex;
}

.medal-icon {
    width: 32rpx;
    height: 32rpx;
    margin-right: 8rpx;
}

.medal-text {
    font-size: 24rpx;
    color: #666666;
}

// 账户信息区域样式
.account-section {
    margin: 30rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    box-shadow: 0 2rpx 16rpx rgba(0, 0, 0, 0.05);
    padding: 20rpx;
}

.account-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 0;
}

.account-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.divider {
    width: 2rpx;
    height: 60rpx;
    background-color: #eeeeee;
}

.account-label {
    font-size: 28rpx;
    color: #666666;
    margin-bottom: 10rpx;
}

.account-value {
    font-size: 40rpx;
    font-weight: bold;
    color: #333333;
}

// 优惠券展示区域样式
.coupon-showcase {
    margin: 0 20rpx 30rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.showcase-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20rpx;
}

.showcase-title {
    display: flex;
    align-items: center;
}

.panda-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 10rpx;
}

.showcase-more {
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #999999;
}

.arrow {
    margin-left: 6rpx;
}

.coupon-scroll {
    white-space: nowrap;
    width: 100%;
}

.coupon-item {
    display: inline-block;
    width: 260rpx;
    margin-right: 20rpx;
    vertical-align: top;
}

.coupon-image {
    width: 260rpx;
    height: 160rpx;
    border-radius: 12rpx;
}

.coupon-info {
    padding: 10rpx 0;
}

.coupon-title {
    font-size: 24rpx;
    color: #333333;
    display: block;
    white-space: normal;
    line-height: 1.4;
    height: 68rpx;
    overflow: hidden;
}

.coupon-price {
    display: flex;
    align-items: baseline;
    margin: 10rpx 0;
}

.price-value {
    font-size: 32rpx;
    font-weight: bold;
    color: #007aff;
}

.price-unit {
    font-size: 24rpx;
    color: #007aff;
    margin-left: 4rpx;
}

.coupon-btn {
    width: 100%;
    height: 60rpx;
    line-height: 60rpx;
    text-align: center;
    font-size: 26rpx;
    border-radius: 15rpx;
    margin: 0;
    padding: 0;
}

.btn-sold {
    background-color: #f5f5f5;
    color: #999999;
}

.btn-buy,
.btn-exchange {
    background-color: #007aff;
    color: #ffffff;
}

// 会员服务区域样式
.member-services {
    margin: 0 20rpx 30rpx;
    background-color: #ffffff;
    border-radius: 16rpx;
    padding: 20rpx;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.services-header {
    display: flex;
    align-items: center;
    padding-bottom: 20rpx;
}

.service-icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 10rpx;
}

.services-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
}

.services-grid {
    display: flex;
    flex-wrap: wrap;
}

.service-item {
    width: 25%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20rpx 0;
}

.service-img {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 10rpx;
}

.service-name {
    font-size: 24rpx;
    color: #333333;
}
</style> 