"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
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
          common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:139", "从本地存储获取订单数据:", orderData);
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
        common_vendor.index.__f__("error", "at pages/order-confirm/order-confirm.vue:155", "获取订单数据失败", error);
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
      common_vendor.index.showToast({
        title: "模拟支付成功",
        icon: "success",
        success: () => {
          setTimeout(() => {
            common_vendor.index.redirectTo({
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
        g: common_assets._imports_0$3,
        h: common_vendor.t(totalPrice.value),
        i: common_vendor.t(orderItems.value.length),
        j: common_assets._imports_1$1,
        k: common_vendor.t(totalPrice.value),
        l: common_vendor.o(handlePayment)
      };
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-confirm/order-confirm.js.map
