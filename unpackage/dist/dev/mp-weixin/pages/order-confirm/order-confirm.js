"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  (_easycom_uni_icons + CouponSelect)();
}
const CouponSelect = () => "../components/coupon-select.js";
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
    const showCouponSelect = common_vendor.ref(false);
    const selectedCoupon = common_vendor.ref(null);
    const totalAmount = common_vendor.ref(0);
    const availableCoupons = common_vendor.computed(() => {
      return (utils_userState.userState.coupons || []).filter((coupon) => {
        const now = Date.now();
        const isExpired = now > coupon.endTime;
        const isUsed = coupon.status === "used";
        const isDeleted = coupon.isDeleted;
        const meetsAmount = totalAmount.value >= coupon.minOrderAmount;
        return !isExpired && !isUsed && !isDeleted && meetsAmount;
      });
    });
    const discountAmount = common_vendor.ref("0.00");
    const originalPrice = common_vendor.ref("0.00");
    common_vendor.onMounted(() => {
      try {
        const orderData = common_vendor.index.getStorageSync("orderConfirmData");
        if (orderData) {
          common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:199", "从本地存储获取订单数据:", orderData);
          orderItems.value = orderData.items || [];
          totalPrice.value = orderData.totalPrice || "0.00";
          originalPrice.value = orderData.totalPrice || "0.00";
          calculateTotalAmount();
          if (orderData.store) {
            storeInfo.value = orderData.store;
          }
          if (orderData.deliveryType) {
            deliveryType.value = orderData.deliveryType;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order-confirm/order-confirm.vue:219", "获取订单数据失败", error);
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
      var _a, _b;
      const pages = getCurrentPages();
      pages.find((page) => page.route === "pages/index/index");
      common_vendor.index.setStorageSync("clearCartAfterPayment", "true");
      common_vendor.index.setStorageSync("ordersNeedRefresh", "true");
      const orderConfirmData = common_vendor.index.getStorageSync("orderConfirmData") || {};
      const selectedItemIds = (orderConfirmData.items || []).map(
        (item) => item.id
      );
      common_vendor.index.setStorageSync("itemsToDeleteFromCart", selectedItemIds);
      const now = /* @__PURE__ */ new Date();
      const newOrder = {
        id: "ORDER" + now.getTime(),
        // 使用时间戳创建唯一ID
        storeName: ((_a = orderConfirmData.store) == null ? void 0 : _a.name) || "默认店铺",
        storeAddress: ((_b = orderConfirmData.store) == null ? void 0 : _b.address) || "默认地址",
        deliveryType: orderConfirmData.deliveryType || "self",
        status: "pending",
        // 新订单状态为待取餐
        time: now.getTime(),
        items: orderConfirmData.items || [],
        // 使用打折后的价格
        totalPrice: totalPrice.value,
        // 添加优惠信息
        discount: {
          amount: discountAmount.value,
          originalPrice: originalPrice.value,
          coupon: selectedCoupon.value ? {
            id: selectedCoupon.value.id,
            title: selectedCoupon.value.title,
            type: selectedCoupon.value.type,
            value: selectedCoupon.value.value
          } : null
        }
      };
      common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:288", "创建新订单:", newOrder);
      const savedOrders = common_vendor.index.getStorageSync("savedOrders") || [];
      savedOrders.unshift(newOrder);
      common_vendor.index.setStorageSync("savedOrders", savedOrders);
      common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:296", "订单已保存到本地存储");
      if (selectedCoupon.value) {
        const index = utils_userState.userState.coupons.findIndex(
          (c) => c.id === selectedCoupon.value.id
        );
        if (index !== -1) {
          common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:304", "优惠券已使用");
          utils_userState.userState.coupons[index].status = "used";
          utils_userState.userState.coupons[index].usedTime = Date.now();
          common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:308", "优惠券状态:", utils_userState.userState.coupons[index].status);
          common_vendor.index.__f__(
            "log",
            "at pages/order-confirm/order-confirm.vue:309",
            "优惠券使用时间:",
            new Date(utils_userState.userState.coupons[index].usedTime).toLocaleString()
          );
          utils_userState.updateUserState({ coupons: utils_userState.userState.coupons });
        }
      }
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
    const calculateTotalAmount = () => {
      totalAmount.value = orderItems.value.reduce((sum, item) => {
        return sum + item.price * item.quantity;
      }, 0);
    };
    common_vendor.watch(
      orderItems,
      () => {
        calculateTotalAmount();
      },
      { deep: true }
    );
    const openCouponSelect = () => {
      showCouponSelect.value = true;
    };
    const handleCouponSelect = (coupon) => {
      common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:359", "优惠券选择:", coupon);
      totalPrice.value = originalPrice.value;
      let finalPrice = parseFloat(totalPrice.value);
      let discount = 0;
      if (coupon) {
        selectedCoupon.value = coupon;
        if (coupon.type === "cash") {
          discount = coupon.value;
          common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:371", "减去的价格：", discount);
          finalPrice = Math.max(0, finalPrice - discount);
        } else if (coupon.type === "discount") {
          const originalAmount = parseFloat(originalPrice.value);
          const discountedAmount = originalAmount * (coupon.value / 10);
          discount = originalAmount - discountedAmount;
          finalPrice = discountedAmount;
        } else if (coupon.type === "specialPrice") {
          const matchingItem = orderItems.value.find(
            (item) => coupon.scopeIds && coupon.scopeIds.includes(item.id)
          );
          if (matchingItem) {
            const originalItemPrice = matchingItem.price;
            const originalItemsTotal = originalItemPrice * matchingItem.quantity;
            const specialItemsTotal = coupon.value * matchingItem.quantity;
            discount = originalItemsTotal - specialItemsTotal;
            finalPrice = Math.max(0, finalPrice - discount);
          }
        } else if (coupon.type === "free") {
          discount = parseFloat(originalPrice.value);
          finalPrice = 0;
        }
        discountAmount.value = discount.toFixed(2);
        totalPrice.value = finalPrice.toFixed(2);
        common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:407", "应用优惠券后:", {
          优惠券: coupon.title,
          原价: originalPrice.value,
          折扣: discountAmount.value,
          最终价格: totalPrice.value
        });
      } else {
        selectedCoupon.value = null;
        discountAmount.value = "0.00";
        totalPrice.value = originalPrice.value;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
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
        h: selectedCoupon.value
      }, selectedCoupon.value ? {
        i: common_vendor.t(selectedCoupon.value.title),
        j: common_vendor.t(discountAmount.value)
      } : {
        k: common_vendor.t(availableCoupons.value.length > 0 ? `${availableCoupons.value.length}张优惠券可用` : "暂无可用优惠券")
      }, {
        l: availableCoupons.value.length > 0 ? "#006de7" : "#999",
        m: common_vendor.p({
          type: "right",
          size: "16"
        }),
        n: common_vendor.o(openCouponSelect),
        o: common_vendor.o(($event) => showCouponSelect.value = $event),
        p: common_vendor.o(handleCouponSelect),
        q: common_vendor.p({
          show: showCouponSelect.value,
          ["order-amount"]: totalAmount.value,
          ["order-items"]: orderItems.value
        }),
        r: common_vendor.t(totalPrice.value),
        s: common_vendor.t(orderItems.value.length),
        t: common_assets._imports_1$2,
        v: common_vendor.t(totalPrice.value),
        w: common_vendor.o(handlePayment)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e7689724"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-confirm/order-confirm.js.map
