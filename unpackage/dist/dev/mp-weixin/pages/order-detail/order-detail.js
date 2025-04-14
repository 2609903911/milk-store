"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_api_orderApi = require("../../utils/api/orderApi.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "order-detail",
  setup(__props) {
    const orderId = common_vendor.ref("");
    const orderStatus = common_vendor.ref("");
    const storeName = common_vendor.ref("");
    const storeAddress = common_vendor.ref("");
    const orderItems = common_vendor.ref([]);
    const totalPrice = common_vendor.ref("");
    const orderTime = common_vendor.ref("");
    const discount = common_vendor.ref("");
    const pandaCoins = common_vendor.ref("");
    const originalPrice = common_vendor.ref("");
    const totalQuantity = common_vendor.computed(() => {
      return orderItems.value.reduce((total, item) => total + item.quantity, 0);
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const getStatusText = (status) => {
      const statusMap = {
        pending: "待取餐",
        completed: "已完成",
        cancelled: "已取消"
      };
      return statusMap[status] || "未知状态";
    };
    const getPandaCoins = (price, discount2 = 0) => {
      const originalPrice2 = Number(price) + Number(discount2);
      return Math.ceil(originalPrice2);
    };
    common_vendor.onMounted(async () => {
      var _a, _b, _c;
      try {
        common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:188", "订单详情页面已加载");
        let urlOrderId = "";
        const mpPages = getCurrentPages();
        if (mpPages && mpPages.length > 0) {
          const currentPage = mpPages[mpPages.length - 1];
          urlOrderId = ((_a = currentPage.options) == null ? void 0 : _a.orderId) || "";
          common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:200", "微信小程序环境，获取订单ID:", urlOrderId);
        }
        let orderDetail = null;
        if (urlOrderId) {
          try {
            orderDetail = await utils_api_orderApi.fetchOrderById(urlOrderId);
            common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:219", "通过API获取到订单信息:", orderDetail);
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/order-detail/order-detail.vue:221", "通过API获取订单失败:", error);
            orderDetail = common_vendor.index.getStorageSync("currentOrderDetail");
            common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:224", "从本地存储获取订单信息:", orderDetail);
          }
        } else {
          orderDetail = common_vendor.index.getStorageSync("currentOrderDetail");
          common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:229", "从本地存储获取订单信息:", orderDetail);
        }
        if (orderDetail && (urlOrderId === "" || orderDetail.id === urlOrderId)) {
          orderId.value = orderDetail.id || "";
          orderStatus.value = orderDetail.status || "";
          storeName.value = orderDetail.storeName || "";
          storeAddress.value = orderDetail.storeAddress || "";
          orderItems.value = orderDetail.items || [];
          totalPrice.value = orderDetail.totalPrice || "0.00";
          discount.value = ((_b = orderDetail.discount) == null ? void 0 : _b.amount) || "0.00";
          originalPrice.value = ((_c = orderDetail.discount) == null ? void 0 : _c.originalPrice) || "0.00";
          if (orderDetail.pandaCoins) {
            pandaCoins.value = orderDetail.pandaCoins;
          } else if (orderDetail.status !== "cancelled") {
            pandaCoins.value = getPandaCoins(
              totalPrice.value,
              discount.value
            );
          } else {
            pandaCoins.value = 0;
          }
          common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:260", "店铺地址:", storeAddress.value);
          if (orderDetail.time) {
            const date = new Date(orderDetail.time);
            orderTime.value = `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}-${String(date.getDate()).padStart(
              2,
              "0"
            )} ${String(date.getHours()).padStart(2, "0")}:${String(
              date.getMinutes()
            ).padStart(2, "0")}`;
          } else {
            orderTime.value = "无信息";
          }
        } else {
          common_vendor.index.__f__("error", "at pages/order-detail/order-detail.vue:277", "订单ID不匹配或未找到订单信息");
          common_vendor.index.showToast({
            title: "未找到订单信息",
            icon: "none"
          });
          setTimeout(() => {
            common_vendor.index.navigateBack();
          }, 1500);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order-detail/order-detail.vue:289", "获取订单详情出错:", error);
        common_vendor.index.showToast({
          title: "获取订单信息失败",
          icon: "none"
        });
      }
    });
    const copyOrderNumber = () => {
      common_vendor.index.setClipboardData({
        data: orderId.value,
        success: () => {
          common_vendor.index.showToast({
            title: "复制成功"
          });
        }
      });
    };
    const reorderItems = () => {
      common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:311", "再来一单");
      common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:313", "originalPrice", originalPrice.value);
      const orderData = {
        items: orderItems.value,
        totalPrice: originalPrice.value,
        originalPrice: originalPrice.value,
        store: {
          name: storeName.value,
          address: storeAddress.value
        },
        deliveryType: "self",
        // 默认自取
        pandaCoins: getPandaCoins(originalPrice.value, discount.value)
        // 添加熊猫币信息
      };
      common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:327", "准备提交的订单数据:", orderData);
      common_vendor.index.setStorageSync("orderConfirmData", orderData);
      common_vendor.index.navigateTo({
        url: "/pages/order-confirm/order-confirm"
      });
    };
    const navigateToPandaStore = () => {
      common_vendor.index.__f__("log", "at pages/order-detail/order-detail.vue:340", "跳转到熊猫币商城页面");
      common_vendor.index.navigateTo({
        url: "/pages/panda-store/panda-store"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0$6,
        b: common_vendor.p({
          type: "left",
          size: "24",
          color: "#333"
        }),
        c: common_vendor.o(goBack),
        d: common_vendor.t(getStatusText(orderStatus.value)),
        e: common_assets._imports_1$3,
        f: common_vendor.o(navigateToPandaStore),
        g: common_vendor.o(reorderItems),
        h: common_vendor.t(storeName.value),
        i: common_assets._imports_2$2,
        j: common_assets._imports_3$2,
        k: common_vendor.t(storeAddress.value),
        l: common_vendor.f(orderItems.value, (item, k0, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.specs),
            d: common_vendor.t(item.price.toFixed(2)),
            e: common_vendor.t(item.quantity),
            f: item.name
          };
        }),
        m: common_vendor.t(discount.value),
        n: common_vendor.t(pandaCoins.value),
        o: common_vendor.t(totalQuantity.value),
        p: common_vendor.t(totalPrice.value),
        q: common_vendor.t(orderTime.value),
        r: common_vendor.t(orderId.value),
        s: common_vendor.o(copyOrderNumber)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-71729483"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-detail/order-detail.js.map
