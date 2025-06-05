"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "ProfileStats",
  props: {
    statsData: {
      type: Object,
      default: () => ({
        followers: 0,
        following: 0,
        likes: 0
      })
    }
  },
  methods: {
    // 格式化数字，超过一万显示为x.x万
    formatNumber(num) {
      if (!num)
        return "0";
      if (num < 1e4) {
        return num.toString();
      } else {
        const formattedNum = (num / 1e4).toFixed(1);
        return formattedNum.endsWith(".0") ? formattedNum.slice(0, -2) + "万" : formattedNum + "万";
      }
    },
    // 导航到粉丝/关注列表页面
    navigateTo(type) {
      common_vendor.index.showToast({
        title: `${type === "followers" ? "粉丝" : "关注"}列表功能开发中`,
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($options.formatNumber($props.statsData.followers)),
    b: common_vendor.o(($event) => $options.navigateTo("followers")),
    c: common_vendor.t($options.formatNumber($props.statsData.following)),
    d: common_vendor.o(($event) => $options.navigateTo("following")),
    e: common_vendor.t($options.formatNumber($props.statsData.likes))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-profile/c-cpns/profile-stats/profile-stats.js.map
