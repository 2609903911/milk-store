"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "order-detail",
  setup(__props) {
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    common_vendor.onMounted(() => {
    });
    const copyOrderNumber = () => {
      common_vendor.index.setClipboardData({
        data: "748388645480484946",
        success: () => {
          common_vendor.index.showToast({
            title: "复制成功"
          });
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$5,
        b: common_vendor.p({
          type: "left",
          size: "24"
        }),
        c: common_vendor.o(goBack),
        d: common_assets._imports_1$2,
        e: common_assets._imports_2$1,
        f: common_assets._imports_3$1,
        g: common_assets._imports_0,
        h: common_vendor.o(copyOrderNumber)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-71729483"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-detail/order-detail.js.map
