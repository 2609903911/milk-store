"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      // 手机号
      code: "",
      // 验证码
      isAgree: true,
      // 是否同意协议
      counting: false,
      // 是否在倒计时
      counter: 60,
      // 倒计时秒数
      timer: null
      // 定时器
    };
  },
  methods: {
    // 返回上一页
    navBack() {
      common_vendor.index.navigateBack();
    },
    // 获取验证码
    getVerificationCode() {
      if (this.counting)
        return;
      this.counting = true;
      this.counter = 60;
      this.timer = setInterval(() => {
        this.counter--;
        if (this.counter <= 0) {
          clearInterval(this.timer);
          this.counting = false;
        }
      }, 1e3);
    },
    // 处理登录
    handleLogin() {
      common_vendor.index.showToast({
        title: "登录成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.switchTab({
          url: "/pages/home/home"
        });
      }, 1500);
    },
    // 切换协议同意状态
    toggleAgreement() {
      this.isAgree = !this.isAgree;
    },
    // 暂不登录
    skipLogin() {
      common_vendor.index.switchTab({
        url: "/pages/home/home"
      });
    }
  },
  // 组件销毁时清除定时器
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.navBack && $options.navBack(...args)),
    b: common_assets._imports_0$1,
    c: $data.phone,
    d: common_vendor.o(($event) => $data.phone = $event.detail.value),
    e: $data.code,
    f: common_vendor.o(($event) => $data.code = $event.detail.value),
    g: common_vendor.t($data.counting ? `重新获取(${$data.counter}s)` : "获取验证码"),
    h: $data.counting ? 1 : "",
    i: common_vendor.o((...args) => $options.getVerificationCode && $options.getVerificationCode(...args)),
    j: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    k: common_vendor.o((...args) => $options.skipLogin && $options.skipLogin(...args)),
    l: $data.isAgree,
    m: common_vendor.o((...args) => $options.toggleAgreement && $options.toggleAgreement(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
