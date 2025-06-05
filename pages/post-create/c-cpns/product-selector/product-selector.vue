<template>
  <view class="product-selector-container">
    <view class="selector-header">
      <text class="selector-title">关联产品</text>
      <text class="selector-tip">选择与帖子相关的产品</text>
    </view>

    <!-- 已选产品展示 -->
    <view class="selected-product" v-if="selectedProduct">
      <image
        class="product-image"
        :src="selectedProduct.imageUrl || '/static/images/hot01.png'"
        mode="aspectFill"
      ></image>
      <view class="product-info">
        <text class="product-name">{{ selectedProduct.name }}</text>
        <text class="product-price">¥{{ selectedProduct.price }}</text>
      </view>
      <view class="remove-btn" @click="removeProduct">×</view>
    </view>

    <!-- 选择产品按钮 -->
    <view
      class="select-btn"
      @click="openProductSelector"
      v-if="!selectedProduct"
    >
      <text class="select-text">选择产品</text>
      <uni-icons type="arrowright" size="20" color="#999"></uni-icons>
    </view>

    <!-- 产品选择弹窗 -->
    <uni-popup ref="productPopup" type="bottom">
      <view class="popup-content">
        <view class="popup-header">
          <text class="popup-title">选择产品</text>
          <text class="popup-close" @click="closePopup">×</text>
        </view>

        <!-- 搜索框 -->
        <view class="search-box">
          <view class="search-icon">&#128269;</view>
          <input
            class="search-input"
            type="text"
            v-model="searchKeyword"
            placeholder="搜索产品名称"
            @input="searchProducts"
          />
          <text v-if="searchKeyword" class="clear-btn" @tap="clearSearch"
            >×</text
          >
        </view>

        <!-- 加载状态 -->
        <view class="loading-container" v-if="loading">
          <view class="loading-spinner"></view>
          <text class="loading-text">搜索中...</text>
        </view>

        <!-- 产品列表 -->
        <scroll-view class="product-list" scroll-y v-else>
          <view
            class="product-item"
            v-for="product in productList"
            :key="product.id"
            @click="selectProduct(product)"
          >
            <image
              class="item-image"
              :src="product.imageUrl || '/static/images/hot01.png'"
              mode="aspectFill"
            ></image>
            <view class="item-info">
              <text class="item-name">
                <!-- 使用条件渲染实现高亮 -->
                <block v-if="searchKeyword && product.name">
                  <block
                    v-for="(part, idx) in getHighlightParts(
                      product.name,
                      searchKeyword
                    )"
                    :key="idx"
                  >
                    <text :class="{ 'highlight-text': part.highlight }">{{
                      part.text
                    }}</text>
                  </block>
                </block>
                <text v-else>{{ product.name }}</text>
              </text>
              <text class="item-price">¥{{ product.price }}</text>
            </view>
          </view>

          <view class="no-data" v-if="productList.length === 0">
            <text>{{ searchKeyword ? "未找到相关产品" : "暂无产品数据" }}</text>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import {
  fetchProducts,
  searchProductsByName,
  fetchProductById,
} from "../../../../utils/api/productApi";

