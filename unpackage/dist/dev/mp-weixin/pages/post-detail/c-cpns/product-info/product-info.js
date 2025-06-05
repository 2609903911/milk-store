"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "ProductInfo",
  props: {
    // 商品信息
    product: {
      type: Object,
      default: null
    }
  },
  methods: {
    // 跳转到商品详情页
    goToProductDetail() {
      if (!this.product || !this.product.productId)
        return;
      common_vendor.index.navigateTo({
        url: `/pages/order/order?productId=${this.product.productId}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.product
  }, $props.product ? {
    b: $props.product.imageUrl,
    c: common_vendor.t($props.product.name),
    d: common_vendor.t($props.product.price),
    e: common_vendor.o((...args) => $options.goToProductDetail && $options.goToProductDetail(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-detail/c-cpns/product-info/product-info.js.map
