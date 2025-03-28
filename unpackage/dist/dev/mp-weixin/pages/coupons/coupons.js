"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_couponModel = require("../../utils/couponModel.js");
const utils_couponService = require("../../utils/couponService.js");
const _sfc_main = {
  __name: "coupons",
  setup(__props) {
    const tabs = common_vendor.ref(["可用优惠券", "已使用", "已过期"]);
    const currentTab = common_vendor.ref(0);
    const validCoupons = common_vendor.ref([]);
    const usedCoupons = common_vendor.ref([]);
    const expiredCoupons = common_vendor.ref([]);
    const availableCoupons = common_vendor.ref([]);
    const isCouponCenterVisible = common_vendor.ref(false);
    const formatDate = (timestamp) => {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    common_vendor.onMounted(() => {
      loadCoupons();
    });
    const loadCoupons = () => {
      validCoupons.value = utils_couponService.getCouponsByStatus(utils_couponModel.COUPON_STATUS.VALID);
      common_vendor.index.__f__("log", "at pages/coupons/coupons.vue:480", validCoupons.value);
      usedCoupons.value = utils_couponService.getCouponsByStatus(utils_couponModel.COUPON_STATUS.USED);
      expiredCoupons.value = utils_couponService.getCouponsByStatus(utils_couponModel.COUPON_STATUS.EXPIRED);
    };
    const switchTab = (index) => {
      currentTab.value = index;
    };
    const swiperChange = (e) => {
      currentTab.value = e.detail.current;
    };
    const closeCouponCenter = () => {
      isCouponCenterVisible.value = false;
    };
    const useCouponClick = (coupon) => {
      common_vendor.index.showModal({
        title: "使用优惠券",
        content: "确定要使用此优惠券吗？请先前往点单页面选择商品",
        confirmText: "去点单",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.switchTab({
              url: "/pages/order/order"
            });
          }
        }
      });
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
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs.value, (tab, index, i0) => {
          return {
            a: common_vendor.t(tab),
            b: index,
            c: currentTab.value === index ? 1 : "",
            d: common_vendor.o(($event) => switchTab(index), index)
          };
        }),
        b: common_vendor.f(validCoupons.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT
          }, coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT ? {
            b: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH ? {
            d: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            g: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            h: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            i: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            j: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            k: common_vendor.t(coupon.title),
            l: common_vendor.t(coupon.description),
            m: common_vendor.t(formatDate(coupon.startTime)),
            n: common_vendor.t(formatDate(coupon.endTime)),
            o: common_vendor.o(($event) => useCouponClick(), coupon.id),
            p: coupon.id,
            q: common_vendor.n(getCouponColorClass(coupon.type))
          });
        }),
        c: validCoupons.value.length === 0
      }, validCoupons.value.length === 0 ? {
        d: common_assets._imports_2$3
      } : {}, {
        e: common_vendor.f(usedCoupons.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT
          }, coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT ? {
            b: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH ? {
            d: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            g: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            h: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            i: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            j: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            k: common_vendor.t(coupon.title),
            l: common_vendor.t(coupon.description),
            m: common_vendor.t(formatDate(coupon.usedTime)),
            n: coupon.id
          });
        }),
        f: usedCoupons.value.length === 0
      }, usedCoupons.value.length === 0 ? {
        g: common_assets._imports_2$3
      } : {}, {
        h: common_vendor.f(expiredCoupons.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT
          }, coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT ? {
            b: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH ? {
            d: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            g: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            h: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            i: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            j: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            k: common_vendor.t(coupon.title),
            l: common_vendor.t(coupon.description),
            m: common_vendor.t(formatDate(coupon.endTime)),
            n: coupon.id
          });
        }),
        i: expiredCoupons.value.length === 0
      }, expiredCoupons.value.length === 0 ? {
        j: common_assets._imports_2$3
      } : {}, {
        k: currentTab.value,
        l: common_vendor.o(swiperChange),
        m: isCouponCenterVisible.value
      }, isCouponCenterVisible.value ? {
        n: common_vendor.o(closeCouponCenter),
        o: common_vendor.f(availableCoupons.value, (coupon, index, i0) => {
          return common_vendor.e({
            a: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT
          }, coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT ? {
            b: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH ? {
            d: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            g: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            h: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            i: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            j: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            k: common_vendor.t(coupon.title),
            l: common_vendor.o(($event) => _ctx.claimCouponAction(coupon), index),
            m: index,
            n: common_vendor.n(getCouponColorClass(coupon.type))
          });
        }),
        p: common_vendor.o(() => {
        }),
        q: common_vendor.o(closeCouponCenter)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8d9323cd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/coupons/coupons.js.map
