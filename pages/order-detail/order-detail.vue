<template>
    <view class="order-detail-container">
        <!-- 顶部状态区域 -->
        <view class="status-banner">
            <!-- 背景图片 -->
            <image
                class="banner-background"
                src="/static/images/order-background.jpg"
                mode="aspectFill"
            ></image>

            <!-- 标题和返回按钮 -->
            <view class="nav-header">
                <view class="back-icon" @tap="goBack">
                    <uni-icons type="left" size="24"></uni-icons>
                </view>
            </view>

            <!-- 订单状态显示 -->
            <view class="order-status">
                <text class="status-text">订单已取消</text>
            </view>
        </view>

        <!-- 操作提示区域 - 压在顶部图片底部 -->
        <view class="action-tip-bar">
            <text class="tip-text">期待您的再次光临</text>
            <view class="reorder-btn">再来一单</view>
        </view>

        <!-- 下单帮助提示 -->
        <view class="order-helper-tip">
            <image
                class="helper-icon"
                src="/static/images/coin.png"
                mode="aspectFit"
            ></image>
            <text class="helper-text">下单顺利完成，前往兑好礼</text>
            <text class="helper-arrow">›</text>
        </view>

        <!-- 店铺信息 -->
        <view class="store-info-section">
            <view class="store-name">九江学院四食堂店</view>
            <view class="store-address"
                >江西省九江市浔阳区前进东路58号九江学院四食堂</view
            >
            <view class="store-actions">
                <view class="action-item">
                    <image
                        class="action-icon"
                        src="/static/images/phone.png"
                        mode="aspectFit"
                    ></image>
                    <text class="action-text">电话</text>
                </view>
                <view class="action-item">
                    <image
                        class="action-icon"
                        src="/static/images/navigation.png"
                        mode="aspectFit"
                    ></image>
                    <text class="action-text">导航</text>
                </view>
            </view>
        </view>

        <!-- 商品信息 -->
        <view class="product-section">
            <view class="product-item">
                <image
                    class="product-image"
                    src="/static/images/cart-icon.png"
                    mode="aspectFit"
                ></image>
                <view class="product-details">
                    <view class="product-name">竹蓉芒打椰</view>
                    <view class="product-spec">中杯,3分糖,少冰</view>
                </view>
                <view class="product-price-info">
                    <text class="price">¥16.00</text>
                    <text class="quantity">x1</text>
                </view>
            </view>
        </view>

        <!-- 价格信息 -->
        <view class="price-summary">
            <view class="discount-info">
                <text class="discount-label">优惠合计</text>
                <text class="discount-value">- ¥1.92</text>
            </view>
            <view class="discount-detail">
                <text class="discount-desc">周四会员日，LV0-LV5...</text>
            </view>
            <view class="total-price">
                <text class="total-label">共计1件商品，合计</text>
                <text class="total-value">¥14.08</text>
            </view>
        </view>

        <!-- 订单信息 -->
        <view class="order-info">
            <view class="info-title">订单信息</view>
            <view class="info-item">
                <text class="info-label">取餐码</text>
                <text class="info-value">暂无</text>
            </view>
            <view class="info-item">
                <text class="info-label">备注</text>
                <text class="info-value">无</text>
            </view>
            <view class="info-item">
                <text class="info-label">下单时间</text>
                <text class="info-value">2025-03-20 21:41:54</text>
            </view>
            <view class="info-item">
                <text class="info-label">订单号</text>
                <text class="info-value order-number">748388645480484946</text>
                <text class="copy-btn">复制</text>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 在页面加载时获取订单数据
onMounted(() => {
    // 这里可以从缓存或API获取订单详情
})

// 复制订单号
const copyOrderNumber = () => {
    uni.setClipboardData({
        data: '748388645480484946',
        success: () => {
            uni.showToast({
                title: '复制成功'
            })
        }
    })
}
</script>

<style>
.order-detail-container {
    min-height: 100vh;
    background-color: #f5f5f5;
}

/* 顶部状态区域 */
.status-banner {
    position: relative;
    height: 400rpx;
    color: #ff2b6a;
    overflow: hidden;
}

.banner-background {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
}

.nav-header {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: flex-start;
    padding: 20rpx;
}

