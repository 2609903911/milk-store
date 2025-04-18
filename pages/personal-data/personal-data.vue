<template>
    <view class="personal-data-container">
        <!-- 加载状态 -->
        <view class="loading-container" v-if="loading">
            <view class="loading-spinner"></view>
            <text class="loading-text">加载中...</text>
        </view>

        <!-- 内容区域 -->
        <view class="content" v-else>
            <!-- 个人资料表单 -->
            <view class="user-form">
                <!-- 头像部分 -->
                <view class="form-item avatar-item">
                    <view class="avatar-wrapper">
                        <view class="avatar-container" @tap="chooseAvatar">
                            <image
                                class="avatar"
                                :src="
                                    userInfo.avatar ||
                                    '/static/images/avatar.png'
                                "
                                mode="aspectFill"
                                @error="handleAvatarError"
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
        <view class="save-btn" @tap="saveUserInfo" v-if="!loading">保存</view>

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

        <!-- 手机号更新弹窗 -->
        <PhoneUpdate
            :visible="isPhoneUpdateVisible"
            @update:visible="isPhoneUpdateVisible = $event"
            :currentPhone="userInfo.phone"
            @success="handlePhoneUpdateSuccess"
        />
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { get, post } from '../../utils/request'
import PhoneUpdate from '../components/phone-update.vue'
import { API_PATHS } from '../../utils/api/config'

// 加载状态
const loading = ref(true)

// 用户信息
const userInfo = ref({
    userId: '',
    avatar: '/static/images/avatar.png',
    nickname: '',
    phone: '',
    gender: 'male',
    birthday: '',
    memberLevel: 1,
    pandaCoins: 0,
    lightningStars: 0
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

// 手机号码修改弹窗
const isPhoneUpdateVisible = ref(false)

// 从API获取用户信息
const fetchUserProfile = async () => {
    loading.value = true
    try {
        // 从本地存储获取用户ID
        const userInfoStorage = uni.getStorageSync('userInfo')
        if (!userInfoStorage || !userInfoStorage.userId) {
            uni.showToast({
                title: '用户未登录',
                icon: 'none'
            })
            loading.value = false

            // 未登录时跳转回上一页
            setTimeout(() => {
                uni.navigateBack()
            }, 1500)
            return
        }

        const userId = userInfoStorage.userId
        const response = await get(
            `${API_PATHS.USER_PROFILE}?userId=${userId}`,
            {},
            {
                showError: true
            }
        )

        // 处理嵌套的响应结构
        const responseData =
            response.data && response.data.data
                ? response.data.data
                : response.data && response.data.code === 200
                ? response.data.data
                : null

        if (responseData) {
            // 处理生日日期格式
            let formattedBirthday = ''
            if (responseData.birthday) {
                // 处理ISO格式日期并转换为本地时区
                const birthdayDate = new Date(responseData.birthday)
                // 考虑到时区差异，使用本地日期
                const year = birthdayDate.getFullYear()
                // 月份从0开始，所以需要+1
                const month = String(birthdayDate.getMonth() + 1).padStart(
                    2,
                    '0'
                )
                const day = String(birthdayDate.getDate()).padStart(2, '0')
                formattedBirthday = `${year}-${month}-${day}`
            }

            // 更新用户信息
            userInfo.value = {
                userId: responseData.userId,
                avatar: responseData.avatar || '/static/images/avatar.png',
                nickname: responseData.nickname || '',
                phone: responseData.phone || '',
                gender: responseData.gender || 'male',
                birthday: formattedBirthday,
                memberLevel: responseData.memberLevel || 1,
                pandaCoins: responseData.pandaCoins || 0,
                lightningStars: responseData.lightningStars || 0
            }
        } else {
            uni.showToast({
                title: '获取用户信息失败',
                icon: 'none'
            })

            // 获取失败时跳转回上一页
            setTimeout(() => {
                uni.navigateBack()
            }, 1500)
        }
    } catch (error) {
        uni.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
        })

        // 错误时跳转回上一页
        setTimeout(() => {
            uni.navigateBack()
        }, 1500)
    } finally {
        loading.value = false
    }
}

// 初始化数据
onMounted(() => {
    // 从API获取用户信息
    fetchUserProfile()
})

// 格式化手机号
const formatPhone = (phone) => {
    if (!phone) return ''
    if (phone.length < 11) return phone
    // 只显示前3位和后4位，中间用****代替
    return phone.substring(0, 3) + '****' + phone.substring(7)
}

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 更新用户信息到后端
const updateUserProfile = async () => {
    try {
        loading.value = true
        // 构建要更新的数据，确保生日格式正确
        const updateData = {
            userId: userInfo.value.userId,
            nickname: userInfo.value.nickname,
            gender: userInfo.value.gender,
            birthday: userInfo.value.birthday, // 已格式化为YYYY-MM-DD
            avatar: userInfo.value.avatar
        }

        // 发送更新请求
        const response = await post(API_PATHS.USER_UPDATE, updateData, {
            showError: true
        })

        if (
            response &&
            (response.code === 200 ||
                (response.data && response.data.code === 200))
        ) {
            // 提示保存成功
            uni.showToast({
                title: '保存成功',
                icon: 'success'
            })

            // 延迟返回
            setTimeout(() => {
                uni.navigateBack()
            }, 1500)
        } else {
            uni.showToast({
                title: '保存失败，请重试',
                icon: 'none'
            })
        }
    } catch (error) {
        uni.showToast({
            title: '网络异常，请稍后再试',
            icon: 'none'
        })
    } finally {
        loading.value = false
    }
}

// 保存用户信息
const saveUserInfo = () => {
    // 更新到后端
    updateUserProfile()
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
    isPhoneUpdateVisible.value = true
}

// 手机号更新成功
const handlePhoneUpdateSuccess = (newPhone) => {
    // 更新用户手机号
    userInfo.value.phone = newPhone
    uni.showToast({
        title: '手机号更新成功',
        icon: 'success'
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

// 处理头像加载错误
const handleAvatarError = () => {
    // 当头像加载失败时，将使用默认的 src 属性值（已在模板中设置）
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

// 加载状态样式
.loading-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 6rpx solid #f3f3f3;
    border-top: 6rpx solid #0066cc;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
}

.loading-text {
    font-size: 28rpx;
    color: #666;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style> 