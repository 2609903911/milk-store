"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const utils_userData = require("../../utils/userData.js");
const utils_couponModel = require("../../utils/couponModel.js");
const utils_request = require("../../utils/request.js");
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
    const tabs = common_vendor.ref(["人气兑换", "折扣券", "满减券", "免费券", "点亮星"]);
    const currentTab = common_vendor.ref(0);
    const couponList = common_vendor.ref([]);
    const showSuccessPopup = common_vendor.ref(false);
    const exchangedCoupon = common_vendor.ref(null);
    const isExchanging = common_vendor.ref(false);
    const allCoupons = common_vendor.reactive([]);
    common_vendor.onMounted(() => {
      utils_userData.initUserData();
      fetchStoreProducts();
    });
    const fetchStoreProducts = () => {
      return new Promise((resolve) => {
        utils_request.get(
          "/api/store/home",
          {},
          {
            loading: true,
            loadingText: "加载中"
          }
        ).then((res) => {
          common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:285", "==== 检查后端返回的商品数据 ====");
          common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:286", "整个响应:", res);
          if (res.data && res.data.data) {
            const responseData = res.data.data;
            common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:291", "商品数据:", responseData.allProducts);
            if (responseData.allProducts && responseData.allProducts.length > 0) {
              const firstProduct = responseData.allProducts[0];
              common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:299", "第一个商品详情:", firstProduct);
              common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:300", "id类型:", typeof firstProduct.id);
              common_vendor.index.__f__(
                "log",
                "at pages/panda-store/panda-store.vue:301",
                "couponTemplateId类型:",
                typeof firstProduct.couponTemplateId
              );
              common_vendor.index.__f__(
                "log",
                "at pages/panda-store/panda-store.vue:305",
                "couponTemplateId值:",
                firstProduct.couponTemplateId
              );
              allCoupons.splice(
                0,
                allCoupons.length,
                ...responseData.allProducts
              );
              updateCouponList();
            } else {
              common_vendor.index.showToast({
                title: "暂无商品数据",
                icon: "none"
              });
            }
          } else {
            common_vendor.index.__f__("error", "at pages/panda-store/panda-store.vue:326", "响应数据格式不正确:", res);
            common_vendor.index.showToast({
              title: "数据格式错误",
              icon: "none"
            });
          }
        }).catch((err) => {
          common_vendor.index.__f__("error", "at pages/panda-store/panda-store.vue:334", "获取商城商品失败:", err);
        }).finally(() => {
          resolve();
        });
      });
    };
    const updateCouponList = () => {
      if (currentTab.value === 0) {
        couponList.value = allCoupons;
      } else {
        const categoryMap = ["", "discount", "cash", "free", "lightStar"];
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
          return "lightstar-coupon";
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
    const exchangeCoupon = (coupon, amount = 1) => {
      if (isExchanging.value) {
        return;
      }
      isExchanging.value = true;
      common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:410", "===== 兑换优惠券的详细数据 =====");
      common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:411", "优惠券完整数据:", coupon);
      common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:412", "id类型:", typeof coupon.id, "值:", coupon.id);
      common_vendor.index.__f__(
        "log",
        "at pages/panda-store/panda-store.vue:413",
        "couponTemplateId类型:",
        typeof coupon.couponTemplateId,
        "值:",
        coupon.couponTemplateId
      );
      common_vendor.index.__f__(
        "log",
        "at pages/panda-store/panda-store.vue:419",
        "coinsCost类型:",
        typeof coupon.coinsCost,
        "值:",
        coupon.coinsCost
      );
      if (utils_userData.userData.pandaCoins < coupon.coinsCost) {
        common_vendor.index.showToast({
          title: "熊猫币不足",
          icon: "none"
        });
        isExchanging.value = false;
        return;
      }
      common_vendor.index.showLoading({
        title: "兑换中..."
      });
      const purchaseData = {
        userId: utils_userData.userData.userId,
        productId: coupon.id,
        couponTemplateId: Number(coupon.couponTemplateId),
        // 确保是数字类型
        coinsSpent: coupon.coinsCost
      };
      common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:449", "准备发送的购买数据:", purchaseData);
      common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:450", "JSON数据:", JSON.stringify(purchaseData));
      utils_request.post("/api/transactions/coupon", purchaseData, {
        showError: false,
        headers: {
          "Content-Type": "application/json"
        }
      }).then((res) => {
        var _a;
        common_vendor.index.__f__("log", "at pages/panda-store/panda-store.vue:460", "购买响应:", res);
        if (res.data && res.data.success) {
          utils_userData.userData.pandaCoins -= coupon.coinsCost;
          utils_userState.updateUserState({
            pandaCoins: utils_userData.userData.pandaCoins
          });
          exchangedCoupon.value = coupon;
          showSuccessPopup.value = true;
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: "兑换成功！",
            icon: "success"
          });
        } else {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({
            title: ((_a = res.data) == null ? void 0 : _a.message) || "兑换失败",
            icon: "none"
          });
        }
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/panda-store/panda-store.vue:491", "优惠券购买异常:", err);
        common_vendor.index.__f__(
          "log",
          "at pages/panda-store/panda-store.vue:492",
          "错误详情:",
          err.response ? err.response.data : "无响应数据"
        );
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: (err == null ? void 0 : err.message) || "兑换失败",
          icon: "none"
        });
      }).finally(() => {
        isExchanging.value = false;
      });
    };
    const closeSuccessPopup = () => {
      showSuccessPopup.value = false;
    };
    const navigateToCoupons = () => {
      var _a;
      showSuccessPopup.value = false;
      if (((_a = exchangedCoupon.value) == null ? void 0 : _a.category) === "lightStar") {
        common_vendor.index.navigateTo({
          url: "/pages/order-medal/order-medal"
        });
      } else {
        common_vendor.index.navigateTo({
          url: "/pages/coupons/coupons"
        });
      }
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: common_vendor.p({
          type: "left",
          size: "24"
        }),
        b: common_vendor.o(goBack),
        c: common_assets._imports_0$8,
        d: common_vendor.o((...args) => _ctx.showEarnCoinsPopup && _ctx.showEarnCoinsPopup(...args)),
        e: common_assets._imports_1$3,
        f: common_vendor.t(common_vendor.unref(utils_userData.userData).pandaCoins),
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
            p: common_vendor.t(common_vendor.unref(utils_userData.userData).pandaCoins < coupon.coinsCost ? "熊猫币不足" : "立即兑换"),
            q: common_vendor.o(($event) => exchangeCoupon(coupon), index),
            r: common_vendor.unref(utils_userData.userData).pandaCoins < coupon.coinsCost,
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
        n: common_vendor.t(((_a = exchangedCoupon.value) == null ? void 0 : _a.category) === "lightStar" ? "点亮星已添加到您的账户" : "优惠券已添加到您的账户"),
        o: common_vendor.t(((_b = exchangedCoupon.value) == null ? void 0 : _b.category) === "lightStar" ? "查看我的徽章" : "查看我的优惠券"),
        p: common_vendor.o(navigateToCoupons),
        q: common_vendor.o(closeSuccessPopup),
        r: common_vendor.o(() => {
        }),
        s: common_vendor.o(closeSuccessPopup)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-21c67e85"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/panda-store/panda-store.js.map
