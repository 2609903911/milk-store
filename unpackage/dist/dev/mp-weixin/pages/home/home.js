"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const _sfc_main = {
  __name: "home",
  setup(__props) {
    const currentSwiper = common_vendor.ref(0);
    const bannerList = common_vendor.ref([
      {
        tag: "超级蔬食 轻畅系列焕新",
        title: ["早畅晚轻", "24h轻畅循环"],
        desc: ["鲜果每日鲜榨", "一杯轻启肠道SPA"],
        image: "/static/images/scroll01.png",
        bgColor: "#8a9a5b"
        // 橄榄绿色背景
      },
      {
        tag: "桑葚系列",
        title: ["三重花青素", "自然好气色"],
        desc: ["爆款回归 一年卖出一千万杯！", "三重莓果 唤醒春日好气色"],
        image: "/static/images/scroll02.jpg",
        bgColor: "#e6f7ff"
        // 浅蓝色背景
      },
      {
        tag: "人气推荐",
        title: ["生椰系列", "醇香浓郁"],
        desc: ["精选海南生椰乳", "口感香浓醇厚"],
        image: "/static/images/scroll03.jpg",
        bgColor: "#f9e7d2"
        // 浅橙色背景
      },
      {
        tag: "季节限定",
        title: ["多肉葡萄", "果肉满满"],
        desc: ["精选当季葡萄", "多重口感层次"],
        image: "/static/images/scroll04.jpg",
        bgColor: "#e6d7f2"
        // 浅紫色背景
      }
    ]);
    const swiperChange = (e) => {
      currentSwiper.value = e.detail.current;
    };
    const navigateToOrder = () => {
      common_vendor.index.switchTab({
        url: "/pages/order/order"
      });
    };
    const navigateToCoupons = () => {
      common_vendor.index.navigateTo({
        url: "/pages/coupons/coupons"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(bannerList.value, (item, index, i0) => {
          return {
            a: index,
            b: item.image,
            c: currentSwiper.value === index ? 1 : 0,
            d: item.bgColor
          };
        }),
        b: common_vendor.f(bannerList.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item.tag),
            b: common_vendor.f(item.title, (line, idx, i1) => {
              return {
                a: common_vendor.t(line),
                b: idx
              };
            }),
            c: common_vendor.f(item.desc, (line, idx, i1) => {
              return {
                a: common_vendor.t(line),
                b: idx
              };
            }),
            d: common_vendor.o(navigateToOrder, index),
            e: index
          };
        }),
        c: common_vendor.o(swiperChange),
        d: common_vendor.o(navigateToOrder),
        e: common_vendor.f(bannerList.value, (item, index, i0) => {
          return {
            a: index,
            b: currentSwiper.value === index ? 1 : ""
          };
        }),
        f: common_vendor.unref(utils_userState.userState).avatar,
        g: common_vendor.t(common_vendor.unref(utils_userState.userState).nickname),
        h: common_vendor.t(common_vendor.unref(utils_userState.userState).coupons ? common_vendor.unref(utils_userState.userState).coupons.length : 0),
        i: common_vendor.o(navigateToCoupons),
        j: common_assets._imports_0$1,
        k: common_vendor.o(navigateToOrder),
        l: common_assets._imports_1,
        m: common_assets._imports_2,
        n: common_assets._imports_3,
        o: common_assets._imports_4,
        p: common_assets._imports_5,
        q: common_assets._imports_6,
        r: common_assets._imports_7
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
