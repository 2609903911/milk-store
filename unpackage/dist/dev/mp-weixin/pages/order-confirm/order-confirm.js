"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "order-confirm",
  setup(__props) {
    const orderItems = common_vendor.ref([]);
    const totalPrice = common_vendor.ref("0.00");
    const storeInfo = common_vendor.ref({
      name: "九江中心店",
      distance: "0.97km",
      address: "九江市中心区繁华路88号",
      phone: "13027261672"
    });
    const deliveryType = common_vendor.ref("self");
    common_vendor.onMounted(() => {
      try {
        const orderData = common_vendor.index.getStorageSync("orderConfirmData");
        if (orderData) {
          common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:144", "从本地存储获取订单数据:", orderData);
          orderItems.value = orderData.items || [];
          totalPrice.value = orderData.totalPrice || "0.00";
          if (orderData.store) {
            storeInfo.value = orderData.store;
          }
          if (orderData.deliveryType) {
            deliveryType.value = orderData.deliveryType;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order-confirm/order-confirm.vue:160", "获取订单数据失败", error);
        common_vendor.index.showToast({
          title: "获取订单数据失败",
          icon: "none"
        });
      }
    });
    const copyPhoneNumber = () => {
      common_vendor.index.setClipboardData({
        data: storeInfo.value.phone,
        success: () => {
          common_vendor.index.showToast({
            title: "电话已复制",
            icon: "success"
          });
        }
      });
    };
    const handlePayment = () => {
      const pages = getCurrentPages();
      pages.find((page) => page.route === "pages/index/index");
      common_vendor.index.setStorageSync("clearCartAfterPayment", "true");
      const orderConfirmData = common_vendor.index.getStorageSync("orderConfirmData") || {};
      const selectedItemIds = (orderConfirmData.items || []).map(
        (item) => item.id
      );
      common_vendor.index.setStorageSync("itemsToDeleteFromCart", selectedItemIds);
      common_vendor.index.showToast({
        title: "模拟支付成功",
        icon: "success",
        success: () => {
          setTimeout(() => {
            common_vendor.index.switchTab({
              url: "/pages/my-orders/my-orders"
            });
          }, 1500);
        }
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.t(deliveryType.value === "self" ? "自取" : "外卖"),
        b: common_vendor.t(storeInfo.value.name),
        c: common_vendor.t(storeInfo.value.distance),
        d: common_vendor.t(storeInfo.value.address),
        e: common_vendor.o(copyPhoneNumber),
        f: common_vendor.f(orderItems.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.specs || "常规"),
            d: common_vendor.t(item.quantity),
            e: common_vendor.t(item.price.toFixed(2)),
            f: index
          };
        }),
        g: common_assets._imports_0$4,
        h: common_vendor.p({
          type: "right",
          size: "16"
        }),
        i: common_vendor.t(totalPrice.value),
        j: common_vendor.t(orderItems.value.length),
        k: common_assets._imports_1$1,
        l: common_vendor.t(totalPrice.value),
        m: common_vendor.o(handlePayment)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-confirm/order-confirm.js.map
