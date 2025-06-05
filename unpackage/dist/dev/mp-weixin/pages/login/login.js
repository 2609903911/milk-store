"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/userState.js");
const utils_api_authApi = require("../../utils/api/authApi.js");
const utils_userData = require("../../utils/userData.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      phone: "",
      code: "",
      isAgree: false,
      isCounting: false,
      countdown: 60,
      timer: null
    };
  },
  methods: {
    // 返回上一页
    navBack() {
      common_vendor.index.navigateBack();
    },
    validatePhone() {
      if (!this.phone) {
        common_vendor.index.showToast({
          title: "请输入手机号码",
          icon: "none"
        });
        return false;
      }
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(this.phone)) {
        common_vendor.index.showToast({
          title: "请输入正确的手机号码",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    validateCode() {
      if (!this.code) {
        common_vendor.index.showToast({
          title: "请输入验证码",
          icon: "none"
        });
        return false;
      }
      const codeRegex = /^\d{6}$/;
      if (!codeRegex.test(this.code)) {
        common_vendor.index.showToast({
          title: "请输入6位数字验证码",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    validateAgreement() {
      if (!this.isAgree) {
        common_vendor.index.showToast({
          title: "请先同意用户协议和隐私政策",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    async getVerificationCode() {
      if (!this.validatePhone()) {
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: "发送中..."
        });
        const url = `http://localhost:8082/api/auth/code/send?phone=${encodeURIComponent(
          this.phone
        )}&type=login`;
        common_vendor.index.request({
          url,
          method: "POST",
          success: (res) => {
            var _a;
            common_vendor.index.hideLoading();
            if (res.statusCode >= 200 && res.statusCode < 300) {
              if (res.data.code === 200) {
                common_vendor.index.showToast({
                  title: "验证码已发送",
                  icon: "success"
                });
                this.startCountdown();
              } else {
                common_vendor.index.showToast({
                  title: res.data.message || "验证码发送失败",
                  icon: "none"
                });
              }
            } else {
              common_vendor.index.showToast({
                title: ((_a = res.data) == null ? void 0 : _a.message) || "验证码发送失败",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "网络错误，请稍后重试",
              icon: "none"
            });
          }
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: error.message || "验证码发送失败，请稍后重试",
          icon: "none"
        });
      }
    },
    startCountdown() {
      this.$nextTick(() => {
        this.isCounting = true;
        this.countdown = 60;
        this.timer = setInterval(() => {
          if (this.countdown > 0) {
            this.countdown -= 1;
          } else {
            if (this.timer) {
              clearInterval(this.timer);
              this.timer = null;
              this.isCounting = false;
            }
          }
        }, 1e3);
      });
    },
    async handleLogin() {
      if (!this.validatePhone() || !this.validateCode() || !this.validateAgreement()) {
        return;
      }
      try {
        common_vendor.index.showLoading({
          title: "登录中..."
        });
        const url = `http://localhost:8082/api/auth/login/code?phone=${encodeURIComponent(
          this.phone
        )}&code=${encodeURIComponent(this.code)}`;
        common_vendor.index.request({
          url,
          method: "POST",
          success: async (res) => {
            var _a;
            common_vendor.index.hideLoading();
            if (res.statusCode >= 200 && res.statusCode < 300) {
              if (res.data.code === 200) {
                const userData = res.data.data.user;
                const token = res.data.data.token;
                utils_api_authApi.saveUserToStorage(userData, token);
                await utils_userData.fetchUserDataFromServer();
                common_vendor.index.showToast({
                  title: "登录成功",
                  icon: "success"
                });
                setTimeout(() => {
                  common_vendor.index.switchTab({
                    url: "/pages/home/home",
                    success: function() {
                    },
                    fail: function(err) {
                      common_vendor.index.reLaunch({
                        url: "/pages/home/home"
                      });
                    }
                  });
                }, 1500);
              } else {
                common_vendor.index.showToast({
                  title: res.data.message || "验证码错误",
                  icon: "none"
                });
              }
            } else {
              common_vendor.index.showToast({
                title: ((_a = res.data) == null ? void 0 : _a.message) || "登录失败",
                icon: "none"
              });
            }
          },
          fail: (err) => {
            common_vendor.index.hideLoading();
            common_vendor.index.showToast({
              title: "网络错误，请稍后重试",
              icon: "none"
            });
          }
        });
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: error.message || "登录失败，请稍后重试",
          icon: "none"
        });
      }
    },
    toggleAgree() {
      this.isAgree = !this.isAgree;
    },
    goToUserAgreement() {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/user-agreement"
      });
    },
    goToPrivacyPolicy() {
      common_vendor.index.navigateTo({
        url: "/pages/agreement/privacy-policy"
      });
    },
    // 暂不登录
    skipLogin() {
      common_vendor.index.switchTab({
        url: "/pages/home/home",
        success: function() {
        },
        fail: function(err) {
          common_vendor.index.reLaunch({
            url: "/pages/home/home"
          });
        }
      });
    },
    // 组件销毁时清除定时器
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: $data.phone,
    c: common_vendor.o(($event) => $data.phone = $event.detail.value),
    d: $data.code,
    e: common_vendor.o(($event) => $data.code = $event.detail.value),
    f: common_vendor.t($data.isCounting ? `${$data.countdown}s` : "获取验证码"),
    g: $data.isCounting,
    h: common_vendor.o((...args) => $options.getVerificationCode && $options.getVerificationCode(...args)),
    i: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    j: common_vendor.o((...args) => $options.skipLogin && $options.skipLogin(...args)),
    k: $data.isAgree,
    l: common_vendor.o((...args) => $options.goToUserAgreement && $options.goToUserAgreement(...args)),
    m: common_vendor.o((...args) => $options.goToPrivacyPolicy && $options.goToPrivacyPolicy(...args)),
    n: common_vendor.o((...args) => $options.toggleAgree && $options.toggleAgree(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
