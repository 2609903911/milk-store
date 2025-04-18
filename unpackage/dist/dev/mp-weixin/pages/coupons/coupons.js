"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_couponModel = require("../../utils/couponModel.js");
const utils_userData = require("../../utils/userData.js");
const _sfc_main = {
  __name: "coupons",
  setup(__props) {
    const tabs = common_vendor.ref(["可用优惠券", "已使用", "已过期"]);
    const currentTab = common_vendor.ref(0);
    const validCoupons = common_vendor.ref([]);
    const usedCoupons = common_vendor.ref([]);
    const expiredCoupons = common_vendor.ref([]);
    common_vendor.ref([]);
    common_vendor.ref(false);
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
      const userCoupons = utils_userData.userData.coupons || [];
      validCoupons.value = userCoupons.filter(
        (coupon) => (coupon.status === "valid" || coupon.status === "active" || coupon.status === "notStarted") && !coupon.usedTime
      );
      usedCoupons.value = userCoupons.filter(
        (coupon) => coupon.status === "used" || coupon.usedTime
      );
      expiredCoupons.value = userCoupons.filter(
        (coupon) => coupon.status === "expired" || coupon.endTime && new Date(coupon.endTime) < /* @__PURE__ */ new Date()
      );
      common_vendor.index.__f__("log", "at pages/coupons/coupons.vue:451", "有效优惠券:", validCoupons.value);
    };
    const switchTab = (index) => {
      currentTab.value = index;
    };
    const swiperChange = (e) => {
      currentTab.value = e.detail.current;
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
      if (typeof type === "object") {
        if (type.couponTemplate) {
          type = type.couponTemplate.type;
        } else {
          type = type.type;
        }
      }
      switch (type) {
        case utils_couponModel.COUPON_TYPES.DISCOUNT:
        case "discount":
          return "discount-coupon";
        case utils_couponModel.COUPON_TYPES.CASH:
        case "cash":
          return "cash-coupon";
        case utils_couponModel.COUPON_TYPES.FREE:
        case "free":
          return "free-coupon";
        case utils_couponModel.COUPON_TYPES.SPECIAL_PRICE:
        case "specialPrice":
          return "special-coupon";
        case utils_couponModel.COUPON_TYPES.SHIPPING:
        case "shipping":
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
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t;
          return common_vendor.e({
            a: (((_a = coupon.couponTemplate) == null ? void 0 : _a.type) || coupon.type) === "discount"
          }, (((_b = coupon.couponTemplate) == null ? void 0 : _b.type) || coupon.type) === "discount" ? {
            b: common_vendor.t(((_c = coupon.couponTemplate) == null ? void 0 : _c.value) || coupon.value)
          } : (((_d = coupon.couponTemplate) == null ? void 0 : _d.type) || coupon.type) === "cash" ? {
            d: common_vendor.t(((_e = coupon.couponTemplate) == null ? void 0 : _e.value) || coupon.value)
          } : (((_f = coupon.couponTemplate) == null ? void 0 : _f.type) || coupon.type) === "free" ? {} : (((_g = coupon.couponTemplate) == null ? void 0 : _g.type) || coupon.type) === "specialPrice" ? {
            g: common_vendor.t(((_h = coupon.couponTemplate) == null ? void 0 : _h.value) || coupon.value)
          } : (((_i = coupon.couponTemplate) == null ? void 0 : _i.type) || coupon.type) === "shipping" ? {} : {}, {
            c: (((_j = coupon.couponTemplate) == null ? void 0 : _j.type) || coupon.type) === "cash",
            e: (((_k = coupon.couponTemplate) == null ? void 0 : _k.type) || coupon.type) === "free",
            f: (((_l = coupon.couponTemplate) == null ? void 0 : _l.type) || coupon.type) === "specialPrice",
            h: (((_m = coupon.couponTemplate) == null ? void 0 : _m.type) || coupon.type) === "shipping",
            i: (((_n = coupon.couponTemplate) == null ? void 0 : _n.minOrderAmount) || coupon.minOrderAmount) > 0
          }, (((_o = coupon.couponTemplate) == null ? void 0 : _o.minOrderAmount) || coupon.minOrderAmount) > 0 ? {
            j: common_vendor.t(((_p = coupon.couponTemplate) == null ? void 0 : _p.minOrderAmount) || coupon.minOrderAmount)
          } : {}, {
            k: common_vendor.t(((_q = coupon.couponTemplate) == null ? void 0 : _q.title) || coupon.title),
            l: common_vendor.t(((_r = coupon.couponTemplate) == null ? void 0 : _r.description) || coupon.description),
            m: common_vendor.t(formatDate(((_s = coupon.couponTemplate) == null ? void 0 : _s.startTime) || coupon.startTime)),
            n: common_vendor.t(formatDate(((_t = coupon.couponTemplate) == null ? void 0 : _t.endTime) || coupon.endTime)),
            o: common_vendor.o(($event) => useCouponClick(), coupon.id),
            p: coupon.id,
            q: common_vendor.n(getCouponColorClass(coupon))
          });
        }),
        c: validCoupons.value.length === 0
      }, validCoupons.value.length === 0 ? {
        d: common_assets._imports_2$3
      } : {}, {
        e: common_vendor.f(usedCoupons.value, (coupon, k0, i0) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
          return common_vendor.e({
            a: (((_a = coupon.couponTemplate) == null ? void 0 : _a.type) || coupon.type) === "discount"
          }, (((_b = coupon.couponTemplate) == null ? void 0 : _b.type) || coupon.type) === "discount" ? {
            b: common_vendor.t(((_c = coupon.couponTemplate) == null ? void 0 : _c.value) || coupon.value)
          } : (((_d = coupon.couponTemplate) == null ? void 0 : _d.type) || coupon.type) === "cash" ? {
            d: common_vendor.t(((_e = coupon.couponTemplate) == null ? void 0 : _e.value) || coupon.value)
          } : (((_f = coupon.couponTemplate) == null ? void 0 : _f.type) || coupon.type) === "free" ? {} : (((_g = coupon.couponTemplate) == null ? void 0 : _g.type) || coupon.type) === "specialPrice" ? {
            g: common_vendor.t(((_h = coupon.couponTemplate) == null ? void 0 : _h.value) || coupon.value)
          } : (((_i = coupon.couponTemplate) == null ? void 0 : _i.type) || coupon.type) === "shipping" ? {} : {}, {
            c: (((_j = coupon.couponTemplate) == null ? void 0 : _j.type) || coupon.type) === "cash",
            e: (((_k = coupon.couponTemplate) == null ? void 0 : _k.type) || coupon.type) === "free",
            f: (((_l = coupon.couponTemplate) == null ? void 0 : _l.type) || coupon.type) === "specialPrice",
            h: (((_m = coupon.couponTemplate) == null ? void 0 : _m.type) || coupon.type) === "shipping",
            i: (((_n = coupon.couponTemplate) == null ? void 0 : _n.minOrderAmount) || coupon.minOrderAmount) > 0
          }, (((_o = coupon.couponTemplate) == null ? void 0 : _o.minOrderAmount) || coupon.minOrderAmount) > 0 ? {
            j: common_vendor.t(((_p = coupon.couponTemplate) == null ? void 0 : _p.minOrderAmount) || coupon.minOrderAmount)
          } : {}, {
            k: common_vendor.t(((_q = coupon.couponTemplate) == null ? void 0 : _q.title) || coupon.title),
            l: common_vendor.t(((_r = coupon.couponTemplate) == null ? void 0 : _r.description) || coupon.description),
            m: common_vendor.t(formatDate(coupon.usedTime)),
            n: coupon.id
          });
        }),
        f: usedCoupons.value.length === 0
      }, usedCoupons.value.length === 0 ? {
        g: common_assets._imports_2$3
      } : {}, {
        h: common_vendor.f(expiredCoupons.value, (coupon, k0, i0) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r;
          return common_vendor.e({
            a: (((_a = coupon.couponTemplate) == null ? void 0 : _a.type) || coupon.type) === "discount"
          }, (((_b = coupon.couponTemplate) == null ? void 0 : _b.type) || coupon.type) === "discount" ? {
            b: common_vendor.t(((_c = coupon.couponTemplate) == null ? void 0 : _c.value) || coupon.value)
          } : (((_d = coupon.couponTemplate) == null ? void 0 : _d.type) || coupon.type) === "cash" ? {
            d: common_vendor.t(((_e = coupon.couponTemplate) == null ? void 0 : _e.value) || coupon.value)
          } : (((_f = coupon.couponTemplate) == null ? void 0 : _f.type) || coupon.type) === "free" ? {} : (((_g = coupon.couponTemplate) == null ? void 0 : _g.type) || coupon.type) === "specialPrice" ? {
            g: common_vendor.t(((_h = coupon.couponTemplate) == null ? void 0 : _h.value) || coupon.value)
          } : (((_i = coupon.couponTemplate) == null ? void 0 : _i.type) || coupon.type) === "shipping" ? {} : {}, {
            c: (((_j = coupon.couponTemplate) == null ? void 0 : _j.type) || coupon.type) === "cash",
            e: (((_k = coupon.couponTemplate) == null ? void 0 : _k.type) || coupon.type) === "free",
            f: (((_l = coupon.couponTemplate) == null ? void 0 : _l.type) || coupon.type) === "specialPrice",
            h: (((_m = coupon.couponTemplate) == null ? void 0 : _m.type) || coupon.type) === "shipping",
            i: (((_n = coupon.couponTemplate) == null ? void 0 : _n.minOrderAmount) || coupon.minOrderAmount) > 0
          }, (((_o = coupon.couponTemplate) == null ? void 0 : _o.minOrderAmount) || coupon.minOrderAmount) > 0 ? {
            j: common_vendor.t(((_p = coupon.couponTemplate) == null ? void 0 : _p.minOrderAmount) || coupon.minOrderAmount)
          } : {}, {
            k: common_vendor.t(((_q = coupon.couponTemplate) == null ? void 0 : _q.title) || coupon.title),
            l: common_vendor.t(((_r = coupon.couponTemplate) == null ? void 0 : _r.description) || coupon.description),
            m: common_vendor.t(formatDate(coupon.endTime)),
            n: coupon.id
          });
        }),
        i: expiredCoupons.value.length === 0
      }, expiredCoupons.value.length === 0 ? {
        j: common_assets._imports_2$3
      } : {}, {
        k: currentTab.value,
        l: common_vendor.o(swiperChange)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-8d9323cd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/coupons/coupons.js.map
