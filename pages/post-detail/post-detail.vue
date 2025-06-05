<template>
  <view class="post-detail-container">
    <!-- 加载状态 -->
    <view class="loading" v-if="loading">加载中...</view>

    <!-- 帖子详情内容 -->
    <view v-if="!loading && postDetail" class="post-content">
      <!-- 图片轮播 -->
      <image-swiper
        :images="postImages"
        :post-id="postId"
        :likes-count="postDetail.likesCount || 0"
        :is-liked="isPostLiked"
        @like-changed="handleLikeChanged"
      ></image-swiper>

      <!-- 帖子信息区域：左侧帖子信息，右侧商品信息 -->
      <view class="info-container">
        <!-- 左侧：标题和用户信息 -->
        <view class="post-info">
          <!-- 帖子标题 -->
          <view class="post-title">
            <text>{{ postDetail.title }}</text>
          </view>

          <!-- 用户信息 -->
          <view class="user-info" @click="navigateToUserProfile">
            <image
              class="user-avatar"
              :src="postDetail.user?.avatar || '/static/images/avatar.png'"
              mode="aspectFill"
            ></image>
            <text class="user-nickname">{{
              postDetail.user?.nickname || "匿名用户"
            }}</text>
            <text class="post-time">{{
              formatTime(postDetail.createdAt)
            }}</text>
          </view>
        </view>

        <!-- 右侧：商品信息 -->
        <view
          class="product-container"
          v-if="postDetail.product"
          @click="openProductDetail(postDetail.product)"
        >
          <product-info :product="postDetail.product"></product-info>
        </view>
      </view>

      <!-- 帖子内容 -->
      <view class="post-text">
        <text>{{ postDetail.content }}</text>
      </view>
    </view>

    <!-- 评论区域 -->
    <comment-section
      v-if="!loading && postDetail"
      :postId="postId"
      :authorId="postDetail.user?.userId"
    ></comment-section>

    <!-- 帖子不存在 -->
    <view v-if="!loading && !postDetail" class="no-data">
      <text>帖子不存在或已被删除</text>
    </view>

    <!-- 商品详情弹窗 -->
    <shop-detail
      v-if="selectedProduct"
      :visible="showProductDetail"
      :product="selectedProduct"
      @update:visible="handleVisibilityChange"
      @add-to-cart="onAddToCart"
    ></shop-detail>
  </view>
</template>

<script>
import {
  fetchPostById,
  likeOrUnlike,
  checkUserLike,
} from "../../utils/api/postApi";
import ImageSwiper from "./c-cpns/image-swiper/image-swiper.vue";
import ProductInfo from "./c-cpns/product-info/product-info.vue";
import CommentSection from "./c-cpns/comment-section/comment-section.vue";
import ShopDetail from "../components/shop-detail.vue";

