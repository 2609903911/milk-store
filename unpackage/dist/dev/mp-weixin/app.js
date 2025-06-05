"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_userState = require("./utils/userState.js");
const utils_userService = require("./utils/userService.js");
const utils_userData = require("./utils/userData.js");
if (!Math) {
  "./pages/login/login.js";
  "./pages/home/home.js";
  "./pages/order/order.js";
  "./pages/my-orders/my-orders.js";
  "./pages/profile/profile.js";
  "./pages/community/community.js";
  "./pages/post-detail/post-detail.js";
  "./pages/post-create/post-create.js";
  "./pages/post-profile/post-profile.js";
  "./pages/order-confirm/order-confirm.js";
  "./pages/map/map.js";
  "./pages/map-city/map-city.js";
  "./pages/order-detail/order-detail.js";
  "./pages/order-medal/order-medal.js";
  "./pages/coupons/coupons.js";
  "./pages/panda-store/panda-store.js";
  "./pages/personal-data/personal-data.js";
  "./pages/search/search.js";
  "./pages/ai-chat/index.js";
  "./pages/agreement/user-agreement.js";
  "./pages/agreement/privacy-policy.js";
  "./pages/address/address.js";
  "./pages/address/edit-address.js";
  "./pages/together-drink/together-drink.js";
}
const _sfc_main = {
  onLaunch: function() {
    utils_userState.initUserState();
    this.initUserInfo();
    utils_userData.initUserData();
  },
  onShow: function() {
  },
  onHide: function() {
  },
  methods: {
    // 初始化用户信息
    initUserInfo() {
      try {
        if (!utils_userState.userState || !utils_userState.userState.userId) {
          this.createGuestUser();
        } else {
        }
      } catch (error) {
      }
    },
    // 创建游客用户（可选功能）
    createGuestUser() {
      const phoneNumber = "guest_" + Date.now();
      utils_userService.loginUser(phoneNumber);
    }
  }
};
const OrderDetail = () => "./pages/components/shop-detail.js";
const OrderCart = () => "./pages/components/order-cart.js";
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("shop-detail", OrderDetail);
  app.component("order-cart", OrderCart);
  app.config.errorHandler = (err, vm, info) => {
    if (err && typeof err === "string" && (err.includes("socket") || err.includes("localhost"))) {
      return;
    }
  };
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
