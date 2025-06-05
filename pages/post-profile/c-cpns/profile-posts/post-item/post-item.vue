<template>
  <view class="post-item" @click="onPostClick">
    <!-- 帖子图片 -->
    <image
      class="post-image"
      :src="coverImageUrl"
      :mode="imageMode"
      @error="handleImageError"
      @load="handleImageLoad"
    ></image>

    <!-- 帖子标题 -->
    <view class="post-title">{{ post.title }}</view>

    <!-- 帖子底部信息 -->
    <view class="post-info">
      <!-- 产品信息 -->
      <view v-if="post.product" class="post-product">
        <image class="product-icon" src="/static/images/cup.png"></image>
        <text>{{ post.product.name }}</text>
      </view>

      <view class="post-stats">
        <view class="post-likes" :class="{ 'is-liked': isLiked }">
          <!-- 使用SVG图标替换图片 -->
          <view class="svg-icon like-icon"></view>
          <text>{{ formatCount(likesCount) }}</text>
        </view>

        <view class="post-comments">
          <!-- 使用SVG图标替换图片 -->
          <view class="svg-icon comment-icon"></view>
          <text>{{ formatCount(commentsCount) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "PostItem",
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      imageLoaded: false,
      imageError: false,
    };
  },
  computed: {
    // 计算图片显示模式
    imageMode() {
      if (this.post.coverImageRatio) {
        const mode =
          this.post.coverImageRatio > 1.2 ? "widthFix" : "aspectFill";
        return mode;
      }
      return "aspectFill";
    },
    // 获取封面图片URL
    coverImageUrl() {
      if (this.post.images && this.post.images.length > 0) {
        return this.post.images[0];
      }
      if (this.post.product && this.post.product.imageUrl) {
        return this.post.product.imageUrl;
      }
      if (this.post.coverImage) {
        return this.post.coverImage;
      }
      return "/static/images/post-default.jpg";
    },
    likesCount() {
      return this.post.likesCount !== undefined
        ? this.post.likesCount
        : this.post.likes || 0;
    },
    commentsCount() {
      return this.post.commentsCount !== undefined
        ? this.post.commentsCount
        : this.post.comments || 0;
    },
    contentPreview() {
      if (this.post.content) {
        return this.post.content.length > 50
          ? this.post.content.substring(0, 50) + "..."
          : this.post.content;
      }
      return "";
    },
    isLiked() {
      return this.post.isLiked === true;
    },
    isPostDataComplete() {
      const result = this.checkPostData();
      return result;
    },
  },
  methods: {
    onPostClick() {
      this.$emit("post-click", this.post.postId);
    },
    handleImageError() {
      this.imageError = true;
    },
    handleImageLoad(e) {
      this.imageLoaded = true;
    },
    formatCount(count) {
      if (!count && count !== 0) {
        return "0";
      }
      if (count < 1000) {
        return count.toString();
      } else {
        return Math.floor(count / 1000) + "k";
      }
    },
    checkPostData() {
      const requiredFields = ["postId", "title"];
      const missingFields = requiredFields.filter((field) => !this.post[field]);
      if (missingFields.length > 0) {
        return false;
      }
      return true;
    },
    logPostStructure() {},
  },
  watch: {
    post: {
      handler(newPost) {
        this.logPostStructure();
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {},
};
</script>

<style>
.post-item {
  margin-bottom: 20rpx;
  border-radius: 12rpx;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.05);
}

.post-image {
  width: 100%;
  /* 默认宽高比为1:1 */
  height: 340rpx;
  background-color: #f0f0f0;
}

.post-title {
  font-size: 28rpx;
  line-height: 1.3;
  color: #333;
  padding: 16rpx 16rpx 8rpx;
  /* 最多显示两行，超出省略 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: bold;
}

.post-content {
  font-size: 24rpx;
  line-height: 1.3;
  color: #666;
  padding: 0 16rpx 8rpx;
  /* 最多显示两行，超出省略 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-info {
  display: flex;
  padding: 8rpx 16rpx 16rpx;
  font-size: 24rpx;
  color: #999;
  justify-content: space-between;
  align-items: center;
  border-top: 1rpx solid #f5f5f5;
}

.post-product {
  display: flex;
  align-items: center;
  font-size: 22rpx;
  color: #666;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 6rpx;
}

.post-stats {
  display: flex;
  align-items: center;
}

.post-likes,
.post-comments {
  display: flex;
  align-items: center;
  margin-left: 20rpx;
  color: #888;
  font-size: 22rpx;
  transition: all 0.2s ease;
}

.post-likes text,
.post-comments text {
  line-height: 1;
}

/* SVG图标通用样式 */
.svg-icon {
  width: 26rpx;
  height: 26rpx;
  margin-right: 8rpx;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0.8;
  transition: all 0.2s ease;
}

/* 点赞图标 */
.like-icon {
  background-image: url("/static/fonts/like.svg");
  filter: invert(70%) sepia(10%) saturate(300%) hue-rotate(175deg)
    brightness(90%) contrast(90%);
}

/* 评论图标 */
.comment-icon {
  background-image: url("/static/fonts/comments.svg");
  filter: invert(70%) sepia(10%) saturate(300%) hue-rotate(175deg)
    brightness(90%) contrast(90%);
}

/* 已点赞状态 */
.post-likes.is-liked {
  color: #ff6b81;
}

.post-likes.is-liked .like-icon {
  filter: invert(60%) sepia(75%) saturate(2000%) hue-rotate(325deg)
    brightness(100%) contrast(95%);
  opacity: 1;
}

.post-likes:active .like-icon,
.post-comments:active .comment-icon {
  transform: scale(1.2);
}
</style>
