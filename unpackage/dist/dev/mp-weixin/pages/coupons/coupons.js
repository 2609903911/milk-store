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
        case utils_couponModel.COUPON_TYPES.BUY_ONE_GET_ONE:
          return "buy-one-coupon";
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
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).BUY_ONE_GET_ONE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            h: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).BUY_ONE_GET_ONE,
            g: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            i: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            j: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            k: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            l: common_vendor.t(coupon.title),
            m: common_vendor.t(coupon.description),
            n: common_vendor.t(formatDate(coupon.startTime)),
            o: common_vendor.t(formatDate(coupon.endTime)),
            p: common_vendor.o(($event) => useCouponClick(), coupon.id),
            q: coupon.id,
            r: common_vendor.n(getCouponColorClass(coupon.type))
          });
        }),
        c: validCoupons.value.length === 0
      }, validCoupons.value.length === 0 ? {
        d: common_assets._imports_2$4
      } : {}, {
        e: common_vendor.f(usedCoupons.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT
          }, coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT ? {
            b: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH ? {
            d: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).BUY_ONE_GET_ONE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            h: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).BUY_ONE_GET_ONE,
            g: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            i: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            j: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            k: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            l: common_vendor.t(coupon.title),
            m: common_vendor.t(coupon.description),
            n: common_vendor.t(formatDate(coupon.usedTime)),
            o: coupon.id
          });
        }),
        f: usedCoupons.value.length === 0
      }, usedCoupons.value.length === 0 ? {
        g: common_assets._imports_2$4
      } : {}, {
        h: common_vendor.f(expiredCoupons.value, (coupon, k0, i0) => {
          return common_vendor.e({
            a: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT
          }, coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT ? {
            b: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH ? {
            d: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).BUY_ONE_GET_ONE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            h: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).BUY_ONE_GET_ONE,
            g: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            i: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            j: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            k: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            l: common_vendor.t(coupon.title),
            m: common_vendor.t(coupon.description),
            n: common_vendor.t(formatDate(coupon.endTime)),
            o: coupon.id
          });
        }),
        i: expiredCoupons.value.length === 0
      }, expiredCoupons.value.length === 0 ? {
        j: common_assets._imports_2$4
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
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).BUY_ONE_GET_ONE ? {} : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            h: common_vendor.t(coupon.value)
          } : coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).BUY_ONE_GET_ONE,
            g: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            i: coupon.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            j: coupon.minOrderAmount > 0
          }, coupon.minOrderAmount > 0 ? {
            k: common_vendor.t(coupon.minOrderAmount)
          } : {}, {
            l: common_vendor.t(coupon.title),
            m: common_vendor.o(($event) => _ctx.claimCouponAction(coupon), index),
            n: index,
            o: common_vendor.n(getCouponColorClass(coupon.type))
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
