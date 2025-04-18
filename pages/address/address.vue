<template>
    <view class="address-container">
        <!-- 导航栏 -->
        <view class="nav-header">
            <view class="back-btn" @click="goBack">
                <uni-icons type="left" size="20"></uni-icons>
            </view>
            <view class="title">收货地址</view>
        </view>

        <!-- 默认位置 -->
        <view class="default-location">
            <view class="location-icon">
                <uni-icons
                    type="location-filled"
                    size="24"
                    color="#0066FF"
                ></uni-icons>
            </view>
            <view class="location-text">九江市浔阳区委(陆家坊支路东)</view>
        </view>

        <!-- 地址列表 -->
        <view class="address-list">
            <!-- 地址项 -->
            <view
                class="address-item"
                v-for="(item, index) in addressList"
                :key="index"
            >
                <view class="address-info">
                    <view class="address-title">{{ item.address }}</view>
                    <view class="address-user">
                        <text>{{ item.name }}</text>
                        <text>{{ item.phone }}</text>
                    </view>
                </view>
                <view class="edit-btn" @click="editAddress(item)">
                    <uni-icons type="compose" size="20"></uni-icons>
                </view>
            </view>

            <!-- 空状态 -->
            <view class="empty-state" v-if="addressList.length === 0">
                <image
                    src="/static/images/empty-address.png"
                    mode="aspectFit"
                ></image>
                <text>暂无收货地址</text>
            </view>
        </view>

        <!-- 添加地址按钮 -->
        <view class="add-address-btn" @click="addAddress"> 添加地址 </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'

// 模拟地址数据
const addressList = ref([
    {
        id: '1',
        address: '都昌县湖滨学校西1',
        name: 'Teia(先生)',
        phone: '130****1672',
        isDefault: false
    },
    {
        id: '2',
        address: '九江市浔阳区委(陆家坊支路东)1',
        name: '1(先生)',
        phone: '130****1672',
        isDefault: true
    }
])

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 编辑地址
const editAddress = (item) => {
    uni.navigateTo({
        url: `/pages/address/edit-address?id=${item.id}`
    })
}

// 添加地址
const addAddress = () => {
    uni.navigateTo({
        url: '/pages/address/edit-address'
    })
}
</script>

<style lang="scss">
.address-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
    margin-top: 44px;
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

    .right-btns {
        display: flex;
        align-items: center;
        gap: 15px;
    }
}

.default-location {
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: #ffffff;
    margin-bottom: 10px;

    .location-icon {
        margin-right: 10px;
    }

    .location-text {
        font-size: 14px;
        color: #333;
    }
}

.address-list {
    flex: 1;
    padding: 0 15px;
}

.address-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 15px;
    background-color: #ffffff;
    border-radius: 8px;
    margin-bottom: 10px;

    .address-info {
        flex: 1;
    }

    .address-title {
        font-size: 14px;
        color: #333;
        margin-bottom: 5px;
    }

    .address-user {
        font-size: 13px;
        color: #999;

        text {
            margin-right: 10px;
        }
    }

    .edit-btn {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;

    image {
        width: 120px;
        height: 120px;
        margin-bottom: 15px;
    }

    text {
        font-size: 14px;
        color: #999;
    }
}

.add-address-btn {
    margin: 20px 15px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    background-color: #0066ff;
    color: #ffffff;
    border-radius: 22px;
    font-size: 16px;
}
</style> 