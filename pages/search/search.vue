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
      <text class="search-btn" @tap="handleSearch">搜索</text>
    </view>

    <!-- 搜索历史 -->
    <view
      class="search-history"
      v-if="!hasSearched && searchHistory.length > 0"
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
    <view class="search-result" v-if="hasSearched">
      <view
        v-if="searchResults.length === 0 && !isLoading"
        class="empty-result"
      >
        <image
          src="/static/images/empty-search.png"
          mode="aspectFit"
          class="empty-icon"
        ></image>
        <text>没有找到相关商品</text>
      </view>
      <view v-if="isLoading" class="loading">
        <text class="loading-text">正在搜索...</text>
      </view>
      <view class="result-list" v-if="searchResults.length > 0">
        <view
          class="result-item"
          v-for="(item, index) in searchResults"
          :key="index"
          @tap="viewProductDetail(item)"
        >
          <image
            :src="item.imageUrl || '/static/images/default-product.png'"
            mode="aspectFill"
            class="product-image"
          ></image>
          <view class="product-info">
            <text class="product-name">{{ item.name }}</text>
            <text
              class="product-category"
              v-if="item.category && item.category.name"
            >
              {{ item.category.name }}
            </text>
            <text class="product-desc">{{ item.description }}</text>
            <text class="product-price">¥{{ item.price }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 商品详情弹窗 -->
    <shop-detail
      v-if="productDetailVisible"
      :visible="productDetailVisible"
      :product="selectedProduct"
      @update:visible="updateDetailVisible"
      @add-to-cart="handleAddToCart"
    />
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { searchProductsByName } from "../../utils/api/productApi";
import ShopDetail from "../components/shop-detail.vue";

// 搜索文本
const searchText = ref("");

// 搜索历史
const searchHistory = ref([]);

// 搜索结果
const searchResults = ref([]);

// 加载状态
const isLoading = ref(false);

// 是否已搜索
const hasSearched = ref(false);

// 商品详情弹窗
const productDetailVisible = ref(false);
const selectedProduct = ref({});

// 返回上一页
const goBack = () => {
  uni.navigateBack();
};

// 处理搜索
const handleSearch = async () => {
  if (!searchText.value.trim()) return;

  // 添加到搜索历史
  if (!searchHistory.value.includes(searchText.value)) {
    searchHistory.value.unshift(searchText.value);
    // 限制历史记录数量
    if (searchHistory.value.length > 10) {
      searchHistory.value.pop();
    }
    // 保存到本地存储
    uni.setStorageSync("searchHistory", searchHistory.value);
  }

  try {
    // 设置加载状态和搜索状态
    isLoading.value = true;
    hasSearched.value = true;
    searchResults.value = [];

    // 使用API搜索产品
    const results = await searchProductsByName(searchText.value);
    searchResults.value = results;
  } catch (error) {
    uni.showToast({
      title: "搜索失败，请重试",
      icon: "none",
    });
  } finally {
    isLoading.value = false;
  }
};

// 清空搜索历史
const clearHistory = () => {
  uni.showModal({
    title: "提示",
    content: "确定要清空搜索历史吗？",
    success: (res) => {
      if (res.confirm) {
        searchHistory.value = [];
        uni.removeStorageSync("searchHistory");
      }
    },
  });
};

// 点击历史记录
const handleHistoryClick = (keyword) => {
  searchText.value = keyword;
  handleSearch();
};

// 查看产品详情
const viewProductDetail = (product) => {
  // 转换产品数据格式以匹配shop-detail组件的需求
  selectedProduct.value = {
    id: product.id,
    name: product.name,
    desc: product.description || "",
    price: product.price,
    image: product.imageUrl || "/static/images/default-product.png",
  };
  // 显示弹窗
  productDetailVisible.value = true;
};

// 更新弹窗可见性
const updateDetailVisible = (visible) => {
  productDetailVisible.value = visible;
};

// 处理添加到购物车
const handleAddToCart = (orderItem) => {
  // 如果orderItem为null或未定义，可能是旧版本组件发送的事件
  if (!orderItem) {
    // 创建标准化的商品对象
    const standardizedItem = {
      id: selectedProduct.value.id,
      name: selectedProduct.value.name || "",
      price: Number(selectedProduct.value.price) || 0,
      image: selectedProduct.value.image || "/static/images/hot01.png",
      desc: selectedProduct.value.desc || "",

      // 添加规格信息（使用默认值）
      cupType: "中杯",
      sugar: "全糖",
      temperature: "正常冰",
      toppings: [],

      // 设置数量和计算总价
      quantity: 1,
    };

    // 计算总价
    standardizedItem.totalPrice =
      standardizedItem.price * standardizedItem.quantity;

    // 添加product对象，与shop-detail页面保持一致
    standardizedItem.product = {
      id: standardizedItem.id,
      name: standardizedItem.name,
      desc: standardizedItem.desc,
      price: standardizedItem.price,
      image: standardizedItem.image,
    };

    // 获取当前购物车
    const cartItems = uni.getStorageSync("cartItems") || [];

    // 查找购物车中是否已有相同商品
    const existingItemIndex = cartItems.findIndex((item) => {
      if (!item) return false;
      return (
        item.id === standardizedItem.id &&
        item.cupType === standardizedItem.cupType &&
        item.sugar === standardizedItem.sugar &&
        item.temperature === standardizedItem.temperature
      );
    });

    if (existingItemIndex !== -1) {
      // 如果存在相同商品，增加数量
      cartItems[existingItemIndex].quantity += standardizedItem.quantity;
      // 更新总价
      cartItems[existingItemIndex].totalPrice =
        cartItems[existingItemIndex].price *
        cartItems[existingItemIndex].quantity;
    } else {
      // 添加新商品
      cartItems.push(standardizedItem);
    }

    // 保存回本地存储
    uni.setStorageSync("cartItems", cartItems);

    // 提示用户
    uni.showToast({
      title: "已加入购物车",
      icon: "success",
    });

    return;
  }

  // 处理来自shop-detail组件的orderItem对象

  // 购物车项已经在shop-detail组件中处理，不需要再次处理
  // 但仍然显示成功提示
  uni.showToast({
    title: "已加入购物车",
    icon: "success",
  });
};

// 页面加载时获取搜索历史
onMounted(() => {
  const history = uni.getStorageSync("searchHistory");
  if (history) {
    searchHistory.value = history;
  }
});
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

.search-btn {
  font-size: 28rpx;
  color: #3a86ff;
  font-weight: 500;
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

.loading {
  padding: 40rpx 0;
  text-align: center;
}

.loading-text {
  font-size: 28rpx;
  color: #666;
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
