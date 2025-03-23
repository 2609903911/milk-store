"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    common_vendor.ref("我的");
    const openMedalWall = () => {
      common_vendor.index.showToast({
        title: "勋章墙功能即将上线",
        icon: "none"
      });
    };
    const goToMall = () => {
      common_vendor.index.showToast({
        title: "正在前往熊猫币商城",
        icon: "none"
      });
    };
    const handleServiceClick = (serviceName) => {
      common_vendor.index.showToast({
        title: `您点击了${serviceName}`,
        icon: "none"
      });
    };
    return (_ctx, _cache) => {
      return {
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
        k: common_assets._imports_8$1,
        l: common_vendor.o(($event) => handleServiceClick("团餐")),
        m: common_assets._imports_9,
        n: common_vendor.o(($event) => handleServiceClick("礼品卡")),
        o: common_assets._imports_10,
        p: common_vendor.o(($event) => handleServiceClick("礼券兑换")),
        q: common_assets._imports_11,
        r: common_vendor.o(($event) => handleServiceClick("我的邀请")),
        s: common_assets._imports_12,
        t: common_vendor.o(($event) => handleServiceClick("熊猫币商城")),
        v: common_assets._imports_13,
        w: common_vendor.o(($event) => handleServiceClick("加盟申请")),
        x: common_assets._imports_14,
        y: common_vendor.o(($event) => handleServiceClick("联系客服")),
        z: common_assets._imports_15,
        A: common_vendor.o(($event) => handleServiceClick("个人资料")),
        B: common_assets._imports_16,
        C: common_vendor.o(($event) => handleServiceClick("抽奖公示")),
        D: common_assets._imports_17,
        E: common_vendor.o(($event) => handleServiceClick("茶茶公益")),
        F: common_assets._imports_18,
        G: common_vendor.o(($event) => handleServiceClick("更多"))
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
