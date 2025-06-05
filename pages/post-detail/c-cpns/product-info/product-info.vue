<template>
  <view class="product-info" v-if="product">
    <view class="product-content" @click="goToProductDetail">
      <image
        class="product-image"
        :src="product.imageUrl"
        mode="aspectFill"
      ></image>
      <view class="product-details">
        <text class="product-name">{{ product.name }}</text>
        <text class="product-price">¥{{ product.price }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "ProductInfo",
  props: {
    // 商品信息
    product: {
      type: Object,
      default: null,
    },
  },
  methods: {
    // 跳转到商品详情页
    goToProductDetail() {
      if (!this.product || !this.product.productId) return;

      uni.navigateTo({
        url: `/pages/order/order?productId=${this.product.productId}`,
      });
    },
  },
};
</script>

<style>
.product-info {
  width: 100%;
  background-color: #fff;
  border-radius: 8rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 6rpx rgba(0, 0, 0, 0.05);
}

.product-header {
  padding: 10rpx 12rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.product-label {
  font-size: 20rpx;
  color: #999;
}

.product-content {
  display: flex;
  padding: 12rpx;
  align-items: center;
}

.product-image {
  width: 80rpx;
  height: 80rpx;
  border-radius: 6rpx;
  margin-right: 12rpx;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-size: 22rpx;
  color: #333;
  margin-bottom: 6rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-price {
  font-size: 22rpx;
  color: #ff4757;
  font-weight: bold;
}
</style>
