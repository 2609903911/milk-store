"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_uniUtils = require("../../utils/uniUtils.js");
const utils_userData = require("../../utils/userData.js");
const utils_api_productApi = require("../../utils/api/productApi.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "together-drink",
  setup(__props) {
    const state = common_vendor.ref("initial");
    const product = common_vendor.ref({
      id: 1,
      name: "奶茶双人套餐",
      description: "两杯奶茶，一份甜蜜",
      price: 39.9,
      imageUrl: "/static/images/default-product.png"
    });
    const totalPrice = common_vendor.computed(() => {
      return product.value.price;
    });
    const userInfo = common_vendor.computed(() => {
      return {
        id: utils_userData.userData.userId,
        nickname: utils_userData.userData.nickname,
        avatar: utils_userData.userData.avatar
      };
    });
    const partnerInfo = common_vendor.ref({
      id: "",
      nickname: "",
      avatar: ""
    });
    const inviteCode = common_vendor.ref("");
    const inputCode = common_vendor.ref("");
    const countdown = common_vendor.ref(600);
    const countdownTimer = common_vendor.ref(null);
    const fetchProductInfo = async (productId = 1) => {
      try {
        utils_uniUtils.toast("加载商品信息...", "loading");
        const productData = await utils_api_productApi.fetchProductById(productId);
        if (productData) {
          product.value = {
            id: productData.id,
            name: productData.name,
            description: productData.description || "特选双人奶茶套餐",
            price: productData.price,
            imageUrl: productData.imageUrl || "/static/images/default-product.png"
          };
          utils_uniUtils.toast("商品信息加载成功", "success", 500);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/together-drink/together-drink.vue:233", "获取商品信息失败:", error);
        utils_uniUtils.toast("获取商品信息失败，使用默认商品", "none", 2e3);
      }
    };
    const formatCountdown = common_vendor.computed(() => {
      const minutes = Math.floor(countdown.value / 60);
      const seconds = countdown.value % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    });
    const generateInviteCode = () => {
      if (!utils_userData.userData.userId) {
        utils_uniUtils.toast("请先登录后再创建邀请", "none", 2e3);
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return;
      }
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let result = "";
      for (let i = 0; i < 8; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      inviteCode.value = result;
      state.value = "waiting";
      startCountdown();
      utils_uniUtils.toast("邀请已创建，请分享邀请码给好友");
    };
    const startCountdown = () => {
      countdownTimer.value = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;
        } else {
          clearInterval(countdownTimer.value);
          if (state.value === "waiting") {
            state.value = "initial";
            utils_uniUtils.toast("邀请已过期");
          }
        }
      }, 1e3);
    };
    const formatInviteCode = () => {
      inputCode.value = inputCode.value.toUpperCase();
    };
    const joinByCode = () => {
      if (inputCode.value.length < 8) {
        utils_uniUtils.toast("请输入完整的邀请码");
        return;
      }
      if (!utils_userData.userData.userId) {
        utils_uniUtils.toast("请先登录后再加入邀请", "none", 2e3);
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return;
      }
      utils_uniUtils.toast("正在验证邀请码...", "loading");
      setTimeout(() => {
        state.value = "joined";
        partnerInfo.value = {
          id: "creator123",
          nickname: "奶茶达人",
          avatar: "/static/images/avatar-default.png"
        };
        setTimeout(() => {
          state.value = "ready";
        }, 2e3);
        utils_uniUtils.toast("成功加入邀请", "success");
      }, 1e3);
    };
    const copyInviteCode = () => {
      common_vendor.index.setClipboardData({
        data: inviteCode.value,
        success: () => {
          utils_uniUtils.toast("邀请码已复制");
        }
      });
    };
    const cancelInvite = () => {
      state.value = "initial";
      inviteCode.value = "";
      clearInterval(countdownTimer.value);
      countdown.value = 600;
      utils_uniUtils.toast("邀请已取消");
    };
    const payOrder = () => {
      utils_uniUtils.toast("正在处理支付...", "loading");
      if (!utils_userData.userData.userId) {
        utils_uniUtils.toast("请先登录后再支付", "none", 2e3);
        setTimeout(() => {
          common_vendor.index.navigateTo({
            url: "/pages/login/login"
          });
        }, 1500);
        return;
      }
      setTimeout(() => {
        utils_uniUtils.toast("支付成功，订单已创建", "success");
        setTimeout(() => {
          const orderId = "TD" + Date.now();
          common_vendor.index.navigateTo({
            url: `/pages/order-detail/order-detail?id=${orderId}`
          });
        }, 1500);
      }, 2e3);
    };
    common_vendor.onMounted(() => {
      utils_userData.initUserData();
      common_vendor.index.__f__("log", "at pages/together-drink/together-drink.vue:397", "用户数据:", utils_userData.userData);
      fetchProductInfo(1);
    });
    common_vendor.onUnmounted(() => {
      if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: product.value.imageUrl,
        b: common_vendor.t(product.value.name),
        c: common_vendor.t(product.value.description),
        d: common_vendor.t(product.value.price),
        e: userInfo.value.avatar || "/static/images/avatar.png",
        f: common_vendor.t(userInfo.value.nickname || "我"),
        g: state.value === "joined" || state.value === "ready"
      }, state.value === "joined" || state.value === "ready" ? {
        h: partnerInfo.value.avatar || "/static/images/avatar.png",
        i: common_vendor.t(partnerInfo.value.nickname || "好友")
      } : {}, {
        j: state.value === "waiting" || state.value === "initial"
      }, state.value === "waiting" || state.value === "initial" ? {
        k: common_vendor.p({
          type: "contact",
          size: "30",
          color: "#CCCCCC"
        })
      } : {}, {
        l: state.value === "initial"
      }, state.value === "initial" ? {
        m: common_vendor.o(generateInviteCode),
        n: common_vendor.o([($event) => inputCode.value = $event.detail.value, formatInviteCode]),
        o: inputCode.value,
        p: common_vendor.o(joinByCode),
        q: !inputCode.value || inputCode.value.length < 8
      } : {}, {
        r: state.value === "waiting"
      }, state.value === "waiting" ? {
        s: common_vendor.t(inviteCode.value),
        t: common_vendor.o(copyInviteCode),
        v: common_vendor.t(formatCountdown.value),
        w: common_vendor.o(cancelInvite)
      } : {}, {
        x: state.value === "joined"
      }, state.value === "joined" ? {
        y: common_vendor.p({
          type: "checkbox-filled",
          size: "24",
          color: "#07c160"
        }),
        z: common_vendor.t(partnerInfo.value.nickname)
      } : {}, {
        A: state.value === "ready"
      }, state.value === "ready" ? {
        B: common_vendor.t(totalPrice.value),
        C: common_vendor.o(payOrder)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/together-drink/together-drink.js.map