export default {
  components: {
    ImageSwiper,
    ProductInfo,
    CommentSection,
    ShopDetail,
  },
  data() {
    return {
      postId: "",
      postDetail: null,
      loading: false,
      showProductDetail: false,
      selectedProduct: null,
      isPostLiked: false, // 当前用户是否点赞
    };
  },
  computed: {
    // 处理帖子图片数据
    postImages() {
      if (!this.postDetail) return [];

      const { images } = this.postDetail;

      // 如果没有图片数据
      if (!images) return [];

      // 如果已经是数组
      if (Array.isArray(images)) {
        return images;
      }

      // 如果是字符串，尝试解析JSON
      if (typeof images === "string") {
        try {
          const parsedImages = JSON.parse(images);
          return Array.isArray(parsedImages) ? parsedImages : [parsedImages];
        } catch (e) {
          // 如果解析失败，可能是单个URL
          return [images];
        }
      }

      return [];
    },
  },
  onLoad(options) {
    // 获取传递的postId参数
    if (options && options.postId) {
      this.postId = options.postId;

      // 获取帖子详情数据
      this.getPostDetail();
    } else {
      uni.showToast({
        title: "帖子ID不存在",
        icon: "none",
      });
    }
  },

  // 页面显示时检查点赞状态，确保从其他页面返回时状态正确
  onShow() {
    if (this.postId) {
      this.checkUserLikeStatus();
    }
  },

  methods: {
    // 获取帖子详情
    async getPostDetail() {
      if (!this.postId) return;

      this.loading = true;
      try {
        const response = await fetchPostById(this.postId);

        // 根据API返回格式处理数据
        if (response && response.data) {
          this.postDetail = response.data;
        } else {
          uni.showToast({
            title: "帖子不存在或已删除",
            icon: "none",
          });
        }
      } catch (error) {
        uni.showToast({
          title: "获取帖子详情失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
      }
    },

    // 检查用户是否已点赞
    async checkUserLikeStatus() {
      try {
        const userInfo = uni.getStorageSync("userInfo");

        if (!userInfo || !userInfo.userId) {
          return;
        }

        // 使用API检查用户是否已点赞

        const result = await checkUserLike({
          userId: userInfo.userId,
          targetId: this.postId,
          targetType: 1, // 1表示帖子
        });

        if (result && result.data) {
          this.isPostLiked = result.data.liked === true;
        } else {
        }
      } catch (error) {}
    },

    // 处理点赞状态变化
    handleLikeChanged(data) {
      if (!this.postDetail) {
        return;
      }

      // 更新本地数据
      this.isPostLiked = data.isLiked;
      this.postDetail.likesCount = data.count;
    },

    // 跳转到用户个人资料页面
    navigateToUserProfile() {
      if (
        !this.postDetail ||
        !this.postDetail.user ||
        !this.postDetail.user.userId
      ) {
        uni.showToast({
          title: "用户信息不存在",
          icon: "none",
        });
        return;
      }

      uni.navigateTo({
        url: `/pages/post-profile/post-profile?userId=${this.postDetail.user.userId}`,
      });
    },

    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp) return "";

      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    },

    // 打开商品详情
    openProductDetail(product) {
      // 确保有商品数据
      if (!product || !product.id) {
        return;
      }

      // 创建一个默认的商品对象，确保所有必需的属性都存在
      const defaultProduct = {
        id: product.id,
        name: product.name || "商品名称",
        desc: product.desc || product.description || "商品描述",
        price: parseFloat(product.price) || 0,
        image: product.imageUrl || "/static/images/hot01.png",
      };

      // 设置商品数据
      this.selectedProduct = defaultProduct;

      // 延迟显示弹窗，确保数据已准备好
      setTimeout(() => {
        this.showProductDetail = true;
      }, 0);
    },

    onAddToCart(product) {
      // 实现添加到购物车逻辑
    },

    handleVisibilityChange(visible) {
      if (!visible) {
        this.selectedProduct = null;
      }
    },
  },
};
</script>

<style>
.post-detail-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading {
  text-align: center;
  padding: 40rpx 0;
  color: #999;
  font-size: 28rpx;
}

.post-content {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 20rpx;
}

/* 信息容器：左侧帖子信息，右侧商品信息 */
.info-container {
  display: flex;
  padding: 24rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

/* 左侧帖子信息 */
.post-info {
  flex: 1;
  margin-right: 24rpx;
  min-width: 0; /* 防止内容溢出 */
}

.post-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  line-height: 1.4;
  margin-bottom: 16rpx;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8rpx 0;
  border-radius: 8rpx;
  transition: background-color 0.2s;
}

.user-info:active {
  background-color: #f0f0f0;
}

.user-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  margin-right: 16rpx;
}

.user-nickname {
  font-size: 28rpx;
  color: #333;
  margin-right: 16rpx;
}

.post-time {
  font-size: 24rpx;
  color: #999;
}

/* 右侧商品信息 */
.product-container {
  width: 240rpx;
  flex-shrink: 0;
  cursor: pointer;
  transition: opacity 0.2s;
}

.product-container:hover {
  opacity: 0.8;
}

.product-container:active {
  opacity: 0.6;
}

.post-text {
  padding: 24rpx;
  font-size: 27rpx;
  color: #333;
  line-height: 1.6;
}

.no-data {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
  font-size: 28rpx;
}
</style>
