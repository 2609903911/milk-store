"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "ProfileTabs",
  props: {
    activeTab: {
      type: String,
      default: "posts"
    }
  },
  methods: {
    changeTab(tab) {
      if (this.activeTab !== tab) {
        this.$emit("tab-change", tab);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.activeTab === "posts"
  }, $props.activeTab === "posts" ? {} : {}, {
    b: $props.activeTab === "posts" ? 1 : "",
    c: common_vendor.o(($event) => $options.changeTab("posts")),
    d: $props.activeTab === "likes"
  }, $props.activeTab === "likes" ? {} : {}, {
    e: $props.activeTab === "likes" ? 1 : "",
    f: common_vendor.o(($event) => $options.changeTab("likes"))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-profile/c-cpns/profile-tabs/profile-tabs.js.map
