<template>
    <view class="content">
        <image class="logo" src="/static/logo.png"></image>
        <view class="text-area">
            <text class="title">我的订单页面</text>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('我的订单')
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.logo {
    height: 200rpx;
    width: 200rpx;
    margin-top: 200rpx;
    margin-bottom: 50rpx;
}

.text-area {
    display: flex;
    justify-content: center;
}

.title {
    font-size: 36rpx;
    color: #8f8f94;
}
</style> 