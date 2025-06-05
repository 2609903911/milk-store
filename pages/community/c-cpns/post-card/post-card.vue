<template>
  <view
    class="post-card"
    :class="[`size-${size}`]"
    :style="cardStyle"
    @click="handlePostClick"
  >
    <!-- 帖子图片 -->
    <image class="post-image" :src="postImage" mode="aspectFill"></image>

    <!-- 帖子内容 -->
    <view class="post-content">
      <!-- 帖子标题 -->
      <text class="post-title" :style="titleStyle">{{ title }}</text>

      <!-- 用户信息和点赞 -->
      <view class="post-info">
        <!-- 左侧：用户头像和昵称 -->
        <view class="user-info">
          <image class="user-avatar" :src="avatar" mode="aspectFill"></image>
          <text class="user-nickname">{{ nickname }}</text>
        </view>

        <!-- 右侧：点赞数 -->
        <view class="like-count">
          <image
            class="like-icon"
            src="../../../../static/fonts/like.svg"
          ></image>
          <text class="like-number">{{ likeCount }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "PostCard",
  props: {
    // 帖子数据
    post: {
      type: Object,
      required: true,
    },
    // 卡片尺寸：small, medium, large
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["small", "medium", "large"].includes(value),
    },
    // 边框圆角大小
    borderRadius: {
      type: [Number, String],
      default: 12,
    },
    // 底部外边距
    marginBottom: {
      type: [Number, String],
      default: 20,
    },
    // 标题颜色
    titleColor: {
      type: String,
      default: "#333",
    },
  },
  computed: {
    // 计算属性：卡片样式
    cardStyle() {
      return {
        "border-radius": `${this.borderRadius}rpx`,
        "margin-bottom": `${this.marginBottom}rpx`,
      };
    },

    // 计算属性：标题样式
    titleStyle() {
      return {
        color: this.titleColor,
      };
    },

    // 计算属性：帖子图片
    postImage() {
      // 如果有图片数组，取第一张图片
      if (this.post.images && this.post.images.length > 0) {
        return this.post.images[0] || "";
      }
      // 如果没有图片，但有产品，使用产品图片
      else if (this.post.product && this.post.product.imageUrl) {
        return this.post.product.imageUrl || "";
      }
      // 默认图片
      return "../../../../static/images/default-post.png";
    },

    // 计算属性：帖子标题
    title() {
      return this.post.title || "";
    },

    // 计算属性：用户头像
    avatar() {
      if (this.post.user && this.post.user.avatar) {
        return this.post.user.avatar || "";
      }
      return "../../../../static/images/avatar.png";
    },

    // 计算属性：用户昵称
    nickname() {
      if (this.post.user && this.post.user.nickname) {
        return this.post.user.nickname || "";
      }
      return "匿名用户";
    },

    // 计算属性：点赞数
    likeCount() {
      return this.post.likesCount || 0;
    },
  },
  methods: {
    // 处理帖子点击
    handlePostClick() {
      this.$emit("post-click", this.post.postId);
    },
  },
};
</script>

<style>
.post-card {
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 20rpx;
  border-radius: 12rpx;
}

.post-image {
  width: 100%;
  height: 400rpx; /* 设置默认高度 */
  max-height: 500rpx; /* 设置最大高度 */
  object-fit: cover; /* 保持比例裁剪 */
  display: block;
}

/* 各种尺寸类设置不同的默认高度 */
.size-small .post-image {
  height: 280rpx;
}

.size-medium .post-image {
  height: 380rpx;
}

.size-large .post-image {
  height: 480rpx;
}

.post-content {
  padding: 20rpx;
}

.post-title {
  font-size: 28rpx;
  font-weight: bold;
  line-height: 1.4;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap; /* 允许在小屏幕上换行 */
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0; /* 防止内容溢出 */
}

.user-avatar {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  margin-right: 12rpx;
  flex-shrink: 0; /* 防止头像被挤压 */
}

.user-nickname {
  font-size: 24rpx;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.like-count {
  display: flex;
  align-items: center;
  margin-left: 10rpx;
  flex-shrink: 0; /* 防止点赞部分被挤压 */
}

.like-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 8rpx;
}

.like-number {
  font-size: 24rpx;
  color: #666;
}
</style>
