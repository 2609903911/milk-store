"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/order/order.js";
  "./pages/my-orders/my-orders.js";
  "./pages/profile/profile.js";
  "./pages/order-confirm/order-confirm.js";
  "./pages/map/map.js";
  "./pages/map-city/map-city.js";
  "./pages/order-detail/order-detail.js";
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
