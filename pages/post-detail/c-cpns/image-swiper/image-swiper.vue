<template>
  <view class="image-swiper-container">
    <!-- 如果有图片则显示轮播图 -->
    <swiper
      v-if="processedImages.length > 0"
      class="swiper"
      :indicator-dots="true"
      :autoplay="false"
      :circular="true"
      :indicator-color="'rgba(255, 255, 255, 0.6)'"
      :indicator-active-color="'#ffffff'"
    >
      <swiper-item
        v-for="(image, index) in processedImages"
        :key="index"
        class="swiper-item"
      >
        <image
          :src="image"
          mode="aspectFill"
          class="swiper-image"
          @click="previewImage(index)"
        ></image>
      </swiper-item>
    </swiper>

    <!-- 点赞按钮 -->
    <view class="like-container" @click.stop="toggleLike">
      <image
        :src="
          isLiked ? '/static/fonts/like-filled.svg' : '/static/fonts/like.svg'
        "
        class="like-icon"
      ></image>
      <text class="like-count">{{ likeCount }}</text>
    </view>
  </view>
</template>

<script>
import { likeOrUnlike } from "../../../../utils/api/postApi";

export default {
  name: "ImageSwiper",
  props: {
    // 图片数组
    images: {
      type: [Array, String],
      default: () => [],
    },
    // 帖子ID
    postId: {
      type: String,
      default: "",
    },
    // 点赞数量
    likesCount: {
      type: Number,
      default: 0,
    },
    // 是否已点赞
    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localIsLiked: false,
      localLikeCount: 0,
    };
  },
  watch: {
    // 监听images属性变化
    images: {
      immediate: true,
      handler(newImages) {},
    },
    // 监听外部传入的点赞状态和数量
    isLiked: {
      immediate: true,
      handler(val) {
        this.localIsLiked = val;
      },
    },
    likesCount: {
      immediate: true,
      handler(val) {
        this.localLikeCount = val;
      },
    },
  },
  computed: {
    // 处理图片数据，确保是数组格式
    processedImages() {
      if (!this.images) return [];

      // 如果是字符串，尝试解析为JSON
      if (typeof this.images === "string") {
        try {
          const parsedImages = JSON.parse(this.images);
          if (Array.isArray(parsedImages)) {
            return parsedImages;
          } else if (typeof parsedImages === "string") {
            // 如果解析后是单个字符串，返回包含该字符串的数组
            return [parsedImages];
          }
          return [];
        } catch (e) {
          // 如果解析失败，可能是单个图片URL
          return [this.images];
        }
      }

      // 如果已经是数组，直接返回
      if (Array.isArray(this.images)) {
        return this.images;
      }

      // 其他情况返回空数组
      return [];
    },
    // 计算属性：点赞数量
    likeCount() {
      return this.localLikeCount;
    },
  },
  methods: {
    // 预览图片
    previewImage(index) {
      if (this.processedImages.length === 0) return;

      uni.previewImage({
        current: index,
        urls: this.processedImages,
        indicator: "number",
        loop: true,
      });
    },
    // 点赞/取消点赞
    async toggleLike() {
      if (!this.postId) {
        uni.showToast({
          title: "点赞失败",
          icon: "none",
        });
        return;
      }

      try {
        // 获取用户ID
        const userInfo = uni.getStorageSync("userInfo");
        const userId = userInfo?.userId || "";
        if (!userId) {
          uni.showToast({
            title: "请先登录",
            icon: "none",
          });
          return;
        }

        // 乐观更新UI
        const newIsLiked = !this.localIsLiked;
        const newLikeCount = newIsLiked
          ? this.localLikeCount + 1
          : Math.max(0, this.localLikeCount - 1);

        this.localIsLiked = newIsLiked;
        this.localLikeCount = newLikeCount;
        // 调用API
        const response = await likeOrUnlike(this.postId, 1, userId);

        // 发出事件通知父组件更新点赞状态

        this.$emit("like-changed", {
          isLiked: newIsLiked,
          count: newLikeCount,
        });
      } catch (error) {
        // 恢复原状态
        const previousState = this.localIsLiked;
        this.localIsLiked = !this.localIsLiked;
        this.localLikeCount = this.localIsLiked
          ? this.localLikeCount + 1
          : Math.max(0, this.localLikeCount - 1);

        uni.showToast({
          title: "操作失败，请重试",
          icon: "none",
        });
      }
    },
  },
};
</script>

<style>
.image-swiper-container {
  width: 100%;
  height: 500rpx;
  background-color: #f0f0f0;
  border-radius: 12rpx;
  overflow: hidden;
  position: relative;
}

.swiper {
  width: 100%;
  height: 100%;
}

.swiper-item {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-image {
  width: 100%;
}

.no-images {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.default-image {
  width: 60%;
  height: 60%;
  opacity: 0.5;
}

/* 点赞按钮样式 */
.like-container {
  position: absolute;
  bottom: 20rpx;
  right: 20rpx;
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 8rpx 16rpx;
  border-radius: 30rpx;
  z-index: 10;
}

.like-icon {
  width: 40rpx;
  height: 40rpx;
  margin-right: 8rpx;
}

.like-count {
  color: #ffffff;
  font-size: 24rpx;
}
</style>