.back-icon {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-back {
    font-size: 44rpx;
}

.banner-title {
    text-align: left;
    padding: 10rpx 40rpx;
}

.title-text {
    font-size: 40rpx;
    font-weight: bold;
    color: #111;
    font-style: italic;
}

.order-status {
    transform: translateY(60rpx);
    text-align: left;
    margin-top: 30rpx;
    padding: 0 40rpx;
    position: relative;
    z-index: 2;
}

.status-text {
    font-size: 45rpx;
    font-weight: bold;
    color: #111;
}

/* 操作提示区域 - 压在顶部图片底部 */
.action-tip-bar {
    position: relative;
    margin-top: -20rpx;
    background-color: #ffffff;
    border-radius: 20rpx 20rpx 0 0;
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
}

.tip-text {
    font-size: 28rpx;
    color: #666;
}

.reorder-btn {
    background-color: transparent;
    color: #348bec;
    font-size: 28rpx;
    padding: 12rpx 30rpx;
    border-radius: 20rpx;
    border: 1px solid #348bec;
}

/* 下单帮助提示 */
.order-helper-tip {
    background-color: #edf7ff;
    padding: 20rpx 30rpx;
    display: flex;
    align-items: center;
    margin: 20rpx;
    border-radius: 8rpx;
}

.helper-icon {
    width: 40rpx;
    height: 40rpx;
    margin-right: 15rpx;
}

.helper-text {
    flex: 1;
    font-size: 26rpx;
    color: #055ae1;
}

.helper-arrow {
    font-size: 36rpx;
    color: #999;
}

/* 店铺信息 */
.store-info-section {
    background-color: white;
    padding: 30rpx;
    margin: 0 20rpx 20rpx 20rpx;
    border-radius: 8rpx;
}

.store-name {
    font-size: 32rpx;
    font-weight: bold;
    margin-bottom: 15rpx;
}

.store-address {
    font-size: 26rpx;
    color: #666;
    margin-bottom: 20rpx;
}

.store-actions {
    display: flex;
    border-top: 1px solid #eee;
    padding-top: 20rpx;
}

.action-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
}

.action-icon {
    width: 48rpx;
    height: 48rpx;
}

.action-text {
    font-size: 24rpx;
    color: #666;
}

/* 商品信息 */
.product-section {
    background-color: white;
    padding: 30rpx;
    margin: 0 20rpx 20rpx 20rpx;
    border-radius: 8rpx;
}

.product-item {
    display: flex;
    align-items: center;
}

.product-image {
    width: 100rpx;
    height: 100rpx;
    border-radius: 8rpx;
}

.product-details {
    flex: 1;
    padding: 0 20rpx;
}

.product-name {
    font-size: 28rpx;
    margin-bottom: 10rpx;
}

.product-spec {
    font-size: 24rpx;
    color: #999;
}

.product-price-info {
    text-align: right;
}

.price {
    font-size: 28rpx;
    font-weight: bold;
    display: block;
    margin-bottom: 10rpx;
}

.quantity {
    font-size: 24rpx;
    color: #999;
}

/* 价格信息 */
.price-summary {
    background-color: white;
    padding: 30rpx;
    margin: 0 20rpx 20rpx 20rpx;
    border-radius: 8rpx;
}

.discount-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10rpx;
}

.discount-label {
    font-size: 26rpx;
    color: #666;
}

.discount-value {
    font-size: 26rpx;
    color: #ff4500;
}

.discount-detail {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 20rpx;
}

.total-price {
    display: flex;
    justify-content: space-between;
    padding-top: 20rpx;
    border-top: 1px solid #eee;
}

.total-label {
    font-size: 28rpx;
}

.total-value {
    font-size: 30rpx;
    font-weight: bold;
}

/* 订单信息 */
.order-info {
    background-color: white;
    padding: 30rpx;
    margin: 0 20rpx 40rpx 20rpx;
    border-radius: 8rpx;
}

.info-title {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 20rpx;
}

.info-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20rpx;
    align-items: center;
}

.info-label {
    font-size: 26rpx;
    color: #999;
}

.info-value {
    font-size: 26rpx;
    color: #333;
}

.order-number {
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
}

.copy-btn {
    font-size: 24rpx;
    color: #1989fa;
    background-color: #f0f8ff;
    padding: 4rpx 16rpx;
    border-radius: 30rpx;
}
</style>
