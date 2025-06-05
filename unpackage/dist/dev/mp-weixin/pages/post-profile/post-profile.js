"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_userApi = require("../../utils/api/userApi.js");
const utils_api_postApi = require("../../utils/api/postApi.js");
const utils_api_config = require("../../utils/api/config.js");
const ProfileHeader = () => "./c-cpns/profile-header/profile-header.js";
const ProfileStats = () => "./c-cpns/profile-stats/profile-stats.js";
const ProfileTabs = () => "./c-cpns/profile-tabs/profile-tabs.js";
const ProfilePosts = () => "./c-cpns/profile-posts/profile-posts.js";
const _sfc_main = {
  components: {
    ProfileHeader,
    ProfileStats,
    ProfileTabs,
    ProfilePosts
  },
  data() {
    return {
      userId: null,
      userInfo: {
        userId: "",
        nickname: "",
        avatar: "",
        backgroundImage: "",
        bio: ""
      },
      statsData: {
        followers: 0,
        following: 0,
        likes: 0
      },
      posts: [],
      likedPosts: [],
      activeTab: "posts",
      loading: false,
      page: 1,
      size: 10
    };
  },
  computed: {
    displayPosts() {
      return this.activeTab === "posts" ? this.posts : this.likedPosts;
    }
  },
  onLoad(options) {
    if (options && options.userId) {
      this.userId = options.userId;
      this.loadUserProfile();
      this.loadUserPosts();
    } else {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo && userInfo.userId) {
        this.userId = userInfo.userId;
        this.loadUserProfile();
        this.loadUserPosts();
      } else {
        common_vendor.index.showToast({
          title: "未找到用户信息",
          icon: "none"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    }
  },
  methods: {
    // 更新用户信息
    updateUserInfo(newUserInfo) {
      this.userInfo = { ...newUserInfo };
      if (this.userInfo.backgroundImage && this.userInfo.backgroundImage.startsWith("/") && this.userInfo.backgroundImage !== "/static/images/post-background.jpg") {
        this.userInfo.backgroundImage = utils_api_config.getFullUrl(
          this.userInfo.backgroundImage
        );
      }
    },
    // 处理背景更新
    handleBackgroundUpdated(newBackgroundUrl) {
    },
    // 加载用户个人资料
    async loadUserProfile() {
      try {
        const response = await utils_api_userApi.getUserProfile(this.userId);
        if (response && response.data) {
          let userData = null;
          if (response.data.code === 200 && response.data.data) {
            userData = response.data.data;
          } else if (response.code === 200 && response.data) {
            userData = response.data;
          } else if (response.data) {
            userData = response.data;
          }
          if (userData) {
            let isFollowed = Boolean(userData.isFollowed);
            this.userInfo = {
              userId: userData.userId || this.userId,
              nickname: userData.nickname || "用户昵称",
              avatar: userData.avatar || "/static/images/avatar.png",
              backgroundImage: userData.backgroundImage || "/static/images/profile-background.jpg",
              bio: userData.bio || "记录生活的点滴，热爱分享☀",
              isFollowed
              // 其他可能需要的字段
            };
            if (this.userInfo.backgroundImage && this.userInfo.backgroundImage.startsWith("/") && this.userInfo.backgroundImage !== "/static/images/post-background.jpg") {
              this.userInfo.backgroundImage = utils_api_config.getFullUrl(
                this.userInfo.backgroundImage
              );
            }
            this.statsData = {
              followers: userData.followersCount || 0,
              following: userData.followingCount || 0,
              likes: userData.likesReceivedCount || 0
            };
          } else {
            throw new Error("无法解析用户数据");
          }
        } else {
          throw new Error("API返回数据格式不正确");
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取用户信息失败",
          icon: "none"
        });
        this.userInfo = {
          userId: this.userId,
          nickname: "未知用户",
          avatar: "/static/images/avatar.png",
          backgroundImage: "/static/images/profile-background.jpg",
          bio: "记录生活的点滴，热爱分享☀"
        };
        this.statsData = {
          followers: 0,
          following: 0,
          likes: 0
        };
      }
    },
    // 加载用户帖子
    async loadUserPosts() {
      this.loading = true;
      try {
        let response;
        if (this.activeTab === "posts") {
          response = await utils_api_postApi.fetchUserPosts(this.userId, {
            page: this.page,
            size: this.size
          });
          if (response && response.data && response.data.posts) {
            this.posts = response.data.posts;
          }
        } else {
          response = await utils_api_postApi.fetchUserLikedPosts(this.userId, {
            page: this.page,
            size: this.size
          });
          if (response && response.data && response.data.posts) {
            this.likedPosts = response.data.posts;
          }
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取帖子失败",
          icon: "none"
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
      common_vendor.index.navigateTo({
        url: `../post-detail/post-detail?postId=${postId}`
      });
    },
    // 处理关注状态变化
    handleFollowStatusChanged(newStatus) {
      this.userInfo = {
        ...this.userInfo,
        isFollowed: newStatus.isFollowed
      };
      if (newStatus.isFollowed) {
        this.statsData.followers += 1;
      } else {
        this.statsData.followers = Math.max(0, this.statsData.followers - 1);
      }
    }
  }
};
if (!Array) {
  const _component_profile_header = common_vendor.resolveComponent("profile-header");
  const _component_profile_stats = common_vendor.resolveComponent("profile-stats");
  const _component_profile_tabs = common_vendor.resolveComponent("profile-tabs");
  const _component_profile_posts = common_vendor.resolveComponent("profile-posts");
  (_component_profile_header + _component_profile_stats + _component_profile_tabs + _component_profile_posts)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.handleBackgroundUpdated),
    b: common_vendor.o($options.updateUserInfo),
    c: common_vendor.o($options.handleFollowStatusChanged),
    d: common_vendor.p({
      userInfo: $data.userInfo
    }),
    e: common_vendor.p({
      statsData: $data.statsData
    }),
    f: common_vendor.o($options.handleTabChange),
    g: common_vendor.p({
      activeTab: $data.activeTab
    }),
    h: common_vendor.o($options.onPostClick),
    i: common_vendor.p({
      posts: $options.displayPosts,
      loading: $data.loading
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post-profile/post-profile.js.map
