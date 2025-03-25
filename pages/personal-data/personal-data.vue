<template>
    <view class="personal-data-container">
        <view class="content">
            <!-- 个人资料表单 -->
            <view class="user-form">
                <!-- 头像部分 -->
                <view class="form-item avatar-item">
                    <view class="avatar-wrapper">
                        <view class="avatar-container" @tap="chooseAvatar">
                            <image
                                class="avatar"
                                :src="userInfo.avatar"
                                mode="aspectFill"
                            ></image>
                        </view>
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

        <!-- 日期选择器弹窗 -->
        <view
            class="date-picker-mask"
            v-if="isDatePickerVisible"
            @tap="hideDatePicker"
        >
            <view class="date-picker-container" @tap.stop>
                <view class="date-picker-header">
                    <text class="cancel-btn" @tap="hideDatePicker">取消</text>
                    <text class="title">选择生日</text>
                    <text class="confirm-btn" @tap="confirmDateSelection"
                        >确定</text
                    >
                </view>
                <picker-view
                    class="date-picker"
                    :indicator-style="'height: 50px;'"
                    :value="datePickerValue"
                    @change="onDatePickerChange"
                >
                    <picker-view-column>
                        <view
                            class="picker-item"
                            v-for="(year, index) in years"
                            :key="'year-' + index"
                            >{{ year }}年</view
                        >
                    </picker-view-column>
                    <picker-view-column>
                        <view
                            class="picker-item"
                            v-for="(month, index) in months"
                            :key="'month-' + index"
                            >{{ month }}月</view
                        >
                    </picker-view-column>
                    <picker-view-column>
                        <view
                            class="picker-item"
                            v-for="(day, index) in days"
                            :key="'day-' + index"
                            >{{ day }}日</view
                        >
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { userState, updateUserState } from '../../utils/userState'

// 用户信息
const userInfo = ref({
    avatar: '/static/images/avatar.png',
    nickname: '醇厚的生椰西瓜',
    phone: '13012341234',
    gender: 'male', // male或female
    birthday: ''
})

// 日期选择器相关数据
const isDatePickerVisible = ref(false)

// 获取今天的日期
const today = new Date()
const todayYear = today.getFullYear()
const todayMonth = today.getMonth() + 1 // JavaScript月份从0开始
const todayDay = today.getDate()

// 初始化为今天的日期
const selectedYear = ref(todayYear)
const selectedMonth = ref(todayMonth)
const selectedDay = ref(todayDay)

// 生成年份数据（1950-当前年份）
const currentYear = todayYear
const years = Array.from({ length: currentYear - 1949 }, (_, i) => i + 1950)

// 生成月份数据（1-12月）
const months = Array.from({ length: 12 }, (_, i) => i + 1)

// 根据年月计算当月天数
const days = computed(() => {
    const daysInMonth = new Date(
        selectedYear.value,
        selectedMonth.value,
        0
    ).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => i + 1)
})

// 计算默认的日期选择器位置索引
const defaultDatePickerValue = [
    years.findIndex((y) => y === todayYear),
    todayMonth - 1,
    todayDay - 1
]
const datePickerValue = ref(defaultDatePickerValue)

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

        // 如果存在生日，初始化日期选择器的值
        if (userInfo.value.birthday) {
            const [year, month, day] = userInfo.value.birthday
                .split('-')
                .map(Number)
            selectedYear.value = year
            selectedMonth.value = month
            selectedDay.value = day

            // 设置选择器初始位置
            datePickerValue.value = [
                years.findIndex((y) => y === year),
                months.findIndex((m) => m === month),
                days.value.findIndex((d) => d === day)
            ]
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
    // 如果用户已设置生日，使用已设置的日期
    if (userInfo.value.birthday) {
        const [year, month, day] = userInfo.value.birthday
            .split('-')
            .map(Number)
        selectedYear.value = year
        selectedMonth.value = month
        selectedDay.value = day

        // 设置选择器初始位置
        datePickerValue.value = [
            years.findIndex((y) => y === year),
            months.findIndex((m) => m === month),
            days.value.findIndex((d) => d === day)
        ]
    } else {
        // 如果用户未设置生日，使用今天的日期
        selectedYear.value = todayYear
        selectedMonth.value = todayMonth
        selectedDay.value = todayDay
        datePickerValue.value = defaultDatePickerValue
    }

    isDatePickerVisible.value = true
}

// 隐藏日期选择器
const hideDatePicker = () => {
    isDatePickerVisible.value = false
}

// 日期选择器值变化
const onDatePickerChange = (e) => {
    const values = e.detail.value
    selectedYear.value = years[values[0]]
    selectedMonth.value = months[values[1]]

    // 确保选择的日期有效（比如2月份的日期）
    const daysInSelectedMonth = new Date(
        selectedYear.value,
        selectedMonth.value,
        0
    ).getDate()
    if (values[2] >= daysInSelectedMonth) {
        values[2] = daysInSelectedMonth - 1
    }

    selectedDay.value = days.value[values[2]]
    datePickerValue.value = values
}

// 确认日期选择
const confirmDateSelection = () => {
    // 格式化日期为YYYY-MM-DD格式
    const formatMonth = selectedMonth.value.toString().padStart(2, '0')
    const formatDay = selectedDay.value.toString().padStart(2, '0')
    userInfo.value.birthday = `${selectedYear.value}-${formatMonth}-${formatDay}`

    hideDatePicker()
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

// 选择头像图片
const chooseAvatar = () => {
    uni.chooseImage({
        count: 1, // 默认9，设置为1表示一次只能选择一张图片
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有，这里使用压缩图
        sourceType: ['album', 'camera'], // 从相册选择或使用相机拍摄
        success: function (res) {
            // 获取选择的图片临时路径
            const tempFilePath = res.tempFilePaths[0]

            // 预览裁剪
            uni.navigateTo({
                url: `/pages/image-cropper/image-cropper?src=${encodeURIComponent(
                    tempFilePath
                )}&type=avatar`,
                events: {
                    // 接收裁剪后的图片
                    cropImage: function (data) {
                        if (data.path) {
                            // 更新头像
                            userInfo.value.avatar = data.path
                        }
                    }
                },
                fail: () => {
                    // 如果没有裁剪页面，直接使用选择的图片
                    userInfo.value.avatar = tempFilePath
                }
            })
        }
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

.avatar-wrapper {
    position: relative;
    width: 160rpx;
    height: 160rpx;
}

.avatar-container {
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
    z-index: 2;
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
    border-radius: 20rpx;
}

// 日期选择器样式
.date-picker-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
    display: flex;
    align-items: flex-end;
}

.date-picker-container {
    width: 100%;
    background-color: #fff;
    border-radius: 20rpx 20rpx 0 0;
    overflow: hidden;
}

.date-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx 30rpx;
    border-bottom: 1px solid #f0f0f0;
}

.cancel-btn,
.confirm-btn {
    font-size: 30rpx;
    padding: 10rpx;
}

.cancel-btn {
    color: #999;
}

.confirm-btn {
    color: #007aff;
    font-weight: 500;
}

.title {
    font-size: 30rpx;
    color: #333;
    font-weight: 500;
}

.date-picker {
    width: 100%;
    height: 400rpx;
}

.picker-item {
    line-height: 50px;
    text-align: center;
    font-size: 28rpx;
    color: #333;
}
</style> 