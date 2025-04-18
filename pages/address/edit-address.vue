<template>
    <view class="edit-address-container">
        <!-- 导航栏 -->
        <view class="nav-header">
            <view class="back-btn" @click="goBack">
                <uni-icons type="left" size="20"></uni-icons>
            </view>
            <view class="title">{{ isEdit ? '编辑地址' : '新增地址' }}</view>
            <view class="right-space"></view>
        </view>

        <!-- 表单 -->
        <view class="form-container">
            <!-- 联系人 -->
            <view class="form-item">
                <view class="form-label">联系人</view>
                <input
                    class="form-input"
                    type="text"
                    v-model="formData.name"
                    placeholder="请输入联系人姓名"
                />
            </view>

            <!-- 手机号 -->
            <view class="form-item">
                <view class="form-label">手机号</view>
                <input
                    class="form-input"
                    type="number"
                    v-model="formData.phone"
                    placeholder="请输入手机号码"
                    maxlength="11"
                />
            </view>

            <!-- 性别选择 -->
            <view class="form-item">
                <view class="form-label">性别</view>
                <view class="gender-selector">
                    <view
                        class="gender-option"
                        :class="{ active: formData.gender === 'male' }"
                        @click="formData.gender = 'male'"
                    >
                        先生
                    </view>
                    <view
                        class="gender-option"
                        :class="{ active: formData.gender === 'female' }"
                        @click="formData.gender = 'female'"
                    >
                        女士
                    </view>
                </view>
            </view>

            <!-- 收货地址 -->
            <view class="form-item">
                <view class="form-label">收货地址</view>
                <view class="location-select" @click="chooseLocation">
                    <text v-if="formData.address">{{ formData.address }}</text>
                    <text v-else class="placeholder">点击选择收货地址</text>
                    <uni-icons type="right" size="16" color="#999"></uni-icons>
                </view>
            </view>

            <!-- 详细地址 -->
            <view class="form-item">
                <view class="form-label">详细地址</view>
                <textarea
                    class="form-textarea"
                    v-model="formData.addressDetail"
                    placeholder="请输入详细地址信息，如楼层、门牌号等"
                />
            </view>

            <!-- 设为默认地址 -->
            <view class="form-item switch-item">
                <view class="form-label">设为默认地址</view>
                <switch
                    :checked="formData.isDefault"
                    @change="formData.isDefault = $event.detail.value"
                    color="#0066FF"
                />
            </view>
        </view>

        <!-- 保存按钮 -->
        <view class="save-btn" @click="saveAddress"> 保存 </view>

        <!-- 删除按钮 -->
        <view class="delete-btn" v-if="isEdit" @click="deleteAddress">
            删除收货地址
        </view>
    </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 获取页面参数
const props = defineProps({
    id: {
        type: String,
        default: ''
    }
})

// 判断是编辑还是新增
const isEdit = computed(() => !!props.id)

// 表单数据
const formData = ref({
    name: '',
    phone: '',
    gender: 'male', // 默认为先生
    address: '',
    addressDetail: '',
    isDefault: false
})

// 页面初始化
onMounted(() => {
    // 如果是编辑模式，获取地址详情
    if (isEdit.value) {
        // 这里应该从后端获取地址详情
        // 暂时使用模拟数据
        if (props.id === '1') {
            formData.value = {
                name: 'Teia',
                phone: '13012341672',
                gender: 'male',
                address: '都昌县湖滨学校西',
                addressDetail: '1号楼',
                isDefault: false
            }
        } else if (props.id === '2') {
            formData.value = {
                name: '1',
                phone: '13012341672',
                gender: 'male',
                address: '九江市浔阳区委(陆家坊支路东)',
                addressDetail: '1号',
                isDefault: true
            }
        }
    }
})

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 选择位置
const chooseLocation = () => {
    uni.showToast({
        title: '选择位置功能待实现',
        icon: 'none'
    })
    // uni.chooseLocation({
    //     success: (res) => {
    //         formData.value.address = res.address
    //     }
    // })
}

// 保存地址
const saveAddress = () => {
    // 表单验证
    if (!formData.value.name) {
        return uni.showToast({
            title: '请输入联系人姓名',
            icon: 'none'
        })
    }

    if (!formData.value.phone) {
        return uni.showToast({
            title: '请输入手机号码',
            icon: 'none'
        })
    }

    if (!/^1\d{10}$/.test(formData.value.phone)) {
        return uni.showToast({
            title: '手机号格式不正确',
            icon: 'none'
        })
    }

    if (!formData.value.address) {
        return uni.showToast({
            title: '请选择收货地址',
            icon: 'none'
        })
    }

    // 这里应该调用后端API保存地址
    uni.showToast({
        title: '地址保存成功',
        icon: 'success',
        success: () => {
            setTimeout(() => {
                uni.navigateBack()
            }, 1500)
        }
    })
}

// 删除地址
const deleteAddress = () => {
    uni.showModal({
        title: '提示',
        content: '确定要删除该收货地址吗？',
        success: (res) => {
            if (res.confirm) {
                // 这里应该调用后端API删除地址
                uni.showToast({
                    title: '地址删除成功',
                    icon: 'success',
                    success: () => {
                        setTimeout(() => {
                            uni.navigateBack()
                        }, 1500)
                    }
                })
            }
        }
    })
}
</script>

<style lang="scss">
.edit-address-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
    margin-top: 44px; // 向上移动导航栏的高度
}

.nav-header {
    display: flex;
    align-items: center;
    height: 44px;
    background-color: #ffffff;
    padding: 0 15px;
    position: relative;
    border-bottom: 1px solid #f0f0f0;

    .back-btn {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .title {
        flex: 1;
        text-align: center;
        font-size: 16px;
        font-weight: 500;
    }

    .right-space {
        width: 30px;
    }
}

.form-container {
    background-color: #fff;
    margin-top: 10px;
}

.form-item {
    display: flex;
    padding: 15px;
    border-bottom: 1px solid #f0f0f0;

    .form-label {
        width: 80px;
        font-size: 14px;
        color: #333;
    }

    .form-input,
    .form-textarea {
        flex: 1;
        font-size: 14px;
        color: #333;
    }

    .placeholder {
        color: #999;
    }

    .location-select {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #333;
    }

    .form-textarea {
        height: 60px;
    }
}

.gender-selector {
    display: flex;
    gap: 15px;

    .gender-option {
        padding: 5px 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
        color: #333;

        &.active {
            border-color: #0066ff;
            color: #0066ff;
            background-color: rgba(0, 102, 255, 0.05);
        }
    }
}

.switch-item {
    justify-content: space-between;
}

.save-btn {
    margin: 20px 15px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background-color: #0066ff;
    color: #ffffff;
    border-radius: 22px;
    font-size: 16px;
}

.delete-btn {
    margin: 10px 15px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background-color: #ffffff;
    color: #ff3b30;
    border-radius: 22px;
    font-size: 16px;
}
</style> 