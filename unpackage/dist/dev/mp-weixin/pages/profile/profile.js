"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    common_vendor.ref("我的");
    const openMedalWall = () => {
      common_vendor.index.navigateTo({
        url: "/pages/order-medal/order-medal"
      });
    };
    const goToMall = () => {
      common_vendor.index.showToast({
        title: "正在前往熊猫币商城",
        icon: "none"
      });
    };
    const serviceItems = common_vendor.reactive([
      { name: "团餐", icon: "../../static/images/service/group.png" },
      { name: "礼品卡", icon: "../../static/images/service/gift-card.png" },
      { name: "礼券兑换", icon: "../../static/images/service/certificate.png" },
      { name: "我的徽章", icon: "../../static/images/service/medal.png" },
      { name: "熊猫币商城", icon: "../../static/images/service/store.png" },
      { name: "加盟申请", icon: "../../static/images/service/franchise.png" },
      { name: "联系客服", icon: "../../static/images/service/contact.png" },
      { name: "个人资料", icon: "../../static/images/service/profile.png" },
      { name: "抽奖公示", icon: "../../static/images/service/prize.png" }
    ]);
    const handleServiceClick = (serviceName) => {
      common_vendor.index.showToast({
        title: `您点击了${serviceName}`,
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$2,
        b: common_assets._imports_1,
        c: common_assets._imports_2$1,
        d: common_vendor.o(openMedalWall),
        e: common_assets._imports_3$1,
        f: common_vendor.o(goToMall),
        g: common_assets._imports_4$1,
        h: common_assets._imports_5$1,
        i: common_assets._imports_6$1,
        j: common_assets._imports_7$1,
        k: common_vendor.f(serviceItems, (item, index, i0) => {
          return {
            a: item.icon,
            b: common_vendor.t(item.name),
            c: index,
            d: common_vendor.o(($event) => handleServiceClick(item.name), index)
          };
        }),
        l: serviceItems.length % 4 !== 0
      }, serviceItems.length % 4 !== 0 ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
