"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_productData = require("../../utils/productData.js");
if (!Array) {
  const _easycom_uni_icons2 = common_vendor.resolveComponent("uni-icons");
  _easycom_uni_icons2();
}
const _easycom_uni_icons = () => "../../uni_modules/uni-icons/components/uni-icons/uni-icons.js";
if (!Math) {
  _easycom_uni_icons();
}
const _sfc_main = {
  __name: "search",
  setup(__props) {
    const searchText = common_vendor.ref("");
    const searchHistory = common_vendor.ref([]);
    const searchResults = common_vendor.ref([]);
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const handleSearch = () => {
      if (!searchText.value.trim())
        return;
      if (!searchHistory.value.includes(searchText.value)) {
        searchHistory.value.unshift(searchText.value);
        if (searchHistory.value.length > 10) {
          searchHistory.value.pop();
        }
        common_vendor.index.setStorageSync("searchHistory", searchHistory.value);
      }
      searchResults.value = utils_productData.searchProducts(searchText.value);
    };
    const clearHistory = () => {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清空搜索历史吗？",
        success: (res) => {
          if (res.confirm) {
            searchHistory.value = [];
            common_vendor.index.removeStorageSync("searchHistory");
          }
        }
      });
    };
    const handleHistoryClick = (keyword) => {
      searchText.value = keyword;
      handleSearch();
    };
    const viewProductDetail = (product) => {
      common_vendor.index.showToast({
        title: `您选择了${product.name}`,
        icon: "none"
      });
    };
    common_vendor.onMounted(() => {
      const history = common_vendor.index.getStorageSync("searchHistory");
      if (history) {
        searchHistory.value = history;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.p({
          type: "search",
          size: "18",
          color: "#999"
        }),
        b: common_vendor.o(handleSearch),
        c: searchText.value,
        d: common_vendor.o(($event) => searchText.value = $event.detail.value),
        e: common_vendor.o(goBack),
        f: !searchText.value && searchHistory.value.length > 0
      }, !searchText.value && searchHistory.value.length > 0 ? {
        g: common_vendor.o(clearHistory),
        h: common_vendor.f(searchHistory.value, (item, index, i0) => {
          return {
            a: common_vendor.t(item),
            b: index,
            c: common_vendor.o(($event) => handleHistoryClick(item), index)
          };
        })
      } : {}, {
        i: searchText.value
      }, searchText.value ? common_vendor.e({
        j: searchResults.value.length === 0
      }, searchResults.value.length === 0 ? {
        k: common_assets._imports_0$10
      } : {
        l: common_vendor.f(searchResults.value, (item, index, i0) => {
          return {
            a: item.image,
            b: common_vendor.t(item.name),
            c: common_vendor.t(item.category),
            d: common_vendor.t(item.desc),
            e: common_vendor.t(item.price),
            f: index,
            g: common_vendor.o(($event) => viewProductDetail(item), index)
          };
        })
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
