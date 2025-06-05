"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "SubmitButton",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleSubmit() {
      if (!this.disabled && !this.loading) {
        this.$emit("submit");
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($props.loading ? "发布中..." : "发布帖子"),
    b: $props.disabled,
    c: $props.loading,
    d: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-da2bc594"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-create/c-cpns/submit-button/submit-button.js.map
