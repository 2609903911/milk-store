<template>
  <view class="post-profile-container">
    <!-- 用户信息头部 -->
    <profile-header
      :userInfo="userInfo"
      @background-updated="handleBackgroundUpdated"
      @update:userInfo="updateUserInfo"
      @follow-status-changed="handleFollowStatusChanged"
    />

    <!-- 用户统计信息 -->
    <profile-stats :statsData="statsData" />

    <!-- 帖子Tab切换 -->
    <profile-tabs :activeTab="activeTab" @tab-change="handleTabChange" />

    <!-- 帖子列表 -->
    <profile-posts
      :posts="displayPosts"
      :loading="loading"
      @post-click="onPostClick"
    />
  </view>
</template>

<script>
import ProfileHeader from "./c-cpns/profile-header/profile-header.vue";
import ProfileStats from "./c-cpns/profile-stats/profile-stats.vue";
import ProfileTabs from "./c-cpns/profile-tabs/profile-tabs.vue";
import ProfilePosts from "./c-cpns/profile-posts/profile-posts.vue";
import { getUserProfile } from "../../utils/api/userApi";
import { fetchUserPosts, fetchUserLikedPosts } from "../../utils/api/postApi";
import { getFullUrl } from "../../utils/api/config";

export default {
  components: {
    ProfileHeader,
    ProfileStats,
    ProfileTabs,
    ProfilePosts,
  },
  data() {
    return {
      userId: null,
      userInfo: {
        userId: "",
        nickname: "",
        avatar: "",
        backgroundImage: "",
        bio: "",
      },
      statsData: {
        followers: 0,
        following: 0,
        likes: 0,
      },
      posts: [],
      likedPosts: [],
      activeTab: "posts",
      loading: false,
      page: 1,
      size: 10,
    };
  },
  computed: {
    displayPosts() {
      return this.activeTab === "posts" ? this.posts : this.likedPosts;
    },
  },
  onLoad(options) {
    if (options && options.userId) {
      this.userId = options.userId;
      this.loadUserProfile();
      this.loadUserPosts();
    } else {
      // 如果没有传入userId，可能是查看自己的主页
      const userInfo = uni.getStorageSync("userInfo");
      if (userInfo && userInfo.userId) {
        this.userId = userInfo.userId;
        this.loadUserProfile();
        this.loadUserPosts();
      } else {
        uni.showToast({
          title: "未找到用户信息",
          icon: "none",
        });
        setTimeout(() => {
          uni.navigateBack();
        }, 1500);
      }
    }
  },
  methods: {
    // 更新用户信息
    updateUserInfo(newUserInfo) {
      this.userInfo = { ...newUserInfo };

      // 确保背景图片URL是完整的，但不要给默认背景图添加前缀
      if (
        this.userInfo.backgroundImage &&
        this.userInfo.backgroundImage.startsWith("/") &&
        this.userInfo.backgroundImage !== "/static/images/post-background.jpg"
      ) {
        this.userInfo.backgroundImage = getFullUrl(
          this.userInfo.backgroundImage
        );
      }
    },

    // 处理背景更新
    handleBackgroundUpdated(newBackgroundUrl) {
      // 可以在这里执行其他操作，如刷新页面等
    },

    // 加载用户个人资料
    async loadUserProfile() {
      try {
        const response = await getUserProfile(this.userId);

        if (response && response.data) {
          // 根据实际返回的数据结构处理用户信息
          // 假设API返回格式为 { code: 200, data: { userInfo } }
          let userData = null;

          // 尝试不同的数据结构格式
          if (response.data.code === 200 && response.data.data) {
            userData = response.data.data;
          } else if (response.code === 200 && response.data) {
            userData = response.data;
          } else if (response.data) {
            userData = response.data;
          }

          if (userData) {
            // 使用API返回的关注状态
            let isFollowed = Boolean(userData.isFollowed);

            // 确保userInfo包含所有必要的字段
            this.userInfo = {
              userId: userData.userId || this.userId,
              nickname: userData.nickname || "用户昵称",
              avatar: userData.avatar || "/static/images/avatar.png",
              backgroundImage:
                userData.backgroundImage ||
                "/static/images/profile-background.jpg",
              bio: userData.bio || "记录生活的点滴，热爱分享☀",
              isFollowed: isFollowed,
              // 其他可能需要的字段
            };

            // 确保背景图片URL是完整的
            if (
              this.userInfo.backgroundImage &&
              this.userInfo.backgroundImage.startsWith("/") &&
              this.userInfo.backgroundImage !==
                "/static/images/post-background.jpg"
            ) {
              this.userInfo.backgroundImage = getFullUrl(
                this.userInfo.backgroundImage
              );
            }

            // 更新统计数据
            this.statsData = {
              followers: userData.followersCount || 0,
              following: userData.followingCount || 0,
              likes: userData.likesReceivedCount || 0,
            };
          } else {
            throw new Error("无法解析用户数据");
          }
        } else {
          throw new Error("API返回数据格式不正确");
        }
      } catch (error) {
        uni.showToast({
          title: "获取用户信息失败",
          icon: "none",
        });

        // 使用默认数据，确保UI不会崩溃
        this.userInfo = {
          userId: this.userId,
          nickname: "未知用户",
          avatar: "/static/images/avatar.png",
          backgroundImage: "/static/images/profile-background.jpg",
          bio: "记录生活的点滴，热爱分享☀",
        };

        this.statsData = {
          followers: 0,
          following: 0,
          likes: 0,
        };
      }
    },

    // 加载用户帖子
    async loadUserPosts() {
      this.loading = true;
      try {
        let response;

        if (this.activeTab === "posts") {
          // 获取用户发布的帖子
          response = await fetchUserPosts(this.userId, {
            page: this.page,
            size: this.size,
          });

          if (response && response.data && response.data.posts) {
            this.posts = response.data.posts;
          }
        } else {
          // 获取用户喜欢的帖子
          response = await fetchUserLikedPosts(this.userId, {
            page: this.page,
            size: this.size,
          });

          if (response && response.data && response.data.posts) {
            this.likedPosts = response.data.posts;
          }
        }
      } catch (error) {
        uni.showToast({
          title: "获取帖子失败",
          icon: "none",
        });
      } finally {
        this.loading = false;
      }
    },

    // 处理标签切换
    handleTabChange(tab) {
      this.activeTab = tab;
      this.page = 1;
      this.loadUserPosts();
    },

    // 点击帖子
    onPostClick(postId) {
      uni.navigateTo({
        url: `../post-detail/post-detail?postId=${postId}`,
      });
    },

    // 处理关注状态变化
    handleFollowStatusChanged(newStatus) {
      // 更新用户信息中的关注状态
      this.userInfo = {
        ...this.userInfo,
        isFollowed: newStatus.isFollowed,
      };

      // 如果需要，可以在这里更新统计数据
      if (newStatus.isFollowed) {
        // 关注数+1
        this.statsData.followers += 1;
      } else {
        // 关注数-1，但不能小于0
        this.statsData.followers = Math.max(0, this.statsData.followers - 1);
      }
    },
  },
};
</script>

<style>
.post-profile-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
