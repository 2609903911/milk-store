"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
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
      const orderData = {
        storeName: ((_a = orderConfirmData.store) == null ? void 0 : _a.name) || "默认店铺",
        storeAddress: ((_b = orderConfirmData.store) == null ? void 0 : _b.address) || "默认地址",
        deliveryType: orderConfirmData.deliveryType || "self",
        items: orderConfirmData.items || [],
        totalPrice: totalPrice.value,
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
      try {
        const newOrder = await utils_api_orderApi.createOrder(orderData);
        if (selectedCoupon.value) {
          const stateIndex = utils_userState.userState.coupons.findIndex(
            (c) => c.id === selectedCoupon.value.id
          );
          if (stateIndex !== -1) {
            utils_userState.userState.coupons[stateIndex].status = "used";
            utils_userState.userState.coupons[stateIndex].usedTime = Date.now();
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
      } catch (error) {
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
        if (coupon.type === "cash") {
          discount = coupon.value;
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
        q: common_vendor.t(availableCoupons.value.length > 0 ? `${availableCoupons.value.length}张优惠券可用` : "暂无可用优惠券")
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
