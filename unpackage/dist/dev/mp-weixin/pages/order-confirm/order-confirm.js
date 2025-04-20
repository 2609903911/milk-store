"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const utils_api_index = require("../../utils/api/index.js");
const utils_api_orderApi = require("../../utils/api/orderApi.js");
const utils_userData = require("../../utils/userData.js");
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
    const orderUserAddress = common_vendor.ref("");
    const contactName = common_vendor.ref("");
    const contactPhone = common_vendor.ref("");
    const gender = common_vendor.ref("");
    const userInfo = common_vendor.ref({
      nickname: "",
      phone: ""
    });
    const showCouponSelect = common_vendor.ref(false);
    const selectedCoupon = common_vendor.ref(null);
    const totalAmount = common_vendor.ref(0);
    const availableCoupons = common_vendor.computed(() => {
      const userCoupons = utils_userData.userData.coupons && utils_userData.userData.coupons.length > 0 ? utils_userData.userData.coupons : utils_userState.userState.coupons || [];
      return userCoupons.filter((coupon) => {
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
          if (orderData.userAddress) {
            orderUserAddress.value = orderData.userAddress;
          }
          if (orderData.contactName) {
            contactName.value = orderData.contactName;
          }
          if (orderData.contactPhone) {
            contactPhone.value = orderData.contactPhone;
          }
          if (orderData.gender) {
            gender.value = orderData.gender;
          }
          const localUserInfo = common_vendor.index.getStorageSync("userInfo");
          if (localUserInfo) {
            userInfo.value = {
              nickname: localUserInfo.nickname || "匿名用户",
              phone: localUserInfo.phone || "未设置手机号"
            };
          }
        }
      } catch (error) {
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
    const handlePayment = async () => {
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
      const totalAmountValue = parseFloat(originalPrice.value);
      const discountAmountValue = parseFloat(discountAmount.value);
      const actualAmountValue = parseFloat(totalPrice.value);
      common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:350", "订单支付信息:", {
        总金额: totalAmountValue,
        优惠金额: discountAmountValue,
        实付金额: actualAmountValue,
        选择的优惠券: selectedCoupon.value
      });
      const orderData = {
        userId: utils_userState.userState.userId,
        totalAmount: totalAmountValue.toFixed(2),
        discountAmount: discountAmountValue.toFixed(2),
        actualAmount: actualAmountValue.toFixed(2),
        couponId: selectedCoupon.value ? selectedCoupon.value.id : null,
        deliveryType: deliveryType.value || "self",
        storeName: ((_a = orderConfirmData.store) == null ? void 0 : _a.name) || storeInfo.value.name,
        storeAddress: ((_b = orderConfirmData.store) == null ? void 0 : _b.address) || storeInfo.value.address,
        contactName: contactName.value || userInfo.value.nickname || "匿名用户",
        contactPhone: contactPhone.value || userInfo.value.phone || "",
        deliveryAddress: deliveryType.value === "delivery" ? orderUserAddress.value : "",
        orderItems: JSON.stringify(orderItems.value)
      };
      try {
        common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:376", "创建订单数据:", orderData);
        const newOrder = await utils_api_index.api.order.createOrder(orderData);
        common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:380", "创建订单成功:", newOrder);
        if (selectedCoupon.value && selectedCoupon.value.id) {
          common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:384", "准备处理优惠券:", selectedCoupon.value.id);
          try {
            const couponResult = await utils_api_orderApi.getCouponById(
              selectedCoupon.value.id
            );
            common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:391", "获取到的优惠券信息:", couponResult);
            const couponInfo = (couponResult == null ? void 0 : couponResult.data) || couponResult;
            common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:397", "优惠券ID:", couponInfo == null ? void 0 : couponInfo.id);
            common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:398", "优惠券状态:", couponInfo == null ? void 0 : couponInfo.status);
            common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:399", "优惠券使用时间:", couponInfo == null ? void 0 : couponInfo.usedTime);
            common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:400", "优惠券关联订单:", couponInfo == null ? void 0 : couponInfo.orderId);
            if (couponInfo && couponInfo.status === "valid") {
              if (newOrder && newOrder.orderId) {
                common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:406", "使用订单ID更新优惠券:", newOrder.orderId);
                const result = await utils_api_orderApi.updateCouponUsed(
                  selectedCoupon.value.id,
                  newOrder.orderId
                );
                common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:411", "优惠券状态更新结果:", result);
                if (result && (result.success || result.code === 200)) {
                  common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:414", "优惠券已成功标记为已使用");
                } else {
                  common_vendor.index.__f__(
                    "error",
                    "at pages/order-confirm/order-confirm.vue:416",
                    "优惠券状态更新失败:",
                    (result == null ? void 0 : result.message) || (result == null ? void 0 : result.msg) || "未知错误"
                  );
                }
              } else {
                const orderId = `ORD${(/* @__PURE__ */ new Date()).toISOString().replace(/[-:.TZ]/g, "").substring(0, 14)}${Math.floor(
                  Math.random() * 1e3
                )}`;
                common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:428", "使用生成的订单ID更新优惠券:", orderId);
                const result = await utils_api_orderApi.updateCouponUsed(
                  selectedCoupon.value.id,
                  orderId
                );
                common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:433", "优惠券状态更新结果:", result);
                if (result && (result.success || result.code === 200)) {
                  common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:436", "优惠券已成功标记为已使用");
                } else {
                  common_vendor.index.__f__(
                    "error",
                    "at pages/order-confirm/order-confirm.vue:438",
                    "优惠券状态更新失败:",
                    (result == null ? void 0 : result.message) || (result == null ? void 0 : result.msg) || "未知错误"
                  );
                }
              }
            } else {
              common_vendor.index.__f__(
                "warn",
                "at pages/order-confirm/order-confirm.vue:445",
                "优惠券不可用或已被使用:",
                couponInfo == null ? void 0 : couponInfo.status,
                "优惠券ID:",
                couponInfo == null ? void 0 : couponInfo.id
              );
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/order-confirm/order-confirm.vue:453", "处理优惠券过程中出错:", error);
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
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order-confirm/order-confirm.vue:471", "订单创建失败:", error);
        common_vendor.index.showToast({
          title: "订单创建失败",
          icon: "none"
        });
      }
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
      totalPrice.value = originalPrice.value;
      let finalPrice = parseFloat(totalPrice.value);
      let discount = 0;
      if (coupon) {
        selectedCoupon.value = coupon;
        common_vendor.index.__f__("log", "at pages/order-confirm/order-confirm.vue:509", "选择的优惠券:", coupon);
        if (coupon.type === "cash") {
          discount = parseFloat(coupon.value);
          finalPrice = Math.max(0, finalPrice - discount);
        } else if (coupon.type === "discount") {
          const originalAmount = parseFloat(originalPrice.value);
          const discountedAmount = originalAmount * (parseFloat(coupon.value) / 10);
          discount = originalAmount - discountedAmount;
          finalPrice = discountedAmount;
        } else if (coupon.type === "specialPrice") {
          const matchingItems = orderItems.value.filter(
            (item) => coupon.scopeIds && coupon.scopeIds.includes(item.id)
          );
          if (matchingItems.length > 0) {
            let discountTotal = 0;
            matchingItems.forEach((item) => {
              const originalItemPrice = item.price;
              const originalItemsTotal = originalItemPrice * item.quantity;
              const specialItemsTotal = parseFloat(coupon.value) * item.quantity;
              discountTotal += originalItemsTotal - specialItemsTotal;
            });
            discount = discountTotal;
            finalPrice = Math.max(0, finalPrice - discount);
          }
        } else if (coupon.type === "free") {
          const maxDiscount = parseFloat(coupon.value);
          discount = Math.min(parseFloat(originalPrice.value), maxDiscount);
          finalPrice = Math.max(0, parseFloat(originalPrice.value) - discount);
        }
        discountAmount.value = discount.toFixed(2);
        totalPrice.value = finalPrice.toFixed(2);
      } else {
        selectedCoupon.value = null;
        discountAmount.value = "0.00";
        totalPrice.value = originalPrice.value;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: deliveryType.value === "self"
      }, deliveryType.value === "self" ? {
        b: common_vendor.t(storeInfo.value.name),
        c: common_vendor.p({
          type: "arrowright",
          size: "16",
          color: "black"
        }),
        d: common_vendor.t(storeInfo.value.distance),
        e: common_vendor.t(storeInfo.value.address),
        f: common_vendor.t(storeInfo.value.phone || "13027261672"),
        g: common_vendor.o(copyPhoneNumber)
      } : {
        h: common_vendor.p({
          type: "arrowright",
          size: "16",
          color: "black"
        }),
        i: common_vendor.t(orderUserAddress.value || "未设置收货地址"),
        j: common_vendor.t((contactName.value || userInfo.value.nickname || "匿名用户") + (gender.value === "male" ? "(先生)" : gender.value === "female" ? "(女士)" : "")),
        k: common_vendor.t(contactPhone.value || userInfo.value.phone || "未设置手机号")
      }, {
        l: common_vendor.f(orderItems.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.specs || "常规"),
            d: common_vendor.t(item.quantity),
            e: common_vendor.t(item.price.toFixed(2)),
            f: index
          };
        }),
        m: common_assets._imports_0$5,
        n: selectedCoupon.value
      }, selectedCoupon.value ? {
        o: common_vendor.t(selectedCoupon.value.title),
        p: common_vendor.t(discountAmount.value)
      } : {
        q: common_vendor.t(availableCoupons.value.length > 0 ? `${availableCoupons.value.length}张优惠券可用` : "选择优惠券")
      }, {
        r: availableCoupons.value.length > 0 ? "#006de7" : "#999",
        s: common_vendor.p({
          type: "right",
          size: "16"
        }),
        t: common_vendor.o(openCouponSelect),
        v: common_vendor.o(($event) => showCouponSelect.value = $event),
        w: common_vendor.o(handleCouponSelect),
        x: common_vendor.p({
          show: showCouponSelect.value,
          ["order-amount"]: totalAmount.value,
          ["order-items"]: orderItems.value
        }),
        y: common_vendor.t(totalPrice.value),
        z: common_assets._imports_1$2,
        A: common_vendor.t(totalPrice.value),
        B: common_vendor.o(handlePayment)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e7689724"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-confirm/order-confirm.js.map
