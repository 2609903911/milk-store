"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/order/order.js";
  "./pages/my-orders/my-orders.js";
  "./pages/profile/profile.js";
  "./pages/order-confirm/order-confirm.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:4", "App Launch");
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:7", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:10", "App Hide");
  }
};
const OrderDetail = () => "./pages/components/order-detail.js";
const OrderCart = () => "./pages/components/order-cart.js";
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.component("order-detail", OrderDetail);
  app.component("order-cart", OrderCart);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
