<template>
    <view class="personal-data-container">
        <view class="content">
            <!-- 个人资料表单 -->
            <view class="user-form">
                <!-- 头像部分 -->
                <view class="form-item avatar-item">
                    <view class="avatar-container">
                        <image
                            class="avatar"
                            :src="userInfo.avatar"
                            mode="aspectFill"
                        ></image>
                        <view class="camera-icon">
                            <image
                                src="/static/images/camera.png"
                                mode="aspectFit"
                            ></image>
                        </view>
                    </view>
                </view>

                <!-- 昵称 -->
                <view class="form-item">
                    <view class="label">昵称</view>
                    <view class="input-area">
                        <input
                            type="text"
                            v-model="userInfo.nickname"
                            placeholder="请输入昵称"
                        />
                    </view>
                </view>

                <!-- 手机号 -->
                <view class="form-item">
                    <view class="label">手机</view>
                    <view class="input-area with-btn">
                        <text class="value">{{
                            formatPhone(userInfo.phone)
                        }}</text>
                        <view class="action-btn" @tap="bindPhone"
                            >更换绑定</view
                        >
                    </view>
                </view>

                <!-- 性别 -->
                <view class="form-item">
                    <view class="label">性别</view>
                    <view class="radio-group">
                        <view
                            class="radio-item"
                            @tap="userInfo.gender = 'male'"
                        >
                            <view
                                class="radio"
                                :class="{
                                    'radio-active': userInfo.gender === 'male'
                                }"
                            ></view>
                            <text>男</text>
                        </view>
                        <view
                            class="radio-item"
                            @tap="userInfo.gender = 'female'"
                        >
                            <view
                                class="radio"
                                :class="{
                                    'radio-active': userInfo.gender === 'female'
                                }"
                            ></view>
                            <text>女</text>
                        </view>
                    </view>
                </view>

                <!-- 生日 -->
                <view class="form-item">
                    <view class="label">生日</view>
                    <view class="input-area with-btn" @tap="showDatePicker">
                        <text class="value">{{
                            userInfo.birthday || '未设置'
                        }}</text>
                        <view class="action-btn">修改生日</view>
                    </view>
                </view>
            </view>

            <!-- 收货地址 -->
            <view class="action-item" @tap="goToAddressManage">
                <text>收货地址</text>
                <uni-icons type="right" size="20" color="#ccc"></uni-icons>
            </view>

            <!-- 切换账号 -->
            <view class="action-item" @tap="switchAccount">
                <text>切换账号</text>
                <uni-icons type="right" size="20" color="#ccc"></uni-icons>
            </view>
        </view>

        <!-- 保存按钮 -->
        <view class="save-btn" @tap="saveUserInfo">保存</view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { userState, updateUserState } from '../../utils/userState'

// 用户信息
const userInfo = ref({
    avatar: '/static/images/avatar.png',
    nickname: '醇厚的生椰西瓜',
    phone: '13012341234',
    gender: 'male', // male或female
    birthday: ''
})

// 初始化数据
onMounted(() => {
    // 从本地存储获取用户信息
    if (userState) {
        userInfo.value = {
            avatar: userState.avatar || '/static/images/avatar.png',
            nickname: userState.nickname || '醇厚的生椰西瓜',
            phone: userState.phone || '13012341234',
            gender: userState.gender || 'male',
            birthday: userState.birthday || ''
        }
    }
})

// 格式化手机号
const formatPhone = (phone) => {
    if (!phone) return ''
    // 只显示前3位和后4位，中间用****代替
    return phone.substring(0, 3) + '****' + phone.substring(7)
}

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 保存用户信息
const saveUserInfo = () => {
    // 更新用户信息
    updateUserState({
        avatar: userInfo.value.avatar,
        nickname: userInfo.value.nickname,
        phone: userInfo.value.phone,
        gender: userInfo.value.gender,
        birthday: userInfo.value.birthday
    })

    // 提示保存成功
    uni.showToast({
        title: '保存成功',
        icon: 'success'
    })

    // 延迟返回
    setTimeout(() => {
        uni.navigateBack()
    }, 1500)
}

// 显示日期选择器
const showDatePicker = () => {
    uni.showToast({
        title: '日期选择功能即将上线',
        icon: 'none'
    })
}

// 绑定手机号
const bindPhone = () => {
    uni.showToast({
        title: '更换手机号功能即将上线',
        icon: 'none'
    })
}

// 跳转到地址管理
const goToAddressManage = () => {
    uni.showToast({
        title: '地址管理功能即将上线',
        icon: 'none'
    })
}

// 切换账号
const switchAccount = () => {
    uni.showToast({
        title: '切换账号功能即将上线',
        icon: 'none'
    })
}
</script>

<style lang="scss" scoped>
.personal-data-container {
    min-height: 100vh;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
}

.page-header {
    position: relative;
    height: 90rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.back-btn {
    position: absolute;
    left: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.page-title {
    font-size: 32rpx;
    font-weight: 500;
    color: #333;
}

.content {
    flex: 1;
    padding: 30rpx;
}

.user-form {
    background-color: #fff;
    border-radius: 12rpx;
    overflow: hidden;
    margin-bottom: 30rpx;
}

.form-item {
    padding: 30rpx;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f5f5f5;
}

.avatar-item {
    justify-content: center;
    padding: 40rpx 0;
}

.avatar-container {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    border-radius: 80rpx;
    overflow: hidden;
}

.avatar {
    width: 100%;
    height: 100%;
}

.camera-icon {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 50rpx;
    height: 50rpx;
    background-color: #0066cc;
    border-radius: 25rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.camera-icon image {
    width: 30rpx;
    height: 30rpx;
}

.label {
    font-size: 28rpx;
    color: #333;
    width: 120rpx;
}

.input-area {
    flex: 1;
    display: flex;
    align-items: center;
}

.with-btn {
    justify-content: space-between;
}

input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.value {
    font-size: 28rpx;
    color: #333;
}

.action-btn {
    font-size: 26rpx;
    color: #0066cc;
    padding: 10rpx 20rpx;
}

.radio-group {
    flex: 1;
    display: flex;
    gap: 40rpx;
}

.radio-item {
    display: flex;
    align-items: center;
}

.radio {
    width: 40rpx;
    height: 40rpx;
    border-radius: 20rpx;
    border: 1px solid #ccc;
    margin-right: 10rpx;
    display: flex;
    align-items: center;
    justify-content: center;
}

.radio-active {
    border-color: #0066cc;
}

.radio-active::after {
    content: '';
    width: 24rpx;
    height: 24rpx;
    border-radius: 12rpx;
    background-color: #0066cc;
}

.action-item {
    margin-bottom: 30rpx;
    background-color: #fff;
    border-radius: 12rpx;
    padding: 30rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 28rpx;
    color: #333;
}

.save-btn {
    margin: 60rpx 30rpx;
    height: 90rpx;
    background-color: #0066cc;
    color: #fff;
    font-size: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 45rpx;
}
</style> 