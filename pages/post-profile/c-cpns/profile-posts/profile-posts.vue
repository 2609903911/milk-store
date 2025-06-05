<template>
  <view class="profile-posts">
    <block v-if="posts && posts.length > 0">
      <view class="posts-grid">
        <!-- 左列帖子 -->
        <view class="posts-column left-column">
          <post-item
            v-for="post in leftPosts"
            :key="post.postId"
            :post="post"
            @post-click="onPostClick"
          />
        </view>

        <!-- 右列帖子 -->
        <view class="posts-column right-column">
          <post-item
            v-for="post in rightPosts"
            :key="post.postId"
            :post="post"
            @post-click="onPostClick"
          />
        </view>
      </view>

      <!-- 加载更多 -->
      <view class="load-more" v-if="!isEnd">
        <text @click="loadMore">已经没有更多了</text>
      </view>
    </block>

    <!-- 加载状态 -->
    <view class="loading-state" v-if="loading">
      <text class="loading-text">正在加载...</text>
    </view>
  </view>
</template>

<script>
import PostItem from "./post-item/post-item.vue";

export default {
  name: "ProfilePosts",
  components: {
    PostItem,
  },
  props: {
    posts: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isEnd: false,
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
  methods: {
    // 处理帖子点击
    onPostClick(postId) {
      this.$emit("post-click", postId);
    },

    // 加载更多
    loadMore() {
      // 通知父组件加载更多
      this.$emit("load-more");
    },
  },
};
</script>

<style>
.profile-posts {
  flex: 1;
  padding: 20rpx;
  background-color: #f5f5f5;
}

.posts-grid {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

.posts-column {
  width: 48.5%;
}

.left-column {
  margin-right: 8rpx;
}

.right-column {
  margin-left: 8rpx;
}

.load-more {
  text-align: center;
  padding: 30rpx 0;
}

.load-more text {
  font-size: 26rpx;
  color: #999;
  padding: 10rpx 30rpx;
}

.empty-state {
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
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.loading-state {
  text-align: center;
  padding: 30rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}
</style>
