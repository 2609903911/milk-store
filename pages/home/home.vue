<template>
    <view class="container">
        <!-- 轮播图区域 -->
        <view class="banner-wrapper">
            <!-- 轮播图背景 -->
            <view class="banner-bg">
                <image
                    v-for="(item, index) in bannerList"
                    :key="index"
                    class="banner-bg-image"
                    :src="item.image"
                    mode="aspectFill"
                    :style="{
                        opacity: currentSwiper === index ? 1 : 0,
                        backgroundColor: item.bgColor
                    }"
                ></image>
                <view class="banner-bg-mask"></view>
            </view>

            <!-- 轮播图内容 -->
            <swiper
                class="banner-swiper"
                circular
                indicator-dots
                autoplay
                :interval="3000"
                @change="swiperChange"
                @click="navigateToOrder"
            >
                <swiper-item v-for="(item, index) in bannerList" :key="index">
                    <view class="banner-item">
                        <view class="banner-content">
                            <view class="banner-tag">
                                <text>{{ item.tag }}</text>
                            </view>
                            <view class="banner-title">
                                <text
                                    v-for="(line, idx) in item.title"
                                    :key="idx"
                                    >{{ line }}</text
                                >
                            </view>
                            <view class="banner-desc">
                                <text
                                    v-for="(line, idx) in item.desc"
                                    :key="idx"
                                    >{{ line }}</text
                                >
                            </view>
                            <view
                                class="order-btn"
                                @click.stop="navigateToOrder"
                            >
                                <text>立即下单></text>
                            </view>
                        </view>
                    </view>
                </swiper-item>
            </swiper>
        </view>

        <!-- 顶部用户信息栏 -->
        <view class="user-info-wrapper">
            <view class="user-info">
                <view class="avatar-container">
                    <image class="avatar" src="/static/logo.png"></image>
                </view>
                <view class="user-greeting">
                    <text>Hi~醇厚的生椰西瓜</text>
                </view>
                <view class="coupon-btn">
                    <text>优惠券 0</text>
                </view>
            </view>
        </view>

        <!-- 服务选择区 -->
        <view class="service-container">
            <view class="service-item" @click="navigateToOrder">
                <image class="service-icon" src="/static/logo.png"></image>
                <view class="service-title">
                    <text>到店取餐</text>
                </view>
                <view class="service-desc">
                    <text>在线点，到店取</text>
                </view>
            </view>
            <view class="service-item">
                <image class="service-icon" src="/static/logo.png"></image>
                <view class="service-title">
                    <text>外卖配送</text>
                </view>
                <view class="service-desc">
                    <text>在线点，超快达</text>
                </view>
                <view class="service-tag">
                    <text>最高享免配</text>
                </view>
            </view>
        </view>

        <!-- 功能区 -->
        <view class="function-container">
            <view class="function-item">
                <image class="function-icon" src="/static/logo.png"></image>
                <text>熊猫币商城</text>
            </view>
            <view class="function-item">
                <image class="function-icon" src="/static/logo.png"></image>
                <text>学子卡</text>
            </view>
            <view class="function-item">
                <image class="function-icon" src="/static/logo.png"></image>
                <text>一起喝</text>
            </view>
            <view class="function-item">
                <image class="function-icon" src="/static/logo.png"></image>
                <text>签到</text>
            </view>
        </view>

        <!-- 优惠活动区 -->
        <view class="promo-container">
            <!-- 左侧 - 入社群享30元专属券包 -->
            <view class="promo-left">
                <view class="promo-content">
                    <view class="promo-title">
                        <text>入社群享30元专属券包</text>
                    </view>
                    <view class="promo-desc">
                        <text>天天9.9元喝奶茶</text>
                    </view>
                    <view class="promo-btn">
                        <text>点击入群</text>
                    </view>
                </view>
                <view class="promo-image">
                    <image src="/static/logo.png" mode="aspectFit"></image>
                </view>
            </view>

            <!-- 右侧 - 上下结构 -->
            <view class="promo-right">
                <!-- 上部分 - 周一天天9.9元喝 -->
                <view class="promo-right-top">
                    <view class="promo-content">
                        <view class="promo-title">
                            <text>周一天天9.9元喝</text>
                        </view>
                        <view class="promo-desc">
                            <text>指定饮品9.9元券包</text>
                        </view>
                        <view class="promo-btn">
                            <text>立即领券></text>
                        </view>
                    </view>
                </view>

                <!-- 下部分 - 会员邀新有礼 -->
                <view class="promo-right-bottom">
                    <view class="promo-content">
                        <view class="promo-title">
                            <text>会员邀新有礼</text>
                        </view>
                        <view class="promo-desc">
                            <text>邀新友得苗条保温杯</text>
                        </view>
                        <view class="promo-btn">
                            <text>立即邀请></text>
                        </view>
                    </view>
                </view>
            </view>
        </view>

        <!-- 会员福利区 -->
        <!-- 已移至优惠活动区右下方 -->
    </view>
</template>

<script setup>
import { ref } from 'vue'

const currentSwiper = ref(0)

