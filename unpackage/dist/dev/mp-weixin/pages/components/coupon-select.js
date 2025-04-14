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
  __name: "coupon-select",
  props: {
    show: {
      type: Boolean,
      default: false
    },
    orderAmount: {
      type: Number,
      default: 0
    },
    orderItems: {
      type: Array,
      default: () => []
    }
  },
  emits: ["update:show", "select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const selectedCoupon = common_vendor.ref(null);
    const availableCoupons = common_vendor.computed(() => {
      return utils_userState.userState.coupons.filter((coupon) => {
        const now = Date.now();
        const isExpired = now > coupon.endTime;
        const isUsed = coupon.status === "used";
        const isDeleted = coupon.isDeleted;
        const meetsAmount = props.orderAmount >= coupon.minOrderAmount;
        const basicConditions = !isExpired && !isUsed && !isDeleted && meetsAmount;
        if (!basicConditions)
          return false;
        if (coupon.type === "free") {
          return props.orderAmount <= coupon.value;
        }
        if (coupon.type === "specialPrice" && coupon.scopeIds && coupon.scopeIds.length > 0) {
          const hasMatchingProduct = props.orderItems.some(
            (item) => coupon.scopeIds.includes(item.id)
          );
          return hasMatchingProduct;
        }
        return true;
      });
    });
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
    const formatDate = (timestamp) => {
      const date = new Date(timestamp);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;
    };
    const selectCoupon = (coupon) => {
      selectedCoupon.value = coupon;
    };
    const confirmSelect = () => {
      if (selectedCoupon.value) {
        emit("select", selectedCoupon.value);
        close();
      }
    };
    const close = () => {
      selectedCoupon.value = null;
      emit("update:show", false);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: __props.show
      }, __props.show ? common_vendor.e({
        b: common_vendor.p({
          type: "close",
          size: "20"
        }),
        c: common_vendor.o(close),
        d: common_vendor.f(availableCoupons.value, (coupon, index, i0) => {
          var _a, _b, _c;
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
            n: ((_a = selectedCoupon.value) == null ? void 0 : _a.id) === coupon.id
          }, ((_b = selectedCoupon.value) == null ? void 0 : _b.id) === coupon.id ? {
            o: "e5e865b0-1-" + i0,
            p: common_vendor.p({
              type: "checkmarkempty",
              size: "24",
              color: "#fff"
            })
          } : {}, {
            q: index,
            r: common_vendor.n(getCouponColorClass(coupon.type)),
            s: common_vendor.n({
              selected: ((_c = selectedCoupon.value) == null ? void 0 : _c.id) === coupon.id
            }),
            t: common_vendor.o(($event) => selectCoupon(coupon), index)
          });
        }),
        e: availableCoupons.value.length === 0
      }, availableCoupons.value.length === 0 ? {
        f: common_assets._imports_0$12
      } : {}, {
        g: !selectedCoupon.value,
        h: common_vendor.o(confirmSelect),
        i: common_vendor.o(() => {
        }),
        j: common_vendor.o(close)
      }) : {});
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e5e865b0"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/components/coupon-select.js.map
