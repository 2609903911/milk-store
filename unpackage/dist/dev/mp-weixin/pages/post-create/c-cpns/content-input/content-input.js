"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  name: "ContentInput",
  props: {
    initialContent: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      content: this.initialContent || "",
      showModal: false
    };
  },
  methods: {
    handleContentChange() {
      this.$emit("update:content", this.content);
    },
    // 供父组件调用，设置内容值
    setContent(value) {
      this.content = value;
    },
    // 显示Panda管家弹窗
    showPandaPopup() {
      this.showModal = true;
    },
    // 关闭Panda管家弹窗
    closePandaPopup() {
      this.showModal = false;
    },
    // 跳转到Panda管家页面
    goPandaAssistant() {
      this.closePandaPopup();
      common_vendor.index.navigateTo({
        url: "/pages/ai-chat/index",
        fail: (err) => {
          common_vendor.index.showToast({
            title: "Panda管家页面开发中...",
            icon: "none"
          });
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.showPandaPopup && $options.showPandaPopup(...args)),
    b: common_vendor.o([($event) => $data.content = $event.detail.value, (...args) => $options.handleContentChange && $options.handleContentChange(...args)]),
    c: $data.content,
    d: common_vendor.t($data.content.length),
    e: $data.showModal
  }, $data.showModal ? {
    f: common_vendor.o((...args) => $options.closePandaPopup && $options.closePandaPopup(...args)),
    g: common_vendor.o((...args) => $options.goPandaAssistant && $options.goPandaAssistant(...args)),
    h: common_vendor.o(() => {
    }),
    i: common_vendor.o((...args) => $options.closePandaPopup && $options.closePandaPopup(...args))
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ff7b943e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/post-create/c-cpns/content-input/content-input.js.map
