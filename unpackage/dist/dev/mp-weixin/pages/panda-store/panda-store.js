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
    const tabs = common_vendor.ref(["人气兑换", "折扣券", "现金券", "免费券", "点亮星"]);
    const currentTab = common_vendor.ref(0);
    const couponList = common_vendor.ref([]);
    const showSuccessPopup = common_vendor.ref(false);
    const exchangedCoupon = common_vendor.ref(null);
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
          const data = res.data;
          if (data.allProducts && data.allProducts.length > 0) {
            allCoupons.splice(0, allCoupons.length, ...data.allProducts);
            updateCouponList();
          } else {
            common_vendor.index.showToast({
              title: "暂无商品数据",
              icon: "none"
            });
          }
        }).catch((err) => {
          common_vendor.index.__f__("error", "at pages/panda-store/panda-store.vue:303", "获取商城商品失败:", err);
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
    const exchangeCoupon = (coupon) => {
      if (utils_userData.userData.pandaCoins < coupon.coinsCost) {
        common_vendor.index.showToast({
          title: "熊猫币不足",
          icon: "none"
        });
        return;
      }
      const newCoins = utils_userData.userData.pandaCoins - coupon.coinsCost;
      let newCoupon;
      const now = Date.now();
      if (coupon.category === "lightStar") {
        const currentStars = utils_userData.userData.lightningStars || 0;
        const updatedUserInfo2 = {
          pandaCoins: newCoins,
          lightningStars: currentStars + coupon.value
        };
        utils_userData.userData.pandaCoins = newCoins;
        utils_userData.userData.lightningStars = currentStars + coupon.value;
        const success = utils_userState.updateUserState(updatedUserInfo2);
        if (success) {
          createTransaction(coupon, null, "lightstar", coupon.value);
          common_vendor.index.showToast({
            title: `获得${coupon.value}个点亮星`,
            icon: "success"
          });
          showSuccessPopup.value = true;
          exchangedCoupon.value = {
            title: coupon.title,
            description: coupon.description,
            value: coupon.value,
            category: "lightStar"
          };
        }
        return;
      }
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
      utils_userData.userData.pandaCoins = newCoins;
      if (!utils_userData.userData.coupons) {
        utils_userData.userData.coupons = [];
      }
      utils_userData.userData.coupons.push(newCoupon);
      const updatedUserInfo = {
        pandaCoins: newCoins,
        coupons: [...utils_userData.userData.coupons || [], newCoupon]
      };
      utils_userState.updateUserState(updatedUserInfo);
      createTransaction(coupon, newCoupon, "coupon", 1);
      exchangedCoupon.value = newCoupon;
      showSuccessPopup.value = true;
    };
    const createTransaction = (coupon, newCoupon, transactionType, amount) => {
      const transactionData = {
        userId: utils_userData.userData.userId,
        productId: coupon.id,
        transactionType,
        coinsSpent: coupon.coinsCost,
        quantity: 1,
        couponId: newCoupon ? newCoupon.id : null,
        lightstarAmount: transactionType === "lightstar" ? amount : null
      };
      utils_request.post("/api/transactions", transactionData, {
        showError: false
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/panda-store/panda-store.vue:524", "创建交易记录失败:", err);
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
