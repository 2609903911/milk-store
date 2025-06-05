"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const common_assets = require("../../../../../common/assets.js");
const _sfc_main = {
  name: "PostItem",
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      imageLoaded: false,
      imageError: false
    };
  },
  computed: {
    // 计算图片显示模式
    imageMode() {
      if (this.post.coverImageRatio) {
        const mode = this.post.coverImageRatio > 1.2 ? "widthFix" : "aspectFill";
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
      return this.post.likesCount !== void 0 ? this.post.likesCount : this.post.likes || 0;
    },
    commentsCount() {
      return this.post.commentsCount !== void 0 ? this.post.commentsCount : this.post.comments || 0;
    },
    contentPreview() {
      if (this.post.content) {
        return this.post.content.length > 50 ? this.post.content.substring(0, 50) + "..." : this.post.content;
      }
      return "";
    },
    isLiked() {
      return this.post.isLiked === true;
    },
    isPostDataComplete() {
      const result = this.checkPostData();
      return result;
    }
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
      if (count < 1e3) {
        return count.toString();
      } else {
        return Math.floor(count / 1e3) + "k";
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
    logPostStructure() {
    }
  },
  watch: {
    post: {
      handler(newPost) {
        this.logPostStructure();
      },
      immediate: true,
      deep: true
    }
  },
  mounted() {
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.coverImageUrl,
    b: $options.imageMode,
    c: common_vendor.o((...args) => $options.handleImageError && $options.handleImageError(...args)),
    d: common_vendor.o((...args) => $options.handleImageLoad && $options.handleImageLoad(...args)),
    e: common_vendor.t($props.post.title),
    f: $props.post.product
  }, $props.post.product ? {
    g: common_assets._imports_0$17,
    h: common_vendor.t($props.post.product.name)
  } : {}, {
    i: common_vendor.t($options.formatCount($options.likesCount)),
    j: $options.isLiked ? 1 : "",
    k: common_vendor.t($options.formatCount($options.commentsCount)),
    l: common_vendor.o((...args) => $options.onPostClick && $options.onPostClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../../.sourcemap/mp-weixin/pages/post-profile/c-cpns/profile-posts/post-item/post-item.js.map
