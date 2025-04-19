"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_couponModel = require("../../utils/couponModel.js");
const utils_userData = require("../../utils/userData.js");
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
      common_vendor.index.__f__("log", "at pages/components/coupon-select.vue:177", "原始优惠券数据:", JSON.stringify(utils_userData.userData.coupons, null, 2));
      return utils_userData.userData.coupons.filter((coupon) => {
        if (!coupon.couponTemplate) {
          return false;
        }
        const isValid = coupon.status === "valid" || coupon.status === "unused";
        const now = Date.now();
        const endTime = coupon.couponTemplate.endTime;
        const isNotExpired = endTime ? now < new Date(endTime).getTime() : true;
        const minAmount = coupon.couponTemplate.minOrderAmount || 0;
        const meetsAmount = props.orderAmount >= minAmount;
        let hasMatchingProduct = true;
        if (coupon.couponTemplate.type === "specialPrice" && coupon.couponTemplate.scope === "product" && coupon.couponTemplate.scopeIds && coupon.couponTemplate.scopeIds.length > 0) {
          hasMatchingProduct = props.orderItems.some(
            (item) => coupon.couponTemplate.scopeIds.includes(item.id)
          );
        }
        return isValid && isNotExpired && meetsAmount && hasMatchingProduct;
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
      common_vendor.index.__f__("log", "at pages/components/coupon-select.vue:235", "格式化日期输入值:", timestamp, typeof timestamp);
      if (!timestamp)
        return "未设置日期";
      try {
        const date = new Date(timestamp);
        if (isNaN(date.getTime())) {
          common_vendor.index.__f__("log", "at pages/components/coupon-select.vue:243", "无效日期:", timestamp);
          return "无效日期";
        }
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/components/coupon-select.vue:252", "日期格式化错误:", error);
        return "日期错误";
      }
    };
    const selectCoupon = (coupon) => {
      selectedCoupon.value = coupon;
    };
    const confirmSelect = () => {
      if (selectedCoupon.value) {
        const couponData = {
          id: selectedCoupon.value.id,
          title: selectedCoupon.value.couponTemplate.title,
          type: selectedCoupon.value.couponTemplate.type,
          value: selectedCoupon.value.couponTemplate.value,
          minOrderAmount: selectedCoupon.value.couponTemplate.minOrderAmount,
          scopeIds: selectedCoupon.value.couponTemplate.scope === "product" ? selectedCoupon.value.couponTemplate.scopeIds : null
        };
        emit("select", couponData);
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
            a: coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT
          }, coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).DISCOUNT ? {
            b: common_vendor.t(coupon.couponTemplate.value)
          } : coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH ? {
            d: common_vendor.t(coupon.couponTemplate.value)
          } : coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE ? {} : coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE ? {
            g: common_vendor.t(coupon.couponTemplate.value)
          } : coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING ? {} : {}, {
            c: coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).CASH,
            e: coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).FREE,
            f: coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SPECIAL_PRICE,
            h: coupon.couponTemplate.type === common_vendor.unref(utils_couponModel.COUPON_TYPES).SHIPPING,
            i: coupon.couponTemplate.minOrderAmount > 0
          }, coupon.couponTemplate.minOrderAmount > 0 ? {
            j: common_vendor.t(coupon.couponTemplate.minOrderAmount)
          } : {}, {
            k: common_vendor.t(coupon.couponTemplate.title),
            l: common_vendor.t(coupon.couponTemplate.description),
            m: common_vendor.t(formatDate(coupon.couponTemplate.endTime)),
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
            r: common_vendor.n(getCouponColorClass(coupon.couponTemplate.type)),
            s: common_vendor.n({
              selected: ((_c = selectedCoupon.value) == null ? void 0 : _c.id) === coupon.id
            }),
            t: common_vendor.o(($event) => selectCoupon(coupon), index)
          });
        }),
        e: availableCoupons.value.length === 0
      }, availableCoupons.value.length === 0 ? {
        f: common_assets._imports_0$13
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
