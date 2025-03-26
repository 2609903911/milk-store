<template>
    <view class="search-container">
        <!-- 搜索头部 -->
        <view class="search-header">
            <view class="search-input-box">
                <uni-icons type="search" size="18" color="#999"></uni-icons>
                <input
                    type="text"
                    v-model="searchText"
                    placeholder="搜索商品"
                    @confirm="handleSearch"
                />
            </view>
            <text class="cancel-btn" @tap="goBack">取消</text>
        </view>

        <!-- 搜索历史 -->
        <view
            class="search-history"
            v-if="!searchText && searchHistory.length > 0"
        >
            <view class="history-header">
                <text class="title">搜索历史</text>
                <text class="clear-btn" @tap="clearHistory">清空</text>
            </view>
            <view class="history-list">
                <text
                    class="history-item"
                    v-for="(item, index) in searchHistory"
                    :key="index"
                    @tap="handleHistoryClick(item)"
                    >{{ item }}</text
                >
            </view>
        </view>

        <!-- 搜索结果 -->
        <view class="search-result" v-if="searchText">
            <view v-if="searchResults.length === 0" class="empty-result">
                <image
                    src="/static/images/empty-search.png"
                    mode="aspectFit"
                    class="empty-icon"
                ></image>
                <text>没有找到相关商品</text>
            </view>
            <view class="result-list" v-else>
                <view
                    class="result-item"
                    v-for="(item, index) in searchResults"
                    :key="index"
                    @tap="viewProductDetail(item)"
                >
                    <image
                        :src="item.image"
                        mode="aspectFill"
                        class="product-image"
                    ></image>
                    <view class="product-info">
                        <text class="product-name">{{ item.name }}</text>
                        <text class="product-category">{{
                            item.category
                        }}</text>
                        <text class="product-desc">{{ item.desc }}</text>
                        <text class="product-price">¥{{ item.price }}</text>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { searchProducts } from '../../utils/productData'

// 搜索文本
const searchText = ref('')

// 搜索历史
const searchHistory = ref([])

// 搜索结果
const searchResults = ref([])

// 返回上一页
const goBack = () => {
    uni.navigateBack()
}

// 处理搜索
const handleSearch = () => {
    if (!searchText.value.trim()) return

    // 添加到搜索历史
    if (!searchHistory.value.includes(searchText.value)) {
        searchHistory.value.unshift(searchText.value)
        // 限制历史记录数量
        if (searchHistory.value.length > 10) {
            searchHistory.value.pop()
        }
        // 保存到本地存储
        uni.setStorageSync('searchHistory', searchHistory.value)
    }

    // 使用工具函数从本地存储搜索产品
    searchResults.value = searchProducts(searchText.value)
}

// 清空搜索历史
const clearHistory = () => {
    uni.showModal({
        title: '提示',
        content: '确定要清空搜索历史吗？',
        success: (res) => {
            if (res.confirm) {
                searchHistory.value = []
                uni.removeStorageSync('searchHistory')
            }
        }
    })
}

// 点击历史记录
const handleHistoryClick = (keyword) => {
    searchText.value = keyword
    handleSearch()
}

// 查看产品详情
const viewProductDetail = (product) => {
    // 可以跳转到产品详情页或打开商品详情弹窗
    uni.showToast({
        title: `您选择了${product.name}`,
        icon: 'none'
    })

    // 这里可以添加跳转逻辑
    // uni.navigateTo({
    //     url: `/pages/product-detail/product-detail?id=${product.id}`
    // })
}

// 页面加载时获取搜索历史
onMounted(() => {
    const history = uni.getStorageSync('searchHistory')
    if (history) {
        searchHistory.value = history
    }
})
</script>

<style lang="scss" scoped>
.search-container {
    min-height: 100vh;
    background-color: #f8f8f8;
}

.search-header {
    display: flex;
    align-items: center;
    padding: 20rpx 30rpx;
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 100;
}

.search-input-box {
    flex: 1;
    height: 72rpx;
    background-color: #f5f5f5;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    padding: 0 30rpx;
    margin-right: 20rpx;
}

.search-input-box input {
    flex: 1;
    height: 100%;
    margin-left: 20rpx;
    font-size: 28rpx;
}

.cancel-btn {
    font-size: 28rpx;
    color: #666;
}

.search-history {
    margin-top: 20rpx;
    background-color: #fff;
    padding: 30rpx;
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
}

.history-header .title {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
}

.history-header .clear-btn {
    font-size: 26rpx;
    color: #999;
}

.history-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.history-item {
    padding: 10rpx 30rpx;
    background-color: #f5f5f5;
    border-radius: 30rpx;
    font-size: 26rpx;
    color: #666;
}

.search-result {
    padding: 20rpx;
}

.result-list {
    display: flex;
    flex-direction: column;
    gap: 20rpx;
}

.result-item {
    display: flex;
    padding: 20rpx;
    background-color: #fff;
    border-radius: 12rpx;
}

.product-image {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
    margin-right: 20rpx;
}

.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.product-name {
    font-size: 28rpx;
    color: #333;
    line-height: 1.4;
}

.product-price {
    font-size: 32rpx;
    color: #ff6b6b;
    font-weight: 500;
}

.empty-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100rpx 0;
}

.empty-icon {
    width: 200rpx;
    height: 200rpx;
    margin-bottom: 20rpx;
    opacity: 0.5;
}

.product-category {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 10rpx;
    padding: 4rpx 12rpx;
    background-color: #f2f2f2;
    border-radius: 4rpx;
    display: inline-block;
    width: max-content;
}

.product-desc {
    font-size: 24rpx;
    color: #999;
    margin-bottom: 10rpx;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style> 