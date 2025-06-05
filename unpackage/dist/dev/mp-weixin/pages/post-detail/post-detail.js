"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_api_postApi = require("../../utils/api/postApi.js");
const ImageSwiper = () => "./c-cpns/image-swiper/image-swiper.js";
const ProductInfo = () => "./c-cpns/product-info/product-info.js";
const CommentSection = () => "./c-cpns/comment-section/comment-section.js";
const ShopDetail = () => "../components/shop-detail.js";
const _sfc_main = {
  components: {
    ImageSwiper,
    ProductInfo,
    CommentSection,
    ShopDetail
  },
  data() {
    return {
      postId: "",
      postDetail: null,
      loading: false,
      showProductDetail: false,
      selectedProduct: null,
      isPostLiked: false
      // 当前用户是否点赞
    };
  },
  computed: {
    // 处理帖子图片数据
    postImages() {
      if (!this.postDetail)
        return [];
      const { images } = this.postDetail;
      if (!images)
        return [];
      if (Array.isArray(images)) {
        return images;
      }
      if (typeof images === "string") {
        try {
          const parsedImages = JSON.parse(images);
          return Array.isArray(parsedImages) ? parsedImages : [parsedImages];
        } catch (e) {
          return [images];
        }
      }
      return [];
    }
  },
  onLoad(options) {
    if (options && options.postId) {
      this.postId = options.postId;
      this.getPostDetail();
    } else {
      common_vendor.index.showToast({
        title: "帖子ID不存在",
        icon: "none"
      });
    }
  },
  // 页面显示时检查点赞状态，确保从其他页面返回时状态正确
  onShow() {
    if (this.postId) {
      this.checkUserLikeStatus();
    }
  },
  methods: {
    // 获取帖子详情
    async getPostDetail() {
      if (!this.postId)
        return;
      this.loading = true;
      try {
        const response = await utils_api_postApi.fetchPostById(this.postId);
        if (response && response.data) {
          this.postDetail = response.data;
        } else {
          common_vendor.index.showToast({
            title: "帖子不存在或已删除",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "获取帖子详情失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 检查用户是否已点赞
    async checkUserLikeStatus() {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        if (!userInfo || !userInfo.userId) {
          return;
        }
        const result = await utils_api_postApi.checkUserLike({
          userId: userInfo.userId,
          targetId: this.postId,
          targetType: 1
          // 1表示帖子
        });
        if (result && result.data) {
          this.isPostLiked = result.data.liked === true;
        } else {
        }
      } catch (error) {
      }
    },
    // 处理点赞状态变化
    handleLikeChanged(data) {
      if (!this.postDetail) {
        return;
      }
      this.isPostLiked = data.isLiked;
      this.postDetail.likesCount = data.count;
    },
    // 跳转到用户个人资料页面
    navigateToUserProfile() {
      if (!this.postDetail || !this.postDetail.user || !this.postDetail.user.userId) {
        common_vendor.index.showToast({
          title: "用户信息不存在",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/post-profile/post-profile?userId=${this.postDetail.user.userId}`
      });
    },
    // 格式化时间
    formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 打开商品详情
    openProductDetail(product) {
      if (!product || !product.id) {
        return;
      }
      const defaultProduct = {
        id: product.id,
        name: product.name || "商品名称",
        desc: product.desc || product.description || "商品描述",
        price: parseFloat(product.price) || 0,
        image: product.imageUrl || "/static/images/hot01.png"
      };
      this.selectedProduct = defaultProduct;
      setTimeout(() => {
        this.showProductDetail = true;
      }, 0);
    },
    onAddToCart(product) {
    },
    handleVisibilityChange(visible) {
      if (!visible) {
        this.selectedProduct = null;
      }
    }
  }
};
if (!Array) {
  const _component_image_swiper = common_vendor.resolveComponent("image-swiper");
  const _component_product_info = common_vendor.resolveComponent("product-info");
  const _component_comment_section = common_vendor.resolveComponent("comment-section");
  const _easycom_shop_detail2 = common_vendor.resolveComponent("shop-detail");
  (_component_image_swiper + _component_product_info + _component_comment_section + _easycom_shop_detail2)();
}
const _easycom_shop_detail = () => "../components/shop-detail.js";
if (!Math) {
  _easycom_shop_detail();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c;
  return common_vendor.e({
    a: $data.loading
  }, $data.loading ? {} : {}, {
    b: !$data.loading && $data.postDetail
  }, !$data.loading && $data.postDetail ? common_vendor.e({
    c: common_vendor.o($options.handleLikeChanged),
    d: common_vendor.p({
      images: $options.postImages,
      ["post-id"]: $data.postId,
      ["likes-count"]: $data.postDetail.likesCount || 0,
      ["is-liked"]: $data.isPostLiked
    }),
    e: common_vendor.t($data.postDetail.title),
    f: ((_a = $data.postDetail.user) == null ? void 0 : _a.avatar) || "/static/images/avatar.png",
    g: common_vendor.t(((_b = $data.postDetail.user) == null ? void 0 : _b.nickname) || "匿名用户"),
    h: common_vendor.t($options.formatTime($data.postDetail.createdAt)),
    i: common_vendor.o((...args) => $options.navigateToUserProfile && $options.navigateToUserProfile(...args)),
    j: $data.postDetail.product
  }, $data.postDetail.product ? {
    k: common_vendor.p({
      product: $data.postDetail.product
    }),
    l: common_vendor.o(($event) => $options.openProductDetail($data.postDetail.product))
  } : {}, {
    m: common_vendor.t($data.postDetail.content)
  }) : {}, {
    n: !$data.loading && $data.postDetail
  }, !$data.loading && $data.postDetail ? {
    o: common_vendor.p({
      postId: $data.postId,
      authorId: (_c = $data.postDetail.user) == null ? void 0 : _c.userId
    })
  } : {}, {
    p: !$data.loading && !$data.postDetail
  }, !$data.loading && !$data.postDetail ? {} : {}, {
    q: $data.selectedProduct
  }, $data.selectedProduct ? {
    r: common_vendor.o($options.handleVisibilityChange),
    s: common_vendor.o($options.onAddToCart),
    t: common_vendor.p({
      visible: $data.showProductDetail,
      product: $data.selectedProduct
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/post-detail/post-detail.js.map
