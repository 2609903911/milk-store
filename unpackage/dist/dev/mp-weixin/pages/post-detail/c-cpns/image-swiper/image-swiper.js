"use strict";
const common_vendor = require("../../../../common/vendor.js");
const utils_api_postApi = require("../../../../utils/api/postApi.js");
const _sfc_main = {
  name: "ImageSwiper",
  props: {
    // 图片数组
    images: {
      type: [Array, String],
      default: () => []
    },
    // 帖子ID
    postId: {
      type: String,
      default: ""
    },
    // 点赞数量
    likesCount: {
      type: Number,
      default: 0
    },
    // 是否已点赞
    isLiked: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      localIsLiked: false,
      localLikeCount: 0
    };
  },
  watch: {
    // 监听images属性变化
    images: {
      immediate: true,
      handler(newImages) {
      }
    },
    // 监听外部传入的点赞状态和数量
    isLiked: {
      immediate: true,
      handler(val) {
        this.localIsLiked = val;
      }
    },
    likesCount: {
      immediate: true,
      handler(val) {
        this.localLikeCount = val;
      }
    }
  },
  computed: {
    // 处理图片数据，确保是数组格式
    processedImages() {
      if (!this.images)
        return [];
      if (typeof this.images === "string") {
        try {
          const parsedImages = JSON.parse(this.images);
          if (Array.isArray(parsedImages)) {
            return parsedImages;
          } else if (typeof parsedImages === "string") {
            return [parsedImages];
          }
          return [];
        } catch (e) {
          return [this.images];
        }
      }
      if (Array.isArray(this.images)) {
        return this.images;
      }
      return [];
    },
    // 计算属性：点赞数量
    likeCount() {
      return this.localLikeCount;
    }
  },
  methods: {
    // 预览图片
    previewImage(index) {
      if (this.processedImages.length === 0)
        return;
      common_vendor.index.previewImage({
        current: index,
        urls: this.processedImages,
        indicator: "number",
        loop: true
      });
    },
    // 点赞/取消点赞
    async toggleLike() {
      if (!this.postId) {
        common_vendor.index.showToast({
          title: "点赞失败",
          icon: "none"
        });
        return;
      }
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        const userId = (userInfo == null ? void 0 : userInfo.userId) || "";
        if (!userId) {
          common_vendor.index.showToast({
            title: "请先登录",
            icon: "none"
          });
          return;
        }
        const newIsLiked = !this.localIsLiked;
        const newLikeCount = newIsLiked ? this.localLikeCount + 1 : Math.max(0, this.localLikeCount - 1);
        this.localIsLiked = newIsLiked;
        this.localLikeCount = newLikeCount;
        const response = await utils_api_postApi.likeOrUnlike(this.postId, 1, userId);
        this.$emit("like-changed", {
          isLiked: newIsLiked,
          count: newLikeCount
        });
      } catch (error) {
        this.localIsLiked;
        this.localIsLiked = !this.localIsLiked;
        this.localLikeCount = this.localIsLiked ? this.localLikeCount + 1 : Math.max(0, this.localLikeCount - 1);
        common_vendor.index.showToast({
          title: "操作失败，请重试",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.processedImages.length > 0
  }, $options.processedImages.length > 0 ? {
    b: common_vendor.f($options.processedImages, (image, index, i0) => {
      return {
        a: image,
        b: common_vendor.o(($event) => $options.previewImage(index), index),
        c: index
      };
    })
  } : {}, {
    c: $props.isLiked ? "/static/fonts/like-filled.svg" : "/static/fonts/like.svg",
    d: common_vendor.t($options.likeCount),
    e: common_vendor.o((...args) => $options.toggleLike && $options.toggleLike(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-detail/c-cpns/image-swiper/image-swiper.js.map
