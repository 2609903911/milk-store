"use strict";
const common_vendor = require("../../../../common/vendor.js");
const common_assets = require("../../../../common/assets.js");
const _sfc_main = {
  name: "PostCard",
  props: {
    // 帖子数据
    post: {
      type: Object,
      required: true
    },
    // 卡片尺寸：small, medium, large
    size: {
      type: String,
      default: "medium",
      validator: (value) => ["small", "medium", "large"].includes(value)
    },
    // 边框圆角大小
    borderRadius: {
      type: [Number, String],
      default: 12
    },
    // 底部外边距
    marginBottom: {
      type: [Number, String],
      default: 20
    },
    // 标题颜色
    titleColor: {
      type: String,
      default: "#333"
    }
  },
  computed: {
    // 计算属性：卡片样式
    cardStyle() {
      return {
        "border-radius": `${this.borderRadius}rpx`,
        "margin-bottom": `${this.marginBottom}rpx`
      };
    },
    // 计算属性：标题样式
    titleStyle() {
      return {
        color: this.titleColor
      };
    },
    // 计算属性：帖子图片
    postImage() {
      if (this.post.images && this.post.images.length > 0) {
        return this.post.images[0] || "";
      } else if (this.post.product && this.post.product.imageUrl) {
        return this.post.product.imageUrl || "";
      }
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
    }
  },
  methods: {
    // 处理帖子点击
    handlePostClick() {
      this.$emit("post-click", this.post.postId);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.postImage,
    b: common_vendor.t($options.title),
    c: common_vendor.s($options.titleStyle),
    d: $options.avatar,
    e: common_vendor.t($options.nickname),
    f: common_assets._imports_0$14,
    g: common_vendor.t($options.likeCount),
    h: common_vendor.n(`size-${$props.size}`),
    i: common_vendor.s($options.cardStyle),
    j: common_vendor.o((...args) => $options.handlePostClick && $options.handlePostClick(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/community/c-cpns/post-card/post-card.js.map
