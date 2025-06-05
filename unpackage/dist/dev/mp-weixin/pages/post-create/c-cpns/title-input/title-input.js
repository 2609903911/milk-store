"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "TitleInput",
  props: {
    initialTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      title: this.initialTitle || ""
    };
  },
  methods: {
    handleTitleChange() {
      this.$emit("update:title", this.title);
    },
    // 供父组件调用，设置标题值
    setTitle(value) {
      this.title = value;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o([($event) => $data.title = $event.detail.value, (...args) => $options.handleTitleChange && $options.handleTitleChange(...args)]),
    b: $data.title,
    c: common_vendor.t($data.title.length)
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-795d44c1"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-create/c-cpns/title-input/title-input.js.map