export default {
  name: "ProductSelector",
  props: {
    initialProductId: {
      type: [Number, String],
      default: null,
    },
  },
  data() {
    return {
      productList: [],
      selectedProduct: null,
      searchKeyword: "",
      loading: false,
      allProducts: [],
      debounceTimer: null,
    };
  },
  created() {
    // 先获取产品列表
    this.getProducts();

    // 如果有初始产品ID，延迟加载产品信息，确保产品列表已加载
    if (this.initialProductId) {
      // 使用setTimeout确保产品列表有机会先加载
      setTimeout(() => {
        this.loadProductById(this.initialProductId);
      }, 500);
    }
  },
  methods: {
    // 获取产品列表
    async getProducts() {
      this.loading = true;
      try {
        const response = await fetchProducts();

        // 安全地处理响应数据
        if (response) {
          // 直接检查response是否是数组
          if (Array.isArray(response)) {
            this.productList = response;
            this.allProducts = [...response];
          }
          // 检查response.data是否是数组
          else if (response.data && Array.isArray(response.data)) {
            this.productList = response.data;
            this.allProducts = [...response.data];
          }
          // 如果response本身是对象且包含必要的产品字段
          else if (typeof response === "object" && response.id) {
            this.productList = [response];
            this.allProducts = [response];
          }
          // 其他情况，尝试安全地记录
          else {
            // 尝试安全地打印部分响应内容
            if (typeof response === "object") {
            }
          }
        } else {
        }
      } catch (error) {
        uni.showToast({
          title: "获取产品列表失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
      }
    },

    // 清除搜索
    clearSearch() {
      this.searchKeyword = "";
      this.productList = [...this.allProducts];
    },

    // 高亮关键词
    highlightKeyword(text, keyword) {
      if (!text || !keyword) return text;

      try {
        const keywordLower = keyword.toLowerCase().trim();
        if (!keywordLower) return text;

        // 在小程序中不支持HTML标签渲染，所以我们需要分割文本
        // 返回原始文本，高亮效果通过外层的CSS实现
        return text;
      } catch (error) {
        return text;
      }
    },

    // 搜索产品
    async searchProducts() {
      // 清除之前的定时器
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }

      // 设置新的定时器，300ms后执行搜索
      this.debounceTimer = setTimeout(async () => {
        // 如果搜索关键词为空，显示所有产品
        if (!this.searchKeyword.trim()) {
          this.productList = [...this.allProducts];
          return;
        }

        this.loading = true;

        // 先在本地进行搜索过滤
        const keyword = this.searchKeyword.toLowerCase().trim();
        const localResults = this.allProducts.filter(
          (product) =>
            product.name && product.name.toLowerCase().includes(keyword)
        );

        // 如果本地有结果，直接显示
        if (localResults.length > 0) {
          this.productList = localResults;
          this.loading = false;
          return;
        }

        // 如果本地没有结果，调用API搜索
        try {
          const response = await searchProductsByName(this.searchKeyword);
          if (response && Array.isArray(response)) {
            this.productList = response;
          } else if (
            response &&
            response.data &&
            Array.isArray(response.data)
          ) {
            this.productList = response.data;
          } else {
            this.productList = [];
          }
        } catch (error) {
          uni.showToast({
            title: "搜索产品失败",
            icon: "none",
          });
          this.productList = [];
        } finally {
          this.loading = false;
        }
      }, 300); // 300ms的防抖延迟
    },

    // 打开产品选择弹窗
    openProductSelector() {
      this.$refs.productPopup.open();
    },

    // 关闭弹窗
    closePopup() {
      this.$refs.productPopup.close();
    },

    // 选择产品
    selectProduct(product) {
      if (!product || !product.id) {
        return;
      }

      try {
        // 创建一个新对象，避免可能的循环引用
        this.selectedProduct = {
          id: product.id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          description: product.description,
        };

        // 只发送产品ID给父组件
        this.$emit("update:productId", product.id);

        this.closePopup();
      } catch (error) {}
    },

    // 移除已选产品
    removeProduct() {
      this.selectedProduct = null;
      this.$emit("update:productId", null);
    },

    // 根据产品ID加载产品信息
    async loadProductById(productId) {
      if (!productId) return;

      this.loading = true;

      try {
        // 先从当前列表中查找
        let product = null;

        // 安全地查找产品
        try {
          product = this.productList.find(
            (p) => String(p.id) === String(productId)
          );
        } catch (findError) {}

        if (!product) {
          // 使用直接API调用获取单个产品
          try {
            const response = await fetchProductById(productId);

            if (response) {
              // 如果响应直接是产品对象
              if (response.id) {
                product = response;
              }
              // 如果响应包含data属性
              else if (response.data && response.data.id) {
                product = response.data;
              } else {
              }
            }
          } catch (apiError) {
            // 如果API调用失败，尝试获取所有产品
            try {
              await this.getProducts();

              // 再次尝试查找产品
              if (this.productList && this.productList.length > 0) {
                product = this.productList.find(
                  (p) => String(p.id) === String(productId)
                );
              }
            } catch (listError) {}
          }
        }

        // 设置选中的产品
        if (product) {
          // 创建一个新对象，避免可能的循环引用
          this.selectedProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            description: product.description,
          };
        } else {
        }
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },

    // 供父组件调用，设置产品ID
    setProductId(productId) {
      if (productId) {
        this.loadProductById(productId);
      } else {
        this.selectedProduct = null;
      }
    },

    // 获取高亮部分
    getHighlightParts(text, keyword) {
      if (!text || !keyword || !keyword.trim()) {
        return [{ text: text, highlight: false }];
      }

      try {
        const keywordLower = keyword.toLowerCase().trim();
        const textLower = text.toLowerCase();
        const parts = [];
        let lastIndex = 0;
        let index = textLower.indexOf(keywordLower);

        while (index !== -1) {
          // 添加前面不匹配的部分
          if (index > lastIndex) {
            parts.push({
              text: text.substring(lastIndex, index),
              highlight: false,
            });
          }

          // 添加匹配的部分
          parts.push({
            text: text.substring(index, index + keywordLower.length),
            highlight: true,
          });

          // 更新lastIndex
          lastIndex = index + keywordLower.length;

          // 查找下一个匹配位置
          index = textLower.indexOf(keywordLower, lastIndex);
        }

        // 添加最后一个不匹配的部分
        if (lastIndex < text.length) {
          parts.push({
            text: text.substring(lastIndex),
            highlight: false,
          });
        }

        return parts;
      } catch (error) {
        return [{ text: text, highlight: false }];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.product-selector-container {
  padding: 20rpx;
  background-color: #ffffff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;

  .selector-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;

    .selector-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
    }

    .selector-tip {
      font-size: 24rpx;
      color: #999;
    }
  }

  .selected-product {
    display: flex;
    align-items: center;
    padding: 20rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;
    position: relative;

    .product-image {
      width: 120rpx;
      height: 120rpx;
      border-radius: 8rpx;
      margin-right: 20rpx;
    }

    .product-info {
      flex: 1;

      .product-name {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 10rpx;
        display: block;
      }

      .product-price {
        font-size: 32rpx;
        color: #ff6b6b;
        font-weight: bold;
      }
    }

    .remove-btn {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      width: 40rpx;
      height: 40rpx;
      line-height: 34rpx;
      text-align: center;
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      border-radius: 50%;
      font-size: 32rpx;
    }
  }

  .select-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30rpx 20rpx;
    background-color: #f8f8f8;
    border-radius: 8rpx;

    .select-text {
      font-size: 28rpx;
      color: #666;
    }

    .select-icon {
      font-size: 28rpx;
      color: #999;
    }
  }

  .popup-content {
    background-color: #fff;
    border-top-left-radius: 20rpx;
    border-top-right-radius: 20rpx;
    padding-bottom: 50rpx;

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 30rpx;
      border-bottom: 1px solid #eee;

      .popup-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
      }

      .popup-close {
        font-size: 40rpx;
        color: #999;
      }
    }

    .search-box {
      padding: 20rpx;
      position: relative;

      .search-icon {
        position: absolute;
        left: 40rpx;
        top: 35rpx;
        font-size: 28rpx;
        color: #999;
        z-index: 1;
      }

      .search-input {
        width: 100%;
        height: 70rpx;
        background-color: #f5f5f5;
        border-radius: 35rpx;
        padding: 0 60rpx 0 70rpx;
        font-size: 28rpx;
      }

      .clear-btn {
        position: absolute;
        right: 40rpx;
        top: 35rpx;
        width: 40rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        font-size: 32rpx;
        color: #999;
        z-index: 1;
      }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 100rpx 0;

      .loading-spinner {
        width: 60rpx;
        height: 60rpx;
        border: 4rpx solid #f3f3f3;
        border-top: 4rpx solid #0066cc;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      .loading-text {
        margin-top: 20rpx;
        font-size: 28rpx;
        color: #999;
      }
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .product-list {
      max-height: 700rpx;

      .product-item {
        display: flex;
        align-items: center;
        padding: 20rpx;
        border-bottom: 1px solid #f5f5f5;
        transition: background-color 0.2s;

        &:active {
          background-color: #f9f9f9;
        }

        .item-image {
          width: 100rpx;
          height: 100rpx;
          border-radius: 8rpx;
          margin-right: 20rpx;
        }

        .item-info {
          flex: 1;

          .item-name {
            font-size: 28rpx;
            color: #333;
            margin-bottom: 10rpx;
            display: block;
          }

          .highlight-text {
            color: #0066cc;
            font-weight: bold;
          }

          .item-price {
            font-size: 28rpx;
            color: #ff6b6b;
            font-weight: bold;
          }
        }
      }

      .no-data {
        padding: 100rpx 0;
        text-align: center;
        color: #999;
        font-size: 28rpx;
      }
    }
  }
}
</style>
