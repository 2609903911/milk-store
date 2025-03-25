"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const utils_couponModel = require("../../utils/couponModel.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "panda-store",
  setup(__props) {
    const tabs = common_vendor.ref(["人气兑换", "折扣券", "现金券", "免费券", "特价券"]);
    const currentTab = common_vendor.ref(0);
    const couponList = common_vendor.ref([]);
    const showSuccessPopup = common_vendor.ref(false);
    const exchangedCoupon = common_vendor.ref(null);
    const allCoupons = common_vendor.reactive([
      // 折扣券
      {
        id: "ex_discount_1",
        title: "奶茶8折券",
        type: utils_couponModel.COUPON_TYPES.DISCOUNT,
        value: 8,
        minOrderAmount: 20,
        description: "全场奶茶8折优惠",
        validity: "30天",
        coinsCost: 100,
        category: "discount"
      },
      {
        id: "ex_discount_2",
        title: "饮品7折券",
        type: utils_couponModel.COUPON_TYPES.DISCOUNT,
        value: 7,
        minOrderAmount: 30,
        description: "全场饮品7折优惠",
        validity: "15天",
        coinsCost: 150,
        category: "discount"
      },
      // 现金券
      {
        id: "ex_cash_1",
        title: "满30减10元券",
        type: utils_couponModel.COUPON_TYPES.CASH,
        value: 10,
        minOrderAmount: 30,
        description: "满30元立减10元",
        validity: "30天",
        coinsCost: 120,
        category: "cash"
      },
      {
        id: "ex_cash_2",
        title: "满50减20元券",
        type: utils_couponModel.COUPON_TYPES.CASH,
        value: 20,
        minOrderAmount: 50,
        description: "满50元立减20元",
        validity: "30天",
        coinsCost: 200,
        category: "cash"
      },
      // 免单券
      {
        id: "ex_free_1",
        title: "小杯饮品免单券",
        type: utils_couponModel.COUPON_TYPES.FREE,
        value: 15,
        minOrderAmount: 0,
        description: "小杯饮品免费，最高15元",
        validity: "7天",
        coinsCost: 300,
        category: "free"
      },
      // 特价券
      {
        id: "ex_special_1",
        title: "杨梅吐气特价券",
        type: utils_couponModel.COUPON_TYPES.SPECIAL_PRICE,
        value: 9.9,
        minOrderAmount: 0,
        description: "杨梅吐气特价9.9元",
        validity: "7天",
        coinsCost: 180,
        category: "specialPrice"
      },
      // 免运费券
      {
        id: "ex_shipping_1",
        title: "免运费券",
        type: utils_couponModel.COUPON_TYPES.SHIPPING,
        value: 0,
        minOrderAmount: 20,
        description: "满20元免除配送费",
        validity: "30天",
        coinsCost: 80,
        category: "shipping"
      }
    ]);
    common_vendor.onMounted(() => {
      updateCouponList();
    });
    const updateCouponList = () => {
      if (currentTab.value === 0) {
        couponList.value = allCoupons;
      } else {
        const categoryMap = ["", "discount", "cash", "free", "specialPrice"];
        const selectedCategory = categoryMap[currentTab.value];
        couponList.value = allCoupons.filter(
          (coupon) => coupon.category === selectedCategory
        );
      }
    };
    const switchTab = (index) => {
      currentTab.value = index;
      updateCouponList();
    };
    const getCouponColorClass = (type) => {
      switch (type) {
        case utils_couponModel.COUPON_TYPES.DISCOUNT:
          return "discount-coupon";
        case utils_couponModel.COUPON_TYPES.CASH:
          return "cash-coupon";
        case utils_couponModel.COUPON_TYPES.FREE:
          return "free-coupon";
        case utils_couponModel.COUPON_TYPES.SPECIAL_PRICE:
          return "special-coupon";
        case utils_couponModel.COUPON_TYPES.SHIPPING:
          return "shipping-coupon";
        default:
          return "";
      }
    };
    const getCouponTypeImage = (type) => {
      switch (type) {
        case utils_couponModel.COUPON_TYPES.DISCOUNT:
          return "/static/images/coupon/coupon-discount.png";
        case utils_couponModel.COUPON_TYPES.CASH:
          return "/static/images/coupon/coupon-cash.png";
        case utils_couponModel.COUPON_TYPES.FREE:
          return "/static/images/coupon/coupon-free.png";
        case utils_couponModel.COUPON_TYPES.SPECIAL_PRICE:
          return "/static/images/coupon/coupon-special.png";
        case utils_couponModel.COUPON_TYPES.SHIPPING:
          return "/static/images/coupon/coupon-shipping.png";
        default:
          return "/static/images/coupon/coupon-default.png";
      }
    };
    const exchangeCoupon = (coupon) => {
      if (utils_userState.userState.pandaCoins < coupon.coinsCost) {
        common_vendor.index.showToast({
          title: "熊猫币不足",
          icon: "none"
        });
        return;
      }
      const newCoins = utils_userState.userState.pandaCoins - coupon.coinsCost;
      let newCoupon;
      const now = Date.now();
      switch (coupon.type) {
        case utils_couponModel.COUPON_TYPES.DISCOUNT:
          newCoupon = utils_couponModel.createDiscountCoupon(
            coupon.value,
            coupon.minOrderAmount,
            {
              title: coupon.title,
              description: coupon.description,
              endTime: now + parseInt(coupon.validity) * 24 * 60 * 60 * 1e3
            }
          );
          break;
        case utils_couponModel.COUPON_TYPES.CASH:
          newCoupon = utils_couponModel.createCashCoupon(coupon.value, coupon.minOrderAmount, {
            title: coupon.title,
            description: coupon.description,
            endTime: now + parseInt(coupon.validity) * 24 * 60 * 60 * 1e3
          });
          break;
        case utils_couponModel.COUPON_TYPES.FREE:
          newCoupon = utils_couponModel.createFreeCoupon(coupon.value, {
            title: coupon.title,
            description: coupon.description,
            endTime: now + parseInt(coupon.validity) * 24 * 60 * 60 * 1e3
          });
          break;
        default:
          newCoupon = {
            id: `coupon_${now}_${Math.floor(Math.random() * 1e6)}`,
            title: coupon.title,
            type: coupon.type,
            value: coupon.value,
            minOrderAmount: coupon.minOrderAmount,
            scope: "all",
            scopeIds: [],
            startTime: now,
            endTime: now + parseInt(coupon.validity) * 24 * 60 * 60 * 1e3,
            status: utils_couponModel.COUPON_STATUS.VALID,
            description: coupon.description,
            imageUrl: "/static/images/coupon1.png",
            isDeleted: false,
            createTime: now,
            usedTime: null,
            source: "pandaStore"
          };
      }
      const updatedUserInfo = {
        pandaCoins: newCoins,
        coupons: [...utils_userState.userState.coupons, newCoupon]
      };
      utils_userState.updateUserState(updatedUserInfo);
      exchangedCoupon.value = newCoupon;
      showSuccessPopup.value = true;
    };
    const closeSuccessPopup = () => {
      showSuccessPopup.value = false;
    };
    const navigateToCoupons = () => {
      showSuccessPopup.value = false;
      common_vendor.index.navigateTo({
        url: "/pages/coupons/coupons"
      });
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "left",
          size: "24"
        }),
        b: common_vendor.o(goBack),
        c: common_assets._imports_0$8,
        d: common_vendor.o((...args) => _ctx.showEarnCoinsPopup && _ctx.showEarnCoinsPopup(...args)),
        e: common_assets._imports_1$3,
        f: common_vendor.t(common_vendor.unref(utils_userState.userState).pandaCoins),
        g: common_vendor.p({
          type: "",
          size: "24"
        }),
        h: common_vendor.f(tabs.value, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab),
            b: index,
            c: currentTab.value === index ? 1 : "",
            d: common_vendor.o(($event) => switchTab(index), index)
          };
        }),
        i: common_vendor.f(couponList.value, (coupon, index, i0) => {
          return common_vendor.e({
            a: getCouponTypeImage(coupon.type),
            b: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT
          }, coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT ? {
            c: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH ? {
            e: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            h: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            d: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            g: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            i: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            j: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            k: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            l: common_vendor.t(coupon.title),
            m: common_vendor.t(coupon.description),
            n: common_vendor.t(coupon.validity || "30天"),
            o: common_vendor.t(coupon.coinsCost),
            p: common_vendor.t(common_vendor.unref(utils_userState.userState).pandaCoins < coupon.coinsCost ? "熊猫币不足" : "立即兑换"),
            q: common_vendor.o(($event) => exchangeCoupon(coupon), index),
            r: common_vendor.unref(utils_userState.userState).pandaCoins < coupon.coinsCost,
            s: index,
            t: common_vendor.n(getCouponColorClass(coupon.type))
          });
        }),
        j: common_assets._imports_1$3,
        k: couponList.value.length === 0
      }, couponList.value.length === 0 ? {
        l: common_assets._imports_2$3
      } : {}, {
        m: showSuccessPopup.value
      }, showSuccessPopup.value ? {
        n: common_vendor.o(navigateToCoupons),
        o: common_vendor.o(closeSuccessPopup),
        p: common_vendor.o(() => {
        }),
        q: common_vendor.o(closeSuccessPopup)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-21c67e85"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/panda-store/panda-store.js.map
