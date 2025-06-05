"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userData = require("../../utils/userData.js");
require("../../utils/userState.js");
const utils_api_bannerApi = require("../../utils/api/bannerApi.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "home",
  setup(__props) {
    common_vendor.onMounted(() => {
      utils_userData.initUserData();
      fetchBannerData();
    });
    common_vendor.onShow(() => {
      utils_userData.initUserData();
      fetchBannerData();
    });
    const currentSwiper = common_vendor.ref(0);
    const swiperChange = (e) => {
      currentSwiper.value = e.detail.current;
    };
    const bannerList = common_vendor.ref([]);
    const newsImages = common_vendor.ref([
      "/static/images/news1.png",
      "/static/images/news2.png",
      "/static/images/news3.gif",
      "/static/images/news4.png"
    ]);
    const fetchBannerData = async () => {
      try {
        const banners = await utils_api_bannerApi.fetchBanners();
        bannerList.value = banners;
      } catch (error) {
        loadLocalBannerData();
      }
    };
    const loadLocalBannerData = () => {
      bannerList.value = [
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
      ];
    };
    const handleAvatarError = () => {
      if (utils_userData.userData.avatar !== "/static/images/avatar.png") {
        utils_userData.userData.avatar = "/static/images/avatar.png";
      }
    };
    const navigateToCoupons = () => {
      common_vendor.index.navigateTo({
        url: "/pages/coupons/coupons"
      });
    };
    const navigateToOrder = () => {
      common_vendor.index.switchTab({
        url: "/pages/order/order"
      });
    };
    const navigateToPandaStore = () => {
      common_vendor.index.navigateTo({
        url: "/pages/panda-store/panda-store"
      });
    };
    const navigateToPost = () => {
      common_vendor.index.navigateTo({
        url: "/pages/post-profile/post-profile"
      });
    };
    const navigateToTogetherDrink = () => {
      common_vendor.index.navigateTo({
        url: "/pages/together-drink/together-drink"
      });
    };
    const navigateToAiChat = () => {
      common_vendor.index.navigateTo({
        url: "/pages/ai-chat/index"
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
            d: "07e72d3c-0-" + i0,
            e: common_vendor.o(navigateToOrder, index),
            f: index
          };
        }),
        c: common_vendor.p({
          type: "arrowright",
          size: "16",
          color: "#fff"
        }),
        d: common_vendor.o(swiperChange),
        e: common_vendor.o(navigateToOrder),
        f: common_vendor.f(bannerList.value, (item, index, i0) => {
          return {
            a: index,
            b: currentSwiper.value === index ? 1 : ""
          };
        }),
        g: common_vendor.unref(utils_userData.userData).avatar || "/static/images/avatar.png",
        h: common_vendor.o(handleAvatarError),
        i: common_vendor.t(common_vendor.unref(utils_userData.userData).nickname),
        j: common_vendor.t(common_vendor.unref(utils_userData.userData).coupons ? common_vendor.unref(utils_userData.userData).coupons.filter((coupon) => coupon.status === "valid").length : 0),
        k: common_vendor.o(navigateToCoupons),
        l: common_assets._imports_0$2,
        m: common_vendor.o(navigateToOrder),
        n: common_assets._imports_1,
        o: common_assets._imports_2,
        p: common_vendor.o(navigateToPandaStore),
        q: common_assets._imports_3,
        r: common_vendor.o(navigateToPost),
        s: common_assets._imports_4,
        t: common_vendor.o(navigateToTogetherDrink),
        v: common_assets._imports_5,
        w: common_vendor.o(navigateToAiChat),
        x: common_assets._imports_6,
        y: common_vendor.f(newsImages.value, (item, index, i0) => {
          return {
            a: item,
            b: index
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
