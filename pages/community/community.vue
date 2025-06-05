<template>
  <view class="community-container">
    <!-- 固定顶部标题栏 -->
    <view class="community-header">
      <!-- 居中标题 -->
      <text class="community-title">社区广场</text>
      <!-- 右侧添加按钮 -->
      <view class="add-post-btn" @click="onAddPost">
        <image
          class="add-icon"
          src="/static/images/add.png"
          mode="aspectFit"
        ></image>
      </view>
      <!-- 左侧我的页面按钮 -->
      <view class="my-profile-btn" @click="onMyProfile">
        <image
          class="profile-icon"
          src="/static/images/user-post.png"
          mode="aspectFit"
        ></image>
      </view>
    </view>

    <!-- 帖子内容区域，可滚动 -->
    <scroll-view
      class="posts-content"
      scroll-y
      @scrolltolower="loadMorePosts"
      @refresherrefresh="onRefresh"
      refresher-enabled
      :refresher-triggered="isRefreshing"
    >
      <!-- 刷新提示 -->
      <view class="refresh-tip" v-if="isRefreshing">
        <text>刷新中...</text>
      </view>

      <view class="posts-grid">
        <!-- 左列帖子 -->
        <view class="posts-column left-column">
          <post-card
            v-for="post in leftPosts"
            :key="post.postId"
            :post="post"
            :size="'medium'"
            :border-radius="12"
            :title-color="'#333'"
            @post-click="onPostClick"
          />
        </view>

        <!-- 右列帖子 -->
        <view class="posts-column right-column">
          <post-card
            v-for="post in rightPosts"
            :key="post.postId"
            :post="post"
            :size="'medium'"
            :border-radius="12"
            :title-color="'#333'"
            @post-click="onPostClick"
          />
        </view>
      </view>

      <!-- 加载状态 -->
      <view v-if="loading" class="loading-container">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 没有更多数据提示 -->
      <view v-if="!loading && posts.length === 0" class="no-data">
        <text>暂无帖子数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<script>
import PostCard from "./c-cpns/post-card/post-card.vue";
import { fetchPosts } from "../../utils/api/postApi";

export default {
  components: {
    PostCard,
  },
  data() {
    return {
      // 帖子列表数据
      posts: [],
      // 加载状态
      loading: false,
      // 是否已经初始化过
      isInitialized: false,
      // 当前页码
      currentPage: 1,
      // 每页数据量
      pageSize: 20,
      // 是否还有更多数据
      hasMore: true,
      // 是否正在刷新
      isRefreshing: false,
    };
  },
  computed: {
    // 左列帖子
    leftPosts() {
      return this.posts.filter((_, index) => index % 2 === 0);
    },
    // 右列帖子
    rightPosts() {
      return this.posts.filter((_, index) => index % 2 === 1);
    },
  },
  onLoad() {
    // 首次加载时获取帖子列表数据
    this.getPostList();
    this.isInitialized = true;
  },
  onShow() {
    // 如果不是首次加载，每次显示页面时刷新数据
    if (this.isInitialized) {
      this.refreshPostList();
    }
  },
  // 启用页面下拉刷新
  onPullDownRefresh() {
    this.refreshPostList();
  },
  methods: {
    // 刷新帖子列表
    refreshPostList() {
      this.currentPage = 1;
      this.hasMore = true;
      this.getPostList(true);
    },

    // 下拉刷新处理
    onRefresh() {
      this.isRefreshing = true;
      this.refreshPostList();
    },

    // 加载更多帖子
    loadMorePosts() {
      if (!this.loading && this.hasMore) {
        this.currentPage++;
        this.getPostList(false);
      }
    },

    // 获取帖子列表数据
    async getPostList(isRefresh = false) {
      if (this.loading) return;

      this.loading = true;
      try {
        const response = await fetchPosts({
          page: this.currentPage,
          size: this.pageSize,
          sortBy: "createdAt",
        });

        if (response && response.data && response.data.posts) {
          const newPosts = response.data.posts;

          // 如果是刷新，则替换全部数据
          if (isRefresh) {
            this.posts = newPosts;
          } else {
            // 否则追加数据
            this.posts = [...this.posts, ...newPosts];
          }

          // 判断是否还有更多数据
          if (newPosts.length < this.pageSize) {
            this.hasMore = false;
          }
        } else {
          if (this.currentPage === 1) {
            this.posts = [];
          }
          this.hasMore = false;
        }
      } catch (error) {
        uni.showToast({
          title: "获取帖子数据失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
        this.isRefreshing = false;
        // 停止下拉刷新动画
        uni.stopPullDownRefresh();
      }
    },

    // 处理帖子点击 - 跳转到帖子详情页
    onPostClick(postId) {
      // 跳转到帖子详情页
      uni.navigateTo({
        url: `../post-detail/post-detail?postId=${postId}`,
      });
    },

    // 添加新帖子
    onAddPost() {
      uni.navigateTo({
        url: "../post-create/post-create",
      });
    },

    // 处理我的页面点击
    onMyProfile() {
      // 获取当前用户信息
      const userInfo = uni.getStorageSync("userInfo");

      if (userInfo && userInfo.userId) {
        // 跳转到用户主页
        uni.navigateTo({
          url: `../post-profile/post-profile?userId=${userInfo.userId}`,
        });
      } else {
        // 如果没有登录，跳转到登录页面
        uni.navigateTo({
          url: "../login/login",
        });
      }
    },
  },
};
</script>

<style>
.community-container {
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  min-height: 100vh;
  position: relative;
}

.community-header {
  padding: 110rpx 30rpx 30rpx 30rpx;
  background-color: #fff;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.community-title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin: 0 30rpx;
}

.my-profile-btn,
.add-post-btn {
  width: 60rpx;
  height: 60rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 60rpx;
}

.profile-icon,
.add-icon {
  width: 40rpx;
  height: 40rpx;
}

.posts-content {
  flex: 1;
  padding: 20rpx;
  padding-top: 16rpx;
  height: calc(100vh - 180rpx); /* 减去头部高度 */
}

.refresh-tip {
  text-align: center;
  padding: 10rpx 0;
  font-size: 24rpx;
  color: #999;
}

.posts-grid {
  display: flex;
  width: 94%;
  justify-content: space-between;
}

.posts-column {
  width: 48.5%; /* 稍微缩小列宽，增加间距 */
}

.left-column {
  margin-right: 8rpx;
}

.right-column {
  margin-left: 8rpx;
}

.loading-container {
  padding: 30rpx 0;
  text-align: center;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.no-data {
  padding: 100rpx 0;
  text-align: center;
  color: #999;
  font-size: 28rpx;
}
</style>
