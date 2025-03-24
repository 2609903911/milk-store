"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_userStorage = require("./utils/userStorage.js");
const utils_userState = require("./utils/userState.js");
const utils_userService = require("./utils/userService.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/order/order.js";
  "./pages/my-orders/my-orders.js";
  "./pages/profile/profile.js";
  "./pages/order-confirm/order-confirm.js";
  "./pages/map/map.js";
  "./pages/map-city/map-city.js";
  "./pages/order-detail/order-detail.js";
  "./pages/order-medal/order-medal.js";
  "./pages/coupons/coupons.js";
  "./pages/panda-store/panda-store.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:9", "App Launch");
    utils_userState.initUserState();
    this.initUserInfo();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:18", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:21", "App Hide");
  },
  methods: {
    // 初始化用户信息
    initUserInfo() {
      try {
        const userInfo = utils_userStorage.getUserInfo();
        if (!userInfo) {
          common_vendor.index.__f__("log", "at App.vue:32", "未检测到用户信息，将使用访客模式");
          this.createGuestUser();
        } else {
          common_vendor.index.__f__("log", "at App.vue:36", "已加载用户信息");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:39", "初始化用户信息失败", error);
      }
    },
    // 创建游客用户（可选功能）
    createGuestUser() {
      const phoneNumber = "guest_" + Date.now();
      const { success, userInfo } = utils_userService.loginUser(phoneNumber);
      if (success) {
        common_vendor.index.__f__("log", "at App.vue:50", "已创建游客账号");
      } else {
        common_vendor.index.__f__("error", "at App.vue:52", "创建游客账号失败");
      }
    }
  }
};
const OrderDetail = () => "./pages/components/shop-detail.js";
const OrderCart = () => "./pages/components/order-cart.js";
if (typeof common_vendor.wx$1 !== "undefined") {
  const originalConsole = console;
  console.warn = function(...args) {
    if (args.length > 0 && typeof args[0] === "string" && (args[0].includes("localhost") || args[0].includes("socket"))) {
      return;
    }
    return originalConsole.warn.apply(console, args);
  };
}
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("shop-detail", OrderDetail);
  app.component("order-cart", OrderCart);
  app.config.errorHandler = (err, vm, info) => {
    if (err && typeof err === "string" && (err.includes("socket") || err.includes("localhost"))) {
      return;
    }
    common_vendor.index.__f__("error", "at main.js:48", "[App Error]:", err);
  };
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
