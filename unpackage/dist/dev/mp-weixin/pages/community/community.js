"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_postApi = require("../../utils/api/postApi.js");
const common_assets = require("../../common/assets.js");
const PostCard = () => "./c-cpns/post-card/post-card.js";
const _sfc_main = {
  components: {
    PostCard
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
      isRefreshing: false
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
    }
  },
  onLoad() {
    this.getPostList();
    this.isInitialized = true;
  },
  onShow() {
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
      if (this.loading)
        return;
      this.loading = true;
      try {
        const response = await utils_api_postApi.fetchPosts({
          page: this.currentPage,
          size: this.pageSize,
          sortBy: "createdAt"
        });
        if (response && response.data && response.data.posts) {
          const newPosts = response.data.posts;
          if (isRefresh) {
            this.posts = newPosts;
          } else {
            this.posts = [...this.posts, ...newPosts];
          }
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
        common_vendor.index.showToast({
          title: "获取帖子数据失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
        this.isRefreshing = false;
        common_vendor.index.stopPullDownRefresh();
      }
    },
    // 处理帖子点击 - 跳转到帖子详情页
    onPostClick(postId) {
      common_vendor.index.navigateTo({
        url: `../post-detail/post-detail?postId=${postId}`
      });
    },
    // 添加新帖子
    onAddPost() {
      common_vendor.index.navigateTo({
        url: "../post-create/post-create"
      });
    },
    // 处理我的页面点击
    onMyProfile() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      if (userInfo && userInfo.userId) {
        common_vendor.index.navigateTo({
          url: `../post-profile/post-profile?userId=${userInfo.userId}`
        });
      } else {
        common_vendor.index.navigateTo({
          url: "../login/login"
        });
      }
    }
  }
};
if (!Array) {
  const _component_post_card = common_vendor.resolveComponent("post-card");
  _component_post_card();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0$5,
    b: common_vendor.o((...args) => $options.onAddPost && $options.onAddPost(...args)),
    c: common_assets._imports_1$2,
    d: common_vendor.o((...args) => $options.onMyProfile && $options.onMyProfile(...args)),
    e: $data.isRefreshing
  }, $data.isRefreshing ? {} : {}, {
    f: common_vendor.f($options.leftPosts, (post, k0, i0) => {
      return {
        a: post.postId,
        b: common_vendor.o($options.onPostClick, post.postId),
        c: "5f1be870-0-" + i0,
        d: common_vendor.p({
          post,
          size: "medium",
          ["border-radius"]: 12,
          ["title-color"]: "#333"
        })
      };
    }),
    g: common_vendor.f($options.rightPosts, (post, k0, i0) => {
      return {
        a: post.postId,
        b: common_vendor.o($options.onPostClick, post.postId),
        c: "5f1be870-1-" + i0,
        d: common_vendor.p({
          post,
          size: "medium",
          ["border-radius"]: 12,
          ["title-color"]: "#333"
        })
      };
    }),
    h: $data.loading
  }, $data.loading ? {} : {}, {
    i: !$data.loading && $data.posts.length === 0
  }, !$data.loading && $data.posts.length === 0 ? {} : {}, {
    j: common_vendor.o((...args) => $options.loadMorePosts && $options.loadMorePosts(...args)),
    k: common_vendor.o((...args) => $options.onRefresh && $options.onRefresh(...args)),
    l: $data.isRefreshing
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/community/community.js.map