// 轮播图数据
const bannerList = ref([
    {
        tag: '超级蔬食 轻畅系列焕新',
        title: ['早畅晚轻', '24h轻畅循环'],
        desc: ['鲜果每日鲜榨', '一杯轻启肠道SPA'],
        image: '/static/images/scroll01.png',
        bgColor: '#8a9a5b' // 橄榄绿色背景
    },
    {
        tag: '桑葚系列',
        title: ['三重花青素', '自然好气色'],
        desc: ['爆款回归 一年卖出一千万杯！', '三重莓果 唤醒春日好气色'],
        image: '/static/images/scroll02.jpg',
        bgColor: '#e6f7ff' // 浅蓝色背景
    },
    {
        tag: '人气推荐',
        title: ['生椰系列', '醇香浓郁'],
        desc: ['精选海南生椰乳', '口感香浓醇厚'],
        image: '/static/images/scroll03.jpg',
        bgColor: '#f9e7d2' // 浅橙色背景
    },
    {
        tag: '季节限定',
        title: ['多肉葡萄', '果肉满满'],
        desc: ['精选当季葡萄', '多重口感层次'],
        image: '/static/images/scroll04.jpg',
        bgColor: '#e6d7f2' // 浅紫色背景
    }
])

// 轮播图切换事件
const swiperChange = (e) => {
    currentSwiper.value = e.detail.current
}

// 跳转到点单页面
const navigateToOrder = () => {
    uni.switchTab({
        url: '/pages/order/order'
    })
}
</script>

<style lang="scss" scoped>
.container {
    background-color: #f5f5f5;
    padding-bottom: 100rpx;
}

// 轮播图包装器
.banner-wrapper {
    position: relative;
    width: 100%;
    height: 650rpx;
    overflow: hidden;
    margin-top: 0;
}

// 轮播图背景
.banner-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition: background-color 0.5s ease;
}

.banner-bg-image {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1s ease;
}

.banner-bg-mask {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.1) 30%,
        rgba(0, 0, 0, 0.3) 70%,
        rgba(0, 0, 0, 0.5)
    );
    z-index: 2;
}

// 轮播图区域
.banner-swiper {
    position: relative;
    height: 100%;
    width: 100%;
    z-index: 3;
}

.banner-item {
    display: flex;
    height: 100%;
    padding: 30rpx;
    padding-top: 80rpx; // 减小顶部padding，因为用户信息栏已移出
}

.banner-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    z-index: 2;
}

.banner-tag {
    display: inline-block;
    padding: 5rpx 20rpx;
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 30rpx;
    font-size: 24rpx;
    margin-bottom: 20rpx;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.2);
    max-width: 300rpx;
}

.banner-title {
    font-size: 48rpx;
    font-weight: bold;
    line-height: 1.3;
    margin-bottom: 20rpx;
    color: #fff;
    text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);

    text {
        display: block;
    }
}

.banner-desc {
    font-size: 24rpx;
    margin-bottom: 30rpx;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);

    text {
        display: block;
        line-height: 1.5;
    }
}

.order-btn {
    display: inline-block;
    padding: 15rpx 40rpx;
    background-color: rgba(255, 255, 255, 0.3);
    color: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
    border: 1px solid rgba(255, 255, 255, 0.6);
    max-width: 200rpx;
}

// 顶部用户信息栏
.user-info-wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: -50rpx;
    z-index: 10;
    padding: 0 20rpx;
}

.user-info {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;
    border-radius: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
}

.avatar-container {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    overflow: hidden;
    background-color: #1296db;
}

.avatar {
    width: 100%;
    height: 100%;
}

.user-greeting {
    flex: 1;
    margin-left: 20rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
}

.coupon-btn {
    padding: 10rpx 30rpx;
    background-color: #1296db;
    color: #fff;
    border-radius: 30rpx;
    font-size: 28rpx;
}

// 服务选择区
.service-container {
    display: flex;
    margin: 20rpx;
}

.service-item {
    flex: 1;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin: 0 10rpx;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.service-icon {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 20rpx;
}

.service-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #a67c52;
    margin-bottom: 10rpx;
}

.service-desc {
    font-size: 24rpx;
    color: #999;
}

.service-tag {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    background-color: #a67c52;
    color: #fff;
    font-size: 20rpx;
    padding: 5rpx 10rpx;
    border-radius: 10rpx;
}

// 功能区
.function-container {
    display: flex;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx 0;
    margin: 0 20rpx 20rpx 20rpx;
}

.function-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 24rpx;
}

.function-icon {
    width: 80rpx;
    height: 80rpx;
    margin-bottom: 10rpx;
}

// 优惠活动区
.promo-container {
    display: flex;
    margin: 0 20rpx 100rpx 20rpx;
    height: 450rpx;
}

.promo-left {
    width: 50%;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-right: 10rpx;
    position: relative;
    height: 100%;
    box-sizing: border-box;
}

.promo-right {
    width: 50%;
    display: flex;
    flex-direction: column;
    margin-left: 10rpx;
    height: 100%;
    box-sizing: border-box;
}

.promo-right-top {
    flex: 1;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 20rpx;
    position: relative;
}

.promo-right-bottom {
    flex: 1;
    background-color: #fff;
    border-radius: 20rpx;
    padding: 30rpx;
    position: relative;
}

.promo-content {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.promo-title {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 10rpx;
}

.promo-desc {
    font-size: 24rpx;
    color: #a67c52;
    margin-bottom: 20rpx;
}

.promo-btn {
    display: inline-block;
    padding: 10rpx 20rpx;
    background-color: #a67c52;
    color: #fff;
    border-radius: 30rpx;
    font-size: 24rpx;
    width: fit-content;
}

.promo-image {
    position: absolute;
    bottom: 20rpx;
    right: 20rpx;
    width: 150rpx;
    height: 150rpx;

    image {
        width: 100%;
        height: 100%;
    }
}

// 会员福利区
// 已移至优惠活动区右下方
</style> 