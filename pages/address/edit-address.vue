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
                    v-model="formData.contactName"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { get, post, put, request } from '../../utils/api/request'
import { userState } from '../../utils/userState'
import { onBackPress } from '@dcloudio/uni-app'

// 获取页面参数
const props = defineProps({
    id: {
        type: String,
        default: ''
    }
})

// 判断是编辑还是新增
const isEdit = computed(() => !!props.id)

// loading状态跟踪
const isLoading = ref(false)

// 表单数据
const formData = ref({
    contactName: '',
    phone: '',
    gender: 'male',
    address: '',
    addressDetail: '',
    isDefault: false
})

// 确保页面卸载时关闭loading
onUnmounted(() => {
    if (isLoading.value) {
        uni.hideLoading()
        isLoading.value = false
    }
})

// 监听返回事件，确保返回时关闭loading
onBackPress(() => {
    if (isLoading.value) {
        uni.hideLoading()
        isLoading.value = false
    }
})

// 安全的显示loading
const safeShowLoading = (title) => {
    if (!isLoading.value) {
        uni.showLoading({
            title: title || '加载中...'
        })
        isLoading.value = true
    }
}

// 安全的隐藏loading
const safeHideLoading = () => {
    if (isLoading.value) {
        uni.hideLoading()
        isLoading.value = false
    }
}

// 页面初始化
onMounted(() => {
    // 如果是编辑模式
    if (isEdit.value) {
        // 尝试从事件通道获取数据
        const eventChannel = getOpenerEventChannel()

        // 检查eventChannel是否存在及是否有addressData事件
        if (eventChannel && eventChannel.on) {
            eventChannel.on('addressData', function (data) {
                if (data) {
                    // 使用从事件通道获取的数据填充表单
                    formData.value = {
                        contactName: data.contactName || '',
                        phone: data.phone || '',
                        gender: data.gender || 'male',
                        address: data.address || '',
                        addressDetail: '', // 可能需要从API获取
                        isDefault: !!data.isDefault
                    }
                } else {
                    // 如果没有获取到数据，则从API获取
                    fetchAddressDetail()
                }
            })
        } else {
            // 如果没有eventChannel，则从API获取
            fetchAddressDetail()
        }
    }
})

// 获取当前页面的事件通道
function getOpenerEventChannel() {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const eventChannel = currentPage.getOpenerEventChannel()
    return eventChannel
}

// 获取地址详情
const fetchAddressDetail = async () => {
    try {
        // 显示加载中
        safeShowLoading('加载中...')

        // 从页面参数或路由参数中获取地址ID
        const addressId = props.id

        if (!addressId) {
            safeHideLoading()
            return uni.showToast({
                title: '地址ID不能为空',
                icon: 'none'
            })
        }

        // 请求API获取地址详情
        const result = await get(`/api/user/address/${addressId}`, {
            userId: userState.userId
        })

        console.log('获取到的地址详情:', result)

        if (result.code === 200 && result.data) {
            // 更新表单数据
            formData.value = {
                contactName: result.data.contactName,
                phone: result.data.phone,
                gender: result.data.gender || 'male',
                address: result.data.address,
                addressDetail: result.data.addressDetail || '',
                isDefault: result.data.isDefault
            }
        } else {
            uni.showToast({
                title: '获取地址详情失败',
                icon: 'none'
            })
        }
    } catch (error) {
        console.error('获取地址详情失败:', error)
        uni.showToast({
            title: '获取地址详情失败，请重试',
            icon: 'none'
        })
    } finally {
        safeHideLoading()
    }
}

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
const saveAddress = async () => {
    // 表单验证
    if (!formData.value.contactName) {
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

    try {
        // 显示加载中
        safeShowLoading('保存中...')

        // 构建提交的数据
        const submitData = {
            userId: userState.userId,
            contactName: formData.value.contactName,
            phone: formData.value.phone,
            gender: formData.value.gender,
            address: formData.value.address,
            addressDetail: formData.value.addressDetail,
            isDefault: formData.value.isDefault
        }

        let result

        // 根据是否编辑模式调用不同的API
        if (isEdit.value) {
            // 编辑地址
            result = await put(`/api/user/address/${props.id}`, submitData)
        } else {
            // 新增地址
            result = await post('/api/user/address', submitData)
        }

        console.log('保存地址结果:', result)

        // 隐藏loading再显示toast
        safeHideLoading()

        if (result.code === 200) {
            uni.showToast({
                title: isEdit.value ? '地址更新成功' : '地址添加成功',
                icon: 'success',
                success: () => {
                    setTimeout(() => {
                        uni.navigateBack()
                    }, 1500)
                }
            })
        } else {
            uni.showToast({
                title: result.message || '保存失败',
                icon: 'none'
            })
        }
    } catch (error) {
        console.error('保存地址失败:', error)
        safeHideLoading()
        uni.showToast({
            title: '保存失败，请重试',
            icon: 'none'
        })
    }
}

// 删除地址
const deleteAddress = async () => {
    uni.showModal({
        title: '提示',
        content: '确定要删除该收货地址吗？',
        success: async (res) => {
            if (res.confirm) {
                try {
                    // 显示加载中
                    safeShowLoading('删除中...')

                    // 调用删除API
                    const result = await request({
                        url: `/api/user/address/${props.id}`,
                        method: 'DELETE',
                        data: {
                            userId: userState.userId
                        }
                    })

                    console.log('删除地址结果:', result)

                    // 隐藏loading再显示toast
                    safeHideLoading()

                    if (result.code === 200) {
                        uni.showToast({
                            title: '地址删除成功',
                            icon: 'success',
                            success: () => {
                                setTimeout(() => {
                                    uni.navigateBack()
                                }, 1500)
                            }
                        })
                    } else {
                        uni.showToast({
                            title: result.message || '删除失败',
                            icon: 'none'
                        })
                    }
                } catch (error) {
                    console.error('删除地址失败:', error)
                    safeHideLoading()
                    uni.showToast({
                        title: '删除失败，请重试',
                        icon: 'none'
                    })
                }
            }
        }
    })
}
</script>

<style lang="scss">
.edit-address-container {
    display: flex;
    flex-direction: column;
    min-height: 94vh;
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
        width: 100px;
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