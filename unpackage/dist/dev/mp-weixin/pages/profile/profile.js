"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userData = require("../../utils/userData.js");
require("../../utils/userState.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    common_vendor.ref("我的");
    common_vendor.onMounted(() => {
      utils_userData.initUserData();
    });
    const openMedalWall = () => {
      common_vendor.index.navigateTo({
        url: "/pages/order-medal/order-medal"
      });
    };
    const goToMall = () => {
      common_vendor.index.navigateTo({
        url: "/pages/panda-store/panda-store"
      });
    };
    const navigateToCoupons = () => {
      common_vendor.index.navigateTo({
        url: "/pages/coupons/coupons"
      });
    };
    const navigateToPandaStore = () => {
      common_vendor.index.navigateTo({
        url: "/pages/panda-store/panda-store"
      });
    };
    const serviceItems = common_vendor.reactive([
      { name: "团餐", icon: "../../static/images/service/group.png" },
      { name: "礼品卡", icon: "../../static/images/service/gift-card.png" },
      { name: "礼券兑换", icon: "../../static/images/service/certificate.png" },
      {
        name: "我的徽章",
        icon: "../../static/images/service/medal.png",
        action: "medal"
      },
      {
        name: "熊猫币商城",
        icon: "../../static/images/service/store.png",
        action: "pandaStore"
      },
      { name: "加盟申请", icon: "../../static/images/service/franchise.png" },
      { name: "联系客服", icon: "../../static/images/service/contact.png" },
      {
        name: "个人资料",
        icon: "../../static/images/service/profile.png",
        action: "editProfile"
      },
      { name: "抽奖公示", icon: "../../static/images/service/prize.png" }
    ]);
    const handleServiceClick = (serviceName) => {
      const item = serviceItems.find((item2) => item2.name === serviceName);
      if (item && item.action === "editProfile") {
        common_vendor.index.navigateTo({
          url: "/pages/personal-data/personal-data"
        });
        return;
      }
      if (item && item.action === "medal") {
        common_vendor.index.navigateTo({
          url: "/pages/order-medal/order-medal"
        });
        return;
      }
      if (item && item.action === "pandaStore") {
        common_vendor.index.navigateTo({
          url: "/pages/panda-store/panda-store"
        });
        return;
      }
      common_vendor.index.showToast({
        title: `您点击了${serviceName}`,
        icon: "none"
      });
    };
    const handleAvatarError = () => {
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$4,
        b: common_vendor.unref(utils_userData.userData).avatar || "/static/images/avatar.png",
        c: common_vendor.o(handleAvatarError),
        d: common_vendor.t(common_vendor.unref(utils_userData.userData).nickname),
        e: common_assets._imports_1$1,
        f: common_vendor.o(openMedalWall),
        g: common_vendor.t(common_vendor.unref(utils_userData.userData).pandaCoins),
        h: common_vendor.o(navigateToPandaStore),
        i: common_vendor.t(common_vendor.unref(utils_userData.userData).coupons ? common_vendor.unref(utils_userData.userData).coupons.length : 0),
        j: common_vendor.o(navigateToCoupons),
        k: common_assets._imports_2$1,
        l: common_vendor.o(goToMall),
        m: common_assets._imports_3$1,
        n: common_assets._imports_4$1,
        o: common_assets._imports_5$1,
        p: common_assets._imports_6$1,
        q: common_vendor.f(serviceItems, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: index,
            d: common_vendor.o(($event) => handleServiceClick(item.name), index)
          };
        }),
        r: serviceItems.length % 4 !== 0
      }, serviceItems.length % 4 !== 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
