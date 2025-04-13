"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_userState = require("../../utils/userState.js");
const utils_api_bannerApi = require("../../utils/api/bannerApi.js");
const _sfc_main = {
  __name: "home",
  setup(__props) {
    common_vendor.index.__f__("log", "at pages/home/home.vue:262", utils_userState.userState);
    const currentSwiper = common_vendor.ref(0);
    const bannerList = common_vendor.ref([]);
    const fetchBannerData = async () => {
      try {
        const banners = await utils_api_bannerApi.fetchBanners();
        bannerList.value = banners;
        common_vendor.index.__f__("log", "at pages/home/home.vue:274", "轮播图数据获取成功:", bannerList.value);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/home.vue:276", "轮播图数据请求异常:", error);
        loadLocalBannerData();
      }
    };
    common_vendor.onMounted(() => {
      fetchBannerData();
    });
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
    const navigateToPandaStore = () => {
      common_vendor.index.navigateTo({
        url: "/pages/panda-store/panda-store"
      });
    };
    const handleAvatarError = () => {
      common_vendor.index.__f__("log", "at pages/home/home.vue:351", "头像加载失败，使用默认头像");
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
        f: common_vendor.unref(utils_userState.userState).avatar || "/static/images/avatar",
        g: common_vendor.o(handleAvatarError),
        h: common_vendor.t(common_vendor.unref(utils_userState.userState).nickname),
        i: common_vendor.t(common_vendor.unref(utils_userState.userState).coupons ? common_vendor.unref(utils_userState.userState).coupons.length : 0),
        j: common_vendor.o(navigateToCoupons),
        k: common_assets._imports_0$1,
        l: common_vendor.o(navigateToOrder),
        m: common_assets._imports_1,
        n: common_assets._imports_2,
        o: common_vendor.o(navigateToPandaStore),
        p: common_assets._imports_3,
        q: common_assets._imports_4,
        r: common_assets._imports_5,
        s: common_assets._imports_6,
        t: common_assets._imports_7
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-07e72d3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
