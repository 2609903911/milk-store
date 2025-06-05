"use strict";
const common_vendor = require("../../../../common/vendor.js");
const PostItem = () => "./post-item/post-item.js";
const _sfc_main = {
  name: "ProfilePosts",
  components: {
    PostItem
  },
  props: {
    posts: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isEnd: false
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
  methods: {
    // 处理帖子点击
    onPostClick(postId) {
      this.$emit("post-click", postId);
    },
    // 加载更多
    loadMore() {
      this.$emit("load-more");
    }
  }
};
if (!Array) {
  const _component_post_item = common_vendor.resolveComponent("post-item");
  _component_post_item();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.posts && $props.posts.length > 0
  }, $props.posts && $props.posts.length > 0 ? common_vendor.e({
    b: common_vendor.f($options.leftPosts, (post, k0, i0) => {
      return {
        a: post.postId,
        b: common_vendor.o($options.onPostClick, post.postId),
        c: "14ccde54-0-" + i0,
        d: common_vendor.p({
          post
        })
      };
    }),
    c: common_vendor.f($options.rightPosts, (post, k0, i0) => {
      return {
        a: post.postId,
        b: common_vendor.o($options.onPostClick, post.postId),
        c: "14ccde54-1-" + i0,
        d: common_vendor.p({
          post
        })
      };
    }),
    d: !$data.isEnd
  }, !$data.isEnd ? {
    e: common_vendor.o((...args) => $options.loadMore && $options.loadMore(...args))
  } : {}) : {}, {
    f: $props.loading
  }, $props.loading ? {} : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-profile/c-cpns/profile-posts/profile-posts.js.map
